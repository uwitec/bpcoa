
Ext.namespace("Mixky.help");

Mixky.help.HelpEditorPanel = function(el) {
	var attributeWin = Mixky.help.HelpEditorWindow();
	var title = new Ext.Panel({
		region : 'north',
		height : 37,
		padding : 2,
		bodyStyle : 'color:white;font-weight:bold;font-size:13pt;background-image:url(images/hd-bg.gif)',
		html : '<img height=24 align=absmiddle src="images/logo32.gif"> 创想协作办公系统 联机帮助手册制作工具'
	});
	var bar = new Ext.Toolbar({
		items : [{
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
		html : '<iframe id=helpdoc-iframe frameborder=0 height=100% width=100% src="htmls/ProductHandBook.Overview.htm"></iframe>'
	});
	var loader = new Ext.tree.TreeLoader({
		preloadChildren:true,
		baseParams : {
			action : 1,
			keypath : '.root'
		},
		dataUrl:'editor.exe.jsp',
		listeners : {
			'load' : function(l, n){
				n.expand();
			}
		}
	});
	var outline;
	var btnRefresn = new Ext.Action({
		text : '刷新',
		icon : 'images/refresh.gif',
		handler : function(){
			outline.refresh(outline.contextNode);
		}
	});
	var btnEdit = new Ext.Action({
		text : '编辑',
		icon : 'images/edit.gif',
		handler : function(){
			attributeWin.show();
			var node = outline.contextNode;
    		if(node != outline.getRootNode()){
				attributeWin.startEdit(node);
    		}
		}
	});
	var btnAppend = new Ext.Action({
		text : '添加下级',
		icon : 'images/append.gif',
		handler : function(){
			attributeWin.show();
			var node = outline.contextNode;
			var newnode = node.appendChild({
				text : '新建主题',
				icon : 'images/new.gif',
				isnew : true,
				key : 'new',
				leaf : true
			});
			node.expand(false, false, function(){
				newnode.select();
			});
		}
	});
	var btnInsert = new Ext.Action({
		text : '插入',
		icon : 'images/insert.gif',
		handler : function(){
			attributeWin.show();
			var node = outline.contextNode;
			var newnode = node.parentNode.insertBefore({
				text : '新建主题',
				icon : 'images/new.gif',
				isnew : true,
				key : 'new',
				index : node.parentNode.indexOf(node),
				leaf : true
			}, node);
			newnode.select();
		}
	});
	var btnDelete = new Ext.Action({
		text : '删除',
		icon : 'images/delete.gif',
		handler : function(){
			var node = outline.contextNode;
			Ext.Ajax.request({
				url: 'editor.exe.jsp',
				params : {
					action : 4,
					keypath : node.getPath('key')
				},
				success : function(response){
					var o = Ext.decode(response.responseText);
					if(o && o.success){
						outline.refresh(node.parentNode);
					}else{
						alert('删除失败');
					}
				}
			});
		}
	});
	outline = new Ext.tree.TreePanel({
		region : 'west',
		animate : true, 
		autoScroll : true,
		rootVisible : true,
		loader : loader,
		border : false,
		split : true,
        collapseMode : 'mini',
        pathSeparator : '.',
		root: {
			text : '帮助中心',
			icon : 'images/docs.gif',
			key : 'root'
		},
		tbar : ['->', btnEdit, btnAppend, btnInsert, btnDelete],
        menu : new Ext.menu.Menu({
        	items : [btnRefresn, '-', btnEdit, btnAppend, btnInsert, btnDelete]
        }),
        listeners	:{
	        'afterrender' : function(){
				this.getRootNode().expand();
				this.getRootNode().select.defer(200, this.getRootNode());
			},
	        'contextmenu' : function(node, e){
	        	node.select();
	            outline.menu.showAt(e.getXY());
			}
	    },
		selModel : new Ext.tree.DefaultSelectionModel({
			listeners	: {
				'selectionchange' :function(s, n){
            		outline.contextNode = n;
					attributeWin.stopEdit();
		        	if(! n || n == outline.getRootNode() || n.attributes.isnew){
		        		btnEdit.disable();
		        		btnInsert.disable();
		        		btnDelete.disable();
		        		if(n && n.attributes.isnew){
		        			btnAppend.disable();
		        		}else{
			        		btnAppend.enable();
		        		}
		        	}else{
		        		btnEdit.enable();
		        		btnAppend.enable();
		        		btnInsert.enable();
		        		btnDelete.enable();
		        	}
					if(!n){
						return;
					}
					var path = n.getPath('key');
					if(doc.contentPath == path){
						return;
					}else{
						if (n.childNodes  && n.childNodes.length > 0) {
							//alert(22);
						} else {
							doc.contentPath = path;
							bar.clearBarItem();
							var iframe = document.getElementById("helpdoc-iframe");
							// 打开HTML
							iframe.src = 'htmls/' + n.attributes.url;
							// 打开WORD
							// iframe.src = 'docs/editor.opendoc.jsp?keyparh' + path;
							if(!n.isLeaf()){
								n.expand();
							}
							bar.clearBarItem();
							outline.addTopicPath(n);
				    		bar.doLayout();
				    		if(n != outline.getRootNode()){
								attributeWin.startEdit(n);
				    		}
						}
					}
				}
			}
		}),
        minSize : 200,
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
	    },
	    refresh : function(node, callback){
	    	if(!node.attributes.isnew){
				node.attributes.children = undefined;
				outline.getLoader().baseParams['keypath'] = node.getPath('key');
				outline.getLoader().load(node, callback);
	    	}
	    }
	});

	attributeWin.refresh = function(){
		var path = attributeWin.node.getPath('key');
		outline.refresh(attributeWin.node.parentNode, function(){
			outline.selectPath(path, 'key', function(s, node){
				if(s){
					attributeWin.startEdit(node);
					node.expand();
				}
			});
		});
		attributeWin.stopEdit();
	};
	var ui = new Ext.Viewport({
		layout : 'border',
		defaults : {border : false},
		items : [outline, title , doc]
	});

	attributeWin.show();
}

Ext.onReady(function(){
	Mixky.help.HelpEditorPanel(Ext.getBody());
});