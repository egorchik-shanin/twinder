// ====== НАСТРОЙКИ ======
const API_URL = "https://commemoratory-tussive-shannan.ngrok-free.dev";

const tg = window.Telegram.WebApp;
tg.expand(); // Разворачиваем WebApp

// ====== ДАННЫЕ ПОЛЬЗОВАТЕЛЯ ======
const user = tg.initDataUnsafe.user;
console.log("TG User:", user);

document.getElementById("username").innerText =
    `Привет, ${user.first_name}! 👋`;

const userId = user?.id ?? 0;

// ====== ФУНКЦИИ ПЕРЕКЛЮЧЕНИЯ ЭКРАНОВ ======
function show(screen) {
    document.querySelectorAll(".screen").forEach(s => s.classList.add("hidden"));
    document.getElementById(screen).classList.remove("hidden");
}

function openSearch() {
    show("screen-search");
    loadNext();
}

function openProfile() {
    show("screen-profile");
}

function openEditProfile() {
    show("screen-edit-profile");

    const saved = JSON.parse(localStorage.getItem("myProfile") || "{}");
    pName.value = saved.name || "";
    pCity.value = saved.city || "";
    pBio.value = saved.bio || "";
}

function goHome() {
    show("screen-home");
}

// ====== ЭЛЕМЕНТЫ ИНТЕРФЕЙСА ======
const nameEl = document.getElementById("name");
const cityEl = document.getElementById("city");
const bioEl = document.getElementById("bio");

const card = document.getElementById("card");
const controls = document.getElementById("controls");
const likeBtn = document.getElementById("likeBtn");
const skipBtn = document.getElementById("skipBtn");

let currentUser = null;

// ====== ЗАГРУЗКА СЛЕДУЮЩЕГО ПОЛЬЗОВАТЕЛЯ ======
async function loadNext() {
    try {
        const res = await fetch(`${API_URL}/api/next/${userId}`);
        const data = await res.json();

        currentUser = data;

        nameEl.textContent = data.name;
        cityEl.textContent = data.city;
        bioEl.textContent = data.bio;

        card.classList.remove("hidden");
        controls.classList.remove("hidden");

    } catch (e) {
        console.error("Ошибка загрузки:", e);
    }
}

// ====== ЛАЙК ======
likeBtn.addEventListener("click", async () => {
    await fetch(`${API_URL}/api/like/${userId}/${currentUser.user_id}`, {
        method: "POST"
    });

    loadNext();
});

// ====== СКИП ======
skipBtn.addEventListener("click", async () => {
    await fetch(`${API_URL}/api/skip/${userId}/${currentUser.user_id}`, {
        method: "POST"
    });

    loadNext();
});

// ====== ПРОФИЛЬ ======
const pName = document.getElementById("p_name");
const pCity = document.getElementById("p_city");
const pBio = document.getElementById("p_bio");

const saveBtn = document.getElementById("saveProfile");
const backBtn = document.getElementById("backToMenu");

// Сохранение
saveBtn.addEventListener("click", () => {
    const profileData = {
        name: pName.value,
        city: pCity.value,
        bio: pBio.value
    };

    localStorage.setItem("myProfile", JSON.stringify(profileData));
    alert("Анкета сохранена!");
});

// Назад
backBtn.addEventListener("click", goHome);
