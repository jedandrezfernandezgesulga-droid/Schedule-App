lucide.createIcons();

function showToast(msg) {
    const t = document.getElementById('toast');
    const icon = t.querySelector('i');
    const text = document.getElementById('toastMsg');
    let type = 'success';
    if(typeof msg === 'object') {
        type = msg.type || 'success';
        text.innerText = msg.text || '';
    } else if(typeof msg === 'string' && msg.includes('||')) {
        const parts = msg.split('||');
        text.innerText = parts[0];
        type = parts[1] || 'success';
    } else {
        text.innerText = msg;
    }

    if(type === 'error') {
        icon.setAttribute('data-lucide','x-circle');
        icon.style.color = 'var(--danger)';
        t.style.borderColor = 'var(--danger)';
    } else {
        icon.setAttribute('data-lucide','check-circle');
        icon.style.color = 'var(--success)';
        t.style.borderColor = 'var(--accent)';
    }
    lucide.createIcons();
    t.classList.add('show');
    setTimeout(() => t.classList.remove('show'), 3000);
}

function navigateWithAnimation(targetUrl) {
    const overlay = document.getElementById('loadingOverlay');
    const fill = document.querySelector('.loader-box-fill');
    
    fill.style.animation = 'none';
    fill.offsetHeight;
    fill.style.animation = 'fillBox 1.2s cubic-bezier(0.2, 0.8, 0.2, 1) forwards';
    
    overlay.style.display = 'flex';
    
    setTimeout(() => {
        if(targetUrl.includes('.html')) {
            window.location.href = targetUrl;
        }
    }, 1200);
}

function switchTab(tabId, btn) {
    document.querySelectorAll('.section-content').forEach(el => el.classList.remove('active'));
    document.getElementById(tabId).classList.add('active');
    document.querySelectorAll('.tab-btn').forEach(el => el.classList.remove('active'));
    if(btn) btn.classList.add('active');
}

function goToCalendar(targetDateStr) {
    const calBtn = document.querySelectorAll('.tab-btn')[1]; 
    switchTab('calendar', calBtn);
    
    if(targetDateStr) {
        const dateObj = new Date(targetDateStr);
        currYear = dateObj.getFullYear();
        currMonth = dateObj.getMonth();
        
        renderCalendar();
        
        setTimeout(() => {
            const day = dateObj.getDate(); 
            showEventDetails(targetDateStr, day);
            document.querySelectorAll('.cal-date').forEach(el => {
                 if(el.querySelector('span').innerText == day) {
                     el.style.borderColor = 'white';
                     el.style.boxShadow = '0 0 15px rgba(255,255,255,0.4)';
                 }
            });
        }, 100);
    } else {
        currMonth = new Date().getMonth();
        currYear = new Date().getFullYear();
        renderCalendar();
    }
}

function goToProfile() {
    const profBtn = document.querySelectorAll('.tab-btn')[2];
    switchTab('profile', profBtn);
    setTimeout(() => {
        document.getElementById('availContainerCard').scrollIntoView({behavior: 'smooth'});
    }, 100);
}

const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
document.getElementById('currentDateDisplay').innerText = new Date().toLocaleDateString('en-US', options);

const savedProfile = JSON.parse(localStorage.getItem('sa_profile') || '{}');
if(savedProfile.name) {
    document.getElementById('userName').value = savedProfile.name;
    document.getElementById('avatarInitials').innerText = savedProfile.name.charAt(0).toUpperCase();
    updateGreeting(savedProfile.name);
} else {
    updateGreeting('User');
}
if(savedProfile.title) document.getElementById('userTitle').value = savedProfile.title;
if(savedProfile.pronouns) document.getElementById('userPronouns').value = savedProfile.pronouns;
if(savedProfile.location) document.getElementById('userLocation').value = savedProfile.location;
if(savedProfile.bio) document.getElementById('userBio').value = savedProfile.bio;

function saveProfile() {
    const profileData = {
        name: document.getElementById('userName').value,
        title: document.getElementById('userTitle').value,
        pronouns: document.getElementById('userPronouns').value,
        location: document.getElementById('userLocation').value,
        bio: document.getElementById('userBio').value
    };
    localStorage.setItem('sa_profile', JSON.stringify(profileData));
    localStorage.setItem('sa_username', profileData.name); 
    
    updateGreeting(profileData.name);
    showToast('Profile Saved Successfully');
}

function updateGreetingLive(val) {
    if(!val) val = "User";
    updateGreeting(val);
    document.getElementById('avatarInitials').innerText = val.charAt(0).toUpperCase();
}

function updateGreeting(name) {
    const hour = new Date().getHours();
    let timeGreet = 'Good morning';
    if(hour >= 12) timeGreet = 'Good afternoon';
    if(hour >= 18) timeGreet = 'Good evening';
    const display = name ? name.split(' ')[0] : 'User';
    document.getElementById('welcomeMsg').innerText = `${timeGreet}, ${display}`;
    if(name && !document.getElementById('avatarInitials').innerText) {
         document.getElementById('avatarInitials').innerText = name.charAt(0).toUpperCase();
    }
}

function updateAvatar(input) {
    if (input.files && input.files[0]) {
        var reader = new FileReader();
        reader.onload = function(e) {
            document.getElementById('avatarImg').src = e.target.result;
            document.getElementById('avatarImg').style.display = 'block';
            document.getElementById('avatarInitials').style.display = 'none';
        }
        reader.readAsDataURL(input.files[0]);
    }
}

const statuses = ['active', 'busy', 'offline'];
let currentStatusIdx = 0;
function toggleStatus() {
    currentStatusIdx = (currentStatusIdx + 1) % statuses.length;
    const s = statuses[currentStatusIdx];
    const btn = document.getElementById('statusBtn');
    btn.className = 'status-btn';
    if(s === 'active') {
        btn.classList.add('active');
        btn.innerHTML = `<span class="dot" style="background:currentColor; width:6px; height:6px;"></span> Active`;
    } else if (s === 'busy') {
        btn.classList.add('busy');
        btn.innerHTML = `<span class="dot" style="background:currentColor; width:6px; height:6px;"></span> Busy`;
    } else {
        btn.classList.add('offline');
        btn.innerHTML = `<span class="dot" style="background:currentColor; width:6px; height:6px;"></span> Offline`;
    }
}

