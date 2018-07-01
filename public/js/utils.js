var historicalData;
var resNames = [];
var arc;
var gauges = {};


function makeWaterBuckets(containerDivID, countX, countY, amountPerBucket, width, height, marginBottom) {
    // SVG Canvas
    var svg = d3.select(containerDivID).append("svg")
                                     .attr("width", width)
                                     .attr("height", height + marginBottom)
                                     .attr("id", "buckets");
    
    // Calculations
    var bucketSpace = Math.min(width / countX, height / countY);
    var margin = bucketSpace / 8;
    var bucketSize = bucketSpace - 2 * margin;
    console.log(x);
    console.log(margin);
    console.log(width);
    console.log(bucketSpace);
    var bucketNum = 1;
    for (var y = 0; y < countY; y += 1) {
        for (var x = 0; x < countX; x += 1) {
            var rect = svg.append("rect")
                        .attr("x", margin / 2 + x * bucketSpace)
                        .attr("y", margin / 2 + y * bucketSpace)
                        .attr("width", bucketSize)
                        .attr("height", bucketSize)
                        .attr("fill", "#0D7AC4")
                        .attr("id", "bucket" + bucketNum)
                        .attr("class", "bucket");
            bucketNum++;
        }
    }
    
    var endY = bucketSpace * countY;
    
    // Make legend
    var square = svg.append("rect")
                .attr("x", margin / 2)
                .attr("y", endY + marginBottom / 2)
                .attr("width", bucketSize)
                .attr("height", bucketSize)
                .attr("fill", "#0D7AC4");
    
    var label = svg.append("text")
                .text("= " + amountPerBucket + " gallons")
                .attr("x", bucketSpace + margin / 2)
                .attr("y", endY + marginBottom / 2 + bucketSize - margin)
                .attr("font-size", 18)
                .attr("class", "label");
    
    var gallonsRemaining = svg.append("text")
                .text(countX * countY * amountPerBucket + " gallons remaining")
                .attr("x", width / 2 - 100)
                .attr("y", endY + marginBottom / 2 + bucketSize - margin)
                .attr("font-size", 18)
                .attr("class", "label")
                .attr("id", "gallons-remaining");
}

function updateWaterBuckets(newVolume, countX, countY, amountPerBucket) {
    // Calculations
    var totalVolume = countX * countY * amountPerBucket;
    var removedVolume = totalVolume - newVolume;
    
    var bucketsToRemove = Math.round(removedVolume / amountPerBucket);
    
    for (var b = 1; b <= bucketsToRemove; b++) {
        $("#bucket" + b).attr("fill", "#DDD");
    }
    for (var b = bucketsToRemove + 1; b < countX * countY; b++) {
        $("#bucket" + b).attr("fill", "#0D7AC4");
    }
    
    $("#gallons-remaining").text(newVolume + " gallons remaining");

}

function PDSIText(textId, text) {
    return $("<h2 id='" + textId + "'>" + text + "</h2>");
}

function PDSILabels() {
    return $("<div class='slider-labels'><p id='label-neg5'>-5</p><p id='label-neg4'>-4</p><p id='label-neg3'>-3</p><p id='label-neg2'>-2</p><p id='label-neg1'>-1</p><p id='label-0'>0</p><p id='label-1'>1</p><p id='label-2'>2</p><p id='label-3'>3</p><p id='label-4'>4</p><p id='label-5'>5</p></div>");
}

function makePDSISlider(id, textId, text, sliderId, sliderVal, disabled, indicatorId) {
    if (!sliderVal) sliderVal = 0;
    $("#" + id).append(PDSIText(textId, text));
    
    var slider;
    if (disabled) {
        slider = $("<div id='" + sliderId + "' class='slider pdsi-slider'></div>");
        slider.append($("<div id='" + indicatorId + "' class='slider-indicator'></div>"))
    } else {
        slider = $("<input type='range' id='" + sliderId + "' min='-5' max='5' value='" + sliderVal + "' class='slider pdsi-slider' oninput='updatePDSILabel(this.value, \"" + textId + "\")'>");
    }
    
    $("#" + id).append(slider);
    $("#" + id).append(PDSILabels());
}

