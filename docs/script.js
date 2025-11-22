const tg = window.Telegram.WebApp;
tg.expand();   // разворачиваем WebApp

// Получаем пользователя
const user = tg.initDataUnsafe?.user;

console.log("User:", user);

// Показ имени
document.getElementById("username").innerText =
    user ? "Привет, " + user.first_name + "!" : "Гость";

// ID пользователя
const userId = user?.id ?? 0;

// Элементы интерфейса
const nameEl = document.getElementById("name");
const cityEl = document.getElementById("city");
const bioEl = document.getElementById("bio");

const card = document.getElementById("card");
const controls = document.getElementById("controls");

const likeBtn = document.getElementById("likeBtn");
const skipBtn = document.getElementById("skipBtn");

let currentUser = null;

// Загружаем следующего пользователя
async function loadNext() {
    const res = await fetch(`/api/next/${userId}`);
    const data = await res.json();

    currentUser = data;

    nameEl.textContent = data.name;
    cityEl.textContent = data.city;
    bioEl.textContent = data.bio;

    card.classList.remove("hidden");
    controls.classList.remove("hidden");
}

loadNext();

// ЛАЙК
likeBtn.addEventListener("click", async () => {
    await fetch(`/api/like/${userId}/${currentUser.id}`);
    loadNext();
});

// СКИП
skipBtn.addEventListener("click", async () => {
    await fetch(`/api/skip/${userId}/${currentUser.id}`);
    loadNext();
});
