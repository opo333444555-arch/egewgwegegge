// ==========================================
// StudyQuest — Daily Planner & Quest Tracker
// All data stored in localStorage per user
// ==========================================

(function () {
  'use strict';

  // ===== CONSTANTS =====
  const DAYS_TH = ['อาทิตย์', 'จันทร์', 'อังคาร', 'พุธ', 'พฤหัสบดี', 'ศุกร์', 'เสาร์'];
  const DAYS_SHORT = ['อา', 'จ', 'อ', 'พ', 'พฤ', 'ศ', 'ส'];
  const MONTHS_TH = ['มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน',
    'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม'];
  const WEEKDAY_MAP = { 'จันทร์': 1, 'อังคาร': 2, 'พุธ': 3, 'พฤหัสบดี': 4, 'ศุกร์': 5 };
  const WEEKDAY_OPTIONS = ['จันทร์', 'อังคาร', 'พุธ', 'พฤหัสบดี', 'ศุกร์'];

  // ===== DEFAULT WEEKLY TIMETABLE =====
  const DEFAULT_TIMETABLE = {
    'จันทร์': [
      { name: 'ประวัติฯ/หน้าที่ฯ', startTime: '08:20', endTime: '09:10' },
      { name: 'ภาษาไทย', startTime: '09:25', endTime: '10:15' },
      { name: 'อังกฤษเพื่อการสื่อสาร', startTime: '10:15', endTime: '11:05' },
      { name: 'คณิตฯ เพิ่มเติม', startTime: '11:05', endTime: '11:55' },
      { name: 'ศิลปะ', startTime: '13:00', endTime: '13:50' },
      { name: 'ฟิสิกส์', startTime: '13:50', endTime: '14:40' },
      { name: 'แนะแนว/ต้านทุจริตฯ', startTime: '14:40', endTime: '15:30' },
    ],
    'อังคาร': [
      { name: 'สังคมศึกษา', startTime: '08:20', endTime: '09:10' },
      { name: 'ภาษาจีน', startTime: '09:25', endTime: '10:15' },
      { name: 'ฟิสิกส์', startTime: '10:15', endTime: '11:05' },
      { name: 'ฟิสิกส์', startTime: '11:05', endTime: '11:55' },
      { name: 'การงานอาชีพ', startTime: '13:00', endTime: '13:50' },
      { name: 'วิทยาศาสตร์', startTime: '13:50', endTime: '14:40' },
      { name: 'คณิตศาสตร์', startTime: '14:40', endTime: '15:30' },
    ],
    'พุธ': [
      { name: 'การนำเสนอสื่อประสม', startTime: '08:20', endTime: '09:10' },
      { name: 'การนำเสนอสื่อประสม', startTime: '09:25', endTime: '10:15' },
      { name: 'ภาษาอังกฤษ', startTime: '10:15', endTime: '11:05' },
      { name: 'คณิตฯ เพิ่มเติม', startTime: '11:05', endTime: '11:55' },
      { name: 'วิทยาศาสตร์', startTime: '13:00', endTime: '13:50' },
      { name: 'ชีววิทยา', startTime: '13:50', endTime: '14:40' },
      { name: 'ชีววิทยา', startTime: '14:40', endTime: '15:30' },
    ],
    'พฤหัสบดี': [
      { name: 'เคมี', startTime: '08:20', endTime: '09:10' },
      { name: 'ภาษาไทย', startTime: '09:25', endTime: '10:15' },
      { name: 'เทคโนฯ/ออกแบบ', startTime: '10:15', endTime: '11:05' },
      { name: 'คณิตศาสตร์', startTime: '11:05', endTime: '11:55' },
      { name: 'IS (การศึกษาค้นคว้าอิสระ)', startTime: '13:00', endTime: '13:50' },
      { name: 'พลศึกษา', startTime: '13:50', endTime: '14:40' },
      { name: 'อังกฤษเพื่อการสื่อสาร', startTime: '14:40', endTime: '15:30' },
    ],
    'ศุกร์': [
      { name: 'ชีววิทยา', startTime: '08:20', endTime: '09:10' },
      { name: 'ภาษาอังกฤษ', startTime: '09:25', endTime: '10:15' },
      { name: 'เคมี', startTime: '10:15', endTime: '11:05' },
      { name: 'เคมี', startTime: '11:05', endTime: '11:55' },
      { name: 'สุขศึกษา', startTime: '13:00', endTime: '13:50' },
      { name: 'สังคมศึกษา', startTime: '13:50', endTime: '14:40' },
      { name: 'กิจกรรมชุมนุม', startTime: '14:40', endTime: '15:30' },
    ],
  };

  // Break periods
  const BREAKS = [
    { name: '🍵 พักระหว่างชั่วโมง', startTime: '09:10', endTime: '09:25' },
    { name: '🍱 พักกลางวัน / นั่งสมาธิ', startTime: '11:55', endTime: '13:00' },
  ];

  // Daily Routine Quests (Fixed 5 periods)
  const ROUTINE_QUESTS = [
    { id: 'q_wakeup', name: 'ช่วงตื่นนอน', targetTime: '06:00' },
    { id: 'q_morning', name: 'ช่วงเช้า', targetTime: '09:00' },
    { id: 'q_noon', name: 'ช่วงพักกลางวัน', targetTime: '12:00' },
    { id: 'q_afterschool', name: 'ช่วงเลิกเรียน', targetTime: '16:00' },
    { id: 'q_sleep', name: 'ก่อนนอน', targetTime: '21:00' }
  ];

  // ===== STATE =====
  let currentUser = null;
  let clockInterval = null;
  let inMemoryState = {};

  // ===== UTILITY FUNCTIONS =====
  function $(id) { return document.getElementById(id); }
  function qs(sel) { return document.querySelector(sel); }
  function qsa(sel) { return document.querySelectorAll(sel); }

  function generateId() {
    return Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
  }

  function getUserKey(key) {
    return `sq_${currentUser.id}_${key}`;
  }

  function getData(key, fallback = []) {
    try {
      const raw = localStorage.getItem(getUserKey(key));
      return raw ? JSON.parse(raw) : fallback;
    } catch { return fallback; }
  }

  let syncTimeout = null;
  function syncToServer() {
    if (!currentUser) return;
    
    const dataToSync = {
      subjects: getData('subjects', []),
      quests: getData('quests', []),
      questChecks: getData('questChecks', {}),
      morningDone: getData('morningDone', {}),
      streak: getData('streak', { count: 0, lastDate: '' }),
      assignments: getData('assignments', []),
      subjectNotes: getData('subjectNotes', {}),
      journals: getData('journals', [])
    };
    
    fetch('/api/data', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: currentUser.id, data: dataToSync })
    }).catch(err => console.error('Silent background sync failed', err));
  }

  function setData(key, data) {
    localStorage.setItem(getUserKey(key), JSON.stringify(data));
    if (syncTimeout) clearTimeout(syncTimeout);
    syncTimeout = setTimeout(syncToServer, 1000);
  }

  function showToast(message, type = 'success') {
    const toast = $('toast');
    const icon = $('toast-icon');
    const text = $('toast-text');
    text.textContent = message;
    if (type === 'success') {
      icon.innerHTML = '<path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"/>';
      icon.className = 'w-5 h-5 text-success shrink-0';
    } else if (type === 'error') {
      icon.innerHTML = '<path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/>';
      icon.className = 'w-5 h-5 text-danger shrink-0';
    } else {
      icon.innerHTML = '<path stroke-linecap="round" stroke-linejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>';
      icon.className = 'w-5 h-5 text-brand-400 shrink-0';
    }
    toast.classList.remove('hidden');
    clearTimeout(toast._timer);
    toast._timer = setTimeout(() => toast.classList.add('hidden'), 2500);
  }

  function formatDate(dateStr) {
    const d = new Date(dateStr);
    return `${d.getDate()} ${MONTHS_TH[d.getMonth()].slice(0, 3)} ${d.getFullYear() + 543}`;
  }

  function formatDateFull(dateStr) {
    const d = new Date(dateStr);
    return `${DAYS_TH[d.getDay()]}ที่ ${d.getDate()} ${MONTHS_TH[d.getMonth()]} ${d.getFullYear() + 543}`;
  }

  function getTodayStr() {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  }

  function getDaysUntil(dateStr) {
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    const target = new Date(dateStr);
    target.setHours(0, 0, 0, 0);
    return Math.ceil((target - now) / (1000 * 60 * 60 * 24));
  }

  function getTodayDayName() {
    return DAYS_TH[new Date().getDay()];
  }

  function escapeHtml(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }

  // Convert "HH:MM" to minutes since midnight
  function timeToMinutes(timeStr) {
    const [h, m] = timeStr.split(':').map(Number);
    return h * 60 + m;
  }

  // Get current time in minutes
  function nowMinutes() {
    const now = new Date();
    return now.getHours() * 60 + now.getMinutes();
  }

  // ===== AUTH SYSTEM =====
  function getAllUsers() {
    try {
      return JSON.parse(localStorage.getItem('sq_users') || '[]');
    } catch { return []; }
  }

  function saveAllUsers(users) {
    localStorage.setItem('sq_users', JSON.stringify(users));
  }

  function hashPassword(pwd) {
    let hash = 0;
    for (let i = 0; i < pwd.length; i++) {
      const chr = pwd.charCodeAt(i);
      hash = ((hash << 5) - hash) + chr;
      hash |= 0;
    }
    return hash.toString(36);
  }

  // Seed default subjects for new user
  function seedDefaultSubjects() {
    const subjects = [];
    for (const [day, slots] of Object.entries(DEFAULT_TIMETABLE)) {
      for (const slot of slots) {
        subjects.push({
          id: generateId(),
          name: slot.name,
          room: '',
          days: [day],
          startTime: slot.startTime,
          endTime: slot.endTime,
          isExam: false,
        });
      }
    }
    setData('subjects', subjects);
  }

  function initAuth() {
    const session = localStorage.getItem('sq_session');
    if (session) {
      try {
        currentUser = JSON.parse(session);
        
        // Background sync to pull latest data from Neon Database
        fetch(`/api/data?userId=${currentUser.id}`)
          .then(res => { if (!res.ok) throw new Error('Fetch failed'); return res.json(); })
          .then(json => {
            if (json.data && Object.keys(json.data).length > 0) {
              let updated = false;
              for (const [k, v] of Object.entries(json.data)) {
                const existing = localStorage.getItem(getUserKey(k));
                const newValue = JSON.stringify(v);
                if (existing !== newValue) {
                  localStorage.setItem(getUserKey(k), newValue);
                  updated = true;
                }
              }
              if (updated && !$('main-app').classList.contains('hidden')) {
                initMainApp(); // refresh UI silently
              }
            }
          })
          .catch(err => console.error('Initial silent sync failed', err));

        enterApp();
        return;
      } catch (err) {
        console.error(err);
      }
    }
    showScreen('auth');
  }

  function showScreen(screen) {
    $('auth-screen').classList.toggle('hidden', screen !== 'auth');
    $('morning-quest-screen').classList.toggle('hidden', screen !== 'morning');
    $('main-app').classList.toggle('hidden', screen !== 'main');
  }

  // Login
  $('login-btn').addEventListener('click', async () => {
    const username = $('login-username').value.trim();
    const password = $('login-password').value;
    const errorEl = $('login-error');
    const btn = $('login-btn');

    if (!username || !password) {
      errorEl.textContent = 'กรุณากรอกชื่อผู้ใช้และรหัสผ่าน';
      errorEl.classList.remove('hidden');
      return;
    }

    btn.disabled = true;
    btn.textContent = 'กำลังเข้าสู่ระบบ...';

    try {
      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'login', username, passwordHash: hashPassword(password) })
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Login failed');
      }

      errorEl.classList.add('hidden');
      currentUser = data.user;
      localStorage.setItem('sq_session', JSON.stringify(currentUser));
      
      const dataRes = await fetch(`/api/data?userId=${currentUser.id}`);
      if (dataRes.ok) {
        const dataJson = await dataRes.json();
        if (dataJson.data) {
          for (const [k, v] of Object.entries(dataJson.data)) {
            localStorage.setItem(getUserKey(k), JSON.stringify(v));
          }
        }
      }

      enterApp();
    } catch (err) {
      // Fallback to local authentication if offline/DB issue
      const users = getAllUsers();
      const user = users.find(u => u.username.toLowerCase() === username.toLowerCase());
      if (user && user.passwordHash === hashPassword(password)) {
        errorEl.classList.add('hidden');
        currentUser = { id: user.id, username: user.username, displayName: user.displayName };
        localStorage.setItem('sq_session', JSON.stringify(currentUser));
        enterApp();
      } else {
        errorEl.textContent = err.message || 'ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง';
        errorEl.classList.remove('hidden');
      }
    } finally {
      btn.disabled = false;
      btn.textContent = 'เข้าสู่ระบบ (Login)';
    }
  });

  // Register
  $('register-btn').addEventListener('click', async () => {
    const displayName = $('reg-displayname').value.trim();
    const username = $('reg-username').value.trim();
    const password = $('reg-password').value;
    const errorEl = $('reg-error');
    const btn = $('register-btn');

    if (!displayName || !username || !password) {
      errorEl.textContent = 'กรุณากรอกข้อมูลให้ครบ';
      errorEl.classList.remove('hidden');
      return;
    }
    if (password.length < 4) {
      errorEl.textContent = 'รหัสผ่านต้องมีอย่างน้อย 4 ตัวอักษร';
      errorEl.classList.remove('hidden');
      return;
    }

    btn.disabled = true;
    btn.textContent = 'กำลังสมัครสมาชิก...';

    const newId = generateId();

    try {
      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          action: 'register', 
          id: newId,
          username, 
          displayName, 
          passwordHash: hashPassword(password) 
        })
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Registration failed');
      }

      errorEl.classList.add('hidden');
      
      // Temporarily set currentUser to seed data
      currentUser = { id: newId, username, displayName };
      seedDefaultSubjects();

      // Clear session
      localStorage.removeItem('sq_session');
      currentUser = null;

      $('reg-displayname').value = '';
      $('reg-username').value = '';
      $('reg-password').value = '';

      $('register-form').classList.add('hidden');
      $('login-form').classList.remove('hidden');
      $('login-username').value = username;
      $('login-password').value = '';
      $('login-password').focus();

      showToast(`สมัครสมาชิกสำเร็จ! กรุณาเข้าสู่ระบบ`, 'success');
    } catch (err) {
      // Fallback to local storage if API is down
      const users = getAllUsers();
      if (users.find(u => u.username.toLowerCase() === username.toLowerCase())) {
        errorEl.textContent = 'ชื่อผู้ใช้นี้มีคนใช้แล้ว';
        errorEl.classList.remove('hidden');
      } else {
        const userObj = { id: newId, username, displayName, passwordHash: hashPassword(password) };
        users.push(userObj);
        saveAllUsers(users);

        currentUser = { id: newId, username, displayName };
        seedDefaultSubjects();
        localStorage.removeItem('sq_session');
        currentUser = null;

        $('register-form').classList.add('hidden');
        $('login-form').classList.remove('hidden');
        $('login-username').value = username;
        $('login-password').value = '';
        errorEl.classList.add('hidden');
        showToast(`สมัครสมาชิกสำเร็จ (Local)! กรุณาเข้าสู่ระบบ`, 'success');
      }
    } finally {
      btn.disabled = false;
      btn.textContent = 'สมัครสมาชิก (Register)';
    }
  });

  // Toggle forms
  $('show-register').addEventListener('click', () => {
    $('login-form').classList.add('hidden');
    $('register-form').classList.remove('hidden');
  });
  $('show-login').addEventListener('click', () => {
    $('register-form').classList.add('hidden');
    $('login-form').classList.remove('hidden');
  });

  // Enter key
  $('login-password').addEventListener('keydown', e => { if (e.key === 'Enter') $('login-btn').click(); });
  $('reg-password').addEventListener('keydown', e => { if (e.key === 'Enter') $('register-btn').click(); });

  // Logout
  $('logout-btn').addEventListener('click', () => {
    if (!confirm('ต้องการออกจากระบบ?')) return;
    localStorage.removeItem('sq_session');
    currentUser = null;
    if (clockInterval) clearInterval(clockInterval);
    showScreen('auth');
    $('login-username').value = '';
    $('login-password').value = '';
    $('login-error').classList.add('hidden');
  });

  // ===== ENTER APP =====
  function enterApp() {
    $('topbar-user').textContent = currentUser.displayName;
    const todayKey = getTodayStr();
    const morningDone = getData('morningDone', {});

    if (morningDone[todayKey]) {
      showScreen('main');
      initMainApp();
    } else {
      showScreen('morning');
      initMorningQuest();
    }
  }

  // ===== MORNING QUEST (auto from today's schedule) =====
  function getTodaySubjectsSorted() {
    const subjects = getData('subjects', []);
    const todayName = getTodayDayName();
    return subjects
      .filter(s => s.days.includes(todayName))
      .sort((a, b) => a.startTime.localeCompare(b.startTime));
  }

  function initMorningQuest() {
    renderMorningQuests();
  }

  function renderMorningQuests() {
    const todaySubjects = getTodaySubjectsSorted();
    const customQuests = getData('quests', []);
    const todayKey = getTodayStr();
    const checkedQuests = getData('questChecks', {});
    const todayChecks = checkedQuests[todayKey] || {};

    const listEl = $('morning-quest-list');
    const emptyEl = $('morning-quest-empty');

    // Build combined quest list: custom quests + subject quests
    const allQuests = [];

    // Custom quests first
    customQuests.forEach(q => {
      allQuests.push({ id: 'cq_' + q.id, label: q.title, type: 'custom' });
    });

    // Subject-based quests
    todaySubjects.forEach(s => {
      allQuests.push({
        id: 'sq_' + s.id,
        label: `📚 เตรียมพร้อม: ${s.name} (${s.startTime}-${s.endTime})`,
        type: 'subject',
        isExam: s.isExam,
      });
    });

    if (allQuests.length === 0) {
      listEl.innerHTML = '';
      emptyEl.classList.remove('hidden');
      updateStartDayBtn(0, 0);
      return;
    }

    emptyEl.classList.add('hidden');
    listEl.innerHTML = allQuests.map(q => {
      const done = todayChecks[q.id] || false;
      const examClass = q.isExam ? 'quest-exam' : '';
      return `
        <div class="quest-item ${done ? 'completed hidden' : ''} ${examClass}" data-quest-id="${q.id}">
          <div class="quest-checkbox">
            <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="3">
              <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"/>
            </svg>
          </div>
          <span class="quest-label text-sm font-medium flex-1">${escapeHtml(q.label)}</span>
          ${q.isExam ? '<span class="exam-badge ml-1">⚠️ สอบ</span>' : ''}
        </div>
      `;
    }).join('');

    const completedCount = allQuests.filter(q => todayChecks[q.id]).length;
    updateStartDayBtn(completedCount, allQuests.length);

    // Click handlers
    listEl.querySelectorAll('.quest-item').forEach(item => {
      item.addEventListener('click', () => {
        const qid = item.dataset.questId;
        const checkedQuests = getData('questChecks', {});
        const todayChecks = checkedQuests[todayKey] || {};
        todayChecks[qid] = !todayChecks[qid];
        checkedQuests[todayKey] = todayChecks;
        setData('questChecks', checkedQuests);
        renderMorningQuests();
      });
    });
  }

  function updateStartDayBtn(completed, total) {
    const btn = $('start-day-btn');
    const progressText = $('quest-progress-text');
    const progressBar = $('quest-progress-bar');

    progressText.textContent = `${completed} / ${total}`;
    const pct = total === 0 ? 100 : (completed / total) * 100;
    progressBar.style.width = pct + '%';

    if (completed >= total) {
      btn.disabled = false;
      btn.className = 'w-full py-4 rounded-2xl font-bold text-lg transition-all duration-300 relative overflow-hidden start-day-active';
      btn.innerHTML = '<span class="relative z-10">🚀 เริ่มวันใหม่ (Start My Day)</span>';
    } else {
      btn.disabled = true;
      btn.className = 'w-full py-4 rounded-2xl font-bold text-lg bg-surface-800 text-surface-500 cursor-not-allowed transition-all duration-300 relative overflow-hidden';
      btn.innerHTML = '<span class="relative z-10">🔒 ทำเควสให้ครบก่อน</span>';
    }
  }

  // --- Start Day: full ceremony ---
  $('start-day-btn').addEventListener('click', () => {
    if ($('start-day-btn').disabled) return;
    const todayKey = getTodayStr();

    // 1. Mark morning done
    const morningDone = getData('morningDone', {});
    morningDone[todayKey] = true;
    setData('morningDone', morningDone);

    // 2. Update streak count
    const streakData = getData('streak', { count: 0, lastDate: '' });
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayKey = `${yesterday.getFullYear()}-${String(yesterday.getMonth() + 1).padStart(2, '0')}-${String(yesterday.getDate()).padStart(2, '0')}`;
    if (streakData.lastDate === yesterdayKey) {
      streakData.count += 1;
    } else if (streakData.lastDate !== todayKey) {
      streakData.count = 1;
    }
    streakData.lastDate = todayKey;
    setData('streak', streakData);

    // 3. Cleanup: remove assignments that are done AND overdue > 7 days
    const assignments = getData('assignments', []);
    const cleaned = assignments.filter(a => {
      if (a.done && getDaysUntil(a.dueDate) < -7) return false;
      return true;
    });
    if (cleaned.length !== assignments.length) {
      setData('assignments', cleaned);
    }

    // 4. Show celebration transition
    const btn = $('start-day-btn');
    btn.innerHTML = `<span class="relative z-10">🎉 สู้ๆ นะ! Streak: ${streakData.count} วัน</span>`;
    btn.classList.add('start-day-celebrate');

    setTimeout(() => {
      showScreen('main');
      initMainApp();
      showToast(`เริ่มวันใหม่! 🔥 Streak ${streakData.count} วันติดต่อกัน! สู้ๆ นะ! 💪`);
    }, 800);
  });

  // --- Skip Quest: skip without streak ---
  $('skip-quest-btn').addEventListener('click', () => {
    if (!confirm('ข้ามเควสเช้า? (จะไม่นับ streak)')) return;
    const morningDone = getData('morningDone', {});
    morningDone[getTodayStr()] = true;
    setData('morningDone', morningDone);

    // Reset streak
    const streakData = getData('streak', { count: 0, lastDate: '' });
    streakData.count = 0;
    setData('streak', streakData);

    showScreen('main');
    initMainApp();
    showToast('ข้ามเควสเช้า — streak รีเซ็ต', 'info');
  });

  $('morning-add-quest-shortcut').addEventListener('click', () => {
    const morningDone = getData('morningDone', {});
    morningDone[getTodayStr()] = true;
    setData('morningDone', morningDone);
    showScreen('main');
    initMainApp();
    switchPage('manage');
    switchManageTab('quests');
  });

  // ===== MAIN APP =====
  function initMainApp() {
    startClock();
    renderHomePage();
    renderManagePage();
    renderJournalPage();
  }

  // --- Clock ---
  function startClock() {
    if (clockInterval) clearInterval(clockInterval);
    updateClock();
    clockInterval = setInterval(updateClock, 1000);
  }

  function updateClock() {
    const now = new Date();
    const day = DAYS_TH[now.getDay()];
    const date = now.getDate();
    const month = MONTHS_TH[now.getMonth()];
    const year = now.getFullYear() + 543;
    const h = String(now.getHours()).padStart(2, '0');
    const m = String(now.getMinutes()).padStart(2, '0');
    const s = String(now.getSeconds()).padStart(2, '0');

    $('home-date-label').textContent = `วัน${day}ที่ ${date} ${month} ${year}`;
    $('home-time').textContent = `${h}:${m}:${s}`;

    const hour = now.getHours();
    let greeting = '';
    if (hour < 6) greeting = '🌙 ดึกแล้วนะ พักผ่อนบ้างนะ';
    else if (hour < 12) greeting = '🌅 สวัสดีตอนเช้า';
    else if (hour < 17) greeting = '☀️ สวัสดีตอนบ่าย';
    else if (hour < 21) greeting = '🌆 สวัสดีตอนเย็น';
    else greeting = '🌙 สวัสดีตอนค่ำ';

    $('home-greeting').textContent = `${greeting}, ${currentUser.displayName}`;

    // Update current class indicator
    renderCurrentClass();
    updateRoutineQuestButton();
  }

  function updateRoutineQuestButton() {
    const btn = $('home-routine-quest-btn');
    if (!btn) return;

    const todayStr = getTodayStr();
    const routineChecks = getData('routineChecks', {});
    const todayChecks = routineChecks[todayStr] || {};
    const currentMins = nowMinutes();

    // Find the first quest that is NOT done, and is either overdue or within 5 mins of starting
    let activeQuest = null;
    let isOverdue = false;

    for (const q of ROUTINE_QUESTS) {
      if (!todayChecks[q.id]) {
        const targetMins = timeToMinutes(q.targetTime);
        if (currentMins >= targetMins - 5) {
          activeQuest = q;
          isOverdue = currentMins >= targetMins;
          break;
        }
      }
    }

    if (!activeQuest) {
      btn.classList.add('hidden');
      return;
    }

    btn.classList.remove('hidden');
    
    // Style based on overdue status
    if (isOverdue) {
      btn.className = 'mb-4 cursor-pointer transition-all duration-300 transform hover:scale-[1.02] shadow-lg bg-danger/10 border-2 border-danger/50 p-4 rounded-2xl flex items-center justify-between text-danger shadow-danger/20';
      btn.innerHTML = `
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-full bg-danger/20 flex items-center justify-center text-xl animate-pulse">⚠️</div>
          <div>
            <p class="font-bold text-lg">เควสประจำวัน: ${activeQuest.name}</p>
            <p class="text-xs font-semibold">เลยเวลาเป้าหมาย (${activeQuest.targetTime} น.) แล้ว!</p>
          </div>
        </div>
        <button class="bg-danger text-white px-4 py-2 rounded-xl font-bold hover:opacity-80 transition-opacity">สำเร็จ</button>
      `;
    } else {
      btn.className = 'mb-4 cursor-pointer transition-all duration-300 transform hover:scale-[1.02] shadow-lg bg-yellow-500/20 border-2 border-yellow-500/50 p-4 rounded-2xl flex items-center justify-between text-yellow-500 shadow-yellow-500/20';
      btn.innerHTML = `
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-full bg-yellow-500/30 flex items-center justify-center text-xl animate-bounce">⭐</div>
          <div>
            <p class="font-bold text-lg">เควสประจำวัน: ${activeQuest.name}</p>
            <p class="text-xs font-semibold">ใกล้ถึงเวลาเป้าหมาย (${activeQuest.targetTime} น.)</p>
          </div>
        </div>
        <button class="bg-yellow-500 text-white px-4 py-2 rounded-xl font-bold hover:opacity-80 transition-opacity">สำเร็จ</button>
      `;
    }

    btn.onclick = () => {
      todayChecks[activeQuest.id] = true;
      routineChecks[todayStr] = todayChecks;
      setData('routineChecks', routineChecks);
      showToast(`ทำเควส ${activeQuest.name} สำเร็จ! 🎉`, 'success');
      updateRoutineQuestButton();
    };
  }

  // --- Current Class Indicator ---
  function renderCurrentClass() {
    const el = $('current-class-card');
    if (!el) return;

    const todayName = getTodayDayName();
    const isWeekday = WEEKDAY_OPTIONS.includes(todayName);
    const current = nowMinutes();

    if (!isWeekday) {
      el.innerHTML = `
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-xl bg-surface-700 flex items-center justify-center text-lg">🎉</div>
          <div>
            <p class="text-xs text-surface-500">ตอนนี้</p>
            <p class="font-semibold text-sm">วันหยุด — ไม่มีคาบเรียน</p>
          </div>
        </div>`;
      return;
    }

    // Check if in break
    for (const brk of BREAKS) {
      const bStart = timeToMinutes(brk.startTime);
      const bEnd = timeToMinutes(brk.endTime);
      if (current >= bStart && current < bEnd) {
        const remaining = bEnd - current;
        el.innerHTML = `
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500/20 to-orange-500/20 flex items-center justify-center text-lg">☕</div>
            <div class="flex-1 min-w-0">
              <p class="text-xs text-amber-400/80">ตอนนี้ — พักเบรก</p>
              <p class="font-semibold text-sm text-amber-200">${escapeHtml(brk.name)}</p>
              <p class="text-xs text-surface-500">${brk.startTime} - ${brk.endTime} น. (เหลือ ${remaining} นาที)</p>
            </div>
          </div>`;
        return;
      }
    }

    // Check current subject
    const todaySubjects = getTodaySubjectsSorted();
    let currentSubject = null;
    let nextSubject = null;

    for (let i = 0; i < todaySubjects.length; i++) {
      const s = todaySubjects[i];
      const sStart = timeToMinutes(s.startTime);
      const sEnd = timeToMinutes(s.endTime);
      if (current >= sStart && current < sEnd) {
        currentSubject = s;
        // find next
        if (i + 1 < todaySubjects.length) nextSubject = todaySubjects[i + 1];
        break;
      }
    }

    if (currentSubject) {
      const sEnd = timeToMinutes(currentSubject.endTime);
      const remaining = sEnd - current;
      const examTag = currentSubject.isExam ? '<span class="exam-badge ml-2">⚠️ สอบ</span>' : '';
      el.innerHTML = `
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-xl ${currentSubject.isExam ? 'bg-gradient-to-br from-red-500/20 to-rose-500/20' : 'bg-gradient-to-br from-brand-500/20 to-cyan-500/20'} flex items-center justify-center">
            <span class="text-lg">${currentSubject.isExam ? '📝' : '📖'}</span>
          </div>
          <div class="flex-1 min-w-0">
            <p class="text-xs ${currentSubject.isExam ? 'text-rose-400' : 'text-brand-400'}">📍 กำลังเรียนตอนนี้</p>
            <p class="font-semibold text-sm ${currentSubject.isExam ? 'text-rose-200' : ''}">${escapeHtml(currentSubject.name)}${examTag}</p>
            <p class="text-xs text-surface-500">${currentSubject.startTime} - ${currentSubject.endTime} น. (เหลือ ${remaining} นาที)</p>
          </div>
          <div class="current-class-pulse ${currentSubject.isExam ? 'exam-pulse' : ''}"></div>
        </div>
        ${nextSubject ? `<div class="mt-2 pt-2 border-t border-white/5 flex items-center gap-2 text-xs text-surface-500">
          <span>⏭️ ถัดไป:</span>
          <span class="font-medium text-surface-300">${escapeHtml(nextSubject.name)}</span>
          <span>(${nextSubject.startTime})</span>
        </div>` : ''}`;
    } else {
      // Before school / after school / between classes
      // Find next upcoming subject
      let upcoming = null;
      for (const s of todaySubjects) {
        if (timeToMinutes(s.startTime) > current) {
          upcoming = s;
          break;
        }
      }

      if (upcoming) {
        const untilStart = timeToMinutes(upcoming.startTime) - current;
        el.innerHTML = `
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-xl bg-surface-700 flex items-center justify-center text-lg">⏳</div>
            <div class="flex-1 min-w-0">
              <p class="text-xs text-surface-500">ตอนนี้ — ว่าง</p>
              <p class="font-semibold text-sm">คาบถัดไป: ${escapeHtml(upcoming.name)}</p>
              <p class="text-xs text-surface-500">${upcoming.startTime} น. (อีก ${untilStart} นาที)</p>
            </div>
          </div>`;
      } else {
        // After last class or before first class
        if (todaySubjects.length > 0 && current >= timeToMinutes(todaySubjects[todaySubjects.length - 1].endTime)) {
          el.innerHTML = `
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500/20 to-green-500/20 flex items-center justify-center text-lg">✅</div>
              <div>
                <p class="text-xs text-emerald-400">เรียนครบทุกคาบแล้ว!</p>
                <p class="font-semibold text-sm">หมดคาบเรียนวันนี้ 🎉</p>
              </div>
            </div>`;
        } else {
          el.innerHTML = `
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 rounded-xl bg-surface-700 flex items-center justify-center text-lg">📅</div>
              <div>
                <p class="text-xs text-surface-500">ตอนนี้</p>
                <p class="font-semibold text-sm">ยังไม่ถึงเวลาเรียน</p>
              </div>
            </div>`;
        }
      }
    }
  }

  // --- Home Page ---
  function renderHomePage() {
    renderCurrentClass();
    renderTodaySchedule();
    renderUpcomingAssignments();
  }

  function renderTodaySchedule() {
    const todaySubjects = getTodaySubjectsSorted();
    const current = nowMinutes();
    const assignments = getData('assignments', []);

    const listEl = $('home-schedule-list');
    const emptyEl = $('home-schedule-empty');

    if (todaySubjects.length === 0) {
      listEl.innerHTML = '';
      emptyEl.classList.remove('hidden');
      return;
    }

    emptyEl.classList.add('hidden');

    // Step 1: Merge consecutive same-name subjects
    const mergedSubjects = [];
    for (let i = 0; i < todaySubjects.length; i++) {
      const s = todaySubjects[i];
      if (mergedSubjects.length > 0) {
        const last = mergedSubjects[mergedSubjects.length - 1];
        if (last.name === s.name && last.endTime === s.startTime) {
          // Merge: extend end time, add period count
          last.endTime = s.endTime;
          last.periods = (last.periods || 1) + 1;
          last.mergedIds.push(s.id);
          continue;
        }
      }
      mergedSubjects.push({
        ...s,
        periods: 1,
        mergedIds: [s.id],
        originalStartTime: s.startTime,
      });
    }

    // Step 2: Filter out past periods (but keep current one)
    const visibleSubjects = mergedSubjects.filter(s => {
      const sEnd = timeToMinutes(s.endTime);
      return current < sEnd; // keep if not yet ended
    });

    // If all classes are done, show empty state
    if (visibleSubjects.length === 0 && mergedSubjects.length > 0) {
      listEl.innerHTML = `
        <div class="glass-card p-6 rounded-2xl text-center animate-fade-in">
          <div class="text-3xl mb-2">✅</div>
          <p class="text-surface-400 text-sm">เรียนครบทุกคาบแล้ววันนี้!</p>
          <p class="text-surface-500 text-xs mt-1">ผ่านมาทั้งหมด ${mergedSubjects.length} คาบ</p>
        </div>`;
      return;
    }

    // Step 3: Build schedule items with break blocks
    const scheduleItems = [];
    for (let i = 0; i < visibleSubjects.length; i++) {
      const s = visibleSubjects[i];
      scheduleItems.push({ type: 'subject', data: s });

      // Check if break follows before next subject
      if (i < visibleSubjects.length - 1) {
        const nextStart = visibleSubjects[i + 1].startTime;
        const thisEnd = s.endTime;
        for (const brk of BREAKS) {
          if (brk.startTime === thisEnd || (timeToMinutes(thisEnd) <= timeToMinutes(brk.startTime) && timeToMinutes(nextStart) >= timeToMinutes(brk.endTime))) {
            // Only show break if it hasn't fully passed
            if (current < timeToMinutes(brk.endTime)) {
              scheduleItems.push({ type: 'break', data: brk });
            }
            break;
          }
        }
      }
    }

    listEl.innerHTML = scheduleItems.map(item => {
      if (item.type === 'break') {
        const brk = item.data;
        const bStart = timeToMinutes(brk.startTime);
        const bEnd = timeToMinutes(brk.endTime);
        const isNow = current >= bStart && current < bEnd;
        const remaining = bEnd - current;
        return `
          <div class="break-block ${isNow ? 'break-block-active' : ''} animate-fade-in">
            <div class="break-block-icon">${brk.name.includes('กลางวัน') ? '🍱' : '☕'}</div>
            <div class="break-block-content">
              <p class="break-block-title">${escapeHtml(brk.name)}</p>
              <p class="break-block-time">${brk.startTime} - ${brk.endTime} น.${isNow ? ` · เหลือ ${remaining} นาที` : ''}</p>
            </div>
            ${isNow ? '<div class="break-block-pulse"></div>' : ''}
          </div>`;
      }

      const s = item.data;
      const isExam = s.isExam;
      const sStart = timeToMinutes(s.startTime);
      const sEnd = timeToMinutes(s.endTime);
      const isCurrentClass = current >= sStart && current < sEnd;
      const isMerged = s.periods > 1;

      // Check if this subject has assignments due today
      const subjectAssignments = assignments.filter(a =>
        !a.done &&
        a.subject.includes(s.name.split(' ').pop()) &&
        getDaysUntil(a.dueDate) === 0
      );

      return `
        <div class="schedule-card ${isExam ? 'exam-card' : ''} ${isCurrentClass ? 'current-class-card-highlight' : ''} ${isMerged ? 'merged-block' : ''} animate-fade-in cursor-pointer subject-clickable" data-subject-id="${s.mergedIds[0]}">
          ${isCurrentClass ? '<div class="current-class-indicator"></div>' : ''}
          <div class="schedule-time">
            <span class="text-xs font-semibold ${isExam ? 'text-exam' : isCurrentClass ? 'text-brand-300' : 'text-brand-400'}">${s.startTime}</span>
            <span class="text-[0.625rem] text-surface-500">ถึง</span>
            <span class="text-xs font-semibold ${isExam ? 'text-exam' : isCurrentClass ? 'text-brand-300' : 'text-brand-400'}">${s.endTime}</span>
            ${isMerged ? `<span class="merged-badge">${s.periods} คาบ</span>` : ''}
          </div>
          <div class="flex-1 min-w-0">
            <div class="flex items-center gap-2 flex-wrap">
              <span class="font-semibold text-sm ${isExam ? 'text-rose-200' : ''}">${escapeHtml(s.name)}</span>
              ${isExam ? '<span class="exam-badge">⚠️ สอบ</span>' : ''}
              ${isCurrentClass ? '<span class="now-badge">📍 ตอนนี้</span>' : ''}
              ${isMerged ? '<span class="text-[0.625rem] text-surface-500">(ต่อเนื่อง)</span>' : ''}
            </div>
            ${s.room ? `<p class="text-xs text-surface-500 mt-0.5">ห้อง: ${escapeHtml(s.room)}</p>` : ''}
            ${subjectAssignments.length > 0 ? `<p class="text-xs text-accent-400 mt-0.5">📢 มีงานต้องส่งวันนี้!</p>` : ''}
            ${isCurrentClass ? `
              <button class="quick-add-btn mt-2 bg-brand-600/30 text-brand-300 text-[10px] px-2 py-1 rounded-lg border border-brand-500/30 flex items-center gap-1 hover:bg-brand-500/40 w-max" data-subject-name="${escapeHtml(s.name)}">
                <svg class="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/></svg> เพิ่มงาน/สอบ
              </button>
            ` : ''}
          </div>
          <svg class="w-4 h-4 text-surface-600 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7"/></svg>
        </div>
      `;
    }).join('');

    // Click handlers for subject detail
    listEl.querySelectorAll('.subject-clickable').forEach(card => {
      card.addEventListener('click', (e) => {
        if (e.target.closest('.quick-add-btn')) return;
        openSubjectDetail(card.dataset.subjectId);
      });
    });

    listEl.querySelectorAll('.quick-add-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const sName = btn.getAttribute('data-subject-name');
        openAssignmentModal(null, sName, 'homework');
      });
    });
  }

  function renderUpcomingAssignments() {
    const assignments = getData('assignments', []);
    const upcoming = assignments
      .filter(a => !a.done && getDaysUntil(a.dueDate) >= 0)
      .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));

    const listEl = $('home-assignment-list');
    const emptyEl = $('home-assignment-empty');

    if (upcoming.length === 0) {
      listEl.innerHTML = '';
      emptyEl.classList.remove('hidden');
      return;
    }

    emptyEl.classList.add('hidden');
    listEl.innerHTML = upcoming.map(a => {
      const daysLeft = getDaysUntil(a.dueDate);
      let urgencyClass = 'normal';
      let urgencyLabel = `อีก ${daysLeft} วัน`;
      let cardClass = '';

      if (daysLeft === 0) {
        urgencyClass = 'urgent';
        urgencyLabel = '📢 ต้องส่งวันนี้!';
        cardClass = 'urgent';
      } else if (daysLeft === 1) {
        urgencyClass = 'urgent';
        urgencyLabel = '⏰ พรุ่งนี้!';
        cardClass = 'urgent';
      } else if (daysLeft <= 3) {
        urgencyClass = 'soon';
        urgencyLabel = `⚡ อีก ${daysLeft} วัน`;
      }

      if (a.type === 'exam') {
        cardClass = 'exam-type';
      }

      return `
        <div class="assignment-card ${cardClass} animate-fade-in">
          <div class="flex items-start justify-between gap-2">
            <div class="flex-1 min-w-0">
              <div class="flex items-center gap-2 flex-wrap">
                <span class="font-semibold text-sm">${escapeHtml(a.subject)}</span>
                ${a.type === 'exam' ? '<span class="exam-badge">📝 สอบ</span>' : ''}
              </div>
              <p class="text-xs text-surface-400 mt-0.5">${escapeHtml(a.detail)}</p>
              <p class="text-xs text-surface-500 mt-1">กำหนดส่ง: ${formatDate(a.dueDate)}</p>
            </div>
            <div class="flex flex-col items-end gap-1.5">
              <span class="due-badge ${urgencyClass}">${urgencyLabel}</span>
              <button class="btn-secondary text-[0.6875rem] complete-assignment-btn" data-id="${a.id}">✓ เสร็จ</button>
            </div>
          </div>
        </div>
      `;
    }).join('');

    listEl.querySelectorAll('.complete-assignment-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const id = btn.dataset.id;
        const assignments = getData('assignments', []);
        const idx = assignments.findIndex(a => a.id === id);
        if (idx >= 0) {
          assignments[idx].done = true;
          setData('assignments', assignments);
          showToast('ส่งงานเรียบร้อย! 🎉');
          renderHomePage();
          renderManagePage();
        }
      });
    });
  }

  // ===== SUBJECT DETAIL MODAL =====
  function openSubjectDetail(subjectId) {
    const subjects = getData('subjects', []);
    const subject = subjects.find(s => s.id === subjectId);
    if (!subject) return;

    const assignments = getData('assignments', []);
    const notes = getData('subjectNotes', {});
    const subjectNote = notes[subjectId] || '';

    // Find assignments related to this subject (by name match)
    const subjectName = subject.name;
    const relatedAssignments = assignments.filter(a => {
      // Match by subject name parts
      const nameParts = subjectName.split(' ');
      return nameParts.some(part => part.length > 2 && a.subject.includes(part)) || a.subject === subjectName;
    });

    const homeworkAssignments = relatedAssignments.filter(a => a.type !== 'exam');
    const examAssignments = relatedAssignments.filter(a => a.type === 'exam');

    openModal(`📖 ${subject.name}`, `
      <div class="space-y-4">
        <!-- Subject Info -->
        <div class="glass-card-inner p-3 rounded-xl">
          <div class="flex items-center gap-2 flex-wrap text-xs text-surface-400">
            <span>📅 ${subject.days.join(', ')}</span>
            <span>·</span>
            <span>🕐 ${subject.startTime} - ${subject.endTime}</span>
            ${subject.room ? `<span>· 🏫 ห้อง ${escapeHtml(subject.room)}</span>` : ''}
          </div>
          ${subject.isExam ? '<div class="mt-2"><span class="exam-badge">⚠️ วิชานี้มีสอบ</span></div>' : ''}
        </div>

        <!-- Homework Section (Blue) -->
        <div>
          <h4 class="font-semibold text-sm mb-2 flex items-center gap-2">
            <span class="w-2 h-2 rounded-full bg-brand-500"></span>
            <span class="text-brand-300">งาน/การบ้าน</span>
            <span class="text-xs text-surface-500">(${homeworkAssignments.length})</span>
          </h4>
          ${homeworkAssignments.length > 0 ? homeworkAssignments.map(a => {
            const daysLeft = getDaysUntil(a.dueDate);
            const isDueToday = daysLeft === 0;
            const isOverdue = daysLeft < 0;
            // Blue for normal, Orange for due today
            const cardStyle = isDueToday ? 'border-color:rgba(255,122,13,0.4); background:rgba(255,122,13,0.08);' :
                             isOverdue ? 'border-color:rgba(239,68,68,0.4); background:rgba(239,68,68,0.08);' :
                             'border-color:rgba(47,122,255,0.3); background:rgba(47,122,255,0.06);';
            const dotColor = isDueToday ? 'bg-accent-500' : isOverdue ? 'bg-danger' : 'bg-brand-500';
            return `
              <div class="detail-card mb-2" style="${cardStyle}">
                <div class="flex items-start gap-2">
                  <span class="w-1.5 h-1.5 rounded-full ${dotColor} mt-1.5 shrink-0"></span>
                  <div class="flex-1 min-w-0">
                    <p class="text-sm font-medium ${a.done ? 'line-through text-surface-500' : ''}">${escapeHtml(a.detail || a.subject)}</p>
                    <p class="text-xs text-surface-500 mt-0.5">กำหนดส่ง: ${formatDate(a.dueDate)}${isDueToday ? ' <span class="text-accent-400 font-semibold">— วันนี้!</span>' : ''}${isOverdue ? ' <span class="text-danger font-semibold">— เลยกำหนด!</span>' : ''}</p>
                  </div>
                  ${!a.done ? `<button class="btn-secondary text-[0.625rem] detail-complete-btn" data-id="${a.id}">✓</button>` : '<span class="text-xs text-success">✓</span>'}
                </div>
              </div>`;
          }).join('') : '<p class="text-xs text-surface-600 ml-4">ไม่มีงาน/การบ้าน</p>'}
        </div>

        <!-- Exam Section (Red) -->
        <div>
          <h4 class="font-semibold text-sm mb-2 flex items-center gap-2">
            <span class="w-2 h-2 rounded-full bg-exam"></span>
            <span class="text-rose-300">สรุปสอบ / ตารางสอบ</span>
            <span class="text-xs text-surface-500">(${examAssignments.length})</span>
          </h4>
          ${examAssignments.length > 0 ? examAssignments.map(a => {
            const daysLeft = getDaysUntil(a.dueDate);
            return `
              <div class="detail-card mb-2" style="border-color:rgba(225,29,72,0.4); background:rgba(225,29,72,0.08);">
                <div class="flex items-start gap-2">
                  <span class="w-1.5 h-1.5 rounded-full bg-exam mt-1.5 shrink-0"></span>
                  <div class="flex-1 min-w-0">
                    <p class="text-sm font-medium ${a.done ? 'line-through text-surface-500' : 'text-rose-200'}">${escapeHtml(a.detail || 'สอบ')}</p>
                    <p class="text-xs text-surface-500 mt-0.5">วันสอบ: ${formatDate(a.dueDate)}${daysLeft === 0 ? ' <span class="text-exam font-semibold">— วันนี้!</span>' : daysLeft > 0 ? ` (อีก ${daysLeft} วัน)` : ''}</p>
                  </div>
                  ${!a.done ? `<button class="btn-secondary text-[0.625rem] detail-complete-btn" data-id="${a.id}">✓</button>` : '<span class="text-xs text-success">✓</span>'}
                </div>
              </div>`;
          }).join('') : '<p class="text-xs text-surface-600 ml-4">ยังไม่มีรายการสอบ</p>'}
        </div>

        <!-- Notes Section -->
        <div>
          <h4 class="font-semibold text-sm mb-2 flex items-center gap-2">
            <span class="w-2 h-2 rounded-full bg-emerald-500"></span>
            <span class="text-emerald-300">โน้ตสรุปเนื้อหา</span>
          </h4>
          <textarea id="subject-note-input" class="input-field min-h-[100px] resize-none text-sm" placeholder="พิมพ์โน้ตสรุปเนื้อหาวิชานี้...">${escapeHtml(subjectNote)}</textarea>
          <button id="save-subject-note-btn" class="btn-primary w-full mt-2 text-sm" data-subject-id="${subjectId}">
            💾 บันทึกโน้ต
          </button>
        </div>

        <!-- Quick Add Assignment — Two Buttons -->
        <div class="border-t border-white/5 pt-3">
          <div class="grid grid-cols-2 gap-2">
            <button id="quick-add-homework-btn" class="btn-add text-sm" data-subject-name="${escapeHtml(subject.name)}">
              <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4"/></svg>
              📄 เพิ่มงาน
            </button>
            <button id="quick-add-exam-btn" class="btn-add text-sm quick-add-exam" data-subject-name="${escapeHtml(subject.name)}">
              <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4"/></svg>
              📝 เพิ่มสอบ
            </button>
          </div>
        </div>
      </div>
    `);

    // Save note handler
    $('save-subject-note-btn').addEventListener('click', () => {
      const noteText = $('subject-note-input').value.trim();
      const notes = getData('subjectNotes', {});
      notes[subjectId] = noteText;
      setData('subjectNotes', notes);
      showToast('บันทึกโน้ตเรียบร้อย! 📝');
    });

    // Quick add homework
    $('quick-add-homework-btn').addEventListener('click', () => {
      closeModal();
      setTimeout(() => openAssignmentModal(null, subject.name, 'homework'), 200);
    });

    // Quick add exam
    $('quick-add-exam-btn').addEventListener('click', () => {
      closeModal();
      setTimeout(() => openAssignmentModal(null, subject.name, 'exam'), 200);
    });

    // Complete assignment from detail
    document.querySelectorAll('#modal-body .detail-complete-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const id = btn.dataset.id;
        const assignments = getData('assignments', []);
        const idx = assignments.findIndex(a => a.id === id);
        if (idx >= 0) {
          assignments[idx].done = true;
          setData('assignments', assignments);
          showToast('เสร็จแล้ว! 🎉');
          // Refresh the detail modal
          closeModal();
          setTimeout(() => openSubjectDetail(subjectId), 200);
          renderHomePage();
        }
      });
    });
  }

  // ===== NAVIGATION =====
  qsa('.nav-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      switchPage(btn.dataset.page);
    });
  });

  function switchPage(page) {
    qsa('.nav-btn').forEach(b => b.classList.toggle('active', b.dataset.page === page));
    qsa('.page-section').forEach(p => p.classList.add('hidden'));
    $(`page-${page}`).classList.remove('hidden');

    if (page === 'home') renderHomePage();
    else if (page === 'manage') {
      renderManagePage();
      switchManageTab('assignments'); // Force assignments tab as default
    }
    else if (page === 'journal') renderJournalPage();
  }

  // ===== MANAGE PAGE =====
  qsa('.manage-tab').forEach(tab => {
    tab.addEventListener('click', () => switchManageTab(tab.dataset.tab));
  });

  function switchManageTab(tabName) {
    qsa('.manage-tab').forEach(t => t.classList.toggle('active', t.dataset.tab === tabName));
    qsa('.tab-content').forEach(c => c.classList.add('hidden'));
    $(`tab-${tabName}`).classList.remove('hidden');
  }

  function renderManagePage() {
    renderSubjectList();
    renderAssignmentManageList();
    renderQuestManageList();
  }

  // --- Subjects Management (grouped by day) ---
  function renderSubjectList() {
    const subjects = getData('subjects', []);
    const listEl = $('subject-list');
    const emptyEl = $('subject-empty');

    if (subjects.length === 0) {
      listEl.innerHTML = '';
      emptyEl.classList.remove('hidden');
      return;
    }

    emptyEl.classList.add('hidden');

    // Group by day
    const byDay = {};
    WEEKDAY_OPTIONS.forEach(d => { byDay[d] = []; });
    subjects.forEach(s => {
      s.days.forEach(d => {
        if (byDay[d]) byDay[d].push(s);
      });
    });

    let html = '';
    for (const day of WEEKDAY_OPTIONS) {
      const daySubjects = byDay[day].sort((a, b) => a.startTime.localeCompare(b.startTime));
      if (daySubjects.length === 0) continue;

      const todayName = getTodayDayName();
      const isToday = day === todayName;

      html += `
        <div class="mb-4">
          <div class="flex items-center gap-2 mb-2">
            <span class="text-xs font-bold ${isToday ? 'text-brand-400' : 'text-surface-500'}">${day}${isToday ? ' (วันนี้)' : ''}</span>
            <div class="flex-1 h-px ${isToday ? 'bg-brand-500/20' : 'bg-white/5'}"></div>
          </div>
          ${daySubjects.map(s => `
            <div class="manage-item mb-1.5 cursor-pointer subject-manage-click" data-subject-id="${s.id}" style="${s.isExam ? 'border-color: rgba(225,29,72,0.3);' : ''}">
              <div class="flex-1 min-w-0">
                <div class="flex items-center gap-2 flex-wrap">
                  <span class="text-xs text-surface-500 font-mono w-[90px] shrink-0">${s.startTime}-${s.endTime}</span>
                  <span class="font-semibold text-sm">${escapeHtml(s.name)}</span>
                  ${s.isExam ? '<span class="exam-badge">⚠️ สอบ</span>' : ''}
                </div>
                ${s.room ? `<p class="text-xs text-surface-500 ml-[98px]">ห้อง ${escapeHtml(s.room)}</p>` : ''}
              </div>
              <div class="item-actions">
                <button class="btn-secondary edit-subject-btn" data-id="${s.id}" title="แก้ไข">
                  <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"/></svg>
                </button>
                <button class="btn-danger delete-subject-btn" data-id="${s.id}" title="ลบ">
                  <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
                </button>
              </div>
            </div>
          `).join('')}
        </div>
      `;
    }

    listEl.innerHTML = html;

    // Click to view subject detail
    listEl.querySelectorAll('.subject-manage-click').forEach(card => {
      card.addEventListener('click', (e) => {
        // Don't trigger if clicking edit/delete buttons
        if (e.target.closest('.item-actions')) return;
        openSubjectDetail(card.dataset.subjectId);
      });
    });

    listEl.querySelectorAll('.edit-subject-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        openSubjectModal(btn.dataset.id);
      });
    });
    listEl.querySelectorAll('.delete-subject-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        deleteSubject(btn.dataset.id);
      });
    });
  }

  $('add-subject-btn').addEventListener('click', () => openSubjectModal());
  $('reset-subject-btn')?.addEventListener('click', () => {
    if (confirm('คุณต้องการรีเซ็ตตารางเรียนกลับไปเป็นค่าเริ่มต้นหรือไม่? (วิชาที่เพิ่มเองจะหายไป)')) {
      seedDefaultSubjects();
      renderSubjectList();
      showToast('รีเซ็ตตารางเรียนเรียบร้อยแล้ว', 'success');
    }
  });

  function openSubjectModal(editId) {
    const existing = editId ? getData('subjects', []).find(s => s.id === editId) : null;
    const title = existing ? 'แก้ไขวิชาเรียน' : 'เพิ่มวิชาเรียน';

    const selectedDays = existing ? existing.days : [];
    const isExam = existing ? existing.isExam : false;

    openModal(title, `
      <div class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-surface-300 mb-1.5">ชื่อวิชา</label>
          <input id="m-subject-name" type="text" class="input-field" placeholder="เช่น คณิตศาสตร์" value="${existing ? escapeHtml(existing.name) : ''}" />
        </div>
        <div>
          <label class="block text-sm font-medium text-surface-300 mb-1.5">ห้องเรียน (ไม่จำเป็น)</label>
          <input id="m-subject-room" type="text" class="input-field" placeholder="เช่น 301" value="${existing ? escapeHtml(existing.room || '') : ''}" />
        </div>
        <div>
          <label class="block text-sm font-medium text-surface-300 mb-2">วันเรียน</label>
          <div class="flex flex-wrap gap-2" id="m-day-chips">
            ${WEEKDAY_OPTIONS.map(d => `
              <button class="day-chip ${selectedDays.includes(d) ? 'selected' : ''}" data-day="${d}">${d}</button>
            `).join('')}
          </div>
        </div>
        <div class="grid grid-cols-2 gap-3">
          <div>
            <label class="block text-sm font-medium text-surface-300 mb-1.5">เริ่ม</label>
            <input id="m-subject-start" type="time" class="input-field" value="${existing ? existing.startTime : '08:00'}" />
          </div>
          <div>
            <label class="block text-sm font-medium text-surface-300 mb-1.5">สิ้นสุด</label>
            <input id="m-subject-end" type="time" class="input-field" value="${existing ? existing.endTime : '09:00'}" />
          </div>
        </div>
        <div>
          <label class="block text-sm font-medium text-surface-300 mb-2">ประเภท</label>
          <div class="flex gap-2">
            <button class="toggle-chip ${!isExam ? 'selected' : ''}" id="m-type-normal">📚 วิชาเรียนปกติ</button>
            <button class="toggle-chip ${isExam ? 'exam-selected' : ''}" id="m-type-exam">📝 วันสอบ</button>
          </div>
        </div>
        <button id="m-save-subject" class="btn-primary w-full mt-2">${existing ? 'บันทึกการแก้ไข' : 'เพิ่มวิชา'}</button>
      </div>
    `);

    qsa('#m-day-chips .day-chip').forEach(chip => {
      chip.addEventListener('click', () => chip.classList.toggle('selected'));
    });

    let examMode = isExam;
    $('m-type-normal').addEventListener('click', () => {
      examMode = false;
      $('m-type-normal').className = 'toggle-chip selected';
      $('m-type-exam').className = 'toggle-chip';
    });
    $('m-type-exam').addEventListener('click', () => {
      examMode = true;
      $('m-type-exam').className = 'toggle-chip exam-selected';
      $('m-type-normal').className = 'toggle-chip';
    });

    $('m-save-subject').addEventListener('click', () => {
      const name = $('m-subject-name').value.trim();
      const room = $('m-subject-room').value.trim();
      const days = Array.from(qsa('#m-day-chips .day-chip.selected')).map(c => c.dataset.day);
      const startTime = $('m-subject-start').value;
      const endTime = $('m-subject-end').value;

      if (!name) { showToast('กรุณากรอกชื่อวิชา', 'error'); return; }
      if (days.length === 0) { showToast('กรุณาเลือกวันเรียนอย่างน้อย 1 วัน', 'error'); return; }

      const subjects = getData('subjects', []);
      if (editId) {
        const idx = subjects.findIndex(s => s.id === editId);
        if (idx >= 0) {
          subjects[idx] = { ...subjects[idx], name, room, days, startTime, endTime, isExam: examMode };
        }
      } else {
        subjects.push({ id: generateId(), name, room, days, startTime, endTime, isExam: examMode });
      }
      setData('subjects', subjects);
      closeModal();
      showToast(editId ? 'แก้ไขวิชาเรียบร้อย' : 'เพิ่มวิชาเรียบร้อย');
      renderManagePage();
      renderHomePage();
    });
  }

  function deleteSubject(id) {
    if (!confirm('ต้องการลบวิชานี้?')) return;
    const subjects = getData('subjects', []).filter(s => s.id !== id);
    setData('subjects', subjects);
    showToast('ลบวิชาเรียบร้อย');
    renderManagePage();
    renderHomePage();
  }

  // --- Assignments ---
  function renderAssignmentManageList() {
    const assignments = getData('assignments', []);
    const listEl = $('assignment-list');
    const emptyEl = $('assignment-empty');

    const sorted = [...assignments].sort((a, b) => {
      // Done items at the bottom
      if (a.done !== b.done) return a.done ? 1 : -1;
      if (a.done && b.done) return new Date(b.dueDate) - new Date(a.dueDate);

      const aDays = getDaysUntil(a.dueDate);
      const bDays = getDaysUntil(b.dueDate);
      const aUrgent = aDays <= 1 || aDays < 0; // due today, tomorrow, or overdue
      const bUrgent = bDays <= 1 || bDays < 0;

      // Urgent items first
      if (aUrgent !== bUrgent) return aUrgent ? -1 : 1;

      // Among urgent, overdue first, then today, then tomorrow
      if (aUrgent && bUrgent) {
        return aDays - bDays;
      }

      // Non-urgent: by due date ascending
      return new Date(a.dueDate) - new Date(b.dueDate);
    });

    if (sorted.length === 0) {
      listEl.innerHTML = '';
      emptyEl.classList.remove('hidden');
      return;
    }

    emptyEl.classList.add('hidden');
    listEl.innerHTML = sorted.map(a => {
      const daysLeft = getDaysUntil(a.dueDate);
      const overdue = daysLeft < 0 && !a.done;
      const isDueToday = daysLeft === 0 && !a.done;

      // Color coding: blue normal, orange due today, red exam
      let borderStyle = '';
      if (a.type === 'exam' && !a.done) {
        borderStyle = 'border-color: rgba(225,29,72,0.3); background: rgba(225,29,72,0.04);';
      } else if (isDueToday) {
        borderStyle = 'border-color: rgba(255,122,13,0.3); background: rgba(255,122,13,0.04);';
      } else if (!a.done) {
        borderStyle = 'border-color: rgba(47,122,255,0.15);';
      }

      return `
        <div class="manage-item ${a.done ? 'opacity-40' : ''}" style="${borderStyle}">
          <div class="flex-1 min-w-0">
            <div class="flex items-center gap-2 flex-wrap mb-1">
              <span class="font-bold text-sm md:text-base ${a.done ? 'line-through text-surface-500' : 'text-surface-100'}">${escapeHtml(a.detail || 'ไม่มีรายละเอียดงาน')}</span>
              ${a.type === 'exam' ? '<span class="exam-badge">📝 สอบ</span>' : '<span class="bg-brand-500/20 text-brand-300 px-2 py-0.5 rounded-full text-[10px] font-bold">📋 งาน</span>'}
              ${isDueToday ? '<span class="due-badge urgent">📢 วันนี้!</span>' : ''}
              ${a.done ? '<span class="text-xs text-success font-bold">✓ เสร็จแล้ว</span>' : ''}
              ${overdue ? '<span class="text-xs text-danger font-bold">เลยกำหนดส่ง!</span>' : ''}
            </div>
            <p class="text-xs font-semibold text-brand-400 mt-0.5">วิชา: ${escapeHtml(a.subject)}</p>
            <div class="flex flex-wrap justify-between items-center mt-2 gap-2">
              <p class="text-xs text-surface-400">กำหนดส่ง: <span class="text-surface-200 font-medium">${formatDate(a.dueDate)}</span></p>
              <p class="text-[10px] text-surface-500">บันทึกเมื่อ: ${a.createdAt ? formatTimestamp(a.createdAt) : 'ไม่ระบุ'}</p>
            </div>
          </div>
          <div class="item-actions">
            ${!a.done ? `
              <button class="btn-secondary toggle-done-btn" data-id="${a.id}" title="ทำเสร็จ">✓</button>
              <button class="btn-secondary edit-assignment-btn" data-id="${a.id}" title="แก้ไข">
                <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"/></svg>
              </button>
            ` : `
              <button class="btn-secondary toggle-done-btn" data-id="${a.id}" title="ยกเลิกเสร็จ">↩</button>
            `}
            <button class="btn-danger delete-assignment-btn" data-id="${a.id}" title="ลบ">
              <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
            </button>
          </div>
        </div>
      `;
    }).join('');

    listEl.querySelectorAll('.edit-assignment-btn').forEach(btn => {
      btn.addEventListener('click', () => openAssignmentModal(btn.dataset.id));
    });
    listEl.querySelectorAll('.delete-assignment-btn').forEach(btn => {
      btn.addEventListener('click', () => deleteAssignment(btn.dataset.id));
    });
    listEl.querySelectorAll('.toggle-done-btn').forEach(btn => {
      btn.addEventListener('click', () => toggleAssignmentDone(btn.dataset.id));
    });
  }

  $('add-assignment-btn').addEventListener('click', () => openAssignmentModal());

  function openAssignmentModal(editId, prefilledSubject, prefilledType) {
    const existing = editId ? getData('assignments', []).find(a => a.id === editId) : null;
    const title = existing ? 'แก้ไขงาน/การบ้าน' : (prefilledType === 'exam' ? 'เพิ่มรายการสอบ' : 'เพิ่มงาน/การบ้าน');
    const isExamType = existing ? existing.type === 'exam' : (prefilledType === 'exam');

    // Build subject dropdown from existing subjects
    const subjects = getData('subjects', []);
    const uniqueNames = [...new Set(subjects.map(s => s.name))];

    const subjectValue = existing ? existing.subject : (prefilledSubject || '');

    openModal(title, `
      <div class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-surface-300 mb-1.5">ชื่อวิชา</label>
          <input id="m-assign-subject" type="text" class="input-field" placeholder="เช่น คณิตศาสตร์" value="${escapeHtml(subjectValue)}" list="subject-suggestions" />
          <datalist id="subject-suggestions">
            ${uniqueNames.map(n => `<option value="${escapeHtml(n)}">`).join('')}
          </datalist>
        </div>
        <div>
          <label class="block text-sm font-medium text-surface-300 mb-1.5">รายละเอียดงาน</label>
          <textarea id="m-assign-detail" class="input-field min-h-[80px] resize-none" placeholder="เช่น ทำแบบฝึกหัดหน้า 50-55">${existing ? escapeHtml(existing.detail) : ''}</textarea>
        </div>
        <div>
          <label class="block text-sm font-medium text-surface-300 mb-1.5">กำหนดส่ง</label>
          <input id="m-assign-due" type="date" class="input-field" value="${existing ? existing.dueDate : ''}" />
        </div>
        <div>
          <label class="block text-sm font-medium text-surface-300 mb-2">ประเภท</label>
          <div class="flex gap-2">
            <button class="toggle-chip ${!isExamType ? 'selected' : ''}" id="m-atype-homework">📄 การบ้านทั่วไป</button>
            <button class="toggle-chip ${isExamType ? 'exam-selected' : ''}" id="m-atype-exam">📝 สอบ</button>
          </div>
        </div>
        <button id="m-save-assignment" class="btn-primary w-full mt-2">${existing ? 'บันทึกการแก้ไข' : 'เพิ่มงาน'}</button>
      </div>
    `);

    let assignExamMode = isExamType;
    $('m-atype-homework').addEventListener('click', () => {
      assignExamMode = false;
      $('m-atype-homework').className = 'toggle-chip selected';
      $('m-atype-exam').className = 'toggle-chip';
    });
    $('m-atype-exam').addEventListener('click', () => {
      assignExamMode = true;
      $('m-atype-exam').className = 'toggle-chip exam-selected';
      $('m-atype-homework').className = 'toggle-chip';
    });

    $('m-save-assignment').addEventListener('click', () => {
      const subject = $('m-assign-subject').value.trim();
      const detail = $('m-assign-detail').value.trim();
      const dueDate = $('m-assign-due').value;

      if (!subject) { showToast('กรุณากรอกชื่อวิชา', 'error'); return; }
      if (!dueDate) { showToast('กรุณาเลือกวันกำหนดส่ง', 'error'); return; }

      const assignments = getData('assignments', []);
      if (editId) {
        const idx = assignments.findIndex(a => a.id === editId);
        if (idx >= 0) {
          assignments[idx] = { ...assignments[idx], subject, detail, dueDate, type: assignExamMode ? 'exam' : 'homework' };
        }
      } else {
        assignments.push({ id: generateId(), subject, detail, dueDate, type: assignExamMode ? 'exam' : 'homework', done: false });
      }
      setData('assignments', assignments);
      closeModal();
      showToast(editId ? 'แก้ไขงานเรียบร้อย' : 'เพิ่มงานเรียบร้อย');
      renderManagePage();
      renderHomePage();
    });
  }

  function deleteAssignment(id) {
    if (!confirm('ต้องการลบงานนี้?')) return;
    const assignments = getData('assignments', []).filter(a => a.id !== id);
    setData('assignments', assignments);
    showToast('ลบงานเรียบร้อย');
    renderManagePage();
    renderHomePage();
  }

  function toggleAssignmentDone(id) {
    const assignments = getData('assignments', []);
    const idx = assignments.findIndex(a => a.id === id);
    if (idx >= 0) {
      assignments[idx].done = !assignments[idx].done;
      setData('assignments', assignments);
      showToast(assignments[idx].done ? 'ส่งงานเรียบร้อย! 🎉' : 'เปลี่ยนสถานะกลับ');
      renderManagePage();
      renderHomePage();
    }
  }

  // --- Custom Quests ---
  function renderQuestManageList() {
    const quests = getData('quests', []);
    const listEl = $('quest-list');
    const emptyEl = $('quest-empty');

    if (quests.length === 0) {
      listEl.innerHTML = '';
      emptyEl.classList.remove('hidden');
      return;
    }

    emptyEl.classList.add('hidden');
    listEl.innerHTML = quests.map(q => `
      <div class="manage-item">
        <div class="flex-1 min-w-0">
          <span class="font-semibold text-sm">${escapeHtml(q.title)}</span>
        </div>
        <div class="item-actions">
          <button class="btn-secondary edit-quest-btn" data-id="${q.id}" title="แก้ไข">
            <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"/></svg>
          </button>
          <button class="btn-danger delete-quest-btn" data-id="${q.id}" title="ลบ">
            <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
          </button>
        </div>
      </div>
    `).join('');

    listEl.querySelectorAll('.edit-quest-btn').forEach(btn => {
      btn.addEventListener('click', () => openQuestModal(btn.dataset.id));
    });
    listEl.querySelectorAll('.delete-quest-btn').forEach(btn => {
      btn.addEventListener('click', () => deleteQuest(btn.dataset.id));
    });
  }

  $('add-quest-btn').addEventListener('click', () => openQuestModal());

  function openQuestModal(editId) {
    const existing = editId ? getData('quests', []).find(q => q.id === editId) : null;
    const title = existing ? 'แก้ไขเควสเพิ่มเติม' : 'เพิ่มเควสเพิ่มเติม';

    openModal(title, `
      <div class="space-y-4">
        <div class="glass-card-inner p-3 rounded-xl">
          <p class="text-xs text-surface-400">💡 เควสจากตารางเรียนจะถูกเพิ่มอัตโนมัติทุกวัน เควสที่เพิ่มที่นี่จะเป็นเควสเสริมเพิ่มเติม</p>
        </div>
        <div>
          <label class="block text-sm font-medium text-surface-300 mb-1.5">ชื่อเควส</label>
          <input id="m-quest-title" type="text" class="input-field" placeholder="เช่น เตรียมอุปกรณ์เครื่องเขียน" value="${existing ? escapeHtml(existing.title) : ''}" />
        </div>
        <button id="m-save-quest" class="btn-primary w-full mt-2">${existing ? 'บันทึกการแก้ไข' : 'เพิ่มเควส'}</button>
      </div>
    `);

    $('m-save-quest').addEventListener('click', () => {
      const questTitle = $('m-quest-title').value.trim();
      if (!questTitle) { showToast('กรุณากรอกชื่อเควส', 'error'); return; }

      const quests = getData('quests', []);
      if (editId) {
        const idx = quests.findIndex(q => q.id === editId);
        if (idx >= 0) quests[idx].title = questTitle;
      } else {
        quests.push({ id: generateId(), title: questTitle });
      }
      setData('quests', quests);
      closeModal();
      showToast(editId ? 'แก้ไขเควสเรียบร้อย' : 'เพิ่มเควสเรียบร้อย');
      renderManagePage();
    });
  }

  function deleteQuest(id) {
    if (!confirm('ต้องการลบเควสนี้?')) return;
    const quests = getData('quests', []).filter(q => q.id !== id);
    setData('quests', quests);
    showToast('ลบเควสเรียบร้อย');
    renderManagePage();
  }

  // ===== JOURNAL PAGE =====
  function renderJournalPage() {
    renderJournalEntries();
  }

  // Format timestamp as full Thai date + time
  function formatTimestamp(isoStr) {
    const d = new Date(isoStr);
    const day = DAYS_TH[d.getDay()];
    const date = d.getDate();
    const month = MONTHS_TH[d.getMonth()];
    const year = d.getFullYear() + 543;
    const h = String(d.getHours()).padStart(2, '0');
    const m = String(d.getMinutes()).padStart(2, '0');
    return `วัน${day}ที่ ${date} ${month} ${year} เวลา ${h}:${m} น.`;
  }

  $('save-journal-btn').addEventListener('click', () => {
    const text = $('journal-text').value.trim();
    if (!text) { showToast('กรุณาเขียนบันทึกก่อน', 'error'); return; }

    const journals = getData('journals', []);
    const now = new Date();

    // Always add a new entry (multi-entry support)
    journals.unshift({
      id: generateId(),
      date: getTodayStr(),
      text,
      createdAt: now.toISOString(),
      updatedAt: now.toISOString(),
    });

    setData('journals', journals);
    $('journal-text').value = '';
    showToast('บันทึกเรียบร้อย! 📝');
    renderJournalEntries();
  });

  function renderJournalEntries() {
    const journals = getData('journals', []);
    const listEl = $('journal-entries');
    const emptyEl = $('journal-empty');

    // No auto-fill — multi-entry mode

    if (journals.length === 0) {
      listEl.innerHTML = '';
      emptyEl.classList.remove('hidden');
      return;
    }

    emptyEl.classList.add('hidden');
    listEl.innerHTML = journals.map(j => {
      const timestamp = formatTimestamp(j.createdAt);
      return `
      <div class="journal-entry animate-fade-in">
        <div class="flex items-center justify-between mb-2">
          <div class="flex items-center gap-2">
            <span class="w-1.5 h-1.5 rounded-full bg-brand-500"></span>
            <span class="text-xs font-semibold text-brand-400">${timestamp}</span>
          </div>
          <button class="btn-danger delete-journal-btn text-[0.6875rem]" data-id="${j.id}" title="ลบ">
            <svg class="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
          </button>
        </div>
        <p class="text-sm text-surface-300 leading-relaxed whitespace-pre-wrap">${escapeHtml(j.text)}</p>
      </div>
    `;
    }).join('');

    listEl.querySelectorAll('.delete-journal-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        if (!confirm('ต้องการลบบันทึกนี้?')) return;
        const journals = getData('journals', []).filter(j => j.id !== btn.dataset.id);
        setData('journals', journals);
        showToast('ลบบันทึกเรียบร้อย');
        renderJournalEntries();
      });
    });
  }

  // ===== MODAL SYSTEM =====
  function openModal(title, bodyHtml) {
    $('modal-title').textContent = title;
    $('modal-body').innerHTML = bodyHtml;
    const overlay = $('modal-overlay');
    overlay.classList.remove('hidden');
    overlay.classList.add('flex');
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    const overlay = $('modal-overlay');
    overlay.classList.add('hidden');
    overlay.classList.remove('flex');
    document.body.style.overflow = '';
  }

  $('modal-close').addEventListener('click', closeModal);
  $('modal-overlay').addEventListener('click', (e) => {
    if (e.target === $('modal-overlay')) closeModal();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeModal();
  });

  // Listen for changes from other tabs to update UI in real-time
  window.addEventListener('storage', (e) => {
    if (e.key && e.key.startsWith(`sq_${currentUser?.id}`)) {
      if (!$('page-home').classList.contains('hidden')) renderHomePage();
      if (!$('page-manage').classList.contains('hidden')) renderManagePage();
      if (!$('page-journal').classList.contains('hidden')) renderJournalPage();
    }
  });

  // ===== INIT =====
  initAuth();

})();
