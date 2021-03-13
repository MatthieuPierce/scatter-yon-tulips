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
  right: padding,
  bottom: padding,
  left: padding + 10
};
let width = 800;
let height = 600;
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


let dataset;
// Datset source
const dataUrl = 'https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json';

// fetch dataset & render marks
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
    .call(xAxis)
    .call(g => selectAll("#x-axis .tick text")
      .text(t => timeFormat("%Y")(t)));

  // yAxis
  const yAxis = axisLeft(yScale);
  chart.append("g")
    .attr("id", "y-axis")
    .attr("transform", `translate(${0}, ${0})`)
    .call(yAxis)
    .call(g => selectAll("#y-axis .tick text")
      .text(t => timeFormat("%M:%S")(t))
      )
      ;

  // legend

  // tooltip
  let tooltip = select("#chart-container").append("div")
    .style("opacity", 1)
    .style("z-index", 20)
    .style("background", `hsla(220, 40%, 20%, 0.9)`)
    .style("border-width", "1px")
    .style("border-radius", "2px")
    .style("padding", "0px 5px")
    .style("position", "absolute")
    .style("font-size", "1.2rem")
    .style("text-align", "center")
    .attr("id", "tooltip")
    .html(`<p>There sure is plenty of html in here</p>
      <p>Yes, nobody is likely to be a clever fellow about these Ps</p>`);

  // handle mouseOver/focus
  const handleMouseOver = (event, d) => {

  }
  // handle mouseOut/leave
  const handleMouseOut = (event, d) => {
    
  }

  
  // marks (circles)
  chart.selectAll("circle")
    .data(dataset)
    .enter()
    .append("circle")
    .attr("cx", d => xScale(d[xValue]))
    .attr("cy", d => yScale(d[yValue]))
    .attr("r", 12)
    .attr("fill", d => (d[colorValue])
      ? `hsla(20, 70%, 50%, 0.4)` 
      : `hsla(150, 70%, 50%, 0.4)`)
    .on("mouseover pointerover focus", handleMouseOver)
    .on("mouseout pounterout pointerleave", handleMouseOut)

  }
);



