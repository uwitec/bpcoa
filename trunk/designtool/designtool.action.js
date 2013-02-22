// 初始化应用程序动作
Mixky.designtool.Actions = {};

Mixky.designtool.Actions.outlineShow = new Ext.Action({
	text: '显示',
	iconCls:'icon-designtool-checked',
	handler:function(){
		Mixky.designtool.Framework.outlineTree.show();
		Mixky.designtool.Framework.outlineTree.ownerCt.doLayout();
		Mixky.designtool.Actions.outlineShow.setIconClass('icon-designtool-checked');
		Mixky.designtool.Actions.outlineHide.setIconClass('');
	}
});

Mixky.designtool.Actions.outlineHide = new Ext.Action({
	text: '隐藏',
	handler:function(){
		Mixky.designtool.Framework.outlineTree.hide();
		Mixky.designtool.Framework.outlineTree.ownerCt.doLayout();
		Mixky.designtool.Actions.outlineShow.setIconClass('');
		Mixky.designtool.Actions.outlineHide.setIconClass('icon-designtool-checked');
	}
});

Mixky.designtool.Actions.outlineDisplay = new Ext.Action({
	text: '隐藏导航栏',
	iconCls:'icon-designtool-checked',
	handler:function(){
		if(Mixky.designtool.Actions.outlineShow.getIconClass() == 'icon-designtool-checked'){
			Mixky.designtool.Actions.outlineHide.execute();
			Mixky.designtool.Actions.outlineDisplay.setText('显示导航栏');
		}else{
			Mixky.designtool.Actions.outlineShow.execute();
			Mixky.designtool.Actions.outlineDisplay.setText('隐藏导航栏');
		}
	}
});

Mixky.designtool.Actions.Help = new Ext.Action({
	text: '查看帮助',
    scale: 'large',
	iconAlign: 'top',
	iconCls:'icon-designtool-help',
	handler : function(){
		window.open("../dependences/ext-3.1.1/docs/index.html");
	}
});

// 切换界面外观
Mixky.designtool.switchTheme = function(){
	if(this.text == 'defalut'){
		Ext.util.CSS.swapStyleSheet('theme', '../dependences/ext-3.1.1/resources/css/xcheme-blue.css');
	}else{
		Ext.util.CSS.swapStyleSheet('theme', '../resources/xtheme/css/xtheme-' + this.text + '.css');
	}
}

Mixky.designtool.Actions.Theme = new Ext.Action({
	text: '窗口风格',
    scale: 'large',
	iconAlign: 'top',
	iconCls:'icon-designtool-skin',
	xtype:'splitbutton',
	menu:[
	      {text:'default', handler:Mixky.designtool.switchTheme},
	      {text:'black', handler:Mixky.designtool.switchTheme},
	      {text:'calista', handler:Mixky.designtool.switchTheme},
	      {text:'chocolate', handler:Mixky.designtool.switchTheme},
	      {text:'darkgray', handler:Mixky.designtool.switchTheme},
	      {text:'galdaka', handler:Mixky.designtool.switchTheme},
	      {text:'gray', handler:Mixky.designtool.switchTheme},
	      {text:'gray-extend', handler:Mixky.designtool.switchTheme},
	      {text:'green', handler:Mixky.designtool.switchTheme},
	      {text:'indigo', handler:Mixky.designtool.switchTheme},
	      {text:'midnight', handler:Mixky.designtool.switchTheme},
	      {text:'olive', handler:Mixky.designtool.switchTheme},
	      {text:'peppermint', handler:Mixky.designtool.switchTheme},
	      {text:'pink', handler:Mixky.designtool.switchTheme},
	      {text:'purple', handler:Mixky.designtool.switchTheme},
	      {text:'silverCherry', handler:Mixky.designtool.switchTheme},
	      {text:'slate', handler:Mixky.designtool.switchTheme},
	      {text:'slickness', handler:Mixky.designtool.switchTheme},
	      {text:'slickness2', handler:Mixky.designtool.switchTheme}
	]
});

Mixky.designtool.Actions.Exit = new Ext.Action({
	text: '退出系统',
    scale: 'large',
	iconAlign: 'top',
	iconCls:'icon-designtool-exit'
});

Mixky.designtool.Actions.Import = new Ext.Action({
	text: '导入',
	iconCls:'icon-designtool-import',
	isObjectRelated:true
});

Mixky.designtool.Actions.Export = new Ext.Action({
	text: '导出',
	iconCls:'icon-designtool-export',
	isObjectRelated:true
});

Mixky.designtool.Actions.ViewJSON = new Ext.Action({
	text: 'JSON',
	iconCls:'icon-designtool-json',
	isObjectRelated:true
});

