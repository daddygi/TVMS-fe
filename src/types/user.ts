export type UserRole = "admin" | "user";

export interface UserRecord {
  id: string;
  username: string;
  role: UserRole;
  createdAt: string;
  updatedAt: string;
}

export interface UsersResponse {
  data: UserRecord[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface UserResponse {
  data: UserRecord;
}

export interface UserFilters {
  page?: number;
  limit?: number;
}

export interface CreateUserInput {
  username: string;
  password: string;
  role?: UserRole;
}

export interface UpdateUserInput {
  username?: string;
  password?: string;
  role?: UserRole;
}
