let tg = window.Telegram.WebApp;
tg.expand();

// Получаем ID пользователя из Telegram WebApp
const userId = tg.initDataUnsafe.user ? tg.initDataUnsafe.user.id : 0;

const nameEl = document.getElementById("name");
const cityEl = document.getElementById("city");
const bioEl = document.getElementById("bio");

const card = document.getElementById("card");
const controls = document.getElementById("controls");
const likeBtn = document.getElementById("likeBtn");
const skipBtn = document.getElementById("skipBtn");

let currentUser = null;

async function loadNext() {
    const res = await fetch(`/api/next/${userId}`);
    const data = await res.json();

    if (!data.found) {
        nameEl.innerText = "Анкеты закончились!";
        cityEl.innerText = "";
        bioEl.innerText = "";
        return;
    }

    currentUser = data.user;

    nameEl.innerText = `${currentUser.name}, ${currentUser.age}`;
    cityEl.innerText = currentUser.city;
    bioEl.innerText = currentUser.bio;

    card.classList.remove("hidden");
    controls.classList.remove("hidden");
}

likeBtn.onclick = async () => {
    await fetch(`/api/like/${userId}/${currentUser.user_id}`, { method: "POST" });
    loadNext();
};

skipBtn.onclick = async () => {
    await fetch(`/api/skip/${userId}/${currentUser.user_id}`, { method: "POST" });
    loadNext();
};

loadNext();
