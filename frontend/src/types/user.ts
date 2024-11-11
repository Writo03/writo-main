

  export interface UserState {
    accessToken: string | null;
    refreshToken: string | null;
    fullName: string;
    email: string;
    userId: string;
    isLoggedIn: boolean;
  }
  
  export interface AuthState {
    isAuthenticated: boolean;
    user: UserState;
    error: string | null;
  }