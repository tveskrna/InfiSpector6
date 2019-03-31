import {Component, OnInit} from '@angular/core';
import {DruidLibraryService} from '../../tools/druid-library/druid-library.service';

import * as messageFlowChart from './messageFlowChart/messageFlowChart';

@Component({
  selector: 'message-flow',
  templateUrl: './message-flow.component.html',
  styleUrls: ['./message-flow.component.css']
})

export class MessageFlowComponent {

  private groupLegend: string;

  private inputFilters: string = "";
  private nodesInGroup: number = 1;

  private hidden: boolean = true;
  private legendHidden: boolean = true;
  private loadingBarHidden: boolean = true;
  private cnt: number = 0;

  constructor(private druidLibrary: DruidLibraryService) {
  }

  drawGraph() {
    let filters = "";
    let filtersArray: string[];

    if (!this.hidden) {
      filters = this.inputFilters;
      filters = filters.replace(" ", "");
    }
    else {
      messageFlowChart.deleteGraphs();
      filters = "SingleRpcCommand,CacheTopologyControlCommand,StateResponseCommand,StateRequestCommand";
    }

    filtersArray = filters.split(",");

    let graphClass: any = document.getElementsByClassName("graph");
    let filtersUsed = [];

    if (graphClass.length > 0) {
      for (let i = 0; i < graphClass.length; i++) {
        filtersUsed.push(graphClass[i].childNodes[0].innerText);
      }
    }

    for (let j = 0; j < filtersArray.length; j++) {
      if (filtersUsed.indexOf(filtersArray[j]) > -1) {

        //TODO displayGrowl(filtersArray[j] + " filter already used");
        filtersArray.splice(j, 1);
      }
    }
    if (filtersArray.length > 0) {
      this.loadingBarHidden = false;
      this.flowChart(filtersArray);
    }
  };

  // TODO: we will need more flowCharts in the dashboard
  // TODO: create matrix/array of flowcharts
  flowChart(filters) {
    let self = this;
    let searchMessageText = ""; // "" means show all messages, no filter
    this.druidLibrary.getNodes().subscribe(function (nodes) {
      for (let j = 0; j < filters.length; j++) {
        searchMessageText = filters[j];
        self.getMatrix(nodes, searchMessageText, filters.length, function (matrix, filter) {
          self.cnt++;
          messageFlowChart.messageFlowChart(nodes, matrix, filter, self.cnt === filters.length);
        });
      }
    });
    this.hidden = false;
    return 0;
  };

  getMatrix(nodes, filter, filterCount, callback) {
    let matrix = [];
    let groupNames = [];

    let requestsRemaining = Math.pow(nodes.length, 2);
    let onePercent = (requestsRemaining * filterCount) * 0.01;

    nodes.push(nodes.splice(nodes.indexOf("\"null\""), 1)[0]);
    let numberOfNodesInGroup = this.nodesInGroup;
    if (numberOfNodesInGroup > 1) {
      for (let i = 0; i < Math.ceil(nodes.length / numberOfNodesInGroup); i++) {
        groupNames.push(JSON.stringify("group" + i));
      }
      this.groupLegend = "";
      this.legendHidden = false;
    }
    else {
      groupNames = nodes;
      this.legendHidden = true;
    }
    for (let i1 = 0; i1 < nodes.length; i1++) {
      if (i1 % numberOfNodesInGroup === 0 && i1 !== nodes.length - 1) {
        this.groupLegend += "\ngroup" + i1 / numberOfNodesInGroup + ":\n";
      }
      if (i1 !== nodes.length - 1) {
        this.groupLegend += nodes[i1] + "\n";
      }
      for (let i2 = 0; i2 < nodes.length; i2++) {

        let srcGroup = groupNames[Math.floor(i1 / numberOfNodesInGroup)];
        let destGroup = groupNames[Math.floor(i2 / numberOfNodesInGroup)];

        this.druidLibrary.getMessagesCount(nodes[i1], nodes[i2], filter, srcGroup, destGroup).subscribe((response) => {

          matrix.push(response.result);
          //TODO loading bar
          --requestsRemaining;
          // ++requestsRemainingToPercent;
          // if (requestsRemainingToPercent >= onePercent) {
          //   requestsRemainingToPercent = 0;
          //   if (onePercent < 1) {
          //     frame(1 / onePercent);
          //   }
          //   else {
          //     frame(1);
          //   }
          // }
          if (requestsRemaining <= 0) {
            if (numberOfNodesInGroup > 1) {
              let tmp;
              for (let i = 0; i < matrix.length; i++) {
                for (let j = 0; j < matrix.length; j++) {
                  if (i === j) {
                    continue;
                  }
                  if (matrix[i][0] === matrix[j][0] && matrix[i][1] === matrix[j][1]) {
                    tmp = matrix[j][2];
                    matrix.splice(j, 1);
                    matrix[i][2] = parseInt(tmp, 10) + parseInt(matrix[i][2], 10);
                    j--;
                  }
                }
              }
            }
            callback(matrix, response.searchMessageText);
          }
        });
      }
    }
  };
}