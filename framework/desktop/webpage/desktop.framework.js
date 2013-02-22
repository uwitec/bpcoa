
Mixky.desktop.Framework = function(app, config){

	Mixky.desktop.Framework.superclass.constructor.call(this, app, config);
	
	var portalPanel = new Mixky.desktop.Portal({closable:false});
	this.portalPanel = portalPanel;
	
	// 标题条及工具条
	this.header = new Mixky.desktop.Header();
	var header = this.header;
	// 内容
	this.container = new Ext.TabPanel({
		region : 'center',
	    enableTabScroll : true,
	    bodyBorder : false,
	    hideBorders : true,
	    border : false,
		activeTab : 0,
	    defaults : {
			border : false,
		    bodyBorder : false
		},
		items : portalPanel,
	    plugins : new Ext.ux.TabCloseMenu()
	});
	this.container.on('beforeremove', function(tabpanel, panel){
		if(Ext.isDefined(panel.items.get(0).beforeCloseMe)){
			panel.items.get(0).beforeCloseMe();
		};
	});
	
	// 桌面结构
    var view = new Ext.Viewport( {
		layout :'border',
		items : [ this.header, this.container ]
	});
    // 文档窗口
	var windows = new Ext.WindowGroup();
//	windows.zseed = 10000;
    this.getManager = function(){
        return windows;
    }
    this.getWindow = function(id){
        return windows.get(id);
    }
    
    function minimizeWin(win){
        win.minimized = true;
        win.hide();
    }
    function removeWin(win){
    	header.removeWindow(win);
    }
	this.appendWindow = function(win){

        win.render(Ext.getBody());

    	header.appendWindow(win);
        
        win.animateTarget = header.winsButton.getEl();
        
        win.on({
        	'minimize': {
        		fn: minimizeWin
        	},
        	'close': {
        		fn: removeWin
        	}
        });
        
        return win;
	}

    this.createWindow = function(config, cls){
    	var win = new (cls||Ext.Window)(
            Ext.applyIf(config||{}, {
                manager: windows,
                minimizable: true,
                maximizable: true
            })
        );
    	return this.appendWindow(win);
    }

	// 处理右键屏蔽
	Ext.getBody().on('contextmenu', function(e, el) {
		e.preventDefault();
    }); 
	
	//this.layout();
} 

