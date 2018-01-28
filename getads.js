window.adscale = window.adscale ? window.adscale : {ih:"ih.adscale.de/adscale-ih/impr",adex:"dmp.theadex.com/d/607/3258/s/adex.js",css:"js.adscale.de/",autoCloseDelay:"3000",response:[],gaa:"gaa.adscale.de/impr"
};
if (!adscaleNS) {
    var customSlotIdPropertyName = "adscale_custom_slot_id";
    var customSlotIdToken = "__" + customSlotIdPropertyName + "__";
    var customBackfillCallbackIdPropertyName = "adscale_custom_cb_id";
    var customBackfillCallbackIdToken = "__" + customBackfillCallbackIdPropertyName + "__";

    function getAdscaleCustomSlotIdQueryParam() {
        var slotId = window[customSlotIdPropertyName];
        if (slotId) {
            if (slotId.length < 256) {
                return ("&acsid=" + encodeURIComponent(slotId));
            }
        }
        return "";
    }

    var createAndAppendScriptTag = function (src) {
        var scripTag = document.createElement('script');
        scripTag.type = 'text/javascript';
        scripTag.src = src;
        scripTag.async = true;
        var otherScriptTag = document.getElementsByTagName('script')[0];
        otherScriptTag.parentNode.insertBefore(scripTag, otherScriptTag);
    };

    var renderAdexSnippet = (function () {
        var rendered = false;
        return function () {
            if (!rendered) {
                rendered = true;
                var sourceUrl = ('https:' === document.location.protocol ? 'https://' : 'http://') + window.adscale.adex;
                createAndAppendScriptTag(sourceUrl)
            }
        };
    })();

    var adscaleNS = {
        renderAdexSnippet: renderAdexSnippet,

        // render wallpaper preview
        adscale_preview: function () {

            /* -- adscale wallpaper - banner spacer -- */
            var adscaleWallpaperSpacer = document.createElement("div");
            adscaleWallpaperSpacer.id = 'adscale_banner_spacer';
            document.body.appendChild(adscaleWallpaperSpacer);


            /* -- adscale wallpaper - banner -- */
            var h1El1 = document.createElement("h1");
            h1El1.appendChild(document.createTextNode("Leaderboard advert"));
            var bannerElement = document.createElement("div");
            bannerElement.id = "adscale_banner";
            bannerElement.appendChild(h1El1);
            document.body.appendChild(bannerElement);

            /* -- adscale wallpaper - skyscraper -- */
            var skyscraperElement = document.createElement("div");
            skyscraperElement.id = "adscale_skyscraper";
            skyscraperElement.appendChild(document.createElement("br"));
            skyscraperElement.appendChild(document.createElement("br"));
            skyscraperElement.appendChild(document.createElement("br"));
            var h1El2 = document.createElement("h1");
            h1El2.appendChild(document.createTextNode("Skyscraper"));
            h1El2.appendChild(document.createElement("br"));
            h1El2.appendChild(document.createElement("br"));
            h1El2.appendChild(document.createTextNode("advert"));
            skyscraperElement.appendChild(h1El2);
            document.body.appendChild(skyscraperElement);

            setTimeout(function () {
                var spacer = document.getElementById("adscale_banner_spacer");
                spacer.style.position = "relative";
                spacer.style.width = "768px";
                spacer.style.height = "90px";
                spacer.style.margin = "0";
                spacer.style.padding = "0";

                var banner = document.getElementById("adscale_banner");
                banner.style.position = "absolute";
                banner.style.width = "768px";
                banner.style.height = "90px";
                banner.style.background = "#0E0";
                banner.style.right = "0px";
                banner.style.top = "0px";
                banner.style.zIndex = "10000";

                var skyscraper = document.getElementById("adscale_skyscraper");
                skyscraper.id = "adscale_skyscraper";
                skyscraper.style.position = "absolute";
                skyscraper.style.width = "160px";
                skyscraper.style.height = "600px";
                skyscraper.style.background = "#0E0";
                skyscraper.style.right = "-160px";
                skyscraper.style.top = "0px";
                skyscraper.style.zIndex = "10000";
            }, 0);

            // noinspection JSUnresolvedVariable
            if (typeof adscale_wallpaper_callback === 'function') {
                // noinspection JSUnresolvedFunction
                adscale_wallpaper_callback();
            }

            adscale_wallpaper_preview = false;

        },

        init: function () {
            if (typeof window.adscale_events !== "object") {
                window.adscale_events = {};
            }

            if (typeof window.adscale_pup === 'undefined') {
                window.adscale_pup = false;
            }

            if (typeof im_alias === 'undefined') {
                if ((typeof adscale_slot_id === 'undefined' || window.popped_slot === adscale_slot_id)) {
                    return;
                }
            }

            // limit duplicate slots on the page
            var duplicate_slots = window.adscale.duplicate_slots;
            duplicate_slots = duplicate_slots ? duplicate_slots : 1;

            // find the number of times the slot has rendered on the page
            var renderCount = (function () {
                var count = 0;
                if (typeof adscale_slot_id === 'undefined') {
                    return count;
                }
                var responses = window.adscale.response;
                for (var i = 0; i < responses.length; i++) {
                    if (adscale_slot_id === responses[i].sid) {
                        count++;
                    }
                }
                return count;
            })();

            // only request a slot if it has been rendered on the page less than
            // duplicate_slots
            if (renderCount < duplicate_slots) {
                // noinspection JSUnresolvedVariable
                adscaleNS.initialRequest();
            }
            else {
                adscale_slot_id = undefined;
                im_alias = undefined;
            }
        },

        initialRequest: function (sid) {
            if (typeof sid === "undefined") {

                if (typeof im_alias === 'undefined') {
                    return adscaleNS.initialRequest("sid=" + adscale_slot_id);
                }
                else if (typeof im_alias !== 'undefined') {
                    return adscaleNS.initialRequest("ima=" + im_alias);
                }
                else {
                    return;
                }
            }
            adscale_slot_id = undefined;
            im_alias = undefined;

            if ((typeof adscale_wallpaper_preview !== 'undefined') && adscale_wallpaper_preview) {
                if (typeof window.wallpaper_shown === 'undefined' || !window.wallpaper_shown) {
                    adscaleNS.adscale_preview();
                    window.wallpaper_shown = true;
                }
            }
            else {
                var uri = adscaleNS.getProtocol() + (window.adscale_gaa ? window.adscale.gaa : window.adscale.ih);

                if (adscale_pup) {
                    uri += window.location.search;
                }
                else {

                    var newUserFlag = (adscaleNS.newUser ? "1" : "0");

                    uri += "?v=2&" + sid + "&nu=" + newUserFlag + "&t=" + adscaleNS.time() + getAdscaleCustomSlotIdQueryParam();

                    uri = adscaleNS.appendCommonQueryParams(uri, [ adscaleNS.detectBelowFold, adscaleNS.detectRefUrl, adscaleNS.appendWebsiteUrl ]);

                    if (window.adscale_gaa) {
                        uri += "&uuid=" + generateUUID()
                    }

                    if ((typeof adscale_hid !== 'undefined')) {
                        uri += "&hid=" + adscale_hid;
                    }

                    if ((typeof adscale_abp !== 'undefined')) {
                    	uri += "&abp=" + adscale_abp;
                    }

                }

                function findSlotSnippetScript() {
                    var p;

                    if (document.body) {
                        var identifier = sid.substring(sid.indexOf("=") + 1);
                        var head = document.getElementsByTagName("head")[0];

                        if (document.currentScript && document.currentScript.parentNode !== head) {
                            p = document.currentScript;
                        }
                        else {
                            var possibleScripts = [];
                            var els = document.body.getElementsByTagName("script");
                            for (var i = 0; i < els.length; i++) {
                                // inline scripts only
                                if (els[i].innerHTML.indexOf(identifier) > -1) {
                                    possibleScripts.push(els[i]);
                                }
                            }

                            // If more than one then select the shortest.
                            // Hopefully related inline scripts (who may share same identifier) are clumped together.
                            p = possibleScripts.sort(function(a, b){return a.length - b.length;})[0];
                        }
                    }
                    return p;
                }

                function createInvisibleMarker() {
                    var marker = document.createElement("ins");
                    marker.width = 0;
                    marker.height = 0;
                    marker.style.display = 'none';
                    marker.style.width = 0;
                    marker.style.height = 0;
                    marker.style.padding = 0;
                    marker.style.margin = 0;
                    marker.setAttribute("id", "adscale-marker-id-" + sid.substring(sid.indexOf("=") + 1));
                    return marker;
                }

                // https://gist.github.com/jed/982883
                function generateUUID (a) {
                    return a ? (a ^ Math.random() * 16 >> a / 4).toString(16)
                            : ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, generateUUID);
                }

                var imprScriptTag = document.createElement('script');
                imprScriptTag.type = 'text/javascript';
                imprScriptTag.src = uri;

                var slotSnippetScriptElement = findSlotSnippetScript();

                if (slotSnippetScriptElement) {
                    slotSnippetScriptElement.parentNode.insertBefore(createInvisibleMarker(), slotSnippetScriptElement);
                    slotSnippetScriptElement.parentNode.insertBefore(imprScriptTag, slotSnippetScriptElement);
                }

            }
        },

        appendCommonQueryParams: function (uri, additionalFuncs) {
            var ns = adscaleNS;
            var allFuncs = [ns.appendAdvertIdList, ns.detectRenderPopunderAsIab, ns.detectIframe, ns.detectHasLayer, ns.detectSsl, ns.detectX,
                ns.detectPublisherClickUrl].concat(additionalFuncs || []);

            while (allFuncs.length > 0) {
                uri = allFuncs.shift()(uri);
            }
            return uri;
        },

        detectX: function (uri) {
            // noinspection JSUnresolvedVariable
            if (typeof adscaleNS.uid !== 'undefined') {
                // noinspection JSUnresolvedVariable
                uri = uri + "&x=" + adscaleNS.uid;
            }
            return uri;
        },

        debug: function (message) {
            var highFrame;
            try {
                highFrame = adscaleNS.getHighestFrame();
            }
            catch (e) {
                highFrame = window;
            }
            if (highFrame.adscale_debug) {
                if (window.console && window.console.log) {
                    console.log(message);
                }
            }
        },

        detectSsl: function (uri) {
            adscaleNS.debug('detectSsl: window.location.protocol=' + window.location.protocol);
            return uri + '&ssl=' + (window.location.protocol === 'http:' ? '0' : '1');
        },

        getProtocol: function () {
            adscaleNS.debug('getProtocol: window.location.protocol=' + window.location.protocol);
            return window.location.protocol === 'http:' ? 'http://' : 'https://';
        },

        detectPublisherClickUrl : function(uri) {
            // noinspection JSUnresolvedVariable
            if (typeof adscale_publisher_click_url !== 'undefined') {
                // noinspection JSUnresolvedVariable
                uri = uri + "&pctu=" + encodeURIComponent(adscale_publisher_click_url);
            }
            return uri;
        },

        detectBelowFold: function (uri) {

            var scriptElements = document.getElementsByTagName("script");

            if (scriptElements.length === 0) {
                return uri;
            }

            var lastScriptElement = scriptElements[scriptElements.length - 1];

            // We can't get the offsetParent when the script has a display is
            // set to the default ("none").
            // We will temporarily set it to inline.
            lastScriptElement.style.display = "inline";

            var getViewPortHeight = function () {
                var topMostWindow = window;
                // Fallback value for older versions of IE, god forbid it!
                var viewportHeight = topMostWindow.document.getElementsByTagName('body')[0].clientHeight;

                while (topMostWindow !== topMostWindow.parent) {
                    topMostWindow = topMostWindow.parent;
                }

                // The more standards compliant browsers
                // (mozilla/netscape/opera/IE7)
                if (typeof topMostWindow.innerHeight !== 'undefined') {
                    // Try our best to exclude the scrollbars
                    if (topMostWindow.document.compatMode) {
                        if (topMostWindow.document.compatMode === 'CSS1Compat') {
                            // Strict Mode
                            viewportHeight = topMostWindow.document.documentElement.clientHeight;

                        }
                        else {
                            // Quirks Mode
                            viewportHeight = topMostWindow.document.body.clientHeight;
                        }
                    }
                    else {
                        viewportHeight = topMostWindow.innerHeight;
                    }
                }

                // IE6 in standards compliant mode (i.e. with a valid doctype as
                // the first line in the document)

                else if (typeof topMostWindow.document.documentElement !== 'undefined' && typeof topMostWindow.document.documentElement.clientHeight
                        !== 'undefined' && topMostWindow.document.documentElement.clientHeight !== 0) {
                    viewportHeight = topMostWindow.document.documentElement.clientHeight;
                }

                return viewportHeight;
            };

            var getBelowFoldQueryParam = function (element) {
                var calculateYPositionForElement = function (element) {
                    var ypos = 0;
                    if (typeof element !== "undefined") {
                        if (element.offsetParent) {
                            do {
                                ypos += element.offsetTop;
                            } while (element = element.offsetParent);
                        }
                    }
                    return ypos;
                };

                var calculateYPositionForIFrameRelativeToParent = function (iframeWindow) {
                    var ypos = 0;
                    if (iframeWindow !== iframeWindow.parent) {
                        var iframes = iframeWindow.parent.document.getElementsByTagName("iframe");
                        for (var i = 0; i < iframes.length; i++) {
                            if (iframes[i].contentWindow.window === iframeWindow) {
                                var frame = iframes[i];
                                break;
                            }
                        }
                        ypos = calculateYPositionForElement(frame);
                        ypos += calculateYPositionForIFrameRelativeToParent(iframeWindow.parent);
                    }
                    return ypos;
                };

                var ypos = calculateYPositionForElement(element);

                try {
                    ypos += calculateYPositionForIFrameRelativeToParent(window);
                }
                catch (e) {
                    return "";
                }

                try {
                    var vpHeight = getViewPortHeight();
                }
                catch (e) {
                    return "";
                }

                return ypos > vpHeight ? "&pos=below" : "&pos=above";
            };

            var url = uri + getBelowFoldQueryParam(lastScriptElement);

            lastScriptElement.style.display = "none";

            return url;
        },

        refUrl: function () {
            var referringUrl;
            if (window !== window.parent) {
                try {
                    if (window.parent.document.referrer !== "") {
                        referringUrl = window.parent.document.referrer;
                        adscaleNS.debug("detected referer from parent: " + referringUrl);
                    }
                }
                catch (e) {/* ouch */
                    adscaleNS.debug("received exception attempting to get referer: " + e);
                }
            }
            else {
                if (document.referrer !== "") {
                    referringUrl = document.referrer;
                    adscaleNS.debug("detected referer: " + referringUrl);
                }
            }
            return referringUrl;
        },

        detectRefUrl: function (uri) {
            var referringUrl = adscaleNS.refUrl();
            var ref = "";
            if (referringUrl !== undefined) {
                var queryStringIndex = referringUrl.indexOf("?") !== -1 ? referringUrl.indexOf("?") : referringUrl.length;
                var domainAndPath = referringUrl.substring(0, queryStringIndex);
                ref = "&ref=" + encodeURI(domainAndPath);
            }
            return uri + ref;
        },

        appendWebsiteUrl: function (uri) {
            uri += "&ws=" + encodeURIComponent(adscaleNS.getWebsiteUrl());
            return uri;
        },

        getWebsiteUrl: function () {
            var adscalePageUrl;
            var top_friendly = adscaleNS.getHighestFrame();
            if (top_friendly === window.top) {
                adscalePageUrl = window.top.location.href;
                adscaleNS.debug("detected page URL via friendly iframe chain: " + adscalePageUrl);
            }
            else {
                adscalePageUrl = top_friendly.document.referrer;
                if (typeof(adscalePageUrl) === 'undefined' || top_friendly.parent !== window.top) {
                    var origins = window.location.ancestorOrigins;
                    if (typeof(origins) !== 'undefined' && origins.length > 0) {
                        adscalePageUrl = origins[origins.length - 1];
                    }
                }
            }
            adscaleNS.debug("detected page URL: " + adscalePageUrl);
            if (typeof(adscalePageUrl) === 'undefined') {
                adscaleNS.debug("page URL is undefined, returning window.location.href: " + window.location.href);
            }
            return typeof(adscalePageUrl) === 'undefined' ? window.location.href : adscalePageUrl;
        },

        getHighestFrame: function () {
            var frames = get_friendly_frames();
            return frames[frames.length - 1];

            function get_friendly_frames() {
                var windows = [];
                windows.push(window);
                var current = window;
                var count = 0;
                while (current !== window.top && count++ < 100) {
                    try {
                        current = current.parent;
                        var href = current.location.href;   //in most browsers accessing href will throw a security error
                        if (typeof(href) !== 'undefined') { //in iphones there is no error but href is undefined
                            windows.push(current);
                        }
                    }
                    catch (e) {
                        //do nothing - this is how we detect a cross-origin violation
                    }
                }
                return windows;
            }

        },


        detectIframe: function (uri) {
            // determine if we're running <iframe>
            var iframe = "";
            var ignore_detection = window.adscale_events.ignore_iframe_detection === true;

            if (window !== window.parent && !ignore_detection) {
                iframe = "&iFrame";
                try {
                    // determine if we're running <frameset>
                    if (window.parent.document.body.tagName.toLowerCase() !== "body") {
                        iframe = "";
                    }
                }
                catch (e) {
                    // do nothing
                }
            }
            return uri + iframe;
        },

        detectRenderPopunderAsIab: function (uri) {
            var popunderAsIab = "";

            if (window.adscale_events.render_popunder_as_iab === true) {
                popunderAsIab = "&popunderAsIab";
            }
            return uri + popunderAsIab;
        },

        detectHasLayer: function (uri) {
            var responseStack = window.adscale.response;
            if (responseStack.length === 0) {
                return uri;
            }
            for (var x = 0; x < responseStack.length; x++) {
                var type = responseStack[x].type;
                switch (type) {
                    case "layer":
                    case "interstitial":
                    case "layerTag":
                    case "flashLayerTag":
                        return uri + "&hasLayer";
                        break;
                    case "targeted":
                        if (!responseStack[x].charge) {
                            return uri + "&hasLayer";
                        }
                }
            }
            return uri;
        },

        appendAdvertIdList: function (uri) {
            var responseStack = window.adscale.response;
            if (responseStack.length === 0) {
                return uri;
            }
            var advertIdList = [];
            for (var x = 0; x < responseStack.length; x++) {
                if (typeof (responseStack[x].charge) !== "undefined" && responseStack[x].charge === false) {
                    // do nothing
                }
                else {
                    if (responseStack[x].aid) {
                        advertIdList.push(responseStack[x].aid);
                    }
                }
            }
            if (advertIdList.length > 0) {
                uri = uri + "&apaid=" + advertIdList.join(",");
            }
            return uri;
        },

        callIch: function (response) {
            // noinspection JSUnresolvedVariable
            if (typeof (response.ich) !== "undefined") {
                // noinspection JSUnresolvedVariable

                var params = "?sid=" + response.sid + "&aid=" + response.aid + "&ctid=" + response.ctid + "&ck=" + response.ck + "&iid="
                        + response.iid + "&iidx=" + response.iidx + (typeof response.rtb !== 'undefined' ? "&rtb=" + response.rtb : "") + "&uu="
                        + response.uu + "&hid=" + response.hid + "&t=" + adscaleNS.time() + (response.arci ? "&arci=" + response.arci : "")
                        + (response.did ? "&did=" + response.did : "") + (response.tpid ? "&tpid=" + response.tpid : "")
                        + (response.crid ? "&crid=" + response.crid : "") + (response.ae ? "&ae=" + response.ae : "")
                        + (response.sc ? "&sc=" + response.sc : "") + (response.pe ? "&pe=" + response.pe : "")
                        + (response.mp ? "&mp=" + response.mp : "")  + (response.sX ? "&w=" + response.sX : "")
                        + (response.sY ? "&h=" + response.sY : "");

                var loadTrackingImage = new Image();
                var ichHasLoaded = false;
                loadTrackingImage.onload = function () {
                    ichHasLoaded = true;
                };

                // noinspection JSUnresolvedVariable
                loadTrackingImage.src = response.ich + params;

                // wait for ich to load before allowing control back to the browser!
                var x = 0;
                while (!ichHasLoaded && x < 1000) {
                    x++;
                    for (var i = 0; i < 1000; i++) {
                    }
                }

            }
        },

        render: function (response) {
            var win = window;
            win.adscale.response.push(response);

            // In case we're in an ASMI frame, we need to preserve the original for document writes
            var doc = win.document;
            var body = doc.body;

            // ---------------- start private methods ----------------
            var renderAdscale = function (response) {
                var img = "<img src=\"" + response.iUrl + "\" width=\"" + response.sX + "\" height=\"" + response.sY + "\" style=\"border:none;\">";
                var anchor = "<a href=\"" + response.cUrl + "\" target=\"_blank\">" + img + "</a>";
                displayHtmlSnippet(anchor, response);
            };

            var notifyDisplayCompletionHandler = function (response) {
                if (response.dcUrl) {
                    createAndAppendScriptTag(response.dcUrl);
                }
            };

            var notifyPublisherIfBillboard = function (response) {

                var isBillboard = function () {
                    return response.sX === 800 && response.sY === 250;
                };

                var isBillboardCallbackDefined = function () {
                    return typeof win.adscale_events.onBillboard === 'function';
                };

                // notify publisher a billbaord was served
                if (isBillboard() && isBillboardCallbackDefined()) {
                    win.adscale_events.onBillboard();
                }
            };

            var renderPopunderAsIab = function (response) {
                if (adscale_pup) {

                    var element = doc.compatMode === 'CSS1Compat' ? doc.documentElement : body;

                    var outerPopunderDimension = function () {
                        if (typeof win.outerWidth !== 'undefined') {
                            return {
                                width: win.outerWidth, height: win.outerHeight
                            }
                        }
                        else {
                            if (element.clientWidth) {
                                var innerWidth = element.clientWidth;
                                var innerHeight = element.clientHeight;

                                // resize the window's outer width and outer height, resulting in a smaller window
                                win.resizeTo(innerWidth, innerHeight);

                                // get the diff - size of border, toolbar, etc
                                var diffWidth = innerWidth - element.clientWidth;
                                var diffHeight = innerHeight - element.clientHeight;

                                var totalWidth = element.clientWidth + diffWidth;
                                var totalHeight = element.clientHeight + diffHeight;

                                return {
                                    width: totalWidth, height: totalHeight
                                }
                            }
                        }
                    };

                    var innerPopunderDimension = function () {
                        if (typeof win.innerWidth !== 'undefined') {
                            return {
                                width: win.innerWidth, height: win.innerHeight
                            }
                        }
                        else {
                            return {
                                width: element.clientWidth, height: element.clientHeight
                            }
                        }
                    };

                    var resizePopunder = function () {
                        // determining outer dimension must be performed first and once (dependable and mutable for older browsers)
                        var outerDimension = outerPopunderDimension();
                        var innerDimension = innerPopunderDimension();

                        win.resizeTo(response.sX + outerDimension.width - innerDimension.width,
                                response.sY + outerDimension.height - innerDimension.height);
                    };

                    if (typeof window.chrome !== 'undefined') {
                        // resizeTo function and outer/inner fields are buggy in Chrome (observed in version 42.0 at time of writing). Bug
                        // is not apparent when the document is fully loaded.

                        var intervalFunc = function () {
                            if (window.outerHeight > 0) {
                                resizePopunder();
                            }
                            else {
                                win.setTimeout(intervalFunc, 150);
                            }
                        };

                        win.setTimeout(intervalFunc, 150);

                    }
                    else {
                        resizePopunder();
                    }
                }

                if (typeof response.tag !== 'undefined') {
                    displayHtmlSnippet(response.tag, response);
                }
                else if (response.type === "popUnderShow") {
                    displayUrl(createIframeShowUrl(response), response);
                }
                else {
                    displayUrl(response.url, response);
                    notifyDisplayCompletionHandler(response);
                }

                // charge for served 'popunder'
                adscaleNS.callIch(response);

                // notify publisher a popunder was served
                if (typeof win.adscale_events.onPopunder === 'function') {
                    win.adscale_events.onPopunder();
                }
            };

            var renderPopUnder = function (response) {

                var popunder = createPopunderConfig(response);
                var poppedWindow = popunder.openWindowOnLoad();

                var handlePopunder = function (popwin) {
                    if (popwin && !popunder.hasPopped) {
                        popunder.hasPopped = true;
                        popunder.hideWindow(popwin);
                        popunder.charge(response);
                        popunder.removeEventHandlers();
                        notifyDisplayCompletionHandler(response);
                        popunder.notifyPublisher();
                    }
                };

                popunder.eventRequired(poppedWindow, handlePopunder);

            };

            var createPopunderUrl = function (response) {
                if (response.type === "popUnderShow") {
                    // noinspection JSUnresolvedVariable
                    return adscaleNS.detectPublisherClickUrl(response.show + "?v=2" + "&sid=" + response.sid + "&aid=" + response.aid + "&iid="
                            + response.iid + "&iidx=" + response.iidx + "&hid=" + response.hid + "&lb=" + response.lb + "&uu=" + response.uu + "&at="
                            + response.at + "&nx" + "&t=" + adscaleNS.time());
                }
                else if (response.type === "popUnderAttempt") {
                    response.url += "&pup=true";
                    response.url = adscaleNS.appendWebsiteUrl(response.url);
                }
                return response.url;
            };

            /**
             * size of popunder window
             */
            var createPopunderOptions = function (response) {
                var left;
                var top;

                if (body.attachEvent) {
                    // Detected IE
                    left = win.screenLeft;
                    top = win.screenTop;
                }
                else {
                    left = win.screenX;
                    top = win.screenY;
                }

                var width = response.sX;

                var googleAddressBarOffset = 30;
                var height = typeof win.chrome !== 'undefined' ? response.sY + googleAddressBarOffset : response.sY;

                if (adscaleNS.isFirefox()) {
                    // noinspection JSUnresolvedVariable
                    height = (1 / win.devicePixelRatio * response.sY);
                    // noinspection JSUnresolvedVariable
                    width = (1 / win.devicePixelRatio * response.sX);
                }

                return "status=1, resizable=yes, scrollbars=no, width=" + width + ", height= " + height + ", left=" + left + ", top=" + top;
            };

            var createPopunderConfig = function (response) {
                // use onclick as default popunder trigger event if there is no
                // customised
                // configuration
                if (typeof adscale_custom_popunder_config !== "object") {
                    win.adscale_custom_popunder_config = {};
                }
                else {
                    win.adscale_custom_popunder_config = adscale_custom_popunder_config;
                }

                if (typeof win.adscale_custom_popunder_config.events === "undefined") {
                    win.adscale_custom_popunder_config.events = ["click"];
                }

                if (typeof win.adscale_custom_popunder_config.excludes === "undefined") {
                    win.adscale_custom_popunder_config.excludes = [];
                }

                if (typeof win.adscale_custom_popunder_config.chrome_enabled === "undefined") {
                    win.adscale_custom_popunder_config.chrome_enabled = true;
                }

                if (typeof win.adscale_custom_popunder_config.popunder_follow_links === "undefined") {
                    win.adscale_custom_popunder_config.popunder_follow_links = true;
                }

                var chromeButtonEnabled = win.adscale_custom_popunder_config.chrome_button_enabled;
                if (!!window.chrome && typeof chromeButtonEnabled !== "undefined" && !chromeButtonEnabled) {
                    win.adscale_custom_popunder_config.excludes.push("button")
                }

                var popunder = {};
                var events = [];

                var url = createPopunderUrl(response);
                var options = createPopunderOptions(response);

                /**
                 * flag to make sure we open pop up once, as IE9 occasionally won't remove a popup handler
                 */
                hasPopped = false;

                /**
                 * attempt to open window immediately
                 */
                popunder.openWindowOnLoad = function () {
                    return win.open(url, "_blank", options);
                };

                /**
                 * open window on click
                 */
                popunder.openWindowOnEvent = function (e, callback) {
                    if (popunder.isTagExcluded(e)) {
                        return;
                    }
                    callback(win.open(url, "_blank", options));
                };

                /**
                 * add a click handler if the window was not opened (poppedWindow is null) call callback when clicked callback only once, and remove
                 * click handler once clicked if window was opened, call callback immediately
                 */
                popunder.eventRequired = function (poppedWindow, callback) {

                    if (poppedWindow) {
                        callback(poppedWindow);
                    }

                    popunder.addCustomEventHandlers(callback);
                };

                popunder.removeEventHandlers = function () {
                    for (var i = 0; i < events.length; i++) {
                        removeHandler(events[i].element, events[i].name, events[i].handler);
                    }
                };

                /**
                 * add all custom event handlers call callback when window opened only once, and remove all handler once window has opened, call
                 * callback immediately
                 */
                popunder.addCustomEventHandlers = function (callback) {

                    for (var i = 0; i < win.adscale_custom_popunder_config.events.length; i++) {
                        var eventName = popunder.getEventName(win.adscale_custom_popunder_config.events[i]);

                        var popHandler = function (e) {
                            if (!popunder.hasPopped) {
                                popunder.openWindowOnEvent(e, callback);
                            }
                        };

                        var windows = getAllWindows();
                        for (var i = 0; i < windows.length; i++) {
                        	addHandler(windows[i].document, eventName, popHandler);

	                        events[events.length] = {
	                            element:windows[i].document, name: eventName, handler: popHandler
	                        };
                        }
                    }
                };

                popunder.getEventName = function (event) {
                    var eventName = event;
                    if (eventName.substring(0, 2) === "on") {
                        eventName = eventName.substring(2, eventName.length);
                    }
                    return eventName;
                };

                /**
                 * if tag in exclued list
                 */
                popunder.isTagExcluded = function (e) {
                    var tagname = (e.target) ? e.target.localName : e.srcElement.nodeName;
                    for (var i = 0; i < win.adscale_custom_popunder_config.excludes.length; i++) {
                        if (tagname.toLowerCase() === win.adscale_custom_popunder_config.excludes[i]) {
                            return true;
                        }
                    }
                    return false;
                };

                /**
                 * move popped window behind main window with blur and focus
                 */
                popunder.hideWindow = function (poppedWindow) {
                    poppedWindow.blur();
                    win.focus();
                    setTimeout(function () {
                        poppedWindow.blur();
                    }, 200);
                };

                /**
                 * charge popunder and mark that we have opened a popunder once
                 */
                popunder.charge = function (resp) {
                    adscaleNS.callIch(resp);
                    popunder.hasPopped = true;
                };

                /**
                 * call any popunder listener event functions defined by publisher
                 */
                popunder.notifyPublisher = function () {
                    // notify publisher a popunder was served
                    if (typeof win.adscale_events.onPopunder === 'function') {
                        win.adscale_events.onPopunder();
                    }
                };

                var webkitTriple = function (e, callback) {
                    if (popunder.isTagExcluded(e)) {
                        return;
                    }

                    // change blank window to popunder url
                    var newWindow = win.open("about:blank", "_blank", options);
                    newWindow.location = url;

                    popunder.removeEventHandlers();

                    // change focus by adding link to publishers page, click on link that opens/closes a new window, stealing focus
                    var anchor = document.createElement("a");
                    anchor.style.display = "none";
                    anchor.setAttribute("target", "_blank");
                    anchor.setAttribute("href", "data:text/html,<script" + ">window.close();</script" + ">");
                    doc.body.appendChild(anchor);
                    var mouseEvent = doc.createEvent("MouseEvents");
                    mouseEvent.initMouseEvent("click", true, true, win, 0, 0, 0, 0, 0, true, false, false, true, 0, null);
                    anchor.dispatchEvent(mouseEvent);
                    doc.body.removeChild(anchor);

                    callback(newWindow);
                };

                var noop = function () {
                };

                var agent = navigator.userAgent;

                if (agent.appName === 'Netscape' && agent.userAgent && agent.userAgent.indexOf('Trident') !== -1) {
                    setTimeout(function () {
                        win.focus();
                    }, 250);
                    setTimeout(function () {
                        win.focus();
                    }, 350);
                    // I feel like this section of code is expecting to be run in a function that gets passed a window reference.
                    // poppedWindow.blur();
                }

                if (adscaleNS.isInternetExplorer()) {

                    popunder.openWindowOnLoad = function () {
                        return win.open("/open-new-window-on-same-domain-for-popunder?cachebuster=" + new Date().getTime(), "_blank", options);
                    };

                    popunder.openWindowOnEvent = function (e, callback) {
                        if (popunder.isTagExcluded(e)) {
                            return;
                        }
                        doc.focus();
                        callback(win.open("/open-new-window-on-same-domain-for-popunder?cachebuster=" + new Date().getTime(), "_blank", options));
                    };

                    popunder.hideWindow = function (poppedWindow) {
                        poppedWindow.location = url;
                        doc.focus();
                    };

                }

                if (adscaleNS.isFirefox()) {
                    var firefoxVersionMatch = agent.match(/Firefox\/(\d+\.\d+)/);
                    if (firefoxVersionMatch && firefoxVersionMatch.length === 2) {
                        var ffVersion = Number(firefoxVersionMatch[1]);
                        if (ffVersion >= 4) {

                            /**
                             * open a blank window that we can test changing focus with, should not be real popunder url yet
                             */
                            popunder.openWindowOnLoad = function () {
                                return win.open("about:blank", "_blank", options);
                            };

                            /**
                             * open window on click, and open a tab to cause windows to switch focus in FF4+
                             */
                            popunder.openWindowOnEvent = function (e, callback) {
                                if (popunder.isTagExcluded(e)) {
                                    return;
                                }
                                var poppedWindow = win.open(url, "_blank", options);

                                if (!poppedWindow) {
                                    if (window.console && console.warn) {
                                        console.warn("can not open popunder on event : " + e.type);
                                    }
                                    return;
                                }

                                // To make popped window blurrable in our ASMI async context (and this doesn't hurt in sync context either),
                                // let's do some magic that manipulates Fx into playing nice. For some reason, having the popped window open
                                // a child window itself works wonders
                                poppedWindow.open("about:blank").close();
                                poppedWindow.blur();
                                var tab = win.open("about:blank");
                                tab.focus();
                                tab.close();
                                win.focus();
                                callback(poppedWindow);
                            };

                            /**
                             * check if window can lose focus if not close it and use click handler if it can, pass window to handler and change url
                             */
                            popunder.eventRequired = function (poppedWindow, callback) {
                                if (poppedWindow) {
                                    response.popunderHasFocus = true;
                                    addHandler(poppedWindow, 'focus', function () {
                                        response.popunderHasFocus = true;
                                    });
                                    addHandler(poppedWindow, 'blur', function () {
                                        response.popunderHasFocus = false;
                                    });

                                    poppedWindow.blur();

                                    var tab = win.open("about:blank");
                                    setTimeout(function () {
                                        tab.focus();
                                        tab.close();
                                        win.focus();
                                        if (!response.popunderHasFocus) {
                                            poppedWindow.location = url;
                                            callback(poppedWindow);
                                        }
                                        else {
                                            // could not hide window,
                                            // add click handler that
                                            // opens a new window
                                            poppedWindow.close();
                                            popunder.addCustomEventHandlers(callback);
                                        }
                                    }, 0);
                                }
                                else {
                                    popunder.addCustomEventHandlers(callback);
                                }
                            };
                        }
                    }
                }

                if (adscaleNS.isChrome()) {

                    var chromeRegExp = /Chrome\/(\d+)\.\d+/;
                    var chromeVersionMatch = agent.match(chromeRegExp);
                    if (chromeVersionMatch && chromeVersionMatch.length === 2) {
                        var chromeMajorVersion = parseInt(chromeVersionMatch[1]);

                        popunder.openWindowOnLoad = function () {
                            // chrome: only open windows on click
                            return null;
                        };

                        if (chromeMajorVersion >= 43) {
                            if (!win.adscale_custom_popunder_config.chrome_enabled) {
                                popunder.openWindowOnEvent = noop;
                            }
                            else {
                                popunder.openWindowOnEvent = function (e, callback) {
                                	var topWin = getTopWindowIfPossible();
                                	if(topWin){
	                                    if (!topWin.popped && !popunder.isTagExcluded(e)) {
	                                    	topWin.location.href = url;
	                                        var poppedWindow = topWin.open(getHrefIfPossible(e), "_blank");
	                                        poppedWindow.popped = true;
	                                        poppedWindow.popped_slot = adscale_slot_id;
	                                        window.adscale_pup = false;
	                                        callback(poppedWindow);
	                                        e.preventDefault();
	                                    }
                                	}
                                    function getHrefIfPossible(e) {
                                        if (!win.adscale_custom_popunder_config.popunder_follow_links) {
                                            return e.currentTarget.baseURI;
                                        }
                                        var parent = e.srcElement;
                                        while (parent && !parent.href) {
                                            parent = parent.parentElement;
                                        }
                                        if (parent && parent.href) {
                                            return parent.href
                                        }
                                        else {
                                            return e.currentTarget.baseURI;
                                        }
                                    }

                                    function getTopWindowIfPossible() {
                                    	try {
                                    		var test = top.document;
                                    		return top;
                                    	} catch (e) {
                                            return null;
                                        }
                                    }

                                };
                            }
                        }
                        else {
                            win.adscale.mouse = {
                                x: 0, y: 0, t: body
                            };
                            popunder.openWindowOnEvent = function (callback) {
                                var poppedWindow = win.open(url, "_blank", options);
                                callback(poppedWindow);
                                hideFlash();
                                removeHandler(doc, "mousemove", flashMouseTracking);
                            };

                            popunder.eventRequired = function (poppedWindow, callback) {
                                doc.body ? writeflash() : setTimeout(writeflash, 2e3);

                                // create js function for flash to call to open the popunder window popunder.onWindowEvent
                                win.adscale.pu = {
                                    left: function () {
                                        popunder.openWindowOnEvent(callback);
                                        // click mouse location
                                        win.adscale.mouse.t.click();
                                        win.adscale.mouse.t.focus();
                                    },

                                    right: function () {
                                        // show pop under on right mouse click, don't click where mouse exists
                                        popunder.openWindowOnEvent(callback);
                                        win.adscale.mouse.t.focus();
                                    },

                                    // create js function for flash to determine what the cursor should look like eg: hand/ibeam/pointer
                                    cursor: function () {
                                        return findCursor(win.adscale.mouse.t);
                                    }
                                }
                            };

                            function findCursor(t) {
                                switch (t.tagName.toLowerCase()) {
                                    case "input":
                                        switch (t.type.toLowerCase()) {
                                            case "text":
                                                return "ibeam";
                                        }
                                        break;
                                    case "textarea":
                                        return "ibeam";
                                    case "a":
                                    case "link":
                                        return "button";
                                }

                                return t.parentElement ? findCursor(t.parentElement) : "arrow";
                            }

                            function writeflash() {
                                var o = setAttributes(document.createElement("object"), {
                                    type: "application/x-shockwave-flash",
                                    id: "adscale-overlay",
                                    name: "adscale-overlay",
                                    data: "//" + window.adscale.css + "taylor.swf",
                                    style: "position:fixed;visibility:visible;left:0;top:0;width:100%;height:100%;z-index:999999;overflow:hidden;"
                                });

                                o.appendChild(setAttributes(doc.createElement("param"), {
                                    name: "wmode", value: "transparent"
                                }));

                                o.appendChild(setAttributes(doc.createElement("param"), {
                                    name: "menu", value: "false"
                                }));

                                o.appendChild(setAttributes(doc.createElement("param"), {
                                    name: "allowScriptAccess", value: "always"
                                }));

                                doc.body.insertBefore(o, doc.body.firstChild);
                            }

                            function hideFlash() {
                                var e = doc.getElementById("adscale-overlay");
                                e.style.visibility = "hidden";
                            }

                            function showFlash() {
                                var e = doc.getElementById("adscale-overlay");
                                e.style.visibility = "visible";
                            }

                            function flashMouseTracking(e) {
                                win.adscale.mouse.x = e.clientX || e.pageX;
                                win.adscale.mouse.y = e.clientY || e.pageY;

                                hideFlash();
                                win.adscale.mouse.t = t = doc.elementFromPoint(win.adscale.mouse.x, win.adscale.mouse.y);

                                switch (t.tagName.toLowerCase()) {
                                    case "iframe":
                                    case "object":
                                    case "embed":
                                        return;
                                }
                                showFlash();
                            }

                            addHandler(doc, "mousemove", flashMouseTracking);

                            function setAttributes(e, t) {
                                for (var n in t) {
                                    if (t.hasOwnProperty(n)) {
                                        e.setAttribute(n, t[n]);
                                    }
                                }
                                return e
                            }

                        }
                    }

                }

                if (adscaleNS.isSafari()) {
                    var safariVersionRegex = /Version\/(\d+)\.\d+/;
                    var safariVersionMatch = agent.match(safariVersionRegex);
                    if (safariVersionMatch && safariVersionMatch.length === 2 && (parseInt(safariVersionMatch[1]) >= 6)) {
                        popunder.openWindowOnEvent = webkitTriple;
                    }
                }

                if (adscaleNS.isEdge()) {
                    popunder.openWindowOnLoad = noop;
                    popunder.openWindowOnEvent = noop;

                }

                return popunder;
            };

            /**
             * Use this function to load other modules (js files) asynchronously
             *
             * @param moduleName -
             *            name of module to load e.g., "layer"
             * @return the reference to the script - so you can use the reference to remove the script tag from the head, if needed
             */
            var loadModule = function (moduleName) {
                var host = win.adscale.css;
                host = host.charAt(host.length - 1) === '/' ? host : (host + '/');
                var src = adscaleNS.getProtocol() + host + moduleName + '.js';
                var s = doc.createElement('script');
                s.src = src;
                doc.getElementsByTagName('head').item(0).appendChild(s);
                return s;
            };

            var doInterstitial = function (response) {
                win.adscale.exposed = {
                    createDiv: createDiv, addHandler: addHandler, removeHandler: removeHandler, createIframe: createVisibleIframe, iframeSrc: createIframeShowUrl(response)
                };

                response.interstitialScript = loadModule("interstitial");
            };

            var doMobileInterstitial = function (response) {
                win.adscale.exposed = {
                    createDiv: createDiv, addHandler: addHandler, removeHandler: removeHandler, setIframeBodyContent: setIframeBodyContent
                };

                if (win.top === win) {
                    if (!hasAdscaleSlotId(response)) {
                        var marker = findMarkerElement(response);
                        var insTagElement = createInsNodeTag(response);
                        marker.parentNode.insertBefore(insTagElement, marker);
                    }
                    response.interstitialScript = loadModule("rtb-interstitial");
                } else if (is_whole_chain_friendly(win)) {
                    addHandler(win, 'load', function () {
                        walkUpIframes(response);
                        response.interstitialScript = loadModule("rtb-interstitial");
                    });
                }
                else {
                    if (window.console && console.error) {
                        console.error("Stroeer Interstitial adverts are only supported inside friendly iframes");
                    }
                }
            };

            var renderLayer = function () {
                win.adscale.exposed = {
                    createDiv: createDiv, addHandler: addHandler, removeHandler: removeHandler, createTagRequest: function (resp) {
                        return createIframeShowUrl(resp);
                        // We only need request string
                    }, urlLayerCallback: notifyDisplayCompletionHandler
                };
                win.adscale.response[win.adscale.response.length - 1].layerScript = loadModule("layer");
            };

            function is_whole_chain_friendly(win) {
                try {
                    var href = win.top.location.href;
                    return href === href;
                }
                catch (err) {
                    return false;
                }
            }

            function createInsNodeTag(response) {
                var ins = document.createElement("ins");
                ins.style.width = 0;
                ins.style.height = 0;
                ins.style.padding = 0;
                ins.style.margin = 0;
                ins.style.display = 'block';
                ins.setAttribute("id", "adscale-slot-id-" + response.sid);
                return ins;
            }

            function hasAdscaleSlotId(response) {
                return document.getElementById('adscale-slot-id-' + response.sid) !== null
            }

            function inlineStickyRenderer(response) {
                (function () {
                    // resize sensor taken from https://github.com/marcj/css-element-queries MIT license

                    var requestAnimationFrame = window.requestAnimationFrame ||
                            window.mozRequestAnimationFrame ||
                            window.webkitRequestAnimationFrame ||
                            function (fn) {
                                return window.setTimeout(fn, 20);
                            };

                    /**
                     * Iterate over each of the provided element(s).
                     *
                     * @param {HTMLElement|HTMLElement[]} elements
                     * @param {Function}                  callback
                     */
                    function forEachElement(elements, callback){
                        var elementsType = Object.prototype.toString.call(elements);
                        var isCollectionTyped = ('[object Array]' === elementsType
                                || ('[object NodeList]' === elementsType)
                                || ('[object HTMLCollection]' === elementsType)
                                || ('[object Object]' === elementsType)
                                || ('undefined' !== typeof jQuery && elements instanceof jQuery) //jquery
                                || ('undefined' !== typeof Elements && elements instanceof Elements) //mootools
                        );
                        var i = 0, j = elements.length;
                        if (isCollectionTyped) {
                            for (; i < j; i++) {
                                callback(elements[i]);
                            }
                        } else {
                            callback(elements);
                        }
                    }

                    var ResizeSensor = function(element, callback) {

                        function EventQueue() {
                            var q = [];
                            this.add = function(ev) {
                                q.push(ev);
                            };

                            var i, j;
                            this.call = function() {
                                for (i = 0, j = q.length; i < j; i++) {
                                    q[i].call();
                                }
                            };

                            this.remove = function(ev) {
                                var newQueue = [];
                                for(i = 0, j = q.length; i < j; i++) {
                                    if(q[i] !== ev) newQueue.push(q[i]);
                                }
                                q = newQueue;
                            };

                            this.length = function() {
                                return q.length;
                            };
                        }

                        /**
                         *
                         * @param {HTMLElement} element
                         * @param {Function}    resized
                         */
                        function attachResizeEvent(element, resized) {
                            if (!element) return;
                            if (element.resizedAttached) {
                                element.resizedAttached.add(resized);
                                return;
                            }

                            element.resizedAttached = new EventQueue();
                            element.resizedAttached.add(resized);

                            element.resizeSensor = document.createElement('div');
                            element.resizeSensor.className = 'resize-sensor';
                            var style = 'position: absolute; left: 0; top: 0; right: 0; bottom: 0; overflow: hidden; z-index: -1; visibility: hidden;';
                            var styleChild = 'position: absolute; left: 0; top: 0; transition: 0s;';

                            element.resizeSensor.style.cssText = style;
                            element.resizeSensor.innerHTML =
                                    '<div class="resize-sensor-expand" style="' + style + '">' +
                                    '<div style="' + styleChild + '"></div>' +
                                    '</div>' +
                                    '<div class="resize-sensor-shrink" style="' + style + '">' +
                                    '<div style="' + styleChild + ' width: 200%; height: 200%"></div>' +
                                    '</div>';
                            element.appendChild(element.resizeSensor);

                            var expand = element.resizeSensor.childNodes[0];
                            var expandChild = expand.childNodes[0];
                            var shrink = element.resizeSensor.childNodes[1];
                            var dirty, rafId, newWidth, newHeight;
                            var lastWidth = element.offsetWidth;
                            var lastHeight = element.offsetHeight;

                            var reset = function() {
                                expandChild.style.width = '100000px';
                                expandChild.style.height = '100000px';

                                expand.scrollLeft = 100000;
                                expand.scrollTop = 100000;

                                shrink.scrollLeft = 100000;
                                shrink.scrollTop = 100000;
                            };

                            reset();

                            var onResized = function() {
                                rafId = 0;

                                if (!dirty) return;

                                lastWidth = newWidth;
                                lastHeight = newHeight;

                                if (element.resizedAttached) {
                                    element.resizedAttached.call();
                                }
                            };

                            var onScroll = function() {
                                newWidth = element.offsetWidth;
                                newHeight = element.offsetHeight;
                                dirty = newWidth !== lastWidth || newHeight !== lastHeight;

                                if (dirty && !rafId) {
                                    rafId = requestAnimationFrame(onResized);
                                }

                                reset();
                            };

                            var addEvent = function(el, name, cb) {
                                if (el.attachEvent) {
                                    el.attachEvent('on' + name, cb);
                                } else {
                                    el.addEventListener(name, cb);
                                }
                            };

                            addEvent(expand, 'scroll', onScroll);
                            addEvent(shrink, 'scroll', onScroll);
                        }

                        forEachElement(element, function(elem){
                            attachResizeEvent(elem, callback);
                        });

                        this.detach = function(ev) {
                            ResizeSensor.detach(element, ev);
                        };
                    };

                    ResizeSensor.detach = function(element, ev) {
                        forEachElement(element, function(elem){
                            if (!elem) return;
                            if (elem.resizedAttached && typeof ev === "function") {
                                elem.resizedAttached.remove(ev);
                                if(elem.resizedAttached.length()) return;
                            }
                            if (elem.resizeSensor) {
                                if (elem.contains(elem.resizeSensor)) {
                                    elem.removeChild(elem.resizeSensor);
                                }
                                delete elem.resizeSensor;
                                delete elem.resizedAttached;
                            }
                        });
                    };


                    var win = window;
                    var top_win = win.top;
                    var top_doc = top_win.document;
                    var top_doc_element = top_win.document.documentElement;
                    var top_body = top_doc.body;

                    var Sticky = {};

                    function pageHeight() {
                        return Math.max(top_body.scrollHeight,
                                top_body.offsetHeight,
                                top_doc_element.clientHeight,
                                top_doc_element.scrollHeight,
                                top_doc_element.offsetHeight);
                    }

                    Sticky.build = function () {
                        adscaleNS.debug("begin building sticky ad");
                        loadAdvert();

                        function loadAdvert() {
                            Sticky.advert = response;
                            Sticky.is_dynamic = Sticky.advert.type === 'rtbDynamicSitebar';
                            Sticky.margins = translateMargins();
                            drawAdvert();
                        }

                        function value(t) {
                            return function () {
                                return t;
                            }
                        }

                        function translateMargins() {
                            var configuredMargins = adscaleNS.stickyMargin;
                            if (typeof  configuredMargins === "undefined") {
                                configuredMargins = {}
                            }
                            var marginObject = {};
                            marginObject.top = topPaddingFunc(configuredMargins);
                            marginObject.height = heightFunc(configuredMargins, marginObject.top);
                            marginObject.extraHandlers = extraHandlers(configuredMargins);
                            return marginObject;
                        }

                        function extraHandlers(configuredMargins) {
                            var handlers = [];
                            if(typeof configuredMargins.dynamicHeaderId === "string"){
                                handlers.push(function (callback) {
                                    var el = top_doc.getElementById(configuredMargins.dynamicHeaderId);
                                    if(el !== null){
                                        new ResizeSensor(el, callback)
                                    }
                                });
                            }
                            if(typeof configuredMargins.dynamicFooterId === "string"){
                                handlers.push(function (callback) {
                                    var el = top_doc.getElementById(configuredMargins.dynamicFooterId);
                                    if(el !== null){
                                        new ResizeSensor(el, callback)
                                    }
                                });
                            }
                            return handlers;
                        }

                        function topPaddingFunc(margins) {
                            if (typeof margins.headerHeight === "number") {
                                return amountOfHeaderVisible(margins.headerHeight);
                            } else if (typeof margins.fixedTopMargin === "number") {
                                return value(margins.fixedTopMargin);
                            } else if (typeof margins.dynamicHeaderId === "string") {
                                var el = top_doc.getElementById(margins.dynamicHeaderId);
                                if(el !== null){
                                    return function(){return Math.max(0,el.getBoundingClientRect().bottom)};
                                }
                            }
                            return value(0);
                        }

                        function heightFunc(margins, topFunc) {
                            if (!Sticky.is_dynamic) {
                                return value(Sticky.advert.sY + "px");
                            }
                            if (typeof margins.footerHeight === "number") {
                                return relativeHeight(margins.footerHeight, topFunc);
                            } else if (typeof margins.fixedBottomMargin === "number") {
                                return fixedHeight(margins.fixedBottomMargin, topFunc);
                            } else if (typeof margins.dynamicFooterId === "string") {
                                var el = top_doc.getElementById(margins.dynamicFooterId);
                                if(el !== null){
                                    return function(){return Math.min(top_win.innerHeight, el.getBoundingClientRect().top) - topFunc() + "px"};
                                }
                            }
                            return value("100%");
                        }

                        function scrollFromTop() {
                            return top_win.pageYOffset || top_doc.documentElement.scrollTop || top_doc.body.scrollTop || 0;
                        }

                        function onAnchorFound() {
                            createAdvert();
                            handleRotation();
                        }

                        function drawAdvert() {
                            configuration();
                        }

                        function configuration() {
                            var id = 'adscale-slot-id-' + Sticky.advert.sid;
                            var byId = top_doc.getElementById(id);
                            if (typeof byId !== "undefined") {
                                Sticky.anchor = byId;
                                adscaleNS.debug("anchor found with id "+ id + " (required to render a sticky)");
                                onAnchorFound()
                            } else {
                                adscaleNS.debug("anchor not found with id "+ id + " (sticky unable to render!)");
                            }
                        }

                        function top(rect) {
                            return (Sticky.is_dynamic ? 0 : Math.max(Sticky.margins.top(), rect.top)) + "px";
                        }

                        function width(rect) {
                            return (Sticky.is_dynamic ? top_doc_element.clientWidth - rect.right : Sticky.advert.sX) + "px";
                        }

                        function relativeHeight(bottom, topFunction) {
                            return function () {
                                return (top_win.innerHeight - topFunction() - amountOfFooterVisible(bottom)) + 'px';
                            }
                        }

                        function fixedHeight(bottom, topFunction) {
                            return function () {
                                return (top_win.innerHeight - topFunction() - bottom) + 'px';
                            }
                        }

                        function amountOfFooterVisible(bottom) {
                            var documentHeight = pageHeight();
                            var bottomOfScrolledPage = scrollFromTop() + top_win.innerHeight;
                            var isFooterVisible = bottomOfScrolledPage > documentHeight - bottom;
                            return isFooterVisible ? bottom - (documentHeight - (bottomOfScrolledPage)) : 0;
                        }

                        function amountOfHeaderVisible(topValue) {
                            return function () {
                                return scrollFromTop() < topValue ? topValue - scrollFromTop() : 0;
                            }
                        }

                        function moveAdvert() {
                            var rect = Sticky.anchor.getBoundingClientRect();
                            var iframe = Sticky.iframe;
                            iframe.style.top = top(rect);
                            iframe.style.left = rect.right + "px";
                            iframe.style.width = width(rect);
                            iframe.style.paddingTop = Sticky.is_dynamic ? Sticky.margins.top() + 'px' : '0px';
                            iframe.style.height = Sticky.margins.height();
                        }

                        function createAdvert() {
                            adscaleNS.debug("rendering advert");
                            adscaleNS.debug("adding iframe to anchor using dom manipulation");
                            var iframe = createBaseIframe();

                            adscaleNS.debug("writing ad tag into iframe");
                            setIframeBodyContent(iframe, Sticky.advert.tag);
                            moveAdvert();
                            adscaleNS.debug("finished rendering advert");
                        }

                        function createBaseIframe() {
                            var iframe = top_doc.createElement('iframe');
                            Sticky.iframe = iframe;
                            Sticky.anchor.appendChild(iframe);
                            iframe.style.position = 'fixed';
                            iframe.style.margin = "0";
                            iframe.style.padding = "0";
                            iframe.style.overflow = "hidden";
                            iframe.style.border = "none";
                            if(Sticky.advert.sX === 728 && Sticky.advert.sY === 90){
                                iframe.style.zIndex = 2999999;
                            } else {
                                iframe.style.zIndex = 4999;
                            }
                            iframe.setAttribute('frameBorder', '0');
                            iframe.setAttribute('marginWidth', '0');
                            iframe.setAttribute('marginHeight', '0');
                            iframe.setAttribute('scrolling', 'no');
                            iframe.setAttribute('allowTransparency', 'true');
                            return iframe;
                        }

                        function handleRotation() {
                            adscaleNS.debug("registering event handlers for screen resize/scroll");
                            addHandler(top_win, 'resize', moveAdvert);
                            addHandler(top_win, 'orientationchange', moveAdvert);
                            addHandler(top_win, 'scroll', moveAdvert);
                            addHandler(top_win, 'touchmove', moveAdvert);

                            var handlers = Sticky.margins.extraHandlers;
                            for (var i = 0; i < handlers.length; i++) {
                                handlers[i](moveAdvert);
                            }
                        }

                        adscaleNS.debug("finished building sticky");
                    };
                    Sticky.build()
                }());
            }

            /* shared function used by sticky and floor */
            var renderFixedAd = function (response, rendererFn, name) {
                adscaleNS.debug("Begin rendering " + name + (window.JSON && JSON.stringify ? ": " + JSON.stringify(response) : ""));
                if (win.top === win.self) {
                    adscaleNS.debug("rendering " + name + " in top level window, no frames");
                    if (!hasAdscaleSlotId(response)) {
                        var marker = findMarkerElement(response);
                        var insTagElement = createInsNodeTag(response);
                        marker.parentNode.insertBefore(insTagElement, marker);
                    }
                    rendererFn(response);
                }
                else if (is_whole_chain_friendly(win)) {
                    adscaleNS.debug("rendering " + name + " in friendly iframe (access to top window)");
                    walkUpIframes(response);
                    rendererFn(response);
                }
                else {
                    // Just append to upper-most accessible iframe without the floating, follow as you scroll, etc behaviour
                    adscaleNS.debug("rendering " + name + " in safe frame.");
                    var highestIframeWindow = adscaleNS.getHighestFrame();
                    var advertIframe = createVisibleIframe(response.sX, response.sY);
                    highestIframeWindow.document.body.appendChild(advertIframe);
                    setIframeBodyContent(advertIframe, response.tag);
                }
                adscaleNS.debug("End rendering " + name);
            };

            var renderLayerUrl = function (response) {
                renderLayer();
                // call ich to set cpx cookie
                adscaleNS.callIch(response);
            };

            // Convenience function to create a div. Optional argument is the
            // class name to give div
            var createDiv = function () {
                var div = doc.createElement("div");
                if (arguments[0]) {
                    div.className = arguments[0];
                }
                return div;
            };


            var createIframeShowUrl = function(response) {
                var aid;
                if (response.type === "text") {
                    aid = response.aid.join(",");
                }
                else {
                    aid = response.aid;
                }

                return adscaleNS.detectPublisherClickUrl(response.show + "?v=2" + "&sid=" + response.sid + "&aid=" + aid + "&iid="
                        + response.iid + "&iidx=" + response.iidx + "&hid=" + response.hid + "&uu=" + response.uu + "&lb=" + response.lb
                        + adscaleNS.detectSsl("") + "&nu=" + response.nu + "&at=" + response.at + "&t=" + adscaleNS.time());
            };


            var addHandler = function (el, evtName, handler) {
                if (el.addEventListener) {
                    el.addEventListener(evtName, handler, false);
                }
                else {
                    if (el.attachEvent) {
                        el.attachEvent('on' + evtName, handler);
                    }
                }
            };

            var removeHandler = function (el, evtName, handler) {
                if (el.removeEventListener) {
                    el.removeEventListener(evtName, handler, false);
                }
                else {
                    if (el.detachEvent) {
                        el.detachEvent('on' + evtName, handler);
                    }
                }
            };


            function walkUpIframes(response) {
                var highest = win;
                var last_iframe = highest;
                while (highest.frameElement) {
                    last_iframe = highest;
                    highest = highest.parent;
                }
                var ins = createInsNodeTag(response);
                var frameEl = last_iframe.frameElement;
                frameEl.parentNode.insertBefore(ins, frameEl);
            }

            function getAllWindows() {
            	//Detect if can access parent window
            	function canAccessNextIframe (w) {
            	    try {
            	    	if (w.frameElement) {
            	    		  return true;
            	    	} else {
            	    		  return false; //This is top window
            	    	}
            	    } catch (e) {
            	        return false; //Cross Browser Error
            	    }
            	}

            	//getting all parent windows
            	var accessibleWindows = [];
            	var w = win;
            	while (canAccessNextIframe(w)) {
            		accessibleWindows.push(w);
            		w = w.parent;
            	}
            	accessibleWindows.push(w);

            	return accessibleWindows;
            }

            function inlineFloorRenderer() {
                adscaleNS.debug("rendering floor ad");

                function setUpContainerContent(container) {
                    var taggo = createTagContainer(container);
                    var crosso = createCloseButton(container);
                    taggo.appendChild(crosso);
                    taggo.onmouseover = function () {
                        container.style.height = (400 * getResizeRatio(container)) + 'px';
                        taggo.style.height = 400 + 'px';
                    };
                }

                function createFloorContainer() {
                    var container = doc.createElement("div");
                    container.style.position = 'fixed';
                    container.style.textAlign = 'center';
                    container.style.backgroundColor = 'rgba(255,255,255,0.75)';
                    container.style.bottom = '0px';
                    container.style.left = '0px';
                    container.style.right = '0px';
                    container.style.zIndex = 2147483646;
                    container.style.marginBottom = '0px';
                    container.style.overflowY = 'hidden';
                    return container;
                }

                function isDeviceTooSmall(container) {
                    return container.scrollWidth < response.sX;
                }

                function getResizeRatio(container) {
                    return isDeviceTooSmall(container) ? (doc.body.scrollWidth / response.sX) : 1;
                }

                function createTagContainer(container) {
                    var d = doc.createElement("div");

                    if (isDeviceTooSmall(container)) {
                        d.setAttribute('style', "" //
                            + "-webkit-transform: scale(" + getResizeRatio(container) + ");" + "-moz-transition: scale(" + getResizeRatio(container) + ");"
                            + "-ms-transform: scale(" + getResizeRatio(container) + ");" + "-o-transform: scale(" + getResizeRatio(container) + ");" + "transform: scale("
                            + getResizeRatio(container) + ");" + "-webkit-transform-origin: top left;" + "-moz-transition-origin: top left;"
                            + "-ms-transform-origin: top left;" + "-o-transform-origin: top left;" + "transform-origin: top left;");
                    }

                    d.style.width = response.sX + 'px';
                    d.style.border = 0;
                    d.style.overflow = 'hidden';
                    d.style.margin = 0;
                    d.style.height = '200px';
                    d.style.padding = 0;
                    d.style.display = "inline-block";
                    d.style.position = "relative";
                    var taggo = doc.createElement("iframe");
                    taggo.scrolling = 'no';
                    d.appendChild(taggo);
                    container.appendChild(d);
                    taggo.style.width = response.sX + 'px';
                    taggo.style.border = 0;
                    taggo.style.overflow = 'hidden';
                    taggo.style.margin = 0;
                    taggo.style.height = '100%';
                    taggo.style.padding = 0;
                    setIframeBodyContent(taggo, response.data);
                    var docco = taggo.contentWindow.document;
                    docco.body.style.border = 0;
                    docco.body.style.margin = 0;
                    docco.body.style.padding = 0;
                    return d;
                }

                function createCloseButton(container) {
                    var crosso = doc.createElement("div");
                    crosso.style.position = "absolute";
                    crosso.style.top = "0";
                    crosso.style.right = "0";
                    crosso.style.backgroundImage = "url('//" + win.adscale.css + "/interstitial_close.svg')";
                    crosso.style.width = "2.5em";
                    crosso.style.height = "2.5em";
                    crosso.style.minWidth = "16px";
                    crosso.style.minHeight = "16px";
                    crosso.style.cursor = "pointer";
                    crosso.style.backgroundRepeat = "no-repeat";
                    crosso.style.zIndex = 2147483647;

                    crosso.onmouseover = function (e) {
                        e.stopPropagation();
                    };
                    crosso.onclick = function () {
                        container.parentNode.removeChild(container);
                    };
                    return crosso;
                }

                (function() {
                    // Closure to keep these local variables private to avoid confusion.

                    var anchor = win.top.document.getElementById('adscale-slot-id-' + response.sid);
                    if (!anchor) {
                        adscaleNS.debug("could not find adscale-slot-id for floor ad");
                        return;
                    }

                    var container = createFloorContainer();
                    anchor.appendChild(container);

                    setUpContainerContent(container);

                    if (isDeviceTooSmall(container)) {
                        container.style.overflowX = 'hidden';
                    }
                    else {
                        container.style.overflowX = 'auto';
                    }
                    container.style.height = (200 * getResizeRatio(container)) + 'px';
                }());

                adscaleNS.debug("finished rendering floor ad");
            }

            function createVisibleIframe(width, height) {
                var iframe = document.createElement('iframe');
                iframe.setAttribute('height',  height);
                iframe.setAttribute('width', width);
                iframe.setAttribute('hspace', '0');
                iframe.setAttribute('vspace', '0');
                iframe.setAttribute('marginWidth', '0');
                iframe.setAttribute('marginHeight', '0');
                iframe.setAttribute('frameBorder', '0');
                iframe.setAttribute('scrolling', 'no');


                iframe.style.width = width + 'px';
                iframe.style.height = height + 'px';
                iframe.style.border = '0';
                iframe.style.margin = '0';
                iframe.style.padding = '0';

                iframe.id = "adscale_" + adscaleNS.time();

                return iframe;
            }

            function insertSnippetInHiddenFriendlyIframe(htmlSnippet, response) {
                var adjustedResponse = {sX: 0, sY: 0, sid: response.sid};
                var iframe = replaceMarkerWithBlankIframe(adjustedResponse);
                if (iframe) {
                    iframe.style.display = 'none';
                    setIframeBodyContent(iframe, htmlSnippet);
                }
            }

            function displayTandemHtmlSnippet(response) {
                // Need to preserve the marker for second advert of tandem.
                var iframe = addBlankIframeNextToMarker(response);
                if (iframe) {
                    setIframeBodyContent(iframe, response.data);
                }
                return iframe;
            }

            function displayHtmlSnippet(htmlSnippet, response) {
                var iframe = replaceMarkerWithBlankIframe(response);
                if (iframe) {
                    setIframeBodyContent(iframe, htmlSnippet);
                }
                return iframe;
            }

            function setIframeBodyContent(iframe, htmlBody) {
                var content = "<html><head></head><body style='margin:0;padding:0;border:0'>" + htmlBody + "<\/body><\/html>";

                var retrieveIframeDoc = function() {
                    return iframe.contentDocument || (iframe.contentWindow && iframe.contentWindow.document);
                };

                var writeContent = function(iframeDoc) {
                    iframeDoc.write(content);
                    iframeDoc.close();
                };

                var iframeDoc = retrieveIframeDoc();

                if (iframeDoc) {
                    writeContent(iframeDoc);
                }
                else {
                    iframe.onload = function() {
                        writeContent(retrieveIframeDoc());
                    }
                }
            }

            function findMarkerElement(response) {
                var prefix = 'adscale-marker-id-';
                var element;
                if (response.ima) {
                    element = document.getElementById(prefix + response.ima);
                }
                if (!element) {
                    element = document.getElementById(prefix + response.sid);
                }
                return element;
            }

            function removeMarkerIfExists(response) {
                if  (response.type !== "tandem") {
                    var marker = findMarkerElement(response);
                    if (marker) {
                        marker.parentNode.removeChild(marker);
                    }
                }
            }

            function replaceMarkerWithBlankIframe(response) {
                var marker = findMarkerElement(response);
                if (marker) {
                    var iframe = createVisibleIframe(response.sX, response.sY);
                    marker.parentNode.replaceChild(iframe, marker);
                    return iframe;
                }
                return null;
            }

            function addBlankIframeNextToMarker(response) {
                var marker = findMarkerElement(response);
                if (marker) {
                    var iframe = createVisibleIframe(response.sX, response.sY);
                    marker.parentNode.insertBefore(iframe, marker);
                    return iframe;
                }
                return null;
            }

            function displayUrl(url, response) {
                var iframe = replaceMarkerWithBlankIframe(response);
                if (iframe) {
                    iframe.src = url;
                }
            }

            function insertAdditionalTags(response) {
                // Insert any 'additional tags' that piggyback on the response (such as post nuggad targeting)
                if (response.st && adscaleNS.tagsWritten === undefined) {
                    // noinspection JSUnresolvedVariable
                    var tags = '';
                    for (var i = 0; i < response.st.length; i++) {
                        // noinspection JSUnresolvedVariable
                        tags += response.st[i];
                    }

                    if (tags) {
                        var iframe = createVisibleIframe(0, 0);
                        iframe.style.display = 'none';

                        var marker = findMarkerElement(response);
                        if (marker) {
                            marker.parentNode.insertBefore(iframe, marker);
                            setIframeBodyContent(iframe, tags);
                            adscaleNS.tagsWritten = true;
                        }

                    }
                }
            }

            function canResizeIframe(iframe, previousSettings) {
                function isElementAttachedToDOM(element) {
                    if (doc.compareDocumentPosition) {
                        var DOCUMENT_POSITION_CONTAINED_BY = (window.Node && Node.DOCUMENT_POSITION_CONTAINED_BY) || 16;
                        return !!(doc.compareDocumentPosition(iframe) & DOCUMENT_POSITION_CONTAINED_BY);
                    }

                    while (element.parentNode) {
                        element = element.parentNode;
                    }
                    return element === doc;
                }

                var sizeUnmodified = previousSettings.widthAttribute === iframe.getAttribute('width') &&
                    previousSettings.heightAttribute === iframe.getAttribute('height') &&
                    previousSettings.widthStyle === iframe.style.width &&
                    previousSettings.heightStyle === iframe.style.height;

                return sizeUnmodified && isElementAttachedToDOM(iframe);
            }

            function calculateDimension(doc) {
                if (doc.body) {
                    // These are inline elements but honor width and height like container/block elements
                    var allowedInlineElements = ["IFRAME", "IMG", "OBJECT"];
                    var width = 0;
                    var height = 0;
                    var els = doc.body.getElementsByTagName('*');
                    for (var i = 0; i < els.length; i++) {
                        var element = els[i];
                        var display = window.getComputedStyle(element).display;
                        if (display === 'block' || (allowedInlineElements.indexOf(element.tagName) > -1 && display !== 'none')) {
                            var rec = element.getBoundingClientRect();

                            // New images (un-cached), without width/height style set, and without container div have dimension 0x0
                            // in Microsoft Edge v14-v16 no matter when or how many times you ask. In this case, use natural(Width/Height) properties.

                            var elementWidth = element.offsetWidth || element.naturalWidth || 0;
                            var elementHeight = element.offsetHeight || element.naturalHeight || 0;

                            width = Math.max(width, elementWidth + rec.left);
                            height = Math.max(height, elementHeight + rec.top);
                        }
                    }
                    return {width: width, height: height};
                }
                return null;
            }

            function adjustIframeSize(iframe, response) {
                var previousSettings = {
                    widthAttribute: "" + response.sX,
                    heightAttribute: "" + response.sY,
                    widthStyle: response.sX + "px",
                    heightStyle: response.sY + "px"
                };

                function resize() {
                    if (canResizeIframe(iframe, previousSettings)) {
                        var calculatedDimension = calculateDimension(iframe.contentWindow.document);

                        if (calculatedDimension) {
                            var width = calculatedDimension.width;
                            var height = calculatedDimension.height;

                            iframe.style.height = height + 'px';
                            iframe.style.width = width + 'px';

                            iframe.setAttribute('width', width);
                            iframe.setAttribute('height', height);

                            // Do not make invisible (i.e., style.display = 'none') when result is 0x0 otherwise will break Edge and Firefox.

                            previousSettings.widthAttribute = iframe.getAttribute('width');
                            previousSettings.heightAttribute = iframe.getAttribute('height');
                            previousSettings.widthStyle = iframe.style.width;
                            previousSettings.heightStyle = iframe.style.height;
                        }

                        setTimeout(resize, 1000);
                    }
                }

                resize();
            }

            function renderBackfill(response) {
                if (adscale_pup) {
                    win.close();
                }
                else if (isValidBackfill(response.data)) {
                    var htmlSnippet = replaceBackfillTokens(response.data);
                    var iframe = displayHtmlSnippet(htmlSnippet, response);
                    if (iframe) {
                        adjustIframeSize(iframe, response);
                    }
                }
            }

            // ---------------- end private methods ----------------

            if (response.type) {

                if (adscaleNS.newUser === undefined) {
                    // Only set once per page
                    // noinspection JSUnresolvedVariable
                    adscaleNS.newUser = response.nu === 1;
                }

                insertAdditionalTags(response);

                if (typeof response.ax !== "undefined" && response.ax) {
                    adscaleNS.renderAdexSnippet()
                }

                function replaceBackfillTokens(data) {
                    function replaceTokenWithWindowProperty(text, prop, pattern) {
                        return text.replace(pattern, win[prop]);
                    }

                    data = replaceTokenWithWindowProperty(data, customSlotIdPropertyName, /__adscale_custom_slot_id__/gi);
                    data = replaceTokenWithWindowProperty(data, customBackfillCallbackIdPropertyName, /__adscale_custom_cb_id__/gi);
                    return data;
                }

                function isValidBackfill(responseData) {
                    function validateToken(property, token) {
                        if (responseData.indexOf(token) !== -1) {
                            var prop = win[property];
                            return prop && prop.match(/^[a-zA-Z0-9ÄäÜüÖöß/_\.\-]{1,255}$/);
                        }
                        else {
                            return true;
                        }
                    }

                    return validateToken(customSlotIdPropertyName, customSlotIdToken) && validateToken(customBackfillCallbackIdPropertyName,
                                    customBackfillCallbackIdToken);
                }

                // noinspection JSUnresolvedVariable
                if (response.sj) {
                    try {
                        // noinspection JSUnresolvedVariable
                        eval(response.sj);
                    }
                    catch (err) {
                        // We can't presume console will always be available.
                        if (window.console && console.error) {
                            console.error(err);
                        }

                    }
                }

                if (response.format && (response.sid || response.ima)) {

                    var slotId = response.ima ? response.ima : response.sid;

                    if (!window.stroeer_ad_config) {
                        window.stroeer_ad_config = {};
                    }

                    if (!window.stroeer_ad_config[slotId]) {
                        window.stroeer_ad_config[slotId] = {
                            format: (response.format ? response.format : "unknown"),
                            height: (response.sY ? parseInt(response.sY) : 0),
                            width: (response.sX ? parseInt(response.sX) : 0)
                        }
                    }
                }

                if (response.format && adscale_events.beforeAdvertRender) {
                    adscale_events.beforeAdvertRender(response.ima ? response.ima : response.sid);
                }

                switch (response.type) {
                    case "backfill":
                        renderBackfill(response);
                        break;

                    case "adscaleAd":
                        renderAdscale(response);
                        break;
                    case "popUnderShow":
                    case "popUnder":
                        if (win.adscale_events.render_popunder_as_iab === true || adscale_pup) {
                            renderPopunderAsIab(response);
                        }
                        else {
                            renderPopUnder(response);
                        }
                        break;
                    case "popUnderAttempt":
                        renderPopUnder(response);
                        break;
                    case "interstitial":
                        doInterstitial(response);
                        break;
                    case "rtbInterstitial":
                    case "rtbLayer":
                    case "mobileInterstitial":
                        doMobileInterstitial(response);
                        break;

                    case "rtbSticky":
                    case "rtbDynamicSitebar":
                        renderFixedAd(response, inlineStickyRenderer, "sticky");
                        break;

                    case "layer":
                        renderLayerUrl(response);
                        break;

                    case "layerTag":
                        renderLayer();
                        break;

                    case "banner":
                    case "tag":
                        displayUrl(createIframeShowUrl(response), response);
                        notifyPublisherIfBillboard(response);
                        break;

                    case "text":
                        displayUrl(createIframeShowUrl(response), response);
                        break;

                    case "popUnderThirdParty":
                    case "expandable":
                    case "flashLayerTag":
                        // These formats, if any, must be aware that they are inserted inside a hidden friendly iframe.
                        // Can access main page, make iframe visible, change dimension of iframe, insert next to iframe, etc
                        insertSnippetInHiddenFriendlyIframe(response.data, response);
                        break;
                    case "tandem":
                        displayTandemHtmlSnippet(response);
                        break;
                    case "inlineTag":
                        if (typeof response.format === "string" && response.format.indexOf('floor') !== -1) {
                            renderFixedAd(response, inlineFloorRenderer, "floor ad");
                        }
                        else {
                            displayHtmlSnippet(response.data, response);
                        }
                        break;
                    case "blank":
                        if (adscale_pup) {
                            win.close();
                        }
                        return;
                    default:
                        adscaleNS.debug('Response type not supported: ' + response.type);
                }

                removeMarkerIfExists(response);

                if (response.format && adscale_events.afterAdvertRender) {
                    adscale_events.afterAdvertRender(response.ima ? response.ima : response.sid);
                }
            }
        },

        isChrome: function () {
            return typeof window.chrome !== 'undefined' && !adscaleNS.isEdge();
        },

        isInternetExplorer: function () {
            var userAgent = window.navigator.userAgent;
            var old_ie = userAgent.indexOf('MSIE ');
            var new_ie = userAgent.indexOf('Trident/');

            if ((old_ie > -1) || (new_ie > -1)) {
                return true;
            }
        },

        isEdge: function () {
            return (navigator.userAgent.indexOf('Edge/') !== -1);
        },

        isFirefox: function () {
            return (navigator.userAgent.indexOf('Firefox') !== -1);
        },

        isSafari: function () {
            return (navigator.userAgent.indexOf('Safari') !== -1 && !adscaleNS.isEdge());
        },

        time: function () {
            var time = window.adscale.time ? window.adscale.time : (new Date()).getTime();
            window.adscale.time = null;
            return time;
        }
    };
}
adscaleNS.init();