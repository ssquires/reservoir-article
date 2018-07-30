var waterBuckets = false;

$(document).ready(function() {
    makePDSIGraphic("PDSI-viz");
    makeHistoricalReservoirViz();
    makeReservoirFillGraphic();
    createMontagueViz();
    makeBuchananChart();
    makePDSISlider("dependency-slider-viz", "dependency-label", "PDSI", "dependency-slider", 3, true, "pdsi-indicator");
    makeFillGaugeForPDSISlider();
    makeMultipleFillGauge();
    
    makeConnectivityMap("#connected-res-viz", ["INV", "SHA", "FOL","ORO","DNP","ISB","HID"], 
            {"SHA": ["ORO", "INV"],
             "ORO": ["INV"],
             "INV": ["FOL"],
             "FOL": ["DNP"],
             "HID": ["DNP"],
             "ISB": ["DNP"]
              },connectedResMouseover,connectedResMouseout, "4.1");
    handleScrolling();
    /* Every time the window is scrolled ... */
    $(window).scroll(handleScrolling);
});


function handleScrolling() {
    var w_pos = $(window).scrollTop();
    var top = $('#montague-viz').position().top;
    var pos_1_2 = $('#montague-viz').position().top + $('#montague-viz').outerHeight() / 7;
    var pos_1_3 = $('#montague-viz').position().top + 2 * $('#montague-viz').outerHeight() / 7;
    var pos_1_4 = $('#montague-viz').position().top + 3 * $('#montague-viz').outerHeight() / 7;
    var pos_1_5 = $('#montague-viz').position().top + 4 * $('#montague-viz').outerHeight() / 7;
    var pos_1_6 = $('#montague-viz').position().top + 5 * $('#montague-viz').outerHeight() / 7;
    var pos_1_7 = $('#montague-viz').position().top + 6 * $('#montague-viz').outerHeight() / 7;
    var bottom = $('#montague-viz').position().top + $('#montague-viz').outerHeight();
    
    var pos_last_frame = $('#montague-viz').position().top + 2 * $('#montague-viz').outerHeight() / 3;
    
    var viz_pos = $('#slide1-graphic').position().top;
    var pos_2 = $('#slide-1-2').position().top;
    var pos_3 = $('#slide-1-3').position().top;
    var pos_4 = $('#slide-1-4').position().top;
    var pos_5 = $('#slide-1-5').position().top;
    var pos_6 = $('#slide-1-6').position().top;
    
    if (w_pos < top) {
        $('#slide1-graphic').removeClass('fixed');
        $('#slide1-graphic').removeClass('absolute-bottom');
        $('#slide1-graphic').addClass('absolute');
    } else if (w_pos < pos_last_frame) {
        $('#slide1-graphic').removeClass('absolute');
        $('#slide1-graphic').removeClass('absolute-bottom');
        $('#slide1-graphic').addClass('fixed');
    } else {
        $('#slide1-graphic').removeClass('absolute');
        $('#slide1-graphic').removeClass('fixed');
        $('#slide1-graphic').addClass('absolute-bottom');
    }
    
    var visible_border = w_pos - top + $( window ).height() * 0.2;
    
    if (pos_5 < visible_border) {
        updateWaterBuckets(16, 25, 10, 20);
    } else if (pos_4 < visible_border) {
        updateWaterBuckets(240, 25, 10, 20);
    } else if (pos_4 < visible_border) {
        console.log("4");
        updateWaterBuckets(800, 25, 10, 20);
    } else if (pos_3 < visible_border) {
        updateWaterBuckets(800, 25, 10, 20);
    } else if (pos_2 < visible_border) {
        updateWaterBuckets(2200, 25, 10, 20);
    } else {
        updateWaterBuckets(5000, 25, 10, 10);
    }
    
    var stat_top = $('#statistical-scrolly').position().top;
    var pos_stat_2 = $("#stat-2").position().top;
    var pos_stat_3 = $("#stat-3").position().top;
    
    if (w_pos < stat_top) {
        $("#connected-res-viz").removeClass('fixed');
        $("#connected-res-viz").removeClass('absolute-160');
        $("#connected-res-viz").addClass('absolute');
    } else if (w_pos < stat_top + $('#statistical-scrolly').height() - $(window).height()) {
        $("#connected-res-viz").removeClass('absolute');
        $("#connected-res-viz").removeClass('absolute-160');
        $("#connected-res-viz").addClass('fixed');
    } else {
        $("#connected-res-viz").removeClass('fixed');
        $("#connected-res-viz").addClass('absolute-160');
    }
    
    var stat_visible_border = w_pos - stat_top + $( window ).height() * 0.2;
    if (pos_stat_3 < stat_visible_border) {
        clusterRed();
    } else if (pos_stat_2 < stat_visible_border) {
        oneResRed();
    } else {
        noneRed();
    }

}

