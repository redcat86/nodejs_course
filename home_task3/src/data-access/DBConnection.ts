import { Col, Fn, Literal } from 'sequelize/types/utils';

const { Sequelize } = require('sequelize');

export class DBConnection {
  protected sequelize: any;

  constructor(connectionString: string) {
    this.sequelize = new Sequelize(connectionString);
  }

  defineModel(modelName: string, modelAttributes: any, name: string) {
    this.sequelize.define(modelName, modelAttributes, {
      sequelize: this.sequelize,
      modelName: name,
      timestamps: false,
    });
  }

  authenticate() {
    this.sequelize.authenticate();
  }

  countByColFn(col: string): string | Fn | Col | Literal {
    return this.sequelize.fn('COUNT', this.sequelize.col(col));
  }
}
