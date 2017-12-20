var jenkins = {
  viewName: "vertigo",
  jenkinsUrl: "http://jenkins.adscale.co.nz",
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
  var totalWidth = $(window).width();
  var totalHeight = $(window).height();
  var totalLength = 0;
  $("#buildList .jobNode").each(function() {
      totalLength += $(this).text().length;
  });

  $("#buildList .jobNode").each(function() {
      totalInverseLength += totalLength / $(this).text().length;
  });

  $(".jobNode").each(function() {
    var jobName = $(this).text().length;
    var divHeight = (((totalLength / jobName) / totalInverseLength) * totalHeight) - 4;//border is 2px
    $(this).css({"font-size": Math.min((divHeight * 0.8), (totalWidth/jobName)*1.5) + "px", "height": divHeight + "px", "line-height": divHeight + "px"});
  });
};

// var releasing = function() {
//   var jobUrl = jenkins.jenkinsUrl + "/job/release/api/json?tree=color";
//   $.getJSON(jobUrl, function (json) {
//     if (json["color"].indexOf("anime") !== -1) {
//       var status = json.color.replace("_", " ");
//       $(".jobNode").first().insertBefore('<div class="jobNode ' + status + '">RELEASING!</div>');
//       console.log(json);
//     }
//   });
// }

var updateBuildList = function () {
    var jenkins = window.jenkins;
    var buildList = $('#buildList');
    buildList.append('<div id="noJson" class="bigFont">Could not load JSON from jenkins</div>')
    var jobUrl = jenkins.jenkinsUrl + "/view/" + jenkins.viewName + "/api/json";
    $.getJSON(jobUrl, function (json) {
        $("#noJson").remove();
        var responseHash = new String(JSON.stringify(json)).hashCode()
        if (responseHash === jenkins.lastHash) {
            console.info("Hash is the same (" + jenkins.lastHash + ") no need to redraw");
        }
        else {
            console.info("New info! (" + jenkins.lastHash + " -> " + responseHash + ") redrawing.");
            jenkins.lastHash = responseHash;
            $(".jobNode").remove();
            window.jsonResponse = json;
            for (i = 0; i < json["jobs"].length; i++) {
                var job = json["jobs"][i];
                var jobName = job["name"];
                var status = job["color"].replace("_", " ");

                if (jobName === "release" ) {
                  if (status.indexOf("anime") === -1) {
                    continue;
                  }
                  buildList.prepend('<div class="jobNode release ' + status + '">            RELEASING            </div>');
                  continue;
                }
                buildList.append('<div class="jobNode ' + status + '">' + jobName + '</div>');
            }
            resize();
        }
        setTimeout(updateBuildList, 10000);
    });
};
