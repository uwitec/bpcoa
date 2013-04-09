<%@page import="com.mixky.engine.store.TableForm"%>
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
	String userid = (String)request.getAttribute("userid");
	String date = (String)request.getAttribute("date");
	String username = (String)request.getAttribute("username");
	User user = (User)request.getAttribute("user");
	String  f_plan_id = request.getParameter("f_plan_id");
	System.out.println(f_plan_id);
	//View view = (View)request.getAttribute("view");
	//List<Action> buttons = AuthorityManager.instance().getDesignObjectsByUser(view.getF_buttons(), user);
	//List<Column> columns = AuthorityManager.instance().getDesignObjectsByUser(view.getF_columns(), user);
	//List<Column> columns = view.getF_columns();
	//List<Action>  = view.getF_buttons();
	//JsonObject cfg = view.getF_config();
	TableForm tableform = DesignObjectLoader.instance().loadDesignObject("bpcProject.T_BPCOA_PLAN_LOG.frmPlanLog");


	
	boolean orderable = false;
//	if(cfg != null && cfg.has("orderable")){
//		orderable = cfg.get("orderable").getAsBoolean();
//	}
	String defaultAction = "";	
%>
<script language='javascript'>
Ext.onReady(function(){
	var panel = Ext.getCmp('<%=panelid%>');
	var planid = 0;
	// 数据访问
	var store = new Ext.data.DirectStore({
		directFn : BpcProjectAppDirect.getTaskPlayLog,
		paramOrder : ['f_plan_id'],
		baseParams : {f_plan_id:0},
		remoteSort : true,
		root : 'results',
		totalProperty : 'totals',
		idProperty : 'null',
		fields : [
		{"name":"ID","mapping":"ID"},
		{"name":"F_NAME","mapping":"F_NAME"},
		{"name":"F_NOTE","mapping":"F_NOTE"},
		{"name":"F_STATE","mapping":"F_STATE"},
		{"name":"F_REASON","mapping":"F_REASON"}]
	});
	var sm = new Ext.grid.RowSelectionModel({singleSelect : true});

	// 显示列
	var columns = [new Ext.grid.RowNumberer(),
	{"id":"F_NAME","dataIndex":"F_NAME","header":"标题","sortable":false, "width":100,"editor":{"xtype":"textfield","selectOnFocus":false,"allowBlank":false}},
	{"id":"F_NOTE","dataIndex":"F_NOTE","header":"内容","sortable":false,"width":80,"editor":{"xtype":"textfield","selectOnFocus":false,"allowBlank":true}},
	{"id":"F_STATE","dataIndex":"F_STATE","header":"状态","sortable":false,"width":80,"editor":{"xtype":"textfield","selectOnFocus":false,"allowBlank":true}},
	{"id":"F_REASON","dataIndex":"F_REASON","header":"原因","sortable":false,"width":80,"editor":{"xtype":"textfield","selectOnFocus":false,"allowBlank":true}}
	];
	
	// 显示标题
	var lbl_username =  new Ext.form.Label({
		text: '<%=date%>'
	});
	
	var btnAdd = new Ext.Action({
		text : '添加',
		iconCls : 'icon-sys-refresh',
		handler : function(){
			store.baseParams.querytype = <%=ViewManager.QT_NORMAL%>;
			panel.addRecord();
		}
	});
	
	var btnDelete = new Ext.Action({
		text : '删除',
		iconCls : 'icon-sys-refresh',
		handler : function(){
			store.baseParams.querytype = <%=ViewManager.QT_NORMAL%>;
			panel.refresh();
		}
	});
	
	var btnSave = new Ext.Action({
		text : '保存',
		iconCls : 'icon-sys-save',
		handler : function(){
		Ext.MessageBox.confirm('操作提示', '请确认是否要提交评分结果？', function(btn){
				if(btn == 'yes'){
					panel.submit();
				}
			});
		}
	});
	

	
	var btnRefresh = new Ext.Action({
		text : '刷新',
		iconCls : 'icon-sys-refresh',
		handler : function(){
			store.baseParams.querytype = <%=ViewManager.QT_NORMAL%>;
			panel.refresh();
		}
	});

	// 行编辑插件
	var roweditor = new Ext.ux.grid.RowEditor({
	    saveText: '确定',
	    cancelText: '取消'
	});
	
	// 视图操作
	var contextmenus = [];
	// 表格对象
	var grid = new Ext.grid.GridPanel({
		border : false,
		stripeRows: true,
		enableHdMenu : true,
		lineBreak : false,
		cellSelect : true,
        loadMask: {msg:'正在装载...'},
		autoExpandColumn : 'F_REASON',
		sm : sm,
		columns : columns,
		store : store,
		tbar : ['-', lbl_username, '->',btnAdd,btnDelete,btnSave,'-', btnRefresh],
		contextMenu : new Ext.menu.Menu({items:contextmenus}),
		//enableDragDrop : true,
		// 输出附加脚本 begin
		plugins : [roweditor],
		listeners : {
			'rowcontextmenu' : function(g, rowIndex, e){
				g.getSelectionModel().selectRow(rowIndex);
				g.contextMenu.showAt(e.getXY());
			},
			'rowdblclick' : function(g, rowIndex, e){
				
			}
		},
		getSelectedRecords : function(){
			return this.getSelectionModel().getSelections();
		}
	});
	/**
	// 列表行提示信息
	grid.on('render',function (grid){
		var store=grid.getStore();
		var view=grid.getView();
		var str="";
		grid.tip=new Ext.ToolTip({
			target:view.mainBody,
			anchor: 'left',
			title:'日志信息',
			delegate:'.x-grid3-row',
			trackMouse:true,
			dismissDelay:5000,
			renderTo:document.body,
			listeners:{
				"beforeshow":function updateTipBody(tip) {
					var rowIndex=view.findRowIndex(tip.triggerElement);
					var record = store.getAt(rowIndex);
					var tipmsg = '<br>'
								+ '<table class="scoreTip" width=100%>'
								+ '<tr><td><B>标题:</B></td><td align="right">' + record.get('F_TITLE') + '</td></tr>'
								+ '<tr><td><B>开始:</B></td> <td align="right">' + record.get('F_START_TIME') + '</td></tr>'
								+ '<tr><td><B>结束:</B></td> <td align="right">' + record.get('F_END_TIME') + '</td></tr>'
								+ '<tr><td><B>工作量:</B></td> <td align="right">' + record.get('F_WORKLOAD') + '小时</td></tr>'
								+ '<tr><td colspan=2><B>描述:</B>' + record.get('F_NOTE') + '</td></tr>'
								+ '</table>';
					tip.body.dom.innerHTML = tipmsg;
				}
			}
		});
	});
	**/
	////
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
			//
			var title = '';
			if(params){
				if (0 == params.f_plan_id){
					lbl_username.setText('');
					store.removeAll();
					return;
				}
				title = '工作计划';
				//
				store.baseParams.f_plan_id = params.f_plan_id;
			}
			lbl_username.setText(title);
		}
		planid = params.f_plan_id;
		// 初始化参数
		Ext.apply(store.baseParams.params, panel.viewparams);
		Ext.apply(store.baseParams.params, panel.params);
		
		// 处理查询参数
		if(store.baseParams.querytype != 0){
			Ext.apply(store.baseParams.params, panel.queryParams);
		}
		//
		store.reload();
	}
	panel.addRecord = function(config){
		if(roweditor.editing){
			MixkyApp.showAlertMessage("无法添加，请关闭编辑界面");
			return;
		}
		alert(planid);
		Mixky.lib.getNewTableRecordId('<%=tableform.getParent().getF_key()%>', function(newId){
			var record = new store.recordType(Ext.apply({ID : newId, rowstate : 'add'}, config), newId);
			var index = store.getCount();
			store.insert(index, record);
			if(orderable){
				record.set('F_ORDER', index + 1);
			}
			
			record.set('F_PLAN_ID', planid);
			grid.getSelectionModel().selectRow(index);
		});
	}
	

	// 保存列表
	panel.submit = function(){
		if(roweditor.editing){
			MixkyApp.showAlertMessage("无法保存，请关闭【<%=tableform.getF_caption()%>】编辑界面");
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
					MixkyApp.showDirectActionFail("保存【<%=tableform.getF_caption()%>】数据", result, e);
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
	// 输出附加脚本 begin
	panel.viewparams = {};
	
	// 输出附加脚本 end
	panel.add(grid);
	panel.doLayout();
	// 初始化视图数据
	panel.refresh(panel.initParams);
});
</script>