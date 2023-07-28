// Change the URLs to use relative paths for fetching the samples.json file
const SAMPLES_JSON_URL = "samples.json";

// Function to build the metadata panel
function buildMetadata(sample) {
  d3.json(SAMPLES_JSON_URL).then((data) => {
    let metadata = data.metadata;
    let resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
    let result = resultArray[0];
    let PANEL = d3.select("#sample-metadata");

    PANEL.html("");

    // Loop through the metadata and display each key-value pair
    Object.entries(result).forEach(([key, value]) => {
      PANEL.append("p").text(`${key.toUpperCase()}: ${value}`);
    });
  });
}

// Function to create the bar chart
function buildBarChart(sample) {
  d3.json(SAMPLES_JSON_URL).then((data) => {
    let samples = data.samples;
    let resultArray = samples.filter(sampleObj => sampleObj.id == sample);
    let result = resultArray[0];

    let otu_ids = result.otu_ids;
    let otu_labels = result.otu_labels;
    let sample_values = result.sample_values;

    // Get the top 10 OTUs for the bar chart
    let topOtuIds = otu_ids.slice(0, 10).map(otuID => `OTU ${otuID}`).reverse();
    let topSampleValues = sample_values.slice(0, 10).reverse();
    let topOtuLabels = otu_labels.slice(0, 10).reverse();

    // Create the trace for the bar chart
    let barTrace = {
      x: topSampleValues,
      y: topOtuIds,
      text: topOtuLabels,
      type: "bar",
      orientation: "h"
    };

    let barData = [barTrace];

    let barLayout = {
      title: "Top 10 OTUs Found",
      margin: { t: 30, l: 150 }
    };

    Plotly.newPlot("bar", barData, barLayout);
  });
}

// Function to create the bubble chart
function buildBubbleChart(sample) {
  d3.json(SAMPLES_JSON_URL).then((data) => {
    let samples = data.samples;
    let resultArray = samples.filter(sampleObj => sampleObj.id == sample);
    let result = resultArray[0];

    let otu_ids = result.otu_ids;
    let otu_labels = result.otu_labels;
    let sample_values = result.sample_values;

    // Create the trace for the bubble chart
    let bubbleTrace = {
      x: otu_ids,
      y: sample_values,
      text: otu_labels,
      mode: "markers",
      marker: {
        size: sample_values,
        color: otu_ids,
        colorscale: "Earth"
      }
    };

    let bubbleData = [bubbleTrace];

    let bubbleLayout = {
      title: "Bacteria Cultures Per Sample",
      xaxis: { title: "OTU ID" },
      margin: { t: 30 }
    };

    Plotly.newPlot("bubble", bubbleData, bubbleLayout);
  });
}

// Function to create the gauge chart
function buildGaugeChart(sample) {
  d3.json(SAMPLES_JSON_URL).then((data) => {
    let metadata = data.metadata;
    let resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
    let result = resultArray[0];

    let washFreq = result.wfreq;

    // Create the trace for the gauge chart
    let gaugeTrace = {
      type: "indicator",
      mode: "gauge+number",
      value: washFreq,
      title: { text: "Belly Button Washing Frequency<br>Scrubs per Week" },
      gauge: {
        axis: { range: [null, 9], tickwidth: 1, tickcolor: "darkblue" },
        bar: { color: "darkblue" },
        bgcolor: "white",
        borderwidth: 2,
        bordercolor: "gray",
        steps: [
          { range: [0, 1], color: "rgba(0, 128, 0, 0.2)" },
          { range: [1, 2], color: "rgba(0, 128, 0, 0.4)" },
          { range: [2, 3], color: "rgba(0, 128, 0, 0.6)" },
          { range: [3, 4], color: "rgba(0, 128, 0, 0.8)" },
          { range: [4, 5], color: "rgba(0, 128, 0, 1.0)" },
          { range: [5, 6], color: "rgba(255, 255, 0, 0.2)" },
          { range: [6, 7], color: "rgba(255, 255, 0, 0.4)" },
          { range: [7, 8], color: "rgba(255, 255, 0, 0.6)" },
          { range: [8, 9], color: "rgba(255, 255, 0, 0.8)" }
        ]
      }
    };

    let gaugeData = [gaugeTrace];

    let gaugeLayout = {
      width: 500,
      height: 400,
      margin: { t: 30, r: 25, l: 25, b: 25 }
    };

    Plotly.newPlot("gauge", gaugeData, gaugeLayout);
  });
}

// Function to initialize the dashboard
function init() {
  // Grab a reference to the dropdown select element
  let selector = d3.select("#selDataset");

  // Use d3.json() to fetch the data from the JSON file
  d3.json(SAMPLES_JSON_URL).then((data) => {
    let sampleNames = data.names;

    // Populate the dropdown options with the sample names
    sampleNames.forEach((sample) => {
      selector.append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    let firstSample = sampleNames[0];
    buildBarChart(firstSample);
    buildBubbleChart(firstSample);
    buildGaugeChart(firstSample);
    buildMetadata(firstSample);
  });
}

// Function to handle a change in the dropdown selection
function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildBarChart(newSample);
  buildBubbleChart(newSample);
  buildGaugeChart(newSample);
  buildMetadata(newSample);
}

// Initialize the dashboard
init();