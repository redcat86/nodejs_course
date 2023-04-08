import express, { Request, Response, Application } from 'express';
import { schemas } from '../../UserValidationSchema';
import { DBConnection } from '../data-access';
import { UserModel } from '../models/UserModel';
import { UserService } from '../services';

type StatusResponse = {
  status: 'error' | 'ok';
  message: string;
  response?: UserModel | UserModel[] | string;
};

export default async (expressApp: Application) => {
  expressApp.use(express.json());

  const dbConnection = new DBConnection(
    'postgres://cfthntot:tbwvO8dynSPoHggmOnMy_nBc53Ia8HDQ@babar.db.elephantsql.com/cfthntot'
  );

  await dbConnection.authenticate();

  const userService = new UserService(dbConnection);

  expressApp.get('/', (req: Request, res: Response) => {
    res.json({
      message: 'This is root route!',
      status: 'ok',
    } as StatusResponse);
  });

  expressApp.get('/userlist', async (req: Request, res: Response) => {
    res.json({
      message: 'List of users got successfully',
      status: 'ok',
      response: await userService.getUserList(),
    } as StatusResponse);
  });

  expressApp.get('/user/:id', async (req: Request, res: Response) => {
    const { id } = req.params;

    const { error } = schemas.userById.validate({ id });
    if (error) {
      res.status(400).send({
        message: error.details.message,
        status: 'error',
      } as StatusResponse);
    } else {
      const userFound = await userService.getUserById(id);
      res.json({
        message: userFound ? 'User successfully found' : "User wasn't found",
        status: userFound ? 'ok' : 'error',
        response: userFound,
      } as StatusResponse);
    }
  });

  expressApp.get('/suggest', async (req: Request, res: Response) => {
    const { searchStr, limit } = req.query;
    const limitNum = parseInt(limit?.toString() || '');

    const { error } = schemas.usersSuggest.validate({
      limit: limitNum,
      searchStr,
    });

    if (error) {
      res.status(400).send({
        message: error.details.message,
        status: 'error',
      } as StatusResponse);
    } else {
      const usersFound = await userService.suggestUser(
        searchStr as string,
        limitNum
      );

      res.json({
        message: usersFound
          ? 'Users successfully found'
          : "Users weren't found",
        status: usersFound ? 'ok' : 'error',
        response: usersFound,
      } as StatusResponse);
    }
  });

  expressApp.post('/adduser', async (req: Request, res: Response) => {
    const newUser = req.body;

    const { error } = schemas.userData.validate(newUser);

    if (error) {
      res.status(400).send({
        message: error.details.message,
        status: 'error',
      } as StatusResponse);
    } else {
      const { id } = req.params;
      const { login, password, age } = newUser;
      res.json(userService.createUser(id, login, password, age));
    }
  });

  expressApp.get('/deleteuser/:id', async (req: Request, res: Response) => {
    const { id } = req.params;

    res.status(400).send(await userService.deleteUser(id));
  });

  expressApp.post('/edituser/:id', async (req: Request, res: Response) => {
    const { id } = req.params;
    const { age, login, password } = req.body;

    const { error } = schemas.userData.validate(req.body);

    if (error) {
      res.status(400).send({
        message: error.details.message,
        status: 'error',
      } as StatusResponse);
    } else {
      res.json(userService.updateUser(id, login, password, age));
    }
  });
};
