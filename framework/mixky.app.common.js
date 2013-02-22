
//=================================================================
//	�ļ�����ext-base-ajax.js
//=================================================================
/*!
 * Ext JS Library 3.1.1
 * Copyright(c) 2006-2010 Ext JS, LLC
 * licensing@extjs.com
 * http://www.extjs.com/license
 */
/*
* Portions of this file are based on pieces of Yahoo User Interface Library
* Copyright (c) 2007, Yahoo! Inc. All rights reserved.
* YUI licensed under the BSD License:
* http://developer.yahoo.net/yui/license.txt
*/
Ext.lib.Ajax = function() {     
    var activeX = ['MSXML2.XMLHTTP.3.0',
                   'MSXML2.XMLHTTP',
                   'Microsoft.XMLHTTP'],
        CONTENTTYPE = 'Content-Type';
                   
    // private
    function setHeader(o) {
        var conn = o.conn,
            prop;
        
        function setTheHeaders(conn, headers){
            for (prop in headers) {
                if (headers.hasOwnProperty(prop)) {
                    conn.setRequestHeader(prop, headers[prop]);
                }
            }   
        }       
        
        if (pub.defaultHeaders) {
            setTheHeaders(conn, pub.defaultHeaders);
        }

        if (pub.headers) {
            setTheHeaders(conn, pub.headers);
            delete pub.headers;                
        }
    }    
    
    // private
    function createExceptionObject(tId, callbackArg, isAbort, isTimeout) {          
        return {
            tId : tId,
            status : isAbort ? -1 : 0,
            statusText : isAbort ? 'transaction aborted' : 'communication failure',
            isAbort: isAbort,
            isTimeout: isTimeout,
            argument : callbackArg
        };
    }  
    
    // private 
    function initHeader(label, value) {         
        (pub.headers = pub.headers || {})[label] = value;                       
    }
    
    // private
    function createResponseObject(o, callbackArg) {
        var headerObj = {},
            headerStr,              
            conn = o.conn,
            t,
            s;

        try {
            headerStr = o.conn.getAllResponseHeaders();   
            Ext.each(headerStr.replace(/\r\n/g, '\n').split('\n'), function(v){
                t = v.indexOf(':');
                if(t >= 0){
                    s = v.substr(0, t).toLowerCase();
                    if(v.charAt(t + 1) == ' '){
                        ++t;
                    }
                    headerObj[s] = v.substr(t + 1);
                }
            });
        } catch(e) {}
                    
        return {
            tId : o.tId,
            status : conn.status,
            statusText : conn.statusText,
            getResponseHeader : function(header){return headerObj[header.toLowerCase()];},
            getAllResponseHeaders : function(){return headerStr},
            responseText : conn.responseText,
            responseXML : conn.responseXML,
            argument : callbackArg
        };
    }
    
    // private
    function releaseObject(o) {
        o.conn = null;
        o = null;
    }        
    
    // private
    function handleTransactionResponse(o, callback, isAbort, isTimeout) {
        if (!callback) {
            releaseObject(o);
            return;
        }

        var httpStatus, responseObject;

        try {
            if (o.conn.status !== undefined && o.conn.status != 0) {
                httpStatus = o.conn.status;
            }
            else {
                httpStatus = 13030;
            }
        }
        catch(e) {
            httpStatus = 13030;
        }

        if ((httpStatus >= 200 && httpStatus < 300) || (Ext.isIE && httpStatus == 1223)) {
            responseObject = createResponseObject(o, callback.argument);
            if (callback.success) {
                if (!callback.scope) {
                    callback.success(responseObject);
                }
                else {
                    callback.success.apply(callback.scope, [responseObject]);
                }
            }
        }
        else {
            switch (httpStatus) {
                case 12002:
                case 12029:
                case 12030:
                case 12031:
                case 12152:
                case 13030:
                    responseObject = createExceptionObject(o.tId, callback.argument, (isAbort ? isAbort : false), isTimeout);
                    if (callback.failure) {
                        if (!callback.scope) {
                            callback.failure(responseObject);
                        }
                        else {
                            callback.failure.apply(callback.scope, [responseObject]);
                        }
                    }
                    break;
                default:
                    responseObject = createResponseObject(o, callback.argument);
                    if (callback.failure) {
                        if (!callback.scope) {
                            callback.failure(responseObject);
                        }
                        else {
                            callback.failure.apply(callback.scope, [responseObject]);
                        }
                    }
            }
        }

        releaseObject(o);
        responseObject = null;
    }  
    
    // private
    function handleReadyState(o, callback){
    callback = callback || {};
        var conn = o.conn,
            tId = o.tId,
            poll = pub.poll,
            cbTimeout = callback.timeout || null;

        if (cbTimeout) {
            pub.timeout[tId] = setTimeout(function() {
                pub.abort(o, callback, true);
            }, cbTimeout);
        }

        poll[tId] = setInterval(
            function() {
                if (conn && conn.readyState == 4) {
                    clearInterval(poll[tId]);
                    poll[tId] = null;

                    if (cbTimeout) {
                        clearTimeout(pub.timeout[tId]);
                        pub.timeout[tId] = null;
                    }

                    handleTransactionResponse(o, callback);
                }
            },
            pub.pollInterval);
    }
    
    // private
    function asyncRequest(method, uri, callback, postData) {
        var o = getConnectionObject() || null;

        if (o) {
            o.conn.open(method, uri, true);

            if (pub.useDefaultXhrHeader) {                    
                initHeader('X-Requested-With', pub.defaultXhrHeader);
            }

            if(postData && pub.useDefaultHeader && (!pub.headers || !pub.headers[CONTENTTYPE])){
                initHeader(CONTENTTYPE, pub.defaultPostHeader);
            }

            if (pub.defaultHeaders || pub.headers) {
                setHeader(o);
            }

            handleReadyState(o, callback);
            o.conn.send(postData || null);
        }
        return o;
    }
    
    // private
    function syncRequest(method, uri, callback, postData) {
        var o = getConnectionObject() || null;
        
        if (o) {
            o.conn.open(method, uri, false);

            if (pub.useDefaultXhrHeader) {                    
                initHeader('X-Requested-With', pub.defaultXhrHeader);
            }

            if(postData && pub.useDefaultHeader && (!pub.headers || !pub.headers[CONTENTTYPE])){
                initHeader(CONTENTTYPE, pub.defaultPostHeader);
            }

            if (pub.defaultHeaders || pub.headers) {
                setHeader(o);
            }

            o.conn.send(postData || null);
            handleTransactionResponse(o, callback);
        }
        return o;
    }
    
    // private
    function getConnectionObject() {
        var o;          

        try {
            if (o = createXhrObject(pub.transactionId)) {
                pub.transactionId++;
            }
        } catch(e) {
        } finally {
            return o;
        }
    }
       
    // private
    function createXhrObject(transactionId) {
        var http;
            
        try {
            http = new XMLHttpRequest();                
        } catch(e) {
            for (var i = 0; i < activeX.length; ++i) {              
                try {
                    http = new ActiveXObject(activeX[i]);                        
                    break;
                } catch(e) {}
            }
        } finally {
            return {conn : http, tId : transactionId};
        }
    }
         
    var pub = {
        request : function(method, uri, cb, data, options) {
            if(options){
                var me = this,              
                    xmlData = options.xmlData,
                    jsonData = options.jsonData,
                    hs;
                    
                Ext.applyIf(me, options);           
                
                if(xmlData || jsonData){
                    hs = me.headers;
                    if(!hs || !hs[CONTENTTYPE]){
                        initHeader(CONTENTTYPE, xmlData ? 'text/xml' : 'application/json');
                    }
                    data = xmlData || (!Ext.isPrimitive(jsonData) ? Ext.encode(jsonData) : jsonData);
                }
            }
            if(options.async == false){
                return syncRequest(method || options.method || "POST", uri, cb, data);
            }else{
                return asyncRequest(method || options.method || "POST", uri, cb, data);
            }
        },

        serializeForm : function(form) {
            var fElements = form.elements || (document.forms[form] || Ext.getDom(form)).elements,
                hasSubmit = false,
                encoder = encodeURIComponent,
                element,
                options, 
                name, 
                val,                
                data = '',
                type;
                
            Ext.each(fElements, function(element) {                 
                name = element.name;                 
                type = element.type;
                
                if (!element.disabled && name){
                    if(/select-(one|multiple)/i.test(type)) {
                        Ext.each(element.options, function(opt) {
                            if (opt.selected) {
                                data += String.format("{0}={1}&", encoder(name), encoder((opt.hasAttribute ? opt.hasAttribute('value') : opt.getAttribute('value') !== null) ? opt.value : opt.text));
                            }                               
                        });
                    } else if(!/file|undefined|reset|button/i.test(type)) {
                            if(!(/radio|checkbox/i.test(type) && !element.checked) && !(type == 'submit' && hasSubmit)){
                                
                                data += encoder(name) + '=' + encoder(element.value) + '&';                     
                                hasSubmit = /submit/i.test(type);    
                            }                       
                    } 
                }
            });            
            return data.substr(0, data.length - 1);
        },
        
        useDefaultHeader : true,
        defaultPostHeader : 'application/x-www-form-urlencoded; charset=UTF-8',
        useDefaultXhrHeader : true,
        defaultXhrHeader : 'XMLHttpRequest',        
        poll : {},
        timeout : {},
        pollInterval : 50,
        transactionId : 0,
        
//  This is never called - Is it worth exposing this?               
//          setProgId : function(id) {
//              activeX.unshift(id);
//          },

//  This is never called - Is it worth exposing this?   
//          setDefaultPostHeader : function(b) {
//              this.useDefaultHeader = b;
//          },
        
//  This is never called - Is it worth exposing this?   
//          setDefaultXhrHeader : function(b) {
//              this.useDefaultXhrHeader = b;
//          },

//  This is never called - Is it worth exposing this?           
//          setPollingInterval : function(i) {
//              if (typeof i == 'number' && isFinite(i)) {
//                  this.pollInterval = i;
//              }
//          },
        
//  This is never called - Is it worth exposing this?
//          resetDefaultHeaders : function() {
//              this.defaultHeaders = null;
//          },
    
            abort : function(o, callback, isTimeout) {
                var me = this,
                    tId = o.tId,
                    isAbort = false;
                
                if (me.isCallInProgress(o)) {
                    o.conn.abort();
                    clearInterval(me.poll[tId]);
                    me.poll[tId] = null;
                    clearTimeout(pub.timeout[tId]);
                    me.timeout[tId] = null;
                    
                    handleTransactionResponse(o, callback, (isAbort = true), isTimeout);                
                }
                return isAbort;
            },
    
            isCallInProgress : function(o) {
                // if there is a connection and readyState is not 0 or 4
                return o.conn && !{0:true,4:true}[o.conn.readyState];           
            }
        };
        return pub;
    }();
