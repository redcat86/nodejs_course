import {
  CreationOptional,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
  Op,
  ProjectionAlias,
} from 'sequelize';
import { Col, Fn, Literal } from 'sequelize/types/utils';
const { Sequelize } = require('sequelize');

// const sequelize = new Sequelize(
//   'postgres://cfthntot:tbwvO8dynSPoHggmOnMy_nBc53Ia8HDQ@babar.db.elephantsql.com/cfthntot'
// );

export class UserModel extends Model<
  InferAttributes<UserModel>,
  InferCreationAttributes<UserModel>
> {
  declare id: CreationOptional<number>;
  declare login: string;
  declare password: string;
  declare age: number;
  declare isdeleted: boolean;

  declare userCount?: number;
}

export class DBConnection {
  protected sequelize: any;

  constructor(connectionString: string) {
    this.sequelize = new Sequelize(connectionString);

    UserModel.init(
      {
        // Model attributes are defined here
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
      {
        sequelize: this.sequelize,
        modelName: 'user',
        timestamps: false,
      }
    );
  }

  authenticate() {
    this.sequelize.authenticate();
  }

  countByColFn(col: string): string | Fn | Col | Literal {
    return this.sequelize.fn('COUNT', this.sequelize.col(col));
  }
}
