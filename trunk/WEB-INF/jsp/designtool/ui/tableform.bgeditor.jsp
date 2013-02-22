<%@ page contentType="text/html; charset=utf-8"%>
<%@ page import="com.mixky.engine.store.TableForm"%>
<%@ page import="com.mixky.engine.store.Table"%>
<%
	String id = "form-bg-editor";
	String key = request.getParameter("key");
	TableForm tableform = (TableForm)request.getAttribute("tableform");
	Table table = (Table)request.getAttribute("table");
%>


<%@page import="com.mixky.common.serialize.JsonFileSerializer"%><script language='javascript'>
Ext.onReady(function(){
	var id = '<%=id%>';
	var panel = Ext.getCmp(id);
	var tablekey = '<%=table.getKey()%>';
	var formkey = '<%=tableform.getKey()%>';


	var editorpanel = new Ext.Panel({
		id : 'form-pos-editor',
		region : 'center',
		autoScroll : true,
		autoLoad : {
			scripts : true,
			url : 'ui/tableform.fieldpos.do',
			params : {
				key : formkey
			}
		}
	});
	
	// 数据访问
	var store = new Ext.data.DirectStore({
		directFn : DesignToolDirect.getSubObjectList,
		paramOrder:['key', 'mclass'],
		baseParams : {
			key : tablekey,
			mclass : 'field'
		},
		root : 'results',
		totalProperty : 'totals',
		idProperty : 'key',
		sortInfo: {field:'f_order', direction: 'ASC'},
		fields:[
			{name:'f_order', mapping:'f_order'},
			{name:'key', mapping:'key'},
			{name:'f_key', mapping:'f_key'},
			{name:'f_caption', mapping:'f_caption'},
			{name:'f_top', mapping:'f_top'},
			{name:'f_left', mapping:'f_left'},
			{name:'f_width', mapping:'f_width'},
			{name:'f_height', mapping:'f_height'}
		]
	});

	var columns = [new Ext.grid.RowNumberer(),{
		id : 'f_key',
		dataIndex : 'f_key',
		editable:false,
		header : 'KEY'
	},{
		id : 'f_caption',
		dataIndex : 'f_caption',
		header : '字段名',
		editable:false,
		width : 110
	},{
		id : 'f_top',
		dataIndex : 'f_top',
		header : 'TOP',
		width : 40,
		editor : new Ext.form.NumberField()
	},{
		id : 'f_left',
		dataIndex : 'f_left',
		header : 'LEFT',
		width : 40,
		editor : new Ext.form.NumberField()
	},{
		id : 'f_width',
		dataIndex : 'f_width',
		header : 'WIDTH',
		width : 40,
		editor : new Ext.form.NumberField()
	},{
		id : 'f_height',
		dataIndex : 'f_height',
		header : 'HEIGHT',
		width : 40,
		editor : new Ext.form.NumberField()
	}];

	var btnAddFieldToForm = new Ext.Action({
		text : '添加到表单中显示',
		iconCls : 'icon-designtool-add',
		handler : function(){
			panel.addFieldDisplay();
		}
	});

	var btnRemoveFieldFromForm = new Ext.Action({
		text : '从表单显示中移除',
		iconCls : 'icon-designtool-delete',
		handler : function(){
			panel.removeFieldDisplay();
		}
	});

	var sm = new Ext.grid.RowSelectionModel({singleSelect : true});
	sm.on('rowselect', function(s, i, record){
		editorpanel.selectFieldDisplay(record.get('key'));
	});
	
	var grid = new Ext.grid.EditorGridPanel({
		pruneModifiedRecords : true,
        collapseMode:'mini',
		split : true,
		collapsible : true,
		region : 'east',
		title : '字段列表',
		width : 400,
		minWidth : 250,
		border : false,
		columns : columns,
		autoExpandColumn : 'f_key',
		enableHdMenu : false,
		enableColumnMove : false,
	    clicksToEdit : 1,
		store : store,
		sm : sm,
		contextMenu : new Ext.menu.Menu({items:[btnAddFieldToForm, btnRemoveFieldFromForm]}),
		listeners : {
			'rowcontextmenu' : function(g, rowIndex, e){
				if(!g.getSelectionModel().isSelected(rowIndex)){
					g.getSelectionModel().selectRow(rowIndex);
				}
				g.contextMenu.showAt(e.getXY());
			},
			'rowdblclick' : function(g, rowIndex, e){
				panel.addFieldDisplay();
			}
		}
	});

	var btnUpload = new Ext.Action({
		text : '上传背景图',
		iconCls : 'icon-designtool-upload',
		handler : function(){
			var dialog = new Ext.ux.SwfUploadDialog({
				url: '../servlet/file.upload.to.folder',
				file_types: '*.jpg',
				flash_url: '../dependences/swfupload/swfupload.swf',
				modal : true,
				reset_on_hide : false,
				base_params : {
	    			targetFolder: '<%=JsonFileSerializer.instance().getFileRootRelate()%>/<%=key.substring(0, key.indexOf("."))%>',
	    			newName: '<%=key%>.jpg',
				},
				allow_close_on_upload : true,
				post_var_name : 'upload'
			});
			dialog.on('close', function(){
				//editorpanel.load();
			});
			dialog.show();					
		}
	});

	var btnSubmit = new Ext.Action({
		text : '保存',
		iconCls : 'icon-designtool-save',
		handler : function(){
			panel.save();
		}
	});

	var btnRefresh = new Ext.Action({
		text : '刷新',
		iconCls : 'icon-designtool-refresh',
		handler : function(){
			panel.refresh();
		}
	});
	
	var ui = {
		layout : 'border',
		border : false,
		items : [grid, editorpanel],
		tbar : [btnUpload, '->', btnSubmit, '-', btnRefresh]
	};
	// 移除字段显示
	panel.removeFieldDisplay = function(){
		var record = grid.getSelectionModel().getSelected();
		if(Ext.isDefined(record)){
			editorpanel.removeFieldDisplay(record.get('key'));
		}
	}
	// 添加字段显示
	panel.addFieldDisplay = function(){
		var record = grid.getSelectionModel().getSelected();
		if(Ext.isDefined(record)){
			editorpanel.addFieldDisplay(record);
		}
	}
	// 刷新
	panel.refresh = function(){
		if(Ext.isDefined(editorpanel.clearFieldDisplay)){
			editorpanel.clearFieldDisplay();
		}
		store.reload();
	}
	// 初始化字段显示
	store.on('load', function(st, records, options){
		for(var i=0;i<records.length;i++){
			var record = records[i];
			if(record.get("f_width") >0 && record.get("f_height") > 0){
				editorpanel.addFieldDisplay(record);
			}
		}
	});
	grid.on('afteredit', function(e){
		if(e.value == ''){
			e.value = 0;
			e.record.get(e.field, e.value);
		}
		editorpanel.updateFieldDisplay(e.record);
	});

	panel.getEditorRecord = function(key){
		return store.getById(key);
	}
	
	// 保存属性修改
	panel.save = function(){
		var store = grid.getStore();
		var modifieds = store.getModifiedRecords();
		if(modifieds.length > 0){
			DesignToolDirect.saveObject(modifieds[0].get('key'), modifieds[0].getChanges(), function(result, e){
				if(result.success){
					var record = modifieds[0];
					record.set(result.object);
					record.commit();
					panel.save();
				}
			});
		}else{
			DesignToolDirect.forceSaveObject(formkey, function(result, e){});
		}
	};

	panel.add(ui);
	panel.doLayout();

	var win = panel.findParentByType('window');
	win.maximize();
});
</script>