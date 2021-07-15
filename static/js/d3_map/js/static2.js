// The svg
var svg = d3.select("#map"),
    width = +svg.attr("width"),
    height = +svg.attr("height");

// Map and projection
var path = d3.geoPath();
var projection = d3.geoNaturalEarth()
    .scale(width / 2 / Math.PI)
    .translate([width / 2, height / 2])
var path = d3.geoPath()
    .projection(projection);

// Data and color scale
var data = d3.map();
var colorScheme = d3.schemeBlues[6];
colorScheme.unshift("#eee")
var colorScale = d3.scaleThreshold()
    .domain([0, 41, 51, 61, 71, 81, 91, 101])
    .range(colorScheme);

// Legend
var g = svg.append("g")
    .attr("class", "legendThreshold")
    .attr("transform", "translate(20,20)");
g.append("text")
    .attr("class", "caption")
    .attr("x", 0)
    .attr("y", -6)
    .text("Life Expectancy");
var labels = ['0-40', '50-60', '60-70', '70-80', '80-90', '90-100', '100+'];
var legend = d3.legendColor()
    .labels(function (d) { return labels[d.i]; })
    .shapePadding(4)
    .scale(colorScale);
svg.select(".legendThreshold")
    .call(legend);

// Load external data and boot
// d3.queue()
//     .defer(d3.json, "http://enjalot.github.io/wwsd/data/world/world-110m.geojson")
//     .defer(d3.csv, "../data/MLdata1.csv", function(d) {
//         data.set(d.CountryCode, +d.life, +d.Year);
//     })
//     .await(ready);

d3.json("http://enjalot.github.io/wwsd/data/world/world-110m.geojson", function(error, topology){
            console.log(topology.features)
    d3.csv("data/MLdata1.csv", function(d) {
        d=d.filter(function(row) {
        return row['Year'] == '2000'
        })
        
        data.set(d.CountryCode, +d.life);
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

    // function ready(error, topo) {
    //     if (error) throw error;
        
        let mouseOver = function(d) {
        d3.selectAll(".Country")
        .transition()
        .duration(200)
        .style("opacity", .5)
        d3.select(this)
        .transition()
        .duration(200)
        .style("opacity", 1)
        .style("stroke", "black")

    }

    let mouseLeave = function(d) {
        d3.selectAll(".Country")
        .transition()
        .duration(200)
        .style("opacity", .8)
        d3.select(this)
        .transition()
        .duration(200)
        .style("stroke", "transparent")
    }

        // Draw the map
        svg.append("g")
            .attr("class", "countries")
            .selectAll("path")
            .data(topology.features)
            .enter().append("path")
                .attr("fill", function (d){
                    // Pull data for this country
                    d.life = data.get(d.id) || 0;
                    console.log(d.life)
                    // Set the color
                    return colorScale(d.life);
                })
                .attr("d", path)
                // .on("mouseover", mouseOver )
                // .on("mouseleave", mouseLeave )


    //     function update(selectedGroup) {
    //     d3.selectAll(".country").remove()
    //     console.log(Object.values(d))
    //     // var dataFilter = data.filter(function(d){return d.Year==selectedGroup})
    //     svg.append("g")
    //         .attr("class", "countries")
    //         .selectAll("path")
    //         .data(topo.features)
    //         .enter().append("path")
    //             .attr("fill", function (d){
    //                 // Pull data for this country
    //                 d.life = data.get(d.id) || 0;
    //                 // console.log(d.id)
    //                 // Set the color
    //                 return colorScale(d.life);
    //             })
    //             .attr("d", path)
    //             .on("mouseover", mouseOver )
    //         .on("mouseleave", mouseLeave )

    //     d3.select("#selectButton").on("change", function(d) {
    //     // recover the option that has been chosen
    //         var selectedOption = d3.select(this).property("value")
    //     // run the updateChart function with this selected option
    //         update(selectedOption)
    //   })
    //     .on("mouseover", function(d) {
    //  // var xpos = projection(newData[d].coord)[0];
    //  // var ypos = projection(newData[d].coord)[1];

    //   var information = "<b>" + d + "</b><br>" + newData[d].life;

    //   div.transition()    
    //     .duration(200)    
    //     .style("opacity", .9);
    //   div.html(information)  
    //     .style("left", (d3.event.pageX) + "px")   
    //     .style("top", (d3.event.pageY) + "px");  
    //   })          
    //   .on("mouseout", function(d) {   
    //     div.transition()    
    //     .duration(500)    
    //     .style("opacity", 0); 
    //   });
})})