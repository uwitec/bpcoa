Ext.namespace("Mixky.designtool.lib");

Mixky.designtool.lib.showRenameWindow = function(fn, key){
	if(!key){
		var oid = Mixky.designtool.Context.activatedObject;
		if(!oid){
			alert('未指定修改键值的对象');
			return;
		}else{
			key = oid.key;
		}
	}
	
	var pKey = '';
	var index = key.lastIndexOf('.');
	if(index > 0){
		pKey = key.substr(0, index);
		key = key.substr(index + 1);
	}
	var panel = new Ext.form.FormPanel({
		labelWidth: 80,
        bodyStyle:'padding:5px',
		defaults: {
			  anchor: "100%"
		},
        defaultType: 'textfield',
		items:[{
			fieldLabel : 'Parent Key',
			name : 'parentKey',
			fieldClass : 'x-item-disabled',
			readOnly : true,
			value :pKey
		},{
			fieldLabel : 'Old Key',
			name : 'oldKey',
			fieldClass : 'x-item-disabled',
			readOnly : true,
			value : key
		},{
			fieldLabel : 'New Key',
			name : 'newKey',
			allowBlank : false,
			selectOnFocus:true,
			value : key
		}],
		isKeyChanged : function(){
			return this.getForm().findField('newKey').getValue() != this.getForm().findField('oldKey').getValue();
		},
		getNewKey : function(){
			return this.getForm().findField('newKey').getValue();
		},
		getOldKey : function(){
			var pKey = this.getForm().findField('parentKey').getValue();
			var key = this.getForm().findField('oldKey').getValue();
			if(pKey == ''){
				return key;
			}else{
				return pKey + '.' + key;
			}
		}
	});
	var selApi = {
    	onSelectedFn:function(value){
			if(panel.getForm().isValid()){
				if(!panel.isKeyChanged()){
					return true;
				}else{
					return fn(panel.getOldKey(), panel.getNewKey());
				}
			}else{
				return false;
			}
		}
	}
	var win = Mixky.lib.getFieldSelectorWindow({
		width:300,
		height:190,
		iconCls:'icon-designtool-rename',
		title:"修改设计对象键值窗口",
		items:panel
	}, selApi);
	win.show();
}

Mixky.designtool.lib.addDesignObject = function(parentKey, mclass, fn){
	if(!parentKey){
		alert('未指定修改键值的对象');
	}
	var panel = new Ext.form.FormPanel({
		labelWidth: 80,
        bodyStyle:'padding:5px',
		defaults: {
			  anchor: "100%"
		},
        defaultType: 'textfield',
		items:[{
			fieldLabel : 'Parent Key',
			name : 'parentKey',
			fieldClass : 'x-item-disabled',
			readOnly : true,
			value :parentKey
		},{
			fieldLabel : 'Object Type',
			name : 'mclass',
			fieldClass : 'x-item-disabled',
			readOnly : true,
			value : mclass
		},{
			fieldLabel : 'Object Key',
			name : 'key',
			allowBlank : false,
			selectOnFocus:true,
			value : ''
		}]
	});
	var selApi = {
    	onSelectedFn:function(){
			if(panel.getForm().isValid()){
				var key = panel.getForm().findField('key').getValue();
				DesignToolDirect.addObject(parentKey, mclass, key, function(result, e){
					if(result.success){
						fn(result.key, result.mclass);
					}else{
						alert('add object [' + parentKey + '].[' + mclass + '] failed');
					}
				});
				return true;
			}else{
				return false;
			}
		}
	}
	var win = Mixky.lib.getFieldSelectorWindow({
		width:300,
		height:190,
		iconCls:'icon-designtool-add',
		title:"创建设计对象窗口",
		items:panel
	}, selApi);
	win.show();
}



Mixky.designtool.lib.addDocumentAuthorityMap = function(documentKey, fn){
	if(!documentKey){
		alert('未指定文档对象键值');
	}
	var panel = new Ext.form.FormPanel({
		labelWidth: 80,
        bodyStyle:'padding:5px',
		defaults: {
			  anchor: "100%"
		},
        defaultType: 'textfield',
		items:[{
			fieldLabel : '文档键值',
			name : 'documentKey',
			fieldClass : 'x-item-disabled',
			readOnly : true,
			value :documentKey
		},{
			xtype : 'combo',
			fieldLabel : '文档状态',
			name : 'f_state',
        	width : 70,
			triggerAction: 'all',
        	editable : false,
        	forceSelection: true,
		    valueField : 'f_key',
		    displayField : 'f_caption',
		    store : new Ext.data.DirectStore({
	    		directFn : DesignToolDirect.getSubObjectList,
	    		paramOrder:['key', 'mclass'],
	    		baseParams : {
	    			key : documentKey,
	    			mclass : 'state'
	    		},
	    		root : 'results',
	    		totalProperty : 'totals',
	    		idProperty : 'f_key',
	    		fields:['f_key', 'f_caption']
	    	})
		},{
			xtype : 'combo',
			fieldLabel : '子状态',
			name : 'f_substate',
        	width:70,
			triggerAction: 'all',
        	editable:false,
        	forceSelection: true,
		    valueField: 'f_key',
		    displayField: 'f_caption',
		    store : new Ext.data.DirectStore({
	    		directFn : DesignToolDirect.getSubObjectList,
	    		paramOrder:['key', 'mclass'],
	    		baseParams : {
	    			key : documentKey,
	    			mclass : 'substate'
	    		},
	    		root : 'results',
	    		totalProperty : 'totals',
	    		idProperty : 'f_key',
	    		fields:['f_key', 'f_caption']
	    	})
		},{
			xtype : 'combo',
			fieldLabel : '文档身份',
			name : 'f_identity',
        	width:70,
			triggerAction: 'all',
        	editable:false,
        	forceSelection: true,
		    valueField: 'f_key',
		    displayField: 'f_caption',
		    store : new Ext.data.DirectStore({
	    		directFn : DesignToolDirect.getSubObjectList,
	    		paramOrder:['key', 'mclass'],
	    		baseParams : {
	    			key : documentKey,
	    			mclass : 'identity'
	    		},
	    		root : 'results',
	    		totalProperty : 'totals',
	    		idProperty : 'f_key',
	    		fields:['f_key', 'f_caption']
	    	})
		}]
	});
	var selApi = {
    	onSelectedFn:function(){
			if(panel.getForm().isValid()){
				var documentKey = panel.getForm().findField('documentKey').getValue();
				var f_state = panel.getForm().findField('f_state').getValue();
				if(f_state == ''){
					f_state = 'any';
				}
				var f_substate = panel.getForm().findField('f_substate').getValue();
				if(f_substate == ''){
					f_substate = 'any';
				}
				var f_identity = panel.getForm().findField('f_identity').getValue();
				if(f_identity == ''){
					f_identity = 'any';
				}
				DesignToolDirect.addDocumentAuthorityMap(documentKey, f_state, f_substate, f_identity, function(result, e){
					if(result.success){
						fn(result.key);
					}else{
						alert('add object [' + documentKey + '].[' + f_state + '-' + f_substate + '-' + f_identity + '] failed');
					}
				});
				return true;
			}else{
				return false;
			}
		}
	}
	var win = Mixky.lib.getFieldSelectorWindow({
		width:300,
		height:190,
		iconCls:'icon-designtool-add',
		title:"创建文档权限映射表窗口",
		items:panel
	}, selApi);
	win.show();
}