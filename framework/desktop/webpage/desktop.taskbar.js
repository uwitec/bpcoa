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