Mixky.designtool.Actions.Refresh = new Ext.Action({
	text: '刷新',
	iconCls:'icon-designtool-refresh',
	isObjectRelated:true,
	handler:function(){
		Mixky.designtool.Framework.outlineTree.refresh();
	}
});

Mixky.designtool.Actions.Add = new Ext.Action({
	text:'添加对象',
	xtype:'splitbutton',
    iconCls: 'icon-designtool-add',
	iconAlign: 'top',
	arrowAlign:'right',
	rowspan:2,
	isObjectRelated:true,
	ignoreParentClicks : true,
	menu: new Ext.menu.Menu({id:'add-submenu'})
});

Mixky.designtool.Actions.Open = new Ext.Action({
	text: '打开',
	iconCls:'icon-designtool-open',
	isObjectRelated:true,
	handler:function(){
		var oid = Mixky.designtool.Context.activatedObject;
		if(!oid){
			alert('未指定打开对象');
		}else{
			Mixky.designtool.Framework.outlineTree.selectObject(oid);
			var cmp = Mixky.designtool.Framework.contentPanel.openEditor(oid);
		}
	}
});

Mixky.designtool.Actions.Copy = new Ext.Action({
	text: '复制',
	iconCls:'icon-designtool-copy',
	isObjectRelated:true,
	handler:function(){
		var oid = Mixky.designtool.Context.activatedObject;
		if(!oid){
			alert('未指定复制对象');
			Mixky.designtool.Context.clipboardObject = undefined;
		}else{
			Mixky.designtool.Context.clipboardObject = oid;
		}
		// 刷新菜单
		Mixky.designtool.Class.setActionEnabled();
	}
});

Mixky.designtool.Actions.Rename = new Ext.Action({
	text: '修改键值',
	iconCls:'icon-designtool-rename',
	isObjectRelated:true,
	handler:function(){
		Mixky.designtool.lib.showRenameWindow(function(oldKey, newKey){
			DesignToolDirect.renameObject(oldKey, newKey, function(result, e){
				if(result.success){
					var srckey = result.oldkey;
					var dstkey = result.newkey;
					var mclass = result.mclass;
					if(Mixky.designtool.Framework.outlineTree.renameObject(srckey, dstkey)){
						Mixky.designtool.Context.activateObject({id:dstkey, key:dstkey, mclass:mclass});
						if(Mixky.designtool.Framework.contentPanel.renameObject(srckey)){
							Mixky.designtool.Framework.openObject({id:dstkey, key:dstkey, mclass:mclass});
						}
					}
				}else{
					alert('rename object [' + oldName + '] to [' + newName + '] failed');
				}
			});
		});
	}
});

Mixky.designtool.Actions.CopyPaste = new Ext.Action({
	text: '创建副本',
	iconCls:'icon-designtool-copypaste',
	isObjectRelated:true,
	handler:function(){
		var oid = Mixky.designtool.Context.activatedObject;
		if(!oid){
			alert('未指定创建复制对象');
		}else{
			alert('copy & create object [' + oid.mclass + '][' + oid.key + ']');
			Ext.Msg.prompt('粘帖对象', '请输入新对象键值:', function(btn, newkey){
			    if (btn == 'ok'){
					DesignToolDirect.pasteObject(oid.key, '', newkey, function(result, e){
						if(result.success){
							Mixky.designtool.Framework.outlineTree.refreshParent();
							Mixky.designtool.Context.activateObject({id:result.key, key:result.key, mclass:result.mclass});
							Mixky.designtool.Framework.openObject({id:result.key, key:result.key, mclass:result.mclass});
						}else{
							alert('copy & create object [' + oid.mclass + '][' + oid.key + '] failed');
						}
					});
			    }
			});
		}
	}
});

Mixky.designtool.Actions.Paste = new Ext.Action({
	text: '粘贴',
	iconCls:'icon-designtool-paste',
	isObjectRelated:true,
	handler:function(){
		var srcoid = Mixky.designtool.Context.clipboardObject;
		var dstoid = Mixky.designtool.Context.activatedObject;
		if(!srcoid){
			alert('剪贴板为空');
			return;
		}
		if(!dstoid){
			alert('未指定粘贴对象');
			return;
		}
		Ext.Msg.prompt('粘帖对象', '请输入新对象键值:', function(btn, newkey){
		    if (btn == 'ok'){
				DesignToolDirect.pasteObject(srcoid.key, dstoid.key, newkey, function(result, e){
					if(result.success){
						if(dstoid.mclass == srcoid.mclass){
							Mixky.designtool.Framework.outlineTree.refreshParent();
						}else{
							Mixky.designtool.Framework.outlineTree.refresh();
						}
						Mixky.designtool.Context.activateObject({id:result.key, key:result.key, mclass:result.mclass});
						Mixky.designtool.Framework.openObject({id:result.key, key:result.key, mclass:result.mclass});
					}else{
						alert('paste object [' + srcoid.mclass + '][' + srcoid.key + '] to ' + '[' + dstoid.mclass + '][' + dstoid.key + '] failed');
					}
				});
		    }
		});
	}
});

