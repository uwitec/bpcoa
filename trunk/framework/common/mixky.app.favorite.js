Ext.namespace("Mixky.app.common");

Mixky.app.common.favoriteStore = {};

Mixky.app.common.showFavoriteById = function(store, srckey){
	if(!Ext.isDefined(Mixky.app.common.favoriteStore[srckey])){
		FavoriteAppDirect.getUserFavorites(srckey, function(result, e){
			if(result && result.success){
				Mixky.app.common.favoriteStore[srckey] = result.favorites;
				Mixky.app.common.showFavoriteById(store, srckey);
			}
		});
	}else{
		var a = Mixky.app.common.favoriteStore[srckey];
		for(var i=0;i<store.getCount();i++){
			var record = store.getAt(i);
			for(var j=0;j<a.length;j++){
				if(a[j] == record.get("ID")){
					record.set("F_FAVORITE_FLAG", 1);
					record.commit();
					break;
				}
			}
		}
	}
};

Mixky.app.common.updateFavorite = function(srckey, srcparam, title, value, fn){
	FavoriteAppDirect.updateFavorite(srckey, srcparam.toString(), title, value, function(result, e){
		if(result && result.success){
			var a = Mixky.app.common.favoriteStore[srckey];
			if(value == 1){
				MixkyApp.showInfoMessage(title + '成功添加到收藏夹!', '操作提示');
				if(Ext.isDefined(a)){
					// 更新到本地缓存
					a[a.length] = srcparam;
				}
			}else{
				for(var i=0;i<a.length;i++){
					if(a[i] == srcparam){
						// 从本地缓存中移除
						a.removeAt(i);
						break;
					}
				}
			}
			fn.call(this, true);
		}else{
    		MixkyApp.showErrorMessage('收藏夹操作失败!', '错误提示');
		}
	})
}

Mixky.app.common.addFavoriteTag = function(){
	Ext.Msg.prompt('添加收藏夹标签', '请输入标签名称:', function(btn, text){
	    if (btn == 'ok' && text != ''){
	    	DocumentAppDirect.submitRowForm('mkFavorite.T_MK_APP_FAVORITE_TAG.frmFavoriteTagEdit', {F_NAME:text}, function(result, e){
				if(result && result.success){
					var m = MixkyApp.desktop.getModule('mkFavorite');
					if(m){
						m = MixkyApp.desktop.openModule('mkFavorite');
						m.refresh(true, false);
					}
					MixkyApp.desktop.openModule('mkFavorite').refresh(true, false);
				}else{
					MixkyApp.showDirectActionFail("添加【" + text + "】标签失败", result, e);
				}
	    	})
	    }
	});
}

Mixky.app.common.addFavoriteUrl = function(){
	Ext.Msg.prompt('添加网址收藏', '请输入收藏的网址:', function(btn, text){
	    if (btn == 'ok' && text != ''){
	    	FavoriteAppDirect.createFavoriteUrl(text, function(result, e){
				if(result && result.success){
					MixkyApp.desktop.openDocument("mkFavorite.docFavorite", result.id);
				}else{
					MixkyApp.showDirectActionFail("添加网址收藏【" + text + "】失败", result, e);
				}
	    	})
	    }
	});
}

Mixky.app.common.openFavorite = function(srckey, srcparam){
	var dt = Mixky.app.DocumentTypes[srckey];
	if(!dt){
		var doc = Mixky.app.Documents[srckey];
		if(!doc){
			MixkyApp.showErrorMessage('找不到收藏项类型【' + srckey + '】定义，打开操作失败，!', '错误提示');
		}else{
			MixkyApp.desktop.openDocument(srckey, srcparam);
		}
		return;
	}
	switch(dt.type){
	case 0:		// 自定义收藏项
		if(Ext.isDefined(dt.handler)){
			dt.handler(srcparam);
		}
		break;
	case 1:		// 文档收藏项
		MixkyApp.desktop.openDocument(dt.param, srcparam);
		break;
	case 2:		// URL收藏项
		var favoriteUrl = srcparam;
		var pos = favoriteUrl.indexOf('://');
		if (pos == -1) {
			favoriteUrl = "http://" + favoriteUrl;
		}
		window.open(favoriteUrl);
		break;
	}
}