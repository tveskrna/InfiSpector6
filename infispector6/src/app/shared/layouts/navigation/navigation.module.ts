import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { NavigationComponent } from './navigation.component';
import {RouterModule} from '@angular/router';

@NgModule({
  declarations: [
    NavigationComponent
  ],
  imports: [
    BrowserModule,
    RouterModule
  ],
  exports: [
    NavigationComponent
  ],
  providers: [],
})
export class NavigationModule { }
