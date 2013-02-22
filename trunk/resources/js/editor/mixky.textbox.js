/*!
 * Ext JS Library 3.0.0
 * Copyright(c) 2006-2009 Ext JS, LLC
 * licensing@extjs.com
 * http://www.extjs.com/license
 */

Ext.namespace("Mixky.editor");

Mixky.editor.TextboxField = Ext.extend(Mixky.editor.PanelTriggerField, {

    confirm : true,
    
    editable : false,
    
    minListWidth : 300,
    
    minHeight : 200,
    
    // override
    getValue : function(){
	    var v = this.value;
	    if(v === this.emptyText || v === undefined){
	        v = '';
	    }
	    return v;
	},
    
    // private
    renderPanel : function(el){
		var textarea = new Ext.form.TextArea({
	        hideLabel: true,
	        anchor:'100%',
	        height:200
	    });
		var buttons = [];
		if(this.confirm){
			buttons = ['->',{
				text : '确定',
				iconCls:'icon-designtool-confirm',
				handler : function(){
					var value = textarea.getValue();
					this.onSelect(value, value);
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
	    		textarea.setValue(field.value);
	    		textarea.value = field.value;
        	},
	        items:[new Ext.Panel({
		        layout:'fit',
	        	height:150,
	        	items:[textarea],
		        bbar:buttons
	        })]
	    });
	    return panel;
    }

});
Ext.reg('mixkytextboxfield', Mixky.editor.TextboxField);