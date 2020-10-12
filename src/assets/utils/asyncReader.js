import * as pdfjsLib from 'pdfjs-dist';
const pdfjsWorker =  import('pdfjs-dist/build/pdf.worker.entry');
pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsWorker;
export function readAsArrayBuffer(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsArrayBuffer(file);
  });
}

export function readAsImage(src) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    if (src instanceof Blob) {
      const url = window.URL.createObjectURL(src);
      img.src = url;
    } else {
      img.src = src;
    }
  });
}

export function readAsDataURL(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export async function readAsPDF(file) {
  //const pdfjsLib = await window.getAsset('pdfjsLib');
  //const pdfjsLib =  window['pdfjs-dist/build/pdf'];
  // Safari possibly get webkitblobresource error 1 when using origin file blob
  const blob = new Blob([file]);
  console.log(pdfjsLib);
  const url = window.URL.createObjectURL(blob);
  console.log(url)
  return pdfjsLib.getDocument(url).promise;
}
