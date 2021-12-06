// select the user input field
var idSelect = d3.select("#selDataset");

// select the demographic in PANEL
var PANEL = d3.select("#sample-metadata");

// select the bar chart div
var barChart = d3.select("#bar");

// select the bubble chart div
var bubbleChart = d3.select("bubble");

// select the gauge chart div
var gaugeChart = d3.select("gauge");

// create a function to initially populate dropdown menu with IDs and draw charts by default (using the first ID)
function init() {

    // reset any previous data
    resetData();

    // read in samples from JSON file
    d3.json("data/samples.json").then((data => {

        // ----------------------------------
        // POPULATE DROPDOWN MENU WITH IDs 
        // ----------------------------------

        //  use a forEach to loop over each name in the array data.names to populate dropdowns with IDs
        data.names.forEach((name => {
            var option = idSelect.append("option");
            option.text(name);
        })); // close forEach

        // get the first ID from the list for initial charts as a default
        var initId = idSelect.property("value")

        // plot charts with initial ID
        plotCharts(initId);

    })); // close .then()

} // close init() function

// create a function to reset divs to prepare for new data
function resetData() {
    // CLEAR THE DATA
    PANEL.html("");
    barChart.html("");
    bubbleChart.html("");
    gaugeChart.html("");
}; 

// create a function to read JSON and plot charts
function plotCharts(id) {

    // read in the JSON data
    d3.json("data/samples.json").then((data => {
        // POPULATE DEMOGRAPHICS TABLE
        // filter the metadata for the ID chosen
        var individualMetadata = data.metadata.filter(participant => participant.id == id);
        var result = individualMetadata[0];
        // get the wash frequency for gauge chart later
        var wfreq = result.wfreq;
        // Iterate through each key and value in the metadata
        Object.entries(result).forEach(([key, value]) => {
            PANEL.append("h5").text(`${key.toUpperCase()}: ${value}`);
        }); // close forEach

        // --------------------------------------------------
        // RETRIEVE DATA FOR PLOTTING CHARTS
        // --------------------------------------------------

        // filter the samples for the ID chosen
        var individualSample = data.samples.filter(sample => sample.id == id)[0];

        // create empty arrays to store sample data
        var otuIds = [];
        var otuLabels = [];
        var sampleValues = [];

        // Iterate through each key and value in the sample to retrieve data for plotting
        Object.entries(individualSample).forEach(([key, value]) => {

            switch (key) {
                case "otu_ids":
                    otuIds.push(value);
                    break;
                case "sample_values":
                    sampleValues.push(value);
                    break;
                case "otu_labels":
                    otuLabels.push(value);
                    break;
                    // case
                default:
                    break;
            } // close switch statement

        }); // close forEach

        // slice and reverse the arrays to get the top 10 values, labels and IDs
        var topOtuIds = otuIds[0].slice(0, 10).reverse();
        var topOtuLabels = otuLabels[0].slice(0, 10).reverse();
        var topSampleValues = sampleValues[0].slice(0, 10).reverse();

        // use the map function to store the IDs with "OTU" for labelling y-axis
        var topOtuIdsFormatted = topOtuIds.map(otuID => "OTU " + otuID);

        // ----------------------------------
        // PLOT BAR CHART
        // ----------------------------------

        // create a trace
        var traceBar = {
            x: topSampleValues,
            y: topOtuIdsFormatted,
            text: topOtuLabels,
            type: 'bar',
            orientation: 'h',
            marker: {
                color: 'rgb(29,145,192)'
            }
        };

        // create the data array for plotting
        var dataBar = [traceBar];

        // define the plot layout
        var layoutBar = {
            height: 400,
            width: 500,
            font: {family: 'Quicksand'},
            hoverlabel: {font: {family: 'Quicksand'}},
            title: {
                text: `<b>Top 10 Bacteria Cultures Found</b>`,
                font: {size: 18,color: 'rgb(34,94,168)' }
            },
            xaxis: {
                title: "<b>Sample values<b>",
                color: 'rgb(34,94,168)'
            },
            yaxis: {
                tickfont: { size: 14 }
            }
        }


        // plot the bar chart to the "bar" div
        Plotly.newPlot("bar", dataBar, layoutBar);

        // ----------------------------------
        // PLOT BUBBLE CHART
        // ----------------------------------

        // create trace
        var traceBub = {
            x: otuIds[0],
            y: sampleValues[0],
            text: otuLabels[0],
            mode: 'markers',
            marker: {
                size: sampleValues[0],
                color: otuIds[0],
                colorscale: 'Earth'
            }
        };

        // create the data array for the plot
        var dataBub = [traceBub];

        // define the plot layout
        var layout = {
            title: 'Bacteria Cultures Per Sample',
            showlegend: false,
            height: 500,
            width: 1155
          };

        // plot the bubble chat to the appropriate div
        Plotly.newPlot('bubble', dataBub, layout);

        // ----------------------------------
        // PLOT GAUGE CHART (OPTIONAL)
        // ----------------------------------

        // if wfreq has a null value, make it zero for calculating pointer later
        if (wfreq == null) {
            wfreq = 0;
        }

        // create an indicator trace for the gauge chart
        var traceGauge = [{
            domain: { x: [0, 1], y: [0, 1] },
            value: wfreq,
            type: "indicator",
            mode: "gauge+number",
            title: { text: "Scrubs Per Week", font: { size: 24 } },
            //delta: { reference: 400, increasing: { color: "RebeccaPurple" } },
            gauge: {
                axis: { range: [null, 10], tickwidth: 1, tickcolor: "darkblue" },
                bar: { color: "black" },
                
                bordercolor: "gray",
                steps: [
                    { range: [0, 2], color: 'red' },
                    { range: [2, 4], color: 'orange' },
                    { range: [4, 6], color: 'yellow' },
                    { range: [6, 8], color: 'lightgreen' },
                    { range: [8, 10], color: 'green' }
                   
                ]
            }
        }];

        var layout = {
            width: 470,
            height: 400,
            //title: 'Belly Button Washing Frequency',
            title: {text: `<b>Belly Button Washing Frequency</b>`,align: "down"},
            margin: { t: 25, r: 25, l: 25, b: 25 },
            paper_bgcolor: "white",
            font: { color: "black", family: "Arial" }
          };
          
        // plot the gauge chart
        Plotly.newPlot('gauge', traceGauge, layout);


    })); // close .then function

}; // close plotCharts() function

// when there is a change in the dropdown select menu, this function is called with the ID as a parameter
function optionChanged(id) {
    resetData();
    plotCharts(id);
} 

// call the init() function for default data
init();