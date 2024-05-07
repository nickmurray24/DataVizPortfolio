/**
 * Load TopoJSON data of the world and the data of the world wonders
 */

Promise.all([
  d3.json('data/counties.json'),
  d3.csv('data/national_health_data.csv')
]).then(data => {
  const countiesJSON = data[0];
  const nationalHealthData = data[1];
  let countyCount = 0;

  nationalHealthData.forEach(d => {
    d.air_quality = +d.air_quality;
    d.display_name = d.display_name.slice(1,-1);
    d.education_less_than_high_school_percent = +d.education_less_than_high_school_percent;
    d.poverty_perc = +d.poverty_perc;
    d.elderly_percentage = +d.elderly_percentage;
    // d.urban_rural_status = +d.urban_rural_status;
    d.number_of_hospitals = +d.number_of_hospitals;
    d.median_household_income = +d.median_household_income;
    d.number_of_primary_care_physicians = +d.number_of_primary_care_physicians;
    d.percent_coronary_heart_disease = +d.percent_coronary_heart_disease;
    d.park_access = +d.park_access;
    d.percent_coronary_heart_disease = +d.percent_coronary_heart_disease;
    d.median_household_income = +d.median_household_income;
    d.percent_high_blood_pressure = +d.percent_high_blood_pressure;
    d.percent_high_cholesterol = +d.percent_high_cholesterol;
    d.percent_inactive = +d.percent_inactive;
    d.percent_no_heath_insurance = +d.percent_no_heath_insurance;
    d.percent_smoking = +d.percent_smoking;
    d.percent_stroke = +d.percent_stroke;
  });

  // Combine both datasets by adding the all data to the TopoJSON file
  countiesJSON.objects.counties.geometries.forEach(d => {
    d.properties.county_data = null
    countyCount += 1;
    for (let i = 0; i < nationalHealthData.length; i++) {
      if (d.id == nationalHealthData[i].cnty_fips) {
        d.properties.county_data = nationalHealthData[i];
      }
    }
  });

  let xAxisData = "poverty_perc";
  let yAxisData = "education_less_than_high_school_percent";
  let xAxisName = "Poverty Percent";
  let yAxisName = "Education Less Than High School Percent";

  function setXValue (x) {
    xAxisData = x;
  };

  function setYValue (y) {
    yAxisData = y;
  };

  // Choropleth Maps
  const choroplethMap1 = new ChoroplethMap1({ 
    parentElement: '#map'
  }, countiesJSON);
  const choroplethMap2 = new ChoroplethMap2({ 
    parentElement: '#map'
  }, countiesJSON);

  // Get the values that are in the dropdowns
  const xAxisValue = document.getElementById("scatter-xAxis");
  const yAxisValue = document.getElementById("scatter-yAxis");


  function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }
  xAxisValue.addEventListener("change", (event) => {
    setXValue(event.target.value);
    xAxisName = capitalizeFirstLetter(event.target.value.replace(/_/g, " "));
    updateScatterplot();
    updateBarChart();
  });

  yAxisValue.addEventListener("change", (event) => {
      setYValue(event.target.value);
      yAxisName = capitalizeFirstLetter(event.target.value.replace(/_/g, " "));
      updateScatterplot();
      updateBarChart();
  });

  // Scatterplot that takes in the x-axis and y-axis values
  const scatterplot = new Scatterplot({
    parentElement: '#scatterplot'
  }, countiesJSON, xAxisData, yAxisData, xAxisName, yAxisName);


  // Function to update the scatterplot class
  function updateScatterplot() {
    scatterplot.xAxisData = xAxisValue.value;
    scatterplot.yAxisData = yAxisValue.value;
    scatterplot.xAxisName = xAxisName;
    scatterplot.yAxisName = yAxisName;
    scatterplot.updateVis();
  }

})

.catch(error => console.error(error));
