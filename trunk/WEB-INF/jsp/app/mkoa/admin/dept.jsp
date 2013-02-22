<%@ page contentType="text/html; charset=utf-8"%>
<%
	String panelid = request.getParameter("panelid");
%>
<script language='javascript'>
Ext.onReady(function(){
	var panelid = '<%=panelid%>';
	var panel = Ext.getCmp(panelid);
	
	// 数据访问
	var store = new Ext.data.DirectStore({
		pruneModifiedRecords : true,
		directFn : AdminAppDirect.getDeptAndUsers,
		paramOrder:['parentId'],
		baseParams:{parentId:0},
		pruneModifiedRecords: true,
		root : 'results',
		totalProperty : 'totals',
		idProperty : 'id',
		sortInfo: {field:'f_order', direction: 'ASC'},
		fields:['id', 'type', 'rowstate', 'f_order', 'f_user_id', 'f_type', 'f_name', 'f_caption', 'f_note']
	});
	// 定义字段行编辑方式
	var captionEditor = Mixky.lib.getEditorComponent('string', {config:{maxLength:20}});
	var noteEditor = Mixky.lib.getEditorComponent('textbox', {config:{maxLength:100}});
	
	// 行编辑插件
	var roweditor = new Ext.ux.grid.RowEditor({
        saveText: '确定',
        cancelText: '取消'
    });
    // 禁止编辑已删除记录
    roweditor.on('beforeedit', function(re, index){
    	var record = store.getAt(index);
    	if (record.get('rowstate') == 'del') {
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
		iconCls:'icon-sys-add',
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

	var fnAddDeptUser = function(display, values, users){
		if(!users || users.length == 0){
    		return;
    	}
    	for(var i=0;i<users.length;i++){
        	var selUser = users[i];
        	var n = store.find('f_user_id', selUser.get('id'));
        	if(n < 0){
    			Mixky.lib.getNewTableRecordId('t_mk_sys_dept_user', function(newId, selUser){
	    			var record = new store.recordType({id : 'U' + newId, rowstate : 'add'}, newId);
	    			var index = store.getCount();
	    			store.insert(index, record);
	    			record.set('f_order', index);
	    			record.set('f_user_id', selUser.get('id'));
	    			record.set('f_name', selUser.get('f_name'));
	    			record.set('f_caption', selUser.get('f_caption'));
	    			record.set('type', 'user');
    			}, selUser);
        	}
    	}
	};

    var AddUserAction = new Ext.Action({
		text : '添加成员',
		iconCls : 'icon-sys-add',
		handler : function(){
			if(roweditor.editing){
				return;
			}
			Mixky.app.common.getOrganizationWindow({selectType : 'user'}, undefined, fnAddDeptUser).show();
		}
	});
	
    var DelAction = new Ext.Action({
		text:'删除',
		iconCls:'icon-sys-delete',
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
			}
			
		}
	});
    var MoveUpAction = new Ext.Action({
		text : '上移',
		iconCls : 'icon-sys-up',
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
		iconCls:'icon-sys-down',
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
			if (recordNext) {
				record.set('f_order', index + 2);
				recordNext.set('f_order', index + 1);
			}
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
	
    var tools = [AddAction, '-', AddUserAction, '-',DelAction, '-', MoveUpAction, MoveDownAction, '-', btnSave, '->', btnRefresh];
	
    
	// 表格对象
	var grid = new Ext.grid.GridPanel({
    	region : 'center',
		border : false,
		columns : [new Mixky.editor.RowNumberer(), {
			id : 'id',
			dataIndex : 'id',
			header : 'ID',
			editor : null,
			width : 70,
			renderer:function(value, p, record) {
				var type = record.get("type");
				return String.format("<div style='height:16px;padding-left:23px;background:transparent url(resources/images/icon/sys/{0}.gif) no-repeat'> {1}</div>", type, value);
			}
		}, {
			id : 'f_caption',
			dataIndex : 'f_caption',
			header : '名称',
			editor : Mixky.lib.getEditorComponent('string', {config:{maxLength:20}}),
			width : 150
		},{
			id : 'f_type',
			dataIndex : 'f_type',
			header : '成员类型',
			editor : Mixky.lib.getEditorComponent('selectkeymap', {
				datas:[[0, '普通成员'],[1,'部门主管'],[2,'分管领导']],
	    		readOnly:true
	    	}),
	    	renderer : function(bVal){
				switch(bVal){
				case 0: return '普通成员';
				case 1: return '部门主管';
				case 2: return '分管领导';
				}
	        	return bVal;
	        },
			width : 80
		}, {
			id : 'f_note',
			dataIndex : 'f_note',
			header : '说明',
			editor : Mixky.lib.getEditorComponent('textbox', {config:{maxLength:100}})
		}],
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
	        text : '机构列表',
	        id : 'root',
	        nodeType : 'async',
	        key : 0
	    },
        loader: new Ext.tree.TreeLoader({
            directFn: AdminAppDirect.getDepts,
            paramOrder : ['key'],
        	baseParams : {'key':0},
        	preloadChildren : true,
        	listeners : {
        		'beforeload':function(loader, node){
	    			Ext.apply(this.baseParams,{'key':node.attributes['key']});
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
			}else{
				AddUserAction.enable();
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
	panel.save = function(){
		var modifieds = store.getModifiedRecords();
		if(modifieds.length > 0){
			var record = modifieds[0];
			var item = record.getChanges();
			item.id = parseInt(record.get('id').substr(1));
			item.parentId = grid.parentId;
			item.type = record.get('type');
			item.rowstate = record.get('rowstate');
			AdminAppDirect.saveDept(item, function(result, e){
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
					panel.save();
				}else{
					MixkyApp.showErrorMessage('保存数据出现错误！', '错误提示');
				}
			});
		}else{
			if(tree.hasDeptSaved){
				tree.hasDeptSaved = undefined;
				tree.refresh();
			}else{
				store.reload();
			}
		}
	};
	panel.add(ui);
	panel.doLayout();
	tree.refresh();
});
</script>