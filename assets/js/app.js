// @TODO: YOUR CODE HERE!

// set the dimensions and margins of the graph
var svgWidth = 900;
var svgHeight = 600;

var margin = {
    top: 50,
    right: 50,
    bottom: 100,
    left: 100
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// append the svg object to the body of the page
var svg = d3
    .select("#scatter")
    .append("svg")
    .attr("width", svgWidth)
    .attr("height", svgHeight);

var chartGroup = svg.append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);


// read the data
d3.csv("assets/data/data.csv").then(successHandle, errorHandle);

// if we fail to read data, then console log "error" 
function errorHandle(error) {
    throw error;
} 

// if we successfully read data
function successHandle(statesData) {
    // label data with map
    statesData.map(function (data) {
        data.poverty = +data.poverty;
        data.obesity = +data.obesity;
    });
    
    // create X axis ("bottomAxis") and append to chart
    var xLinearScale = d3.scaleLinear()
        .domain([8.1, d3.max(statesData, d => d.poverty)])
        .range([0, width]);

    var bottomAxis = d3.axisBottom(xLinearScale).ticks(7);

    chartGroup.append("g")
        .attr("transform", `translate(0, ${height})`)
        .call(bottomAxis);

    // create X axis ("leftAxis") and append to chart
    var yLinearScale = d3.scaleLinear()
        .domain([20, d3.max(statesData, d => d.obesity)])
        .range([height, 0]);
    
    var leftAxis = d3.axisLeft(yLinearScale);
    
    chartGroup.append("g")
        .call(leftAxis);
    
    // format and label axis
    chartGroup.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - margin.left + 50)
        .attr("x", 0 - (height / 2))
        .attr("dy", "1em")
        .attr("class", "axisText")
        .text("Obese (%)");
    
    chartGroup.append("text")
        .attr("transform", `translate(${width / 2}, ${height + margin.top + 10})`)
        .attr("class", "axisText")
        .text("In Poverty (%)");
    
    // Add data points to scatterplot
    var circlesGroup = chartGroup.selectAll("circle")
        .data(statesData)
        .enter()
        .append("circle")
        .attr("cx", d => xLinearScale(d.poverty))
        .attr("cy", d => yLinearScale(d.obesity))
        .attr("r", "13")
        .attr("fill", "#788dc2")
        .attr("opacity", ".75")
        
    // Add states abbreviations inside data points
    var circlesGroup = chartGroup.selectAll()
        .data(statesData)
        .enter()
        .append("text")
        .attr("x", d => xLinearScale(d.poverty))
        .attr("y", d => yLinearScale(d.obesity))
        .style("font-size", "12px")
        .style("text-anchor", "middle")
        .style('fill', 'white')
        .text(d => (d.abbr));

}