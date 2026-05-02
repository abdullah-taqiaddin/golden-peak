import { env } from "@/lib/env";

type FirebaseApiMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

type FirebaseApiRequestOptions = {
  method?: FirebaseApiMethod;
  query?: Record<string, string | number | boolean | undefined | null>;
  body?: unknown;
};

export class FirebaseApiError extends Error {
  status: number;
  payload: unknown;

  constructor(message: string, status: number, payload?: unknown) {
    super(message);
    this.name = "FirebaseApiError";
    this.status = status;
    this.payload = payload;
  }
}

export function isFirebaseApiError(error: unknown): error is FirebaseApiError {
  return error instanceof FirebaseApiError;
}

function buildUrl(path: string, query?: FirebaseApiRequestOptions["query"]) {
  const baseUrl = env.FIREBASE_API_BASE_URL;

  if (!baseUrl) {
    throw new FirebaseApiError("FIREBASE_API_BASE_URL is not configured.", 500);
  }

  const normalizedBase = baseUrl.endsWith("/") ? baseUrl : `${baseUrl}/`;
  const normalizedPath = path.startsWith("/") ? path.slice(1) : path;
  const url = new URL(normalizedPath, normalizedBase);

  if (query) {
    for (const [key, value] of Object.entries(query)) {
      if (value === undefined || value === null || value === "") continue;
      url.searchParams.set(key, String(value));
    }
  }

  return url;
}

function parseResponseBody(text: string) {
  if (!text) return {};

  try {
    return JSON.parse(text) as Record<string, unknown>;
  } catch {
    return { message: text };
  }
}

export async function callFirebaseApi<T = Record<string, unknown>>(
  path: string,
  options: FirebaseApiRequestOptions = {}
) {
  const method = options.method ?? "GET";
  const url = buildUrl(path, options.query);
  const headers = new Headers();

  if (options.body !== undefined) {
    headers.set("Content-Type", "application/json");
  }

  if (env.FIREBASE_API_KEY) {
    headers.set("x-api-key", env.FIREBASE_API_KEY);
  }

  const response = await fetch(url, {
    method,
    headers,
    body: options.body !== undefined ? JSON.stringify(options.body) : undefined,
    cache: "no-store"
  });

  const text = await response.text();
  const payload = parseResponseBody(text);

  if (!response.ok) {
    const errorMessage =
      (typeof payload.error === "string" && payload.error) ||
      (typeof payload.message === "string" && payload.message) ||
      `Firebase API request failed (${response.status}).`;

    throw new FirebaseApiError(errorMessage, response.status, payload);
  }

  return {
    status: response.status,
    data: payload as T
  };
}
