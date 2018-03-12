var margin = {
        top: 5,
        right: 40,
        bottom: 150,
        left: 100
    },
    w = 600 - margin.left - margin.right,
    h = 500 - margin.top - margin.bottom,
    padding = 40;
var xScale, yScale, xAxis, yAxis, line;  //Empty, for now


//Function for converting CSV values from strings to Dates and numbers
var rowConverter = function (d, _, columns) {

    d.date = +d.date;
    for (var i = 1, n = columns.length, c; i < n; ++i) d[c = columns[i]] = +d[c];
    return d;
}

//Load in data
d3.csv("balance.csv", rowConverter, function (data) {

    var dataset = data;
    //create another data array, id is province name
    var provinces = data.columns.slice(1).map(function (id) {
        return {
            id: id,
            values: data.map(function (d) {
                return {date: d.date, balance: d[id]};
            })
        };
    });

    //Scale Changes as we Zoom
    var zoom = d3.zoom()
        .scaleExtent([1, 40])
        .on("zoom", zoomed);

    // Call the function d3.behavior.zoom to Add zoom
    function zoomed() {
        // create new scale ojects based on event
        var new_yScale = d3.event.transform.rescaleY(yScale)
        // update axes
        svg.select(".y.axis").call(yAxis.scale(new_yScale));

        // zoom the line
        line
            .y(function (d) {
                return new_yScale(d.balance);
            });
        path.attr("d", function (d) {
            return line(d.values);
        })

        //zoom the dot
        dots.attr("cy", function(d) { return new_yScale(d.balance); });

        dot_text.attr("transform", function (d) {
            return "translate(" + xScale(d.date) + "," + new_yScale(d.balance) + ")";
        })
    }

    //Create scale functions
    xScale = d3.scaleTime()
        .domain([
            d3.min(dataset, function (d) {
                return d.date;
            }),
            d3.max(dataset, function (d) {
                return d.date;
            })
        ])
        .range([0, w]);

    yScale = d3.scaleLinear()
        .domain([d3.min(provinces, function (c) {
            return d3.min(c.values, function (d) {
                return d.balance;
            })
        }), d3.max(provinces, function (c) {
            return d3.max(c.values, function (d) {
                return d.balance;
            });
        })])
        .range([h, 0]);

    //Define axes
    xAxis = d3.axisBottom()
        .scale(xScale)
        .ticks(10)
        .tickFormat(function (d) {
            return +d;
        });

    //Define Y axis
    yAxis = d3.axisLeft()
        .scale(yScale)
        .ticks(10);

    // //color provinces name
    // z.domain(provinces.map(function (c) {
    //     return c.id;
    // }));

    //Define line generator
    line = d3.line()
        .curve(d3.curveBasis)
        .x(function (d) {
            return xScale(d.date);
        })
        .y(function (d) {
            return yScale(d.balance);
        });

    //Create SVG element
    var svg = d3.select("#current_chart").append("svg")
        .call(zoom)
        .attr("width", w + margin.left + margin.right + 2 * padding)
        .attr("height", h + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");


    svg.append("clipPath")
        .attr("id", "clip")
        .append("rect")
        .attr("width", w)
        .attr("height", h);


    //Create line
    var provinces = svg.selectAll(".provinces")
        .data(provinces)
        .enter().append("g")
        .attr("class", "provinces");

    var path = provinces.append("path")
        .attr("class", "line")
        .attr("stroke-width", "2.5")
        .attr("fill", "none")
        .attr("clip-path", "url(#clip)")
        .attr("d", function (d) {
            return line(d.values);
        })
        .style("stroke", "grey")
        .style("opacity", 0.4)
        .on("mouseover", function(d, i) {
            d3.select(this)
                .style("stroke","red")
                .style("opacity",1);

            d3.select("#" + d.id)
                .style("opacity",1);

            d3.selectAll("." + d.id)
                .style("opacity", 1)
                .style("fill", "red");

            d3.selectAll(".dot"+d.id)
                .style("opacity",1)

        })
        .on("mouseout", function(d,i){
            d3.select(this)
                .style("stroke","grey")
                .style("opacity", 0.4);
            d3.select("#" + d.id)
                .style("opacity",0);

            d3.selectAll("." + d.id)
                .style("fill", "grey")
                .style("opacity", 0);

            d3.selectAll(".dot"+ d.id)
                .style("opacity", 0)
        });

    // var totalLength = path.node().getTotalLength();
    // path
    //     .attr("stroke-dasharray", totalLength + " " + totalLength)
    //     .attr("stroke-dashoffset", totalLength)
    //     .transition()
    //     .duration(1000)
    //     .ease(d3.easeLinear)
    //     .attr("stroke-dashoffset", 0);

    //add provinces names to the lines
    provinces.append("text")
        .datum(function (d) {
            // console.log(d.values[d.values.length - 1]);
            return {id: d.id, value: d.values[d.values.length - 1]};
        })
        .attr("id",function(d){

            return d.id;
        })
        .attr("transform", function (d) {
            return "translate(" + xScale(d.value.date) + "," + yScale(d.value.balance) + ")";
        })
        .attr("x", 3)
        .attr("dy", "0.35em")
        .style("font", "10px sans-serif")
        .style("opacity", 0)
        .text(function (d) {
            return d.id;
        });


//************************************************************
// Draw points on SVG object based on the data given
//************************************************************
    var dots = provinces.selectAll("circle")
        .data(function(d){

            d.values.forEach(function (value) {
                 value["id"] = d.id;
            });
            d = d.values;
            return d;
        })
        .enter()
        .append("circle")
        .attr("class", function (d) {
            return d.id;
        })
        .attr("r", 4)
        .attr("cx", function(d) { return xScale(d.date); })
        .attr("cy", function(d) { return yScale(d.balance); })
        .style("opacity", 0);

    dots.attr("clip-path", "url(#clip)");

    var dot_text = provinces.selectAll("text")
        .data(function(d){

            d.values.forEach(function (value) {
                value["id"] = d.id;
            });
            d = d.values;
            return d;
        })
        .enter()
        .append("text")
        .attr("class", function (d) {
            return "dot"+d.id;
        })
        .attr("transform", function (d) {
            return "translate(" + xScale(d.date) + "," + yScale(d.balance) + ")";
        })
        .attr("x", 1)
        .attr("y", 15)
        .style("font", "10px sans-serif")
        .style("opacity", 0)
        .text(function (d) {
            return d.balance;
        });

    //not work???
    dot_text.attr("clip-path", "url(#clip)");

    //Create axes
    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + (h) + ")")
        .call(xAxis);

    svg.append("g")
        .attr("class", "y axis")
        .call(yAxis);

    //add text label for y axis
    svg.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - margin.left)
        .attr("x", 0 - (h / 2))
        .attr("dy", "1em")
        .style("text-anchor", "middle")
        .text("Balance (10000 Yuan)");

    //add text label for x axis
    svg.append("text")
        .attr("transform",
            "translate(" + (w + 60) + " ," +
            (h + 20) + ")")
        .style("text-anchor", "end")
        .text("Year");

    // gridlines in x axis function
    function make_x_gridlines() {
        return d3.axisBottom(xScale)
            .ticks(5)

    }

    // gridlines in y axis function
    function make_y_gridlines() {
        return d3.axisLeft(yScale)
            .ticks(5)
    }

    // add the X gridlines
    svg.append("g")
        .attr("class", "grid")
        .attr("transform", "translate(0," + h + ")")
        .call(make_x_gridlines()
            .tickSize(-h)
            .tickFormat("")
        )
        .style("opacity", 0.3);

    // add the Y gridlines
    svg.append("g")
        .attr("class", "grid")
        .call(make_y_gridlines()
            .tickSize(-w)
            .tickFormat("")
        )
        .style("opacity", 0.3);


});