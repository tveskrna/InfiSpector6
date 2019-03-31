import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import {MessageFlowComponent} from './message-flow.component';
import {FormsModule} from '@angular/forms';

@NgModule({
  declarations: [
    MessageFlowComponent
  ],
  imports: [
    BrowserModule,
    FormsModule
  ],
  exports: [
    MessageFlowComponent
  ],
  providers: [],
  // bootstrap: [MessageFlowComponent]
})
export class MessageFlowModule { }
