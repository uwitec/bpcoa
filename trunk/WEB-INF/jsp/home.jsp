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
	
	// 处理初始打开模块、视图或文档（与IM整合）
	JsonObject openParams = null;
	obj = request.getAttribute("openParams");
	if(obj == null){
		openParams = new JsonObject();
	}else{
		openParams = (JsonObject)obj;
	}
%>
<html>
	<head>
		<link rel="shortcut icon" href="resources/images/logo/16.gif"/>
		<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
		<title><%=applicationName%> (<%=username%>)</title>
		<!-- Ext Css -->
		<link rel="stylesheet" type="text/css" href="dependences/ext-3.1.1/resources/css/ext-all.css"/>
		<!-- Ext Include -->
		<script type="text/javascript" src="dependences/ext-3.1.1/adapter/ext/ext-base-debug.js"></script>
		<script type="text/javascript" src="dependences/ext-3.1.1/ext-all-debug.js"></script>
		<script type="text/javascript" src="dependences/ext-3.1.1/src/locale/ext-lang-zh_CN.js"></script>
		<script type="text/javascript" src="resources/js/api-debug.js"></script>
		<!-- FckEditor Include -->
		<script type="text/javascript" src="dependences/fckeditor/fckeditor.js"></script>
		
		<script type="text/javascript" charset="utf-8" src="dependences/kindeditor/kindeditor.js"></script>
		<script type="text/javascript" charset="utf-8" src="dependences/kindeditor/lang/zh_CN.js"></script>
				
		
		<!-- SWFUpload Include -->
		<script type="text/javascript" src="dependences/swfupload/swfupload.js"></script>		
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
		<script type="text/javascript" src="resources/ux/fckeditor/ext.ux.fckeditor.js"></script>
		<script type="text/javascript" src="resources/ux/datetimefield/datetimefield.js"></script>
		
		<script type="text/javascript" src="dependences/googlechart/jsapi"></script>
		<script type="text/javascript" src="dependences/googlechart/default,orgchart.I.js"></script>
		<script type="text/javascript" src="resources/ux/chart/GVisualizationPanel.js"></script>
		<link rel="stylesheet" type="text/css" href="dependences/googlechart/orgchart.css"/>
		
		<!-- Ext ux Css -->
		<link rel="stylesheet" type="text/css" href="resources/ux/portal/portal.css"/>
		<link rel="stylesheet" type="text/css" href="resources/ux/roweditor.3.1.1/roweditor.css"/>
		<link rel="stylesheet" type="text/css" href="resources/ux/colorpicker/colorpicker.css"/>
		<link rel="stylesheet" type="text/css" href="resources/ux/pagerbar/panelresizer.css"/>
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
		<script type="text/javascript" src="resources/js/editor/mixky.deptusermultiselectfield.js"></script>
		<script type="text/javascript" src="resources/js/editor/mixky.textbox.js"></script>
		<script type="text/javascript" src="resources/js/editor/mixky.checkboxgroup.js"></script>
		<script type="text/javascript" src="resources/js/editor/mixky.radiogroup.js"></script>
		<script type="text/javascript" src="resources/js/editor/mixky.filefield.js"></script>
		<link rel="stylesheet" type="text/css" href="resources/js/editor/mixky.user.selector.css"/>
		<script type="text/javascript" src="resources/js/editor/mixky.organization.window.field.js"></script>
		<script type="text/javascript" src="resources/js/editor/mixky.opinion.field.js"></script>
		<script type="text/javascript" src="resources/js/editor/mixky.handsign.field.js"></script>
		<script type="text/javascript" src="resources/js/plugin/mixky.favorite.column.js"></script>
		<script type="text/javascript" src="resources/js/editor/mixky.combo.view.js"></script>
		<script type="text/javascript" src="resources/js/editor/mixky.emailaddress.js"></script>
		<!-- Mixky Plugin -->

		<!-- Calender Plugin -->
		<script type="text/javascript" src="resources/js/plugin/mixky.editor.rownumberer.js"></script>
		<script type="text/javascript" src="resources/js/plugin/mixky.upload.button.js"></script>
		<script type="text/javascript" src="resources/js/plugin/calendar/common/RepeatType.js"></script>
		<script type="text/javascript" src="resources/js/plugin/calendar/common/Mask.js"></script>
		<script type="text/javascript" src="resources/js/plugin/calendar/mixky.calendar.ds.js"></script>
		<script type="text/javascript" src="resources/js/plugin/calendar/mixky.calendar.js"></script>
		<link rel="stylesheet" type="text/css" href="resources/js/plugin/calendar/css/calendar_core.css"/>
		<!-- Calender Plugin -->

		<!-- Gantt Plugin-->
		<link rel="stylesheet" type="text/css" href="resources/ux/lockinggridview/LockingGridView.css"/>
		<script type="text/javascript" src="resources/ux/lockinggridview/LockingGridView.js"></script>

		<link rel="stylesheet" type="text/css" href="resources/ux/spinner/Spinner.css"/>
		<script type="text/javascript" src="resources/ux/spinner/Spinner.js"></script>
		<script type="text/javascript" src="resources/ux/spinner/SpinnerField.js"></script>

		<link rel="stylesheet" type="text/css" href="dependences/gantt/css/mixky.gantt.all.css"/>
		<link rel="stylesheet" type="text/css" href="dependences/gantt/css/gantt.css"/>
		<script type="text/javascript" src="dependences/gantt/mixky.gantt.base.js"></script>
		<script type="text/javascript" src="dependences/gantt/mixky.gantt.eval.js"></script>
		<script type="text/javascript" src="dependences/gantt/mixky.overrides.js"></script>
		<!-- 审阅意见 -->
		<script type="text/javascript" src="resources/js/editor/mixky.reader.signlog.field.js"></script>
		<script type="text/javascript" src="resources/js/editor/mixky.kindeditor.js"></script>
		<!-- Gantt Plugin-->
		
		<!-- TreeGrid Plugin-->
        <link rel="stylesheet" type="text/css" href="resources/ux/treegrid.3.1.1/treegrid.css" rel="stylesheet" />
        
        <script type="text/javascript" src="resources/ux/treegrid.3.1.1/TreeGridSorter.js"></script>
        <script type="text/javascript" src="resources/ux/treegrid.3.1.1/TreeGridColumnResizer.js"></script>
        <script type="text/javascript" src="resources/ux/treegrid.3.1.1/TreeGridNodeUI.js"></script>
        <script type="text/javascript" src="resources/ux/treegrid.3.1.1/TreeGridLoader.js"></script>
        <script type="text/javascript" src="resources/ux/treegrid.3.1.1/TreeGridColumns.js"></script>
        <script type="text/javascript" src="resources/ux/treegrid.3.1.1/TreeGrid.js"></script>
		<!-- TreeGrid Plugin-->
		<link rel="stylesheet" type="text/css" href="resources/css/mixky.bpcoa.css"/>

		<script type="text/javascript" src="resources/js/flex/mixky.flex.js"></script>
		<script type="text/javascript" src="resources/js/flex/FABridge.js"></script>

		<!-- Mixky Include -->
		<script type="text/javascript" src="resources/js/mixky.lib.js"></script>

		<!-- Sets the basepath for the library if not in same directory -->
		<script type="text/javascript">
			mxLanguage = 'none';
			mxBasePath = 'dependences/mxgraph/src';
		</script>

		<!-- Loads and initiaizes the library -->
		<script type="text/javascript" src="dependences/mxgraph/mxclient.1.4.0.9.js"></script>

		<script language=javascript>
			Ext.namespace("Mixky.app");
			Mixky.app.UserInfo = <%=userJson%>;
		</script>
		<script type="text/javascript" src="resources/docs/helps/help.plugin.js"></script>
		<script type="text/javascript" src="framework/mixky.app.dictionarys.js"></script>
		<script type="text/javascript" src="framework/mixky.app.common.js"></script>
		<script type="text/javascript" src="framework/mixky.app.actions.js"></script>
		<script type="text/javascript" src="framework/mixky.app.modules.js"></script>
		<script type="text/javascript" src="framework/mixky.app.documents.js"></script>
		<script type="text/javascript" src="framework/mixky.app.views.js"></script>
		<script type="text/javascript" src="framework/mixky.app.menus.js"></script>
		
		<script type="text/javascript" src="framework/desktop/mixky.desktop.js"></script>
		<script type="text/javascript" src="framework/desktop/mixky.desktop.<%=uimode%>.js"></script>
		<script type="text/javascript" src="framework/engine/mixky.app.module.js"></script>
		<script type="text/javascript" src="framework/engine/mixky.app.document.js"></script>
		<script type="text/javascript" src="framework/mixky.app.workflow.js"></script>
		<script type="text/javascript" src="framework/mixky.app.js"></script>

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
MixkyApp = new Mixky.app.App({
	userMenus:<%=usermenus%>, 
	userConfig : <%=userconfig.toString()%>,
	openParams : <%=openParams.toString()%>
});
</script>