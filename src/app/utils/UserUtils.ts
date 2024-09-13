import { UserType } from '../models/user.model';
export class UserUtils {
  public static userRoles = [
    {
      label: 'Cliente',
      value: UserType.Customer,
    },
    {
      label: 'Fornitore',
      value: UserType.Supplier,
    },
  ];
}
