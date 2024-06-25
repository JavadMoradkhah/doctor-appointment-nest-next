// Regex
export const REGEX_PASSWORD =
  /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/;

export const REGEX_PHONE = /^09[0-9]{9}$/;

// Error Messages
export const ERR_MSG_PASSWORD =
  'کلمه عبور باید حداقل شامل یک حرف بزرگ، یک حرف کوچک و یک عدد باشد';

export const ERR_MSG_INVALID_PHONE = 'شماره موبایل نامعتبر است';

export const ERR_MSG_INVALID_PHONE_OR_PASSWORD =
  'شماره موبایل یا کلمه عبور نامعتبر است';

export const ERR_MSG_OTP_HAS_NOT_EXPIRED_YET = 'کد تایید هنوز منقضی نشده است';

export const ERR_MSG_OTP_HAS_NOT_BEEN_SENT_OR_EXPIRED =
  'کد تایید ارسال نشده یا منقضی شده است';

export const ERR_MSG_INVALID_OTP = 'کد تایید وارد شده نامتعبر است';

export const ERR_MSG_LOGIN_REQUIRED = 'وارد حساب کاربری خود شوید';

export const ERR_MSG_ACCOUNT_IS_INACTIVE = 'حساب کاربری شما غیرفعال شده است';

export const ERR_MSG_ACCOUNT_DOES_NOT_EXIST = 'حساب کاربری شما غیرفعال شده است';

export const ERR_MSG_TOKEN_EXPIRED = 'توکن منقضی شده است';

export const ERR_MSG_INVALID_TOKEN = 'توکن نامعتبر است';
