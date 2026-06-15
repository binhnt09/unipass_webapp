export interface IPostCategory {
  id?: number;
  name?: string;
  description?: string | null;
  status?: string | null;
}

export const defaultValue: Readonly<IPostCategory> = {};
