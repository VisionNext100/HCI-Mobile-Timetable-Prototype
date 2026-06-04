/** 学期与节次配置 */
export const SEMESTER_LABEL = '2026春';
export const SEMESTER_START = new Date(2026, 2, 2); // 2026-03-02 周一，第1周
export const MAX_WEEK = 17;
export const PERIOD_COUNT = 14;

const PERIOD_CN = [
  '一', '二', '三', '四', '五', '六', '七', '八', '九', '十', '十一', '十二', '十三', '十四',
];

/** 每节课起止时间（用于进度条、左侧标签与下一节提示） */
export const PERIOD_TIMES = {
  1: { start: '08:00', end: '08:45' },
  2: { start: '08:50', end: '09:35' },
  3: { start: '09:50', end: '10:35' },
  4: { start: '10:40', end: '11:25' },
  5: { start: '11:30', end: '12:15' },
  6: { start: '13:00', end: '13:45' },
  7: { start: '13:50', end: '14:35' },
  8: { start: '14:50', end: '15:35' },
  9: { start: '15:40', end: '16:25' },
  10: { start: '16:30', end: '17:15' },
  11: { start: '18:00', end: '18:45' },
  12: { start: '18:50', end: '19:35' },
  13: { start: '19:40', end: '20:25' },
  14: { start: '20:30', end: '21:15' },
};

/** 第 5–6 节、第 10–11 节之间插入用餐间隔行 */
export const MEAL_BREAK_AFTER = [5, 10];

/** period(1-based) → grid row index（含表头与用餐空行） */
export const PERIOD_GRID_ROW = (() => {
  const map = {};
  let row = 2;
  for (let p = 1; p <= PERIOD_COUNT; p++) {
    map[p] = row;
    row += 1;
    if (MEAL_BREAK_AFTER.includes(p)) row += 1;
  }
  return map;
})();

/** 用餐空行所在的 grid row */
export const MEAL_BREAK_GRID_ROWS = MEAL_BREAK_AFTER.map((p) => PERIOD_GRID_ROW[p] + 1);

export const FIRST_PERIOD_GRID_ROW = 2;
export const LAST_GRID_ROW = PERIOD_GRID_ROW[PERIOD_COUNT] + 1;

export function periodGridRowSpan(startPeriod, endPeriod) {
  const startRow = PERIOD_GRID_ROW[startPeriod];
  const endRow = PERIOD_GRID_ROW[endPeriod] + 1;
  return `${startRow} / ${endRow}`;
}

export function buildGridTemplateRows() {
  const sizes = ['auto'];
  for (let p = 1; p <= PERIOD_COUNT; p++) {
    sizes.push('minmax(50px, auto)');
    if (MEAL_BREAK_AFTER.includes(p)) sizes.push('10px');
  }
  return sizes.join(' ');
}

export function formatPeriodLabel(period) {
  const times = PERIOD_TIMES[period];
  if (!times) return String(period);
  return {
    title: `第${PERIOD_CN[period - 1]}节`,
    time: `${times.start}-${times.end}`,
  };
}

export const DAY_LABELS = ['周一', '周二', '周三', '周四', '周五', '周六', '周日'];

/** 课程色块配色（白字）— 用户提供 7 色 + 补充 2 色 */
export const COURSE_COLORS = {
  CS2203: '#71B1EF',
  POLI3800: '#AACD97',
  CS2101: '#F9AC9A',
  MARX1001: '#EFC772',
  CS2204: '#7B97C7',
  CS2309: '#D9C4A7',
  CS2304: '#9AA6BC',
  CS3301: '#C8A8E9',
  CS2311: '#89D4C2',
};

export function parseTimeToMinutes(timeStr) {
  const [h, m] = timeStr.split(':').map(Number);
  return h * 60 + m;
}

export function getNowMinutes(date = new Date()) {
  return date.getHours() * 60 + date.getMinutes();
}

export function formatPeriodRange(startPeriod, endPeriod) {
  const start = PERIOD_TIMES[startPeriod]?.start ?? '';
  const end = PERIOD_TIMES[endPeriod]?.end ?? '';
  return `${start}–${end}`;
}

export function formatDayLabel(dayOfWeek) {
  return DAY_LABELS[dayOfWeek - 1] ?? '';
}