function updatePDSILabel(v, textId) {
    if (v == -5) {
            $('#' + textId).text("Extreme Drought");
    } else if (v == -4) {
            $('#' + textId).text("Extreme Drought");
    } else if (v == -3) {
            $('#' + textId).text("Severe Drought");
    } else if (v == -2) {
            $('#' + textId).text("Moderate Drought");
    } else if (v == -1) {
            $('#' + textId).text("Mid-Range");
    } else if (v == 0) {
            $('#' + textId).text("Mid-Range");
    } else if (v == 1) {
            $('#' + textId).text("Mid-Range");
    } else if (v == 2) {
            $('#' + textId).text("Moderately Moist");
    } else if (v == 3) {
            $('#' + textId).text("Very Moist");
    } else if (v == 4) {
            $('#' + textId).text("Extremely Moist");
    } else {
        $('#' + textId).text("Extremely Moist");
    }
}

function makeFillGaugeForPDSISlider() {
    
     var d = $("<svg class='gaugeSVG' id='dependency-gauge' width='150' height='150'></svg>");
     $("#dependency-viz").append(d);
    
    
    var gauge = makeFillGauge("dependency-gauge", 80);
    setTimeout(function sliderDown() {
        $("#pdsi-indicator").animate({left: "20%"}, 2000, function() {
            gauge.update(20);
            setTimeout(function sliderUp() {
                $("#pdsi-indicator").animate({left: "80%"}, 2000, function() {
                    gauge.update(80);
                    setTimeout(sliderDown, 2500);
                });}, 2500);
        });
    }, 1000);
}

function makeMultipleFillGauge() {
    var svgA = $("<svg class='gaugeSVG' id='gauge-A' width='100' height='100'></svg>");
    $("#connected-res-a").append(svgA);
    var svgB = $("<svg class='gaugeSVG' id='gauge-B' width='100' height='100'></svg>");
    $("#connected-res-b-c").append(svgB);
    var svgC = $("<svg class='gaugeSVG' id='gauge-C' width='100' height='100'></svg>");
    $("#connected-res-b-c").append(svgC);
    
    var gaugeA = makeFillGauge("gauge-A", 10);
    var gaugeB = makeFillGauge("gauge-B", 37);
    var gaugeC = makeFillGauge("gauge-C", 22);
    
    var waterColor = "orange";
    setTimeout(function updateFillGauges() {
        $("#connect-line-1").css("stroke-dashoffset", "0");
        $("#connect-line-2").css("stroke-dashoffset", "0");
        $("#connect-line-3").css("stroke-dashoffset", "0");
        gaugeA.update(90);
        d3.select("#connect-line-1").transition().duration(500).style("stroke", waterColor);
        $("#connect-line-1").animate({strokeDashoffset: "-100",
                                      stroke: waterColor}, 1500, function() {
            d3.select("#connect-line-1").transition().duration(500).style("stroke", "black");
            setTimeout(function() {
                gaugeA.update(10);
                d3.select("#connect-line-2").transition().duration(500).style("stroke", waterColor);
                d3.select("#connect-line-3").transition().duration(500).style("stroke", waterColor);
                $("#connect-line-2").animate({strokeDashoffset: "-100"}, 1500, function() {
                    d3.select("#connect-line-2").transition().duration(500).style("stroke", "black");
                });
                $("#connect-line-3").animate({strokeDashoffset: "-100"}, 1500, function() {
                    d3.select("#connect-line-3").transition().duration(500).style("stroke", "black");
                });
                gaugeB.update(76);
                gaugeC.update(55);
            }, 1000);
            
            setTimeout(function() {
                gaugeB.update(37);
                gaugeC.update(22);
                setTimeout(updateFillGauges, 3000);
            }, 3000);
        });
        
        
        
    }, 1000)
    
}

