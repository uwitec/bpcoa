<%@ page contentType="text/html; charset=utf-8"%>
<%@ page import="java.util.List"%>
<%@ page import="java.util.Map"%>
<%@ page import="com.google.gson.JsonObject"%>
<%@ page import="com.mixky.engine.organization.User"%>
<%@ page import="com.mixky.engine.common.Action"%>
<%@ page import="com.mixky.engine.common.DesignObjectLoader"%>
<%@ page import="com.mixky.engine.document.DocumentManager"%>
<%@ page import="com.mixky.engine.document.Document"%>
<%@ page import="com.mixky.engine.document.Panel"%>
<%@ page import="com.mixky.engine.store.StoreManager"%>
<%@ page import="com.mixky.engine.view.View"%>
<%@ page import="com.mixky.engine.view.ViewManager"%>
<%@ page import="com.mixky.engine.document.ObjectAuthority"%>
<%
	// 读取参数
	String panelid = request.getParameter("panelid");
	String documentid = request.getParameter("documentid");
	// 获取属性
	User user = (User)request.getAttribute("user");
	Panel panel = (Panel)request.getAttribute("panel");
	Document document = (Document)request.getAttribute("document");
	Map<String, ObjectAuthority> map = (Map<String, ObjectAuthority>)request.getAttribute("authmap");
	// 获得视图对象
	View view = DesignObjectLoader.instance().loadDesignObject(panel.getF_i_view().get("data").getAsString());
	// 获得权限
	List<ObjectAuthority> panelbuttonauths = DocumentManager.instance().getFilterObjectAuthority(map, panel.getF_buttons(), user);
	List<ObjectAuthority> viewbuttonauths = DocumentManager.instance().getFilterObjectAuthority(map, view.getF_buttons(), user);
	// 合并视图及表单按钮
	for(int i=0;i<viewbuttonauths.size();i++){
		panelbuttonauths.add(viewbuttonauths.get(i));
	}
	List<ObjectAuthority> columnauths = DocumentManager.instance().getFilterObjectAuthority(map, view.getF_columns(), user);
	// 视图默认参数
	JsonObject params = new JsonObject();
	if(panel.getF_config() != null && panel.getF_config().has("documentidParamName")){
		params.addProperty(panel.getF_config().get("documentidParamName").getAsString(), documentid);
	}
	
	JsonObject configParams = new JsonObject();
	if (panel.getF_config().has("params")) {
		configParams = panel.getF_config().get("params").getAsJsonObject();
	}
%>
<script language='javascript'>
Ext.onReady(function(){

	var panel = Ext.getCmp('<%=panelid%>');

	// 数据访问
	var store = new Ext.data.DirectStore({
		directFn : ViewAppDirect.getViewList,
		paramOrder : ['viewkey','querytype','limit','start','sort','dir','params'],
		baseParams : {viewkey:'<%=view.getKey()%>', querytype:<%=ViewManager.QT_NORMAL%>,limit:0, start:1, sort:'',dir:'',params:Ext.apply(<%=params%>, <%=configParams%>)},
		remoteSort : true,
		root : 'results',
		totalProperty : 'totals',
		idProperty : '<%=view.getF_keycolumn()%>',
		fields : <%=ViewManager.instance().getViewStoreFields(view.getF_columns())%>
	});
<%

	// 选择器
	if(view.getF_single_select()){
%>
	var sm = new Ext.grid.RowSelectionModel({singleSelect : true});
<%
	}else{
%>
	var sm = new Ext.grid.CheckboxSelectionModel();
<%
	}
%>
	// 显示列
	var columns = <%=ViewManager.instance().getViewColumnsByAuths(columnauths)%>;

	// 刷新按钮
	var <%=ViewManager.VN_REFRESH_BUTTON_NAME%> = new Ext.Action({
		text : '刷新',
		iconCls : 'icon-sys-refresh',
		handler : function(){
			store.baseParams.querytype = <%=ViewManager.QT_NORMAL%>;
			panel.refresh();
		}
	});
	// 视图操作
	var buttons = [<%=ViewManager.VN_REFRESH_BUTTON_NAME%>, '->'];
	var contextmenus = [<%=ViewManager.VN_REFRESH_BUTTON_NAME%>, '-'];
<%
	String defaultAction = "";
	for(int i=0;i<panelbuttonauths.size();i++){
		ObjectAuthority auth = panelbuttonauths.get(i);
		// 判断权限
		if(auth.hasAuth(ObjectAuthority.A_READ) || auth.hasAuth(ObjectAuthority.A_EDIT)){
			Action action = (Action)auth.getObject();
			// 输出按钮
%>
	<%=action.output()%>
<%
			if(!action.isHideInToolbar()){
%>
	buttons.push(<%=action.getF_key()%>);
<%
			}
			if(!action.isHideInContextMenu()){
%>
	contextmenus.push(<%=action.getF_key()%>);
<%
			}
			// 双击默认操作
			if(action.getF_default()){
				defaultAction = action.getF_key() + ".execute()";
			}
		}
	}
%>
	// 表格对象
	var grid = new Ext.grid.GridPanel({
		border : false,
		stripeRows: true,
		enableHdMenu : true,
		autoExpandColumn : '<%=view.getF_autoexpandcolumn()%>',
		sm : sm,
		columns : columns,
		store : store,
		tbar : buttons,
		contextMenu : new Ext.menu.Menu({items:contextmenus}),
		listeners : {
			'rowcontextmenu' : function(g, rowIndex, e){
				g.getSelectionModel().selectRow(rowIndex);
				g.contextMenu.showAt(e.getXY());
			},
			'rowdblclick' : function(g, rowIndex, e){
				<%=defaultAction%>
			}
		},
		getSelectedRecords : function(){
			return this.getSelectionModel().getSelections();
		}
	});

	function getSelectedRecords(){
		return grid.getSelectedRecords();
	}
	
	panel.refresh = function(){
		grid.getStore().reload();
	}

	panel.exportToExcel = function() {
		var ids = [];
		var cols = grid.getColumnModel();
		var colsStr = '';
		var colsNames = '';
		for (var i = 0; i < cols.getColumnCount(); i++) {
			var col = cols.getColumnById(cols.getColumnId(i));
			if (!col.hidden && col.id != 'numberer' && col.id != 'checker') {
				colsStr += col.id + ',';
				colsNames += col.header + ',';
			}
		}
		var excelParams = Ext.apply({},grid.getStore().baseParams);
		Ext.apply(excelParams,{ids: ids, colsStr:colsStr, colsNames:colsNames, panelTitle: panel.title});
		excelParams.params = Ext.util.JSON.encode(excelParams.params);
		location.href = 'framework/engine/view/export.to.excel.do?' + Ext.urlEncode(excelParams);
	}

	// 输出附加脚本 begin
<%
	if(panel.getF_custom_script() != null){
		out.print(panel.getF_custom_script());
	}
%>

	// 输出附加脚本 end
	panel.add(grid);
	panel.doLayout();
	// 初始化视图数据
	panel.refresh();
});
</script>