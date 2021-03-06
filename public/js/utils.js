var historicalData;
var resNames = ["ORO", "CLE", "INV", "FOL", "HID", "DNP", "BUC", "ISB", "SHA"];
var resTranslations = {"ORO": "Lake Oroville",
                       "CLE": "Trinity Lake",
                       "INV": "Indian Valley Res.",
                       "FOL": "Folsom Lake",
                       "HID": "Hensley Lake",
                       "DNP": "Don Pedro Res.",
                       "BUC": "Eastman Lake",
                       "ISB": "Lake Isabella",
                       "SHA": "Lake Shasta"};
var arc;
var gauges = {};

// Loads geo data for California and draws both maps on the page.
function drawMaps() {
    d3.json("california.json", function(err, data) {
        makeMap("#map", "historical-map", data);
        makeMap("#stat-wrapper", "stat-map", data);
        drawReservoirs();
    });
}

// Loads geo data for reservoirs and draws them on the maps.
function drawReservoirs() {
    d3.json("reservoir_data.json", function(err, data) {
        // Draw reservoirs on historical California map
        
        placeReservoirs(data, "#historical-map", ["ORO", "CLE", "INV", "FOL", "HID", "DNP", "BUC", "ISB", "SHA"]);
        
        // Draw reservoirs + connections on connectivity California map
        placeReservoirs(data, "#stat-map", 
                        ["DNP", "FOL", "HID", "INV", "ISB", "ORO", "SHA"],
                        {"SHA": ["ORO", "INV"], 
                         "INV": ["ORO", "FOL"], 
                         "FOL": ["DNP"], 
                         "DNP": ["HID", "ISB"]}, "-stat");
    });
    
}

var stopXCoord;
var pauseXCoord;
var curtain;


// Loads historical data for reservoir levels and makes relevant graphics.
function loadHistoricalData() {
    d3.json("historical_data.json", function(err, data) {
        // Make fill guages for reservoir history viz
        makeFillGauges(data, 70, 70, 12, "#gauges");
        
        // Make slider for reservoir history viz
        makeSlider(data, "#slider-inner-div", "slider-inner");
        
        // Make color coded slider overlays for reservoir history viz
        makeColorCodeDivs(data, "#slider-inner-div");
        
        // Make line chart for Buchanan reservoir
        var config = {
            resNames: ["BUC"],
            resColors: ["#0DC1F2"],
            beginDate: "January 2003",
            endDate: "November 2016",
            pauseDate: "November 2012",
            stopDate: "November 2016"
        };
        
        makeLineChart("#buchanan-wrapper", data, config, 
            function (progress) { 
                curtain = progress["curtain"];
                stopXCoord = progress["stopDateXCoord"]; 
                pauseXCoord = progress["pauseDateXCoord"]; curtain.transition().duration(3000).ease("linear").attr("x", pauseXCoord);
        });
    });
}

function rewindBuchananChart() {
    var curtain = d3.select("#curtain");
    if (curtain) {
        curtain.transition().duration(1000).ease("linear").attr("x", pauseXCoord);
    }
}

function advanceBuchananChart() {
    var curtain = d3.select("#curtain");
    if (curtain) {
        curtain.transition().duration(1000).ease("linear").attr("x", stopXCoord);
    }
}