function addNote() {
    const val = document.getElementById('noteInput').value;
    if(!val) return;
    const div = document.createElement('div');
    div.style.cssText = "font-size:13px; padding:8px; background:rgba(255,255,255,0.05); border-radius:6px; color:var(--muted); display:flex; justify-content:space-between; align-items:center; animation: fadeIn 0.3s ease;";
    div.innerHTML = `<span>${val}</span> <i data-lucide="x" width="12" style="cursor:pointer" onclick="this.parentElement.remove()"></i>`;
    document.getElementById('noteList').prepend(div);
    document.getElementById('noteInput').value = '';
    lucide.createIcons();
}

const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const availContainer = document.getElementById('availContainer');

days.forEach(day => {
    const dayShort = day.substring(0,3);
    const div = document.createElement('div');
    div.className = 'avail-row';
    div.innerHTML = `
        <div class="avail-day" style="align-self: center; padding-top: 0;">${dayShort}</div>
        
        <div class="avail-right-col">
            <div class="interval-list" id="intervals-${dayShort}">
                <div class="interval-group" style="display: flex; align-items: center; gap: 8px;">
                    <input type="time" class="avail-input" value="09:00">
                    <span style="color:var(--muted)">-</span>
                    <input type="time" class="avail-input" value="17:00">
                    <div class="error-icon">✖</div>
                </div>
            </div>

            <div class="btn-add-row" onclick="addInterval('${dayShort}')">
                <i data-lucide="plus" width="12"></i> Shift
            </div>
        </div>
    `;
    availContainer.appendChild(div);
});

window.addInterval = function(dayShort) {
    const container = document.getElementById(`intervals-${dayShort}`);
    const group = document.createElement('div');
    group.className = 'interval-group animate-pop';
    group.innerHTML = `
        <input type="time" class="avail-input">
        <span style="color:var(--muted)">-</span>
        <input type="time" class="avail-input">
        <select class="shift-type" style="height:34px; border-radius:8px;">
            <option value="available">Available</option>
            <option value="busy">Busy/Unavailable</option>
        </select>
        <input type="text" class="shift-label" placeholder="Label (e.g. Clinic)" style="height:34px; border-radius:8px; padding:6px 10px; min-width:140px;">
        <button class="btn-icon-small btn-remove" onclick="removeInterval(this)"><i data-lucide="trash-2" width="14"></i></button>
        <div class="error-icon">✖</div>
    `;
    container.appendChild(group);
    lucide.createIcons();
    setTimeout(() => group.classList.remove('animate-pop'), 260);
}

function removeInterval(btn) {
    const group = btn.closest('.interval-group');
    if(!group) return;
    group.classList.add('removing');
    setTimeout(() => group.remove(), 250);
}

function validateDayShort(dayShort) {
    const container = document.getElementById(`intervals-${dayShort}`);
    if(!container) return true;
    const groups = Array.from(container.querySelectorAll('.interval-group'));
    const intervals = [];
    groups.forEach((g, idx) => {
        const inputs = g.querySelectorAll('.avail-input');
        const start = inputs[0] ? inputs[0].value : '';
        const end = inputs[1] ? inputs[1].value : '';
        intervals.push({start, end, group: g, idx});
        g.classList.remove('invalid');
        g.title = '';
    });

    let ok = true;
    intervals.forEach(it => {
        const g = it.group;
        if(!it.start && !it.end) return;
        const prevInline = g.querySelector('.inline-error');
        if(prevInline) prevInline.remove();
        if(!it.start || !it.end) {
            g.classList.add('invalid'); g.title = 'Incomplete time'; ok = false; 
            const node = document.createElement('div'); node.className = 'inline-error'; node.innerText = 'Incomplete time — fill both start & end'; g.appendChild(node);
            return;
        }
        if(it.start >= it.end) { g.classList.add('invalid'); g.title = 'Start must be before end'; ok = false; 
            const node = document.createElement('div'); node.className = 'inline-error'; node.innerText = 'Start must be before end'; g.appendChild(node);
            return; }
    });

    const filled = intervals.filter(it => it.start && it.end).map(it => ({start: it.start, end: it.end, group: it.group}));
    filled.sort((a,b) => a.start.localeCompare(b.start));
    for(let i=1;i<filled.length;i++){
        if(filled[i].start < filled[i-1].end) {
            filled[i].group.classList.add('invalid');
            filled[i-1].group.classList.add('invalid');
            filled[i].group.title = 'Overlaps previous shift';
            filled[i-1].group.title = 'Overlaps next shift';
            ok = false;
            if(!filled[i-1].group.querySelector('.inline-error')) {
                const n = document.createElement('div'); n.className = 'inline-error'; n.innerText = 'Overlaps next shift — adjust times'; filled[i-1].group.appendChild(n);
            }
            if(!filled[i].group.querySelector('.inline-error')) {
                const n2 = document.createElement('div'); n2.className = 'inline-error'; n2.innerText = 'Overlaps previous shift — adjust times'; filled[i].group.appendChild(n2);
            }
        }
    }

    const anyInvalid = container.querySelectorAll('.interval-group.invalid').length > 0;
    const saveBtn = document.querySelector('#availContainerCard .btn-primary-action');
    if(saveBtn) saveBtn.disabled = anyInvalid;
    const banner = document.getElementById('availErrorBanner');
    if(banner) {
        if(anyInvalid) {
            banner.style.display = 'block';
            banner.innerText = 'Schedule conflict detected — fix overlapping shifts to remove this notice.';
        } else {
            banner.style.display = 'none';
        }
    }
    return ok;
}

availContainer.addEventListener('input', (e) => {
    const rootGroup = e.target.closest('.interval-list');
    if(!rootGroup) return;
    const id = rootGroup.id || '';
    const m = id.match(/^intervals-(\w{3})/);
    if(m) validateDayShort(m[1]);
});

