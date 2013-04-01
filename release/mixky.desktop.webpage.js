Mixky.desktop.Framework=function(a,c){function b(h){h.minimized=true;h.hide()}function g(h){d.removeWindow(h)}Mixky.desktop.Framework.superclass.constructor.call(this,a,c);this.portalPanel=a=new Mixky.desktop.Portal({closable:false});var d=this.header=new Mixky.desktop.Header;this.container=new Ext.TabPanel({region:"center",enableTabScroll:true,bodyBorder:false,hideBorders:true,border:false,activeTab:0,defaults:{border:false,bodyBorder:false},items:a,plugins:new Ext.ux.TabCloseMenu});this.container.on("beforeremove",
function(h,e){Ext.isDefined(e.items.get(0).beforeCloseMe)&&e.items.get(0).beforeCloseMe()});new Ext.Viewport({layout:"border",items:[this.header,this.container]});var f=new Ext.WindowGroup;this.getManager=function(){return f};this.getWindow=function(h){return f.get(h)};this.appendWindow=function(h){h.render(Ext.getBody());d.appendWindow(h);h.animateTarget=d.winsButton.getEl();h.on({minimize:{fn:b},close:{fn:g}});return h};this.createWindow=function(h,e){return this.appendWindow(new (e||Ext.Window)(Ext.applyIf(h||
{},{manager:f,minimizable:true,maximizable:true})))};Ext.getBody().on("contextmenu",function(h){h.preventDefault()})};
Ext.extend(Mixky.desktop.Framework,Mixky.desktop.IFramework,{init:function(){},hideAllWindow:function(){this.getManager().each(function(a){a.minimize()})},getCurrentModule:function(){if(this.container.getActiveTab()!=this.portalPanel)return this.container.getActiveTab().items.get(0)},showDesktop:function(){this.hideAllWindow();this.container.activate(this.portalPanel)},getChildMenu:function(a){var c=[];if(Ext.isDefined(a.items))for(var b=0;b<a.items.length;b++)c.push({text:a.items[b].text,name:a.items[b].name,
scale:"medium",iconAlign:"top",iconCls:a.items[b].iconCls,handler:MixkyApp.handlerMenu});return c},setTheme:function(a){Ext.util.CSS.swapStyleSheet("theme",a)},setBackgroundColor:function(a){Ext.isIE?this.portalPanel.body.setStyle("background-color",a):this.portalPanel.body.setStyle("background-color","#"+a)},setFrontColor:function(a){Ext.isIE?Ext.util.CSS.updateRule(".ux-shortcut-btn-text","color",a):Ext.util.CSS.updateRule(".ux-shortcut-btn-text","color","#"+a)},setWallpaper:function(a){function c(){if(g.complete){d.cancel();
b.setIconClass("x-icon-done");b.setTitle("\u88c5\u8f7d\u5b8c\u6210");b.setMessage("\u5df2\u5b8c\u6210\u5899\u7eb8\u88c5\u8f7d.");MixkyApp.hideNotification(b);f.setStyle("background-image","url("+g.src+")")}else d.delay(200)}var b=MixkyApp.showWaitMessage("\u6b63\u5728\u88c5\u8f7d\u5899\u7eb8..."),g=new Image;g.src=a;var d=new Ext.util.DelayedTask(c,this);d.delay(200);var f=this.portalPanel.body},setWallpaperPosition:function(a){if(a==="center"){a=this.portalPanel.body;a.removeClass("wallpaper-tile");
a.addClass("wallpaper-center")}else if(a==="tile"){a=this.portalPanel.body;a.removeClass("wallpaper-center");a.addClass("wallpaper-tile")}},addShortcut:function(a){this.portalPanel.addShortcut(a)},removeShortcut:function(a,c){this.portalPanel.removeShortcut(a,c)},addQuickStart:function(a){a.handler=function(c,b){MixkyApp.executeAction(this.btntype,this.key,b)};this.header.quickButton.appendButton(a)},removeQuickStart:function(a,c){this.header.quickButton.removeButton(a,c)},addSubject:function(a){return this.portalPanel.addSubject(a)},
removeSubject:function(a){return this.portalPanel.removeSubject(a)},getModule:function(a){a=this.getWindow("m-"+a);if(Ext.isDefined(a))return a.items.get(0)},openModule:function(a){var c=this.container,b=this.container.get("m-"+a);if(!b){b=Mixky.app.Modules[a];if(!b)return;a=this.getModulePanel(a);b=this.container.add({id:"m-"+b.key,title:b.title,layout:"fit",border:false,closable:true,iconCls:b.icon,items:a})}c.activate(b);return b.items.get(0)},getDocument:function(a,c){a=this.getWindow("d-"+a.key+
"-"+c);if(Ext.isDefined(a))return a.items.get(0)},_openDocument:function(a,c,b,g){var d=this.getWindow("d-"+a.key+"-"+c);if(!Ext.isDefined(d)){b=this.getDocumentPanel(a.key,c,b,g);d=this.createWindow(Ext.apply({id:"d-"+a.key+"-"+c,title:a.title,iconCls:a.icon,layout:"fit",border:false,maximizable:false,width:500,height:500,items:b},a.config))}d.show();return d.items.get(0)},_closeDocument:function(a,c){a=this.getWindow("d-"+a+"-"+c);Ext.isDefined(a)&&a.close()},openWindow:function(a,c){var b=this.getWindow(a);
b||this.createWindow(Ext.apply(c,{id:a}));return b},closeWindow:function(a){(a=this.getWindow(a))&&a.close()},closeAllWindow:function(){this.getManager().each(function(a){a.close()})}});
Mixky.desktop.Header=function(a){this.toolbar=new Ext.Toolbar({items:this.getToolbarItems()});var c=Ext.getBody().createChild({id:"x-webpage-header",tag:"div"});c.load({url:"head.do",scripts:true});var b=this.getHeaderHeight();Mixky.desktop.Header.superclass.constructor.call(this,Ext.apply({border:false,region:"north",height:b,minHeight:b,maxHeight:b,hideCollapseTool:true,collapsible:true,split:true,collapseMode:"mini",items:[{xtype:"box",el:c,height:36,border:false},this.toolbar]},a))};
Ext.extend(Mixky.desktop.Header,Ext.Panel,{getHeaderHeight:function(){var a=116;if(MixkyApp.userConfig.toolBarShowIconMode==2)a=96;if(Ext.isIE||Ext.isChrome)a-=4;return a},getToolbarItems:function(){this.winsButton=new Mixky.desktop.TaskBar;this.appendWindow=function(f){this.winsButton.appendWindow(f)};this.removeWindow=function(f){this.winsButton.removeWindow(f)};this.quickButton=new Mixky.desktop.QuickBar;var a=[],c=MixkyApp.userConfig.toolBarShowIconMode;c||(c=0);for(var b=MixkyApp.menus,g=function(f){for(var h=
[],e=0;e<f.items.length;e++){var i={name:f.items[e].name,scale:c==1?"small":"medium",iconAlign:c==0?"top":"left",iconCls:f.items[e].iconCls+"24",handler:MixkyApp.handlerMenu};if(c==2)i.tooltip=f.items[e].text;else i.text=f.items[e].text;h.push(i)}return h},d=0;d<b.length;d++)Ext.isDefined(b[d].items)?a.push({xtype:"buttongroup",title:b[d].text,columns:c==1?b[d].items.length/2:b[d].items.length,items:g(b[d])}):a.push({xtype:"buttongroup",scale:"medium",title:b[d].text,columns:1,items:[{text:b[d].text,
name:b[d].name,iconAlign:c==0?"top":"left",iconCls:b[d].iconCls+"24",handler:MixkyApp.handlerMenu}]});a.push("->");a.push({xtype:"buttongroup",title:"\u7cfb\u7edf\u529f\u80fd",columns:3,items:[this.quickButton,this.winsButton,{text:c==2?undefined:"\u9000\u51fa\u7cfb\u7edf",tooltip:c==2?"\u9000\u51fa\u7cfb\u7edf":undefined,scale:"medium",iconAlign:"top",iconCls:"icon-sys-exit24",handler:function(){Ext.Msg.confirm("\u9000\u51fa\u8b66\u544a","\u9000\u51fa\u7cfb\u7edf\uff0c\u8be5\u64cd\u4f5c\u5c06\u653e\u5f03\u6240\u6709\u672a\u4fdd\u5b58\u6570\u636e\uff0c\u60a8\u786e\u5b9a\u5417\uff1f",
function(f){if(f=="yes")window.location="logout.do"})}}]});return a},setIconMode:function(){this.toolbar.removeAll();this.toolbar.add(this.getToolbarItems());this.toolbar.doLayout();var a=this.getHeaderHeight();this.setHeight(a);this.ownerCt.getLayout().north.maxSize=a;this.ownerCt.doLayout()}});
Mixky.desktop.Portal=function(a){this.buttonPanel=new Ext.Panel({region:"west",border:false,bodyStyle:"background:transparent none",width:15});var c;switch(MixkyApp.userConfig.columns){case 2:c=[{columnWidth:0.5,style:"padding:10px 0 10px 10px"},{columnWidth:0.5,style:"padding:10px 10px 10px 10px"}];break;case 4:c=[{columnWidth:0.25,style:"padding:10px 0 10px 10px"},{columnWidth:0.25,style:"padding:10px 0 10px 10px"},{columnWidth:0.25,style:"padding:10px 0 10px 10px"},{columnWidth:0.25,style:"padding:10px 10px 10px 10px"}];
break;default:c=[{columnWidth:0.33,style:"padding:10px 0 10px 10px"},{columnWidth:0.33,style:"padding:10px 0 10px 10px"},{columnWidth:0.34,style:"padding:10px 10px 10px 10px"}];break}this.portalPanel=new Ext.ux.Portal({region:"center",bodyStyle:"background:transparent none",border:false,items:c});this.portalPanel.on("drop",function(){this.setPortletsPos()},this);Mixky.desktop.Portal.superclass.constructor.call(this,Ext.apply({title:"\u6211\u7684\u684c\u9762",border:true,layout:"border",items:[this.buttonPanel,
this.portalPanel],iconCls:"icon-sys-portal"},a));this.contextmenu=new Ext.menu.Menu({items:[Mixky.app.Actions.Preferences,Mixky.app.Actions.SavePreferences,Mixky.app.Actions.DelPreferences,Mixky.app.Actions.SaveAsDefaultPreferences,"-",Mixky.app.Actions.ChangePassword,"-",Mixky.app.Actions.DesignTool,Mixky.app.Actions.Help,"-",Mixky.app.Actions.Exit,"-",Mixky.app.Actions.ShowDayTips,Mixky.app.Actions.About]});this.buttonPanel.on("afterrender",function(b){this.shortcuts=new Mixky.desktop.Shortcuts({renderTo:b.body});
this.shortcuts.on("columnsrefresh",function(g){this.buttonPanel.setWidth(g);this.doLayout()},this,{delay:100})},this)};
Ext.extend(Mixky.desktop.Portal,Ext.Panel,{onRender:function(a,c){Mixky.desktop.Portal.superclass.onRender.call(this,a,c);this.body.on("contextmenu",function(b){if(b.target.id==this.buttonPanel.body.id||b.target.id==this.portalPanel.body.id||b.target.id==this.portalPanel.body.first().id){b.stopEvent();this.contextmenu.el||this.contextmenu.render();b=b.getXY();b[1]-=this.contextmenu.el.getHeight();this.contextmenu.showAt(b)}},this)},getMinHeightCol:function(){var a=1E4,c=0;this.portalPanel.items.each(function(b,
g){if(b.getHeight()<a){a=b.getHeight();c=g}},this);return c},addSubject:function(a){var c=Ext.getCmp("portlet-"+a.key);if(!c){var b=Ext.isDefined(a.col)?a.col:this.getMinHeightCol();b%=MixkyApp.userConfig.columns;c=new Ext.ux.Portlet({id:"portlet-"+a.key,title:a.text,layout:"fit",iconCls:a.iconCls,height:a.webheight,tools:[{id:"refresh",handler:function(){c.refresh()},qtip:"\u5237\u65b0\u680f\u76ee\u5185\u5bb9"}],autoLoad:{url:"portlet.do",params:{key:a.key},scripts:true},refresh:function(){c.doAutoLoad()}});
this.portalPanel.items.get(b).add(c);this.portalPanel.doLayout();c.key=a.key}return c},removeSubject:function(a){(a=Ext.getCmp("portlet-"+a))&&a.findParentByType("portalcolumn").remove(a)},addShortcut:function(a){a.handler=function(c,b){MixkyApp.executeAction(this.btntype,this.key,b)};this.shortcuts.addShortcut(a)},removeShortcut:function(a,c){(a=this.shortcuts.getButtonCmp(a,c))&&this.shortcuts.removeShortcut(a)},getButtonCmp:function(a,c){return this.shortcuts.getButtonCmp(a,c)},setPortletsPos:function(){this.portalPanel.items.each(function(a,
c){a.items.each(function(b,g){b=MixkyApp.getSubject(b.key);b.col=c;b.row=g},this)},this)}});
Mixky.desktop.QuickBar=function(a){Mixky.desktop.QuickBar.superclass.constructor.call(this,Ext.apply({text:MixkyApp.userConfig.toolBarShowIconMode==2?undefined:"\u5feb\u901f\u529f\u80fd",tooltip:MixkyApp.userConfig.toolBarShowIconMode==2?"\u5feb\u901f\u529f\u80fd":undefined,scale:"medium",iconAlign:"top",iconCls:"icon-sys-function24",menu:new Ext.menu.Menu({items:[Mixky.app.Actions.ShowDesktop,Mixky.app.Actions.Preferences,Mixky.app.Actions.SavePreferences,Mixky.app.Actions.DelPreferences,Mixky.app.Actions.SaveAsDefaultPreferences,
"-",Mixky.app.Actions.ChangePassword,"-",Mixky.app.Actions.Help,Mixky.app.Actions.DesignTool,"-",Mixky.app.Actions.Exit,"-",Mixky.app.Actions.ShowDayTips,Mixky.app.Actions.About]})},a))};Ext.extend(Mixky.desktop.QuickBar,Ext.Button,{appendButton:function(a){this.menu.add(a)},removeButton:function(a,c){a=this.getQuickStartCmp(a,c);Ext.isDefined(a)&&this.menu.remove(a)},getQuickStartCmp:function(a,c){for(var b=0;b<this.menu.items.length;b++){var g=this.menu.items.get(b);if(g&&g.btntype==a&&g.key==c)return g}}});
Mixky.desktop.Shortcuts=function(a){function c(e){if(e>b.getHeight())return true;return false}var b=a.renderTo,g=null,d=null,f=[],h=0;this.addEvents("columnsrefresh");this.menu=new Ext.menu.Menu({items:[{iconCls:"icon-sys-open",text:"\u6253\u5f00",handler:function(e){e.parentMenu.button.handler()}},"-",{iconCls:"icon-sys-remove",text:"\u79fb\u9664",scope:this,handler:function(e){MixkyApp.removeShortcut(e.parentMenu.button.btntype,e.parentMenu.button.key)}}]});this.initColRow=function(){g={index:1,
x:15};d={index:1,y:15};h=15;this.fireEvent("columnsrefresh",h)};this.initColRow();this.addShortcut=function(e){var i=b.createChild({tag:"div",cls:"ux-shortcut-item"}),j=new Mixky.desktop.ShortcutButton(Ext.apply(e,{text:Ext.util.Format.ellipsis(e.text,25)}),i);menu=this.menu;i.addListener("contextmenu",function(k){menu.button=j;menu.showAt(k.getXY())});f.push(j);this.setXY(j.container);return j};this.getButtonCmp=function(e,i){for(var j=0,k=f.length;j<k;j++)if(f[j].btntype==e&&f[j].key==i)return f[j]};
this.removeShortcut=function(e){var i=document.getElementById(e.container.id);e.destroy();i.parentNode.removeChild(i);i=[];for(var j=0,k=f.length;j<k;j++)f[j]!=e&&i.push(f[j]);f=i;this.handleUpdate()};this.handleUpdate=function(){this.initColRow();for(var e=0,i=f.length;e<i;e++)this.setXY(f[e].container)};this.setXY=function(e){var i=d.y+74;if(c(d.y+74)&&i>89){g={index:g.index++,x:g.x+64+15};d={index:1,y:15}}e.setLeftTop(g.x,d.y);d.index++;d.y=d.y+74+15;if(h!=g.x+64+15){h=g.x+64+15;this.fireEvent("columnsrefresh",
h)}};Ext.EventManager.onWindowResize(this.handleUpdate,this,{delay:500})};Ext.extend(Mixky.desktop.Shortcuts,Ext.util.Observable,{});
Mixky.desktop.ShortcutButton=function(a,c){Mixky.desktop.ShortcutButton.superclass.constructor.call(this,Ext.apply(a,{renderTo:c,template:new Ext.Template('<div class="ux-shortcut-btn '+a.iconCls+'">','<div style="background-color:transparent;" class="ux-shortcut-btn-img icon-sys-0shortcut'+a.btntype+"48 "+a.iconCls+'48"></div>','<div class="ux-shortcut-btn-text">{0}</div>',"</div>")}));this.btntype=a.btntype;this.key=a.key};
Ext.extend(Mixky.desktop.ShortcutButton,Ext.Button,{buttonSelector:"div:first",setButtonClass:function(){},setIconClass:function(a){this.el&&this.btnEl.replaceClass(this.iconCls,a);this.iconCls=a;return this},initButtonEl:function(a){Mixky.desktop.ShortcutButton.superclass.initButtonEl.apply(this,arguments);a.removeClass("x-btn");if(this.iconCls)this.cls||a.removeClass(this.text?"x-btn-text-icon":"x-btn-icon")},autoWidth:function(){},setText:function(a){this.text=a;this.el&&this.el.child("div.ux-shortcut-btn-text").update(a)}});
Mixky.desktop.TaskBar=function(a){Mixky.desktop.TaskBar.superclass.constructor.call(this,Ext.apply({text:MixkyApp.userConfig.toolBarShowIconMode==2?undefined:"\u6587\u6863\u7a97\u53e3",tooltip:MixkyApp.userConfig.toolBarShowIconMode==2?"\u6587\u6863\u7a97\u53e3":undefined,scale:"medium",iconAlign:"top",iconCls:"icon-sys-windows24",menu:new Ext.menu.Menu({items:[{iconCls:"icon-sys-closeall",text:"\u5173\u95ed\u6240\u6709",handler:function(){MixkyApp.desktop.closeAllWindow()}},"-"]})},a))};
Ext.extend(Mixky.desktop.TaskBar,Ext.Button,{appendWindow:function(a){this.menu.addMenuItem({iconCls:a.iconCls,checked:true,text:Ext.util.Format.ellipsis(a.title,12),tooltip:a.taskbuttonTooltip||a.title,handler:function(){a.show();a.toFront()}}).win=a},removeWindow:function(a){a=this.findWindowItem(a);Ext.isDefined(a)&&this.menu.remove(a)},markWindowShow:function(a){a=this.findWindowItem(a);Ext.isDefined(a)&&a.setChecked(true)},markWindowHide:function(a){a=this.findWindowItem(a);Ext.isDefined(a)&&
a.setChecked(false)},findWindowItem:function(a){for(var c=0;c<this.menu.items.length;c++)if(this.menu.items.get(c).win==a)return this.menu.items.get(c)}});