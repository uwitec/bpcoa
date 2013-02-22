/*
 *	Mixap 桌面架构
*/


Ext.namespace("Mixky.desktop");


Mixky.desktop.IFramework = function(app, config){
	this.app = app;
	Ext.apply(this, config);
};

Mixky.desktop.IFramework.prototype = {
	// 应用
	app : null,
	// 初始化桌面
	init : Ext.emptyFn,
	// 设置消息窗口显示位置
	getAnimateTarget : function(){
		return document;
	},
	getModulePanel : function(modulekey, cfg){
		var panel;
		var module = Mixky.app.Modules[modulekey];
		if(Ext.isDefined(module.url)){
			panel = new Ext.Panel(Ext.apply({
				id : 'mp-' + modulekey,
				iconCls : module.icon,
				layout : 'fit',
				autoLoad : {
					url : module.url,
					params : {panelid:'mp-' + modulekey, modulekey : modulekey},
					loadScripts : true,
					scripts	: true
				}
			}, cfg));
			panel.modulekey = modulekey;
			panel.openView = Ext.emptyFn;
			panel.openUrl = Ext.emptyFn;
		}else{
			panel = new Mixky.app.Module(Ext.apply({
				'modulekey' : modulekey,
				border : false
			}, cfg));
		}
		return panel;
	},
	getDocumentPanel : function(documentkey, id, params, cfg){
		var panel = new Mixky.app.Document(documentkey, id, params, cfg);
		return panel;
	},
	// 设置墙纸
	setWallpaper : Ext.emptyFn,
	// 设置墙纸位置
	setWallpaperPosition : Ext.emptyFn,
	// 设置透明度
	setTransparency : Ext.emptyFn,
	// 设置背景颜色
	setBackgroundColor : Ext.emptyFn,
	// 设置前景色
	setFrontColor : Ext.emptyFn,
	// 设置样式
	setTheme : Ext.emptyFn,
	// 添加菜单项
	setMenus : Ext.emptyFn,
	// 添加桌面菜单项
	addContextMenuItem : Ext.emptyFn,
	// 添加快捷菜单
	addShortcut : Ext.emptyFn,
	// 移除快捷菜单
	removeShortcut : Ext.emptyFn,
	// 添加快速启动按钮
	addQuickStart : Ext.emptyFn,
	// 移除快速启动按钮
	removeQuickStart : Ext.emptyFn,
	// 添加桌面栏目
	addSubject : Ext.emptyFn,
	// 移除桌面栏目
	removeSubject : Ext.emptyFn,
	// 显示桌面
	showDesktop : Ext.emptyFn,
	// 获得文档
	getDocument : Ext.emptyFn,
	// 获得模块
	getModule : Ext.emptyFn,
	// 获得当前模块
	getCurrentModule : Ext.emptyFn,
	// 打开模块
	openModule : Ext.emptyFn,
	// 打开文档
	_openDocument : Ext.emptyFn,
	// 打开文档
	openDocument : function(documentkey, id, params, cfg){
		if(typeof(id) == "string"){
			id = parseInt(id);
		}
		var doc = Mixky.app.Documents[documentkey];
		if(!doc){
			MixkyApp.showErrorMessage('打开文档失败，文档类型[' + documentkey + ']没有定义。');
		}else{
			if(!id || id == 0){
				if(Ext.isDefined(doc.tablename) && doc.tablename != ''){
					Mixky.lib.getNewTableRecordId(doc.tablename, function(id){
						MixkyApp.desktop.openDocument(documentkey, id, params, cfg);
					});
				}else{
					MixkyApp.showErrorMessage('打开文档失败，文档类型[' + documentkey + ']没有指定数据表。');
				}
			}else{
				this._openDocument(doc, id, params, cfg);
			}
		}
	},
	// 关闭文档
	_openDocument : Ext.emptyFn,
	// 关闭文档
	closeDocument : function(documentkey, id){
		this._closeDocument(documentkey, id);
	},
	
	openUrlWithWindow : function(id, url, wincfg, panelcfg){
		var win = this.getWindow(id);
		if(!Ext.isDefined(win)){
			var panel = new Ext.Panel(Ext.apply({
				id : 'p-' + id,
				layout : 'fit',
				autoLoad : {
					url : url,
					params : {panelid:'p-' + id},
					loadScripts : true,
					scripts	: true
				}
			}, panelcfg));
			win = this.createWindow(Ext.apply({
				id : id,
				title : 'window - ' + url,
				layout : 'fit',
				border : false,
				maximizable : false,
				width : 500,
				height : 500,
				items : panel
			}, wincfg));
		}
		win.show();
		return win;
	},
	
	openDourlWithWindow : function(id, url, wincfg, panelcfg, params){
		var win = this.getWindow(id);
		if(!Ext.isDefined(win)){
			var panel = new Ext.Panel(Ext.apply({
				id : 'p-' + id,
				layout : 'fit',
				autoLoad : {
					url : 'page.do',
					params : Ext.apply({url: url, panelid:'p-' + id}, params),
					loadScripts : true,
					scripts	: true
				}
			}, panelcfg));
			win = this.createWindow(Ext.apply({
				id : id,
				title : 'window - ' + url,
				layout : 'fit',
				border : false,
				maximizable : false,
				width : 500,
				height : 500,
				items : panel
			}, wincfg));
		}
		win.show();
		return win;
	},
	
	openWindow : Ext.emptyFn,
	
	closeWindow : Ext.emptyFn,
	
	closeAllWindow : Ext.emptyFn,
	// 删除文档
	deleteDocument : function(documentkey, id, fn){
		if(typeof(id) == "string"){
			id = parseInt(id);
		}
		Ext.MessageBox.confirm('危险操作提示', '删除文档，该操作不可恢复，您确定吗？', function(btn){
			if(btn == 'yes'){
				DocumentAppDirect.deleteDocument(documentkey, id, function(result, e){
					if(result && result.success){
						// 调用回调函数
						if(Ext.isDefined(fn)){
							fn.call();
						}
						MixkyApp.desktop.closeDocument(documentkey, id);
					}else{
						MixkyApp.showErrorMessage('删除文档失败');
					}
				})
			}
		});
	}
}