import { AfterViewInit, Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';

@Component({
  selector: 'app-drawing',
  templateUrl: './drawing.component.html',
  styleUrls: ['./drawing.component.css']
})
export class DrawingComponent implements OnInit, AfterViewInit {
  @Input() path: any;
  @Input() x: number;
  @Input() y: number;
  @Input() width: number;
  @Input() originWidth = 0;
  @Input() originHeight = 0;
  @Input() pageScale: number;
   startX;
   startY;
   @ViewChild('svg') svg:ElementRef;
   operation = "";
   dx = 0;
   dy = 0;
   dw = 0;
   direction = "";
   @Output() updateEvent: EventEmitter<any> = new EventEmitter();
   ratio = this.originWidth / this.originHeight;
  constructor() { }
  ngAfterViewInit(): void {
    this.render();
  }

  ngOnInit(): void {
  }
  async  render() {
    this.svg.nativeElement.setAttribute("viewBox", `0 0 ${this.originWidth} ${this.originHeight}`);
  }
   handlePanMove(event) {
    const _dx = (event.center.x - this.startX) / this.pageScale;
    const _dy = (event.center.y - this.startY) / this.pageScale;
    if (this.operation === "scale") {
      if (this.direction === "left-top") {
        let d = Infinity;
        d = Math.min(_dx, _dy * this.ratio);
        this.dx = d;
        this.dw = -d;
        this.dy = d / this.ratio;
      }
      if (this.direction === "right-bottom") {
        let d = -Infinity;
        d = Math.max(_dx, _dy * this.ratio);
        this.dw = d;
      }
    } else if (this.operation === "move") {
      this.dx = _dx;
      this.dy = _dy;
    }
  }

   handlePanEnd(event) {
    if (this.operation === "move") {
      this.updateEvent.emit({
        x: this.x + this.dx,
        y: this.y + this.dy
      })

      this.dx = 0;
      this.dy = 0;
    } else if (this.operation === "scale") {
      this.updateEvent.emit({
        x: this.x + this.dx,
        y: this.y + this.dy,
        width: this.width + this.dw,
        scale: (this.width + this.dw) / this.originWidth
      })

      this.dx = 0;
      this.dy = 0;
      this.dw = 0;
      this.direction = "";
    }
    this.operation = "";
  }
   handlePanStart(event) {
    this.startX = event.center.x;
    this.startY = event.center.y;
    if (event.target === event.currentTarget) {
      return (this.operation = "move");
    }
    this.operation = "scale";
    this.direction = event.target.dataset.direction;
  }

}
