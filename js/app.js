/**
 *  C O N S T A N T S
 */
const TRADE_FLOW_EXPORTS = "2";
const TRADE_FLOW_IMPORTS = "1";
const R_REPORTING_AREA_CODE_FOR_USA = "842";   //area reporting the trade data
const PX_CLASSIFICATION = "HS";  // trade data classification. HS stands for Harmonized System (for Goods)
const PS_TIME_PERIOD = "2017";
const P_PARTNER_AREA_CODE_FOR_CANADA = "124"; // area receiving the trade
const RG_TRADE_REGIME = TRADE_FLOW_EXPORTS;  // import or export data
const CC_CLASSIFICATION_CODE = "AG6";
const DEFAULT_CHART_TYPE = 'doughnut';
const BEVERAGES_COMMODITY_CODE = 22;
const IRON_AND_STEEL_COMMODITY_CODE = 72;
const COFFEE_TEA_SPICES_COMMODITY_CODE = 9;
const SHIPS_BOATS_COMMODITY_CODE = 89;
const PHARMACEUTICAL_COMMODITY_CODE = 30;
const PAUSED = 0;
const CYCLE = 1;
const INITIAL_PAUSE_BUTTON_STATE = CYCLE;


/**
 *  G L O B A L S
 */
var param = "r=" + R_REPORTING_AREA_CODE_FOR_USA + "&px=" + PX_CLASSIFICATION + "&ps=" + PS_TIME_PERIOD + "&p=" + P_PARTNER_AREA_CODE_FOR_CANADA + "&rg=" + RG_TRADE_REGIME + "&cc=" + CC_CLASSIFICATION_CODE;
var queryURL = "https://comtrade.un.org/api/get?" + param;
var exportArray = [];
var importArray = [];
var exportTop10Category = [];
var exportTop10TradeValue = [];
var importTop10Category = [];
var importTop10TradeValue = [];
var OverallTradeData = new Object;
var chart_type = DEFAULT_CHART_TYPE;
var first_commodity_data_to_show = BEVERAGES_COMMODITY_CODE;
var carouselId2CommodityMapping = [BEVERAGES_COMMODITY_CODE, IRON_AND_STEEL_COMMODITY_CODE, COFFEE_TEA_SPICES_COMMODITY_CODE, SHIPS_BOATS_COMMODITY_CODE, PHARMACEUTICAL_COMMODITY_CODE];
var commodityDescription = ["BEVERAGES, SPIRITS & VINEGAR", "IRON & STEEL", "COFFEE, TEA & SPICES", "SHIPS, BOATS & FLOATING STRUCTURES", "PHARMACEUTICAL PRODUCTS"]
var pause_btn_state = INITIAL_PAUSE_BUTTON_STATE;


/**
 *  This function compares an element of an array with other 
 *  array element and returns the difference between the two.
 *  Used for sorting an array 
 * 
 * @param {Array 1} a 
 * @param {Array 2} b 
 */


function compareFunction(a, b) {

    return (b[2] - a[2]);

}

/**
 *  This function is called when the user makes a selection on the chartType 
 *  Radio Button
 * 
 * @param {Event triggered on selecting chartType Radio Button} chartTypeRadioBtnEvent 
 */
function showDataInSpecifiedChart(chartTypeRadioBtnEvent) {
    var chartType = chartTypeRadioBtnEvent.target.id;

    switch (chartType) {

        case "barChart":
            chart_type = 'bar'
            break;

        case "pieChart":
            chart_type = 'pie';
            break;

        case "doughNutChart":
            chart_type = 'doughnut';
            break;

        default:
            break;
    }
}



/**
 *  Called on every change of Carousel Slide
 */
$('#carouselExampleIndicators2').on('slide.bs.carousel', function (event) {

    var next_commodity_to_display = carouselId2CommodityMapping[event.to];

    //clear the  arrays holding the old data
    exportTop10Category.length = 0;
    exportTop10TradeValue.length = 0;

    displayExportData(next_commodity_to_display);

})




/**
 * Read the data from UN ComTrade Website using their API 
 * WE read the data once in the begining.
 * 
 *  Note : This uses async Ajax function, so this function will 
 *         return possibly without having the trade data. Trade 
 *         data will come sometime later.
 *     
 **/
