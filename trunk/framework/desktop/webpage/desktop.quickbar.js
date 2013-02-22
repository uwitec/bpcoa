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