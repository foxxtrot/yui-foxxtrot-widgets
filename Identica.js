/**
 * Foxxtrot.Widgets.Identica
 * Copyright 2008 Jeff "foxxtrot" Craig
 *
 * This widget collects a given number of entries from a user's timeline
 * (or the public timeline) and builds an unordered list of them to
 * place within a given container.
 *
 * This module is licensed under the BSD License
 *
 * This module requires the Yahoo User Interface (YUI) Library, version 3.0.0pr1 minimum
 **/

if (typeof Foxxtrot === 'undefined' || !Foxxtrot) { Foxxtrot = {}; }
Foxxtrot.Widgets = Foxxtrot.Widgets || {};
Foxxtrot.Widgets.Identica = function () {
    var _target, _svc;
    // Requires YUI 3.0
    /**
     * _timePhrase is a private function which calculates what to print for the time
     * of the post. Taken from Laconica 0.6.1 lib/util.php
     * @method _timePhrase
     * @argument date
     **/
    var _timePhrase = function(date) {
        var delta = (new Date().getTime() - new Date(date).getTime())/1000;
        if (delta < 60) {
            return 'a few seconds ago';
        } else if (delta < 92) {
            return 'about a minute ago';
        } else if (delta < 3300) {
            return 'about ' + Math.round(delta/60) + ' minutes ago';
        } else if (delta < 5400) {
            return 'about an hour ago';
        } else if (delta < 79200) {
            return 'about ' + Math.round(delta/3600) + ' hours ago';
        } else if (delta < 133200) {
            return 'about a day ago';
        } else if (delta < 2073600) {
            return 'about ' + Math.round(delta/86400) + ' days ago';
        } else if (delta < 3974400) {
            return 'about a month ago';
        } else if (delta < 28512000) {
            return 'about ' + Math.round(delta/259200) + ' months ago';
        } else if (delta < 41472000) {
            return 'about a year ago';
        } else {
            return 'a very long time ago';
        }
    };
    
    var _userLink = function(msg) {
    	var le = /@(\w+)/g, i;
    	var r = msg.match(le), s;
        
        for (i = 0 ; r && i < r.length ; i += 1) {
            s = r[i].substr(1);
            s = '@<a href="' + _svc + s + '">' + s + '</a>';
            msg = msg.replace(r[i],s);
        }
        return msg;
    };
    
    var _uriLink = function(msg) {
        var le = /([A-Za-z]+\:\/\/[^"\s\<\>]*[^.,;'">\:\s\<\>\)\]\!])/g;
        var r = msg.match(le), s, i;
        for (i = 0 ; r && i < r.length ; i += 1) {
            s = '<a href="' + r[i] + '">' + r[i] + '</a>';
            msg = msg.replace(r[i],s);
        }
        return msg;
    };

    return {
				/**
				 * updatesCallback is a public function which handles the JSONP callback
				 * It is only meant to be called from the JSONP script returned by the getUpdates method
				 * This function can be overriden from custom behaviour, if necessary.
				 *
				 * @method updatesCallback
				 * @argument dents JavaScript Object returned by the Laconi.ca service
				 **/
        updatesCallback: function(dents) {
            var i, text = "";
            for (i = 0 ; i < dents.length ; i += 1) {
                text += "<li><span>" + _userLink(_uriLink(dents[i].text)) + "</span> ";
                text += '<a href="' + _svc + 'notice/' + dents[i].id + '">';
                text += _timePhrase(dents[i].created_at) + "</a></li>";
            }
            _target.set('innerHTML', text);
        },
				/**
				 * getUpdates is a public function which initiates the JSONP request
				 * to the given service (defaults to identi.ca) for the given user.
				 * If no user is given, it pulls the public timeline
				 *
				 * There are several configuration options available for the optional second argument
				 * <ul>
				 *  <li>service_url: The URL of the service to request data from. Defaults to http://identi.ca/</li>
				 *  <li>user: The Username of the user who's public timeline you want. If this is omitted, the public timeline for the given service will be queried</li>
				 *  <li>count: The number of timeline updates to query. Defaults to 5</li>
				 * </ul>
				 * @method getUpdates
				 * @argument el The string ID or HTMLElement referencing the container to build the list inside
				 * @argument o (optional) The configuration object
				 **/
        getUpdates: function (el, o) {
            var URL;
            o = o || {};
            YUI().use('node', function (Y) { _target = Y.get(el) });
            _svc = o.service_url || "http://identi.ca/";
            URL = _svc + "api/statuses/";
            if (o.user) {
                URL += "user_timeline/" + o.user + ".json?";
            } else {
                URL += "public_timeline.json?";
            }

            o.count = o.count || 5;
            URL += "count=" + o.count + "&";

            URL += "callback=Foxxtrot.Widgets.Identica.updatesCallback";
            YUI().Get.script(URL);
        }
    };
}();