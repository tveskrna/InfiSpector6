import {Component, NgZone} from '@angular/core';
import {DruidLibraryService} from '../../shared/tools/druid-library/druid-library.service';

@Component({
  selector: 'message-info-list',
  templateUrl: './message-info-list.component.html',
  styleUrls: ['./message-info-list.component.css']
})

export class MessageInfoListComponent {

  private messageInfo:string = "";
  private nodeMessagesInfo:string[] = [];
  private index:number;
  private page:string = "-/-";

  constructor(private druidLibrary:DruidLibraryService, private zone:NgZone) {
    /**
     * Zone provide this component out of Angular.
     * Due to zone can be used in javascript file.
     * For example is this component used in messageFlowChart.js
     */
    window['MessageInfoListComponentRef'] = {
      zone: this.zone,
      component: this
    };
  }

  getNodeInfo(nodeName, filter, srcDest) {
    let self = this;
    this.index = 0;
    this.zone.run(() => {
      self.druidLibrary.getNodeInfo(nodeName, filter, srcDest).subscribe((nodeMessagesInfo) => {
        self.nodeMessagesInfo = nodeMessagesInfo;
        self.messageInfo = nodeMessagesInfo[self.index];
        this.setPage();
      })
    });
  }

  nextNodeMessageInfo() {
    this.index++;
    if ((this.index % this.nodeMessagesInfo.length) === 0) this.index = 0;
    this.messageInfo = this.nodeMessagesInfo[this.index];
    this.setPage();
  }

  prevNodeMessageInfo() {
    this.index--;
    if (this.index < 0) this.index = this.nodeMessagesInfo.length-1;
    if (this.index == -1) this.index = 0;
    this.messageInfo = this.nodeMessagesInfo[this.index];
    this.setPage();
  }

  setPage() {
    let currentPage = this.index + 1;
    this.page = currentPage + "/" + this.nodeMessagesInfo.length;
  }
}

