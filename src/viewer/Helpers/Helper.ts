import { EFilter, FrameEntryType } from '../types';
import { FrameEntry } from '../../FrameData';

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
export const getName = (frame: FrameEntryType, filterData: EFilter): string => {
  if (frame.text != null) {
    return grep(frame.text, filterData.regName) || frame.text;
  }
  return 'Binary Frame';
};

export const newGetName = (frame: FrameEntry, filterData: EFilter): string => {
  if (frame.contentType !== 'binary') {
    return grep(frame.text, filterData.regName) || frame.text;
  }
  return 'Binary Frame';
};
export const checkViable = (frame: FrameEntryType, filterData: EFilter): boolean => {
  if (filterData.filter && frame.text) {
    if (filterData.isFilterInverse) {
      return !!grep(frame.text, filterData.filter);
    }
    return !grep(frame.text, filterData.filter);
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
