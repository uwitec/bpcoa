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
%>
<script language='javascript'>
Ext.onReady(function(){
	var panel = Ext.getCmp('<%=panelid%>');
	// 数据访问
	var store = new Ext.data.DirectStore({
		directFn : WorklogAppDirect.getDayWorklogs,
		paramOrder : ['userid','date'],
		baseParams : {userid:0, date:'1900-01-01'},
		remoteSort : true,
		root : 'results',
		totalProperty : 'totals',
		idProperty : 'null',
		fields : [
		{"name":"ID","mapping":"ID"},
		{"name":"F_USER_ID","mapping":"F_USER_ID"},
		{"name":"F_USER","mapping":"F_USER"},
		{"name":"F_TITLE","mapping":"F_TITLE"},
		{"name":"F_START_TIME","mapping":"F_START_TIME"},
		{"name":"F_END_TIME","mapping":"F_END_TIME"},
		{"name":"F_WORKLOAD","mapping":"F_WORKLOAD","type":"int"},
		{"name":"F_NOTE","mapping":"F_NOTE"}]
	});
	var sm = new Ext.grid.RowSelectionModel({singleSelect : true});

	// 显示列
	var columns = [new Ext.grid.RowNumberer(),
	{"id":"F_TITLE","dataIndex":"F_TITLE","header":"日志标题","sortable":false, "width":100},
	{"id":"F_START_TIME","dataIndex":"F_START_TIME","header":"开始时间","sortable":false, "width":130},
	{"id":"F_END_TIME","dataIndex":"F_END_TIME","header":"结束时间","sortable":false, "width":130},
	{"id":"F_WORKLOAD","dataIndex":"F_WORKLOAD","header":"工作量","sortable":false, "width":50},
	{"id":"F_NOTE","dataIndex":"F_NOTE","header":"内容","sortable":false}];
	
	// 显示标题
	var lbl_username =  new Ext.form.Label({
		text: '<%=username%>'
	});
	
	var btnRefresh = new Ext.Action({
		text : '刷新',
		iconCls : 'icon-sys-refresh',
		handler : function(){
			store.baseParams.querytype = <%=ViewManager.QT_NORMAL%>;
			panel.refresh();
		}
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
		autoExpandColumn : 'F_NOTE',
		sm : sm,
		columns : columns,
		store : store,
		tbar : ['-', lbl_username, '->', btnRefresh],
		contextMenu : new Ext.menu.Menu({items:contextmenus}),
		//enableDragDrop : true,
		// 输出附加脚本 begin

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
				if (0 == params.userid){
					lbl_username.setText('');
					store.removeAll();
					return;
				}
				title = '员工【' + params.username + '】的工作日志';
				//
				store.baseParams.userid = params.userid;
				store.baseParams.date = params.date;
			}
			lbl_username.setText(title);
		}
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

	// 输出附加脚本 begin
	panel.viewparams = {};
	
	// 输出附加脚本 end
	panel.add(grid);
	panel.doLayout();
	// 初始化视图数据
	panel.refresh(panel.initParams);
});
</script>