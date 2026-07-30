/**
 * Interface representing week information.
 */
export interface WeekInfo {
    /** Week number (1-53) */
    week: number;
    /** Year */
    year: number;
}

/**
 * Class representing a week number in a specific year.
 */
export class Week {
    /** Number of milliseconds in a week */
    public static readonly MS_IN_WEEK = 7 * 60 * 60 * 24 * 1000;

    /** Week number (1-53) */
    public readonly value: number;

    /** Year */
    public readonly year: number;

    /** Cached first date of the week */
    private _firstDate: Date | null = null;

    /** Cached last date of the week */
    private _lastDate: Date | null = null;

    public constructor(value: number, year?: number) {
        if (!(value > 0)) throw new Error("Week number must be greater than 0");
        if (value > 53) throw new Error("Week number must be less or equal 53");
        this.value = value;
        this.year = year || new Date().getFullYear();
    }

    /**
     * Compares this week with another week.
     * @param other - Week to compare against
     * @returns Negative if earlier, positive if later, 0 if equal
     */
    public compareTo(other: Week): number {
        if (this.year !== other.year) {
            return this.year - other.year;
        }
        return this.value - other.value;
    }

    /**
     * Checks if a given date falls within this week.
     * @param date - Date to check
     * @returns True if date is within week, false otherwise
     */
    public contains(date: Date): boolean {
        const time = date.getTime();
        return time >= this.FirstDate.getTime() && time <= this.LastDate.getTime();
    }

    /**
     * Returns the current week for the current date.
     * @returns Week instance for current date
     */
    public static current(): Week {
        return Week.from(new Date());
    }

    /**
     * Checks if this week equals another week.
     * @param other - Week to compare
     * @returns True if both year and week number match
     */
    public equals(other: Week): boolean {
        return other instanceof Week && this.year === other.year && this.value === other.value;
    }

    /**
     * Gets the first date of this week (Monday).
     */
    public get firstDate(): Date {
        return this.FirstDate;
    }

    /**
     * Gets the first date of this week (Monday).
     */
    public get FirstDate(): Date {
        if (!this._firstDate) {
            this._firstDate = Week.getWeekStartDate(this.value, this.year);
        }
        return this._firstDate;
    }

    /**
     * Returns all 7 dates (Monday through Sunday) of this week.
     * @returns Array of 7 Date objects
     */
    public getDays(): Date[] {
        const days: Date[] = [];
        const start = new Date(+this.FirstDate);
        for (let i = 0; i < 7; i++) {
            const day = new Date(+start);
            day.setDate(start.getDate() + i);
            days.push(day);
        }
        return days;
    }

    /**
     * Creates a Week object from various input types.
     * @param week - Week number, date string, Date object, or Week object
     * @returns Week instance
     */
    public static from(week: number | string | Date | Week): Week {
        if (week instanceof Week) {
            return week;
        }

        if (week instanceof Date) {
            const weekInfo = Week.getWeekNumber(week);
            return new Week(weekInfo.week, weekInfo.year);
        }

        let weekNum: number;
        let yearNum: number = new Date().getFullYear();

        if (typeof week === 'number') {
            weekNum = week;
        } else if (typeof week === 'string') {
            const trimmed = week.trim();

            // Try to parse as just week number (e.g., "5")
            if (trimmed.length <= 2 && /^\d{1,2}$/.test(trimmed)) {
                weekNum = parseInt(trimmed, 10);
            } else {
                // Try to parse as "week year", "year week", "W22.2019", "2024-W05" etc.
                const parts = trimmed.split(/\D+/).filter(Boolean);
                if (parts.length >= 2) {
                    const num1 = parseInt(parts[0], 10);
                    const num2 = parseInt(parts[1], 10);

                    if (parts[0].length === 4 && num1 >= 1000 && num1 <= 9999) {
                        // Format: "2024 12" or "2024-12" or "2024-W12" (year week)
                        yearNum = num1;
                        weekNum = num2;
                    } else if (parts[1].length === 4 && num2 >= 1000 && num2 <= 9999) {
                        // Format: "12 2024" or "12-2024" or "W12-2024" (week year)
                        weekNum = num1;
                        yearNum = num2;
                    } else {
                        // Both are numbers, use first as week number and current year
                        weekNum = num1;
                    }
                } else if (parts.length === 1) {
                    // Single number (e.g. "W05" or "5")
                    weekNum = parseInt(parts[0], 10);
                } else {
                    throw new Error(`Invalid week format: ${week}`);
                }
            }
        } else {
            throw new Error(`Invalid week type: ${typeof week}`);
        }

        return new Week(weekNum, yearNum);
    }

    /**
     * Gets the ISO week number for a given date.
     * @param dDate - The date to get week number for
     * @returns WeekInfo object containing week number and year
     */
    public static getWeekNumber(dDate: Date): WeekInfo {
        // Copy date so don't modify original
        const d = new Date(+dDate);
        d.setHours(0, 0, 0, 0);
        // Set to nearest Thursday: current date + 4 - current day number
        // Make Sunday's day number 7
        d.setDate(d.getDate() + 4 - (d.getDay() || 7));
        // Get first day of year
        const yearStart = new Date(d.getFullYear(), 0, 1);
        // Calculate full weeks to nearest Thursday
        const weekNo = Math.ceil((((d.getTime() - yearStart.getTime()) / 86400000) + 1) / 7);
        // Return week info
        return {week: weekNo, year: yearStart.getFullYear()};
    }

