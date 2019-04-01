import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { DruidQueryVisualizationComponent } from './druid-query-visualization.component';
import {TimeLineModule} from '../shared/graphs/time-line/time-line.module';
import {MessageFlowModule} from '../shared/graphs/message-flow/message-flow.module';
import {MessageInfoListComponent} from './message-info-list/message-info-list.component';

@NgModule({
  declarations: [
    DruidQueryVisualizationComponent,
    MessageInfoListComponent
  ],
  imports: [
    BrowserModule,
    TimeLineModule,
    MessageFlowModule,
  ],
  exports: [
    DruidQueryVisualizationComponent
  ],
  providers: [],
})
export class DruidQueryVisualizationModule { }
