import { REGEX_VALID_TIME } from '../constants/datetime.constants';
import { Duration } from '../interfaces/duration.interface';

export function isTime(time: any): boolean {
  if (typeof time !== 'string') return false;
  const matchResult = time.match(REGEX_VALID_TIME);
  return matchResult !== null && matchResult.length === 4;
}

export function parseTime(time: any): Duration | null {
  if (!isTime(time)) return null;
  const matchResult = time.match(REGEX_VALID_TIME);
  const [hours, minutes, seconds] = matchResult
    .slice(1, 4)
    .map((number) => parseInt(number));
  return { hours, minutes, seconds };
}

export function durationToSeconds(duration: Duration): number {
  return (
    (duration.hours ?? 0) * 60 * 60 +
    (duration.minutes ?? 0) * 60 +
    (duration.seconds ?? 0)
  );
}
