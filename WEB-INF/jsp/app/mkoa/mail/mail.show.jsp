<%@ page contentType="text/html; charset=utf-8"%>
<%@page import="com.mixky.engine.organization.User"%>
<%@page import="com.mixky.system.ContextHolder"%>
<%@page import="java.util.List"%>
<%@page import="com.mixky.app.mkoa.mail.MailTag"%>
<%@page import="com.mixky.app.mkoa.mail.MailTagManager"%>

<%
	String id = request.getParameter("id");
	String panelid = request.getParameter("panelid");
	
	User user = ContextHolder.instance().getUserCertification().getUserInfo(request);
	List<MailTag> tags = MailTagManager.instance().getUserPrivateTags(user);
	List<MailTag> mTags = MailTagManager.instance().getMailTags(Long.parseLong(id), user.getId());
%>

<script language='javascript'>
Ext.onReady(function(){

	var panel = Ext.getCmp('<%=panelid%>');

	var btnReply = new Ext.Action({
		text : '回复',
		iconCls : 'icon-app-mkoa-reply',
		handler : function(){
			panel.oprMail(<%=id%>, 'reply');
			var tabpanel = panel.findParentByType('tabpanel');
			tabpanel.remove(panel);
		}
	});

	var btnReplyAll = new Ext.Action({
		text : '回复全部',
		iconCls : 'icon-app-mkoa-replyall',
		handler : function(){
			panel.oprMail(<%=id%>, 'replyall');
			var tabpanel = panel.findParentByType('tabpanel');
			tabpanel.remove(panel);
		}
	});

	var btnFw = new Ext.Action({
		text : '按正文转发',
		iconCls : 'icon-app-mkoa-forward',
		handler : function(){
			panel.oprMail(<%=id%>, 'fw');
			var tabpanel = panel.findParentByType('tabpanel');
			tabpanel.remove(panel);
		}
	});

	var btnFwAtt = new Ext.Action({
		text : '转发',
		iconCls : 'icon-app-mkoa-forwardatt',
		handler : function(){
			panel.oprMail(<%=id%>, 'fwatt');
			var tabpanel = panel.findParentByType('tabpanel');
			tabpanel.remove(panel);
		}
	});

	var btnViewHead = new Ext.Action({
		text : '查看邮件头',
		iconCls : 'icon-sys-query',
		handler : function(){
			Ext.MessageBox.alert('邮件头信息', Ext.get('<%=panelid%>-maildetail').getValue());
		}
	});

	var btnDownload = new Ext.Action({
		text : '原信下载',
		iconCls : 'icon-app-mkoa-downloadmail',
		handler : function(){
			var filename = Ext.get('<%=panelid%>-emlname').getValue();
			var filelocation = Ext.get('<%=panelid%>-emllocation').getValue();
			location.href='mkoa/mail/mailfile.download.do?filename=' + filename + "&filelocation=" + filelocation;
		}
	});

	var tagMenu = new Ext.menu.Menu({        
        items: [
<%
	for (int i = 0; i < tags.size(); i++) {
		boolean checked = false;
		for (int j = 0; j < mTags.size(); j++) {
			if (tags.get(i).getId() == mTags.get(j).getId()) {
				checked = true;
				break;
			}
		}
		
		if (i == 0) {
%>
			{
<%
		}
%>
        	text: '<%=tags.get(i).getF_name()%>',
        	value: <%=tags.get(i).getId()%>,
        	checked: <%=checked%>,
        	checkHandler: function (item, checked){
        		AppMailDirect.tagMail(<%=id%>, item.value, checked, function(result, event) {
    				if (result.success) {
        				var info = '已将邮件打上标签：' + item.text;
        				if (!checked) {
        					info = '已邮件从标签：' + item.text + '中移出';
        				}
        				MixkyApp.showInfoMessage(info, '信息提示');
    				} else {
    					MixkyApp.showInfoMessage('操作失败', '信息提示');
    				}
    			});
            }

<%
		if (i == tags.size() - 1) {
%>
		}
<%
		} else {
%>
		}, { 
<%
		}
	}
%>
      	]
	});

	var moveMenu = new Ext.menu.Menu({        
        items: [
<%
	for (int i = 0; i < tags.size(); i++) {
		if (i == 0) {
%>
			{
<%
		}
%>
        	text: '<%=tags.get(i).getF_name()%>',
        	value: <%=tags.get(i).getId()%>,
        	handler: function (item){
        		AppMailDirect.moveMail(<%=id%>, item.value, function(result, event) {
    				if (result.success) {
        				MixkyApp.showInfoMessage('已经邮件移动到标签：' + item.text + '中！' , '信息提示');
    				} else {
    					MixkyApp.showInfoMessage('操作失败', '信息提示');
    				}
    			});
            }

<%
		if (i == tags.size() - 1) {
%>
		}
<%
		} else {
%>
		}, { 
<%
		}
	}
%>
      	]
	});

	var btnTag = new Ext.Action({
		text : '标签',
		iconCls : 'icon-app-mkoa-tagmail',
		menu: tagMenu
	});

	var btnMove = new Ext.Action({
		text : '移至',
		iconCls : 'icon-app-mkoa-move',
		menu: moveMenu
	});

	var btnDelete = new Ext.Action({
		text : '删除',
		iconCls : 'icon-sys-delete',
		handler : function(){
			AppMailDirect.deleteMail(<%=id%>, function(result, event) {
				if (result.success) {
					MixkyApp.showInfoMessage('删除成功', '信息提示');
					var tabpanel = panel.findParentByType('tabpanel');
					tabpanel.remove(panel);
				} else {
					MixkyApp.showInfoMessage('操作失败', '信息提示');
				}
			});
		}
	});

	// 刷新按钮
	var btnRefresh = new Ext.Action({
		text : '刷新',
		iconCls : 'icon-sys-refresh',
		handler : function(){
			panel.refresh();
		}
	});


	
	var buttons = ['->', btnReply, btnReplyAll, btnFwAtt, '-', btnMove, btnTag, btnDelete, '-', btnViewHead, btnDownload, btnRefresh];

	
	var statPanel = new Ext.Panel({
		tbar : buttons,
	    layout:'fit',
	    border : false,
		bodyCssClass : 'mixky-report-div',
		autoScroll : true
	});

	// 视图刷新
	panel.refresh = function(params){
		if(Ext.isDefined(params) || !Ext.isDefined(panel.mParams)){
			var mParams = Ext.apply({}, params);
			mParams.url = 'app/mkoa/mail/mail.show.details';
			mParams.id = <%=id%>
			mParams.panelid = '<%=panelid%>'
			panel.mParams = mParams;
		}
		statPanel.load({
			url : 'page.do',
			params : panel.mParams,
			scripts: true
		});
	};

	panel.oprMail = function(id, loadType) {
		var module = MixkyApp.desktop.openModule('mkMail');
		module.openJspUrl(
			'mail' + loadType + id, 
			'app/mkoa/mail/mail.draft', 
			{
				id: id,
				loadType: loadType
			}, {
				autoScroll:true, 
				title:'写邮件', 
				layout:'fit'
			}
		);
	};
	
	// 输出附加脚本 end
	panel.add(statPanel);
	panel.doLayout();
	// 初始化视图数据
	panel.refresh(panel.initParams);
});
</script>