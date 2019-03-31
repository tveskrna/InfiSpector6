
// export function partData(data:any, p:any);
// export function messageFlowChartF(nodes:any, matrix:any, messageType:any, last:any):void;

declare module messageFlowChart {
  export function messageFlowChart(nodes:string[], matrix:any[], messageType:string): void;

  export function deleteGraphs():void;
}

export = messageFlowChart;
