
Ext.namespace("Mixky.editor");

Mixky.editor.OrganizationWindowField = Ext.extend(Ext.form.TriggerField,  {
	
	defaultAutoCreate:{tag:"textarea", name:this.name},
	
	// defaultAutoCreate:{tag:"div",style:'border:1px solid lightgray;padding:3px'},

    htmlEncode: false,
    
    editable:false,
    
    selectOnFocus : false,
    
    blankText:'全部',
    
    selectMulti : true,
    
    selectType : 'mix',
    
    valueField : 'expression',
    
    displayField : 'f_caption',
    
    valueSeparator : ';',
    
    valueFieldName : undefined,
    
    onTriggerClick : function(){
		var config = {
			selectMulti : this.selectMulti,
			selectType : this.selectType,
			valueField : this.valueField,
			displayField : this.displayField,
			valueSeparator : this.valueSeparator
		}
		value = '';
		var fieldCmp = this;
		var valueFieldCmp = this.findValueFieldCmp();
		if(valueFieldCmp){
			value = valueFieldCmp.getValue();
		}
		Mixky.app.common.getOrganizationWindow(config, value, function(display, value){
			fieldCmp.setValue(display);
			if(valueFieldCmp){
				valueFieldCmp.setValue(value);
			}
		}).show();
    },  
    
    findValueFieldCmp : function(){
		if(Ext.isDefined(this.valueFieldName)){
			var fp = this.findParentByType('form');
			if(fp){
				return fp.getForm().findField(this.valueFieldName);
			}
		}
    }
});

Ext.reg('mixkyorganizationwindowfield', Mixky.editor.OrganizationWindowField);
