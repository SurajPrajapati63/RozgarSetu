import Joi from 'joi';

export const userSignupSchema = Joi.object({
  name: Joi.string().min(2).max(100).required(),
  mobile: Joi.string().length(10).pattern(/^[0-9]+$/).required(),
  country: Joi.string().min(2).max(100).required(),
  state: Joi.string().min(2).max(100).required(),
  district: Joi.string().min(2).max(100).required(),
  city: Joi.string().min(2).max(100).required(),
  pincode: Joi.string().min(4).max(10).pattern(/^[0-9]+$/).required(),
  password: Joi.string().min(8).pattern(/^(?=.*[A-Z])(?=.*[0-9])/).required().messages({ 'string.pattern.base': 'Password must have 1 uppercase and 1 number' }),
}).unknown(true);

export const userLoginSchema = Joi.object({ mobile: Joi.string().length(10).pattern(/^[0-9]+$/).required(), password: Joi.string().required() });

export const workerSignupSchema = Joi.object({
  name: Joi.string().min(2).max(100).required(),
  mobile: Joi.string().length(10).pattern(/^[0-9]+$/).required(),
  country: Joi.string().min(2).max(100).required(),
  state: Joi.string().min(2).max(100).required(),
  district: Joi.string().min(2).max(100).required(),
  city: Joi.string().min(2).max(100).required(),
  pincode: Joi.string().min(4).max(10).pattern(/^[0-9]+$/).required(),
  password: Joi.string().min(8).pattern(/^(?=.*[A-Z])(?=.*[0-9])/).required().messages({ 'string.pattern.base': 'Password must have 1 uppercase and 1 number' }),
}).unknown(true);

export const workerLoginSchema = Joi.object({ workerID: Joi.string().pattern(/^WRK-[0-9]{4}-[0-9]{4}$/).required(), password: Joi.string().required() });

export const adminLoginSchema = Joi.object({ email: Joi.string().email().required(), password: Joi.string().required() });

export const unifiedLoginSchema = Joi.object({ identifier: Joi.string().trim().min(1).required(), password: Joi.string().required() });

export default { userSignupSchema, userLoginSchema, workerSignupSchema, workerLoginSchema, adminLoginSchema, unifiedLoginSchema };
