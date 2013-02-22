
Ext.namespace("Mixky.editor");

Mixky.editor.DisplayField = Ext.extend(Ext.form.TextField,  {
	
	defaultAutoCreate:{tag:"input", type:"hidden", name:this.name},

    htmlEncode: false,
    
    dictionaryname : undefined,
    
    remoterender : undefined,
    
    params : undefined,
    
    dourl : undefined,
    
    url : undefined,
    
    hideDisplayBorder : undefined,

	onRender:function (B, A) {
		Mixky.editor.DisplayField.superclass.onRender.call(this, B, A);
        this.addEvents(
        	'aftersetvalue'
        );
		this.wrap = this.el.wrap();
		if(this.hideDisplayBorder){
			this.displayEl = this.wrap.createChild({tag:"div",style:'padding:3px'});
		}else{
			this.displayEl = this.wrap.createChild({tag:"div",style:'border:1px solid #cccccc;padding:3px'});
		}
		this.displayEl.dom.innerHTML = '&nbsp;';
	},
    setValue : function(v){
		Mixky.editor.DisplayField.superclass.setValue.call(this, v);
		//var display = v;
		if(this.remoterender){
			this.renderValue(v);
		}else{
			this.setRawValue(v);
		}
        this.fireEvent('aftersetvalue', this);
        return this;
    },
    setRawValue : function(v){
    	var display = v;
        if(this.htmlEncode){
        	display = Ext.util.Format.htmlEncode(v);
        }
        if(display && typeof(display) == "string"){
        	display = display.replaceAll('\n', '<BR>').replaceAll('\t', '&emsp;').replaceAll(' ', '&nbsp;');
        }
		this.displayEl.dom.innerHTML = (Ext.isEmpty(display) ? '&nbsp;' : display);
    },
    renderValue : function(v){
    	var field = this;
    	var display = v;
    	if(Ext.isDefined(this.dictionaryname)){
    		display = Mixky.app.common.dictionaryRenderer(v, this.dictionaryname);
        	
    	}else if(Ext.isDefined(this.dourl)){
    		Mixky.app.common.getDictionaryDourlRender(this.dourl, v, this.setRawValue.createDelegate(this), this.params);
    	}else if(Ext.isDefined(this.url)){
    		Mixky.app.common.getDictionaryUrlRender(this.url, v, this.setRawValue.createDelegate(this));
    	}
    	this.setRawValue(display);
    }
});

Ext.reg('mixkydisplayfield', Mixky.editor.DisplayField);
