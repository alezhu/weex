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
     * Gets the first date of this week (Sunday).
     */
    public get FirstDate(): Date {
        if (!this._firstDate) {
            this._firstDate = Week.getWeekStartDate(this.value, this.year);
        }
        return this._firstDate;
    }

    /**
     * Gets the last date of this week (Saturday) at 23:59:59.999.
     */
    public get LastDate(): Date {
        if (!this._lastDate) {
            this._lastDate = new Date(+this.FirstDate);
            this._lastDate.setDate(this._lastDate.getDate() + 6);
            this._lastDate.setHours(23, 59, 59, 999);
        }
        return this._lastDate;
    }

    /* For a given date, get the ISO week number
     *
     * Based on information at:
     *
     *    http://www.merlyn.demon.co.uk/weekcalc.htm#WNR
     *
     * Algorithm is to find nearest thursday, it's year
     * is the year of the week number. Then get weeks
     * between that date and the first day of that year.
     *
     * Note that dates in one year can be weeks of previous
     * or next year, overlap is up to 3 days.
     *
     * e.g. 2014/12/29 is Monday in week  1 of 2015
     *      2012/1/1   is Sunday in week 52 of 2011
     */
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
     * Gets the start date (Sunday) of a specific week in a year.
     * @param weekOrWeekInfo - WeekInfo object or week number
     * @param year - Year (optional if providing WeekInfo)
     * @returns Date object representing the Sunday at the start of the week
     */
    public static getWeekStartDate(weekOrWeekInfo: WeekInfo | number, year?: number): Date {
        let week: number;
        let yearNum: number;
        if (typeof weekOrWeekInfo === 'number' && typeof year === 'number') {
            week = weekOrWeekInfo;
            yearNum = year;
        } else if (typeof weekOrWeekInfo === 'object' && weekOrWeekInfo !== null && 'week' in weekOrWeekInfo && 'year' in weekOrWeekInfo) {
            week = weekOrWeekInfo.week;
            yearNum = weekOrWeekInfo.year;
        } else {
            throw new Error('Invalid arguments: must provide either WeekInfo object or week number and year');
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

    public static from(week: number | string | Date): Week {
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
                // Try to parse as "week year" or "year week" format
                const parts = trimmed.split(/\D+/);
                if (parts.length >= 2) {
                    const num1 = parseInt(parts[0], 10);
                    const num2 = parseInt(parts[1], 10);

                    if (parts[0].length === 4 && num1 >= 1000 && num1 <= 9999) {
                        // Format: "2024 12" or "2024-12" (year week)
                        yearNum = num1;
                        weekNum = num2;
                    } else if (parts[1].length === 4 && num2 >= 1000 && num2 <= 9999) {
                        // Format: "12 2024" or "12-2024" (week year)
                        weekNum = num1;
                        yearNum = num2;
                    } else {
                        // Both are likely week numbers, use current year
                        weekNum = num1;
                    }
                } else if (parts.length === 1) {
                    // Single number, treat as week number
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
     * Creates a Week object representing the previous week.
     * @param value - Week number, date string, Date object, or Week object
     * @returns Week object for the previous week
     */
    public static prev(value: number | string | Date | Week): Week {
        const week = (value instanceof Week) ? value : Week.from(value);
        return week.prev();
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
     * Gets the previous week.
     * @returns Week object for the week before this one
     */
    public prev(): Week {
        return Week.from(new Date(+this.FirstDate - Week.MS_IN_WEEK));
    }

    /**
     * Gets the next week.
     * @returns Week object for the week after this one
     */
    public next(): Week {
        return Week.from(new Date(+this.FirstDate + Week.MS_IN_WEEK));
    }

    /**
     * Returns the string representation of the week in "YYYY.WW" format.
     * @returns String in format "YYYY.WW" (e.g., "2024.05")
     */
    public toString() {
        return `${this.year.toString().padStart(4, '0')}.${this.value.toString().padStart(2, '0')}`;
    }
}
