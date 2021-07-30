class mapboxMap {
    constructor(grid, data, dateExtent, formatDate, scaleColor, maxValue, ward) {
        // var latlng = L.latLng(50.5, 30.5);
        // [Y, X]
        this.tokyo_lon_lat = [35.6762, 139.6503];
        this.default_zoom = 10;
        // L.bounds(topLeft, bottomRight) Y,X
        this.tokyo_bounds = [[35.5012, 138.9428], [35.8984, 139.9213]];

        this.grid = grid;
        this.data = data;
        this.wards = ward;
        this.dateExtent = dateExtent;
        this.formatDate = formatDate;
        this.scaleColor = scaleColor;
        this.max = maxValue;
        this.t = this.dateExtent[1];

        // mapbox access token --- CHANGE FOR CLIENT
        L.mapbox.accessToken = "pk.eyJ1IjoiaXJlbmVkZWxhdG9ycmUiLCJhIjoiY2psdjI0amR4MG9ybjNrcXg1cWMxaXpldCJ9.p2pLC5jzgpGPQaWGcjlATA";

        const map = L.mapbox.map("map", null, {zoomControl: false})
            // fit to the bounds 
            .fitBounds(this.tokyo_bounds)
            // add layer from mapbox Studio
            .addLayer(L.mapbox.styleLayer("mapbox://styles/irenedelatorre/ckqzdri1a0m5517pk1ye1fpk4"));

        // zoom home for reset map
        this.zoomHome = L.Control.zoomHome();
        console.log(L.Control.zoomHome())
        this.zoomHome.addTo(map);

        // this.map needs to be external to access it from geoTransform
        this.map = map;
        this.transform = d3.geoTransform({point: function(x, y){
            const lon_lat_l = new L.LatLng(y, x);
            const p = map.latLngToLayerPoint(lon_lat_l);
            this.stream.point(p.x, p.y);
        }});

        this.pathArea = d3.geoPath().projection(this.transform);

        this.createSVG();
        this.reset();
        this.createLegend();

        // interactions
        this.map.on("error", function(err) {
            // Handle error
            console.log(err);
        });

        this.map.on("viewreset", this.reset.bind(this));
        this.map.on("moveend", this.reset.bind(this));
    }

    // 1 filter by time
    filterValues(t) {
        const time = this.formatDate(t)

        // get values from that date
        const filteredData = this.data.filter(d => d[0] === time)[0][1];

        // filter grid for only those values;
        const thisRects = this.grid.filter((d, j) => {
            let match_data = false;

            for (var i = 0; i < filteredData.length; i++) {
                const id = filteredData[i].cell_id;
                if (d.properties.cell_id === id) match_data = true;
            }

            return match_data === true;
        })

        this.dataMap = {
            data: filteredData,
            grid: thisRects
        }
    }

    createSVG() {

        this.svg = d3.select(this.map.getPanes().overlayPane)
            .append("svg");
        
        this.plotGrid = this.svg.append("g")
            .attr("class", "grid leaflet-zoom-hide");
        
        this.drawGrid(this.t);


        // legend
        this.margin = {
            t: 7,
            l: 20,
            r: 18,
            b: 25,
            middle: 10,
            bottom: 8
        };

        this.legendWidth = document.getElementById("plot-legend").clientWidth -this. margin.r - this.margin.l;
        this.legendHeight = document.getElementById("plot-legend").clientHeight - this.margin.t - this.margin.b;
        this.legendContainer = d3.select("#plot-legend")
            .append("svg")
            .attr("width", this.legendWidth + this.margin.r + this.margin.l)
            .attr("height", this.legendHeight + this.margin.b + this.margin.t);

        this.plotLegend = this.legendContainer
            .append("g")
            .attr("transform", `translate(${this.margin.l}, ${this.margin.t})`);
    }

    drawGrid(t) {
        this.t = t;
        
        // filter data by time
        this.filterValues(this.t);

        this.plotGrid
            .selectAll(".grid_unit")
            .data(this.dataMap.grid)
            .join("path")
            .attr("class", d => `grid_unit ${d.properties.cell_id}`)
            .style("fill", d => {
                const value = this.dataMap.data.filter(e => e.cell_id === d.properties.cell_id);
                return this.scaleColor(100 * value[0].value / this.max)
            })
            .style("stroke", "none");
        
        this.updateGrid();
    }

    updateGrid() {
        console.log("update");
    
        this.plotGrid
            .selectAll(".grid_unit")
            .attr("d", this.pathArea)
    }

    reset() {
        const bounds = this.pathArea.bounds(this.wards);
        const topLeft = bounds[0];
        const bottomRight = bounds[1];

        this.svg
            .attr("width", bottomRight[0] - topLeft[0])
            .attr("height", bottomRight[1] - topLeft[1])
            .style("left", topLeft[0] + "px")
            .style("top", topLeft[1] + "px");

        this.plotGrid
            .attr("transform", `translate(${-topLeft[0]}, ${-topLeft[1]})`);

        this.updateGrid();
    }

    createLegend() {
        console.log(this)
        this.updateLegendDate(this.t);

        // .domain([0.125, 5, 12, 17, 22])
        // .range(['#ffffff','#6BC6E3', '#3C9DB9', '#047690', '#004E67', '#002940'])

        this.legendData = [
            {value: 0, text: "0 - 0.125", y: 0, x: 0},
            {value: 0.126, text: "0.125", y: 1, x: 0},
            {value: 5, text: "5", y: 1, x: 1},
            {value: 12, text: "11", y: 1, x: 2},
            {value: 17, text: "17", y: 1, x: 3},
            {value: 22, text: "22", y: 1, x: 4},
            {value: 100, text: "100%", y: 1, x: 5}
        ];

        this.itemLegendW = this.legendWidth / (this.legendData.length - 2);
        this.itemLegendH = this.legendHeight * 0.5 - this.margin.middle;

        this.plotLegend
            .selectAll(".legend-item-rect")
            .data(this.legendData.filter(d => d.value !== 100))
            .join("rect")
            .attr("class", d => `legend-item-rect ${d.text}`)
            .attr("width", this.itemLegendW)
            .attr("height", this.itemLegendH)
            .attr("x", d => d.x * this.itemLegendW)
            .attr("y", d => d.y * (this.itemLegendH + this.margin.middle))
            .style("stroke", d => (d.value === 0) ? "#E6E6E6" : "#ffffff")
            .style("fill", d => this.scaleColor(d.value));

        this.plotLegend
            .selectAll(".legend-item-line")
            .data(this.legendData.filter(d => d.value !== 0))
            .join("line")
            .attr("class", d => `legend-item-line ${d.text}`)
            .attr("x1", d => d.x * this.itemLegendW)
            .attr("x2", d => d.x * this.itemLegendW)
            .attr("y1", this.itemLegendH * 3)
            .attr("y2", this.itemLegendH * 3 + this.margin.bottom / 3);

        this.plotLegend
            .selectAll(".legend-item-text")
            .data(this.legendData)
            .join("text")
            .attr("class", d => `legend-item-text ${d.text}`)
            .text(d => d.text)
            .attr("text-anchor", d => (d.value === 0) ? "start" : "middle")
            .attr("x", d => (d.value === 0) ? this.itemLegendW + this.margin.middle : d.x * this.itemLegendW)
            .attr("y", d => (d.value === 0) ? this.itemLegendH : d.y * (this.itemLegendH * 3 + 10 + this.margin.bottom));

        
    }

    updateLegendDate(t) {
        console.log(t);
        d3.selectAll("#map-date")
            .html(this.formatDate(t))
    }

    // reproject long - lat values
    projection(long_lat) {
        // [Y, X]
        const lon_lat_l = new L.LatLng(long_lat[1], long_lat[0]);
        const p = this.map.latLngToLayerPoint(lon_lat_l);
        return [p.x, p.y]
    }

    getBounds(geo){
        const x = d3.extent(geo, d => d[0]);
        const y = d3.extent(geo, d => d[1]);

        return [[y[0], x[0]], [y[1], x[1]]]
    }
}