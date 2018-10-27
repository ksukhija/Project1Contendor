var StatePopArray = [];
var StatePopPop = [];
var StatePopState = [];

var StateStatArray = [];
var StateStatPop = [];
var StateStatState = [];
var ranNums = []; 
var Polardata = [];

//var data;

//population per state by counties
//https://api.census.gov/data/2017/pep/population?get=POP,GEONAME&for=county:*&in=state:*&key=8bfe1e7705ae62fc954bf0105179fff15e3b2e5e
//https://api.census.gov/data/2017/pep/population?get=POP,GEONAME&for=county:*&in=state:04&key=8bfe1e7705ae62fc954bf0105179fff15e3b2e5e

// population by geo codes
// https://api.census.gov/data/2017/pep/population?get=POP,GEONAME&for=region:*&DATE=9&key=8bfe1e7705ae62fc954bf0105179fff15e3b2e5e
//var StateAreaURL = "https://api.census.gov/data/2016/acs/acs5?get=NAME,B01001_001E&for=state:*&in=combined%20statistical%20area:308&key=" + strKey; 
//var stateURL = "https://api.census.gov/data/timeseries/qwi/sa?get=year,agegrp,education,ethnicity&for=state:01&time=2017-Q1&key=" + strKey;

var strKey = "8bfe1e7705ae62fc954bf0105179fff15e3b2e5e";
var StateCode = "37";
var StateName = "North Carolina";
var chart_type = "line";

var USStatePopURL = "https://api.census.gov/data/2014/pep/natstprc?get=STNAME,POP&for=state:*&DATE=7&key=" + strKey;
var USCensusURL = "https://api.census.gov/data/2014/pep/natstprc?get=STNAME,POP&for=us:*&DATE="
var stateURL = "https://api.census.gov/data/2017/pep/population?get=POP,GEONAME&for=county:*&in=state:"; 



function LoadQuizz() {
	for (i = 0 ; i < TriaviaQuizz.length ; i ++)
	{
		if (TriaviaQuizz[i].strState == StateName)
		{
    //i =  Math.floor(Math.random() * (TriaviaQuizz.length));    
    $('#strstate').html(TriaviaQuizz[i].strState + " - Fun Facts");
    $('#strstate1').html(TriaviaQuizz[i].strState + " - Geographical Stats");    
    $('#funcfact').html(TriaviaQuizz[i].Facts); 
    $('#geographyfact').html(TriaviaQuizz[i].Geography); 
		}
	}
}

$(".showChart").on("click", showDataInSpecifiedChart)

function showDataInSpecifiedChart(chartTypeSel) {
    var chartType = chartTypeSel.target.id;

    switch (chartType) {

        case "barChart":           
            chart_type = 'bar'
            break;

        case "lineChart":
           chart_type = 'line';
            break;

    }
}
            
function USStatePop(strDivision,strURL,strChartTitle)
{
	StatePopState = [];
	StatePopPop = [];
	
        $.ajax({
            url: strURL,
            method: "GET"
        }).then(function (vresponse) {

           // console.log("vresponse" + vresponse);
            for (var i = 1; i < vresponse.length; i++) 
            {                    
                StatePopArray.push([vresponse[i][0], vresponse[i][1]]);                   
            }
            
            for (var j = 0; j < StatePopArray.length ; j++) 
            {                    
                StatePopState.push(StatePopArray[j][0]);
                StatePopPop.push(StatePopArray[j][1]);
            }
            drawChart(strDivision, StatePopState, StatePopPop,strChartTitle);
        });
}


function USPopulation(strDivision,strURL,strChartTitle)
{        
        let listOfElements = []
        let years = 7
        for(let i = 1; i <= years; i++){
            $.ajax({
                url: strURL + i + "&key=" + strKey,
                method: "GET"
            }).then(function (vresponse) {  
                listOfElements.push(parseInt(vresponse[1][1]));
                if(listOfElements.length===years){
                    Polardata = listOfElements
                    drawPolarArea(strDivision, strChartTitle)
                }
            });
        }
}


