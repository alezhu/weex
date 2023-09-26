export interface WeekInfo {
    week: number,
    year: number,
}

export class Week {
    public static readonly MS_IN_WEEK = 7 * 60 * 60 * 24 * 1000;
    public readonly value: number;
    public readonly year: number;
    private _firstDate: Date | null | undefined = null;
    private _lastDate: Date | null | undefined = null;

    public constructor(value: number, year?: number) {
        if (!(value > 0)) throw new Error("Week number must be grow 0");
        if (value > 53) throw new Error("Week number must be less or equal 53");
        this.value = value;
        this.year = year || new Date().getFullYear();
    }

    public get FirstDate(): Date {
        if (!this._firstDate) {
            this._firstDate = Week.getWeekStartDate(this.value, this.year);
        }
        return this._firstDate;
    }

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

    public static getWeekStartDate(weekInfo: WeekInfo): Date;

    public static getWeekStartDate(week: number, year: number): Date;

    public static getWeekStartDate(weekOrWeekInfo: unknown, year?: number): Date {
        let week: number;
        if ((Number.isInteger(weekOrWeekInfo) && Number.isInteger(year))) {
            week = weekOrWeekInfo as number;
        } else {
            ({week, year} = weekOrWeekInfo as WeekInfo);
        }
        const date = new Date(<number>year, 0, 1);
        const dayNum = date.getDay() || 7;
        let dayDelta = (week - 1) * 7;
        // If 1 Jan is Friday to Sunday, go to next week
        if ((dayNum > 4)) {
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
        } else {
            let iWeek = 0;
            let year = 0;
            const toInt = (value: any): number => {
                return (typeof value === 'string') ? Number.parseInt(value, 10) : (typeof value === 'undefined') ? 0 : value;
            }
            if (Number.isInteger(week)) {
                iWeek = toInt(week);
                year = new Date().getFullYear();
            } else {
                week = (<string>week).trim();
                if (week.length <= 2) {
                    iWeek = toInt(week);
                    year = new Date().getFullYear();
                } else {
                    let aWeek = week.match(/^(\d{1,4})\D+(\d{1,4})$/);
                    if (aWeek && aWeek.length == 3) {
                        if (aWeek[1].length === 4) {
                            iWeek = toInt(aWeek[2]);
                            year = toInt(aWeek[1]);
                        } else {
                            iWeek = toInt(aWeek[1]);
                            year = toInt(aWeek[2]);
                        }
                    }
                }

            }
            return new Week(iWeek, year);
        }
    }

    public static prev(value: number | string | Date | Week): Week {
        const week = (value instanceof Week) ? value : Week.from(value);
        return week.prev();
    }

    public static next(value: number | string | Date | Week): Week {
        const week = (value instanceof Week) ? value : Week.from(value);
        return week.next();
    }

    public prev(): Week {
        return Week.from(new Date(+this.FirstDate - Week.MS_IN_WEEK));
    }

    public next(): Week {
        return Week.from(new Date(+this.FirstDate + Week.MS_IN_WEEK));
    }

    public toString() {
        return `${this.year.toString().padStart(4, '0')}.${this.value.toString().padStart(2, '0')}`;
    }
}
