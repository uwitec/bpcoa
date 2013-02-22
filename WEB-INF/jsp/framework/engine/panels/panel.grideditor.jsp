<%@ page contentType="text/html; charset=utf-8"%>
<%@ page import="java.util.List"%>
<%@ page import="java.util.Map"%>
<%@ page import="com.google.gson.JsonObject"%>
<%@ page import="com.mixky.engine.organization.User"%>
<%@ page import="com.mixky.engine.common.Action"%>
<%@ page import="com.mixky.engine.common.DesignObjectLoader"%>
<%@ page import="com.mixky.engine.document.Document"%>
<%@ page import="com.mixky.engine.document.Panel"%>
<%@ page import="com.mixky.engine.document.DocumentManager"%>
<%@ page import="com.mixky.engine.store.TableForm"%>
<%@ page import="com.mixky.engine.store.Field"%>
<%@ page import="com.mixky.engine.store.StoreManager"%>
<%@ page import="com.mixky.engine.view.View"%>
<%@ page import="com.mixky.engine.view.ViewManager"%>
<%@ page import="com.mixky.engine.document.ObjectAuthority"%>
<%
	// 读取参数
	String panelid = request.getParameter("panelid");
	String documentid = request.getParameter("documentid");
	// 获取属性
	User user = (User)request.getAttribute("user");
	Panel panel = (Panel)request.getAttribute("panel");
	Document document = (Document)request.getAttribute("document");
	Map<String, ObjectAuthority> map = (Map<String, ObjectAuthority>)request.getAttribute("authmap");
	// 获得视图对象
	View view = DesignObjectLoader.instance().loadDesignObject(panel.getF_i_view().get("data").getAsString());
	// 获得表单对象
	TableForm tableform = DesignObjectLoader.instance().loadDesignObject(panel.getF_i_tableform().get("data").getAsString());
	// 获得权限
	List<ObjectAuthority> panelbuttonauths = DocumentManager.instance().getFilterObjectAuthority(map, panel.getF_buttons(), user);
	List<ObjectAuthority> viewbuttonauths = DocumentManager.instance().getFilterObjectAuthority(map, view.getF_buttons(), user);
	// 合并视图及表单按钮
	for(int i=0;i<viewbuttonauths.size();i++){
		panelbuttonauths.add(viewbuttonauths.get(i));
	}
	List<ObjectAuthority> columnauths = DocumentManager.instance().getFilterObjectAuthority(map, view.getF_columns(), user);
	// 视图默认参数
	String documentidParamName = "documentid";
	if(panel.getF_config() != null && panel.getF_config().has("documentidParamName")){
		documentidParamName = panel.getF_config().get("documentidParamName").getAsString();
	}
	boolean orderable = false;
	if(panel.getF_config() != null && panel.getF_config().has("orderable")){
		orderable = panel.getF_config().get("orderable").getAsBoolean();
	}
	// 获得表单字段权限
	List<ObjectAuthority> fieldauths = null;
	if(map == null){
		fieldauths = tableform.getFieldAuths();
	}else{
		fieldauths = DocumentManager.instance().getFilterObjectAuthority(map, tableform.getFields(), user);
	}
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
		directFn : ViewAppDirect.getViewList,
		paramOrder : ['viewkey','querytype','limit','start','sort','dir','params'],
		baseParams : {viewkey:'<%=view.getKey()%>', querytype:<%=ViewManager.QT_NORMAL%>,limit:0, start:1, sort:'',dir:'',params:{'<%=documentidParamName%>':<%=documentid%>}},
		sortInfo: orderable ? {field:'F_ORDER', direction: 'ASC'} : undefined,
		root : 'results',
		totalProperty : 'totals',
		idProperty : '<%=view.getF_keycolumn()%>',
		fields : fields
	});

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
	var contextmenus = [<%=ViewManager.VN_REFRESH_BUTTON_NAME%>, '-'];
