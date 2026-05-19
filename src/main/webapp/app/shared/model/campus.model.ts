import { IUniversity } from 'app/shared/model/university.model';

export interface ICampus {
  id?: number;
  name?: string;
  address?: string;
  latitude?: number | null;
  longitude?: number | null;
  university?: IUniversity | null;
}

export const defaultValue: Readonly<ICampus> = {};
