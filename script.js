// --- Utility ---
function getTimePeriod() {
  const hour = new Date().getHours();
  if (hour < 12) return "morning";
  if (hour < 17) return "afternoon";
  return "evening";
}

// --- Coffee Tracker ---
let coffeeLog = JSON.parse(localStorage.getItem("coffeeLog")) || [];

function logCoffee() {
  const logEntry = {
    time: new Date().toISOString(),
    period: getTimePeriod()
  };
  coffeeLog.push(logEntry);
  localStorage.setItem("coffeeLog", JSON.stringify(coffeeLog));
  updateCoffee();
  runAISuggestions();
}

function resetCoffee() {
  coffeeLog = [];
  localStorage.removeItem("coffeeLog");
  updateCoffee();
  document.getElementById("pattern").textContent = '';
}

function updateCoffee() {
  document.getElementById("coffeeCount").textContent = `Cups Today: ${coffeeLog.length}`;
}

// --- Mood Tracker ---
let moods = JSON.parse(localStorage.getItem("moods")) || [];

function logMood() {
  const input = document.getElementById("moodInput").value.trim();
  if (input) {
    moods.push({ text: input, time: new Date().toISOString() });
    localStorage.setItem("moods", JSON.stringify(moods));
    renderMoods();
    document.getElementById("moodInput").value = '';
    runAISuggestions();
  }
}

function renderMoods() {
  const list = document.getElementById("moodList");
  list.innerHTML = '';
  moods.forEach(m => {
    const li = document.createElement("li");
    li.textContent = `${new Date(m.time).toLocaleTimeString()}: ${m.text}`;
    list.appendChild(li);
  });
}

function resetMood() {
  moods = [];
  localStorage.removeItem("moods");
  renderMoods();
}

// --- Notes / Reminders ---
let notes = JSON.parse(localStorage.getItem("notes")) || [];

function logNote() {
  const input = document.getElementById("noteInput").value.trim();
  if (input) {
    notes.push({ text: input, time: new Date().toISOString() });
    localStorage.setItem("notes", JSON.stringify(notes));
    renderNotes();
    document.getElementById("noteInput").value = '';
    runAISuggestions();
  }
}

function renderNotes() {
  const list = document.getElementById("notesList");
  list.innerHTML = '';
  notes.forEach(n => {
    const li = document.createElement("li");
    li.textContent = `${new Date(n.time).toLocaleTimeString()}: ${n.text}`;
    list.appendChild(li);
  });
}

function resetNotes() {
  notes = [];
  localStorage.removeItem("notes");
  renderNotes();
}

// --- Basic Sentiment (client-side AI-ish) ---
function analyzeSentiment(text) {
  const positive = ["great", "good", "relaxed", "happy", "focused"];
  const negative = ["tired", "bad", "stressed", "angry", "overwhelmed"];

  const txt = text.toLowerCase();
  let score = 0;

  positive.forEach(word => { if (txt.includes(word)) score++; });
  negative.forEach(word => { if (txt.includes(word)) score--; });

  if (score > 0) return "positive";
  if (score < 0) return "negative";
  return "neutral";
}

// --- AI Suggestions ---
function runAISuggestions() {
  let suggestions = [];

  // Time-based coffee
  const times = coffeeLog.map(log => getTimePeriodFromTime(log.time));
  const morningCups = times.filter(p => p === "morning").length;
  const afternoonCups = times.filter(p => p === "afternoon").length;
  const eveningCups = times.filter(p => p === "evening").length;

  if (eveningCups >= 2) suggestions.push("You've had a lot of coffee this evening. Might impact your sleep.");

  if (morningCups === 0 && coffeeLog.length > 0)
    suggestions.push("You didn’t drink coffee this morning. New habit?");

  // Mood + Coffee correlation
  const lastMood = moods.slice(-1)[0];
  if (lastMood) {
    const sentiment = analyzeSentiment(lastMood.text);
    if (sentiment === "negative" && coffeeLog.length >= 3) {
      suggestions.push("You've had a stressful day and high coffee intake. Maybe relax with tea or a walk?");
    }
  }

  // Sentiment from notes
  let sentimentScore = 0;
  notes.forEach(n => {
    const s = analyzeSentiment(n.text);
    sentimentScore += s === "positive" ? 1 : s === "negative" ? -1 : 0;
  });
  if (sentimentScore < -2) suggestions.push("Your notes seem negative lately. Consider journaling positive moments.");

  document.getElementById("pattern").textContent =
    suggestions.length > 0 ? suggestions.join(" ") : "All looks balanced. 👍";
}

// --- Helper to extract time period from ISO time ---
function getTimePeriodFromTime(isoTime) {
  const hour = new Date(isoTime).getHours();
  if (hour < 12) return "morning";
  if (hour < 17) return "afternoon";
  return "evening";
}

// --- Initialization ---
updateCoffee();
renderMoods();
renderNotes();
runAISuggestions();
