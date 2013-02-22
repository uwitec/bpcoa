Mixky.designtool.CMain = function(){
	Mixky.designtool.CMain.superclass.constructor.call( this, {
    	region : 'center',
    	activeTab : 0,
        margins:'0 0 5 0',
        enableTabScroll:true,
        defaults: {
    		autoScroll:true,
    		closable : true
    	},
        plugins: new Ext.ux.TabCloseMenu(),
    	items : [{
    		title : '主页标签',
			key : 'main',
			mclass : 'main',
    		closable : false,
    		iconCls : 'icon-designtool-home'
    	}]
	});
	this.getActivatedObject = function(){
		var p = this.getActiveTab();
		if(p){
			return {id:p.id, key:p.key, mclass:p.mclass};
		}
	}
	// 激活对象
	this.on('tabchange', function(tabs, tab){
		if(tab.initialConfig.mclass == 'main'){
			return;
		}
		var oid = {id:tab.id, key:tab.key, mclass:tab.mclass};
		Mixky.designtool.Context.activateObject(oid);
	});
	// 选中对象
	this.selectObject = function(oid){
		if(!oid){
			return;
		}
		var aoid = this.getActivatedObject();
		if(aoid.key == oid.key){
			return;
		}
		var p = this.getItem('p-' + oid.key);
		if(!p){
			return;
		}
		this.activate(p);
	};
	// 处理重命名
	this.renameObject = function(oldKey, newKey){
		var result = this.removeObject(oldKey);
		var cmps = this.findBy(function(cmp){
			return cmp.getId().indexOf('p-' + oldKey) >= 0;
		});
		for(var i=0;i<cmps.length;i++){
			this.remove(cmps[i]);
		}
		return result != false;
	}
	// 移除对象
	this.removeObject = function(key){
		return Ext.isDefined(this.remove('p-' + key));
	};
	this.savePanel = function(panel, needSaveNext){
		if(panel != null){
			if(!panel.save){
				this.savePanelOver(panel, needSaveNext);
			}else{
				panel.save(needSaveNext);
			}
		}
	};
	this.savePanelOver = function(panel, needSaveNext){
		if(needSaveNext){
			var next = panel.nextSibling();
			if(next != null){
				this.savePanel(next, needSaveNext);
			}else{
				var p = Mixky.designtool.Framework.contentPanel.getActiveTab();
				var key = p.getId().substr(2, p.getId().length - 2);
				DesignToolDirect.forceSaveObject(key, function(result, e){});
			}
		}else{
			var p = Mixky.designtool.Framework.contentPanel.getActiveTab();
			var key = p.getId().substr(2, p.getId().length - 2);
			DesignToolDirect.forceSaveObject(key, function(result, e){});
		}
	};
	// 打开对象编辑窗口
	this.openEditor = function(oid){
		// 获得对象设置
		var module = Mixky.designtool.Class.getModule(oid.mclass);
		if(!module || !module.editors || module.editors.length == 0){
			return;
		}
		// 打开窗口
		var editor = Ext.getCmp('p-' + oid.key);
		if(!editor){
			var title = module.text;
			if(!module.isSingle){
				title = module.text + '[' + Ext.util.Format.ellipsis(oid.key, 10) + "]";
			}
			var config = {
				id : 'p-' + oid.key,
				key : oid.key,
				mclass : oid.mclass,
		        margins:'0 0 10 0',
				iconCls : module.iconCls,
				title : title,
				tabTip : oid.key,
				buttonAlign : 'left',
				fbar : []
			};
			if(!module.withoutSave){
				config.fbar.push({
					text : '保存',
					scale: 'medium',
					iconCls : 'icon-designtool-save',
					handler : function(){
					 	Mixky.designtool.Actions.Save.execute();
					}
				},{
					text : '应用',
					scale: 'medium',
					iconCls : 'icon-designtool-apply',
					handler : function(){
					 	Mixky.designtool.Actions.Apply.execute();
					}
				});
			}
			config.fbar.push('->');
			if(module.extendsMenu){
				for(var i=0;i<module.extendsMenu.length;i++){
					var btn = module.extendsMenu[i];
					Ext.apply(btn, {scale: 'medium'});
					Ext.applyIf(btn, {iconCls : 'icon-designtool-extbutton'});
					config.fbar.push(btn);
				}
			}
			config.fbar.push({
				text : '刷新',
				scale: 'medium',
				iconcls : 'icon-designtool-refresh',
				scope : this,
				handler : function(){
					this.refreshEditor(oid);
				}
			},{
				text : '关闭',
				scale: 'medium',
				iconcls : 'icon-designtool-close',
				scope : this,
				handler : function(){
					this.remove('p-' + oid.key);
				}
			});
			if(module.editors.length == 1){
				var panel = new Ext.Panel({
					autoLoad : {
						url:module.editors[0],
						scripts:true,
						border:false,
						params:{
							key:oid.key,
							mclass:module.name
						}
					},
					border:false,
					layout:'fit'
				});
				Ext.apply(panel.autoLoad.params, {id:panel.getId()});
				Ext.apply(config, {
					layout:'fit',
					border:false,
					items : panel,
					footerCssClass:'x-tab-panel-footer'
				});
			}else{
				var items = [];
				for(var i=0;i<module.editors.length;i++){
					var p = new Ext.Panel({
						autoLoad : {
							url:module.editors[i],
							scripts:true,
							params:{
								key:oid.key,
								mclass:module.name
							}
						},
						title : '窗口[' + i + ']...',
						layout:'fit'
					});
					Ext.apply(p.autoLoad.params, {id:p.getId()});
					items.push(p);
				}
				Ext.apply(config, {
					xtype : 'tabpanel',
					deferredRender:false,
					activeTab : 0,
					items : items
				});
			}
			editor = this.add(config);
		}
		this.activate(editor);
		return editor;
	}
	// 刷新编辑器
	this.refreshEditor = function(oid){
		var editor = Ext.getCmp('p-' + oid.key);
		if(!editor){return}
		var panel;
		if(editor.items.length > 1){
			panel = editor.getActiveTab();
		}else{
			panel = editor.items.get(0);
		}
		if(!panel.refresh){
			return;
		}
		panel.refresh();
	}
};

Ext.extend( Mixky.designtool.CMain, Ext.TabPanel, {});