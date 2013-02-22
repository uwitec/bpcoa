
//=================================================================
//	�ļ�����desktop.framework.js
//=================================================================
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
//=================================================================
//	�ļ�����desktop.shortcuts.js
//=================================================================
/*
* qWikiOffice Desktop 0.8.1
* Copyright(c) 2007-2008, Integrated Technologies, Inc.
* licensing@qwikioffice.com
* 
* http://www.qwikioffice.com/license
*/

Mixky.desktop.Shortcuts = function(config) {
  var desktopEl = Ext.get(config.renderTo)
		, taskbarEl = config.taskbarEl
		, btnHeight = 74
		, btnWidth = 64
		, btnPadding = 15
		, col = null
		, row = null
		, items = [];

  initColRow();
  
  this.menu = new Ext.menu.Menu({
	  items : [{
		  iconCls : 'icon-sys-open',
		  text : '打开',
		  handler : function(b){
		  	b.parentMenu.button.handler();
		  }
	  },'-', {
		  iconCls : 'icon-sys-remove',
		  text : '移除',
		  scope : this,
		  handler : function(b){
		  	MixkyApp.removeShortcut(b.parentMenu.button.btntype, b.parentMenu.button.key);
		  }
	  }]
  });

  function initColRow() {
    col = { index: 1, x: btnPadding };
    row = { index: 1, y: btnPadding };
  }

  function isOverflow(y) {
    if (y > (Ext.lib.Dom.getViewHeight() - taskbarEl.getHeight())) {
      return true;
    }
    return false;
  }

  this.addShortcut = function(config) {
    var div = desktopEl.createChild({ tag: 'div', cls: 'ux-shortcut-item' }),
			btn = new Mixky.desktop.ShortcutButton(Ext.apply(config, {
			  text: Ext.util.Format.ellipsis(config.text, 25)
			}), div),
			menu = this.menu;
    // 系统图标
    
    // 右键菜单
    div.addListener('contextmenu', function(e){
    	menu.button = btn;
    	menu.showAt(e.getXY());
    });

    //btn.container.initDD('DesktopShortcuts');

    items.push(btn);
    this.setXY(btn.container);

    return btn;
  };
  // add by zhangchang begin
  this.getButtonCmp = function(btntype, key){
    for (var i = 0, len = items.length; i < len; i++) {
      if(items[i].btntype == btntype && items[i].key == key){
    	  return items[i];
      }
    }
  }
  // add by zhangchang end

  this.removeShortcut = function(b) {
    var d = document.getElementById(b.container.id);

    b.destroy();
    d.parentNode.removeChild(d);

    var s = [];
    for (var i = 0, len = items.length; i < len; i++) {
      if (items[i] != b) {
        s.push(items[i]);
      }
    }
    items = s;

    this.handleUpdate();
  }

  this.handleUpdate = function() {
    initColRow();
    for (var i = 0, len = items.length; i < len; i++) {
      this.setXY(items[i].container);
    }
  }

  this.setXY = function(item) {
    var bottom = row.y + btnHeight,
			overflow = isOverflow(row.y + btnHeight);

    if (overflow && bottom > (btnHeight + btnPadding)) {
      col = {
        index: col.index++
				, x: col.x + btnWidth + btnPadding
      };
      row = {
        index: 1
				, y: btnPadding
      };
    }

    item.setXY([
			col.x
			, row.y
		]);

    row.index++;
    row.y = row.y + btnHeight + btnPadding;
  };

  Ext.EventManager.onWindowResize(this.handleUpdate, this, { delay: 500 });
};


/**
* @class Mixky.desktop.ShortcutButton
* @extends Ext.Button
*/
Mixky.desktop.ShortcutButton = function(config, el) {

	Mixky.desktop.ShortcutButton.superclass.constructor.call(this, Ext.apply(config, {
		renderTo: el,
		template: new Ext.Template(
			'<div class="ux-shortcut-btn ' + config.iconCls + '">',
				'<div style="background-color:transparent;" class="ux-shortcut-btn-img icon-sys-0shortcut' + config.btntype + '48 ' + config.iconCls + '48"></div>',
				'<div class="ux-shortcut-btn-text">{0}</div>',
			'</div>'
		)
	}));
  
	// add by zhangchang begin
	this.btntype = config.btntype;
	this.key = config.key;
	// add by zhangchang end
};

Ext.extend(Mixky.desktop.ShortcutButton, Ext.Button, {

  buttonSelector: 'div:first',

  // private
  setButtonClass : function(){

  },
  setIconClass : function(cls){
      if(this.el){
          this.btnEl.replaceClass(this.iconCls, cls);
      }
      this.iconCls = cls;
      return this;
  },
  
  initButtonEl: function(btn, btnEl) {
    Mixky.desktop.ShortcutButton.superclass.initButtonEl.apply(this, arguments);

    btn.removeClass("x-btn");

    if (this.iconCls) {
      if (!this.cls) {
        btn.removeClass(this.text ? 'x-btn-text-icon' : 'x-btn-icon');
      }
    }
  },

  autoWidth: function() {
    // do nothing
  },

  /**
  * Sets this shortcut button's text
  * @param {String} text The button text
  */
  setText: function(text) {
    this.text = text;
    if (this.el) {
      this.el.child("div.ux-shortcut-btn-text").update(text);
    }
  }
});
//=================================================================
//	�ļ�����desktop.startmenu.js
//=================================================================
/*
* qWikiOffice Desktop 0.8.1
* Copyright(c) 2007-2008, Integrated Technologies, Inc.
* licensing@qwikioffice.com
* 
* http://www.qwikioffice.com/license
*/

