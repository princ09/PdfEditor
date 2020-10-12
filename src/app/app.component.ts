import { Component } from '@angular/core';
import { ggID } from "../assets/utils/helper.js";
import { fetchFont } from "../assets/utils/prepareAssets.js";
import { save } from "../assets/utils/PDF.js";
import {
  readAsArrayBuffer,
  readAsImage,
  readAsPDF,
  readAsDataURL
} from "../assets/utils/asyncReader.js";
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'PDFEditor';
  pdfFile:any
  addingDrawing = false;
  genID = ggID();
  selectedPageIndex = -1
  pdfName = ""
  pages = []
  pagesScale = [];
  allObjects = [];
  saving = false
  currentFont = "Times-Roman";
  async onUploadPDF(e){
    const files = e.target.files || (e.dataTransfer && e.dataTransfer.files);
    const file = files[0];
    console.log(file)
    if (!file || file.type !== "application/pdf") return;
    this.selectedPageIndex = -1;
    try {
      console.log("in onUploadPDF try block")
      await this.addPDF(file);
      this.selectedPageIndex = 0;
    } catch (e) {
      console.log(e);
    }
  }
  async addPDF(file) {
    try {
      const pdf = await readAsPDF(file);
      console.log("In addPDF try block "+ pdf)
      this.pdfName = file.name;
      this.pdfFile = file;
      const numPages = pdf.numPages;
      this.pages = Array(numPages).fill(numPages).map((_, i) => pdf.getPage(i + 1));
      this.allObjects = this.pages.map(() => []);
      this.pagesScale = Array(numPages).fill(1);
    } catch (e) {
      console.log("Failed to add pdf.");
      throw e;
    }
  }
  async onUploadImage(e){
    const file = e.target.files[0];
    if (file && this.selectedPageIndex >= 0) {
      this.addImage(file);
    }
    e.target.value = null;
  }
  async addImage(file){
    try {
      // get dataURL to prevent canvas from tainted
      const url = await readAsDataURL(file);
      const img = await readAsImage(url);
      const id = this.genID();
      const { width, height } = img;
      const object = {
        id,
        type: "image",
        width,
        height,
        x: 0,
        y: 0,
        payload: img,
        file
      };
      this.allObjects = this.allObjects.map((objects, pIndex) =>
        pIndex === this.selectedPageIndex ? [...objects, object] : objects
      );
    } catch (e) {
      console.log(`Fail to add image.`, e);
    }
  }
  onAddTextField(){
    if (this.selectedPageIndex >= 0) {
      this.addTextField();
    }
  }
  addTextField(text = "New Text Field"){
    const id = this.genID();
    console.log("addtextFeild"+id)
    fetchFont(this.currentFont);
    const object = {
      id,
      text,
      type: "text",
      size: 16,
      lineHeight: 1.4,
      fontFamily: this.currentFont,
      x: 0,
      y: 0
    };
    this.allObjects = this.allObjects.map((objects, pIndex) =>
      pIndex === this.selectedPageIndex ? [...objects, object] : objects
    );
  }

  onAddDrawing(){
    if (this.selectedPageIndex >= 0) {
      this.addingDrawing = true;
    }
  }
  drawingFinish(e){
    const { originWidth, originHeight, path } = e.detail;
          let scale = 1;
          if (originWidth > 500) {
            scale = 500 / originWidth;
          }
          this.addDrawing(originWidth, originHeight, path, scale);
          this.addingDrawing = false;
  }
  addDrawing(originWidth, originHeight, path, scale = 1) {
    const id = this.genID();
    const object = {
      id,
      path,
      type: "drawing",
      x: 0,
      y: 0,
      originWidth,
      originHeight,
      width: originWidth * scale,
      scale
    };
    this.allObjects = this.allObjects.map((objects, pIndex) =>
      pIndex === this.selectedPageIndex ? [...objects, object] : objects
    );
  }
  cancelDrawing(){
    this.addingDrawing = false
  }
  onMeasureEvent(e,pIndex){
    this.onMeasure(e.scale, pIndex)
  }
  onMeasure(scale, i) {
    this.pagesScale[i] = scale;
  }
 async savePDF(){
    if (!this.pdfFile || this.saving || !this.pages.length) return;
    this.saving = true;
    try {
      await save(this.pdfFile, this.allObjects, this.pdfName, this.pagesScale);
    } catch (e) {
      console.log(e);
    } finally {
      this.saving = false;
    }
  }
  onUpdateEvent(id ,e){
    this.updateObject(id, e.detail)
  }
  updateObject(id: any, detail: any) {
    this.allObjects = this.allObjects.map((objects, pIndex) =>
      pIndex == this.selectedPageIndex
        ? objects.map(object =>
            object.id === id ? { ...object, ...detail } : object
          )
        : objects
    );
  }
  selectFontFamily(event) {
    const name = event.detail.name;
    fetchFont(name);
    this.currentFont = name;
  }
  selectPage(index) {
    this.selectedPageIndex = index;
  }
}


