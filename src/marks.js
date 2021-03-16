import { xValue, yValue, colorValue } from './accessors';
import { chart } from './chartParameters'
import { handleMouseOver, handleMouseOut } from './handleMouse';

export let marks = (
  dataset, 
  xScale, 
  yScale, 
  colorScale,
  ) => {
    chart.selectAll("circle")
    .data(dataset)
    .enter()
    .append("circle")
    .attr("class", "dot")
    .attr("data-xvalue", xValue)
    .attr("data-yvalue", yValue)
    .attr("cx", d => xScale(xValue(d)))
    .attr("cy", d => yScale(yValue(d)))
    .attr("r", 10)
    .attr("opacity", 0.4)
    .attr("fill", d => colorScale((colorValue(d))))
    .attr("stroke", `hsla(0, 0%, 0%, 1)`)
    .attr("stroke-width", "1px")
    .attr("stroke-linejoin", "round")
    .attr("stroke-dasharray", "4 1 3 1 2 1")
    .on("mouseover pointerover focus", handleMouseOver)
    .on("mouseout pounterout pointerleave", handleMouseOut)
  }