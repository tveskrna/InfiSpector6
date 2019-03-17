import {Component, OnInit} from '@angular/core';
import {HttpClient} from '@angular/common/http';

@Component({
  selector: 'home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})

export class HomeComponent implements OnInit{

  public response:string;

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.response = "\n" +
      "\t    Infinispan messages history,\n" +
      "\t      is never more a mystery.\n" +
      "\t    Meet InfiSpector, say hello!\n" +
      "\t     He monitors that data flow.\n" +
      "\t   Send the entries, let it grow,\n" +
      "\t     InfiSpector makes the show!";
  }

  onClickDruid() {
    let self = this;
    this.http.post("http://localhost:8000/getMsgCnt", null, {responseType: 'json'}).subscribe(data => {
      self.response = "Total messages count in Druid database:\n\n" + JSON.stringify(data, null, 2);
    });
  }
}

