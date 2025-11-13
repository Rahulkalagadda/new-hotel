import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatINR(amount?: number | string) {
  const value = typeof amount === 'string' ? parseFloat(amount) : (amount ?? 0);
  try {
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(value as number);
  } catch (e) {
    return `₹${value}`;
  }
}
