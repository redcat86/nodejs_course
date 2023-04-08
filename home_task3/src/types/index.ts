import { UserModel } from '../models';

export type StatusResponse = {
  status: 'error' | 'ok';
  message: string;
  response?: UserModel | UserModel[] | string;
};
