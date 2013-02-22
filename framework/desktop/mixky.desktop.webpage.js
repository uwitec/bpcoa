
//=================================================================
//	�ļ�����desktop.framework.js
//=================================================================

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
//=================================================================
//	�ļ�����desktop.header.js
//=================================================================
Mixky.desktop.Header = function(config){
	
	this.toolbar = new Ext.Toolbar({
    	items:this.getToolbarItems()
    });
	
	var el = Ext.getBody().createChild({
		id : 'x-webpage-header',
		tag : 'div'
	});

	el.load({
		url : 'head.do',
		scripts: true
	});
	
	var height = this.getHeaderHeight();
	
	Mixky.desktop.Header.superclass.constructor.call( this, Ext.apply({
        border:false,
    	region:'north',
        height:height,
        minHeight:height,
        maxHeight:height,
        hideCollapseTool : true,
        collapsible: true,
        split : true,
        collapseMode:'mini',
        items: [{
            xtype : 'box',
            el : el,
            height : 36,
            border : false
        }, this.toolbar]
	}, config));
};

Ext.extend( Mixky.desktop.Header, Ext.Panel, {
	getHeaderHeight : function(){
		var height = 116;
		if(MixkyApp.userConfig.toolBarShowIconMode == 2){
			height = 96
		}
		if(Ext.isIE || Ext.isChrome){
			height = height - 4;
		}
		return height;
	},
	// private
	getToolbarItems : function(){
	
		this.winsButton = new Mixky.desktop.TaskBar();
		
		this.appendWindow = function(win){
			this.winsButton.appendWindow(win);
		}
		this.removeWindow = function(win){
			this.winsButton.removeWindow(win);
		}
		
		this.quickButton = new Mixky.desktop.QuickBar();
	
		var items = [];
		
		var mode = MixkyApp.userConfig.toolBarShowIconMode;
		if(!mode){
			mode = 0;
		}
		
		var menus = MixkyApp.menus;
		var getChildMenu = function(menuCfg){
			var items = [];
	    	for(var i=0;i<menuCfg.items.length;i++){
	    		var btn = {
	            	name : menuCfg.items[i].name,
	        	    scale : mode == 1 ? 'small' : 'medium',
	    	        iconAlign : mode == 0 ? 'top' : 'left',
	            	iconCls : menuCfg.items[i].iconCls + '24',
	            	handler : MixkyApp.handlerMenu
	    		}
	    		if(mode == 2){
	    			btn.tooltip = menuCfg.items[i].text
	    		}else{
	    			btn.text = menuCfg.items[i].text
	    		}
	    		items.push(btn);
	    	}
	    	return items;
		}
		for(var i=0;i<menus.length;i++){
			if(Ext.isDefined(menus[i].items)){
				items.push({
					xtype: 'buttongroup',
					title : menus[i].text,
					columns : mode == 1 ? menus[i].items.length / 2 : menus[i].items.length,
					items : getChildMenu(menus[i])
				});
			}else{
				items.push({
					xtype: 'buttongroup',
					scale : 'medium',
					title : menus[i].text,
					columns : 1,
					items : [{
		        		text : menus[i].text,
		        		name : menus[i].name,
		        		iconAlign : mode == 0 ? 'top' : 'left',
		        		iconCls : menus[i].iconCls + '24',
		        		handler : MixkyApp.handlerMenu
		    		}]
				});
			}
		}
		items.push('->');
	
		var exitBtn = {
			text : mode == 2 ? undefined : '退出系统',
			tooltip : mode == 2 ? '退出系统' : undefined,
		    scale : 'medium',
			iconAlign : 'top',
			iconCls :'icon-sys-exit24',
			handler : function(){
				Ext.Msg.confirm('退出警告','退出系统，该操作将放弃所有未保存数据，您确定吗？',function(btn){
					if(btn == 'yes')
					{
						window.location = "logout.do";
					}
				});
			}
		};
		items.push( {
			xtype : 'buttongroup',
			title : '系统功能',
			columns : 3,
	        items:[
	           this.quickButton,
	           //Mixky.app.Actions.getIconSizeAction(Mixky.app.Actions.ShowDesktop, 24),
	           this.winsButton,
	           //Mixky.app.Actions.getIconSizeAction(Mixky.app.Actions.Help, 24),
	           exitBtn
	        ]
		});
		return items;
	},
	setIconMode : function(){
		this.toolbar.removeAll();
		this.toolbar.add(this.getToolbarItems());
		this.toolbar.doLayout();
		
		var height = this.getHeaderHeight();
		this.setHeight(height);
		this.ownerCt.getLayout().north.maxSize = height;
		this.ownerCt.doLayout();
	}
});
//=================================================================
//	�ļ�����desktop.portal.js
//=================================================================
Mixky.desktop.Portal = function(config){
	this.buttonPanel = new Ext.Panel({
        region:'west',
	    border : false,
	    bodyStyle : 'background:transparent none',
        width : 15
	});
	var panelItems;
	switch(MixkyApp.userConfig.columns){
	case 2:
		panelItems = [{
            columnWidth:.5,
            style:'padding:10px 0 10px 10px'
        },{
            columnWidth:.5,
            style:'padding:10px 10px 10px 10px'
        }]
		break;
	case 4:
		panelItems = [{
            columnWidth:.25,
            style:'padding:10px 0 10px 10px'
        },{
            columnWidth:.25,
            style:'padding:10px 0 10px 10px'
        },{
            columnWidth:.25,
            style:'padding:10px 0 10px 10px'
        },{
            columnWidth:.25,
            style:'padding:10px 10px 10px 10px'
        }]
		break;
	default :
		panelItems = [{
            columnWidth:.33,
            style:'padding:10px 0 10px 10px'
        },{
            columnWidth:.33,
            style:'padding:10px 0 10px 10px'
        },{
            columnWidth:.34,
            style:'padding:10px 10px 10px 10px'
        }]
		break;
	}
	this.portalPanel = new Ext.ux.Portal({
        region:'center',
	    bodyStyle : 'background:transparent none',
    	border : false,
        items:panelItems
	});
	
	this.portalPanel.on('drop', function(){
		this.setPortletsPos();
	}, this)
	Mixky.desktop.Portal.superclass.constructor.call( this, Ext.apply({
		title : '我的桌面',
	    border : true,
	    layout : 'border',
	    items : [this.buttonPanel, this.portalPanel],
		iconCls : 'icon-sys-portal'
	}, config));
	
	this.contextmenu = new Ext.menu.Menu({
		items : [
	      Mixky.app.Actions.Preferences,
	      Mixky.app.Actions.SavePreferences,
	      Mixky.app.Actions.DelPreferences,
	      Mixky.app.Actions.SaveAsDefaultPreferences,
	      '-',
	      Mixky.app.Actions.ChangePassword,
	      '-',
	      Mixky.app.Actions.DesignTool,
	      Mixky.app.Actions.Help,
	      '-',
	      Mixky.app.Actions.Exit,
	      '-',
	      Mixky.app.Actions.ShowDayTips,
	      Mixky.app.Actions.About
		]
	});
	
	this.buttonPanel.on('afterrender', function(bp){
		this.shortcuts = new Mixky.desktop.Shortcuts({
    		renderTo : bp.body
        });	
		this.shortcuts.on('columnsrefresh', function(width){
			this.buttonPanel.setWidth(width);
			this.doLayout();
		}, this, { delay: 100 });
	}, this);
};

