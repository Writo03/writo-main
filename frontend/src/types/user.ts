

  export interface UserState {
    accessToken: string | null;
    refreshToken: string | null;
    fullName: string;
    email: string;
    userId: string;
    isLoggedIn: boolean;
    isAdmin:boolean,
    isMentor:boolean,
    profilePic:string,
    institution:string,
    phone:number,
    target:string
    role:[]
  }
  export interface updateUserState {
    fullName: string;
    email: string;
    userId: string;
    isAdmin:boolean,
    isMentor:boolean,
    profilePic:string,
    institution:string,
    phone:number,
    target:string,
  }
  
  
  export interface AuthState {
    isAuthenticated: boolean;
    user: UserState;
    error: string | null;
  }