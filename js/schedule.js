import {
  COURSE_COLORS,
  MAX_WEEK,
  SEMESTER_START,
  parseTimeToMinutes,
  PERIOD_TIMES,
} from './config.js';

/** 为每条课表记录推断上课周规则 */
function inferWeekRule(entry) {
  if (entry.courseCode === 'POLI3800') return '1-12';
  if (entry.courseCode === 'CS2311') {
    if (entry.startPeriod === 6 && entry.location.includes('教书院124')) return 'odd';
    return '1-17';
  }
  return '1-17';
}

export function getWeekDescription(weekRule) {
  switch (weekRule) {
    case '1-12':
      return '第 1–12 周';
    case 'odd':
      return '单周（第 1、3、5、7、9、11、13、15、17 周）';
    default:
      return '第 1–17 周';
  }
}

export function isActiveInWeek(entry, week) {
  if (week < 1 || week > MAX_WEEK) return false;
  switch (entry.weekRule) {
    case '1-12':
      return week <= 12;
    case 'odd':
      return week % 2 === 1;
    default:
      return true;
  }
}

export function getCurrentWeek(date = new Date()) {
  const start = new Date(SEMESTER_START);
  start.setHours(0, 0, 0, 0);
  const today = new Date(date);
  today.setHours(0, 0, 0, 0);
  if (today < start) return 1;
  const diffDays = Math.floor((today - start) / 86400000);
  return Math.min(MAX_WEEK, Math.max(1, Math.floor(diffDays / 7) + 1));
}

/** CSV dayOfWeek: 1=周一 … 7=周日 → JS getDay(): 0=周日 … 6=周六 */
export function csvDayToJsDay(dayOfWeek) {
  return dayOfWeek === 7 ? 0 : dayOfWeek;
}

export function jsDayToCsvDay(jsDay) {
  return jsDay === 0 ? 7 : jsDay;
}

export function getWeekDates(week) {
  const start = new Date(SEMESTER_START);
  start.setDate(start.getDate() + (week - 1) * 7);
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(start);
    d.setDate(start.getDate() + i);
    return d;
  });
}

function parseCsvLine(line) {
  const result = [];
  let current = '';
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (ch === '"') {
      inQuotes = !inQuotes;
      continue;
    }
    if (ch === ',' && !inQuotes) {
      result.push(current.trim());
      current = '';
      continue;
    }
    current += ch;
  }
  result.push(current.trim());
  return result;
}

export async function loadSchedule() {
  const res = await fetch('./schedule.csv');
  if (!res.ok) throw new Error('无法加载 schedule.csv，请确认文件与 index.html 同级，并用 Live Server 打开页面');
  const text = (await res.text()).replace(/^\uFEFF/, '');
  const lines = text.trim().split(/\r?\n/);
  const header = parseCsvLine(lines[0]);
  const entries = [];

  for (let i = 1; i < lines.length; i++) {
    if (!lines[i].trim()) continue;
    const cols = parseCsvLine(lines[i]);
    const row = Object.fromEntries(header.map((key, idx) => [key, cols[idx] ?? '']));
    const entry = {
      id: i - 1,
      courseCode: row.courseCode,
      courseName: row.courseName,
      teacher: row.teacher,
      dayOfWeek: Number(row.dayOfWeek),
      startPeriod: Number(row.startPeriod),
      endPeriod: Number(row.endPeriod),
      location: row.location,
      classSize: Number(row.classSize),
      notes: row.notes || '',
      color: row.color?.trim() || COURSE_COLORS[row.courseCode] || '#5C6BC0',
      weekRule: inferWeekRule({
        courseCode: row.courseCode,
        startPeriod: Number(row.startPeriod),
        location: row.location,
      }),
    };
    entries.push(entry);
  }
  return entries;
}

export function getEntriesForWeek(entries, week) {
  return entries.filter((e) => isActiveInWeek(e, week));
}

export function getTodayEntries(entries, week, date = new Date()) {
  const csvDay = jsDayToCsvDay(date.getDay());
  return getEntriesForWeek(entries, week)
    .filter((e) => e.dayOfWeek === csvDay)
    .sort((a, b) => a.startPeriod - b.startPeriod);
}

export function getCurrentPeriod(date = new Date()) {
  const now = date.getHours() * 60 + date.getMinutes();
  let current = null;
  for (const [period, times] of Object.entries(PERIOD_TIMES)) {
    const start = parseTimeToMinutes(times.start);
    const end = parseTimeToMinutes(times.end);
    if (now >= start && now <= end) {
      current = Number(period);
      break;
    }
  }
  return current;
}

export function analyzeTodayProgress(entries, week, date = new Date()) {
  const todayCourses = getTodayEntries(entries, week, date);
  const nowMin = date.getHours() * 60 + date.getMinutes();
  const currentPeriod = getCurrentPeriod(date);

  let currentCourse = null;
  let remainingMinutes = 0;

  if (currentPeriod !== null) {
    currentCourse = todayCourses.find(
      (c) => c.startPeriod <= currentPeriod && c.endPeriod >= currentPeriod
    );
    if (currentCourse) {
      const end = parseTimeToMinutes(PERIOD_TIMES[currentPeriod].end);
      remainingMinutes = Math.max(0, end - nowMin);
    }
  }

  const upcoming = todayCourses.filter((c) => {
    const start = parseTimeToMinutes(PERIOD_TIMES[c.startPeriod].start);
    return start > nowMin;
  });

  let totalPeriods = 0;
  let finishedPeriods = 0;
  let remainingPeriods = 0;

  for (const c of todayCourses) {
    for (let p = c.startPeriod; p <= c.endPeriod; p++) {
      totalPeriods += 1;
      const end = parseTimeToMinutes(PERIOD_TIMES[p].end);
      if (end <= nowMin) {
        finishedPeriods += 1;
        continue;
      }
      if (currentCourse && p === currentPeriod) continue;
      remainingPeriods += 1;
    }
  }

  const nextCourse = upcoming[0] ?? null;

  let status;
  if (todayCourses.length === 0 || totalPeriods === 0) {
    status = 'empty';
  } else if (currentCourse) {
    status = 'in-class';
  } else if (nextCourse) {
    status = 'break';
  } else if (finishedPeriods >= totalPeriods) {
    status = 'done';
  } else {
    status = 'break';
  }

  let progressRatio = 0;
  if (totalPeriods > 0) {
    if (status === 'done') progressRatio = 1;
    else progressRatio = Math.min(1, (finishedPeriods + (currentCourse ? 0.5 : 0)) / totalPeriods);
  }

  return {
    todayCourses,
    currentPeriod,
    currentCourse,
    remainingMinutes,
    remainingCount: remainingPeriods,
    finishedCount: finishedPeriods,
    total: totalPeriods,
    nextCourse,
    status,
    progressRatio,
  };
}
