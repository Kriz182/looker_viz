const vis = {
    options: {},
    
    create: function(element, config) {
        // Leaflet.js likes the css to be loaded ahead of the js
        // So have loaded both the CSS and Leaflet.js dependency here
        // Rather than using the dependency field on the Admin page
        var csslink  = document.createElement('link');
        csslink.rel  = 'stylesheet';
        csslink.type = 'text/css';
        csslink.href = 'https://unpkg.com/leaflet@1.4.0/dist/leaflet.css';
        csslink.crossorigin = "";
        document.head.appendChild(csslink);

        var scriptlink  = document.createElement('script');
        scriptlink.src  = 'https://unpkg.com/leaflet@1.4.0/dist/leaflet.js';
        scriptlink.crossorigin = "";
        document.head.appendChild(scriptlink);


        this.container = element.appendChild(document.createElement("div"));
        this.container.id = "leafletMap";

        this.tooltip = element.appendChild(document.createElement("div"));
        this.tooltip.id = "tooltip";
        this.tooltip.className = "tooltip";
    },
    
    updateAsync: function(data, element, config, queryResponse, details, done) {
        this.clearErrors();
        
        const chartHeight = element.clientHeight - 16;
        const dimensions = queryResponse.fields.dimension_like;
        const measures = queryResponse.fields.measure_like;
        
        // Leaflet initialization code remains the same
        
        var map = L.map('leafletMap').setView([40.71, -74.01], 9);
        
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png?{foo}', {
            foo: 'bar', 
            attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>'
        }).addTo(map);
        
        // Loop through dimensions
        for (let d = 0; d < dimensions.length; d++) {
            if (dimensions[d].tags.includes("geojson")) {
                for (let row = 0; row < data.length; row++) {
                    geojson_value = JSON.parse(data[row][dimensions[d].name].value);
                    L.geoJSON(geojson_value).addTo(map);
                }                
            }
        }
        
        // Loop through measures
        for (let m = 0; m < measures.length; m++) {
            const measureName = measures[m].name;
            const measureLabel = measures[m].label;
            
            // Assuming your measure is a number, you can customize this part
            const measureSum = data.reduce((sum, row) => sum + parseFloat(row[measureName].value), 0);
            
            // Create a marker with measure information
            const marker = L.marker([40.71, -74.01]).addTo(map);
            marker.bindPopup(`${measureLabel}: ${measureSum}`);
        }
        
        done();
    }
};

looker.plugins.visualizations.add(vis);
