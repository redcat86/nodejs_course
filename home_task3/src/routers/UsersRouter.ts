import express from 'express';
import { UsersController } from '../controllers';

export class UsersRouter {
  constroller: UsersController;
  public router: express.Router;

  constructor(constroller: UsersController) {
    this.router = express.Router();
    this.constroller = constroller;
  }

  public initialize() {
    this.router.get('/userlist', this.constroller.getAll);

    this.router.get('/user/:id', this.constroller.getById);

    this.router.get('/suggest', this.constroller.suggest);

    this.router.post('/adduser', this.constroller.addUser);

    this.router.get('/deleteuser/:id', this.constroller.deleteUser);

    this.router.post('/edituser/:id', this.constroller.editUser);
  }
}
