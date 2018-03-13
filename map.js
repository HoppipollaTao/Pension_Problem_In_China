var width = 500;
var height = 400;

var svg = d3.select("#map").append("svg")
    .attr("width", width)
    .attr("height", height)
    .append("g")
    .attr("transform", "translate(40,0)");


var projection = d3.geoMercator()
    .center([107, 31])
    .scale(300)
    .translate([width / 2, height / 2]);


var path = d3.geoPath()
    .projection(projection);


d3.json("china.geojson", function (error, root) {

    if (error)
        return console.error(error);

    svg.selectAll("path")
        .data(root.features)
        .enter()
        .append("path")
        .attr("stroke", "#000")
        .attr("stroke-width", 1)
        .attr("fill", "red")
        .attr("d", path)
        .on("mouseover", function (d, i) {
            d3.select(this)
                .attr("fill", "yellow");
        })
        .on("mouseout", function (d, i) {
            console.log(i);
            d3.select(this)
                .attr("fill", color(i));
        });

});

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
    .attr("transform", "translate(" + 10 + "," + height / 1.35 + ")");

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
    handle.attr('cx', cx);
    // svg.style("background-color", d3.hsl(h, 0.8, 0.8));
}


//create color legend
//
//
var color = d3.scaleThreshold()
    .domain([1, 10, 50, 200, 500, 1000, 2000, 4000])
    .range(['#7f3b08', '#b35806', '#e08214', '#fdb863', '#fee0b6', '#f7f7f7', '#d8daeb', '#b2abd2', '#8073ac']);

var x = d3.scaleSqrt()
    .domain([0, 4500])
    .rangeRound([0, 300]);

// append gradient bar
var legend = svg.append("defs")
    .append("svg:linearGradient")
    .attr("id", "gradient")
    .attr("x1", "100%")
    .attr("y1", "0%")
    .attr("x2", "100%")
    .attr("y2", "100%")
    .attr("spreadMethod", "pad");

legend.append("stop")
    .attr("offset", "0%")
    .attr("stop-color", "#FEE8c8")
    .attr("stop-opacity", 1);

legend.append("stop")
    .attr("offset", "100%")
    .attr("stop-color", "#B30000")
    .attr("stop-opacity", 1);

svg.append("rect")
    .attr("x", 50)
    .attr("width", 14)
    .attr("height", 100)
    .style("fill", "url(#gradient)")
    .attr("transform", "translate(0,10)");

var y = d3.scaleLinear().domain([0, 1000]).range([100, 0]);

var yAxis = d3.axisLeft(y);

svg.append("g")
    .attr("class", "y scale axis")
    .attr("transform", "translate(50,9)")
    .call(yAxis);


svg.append("text")
    .attr("transform", "rotate(-90)")
    .attr("x", -50)
    .attr("y", 20)
    .style("text-anchor", "middle")
    .text("title");

// svg.selectAll("rect")
//     .data(color.range().map(function (d) {
//         d = color.invertExtent(d);
//         console.log('print d ' + d);
//         if (d[0] == null) d[0] = x.domain()[0];
//         if (d[1] == null) d[1] = x.domain()[1];
//         console.log('1', x(d[0]));
//         return d;
//     }))
//     .enter().append("rect")
//     .attr("class", "rects")
//     .attr("height", 8)
//     .attr("x", function (d) {
//         console.log('1x', x(d[0]));
//         return x(d[0]);
//     })
//     .attr("width", function (d) {
//         return x(d[1]) - x(d[0]);
//     })
//     .attr("fill", function (d) {
//         return color(d[0]);
//     });























