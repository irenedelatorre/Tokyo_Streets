// load data
Promise.all([
    d3.json('./assets/data/tokyo_grid.json'),
    d3.json('./assets/data/tokyo_wards_admin_level_7.json'),
    d3.csv('./assets/data/tokyo_long_data.csv', parse.parseValues),
    d3.csv('./assets/data/admin_grid_join.csv', parse.parseWards)
])
.then(function (files) {
    console.log(files);
    const grid = topojson.feature(files[0], files[0].objects.tokyo_grid).features;
    const wards_shp = topojson.feature(files[1], files[1].objects["boundary_admin_level_7.shp"])
    const values = files[2];
    const wards = files[3];
    
    const dateExtent = d3.extent(values, d => d.date);
    const years = d3.utcYears(dateExtent[0], dateExtent[1]);
    const months =  d3.utcMonths(dateExtent[0], dateExtent[1]);
    const formatTime = d3.timeFormat("%d %B %Y");
    const formatDate = d3.timeFormat('%B %Y');
    const maxValue = d3.max(values, d => d.value);

    // rollup - array - value for rollup - key
    const groupedByDate = d3.rollups(values,
        v => d3.sum(v, d => Math.round(d.value)),
        d => d.date);

    // rollup - array
    const valuesByDate = d3.groups(values,
        d => formatDate(d.date));

    const wardsMeters = parse.wards_meters(values, wards, formatTime);

    // filter the grid to only those rectangles with a value
    const values_ids_true = test = d3.groupSort(values,
        d => d.cell_id, 
        v => v.cell_id);
    
    const grid_ids_true = grid.filter(d => {
        let match = false;
        for (var i = 0; i < values_ids_true.length; i++) {
            const id = values_ids_true[i];
            if (d.properties.cell_id === id) match = true;
        }
        return match === true;
    })

    // 0 COLORS
    const scaleColor = d3.scaleThreshold()
        .domain([0.125, 5, 12, 17, 22])
        .range([
            '#ffffff',
            '#6BC6E3',
            '#3C9DB9',
            '#047690',
            '#004E67',
            '#002940'])

    // 1 CREATE AREA CHART ----
    const areaChart = new meters_through_time(
        groupedByDate,
        dateExtent,
        years);

    // 2 CREATE BAR CHART ---
    // needs time range from values
    const table = new meters_by_wards(
        wardsMeters,
        dateExtent,
        scaleColor,
        formatTime);

    // 3 CREATE MAP ---
    const map = new mapboxMap(
        grid_ids_true,
        valuesByDate,
        dateExtent,
        formatDate,
        scaleColor,
        maxValue,
        wards_shp);

    // 4 CREATE SLIDER ----
    // needs time range from values
    // it will modify the other charts
    const slider = new controlAnimation(
        dateExtent,
        years,
        months,
        areaChart,
        table,
        map,
        formatDate);

    window.onresize = function() {
        slider.resize();
        areaChart.resize();
        table.resize();
    };
    
})
.catch(function(error){
    console.log(error);
     // handle error   
});
