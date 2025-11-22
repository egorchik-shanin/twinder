const tg = window.Telegram.WebApp;
tg.expand(); // разворачиваем WebApp

// Получаем пользователя
const user = tg.initDataUnsafe.user;

console.log("User:", user);

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

    document.getElementById("profile-name").innerText = user.first_name;
    document.getElementById("profile-id").innerText = "ID: " + user.id;
    document.getElementById("avatar").src =
        user.photo_url || "https://via.placeholder.com/120";
}

function goHome() {
    show("screen-home");
}

// Покажем приветствие
document.getElementById("username").innerText =
    "Привет, " + user.first_name + "! 👋";

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
    await fetch(`/api/like/${userId}/${currentUser.user_id}`, { method: "POST" });
    loadNext();
});

// СКИП
skipBtn.addEventListener("click", async () => {
    await fetch(`/api/skip/${userId}/${currentUser.user_id}`, { method: "POST" });
    loadNext();
});

// Элементы профиля
const profileScreen = document.getElementById("profile");
const menuScreen = document.getElementById("menu");

const pName = document.getElementById("p_name");
const pCity = document.getElementById("p_city");
const pBio = document.getElementById("p_bio");
const pPhoto = document.getElementById("p_photo");

const saveBtn = document.getElementById("saveProfile");
const backBtn = document.getElementById("backToMenu");

function openProfile() {
    show("screen-profile");
}


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
backBtn.addEventListener("click", () => {
    profileScreen.classList.add("hidden");
    menuScreen.classList.remove("hidden");
});
