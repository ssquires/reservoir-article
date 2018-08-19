var waterBuckets = false;

$(document).ready(function() {
    // fix viewport on mobile
    adjustViewport();
    var viewportHeight = $(".title").outerHeight();
    $(".title").css({height: viewportHeight});
    $(".mini-title").css({height: viewportHeight * .67});
    
    makePDSIGraphic("PDSI-viz");
    makeHistoricalReservoirViz();
    makeReservoirFillGraphic();
    createMontagueViz();
    makeBuchananChart();
    makePDSISlider("dependency-slider-viz", "dependency-label", "PDSI", "dependency-slider", 3, true, "pdsi-indicator");
    makeFillGaugeForPDSISlider();
    makeMultipleFillGauge();
    
    makeConnectivityMap("#stat-wrapper", ["INV", "SHA", "FOL","ORO","DNP","ISB","HID"], 
            {"SHA": ["ORO", "INV"],
             "ORO": ["INV"],
             "INV": ["FOL"],
             "FOL": ["DNP"],
             "HID": ["DNP"],
             "ISB": ["DNP"]
              },connectedResMouseover,connectedResMouseout, "4.1");
    /* Every time the window is scrolled ... */
    $(window).scroll(handleScrolling);
});

$( window ).resize(function() {
    resizeColorCodeDivs();
    adjustViewport();
});

function adjustViewport() {
    console.log("adjusting viewport");
    var viewportHeight = $("window").outerHeight();
    $(".title").css({height: viewportHeight});
    $(".mini-title").css({height: viewportHeight * .67});
}


function handleScrolling() {
    scrollMontague();
    scrollBuchanan();
    scrollStats();
}
var state = "abs";

function scrollMontague() {
    var w_pos = $(window).scrollTop();
    var slide1_pos = $('#slide1-graphic').position().top;
    var pos_2 = $('#slide-1-2').position().top;
    var pos_3 = $('#slide-1-3').position().top;
    var pos_4 = $('#slide-1-4').position().top;
    var pos_5 = $('#slide-1-5').position().top;
    var pos_6 = $('#slide-1-6').position().top;
    

    
    // debug
    $("#intro-paragraph").text("Scroll top is: " + w_pos + ".\n Window outer height is: " + $(window).outerHeight());
    
    var viz_pos = $("#montague-div").position().top + slide1_pos - 0.4 * $(".title").outerHeight();
    var bottom_pos = $("#montague-div").position().top + $("#montague-div").outerHeight(true) - $(window).height();
    if (w_pos <= viz_pos && state != "absb") {
//        $('#slide1-graphic').removeClass('fixed');
//        $('#slide1-graphic').removeClass('absolute-bottom');
//        $('#slide1-graphic').addClass('absolute');
        $("#slide1-graphic").css({position: "absolute", top: .4 * $(window).height(), bottom: "auto", width: "100%"});
        state = "abs";
    } else if (w_pos < bottom_pos) {
//        $('#slide1-graphic').removeClass('absolute');
//        $('#slide1-graphic').removeClass('absolute-bottom');
//        $('#slide1-graphic').addClass('fixed');
        $("#slide1-graphic").css({position: "fixed", top: .4 * $(window).height(), bottom: "auto", width: "50%"});
        state = "fixed";
    } else if (state != "abs"){
//        $('#slide1-graphic').removeClass('fixed');
//        $('#slide1-graphic').removeClass('absolute');
//        $('#slide1-graphic').addClass('absolute-bottom');
        $("#slide1-graphic").css({position: "absolute", bottom: 0, top: "auto", width: "100%"});
        state = "absb";
    }
    
    var visible_border = w_pos - $("#montague-div").position().top + $( window ).height() * 0.2;
    if (pos_5 < visible_border) {
        updateWaterBuckets(16, 25, 10, 20);
    } else if (pos_4 < visible_border) {
        updateWaterBuckets(240, 25, 10, 20);
    } else if (pos_4 < visible_border) {
        updateWaterBuckets(800, 25, 10, 20);
    } else if (pos_3 < visible_border) {
        updateWaterBuckets(800, 25, 10, 20);
    } else if (pos_2 < visible_border) {
        updateWaterBuckets(2200, 25, 10, 20);
    } else {
        updateWaterBuckets(5000, 25, 10, 10);
    }
 
}