//=================================================================
//	�ļ�����extjs.bug.dom.js
//=================================================================
/*
Ext.lib.Event.resolveTextNode = Ext.isGecko ? function(node){
	if(!node){
		return;
	}
	var s = HTMLElement.prototype.toString.call(node);
	if(s == '[xpconnect wrapped native prototype]' || s == '[object XULElement]'){
		return;
	}
	return node.nodeType == 3 ? node.parentNode : node;
} : function(node){
	return node && node.nodeType == 3 ? node.parentNode : node;
};
*/
//=================================================================
//	�ļ�����mixky.app.changepassword.js
//=================================================================

Ext.namespace("Mixky.app.common");

Mixky.app.common.ChangePassword = function(){
    var formPanel = new Ext.FormPanel({
		labelWidth: 100,
		frame:true,
		defaultType: 'textfield',
		items: [{
			fieldLabel: '原密码',
			name: 'srcpassword',
			inputType: 'password',
			anchor : '100%',
			allowBlank:false
		},{
			fieldLabel: '新密码',
			name: 'newpassword',
			inputType: 'password',
			anchor : '100%',
			allowBlank:false
		},{
			fieldLabel: '新密码确认',
			name: 'newpassword2',
			inputType: 'password',
			anchor : '100%',
			allowBlank:false
		}]
	});
    win = new Ext.Window({
        title : '修改密码',
        width :280,
        height :160,
        iconCls : 'icon-sys-password',
        shim : false,
        maximizable : false,
        minimizable : false,
        animCollapse :false,
        resizable :false,
        modal : true,
		layout : 'fit',
        items : [
            formPanel
        ],
		buttons: [{
			text: '确认',
			handler: function(){
				var form = formPanel.getForm();
				if(form.isValid()){
					var srcpassword = form.findField('srcpassword').getValue();
					var newpassword = form.findField('newpassword').getValue();
					var newpassword2 = form.findField('newpassword2').getValue();
					if(newpassword == newpassword2){
						var notifyWin = MixkyApp.showWaitMessage("正在修改用户密码...");
						OrganizationAppDirect.changePassword(srcpassword, newpassword, function(result, e){
							if(result && result.success){
		        				notifyWin.setIconClass('x-icon-done');
		        				notifyWin.setTitle('完成');
		        				notifyWin.setMessage('用户密码修改完毕.');
								win.close();
							}else{
		        				notifyWin.setIconClass('x-icon-done');
		        				notifyWin.setTitle('错误');
		        				notifyWin.setMessage('用户密码修改失败.');
							}
							MixkyApp.hideNotification(notifyWin);
						});
					}else{
						MixkyApp.showErrorMessage("两次输入密码不一致");
					}
				}
        	}
		},{
			text: '取消',
			handler: function(){
				win.close();
        	}
		}]
    });
    win.show();
}
//=================================================================
//	�ļ�����mixky.app.cookies.js
//=================================================================

Ext.namespace("Mixky.app.common");

/*
 * SAMPLE CODE AT BOTTOM!!!
 *
 * You need to put the name and values in quotes when you call the function, like this:
 * set_cookie( 'mycookie', 'visited 9 times', 30, '/', '', '' );. Don't forget to put in empty quotes for the unused parameters or
 * you'll get an error when you run the code. This makes the cookie named 'mycookie', with the value of 'visited 9 times', and with 
 * a life of 30 days, and the cookie is set to your root folder.
 *
 * The Set_Cookie values for 'domain' and 'secure' are not utilized. Use 'domain' on the Javascript cookie if you are using it on a 
 * subdomain, like widgets.yoursite.com, where the cookie is set on the widgets subdomain, but you need it to be accessible over the
 * whole yoursite.com domain.
 *
 * It's good practice to not assume the path to the site root will be set the way you want it by default, so do this manually as a 
 * rule, '/'. If no value is set for expires, it will only last as long as the current session of the visitor, and will be automatically 
 * deleted when they close their browser. 
 */

Mixky.app.common.setCookie = function(name, value, expires, path, domain, secure) 
{
	// set time, it's in milliseconds
	var today = new Date();
	today.setTime( today.getTime() );
	/*
	if the expires variable is set, make the correct 
	expires time, the current script below will set 
	it for x number of days, to make it for hours, 
	delete * 24, for minutes, delete * 60 * 24
	*/
	if ( expires )
	{
		expires = expires * 1000 * 60 * 60 * 24;
	}
	var expires_date = new Date( today.getTime() + (expires) );
	
	document.cookie = name + "=" +escape( value ) +
	( ( expires ) ? ";expires=" + expires_date.toGMTString() : "" ) + 
	( ( path ) ? ";path=" + path : "" ) + 
	( ( domain ) ? ";domain=" + domain : "" ) +
	( ( secure ) ? ";secure" : "" );
}

/*
 * This will retrieve the cookie by name, if the cookie does not exist, it will return false, so you can do things like 
 * if ( Get_Cookie( 'your_cookie' ) ) do something.
 */

Mixky.app.common.getCookie = function(name) {
	var start = document.cookie.indexOf(name + "=");
	var len = start + name.length + 1;
	if ((!start) && (name != document.cookie.substring(0, name.length )))
	{
		return null;
	}
	if (start == -1) return null;
	var end = document.cookie.indexOf(";", len);
	if (end == -1) end = document.cookie.length;
	// return unescape(document.cookie.substring(len, end));
	var value = document.cookie.substring(len, end);
	return decodeURIComponent(value);
}

/*
 * Here all you need to do is put in: Delete_Cookie('cookie name', '/', '') and the cookie will be deleted. Remember to match 
 * the cookie name, path, and domain to what you have it in Set_Cookie exactly, or you may get some very hard to diagnose errors.
 */

// this deletes the cookie when called
Mixky.app.common.delCookie = function(name, path, domain) {
	if(Get_Cookie(name)) document.cookie = name + "=" + ((path) ? ";path=" + path : "") + ((domain) ? ";domain=" + domain : "" ) + ";expires=Thu, 01-Jan-1970 00:00:01 GMT";
}

//=================================================================
//	�ļ�����mixky.app.daytips.js
//=================================================================

Ext.namespace("Mixky.app.common");

Mixky.app.common.ShowDayTips = function(){
	
	var tipPanel = new Ext.Panel({
		region : 'center',
		padding : 10,
		bodyStyle : 'font-size:10pt',
		border : false
	})
	
    var win = new Ext.Window({
        title : '每日提示',
        width :400,
        height :200,
        iconCls : 'icon-app-mkoa-daytips',
        shim : false,
        maximizable : false,
        minimizable : false,
        animCollapse :false,
        resizable :false,
		layout : 'fit',
		modal : true,
        items : new Ext.Panel({
        	layout : 'border',
        	border : false,
        	items : [{
        		region : 'west',
        		frame : false,
        		width : 68,
        		bodyStyle : 'color:blue;background:white url(resources/images/icon/app/mkoa/daytips48.gif) no-repeat;background-position:10px 15px;',
        		border : false,
        		html : '<BR><BR><BR><BR><BR>　 点滴汇集<BR><BR>　 聚川纳海'
        	}, tipPanel],
        	bbar: ['启动时隐藏　', new Ext.form.Checkbox({
        		checked : MixkyApp.userConfig.hideDayTips,
        		listeners : {
        			'check' : function(field, checked){
		    			AdminAppDirect.setHideDayTips(checked, function(result, e){
		    				if(result && result.success){
		    					MixkyApp.userConfig.hideDayTips = checked;
		    				}
		    			});
		        	}
	        	}
        	}), '->',{
    			text: '上一条',
    			iconCls : 'icon-sys-previous',
    			handler : function(){
        			var index = MixkyApp.userConfig.dayTipsIndex - 1;
        			if(index > 0){
        				win.loadDayTips(index);
        			}else{
        				MixkyApp.showInfoMessage('当前显示为第一条提示，无法执行上一条！');
        			}
	        	}
    		}, {
    			text: '下一条',
    			iconCls : 'icon-sys-next',
    			handler : function(){
	    			var index = MixkyApp.userConfig.dayTipsIndex + 1;
					win.loadDayTips(index);
    			}
    		}, '-', {
    			text : '关闭',
    			iconCls : 'icon-sys-close',
    			handler: function(){
    				win.close();
            	}
    		}]
        }),
        loadDayTips : function(index){
    		if(!index){
    			index = 0;
    		}
			AdminAppDirect.getDayTipByIndex(index, function(result, e){
				if(result && result.success){
					MixkyApp.userConfig.dayTipsIndex = result.index;
					tipPanel.body.dom.innerHTML = '　　' + result.tip;
				}
			});
	    }
    });
    win.show();
    win.loadDayTips(MixkyApp.userConfig.dayTipsIndex + 1);
}
//=================================================================
//	�ļ�����mixky.app.dictionary.js
//=================================================================
Ext.namespace("Mixky.app.common");

Mixky.app.common.dictionaryRenderer = function(val, dictionaryname){
	var dictionary = Mixky.app.Dictionarys[dictionaryname];
	var display = val;
	if(Ext.isDefined(dictionary)){
		dictionary.each(function(record){
			if(record.get('display') == val || record.get('value') == val){
				display = record.get('display');
				return false;
			}
		});
	}
	return display;
}

Mixky.app.common.getDictionaryUrlRender = function(url, value, fn){
	Ext.Ajax.request({
		url: url,
		success: function(response, opts){
			var obj = Ext.decode(response.responseText);
			if(obj && Ext.isDefined(obj.key)){
				fn(obj.key, value);
			}
		},
		params: { value: value }
	});
}

