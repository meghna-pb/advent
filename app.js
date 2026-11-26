const STORAGE_KEY = "personal-advent-calendar-v7";
const CALENDAR_SEED = 1225;
const PREVIEW_MODE = new URLSearchParams(window.location.search).has("preview");
const LOCKED_DAYS = {
  4: { key: "dates", giftIndex: 0 },
  5: { key: "dates", giftIndex: 2 },
  7: { key: "dates", giftIndex: 1 }, 
  18: { key: "dates", giftIndex: 3 },
};

const categories = {
  snacks: {
    label: "Snack",
    front: "#BC2C1A",
    back: "#E0E2DB",
    ribbon: "#BC2C1A",
    gifts: [
      { title: "Favorite snack", message: "A défaut de t'offrir des radis, je me suis souvenue du next best thing for you", action: "Milkaaaaaaa (hope I got the right one)" },
      { title: "Sweet treat", message: "Même si ce ne sont pas mes préférés, si tu les aimes, j'aime aussi", action: "A consommer sans modération" },
      { title: "Salty break", message: "Salty snack for a film", action: "A mettre dans le sceau Spiderman (non-négociable)" },
      { title: "Bakery stop", message: "Your favorite pastry or baked treat treat", action: "Cinnamon roll?", url:"https://www.google.com/maps?rlz=1C1GCEA_enFR1135FR1135&udm&fvr=1&pvq=Cg0vZy8xMWtxNG0zYmI3IhMKDWdsYXplZCBjYXJmw6kQAhgDiQFhVXw_Hu3HNA&lqi=Cg1nbGF6ZWQgY2FyZsOpSMfSxsnYsYCACFoZEAAQARgAIg1nbGF6ZWQgY2FyZsOpMgJmcpIBC2NvZmZlZV9zaG9w&vet=10CAAQoqAOahcKEwjwg57dsqWYAxUAAAAAHQAAAAAQDw..i&cs=0&um=1&ie=UTF-8&fb=1&gl=fr&sa=X&ftid=0x47e6716547d2e89f:0x34c7ed1e3f7c5561" }
    ]
  },
  photos: {
    label: "Photo",
    front: "#52796F",
    back: "#CAD2C5",
    ribbon: "#52796F",
    gifts: [
      { title: "A photo of us", message: "Genuinely how hard you make me smile", action: "Add photo" },
      { title: "A memory with you", message: "A photo that feels natural, ordinary, and worth keeping", action: "Add photo" },
      { title: "My favourite picture of you", message: ":)", action: "Add photos" },
      { title: "How you make me feel", message: "A plan to take a new picture together before the month ends.", action: "Choose the place" }
    ]
  },
  words: {
    label: "Note",
    front: "#0E6E0C",
    back: "#CAD2C5",
    ribbon: "#0E6E0C",
    gifts: [
      { title: "something I admire", message: "I adore your artistic and compassionate vision for the world", 
                            action: "<3" },
      { title: "something I love about you", message: "We spend so much of our time just goofing off ang laughing until we cry. You are always so quick to jump in on a 'bit'", 
                      action: "My bestie fr" },
      { title: "something I am proud of", message: "So so proud of the fact that you try and try again, especially at climbing now!!", 
                                action: "Reminder that you can do hard things :)" },
      { title: "something I remember", message: "You always treat me with so much kindness and empathy, and genuinely want what's best for me + you always shower me with small gifts",
                             action: "Thank you for loving me the way you do" }
    ]
  },
  objects: {
    label: "Gift",
    front: "#382633",
    back: "#E0E2DB",
    ribbon: "#382633",
    gifts: [
      { title: "Significant object", message: "This was long overdue...", action: "Fortress of Sanctuary keys :)" },
      { title: "Cool and fun object", message: "Ecouteurs de sport", action: "so you listen to Dilliwali girlfriend" },
      { title: "Cozy object", message: "Something warm for the winter to come", action: "Hand heaters" },
      { title: "Memento object", message: "What a super cool keychain... huh???", action: "to keep very close by - might come in handy SOON" }
    ]
  },
  songs: {
    label: "Song",
    front: "#84A98C",
    back: "#CAD2C5",
    ribbon: "#84A98C",
    gifts: [
      { title: "song for you",  message: "Pretty self-explanatory", url: "https://open.spotify.com/track/6lfxq3CG4xtTiEg7opyCyx?si=507e2cbed3bd4e66" },
      { title: "song for us", message: "A song connected to a shared memory", action: "j'adore prendre le TGV et partir en aventures avec toi...", url: "https://open.spotify.com/track/5zCnGtCl5Ac5zlFHXaZmhy?si=fc262894dab44ae1" },
      { title: "morning song", message: "Morning jam pour ton trajet dans la 6", url: "https://open.spotify.com/track/7BcOUi4FQ3wBLmNTW0yfCR?si=47a5e2ab3bb341dc" },
      { title: "night song", message: "Night cuddle sessions", url: "https://open.spotify.com/track/4qWQdhdHttXPKrQVqoLKMy?si=1bfa49e43208407c" }
    ]
  },
  dates: {
    label: "Date",
    front: "#2F3E46",
    back: "#E0E2DB",
    ribbon: "#2F3E46",
    gifts: [
      { title: "Cine-concert", message: "Ciné-concert Dragons :)", action: "20h30 au Palais des Congrès" },
      { title: "Six months", message: "6 (six!!!!!!!) months together.", action: "Please find your letter in your bedside table" },
      { title: "Coffee date", message: "Simple coffee date with a walk :)", action: "let's try this?", url:"https://belhorizon.coffee/" },
      { title: "Christmas date", message: "Atelier poterie avec tapas", action: "rdv au Kano Café à 18h30", url: "https://kanocafe.fr/" }
    ]    
  }
};

