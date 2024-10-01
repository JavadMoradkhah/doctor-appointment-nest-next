import { REGEX_VALID_TIME } from '../constants/datetime.constants';

export interface TimeObj {
  hours: number;
  minutes: number;
  seconds: number;
}

export function isValidTime(time: any): boolean {
  if (typeof time !== 'string') return false;
  const matchResult = time.match(REGEX_VALID_TIME);
  return matchResult !== null && matchResult.length === 4;
}

export function parseTime(time: any): TimeObj | null {
  if (!isValidTime(time)) return null;
  const matchResult = time.match(REGEX_VALID_TIME);
  const [hours, minutes, seconds] = matchResult
    .slice(1, 4)
    .map((number) => parseInt(number));
  return { hours, minutes, seconds };
}

export function timeToSeconds(time: TimeObj): number {
  return time.hours * 60 * 60 + time.minutes * 60 + time.seconds;
}

export function isTimeBiggerThan(sourceTime: TimeObj, targetTime: TimeObj) {
  return timeToSeconds(sourceTime) > timeToSeconds(targetTime);
}