Mixky.app.common.getDictionaryDourlRender = function(url, value, fn, params){
	Ext.Ajax.request({
		url: "page.do",
		success: function(response, opts){
			var obj = Ext.decode(response.responseText);
			if(obj && Ext.isDefined(obj.key)){
				fn(obj.key, value);
			}
		},
		params: Ext.apply({url:url, value: value}, params)
	});	
}

Mixky.app.common.getDictionaryUrlStore = function(url){
	return new Ext.data.Store({
		proxy		: new Ext.data.HttpProxy({
			url			: url
		}),
		reader		: new Ext.data.JsonReader({
			root		: 'results',
			id			:'display',
			fields		:["display","value"]
		})
	});
}

Mixky.app.common.getDictionaryDoUrlStore = function(url, params){
	return new Ext.data.Store({
		proxy		: new Ext.data.HttpProxy({
			url			: "page.do"
		}),
		baseParams : Ext.apply({url:url}, params),
		reader		: new Ext.data.JsonReader({
			root		: 'results',
			id			:'display',
			fields		:["display","value"]
		})
	});
}

Mixky.app.common.getDictionaryDirectStore = function(fn){
	return new Ext.data.DirectStore({
	    paramsAsHash: false,
	    idProperty: 'display',
	    root: 'results',
	    directFn: fn,
	    fields: ['display', 'value']
	});
}
//=================================================================
//	�ļ�����mixky.app.favorite.js
//=================================================================
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
//=================================================================
//	�ļ�����mixky.app.messagebox.fix.js
//=================================================================
/*!
 * Ext JS Library 3.0.0
 * Copyright(c) 2006-2009 Ext JS, LLC
 * licensing@extjs.com
 * http://www.extjs.com/license
 */
/**
 * @class Ext.MessageBox
 * <p>Utility class for generating different styles of message boxes.  The alias Ext.Msg can also be used.<p/>
 * <p>Note that the MessageBox is asynchronous.  Unlike a regular JavaScript <code>alert</code> (which will halt
 * browser execution), showing a MessageBox will not cause the code to stop.  For this reason, if you have code
 * that should only run <em>after</em> some user feedback from the MessageBox, you must use a callback function
 * (see the <code>function</code> parameter for {@link #show} for more details).</p>
 * <p>Example usage:</p>
 *<pre><code>
// Basic alert:
Ext.Msg.alert('Status', 'Changes saved successfully.');

// Prompt for user data and process the result using a callback:
Ext.Msg.prompt('Name', 'Please enter your name:', function(btn, text){
    if (btn == 'ok'){
        // process text value and close...
    }
});

// Show a dialog using config options:
Ext.Msg.show({
   title:'Save Changes?',
   msg: 'You are closing a tab that has unsaved changes. Would you like to save your changes?',
   buttons: Ext.Msg.YESNOCANCEL,
   fn: processResult,
   animEl: 'elId',
   icon: Ext.MessageBox.QUESTION
});
</code></pre>
 * @singleton
 */
