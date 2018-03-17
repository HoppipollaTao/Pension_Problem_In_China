var margin2 = {
        top: 30,
        right: 40,
        bottom: 150,
        left: 10,
        middle: 30
    },
    w = 400 - margin2.left - margin2.right,
    h = 400 - margin2.top - margin2.bottom,
    padding = 40;

//// Create button
d3.select("#population_pyramid").append("button")
    .attr("id", "change2018").text("2018");

d3.select("#population_pyramid").append("button")
    .attr("id", "change2050").text("2050");

var svg2 = d3.select("#population_pyramid").append("svg")
    .attr("width", w + margin2.left + margin2.right + 2 * padding)
    .attr("height", h + margin2.top + margin2.bottom)
    .append("g")
    .attr("transform", "translate(" + margin2.left + "," + margin2.top + ")");
    
var tooltipDiv = d3.select("#population_pyramid").append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);


// define left ands right group
var regionWidth = w / 2 - margin2.middle;
var pointA = regionWidth,
  pointB = w - regionWidth;

var leftBarGroup = svg2.append('g')
  .attr('transform', translation(pointA, 0) + 'scale(-1,1)');
var rightBarGroup = svg2.append('g')
  .attr('transform', translation(pointB, 0));

var xScale
    
d3.csv('population.csv', function(err, data) {

  data2 = data
  yr = "2018"

  data = data.filter(function(d) {
    return d.year == yr;
  });
  data.forEach(function(d) {
    d.male = +d.male;
    d.female = +d.female;
  });

  var totalPopulation = d3.sum(data, function(d) {
        return d.male + d.female;
    }),
    percentage = function(d) {
        return d / totalPopulation;
    };

  var maxCount = Math.ceil(Math.max(
        d3.max(data, function(d) {
            return percentage(d.male);
        }),
        d3.max(data, function(d) {
            return percentage(d.female);
        })
    )/0.05)*0.05;

 // define scale
  xScale2 = d3.scaleLinear()
    .domain([0, maxCount])
    .range([0, regionWidth])
    .nice();

  yScale2 = d3.scaleBand()
    .domain(data.map(function(d) {
      return d.age;
    }))
    .rangeRound([h, 0], 0.1);

  var yAxisLeft = d3.axisRight()
    .scale(yScale2)
    .tickSize(4, 0)
    .tickPadding(margin2.middle - 4);

  var yAxisRight = d3.axisLeft()
    .scale(yScale2)
    .tickSize(4, 0)
    .tickFormat('')

  var xAxisRight = d3.axisBottom()
    .scale(xScale2)
    .tickFormat(d3.format(",.1%"))
    .ticks(5)

  var xAxisLeft = d3.axisBottom()
    .scale(xScale2.copy().range([pointA, 0]))
    .tickFormat(d3.format(",.1%"))
    .ticks(5)

  svg2.append('g')
    .attr('class', 'axis y left')
    .attr('transform', translation(pointA, 0))
    .call(yAxisLeft)
    .selectAll('text')
    .style('text-anchor', 'middle');

  svg2.append('g')
    .attr('class', 'axis y right')
    .attr('transform', translation(pointB, 0))
    .call(yAxisRight)
    .append('text')
        .attr('class', 'axislabel')
        .attr('x', -20)
        .attr('y', -5)
        .text('Age');

  svg2.append('g')
    .attr('class', 'axis x left')
    .attr('transform', translation(0, h))
    .call(xAxisLeft)
    .append('text')
        .attr('class', 'axislabel')
        .attr('x', xScale2(maxCount/2))
        .attr('y', 35)
        .text('male, percent of total');

  svg2.append('g')
    .attr('class', 'axis x right')
    .attr('transform', translation(pointB, h))
    .call(xAxisRight)
    .append('text')
        .attr('class', 'axislabel')
        .attr('x', xScale2(maxCount/2))
        .attr('y', 35)
        .text('female, percent of total');

 // draw bars
 var sel1 = leftBarGroup.selectAll('.bar.left')
    .data(data)
    .enter()
    .append('rect')
    .attr('class', 'bar left')
    .attr('y', function(d) {
      return yScale2(d.age);
    })
    .attr("width", 0)
    .attr("opacity", 0)
    
    sel1.transition()
        .duration(500)
        .attr('width', function(d) {
          return xScale2(percentage(d.male));
        })
        .attr('height', yScale2.bandwidth())
        .attr("opacity", 1)
    
    sel1.on("mouseover", function(d) {
            tooltipDiv.transition()
                .duration(200)
                .style("opacity", 0.9);
            tooltipDiv.html("<strong> Males Age " + d.age + "</strong>" +
                    "<br />  Population: " + prettyFormat(d.male) +
                    "<br />" + (Math.round(percentage(d.male) * 1000) / 10) + "% of Total")
                .style("left", (d3.event.pageX) + "px")
                .style("top", (d3.event.pageY - 28) + "px");
        })
        .on("mouseout", function(d) {
            tooltipDiv.transition()
                .duration(500)
                .style("opacity", 0);
        })


  var sel2 = rightBarGroup.selectAll('.bar.right')
    .data(data)
    .enter().append('rect')
    .attr('class', 'bar right')
    .attr('x', 0)
    .attr('y', function(d) {
      return yScale2(d.age);
    })
    .attr('height', yScale2.bandwidth())
    .attr("width", 0)
  
    sel2.transition()
        .duration(1000)
        .delay(100)
        .attr('width', function(d) {
          return xScale2(percentage(d.female));
        })
    
    sel2.on("mouseover", function(d) {
        tooltipDiv.transition()
            .duration(200)
            .style("opacity", 0.9);
        tooltipDiv.html("<strong> Females Age " + d.age + "</strong>" +
                "<br />  Population: " + prettyFormat(d.female) +
                "<br />" + (Math.round(percentage(d.female) * 1000) / 10) + "% of Total")
            .style("left", (d3.event.pageX) + "px")
            .style("top", (d3.event.pageY - 28) + "px");
    })
    .on("mouseout", function(d) {
        tooltipDiv.transition()
            .duration(500)
            .style("opacity", 0);
    })

});