const calendar = document.querySelector("#calendar");
const dialog = document.querySelector("#giftDialog");
const closeDialog = document.querySelector("#closeDialog");
let shuffleButton = document.querySelector("#shuffleButton");
if (PREVIEW_MODE && !shuffleButton) {
  shuffleButton = document.createElement("button");
  shuffleButton.className = "icon-button preview-shuffle";
  shuffleButton.id = "shuffleButton";
  shuffleButton.type = "button";
  shuffleButton.title = "Shuffle preview";
  shuffleButton.setAttribute("aria-label", "Shuffle preview");
  shuffleButton.innerHTML = `<span aria-hidden="true">↻</span>`;
  document.querySelector(".topbar")?.appendChild(shuffleButton);
}
const confetti = document.querySelector("#confetti");
const ctx = confetti.getContext("2d");

let calendarState = loadCalendarState();

function days() {
  return Array.from({ length: 24 }, (_, index) => index + 1);
}

function currentAdventDay() {
  if (PREVIEW_MODE) return 24;
  const today = new Date();
  const month = today.getMonth();
  if (month < 11) return 0;
  if (month > 11) return 24;
  return Math.min(today.getDate(), 24);
}

function canOpenDay(day) {
  return day <= currentAdventDay();
}
function buildDeck() {
  const lockedKeys = new Set(Object.values(LOCKED_DAYS).map((item) => `${item.key}:${item.giftIndex}`));
  return Object.entries(categories).flatMap(([key, category]) =>
    category.gifts
      .map((gift, giftIndex) => ({ key, giftIndex }))
      .filter((gift) => !lockedKeys.has(`${gift.key}:${gift.giftIndex}`))
  );
}

function seededRandom(seed) {
  let value = seed;
  return () => {
    value = (value * 1664525 + 1013904223) % 4294967296;
    return value / 4294967296;
  };
}

function shuffle(array, seed = CALENDAR_SEED) {
  const random = seededRandom(seed);
  const copy = [...array];
  for (let index = copy.length - 1; index > 0; index -= 1) {
    const target = Math.floor(random() * (index + 1));
    [copy[index], copy[target]] = [copy[target], copy[index]];
  }
  return copy;
}

function findAssignedDay(assignmentsByDay, key, giftIndex) {
  const day = Object.keys(assignmentsByDay).find((candidate) => {
    const gift = assignmentsByDay[candidate];
    return gift.key === key && gift.giftIndex === giftIndex;
  });
  return day ? Number(day) : null;
}

function enforceGiftOrder(assignmentsByDay, earlierGift, laterGift) {
  const earlierDay = findAssignedDay(assignmentsByDay, earlierGift.key, earlierGift.giftIndex);
  const laterDay = findAssignedDay(assignmentsByDay, laterGift.key, laterGift.giftIndex);
  if (!earlierDay || !laterDay || earlierDay < laterDay) return;
  [assignmentsByDay[earlierDay], assignmentsByDay[laterDay]] = [assignmentsByDay[laterDay], assignmentsByDay[earlierDay]];
}

