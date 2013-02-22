<%@ page contentType="text/html; charset=utf-8"%>
<%@ page import="java.util.List"%>
<%@ page import="com.mixky.engine.common.Action"%>
<%@ page import="com.google.gson.JsonObject"%>
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
	// 处理查询
	if(ViewManager.instance().isViewHasQuery(view)){
%>
	var <%=ViewManager.VN_QUICK_QUERY_FIELD_NAME%> = new Ext.form.TextField({
		width : 100,
		emptyText : '输入快速检索字符',
        listeners: {
	        specialkey: function(field, e){
	            // e.HOME, e.END, e.PAGE_UP, e.PAGE_DOWN,
	            // e.TAB, e.ESC, arrow keys: e.LEFT, e.RIGHT, e.UP, e.DOWN
	            if (e.getKey() == e.ENTER) {
	            	var value = field.getValue();
	    			if(Ext.isDefined(value) && value != ''){
	    				store.baseParams.querytype = <%=ViewManager.QT_QUICK%>;
	    				panel.queryParams = {<%=ViewManager.VN_QUICK_QUERY_PARAM_NAME%>: value};
	    				panel.refresh();
	    			}
	            }
	        }
	    }
	});
	var <%=ViewManager.VN_QUICK_QUERY_BUTTON_NAME%> = new Ext.Action({
		text : '快速检索',
		iconCls : 'icon-sys-query',
		handler : function(){
			var value = <%=ViewManager.VN_QUICK_QUERY_FIELD_NAME%>.getValue();
			if(Ext.isDefined(value) && value != ''){
				store.baseParams.querytype = <%=ViewManager.QT_QUICK%>;
				panel.queryParams = {<%=ViewManager.VN_QUICK_QUERY_PARAM_NAME%>: value};
				panel.refresh();
			}
		}
	});
	var advanceForm = new Ext.form.FormPanel({
		padding : 5,
		labelWidth : 80,
		autoScroll : true,
		items : <%=ViewManager.instance().getViewQueryForm(view)%>,
		bbar : ['->',{
			text : '执行检索',
			iconCls : 'icon-sys-confirm',
			handler : function(){
				var btn = <%=ViewManager.VN_ADVANCE_QUERY_BUTTON_NAME%>;
				store.baseParams.querytype = <%=ViewManager.QT_ADVANCE%>;
				var params = advanceForm.getForm().getValues();
				var mparams = {};
				for(i in params){
					if(params[i] != ''){
						mparams[i] = params[i];
					}
				}
				panel.queryParams = mparams;
				advanceWindow.hide();
				panel.refresh();
			}
		}, {
			text : '关闭',
			iconCls : 'icon-sys-cancel',
			handler : function(){
				var btn = <%=ViewManager.VN_ADVANCE_QUERY_BUTTON_NAME%>;
				advanceWindow.hide();
			}
		}]
	});
	var advanceWindow = new Ext.Window({
		width : 400,
		height : 400,
		resizable : true,
		title : '<%=view.getF_caption()%>视图高级查询',
		modal : true,
		closeAction : 'hide',
		layout : 'fit',
		items:[advanceForm]
	});
	var <%=ViewManager.VN_ADVANCE_QUERY_BUTTON_NAME%> = new Ext.Action({
		text : '高级检索',
		iconCls : 'icon-sys-aquery',
		handler : function(){
			advanceForm.getForm().reset();
			advanceWindow.show();
		}
	});
<%
	}
%>
	// 刷新按钮
	var <%=ViewManager.VN_REFRESH_BUTTON_NAME%> = new Ext.Action({
		text : '刷新',
		iconCls : 'icon-sys-refresh',
		handler : function(){
			store.baseParams.querytype = <%=ViewManager.QT_NORMAL%>;
			panel.refresh();
		}
	});
	// 打开
	var btnOpen =  new Ext.Action({"text":"打开","iconCls":"icon-sys-btnopen","handler":function(){
		var records = grid.getSelectedRecords();
		if(records.length > 0){
			var id = records[0].get('ID');
			MixkyApp.desktop.openDocument('bpcProject.docProject', id);
		}
	}});
	// 项目合并
	var btnMerge =  new Ext.Action({
		"text":"合并项目",
		"iconCls":"icon-app-bpcoa-project-merge",
		"handler":function(){
			var records = grid.getSelectedRecords();
			var id = records[0].get('ID');
			var title = records[0].get("F_TITLE");
			if(id > 0){
				var projectpanel = new Ext.Panel({
				id : 'pnl-project-list',
				layout : 'fit',
				autoLoad : {
					url : 'page.do',
					params : {
						url:'app/bpcoa/project/project.merge',
						projectid:id,
						projecttitle:title,
						panelid:'<%=panelid%>'},
					loadScripts : true,
					scripts	: true
				}
			});
			var projectwin = new Ext.Window({
				modal: true,
				title : '项目合并',
				manager : MixkyApp.desktop.getManager(),
				layout:'fit',
				width: 320,
				height:150,
				resizable: false,
				items: projectpanel,
				buttons : [{
					text : '合并',
					iconCls : 'icon-sys-confirm',
					handler : function(){
						projectpanel.submit();
					}
				}, {
					text : '关闭',
					iconCls : 'icon-sys-cancel',
					handler : function(){
						projectwin.close();
						panel.refresh();
					}
				}]
			});
			projectwin.show();
		}
	}});
	
	

	var buttons = ["->",btnOpen,btnMerge,"-",quickQueryField,btnQuickQuery,"-",btnAdvanceQueryButton,"-",btnRefresh];
	var contextmenus = <%=ViewManager.instance().getViewContextMenuNames(actions)%>;
	// 表格对象
	var grid = new Ext.grid.GridPanel({
		border : false,
		stripeRows: <%=view.getStripeRows()%>,
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
				btnOpen.execute();
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
		if(cfg!=null && cfg.has("refreshscript")){
			out.print(cfg.get("refreshscript").getAsString() + '\n');
		}		
%>
<%
	if(view.getF_page_size() > 0 && ViewManager.instance().isViewHasQuery(view)){
%>
		grid.getBottomToolbar().moveFirst();
<%
	}else{
%>
		store.reload();
<%
	}
%>
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
	
	// 输出附加脚本 end
	panel.add(grid);
	panel.doLayout();
	// 初始化视图数据
	panel.refresh(panel.initParams);
});
</script>