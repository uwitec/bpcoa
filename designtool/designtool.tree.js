Mixky.designtool.CTree = function(){
	
	Mixky.designtool.CTree.superclass.constructor.call( this, {
    	el:'designtool-outline',
        split : true,
        width : 280,
        minSize : 175,
        maxSize : 500,
        margins : '0 0 5 0',
        cmargins :'0 0 0 0',
    	region : 'west',
    	autoScroll : true,
    	root: {
            text: "定制管理工具",
            id : 'root',
            key : 'root',
            mclass : 'root'
        },
        loader: new Ext.tree.TreeLoader({
        	paramOrder:['mclass'],
        	listeners:{
        		'beforeload':function(loader, node){
        			Ext.apply(this.baseParams,{'mclass':node.attributes['mclass']});
        		},
        		'load':function(loader, node){
        			node.getOwnerTree().selectObject(Mixky.designtool.Context.activatedObject);
        		}
        	},
            directFn: DesignToolDirect.getOutline
        }),
        // 重命名
        renameObject : function(srcKey, dstKey){
        	var node = this.getNodeById(srcKey);
        	if(node){
        		node.setId(dstKey);
        		node.attributes.key = dstKey;
            	this.refresh(node);
        		return true;
        	}
        	return false;
        },
        // 刷新父节点
        refreshParent : function(node){
			if (!node) {
				node = this.getSelectionModel().getSelectedNode();
			}
			if(!node){
				return;
			}
			node = node.parentNode;
			node.attributes.children = undefined;
			node.reload();
        },
        // 刷新节点下级
		refresh : function(node) {
			if (!node) {
				node = this.getSelectionModel().getSelectedNode();
			}
			if (!node || node.isLeaf()) {
				return false;
			}
			node.attributes.children = undefined;
			node.reload();
			return true;
		},
        // 获得节点对象标识{key,mclass}
        getObjectIdentity:function(node){
        	if(!node){
        		node = this.getSelectionModel().getSelectedNode();
        	}
        	if(!node){
        		return;
        	}
        	return {id:node.id, key:node.attributes.key, mclass:node.attributes.mclass};
        },
        // 选中对象
        selectObject : function(oid){
        	if(!oid){
        		return;
        	}
        	var node = this.getNodeById(oid.id);
        	if(!node){
        		node = this.getNodeById(oid.key);
        	}
        	if(node){
        		node.select();
        		this.expandPath(node.getPath());
        	}
        },
        // 移除对象
        removeObject : function(key){
        	var node = this.getNodeById(key);
        	if(node){
        		// 获得下一节点
        		var nextNode = node.parentNode;
        		if(!node.isLast()){
        			nextNode = node.nextSibling;
        		}else if(!node.isFirst()){
        			nextNode = node.previousSibling;
        		}
            	// 选中下一节点
            	nextNode.select();
        		this.expandPath(nextNode.getPath());
            	node.remove();
        	}
        }
	});
	// 节点右键菜单
	var documentMenu = new Ext.menu.Menu({
		ignoreParentClicks : true,
		items:[
		    Mixky.designtool.Actions.Open,'-',
			Mixky.designtool.Actions.Add,
			Mixky.designtool.Actions.Rename,
			Mixky.designtool.Actions.Delete,
			Mixky.designtool.Actions.Copy,
			Mixky.designtool.Actions.Paste,
			Mixky.designtool.Actions.CopyPaste,'-',
			Mixky.designtool.Actions.Import,
			Mixky.designtool.Actions.Export,
			Mixky.designtool.Actions.ViewJSON,'-',
			Mixky.designtool.Actions.Refresh,'-',
			Mixky.designtool.Actions.Extends
		]
	});
	this.on('contextmenu', function(node, e){
		this.getSelectionModel().select(node);
		documentMenu.showAt(e.getXY());
	});
	this.on('dblclick', function(n, e){
		if(n.isLeaf()){
			Mixky.designtool.Actions.Open.execute();
		}
	});
	this.on('click', function(p){
		Mixky.designtool.Context.activatedObject = this.getObjectIdentity();
	});
	this.getSelectionModel().on('selectionchange', function(sm, node){
		if(!node){
			return;
		}
		var oid = node.getOwnerTree().getObjectIdentity(node);
		if(oid){
			Mixky.designtool.Context.activateObject(oid, node.getOwnerTree());
		}
	});
};

Ext.extend( Mixky.designtool.CTree, Ext.tree.TreePanel, {});