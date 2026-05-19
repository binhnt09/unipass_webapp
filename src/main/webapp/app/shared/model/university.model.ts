export interface IUniversity {
  id?: number;
  code?: string;
  name?: string;
  logoUrl?: string | null;
  status?: string | null;
}

export const defaultValue: Readonly<IUniversity> = {};
