export const ROLES = { USER: 'user', WORKER: 'worker', ADMIN: 'admin' };
export const STATUS = { PENDING: 'pending', ACTIVE: 'active', SUSPENDED: 'suspended', REJECTED: 'rejected' };
export const CATEGORIES = ['Plumber','Electrician','Carpenter','Painter','AC Repair','Cleaning','Driver','Cook','Security Guard','Others'];
export const TOKEN_EXPIRY = { ACCESS: process.env.JWT_ACCESS_EXPIRY || '15m', REFRESH: process.env.JWT_REFRESH_EXPIRY || '7d' };
export const MAX_FILE_SIZE = 10 * 1024 * 1024;
