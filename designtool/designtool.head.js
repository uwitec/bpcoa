Mixky.designtool.CHead = function(){
	var toolbar = new Ext.Toolbar({
    	items:[{
    		xtype:'buttongroup',
    		title:'view',
    		columns:2,
    		defaults: {
	            scale: 'medium',
	            iconCls: 'icon-designtool-button-default'
	        },
	        items:[{
	        	text:'导航窗口',
	        	scale:'small',
		        iconCls: 'icon-designtool-explorerwin',
	        	xtype:'splitbutton',
	        	iconAlign: 'top',
	        	arrowAlign:'right',
	        	handler:function(){
	        		Mixky.designtool.Actions.outlineDisplay.execute();
		        },
	        	menu: [Mixky.designtool.Actions.outlineShow,Mixky.designtool.Actions.outlineHide]
	        },{
	        	text:'辅助窗口',
	        	scale:'small',
		        iconCls: 'icon-designtool-attributewin',
	        	xtype:'splitbutton',
	        	iconAlign: 'top',
	        	arrowAlign:'right',
	        	menu: [{
	        		text: '隐藏'
	        	},{
	        		text: '显示'
	        	}]
	        }]
    	},{
    		xtype:'buttongroup',
    		title:'outline',
    		columns:3,
    		defaults: {
	            scale: 'small',
	            iconCls: 'icon-designtool-button-default'
	        },
	        items:[
               Mixky.designtool.Actions.Import,
               Mixky.designtool.Actions.ViewJSON,
               Mixky.designtool.Actions.Open,
               Mixky.designtool.Actions.Export,
               Mixky.designtool.Actions.Refresh,
               Mixky.designtool.Actions.Search
	        ]
    	},{
    		xtype:'buttongroup',
    		title:'object',
    		columns:4,
    		defaults: {
	            scale: 'small',
	            iconCls: 'icon-designtool-button-default'
	        },
	        items:[
		        Mixky.designtool.Actions.Add,
		        Mixky.designtool.Actions.Copy,
		        Mixky.designtool.Actions.Delete,
		        Mixky.designtool.Actions.Extends,
		        Mixky.designtool.Actions.Paste,
		        Mixky.designtool.Actions.Save
	        ]
    	},'->',{
    		xtype:'buttongroup',
    		columns:4,
    		defaults: {
	            iconCls: 'icon-designtool-button-default'
        	},
	        items:[
	           Mixky.designtool.Actions.BuildFiles,
               Mixky.designtool.Actions.Theme,
               Mixky.designtool.Actions.Help,
               Mixky.designtool.Actions.Exit
            ]
    	}]
    });
	Mixky.designtool.CHead.superclass.constructor.call( this, {
        border:false,
    	region:'north',
        height:108,
        items: [{
            xtype:'box',
            el:'designtool-head',
            border:false
        },toolbar]
	});
};

Ext.extend( Mixky.designtool.CHead, Ext.Panel, {});