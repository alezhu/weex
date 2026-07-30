import {Week, WeekInfo} from "../src";

describe('Week', () => {
    const weekDiff = Date.UTC(2020, 0, 8) - Date.UTC(2020, 0, 1);
    it('should can create', function () {
        const result = new Week(1, 2020);
        expect(result).toBeDefined();
        expect(result).toBeInstanceOf(Week);
        expect(result.value).toBe(1);
        expect(result.year).toBe(2020);
    });
    it('should create with current year', function () {
        const result = new Week(1);
        expect(result).toBeDefined();
        expect(result.year).toBe(new Date().getFullYear());
    });

    it('should throw Error for week less 1', function () {
        expect(() => {
            new Week(0)
        }).toThrow('Week number must be greater than 0');
    });

    it('should throw Error for week grow 53', function () {
        expect(() => {
            new Week(99)
        }).toThrow('Week number must be less or equal 53');
    });

    describe('.from', () => {
        it('should create from Date', function () {
            const now = new Date()
            const result = Week.from(now);
            expect(result).toBeDefined();
            expect(result).toBeInstanceOf(Week);
            const expected = Week.getWeekNumber(now);
            expect(result.value).toBe(expected.week);
            expect(result.year).toBe(expected.year);
        });
        it('should create from string with week number', function () {
            const now = new Date();
            const result = Week.from('22');
            expect(result).toBeDefined();
            expect(result).toBeInstanceOf(Week);
            expect(result.year).toBe(now.getFullYear());
            expect(result.value).toBe(22);

        });

        it('should create from int with week number', function () {
            const now = new Date();
            const result = Week.from(22);
            expect(result).toBeDefined();
            expect(result).toBeInstanceOf(Week);
            expect(result.year).toBe(now.getFullYear());
            expect(result.value).toBe(22);
        });

        it('should create from string with week and year separated by -', function () {
            const result = Week.from('22-2019');
            expect(result).toBeDefined();
            expect(result).toBeInstanceOf(Week);
            expect(result.year).toBe(2019);
            expect(result.value).toBe(22);
        });
        it('should create from string with week and year separated by /', function () {
            const result = Week.from('22/2019');
            expect(result).toBeDefined();
            expect(result).toBeInstanceOf(Week);
            expect(result.year).toBe(2019);
            expect(result.value).toBe(22);
        });
        it('should create from string with week and year separated by .', function () {
            const result = Week.from('22.2019');
            expect(result).toBeDefined();
            expect(result).toBeInstanceOf(Week);
            expect(result.year).toBe(2019);
            expect(result.value).toBe(22);
        });

        it('should create from string with week and year if year goes first', function () {
            const result = Week.from('2020.22');
            expect(result).toBeDefined();
            expect(result).toBeInstanceOf(Week);
            expect(result.year).toBe(2020);
            expect(result.value).toBe(22);
        });

        it('should return same instance when passing Week object', function () {
            const existing = new Week(10, 2023);
            const result = Week.from(existing);
            expect(result).toBe(existing);
        });

        it('should create from string with W-prefix like W22.2019 or 2024-W05', function () {
            const res1 = Week.from('W22.2019');
            expect(res1.year).toBe(2019);
            expect(res1.value).toBe(22);

            const res2 = Week.from('2024-W05');
            expect(res2.year).toBe(2024);
            expect(res2.value).toBe(5);
        });

        it('should throw error for invalid week format or type', function () {
            expect(() => Week.from('abc')).toThrow('Invalid week format: abc');
            expect(() => Week.from(true as any)).toThrow('Invalid week type: boolean');
        });
    })

    describe('.prev', () => {
        it('should return prev week of same year for Week', function () {
            const week = Week.from('02-2020');
            const result = week.prev();
            expect(result.value).toBe(1);
            expect(result.year).toBe(week.year);
        });
        it('should return prev week of prev year for Week', function () {
            const week = Week.from('01-2020');
            const result = week.prev();
            const expected = Week.getWeekNumber(new Date(+week.FirstDate - weekDiff));
            expect(result.value).toBe(expected.week);
            expect(result.year).toBe(expected.year);
        });

        it('should return prev week of same year for string', function () {
            const result = Week.prev('02-2020');
            expect(result.value).toBe(1);
            expect(result.year).toBe(2020);
        });
        it('should return prev week of prev year for string', function () {
            const result = Week.prev('01-2020');
            const expected = Week.getWeekNumber(new Date(Date.UTC(2020, 0, 1) - weekDiff));
            expect(result.value).toBe(expected.week);
            expect(result.year).toBe(expected.year);
        });

        it('should return prev week of same year for Date', function () {
            const date = Week.from('02-2020').FirstDate;
            const result = Week.prev(date);
            expect(result.value).toBe(1);
            expect(result.year).toBe(2020);
        });
        it('should return prev week of prev year for Date', function () {
            const date = Week.from('01-2020').FirstDate;
            const result = Week.prev(date);
            const prevDate = new Date(+date - weekDiff);
            const expected = Week.getWeekNumber(prevDate)
            expect(result.value).toBe(expected.week);
            expect(result.year).toBe(expected.year);
        });

        it('should throw exception for invalid argument', function () {
            expect(() => Week.prev('abc')).toThrow('Invalid week format: abc');
        });
    })

    describe('.next', () => {
        it('should return next week of same year for Week', function () {
            const week = Week.from('02-2020');
            const result = week.next();
            expect(result.value).toBe(3);
            expect(result.year).toBe(week.year);
        });
        it('should return next week of next year for Week', function () {
            const week = Week.from('53-2020');
            const result = week.next();
            const expected = Week.getWeekNumber(new Date(+week.FirstDate + weekDiff));
            expect(result.value).toBe(expected.week);
            expect(result.year).toBe(expected.year);
        });

        it('should return next week of same year for string', function () {
            const result = Week.next('02-2020');
            expect(result.value).toBe(3);
            expect(result.year).toBe(2020);
        });
        it('should return next week of next year for string', function () {
            const result = Week.next('53-2020');
            const expected = Week.getWeekNumber(new Date(Date.UTC(2020, 11, 31) + weekDiff));
            expect(result.value).toBe(expected.week);
            expect(result.year).toBe(expected.year);
        });

        it('should return next week of same year for Date', function () {
            const date = Week.from('02-2020').FirstDate;
            const result = Week.next(date);
            expect(result.value).toBe(3);
            expect(result.year).toBe(2020);
        });
        it('should return next week of next year for Date', function () {
            const date = Week.from('53-2020').FirstDate;
            const result = Week.next(date);
            const nextDate = new Date(+date + weekDiff);
            const expected = Week.getWeekNumber(nextDate)
            expect(result.value).toBe(expected.week);
            expect(result.year).toBe(expected.year);
        });

        it('should throw exception for invalid argument', function () {
            expect(() => Week.next('0.2019')).toThrow('Week number must be greater than 0');
        });

    })

    describe('.FirstDate', () => {
        it('should return 30.12.2019 for week 01-2020 ', function () {
            const result = Week.from('01-2020').FirstDate;
            expect(result).toStrictEqual(new Date(2019, 11, 30));
        });
        it('should return 06.01.2020 for week 02-2020 ', function () {
            const result = Week.from('02-2020').FirstDate;
            expect(result).toStrictEqual(new Date(2020, 0, 6));
        });
        it('should return 04.01.2021 for week 01-2021 ', function () {
            const result = Week.from('01-2021').FirstDate;
            expect(result).toStrictEqual(new Date(2021, 0, 4));
        });
        it('should return same date', function () {
            const monday = new Date(2023, 8, 18);
            const result = Week.from(monday).FirstDate;
            expect(result).toStrictEqual(monday);
        });
    })

    describe('.LastDate', () => {
        it('should return 05.01.2020 for week 01-2020 ', function () {
            const result = Week.from('01-2020').LastDate;
            expect(result).toStrictEqual(new Date(2020, 0, 5, 23, 59, 59, 999));
        });
        it('should return 03.01.2021 for week 53-2020 ', function () {
            const result = Week.from('53-2020').LastDate;
            expect(result).toStrictEqual(new Date(2021, 0, 3, 23, 59, 59, 999));
        });
    })

    describe(".getWeekNumber", () => {
        it('should return { week:1, year:2020 } for 01.01.2020', function () {
            const value = new Date(2020, 0, 1);
            const result = Week.getWeekNumber(value);
            expect(result).toStrictEqual({week: 1, year: 2020});
        });

        it('should return { week: 53, year: 2020 } for 01.01.2021', function () {
            const value = new Date(2021, 0, 1);
            const result = Week.getWeekNumber(value);
            expect(result).toStrictEqual({week: 53, year: 2020});
        });

        function getData(): [WeekInfo, Date][] {
            let data: [WeekInfo, Date][] = [];
            let date = new Date(2020, 0, 1);
            const diff = +new Date(2020, 0, 8) - +date;
            // noinspection ForLoopThatDoesntUseLoopVariableJS
            for (let i = 1; date.getFullYear() < 2021; i++, date = new Date(+date + diff)) {
                data.push([{week: i, year: 2020}, date]);
            }
            return data;
        }

        test.each(getData())("should return %s for %s", (expected, date) => {
            const result = Week.getWeekNumber(date);
            expect(result).toStrictEqual(expected);
        })

        function getAllDaysAsJan01() {
            let map = new Map<number, Array<any>>()
            let year = 2020
            const isYearLeap = (year: number) => year % 4 == 0 && (year % 100 != 0 || year % 400 == 0)
            while (map.size < 7) {
                const date = new Date(Date.UTC(year, 0, 1))
                const weekDay = date.getDay() || 7
                if (!map.has(weekDay)) {
                    const expected = weekDay <= 4 ? [1, date.getFullYear()] : [isYearLeap(date.getFullYear() - 1) ? 53 : 52, date.getFullYear() - 1]
                    map.set(weekDay, [expected[0], expected[1], date])
                }
                year++;
            }
            const result = [];
            for (const entry of map.entries()) {
                result.push([entry[1][0], entry[1][1], entry[1][2], [entry[0]]])
            }
            return result.sort((a, b) => a[2] - b[2]);
        }

        test.each(getAllDaysAsJan01())("should return week %i of year %i for date %s which is %i week day", (week: number, year: number, date: Date, weekDay: number) => {
            const result = Week.getWeekNumber(date);
            expect(result).toStrictEqual({week, year});
        })
    })

    describe(".getWeekStartDate", () => {
        test.each`
            week    | year     | expectedDate
            ${1}    | ${2020}  | ${new Date(2019, 11, 30)}
            ${2}    | ${2020}  | ${new Date(2020, 0, 6)}
            ${1}    | ${2021}  | ${new Date(2021, 0, 4)}
            ${53}   | ${2020}  | ${new Date(2020, 11, 28)}
            ${1}   | ${2023}  | ${new Date(2023, 0, 2)}
            ${38}   | ${2023}  | ${new Date(2023, 8, 18)}
        `('should return $expectedDate for $week-$year', ({week, year, expectedDate}) => {
            const result = Week.getWeekStartDate(week, year);
            expect(result).toStrictEqual(expectedDate);
        });

        it('should accept WeekInfo', () => {
            const result = Week.getWeekStartDate({week: 1, year: 2023});
            expect(result).toStrictEqual(new Date(2023, 0, 2));
        });

        it('should accept Week instance', () => {
            const week = new Week(1, 2023);
            const result = Week.getWeekStartDate(week);
            expect(result).toStrictEqual(new Date(2023, 0, 2));
        });
    })

    describe('toString', () => {
        it('should return valid string representation', function () {
            const week = Week.from('01/2020');
            const result = week.toString();
            expect(result).toBe('2020.01')
        });
        it('should auto convert to string', function () {
            const week = Week.from('10/2020');
            const result = "" + week;
            expect(result).toBe('2020.10')
        });
    });

    describe('camelCase getters', () => {
        it('firstDate should match FirstDate', () => {
            const week = new Week(5, 2024);
            expect(week.firstDate).toStrictEqual(week.FirstDate);
        });

        it('lastDate should match LastDate', () => {
            const week = new Week(5, 2024);
            expect(week.lastDate).toStrictEqual(week.LastDate);
        });
    });

    describe('comparison methods', () => {
        it('compareTo should return correct sign', () => {
            const w1 = new Week(10, 2023);
            const w2 = new Week(12, 2023);
            const w3 = new Week(5, 2024);

            expect(w1.compareTo(w2)).toBeLessThan(0);
            expect(w2.compareTo(w1)).toBeGreaterThan(0);
            expect(w1.compareTo(w1)).toBe(0);
            expect(w1.compareTo(w3)).toBeLessThan(0);
        });

        it('equals should compare correctly', () => {
            const w1 = new Week(10, 2023);
            const w2 = new Week(10, 2023);
            const w3 = new Week(11, 2023);

            expect(w1.equals(w2)).toBe(true);
            expect(w1.equals(w3)).toBe(false);
            expect(w1.equals(null as any)).toBe(false);
        });

        it('isBefore and isAfter should return boolean', () => {
            const w1 = new Week(10, 2023);
            const w2 = new Week(15, 2023);

            expect(w1.isBefore(w2)).toBe(true);
            expect(w2.isBefore(w1)).toBe(false);
            expect(w2.isAfter(w1)).toBe(true);
            expect(w1.isAfter(w2)).toBe(false);
        });
    });

    describe('contains', () => {
        it('should return true for date inside week and false for outside', () => {
            const week = new Week(1, 2024); // Mon Jan 01 2024 to Sun Jan 07 2024
            const inside = new Date(2024, 0, 3, 12, 0, 0);
            const before = new Date(2023, 11, 31, 23, 59, 59);
            const after = new Date(2024, 0, 8, 0, 0, 0);

            expect(week.contains(inside)).toBe(true);
            expect(week.contains(before)).toBe(false);
            expect(week.contains(after)).toBe(false);
        });
    });

    describe('getDays and toDateRange', () => {
        it('getDays should return 7 consecutive dates from Monday to Sunday', () => {
            const week = new Week(1, 2024);
            const days = week.getDays();

            expect(days).toHaveLength(7);
            expect(days[0]).toStrictEqual(week.firstDate);
            expect(days[6].getDate()).toBe(7);
        });

        it('toDateRange should return start and end Date', () => {
            const week = new Week(1, 2024);
            const range = week.toDateRange();

            expect(range.start).toStrictEqual(week.firstDate);
            expect(range.end).toStrictEqual(week.lastDate);
        });
    });

    describe('toISOString', () => {
        it('should return string in YYYY-Www format', () => {
            const week = new Week(5, 2024);
            expect(week.toISOString()).toBe('2024-W05');
        });
    });

    describe('static helpers: current, now, getWeeksInYear', () => {
        it('current and now should return Week instance for current date', () => {
            const curr = Week.current();
            const n = Week.now();
            expect(curr).toBeInstanceOf(Week);
            expect(n).toBeInstanceOf(Week);
            expect(curr.equals(n)).toBe(true);
        });

        it('getWeeksInYear should return 52 or 53', () => {
            expect(Week.getWeeksInYear(2020)).toBe(53);
            expect(Week.getWeeksInYear(2023)).toBe(52);
            expect(Week.getWeeksInYear(2024)).toBe(52);
        });
    });
})
