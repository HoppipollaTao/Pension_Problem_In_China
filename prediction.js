// set the dimensions and margins of the graph
var margin_pre = {top: 30, right: 20, bottom: 30, left: 60},
    width_pre = 650 - margin.left - margin.right,
    height_pre = 430 - margin.top - margin.bottom;

// parse the date / time
var parseTime = d3.timeParse("%d-%b-%y");

// set the ranges
var x_pre = d3.scaleTime().range([0, width_pre]);
var y_pre = d3.scaleLinear().range([height_pre, 0]);
// y(3)

// define the line
var valueline = d3.line()
    .x(function (d) {
        return x_pre(d.date);
    })
    .y(function (d) {
        return y_pre(d.close);
    });

// append the svg obgect to the body of the page
// appends a 'group' element to 'svg'
// moves the 'group' element to the top left margin
var svg_pre = d3.select("#prediction_chart").append("svg")
    .attr("width", width_pre + margin_pre.left + margin_pre.right)
    .attr("height", height_pre + margin_pre.top + margin_pre.bottom)
    .append("g")
    .attr("transform",
        "translate(" + margin_pre.left + "," + margin_pre.top + ")");

// gridlines in x axis function
function make_xpre_gridlines() {
    return d3.axisBottom(x_pre)
        .ticks(10)
}

// gridlines in y axis function
function make_ypre_gridlines() {
    return d3.axisLeft(y_pre)
        .ticks(10)
}


// Get the data
d3.csv("prediction.csv", function (error, data) {
    if (error) throw error;

    // format the data
    data.forEach(function (d) {
        d.date = parseTime(d.date);
        d.close = +d.close;
    });

    // Scale the range of the data
    x_pre.domain(d3.extent(data, function (d) {
        return d.date;
    }));
    y_pre.domain([-2000, d3.max(data, function (d) {
        return d.close;
    })]);

    // add the X gridlines
    svg_pre.append("g")
        .attr("class", "grid_pre")
        .attr("transform", "translate(0," + height_pre + ")")
        .call(make_xpre_gridlines()
            .tickSize(-height_pre)
            .tickFormat("")
        )

    // add the Y gridlines
    var allYaxis = svg_pre.append("g")
        .attr("class", "grid_pre")
        .call(make_ypre_gridlines()
            .tickSize(-width_pre)
            .tickFormat("")
        )


    svg_pre.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - 65)
        .attr("x", 0 - 100)
        .attr("dy", "1em")
        .style("text-anchor", "middle")
        .text("Pension Asset Per Capita(10,000 Yuan)");//add label

    // set the gradient
    svg_pre.append("linearGradient")
        .attr("id", "line-gradient")
        .attr("gradientUnits", "userSpaceOnUse")
        .attr("x1", 0).attr("y1", y_pre(0))
        .attr("x2", 0).attr("y2", y_pre(1000))
        .selectAll("stop")
        .data([
            {offset: "0%", color: "red"},
            {offset: "0%", color: "red"},
            {offset: "1%", color: "orange"},
            {offset: "1%", color: "green"},
            {offset: "62%", color: "lawngreen"},
            {offset: "100%", color: "lawngreen"}
        ])
        .enter().append("stop")
        .attr("offset", function (d) {
            return d.offset;
        })
        .attr("stop-color", function (d) {
            return d.color;
        });

    // Add the valueline path.
    svg_pre.append("path")
        .data([data])
        .attr("class", "line")
        .attr("d", valueline);

    // Add the X Axis
    svg_pre.append("g")
        .attr("transform", "translate(0," + height_pre + ")")
        .call(d3.axisBottom(x_pre));

    // Add the Y Axis
    svg_pre.append("g")
        .call(d3.axisLeft(y_pre));

    svg_pre.append("g")
        .attr("transform", "translate(0," + height_pre + ")")
        .call(d3.axisBottom(x_pre));


    allYaxis.selectAll('.tick line').each(function (d, i) {
        console.log(d);
        if (d == 0) {
            d3.select(this)
                .style("stroke", "red")
                .attr("stroke-dasharray", "2,2");
        }
    });


    /*function make_y_gridlines() {
        return d3.axisLeft(y)
            .ticks(5)
    }*/
    svg_pre.append('text')
        .text('Future 2020 - 2050')
        .attr("font-size", "18")
        .attr("font-weight", "bold")
        .attr("x", 110)
        .attr("y", -10);


});
