<%@page contentType="text/html; charset=utf-8"%>
<%@ page import="com.google.gson.JsonObject"%>
<%@ page import="com.google.gson.JsonArray"%>
<%@ page import="com.mixky.engine.organization.User"%>
<%
	String applicationName = "";
	String username = "";
	String userlogin = "";
	JsonObject userconfig = null;
	JsonArray usermenus = null;

	JsonObject userJson = new JsonObject() ;
	
	User user = (User)request.getAttribute("user");
	userJson.addProperty("id", user.getId());
	userJson.addProperty("name", user.getF_caption());
	userJson.addProperty("login", user.getF_name());
	userJson.addProperty("deptid", user.getF_dept_id());
	userJson.addProperty("deptname", user.getF_dept_name());
	userJson.addProperty("type", user.getF_type());
	
	Object obj = request.getAttribute("f_name");
	if(obj != null){
		username = String.valueOf(obj);
	}
	obj = request.getAttribute("f_login");
	if(obj != null){
		userlogin = String.valueOf(obj);
	}
	obj = request.getAttribute("userconfig");
	if(obj != null){
		userconfig = (JsonObject)(obj);
	}
	obj = request.getAttribute("usermenus");
	if(obj != null){
		usermenus = (JsonArray)(obj);
	}
	obj = request.getAttribute("applicationName");
	if(obj != null){
		applicationName = String.valueOf(obj);
	}
	String uimode = userconfig.get("uimode").getAsString();
