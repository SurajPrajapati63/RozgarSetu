const WORKER_ID_PATTERN = /^WRK-\d{4}-\d{4}$/i;
const EMAIL_PATTERN = /@/;
const MOBILE_PATTERN = /^\d{10}$/;

export const resolveLoginTarget = (identifier, password) => {
  const trimmed = String(identifier || '').trim();

  if (!trimmed) {
    return { type: 'user', identifier: trimmed };
  }

  if (WORKER_ID_PATTERN.test(trimmed)) {
    return { type: 'worker', identifier: trimmed };
  }

  if (EMAIL_PATTERN.test(trimmed)) {
    return { type: 'admin', identifier: trimmed };
  }

  if (MOBILE_PATTERN.test(trimmed)) {
    return { type: 'user', identifier: trimmed };
  }

  return { type: 'user', identifier: trimmed };
};

export default { resolveLoginTarget };
