
Ext.BLANK_IMAGE_URL = '../dependences/ext-3.1.1/resources/images/default/s.gif';

Mixky.designtool.Framework = {};

Ext.onReady(function(){
	// 初始化应用程序环境参数
    Ext.QuickTips.init();
    Ext.Direct.addProvider(Mixky.designtool.REMOTING_API);
    var framework = Mixky.designtool.Framework;

    // 应用程序标题区域
    framework.headPanel = new Mixky.designtool.CHead();
    // 应用程序导航区域
    framework.outlineTree = new Mixky.designtool.CTree();
    // 应用程序主体区域
    framework.contentPanel = new Mixky.designtool.CMain();
    
    framework.closeEditor = function(key){
		return Mixky.designtool.Framework.contentPanel.removeObject(key);
    }
    
    framework.openObject = function(oid){
		Mixky.designtool.Framework.outlineTree.selectObject(oid);
		var cmp = Mixky.designtool.Framework.contentPanel.openEditor(oid);
    }
    
    framework.activateObject = function(oid){
    	framework.outlineTree.selectObject(oid);
    	framework.contentPanel.selectObject(oid);
    }

    framework.deleteObject = function(key){
    	framework.outlineTree.removeObject(key);
    	framework.contentPanel.removeObject(key);
    }
    
    // 创建视图架构
    var view = new Ext.Viewport( {
		layout :'border',
		items : [ framework.headPanel, framework.outlineTree, framework.contentPanel ]
	});
    
	// 处理右键屏蔽
	Ext.getBody().on('contextmenu', function(e, el) {
		e.preventDefault();
    }); 
    
    // 处理Loading界面
	setTimeout(function(){
        Ext.get('loading').remove();
        Ext.get('loading-mask').fadeOut({remove:true});
    }, 250);
	
	// 初始化菜单
	Mixky.designtool.Class.setActionEnabled();
});