function hideSlides() {
    $('#slide-1').css('opacity', 0);
    $('#slide-1-2').css('opacity', 0);
    $('#slide-1-3').css('opacity', 0);
    $('#slide-1-4').css('opacity', 0);
    $('#slide-1-5').css('opacity', 0);
    $('#slide-1-6').css('opacity', 0);
}

function showSlide(s) {
    $('#slide-' + s).css('opacity', 1);
}

function createMontagueViz() {
    if (!waterBuckets) {
        waterBuckets = true;
        makeWaterBuckets("#slide1-graphic", 25, 10, 20, 600, 300, 50);
    }
}

function makeHistoricalReservoirViz() {
    var vizContainer = $("<div id='vizContainer'></div>");
    var gaugesDiv = $("<div id='gauges'></div>");
    var mapDiv = $("<div id='map' class='map'></div>");
    var sliderDiv = $("<div id='slider'></div>");
    var sliderInnerDiv = $("<div id='slider-inner'></div>");
    var clickHereDiv = $("<div id='click-here-div'></div>");
    clickHereDiv.append($("<text class='label'>Drag slider</text>"));
    clickHereDiv.append($("<img src='down_arrow.png' height='100%'>"));
    sliderInnerDiv.css("position", "relative");
    sliderDiv.append(sliderInnerDiv);
    var startLabel = $("<p id='start-label'>2003</p>");
    var endLabel = $("<p id='end-label'>2016</p>");
    sliderDiv.append(startLabel);
    sliderDiv.append(endLabel);
    $("#reservoirs-matter-viz").append(vizContainer);
    vizContainer.append(mapDiv);
    vizContainer.append(gaugesDiv);
    $("#reservoirs-matter-viz").append(sliderDiv);
    $("#reservoirs-matter-viz").append(clickHereDiv);
    makeFillGauges("historical_data.json", 70, 70, 12, gaugesDiv, "#map");
    makeSlider("historical_data.json", sliderInnerDiv, "slider-inner", true);
}

var stopXCoord;
var pauseXCoord;
var curtain;

function makeBuchananChart() {
    var config = {
        resNames: ["BUC"],
        resColors: ["#0DC1F2"],
        beginDate: "January 2003",
        endDate: "November 2016",
        pauseDate: "November 2012",
        stopDate: "November 2016"
    };
    makeLineChart("#seasonality-graphic", "historical_data.json", config, function (progress) { curtain = progress["curtain"];
    stopXCoord = progress["stopDateXCoord"]; pauseXCoord = progress["pauseDateXCoord"]; 
    curtain.transition().duration(3000).ease("linear").attr("x", stopXCoord);});
}

function oneResRed() {
    if (statVizReady) {
        d3.select("#INV-stat").transition().duration(500).style("fill", "red").style("stroke", "red");
    }
}

function clusterRed() {
    if (statVizReady) {
        $("#INV-stat").attr("style", "fill: red;");
        $("#FOL-stat").attr("style", "fill: red;");
        $("#SHA-stat").attr("style", "fill: red;");
        $("#ORO-stat").attr("style", "fill: red;");

        d3.select("#ORO-INV").transition().duration(500).style("stroke", "red");
        d3.select("#INV-FOL").transition().duration(500).style("stroke", "red");
        d3.select("#SHA-INV").transition().duration(500).style("stroke", "red");
    }
}

function noneRed() {
    if (statVizReady) {
       $("#INV-stat").attr("style", "fill: white;");
        $("#FOL-stat").attr("style", "fill: white;");
        $("#SHA-stat").attr("style", "fill: white;");
        $("#ORO-stat").attr("style", "fill: white;");

        d3.select("#ORO-INV").transition().duration(500).style("stroke", "white");
        d3.select("#INV-FOL").transition().duration(500).style("stroke", "white");
        d3.select("#SHA-INV").transition().duration(500).style("stroke", "white");
    }
}