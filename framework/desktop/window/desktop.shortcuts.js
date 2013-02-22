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