import { z } from 'zod'

const password = z.string().min(8, 'Password must be at least 8 characters').regex(/[A-Z]/, 'Include an uppercase letter').regex(/\d/, 'Include a number')

export const identifierLoginSchema = z.object({
  identifier: z.string().trim().min(1, 'Enter your mobile number, worker ID, or admin email'),
  password: z.string().min(1, 'Password is required'),
})

export const userLoginSchema = z.object({
  mobile: z.string().regex(/^\d{10}$/, 'Mobile must be 10 digits'),
  password: z.string().min(1, 'Password is required'),
})

export const workerLoginSchema = z.object({
  workerID: z.string().regex(/^WRK-\d{4}-\d{4}$/, 'Use the format WRK-2024-0001'),
  password: z.string().min(1, 'Password is required'),
})

export const signupSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  mobile: z.string().regex(/^\d{10}$/, 'Mobile must be 10 digits'),
  password,
  confirmPassword: z.string().min(1, 'Please confirm your password'),
  country: z.string().min(2, 'Country is required'),
  state: z.string().min(2, 'State is required'),
  district: z.string().min(2, 'District is required'),
  city: z.string().min(2, 'City is required'),
  pincode: z.string().min(4, 'Pincode is required').max(10).regex(/^\d+$/, 'Pincode must be numeric'),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
})


export const profileSchema = z.object({
  name: z.string().min(2),
  bio: z.string().max(300).optional(),
  city: z.string().min(2),
  state: z.string().min(2),
  category: z.string().min(1),
  price: z.coerce.number().positive(),
  experience: z.coerce.number().min(0),
})

export const postSchema = z.object({
  title: z.string().min(2).max(60),
  description: z.string().max(300).optional(),
  category: z.string().min(1),
})

export const bookingSchema = z.object({
  date: z.string().min(1, 'Select a date'),
  description: z.string().min(5, 'Tell us a bit about the service'),
  contactNumber: z.string().regex(/^\d{10}$/, 'Enter a valid mobile number'),
})
