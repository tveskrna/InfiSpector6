/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

require("d3");

/* global d3 */

const b=30, bb=150, height=600, buffMargin=1, minHeight=14;
const c1=[-130, 40], c2=[-50, 100], c3=[-10, 120]; //Column positions of labels.
const colors =["#3366CC", "#DC3912",  "#FF9900","#109618", "#990099", "#0099C6"];

function partData(data,p){
  let sData={};

  sData.keys=[
    d3.set(data.map(function(d){ return d[0];})).values().sort(function(a,b){ return ( a<b? -1 : a>b ? 1 : 0);}),
    d3.set(data.map(function(d){ return d[1];})).values().sort(function(a,b){ return ( a<b? -1 : a>b ? 1 : 0);})
  ];

  sData.data = [	sData.keys[0].map( function(d){ return sData.keys[1].map( function(v){ return 0; }); }),
    sData.keys[1].map( function(d){ return sData.keys[0].map( function(v){ return 0; }); })
  ];

  data.forEach(function(d){
    sData.data[0][sData.keys[0].indexOf(d[0])][sData.keys[1].indexOf(d[1])]=d[p];
    sData.data[1][sData.keys[1].indexOf(d[1])][sData.keys[0].indexOf(d[0])]=d[p];
  });

  return sData;
}

function visualize(data){
  let vis ={};
  function calculatePosition(a, s, e, b, m){
    let total=d3.sum(a);
    let sum=0, neededHeight=0, leftoverHeight= e-s-2*b*a.length;
    let ret =[];

    a.forEach(
      function(d){
        let v={};
        v.percent = (total === 0 ? 0 : d/total);
        v.value=d;
        v.height=Math.max(v.percent*(e-s-2*b*a.length), m);
        if (v.height === m) {
          leftoverHeight -= m;
        }
        else {
          neededHeight += v.height;
        }
        ret.push(v);
      }
    );

    let scaleFact=leftoverHeight/Math.max(neededHeight,1);
    sum=0;

    ret.forEach(
      function(d){
        d.percent = scaleFact*d.percent;
        d.height=(d.height===m? m : d.height*scaleFact);
        d.middle=sum+b+d.height/2;
        d.y=s + d.middle - d.percent*(e-s-2*b*a.length)/2;
        d.h= d.percent*(e-s-2*b*a.length);
        d.percent = (total === 0 ? 0 : d.value/total);
        sum+=2*b+d.height;
      }
    );
    return ret;
  }

  vis.mainBars = [
    calculatePosition( data.data[0].map(function(d){ return d3.sum(d);}), 0, height, buffMargin, minHeight),
    calculatePosition( data.data[1].map(function(d){ return d3.sum(d);}), 0, height, buffMargin, minHeight)
  ];

  vis.subBars = [[],[]];
  vis.mainBars.forEach(function(pos,p){
    pos.forEach(function(bar, i){
      calculatePosition(data.data[p][i], bar.y, bar.y+bar.h, 0, 0).forEach(function(sBar,j){
        sBar.key1=(p===0 ? i : j);
        sBar.key2=(p===0 ? j : i);
        vis.subBars[p].push(sBar);
      });
    });
  });
  vis.subBars.forEach(function(sBar){
    sBar.sort(function(a,b){
      return (a.key1 < b.key1 ? -1 : a.key1 > b.key1 ?
        1 : a.key2 < b.key2 ? -1 : a.key2 > b.key2 ? 1: 0 );});
  });

  vis.edges = vis.subBars[0].map(function(p,i){
    return {
      key1: p.key1,
      key2: p.key2,
      y1:p.y,
      y2:vis.subBars[1][i].y,
      h1:p.h,
      h2:vis.subBars[1][i].h
    };
  });
  vis.keys=data.keys;
  return vis;
}

function arcTween(a) {
  let i = d3.interpolate(this._current, a);
  this._current = i(0);
  return function(t) {
    return edgePolygon(i(t));
  };
}

