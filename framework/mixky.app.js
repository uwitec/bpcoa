/*
 *	Mixap 应用架构
*/

Ext.namespace("Mixky.app");

Mixky.app.Tables = {};

Mixky.app.App = function(cfg){
    Ext.apply(this, cfg);
    this.addEvents({
        'ready' : true,
        'beforeunload' : true
    });
    
    Mixky.mkoa.REMOTING_API.timeout = 60000;
    Mixky.mkoa.REMOTING_API.maxRetries = 0;
    
    Ext.Direct.addProvider(Mixky.mkoa.REMOTING_API);
    Ext.onReady(this.initApp, this);
};

Ext.extend(Mixky.app.App, Ext.util.Observable, {
	
    isReady : false,
    
    init : Ext.emptyFn,
    
    userConfig : undefined,
    
    userMenus : undefined,
    
    initApp : function(){
    
		// prevent backspace (history -1) shortcut
		var map = new Ext.KeyMap(document, [{
  			key: Ext.EventObject.BACKSPACE,
  			//stopEvent: true,
  			fn: function(key, e){
  				var t = e.target.tagName;
  				if(t != "INPUT" && t != "TEXTAREA"){
  					e.stopEvent();
  				}
  			}
  		}]);
		this.USERID = Mixky.app.common.getCookie('uid');
		this.USERNAME = Mixky.app.common.getCookie('uname');
		this.USERDEPT = Mixky.app.common.getCookie('udept');
		// 初始化桌面对象
		this.menus = this.initMenuTree();
		// 创建桌面对象
		this.desktop = new Mixky.desktop.Framework(this);
		
		// 获得用户界面设置
		if(!this.userConfig){
			this.getUserConfig();
		}else{
			this.setUserConfig();
		}
		
		Ext.QuickTips.init();

        Ext.EventManager.on(window, 'beforeunload', this.onUnload, this);
        // 屏蔽右键
		Ext.getBody().on('contextmenu', function(e, el) {
			e.preventDefault();
        });
		// 处理Ext交互错误
		Ext.Direct.on('exception', function(e){
			MixkyApp.showErrorMessage(e.message, "服务器交互错误");
		});

		// 执行自动装载
		this.doAutoOpen.defer(500, this);
		
		this.fireEvent('ready', this);
        this.isReady = true;
    },
    initMenuTree : function(){
		var menus = [];
    	for(var i=0;i<this.userMenus.length;i++){
    		var menu = Mixky.app.Menus[this.userMenus[i]];
    		if(!menu){
    			continue;
    		}
    		if(menu.parentId != 0){
    			if(menu.type == 'modulemenu'){
    		    	for(n in Mixky.app.Menus){
	        			var parentMenu = Mixky.app.Menus[n];
    		    		if(parentMenu.type == 'sysmodulemenu' && menu.parentId == parentMenu.modulekey){
    	        			if(!Ext.isDefined(parentMenu.items)){
    	        				parentMenu.items = [];
    	        			}
    	        			parentMenu.items.push(menu);
    		    		}
    		    	}
    			}else{
        			var parentMenu = this.getMenuById(menu.parentId);
        			if(!Ext.isDefined(parentMenu.items)){
        				parentMenu.items = [];
        			}
        			parentMenu.items.push(menu);
    			}
    		}else{
    			menus.push(menu);
    		}
    	}
    	return menus;
    },
    // 获得用户设置数据
    getUserConfig : function(){
    	var app = this;
    	UserConfigDirect.getUserConfig('', function(result, e){
    		if(result && result.success){
    			app.userConfig = result.userconfig;
    			app.setUserConfig();
    		}else{
    			app.showError('装载用户设置信息失败！');
    		}
    	});
    },
    // 设置用户界面配置
    setUserConfig : function(){
		this.desktop.setMenus(this.menus);
    	this.desktop.setWallpaper(this.userConfig.wallpaper);
    	this.desktop.setWallpaperPosition(this.userConfig.wallpaperposition);
    	this.desktop.setTransparency(this.userConfig.transparency);
    	this.desktop.setBackgroundColor(this.userConfig.backgroundcolor);
    	this.desktop.setFrontColor(this.userConfig.frontcolor);
    	this.desktop.setTheme(this.userConfig.theme);
    	for(var i=0;i<this.userConfig.shortcuts.length;i++){
    		var o = Ext.apply({}, this.userConfig.shortcuts[i]);
    		this.desktop.addShortcut(o);
    	}
    	this.userConfig.subjects.sort(function(a,b){
    		var rowa = Ext.isDefined(a.row) ? a.row : 0;
    		var rowb = Ext.isDefined(b.row) ? b.row : 0;
    		var cola = Ext.isDefined(a.col) ? a.col : 0;
    		var colb = Ext.isDefined(b.col) ? b.col : 0;
    		return cola == colb ? rowa > rowb : cola > colb;
    	});
    	for(var i=0;i<this.userConfig.subjects.length;i++){
    		var o = Ext.apply({}, this.userConfig.subjects[i]);
    		this.desktop.addSubject(o);
    	}
    	for(var i=0;i<this.userConfig.quickstarts.length;i++){
    		var o = Ext.apply({}, this.userConfig.quickstarts[i]);
    		this.desktop.addQuickStart(o);
    	}
    },
    // 设置窗口风格
    setTheme : function(theme){
		if(theme){
	    	this.userConfig.theme = theme;
	    	this.desktop.setTheme(this.userConfig.theme);
		}
    },
    // 设置背景色
	setBackgroundColor : function(hex){
		if(hex){
	    	this.userConfig.backgroundcolor = hex;
	    	this.desktop.setBackgroundColor(this.userConfig.backgroundcolor);
		}
	},
	// 设置前景色
	setFrontColor : function(hex){
		if(hex){
	    	this.userConfig.frontcolor = hex;
	    	this.desktop.setFrontColor(this.userConfig.frontcolor);
		}
	},
	// 设置任务栏透明度
	setTransparency : function(v){
		if(v >= 0 && v <= 100){
	    	this.userConfig.transparency = v;
	    	this.desktop.setTransparency(this.userConfig.transparency);
		}
	},
	// 设置墙纸
	setWallpaper : function(path){
		if(path){
	    	this.userConfig.wallpaper = path;
	    	this.desktop.setWallpaper(this.userConfig.wallpaper);
		}
	},
	// 设置墙纸位置
	setWallpaperPosition : function(pos){
		if(pos){
	    	this.userConfig.wallpaperposition = pos;
	    	this.desktop.setWallpaper(this.userConfig.wallpaperposition);
		}
	},
	// 显示桌面
	showDesktop : function(){
		this.desktop.showDesktop();
	},
	// 判断是否存在桌面按钮
	hasShortcut : function(btntype, key){
		for(var i=0;i<this.userConfig.shortcuts.length;i++){
			if(this.userConfig.shortcuts[i].btntype == btntype && this.userConfig.shortcuts[i].key == key){
				return true;
			}
		}
	},
	// 添加桌面按钮
	addShortcut : function(o){
		this.userConfig.shortcuts.push(o);
		var c = {};
		c = Ext.apply(c, o);
		this.desktop.addShortcut(c);
	},
	// 删除桌面按钮
	removeShortcut : function(btntype, key){
		this.desktop.removeShortcut(btntype, key);
		// 从数组中删除
		for(var i=0;i<this.userConfig.shortcuts.length;i++){
			if(this.userConfig.shortcuts[i].btntype == btntype && this.userConfig.shortcuts[i].key == key){
				this.userConfig.shortcuts.splice(i, 1);
				break;
			}
		}
	},
	// 判断是否存在快捷菜单
	hasQuickStart : function(btntype, key){
		for(var i=0;i<this.userConfig.quickstarts.length;i++){
			if(this.userConfig.quickstarts[i].btntype == btntype && this.userConfig.quickstarts[i].key == key){
				return true;
			}
		}
	},
	// 添加桌面按钮
	addQuickStart : function(o){
		this.userConfig.quickstarts.push(o);
		var c = {};
		c = Ext.apply(c, o);
		this.desktop.addQuickStart(c);
	},
	// 删除桌面按钮
	removeQuickStart : function(btntype, key){
		this.desktop.removeQuickStart(btntype, key);
		// 从数组中删除
		for(var i=0;i<this.userConfig.quickstarts.length;i++){
			if(this.userConfig.quickstarts[i].btntype == btntype && this.userConfig.quickstarts[i].key == key){
				this.userConfig.quickstarts.splice(i, 1);
				break;
			}
		}
	},
	// 判断是否存在桌面栏目
	hasSubject : function(key){
		for(var i=0;i<this.userConfig.subjects.length;i++){
			if(this.userConfig.subjects[i].key == key){
				return true;
			}
		}
	},
	// 获得桌面栏目配置信息
	getSubject : function(key){
		for(var i=0;i<this.userConfig.subjects.length;i++){
			if(this.userConfig.subjects[i].key == key){
				return this.userConfig.subjects[i];
			}
		}
	},
	// 添加桌面栏目
	addSubject : function(o){
		this.userConfig.subjects.push(o);
		var c = {};
		c = Ext.apply(c, o);
		this.desktop.addSubject(c);
	},
	// 删除桌面栏目
	removeSubject : function(key){
		this.desktop.removeSubject(key);
		// 从数组中删除
		for(var i=0;i<this.userConfig.subjects.length;i++){
			if(this.userConfig.subjects[i].key == key){
				this.userConfig.subjects.splice(i, 1);
				break;
			}
		}
	},
    // 保存用户配置信息
    saveUserConfig : function(key){
    	UserConfigDirect.saveUserConfig(key, this.userConfig, function(result, e){
    		if(result && result.success){
    			app.showInfo('保存用户信息成功！');
    		}else{
    			app.showError('保存用户设置信息失败！');
    		}
    		
    	});
    },
    // private 根据ID获得菜单
    getMenuById : function(id){
    	for(n in Mixky.app.Menus){
    		if(Mixky.app.Menus[n].id == id){
    			return Mixky.app.Menus[n];
    		}
    	}
    },
    // 显示等待信息
    showWaitMessage : function(message, title){
    	var win = this.showNotification({
    		title : '请稍候...' || title,
			html : message, 
			iconCls : 'x-icon-wait'
    	});
    	return win;
    },
    // 显示信息
    showInfoMessage : function(message, title){
    	var win = this.showNotification({
    		title : '信息提示' || title,
			html : message, 
			iconCls : 'x-icon-information'
    	});
    	this.hideNotification(win);
    	
    },
    // 显示警告信息
    showAlertMessage : function(message, title){
    	var win = this.showNotification({
    		title : '警告信息' || title,
			html : message, 
			iconCls : 'x-icon-alert'
    	});
    	this.hideNotification(win);
    },
    // 显示错误信息
    showErrorMessage : function(message, title){
    	var win = this.showNotification({
    		title : '错误提示' || title,
			html : message, 
			iconCls : 'x-icon-error'
    	});
    	this.hideNotification(win);
    },
    showDirectActionFail : function(actionName, result, e){
		MixkyApp.showErrorMessage('【' + actionName + "】操作失败！");
    },
    showFormActionFail : function(f, a){
    	switch (a.failureType) {
        case Ext.form.Action.CLIENT_INVALID:
			MixkyApp.showErrorMessage("提交数据非法！");
            break;
        case Ext.form.Action.CONNECT_FAILURE:
			MixkyApp.showErrorMessage("服务器连接错误！");
            break;
        case Ext.form.Action.SERVER_INVALID:
        	if (a.result.errors && a.result.errors.msg) {
        		MixkyApp.showErrorMessage('服务器数据处理错误！<br/>' + a.result.errors.msg);
        	} else {
        		MixkyApp.showErrorMessage("服务器数据处理错误！");
        	}
            break;
        case Ext.form.Action.LOAD_FAILURE:
			MixkyApp.showErrorMessage("表单数据装载失败！");
            break;
    	}
    },
    // private 显示提示窗口
	showNotification : function(config){
		var win = new Mixky.app.Notification(Ext.apply({
			animateTarget : this.desktop.getAnimateTarget() ,
			autoDestroy: true, 
			hideDelay: 5000, 
			html: '', 
			iconCls: 'x-icon-waiting', 
			title: ''
		}, config));
		win.show();
		return win;
	},
    // private 隐藏提示窗口
	hideNotification : function(win, delay){
		if(win){
			(function(){ win.animHide(); }).defer(delay || 2000);
		}
	},
	// 菜单处理函数
	handlerMenu : function(item, e){
		MixkyApp.executeMenu(item.name, e);
	},
	// 打开菜单
	executeMenu : function(name, e){
		var menu = Mixky.app.Menus[name];
		if(!menu){
			return;
		}
		if(menu.handler){
			menu.handler(e);
		}else{
			switch(menu.type){
			case 'sysmodulegroup':
				break;
			case 'sysmodulemenu':
				this.desktop.openModule(menu.modulekey);
				if(Ext.isDefined(menu.items)){
					for(var i=0;i<menu.items.length;i++){
						if(menu.items[i].isdefault){
							this.executeMenu(menu.items[i].name, e);
							break;
						}
					}
				}
				break;
			case 'modulesubmenu':
			case 'modulemenu':
				var module = this.desktop.openModule(menu.modulekey);
				if(Ext.isDefined(menu.viewurl)){
					if(module && module.openUrl){
						module.openUrl('v-' + menu.key, menu.viewurl);
					}
				}else if(Ext.isDefined(menu.viewkey)){
					if(module && module.openView){
						module.openView(menu.viewkey);
					}
				}
				break;
			}
		}
	},
	// 打开快捷键
	executeAction : function(type, key, e){
		switch(type){
		case 'sys':
			switch(key){
			case 'preferences':
				Mixky.app.Actions.Preferences.execute();
				break;
			case 'password':
				Mixky.app.Actions.ChangePassword.execute();
				break;
			case 'help':
				Mixky.app.Actions.Help.execute();
				break;
			case 'designtool':
				Mixky.app.Actions.DesignTool.execute();
				break;
			case 'desktop':
				Mixky.app.Actions.ShowDesktop.execute();
				break;
			}
			break;
		case 'menu':
			this.executeMenu(key, e);
			break;
		case 'document':
			var docparams = key.split('|');
			if(docparams.length > 1){
				this.desktop.openDocument(docparams[0], docparams[1]);
			}
			break;
		case 'folder':
			break;
		}
	},
    
    onReady : function(fn, scope){
        if(!this.isReady){
            this.on('ready', fn, scope);
        }else{
            fn.call(scope, this);
        }
    },

    onUnload : function(e){
        if(this.fireEvent('beforeunload', this) === false){
            e.stopEvent();
        }
    },
    
    doAutoOpen : function(){
    	// 隐藏屏蔽界面
        Ext.get('loading').remove();
        Ext.get('loading-mask').fadeOut({remove:true});
	    // 自动装载模块、视图、文档
        var isOpenDocument = false;
    	if(Ext.isDefined(this.openParams)){
    		if(Ext.isDefined(this.openParams.modulekey)){
    			var module = this.desktop.openModule(this.openParams.modulekey);
    			if(this.openParams.viewkey && Ext.isDefined(module)){
    				module.openView(this.openParams.viewkey);
    			}
    		}
        	if(Ext.isDefined(this.openParams.documentkey) && Ext.isDefined(this.openParams.documentid)){
        		isOpenDocument = true;
        		Mixky.app.common.openFavorite(this.openParams.documentkey, this.openParams.documentid);
        	}
    	}
    	if(!isOpenDocument && !this.userConfig.hideDayTips){
    		Mixky.app.common.ShowDayTips();
    	}
    }
});