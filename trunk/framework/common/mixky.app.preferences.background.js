
Ext.namespace("Mixky.app.common");

Mixky.app.common.PreferencesBackground = function(){
	var store = new Ext.data.DirectStore({
		directFn : DesktopAppDirect.getWallpapers,
		paramOrder:[],
		root : 'results',
		totalProperty : 'totals',
		idProperty : 'path',
		fields:[
		    {name:'id', mapping:'id'},
		    {name:'thumbnail', mapping:'thumbnail'},
		    {name:'path', mapping:'path'},
		    {name:'delflag', mapping:'delflag'}
		]
	});
	var tpl = new Ext.XTemplate(
		'<tpl for=".">',
			'<div class="pref-view-thumb-wrap" id="{id}">',
				'<div class="pref-view-thumb"><img width=103 src="{thumbnail}" title="{id}" /></div>',
			'<span>{shortName}</span></div>',
		'</tpl>',
		'<div class="x-clear"></div>'
	);
	
	var view = new Ext.DataView({
		autoHeight:true,
    	anchor : '-20',
		emptyText : '没有可供选择的墙纸',
		itemSelector :'div.pref-view-thumb-wrap',
		loadingText : 'loading...',
		singleSelect : true,
		overClass : 'x-view-over',
		prepareData : function(data){
			data.shortName = Ext.util.Format.ellipsis(data.id, 17);
			return data;
		},
		store : store,
		tpl : tpl,
		contextMenu: new Ext.menu.Menu({items:[{
			text: '删除',
			iconCls : 'icon-sys-delete',
			handler: function() {
				var record = view.getSelectedRecords()[0];
				DesktopAppDirect.deleteWallPaper(record.get('path'), record.get('thumbnail'), function(result, e) {
					if(result && result.success) {
						store.reload();
					} else {
						Ext.Msg.alert('信息提示', '删除失败！');
					}
				});
			}
		}]}),
		listeners:{
			contextmenu:function(view, index, node, e){
				var record = view.store.getAt(index);
				if (record.get('delflag') == true) {
					view.select(node);
					this.contextMenu.showAt(e.getXY());
				}
			}
		}
	});
	view.on('dblclick', function(v, index, node, e){
		var record = v.store.getAt(index);
		if(record && record.get('path')){
			MixkyApp.setWallpaper(record.get('path'));
		}
	});
	store.on('load', function(s, records){
		if(records){
			var t = MixkyApp.userConfig.wallpaper;
			if(t){
				view.select(t);
			}
		}
	}, this);

	var wpTile = new Ext.form.Radio({
		checked : MixkyApp.userConfig.wallpaperposition == 'tile',
		name : 'wallpaperposition',
		boxLabel : '平铺方式',
		x : 15,
		y : 90
	});
	wpTile.on('check', function(checkbox, checked){
		if(checked){
			MixkyApp.userConfig.wallpaperposition = 'tile';
		}
	});
	var wpCenter = new Ext.form.Radio({
		checked : MixkyApp.userConfig.wallpaperposition == 'center',
		name : 'wallpaperposition',
		boxLabel : '居中显示',
		x: 110,
		y: 90
	});
	wpCenter.on('check', function(checkbox, checked){
		if(checked){
			MixkyApp.userConfig.wallpaperposition = 'center';
		}
	});
	
	var transparencySlider = new Ext.Slider({
		minValue : 0, 
		maxValue : 100, 
		width : 100, 
		value : MixkyApp.userConfig.transparency,
		x : 200, 
		y : 40
	});

	var transparencyField =  new Ext.form.NumberField({
		cls : 'x-field-percent', 
		enableKeyEvents : true, 
		maxValue : 100, 
		minValue : 0, 
		width : 45, 
		value : MixkyApp.userConfig.transparency,
		x : 200, 
		y : 70
	});

	var transparencyUpdateHandler = new Ext.util.DelayedTask(MixkyApp.setTransparency, MixkyApp);
	
	function transparencyHandler(){
		var v = transparencySlider.getValue();
		transparencyField.setValue(v);
		transparencyUpdateHandler.delay(100, null, null, [v]); // delayed task prevents IE bog
	}
	
	transparencySlider.on({
		'change': transparencyHandler, 
		'drag': transparencyHandler
	});
	
	transparencyField.on({
		'keyup': {
			fn: function(field){
				var v = field.getValue();
				if(v !== '' && !isNaN(v) && v >= field.minValue && v <= field.maxValue){
					transparencySlider.setValue(v);
				}
			}, 
			buffer: 350
		}
	});
	

    function onChangeBackgroundColor(){
    	var dialog = new Ext.ux.ColorDialog({
			border: false, 
			closeAction: 'close', 
			listeners: {
				'select': { fn: onBackgroundColorSelect, scope: this, buffer: 350 }
			}, 
			resizable: false, 
			title: 'Color Picker'
		});
		dialog.show(MixkyApp.userConfig.backgroundcolor);
    }
    
    function onBackgroundColorSelect(p, hex){
    	MixkyApp.setBackgroundColor(hex);
	}
	
	function onChangeFrontColor(){
    	var dialog = new Ext.ux.ColorDialog({
			border: false, 
			closeAction: 'close', 
			listeners: {
				'select': { fn: onFrontColorSelect, scope: this, buffer: 350 }
			}, 
			resizable: false, 
			title: 'Color Picker'
		});
		dialog.show(MixkyApp.userConfig.frontcolor);
    }
	
	function onFrontColorSelect(p, hex){
		MixkyApp.setFrontColor(hex);
	}
	
	var formPanel = new Ext.FormPanel({
		border : false,
		height : 140,
		layout : 'absolute',
		items : [{
			border: false,
			items: {border: false, html:'选择墙纸显示方式：'},
			x: 15,
			y: 15
		},{
			border: false,
			items: {border: false, html: '<img border=0 src="resources/images/app/wallpaper-tile.png" width="64" height="44" border="0" alt="" />'},
			x: 15,
			y: 40
		}, wpTile,{
			border: false,
			items: {border: false, html: '<img border=0 src="resources/images/app/wallpaper-center.png" width="64" height="44" border="0" alt="" />'},
			x: 110,
			y: 40
		}, wpCenter, {
			border: false,
			items: {border: false, html:'设置任务栏透明度：'},
			x: 200,
			y: 15
		}, transparencySlider, transparencyField, {
			border: false,
			items: {border: false, html:'设置颜色：'},
			x: 330,
			y: 15
		}, new Ext.Button({
			handler : onChangeFrontColor,
			text : '设置前景色',
			x : 330,
			width : 100,
			y : 50
		}), new Ext.Button({
			handler: onChangeBackgroundColor,
			text : '设置背景色',
			width : 100,
			x : 330,
			y : 80
		}), new Mixky.plugins.UploadButton({
			text:'上传背景图片',
			iconCls:'icon-sys-upload',
			width : 100,
			x : 330,
			y : 110,
			uploadConfig : {
				upload_url : 'servlet/wallpaper.img.upload',
				post_params : {
					userkey: Mixky.app.UserInfo.login
				},
				single_select : true,
				file_types: "*.jpg",
				file_types_description: "JPG文件",
				listeners : {
					'allUploadsComplete' : function(){
						store.reload();
					}
				}
			}
		})]
	});

	var panel = new Ext.Panel({
		title : '背景设置',
        iconCls : 'icon-sys-background',
        padding : '5px',
        items : [{
        	xtype : 'panel',
			autoScroll: true,
        	height : 250,
        	layout : 'anchor',
			bodyStyle : 'padding:10px',
			border : true,
        	items : view
        }, formPanel]
	});
	
	store.load();
	return panel;
}