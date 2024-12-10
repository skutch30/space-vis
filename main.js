// page setup
const width = window.innerWidth; // width of whole page
const height = window.innerHeight; // height of whole page
const margin = {
    top: 20,
    right: 30,
    bottom: 50,
    left: 70
};
const scatterWidth = 600; // width of just scatterplot
const scatterHeight = 400; // height of just scatterplot
const barWidth = 350; // width of just barchart
const barHeight = 400; // height of just barchart
const containerWidth = scatterWidth + barWidth + margin.left + margin.right + 100; // width of container
const containerHeight = scatterHeight + margin.top + margin.bottom; // height of container

// svg for visualization
const svg = d3.select("#visualization")
    .append("svg")
    .attr("width", width)
    .attr("height", height);

// 500 background stars at random sizes
const stars = d3.range(500).map(() => ({
    x: Math.random() * width,
    y: Math.random() * height,
    radius: Math.random() * 2.5,
    opacity: Math.random()
}));

// append stars to background
svg.selectAll("circle")
    .data(stars)
    .enter()
    .append("circle")
    .attr("cx", d => d.x)
    .attr("cy", d => d.y)
    .attr("r", d => d.radius)
    .style("fill", "white")
    .style("opacity", d => d.opacity);

// black box container to keep the visualizations inside so they don't get overrun by stars
svg.append("rect")
    .attr("x", 130)
    .attr("y", 75)
    .attr("width", containerWidth)
    .attr("height", containerHeight)
    .attr("fill", "black")
    .attr("stroke", "white")
    .attr("stroke-width", 2);

