const dayjs = require('dayjs');
const isoWeek = require('dayjs/plugin/isoWeek');
const customParseFormat = require('dayjs/plugin/customParseFormat');
const isToday = require('dayjs/plugin/isToday');
const isBetween = require('dayjs/plugin/isBetween');
// :INFO Не находит ru
// const ru = require('dayjs/plugin/ru');


dayjs.extend(customParseFormat)
dayjs.extend(isBetween)
dayjs.extend(isToday)
// :INFO Не находит ru
// dayjs.locale(ru);
dayjs.extend(isoWeek);

export { dayjs };