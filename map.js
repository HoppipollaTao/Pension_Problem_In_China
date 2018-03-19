var width = 500;
var height = 400;

var svg = d3.select("#map").append("svg")
    .attr("width", width)
    .attr("height", height)
    .append("g")
    .attr("transform", "translate(0,0)");


var projection = d3.geoMercator()
    .center([107, 31])
    .scale(300)
    .translate([width /1.4, height / 2]);


var path = d3.geoPath()
    .projection(projection);

var dataset;

//set global current year
var currentYear = 2009;

d3.csv("balance_per_capita.csv", function (data) {
    data.forEach(function (d) {
        d.date = +d.date;
        d.Gansu = +d.Gansu;
        d.Qinghai = +d.Qinghai;
        d.Guangxi = +d.Guangxi;
        d.Guizhou = +d.Guizhou;
        d.Chongqing = +d.Chongqing;
        d.Beijing = +d.Beijing;
        d.Fujian = +d.Fujian;
        d.Anhui = +d.Anhui;
        d.Guangdong = +d.Guangdong;
        d.Tibet = +d.Tibet;
        d.Xinjiang = +d.Xinjiang;
        d.Hainan = +d.Hainan;
        d.Ningxia = +d.Ningxia;
        d.Shaanxi = +d.Shaanxi;
        d.Shanxi = +d.Shanxi;
        d.Hubei = +d.Hubei;
        d.Hunan = +d.Hunan;
        d.Sichuan = +d.Sichuan;
        d.Yunnan = +d.Yunnan;
        d.Hebei = +d.Hebei;
        d.Henan = +d.Henan;
        d.Liaoning = +d.Liaoning;
        d.Shandong = +d.Shandong;
        d.Tianjin = +d.Tianjin;
        d.Jiangxi = +d.Jiangxi;
        d.Jiangsu = +d.Jiangsu;
        d.Shanghai = +d.Shanghai;
        d.Zhejiang = +d.Zhejiang;
        d.Jilin = +d.Jilin;
        d.Inner_Mongolia = +d.Inner_Mongolia;
        d.Heilongjiang = +d.Heilongjiang;
    });
    dataset = data;
});

