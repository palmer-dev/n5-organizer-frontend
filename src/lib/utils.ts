import {clsx, type ClassValue} from "clsx"
import {twMerge} from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

/** Convertit string|number|Date en Date */
export function toDate(v: string | number | Date | undefined | null): Date | undefined {
    if (v === null || v === undefined) return undefined
    if (v instanceof Date) return v;
    if (typeof v === "number") return new Date(v);
    return new Date(v);
}