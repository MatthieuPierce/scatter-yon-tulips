  import { select } from 'd3';
  
  // Initialize Tooltip
  export let tooltip = select("#chart-container").append("div")
    .style("opacity", 1)
    .style("z-index", 0)
    .style("position", "absolute")
    .attr("id", "tooltip")
    .attr("visibility", "hidden")
    .html(`<p>There sure is plenty of html in here</p>`);