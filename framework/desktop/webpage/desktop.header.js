Mixky.desktop.Header = function(config){
	
	this.toolbar = new Ext.Toolbar({
    	items:this.getToolbarItems()
    });
	
	var el = Ext.getBody().createChild({
		id : 'x-webpage-header',
		tag : 'div'
	});

	el.load({
		url : 'head.do',
		scripts: true
	});
	
	var height = this.getHeaderHeight();
	
	Mixky.desktop.Header.superclass.constructor.call( this, Ext.apply({
        border:false,
    	region:'north',
        height:height,
        minHeight:height,
        maxHeight:height,
        hideCollapseTool : true,
        collapsible: true,
        split : true,
        collapseMode:'mini',
        items: [{
            xtype : 'box',
            el : el,
            height : 36,
            border : false
        }, this.toolbar]
	}, config));
};

Ext.extend( Mixky.desktop.Header, Ext.Panel, {
	getHeaderHeight : function(){
		var height = 116;
		if(MixkyApp.userConfig.toolBarShowIconMode == 2){
			height = 96
		}
		if(Ext.isIE || Ext.isChrome){
			height = height - 4;
		}
		return height;
	},
	// private
	getToolbarItems : function(){
	
		this.winsButton = new Mixky.desktop.TaskBar();
		
		this.appendWindow = function(win){
			this.winsButton.appendWindow(win);
		}
		this.removeWindow = function(win){
			this.winsButton.removeWindow(win);
		}
		
		this.quickButton = new Mixky.desktop.QuickBar();
	
		var items = [];
		
		var mode = MixkyApp.userConfig.toolBarShowIconMode;
		if(!mode){
			mode = 0;
		}
		
		var menus = MixkyApp.menus;
		var getChildMenu = function(menuCfg){
			var items = [];
	    	for(var i=0;i<menuCfg.items.length;i++){
	    		var btn = {
	            	name : menuCfg.items[i].name,
	        	    scale : mode == 1 ? 'small' : 'medium',
	    	        iconAlign : mode == 0 ? 'top' : 'left',
	            	iconCls : menuCfg.items[i].iconCls + '24',
	            	handler : MixkyApp.handlerMenu
	    		}
	    		if(mode == 2){
	    			btn.tooltip = menuCfg.items[i].text
	    		}else{
	    			btn.text = menuCfg.items[i].text
	    		}
	    		items.push(btn);
	    	}
	    	return items;
		}
		for(var i=0;i<menus.length;i++){
			if(Ext.isDefined(menus[i].items)){
				items.push({
					xtype: 'buttongroup',
					title : menus[i].text,
					columns : mode == 1 ? menus[i].items.length / 2 : menus[i].items.length,
					items : getChildMenu(menus[i])
				});
			}else{
				items.push({
					xtype: 'buttongroup',
					scale : 'medium',
					title : menus[i].text,
					columns : 1,
					items : [{
		        		text : menus[i].text,
		        		name : menus[i].name,
		        		iconAlign : mode == 0 ? 'top' : 'left',
		        		iconCls : menus[i].iconCls + '24',
		        		handler : MixkyApp.handlerMenu
		    		}]
				});
			}
		}
		items.push('->');
	
		var exitBtn = {
			text : mode == 2 ? undefined : '退出系统',
			tooltip : mode == 2 ? '退出系统' : undefined,
		    scale : 'medium',
			iconAlign : 'top',
			iconCls :'icon-sys-exit24',
			handler : function(){
				Ext.Msg.confirm('退出警告','退出系统，该操作将放弃所有未保存数据，您确定吗？',function(btn){
					if(btn == 'yes')
					{
						window.location = "logout.do";
					}
				});
			}
		};
		items.push( {
			xtype : 'buttongroup',
			title : '系统功能',
			columns : 3,
	        items:[
	           this.quickButton,
	           //Mixky.app.Actions.getIconSizeAction(Mixky.app.Actions.ShowDesktop, 24),
	           this.winsButton,
	           //Mixky.app.Actions.getIconSizeAction(Mixky.app.Actions.Help, 24),
	           exitBtn
	        ]
		});
		return items;
	},
	setIconMode : function(){
		this.toolbar.removeAll();
		this.toolbar.add(this.getToolbarItems());
		this.toolbar.doLayout();
		
		var height = this.getHeaderHeight();
		this.setHeight(height);
		this.ownerCt.getLayout().north.maxSize = height;
		this.ownerCt.doLayout();
	}
});