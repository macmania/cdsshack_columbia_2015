var map = new Datamap({
    element: document.getElementById('map'),
    scope: 'usa',
    //setProjection: function(element, options) {
    //    var projection, path;
    //    projection = d3.geo.albersUsa()
    //        .scale(element.offsetWidth)
    //        .translate([element.offsetWidth / 2, element.offsetHeight / 2]);
    //
    //    path = d3.geo.path()
    //        .projection( projection );
    //    return {
    //        path: path,
    //        projection: projection
    //    };
    //}
});

var newyorkcity = new Datamap({
    scope: 'subunits-ny',
    element: document.getElementById('container1'),
    projection: '',
    geographyConfig: {
        dataUrl: 'newyork-with-counties.json'
    },
    setProjection: function(element) {
        var projection = d3.geo.equirectangular()
            .center([-72, 43])
            .rotate([4.4, 0])
            .scale(8000)
            .translate([element.offsetWidth / 2, element.offsetHeight / 2]);
        var path = d3.geo.path()
            .projection(projection);

        return {path: path, projection: projection};
    },
    fills: {
        defaultFill: '#f0af0a',
        lt50: 'rgba(0,244,244,0.9)',
        gt50: 'red'
    },

    data: {
        '071': {fillKey: 'lt50' },
        '001': {fillKey: 'gt50' }
    }
})