Ext.MessageBox = function(){
    var dlg, opt, mask, waitTimer;
    var bodyEl, msgEl, textboxEl, textareaEl, progressBar, pp, iconEl, spacerEl;
    var buttons, activeTextEl, bwidth, iconCls = '';

    // private
    var handleButton = function(button){
        if(dlg.isVisible()){
            dlg.hide();
            handleHide();
            Ext.callback(opt.fn, opt.scope||window, [button, activeTextEl.dom.value, opt], 1);
        }
    };

    // private
    var handleHide = function(){
        if(opt && opt.cls){
            dlg.el.removeClass(opt.cls);
        }
        progressBar.reset();
    };

    // private
    var handleEsc = function(d, k, e){
        if(opt && opt.closable !== false){
            dlg.hide();
            handleHide();
        }
        if(e){
            e.stopEvent();
        }
    };

    // private
    var updateButtons = function(b){
        var width = 0;
        if(!b){
            buttons["ok"].hide();
            buttons["cancel"].hide();
            buttons["yes"].hide();
            buttons["no"].hide();
            return width;
        }
        dlg.footer.dom.style.display = '';
        for(var k in buttons){
            if(typeof buttons[k] != "function"){
                if(b[k]){
                    buttons[k].show();
                    buttons[k].setText(typeof b[k] == "string" ? b[k] : Ext.MessageBox.buttonText[k]);
                    width += buttons[k].el.getWidth()+15;
                }else{
                    buttons[k].hide();
                }
            }
        }
        return width;
    };

    return {
        /**
         * Returns a reference to the underlying {@link Ext.Window} element
         * @return {Ext.Window} The window
         */
        getDialog : function(titleText){
           if(!dlg){
                dlg = new Ext.Window({
                	manager : MixkyApp.desktop.getManager(),
                    autoCreate : true,
                    title:titleText,
                    resizable:false,
                    constrain:true,
                    constrainHeader:true,
                    minimizable : false,
                    maximizable : false,
                    stateful: false,
                    modal: true,
                    shim:true,
                    buttonAlign:"center",
                    width:400,
                    height:100,
                    minHeight: 80,
                    plain:true,
                    footer:true,
                    closable:true,
                    close : function(){
                        if(opt && opt.buttons && opt.buttons.no && !opt.buttons.cancel){
                            handleButton("no");
                        }else{
                            handleButton("cancel");
                        }
                    }
                });
                buttons = {};
                var bt = this.buttonText;
                //TODO: refactor this block into a buttons config to pass into the Window constructor
                buttons["ok"] = dlg.addButton(bt["ok"], handleButton.createCallback("ok"));
                buttons["yes"] = dlg.addButton(bt["yes"], handleButton.createCallback("yes"));
                buttons["no"] = dlg.addButton(bt["no"], handleButton.createCallback("no"));
                buttons["cancel"] = dlg.addButton(bt["cancel"], handleButton.createCallback("cancel"));
                buttons["ok"].hideMode = buttons["yes"].hideMode = buttons["no"].hideMode = buttons["cancel"].hideMode = 'offsets';
                dlg.render(document.body);
                dlg.getEl().addClass('x-window-dlg');
                mask = dlg.mask;
                bodyEl = dlg.body.createChild({
                    html:'<div class="ext-mb-icon"></div><div class="ext-mb-content"><span class="ext-mb-text"></span><br /><div class="ext-mb-fix-cursor"><input type="text" class="ext-mb-input" /><textarea class="ext-mb-textarea"></textarea></div></div>'
                });
                iconEl = Ext.get(bodyEl.dom.firstChild);
                var contentEl = bodyEl.dom.childNodes[1];
                msgEl = Ext.get(contentEl.firstChild);
                textboxEl = Ext.get(contentEl.childNodes[2].firstChild);
                textboxEl.enableDisplayMode();
                textboxEl.addKeyListener([10,13], function(){
                    if(dlg.isVisible() && opt && opt.buttons){
                        if(opt.buttons.ok){
                            handleButton("ok");
                        }else if(opt.buttons.yes){
                            handleButton("yes");
                        }
                    }
                });
                textareaEl = Ext.get(contentEl.childNodes[2].childNodes[1]);
                textareaEl.enableDisplayMode();
                progressBar = new Ext.ProgressBar({
                    renderTo:bodyEl
                });
               bodyEl.createChild({cls:'x-clear'});
            }
            return dlg;
        },

        /**
         * Updates the message box body text
         * @param {String} text (optional) Replaces the message box element's innerHTML with the specified string (defaults to
         * the XHTML-compliant non-breaking space character '&amp;#160;')
         * @return {Ext.MessageBox} this
         */
        updateText : function(text){
            if(!dlg.isVisible() && !opt.width){
                dlg.setSize(this.maxWidth, 100); // resize first so content is never clipped from previous shows
            }
            msgEl.update(text || '&#160;');

            var iw = iconCls != '' ? (iconEl.getWidth() + iconEl.getMargins('lr')) : 0;
            var mw = msgEl.getWidth() + msgEl.getMargins('lr');
            var fw = dlg.getFrameWidth('lr');
            var bw = dlg.body.getFrameWidth('lr');
            if (Ext.isIE && iw > 0){
                //3 pixels get subtracted in the icon CSS for an IE margin issue,
                //so we have to add it back here for the overall width to be consistent
                iw += 3;
            }
            var w = Math.max(Math.min(opt.width || iw+mw+fw+bw, this.maxWidth),
                        Math.max(opt.minWidth || this.minWidth, bwidth || 0));

            if(opt.prompt === true){
                activeTextEl.setWidth(w-iw-fw-bw);
            }
            if(opt.progress === true || opt.wait === true){
                progressBar.setSize(w-iw-fw-bw);
            }
            if(Ext.isIE && w == bwidth){
                w += 4; //Add offset when the content width is smaller than the buttons.    
            }
            dlg.setSize(w, 'auto').center();
            return this;
        },

        /**
         * Updates a progress-style message box's text and progress bar. Only relevant on message boxes
         * initiated via {@link Ext.MessageBox#progress} or {@link Ext.MessageBox#wait},
         * or by calling {@link Ext.MessageBox#show} with progress: true.
         * @param {Number} value Any number between 0 and 1 (e.g., .5, defaults to 0)
         * @param {String} progressText The progress text to display inside the progress bar (defaults to '')
         * @param {String} msg The message box's body text is replaced with the specified string (defaults to undefined
         * so that any existing body text will not get overwritten by default unless a new value is passed in)
         * @return {Ext.MessageBox} this
         */
        updateProgress : function(value, progressText, msg){
            progressBar.updateProgress(value, progressText);
            if(msg){
                this.updateText(msg);
            }
            return this;
        },

        /**
         * Returns true if the message box is currently displayed
         * @return {Boolean} True if the message box is visible, else false
         */
        isVisible : function(){
            return dlg && dlg.isVisible();
        },

        /**
         * Hides the message box if it is displayed
         * @return {Ext.MessageBox} this
         */
        hide : function(){
            var proxy = dlg ? dlg.activeGhost : null;
            if(this.isVisible() || proxy){
                dlg.hide();
                handleHide();
                if (proxy){
                    // unghost is a private function, but i saw no better solution
                    // to fix the locking problem when dragging while it closes
                    dlg.unghost(false, false);
                } 
            }
            return this;
        },

        /**
         * Displays a new message box, or reinitializes an existing message box, based on the config options
         * passed in. All display functions (e.g. prompt, alert, etc.) on MessageBox call this function internally,
         * although those calls are basic shortcuts and do not support all of the config options allowed here.
         * @param {Object} config The following config options are supported: <ul>
         * <li><b>animEl</b> : String/Element<div class="sub-desc">An id or Element from which the message box should animate as it
         * opens and closes (defaults to undefined)</div></li>
         * <li><b>buttons</b> : Object/Boolean<div class="sub-desc">A button config object (e.g., Ext.MessageBox.OKCANCEL or {ok:'Foo',
         * cancel:'Bar'}), or false to not show any buttons (defaults to false)</div></li>
         * <li><b>closable</b> : Boolean<div class="sub-desc">False to hide the top-right close button (defaults to true). Note that
         * progress and wait dialogs will ignore this property and always hide the close button as they can only
         * be closed programmatically.</div></li>
         * <li><b>cls</b> : String<div class="sub-desc">A custom CSS class to apply to the message box's container element</div></li>
         * <li><b>defaultTextHeight</b> : Number<div class="sub-desc">The default height in pixels of the message box's multiline textarea
         * if displayed (defaults to 75)</div></li>
         * <li><b>fn</b> : Function<div class="sub-desc">A callback function which is called when the dialog is dismissed either
         * by clicking on the configured buttons, or on the dialog close button, or by pressing
         * the return button to enter input.
         * <p>Progress and wait dialogs will ignore this option since they do not respond to user
         * actions and can only be closed programmatically, so any required function should be called
         * by the same code after it closes the dialog. Parameters passed:<ul>
         * <li><b>buttonId</b> : String<div class="sub-desc">The ID of the button pressed, one of:<div class="sub-desc"><ul>
         * <li><tt>ok</tt></li>
         * <li><tt>yes</tt></li>
         * <li><tt>no</tt></li>
         * <li><tt>cancel</tt></li>
         * </ul></div></div></li>
         * <li><b>text</b> : String<div class="sub-desc">Value of the input field if either <tt><a href="#show-option-prompt" ext:member="show-option-prompt" ext:cls="Ext.MessageBox">prompt</a></tt>
         * or <tt><a href="#show-option-multiline" ext:member="show-option-multiline" ext:cls="Ext.MessageBox">multiline</a></tt> is true</div></li>
         * <li><b>opt</b> : Object<div class="sub-desc">The config object passed to show.</div></li>
         * </ul></p></div></li>
         * <li><b>scope</b> : Object<div class="sub-desc">The scope of the callback function</div></li>
         * <li><b>icon</b> : String<div class="sub-desc">A CSS class that provides a background image to be used as the body icon for the
         * dialog (e.g. Ext.MessageBox.WARNING or 'custom-class') (defaults to '')</div></li>
         * <li><b>iconCls</b> : String<div class="sub-desc">The standard {@link Ext.Window#iconCls} to
         * add an optional header icon (defaults to '')</div></li>
         * <li><b>maxWidth</b> : Number<div class="sub-desc">The maximum width in pixels of the message box (defaults to 600)</div></li>
         * <li><b>minWidth</b> : Number<div class="sub-desc">The minimum width in pixels of the message box (defaults to 100)</div></li>
         * <li><b>modal</b> : Boolean<div class="sub-desc">False to allow user interaction with the page while the message box is
         * displayed (defaults to true)</div></li>
         * <li><b>msg</b> : String<div class="sub-desc">A string that will replace the existing message box body text (defaults to the
         * XHTML-compliant non-breaking space character '&amp;#160;')</div></li>
         * <li><a id="show-option-multiline"></a><b>multiline</b> : Boolean<div class="sub-desc">
         * True to prompt the user to enter multi-line text (defaults to false)</div></li>
         * <li><b>progress</b> : Boolean<div class="sub-desc">True to display a progress bar (defaults to false)</div></li>
         * <li><b>progressText</b> : String<div class="sub-desc">The text to display inside the progress bar if progress = true (defaults to '')</div></li>
         * <li><a id="show-option-prompt"></a><b>prompt</b> : Boolean<div class="sub-desc">True to prompt the user to enter single-line text (defaults to false)</div></li>
         * <li><b>proxyDrag</b> : Boolean<div class="sub-desc">True to display a lightweight proxy while dragging (defaults to false)</div></li>
         * <li><b>title</b> : String<div class="sub-desc">The title text</div></li>
         * <li><b>value</b> : String<div class="sub-desc">The string value to set into the active textbox element if displayed</div></li>
         * <li><b>wait</b> : Boolean<div class="sub-desc">True to display a progress bar (defaults to false)</div></li>
         * <li><b>waitConfig</b> : Object<div class="sub-desc">A {@link Ext.ProgressBar#waitConfig} object (applies only if wait = true)</div></li>
         * <li><b>width</b> : Number<div class="sub-desc">The width of the dialog in pixels</div></li>
         * </ul>
         * Example usage:
         * <pre><code>
Ext.Msg.show({
   title: 'Address',
   msg: 'Please enter your address:',
   width: 300,
   buttons: Ext.MessageBox.OKCANCEL,
   multiline: true,
   fn: saveAddress,
   animEl: 'addAddressBtn',
   icon: Ext.MessageBox.INFO
});
</code></pre>
         * @return {Ext.MessageBox} this
         */
        show : function(options){
            if(this.isVisible()){
                this.hide();
            }
            opt = options;
            var d = this.getDialog(opt.title || "&#160;");

            d.setTitle(opt.title || "&#160;");
            var allowClose = (opt.closable !== false && opt.progress !== true && opt.wait !== true);
            d.tools.close.setDisplayed(allowClose);
            activeTextEl = textboxEl;
            opt.prompt = opt.prompt || (opt.multiline ? true : false);
            if(opt.prompt){
                if(opt.multiline){
                    textboxEl.hide();
                    textareaEl.show();
                    textareaEl.setHeight(typeof opt.multiline == "number" ?
                        opt.multiline : this.defaultTextHeight);
                    activeTextEl = textareaEl;
                }else{
                    textboxEl.show();
                    textareaEl.hide();
                }
            }else{
                textboxEl.hide();
                textareaEl.hide();
            }
            activeTextEl.dom.value = opt.value || "";
            if(opt.prompt){
                d.focusEl = activeTextEl;
            }else{
                var bs = opt.buttons;
                var db = null;
                if(bs && bs.ok){
                    db = buttons["ok"];
                }else if(bs && bs.yes){
                    db = buttons["yes"];
                }
                if (db){
                    d.focusEl = db;
                }
            }
            if(opt.iconCls){
              d.setIconClass(opt.iconCls);
            }
            this.setIcon(opt.icon);
            if(opt.cls){
                d.el.addClass(opt.cls);
            }
            d.proxyDrag = opt.proxyDrag === true;
            d.modal = opt.modal !== false;
            d.mask = opt.modal !== false ? mask : false;
            
            d.on('show', function(){
                //workaround for window internally enabling keymap in afterShow
                d.keyMap.setDisabled(allowClose !== true);
                d.doLayout();
                this.setIcon(opt.icon);
                bwidth = updateButtons(opt.buttons);
                progressBar.setVisible(opt.progress === true || opt.wait === true);
                this.updateProgress(0, opt.progressText);
                this.updateText(opt.msg);
                if(opt.wait === true){
                    progressBar.wait(opt.waitConfig);
                }

            }, this, {single:true});
            if(!d.isVisible()){
                // force it to the end of the z-index stack so it gets a cursor in FF
                document.body.appendChild(dlg.el.dom);
                d.setAnimateTarget(opt.animEl);
                d.show(opt.animEl);
            }
            return this;
        },

        /**
         * Adds the specified icon to the dialog.  By default, the class 'ext-mb-icon' is applied for default
         * styling, and the class passed in is expected to supply the background image url. Pass in empty string ('')
         * to clear any existing icon.  The following built-in icon classes are supported, but you can also pass
         * in a custom class name:
         * <pre>
Ext.MessageBox.INFO
Ext.MessageBox.WARNING
Ext.MessageBox.QUESTION
Ext.MessageBox.ERROR
         *</pre>
         * @param {String} icon A CSS classname specifying the icon's background image url, or empty string to clear the icon
         * @return {Ext.MessageBox} this
         */
        setIcon : function(icon){
            if(icon && icon != ''){
                iconEl.removeClass('x-hidden');
                iconEl.replaceClass(iconCls, icon);
                bodyEl.addClass('x-dlg-icon');
                iconCls = icon;
            }else{
                iconEl.replaceClass(iconCls, 'x-hidden');
                bodyEl.removeClass('x-dlg-icon');
                iconCls = '';
            }
            return this;
        },

        /**
         * Displays a message box with a progress bar.  This message box has no buttons and is not closeable by
         * the user.  You are responsible for updating the progress bar as needed via {@link Ext.MessageBox#updateProgress}
         * and closing the message box when the process is complete.
         * @param {String} title The title bar text
         * @param {String} msg The message box body text
         * @param {String} progressText (optional) The text to display inside the progress bar (defaults to '')
         * @return {Ext.MessageBox} this
         */
        progress : function(title, msg, progressText){
            this.show({
                title : title,
                msg : msg,
                buttons: false,
                progress:true,
                closable:false,
                minWidth: this.minProgressWidth,
                progressText: progressText
            });
            return this;
        },

        /**
         * Displays a message box with an infinitely auto-updating progress bar.  This can be used to block user
         * interaction while waiting for a long-running process to complete that does not have defined intervals.
         * You are responsible for closing the message box when the process is complete.
         * @param {String} msg The message box body text
         * @param {String} title (optional) The title bar text
         * @param {Object} config (optional) A {@link Ext.ProgressBar#waitConfig} object
         * @return {Ext.MessageBox} this
         */
        wait : function(msg, title, config){
            this.show({
                title : title,
                msg : msg,
                buttons: false,
                closable:false,
                wait:true,
                modal:true,
                minWidth: this.minProgressWidth,
                waitConfig: config
            });
            return this;
        },

        /**
         * Displays a standard read-only message box with an OK button (comparable to the basic JavaScript alert prompt).
         * If a callback function is passed it will be called after the user clicks the button, and the
         * id of the button that was clicked will be passed as the only parameter to the callback
         * (could also be the top-right close button).
         * @param {String} title The title bar text
         * @param {String} msg The message box body text
         * @param {Function} fn (optional) The callback function invoked after the message box is closed
         * @param {Object} scope (optional) The scope of the callback function
         * @return {Ext.MessageBox} this
         */
        alert : function(title, msg, fn, scope){
            this.show({
                title : title,
                msg : msg,
                buttons: this.OK,
                fn: fn,
                scope : scope
            });
            return this;
        },

        /**
         * Displays a confirmation message box with Yes and No buttons (comparable to JavaScript's confirm).
         * If a callback function is passed it will be called after the user clicks either button,
         * and the id of the button that was clicked will be passed as the only parameter to the callback
         * (could also be the top-right close button).
         * @param {String} title The title bar text
         * @param {String} msg The message box body text
         * @param {Function} fn (optional) The callback function invoked after the message box is closed
         * @param {Object} scope (optional) The scope of the callback function
         * @return {Ext.MessageBox} this
         */
        confirm : function(title, msg, fn, scope){
            this.show({
                title : title,
                msg : msg,
                buttons: this.YESNO,
                fn: fn,
                scope : scope,
                icon: this.QUESTION
            });
            return this;
        },

        /**
         * Displays a message box with OK and Cancel buttons prompting the user to enter some text (comparable to JavaScript's prompt).
         * The prompt can be a single-line or multi-line textbox.  If a callback function is passed it will be called after the user
         * clicks either button, and the id of the button that was clicked (could also be the top-right
         * close button) and the text that was entered will be passed as the two parameters to the callback.
         * @param {String} title The title bar text
         * @param {String} msg The message box body text
         * @param {Function} fn (optional) The callback function invoked after the message box is closed
         * @param {Object} scope (optional) The scope of the callback function
         * @param {Boolean/Number} multiline (optional) True to create a multiline textbox using the defaultTextHeight
         * property, or the height in pixels to create the textbox (defaults to false / single-line)
         * @param {String} value (optional) Default value of the text input element (defaults to '')
         * @return {Ext.MessageBox} this
         */
        prompt : function(title, msg, fn, scope, multiline, value){
            this.show({
                title : title,
                msg : msg,
                buttons: this.OKCANCEL,
                fn: fn,
                minWidth:250,
                scope : scope,
                prompt:true,
                multiline: multiline,
                value: value
            });
            return this;
        },

        /**
         * Button config that displays a single OK button
         * @type Object
         */
        OK : {ok:true},
        /**
         * Button config that displays a single Cancel button
         * @type Object
         */
        CANCEL : {cancel:true},
        /**
         * Button config that displays OK and Cancel buttons
         * @type Object
         */
        OKCANCEL : {ok:true, cancel:true},
        /**
         * Button config that displays Yes and No buttons
         * @type Object
         */
        YESNO : {yes:true, no:true},
        /**
         * Button config that displays Yes, No and Cancel buttons
         * @type Object
         */
        YESNOCANCEL : {yes:true, no:true, cancel:true},
        /**
         * The CSS class that provides the INFO icon image
         * @type String
         */
        INFO : 'ext-mb-info',
        /**
         * The CSS class that provides the WARNING icon image
         * @type String
         */
        WARNING : 'ext-mb-warning',
        /**
         * The CSS class that provides the QUESTION icon image
         * @type String
         */
        QUESTION : 'ext-mb-question',
        /**
         * The CSS class that provides the ERROR icon image
         * @type String
         */
        ERROR : 'ext-mb-error',

        /**
         * The default height in pixels of the message box's multiline textarea if displayed (defaults to 75)
         * @type Number
         */
        defaultTextHeight : 75,
        /**
         * The maximum width in pixels of the message box (defaults to 600)
         * @type Number
         */
        maxWidth : 600,
        /**
         * The minimum width in pixels of the message box (defaults to 110)
         * @type Number
         */
        minWidth : 110,
        /**
         * The minimum width in pixels of the message box if it is a progress-style dialog.  This is useful
         * for setting a different minimum width than text-only dialogs may need (defaults to 250)
         * @type Number
         */
        minProgressWidth : 250,
        /**
         * An object containing the default button text strings that can be overriden for localized language support.
         * Supported properties are: ok, cancel, yes and no.  Generally you should include a locale-specific
         * resource file for handling language support across the framework.
         * Customize the default text like so: Ext.MessageBox.buttonText.yes = "oui"; //french
         * @type Object
         */
        buttonText : {
            ok : "OK",
            cancel : "Cancel",
            yes : "Yes",
            no : "No"
        }
    };
}();