window.addEventListener('DOMContentLoaded', () => {
    const token = localStorage.getItem('token');
    const storedName = localStorage.getItem('sa_username');

    if (!token && !storedName) {
        window.location.href = 'login.html';
        return;
    }

    const dateOptions = { weekday: 'long', month: 'long', day: 'numeric' };
    document.getElementById('currentDateDisplay').innerText = new Date().toLocaleDateString('en-US', dateOptions);

    const displayName = storedName || "User";
    document.getElementById('userName').value = displayName;
    document.getElementById('avatarInitials').innerText = displayName.charAt(0).toUpperCase();
    loadAvailability();
    ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'].forEach(s => validateDayShort(s));

    const fromRegister = localStorage.getItem('sa_from_register');
    if(fromRegister) {
        localStorage.removeItem('sa_from_register');
        if(fromRegister === 'yes') {
            const profBtn = document.querySelectorAll('.tab-btn')[2];
            switchTab('profile', profBtn);
            setTimeout(() => {
                document.getElementById('availContainerCard').scrollIntoView({behavior: 'smooth'});
                const c = document.getElementById('availContainerCard');
                c.style.boxShadow = '0 12px 40px rgba(232,121,249,0.18)';
                setTimeout(()=> c.style.boxShadow = '', 2000);
            }, 500);
            showToast('Welcome! Set up your weekly availability.');
        } else {
            showToast('Welcome! Finish setting up your schedule.');
            setTimeout(() => {
                document.getElementById('availContainerCard').scrollIntoView({behavior:'smooth'});
                const c = document.getElementById('availContainerCard');
                c.style.boxShadow = '0 12px 40px rgba(232,121,249,0.18)';
                setTimeout(()=> c.style.boxShadow = '', 2000);
            }, 500);
        }
    }
});

function saveAvailability() {
    if(document.querySelectorAll('.interval-group.invalid').length > 0) {
        showToast({type:'error', text: 'Fix highlighted shifts before saving.'});
        return;
    }
    const availability = {};
    days.forEach(day => availability[day.substring(0,3)] = []);

    let valid = true;
    let validationError = '';

    days.forEach(day => {
        const short = day.substring(0,3);
        const container = document.getElementById(`intervals-${short}`);
        const groups = Array.from(container.querySelectorAll('.interval-group'));
        const intervals = [];

        groups.forEach((g, idx) => {
            const inputs = g.querySelectorAll('.avail-input');
            const start = inputs[0] ? inputs[0].value : '';
            const end = inputs[1] ? inputs[1].value : '';
            const typeEl = g.querySelector('.shift-type');
            const labelEl = g.querySelector('.shift-label');
            const type = typeEl ? typeEl.value : 'available';
            const label = labelEl ? labelEl.value.trim() : '';

            if(!start && !end) return;
            if(!start || !end) {
                valid = false; validationError = `${day}: incomplete time on shift ${idx+1}`; return;
            }
            if(start >= end) { valid = false; validationError = `${day}: shift ${idx+1} start must be before end`; return; }
            if(type === 'busy' && !label) { valid = false; validationError = `${day}: missing label for shift ${idx+1}`; return; }

            intervals.push({start,end,type,label});
        });

        intervals.sort((a,b)=> a.start.localeCompare(b.start));
        for(let i=1;i<intervals.length;i++){
            if(intervals[i].start < intervals[i-1].end) { valid = false; validationError = `${day}: shift ${i+1} overlaps previous shift`; break; }
        }

        availability[short] = intervals;
    });

    if(!valid) { showToast({type:'error', text: validationError || 'Validation failed'}); return; }

    if(window.Sched && window.Sched.validateAvailability) {
        const v = window.Sched.validateAvailability(availability);
        if(!v.ok) { showToast({type:'error', text: v.error}); return; }
        window.Sched.saveAvailability(availability);
    } else {
        localStorage.setItem('sa_availability', JSON.stringify(availability));
        localStorage.setItem('sa_avail_updated', Date.now());
    }

    showToast('Schedule Updated!');
}

function loadAvailability() {
    const saved = (window.Sched && window.Sched.loadAvailability) ? window.Sched.loadAvailability() : JSON.parse(localStorage.getItem('sa_availability') || '{}');
    days.forEach(day => {
        const short = day.substring(0,3);
        const container = document.getElementById(`intervals-${short}`);
        container.innerHTML = '';
        const intervals = saved[short] || [];

        if(intervals.length === 0) {
            const group = document.createElement('div');
            group.className = 'interval-group';
            group.innerHTML = `
                <input type="time" class="avail-input" value="09:00">
                <span style="color:var(--muted)">-</span>
                <input type="time" class="avail-input" value="17:00">
                <select class="shift-type" style="height:34px; border-radius:8px;">
                    <option value="available">Available</option>
                    <option value="busy">Busy/Unavailable</option>
                </select>
                <input type="text" class="shift-label" placeholder="Label (e.g. Clinic)" style="height:34px; border-radius:8px; padding:6px 10px; min-width:140px;">
                <button class="btn-icon-small btn-remove" onclick="removeInterval(this)"><i data-lucide="trash-2" width="14"></i></button>
                <div class="error-icon">✖</div>
            `;
            container.appendChild(group);
        } else {
            intervals.forEach(it => {
                const group = document.createElement('div');
                group.className = 'interval-group';
                group.innerHTML = `
                    <input type="time" class="avail-input" value="${it.start}">
                    <span style="color:var(--muted)">-</span>
                    <input type="time" class="avail-input" value="${it.end}">
                    <select class="shift-type" style="height:34px; border-radius:8px;">
                        <option value="available" ${it.type==='available'?'selected':''}>Available</option>
                        <option value="busy" ${it.type==='busy'?'selected':''}>Busy/Unavailable</option>
                    </select>
                    <input type="text" class="shift-label" placeholder="Label (e.g. Clinic)" value="${(it.label||'')}">
                    <button class="btn-icon-small btn-remove" onclick="removeInterval(this)"><i data-lucide="trash-2" width="14"></i></button>
                    <div class="error-icon">✖</div>
                `;
                container.appendChild(group);
            });
        }
    });
    lucide.createIcons();
}

