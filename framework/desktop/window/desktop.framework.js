/*
 *	Mixap window 样式桌面
 */

Mixky.desktop.Framework = function(app, config){
	Mixky.desktop.Framework.superclass.constructor.call(this, app, config);
	// 创建默认界面元素
	Ext.getBody().createChild({
		id : 'x-desktop',
		tag : 'div'
	});
	Ext.getBody().createChild({
		id : 'ux-taskbar',
		tag : 'div',
		children : [
			{id : 'ux-taskbar-start', tag : 'div'},
			{id : 'ux-taskbar-panel-wrap', tag : 'div', children : [
				{id : 'ux-quickstart-panel', tag : 'div'},
				{id : 'ux-taskbuttons-panel', tag : 'div'}
			]},
			{id : 'x-clear',tag : 'div'}
		]
	});
	
	var windows = new Ext.WindowGroup();
	
    this.getManager = function(){
        return windows;
    }

    this.getWindow = function(id){
        return windows.get(id);
    }
	
    var activeWindow;
	
    var desktopEl = Ext.get('x-desktop')
	this.el = desktopEl;

	var taskbar = new Mixky.desktop.TaskBar(this);
	this.taskbar = taskbar;
	
	this.shortcuts = new Mixky.desktop.Shortcuts({
		renderTo : desktopEl,
    	taskbarEl : taskbar.el
    });
	
	this.contextmenu = new Ext.menu.Menu({
		items : [
	      Mixky.app.Actions.Preferences,
	      Mixky.app.Actions.SavePreferences,
	      Mixky.app.Actions.DelPreferences,
	      Mixky.app.Actions.SaveAsDefaultPreferences,
	      '-',
	      Mixky.app.Actions.ChangePassword,
	      '-',
	      Mixky.app.Actions.Help,
	      Mixky.app.Actions.DesignTool,
	      '-',
	      Mixky.app.Actions.Exit,
	      '-',
	      Mixky.app.Actions.ShowDayTips,
	      Mixky.app.Actions.About
		]
	});
	
	function layout(){
		desktopEl.setHeight(Ext.lib.Dom.getViewHeight() - taskbar.el.getHeight());
    }
    this.layout = layout;

    Ext.EventManager.onWindowResize(layout);
	
    function minimizeWin(win){
        win.minimized = true;
        win.hide();
    }
    
    function markActive(win){
        if(activeWindow && activeWindow != win){
        	markInactive(activeWindow);
        }
        taskbar.setActiveButton(win.taskButton);
        activeWindow = win;
        Ext.fly(win.taskButton.el).addClass('active-win');
        win.minimized = false;
    }

    function markInactive(win){
        if(win == activeWindow){
        	activeWindow = null;
            Ext.fly(win.taskButton.el).removeClass('active-win');
        }
    }
    
    function removeWin(win){
    	taskbar.taskButtonPanel.remove(win.taskButton);
    	layout();
    }
        
    this.getWinWidth = function(){
		var width = Ext.lib.Dom.getViewWidth();
		return width < 200 ? 200 : width;
	}
		
	this.getWinHeight = function(){
		var height = (Ext.lib.Dom.getViewHeight()-taskbar.el.getHeight());
		return height < 100 ? 100 : height;
	}
		
	function getWinX(width){
		return (Ext.lib.Dom.getViewWidth() - width) / 2
	}
		
	function getWinY(height){
		return (Ext.lib.Dom.getViewHeight()-taskbar.el.getHeight() - height) / 2;
	}
	
	this.appendWindow = function(win){

        win.render(desktopEl);
        
        win.taskButton = taskbar.taskButtonPanel.add(win);
        
        win.cmenu = new Ext.menu.Menu({
            items: []
        });

        win.animateTarget = win.taskButton.el;
        
        win.on({
        	'activate': {
        		fn: markActive
        	},
        	'beforeshow': {
        		fn: markActive
        	},
        	'deactivate': {
        		fn: markInactive
        	},
        	'minimize': {
        		fn: minimizeWin
        	},
        	'close': {
        		fn: removeWin
        	}
        });
                
        layout();
        
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

    desktopEl.on('contextmenu', function(e){
    	if(e.target.id == desktopEl.id){
	    	e.stopEvent();
			if(!this.contextmenu.el){
				this.contextmenu.render();
			}
			var xy = e.getXY();
			xy[1] -= this.contextmenu.el.getHeight();
			this.contextmenu.showAt(xy);
		}
	}, this);
    
	layout();
} 

Ext.extend(Mixky.desktop.Framework, Mixky.desktop.IFramework, {
	init : function(){
	},
	getAnimateTarget : function(){
		return this.el;
	},
	// config for the start menu
    getStartConfig : function(){
		var showname = MixkyApp.USERNAME + '(' + MixkyApp.USERDEPT + ')';
        return {
        	iconCls: 'icon-sys-user',
            title: showname || 'Mixky Desktop',
            toolItems: [
            	Mixky.app.Actions.Preferences,
            	Mixky.app.Actions.ChangePassword,'-',
            	Mixky.app.Actions.Exit
            ]
        };
    },
    // extend method
    setMenus : function(menus){
    	for(var i=0;i<menus.length;i++){
    		//this.addMenuItem(this.taskbar.startMenu, menus[i]);
    		this.taskbar.startMenu.add({
    			text : menus[i].text,
    			iconCls : menus[i].iconCls,
    	        ignoreParentClicks:false,
    			handler : MixkyApp.handlerMenu,
    			menu : this.getChildMenu(menus[i])
    		});
    	}
    },
    // private method
    getChildMenu : function(menuCfg){
    	var menu;
    	if(Ext.isDefined(menuCfg.items)){
    		menu = new Ext.menu.Menu({ignoreParentClicks : false});
    		for(var i=0;i<menuCfg.items.length;i++){
    			menu.addMenuItem({
        			text : menuCfg.items[i].text,
        			name : menuCfg.items[i].name,
        			iconCls : menuCfg.items[i].iconCls,
        			handler : MixkyApp.handlerMenu,
        			menu : this.getChildMenu(menuCfg.items[i])
    			});
    		}
    	}
    	return menu;
    },
    // extend method
    setTheme : function(theme){
		Ext.util.CSS.swapStyleSheet('theme', theme);
    },
    // extend method
	setBackgroundColor : function(hex){
    	if(Ext.isIE){
    		Ext.get(document.body).setStyle('background-color', hex);
    	}else{
    		Ext.get(document.body).setStyle('background-color', '#' + hex);
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
	setTransparency : function(v){
		this.taskbar.el.addClass("transparent");
		Ext.util.CSS.updateRule('.transparent','opacity', v/100);
		Ext.util.CSS.updateRule('.transparent','-moz-opacity', v/100);
		Ext.util.CSS.updateRule('.transparent','filter', 'alpha(opacity='+v+')');
	},
    // extend method
	setWallpaper : function(path){
		var notifyWin = MixkyApp.showWaitMessage("正在装载墙纸...");
		var wp = new Image();
		wp.src = path;
		var task = new Ext.util.DelayedTask(verify, this);
		task.delay(200);

		function verify(){
			if(wp.complete){
				task.cancel();
				
				notifyWin.setIconClass('x-icon-done');
				notifyWin.setTitle('装载完成');
				notifyWin.setMessage('已完成墙纸装载.');
				MixkyApp.hideNotification(notifyWin);
				
				document.body.background = wp.src;
			}else{
				task.delay(200);
			}
		}
	},
    // extend method
	setWallpaperPosition : function(pos){
		if(pos === "center"){
			var b = Ext.get(document.body);
			b.removeClass('wallpaper-tile');
			b.addClass('wallpaper-center');
		}else if(pos === "tile"){
			var b = Ext.get(document.body);
			b.removeClass('wallpaper-center');
			b.addClass('wallpaper-tile');
		}
	},
    // extend method
	addShortcut : function(o){
		o.handler = function(b, e){
			MixkyApp.executeAction(this.btntype, this.key, e);
		}
		this.shortcuts.addShortcut(o);
	},
    // extend method
	removeShortcut : function(btntype, key){
		var btn = this.shortcuts.getButtonCmp(btntype, key);
		if(btn){
			this.shortcuts.removeShortcut(btn);
		}
	},
    // extend method
	addQuickStart : function(o){
		o.handler = function(b, e){
			MixkyApp.executeAction(this.btntype, this.key, e);
		}
		o.tooltip = o.text;
		this.taskbar.quickStartPanel.add(o);
	},
    // extend method
	removeQuickStart : function(btntype, key){
		var btn = this.taskbar.quickStartPanel.getButtonCmp(btntype, key);
		if(btn){
			this.taskbar.quickStartPanel.remove(btn);
		}
	},
    // extend method
	addSubject : function(o){
		var desktop = this;
		var div = this.el.createChild({tag:'div', style:'position:absolute',id: 'subject-div-' + o.key});
		var panel = new Ext.Panel({
			id : 'portlet-' + o.key,
			renderTo : div,
			width : o.width,
			height : o.height,
			title : o.text,
			floating : true,
			shadow : true,
			layout : 'fit',
			x : o.left,
			y : o.top,
			style : {'z-index' : 1000},
			iconCls : o.iconCls,
			tools : [{
				id : 'refresh',
				handler : function(){
					panel.doAutoLoad();
				},
				qtip : "重新装载栏目内容"
			}, {
				id : 'gear',
				handler : function(){
					desktop.beginResizeSubject(panel);
				},
				qtip : "编辑栏目位置"
			}],
			autoLoad : {
				url : "portlet.do",
				params : {key : o.key},
				scripts : true
			}
		});
		panel.key = o.key;
	},
    // extend method
	removeSubject : function(key){
		var panel = Ext.getCmp('portlet-' + key);
		if(panel){
			panel.destroy();
		}
		var div = Ext.get('subject-div-' + key);
		if(div){
			div.remove();
		}
	},
    // extend method
	showDesktop : function(){
		// 最小化所有窗口
		this.getManager().each(function(win){
	        win.minimized = true;
	        win.hide();
		});
	},
	getModule : function(modulekey){
		var win = this.getWindow('m-' + modulekey);
		if(Ext.isDefined(win)){
			return win.items.get(0);
		}
	},
	getCurrentModule : function(){
		var win = this.getManager().getActive();
		if(win){
			var module = win.items.get(0);
			if(module && Ext.isDefined(module.getCurrentView)){
				return module;
			}
		}
	},
	// extend method
	openModule : function(modulekey){
		var win = this.getWindow('m-' + modulekey);
		if(!win){
			var module = Mixky.app.Modules[modulekey];
			if(!module){
				return;
			}
			var panel = this.getModulePanel(modulekey);
			win = this.createWindow({
				id : 'm-' + module.key,
				title : module.title,
				iconCls : module.icon,
				layout : 'fit',
				border : false,
				padding : 2,
				width : this.getWinWidth() / 1.1,
				height : this.getWinHeight() / 1.1,
				items : panel
			});
		}
		win.show();
		return win.items.get(0);
	},
	getDocument : function(document, id){
		var win = this.getWindow('d-' + document.key + '-' + id);
		if(Ext.isDefined(win)){
			return win.items.get(0);
		}
	},
	// extend method
	_openDocument : function(document, id, params){
		var win = this.getWindow('d-' + document.key + '-' + id);
		if(!Ext.isDefined(win)){
			var panel = this.getDocumentPanel(document.key, id, params);
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
	// private method
	getResizer : function(){
		if(!this.resizerwrap){
			var desktop = this;
			var desktopEl = this.el;
		    var resizerEl = desktopEl.createChild({tag : 'div', style:'position:absolute;z-index : 15000'});
		    /*
		    var form = new Ext.form.FormPanel({
				border : false,
				labelWidth : 80,
				defaults : {xtype : 'textfield', width : 200},
				items : [{
					name : 'text',
					fieldLabel : '栏目标题'
				}, {
					name : 'iconCls',
					fieldLabel : '栏目图标'
				}, {
					xtype : 'checkbox',
					name : 'autoRefresh',
					fieldLabel : '定时刷新'
				}, {
					xtype : 'numberfield',
					name : 'refreshInterval',
					fieldLabel : '频率（分钟）',
					maxValue : 60,
					minValue : 5
				}],
				buttons : [{
					text : '确定',
					iconCls : 'icon-sys-confirm',
					handler : function(){
						var o = {
							text : form.getForm().findField('text').getValue(),
							iconCls : form.getForm().findField('iconCls').getValue(),
							autoRefresh : form.getForm().findField('autoRefresh').getValue(),
							refreshInterval : form.getForm().findField('refreshInterval').getValue()
						}
						desktop.stopResizeSubject(o);
					}
				}, {
					text : '取消',
					iconCls : 'icon-sys-cancel',
						handler : function(){
						desktop.stopResizeSubject();
					}
				}]
			});
		    */
			var resizerwrap = new Ext.Panel({
				renderTo:resizerEl,
				floating : true,
				hidden : true,
				dynamic : true,
				border : false,
				autoLoad : false,
				layout : 'fit',
				//items : form,
				tbar : ['->', {
					text : '完成',
					iconCls : 'icon-sys-cancel',
						handler : function(){
						desktop.stopResizeSubject();
					}
				}],
				draggable: {
			        insertProxy: false,
			        onDrag : function(e){
			            var pel = this.proxy.getEl();
			            this.x = pel.getLeft(true);
			            this.y = pel.getTop(true);
	
			            var s = this.panel.getEl().shadow;
			            if (s) {
			                s.realign(this.x, this.y, pel.getWidth(), pel.getHeight());
			            }
			        },
			        endDrag : function(e){
			        	this.panel.setPosition(this.x, this.y);
			            if(this.panel.targetPanel){
			            	this.panel.targetPanel.setPosition(this.x, this.y);
			    			var subject = MixkyApp.getSubject(this.panel.targetPanel.key);
			    			subject.left  = this.x;
			    			subject.top  = this.y;
			            }
			        }
			    },
			    /*
				setSubjectConfig : function(o){
					form.getForm().findField('text').setValue(o.text);
					form.getForm().findField('iconCls').setValue(o.iconCls);
					form.getForm().findField('autoRefresh').setValue(o.autoRefresh);
					form.getForm().findField('refreshInterval').setValue(o.refreshInterval);
				},
				*/
			    listeners:{
		            'resize':function(p){
						if(p.targetPanel){
			            	p.targetPanel.setSize(p.getSize());
			            	p.targetPanel.setPosition(p.getPosition(true));
			    			var subject = MixkyApp.getSubject(p.targetPanel.key);
			    			subject.width  = p.getSize().width;
			    			subject.height  = p.getSize().height;
						}
		            }
				}
			});
			resizerwrap.dragPanel = new Ext.Resizable(resizerwrap.getId(),{
				handles: 'all',
				pinned :true,
			    minWidth: 50,
			    minHeight: 50,
				resizeRegion : desktopEl.getRegion(),
				listeners:{
					'resize':function(s, w, h){
						resizerwrap.setSize(w, h);
					}
				}
			});
			this.resizerwrap = resizerwrap;
		}
		return this.resizerwrap;
	},
	// private method
	stopResizeSubject : function(o){
		var resizer = this.getResizer();
		
		if(o && resizer.targetPanel && resizer.targetPanel.isVisible()){
			var subject = MixkyApp.getSubject(resizer.targetPanel.key);
			if(subject){
				Ext.apply(subject, o);
			}
		}
		
		resizer.targetPanel = false;
		resizer.hide();
	},
	// private method
	beginResizeSubject : function(panel){
		var resizer = this.getResizer();
		resizer.dragPanel.resizeTo(panel.getSize().width, panel.getSize().height);
		resizer.setPosition(panel.getPosition());
		resizer.targetPanel = panel;
		resizer.show();
		resizer.setSize(panel.getSize().width, panel.getSize().height);
		var subject = MixkyApp.getSubject(panel.key);
		//resizer.setSubjectConfig(subject);
	}
});