Ext.extend( Mixky.desktop.Portal, Ext.Panel, {
    // overwrite
    onRender : function(ct, position){
    	Mixky.desktop.Portal.superclass.onRender.call(this, ct, position);
    	this.body.on('contextmenu', function(e){
        	if(e.target.id == this.buttonPanel.body.id || 
        			e.target.id == this.portalPanel.body.id || 
        			e.target.id == this.portalPanel.body.first().id){
    	    	e.stopEvent();
    			if(!this.contextmenu.el){
    				this.contextmenu.render();
    			}
    			var xy = e.getXY();
    			xy[1] -= this.contextmenu.el.getHeight();
    			this.contextmenu.showAt(xy);
    		}
    	}, this);	
    },
    getMinHeightCol : function(){
    	var height = 10000;
    	var index = 0;
		this.portalPanel.items.each(function(columnitem, col){
			if(columnitem.getHeight() < height){
				height = columnitem.getHeight();
				index = col;
			}
		}, this);
		return index;
    },
    // extend method
	addSubject : function(o){
		var panel = Ext.getCmp('portlet-' + o.key);
		if(!panel){
			var col = Ext.isDefined(o.col) ? o.col : this.getMinHeightCol();
			col = col % MixkyApp.userConfig.columns;
			panel = new Ext.ux.Portlet({
				id : 'portlet-' + o.key,
	    		title : o.text,
	    		layout : 'fit',
	    		iconCls : o.iconCls,
	    		height : o.webheight,
				tools : [{
					id : 'refresh',
					handler : function(){
						panel.refresh();
					},
					qtip : "刷新栏目内容"
				}],
				autoLoad : {
					url : "portlet.do",
					params : {key : o.key},
					scripts : true
				},
				refresh : function(){
					panel.doAutoLoad();
				}
	    	});
			this.portalPanel.items.get(col).add(panel);
			this.portalPanel.doLayout();
			panel.key = o.key;
		}
		return panel;
	},
    // extend method
	removeSubject : function(key){
		var panel = Ext.getCmp('portlet-' + key);
		if(panel){
			var pc = panel.findParentByType('portalcolumn');
			pc.remove(panel);
			//panel.destroy();
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
	getButtonCmp : function(btntype, key){
		return this.shortcuts.getButtonCmp(btntype, key);
	},
	setPortletsPos : function(){
		this.portalPanel.items.each(function(columnitem, col){
			columnitem.items.each(function(panel, row){
				var subject = MixkyApp.getSubject(panel.key);
    			subject.col  = col;
    			subject.row  = row;
			},this);
		}, this);
	}
});
//=================================================================
//	�ļ�����desktop.quickbar.js
//=================================================================
Mixky.desktop.QuickBar = function(config){
	Mixky.desktop.QuickBar.superclass.constructor.call( this, Ext.apply({
		text : MixkyApp.userConfig.toolBarShowIconMode == 2 ? undefined : '快速功能',
		tooltip : MixkyApp.userConfig.toolBarShowIconMode == 2 ? '快速功能' : undefined,
	    scale : 'medium',
		iconAlign : 'top',
		iconCls : 'icon-sys-function24',
		menu : new Ext.menu.Menu({
			items : [
			    Mixky.app.Actions.ShowDesktop,
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
		})
	}, config));
};

Ext.extend( Mixky.desktop.QuickBar, Ext.Button, {
	appendButton : function(item){
		this.menu.add(item);
	},
	removeButton : function(btntype, key){
		var item = this.getQuickStartCmp(btntype, key);
		if(Ext.isDefined(item)){
			this.menu.remove(item);
		}
	},
	getQuickStartCmp : function(btntype, key){
		for (var i = 0; i < this.menu.items.length; i++) {
			var item = this.menu.items.get(i);
			if(item && item.btntype == btntype && item.key == key){
				return item;
			}
		}
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
	var desktopEl = config.renderTo
		, btnHeight = 74
		, btnWidth = 64
		, btnPadding = 15
		, col = null
		, row = null
		, items = []
		, columnsrefreshWidth = 0;

	this.addEvents('columnsrefresh');
  
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
	this.initColRow = function () {
	  col = { index: 1, x: btnPadding };
		row = { index: 1, y: btnPadding };
		columnsrefreshWidth = btnPadding;
		this.fireEvent('columnsrefresh', columnsrefreshWidth);
	}
	this.initColRow();

	function isOverflow(y) {
		if (y > desktopEl.getHeight()) {
			return true;
		}
		return false;
	}

	this.addShortcut = function(config) {
		var div = desktopEl.createChild({ tag: 'div', cls: 'ux-shortcut-item' });
		var btn = new Mixky.desktop.ShortcutButton(Ext.apply(config, {
			text: Ext.util.Format.ellipsis(config.text, 25)
		}), div);
		menu = this.menu;
		// 系统图标
    
		// 右键菜单
		div.addListener('contextmenu', function(e){
			menu.button = btn;
			menu.showAt(e.getXY());
		});

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
    this.initColRow();
    for (var i = 0, len = items.length; i < len; i++) {
      this.setXY(items[i].container);
    }
  }

  this.setXY = function(item) {
    var bottom = row.y + btnHeight,
			overflow = isOverflow(row.y + btnHeight);

    if (overflow && bottom > (btnHeight + btnPadding)) {
      col = {
        index: col.index++, 
        x: col.x + btnWidth + btnPadding
      };
      row = {
        index: 1, 
        y: btnPadding
      };
    }
    
    item.setLeftTop(col.x, row.y);

    row.index++;
    row.y = row.y + btnHeight + btnPadding;
    if(columnsrefreshWidth != col.x + btnWidth + btnPadding){
    	columnsrefreshWidth = col.x + btnWidth + btnPadding;
        this.fireEvent('columnsrefresh', columnsrefreshWidth);
    }
  };

  Ext.EventManager.onWindowResize(this.handleUpdate, this, { delay: 500 });
};

Ext.extend(Mixky.desktop.Shortcuts, Ext.util.Observable, {}); 


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

	setText: function(text) {
		this.text = text;
		if (this.el) {
			this.el.child("div.ux-shortcut-btn-text").update(text);
		}
	}
});
//=================================================================
//	�ļ�����desktop.taskbar.js
//=================================================================
Mixky.desktop.TaskBar = function(config){
	Mixky.desktop.TaskBar.superclass.constructor.call( this, Ext.apply({
		text : MixkyApp.userConfig.toolBarShowIconMode == 2 ? undefined : '文档窗口',
		tooltip : MixkyApp.userConfig.toolBarShowIconMode == 2 ? '文档窗口' : undefined,
	    scale : 'medium',
		iconAlign : 'top',
		iconCls : 'icon-sys-windows24',
		menu : new Ext.menu.Menu({
			items : [{
				iconCls : "icon-sys-closeall",
				text : "关闭所有",
				handler : function(){
					MixkyApp.desktop.closeAllWindow();
				}
			}, '-']
		})
	}, config));
};

Ext.extend( Mixky.desktop.TaskBar, Ext.Button, {
	appendWindow : function(win){
		var item = this.menu.addMenuItem({
			iconCls: win.iconCls,
			checked: true,
			text : Ext.util.Format.ellipsis(win.title, 12),
			tooltip: win.taskbuttonTooltip || win.title,
			handler: function() {
				win.show();
				win.toFront();
			}
		});
		item.win = win;
	},
	removeWindow : function(win){
		var item = this.findWindowItem(win);
		if(Ext.isDefined(item)){
			this.menu.remove(item);
		}
	},
	markWindowShow : function(win){
		var item = this.findWindowItem(win);
		if(Ext.isDefined(item)){
			item.setChecked(true);
		}
	},
	markWindowHide : function(win){
		var item = this.findWindowItem(win);
		if(Ext.isDefined(item)){
			item.setChecked(false);
		}
	},
	findWindowItem : function(win){
		for (var i = 0; i < this.menu.items.length; i++) {
			if (this.menu.items.get(i).win == win) {
				return this.menu.items.get(i);
			}
		}
	}
});