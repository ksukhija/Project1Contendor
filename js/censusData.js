            
            var StatePopArray = [];
            var StatePopPop = [];
            var StatePopState = [];

            var StateStatArray = [];
            var StateStatPop = [];
            var StateStatState = [];

            var Polardata = [];
            var colorarray = ["Red","Blue","Green","Puple","Yellow","Grey","Orange","Red"];
            //var data;

            var strKey = "8bfe1e7705ae62fc954bf0105179fff15e3b2e5e";
            var StateAreaURL = "https://api.census.gov/data/2016/acs/acs5?get=NAME,B01001_001E&for=state:*&in=combined%20statistical%20area:308&key=" + strKey; 
            var StatePopURL = "https://api.census.gov/data/2014/pep/natstprc?get=STNAME,POP&for=state:*&DATE=7&key=" + strKey;
            var stateURL = "https://api.census.gov/data/timeseries/qwi/sa?get=year,agegrp,education,ethnicity&for=state:01&time=2017-Q1&key=" + strKey;
            var USCensusURL = "https://api.census.gov/data/2014/pep/natstprc?get=STNAME,POP&for=us:*&DATE="

            $(".showChart").on("click", showDataInSpecifiedChart)

            function showDataInSpecifiedChart(chartTypeSel) {
                var chartType  = chartTypeSel.target.id;
            
                switch(chartType) {
            
                    case "barChart":
                    drawChart('bar', "top-5-category-chart", exportTop10Category, exportTop10TradeValue);
                    break;
            
                    case "pieChart":
                    drawChart('pie', "top-5-category-chart", exportTop10Category, exportTop10TradeValue);
                    break;
            
                    case "doughNutChart":
                    drawChart('doughnut', "top-5-category-chart", exportTop10Category, exportTop10TradeValue);
                    break;
            
                    default:
                    break;
                }
            }

    function StatePop(strDivision,strURL,strChartTitle)
    {
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

function StateStats(strDivision,strURL,strChartTitle)
{
    // education ethnicity and agegroup per state
            $.ajax({
                url: strURL,
                method: "GET"
            }).then(function (stats) {

                console.log("StateStats:" + stats);
                for (var i = 1; i < stats.length; i++) 
                {                    
                    StateStatArray.push([stats[i][1], stats[i][2]]);                   
                }
                console.log("StateStatArray:" + StateStatArray);
                for (var j = 0; j < StateStatArray.length ; j++) 
                {               
                    agegrp = StateStatArray[j][0];
                    education =  StateStatArray[j][1];
                    ethnicity = StateStatArray[j][2];
                    StateStatState.push(StateStatArray[j][0]);
                    StateStatPop.push(StateStatArray[j][1]);
                }
                drawChart(strDivision, StateStatState, StateStatPop,strChartTitle);
            });
}


function USPopulation(strDivision,strURL,strChartTitle)
{        
        let listOfElements = []
        let years = 7
        for(let i = 1; i <= years; i++){
            $.ajax({
                url: strURL + i,
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
                    type: 'bar',
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
        // US population over years.
        USPopulation("USTtlPop-data",USCensusURL,"US population per Census");
        // statename, state population
        StatePop("StatePop-data",StatePopURL,"StateWise Population Chart");
        // GetStateDtls("StateArea-data",StateAreaURL,"StateWise Area Chart");
        StateStats("StateArea-data",stateURL,"StateWise Area Chart");
        