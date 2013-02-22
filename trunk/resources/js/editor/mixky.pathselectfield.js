/*!
 * Ext JS Library 3.0.0
 * Copyright(c) 2006-2009 Ext JS, LLC
 * licensing@extjs.com
 * http://www.extjs.com/license
 */

Ext.namespace("Mixky.editor");

Mixky.editor.PathSelectField = Ext.extend(Mixky.editor.PanelTriggerField, {

    confirm : true,
    
    readOnly : true,
    
    minListWidth : 300,
    
    maxHeight : 500,
    
    minHeight : 200,
    
    resizable : false,
    	
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
	            text: '文章路径'
	        },
	        loader: new Ext.tree.TreeLoader({
	            directFn: CrcaAppDirect.getPathTree,
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
		tree.getLoader().on('load', function(loader, node, e){
			node.expand(true);
		    if(Ext.isDefined(field.value)){
		    	tree.setValue(field.value);
		    }
		})
		tree.on('checkchange', function(n, checked){
			if(checked){
				var ids = tree.getChecked('id');
				for(var i=0;i<ids.length;i++){
					if(ids[i] != n.id){
						tree.getNodeById(ids[i]).getUI().toggleCheck(false);
					}
				}
			}
		});
		function checkValue(value, node){
			if(!node){
				node = tree.getRootNode();
			}
			if(node.attributes.f_path == value){
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
			checkValue(value);
		}
		var buttons = [];
		if(this.confirm){
			buttons = [{
				text : '刷新',
				iconCls:'icon-app-refresh',
				handler : function(){
					tree.refresh();
				}
				
			},'->',{
				text : '确定',
				iconCls:'icon-app-confirm',
				handler : function(){
					var display = tree.getChecked('f_path');
					var value = tree.getChecked('f_identify');
					this.onSelect(display, value);
					this.collapse();
				},
				scope:this
			},'-',{
				text : '取消',
				iconCls:'icon-app-cancel',
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
Ext.reg('mixkypathselecttreefield', Mixky.editor.PathSelectField);