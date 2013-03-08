<%@ page contentType="text/html; charset=utf-8"%>
<%@ page import="java.util.List"%>
<%@ page import="java.util.Map"%>
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
<%@ page import="java.util.Date"%>
<%@ page import="com.mixky.toolkit.DateUtil"%>
<%@ page import="com.mixky.app.bpc.score.ScoreManager"%>
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
	String directFn = "ViewAppDirect.getViewList";
	if(cfg.has("directFn")){
		directFn = cfg.get("directFn").getAsString();
	}
	
	boolean orderable = false;
	if(cfg != null && cfg.has("orderable")){
		orderable = cfg.get("orderable").getAsBoolean();
	}
	String defaultAction = "";
	// 获取当前登录者的评分对象
	String yyyy_mm = DateUtil.format(new Date(System.currentTimeMillis()), "yyyy-MM");
	String comboDataString = ScoreManager.instance().getComboDataString(user.getId(), yyyy_mm);	
%>
<script language='javascript'>
Ext.onReady(function(){
	var panel = Ext.getCmp('<%=panelid%>');
	// 是否支持排序
	var orderable = <%=orderable%>;
	// 显示字段
	var fields = <%=ViewManager.instance().getViewStoreFields(view.getF_columns())%>;
	fields.push({name:'rowstate', mapping:'rowstate'});
	// 数据访问
	var store = new Ext.data.DirectStore({
		pruneModifiedRecords : true,
		directFn : ScoreAppDirect.getDailyScoreByUserYYYYMM,
		paramOrder : ['manager_id', 'user_id', 'yyyy_mm'],
		baseParams : {
			manager_id:<%=user.getId()%>
			,user_id: 0
			,yyyy_mm:'<%=DateUtil.format(new Date(System.currentTimeMillis()), "yyyy-MM")%>'
			},
		sortInfo: orderable ? {field:'F_ORDER', direction: 'ASC'} : undefined,
		root : 'results',
		totalProperty : 'totals',
		idProperty : '<%=view.getF_keycolumn()%>',
		fields : fields
	});
<%
	// 选择器
	if(view.getF_single_select()){
%>
	var sm = new Ext.grid.RowSelectionModel({singleSelect : true});
<%
	}else{
%>
	var sm = new Ext.grid.CheckboxSelectionModel();
<%
	}
%>
	// 显示列
	var columns = <%=ViewManager.instance().getViewColumnsByTableForm(view.getF_columns(), tableform)%>;

	// 刷新按钮
	var <%=ViewManager.VN_REFRESH_BUTTON_NAME%> = new Ext.Action({
		text : '刷新',
		iconCls : 'icon-sys-refresh',
		handler : function(){
			store.baseParams.querytype = <%=ViewManager.QT_NORMAL%>;
			panel.refresh();
		}
	});
	// 选择当前月
	var dateSelect = new Ext.form.DateField({
		value:'<%=DateUtil.format(new Date(System.currentTimeMillis()), "yyyy-MM")%>', 
		editable : false, 
		format : 'Y-m',
		width : 70,
		listeners : {
			'select' : function(){
				store.baseParams.yyyy_mm = dateSelect.getRawValue() + '';
				ReloadComboData();
				store.reload();
				worklogPanel.refresh({userid: 0, username: '', date: store.baseParams.yyyy_mm});
			}
		}
	});
	// 下一月
	var btnNextMonth = new Ext.Action({
		iconCls : 'icon-sys-btnnext',
		handler : function(){
			var date = Date.parseDate(store.baseParams.yyyy_mm + '-01', 'Y-m-d');
			dateSelect.setValue(date.add(Date.MONTH, 1).format('Y-m-d'));
			store.baseParams.yyyy_mm = dateSelect.getRawValue() + '';
			ReloadComboData();
			store.reload();
			worklogPanel.refresh({userid: 0, username: '', date: store.baseParams.yyyy_mm});
		}
	});
	// 上一月
	var btnPreMonth = new Ext.Action({
		iconCls : 'icon-sys-btnback',
		handler : function(){
			var date = Date.parseDate(store.baseParams.yyyy_mm + '-01', 'Y-m-d');
			dateSelect.setValue(date.add(Date.MONTH, -1).format('Y-m-d'));
			store.baseParams.yyyy_mm = dateSelect.getRawValue() + '';
			ReloadComboData();
			store.reload();
			worklogPanel.refresh({userid: 0, username: '', date: store.baseParams.yyyy_mm});
		}
	});
	
	// 人员下拉选框
	var storeUser = new Ext.data.ArrayStore({
    	fields: ['f_user_id', 'f_user_name'],
    	data : <%=comboDataString%>
	});
	var comboUser = new Ext.form.ComboBox({
    	typeAhead: true,
    	lazyRender:true,
    	triggerAction: 'all',
    	mode: 'local',
    	store: storeUser,
    	valueField: 'f_user_id',
    	displayField: 'f_user_name',
    	emptyText: '请选择',
    	selectOnFocus:true,
    	editable: false,
    	width: 100,
    	listeners:{
    		'select': function event_select_user(combo, record, index){
    			store.baseParams.user_id = record.get('f_user_id');
    			store.reload();
				worklogPanel.refresh({userid: 0, username: '', date: store.baseParams.yyyy_mm});
    		}
    	}
	});
	// 重新加载员工下拉选项
	function ReloadComboData(){
		var data=[];
		comboUser.clearValue();
        ScoreAppDirect.getComboData(<%=user.getId()%>, dateSelect.getRawValue(),
			function(result, e){
				if(null != result.data){
					for (var i=0; i < result.data.length; i++){
						data.push([result.data[i]['f_user_id'], result.data[i]['f_user_name']]);
					}
				}
				comboUser.store.loadData(data);
		});	
	}
	// 初始化
	var btnInit =  new Ext.Action({
		"text":"初始化","iconCls":"icon-sys-run","handler":function(){
		if (comboUser.getRawValue() == '') return;
		var yyyy = dateSelect.getRawValue().substr(0,4);
		var mm = dateSelect.getRawValue().substr(5,2);
		var msg = '该操作将初始化用户['+ comboUser.getRawValue() +']'+ yyyy +'年'+ mm +'月的每日评分。您确定吗？';
		Ext.MessageBox.confirm('操作提示', msg, function(btn){
				if(btn == 'yes'){
					init();
				}
			});
		}
	});
	// 初始化
	function init()
	{
		ScoreAppDirect.initDailyScoreByUserYYYYMM(
			store.baseParams.manager_id,
			store.baseParams.user_id,
			store.baseParams.yyyy_mm,
			function(result, e){
				if(result && result.success){
					MixkyApp.showInfoMessage("初始化成功!", "操作提示");
					panel.refresh();
				}else{
					MixkyApp.showDirectActionFail("初始化失败", result, e);
				}
		});
	}
	//
	// 保存按钮
	var btnSave = new Ext.Action({
		text : '保存评分',
		iconCls : 'icon-sys-save',
		handler : function(){
		Ext.MessageBox.confirm('操作提示', '请确认是否要提交评分结果？', function(btn){
				if(btn == 'yes'){
					panel.submit();
				}
			});
		}
	});
	
	var lblUser = new Ext.form.Label({
		text: '员工: '
	});
	
	// 视图操作
	var buttons = ['-',btnPreMonth, dateSelect, btnNextMonth, '-', lblUser, comboUser, '-', btnInit, btnSave, '->', <%=ViewManager.VN_REFRESH_BUTTON_NAME%>, '->'];
	// add by qi end
<%
	for(int i=0;i<buttons.size();i++){
		Action button = buttons.get(i);
			// 输出按钮
%>
	<%=button.output()%>
	buttons.push(<%=button.getF_key()%>);
<%
		// 双击默认操作
		if(button.getF_default()){
			defaultAction = button.getF_key() + ".execute()";
		}
	}
%>
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
		region : 'center',
		border : false,
		stripeRows: false,
		enableHdMenu : true,
		loadMask: {msg:'正在装载...'},
		autoExpandColumn : '<%=view.getF_autoexpandcolumn()%>',
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
		tbar : buttons,
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
	// 上移
	panel.moveUp = function(){
		if(roweditor.editing){
			MixkyApp.showAlertMessage("无法移动，请关闭编辑界面");
			return;
		}
		var record = grid.getSelectionModel().getSelected();
		if(!record){
			return;
		}
		var index = grid.getStore().indexOf(record);
		if(index == 0){
			return;
		}
		var recordPre = store.getAt(index - 1);
		record.set('F_ORDER', index);
		recordPre.set('F_ORDER', index + 1);
		grid.getStore().sort('F_ORDER', 'ASC');
	}
	// 下移
	panel.moveDown = function(){
		if(roweditor.editing){
			MixkyApp.showAlertMessage("无法移动，请关闭编辑界面");
			return;
		}
		var record = grid.getSelectionModel().getSelected();
		if(!record){
			return;
		}
		var index = grid.getStore().indexOf(record);
		var recordNext = store.getAt(index + 1);
		record.set('F_ORDER', index + 2);
		recordNext.set('F_ORDER', index + 1);
		grid.getStore().sort('F_ORDER', 'ASC');
	}
	// 添加
	panel.addRecord = function(config){
		if(roweditor.editing){
			MixkyApp.showAlertMessage("无法添加，请关闭编辑界面");
			return;
		}
		Mixky.lib.getNewTableRecordId('<%=tableform.getParent().getF_key()%>', function(newId){
			var record = new store.recordType(Ext.apply({ID : newId, rowstate : 'add'}, config), newId);
			var index = store.getCount();
			store.insert(index, record);
			if(orderable){
				record.set('F_ORDER', index + 1);
			}
			grid.getSelectionModel().selectRow(index);
		});
	}
	// 删除
	panel.removeRecord = function(){
		if(roweditor.editing){
			MixkyApp.showAlertMessage("无法删除，请关闭编辑界面");
			return;
		}
		var cm = grid.getSelectionModel();
		var record = cm.getSelected();
		if(record){
			var index = store.indexOf(record);
			if(record.get('rowstate') == 'add'){
				store.remove(record);
			}else{
				record.set('rowstate', 'del');
				store.filterBy(function(record, id){
					if(record.get('rowstate') == 'del'){
						return false;
					}else{
						return true;
					}
				});
			}
			if(orderable){
				for(var i=index;i<store.getCount();i++){
					var record = store.getAt(i);
					record.set('F_ORDER', i + 1);
				}
			}
			if(store.getCount() > 0){
				if(index >= store.getCount() - 1){
					cm.selectLastRow()
				}else{
					cm.selectRow(index)
				}
			}
		}
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
<%
	if(cfg!=null && cfg.has("customscript")){
		out.print(cfg.get("customscript").getAsString() + '\n');
	}
	
	if(cfg!=null && cfg.has("params")){
		out.print("panel.viewparams = " + cfg.get("params") + ";");
	}else{
		out.print("panel.viewparams = {};");
	}
%>
	var param_userid = 0;
	var param_username = '';
	var param_scoredate = '2013-01-01';
	var worklogPanelid = Ext.id();
    // 员工当日的日志 begin
    var worklogPanel = new Ext.Panel({
    	region : 'east' ,
    	id : worklogPanelid,
		autoLoad : {
			url : 'page.do',
			scripts:true,
			params:{panelid:worklogPanelid, url:'app/bpc/score/dailyscore.worklog', userid: 0, username: '', date: '2013-01-01'},
			border:false
		},
		width : 650,
		split : true,
		border : false,
		layout : 'fit'
	});
	Ext.apply(worklogPanel.autoLoad.params, 
			{panelid : worklogPanel.getId(), userid : param_userid, username: param_username, date : param_scoredate});
	// 列表行选中
	grid.on('rowclick', function(){
		var record = grid.getSelectionModel().getSelected();
		if (record){
			param_userid = record.get('F_USER_ID');
			param_username = record.get('F_USER_NAME');
			param_scoredate = record.get('F_SCOREDATE');
			worklogPanel.refresh({userid: param_userid, username: param_username, date: param_scoredate});
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
		items:[grid, worklogPanel]
	});
// 员工当日的日志 end
	// 输出附加脚本 end
	panel.add(ui);
	panel.doLayout();
	// 初始化视图数据
	panel.refresh();
});
</script>