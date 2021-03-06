import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import {MessageFlowComponent} from './message-flow.component';
import {FormsModule} from '@angular/forms';
import {LoadingBarModule} from '../../layouts/loading-bar/loading-bar.module';
import {AngularNotifierModule} from '../../layouts/angular-notifier/angular-notifier.module';

@NgModule({
  declarations: [
    MessageFlowComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    LoadingBarModule,
    AngularNotifierModule
  ],
  exports: [
    MessageFlowComponent
  ]
})
export class MessageFlowModule { }
