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
<%
	// 读取参数
	String panelid = request.getParameter("panelid");
	User user = (User)request.getAttribute("user");

	View view = (View)request.getAttribute("view");
	List<Action> buttons = AuthorityManager.instance().getDesignObjectsByUser(view.getF_buttons(), user);
	List<Column> columns = AuthorityManager.instance().getDesignObjectsByUser(view.getF_columns(), user);
	//List<Column> columns = view.getF_columns();
	//List<Action>  = view.getF_buttons();
	JsonObject cfg = view.getF_config();
	TableForm tableform = DesignObjectLoader.instance().loadDesignObject(cfg.get("editorform").getAsString());

	// 支持自定义数据
	String directFn = "ScoreAppDirect.getScoreYearList";
	if(cfg.has("directFn")){
		directFn = cfg.get("directFn").getAsString();
	}
	
	boolean orderable = false;
	if(cfg != null && cfg.has("orderable")){
		orderable = cfg.get("orderable").getAsBoolean();
	}
	String defaultAction = "";

	String year = DateUtil.format(new Date(System.currentTimeMillis()), "yyyy");
	System.out.println(year);
%>
<script language='javascript'>
Ext.onReady(function(){

	var panel = Ext.getCmp('<%=panelid%>');
	// 是否支持排序
	var orderable = <%=orderable%>;
	
	// 显示字段
	var fields = [{
			"name":"ID","mapping":"ID"
		},{
			"name":"F_CAPTION","mapping":"F_CAPTION"
		},{
			"name":"F_DEPT_NAME","mapping":"F_DEPT_NAME"
		},{
			"name":"F_SCORE","mapping":"F_SCORE"
		},{
			"name":"F_REWARD_SCORE","mapping":"F_REWARD_SCORE"
		}];
	fields.push({name:'rowstate', mapping:'rowstate'});

	// 数据访问
	var store = new Ext.data.DirectStore({
		pruneModifiedRecords : true,
		directFn : <%=directFn%>,
		paramOrder : ['year'],
		baseParams : {year:'<%=year%>'},
		remoteSort : true,
		root : 'results',
		totalProperty : 'totals',
		idProperty : '<%=view.getF_keycolumn()%>',
		fields : fields
	});
	
	var sm = new Ext.grid.RowSelectionModel({singleSelect : true});
	
	// 显示列
	var columns = [new Ext.grid.RowNumberer(),
		{"id":"F_CAPTION","dataIndex":"F_CAPTION","header":"姓名","sortable":false, "width":100},	
		{"id":"F_DEPT_NAME","dataIndex":"F_DEPT_NAME","header":"部门","sortable":false, "width":100},
		{"id":"F_SCORE","dataIndex":"F_SCORE","header":"年总积分","sortable":false, "width":100},
		{"id":"F_REWARD_SCORE","dataIndex":"F_REWARD_SCORE","header":"年奖励积分","sortable":false, "width":100,"editor":{"xtype":"numberfield","selectOnFocus":false,"allowBlank":false,"maxLength":10,"allowDecimals":true}}
		];

	// 刷新按钮
	var btnRefresh = new Ext.Action({
		text : '刷新',
		iconCls : 'icon-sys-refresh',
		handler : function(){
			store.baseParams.querytype = 0;
			panel.refresh();
		}
	});
	// 保存按钮
	var btnSave = new Ext.Action({
		text : '保存',
		iconCls : 'icon-sys-save',
		handler : function(){
			var modifieds = store.getModifiedRecords();
			if(modifieds.length > 0){
				for(var i =0;i<modifieds.length;i++){
					var record = modifieds[i];
					var item = record.getChanges();
					item.ID = record.get('ID');
					item.rowstate = record.get('rowstate');
					panel.submit();
					panel.refresh();
				}
			}
		}
	});

	// 视图操作

	var btnIniFromOrg =  new Ext.Action({
		"text":"初始化年积分","iconCls":"icon-sys-run","handler":function(){
		Ext.MessageBox.confirm('操作提示', '该操作将从员工积分档案当中导入用户，所有数据将被初始化。您确定吗？', 
			function(btn){
				if(btn == 'yes'){
					// 初始化参数
					var year = dateSelect.getRawValue();
					
					ScoreAppDirect.initScoreYear(year, function(result, e){
						if(result && result.success){
							MixkyApp.showInfoMessage("初始化年积分表成功!", "操作提示");
							panel.refresh();
						}else{
							MixkyApp.showDirectActionFail("初始化年积分表失败", result, e);
						}
					});
				}
			});
		}
	});
	
	// 选择当前月
	var dateSelect = new Ext.form.DateField({
		value:'<%=year%>', 
		editable : false, 
		width : 70,
		format : 'Y',
		listeners : {
			'select' : function(){
				panel.refresh();
			}
		}
	});
	// 下年
	var btnNextYear = new Ext.Action({
		iconCls : 'icon-sys-btnnext',
		handler : function(){
		var date = Date.parseDate(store.baseParams.year + '-01-01', 'Y-m-d');
			dateSelect.setValue(date.add(Date.YEAR, 1).format('Y-m-d'));
			panel.refresh();
		}
	});
	// 上年
	var btnPreYear = new Ext.Action({
		iconCls : 'icon-sys-btnback',
		handler : function(){
		var date = Date.parseDate(store.baseParams.year + '-01-01', 'Y-m-d');
			dateSelect.setValue(date.add(Date.YEAR, -1).format('Y-m-d'));
			panel.refresh();
		}
	});

	// 导出表格
	var btnExport =  new Ext.Action({"text":"导出到Excel","iconCls":"icon-sys-btnexport","handler":function() {
	     document.location="servlet/app/scoreYear.export?date=" + store.baseParams.year;
	}});
	
	// 行编辑插件
	var roweditor = new Ext.ux.grid.RowEditor({
	    saveText: '确定',
	    cancelText: '取消'
	});
    // 处理编辑结果
    roweditor.on('validateedit', function(rd, changes){
        var cm = rd.grid.colModel;
        var valuefields = {};
        for(var k in changes){
			if(changes[k] instanceof Date){
				var ed = cm.getColumnById(k).getEditor().field;
				changes[k] = ed.getRawValue();
			}
			if(Ext.isDefined(cm.getColumnById(k).valueField)){
				var ed = cm.getColumnById(k).getEditor().field;
				changes[k] = ed.getRawValue();
				valuefields[cm.getColumnById(k).valueField] = ed.getValue();
			}
        }
        Ext.apply(changes, valuefields);
        return true;
    });
	// 表格对象
	var grid = new Ext.grid.GridPanel({
		border : false,
		stripeRows: true,
		enableHdMenu : true,
		lineBreak : false,
		cellSelect : true,
        loadMask: {msg:'正在装载...'},
		plugins : [roweditor],
		viewConfig:{
			getRowClass: function(record, index) {
				if(record.dirty){
					return 'mixky-grid-row-changed';
				}
		    }
		},
		sm : sm,
		columns : columns,
		store : store,
		tbar : [btnPreYear, dateSelect, btnNextYear, '->', btnIniFromOrg, '-', btnExport, '-', btnSave, '-', btnRefresh],
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
	// 获得被选中记录
	function getSelectedRecords(){
		return grid.getSelectedRecords();
	}
	// 保存列表
	panel.submit = function(){
		if(roweditor.editing){
			MixkyApp.showAlertMessage("无法保存，请关闭编辑界面");
			return;
		}
		var modifieds = store.getModifiedRecords();
		if(modifieds.length > 0){
			var record = modifieds[0];
			var item = record.getChanges();
			item.ID = record.get('ID');
			item.rowstate = record.get('rowstate');
			DocumentAppDirect.submitRowForm('<%=tableform.getKey()%>', item, function(result, e){
				if(result && result.success){
					panel.hasSaved = true;
					if(record.get('rowstate') == 'del'){
						store.remove(record);
					}else{
						record.set('rowstate', '');
						record.commit();
					}
					panel.submit();
				}else{
					MixkyApp.showDirectActionFail("保存数据", result, e);
				}
			});
		}else{
			if(panel.hasSaved){
				panel.hasSaved = undefined;
				grid.getStore().reload();
			}
			MixkyApp.showInfoMessage("保存完毕");
		}
	}

	panel.refresh = function(params){
		if(Ext.isDefined(params)){
			panel.params = params;
		}
		// 初始化参数
		store.baseParams.year = dateSelect.getRawValue();
		
		store.baseParams.params = {};
		Ext.apply(store.baseParams.params, panel.viewparams);
		Ext.apply(store.baseParams.params, panel.params);
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
		var excelParams = Ext.apply({viewkey:'mkScore.qScoreYearHistory.vScoreYearList', querytype:0,limit:0, start:0, sort:'',dir:'',params:{}},grid.getStore().baseParams);
		Ext.apply(excelParams,{ids: ids, colsStr:colsStr, colsNames:colsNames, panelTitle: panel.title});
		excelParams.params = Ext.util.JSON.encode(excelParams.params);
		location.href = 'framework/engine/view/export.to.excel.do?' + Ext.urlEncode(excelParams);
	}
	
	// 输出附加脚本 end
	panel.add(grid);
	panel.doLayout();
	// 初始化视图数据
	panel.refresh();
});
</script>