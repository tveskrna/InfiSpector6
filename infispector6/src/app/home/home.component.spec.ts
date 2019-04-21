import { TestBed, async } from '@angular/core/testing';
import { HomeComponent } from './home.component';
import {APP_ENVIRONMENT} from '../environment';
import {DruidLibraryService} from '../shared/tools/druid-library/druid-library.service';
import {HttpClientModule} from '@angular/common/http';
import {FormsModule} from '@angular/forms';

describe('HomeComponent', () => {

  let component;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        HomeComponent
      ],
      imports: [
        HttpClientModule,
        FormsModule
      ],
      providers: [
        DruidLibraryService,
        APP_ENVIRONMENT
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    const fixture = TestBed.createComponent(HomeComponent);
    component = fixture.debugElement.componentInstance;
  });

  it('Should create Home component', () => {
    expect(component).toBeTruthy();
  });

  it(`Should fill response area with text`, async () => {
    component.ngOnInit();
    expect(component.response).not.toBeUndefined();
  });
});
