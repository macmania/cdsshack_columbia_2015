
var countiesDict = {}


//sets up the different colors in USA
function setNYCMapOverLay(){
    var colorsNY = randomColor({
        count: 62,
        luminosity: 'bright',
        hue: 'random'
    });
    var i = 0;
    $.getJSON('newyork-with-counties.json', function(json){
        for(var county of json.objects['subunits-ny'].geometries){
            var name = county.properties['name'] != null ? county.properties['name'] : 'empty'
            countiesDict[name] = {
                "id": county.id,
                "color": colorsNY[i]
            }

            i++
        }
    });
    return countiesDict
}
//sets up the nyc county overlay
(function setNYCCountyOverlay(){
    $.get('js/datasets/2015_Voter_Registration_By_County.csv', function(csv){
        var nycCountiesVoterRegistration = Papa.parse(csv, {
            complete: function(results) {
                console.log(results)
                return results
            }
        })
    })
}());

//sets up the US color overlays
//I don't know what you're doing here
function setUSColors (){

    $.get('js/datasets/OPO-by-State.csv', function(csv){
        var usStateOrganRegistrations = Papa.parse(csv, {
            complete:function(results){
                console.log(results)
                return results
            }
        })
    })
}

var AmericaStates = {}
var fillUSMap = {}
var dataUSMap = {}
//sets up the colors for each of the 50 states
function setUSDictionary(){

    //temporary place holder
    var USDictionaryData = {}
    var USColors = []
    var i = 0
    var postalCode = ""

    USColors = randomColor({
        count: 50,
        luminosity: 'bright',
        hue: 'random'
    });

    $.getJSON('lib/name-to-postal.json', function(json){
        USDictionaryData = json

        for(var aState in json) {
            postalCode = json[aState]
            AmericaStates[aState] = {
                'color': USColors[i],
                'id': json[aState],
            }
            fillUSMap[aState] = USColors[i]
            i++
            dataUSMap[postalCode] = {fillKey: aState}
        }

        var map = new Datamap({
            element: document.getElementById('map'),
            scope: 'usa',
            geographyConfig: {
                highlightFillColor: '#F4C2C5'
            },
            highlightFillColor: '#F4C2C5',
            setProjection: function(element, options) {
                var projection, path;
                projection = d3.geo.albersUsa()
                    .scale(1300)
                    .translate([element.offsetWidth / 2, element.offsetHeight / 2]);

                path = d3.geo.path()
                    .projection( projection )
                return {
                    path: path,
                    projection: projection
                };
            },
            fills: fillUSMap,
            data: dataUSMap
        });


    })


}

//call this function
setUSDictionary()


var newyorkcity = new Datamap({
    scope: 'subunits-ny',
    element: document.getElementById('container1'),
    projection: '',
    geographyConfig: {
        dataUrl: 'newyork-with-counties.json',
        highlightFillColor: '#F4C2C5'
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
        defaultFill: '#FF00FF',
        lt50: 'rgba(0,244,244,0.9)',
        gt50: 'red'
    },

    data: {
        '071': {fillKey: 'lt50' },
        '001': {fillKey: 'gt50' }
    }
})

