/*
 * 系统模块标签
 */
Mixky.app.Document = function(documentkey, documentid, params, cfg){
	this.documentkey = documentkey;
	this.documentid = documentid;
	if(Ext.isDefined(params)){
		this.params = params;
	}
	var doc = Mixky.app.Documents[documentkey];
	var documentPanel = this;
	var config = {
        enableTabScroll:true,
        defaults: {
    		autoScroll:true
    	},
    	openerId : this.getOpenerId(),
        plugins: new Ext.ux.TabCloseMenu(),
        bbar : [{
        	text : '关闭',
        	minWidth : 50,
        	iconAlign: 'top',
        	iconCls : 'icon-sys-close',
        	handler : function(){
        		MixkyApp.desktop.closeDocument(documentkey, documentid);
	        }
        }, '->']
	}
	this.addEvents('afterdocumentupdate');
	Mixky.app.Document.superclass.constructor.call(this, Ext.apply(config, cfg));
    Ext.onReady(this.initDocument, this);
};

Ext.extend(Mixky.app.Document, Ext.TabPanel, {
	// Document Key
	documentkey : '',
	// Document Id
	documentid : 0,
	// 初始参数
	params : null,
	// 初始化模块
	initDocument : function(){
		var documentPanel = this;
		var doc = Mixky.app.Documents[this.documentkey];
		// 获得有权限打开的表单
		DocumentAppDirect.getPanelButtons(this.documentkey, this.documentid, function(result, e){
			if(result && result.success){
				for(var i=0;i<result.panels.length;i++){
					var panel = documentPanel.openPanel(result.panels[i]);
					if(i==0 && Ext.isDefined(panel)){
						documentPanel.activate(panel);
					}
				}
				var bar = documentPanel.getBottomToolbar();
				// 处理普通按钮
				for(var i=0;i<result.buttons.length;i++){
					var button = doc.buttons[result.buttons[i]];
					if(Ext.isDefined(button)){
						var b = bar.add(Ext.apply({minWidth : 50, iconAlign : 'top', iconCls : button.icon}, button));
						// 按钮初始值
						b.document = documentPanel;
					}
				}
				// 处理流程按钮
				for(var i=0;i<result.flowbuttons.length;i++){
					var b = bar.add(Mixky.workflow.FlowAction(documentPanel, result.flowbuttons[i]));
				}
			}else{
				MixkyApp.showErrorMessage("打开文档（" + doc.title + "）标签及按钮失败");
			}
		});
	},
	deleteDocument : function(fn){
		var doc = this;
		MixkyApp.desktop.deleteDocument(doc.documentkey, doc.documentid, function(){
			doc.afterDeleteDocument();
			if(Ext.isDefined(fn)){
				fn.call();
			}
		});
	},
	afterDeleteDocument : function(){
		this.afterDocumentUpdate();
	},
	afterDocumentUpdate : function(){
		if(Ext.isDefined(this.openerId)){
			var opener = Ext.getCmp(this.openerId);
			if(Ext.isDefined(opener) && Ext.isDefined(opener.refresh)){
				opener.refresh();
			}
		}
		this.fireEvent('afterdocumentupdate', this.documentkey, this.documentid);
	},
	confirmDocument : function(){
		var key = this.documentkey;
		var id = this.documentid;
		var fn = function(){
			MixkyApp.desktop.closeDocument(key, id);
		}
		this.submitDocument(fn);
	},
	submitDocument : function(fn){
		var panel = this.get(0);
		if(!panel){
			alert('panel is no defined')
			return;
		}else{
			this.submitPanel(panel, fn);
		}
	},
	submitPanel : function(panel, fn){
		if(panel != null){
			panel.submit(fn);
		}
	},
	submitPanelOver : function(panel, fn){
		var next = panel.nextSibling();
		if(next && next != null){
			this.submitPanel(next, fn);
		}else{
			this.afterDocumentUpdate();
			MixkyApp.showInfoMessage('文档保存完毕！');
			if(Ext.isFunction(fn)){
				fn.call();
			}
		}
	},
	// 打开标签页
	openPanel : function(panelkey){
		var panel = this.getItem('p-' + panelkey + '-' + this.documentid);
		if(!panel){
			var dp = Mixky.app.Documents[this.documentkey].panels[panelkey];
			if(!dp){
				return;
			}else{
				panel = new Ext.Panel(Ext.apply({
					id : 'p-' + dp.key + '-' + this.documentid,
					title : dp.title,
					iconCls : dp.icon,
					autoScroll : true,
					layout : 'fit',
					autoLoad : {
						url : 'framework/engine/document/documentpanel.do',
						params : {
							panelid:'p-' + dp.key + '-' + this.documentid, 
							panelkey : panelkey, 
							documentid : this.documentid
						},
						loadScripts : true,
						callback : function(){
							this.showMask(false);
						},
						scope : this,
						scripts	: true
					},
					doAutoLoad : function(){
						this.document.showMask(true);
						// 拷贝自Ext.Panel（扩展方法）
				        var u = this.body.getUpdater();
				        if(this.renderer){
				            u.setRenderer(this.renderer);
				        }
				        u.update(Ext.isObject(this.autoLoad) ? this.autoLoad : {url: this.autoLoad});
					},
					reload:function(){
						this.removeAll();
						this.load(this.initialConfig.autoLoad);
					},
					document : this,
					refresh : Ext.emptyFn,
					submit : function(fn){
						this.document.submitPanelOver(this, fn);
					}
				}, dp.config));
				this.add(panel);
			}
		}
		return panel;
	},
	openUrl : function(id, url, cfg){
		var panel = this.getItem(id);
		if(!panel){
			panel = new Ext.Panel(Ext.apply({
				id : id,
				layout : 'fit',
				autoLoad : {
					url : url,
					params : {
						panelid : id,
						documentkey : this.documentkey, 
						documentid : this.documentid
					},
					loadScripts : true,
					scripts	: true
				},
				refresh : Ext.emptyFn,
				submit : Ext.emptyFn
			}, cfg));
			this.add(panel);
		}
		this.activate(panel);
		return panel;
	},
	getOpenerId : function(){
		var module = MixkyApp.desktop.getCurrentModule();
		if(module){
			var view = module.getCurrentView();
			if(view){
				return view.getId();
			}
		}
	},
	showMask : function(show){
		if(!this.mask){
			var win = this.findParentByType('window');
			this.mask = new Ext.LoadMask(win.body, {msg:"装载标签界面，请稍候..."});
		}
		if(show){
			this.mask.show();
		}else{
			this.mask.hide();
		}
	}
});