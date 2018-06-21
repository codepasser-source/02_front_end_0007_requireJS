/**
 * @author MattDamon ChengYangyang.NEUSOFT
 * 2013-08-12
 */
require([ "easyUI/easyui.core", "jQueryUI/jquery.ui.core.min", "taiping/common/json2",
		"i18n!taiping/locale/nls/Language", "taiping/widget/jwy/insureForm" ], function(undefined, undefined,
		undefined, language, InsureForm) {

	/** **************************************************************************** */
	/** *************************COMMON********************************************* */
	/** **************************************************************************** */
	// 设置title
	document.title = language.JWY.labelSet.title;
	/** **************************************************************************** */
	/** *************************COMMON********************************************* */
	/** **************************************************************************** */

	//创建Form对象
	var insureForm = new InsureForm();
	insureForm.show();

	//表单数据对象
	var infoBean = null;

	//edit form初始化
	initializing = function() {
		console.log("initializing>>>");
		//计算报价
		$("#insu_form_footer a#insure_quote_bt").on('click', function() {
			console.log("insure_quote_bt>>>onClick");
			//组装InsureEditWebService数据
			infoBean = null;
			infoBean = loadFormData.call();
			//infoBean为null时则为校验失败
			if (infoBean != null) {
				console.log("loadFormData>>>infoBean");
				console.log(infoBean);
				//隐藏
				$(this).hide();
				//显示下一步
				$("#insu_form_footer span#total").text(infoBean.totalPrices);
				$("#insu_form_footer a#insure_submit_bt").show();
			}
		});

		//注册提交按钮事件
		$("#insu_form_footer a#insure_submit_bt").on('click', function() {
			console.log("insure_submit_bt>>>onClick");
			console.log("submitFormData>>>infoBean");
			console.log(infoBean);
			//数据有效时提交
			submitFormData(infoBean);
		});
	};
	//调用
	initializing.call();

	//加载表单数据，返回null时则为校验失败
	loadFormData = function() {

		var infoBean = new Object();

		//如果有未被保存的或校验未通过的数据 return
		/*******<投保机构数据>************************************************************************/
		var organizationData = insureForm.getOrganizationData();
		if (organizationData.valid == false) {
			alert("请选择投保地区!");
			return null;
		}
		//alert(organizationData.area.organName + "-" + organizationData.organ.organName);
		infoBean.organization = {
			areaId : organizationData.area.areaId,
			areaName : organizationData.area.areaName,
			organId : organizationData.area.organId,
			children : [ {
				areaId : organizationData.organ.areaId,
				areaName : organizationData.organ.areaName,
				organId : organizationData.organ.organId
			} ]
		};
		/*******<投保机构数据/>************************************************************************/

		/*******<投保人数据>************************************************************************/
		var policyHolderData = insureForm.getPolicyHolderData();
		if (policyHolderData.saved == false) {
			alert("投保人信息未保存，请先保存！");
			return null;
		}
		infoBean.insurer = {
			custName : policyHolderData.userName,
			//投保人 ：0 投保人  1  被保人：3 购买人
			custType : 0,
			//5.self.本人|1.mate.配偶|2.child.子女|3.parent.父母|4.servant.家庭雇员
			relation : {
				value : 5,
				text : "本人"
			},
			//1.male.男|2.female.女
			gender : policyHolderData.gender,
			birthday : policyHolderData.birthday,
			//1.SFZ.身份证|2.JRZ.军人证|3.HZ.护照|5.HKB.户口本|6.GZZ.工作证|9.OTHER.其他
			idType : policyHolderData.idType,
			idNo : policyHolderData.idNo,
			//职业类别 ： 0 未工作
			occupType : policyHolderData.occupType,
			//职业类别 ： 0 未工作
			occupName : policyHolderData.occupName,
			//职业类别 ： 0 未工作
			occupWork : policyHolderData.occupWork,
			mobile : policyHolderData.mobile,
			email : policyHolderData.email
		};
		/*******<投保人数据/>************************************************************************/

		/*******<被保人数据>************************************************************************/
		var insuList = new Array();
		//被投保人数据
		var recogList = insureForm.getRecognizeeData();
		if (recogList.length == 0) {
			alert("请填写被保人信息！");
			return null;
		}
		for ( var index in recogList) {
			var recogTemp = recogList[index];

			if (recogTemp.saved == false) {
				alert("被保人信息未保存，请先保存！");
				return null;
			}

			var recog = {
				custName : recogTemp.userName,
				//投保人 ：0 投保人  1  被保人：3 购买人
				custType : 1,
				//5.self.本人|1.mate.配偶|2.child.子女|3.parent.父母|4.servant.家庭雇员
				relation : recogTemp.relation,
				gender : recogTemp.gender,
				birthday : recogTemp.birthday,
				//1.SFZ.身份证|2.JRZ.军人证|3.HZ.护照|5.HKB.户口本|6.GZZ.工作证|9.OTHER.其他
				idType : recogTemp.idType,
				idNo : recogTemp.idNo,
				//职业类别 ： 0 工作 1未工作
				isWorked : recogTemp.isWorked,
				occupType : recogTemp.occupType,
				occupName : recogTemp.occupName,
				occupWork : recogTemp.occupWork,
				maritalStatus : recogTemp.maritalStatus
			};
			insuList.push(recog);
		} // end for

		//家庭雇员数据
		var servantList = insureForm.getServantData();
		for ( var index in servantList) {

			var servantTemp = servantList[index];

			if (servantTemp.saved == false) {
				alert("家庭雇员信息未保存，请先保存！");
				return null;
			}

			var servant = {
				custName : servantTemp.userName,
				//投保人 ：0 投保人  1  被保人：3 购买人
				custType : 1,
				//5.self.本人|1.mate.配偶|2.child.子女|3.parent.父母|4.servant.家庭雇员
				relation : {
					value : 4,
					text : "家庭雇员"
				},
				gender : servantTemp.gender,
				birthday : servantTemp.birthday,
				//1.SFZ.身份证|2.JRZ.军人证|3.HZ.护照|5.HKB.户口本|6.GZZ.工作证|9.OTHER.其他
				idType : servantTemp.idType,
				idNo : servantTemp.idNo,
				maritalStatus : servantTemp.maritalStatus
			};
			insuList.push(servant);
		} // end for

		//将被保人数据添加到infoBean
		infoBean.recognizees = insuList;
		/*******<被保人数据/>************************************************************************/

		/*******<被保财产数据>************************************************************************/

		//被保财产数据
		var propData = insureForm.getPropertyData();
		if (propData == undefined) {
			alert("请填写被保财产信息！");
			return null;
		}

		if (propData.saved == false) {
			alert("被保财产信息未保存，请先保存！");
			return null;
		}

		var prop = {
			province : propData.province,
			city : propData.city,
			//地址信息
			address : propData.address,
			postCode : propData.postCode,
			buildType : propData.buildType,
			description : propData.description
		};

		//将被保人数据添加到infoBean
		infoBean.property = prop;
		/*******<被保财产数据/>************************************************************************/

		/*******<报价，总价数据>************************************************************************/
		//<生效日期数据>
		//默认为当前系统时间
		//生效日期默认为次日生效
		var quoteData = insureForm.getQuoteData();

		if (quoteData.valid == false) {
			alert("请选择产品计划");
			return null;
		}
		infoBean.effectiveDate = quoteData.effectiveDate;
		//截至日期数据
		//默认有效期为1年
		infoBean.abortDate = quoteData.abortDate;
		infoBean.goodType = quoteData.plan;
		//投保份数固定1份
		infoBean.insureNum = 1;
		infoBean.goodName = "乐家无忧";
		//报价，总价
		if (quoteData.plan.value == 1) {//经济版
			infoBean.totalPrices = 680.00;
		} else if (quoteData.plan.value == 2) {//高端版
			infoBean.totalPrices = 1380.00;
		} else if (quoteData.plan.value == 3) {//豪华版
			infoBean.totalPrices = 2680.00;
		}
		/*******<报价，总价数据/>************************************************************************/

		return infoBean;
	};

	//提交数据
	submitFormData = function(infoBean) {
		console.log("submitData>>>");
		var infoBeanJson = JSON.stringify(infoBean);
		$.ajax({
			type : 'post',
			url : taiping.getBasePath() + '/jwy/insureInfo.action',
			contentType : 'application/x-www-form-urlencoded; charset=UTF-8',//'application/json',
			data : "infoBeanJson=" + infoBeanJson,
			dataType : "json",
			cache : false,
			success : function(_data) {
				//提交之后进入确认画面
				window.location.href = taiping.getBasePath() + "/jwy/insureConfirm.action";
			},
			error : function() {
				alert("连接服务器失败");
			}
		});
	};

});
