// Regex
export const REGEX_PASSWORD =
  /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/;

export const REGEX_PHONE = /^09[0-9]{9}$/;

// Constants
export const COOKIE_ACCESS_TOKEN = 'accessToken';
export const COOKIE_REFRESH_TOKEN = 'refreshToken';

export const MSG_YOU_HAVE_SUCCESSFULLY_LOGGED_IN =
  'با موفقیت وارد حساب کاربری شدید';

export const MSG_YOU_HAVE_SUCCESSFULLY_SIGNED_UP =
  'حساب کاربری با موفقیت ایجاد شد';

export const ERR_MSG_YOU_DO_NOT_HAVE_AN_ACCOUNT = 'شما هنوز ثبت نام نکرده اید';

export const ERR_MSG_YOU_ALREADY_SIGNED_UP =
  'شما قبلا با این شماره موبایل ثبت نام کرده اید';

export const ERR_MSG_NATIONAL_CODE_UNIQUENESS_VIOLATION = 'کد ملی تکراری است';

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