/**
 * Shorthand for {@link Ext.MessageBox}
 */
Ext.Msg = Ext.MessageBox;
//=================================================================
//	�ļ�����mixky.app.notification.js
//=================================================================
/*
 * qWikiOffice Desktop 0.8.1
 * Copyright(c) 2007-2008, Integrated Technologies, Inc.
 * licensing@qwikioffice.com
 * 
 * http://www.qwikioffice.com/license
 *
 * Ext.ux.Notification is based on code from the Ext JS forum.
 * I have made some minor modifications.
 */

Mixky.app.NotificationMgr = {
    positions: []
};

Mixky.app.Notification = Ext.extend(Ext.Window, {
	initComponent : function(){
		Ext.apply(this, {
			iconCls: this.iconCls || 'x-icon-information'
			, width: 200
			, autoHeight: true
			, closable: true
			, plain: false
			, draggable: false
			, bodyStyle: 'text-align:left;padding:10px;'
			, resizable: false
		});
		if(this.autoDestroy){
			this.task = new Ext.util.DelayedTask(this.close, this);
		}else{
			this.closable = true;
		}
		Mixky.app.Notification.superclass.initComponent.call(this);
    }

	, setMessage : function(msg){
		this.body.update(msg);
	}
	
	, setTitle : function(title, iconCls){
		Mixky.app.Notification.superclass.setTitle.call(this, title, iconCls||this.iconCls);
    }

	, onRender : function(ct, position) {
		Mixky.app.Notification.superclass.onRender.call(this, ct, position);
	}

	, onDestroy : function(){
		Mixky.app.NotificationMgr.positions.remove(this.pos);
		Mixky.app.Notification.superclass.onDestroy.call(this);
	}

	, afterShow : function(){
		Mixky.app.Notification.superclass.afterShow.call(this);
		this.on('move', function(){
			Mixky.app.NotificationMgr.positions.remove(this.pos);
			if(this.autoDestroy){
				this.task.cancel();
			}
		}, this);
		if(this.autoDestroy){
			this.task.delay(this.hideDelay || 5000);
		}
	}

	, animShow : function(){
		this.pos = 0;
		while(Mixky.app.NotificationMgr.positions.indexOf(this.pos)>-1){
			this.pos++;
		}
		Mixky.app.NotificationMgr.positions.push(this.pos);
		this.setSize(200,100);
		this.el.alignTo(this.animateTarget || document, "br-br", [ -1, -1-((this.getSize().height+10)*this.pos) ]);
		this.el.slideIn('b', {
			duration: .7
			, callback: this.afterShow
			, scope: this
		});
	}

	, animHide : function(){
		Mixky.app.NotificationMgr.positions.remove(this.pos);
		this.el.ghost("b", {
			duration: 1
			, remove: true
		});
	}
});
//=================================================================
//	�ļ�����mixky.app.preferences.background.js
//=================================================================

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
//=================================================================
//	�ļ�����mixky.app.preferences.desktop.js
//=================================================================

Ext.namespace("Mixky.app.common");

