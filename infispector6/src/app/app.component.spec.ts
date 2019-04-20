import {TestBed, async, inject} from '@angular/core/testing';
import { AppComponent } from './app.component';
import {RouterTestingModule} from '@angular/router/testing';
import {APP_ENVIRONMENT} from './environment';
import {HttpClientModule} from '@angular/common/http';

describe('AppComponent', () => {

  let app;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        AppComponent,
      ],
      imports: [
        RouterTestingModule,
        HttpClientModule
      ],
      providers: [APP_ENVIRONMENT]
    }).compileComponents();
  }));

  beforeEach(() => {
    let fixture = TestBed.createComponent(AppComponent);
    app = fixture.debugElement.componentInstance;
  });

  it('Should have server url as "http://localhost:8000"', () => {
    let environment = TestBed.get(APP_ENVIRONMENT);
    expect(environment.getServerUrl()).toEqual("http://localhost:8000");
  });

  it('Should create the app', () => {
    expect(app).toBeTruthy();
  });

  it("Should get server status", (done) => {
    app.getServerStatus().subscribe((response) => {

      let host = response.host == "http://localhost:8000";
      let cors = response.cors;
      let jsonParser = response.jsonParser;
      let urlEncoded = response.urlEncoded;

      expect(host && cors && jsonParser && urlEncoded).toBe(true);
      done();
    })
  });
});
