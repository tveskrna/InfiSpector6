import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import {TimeLineComponent} from './time-line.component';

@NgModule({
  declarations: [
    TimeLineComponent
  ],
  imports: [
    BrowserModule
  ],
  exports: [
    TimeLineComponent
  ],
  providers: [],
  // bootstrap: [TimeLineComponent]
})
export class TimeLineModule { }
