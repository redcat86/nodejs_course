type User = {
  id: string;
  login: string;
  password: string;
  age: number;
  isDeleted?: boolean;
};

type StatusResponse = {
  status: "error" | "ok";
  message: string;
  response?: User | User[] | string;
};
