<%@ page contentType="text/html; charset=utf-8"%>
<%@ page import="java.util.Date"%>
<%@ page import="com.mixky.toolkit.DateUtil"%>
<%
	// 读取参数
	String key = request.getParameter("key");
	String panelid = "portlet-" + key;
	String date = DateUtil.format(new Date(System.currentTimeMillis()), DateUtil.FORMAT_DATE);
%>
<script language='javascript'>
Ext.onReady(function(){

	var panel = Ext.getCmp('<%=panelid%>');

	// 数据访问
	var store = new Ext.data.DirectStore({
		directFn : FinanceAppDirect.getFinancePortletStat,
		paramOrder : ['month'],
		baseParams : {month:''},
		remoteSort : true,
		root : 'results',
		totalProperty : 'totals',
		idProperty : 'F_SUBJECT_NO',
		fields : ['F_SUBJECT_NO', 'F_SUBJECT', 'F_IN', 'F_OUT']
	});

	var storeChart = new Ext.data.JsonStore({
		pruneModifiedRecords : true,
        fields: ['name', 'in', 'out']
    });
	
	var numberRenderer = function(value, metaData, record, rowIndex, colIndex, store){
		if(record.get("F_SUBJECT_NO") == 'SUM'){
			metaData.attr = 'style="color:blue;font-weight:bold;"';
		}
		return value;
	}

	// 选择月
	var dateSelect = new Ext.form.DateField({
		value:'<%=date%>', 
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
	var btnPreMonth = new Ext.Action({
		iconCls : 'icon-sys-btnback',
		handler : function(){
			//var date = new Date(store.baseParams.month + '-01');
			var date = Date.parseDate(store.baseParams.month + '-01', 'Y-m-d');
			dateSelect.setValue(date.add(Date.MONTH, -1).format('Y-m-d'));
			panel.refresh();
		}
	});
	// 下周
	var btnNextMonth = new Ext.Action({
		iconCls : 'icon-sys-btnnext',
		handler : function(){
			//var date = new Date(store.baseParams.month + '-01');
			var date = Date.parseDate(store.baseParams.month + '-01', 'Y-m-d');
			dateSelect.setValue(date.add(Date.MONTH, 1).format('Y-m-d'));
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
			id : 'F_SUBJECT',
			dataIndex : 'F_SUBJECT',
			header : '名称',
			width : 100
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
		}],
		store : store,
		refreshChartData : function(){
			var datas = [];
			for(var i=0;i<store.getCount();i++){
				var record = store.getAt(i);
				if(record.get("F_SUBJECT_NO") != 'SUM'){
					datas.push({
						'name' : record.get("F_SUBJECT"),
						'in' : record.get("F_IN"),
						'out' : record.get("F_OUT")
					});
				}
			}
			storeChart.loadData(datas);
    	}
	});


	store.on('load', function(){
		grid.refreshChartData();
	});

	var chart1 = new Ext.chart.PieChart({
		store : storeChart,
        dataField: 'out',
        categoryField: 'name',
        tipRenderer : function(chart, record, index, series){
			return '支出构成图\n' + record.get('name') + '：' + record.get('out');
	    },
        extraStyle:
        {
            legend:
            {
                display: 'none'
            }
        }
	});


	var chart2 = new Ext.chart.PieChart({
		store : storeChart,
        dataField: 'in',
        categoryField: 'name',
        tipRenderer : function(chart, record, index, series){
			return '收入构成图\n' + record.get('name') + '：' + record.get('in');
	    },
        extraStyle:
        {
            legend:
            {
                display: 'none'
            }
        }
	});

	var chart = new Ext.Panel({
		region : 'east',
		border : false,
		split : true,
		autoScroll : true,
        collapseMode:'mini',
        minSize: 100,
        maxSize: 400,
        width : 150,
        defaults : {
			border : false
        },
        items :[{
            height : 150,
    		items : chart1
        }, {
            height : 150,
    		items : chart2
        }]
	});

	var ui = new Ext.Panel({
		layout:'border',
		border : false,
		tbar : [btnPreMonth, dateSelect, btnNextMonth],
		items : [grid, chart]
	});
	
	panel.refresh = function(){
		store.baseParams.month = dateSelect.getRawValue();
		store.reload();
	}

	panel.add(ui);
	panel.doLayout();
	panel.refresh();
});
</script>