Mixky.app.common.PreferencesDesktop = function(){
	
	var uiWindow = new Ext.form.Radio({
		boxLabel : 'Window模式',
		hideLabel : true,
		checked : MixkyApp.userConfig.uimode == 'window',
		name : 'uimodel'
	});
	uiWindow.on('check', function(checkbox, checked){
		if(checked){
			MixkyApp.userConfig.uimode = 'window';
		}
	});
	var uiWebPage = new Ext.form.Radio({
		boxLabel : 'Web Page模式',
		hideLabel : true,
		checked : MixkyApp.userConfig.uimode == 'webpage',
		name : 'uimodel'
	});
	uiWebPage.on('check', function(checkbox, checked){
		if(checked){
			MixkyApp.userConfig.uimode = 'webpage';
		}
	});
	var desktopColumns2 = new Ext.form.Radio({
		boxLabel : '2栏',
		checked : MixkyApp.userConfig.columns == 2,
		name : 'columns'
	});
	desktopColumns2.on('check', function(checkbox, checked){
		if(checked){
			MixkyApp.userConfig.columns = 2;
		}
	});
	var desktopColumns3 = new Ext.form.Radio({
		boxLabel : '3栏',
		checked : MixkyApp.userConfig.columns != 2 && MixkyApp.userConfig.columns != 4,
		name : 'columns'
	});
	desktopColumns3.on('check', function(checkbox, checked){
		if(checked){
			MixkyApp.userConfig.columns = 3;
		}
	});
	var desktopColumns4 = new Ext.form.Radio({
		boxLabel : '4栏',
		checked : MixkyApp.userConfig.columns == 4,
		name : 'columns'
	});
	desktopColumns4.on('check', function(checkbox, checked){
		if(checked){
			MixkyApp.userConfig.columns = 4;
		}
	});

	var toolBarShowIconMode0 = new Ext.form.Radio({
		boxLabel : '单行按钮',
		checked : MixkyApp.userConfig.toolBarShowIconMode == 0,
		name : 'iconmode'
	});
	toolBarShowIconMode0.on('check', function(checkbox, checked){
		if(checked){
			MixkyApp.userConfig.toolBarShowIconMode = 0;
			if(MixkyApp.userConfig.uimode == 'webpage'){
				MixkyApp.desktop.header.setIconMode();
			}
		}
	});

	var toolBarShowIconMode1 = new Ext.form.Radio({
		boxLabel : '双行按钮',
		checked : MixkyApp.userConfig.toolBarShowIconMode == 1,
		name : 'iconmode'
	});
	toolBarShowIconMode1.on('check', function(checkbox, checked){
		if(checked){
			MixkyApp.userConfig.toolBarShowIconMode = 1;
			if(MixkyApp.userConfig.uimode == 'webpage'){
				MixkyApp.desktop.header.setIconMode();
			}
		}
	});

	var toolBarShowIconMode2 = new Ext.form.Radio({
		boxLabel : '仅显示图标',
		checked : MixkyApp.userConfig.toolBarShowIconMode == 2,
		name : 'iconmode'
	});
	toolBarShowIconMode2.on('check', function(checkbox, checked){
		if(checked){
			MixkyApp.userConfig.toolBarShowIconMode = 2;
			if(MixkyApp.userConfig.uimode == 'webpage'){
				MixkyApp.desktop.header.setIconMode();
			}
		}
	});
	
	
	var store = new Ext.data.DirectStore({
		directFn : DesktopAppDirect.getDesktopStyles,
		paramOrder:[],
		root : 'results',
		totalProperty : 'totals',
		idProperty : 'path',
		fields:[
		    {name:'id', mapping:'id'},
		    {name:'thumbnail', mapping:'thumbnail'},
		    {name:'path', mapping:'path'}
		]
	});
	var tpl = new Ext.XTemplate(
		'<tpl for=".">',
			'<div class="pref-view-thumb-wrap" id="{id}">',
				'<div class="pref-view-thumb"><img src="{thumbnail}" title="{id}" /></div>',
			'<span>{shortName}</span></div>',
		'</tpl>',
		'<div class="x-clear"></div>'
	);
	var view = new Ext.DataView({
		autoHeight:true,
    	anchor : '-20',
		emptyText : '没有可供选择的样式',
		itemSelector :'div.pref-view-thumb-wrap',
		loadingText : 'loading...',
		singleSelect : true,
		overClass : 'x-view-over',
		prepareData : function(data){
			data.shortName = Ext.util.Format.ellipsis(data.id, 17);
			return data;
		},
		store : store,
		tpl : tpl
	});
	view.on('selectionchange', function(v, sel){
		if(sel.length > 0){
			var record = v.getRecord(sel[0]);
			if(record && record.get('path')){
				MixkyApp.setTheme(record.get('path'));
			}
		}
	});
	store.on('load', function(s, records){
		if(records){
			var t = MixkyApp.userConfig.theme;
			if(t){
				view.select(t);
			}
		}				
	}, this);
	var panel = new Ext.Panel({
		title : '界面设置',
        iconCls : 'icon-sys-desktopui',
        padding : '5px',
        items : [{
        	xtype : 'fieldset',
        	title : '设置界面模式（保存后刷新页面使用新的界面模式）',
        	items : [{
        		layout:'column',
        		border : false,
        		items : [{
        			columnWidth:.4,
            		border : false,
        			layout: 'form',
        			items : uiWindow
        		},{
        			columnWidth:.6,
            		border : false,
        			layout: 'form',
        			items : uiWebPage
        		}]
        	},{
        		layout:'column',
        		border : false,
        		items : [{
        			columnWidth:.4,
            		border : false,
        			layout: 'form',
        			items : [{border : false,html:'　'}]
        		},{
        			columnWidth:.6,
            		border : false,
        			layout: 'form',
        			items : [{
                		hideLabel : true,
                		xtype : 'radiogroup',
                        items : [desktopColumns2, desktopColumns3, desktopColumns4]
                	},{
                		hideLabel : true,
                		xtype : 'radiogroup',
                        items : [toolBarShowIconMode0, toolBarShowIconMode1, toolBarShowIconMode2]
                	}]
        		}]
        	}]
        }, {
        	xtype : 'panel',
			autoScroll : true,
        	height : 240,
        	layout : 'anchor',
			bodyStyle : 'padding:10px',
			border : true,
        	items : view
        }]
	});
	store.load();
	return panel;
}
//=================================================================
//	�ļ�����mixky.app.preferences.js
//=================================================================

Ext.namespace("Mixky.app.common");

Mixky.app.common.Preferences = function(){
	var desktop = Mixky.app.common.PreferencesDesktop();
	var background = Mixky.app.common.PreferencesBackground();
	var shortcuts = Mixky.app.common.PreferencesShortcuts();
	var quickstarts = Mixky.app.common.PreferencesQuickStarts();
	var subjects = Mixky.app.common.PreferencesSubjects();
    win = new Ext.Window({
        title : '应用参数设置',
        width :500,
        height :500,
        iconCls : 'icon-sys-preference',
        shim : false,
        maximizable : false,
        minimizable : false,
        animCollapse :false,
        resizable :false,
        modal : true,
		layout : 'fit',
        items : [{
        	xtype : 'tabpanel',
            activeTab : 0,
            border :false,
            defaults: {
        		autoScroll:true
        	},
            items : [
                desktop,
                background,
                shortcuts,
                quickstarts,
                subjects
            ]
        }],
        buttons : [{
        	text : '保存设置',
            iconCls : 'icon-sys-save',
            handler : function(){
        		Mixky.app.Actions.SavePreferences.execute();
    		}
        },{
        	text : '关闭',
            iconCls : 'icon-sys-cancel',
            handler : function(){
    			win.close();
    		}
        }]
    });
    win.show();
}
//=================================================================
//	�ļ�����mixky.app.preferences.quickstarts.js
//=================================================================

Ext.namespace("Mixky.app.common");

Mixky.app.common.PreferencesQuickStarts = function(){

	var tree = new Ext.tree.TreePanel({
    	region : 'west',
		rootVisible: false,
    	autoScroll : true,
    	split : false,
    	width : 200,
		loader: new Ext.tree.TreeLoader({
        	paramOrder:[],
            directFn: DesktopAppDirect.getQuickStarts,
            listeners : {
				'load' : function(loader, node){
					node.eachChild(function(child){
						if(MixkyApp.hasQuickStart(child.attributes.btntype, child.attributes.key)){
							child.getUI().toggleCheck(true);
						}
					});
				}
			}
		}),
		listeners: {
			'checkchange': function(node, checked){
				if(node.leaf && node.id){
		    		if(checked){
						if(!MixkyApp.hasQuickStart(node.attributes.btntype, node.attributes.key)){
							MixkyApp.addQuickStart({
								text : node.attributes.text, 
								iconCls : node.attributes.iconCls, 
								btntype : node.attributes.btntype, 
								key : node.attributes.key
							});
						}
		    		}else{
		    			MixkyApp.removeQuickStart(node.attributes.btntype, node.attributes.key);
		    		}
		    	}
		    	node.ownerTree.selModel.select(node);
			}
		},
		root : {id : 'root',text : '快捷菜单'}
	});
	
	var note = new Ext.Panel({
    	region : 'center',
    	border : false,
    	html : '选择桌面启动按钮'
	});
	
	var panel = new Ext.Panel({
		layout : 'border',
		title : '快捷菜单',
        padding : '5px',
		border : false,
        iconCls : 'icon-sys-quickstart',
		items : [tree, note]
	})
	
	return panel;
}
//=================================================================
//	�ļ�����mixky.app.preferences.shortcuts.js
//=================================================================

Ext.namespace("Mixky.app.common");

Mixky.app.common.PreferencesShortcuts = function(){

	var tree = new Ext.tree.TreePanel({
    	region : 'west',
		rootVisible: false,
    	autoScroll : true,
    	split : false,
    	width : 200,
		loader: new Ext.tree.TreeLoader({
        	paramOrder:[],
            directFn: DesktopAppDirect.getShortcuts,
            listeners : {
				'load' : function(loader, node){
					node.eachChild(function(child){
						if(MixkyApp.hasShortcut(child.attributes.btntype, child.attributes.key)){
							child.getUI().toggleCheck(true);
						}
					});
				}
			}
		}),
		listeners: {
			'checkchange': function(node, checked){
				if(node.leaf && node.id){
		    		if(checked){
						if(!MixkyApp.hasShortcut(node.attributes.btntype, node.attributes.key)){
							MixkyApp.addShortcut({
								text : node.attributes.text, 
								iconCls : node.attributes.iconCls, 
								btntype : node.attributes.btntype, 
								key : node.attributes.key
							});
						}
		    		}else{
		    			MixkyApp.removeShortcut(node.attributes.btntype, node.attributes.key);
		    		}
		    	}
		    	node.ownerTree.selModel.select(node);
			}
		},
		root : {id : 'root',text : '桌面按钮'}
	});
	
	var note = new Ext.Panel({
    	region : 'center',
    	border : false,
    	html : '选择桌面启动按钮'
	});
	
	var panel = new Ext.Panel({
		layout : 'border',
		title : '桌面按钮',
        padding : '5px',
		border : false,
        iconCls : 'icon-sys-shortcut',
		items : [tree, note]
	})
	
	return panel;
}
//=================================================================
//	�ļ�����mixky.app.preferences.subjects.js
//=================================================================

Ext.namespace("Mixky.app.common");

Mixky.app.common.PreferencesSubjects = function(){

	var tree = new Ext.tree.TreePanel({
    	region : 'west',
		rootVisible: false,
    	autoScroll : true,
    	split : false,
    	width : 200,
		loader: new Ext.tree.TreeLoader({
        	paramOrder:[],
            directFn: DesktopAppDirect.getSubjects,
            listeners : {
				'load' : function(loader, node){
					node.eachChild(function(child){
						if(MixkyApp.hasSubject(child.attributes.key)){
							child.getUI().toggleCheck(true);
						}
					});
				}
			}
		}),
		listeners: {
			'checkchange': function(node, checked){
				if(node.leaf && node.id){
		    		if(checked){
						if(!MixkyApp.hasSubject(node.attributes.key)){
							MixkyApp.addSubject({
								key : node.attributes.key,
								text : node.attributes.text,
								iconCls : node.attributes.iconCls,
								width : 300,
								height : 300,
								webheight : 300,
								left : 100,
								top : 50
							});
						}
		    		}else{
		    			MixkyApp.removeSubject(node.attributes.key);
		    		}
		    	}
		    	node.ownerTree.selModel.select(node);
			}
		},
		root : {id : 'root',text : '桌面栏目'}
	});
	
	var note = new Ext.Panel({
    	region : 'center',
    	border : false,
    	html : '选择桌面栏目'
	});
	
	var panel = new Ext.Panel({
		layout : 'border',
		title : '桌面栏目',
        padding : '5px',
		border : false,
        iconCls : 'icon-sys-subject',
		items : [tree, note]
	})
	
	return panel;
}
//=================================================================
//	�ļ�����mixky.doc.functions.js
//=================================================================
var mixap_doc_username = "未知";
var mixap_doc_deptname = "未知";
var mixap_doc_filepath = "c:\\mixky\\mixap.doc";
var mixap_doc_root = "c:\\mixky\\";
var mixap_doc_original_username = "未知";

