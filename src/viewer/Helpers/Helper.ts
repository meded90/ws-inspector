import { FrameEntry } from "../../models/FrameEntry";

export function grep(text: string, regexp: string) {
  if (!(text && regexp)) {
    return '';
  }
  try {
    const matchAll = text.matchAll((regexp as unknown) as RegExp);
    const matchAllArray = Array.from(matchAll);
    const firstMach = matchAllArray[0][1] || matchAllArray[0][0];
    if (!firstMach) {
      return '';
    }
    return firstMach;
  } catch (e) {}
  return '';
}

const padded = (num: number, d: number): string => num.toFixed(0).padStart(d, '0');

export const TimeStamp = (time: Date): string => {
  const h = time.getHours();
  const m = time.getMinutes();
  const s = time.getSeconds();
  const ms = time.getMilliseconds();
  return `${padded(h, 2)}:${padded(m, 2)}:${padded(s, 2)}.${padded(ms, 3)}`;
};

export const getName = (frame: FrameEntry, regName: string): string => {
  if (frame.opcode === 1) {
    const MAX_STRING_LENGTH = 275;
    return (
      grep(frame.text, regName).slice(0, MAX_STRING_LENGTH) ||
      frame.text.slice(0, MAX_STRING_LENGTH)
    );
  }
  return 'Binary Frame';
};

export const checkViable = (
  text: string,
  filter: string,
  isFilterInverse: boolean
): boolean => {
  if (filter && text) {
    if (isFilterInverse) {
      return !!grep(text, filter);
    }
    return !grep(text, filter);
  }
  return false;
};

export const stringToBuffer = (str: string): Uint8Array => {
  const ui8 = new Uint8Array(str.length);
  for (let i = 0; i < str.length; i += 1) {
    ui8[i] = str.charCodeAt(i);
  }
  return ui8;
};
