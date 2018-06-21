(function(window, undefined) {
	var version = {
		jQuery : "1.9.1",
		requirejs : "2.1.6",
		mattdamon : "1.0"
	};
	mattdamon = function() {
		return new mattdamon.prototype.init();
	};

	mattdamon.prototype = {
		constructor : mattdamon,

		init : function() {
		}

	// 可在这里添加实例方法
	};

	mattdamon.prototype.init.prototype = mattdamon.prototype;

	mattdamon.extend = mattdamon.prototype.extend = function() {
		var src, copy, name, options, target = arguments[0] || {}, i = 1, length = arguments.length;

		// extend jQuery itself if only one argument is passed
		if (length === i) {
			target = this;
			--i;
		}

		for (; i < length; i++) {
			// Only deal with non-null/undefined values
			if ((options = arguments[i]) != null) {
				// Extend the base object
				for (name in options) {
					src = target[name];
					copy = options[name];

					// Prevent never-ending loop
					if (target === copy) {
						continue;
					}

					// Don't bring in undefined values
					if (copy !== undefined) {
						target[name] = copy;
					}
				}
			}
		}

		// Return the modified object
		return target;
	};

	// 静态方法
	mattdamon.lib = function(libId, callback) {
		importJavaScript(mattdamonResourcePath(libId), callback);
	};

	mattdamon.extend(mattdamon.lib, {

		jQuery : function(libId, callback) {
			importJavaScript(jQueryResourcePath(libId), callback);
		},

		requirejs : function(libId, callback) {
			importJavaScript(requirejsResourcePath(libId), callback);
		}
	});

	mattdamon.css = function(path) {
		importCSSStyle(path);
	};

	mattdamon.theme = function(themeId) {
		toggleTheme(themeId);
	};

	// 内部方法，不对外公开
	function jQueryResourcePath(resourceId) {
		return "js/jquery/" + version.jQuery + resourceId;
	}

	function requirejsResourcePath(resourceId) {
		return "js/requirejs/" + version.requirejs + resourceId;
	}

	function mattdamonResourcePath(resourceId) {
		return "js/mattdamon/" + version.mattdamon + resourceId;
	}

	function importJavaScript(path, callback) {
		var script, head = document.head || document.documentElement;
		script = document.createElement("script");
		script.type = "text/javascript";
		// script.async = true;
		script.charset = "UTF-8";
		script.src = path;

		// Attach handlers for all browsers
		script.onload = script.onreadystatechange = function(_) {

			if (!script.readyState || /loaded|complete/.test(script.readyState)) {

				// Handle memory leak in IE
				script.onload = script.onreadystatechange = null;

				// Remove the script
				if (script.parentNode) {
					script.parentNode.removeChild(script);
				}

				// Dereference the script
				script = null;

				// Callback
				if (callback) {
					callback.call();
				}
			}
		};

		// Circumvent IE6 bugs with base elements (#2709 and #4378) by
		// prepending
		// Use native DOM manipulation to avoid our domManip AJAX trickery
		head.insertBefore(script, head.firstChild);
	}

	// 引入样式
	function importCSSStyle(path, id) {
		var style = document.createElement("link");
		if (id != undefined) {
			style.id = id;
		}
		style.type = "text/css";
		style.rel = "stylesheet";
		style.href = path;
		document.getElementsByTagName("HEAD")[0].appendChild(style);
	}

	// 切换主题
	function toggleTheme(themeId) {
		if (document.getElementById("theme-link") != undefined) {
			document.getElementById("theme-link").href = "css/mattdamon/"
					+ themeId + "/main.css", "theme-link";
		} else {
			importCSSStyle("css/mattdamon/" + themeId + "/main.css",
					"theme-link");
		}
	}

	window.mattdamon = mattdamon;
	window.version = version;
	// 当页面引入该JS之后，可在下面做一些初始化的操作，
	// 但是需要注意的是将影响到所有引用该文件的页面。

})(window);