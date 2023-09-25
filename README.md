# @alezhu/weex

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

### FirstDate
```js
get FirstDate():Date
```

Returns first date (Date) of week (monday). Time in returned date is 00:00:00.000

Usage example:
```js
const week = new Week(1, 2020);
const date = week.FirstDate;
```

### LastDate
```js
get LastDate():Date
```

Returns last date (Date) of week (sunday). Time in returned date is 23:59:59.999

Usage example:
```js
const week = new Week(1, 2020);
const date = week.LastDate;
```

### prev
```js
prev():Week
```

Returns previous week

Usage example:
```js
const week = Week.from('02-2020');
const result = week.prev(); //=> 2020.01
```

### next
```js
next():Week
```

Returns next week

Usage example:
```js
const week = Week.from('02-2020');
const result = week.next(); //=> 2020.03
```

### toString
```js
toString():string;
```

Returns week string representation

Usage example:
```js
const week = Week.from('02-2020');
const result = week.toString(); //=> 2020.01
```

### Week.getWeekNumber
```js
static getWeekNumber(dDate:Date):WeekInfo
```

Returns WeekInfo object ``{week:int,year:int}`` for passed date

Parameters:
- dDate - Date object

Usage example:
```js
const {week, year} = Week.getWeekNumber(new Date());
```

### Week.getWeekStartDate

```js
static getWeekStartDate(weekInfo:WeekInfo):Date
static getWeekStartDate(week:int, year:int):Date
```

Returns week start date for week and year

Parameters:
- weekInfo - object WeekInfo-like ``{week:int,year:int}``

or
- week - week in year number (see [constructor](#constructor))
- year - full year

Usage example:
```js
const date = Week.getWeekStartDate(1, 2023);
```

### Week.from
```js
static from(week: string | Date): Week
```

Returns Week instance fo passed date or week

Parameters:
- week
    - If passed Date object, use it for detect week.
    - If passed int value, use it as week number of current year
    - If passed string
        - If string length <= 2, use it as week number of current year
        - else try parse the string as WWdYYYY or YYYYdWW template where
            - W and Y digit
            - d - any non digit character, for example "-" or "." or "/" etc

Usage example:
```js
const currentWeek = Week.from(new Date());
const week35 = Week.from(35);
const week3555 = Week.from('35');
const week55 = Week.from('2020-35');
const week = Week.from('10.2023');
```

### Week.prev
```js
static prev(value : number | string | Date | Week ):Week
```

Returns previous week for passed week
Parameters:
- week - week value for which need previous value (see [Week.from](#Week.from))

Usage example:
```js
const result = Week.prev('02-2020');//=> 01.2020
```

### Week.next
```js 
static next(value:number | string | Date | Week):Week
```

Returns next week for passed week
Parameters:
- week - week value for which need next value (see [Week.from](#Week.from))

Usage example:
```js
const result = Week.next('02-2020');//=> 03.2020
```

