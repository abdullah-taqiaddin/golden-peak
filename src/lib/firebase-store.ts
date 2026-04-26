import bcrypt from "bcryptjs";
import { importPKCS8, SignJWT } from "jose";

import { env } from "@/lib/env";
import { EXPERIENCE_LEVELS, ExperienceLevelValue } from "@/lib/experience-level";

const FIRESTORE_SCOPE = "https://www.googleapis.com/auth/datastore";
const OAUTH_TOKEN_URL = "https://oauth2.googleapis.com/token";

export type UserStatus = "PENDING" | "APPROVED" | "REJECTED";
export type UserRole = "USER" | "ADMIN";
export type StatusFilter = "pending" | "approved" | "rejected" | "all";

export type UserRecord = {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  status: UserStatus;
  experienceLevel: ExperienceLevelValue;
  role: UserRole;
  passwordHash: string | null;
  progressCount: number;
  createdAt: string;
  updatedAt: string;
};

export type AdminUserRecord = Omit<UserRecord, "passwordHash" | "role">;

export type ProgressRecord = {
  entryDate: string;
  revenue: number;
};

type FirestoreDocument = {
  name: string;
  fields?: Record<string, unknown>;
};

type FirestoreRunQueryResult = {
  document?: FirestoreDocument;
};

type TokenCache = {
  token: string;
  expiresAt: number;
};

declare global {
  // eslint-disable-next-line no-var
  var firebaseTokenCache: TokenCache | undefined;
}

export class FirebaseStoreError extends Error {
  status: number;
  payload: unknown;

  constructor(message: string, status: number, payload?: unknown) {
    super(message);
    this.name = "FirebaseStoreError";
    this.status = status;
    this.payload = payload;
  }
}

export function isFirebaseStoreError(error: unknown): error is FirebaseStoreError {
  return error instanceof FirebaseStoreError;
}

function getFirestoreBaseUrl() {
  if (!env.FIREBASE_PROJECT_ID) {
    throw new FirebaseStoreError("FIREBASE_PROJECT_ID is not configured.", 500);
  }

  return `https://firestore.googleapis.com/v1/projects/${env.FIREBASE_PROJECT_ID}/databases/(default)/documents`;
}

function getServiceAccountConfig() {
  const clientEmail = env.FIREBASE_CLIENT_EMAIL;
  const privateKey = env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n");

  if (!clientEmail || !privateKey) {
    throw new FirebaseStoreError(
      "FIREBASE_CLIENT_EMAIL or FIREBASE_PRIVATE_KEY is not configured.",
      500
    );
  }

  return { clientEmail, privateKey };
}

async function getAccessToken() {
  const now = Date.now();
  const cached = globalThis.firebaseTokenCache;

  if (cached && cached.expiresAt - 60_000 > now) {
    return cached.token;
  }

  const { clientEmail, privateKey } = getServiceAccountConfig();
  const nowSeconds = Math.floor(now / 1000);
  const key = await importPKCS8(privateKey, "RS256");
  const assertion = await new SignJWT({
    scope: FIRESTORE_SCOPE,
    iss: clientEmail,
    sub: clientEmail,
    aud: OAUTH_TOKEN_URL
  })
    .setProtectedHeader({ alg: "RS256", typ: "JWT" })
    .setIssuedAt(nowSeconds)
    .setExpirationTime(nowSeconds + 3600)
    .sign(key);

  const body = new URLSearchParams({
    grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
    assertion
  });

  const response = await fetch(OAUTH_TOKEN_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
    },
    body: body.toString(),
    cache: "no-store"
  });

  const text = await response.text();
  const payload = text ? (JSON.parse(text) as Record<string, unknown>) : {};

  if (!response.ok) {
    const message =
      (typeof payload.error_description === "string" && payload.error_description) ||
      (typeof payload.error === "string" && payload.error) ||
      "Failed to fetch Firebase access token.";

    throw new FirebaseStoreError(message, response.status, payload);
  }

  const token = typeof payload.access_token === "string" ? payload.access_token : "";
  const expiresIn = Number(payload.expires_in ?? 3600);

  if (!token) {
    throw new FirebaseStoreError("Firebase access token response is invalid.", 500, payload);
  }

  globalThis.firebaseTokenCache = {
    token,
    expiresAt: Date.now() + expiresIn * 1000
  };

  return token;
}

