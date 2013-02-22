/*
 *	Mixky 系统通用操作
*/

Ext.namespace("Mixky.app.Actions");

Mixky.app.Actions.Preferences = new Ext.Action({
	text : '应用设置',
    scale : 'medium',
	iconAlign : 'top',
	iconCls : 'icon-sys-preference',
	handler : Mixky.app.common.Preferences
});

Mixky.app.Actions.SavePreferences = new Ext.Action({
	text : '保存应用设置',
    scale : 'medium',
	iconAlign : 'top',
	iconCls : 'icon-sys-save',
	handler : function(){
		var notifyWin = MixkyApp.showWaitMessage("正在保存应用设置...");
		DesktopAppDirect.saveUserConfig('', MixkyApp.userConfig, function(result, e){
			if(result && result.success){
				notifyWin.setIconClass('x-icon-done');
				notifyWin.setTitle('保存完成');
				notifyWin.setMessage('应用设置保存完毕.');
			}else{
				notifyWin.setIconClass('x-icon-error');
				notifyWin.setTitle('保存失败');
				notifyWin.setMessage('应用设置保存失败.');
			}
			MixkyApp.hideNotification(notifyWin);
		});
	}
});

Mixky.app.Actions.DelPreferences = new Ext.Action({
	text : '恢复默认桌面',
    scale : 'medium',
	iconAlign : 'top',
	iconCls : 'icon-sys-remove',
	handler : function(){
		Ext.Msg.confirm('操作提示','恢复默认桌面，该操作将删除您的个性化定制桌面，恢复为默认桌面设置，您确定吗？',function(btn){
			if(btn == 'yes'){
				DesktopAppDirect.delUserConfig('', function(result, e){
					if(result && result.success){
						Ext.Msg.alert('操作提示', '操作成功，刷新页面后即可恢复为默认桌面！');
					}else{
						Ext.Msg.alert('操作错误', '恢复桌面配置失败！');
					}
				});
			}
		})
	}
});

Mixky.app.Actions.SaveAsDefaultPreferences = new Ext.Action({
	text : '保存为默认设置',
    scale : 'medium',
	iconAlign : 'top',
	iconCls : 'icon-sys-save',
	// 普通用户隐藏
	hidden : Mixky.app.UserInfo.type == 1,
	handler : function(){
		var fieldStyle = new Ext.form.ComboBox({
			fieldLabel: '　选择/输入样式名',
			xtype : 'combo',
			editable: true,
			anchor : '-10',
			triggerAction : 'all',
			mode : 'local',
			valueField : 'value',
			displayField : 'display',
			value : 'default',
			store : Mixky.app.common.getDictionaryDoUrlStore('framework/engine/portlet/desktop.dictionary'),
			listeners : {
				'render' : function(cb){cb.getStore().load();}
			}
		});
		var win = new Ext.Window({
			height : 120,
			width : 280,
			modal : true,
	        shim : false,
	        maximizable : false,
	        minimizable : false,
	        animCollapse :false,
	        resizable :false,
			title : '保存为公共桌面样式',
			items : new Ext.form.FormPanel({
				border : false,
				bodyStyle : 'padding-top:20px;padding-bottom:20px;',
				labelWidth : 120,
				items : [fieldStyle]
			}) ,
			buttons : [{
				text : '确定',
				handler : function(){
					var style = fieldStyle.getValue();
					var notifyWin = MixkyApp.showWaitMessage("正在保存应用设置...");
					DesktopAppDirect.saveUserConfig('(' + style + ')', MixkyApp.userConfig, function(result, e){
						if(result && result.success){
							notifyWin.setIconClass('x-icon-done');
							notifyWin.setTitle('保存完成');
							notifyWin.setMessage('默认应用设置('+style+')保存完毕.');
						}else{
							notifyWin.setIconClass('x-icon-done');
							notifyWin.setTitle('保存失败');
							notifyWin.setMessage('默认应用设置('+style+')保存失败.');
						}
						MixkyApp.hideNotification(notifyWin);
					});
					win.close();
				}
			},{
				text : '取消',
				handler : function(){
					win.close();
				}
			}]
		});
		win.show();
	}
});

Mixky.app.Actions.ChangePassword = new Ext.Action({
	text : '修改密码',
    scale : 'medium',
	iconAlign : 'top',
	iconCls : 'icon-sys-password',
	handler : Mixky.app.common.ChangePassword
});

Mixky.app.Actions.Exit = new Ext.Action({
	text : '退出系统',
    scale : 'medium',
	iconAlign : 'top',
	iconCls :'icon-sys-exit',
	handler : function(){
		Ext.Msg.confirm('退出警告','退出系统，该操作将放弃所有未保存数据，您确定吗？',function(btn){
			if(btn == 'yes')
			{
				window.location = "logout.do";
			}
		});
	}
});

Mixky.app.Actions.Help = new Ext.Action({
	text : '查看帮助',
    scale : 'medium',
	iconAlign : 'top',
	iconCls : 'icon-sys-help',
	handler : function(){
		Mixky.help.HelpWindow();
	}
});

Mixky.app.Actions.DesignTool = new Ext.Action({
	text : '定制工具',
    scale : 'medium',
	iconAlign : 'top',
	iconCls :'icon-sys-designtool',
	// 普通用户隐藏
	hidden : Mixky.app.UserInfo.type == 1,
	handler : function(){
		window.open("designtool/home.do");
	}
});


Mixky.app.Actions.ShowDayTips = new Ext.Action({
	text : '每日提示',
    scale : 'medium',
	iconAlign : 'top',
	iconCls :'icon-app-mkoa-daytips',
	handler : function(){
		Mixky.app.common.ShowDayTips();
	}
});

Mixky.app.Actions.About = new Ext.Action({
	text : '关于产品',
    scale : 'medium',
	iconAlign : 'top',
	iconCls :'icon-sys-logo',
	handler : function(){
		MixkyApp.desktop.openDourlWithWindow('win-mixky-about', 'about',
		{
			title : '关于创想协作办公系统',
			iconCls : 'icon-sys-logo',
			width : 380,
			height : 260,
			modal : true,
			loadScripts : true,
			scripts: true,
			resizable: false,
			maximizable : false,
			minimizable : false
		});
	}
});

Mixky.app.Actions.ShowDesktop = new Ext.Action({
	text : '显示桌面',
    scale : 'medium',
	iconAlign : 'top',
	iconCls :'icon-sys-desktop',
	handler : function(){
		MixkyApp.showDesktop();
	}
});

Mixky.app.Actions.getIconSizeAction = function(button, iconsize){
	button.setIconClass(button.getIconClass() + iconsize);
	return button;
}