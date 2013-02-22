
Ext.namespace("Mixky.help");

Mixky.help.HelpPanel = function(el) {
	var title = new Ext.Panel({
		region : 'north',
		height : 37,
		padding : 2,
		bodyStyle : 'color:white;font-weight:bold;font-size:13pt;background-image:url(images/hd-bg.gif)',
		html : '<img height=24 align=absmiddle src="images/logo32.gif"> 创想协作办公系统 联机帮助手册'
	});
	var bar = new Ext.Toolbar({
		items : ['-', {
			icon : 'images/relate.gif',
			relateTopics : true,
			text : '相关主题',
			disabled : true,
			menu : []
		}],
		getRelateTipicItem : function(){
			for(var i=0;i<this.items.getCount();i++){
				if(this.items.get(i).relateTopics){
					return this.items.get(i);
				}
			}
		},
		clearBarItem : function(){
			var deletes = [];
			for(var i=0;i<this.items.getCount();i++){
				if(this.items.get(i).isPath){
					deletes.push(this.items.get(i));
				}
			}
			for(var i=0;i<deletes.length;i++){
				this.remove(deletes[i]);
			}
	    }
	});
	var doc = new Ext.Panel({
		region : 'center',
		tbar : bar,
		html : '<iframe id=helpdoc-iframe frameborder=0 height=100% width=100% src="htmls/ProductHandBook.Service.htm"></iframe>'
	});
	var outline = new Ext.tree.TreePanel({
		region : 'west',
		animate : true, 
		autoScroll : true,
		rootVisible : true,
		loader : new Ext.tree.TreeLoader({dataUrl:'catalog.data', preloadChildren:true}),
		border : false,
		split : true,
        collapseMode : 'mini',
        padding : 5,
		root: {
			text : '帮助中心',
			icon : 'images/docs.gif',
			key : 'root'
		},
        listeners	:{
	        'afterrender' : function(){
				this.getRootNode().expand();
				this.getRootNode().select.defer(200, this.getRootNode());
			}
	    },
		selModel : new Ext.tree.DefaultSelectionModel({
			listeners	: {
				'selectionchange' :function(s, n){
					var path = n.getPath('key');
					if(doc.contentPath == path){
						return;
					}else{
						doc.contentPath = path;
						bar.clearBarItem();
						var iframe = document.getElementById("helpdoc-iframe");
						if (n.attributes.url) {
							iframe.src = 'htmls/' + n.attributes.url;
						}
						if(!n.isLeaf()){
							n.expand();
						}
						bar.clearBarItem();
						outline.addTopicPath(n);
			    		bar.doLayout();
					}
				}
			}
		}),
        minSize : 150,
        maxSize : 400,
		width: 300,
		addTopicPath : function(node){
	    	if(node){
	    		if(node.isLeaf()){
		    		bar.insertButton(0, {
		    			xtype : 'tbtext',
						isPath : true,
						icon : node.attributes.icon,
		    			text : node.attributes.text
		    		});
	    		}else{
					var items = [];
					for(var i=0;i<node.childNodes.length;i++){
						items.push({
							isPath : true,
							icon : node.childNodes[i].attributes.icon,
							text : node.childNodes[i].attributes.text,
							path : node.childNodes[i].getPath('key'),
							handler : function(){
								outline.openTopic(this.path);
							}
						})
					}
		    		var btn = {
		    			isPath : true,
						icon : node.attributes.icon,
		    			text : node.attributes.text,
			    		menu : items
			    	}
		    		bar.insertButton(0, btn);
	    		}
	    		this.addTopicPath(node.parentNode);
	    	}
	    },
		openTopic : function(path){
			this.expandPath(path, 'key', function(s, n){
				if(n){
					n.select();
				}
			});
	    }
	});
	var ui = new Ext.Viewport({
		layout : 'border',
		defaults : {border : false},
		items : [outline, title , doc]
	});
}

Ext.onReady(function(){
	Mixky.help.HelpPanel(Ext.getBody());
})
