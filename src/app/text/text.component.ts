import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
  import { timeout } from "../../assets/utils/helper.js";
  import { Fonts } from "../../assets/utils/prepareAssets.js";
@Component({
  selector: 'app-text',
  templateUrl: './text.component.html',
  styleUrls: ['./text.component.css']
})
export class TextComponent implements OnInit {
  @Input() text;
  @Input() x;
  @Input() y;
  @Input() size=16;
  @Input() lineHeight=1.4;
  @Input() fontFamily="";
  @Input() pageScale;
  Families = Object.keys(Fonts);
  startX;
  startY;
  @ViewChild("editable") editable:ElementRef;
  _size = this.size;
  _lineHeight = this.lineHeight;
  _fontFamily = this.fontFamily;
  dx = 0;
  dy = 0;
  operation = "";
  @Output() updateEvent: EventEmitter<any> = new EventEmitter();
  @Output() selectFontEvent: EventEmitter<any> = new EventEmitter();
  constructor() { }

  ngOnInit(): void {
    this.render()
  }

   handlePanMove(event) {
    this.dx = (event.detail.x - this.startX) / this.pageScale;
    this.dy = (event.detail.y - this.startY) / this.pageScale;
  }

 handlePanEnd(event) {
    if (this.dx === 0 && this.dy === 0) {
      return this.editable.nativeElement.focus();
    }
    this.updateEvent.emit({
      x: this.x + this.dx,
      y: this.y + this.dy
    })
    this.dx = 0;
    this.dy = 0;
    this.operation = "";
  }
  handlePanStart(event) {
    this.startX = event.detail.x;
    this.startY = event.detail.y;
    this.operation = "move";
  }
  onFocus() {
    this.operation = "edit";
  }
  async  onBlur() {
    this.editable.nativeElement.blur();
    //sanitize();
    this.updateEvent.emit({
      lines: this.extractLines()
    })
    this.operation = "";
  }
  async  onPaste(e) {
    // get text only
    const pastedText = e.clipboardData.getData("text");
    document.execCommand("insertHTML", false, pastedText);
    // await tick() is not enough
    await timeout();
    //sanitize();
  }
   onKeydown(e) {
    const childNodes = Array.from(this.editable.nativeElement.childNodes);
    if (e.keyCode === 13) {
      // prevent default adding div behavior
      e.preventDefault();
      const selection = window.getSelection();
      const focusNode = selection.focusNode;
      const focusOffset = selection.focusOffset;
      // the caret is at an empty line
      if (focusNode === this.editable.nativeElement) {
        this.editable.nativeElement.insertBefore(
          document.createElement("br"),
          childNodes[focusOffset]
        );
      } else if (focusNode instanceof HTMLBRElement) {
        this.editable.nativeElement.insertBefore(document.createElement("br"), focusNode);
      }
      // the caret is at a text line but not end
      else if (focusNode.textContent.length !== focusOffset) {
        document.execCommand("insertHTML", false, "<br>");
        // the carat is at the end of a text line
      } else {
        let br = focusNode.nextSibling;
        if (br) {
          this.editable.nativeElement.insertBefore(document.createElement("br"), br);
        } else {
          br = this.editable.nativeElement.appendChild(document.createElement("br"));
          br = this.editable.nativeElement.appendChild(document.createElement("br"));
        }
        // set selection to new line
        selection.collapse(br, 0);
      }
    }
  }
   onFocusTool() {
    this.operation = "tool";
  }
  async  onBlurTool() {
    this.updateEvent.emit({
      lines: this.extractLines(),
      lineHeight: this._lineHeight,
      size: this._size,
      fontFamily: this._fontFamily
    })

    this.operation = "";
  }
  //Error in this method
   /*sanitize() {
    let weirdNode;
    while (
      (weirdNode = Array.from(this.editable.nativeElement.childNodes).find(
        node => !["#text", "BR"].includes(node.nodeName)
      ))
    ) {
      this.editable.nativeElement.removeChild(weirdNode);
    }
  }*/
   onChangeFont() {
     this.selectFontEvent.emit({
      name: this._fontFamily
     })

  }
   render() {
    this.editable.nativeElement.innerHTML = this.text;
    this.editable.nativeElement.focus();
  }
   extractLines() {
    const nodes = this.editable.nativeElement.childNodes;
    const lines = [];
    let lineText = "";
    for (let index = 0; index < nodes.length; index++) {
      const node = nodes[index];
      if (node.nodeName === "BR") {
        lines.push(lineText);
        lineText = "";
      } else {
        lineText += node.textContent;
      }
    }
    lines.push(lineText);
    return lines;
  }
}