function makeFillGauges(dataFile, width, height, maxCharts, containerDiv, mapDivID) {
    // Read in data from file
    d3.json(dataFile, function(err, resData) {
        if (err) return console.error(err);
        historicalData = resData;
        
        // Create fill gauges
        var chartNum = 0;
        for (var key in resData[0]) {
            if (key === "PDSI") {
                continue;
            }
            if (key === "date") {
                $("#date").text(resData[0][key]);
                continue;
            }
            if (chartNum >= maxCharts) {
                break;
            }

            var chartDiv = $("<div class='chart'></div>");
            containerDiv.append(chartDiv);
            resNames.push(key);
            var label = $("<h2 class='res-name' id='label-" + key + "'>" + key + "</h2>");
            chartDiv.append(label);
            
            var chartID = "chart-" + key;
            // Create a new div for the chart
            var d = $("<svg class='chartSVG' id='" + chartID + "' width='" + width + "' height='" + height + "' onclick='gauge5.update(NewValue());'></svg>");
            chartDiv.append(d);
            d.mouseover(function(e) {
                var resName = e.target.id.split("-")[1];
                $("#" + resName).attr("style", "fill: orange; stroke: orange;");
                $("#" + e.target.id + " circle").attr("style", "fill: orange;");
                $("#" + e.target.id + " path").attr("style", "fill: orange;");
            });
            d.mouseout(function(e) {
                var resName = e.target.id.split("-")[1];
                $("#" + resName).attr("style", "fill: #FFF; stroke: #FFF;");
                $("#" + e.target.id + " circle").attr("style", "fill: #0D7AC4;");
                $("#" + e.target.id + " path").attr("style", "fill: #0D7AC4;");
            });
            
            var gauge = makeFillGauge(chartID, resData[0][key][0]["percent"]);
            
            gauges[key] = gauge;

            chartNum++;
        }
        if (mapDivID) {
            makeMap(mapDivID);
        }
    });
}

function makeSlider(dataFile, containerDiv, sliderId, colorCode) {
    var dateLabel = $("<h2 id='date'>January 2003</h2>");
    dateLabel.css("margin-top", "5px");
    // Create date range slider
    d3.json(dataFile, function(err, resData) {
        var sliderMax = resData.length - 1;
        var s = $("<input type='range' min='0' max='" + sliderMax + "' value='0' class='slider' oninput='updateData(this.value)' onchange='console.log(this.value);updateData(this.value)' list='drought-markers'>");
        var list = $("<datalist id='drought-markers'><option>67</option><option>139</option></datalist>")
        $("#slider").append(dateLabel);
        containerDiv.append(s);
        containerDiv.append(list);
        if (colorCode) {
            makeColorCodeDivs(dataFile, sliderId);
        }
    });
    
}

function makeColorCodeDivs(dataFile, sliderId) {
    var slider = $("#" + sliderId);
    slider.css("position", "relative");
    var sliderWidth = slider.width();
    var sliderHeight = slider.height();
    d3.json(dataFile, function(err, data) {
        var divWidth = sliderWidth / data.length;
        var divX = 0;
        for (var dataPoint of data) {
            var date = dataPoint.date;
            var pdsi = dataPoint.PDSI;
            var color = getPDSIColor(pdsi);
            var div = $("<div></div>");
            div.css("width", divWidth);
            div.css("height", sliderHeight);
            div.css("position", "absolute");
            div.css("background-color", color);
            div.css("left", divX);
            div.css("top", 0);
            div.css("z-index", 0);
            div.css("pointer-events", "none");
            slider.append(div);
            divX += divWidth;
        }
    });
}

