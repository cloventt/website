var jenkins = {
  viewName: "Vertigo",
  jenkinsUrl: "http://jenkins.ap-southeast-2.compute.internal:8080",
  lastHash: 0,
  lastWidth: 0,
  lastHeight: 0,
  jobs: []
};

window["jenkins"] = jenkins;

$(document).ready(function () {
    $('#deleteMe').remove();
    $('#jsRender').remove();
    updateBuildList();
    $(window).on("resize", resize);
    $(window).on("orientationchange", resize);
});

String.prototype.hashCode = function () {
    var hash = 0, i, chr;
    if (this.length === 0) {
        return hash;
    }
    for (i = 0; i < this.length; i++) {
        chr = this.charCodeAt(i);
        hash = (hash * 31) + chr;
        hash |= 0; // Convert to 32bit integer
    }
    return hash;
};

var resize = function() {
  var buildList = $('#buildList');
  var totalInverseLength = 0;
  var totalWidth = buildList.width();
  var totalHeight = buildList.height();
  var totalLength = 0;
  $("#buildList .jobNode").each(function() {
      totalLength += $(this).text().length;
  });


  for (i = 0; i < window.jsonResponse["jobs"].length; i++) {
      totalInverseLength += totalLength / window.jsonResponse["jobs"][i]["name"].length;
  }
  $(".jobNode").each(function() {
    var jobName = $(this).text().length;
    var divHeight = (((totalLength / jobName) / totalInverseLength) * totalHeight) - 4;//border is 2px
    $(this).css({"font-size": Math.min((divHeight * 0.8), (totalWidth/jobName)*1.5) + "px", "height": divHeight + "px", "line-height": divHeight + "px"});
  });
};

var updateBuildList = function () {
    var jenkins = window.jenkins;
    var buildList = $('#buildList');
    buildList.append('<div id="noJson" class="bigFont">Could not load JSON from jenkins</div>')
    var jobUrl = jenkins.jenkinsUrl + "/view/" + jenkins.viewName + "/api/json?tree=jobs[name,color]";
    $.getJSON(jobUrl, function (json) {
        $("#noJson").remove();
        var responseHash = new String(JSON.stringify(json)).hashCode()
        if (responseHash == jenkins.lastHash && jenkins.lastHeight == jenkins.totalHeight && jenkins.lastWidth == jenkins.totalWidth) {
            console.info("Hash is the same (" + jenkins.lastHash + ") no need to redraw");
        }
        else {
            console.info("New info! (" + jenkins.lastHash + " -> " + jenkins.responseHash + ") redrawing.");
            jenkins.lastHash = responseHash;
            $(".jobNode").remove();
            window.jsonResponse = json;
            for (i = 0; i < json["jobs"].length; i++) {
                var job = json["jobs"][i];
                var jobName = job["name"];
                var status = job["color"].replace("_", " ");
                buildList.append('<div class="jobNode ' + status + '">' + jobName + '</div>');
            }
            resize();
        }
        setTimeout(updateBuildList, 10000);
    });
};