function StatewiseStats(strDivision,strChartTitle)
{

	StateStatState = [];
	StateStatPop = [];
	StateStatArray = [];
	
	var newurl = stateURL + StateCode + "&key=" + strKey;
	console.log ("newurl" + newurl);
    // population per county for selected state 
            $.ajax({
                url: newurl,
                method: "GET"
            }).then(function (stats) {
			
                console.log("StateStats:" + stats);
                for (var i = 1; i < stats.length; i++) 
                {                    
                    StateStatArray.push([stats[i][0], stats[i][1]]);                   
                }
               // console.log("StateStatArray:" + StateStatArray);
                for (var j = 0; j < StateStatArray.length ; j++) 
                {               
                    StateStatState.push(StateStatArray[j][1]);
                    StateStatPop.push(StateStatArray[j][0]);
                }
                drawChart(strDivision, StateStatState, StateStatPop,strChartTitle);
            });
}



function drawPolarArea(dataType, vTitle)
{
   var data = {
        labels:    [            '2011','2012','2013','2014','2015','2016','2017'        ],
        datasets: [{            
            data: Polardata   ,
            label: vTitle,
            backgroundColor: [
                'rgba(255, 99, 132, 0.2)',
                'rgba(54, 162, 235, 0.2)',
                'rgba(255, 206, 86, 0.2)',
                'rgba(75, 192, 192, 0.2)',
                'rgba(153, 102, 255, 0.2)',
                'rgba(255, 159, 64, 0.2)',
                'rgba(255, 99, 132, 0.2)',
            ],
            borderColor: [
                'rgba(255,99,132,1)',
                'rgba(54, 162, 235, 1)',
                'rgba(255, 206, 86, 1)',
                'rgba(75, 192, 192, 1)',
                'rgba(153, 102, 255, 1)',
                'rgba(255, 159, 64, 1)',
                'rgba(255, 99, 132, 0.2)',
            ],
            borderWidth: 1,
          }]
    };
    
    var ctx = document.getElementById(dataType);
    var chart = new Chart(ctx, {
         type: 'line',
        data: data                 
    });
}


function drawChart(dataType, labelArray, DataArray, strChartTitle) 
{
                var ctx = document.getElementById(dataType).getContext('2d');
                var chart = new Chart(ctx, {
                    // The type of chart we want to create
                    type: chart_type,
				    //type: 'line',
                    // The data for our dataset
                    data: {
                        labels: labelArray,
                        datasets: [{
                            label: strChartTitle,
                            backgroundColor: 'rgb(255, 99, 132)',							
                            borderColor: 'rgb(255, 99, 132)',
                            data: DataArray,
                        }]
                    },

                    // Configuration options go here
                    options: {}
                });
}

function mapCodes(statename)
{
	switch (statename) {
    case "Alabama":
        StateCode = "01";
        break;
    case "Alaska":
        StateCode = "02";
        break;
    case "Arizona":
        StateCode = "04";
        break;
    case "California":
        StateCode = "06";
        break;
    case "Delaware":
        StateCode = "10";
        break;
    case "Hawaii":
        StateCode = "15";
        break;
    case "Maryland":
        StateCode = "24";
		break;
    case "Montana":
        StateCode = "30";
        break;
    case "Nevada":
        StateCode = "32";
        break;
    case "New York":
        StateCode = "36";
		break;
	case "North Carolina":
        StateCode = "37";
        break;
}
}

$(document).on('click', '.dropdown-menu li a', function() {
    //$('#datebox').val($(this).html());
    
	StateName = $(this).html();
	mapCodes($(this).html());
	LoadQuizz();
    // per state
	//alert ("Hi there" + StateCode );
	var Chartttl = StateName + "- County Population";
    StatewiseStats("StateArea-data",Chartttl);
	$("#StateTitle").html(Chartttl);
}); 

LoadQuizz();
// USA population over past 7 years.
USPopulation("USTtlPop-data",USCensusURL,"USA population per Census");
// statename, state population for all states in USA
USStatePop("StatePop-data",USStatePopURL,"StateWise Population Chart");
// per state - county population
StateName = "North Carolina";
var Chartttl = StateName + "- County Population";
StatewiseStats("StateArea-data",Chartttl);
$("#StateTitle").html(Chartttl  );