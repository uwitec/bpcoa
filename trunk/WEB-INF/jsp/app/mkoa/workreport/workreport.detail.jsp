<%@ page contentType="text/html; charset=utf-8"%>
<%@page import="com.mixky.engine.organization.User"%>
<%@page import="com.mixky.app.certification.MixkyUserCertification"%>
<%@page import="com.mixky.engine.view.View"%>
<%@page import="com.mixky.engine.common.Action"%>
<%@page import="com.mixky.engine.view.ViewManager"%>
<%@page import="com.mixky.engine.authority.AuthorityManager"%>
<%@page import="java.util.List"%>

<%
	String panelid = request.getParameter("panelid");
	View view = (View)request.getAttribute("view");

	User user = MixkyUserCertification.instance().getUserInfo(request);
	List<Action> actions = AuthorityManager.instance().getDesignObjectsByUser(view.getF_buttons(), user);

%>

<script language='javascript'>

Ext.onReady(function(){

	var panel = Ext.getCmp('<%=panelid%>');

	// 数据访问
	var store = new Ext.data.DirectStore({
		directFn : AppWorkReportDirect.getWorkReportDetail,
		paramOrder:['id'],
		baseParams:{id:0},
		root : 'results',
		totalProperty : 'totals',
		idProperty : 'ID',
		fields:["ID","F_TITLE","F_CREATOR_NAME","F_CREATED","F_CONTENT", "F_CREATOR_DEPT", "F_SCOPS", "F_FILES"]
	});

	var comentStore = new Ext.data.DirectStore({
		directFn : AppWorkReportDirect.getWorkReportComments,
		paramOrder:['id'],
		baseParams:{id:0},
		root : 'results',
		totalProperty : 'totals',
		idProperty : 'ID',
		fields:["ID","F_CREATOR_NAME","F_CREATED","F_CONTENT", "F_POSITION"]
	});

	// 视图操作
	<%
		for(int i=0;i<actions.size();i++){
			Action action = actions.get(i);
	%>
		var <%=action.getF_key()%> = new Ext.Action({
			text : '<%=action.getF_caption()%>',
			iconCls : '<%=action.getIcon()%>',
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
	<%
		}
	%>
	

	// 刷新按钮
	var btnRefresh = new Ext.Action({
		text : '刷新',
		iconCls : 'icon-sys-refresh',
		handler : function(){
			panel.refresh();
		}
	});

	var buttons = <%=ViewManager.instance().getViewButtonNames(view, actions)%>;

	var html = '<tpl for=".">' 
				+ '<div class="x-forum-thread-detail"><div class="x-forum-thread-inner"><div class="x-forum-thread-header">' 
					+ '<table width="100%"><tbody><tr><td>' 
						+ '<div class="x-forum-thread-header-info"><b>&nbsp;正文</b>&nbsp;&nbsp;{F_CREATOR_DEPT}&nbsp;&nbsp;{F_CREATOR_NAME}({F_CREATED})</div>' 
					+ '</td><td class="x-forum-thread-header-tool">' 
						+ '<tpl if="false == true"><img class="x-forum-thread-header-tool-edit" src=""></img><img class="x-forum-thread-header-tool-delete" src=""></img></tpl>' 
					+ '</td></tr></tbody></table>' 
				+ '</div><div class="x-forum-thread-body"><div class="x-forum-thread-body-inner">' 
				+ '<div class="x-knowledge-thread-title"><b>{F_TITLE}</b></div><div class="x-knowledge-thread-tag">发布范围：{F_SCOPS}</div>' 
				+ '<div class="x-forum-thread-desc">{F_CONTENT}</div>'
				+ '<tpl for="F_FILES"><div class="x-forum-thread-attach"><img class="function-file-download" src="resources/images/app/forum/attach.png" style="cursor:pointer"></img><a class="x-forum-thread-attach-link" href="#" onclick="Ext.getCmp(\'<%=panelid%>\').downloadFile({ID});"><b>{F_NAME}</b></a></div></tpl>' 
				//+ '<div class="x-forum-thread-footer"><input class="x-forum-thread-footer-quote" type="button" value="引用" /></div>' 
				+ '</div></div></div></div>' 
				+ '</tpl><div class="x-clear"></div>';


    var tpl=new Ext.XTemplate(html);

	var dataView=new Ext.DataView({
		store:store,
		tpl:tpl,
		itemSelector:"div.x-forum-thread-detail",
		//selectedClass: '',
		singleSelect:true
	});

	
	var commentHtml = '<tpl for=".">' 
		+ '<div class="x-forum-thread-detail"><div class="x-forum-thread-inner"><div class="x-forum-thread-header">' 
			+ '<table width="100%"><tbody><tr><td>' 
				+ '<div class="x-forum-thread-header-info"><b>&nbsp;# {F_POSITION}</b>&nbsp;&nbsp;{F_CREATOR_NAME}({F_CREATED})</div>' 
			+ '</td><td class="x-forum-thread-header-tool">' 
				+ '<tpl if="false == true"><img class="x-forum-thread-header-tool-edit" src=""></img><img class="x-forum-thread-header-tool-delete" src=""></img></tpl>' 
			+ '</td></tr></tbody></table>' 
		+ '</div><div class="x-forum-thread-body"><div class="x-forum-thread-body-inner">' 
		//+ '<div class="x-forum-thread-author"><b>{F_CREATOR_NAME}</b></div>' 
		+ '<div class="x-forum-thread-desc">{F_CONTENT}</div>'
		//+ '<tpl if="false == true"><div class="x-forum-thread-attach"><img class="function-file-download" src="images/icons/attach.png" style="cursor:pointer"></img><a class="x-forum-thread-attach-link" href="#">Download attached file <b></b></a></div></tpl>' 
		+ '</div></div></div></div>' 
		+ '</tpl><div class="x-clear"></div>';


	var commentTpl=new Ext.XTemplate(commentHtml);
	
	var commentDataView=new Ext.DataView({
		store:comentStore,
		tpl:commentTpl,
		itemSelector:"div.x-forum-thread-detail",
		singleSelect:true
	});

	

    var fViewPanel = new Ext.Panel({
        border:false,
    	region:'center',
		tbar:buttons,
		autoScroll:true,
		items:[dataView, commentDataView]
    });

    panel.downloadFile = function(id) {
		location.href = "engine/file/sysdownload.do?id=" + id + "&documentdbtype=none&fieldname=F_FILES&documentkey=mkKnowledge.DocKnowledgeDetail";
	};

	store.on('load', function(s, rs){
		var r = rs[0];
		panel.setTitle(Ext.util.Format.ellipsis(r.get('F_TITLE'), 15));
	});

	// 视图刷新
	panel.refresh = function(params){
		if(Ext.isDefined(params)){
			panel.params = params;
		}
		// 初始化参数
		store.baseParams.id = parseInt(panel.params.id);
		comentStore.baseParams.id = parseInt(panel.params.id);
		store.load();
		comentStore.load();
	};

	/**按钮逻辑*/

	// 输出附加脚本 begin

	// 输出附加脚本 end
	panel.add(fViewPanel);
	panel.doLayout();
	// 初始化视图数据
	panel.refresh(panel.initParams);
  
});


</script>