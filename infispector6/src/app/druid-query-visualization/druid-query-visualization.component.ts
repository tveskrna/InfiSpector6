import {Component} from '@angular/core';
import {DruidLibraryService} from '../shared/tools/druid-library/druid-library.service';

@Component({
  selector: 'druid-query-visualization',
  templateUrl: './druid-query-visualization.component.html',
  styleUrls: ['./druid-query-visualization.component.css']
})

export class DruidQueryVisualizationComponent {
  constructor(private druidLibrary:DruidLibraryService) {}
}

