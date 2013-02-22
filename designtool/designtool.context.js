// 初始化应用程序上下文
Mixky.designtool.Context = {};
// 切换客户端选中的对象
Mixky.designtool.Context.activateObject = function(oid, cmp){
	// oid ：描述客户端实例的基本信息{id,key,mclass}
	// cmp ：当前选中对象的容器实例
	if(!oid){
		Mixky.designtool.Context.activatedObject = undefined;
	}else if(Mixky.designtool.Context.activatedObject && 
			oid.key == Mixky.designtool.Context.activatedObject.key && 
			oid.mclass == Mixky.designtool.Context.activatedObject.mclass){
		return;
	}else{
		Mixky.designtool.Context.activatedObject = oid;
		Mixky.designtool.Class.setActionEnabled(cmp);
		Mixky.designtool.Framework.activateObject(oid);
	}
};
// 初始化客户端对象定义
Mixky.designtool.Class = {
	defaultProperties : [
	    {
	    	name:'f_i_parent', 
	    	text:'parent', 
	    	xeditor:'none', 
	    	note:'所属对象，对象的父对象。'
	    },{
	    	name:'f_class', 
	    	text:'Class', 
	    	xeditor:'none', 
	    	note:'对象类，描述对象的类型。'
	    },{
	    	name:'f_key', 
	    	text:'Key', 
	    	xeditor:'none', 
	    	note:'对象Key，唯一标识对象。'
	    },{
	    	name:'f_name', 
	    	text:'命名', 
	    	xeditor:'string', 
	    	note:'对象命名，一般为对象的英文名称。'
	    },{
	    	name:'f_caption', 
	    	text:'名称', 
	    	xeditor:'string', 
	    	note:'对象名称，一般为对象的中文名称。'
	    },{
	    	name:'f_config', 
	    	text:'配置', 
	    	xeditor:'jsonobject', 
	    	note:'对象配置，用JSON格式配置对象的相关参数，不同的对象有不同的解析参数。'
	    },{
	    	name:'f_note', 
	    	text:'说明', 
	    	xeditor:'textbox', 
	    	note:'对象说明，说明该对象的定义、用途等描述信息。'
	    }
	],
	modules : [],
	// 注册客户端对象定义
	registeModule : function(module){
		if(module){
			this.modules.push(module);
		}
	},
	// 获得客户端对象定义
	getModule : function(name){
		for(var i=0;i<this.modules.length;i++){
			if(this.modules[i].name == name){
				return this.modules[i];
			}
		}
	},
	// 设置操作是否可用
	setActionEnabled : function(cmp){
		for(a in Mixky.designtool.Actions){
			if(Mixky.designtool.Actions[a].initialConfig.isObjectRelated){
				Mixky.designtool.Actions[a].setDisabled(true);
			}
			if(Mixky.designtool.Actions[a].menu){
				Mixky.designtool.Actions[a].menu.items.removeAll();
			}
		}
		var oid = Mixky.designtool.Context.activatedObject;
		if(!oid){
			return;
		}
		// 设置通用菜单
		Mixky.designtool.Actions.Open.setDisabled(false);
		Mixky.designtool.Actions.Refresh.setDisabled(false);
		// 清除所有添加菜单项
		var addSubMenu = Ext.menu.MenuMgr.get('add-submenu');
		addSubMenu.removeAll();
		// 清除所有扩展菜单项
		var extendsMenu = Ext.menu.MenuMgr.get('extends-menu');
		extendsMenu.removeAll();
		// 获得模块定义
		var module = this.getModule(oid.mclass);
		if(!module){
			return;
		}
		// 设置“JSON”相关菜单
		if(module.jsonable){
			Mixky.designtool.Actions.Import.setDisabled(false);
			Mixky.designtool.Actions.Export.setDisabled(false);
			Mixky.designtool.Actions.ViewJSON.setDisabled(false);
		}
		// 设置“添加”菜单
		if(module.subModules && module.subModules.length > 0){
			Mixky.designtool.Actions.Add.setDisabled(false);
			for(var i=0;i<module.subModules.length;i++){
				var m = this.getModule(module.subModules[i]);
				if(m != undefined){
					addSubMenu.add({
						text : m.text,
						module : m,
						iconCls : m.iconCls,
						handler	: function(){
							var m = this.initialConfig.module;
							Mixky.designtool.lib.addDesignObject(oid.key, m.name,function(newkey, mclass){
								if(Mixky.designtool.Framework.outlineTree.refresh()){
									Mixky.designtool.Context.activateObject({id:newkey, key:newkey, mclass:mclass});
								}
								Mixky.designtool.Framework.openObject({id:newkey, key:newkey, mclass:mclass});
							});
						}
					});
				}
			}
		}
		// 设置删除菜单
		if(module.deletable){
			Mixky.designtool.Actions.Rename.setDisabled(false);
			Mixky.designtool.Actions.Delete.setDisabled(false);
		}
		// 设置复制菜单
		if(module.copyable){
			Mixky.designtool.Actions.Copy.setDisabled(false);
			Mixky.designtool.Actions.CopyPaste.setDisabled(false);
		}
		// 设置粘贴菜单
		if(Mixky.designtool.Context.clipboardObject){
			if(module.subModules){
				for(var i=0;i<module.subModules.length;i++){
					if(module.subModules[i] == 'all' || Mixky.designtool.Context.clipboardObject.mclass == module.subModules[i]){
						Mixky.designtool.Actions.Paste.setDisabled(false);
						break;
					}
				}
			}
		}
		// 设置扩展功能菜单
		if(module.extendsMenu && module.extendsMenu.length>0){
			Mixky.designtool.Actions.Extends.setDisabled(false);
			extendsMenu.add(module.extendsMenu);
		}
	}
};