Mixky.designtool.Actions.Delete = new Ext.Action({
	text: '删除',
	iconCls:'icon-designtool-delete',
	isObjectRelated:true,
	handler:function(){
		var oid = Mixky.designtool.Context.activatedObject;
		if(!oid){
			alert('未指定删除对象');
		}else{
			Ext.MessageBox.confirm('危险操作提示', '删除对象[' + oid.key + ']，该操作不可恢复，您确定吗？', function(btn){
				if(btn == 'yes'){
					DesignToolDirect.deleteObject(oid.key, function(result, e){
						if(result.success){
							Mixky.designtool.Framework.deleteObject(result.key);
						}
					});
				}
			});
		}
	}
});

Mixky.designtool.Actions.Save = new Ext.Action({
	text: '保存',
	iconCls:'icon-designtool-save',
	isObjectRelated:true,
	handler : function(){
		var panel = Mixky.designtool.Framework.contentPanel.getActiveTab();
		if(!panel || panel.items.lenth == 0){
			return false;
		}
		Mixky.designtool.Framework.contentPanel.savePanel(panel.get(0), true);
	}
});

Mixky.designtool.Actions.Apply = new Ext.Action({
	text: '应用',
	iconCls:'icon-designtool-apply',
	isObjectRelated:true,
	handler : function(){
		var panel = Mixky.designtool.Framework.contentPanel.getActiveTab();
		if(!panel || panel.items == 0){
			return false;
		}
		if(panel.items.length == 1){
			Mixky.designtool.Framework.contentPanel.savePanel(panel.get(0), false);
		}else{
			Mixky.designtool.Framework.contentPanel.savePanel(panel.getActiveTab(), false);
		}
	}
});



//生成文件
Mixky.designtool.buildFile = function(){
	var text = this.text;
	MixkyLibDirect.buildJsFile(text, function(){
		Ext.MessageBox.alert('操作提示！', '生成[' + text + ']文件完毕！');
	});
}


//模块下级对象关联补丁
Mixky.designtool.fixModuleChildrenBugPatch = function(){
	PatchDirect.fixModuleChildrenBugPatch(function(){
		Ext.MessageBox.alert('操作提示！', '模块下级对象关联补丁执行完毕！');
	});
}

Mixky.designtool.Actions.BuildFiles = new Ext.Action({
	text: '生成文件',
 scale: 'large',
	iconAlign: 'top',
	iconCls:'icon-designtool-skin',
	xtype:'splitbutton',
	menu:[
	      {text:'all', handler:Mixky.designtool.buildFile, tooltip:'生成所有客户端脚本'},
	      {text:'designclass', handler:Mixky.designtool.buildFile, tooltip:'生成定制端对象格式描述'},
	      {text:'common', handler:Mixky.designtool.buildFile, tooltip:'生成应用端通用JS脚本'},
	      {text:'desktop', handler:Mixky.designtool.buildFile, tooltip:'生成应用端桌面JS脚本'},
	      {text:'dictionary', handler:Mixky.designtool.buildFile, tooltip:'生成应用端数据字典JS脚本'},
	      {text:'document', handler:Mixky.designtool.buildFile, tooltip:'生成应用端文档定义JS脚本'},
	      {text:'menu', handler:Mixky.designtool.buildFile, tooltip:'生成应用端菜单及桌面按钮JS脚本'},
	      {text:'module', handler:Mixky.designtool.buildFile, tooltip:'生成应用端模块定义JS脚本'},
	      {text:'view', handler:Mixky.designtool.buildFile, tooltip:'生成应用端视图定义JS脚本'},
	      {text:'workflow', handler:Mixky.designtool.buildFile, tooltip:'生成应用端流程定义JS脚本'},
	      {text:'icon', handler:Mixky.designtool.buildFile, tooltip:'生成应用端图标样式CSS文件'},
	      {text:'Module children patch', handler:Mixky.designtool.fixModuleChildrenBugPatch, tooltip:'模块下级对象关联补丁'}
	]
});

Mixky.designtool.Actions.Search = new Ext.Action({
	text: '查找',
	iconCls:'icon-designtool-search'
});

Mixky.designtool.Actions.Extends = new Ext.Action({
	text:'扩展功能',
	xtype:'splitbutton',
    iconCls: 'icon-designtool-modulefunction',
	isObjectRelated:true,
    iconAlign: 'top',
	arrowAlign:'right',
	rowspan:2,
	ignoreParentClicks : true,
	menu: new Ext.menu.Menu({id:'extends-menu'})
});