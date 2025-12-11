// Shared scheduler helpers
(function(){
    window.Sched = {};

    // Save availability: object keyed by short day name e.g. Mon -> [{start,end,type,label}]
    window.Sched.saveAvailability = function(avail) {
        localStorage.setItem('sa_availability', JSON.stringify(avail));
        localStorage.setItem('sa_avail_updated', Date.now());
    }

    window.Sched.loadAvailability = function() {
        return JSON.parse(localStorage.getItem('sa_availability') || '{}');
    }

    // Validate availability: returns {ok:true} or {ok:false, error: 'msg'}
    window.Sched.validateAvailability = function(avail) {
        const days = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'];
        for(const d of days) {
            const arr = avail[d] || [];
            // Sort
            arr.sort((a,b) => a.start.localeCompare(b.start));
            for(let i=0;i<arr.length;i++){
                const s = arr[i].start, e = arr[i].end;
                if(!s || !e) return {ok:false, error: `${d}: incomplete time on shift ${i+1}`};
                if(s >= e) return {ok:false, error: `${d}: shift ${i+1} start must be before end`};
                if(i>0 && s < arr[i-1].end) return {ok:false, error: `${d}: shift ${i+1} overlaps previous shift`};
                // optional: label required only if type === 'busy'
                if(arr[i].type === 'busy' && (!arr[i].label || arr[i].label.trim().length===0)) return {ok:false, error: `${d}: missing label for shift ${i+1}`};
            }
        }
        return {ok:true};
    }

    // Personal events keyed by date 'YYYY-MM-DD' -> [{id,title,start,end,label,allDay}]
    window.Sched.savePersonalEvents = function(events) {
        localStorage.setItem('sa_personal_events', JSON.stringify(events));
    }
    window.Sched.loadPersonalEvents = function(){
        return JSON.parse(localStorage.getItem('sa_personal_events') || '{}');
    }

    window.Sched.addPersonalEvent = function(dateKey, ev) {
        const events = window.Sched.loadPersonalEvents();
        if(!events[dateKey]) events[dateKey] = [];
        ev.id = 'ev_' + Date.now() + '_' + Math.floor(Math.random()*9999);
        events[dateKey].push(ev);
        window.Sched.savePersonalEvents(events);
        return ev;
    }

    window.Sched.removePersonalEvent = function(dateKey, id) {
        const events = window.Sched.loadPersonalEvents();
        if(!events[dateKey]) return;
        events[dateKey] = events[dateKey].filter(e => e.id !== id);
        window.Sched.savePersonalEvents(events);
    }

})();
