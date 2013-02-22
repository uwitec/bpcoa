<%@ page contentType="text/html; charset=utf-8"%>
<%@ page import="java.util.List"%>
<%@ page import="com.mixky.engine.common.Action"%>
<%@ page import="com.google.gson.JsonObject"%>
<%@ page import="com.google.gson.JsonArray"%>
<%@ page import="com.mixky.engine.view.ViewManager"%>
<%@ page import="com.mixky.engine.view.View"%>
<%@ page import="com.mixky.engine.view.Column"%>
<%@ page import="com.mixky.engine.authority.AuthorityManager"%>
<%@ page import="com.mixky.engine.organization.User"%>
<%@ page import="com.mixky.engine.module.DocumentType"%>
<%@ page import="com.mixky.engine.common.DesignObjectLoader"%>
<%
	String panelid = request.getParameter("panelid");
	View view = (View)request.getAttribute("view");
	User user = (User)request.getAttribute("user");
	List<Action> actions = AuthorityManager.instance().getDesignObjectsByUser(view.getF_buttons(), user);
	List<Column> columns = AuthorityManager.instance().getDesignObjectsByUser(view.getF_columns(), user);
	JsonObject cfg = view.getF_config();
	// 支持自定义数据
	String directFn = "ViewAppDirect.getViewList";
	if(cfg != null && cfg.has("directFn")){
		directFn = cfg.get("directFn").getAsString();
	}
	// 查询表单输出项
	JsonArray queryFormItems = ViewManager.instance().getViewQueryForm(view);
	// 计算查询界面高度
	int formHeight = queryFormItems.size() * 30 + 25 + 15 + 40;
