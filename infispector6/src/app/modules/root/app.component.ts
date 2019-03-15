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
    this.http.post("http://localhost:8000/getNodes", null, {responseType: 'json'}).subscribe(data => {
      self.response = JSON.stringify(data, null, 2);
      console.log(data);
    });
  }
}