/**
* @class Ext.ux.StartMenu
* @extends Ext.menu.Menu
* A start menu object.
* @constructor
* Creates a new StartMenu
* @param {Object} config Configuration options
*
* SAMPLE USAGE:
*
* this.startMenu = new Ext.ux.StartMenu({
*		iconCls: 'user',
*		height: 300,
*		shadow: true,
*		title: get_cookie('memberName'),
*		toolPanelWidth: 110,
*		width: 300
*	});
*
* this.startMenu.add({
*		text: 'Grid Window',
*		iconCls:'icon-grid',
*		handler : this.createWindow,
*		scope: this
*	});
*
* this.startMenu.addTool({
*		text:'Logout',
*		iconCls:'logout',
*		handler:function(){ window.location = "logout.php"; },
*		scope:this
*	});
*/

if (Ext.version.substr(0, 2) !== '3.') {
  Mixky.desktop.StartMenu = function(config) {
    Mixky.desktop.StartMenu.superclass.constructor.call(this, config);

    var tools = this.toolItems;
    this.toolItems = new Ext.util.MixedCollection();
    if (tools) {
      this.addTool.apply(this, tools);
    }
  };

  Ext.extend(Mixky.desktop.StartMenu, Ext.menu.Menu, {
    height : 300,
    toolPanelWidth : 100,
    width : 300,
    ignoreParentClicks : true,

    // private
    render: function() {
      if (this.el) {
        return;
      }

      var el = this.el = new Ext.Layer({
        cls: "x-menu ux-start-menu", // this might affect item click
        shadow: this.shadow,
        constrain: false,
        parentEl: this.parentEl || document.body,
        zindex: 15000
      });

      var header = el.createChild({
        tag: "div",
        cls: "x-window-header x-unselectable x-panel-icon " + this.iconCls
      });
      header.setStyle('padding', '3px 0 0 0');

      this.header = header;
      /* Don't create header text span tag.
      * Can be uncommented. */
      var headerText = header.createChild({
        tag: "span",
        cls: "x-window-header-text"
      });
      var tl = header.wrap({
        cls: "ux-start-menu-tl"
      });

      var tr = header.wrap({
        cls: "ux-start-menu-tr"
      });
      var tc = header.wrap({
        cls: "ux-start-menu-tc"
      });

      this.menuBWrap = el.createChild({
        tag: "div",
        cls: "ux-start-menu-body x-border-layout-ct ux-start-menu-body"
      });

      var ml = this.menuBWrap.wrap({
        cls: "ux-start-menu-ml"
      });

      var mc = this.menuBWrap.wrap({
        cls: "ux-start-menu-mc ux-start-menu-bwrap"
      });

      this.menuPanel = this.menuBWrap.createChild({
        tag: "div",
        cls: "x-panel x-border-panel ux-start-menu-apps-panel opaque"
      });

      this.toolsPanel = this.menuBWrap.createChild({
        tag: "div",
        cls: "x-panel x-border-panel ux-start-menu-tools-panel"
      });

      var bwrap = ml.wrap({ cls: "x-window-bwrap" });

      var bc = bwrap.createChild({
        tag: "div",
        cls: "ux-start-menu-bc"
      });

      var bl = bc.wrap({
        cls: "ux-start-menu-bl x-panel-nofooter"
      });

      var br = bc.wrap({
        cls: "ux-start-menu-br"
      });

      bc.setStyle({
        height: '0px',
        padding: '0 0 6px 0'
      });

      this.keyNav = new Ext.menu.MenuNav(this);

      if (this.plain) {
        el.addClass("x-menu-plain");
      }

      if (this.cls) {
        el.addClass(this.cls);
      }

      // generic focus element
      this.focusEl = el.createChild({
        tag: "a",
        cls: "x-menu-focus",
        href: "#",
        onclick: "return false;",
        tabIndex: "-1"
      });

      var ul = this.menuPanel.createChild({
        tag: "ul",
        cls: "x-menu-list"
      });

      var toolsUl = this.toolsPanel.createChild({
        tag: "ul",
        cls: "x-menu-list"
      });

      var ulListeners = {
        "click": {
          fn: this.onClick,
          scope: this
        },
        "mouseover": {
          fn: this.onMouseOver,
          scope: this
        },
        "mouseout": {
          fn: this.onMouseOut,
          scope: this
        }
      };

      ul.on(ulListeners);
      
      if(Ext.isDefined(this.items)){
	      this.items.each(function(item) {
	          var li = document.createElement("li");
	          li.className = "x-menu-list-item";
	          ul.dom.appendChild(li);
	          item.render(li, this);
	      }, this);
      }

      this.ul = ul;
      this.autoWidth();

      toolsUl.on(ulListeners);

      this.toolItems.each(
        function(item) {
          var li = document.createElement("li");
          li.className = "x-menu-list-item";
          toolsUl.dom.appendChild(li);
          item.render(li, this);
        }, this);

      this.toolsUl = toolsUl;
      this.autoWidth();

      this.menuBWrap.setStyle('position', 'relative');
      this.menuBWrap.setHeight(this.height);

      this.menuPanel.setStyle({
        padding: '2px',
        position: 'absolute',
        overflow: 'auto'
      });

      this.toolsPanel.setStyle({
        padding: '2px 4px 2px 2px',
        position: 'absolute',
        overflow: 'auto'
      });

      this.setTitle(this.title);
    }, // endOf render

    // private
    findTargetItem: function(e) {
      var t = e.getTarget(".x-menu-list-item", this.ul, true);
      if (t && t.menuItemId) {
        if (this.items.get(t.menuItemId)) {
          return this.items.get(t.menuItemId);
        } else {
          return this.toolItems.get(t.menuItemId);
        }
      }
    },

    /**
    * Displays this menu relative to another element
    * @param {Mixed} element The element to align to
    * @param {String} position (optional) The {@link Ext.Element#alignTo} anchor position to use in aligning to
    * the element (defaults to this.defaultAlign)
    * @param {Mixky.desktop.StartMenu} parentMenu (optional) This menu's parent menu, if applicable (defaults to undefined)
    */
    show: function(el, pos, parentMenu) {
      this.parentMenu = parentMenu;
      if (!this.el) {
        this.render();
      }

      this.fireEvent("beforeshow", this);
      this.showAt(this.el.getAlignToXY(el, pos || this.defaultAlign), parentMenu, false);

      var tPanelWidth = this.toolPanelWidth;
      var box = this.menuBWrap.getBox();
      this.menuPanel.setWidth(box.width - tPanelWidth);
      this.menuPanel.setHeight(box.height);

      this.toolsPanel.setWidth(tPanelWidth);
      this.toolsPanel.setX(box.x + box.width - tPanelWidth);
      this.toolsPanel.setHeight(box.height);
    },

    addTool: function() {
      var a = arguments, l = a.length, item;
      for (var i = 0; i < l; i++) {
        var el = a[i];
        if (el.render) { // some kind of Item
          item = this.addToolItem(el);
        } else if (typeof el == "string") { // string
          if (el == "separator" || el == "-") {
            item = this.addToolSeparator();
          } else {
            item = this.addText(el);
          }
        } else if (el.tagName || el.el) { // element
          item = this.addElement(el);
        } else if (typeof el == "object") { // must be menu item config?
          item = this.addToolMenuItem(el);
        }
      }
      return item;
    },

    /**
    * Adds a separator bar to the Tools
    * @return {Ext.menu.Item} The menu item that was added
    */
    addToolSeparator: function() {
      return this.addToolItem(new Ext.menu.Separator({ itemCls: 'ux-toolmenu-sep' }));
    },

    addToolItem: function(item) {
      this.toolItems.add(item);
      if (this.toolsUl) {
        var li = document.createElement("li");
        li.className = "x-menu-list-item";
        this.toolsUl.dom.appendChild(li);
        item.render(li, this);
        this.delayAutoWidth();
      }
      return item;
    },

    addToolMenuItem: function(config) {
      if (!(config instanceof Ext.menu.Item)) {
        if (typeof config.checked == "boolean") { // must be check menu item config?
          config = new Ext.menu.CheckItem(config);
        } else {
          config = new Ext.menu.Item(config);
          //config = new Ext.menu.Adapter(this.getToolButton(config), {canActivate:true});
        }
      }
      return this.addToolItem(config);
    },

    setTitle: function(title, iconCls) {
      this.title = title;
      if (this.header.child('span')) {
        this.header.child('span').update(title);
      }
      return this;
    },

    getToolButton: function(config) {
      var btn = new Ext.Button({
        handler: config.handler,
        //iconCls: config.iconCls,
        minWidth: this.toolPanelWidth - 10,
        scope: config.scope,
        text: config.text
      });

      return btn;
    }
  });

} else {
  Mixky.desktop.StartMenu = Ext.extend(Ext.menu.Menu, {
    height: 300,
    toolPanelWidth: 100,
    width: 300,
    ignoreParentClicks : true,

    initComponent: function(config) {
  	  Mixky.desktop.StartMenu.superclass.initComponent.call(this, config);

      var tools = this.toolItems;
      this.toolItems = new Ext.util.MixedCollection();
      if(tools){
          this.addTool.apply(this, tools);
      }
    },

    onRender: function(ct, position) {
      Mixky.desktop.StartMenu.superclass.onRender.call(this, ct, position);

      var el = this.el.addClass('ux-start-menu');

      var header = el.createChild({
    	  tag: "div",
    	  cls: "x-window-header x-unselectable x-panel-icon " + this.iconCls
      });

		  this.header = header;

		  var headerText = header.createChild({
			  tag: "span",
			  cls: "x-window-header-text"
		  });
		  var tl = header.wrap({
			  cls: "ux-start-menu-tl"
		  });
		  var tr = header.wrap({
			  cls: "ux-start-menu-tr"
		  });
		  var tc = header.wrap({
			  cls: "ux-start-menu-tc"
		  });

		  this.menuBWrap = el.createChild({
			  tag: "div",
			  cls: "x-window-body x-border-layout-ct ux-start-menu-body"
		  });
		  var ml = this.menuBWrap.wrap({
			  cls: "ux-start-menu-ml"
		  });
		  var mc = this.menuBWrap.wrap({
			  cls: "x-window-mc ux-start-menu-bwrap"
		  });

		  this.menuPanel = this.menuBWrap.createChild({
			  tag: "div",
			  cls: "x-panel x-border-panel ux-start-menu-apps-panel"
		  });
		  this.toolsPanel = this.menuBWrap.createChild({
			  tag: "div",
			  cls: "x-panel x-border-panel ux-start-menu-tools-panel"
		  });

		  var bwrap = ml.wrap({cls: "x-window-bwrap"});
		  var bc = bwrap.createChild({
			  tag: "div",
			  cls: "ux-start-menu-bc"
		  });
		  var bl = bc.wrap({
			  cls: "ux-start-menu-bl x-panel-nofooter"
		  });
		  var br = bc.wrap({
			  cls: "ux-start-menu-br"
		  });

      this.ul.appendTo(this.menuPanel);

      var toolsUl = this.toolsPanel.createChild({
    	  tag: "ul",
    	  cls: "x-menu-list"
      });

      this.mon(toolsUl, 'click', this.onClick, this);
      this.mon(toolsUl, 'mouseover', this.onMouseOver, this);
      this.mon(toolsUl, 'mouseout', this.onMouseOut, this);

      if(Ext.isDefined(this.items)){
	      this.items.each(function(item){
	          item.parentMenu = this;
	      }, this);
      }

      this.toolItems.each(
    	  function(item){
            var li = document.createElement("li");
            li.className = "x-menu-list-item";
            toolsUl.dom.appendChild(li);
            item.render(li);
              item.parentMenu = this;
        }, this);

      this.toolsUl = toolsUl;

      this.menuBWrap.setStyle('position', 'relative');
      this.menuBWrap.setHeight(this.height - 28);

      this.menuPanel.setStyle({
    	  padding: '2px',
    	  position: 'absolute',
    	  overflow: 'auto'
      });

      this.toolsPanel.setStyle({
    	  padding: '2px 4px 2px 2px',
    	  position: 'absolute',
    	  overflow: 'auto'
      });

      this.setTitle(this.title);
    },
    
    // private
    findTargetItem: function(e) {
      var t = e.getTarget(".x-menu-list-item", this.ul, true);
      if (t && t.menuItemId) {
        if (this.items.get(t.menuItemId)) {
          return this.items.get(t.menuItemId);
        } else {
          return this.toolItems.get(t.menuItemId);
        }
      }
    },

    /**
    * Displays this menu relative to another element
    * @param {Mixed} element The element to align to
    * @param {String} position (optional) The {@link Ext.Element#alignTo} anchor position to use in aligning to
    * the element (defaults to this.defaultAlign)
    * @param {Mixky.desktop.StartMenu} parentMenu (optional) This menu's parent menu, if applicable (defaults to undefined)
    */
    show: function(el, pos, parentMenu) {
      this.parentMenu = parentMenu;
      if (!this.el) {
        this.render();
      }

      this.fireEvent("beforeshow", this);
      this.showAt(this.el.getAlignToXY(el, pos || this.defaultAlign), parentMenu, false);

      var tPanelWidth = this.toolPanelWidth;
      var box = this.menuBWrap.getBox();
      this.menuPanel.setWidth(box.width - tPanelWidth);
      this.menuPanel.setHeight(box.height);

      this.toolsPanel.setWidth(tPanelWidth);
      this.toolsPanel.setX(box.x + box.width - tPanelWidth);
      this.toolsPanel.setHeight(box.height);
    },

    addTool: function() {
      var a = arguments, l = a.length, item;
      for (var i = 0; i < l; i++) {
        var el = a[i];
        if (el.render) { // some kind of Item
          item = this.addToolItem(el);
        } else if (typeof el == "string") { // string
          if (el == "separator" || el == "-") {
            item = this.addToolSeparator();
          } else {
            item = this.addText(el);
          }
        } else if (el.tagName || el.el) { // element
          item = this.addElement(el);
        } else if (typeof el == "object") { // must be menu item config?
          item = this.addToolMenuItem(el);
        }
      }
      return item;
    },

    /**
    * Adds a separator bar to the Tools
    * @return {Ext.menu.Item} The menu item that was added
    */
    addToolSeparator: function() {
      return this.addToolItem(new Ext.menu.Separator({ itemCls: 'ux-toolmenu-sep' }));
    },

    addToolItem: function(item) {
      this.toolItems.add(item);
      if (this.toolsUl) {
        var li = document.createElement("li");
        li.className = "x-menu-list-item";
        this.toolsUl.dom.appendChild(li);
        item.render(li, this);
        this.delayAutoWidth();
      }
      return item;
    },

    addToolMenuItem: function(config) {
      if (!(config instanceof Ext.menu.Item)) {
        if (typeof config.checked == "boolean") { // must be check menu item config?
          config = new Ext.menu.CheckItem(config);
        } else {
          config = new Ext.menu.Item(config);
          //config = new Ext.menu.Adapter(this.getToolButton(config), {canActivate:true});
        }
      }
      return this.addToolItem(config);
    },

    setTitle: function(title, iconCls) {
      this.title = title;
      if (this.header.child('span')) {
        this.header.child('span').update(title);
      }
      return this;
    },

    getToolButton: function(config) {
      var btn = new Ext.Button({
        handler: config.handler,
        //iconCls: config.iconCls,
        minWidth: this.toolPanelWidth - 10,
        scope: config.scope,
        text: config.text
      });

      return btn;
    }
  });
}
//=================================================================
//	�ļ�����desktop.taskbar.js
//=================================================================
/*
* qWikiOffice Desktop 0.8.1
* Copyright(c) 2007-2008, Integrated Technologies, Inc.
* licensing@qwikioffice.com
*
* http://www.qwikioffice.com/license
*/

