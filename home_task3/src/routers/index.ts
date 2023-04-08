import express, { Request, Response, Application } from 'express';
import { UsersController } from '../controllers';
import { DBConnection } from '../data-access';
import { UserService } from '../services';
import { StatusResponse } from '../types';
import { UsersRouter } from './UsersRouter';

export default async (expressApp: Application) => {
  expressApp.use(express.json());

  const dbConnection = new DBConnection(
    'postgres://cfthntot:tbwvO8dynSPoHggmOnMy_nBc53Ia8HDQ@babar.db.elephantsql.com/cfthntot'
  );

  await dbConnection.authenticate();

  const userService = new UserService(dbConnection);

  const controller = new UsersController(userService);

  const usersRounter = new UsersRouter(controller);

  expressApp.get('/', (req: Request, res: Response) => {
    res.json({
      message: 'This is root route!',
      status: 'ok',
    } as StatusResponse);
  });

  expressApp.use('/', usersRounter.router);

  // expressApp.get('/userlist', controller.getAll);

  // expressApp.get('/user/:id', controller.getById);

  // expressApp.get('/suggest', controller.suggest);

  // expressApp.post('/adduser', controller.addUser);

  // expressApp.get('/deleteuser/:id', controller.deleteUser);

  // expressApp.post('/edituser/:id', controller.editUser);
};