function Sleep(obj, iMinSecond) {
	if (window.eventList == null)
		window.eventList = new Array();
	var ind = -1;
	for ( var i = 0; i < window.eventList.length; i++) {
		if (window.eventList[i] == null) {
			window.eventList[i] = obj;
			ind = i;
			break;
		}
	}
	if (ind == -1) {
		ind = window.eventList.length;
		window.eventList[ind] = obj;
	}
	setTimeout("GoOn(" + ind + ")", iMinSecond);
}

function GoOn(ind) {
	var obj = window.eventList[ind];
	window.eventList[ind] = null;
	if (obj.NextStep)
		obj.NextStep();
	else
		obj();
}

/**
 * path showtrace 是否显示痕迹 allowmodify 是否允许修改 tracemodify 是否记录修改
 */
function loadWordDocument(objid, path, showrevisions, trackrevisions, allowmodify, username) {
	if (objid != "") {
		var obj = document.getElementById(objid);
		if (obj) {
			try {
				mixap_doc_filepath = path;
				obj.Open(mixap_doc_filepath);
				obj.TrackDocumentRevision(trackrevisions);
				obj.ShowDocumentRevision(showrevisions);
				setCurrentEditUserName(objid, username);
			} catch (e) {
				//alert(e.message);
			}
		}
	}
}

/**
 * 保存文档到指定路径，如未指定路径则保存到当前打开文件
 * ocxname
 * path
 */
function saveWordDocument(objid, path) {
	if (objid != "") {
		var obj = document.getElementById(objid);
		if (obj) {
			try {
				if (path != "" && path != mixap_doc_filepath) {
					obj.ActiveDocument.SaveAs(path);
				} else {
					obj.ActiveDocument.Save();
				}
			} catch (e) {
				//alert(e.message);
			}
		}
	}
}

/**
 * savefirst 关闭之前是否保存文档
 */
function unLoadWordDocument(objid, savefirst) {
	if (objid != "") {
		var obj = document.getElementById(objid);
		if (obj) {
			try {
				obj.SetDocumentCurrentEditingUser(mixap_doc_original_username);
				obj.close();
			} catch (e) {
				//alert(e.message);
			}
		}
	}
}

/**
 * 初始化用户信息
 * username
 * deptname
 */
function initUserInfo(username, deptname) {
	mixap_doc_username = username;
	mixap_doc_deptname = deptname;
}

/**
 * 保护文档（不允许拷贝、编辑）
 * protectpass 密码保护口令
 */
function lockWordDocument(objid, protectpass) {
	if (objid != "") {
		var obj = document.getElementById(objid);
		if (obj) {
			obj.ProtectDocument(2, protectpass);
		}
	}
}

/**
 * 解除文档保护
 * protectpass 密码保护口令
 */
function unLockWordDocument(objid, protectpass) {
	if (objid != "") {
		var obj = document.getElementById(objid);
		if (obj) {
			obj.ProtectDocument(-1, protectpass);
		}
	}
}

/**
 * 显示/隐藏文档修订
 * show
 */
function showWordDocumentRevision(objid, show) {
	if (objid != "") {
		var obj = document.getElementById(objid);
		if (obj) {
			obj.ShowDocumentRevision(show);
		}
	}
}

/**
 * 检查文档是否已被修改
 */
function checkWordDocumentDirty(objid) {
	var isdirty = false;
	if (objid != "") {
		var obj = document.getElementById(objid);
		if (obj) {
			isdirty = obj.IsDirty;
		}
	}
	return isdirty;
}

/**
 * 设置用户信息
 */
function setCurrentEditUserName(objid, username) {
	if (objid != "") {
		var obj = document.getElementById(objid);
		if (obj) {
			//mixap_doc_original_username = obj.GetDocumentCurrentEditingUser();
//			alert(mixap_doc_original_username);
//			if (username == "undefined" || username == "") {
//				username = mixap_doc_username + "/" + mixap_doc_deptname;
//			}
//			obj.SetDocumentCurrentEditingUser(username);
		}
		//mixap_doc_original_username = obj.GetDocumentCurrentEditingUser();
		//alert(mixap_doc_original_username);
		if (username == undefined || username == "") {
			username = mixap_doc_username + "/" + mixap_doc_deptname;
		}
		obj.SetDocumentCurrentEditingUser(username);
	}
}

/**
 * 设置文档书签文本
 */
function setWordDocumentFieldValue(objid, bookmark, value) {
	if (bookmark == "") {
		return;
	}
	if (objid != "") {
		var obj = document.getElementById(objid);
		if (obj) {
			obj.SetDocumentField(bookmark, value);
		}
	}
}

/**
 * 在当前文档书签位置插入文件
 */
function insertFileToCurrentDocument(objid, bookmark, filepath) {
	if (bookmark == "") {
		return;
	}
	if (objid != "") {
		var obj = document.getElementById(objid);
		if (obj) {
			obj.InsertDocument(bookmark, filepath);
		}
	}
}

/**
 * 接受文档修订
 */
function clearDocumentRevision(objid) {
	if (objid != "") {
		var obj = document.getElementById(objid);
		if (obj) {
			obj.ClearDocumentRevisions();
		}
	}
}
//=================================================================
//	�ļ�����mixky.grid.extend.js
//=================================================================


Ext.grid.GridPanel.prototype.lineBreak = false;
Ext.grid.GridPanel.prototype.originalInitComponent = Ext.grid.GridPanel.prototype.initComponent;
Ext.grid.GridPanel.prototype.initComponent = function() {
	this.originalInitComponent();
	if (this.lineBreak) {
		this.store.on('load', function() {  
			if (this.el) {
				this.el.select("table[class=x-grid3-row-table]").each(function(x) {  
			        x.addClass('x-grid3-cell-text-visible');  
			    }); 
			}
		}, this); 
	}
}


Ext.grid.GridPanel.prototype.cellSelect = false;
Ext.grid.GridPanel.prototype.originalGetView = Ext.grid.GridPanel.prototype.getView;
Ext.grid.GridPanel.prototype.getView = function() {
	if (this.cellSelect) {
		if (this.viewConfig == null) {
			this.viewConfig = {};
		}
		this.viewConfig = Ext.applyIf(this.viewConfig, {
				templates: {
					cell: new Ext.Template(
					        '<td class="x-grid3-col x-grid3-cell x-grid3-td-{id} x-selectable {css}" style="{style}" tabIndex="0" {cellAttr}>',  
					        '<div class="x-grid3-cell-inner x-grid3-col-{id}" {attr}>{value}</div>',  
					        '</td>'  
					)
				}			
				
		});		
	}
	return this.originalGetView();
}






//if (!Ext.grid.GridView.prototype.templates) {
//	Ext.grid.GridView.prototype.templates = {};
//}
//Ext.grid.GridView.prototype.templates.cell = new Ext.Template(
//        '<td class="x-grid3-col x-grid3-cell x-grid3-td-{id} x-selectable {css}" style="{style}" tabIndex="0" {cellAttr}>',  
//        '<div class="x-grid3-cell-inner x-grid3-col-{id}" {attr}>{value}</div>',  
//        '</td>'  
//);


Ext.grid.GridView.prototype.doRender = function(cs, rs, ds, startRow, colCount, stripe){
    var ts = this.templates, ct = ts.cell, rt = ts.row, last = colCount-1;
    var tstyle = 'width:'+this.getTotalWidth()+';';
    // buffers
    var buf = [], cb, c, p = {}, rp = {}, r;
    for(var j = 0, len = rs.length; j < len; j++){
        r = rs[j]; cb = [];
        var rowIndex = (j+startRow);
        if(this.getRowStyle){
        	rp.tstyle = tstyle + this.getRowStyle(rowIndex, rs[j]);
        }else{
            rp.tstyle = tstyle;
        }
        for(var i = 0; i < colCount; i++){
            c = cs[i];
            p.id = c.id;
            p.css = i === 0 ? 'x-grid3-cell-first ' : (i == last ? 'x-grid3-cell-last ' : '');
            p.attr = p.cellAttr = "";
            p.value = c.renderer(r.data[c.name], p, r, rowIndex, i, ds);
            p.style = c.style;
            if(Ext.isEmpty(p.value)){
                p.value = "&#160;";
            }
            if(this.markDirty && r.dirty && typeof r.modified[c.name] !== 'undefined'){
                p.css += ' x-grid3-dirty-cell';
            }
            cb[cb.length] = ct.apply(p);
        }
        var alt = [];
        if(stripe && ((rowIndex+1) % 2 === 0)){
            alt[0] = "x-grid3-row-alt";
        }
        if(r.dirty){
            alt[1] = " x-grid3-dirty-row";
        }
        rp.cols = colCount;
        if(this.getRowClass){
            alt[2] = this.getRowClass(r, rowIndex, rp, ds);
        }
        rp.alt = alt.join(" ");
        rp.cells = cb.join("");
        buf[buf.length] =  rt.apply(rp);
    }
    return buf.join("");
}
//=================================================================
//	�ļ�����mixky.js.loader.js
//=================================================================

Ext.namespace("Mixky.app.common");

Mixky.app.common.LoadJsFile = function(id, url){
    var js = document.getElementById(id);
    if(!js){
        js = document.createElement('script');
        js.id = id;
        js.setAttribute('type', 'text/javascript');
        js.setAttribute('src', url);
        document.getElementsByTagName("head")[0].appendChild(js);
    }
};
//=================================================================
//	�ļ�����mixky.organization.window.js
//=================================================================
/*!
 * Ext JS Library 3.0.0
 * Copyright(c) 2006-2009 Ext JS, LLC
 * licensing@extjs.com
 * http://www.extjs.com/license
 */

