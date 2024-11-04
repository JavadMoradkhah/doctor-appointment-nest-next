// Constants

export const Weekdays = {
  0: 'یکشنبه',
  1: 'دوشنبه',
  2: 'سه‌شنبه',
  3: 'چهارشنبه',
  4: 'پنجشنبه',
  5: 'جمعه',
  6: 'شنبه',
};

// Error Messages

export const ERR_MSG_WORKING_DAY_WAS_NOT_FOUND_BY_DATE =
  'تاریخ انتخاب شده خارج از ایام کاری می باشد';

export const ERR_MSG_WORKING_DAY_UNIQUENESS_VIOLATION =
  'شما قبلا این روز کاری را اضافه کرده اید';

export const ERR_MSG_WORKING_DAY_MIN_DURATION =
  'روز کاری حداقل باید یک ساعت باشد';

export const ERR_MSG_WORKING_DAY_MAX_DURATION =
  'روز کاری حداکثر باید ۱۲ ساعت باشد';

export const ERR_MSG_WORKING_DAY_BREAK_START_MIN_DIFF_WITH_START_TIME =
  'زمان استراحت حداقل باید یک ساعت بعد از شروع روز کاری باشد';

export const ERR_MSG_WORKING_DAY_BREAK_TIME_MIN_DURATION =
  'زمان استراحت حداقل باید 15 دقیقه باشد';

export const ERR_MSG_WORKING_DAY_BREAK_TIME_MAX_DURATION =
  'زمان استراحت حداکثر باید 6 ساعت باشد';

export const ERR_MSG_WORKING_DAY_BREAK_END_TIME_BEFORE_WORKING_DAY_END_TIME =
  'زمان استراحت باید قبل از زمان به پابان رسیدن روز کاری باشد';
