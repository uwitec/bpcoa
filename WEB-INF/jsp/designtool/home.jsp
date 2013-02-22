<%@page contentType="text/html; charset=utf-8"%>
<%
	String applicationName = "创想天空协作平台";
	Object obj = request.getAttribute("applicationName");
	if (obj != null){
		applicationName = String.valueOf(obj);
	}
%>
<script>
	var _globe_ApplicationName_ = '<%=applicationName%>';
</script>
<html>
	<head>
		<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
		<title><%=applicationName%> - 开发管理工具</title>

		<link rel="stylesheet" type="text/css" href="../dependences/ext-3.1.1/resources/css/ext-all.css"/>
		
		<link rel="stylesheet" type="text/css" href="designtool.css"/>
		<link rel="stylesheet" type="text/css" href="designtool.icon.css"/>

		<link rel="stylesheet" type="text/css" href="../resources/js/editor/mixky.user.selector.css"/>
		<link rel="stylesheet" type="text/css" href="../resources/ux/roweditor.3.1.1/roweditor.css"/>


		<script type="text/javascript" src="../dependences/ext-3.1.1/adapter/ext/ext-base.js"></script>
		<script type="text/javascript" src="../dependences/ext-3.1.1/ext-all-debug.js"></script>
		<script type="text/javascript" src="../dependences/ext-3.1.1/src/locale/ext-lang-zh_CN.js"></script>
		<script type="text/javascript" src="api.js"></script>
		
		<!-- SWFUpload Include -->
		<script type="text/javascript" src="../dependences/swfupload/swfupload.js"></script>		

		<script type="text/javascript" src="../resources/js/editor/mixky.paneltriggerfield.js"></script>
		<script type="text/javascript" src="../resources/js/editor/mixky.textbox.js"></script>
		<script type="text/javascript" src="../resources/js/editor/mixky.organization.js"></script>
		<script type="text/javascript" src="../resources/js/editor/mixky.designobject.js"></script>
		<script type="text/javascript" src="../resources/js/editor/mixky.jsonobject.js"></script>
		<script type="text/javascript" src="../resources/js/editor/mixky.user.selector.js"></script>

		<script type="text/javascript" src="../resources/js/plugin/mixky.propertygrid.js"></script>
		<script type="text/javascript" src="../resources/js/plugin/mixky.rowordercolumn.js"></script>
		<script type="text/javascript" src="../resources/js/plugin/mixky.editor.rownumberer.js"></script>
		<script type="text/javascript" src="../resources/js/plugin/mixky.organization.window.js"></script>
		<script type="text/javascript" src="../resources/ux/roweditor.3.1.1/roweditor.js"></script>
		<script type="text/javascript" src="../resources/ux/tabclosemenu/tabclosemenu.js"></script>
		<script type="text/javascript" src="../resources/ux/dataviewmore/dataviewmore.js"></script>
		<script type="text/javascript" src="../resources/ux/checkcolumn/checkcolumn.js"></script>
		<script type="text/javascript" src="../resources/ux/uploaddialog/ext.swf.uploaddialog.js"></script>
		
		<script type="text/javascript" src="../dependences/googlechart/jsapi"></script>
		<script type="text/javascript" src="../dependences/googlechart/default,orgchart.I.js"></script>
		<link rel="stylesheet" type="text/css" href="../dependences/googlechart/orgchart.css"/>
		<script type="text/javascript" src="../resources/ux/chart/GVisualizationPanel.js"></script>

		<script type="text/javascript" src="../resources/js/mixky.lib.js"></script>
		<script type="text/javascript" src="designtool.lib.js"></script>
		<script type="text/javascript" src="designtool.context.js"></script>
		<script type="text/javascript" src="designtool.head.js"></script>
		<script type="text/javascript" src="designtool.tree.js"></script>
		<script type="text/javascript" src="designtool.main.js"></script>
		<script type="text/javascript" src="designtool.js"></script>
		<script type="text/javascript" src="designtool.action.js"></script>
		<script type="text/javascript" src="designtool.class.js"></script>

		<!-- Sets the basepath for the library if not in same directory -->
		<script type="text/javascript">
			mxBasePath = '../dependences/mxgraph/src';
		</script>

		<!-- Loads and initiaizes the library -->
		<script type="text/javascript" src="../dependences/mxgraph/mxclient.1.4.0.9.js"></script>

	</head>
	<body>
		
		<div id="loading-mask" style=""></div>
		<div id="loading">
			<div class="loading-indicator"><img src="extanim32.gif" width="32" height="32" style="margin-right:8px;" align="absmiddle"/>正在装载界面，请稍候...</div>
		</div>

		<div id="designtool-head">
			<%=applicationName%> - 开发管理工具
		</div>
		<div id=designtool-outline></div>
		<div id=designtool-content></div>
		<div id=designtool-attribute></div>
	</body>
</html>