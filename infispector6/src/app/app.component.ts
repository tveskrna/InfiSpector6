import {Component} from '@angular/core';
import {DruidResponse} from './shared/tools/druid-library/DruidResponse';
import {map} from 'rxjs/operators';
import {HttpClient} from '@angular/common/http';
import {APP_ENVIRONMENT} from './environment';

@Component({
  selector: 'app-root',
  template: '<router-outlet></router-outlet>'
})

export class AppComponent{

  private baseUrl:string;

  constructor(private http: HttpClient, private env: APP_ENVIRONMENT) {
    this.baseUrl = this.env.getServerUrl();
  }

  /**
   * Get server status
   */
  getServerStatus() {
    return this.http.get(this.baseUrl + "/status", {responseType: 'json'});
  };
}

