import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { MainLayoutComponent } from './main-layout.component';
import {NavigationModule} from '../navigation/navigation.module';
import {RouterModule} from '@angular/router';

@NgModule({
  declarations: [
    MainLayoutComponent
  ],
  imports: [
    BrowserModule,
    NavigationModule,
    RouterModule
  ],
  exports: [
    MainLayoutComponent
  ],
  providers: [],
})
export class MainLayoutModule { }
