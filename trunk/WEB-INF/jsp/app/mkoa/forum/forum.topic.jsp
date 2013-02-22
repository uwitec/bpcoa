<%@ page contentType="text/html; charset=utf-8"%>
<%@page import="com.mixky.engine.organization.User"%>
<%@page import="com.mixky.app.certification.MixkyUserCertification"%>
<%@page import="com.mixky.app.mkoa.forum.ForumManager"%>

<%
	String panelid = request.getParameter("panelid");
	User user = MixkyUserCertification.instance().getUserInfo(request);
	
	String clientIp = request.getRemoteAddr();
%>

<script language='javascript'>

Ext.onReady(function(){

	var panel = Ext.getCmp('<%=panelid%>');

	// 数据访问
	var store = new Ext.data.DirectStore({
		directFn : AppForumDirect.getTopicList,
		paramOrder:['topicId', 'state','limit','start'],
		baseParams:{topicId:0, state:0, limit:50, start:0},
		root : 'results',
		totalProperty : 'totals',
		idProperty : 'ID',
		fields:["ID","F_TITLE","F_AUTHOR_TITLE","F_CREATED","F_UPDATER","F_UPDATED","F_CONTENT","F_POSITION","F_STATE", "F_SUBJECT_TYPE", "F_FILES"]
	});

	var sm = new Ext.grid.RowSelectionModel({singleSelect:true});

	// 视图按钮
	var buttons = [];

	buttons.push({
		xtype: 'tbtext',
		text: '<a href="#" onclick="Ext.getCmp(\'<%=panelid%>\').openAll()">论坛列表</a> >>'
	});
	var catagoryText = new Ext.Toolbar.TextItem({
		text: ''
	});
	buttons.push(catagoryText);
	buttons.push({xtype: 'tbtext', text: ' >> '});
	var subjectText = new Ext.Toolbar.TextItem({
		text: ''
	});
	buttons.push(subjectText);
	

	buttons.push('->');
	
	// 输出视图操作

	var btnReplyTopic = new Ext.Action({
		text : '回复话题',
		iconCls : 'icon-app-mkoa-forum-replay',
		isDefault : false,
		handler : function () {panel.replySubject();}
	});
	buttons.push(btnReplyTopic);

	var btnFW = new Ext.Action({
		text : '转到知识库',
		iconCls : 'icon-sys-refresh',
		handler : function(){
			AppForumDirect.getForumSubjectJsonObj(store.baseParams.topicId + '', function(result, event) {
				var fcontent = result.f_content + '<br/><a href=# class="x-forum-fwto-knowledge" topicId=' + store.baseParams.topicId 
				+ ' state="' + store.baseParams.state + '" forumTitle="' + result.f_title + '" forumId=' + result.f_forum_Id + ' >来源于电子论坛，点击此处查看原贴<a/>'
				MixkyApp.desktop.openDocument('mkKnowledge.docKnowledgeDetail', 0, {F_TITLE: result.f_title, F_CONTENT:fcontent});
			});
		}
	});
	buttons.push(btnFW);

	if (panel.initParams.state > 0) {	
		buttons.push('-');
		var btnOpenTopic = new Ext.Action({
			text : '开启话题',
			iconCls : 'icon-app-mkoa-forum-unlock',
			isDefault : false,
			handler : function () {panel.openClosedSubject();}
		});
		//buttons.push(btnOpenTopic);
		
		var btnCloseTopic = new Ext.Action({
			text : '关闭话题',
			iconCls : 'icon-app-mkoa-forum-lock',
			isDefault : false,
			handler : function () {panel.closeSubject();}
		});
		buttons.push(btnCloseTopic);
	
		var btnSetTop = new Ext.Action({
			text : '话题置顶',
			iconCls : 'icon-app-mkoa-forum-top',
			isDefault : false,
			handler : function () {panel.topSubject(1);}
		});
		buttons.push(btnSetTop);
	
		var btnSetFavourate = new Ext.Action({
			text : '设为精华',
			iconCls : 'icon-app-mkoa-forum-classical',
			isDefault : false,
			handler : function () {panel.favouriteSubject(1);}
		});
		buttons.push(btnSetFavourate);
	}

	// 刷新按钮
	var btnRefresh = new Ext.Action({
		text : '刷新',
		iconCls : 'icon-sys-refresh',
		handler : function(){
			panel.refresh();
		}
	});
	buttons.push('-');
	buttons.push(btnRefresh);

	// 渲染主题
	var rdAuthor = function(value, p, r){
        return String.format(
                '<div style="padding-left:0px;background:transparent) no-repeat 0 2px;"><br/>'
                 + '<span style="color:#333;font-size:10px;">{0}</span><br/>' 
                 + '<span style="color:#333;font-size:10px;">{1}</span><br/>'
                 + '<br/><span style="color:#333;font-size:10px;">{2}</span></div>',
                r.data['F_AUTHOR_TITLE'],
                r.data['F_CREATED'],
				r.data['F_POSITION']);
    };
	// 渲染辅助信息
	var rdContent = function(value, p, r){
		 return String.format(
                '<div style="padding-left:0px;background:transparent no-repeat 0 2px;"><b style="display:block;color:#333;font-size:15px;">{0}</b><hr><span style="color:#333;">{1}</span>',
                r.data['F_TITLE'],
				r.data['F_CONTENT']);
    };
	
	// 显示列
	var cm = new Ext.grid.ColumnModel([{
	     header: "作者",
	     dataIndex: 'F_AUHTOR',
	     width: 120,
	     align: 'center',
	     renderer: rdAuthor
	 },{
		 id: "topic",
	     header: "内容",
	     dataIndex: 'F_CONTENT',
	     align: 'left',
	     renderer: rdContent
    }]);

	var tpl;
	if (panel.initParams.state > 0) {
		tpl = new Ext.XTemplate(
			'<tpl for=".">',
				'<tpl if="F_STATE!=0">',
					'<strike>',
				'</tpl>',
				'<div class="x-forum-thread-detail">',
					'<div class="x-forum-thread-inner">',
						'<div class="x-forum-thread-header">',
							'<table width="100%">',
								'<tr>',
									'<td>',
										'<div class="x-forum-thread-header-info">',
											'<b>&nbsp;# {F_POSITION}</b>&nbsp;&nbsp;{F_AUTHOR_TITLE}({F_CREATED})',
										'</div>',
									'</td>',
								'</tr>',
							'</table>',
						'</div>',
							'<div class="x-forum-thread-body">',
								'<div class="x-forum-thread-body-inner">',
									'<div class="x-forum-thread-author"><b>{F_TITLE}&nbsp;&nbsp;{F_SUBJECT_TYPE}</b></div>',
									'<div class="x-forum-thread-desc">{F_CONTENT}</div>',
									'<tpl for="F_FILES">',
										'<tpl if="ISIMAGE==1">',
											Ext.isIE ? '' : '<img src="{[this.getImageUrl(values.ID, values.F_NAME)]}" class="mixky-detail-image">',
											'<div class="x-forum-thread-attach">',
												'<img class="function-file-download" src="resources/images/app/forum/attach.png" style="cursor:pointer"><a class="x-forum-thread-attach-link" href="#" onclick="javascript:Ext.getCmp(\'<%=panelid%>\').downloadFile({ID});"><b>{F_NAME}</b></a>',
											'</div>',
											'<br>',
										'</tpl>',
									'</tpl>',
									'<tpl for="F_FILES">',
										'<tpl if="ISIMAGE==0">',
											'<div class="x-forum-thread-attach">',
												'<img class="function-file-download" src="resources/images/app/forum/attach.png" style="cursor:pointer"><a class="x-forum-thread-attach-link" href="#" onclick="javascript:Ext.getCmp(\'<%=panelid%>\').downloadFile({ID});"><b>{F_NAME}</b></a>',
											'</div>',
										'</tpl>',
									'</tpl>',
									'<div class="x-forum-thread-footer">',
									'<tpl if="F_POSITION!=1">',
										'<tpl if="F_STATE==0">',
											'<input class="x-forum-thread-footer-close" type="button" value="关闭回复" />',
										'</tpl>',
										'<tpl if="F_STATE!=0">',
											'<input class="x-forum-thread-footer-open" type="button" value="开启回复" />',
										'</tpl>',
									'</tpl>',
									'<tpl if="F_AUTHOR_TITLE == \'<%=user.getF_caption()%>\'">',
										'<tpl if="F_POSITION==1">',
											'<input class="x-forum-thread-footer-edit" type="button" value="编辑" />',
										'</tpl>',
									'</tpl>',
									'<input class="x-forum-thread-footer-quote" type="button" value="引用" />',
								'</div>',
							'</div>',
						'</div>',
					'</div>',
				'</div>',
				'<tpl if="F_STATE!=0">',
					'</strike>',
				'</tpl>',
			'</tpl>',
			'<div class="x-clear"></div>',
		    {
		        compiled: true,
		        getImageUrl: function(id, name){
		            return 'engine/file/sysdownload.do?tablename=T_MK_SYS_FILES&fieldname=F_CONTENT&id=' + id + '&filename=' + name;
		        }
		    }
		);
	}else{
		tpl = new Ext.XTemplate(
			'<tpl for=".">',
				'<div class="x-forum-thread-detail">',
					'<div class="x-forum-thread-inner">',
						'<div class="x-forum-thread-header">',
							'<table width="100%">',
								'<tr>',
									'<td>',
										'<div class="x-forum-thread-header-info"><b>&nbsp;# {F_POSITION}</b>&nbsp;&nbsp;{F_AUTHOR_TITLE}({F_CREATED})</div>',
									'</td>',
								'</tr>',
							'</table>',
						'</div>',
						'<div class="x-forum-thread-body">',
							'<div class="x-forum-thread-body-inner">',
								'<div class="x-forum-thread-author"><b>{F_TITLE}</b>&nbsp;&nbsp;{F_SUBJECT_TYPE}</div>',
								'<div class="x-forum-thread-desc">{F_CONTENT}</div>',
								'<tpl for="F_FILES">',
									'<tpl if="ISIMAGE==1">',
										Ext.isIE ? '' : '<img src="{[this.getImageUrl(values.ID, values.F_NAME)]}" class="mixky-detail-image">',
										'<div class="x-forum-thread-attach">',
											'<img class="function-file-download" src="resources/images/app/forum/attach.png" style="cursor:pointer"><a class="x-forum-thread-attach-link" href="#" onclick="javascript:Ext.getCmp(\'<%=panelid%>\').downloadFile({ID});"><b>{F_NAME}</b></a>',
										'</div>',
										'<br>',
									'</tpl>',
								'</tpl>',
								'<tpl for="F_FILES">',
									'<tpl if="ISIMAGE==0">',
										'<div class="x-forum-thread-attach">',
											'<img class="function-file-download" src="resources/images/app/forum/attach.png" style="cursor:pointer"><a class="x-forum-thread-attach-link" href="#" onclick="javascript:Ext.getCmp(\'<%=panelid%>\').downloadFile({ID});"><b>{F_NAME}</b></a>',
										'</div>',
									'</tpl>',
								'</tpl>',
								'<div class="x-forum-thread-footer">',
									'<input class="x-forum-thread-footer-quote" type="button" value="引用" />',
									'<tpl if="F_AUTHOR_TITLE == \'<%=user.getF_caption()%>\'">',
										'<tpl if="F_POSITION==1">',
											'<input class="x-forum-thread-footer-edit" type="button" value="编辑" />',
										'</tpl>',
									'</tpl>',
								'</div>',
							'</div>',
						'</div>',
					'</div>',
				'</div>',
			'</tpl>',
			'<div class="x-clear"></div>',
		    {
		        compiled: true,
		        getImageUrl: function(id, name){
		            return 'engine/file/sysdownload.do?tablename=T_MK_SYS_FILES&fieldname=F_CONTENT&id=' + id + '&filename=' + name;
		        }
		    }
		);
	}
	var dataView=new Ext.DataView({
		store:store,
		tpl:tpl,
		itemSelector:"div.x-forum-thread-detail",
		singleSelect:true
	});
	dataView.on("click",function(dv,index,node,e){
		var tgEl = Ext.get(e.getTarget());
		var rd = store.getAt(index);
		if(tgEl.hasClass("x-forum-thread-footer-quote")){
			var author=rd.data.F_AUTHOR_TITLE;
			var desc=rd.data.F_CONTENT;
			var rContent = '<br><div style="padding:10px 20px 10px 20px;"><b style="font-size:14px;">引用:</b>' 
							+ '<div style="border:1px solid silver;padding:5px;background:rgb(239,239,239);">' 
							+ '<b style="font-size:12px;">Originally Posted by '+author+"</b><br><br>"+desc+"</div></div><br><br>";
			var id = panel.params.topicId;
			var title = "回复: " + panel.params.topicTitle;
			MixkyApp.desktop.openDocument('mkForum.docReSubject', 0, {F_CONTENT:rContent, F_FORUM_ID:panel.initParams.forumId, F_REPLY_SUBJECT_ID:id, F_TITLE:title, F_REMOTE_HOST:"<%=clientIp%>"});
		} else if (tgEl.hasClass("x-forum-thread-footer-close")) {
			var tgEl = Ext.get(e.getTarget());
			var rd = store.getAt(index);
			AppForumDirect.closeSubject(rd.get("ID") + '');
			panel.refresh();
		} else if (tgEl.hasClass("x-forum-thread-footer-open")) {
			var tgEl = Ext.get(e.getTarget());
			var rd = store.getAt(index);
			AppForumDirect.openSubject(rd.get("ID") + '');
			panel.refresh();
		} else if (tgEl.hasClass("x-forum-thread-footer-edit")) {
			MixkyApp.desktop.openDocument('mkForum.docSubject', panel.params.topicId, {});
		}
	},this);

	var pagebar = new Ext.PagingToolbar({
    	firstText : '首页',
    	lastText : '尾页',
    	nextText : '下一页',
    	prevText : '上一页',
    	refreshText : '刷新',
    	beforePageText : '第',
    	afterPageText : '页，共 {0} 页',
    	displayMsg : '共 {2} 条，当前显示 {0} 到 {1} 条',
    	emptyMsg : '没有符合条件的主题',
        pageSize: 50,
        store: store,
        displayInfo: true,
        items : [
            '-',
            '每页显示:',
            new Ext.form.ComboBox({
                editable : false,
                triggerAction: 'all',
                width : 50,
           		store : [10, 20, 30, 50, 100, 200],
           		value : 50,
           		listeners : {
           			'select' : function(c, record, index){
            			pagebar.pageSize = c.getValue();
            			pagebar.changePage(1);
           			}
               	}
       		})
        ]
    });


    var fViewPanel = new Ext.Panel({
        border : false,
		tbar : buttons,
		autoScroll : true,
		items : dataView,
		bbar:pagebar
    });

	// 视图刷新
	panel.refresh = function(params){
		if(Ext.isDefined(params)){
			panel.params = params;
			if (params.topicId) {
				AppForumDirect.getTopicForumInfo(params.topicId, function(result, e) {
					if (result && result.success) {
						catagoryText.setText('<a href="#" onclick="Ext.getCmp(\'<%=panelid%>\').openCotagery(' + result.catelogId + ')">' + result.catelogTitle + '</a> ');
						subjectText.setText('<a href="#" onclick="Ext.getCmp(\'<%=panelid%>\').openSubject(' + result.forumId + ')">' + result.forumTitle + '</a> ');
					}
				});
			}
		}
		// 初始化参数
		store.baseParams.topicId = panel.params.topicId;
		store.baseParams.state = panel.params.state;
		//store.reload();
		pagebar.moveFirst();

		panel.setTitle(Ext.util.Format.ellipsis(panel.params.topicTitle, 15));
	}

	/**按钮逻辑*/
	// 发起话题
	panel.createSubject = function() {
		MixkyApp.desktop.openDocument('mkForum.docSubject', 0, {F_FORUM_ID:panel.initParams.forumId, F_REPLY_SUBJECT_ID:0, F_REMOTE_HOST:"<%=clientIp%>"});
	}

	// 回复话题
	panel.replySubject = function() {
		var id = panel.params.topicId;
		var title = "回复: " + panel.params.topicTitle;
		MixkyApp.desktop.openDocument('mkForum.docReSubject', 0, {F_FORUM_ID:panel.initParams.forumId, F_REPLY_SUBJECT_ID:id, F_TITLE:title, F_REMOTE_HOST:"<%=clientIp%>"});
	}

	panel.topSubject = function(toped) {
		AppForumDirect.topSubject(panel.params.topicId + "", toped);
	}

	panel.favouriteSubject = function(favourited) {
		AppForumDirect.favouriteSubject(panel.params.topicId + "", favourited);
	}

	panel.openClosedSubject = function() {
		AppForumDirect.openSubject(panel.params.topicId + "");
	}

	panel.closeSubject = function() {
		AppForumDirect.closeSubject(panel.params.topicId + "");
	}

	panel.openReply = function() {
		var record = grid.getSelectionModel().getSelected();
		AppForumDirect.openSubject(record.get("ID"));
	}

	panel.closeReply = function() {
		var record = grid.getSelectionModel().getSelected();
		AppForumDirect.closeSubject(record.get("ID"));
	}

	panel.downloadFile = function(id) {
		location.href = "engine/file/sysdownload.do?id=" + id + "&documentdbtype=none&fieldname=F_FILES&documentkey=mkForum.docSubject";
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
	
	// 输出附加脚本 begin

	// 输出附加脚本 end
	panel.add(fViewPanel);
	panel.doLayout();
	// 初始化视图数据
	panel.refresh(panel.initParams);
  
});


</script>