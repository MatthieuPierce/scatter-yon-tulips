import './index.css';
import { 
  select, 
  scaleTime,
  scaleOrdinal, 
  json, 
  min, 
  max,
 } from 'd3';
import { xValue, yValue, colorValue } from './accessors';
import { innerWidth, innerHeight } from './chartParameters';
import { legend } from './legend';
import { marks } from './marks';
import { parseData } from './parseData';
// import { tooltip } from './tooltip';
import { buildXAxis } from './xAxis';
import { buildYAxis } from './yAxis';

// NON-CODE PLANNING: CHART OBJECTIVES
// Race times for the 35 fastest times up Alpe d'Huez,
// measured in minutes and seconds (y-axis) 
// vs over years; (x-axis)
// categorical color to distinguish doping allegations: true/false (c-axis)
// tooltip with details: {Nationality} / {Name} / {Time} in Year /
// / {Doping notes} or {noting lack of doping notes} 

// Chart basic construction & layout parameters in chartParameters.js

let dataset;
// Datset source
const dataUrl = 'https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json';

// Fetch Dataset & Render Marks
json(dataUrl).then(data => {

  // Parse dataset function in parseData.js
  dataset = parseData(data);
  // Console out parsed dataset for examination
  // console.log(dataset);

  // Calc xMin xMax yMin yMax (or extent)
  const xMin = min(dataset, xValue);
  const xMax = max(dataset, xValue);
  const yMin = min(dataset, yValue);
  const yMax = max(dataset, yValue);

  // xScale
  const xScale = scaleTime()
  .domain([xMin, xMax])
  .range([0, innerWidth])
  
  // yScale
  const yScale = scaleTime()
    .domain([yMin, yMax])
    .range([0, innerHeight])
    // .nice();

  // colorScale
  const colorScale = scaleOrdinal()
    .domain(dataset.map(colorValue))
    .range([`var(--doping-color)`, `var(--no-doping-color)`])

  const colorKeys = colorScale.domain().map(domainVal => {
    switch (domainVal) {
      case true:
        return `Doping allegations`;
      case false: 
        return `No doping allegations`;
      default:
        return `No info on doping allegations`;
    }
  })

  // xAxis -- buildXAxis function in xAxis.js
  buildXAxis(xScale);

  // xAxis -- buildYAxis function in yAxis.js
  buildYAxis(yScale);

  // Tooltip -- from tooltip.js)

  // Color Legend -- from legend.js
  legend( 
    colorKeys, 
    colorScale, 
    );

  // Marks (circles) -- from marks.js
  marks(
    dataset, 
    xScale, 
    yScale, 
    colorScale,
    );
  }
)
// Gotta catch those errors
.catch(err => {
  alert(err);
  console.log(err);
});



