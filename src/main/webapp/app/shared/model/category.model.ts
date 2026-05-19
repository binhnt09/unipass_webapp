export interface ICategory {
  id?: number;
  name?: string;
  iconUrl?: string | null;
  status?: string | null;
  parent?: ICategory | null;
}

export const defaultValue: Readonly<ICategory> = {};