/**
* @class Mixky.desktop.TaskBar
* @extends Ext.util.Observable
*/
Mixky.desktop.TaskBar = function(desktop) {
  this.desktop = desktop;
  this.init();
}

Ext.extend(Mixky.desktop.TaskBar, Ext.util.Observable, {
  init: function() {
    this.startMenu = new Mixky.desktop.StartMenu(Ext.apply({
      iconCls: 'icon-sys-user',
      title: '创想天空办公系统', //get_cookie('memberName'),
      height: 300,
      width: 250,
      shadow: true
    }, this.desktop.getStartConfig()));

    if (Ext.version.substr(0, 2) !== '3.') {
      this.startButton = new Ext.Button({
        text: '开始',
        id: 'ux-startbutton',
        iconCls: 'start',
        menu: this.startMenu,
        menuAlign: 'bl-tl',
        renderTo: 'ux-taskbar-start'
      });
    } else {
      this.startButton = new Ext.Button({
        text: '开始',
        id: 'ux-startbutton',
        iconCls: 'start',
        menu: this.startMenu,
        menuAlign: 'bl-tl',
        renderTo: 'ux-taskbar-start',
        clickEvent: 'mousedown',
        template: new Ext.Template(
          '<table border="0" cellpadding="0" cellspacing="0" class="x-btn-wrap x-btn {3}"><tbody><tr>',
          '<td class="x-btn-left"><i>&#160;</i></td>',
              '<td class="x-btn-center"><em class="{5}" unselectable="on">',
                  '<button class="x-btn-text {2}" type="{1}" style="height:30px;">{0}</button>',
              '</em></td>',
              '<td class="x-btn-right"><i>&#160;</i></td>',
          '</tr></tbody></table>')
      });      
    }
    
    var width = this.startButton.getEl().getWidth()+10;

    var sbBox = new Ext.BoxComponent({
      el: 'ux-taskbar-start',
      id: 'TaskBarStart',
      minWidth: width,
      region: 'west',
      split: false,
      width: width
    });

    this.quickStartPanel = new Mixky.desktop.QuickStartPanel({
      el: 'ux-quickstart-panel',
      id: 'TaskBarQuickStart',
      minWidth: 60,
      region: 'west',
      split: true,
      width: 94
    });

    this.taskButtonPanel = new Mixky.desktop.TaskButtonsPanel({
      el: 'ux-taskbuttons-panel',
      id: 'TaskBarButtons',
      region: 'center'
    });

    var panelWrap = new Ext.Container({
      el: 'ux-taskbar-panel-wrap',
      items: [this.quickStartPanel, this.taskButtonPanel],
      layout: 'border',
      region: 'center'
    });

    var container = new Mixky.desktop.TaskBarContainer({
      el: 'ux-taskbar',
      layout: 'border',
      items: [sbBox, panelWrap]
    });
    this.el = container.el;

    return this;
  },
  setActiveButton: function(btn) {
	this.taskButtonPanel.setActiveButton(btn);
  }
});



