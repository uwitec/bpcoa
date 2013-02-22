/*
 * 系统模块标签
 */
Mixky.app.Module = function(cfg){
	var modulekey = cfg.modulekey;
	var module = Mixky.app.Modules[modulekey];
	var modulePanel = this;
	var tree = new Ext.tree.TreePanel({
		region : 'west',
        width: 200,
        minSize: 150,
        maxSize: 400,
		split : true,
        collapsible: true,
        enableDrop: true,
        ddGroup: 'grid2tree',
        collapseMode:'mini',
        rootVisible:true,
        autoScroll:true,
        animCollapse:false,
        iconCls : 'icon-sys-modulemenu',
        title : '功能导航',
        tools : [{
        	id : 'refresh',
        	qtip : '刷新选中菜单的下级菜单',
        	handler : function(){
        		tree.refresh();
	        }
        },{
        	id : 'maximize',
        	qtip : '打开选中节点',
        	handler : function(){
	        	tree.openNode();
	        }
        }],
        cmenu : new Ext.menu.Menu({
        	items : [{
        		text : '刷新',
        		iconCls : 'icon-sys-refresh',
        		handler : function(){
        			tree.refresh();
        		}
        	}, {
        		text : '打开',
        		iconCls : 'icon-sys-open',
        		handler : function(){
        			tree.openNode();
        		}
        	}]
        }),
        listeners	:{
	        'afterrender' : function(p){
				p.getRootNode().expand();
			},
	        'contextmenu' : function(node, e){
	        	node.select();
	            var c = node.getOwnerTree().cmenu;
	            c.contextNode = node;
	            c.showAt(e.getXY());
			},
			'dblclick' : function(node, e){
				if(node.attributes.type == 'modulemenu'){
					MixkyApp.executeMenu(node.id, e);
				}
			}
	    },
        root: {
        	id : 'root',
        	text : module.title,
        	iconCls : module.icon,
        	qtip : module.qtip,
        	type : 'root',
            params : {'modulekey' : module.key}
		},
        loader: new Ext.tree.TreeLoader({
            directFn : ModuleAppDirect.getModuleTree,
        	paramOrder : ['params'],
        	baseParams : {params : {}},
        	listeners : {
        		'beforeload':function(loader, node){
        			loader.baseParams.params = tree.getNodeParams(node);
        			loader.baseParams.params.type = node.attributes.type;
        		}
        	}
		}),
		selModel : new Ext.tree.DefaultSelectionModel({
			listeners	: {
				'selectionchange' :function(s, n){
					tree.openNode(n);
				}
			}
		}),
		getNodeParams : function(node){
			var params = {};
			if(node.parentNode){
				Ext.apply(params, this.getNodeParams(node.parentNode));
			}
			Ext.apply(params, node.attributes.params);
			return params;
		},
		refresh : function(node){
			if(!node){
				node = this.getSelectionModel().getSelectedNode();
			}
			if(!node || node.isLeaf()){
				return;
			}
			node.reload();
		},
		refreshParentNode : function(node){
			if(!node){
				node = this.getSelectionModel().getSelectedNode();
			}
			if(!node){
				return;
			}
			this.refresh(node.parentNode);
		},
		openNode : function(node){
			if(!node){
				node = this.getSelectionModel().getSelectedNode();
			}
			if(!node){
				return;
			}
			if(node.attributes.isFunctionMenu){
				return;
			}
			var params = this.getNodeParams(node);
			if(Ext.isDefined(params.viewurl)){
				var urlPanel = modulePanel.openUrl('v-' + params.modulemenu, params.viewurl);
				if(urlPanel){
					if(urlPanel.refresh){
						urlPanel.refresh(params);
					}else{
						urlPanel.initParams = params;
					}
				}
			}else if(Ext.isDefined(params.viewkey)){
				var viewPanel = modulePanel.openView(params.viewkey);
				if(viewPanel){
					if(viewPanel.refresh){
						viewPanel.refresh(params);
					}else{
						viewPanel.initParams = params;
					}
				}
			}else{
				node.expand();
			}
		}
	});
	var container = new Ext.TabPanel({
		region:'center',
        enableTabScroll:true,
        defaults: {
    		autoScroll:true,
    		closable : true
    	},
        plugins: new Ext.ux.TabCloseMenu()
	});
	var config = {
		layout : 'border',
		shim:false,
		animCollapse:false,
		constrainHeader:true,
		minimizable:true,
		maximizable:true,
		border:false,
		items : [tree, container]
	}
	
	this.refresh = function(rtree, rtab){
		if(rtree){
			tree.refreshParentNode();
		}
		if(rtab){
			var tab = container.getActiveTab();
			if(tab && Ext.isDefined(tab.refresh)){
				tab.refresh();
			}
		}
	}
	
	this.refreshNode = function(){
		tree.refresh();
	}
	
	this.documentUpdateRefresh = function(activate){
		tree.refreshParentNode();
		if(activate){
			var tab = container.getActiveTab();
			if(tab && Ext.isDefined(tab.refresh)){
				tab.refresh();
			}
		}else{
			container.items.each(function(tab){
				if(Ext.isDefined(tab.refresh)){
					tab.refresh();
				}
			});
		}
	}
	
	this.moduleTree = tree;
	this.moduleContainer = container;
	
	Mixky.app.Module.superclass.constructor.call(this, Ext.apply(config, cfg));
    Ext.onReady(this.initModule, this);
};

