class mapboxMap {
    constructor(grid, data, dateExtent, formatDate, scaleColor, maxValue) {
        // var latlng = L.latLng(50.5, 30.5);
        // [Y, X]
        this.tokyo_lon_lat = [35.6762, 139.6503];
        this.default_zoom = 10;
        // L.bounds(topLeft, bottomRight) Y,X
        this.tokyo_bounds = [[35.5012, 138.9428], [35.8984, 139.9213]];

        this.grid = grid;
        this.data = data;
        this.dateExtent = dateExtent;
        this.formatDate = formatDate;
        this.scaleColor = scaleColor;
        this.max = maxValue;
        this.t = this.dateExtent[1];

        // mapbox access token --- CHANGE FOR CLIENT
        L.mapbox.accessToken = 'pk.eyJ1IjoiaXJlbmVkZWxhdG9ycmUiLCJhIjoiY2psdjI0amR4MG9ybjNrcXg1cWMxaXpldCJ9.p2pLC5jzgpGPQaWGcjlATA';

        const map = L.mapbox.map('map',)
            // fit to the bounds 
            .fitBounds(this.tokyo_bounds)
            // add layer from mapbox Studio
            .addLayer(L.mapbox.styleLayer('mapbox://styles/irenedelatorre/ckqzdri1a0m5517pk1ye1fpk4'));

        // this.map needs to be external to access it from geoTransform
        this.map = map;
        this.transform = d3.geoTransform({point: function(x, y){
            const lon_lat_l = new L.LatLng(y, x);
            const p = map.latLngToLayerPoint(lon_lat_l);
            this.stream.point(p.x, p.y);
        }});

        this.pathArea = d3.geoPath().projection(this.transform);

        // interactions
        this.map.on('error', function(err) {
            // Handle error
            console.log(err);
        });
        this.createSVG();

        this.map.on("viewreset", this.updateGrid.bind(this));
        this.map.on("zoomend", this.updateGrid.bind(this));
        this.map.on("moveend", this.mapMove.bind(this));
    }

    mapMove(){
        // 1 get bounds from map
        this.map.getBounds();
        this.svg
            .selectAll('.grid_unit')
            .remove();

        this.drawGrid(this.t);
    }

    projection(long_lat) {
        // [Y, X]
        const lon_lat_l = new L.LatLng(long_lat[0], long_lat[1]);

        const p = this.map.latLngToLayerPoint(lon_lat_l);
    
        return [p.x, p.y]
    }

    // 1 filter by time
    filterValues(t) {
        const time = this.formatDate(t)

        // get values from that date
        const filteredData = this.data.filter(d => d[0] === time)[0][1];

        // filter to show only the bounds in the map
        const bounds = this.map.getBounds();
        // check if it's inside -- should be inside for each
        parentPolygon.contains(childPolygon)

        // filter grid for only those values;
        const thisRects = this.grid.filter((d, j) => {
            let match = false;

            for (var i = 0; i < filteredData.length; i++) {
                const id = filteredData[i].cell_id;
                if (d.properties.cell_id === id) match = true;
            }

            return match === true;
        })


        this.dataMap = {
            data: filteredData,
            grid: thisRects
        }
    }

    createSVG() {
        this.widthMap = d3.select('#map').node().clientWidth;
        this.heightMap = d3.select('#map').node().clientHeight;

        this.svg = d3.select(this.map.getPanes().overlayPane).append("svg")
            .attr('width', this.widthMap)
            .attr('height', this.heightMap);

        this.backgroundSVG = this.svg
            .append('rect')
            .attr('class', 'background')
            .attr('width', this.widthMap)
            .attr('height', this.heightMap)
            .attr('x', 0)
            .attr('y', 0);
        
        this.plotGrid = this.svg.append('g')
            .attr('class', 'grid leaflet-zoom-hide');
        
        this.drawGrid(this.t);
    }

    drawGrid(t) {
        console.log(t)
        // filter data by time
        this.filterValues(t);
        console.log(this.dataMap)

        // console.log(topojson.feature(counties, counties.objects.counties).features))

        this.plotGrid
            .selectAll('.grid_unit')
            .data(this.dataMap.grid)
            .join('path')
            .attr('class', d => `grid_unit ${d.properties.cell_id}`)
            .style('fill', d => {
                const value = this.dataMap.data.filter(e => e.cell_id === d.properties.cell_id);
                return this.scaleColor(value[0].value / this.max)
            })
            .style('stroke', 'none');
        
        this.updateGrid();
    }

    updateGrid() {
        console.log('update');
        this.plotGrid
            .selectAll('.grid_unit')
            .attr('d', this.pathArea)
    }
}