%>
<html>
	<head>
		<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
		<title><%=applicationName%> (<%=username%>)</title>
		<!-- Ext Css -->
		<link rel="stylesheet" type="text/css" href="dependences/ext-3.1.1/resources/css/ext-all.css"/>
		<!-- Ext Include -->
		<script type="text/javascript" src="dependences/ext-3.1.1/adapter/ext/ext-base.js"></script>
		<script type="text/javascript" src="dependences/ext-3.1.1/ext-all.js"></script>
		<script type="text/javascript" src="dependences/ext-3.1.1/src/locale/ext-lang-zh_CN.js"></script>
		<script type="text/javascript" src="resources/js/api.js"></script>
		<!-- FckEditor Include -->
		<script type="text/javascript" src="dependences/fckeditor/fckeditor.js"></script>
		<!-- SWFUpload Include -->
		<script type="text/javascript" src="dependences/swfupload/swfupload.js"></script>		
		<script type="text/javascript" charset="utf-8" src="dependences/kindeditor/kindeditor.js"></script>
		<script type="text/javascript" charset="utf-8" src="dependences/kindeditor/lang/zh_CN.js"></script>
		<!--Flex Page Include -->
		<script type="text/javascript" src="dependences/flexpage/1.4.2/js/flexpaper_flash_debug.js"></script>
				
		<!-- Ext ux Include -->
		<script type="text/javascript" src="resources/ux/portal/portlet.js"></script>
		<script type="text/javascript" src="resources/ux/portal/portalcolumn.js"></script>
		<script type="text/javascript" src="resources/ux/portal/portal.js"></script>
		<script type="text/javascript" src="resources/ux/roweditor.3.1.1/roweditor.js"></script>
		<script type="text/javascript" src="resources/ux/hexfield/hexfield.js"></script>
		<script type="text/javascript" src="resources/ux/colorpicker/colorpicker.js"></script>
		<script type="text/javascript" src="resources/ux/tabclosemenu/tabclosemenu.js"></script>
		<script type="text/javascript" src="resources/ux/pagerbar/progressbarpager.js"></script>
		<script type="text/javascript" src="resources/ux/pagerbar/panelresizer.js"></script>
		<script type="text/javascript" src="resources/ux/pagerbar/pagingrownumberer.js"></script>
		<script type="text/javascript" src="resources/ux/dataviewmore/dataviewmore.js"></script>
		<script type="text/javascript" src="resources/ux/uploaddialog/ext.ux.uploaddialog.js"></script>
		<script type="text/javascript" src="resources/ux/fckeditor/ext.ux.fckeditor.js"></script>
		<script type="text/javascript" src="resources/ux/datetimefield/datetimefield.js"></script>
		<script type="text/javascript" src="resources/ux/uploaddialog/ext.swf.uploaddialog.js"></script>
		
		<script type="text/javascript" src="http://www.google.com/jsapi"></script>
		<script type="text/javascript" src="resources/ux/chart/GVisualizationPanel.js"></script>
		
		<!-- Ext ux Css -->
		<link rel="stylesheet" type="text/css" href="resources/ux/portal/portal.css"/>
		<link rel="stylesheet" type="text/css" href="resources/ux/roweditor.3.1.1/roweditor.css"/>
		<link rel="stylesheet" type="text/css" href="resources/ux/colorpicker/colorpicker.css"/>
		<link rel="stylesheet" type="text/css" href="resources/ux/pagerbar/panelresizer.css"/>
		<link rel="stylesheet" type="text/css" href="resources/js/editor/mixky.user.selector.css"/>
		<link rel="stylesheet" type="text/css" href="resources/ux/fileupload/file-upload.css"/>
		<link rel="stylesheet" type="text/css" href="resources/ux/datetimefield/css/datetimefield.css"/>
		<!-- Mixky Css -->
		<link rel="stylesheet" type="text/css" href="resources/css/mixky.app.css"/>
		<link rel="stylesheet" type="text/css" href="resources/css/mixky.icon.css"/>
		<link rel="stylesheet" type="text/css" href="resources/css/mixky.report.css"/>
		<link rel="stylesheet" type="text/css" href="framework/desktop/desktop.<%=uimode%>.css"/>
		<!-- Mixky Editor -->
		<script type="text/javascript" src="resources/js/editor/mixky.display.js"></script>
		<script type="text/javascript" src="resources/js/editor/mixky.paneltriggerfield.js"></script>
		<script type="text/javascript" src="resources/js/editor/mixky.depttreefield.js"></script>
		<script type="text/javascript" src="resources/js/editor/mixky.combo.treefield.js"></script>
		<script type="text/javascript" src="resources/js/editor/mixky.pathselectfield.js"></script>
		<script type="text/javascript" src="resources/js/editor/mixky.deptusermultiselectfield.js"></script>
		<script type="text/javascript" src="resources/js/editor/mixky.upload.field.js"></script>
		<script type="text/javascript" src="resources/js/editor/fileupload.field.js"></script>
		<script type="text/javascript" src="resources/js/editor/mutifileupload.field.js"></script>
		<script type="text/javascript" src="resources/js/editor/mixky.textbox.js"></script>
		<script type="text/javascript" src="resources/js/editor/mixky.checkboxgroup.js"></script>
		<script type="text/javascript" src="resources/js/editor/mixky.radiogroup.js"></script>
		<script type="text/javascript" src="resources/js/editor/mixky.sysfiles.js"></script>
		<script type="text/javascript" src="resources/js/editor/mixky.upload.field.js"></script>
		<script type="text/javascript" src="resources/js/editor/mixky.emailaddress.js"></script>
		<script type="text/javascript" src="resources/js/editor/mixky.organization.window.field.js"></script>
		<script type="text/javascript" src="resources/js/editor/mixky.opinion.field.js"></script>
		<script type="text/javascript" src="resources/js/editor/mixky.handsign.field.js"></script>
		<script type="text/javascript" src="resources/js/plugin/mixky.favorite.column.js"></script>
		<script type="text/javascript" src="resources/js/editor/mixky.combo.face.js"></script>
		<script type="text/javascript" src="resources/js/editor/mixky.combo.view.js"></script>
		<script type="text/javascript" src="resources/js/editor/mixky.opinion.field.qhoa.js"></script>
		<!-- 审阅意见 -->
		<script type="text/javascript" src="resources/js/editor/mixky.reader.signlog.field.js"></script>
		<script type="text/javascript" src="resources/js/editor/mixky.kindeditor.js"></script>
		<!-- Mixky Plugin -->

		<!-- Calender Plugin -->
		<script type="text/javascript" src="resources/js/plugin/calendar/common/RepeatType.js"></script>
		<script type="text/javascript" src="resources/js/plugin/calendar/common/Mask.js"></script>
		<script type="text/javascript" src="resources/js/plugin/calendar/mixky.calendar.ds.js"></script>
		<script type="text/javascript" src="resources/js/plugin/calendar/mixky.calendar.js"></script>
		<link rel="stylesheet" type="text/css" href="resources/js/plugin/calendar/css/calendar_core.css"/>
		<!-- Calender Plugin -->

		<script type="text/javascript" src="resources/js/flex/mixky.flex.js"></script>
		<script type="text/javascript" src="resources/js/flex/FABridge.js"></script>

		<!-- Mixky Include -->
		<script type="text/javascript" src="resources/js/mixky.lib.js"></script>
		<!-- Sets the basepath for the library if not in same directory -->
		<script type="text/javascript">
			mxBasePath = 'dependences/mxgraph/src';
		</script>
		<!-- Loads and initiaizes the library -->
		<script type="text/javascript" src="dependences/mxgraph/mxclient.1.4.0.9.js"></script>

		<script language=javascript>
			Ext.namespace("Mixky.app");
			Mixky.app.UserInfo = <%=userJson%>;
		</script>
		<script type="text/javascript" src="framework/mixky.framework.min.js"></script>
		<script type="text/javascript" src="framework/mixky.desktop.<%=uimode%>.min.js"></script>

	</head>
	<body scroll="no">
	<div id="loading-mask"></div>
	<div id="loading">
		<div class="loading-indicator">正在装载应用...</div>
	</div>
	</body>
</html>
<script language=javascript>
// 初始化资源路径
Ext.BLANK_IMAGE_URL = 'dependences/ext-3.1.1/resources/images/default/s.gif';
Ext.chart.Chart.CHART_URL = 'dependences/ext-3.1.1/resources/charts.swf';

// 创建应用
MixkyApp = new Mixky.app.App({userMenus:<%=usermenus%>, userConfig : <%=userconfig.toString()%>});

// 隐藏装载界面
setTimeout(function() {
    Ext.get('loading').remove();
    Ext.get('loading-mask').fadeOut({remove:true});
}, 250);

</script>