let currMonth = new Date().getMonth();
let currYear = new Date().getFullYear();

const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

const EVENTS_DB = {
    "2025-01-01": [{title: 'New Year Day', time: 'All Day', location: '-', color: 'green', desc: 'Public Holiday', team: 'holiday'}],
    "2025-02-14": [{title: 'Valentine Lunch', time: '12:00 PM', location: 'Cafeteria', color: 'yellow', desc: 'Social', team: 'social'}],
    "2025-03-15": [{title: 'Medicare Audit', time: '02:00 PM', location: 'Room 202', color: 'blue', desc: 'Compliance check', team: 'medicare'}],
    "2025-04-03": [{title: '🎂 User Birthday', time: 'All Day', location: '-', color: 'gold', desc: 'Happy Birthday!', team: 'personal'}],
    "2025-05-20": [{title: 'Alpha Design Sprint', time: '01:00 PM', location: 'Lab', color: 'purple', desc: 'UI Refresh', team: 'alpha'}],
    "2025-07-04": [{title: 'Independence Day', time: 'All Day', location: '-', color: 'green', desc: 'Holiday', team: 'holiday'}],
    "2025-08-15": [{title: 'Summer Outing', time: 'All Day', location: 'Beach', color: 'yellow', desc: 'Team Building', team: 'social'}],
    "2025-09-08": [{title: 'Alpha Code Freeze', time: '05:00 PM', location: 'Server Room', color: 'purple', desc: 'v1.5 Prep', team: 'alpha'}],
    "2025-10-31": [{title: 'Halloween', time: '04:00 PM', location: 'Lobby', color: 'yellow', desc: 'Costume Party', team: 'social'}],
    "2025-11-27": [{title: 'Thanksgiving', time: 'All Day', location: '-', color: 'green', desc: 'Holiday', team: 'holiday'}],
    "2025-12-05": [{title: 'Team Sync', time: '10:00 AM - 11:00 AM', location: 'Zoom', color: 'blue', desc: 'Sync up', team: 'medicare'}],
    "2025-12-10": [{title: 'Client Demo Review', time: '02:00 PM - 03:30 PM', location: 'Alpha', color: 'purple', desc: 'Reviewing progress', team: 'alpha'}],
    "2025-12-13": [{title: 'Reading', time: '10:00 AM - 11:00 AM', location: 'Zoom', color: 'blue', desc: 'Sync up', team: 'medicare'}],
    "2025-12-24": [{title: 'Christmas Eve', time: 'Half Day', location: '-', color: 'green', desc: 'Office closes 12pm', team: 'holiday'}],
    "2025-12-25": [{title: 'Christmas Day', time: 'All Day', location: '-', color: 'green', desc: 'Public Holiday', team: 'holiday'}],
    "2025-12-16": [{title: 'Urgent Server Patch', time: '08:00 AM - 09:00 AM', location: 'Remote', color: 'purple', desc: 'Alpha Critical Fix', team: 'alpha'}],
    "2025-12-15": [{title: 'Medicare Auto-Scale', time: '10:00 PM - 11:00 PM', location: 'Server', color: 'blue', desc: 'Automated Job', team: 'medicare'}],
    "2025-12-31": [{title: 'New Year Eve', time: 'Party @ 8PM', location: 'Rooftop', color: 'purple', desc: 'Countdown party', team: 'alpha'}],
    "2026-01-01": [{title: 'New Year Day', time: 'All Day', location: '-', color: 'green', desc: 'Holiday', team: 'holiday'}],
    "2026-02-14": [{title: 'Valentine\'s', time: 'All Day', location: '-', color: 'green', desc: 'Observance', team: 'holiday'}],
    "2026-04-03": [{title: '🎂 User Birthday', time: 'All Day', location: '-', color: 'gold', desc: 'Happy Birthday!', team: 'personal'}],
    "2026-05-15": [{title: 'Alpha Architecture', time: '02:00 PM', location: 'Room 304', color: 'purple', desc: 'System Review', team: 'alpha'}],
    "2026-06-20": [{title: 'Medicare Training', time: '10:00 AM', location: 'Zoom', color: 'blue', desc: 'Staff Training', team: 'medicare'}],
    "2026-07-04": [{title: 'Independence Day', time: 'All Day', location: '-', color: 'green', desc: 'Holiday', team: 'holiday'}],
    "2026-09-07": [{title: 'Labor Day', time: 'All Day', location: '-', color: 'green', desc: 'Holiday', team: 'holiday'}],
    "2026-11-26": [{title: 'Thanksgiving', time: 'All Day', location: '-', color: 'green', desc: 'Holiday', team: 'holiday'}],
    "2026-12-15": [{title: 'Database Backup', time: '11:00 PM', location: 'Cloud', color: 'blue', desc: 'Yearly Dump', team: 'medicare'}],
    "2026-12-24": [{title: 'Christmas Eve', time: 'Half Day', location: '-', color: 'green', desc: 'Holiday', team: 'holiday'}],
    "2026-12-25": [{title: 'Christmas Day', time: 'All Day', location: '-', color: 'green', desc: 'Holiday', team: 'holiday'}],
    "2026-12-17": [{title: 'On-Call Rotation', time: '09:00 AM - 05:00 PM', location: 'Remote', color: 'purple', desc: 'Alpha Support', team: 'alpha'}],
    "2026-12-31": [{title: 'New Year Eve', time: 'Party @ 8PM', location: 'Club', color: 'purple', desc: 'Alpha Party', team: 'alpha'}]
};