Ext.extend(Mixky.desktop.Framework, Mixky.desktop.IFramework, {
	init : function(){},	
	hideAllWindow : function(){
    	this.getManager().each(function(win){
    		win.minimize();
    	});
	},
	getCurrentModule : function(){
		var panel = this.container.getActiveTab();
		if(panel != this.portalPanel){
			return this.container.getActiveTab().items.get(0);
		}
	},
    // extend method
	showDesktop : function(){
		this.hideAllWindow();
		this.container.activate(this.portalPanel);
	},
    // private method
    getChildMenu : function(menuCfg){
    	var items = [];
    	if(Ext.isDefined(menuCfg.items)){
    		for(var i=0;i<menuCfg.items.length;i++){
    			items.push({
        			text : menuCfg.items[i].text,
        			name : menuCfg.items[i].name,
        		    scale : 'medium',
        			iconAlign : 'top',
        			iconCls : menuCfg.items[i].iconCls,
        			handler : MixkyApp.handlerMenu
    			});
    		}
    	}
    	return items;
    },
    // extend method
    setTheme : function(theme){
		Ext.util.CSS.swapStyleSheet('theme', theme);
    },
    // extend method
	setBackgroundColor : function(hex){
    	if(Ext.isIE){
    		this.portalPanel.body.setStyle('background-color', hex);
    	}else{
    		this.portalPanel.body.setStyle('background-color', '#' + hex);
    	}
	},
    // extend method
	setFrontColor : function(hex){
    	if(Ext.isIE){
    		Ext.util.CSS.updateRule('.ux-shortcut-btn-text', 'color', hex);
    	}else{
    		Ext.util.CSS.updateRule('.ux-shortcut-btn-text', 'color', '#' + hex);
    	}
	},
    // extend method
	setWallpaper : function(path){
		var notifyWin = MixkyApp.showWaitMessage("正在装载墙纸...");
		var wp = new Image();
		wp.src = path;
		var task = new Ext.util.DelayedTask(verify, this);
		task.delay(200);
		var portalEl = this.portalPanel.body;
		function verify(){
			if(wp.complete){
				task.cancel();
				
				notifyWin.setIconClass('x-icon-done');
				notifyWin.setTitle('装载完成');
				notifyWin.setMessage('已完成墙纸装载.');
				MixkyApp.hideNotification(notifyWin);
				
				portalEl.setStyle('background-image','url(' + wp.src + ')');
			}else{
				task.delay(200);
			}
		}
	},
    // extend method
	setWallpaperPosition : function(pos){
		if(pos === "center"){
			var b = this.portalPanel.body;
			b.removeClass('wallpaper-tile');
			b.addClass('wallpaper-center');
		}else if(pos === "tile"){
			var b = this.portalPanel.body;
			b.removeClass('wallpaper-center');
			b.addClass('wallpaper-tile');
		}
	},
    // extend method
	addShortcut : function(o){
		this.portalPanel.addShortcut(o);
	},
    // extend method
	removeShortcut : function(btntype, key){
		this.portalPanel.removeShortcut(btntype, key);
	},
    // extend method
	addQuickStart : function(o){
		o.handler = function(b, e){
			MixkyApp.executeAction(this.btntype, this.key, e);
		}
		this.header.quickButton.appendButton(o);
	},
    // extend method
	removeQuickStart : function(btntype, key){
		this.header.quickButton.removeButton(btntype, key);
	},
    // extend method
	addSubject : function(o){
		return this.portalPanel.addSubject(o);
	},
    // extend method
	removeSubject : function(key){
		return this.portalPanel.removeSubject(key);
	},
	getModule : function(modulekey){
		var win = this.getWindow('m-' + modulekey);
		if(Ext.isDefined(win)){
			return win.items.get(0);
		}
	},
	// extend method
	openModule : function(modulekey){
		var container = this.container;
		var panel = this.container.get('m-' + modulekey);
		if(!panel){
			var module = Mixky.app.Modules[modulekey];
			if(!module){
				return;
			}
			var modulepanel = this.getModulePanel(modulekey);
			panel = this.container.add({
				id : 'm-' + module.key,
				title : module.title,
				layout : 'fit',
				border : false,
				closable : true,
				iconCls : module.icon,
				items : modulepanel
			});
		}
		container.activate(panel);
		return panel.items.get(0);
	},
	getDocument : function(document, id){
		var win = this.getWindow('d-' + document.key + '-' + id);
		if(Ext.isDefined(win)){
			return win.items.get(0);
		}
	},
	// extend method
	_openDocument : function(document, id, params, cfg){
		var win = this.getWindow('d-' + document.key + '-' + id);
		if(!Ext.isDefined(win)){
			var panel = this.getDocumentPanel(document.key, id, params, cfg);
			win = this.createWindow(Ext.apply({
				id : 'd-' + document.key + '-' + id,
				title : document.title,
				iconCls : document.icon,
				layout : 'fit',
				border : false,
				maximizable : false,
				width : 500,
				height : 500,
				items : panel
			}, document.config));
		}
		win.show();
		return win.items.get(0);
	},
	_closeDocument : function(documentkey, id){
		var win = this.getWindow('d-' + documentkey + '-' + id);
		if(Ext.isDefined(win)){
			win.close();
		}
	},
	openWindow : function(id, config){
		var win = this.getWindow(id);
		if(!win){
			this.createWindow(Ext.apply(config, {id : id}));
		}
		return win;
	},
	closeWindow : function(id){
		var win = this.getWindow(id);
		if(win){
			win.close();
		}
	},
    closeAllWindow : function(){
    	this.getManager().each(function(win){
    		win.close();
    	});
    }
});