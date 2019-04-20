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

      expect(response.host).toEqual("http://localhost:8000");
      expect(response.cors).toBe(true);
      expect(response.jsonParser).toBe(true);
      expect(response.urlEncoded).toBe(true);
      done();
    })
  });
});