function renderCalendar() {
    const grid = document.getElementById('calendarGrid');
    const monthYearEl = document.getElementById('calMonthYear');
    
    grid.innerHTML = '';
    monthYearEl.innerText = `${months[currMonth]} ${currYear}`;
    
    let firstDay = new Date(currYear, currMonth, 1).getDay();
    let daysInMonth = new Date(currYear, currMonth + 1, 0).getDate();

    for(let i=0; i<firstDay; i++) {
        grid.appendChild(document.createElement('div'));
    }

    let today = new Date();
    
    for(let i=1; i<=daysInMonth; i++) {
        let el = document.createElement('div');
        el.className = 'cal-date';
        el.innerHTML = `<span>${i}</span>`;
        
        el.style.animationDelay = `${i * 0.03}s`;
        el.classList.add('animate-in');
        
        if(i === 10 && currMonth === 11 && currYear === 2025) {
            el.classList.add('today');
        } else if (i === today.getDate() && currMonth === today.getMonth() && currYear === today.getFullYear()) {
             el.classList.add('today');
        }

        let m = currMonth + 1;
        let d = i;
        let key = `${currYear}-${m.toString().padStart(2,'0')}-${d.toString().padStart(2,'0')}`;
        try {
            const weekdayShort = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'][new Date(currYear, currMonth, i).getDay()];
            const avail = (window.Sched && window.Sched.loadAvailability) ? window.Sched.loadAvailability() : JSON.parse(localStorage.getItem('sa_availability') || '{}');
            const intervalsForDay = (avail && avail[weekdayShort]) ? avail[weekdayShort] : [];
            if(intervalsForDay.length > 0) el.classList.add('has-availability');
            if(intervalsForDay.length > 0 && intervalsForDay.every(it => it.type === 'busy')) el.classList.add('blocked-day');
        } catch(e){}

        if(EVENTS_DB[key] || (window.Sched && window.Sched.loadPersonalEvents && window.Sched.loadPersonalEvents()[key])) {
             const combined = [];
             let hasAlpha = false, hasMedicare = false, hasHoliday = false;
             
             if(EVENTS_DB[key]) {
                 EVENTS_DB[key].forEach(evt => {
                     const team = evt.team || '';
                     combined.push({ source: 'db', title: evt.title || '', team: team, color: evt.color || '' });
                     if(team === 'alpha') hasAlpha = true;
                     else if(team === 'medicare') hasMedicare = true;
                     else if(team === 'holiday') hasHoliday = true;
                 });
             }
             const personal = (window.Sched && window.Sched.loadPersonalEvents) ? window.Sched.loadPersonalEvents() : JSON.parse(localStorage.getItem('sa_personal_events') || '{}');
             if(personal && personal[key]) {
                 personal[key].forEach(pe => {
                     combined.push({ source: 'personal', title: pe.title || '', team: pe.label || 'Personal', color: pe.color || '' });
                 });
             }

             if(combined.length > 0) {
                 el.classList.add('has-events');
                 if(hasAlpha) el.classList.add('event-alpha');
                 if(hasMedicare) el.classList.add('event-medicare');
                 if(hasHoliday) el.classList.add('event-holiday');
                 
                 const colors = [];
                 combined.forEach(ev => {
                     let color = ev.color || '';
                     if(!color || color.trim() === '') {
                         if(ev.team === 'alpha') color = '#e879f9';
                         else if(ev.team === 'medicare') color = '#818cf8';
                         else if(ev.team === 'holiday') color = '#4ade80';
                         else if(ev.team === 'social') color = '#facc15';
                         else color = '#818cf8';
                     }
                     color = color.trim();
                     if(color && (colors.length === 0 || colors[colors.length - 1] !== color)) colors.push(color);
                 });
                 
                 const gradientColors = colors.slice(0, 4);
                 let gradientStr = '';
                 if(gradientColors.length === 1) {
                     gradientStr = `linear-gradient(90deg, ${gradientColors[0]}, ${gradientColors[0]})`;
                 } else if(gradientColors.length === 2) {
                     gradientStr = `linear-gradient(90deg, ${gradientColors[0]}, ${gradientColors[1]})`;
                 } else if(gradientColors.length === 3) {
                     gradientStr = `linear-gradient(90deg, ${gradientColors[0]}, ${gradientColors[1]}, ${gradientColors[2]})`;
                 } else if(gradientColors.length >= 4) {
                     gradientStr = `linear-gradient(90deg, ${gradientColors[0]}, ${gradientColors[1]}, ${gradientColors[2]}, ${gradientColors[3]})`;
                 }
                 
                 if(gradientStr) {
                     el.style.setProperty('--event-gradient', gradientStr);
                 }
             }
        }

        el.onclick = function() {
            document.querySelectorAll('.cal-date').forEach(d => {
                d.style.borderColor = 'transparent'; 
                d.style.boxShadow = 'none';
            });
            this.style.borderColor = 'white';
            this.style.boxShadow = '0 0 15px rgba(255,255,255,0.4)';
            
            showEventDetails(key, i);
        }
        grid.appendChild(el);
    }
}

function changeMonth(dir) {
    currMonth += dir;
    if(currMonth < 0) { currMonth = 11; currYear--; }
    if(currMonth > 11) { currMonth = 0; currYear++; }
    renderCalendar();
}

