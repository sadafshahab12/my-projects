pdfjsLib.GlobalWorkerOptions.workerSrc =
  "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.14.305/pdf.worker.min.js";
const fileInput = document.getElementById("file-input");
const filenameEle = document.getElementById("filename");
const canvas = document.getElementById("pdf-render");
const ctx = canvas.getContext("2d");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");
const bookmarkBtn = document.getElementById("bookmarkBtn");
const pageInfo = document.getElementById("pageInfo");
const messageEle = document.getElementById("message");

let pdfDoc = null;
let currentPage = 0;
let totalPages = 0;
let currentFileName = ""; //use for bookmark key
pageNum = 1;

// it will show all message
function showMessage(text, timeout = 2500) {
  messageEle.textContent = text;
  if (timeout) {
    clearTimeout(showMessage._t);
    showMessage._t = setTimeout(() => (messageEle.textContent = ""), timeout);
  }
}
fileInput.addEventListener("change", (e) => {
  // const file =  e.target.files; //FileList {0: File, length: 1}
  const file = e.target.files[0]; //0: File
  console.log(file);
  console.log(file.type);
  if (!file) return;
  if (file.type !== "application/pdf") {
    alert("Please upload a valid PDF file.");
    return;
  }
  // set file name in ui  by extracting name from file obj
  currentFileName = file.name;
  filenameEle.textContent = currentFileName;

  const fileReader = new FileReader(); // it returns an object
  // FileReader {error : null, onabort : null, onerror : null, onload : null, onloadend : null, onloadstart : null, onprogress : null, readyState : 0, result : null}
  console.log(fileReader); // it is helper can read file, it returns an object

  fileReader.onload = function () {
    const typedArray = new Uint8Array(this.result);
    pdfjsLib
      .getDocument({ data: typedArray })
      .promise.then((pdf) => {
        pdfDoc = pdf;
        console.log("received : ", pdf);
        totalPages = pdf.numPages;
        console.log(totalPages);

        // book mark for this file
        const key = "pdfBookmark:" + currentFileName;
        const savedPage = localStorage.getItem(key);
        if (savedPage) {
          // ask user to go on this book marked page
          const goToPage = confirm(
            `Bookmark found for page ${savedPage}.  Go there?`
          );
          currentPage = goToPage ? parseInt(savedPage, 10) : 1;
        } else {
          currentPage = 1;
        }

        renderPage(currentPage);
      })
      .catch((err) => {
        console.error(err);
        showMessage("Failed to load PDF file. Please try again.");
      });
  };
  fileReader.readAsArrayBuffer(file);
});

function renderPage(num) {
  if (!pdfDoc) return;
  showMessage("");

  pdfDoc.getPage(num).then((page) => {
    const readerContainerWidth =
      document.querySelector(".reader").clientWidth || 800;
    console.log("container width " + readerContainerWidth);

    const viewportUnscaled = page.getViewport({ scale: 1 });
    console.log("page scaling: ", viewportUnscaled);
    const scale = (readerContainerWidth / viewportUnscaled.width) * 0.95;
    console.log("scale of page: ", scale);

    const viewport = page.getViewport({ scale });
    console.log("page view port: ", viewport);
    canvas.height = viewport.height;
    canvas.width = viewport.width;

    const renderContext = {
      canvasContext: ctx,
      viewport,
    };
    page.render(renderContext).promise.then(() => {
      currentPage = num;
      pageInfo.textContent = `Page ${currentPage} / ${totalPages}`;
    });
  });
}

// prev next handler
function prevPage() {
  if (!pdfDoc) return;

  if (currentPage <= 1) {
    showMessage("Already at first page.");
    return;
  }
  renderPage(currentPage - 1);
}

function nextPage() {
  if (!pdfDoc) return;
  if (currentPage >= totalPages) {
    showMessage("Already at last page.");
    return;
  }
  renderPage(currentPage + 1);
}

prevBtn.addEventListener("click", prevPage);
nextBtn.addEventListener("click", nextPage);

bookmarkBtn.addEventListener("click", () => {
  if (!currentFileName || !pdfDoc) {
    showMessage("Open a pdf first");
    return;
  }
  const key = "pdfBookmark:" + currentFileName;
  localStorage.setItem(key, currentPage);
  showMessage(`Bookmarked page ${currentPage}`);
});

document.addEventListener("keydown", (e) => {
  console.log("event key" + e.key)
  if (e.key === "ArrowLeft") prevPage();
  if (e.key === "ArrowRight") nextPage();
  if (e.key === "b" || e.key === "B") {
    const active = document.activeElement;
    if (
      active &&
      (active.tagName === "INPUT" || active.tagName === "TEXTAREA")
    ) {
      bookmarkBtn.click();
    }
  }
});
