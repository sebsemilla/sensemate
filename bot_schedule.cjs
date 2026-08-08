'use strict';
const fs   = require('fs');
const path = require('path');

const SCHEDULE_FILE = path.join(__dirname, 'bot_schedule.json');

// AR is UTC-3. To convert AR HH:MM to UTC: add 3 hours
const AR_OFFSET_MINUTES = 3 * 60; // 180 minutes

// Time windows in minutes from midnight AR time
const TIME_WINDOWS_AR = [
  { start: 7*60,     end: 9*60+30  },  // 7:00-9:30 AR
  { start: 12*60,    end: 14*60+30 },  // 12:00-14:30 AR
  { start: 16*60,    end: 19*60    },  // 16:00-19:00 AR
  { start: 20*60+30, end: 23*60+30 },  // 20:30-23:30 AR
];

function loadSchedule() {
  try { return JSON.parse(fs.readFileSync(SCHEDULE_FILE, 'utf8')); }
  catch { return []; }
}

function saveSchedule(entries) {
  fs.writeFileSync(SCHEDULE_FILE, JSON.stringify(entries, null, 2));
}

function _randInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function _shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// Generate timestamps for one day. Returns array of UTC millisecond timestamps.
// dayDate: a Date object at 00:00:00 UTC for that calendar day.
// postsPerDay: how many posts this day.
// botIndex 0-7: adds jitter so bots don't post at the exact same second.
function _timesForDay(dayDate, postsPerDay, botIndex) {
  const windows = _shuffle([...TIME_WINDOWS_AR]).slice(0, postsPerDay);
  const times = [];
  for (const w of windows) {
    const minuteAR = _randInt(w.start, w.end);
    const minuteUTC = minuteAR + AR_OFFSET_MINUTES;
    // dayDate is midnight UTC. AR midnight = 03:00 UTC.
    // UTC timestamp for "this AR day at minuteAR" = dayDate (midnight UTC) + (minuteAR + AR_OFFSET) minutes
    // If minuteUTC >= 24*60, it spills to next UTC day — that's fine.
    const jitterMs = botIndex * 37 * 1000; // spread bots by 37s each
    times.push(dayDate.getTime() + minuteUTC * 60 * 1000 + jitterMs);
  }
  return times;
}

// Generate posting schedule for a bot from today through endDate.
// Returns array of {botId, ts, fired: false}
function generateBotSchedule(botId, startDate, endDate, postsPerDayWeekday, postsPerDayWeekend, botIndex) {
  const entries = [];
  const cur = new Date(startDate);
  cur.setUTCHours(0, 0, 0, 0);

  while (cur <= endDate) {
    // Day of week in AR timezone: since AR = UTC-3, "AR day of week" for a UTC day
    // is determined by: AR date = UTC date when UTC time >= 03:00, else previous AR day.
    // For simplicity, use UTC date's day of week (close enough for scheduling purposes).
    const dow = cur.getUTCDay(); // 0=Sun, 6=Sat
    const isWeekend = dow === 0 || dow === 6;
    // Weekend: randomize between postsPerDayWeekend and postsPerDayWeekend+1
    const postsToday = isWeekend
      ? _randInt(postsPerDayWeekend, postsPerDayWeekend + 1)
      : postsPerDayWeekday;

    for (const ts of _timesForDay(cur, postsToday, botIndex)) {
      if (ts >= startDate.getTime()) { // only future timestamps
        entries.push({ botId, ts, fired: false });
      }
    }
    cur.setUTCDate(cur.getUTCDate() + 1);
  }
  return entries;
}

// Regenerate schedule for a bot from now to endDate.
// Removes old unfired entries, adds new ones.
function regenerateBotSchedule(botId, postsPerDayWeekday, postsPerDayWeekend, botIndex, endDate) {
  const all = loadSchedule().filter(e => !(e.botId === botId && !e.fired));
  const now  = new Date();
  const end  = endDate || new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() + 2, 0)); // end of next month
  const newEntries = generateBotSchedule(botId, now, end, postsPerDayWeekday, postsPerDayWeekend, botIndex);
  const merged = [...all, ...newEntries].sort((a, b) => a.ts - b.ts);
  saveSchedule(merged);
  return newEntries.length;
}

// Get all entries due now (ts <= now, fired=false)
function getDueEntries(botIdFilter) {
  const now = Date.now();
  return loadSchedule().filter(e =>
    !e.fired && e.ts <= now && (!botIdFilter || e.botId === botIdFilter)
  );
}

// Mark an entry as fired
function markFired(botId, ts) {
  const entries = loadSchedule();
  const entry = entries.find(e => e.botId === botId && e.ts === ts);
  if (entry) {
    entry.fired = true;
    entry.firedAt = Date.now();
    saveSchedule(entries);
  }
}

// Get upcoming unfired entries for a bot
function getUpcomingEntries(botId, limit = 30) {
  const now = Date.now();
  return loadSchedule()
    .filter(e => e.botId === botId && !e.fired && e.ts > now)
    .sort((a, b) => a.ts - b.ts)
    .slice(0, limit);
}

// Remove all entries (fired and unfired) for a bot
function removeBotSchedule(botId) {
  const entries = loadSchedule().filter(e => e.botId !== botId);
  saveSchedule(entries);
}

module.exports = {
  generateBotSchedule,
  regenerateBotSchedule,
  getDueEntries,
  markFired,
  getUpcomingEntries,
  removeBotSchedule,
  loadSchedule,
};
