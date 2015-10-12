//all of the fields that we need
var countiesDict = {}
var fillsNY = {}
var dataNY = {}
var AmericaStates = {}
var fillUSMap = {}
var dataUSMap = {}

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
            fillsNY[county.id] = colorsNY[i]
            dataNY[county.id] = {fillKey: county.id}
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

(function getOrganDonationPercentage(){
    $.get('js/datasets/State_Enrollment_2015_US.csv', function(csv){
        var statesOrganDonation = Papa.parse(csv, {
            complete: function(results) {
                console.log(results)
                var stateName, percentage

                for(var state in results.data){
                    if(state != 0){
                        stateName = results.data[state][0].toUpperCase()
                        percentage = results.data[state][2]
                        if(AmericaStates[stateName] == null){
                            AmericaStates[stateName] = {}
                        }
                        AmericaStates[stateName].percentage = percentage
                    }
                }
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


//sets up the colors for each of the 50 states
function setUSDictionary(){

    //temporary place holder
    var USDictionaryData = {}
    var USColors = []
    var i = 0
    var postalCode = ""

    USColors = randomColor({
        count: 60,
        luminosity: 'dark',
        hue: 'random',
        format: 'rgba'
    });

    $.getJSON('lib/name-to-postal.json', function(json){
        USDictionaryData = json

        for(var aState in json) {
            postalCode = json[aState]

            AmericaStates[aState].color = USColors[i]
            AmericaStates[aState].id = json[aState]


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

function setRBGAColor(rgb, percentage){
    var rgbArray = rgb.substring(4, rgb.length-1).split(',')
    rgbArray.push(percentage)

    var rgbaArray = 


}

//call this function
setUSDictionary()
setNYCMapOverLay()

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
    fills: fillsNY,
    //  {
    //    defaultFill: '#FF00FF',
    //    lt50: 'rgba(0,244,244,0.9)',
    //    gt50: 'red'
    //},


    data: dataNY

    // {
    //    '071': {fillKey: 'lt50' },
    //    '001': {fillKey: 'gt50' }
    //}
})