function getPDSIColor(pdsi) {
    if (pdsi <= -4) {
        // Extreme drought
        return "#D17D00";
    } else if (pdsi <= -3) {
        // Severe drought
        return "#FFA620";
    } else if (pdsi <= -2) {
        // Moderate drought
        return "#FFD496";
    } else if (pdsi < 2) {
        // Near normal 
        return "#EEE";
    } else if (pdsi < 3) {
        // Unusual moist
        return "#A4DAFF";
    } else if (pdsi < 4) {
        // Very moist
        return "#4C9BD1";
    } else {
        // Extremely moist
        return "#095385";
    }
}

function updateData(index) {
    $("#date").text(historicalData[index]["date"]);
    for (var j = 0; j < resNames.length; j++) {
        var gauge = gauges[resNames[j]];
        var percentFull = historicalData[index][resNames[j]][0]["percent"];
        gauge.update(percentFull.toFixed(1));
    }
}

function arcTween(a) {
    var i = d3.interpolate(this._current, a);
    this._current = i(0);
    return function(t) {
        return arc(i(t));
    };
}




///////////////////////////////////////////////////////////////////////////////
//////////////////////// DATA READING AND MAP DRAWING /////////////////////////
///////////////////////////////////////////////////////////////////////////////

function makeMap(containerDivID) {
    d3.json("ca_counties.geojson", function(err, data) {
        if (err) return console.error(err);

        var width = 220, height = 300;
        // SVG Canvas
        var svg = d3.select(containerDivID).append('svg').attr('viewBox', '0 0 ' + width + ' ' + height).attr('width', '200px') ;
                                                       
        // Calculated Scale for Map Overlay
        var scale = 1215;

        // Map
        var projection = d3.geo.mercator()
                .center([-119.3, 37.6])
                .scale(scale)
                .translate([width/2, height/2]);

        // Path Generator to draw regions on map
        var path = d3.geo.path().projection(projection);

        // Get features from JSON
        var features = data.features;
        // Create SVG paths to draw zip code boundaries
        svg.selectAll('.ca')
            .data(features)
            .enter().append('path')
            .attr('d', path)
            .attr("stroke", "#0D7AC4")
            .attr("fill", "#0D7AC4")
            .attr("stroke-width", "1")
            .attr("id", "ca-map");
        
        d3.json("reservoir_data.json", function(err, data) {
            svg.selectAll('.res')
            .data(data.filter(function(resObj) {
                return resNames.includes(resObj.Name);
            }))
            .enter().append('circle')
            .attr('cx', function (d) { return projection([d.Longitude, d.Latitude])[0]})
            .attr('cy', function (d) { return projection([d.Longitude, d.Latitude])[1]})
            .attr('r', '3px')
            .attr('fill', '#FFF')
            .attr('stroke', '#FFF')
            .attr('id', function(d) { return d.Name })
            .attr('class', 'res')
            .on("mouseover", reservoirMouseover)
            .on("mouseout", reservoirMouseout);
            
        });
    });
}

var tooltip = d3.select("body")
		      .append("div")
    		  .attr("class", "tooltip")
    		  .style("opacity", 1)
              .style("border-radius", "8px");

function makeTooltipHTML(d) {
    var name = d.LakeName + ' (' + d.Name + ')';
    var html = "<p><strong>" + name + "</strong></p>"
    return html;
}
            
function reservoirMouseover(d) {
   tooltip.transition().duration(200).style("opacity", 0.9);
    tooltip.html(makeTooltipHTML(d)) 
            .style("left", (d3.event.pageX) + "px")
            .style("top", (d3.event.pageY) - 30 + "px")
            .transition().duration(500)
            .style("opacity", 1)
            .style("pointer-events", "auto");
    
    $("#chart-" + d.Name + " circle").attr("style", "fill: orange;");
    $("#chart-" + d.Name + " path").attr("style", "fill: orange;");
    $("#" + d.Name).attr("style", "fill: orange; stroke: orange;");
} 

function reservoirMouseout(d) {
    tooltip.transition().duration(500)
            .style("opacity", 0)
            .style("pointer-events", "none");
    
    $("#chart-" + d.Name + " circle").attr("style", "fill: #0D7AC4;");
    $("#chart-" + d.Name + " path").attr("style", "fill: #0D7AC4;");
    $("#" + d.Name).attr("style", "fill: #FFF; stroke: #FFF;");
}