<%
	String defaultAction = "";
	for(int i=0;i<panelbuttonauths.size();i++){
		ObjectAuthority auth = panelbuttonauths.get(i);
		// 判断权限
		if(auth.hasAuth(ObjectAuthority.A_READ) || auth.hasAuth(ObjectAuthority.A_EDIT)){
			Action action = (Action)auth.getObject();
			// 输出按钮
%>

	<%=action.output()%>
<%
			if(!action.isHideInToolbar()){
%>
	buttons.push(<%=action.getF_key()%>);
<%
			}
			if(!action.isHideInContextMenu()){
%>
	contextmenus.push(<%=action.getF_key()%>);
<%
			}
			// 双击默认操作
			if(action.getF_default()){
				defaultAction = action.getF_key() + ".execute()";
			}
		}
	}
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
	var columns = <%=ViewManager.instance().getViewColumnsByAuths(columnauths, fieldauths)%>;
	// 行编辑插件
	var roweditor = new Ext.ux.grid.RowEditor({
	    saveText: '确定',
	    cancelText: '取消'
	});
    // 处理编辑结果
    roweditor.on('validateedit', function(rd, changes){
        var store = rd.grid.getStore();
        var cm = rd.grid.colModel;
        for(var k in changes){
            if(cm.getColumnById(k).getEditor() != null){
				var ed = cm.getColumnById(k).getEditor().field;
				if(changes[k] instanceof Date){
					changes[k] = ed.getRawValue();
				}
				if(Ext.isDefined(ed.valueFieldName)){
					changes[ed.valueFieldName] = ed.realValue;
				}
            }
        }
        return true;
    });

	// 表格对象
	var grid = new Ext.grid.GridPanel({
		border : false,
		stripeRows: true,
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
		contextMenu : new Ext.menu.Menu({items:contextmenus}),
		listeners : {
			'rowcontextmenu' : function(g, rowIndex, e){
				g.getSelectionModel().selectRow(rowIndex);
				g.contextMenu.showAt(e.getXY());
			},
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
			var record = new store.recordType({ID : newId, rowstate : 'add'}, newId);
			var index = store.getCount();
			store.insert(index, record);
			if(orderable){
				record.set('F_ORDER', index + 1);
			}
			if(config){
				for(n in config){
					record.set(n, config[n]);
				}
			}
			grid.getSelectionModel().selectRow(index);
		});
	}
	// 添加复制行
	panel.copyRecord = function(){
		if(roweditor.editing){
			MixkyApp.showAlertMessage("无法拷贝，请关闭编辑界面");
			return;
		}
		var cm = grid.getSelectionModel();
		var record = cm.getSelected();
		if(!record){
			MixkyApp.showAlertMessage("无法拷贝，未选中复制行");
			return;
		}
		Mixky.lib.getNewTableRecordId('<%=tableform.getParent().getF_key()%>', function(newId){
			var newrec = new store.recordType({ID : newId, rowstate : 'add'}, newId);
			var index = store.getCount();
			store.insert(index, newrec);

			for (var key in record.data) {
				if (key != 'ID') {
					newrec.set(key, record.data[key]);
				}
			}
			
			if(orderable){
				newrec.set('F_ORDER', index + 1);
			}
			grid.getSelectionModel().selectRow(index);
			//var newrec = record.copy();
			//newrec.set("ID", newId);
			//newrec.set("rowstate", 'add');
			//if(orderable){
				//newrec.set('F_ORDER', index + 1);
			//}
			//store.add(newrec);
			//grid.getSelectionModel().selectRow(store.getCount() - 1);
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
			if(index >= store.getCount() - 1){
				cm.selectLastRow()
			}else{
				cm.selectRow(index)
			}
		}
	}

	panel.importDatas = function(url){
		var dialog = new Ext.ux.UploadDialog.Dialog({
			url: url,
			modal : true,
			manager : MixkyApp.desktop.getManager(),
			reset_on_hide : false,
			base_params : {
				documentid : panel.document.documentid
			},
			allow_close_on_upload : true,
			upload_autostart : true,
			post_var_name : 'upload'
		});
		dialog.on('uploadsuccess', function(uploaddialog, filename, response) {
			if (response.records) {
				//var record = new store.recordType({ID : newId, rowstate : 'add'}, newId);
				var index = store.getCount();
				for (var i=0; i < response.records.length; i++) {
					var obj = response.records[i];
					var record = new store.recordType({ID : obj.ID, rowstate : 'add'}, obj.ID);
					store.insert(index, record);
					for (var key in obj) {
						if (key != 'ID') {
							store.getAt(index).set(key, obj[key]);
						}
					}
					
					if(orderable){
						record.set('F_ORDER', index + 1);
						index++;
					}
				}
				
				if (index) {
					grid.getSelectionModel().selectRow(index);
				}
				
			}
			
			
		}, this);
		dialog.show();
	}
	
	// 保存列表
	panel.submit = function(fn){
		if(roweditor.editing){
			MixkyApp.showAlertMessage("无法保存，请关闭【<%=panel.getF_caption()%>】编辑界面");
			return;
		}
		var modifieds = store.getModifiedRecords();
		if(modifieds.length > 0){
			var record = modifieds[0];
			var item = record.getChanges();
			item.ID = record.get('ID');
			item.<%=documentidParamName%> = <%=documentid%>;
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
					panel.submit(fn);
				}else{
					MixkyApp.showDirectActionFail("保存【<%=panel.getF_caption()%>】数据", result, e);
				}
			});
		}else{
			if(panel.hasSaved){
				panel.hasSaved = undefined;
				grid.getStore().reload();
			}
			panel.document.submitPanelOver(panel, fn);
		}
	}

	panel.exportToExcel = function() {
		var ids = [];
		var cols = grid.getColumnModel();
		var colsStr = '';
		var colsNames = '';
		for (var i = 0; i < cols.getColumnCount(); i++) {
			var col = cols.getColumnById(cols.getColumnId(i));
			if (!col.hidden && col.id != 'numberer' && col.id != 'checker') {
				colsStr += col.id + ',';
				colsNames += col.header + ',';
			}
		}
		var excelParams = Ext.apply({},grid.getStore().baseParams);
		Ext.apply(excelParams,{ids: ids, colsStr:colsStr, colsNames:colsNames, panelTitle: panel.title});
		excelParams.params = Ext.util.JSON.encode(excelParams.params);
		location.href = 'framework/engine/view/export.to.excel.do?' + Ext.urlEncode(excelParams);
	}
	
	panel.refresh = function(){
		if(panel.document.params ==null){
			panel.document.params = {'<%=documentidParamName%>':<%=documentid%>};
		}
		grid.getStore().reload();
	}

	// 输出附加脚本 begin
<%
	if(panel.getF_custom_script() != null){
		out.print(panel.getF_custom_script());
	}
%>

	// 输出附加脚本 end
	panel.add(grid);
	panel.doLayout();
	// 初始化视图数据
	panel.refresh();


});
</script>