/*!
 * Ext JS Library 3.0.0
 * Copyright(c) 2006-2009 Ext JS, LLC
 * licensing@extjs.com
 * http://www.extjs.com/license
 */

Ext.namespace("Mixky.editor");

Mixky.editor.ComboViewField = Ext.extend(Mixky.editor.PanelTriggerField, {

    editable : false,
    
    minListWidth : 400,
    
    maxHeight : 500,
    
    minHeight : 200,
    
    resizable : false,
    
    remoterenderer : true,

    viewkey : '',
    
    groupkey : '',
    
    // private
    renderPanel : function(el){
		var field = this;
		var cb = {
			success : function(r, o){
				eval(r.responseText);
			},
			scope : this
		};
		Ext.lib.Ajax.request("POST","page.do?url=framework/engine/view/combo.view&viewkey=" + this.viewkey, cb, null,{async : false});
		var viewpanel = this.viewpanel;
		var tree = new Ext.tree.TreePanel({
			region : 'west',
	        width: 150,
	        minSize: 100,
	        maxSize: 300,
			split : true,
	        collapsible : true,
	        collapseMode : 'mini',
	        rootVisible : false,
	        autoScroll : true,
	        animCollapse : false,
	        iconCls : 'icon-sys-modulemenu',
	        title : '检索导航',
	        tools : [{
	        	id : 'refresh',
	        	handler : function(){
	        		tree.refresh();
		        }
	        }],
	        listeners	:{
		        'afterrender' : function(p){
					p.getRootNode().expand();
				}
		    },
	        root: {
	        	id : 'root',
	        	text : 'root',
	        	type : 'groupitem',
	            params : {'groupkey' : this.groupkey}
			},
	        loader: new Ext.tree.TreeLoader({
	            directFn : ModuleAppDirect.getModuleTree,
	        	paramOrder : ['params'],
	        	baseParams : {params : {}},
	        	listeners : {
	        		'beforeload':function(loader, node){
	        			loader.baseParams.params = tree.getNodeParams(node);
	        			loader.baseParams.params.type = node.attributes.type;
	        		}
	        	}
			}),
			selModel : new Ext.tree.DefaultSelectionModel({
				listeners	: {
					'selectionchange' :function(s, n){
						tree.openNode(n);
					}
				}
			}),
			getNodeParams : function(node){
				var params = {};
				if(node.parentNode){
					Ext.apply(params, this.getNodeParams(node.parentNode));
				}
				Ext.apply(params, node.attributes.params);
				return params;
			},
			refresh : function(node){
				if(!node){
					node = this.getSelectionModel().getSelectedNode();
				}
				if(!node || node.isLeaf()){
					return;
				}
				node.reload();
			},
			openNode : function(node){
				if(!node){
					node = this.getSelectionModel().getSelectedNode();
				}
				if(!node){
					return;
				}
				if(node.attributes.isFunctionMenu){
					return;
				}
				var params = this.getNodeParams(node);
				viewpanel.refresh(params);
			}
		});
		
		this.onSelectRecord = function(){
			var key = viewpanel.getKey();
			var display = viewpanel.getDisplay();
			this.onSelect(display, key);
			this.collapse();
		}
	
		var buttons = ['->',{
			text : '确定',
			iconCls:'icon-sys-confirm',
			handler : function(){
				this.onSelectRecord();
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
		
		var panel = new Ext.Panel({
			renderTo : el,
			layout : 'border',
			border : false,
			bbar : buttons,
			height : 300,
			items : [tree, viewpanel]
		});
	    return panel;
    },
	setValue : function(v, noRender){
    	if(!Ext.isDefined(this.valueFieldName) && noRender !== true){
        	if(Ext.isDefined(v) && v != '' && v != 0){
        		this.renderValue(v);
        	}
    	}
	    return Mixky.editor.ComboViewField.superclass.setValue.call(this, v);
	},
	renderValue : function(v){
		if(this.remoterenderer){
			Mixky.app.common.getDictionaryDourlRender("framework/engine/view/combo.view.renderer", v, this.setRawValue.createDelegate(this), {viewkey:this.viewkey});
		}
	}
});
Ext.reg('mixkycomboviewfield', Mixky.editor.ComboViewField);