function makeWaterBuckets(containerDivID, countX, countY, amountPerBucket, width, height, marginBottom) {
    // SVG Canvas
    var svg = d3.select(containerDivID).append("svg")
                                     .attr("viewBox", "0 0 " + width + " " + height)
                                     .attr("id", "buckets");
    
    // Calculations
    var bucketSpace = Math.min(width / countX, height / countY);
    var margin = bucketSpace / 8;
    var bucketSize = bucketSpace - 2 * margin;
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
        $("#bucket" + b).attr("fill", "#CCC");
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
    if (textId != '') {
        $("#" + id).append(PDSIText(textId, text));
    }
    
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

function makePDSIGraphic(containerId) {
    var slider = $("<div class='slider pdsi-slider'></div>");
    $("#" + containerId).append(slider);
    $("#" + containerId).append(PDSILabels());
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
    
     var d = $("<svg class='gaugeSVG' id='dependency-gauge' width='100' height='100' style='width: 100px; height: 100px;'></svg>");
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

function makeReservoirFillGraphic() {
//    var gaugeSVG = $("<svg class='gaugeSVG' id='res-gauge' width='100' height='100'></svg>");
//    $("#reservoir-filling-div").append(gaugeSVG);
    
    var config = liquidFillGaugeDefaultSettings();
    config.circleThickness = 0.05;
    config.circleColor = "#0D7AC4";
    config.textColor = "#0000";
    config.waveTextColor = "#0000";
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
    
    var resGauge = makeFillGauge("reservoir-filling", 50, config);
    var lineColor = "orange";
    setTimeout(function updateResControl() {
        $("#input-line-1").css("stroke-dashoffset", 0);
        $("#input-line-2").css("stroke-dashoffset", 0);
        $("#input-line-3").css("stroke-dashoffset", 0);
        resGauge.update(80);
        d3.select("#input-line-1").transition().duration(500).style("stroke", lineColor);
        d3.select("#input-line-2").transition().duration(500).style("stroke", lineColor);
        d3.select("#input-line-3").transition().duration(500).style("stroke", lineColor);
        $(".input-line").animate({strokeDashoffset: "-100",
                                  stroke: lineColor}, 1500, function() {
            d3.select("#input-line-1").transition().duration(500).style("stroke", "black");
            d3.select("#input-line-2").transition().duration(500).style("stroke", "black");
            d3.select("#input-line-3").transition().duration(500).style("stroke", "black");
        });
        
        setTimeout(function() {
            $("#output-line-1").css("stroke-dashoffset", 0);
            $("#output-line-2").css("stroke-dashoffset", 0);
            $("#output-line-3").css("stroke-dashoffset", 0);
            resGauge.update(20);
            d3.select("#output-line-1").transition().duration(500).style("stroke", lineColor);
            d3.select("#output-line-2").transition().duration(500).style("stroke", lineColor);
            d3.select("#output-line-3").transition().duration(500).style("stroke", lineColor);
            $(".output-line").animate({strokeDashoffset: "-100",
                                  stroke: lineColor}, 1500, function() {
                d3.select("#output-line-1").transition().duration(500).style("stroke", "black");
                d3.select("#output-line-2").transition().duration(500).style("stroke", "black");
                d3.select("#output-line-3").transition().duration(500).style("stroke", "black");
            });
            setTimeout(updateResControl, 3000);
        }, 3000);
        
    }, 1000);
    
    
}

function makeMultipleFillGauge() {
    
    
    var gaugeA = makeFillGauge("connected-res-a", 10);
    var gaugeB = makeFillGauge("connected-res-b", 37);
    var gaugeC = makeFillGauge("connected-res-c", 22);
    
    var waterColor = "orange";
    setTimeout(function updateFillGauges() {
        $("#connect-line-1").css("stroke-dashoffset", "0");
        $("#connect-line-2").css("stroke-dashoffset", "0");
        $("#connect-line-3").css("stroke-dashoffset", "0");
        $("#output-line-b").css("stroke-dashoffset", "0");
        $("#output-line-c").css("stroke-dashoffset", "0");
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
                d3.select("#output-line-b").transition().duration(500).style("stroke", waterColor);
                d3.select("#output-line-c").transition().duration(500).style("stroke", waterColor);
                $("#output-line-b").animate({strokeDashoffset: "-100"}, 1500, function() {
                    d3.select("#output-line-b").transition().duration(500).style("stroke", "black");
                });
                $("#output-line-c").animate({strokeDashoffset: "-100"}, 1500, function() {
                    d3.select("#output-line-c").transition().duration(500).style("stroke", "black");
                });
                setTimeout(updateFillGauges, 3000);
            }, 3000);
        });
        
        
        
    }, 1000)
    
}

function makeFillGauges(resData, width, height, maxCharts, containerDivID) {
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

            var xCoord = (chartNum % 3) * 100;
            var yCoord = 25;
            if (chartNum > 2 && chartNum < 6) {
                yCoord = 150;
            } else if (chartNum >= 6) {
                yCoord = 275;
            }
            var chartSvg = $("<svg class='chart' viewBox='0 0 100 125' x='" + xCoord + "' y='" + yCoord + "' width='100' height='125' style='width: 90px; height: 90px; overflow: visible;'></svg>");
            $(containerDivID).append(chartSvg);
            var label = $("<svg style='overflow: visible; width: 90px;'><text text-anchor='middle' x='45' y='20' height='100' fill='black' class='res-name' id='label-" + key + "'>" + resTranslations[key] + "</text></svg>");
            
            
            var chartID = "chart-" + key;
            // Create a new div for the chart
            var d = $("<svg class='chartSVG' id='" + chartID + "' y='25'></svg>");
            chartSvg.append(d);
            chartSvg.append(label);
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
}

