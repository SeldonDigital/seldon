import { ClassNameValue, twJoin, twMerge } from "tailwind-merge"

export function cn(...args: ClassNameValue[]) {
  return twJoin(args)
}
export function cnMerge(...args: ClassNameValue[]): string {
  return twMerge(args)
}
