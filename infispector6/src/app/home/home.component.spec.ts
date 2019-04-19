import { TestBed, async } from '@angular/core/testing';
import { HomeComponent } from './home.component';
import {APP_ENVIRONMENT} from '../environment';
import {DruidLibraryService} from '../shared/tools/druid-library/druid-library.service';
import {HttpClientModule} from '@angular/common/http';

describe('HomeComponent', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        HomeComponent
      ],
      imports: [HttpClientModule],
      providers: [DruidLibraryService, APP_ENVIRONMENT]
    }).compileComponents();
  }));

  it('Should create Home component', () => {
    const fixture = TestBed.createComponent(HomeComponent);
    const component = fixture.debugElement.componentInstance;
    expect(component).toBeTruthy();
  });

  it(`Should fill response area with text`, async () => {
    const fixture = TestBed.createComponent(HomeComponent);
    const component = fixture.debugElement.componentInstance;

    component.ngOnInit();
    expect(component.response).not.toBeUndefined();
  });
});
