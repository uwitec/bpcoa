<%@ page contentType="text/html; charset=utf-8"%>
<%
	String id = request.getParameter("id");
%>
<script language='javascript'>
Ext.onReady(function(){
	var id = '<%=id%>';

	// 获得对象的属性列表
	var module = Mixky.designtool.Class.getModule("dept");
	
	var panel = Ext.getCmp(id);
	panel.setTitle('部门管理');

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
	            		if(bVal === properties[n].xconfig.datas[i][0]){
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
		directFn : OrganizationDirect.getDeptManageList,
		paramOrder:['parentId'],
		baseParams:{parentId:''},
		pruneModifiedRecords: true,
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
    // 禁止编辑已删除记录
    roweditor.on('beforeedit', function(re, index){
    	var record = store.getAt(index);
    	if(record.get('rowstate') == 'del'){
        	return false;
        }
    });
    // 预处理
    roweditor.on('beforesfieldsetvalue', function(field, val, record, g, row, col){
        switch(col){
        case 2:
			if(record.get('type') == 'dept'){
				field.setDisabled(false);
			}else{
				field.setDisabled(true);
			}
            break;
        case 1:
        case 3:
			if(record.get('type') == 'user'){
				field.setDisabled(false);
			}else{
				field.setDisabled(true);
			}
            break
        }
    });
    // 功能条
    var AddAction = new Ext.Action({
		text:'添加部门',
		iconCls:'icon-designtool-add',
		handler:function(){
			if(roweditor.editing){
				return;
			}
			Mixky.lib.getNewTableRecordId('t_mk_sys_dept', function(newId){
				var record = new store.recordType({id : 'D' + newId, rowstate : 'add', 'f_type':''}, newId);
				var index = 0;
				store.each(function(r){
					if(r.get('type') == 'dept'){
						index = index + 1;
					}
				});
				store.insert(index, record);
				record.set('f_order', index + 1);
				record.set('f_caption', '新建部门');
				record.set('type', 'dept');
				grid.getSelectionModel().selectRow(index);
			});
		}
	});

    var userSelector = Mixky.lib.getEditorComponent('organization', {
        config :{
			valueSeparator : ';',
			selectType : 'user'
    	}
    });

    var AddUserAction = new Ext.Action({
		text : '添加成员',
		iconCls : 'icon-designtool-add',
		handler : function(){
			if(roweditor.editing){
				return;
			}
    		var users = userSelector.recordsValue;
    		if(!users || users.length == 0){
        		return;
        	}
        	this.index = 0;
        	var addAction = this;
        	for(var i=0;i<users.length;i++){
	    		Mixky.lib.getNewTableRecordId('t_mk_sys_dept_user', function(newId){
	            	var selUser = users[addAction.index];
	            	var n = store.find('f_user_id', selUser.get('id'));
	            	if(n < 0){
		    			var record = new store.recordType({id : 'U' + newId, rowstate : 'add'}, newId);
		    			var index = store.getCount();
		    			store.insert(index, record);
		    			record.set('f_order', index);
		    			record.set('f_user_id', selUser.get('id'));
		    			record.set('f_caption', selUser.get('f_caption'));
		    			record.set('f_type', 0);
		    			record.set('type', 'user');
	            	}
	    			if(addAction.index == users.length - 1){
	    				userSelector.onSelect('', '', undefined);
	        			grid.getSelectionModel().selectRow(index);
	        		}else{
	        			addAction.index++;
	            	}
	    		});
        	}
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
					if(record.get('type') == 'user'){
						if(record.dirty){
							record.set('f_roder', i + 1);
						}else{
							record.set('f_roder', i + 1);
							record.commit();
						}
					}else{
						record.set('f_roder', i + 1);
					}
				}
				sm.deselectRow(index);
				/*
				if(index >= store.getCount() - 1){
					cm.selectLastRow()
				}else{
					cm.selectRow(index)
				}
				*/
			}
			
		}
	});
    var MoveUpAction = new Ext.Action({
		text : '上移',
		iconCls : 'icon-designtool-up',
		handler : function(){
			if(roweditor.editing){
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
			record.set('f_order', index);
			recordPre.set('f_order', index + 1);
			grid.getStore().sort('f_order', 'ASC');
		}
	});
    var MoveDownAction = new Ext.Action({
		text:'下移',
		iconCls:'icon-designtool-down',
		handler : function(){
			if(roweditor.editing){
				return;
			}
			var record = grid.getSelectionModel().getSelected();
			if(!record){
				return;
			}
			var index = grid.getStore().indexOf(record);
			var deptindex = 0;
			store.each(function(r){
				if(r.get('type') == 'dept'){
					deptindex = deptindex + 1;
				}
			});
			if(index == deptindex - 1){
				return;
			}
			var recordNext = store.getAt(index + 1);
			record.set('f_order', index + 2);
			recordNext.set('f_order', index + 1);
			grid.getStore().sort('f_order', 'ASC');
		}
	});
	
    var tools = [AddAction, '-', userSelector, AddUserAction, '-',DelAction, '-', MoveUpAction, MoveDownAction];
	
    
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
			store.baseParams.parentId = grid.parentId.toString();
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
	        text : '部门列表',
	        id : 'root',
	        nodeType : 'async',
	        key : 0
	    },
        loader: new Ext.tree.TreeLoader({
            directFn: OrganizationDirect.getDeptTree,
            paramOrder : ['key'],
        	baseParams : {'key':0},
        	preloadChildren : true,
        	listeners : {
        		'beforeload':function(loader, node){
	    			Ext.apply(this.baseParams,{'key':node.attributes['key'].toString()});
	    		},
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
        refresh : function(node){
	        if(!node){
				node = this.getSelectionModel().getSelectedNode();
		    }
		    if(!node){
		    	node = this.getRootNode();
			}
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
			if(grid.parentId == 0){
				AddUserAction.disable();
				userSelector.disable();
			}else{
				AddUserAction.enable();
				userSelector.enable();
			}
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
			item.id = parseInt(record.get('id').substr(1));
			item.parentId = grid.parentId;
			item.type = record.get('type');
			item.rowstate = record.get('rowstate');
			OrganizationDirect.saveDept(item, function(result, e){
				if(result && result.success){
					if(item.type == 'dept'){
						tree.hasDeptSaved = true;
					}
					if(record.get('rowstate') == 'del'){
						store.remove(record);
					}else{
						record.set('rowstate', '');
						record.commit();
					}
					panel.save(needSaveNext);
				}else{
					alert("数据保存失败！");
				}
			});
		}else{
			if(tree.hasDeptSaved){
				tree.hasDeptSaved = undefined;
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