%>
<script language='javascript'>
Ext.onReady(function(){

	var panel = Ext.getCmp('<%=panelid%>');
	var win = panel.findParentByType('window');

	// 数据访问
	var store = new Ext.data.DirectStore({
		directFn : <%=directFn%>,
		paramOrder : ['viewkey','querytype','limit','start','sort','dir','params'],
		baseParams : {viewkey:'<%=view.getKey()%>', querytype:<%=ViewManager.QT_NORMAL%>,limit:<%=view.getF_page_size()%>, start:0, sort:'',dir:'',params:{}},
		remoteSort : true,
		root : 'results',
		totalProperty : 'totals',
		idProperty : '<%=view.getF_keycolumn()%>',
		fields : <%=ViewManager.instance().getViewStoreFields(columns, view.getF_enable_favorite())%>
	});
<%
	// 收藏夹字段定义
	if(view.getF_enable_favorite()){
		String dtkey = view.getF_i_documenttype().get("data").getAsString();
		DocumentType dt = DesignObjectLoader.instance().loadDesignObject(dtkey);
%>
	var favoriteColumn = new Mixky.app.favorite.FavoriteColumn({
		   dataIndex: 'F_FAVORITE_FLAG',
		   id: 'F_FAVORITE_FLAG',
		   fixed : true,
		   menuDisabled : true,
		   documenttypekey : '<%=dtkey%>',
		   titleFieldName : '<%=view.getF_title_field()%>',
		   width: 20
	});
	store.on('load', function(s){
		Mixky.app.common.showFavoriteById(s, '<%=dtkey%>');
	});
<%
	}
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
	var columns = <%=ViewManager.instance().getViewColumns(columns)%>;
	// 视图操作
<%
	for(int i=0;i<actions.size();i++){
		Action action = actions.get(i);
%>
	<%=action.output()%>
<%
	}
%>
	var advanceForm = new Ext.form.FormPanel({
    	region : 'north',
    	split : true,
        collapseMode:'mini',
    	height : <%=formHeight%>,
    	maxSize : 500,
    	minSize : 100,
		border : false,
		padding : 5,
		labelWidth : 80,
		autoScroll : true,
		items : {
			xtype:'fieldset',
			buttonAlign : 'center',
			buttons : [{
				text : '执行检索',
				iconCls : 'icon-sys-confirm',
				handler : function(){
					store.baseParams.querytype = <%=ViewManager.QT_ADVANCE%>;
					var params = advanceForm.getForm().getValues();
					var mparams = {};
					for(i in params){
						if(params[i] != ''){
							mparams[i] = params[i];
						}
					}
					panel.queryParams = mparams;
					panel.refresh();
				}
			}],
			items : <%=queryFormItems%>
		}
	});

	// 刷新按钮
	var <%=ViewManager.VN_REFRESH_BUTTON_NAME%> = new Ext.Action({
		text : '刷新',
		iconCls : 'icon-sys-refresh',
		handler : function(){
			panel.refresh();
		}
	});
	
	var buttons = <%=ViewManager.instance().getViewNoQueryButtonNames(view, actions)%>;
	var contextmenus = <%=ViewManager.instance().getViewContextMenuNames(actions)%>;
	// 表格对象
	var grid = new Ext.grid.GridPanel({
    	region : 'center',
		border : false,
		stripeRows: true,
		enableHdMenu : true,
		lineBreak : false,
		cellSelect : true,
        loadMask: {msg:'正在装载...'},
		autoExpandColumn : '<%=view.getF_autoexpandcolumn()%>',
		sm : sm,
		columns : columns,
		store : store,
		tbar : buttons,
		contextMenu : new Ext.menu.Menu({items:contextmenus}),
		//enableDragDrop : true,
		// 输出附加脚本 begin
		<%
			if(cfg!=null && cfg.has("enableDragDrop")){
				out.print("enableDragDrop: " + cfg.get("enableDragDrop").getAsBoolean() + ",");
			}
		%>		
		ddGroup : 'grid2tree',
<%
	//收藏夹字段定义
	if(view.getF_enable_favorite()){
%>
		plugins: [favoriteColumn],
<%
	}
		
	if(view.getF_page_size() > 0){
%>
        bbar: new Ext.PagingToolbar({
        	firstText : '首页',
        	lastText : '尾页',
        	nextText : '下一页',
        	prevText : '上一页',
        	refreshText : '刷新',
        	beforePageText : '第',
        	afterPageText : '页，共 {0} 页',
        	displayMsg : '共 {2} 条，当前显示 {0} 到 {1} 条',
        	emptyMsg : '没有符合条件的数据',
            pageSize: <%=view.getF_page_size()%>,
            store: store,
            displayInfo: true,
            items : [
                '-',
                '每页显示:',
                new Ext.form.ComboBox({
                    editable : false,
                    triggerAction: 'all',
                    width : 50,
               		store : [10, 20, 30, 50, 100, 200],
               		value : <%=view.getF_page_size()%>,
               		listeners : {
               			'select' : function(c, record, index){
               				grid.getBottomToolbar().pageSize = c.getValue();
               				grid.getBottomToolbar().changePage(1);
               			}
                   	}
           		})
            ],
            plugins: new Ext.ux.ProgressBarPager({defaultText:'正在装载数据...'}),
            listeners : {
                'beforechange' : function(a, b){
            		store.baseParams.limit = b.limit;
            		store.baseParams.start = b.start;
            		store.reload();
            		return false;
                }
            }
        }),
<%
	}
%>
		listeners : {
			'rowcontextmenu' : function(g, rowIndex, e){
				g.getSelectionModel().selectRow(rowIndex);
				g.contextMenu.showAt(e.getXY());
			},
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
			// 恢复查询方式
			if(!Ext.isDefined(params.querytype)){
				params.querytype = <%=ViewManager.QT_NORMAL%>;
				store.baseParams.querytype = <%=ViewManager.QT_NORMAL%>;
			}
			panel.params = params;
			store.baseParams.start = 0;
		}
		// 初始化参数
		store.baseParams.params = {};
		Ext.apply(store.baseParams.params, panel.viewparams);
		Ext.apply(store.baseParams.params, panel.params);
		// 处理查询参数
		if(store.baseParams.querytype != <%=ViewManager.QT_NORMAL%>){
			Ext.apply(store.baseParams.params, panel.queryParams);
		}
<%
	if(view.getF_page_size() > 0 && ViewManager.instance().isViewHasQuery(view)){
%>
		grid.getBottomToolbar().moveFirst();
<%
	}
%>
		store.reload();
	}

	// 输出附加脚本 begin
<%
	if(cfg!=null && cfg.has("customscript")){
		out.print(cfg.get("customscript").getAsString() + '\n');
	}
	// 输出视图参数
	if(cfg!=null && cfg.has("params")){
		out.print("panel.viewparams = " + cfg.get("params") + ";");
	}else{
		out.print("panel.viewparams = {};");
	}
%>

	panel.exportToExcel = function() {
		var selects = grid.getSelectionModel().getSelections();
		var ids = [];
		if (selects != null && selects.length > 0) {
			for (var i = 0; i < selects.length; i++) {
				ids[i] = selects[i].get("ID");
			}
		}
		
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

	var ui = new Ext.Panel({
		layout : 'border',
		border : false,
		items : [advanceForm, grid]
	})
	
	// 输出附加脚本 end
	panel.add(ui);
	panel.doLayout();
	// 初始化视图数据
	panel.refresh(panel.initParams);
});
</script>