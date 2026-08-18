import Joi from 'joi';

export const updateWorkerProfileSchema = Joi.object({
  name: Joi.string().min(2).max(100),
  bio: Joi.string().max(500).allow(''),
  category: Joi.string().valid('Plumber','Electrician','Carpenter','Painter','AC Repair','Cleaning','Driver','Cook','Security Guard','Others'),
  skills: Joi.array().items(Joi.string()),
  city: Joi.string().max(100),
  state: Joi.string().max(100),
  address: Joi.string().max(500),
  pricePerDay: Joi.number().min(100),
  experience: Joi.number().min(0)
});

export const updateAvailabilitySchema = Joi.object({
  days: Joi.array().items(Joi.string().valid('Mon','Tue','Wed','Thu','Fri','Sat','Sun')),
  blockedDates: Joi.array().items(Joi.date()),
  isAvailableNow: Joi.boolean()
});

export default { updateWorkerProfileSchema, updateAvailabilitySchema };
