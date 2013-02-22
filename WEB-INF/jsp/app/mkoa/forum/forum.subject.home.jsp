<%@ page contentType="text/html; charset=utf-8"%>
<%@ page import="java.util.List"%>
<%@ page import="com.google.gson.JsonObject"%>
<%@ page import="com.mixky.engine.common.Action"%>
<%@ page import="com.mixky.engine.view.ViewManager"%>
<%@ page import="com.mixky.engine.view.View"%>
<%@ page import="com.mixky.engine.view.Column"%>
<%@ page import="com.mixky.engine.common.DesignObjectLoader"%>
<%@page import="com.mixky.app.certification.MixkyUserCertification"%>
<%@page import="com.mixky.engine.organization.User"%>
<%
	String panelid = request.getParameter("panelid");

	View view = DesignObjectLoader.instance().loadDesignObject("mkForum.qForumManage.vForumManage");
	List<Column> columns = view.getF_columns();
	List<Action> actions = view.getF_buttons();
	JsonObject cfg = view.getF_config();
	
	String categoryId = request.getParameter("categoryId");
	
	User user = MixkyUserCertification.instance().getUserInfo(request);

%>
<script language='javascript'>
Ext.onReady(function(){

	var panel = Ext.getCmp('<%=panelid%>');
	
	var store = new Ext.data.DirectStore({
		directFn : AppForumDirect.getCategoryForumsViewJson,
		paramOrder : ['categoryId','userId'],
		baseParams : {categoryId:0, userId:<%=user.getId()%>},
		remoteSort : true,
		root : 'results',
		totalProperty : 'totals',
		idProperty : 'id',
		fields:["id","f_title","f_comment","f_administrators", "s_title", "s_created", "s_author_title", "s_id", "topicNumbers"]
	});

	// 视图按钮
	var buttons = [];

	buttons.push({
		xtype: 'tbtext',
		text: '<a href="#" onclick="Ext.getCmp(\'<%=panelid%>\').openAll()">论坛列表</a> >> '
	});
	var catagoryText = new Ext.Toolbar.TextItem({
		text: ''
	});
	buttons.push(catagoryText);
	
	var <%=ViewManager.VN_REFRESH_BUTTON_NAME%> = new Ext.Action({
		text : '刷新',
		iconCls : 'icon-sys-refresh',
		handler : function(){
			store.baseParams.querytype = <%=ViewManager.QT_NORMAL%>;
			panel.refresh();
		}
	});
	buttons.push('->');
	buttons.push(<%=ViewManager.VN_REFRESH_BUTTON_NAME%>);
	
	// 输出视图操作
	var tpl=new Ext.XTemplate(
		'<div style="padding:5px;">',
			'<table class="x-forum-home-tborder" cellpadding="6" cellspacing="1" border="0" width="100%" align="center">',
				'<tr align="center">',
					'<td class="x-forum-home-thead"  align="left">版块</td>',
					'<td class="x-forum-home-thead" width="300" nowrap="nowrap">最新帖</td>',
					'<td class="x-forum-home-thead" width="50">帖子数</td>',
				'</tr>',
				'<tpl for=".">',
				'<tr align="center">',
					'<td class="x-forum-home-alt1Active" align="left">',
						'<div>',
							'<a href="#" onclick="Ext.getCmp(\'<%=panelid%>\').openSubject({id})"><strong>{f_title}</strong></a>',
							'<br><span class="x-forum-home-smallfont"> 版主：{f_administrators}</span>',
						'</div>',
						'<div class="x-forum-home-smallfont">{f_comment}</div>',
					'</td>',
					'<td class="x-forum-home-alt2">',
						'<div class="x-forum-home-smallfont" align="left">',
						'<tpl if="s_id!=\'0\'">',
							'<div style="clear:both">',
								'<strong><a href="#" onclick="Ext.getCmp(\'<%=panelid%>\').openTopic({id}, \'{s_title}\', {s_id})">{s_title}</a></strong>',
							'</div>',
							'<div>',
								'by {s_author_title} on {s_created}',
							'</div>',
						'</tpl>',
						'</div>',
					'</td>',
					'<td class="x-forum-home-alt1"><span class="x-forum-home-smallfont"> {topicNumbers}</span></td>',
				'</tr>',
				'</tpl>',
			'</table>',
		'</div>',
		'<div class="x-clear"></div>'
	);

	var dataView=new Ext.DataView({
		store:store,
		tpl:tpl,
		itemSelector:"div.x-forum-home-detail",
		singleSelect:true
	});

	var fViewPanel = new Ext.Panel({
		border:false,
		region:'center',
		tbar:buttons,
		autoScroll:true,
		items:[dataView]
	});	

	panel.openCotagery = function(id) {
		var modulePanel = MixkyApp.desktop.openModule('mkForum');
		var urlPanel  = modulePanel.openView('mkForum.qForum.vForum');
		if(urlPanel){
			if(urlPanel.refresh){
				urlPanel.refresh.defer(50, urlPanel,[{categoryId:parseInt(id)}]);
			}else{
				urlPanel.initParams = {categoryId:id};
			}
		}
	}

	panel.openAll = function() {
		var modulePanel = MixkyApp.desktop.openModule('mkForum');
		var urlPanel  = modulePanel.openView('mkForum.qForum.vForum');
		if(urlPanel){
			if(urlPanel.refresh){
				urlPanel.refresh.defer(50, urlPanel,[{}]);
			}else{
				urlPanel.initParams = {};
			}
		}
	}
	
	panel.openSubject = function(id) {
		var modulePanel = MixkyApp.desktop.openModule('mkForum');
		var urlPanel  = modulePanel.openView('mkForum.qForum.vForum');
		if(urlPanel){
			if(urlPanel.refresh){
				urlPanel.refresh.defer(50, urlPanel,[{forumId:id, F_FORUM_ID:id}]);
			}else{
				urlPanel.initParams = {forumId:id, F_FORUM_ID:id};
			}
		}
	}

	panel.openTopic = function(forumid, title, id) {
		AppForumDirect.isForumAdmin(forumid, function(result, e) {
			if (result && result.success) {
    			var modulePanel = MixkyApp.desktop.openModule('mkForum');
    			var urlPanel  = modulePanel.openView('mkForum.qForumTopic.vForumTopic');
    			if(urlPanel){
    				if(urlPanel.refresh){
    					urlPanel.refresh({topicId: id, topicTitle: title, forumId: forumid, state: result.state});
    				}else{
    					urlPanel.initParams = {topicId: id, topicTitle: title, forumId: forumid, state: result.state};
    				}
    			}
    		}
    		AppForumDirect.addViewCount(id + '');
    	});
	}
	
	// 视图刷新
	panel.refresh = function(params){
		if(Ext.isDefined(params)){
			panel.params = params;
			if (params.categoryId) {
				AppForumDirect.getCategoryInfo(params.categoryId, function(result, e) {
					if (result && result.success) {
						catagoryText.setText('<a href="#" onclick="Ext.getCmp(\'<%=panelid%>\').openCotagery(' + result.catelogId + ')">' + result.catelogTitle + '</a> ');
					}
				});
			}
		}
		// 初始化参数
		store.baseParams.categoryId = panel.params.categoryId;
		store.load();
	}
	
	
	panel.add(fViewPanel);
	panel.doLayout();
	// 初始化视图数据
	panel.refresh(panel.initParams);
});
</script>