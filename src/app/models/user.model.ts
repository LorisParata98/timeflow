import { IdAttribute } from './common.model';

export interface RegisteredUser extends IdAttribute, UserBaseModel {
  userType: UserType;
}

export interface UserBaseModel {
  email: string;
  username: string;
  password: string;
  userType: UserType;
}

export enum UserType {
  Customer,
  Supplier,
}
