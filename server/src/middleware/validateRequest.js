export const validateAmount = (amount) => Number.isFinite(amount) && amount > 0;

export const validateRequired = (keys, body) => {
  for (const key of keys) {
    if (body[key] === undefined || body[key] === null || body[key] === '') return false;
  }
  return true;
};
