class mapboxMap {
    constructor() {
        // var latlng = L.latLng(50.5, 30.5);
        // [Y, X]
        this.tokyo_lon_lat = [35.6762, 139.6503];
        this.default_zoom = 10;
        // L.bounds(topLeft, bottomRight) Y,X
        this.tokyo_bounds = [[35.5012, 138.9428], [35.8984, 139.9213]];

        // mapbox access token --- CHANGE FOR CLIENT
        L.mapbox.accessToken = 'pk.eyJ1IjoiaXJlbmVkZWxhdG9ycmUiLCJhIjoiY2psdjI0amR4MG9ybjNrcXg1cWMxaXpldCJ9.p2pLC5jzgpGPQaWGcjlATA';

        this.map = L.mapbox.map('map',)
            // fit to the bounds 
            .fitBounds(this.tokyo_bounds)
            // add layer from mapbox Studio
            .addLayer(L.mapbox.styleLayer('mapbox://styles/irenedelatorre/ckqzdri1a0m5517pk1ye1fpk4'));

        this.map.on('error', function(err) {
            // Handle error
            console.log(err);
        });

        console.log(this.map);
        console.log(this.projection(this.tokyo_lon_lat));

    }

    projection(long_lat) {
        // [Y, X]
        const lon_lat_l = new L.LatLng(long_lat[0], long_lat[1]);
        // console.log(lon_lat_l);

        const p = this.map.latLngToLayerPoint(lon_lat_l);
        // console.log(p)
    
        return [p.x, p.y]
    }
}