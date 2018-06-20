function slide4() {
    console.log("Displaying Slide 4.1");
    makeConnectivityMap("#graphic", ["INV", "SHA", "FOL","ORO","DNP","ISB","HID"], 
            {"SHA": ["ORO", "INV"],
             "ORO": ["INV"],
             "INV": ["FOL"],
             "FOL": ["DNP"],
             "HID": ["DNP"],
             "ISB": ["DNP"]
              },connectedResMouseover,connectedResMouseout, "4.1");
}


function slide4_2() {
    console.log("Displaying Slide 4.2");
    var placeholder = $("<img id='placeholder' width='100%'>");
    placeholder.attr("src", "slide4_2.png");
    $("#graphic").append(placeholder);
}

function slide4_3() {
    console.log("Displaying Slide 4.3");
    var placeholder = $("<img id='placeholder' width='100%'>");
    placeholder.attr("src", "slide4_3.png");
    $("#graphic").append(placeholder);
}

