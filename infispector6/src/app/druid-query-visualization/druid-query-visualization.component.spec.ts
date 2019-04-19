import {async, TestBed} from '@angular/core/testing';
import {DruidQueryVisualizationComponent} from './druid-query-visualization.component';
import {TimeLineModule} from '../shared/graphs/time-line/time-line.module';
import {MessageFlowModule} from '../shared/graphs/message-flow/message-flow.module';
import {MessageInfoListComponent} from './message-info-list/message-info-list.component';
import {DruidLibraryService} from '../shared/tools/druid-library/druid-library.service';
import {HttpClientModule} from '@angular/common/http';
import {APP_ENVIRONMENT} from '../environment';

describe('DruidQueryVisualizationComponent', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        DruidQueryVisualizationComponent,
        MessageInfoListComponent
      ],
      imports: [
        TimeLineModule,
        MessageFlowModule,
        HttpClientModule,
      ],
      providers: [DruidLibraryService, APP_ENVIRONMENT]
    }).compileComponents();
  }));

  it('Should create Druid-Query-Visualization component', () => {
    const fixture = TestBed.createComponent(DruidQueryVisualizationComponent);
    const component = fixture.debugElement.componentInstance;
    expect(component).toBeTruthy();
  });
});
