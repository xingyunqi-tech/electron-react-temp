import dayjs from 'dayjs';
import RelativeTime from 'dayjs/plugin/relativeTime';
import utc from 'dayjs/plugin/utc';
import isoWeek from 'dayjs/plugin/isoWeek';
import isToday from 'dayjs/plugin/isToday';
import 'dayjs/locale/zh-cn';
import 'dayjs/locale/en';

// 使用插件
dayjs.extend(RelativeTime);
dayjs.extend(utc);
dayjs.extend(isoWeek);
dayjs.extend(isToday);

export const dayjsLocaleMap: Record<string, string> = {
  'zh-CN': 'zh-cn',
  'en-US': 'en',
};

export default dayjs;
