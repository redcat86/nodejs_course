import express, { Request, Response, Application } from 'express';
import { schemas } from '../../UserValidationSchema';
import { UserService } from '../services';
import { StatusResponse } from '../types';

export class UsersController {
  service: UserService;

  constructor(service: UserService) {
    this.service = service;
  }

  public async suggest(req: Request, res: Response) {
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
      const usersFound = await this.service.suggestUser(
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
  }

  public async addUser(req: Request, res: Response) {
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
      res.json(this.service.createUser(id, login, password, age));
    }
  }

  public async getById(req: Request, res: Response) {
    const { id } = req.params;

    const { error } = schemas.userById.validate({ id });
    if (error) {
      res.status(400).send({
        message: error.details.message,
        status: 'error',
      } as StatusResponse);
    } else {
      const userFound = await this.service.getUserById(id);
      res.json({
        message: userFound ? 'User successfully found' : "User wasn't found",
        status: userFound ? 'ok' : 'error',
        response: userFound,
      } as StatusResponse);
    }
  }

  public async getAll(req: Request, res: Response) {
    res.json({
      message: 'List of users got successfully',
      status: 'ok',
      response: await this.service.getUserList(),
    } as StatusResponse);
  }

  public async deleteUser(req: Request, res: Response) {
    const { id } = req.params;

    res.status(400).send(await this.service.deleteUser(id));
  }

  public async editUser(req: Request, res: Response) {
    const { id } = req.params;
    const { age, login, password } = req.body;

    const { error } = schemas.userData.validate(req.body);

    if (error) {
      res.status(400).send({
        message: error.details.message,
        status: 'error',
      } as StatusResponse);
    } else {
      res.json(this.service.updateUser(id, login, password, age));
    }
  }
}
