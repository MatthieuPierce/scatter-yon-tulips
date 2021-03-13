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
 } from 'd3';

// Chart parameters
const padding = 20;
let margin = {
  top: padding,
  right: padding,
  bottom: padding,
  left: padding
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

