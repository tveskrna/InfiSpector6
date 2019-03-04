import {HttpClient} from '@angular/common/http';
import {Component} from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent {
  public title:string = 'InfiSpector';
  public img:string = '/assets/img/logo.png';

  public response:string;

  constructor(private http: HttpClient) {}

  onClickDruid() {
    let self = this;
    this.http.post("http://localhost:8000/druid/status", null, {responseType: 'json'}).subscribe(data => {
      self.response = JSON.stringify(data, null, 2);
    });
    //   .pipe(map(res => {alert(res)}))
    //   .subscribe(data => {alert(data)},
    // error => alert(error.message));

    // const headers = new HttpHeaders().set('content-type', 'application/json');
    // const body = {
    //   "queryType": "topN",
    //   "dataSource": "infispector-datasource",
    //   "granularity": "all",
    //   "dimension": "dest",
    //   "metric": "count",
    //   "threshold": 100000,
    //   "aggregations": [
    //     {"type": "count", "name": "count"}
    //   ],
    //   "intervals": ["2009-10-01T00:00/2020-01-01T00"]
    // };
    //
    // let url:string = "http://localhost:8082/druid/v2?pretty";
    //
    // return this.http
    //   .post(url, body, { headers: headers })
    //   .subscribe(res => {
    //     alert(res.toString());
    //   });

  }
}

