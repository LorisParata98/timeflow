export interface AuthModel {
  token: string;
  refreshToken: string;
  userInfo?: UserInfo;
  redirectTo: RedirectTo;
}

export enum RedirectTo {
  Dashboard,
  AcceptPrivacyTerms,
}
export interface UserInfo {
  email: string;
  nome: string;
  cognome: string;

  userId: number;
  role: UserRole;
}

export enum UserRole {
  Guest,
  User,
  CompanyAdmin,
  System = 888,
  SystemAdmin = 999,
}
