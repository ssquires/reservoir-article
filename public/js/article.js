var waterBuckets = false;

$(document).ready(function() {
    makePDSIGraphic("PDSI-viz");
    makeHistoricalReservoirViz();
    makeReservoirFillGraphic();
    createMontagueViz();
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

    if (w_pos < top) { // Slide 1.1
        hideSlides();
        showSlide('1');
        $('#slide1-inner').removeClass('fixed');
        $('#slide1-inner').removeClass('relative-bottom');
        $('#slide1-inner').addClass('relative');
        updateWaterBuckets(5000, 25, 10, 10);
    } else if (w_pos >= top && w_pos < pos_1_2) {
        hideSlides();
        showSlide('1');
        $('#slide1-inner').removeClass('relative');
        $('#slide1-inner').removeClass('relative-600');
        $('#slide1-inner').addClass('fixed');
        updateWaterBuckets(5000, 25, 10, 10);
    } else if (w_pos >= pos_1_2 && w_pos < pos_1_3) {
        hideSlides();
        showSlide('1-2');
        $('#slide1-inner').removeClass('relative');
        $('#slide1-inner').removeClass('relative-600');
        $('#slide1-inner').addClass('fixed');
        updateWaterBuckets(2200, 25, 10, 20);
    } else if (w_pos >= pos_1_3 && w_pos < pos_1_4) {
        hideSlides();
        showSlide('1-3');
        $('#slide1-inner').removeClass('relative');
        $('#slide1-inner').removeClass('relative-600');
        $('#slide1-inner').addClass('fixed');
        updateWaterBuckets(800, 25, 10, 20);
    } else if (w_pos >= pos_1_4 && w_pos < pos_1_5) {
        hideSlides();
        showSlide('1-4');
        $('#slide1-inner').removeClass('relative');
        $('#slide1-inner').removeClass('relative-600');
        $('#slide1-inner').addClass('fixed');
        updateWaterBuckets(240, 25, 10, 20);
    } else if (w_pos >= pos_1_5 && w_pos < pos_1_6) {
        hideSlides();
        showSlide('1-5');
        $('#slide1-inner').removeClass('relative');
        $('#slide1-inner').removeClass('relative-600');
        $('#slide1-inner').addClass('fixed');
        updateWaterBuckets(16, 25, 10, 20);
    } else if (w_pos >= pos_1_6 && w_pos < pos_1_7) {
        hideSlides();
        showSlide('1-6');
        $('#slide1-inner').removeClass('relative');
        $('#slide1-inner').removeClass('relative-600');
        $('#slide1-inner').addClass('fixed');
        updateWaterBuckets(16, 25, 10, 20);
    } else if (w_pos >= pos_1_7) {
        $('#slide1-inner').removeClass('fixed');
        $('#slide1-inner').removeClass('relative');
        $('#slide1-inner').addClass('relative-600');
        updateWaterBuckets(16, 25, 10, 20);
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
    clickHereDiv.append($("<text id='label'>Drag slider</text>"));
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