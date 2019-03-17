import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { DruidQueryVisualizationComponent } from './druid-query-visualization.component';

@NgModule({
  declarations: [
    DruidQueryVisualizationComponent
  ],
  imports: [
    BrowserModule
  ],
  exports: [
    DruidQueryVisualizationComponent
  ],
  providers: [],
  bootstrap: [DruidQueryVisualizationComponent]
})
export class DruidQueryVisualizationModule { }
