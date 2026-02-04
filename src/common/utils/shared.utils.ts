import { Decimal } from 'decimal.js';

/**
 * Checks if a year is a leap year.
 * Leap year logic: divisible by 4 but not 100, unless divisible by 400.
 * @param year The year to check
 * @returns True if leap year, false otherwise
 */
export const isLeapYear = (year: number): boolean => {
    return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
};

/**
 * Formats a decimal to a fixed string (8 decimal places) for DB storage.
 * @param amount The decimal amount to format
 * @returns Formatted string
 */
export const formatAmount = (amount: Decimal): string => {
    return amount.toFixed(8);
};
