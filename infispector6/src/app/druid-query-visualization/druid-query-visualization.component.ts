import {Component, ViewChild} from '@angular/core';
import {DruidLibraryService} from '../shared/tools/druid-library/druid-library.service';
import {LoadingBarComponent} from '../shared/layouts/loading-bar/loading-bar.component';

@Component({
  selector: 'druid-query-visualization',
  templateUrl: './druid-query-visualization.component.html',
  styleUrls: ['./druid-query-visualization.component.css']
})

export class DruidQueryVisualizationComponent {
  @ViewChild(LoadingBarComponent)
  private loadingBar:LoadingBarComponent;

  constructor(private druidLibrary:DruidLibraryService) {}

}