function makeSlider(resData, containerDivID, sliderId) {
    var dateLabel = $("<h3 id='date'>January 2003</h3>");
    // Create date range slider
    var sliderMax = resData.length - 1;
    var s = $("<input id='slidey' type='range' min='0' max='" + sliderMax + "' value='0' class='slider' oninput='updateData(this.value);$(\"#click-here-div\").css(\"opacity\", 0);' onchange='updateData(this.value);' list='drought-markers'>");
    var list = $("<datalist id='drought-markers'><option>67</option><option>139</option></datalist>")
    $("#slider").append(dateLabel);
    $(containerDivID).append(s);
    $(containerDivID).append(list);
}


var numSliderDivs = 0;

function makeColorCodeDivs(data, sliderId) {
    var slider = $(sliderId);
    slider.css("position", "relative");
    var sliderWidth = slider.width();
    var sliderHeight = slider.height();
    
    numSliderDivs = data.length;
    var divWidth = sliderWidth / data.length;
    var divX = 0;
    var n = 1;
    for (var dataPoint of data) {
        var date = dataPoint.date;
        var pdsi = dataPoint.PDSI;
        var color = getPDSIColor(pdsi);
        var div = $("<div id='slider-div-" + n + "'></div>");
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
        n++;
    }
}

function resizeColorCodeDivs() {
    var sliderWidth = $("#slider-inner-div").width();
    var divWidth = sliderWidth / numSliderDivs;
    var divX = 0;
    for (var i = 1; i <= numSliderDivs; i++) {
        var currDiv = $("#slider-div-" + i);
        currDiv.css("left", divX);
        currDiv.css("width", divWidth);
        divX += divWidth;
    }
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


var width = 300, height = 300;
// Calculated Scale for Map Overlay
var scale = 1215;
var projection = d3.geo.mercator()
                .center([-119.3, 37.6])
                .scale(scale)
                .translate([width/2, height/2]);

///////////////////////////////////////////////////////////////////////////////
//////////////////////// DATA READING AND MAP DRAWING /////////////////////////
///////////////////////////////////////////////////////////////////////////////

function makeMap(containerDivID, innerMapID, data) {

        
        // SVG Canvas
        var svg = d3.select(containerDivID).append('svg').attr('viewBox', '-10 -15 ' + width + ' ' + height).attr('id', innerMapID);
                                                       
        

        // Map
        

        // Path Generator to draw regions on map
        var path = d3.geo.path().projection(projection);

        // Get features from JSON
        var features = data;
        // Create SVG paths to draw zip code boundaries
        svg.selectAll('.ca')
            .data(features)
            .enter().append('path')
            .attr('d', path)
            .attr("stroke", "#0D7AC4")
            .attr("fill", "#0D7AC4")
            .attr("stroke-width", "1");
}

function placeReservoirs(data, mapId, validResList, connections, idAddOn) {
    if (!idAddOn) idAddOn = "";
    
    var resInfo = data.filter(function(resObj) {
        return validResList.includes(resObj.Name);
    });
    var resCoords = {};
    for (var res of resInfo) {
        resCoords[res.Name] = projection([res.Longitude, res.Latitude]);
    }
    
    if (connections) {
        for (var key in connections) {
            var resx = resCoords[key][0];
            var resy = resCoords[key][1];
            for (var connectedRes of connections[key]) {
                var res2x = resCoords[connectedRes][0];
                var res2y = resCoords[connectedRes][1];
                var lineId = key + "-" + connectedRes;
                if (key != "DNP") {
                    d3.select(mapId).append("line")
                        .style("stroke-width", 3)
                        .style("stroke", "white")
                        .attr("x1", resx)
                        .attr("y1", resy)
                        .attr("x2", res2x)
                        .attr("y2", res2y)
                        .attr("id", lineId)
                        .attr("class", key + " " + connectedRes);
                } else {
                    if (connectedRes == "HID") {
                        d3.select(mapId).append('path')
                        .attr('d','M'+resx+' '+resy+' C 130 150, 130 160, '+res2x+' '+res2y)
                        .attr('stroke-width', 3)
                        .attr('stroke',"white")
                        .attr('fill','transparent')
                        .attr("id", lineId)
                        .attr("class", key + " " + connectedRes);
                    } else {
                        d3.select(mapId).append('path')
                        .attr('d','M'+resx+' '+resy+' C 110 170, 130 200, '+res2x+' '+res2y)
                        .attr('stroke-width', 3)
                        .attr('stroke',"white")
                        .attr('fill', 'transparent')
                        .attr("id", lineId)
                        .attr("class", key + " " + connectedRes);
                    }
                }
            }
            
        }
        
        // Make labels for external inputs
        var externalInputs = ["Drought Index (PDSI),", 
                              "Agricultural Demand,",
                              "Snowpack, etc."];
        for (var i = 0; i < externalInputs.length; i++) {
            d3.select(mapId).append("text")
                .attr("x", 178)
                .attr("y", 70 + i * 16)
                .attr("class", "res-dependencies label")
                .style("font-size", "12px")
                .text(externalInputs[i]);
        }
        
        // Make connecting lines for external inputs
        for (var res in resCoords) {
            d3.select(mapId).append("line")
                .attr("x1", 175)
                .attr("y1", 85)
                .attr("x2", resCoords[res][0])
                .attr("y2", resCoords[res][1])
                .attr("stroke", "orange")
                .attr("stroke-dasharray", "3 3")
                .attr("stroke-width", "2");
        }
        

    }
    
    d3.select(mapId).selectAll('.res')
        .data(data.filter(function(resObj) {
            return validResList.includes(resObj.Name);
        }))
        .enter().append('circle')
        .attr('cx', function (d) { return projection([d.Longitude, d.Latitude])[0]})
        .attr('cy', function (d) { return projection([d.Longitude, d.Latitude])[1]})
        .attr('r', '3px')
        .attr('fill', '#FFF')
        .attr('stroke', 'none')
        .attr('id', function(d) {
            if (idAddOn) {
            return d.Name + idAddOn;
            }
            return d.Name;})
        .attr('class', 'res' + idAddOn)
        .on("mouseover", reservoirMouseover)
        .on("mouseout", reservoirMouseout);
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


// Show reservoir name on mouseover
function connectedResMouseover(d) {
    tooltip.transition().duration(100).style("opacity", 0.9);
    tooltip.html(makeTooltipHTML(d))  
            .style("left", (d3.event.pageX) + "px")
            .style("top", (d3.event.pageY) - 30 + "px")
            .style("color","white")
            .style("background-color", "rgba(0, 0, 0, 0.5)")
            .style("pointer-events", "auto");
}

function connectedResMouseout(d) {
    tooltip.transition().duration(100).style("opacity", 0).style("pointer-events", "none");
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

function makeLineChart(containerDivID, data, config, callback) {
    
    var resNames = config.resNames,
        resColors = config.resColors,
        beginDate = config.beginDate,
        endDate = config.endDate,
        pauseDate = config.pauseDate,
        stopDate = config.stopDate;
    
    var margin = {top: 45, right: 60, bottom: 75, left: 80};
    
    var width = 500, height = 200;
    var totalWidth = width + margin.left + margin.right;
    var totalHeight = height + margin.top + margin.bottom;
    var svg = d3.select(containerDivID)
                .append('svg')
                    .attr("viewBox", "0 0 " + totalWidth + " " + totalHeight)
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
      .style("font-size", 20)
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
      .style("font-size", 20)
      .text("Percent Full");
    
    var parseDate = d3.time.format("%B %Y").parse
    

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
            .attr("stroke-width", 4)
            .attr("d", line(data));
    }

    var curtain = svg.append("rect")
        .attr("fill", "#F5F5F5")
        .attr("stroke", "none")
        .attr("width", width + margin.right)
        .attr("height", height)
        .attr("x", 0)
        .attr("id", "curtain");

    svg.append("g").attr("class", "x axis").attr("transform", "translate(0," + height + ")").call(xAxis);

    svg.append("g").attr("class", "y axis").call(yAxis);

    var legend = svg.append("rect")
        .attr("width", margin.right)
        .attr("height", resNames.length * 17 + 5)
        .attr("fill", "#F5F5F5")
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