d3.json("china.geojson", function (error, root) {

    if (error)
        return console.error(error);

    svg.selectAll("path")
        .data(root.features)
        .enter()
        .append("path")
        .attr("stroke", "#000")
        .attr("stroke-width", 1)
        .attr("fill", updateColor)
        .attr("d", path)
        .on("mouseover", function (d, i) {
            d3.select(this)
                .attr("fill", "#FFF8F6");
            d3.select("#line" + i)
                .style("stroke", "red")
                .style("opacity", 1);
            d3.select("#province_name" + i)
                .style("opacity",1);

            d3.selectAll("." + d.properties.name)
                .style("opacity", 1)
                .style("fill", "red");

        })
        .on("mouseout", function (d, i) {
            console.log(i);
            d3.select(this)
                .attr("fill", updateColor(d,i));

            d3.select("#line" + i)
                .style("stroke","grey")
                .style("opacity", 0.4);

            d3.select("#province_name" + i)
                .style("opacity",0);


            d3.selectAll("." + d.properties.name)
                .style("fill", "grey")
                .style("opacity", 0);
        });

    function getBalance_Capita(name) {
        var count = currentYear - 2007 ;
        var cur_dataset = dataset[count];
        var balance_capita = cur_dataset[name];
        return balance_capita;
    }
//update color function
    function updateColor(d,i){
            var balance_per_capita = getBalance_Capita(d.properties.name);
            console.log(d.properties.name + ' ' +balance_per_capita);
            return linear(balance_per_capita);
    }
// create slider
//
//
    var step = 2;
    var xScale = d3.scaleLinear()
        .domain([2007, 2016])
        .range([0, 300])
        .nice()
        .clamp(true);

    var slider = svg.append("g")
        .attr("class", "slider")
        .attr("transform", "translate(" + 150 + "," + height / 1.35 + ")");

    var range = [2007, 2016];
    var rangeValues = d3.range(range[0], range[1]).concat(range[1]);


    slider.append("line")
        .attr("class", "track")
        .attr("x1", xScale.range()[0])
        .attr("x2", xScale.range()[1])
        .select(function () {
            return this.parentNode.appendChild(this.cloneNode(true));
        })
        .attr("class", "track-inset")
        .select(function () {
            return this.parentNode.appendChild(this.cloneNode(true));
        })
        .attr("class", "track-overlay")
        .call(d3.drag()
            .on("start.interrupt", function () {
                slider.interrupt();
            })
            .on("start drag", function () {

                hue(d3.event.x);
            }));

    slider.insert("g", ".track-overlay")
        .attr("class", "ticks")
        .attr("transform", "translate(0," + 18 + ")")
        .selectAll("text")
        .data(xScale.ticks(10))
        .enter().append("text")
        .attr("x", xScale)
        .attr("text-anchor", "middle")
        .text(function (d) {
            return d;
        });

    var handle = slider.insert("circle", ".track-overlay")
        .attr("class", "handle")
        .attr("r", 8);

    slider.transition() // Gratuitous intro!
        .duration(750)
        .tween("hue", function () {
            var i = d3.interpolate(0, 70);
            return function (t) {
                hue(i(t));
            };
        });

    function hue(h) {
        var x = h, index = null, midPoint, cx, xVal;
        x = (x / 300) * 9 + 2007;
        if (step) {
            // if step has a value, compute the midpoint based on range values and reposition the slider based on the mouse position
            for (var i = 0; i < rangeValues.length - 1; i++) {
                if (x >= rangeValues[i] && x <= rangeValues[i + 1]) {
                    index = i;
                    break;
                }
            }
            midPoint = (rangeValues[index] + rangeValues[index + 1]) / 2;
            if (x < midPoint) {
                xVal = rangeValues[index];
            } else {
                xVal = rangeValues[index + 1];
            }
        } else {
            // if step is null or 0, return the drag value as is
            xVal = xScale.toFixed(3);
        }
        // use xVal as drag value
        cx = (parseInt(xVal) - 2007) * 300 / 9;
        updateMap(xVal);
        handle.attr('cx', cx);
        // svg.style("background-color", d3.hsl(h, 0.8, 0.8));
    }

    function  updateMap(year) {
        year = +year;
        if (currentYear !=  year) {
            currentYear = year;
                svg.selectAll("path")
                    .attr("fill", updateColor)

        }
    }

});


//create color legend
var linear = d3.scaleThreshold()
    .domain([2,4,6,8])
    .range(["#B12000", "#FF7647","#FFEF64","#BAFF50","#00FF00"]);

var svg = d3.select("svg");

svg.append("g")
    .attr("class", "legendLinear")
    .attr("transform", "translate(0,35)");

var legendLinear = d3.legendColor()
    .labelFormat(d3.format(""))
    .labels(d3.legendHelpers.thresholdLabels)
    .scale(linear);

svg.append('text')
    .text('(10,000 Yuan)')
    .attr("x", 18)
    .attr("y", 150);

svg.select(".legendLinear")
    .call(legendLinear);


svg.append('text')
    .text('Pension Assets Per Capita')
    .attr("font-size", "18")
    .attr("font-weight", "bold")
    .attr("x", 0)
    .attr("y", 20);

//*************************
// create chart
//*************************

var margin = {
        top: 70,
        right: 40,
        bottom: 150,
        left: 190
    },
    w = 650 - margin.left - margin.right,
    h = 500 - margin.top - margin.bottom,
    padding = 30;
var xScale, yScale, xAxis, yAxis, line;  //Empty, for now


//Function for converting CSV values from strings to Dates and numbers
var rowConverter = function (d, _, columns) {

    d.date = +d.date;
    for (var i = 1, n = columns.length, c; i < n; ++i) d[c = columns[i]] = +d[c];
    return d;
}

