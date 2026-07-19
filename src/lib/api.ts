import { getToken, type Plan, type UserProfile } from "./auth";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

export interface AuthResponse {
  access_token: string;
  refresh_token: string | null;
  token_type: string;
  user: UserProfile;
}

export interface SignUpResponse {
  user: UserProfile;
  access_token: string | null;
  refresh_token: string | null;
  message: string;
}

/** FastAPI returns errors as { detail: string | [{msg}] }. Normalise to a string. */
async function readError(res: Response): Promise<string> {
  try {
    const data = await res.json();
    const detail = data?.detail;
    if (typeof detail === "string") return detail;
    if (Array.isArray(detail) && detail[0]?.msg) return detail[0].msg;
  } catch {
    /* fall through */
  }
  return `Request failed (${res.status})`;
}

async function post<T>(path: string, body: unknown): Promise<T> {
  let res: Response;
  try {
    res = await fetch(`${API_URL}${path}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
  } catch {
    throw new Error("Can't reach the server. Is the backend running?");
  }
  if (!res.ok) throw new Error(await readError(res));
  return res.json() as Promise<T>;
}

export function signup(email: string, password: string) {
  return post<SignUpResponse>("/auth/signup", { email, password });
}

export function login(email: string, password: string) {
  return post<AuthResponse>("/auth/login", { email, password });
}

export function verifyEmail(token: string) {
  return post<{ message: string }>("/auth/verify-email", { token });
}

export function resendVerification(email: string) {
  return post<{ message: string }>("/auth/resend-verification", { email });
}

export function forgotPassword(email: string) {
  return post<{ message: string }>("/auth/forgot-password", { email });
}

export function resetPassword(token: string, password: string) {
  return post<{ message: string }>("/auth/reset-password", { token, password });
}

export async function getMe(token: string): Promise<UserProfile> {
  const res = await fetch(`${API_URL}/auth/me`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (res.status === 401) throw new AuthError("Session expired");
  if (!res.ok) throw new Error(await readError(res));
  return res.json() as Promise<UserProfile>;
}

// --- authenticated requests (uses the stored access token) -----------------

export class AuthError extends Error {}

async function authed<T>(
  path: string,
  init: RequestInit = {},
): Promise<T> {
  const token = getToken();
  if (!token) throw new AuthError("Not signed in");

  let res: Response;
  try {
    res = await fetch(`${API_URL}${path}`, {
      ...init,
      headers: {
        ...(init.body ? { "Content-Type": "application/json" } : {}),
        ...init.headers,
        Authorization: `Bearer ${token}`,
      },
    });
  } catch {
    throw new Error("Can't reach the server. Is the backend running?");
  }
  if (res.status === 401) throw new AuthError("Session expired");
  if (!res.ok) throw new Error(await readError(res));
  if (res.status === 204) return undefined as T;
  return res.json() as Promise<T>;
}

// --- Google Calendar integration -------------------------------------------

export interface GoogleStatus {
  connected: boolean;
  email: string | null;
  calendar_timezone: string | null;
}

export function getGoogleStatus() {
  return authed<GoogleStatus>("/integrations/google/status");
}

export function getGoogleConnectUrl() {
  return authed<{ authorize_url: string }>("/integrations/google/connect");
}

export function disconnectGoogle() {
  return authed<void>("/integrations/google", { method: "DELETE" });
}

// --- Agents ----------------------------------------------------------------

export interface Agent {
  id: string;
  name: string;
  capability: "chat" | "voice" | "both";
  background_color: string;
  position: "bottom-left" | "bottom-right";
  greeting: string | null;
  booking_enabled: boolean;
  meeting_duration_minutes: number;
  public_key: string;
}

export interface Page<T> {
  items: T[];
  total: number;
  limit: number;
  offset: number;
}

export function listAgents() {
  return authed<Page<Agent>>("/agents?limit=100");
}

export interface AgentCreate {
  name: string;
  capability: "chat" | "voice" | "both";
  background_color: string;
  position: "bottom-left" | "bottom-right";
  greeting?: string;
  booking_enabled: boolean;
  meeting_duration_minutes: number;
}

export function createAgent(payload: AgentCreate) {
  return authed<Agent>("/agents", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function updateAgent(
  id: string,
  patch: Partial<
    Pick<
      Agent,
      | "name"
      | "capability"
      | "background_color"
      | "position"
      | "greeting"
      | "booking_enabled"
      | "meeting_duration_minutes"
    >
  >,
) {
  return authed<Agent>(`/agents/${id}`, {
    method: "PATCH",
    body: JSON.stringify(patch),
  });
}

/** Upload a document to train an agent. Returns the chunk count indexed. */
export async function uploadDocument(
  agentId: string,
  file: File,
): Promise<{ chunks_indexed: number }> {
  const token = getToken();
  if (!token) throw new AuthError("Not signed in");
  const form = new FormData();
  form.append("file", file);
  const res = await fetch(`${API_URL}/agents/${agentId}/documents`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` }, // no Content-Type: let the browser set the multipart boundary
    body: form,
  });
  if (res.status === 401) throw new AuthError("Session expired");
  if (!res.ok) throw new Error(await readError(res));
  return res.json();
}

