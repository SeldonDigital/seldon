type ClassValue = string | number | null | undefined | false

function join(args: ClassValue[]): string {
  return args.filter(Boolean).join(" ")
}

export function cn(...args: ClassValue[]): string {
  return join(args)
}

export function cnMerge(...args: ClassValue[]): string {
  return join(args)
}
