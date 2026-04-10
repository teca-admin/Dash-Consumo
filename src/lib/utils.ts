import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { format, isValid } from "date-fns"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function safeFormatDate(date: Date | number | undefined | null, formatStr: string, options?: any) {
  if (!date || !isValid(date)) {
    return "";
  }
  return format(date, formatStr, options);
}
