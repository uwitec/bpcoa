
Ext.namespace("Mixky.app.common");

Mixky.app.common.PreferencesShortcuts = function(){

	var tree = new Ext.tree.TreePanel({
    	region : 'west',
		rootVisible: false,
    	autoScroll : true,
    	split : false,
    	width : 200,
		loader: new Ext.tree.TreeLoader({
        	paramOrder:[],
            directFn: DesktopAppDirect.getShortcuts,
            listeners : {
				'load' : function(loader, node){
					node.eachChild(function(child){
						if(MixkyApp.hasShortcut(child.attributes.btntype, child.attributes.key)){
							child.getUI().toggleCheck(true);
						}
					});
				}
			}
		}),
		listeners: {
			'checkchange': function(node, checked){
				if(node.leaf && node.id){
		    		if(checked){
						if(!MixkyApp.hasShortcut(node.attributes.btntype, node.attributes.key)){
							MixkyApp.addShortcut({
								text : node.attributes.text, 
								iconCls : node.attributes.iconCls, 
								btntype : node.attributes.btntype, 
								key : node.attributes.key
							});
						}
		    		}else{
		    			MixkyApp.removeShortcut(node.attributes.btntype, node.attributes.key);
		    		}
		    	}
		    	node.ownerTree.selModel.select(node);
			}
		},
		root : {id : 'root',text : '桌面按钮'}
	});
	
	var note = new Ext.Panel({
    	region : 'center',
    	border : false,
    	html : '选择桌面启动按钮'
	});
	
	var panel = new Ext.Panel({
		layout : 'border',
		title : '桌面按钮',
        padding : '5px',
		border : false,
        iconCls : 'icon-sys-shortcut',
		items : [tree, note]
	})
	
	return panel;
}