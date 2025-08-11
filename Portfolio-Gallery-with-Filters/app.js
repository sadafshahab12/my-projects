const filterButtons = document.querySelectorAll(".filter-btn");
const items = document.querySelectorAll(".item");
// filterButtons.forEach((btn) => {
//   btn.addEventListener("click", () => {
//     filterButtons.forEach((b) => b.classList.remove("active"));
//     btn.classList.add("active");
//     currentFilter = btn.getAttribute("data-filter");
//     applyFilters();

//     // const filter = btn.getAttribute("data-filter");

//     // items.forEach((item) => {
//     //   if (filter === "all" || item.getAttribute("data-category") === filter) {
//     //     item.style.display = "block";
//     //   } else {
//     //     item.style.display = "none";
//     //   }
//     // });
//   });
// });

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
  const sortButtons = document.querySelectorAll(".sort-btn");
  const gallery = document.querySelector(".gallery");
  let currentFilter = "all";
  const observer = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry, index) => {
        // console.log(entries)
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

  //sort function
  sortButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const sortType = button.getAttribute("data-sort");
      // console.log(sortType)
      // console.log(items)

      const sortedItems = Array.from(items).sort((a, b) => {
        const dateA = new Date(a.getAttribute("data-date"));
        const dateB = new Date(b.getAttribute("data-date"));

        return sortType === "newest" ? dateB - dateA : dateA - dateB;
      });
      // console.log(sortedItems)
      sortedItems.forEach((item) => gallery.appendChild(item));
    });
  });

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

  filterButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      filterButtons.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      currentFilter = btn.getAttribute("data-filter");
      applyFilters();
    });
  });

  searchInput.addEventListener("input", applyFilters);
});
