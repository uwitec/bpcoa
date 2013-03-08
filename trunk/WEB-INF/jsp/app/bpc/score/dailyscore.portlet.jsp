<%@ page contentType="text/html; charset=utf-8"%>
<%@ page import="java.util.Date"%>
<%@ page import="com.mixky.toolkit.DateUtil"%>
<%@ page import="com.mixky.engine.organization.User"%>
<%
	// 读取参数
	String key = request.getParameter("key");
	String panelid = "portlet-" + key;
	String date = DateUtil.format(new Date(System.currentTimeMillis()), DateUtil.FORMAT_DATE);
	User user = (User)request.getAttribute("user");
	String defaultAction = "";
	
%>
<script language='javascript'>
Ext.onReady(function(){

	var panel = Ext.getCmp('<%=panelid%>');
		
	// 数据访问
	var fields = [{"name":"ID","mapping":"ID"},{"name":"F_USER_ID","mapping":"F_USER_ID"},{"name":"F_USER_NAME","mapping":"F_USER_NAME"},{"name":"F_MANAGER_ID","mapping":"F_MANAGER_ID"},{"name":"F_MANAGER_NAME","mapping":"F_MANAGER_NAME"},{"name":"F_DEPT_NAME","mapping":"F_DEPT_NAME"},{"name":"F_SCORE","mapping":"F_SCORE","type":"float"},{"name":"F_SCOREDATE","mapping":"F_SCOREDATE"}];
	
	var store = new Ext.data.DirectStore({
		directFn : ScoreAppDirect.getDailyScore,
		paramOrder : ['userid', 'day'],
		baseParams : {
			userid:<%=user.getId()%>
			,day:'<%=DateUtil.format(new Date(System.currentTimeMillis()), "yyyy-MM-dd")%>'
			},
		remoteSort : true,
		root : 'results',
		totalProperty : 'totals',
		idProperty : 'ID',
		fields : fields
	});

	var sm = new Ext.grid.RowSelectionModel({singleSelect : true});

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

	var storeChart = new Ext.data.JsonStore({
		pruneModifiedRecords : true,
        fields: ['name', 'dept', 'score', 'scoredate']
    });
	
	var numberRenderer = function(value, metaData, record, rowIndex, colIndex, store){
		if(record.get("F_MANAGER_ID") == <%=user.getId()%> ){
			metaData.attr = 'style="color:blue;font-weight:bold;"';
		}
		return value;
	}
	

	// 选择当前日
	var dateSelect = new Ext.form.DateField({
		value:'<%=DateUtil.format(new Date(System.currentTimeMillis()), "yyyy-MM-dd")%>', 
		editable : false, 
		format : 'Y-m-d',
		width : 100,
		listeners : {
			'select' : function(){
				store.baseParams.day = dateSelect.getRawValue() + '';
				worklogPanel.refresh({userid: 0, username: '', date: store.baseParams.day});
				store.reload();
			}
		}
	});
	// 下一日
	var btnNextDay = new Ext.Action({
		iconCls : 'icon-sys-btnnext',
		handler : function(){
			var date = Date.parseDate(store.baseParams.day, 'Y-m-d');
			dateSelect.setValue(date.add(Date.DAY, 1).format('Y-m-d'));
			store.baseParams.day = dateSelect.getRawValue() + '';
			worklogPanel.refresh({userid: 0, username: '', date: store.baseParams.day});
			store.reload();
		}
	});
	// 上一日
	var btnPreDay = new Ext.Action({
		iconCls : 'icon-sys-btnback',
		handler : function(){
			var date = Date.parseDate(store.baseParams.day, 'Y-m-d');
			dateSelect.setValue(date.add(Date.DAY, -1).format('Y-m-d'));
			store.baseParams.day = dateSelect.getRawValue() + '';
			worklogPanel.refresh({userid: 0, username: '', date: store.baseParams.day});
			store.reload();
		}
	});
	
	var lblManager = new Ext.form.Label({
		text: '评分人: <%=user.getF_caption()%>'
	});
	
	var btnSave = new Ext.Action({
		text : '保存评分结果',
		iconCls : 'icon-sys-save',
		handler : function(){
		Ext.MessageBox.confirm('操作提示', '请确认是否要提交评分结果？', function(btn){
				if(btn == 'yes'){
					panel.submit();
				}
			});
		}
	});
	
		// 保存列表
	panel.submit = function(){
		if(roweditor.editing){
			MixkyApp.showAlertMessage("无法保存，请关闭【frmDailyScore】编辑界面");
			return;
		}
		var modifieds = store.getModifiedRecords();
		if(modifieds.length > 0){
			var record = modifieds[0];
			var item = record.getChanges();
			item.ID = record.get('ID');
			item.rowstate = record.get('rowstate');
			DocumentAppDirect.submitRowForm('mkScore.T_MK_BPC_SCORE_DAY.frmDailyScore', item, function(result, e){
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
					MixkyApp.showDirectActionFail("保存【frmDailyScore】数据", result, e);
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
		
	// 表格对象
	var grid = new Ext.grid.GridPanel({
		region : 'center',
		height : 500,
		border : false,
		stripeRows: false,
		enableHdMenu : true,	
		lineBreak : false,
		tbar : [lblManager, btnPreDay, dateSelect, btnNextDay, '-',btnSave ],
 		columns : [{
			id : 'F_USER_NAME',
			dataIndex : 'F_USER_NAME',
			header : '用户名称',
			width : 100
		}, {
			id : 'F_DEPT_NAME',
			dataIndex : 'F_DEPT_NAME',
			header : '部门',
			width : 100
			// renderer : numberRenderer
		}, {
			id : 'F_SCORE',
			dataIndex : 'F_SCORE',
			header : '分数',
			width :60,
			editor :{"xtype":"numberfield","selectOnFocus":false,"allowBlank":false,"maxLength":4,"allowDecimals":true}
			// renderer : numberRenderer
		}, {
			id : 'F_SCOREDATE',
			dataIndex : 'F_SCOREDATE',
			header : '打分日期',
			width : 100
			// renderer : numberRenderer
		}],
		plugins : [roweditor],
		viewConfig:{
			getRowClass: function(record, index) {
				if(record.dirty){
					return 'mixky-grid-row-changed';
				}
		    }
		},
		sm : sm,
		store : store,
		refresh : function(){
			var datas = [];
			for(var i=0;i<store.getCount();i++){
				var record = store.getAt(i);
				if(record.get("F_MANAGER_ID") == <%=user.getId()%>){
					datas.push({
						'name' : record.get("F_USER_NAME"),
						'dept' : record.get("F_DEPT_NAME"),
						'score' : record.get("F_SCORE"),
						'scoredate' : record.get("F_SCOREDATE")
					});
				}
			}
			store.loadData(datas);
    	},
    	listeners : {
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

	store.on('load', function(){
		grid.refresh();
	});
	

	panel.refresh = function(params){
		if(Ext.isDefined(params)){
			panel.params = params;
		}
		// 初始化参数
		store.baseParams.params = {};
		Ext.apply(store.baseParams.params, panel.viewparams);
		Ext.apply(store.baseParams.params, panel.params);
		store.reload();
	}
	
	// 输出附加脚本 begin
	panel.viewparams = {};
	var param_userid = 0;
	var param_username = '';
	var worklogPanelid = Ext.id();
    // 员工当日的日志 begin
    var worklogPanel = new Ext.Panel({
    	region : 'south' ,
    	id : worklogPanelid,
		autoLoad : {
			url : 'page.do',
			scripts:true,
			params:{panelid:worklogPanelid, url:'app/bpc/score/dailyscore.worklog', userid: 0, username: '', date: '2013-01-01'},
			border:false
		},
		height : 150,
		split : true,
		border : false,
		layout : 'fit'
	});
	Ext.apply(worklogPanel.autoLoad.params, 
			{panelid : worklogPanel.getId(), userid : param_userid, username: param_username, date : store.baseParams.day});
	// 列表行选中
	grid.on('rowclick', function(){
		var record = grid.getSelectionModel().getSelected();
		if (record){
			param_userid = record.get('F_USER_ID');
			param_username = record.get('F_USER_NAME');
			worklogPanel.refresh({userid: param_userid, username: param_username, date: store.baseParams.day});
		}
	});

	// 刷新
	panel.refresh = function(){
		store.reload();
	}
	var ui = new Ext.Panel({
		layout:'border',
		border : false,
		defaults : {border:false},
		//tbar : buttons,
		items:[grid, worklogPanel]
	});
	// 员工当日的日志 end
	// 输出附加脚本 end

	panel.add(ui);
	panel.doLayout();
	panel.refresh();
});
</script>