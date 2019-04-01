require("d3");

/**
 * Displays new time line diagram
 * @param units - current units to be dispayed
 */

const allUnits = {
  "hours" : {value: 24},
  "minutes" : {value: 60},
  "seconds" : {value: 60},
  "milliseconds" : {value: 50}
};

const margin = {top: 20, right: 30, bottom: 30, left: 80},
  width = 900 - margin.left - margin.right,
  height = 300 - margin.top - margin.bottom;

const unitOrder = ["hours", "minutes", "seconds", "milliseconds"];

let dateFrom = new Date();
let dateTo;
let valueOfOneBar = 1;
let back = [];

function timeLine(units) {

  let data = [];
  let selectedValues = [];
  let numberOfBars = allUnits[units].value;
  for (let j = 0; j < numberOfBars; j++) {
    data[j] = {"time": j * valueOfOneBar, "value": Math.round(Math.random() * 100)};
  }

  let numberOfSelected = 0;

  let x = d3.scale.ordinal()
    .rangeBands([0, width], 0.1);

  let y = d3.scale.linear()
    .range([height, 0]);

  let xAxis = d3.svg.axis()
    .scale(x)
    .tickFormat(function (d) {
      let prefix = d3.formatPrefix(d);
      return prefix.scale(d) + prefix.symbol;
    })
    .orient("bottom");

  let yAxis = d3.svg.axis()
    .scale(y)
    .tickFormat(function (d) {
      let prefix = d3.formatPrefix(d);
      return prefix.scale(d) + prefix.symbol;
    })
    .orient("left");

  let chart = d3.select("#time-line-div").append("svg")
    .attr("id", "timeLine")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  x.domain(data.map(function (d) {
    return d.time;
  }));
  y.domain([0, d3.max(data, function (d) {
    return d.value;
  })]);

  chart.append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(0," + height + ")")
    .call(xAxis);

  chart.append("g")
    .attr("class", "y axis")
    .call(yAxis);

  let bars = chart.selectAll(".bar")
    .data(data)
    .enter().append("g");

  bars.append("rect")
    .attr("class", "bar")
    .attr("selected", false)
    .attr("fill", "steelblue")
    .attr("time", function(d) { return d.time; })       // workaround
    .attr("x", function (d) {
      return x(d.time / 1);
    })
    .attr("y", function (d) {
      return y(d.value);
    })
    .attr("height", function (d) {
      return height - y(d.value);
    })
    .attr("width", x.rangeBand())
    .on("mouseover", function () {
      let thisBar = d3.select(this);
      thisBar[0][0].nextSibling.setAttribute("style", "opacity: 1");
      if (thisBar.attr("selected") === "false") { thisBar.attr("fill", "red"); }
    })
    .on("mouseout", function () {
      let thisBar = d3.select(this);
      thisBar[0][0].nextSibling.setAttribute("style", "opacity: 0");
      if (thisBar.attr("selected") === "false") { thisBar.attr("fill", "steelblue"); }
    })
    .on("click", function () {
      let thisBar = d3.select(this);
      if (thisBar.attr("selected") === "false") {
        if (numberOfSelected === 2) {
          // displayGrowl("Unable to select more than 2 bars"); TODO make work growl again
          alert("Unable to select more than 2 bars");
        }
        else {
          thisBar.attr("selected", true).attr("fill", "green");
          if (!numberOfSelected) {
            selectedValues[0] = thisBar.attr("time");
            dateFrom = setTime(units, thisBar.attr("time"));
            dateTo = new Date(dateFrom.getTime());
          }
          else {
            selectedValues[1] = thisBar.attr("time");
            dateTo = setTime(units, thisBar.attr("time"));
            validateOrder();
            let nextUnits = decideUnits(units, selectedValues);
            if (nextUnits !== "unable") {
              timeLineDestroy();
              timeLine(nextUnits);
            }
          }
          getTime(units);
          numberOfSelected++;
        }
      }
      else {
        thisBar.attr("selected", false);
        numberOfSelected--;
        selectedValues.pop();
        thisBar.attr("fill", "red");
      }
    });

  bars.append("text")
    .attr("x", function (d) {
      let thisBar = d3.selectAll("rect")[0][d.time / valueOfOneBar];
      let xValue = parseInt(thisBar.getAttribute("x"), 10) + parseInt(thisBar.getAttribute("width"), 10) / 2;
      return xValue;
    })
    .attr("y", -25)
    .attr("dy", "20px")
    .attr("fill", "#000")
    .attr("text-anchor", "middle")
    .attr("font-size", "10px")
    .style("opacity", 0)
    .text(function (d) {
      return d.value;
    });

  d3.select("#timeLine").attr("height", height + margin.top + margin.bottom + 60)
    .attr("width", width + margin.left + margin.right + 60);

  chart.append("text")
    .attr("x", -(height / 2))
    .attr("y", -45)
    .attr("transform", "rotate(270)")
    .style("text-anchor", "middle")
    .text("Number of messages");

  chart.append("text")                                           // adding axis description
    .attr("x", width / 2)
    .attr("y", height + 60)
    .attr("id", units)
    .style("text-anchor", "middle")
    .text(units);

  let ticks = d3.selectAll(".tick");
  for (let i = 1; i < numberOfBars + 1; i += 2) {
    // debugger;
    ticks[0][i].childNodes[0].setAttribute("y2", 17);
    ticks[0][i].childNodes[1].setAttribute("y", 20);
  }

  let button = chart.append("g");
  button.append("rect")
    .attr("x", width - 60)
    .attr("y", height + 40)
    .attr("rx", 5)
    .attr("ry", 5)
    .attr("width", 70)
    .attr("height", 20)
    .attr("fill", "#e6e6e6")
    .attr("border", 2)
    .attr("stroke", "black")
    .attr("id", "button")
    .on("click", function () {
      higher();
    });
  button.append("text")
    .attr("x", width - 40)
    .attr("y", height + 55)
    .attr("fill", "black")
    .style("cursor", "default")
    .text("back")
    .on("click", function () {
      higher();
    });
}

