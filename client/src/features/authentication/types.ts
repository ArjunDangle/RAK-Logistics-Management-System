// Matches the backend LoginRequest schema (though we use email field here)
export interface LoginRequest {
  email: string;
  password: string;
}

// Matches the backend Token schema
export interface Token {
  access_token: string;
  token_type: string;
}

// Matches the backend UserRead schema
export interface UserRead {
  id: number;
  full_name: string;
  email: string;
  role: 'logistics' | 'support'; // Match the UserRole Enum
}