// moons data
d3.csv("moons.csv").then(data => {
    data.forEach(d => {
        d.Year_of_Discovery = +d.Year_of_Discovery;
        d.Diameter = +d.Diameter;
    });

    // 2 different visualizations: scatterplot and bar chart

    // creating scales for axes and data plotting on scatterplot
    const scatterplot = svg.append("g")
        .attr("transform", `translate(${(width - containerWidth) / 2 + margin.left},${70 + margin.top})`);

    var xScatterScale = d3.scaleLinear()
        .domain([1600, 2020])
        .range([0, scatterWidth]);

    var yScatterScale = d3.scaleLinear()
        .domain([0, 6000])
        .range([scatterHeight, 0]);

    var sizeScale = d3.scaleSqrt()
        .domain([0, 6000])
        .range([3, 15]);

    // add scatterplot x-axis
    scatterplot.append("g")
        .attr("transform", `translate(0,${scatterHeight})`)
        .call(d3.axisBottom(xScatterScale).tickValues([1600, 1700, 1800, 1900, 2000, 2020]).tickFormat(d3.format("d")));

    // add scatterplot y-axis
    scatterplot.append("g")
        .call(d3.axisLeft(yScatterScale));

    // add scatterplot x-axis label
    scatterplot.append("text")
        .attr("x", scatterWidth / 2)
        .attr("y", scatterHeight + margin.bottom - 10)
        .attr("text-anchor", "middle")
        .attr("font-size", "14px")
        .attr("fill", "white")
        .text("Year of Discovery");

    // add scatterplot y-axis label
    scatterplot.append("text")
        .attr("x", -scatterHeight / 2)
        .attr("y", -margin.left + 20)
        .attr("text-anchor", "middle")
        .attr("font-size", "14px")
        .attr("fill", "white")
        .attr("transform", "rotate(-90)")
        .text("Diameter (km)");

    // creating scales for axes and data plotting on barchart
    const barchart = svg.append("g")
        .attr("transform", `translate(${(width - containerWidth) / 2 + margin.left + scatterWidth + 70},${70 + margin.top})`);

    var xBarScale = d3.scaleBand()
        .domain([1600, 2020])
        .range([0, barWidth])
        .paddingInner(0.2);

    var yBarScale = d3.scaleLinear()
        .domain([0, 13])
        .range([barHeight, 0]);

    // add barchart x-axis
    barchart.append("g")
        .attr("class", "x-axis")
        .attr("transform", `translate(0,${barHeight})`)
        .call(d3.axisBottom(xBarScale));

    // add barchart y-axis
    barchart.append("g")
        .attr("class", "y-axis")
        .call(d3.axisLeft(yBarScale));

    // add barchart x-axis label
    barchart.append("text")
        .attr("x", barWidth / 2)
        .attr("y", barHeight + margin.bottom - 10)
        .attr("text-anchor", "middle")
        .attr("font-size", "14px")
        .attr("fill", "white")
        .text("Year of Discovery");

    // add barchart y-axis label
    barchart.append("text")
        .attr("x", -barHeight / 2)
        .attr("y", -margin.left + 35)
        .attr("text-anchor", "middle")
        .attr("font-size", "14px")
        .attr("fill", "white")
        .attr("transform", "rotate(-90)")
        .text("Number of Moons Discovered");

    // add title
    svg.append("text")
        .attr("x", width / 2)
        .attr("y", 50)
        .attr("text-anchor", "middle")
        .attr("font-size", "22px")
        .attr("font-weight", "bold")
        .attr("fill", "white")
        .text("Celestial Discoveries: The Moons of Our Solar System");

    // add my name to bottom left
    svg.append("text")
        .attr("x", 100)
        .attr("y", 685)
        .attr("text-anchor", "middle")
        .attr("font-size", "10px")
        .attr("fill", "white")
        .text("Madelyn Novelli, CS 4460, Fall 2024");

    // dropdown to filter planets
    const planets = ["All Planets", "Mercury", "Venus", "Earth", "Mars", "Jupiter",
        "Saturn", "Uranus", "Neptune", "Pluto"];

    const dropdown = d3.select("#planet-select");

    planets.forEach(planet => {
        dropdown.append("option")
            .attr("value", planet)
            .text(planet);
    });

    // tooltop for more info ab each scatterplot circle
    var tooltip = d3.select("body").append("div")
        .style("position", "absolute")
        .style("background-color", "white")
        .style("border", "1px solid black")
        .style("padding", "5px")
        .style("border-radius", "5px")
        .style("color", "black")
        .style("display", "none")
        .style("opacity", 0);

    function applyTooltip() {
        scatterplot.selectAll("circle")
            .on("mouseover", (event, d) => {
                tooltip.style("display", "block")
                    .html(`
                    <strong>Name:</strong> ${d.Name}<br>
                    <strong>Planet:</strong> ${d.Planet}<br>
                    <strong>Year of Discovery:</strong> ${d.Year_of_Discovery}<br>
                    <strong>Discoverer(s):</strong> ${d.Discoverer}<br>
                    <strong>Diameter:</strong> ${d.Diameter} km`)
                    .style("left", `${event.pageX + 10}px`)
                    .style("top", `${event.pageY - 20}px`)
                    .style("opacity", 1);
                svg.selectAll("circle").attr("opacity", 0.3); // all other circles' opacity = 0.3
                d3.select(event.target)
                    .attr("opacity", 0.8); // hovered circle opacity = 0.8
            })
            .on("mouseout", () => {
                tooltip.style("display", "none").style("opacity", 0);
                svg.selectAll("circle").attr("opacity", 0.5); // all circles go back to 0.5 opacity
            });
    }

    // update both charts based on selected planet
    let filteredData;
    function updateCharts(selectedPlanet) {
        if (selectedPlanet === "All Planets") {
            filteredData = data;
        } else {
            filteredData = data.filter(d => d.Planet === selectedPlanet);
        }

        // update scatterplot
        const circles = scatterplot.selectAll("circle").data(filteredData, d => d.Name);

        circles.exit().transition().attr("r", 0).remove();

        circles.enter().append("circle")
            .attr("cx", d => xScatterScale(d.Year_of_Discovery))
            .attr("cy", d => yScatterScale(d.Diameter))
            .attr("r", 0)
            .attr("fill", d => {
                // change color of circle to something that represents the planet
                if (d.Planet === "Earth") {
                    return "#00FF00";
                } else if (d.Planet === "Mars") {
                    return "#FF0000";
                } else if (d.Planet === "Jupiter") {
                    return "#ff7300";
                } else if (d.Planet === "Saturn") {
                    return "#ffe300";
                } else if (d.Planet === "Uranus") {
                    return "#00FFFF";
                } else if (d.Planet === "Neptune") {
                    return "#0000FF";
                } else {
                    return "#ffa5b6";
                }
            })
            .attr("opacity", 0.5)
            .transition()
            .duration(500)
            .attr("r", d => sizeScale(d.Diameter)) // size of circle should represent the relative diameter of the moon
            .on("end", applyTooltip);

        // calculate the number of moons discovered per year for the barchart
        function moonsPerYear(filteredData) {
            return Array.from(
                d3.group(filteredData, d => d.Year_of_Discovery),
                ([year, moons]) => ({year: +year, count: moons.length})
            );
        }

        const moons = moonsPerYear(filteredData);
        xBarScale.domain(moons.map(d => d.year));
        yBarScale.domain([0, d3.max(moons, d => d.count)]);

        // update x-axis of barchart when planets are filtered
        barchart.select(".x-axis")
            .transition()
            .duration(500)
            .call(d3.axisBottom(xBarScale)
                .tickFormat(d3.format("d"))
                .tickSizeOuter(0))
            .selectAll("text")
            .attr("transform", "rotate(-45)")
            .style("text-anchor", "end")
            // update the size of the x-axis labels when all planets are selected vs. just one
            .style("font-size", selectedPlanet === "All Planets" ? "6px" : "10px");

        // update y-axis of barchart when planets are filtered (scale changes according to planet chosen)
        barchart.select(".y-axis")
            .transition()
            .duration(500)
            .call(d3.axisLeft(yBarScale));

        const bars = barchart.selectAll("rect").data(moons, d => d.year);

        bars.exit().transition().duration(500).attr("height", 0).attr("y", barHeight).remove();

        bars.enter().append("rect")
            .attr("x", d => xBarScale(d.year))
            .attr("y", barHeight)
            .attr("width", xBarScale.bandwidth())
            .attr("height", 0)
            .attr("fill", "#69b3a2")
            .on("mouseover", (event, d) => {
                scatterplot.selectAll("circle")
                    .attr("opacity", circle => circle.Year_of_Discovery === d.year ? 1 : 0.3) // highlight moons from that year
            })
            .on("mouseout", () => {
                scatterplot.selectAll("circle")
                    .attr("opacity", 0.5); // all circles back to 0.5 opacity
            })
            .transition()
            .duration(500)
            .attr("y", d => yBarScale(d.count))
            .attr("height", d => barHeight - yBarScale(d.count));

        bars.transition().duration(500)
            .attr("x", d => xBarScale(d.year))
            .attr("y", d => yBarScale(d.count))
            .attr("width", xBarScale.bandwidth())
            .attr("height", d => barHeight - yBarScale(d.count));
    }

    // add storytelling aspects to the visualization: Mercury and Venus don't have moons, make a popup
    dropdown.on("change", function () {
        const selectedPlanet = d3.select(this).property("value");

        // show popup if selectedPlanet is Mercury or Venus
        if (selectedPlanet === "Mercury" || selectedPlanet === "Venus") {
            const popup = document.getElementById("popup");
            popup.style.display = "flex";

            // close popup
            document.getElementById("close-popup").onclick = function () {
                popup.style.display = "none";
            };
        }

        updateCharts(selectedPlanet);
    });

    updateCharts("All Planets");
});