function getTradeData() {

    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(function (response) {

        var len = response.dataset.length;
        var rDset = response.dataset;
        var old_commodityCode = 0;

        for (var i = 0; i < len; i++) {

            commodityCode = rDset[i].cmdCode;
            commodityCode = parseInt(commodityCode.substring(0, 2));

            if (old_commodityCode == 0) {
                old_commodityCode = commodityCode;
                OverallTradeData.totalExportsbyCmd[commodityCode - 1] = 0;

            } else if (old_commodityCode != commodityCode) {

                OverallTradeData.totalExportsbyCmd[commodityCode - 1] = 0;

                // sort the export array 
                exportArray.sort(compareFunction);

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

            OverallTradeData.totalExportsbyCmd[commodityCode - 1] += rDset[i].TradeValue;
            exportArray.push([rDset[i].cmdCode, rDset[i].cmdDescE, rDset[i].TradeValue]);

        }

        displayExportData(first_commodity_data_to_show);
    });

} /* End of Function getTradeDate */



/**
 *  This function extracts the data for the given commodity  and displays at the 
 *  designated position on the web page.
 * 
 * @param {Commodity code for which the data and Chart are to be displayed} commodityCode 
 */
function displayExportData(commodityCode) {

    var temp;

    // Display Export Data
    for (var j = 0; j < 5; j++) {

        var label = OverallTradeData.topFiveSubCategoryData[commodityCode - 1][j][1];
        var value = OverallTradeData.topFiveSubCategoryData[commodityCode - 1][j][2];

        exportTop10Category.push(label.substr(0, 20));
        exportTop10TradeValue.push(value);
    }


    //display the values on cards  - total value and subcategory value
    $("#cat-heading").text(commodityDescription[carouselId2CommodityMapping.indexOf(commodityCode)]);
    $("#cat-total-value").text("$" + OverallTradeData.totalExportsbyCmd[commodityCode - 1]);

    temp = OverallTradeData.topFiveSubCategoryData[commodityCode - 1][0][1].slice(0, 30);
    $("#sub-cat-1").text(temp + "  :  " + "$" + OverallTradeData.topFiveSubCategoryData[commodityCode - 1][0][2]);

    temp = OverallTradeData.topFiveSubCategoryData[commodityCode - 1][1][1].slice(0, 30);
    $("#sub-cat-2").text(temp + "  :  " + "$" + OverallTradeData.topFiveSubCategoryData[commodityCode - 1][1][2]);

    temp = OverallTradeData.topFiveSubCategoryData[commodityCode - 1][2][1].slice(0, 30);
    $("#sub-cat-3").text(temp + "  :  " + "$" + OverallTradeData.topFiveSubCategoryData[commodityCode - 1][2][2]);

    temp = OverallTradeData.topFiveSubCategoryData[commodityCode - 1][3][1].slice(0, 30);
    $("#sub-cat-4").text(temp + "  :  " + "$" + OverallTradeData.topFiveSubCategoryData[commodityCode - 1][3][2]);

    temp = OverallTradeData.topFiveSubCategoryData[commodityCode - 1][4][1].slice(0, 30);
    $("#sub-cat-5").text(temp + "  :  " + "$" + OverallTradeData.topFiveSubCategoryData[commodityCode - 1][4][2]);

    drawChart("trade-data-chart", exportTop10Category, exportTop10TradeValue);

}


/**
 *  This function draws the Chart at the specifed place on the web page.
 *  The type of Chart drawn is controlled by the global variable 'chart_type'
 * 
 * @param {The selector on the web page where the chart is to be drawn} displayPosId 
 * @param {Array containing Labels for the data } labelArray 
 * @param {Array containing the actual Data } DataArray 
 */
function drawChart(displayPosId, labelArray, DataArray) {
    var canvas = document.getElementById(displayPosId);
    var context = canvas.getContext('2d');

    //Before drawing clear the canvas
    context.clearRect(0, 0, canvas.width, canvas.height);

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


/**
 *  This function controlls the pause and cycle of the slides in the Carousel.
 *  It gets activated when user clicks on the Pause/Cycle Button
 */

function carouselPauseBtnHandler() {

    if (pause_btn_state == CYCLE) {
        $("#carouselExampleIndicators2").carousel('pause');
        $("#pause-btn").text("CLICK TO CYCLE");
        pause_btn_state = PAUSED;
    } else {
        $("#carouselExampleIndicators2").carousel('cycle');
        $("#pause-btn").text("CLICK TO PAUSE");
        pause_btn_state = CYCLE;
    }

}



/**
 * Register on click event listener functions
 */
$("#pause-btn").on("click", carouselPauseBtnHandler);
$(".showChart").on("click", showDataInSpecifiedChart);


/**
 *  Let the page load, before we start executing the javascript/jQuery Code
 */
$(document).ready(function () {

    /**
     * Initialize Data
     */
    OverallTradeData.totalExports = 0;
    OverallTradeData.totalImports = 0;
    OverallTradeData.totalExportsbyCmd = []; // for all 96 commodity categories
    OverallTradeData.topFiveSubCategoryData = [];

    // read the data from the COMTrade Website
    getTradeData();

});