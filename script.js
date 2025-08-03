// --- Coffee Tracker ---
let coffeeCount = parseInt(localStorage.getItem("coffeeCount")) || 0;
updateCoffee();

function logCoffee() {
  coffeeCount++;
  localStorage.setItem("coffeeCount", coffeeCount);
  updateCoffee();
  detectPattern();
}

function resetCoffee() {
  coffeeCount = 0;
  localStorage.removeItem("coffeeCount");
  updateCoffee();
  document.getElementById("pattern").textContent = '';
}

function updateCoffee() {
  document.getElementById("coffeeCount").textContent = `Coffee Today: ${coffeeCount} cup(s)`;
}

// --- Mood Tracker ---
let moods = JSON.parse(localStorage.getItem("moods")) || [];

function logMood() {
  const input = document.getElementById("moodInput").value;
  if (input) {
    moods.push({ text: input, time: new Date().toLocaleTimeString() });
    localStorage.setItem("moods", JSON.stringify(moods));
    renderMoods();
    document.getElementById("moodInput").value = '';
  }
}

function renderMoods() {
  const list = document.getElementById("moodList");
  list.innerHTML = '';
  moods.forEach(m => {
    const li = document.createElement("li");
    li.textContent = `${m.time}: ${m.text}`;
    list.appendChild(li);
  });
}

function resetMood() {
  moods = [];
  localStorage.removeItem("moods");
  renderMoods();
}

renderMoods();

// --- Notes / Reminders ---
let notes = JSON.parse(localStorage.getItem("notes")) || [];

function logNote() {
  const input = document.getElementById("noteInput").value;
  if (input) {
    notes.push({ text: input, time: new Date().toLocaleTimeString() });
    localStorage.setItem("notes", JSON.stringify(notes));
    renderNotes();
    document.getElementById("noteInput").value = '';
  }
}

function renderNotes() {
  const list = document.getElementById("notesList");
  list.innerHTML = '';
  notes.forEach(n => {
    const li = document.createElement("li");
    li.textContent = `${n.time}: ${n.text}`;
    list.appendChild(li);
  });
}

function resetNotes() {
  notes = [];
  localStorage.removeItem("notes");
  renderNotes();
}

renderNotes();

// --- Pattern Detection (Simple AI placeholder) ---
function detectPattern() {
  if (coffeeCount >= 3) {
    document.getElementById("pattern").textContent = "You’ve had a lot of coffee today ☕. Try to pace yourself!";
  } else if (coffeeCount === 0) {
    document.getElementById("pattern").textContent = "No coffee yet? Maybe you're switching to tea? 🫖";
  } else {
    document.getElementById("pattern").textContent = "Normal intake so far.";
  }
}
