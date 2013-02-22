/*!
 * Ext JS Library 3.0.0
 * Copyright(c) 2006-2009 Ext JS, LLC
 * licensing@extjs.com
 * http://www.extjs.com/license
 */

Ext.namespace("Mixky.editor");

Mixky.editor.DesignObjectField = Ext.extend(Mixky.editor.PanelTriggerField, {

    confirm : true,

    editable : false,
    
    minListWidth : 350,
    
    minHeight : 200,
    
    selectInParent : false,
    
    mclass : '',
    
    parentKey : '',
    
    getParentKey : function(){
		return this.parentKey;
	},
    
    panelSelectOver : function(g){
		var record = g.getSelectionModel().getSelected();
		var value = '';
		var display = '';
		if(record){
			display = record.get('f_caption') + ' [' + record.get('key') + ']';
			value = {classpath:record.get('f_class'),data:record.get('key')};
		}
		this.onSelect(display, value, record);
		this.collapse();
	},
    
    // private
    renderPanel : function(el){
		var field = this;
	    var grid = new Ext.grid.GridPanel({
			border : false,
			autoExpandColumn:'f_note',
			enableHdMenu:false,
			enableColumnMove:false,
	    	store:new Ext.data.DirectStore({
				directFn : DesignToolDirect.getDesignObjectList,
				paramOrder:['mclass', 'parentKey'],
				baseParams : {
	    			mclass : '',
	    			parentKey : ''
				},
				root : 'results',
				totalProperty : 'totals',
				idProperty : 'key',
				fields:[
				    {name:'key', mapping:'key'},
				    {name:'f_key', mapping:'f_key'},
				    {name:'classpath', mapping:'classpath'},
				    {name:'f_class', mapping:'f_class'},
				    {name:'f_name', mapping:'f_name'},
				    {name:'f_caption', mapping:'f_caption'},
				    {name:'f_note', mapping:'f_note'}
				]
			}),
	    	columns:[
	    	    new Ext.grid.RowNumberer(),
	    	    {id : 'key', dataIndex : 'key', header : 'Key', width:120, renderer:function(value, p, record){
	    			var type = record.get("f_class");
	    			return String.format("<div style='height:16px;padding-left:23px;background:transparent url(icon/{0}.gif) no-repeat'> {1}</div>", type, value);
	    		}},
	    	    {id : 'f_class', dataIndex : 'f_class', header : '对象类', width:70},
	    	    {id : 'f_name', dataIndex : 'f_name', header : '命名', width:80},
	    	    {id : 'f_caption', dataIndex : 'f_caption', header : '名称', width:80},
	    	    {id : 'f_note', dataIndex : 'f_note', header : '说明'}
	    	],
			listeners : {
				'rowdblclick' : {
	    			fn:function(g, rowIndex, e){
						this.panelSelectOver(g);
					},
					scope:this
	    		}
			}
	    });

		var filterCombo = new Ext.form.ComboBox({
	    	width : 120,
			triggerAction : 'all',
	    	editable : false,
	    	hideLabel : true,
		    value : 'all',
		    store : ['all', 'same module', 'parent']
		});
		filterCombo.on('select', function(c, record, index){
			var store = grid.getStore();
			var key = field.getParentKey();
			if(key == ''){
				return;
			}
			if(filterCombo.getValue() == 'all'){
				store.clearFilter();
			}else if(filterCombo.getValue() == 'parent'){
				store.filterBy(function(r, id){
					return r.get('key').indexOf(key) == 0;
				});
			}else{
				key = key.split(".")[0];
				store.filterBy(function(r, id){
					return r.get('key').indexOf(key) == 0;
				});
			}
		});
	    
		var buttons = [];
		if(this.confirm){
			buttons = ['筛选：', filterCombo, '->',{
				text : '确定',
				iconCls:'icon-designtool-confirm',
				handler : function(){
					this.panelSelectOver(grid);
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
        	beforeexpend : function(){
	    		var store = grid.getStore();
	    		if(store.baseParams.mclass != field.mclass || store.baseParams.parentKey != field.parentKey){
	    			store.baseParams.mclass = field.mclass;
	    			if(field.selectInParent){
		    			filterCombo.enable();
	    				filterCombo.setValue('parent');
	    			}else{
		    			filterCombo.setValue('all');
		    			filterCombo.disable();
	    			}
	    			store.reload();
	    		}
        	},
	        collapseIf:function(e){
	    		if(filterCombo.wrap && e.within(filterCombo.wrap)){
	    			return false;
	    		}
	    		if(filterCombo.list && e.within(filterCombo.list)){
	    			return false;
	    		}
	    		return true;
		    },
	        items:[new Ext.Panel({
		        layout:'fit',
	        	height:300,
	        	bbar:buttons,
	        	items:[grid]
	        })]
	    });
	    return panel;
    }

});
Ext.reg('mixkydesignobjectfield', Mixky.editor.DesignObjectField);