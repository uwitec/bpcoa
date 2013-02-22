
Ext.namespace('Mixky.editor');

Mixky.editor.SignField = Ext.extend(Ext.form.TextField, {
	nextAction : 1,
	defaultAutoCreate:{tag:"input", type:"hidden", name:this.name},
	onRender:function (B, A) {
		Ext.form.TextField.superclass.onRender.call(this, B, A);
		this.wrap = this.el.wrap();
		this.wrap.setStyle('padding','2px');
		this.opinionEl = this.wrap.createChild({tag:"div",style:'float:left'});
		if(!this.readOnly){
			this.opinionButtonEl = this.wrap.createChild({tag:"div", align:"right"});
			this.opinionButton = new Ext.Button({text:'签名',handler:this.sign, scope:this});
			this.opinionButton.render(this.opinionButtonEl);
		}
	},
	loadValue:function(v){
		DocumentAppDirect.getUserSignDisplay(v, function(result, e){
			if(result && result.success){
				this.setSign(result.sign);
			}
		}, this);
	},
	sign:function(){
		var v = this.getValue();
		if(!Ext.isDefined(v) || v == null || v == ''){
			this.setValue(Mixky.app.UserInfo.name);
		}else{
			this.setValue();
		}
	},
	setSign:function (A) {
		if(A != '&nbsp;'){
			this.value = A;
		}
		if (this.opinionEl) {
			this.opinionEl.dom.innerHTML = (A === '' || A === null || A === undefined ? "&nbsp;" : A);
		}
	},
	setValue : function(v){
		Ext.form.TextField.superclass.setValue.call(this, v);
		if(Ext.isDefined(v) && v != null && v != ''){
			this.loadValue(v);
			if(this.opinionButton){
				this.opinionButton.setText('取消');
			}
		}else{
			this.setSign(v);
			if(this.opinionButton){
				this.opinionButton.setText('签名');
			}
		}
	}
});
Ext.reg("mixkysignfield", Mixky.editor.SignField);