function scrollBuchanan() {
    var w_pos = $(window).scrollTop();
    var season_top = $('#seasonality-scrolly').position().top;
    var pos_season_2 = $('#buch-2').position().top;
    var season_bottom = $("#seasonality-scrolly").position().top + $("#seasonality-scrolly").outerHeight(true) - $(window).height();
    
    if (w_pos < season_top) {
        $("#seasonality-graphic").removeClass('fixed');
        $("#seasonality-graphic").removeClass('absolute-bottom');
        $("#seasonality-graphic").addClass('absolute');
    } else if (w_pos < season_bottom) {
        $("#seasonality-graphic").removeClass('absolute');
        $("#seasonality-graphic").removeClass('absolute-bottom');
        $("#seasonality-graphic").addClass('fixed');
    } else {
        $("#seasonality-graphic").removeClass('fixed');
         $("#seasonality-graphic").removeClass('absolute');
        $("#seasonality-graphic").addClass('absolute-bottom');
    }
    
    var buchanan_border = w_pos - season_top + $( window ).height() * 0.2;
    if (pos_season_2 < buchanan_border) {
        advanceBuchananChart();
    } else {
        rewindBuchananChart();
    }
}

function scrollStats() {
    var w_pos = $(window).scrollTop();
    var stat_top = $('#statistical-scrolly').position().top;
    var pos_stat_2 = $("#stat-2").position().top;
    var pos_stat_3 = $("#stat-3").position().top;
    var stat_bottom = $("#statistical-scrolly").position().top + $("#statistical-scrolly").outerHeight(true) - $(window).height();
    
    if (w_pos < stat_top) {
        $("#connected-res-viz").removeClass('fixed');
        $("#connected-res-viz").removeClass('absolute-bottom');
        $("#connected-res-viz").addClass('absolute');
    } else if (w_pos < stat_bottom) {
        $("#connected-res-viz").removeClass('absolute');
        $("#connected-res-viz").removeClass('absolute-bottom');
        $("#connected-res-viz").addClass('fixed');
    } else {
        $("#connected-res-viz").removeClass('fixed');
        $("#connected-res-viz").removeClass('absolute');
        $("#connected-res-viz").addClass('absolute-bottom');
    }
    
    var stat_visible_border = w_pos - stat_top + $( window ).height() * 0.2;
    if (pos_stat_3 < stat_visible_border) {
        clusterRed();
    } else if (pos_stat_2 < stat_visible_border) {
        oneResRed();
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
        makeWaterBuckets("#buckets-wrapper", 25, 10, 20, 600, 300, 50);
    }
}

function makeHistoricalReservoirViz() {
    var vizContainer = $("<svg id='vizContainer' viewBox='0 0 600 450'></svg>");
    var gaugesSvg = $("<svg id='gauges' viewBox='0 0 300 375' x='300' y='0' width='300'></svg>");
    var mapSvg = $("<svg id='map' class='map' x='0' y='0' width='300'></svg>");
    var sliderDiv = $("<div id='slider'></div>");
    var sliderInnerDiv = $("<div id='slider-inner'></div>");
    var clickHereDiv = $("<div id='click-here-div'></div>");
    clickHereDiv.append($("<p>Drag slider</p>"));
    clickHereDiv.append($("<img src='down_arrow.png' height='100%'>"));
    sliderInnerDiv.css("position", "relative");
    sliderDiv.append(sliderInnerDiv);
    var startLabel = $("<p id='start-label'>2003</p>");
    var endLabel = $("<p id='end-label'>2016</p>");
    sliderDiv.append(startLabel);
    sliderDiv.append(endLabel);
    $("#reservoirs-matter-viz").append(vizContainer);
    vizContainer.append(mapSvg);
    vizContainer.append(gaugesSvg);
    $("#reservoirs-matter-viz").append(sliderDiv);
//    $("#reservoirs-matter-viz").append(clickHereDiv);
    sliderDiv.append(clickHereDiv);
    makeFillGauges("historical_data.json", 70, 70, 12, gaugesSvg, "#map");
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
    makeLineChart("#buchanan-wrapper", "historical_data.json", config, function (progress) { curtain = progress["curtain"];
    stopXCoord = progress["stopDateXCoord"]; pauseXCoord = progress["pauseDateXCoord"]; 
    curtain.transition().duration(3000).ease("linear").attr("x", pauseXCoord);});
}

function rewindBuchananChart() {
    curtain.transition().duration(1000).ease("linear").attr("x", pauseXCoord);
}

function advanceBuchananChart() {
    curtain.transition().duration(1000).ease("linear").attr("x", stopXCoord);
}

function oneResRed() {
    if ($("#INV-stat")) {
        d3.select("#INV-stat").transition().duration(500).style("fill", "red").style("stroke", "red");
    }
}

function clusterRed() {
    if ($("#ORO-INV") && $("#INV-FOL") && $("#SHA-INV")) {
        $("#INV-stat").attr("style", "fill: red;");
        $("#FOL-stat").attr("style", "fill: red;");
        $("#SHA-stat").attr("style", "fill: red;");
        $("#ORO-stat").attr("style", "fill: red;");

        d3.select("#ORO-INV").transition().duration(500).style("stroke", "red");
        d3.select("#INV-FOL").transition().duration(500).style("stroke", "red");
        d3.select("#SHA-INV").transition().duration(500).style("stroke", "red"); 
    }
}