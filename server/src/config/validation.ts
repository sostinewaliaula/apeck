import * as Joi from 'joi';

export const validationSchema = Joi.object({
  APP_PORT: Joi.number().default(4000),
  APP_URL: Joi.string().uri().default('http://localhost:4000'),

  DB_HOST: Joi.string().required(),
  DB_PORT: Joi.number().default(3306),
  DB_USER: Joi.string().required(),
  DB_PASSWORD: Joi.string().allow(''),
  DB_NAME: Joi.string().required(),

  JWT_ACCESS_SECRET: Joi.string().min(16).required(),
  JWT_REFRESH_SECRET: Joi.string().min(16).required(),
  JWT_ACCESS_TTL: Joi.string().default('900s'),
  JWT_REFRESH_TTL: Joi.string().default('7d'),

  PASSWORD_PEPPER: Joi.string().min(8).required(),
});
