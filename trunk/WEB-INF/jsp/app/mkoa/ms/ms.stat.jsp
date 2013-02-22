<%@ page contentType="text/html; charset=utf-8"%>
<%@page import="com.mixky.toolkit.DateUtil"%>
<%@page import="java.util.Date"%>
<%
	String panelid = request.getParameter("panelid");
	String month = DateUtil.format(new Date(System.currentTimeMillis()), "yyyy-MM");
%>

<script language='javascript'>
Ext.onReady(function(){
	var panel = Ext.getCmp('<%=panelid%>');

	// 数据访问
	var store = new Ext.data.DirectStore({
		directFn : AppMsDirect.getMsStat,
		paramOrder : ['month'],
		baseParams : {month:'<%=month%>'},
		remoteSort : true,
		root : 'results',
		totalProperty : 'totals',
		idProperty : 'F_SENDER',
		fields : [{
			name : 'F_SENDER',
			mapping : 'F_SENDER'
		}, {
			name : 'F_COUNT',
			mapping : 'F_COUNT'
		}]
	});

	// 选择当前月
	var dateSelect = new Ext.form.DateField({
		value:'<%=month%>', 
		editable : false, 
		width : 70,
		format : 'Y-m'
	});
	// 确定
	var btnChange = new Ext.Action({
		iconCls : 'icon-sys-btnapply',
		handler : function(){
			store.baseParams.month = dateSelect.getRawValue();
			panel.refresh();
		}
	});
	// 上月
	var btnNextMonth = new Ext.Action({
		iconCls : 'icon-sys-btnnext',
		handler : function(){
			//var date = new Date(store.baseParams.month + '-01');
			var date = Date.parseDate(store.baseParams.month + '-01', 'Y-m-d');
			dateSelect.setValue(date.add(Date.MONTH, 1).format('Y-m-d'));
			btnChange.execute();
		}
	});
	// 下月
	var btnPreMonth = new Ext.Action({
		iconCls : 'icon-sys-btnback',
		handler : function(){
		//var date = new Date(store.baseParams.month + '-01');
			var date = Date.parseDate(store.baseParams.month + '-01', 'Y-m-d');
			dateSelect.setValue(date.add(Date.MONTH, -1).format('Y-m-d'));
			btnChange.execute();
		}
	});
	// 刷新
	var btnRefresh = new Ext.Action({
		text : '刷新',
		iconCls : 'icon-sys-refresh',
		handler : function(){
		var date = new Date(store.baseParams.month + '-01');
			panel.refresh();
		}
	});

	// 表格对象
	var grid = new Ext.grid.GridPanel({
		region : 'center',
		border : false,
		stripeRows: false,
		enableHdMenu : false,
		lineBreak : false,
        loadMask: {msg:'正在装载...'},
		columns : [{
			id : 'F_SENDER',
			dataIndex : 'F_SENDER',
			header : '发件人',
			width : 200
		}, {
			id : 'F_COUNT',
			dataIndex : 'F_COUNT',
			header : '数量'
		}],
		store : store
	});


	var chart = new Ext.chart.PieChart({
		store : store,
        dataField: 'F_COUNT',
        categoryField: 'F_SENDER',
        extraStyle:
        {
            legend:
            {
                display: 'left',
                padding: 5
            }
        }
	});

	
	var ui = new Ext.Panel({
		layout:'border',
		border : false,
		tbar : [btnPreMonth, btnNextMonth,'-',dateSelect, btnChange, '->', btnRefresh],
		items : [grid, {
			region : 'east',
			border : false,
			split : true,
	        collapseMode : 'mini',
	        minSize: 150,
	        maxSize: 350,
	        width : 250,
			items : chart
		}]
	});

	// 视图刷新
	panel.refresh = function(params){
		store.reload();
	}

	panel.add(ui);	
	panel.doLayout();
	panel.refresh();
	
});
</script>