import dayjs from 'dayjs';
import localizedFormat from 'dayjs/plugin/localizedFormat';
import 'dayjs/locale/zh-cn';

dayjs.extend(localizedFormat);
dayjs.locale('zh-cn');

export default dayjs;
