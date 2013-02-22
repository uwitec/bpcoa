<%@ page contentType="text/html; charset=utf-8"%>
<%
	String panelid = request.getParameter("panelid");
%>
<script language='javascript'>
Ext.onReady(function(){
	var panel = Ext.getCmp('<%=panelid%>');

	// 数据访问
	var store = new Ext.data.DirectStore({
		pruneModifiedRecords : true,
		paramOrder:['dictionaryId'],
		directFn : AdminAppDirect.getDictionaryDatas,
		baseParams:{dictionaryId:0},
		root : 'results',
		totalProperty : 'totals',
		idProperty : 'id',
		sortInfo : {field:'f_order', direction: 'ASC'},
		fields : ['id', 'f_order', 'f_name', 'f_caption', 'f_note']
	});
	// 行编辑插件
	var roweditor = new Ext.ux.grid.RowEditor({
        saveText: '确定',
        cancelText: '取消'
    });
    // 功能条
    var AddAction = new Ext.Action({
		text:'添加',
		iconCls:'icon-sys-add',
		handler:function(){
			if(roweditor.editing){
		    	MixkyApp.showErrorMessage("正在编辑行，无法添加！", '错误提示');
				return;
			}
			Mixky.lib.getNewTableRecordId('t_mk_sys_dictionary_data', function(newId){
				var record = new store.recordType({id : newId, rowstate : 'add'}, newId);
				var index = store.getCount();
				store.insert(index, record);
				record.set('f_order', index + 1);
				record.set('f_name', 'newname');
				record.set('f_caption', '新建数据');
				grid.getSelectionModel().selectRow(index);
			});
		}
	});
	
    var DelAction = new Ext.Action({
		text:'删除',
		iconCls:'icon-sys-delete',
		handler:function(){
	    	if(roweditor.editing){
		    	MixkyApp.showErrorMessage("正在编辑行，无法删除！", '错误提示');
				return;
			}
			var sm = grid.getSelectionModel()
			var record = sm.getSelected();
			if(record){
				var index = store.indexOf(record);
				if(record.get('rowstate') == 'add'){
					store.remove(record);
				}else{
					record.set('rowstate', 'del');
				}
				for(var i=index;i<store.getCount();i++){
					var record = store.getAt(i);
					record.set('f_roder', i + 1);
				}
				sm.deselectRow(index);
			}
		}
	});
    var MoveUpAction = new Ext.Action({
		text : '上移',
		iconCls : 'icon-sys-up',
		handler : function(){
			var record = grid.getSelectionModel().getSelected();
			if(!record){
				return;
			}
			var index = grid.getStore().indexOf(record);
			if(index == 0){
				return;
			}
			var recordPre = store.getAt(index - 1);
			record.set('f_order', index);
			recordPre.set('f_order', index + 1);
			grid.getStore().sort('f_order', 'ASC');
		}
	});
    var MoveDownAction = new Ext.Action({
		text:'下移',
		iconCls:'icon-sys-down',
		handler : function(){
			var record = grid.getSelectionModel().getSelected();
			if(!record){
				return;
			}
			var index = grid.getStore().indexOf(record);
			if(index == grid.getStore().getCount() - 1){
				return;
			}
			var recordNext = store.getAt(index + 1);
			record.set('f_order', index + 2);
			recordNext.set('f_order', index + 1);
			grid.getStore().sort('f_order', 'ASC');
		}
	});

	var btnSave = new Ext.Action({
		text : '保存',
		iconCls : 'icon-sys-save',
		handler : function(){
			panel.save();
		}
	});

	var btnRefresh = new Ext.Action({
		text : '刷新',
		iconCls : 'icon-sys-refresh',
		handler : function(){
			panel.refresh();
		}
	});
	var tools = [AddAction, '-',DelAction,'-', MoveUpAction, MoveDownAction, '-', btnSave, '->', btnRefresh];
	var grid = new Ext.grid.GridPanel({
    	region : 'center',
		border : false,
		enableHdMenu : false,
		enableColumnMove : false,
		disabled : true,
		autoExpandColumn : 'f_note',
		columns : [new Mixky.editor.RowNumberer(), {
			id : 'f_name',
			dataIndex : 'f_name',
			header : '数据标识',
			editor : Mixky.lib.getEditorComponent('string', {config:{maxLength:30}}),
			width : 120,
			renderer:function(value, p, record) {
				return String.format("<div style='height:16px;padding-left:23px;background:transparent url(resources/images/icon/sys/dictionarydata.gif) no-repeat'> {0}</div>", value);
			}
		}, {
			id : 'f_caption',
			dataIndex : 'f_caption',
			header : '数据名称',
			editor : Mixky.lib.getEditorComponent('string', {config:{maxLength:30}}),
			width : 180
		}, {
			id : 'f_note',
			dataIndex : 'f_note',
			header : '说明',
			editor : Mixky.lib.getEditorComponent('textbox', {config:{maxLength:100}})
		}],
		plugins : [roweditor],
		tbar : tools,
		store : store,
		viewConfig:{
			getRowClass: function(record, index) {
				if(record.dirty){
					return 'mixky-grid-row-changed';
				}
		    }
		},
		sm : new Ext.grid.RowSelectionModel({
			listeners : {
				'beforerowselect' : function(sm, index, ke, record){
					if(record.get('rowstate') == 'del'){
						return false;
					}
				}
			}
		}),
		contextMenu : new Ext.menu.Menu({items:tools}),
		listeners : {
			'rowcontextmenu' : function(g, rowIndex, e){
				if(roweditor.editing){
					return;
				}
				g.getSelectionModel().selectRow(rowIndex);
				g.contextMenu.showAt(e.getXY());
			}
		}
	});

	store.on('beforeload', function(){
		if(Ext.isDefined(grid.parentId)){
			store.baseParams.dictionaryId = parseInt(grid.parentId);
		}else{
			return false;
		}
	});

	var tree = new Ext.tree.TreePanel({
    	region : 'west',
        minSize : 150,
        width : 200,
        maxSize : 400,
    	autoScroll : true,
    	rootVisible : false,
    	split : true,
    	root : {
	        text : '字典列表',
	        id : 'root',
	        nodeType : 'async',
	        key : 0
	    },
        loader: new Ext.tree.TreeLoader({
            directFn: AdminAppDirect.getDictionarys,
        	preloadChildren : true,
        	baseAttrs :{
				'iconCls' : 'icon-sys-dictionary'
        	},
        	listeners : {
        		'load':function(loader, node){
	    			node.expand();
        		}
        	}
        }),
        refresh : function(){
	    	node = this.getRootNode();
		    node.attributes.children = undefined;
		    node.reload();
	    }
	});

	tree.getSelectionModel().on('selectionchange', function(sm, node){
		if(!node){
			grid.disable();
			grid.parentId = undefined;
		}else{
			grid.parentId = node.attributes.key;
			grid.getStore().reload();
			grid.enable();
		}
	});
	
	var ui = new Ext.Panel({
		layout:'border',
		border : false,
		defaults : {border:false},
		items:[tree, grid]
	});

	// 保存属性修改
	panel.save = function(){
		var modifieds = store.getModifiedRecords();
		if(modifieds.length > 0){
			var record = modifieds[0];
			var item = record.getChanges();
			item.id = record.get('id');
			item.parentId = grid.parentId;
			item.rowstate = record.get('rowstate');
			AdminAppDirect.saveDictionaryData(item, function(result, e){
				if(result && result.success){
					panel.hasSubmit = true;
					if(record.get('rowstate') == 'del'){
						store.remove(record);
					}else{
						record.set('rowstate', '');
						record.commit();
					}
					panel.save();
				}else{
					MixkyApp.showErrorMessage('保存数据出现错误！', '错误提示');
				}
			});
		}else{
			if(panel.hasSubmit){
				AdminAppDirect.buildDictionaryFile(function(result, e){
					if(result && result.success){
						panel.hasSubmit = undefined;
					}
				});
			}
		}
	};
	panel.refresh = function(){
		store.reload();
	}
	panel.add(ui);
	panel.doLayout();
	
	tree.refresh();
});
</script>