/**
* @class Mixky.desktop.TaskBarContainer
* @extends Ext.Container
*/
Mixky.desktop.TaskBarContainer = Ext.extend(Ext.Container, {
  initComponent: function() {
    Mixky.desktop.TaskBarContainer.superclass.initComponent.call(this);

    this.el = Ext.get(this.el) || Ext.getBody();
    this.el.setHeight = Ext.emptyFn;
    this.el.setWidth = Ext.emptyFn;
    this.el.setSize = Ext.emptyFn;
    this.el.setStyle({
      overflow: 'hidden',
      margin: '0',
      border: '0 none'
    });
    this.el.dom.scroll = 'no';
    this.allowDomMove = false;
    this.autoWidth = true;
    this.autoHeight = true;
    Ext.EventManager.onWindowResize(this.fireResize, this);
    this.renderTo = this.el;
  },

  fireResize: function(w, h) {
    this.fireEvent('resize', this, w, h, w, h);
  }
});



/**
* @class Mixky.desktop.TaskButtonsPanel
* @extends Ext.BoxComponent
*/
Mixky.desktop.TaskButtonsPanel = Ext.extend(Ext.BoxComponent, {
  activeButton: null,
  enableScroll: true,
  scrollIncrement: 0,
  scrollRepeatInterval: 400,
  scrollDuration: .35,
  animScroll: true,
  resizeButtons: true,
  buttonWidth: 168,
  minButtonWidth: 118,
  buttonMargin: 2,
  buttonWidthSet: false,

  initComponent: function() {
    Mixky.desktop.TaskButtonsPanel.superclass.initComponent.call(this);
    this.on('resize', this.delegateUpdates);
    this.items = [];

    this.stripWrap = Ext.get(this.el).createChild({
      cls: 'ux-taskbuttons-strip-wrap',
      cn: {
        tag: 'ul', cls: 'ux-taskbuttons-strip'
      }
    });
    this.stripSpacer = Ext.get(this.el).createChild({
      cls: 'ux-taskbuttons-strip-spacer'
    });
    
    this.strip = new Ext.Element(this.stripWrap.dom.firstChild);

    this.edge = this.strip.createChild({
      tag: 'li',
      cls: 'ux-taskbuttons-edge'
    });
    
    this.strip.createChild({
      cls: 'x-clear'
    });
  },

  // old addButton
  add: function(win) {
    var li = this.strip.createChild({ tag: 'li' }, this.edge); // insert before the edge
    var btn = new Mixky.desktop.TaskBar.TaskButton(win, li);

    this.items.push(btn);

    if (!this.buttonWidthSet) {
      this.lastButtonWidth = btn.container.getWidth();
    }

    this.setActiveButton(btn);
    return btn;
  },

  // old removeButton
  remove: function(btn) {
    var li = document.getElementById(btn.container.id);
    btn.destroy();
    li.parentNode.removeChild(li);

    var s = [];
    for (var i = 0, len = this.items.length; i < len; i++) {
      if (this.items[i] != btn) {
        s.push(this.items[i]);
      }
    }
    this.items = s;

    this.delegateUpdates();
  },

  setActiveButton: function(btn) {
    this.activeButton = btn;
    this.delegateUpdates();
  },

  delegateUpdates: function() {
    /*if(this.suspendUpdates){
    return;
    }*/
    if (this.resizeButtons && this.rendered) {
      this.autoSize();
    }
    if (this.enableScroll && this.rendered) {
      this.autoScroll();
    }
  },

  autoSize: function() {
    var count = this.items.length;
    var ow = this.el.dom.offsetWidth;
    var aw = this.el.dom.clientWidth;

    if (!this.resizeButtons || count < 1 || !aw) { // !aw for display:none
      return;
    }

    var each = Math.max(Math.min(Math.floor((aw - 4) / count) - this.buttonMargin, this.buttonWidth), this.minButtonWidth); // -4 for float errors in IE
    var btns = this.stripWrap.dom.getElementsByTagName('button');

    this.lastButtonWidth = Ext.get(btns[0].id).findParent('li').offsetWidth;

    for (var i = 0, len = btns.length; i < len; i++) {
      var btn = btns[i];

      var tw = Ext.get(btns[i].id).findParent('li').offsetWidth;
      var iw = btn.offsetWidth;

      btn.style.width = (each - (tw - iw)) + 'px';
    }
  },

  autoScroll: function() {
    var count = this.items.length;
    var ow = this.el.dom.offsetWidth;
    var tw = this.el.dom.clientWidth;

    var wrap = this.stripWrap;
    var cw = wrap.dom.offsetWidth;
    var pos = this.getScrollPos();
    var l = this.edge.getOffsetsTo(this.stripWrap)[0] + pos;

    if (!this.enableScroll || count < 1 || cw < 20) { // 20 to prevent display:none issues
      return;
    }

    wrap.setWidth(tw); // moved to here because of problem in Safari

    if (l <= tw) {
      wrap.dom.scrollLeft = 0;
      //wrap.setWidth(tw); moved from here because of problem in Safari
      if (this.scrolling) {
        this.scrolling = false;
        this.el.removeClass('x-taskbuttons-scrolling');
        this.scrollLeft.hide();
        this.scrollRight.hide();
      }
    } else {
      if (!this.scrolling) {
        this.el.addClass('x-taskbuttons-scrolling');
      }
      tw -= wrap.getMargins('lr');
      wrap.setWidth(tw > 20 ? tw : 20);
      if (!this.scrolling) {
        if (!this.scrollLeft) {
          this.createScrollers();
        } else {
          this.scrollLeft.show();
          this.scrollRight.show();
        }
      }
      this.scrolling = true;
      if (pos > (l - tw)) { // ensure it stays within bounds
        wrap.dom.scrollLeft = l - tw;
      } else { // otherwise, make sure the active button is still visible
        this.scrollToButton(this.activeButton, true); // true to animate
      }
      this.updateScrollButtons();
    }
  },

  createScrollers: function() {
    var h = this.el.dom.offsetHeight; //var h = this.stripWrap.dom.offsetHeight;

    // left
    var sl = this.el.insertFirst({
      cls: 'ux-taskbuttons-scroller-left'
    });
    sl.setHeight(h);
    sl.addClassOnOver('ux-taskbuttons-scroller-left-over');
    this.leftRepeater = new Ext.util.ClickRepeater(sl, {
      interval: this.scrollRepeatInterval,
      handler: this.onScrollLeft,
      scope: this
    });
    this.scrollLeft = sl;

    // right
    var sr = this.el.insertFirst({
      cls: 'ux-taskbuttons-scroller-right'
    });
    sr.setHeight(h);
    sr.addClassOnOver('ux-taskbuttons-scroller-right-over');
    this.rightRepeater = new Ext.util.ClickRepeater(sr, {
      interval: this.scrollRepeatInterval,
      handler: this.onScrollRight,
      scope: this
    });
    this.scrollRight = sr;
  },

  getScrollWidth: function() {
    return this.edge.getOffsetsTo(this.stripWrap)[0] + this.getScrollPos();
  },

  getScrollPos: function() {
    return parseInt(this.stripWrap.dom.scrollLeft, 10) || 0;
  },

  getScrollArea: function() {
    return parseInt(this.stripWrap.dom.clientWidth, 10) || 0;
  },

  getScrollAnim: function() {
    return {
      duration: this.scrollDuration,
      callback: this.updateScrollButtons,
      scope: this
    };
  },

  getScrollIncrement: function() {
    return (this.scrollIncrement || this.lastButtonWidth + 2);
  },

  /* getBtnEl : function(item){
  return document.getElementById(item.id);
  }, */

  scrollToButton: function(item, animate) {
    item = item.el.dom.parentNode; // li
    if (!item) { return; }
    var el = item; //this.getBtnEl(item);
    var pos = this.getScrollPos(), area = this.getScrollArea();
    var left = Ext.fly(el).getOffsetsTo(this.stripWrap)[0] + pos;
    var right = left + el.offsetWidth;
    if (left < pos) {
      this.scrollTo(left, animate);
    } else if (right > (pos + area)) {
      this.scrollTo(right - area, animate);
    }
  },

  scrollTo: function(pos, animate) {
    this.stripWrap.scrollTo('left', pos, animate ? this.getScrollAnim() : false);
    if (!animate) {
      this.updateScrollButtons();
    }
  },

  onScrollRight: function() {
    var sw = this.getScrollWidth() - this.getScrollArea();
    var pos = this.getScrollPos();
    var s = Math.min(sw, pos + this.getScrollIncrement());
    if (s != pos) {
      this.scrollTo(s, this.animScroll);
    }
  },

  onScrollLeft: function() {
    var pos = this.getScrollPos();
    var s = Math.max(0, pos - this.getScrollIncrement());
    if (s != pos) {
      this.scrollTo(s, this.animScroll);
    }
  },

  updateScrollButtons: function() {
    var pos = this.getScrollPos();
    this.scrollLeft[pos == 0 ? 'addClass' : 'removeClass']('ux-taskbuttons-scroller-left-disabled');
    this.scrollRight[pos >= (this.getScrollWidth() - this.getScrollArea()) ? 'addClass' : 'removeClass']('ux-taskbuttons-scroller-right-disabled');
  }
});



