function slide3() {
    console.log("Displaying Slide 3");
    var vizContainer = $("<div id='vizContainer'></div>");
    var gaugesDiv = $("<div id='gauges'></div>");
    var mapDiv = $("<div id='map'></div>");
    var sliderDiv = $("<div id='slider'></div>");
    var startLabel = $("<p id='start-label'>2003</p>");
    var endLabel = $("<p id='end-label'>2016</p>");
    var droughtLabel1 = $("<p id='drought-label-08'>August 2008</p>");
    var droughtLabel2 = $("<p id='drought-label-14'>August 2014</p>");
    var markerDiv = $("<div class='marker-div' id='marker-div-08'></div>");
    var markerDiv2 = $("<div class='marker-div' id='marker-div-14'></div>");
    sliderDiv.append(startLabel);
    sliderDiv.append(endLabel);
    sliderDiv.append(markerDiv);
    sliderDiv.append(markerDiv2);
    sliderDiv.append(droughtLabel1);
    sliderDiv.append(droughtLabel2);
    $("#reservoirs-matter-viz").append(vizContainer);
    vizContainer.append(mapDiv);
    vizContainer.append(gaugesDiv);
    $("#reservoirs-matter-viz").append(sliderDiv);
    makeFillGauges("historical_data.json", 70, 70, 12, gaugesDiv, "#map");
    makeSlider("historical_data.json", sliderDiv);
}