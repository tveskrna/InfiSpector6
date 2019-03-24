import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { DruidQueryVisualizationComponent } from './druid-query-visualization.component';
import {TimeLineModule} from '../shared/graphs/time-line/time-line.module';
// import {MessageFlowModule} from '../shared/graphs/message-flow/message-flow.module';

@NgModule({
  declarations: [
    DruidQueryVisualizationComponent
  ],
  imports: [
    BrowserModule,
    TimeLineModule,
    // MessageFlowModule
  ],
  exports: [
    DruidQueryVisualizationComponent
  ],
  providers: [],
  // bootstrap: [DruidQueryVisualizationComponent]
})
export class DruidQueryVisualizationModule { }