///////////////////////////////////////////////////////////////////////////////
// LINE CHARTS ////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////

function defaultLineChartConfig() {
    return {
        resNames: ["SHA"],
        resColors: ["#0D7AC4"],
        beginDate: "January 2003",
        endDate: "December 2016",
        pauseDate: "June 2008",
        stopDate: "December 2016"
    }
}

function makeLineChart(containerDivID, dataFile, config, callback) {
    
    var resNames = config.resNames,
        resColors = config.resColors,
        beginDate = config.beginDate,
        endDate = config.endDate,
        pauseDate = config.pauseDate,
        stopDate = config.stopDate;
    
    var margin = {top: 45, right: 60, bottom: 75, left: 80};
    
    var width = 500, height = 200;
    var svg = d3.select(containerDivID)
                .append('svg')
                    .attr("width", width + margin.left + margin.right)
                    .attr("height", height + margin.top + margin.bottom)
                    .attr("id", "line-graph")
                .append("g")
                    .attr("transform", 
                    "translate(" + margin.left + "," + margin.top + ")");
    
    var x = d3.time.scale().rangeRound([0, width]);
    var y = d3.scale.linear().rangeRound([height, 0]);
    
    var xAxis = d3.svg.axis().scale(x)
    .orient("bottom").tickSize(8).ticks(d3.timeYear);
    
    svg.append("text")             
      .attr("transform",
            "translate(" + (width/2) + " ," + 
                           (height + 55) + ")")
      .style("text-anchor", "middle")
      .attr("class", "label")
      .style("font-size", 18)
      .text("Date");

    var yAxis = d3.svg.axis().scale(y)
    .orient("left").ticks(4);
    
    svg.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y" , 0 - margin.left + 15)
      .attr("x" ,0 - (height / 2))
      .attr("dy", "1em")
      .style("text-anchor", "middle")
      .attr("class", "label")
      .style("font-size", 18)
      .text("Percent Full");
    
    var parseDate = d3.time.format("%B %Y").parse
    
    d3.json(dataFile, function(err, data) {
        if (err) return console.error(err);
        for (var i = data.length - 1; i >= 0; i--) {
            var dataDate = parseDate(data[i]["date"]);
            if (dataDate < parseDate(beginDate) || dataDate > parseDate(endDate)) {
                data.splice(i, 1);
            }
        }
        x.domain([parseDate(beginDate), parseDate(endDate)]);
        y.domain([0, 100]);
        
        var pauseDateXCoord = x(parseDate(pauseDate));
        var stopDateXCoord = x(parseDate(stopDate));
        
        var totalLength;
        for (var i = 0; i < resNames.length; i++) {
            var resName = resNames[i];
            var resColor = resColors[i];
            var line = d3.svg.line()
                .x(function(d) { return x(parseDate(d["date"])) })
                .y(function(d) { return y(d[resName][0]["percent"])});
            var path = svg.append("path").attr("class", "line")
                .attr("fill", "none")
                .attr("stroke", resColor)
                .attr("stroke-width", 3)
                .attr("d", line(data));
        }
        
        var curtain = svg.append("rect")
            .attr("fill", "#FFF")
            .attr("stroke", "none")
            .attr("width", width + margin.right)
            .attr("height", height)
            .attr("x", 0);
        
        svg.append("g").attr("class", "x axis").attr("transform", "translate(0," + height + ")").call(xAxis);
        
        svg.append("g").attr("class", "y axis").call(yAxis);
        
        var legend = svg.append("rect")
            .attr("width", margin.right)
            .attr("height", resNames.length * 17 + 5)
            .attr("fill", "#FFF")
            .attr("x", width - 10)
            .attr("y", (height - resNames.length * 17 + 5) / 2);
        
        for (var i = 0; i < resNames.length; i++) {
            var square = svg.append("rect")
                .attr("width", 12)
                .attr("height", 12)
                .attr("fill", resColors[i])
                .attr("x", width)
                .attr("y", (height - resNames.length * 17 + 5) / 2 + i * 17 + 5);
            var label = svg.append("text")
                .text(resNames[i])
                .attr("x", width + 15)
                .attr("y", (height - resNames.length * 17 + 5) / 2 + i * 17 + 15)
                .attr("font-size", 12)
                .attr("class", "label")
        }
        
        callback({"curtain": curtain, "stopDateXCoord": stopDateXCoord, "pauseDateXCoord": pauseDateXCoord});
        
    });
    
}

