import {
  DAY_LABELS,
  FIRST_PERIOD_GRID_ROW,
  LAST_GRID_ROW,
  MAX_WEEK,
  MEAL_BREAK_AFTER,
  PERIOD_COUNT,
  PERIOD_GRID_ROW,
  PERIOD_TIMES,
  SEMESTER_LABEL,
  buildGridTemplateRows,
  formatPeriodLabel,
  periodGridRowSpan,
} from './config.js';
import {
  analyzeTodayProgress,
  getCurrentWeek,
  getEntriesForWeek,
  getWeekDates,
  jsDayToCsvDay,
  loadSchedule,
} from './schedule.js';

const WEEK_STORAGE_KEY = 'timetable-week';

let entries = [];
let selectedWeek = getInitialWeek();
let currentWeek = getCurrentWeek();
let progressTimer = null;

function getInitialWeek() {
  const saved = Number(sessionStorage.getItem(WEEK_STORAGE_KEY));
  if (saved >= 1 && saved <= MAX_WEEK) return saved;
  return getCurrentWeek();
}

function persistWeek() {
  sessionStorage.setItem(WEEK_STORAGE_KEY, String(selectedWeek));
}

function pad(n) {
  return String(n).padStart(2, '0');
}

function renderWeekBar() {
  document.getElementById('semesterLabel').textContent = SEMESTER_LABEL;
  document.getElementById('weekLabel').textContent = `第 ${selectedWeek} 周`;
}

function renderProgress() {
  const analysis = analyzeTodayProgress(entries, currentWeek);
  const meta = document.getElementById('progressMeta');
  const main = document.getElementById('progressMain');
  const fill = document.getElementById('progressFill');

  meta.textContent =
    selectedWeek === currentWeek
      ? `第 ${currentWeek} 周 · 实时`
      : `当前为第 ${currentWeek} 周（课表显示第 ${selectedWeek} 周）`;

  fill.style.width = `${Math.round(analysis.progressRatio * 100)}%`;

  if (analysis.status === 'empty') {
    main.textContent = '今天没有课程';
    return;
  }

  if (analysis.status === 'in-class') {
    main.textContent = `正在上「${analysis.currentCourse.courseName}」，还剩 ${analysis.remainingMinutes} 分钟 · 今日还剩 ${analysis.remainingCount} 节`;
    return;
  }

  if (analysis.status === 'done') {
    main.textContent = `今日 ${analysis.total} 节课已全部结束`;
    return;
  }

  if (analysis.nextCourse) {
    const time = PERIOD_TIMES[analysis.nextCourse.startPeriod].start;
    main.textContent = `下一节 ${time}「${analysis.nextCourse.courseName}」· 今日还剩 ${analysis.remainingCount} 节`;
    return;
  }

  main.textContent = `今日共 ${analysis.total} 节课，已完成 ${analysis.finishedCount} 节`;
}

function renderFloatNext() {
  const float = document.getElementById('floatNext');
  const info = document.getElementById('floatNextInfo');
  const analysis = analyzeTodayProgress(entries, currentWeek);

  const target = analysis.currentCourse || analysis.nextCourse;
  if (!target) {
    float.hidden = true;
    return;
  }

  float.hidden = false;
  const period = analysis.currentCourse
    ? analysis.currentCourse.startPeriod
    : analysis.nextCourse.startPeriod;
  const prefix = analysis.currentCourse ? '进行中' : PERIOD_TIMES[period].start;
  info.textContent = `${prefix} · ${target.courseName} · ${target.location}`;
  float.href = `detail.html?id=${target.id}&week=${selectedWeek}`;
}

