var waterBuckets = false;

$(document).ready(function() {
    // fix viewport on mobile
    adjustViewport();
    var viewportHeight = $(".title").outerHeight();
    $(".title").css({height: viewportHeight});
    $(".mini-title").css({height: viewportHeight * .67});
    $(".lazy").Lazy();
    drawMaps();
    loadHistoricalData();
    makePDSIGraphic("PDSI-viz");
    makeHistoricalReservoirViz();
    makeReservoirFillGraphic();
    createMontagueViz();
    makePDSISlider("dependency-slider-viz", "dependency-label", "PDSI", "dependency-slider", 3, true, "pdsi-indicator");
    makeFillGaugeForPDSISlider();
    makeMultipleFillGauge();

    /* Every time the window is scrolled ... */
    $(window).scroll(handleScrolling);
});

$( window ).resize(function() {
    resizeColorCodeDivs();
    adjustViewport();
});

function adjustViewport() {
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
    
    var viz_pos = $("#montague-div").position().top + slide1_pos - 0.4 * $(window).height();
    var bottom_pos = $("#montague-div").position().top + $("#montague-div").outerHeight(true) - $(window).height();
    var vizWidth = "50%";
    var leftMargin = "25%";
    var vizWidthFixed = "50%";
    var leftMarginFixed = "25%";
    if ($(window).width() <= 800) {
        vizWidth = "80%";
        leftMargin = "10%";
    } 
    
    $("#buckets-wrapper").css({height: .4 * $(window).height(), paddingBottom: .2 * $(window).height()});
    if (w_pos <= viz_pos && state != "absb") {
        $("#slide1-graphic").css({position: "absolute", top: .4 * $(window).height(), bottom: "auto", width: vizWidth, left: leftMargin});
        state = "abs";
    } else if (w_pos < bottom_pos) {
        console.log(vizWidth);
        $("#slide1-graphic").css({position: "fixed", top: .4 * $(window).height(), bottom: "auto", width: vizWidth, left: leftMargin});
        state = "fixed";
    } else if (state != "abs"){
        $("#slide1-graphic").css({position: "absolute", bottom: 0, top: "auto", width: vizWidth, left: leftMargin});
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
    
    
    var vizWidth = "50%";
    var leftMargin = "25%";
    if ($(window).width() <= 500) {
        vizWidth = "80%";
        leftMargin = "10%";
    } else if ($(window).width() <= 800) {
        vizWidth = "65%";
        leftMargin = "17.5%";
    }
    if (w_pos < season_top) {
        $("#seasonality-graphic").css({position: "absolute", top: .4 * $(window).height(), bottom: "auto", width: vizWidth, left: leftMargin});
    } else if (w_pos < season_bottom) {
        $("#seasonality-graphic").css({position: "fixed", top: .4 * $(window).height(), bottom: "auto", width: vizWidth, left: leftMargin});
    } else {
        $("#seasonality-graphic").css({position: "absolute", bottom: 0, top: "auto", width: vizWidth, left: leftMargin});
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
    } else {
        noResRed();
    }
}

function hideSlides() {
    $('#slide-1').css('opacity', 0);
    $('#slide-1-2').css('opacity', 0);
    $('#slide-1-3').css('opacity', 0);
    $('#slide-1-4').css('opacity', 0);
    $('#slide-1-5').css('opacity', 0);
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
    var sliderInnerDiv = $("<div id='slider-inner-div'></div>");
    var clickHereDiv = $("<div id='click-here-div'></div>");
    clickHereDiv.append($("<p>Drag slider</p>"));
    clickHereDiv.append($("<img src='down_arrow.png' height='100%' class='lazy'>"));
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
//    makeFillGauges("historical_data.json", 70, 70, 12, gaugesSvg, "#map");
//    makeSlider("historical_data.json", sliderInnerDiv, "slider-inner", true);
}

function oneResRed() {
    if ($("#INV-stat")) {
        d3.select("#ORO-stat").transition().duration(200).style("fill", "rgb(255, 255, 255)");
        d3.select("#FOL-stat").transition().duration(200).style("fill", "rgb(255, 255, 255)");
        d3.select("#SHA-stat").transition().duration(200).style("fill", "rgb(255, 255, 255)");
        d3.select("#INV-stat").transition().duration(200).style("fill", "rgb(255, 0, 0)");
        
        d3.select("#INV-ORO").transition().duration(200).style("stroke", "white");
        d3.select("#INV-FOL").transition().duration(200).style("stroke", "white");
        d3.select("#SHA-INV").transition().duration(200).style("stroke", "white"); 
    }
}

function clusterRed() {
    if ($("#ORO-INV") && $("#INV-FOL") && $("#SHA-INV")) {
        $("#INV-stat").attr("style", "fill: red;");
        d3.select("#ORO-stat").transition().duration(200).style("fill", "rgb(255, 0, 0)");
        d3.select("#FOL-stat").transition().duration(200).style("fill", "rgb(255, 0, 0)");
        d3.select("#SHA-stat").transition().duration(200).style("fill", "rgb(255, 0, 0)");
        
        d3.select("#INV-ORO").transition().duration(200).style("stroke", "rgb(255, 0, 0)");
        d3.select("#INV-FOL").transition().duration(200).style("stroke", "rgb(255, 0, 0)");
        d3.select("#SHA-INV").transition().duration(200).style("stroke", "rgb(255, 0, 0)");
    }
}

function noResRed() {
    if ($("#INV-ORO") && $("#INV-FOL") && $("#SHA-INV")) {
        d3.select("#ORO-stat").transition().duration(200).style("fill", "rgb(255, 255, 255)");
        d3.select("#FOL-stat").transition().duration(200).style("fill", "rgb(255, 255, 255)");
        d3.select("#SHA-stat").transition().duration(200).style("fill", "rgb(255, 255, 255)");
        d3.select("#INV-stat").transition().duration(200).style("fill", "rgb(255, 255, 255)");

        d3.select("#INV-ORO").transition().duration(200).style("stroke", "rgb(255, 255, 255)");
        d3.select("#INV-FOL").transition().duration(200).style("stroke", "rgb(255, 255, 255)");
        d3.select("#SHA-INV").transition().duration(200).style("stroke", "rgb(255, 255, 255)");       
    }
}