function drawPart(data, id, p, length, longestCnt){
  let len = 0;
  if (!p) {
    longestCnt /= 5;
    len = length + longestCnt;
    length = 0;
  }
  d3.select("#"+id).append("g").attr("class","part"+p)
    .attr("transform","translate("+( p*(bb+b))+",0)");
  d3.select("#"+id).select(".part"+p).append("g").attr("class","subbars");
  d3.select("#"+id).select(".part"+p).append("g").attr("class","mainbars");

  let mainbar = d3.select("#"+id).select(".part"+p).select(".mainbars")
    .selectAll(".mainbar").data(data.mainBars[p])
    .enter().append("g").attr("class","mainbar");

  mainbar.append("rect").attr("class","mainrect")
    .attr("x", 0).attr("y",function(d){ return d.middle-d.height/2; })
    .attr("width",b).attr("height",function(d){ return d.height; })
    .style("shape-rendering","auto")
    .style("fill-opacity",0).style("stroke-width","0.5")
    .style("stroke","black").style("stroke-opacity",0);

  mainbar.append("text").attr("class","barlabel")
    .attr("x", c1[p] - 4 * len).attr("y",function(d){ return d.middle+5;})
    .text(function(d,i){ return data.keys[p][i];})
    .attr("text-anchor","start" );

  mainbar.append("text").attr("class","barvalue")
    .attr("x", c2[p] + 5 * length).attr("y",function(d){ return d.middle+5;})
    .text(function(d,i){ return d.value ;})
    .attr("text-anchor","end");

  d3.select("#"+id).select(".part"+p).select(".subbars")
    .selectAll(".subbar").data(data.subBars[p]).enter()
    .append("rect").attr("class","subbar")
    .attr("x", 0).attr("y",function(d){ return d.y;})
    .attr("width",b).attr("height",function(d){ return d.h;})
    .style("fill",function(d){ return colors[d.key1 % colors.length];});
}

function drawEdges(data, id){
  d3.select("#"+id).append("g").attr("class","edges").attr("transform","translate("+ b+",0)");

  d3.select("#"+id).select(".edges").selectAll(".edge")
    .data(data.edges).enter().append("polygon").attr("class","edge")
    .attr("points", edgePolygon).style("fill",function(d){ return colors[d.key1 % colors.length];})
    .style("opacity",0.5).each(function(d) { this._current = d; });
}

function drawHeader(header, id, length, longestCnt){
  d3.select("#"+id).append("g").attr("class","header").append("text").text(header[2])
    .style("font-size","20").attr("x",108).attr("y",-20).style("text-anchor","middle")
    .style("font-weight","bold");

  [0,1].forEach(function(d){
    let h = d3.select("#"+id).select(".part"+d).append("g").attr("class","header");

    h.append("text").text(header[d]).attr("x", (c1[d]-5 - (!d) * (3 * length + longestCnt)))
      .attr("y", -5).style("fill","grey");

    h.append("text").text("Count").attr("x", (c2[d]-10 + d * 5 * length))
      .attr("y", -5).style("fill","grey");

    h.append("line").attr("x1",c1[d]-10 - (!d) * (3 * length + longestCnt)).attr("y1", -2)
      .attr("x2",c3[d]+10 + d * 5 * length).attr("y2", -2).style("stroke","black")
      .style("stroke-width","1").style("shape-rendering","crispEdges");
  });
}

function edgePolygon(d){
  return [0, d.y1, bb, d.y2, bb, d.y2+d.h2, 0, d.y1+d.h1].join(" ");
}

function transitionPart(data, id, p){
  let mainbar = d3.select("#"+id).select(".part"+p).select(".mainbars")
    .selectAll(".mainbar").data(data.mainBars[p]);

  mainbar.select(".mainrect").transition().duration(500)
    .attr("y",function(d){ return d.middle-d.height/2;})
    .attr("height",function(d){ return d.height;});

  mainbar.select(".barlabel").transition().duration(500)
    .attr("y",function(d){ return d.middle+5;});

  mainbar.select(".barvalue").transition().duration(500)
    .attr("y",function(d){ return d.middle+5;}).text(function(d,i){ return d.value ;});

  d3.select("#"+id).select(".part"+p).select(".subbars")
    .selectAll(".subbar").data(data.subBars[p])
    .transition().duration(500)
    .attr("y",function(d){ return d.y;}).attr("height",function(d){ return d.h;});
}

function transitionEdges(data, id){
  d3.select("#"+id).append("g").attr("class","edges")
    .attr("transform","translate("+ b+",0)");

  d3.select("#"+id).select(".edges").selectAll(".edge").data(data.edges)
    .transition().duration(500)
    .attrTween("points", arcTween)
    .style("opacity",function(d){ return (d.h1 === 0 || d.h2 === 0 ? 0 : 0.5);});
}

function transition(data, id){
  transitionPart(data, id, 0);
  transitionPart(data, id, 1);
  transitionEdges(data, id);
}

