

Ext.namespace("Mixky.editor");

Mixky.editor.CheckboxGroup = Ext.extend(Ext.form.CheckboxGroup, {
	
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
        Mixky.editor.CheckboxGroup.superclass.initComponent.call(this);
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
		Mixky.editor.CheckboxGroup.superclass.onRender.call(this, H, F);
	},
    // overwrite
	getValue : function(){
	    var items = [];
	    this.eachItem(function(item){
	        if(item.checked){
	        	items.push(item);
	        }
	    });
		var value = '';
		for(var i=0;i<items.length;i++){
			if(i > 0){
				value = value + ',' + items[i].inputValue;
			}else{
				value = items[i].inputValue;
			}
		}
		return value;
	},
    // overwrite
	setValueForItem : function(val){
        val = String(val).split(',');
        for(var i=0;i<val.length;i++){
            this.eachItem(function(item){
                if(val[i] == item.inputValue){
                    item.setValue(true);
                    return false;
                }
            });        	
        }
	}
});
Ext.reg('mixkycheckboxgroup', Mixky.editor.CheckboxGroup);