<%@ page contentType="text/html; charset=utf-8"%>
<%
	String id = request.getParameter("id");
%>
<script language='javascript'>
Ext.onReady(function(){
	var id = '<%=id%>';

	// 获得对象的属性列表
	var module = Mixky.designtool.Class.getModule('gridroweditor');
	var panel = Ext.getCmp(id);

	// 合并属性
	var properties = {};
	if(module.properties){
		for(var i=0;i<module.properties.length;i++){
			var p = module.properties[i];
			if(p.xconfig && p.xconfig.selectInParent){
				p.xconfig.parentKey = 'a';
			}
			properties[p.name] = p;
		}
	}
	// 存储字段
	var fields = [];
	var data = {};
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
		data[n] = properties[n].value;
		fields.push(f);
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
		                return Ext.encode(bVal);
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
	var store = new Ext.data.ArrayStore({
		idIndex: 0,
		fields:fields
	});
	store.loadData([data]);
	Mixky.lib.remoteRenderStore(store);
	// 行编辑插件
	var roweditor = new Ext.ux.grid.RowEditor({
        saveText: '确定',
        cancelText: '取消'
    });
    // 预处理
    roweditor.on('beforesfieldsetvalue', function(field, val, record, g, row, col){
		switch(field.getXType()){
		case 'mixkyjsonobjectfield' :
			field.setValue(Ext.encode(val));
			field.realValue = val;
			return false;
		default:
			break;
		}
		return true;
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
		enableHdMenu:false,
		enableColumnMove:false,
		plugins: [roweditor],
		store : store
	});
	panel.add(grid);
	panel.doLayout();
});
</script>