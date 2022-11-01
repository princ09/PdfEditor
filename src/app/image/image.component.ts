import { AfterViewInit, Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
@Component({
  selector: 'app-image',
  templateUrl: './image.component.html',
  styleUrls: ['./image.component.css']
})
export class ImageComponent implements OnInit, AfterViewInit {
  @Input() file;
  @Input() payload;
  @Input() width;
  @Input() height;
  @Input() x;
  @Input() y;
  @Input() pageScale = 1;

   startX;
   startY;
  @ViewChild('imageCanvas',{read: ElementRef,static: false}) imageCanvas:ElementRef;

   operation = "";
   directions = [];
   dx = 0;
   dy = 0;
   dw = 0;
   dh = 0;
   @Output() updateEvent: EventEmitter<any> = new EventEmitter();
  constructor() { }

  ngAfterViewInit(){
    setTimeout(() => {
      this.render();      
    }, 20000);
}

  ngOnInit(): void {
  }
  render() {
    debugger;
    this.imageCanvas.nativeElement.width = this.width;
    this.imageCanvas.nativeElement.height = this.height;
    this.imageCanvas.nativeElement.getContext("2d").drawImage(this.payload, 0, 0);
    let scale = 1;
    const limit = 500;
    if (this.width > limit) {
      scale = limit / this.width;
    }
    if (this.height > limit) {
      scale = Math.min(scale, limit / this.height);
    }
    this.updateEvent.emit({
      width: this.width * scale,
      height: this.height * scale
    })

    if (!["image/jpeg", "image/png",].includes(this.file.type)) {
      console.log("inside")
      console.log()
      this.imageCanvas.nativeElement.toBlob(blob => {
        this.updateEvent.emit({
          file: blob
        })
      });
    }
  }
  handlePanMove(event) {
    console.log(event)

    console.log("working panMove")
    const _dx = (event.center.x - this.startX) / this.pageScale;
    const _dy = (event.center.y - this.startY) / this.pageScale;
    if (this.operation === "move") {
      this.dx = _dx;
      this.dy = _dy;
    } else if (this.operation === "scale") {
      if (this.directions.includes("left")) {
        this.dx = _dx;
        this.dw = -_dx;
      }
      if (this.directions.includes("top")) {
        this.dy = _dy;
        this.dh = -_dy;
      }
      if (this.directions.includes("right")) {
        this.dw = _dx;
      }
      if (this.directions.includes("bottom")) {
        this.dh = _dy;
      }
    }
  }

   handlePanEnd(event) {
    console.log(event)

    console.log("working panEnd")
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
        height:this.height + this.dh
      })
      this.dx = 0;
      this.dy = 0;
      this.dw = 0;
      this.dh = 0;
      this.directions = [];
    }
    this.operation = "";
  }
   handlePanStart(event) {
     console.log(event)
     console.log("working panStart")
    this.startX = event.center.x;
    this.startY = event.center.y;
    if (event.target.className === 'w-full h-full') {
      return (this.operation = "move");
    }
    this.operation = "scale";
    this.directions = event.target.dataset.direction.split("-");
  }
  onPan(event){
    console.log("pan is working")
  }
  onPress($event) {
    console.log("onPress", $event);

}

onPressUp($event) {
    console.log("onPressUp", $event);

}
}
