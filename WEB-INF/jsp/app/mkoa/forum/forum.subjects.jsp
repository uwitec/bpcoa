<%@ page contentType="text/html; charset=utf-8"%>
<%@ page import="java.util.List"%>
<%@ page import="com.google.gson.JsonObject"%>
<%@ page import="com.mixky.engine.common.Action"%>
<%@ page import="com.mixky.engine.view.ViewManager"%>
<%@ page import="com.mixky.engine.view.View"%>
<%@ page import="com.mixky.engine.view.Column"%>
<%@ page import="com.mixky.engine.common.DesignObjectLoader"%>
<%@page import="com.garage.xtoolkit.Tools"%>
<%@page import="com.mixky.app.certification.MixkyUserCertification"%>
<%@page import="com.mixky.engine.organization.User"%>
<%@page import="com.mixky.app.mkoa.forum.ForumManager"%>
<%
	String panelid = request.getParameter("panelid");

	View view = DesignObjectLoader.instance().loadDesignObject("mkForum.qForum.vForum");
	List<Column> columns = view.getF_columns();
	List<Action> actions = view.getF_buttons();
	JsonObject cfg = view.getF_config();
	
	User user = MixkyUserCertification.instance().getUserInfo(request);
	String fIdStr = request.getParameter("forumId");
	long state = ForumManager.instance().isForumAdmin(Long.parseLong(fIdStr), user);	
	//String clientIp = Tools.getIpAddr(request);
	String clientIp = request.getRemoteAddr();
%>


