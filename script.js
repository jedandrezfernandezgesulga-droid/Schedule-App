// Get elements safely
const userForm = document.getElementById('user-form');
const usersList = document.getElementById('users');
const eventForm = document.getElementById('event-form');
const eventList = document.getElementById('event-list');

let users = [];
let events = [];

//-------------------------------
// ADD USER
//-------------------------------
if (userForm) {
    userForm.addEventListener('submit', function (e) {
        e.preventDefault();

        const name = document.getElementById('name').value.trim();
        const email = document.getElementById('email').value.trim();

        if (name === "" || email === "") {
            alert("Please enter both name and email.");
            return;
        }

        const user = {
            name,
            email,
            availability: []
        };

        users.push(user);
        updateUserList();
        userForm.reset();
    });
}

// DISPLAY USER LIST
function updateUserList() {
    if (!usersList) return;

    usersList.innerHTML = '';

    users.forEach((user) => {
        const li = document.createElement('li');
        li.textContent = `${user.name} (${user.email})`;
        usersList.appendChild(li);
    });
}

//-------------------------------
// SCHEDULE EVENT
//-------------------------------
if (eventForm) {
    eventForm.addEventListener('submit', function (e) {
        e.preventDefault();

        const eventName = document.getElementById('event-name').value.trim();
        const eventDate = document.getElementById('event-date').value;

        if (eventName === "" || eventDate === "") {
            alert("Please fill in both event name and date.");
            return;
        }

        let assignedUser = "No users available";

        if (users.length > 0) {
            // SIMPLE ROTATION ASSIGNMENT
            assignedUser = users[events.length % users.length].name;
        }

        const event = {
            eventName,
            eventDate,
            assignedTo: assignedUser
        };

        events.push(event);
        updateEventList();
        eventForm.reset();
    });
}

// DISPLAY EVENT LIST
function updateEventList() {
    if (!eventList) return;

    eventList.innerHTML = '';

    events.forEach((ev) => {
        const li = document.createElement('li');
        li.textContent = `${ev.eventName} on ${ev.eventDate} — Assigned to: ${ev.assignedTo}`;
        eventList.appendChild(li);
    });
}
