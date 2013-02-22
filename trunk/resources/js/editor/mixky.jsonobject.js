/*!
 * Ext JS Library 3.0.0
 * Copyright(c) 2006-2009 Ext JS, LLC
 * licensing@extjs.com
 * http://www.extjs.com/license
 */

Ext.namespace("Mixky.editor");

Mixky.editor.JsonObjectField = Ext.extend(Mixky.editor.PanelTriggerField, {

    confirm : true,
    
    editable : false,
    
    minListWidth : 600,
    
    minHeight : 200,
    
    // override
    getValue : function(){
	    var v = this.value;
	    if(v === this.emptyText || v === undefined){
	        v = {};
	    }
	    return v;
	},
    
    // private
    renderPanel : function(el){
		var valueEditor = new Ext.form.TextArea({
			region : 'center',
	        hideLabel: true,
	        anchor:'100%'
	    });
		
	    var tree = new Ext.tree.TreePanel({
			region : 'west',
	    	autoScroll:true,
	        minSize: 50,
	        width: 200,
	        maxSize: 350,
	        split:true,
	    	rootVisible :true,
	    	root: {
	    		id : 'object',
	            text : 'object',
	            nodeType : 'node',
	            loaded : true,
	            type : 'object'
	        },
	        appendAttributeNode : function(parentNode, name, type){
	        	var editable = true;
	        	if(parentNode.attributes.type == 'array'){
	        		editable = false;
	        	}
	        	var node = parentNode.appendChild({
	        		id : parentNode.id + '.' + name,
	        		text : name,
	        		type : type,
		            nodeType : 'node',
		            loaded : true,
		            editable : editable,
	        		leaf : type != 'object' && type != 'array',
	        		iconCls : 'icon-designtool-' + type
	        	});
	        	return node;
	        },
	        addObjectNode : function(parentNode, obj){
	        	for(var n in obj){
	        		if(obj.hasOwnProperty(n)){
			        	var type = typeof obj[n];
			        	if(obj[n] instanceof Array){
			        		type = 'array';
			        	}
			        	var node = this.appendAttributeNode(parentNode, n, type);
			        	if(type == 'object' || type == 'array'){
			        		this.addObjectNode(node, obj[n]);
			        	}
	        		}
	        	}
	        },
	        refreshNode : function(node){
	            while(node.firstChild){
	            	node.removeChild(node.firstChild);
	            }
	            this.addObjectNode(node, this.getNodeValue(node));
	        },
			setFieldObject:function(obj){
	        	if(!obj || obj == ''){
	        		obj = {};
	        	}
	        	this.objectValue = obj;
	        	var node = this.getRootNode();
	        	this.refreshNode(node);
	        },
	        getNodeValue : function(node){
	        	if(node.isRoot){
	        		return this.objectValue;
	        	}else{
		        	var object = this.getNodeValue(node.parentNode);
		        	return object[node.text];
	        	}
	        },
	        updateObjectName : function(node, name){
	        	var parentValue = this.getNodeValue(node.parentNode);
	        	if(Ext.isDefined(parentValue[name])){
	        		return false;
	        	}else{
	        		parentValue[name] = parentValue[node.text];
	        		delete parentValue[node.text];
	        		node.setId(node.parentNode + '.' + name);
	        		return true;
	        	}
	        }
	    });

	    new Ext.tree.TreeSorter(tree,{
	    	sortType: function(node) {
		        return node.text;
		    }
	    });
	    
	    var treeEditor = new Ext.tree.TreeEditor(tree, {
            allowBlank : false
        });
		
	    treeEditor.on('beforecomplete', function(ed, value, startValue){
	    	var result = tree.updateObjectName(ed.editNode, value);
	    	if(!result){
	    		ed.cancelEdit();
	    	}
	    	return result;
	    });
	    
	    var renameAction = new Ext.Action({
	    	disabled : true,
	    	text : '更名',
	    	iconCls : 'icon-designtool-rename',
	    	handler : function(){
    			var node = tree.getSelectionModel().getSelectedNode();
	    		treeEditor.triggerEdit(node);
	    	}
	    });
	    var nameField = new Ext.form.TextField({disabled : true,width:100,emptyText:'创建属性名称'});
	    var typeField = new Ext.form.ComboBox({
        	triggerAction:'all',
        	disabled : true,
        	mode:'local',
        	width:60,
        	editable:false,
        	forceSelection: true,
        	emptyText:'选择类型',
        	value:'string',
        	store:['string', 'boolean', 'number', 'object', 'array', 'function']
        });
	    var addAction = new Ext.Action({
	    	text : '创建',
	    	iconCls : 'icon-designtool-add',
	    	handler : function(){
	    		var parentNode = tree.getSelectionModel().getSelectedNode();
	    		var type = typeField.getValue();
	    		var name = parentNode.attributes.type == 'array' ? parentNode.childNodes.length : nameField.getValue();
	    		if(type != 'array' && name == ''){
	    			return;
	    		}
	    		var value;
	    		switch(type){
	    		case 'boolean':
	    			value = false;
	    			break;
	    		case 'string':
	    			value = '';
	    			break;
	    		case 'number':
	    			value = 0;
	    			break;
	    		case 'object':
	    			value = {};
	    			break;
	    		case 'function':
	    			value = function(){};
	    			break;
	    		case 'array':
	    			value = [];
	    			break;
	    		default:
	    			value = undefined;
	    			break;
	    		}
	    		var node = tree.appendAttributeNode(parentNode, name, type);
	    		var obj = tree.getNodeValue(parentNode);
	    		obj[node.text] = value;
	    		parentNode.expand();
	    		node.select();
	    	}
	    });
	    var delAction = new Ext.Action({
	    	disabled : true,
	    	text : '删除',
	    	iconCls : 'icon-designtool-delete',
	    	handler : function(){
	    		var node = tree.getSelectionModel().getSelectedNode();
				var parentNode = node.parentNode;
				var object = tree.getNodeValue(parentNode);
	            if(parentNode.attributes.type == 'array'){
	            	for(var i=node.text;i<object.length-1;i++){
	            		object[i] = object[i+1];
	            	}
	            	delete object[object.length-1];
	            	tree.refreshNode(parentNode);
	            }else{
					delete object[node.text];
	            	parentNode.removeChild(node);
	            }
	            parentNode.expand();
	            parentNode.select();
	    	}
	    });
	    var upAction = new Ext.Action({
	    	disabled : true,
	    	iconCls : 'icon-designtool-up',
	    	handler : function(){
    			var node = tree.getSelectionModel().getSelectedNode();
    			if(node.isFirst()){
    				return;
    			}
    			var index = parseInt(node.text);
    			var parentNode = node.parentNode;
    			var obj = tree.getNodeValue(parentNode);
    			var temp = obj[index];
    			obj[index] = obj[index - 1];
    			obj[index-1] = temp;
    			tree.refreshNode(parentNode);
    			parentNode.expand();
    			var node = tree.getNodeById(parentNode.id + '.' + (index - 1));
    			node.select();
	    	}
	    });
	    var downAction = new Ext.Action({
	    	disabled : true,
	    	iconCls : 'icon-designtool-down',
	    	handler : function(){
				var node = tree.getSelectionModel().getSelectedNode();
				if(node.isLast()){
					return;
				}
    			var index = parseInt(node.text);
    			var parentNode = node.parentNode;
    			var obj = tree.getNodeValue(parentNode);
    			var temp = obj[index];
    			obj[index] = obj[index + 1];
    			obj[index+1] = temp;
    			tree.refreshNode(parentNode);
    			parentNode.expand();
    			var node = tree.getNodeById(parentNode.id + '.' + (index + 1));
    			node.select();
    		}
	    });
	    var applyAction = new Ext.Action({
	    	disabled : true,
	    	text : '更新',
	    	iconCls : 'icon-designtool-apply',
	    	handler : function(){
	    		if(valueEditor.isDirty()){
	    			var node = tree.getSelectionModel().getSelectedNode();
	    			if(node){
	    				var parentObject = tree.getNodeValue(node.parentNode);
	    				var value = valueEditor.getValue();
	    				switch(node.attributes.type){
	    				case 'number':
	    					parentObject[node.text] = parseInt(value);
	    					break;
	    				case 'string':
		    				parentObject[node.text] = value;
		    				break;
	    				case 'boolean':
		    				parentObject[node.text] = value == 'true';
		    				break;
	    				case 'function':
	    					parentObject[node.text] = Ext.decode(value);
	    					break;
	    					
	    				}
	    			}
	    		}
	    	}
	    });
	    var autoApply = new Ext.form.Checkbox({
	    	checked : true,
	    	hideLabel : true
	    });
	    autoApply.on('check', function(f, checked){
	    	if(checked){
	    		applyAction.disable();
	    	}else{
	    		applyAction.enable();
	    	}
	    });
	    
	    var tools = [
	    	renameAction,
	    	'-',
	    	nameField,
	    	typeField,
	    	addAction,
	    	'-',
	    	delAction,
	    	'-',
	    	upAction,
	    	downAction,
	    	'->',
	    	autoApply,
	    	'自动更新',
	    	'-',
	    	applyAction
	    ];
	    
		tree.getSelectionModel().on('selectionchange', function(sm, node){
			renameAction.disable();
			nameField.disable();
			typeField.disable();
			addAction.disable();
			delAction.disable();
			upAction.disable();
			downAction.disable();
			if(!node){
				valueEditor.setValue('');
				return;
			}
			if(node.attributes.editable){
				renameAction.enable();
			}
			if(!node.isRoot){
				delAction.enable();
				if(node.parentNode.attributes.type == 'array'){
					if(!node.isFirst()){
						upAction.enable();
					}
					if(!node.isLast()){
						downAction.enable();
					}
				}
			}
			var value = tree.getNodeValue(node);
			if(node.attributes.type == 'object' || node.attributes.type == 'array'){
				// 设置显示域
				valueEditor.setValue(Mixky.lib.getObjectFormatString(false, value, 0));
				valueEditor.addClass('x-item-disabled');
				valueEditor.el.dom.readOnly = true;
				// 设置添加子对象
				if(node.attributes.type == 'object'){
					nameField.enable();
				}
				typeField.enable();
				addAction.enable();
			}else{
				// 设置显示域
				valueEditor.setValue(value);
				valueEditor.originalValue = value;
				valueEditor.removeClass('x-item-disabled');
				valueEditor.el.dom.readOnly = false;
			}
		});
		
		valueEditor.on('blur', function(f){
			if(!valueEditor.el.dom.readOnly){
				if(autoApply.getValue()){
					applyAction.execute();
				}
			}
		});
	    
	    var ui = new Ext.Panel({
	    	layout : 'border',
	    	tbar : tools,
	    	items : [tree, valueEditor]
	    });
	    
		var buttons = [];
		if(this.confirm){
			buttons = ['->',{
				text : '确定',
				iconCls:'icon-designtool-confirm',
				handler : function(){
					var value = tree.objectValue;
					this.onSelect(Ext.encode(value), value);
					this.collapse();
				},
				scope:this
			},'-',{
				text : '取消',
				iconCls:'icon-designtool-cancel',
				handler : function(){
					this.collapse();
				},
				scope:this
			}];
		}
		
	    var panel = new Ext.Panel({
	        renderTo : el,
	        layout:'fit',
        	beforeexpend : function(field){
	    		var value = Mixky.lib.getObjectFormatString(false, field.realValue, 0);
	    		var object = Ext.decode(value);
	    		if(typeof object != 'object'){
	    			object = {};
	    		}
	    		if(!Ext.isDefined(tree.objectValue) || value != Mixky.lib.getObjectFormatString(false, tree.objectValue, 0)){
		    		tree.setFieldObject(object);
	    		}
	    		tree.getRootNode().expand();
        	},
	        collapseIf:function(e){
        		if(treeEditor.editNode){
    	    		if(treeEditor.el && e.within(treeEditor.el)){
    	    			return false;
    	    		}
        		}
	    		if(typeField.wrap && e.within(typeField.wrap)){
	    			return false;
	    		}
	    		if(typeField.list && e.within(typeField.list)){
	    			return false;
	    		}
	    		return true;
		    },
	        items:[new Ext.Panel({
		        layout:'fit',
	        	height:300,
	        	bbar:buttons,
	        	items:[ui]
	        })]
	    });
	    return panel;
    }

});
Ext.reg('mixkyjsonobjectfield', Mixky.editor.JsonObjectField);