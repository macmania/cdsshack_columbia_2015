const HIGHEST_PERCENTAGE_STATE = .86

//all of the fields that we need
var fillNYMap = {}
var dataNYMap = {}

var AmericaStates = {}
var NYCounties = {}
var fillUSMap = {}
var dataUSMap = {}
var USBubbles = []

var USMap
var NYMap

//temporary right now, later
var outOfStateUSA = [];
var headquartersUSA = [];


/**************************** USA Visualization code**************************************/
(function getOrganDonationPercentage(){
    $.ajax({
        type: "GET",
        url: "js/datasets/State_Enrollment_2015_US.csv",
        cache: false,
        async: false
    }).done(function(csv){
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
    //temporarily the solution

    return $.ajax({
        type: "GET",
        url: "js/datasets/OPO-by-State-temp.csv",
        async: false,
        cache: false
    }).done(function(csv){
        var usStateOrganRegistrations = Papa.parse(csv, {
            complete:function(results){
                var i = 1;
                for(; i < results.data.length; i++){
                    console.log(results.data[i][1], results.data[i][2])
                    var name = results.data[i][0].split(',')[0]
                    if(results.data[i][1] != null && results.data[i][2] != null){
                        outOfStateUSA.push({
                            name: name,
                            latitude: results.data[i][1],
                            longitude: results.data[i][2],
                            fillKey: 'Organ Donation Head Quarters',
                            radius: 5
                        })

                        USBubbles.push({
                            name: name,
                            latitude: results.data[i][1],
                            longitude: results.data[i][2],
                            fillKey: 'Organ Donation Head Quarters',
                            radius: 5
                        })
                    }
                }
                console.log(results)
                return results
            }
        })
        USMap.bubbles(USBubbles)
    });
}
//sets the organ donation dots that are out of state
function setOutStateOrganDonationDots(){
    var usStatesOrg = {}

    return $.ajax({
        type: "GET",
        url: "js/datasets/OPO-by-State.csv",
        async: false,
        cache: false
    }).done(function(csv){
        var outStateOrganDots = Papa.parse(csv, {
            complete: function(results) {
                var i = 1, stateName
                for (; i < results.data.length; i++) {
                    stateName = results.data[i][0].toUpperCase()
                    if(stateName in AmericaStates && results.data[i][2] == 1){
                        if('number of out-of-state orgs' in AmericaStates[stateName]){
                            AmericaStates[stateName]['number of out-of-state orgs']++
                        }
                        else{
                            AmericaStates[stateName]['number of out-of-state orgs'] = 1
                        }

                    }
                    else if (results.data[i][2] == 1){
                        AmericaStates[stateName] = {
                            'number of out-of-state orgs': 1
                        }
                    }
                }

                for(var state in AmericaStates){
                    if('number of out-of-state orgs' in AmericaStates[state]){
                        headquartersUSA.push({
                            name: 'out of state organ procurement organization',
                            centered: AmericaStates[state].id,
                            radius: 5*AmericaStates[state]['number of out-of-state orgs'],
                            fillKey: 'Out of State Organ Donation'
                        })
                        USBubbles.push({
                            name: 'out of state organ procurement organization',
                            centered: AmericaStates[state].id,
                            radius: 5*AmericaStates[state]['number of out-of-state orgs'],
                            fillKey: 'Out of State Organ Donation'
                        })
                    }
                }
            }
        })
        console.log(AmericaStates)
    })
    //$.get('js/datasets/OPO-by-State.csv', function(csv) {
    //    var outStateOrganDots = Papa.parse(csv, {
    //        complete: function(results) {
    //            var i = 1, stateName
    //            for (; i < results.data.length; i++) {
    //                stateName = results.data[i][0].toUpperCase()
    //                if(stateName in AmericaStates && results.data[i][2] == 1){
    //                        if('number of out-of-state orgs' in AmericaStates[stateName]){
    //                            AmericaStates[stateName]['number of out-of-state orgs']++
    //                        }
    //                        else{
    //                            AmericaStates[stateName]['number of out-of-state orgs'] = 1
    //                        }
    //
    //                }
    //                else if (results.data[i][2] == 1){
    //                    AmericaStates[stateName] = {
    //                        'number of out-of-state orgs': 1
    //                    }
    //                }
    //            }
    //
    //            for(var state in AmericaStates){
    //                if('number of out-of-state orgs' in AmericaStates[state]){
    //                    headquartersUSA.push({
    //                        name: 'out of state organ procurement organization',
    //                        centered: AmericaStates[state].id,
    //                        radius: 5*AmericaStates[state]['number of out-of-state orgs'],
    //                        fillKey: 'Out of State Organ Donation'
    //                    })
    //                    USBubbles.push({
    //                        name: 'out of state organ procurement organization',
    //                        centered: AmericaStates[state].id,
    //                        radius: 5*AmericaStates[state]['number of out-of-state orgs'],
    //                        fillKey: 'Out of State Organ Donation'
    //                    })
    //                }
    //            }
    //        }
    //    })
    //    console.log(AmericaStates)
    //})
}

/**************************** End USA Visualization code**************************************/


//sets up the colors for each of the 50 states
function setUSDictionary(){

    //temporary place holder
    var USDictionaryData = {}
    var USColors = []
    var i = 0
    var postalCode = ""

    return $.ajax({
        type: "GET",
        url: "lib/name-to-postal.json",
        async: false,
        cache: false
    }).done(function(json){
        USDictionaryData = json
        var rgbArray;
        for(var aState in json) {
            postalCode = json[aState]

            if(aState in AmericaStates){
                AmericaStates[aState].id = json[aState]
                AmericaStates[aState].rgba = setRBGAColor('rgb(0,0,128)', AmericaStates[aState].percentage)
                fillUSMap[aState] = AmericaStates[aState].rgba
                i++
                dataUSMap[postalCode] = {fillKey: aState}
            }
        }

        /*****this is temporary ***/
        fillUSMap['Organ Donation Head Quarters'] = '#FA8072'
        fillUSMap['Out of State Organ Donation'] = '#FFFAFA'
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
    });

    //$.getJSON('lib/name-to-postal.json', function(json){
    //    USDictionaryData = json
    //    var rgbArray;
    //    for(var aState in json) {
    //        postalCode = json[aState]
    //
    //        if(aState in AmericaStates){
    //            AmericaStates[aState].id = json[aState]
    //            AmericaStates[aState].rgba = setRBGAColor('rgb(0,0,128)', AmericaStates[aState].percentage)
    //            fillUSMap[aState] = AmericaStates[aState].rgba
    //            i++
    //            dataUSMap[postalCode] = {fillKey: aState}
    //        }
    //    }
    //
    //    /*****this is temporary ***/
    //    fillUSMap['Organ Donation Head Quarters'] = '#FA8072'
    //    fillUSMap['Out of State Organ Donation'] = '#FFFAFA'
    //    /*****this is temporary ***/
    //
    //    USMap = new Datamap({
    //        element: document.getElementById('map'),
    //        scope: 'usa',
    //        geographyConfig: {
    //            highlightOnHover: false,
    //            //highlightBorderColor: '#ccc'
    //        },
    //        //highlightFillColor: '#FC8d59',
    //        setProjection: function(element, options) {
    //            var projection, path;
    //            projection = d3.geo.albersUsa()
    //                .scale(1300)
    //                .translate([element.offsetWidth / 2, element.offsetHeight / 2]);
    //
    //            path = d3.geo.path()
    //                .projection( projection )
    //            return {
    //                path: path,
    //                projection: projection
    //            };
    //        },
    //        fills: fillUSMap,
    //        data: dataUSMap
    //    });
    //
    //    USMap.labels()
    //})
}

function setNYDictionary(){
    return $.ajax({
        type: "GET",
        url: "newyork-with-counties.json",
        cache: false,
        async: false
    }).done(function(json) {
        var countyName
        for(var county of json.objects['subunits-ny'].geometries){
            countyName = county.properties['name'] != null ? county.properties['name'] : 'empty'

            if(countyName in NYCounties){
                NYCounties[countyName].id = county.id
                NYCounties.rgba = setRBGAColor('rgb(0,128,0)', NYCounties[countyName].percentage)
                fillNYMap[countyName] = NYCounties[county].rgba
                dataNYMap[county.id] = countyName
            }
            i++
        }

        NYMap = new Datamap({
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
            fills: fillNYMap,
            data: dataNYMap
        })

        NYMap.labels()
    });
}

//call this function
setUSDictionary()
setNYDictionary()

setOutStateOrganDonationDots()
setOrganDonationOrgsDots()


//helper functions

//returns the rgba value based on the percentage of organ donation signups
function setRBGAColor(rgb, percentage){
    var rgbaValues = rgb.substring(4, rgb.length-1).split(',')
    rgbaValues.push(percentage)

    var rgbaArray = ["rgba("] + rgbaValues + [')']

    return rgbaArray
}


/**Temporary - to do**/
//event listeners
$('#out-of-state-viz').click(function(){
    var property = document.getElementById('#out-of-state-viz')
    if(property.style.backgroundColor == '#FFFAFA'){ //it's 'active'

    }
})

$('#headquarters-viz').click(function(){

})