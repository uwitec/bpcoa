<%@ page contentType="text/html; charset=utf-8"%>
<%@ page import="java.util.List"%>
<%@ page import="java.util.Map"%>
<%@ page import="java.util.Date"%>
<%@ page import="com.mixky.toolkit.DateUtil"%>
<%@ page import="com.google.gson.JsonObject"%>
<%@ page import="com.mixky.engine.organization.User"%>
<%@ page import="com.mixky.engine.common.Action"%>
<%@ page import="com.mixky.engine.common.DesignObjectLoader"%>
<%@ page import="com.mixky.engine.view.Column"%>
<%@ page import="com.mixky.engine.store.TableForm"%>
<%@ page import="com.mixky.engine.store.Field"%>
<%@ page import="com.mixky.engine.store.StoreManager"%>
<%@ page import="com.mixky.engine.view.View"%>
<%@ page import="com.mixky.engine.view.ViewManager"%>
<%@ page import="com.mixky.engine.document.ObjectAuthority"%>
<%@ page import="com.mixky.engine.authority.AuthorityManager"%>

<script language='javascript'>
Ext.onReady(function(){

	var panel = Ext.getCmp('ext-comp-1119');
	var win = panel.findParentByType('window');

	// 数据访问
	var store = new Ext.data.DirectStore({
		directFn : ViewAppDirect.getViewList,
		paramOrder : ['viewkey','querytype','limit','start','sort','dir','params'],
		baseParams : {viewkey:'mkScore.qScoreUser.vScoreUser', querytype:0,limit:0, start:0, sort:'',dir:'',params:{}},
		remoteSort : true,
		root : 'results',
		totalProperty : 'totals',
		idProperty : 'ID',
		fields : [{"name":"ID","mapping":"ID"},{"name":"F_USER_NAME","mapping":"F_USER_NAME"},{"name":"F_DEPT_NAME","mapping":"F_DEPT_NAME"},{"name":"F_MANAGER_NAME","mapping":"F_MANAGER_NAME"},{"name":"F_SCORE","mapping":"F_SCORE","type":"float"},{"name":"F_SCORE_YEAR","mapping":"F_SCORE_YEAR","type":"float"},{"name":"TOTAL","mapping":"TOTAL","type":"float"}]
	});

	var sm = new Ext.grid.RowSelectionModel({singleSelect : true});

	// 显示列
	var columns = [new Ext.grid.RowNumberer(),{"id":"F_USER_NAME","dataIndex":"F_USER_NAME","header":"姓名","sortable":true,"width":200},{"id":"F_DEPT_NAME","dataIndex":"F_DEPT_NAME","header":"部门","sortable":true,"width":200},{"id":"F_MANAGER_NAME","dataIndex":"F_MANAGER_NAME","header":"打分者","sortable":true,"width":200},{"id":"F_SCORE","dataIndex":"F_SCORE","header":"基础分","sortable":true,"width":200},{"id":"F_SCORE_YEAR","dataIndex":"F_SCORE_YEAR","header":"各年累计分","sortable":true,"width":200},{"id":"TOTAL","dataIndex":"TOTAL","header":"总分","sortable":true,"width":200}];
	// 视图操作

	var btnOpen =  new Ext.Action({"text":"打开","iconCls":"icon-sys-btnopen","handler":function(){
	var records = grid.getSelectedRecords();
	if(records.length > 0){
		var id = records[0].get('ID');
		MixkyApp.desktop.openDocument('mkScore.docScoreUser', id);
	}
}});

	var btnAdd =  new Ext.Action({"text":"新建","iconCls":"icon-sys-btnadd","handler":function(){
MixkyApp.desktop.openDocument('mkScore.docScoreUser');
}});

	var btnExport =  new Ext.Action({"text":"导出到Excel","iconCls":"icon-sys-btnexport","handler":function() {
     panel.exportToExcel();
}});

	var quickQueryField = new Ext.form.TextField({
		width : 100,
		emptyText : '输入快速检索字符',
        listeners: {
	        specialkey: function(field, e){
	            // e.HOME, e.END, e.PAGE_UP, e.PAGE_DOWN,
	            // e.TAB, e.ESC, arrow keys: e.LEFT, e.RIGHT, e.UP, e.DOWN
	            if (e.getKey() == e.ENTER) {
	            	var value = field.getValue();
	    			if(Ext.isDefined(value) && value != ''){
	    				store.baseParams.querytype = 1;
	    				panel.queryParams = {quickquerystr: value};
	    				panel.refresh();
	    			}
	            }
	        }
	    }
	});
	var btnQuickQuery = new Ext.Action({
		text : '快速检索',
		iconCls : 'icon-sys-query',
		handler : function(){
			var value = quickQueryField.getValue();
			if(Ext.isDefined(value) && value != ''){
				store.baseParams.querytype = 1;
				panel.queryParams = {quickquerystr: value};
				panel.refresh();
			}
		}
	});
	var advanceForm = new Ext.form.FormPanel({
		padding : 5,
		labelWidth : 80,
		autoScroll : true,
		items : [{"name":"F_USER_NAME","xtype":"textfield","anchor":"100%","fieldLabel":"姓名"},{"name":"F_MANAGER_NAME","xtype":"textfield","anchor":"100%","fieldLabel":"打分者"},{"layout":"column","border":false,"items":[{"width":80,"labelWidth":80,"layout":"form","border":false,"items":{"xtype":"textfield","autoCreate":{"tag":"input","type":"hidden"},"fieldLabel":"基础分"}},{"labelWidth":20,"columnWidth":0.5,"layout":"form","border":false,"items":{"name":"F_SCORE_begin","xtype":"numberfield","fieldLabel":">=","anchor":"100%"}},{"labelWidth":20,"columnWidth":0.5,"layout":"form","border":false,"bodyStyle":"padding-left:3px;","items":{"name":"F_SCORE_end","xtype":"numberfield","fieldLabel":" <=","anchor":"100%"}}]},{"name":"F_DEPT_NAME","xtype":"textfield","anchor":"100%","fieldLabel":"部门"},{"layout":"column","border":false,"items":[{"width":80,"labelWidth":80,"layout":"form","border":false,"items":{"xtype":"textfield","autoCreate":{"tag":"input","type":"hidden"},"fieldLabel":"各年累计分"}},{"labelWidth":20,"columnWidth":0.5,"layout":"form","border":false,"items":{"name":"F_SCORE_YEAR_begin","xtype":"numberfield","fieldLabel":">=","anchor":"100%"}},{"labelWidth":20,"columnWidth":0.5,"layout":"form","border":false,"bodyStyle":"padding-left:3px;","items":{"name":"F_SCORE_YEAR_end","xtype":"numberfield","fieldLabel":" <=","anchor":"100%"}}]},{"layout":"column","border":false,"items":[{"width":80,"labelWidth":80,"layout":"form","border":false,"items":{"xtype":"textfield","autoCreate":{"tag":"input","type":"hidden"},"fieldLabel":"总分"}},{"labelWidth":20,"columnWidth":0.5,"layout":"form","border":false,"items":{"name":"TOTAL_begin","xtype":"numberfield","fieldLabel":">=","anchor":"100%"}},{"labelWidth":20,"columnWidth":0.5,"layout":"form","border":false,"bodyStyle":"padding-left:3px;","items":{"name":"TOTAL_end","xtype":"numberfield","fieldLabel":" <=","anchor":"100%"}}]}],
		bbar : ['->',{
			text : '执行检索',
			iconCls : 'icon-sys-confirm',
			handler : function(){
				var btn = btnAdvanceQueryButton;
				store.baseParams.querytype = 2;
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
				var btn = btnAdvanceQueryButton;
				advanceWindow.hide();
			}
		}]
	});
	var advanceWindow = new Ext.Window({
		width : 400,
		height : 400,
		resizable : true,
		title : '员工积分档案视图高级查询',
		modal : true,
		closeAction : 'hide',
		layout : 'fit',
		items:[advanceForm]
	});
	var btnAdvanceQueryButton = new Ext.Action({
		text : '高级检索',
		iconCls : 'icon-sys-aquery',
		handler : function(){
			advanceForm.getForm().reset();
			advanceWindow.show();
		}
	});

	// 刷新按钮
	var btnRefresh = new Ext.Action({
		text : '刷新',
		iconCls : 'icon-sys-refresh',
		handler : function(){
			store.baseParams.querytype = 0;
			panel.refresh();
		}
	});
	
	var buttons = ["->",btnOpen,btnAdd,btnExport,"-",quickQueryField,btnQuickQuery,"-",btnAdvanceQueryButton,"-",btnRefresh];
	var contextmenus = [btnOpen,btnAdd,btnExport];
	// 表格对象
	var grid = new Ext.grid.GridPanel({
		border : false,
		stripeRows: true,
		enableHdMenu : true,
		lineBreak : false,
		cellSelect : true,
        loadMask: {msg:'正在装载...'},
		autoExpandColumn : 'TOTAL',
		sm : sm,
		columns : columns,
		store : store,
		tbar : buttons,
		contextMenu : new Ext.menu.Menu({items:contextmenus}),
		//enableDragDrop : true,
		// 输出附加脚本 begin
				
		ddGroup : 'grid2tree',

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
				params.querytype = 0;
				store.baseParams.querytype = 0;
			}
			panel.params = params;
			store.baseParams.start = 0;
		}
		// 初始化参数
		store.baseParams.params = {};
		Ext.apply(store.baseParams.params, panel.viewparams);
		Ext.apply(store.baseParams.params, panel.params);
		// 处理查询参数
		if(store.baseParams.querytype != 0){
			Ext.apply(store.baseParams.params, panel.queryParams);
		}

		store.reload();

	}

	// 输出附加脚本 begin
panel.viewparams = {};

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
		alert(excelParams.params);
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