/**
 * Method sets specific unit to selected time
 * @param units - units to be changed
 * @param timeSelected - value on which to change selected units
 * @returns {Date} - return date result
 */
function setTime(units, timeSelected) {        // will set new time in localStorage
  let date = new Date(dateFrom.getTime());
  switch (units) {
    case "hours":
      date.setHours(timeSelected);
      date.setMinutes(0);
      date.setSeconds(0);
      date.setMilliseconds(0);
      break;
    case "minutes":
      date.setMinutes(timeSelected);
      date.setSeconds(0);
      date.setMilliseconds(0);
      break;
    case "seconds":
      date.setSeconds(timeSelected);
      date.setMilliseconds(0);
      break;
    case "milliseconds":
      date.setMilliseconds(timeSelected);
      break;
  }
  return date;
}

/**
 * validates order of selected times. If user selects higher value first, it is stored in variable fromTime and lower value is in toTime. This methods reverts it.
 */

function validateOrder() {
  if (dateFrom > dateTo) {
    dateTo = [dateFrom, dateFrom = dateTo][0];
  }
}

/**
 * Method to decide if new units are necessary
 * @param currentUnits
 * @param selectedValues
 * @returns {*} - return which units should go next
 */

function decideUnits(currentUnits, selectedValues) {   // will decide new units (hours -> minutes -> seconds -> milliseconds)
  let nextUnits;
  back.push(currentUnits + "," + valueOfOneBar.toString());   /** for back button purposes */
  if (currentUnits === "milliseconds") {
    nextUnits = currentUnits;
    if (((Math.abs(selectedValues[0] - selectedValues[1]) + valueOfOneBar) * valueOfOneBar) < allUnits["milliseconds"].value) {
      // displayGrowl("Unable to go any further!");
      alert("Unable to go any further!");
      back.pop();
      return "unable";
    }
    else {
      valueOfOneBar = Math.ceil(valueOfOneBar / allUnits["milliseconds"].value);
    }
  }
  else if (((Math.abs(selectedValues[0] - selectedValues[1]) + valueOfOneBar) * valueOfOneBar) >= allUnits[currentUnits].value) {
    nextUnits = currentUnits;
    valueOfOneBar = Math.ceil(valueOfOneBar / allUnits[currentUnits].value);
  }
  else {
    nextUnits = unitOrder[unitOrder.indexOf(currentUnits) + 1];
    valueOfOneBar = Math.abs(selectedValues[0] - selectedValues[1]) + valueOfOneBar;
    if (nextUnits === "milliseconds") {
      valueOfOneBar *= 1000;
    }
  }
  return nextUnits;
}

/**
 * Method which makes graph to go back to previous layer
 */

function higher() {
  let tmp = back.pop();
  if (tmp === undefined) {
    // displayGrowl("Unable to go any higher!");
    alert("Unable to go any higher!")
    return;
  }
  tmp = tmp.split(",");
  timeLineDestroy();
  valueOfOneBar = tmp[1];
  timeLine(tmp[0]);
}

/**
 * Method checks if times are not the same (in case only one bar is selected). If so, it increments value of current units in toTime
 */

function getTime(currentUnits) {
  if (dateFrom === dateTo) {
    switch (currentUnits) {
      case "hours":
        dateTo.setHours(dateFrom.getHours() + 1);
        break;
      case "minutes":
        dateTo.setMinutes(dateFrom.getMinutes() + 1);
        break;
      case "seconds":
        dateTo.setSeconds(dateFrom.getSeconds() + 1);
        break;
      case "milliseconds":
        dateTo.setMilliseconds(dateFrom.getMilliseconds() + 1);
        break;
    }
  }
  console.log(dateFrom);
  console.log(dateTo);
}

/**
 * Destroys time line diagram
 */
function timeLineDestroy() {
  let element = document.getElementById("timeLine");
  if (element !== null) {
    element.remove();
  }
}

module.exports = {
  timeLine        : timeLine
};
