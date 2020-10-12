import { BrowserModule  } from '@angular/platform-browser';
import { Injectable, NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { DrawingcanvasComponent } from './drawingcanvas/drawingcanvas.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ImageComponent } from './image/image.component';
import { TextComponent } from './text/text.component';
import { DrawingComponent } from './drawing/drawing.component';
import { PDFPageComponent } from './pdfpage/pdfpage.component';
import {
HammerModule, HammerGestureConfig, HAMMER_GESTURE_CONFIG}
from '@angular/platform-browser';
import * as Hammer from 'hammerjs'
@Injectable()
export class MyHammerConfig extends HammerGestureConfig {
  overrides = <any> {
    'pan': {enable: true, direction: Hammer.DIRECTION_ALL },
  };
}
@NgModule({
  declarations: [
    AppComponent,
    DrawingcanvasComponent,
    ImageComponent,
    TextComponent,
    DrawingComponent,
    PDFPageComponent,

  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NoopAnimationsModule,
    HammerModule,
    BrowserAnimationsModule,
  ],
  providers: [
    {
      provide: HAMMER_GESTURE_CONFIG,
      useClass: MyHammerConfig,
    },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
