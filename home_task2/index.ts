import express, { Request, Response } from "express";
const Joi = require("joi");

const schemas = {
  userData: Joi.object({
    id: Joi.required(),
    login: Joi.string().alphanum().min(3).max(30).required(),

    password: Joi.string()
      .pattern(new RegExp("^[a-zA-Z0-9]{3,30}$"))
      .required(),

    age: Joi.number().integer().min(0).max(150).required(),
  }),
  userById: Joi.object({
    id: Joi.required(),
  }),
  usersSuggest: Joi.object({
    searchStr: Joi.required(),
    limit: Joi.number().integer().min(1).required(),
  }),
};

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
  res.json({ message: "This is root route!", status: "ok" } as StatusResponse);
});

app.get("/userlist", (req: Request, res: Response) => {
  res.json({
    message: "List of users got successfully",
    status: "ok",
    response: app.locals.users.filter((user: User) => !user.isDeleted),
  } as StatusResponse);
});

app.get("/user/:id", (req: Request, res: Response) => {
  const { id } = req.params;

  const { error } = schemas.userById.validate({ id });
  if (error) {
    res.status(400).send({
      message: error.details.message,
      status: "error",
    } as StatusResponse);
  } else {
    const userFound = users.find((user) => user.id === req.params.id);
    res.json({
      message: userFound ? "User successfully found" : "User wasn't found",
      status: userFound ? "ok" : "error",
      response: userFound,
    } as StatusResponse);
  }
});

app.get("/suggest", (req: Request, res: Response) => {
  const { searchStr, limit } = req.query;
  const limitNum = parseInt(limit?.toString() || "");

  const { error } = schemas.usersSuggest.validate({
    limit: limitNum,
    searchStr,
  });

  if (error) {
    res.status(400).send({
      message: error.details.message,
      status: "error",
    } as StatusResponse);
  } else {
    const usersFound = users
      .filter(
        (user) =>
          user.login.includes(searchStr?.toString() || "") && !user.isDeleted
      )
      .slice(0, limitNum < users.length ? limitNum : users.length);

    res.json({
      message: usersFound ? "Users successfully found" : "Users weren't found",
      status: usersFound ? "ok" : "error",
      response: usersFound,
    } as StatusResponse);
  }
});

app.post("/adduser", (req: Request, res: Response) => {
  const newUser = req.body;

  const { error } = schemas.userData.validate(newUser);

  if (error) {
    res.status(400).send({
      message: error.details.message,
      status: "error",
    } as StatusResponse);
  } else {
    const users = app.locals.users;
    const duplicate = users.find((user: User) => user.id === req.body.id);

    if (duplicate) {
      res.status(400).send({
        message: "User already exist.",
        status: "error",
      } as StatusResponse);
    } else {
      app.locals.users.push(req.body);
      res.json({ status: "ok", message: "User added" } as StatusResponse);
    }
  }
});

app.post("/edituser/:id", (req: Request, res: Response) => {
  const editedUser = req.body;

  const { error } = schemas.userData.validate(editedUser);

  if (error) {
    res.status(400).send({
      message: error.details.message,
      status: "error",
    } as StatusResponse);
  } else {
    const users = app.locals.users;

    const id = editedUser.id;
    const user: User = users.find((u: User) => u.id === id);

    if (!user) {
      res.status(400).send({
        message: "User dosn't exist.",
        status: "error",
      } as StatusResponse);
    } else {
      user.age = editedUser.age;
      user.login = editedUser.login;
      user.password = editedUser.password;
      res.json({
        status: "ok",
        message: "User has been updated.",
      } as StatusResponse);
    }
  }
});

const PORT = 3000;

app.listen(PORT, () => {
  console.log(`⚡️[server]: Server is running at https://localhost:${PORT}`);
});