function buildFirestoreUrl(path: string, query?: Record<string, string | number | undefined>) {
  const baseUrl = getFirestoreBaseUrl();
  const normalizedPath = path.startsWith(":")
    ? `${baseUrl}${path}`
    : `${baseUrl}/${path.startsWith("/") ? path.slice(1) : path}`;
  const url = new URL(normalizedPath);

  if (query) {
    for (const [key, value] of Object.entries(query)) {
      if (value === undefined || value === "") continue;
      url.searchParams.set(key, String(value));
    }
  }

  return url;
}

function extractFirestoreErrorMessage(payload: unknown) {
  if (!payload || typeof payload !== "object") {
    return "Firebase request failed.";
  }

  const root = payload as Record<string, unknown>;
  if (typeof root.message === "string" && root.message) {
    return root.message;
  }

  const error = root.error;
  if (error && typeof error === "object") {
    const nested = error as Record<string, unknown>;
    if (typeof nested.message === "string" && nested.message) {
      return nested.message;
    }
  }

  return "Firebase request failed.";
}

async function firestoreRequest<T = unknown>(
  path: string,
  init: RequestInit = {},
  query?: Record<string, string | number | undefined>
) {
  console.log("here")
  const token = await getAccessToken();
  const url = buildFirestoreUrl(path, query);
  const headers = new Headers(init.headers);

  headers.set("Authorization", `Bearer ${token}`);
  if (init.body !== undefined && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  const response = await fetch(url, {
    ...init,
    headers,
    cache: "no-store"
  });

  const text = await response.text();
  let payload: unknown = {};

  if (text) {
    try {
      payload = JSON.parse(text);
    } catch {
      payload = { message: text };
    }
  }

  if (!response.ok) {
    throw new FirebaseStoreError(
      extractFirestoreErrorMessage(payload),
      response.status,
      payload
    );
  }

  return payload as T;
}

function getDocumentId(documentName: string) {
  const segments = documentName.split("/");
  return segments.at(-1) ?? "";
}

function normalizeStatus(value: unknown): UserStatus {
  const upper = String(value ?? "").toUpperCase();
  if (upper === "APPROVED" || upper === "REJECTED") return upper;
  return "PENDING";
}

function normalizeExperienceLevel(value: unknown): ExperienceLevelValue {
  if (typeof value === "string" && EXPERIENCE_LEVELS.includes(value as ExperienceLevelValue)) {
    return value as ExperienceLevelValue;
  }

  return "BEGINNER";
}

function toFirestoreValue(value: unknown): Record<string, unknown> {
  if (value === null) {
    return { nullValue: null };
  }

  if (typeof value === "string") {
    return { stringValue: value };
  }

  if (typeof value === "boolean") {
    return { booleanValue: value };
  }

  if (typeof value === "number") {
    if (!Number.isFinite(value)) {
      return { doubleValue: 0 };
    }

    if (Number.isInteger(value)) {
      return { integerValue: String(value) };
    }

    return { doubleValue: value };
  }

  if (value instanceof Date) {
    return { stringValue: value.toISOString() };
  }

  if (Array.isArray(value)) {
    return { arrayValue: { values: value.map((item) => toFirestoreValue(item)) } };
  }

  if (value && typeof value === "object") {
    const fields: Record<string, unknown> = {};
    for (const [key, nested] of Object.entries(value as Record<string, unknown>)) {
      if (nested === undefined) continue;
      fields[key] = toFirestoreValue(nested);
    }
    return { mapValue: { fields } };
  }

  return { stringValue: String(value ?? "") };
}

function toFirestoreFields(data: Record<string, unknown>) {
  const fields: Record<string, unknown> = {};

  for (const [key, value] of Object.entries(data)) {
    if (value === undefined) continue;
    fields[key] = toFirestoreValue(value);
  }

  return fields;
}

function fromFirestoreValue(input: unknown): unknown {
  if (!input || typeof input !== "object") {
    return input;
  }

  const value = input as Record<string, unknown>;

  if ("stringValue" in value) return String(value.stringValue ?? "");
  if ("integerValue" in value) return Number(value.integerValue ?? 0);
  if ("doubleValue" in value) return Number(value.doubleValue ?? 0);
  if ("booleanValue" in value) return Boolean(value.booleanValue);
  if ("timestampValue" in value) return String(value.timestampValue ?? "");
  if ("nullValue" in value) return null;

  if ("arrayValue" in value) {
    const arrayValue = value.arrayValue as Record<string, unknown> | undefined;
    const values = Array.isArray(arrayValue?.values) ? arrayValue.values : [];
    return values.map((item) => fromFirestoreValue(item));
  }

  if ("mapValue" in value) {
    const mapValue = value.mapValue as Record<string, unknown> | undefined;
    const fields = (mapValue?.fields ?? {}) as Record<string, unknown>;
    const mapped: Record<string, unknown> = {};

    for (const [key, nested] of Object.entries(fields)) {
      mapped[key] = fromFirestoreValue(nested);
    }

    return mapped;
  }

  return undefined;
}

function parseDocument(document: FirestoreDocument) {
  const parsed: Record<string, unknown> = {};

  for (const [key, value] of Object.entries(document.fields ?? {})) {
    parsed[key] = fromFirestoreValue(value);
  }

  return parsed;
}

function mapUserDocument(document: FirestoreDocument): UserRecord {
  const raw = parseDocument(document);
  const id = String(raw.id ?? getDocumentId(document.name));
  const createdAt = String(raw.createdAt ?? new Date().toISOString());
  const updatedAt = String(raw.updatedAt ?? createdAt);
  const progressCountRaw = Number(raw.progressCount ?? 0);

  return {
    id,
    email: String(raw.email ?? ""),
    firstName: String(raw.firstName ?? ""),
    lastName: String(raw.lastName ?? ""),
    status: normalizeStatus(raw.status),
    experienceLevel: normalizeExperienceLevel(raw.experienceLevel),
    role: String(raw.role ?? "USER").toUpperCase() === "ADMIN" ? "ADMIN" : "USER",
    passwordHash: typeof raw.passwordHash === "string" ? raw.passwordHash : null,
    progressCount: Number.isFinite(progressCountRaw) ? progressCountRaw : 0,
    createdAt,
    updatedAt
  };
}

function mapProgressDocument(document: FirestoreDocument): ProgressRecord {
  const raw = parseDocument(document);
  const entryDate = String(raw.entryDate ?? getDocumentId(document.name));
  const revenue = Number(raw.revenue ?? 0);

  return {
    entryDate,
    revenue: Number.isFinite(revenue) ? revenue : 0
  };
}

function toAdminUserRecord(user: UserRecord): AdminUserRecord {
  return {
    id: user.id,
    email: user.email,
    firstName: user.firstName,
    lastName: user.lastName,
    status: user.status,
    experienceLevel: user.experienceLevel,
    progressCount: user.progressCount,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt
  };
}

async function writeUser(user: UserRecord) {
  await firestoreRequest<FirestoreDocument>(`users/${encodeURIComponent(user.id)}`, {
    method: "PATCH",
    body: JSON.stringify({
      fields: toFirestoreFields({
        id: user.id,
        email: user.email.toLowerCase(),
        firstName: user.firstName,
        lastName: user.lastName,
        status: user.status,
        experienceLevel: user.experienceLevel,
        role: user.role,
        passwordHash: user.passwordHash,
        progressCount: user.progressCount,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
      })
    })
  });
}

async function runUserQuery(structuredQuery: Record<string, unknown>) {
  const results = await firestoreRequest<FirestoreRunQueryResult[]>(":runQuery", {
    method: "POST",
    body: JSON.stringify({ structuredQuery })
  });

  return results
    .map((row) => row.document)
    .filter((document): document is FirestoreDocument => Boolean(document));
}

export async function getUserById(id: string) {
  try {
    const document = await firestoreRequest<FirestoreDocument>(
      `users/${encodeURIComponent(id)}`
    );
    return mapUserDocument(document);
  } catch (error) {
    if (isFirebaseStoreError(error) && error.status === 404) {
      return null;
    }
    throw error;
  }
}

export async function getUserByEmail(email: string) {
  const normalizedEmail = email.trim().toLowerCase();
  const documents = await runUserQuery({
    from: [{ collectionId: "users" }],
    where: {
      fieldFilter: {
        field: { fieldPath: "email" },
        op: "EQUAL",
        value: toFirestoreValue(normalizedEmail)
      }
    },
    limit: 1
  });

  if (documents.length === 0) return null;
  return mapUserDocument(documents[0]);
}

export async function createPendingUser(input: {
  firstName: string;
  lastName: string;
  email: string;
  experienceLevel: ExperienceLevelValue;
}) {
  const email = input.email.trim().toLowerCase();
  const existing = await getUserByEmail(email);

  if (existing) {
    throw new FirebaseStoreError("البريد الإلكتروني مسجل مسبقاً.", 409);
  }

  const now = new Date().toISOString();
  const user: UserRecord = {
    id: crypto.randomUUID(),
    email,
    firstName: input.firstName.trim(),
    lastName: input.lastName.trim(),
    status: "PENDING",
    experienceLevel: input.experienceLevel,
    role: "USER",
    passwordHash: null,
    progressCount: 0,
    createdAt: now,
    updatedAt: now
  };

  await writeUser(user);
  return toAdminUserRecord(user);
}

export async function listUsersForAdmin(filter: StatusFilter = "all") {
  const documents = await runUserQuery({
    from: [{ collectionId: "users" }],
    orderBy: [{ field: { fieldPath: "createdAt" }, direction: "DESCENDING" }]
  });

  const allUsers = documents.map((document) => mapUserDocument(document));

  const counts = {
    pending: allUsers.filter((user) => user.status === "PENDING").length,
    approved: allUsers.filter((user) => user.status === "APPROVED").length,
    rejected: allUsers.filter((user) => user.status === "REJECTED").length
  };

  const filteredUsers =
    filter === "all"
      ? allUsers
      : allUsers.filter((user) => user.status === filter.toUpperCase());

  return {
    users: filteredUsers.map((user) => toAdminUserRecord(user)),
    counts
  };
}

export async function approveUser(id: string, password: string) {
  const user = await getUserById(id);
  if (!user) {
    throw new FirebaseStoreError("المستخدم غير موجود.", 404);
  }

  const now = new Date().toISOString();
  const passwordHash = await bcrypt.hash(password, 10);

  const updated: UserRecord = {
    ...user,
    status: "APPROVED",
    passwordHash,
    updatedAt: now
  };

  await writeUser(updated);
  return toAdminUserRecord(updated);
}

export async function rejectUser(id: string) {
  const user = await getUserById(id);
  if (!user) {
    throw new FirebaseStoreError("المستخدم غير موجود.", 404);
  }

  const updated: UserRecord = {
    ...user,
    status: "REJECTED",
    updatedAt: new Date().toISOString()
  };

  await writeUser(updated);
  return toAdminUserRecord(updated);
}

async function getProgressDocument(userId: string, entryDate: string) {
  try {
    const document = await firestoreRequest<FirestoreDocument>(
      `users/${encodeURIComponent(userId)}/progress/${encodeURIComponent(entryDate)}`
    );
    return mapProgressDocument(document);
  } catch (error) {
    if (isFirebaseStoreError(error) && error.status === 404) {
      return null;
    }
    throw error;
  }
}

export async function listUserProgress(userId: string) {
  const response = await firestoreRequest<{ documents?: FirestoreDocument[] }>(
    `users/${encodeURIComponent(userId)}/progress`,
    { method: "GET" },
    { pageSize: 1000 }
  );

  const progress = (response.documents ?? []).map((document) =>
    mapProgressDocument(document)
  );

  return progress.sort((a, b) => a.entryDate.localeCompare(b.entryDate));
}

export async function upsertUserProgress(
  userId: string,
  input: { entryDate: string; revenue: number }
) {
  const user = await getUserById(userId);
  if (!user) {
    throw new FirebaseStoreError("المستخدم غير موجود.", 404);
  }

  const existing = await getProgressDocument(userId, input.entryDate);
  const now = new Date().toISOString();

  await firestoreRequest<FirestoreDocument>(
    `users/${encodeURIComponent(userId)}/progress/${encodeURIComponent(input.entryDate)}`,
    {
      method: "PATCH",
      body: JSON.stringify({
        fields: toFirestoreFields({
          entryDate: input.entryDate,
          revenue: input.revenue,
          createdAt: existing ? undefined : now,
          updatedAt: now
        })
      })
    }
  );

  if (!existing) {
    await writeUser({
      ...user,
      progressCount: user.progressCount + 1,
      updatedAt: now
    });
  }

  return listUserProgress(userId);
}
