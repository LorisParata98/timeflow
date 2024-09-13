export interface MenuItem {
  id: string;
  label: string;
  icon?: string;
  isChild?: boolean;
  color?: 'red' | 'blue';
  command?: (data?: any) => void;
  visible?: boolean | ((data?: any) => boolean);
  disabled?: boolean | ((data?: any) => boolean);
}
export interface MenubarItem extends MenuItem {
  icon?: string;
  children?: MenuItem[];
  description?: string;
}
