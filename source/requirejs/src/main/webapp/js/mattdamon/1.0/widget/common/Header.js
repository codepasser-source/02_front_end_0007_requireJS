//define Header object
var Header = function(opts) {
	return new Header.prototype.init(opts);
};

// first parameter:module name
// second parameter: dynamic include multiple js
// third parameter:module name
define(
		"mattdamon/widget/common/Header",
		[ "text!./templates/Header.html", ],
		function(template) {

			var HeaderDropMenu = function(opts) {
				return HeaderDropMenu.prototype.init(opts);
			};

			HeaderDropMenu.prototype = {
				label : undefined,
				items : [],
				itemCallback : undefined,
				init : function(opts) {
					$.extend(this, opts);
				},
				_generateHtml : function() {
					var html = "";
					if (this.items != undefined && this.items.length > 0) {
						html = html
								+ "<a class='header-dropdown dropdown-toggle accent-color' href='javascript:void(0);'>"
								+ this.label + "<b class='caret'></b></a>";

						html = html
								+ "<ul id='header-menu-list' class='dropdown-menu'>";
						for ( var index = 0; index < this.items.length; index++) {
							html = html + "<li><a menuid='"
									+ this.items[index].id
									+ "' href='javascript:void(0);'>"
									+ this.items[index].label + "</a></li>";
						}
						html = html + "</ul>";
					}
					return html;
				},

				show : function(selector) {
					if (this.items != undefined && this.items.length > 0) {
						$("#" + selector).append(this._generateHtml());
						// dropdown open
						$("#header-menu").on("mouseover", function(event) {
							$("#header-menu").attr("class", "dropdown open");
						});
						// dropdown close
						$("#header-menu-list").on("mouseout", function(event) {
							$("#header-menu").attr("class", "dropdown");
						});

						// menu item click callback fn.
						if (this.itemCallback != undefined) {
							$("ul.dropdown-menu li > a").on(
									"click",
									$.proxy(
											function(e) {
												var menuid = $(e.target).attr(
														"menuid");
												this.itemCallback(menuid);
											}, this));
						}

					}
				}
			};

			HeaderDropMenu.prototype.init.prototype = HeaderDropMenu.prototype;

			Header.prototype = {
				constructor : Header,
				templateString : template,
				labelSet : undefined,
				menuLabel : undefined,
				menuItems : [],
				meunItemOnClick : undefined,
				showSettings : true,
				backHandler : undefined,
				userInfo : undefined,

				init : function(opts) {
					$.extend(this, opts);
					console.log("header init");
					console.log(this.labelSet);
					for ( var key in this.labelSet) {
						console.log(key + ":" + this.labelSet[key]);
						this.templateString = this.templateString.replace(
								new RegExp("\\$\\{" + key + "\\}", 'g'),
								this.labelSet[key]);
					}
				},

				// 可在这里添加实例方法
				show : function(selector) {
					console.log("header show");

					$("#" + selector).append(this.templateString);

					// settings
					if (this.showSettings) {
						$("#settings").attr("style", "display:block;");
						// open settings
						$("#settings").on("click", function() {
							$("#charms").attr("style", "display:block;");
						});
						// close settings
						$("#close-charms").on("click", function() {
							$("#charms").attr("style", "display:none;");
						});
						$("#win-theme-select").on("change", function(event) {
							mattdamon.theme(event.target.value);
						});
					}
					// back hander
					if (this.backHandler != undefined) {
						$("#logoutButton").attr("style", "display:block;");
						$("#logoutButton").on("click", this.backHandler);
					}
					// user info
					if (this.userInfo != undefined) {
						if (this.userInfo.surname != undefined) {
							$("#userInfo-surname").text(this.userInfo.surname);
						}
						if (this.userInfo.name != undefined) {
							$("#userInfo-name").text(this.userInfo.name);
						}
					}

					// init menu
					if (this.menuItems != undefined
							&& this.menuItems.length > 0) {
						var headerDropMenu = new HeaderDropMenu({
							label : this.menuLabel == undefined ? "menu"
									: this.menuLabel,
							items : this.menuItems,
							itemCallback : this.meunItemOnClick
						});
						headerDropMenu.show("header-menu");
					}
				}
			};

			Header.prototype.init.prototype = Header.prototype;

			return Header;
		});
