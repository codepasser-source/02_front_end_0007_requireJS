/**
 * @author MattDamon ChengYangyang.NEUSOFT
 * 2013-08-12
 */
(function(window, undefined) {
	define(
			'taiping/widget/jwy/insureForm',
			[ "taiping/common/combobox", "taiping/common/calendar", "taiping/common/validate" ],
			function(undefined) {

				/*************************************************************************************************/
				/**************<define Organization object>*******************************************************/
				/*************************************************************************************************/
				var Organization = function(opts) {
					return new Organization.prototype.constructor(opts);
				};

				Organization.prototype = {
					organData : undefined,
					areaCombo : '#insu_organ_block div#areaCombo',
					organizationCombo : '#insu_organ_block div#organizationCombo',

					constructor : function(opts) {
						$.extend(this, opts);
					},
					// 可在这里添加实例方法
					show : function() {
						this.initializing();
					},
					initializing : function() {
						//初始化区域
						$(this.areaCombo).combobox({});
						//初始化机构
						$(this.organizationCombo).combobox({});
						console.log("Organization>>>initializing");
						console.log(this.organData);
						//初始化显示 或 回显数据
						if (this.organData == undefined) {
							this.organData = new Object();
							this.organData.valid = false;
							this.linkageAreaData(this.areaCombo, 0);
						} else {
							//回显数据
							this.echoAreaData();
						}
					},

					linkageAreaData : function(linkage, parentId) {
						var _self = this;
						$.ajax({
							url : taiping.getBasePath() + '/restService/master/area/' + parentId,
							success : function(_data) {
								$(linkage).combobox({
									valueField : 'areaId',
									textField : 'areaName',
									editable : false,
									data : _data,
									onSelect : function(data) {
										if (linkage == _self.areaCombo) {
											_self.organData.area = data;
											//联动菜单
											_self.linkageAreaData(_self.organizationCombo, data.areaId);
										} else if (linkage == _self.organizationCombo) {
											_self.organData.organ = data;
										}
									}
								});
							}
						});
					},

					echoAreaData : function() {
						var _self = this;
						$.ajax({
							url : taiping.getBasePath() + '/restService/master/area/' + 0,
							success : function(_data) {
								$(_self.areaCombo).combobox({
									valueField : 'areaId',
									textField : 'areaName',
									editable : false,
									data : _data,
									onSelect : function(data) {
										console.log("echoAreaData>>>area select");
										_self.organData.area = data;
										_self.linkageAreaData(_self.organizationCombo, data.areaId);
									}
								});
								//设置回显数据
								$(_self.areaCombo).combobox('setValue', _self.organData.area.areaId);
							}
						});

						$.ajax({
							url : taiping.getBasePath() + '/restService/master/area/' + _self.organData.area.areaId,
							success : function(_data) {
								$(_self.organizationCombo).combobox({
									valueField : 'areaId',
									textField : 'areaName',
									editable : false,
									data : _data,
									onSelect : function(data) {
										console.log("echoAreaData>>>orgn select");
										_self.organData.organ = data;
									}
								});
								//设置回显数据
								$(_self.organizationCombo).combobox('setValue', _self.organData.organ.areaId);
							}
						});
					},
					validate : function() {
						console.log("Organization>>>validate");

						//校验性别 easyUI combobox
						var result = tpValidator.easyCombo(this.areaCombo);
						console.log("validate>>>area:" + result);
						if (result == false) {
							this.organData.valid = false;
							return false;
						}
						//校验性别 easyUI combobox
						result = tpValidator.easyCombo(this.organizationCombo);
						console.log("validate>>>organ:" + result);
						if (result == false) {
							this.organData.valid = false;
							return false;
						}

						console.log("Organization>>>validate return true");
						this.organData.valid = true;
						return true;
					},

					getData : function() {
						//执行校验方法
						this.validate();
						console.log("Organization>>>getData");
						console.log(this.organData);
						return this.organData;
					}
				};
				Organization.prototype.constructor.prototype = Organization.prototype;
				/*************************************************************************************************/
				/**************<define Organization object/>******************************************************/
				/*************************************************************************************************/

				/*************************************************************************************************/
				/**************<define PolicyHolder object>*******************************************************/
				/*************************************************************************************************/
				var PolicyHolder = function(opts) {
					return new PolicyHolder.prototype.constructor(opts);
				};

				PolicyHolder.prototype = {
					policyHolderData : undefined,
					dateformatter : 'yyyy-MM-dd',
					/*************element****************/
					insuPolicyholderSavedBlock : '#insu_policyholder_saved_block',
					insuPolicyholderBlock : '#insu_policyholder_block',
					insuPolicyholderForm : '#insu_policyholder_form',

					/**<姓名、证件类型、证件号、性别、生日、职业类型、手机号码、email>**/
					userNameText : '#insu_policyholder_block input#userNameText',
					idTypeCombo : '#insu_policyholder_block div#idTypeCombo',
					idNoText : '#insu_policyholder_block input#idNoText',
					genderCombo : '#insu_policyholder_block div#genderCombo',
					birthdayPicker : '#insu_policyholder_block input#birthdayPicker',
					occupTypeCombo : '#insu_policyholder_block div#occupTypeCombo',
					occupNameCombo : '#insu_policyholder_block div#occupNameCombo',
					occupWorkCombo : '#insu_policyholder_block div#occupWorkCombo',
					mobileText : '#insu_policyholder_block input#mobileText',
					emailText : '#insu_policyholder_block input#emailText',
					/**<姓名、证件类型、证件号、性别、生日、职业类型、手机号码、email/>**/

					/**<saved 姓名、证件号、性别、生日、职业类型、手机号码、email>**/
					saved_userName : '#insu_policyholder_saved_block div#userName',
					saved_idNo : '#insu_policyholder_saved_block div#idNo',
					saved_gender : '#insu_policyholder_saved_block div#gender',
					saved_birthday : '#insu_policyholder_saved_block div#birthday',
					saved_occup_type : '#insu_policyholder_saved_block div#occupType',
					saved_occup_name : '#insu_policyholder_saved_block div#occupName',
					saved_occup_work : '#insu_policyholder_saved_block div#occupWork',
					saved_mobile : '#insu_policyholder_saved_block div#mobile',
					saved_email : '#insu_policyholder_saved_block div#email',
					/**<saved 姓名、证件号、性别、生日、职业类型、手机号码、email/>**/

					saveButton : '#insu_policyholder_block a#policyholder_save_bt',
					modifyButton : '#insu_policyholder_saved_block a#policyholder_modify_bt',
					/************************************/
					constructor : function(opts) {
						$.extend(this, opts);
					},
					// 可在这里添加实例方法
					show : function() {
						this.initializing();
					},
					//私有方法
					initializing : function() {
						this.initFormElement();

						console.log("PolicyHolder>>>initializing");
						console.log(this.policyHolderData);
						//回显信息或初始化显示
						if (this.policyHolderData == undefined) {
							//创建一个数据
							this.policyHolderData = new Object();
							this.policyHolderData.saved = false;
							this.policyHolderData.valid = false;
							//投保人初始化显示 form
							this.showForm();
						} else {
							//回显数据
							//投保人初始化显示saved info
							this.showSavedInfo();
						}

					},
					initFormElement : function() {

						var _self = this;
						$(this.saveButton).on('click', function() {
							_self.onSaveHander();
						});

						$(this.modifyButton).on('click', function() {
							_self.onModifyHander();
						});

						$(this.idNoText).on('blur', function() {
							//如果输入身份证号正确时，自动带入生日、性别
							tpIDCardLinkages.linkage(this, _self.idTypeCombo, _self.genderCombo, _self.birthdayPicker);
						});

						$(this.idTypeCombo).combobox({
							valueField : 'value',
							textField : 'text',
							editable : false,
							panelHeight : 'auto',
							url : taiping.getBasePath() + '/restService/master/dictionary/cx_id_type',
							method : 'get',
							onSelect : function(data) {
								if (data.value == 1) {
									if ($(_self.idNoText).val() != "") {
										//如果证件类型选择身份证，需要校验身份证号码有效性
										tpValidator.identityCard(_self.idNoText);
									}
								} else {
									//如果之前进行过身份证校验error,需要先清除
									tpValidator.clearErrorTip(_self.idNoText);
								}
							}
						});

						$(this.genderCombo).combobox({
							valueField : 'value',
							textField : 'text',
							editable : false,
							panelHeight : 'auto',
							url : taiping.getBasePath() + '/restService/master/dictionary/gender',
							method : 'get',
							onSelect : function(data) {
							}
						});

						var currentDate = new Date();
						var dateEnd = currentDate.getFullYear() + "-" + (currentDate.getUTCMonth() + 1) + "-"
								+ (currentDate.getDate());
						$(this.birthdayPicker).calendar({
							timeend : dateEnd
						});

						//初始化职业类型
						$(this.occupTypeCombo).combobox({
							valueField : 'id',
							textField : 'name',
							editable : false
						});

						$(this.occupNameCombo).combobox({
							valueField : 'id',
							textField : 'name',
							editable : false
						});

						$(this.occupWorkCombo).combobox({
							valueField : 'id',
							textField : 'name',
							editable : false
						});

						//加载联动菜单
						this.linkageOccupData(this.occupTypeCombo, 0);
						//注册registValidate
						this.registValidate();

					},

					linkageOccupData : function(linkage, parentId) {
						var _self = this;
						var url = taiping.getBasePath() + '/restService/master/occup/';
						if (linkage == this.occupTypeCombo) {
							url = url + 'type/' + parentId;
						} else if (linkage == this.occupNameCombo) {
							url = url + 'name/' + parentId;
						} else {
							url = url + 'work/' + parentId;
						}
						$.ajax({
							url : url,
							success : function(_data) {
								$(linkage).combobox({
									valueField : 'id',
									textField : 'name',
									editable : false,
									data : _data,
									onSelect : function(data) {
										if (linkage == _self.occupTypeCombo) {
											_self.linkageOccupData(_self.occupNameCombo, data.id);
										}
										if (linkage == _self.occupNameCombo) {
											_self.linkageOccupData(_self.occupWorkCombo, data.id);
										}
									}
								});
							}
						});
					},

					registValidate : function() {
						$(this.insuPolicyholderForm).validate({
							rules : {
								//姓名
								userName : {
									required : true,
									username : true
								},
								idNo : {
									required : true
								},
								mobile : {
									required : true,
									mobile : true
								},
								email : {
									required : true,
									email : true
								}
							},
							errorPlacement : function(error, element) {
								$(element).parent().next().append(error);
							}
						});
					},

					//表单saveData方法中使用的校验方法
					validate : function() {

						console.log("PolicyHolder>>>validate");
						//校验姓名
						var result = tpValidator.username(this.userNameText, true);
						console.log("validate>>>username:" + result);
						if (result == false) {
							this.policyHolderData.valid = false;
							return false;
						}
						//校验证件类型 easyUI combobox
						result = tpValidator.easyCombo(this.idTypeCombo);
						console.log("validate>>>idType:" + result);
						if (result == false) {
							this.policyHolderData.valid = false;
							return false;
						}
						//校验证件号码
						result = tpValidator.required(this.idNoText);
						console.log("validate>>>idNo:" + result);
						if (result == false) {
							this.policyHolderData.valid = false;
							return false;
						}
						//身份证号码校验
						var idType = $(this.idTypeCombo).combobox('getValue');
						if (idType == 1) {
							//如果证件类型选择身份证，需要校验身份证号码有效性
							result = tpValidator.identityCard(this.idNoText);
							console.log("validate>>>身份证:" + result);
							if (result == false) {
								this.policyHolderData.valid = false;
								return false;
							}
						}

						//校验性别 easyUI combobox
						result = tpValidator.easyCombo(this.genderCombo);
						console.log("validate>>>gender:" + result);
						if (result == false) {
							this.policyHolderData.valid = false;
							return false;
						}

						//生日校验
						result = tpValidator.birthday(this.birthdayPicker, true, 18);
						console.log("validate>>>birthday:" + result);
						if (result == false) {
							this.policyHolderData.valid = false;
							return false;
						}

						//校验职业类型 easyUI combobox
						result = tpValidator.easyCombo(this.occupTypeCombo);
						console.log("validate>>>occupType:" + result);
						if (result == false) {
							this.policyHolderData.valid = false;
							return false;
						}
						result = tpValidator.easyCombo(this.occupNameCombo);
						console.log("validate>>>occupName:" + result);
						if (result == false) {
							this.policyHolderData.valid = false;
							return false;
						}
						result = tpValidator.easyCombo(this.occupWorkCombo);
						console.log("validate>>>occupWork:" + result);
						if (result == false) {
							this.policyHolderData.valid = false;
							return false;
						}

						//手机号码校验
						result = tpValidator.mobile(this.mobileText, true);
						console.log("validate>>>mobile:" + result);
						if (result == false) {
							this.policyHolderData.valid = false;
							return false;
						}

						//email号码校验
						result = tpValidator.email(this.emailText, true);
						console.log("validate>>>email:" + result);
						if (result == false) {
							this.policyHolderData.valid = false;
							return false;
						}

						console.log("PolicyHolder>>>validate return true");
						this.policyHolderData.valid = true;
						return true;
					},

					onSaveHander : function() {
						if (this.validate()) {
							//保存当前数据
							this.saveData();
							//显示数据
							this.showSavedInfo();
						}
					},

					onModifyHander : function() {
						//更改保存状态
						this.policyHolderData.saved = false;
						this.showForm();
					},

					getData : function() {
						console.log("PolicyHolder>>>getData");
						console.log(this.policyHolderData);
						return this.policyHolderData;
					},

					saveData : function() {
						/**证件类型 性别 职业类型**/
						/**姓名、证件号、生日、手机号码、email**/
						var _self = this;
						_self.policyHolderData.userName = $(_self.userNameText).val();
						_self.policyHolderData.idNo = $(_self.idNoText).val();
						_self.policyHolderData.birthday = $(this.birthdayPicker).val();
						_self.policyHolderData.mobile = $(_self.mobileText).val();
						_self.policyHolderData.email = $(_self.emailText).val();

						var idTypeValue = $(_self.idTypeCombo).combobox('getValue');
						$($(_self.idTypeCombo).combobox('getData')).each(function() {
							if (this.value == idTypeValue) {
								_self.policyHolderData.idType = this;
							}
						});
						var genderValue = $(_self.genderCombo).combobox('getValue');
						$($(_self.genderCombo).combobox('getData')).each(function() {
							if (this.value == genderValue) {
								_self.policyHolderData.gender = this;
							}
						});

						var occupTypeValue = $(_self.occupTypeCombo).combobox('getValue');
						$($(_self.occupTypeCombo).combobox('getData')).each(function() {
							if (this.id == occupTypeValue) {
								_self.policyHolderData.occupType = this;
							}
						});

						var occupNameValue = $(_self.occupNameCombo).combobox('getValue');
						$($(_self.occupNameCombo).combobox('getData')).each(function() {
							if (this.id == occupNameValue) {
								_self.policyHolderData.occupName = this;
							}
						});

						var occupWorkValue = $(_self.occupWorkCombo).combobox('getValue');
						$($(_self.occupWorkCombo).combobox('getData')).each(function() {
							if (this.id == occupWorkValue) {
								_self.policyHolderData.occupWork = this;
							}
						});

						//更改保存状态
						this.policyHolderData.saved = true;
						console.log("PolicyHolder>>>saveData");
						console.log(this.policyHolderData);
					},

					showSavedInfo : function() {
						//更新界面
						$(this.saved_userName).text(this.policyHolderData.userName);
						$(this.saved_idNo).text(this.policyHolderData.idNo);
						$(this.saved_gender).text(this.policyHolderData.gender.text);
						$(this.saved_birthday).text(this.policyHolderData.birthday);
						$(this.saved_occup_type).text(this.policyHolderData.occupType.name);
						$(this.saved_occup_name).text(this.policyHolderData.occupName.name);
						$(this.saved_occup_work).text(this.policyHolderData.occupWork.name);
						$(this.saved_mobile).text(this.policyHolderData.mobile);
						$(this.saved_email).text(this.policyHolderData.email);
						//显示form，隐藏保存信息
						$(this.insuPolicyholderBlock).hide();
						$(this.insuPolicyholderSavedBlock).show();
					},

					showForm : function() {

						if (this.policyHolderData.userName) {
							$(this.userNameText).val(this.policyHolderData.userName);
						} else {
							$(this.userNameText).val('');
						}

						if (this.policyHolderData.gender) {
							$(this.genderCombo).combobox('setValue', this.policyHolderData.gender.value);
						} else {
							$(this.genderCombo).combobox('setValue', '');
						}

						if (this.policyHolderData.idType) {
							$(this.idTypeCombo).combobox('setValue', this.policyHolderData.idType.value);
						} else {
							$(this.idTypeCombo).combobox('setValue', '');
						}

						if (this.policyHolderData.idNo) {
							$(this.idNoText).val(this.policyHolderData.idNo);
						} else {
							$(this.idNoText).val('');
						}

						if (this.policyHolderData.birthday) {
							$(this.birthdayPicker).val(this.policyHolderData.birthday);
						} else {
							$(this.birthdayPicker).val('');
						}

						//职业类型三级联动菜单回显数据
						var _self = this;
						if (this.policyHolderData.occupType) {
							$.ajax({
								url : taiping.getBasePath() + '/restService/master/occup/type/0',
								success : function(_data) {
									$(_self.occupTypeCombo).combobox({
										data : _data
									});
									$(_self.occupTypeCombo).combobox('setValue', _self.policyHolderData.occupType.id);
								}
							});
						} else {
							$(this.occupTypeCombo).combobox('setValue', '');
						}
						if (this.policyHolderData.occupName) {
							//二级菜单数据重新加载
							$.ajax({
								url : taiping.getBasePath() + '/restService/master/occup/name/'
										+ _self.policyHolderData.occupType.id,
								success : function(_data) {
									$(_self.occupNameCombo).combobox({
										data : _data
									});
									$(_self.occupNameCombo).combobox('setValue', _self.policyHolderData.occupName.id);
								}
							});
						} else {
							$(this.occupNameCombo).combobox('setValue', '');
						}
						if (this.policyHolderData.occupWork) {
							//二级菜单数据重新加载
							$.ajax({
								url : taiping.getBasePath() + '/restService/master/occup/work/'
										+ _self.policyHolderData.occupName.id,
								success : function(_data) {
									$(_self.occupWorkCombo).combobox({
										data : _data
									});
									$(_self.occupWorkCombo).combobox('setValue', _self.policyHolderData.occupWork.id);
								}
							});
						} else {
							$(this.occupWorkCombo).combobox('setValue', '');
						}

						if (this.policyHolderData.mobile) {
							$(this.mobileText).val(this.policyHolderData.mobile);
						} else {
							$(this.mobileText).val('');
						}

						if (this.policyHolderData.email) {
							$(this.emailText).val(this.policyHolderData.email);
						} else {
							$(this.emailText).val('');
						}

						//隐藏保存信息，显示form
						$(this.insuPolicyholderSavedBlock).hide();
						$(this.insuPolicyholderBlock).show();
					}

				};
				PolicyHolder.prototype.constructor.prototype = PolicyHolder.prototype;

				/*************************************************************************************************/
				/**************<define PolicyHolder object/>******************************************************/
				/*************************************************************************************************/

				/*************************************************************************************************/
				/**************<define Recognizee object>*******************************************************/
				/*************************************************************************************************/
				var Recognizee = function(opts) {
					return new Recognizee.prototype.constructor(opts);
				};

				Recognizee.prototype = {
					currentIndex : -1,
					recognizeeList : new Array(),
					dateformatter : 'yyyy-MM-dd',

					//被保人对象,用于同被保人信息带入
					policyHolder : undefined,
					/*************element****************/
					insuRecognizeeSavedBlock : '#insu_recognizee_saved_block',
					insuRecognizeeSavedBlockInfo : '#insu_recognizee_saved_block div.insu_form_info',
					insuRecognizeeBlock : '#insu_recognizee_block',
					insuRecognizeeForm : '#insu_recognizee_form',
					insuRecognizeeSavedTempBlock : '#insu_recognizees_saved_temp',
					insuRecognizeesSavedTemp : '',

					/**<姓名、证件类型、证件号、性别、生日、职业类型>**/
					relationCombo : '#insu_recognizee_block div#relationCombo',
					userNameText : '#insu_recognizee_block input#userNameText',
					idTypeCombo : '#insu_recognizee_block div#idTypeCombo',
					idNoText : '#insu_recognizee_block input#idNoText',
					genderCombo : '#insu_recognizee_block div#genderCombo',
					birthdayPicker : '#insu_recognizee_block input#r_birthdayPicker',
					workedRadio : '#insu_recognizee_block input#worked',
					notWorkedRadio : '#insu_recognizee_block input#notWorked',
					retiredRadio : '#insu_recognizee_block input#isRetired',

					//工作类型选择区域
					occupBlock : '#insu_recognizee_block div#occup_block',
					occupTypeCombo : '#insu_recognizee_block div#occupTypeCombo',
					occupNameCombo : '#insu_recognizee_block div#occupNameCombo',
					occupWorkCombo : '#insu_recognizee_block div#occupWorkCombo',
					maritalStatusCombo : '#insu_recognizee_block div#maritalStatusCombo',
					/**<姓名、证件类型、证件号、性别、生日、职业类型、手机号码、email/>**/

					intoButton : '#insu_recognizee_block input#recognizee_into_bt',
					saveButton : '#insu_recognizee_block a#recognizee_save_bt',
					cancelButton : '#insu_recognizee_block a#recognizee_cancel_bt',
					modifyButton : '#insu_recognizee_saved_block a#recognizee_modify_bt',
					deleteButton : '#insu_recognizee_saved_block a#recognizee_delete_bt',
					addButton : '#insu_recognizee_saved_block a#recognizee_add_bt',
					/************************************/

					constructor : function(opts) {
						$.extend(this, opts);
					},
					// 可在这里添加实例方法
					show : function() {
						this.initializing();
					},
					//私有方法
					initializing : function() {
						//初始化控件
						this.initFormElement();

						console.log("Recognizee>>>initializing");
						console.log(this.recognizeeList);
						//回显数据，或初始化显示
						if (this.recognizeeList.length == 0) {
							//调用showsavedInfo显示当前填写信息，初始化时list length为0
							this.showSavedInfo();
						} else {
							//回显数据
							this.showSavedInfo();
						}

					},

					initFormElement : function() {

						var _self = this;
						$(this.saveButton).on('click', function() {
							_self.onSaveHander();
						});

						$(this.cancelButton).on('click', function() {
							_self.onCancelHander();
						});

						$(this.intoButton).on('click', function(data) {
							_self.onIntoHander();
						});

						$(this.idNoText).on('blur', function() {
							//如果输入身份证号正确时，自动带入生日、性别
							tpIDCardLinkages.linkage(this, _self.idTypeCombo, _self.genderCombo, _self.birthdayPicker);
						});

						$(this.workedRadio).on('click', function(data) {
							$(_self.occupTypeCombo).combobox('setValue', '');
							$(_self.occupNameCombo).combobox('setValue', '');
							$(_self.occupWorkCombo).combobox('setValue', '');
							$(_self.occupBlock).show();
						});

						$(this.notWorkedRadio).on('click', function(data) {
							$(_self.occupTypeCombo).combobox('setValue', '');
							$(_self.occupNameCombo).combobox('setValue', '');
							$(_self.occupWorkCombo).combobox('setValue', '');
							$(_self.occupBlock).hide();
						});

						$(this.retiredRadio).on('click', function(data) {
							$(_self.occupTypeCombo).combobox('setValue', '');
							$(_self.occupNameCombo).combobox('setValue', '');
							$(_self.occupWorkCombo).combobox('setValue', '');
							$(_self.occupBlock).hide();
						});

						$(this.relationCombo).combobox({
							valueField : 'value',
							textField : 'text',
							editable : false,
							panelHeight : 'auto',
							url : taiping.getBasePath() + '/restService/master/dictionary/relation',
							method : 'get',
							onSelect : function(data) {
								if (data.value == 5) {
									$(_self.intoButton).prop('checked', true);
									_self.onIntoHander();
								} else {
									$(_self.intoButton).prop('checked', false);
								}
							}
						});

						$(this.idTypeCombo).combobox({
							valueField : 'value',
							textField : 'text',
							editable : false,
							panelHeight : 'auto',
							url : taiping.getBasePath() + '/restService/master/dictionary/cx_id_type',
							method : 'get',
							onSelect : function(data) {
								if (data.value == 1) {
									if ($(_self.idNoText).val() != "") {
										//如果证件类型选择身份证，需要校验身份证号码有效性
										tpValidator.identityCard(_self.idNoText);
									}
								} else {
									//如果之前进行过身份证校验error,需要先清除
									tpValidator.clearErrorTip(_self.idNoText);
								}
							}
						});

						$(this.genderCombo).combobox({
							valueField : 'value',
							textField : 'text',
							editable : false,
							panelHeight : 'auto',
							url : taiping.getBasePath() + '/restService/master/dictionary/gender',
							method : 'get',
							onSelect : function(data) {
							}
						});

						var currentDate = new Date();
						var dateEnd = currentDate.getFullYear() + "-" + (currentDate.getUTCMonth() + 1) + "-"
								+ (currentDate.getDate());
						$(this.birthdayPicker).calendar({
							timeend : dateEnd
						});

						$(this.occupTypeCombo).combobox({
							valueField : 'id',
							textField : 'name',
							editable : false
						});
						$(this.occupNameCombo).combobox({
							valueField : 'id',
							textField : 'name',
							editable : false
						});
						$(this.occupWorkCombo).combobox({
							valueField : 'id',
							textField : 'name',
							editable : false
						});

						$(this.maritalStatusCombo).combobox({
							valueField : 'value',
							textField : 'text',
							editable : false,
							panelHeight : 'auto',
							url : taiping.getBasePath() + '/restService/master/dictionary/marital_status',
							method : 'get',
							onSelect : function(data) {
							}
						});

						//加载被保人信息的html模版
						this.insuRecognizeesSavedTemp = $(this.insuRecognizeeSavedTempBlock).html();

						//加载联动菜单
						this.linkageOccupData(this.occupTypeCombo, 0);

						//注册校验控件
						this.registValidate();

					},

					linkageOccupData : function(linkage, parentId) {
						var _self = this;
						var url = taiping.getBasePath() + '/restService/master/occup/';
						if (linkage == this.occupTypeCombo) {
							url = url + 'type/' + parentId;
						} else if (linkage == this.occupNameCombo) {
							url = url + 'name/' + parentId;
						} else {
							url = url + 'work/' + parentId;
						}
						$.ajax({
							url : url,
							success : function(_data) {
								$(linkage).combobox({
									valueField : 'id',
									textField : 'name',
									editable : false,
									data : _data,
									onSelect : function(data) {
										if (linkage == _self.occupTypeCombo) {
											_self.linkageOccupData(_self.occupNameCombo, data.id);
										}
										if (linkage == _self.occupNameCombo) {
											_self.linkageOccupData(_self.occupWorkCombo, data.id);
										}
									}
								});
							}
						});
					},

					registValidate : function() {
						$(this.insuRecognizeeForm).validate({
							rules : {
								//姓名
								userName : {
									required : true,
									username : true
								},
								idNo : {
									required : true
								}
							},
							errorPlacement : function(error, element) {
								$(element).parent().next().append(error);
							}
						});
					},

					//表单saveData方法中使用的校验方法
					validate : function() {

						console.log("Recognizee>>>validate");
						console.log("Recognizee>>>validate currentIndex:" + this.currentIndex);
						//当前数据校验
						var recognizeeData = this.recognizeeList[this.currentIndex];

						//校验关系 easyUI combobox
						var result = tpValidator.easyCombo(this.relationCombo);
						console.log("validate>>>relation:" + result);
						if (result == false) {
							recognizeeData.valid = false;
							return false;
						}

						//校验用户姓名
						result = tpValidator.username(this.userNameText, true);
						console.log("validate>>>username:" + result);
						if (result == false) {
							recognizeeData.valid = false;
							return false;
						}

						//证件类型easyUI combobox
						var result = tpValidator.easyCombo(this.idTypeCombo);
						console.log("validate>>>idType:" + result);
						if (result == false) {
							recognizeeData.valid = false;
							return false;
						}
						//校验证件号码
						result = tpValidator.required(this.idNoText);
						console.log("validate>>>idNo:" + result);
						if (result == false) {
							recognizeeData.valid = false;
							return false;
						}
						//身份证号码校验
						var idType = $(this.idTypeCombo).combobox('getValue');
						if (idType == 1) {
							//如果证件类型选择身份证，需要校验身份证号码有效性
							result = tpValidator.identityCard(this.idNoText);
							console.log("validate>>>身份证:" + result);
							if (result == false) {
								recognizeeData.valid = false;
								return false;
							}
						}

						//校验性别 easyUI combobox
						var result = tpValidator.easyCombo(this.genderCombo);
						console.log("validate>>>gender:" + result);
						if (result == false) {
							recognizeeData.valid = false;
							return false;
						}

						var relationValue = $(this.relationCombo).combobox('getValue');
						if (relationValue == 2) {
							//子女年龄必须小于23周岁
							//校验出生日期
							result = tpValidator.birthday(this.birthdayPicker, true, undefined, 23);
							console.log("validate>>>birthday:" + result);
							if (result == false) {
								recognizeeData.valid = false;
								return false;
							}
						} else {
							//校验出生日期
							result = tpValidator.birthday(this.birthdayPicker, true, 18, 65);
							console.log("validate>>>birthday:" + result);
							if (result == false) {
								recognizeeData.valid = false;
								return false;
							}
						}

						//校验校验婚姻状况easyUI combobox
						var result = tpValidator.easyCombo(this.maritalStatusCombo);
						console.log("validate>>>maritalStatus:" + result);
						if (result == false) {
							recognizeeData.valid = false;
							return false;
						}

						//子女必须未婚
						if (relationValue == 2 && $(this.maritalStatusCombo).combobox('getValue') == 2) {
							recognizeeData.valid = false;
							alert('已婚子女不能作为本家庭成员进行投保!');
							return false;
						}

						var isWorked = $(this.workedRadio).prop('checked');
						var isRetired = $(this.retiredRadio).prop('checked');
						if (relationValue == 2 && (isWorked == true || isRetired == true)) {
							recognizeeData.valid = false;
							alert('已参加工作的子女不能作为本家庭成员进行投保!');
							return false;
						}
						if (isWorked == true) {
							//校验职业类型easyUI combobox
							var result = tpValidator.easyCombo(this.occupTypeCombo);
							console.log("validate>>>occupType:" + result);
							if (result == false) {
								recognizeeData.valid = false;
								return false;
							}
							var result = tpValidator.easyCombo(this.occupNameCombo);
							console.log("validate>>>occupName:" + result);
							if (result == false) {
								recognizeeData.valid = false;
								return false;
							}
							var result = tpValidator.easyCombo(this.occupWorkCombo);
							console.log("validate>>>occupWork:" + result);
							if (result == false) {
								recognizeeData.valid = false;
								return false;
							}

							var occupWorkValue = $(this.occupWorkCombo).combobox('getValue');
							var workData = undefined;
							$($(this.occupWorkCombo).combobox('getData')).each(function() {
								if (this.id == occupWorkValue) {
									workData = this;
								}
							});
							if (workData.level != "1" && workData.level != "2") {
								recognizeeData.valid = false;
								//职业类别必须为一至二类。否则不能提交信息
								alert("对不起，您的职业不属于本产品的承保职业类别!");
								return false;
							}
						}

						//人数校验：被保人家庭核心成员不能超过8人，子女不能超过4人
						console.log("validate>>>people:" + this.recognizeeList.length);
						if (this.recognizeeList.length > 8) {
							alert("非常抱歉，被保人家庭核心成员人数不能超过8人！");
							recognizeeData.valid = false;
							return false;
						}

						//校验本人是否已经填写过
						if (relationValue == 5) {
							var exist = false;
							for ( var index in this.recognizeeList) {
								if (this.recognizeeList[index].saved && this.recognizeeList[index].relation.value == 5) {
									exist = true;
									break;
								}
							}
							console.log("validate>>>exist 本人:" + exist);
							if (exist) {
								alert("你已经填写过本人的信息，如需修改，【取消】后，点击【修改】！");
								recognizeeData.valid = false;
								return false;
							}
						}

						//校验配偶是否已经填写过
						if (relationValue == 1) {
							var exist = false;
							for ( var index in this.recognizeeList) {
								if (this.recognizeeList[index].saved && this.recognizeeList[index].relation.value == 1) {
									exist = true;
									break;
								}
							}
							console.log("validate>>>exist 配偶:" + exist);
							if (exist) {
								alert("你已经填写过配偶的信息，如需修改，【取消】后，点击【修改】！");
								recognizeeData.valid = false;
								return false;
							}
						}

						//校验子女人数不能超过4人
						if (relationValue == 2) {
							//子女人数不能超过4人
							var childNum = 0;
							for ( var index in this.recognizeeList) {
								//当前被保人信息中已经存在4个子女信息(被保存的)
								if (this.recognizeeList[index].saved && this.recognizeeList[index].relation.value == 2) {
									childNum++;
								}
							}
							console.log("validate>>>childNum:" + childNum);
							if (childNum >= 4) {
								alert("非常抱歉，被保人中子女的人数不能超过4人！");
								recognizeeData.valid = false;
								return false;
							}
						}

						console.log("Recognizee>>>validate return true");
						recognizeeData.valid = true;
						return true;
					},

					onSaveHander : function() {
						if (this.validate()) {
							this.saveData();
							this.showSavedInfo();
						}
					},

					onCancelHander : function() {
						var tempList = new Array();
						for ( var index in this.recognizeeList) {
							//如果对象未保存过 则直接删除
							if (this.recognizeeList[index].valid != false) {
								//重新置为保存状态
								this.recognizeeList[index].saved = true;
								tempList.push(this.recognizeeList[index]);
							}
						}
						this.recognizeeList = tempList;
						//当取消时将当前下标currentIndex置为-1，currentIndex只有两种情况
						//1、通过校验保存完成。
						//2、取消修改或添加操作时。
						this.currentIndex = -1;
						this.showSavedInfo();
					},

					onIntoHander : function() {
						console.log("Recognizee>>>onIntoClickHander");
						var insurer = this.policyHolder.getData();
						if (insurer.saved == false) {
							$(this.intoButton).prop('checked', false);
							alert("投保人信息未保存，请先保存");
							return;
						}
						var recognizeeData = this.recognizeeList[this.currentIndex];
						//设置为无效状态，取消时删除
						recognizeeData.valid = false;

						if ($(this.intoButton).prop('checked') == true) {
							recognizeeData.relation = {
								value : 5,
								text : '本人'
							};
							recognizeeData.userName = insurer.userName;
							recognizeeData.gender = insurer.gender;
							recognizeeData.idType = insurer.idType;
							recognizeeData.idNo = insurer.idNo;
							recognizeeData.birthday = insurer.birthday;
							recognizeeData.isWorked = 0;
							recognizeeData.occupType = insurer.occupType;
							recognizeeData.occupName = insurer.occupName;
							recognizeeData.occupWork = insurer.occupWork;
						} else {
							recognizeeData.relation = undefined;
							recognizeeData.userName = '';
							recognizeeData.gender = undefined;
							recognizeeData.idType = undefined;
							recognizeeData.idNo = '';
							recognizeeData.birthday = '';
							recognizeeData.maritalStatus = undefined;
							recognizeeData.isWorked = 1;
							recognizeeData.occupType = undefined;
							recognizeeData.occupName = undefined;
							recognizeeData.occupWork = undefined;
						}

						this.showForm();
					},

					onModifyHander : function(index) {
						//删除add按钮区域，一次只能修改一个被保人。
						$(this.addButton).parent().remove();
						//隐藏 modify delete按钮
						$(this.modifyButton).each(function(index) {
							//this 为  modify button <a>
							$(this).hide();
						});
						$(this.deleteButton).each(function(index) {
							//this 为  delete button <a>
							$(this).hide();
						});

						//修改当前下标
						this.currentIndex = index;
						var recognizeeData = this.recognizeeList[this.currentIndex];
						recognizeeData.saved = false;
						this.showForm();
					},

					onDeleteHander : function(index, dom) {
						var tempList = new Array();
						for ( var i in this.recognizeeList) {
							if (i != index) {
								tempList.push(this.recognizeeList[i]);
							}
						}
						this.recognizeeList = tempList;

						//重新显示
						this.showSavedInfo();
					},

					onAddHandler : function() {
						//删除add按钮区域，一次只能添加一个被保人。
						$(this.addButton).parent().remove();
						//隐藏 modify delete按钮
						$(this.modifyButton).each(function(index) {
							//this 为  modify button <a>
							$(this).hide();
						});
						$(this.deleteButton).each(function(index) {
							//this 为  delete button <a>
							$(this).hide();
						});
						//当前下标加1,增加一个新的对象
						var recognizeeData = new Object();
						//对象状态为未保存
						recognizeeData.saved = false;
						recognizeeData.valid = false;

						this.recognizeeList.push(recognizeeData);
						//当前下标移动到最后一项
						this.currentIndex = this.recognizeeList.length - 1;
						this.showForm();
					},

					getData : function() {
						console.log("Recognizee>>>getData");
						console.log(this.recognizeeList);
						return this.recognizeeList;
					},

					saveData : function() {
						/**姓名、证件类型、证件号、性别、生日、职业类型、手机号码、email**/
						var recognizeeData = this.recognizeeList[this.currentIndex];
						recognizeeData.userName = $(this.userNameText).val();
						recognizeeData.idNo = $(this.idNoText).val();
						recognizeeData.birthday = $(this.birthdayPicker).val();

						//为了cancel逻辑简单，所以在这里来获取combo的值，而不使用event更改。
						var relationValue = $(this.relationCombo).combobox('getValue');
						$($(this.relationCombo).combobox('getData')).each(function() {
							if (this.value == relationValue) {
								recognizeeData.relation = this;
							}
						});
						var idTypeValue = $(this.idTypeCombo).combobox('getValue');
						$($(this.idTypeCombo).combobox('getData')).each(function() {
							if (this.value == idTypeValue) {
								recognizeeData.idType = this;
							}
						});
						var genderValue = $(this.genderCombo).combobox('getValue');
						$($(this.genderCombo).combobox('getData')).each(function() {
							if (this.value == genderValue) {
								recognizeeData.gender = this;
							}
						});

						//是否工作
						var isWorked = $(this.workedRadio).prop('checked');
						if (isWorked == true) {
							recognizeeData.isWorked = 0;
							//职业类型
							var occupTypeValue = $(this.occupTypeCombo).combobox('getValue');
							$($(this.occupTypeCombo).combobox('getData')).each(function() {
								if (this.id == occupTypeValue) {
									recognizeeData.occupType = this;
								}
							});
							var occupNameValue = $(this.occupNameCombo).combobox('getValue');
							$($(this.occupNameCombo).combobox('getData')).each(function() {
								if (this.id == occupNameValue) {
									recognizeeData.occupName = this;
								}
							});
							var occupWorkValue = $(this.occupWorkCombo).combobox('getValue');
							$($(this.occupWorkCombo).combobox('getData')).each(function() {
								if (this.id == occupWorkValue) {
									recognizeeData.occupWork = this;
								}
							});
						} else {
							if ($(this.notWorkedRadio).prop('checked') == true) {
								recognizeeData.isWorked = 1;
							} else if ($(this.retiredRadio).prop('checked') == true) {
								recognizeeData.isWorked = 2;
							}
							recognizeeData.occupType = undefined;
							recognizeeData.occupName = undefined;
							recognizeeData.occupWork = undefined;
						}

						//婚姻状况
						var maritalStatusValue = $(this.maritalStatusCombo).combobox('getValue');
						$($(this.maritalStatusCombo).combobox('getData')).each(function() {
							if (this.value == maritalStatusValue) {
								recognizeeData.maritalStatus = this;
							}
						});

						//对象状态为保存
						recognizeeData.saved = true;
						//将当前下标置为-1
						this.currentIndex = -1;

						console.log("Recognizee>>>saveData");
						console.log(recognizeeData);
					},

					showSavedInfo : function() {
						//清空后 重新加载
						$(this.insuRecognizeeSavedBlockInfo).empty();
						var infoHTML = "";
						for ( var index in this.recognizeeList) {
							var data = this.recognizeeList[index];
							var temp = this.insuRecognizeesSavedTemp;
							temp = temp.replace('@relation', data.relation.text);
							temp = temp.replace('@userName', data.userName);
							temp = temp.replace('@idNo', data.idNo);
							temp = temp.replace('@gender', data.gender.text);
							temp = temp.replace('@birthday', data.birthday);
							if (data.isWorked == 0) {
								temp = temp.replace('@isWorked', '已工作');
							} else if (data.isWorked == 1) {
								temp = temp.replace('@isWorked', '未工作');
							} else if (data.isWorked == 2) {
								temp = temp.replace('@isWorked', '退休');
							}
							temp = temp.replace('@occupType', data.occupType != undefined ? data.occupType.name : '');
							temp = temp.replace('@occupName', data.occupName != undefined ? data.occupName.name : '');
							temp = temp.replace('@occupWork', data.occupWork != undefined ? data.occupWork.name : '');
							temp = temp.replace('@maritalStatus', data.maritalStatus.text);
							infoHTML = infoHTML + temp;
						}

						//生成添加按钮
						infoHTML = infoHTML
								+ "<div class=\"insu_form_row\"><a id=\"recognizee_add_bt\" href=\"javascript:void(0);\">添加被保人</a></div>";

						$(this.insuRecognizeeSavedBlockInfo).append(infoHTML);
						$(this.insuRecognizeeBlock).hide();
						$(this.insuRecognizeeSavedBlock).show();
						//在show后保证div已经被加载到页面
						var _self = this;
						//注册修改按钮事件
						$(this.modifyButton).each(function(index) {
							//this 为  modify button <a>
							$(this).on('click', function() {
								_self.onModifyHander(index);
							});
						});
						//注册删除按钮事件
						$(this.deleteButton).each(function(index) {
							//this 为  delete button <a>
							$(this).on('click', function() {
								_self.onDeleteHander(index, this);
							});
						});

						//注册添加按钮事件
						$(this.addButton).on('click', function() {
							_self.onAddHandler();
						});
					},

					showForm : function() {

						var recognizeeData = this.recognizeeList[this.currentIndex];

						if (recognizeeData.relation) {
							$(this.relationCombo).combobox('setValue', recognizeeData.relation.value);
							if (recognizeeData.relation.value == 5) {
								//如果选过，重置未选中
								$(this.intoButton).prop('checked', true);
							} else {
								//如果选过，重置未选中
								$(this.intoButton).prop('checked', false);
							}
						} else {
							$(this.relationCombo).combobox('setValue', '');
							//如果选过，重置未选中
							$(this.intoButton).prop('checked', false);
						}

						if (recognizeeData.userName) {
							$(this.userNameText).val(recognizeeData.userName);
						} else {
							$(this.userNameText).val('');
						}
						if (recognizeeData.idType) {
							$(this.idTypeCombo).combobox('setValue', recognizeeData.idType.value);
						} else {
							$(this.idTypeCombo).combobox('setValue', '');
						}
						if (recognizeeData.idNo) {
							$(this.idNoText).val(recognizeeData.idNo);
						} else {
							$(this.idNoText).val('');
						}
						if (recognizeeData.gender) {
							$(this.genderCombo).combobox('setValue', recognizeeData.gender.value);
						} else {
							$(this.genderCombo).combobox('setValue', '');
						}
						if (recognizeeData.birthday) {
							$(this.birthdayPicker).val(recognizeeData.birthday);
						} else {
							$(this.birthdayPicker).val('');
						}

						//是否参加工作
						if (recognizeeData.isWorked == 0) {
							$(this.workedRadio).prop('checked', true);
							$(this.occupBlock).show();
						} else {
							if (recognizeeData.isWorked == 1) {
								$(this.notWorkedRadio).prop('checked', true);
							} else if (recognizeeData.isWorked == 2) {
								$(this.retiredRadio).prop('checked', true);
							}
							$(this.occupBlock).hide();
						}
						//职业类型三级联动菜单回显数据
						var _self = this;
						if (recognizeeData.occupType) {
							//一级数据不会变化无需重新加载数据
							$(this.occupTypeCombo).combobox('setValue', recognizeeData.occupType.id);
						} else {
							$(this.occupTypeCombo).combobox('setValue', '');
						}
						if (recognizeeData.occupName) {
							//二级菜单数据重新加载
							$.ajax({
								url : taiping.getBasePath() + '/restService/master/occup/name/'
										+ recognizeeData.occupType.id,
								success : function(_data) {
									$(_self.occupNameCombo).combobox({
										data : _data
									});
									$(_self.occupNameCombo).combobox('setValue', recognizeeData.occupName.id);
								}
							});
						} else {
							$(this.occupNameCombo).combobox('setValue', '');
						}
						if (recognizeeData.occupWork) {
							//二级菜单数据重新加载
							$.ajax({
								url : taiping.getBasePath() + '/restService/master/occup/work/'
										+ recognizeeData.occupName.id,
								success : function(_data) {
									$(_self.occupWorkCombo).combobox({
										data : _data
									});
									$(_self.occupWorkCombo).combobox('setValue', recognizeeData.occupWork.id);
								}
							});
						} else {
							$(this.occupWorkCombo).combobox('setValue', '');
						}

						if (recognizeeData.maritalStatus) {
							$(this.maritalStatusCombo).combobox('setValue', recognizeeData.maritalStatus.value);
						} else {
							$(this.maritalStatusCombo).combobox('setValue', '');
						}

						$(this.insuRecognizeeBlock).show();
					}

				};
				Recognizee.prototype.constructor.prototype = Recognizee.prototype;

				/*************************************************************************************************/
				/**************<define Recognizee object/>********************************************************/
				/*************************************************************************************************/

				/*************************************************************************************************/
				/**************<define Servant object>************************************************************/
				/*************************************************************************************************/
				var Servant = function(opts) {
					return new Servant.prototype.constructor(opts);
				};

				Servant.prototype = {
					currentIndex : -1,
					servantList : new Array(),
					dateformatter : 'yyyy-MM-dd',
					/*************element****************/
					insuServantSavedBlock : '#insu_servant_saved_block',
					insuServantSavedBlockInfo : '#insu_servant_saved_block div.insu_form_info',
					insuServantBlock : '#insu_servant_block',
					insuServantForm : '#insu_servant_form',
					insuServantSavedTempBlock : '#insu_servants_saved_temp div.insu_form_row',
					insuServantsSavedTemp : '',

					/**<姓名、证件类型、证件号、性别、生日、职业类型>**/
					userNameText : '#insu_servant_block input#userNameText',
					idTypeCombo : '#insu_servant_block div#idTypeCombo',
					idNoText : '#insu_servant_block input#idNoText',
					genderCombo : '#insu_servant_block div#genderCombo',
					birthdayPicker : '#insu_servant_block input#s_birthdayPicker',
					maritalStatusCombo : '#insu_servant_block div#maritalStatusCombo',
					/**<姓名、证件类型、证件号、性别、生日、职业类型、手机号码、email/>**/
					saveButton : '#insu_servant_block a#servant_save_bt',
					cancelButton : '#insu_servant_block a#servant_cancel_bt',
					modifyButton : '#insu_servant_saved_block a#servant_modify_bt',
					deleteButton : '#insu_servant_saved_block a#servant_delete_bt',
					addButton : '#insu_servant_saved_block a#servant_add_bt',
					/************************************/

					constructor : function(opts) {
						$.extend(this, opts);
					},
					// 可在这里添加实例方法
					show : function() {
						this.initializing();
					},
					//私有方法
					initializing : function() {
						//初始化控件
						this.initFormElement();

						console.log("Servant>>>initializing");
						console.log(this.servantList);

						//回显数据或，初始化显示
						if (this.servantList.length == 0) {
							//调用showsavedInfo显示当前填写信息，初始化时list length为0
							//这里可以做分支显示info 或 form两种选择
							this.showSavedInfo();
						} else {
							//回显数据
							this.showSavedInfo();
						}
					},

					initFormElement : function() {

						var _self = this;

						$(this.saveButton).on('click', function() {
							_self.onSaveHander();
						});

						$(this.cancelButton).on('click', function() {
							_self.onCancelHander();
						});

						$(this.addButton).on('click', function() {
							_self.onAddHandler(this);
						});

						$(this.idNoText).on('blur', function() {
							//如果输入身份证号正确时，自动带入生日、性别
							tpIDCardLinkages.linkage(this, _self.idTypeCombo, _self.genderCombo, _self.birthdayPicker);
						});

						$(this.idTypeCombo).combobox({
							valueField : 'value',
							textField : 'text',
							editable : false,
							panelHeight : 'auto',
							url : taiping.getBasePath() + '/restService/master/dictionary/cx_id_type',
							method : 'get',
							onSelect : function(data) {
								if (data.value == 1) {
									if ($(_self.idNoText).val() != "") {
										//如果证件类型选择身份证，需要校验身份证号码有效性
										tpValidator.identityCard(_self.idNoText);
									}
								} else {
									//如果之前进行过身份证校验error,需要先清除
									tpValidator.clearErrorTip(_self.idNoText);
								}
							}
						});

						$(this.genderCombo).combobox({
							valueField : 'value',
							textField : 'text',
							editable : false,
							panelHeight : 'auto',
							url : taiping.getBasePath() + '/restService/master/dictionary/gender',
							method : 'get',
							onSelect : function(data) {
							}
						});

						var currentDate = new Date();
						var dateEnd = currentDate.getFullYear() + "-" + (currentDate.getUTCMonth() + 1) + "-"
								+ (currentDate.getDate());
						$(this.birthdayPicker).calendar({
							timeend : dateEnd
						});

						$(this.maritalStatusCombo).combobox({
							valueField : 'value',
							textField : 'text',
							editable : false,
							panelHeight : 'auto',
							url : taiping.getBasePath() + '/restService/master/dictionary/marital_status',
							method : 'get',
							onSelect : function(data) {
							}
						});

						//加载保存人信息的html模版
						this.insuServantsSavedTemp = $(this.insuServantSavedTempBlock).html();

						//注册校验控件
						this.registValidate();
					},

					registValidate : function() {
						$(this.insuServantForm).validate({
							rules : {
								//姓名
								userName : {
									required : true,
									username : true
								},
								idNo : {
									required : true
								}
							},
							errorPlacement : function(error, element) {
								$(element).parent().next().append(error);
							}
						});
					},

					//表单saveData方法中使用的校验方法
					validate : function() {

						console.log("Servant>>>validate");
						console.log("Servant>>>validate currentIndex:" + this.currentIndex);
						//当前数据校验
						var servantData = this.servantList[this.currentIndex];

						//校验用户姓名
						result = tpValidator.username(this.userNameText, true);
						console.log("validate>>>username:" + result);
						if (result == false) {
							servantData.valid = false;
							return false;
						}

						//证件类型easyUI combobox
						var result = tpValidator.easyCombo(this.idTypeCombo);
						console.log("validate>>>idType:" + result);
						if (result == false) {
							servantData.valid = false;
							return false;
						}
						//校验证件号码
						result = tpValidator.required(this.idNoText);
						console.log("validate>>>idNo:" + result);
						if (result == false) {
							servantData.valid = false;
							return false;
						}
						//身份证号码校验
						var idType = $(this.idTypeCombo).combobox('getValue');
						if (idType == 1) {
							//如果证件类型选择身份证，需要校验身份证号码有效性
							result = tpValidator.identityCard(this.idNoText);
							console.log("validate>>>身份证:" + result);
							if (result == false) {
								servantData.valid = false;
								return false;
							}
						}

						//校验性别 easyUI combobox
						var result = tpValidator.easyCombo(this.genderCombo);
						console.log("validate>>>gender:" + result);
						if (result == false) {
							servantData.valid = false;
							return false;
						}

						//校验出生日期
						result = tpValidator.required(this.birthdayPicker);
						console.log("validate>>>birthday:" + result);
						if (result == false) {
							servantData.valid = false;
							return false;
						}

						//家庭雇员人数限制3人
						if (this.servantList.length > 3) {
							alert("非常抱歉，被保人中家庭雇员的人数不能超过3人！");
							servantData.valid = false;
							return false;
						}

						console.log("Servant>>>validate return true");
						servantData.valid = true;
						return true;
					},

					onSaveHander : function() {
						if (this.validate()) {
							this.saveData();
							this.showSavedInfo();
						}
					},

					onCancelHander : function() {
						var tempList = new Array();
						for ( var index in this.servantList) {
							//如果对象未保存 则直接删除
							if (this.servantList[index].valid != false) {
								this.servantList[index].saved = true;
								tempList.push(this.servantList[index]);
							}
						}
						this.servantList = tempList;
						//当取消时将当前下标currentIndex置为-1，currentIndex只有两种情况
						//1、通过校验保存完成。
						//2、取消修改或添加操作时。
						this.currentIndex = -1;
						this.showSavedInfo();
					},

					onModifyHander : function(index) {
						//删除add按钮区域，一次只能修改一个被保人。
						$(this.addButton).parent().remove();
						//隐藏 modify delete按钮
						$(this.modifyButton).each(function(index) {
							//this 为  modify button <a>
							$(this).hide();
						});
						$(this.deleteButton).each(function(index) {
							//this 为  delete button <a>
							$(this).hide();
						});
						//修改当前下标
						this.currentIndex = index;
						var servantData = this.servantList[this.currentIndex];
						servantData.saved = false;
						this.showForm();
					},

					onDeleteHander : function(index, dom) {
						var tempList = new Array();
						for ( var i in this.servantList) {
							if (i != index) {
								tempList.push(this.servantList[i]);
							}
						}
						this.servantList = tempList;

						//重新显示
						this.showSavedInfo();
					},

					onAddHandler : function(dom) {
						//删除add按钮区域，一次只能添加一个被保人。
						$(dom).parent().remove();
						//隐藏 modify delete按钮
						//注册修改按钮事件
						$(this.modifyButton).each(function(index) {
							//this 为  modify button <a>
							$(this).hide();
						});
						//注册删除按钮事件
						$(this.deleteButton).each(function(index) {
							//this 为  delete button <a>
							$(this).hide();
						});
						//当前下标加1,增加一个新的对象
						var servantData = new Object();
						//对象状态为未保存
						servantData.saved = false;
						servantData.valid = false;

						this.servantList.push(servantData);
						//当前下标移动到最后一项
						this.currentIndex = this.servantList.length - 1;
						this.showForm();
					},

					getData : function() {
						console.log("Servant>>>getData");
						console.log(this.servantList);
						return this.servantList;
					},

					saveData : function() {

						/**姓名、证件类型、证件号、性别、生日、婚姻状况**/
						var servantData = this.servantList[this.currentIndex];
						servantData.userName = $(this.userNameText).val();
						servantData.idNo = $(this.idNoText).val();
						servantData.birthday = $(this.birthdayPicker).val();

						//为了cancel逻辑简单，所以在这里来获取combo的值，而不使用event更改。
						var idTypeValue = $(this.idTypeCombo).combobox('getValue');
						$($(this.idTypeCombo).combobox('getData')).each(function() {
							if (this.value == idTypeValue) {
								servantData.idType = this;
							}
						});
						var genderValue = $(this.genderCombo).combobox('getValue');
						$($(this.genderCombo).combobox('getData')).each(function() {
							if (this.value == genderValue) {
								servantData.gender = this;
							}
						});

						var maritalStatusValue = $(this.maritalStatusCombo).combobox('getValue');
						if (maritalStatusValue == "") {
							servantData.maritalStatus = undefined;
						} else {
							$($(this.maritalStatusCombo).combobox('getData')).each(function() {
								if (this.value == maritalStatusValue) {
									servantData.maritalStatus = this;
								}
							});
						}

						//对象状态为保存
						servantData.saved = true;
						//将当前下标置为-1
						this.currentIndex = -1;

						console.log("Servant>>>saveData");
						console.log(servantData);
					},

					showSavedInfo : function() {
						//清空后 重新加载
						$(this.insuServantSavedBlockInfo).empty();
						var infoHTML = "";
						for ( var index in this.servantList) {
							infoHTML = infoHTML + "<div class=\"insu_form_row\">";
							var data = this.servantList[index];
							var temp = this.insuServantsSavedTemp;
							temp = temp.replace('@userName', data.userName);
							temp = temp.replace('@idNo', data.idNo);
							temp = temp.replace('@gender', data.gender.text);
							temp = temp.replace('@birthday', data.birthday);
							if (data.maritalStatus) {
								temp = temp.replace('@maritalStatus', data.maritalStatus.text);
							} else {
								temp = temp.replace('@maritalStatus', '');
							}
							infoHTML = infoHTML + temp;
							infoHTML = infoHTML + "</div>";
						}

						//生成添加按钮
						infoHTML = infoHTML
								+ "<div class=\"insu_form_row\"><a id=\"servant_add_bt\" href=\"javascript:void(0);\">添加家庭雇员信息</a></div>";

						$(this.insuServantSavedBlockInfo).append(infoHTML);
						$(this.insuServantBlock).hide();
						$(this.insuServantSavedBlock).show();
						//在show后保证div已经被加载到页面
						var _self = this;
						//注册修改按钮事件
						$(this.modifyButton).each(function(index) {
							//this 为  modify button <a>
							$(this).on('click', function() {
								_self.onModifyHander(index);
							});
						});
						//注册删除按钮事件
						$(this.deleteButton).each(function(index) {
							//this 为  delete button <a>
							$(this).on('click', function() {
								_self.onDeleteHander(index, this);
							});
						});

						//注册添加按钮事件
						$(this.addButton).on('click', function() {
							_self.onAddHandler(this);
						});

					},

					showForm : function() {

						var servantData = this.servantList[this.currentIndex];

						if (servantData.userName) {
							$(this.userNameText).val(servantData.userName);
						} else {
							$(this.userNameText).val('');
						}
						if (servantData.idType) {
							$(this.idTypeCombo).combobox('setValue', servantData.idType.value);
						} else {
							$(this.idTypeCombo).combobox('setValue', '');
						}
						if (servantData.idNo) {
							$(this.idNoText).val(servantData.idNo);
						} else {
							$(this.idNoText).val('');
						}
						if (servantData.gender) {
							$(this.genderCombo).combobox('setValue', servantData.gender.value);
						} else {
							$(this.genderCombo).combobox('setValue', '');
						}
						if (servantData.birthday) {
							$(this.birthdayPicker).val(servantData.birthday);
						} else {
							$(this.birthdayPicker).val('');
						}
						if (servantData.maritalStatus) {
							$(this.maritalStatusCombo).combobox('setValue', servantData.maritalStatus.value);
						} else {
							$(this.maritalStatusCombo).combobox('setValue', '');
						}

						$(this.insuServantBlock).show();
					}

				};
				Servant.prototype.constructor.prototype = Servant.prototype;

				/*************************************************************************************************/
				/**************<define Servant object/>***********************************************************/
				/*************************************************************************************************/

				/*************************************************************************************************/
				/**************<define Property object>*******************************************************/
				/*************************************************************************************************/
				var Property = function(opts) {
					return new Property.prototype.constructor(opts);
				};

				Property.prototype = {
					propertyData : undefined,
					dateformatter : 'yyyy-MM-dd',
					/*************element****************/
					insuPropertySavedBlock : '#insu_property_saved_block',
					insuPropertySavedBlockInfo : '#insu_property_saved_block div.insu_form_info',
					insuPropertyBlock : '#insu_property_block',
					insuPropertyForm : '#insu_property_form',
					insuPropertySavedTempBlock : '#insu_propertys_saved_temp div.insu_form_row',
					insuPropertysSavedTemp : '',

					/**<地区、省、市、县、详细地址、邮编、建筑类型、投保份数、备注>**/
					provinceCombo : '#insu_property_block div#provinceCombo',
					cityCombo : '#insu_property_block div#cityCombo',
					addressText : '#insu_property_block input#addressText',
					postCodeText : '#insu_property_block input#postCodeText',
					buildTypeCombo : '#insu_property_block div#buildTypeCombo',
					descriptionText : '#insu_property_block input#descriptionText',
					/**<地区、省、市、县、详细地址、邮编、建筑类型、投保份数、备注>**/

					saveButton : '#insu_property_block a#property_save_bt',
					cancelButton : '#insu_property_block a#property_cancel_bt',
					modifyButton : '#insu_property_saved_block a#property_modify_bt',
					deleteButton : '#insu_property_saved_block a#property_delete_bt',
					addButton : '#insu_property_saved_block a#property_add_bt',
					/************************************/

					constructor : function(opts) {
						$.extend(this, opts);
					},
					// 可在这里添加实例方法
					show : function() {
						this.initializing();
					},
					//私有方法
					initializing : function() {
						//初始化控件
						this.initFormElement();

						console.log("Property>>>initializing");
						console.log(this.propertyData);
						//回显数据，或初始化显示
						if (this.propertyData == undefined) {
							this.showSavedInfo();
						} else {
							//回显数据
							this.showSavedInfo();
						}
					},

					initFormElement : function() {

						var _self = this;

						$(this.saveButton).on('click', function() {
							_self.onSaveHander();
						});

						$(this.cancelButton).on('click', function() {
							_self.onCancelHander();
						});

						$(this.provinceCombo).combobox({
							valueField : 'areaId',
							textField : 'areaName',
							editable : false
						});

						$(this.cityCombo).combobox({
							valueField : 'areaId',
							textField : 'areaName',
							editable : false
						});

						$(this.buildTypeCombo).combobox({
							valueField : 'value',
							textField : 'text',
							editable : false,
							panelHeight : 'auto',
							url : taiping.getBasePath() + '/restService/master/dictionary/build_type',
							method : 'get',
							onSelect : function(data) {
							}
						});

						//加载保存人信息的html模版
						this.insuPropertysSavedTemp = $(this.insuPropertySavedTempBlock).html();

						//加载区域信息联动数据
						this.linkageAreaData(this.provinceCombo, 0);

						//注册校验控件
						this.registValidate();

					},

					linkageAreaData : function(linkage, parentId) {

						var _self = this;
						$.ajax({
							url : taiping.getBasePath() + '/restService/master/area/' + parentId,
							success : function(_data) {
								$(linkage).combobox({
									valueField : 'areaId',
									textField : 'areaName',
									editable : false,
									data : _data,
									onSelect : function(data) {
										if (linkage == _self.provinceCombo) {
											_self.linkageAreaData(_self.cityCombo, data.areaId);
										}
									}
								});
							}
						});

					},

					registValidate : function() {
						$(this.insuPropertyForm).validate({
							rules : {
								address : {
									required : true
								},
								postCode : {
									required : true,
									zipCode : true
								}
							},
							errorPlacement : function(error, element) {
								$(element).parent().next().append(error);
							}
						});
					},

					//表单saveData方法中使用的校验方法
					validate : function() {

						console.log("Property>>>validate");
						//校验详细地址
						result = tpValidator.required(this.addressText);
						console.log("validate>>>address:" + result);
						if (result == false) {
							this.propertyData.valid = false;
							return false;
						}

						//校验邮编
						result = tpValidator.zipCode(this.postCodeText, true);
						console.log("validate>>>zipCode:" + result);
						if (result == false) {
							this.propertyData.valid = false;
							return false;
						}

						console.log("Property>>>validate return true");
						this.propertyData.valid = true;
						return true;
					},

					onSaveHander : function() {
						if (this.validate()) {
							this.saveData();
							this.showSavedInfo();
						}
						console.log("Property>>>onSaveHander");
						console.log(this.propertyData);
					},

					onCancelHander : function() {
						if (this.propertyData.valid != false) {
							this.propertyData.saved = true;
						} else {
							//如果对象未保存过 则直接删除
							this.propertyData = undefined;
						}
						console.log("Property>>>onCancelHander");
						console.log(this.propertyData);
						this.showSavedInfo();
					},

					onModifyHander : function() {
						//删除add按钮区域，一次只能修改一个被保人。
						$(this.addButton).parent().remove();
						//隐藏 modify delete按钮
						$(this.modifyButton).each(function(index) {
							//this 为  modify button <a>
							$(this).hide();
						});
						$(this.deleteButton).each(function(index) {
							//this 为  delete button <a>
							$(this).hide();
						});

						//更改未保存状态
						this.propertyData.saved = false;
						console.log("Property>>>onModifyHander");
						console.log(this.propertyData);
						this.showForm();
					},

					onDeleteHander : function() {
						//删除
						this.propertyData = undefined;
						//重新显示
						this.showSavedInfo();
					},

					onAddHandler : function() {
						//删除add按钮区域，一次只能添加一个被保人。
						$(this.addButton).parent().remove();
						//隐藏 modify delete按钮
						$(this.modifyButton).each(function(index) {
							//this 为  modify button <a>
							$(this).hide();
						});
						$(this.deleteButton).each(function(index) {
							//this 为  delete button <a>
							$(this).hide();
						});
						//当前下标加1,增加一个新的对象
						this.propertyData = new Object();
						//对象状态为未保存
						this.propertyData.saved = false;
						this.propertyData.valid = false;

						console.log("Property>>>onAddHandler");
						console.log(this.propertyData);
						this.showForm();
					},

					getData : function() {
						console.log("Property>>>getData");
						console.log(this.propertyData);
						return this.propertyData;
					},

					saveData : function() {
						var _self = this;
						/**<地区、省、市、县、详细地址、邮编、建筑类型、投保份数、备注>**/
						this.propertyData.address = $(this.addressText).val();
						this.propertyData.postCode = $(this.postCodeText).val();
						this.propertyData.description = $(this.descriptionText).val();

						//为了cancel逻辑简单，所以在这里来获取combo的值，而不使用event更改。
						var provinceId = $(this.provinceCombo).combobox('getValue');
						if (provinceId == "") {
							_self.propertyData.province = undefined;
						} else {
							$($(this.provinceCombo).combobox('getData')).each(function() {
								if (this.areaId == provinceId) {
									_self.propertyData.province = this;
								}
							});
						}

						var cityId = $(this.cityCombo).combobox('getValue');
						if (cityId == "") {
							_self.propertyData.city = undefined;
						} else {
							$($(this.cityCombo).combobox('getData')).each(function() {
								if (this.areaId == cityId) {
									_self.propertyData.city = this;
								}
							});
						}

						var buildTypeValue = $(this.buildTypeCombo).combobox('getValue');
						if (buildTypeValue == "") {
							_self.propertyData.buildType = undefined;
						} else {
							$($(this.buildTypeCombo).combobox('getData')).each(function() {
								if (this.value == buildTypeValue) {
									_self.propertyData.buildType = this;
								}
							});
						}

						//对象状态为保存
						this.propertyData.saved = true;
					},

					showSavedInfo : function() {
						//清空后 重新加载
						$(this.insuPropertySavedBlockInfo).empty();
						var infoHTML = "";

						if (this.propertyData) {
							infoHTML = infoHTML + "<div class=\"insu_form_row\">";
							var temp = this.insuPropertysSavedTemp;
							if (this.propertyData.buildType) {
								temp = temp.replace('@buildType', this.propertyData.buildType.text);
							} else {
								//建筑类型非必选项
								temp = temp.replace('@buildType', '');
							}
							if (this.propertyData.province) {
								temp = temp.replace('@province', this.propertyData.province.areaName);
							} else {
								//地区非必选项
								temp = temp.replace('@province', '');
							}
							if (this.propertyData.city) {
								//城市非必选项
								temp = temp.replace('@city', this.propertyData.city.areaName);
							} else {
								temp = temp.replace('@city', '');
							}
							temp = temp.replace('@address', this.propertyData.address);
							temp = temp.replace('@postCode', this.propertyData.postCode);
							temp = temp.replace('@description', this.propertyData.description);
							infoHTML = infoHTML + temp;
							infoHTML = infoHTML + "</div>";
						} else {
							//生成添加按钮
							infoHTML = infoHTML
									+ "<div class=\"insu_form_row\"><a id=\"property_add_bt\" href=\"javascript:void(0);\">添加被保财产信息</a></div>";
						}

						$(this.insuPropertySavedBlockInfo).append(infoHTML);
						$(this.insuPropertyBlock).hide();
						$(this.insuPropertySavedBlock).show();
						//在show后保证div已经被加载到页面
						var _self = this;
						//注册修改按钮事件
						$(this.modifyButton).on('click', function() {
							_self.onModifyHander();
						});
						//注册删除按钮事件
						$(this.deleteButton).on('click', function() {
							_self.onDeleteHander(this);
						});
						//注册添加按钮事件
						$(this.addButton).on('click', function() {
							_self.onAddHandler(this);
						});

					},

					showForm : function() {

						var _self = this;
						if (_self.propertyData.province) {
							//一级数据不会变，无需再次加载数据。
							$(_self.provinceCombo).combobox('setValue', _self.propertyData.province.areaId);
						} else {
							$(_self.provinceCombo).combobox('setValue', '');
						}
						if (_self.propertyData.city) {
							//二级菜单数据重新加载
							$.ajax({
								url : taiping.getBasePath() + '/restService/master/area/'
										+ _self.propertyData.province.areaId,
								success : function(_data) {
									$(_self.cityCombo).combobox({
										data : _data
									});
									$(_self.cityCombo).combobox('setValue', _self.propertyData.city.areaId);
								}
							});
						} else {
							$(_self.cityCombo).combobox('setValue', '');
						}

						if (_self.propertyData.address) {
							$(_self.addressText).val(_self.propertyData.address);
						} else {
							$(this.addressText).val('');
						}
						if (_self.propertyData.postCode) {
							$(_self.postCodeText).val(_self.propertyData.postCode);
						} else {
							$(_self.postCodeText).val('');
						}
						if (_self.propertyData.buildType) {
							$(this.buildTypeCombo).combobox('setValue', _self.propertyData.buildType.value);
						} else {
							$(this.buildTypeCombo).combobox('setValue', '');
						}
						if (_self.propertyData.description) {
							$(_self.descriptionText).val(_self.propertyData.description);
						} else {
							$(_self.descriptionText).val('');
						}

						$(_self.insuPropertyBlock).show();
					}

				};

				Property.prototype.constructor.prototype = Property.prototype;
				/*************************************************************************************************/
				/**************<define Property object/>********************************************************/
				/*************************************************************************************************/

				/*************************************************************************************************/
				/**************<define Quote object>********************************************************/
				/*************************************************************************************************/
				var Quote = function(opts) {
					return new Quote.prototype.constructor(opts);
				};

				Quote.prototype = {
					effectiveDateText : '#insu_quote_block span#effectiveDateText',
					abortDateText : '#insu_quote_block span#abortDateText',
					planCombo : '#insu_quote_block div#planCombo',

					serverDate : undefined,

					quoteData : undefined,

					constructor : function(opts) {
						$.extend(this, opts);
					},
					// 可在这里添加实例方法
					show : function() {
						this.initializing();
					},
					initializing : function() {

						this.initFormElement();

						console.log("Quote>>>initializing");
						console.log(this.quoteData);
						if (this.quoteData == undefined) {
							this.quoteData = new Object();
							this.quoteData.valid = false;
							this.loadServerDate();
							this.showPlanData();
						} else {
							//回显数据
							this.showEffectiveOfDate();
							this.showPlanData();
						}
					},

					initFormElement : function() {
						$(this.planCombo).combobox({});
					},

					loadServerDate : function() {
						var _self = this;
						$.ajax({
							url : taiping.getBasePath() + '/restService/master/serverDate',
							success : function(_data) {
								var dateParts = _data.split('-');
								var date = new Date();
								date.setUTCFullYear(dateParts[0], dateParts[1] - 1, dateParts[2]);
								date.setUTCHours(0, 0, 0, 0);
								_self.serverDate = date;
								_self.quoteData.effectiveDate = _self.serverDate.dateAdd('d', 1).format('yyyy-MM-dd');
								//默认有效期为1年
								_self.quoteData.abortDate = _self.serverDate.dateAdd('y', 1).format('yyyy-MM-dd');
								_self.showEffectiveOfDate();
							},
							error : function() {
								_self.serverDate = new Date();
								_self.quoteData.effectiveDate = _self.serverDate.dateAdd('d', 1).format('yyyy-MM-dd');
								//默认有效期为1年
								_self.quoteData.abortDate = _self.serverDate.dateAdd('y', 1).format('yyyy-MM-dd');
								_self.showEffectiveOfDate();
							}
						});
					},
					showEffectiveOfDate : function() {
						$(this.effectiveDateText).text(this.quoteData.effectiveDate);
						$(this.abortDateText).text(this.quoteData.abortDate);
					},
					showPlanData : function() {
						var _self = this;
						$.ajax({
							url : taiping.getBasePath() + '/restService/master/dictionary/ljwy_product_plan',
							success : function(_data) {
								$(_self.planCombo).combobox({
									valueField : 'value',
									textField : 'text',
									editable : false,
									panelHeight : 'auto',
									data : _data,
									onSelect : function(data) {
										_self.quoteData.plan = data;
									}
								});
								//回显数据
								if (_self.quoteData.plan) {
									$(_self.planCombo).combobox('setValue', _self.quoteData.plan.value);
								}
							}
						});
					},
					validate : function() {
						console.log("Quote>>>validate");

						//校验性别 easyUI combobox
						var result = tpValidator.easyCombo(this.planCombo);
						console.log("validate>>>plan:" + result);
						if (result == false) {
							this.quoteData.valid = false;
							return false;
						}

						console.log("Organization>>>validate return true");
						this.quoteData.valid = true;
						return true;
					},
					getData : function() {
						this.validate();
						console.log("Quote>>>getData");
						console.log(this.quoteData);
						return this.quoteData;
					}
				};
				Quote.prototype.constructor.prototype = Quote.prototype;
				/*************************************************************************************************/
				/**************<define Quote object/>********************************************************/
				/*************************************************************************************************/

				var InsureForm = function(opts) {
					return new InsureForm.prototype.constructor(opts);
				};
				InsureForm.prototype = {
					organization : undefined,
					policyHolder : undefined,
					recognizee : undefined,
					servant : undefined,
					property : undefined,
					quote : undefined,

					/****<回显数据>****/
					echoDataDom : '#echo_data',
					organData : undefined, //投保机构回显数据
					policyHolderData : undefined,//投保人回显数据
					recognizeeList : new Array(),//被保人回显数据
					servantList : new Array(),//家庭雇员回显数据
					propertyData : undefined,//家庭财产回显数据
					quoteData : undefined,
					/****<回显数据/>****/

					constructor : function(opts) {
						$.extend(this, opts);
						this.initializing();
					},

					initializing : function() {
						this.loadEchoData();
					},

					//加载回显数据
					loadEchoData : function() {
						console.log("InsureForm>>>echoInsureData");
						var echoDataJson = $(this.echoDataDom).text();
						var echoDataObj = undefined;
						if (echoDataJson != "") {
							//回显数据不为空时，执行回显操作
							echoDataObj = $.parseJSON(echoDataJson);
							console.log(echoDataObj);
							/**********************************************************************投保机构**/
							this.organData = {
								area : {
									areaId : echoDataObj.organization.areaId,
									areaName : echoDataObj.organization.areaName,
									organId : echoDataObj.organization.organId
								},
								organ : {
									areaId : echoDataObj.organization.children[0].areaId,
									areaName : echoDataObj.organization.children[0].areaName,
									organId : echoDataObj.organization.organId
								}
							};
							/**********************************************************************投保机构**/
							/**********************************************************************投保人**/
							this.policyHolderData = {
								saved : true,
								valid : true,
								userName : echoDataObj.insurer.custName,
								gender : echoDataObj.insurer.gender,
								idType : echoDataObj.insurer.idType,
								idNo : echoDataObj.insurer.idNo,
								birthday : echoDataObj.insurer.birthday,
								occupType : echoDataObj.insurer.occupType,
								occupName : echoDataObj.insurer.occupName,
								occupWork : echoDataObj.insurer.occupWork,
								mobile : echoDataObj.insurer.mobile,
								email : echoDataObj.insurer.email
							};
							/**********************************************************************投保人**/
							/**********************************************************************被保人**/
							for ( var index in echoDataObj.recognizees) {
								var recognizee = echoDataObj.recognizees[index];
								var insurer = undefined;
								if (recognizee.relation.value != 4) {
									insurer = {
										saved : true,
										valid : true,
										isFree : recognizee.isFree,
										relation : recognizee.relation,
										userName : recognizee.custName,
										idType : recognizee.idType,
										idNo : recognizee.idNo,
										gender : recognizee.gender,
										birthday : recognizee.birthday,
										maritalStatus : recognizee.maritalStatus,
										isWorked : recognizee.isWorked,
										occupType : recognizee.occupType,
										occupName : recognizee.occupName,
										occupWork : recognizee.occupWork
									};
									//添加到被保人数据中
									this.recognizeeList.push(insurer);
								} else {
									//relation=4时为家庭雇员信息
									insurer = {
										saved : true,
										valid : true,
										userName : recognizee.custName,
										idType : recognizee.idType,
										idNo : recognizee.idNo,
										gender : recognizee.gender,
										birthday : recognizee.birthday,
										maritalStatus : recognizee.maritalStatus
									};
									//添加到被保人-雇员数据中
									this.servantList.push(insurer);
								}
							}
							/**********************************************************************被保人**/

							/**********************************************************************被保财产**/
							this.propertyData = {
								buildType : echoDataObj.property.buildType,
								province : echoDataObj.property.province,
								city : echoDataObj.property.city,
								address : echoDataObj.property.address,
								postCode : echoDataObj.property.postCode,
								description : echoDataObj.property.description
							};
							/**********************************************************************被保财产**/

							/**********************************************************************报价**/
							this.quoteData = {
								effectiveDate : echoDataObj.effectiveDate,
								abortDate : echoDataObj.abortDate,
								plan : echoDataObj.goodType
							};
							/**********************************************************************报价**/
						}
					},

					show : function() {
						//机构
						this.organization = new Organization({
							organData : this.organData
						});
						this.organization.show();

						//投保人
						this.policyHolder = new PolicyHolder({
							policyHolderData : this.policyHolderData
						});
						this.policyHolder.show();

						var _self = this;
						//被保人
						this.recognizee = new Recognizee({
							recognizeeList : this.recognizeeList,
							policyHolder : _self.policyHolder
						});
						this.recognizee.show();

						//被保家庭雇员
						this.servant = new Servant({
							servantList : this.servantList
						});
						this.servant.show();

						//被保财产
						this.property = new Property({
							propertyData : this.propertyData
						});
						this.property.show();

						//报价
						this.quote = new Quote({
							quoteData : this.quoteData
						});
						this.quote.show();
					},

					//获取投保地区数据
					getOrganizationData : function() {
						var data = this.organization.getData();
						return data;
					},

					//获取投保人数据
					getPolicyHolderData : function() {
						var data = this.policyHolder.getData();
						return data;
					},

					//获取被保人数据
					getRecognizeeData : function() {
						var data = this.recognizee.getData();
						return data;
					},

					//获取家庭雇员投保数据
					getServantData : function() {
						var data = this.servant.getData();
						return data;
					},

					//获取财产投保数据
					getPropertyData : function() {
						var data = this.property.getData();
						return data;
					},
					//获取财产投保数据
					getQuoteData : function() {
						var data = this.quote.getData();
						return data;
					}

				};
				InsureForm.prototype.constructor.prototype = InsureForm.prototype;

				return InsureForm;
			});
})(window);