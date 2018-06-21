/**
 *
 * @author MATTDAMON
 *
 */
(function(window, undefined) {
	define('taiping/widget/userList', [ "handlebars/handlebars",
			"text!taiping/widget/templates/userList.html" ], function(undefined,
			template) {
		console.log(template);
		/*************************************************************************************************/
		/**************<define UserList object>*******************************************************/
		/*************************************************************************************************/
		var UserList = function(opts) {
			return new UserList.prototype.constructor(opts);
		};
		UserList.prototype = {
			selector : undefined,
			lang : undefined,
			constructor : function(opts) {
				$.extend(this, opts);
				console.log(opts);
			},
			initializing : function() {
				console.log("initializing");
			},
			show : function() {
				this.initializing();
				var ct = Handlebars.compile(template);
				var compiled = ct(this);
				$("#" + this.selector).append(compiled);
			}
		};

		UserList.prototype.constructor.prototype = UserList.prototype;
		/*************************************************************************************************/
		/**************<define UserList object/>******************************************************/
		/*************************************************************************************************/

		return UserList;
	});
})(window);