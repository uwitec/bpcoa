/*!
 * Ext JS Library 3.0.0
 * Copyright(c) 2006-2009 Ext JS, LLC
 * licensing@extjs.com
 * http://www.extjs.com/license
 */

Ext.namespace("Mixky.editor");

Mixky.editor.ComboTree = Ext.extend(Mixky.editor.PanelTriggerField, {

    confirm : true,
    
    minListWidth : 300,
    
    maxHeight : 300,
    
    minHeight : 200,
    
    resizable : false,
    
    selectMulti : true,
    
    valueAttribute : 'key',
    
    displayAttribute : 'text',
    
    valueSeparator : ',',
    
    checkWithParent : true,
    
    valueFieldName : undefined,
    
    getRealValue : function(){
		var value = this.getValue();
		var valueFieldCmp = this.findValueFieldCmp();
		if(valueFieldCmp){
			value = valueFieldCmp.getValue();
		}
		return value;
	},
	
	setRealValue : function(value){
	    this.realValue = value;
		var valueFieldCmp = this.findValueFieldCmp();
		if(valueFieldCmp){
			valueFieldCmp.setValue(value);
		}
	    if(this.hiddenField){
	        this.hiddenField.value = value;
	    }
	},
	
	findValueFieldCmp : function(){
		if(Ext.isDefined(this.valueFieldName)){
			var fp = this.findParentByType('form');
			if(fp){
				return fp.getForm().findField(this.valueFieldName);
			}
		}
	},
	// private
	onSelect : function(display, value, records){
	    if(this.fireEvent('beforeselect', this, display, value, records) !== false){
	        this.setValue(display);
	        this.setRealValue(value);
	        this.collapse();
	        this.fireEvent('select', this, display, value, records);
	    }
	},    
    	
    // private
    renderPanel : function(el){
		var field = this;
		var tree = new Ext.tree.TreePanel({
			region : 'center',
	    	autoScroll:true,
	    	rootVisible :false,
	        style : 'background-color:white',
	    	root: {
				nodeType: 'async',
	            text: '标签选择'
	        },
	        loader: new Ext.tree.TreeLoader({
	        	url: this.dataUrl || this.url,
	        	//url: 'mkoa/knowledge/knowledge.tag.bind.do',
	        	preloadChildren : true
	        }),
	        tools:[{
	        	id:'refresh',
	        	handler:function(){
		        	tree.refresh();
		        }
	        }],
			refresh:function(){
	        	this.getRootNode().reload();
	        }
        });
		
		//tree.show();
			
		tree.getLoader().on('load', function(loader, node, e){
			node.expand(true);
			if (Ext.isDefined(field.valueFieldName)) {
				var fp = field.findParentByType('form');
				var valueField = fp.getForm().findField(field.valueFieldName);
				if (Ext.isDefined(valueField.value)) {
					tree.setValue(valueField.value);
				}
			} else {
				if (Ext.isDefined(field.value)) {
					tree.setValue(field.value);
				}
		    }			
		})
		tree.on('checkchange', function(n, checked){
			if(checked && !field.selectMulti){
				var ids = tree.getChecked('id');
				for(var i=0;i<ids.length;i++){
					if(ids[i] != n.id){
						tree.getNodeById(ids[i]).getUI().toggleCheck(false);
					}
				}
			}
			
			if (field.checkWithParent) {
				if(checked){
					tree.checkAllParentNode(n.parentNode);
				}else{
					tree.unCheckAllChildNode(n);
				}
			}
		});
		
		tree.checkAllParentNode = function(node) {
			if(!node || node == this.getRootNode()){return;}
			node.getUI().toggleCheck(true);
		}
		
		tree.unCheckAllChildNode = function(node) {
			var cs = node.childNodes;
	        for(var i = 0, len = cs.length; i < len; i++) {
				if(!cs[i] || cs[i] == this.getRootNode()){return;}
				cs[i].getUI().toggleCheck(false);
	        }
		}
		
		function checkValue(value, node){
			if(!node){
				node = tree.getRootNode();
			}
	    	//alert('node.attributes[field.valueAttribute]:' + node.attributes[field.valueAttribute] + '\nvalue:' + value);
			if(node.attributes[field.valueAttribute] == value){
				if(Ext.isDefined(node.attributes.checked)){
					node.attributes.checked = true;
					node.getUI().toggleCheck(true);
				}
			}
			node.eachChild(function(n){
				checkValue(value, n);
			});
		}
		tree.setValue = function(value){
			if(field.selectMulti){
				var values = value.split(field.valueSeparator);
				for(var i=0;i<values.length;i++){
					checkValue(values[i]);
				}
			}else{
				checkValue(value);
			}
		}
		var buttons = [];
		if(this.confirm){
			buttons = [{
				text : '刷新',
				iconCls:'icon-sys-refresh',
				handler : function(){
					tree.refresh();
				}
				
			},'->',{
				text : '确定',
				iconCls:'icon-sys-confirm',
				handler : function(){
					var values = tree.getChecked(this.valueAttribute);
					var displays = tree.getChecked(this.displayAttribute);
					var value = '';
					var display = '';
					if(Ext.isDefined(values)){
						for(var i=0;i<values.length;i++){
							if(i==0){
								value = values[i];
								display = displays[i];
							}else{
								value = value + this.valueSeparator + values[i];
								display = display + ';' + displays[i];
							}
						}
					}
					this.onSelect(display, value);
					this.collapse();
				},
				scope:this
			},'-',{
				text : '取消',
				iconCls:'icon-sys-cancel',
				handler : function(){
					this.collapse();
				},
				scope:this
			}];
		}
	    var panel = new Ext.Panel({
	        renderTo : el,
	        layout:'fit',
	        items:[new Ext.Panel({
		        layout:'fit',
	        	height:300,
	        	items:[tree],
		        bbar:buttons
	        })]
	    });
	    return panel;
    }

});
Ext.reg('combotree', Mixky.editor.ComboTree);