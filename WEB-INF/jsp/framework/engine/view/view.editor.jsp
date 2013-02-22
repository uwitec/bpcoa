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
		directFn : <%=directFn%>,
		paramOrder : ['viewkey','querytype','limit','start','sort','dir','params'],
		baseParams : {viewkey:'<%=view.getKey()%>', querytype:<%=ViewManager.QT_NORMAL%>,limit:0, start:1, sort:'',dir:'',params:{}},
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
	// 视图操作
	var buttons = [<%=ViewManager.VN_REFRESH_BUTTON_NAME%>, '->'];
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
		border : false,
		stripeRows: false,
		enableHdMenu : true,
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
	// 输出附加脚本 end
	panel.add(grid);
	panel.doLayout();
	// 初始化视图数据
	panel.refresh();
});
</script>