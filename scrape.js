var request = require('request'),
	jsdom = require('jsdom'),
	opts = {
		uri: 'http://www.summitpost.org/sierra-peaks-section-sps/404706'
	},
	JQUERY_URL = 'http://code.jquery.com/jquery-1.7.2.min.js',
	PARSE_MAP = [
		function (td) {
			var name = $.trim($(td).text()),
				a = $('a', td),
				mountaineer = false,
				emblem = false,
				url;

			if (a) {
				url = a.attr('href');
			}

			if (name.substr(-1) === '*') {
				mountaineer = true;
			}

			if (name.substr(-2) === '**') {
				mountaineer = false;
				emblem = true
			}


			return {
				name: name.replace(/\*/g, ''),
				sp_url: url,
				mountaineer: mountaineer,
				emblem: emblem
			}
		},
		function (td) {
			return {
				elevation: +$(td).text().replace(',', '')
			}
		},
		function (td) {
			return {
				lat: $.trim($(td).text())
			}
		},
		function (td) {
			return {
				lon: $.trim($(td).text())
			}
		},
		function (td) {
			return {
				region: $.trim($(td).text())
			}
		}
	];

request(opts, function (err, resp, body) {
	if (err) {
		console.log('Error fetching page ' + opts.uri, err);
		exit(1);
	}

	jsdom.env({
		html: body,
		scripts: [JQUERY_URL]
	}, function (err, window) {
		$ = window.jQuery;
		var trs = $('.list table tr:not(:first-child)'),
			data;

			data = $.map(trs, function (tr, i) {
				var tds = $('td', tr),
					peak = {};

				$.each(tds, function (j, td) {
					var val = PARSE_MAP[j](td);
					$.extend(peak, val);
				});

				return peak;
			});

			console.log(data);
	});
});
