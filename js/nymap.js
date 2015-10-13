//all of the fields that we need
var fillNYMap = {}
var dataNYMap = {}

var NYCounties = {}
var NYMap

//temporary right now, later
var enrollmentCenterBubbles = [];
var headquartersUSA = [];

//overlay
(function getOrganDonationPercentageNY(){
    $.get('js/datasets/Donate_Life_Organ_and_Tissue_Donor_Registry_Enrollment_by_County__Latest_Month_Combined.csv', function(csv){
        Papa.parse(csv, {
            complete: function(results) {
                console.log(results)
                var countyName, percentage
                var i = 1;
                for(; i < 66; i++){
                    countyName = results.data[i][2]
                    if(countyName == 'Out of State' || countyName == 'Unknown')
                        continue

                    percentage = results.data[i][6]
                    if(NYCounties[countyName] == null){
                        NYCounties[countyName] = {}
                    }
                    NYCounties[countyName].percentage = String(parseFloat(percentage)/100)
                }
                return results
            }
        })
    })
})();

//getOrganDonationPercentageNY();


function setNYDictionary(){
    var i = 0;
    $.getJSON('newyork-with-counties.json', function(json){
        var countyName
        for(var county of json.objects['subunits-ny'].geometries){
            countyName = county.properties['name'] != null ? county.properties['name'] : 'empty'

            if(countyName in NYCounties){
                NYCounties[countyName].id = county.id
                NYCounties[countyName].rgba = setRBGAColor('rgb(0,128,0)', NYCounties[countyName].percentage)
                NYCounties[countyName].name = countyName
                fillNYMap[countyName] = NYCounties[countyName].rgba
                dataNYMap[county.id] = {
                    fillKey: countyName,
                    name: countyName,
                    percentage: NYCounties[countyName].registeredVoters.toFixed(2)
                }
            }
            i++
        }
        fillNYMap['Enrollment Center Dots'] = '#FFB53B';
        fillNYMap['DMV Center Dots'] = '#00B7ED'

        NYMap = new Datamap({
            scope: 'subunits-ny',
            element: document.getElementById('container1'),
            projection: '',
            geographyConfig: {
                dataUrl: 'newyork-with-counties.json',
                highlightFillColor: '#F4C2C5',

                popupTemplate: function(geo, data) {
                            return ['<div class="hoverinfo"><strong>',
                                'Percent of voters ' + data.percentage,
                                '% in ' + data.name,
                                '</strong></div>'].join('');
                        }
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

setVotingEnrollmentPopUp()
setNYDictionary()

/**Helper functions***/
//sets the organ donation dots in the nyc map
function setEnrollmentCenterDots(){
    $.get('js/datasets/IDNYC_Enrollment_Centers_10-3-2015-geo-code.csv', function(csv){
        Papa.parse(csv, {
            complete: function(results){
                var i = 1;
                for(; i < results.data.length; i++){
                    var name = results.data[i][0];
                    if(results.data[i][1] != null && results.data[i][2] != null) {
                        enrollmentCenterBubbles.push({
                            name: name,
                            latitude: results.data[i][1],
                            longitude: results.data[i][2],
                            fillKey: 'Enrollment Center Dots',
                            radius: 5
                        })
                    }
                }
            }
        })
        //sets the bubbles in NYC area
        //NYMap.bubbles(enrollmentCenterBubbles)
    })
}
//sets the DMV location dots, it'll just be a big circle for verbosity
//data: Department_of_Motor_Vehicle__DMV__Office_Locations-NY.csv
function setDMVLocationDots(){
    $.get('js/datasets/Department_of_Motor_Vehicle__DMV__Office_Locations-NY-geocode.csv', function(csv){
        Papa.parse(csv, {
            complete: function(results){
                var i = 1;
                for(; i < results.data.length; i++){
                    var name = results.data[i][0];
                    if(results.data[i][1] != null && results.data[i][2] != null) {
                        enrollmentCenterBubbles.push({
                            name: name,
                            latitude: results.data[i][1],
                            longitude: results.data[i][2],
                            fillKey: 'DMV Center Dots',
                            radius: 5
                        })
                    }
                }
            }
        })
        //sets the bubbles in NYC area
        NYMap.bubbles(enrollmentCenterBubbles)
    })
}

//just show how many people have registered to vote and stuff
//data: 2015_Voter_Registration_By_County.csv
function setVotingEnrollmentPopUp(){
    $.get('js/datasets/2015_Voter_Registration_By_County.csv', function(csv){
        Papa.parse(csv, {
            complete: function(results){
                var i = 1, countyName, registeredVotersPercent;
                for (; i < results.data.length; i++){
                    countyName = results.data[i][2]
                    registeredVotersPercent = results.data[i][7]/results.data[i][4]*100
                    if(registeredVotersPercent == null){
                        NYCounties[countyName].registeredVoters = 0
                    }
                    else{
                        NYCounties[countyName].registeredVoters = registeredVotersPercent
                    }

                }
            }
        })
    })

    console.log(NYCounties)



    //NYMap.geographyConfig = {
    //    popupTemplate: function(geo, data) {
    //        return ['<div class="hoverinfo"><strong>',
    //            'Number of things in ' + geo.properties.name,
    //            ': ' + data.numberOfThings,
    //            '</strong></div>'].join('');
    //    }
    //}
}

setEnrollmentCenterDots()
setDMVLocationDots()
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