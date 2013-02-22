
Ext.namespace("Mixky.app.common");

Mixky.app.common.Preferences = function(){
	var desktop = Mixky.app.common.PreferencesDesktop();
	var background = Mixky.app.common.PreferencesBackground();
	var shortcuts = Mixky.app.common.PreferencesShortcuts();
	var quickstarts = Mixky.app.common.PreferencesQuickStarts();
	var subjects = Mixky.app.common.PreferencesSubjects();
    win = new Ext.Window({
        title : '应用参数设置',
        width :500,
        height :500,
        iconCls : 'icon-sys-preference',
        shim : false,
        maximizable : false,
        minimizable : false,
        animCollapse :false,
        resizable :false,
        modal : true,
		layout : 'fit',
        items : [{
        	xtype : 'tabpanel',
            activeTab : 0,
            border :false,
            defaults: {
        		autoScroll:true
        	},
            items : [
                desktop,
                background,
                shortcuts,
                quickstarts,
                subjects
            ]
        }],
        buttons : [{
        	text : '保存设置',
            iconCls : 'icon-sys-save',
            handler : function(){
        		Mixky.app.Actions.SavePreferences.execute();
    		}
        },{
        	text : '关闭',
            iconCls : 'icon-sys-cancel',
            handler : function(){
    			win.close();
    		}
        }]
    });
    win.show();
}