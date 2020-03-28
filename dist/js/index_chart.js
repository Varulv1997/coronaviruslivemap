var report1_name = "/Applications/COR20_APAC/Report Designs/covid_linearChart.rptdesign;1";
var report2_name = "/Applications/COR20_APAC/Report Designs/covid_updateNews.rptdesign;1";
var report3_name = "/Applications/COR20_APAC/Report Designs/covid_WordCloud_keywords.rptdesign;3";

actuate.load('viewer');
var reqOps = new actuate.RequestOptions();
reqOps.setRepositoryType('Enterprise');
reqOps.setVolume('Default Volume');
reqOps.setCustomParameters({});
actuate.initialize('http://58.153.97.117:8700/iportal/',
  reqOps == undefined ? null : reqOps, 'Administrator', '',
  myInit);

function myInit(country_region_val) {

  mySubInit1(country_region_val);
  mySubInit2(country_region_val);
  mySubInit3(country_region_val);

}

function mySubInit1(country_region_val) {

  var current_country_val = $("#current_country").val();

  viewer1 = new actuate.Viewer('container1');
  var w = jQuery("#report-1").width();
  var h = jQuery("#report-1").innerHeight();
  viewer1.setSize(w, h);

  viewer1.setReportDesign(report1_name);
  var parameterValueMap = {
    g_param_country: current_country_val
  };
  var parameterValues1 = [];
  for (var key in parameterValueMap) {
    var param = new actuate.viewer.impl.ParameterValue();
    param.setName(key);

    if (parameterValueMap[key] != null) {
      param.setValue(parameterValueMap[key]);
    } else {
      param.setValueIsNull(true);
    }
    parameterValues1.push(param);
  }
  viewer1.setParameterValues(parameterValues1);
  var options = new actuate.viewer.UIOptions();
  options.enableToolBar(false);
  viewer1.setUIOptions(options);
  viewer1.submit();
}

function mySubInit2(country_region_val) {

  var current_country_val = $("#current_country").val();

  viewer2 = new actuate.Viewer('container2');

  var parameterValueMap = {
    g_param_country: current_country_val
  };
  var parameterValues2 = [];
  for (var key in parameterValueMap) {
    var param = new actuate.viewer.impl.ParameterValue();
    param.setName(key);


    //alert(key + parameterValueMap[key]);

    if (parameterValueMap[key] != null) {
      param.setValue(parameterValueMap[key]);
    } else {
      param.setValueIsNull(true);
    }
    parameterValues2.push(param);
  }
  viewer2.setParameterValues(parameterValues2);

  var w2 = jQuery("#report-2").innerWidth() - 40;
  var h2 = jQuery("#report-2").innerHeight() + 40;
  viewer2.setSize(w2, h2);
  viewer2.setReportDesign(report2_name);
  var options2 = new actuate.viewer.UIOptions();
  options2.enableToolBar(false);
  viewer2.setUIOptions(options2);
  viewer2.submit();
}

function mySubInit3(country_region_val) {

  var current_country_val = $("#current_country").val();

  viewer3 = new actuate.Viewer('container3');
  var parameterValueMap = {};
  var parameterValues3 = [];
  for (var key in parameterValueMap) {
    var param = new actuate.viewer.impl.ParameterValue();
    param.setName(key);
    if (parameterValueMap[key] != null) {
      param.setValue(parameterValueMap[key]);
    } else {
      param.setValueIsNull(true);
    }
    parameterValues3.push(param);
  }
  viewer2.setParameterValues(parameterValues3);

  var w3 = jQuery("#report-3").innerWidth();
  var h3 = jQuery("#report-3").innerHeight();
  viewer3.setSize(w3, h3);
  viewer3.setReportDesign(report3_name);
  var options3 = new actuate.viewer.UIOptions();
  options3.enableToolBar(false);
  viewer3.setUIOptions(options3);
  viewer3.submit();

}

jQuery(window).resize(function () {
  myInit("");

});

jQuery("#linear-report")
  .click(
    function () {
      report1_name = "/Applications/COR20_APAC/Report Designs/covid_linearChart.rptdesign;1";
      mySubInit1("");
      $("#logarithmic-report").removeClass("active");
      $(this).addClass("active");
      //alert( "Handler for .click() called." );
    });

jQuery("#logarithmic-report")
  .click(
    function () {
      report1_name = "/Applications/COR20_APAC/Report Designs/covid_LogarithmicChart.rptdesign;1";
      mySubInit1("");
      $("#linear-report").removeClass("active");
      $(this).addClass("active");
      //alert( "Handler for .click() called." );
    });

jQuery("#keywords-report")
  .click(
    function () {
      report3_name = "/Applications/COR20_APAC/Report Designs/covid_WordCloud_keywords.rptdesign;3";
      mySubInit3("");
      $("#topics-report").removeClass("active");
      $(this).addClass("active");
      //alert( "Handler for .click() called." );
    });

jQuery("#topics-report")
  .click(
    function () {
      report3_name = "/Applications/COR20_APAC/Report Designs/covid_WordCloud_Topic.rptdesign;2";
      mySubInit3("");
      $("#keywords-report").removeClass("active");
      $(this).addClass("active");
      // alert( "Handler for .click() called." );
    });
