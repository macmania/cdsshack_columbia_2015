const HIGHEST_PERCENTAGE_STATE = .86

//all of the fields that we need
var countiesDict = {}
var fillsNY = {}
var dataNY = {}
var AmericaStates = {}
var fillUSMap = {}
var dataUSMap = {}
var USBubbles = {}
var USMap
//var geocoder = new google.maps.Geocoder();
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
                        AmericaStates[stateName].percentage = String(parseFloat(percentage)/HIGHEST_PERCENTAGE_STATE)
                    }
                }
                return results
            }
        })
    })
}());


//sets up the US color overlays
//I don't know what you're doing here
function setOrganDonationOrgsDots (){
    $.get('js/datasets/OPO-by-State.csv', function(csv){
        var usStateOrganRegistrations = Papa.parse(csv, {
            complete:function(results){
                var i = 1;
                for(; i < results.data.length; i++){
                    console.log(getLatLngt(results.data[i][1]))
                }
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

    $.getJSON('lib/name-to-postal.json', function(json){
        USDictionaryData = json
        var rgbArray;
        for(var aState in json) {
            postalCode = json[aState]

            if(aState in AmericaStates){
                AmericaStates[aState].color = USColors[i]
                AmericaStates[aState].id = json[aState]
                AmericaStates[aState].rgba = setRBGAColor('rgb(0,0,128)', AmericaStates[aState].percentage)
                fillUSMap[aState] = AmericaStates[aState].rgba
                i++
                dataUSMap[postalCode] = {fillKey: aState}
            }
        }

        /*****this is temporary ***/
        //fillUSMap[Trouble] = '#bada55'
        /*****this is temporary ***/

        USMap = new Datamap({
            element: document.getElementById('map'),
            scope: 'usa',
            geographyConfig: {
                highlightOnHover: false,
                //highlightBorderColor: '#ccc'
            },
            //highlightFillColor: '#FC8d59',
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

        USMap.labels()
        //map.bubbles([
        //
        //])
    })
}


//call this function
setUSDictionary()
setNYCMapOverLay()
//setOrganDonationOrgsDots()


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

//helper functions

//returns the rgba value based on the percentage of organ donation signups
function setRBGAColor(rgb, percentage){
    var rgbaValues = rgb.substring(4, rgb.length-1).split(',')
    rgbaValues.push(percentage)

    var rgbaArray = ["rgba("] + rgbaValues + [')']

    return rgbaArray
}

//returns the lat and longtitude of organ procurement organization
function getLatLngt(address){
    //format for the address is 'Alabama Organ Center (ALOB), Birmingham, AL'
    //format needs to be Birmingham, AL
    if(address == null)
        return

    var addressArray = address.split(',')
    var API_KEY = ' '
    addressArray = addressArray[1] + ',' + addressArray[2] + ', USA'
    addressArray = addressArray.replace('+', '')
    addressArray = addressArray.replace(' ', '+')
    var latLngt;

    var url = 'https://maps.googleapis.com/maps/api/geocode/json?address=' +addressArray+'&key=' + API_KEY

    $.get(url, function(response){
        var results
        if(response.status == 'OK') {
            results = response.results
            latLngt = [results[0].geometry.location.lat, results[0].geometry.location.lng]
            console.log(results)
            console.log(latLngt)
        }
    })

    //geocoder.geocode({ 'address': addressArray, function(results, status){
    //    if(status == 'OK') {
    //        console.log(results)
    //        //latLngt = results.
    //    }
    //}
    //})

    //$.get()
    //https://maps.googleapis.com/maps/api/geocode/json?address=1600+Amphitheatre+Parkway,+Mountain+View,+CA&key=API_KEY

    return latLngt
}


/**
 * Sample code, not done yet
 * */
