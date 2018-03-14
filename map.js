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
                .attr("fill", "yellow");
        })
        .on("mouseout", function (d, i) {
            console.log(i);
            d3.select(this)
                .attr("fill", color(i));
        });

    function getBalance_Capita(name) {
        var count = currentYear - 2007 ;
        var cur_dataset = dataset[count];
        var balance_capita = cur_dataset[name];
        return balance_capita;
    }
//update color function
    function updateColor(d,i){
            var balance_per_capita = getBalance_Capita(d.properties.name)/10000;
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
    .attr("x", 10)
    .attr("y", 160);

svg.select(".legendLinear")
    .call(legendLinear);







