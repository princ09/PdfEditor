import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
@Component({
  selector: 'app-drawingcanvas',
  templateUrl: './drawingcanvas.component.html',
  styleUrls: ['./drawingcanvas.component.css']
})
export class DrawingcanvasComponent implements OnInit {
  paths = [];
  @Output() cancelEvent: EventEmitter<any> = new EventEmitter();
  @Output() finishEvent: EventEmitter<any> = new EventEmitter();
  @ViewChild('canvasDrawingC') canvasDrawingC:ElementRef
  x = 0;
  y = 0;
  path = "";
  minX = Infinity;
  maxX = 0;
  minY = Infinity;
  maxY = 0;
  drawing = false;
  constructor() { }

  ngOnInit(): void {
    
  }
  
  handlePanStart(event){
    if (event.target !== this.canvasDrawingC.nativeElement) {
      return (this.drawing = false);
    }
    this.drawing = true;
    this.x = event.center.x;
    this.y = event.center.y;
    this.minX = Math.min(this.minX, this.x);
    this.maxX = Math.max(this.maxX, this.x);
    this.minY = Math.min(this.minY, this.y);
    this.maxY = Math.max(this.maxY, this.y);
    this.paths.push(["M", this.x, this.y]);
    this.path += `M${this.x},${this.y}`;
  }
  
  handlePanMove(event){
    if (!this.drawing) return;
    this.x = event.center.x;
    this.y = event.center.y;
    this.minX = Math.min(this.minX, this.x);
    this.maxX = Math.max(this.maxX, this.x);
    this.minY = Math.min(this.minY, this.y);
    this.maxY = Math.max(this.maxY, this.y);
    this.paths.push(["L", this.x, this.y]);
    this.path += `L${this.x},${this.y}`;
  }
  handlePanEnd(event){
    this.drawing = false;
  }

  cancel(){
    this.cancelEvent.emit("cancel");
  }
  finish(){
    if (!this.paths.length) return;
    const dx = -(this.minX - 10);
    const dy = -(this.minY - 10);
    const width = this.maxX - this.minX + 20;
    const height = this.maxY - this.minY + 20;
    this.finishEvent.emit({
      originWidth: width,
      originHeight: height,
      path: this.paths.reduce((acc, cur) => {
        return acc + cur[0] + (cur[1] + dx) + "," + (cur[2] + dy);
      }, '')
    });
  }



}
