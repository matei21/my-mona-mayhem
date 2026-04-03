const GITHUB_USERNAME_PATTERN = /^[A-Za-z0-9-]{1,39}$/;

const REQUEST_TIMEOUT_MS = 8000;

export type UsernameValidationResult =
	| {
		ok: true;
		username: string;
	}
	| {
		ok: false;
		error: string;
	};

type ProxySuccess = {
	ok: true;
	data: unknown;
};

type ProxyFailure = {
	ok: false;
	status: 404 | 503;
	error: string;
	retryAfter?: string;
};

export type ProxyResult = ProxySuccess | ProxyFailure;

export function validateGitHubUsername(rawUsername: string | undefined): UsernameValidationResult {
	if (!rawUsername) {
		return {
			ok: false,
			error: 'A username is required.',
		};
	}

	const username = rawUsername.trim();
	if (!GITHUB_USERNAME_PATTERN.test(username)) {
		return {
			ok: false,
			error: 'Invalid username. Use 1-39 letters, numbers, or hyphens.',
		};
	}

	if (username.startsWith('-') || username.endsWith('-')) {
		return {
			ok: false,
			error: 'Invalid username. Hyphens cannot be first or last.',
		};
	}

	return {
		ok: true,
		username: username.toLowerCase(),
	};
}

export async function fetchGitHubContribs(username: string): Promise<ProxyResult> {
	const controller = new AbortController();
	const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

	try {
		const response = await fetch(`https://github.com/${username}.contribs`, {
			headers: {
				Accept: 'application/json',
			},
			signal: controller.signal,
		});

		const retryAfter = response.headers.get('retry-after') ?? undefined;

		if (response.status === 404) {
			return {
				ok: false,
				status: 404,
				error: 'GitHub user not found.',
			};
		}

		if (response.status === 429 || response.status >= 500) {
			return {
				ok: false,
				status: 503,
				error: 'Contribution service is temporarily unavailable.',
				retryAfter,
			};
		}

		if (!response.ok) {
			return {
				ok: false,
				status: 503,
				error: 'Unable to fetch contributions right now.',
				retryAfter,
			};
		}

		let payload: unknown;
		try {
			payload = await response.json();
		} catch {
			return {
				ok: false,
				status: 503,
				error: 'Contribution service returned malformed data.',
			};
		}

		return {
			ok: true,
			data: payload,
		};
	} catch {
		return {
			ok: false,
			status: 503,
			error: 'Unable to reach contribution service.',
		};
	} finally {
		clearTimeout(timeout);
	}
}