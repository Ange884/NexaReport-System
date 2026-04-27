// ─── Enums (mirror Java enums exactly) ───────────────────────────────────────

export type UserRole =
  | "ADMIN"
  | "TEACHER"
  | "NURSE"
  | "ADMINISTRATIVE_STAFF"
  | "COMMITTEE_MEMBER"
  | "CLASS_MONITOR"
  | "STUDENT";

export type UserStatus = "ACTIVE" | "INACTIVE" | "PENDING";

export type IssuePriority = "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";

export type IssueStatus = "PENDING" | "IN_PROGRESS" | "RESOLVED";

export type IssueTargetType = "USER" | "ROLE" | "BROADCAST";

export type NotificationType =
  | "ISSUE_CREATED"
  | "ISSUE_COMMENTED"
  | "ISSUE_RESOLVED"
  | "ISSUE_ASSIGNED"
  | "ISSUE_RESENT"
  | "GENERAL";

// ─── Auth ─────────────────────────────────────────────────────────────────────

export interface UserResponse {
  id: number;
  email: string;
  role: UserRole;
  status: UserStatus;
  createdAt: string; // ISO Instant string from Java
  className: string | null;
  committeePosition: string | null;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user: UserResponse;
}

export interface AccessTokenResponse {
  accessToken: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RefreshTokenRequest {
  refreshToken: string;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

// ─── Issues ───────────────────────────────────────────────────────────────────

export interface IssueResponseDto {
  id: number;
  title: string;
  description: string;
  category: string;
  priority: IssuePriority;
  status: IssueStatus;
  createdAt: string;
  createdById: number;
  createdByEmail: string;
  targetType: IssueTargetType;
  targetUserId: number | null;
  targetRole: UserRole | null;
}

export interface IssueDashboardResponse {
  total: number;
  pending: number;
  inProgress: number;
  resolved: number;
  issues: IssueResponseDto[];
}

export interface CommentResponseDto {
  id: number;
  content: string;
  createdAt: string;
  authorEmail: string;
  authorRole: UserRole;
}

export interface IssueActivityResponseDto {
  id: number;
  action: string;
  performedByEmail: string;
  createdAt: string;
}

export interface IssueThreadResponse {
  issue: IssueResponseDto;
  comments: CommentResponseDto[];
  activities: IssueActivityResponseDto[];
}

export interface IssueCreateRequest {
  title: string;
  description: string;
  category: string;
  priority: IssuePriority;
  targetType: IssueTargetType;
  targetUserId?: number;
  targetRole?: UserRole;
}

export interface IssueEditRequest {
  title?: string;
  description?: string;
  category?: string;
  priority?: IssuePriority;
}

export interface IssueCommentRequest {
  content: string;
}

export interface IssueResolveRequest {
  resolutionMessage: string;
}

export interface AssignIssueRequest {
  assigneeId: number;
}

// ─── Dashboard ────────────────────────────────────────────────────────────────

export interface DashboardResponse {
  totalSubmitted: number;
  totalReceived: number;
  totalResolved: number;
  totalInProgress: number;
  totalPending: number;
  issuesByCategory: Record<string, number>;
  recentSubmissions: IssueResponseDto[];
  recentIssues: IssueResponseDto[];
}

export interface PriorityUnresolvedCountResponse {
  count: number;
}

// ─── Notifications ────────────────────────────────────────────────────────────

export interface NotificationResponseDto {
  id: number;
  message: string;
  type: NotificationType;
  isRead: boolean;
  createdAt: string;
}

// ─── Users ────────────────────────────────────────────────────────────────────

export interface InviteUserRequest {
  email: string;
  fullNames: string;
  role: UserRole;
  className?: string;
  committeePosition?: string;
}

export interface InviteUserResult {
  userId: number;
  email: string;
  temporaryPassword: string;
  message: string;
}

export interface MessageResponse {
  message: string;
}

// ─── Role helpers ─────────────────────────────────────────────────────────────

/** Roles that are considered "staff / admin" and route to /admin */
export const ADMIN_ROLES: UserRole[] = [
  "ADMIN",
  "TEACHER",
  "NURSE",
  "ADMINISTRATIVE_STAFF",
];

/** Roles that route to /student/dashboard */
export const STUDENT_ROLES: UserRole[] = [
  "COMMITTEE_MEMBER",
  "CLASS_MONITOR",
  "STUDENT",
];

export function isAdminRole(role: UserRole): boolean {
  return ADMIN_ROLES.includes(role);
}

export function isStudentRole(role: UserRole): boolean {
  return STUDENT_ROLES.includes(role);
}

export function getDefaultRoute(role: UserRole): string {
  if (isAdminRole(role)) return "/admin";
  if (isStudentRole(role)) return "/student/dashboard";
  return "/";
}
