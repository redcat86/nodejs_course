type User = {
  id: string;
  login: string;
  password: string;
  age: number;
  isdeleted?: boolean;
};

type StatusResponse = {
  status: 'error' | 'ok';
  message: string;
  response?: User | User[] | string;
};
