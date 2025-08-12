document.addEventListener("DOMContentLoaded", () => {
  const galleryItems = Array.from(document.querySelectorAll(".gallery-items"));
  console.log(galleryItems);

  let itemsPerLoad = 6;
  let currentIndex = 0;
  //Test:
  //You should see only 6 .item cards.
  //In console: console.log(galleryItems.length, currentIndex) → it should show total items and 6.

  function showInitialItems() {
    galleryItems.forEach((item) => (item.style.display = "none"));
    console.log(galleryItems);
    const first = galleryItems.slice(0, itemsPerLoad);
    console.log(first);
    first.forEach((item) => (item.style.display = "block"));
    currentIndex = first.length;
    console.log(currentIndex);
  }
  showInitialItems();
  // This proves your DOM references are correct and you know how to pick items in batches.

  // step 2 for more 6 image load we add spinner

  const loader = document.querySelector(".loader");
  let isLoading = false;
  window.addEventListener("scroll", () => {
    if (isLoading) return;

    if (
      window.innerHeight + window.screenY >= document.body.offsetHeight - 120 &&
      currentIndex < galleryItems.length
    ) {
      isLoading = true;
      loader.style.display = "flex";
      setTimeout(() => {
        const nextItem = galleryItems.slice(
          currentIndex,
          currentIndex + itemsPerLoad
        );
        console.log(nextItem);
        nextItem.forEach((item) => (item.style.display = "block"));
        currentIndex += nextItem.length;
        console.log(currentIndex);
        loader.style.display =
          currentIndex < galleryItems.length ? "flex" : "none";
        isLoading = false;
      }, 700);
    }
  });

  function loadAndShow(item, delay = 0) {
    item.style.display = "block";
    setTimeout(() => item.classList.add("visible"), delay);
    const lazyImg = item.querySelector(".lazy-image");
    console.log(lazyImg);
    const overlay = item.querySelector(".blur-overlay");
    if (lazyImg && lazyImg.dataset.src && lazyImg.src !== lazyImg.dataset.src) {
      lazyImg.src = lazyImg.dataset.src;
      lazyImg.onload = () => {
        lazyImg.classList.add("loaded");
        if (overlay) overlay.classList.add("hidden");
      };
    }
  }
});
