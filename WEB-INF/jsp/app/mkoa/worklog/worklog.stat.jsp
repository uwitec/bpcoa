<%@ page contentType="text/html; charset=utf-8"%>
<%@ page import="java.util.List"%>
<%@ page import="java.util.Date"%>
<%@ page import="com.mixky.toolkit.DateUtil"%>
<%@ page import="com.mixky.app.mkoa.worklog.WorklogManager"%>
<%
	String panelid = request.getParameter("panelid");
	String month = DateUtil.format(new Date(System.currentTimeMillis()), "yyyy-MM");
%>
<script language='javascript'>
Ext.onReady(function(){

	var panel = Ext.getCmp('<%=panelid%>');

	// 数据访问
	var store = new Ext.data.DirectStore({
		directFn : WorklogAppDirect.getWorklogStat,
		paramOrder : ['month'],
		baseParams : {month:'<%=month%>'},
		remoteSort : true,
		root : 'results',
		totalProperty : 'totals',
		idProperty : 'F_USER_ID',
		fields : <%=WorklogManager.instance().getWorklogStatFields()%>
	});

	var numberRenderer = function(value, metaData, record, rowIndex, colIndex, store){
		if(record.get("F_USER_ID") == 0){
			metaData.attr = 'style="color:blue;font-weight:bold;"';
		}else if(colIndex == 2){
			// 合计列
			metaData.attr = 'style="font-weight:bold;"';
		}
		return value;
	}
	
	var sm = new Ext.grid.RowSelectionModel({
		singleSelect : true
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
			//var date = new Date(store.baseParams.month + '-01');
			var date = Date.parseDate(store.baseParams.month + '-01', 'Y-m-d');
			dateSelect.setValue(date.add(Date.MONTH, 1).format('Y-m-d'));
			panel.refresh();
		}
	});
	// 下月
	var btnPreMonth = new Ext.Action({
		iconCls : 'icon-sys-btnback',
		handler : function(){
			//var date = new Date(store.baseParams.month + '-01');
			var date = Date.parseDate(store.baseParams.month + '-01', 'Y-m-d');
			dateSelect.setValue(date.add(Date.MONTH, -1).format('Y-m-d'));
			panel.refresh();
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
		sm : sm,
		tbar : [btnPreMonth, dateSelect, btnNextMonth, '->', btnRefresh],
		columns : <%=WorklogManager.instance().getWorklogStatColumns()%>,
		store : store,
		getSelectedRecords : function(){
			return this.getSelectionModel().getSelections();
		}
	});

	var storeChart1 = new Ext.data.JsonStore({
		pruneModifiedRecords : true,
        fields: ['value', 'name']
    })
	var chart1 = new Ext.chart.PieChart({
		store : storeChart1,
        dataField: 'value',
        categoryField: 'name',
        extraStyle:
        {
            legend:
            {
                display: 'left',
                padding: 5
            }
        },
		refreshData : function(record){
	    	storeChart1.removeAll(true);
			if(!record){
				record = store.getById(0);
			}
			if(!record){
				return;
			}
			var datas = [];
			for(var i=3;i<grid.getColumnModel().getColumnCount();i++){
				datas.push({
					name : grid.getColumnModel().getColumnHeader(i),
					value : record.get(grid.getColumnModel().getDataIndex(i))
				});
			}
			storeChart1.loadData(datas);
        }
	});

	grid.on('rowclick', function(){
		var record = grid.getSelectionModel().getSelected();
		chart1.refreshData(record);
	});

	var storeChart2 = new Ext.data.JsonStore({
		pruneModifiedRecords : true,
        fields: ['value', 'name']
    })
	var chart2 = new Ext.chart.ColumnChart({
		store : storeChart2,
		xField: 'name',
		yAxis: new Ext.chart.NumericAxis({
			displayName: 'value'
		}),
		tipRenderer : function(chart, record, index, series){
			return record.data.name + ' 工作量 ：' + record.data.value;
		},
		refreshData : function(){
			storeChart2.removeAll(true);
			var datas = [];
			for(var i=0;i<store.getCount();i++){
				var record = store.getAt(i);
				if(record.get("F_USER_ID") > 0){
					datas.push({
						name : record.get("F_USER_NAME"),
						value : record.get("F_SUM")
					})
				}
            }
			storeChart2.loadData(datas);
        }
	});

	store.on('load', function(){
		chart1.refreshData();
		chart2.refreshData();
	});

	var chart = new Ext.Panel({
		region : 'south',
		border : false,
		split : true,
        collapseMode:'mini',
        minSize: 300,
        maxSize: 300,
        height : 300,
        layout : 'border',
        defaults : {
			layout : 'fit',
			border : false
        },
        items :[{
    		region : 'west',
    		width : 320,
            title: '工作量分布结构图',
    		items : chart1
        }, {
    		region : 'center',
            title: '员工工作量对比图',
    		items : chart2
        }]
	});
	
	// 视图刷新
	panel.refresh = function(params){
		store.baseParams.month = dateSelect.getRawValue();
		store.reload();
	}
	
	var ui = new Ext.Panel({
		layout:'border',
		border : false,
		items : [grid, chart]
	});
	
	// 输出附加脚本 end
	panel.add(ui);
	panel.doLayout();
	// 初始化视图数据
	panel.refresh();
});
</script>