const filterButtons = document.querySelectorAll(".filter-btn");
const items = document.querySelectorAll(".item");

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
const lightboxBg = document.querySelector(".lightbox-bg");
items.forEach((item) => {
  item.addEventListener("click", () => {
    const imgSrc = item.querySelector("img").dataset.src;
    lightboxImg.src = imgSrc;
    lightBox.style.display = "flex";
  });
});
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    lightBox.style.display = "none";
  }
});
lightboxBg.addEventListener("click", () => {
  lightBox.style.display = "none";
});
closeBtn.addEventListener("click", () => {
  lightBox.style.display = "none";
});

document.addEventListener("DOMContentLoaded", () => {
  const searchInput = document.getElementById("searchInput");
  const sortButtons = document.querySelectorAll(".sort-btn");
  const gallery = document.querySelector(".gallery");
  const items = Array.from(document.querySelectorAll(".item"));
  const loader = document.querySelector(".loader");
  let currentFilter = "all";
  let itemsPerLoad = 6;
  let currentIndexOfShowed = 0;
  let filteredItems = [...items]; // filtered + searched ka result

  function renderItems(reset = false) {
    if (reset) {
      currentIndexOfShowed = 0;
      items.forEach((item) => (item.style.display = "none"));
    }

    const nextItems = filteredItems.slice(
      currentIndexOfShowed,
      currentIndexOfShowed + itemsPerLoad
    );
    nextItems.forEach((item) => {
      item.style.display = "block";
    });
    currentIndexOfShowed += itemsPerLoad;

    loader.style.display =
      currentIndexOfShowed < filteredItems.length ? "flex" : "none";
  }
  // function showNextItems() {
  //   const nextItems = items.slice(
  //     currentIndexOfShowed,
  //     currentIndexOfShowed + itemsPerLoad
  //   );
  //   nextItems.forEach((item) => {
  //     item.style.display = "block";
  //   });
  //   currentIndexOfShowed += itemsPerLoad;
  // }
  // items.forEach((item) => (item.style.display = "none"));
  // showNextItems();

  window.addEventListener("scroll", () => {
    if (
      window.innerHeight + window.scrollY >= document.body.offsetHeight - 100 &&
      currentIndexOfShowed < items.length
    ) {
      loader.style.display = "flex";
      setTimeout(() => {
        renderItems();
        loader.style.display = "none";
      }, 800);
    }
  });
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
    filteredItems = items.filter((item) => {
      const category = item.getAttribute("data-category");
      const altText = item.querySelector("img").alt.toLowerCase();

      const matchesCategory =
        currentFilter === "all" || category === currentFilter;
      const matchesSearch = altText.includes(searchTerm);

      return matchesCategory && matchesSearch;
    });
    renderItems(true);
  }

  filterButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      filterButtons.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      currentFilter = btn.getAttribute("data-filter");
      applyFilters();
    });
  });

  //   debounce
  function debounce(fn, delay = 200) {
    let t;
    return (...args) => {
      clearTimeout(t);
      t = setTimeout(() => fn.apply(this, args), delay);
    };
  }
  searchInput.addEventListener(
    "input",
    debounce(() => applyFilters(), 180)
  );
});