/**
* @class Mixky.desktop.TaskBar.TaskButton
* @extends Ext.Button
*/
if (Ext.version.substr(0, 2) !== '3.') {
  Mixky.desktop.TaskBar.TaskButton = function(win, el) {
    this.win = win;
    Mixky.desktop.TaskBar.TaskButton.superclass.constructor.call(this, {
      iconCls: win.iconCls,
      text: Ext.util.Format.ellipsis(win.title, 12),
      tooltip: win.taskbuttonTooltip || win.title,
      renderTo: el,
      handler: function() {
        if (win.minimized || win.hidden) {
          win.show();
        } else if (win == win.manager.getActive()) {
          win.minimize();
        } else {
          win.toFront();
        }
      },
      clickEvent: 'mousedown'
    });
  };
} else {
  Mixky.desktop.TaskBar.TaskButton = function(win, el) {
    this.win = win;
    Mixky.desktop.TaskBar.TaskButton.superclass.constructor.call(this, {
      iconCls: win.iconCls,
      text: Ext.util.Format.ellipsis(win.title, 12),
      tooltip: win.taskbuttonTooltip || win.title,
      renderTo: el,
      handler: function() {
        if (win.minimized || win.hidden) {
          win.show();
        } else if (win == win.manager.getActive()) {
          win.minimize();
        } else {
          win.toFront();
        }
      },
      clickEvent: 'mousedown',
      template: new Ext.Template(
        '<table cellspacing="0" class="x-btn {3}"><tbody><tr>',
        '<td class="x-btn-left"><i>&#160;</i></td>',
        '<td class="x-btn-center"><em class="{5}" unselectable="on">',
            '<button class="x-btn-text {2}" type="{1}" style="height:28px;">{0}</button>',
        '</em></td>',
        '<td class="x-btn-right"><i>&#160;</i></td>',
        '</tr></tbody></table>')
    });
  };
}