// --- Conversations ---------------------------------------------------------

export interface ConversationSummary {
  id: string;
  agent_id: string;
  visitor_id: string;
  channel: string;
  language: string | null;
  started_at: string;
  last_message_at: string | null;
  message_count: number;
}

export interface ConversationMessage {
  id: string;
  role: string;
  content: string;
  created_at: string;
}

export interface ConversationDetail extends ConversationSummary {
  messages: ConversationMessage[];
}

export function listConversations(agentId: string) {
  return authed<Page<ConversationSummary>>(
    `/agents/${agentId}/conversations?limit=100`,
  );
}

export function getConversation(agentId: string, conversationId: string) {
  return authed<ConversationDetail>(
    `/agents/${agentId}/conversations/${conversationId}`,
  );
}

// --- Analytics -------------------------------------------------------------

export interface AgentAnalytics {
  agent_id: string;
  unique_visitors: number;
  total_conversations: number;
  total_messages: number;
  questions_asked: number;
  answers_given: number;
  avg_messages_per_conversation: number;
  recent_questions: string[];
}

export function getAnalytics(agentId: string) {
  return authed<AgentAnalytics>(`/agents/${agentId}/analytics`);
}

// --- Bookings --------------------------------------------------------------

export interface Booking {
  id: string;
  agent_id: string;
  conversation_id: string | null;
  visitor_name: string | null;
  visitor_email: string;
  visitor_phone: string | null;
  start_time: string;
  end_time: string;
  meet_link: string | null;
  status: "confirmed" | "cancelled";
  created_at: string | null;
}

export function listBookings(agentId: string) {
  return authed<Page<Booking>>(`/agents/${agentId}/bookings?limit=100`);
}

// --- Financing (financial access) ------------------------------------------

export interface BusinessSnapshot {
  agents: number;
  conversations: number;
  unique_visitors: number;
  qualified_leads: number;
  hot_leads: number;
  meetings_booked: number;
  content_pieces: number;
  first_activity: string | null;
  last_activity: string | null;
  demand_signals: string[];
}

export interface FinancingProduct {
  name: string;
  description: string;
  why_fit: string;
  typical_amount: string | null;
  likelihood: "high" | "medium" | "low";
}

export interface LoanReadinessAssessment {
  readiness_score: number;
  tier: string;
  strengths: string[];
  gaps: string[];
  recommended_products: FinancingProduct[];
  application_summary: string;
  next_steps: string[];
}

export interface FinancingIntake {
  monthly_revenue?: number | null;
  currency?: string;
  time_in_business_months?: number | null;
  employees?: number | null;
  amount_sought?: number | null;
  purpose?: string | null;
  country?: string | null;
}

export interface FinancingResult {
  snapshot: BusinessSnapshot;
  intake: FinancingIntake;
  assessment: LoanReadinessAssessment;
}

export function getBusinessSnapshot() {
  return authed<BusinessSnapshot>("/financing/snapshot");
}

export function assessFinancing(intake: FinancingIntake) {
  return authed<FinancingResult>("/financing/assess", {
    method: "POST",
    body: JSON.stringify(intake),
  });
}

// --- Billing (Paystack) ----------------------------------------------------

export function startCheckout(plan: Plan) {
  return authed<{ authorization_url: string; reference: string }>(
    "/billing/checkout",
    { method: "POST", body: JSON.stringify({ plan }) },
  );
}

export function verifyPayment(reference: string) {
  return authed<{ status: string; plan: Plan | null }>(
    `/billing/verify/${reference}`,
  );
}

// --- Admin (founder metrics) -----------------------------------------------

export interface AdminUserRow {
  email: string;
  plan: string;
  agents: number;
  created_at: string | null;
}

export interface AdminMetrics {
  total_signups: number;
  paid_users: number;
  active_users_30d: number;
  plan_breakdown: Record<string, number>;
  total_agents: number;
  total_conversations: number;
  total_leads: number;
  total_bookings: number;
  estimated_mrr: number;
  revenue_collected: number | null;
  total_transactions: number | null;
  recent_users: AdminUserRow[];
}

export function getAdminMetrics() {
  return authed<AdminMetrics>("/admin/metrics");
}

/** Cheap check used to gate the admin area (403 if not an admin). */
export function checkAdminAccess() {
  return authed<{ ok: boolean }>("/admin/access");
}

export interface AdminUserDetail {
  id: string;
  email: string;
  plan: string;
  agents: number;
  created_at: string | null;
}

