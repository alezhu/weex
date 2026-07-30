# @alezhu/weex
![GitHub package.json dynamic](https://img.shields.io/github/package-json/v/alezhu/weex)
![GitHub Workflow Status](https://img.shields.io/github/actions/workflow/status/alezhu/weex/build_and_test.js.yml)
![Coverage Status](https://img.shields.io/endpoint?url=https://raw.githubusercontent.com/alezhu/weex/badges/coverage.json)
![GitHub commit activity (branch)](https://img.shields.io/github/commit-activity/w/alezhu/weex)
![npm](https://img.shields.io/npm/dt/%40alezhu/weex)
![NPM](https://img.shields.io/npm/l/%40alezhu%2Fweex)
![GitHub code size in bytes](https://img.shields.io/github/languages/code-size/alezhu/weex)
![npm package minimized gzipped size (scoped version select exports)](https://img.shields.io/bundlejs/size/%40alezhu/weex)

npm package for getting week information.

**Table of contents:**

1. [Install](#install)
2. [Usage](#usage)
3. [API](#api)

Install
-------
Install with [npm](https://www.npmjs.com/):
```sh
$ npm install --save @alezhu/weex
```

Usage
-----
### CommonJs (index.js)
```js
const {Week} = require('@alezhu/weex');

const week = new Week(1, 2023);
const firstDate = week.FirstDate;
console.log(firstDate);
//=> 2023-01-01T21:00:00.000Z for Moscow
//=> 2023-01-02T00:00:00.000Z for UTC
```

### ESModule (index.mjs or "type":"module" in package.json)
```js
import {Week} from '@alezhu/weex';

const week = new Week(1, 2023);
const firstDate = week.FirstDate;
console.log(firstDate);
//=> 2023-01-01T21:00:00.000Z for Moscow
//=> 2023-01-02T00:00:00.000Z for UTC
```

### TypeScript
```ts
import {Week} from '@alezhu/weex';

const week = new Week(1, 2023);
const firstDate = week.FirstDate;
console.log(firstDate);
//=> 2023-01-01T21:00:00.000Z for Moscow
//=> 2023-01-02T00:00:00.000Z for UTC
```

API
---

### Constructor
```js
Week(value:int, year ? : int)
```

Create instance of Week

Parameters:
- value - week number per year [1..N], N = 53 for leap year, 52 is other cases. First week in year is week with first
  thursday
- year - full year (e.g. 2023, 1978 etc.). Optional. If omitted then used current year

Usage example:
```js
const week = new Week(1, 2020);
```

### firstDate / FirstDate
```js
get firstDate(): Date
get FirstDate(): Date
```

Returns first date (Date) of week (monday). Time in returned date is 00:00:00.000

Usage example:
```js
const week = new Week(1, 2020);
const date = week.firstDate; // 2019-12-30T00:00:00.000Z
```

### lastDate / LastDate
```js
get lastDate(): Date
get LastDate(): Date
```

Returns last date (Date) of week (sunday). Time in returned date is 23:59:59.999

Usage example:
```js
const week = new Week(1, 2020);
const date = week.lastDate; // 2020-01-05T23:59:59.999Z
```

### compareTo
```js
compareTo(other: Week): number
```

Compares this week chronologically with another week. Returns negative if earlier, positive if later, 0 if equal.

Usage example:
```js
const w1 = new Week(10, 2023);
const w2 = new Week(12, 2023);
w1.compareTo(w2); //=> -2
```

### contains
```js
contains(date: Date): boolean
```

Checks if a given date falls within this week.

Usage example:
```js
const week = new Week(1, 2024);
week.contains(new Date(2024, 0, 3)); //=> true
```

### equals
```js
equals(other: Week): boolean
```

Checks if this week equals another week.

Usage example:
```js
w1.equals(w2); //=> false
```

### getDays
```js
getDays(): Date[]
```

Returns an array of all 7 dates (Monday through Sunday) for this week.

Usage example:
```js
const days = week.getDays(); //=> [Mon, Tue, Wed, Thu, Fri, Sat, Sun]
```

### isBefore / isAfter
```js
isBefore(other: Week): boolean
isAfter(other: Week): boolean
```

Checks if this week is strictly before or after another week.

### prev / next
```js
prev(): Week
next(): Week
```

Returns previous or next week instance.

### toDateRange
```js
toDateRange(): { start: Date, end: Date }
```

Returns the date range of the week (start Monday 00:00:00.000 to end Sunday 23:59:59.999).

### toISOString
```js
toISOString(): string
```

Returns ISO 8601 week string representation (e.g. `"2024-W05"`).

### toString
```js
toString(): string
```

Returns week string representation in `"YYYY.WW"` format (e.g. `"2024.05"`).

### Week.current / Week.now
```js
static current(): Week
static now(): Week
```

Returns Week instance for the current date.

### Week.from
```js
static from(week: number | string | Date | Week): Week
```

Returns Week instance for passed value.

Parameters:
- `week`
  - If passed `Week` instance, returns it directly.
  - If passed `Date` object, detects ISO week number.
  - If passed `number`, treats as week number of current year.
  - If passed `string`:
    - Parsed as week number, `"YYYY-WW"`, `"YYYY-Www"`, `"Www.YYYY"`, or `"WW-YYYY"`.

Usage example:
```js
const currentWeek = Week.from(new Date());
const week35 = Week.from(35);
const weekIso = Week.from('2024-W05');
const weekCustom = Week.from('W22.2019');
```

### Week.getWeekNumber
```js
static getWeekNumber(dDate: Date): WeekInfo
```

Returns `WeekInfo` object `{week: int, year: int}` for passed date.

### Week.getWeeksInYear
```js
static getWeeksInYear(year: number): number
```

Returns total number of ISO weeks in a given year (52 or 53).

### Week.getWeekStartDate
```js
static getWeekStartDate(weekOrWeekInfo: WeekInfo | Week | number, year?: number): Date
```

Returns week start date (Monday 00:00:00.000) for specified week.

### Week.prev / Week.next
```js
static prev(value: number | string | Date | Week): Week
static next(value: number | string | Date | Week): Week
```

Returns previous or next week for passed week value.

