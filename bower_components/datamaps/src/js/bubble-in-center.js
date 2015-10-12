
var election = new Datamap({
    scope: 'usa',
    element: document.getElementById('container1'),
    geographyConfig: {
        popupOnHover: false,
        highlightOnHover: false,
        borderColor: '#444',
        borderWidth: 0.5
    },
    bubblesConfig: {
        popupTemplate: function(geography, data) {
            var showData = data.centered != null ? data.centered : data.name
            return '<div class="hoverinfo">Some From New: data about ' + showData + '</div>'
        },
        fillOpacity: 0.2
    },
    fills: {
        'Visited': '#306596',
        'neato': '#0fa0fa',
        'Trouble': '#bada55',
        defaultFill: '#dddddd'
    }
});

election.bubbles([
    {
        name: 'NY',
        latitude: 40.7903,
        longitude: -73.9661407,
        //centered: 'NY',
        fillKey: 'Trouble',
        radius: 10
    },

    {
        name: 'VA',
        latitude: 38.6436,
        longitude: -77.25,
        fillKey: 'neato',
        radius: 10
    },
    {centered: 'KY', fillKey: 'neato', radius: 5},
    {centered: 'TX', fillKey: 'neato', radius: 15},
    {
        name: 'CA',
        latitude: 37.773972,
        longitude:  -122.431297,
        fillKey: 'Trouble',
        radius: 5
    },
    {centered: 'WA', fillKey: 'neato', radius: 2},
    {centered: 'MA', fillKey: 'Trouble', radius: 10},
    {centered: 'FL', fillKey: 'neato', radius: 30},
    {centered: 'NC', fillKey: 'neato', radius: 30},
    {centered: 'GA', fillKey: 'Visited', radius: 5},
    {centered: 'WY', fillKey: 'neato', radius: 5},
    {centered: 'ME', fillKey: 'neato', radius: 5},
    {centered: 'VT', fillKey: 'Visited', radius: 5},
    {centered: 'NH', fillKey: 'neato', radius: 5},
    {centered: 'CT', fillKey: 'Visited', radius: 5},
    {centered: 'HI', fillKey: 'neato', radius: 5},
    {centered: 'AK', fillKey: 'neato', radius: 15},
    {centered: 'SC', fillKey: 'Visited', radius: 5},
    {centered: 'MI', fillKey: 'Trouble', radius: 20},
    {centered: 'AL', fillKey: 'neato', radius: 20},
    {centered: 'LA', fillKey: 'Visited', radius: 20},
    {centered: 'OK', fillKey: 'Trouble', radius: 20},
    {centered: 'NE', fillKey: 'neato', radius: 20},
    {centered: 'KS', fillKey: 'neato', radius: 10},
    {centered: 'NM', fillKey: 'Visited', radius: 20},
    {centered: 'AZ', fillKey: 'neato', radius: 20},
    {centered: 'CO', fillKey: 'neato', radius: 20},
    {centered: 'OR', fillKey: 'Trouble', radius: 10},
    {centered: 'ND', fillKey: 'neato', radius: 10},
    {centered: 'SD', fillKey: 'neato', radius: 10},
    {centered: 'OH', fillKey: 'neato', radius: 10},
    {centered: 'IA', fillKey: 'Visited', radius: 10},
    {centered: 'IN', fillKey: 'Visited', radius: 10},
    {centered: 'PA', fillKey: 'neato', radius: 10},
    {centered: 'NJ', fillKey: 'neato', radius: 10},
    {centered: 'ID', fillKey: 'neato', radius: 10},
    {centered: 'MO', fillKey: 'neato', radius: 2},
    {centered: 'WI', fillKey: 'Visited', radius: 10},

], {
    // popupTemplate: function(geography, data) {
    //   return '<div class="hoverinfo">Some data about ' + data.centered + '</div>'
    // }
});