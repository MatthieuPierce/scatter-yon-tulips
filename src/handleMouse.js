import { select, timeFormat } from 'd3';
import { xValue, yValue, colorValue } from './accessors';
import { clamp } from './helperFunctions';
import { tooltip } from './tooltip';
import { margin } from './chartParameters';

// Handle mouseOver/focus on marks
export const handleMouseOver = (event, d) => {
  // Style current mark
  select(event.currentTarget)
    .attr("stroke-width", "2px")
    .attr("opacity", 1)

    if (event.currentTarget.className.baseVal !== `legend-mark`) {
  // Change tooltip message depending on presence of d.Doping value
  if (d.dopingBool) {
    tooltip
      .html(`
          <p>${d.Nationality}</p>
          <p><strong>${d.Name}</strong></p>
          <p>${d.Time} in ${timeFormat("%Y")(d.Year)}</p>
          <p class="doping">${d.Doping}</p>
        `)
  } else {
    tooltip
      .html(`
          <p>${d.Nationality}</p>
          <p><strong>${d.Name}</strong></p>
          <p>${d.Time} in ${timeFormat("%Y")(d.Year)}</p>
          <p class="no-doping">Blessedly, no doping allegations yet</p>
        `)
  }

  // Position and transition tooltip
  let tooltipDimensions = document.querySelector("#tooltip")
    .getBoundingClientRect();
  let chartDimensions = document.querySelector("#chart")
    .getBoundingClientRect(); 
  
  tooltip
    .attr("visibility", "visible")
    .style("top",
      `${clamp(
        0,
        event.offsetY - tooltipDimensions.height,
        chartDimensions.height - tooltipDimensions.height - 2
      )}px`)
    .style("left",
      `${clamp(
        margin.left,
        event.offsetX + 1,
        chartDimensions.width - tooltipDimensions.width - 2
      )}px`)
    .attr("data-year", xValue(d))
    .style("z-index", 20)
    .transition()
    .duration(50)
    .style("opacity", 1)
      }
    // Only act on tooltip if mark class is not "legend-mark";
  // previously encased all tooltip activity above, had to be 
  // depreciated just to affecting opacity due to fcc-test constraints
  // if (event.currentTarget.className.baseVal !== `legend-mark`) {
  //   }
  
}

// Handle mouseOut/leave
export const handleMouseOut = (event, d) => {
  select(event.currentTarget)
    .attr("opacity", 0.4)
    .attr("stroke-width", "1px");

  tooltip
    .attr("data-year", null)
    // .html(null)
    .style("z-index", -1)
    .transition()
    .duration(250)
    .style("opacity", 0)
    .attr("visibility", "hidden")

}