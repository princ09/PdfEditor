import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { ExportService } from '../export.service';

@Component({
  selector: 'app-pdfpage',
  templateUrl: './pdfpage.component.html',
  styleUrls: ['./pdfpage.component.css']
})
export class PDFPageComponent implements OnInit {
   @Input() page;
   @ViewChild('canvasPage') canvasPage:ElementRef;
   width:any;
   height:any;
   clientWidth:any;

   @Output() measureEvent :EventEmitter<any> = new EventEmitter();
  constructor() { }
   measure =()=> {
     this.measureEvent.emit({
      scale: this.canvasPage.nativeElement.clientWidth / this.width
     })
  }
  async  render() {
    const _page = await this.page;
    const context = this.canvasPage.nativeElement.getContext("2d");
    const viewport = _page.getViewport({ scale: 1 });
    this.width = viewport.width;
    this.height = viewport.height;
    await _page.render({
      canvasContext: context,
      viewport: viewport
    }).promise;
    this.measure();
    window.addEventListener("resize", this.measure);
  }
  ngOnDestroy() {
    window.removeEventListener("resize", this.measure);
  }
  ngOnInit(): void {
    this.render()
  }

}
