
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
const DEFAULT_CHART_TYPE  = 'doughnut';
var  chart_type = DEFAULT_CHART_TYPE;

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
    var chartType = chartTypeSel.target.id;

    switch (chartType) {

        case "barChart":
            //drawChart('bar', "trade-data-chart", exportTop10Category, exportTop10TradeValue);
            chart_type = 'bar'
            break;

        case "pieChart":
           // drawChart('pie', "trade-data-chart", exportTop10Category, exportTop10TradeValue);
           chart_type = 'pie';
            break;

        case "doughNutChart":
            //drawChart('doughnut', "trade-data-chart", exportTop10Category, exportTop10TradeValue);
            chart_type = 'doughnut';
            break;

        default:
            break;
    }
}


$("#carouselExampleIndicators2").on("click", carouselEventHandler);

function carouselEventHandler(event) {
   // alert("Hi I'm at carousel handler");



}


const BEVERAGES_COMMODITY_CODE         = 22;
const IRON_AND_STEEL_COMMODITY_CODE    = 72;
const COFFEE_TEA_SPICES_COMMODITY_CODE = 9;

var  first_commodity_data_to_show = BEVERAGES_COMMODITY_CODE;
var carouselId2CommodityMapping = [BEVERAGES_COMMODITY_CODE, IRON_AND_STEEL_COMMODITY_CODE, COFFEE_TEA_SPICES_COMMODITY_CODE];
var commodityDescription = ["BEVERAGES, SPIRITS & VINEGAR", "IRON & STEEL", "COFFEE, TEA & SPICES"]

$('#carouselExampleIndicators2').on('slide.bs.carousel', function (event) {
    var next_commodity_to_display = carouselId2CommodityMapping[event.to];

 //clear the  arrays holding the old data
 exportTop10Category.length =0; 
 exportTop10TradeValue.length=0;

 displayExportData(next_commodity_to_display);

})




/**
 * Read the data from UN ComTrade Website using their API 
 * WE read the data once in the begining
 **/
function getTradeData() {

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
                OverallTradeData.totalExportsbyCmd[commodityCode-1] = 0;

            } else if (old_commodityCode != commodityCode) {
               
                OverallTradeData.totalExportsbyCmd[commodityCode-1] = 0;

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
            
            OverallTradeData.totalExportsbyCmd[commodityCode-1] +=rDset[i].TradeValue;

            exportArray.push([rDset[i].cmdCode, rDset[i].cmdDescE, rDset[i].TradeValue]);

        }

    displayExportData(first_commodity_data_to_show);
    });


}


function displayExportData(commodityCode) {
     
    var temp;

    // Display Export Data
    for (var j = 0; j < 5; j++) {

        var label = OverallTradeData.topFiveSubCategoryData[commodityCode-1][j][1];
        var value = OverallTradeData.topFiveSubCategoryData[commodityCode-1][j][2];

        exportTop10Category.push(label.substr(0, 20));
        exportTop10TradeValue.push(value);
    }

   
    //display the values on cards  - total value and subcategory value
    $("#cat-heading").text(commodityDescription[carouselId2CommodityMapping.indexOf(commodityCode)]);
    $("#cat-total-value").text("$" + OverallTradeData.totalExportsbyCmd[commodityCode-1]);
    
    temp = OverallTradeData.topFiveSubCategoryData[commodityCode-1][0][1].slice(0,30);
    $("#sub-cat-1").text(temp + "  :  " + "$" + OverallTradeData.topFiveSubCategoryData[commodityCode-1][0][2]);

    temp = OverallTradeData.topFiveSubCategoryData[commodityCode-1][1][1].slice(0,30);
    $("#sub-cat-2").text(temp + "  :  " + "$" + OverallTradeData.topFiveSubCategoryData[commodityCode-1][1][2]);
   
    temp = OverallTradeData.topFiveSubCategoryData[commodityCode-1][2][1].slice(0,30);
    $("#sub-cat-3").text(temp + "  :  " + "$" + OverallTradeData.topFiveSubCategoryData[commodityCode-1][2][2]);
   
    temp = OverallTradeData.topFiveSubCategoryData[commodityCode-1][3][1].slice(0,30);
    $("#sub-cat-4").text(temp + "  :  " + "$" + OverallTradeData.topFiveSubCategoryData[commodityCode-1][3][2]);
   
    temp = OverallTradeData.topFiveSubCategoryData[commodityCode-1][4][1].slice(0,30);
    $("#sub-cat-5").text(temp + "  :  " + "$" + OverallTradeData.topFiveSubCategoryData[commodityCode-1][4][2]);

    // console.log(OverallTradeData);
    drawChart("trade-data-chart", exportTop10Category, exportTop10TradeValue);


}



function drawChart(displayPosId, labelArray, DataArray) {
    var canvas = document.getElementById(displayPosId);
    var context = canvas.getContext('2d');
    
    //Before drawing clear the canvas
    context.clearRect(0,0, canvas.width, canvas.height);

    var chart = new Chart(canvas, {
        // The type of chart we want to create
        type: chart_type,

        // The data for our dataset
        data: {
            labels: labelArray,
            datasets: [{
                label: "Trade Data",
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

const PAUSED = 0;
const CYCLE = 1;
const INITIAL_PAUSE_BUTTON_STATE = CYCLE;
var pause_btn_state = INITIAL_PAUSE_BUTTON_STATE;

function carouselPauseBtnHandler() {

    if(pause_btn_state == CYCLE) {
        $("#carouselExampleIndicators2").carousel('pause');
        $("#pause-btn").text("CLICK TO CYCLE");
        pause_btn_state = PAUSED;

    }else {
        $("#carouselExampleIndicators2").carousel('cycle');
        $("#pause-btn").text("CLICK TO PAUSE");
        pause_btn_state = CYCLE;


    }

}

$("#pause-btn").on("click", carouselPauseBtnHandler);


/**
 *  Let the page load, before we start executing the javascript/jQuery Code
 */
$(document).ready(function () {

   
    // read the data from the COMTrade Website
    getTradeData();

});