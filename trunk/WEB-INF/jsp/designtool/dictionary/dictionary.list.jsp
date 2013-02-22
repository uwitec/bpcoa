<%@ page contentType="text/html; charset=utf-8"%>
<%
	String id = request.getParameter("id");
%>
<script language='javascript'>
Ext.onReady(function(){
	var id = '<%=id%>';

	// 获得对象的属性列表
	var module = Mixky.designtool.Class.getModule("dictionary");
	
	var panel = Ext.getCmp(id);
	panel.setTitle('字典管理');

	// 合并属性
	var properties = {};
	for(var i=0;i<module.properties.length;i++){
		var p = module.properties[i];
		properties[p.name] = p;
	}
	// 存储字段
	var fields = [{name:'rowstate', mapping:'rowstate'}];
	for(var n in properties){
		var f = {name:n, mapping:n};
		fields.push(f);
	}
	// 列表字段
	var columns = [new Mixky.editor.RowNumberer()];
	for(n in module.propertyColumns){
		var col = {
			id : properties[n].name,
			dataIndex : properties[n].name,
			header : properties[n].text
		};
		Ext.apply(col, module.propertyColumns[n]);
		if(!col.editor){
			switch(properties[n].xeditor){
	        case 'none':
		        break;
	        case 'selectkeymap':
	        	col.editor = Mixky.lib.getEditorComponent(properties[n].xeditor, properties[n].xconfig);
	        	col.renderer = function(bVal){
		        	var n = this.id;
	            	for(var i=0;i<properties[n].xconfig.datas.length;i++){
	            		if(bVal == properties[n].xconfig.datas[i][0]){
	            			return properties[n].xconfig.datas[i][1];
	            		}
	            	}
	            	return bVal;
		        }
		        break;
	        default:
	        	col.editor = Mixky.lib.getEditorComponent(properties[n].xeditor, properties[n].xconfig);
	        	break;
			}
	        Mixky.lib.setFieldInitConfig(properties[n].xeditor, col.editor, properties[n].xconfig);
		}
		columns.push(col);
	}
	// 数据访问
	var store = new Ext.data.DirectStore({
		pruneModifiedRecords : true,
		directFn : DictionaryDirect.getDictionaryManageList,
		paramOrder:['parentId'],
		baseParams:{parentId:0},
		root : 'results',
		totalProperty : 'totals',
		idProperty : 'id',
		sortInfo: {field:'f_order', direction: 'ASC'},
		fields:fields
	});
	// 行编辑插件
	var roweditor = new Ext.ux.grid.RowEditor({
        saveText: '确定',
        cancelText: '取消'
    });
    // 功能条
    var AddAction = new Ext.Action({
		text:'添加',
		iconCls:'icon-designtool-add',
		handler:function(){
			if(roweditor.editing){
				return;
			}
			var tablename = 't_mk_sys_dictionary';
			var type = 'dictionary';
			if(grid.parentId > 0){
				var tablename = 't_mk_sys_dictionary_data';
				var type = 'dictionarydata';
			}
			Mixky.lib.getNewTableRecordId(tablename, function(newId){
				var record = new store.recordType({id : newId, rowstate : 'add'}, newId);
				var index = store.getCount();
				store.insert(index, record);
				record.set('f_order', index + 1);
				record.set('f_name', 'newname');
				record.set('f_caption', '新建数据');
				record.set('type', type);
				grid.getSelectionModel().selectRow(index);
			});
		}
	});
	
    var DelAction = new Ext.Action({
		text:'删除',
		iconCls:'icon-designtool-delete',
		handler:function(){
	    	if(roweditor.editing){
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
					if(record.dirty  && record.get('type') == 'dictionary'){
						record.set('f_roder', i + 1);
						record.commit();
					}else{
						record.set('f_roder', i + 1);
					}
				}
				sm.deselectRow(index);
			}
			
		}
	});
    var MoveUpAction = new Ext.Action({
		text : '上移',
		iconCls : 'icon-designtool-up',
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
		iconCls:'icon-designtool-down',
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
	
    var tools = [AddAction, '-',DelAction,'-', MoveUpAction, MoveDownAction];
	
    
	// 表格对象
	var grid = new Ext.grid.GridPanel({
    	region : 'center',
		border : false,
		columns : columns,
		autoExpandColumn : 'f_note',
		enableHdMenu : false,
		enableColumnMove : false,
		disabled : true,
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
			store.baseParams.parentId = grid.parentId;
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
    	split : true,
    	root : {
	        text : '字典列表',
	        id : 'root',
	        nodeType : 'async',
	        key : 0
	    },
        loader: new Ext.tree.TreeLoader({
            directFn: DictionaryDirect.getDictionaryTree,
            paramOrder : [],
        	preloadChildren : true,
        	listeners : {
        		'load':function(loader, node){
	    			node.expand();
        			if(Ext.isDefined(tree.onLoadSelectKey)){
            			var sn = tree.getNodeById(tree.onLoadSelectKey);
            			if(sn){
                			sn.select();
                		}
            			tree.onLoadSelectKey = undefined;
            		}
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
	// 刷新
	panel.refresh = function(){
		tree.refresh();
	}
	// 保存属性修改
	panel.save = function(needSaveNext){
		var modifieds = store.getModifiedRecords();
		if(modifieds.length > 0){
			var record = modifieds[0];
			var item = record.getChanges();
			item.id = record.get('id');
			item.parentId = grid.parentId;
			item.type = record.get('type');
			item.rowstate = record.get('rowstate');
			DictionaryDirect.saveDictionary(item, function(result, e){
				if(result && result.success){
					if(item.type == 'dictionary'){
						tree.hasDictionarySaved = true;
					}
					if(record.get('rowstate') == 'del'){
						store.remove(record);
					}else{
						record.set('rowstate', '');
						record.commit();
					}
					panel.save(needSaveNext);
				}
			});
		}else{
			if(tree.hasDictionarySaved){
				tree.hasDictionarySaved = undefined;
				tree.refresh();
			}
			//Mixky.designtool.Framework.contentPanel.savePanelOver(panel, needSaveNext);
		}
	};
	panel.add(ui);
	panel.doLayout();
	tree.refresh();
});
</script>