<%@ page contentType="text/html; charset=utf-8"%>
<%
	String id = request.getParameter("id");
%>
<script language='javascript'>
Ext.onReady(function(){
	var id = '<%=id%>';
	var mclass = 'relation';
	var module = Mixky.designtool.Class.getModule(mclass);
	
	var panel = Ext.getCmp(id);

	// 合并属性
	var properties = {};
	for(var i=0;i<Mixky.designtool.Class.defaultProperties.length;i++){
		var p = Mixky.designtool.Class.defaultProperties[i];
		properties[p.name] = p;
	}
	if(module.properties){
		for(var i=0;i<module.properties.length;i++){
			var p = module.properties[i];
			properties[p.name] = p;
		}
	}
	// 存储字段
	var fields = [{name:'key', mapping:'key'}];
	if(module.orderable){
		fields.push({name:'f_order', mapping:'f_order'});
	}
	for(var n in properties){
		var f = {name:n, mapping:n};
		if(Ext.isDefined(properties[n].xconfig) && 
				Ext.isDefined(properties[n].xconfig.remoteRenderType)){
			f.remoteRenderType = properties[n].xconfig.remoteRenderType;
			fields.push({name:n + '_display', mapping:n + '_display', isDisplayColumn:true, valueField:n});
		}
		if(properties[n].xeditor == 'jsonobject'){
			f.isDisplayColumn = true;
			f.valueField = n;
		}
		if(properties[n].xeditor == 'date'){
			f.dateFormat = 'Y-m-d';
			f.type = 'date';
		}
		if(properties[n].xeditor == 'datetime'){
			f.dateFormat = 'Y-m-d';
			f.type = 'date';
		}
		fields.push(f);
	}
	
	var renderer = function(value, p, record){
		var type = record.get("f_class");
		return String.format("<div style='height:16px;padding-left:23px;background:transparent url(icon/{0}.gif) no-repeat'> {1}</div>", type, value);
	}
	// 列表字段
	var columns = [new Ext.grid.RowNumberer()];
	if(module.propertyColumns){
		for(n in module.propertyColumns){
			var col;
			if(Ext.isDefined(properties[n].xconfig) && 
					Ext.isDefined(properties[n].xconfig.remoteRenderType)){
				col = {
					id : properties[n].name + '_display',
					dataIndex : properties[n].name + '_display',
					header : properties[n].text
				}
			}else{
				col = {
					id : properties[n].name,
					dataIndex : properties[n].name,
					header : properties[n].text
				}
			}
			if(n == 'f_key'){
				col.renderer = renderer;
			}
			Ext.apply(col, module.propertyColumns[n]);
			if(!col.editor){
				switch(properties[n].xeditor){
		        case 'none':
			        break;
		        case 'extend':
		        	col.editor = Mixky.lib.getEditorComponent(properties[n].xeditor, properties[n].xconfig);
		        	break;
		        case 'custom':
		        	col.editor = Ext.ComponentMgr.create(properties[n].xconfig.editor);
		        	break;
		    	case 'jsonobject':
		        	col.editor = Mixky.lib.getEditorComponent('jsonobject', properties[n].xconfig);
		        	col.renderer = function(bVal){
			        	if(typeof(bVal) == 'object'){
		                	return Ext.encode(bVal);
			        	}else{
				        	return bVal;
				        }
		            }
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
		        case 'date':
		        	col.renderer = function(dateVal){
			        	if(typeof dateVal == 'object'){
			            	return dateVal.dateFormat('Y-m-d');
			        	}else{
				        	return dateVal;
				        }
			        }
		        	col.editor = Mixky.lib.getEditorComponent(properties[n].xeditor, properties[n].xconfig);
		        	break;
		        case 'datetime':
		        	col.renderer = function(dateVal){
			        	if(typeof dateVal == 'object'){
			            	return dateVal.dateFormat('Y-m-d');
			        	}else{
				        	return dateVal;
				        }
			        }
		        	col.editor = Mixky.lib.getEditorComponent(properties[n].xeditor, properties[n].xconfig);
		        	break;
		        default:
		        	col.editor = Mixky.lib.getEditorComponent(properties[n].xeditor, properties[n].xconfig);
		        	break;
				}
		        Mixky.lib.setFieldInitConfig(properties[n].xeditor, col.editor, properties[n].xconfig);
			}
			columns.push(col);
		}
	}
	// 数据访问
	var store = new Ext.data.DirectStore({
		pruneModifiedRecords : true,
		directFn : DesignToolDirect.getSubObjectList,
		paramOrder:['key', 'mclass'],
		baseParams : {
			key : key,
			mclass : mclass
		},
		root : 'results',
		totalProperty : 'totals',
		idProperty : 'f_key',
		sortInfo: module.orderable ? {field:'f_order', direction: 'ASC'} : undefined,
		fields:fields
	});
	// 远程渲染
	store.on('load', function(){
		Mixky.lib.remoteRenderStore(store);
	});
    // 功能条
    var AddAction = new Ext.Action({
		text:'添加',
		iconCls:'icon-designtool-add',
		handler:function(){
			if(roweditor.editing){
				return;
			}
			Mixky.designtool.lib.addDesignObject(panel.key, mclass, function(newkey, mclass){
				panel.refresh();
			});
		}
	});
    var CopyAction = new Ext.Action({
		text:'复制',
		iconCls:'icon-designtool-copy',
		handler:function(){
			var record = grid.getSelectionModel().getSelected();
			if(!record){
				return;
			}
    		Mixky.designtool.Context.clipboardObject = {key:record.get('key'), mclass:mclass};
		}
	});
    var PasteAction = new Ext.Action({
		text:'粘贴',
		iconCls:'icon-designtool-paste',
		handler:function(){
			if(roweditor.editing){
				return;
			}
			var srcoid = Mixky.designtool.Context.clipboardObject;
			var dstoid = {mclass:mclass, key:panel.key};
			if(!srcoid){
				alert('剪贴板为空');
				
				return;
			}
			Ext.Msg.prompt('粘帖对象', '请输入新对象键值:', function(btn, newkey){
			    if (btn == 'ok'){
					DesignToolDirect.pasteObject(srcoid.key, dstoid.key, newkey, function(result, e){
						if(result.success){
							panel.refresh();
						}else{
							alert('paste object [' + srcoid.mclass + '][' + srcoid.key + '] to ' + '[' + dstoid.mclass + '][' + dstoid.key + '] failed');
						}
					});
			    }
			});
		}
	});
    var RenameAction = new Ext.Action({
		text:'修改键值',
		iconCls:'icon-designtool-rename',
		handler:function(){
			if(roweditor.editing){
				return;
			}
			var record = grid.getSelectionModel().getSelected();
			if(!record){
				return;
			}
			Mixky.designtool.lib.showRenameWindow(function(oldKey, newKey){
				DesignToolDirect.renameObject(oldKey, newKey, function(result, e){
					if(result.success){
						panel.refresh();
					}else{
						alert('rename object [' + oldName + '] to [' + newName + '] failed');
					}
				});
			}, record.get('key'));
		}
	});
    var DelAction = new Ext.Action({
		text:'删除',
		iconCls:'icon-designtool-delete',
		handler:function(){
			if(roweditor.editing){
				return;
			}
			var s = grid.getSelectionModel().getSelections();
			if(s.length == 0){
				return;
			}
			Ext.MessageBox.confirm('危险操作提示', '删除当前选中的对象，该操作不可恢复，您确定吗？', function(btn){
				if(btn == 'yes'){
					var delKeys = [];
	                for(var i = 0, r; r = s[i]; i++){
	                    delKeys.push(r.get('key'));
	                }
					DesignToolDirect.deleteObjects(delKeys, function(result, e){
						if(result.success){
							panel.refresh();
						}
					});
				}
			});
		}
	});
    var MoveUpAction = new Ext.Action({
		text : '上移',
		iconCls : 'icon-designtool-up',
		disabled : !module.orderable,
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
		disabled : !module.orderable,
		handler : function(){
			if(roweditor.editing){
				return;
			}
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
	
    var tools = [AddAction, CopyAction, PasteAction, '-', RenameAction, DelAction, '-', MoveUpAction, MoveDownAction,'-'];

	if(module.extendsMenu){
		tools.push('->');
		for(var i=0;i<module.extendsMenu.length;i++){
			var btn = module.extendsMenu[i];
			Ext.apply(btn, {scope: panel});
			tools.push(btn);
		}
	}
	
	// 行编辑插件
	var roweditor = new Ext.ux.grid.RowEditor({
        saveText: '确定',
        cancelText: '取消'
    });
    
    // 预处理
    roweditor.on('beforefieldsetvalue', function(field, val, record, g, row, col){
		switch(field.getXType()){
		case 'mixkyjsonobjectfield' :
			field.setValue(Ext.encode(val));
			field.realValue = val;
			return false;
		default:
			return true;
		}
    });
    // 处理编辑结果
    roweditor.on('validateedit', function(rd, changes){
        var store = rd.grid.getStore();
        var cm = rd.grid.colModel;
        for(var k in changes){
			var field = store.fields.get(k);
			var ed = cm.getColumnById(k).getEditor().field;
			if(field.isDisplayColumn){
				changes[field.valueField] = ed.realValue;
			}
        }
        return true;
    });
	// 表格对象
	var grid = new Ext.grid.GridPanel({
		border : false,
		columns : columns,
		autoExpandColumn:'f_note',
		enableHdMenu:false,
		enableColumnMove:false,
		plugins: [roweditor],
		getParentKey : function(){
			return panel.key;
		},
		getType : function(){
			return mclass;
		},
		viewConfig:{
			getRowClass: function(record, index) {
				if(record.dirty){
					return 'mixky-grid-row-changed';
				}
		    }
		},
		store : store,
		tbar : tools,
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

	grid.getSelectionModel().on("beforerowselect", function(sm, index, rocode){
		return !roweditor.editing;
	});
	
	// 刷新
	panel.refresh = function(key){
		if(key){
			panel.key = key;
			grid.getStore().baseParams.key = key;
		}
		grid.getStore().reload();
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
				}
			});
		}
	};
	panel.add(grid);
	panel.doLayout();
});
</script>