function renderTimetable() {
  const root = document.getElementById('timetable');
  const weekEntries = getEntriesForWeek(entries, selectedWeek);
  const weekDates = getWeekDates(selectedWeek);
  const todayCsvDay = jsDayToCsvDay(new Date().getDay());
  const analysis = analyzeTodayProgress(entries, currentWeek);
  const currentPeriod = selectedWeek === currentWeek ? analysis.currentPeriod : null;
  const showLiveHighlight = selectedWeek === currentWeek;

  root.style.gridTemplateRows = buildGridTemplateRows();
  root.innerHTML = '';

  const corner = document.createElement('div');
  corner.className = 'timetable__corner';
  corner.style.gridRow = '1';
  corner.style.gridColumn = '1';
  corner.textContent = `${weekDates[0].getMonth() + 1}月`;
  root.appendChild(corner);

  for (let d = 0; d < 7; d++) {
    const head = document.createElement('div');
    head.className = 'timetable__day-head';
    head.style.gridRow = '1';
    head.style.gridColumn = String(d + 2);
    if (d + 1 === todayCsvDay && showLiveHighlight) {
      head.classList.add('is-today');
    }
    head.innerHTML = `
      <span class="timetable__day-name">${DAY_LABELS[d]}</span>
      <span class="timetable__day-date">${pad(weekDates[d].getDate())}</span>
    `;
    root.appendChild(head);
  }

  for (let p = 1; p <= PERIOD_COUNT; p++) {
    const gridRow = PERIOD_GRID_ROW[p];
    const periodInfo = formatPeriodLabel(p);

    const label = document.createElement('div');
    label.className = 'timetable__period-label';
    label.style.gridRow = String(gridRow);
    label.style.gridColumn = '1';
    if (showLiveHighlight && currentPeriod === p) {
      label.classList.add('is-current');
    }
    label.innerHTML = `
      <span class="period-label__title">${periodInfo.title}</span>
      <span class="period-label__time">${periodInfo.time}</span>
    `;
    root.appendChild(label);

    for (let d = 1; d <= 7; d++) {
      const cell = document.createElement('div');
      cell.className = 'timetable__cell';
      cell.style.gridRow = String(gridRow);
      cell.style.gridColumn = String(d + 1);
      cell.dataset.period = p;
      cell.dataset.day = d;
      root.appendChild(cell);
    }

    if (MEAL_BREAK_AFTER.includes(p)) {
      const breakRow = gridRow + 1;
      const spacer = document.createElement('div');
      spacer.className = 'timetable__meal-break';
      spacer.style.gridRow = String(breakRow);
      spacer.style.gridColumn = '1 / 9';
      root.appendChild(spacer);
    }
  }

  if (showLiveHighlight) {
    const colHighlight = document.createElement('div');
    colHighlight.className = 'timetable__col-highlight';
    colHighlight.style.gridColumn = String(todayCsvDay + 1);
    colHighlight.style.gridRow = `${FIRST_PERIOD_GRID_ROW} / ${LAST_GRID_ROW}`;
    root.appendChild(colHighlight);
  }

  if (showLiveHighlight && currentPeriod !== null) {
    const rowHighlight = document.createElement('div');
    rowHighlight.className = 'timetable__row-highlight';
    rowHighlight.style.gridColumn = '2 / 9';
    rowHighlight.style.gridRow = String(PERIOD_GRID_ROW[currentPeriod]);
    root.appendChild(rowHighlight);
  }

  weekEntries.forEach((entry) => {
    const block = document.createElement('a');
    block.className = 'course-block';
    block.href = `detail.html?id=${entry.id}&week=${selectedWeek}`;
    block.style.backgroundColor = entry.color;
    block.style.gridColumn = String(entry.dayOfWeek + 1);
    block.style.gridRow = periodGridRowSpan(entry.startPeriod, entry.endPeriod);

    block.innerHTML = `
      <span class="course-block__name">${entry.courseName}</span>
      <span class="course-block__loc">${entry.location}</span>
    `;
    root.appendChild(block);
  });
}

function changeWeek(week, closePicker = false) {
  if (week < 1 || week > MAX_WEEK) return;
  selectedWeek = week;
  persistWeek();
  refresh();
  if (closePicker) document.getElementById('weekPicker')?.close();
}

function updateWeekPickerList() {
  const list = document.getElementById('weekPickerList');
  if (!list) return;
  list.querySelectorAll('.week-picker__item').forEach((el) => {
    const w = Number(el.dataset.week);
    el.classList.toggle('is-active', w === selectedWeek);
  });
}

function openWeekPicker() {
  const dialog = document.getElementById('weekPicker');
  updateWeekPickerList();
  dialog.showModal();
  const active = dialog.querySelector('.week-picker__item.is-active');
  active?.scrollIntoView({ block: 'center' });
}

function setupWeekControls() {
  const list = document.getElementById('weekPickerList');

  for (let w = 1; w <= MAX_WEEK; w++) {
    const li = document.createElement('li');
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'week-picker__item';
    btn.dataset.week = w;
    btn.textContent = `第 ${w} 周`;
    btn.addEventListener('click', () => changeWeek(w, true));
    li.appendChild(btn);
    list.appendChild(li);
  }

  document.getElementById('weekPickerBtn').addEventListener('click', openWeekPicker);
  document.getElementById('weekPickerClose').addEventListener('click', () => {
    document.getElementById('weekPicker').close();
  });
  document.getElementById('weekPicker').addEventListener('click', (e) => {
    if (e.target.id === 'weekPicker') e.target.close();
  });

  document.getElementById('weekPrev').addEventListener('click', () => changeWeek(selectedWeek - 1));
  document.getElementById('weekNext').addEventListener('click', () => changeWeek(selectedWeek + 1));

  setupWeekSwipe();
}

function setupWeekSwipe() {
  const shell = document.getElementById('timetableShell');
  let startX = 0;
  let startY = 0;

  shell.addEventListener(
    'touchstart',
    (e) => {
      startX = e.touches[0].clientX;
      startY = e.touches[0].clientY;
    },
    { passive: true }
  );

  shell.addEventListener(
    'touchend',
    (e) => {
      const dx = e.changedTouches[0].clientX - startX;
      const dy = e.changedTouches[0].clientY - startY;
      if (Math.abs(dx) < 56 || Math.abs(dx) < Math.abs(dy)) return;
      if (dx < 0) changeWeek(selectedWeek + 1);
      else changeWeek(selectedWeek - 1);
    },
    { passive: true }
  );
}

function refresh() {
  currentWeek = getCurrentWeek();
  renderWeekBar();
  updateWeekPickerList();
  renderProgress();
  renderFloatNext();
  renderTimetable();
}

function startProgressTicker() {
  if (progressTimer) clearInterval(progressTimer);
  progressTimer = setInterval(() => {
    currentWeek = getCurrentWeek();
    renderProgress();
    renderFloatNext();
    if (selectedWeek === currentWeek) {
      renderTimetable();
    }
  }, 60000);
}

async function init() {
  try {
    entries = await loadSchedule();
    setupWeekControls();
    refresh();
    startProgressTicker();
  } catch (err) {
    document.getElementById('progressMain').textContent = err.message;
    document.getElementById('timetable').innerHTML =
      '<p class="error-msg">无法加载课表数据，请用 VS Code Live Server 打开 <code>index.html</code>，并确认 <code>schedule.csv</code> 与其在同一目录。</p>';
  }
}

init();
