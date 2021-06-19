// load data
Promise.all([
    d3.json('./assets/data/tokyo_grid.json'),
    d3.json('./assets/data/tokyo_wards_admin_level_7.json'),
    d3.csv('./assets/data/tokyo_long_data.csv', parse.parseValues)
])
.then(function (files) {
    console.log(files);
    const grid = files[0];
    const ward = files[1];
    const values = files[2];

    
    const dateExtent = d3.extent(values, d => d.date);
    const years = d3.utcYears(dateExtent[0], dateExtent[1]);
    const months =  d3.utcMonths(dateExtent[0], dateExtent[1]);
    const formatTime = d3.timeFormat("%d %B %Y");
    // rollup - array - value for rollup - key
    const groupedByDate = d3.rollups(values,
        v => d3.sum(v, d => Math.round(d.value)),
        d => d.date);

    // 1 CREATE AREA CHART ----
    const areaChart = new meters_through_time(groupedByDate, dateExtent, years);

    // 2 CREATE SLIDER ----
    // needs time range from values
    // it will modify the other charts
    const slider = new controlAnimation(dateExtent, years, months, areaChart);

    // areaChart.test();
    
})
.catch(function(error){
    console.log(error);
     // handle error   
});
