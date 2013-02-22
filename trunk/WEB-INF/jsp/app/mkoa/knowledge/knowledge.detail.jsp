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
		directFn : AppKnowledgeDirect.getKnowledgeDetail,
		paramOrder:['id'],
		baseParams:{id:0},
		root : 'results',
		totalProperty : 'totals',
		idProperty : 'ID',
		fields:["ID","F_TITLE","F_CREATOR_NAME","F_CREATED","F_CONTENT", "F_TAG", "F_FILES", "VALUES1", "VALUES2", "VALUES3", "VALUES4", "VALUES5" ]
	});

	var comentStore = new Ext.data.DirectStore({
		directFn : AppKnowledgeDirect.getKnowledgeComments,
		paramOrder:['id','limit','start'],
		baseParams:{id:0, limit:50, start:0},
		root : 'results',
		totalProperty : 'totals',
		idProperty : 'ID',
		fields:["ID","F_POSITION","F_CREATOR_NAME","F_CREATED","F_CONTENT"]
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
		iconCls : 'icon-app-refresh',
		handler : function(){
			panel.refresh();
		}
	});

	var buttons = <%=ViewManager.instance().getViewButtonNames(view, actions)%>;

    var tpl=new Ext.XTemplate(
   		'<tpl for=".">',
   			'<div class="x-forum-thread-detail">',
   				'<div class="x-forum-thread-inner">',
   					'<div class="x-forum-thread-header">',
   						'<table width="100%">',
	   						'<tr>',
	   							'<td>',
	   								'<div class="x-forum-thread-header-info"><b>&nbsp;正文</b>&nbsp;&nbsp;{F_CREATOR_NAME}({F_CREATED})</div>',
	   							'</td>',
	   						'</tr>',
   						'</table>',
   					'</div>',
   					'<div class="x-forum-thread-body">',
   						'<div class="x-forum-thread-body-inner">',
   						'<div class="x-knowledge-thread-title"><b>{F_TITLE}</b></div><div class="x-knowledge-thread-tag">标签：{F_TAG}</div>',
   						'<div class="x-forum-thread-desc">{F_CONTENT}</div>',
   						'<tpl for="F_FILES">',
   							'<div class="x-forum-thread-attach">',
   							'<tpl if="ISIMAGE==\'1\'">',
   								Ext.isIE ? '' : '<image title="{F_NAME}" src="engine/file/sysdownload.do?tablename=T_MK_SYS_FILES&fieldname=F_CONTENT&id={ID}&filename={F_NAME}" class="mixky-detail-image"/>', 
   								'<div class="x-forum-thread-attach">',
   									'<img class="function-file-download" src="resources/images/app/forum/attach.png" style="cursor:pointer"></img><a class="x-forum-thread-attach-link" href="#" onclick="Ext.getCmp(\'<%=panelid%>\').downloadFile({ID});"><b>{F_NAME}</b></a>',
   								'</div>',
   								'<br>',
   							'</tpl>',
   							'</div>',
   						'</tpl>',
   						'<tpl for="F_FILES">',
   							'<tpl if="ISIMAGE==\'0\'">',
   								'<div class="x-forum-thread-attach"><img class="function-file-download" src="resources/images/app/forum/attach.png" style="cursor:pointer"></img><a class="x-forum-thread-attach-link" href="#" onclick="Ext.getCmp(\'<%=panelid%>\').downloadFile({ID});"><b>{F_NAME}</b></a></div>',
   							'</tpl>',
   						'</tpl>',
   						'<div class="x-knowledge-thread-value">对本文的评价</div>',
   						'<div style="padding-left:10px">',
   							'<br>',
							'<input class="x-form-radio" type="RADIO" name="knowledgeRationg" value=1> 太差！－1分 ({VALUES1})<br>',
 							'<input class="x-form-radio" type="RADIO" name="knowledgeRationg" value=2> 需提高，0分 ({VALUES2})<br>',
 							'<input class="x-form-radio" type="RADIO" name="knowledgeRationg" value=3> 一般；尚可，1分 ({VALUES3})<br>',
 							'<input class="x-form-radio" type="RADIO" name="knowledgeRationg" value=4> 好文章，2分 ({VALUES4})<br>',
 							'<input class="x-form-radio" type="RADIO" name="knowledgeRationg" value=5> 真棒！3分 ({VALUES5})<br><br>',
 							'<input onclick="javascript:Ext.getCmp(\'<%=panelid%>\').evaluate(event)" class="x-forum-thread-footer-submit" type="button" value="提交评价" />',
   							'<br><br>',
   						'</div>',
   					'</div>',
   				'</div>',
   			'</div>',
   		'</tpl>',
   		'<div class="x-clear"></div>'
   	);

	var dataView=new Ext.DataView({
		store:store,
		tpl:tpl,
		itemSelector:"div.x-forum-thread-detail-00",
		singleSelect:true
	});

	panel.evaluate = function(event){
		var el = Ext.get(event.target || window.event.srcElement).parent();
		var inputs = el.dom.getElementsByTagName("input");
		var checkedvalue = 0;
		for (var i = 0; i < inputs.length; i++) {
			if (inputs[i].checked) {
				checkedvalue = parseInt(inputs[i].value);
			}
		}
		if (checkedvalue == 0) {
			MixkyApp.showErrorMessage('请先对本文进行评价，再提交！', '信息提示');
		} else {
			AppKnowledgeDirect.evaluate(store.baseParams.id, checkedvalue, function(result, event) {
				if (!result.success) {
					MixkyApp.showErrorMessage('您已对本文进行过评价，提交无效！', '信息提示');
				} else {
					MixkyApp.showInfoMessage('您的评价已生效！', '信息提示');
					panel.refresh();
				}
			});
		}
		
	}
		
	var commentTpl = new Ext.XTemplate(
		'<tpl for=".">',
			'<div class="x-forum-thread-detail">',
				'<div class="x-forum-thread-inner">',
					'<div class="x-forum-thread-header">',
						'<table width="100%">',
							'<tbody>',
								'<tr>',
									'<td>',
										'<div class="x-forum-thread-header-info"><b>&nbsp;#{F_POSITION}</b>&nbsp;&nbsp;{F_CREATOR_NAME}({F_CREATED})</div>',
									'</td>',
									'<td class="x-forum-thread-header-tool">', 
									'</td>',
								'</tr>',
							'</tbody>',
						'</table>',
					'</div>',
					'<div class="x-forum-thread-body">',
						'<div class="x-forum-thread-body-inner">',
							'<div class="x-forum-thread-desc">{F_CONTENT}</div>',
						'</div>',
					'</div>',
				'</div>',
			'</div>',
		'</tpl>',
		'<div class="x-clear"></div>'
	);
	
	var commentDataView=new Ext.DataView({
		store:comentStore,
		tpl:commentTpl,
		itemSelector:"div.x-forum-thread-detail",
		singleSelect:true
	});

	

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
        store: comentStore,
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
        ],
        plugins: new Ext.ux.ProgressBarPager({defaultText:'正在装载数据...'})
    });


    var fViewPanel = new Ext.Panel({
        border:false,
    	region:'center',
		tbar:buttons,
		autoScroll:true,
		items:[dataView, commentDataView],
		bbar:pagebar
    });

    panel.downloadFile = function(id) {
		location.href = "engine/file/sysdownload.do?id=" + id + "&documentdbtype=none&fieldname=F_FILES&documentkey=mkKnowledge.DocKnowledgeDetail";
	};

	panel.openTopic = function(id, title, forumId, state) {
		var modulePanel = MixkyApp.desktop.openModule('mkForum');
		var urlPanel  = modulePanel.openView('mkForum.qForumTopic.vForumTopic');
		if(urlPanel){
			if(urlPanel.refresh){
				urlPanel.refresh({topicId: parseInt(id), topicTitle: title, forumId: parseInt(forumId), state: parseInt(state)});
			}else{
				urlPanel.initParams = {topicId: parseInt(id), topicTitle: title, forumId: parseInt(forumId), state: parseInt(state)};
			}
		}
		AppForumDirect.addViewCount(id + '');
	}

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
		pagebar.moveFirst();
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