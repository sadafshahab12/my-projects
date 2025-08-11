const filterButtons = document.querySelectorAll(".filter-btn");
const items = document.querySelectorAll(".item");
filterButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    filterButtons.forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");

    const filter = btn.getAttribute("data-filter");

    items.forEach((item) => {
      if (filter === "all" || item.getAttribute("data-category") === filter) {
        item.style.display = "block";
      } else {
        item.style.display = "none";
      }
    });
  });
});

const lightBox = document.querySelector(".lightbox");
const lightboxImg = document.querySelector(".lightbox-img");
const closeBtn = document.querySelector(".lightbox .close");

items.forEach((item) => {
  item.addEventListener("click", () => {
    const imgSrc = item.querySelector("img").src;
    lightboxImg.src = imgSrc;
    lightBox.style.display = "flex";
  });
});

closeBtn.addEventListener("click", () => {
  lightBox.style.display = "none";
});

document.addEventListener("DOMContentLoaded", () => {
  const lazyImages = document.querySelectorAll(".lazy-image");

  const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const img = entry.target;
        const overlay = img.previousElementSibling;
        img.src = img.dataset.src;
        img.onload = () => {
          img.classList.add("loaded");
          overlay.classList.add("hidden")
        };
        observer.unobserve(img);
      }
    });
  });
  lazyImages.forEach((img) => observer.observe(img));
});
