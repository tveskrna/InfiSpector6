import {Component, Input, OnInit} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {DruidLibraryService} from '../shared/tools/druid-library/druid-library.service';
import {debug} from 'util';

@Component({
  selector: 'home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})

export class HomeComponent implements OnInit{

  private query:string;
  private response:string;

  constructor(private druidLibrary:DruidLibraryService) {}

  ngOnInit() {
    this.query = '{\n' +
      '  "queryType": "topN",\n' +
      '  "dataSource": "infispector-datasource",\n' +
      '  "granularity": "all",\n' +
      '  "dimension": "dest",\n' +
      '  "metric": "count",\n' +
      '  "threshold": 100000,\n' +
      '  "aggregations": [{"type": "count", "name": "count"}],\n' +
      '  "intervals": ["2009-10-01T00:00/2020-01-01T00"]\n}';

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
    let pureQuery = this.query.replace(/\s/g, "");
    this.druidLibrary.customDruidQuery(pureQuery).subscribe((response) => {
      self.response = JSON.stringify(response, null, 2);
    });
  }
}