    /**
     * Gets the start date (Monday) of a specific week in a year.
     * @param weekOrWeekInfo - WeekInfo object, Week instance, or week number
     * @param year - Year (optional if providing WeekInfo or Week instance)
     * @returns Date object representing the Monday at the start of the week
     */
    public static getWeekStartDate(weekOrWeekInfo: WeekInfo | Week | number, year?: number): Date {
        let week: number;
        let yearNum: number;
        if (typeof weekOrWeekInfo === 'number' && typeof year === 'number') {
            week = weekOrWeekInfo;
            yearNum = year;
        } else if (weekOrWeekInfo instanceof Week) {
            week = weekOrWeekInfo.value;
            yearNum = weekOrWeekInfo.year;
        } else if (typeof weekOrWeekInfo === 'object' && weekOrWeekInfo !== null && 'week' in weekOrWeekInfo && 'year' in weekOrWeekInfo) {
            week = weekOrWeekInfo.week;
            yearNum = weekOrWeekInfo.year;
        } else {
            throw new Error('Invalid arguments: must provide either WeekInfo object, Week instance, or week number and year');
        }
        const date = new Date(yearNum, 0, 1);
        const dayNum = date.getDay() || 7;
        let dayDelta = (week - 1) * 7;
        // If 1 Jan is Friday to Sunday, go to next week
        if (dayNum > 4) {
            dayDelta += 7;
        }
        // Add required number of days
        date.setDate(1 - dayNum + (dayDelta + 1));
        return date;
    }

    /**
     * Gets the total number of ISO weeks in a given year (52 or 53).
     * @param year - Year to check
     * @returns Total number of weeks in the year (52 or 53)
     */
    public static getWeeksInYear(year: number): number {
        return Week.getWeekNumber(new Date(year, 11, 28)).week;
    }

    /**
     * Checks if this week is after another week.
     * @param other - Week to compare against
     * @returns True if this week is after other
     */
    public isAfter(other: Week): boolean {
        return this.compareTo(other) > 0;
    }

    /**
     * Checks if this week is before another week.
     * @param other - Week to compare against
     * @returns True if this week is before other
     */
    public isBefore(other: Week): boolean {
        return this.compareTo(other) < 0;
    }

    /**
     * Gets the last date of this week (Sunday) at 23:59:59.999.
     */
    public get lastDate(): Date {
        return this.LastDate;
    }

    /**
     * Gets the last date of this week (Sunday) at 23:59:59.999.
     */
    public get LastDate(): Date {
        if (!this._lastDate) {
            this._lastDate = new Date(+this.FirstDate);
            this._lastDate.setDate(this._lastDate.getDate() + 6);
            this._lastDate.setHours(23, 59, 59, 999);
        }
        return this._lastDate;
    }

    /**
     * Gets the next week.
     * @returns Week object for the week after this one
     */
    public next(): Week {
        return Week.from(new Date(+this.FirstDate + Week.MS_IN_WEEK));
    }

    /**
     * Creates a Week object representing the next week.
     * @param value - Week number, date string, Date object, or Week object
     * @returns Week object for the next week
     */
    public static next(value: number | string | Date | Week): Week {
        const week = (value instanceof Week) ? value : Week.from(value);
        return week.next();
    }

    /**
     * Returns the current week for the current date (alias for current).
     * @returns Week instance for current date
     */
    public static now(): Week {
        return Week.current();
    }

    /**
     * Gets the previous week.
     * @returns Week object for the week before this one
     */
    public prev(): Week {
        return Week.from(new Date(+this.FirstDate - Week.MS_IN_WEEK));
    }

    /**
     * Creates a Week object representing the previous week.
     * @param value - Week number, date string, Date object, or Week object
     * @returns Week object for the previous week
     */
    public static prev(value: number | string | Date | Week): Week {
        const week = (value instanceof Week) ? value : Week.from(value);
        return week.prev();
    }

    /**
     * Returns the date range of this week (start Monday 00:00:00.000 to end Sunday 23:59:59.999).
     * @returns Object containing start and end Date objects
     */
    public toDateRange(): { start: Date; end: Date } {
        return {
            start: new Date(+this.FirstDate),
            end: new Date(+this.LastDate)
        };
    }

    /**
     * Returns the ISO 8601 string representation of the week in "YYYY-Www" format.
     * @returns String in format "YYYY-Www" (e.g., "2024-W05")
     */
    public toISOString(): string {
        return `${this.year.toString().padStart(4, '0')}-W${this.value.toString().padStart(2, '0')}`;
    }

    /**
     * Returns the string representation of the week in "YYYY.WW" format.
     * @returns String in format "YYYY.WW" (e.g., "2024.05")
     */
    public toString() {
        return `${this.year.toString().padStart(4, '0')}.${this.value.toString().padStart(2, '0')}`;
    }
}
