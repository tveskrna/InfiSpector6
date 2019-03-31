import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {LoadingBarComponent} from './loading-bar.component';



@NgModule({
  declarations: [
    LoadingBarComponent
  ],
  imports: [
    BrowserModule
  ],
  exports: [
    LoadingBarComponent
  ],
  providers: []
})
export class LoadingBarModule  { }
