export interface User {
  id?: number;
  email?: string;
  name?: string;
  lastName?: string;
  registrationNumber?: string;
  statusType: UserStatusType;
  roleIds: number[];
  roleIdsToAdd?: number[];
  roleIdsToRemove?: number[];
}

export enum UserStatusType {
  NotValidated = 1,
  Banned = 2,
  Enabled = 3,
  NeedPasswordChange = 4,
  None = 999,
}

export enum UserDeviceStatusType {
  Enabled = 1,
  Banned = 2,
  None = 999,
}

export enum UserType {
  CompanyAdmin,
  Standard,
  Customer,
}

export enum UserSort {
  FirstName,
  LastName,
  RegistrationNumber,
  Email,
  Status,
}