function showEventDetails(key, day) {
    const container = document.getElementById('eventsContainer');
    const wrapper = document.getElementById('dateDetails');
    document.getElementById('selectedDateText').innerText = `${months[currMonth].substring(0,3)} ${day}`;
    wrapper.style.display = 'block';
    container.innerHTML = '';
    const addBtn = document.createElement('div');
    addBtn.style.marginBottom = '12px';
    addBtn.innerHTML = `<button class="btn-primary-action" onclick="openAddEventModal('${key}')">＋ Add Activity</button>`;
    container.appendChild(addBtn);
    if(EVENTS_DB[key]) {
        EVENTS_DB[key].forEach(evt => {
            let teamBadge = '';
            let borderCol = 'var(--success)';
            if(evt.team === 'alpha') { teamBadge = 'Alpha Squad'; borderCol = 'var(--accent)'; }
            else if(evt.team === 'medicare') { teamBadge = 'Medicare'; borderCol = 'var(--accent-secondary)'; }
            else { teamBadge = 'Holiday'; borderCol = 'var(--success)'; }

            container.innerHTML += `
                <div style="background:rgba(255,255,255,0.05); border-left:4px solid ${borderCol}; border-radius:8px; padding:12px; margin-bottom:8px; animation:slideInUp 0.3s ease;">
                    <div style="display:flex; justify-content:space-between; align-items:start;">
                        <div style="font-weight:700; color:white;">${evt.title}</div>
                        <span style="font-size:10px; background:rgba(255,255,255,0.1); padding:2px 6px; border-radius:4px;">${teamBadge}</span>
                    </div>
                    <div style="font-size:12px; color:var(--muted); margin-top:4px;">${evt.time} <span style="margin:0 4px">•</span> ${evt.location}</div>
                    <div style="font-size:12px; color:rgba(255,255,255,0.4); margin-top:4px;">${evt.desc}</div>
                </div>
            `;
        });
    }

    try {
        const weekdayShort = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'][new Date(currYear, currMonth, day).getDay()];
        const avail = (window.Sched && window.Sched.loadAvailability) ? window.Sched.loadAvailability() : JSON.parse(localStorage.getItem('sa_availability') || '{}');
        const intervals = (avail && avail[weekdayShort]) ? avail[weekdayShort] : [];
        intervals.filter(it => it.type === 'busy').forEach((it, idx) => {
            container.innerHTML += `
                <div style="background:rgba(251,113,133,0.06); border-left:4px solid rgba(251,113,133,0.9); border-radius:8px; padding:12px; margin-bottom:8px;">
                    <div style="font-weight:700; color:white;">Unavailable: ${it.label || 'Busy'}</div>
                    <div style="font-size:12px; color:var(--muted); margin-top:4px;">${it.start} • ${it.end}</div>
                </div>
            `;
        });
    } catch(e) {}
    const personal = (window.Sched && window.Sched.loadPersonalEvents) ? window.Sched.loadPersonalEvents() : JSON.parse(localStorage.getItem('sa_personal_events') || '{}');
    if(personal && personal[key]) {
        personal[key].forEach(evt => {
            container.innerHTML += `
                <div style="background:rgba(255,255,255,0.03); border-left:4px solid var(--accent); border-radius:8px; padding:12px; margin-bottom:8px;">
                    <div style="display:flex; justify-content:space-between; align-items:start;">
                        <div style="font-weight:700; color:white;">${evt.title}</div>
                        <span style="font-size:10px; background:rgba(255,255,255,0.05); padding:2px 6px; border-radius:4px;">${evt.label || 'Personal'}</span>
                    </div>
                    <div style="font-size:12px; color:var(--muted); margin-top:4px;">${evt.allDay ? 'All Day' : (evt.start + ' • ' + evt.end)}</div>
                    <div style="margin-top:6px; display:flex; gap:8px;">
                        <button class="btn-primary-action" onclick="editPersonalEvent('${key}','${evt.id}')">Edit</button>
                        <button class="btn-primary-action" style="background:rgba(251,113,133,0.9);" onclick="deletePersonalEvent('${key}','${evt.id}')">Delete</button>
                    </div>
                </div>
            `;
        });
    }

    if(!container.innerHTML || container.innerHTML.trim() === '') {
        container.innerHTML = `<div style="color:var(--muted); font-size:13px; font-style:italic;">No events scheduled for this day.</div>`;
    }
}

renderCalendar();

function initTimePickerScrolls() {
    function populateTimePicker(scrollId, maxValue) {
        const scroll = document.getElementById(scrollId);
        if(!scroll) return;
        scroll.innerHTML = '';
        for(let i = 0; i < maxValue; i++) {
            const item = document.createElement('div');
            item.className = 'time-picker-item';
            item.textContent = String(i).padStart(2, '0');
            item.addEventListener('click', function() {
                scroll.querySelectorAll('.time-picker-item').forEach(el => el.classList.remove('selected'));
                this.classList.add('selected');
                const itemIndex = Array.from(scroll.children).indexOf(this);
                scroll.scrollTop = itemIndex * 32 - 44;
            });
            scroll.appendChild(item);
        }
    }
    
    populateTimePicker('pe-start-hour-scroll', 24);
    populateTimePicker('pe-start-min-scroll', 60);
    populateTimePicker('pe-end-hour-scroll', 24);
    populateTimePicker('pe-end-min-scroll', 60);
}

function getTimeFromPickers(prefix) {
    const hourScroll = document.getElementById(`pe-${prefix}-hour-scroll`);
    const minScroll = document.getElementById(`pe-${prefix}-min-scroll`);
    const hour = hourScroll?.querySelector('.time-picker-item.selected')?.textContent || '00';
    const min = minScroll?.querySelector('.time-picker-item.selected')?.textContent || '00';
    return `${hour}:${min}`;
}

function setTimeToPickers(prefix, time) {
    const [hour, min] = time.split(':');
    const hourScroll = document.getElementById(`pe-${prefix}-hour-scroll`);
    const minScroll = document.getElementById(`pe-${prefix}-min-scroll`);
    
    const hourItems = hourScroll?.querySelectorAll('.time-picker-item');
    if(hourItems) {
        hourItems.forEach(el => el.classList.remove('selected'));
        if(hourItems[parseInt(hour || 0)]) {
            hourItems[parseInt(hour || 0)].classList.add('selected');
            hourScroll.scrollTop = parseInt(hour || 0) * 32 - 44;
        }
    }
    
    const minItems = minScroll?.querySelectorAll('.time-picker-item');
    if(minItems) {
        minItems.forEach(el => el.classList.remove('selected'));
        if(minItems[parseInt(min || 0)]) {
            minItems[parseInt(min || 0)].classList.add('selected');
            minScroll.scrollTop = parseInt(min || 0) * 32 - 44;
        }
    }
}

