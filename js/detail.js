import { SEMESTER_LABEL, formatDayLabel, formatPeriodRange } from './config.js';
import { getWeekDescription, loadSchedule } from './schedule.js';

async function init() {
  const params = new URLSearchParams(window.location.search);
  const id = Number(params.get('id'));
  const card = document.getElementById('detailCard');
  const backLink = document.getElementById('backLink');

  backLink.href = `index.html`;

  if (Number.isNaN(id)) {
    card.innerHTML = '<p class="detail-error">未找到课程信息</p>';
    return;
  }

  try {
    const entries = await loadSchedule();
    const entry = entries.find((e) => e.id === id);
    if (!entry) {
      card.innerHTML = '<p class="detail-error">课程不存在</p>';
      return;
    }

    const timeText = `${formatDayLabel(entry.dayOfWeek)} · 第 ${entry.startPeriod}${entry.endPeriod > entry.startPeriod ? `–${entry.endPeriod}` : ''} 节 · ${formatPeriodRange(entry.startPeriod, entry.endPeriod)}`;
    const weekText = getWeekDescription(entry.weekRule);
    const notesBlock = entry.notes
      ? `<div class="detail-row detail-row--notes">
           <span class="detail-label">备注</span>
           <span class="detail-value">${entry.notes}</span>
         </div>`
      : '';

    card.innerHTML = `
      <div class="detail-hero" style="--course-color: ${entry.color}">
        <span class="detail-hero__code">${entry.courseCode}</span>
        <h2 class="detail-hero__name">${entry.courseName}</h2>
      </div>
      <div class="detail-rows">
        <div class="detail-row">
          <span class="detail-label">任课教师</span>
          <span class="detail-value">${entry.teacher}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">上课时间</span>
          <span class="detail-value">${timeText}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">上课周数</span>
          <span class="detail-value">${weekText}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">上课地点</span>
          <span class="detail-value">${entry.location}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">班级人数</span>
          <span class="detail-value">${entry.classSize} 人</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">学期</span>
          <span class="detail-value">${SEMESTER_LABEL}</span>
        </div>
        ${notesBlock}
      </div>
    `;
  } catch (err) {
    card.innerHTML = `<p class="detail-error">${err.message}</p>`;
  }
}

init();