function createCalendarState() {
  const assignmentsByDay = {};
  Object.entries(LOCKED_DAYS).forEach(([day, gift]) => {
    assignmentsByDay[day] = gift;
  });

  const openDays = days().filter((day) => !assignmentsByDay[day]);
  const shuffledDeck = shuffle(buildDeck(), CALENDAR_SEED + 1);
  openDays.forEach((day, index) => {
    assignmentsByDay[day] = shuffledDeck[index];
  });

  enforceGiftOrder(assignmentsByDay, { key: "objects", giftIndex: 3 }, { key: "objects", giftIndex: 0 });

  return {
    version: 7,
    assignmentsByDay,
    positions: shuffle(days(), CALENDAR_SEED + 2)
  };
}

function isValidState(value) {
  if (!value || value.version !== 7 || !Array.isArray(value.positions)) return false;
  if (value.positions.length !== 24 || new Set(value.positions).size !== 24) return false;
  return days().every((day) => value.assignmentsByDay && value.assignmentsByDay[day]);
}

function loadCalendarState() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
    if (isValidState(saved)) return saved;
  } catch (error) {
    localStorage.removeItem(STORAGE_KEY);
  }
  const created = createCalendarState();
  localStorage.setItem(STORAGE_KEY, JSON.stringify(created));
  return created;
}

function saveCalendarState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(calendarState));
}

function renderCalendar() {
  calendar.innerHTML = "";
  calendarState.positions.forEach((day) => {
    const assignment = calendarState.assignmentsByDay[day];
    const category = categories[assignment.key];
    const gift = category.gifts[assignment.giftIndex];
    const isLocked = !canOpenDay(day);
    const door = document.createElement("button");
    door.className = isLocked ? "door locked" : "door";
    door.type = "button";
    door.disabled = isLocked;
    door.style.setProperty("--door-color", category.front);
    door.style.setProperty("--back-color", category.back);
    door.setAttribute("aria-label", isLocked ? `December ${day} is still locked` : `Open December ${day}`);
    door.innerHTML = `<span class="door-inner"><span class="door-front"><span class="door-number">${day}</span><span class="lock-mark" aria-hidden="true">locked</span></span><span class="door-back"><span class="gift-mini"><strong>${category.label}</strong><span>${gift.title}</span></span></span></span>`;
    if (!isLocked) {
      door.addEventListener("click", () => revealDoor(door, day, assignment));
    }
    calendar.appendChild(door);
  });
}

function revealDoor(door, day, assignment) {
  const category = categories[assignment.key];
  const gift = category.gifts[assignment.giftIndex];
  door.classList.add("revealed");
  door.setAttribute("aria-label", `December ${day}: ${gift.title}`);
  burstConfetti(category.front);
  window.setTimeout(() => openGift(day, category, gift), 300);
}

function openGift(day, category, gift) {
  document.querySelector("#dialogDay").textContent = `December ${day}`;
  document.querySelector("#giftTitle").textContent = gift.title;
  document.querySelector("#giftCategory").textContent = category.label;
  document.querySelector("#giftMessage").textContent = gift.message;
  document.querySelector("#giftRibbon").style.background = category.ribbon;
  dialog.style.setProperty("--dialog-color", category.back);
  dialog.style.setProperty("--ribbon-color", category.ribbon);

  const media = document.querySelector("#giftMedia");
  media.innerHTML = "";
  if (gift.image) {
    const image = document.createElement("img");
    image.src = gift.image;
    image.alt = gift.imageAlt || gift.title;
    media.appendChild(image);
  }

  const action = document.querySelector("#giftAction");
  action.innerHTML = "";
  if (gift.url) {
    const link = document.createElement("a");
    link.href = gift.url;
    link.target = "_blank";
    link.rel = "noreferrer";
    link.textContent = gift.action || "Open";
    action.appendChild(link);
  } else if (gift.action) {
    const span = document.createElement("span");
    span.textContent = gift.action;
    action.appendChild(span);
  }

  if (gift.calendarUrl || gift.appleCalendar) {
    const calendarLink = document.createElement("a");
    calendarLink.href = gift.appleCalendar ? createAppleCalendarUrl(gift.appleCalendar) : gift.calendarUrl;
    calendarLink.target = "_blank";
    calendarLink.rel = "noreferrer";
    calendarLink.textContent = gift.appleCalendar ? "Add to Apple Calendar" : "Add to calendar";
    if (gift.appleCalendar) {
      calendarLink.download = `${gift.appleCalendar.title || gift.title}.ics`;
    }
    action.appendChild(calendarLink);
  }

  if (!dialog.open) dialog.showModal();
}

