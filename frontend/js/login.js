lucide.createIcons();

// TOGGLE PASSWORD VISIBILITY
function togglePass(inputId, icon) {
    const input = document.getElementById(inputId);
    if (input.type === 'password') {
        input.type = 'text';
        icon.setAttribute('data-lucide', 'eye-off');
    } else {
        input.type = 'password';
        icon.setAttribute('data-lucide', 'eye');
    }
    lucide.createIcons();
}

// FORM TOGGLE ANIMATION
function toggleForm() {
    const login = document.getElementById('loginForm');
    const reg = document.getElementById('registerForm');
    const loader = document.getElementById('mainLoader');
    loader.classList.remove('active'); 
    
    if (login.classList.contains('hidden')) {
        login.classList.remove('hidden');
        reg.classList.add('hidden');
    } else {
        login.classList.add('hidden');
        reg.classList.remove('hidden');
    }
}

// AUTH HANDLING (SIMULATION MODE - NO BACKEND)
function handleAuth(e, type) {
    e.preventDefault(); // Stop page from refreshing
    
    // Trigger Loader
    const loader = document.getElementById('mainLoader');
    if(loader) loader.classList.add('active');
    
    // Button Feedback
    const btn = e.target.querySelector('button');
    const originalText = btn.innerHTML;
    btn.style.opacity = "0.7";
    btn.innerText = "Processing...";

    console.log("Processing " + type + "..."); // Debugging log

    // Simulate a short delay (1.5 seconds) then redirect
    setTimeout(() => {
        if(type === 'register') {
            // REGISTER LOGIC
            const nameInput = document.getElementById('regName');
            const name = nameInput ? nameInput.value : "New User";
            
            // Save Name locally
            localStorage.setItem('sa_username', name);
            
            // Open Schedule Prompt Modal
            const modal = document.getElementById('schedulePromptModal');
            if(modal) modal.classList.add('open');
            
            // Reset Button & Loader
            btn.innerHTML = originalText;
            btn.style.opacity = "1";
            if(loader) loader.classList.remove('active');
        
        } else {
            // LOGIN LOGIC
            // Save a fake profile if one doesn't exist so dashboard works
            if(!localStorage.getItem('sa_username')) {
                 localStorage.setItem('sa_username', "User");
            }
            
            console.log("Redirecting to user_home.html...");
            window.location.href = 'user_home.html'; 
        }
    }, 1500);
}

// SETUP WIZARD LOGIC (Only runs if you Register)
function nextStep() {
    document.getElementById('step1').classList.remove('active');
    document.getElementById('step2').classList.add('active');
    document.getElementById('dot1').classList.remove('active');
    document.getElementById('dot2').classList.add('active');
    generateAvailRows();
}

function prevStep() {
    document.getElementById('step2').classList.remove('active');
    document.getElementById('step1').classList.add('active');
    document.getElementById('dot2').classList.remove('active');
    document.getElementById('dot1').classList.add('active');
}

// SPLIT SHIFT GENERATOR
function generateAvailRows() {
    const container = document.getElementById('availContainer');
    if(container.children.length > 0) return; // Prevent duplicates

    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    days.forEach(day => {
        const dayId = day.toLowerCase();
        container.innerHTML += `
            <div class="avail-day-group">
                <div class="day-header">
                    <span class="day-name">${day}</span>
                    <div class="btn-add-shift" onclick="addShift('${dayId}')">
                        <i data-lucide="plus" width="12"></i> Add Shift
                    </div>
                </div>
                <div class="shift-list" id="shifts-${dayId}">
                    <div class="shift-row">
                        <input type="time" class="time-input" value="09:00">
                        <span style="color:var(--muted); font-size:12px;">to</span>
                        <input type="time" class="time-input" value="17:00">
                    </div>
                </div>
            </div>
        `;
    });
    lucide.createIcons();
}

// Add Dynamic Shift Slot
window.addShift = function(dayId) {
    const list = document.getElementById(`shifts-${dayId}`);
    const div = document.createElement('div');
    div.className = 'shift-row';
    div.innerHTML = `
        <input type="time" class="time-input">
        <span style="color:var(--muted); font-size:12px;">to</span>
        <input type="time" class="time-input">
        <div class="btn-icon-small" onclick="this.parentElement.remove()" style="color:var(--danger)">
            <i data-lucide="trash-2" width="14"></i>
        </div>
    `;
    list.appendChild(div);
    lucide.createIcons();
}

function scheduleYes() {
    // Set flag so user_home knows to show schedule setup
    localStorage.setItem('sa_from_register', 'yes');
    // Navigate to the splitshift page (availability section) in user_home.html
    window.location.href = 'user_home.html#schedule';
}

function scheduleLater() {
    window.location.href = 'user_home.html';
}
