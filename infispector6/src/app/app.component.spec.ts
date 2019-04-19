import {TestBed, async, inject} from '@angular/core/testing';
import { AppComponent } from './app.component';
import {RouterTestingModule} from '@angular/router/testing';
import {APP_ENVIRONMENT} from './environment';

describe('AppComponent', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        AppComponent,
      ],
      imports: [ RouterTestingModule ],
      providers: [APP_ENVIRONMENT]
    }).compileComponents();
  }));

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  });

  it('should have server url as "http://localhost:8000"', () => {
    let environment = TestBed.get(APP_ENVIRONMENT);
    expect(environment.getServerUrl()).toEqual("http://localhost:8000");
  });
});
