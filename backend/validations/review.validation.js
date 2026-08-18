import Joi from 'joi';

export const reviewSchema = Joi.object({ bookingId: Joi.string().required(), rating: Joi.number().min(1).max(5).required(), comment: Joi.string().min(10).max(500).required() });

export default { reviewSchema };
