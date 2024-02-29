class Barchart {

  /**
   * Class constructor with basic chart configuration
   * @param {Object}
   * @param {Array}
   */
  constructor(_config, _data, _xAxisData, _countyCount) {
    // Configuration object with defaults
    // Important: depending on your vis and the type of interactivity you need
    // you might want to use getter and setter methods for individual attributes
    this.config = {
      parentElement: _config.parentElement,
      containerWidth: _config.containerWidth || 600,
      containerHeight: _config.containerHeight || 400,
      margin: _config.margin || {top: 35, right: 20, bottom: 20, left: 65}
    }
    this.data = _data;
    this.xAxisData = _xAxisData;
    this.countyCount = _countyCount;
    this.initVis();
  }
  
  initVis() {
    
    let vis = this;

    vis.width = vis.config.containerWidth - vis.config.margin.left - vis.config.margin.right;
    vis.height = vis.config.containerHeight - vis.config.margin.top - vis.config.margin.bottom;

    // Initialize scales
    vis.xScale = d3.scaleLinear()
        .range([0, vis.width]);

    vis.yScale = d3.scaleBand()
        .range([vis.height, 0])
        .paddingInner(0.15);

    // Initialize axes
    vis.xAxis = d3.axisBottom(vis.xScale)
        .ticks(6)
        .tickSizeOuter(0);

    vis.yAxis = d3.axisLeft(vis.yScale)
        .ticks(6)
        .tickSizeOuter(0);

    // Define size of SVG drawing area
    vis.svg = d3.select(vis.config.parentElement)
        .attr('width', vis.config.containerWidth)
        .attr('height', vis.config.containerHeight);

    // Append group element that will contain our actual chart 
    // and position it according to the given margin config
    vis.chart = vis.svg.append('g')
        .attr('transform', `translate(${vis.config.margin.left},${vis.config.margin.top})`);

    // Append empty x-axis group and move it to the bottom of the chart
    vis.xAxisG = vis.chart.append('g')
        .attr('class', 'axis x-axis')
        .attr('transform', `translate(0,${vis.height})`);
    
    // Append y-axis group 
    vis.yAxisG = vis.chart.append('g')
        .attr('class', 'axis y-axis');

    vis.updateVis();
    // Append titles, legends and other static elements here
    // ...
  }

  updateVis() {
    let vis = this;

    // Specificy x- and y-accessor functions
    vis.xValue = d => d.properties.county_data ? Math.max(0, +d.properties.county_data[vis.xAxisData]) : 0;
    vis.yValue = vis.countyCount;

    // Set the scale input domains
    vis.xScale.domain([0, d3.max(vis.data.objects.counties.geometries.filter(d => vis.xValue(d) !== null), vis.xValue)]);
    // vis.yScale.domain([0, vis.countyCount]);
    vis.yScale.domain(vis.data.objects.counties.geometries.map(d => d.id));

    vis.xAxisG.call(vis.xAxis);
    // vis.yAxisG.call(vis.yAxis);

    vis.renderVis();
  }

  renderVis() {
    let vis = this;
    
    // Remove existing bars
    vis.chart.selectAll('.bar').remove();

    // Add rectangles
    let bars = vis.chart.selectAll('.bar')
        .data(vis.data.objects.counties.geometries)
        .enter()
        .append('rect')
        .attr('class', 'bar')
        .attr('height', vis.yScale.bandwidth())
        .attr('y', d => vis.yScale(d.id))
        .attr('x', 0)
        .attr('width', d => vis.xScale(vis.xValue(d)));

    
    // Update the axes because the underlying scales might have changed
    vis.xAxisG.call(vis.xAxis);
    vis.yAxisG.call(vis.yAxis);
  }
}