function openAddEventModal(dateKey) {
    const modal = document.getElementById('personalEventModal');
    if(!modal) return;
    const dateInput = modal.querySelector('#pe-date');
    if(dateInput) dateInput.value = dateKey;
    
    if(!modal.querySelector('#pe-start-hour-scroll')?.children.length) {
        initTimePickerScrolls();
    }
    
    modal.classList.add('open');
    const titleInput = modal.querySelector('#pe-title');
    if(titleInput) titleInput.value = '';
    setTimeToPickers('start', '09:00');
    setTimeToPickers('end', '10:00');
    const labelInput = modal.querySelector('#pe-label');
    if(labelInput) labelInput.value = '';
    const alldayInput = modal.querySelector('#pe-allday');
    if(alldayInput) alldayInput.checked = false;
    const colorInput = modal.querySelector('#pe-color');
    if(colorInput) colorInput.value = '#818cf8';
    const colorLabel = document.getElementById('pe-color-label');
    if(colorLabel) {
        colorLabel.style.background = 'rgba(0,0,0,0.12)';
        colorLabel.style.color = 'white';
        colorLabel.innerText = '#818CF8';
    }
}

function closeAddEventModal() {
    const modal = document.getElementById('personalEventModal');
    if(modal) modal.classList.remove('open');
}

const colorInput = document.getElementById('pe-color');
if(colorInput) {
    colorInput.addEventListener('input', (e) => {
        const hex = e.target.value;
        const label = document.getElementById('pe-color-label');
        if(label) {
            label.style.background = `${hex}33`;
            label.style.color = hex;
            label.innerText = hex.toUpperCase();
        }
    });
}

function submitPersonalEvent(e) {
    e.preventDefault();
    const modal = document.getElementById('personalEventModal');
    if(!modal) return;
    const dateKey = modal.querySelector('#pe-date')?.value;
    const title = modal.querySelector('#pe-title')?.value.trim();
    const start = getTimeFromPickers('start');
    const end = getTimeFromPickers('end');
    const label = modal.querySelector('#pe-label')?.value.trim();
    const allDay = modal.querySelector('#pe-allday')?.checked;
    const color = modal.querySelector('#pe-color')?.value;

    if(!title) { showToast('Please enter a title'); return; }
    if(!allDay && (!start || !end)) { showToast('Please provide start and end time'); return; }
    if(!allDay && start >= end) { showToast('Start must be before end'); return; }

    const eventObj = { title, start, end, label, allDay, color };

    const existingPersonal = (window.Sched && window.Sched.loadPersonalEvents) ? window.Sched.loadPersonalEvents() : JSON.parse(localStorage.getItem('sa_personal_events') || '{}');
    const list = existingPersonal[dateKey] || [];

    function overlaps(aStart, aEnd, bStart, bEnd) {
        if(!aStart || !aEnd || !bStart || !bEnd) return true;
        return !(aEnd <= bStart || aStart >= bEnd);
    }

    let conflictFound = false;
    if(!eventObj.allDay) {
        for(const ex of list) {
            if(ex.allDay) { conflictFound = true; break; }
            if(overlaps(eventObj.start, eventObj.end, ex.start, ex.end)) { conflictFound = true; break; }
        }
    } else {
        if(list.length > 0) conflictFound = true;
    }

    try {
        const parsed = dateKey.split('-');
        const yyyy = parseInt(parsed[0],10), mm = parseInt(parsed[1],10)-1, dd = parseInt(parsed[2],10);
        const weekdayShort = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'][new Date(yyyy, mm, dd).getDay()];
        const avail = (window.Sched && window.Sched.loadAvailability) ? window.Sched.loadAvailability() : JSON.parse(localStorage.getItem('sa_availability') || '{}');
        const busyIntervals = (avail && avail[weekdayShort]) ? avail[weekdayShort].filter(it => it.type === 'busy') : [];
        for(const bi of busyIntervals) {
            if(eventObj.allDay) { conflictFound = true; break; }
            if(overlaps(eventObj.start, eventObj.end, bi.start, bi.end)) { conflictFound = true; break; }
        }
    } catch(err){}

    if(conflictFound) {
        window._pendingPersonalEvent = { dateKey, eventObj };
        const om = document.getElementById('overlapConfirmModal');
        if(om) {
            const dateEl = om.querySelector('#overlapDate');
            if(dateEl) dateEl.innerText = dateKey;
            om.classList.add('open');
        }
        return;
    }

    addPersonalEventNow(dateKey, eventObj);
}

function addPersonalEventNow(dateKey, eventObj) {
    if(window.Sched && window.Sched.addPersonalEvent) {
        window.Sched.addPersonalEvent(dateKey, eventObj);
    } else {
        const pe = JSON.parse(localStorage.getItem('sa_personal_events') || '{}');
        if(!pe[dateKey]) pe[dateKey] = [];
        eventObj.id = 'ev_' + Date.now() + '_' + Math.floor(Math.random()*9999);
        pe[dateKey].push(eventObj);
        localStorage.setItem('sa_personal_events', JSON.stringify(pe));
    }

    closeAddEventModal();
    renderCalendar();
    showToast('Event added');
}

function confirmAddAnyway() {
    const pending = window._pendingPersonalEvent;
    if(!pending) return;
    if(pending.action === 'edit') {
        const dateKey = pending.dateKey;
        const ev = pending.eventObj;
        const peAll = (window.Sched && window.Sched.loadPersonalEvents) ? window.Sched.loadPersonalEvents() : JSON.parse(localStorage.getItem('sa_personal_events') || '{}');
        const list = peAll[dateKey] || [];
        const idx = list.findIndex(x => x.id === ev.id);
        if(idx >= 0) list[idx] = ev;
        else list.push(ev);
        peAll[dateKey] = list;
        if(window.Sched && window.Sched.savePersonalEvents) window.Sched.savePersonalEvents(peAll);
        else localStorage.setItem('sa_personal_events', JSON.stringify(peAll));
        window._pendingPersonalEvent = null;
        const om = document.getElementById('overlapConfirmModal');
        if(om) om.classList.remove('open');
        closeAddEventModal(); renderCalendar(); showToast('Event updated (forced)');
        return;
    }
    addPersonalEventNow(pending.dateKey, pending.eventObj);
    window._pendingPersonalEvent = null;
    const om = document.getElementById('overlapConfirmModal');
    if(om) om.classList.remove('open');
}