export function getAdminUsers(
  params: { search?: string; limit?: number; offset?: number } = {},
) {
  const q = new URLSearchParams();
  if (params.search) q.set("search", params.search);
  q.set("limit", String(params.limit ?? 20));
  q.set("offset", String(params.offset ?? 0));
  return authed<Page<AdminUserDetail>>(`/admin/users?${q.toString()}`);
}

export function setUserPlan(userId: string, plan: Plan) {
  return authed<AdminUserDetail>(`/admin/users/${userId}`, {
    method: "PATCH",
    body: JSON.stringify({ plan }),
  });
}

export function deleteUser(userId: string) {
  return authed<void>(`/admin/users/${userId}`, { method: "DELETE" });
}

export interface AdminPayment {
  reference: string;
  email: string | null;
  amount: number;
  currency: string;
  status: string;
  channel: string | null;
  paid_at: string | null;
}

export interface AdminPayments {
  items: AdminPayment[];
  total: number;
  page: number;
  per_page: number;
}

export function getAdminPayments(page = 1, perPage = 50) {
  return authed<AdminPayments>(
    `/admin/payments?page=${page}&per_page=${perPage}`,
  );
}

// --- Leads (lead spotter) --------------------------------------------------

export type LeadStatus = "hot" | "warm" | "cold" | "unqualified";

export interface Lead {
  id: string;
  agent_id: string;
  conversation_id: string;
  status: LeadStatus;
  score: number;
  intent: string | null;
  summary: string | null;
  name: string | null;
  email: string | null;
  phone: string | null;
  company: string | null;
  confidence: number;
  flagged: boolean;
  created_at: string | null;
}

export interface LeadFilters {
  status?: LeadStatus;
  min_score?: number;
}

export function listLeads(filters: LeadFilters = {}) {
  const q = new URLSearchParams({ limit: "100" });
  if (filters.status) q.set("status", filters.status);
  if (filters.min_score) q.set("min_score", String(filters.min_score));
  return authed<Page<Lead>>(`/leads?${q.toString()}`);
}

// --- Content (writing helper) ----------------------------------------------

export type ContentType =
  | "blog_post"
  | "product_description"
  | "email"
  | "social_caption"
  | "faq_answer";

export interface ContentDraft {
  id: string;
  agent_id: string;
  content_type: ContentType;
  topic: string;
  tone: string | null;
  body: string;
  status: "draft" | "approved";
  grounded: boolean;
  created_at: string | null;
}

export function listContent() {
  return authed<Page<ContentDraft>>("/content?limit=100");
}

export function generateContent(payload: {
  agent_id: string;
  content_type: ContentType;
  topic: string;
  tone?: string;
}) {
  return authed<ContentDraft>("/content/generate", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function updateContent(
  id: string,
  patch: { body?: string; status?: "draft" | "approved" },
) {
  return authed<ContentDraft>(`/content/${id}`, {
    method: "PATCH",
    body: JSON.stringify(patch),
  });
}

export function deleteContent(id: string) {
  return authed<void>(`/content/${id}`, { method: "DELETE" });
}

/** Qualify a conversation into a scored lead. */
export function qualifyLead(agentId: string, conversationId: string) {
  return authed<Lead>("/leads/qualify", {
    method: "POST",
    body: JSON.stringify({
      agent_id: agentId,
      conversation_id: conversationId,
    }),
  });
}

// --- Widget (visitor-facing, no account auth) ------------------------------
// These use the agent's public key + a short-lived session token, not the
// owner's account token.

export interface WidgetSession {
  access_token: string;
  expires_in: number;
  agent_id: string;
  capability: "chat" | "voice" | "both";
  visitor_id: string;
  conversation_id: string;
}

export async function startWidgetSession(
  publicKey: string,
  visitorId?: string | null,
): Promise<WidgetSession> {
  return post<WidgetSession>("/sessions", {
    public_key: publicKey,
    visitor_id: visitorId ?? null,
  });
}

export async function widgetChat(
  sessionToken: string,
  question: string,
): Promise<{ answer: string; language: string | null }> {
  const res = await fetch(`${API_URL}/chat`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${sessionToken}`,
    },
    body: JSON.stringify({ question }),
  });
  if (res.status === 401) throw new AuthError("Session expired");
  if (!res.ok) throw new Error(await readError(res));
  return res.json();
}

export interface WidgetVoiceResponse {
  transcript: string;
  answer: string;
  audio_base64: string;
  audio_mime: string;
  language: string | null;
}

export async function widgetVoice(
  sessionToken: string,
  audio: Blob,
  encoding = "WEBM_OPUS",
): Promise<WidgetVoiceResponse> {
  const form = new FormData();
  form.append("file", audio, "audio.webm");
  form.append("encoding", encoding);
  const res = await fetch(`${API_URL}/voice`, {
    method: "POST",
    headers: { Authorization: `Bearer ${sessionToken}` },
    body: form,
  });
  if (res.status === 401) throw new AuthError("Session expired");
  if (!res.ok) throw new Error(await readError(res));
  return res.json();
}

export type { Plan, UserProfile };
