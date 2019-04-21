import {Component, OnInit} from '@angular/core';
import {DruidLibraryService} from '../../tools/druid-library/druid-library.service';
import * as timeLine from './timeLine/timeLine';

@Component({
  selector: '<time-line></time-line>',
  template: `
    <div id="time-line-container">
      <h2 id="time-line-h2">Time line</h2>
      <div id="time-line-div"></div>
    </div>`,
  styles: ['#time-line-container { width: 900px; float: left} h2{margin-left: 70px}']
})

export class TimeLineComponent implements OnInit{

  private unitOrder = ["hours", "minutes", "seconds", "milliseconds"];

  constructor(private druidLibrary:DruidLibraryService) {}

  ngOnInit () {
    this.calculateDefaultUnits();
  }

  calculateDefaultUnits() {

    this.druidLibrary.getFirstMessageTime().subscribe((firstMessageTime) => {
      this.druidLibrary.getLastMessageTime().subscribe((lastMessageTime) => {
        let difference = lastMessageTime - firstMessageTime;
        if (difference < 1000) {
          timeLine.timeLine("milliseconds");
          return;
        }
        difference = Math.floor(difference / 1000);
        for (let i = this.unitOrder.length - 2; i >= 0; i--) {
          if (difference < 60 || i === 0) {
            timeLine.timeLine(this.unitOrder[i]);
            return;
          }
          difference = Math.floor(difference / 60);
        }
      });
    });
  };
}
