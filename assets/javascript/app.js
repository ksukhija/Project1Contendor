
const TRADE_FLOW_EXPORTS = "2";
const TRADE_FLOW_IMPORTS = "1";
const R_REPORTING_AREA_CODE_FOR_USA = "842";   //area reporting the trade data
const PX_CLASSIFICATION = "HS";  // trade data classification. HS stands for Harmonized System (for Goods)
const PS_TIME_PERIOD = "2017";
const P_PARTNER_AREA_CODE_FOR_CANADA = "124"; // area receiving the trade
const RG_TRADE_REGIME = TRADE_FLOW_EXPORTS;  // import or export data
const CC_CLASSIFICATION_CODE = "AG6";
//  var param = "r=699&px=HS&ps=2017&p=842&freq=A";
var param = "r=" + R_REPORTING_AREA_CODE_FOR_USA + "&px=" + PX_CLASSIFICATION + "&ps=" + PS_TIME_PERIOD + "&p=" + P_PARTNER_AREA_CODE_FOR_CANADA + "&rg=" + RG_TRADE_REGIME + "&cc=" + CC_CLASSIFICATION_CODE;
var queryURL = "https://comtrade.un.org/api/get?" + param;
var exportArray = [];
var importArray = [];
var exportTop10Category = [];
var exportTop10TradeValue = [];
var importTop10Category = [];
var importTop10TradeValue = [];

var OverallTradeData = new Object;

OverallTradeData.totalExports = 0;
OverallTradeData.totalImports = 0;
//   OverallTradeData.exportData.totalExports = 0;
OverallTradeData.totalExportsbyCmd = []; // for all 96 commodity categories
OverallTradeData.topFiveSubCategoryData = []; //2 dimensional array [category index][top five subcategories]

function sortFunction(a, b) {

return (b[2] - a[2]);

}


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


$("#carouselExampleIndicators2").on("click", carouselEventHandler);

function carouselEventHandler(event) {
    alert ("Hi I'm at carousel handler");



}

$('#carouselExampleIndicators2').on('slide.bs.carousel', function (event) {
    alert("at carousel event type =" + event.to);
  })


$.ajax({
    url: queryURL,
    method: "GET"
}).then(function (response) {

    //console.log(response);
    var len = response.dataset.length;
    var rDset = response.dataset
    //console.log(response.dataset[0].TradeValue);

    var old_commodityCode = 0;

    for (var i = 0; i < len; i++) {

        commodityCode = rDset[i].cmdCode;

        commodityCode = parseInt(commodityCode.substring(0, 2));

        //                    OverallTradeData.topFiveSubCategoryData[commodityCode].push([rDset[i].cmdCode,  rDset[i].cmdDescE, rDset[i].TradeValue ]);
        if (old_commodityCode == 0) {
            old_commodityCode = commodityCode;
        } else if (old_commodityCode != commodityCode) {
            // sort the export array 
            exportArray.sort(sortFunction);

            // save the top five trades 
            exportArray.length = 5;

            //create a new object and copy the trade data so that it can be added to the 
            // OverAllTradeData
            var dataObj = Object.assign({}, exportArray);

            OverallTradeData.topFiveSubCategoryData[old_commodityCode - 1] = dataObj;


            // clear the export array for the next commodity
            exportArray.length = 0;

            old_commodityCode = commodityCode;
        }

        exportArray.push([rDset[i].cmdCode, rDset[i].cmdDescE, rDset[i].TradeValue]);

    }

    // Display Export Data
    for (var j = 0; j < 5; j++) {

        var label = OverallTradeData.topFiveSubCategoryData[0][j][1];
        var value = OverallTradeData.topFiveSubCategoryData[0][j][2];

        exportTop10Category.push(label.substr(0, 24));
        exportTop10TradeValue.push(value);
    }

    // console.log(OverallTradeData);
    drawChart('doughnut', "top-5-category-chart", exportTop10Category, exportTop10TradeValue);



});

function drawChart(chartType, displayPosId, labelArray, DataArray) {
    var ctx = document.getElementById(displayPosId).getContext('2d');
    var chart = new Chart(ctx, {
        // The type of chart we want to create
        type: chartType,

        // The data for our dataset
        data: {
            labels: labelArray,
            datasets: [{
                label: "My First dataset",
                backgroundColor: [
                    'rgba(255, 99, 132, 0.2)',
                    'rgba(54, 162, 235, 0.2)',
                    'rgba(255, 206, 86, 0.2)',
                    'rgba(75, 192, 192, 0.2)',
                    'rgba(153, 102, 255, 0.2)',
                    'rgba(255, 159, 64, 0.2)'
                ],
                borderColor: [
                    'rgba(255,99,132,1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(153, 102, 255, 1)',
                    'rgba(255, 159, 64, 1)'
                ],
                borderWidth: 1,

                data: DataArray
            }]
        },

        // Configuration options go here
        options: {}
    });

}



