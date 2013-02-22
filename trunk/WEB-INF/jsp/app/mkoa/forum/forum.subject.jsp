<%@ page contentType="text/html; charset=utf-8"%>
<%@ page import="java.util.List"%>
<%@ page import="com.google.gson.JsonObject"%>
<%@ page import="com.mixky.engine.common.Action"%>
<%@ page import="com.mixky.engine.view.ViewManager"%>
<%@ page import="com.mixky.engine.view.View"%>
<%@ page import="com.mixky.engine.view.Column"%>
<%@ page import="com.mixky.engine.common.DesignObjectLoader"%>
<%@page import="com.mixky.app.certification.MixkyUserCertification"%>
<%@page import="com.mixky.engine.organization.User"%>
<%
	String panelid = request.getParameter("panelid");

	View view = DesignObjectLoader.instance().loadDesignObject("forum.query_category.view_category");
	List<Column> columns = view.getF_columns();
	List<Action> actions = view.getF_buttons();
	JsonObject cfg = view.getF_config();
	
	String categoryId = request.getParameter("categoryId");
	
	User user = MixkyUserCertification.instance().getUserInfo(request);

%>
<script language='javascript'>
Ext.onReady(function(){

	var panel = Ext.getCmp('<%=panelid%>');
	
	var store = new Ext.data.DirectStore({
		directFn : AppForumDirect.getCategoryForumsViewJson,
		paramOrder : ['categoryId','userId'],
		baseParams : {categoryId:<%=categoryId%>, userId:<%=user.getId()%>,params:{}},
		remoteSort : true,
		root : 'results',
		totalProperty : 'totals',
		idProperty : 'ID',
		fields : <%=ViewManager.instance().getViewStoreFields(view.getF_columns())%>
	});

	// 显示列
	var columns = <%=ViewManager.instance().getViewColumns(view.getF_columns())%>;

	// 选择器
	var sm = new Ext.grid.RowSelectionModel({singleSelect : true});

	// 视图按钮
	var buttons = [];
	var <%=ViewManager.VN_REFRESH_BUTTON_NAME%> = new Ext.Action({
		text : '刷新',
		iconCls : 'icon-app-refresh',
		handler : function(){
			store.baseParams.querytype = <%=ViewManager.QT_NORMAL%>;
			panel.refresh();
		}
	});
	buttons.push('->');
	buttons.push(<%=ViewManager.VN_REFRESH_BUTTON_NAME%>);
	
	// 输出视图操作

	// 渲染主题
	var renderTopic = function(value, p, r){
        return String.format(
                '<div style="padding-left:20px;background:transparent no-repeat 0 2px;"><b style="display:block;color:#333;">{0}</b><span style="color:#333;">{1}</span></div>',
                r.data['f_title'],
				r.data['f_comment']);
    };
	// 渲染辅助信息
	var renderPost = function(value, p, r){
        return String.format('<span style="font-weight:bold;color:#333;">{0}</span><br/>by {1}', 
                value, 
                r.data['f_updated']);
    };

	// 表格对象
	var grid = new Ext.grid.GridPanel({
		border : false,
		region:'center',
		enableHdMenu : true,
        loadMask: {msg:'正在装载...'},
        trackMouseOver:false,
		sm : sm,
		store : store,
		autoExpandColumn: 'topic',
		cm : new Ext.grid.ColumnModel([{
           id: 'topic',
           header: "",
           dataIndex: 'f_title',
           renderer: renderTopic
        }]),
		tbar : buttons,
		listeners : {
			'rowdblclick' : function(g, rowIndex, e){
				<%=ViewManager.instance().getDefaultButtonRun(view)%>
			}
		},
		getSelectedRecords : function(){
			return this.getSelectionModel().getSelections();
		}
	});
	
	function getSelectedRecords(){
		return grid.getSelectedRecords();
	}
	
	// 视图刷新
	panel.refresh = function(params){
		if(Ext.isDefined(params)){
			panel.params = params;
		}
		// 初始化参数
		store.baseParams.params = Ext.apply(panel.params);
		// 处理查询参数
		if(store.baseParams.querytype != <%=ViewManager.QT_NORMAL%>){
			Ext.apply(store.baseParams.params, panel.queryParams);
		}
		store.load();
	}
	
	
	panel.add(grid);
	panel.doLayout();
	// 初始化视图数据
	panel.refresh(panel.initParams);
});
</script>