//Load in data
d3.csv("balance_per_capita.csv", rowConverter, function (data) {

    var dataset = data;

    //create another data array, id is province name
    var provinces = data.columns.slice(1).map(function (id) {
        console.log('id' + id );
        return {
            id: id,
            values: data.map(function (d) {
                console.log('date ' + d.date + 'balance ' + d[id]);
                return {date: d.date, balance: d[id]};

            })
        };
    });

    //Scale Changes as we Zoom
    var zoom = d3.zoom()
        .scaleExtent([1, 40])
        .translateExtent([[-100, -100], [width + 90, height + 100]])
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

//************************************************************
// Crete Line
//************************************************************
    var provinces = svg.selectAll(".provinces")
        .data(provinces)
        .enter().append("g")
        .attr("class", "provinces");

    var path = provinces.append("path")
        .attr("class", "line")
        .attr("id", function (d,i) {
            return 'line' + i;
        })
        .attr("stroke-width", 2)
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

            d3.select("#province_name" + i)
                .style("opacity",1);

            d3.selectAll("." + d.id)
                .style("opacity", 1)
                .style("fill", "red");

            // d3.selectAll(".dot"+d.id)
            //     .style("opacity",1)

        })
        .on("mouseout", function(d,i){

            d3.select(this)
                .style("stroke","grey")
                .style("opacity", 0.4);


            d3.select("#province_name" + i)
                    .style("opacity",0);


            d3.selectAll("." + d.id)
                .style("fill", "grey")
                .style("opacity", 0);

            // d3.selectAll(".dot"+ d.id)
            //     .style("opacity", 0)
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
        .attr("id",function(d, i){

            return 'province_name' + i;
        })
        .attr("transform", function (d) {
            return "translate(" + xScale(d.value.date) + "," + yScale(d.value.balance) + ")";
        })
        .attr("x", 3)
        .attr("y", function (d) {
            if (d.id == 'Tibet') {
                return 15;
            } else {
                return 3;
            }
        })
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
        .attr("class", function (d,i) {
            return d.id;
        })
        .attr("r", 4)
        .attr("cx", function(d) { return xScale(d.date); })
        .attr("cy", function(d) { return yScale(d.balance); })
        .style("opacity", 0);

    dots.attr("clip-path", "url(#clip)");

    // var dot_text = provinces.selectAll("text")
    //     .data(function(d){
    //
    //         d.values.forEach(function (value) {
    //             value["id"] = d.id;
    //         });
    //         d = d.values;
    //         return d;
    //     })
    //     .enter()
    //     .append("text")
    //     .attr("class", function (d) {
    //         return "dot"+d.id;
    //     })
    //     .attr("transform", function (d) {
    //         return "translate(" + xScale(d.date) + "," + yScale(d.balance) + ")";
    //     })
    //     .attr("x", 1)
    //     .attr("y", 15)
    //     .style("font", "10px sans-serif")
    //     .style("opacity", 0)
    //     .text(function (d) {
    //         return d.balance;
    //     });
    //
    // //not work???
    // dot_text.attr("clip-path", "url(#clip)");

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
        .attr("y", 0 - 80)
        .attr("x", 0 - (h / 2))
        .attr("dy", "1em")
        .style("text-anchor", "middle")
        .text("Pension Assets Per Capita (10,000 Yuan)");

    // //add text label for x axis
    // svg.append("text")
    //     .attr("transform",
    //         "translate(" + (w + 60) + " ," +
    //         (h + 20) + ")")
    //     .style("text-anchor", "end")
    //     .text("Year");

    // gridlines in x axis function
    function make_x_gridlines() {
        return d3.axisBottom(xScale)
            .ticks(10)

    }

    // gridlines in y axis function
    function make_y_gridlines() {
        return d3.axisLeft(yScale)
            .ticks(10)
    }

    // add the X gridlines
    svg.append("g")
        .attr("class", "grid")
        .attr("transform", "translate(0," + h + ")")
        .call(make_x_gridlines()
            .tickSize(-h)
            .tickFormat("")
        )
        .style("opacity", 0.2);

    // add the Y gridlines
    svg.append("g")
        .attr("class", "grid")
        .call(make_y_gridlines()
            .tickSize(-w)
            .tickFormat("")
        )
        .style("opacity", 0.2);



});