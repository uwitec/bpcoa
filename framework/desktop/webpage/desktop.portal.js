Mixky.desktop.Portal = function(config){
	this.buttonPanel = new Ext.Panel({
        region:'west',
	    border : false,
	    bodyStyle : 'background:transparent none',
        width : 15
	});
	var panelItems;
	switch(MixkyApp.userConfig.columns){
	case 2:
		panelItems = [{
            columnWidth:.5,
            style:'padding:10px 0 10px 10px'
        },{
            columnWidth:.5,
            style:'padding:10px 10px 10px 10px'
        }]
		break;
	case 4:
		panelItems = [{
            columnWidth:.25,
            style:'padding:10px 0 10px 10px'
        },{
            columnWidth:.25,
            style:'padding:10px 0 10px 10px'
        },{
            columnWidth:.25,
            style:'padding:10px 0 10px 10px'
        },{
            columnWidth:.25,
            style:'padding:10px 10px 10px 10px'
        }]
		break;
	default :
		panelItems = [{
            columnWidth:.33,
            style:'padding:10px 0 10px 10px'
        },{
            columnWidth:.33,
            style:'padding:10px 0 10px 10px'
        },{
            columnWidth:.34,
            style:'padding:10px 10px 10px 10px'
        }]
		break;
	}
	this.portalPanel = new Ext.ux.Portal({
        region:'center',
	    bodyStyle : 'background:transparent none',
    	border : false,
        items:panelItems
	});
	
	this.portalPanel.on('drop', function(){
		this.setPortletsPos();
	}, this)
	Mixky.desktop.Portal.superclass.constructor.call( this, Ext.apply({
		title : '我的桌面',
	    border : true,
	    layout : 'border',
	    items : [this.buttonPanel, this.portalPanel],
		iconCls : 'icon-sys-portal'
	}, config));
	
	this.contextmenu = new Ext.menu.Menu({
		items : [
	      Mixky.app.Actions.Preferences,
	      Mixky.app.Actions.SavePreferences,
	      Mixky.app.Actions.DelPreferences,
	      Mixky.app.Actions.SaveAsDefaultPreferences,
	      '-',
	      Mixky.app.Actions.ChangePassword,
	      '-',
	      Mixky.app.Actions.DesignTool,
	      Mixky.app.Actions.Help,
	      '-',
	      Mixky.app.Actions.Exit,
	      '-',
	      Mixky.app.Actions.ShowDayTips,
	      Mixky.app.Actions.About
		]
	});
	
	this.buttonPanel.on('afterrender', function(bp){
		this.shortcuts = new Mixky.desktop.Shortcuts({
    		renderTo : bp.body
        });	
		this.shortcuts.on('columnsrefresh', function(width){
			this.buttonPanel.setWidth(width);
			this.doLayout();
		}, this, { delay: 100 });
	}, this);
};

Ext.extend( Mixky.desktop.Portal, Ext.Panel, {
    // overwrite
    onRender : function(ct, position){
    	Mixky.desktop.Portal.superclass.onRender.call(this, ct, position);
    	this.body.on('contextmenu', function(e){
        	if(e.target.id == this.buttonPanel.body.id || 
        			e.target.id == this.portalPanel.body.id || 
        			e.target.id == this.portalPanel.body.first().id){
    	    	e.stopEvent();
    			if(!this.contextmenu.el){
    				this.contextmenu.render();
    			}
    			var xy = e.getXY();
    			xy[1] -= this.contextmenu.el.getHeight();
    			this.contextmenu.showAt(xy);
    		}
    	}, this);	
    },
    getMinHeightCol : function(){
    	var height = 10000;
    	var index = 0;
		this.portalPanel.items.each(function(columnitem, col){
			if(columnitem.getHeight() < height){
				height = columnitem.getHeight();
				index = col;
			}
		}, this);
		return index;
    },
    // extend method
	addSubject : function(o){
		var panel = Ext.getCmp('portlet-' + o.key);
		if(!panel){
			var col = Ext.isDefined(o.col) ? o.col : this.getMinHeightCol();
			col = col % MixkyApp.userConfig.columns;
			panel = new Ext.ux.Portlet({
				id : 'portlet-' + o.key,
	    		title : o.text,
	    		layout : 'fit',
	    		iconCls : o.iconCls,
	    		height : o.webheight,
				tools : [{
					id : 'refresh',
					handler : function(){
						panel.refresh();
					},
					qtip : "刷新栏目内容"
				}],
				autoLoad : {
					url : "portlet.do",
					params : {key : o.key},
					scripts : true
				},
				refresh : function(){
					panel.doAutoLoad();
				}
	    	});
			this.portalPanel.items.get(col).add(panel);
			this.portalPanel.doLayout();
			panel.key = o.key;
		}
		return panel;
	},
    // extend method
	removeSubject : function(key){
		var panel = Ext.getCmp('portlet-' + key);
		if(panel){
			var pc = panel.findParentByType('portalcolumn');
			pc.remove(panel);
			//panel.destroy();
		}
	},
    // extend method
	addShortcut : function(o){
		o.handler = function(b, e){
			MixkyApp.executeAction(this.btntype, this.key, e);
		}
		this.shortcuts.addShortcut(o);
	},
    // extend method
	removeShortcut : function(btntype, key){
		var btn = this.shortcuts.getButtonCmp(btntype, key);
		if(btn){
			this.shortcuts.removeShortcut(btn);
		}
	},
	getButtonCmp : function(btntype, key){
		return this.shortcuts.getButtonCmp(btntype, key);
	},
	setPortletsPos : function(){
		this.portalPanel.items.each(function(columnitem, col){
			columnitem.items.each(function(panel, row){
				var subject = MixkyApp.getSubject(panel.key);
    			subject.col  = col;
    			subject.row  = row;
			},this);
		}, this);
	}
});