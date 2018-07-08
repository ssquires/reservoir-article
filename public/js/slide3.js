function slide3() {
    console.log("Displaying Slide 3");
    var vizContainer = $("<div id='vizContainer'></div>");
    var gaugesDiv = $("<div id='gauges'></div>");
    var mapDiv = $("<div id='map' class='map'></div>");
    var sliderDiv = $("<div id='slider'></div>");
    var sliderInnerDiv = $("<div id='slider-inner'></div>");
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
    makeFillGauges("historical_data.json", 70, 70, 12, gaugesDiv, "#map");
    makeSlider("historical_data.json", sliderInnerDiv, "slider-inner", true);
}