/*
 *	Mixky 产品专用
*/
Mixky.app.Actions.DesignTool = new Ext.Action({
	text : '系统管理',
    scale : 'medium',
	iconAlign : 'top',
	iconCls :'icon-app-mkoa-admin',
	// 普通用户隐藏
	hidden : Mixky.app.UserInfo.type == 1,
	handler : function(){
		MixkyApp.desktop.openModule('mkAdmin');
	}
});