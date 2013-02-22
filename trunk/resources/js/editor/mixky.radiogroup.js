

Ext.namespace("Mixky.editor");

Mixky.editor.RadioGroup = Ext.extend(Ext.form.RadioGroup, {
	defaultItems : [{
		boxLabel : 'no options',
		disabled : true
	}],
	
	url : undefined,
	
	store : undefined,

    // overwrite
    initComponent: function(){
		if(Ext.isDefined(this.url) && this.url != ''){
			if(!Ext.isDefined(this.item)){
				this.items = [];
			}
			items = this.items;
			var cb = {
				success : function(r, o){
					var datas = Ext.decode(r.responseText);
					for(var i=0;i<datas.length;i++){
						var r = datas[i];
						items.push({boxLabel:r["display"], name:this.name + "_", inputValue:r["value"]});
					}
				},
				scope : this
		    }
			Ext.lib.Ajax.request("POST","page.do?url=" + this.url, cb, null,{async : false});
		}
        Mixky.editor.RadioGroup.superclass.initComponent.call(this);
    },

    // overwrite
	onRender : function(H, F) {
		if(!Ext.isDefined(this.items)){
			this.items = [];
		}
		if(this.items.length == 0 && Ext.isDefined(this.store)){
			for(var i=0;i<this.store.getCount();i++){
				var r = this.store.getAt(i);
				this.items.push({boxLabel:r.get("display"), name:this.name + "_", inputValue:r.get("value")});
			}
		}
		if(this.items.length == 0){
			this.items = this.defaultItems;
		}
		Mixky.editor.RadioGroup.superclass.onRender.call(this, H, F);
	},
	
	
	getValue : function(){
		var item = Mixky.editor.RadioGroup.superclass.getValue.call(this);
		var value = '';
		if(item){
			value = item.inputValue;
		}
		return value;
	},

	setValueForItem : function(val){
	    this.eachItem(function(item){
	        if(val == item.inputValue){
	            item.setValue(true);
                return false;
	        }
	    });
	}
});
Ext.reg('mixkyradiogroup', Mixky.editor.RadioGroup);