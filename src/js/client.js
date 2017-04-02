import '../style.sass';

const url = "https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/global-temperature.json",
    margin = {top: 70, right: 30, bottom: 100, left: 100},
    width = 1260 - margin.left - margin.right,
    height = 700 - margin.top - margin.bottom;

const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

const palette = ["#213685", "#4375b4", "#74add1", "#abd8e8", "#e6f598", "#ffffbf", "#ffe090", "#faae61", "#f46d43", "#d73027", "#a10026"];

let svg = d3.select("#root").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

d3.json(url, function(error, d) {
    if (error) throw error;

    const tip = d3.tip()
        .attr('class', 'd3-tip')
        .offset([-10, 0])
        .html((d, st) => {
            return `<strong>${d.year} - ${months[d.month-1]}</strong>
      <div>${(d.variance + baseTemperature).toFixed(3)} &#x2103;</div>
      <div>${(d.variance).toFixed(3)} &#x2103;</div>
    `});
    svg.call(tip);

    const data = d.monthlyVariance;
    const baseTemperature = d.baseTemperature;

    const xScale = d3.scaleTime()
        .domain([new Date(d3.min(data, (d) => d.year),0), new Date(d3.max(data, (d) => d.year),0)])
        .range([0, width]);

    const yScale = d3.scaleLinear()
        .range([height, 0])
        .domain([12, 1]);

    const color = d3.scaleQuantile()
        .domain(d3.extent(data, (d) => d.variance + baseTemperature))
        .range(palette);

    const xAxis = d3.axisBottom(xScale)
        .ticks(d3.timeYear.every(10));

    const yAxis = d3.axisLeft(yScale)
        .tickFormat((d) => months[d - 1]);

    const legen = svg.append('g');
    let yearAxist = svg.append("g")
        .attr("class", "axis axis-years")
        .attr("transform", "translate(0," + (height + 1) + ")")
        .call(xAxis);

    yearAxist.append('text')
        .text("Years")
        .attr('x', width/2)
        .attr('y', '50px')
        .attr('class', 'mark');

    const monthAxist = svg.append("g")
        .attr("class", "axis axis-months")
        .call(yAxis);

    monthAxist.append("text")
        .text("Months")
        .attr('x', -height/2)
        .attr('y', -60)
        .attr('class', 'mark')
        .attr('transform', 'rotate(-90)');

    svg.selectAll(".tile")
        .data(data)
        .enter()
        .append("rect")
        .attr('class', "title")
        .attr('x', (d) => xScale(new Date(d.year, 0)))
        .attr('y', (d) => yScale(d.month-1))
        .attr('width', (d) => xScale(new Date(d.year, 0)) - xScale(new Date(d.year-1, 0)))
        .attr('height', (d) => yScale(d.month) - yScale(d.month-1))
        .style("fill", (d) => color(d.variance + baseTemperature))
        .on('mouseover', function(d) {
            tip.show(d);
        })
        .on('mouseout', function(d) {
            tip.hide(d);
        });

    let colorLeg = color.quantiles().slice();
    colorLeg.splice(0,0,0);

    const legend = legen.selectAll(".legend")
        .data(colorLeg)
        .enter()
        .append('g')
        .attr('class','leg');

    legend.append('rect')
        .attr('x', (d,i) => width/2 + 100 + 34 *i)
        .attr('y', height + 30)
        .attr('width', '30px')
        .attr('height', '30px')
        .style('fill', (d) => color(d));

    legend.append("text")
        .text((d) => d.toFixed(1))
        .attr('x', (d,i) => width/2 + 100 + 34*i)
        .attr('y', height + 75);
});