const Joi = require('joi');

export const schemas = {
  userData: Joi.object({
    id: Joi.required(),
    login: Joi.string().alphanum().min(3).max(30).required(),

    password: Joi.string()
      .pattern(new RegExp('^[a-zA-Z0-9]{3,30}$'))
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
