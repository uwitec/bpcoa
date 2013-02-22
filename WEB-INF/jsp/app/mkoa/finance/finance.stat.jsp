<%@ page contentType="text/html; charset=utf-8"%>
<%@ page import="java.util.List"%>
<%@ page import="java.util.Date"%>
<%@ page import="com.mixky.toolkit.DateUtil"%>
<%@ page import="com.mixky.app.mkoa.finance.FinanceManager"%>
<%
	String panelid = request.getParameter("panelid");
	String month = DateUtil.format(new Date(System.currentTimeMillis()), "yyyy-MM");
%>
<script language='javascript'>
Ext.onReady(function(){

	var panel = Ext.getCmp('<%=panelid%>');

	// 数据访问
	var store1 = new Ext.data.DirectStore({
		directFn : FinanceAppDirect.getFinanceStat,
		paramOrder : ['month'],
		baseParams : {month:'<%=month%>'},
		remoteSort : true,
		root : 'results',
		totalProperty : 'totals',
		idProperty : 'F_SUBJECT_NO',
		fields : [{
			name : 'F_SUBJECT_NO',
			mapping : 'F_SUBJECT_NO'
		}, {
			name : 'F_LEVEL',
			mapping : 'F_LEVEL'
		}, {
			name : 'F_PARENT_NO',
			mapping : 'F_PARENT_NO'
		}, {
			name : 'F_SUBJECT',
			mapping : 'F_SUBJECT'
		}, {
			name : 'F_COUNT',
			mapping : 'F_COUNT'
		}, {
			name : 'F_IN',
			mapping : 'F_IN'
		}, {
			name : 'F_OUT',
			mapping : 'F_OUT'
		}, {
			name : 'F_FLOW',
			mapping : 'F_FLOW'
		}]
	});
	var store2 = new Ext.data.DirectStore({
		directFn : FinanceAppDirect.getFinanceTagStat,
		paramOrder : ['month'],
		baseParams : {month:'<%=month%>'},
		remoteSort : true,
		root : 'results',
		totalProperty : 'totals',
		idProperty : 'F_SUBJECT_NO',
		fields : [{
			name : 'F_SUBJECT_NO',
			mapping : 'F_SUBJECT_NO'
		}, {
			name : 'F_SUBJECT',
			mapping : 'F_SUBJECT'
		}, {
			name : 'F_COUNT',
			mapping : 'F_COUNT'
		}, {
			name : 'F_IN',
			mapping : 'F_IN'
		}, {
			name : 'F_OUT',
			mapping : 'F_OUT'
		}, {
			name : 'F_FLOW',
			mapping : 'F_FLOW'
		}]
	});
	var store3 = new Ext.data.DirectStore({
		directFn : FinanceAppDirect.getFinanceDetailStat,
		paramOrder : ['month'],
		baseParams : {month:'<%=month%>'},
		remoteSort : true,
		root : 'results',
		totalProperty : 'totals',
		idProperty : 'F_SUBJECT_NO',
		fields : [{
			name : 'F_SUBJECT_NO',
			mapping : 'F_SUBJECT_NO'
		}, {
			name : 'F_SUBJECT',
			mapping : 'F_SUBJECT'
		}, {
			name : 'F_IN',
			mapping : 'F_IN'
		}, {
			name : 'F_OUT',
			mapping : 'F_OUT'
		}, {
			name : 'F_FLOW',
			mapping : 'F_FLOW'
		}]
	});

	// 选择当前月
	var dateSelect = new Ext.form.DateField({
		value:'<%=month%>', 
		editable : false, 
		width : 70,
		format : 'Y-m',
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
		var date = Date.parseDate(store1.baseParams.month + '-01', 'Y-m-d');
			dateSelect.setValue(date.add(Date.MONTH, 1).format('Y-m-d'));
			panel.refresh();
		}
	});
	// 下月
	var btnPreMonth = new Ext.Action({
		iconCls : 'icon-sys-btnback',
		handler : function(){
		var date = Date.parseDate(store1.baseParams.month + '-01', 'Y-m-d');
			dateSelect.setValue(date.add(Date.MONTH, -1).format('Y-m-d'));
			panel.refresh();
		}
	});
	// 刷新
	var btnRefresh = new Ext.Action({
		text : '刷新',
		iconCls : 'icon-sys-refresh',
		handler : function(){
		var date = new Date(store1.baseParams.month + '-01');
			panel.refresh();
		}
	});

	var numberRenderer = function(value, metaData, record, rowIndex, colIndex, store){
		if(record.get("F_SUBJECT_NO") == 'SUM'){
			metaData.attr = 'style="color:blue;font-weight:bold;"';
		}
		return value;
	}

	var subjectRenderer = function(value, metaData, record, rowIndex, colIndex, store){
		for(var i=1;i<record.get("F_LEVEL");i++){
			value = "　" + value;
		}
		return value;
	}

	var storeChart = new Ext.data.JsonStore({
		pruneModifiedRecords : true,
        fields: ['name', 'in', 'out', 'flow']
    });
	// 表格对象
	var grid1 = new Ext.grid.GridPanel({
		title : '按科目统计',
		border : false,
		stripeRows: false,
		enableHdMenu : false,
		lineBreak : false,
        loadMask: {msg:'正在装载...'},
		tbar : [btnPreMonth, dateSelect, btnNextMonth, '->', btnRefresh],
		columns : [{
			id : 'F_SUBJECT_NO',
			dataIndex : 'F_SUBJECT_NO',
			header : '编码',
			width : 100,
			renderer : subjectRenderer
		}, {
			id : 'F_SUBJECT',
			dataIndex : 'F_SUBJECT',
			header : '名称',
			width : 120,
			renderer : subjectRenderer
		}, {
			id : 'F_COUNT',
			dataIndex : 'F_COUNT',
			header : '发生数量',
			width : 70
		}, {
			id : 'F_IN',
			dataIndex : 'F_IN',
			header : '收入',
			width : 70,
			renderer : numberRenderer
		}, {
			id : 'F_OUT',
			dataIndex : 'F_OUT',
			header : '支出',
			width : 70,
			renderer : numberRenderer
		}, {
			id : 'F_FLOW',
			dataIndex : 'F_FLOW',
			header : '流水',
			width : 70,
			renderer : numberRenderer
		}],
		store : store1,
		getRelateRecords : function(record){
			if(!record){
				record = this.getSelectionModel().getSelected();
			}
			var no= "SUM";
			if(record && record.get("F_PARENT_NO") != ''){
				no = record.get("F_PARENT_NO");
			}
			var datas = [];
			for(var i=0;i<store1.getCount();i++){
				var record = store1.getAt(i);
				if(record.get("F_PARENT_NO") == no){
					datas.push({
						'name' : record.get("F_SUBJECT"),
						'in' : record.get("F_IN"),
						'out' : record.get("F_OUT"),
						'flow' : record.get("F_FLOW")
					})
				}
			}
			return datas;
		},
		refreshChartData : function(){
			var datas = this.getRelateRecords();
			storeChart.loadData(datas);
        },
        listeners : {
            'rowclick' : function(){
        		grid1.refreshChartData();
            }
        }
	});
	var grid2 = new Ext.grid.GridPanel({
		title : '按标签统计',
		border : false,
		stripeRows: false,
		enableHdMenu : false,
		lineBreak : false,
        loadMask: {msg:'正在装载...'},
		tbar : [btnPreMonth, dateSelect, btnNextMonth, '->', btnRefresh],
		columns : [{
			id : 'F_SUBJECT',
			dataIndex : 'F_SUBJECT',
			header : '标签',
			width : 120,
			renderer : subjectRenderer
		}, {
			id : 'F_COUNT',
			dataIndex : 'F_COUNT',
			header : '发生数量',
			width : 70
		}, {
			id : 'F_IN',
			dataIndex : 'F_IN',
			header : '收入',
			width : 70,
			renderer : numberRenderer
		}, {
			id : 'F_OUT',
			dataIndex : 'F_OUT',
			header : '支出',
			width : 70,
			renderer : numberRenderer
		}, {
			id : 'F_FLOW',
			dataIndex : 'F_FLOW',
			header : '流水',
			width : 70,
			renderer : numberRenderer
		}],
		store : store2,
		refreshChartData : function(record){
			var datas = [];
			for(var i=0;i<store2.getCount();i++){
				var record = store2.getAt(i);
				datas.push({
					'name' : record.get("F_SUBJECT"),
					'in' : record.get("F_IN"),
					'out' : record.get("F_OUT"),
					'flow' : record.get("F_FLOW")
				});
			}
			storeChart.loadData(datas);
		}
	});
	var grid3 = new Ext.grid.GridPanel({
		title : '按费用明细统计',
		border : false,
		stripeRows: false,
		enableHdMenu : false,
		lineBreak : false,
        loadMask: {msg:'正在装载...'},
		tbar : [btnPreMonth, dateSelect, btnNextMonth, '->', btnRefresh],
		columns : [{
			id : 'F_SUBJECT',
			dataIndex : 'F_SUBJECT',
			header : '名称',
			width : 120,
			renderer : subjectRenderer
		}, {
			id : 'F_COUNT',
			dataIndex : 'F_COUNT',
			header : '发生数量',
			width : 70
		}, {
			id : 'F_IN',
			dataIndex : 'F_IN',
			header : '收入',
			width : 70,
			renderer : numberRenderer
		}, {
			id : 'F_OUT',
			dataIndex : 'F_OUT',
			header : '支出',
			width : 70,
			renderer : numberRenderer
		}, {
			id : 'F_FLOW',
			dataIndex : 'F_FLOW',
			header : '流水',
			width : 70,
			renderer : numberRenderer
		}],
		store : store3,
		refreshChartData : function(record){
			var datas = [];
			for(var i=0;i<store3.getCount();i++){
				var record = store3.getAt(i);
				datas.push({
					'name' : record.get("F_SUBJECT"),
					'in' : record.get("F_IN"),
					'out' : record.get("F_OUT"),
					'flow' : record.get("F_FLOW")
				});
			}
			storeChart.loadData(datas);
		}
	});

	var chart1 = new Ext.chart.PieChart({
		store : storeChart,
        dataField: 'in',
        categoryField: 'name',
        extraStyle:
        {
            legend:
            {
                display: 'left',
                padding: 5
            }
        }
	});
	var chart2 = new Ext.chart.PieChart({
		store : storeChart,
        dataField: 'out',
        categoryField: 'name',
        extraStyle:
        {
            legend:
            {
                display: 'left',
                padding: 5
            }
        }
	});
	var chart3 = new Ext.chart.StackedBarChart({
		store : storeChart,
		yField: 'name',
		xField: 'flow'
	});

	store1.on('load', function(){
		grid1.refreshChartData();
	});
	store2.on('load', function(){
		grid2.refreshChartData();
	});
	store3.on('load', function(){
		grid3.refreshChartData();
	});
	
	var chart = new Ext.Panel({
		region : 'east',
		border : false,
		split : true,
		autoScroll : true,
        collapseMode:'mini',
        minSize: 200,
        maxSize: 600,
        width : 350,
        defaults : {
			border : false
        },
        items :[{
            title: '收入分布结构图',
            height : 300,
    		items : chart1
        }, {
            title: '支出分布结构图',
            height : 300,
    		items : chart2
        }, {
            title: '财务流水对比图',
            height : 450,
    		items : chart3
        }]
	});
	
	// 视图刷新
	panel.refresh = function(params){
		var grid = panel.items.get(0).items.get(0).getActiveTab();
		store1.baseParams.month = dateSelect.getRawValue();
		store2.baseParams.month = dateSelect.getRawValue();
		store3.baseParams.month = dateSelect.getRawValue();
		grid.getStore().reload();
	}
	
	var ui = new Ext.Panel({
		layout:'border',
		border : false,
		items : [new Ext.TabPanel({
			region : 'center',
			activeTab: 0,
			border : false,
			items :[grid1, grid2, grid3],
			listeners : {
				'tabchange' : function(tabs, grid){
					panel.refresh();
				}
			}
		}), chart]
	});
	
	// 输出附加脚本 end
	panel.add(ui);
	panel.doLayout();
	// 初始化视图数据
	panel.refresh();
});
</script>