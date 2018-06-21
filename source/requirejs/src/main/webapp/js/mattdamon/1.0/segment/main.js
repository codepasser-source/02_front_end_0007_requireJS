console.log("main init");
require([ "jQuery/jquery", "i18n!mattdamon/locale/nls/Language",
		"mattdamon/widget/common/Header" ], function($, language) {

	var header = new Header({
		labelSet : language.Header.labelSet,
		showSettings : true,
		backHandler : function() {
			console.log("logout");
		},
		userInfo : {
			surname : "Cheng",
			name : "Yangyang"
		},
		menuLabel : language.Header.labelSet.menu_item_counter,
		menuItems : [ {
			id : "menuItem1",
			label : language.Header.labelSet.menu_item_dinning
		}, {
			id : "menuItem2",
			label : language.Header.labelSet.menu_item_dinning
		} ],
		meunItemOnClick : function(itemId) {
			console.log(itemId);
		}
	});
	header.show("header-widget");
});
