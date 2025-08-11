const filterButtons = document.querySelectorAll(".filter-btn");
const items = document.querySelectorAll(".item");
filterButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    filterButtons.forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");

    // const filter = btn.getAttribute("data-filter");

    // items.forEach((item) => {
    //   if (filter === "all" || item.getAttribute("data-category") === filter) {
    //     item.style.display = "block";
    //   } else {
    //     item.style.display = "none";
    //   }
    // });
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
  const searchInput = document.getElementById("searchInput");

  let currentFilter = "all";
  const observer = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
          const img = entry.target.querySelector(".lazy-image");
          const overlay = entry.target.querySelector(".blur-overlay");
          img.src = img.dataset.src;
          img.onload = () => {
            img.classList.add("loaded");
            overlay.classList.add("hidden");
          };
          setTimeout(() => {
            entry.target.classList.add("visible");
          }, index * 150);
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.2 }
  );
  items.forEach((item) => observer.observe(item));

  function applyFilters() {
    const searchTerm = searchInput.value.toLowerCase();
    items.forEach((item) => {
      const category = item.getAttribute("data-category");
      const altText = item.querySelector("img").alt.toLowerCase();

      const matchesCategory =
        currentFilter === "all" || category === currentFilter;
      const matchesSearch = altText.includes(searchTerm);

      if (matchesCategory && matchesSearch) {
        item.style.display = "block";
      } else {
        item.style.display = "none";
      }
    });
  }
});
