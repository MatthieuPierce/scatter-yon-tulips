import { axisLeft, timeFormat } from 'd3';
import { chart, innerWidth, margin, padding } from './chartParameters';

export const buildYAxis = ( yScale ) => {

  const yAxis = axisLeft(yScale);
  chart.append("g")
    .attr("id", "y-axis")
    .attr("transform", `translate(${-20}, ${0})`)
    .style("color", "var(--primary-color)")
    .call(yAxis)
    .call(g => g.selectAll("#y-axis .tick text")
      .text(t => timeFormat("%M:%S")(t))
      )
    .call(g => g.selectAll("#y-axis .tick line")
      .attr("stroke-opacity", 0.1)
      .attr("stroke-dasharray", "10 5 5 5")
      .attr("x1", 0)
      .attr("x2", innerWidth)
      )
    .call(g => g.select(".domain")
      .attr("stroke-opacity", 0.0)
      .attr("stroke-dasharray", "4 1 3 1 2 1"))
    .append("text")
      .text("Alpe d'Huez Race Time")
      .attr("transform", `translate(${-margin.left + padding}, ${0})`)
      .attr("text-anchor", "start")
      .attr("fill", "var(--primary-color)")
      .style("font-size", "1.7em")
      ;
}