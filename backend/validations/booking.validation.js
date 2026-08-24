import Joi from 'joi';

export const createBookingSchema = Joi.object({
  workerId: Joi.string().required(),
  serviceDate: Joi.alternatives().try(
    Joi.date().required(),
    Joi.string().isoDate().required()
  ).required(),
  serviceDescription: Joi.string().min(10).max(500).required(),
  contactNumber: Joi.string().length(10).pattern(/^[0-9]+$/).required(),
  amount: Joi.number().min(100).required()
});

export const statusUpdateSchema = Joi.object({
  status: Joi.string().valid('accepted', 'rejected', 'completed').required(),
  cancelReason: Joi.string().max(200).allow('', null).when('status', {
    is: 'rejected',
    then: Joi.required(),
    otherwise: Joi.optional()
  })
});

export default { createBookingSchema, statusUpdateSchema };
