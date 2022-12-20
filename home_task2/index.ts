import express, { Request, Response } from "express";
const app = express();

app.use(express.json());

const users: User[] = [
  {
    id: "number_one",
    login: "China Number One",
    password: "some pwd",
    age: 18,
    isDeleted: false,
  },
];

app.locals["users"] = users;

app.get("/", (req: Request, res: Response) => {
  res.json({ ok: true });
});

app.get("/userlist", (req: Request, res: Response) => {
  res.json({ ok: true, users: app.locals.users });
});

app.get("/user/:id", (req: Request, res: Response) => {
  res.json({
    ok1: true,
    user: users.find((user) => user.id === req.params.id),
  });
});

app.post("/adduser", (req: Request, res: Response) => {
  const users = app.locals.users;

  //  validation should be added for req.body
  const duplicate = users.find((user: User) => user.id === req.body.id);

  if (duplicate) {
    res.status(500).send({ message: "User already exist." });
  } else {
    app.locals.users.push(req.body);
    res.json({ ok: true, message: "User added" });
  }
});

app.post("/edituser/:id", (req: Request, res: Response) => {
  const users = app.locals.users;

  const id = req.params.id;
  const user: User = users.find((u: User) => u.id === id);

  if (!user) {
    res.status(500).send({ message: "User dosn't exist." });
  } else {
    user.age = req.body.age;
    user.login = req.body.login;
    user.password = req.body.password;
    res.json({ ok: true, message: "User has been updated." });
  }
});

const PORT = 3000;

app.listen(PORT, () => {
  console.log(`⚡️[server]: Server is running at https://localhost:${PORT}`);
});