Ext.extend(Mixky.desktop.TaskBar.TaskButton, Ext.Button, {
  onRender: function() {
    Mixky.desktop.TaskBar.TaskButton.superclass.onRender.apply(this, arguments);

    this.cmenu = new Ext.menu.Menu({
      items: [{
        id: Ext.version.substr(0, 2) !== '3.' ? 'restore' : undefined,
        text: '还原',
        handler: function() {
          if (!this.win.isVisible()) {
            this.win.show();
          } else {
            this.win.restore();
          }
        },
        scope: this
      }, {
        id: Ext.version.substr(0, 2) !== '3.' ? 'minimize' : undefined,
        text: '最小化',
        handler: this.win.minimize,
        scope: this.win
      }, {
        id: Ext.version.substr(0, 2) !== '3.' ? 'maximize' : undefined,
        text: '最大化',
        handler: this.win.maximize,
        scope: this.win
      }, '-', {
        id: Ext.version.substr(0, 2) !== '3.' ? 'close' : undefined,
        text: '关闭',
        handler: this.closeWin.createDelegate(this, this.win, true),
        scope: this.win
      }]
    });

    this.cmenu.on('beforeshow', function() {
      var items = this.cmenu.items.items;
      var w = this.win;
      items[0].setDisabled(w.maximized !== true && w.hidden !== true);
      items[1].setDisabled(w.minimized === true);
      items[2].setDisabled(w.maximized === true || w.hidden === true);
      items[2].setDisabled(w.maximizable === false);
      items[3].setDisabled(w.closable === false);
    }, this);

    this.el.on('contextmenu', function(e) {
      e.stopEvent();
      if (!this.cmenu.el) {
        this.cmenu.render();
      }
      var xy = e.getXY();
      xy[1] -= this.cmenu.el.getHeight();
      this.cmenu.showAt(xy);
    }, this);
  },

  closeWin: function(cMenu, e, win) {
    if (!win.isVisible()) {
      win.show();
    } else {
      win.restore();
    }
    win.close();
  },

  /**
  * override so autoWidth() is not called
  * @param {String} text The text for the button
  */
  setText: function(text) {
    if (text) {
      this.text = text;
      if (this.el) {
        this.el.child("td.x-btn-center " + this.buttonSelector).update(Ext.util.Format.ellipsis(text, 12));
      }
    }
  },

  /**
  * @param {String/Object} tooltip The tooltip for the button - can be a string or QuickTips config object
  */
  setTooltip: function(text) {
    if (text) {
      this.tooltip = text;
      var btnEl = this.el.child(this.buttonSelector);
      Ext.QuickTips.unregister(btnEl.id);

      if (typeof this.tooltip == 'object') {
        Ext.QuickTips.register(Ext.apply({
          target: btnEl.id
        }, this.tooltip));
      } else {
        btnEl.dom[this.tooltipType] = this.tooltip;
      }
    }
  }
});