<script language='javascript'>
Ext.onReady(function(){

	var panel = Ext.getCmp('<%=panelid%>');
	
	var store = new Ext.data.DirectStore({
		directFn : ViewAppDirect.getViewList,
		paramOrder : ['viewkey','querytype','limit','start','sort','dir','params'],
		baseParams : {viewkey:'<%=view.getKey()%>', querytype:<%=ViewManager.QT_NORMAL%>,limit:<%=view.getF_page_size()%>, start:1, sort:'',dir:'',params:{}},
		remoteSort : true,
		root : 'results',
		totalProperty : 'totals',
		idProperty : 'ID',
		fields : <%=ViewManager.instance().getViewStoreFields(view.getF_columns())%>
	});

	// 显示列
	var columns = <%=ViewManager.instance().getViewColumns(view.getF_columns())%>;

	// 选择器
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
	

	var btnAll = new Ext.Action({
        text:'全部',
		iconCls : 'icon-app-mkoa-forum-all',
        handler: function(btn, pressed) {
			panel.params.F_TAG_FAVOURITE = 0;
			panel.refresh(panel.params);
        }
	});
	buttons.push(btnAll);

	var btnFavourite = new Ext.Action({
        text:'精华',
		iconCls : 'icon-app-mkoa-forum-classical',
        handler: function(btn, pressed) {
			panel.params.F_TAG_FAVOURITE = 1;
			panel.refresh(panel.params);
        }
	});
	buttons.push(btnFavourite);

	buttons.push('->');
	
	
	// 输出视图操作
<%
	for(int i=0;i<view.getF_buttons().size();i++){
		Action action = view.getF_buttons().get(i);
%>
	var <%=action.getF_key()%> = new Ext.Action({
		text : '<%=action.getF_caption()%>',
		iconCls : '<%=action.getF_icon()%>',
		isDefault : <%=action.getF_default()%>,
<%
		if(action.getF_handler() == null || "".equals(action.getF_handler())){
%>
		handler : Ext.emptyFn
<%
		}else{
%>
		handler : <%=action.getF_handler()%>
<%
		}
%>
	});
	buttons.push(<%=action.getF_key()%>);
<%
	}
%>
	
	// 主题检索
	var <%=ViewManager.VN_QUICK_QUERY_FIELD_NAME%> = new Ext.form.TextField({
		width : 100,
		emptyText : '输入检索条件',
        listeners: {
	        specialkey: function(field, e){
	            // e.HOME, e.END, e.PAGE_UP, e.PAGE_DOWN,
	            // e.TAB, e.ESC, arrow keys: e.LEFT, e.RIGHT, e.UP, e.DOWN
	            if (e.getKey() == e.ENTER) {
	            	var value = field.getValue();
	    			if(Ext.isDefined(value) && value != ''){
	    				store.baseParams.querytype = <%=ViewManager.QT_QUICK%>;
	    				panel.queryParams = {<%=ViewManager.VN_QUICK_QUERY_PARAM_NAME%>: value};
	    				panel.refresh();
	    			}
	            }
	        }
	    }
	});
	var <%=ViewManager.VN_QUICK_QUERY_BUTTON_NAME%> = new Ext.Action({
		text : '主题检索',
		iconCls : 'icon-sys-query',
		handler : function(){
			var value = <%=ViewManager.VN_QUICK_QUERY_FIELD_NAME%>.getValue();
			if(Ext.isDefined(value) && value != ''){
				store.baseParams.querytype = <%=ViewManager.QT_QUICK%>;
				panel.queryParams = {<%=ViewManager.VN_QUICK_QUERY_PARAM_NAME%>: value};
				panel.refresh();
			}
		}
	});
	buttons.push('-');
	buttons.push(<%=ViewManager.VN_QUICK_QUERY_FIELD_NAME%>);
	buttons.push(<%=ViewManager.VN_QUICK_QUERY_BUTTON_NAME%>);
	// 刷新按钮
	var <%=ViewManager.VN_REFRESH_BUTTON_NAME%> = new Ext.Action({
		text : '刷新',
		iconCls : 'icon-sys-refresh',
		handler : function(){
			store.baseParams.querytype = <%=ViewManager.QT_NORMAL%>;
			panel.refresh();
		}
	});
	buttons.push('-');
	buttons.push(<%=ViewManager.VN_REFRESH_BUTTON_NAME%>);

	// 渲染主题
	var renderTopic = function(value, p, r){
		if (r.data['F_STATE'] == 0) {
			 return String.format(
		                '<div style="padding-left:0px;background:transparent) no-repeat 0 2px;"><b class="x-forum-home-alt1Active" style="font-size:16px;"><a href="#" onclick="Ext.getCmp(\'<%=panelid%>\').openTopic({3},\'{0}\')">{0}</a></b><br/><span style="color:#333;font-size:10px;">by {1} on {2}</span></div>',
		                r.data['F_TITLE'],
						r.data['F_AUTHOR_TITLE'],
						r.data['F_CREATED'],
						r.data['ID']);
		} else {
			return String.format(
	                '<div style="padding-left:0px;background:transparent) no-repeat 0 2px;"><strike><b class="x-forum-home-alt1Active" style="font-size:16px;"><a href="#" onclick="Ext.getCmp(\'<%=panelid%>\').openTopic({3},\'{0}\')">{0}</a></b><br/></strike><span style="color:#333;font-size:10px;">by {1} on {2}</span></div>',
	                r.data['F_TITLE'],
					r.data['F_AUTHOR_TITLE'],
					r.data['F_CREATED'],
					r.data['ID']);
		}
    };
	// 渲染辅助信息
	var renderFace = function(value, p, r){
        return String.format('<img src="{0}"/>', 
                r.data['F_SUBJECT_TYPE']);
    };

	var renderUpdated = function(value, p, r){
        return String.format('<div style="padding-left:0px;background:transparent) no-repeat 0 2px;"><span style="color:#333;font-size:10px;">{0}</span><br><span style="color:#333;font-size:10px;">{1}</span></div>', 
                r.data['F_REPLY_TITLE'],
                r.data['F_REPLY_TIME']);
    };

    var renderReply = function(value, p, r) {
    	return String.format('<div style="padding-left:0px;background:transparent) no-repeat 0 2px;"><span style="color:#333;font-size:10px;">{0} / {1}</span></div>', 
                r.data['F_REPLY_COUNT'],
                r.data['F_VIEW_COUNT']);
    }

    var renderTop = function(value, p, r) {
		if (value == '1') {
			return "<img src='resources/images/app/forum/top.gif'/>";
		} 
		return "";
    }

    var renderFavourite = function(value, p, r) {
		if (value == '1') {
			return "<img src='resources/images/app/forum/favourite.gif'/>";
		} 
		return "";
    }

	var cm = new Ext.grid.ColumnModel([{
	     header: "",
	     dataIndex: 'F_TAG_TOP',
	     width: 30,
	     align: 'left',
	     renderer: renderTop
	 },{
	     header: "",
	     dataIndex: 'F_TAG_FAVOURITE',
	     width: 30,
	     align: 'left',
	     renderer: renderFavourite
	 },{
	     header: "",
	     dataIndex: 'F_SUBJECT_TYPE',
	     width: 30,
	     align: 'left'
	 },{
		 id: 'topic',
	     header: "主题",
	     dataIndex: 'F_TITLE',
	     renderer: renderTopic
    },{
        id: 'last',
        header: "回复/查看",
        dataIndex: 'F_REPLY',
        width: 80,
        align: 'left',
        renderer: renderReply
    },{
       header: "最后回复",
       dataIndex: 'F_UPDATED',
       width: 100,
       renderer: renderUpdated,
       align: 'left'
    }]);

	//右键
	var contextmenus = [{
		text: '话题置顶',
		iconCls : 'icon-app-mkoa-forum-top',
		handler: function () {panel.topSubject(1);}
	}, { 
		text: '取消置顶',
		iconCls : 'icon-app-mkoa-forum-top',
		handler: function () {panel.topSubject(0);}
	}, { 
		text: '加入精华',
		iconCls : 'icon-app-mkoa-forum-classical',
		handler: function () {panel.favouriteSubject(1);}
	}, { 
		text: '取消精华',
		iconCls : 'icon-app-mkoa-forum-classical',
		handler: function () {panel.favouriteSubject(0);}
	}, { 
		text: '关闭话题',
		iconCls : 'icon-app-mkoa-forum-lock',
		handler: function () {panel.closeSubject();}
	}, { 
		text: '开启话题',
		iconCls : 'icon-app-mkoa-forum-unlock',
		handler : function () {panel.openClosedSubject();}
	}];

	// 表格对象
	var grid = new Ext.grid.GridPanel({
		border : false,
		region:'center',
		enableHdMenu : false,
        loadMask: {msg:'正在装载...'},
        trackMouseOver:false,
        autoExpandColumn: 'topic',
		sm : sm,
		cm : cm,
		store : store,
		tbar : buttons,
		contextMenu : new Ext.menu.Menu({items:contextmenus}),
        bbar: new Ext.PagingToolbar({
        	firstText : '首页',
        	lastText : '尾页',
        	nextText : '下一页',
        	prevText : '上一页',
        	refreshText : '刷新',
        	beforePageText : '第',
        	afterPageText : '页，共 {0} 页',
        	displayMsg : '共 {2} 条，当前显示 {0} 到 {1} 条',
        	emptyMsg : '没有符合条件的主题',
            pageSize: <%=view.getF_page_size()%>,
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
               		value : <%=view.getF_page_size()%>,
               		listeners : {
               			'select' : function(c, record, index){
               				grid.getBottomToolbar().pageSize = c.getValue();
               				grid.getBottomToolbar().changePage(1);
               			}
                   	}
           		})
            ],
            plugins: new Ext.ux.ProgressBarPager({defaultText:'正在装载数据...'})
        }),
		listeners : {
    		'rowcontextmenu':function(grid, rowIndex, e){
	    	    grid.getSelectionModel().selectRow(rowIndex);
				if(this.contextMenu.items.length > 0 && <%=state%> > 0){
					e.preventDefault();
					var record = grid.getSelectionModel().getSelected();
					if (record.get("F_STATE") == 0) {
						this.contextMenu.items.get(4).enable();
						this.contextMenu.items.get(5).disable();
					} else {
						this.contextMenu.items.get(4).disable();
						this.contextMenu.items.get(5).enable();
					}

					if (record.get("F_TAG_TOP") == 0) {
						this.contextMenu.items.get(0).enable();
						this.contextMenu.items.get(1).disable();
					} else {
						this.contextMenu.items.get(0).disable();
						this.contextMenu.items.get(1).enable();
					}

					if (record.get("F_TAG_FAVOURITE") == 0) {
						this.contextMenu.items.get(2).enable();
						this.contextMenu.items.get(3).disable();
					} else {
						this.contextMenu.items.get(2).disable();
						this.contextMenu.items.get(3).enable();
					}
					
					this.contextMenu.showAt(e.getXY());
				}
			},
			'rowdblclick' : function(g, rowIndex, e){
				grid.getSelectionModel().selectRow(rowIndex);
        		var record = grid.getSelectionModel().getSelected();
				var modulePanel = MixkyApp.desktop.openModule('mkForum');
				var urlPanel  = modulePanel.openView('mkForum.qForumTopic.vForumTopic');
				if(urlPanel){
					if(urlPanel.refresh){
						urlPanel.refresh({topicId: parseInt(record.get("ID")), topicTitle: record.get('F_TITLE'), forumId: panel.params.forumId, state: <%=state%>});
					}else{
						urlPanel.initParams = {topicId: parseInt(record.get("ID")), topicTitle: record.get('F_TITLE'), forumId: panel.params.forumId, state: <%=state%>};
					}
				}
				AppForumDirect.addViewCount(record.get("ID"));
			}
		},
		getSelectedRecords : function(){
			return this.getSelectionModel().getSelections();
		}
	});
	
	// 视图刷新
	panel.refresh = function(params){
		if(Ext.isDefined(params)){
			panel.params = params;
			if (params.forumId) {
				AppForumDirect.getForumInfo(params.forumId, function(result, e) {
					if (result && result.success) {
						catagoryText.setText('<a href="#" onclick="Ext.getCmp(\'<%=panelid%>\').openCotagery(' + result.catelogId + ')">' + result.catelogTitle + '</a> ');
						subjectText.setText('<a href="#" onclick="Ext.getCmp(\'<%=panelid%>\').openSubject(' + result.forumId + ')">' + result.forumTitle + '</a> ');
					}
				});
			}
		}
		// 初始化参数
		store.baseParams.params = Ext.apply({F_STATE:<%=state%>},panel.params);
		// 处理查询参数
		if(store.baseParams.querytype != <%=ViewManager.QT_NORMAL%>){
			Ext.apply(store.baseParams.params, panel.queryParams);
		}
		grid.getBottomToolbar().moveFirst();
	}
	
	/**按钮逻辑*/
	// 发起话题
	panel.createSubject = function() {
		MixkyApp.desktop.openDocument('mkForum.docSubject', 0, {F_FORUM_ID:panel.params.forumId, F_REPLY_SUBJECT_ID:0, F_REMOTE_HOST:"<%=clientIp%>"});
	}

	panel.topSubject = function(toped) {
		var record = grid.getSelectionModel().getSelected();
		AppForumDirect.topSubject(record.get("ID"), toped);
		panel.refresh();
	}

	panel.favouriteSubject = function(favourited) {
		var record = grid.getSelectionModel().getSelected();
		AppForumDirect.favouriteSubject(record.get("ID"), favourited);
		panel.refresh();
	}

	panel.openClosedSubject = function() {
		var record = grid.getSelectionModel().getSelected();
		AppForumDirect.openSubject(record.get("ID"));
		panel.refresh();
	}

	panel.closeSubject = function() {
		var record = grid.getSelectionModel().getSelected();
		AppForumDirect.closeSubject(record.get("ID"));
		panel.refresh();
	}

	panel.openTopic = function(id, title) {
		var modulePanel = MixkyApp.desktop.openModule('mkForum');
		var urlPanel  = modulePanel.openView('mkForum.qForumTopic.vForumTopic');
		if(urlPanel){
			if(urlPanel.refresh){
				urlPanel.refresh({topicId: id, topicTitle: title, forumId: panel.params.forumId, state: <%=state%>});
			}else{
				urlPanel.initParams = {topicId: id, topicTitle: title, forumId: panel.params.forumId, state: <%=state%>};
			}
		}
		AppForumDirect.addViewCount(id + '');
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

	
	panel.add(grid);
	panel.doLayout();
	// 初始化视图数据
	panel.refresh(panel.initParams);
});
</script>