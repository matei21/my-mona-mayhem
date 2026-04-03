import type { APIRoute } from 'astro';

import {
	fetchGitHubContribs,
	validateGitHubUsername,
} from '../../../lib/server/githubContribProxy';
import { TTLCache } from '../../../lib/server/ttlCache';

export const prerender = false;

const SIX_HOURS_MS = 6 * 60 * 60 * 1000;
const STALE_GRACE_MS = 24 * 60 * 60 * 1000;

const contributionCache = new TTLCache<unknown>(SIX_HOURS_MS, STALE_GRACE_MS);

type CacheState = 'HIT' | 'MISS' | 'STALE';

function jsonResponse(body: unknown, status: number, headers?: HeadersInit): Response {
	return new Response(JSON.stringify(body), {
		status,
		headers: {
			'Content-Type': 'application/json; charset=utf-8',
			...headers,
		},
	});
}

function successResponse(username: string, data: unknown, cacheState: CacheState, stale: boolean): Response {
	return jsonResponse(
		{
			username,
			data,
			stale,
		},
		200,
		{
			'Cache-Control': 'public, max-age=3600, stale-while-revalidate=300',
			'X-Cache': cacheState,
			...(stale ? { Warning: '110 - Response is stale' } : {}),
		},
	);
}

/*
Internal verification checklist:
1) GET /api/contributions/octocat => 200 + X-Cache MISS then HIT.
2) Invalid usernames (-bad, bad-, bad name, >39 chars) => 400.
3) Missing users => 404.
4) Upstream timeout/outage => stale fallback (if present) else 503.
*/
export const GET: APIRoute = async ({ params }) => {
	const usernameValidation = validateGitHubUsername(params.username);
	if (!usernameValidation.ok) {
		return jsonResponse(
			{
				error: usernameValidation.error,
			},
			400,
			{
				'Cache-Control': 'no-store',
			},
		);
	}

	const username = usernameValidation.username;
	const cachedContributions = contributionCache.getFresh(username);
	if (cachedContributions !== undefined) {
		return successResponse(username, cachedContributions, 'HIT', false);
	}

	const staleContributions = contributionCache.getStale(username);
	const proxyResult = await fetchGitHubContribs(username);

	if (proxyResult.ok) {
		contributionCache.set(username, proxyResult.data);
		return successResponse(username, proxyResult.data, 'MISS', false);
	}

	if (proxyResult.status === 503 && staleContributions !== undefined) {
		return successResponse(username, staleContributions, 'STALE', true);
	}

	return jsonResponse(
		{
			error: proxyResult.error,
		},
		proxyResult.status,
		{
			'Cache-Control': 'no-store',
			...(proxyResult.retryAfter ? { 'Retry-After': proxyResult.retryAfter } : {}),
		},
	);
};
