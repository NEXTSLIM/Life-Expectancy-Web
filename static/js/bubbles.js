  
    
    // set the dimensions and margins of the graph
    var margin = {top: 40, right: 150, bottom: 60, left: 30},
        width = 800 - margin.left - margin.right,
        height = 420 - margin.top - margin.bottom;
    
    // append the svg object to the body of the page
    var svg = d3.select("#bubbles")
      .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
      .append("g")
        .attr("transform",
              "translate(" + margin.left + "," + margin.top + ")");
    
    //Read the data
    d3.csv("../static/data/MLdata1.csv", function(data) {
        data1 = data.filter(function(row) {
            return row['Year'] == '2019'
        })
        console.log(data)
        years = ["1999","2000","2001","2002","2003",
        "2004","2005","2006","2007","2008","2009","2010",
        "2011","2012","2013","2014","2015","2016",
        "2017","2018","2019"]
  
      d3.select("#selectButton")
        .selectAll('myOptions')
        .data(years)
        .enter()
    	.append('option')
        .text(function (d) { return d; }) // text showed in the menu
      .attr("value", function (d) { return d; }) // corresponding value returned by the button
    
      // Add X axis
      var x = d3.scaleLinear()
        .domain([0, 40])
        .range([ 0, width ]);
      svg.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x).ticks(5));
    
      // Add X axis label:
      svg.append("text")
          .attr("text-anchor", "end")
          .attr("x", width)
          .attr("y", height+50 )
          .text("Unemployment %");
    
      // Add Y axis
      var y = d3.scaleLinear()
        .domain([35, 90])
        .range([ height, 0]);
      svg.append("g")
        .call(d3.axisLeft(y));
    
      // Add Y axis label:
      svg.append("text")
          .attr("text-anchor", "end")
          .attr("x", 0)
          .attr("y", -20 )
          .text("Life expectancy")
          .attr("text-anchor", "start")
    
      // Add a scale for bubble size
      var z = d3.scaleSqrt()
        .domain([200000, 1310000000])
        .range([ 2, 30]);
    
      // Add a scale for bubble color
      var myColor = d3.scaleOrdinal()
        .domain(["South-Asia", "Middle-East-North-Africa", "Europe-Central-Asia", "North-America", "Latin-America-Caribbean", "Sub-Saharan-Africa", "East-Asia-Pacific"])
        .range(d3.schemeSet1);

      // -1- Create a tooltip div that is hidden by default:
      var tooltip = d3.select("#my_dataviz")
        .append("div")
          .style("opacity", 0)
          .attr("class", "tooltip")
          .style("background-color", "black")
          .style("border-radius", "5px")
          .style("padding", "10px")
          .style("color", "white")
    
      // -2- Create 3 functions to show / update (when mouse move but stay on same circle) / hide the tooltip
      var showTooltip = function(d) {
        tooltip
          .transition()
          .duration(200)
        tooltip
          .style("opacity", 1)
          .html("Country: " + d.CountryName)
          .style("left", (d3.mouse(this)[0]+30) + "px")
          .style("top", (d3.mouse(this)[1]+30) + "px")
      }
      var moveTooltip = function(d) {
        tooltip
          .style("left", (d3.mouse(this)[0]+30) + "px")
          .style("top", (d3.mouse(this)[1]+30) + "px")
      }
      var hideTooltip = function(d) {
        tooltip
          .transition()
          .duration(200)
          .style("opacity", 0)
      }

      // What to do when one group is hovered
      var highlight = function(d){
        // reduce opacity of all groups
        d3.selectAll(".bubbles").style("opacity", .05)
        // expect the one that is hovered
        d3.selectAll("."+d).style("opacity", 1)
      }
    
      // And when it is not hovered anymore
      var noHighlight = function(d){
        d3.selectAll(".bubbles").style("opacity", 1)
      }

      // Add dots
      svg.append('g')
        .selectAll("circle")
        .data(data.filter(function(d){return d.Year==years[0]}))
        .enter()
        .append("circle")
          .attr("class", function(d) { return "bubbles " + d.Region })
          .attr("cx", function (d) { return x(d.unemployment); } )
          .attr("cy", function (d) { return y(d.life); } )
          .attr("r", function (d) { return z(d.population); } )
          .style("fill", function (d) { return myColor(d.Region); } )
        // -3- Trigger the functions for hover
        .on("mouseover", showTooltip )
        .on("mousemove", moveTooltip )
        .on("mouseleave", hideTooltip )
    
        // Add legend: circles
        var valuesToShow = [10000000, 100000000, 1000000000]
        var xCircle = width
        var xLabel = width + 50
        svg
          .selectAll("legend")
          .data(valuesToShow)
          .enter()
          .append("circle")
            .attr("cx", xCircle)
            .attr("cy", function(d){ return height - 100 - z(d) } )
            .attr("r", function(d){ return z(d) })
            .style("fill", "none")
            .attr("stroke", "black")
    
        // Add legend: segments
        svg
          .selectAll("legend")
          .data(valuesToShow)
          .enter()
          .append("line")
            .attr('x1', function(d){ return xCircle + z(d)} )
            .attr('x2', xLabel)
            .attr('y1', function(d){ return height - 100 - z(d) } )
            .attr('y2', function(d){ return height - 100 - z(d) } )
            .attr('stroke', 'black')
            .style('stroke-dasharray', ('2,2'))
    
        // Add legend: labels
        svg
          .selectAll("legend")
          .data(valuesToShow)
          .enter()
          .append("text")
            .attr('x', xLabel)
            .attr('y', function(d){ return height - 100 - z(d) } )
            .text( function(d){ return d/1000000 } )
            .style("font-size", 10)
            .attr('alignment-baseline', 'middle')
    
        // Legend title
        svg.append("text")
          .attr('x', xCircle)
          .attr("y", height - 100 +30)
          .text("Population (M)")
          .attr("text-anchor", "middle")
    
        // Add one dot in the legend for each name.
        var size = 20
        var allgroups = ["South-Asia", "Middle-East-North-Africa", "Europe-Central-Asia", "North-America", "Latin-America-Caribbean", "Sub-Saharan-Africa", "East-Asia-Pacific"]
        svg.selectAll("myrect")
          .data(allgroups)
          .enter()
          .append("circle")
            .attr("cx", width + 10)
            .attr("cy", function(d,i){ return 10 + i*(size+5)}) // 100 is where the first dot appears. 25 is the distance between dots
            .attr("r", 7)
            .style("fill", function(d){ return myColor(d)})
            .on("mouseover", highlight)
            .on("mouseleave", noHighlight)
    
        // Add labels beside legend dots
        svg.selectAll("mylabels")
          .data(allgroups)
          .enter()
          .append("text")
            .attr("x", width + 20 + size*.8)
            .attr("y", function(d,i){ return i * (size + 5) + (size/2)}) // 100 is where the first dot appears. 25 is the distance between dots
            .style("fill", function(d){ return myColor(d)})
            .text(function(d){ return d})
            .attr("text-anchor", "left")
            .style("alignment-baseline", "middle")
            .on("mouseover", highlight)
            .on("mouseleave", noHighlight)





      function update(selectedGroup) {
        d3.selectAll("circle").remove()
        d3.selectAll("myrect").remove()
        var dataFilter = data.filter(function(d){return d.Year==selectedGroup})
        svg.append('g')
        .selectAll("circle")
        .data(dataFilter)
        .enter()
        .append("circle")
          .attr("class", function(d) { return "bubbles " + d.Region })
          .attr("cx", function (d) { return x(d.unemployment); } )
          .attr("cy", function (d) { return y(d.life); } )
          .attr("r", function (d) { return z(d.population); } )
          .style("fill", function (d) { return myColor(d.Region); } )
        // -3- Trigger the functions for hover
        .on("mouseover", showTooltip )
        .on("mousemove", moveTooltip )
        .on("mouseleave", hideTooltip )

        svg
          .selectAll("legend")
          .data(valuesToShow)
          .enter()
          .append("text")
            .attr('x', xLabel)
            .attr('y', function(d){ return height - 100 - z(d) } )
            .text( function(d){ return d/1000000 } )
            .style("font-size", 10)
            .attr('alignment-baseline', 'middle')
    
        // Legend title
        svg.append("text")
          .attr('x', xCircle)
          .attr("y", height - 100 +30)
          .text("Population (M)")
          .attr("text-anchor", "middle")
    
        // Add one dot in the legend for each name.
        var size = 20
        var allgroups = ["South-Asia", "Middle-East-North-Africa", "Europe-Central-Asia", "North-America", "Latin-America-Caribbean", "Sub-Saharan-Africa", "East-Asia-Pacific"]
        svg.selectAll("myrect")
          .data(allgroups)
          .enter()
          .append("circle")
            .attr("cx", width + 10)
            .attr("cy", function(d,i){ return 10 + i*(size+5)}) // 100 is where the first dot appears. 25 is the distance between dots
            .attr("r", 7)
            .style("fill", function(d){ return myColor(d)})
            .on("mouseover", highlight)
            .on("mouseleave", noHighlight)
    
        // Add labels beside legend dots
        svg.selectAll("mylabels")
          .data(allgroups)
          .enter()
          .append("text")
            .attr("x", width + 20 + size*.8)
            .attr("y", function(d,i){ return i * (size + 5) + (size/2)}) // 100 is where the first dot appears. 25 is the distance between dots
            .style("fill", function(d){ return myColor(d)})
            .text(function(d){ return d})
            .attr("text-anchor", "left")
            .style("alignment-baseline", "middle")
            .on("mouseover", highlight)
            .on("mouseleave", noHighlight)
        }

        d3.select("#selectButton").on("change", function(d) {
        // recover the option that has been chosen
            var selectedOption = d3.select(this).property("value")
        // run the updateChart function with this selected option
            update(selectedOption)
      })

     


    })