function pad(value) {
  return String(value).padStart(2, "0");
}

function formatIcsDate(value) {
  const date = new Date(value);
  return `${date.getUTCFullYear()}${pad(date.getUTCMonth() + 1)}${pad(date.getUTCDate())}T${pad(date.getUTCHours())}${pad(date.getUTCMinutes())}${pad(date.getUTCSeconds())}Z`;
}

function escapeIcsText(value = "") {
  return String(value)
    .replace(/\\/g, "\\\\")
    .replace(/;/g, "\\;")
    .replace(/,/g, "\\,")
    .replace(/\r?\n/g, "\\n");
}

function createAppleCalendarUrl(event) {
  const now = formatIcsDate(new Date());
  const start = formatIcsDate(event.start);
  const end = formatIcsDate(event.end || event.start);
  const title = escapeIcsText(event.title || "Advent date");
  const description = escapeIcsText(event.description || "");
  const location = escapeIcsText(event.location || "");
  const uid = `${Date.now()}-${Math.random().toString(16).slice(2)}@advent-calendar`;
  const ics = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Advent Calendar//Personal//EN",
    "BEGIN:VEVENT",
    `UID:${uid}`,
    `DTSTAMP:${now}`,
    `DTSTART:${start}`,
    `DTEND:${end}`,
    `SUMMARY:${title}`,
    `DESCRIPTION:${description}`,
    `LOCATION:${location}`,
    "END:VEVENT",
    "END:VCALENDAR"
  ].join("\r\n");
  return URL.createObjectURL(new Blob([ics], { type: "text/calendar;charset=utf-8" }));
}
function resizeCanvas() {
  confetti.width = window.innerWidth * window.devicePixelRatio;
  confetti.height = window.innerHeight * window.devicePixelRatio;
  ctx.setTransform(window.devicePixelRatio, 0, 0, window.devicePixelRatio, 0, 0);
}

function burstConfetti(seedColor) {
  const pieces = Array.from({ length: 34 }, () => ({
    x: window.innerWidth / 2 + (Math.random() - 0.5) * 120,
    y: window.innerHeight * 0.2 + Math.random() * 60,
    size: 4 + Math.random() * 6,
    color: [seedColor, "#BC2C1A", "#52796F", "#E0E2DB"][Math.floor(Math.random() * 4)],
    velocityX: (Math.random() - 0.5) * 5,
    velocityY: -5 - Math.random() * 4,
    rotation: Math.random() * Math.PI,
    spin: (Math.random() - 0.5) * 0.18,
    life: 52 + Math.random() * 18
  }));

  function frame() {
    ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
    pieces.forEach((piece) => {
      piece.x += piece.velocityX;
      piece.y += piece.velocityY;
      piece.velocityY += 0.2;
      piece.rotation += piece.spin;
      piece.life -= 1;
      ctx.save();
      ctx.translate(piece.x, piece.y);
      ctx.rotate(piece.rotation);
      ctx.fillStyle = piece.color;
      ctx.fillRect(-piece.size / 2, -piece.size / 2, piece.size, piece.size * 0.55);
      ctx.restore();
    });
    if (pieces.some((piece) => piece.life > 0 && piece.y < window.innerHeight + 24)) requestAnimationFrame(frame);
    else ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
  }

  frame();
}

closeDialog.addEventListener("click", () => dialog.close());
dialog.addEventListener("click", (event) => {
  const bounds = dialog.getBoundingClientRect();
  const isOutside = event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom;
  if (isOutside) dialog.close();
});

if (shuffleButton) {
  shuffleButton.addEventListener("click", () => {
    calendarState = createCalendarState();
    saveCalendarState();
    renderCalendar();
    burstConfetti("#BC2C1A");
  });
}

window.addEventListener("resize", resizeCanvas);
resizeCanvas();
renderCalendar();