function draw(data, svg, length, longestCnt){
  data.forEach(function(biP,s){
    s = 0.10;
    svg.append("g")
      .attr("id", biP.id)
      .attr("transform","translate("+ (550*s)+",0)");

    let visData = visualize(biP.data);
    drawPart(visData, biP.id, 0, length, longestCnt);
    drawPart(visData, biP.id, 1, length, longestCnt);
    drawEdges(visData, biP.id);
    drawHeader(biP.header, biP.id, length, longestCnt);

    [0,1].forEach(function(p){
      d3.select("#"+biP.id)
        .select(".part"+p)
        .select(".mainbars")
        .selectAll(".mainbar")
        .on("mouseover",function(d, i){ return selectSegment(data, p, i); })
        .on("mouseout",function(d, i){ return deSelectSegment(data, p, i); })
        .on("click", function(d, i) { return clickedNode(biP.data.keys[p][i] + "," + biP.id, p); });
    });
    [0, 1].forEach(function (p) {
      d3.select("#"+biP.id)
        .select(".part"+p)
        .select(".mainbars")
        .selectAll(".mainbar")
        .select(".barlabel")
        .on("click", function(d, i) { return clickedNode(biP.data.keys[p][i] + "," + biP.id, p); });
    });
  });
}

function selectSegment(data, m, s){
  data.forEach(function(k){
    let newdata =  {keys:[], data:[]};

    newdata.keys = k.data.keys.map( function(d){ return d;});

    newdata.data[m] = k.data.data[m].map( function(d){ return d;});

    newdata.data[1-m] = k.data.data[1-m]
      .map( function(v){ return v.map(function(d, i){ return (s===i ? d : 0);}); });

    transition(visualize(newdata), k.id);

    let selectedBar = d3.select("#"+k.id).select(".part"+m).select(".mainbars")
      .selectAll(".mainbar").filter(function(d,i){ return (i===s);});

    selectedBar.select(".mainrect").style("stroke-opacity",1);
    selectedBar.select(".barlabel").style('font-weight','bold');
    selectedBar.select(".barvalue").style('font-weight','bold');
  });
}

function deSelectSegment(data, m, s){
  data.forEach(function(k){
    transition(visualize(k.data), k.id);

    let selectedBar = d3.select("#"+k.id).select(".part"+m).select(".mainbars")
      .selectAll(".mainbar").filter(function(d,i){ return (i===s);});

    selectedBar.select(".mainrect").style("stroke-opacity",0);
    selectedBar.select(".barlabel").style('font-weight','normal');
    selectedBar.select(".barvalue").style('font-weight','normal');
  });
}

function clickedNode(nodeNameFilter, srcDest) {
  let args = nodeNameFilter.split(",");
  window['angularComponentRef'].zone.run(() => {
    console.log("tu");
    window['angularComponentRef'].component.getNodeInfo(args[0], args[1], srcDest);
  })
}

function messageFlowChart(nodes, matrix, messageType) {
  //deleteGraphs();
  let longest = nodes.sort(function (a, b) { return b.length - a.length; })[0].length;
  let longestCnt = 0;
  matrix.forEach(function (element) {
    if (element[2].length > longestCnt) {
      longestCnt = element[2].length;
    }
  });
  let varFloat = "left";
  let elements = document.getElementsByClassName("graph");
  if (elements === null) {
    elements = [];
  }
  elements.length%2 ? varFloat = "right" : varFloat = "left";
  let width = 650, height = 610, margin ={b:0, t:40, l:170, r:50};

  let div = d3.select("#graphs").append("div").attr("class", "graph").style("float", varFloat);
  div.style("margin", "0 125px");
  div.append("h2").text(messageType);

  let svg = div.append("svg").attr('width',width)
    .attr('height',(height+margin.b+margin.t))
    .attr("id", 'Comunication' + messageType)
    .append("g").attr("transform","translate("+ margin.l+","+margin.t+")");
  let data = [
    {data:partData(matrix,2), id:messageType, header:["From","To", ""]}
  ];
  draw(data, svg, longest, longestCnt * 10 + 4);

}

function deleteGraphs() {
  let elements = document.getElementsByClassName("graph");
  for (let numberOfElements = elements.length; numberOfElements > 0; numberOfElements--) {
    elements[0].remove();
  }
}

module.exports = {
  deleteGraphs        : deleteGraphs,
  messageFlowChart    : messageFlowChart,
};
