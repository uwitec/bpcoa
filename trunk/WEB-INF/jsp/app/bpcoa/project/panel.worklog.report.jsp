<%@ page contentType="text/html; charset=utf-8"%>
<%@page import="com.mixky.engine.organization.User"%>
<%@page import="com.mixky.app.certification.MixkyUserCertification"%>
<%@page import="com.mixky.app.mkoa.netfolder.FolderItem"%>
<%@page import="com.mixky.toolkit.DateUtil"%>
<%@page import="java.util.Date"%>
<%
	String panelid = request.getParameter("panelid");
	long documentid = Long.parseLong(request.getParameter("documentid"));
	User user = MixkyUserCertification.instance().getUserInfo(request);
%>

<script language='javascript'>

Ext.onReady(function(){
	var panel = Ext.getCmp('<%=panelid%>');
	var documentId = <%=documentid%>;
	var fromdate = '<%=DateUtil.format(new Date(System.currentTimeMillis()), "yyyy-MM-dd")%>';
	var todate = '<%=DateUtil.format(new Date(System.currentTimeMillis()), "yyyy-MM-dd")%>';
	// 数据访问
	var store = new Ext.data.DirectStore({
		directFn : WorklogAppDirect.getUserWorkReport,
		paramOrder:[ 'projectId','fromdate', 'todate'],
		baseParams:{fromdate:fromdate,todate:todate},
		root : 'results',
		totalProperty : 'totals',
		idProperty : 'ID',
		fields:["F_NAME","F_WORKLOG"]
	});

	
	// 显示列
	var columns = [
      	{id:"F_NAME",header:"名称",dataIndex:"F_NAME",width:100},
      	{id:"F_WORKLOG",header:"工作量",dataIndex:"F_WORKLOG",width:100}
      ];

    // 视图操作
	// 刷新按钮
	var btnRefresh = new Ext.Action({
		text : '刷新',
		iconCls : 'icon-sys-refresh',
		handler : function(){
			panel.refresh();
		}
	});
    
	// 选择当前月
	var dateFrom = new Ext.form.DateField({
		value:'<%=DateUtil.format(new Date(System.currentTimeMillis()), "yyyy-MM-dd")%>', 
		fieldLabel:'从',
		editable : false, 
		format : 'Y-m-d',
		width : 90,
		listeners : {
			'select' : function(){
				fromdate = dateFrom.getRawValue() + '';
			}
		}
	});
	
	// 选择当前月
	var dateTo = new Ext.form.DateField({
		value:'<%=DateUtil.format(new Date(System.currentTimeMillis()), "yyyy-MM-dd")%>', 
		fieldLabel:'到',
		editable : false, 
		format : 'Y-m-d',
		width : 90,
		listeners : {
			'select' : function(){
				todate = dateTo.getRawValue() + '';
			}
		}
	});
    
    var btnSearch =  new Ext.Action({
    	text: '确定',
        handler:function(){
        	panel.refresh({'fromdate':fromdate,'todate':todate});
        	//worklogPanel.refresh({userid: 0, username: '', date: store.baseParams.yyyy_mm});
        }
    });

	var buttons = [{xtype: 'tbtext', text: '工作量'},'->','从',dateFrom,'到',dateTo, btnSearch,"-", '-', btnRefresh];

	var sm = new Ext.grid.RowSelectionModel({singleSelect:true});

	// 表格对象
	var grid = new Ext.grid.GridPanel({
		border : false,
		stripeRows: true,
		enableHdMenu : true,
		lineBreak : true,
		cellSelect : false,
        loadMask: {msg:'正在装载...'},
		autoExpandColumn : 'F_WORKLOG',
		sm : sm,
		columns : columns,
		store : store,
		tbar : buttons,
		
		listeners:{
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
		if(Ext.isDefined(params) && Ext.isDefined(params.fromdate)&& Ext.isDefined(params.todate)){
			store.baseParams.fromdate = params.fromdate;
			store.baseParams.todate = params.todate;
		}
		//alert(store.baseParams.fromdate);
		store.baseParams.projectId = documentId;
		// 初始化参数
		store.reload();
	}

	panel.add(grid);
	panel.doLayout();
	// 初始化视图数据
	panel.refresh(panel.initParams);
	
});


</script>