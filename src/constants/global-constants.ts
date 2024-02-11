export const immiMinLen = 2;
export const immiMaxLen = 256;

export const accountHandleRegex = /^[a-z0-9]*[a-z][a-z0-9]*$/;
export const accountHandleMinLen = 4;
export const accountHandleMaxLen = 32;
export const isValidAccountHandle = (handle: string): boolean => {
  return (
    accountHandleRegex.test(handle) &&
    handle.length >= accountHandleMinLen &&
    handle.length <= accountHandleMaxLen
  );
};

export const passwordRegex = /^\S{8,32}$/;
export const passwordMinLen = 8;
export const passwordMaxLen = 32;
export const isValidPassword = (password: string): boolean => {
  return (
    passwordRegex.test(password) &&
    password.length >= passwordMinLen &&
    password.length <= passwordMaxLen
  );
};

const dateOptions: Intl.DateTimeFormatOptions = {
  year: "numeric",
  month: "short",
  day: "2-digit",
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
  hour12: true,
  timeZoneName: "short",
};
export const formatDate = (inputDate: Date): string => {
  return inputDate.toLocaleString(undefined, dateOptions);
};
