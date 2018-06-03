var curtain;
var stopXCoord;
var pauseXCoord;


function slide2() {
    var config = {
        resNames: ["BUC"],
        resColors: ["#0DC1F2"],
        beginDate: "January 2003",
        endDate: "November 2016",
        pauseDate: "November 2012",
        stopDate: "November 2016"
    };
    makeLineChart("#seasonality-graphic", "historical_data.json", config, function (progress) { curtain = progress["curtain"];
    stopXCoord = progress["stopDateXCoord"]; pauseXCoord = progress["pauseDateXCoord"]; console.log(progress)});
}

function slide2_1() {
    console.log("Displaying Slide 2.1");
    console.log(pauseXCoord);
    curtain.transition().duration(1000).ease("linear").attr("x", pauseXCoord);
}

function slide2_2() {
    console.log("Displaying Slide 2.2");
    curtain.transition().duration(1000).ease("linear").attr("x", stopXCoord);
}