import './index.css';
// import * as d3 from 'd3';
import { 
  select, 
  scaleTime, 
  scaleLinear, 
  scaleSequential, 
  json, 
  min, 
  max,
  interpolateReds,
  axisBottom,
  axisLeft,
  selectAll,
  timeFormat
 } from 'd3';

// chart objectives
// race times for the 35 fastest times up Alpe d'Huez 
// vs.years;
// categorical color to distinguish doping allegations: true/false
// tooltip with details: {Name}: {Nationality} / Year: {Year} Time: {Time} /
// <br> / {Doping notes} [[optional: URL]]

// Chart parameters
const padding = 40;
let margin = {
  top: padding,
  right: padding + 5,
  bottom: padding,
  left: padding + 10
};
let width = 600;
let height = 450;
let innerWidth = width - margin.left - margin.right;
let innerHeight = height - margin.top - margin.bottom;

// Add primary SVG to div, set viewBox parameters and translate for margins
let chart = select('#chart-container')
  .append('svg')
  .attr("id", "chart")
  .attr("preserveAspectRatio", "xMinYMin meet")
  .attr("viewBox", `0 0 ${width} ${height}`)
  .attr("svg-content", true)
  .style("background", "var(--secondary-color)")
  .style("color", "var(--primary-color)")
  //Margin convention
  .append('g')
  .attr("transform", `translate(${margin.left}, ${margin.top})`)
  .attr("id", "inner-group")
  ;

// Helper Function: simple clamp (for use in bounding tooltip position )
let clamp = (min, val, max) => Math.max(min, Math.min(val, max));

let dataset;
// Datset source
const dataUrl = 'https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json';

// Fetch Dataset & Render Marks
json(dataUrl).then(data => {

  // console dataset to examine
  console.log(data);
  // Doping: string, Name: string, Nationality: string (iso 3166-1 alpha-3),
  // Place: number, Seconds: number, Time: string (converted string of Seconds),
  // URL: string (src for Doping), Year: number

  // parse dataset
  const dataset = data.map(d => {
    return {
      ...d,
      TimeMins: new Date(d.Seconds * 1000),
      // used string literal to force parsing the number year as year
      // alternative would be (d.Year, 0) to indicate YYYY jan 1, 00 etc.
      Year: new Date(`${d.Year}`),
    }
  });

  const xValue = "Year";
  const yValue = "TimeMins"
  const colorValue = "Doping"

  // calc xMin xMax yMin yMax (or extent)
  const xMin = min(dataset, d => d[xValue]);
  const xMax = max(dataset, d => d[xValue]);
  const yMin = min(dataset, d => d[yValue]);
  const yMax = max(dataset, d => d[yValue]);

  // xScale 
  const xScale = scaleTime()
    .domain([xMin, xMax])
    .range([0, innerWidth])
    .nice()
    ;

  // yScale
  const yScale = scaleTime()
    .domain([yMin, yMax])
    .range([0, innerHeight])
    .nice();

  // xAxis 
  const xAxis = axisBottom(xScale);
  chart.append("g")
    .attr("id", "x-axis")
    .attr("transform", `translate(0, ${innerHeight})`)
    .style("color", "var(--primary-color)")
    .call(xAxis)
    .call(g => g.selectAll("#x-axis .tick text")
      .text(t => timeFormat("%Y")(t))
      // .attr("fill", "red")
      )
    .call(g => g.select(".domain")
      .attr("stroke-opacity", 0.5));

  // yAxis
  const yAxis = axisLeft(yScale);
  chart.append("g")
    .attr("id", "y-axis")
    .attr("transform", `translate(${0}, ${0})`)
    .style("color", "var(--primary-color)")
    .call(yAxis)
    .call(g => g.selectAll("#y-axis .tick text")
      .text(t => timeFormat("%M:%S")(t))
      )
    .call(g => g.select(".domain")
      .attr("stroke-opacity", 0.5));

  // Legend

  // Tooltip
  let tooltip = select("#chart-container").append("div")
    .style("opacity", 1)
    .style("z-index", 0)
    .style("background", `hsla(220, 40%, 20%, 0.0)`)
    .style("border-width", "1px")
    .style("border-radius", "2px")
    .style("padding", "0px 5px")
    .style("position", "absolute")
    .style("font-size", "1rem")
    .style("text-align", "center")
    .attr("id", "tooltip")
    .html(`<p>There sure is plenty of html in here</p>`);

  // Handle mouseOver/focus on marks
  const handleMouseOver = (event, d) => {
    // Style current mark
    select(event.currentTarget)
      .attr("stroke-width", "2px")
      .attr("opacity", 1)

    // Change message depending on presence of d.Doping value
    if (d.Doping) {
      tooltip
        .html(`
          <div>
            <p>${d.Name}</p>
            <p>${d.Nationality}</p>
            <p>${d.Time} in ${timeFormat("%Y")(d.Year)}</p>
            <p class="doping">${d.Doping}</p>
          </div>`)
    } else {
      tooltip
        .html(`
          <div>
            <p>${d.Name}</p>
            <p>${d.Nationality}</p>
            <p>${d.Time} in ${timeFormat("%Y")(d.Year)}</p>
            <p class="no-doping">Blessedly, no doping allegations yet</p>
          </div>`)
    }

    // Position and transition tooltip
    let tooltipDimensions = document.querySelector("#tooltip")
      .getBoundingClientRect();
    let chartDimensions = document.querySelector("#chart")
      .getBoundingClientRect(); 
    
    tooltip
      .attr("data-year", d => d[xValue])
      .style("top",
        `${clamp(
          0,
          // event.offsetY - tooltipDimensions.height - 8,
          event.offsetY - tooltipDimensions.height,
          chartDimensions.height - tooltipDimensions.height
        )}px`)
      .style("left",
        `${clamp(
          margin.left,
          event.offsetX,
          chartDimensions.width - tooltipDimensions.width
        )}px`)
      .style("z-index", 20)
      .transition()
      .duration(50)
      .style("opacity", 1)

    
  }
  // Handle mouseOut/leave
  const handleMouseOut = (event, d) => {

    select(event.currentTarget)
      .attr("opacity", 0.4)
      .attr("stroke-width", "1px");

    tooltip
      .attr("data-year", null)
      .html(null)
      .style("z-index", -1)
      .transition()
      .duration(250)
      .style("opacity", 0)
  }

  
  // marks (circles)
  chart.selectAll("circle")
    .data(dataset)
    .enter()
    .append("circle")
    .attr("class", "dot")
    .attr("data-xvalue", d => d[xValue])
    .attr("data-yvalue", d => d[yValue])
    .attr("cx", d => xScale(d[xValue]))
    .attr("cy", d => yScale(d[yValue]))
    .attr("r", 14)
    .attr("opacity", 0.4)
    .attr("fill", d => (d[colorValue])
      ? `var(--doping-color)` 
      : `var(--no-doping-color)`)
    .attr("stroke", `hsla(0, 0%, 0%, 1)`)
    .attr("stroke-width", "1px")
    .attr("stroke-linejoin", "round")
    .attr("stroke-dasharray", "4 1 3 1 2 1")
    .on("mouseover pointerover focus", handleMouseOver)
    .on("mouseout pounterout pointerleave", handleMouseOut)

  }
);



