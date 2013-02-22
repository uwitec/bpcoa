<%@ page contentType="text/html; charset=utf-8"%>
<%@ page import="java.util.List"%>
<%@ page import="java.util.Date"%>
<%@ page import="com.mixky.engine.common.Action"%>
<%@ page import="com.google.gson.JsonObject"%>
<%@ page import="com.mixky.engine.view.ViewManager"%>
<%@ page import="com.mixky.engine.view.View"%>
<%@ page import="com.mixky.engine.view.Column"%>
<%@ page import="com.mixky.engine.authority.AuthorityManager"%>
<%@ page import="com.mixky.engine.organization.User"%>
<%@ page import="com.mixky.engine.module.DocumentType"%>
<%@ page import="com.mixky.engine.common.DesignObjectLoader"%>
<%@ page import="com.mixky.toolkit.DateUtil"%>
<%
	String panelid = request.getParameter("panelid");
	View view = (View)request.getAttribute("view");
	User user = (User)request.getAttribute("user");
	List<Action> actions = AuthorityManager.instance().getDesignObjectsByUser(view.getF_buttons(), user);
	JsonObject cfg = view.getF_config();
%>
<script language='javascript'>
Ext.onReady(function(){

	var panel = Ext.getCmp('<%=panelid%>');
	var win = panel.findParentByType('window');
	var renderCell = function(value, metadata, record , rowIndex, colIndex, store){
		switch(value.dayType){
		case 0:	// 休息日
			metadata.css = 'mixky-attendance-restday-cell';
			return value.day;
			break;
		case 1:	// 工作日
			metadata.css = 'mixky-attendance-workday-cell';
			return value.day;
			break;
		case 2: // 非当前月
			metadata.css = 'mixky-attendance-otherday-cell';
			return "";
			break;
		}
	}
	var fields = [{
		name : 'WEEK',
		mapping : 'WEEK'
	},{
		name : 'MON',
		mapping : 'MON'
	},{
		name : 'TUE',
		mapping : 'TUE'
	},{
		name : 'WED',
		mapping : 'WED'
	},{
		name : 'THU',
		mapping : 'THU'
	},{
		name : 'FRI',
		mapping : 'FRI'
	},{
		name : 'SAT',
		mapping : 'SAT'
	},{
		name : 'SUN',
		mapping : 'SUN'
	}];
	// 数据访问
	var store = new Ext.data.DirectStore({
		directFn : AttendanceAppDirect.getMonthDaySetting,
		paramOrder : ['day'],
		baseParams : {day:'<%=DateUtil.format(new Date(System.currentTimeMillis()), "yyyy-MM")%>-01'},
		remoteSort : true,
		root : 'results',
		totalProperty : 'totals',
		idProperty : 'WEEK',
		fields : fields
	});
	// 选择器
	var sm = new Ext.grid.CellSelectionModel({
		listeners : {
			'beforecellselect' : function(sm, row, col){
				var record = store.getAt(row);
				var fieldname = fields[col].name;
				var data = record.get(fieldname);
				if(data.dayType == 2){
					return false;
				}
			}
		}
	});
	// 显示列
	var columns = [{
		fixed:true,
	    menuDisabled:true,
	    width: 23,
		id : 'numberer',
		dataIndex : 'WEEK',
		renderer : function(value, metadata, record , rowIndex, colIndex, store){
			metadata.attr = "style='height:50px'";
			return value;
		}
	}, {
		id : 'MON',
		dataIndex : 'MON',
		header : '周一',
	    width: 50,
		renderer : renderCell,
		menuDisabled : true,
		css : 'width:14%'
	}, {
		id : 'TUE',
		dataIndex : 'TUE',
		header : '周二',
		menuDisabled : true,
	    width: 50,
		renderer : renderCell,
		css : 'width:14%'
	}, {
		id : 'WED',
		dataIndex : 'WED',
		header : '周三',
		menuDisabled : true,
	    width: 50,
		renderer : renderCell,
		css : 'width:14%'
	}, {
		id : 'THU',
		dataIndex : 'THU',
		header : '周四',
		menuDisabled : true,
	    width: 50,
		renderer : renderCell,
		css : 'width:14%'
	}, {
		id : 'FRI',
		dataIndex : 'FRI',
		header : '周五',
		menuDisabled : true,
	    width: 50,
		renderer : renderCell,
		css : 'width:14%'
	}, {
		id : 'SAT',
		dataIndex : 'SAT',
		header : '周六',
		menuDisabled : true,
	    width: 50,
		renderer : renderCell,
		css : 'width:14%'
	}, {
		id : 'SUN',
		dataIndex : 'SUN',
		header : '周日',
		menuDisabled : true,
	    width: 50,
		renderer : renderCell,
		css : 'width:14%'
	}];
	// 选择当前月
	var dateSelect = new Ext.form.DateField({
		value:'<%=DateUtil.format(new Date(System.currentTimeMillis()), "yyyy-MM")%>-01', 
		editable : false, 
		format : 'Y-m',
		width : 70,
		listeners : {
			'select' : function(){
				panel.refresh();
			}
		}
	});
	// 上月
	var btnNextMonth = new Ext.Action({
		iconCls : 'icon-sys-btnnext',
		handler : function(){
			var date = new Date(store.baseParams.day);
			dateSelect.setValue(date.add(Date.MONTH, 1).format('Y-m-d'));
			panel.refresh();
		}
	});
	// 下月
	var btnPreMonth = new Ext.Action({
		iconCls : 'icon-sys-btnback',
		handler : function(){
			var date = new Date(store.baseParams.day);
			dateSelect.setValue(date.add(Date.MONTH, -1).format('Y-m-d'));
			panel.refresh();
		}
	});
	// 刷新
	var btnRefresh = new Ext.Action({
		iconCls : 'icon-sys-refresh',
		text : '刷新',
		handler : function(){
			panel.refresh();
		}
	});
	// 视图操作
	var tools = [btnPreMonth, dateSelect, btnNextMonth,'-', '->'];
	var contextmenus = [];
<%
	for(int i=0;i<actions.size();i++){
		Action action = actions.get(i);
%>
	var <%=action.getF_key()%> = new Ext.Action({
		text : '<%=action.getF_caption()%>',
		iconCls : '<%=action.getIcon()%>',
		isDefault : <%=action.getF_default()%>,
<%
		if(action.getF_handler() == null || "".equals(action.getF_handler())){
%>
		handler : Ext.emptyFn
<%
		}else{
%>
		handler : <%=action.getF_handler()%>
<%
		}
%>
	});
	tools.push(<%=action.getF_key()%>);
	contextmenus.push(<%=action.getF_key()%>);
<%
	}
%>
	tools.push(btnRefresh);
	
	// 表格对象
	var grid = new Ext.grid.GridPanel({
		border : false,
		stripeRows: false,
		trackMouseOver: false,
		enableHdMenu : true,
		lineBreak : true,
		cellSelect : true,
		columnLines : true,
        loadMask: {msg:'正在装载...'},
        tbar:tools,
		contextMenu : new Ext.menu.Menu({items:contextmenus}),
		listeners : {
			'cellcontextmenu' : function(g, row, col, e){
				g.getSelectionModel().select(row, col);
				g.contextMenu.showAt(e.getXY());
			}
		},
		sm : sm,
		columns : columns,
		store : store
	});
	
	panel.getSelectedCell = function(){
		var cell = sm.getSelectedCell();
		if(cell != null){
			var record = store.getAt(cell[0]);
			var fieldname = fields[cell[1]].name;
			var data = record.get(fieldname);
			return {record : record, fieldname:fieldname, data:data};
		}
		return undefined;
	}
	
	// 视图刷新
	panel.refresh = function(params){
		store.baseParams.day = dateSelect.getRawValue() + '-01';
		store.reload();
	}

	// 输出附加脚本 begin
<%
	if(cfg!=null && cfg.has("customscript")){
		out.print(cfg.get("customscript").getAsString());
	}
%>
	// 输出附加脚本 end
	panel.add(grid);
	panel.doLayout();
	// 初始化视图数据
	panel.refresh(panel.initParams);
});
</script>