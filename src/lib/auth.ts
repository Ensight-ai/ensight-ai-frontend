"use client";

// Minimal client-side session storage. Email/password tokens come from the
// FastAPI backend; Google OAuth tokens come from the Supabase SDK. Both are
// Supabase access tokens that the backend's get_current_user accepts.

export type Plan = "inactive" | "starter" | "beta" | "pro";

/** Whether a plan grants product access (i.e. the user has paid). */
export function isPaidPlan(plan: Plan | string | null | undefined): boolean {
  return plan === "starter" || plan === "beta" || plan === "pro";
}

export interface UserProfile {
  id: string;
  email: string;
  plan: Plan;
}

const TOKEN_KEY = "ensight_access_token";
const REFRESH_KEY = "ensight_refresh_token";
const USER_KEY = "ensight_user";

export function saveSession(
  accessToken: string,
  refreshToken: string | null,
  user: UserProfile,
): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(TOKEN_KEY, accessToken);
  if (refreshToken) localStorage.setItem(REFRESH_KEY, refreshToken);
  localStorage.setItem(USER_KEY, JSON.stringify(user));
}

export function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(TOKEN_KEY);
}

export function getUser(): UserProfile | null {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem(USER_KEY);
  return raw ? (JSON.parse(raw) as UserProfile) : null;
}

/** Update just the plan on the stored user (after a successful payment). */
export function updateStoredPlan(plan: Plan): void {
  if (typeof window === "undefined") return;
  const user = getUser();
  if (!user) return;
  localStorage.setItem(USER_KEY, JSON.stringify({ ...user, plan }));
}

export function clearSession(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(REFRESH_KEY);
  localStorage.removeItem(USER_KEY);
}
