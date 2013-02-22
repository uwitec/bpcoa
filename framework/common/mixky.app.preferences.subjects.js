
Ext.namespace("Mixky.app.common");

Mixky.app.common.PreferencesSubjects = function(){

	var tree = new Ext.tree.TreePanel({
    	region : 'west',
		rootVisible: false,
    	autoScroll : true,
    	split : false,
    	width : 200,
		loader: new Ext.tree.TreeLoader({
        	paramOrder:[],
            directFn: DesktopAppDirect.getSubjects,
            listeners : {
				'load' : function(loader, node){
					node.eachChild(function(child){
						if(MixkyApp.hasSubject(child.attributes.key)){
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
						if(!MixkyApp.hasSubject(node.attributes.key)){
							MixkyApp.addSubject({
								key : node.attributes.key,
								text : node.attributes.text,
								iconCls : node.attributes.iconCls,
								width : 300,
								height : 300,
								webheight : 300,
								left : 100,
								top : 50
							});
						}
		    		}else{
		    			MixkyApp.removeSubject(node.attributes.key);
		    		}
		    	}
		    	node.ownerTree.selModel.select(node);
			}
		},
		root : {id : 'root',text : '桌面栏目'}
	});
	
	var note = new Ext.Panel({
    	region : 'center',
    	border : false,
    	html : '选择桌面栏目'
	});
	
	var panel = new Ext.Panel({
		layout : 'border',
		title : '桌面栏目',
        padding : '5px',
		border : false,
        iconCls : 'icon-sys-subject',
		items : [tree, note]
	})
	
	return panel;
}