function cancelOverlapModal() {
    const om = document.getElementById('overlapConfirmModal');
    if(om) om.classList.remove('open');
    const pending = window._pendingPersonalEvent;
    if(pending) openAddEventModal(pending.dateKey);
}

function deletePersonalEvent(key, id) {
    if(window.Sched && window.Sched.removePersonalEvent) {
        window.Sched.removePersonalEvent(key, id);
    } else {
        const pe = JSON.parse(localStorage.getItem('sa_personal_events') || '{}');
        if(pe[key]) pe[key] = pe[key].filter(x => x.id !== id);
        localStorage.setItem('sa_personal_events', JSON.stringify(pe));
    }
    try {
        const parts = key.split('-');
        const y = parseInt(parts[0],10), m = parseInt(parts[1],10)-1, d = parseInt(parts[2],10);
        currYear = y; currMonth = m;
        renderCalendar();
        const wrapper = document.getElementById('dateDetails');
        if(wrapper && wrapper.style.display !== 'none') showEventDetails(key, d);
    } catch(err) { renderCalendar(); }
    showToast('Event deleted');
}

function editPersonalEvent(key, id) {
    const pe = (window.Sched && window.Sched.loadPersonalEvents) ? window.Sched.loadPersonalEvents() : JSON.parse(localStorage.getItem('sa_personal_events') || '{}');
    const ev = (pe[key] || []).find(x => x.id === id);
    if(!ev) return;
    const modal = document.getElementById('personalEventModal');
    if(!modal) return;
    
    if(!modal.querySelector('#pe-start-hour-scroll')?.children.length) {
        initTimePickerScrolls();
    }
    
    modal.classList.add('open');
    const dateInput = modal.querySelector('#pe-date');
    if(dateInput) dateInput.value = key;
    const titleInput = modal.querySelector('#pe-title');
    if(titleInput) titleInput.value = ev.title || '';
    setTimeToPickers('start', ev.start || '09:00');
    setTimeToPickers('end', ev.end || '10:00');
    const labelInput = modal.querySelector('#pe-label');
    if(labelInput) labelInput.value = ev.label || '';
    const alldayInput = modal.querySelector('#pe-allday');
    if(alldayInput) alldayInput.checked = !!ev.allDay;
    const color = ev.color || '#818cf8';
    const colorInput = modal.querySelector('#pe-color');
    if(colorInput) colorInput.value = color;
    const label = document.getElementById('pe-color-label');
    if(label) {
        label.style.background = `${color}33`;
        label.style.color = color;
        label.innerText = color.toUpperCase();
    }

    const form = modal.querySelector('form');
    if(form) {
        form.onsubmit = function(evSubmit) {
            evSubmit.preventDefault();
            const dateKey = modal.querySelector('#pe-date')?.value;
            const title = modal.querySelector('#pe-title')?.value.trim();
            const start = getTimeFromPickers('start');
            const end = getTimeFromPickers('end');
            const label = modal.querySelector('#pe-label')?.value.trim();
            const allDay = modal.querySelector('#pe-allday')?.checked;
            const color = modal.querySelector('#pe-color')?.value;
            if(!title) { showToast('Enter title'); return; }
            if(!allDay && (!start || !end)) { showToast('Enter start/end'); return; }
            if(!allDay && start >= end) { showToast('Start must be before end'); return; }

            const eventObj = { id, title, start, end, label, allDay, color };
            const existingPersonal = (window.Sched && window.Sched.loadPersonalEvents) ? window.Sched.loadPersonalEvents() : JSON.parse(localStorage.getItem('sa_personal_events') || '{}');
            const list = (existingPersonal[dateKey] || []).filter(x => x.id !== id);

            function overlaps(aStart, aEnd, bStart, bEnd) {
                if(!aStart || !aEnd || !bStart || !bEnd) return true;
                return !(aEnd <= bStart || aStart >= bEnd);
            }

            let conflictFound = false;
            if(!eventObj.allDay) {
                for(const ex of list) {
                    if(ex.allDay) { conflictFound = true; break; }
                    if(overlaps(eventObj.start, eventObj.end, ex.start, ex.end)) { conflictFound = true; break; }
                }
            } else {
                if(list.length > 0) conflictFound = true;
            }

            try {
                const parsed = dateKey.split('-');
                const yyyy = parseInt(parsed[0],10), mm = parseInt(parsed[1],10)-1, dd = parseInt(parsed[2],10);
                const weekdayShort = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'][new Date(yyyy, mm, dd).getDay()];
                const avail = (window.Sched && window.Sched.loadAvailability) ? window.Sched.loadAvailability() : JSON.parse(localStorage.getItem('sa_availability') || '{}');
                const busyIntervals = (avail && avail[weekdayShort]) ? avail[weekdayShort].filter(it => it.type === 'busy') : [];
                for(const bi of busyIntervals) {
                    if(eventObj.allDay) { conflictFound = true; break; }
                    if(overlaps(eventObj.start, eventObj.end, bi.start, bi.end)) { conflictFound = true; break; }
                }
            } catch(err){}

            if(conflictFound) {
                window._pendingPersonalEvent = { action: 'edit', dateKey, eventObj };
                const om = document.getElementById('overlapConfirmModal');
                if(om) {
                    const dateEl = om.querySelector('#overlapDate');
                    if(dateEl) dateEl.innerText = dateKey;
                    om.classList.add('open');
                }
                return;
            }

            const peAll = (window.Sched && window.Sched.loadPersonalEvents) ? window.Sched.loadPersonalEvents() : JSON.parse(localStorage.getItem('sa_personal_events') || '{}');
            const listAll = peAll[dateKey] || [];
            const idx = listAll.findIndex(x => x.id === id);
            if(idx >= 0) {
                listAll[idx] = { id, title, start, end, label, allDay, color };
                peAll[dateKey] = listAll;
                if(window.Sched && window.Sched.savePersonalEvents) window.Sched.savePersonalEvents(peAll);
                else localStorage.setItem('sa_personal_events', JSON.stringify(peAll));
            }
            form.onsubmit = submitPersonalEvent;
            closeAddEventModal(); renderCalendar(); showToast('Event updated');
        }
    }
}