function updateData() {

      data = data2
      data = data.filter(function(d) {
        return d.year == yr;
      });;

      data.forEach(function(d) {
        d.male = +d.male;
        d.female = +d.female;
      });

      totalPopulation = d3.sum(data, function(d) {
        return d.male + d.female;
      })
      percentage = function(d) {
        return d / totalPopulation;
      };
    
    // update female bar
      var sel3 = rightBarGroup.selectAll('.bar.right')
        .attr('class', 'bar right')
        .data(data)
        .data(data, function(d) {
          return d.female;
        })
        .transition()
        .duration(1500)
        .attr('x', 0)
        .attr('y', function(d) {
          return yScale2(d.age);
        })
        .attr('width', function(d) {
          return xScale2(percentage(d.female));
        })
        .attr('height', yScale2.bandwidth())
      
    // update male bar
    var sel4 = leftBarGroup.selectAll('.bar.left')
        .attr('class', 'bar left')
        .data(data)
        .data(data, function(d) {
          return d.male;
        })
        .transition()
        .duration(1500)
        .attr('x', 0)
        .attr('y', function(d) {
          return yScale2(d.age);
        })
        .attr('width', function(d) {
          return xScale2(percentage(d.male));
        })
        .attr('height', yScale2.bandwidth())
    
}

// numbers with commas
function prettyFormat(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function translation(x, y) {
  return 'translate(' + x + ',' + y + ')';

}

// on click update
d3.select("#change2018").on("click", function(){
    
    yr = 2018
    updateData()
    
})

d3.select("#change2050").on("click", function(){
    
    yr = 2050
    updateData()
    
})
