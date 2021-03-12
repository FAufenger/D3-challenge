function makeResponsive() {

    // if the SVG area isn't empty when the browser loads,
    // remove it and replace it with a resized version of the chart
    var svgArea = d3.select("#scatterPlot").select("svg");

    if (!svgArea.empty()) {
        svgArea.remove();
    }

    // // Define SVG area dimensions
    var svgHeight = (window.innerHeight) - 150;
    var svgWidth = (window.innerWidth) - 250;
    //var svgWidth = 800;
    //var svgHeight = 600;

    // Define the chart's margins as an object
    var chartMargin = { top: 30, right: 30, bottom: 45, left: 45 };

    // Define dimensions of the chart area
    var chartWidth = svgWidth - chartMargin.left - chartMargin.right;
    var chartHeight = svgHeight - chartMargin.top - chartMargin.bottom;

    // Select body, append SVG area to it, and set the dimensions
    var svg = d3.select("#scatterPlot")
        .append("svg")
        .attr("height", svgHeight)
        .attr("width", svgWidth);

    // Append a group to the SVG area and shift ('translate') it to the right and to the bottom
    var chartGroup = svg.append("g")
        .attr("transform", `translate(${chartMargin.left}, ${chartMargin.top})`);

    // // Unsuccessful attempt to make LinearScale variable based    
    //var xSelect = "age";
    //var ySelect = "smokes";

    // Import data from data.csv 
    d3.csv("./assets/resources/data.csv").then(function (stateData) {
        // Check to see what imported data looks like
        console.log(stateData);


        // Cast the hours value to a number for each piece of tvData
        stateData.forEach(function (d) {
            d.poverty = +d.poverty;
            d.age = +d.age;
            d.income = +d.income;
            d.healthcare =  +d.healthcare;
            d.obesity = +d.obesity;
            d.smokes = +d.smokes;
        });
        
        //var xSelect = "age";
        //var ySelect = "smokes";
        
        // Create a dynamic linear scale for axis
        var xLinearScale = d3.scaleLinear()
            .domain([(d3.min(stateData, d => d.age) - 1), (d3.max(stateData, d => d.age) + 1)])
            .range([0, chartWidth]);

        var yLinearScale = d3.scaleLinear()
            .domain([(d3.min(stateData, d => d.smokes) - 1), (d3.max(stateData, d => d.smokes) + 1)])
            .range([chartHeight, 0]);


        // Create axis as a function
        var xAxis = d3.axisBottom(xLinearScale);
        var yAxis = d3.axisLeft(yLinearScale)  //.ticks(10);


        // Append two SVG group elements to the chartGroup area,
        // and create the bottom (x) and left (y) axes inside of them
        chartGroup.append("g")
            .attr("transform", `translate(0, ${chartHeight})`)
            .call(xAxis);

        chartGroup.append("g")
            .call(yAxis);
        

        // Create one SVG circle per piece of stateData
        // Use the linear scales to position each circle within the chart
        chartGroup.selectAll(".circle")
            .data(stateData)
            .enter()
            .append("circle") //.attr("class", "cir")
            .attr("cx", d => xLinearScale(d.age))
            .attr("cy", d => yLinearScale(d.smokes))
            .attr("r", "12")
            .attr("stroke-width", "1")
            .attr("fill", "green")
            .attr("opacity", ".6")
            // event listener for mouseover
            .on("mouseover", function() {
                d3.select(this)
                    .attr("fill", "red");
            })
            // event listener for mouseout
            .on("mouseout", function() {
                d3.select(this)
                  .attr("fill", "blue");
             });

        // Add text to data points
        chartGroup.append("g")
            .selectAll('text')
            .data(stateData)
            .enter()
            .append("text")
            .text(d=>d.abbr)
            .attr("x",d=>xLinearScale(d.age))
            .attr("y",d=>yLinearScale(d.smokes))
            //.classed("sateAbbreviation" = true)
            .attr("text-anchor", "middle")
            .attr("fill", "black")
            .attr("font-size", "12px")
            .style("font-weight", "bold")
            .attr("alignment-baseline", "central");


        // Add axis labels
        chartGroup.append("text")
            .attr("transform", `translate(${chartWidth / 2}, ${chartHeight + chartMargin.bottom - 5})`)
            .attr("text-anchor", "middle")
            .text("Mean Age");

        chartGroup.append("text")
            .attr("transform", `translate(${-30}, ${chartHeight/2}), rotate(270)`)
            .attr("text-anchor", "middle")
            .text("Smokers (%)");

        // // Use Tool Tips to have a hover over display
        // // Step 1: Append a div to the body to create tooltips, assign it a class
        // // =======================================================
        // var toolTip = d3.select("body").append("div")
        //     .attr("class", "tooltip");

        // // Step 2: Add an onmouseover event to display a tooltip
        // // ========================================================
        // circlesGroup.on("mouseover", function(d, i) {
        //     toolTip.style("display", "block");
        //     toolTip.html(`Pizzas eaten: <strong>${pizzasEatenByMonth[i]}</strong>`)
        //     .style("left", d3.event.pageX + "px")
        //     .style("top", d3.event.pageY + "px");
        // })
        //     // Step 3: Add an onmouseout event to make the tooltip invisible
        //     .on("mouseout", function() {
        //     toolTip.style("display", "none");
        //     });


            }).catch(function (error) {
                console.log(error);
            });
}

// Call main function
makeResponsive();

// Event listener for window resize.
// When the browser window is resized, makeResponsive() is called.
d3.select(window).on("resize", makeResponsive);

// need to use?
/*{
    "globals": {
      "d3": true
    }
  }*/