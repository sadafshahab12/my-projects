pdfjsLib.GlobalWorkerOptions.workerSrc =
  "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.14.305/pdf.worker.min.js";
const fileInput = document.getElementById("file-input");
const canvas = document.getElementById("pdf-render");
const ctx = canvas.getContext("2d");

let pdfDoc = null;
pageNum = 1;

fileInput.addEventListener("change", (e) => {
  // const file =  e.target.files; //FileList {0: File, length: 1}
  const file = e.target.files[0]; //0: File
  console.log(file);
  console.log(file.type);

  if (file.type !== "application/pdf") {
    alert("Please upload a valid PDF file.");
    return;
  }

  const fileReader = new FileReader(); // it returns an object
  // FileReader {error : null, onabort : null, onerror : null, onload : null, onloadend : null, onloadstart : null, onprogress : null, readyState : 0, result : null}
  console.log(fileReader); // it is helper can read file, it returns an object

  fileReader.onload = function () {
    const typedArray = new Uint8Array(this.result);
    pdfjsLib.getDocument(typedArray).promise.then((pdf) => {
      pdfDoc = pdf;
      renderPage(pageNum);
    });
  };
  fileReader.readAsArrayBuffer(file);
});

function renderPage(num) {
  pdfDoc.getPage(num).then((page) => {
    const viewport = page.getViewport({ scale: 1.5 });
    canvas.height = viewport.height;
    canvas.width = viewport.width;

    const renderContext = {
      canvasContext: ctx,
      viewport: viewport,
    };
    page.render(renderContext);
  });
}