///////////////////////////////////////////////////////////////////////////////
// FINAL VISUALIZATION ////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////

function makePieCharts(containerId) {
    var containerDiv = $(containerId);
    
    // TEMPORARY
    var tempResNames = ["ORO", "CLE", "INV", "FOL", "HID", "DNP", "BUC", "ISB", "SHA"];
    var arc = d3.svg.arc().outerRadius(25)
                  .innerRadius(0);
        var chartNum = 0;
        for (var key in tempResNames) {
            var chartDiv = $("<div class='chart' id='chart-div-" + chartNum + "'></div>");
            containerDiv.append(chartDiv);
            console.log(containerDiv);
            resNames.push(key);
            var label = $("<h2 class='res-name' id='label-" + key + "'>" + key + "</h2>");
            chartDiv.append(label);
            
            var chartID = "pie-chart-" + key;

            
            var pie = d3.layout.pie().value(function(d) { return 67; });
            
            var svg = d3.select("#chart-div-" + chartNum)
            .append("svg")
            .attr("id", chartID)
            .attr("width", 70)
            .attr("height", 70).append("g").attr("transform", "translate(35, 35)");
            
            var g = d3.selectAll("arc").data(pie).enter().append("g").attr("class", "arc");
            
            g.append("path").attr("d", arc)
                .style("fill", function(d) { return "orange";})
                .each(function(d) { this._current = d; });
            
            var percentLabel = $("<h3 id='pie-label" + chartNum + "'>67%</h3>");
            chartDiv.append(percentLabel);

            chartNum++;
        }
}

function makeFinalViz() {
    makeMap("#final-map");
    makePieCharts("#final-pie");
    makePDSISlider("final-pdsi", "final-pdsi-text", "PDSI", "final-pdsi-slider", 0);
    var thresholdSlider = $("<input type='range' min='10' max='50' value='30' step='10' class='slider' id='final-threshold-slider'>");
    $("#final-threshold").append($("<h2>Threshold</h2>"));
    $("#final-threshold").append(thresholdSlider);
    $("#final-threshold").append($("<div class='slider-labels'><p id='label-10'>10%</p><p id='label-20'>20%</p><p id='label-30'>30%</p><p id='label-40'>40%</p><p id='label-50'>50%</p></div>"));
    
}

///////////////////////////////////////////////////////////////////////////////
// UTILITY FUNCTIONS //////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////

function makeFillGauge(containerId, initialValue, customConfig) {
    var config;
    if (customConfig) {
        config = customConfig;
    } else {
        config = liquidFillGaugeDefaultSettings();
        config.circleThickness = 0.05;
        config.circleColor = "#0D7AC4";
        config.textColor = "#000";
        config.waveTextColor = "#000";
        config.waveColor = "#0D7AC4";
        config.textVertPosition = 0.8;
        config.waveAnimateTime = 2000;
        config.waveRiseTime = 1500;
        config.waveHeight = 0.05;
        config.waveAnimate = true;
        config.waveRise = false;
        config.waveHeightScaling = false;
        config.waveOffset = 0.25;
        config.textSize = 0.9;
        config.waveCount = 2;
        config.valueCountUp = false;
    }
    return loadLiquidFillGauge(containerId, initialValue, config);
}

