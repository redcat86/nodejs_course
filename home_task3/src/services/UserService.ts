import { DataTypes, Op } from 'sequelize';
import { DBConnection } from '../data-access';
import { UserModel } from '../models/UserModel';

export type StatusMessage = {
  message: string;
  status: 'ok' | 'error';
};

export default class UserService {
  connection: DBConnection;
  constructor(connection: DBConnection) {
    this.connection = connection;

    connection.defineModel(
      'User',
      {
        id: {
          type: DataTypes.INTEGER,
          allowNull: false,
          primaryKey: true,
        },
        login: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        password: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        age: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
        isdeleted: {
          type: DataTypes.BOOLEAN,
          allowNull: true,
        },
      },
      'user'
    );
  }

  async getUserList() {
    const usersDB = await UserModel.findAll();

    return usersDB.filter((user: UserModel) => !user.dataValues['isdeleted']);
  }

  async getUserById(id: string) {
    return await UserModel.findAll({ where: { id } });
  }

  async suggestUser(searchStr: string, limitNum: number) {
    const usersCount = await UserModel.findOne({
      attributes: [[this.connection.countByColFn('id'), 'userCount']],
      where: { isdeleted: false },
    });

    return await UserModel.findAll({
      where: {
        login: { [Op.like]: `%${searchStr?.toString() || ''}%` },
        isdeleted: false,
      },
      limit:
        limitNum < (usersCount?.dataValues['userCount'] ?? 0)
          ? limitNum
          : usersCount?.dataValues['userCount'] ?? 0,
    });
  }

  async deleteUser(id: string): Promise<StatusMessage> {
    const user = await UserModel.findAll({ where: { id } });

    if (!user) {
      return {
        message: "User doesn't exist.",
        status: 'error',
      };
    } else {
      await UserModel.update({ isdeleted: true }, { where: { id } });
      return {
        message: 'User successfuly deleted.',
        status: 'ok',
      };
    }
  }

  async updateUser(
    id: string,
    login: string,
    password: string,
    age: number
  ): Promise<StatusMessage> {
    const user = await UserModel.findAll({ where: { id } });

    if (!user) {
      return {
        message: "User dosn't exist.",
        status: 'error',
      };
    } else {
      await UserModel.update({ age, login, password }, { where: { id } });

      return {
        status: 'ok',
        message: 'User has been updated.',
      };
    }
  }

  async createUser(
    id: string,
    login: string,
    password: string,
    age: number
  ): Promise<StatusMessage> {
    const duplicate = await UserModel.findAll({ where: { id } });

    if (duplicate) {
      return {
        message: 'User already exist.',
        status: 'error',
      };
    } else {
      await UserModel.create({
        login,
        password,
        age,
        isdeleted: false,
      });
      return { status: 'ok', message: 'User added' };
    }
  }
}
