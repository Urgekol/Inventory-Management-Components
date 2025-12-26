const progressBar = document.getElementById("progressBar");
const loader = document.getElementById("loader");
const mainContent = document.getElementById("main-content");

let progress = 0;

const duration = 2500;
const intervalTime = 30;
const increment = 100 / (duration / intervalTime);

const interval = setInterval(() => {
  progress += increment;

  if (progress >= 100) {
    progress = 100;
    clearInterval(interval);

    loader.style.opacity = "0";

    setTimeout(() => {
      loader.style.display = "none";
      mainContent.classList.remove("hidden");
    }, 400);
  }

  progressBar.style.width = progress + "%";
}, intervalTime);
