import express, { Request, Response } from "express";
const app = express();

const users: User[] = [
  {
    id: "number_one",
    login: "China Number One",
    password: "some pwd",
    age: 18,
    isDeleted: false,
  },
];

app.get("/", (req: Request, res: Response) => {
  res.json({ ok: true });
});

app.get("/userlist", (req: Request, res: Response) => {
  res.json({ ok: true, users });
});

app.get("/user/:id", (req: Request, res: Response) => {
  res.json({
    ok1: true,
    user: users.find((user) => user.id === req.params.id),
  });
});

const PORT = 3000;

app.listen(PORT, () => {
  console.log(`⚡️[server]: Server is running at https://localhost:${PORT}`);
});