/**
* @class Mixky.desktop.QuickStartPanel
* @extends Ext.BoxComponent
*/
Mixky.desktop.QuickStartPanel = Ext.extend(Ext.BoxComponent, {
  enableMenu: true,

  initComponent: function() {
    Mixky.desktop.QuickStartPanel.superclass.initComponent.call(this);

    this.on('resize', this.delegateUpdates);

    this.menu = new Ext.menu.Menu();

    this.items = [];

    this.stripWrap = Ext.get(this.el).createChild({
      cls: 'ux-quickstart-strip-wrap',
      cn: { tag: 'ul', cls: 'ux-quickstart-strip' }
    });

    this.stripSpacer = Ext.get(this.el).createChild({
      cls: 'ux-quickstart-strip-spacer'
    });

    this.strip = new Ext.Element(this.stripWrap.dom.firstChild);

    this.edge = this.strip.createChild({
      tag: 'li',
      cls: 'ux-quickstart-edge'
    });

    this.strip.createChild({
      cls: 'x-clear'
    });
    
  },

  // add by zhangchang begin
  getButtonCmp : function(btntype, key){
      for (var i = 0, len = this.items.length; i < len; i++) {
          if(this.items[i].btntype == btntype && this.items[i].key == key){
        	  return this.items[i];
          }
      }
  },
  // add by zhangchang end

  add: function(config) {
    var li = this.strip.createChild({ tag: 'li' }, this.edge); // insert before the edge

    var btn;
    if (Ext.version.substr(0, 2) !== '3.') {
      btn = new Ext.Button(Ext.apply(config, {
        cls: 'x-btn-icon',
        menuText: config.text,
        renderTo: li,
        text: '' // do not display text
      }));
    } else {
      btn = new Ext.Button(Ext.apply(config, {
        cls: 'x-btn-icon',
        menuText: config.text,
        renderTo: li,
        text: '', // do not display text
        template: new Ext.Template(
          '<table cellspacing="0" class="x-btn {3}"><tbody><tr>',
          '<td class="x-btn-left"><i>&#160;</i></td>',
          '<td class="x-btn-center"><em class="{5}" unselectable="on">',
              '<button class="x-btn-text {2}" type="{1}">{0}</button>',
          '</em></td>',
          '<td class="x-btn-right"><i>&#160;</i></td>',
          '</tr></tbody></table>')
      }));
    }
    
    // add by zhangchang begin
    btn.btntype = config.btntype;
    btn.key = config.key;
    // add by zhangchang end
    
    this.items.push(btn);

    this.delegateUpdates();

    return btn;
  },

  remove: function(btn) {
    var li = document.getElementById(btn.container.id);
    btn.destroy();
    li.parentNode.removeChild(li);

    var s = [];
    for (var i = 0, len = this.items.length; i < len; i++) {
      if (this.items[i] != btn) {
        s.push(this.items[i]);
      }
    }
    this.items = s;

    this.delegateUpdates();
  },

  menuAdd: function(config) {
    this.menu.add(config);
  },

  delegateUpdates: function() {
    if (this.enableMenu && this.rendered) {
      this.showButtons();
      this.clearMenu();
      this.autoMenu();
    }
  },

  showButtons: function() {
    var count = this.items.length;

    for (var i = 0; i < count; i++) {
      this.items[i].show();
    }
  },

  clearMenu: function() {
    this.menu.removeAll();
  },

  autoMenu: function() {
    var count = this.items.length;
    var ow = this.el.dom.offsetWidth;
    var tw = this.el.dom.clientWidth;

    var wrap = this.stripWrap;
    var cw = wrap.dom.offsetWidth;
    var l = this.edge.getOffsetsTo(this.stripWrap)[0];

    if (!this.enableMenu || count < 1 || cw < 20) { // 20 to prevent display:none issues
      return;
    }

    wrap.setWidth(tw);

    if (l <= tw) {
      if (this.showingMenu) {
        this.showingMenu = false;
        this.menuButton.hide();
      }
    } else {
      tw -= wrap.getMargins('lr');

      wrap.setWidth(tw > 20 ? tw : 20);

      if (!this.showingMenu) {
        if (!this.menuButton) {
          this.createMenuButton();
        } else {
          this.menuButton.show();
        }
      }

      mo = this.getMenuButtonPos();

      for (var i = count - 1; i >= 0; i--) {
        var bo = this.items[i].el.dom.offsetLeft + this.items[i].el.dom.offsetWidth;

        if (bo > mo) {
          this.items[i].hide();

          var ic = this.items[i].initialConfig,
          config = {
            iconCls: ic.iconCls,
            handler: ic.handler,
            scope: ic.scope,
            text: ic.menuText
          };

          this.menuAdd(config);
        } else {
          this.items[i].show();
        }
      }

      this.showingMenu = true;
    }
  },

  createMenuButton: function() {
    var h = this.el.dom.offsetHeight;
    var mb = this.el.insertFirst({
      cls: 'ux-quickstart-menubutton-wrap'
    });

    mb.setHeight(h);
    
    var btn = new Ext.Button({
      cls: 'x-btn-icon',
      id: 'ux-quickstart-menubutton',
      menu: this.menu,
      renderTo: mb
    });

    mb.setWidth(Ext.get('ux-quickstart-menubutton').getWidth());

    this.menuButton = mb;
  },

  getMenuButtonPos: function() {
    return this.menuButton.dom.offsetLeft;
  }
});