Ext.extend(Mixky.app.Module, Ext.Panel, {
	closable : true,
	// Module Key
	modulekey : '',
	// 初始化模块
	initModule : Ext.emptyFn,
	// 获得当前视图
	getCurrentView : function(){
		var view = this.moduleContainer.getActiveTab();
		if(view && view.isModuleView){
			return view;
		}
	},
	// private
	beforeCloseMe : function(){
		this.moduleContainer.items.clear();
	},
	// 打开视图
	openView : function(viewkey){
		var panels = this.moduleContainer.findBy(function(p, c){
			if(p.isModuleView && p.viewkey == viewkey){
				return true;
			}
		});
		var panel;
		if(panels.length > 0){
			panel = panels[0];
		}
		if(!panel){
			var view = Mixky.app.Views[viewkey];
			if(!view){
				return;
			}else{
				panel = new Ext.Panel({
					viewkey : view.key,
					title : view.title,
					iconCls : view.icon,
					layout : 'fit',
					listeners : {
						'afterrender' : function(p){
							p.load({
								url : 'framework/engine/view/view.do',
							    params: {panelid : p.getId(), viewkey : view.key},
							    text: '正在装载模块，请稍候...',
								loadScripts : true,
							    scripts: true
							});
						}
					}
				});
				panel.isModuleView = true;
				panel.initParams = view.params;
				this.moduleContainer.add(panel);
			}
		}
		this.moduleContainer.activate(panel);
		return panel;
	},
	openUrl : function(id, url, cfg){
		var panel = this.moduleContainer.getItem(id);
		if(!panel){
			panel = new Ext.Panel(Ext.apply({
				id : id,
				layout : 'fit',
				autoLoad : {
					url : url,
					params : {panelid : id},
					loadScripts : true,
					scripts	: true
				}
			}, cfg));
			this.moduleContainer.add(panel);
		}
		this.moduleContainer.activate(panel);
		return panel;		
	},
	openJspUrl : function(id, url, params, cfg){
		var panel = this.moduleContainer.getItem(id);
		if(!panel){
			panel = new Ext.Panel(Ext.apply({
				id : id,
				layout : 'fit',
				autoLoad : {
					url : 'page.do',
					params : Ext.apply({url:url, panelid : id}, params),
					loadScripts : true,
					scripts	: true
				}
			}, cfg));
			this.moduleContainer.add(panel);
		}
		this.moduleContainer.activate(panel);
		return panel;		
	}
});