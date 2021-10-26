function parseURL(url) {
	var a =  document.createElement('a');
	a.href = url;
	return {
		source: url,
		protocol: a.protocol.replace(':',''),
		host: a.hostname,
		port: a.port,
		query: a.search,
		params: (function(){
			var ret = {},
				seg = a.search.replace(/^\?/,'').split('&'),
				len = seg.length, i = 0, s;
			for (;i<len;i++) {
				if (!seg[i]) { continue; }
				s = seg[i].split('=');
				ret[s[0]] = s[1];
			}
			return ret;
		})(),
		file: (a.pathname.match(/\/([^\/?#]+)$/i) || [,''])[1],
		hash: a.hash.replace('#',''),
		path: a.pathname.replace(/^([^\/])/,'/$1'),
		relative: (a.href.match(/tps?:\/\/[^\/]+(.+)/) || [,''])[1],
		segments: a.pathname.replace(/^\//,'').split('/')
	};
}

function initNav(jsonp)
{
	var $ul = $('#quebecor-nav ul.nav');

	if ($ul.length)
	{
		_.each(jsonp, function(section){
			$ul.append('<li><a href="' + section.url + '">' + section.nom + '</a></li>');
		});
	}
}

function jdm(jsonp)
{
	initNav(jsonp);
}

function jdq(jsonp)
{
	initNav(jsonp);
}

$(document).ready(function($){

	var tokens = parseURL(document.location.href),
		host = tokens.host,
		url;

	if (host == 'www1.journaldequebec.com')
		url = 'http://infojdem.com/lib/nav/jdq.json?callback=?';
	else
		url = 'http://infojdem.com/lib/nav/jdm.json?callback=?';

	$('#quebecor-nav').length && $.getJSON(url);
});