Ext.namespace("Mixky.app.common");

Mixky.app.common.getOrganizationWindow = function(config, value, fn){
	
	config = Ext.apply({
	    selectMulti : true,
	    selectType : 'mix',
	    valueField : 'expression',
	    displayField : 'f_caption',
	    valueSeparator : ';'
	}, config);
	
	if(!Mixky.app.common.OrganizationWindow){
		var tree = new Ext.tree.TreePanel({
			region : 'center',
	    	autoScroll:true,
	    	rootVisible :false,
	    	root: {
				nodeType: 'async',
	            text: '人员选择',
	            id : 'root-organization'
	        },
	        loader: new Ext.tree.TreeLoader({
	            directFn: OrganizationAppDirect.getOrganizationTree,
	            paramOrder : ['type'],
	        	baseParams : {type:'mix'},
	        	preloadChildren : true
	        }),
	        tools:[{
	        	id:'refresh',
	        	handler:function(){
		        	tree.refresh();
		        }
	        }],
			refresh:function(){
	        	this.getRootNode().reload();
	        }
		});
		// 用户列表框
		var grid = new Ext.grid.GridPanel({
			region : 'east',
	        width: 300,
	        minSize: 200,
	        maxSize: 400,
	        split:true,
			autoExpandColumn:'f_note',
			enableHdMenu:false,
			enableColumnMove:false,
			store : new Ext.data.DirectStore({
				directFn : OrganizationAppDirect.getUserList,
				paramOrder:['expression'],
				baseParams : {
					key : 'expression'
				},
				root : 'results',
				totalProperty : 'totals',
				idProperty : 'id',
				fields:[
				    {name:'id',mapping:'id'},
				    {name:'f_name',mapping:'f_name'},
				    {name:'f_caption',mapping:'f_caption'},
				    {name:'f_note',mapping:'f_note'},
				    {name:'expression',mapping:'expression'}
				]
			}),
			columns : [new Ext.grid.RowNumberer(),{
				id:'f_caption',
				dataIndex:'f_caption',
				width:80,
				sortable: true,
				header:'用户名'
			},{
				id:'f_name',
				dataIndex:'f_name',
				width:100,
				sortable: true,
				header:'登录名'
			},{
				id:'f_note',
				dataIndex:'f_note',
				header:'备注'
			}],
			// 装载用户列表
			loadExpression:function(expression){
				this.getStore().baseParams.expression = expression;
				this.getStore().reload();
			}
		});
		// 已选择组织结构对象框
		var selectedbox = new Ext.DataView({
			region : 'south',
	        split :true,
	        height : 60,
	        minSize : 50,
	        maxSize : 250,
	        style : 'background-color:white',
	        tpl:new Ext.XTemplate(
	        	'<tpl for=".">',
	                '<div class="user-expression-item icon-sys-{type}" id="{expression}">{f_caption}</div>',
	            '</tpl>',
	            '<div class="x-clear"></div>'
	        ),
	        selectedClass:'x-user-expression-view-selected',
	        overClass:'x-user-expression-view-over',
	        itemSelector:'div.user-expression-item',
	        multiSelect: true,
	        plugins: [
	            new Ext.DataView.DragSelector()
	        ],
	        store : new Ext.data.JsonStore({
	        	idProperty: 'expression', 
	        	fields: ['expression', 'type', 'id', 'f_name', 'f_caption', 'f_note']
	        })
		});
		// 定义窗口
		var win = new Ext.Window({
			manager : MixkyApp.desktop.getManager(),
			title : '人员选择',
			iconCls : 'icon-sys-organization',
	        modal: true,
			layout:'border',
			border : false,
	        buttonAlign:'center',
			height : 400,
			width : 450,
			maximizable : false,
			minimizable : false,
			closeAction : 'hide',
			defaults : {border:false},
			items:[tree, grid, selectedbox],
	        buttons: [{
	            text: '确定',
	            iconCls:'icon-sys-confirm',
	            handler: function() {
					var records = selectedbox.getStore().getRange();
					var values = '', display = '';
					if(win.selectMulti && win.valueSeparator == ''){
						values = [];
					}
					var display = '';
					for(var i=0;i<records.length;i++){
						display = display + records[i].get(win.displayField) + ';';
						if(win.selectMulti && win.valueSeparator == ''){
							values.push(records[i].get(win.valueField));
						}else{
							values = values + records[i].get(win.valueField) + win.valueSeparator;
						}
					}
					win.onSelectedFn(display, values, records);
		    		win.hide();
	        	}
	        },{
	            text: '取消',
	            iconCls:'icon-sys-cancel',
	            handler: function() {
	        		win.hide();
	        	}
	        }]
		});
		// 已选择框右键菜单
		selectedbox.contextMenu = new Ext.menu.Menu({items:[{
			text:'移除选择',
			iconCls:'icon-sys-delete',
			handler:function(){
				selectedbox.removeSelected();
			}
		}]});
        // 选中表达式
		selectedbox.selectExpression = function(expression){
			// 判断多选
			if(!win.selectMulti && selectedbox.getStore().getCount() > 0){
				return;
			}
			// 服务器端解析表达式
			OrganizationAppDirect.getExpressionData(expression, win.selectType, function(result,e){
				// 添加
				for(var i=0;i<result.results.length;i++){
					var exp = result.results[i];
					var record = selectedbox.getStore().getById(exp.expression);
					if(!record){
						selectedbox.getStore().loadData([result.results[i]], true);
					}
				}
			});
		}
		// 初始化已经选中的值
		selectedbox.loadSelectedExpressions = function(usersexpression){
			selectedbox.clearSelected();
			if(Ext.isDefined(usersexpression) && usersexpression != ''){
				var values = '';
				if(typeof usersexpression == 'string'){
					usersexpression = usersexpression.split(win.valueSeparator);
				}
				for(var i=0;i<usersexpression.length;i++){
					if(!usersexpression[i]){
						continue;
					}
					values = values + usersexpression[i] + ';';
				}
				if(values && values != ''){
					OrganizationAppDirect.loadSelectedExpressions(win.valueField, values, function(result, e){
						if(result){
							selectedbox.getStore().loadData(result.results, true);
						}
					});
				}
			}
		},
		// 清空选中的用户
		selectedbox.clearSelected = function(){
			selectedbox.getStore().removeAll();
		}
		// 删除选中的用户
		selectedbox.removeSelected = function(){
			var records = selectedbox.getSelectedRecords();
			for(var i=0;i<records.length;i++){
				selectedbox.getStore().remove(records[i]);
			}
		}
		// 选中组织结构树
		tree.getSelectionModel().on('selectionchange', function(sm, node){
			if(!node){
				return;
			}
			var expression = node.attributes['expression'];
			if(!expression || expression == ''){
				return;
			}
			grid.loadExpression(expression);
		});
		// 双击组织结构树
		tree.on('dblclick', function(node, e){
			var expression = node.attributes['expression'];
			if(!expression || expression == ''){
				return;
			}
			if(!this.selectMulti && this.selectType == 'user'){
				return;
			}else{
				selectedbox.selectExpression(expression);
			}
		});
		// 双击用户列表
		grid.on('rowdblclick', function(g, index, e){
			var u = g.getSelectionModel().getSelected();
			selectedbox.selectExpression(u.get('expression'));
		});
		// 双击用户列表
		selectedbox.on('dblclick', function(dv, index, e){
			selectedbox.removeSelected();
		});
		// 双击用户列表
		selectedbox.on('contextmenu', function(dv, index, node, e){
			dv.contextMenu.showAt(e.getXY());
		});
		win.initConfigration = function(config, value, fn){
			// 装载树结构
    		if(config.selectType != tree.getLoader().baseParams.type){
				tree.getLoader().baseParams.type = config.selectType;
				tree.refresh();
    		}
    		// 应用参数
		    Ext.apply(this, config);
			// 设置显示模式
			switch(this.selectType){
			case 'user':
			case 'mix':
				grid.setVisible(true);
				break;
			case 'department':
			case 'role':
				grid.setVisible(false);
				break;
			}
			win.onSelectedFn = fn;
			// 装载初始值
			selectedbox.loadSelectedExpressions(value);
			
		}
		Mixky.app.common.OrganizationWindow = win;
	}
	Mixky.app.common.OrganizationWindow.initConfigration(config, value, fn);
	return Mixky.app.common.OrganizationWindow;
};
//=================================================================
//	�ļ�����mixky.webaccess.functions.js
//=================================================================
var mixap_webaccess_document_download_servlet = "servlet/file.download";
var mixap_webaccess_document_uplolad_servlet = "servlet/file.upload";

function getCurrentUserAuthCookie()
{
}

/*
* 返回应用服务器基础路径
*/
function getServerURI()
{
	var uri = window.location.protocol + "//" + window.location.host + "/mkoa/";
	return uri;
}

/*
* 返回文档下载路径
*/
function getDocumentDownloadURI()
{
	return getServerURI() + mixap_webaccess_document_download_servlet;
}

/*
* 返回文档上传路径
*/
function getDocumentUploadURI()
{
	return getServerURI() + mixap_webaccess_document_uplolad_servlet;
}

/*
* 下载文档到指定位置
* @param objid
* @param url
* @param localpath
* @param cookiestr
*/
function downloadDocument(objid, url, localpath, cookiestr)
{
	 if(objid != "")
	 {
	 		var obj = document.getElementById(objid);
	 		if(obj.id != "" && obj.id != "undefine")
	 		{
	 			obj.downloadFile(url, localpath, cookiestr);
	 		}
	 }
}

/*
* 上传文档到指定位置
* @param objid
* @param url
* @param localpath
* @param cookiestr
*/
function uploadDocument(objid, url, localpath, cookiestr)
{
	 if(objid != "")
	 {
	 		var obj = document.getElementById(objid);
			if(obj.id != "" && obj.id != "undefine")
			{
				//alert("url=" + url + "\n" + "localpath=" + localpath);
				obj.uploadFile(url, localpath, cookiestr);
			}
	 }
}

function testControl(objid, txt)
{
	 if(objid != "")
	 {
	 		var obj = document.getElementById(objid);
			if(obj.id != "" && obj.id != "undefine")
			{
				obj.TestControl(txt);
			}
	 }
}