
var width  = 400;
var height = 400;

var svg = d3.select("#map").append("svg")
    .attr("width", width)
    .attr("height", height)
    .append("g")
    .attr("transform", "translate(0,0)");


var projection = d3.geoMercator()
    .center([107, 31])
    .scale(300)
    .translate([width/2, height/2]);


var path = d3.geoPath()
    .projection(projection);


d3.json("china.geojson", function(error, root) {

    if (error)
        return console.error(error);

    svg.selectAll("path")
        .data( root.features )
        .enter()
        .append("path")
        .attr("stroke","#000")
        .attr("stroke-width",1)
        .attr("d", path )
        .on("mouseover",function(d,i){
            d3.select(this)
                .attr("fill","yellow");
        })
        .on("mouseout",function(d,i){
            d3.select(this)
                .attr("fill",color(i));
        });

});