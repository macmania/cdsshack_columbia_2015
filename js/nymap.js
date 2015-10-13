//all of the fields that we need
var fillNYMap = {}
var dataNYMap = {}

var NYCounties = {}
var NYMap

//temporary right now, later
var outOfStateUSA = [];
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
                fillNYMap[countyName] = NYCounties[countyName].rgba
                dataNYMap[county.id] = {fillKey: countyName}
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

setNYDictionary()


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