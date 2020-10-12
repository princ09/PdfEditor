import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ExportService {
   payload;
   file;
   width;
   height;
   x;
   y;
   pageScale = 1;
  originWidth;
  originHeight;
  path;
  size;
  text;
  lineHeight;
  fontFamily;
page;
  constructor() { }
}
