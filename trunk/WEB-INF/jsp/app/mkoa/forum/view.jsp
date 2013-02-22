<%@ page contentType="text/html; charset=utf-8"%>
<%@ page import="java.util.List"%>
<%@ page import="com.google.gson.JsonObject"%>
<%@ page import="com.mixky.engine.view.View"%>
<%@ page import="com.mixky.engine.view.ViewManager"%>
<%@ page import="com.mixky.engine.view.Column"%>
<%@ page import="com.mixky.engine.common.Action"%>
<%
	String panelid = request.getParameter("panelid");
	View view = (View)request.getAttribute("view");
	List<Column> columns = view.getF_columns();
	List<Action> actions = view.getF_buttons();
	JsonObject cfg = view.getF_config();
%>

<script language='javascript'>
Ext.onReady(function(){

	var panel = Ext.getCmp('<%=panelid%>');

	var subpanel = new Ext.Panel({
		border : false,
		autoScroll : true,
		layout : 'fit'
	});
	// 获得视图页面对象
	subpanel.getViewPanel = function(){
		return panel;
	}
	// 装载子页面
	panel.loadUrl = function(type){
		var params = {panelid : subpanel.getId()};
		if(Ext.isDefined(panel.initParams)){
			// TODO:
		}
		params.viewkey = '';
		if (type == 'forum-home') {
			params.url = "app/mkoa/forum/forum.home";
		} else if (type == 'forum-forums') {
			params.url = "app/mkoa/forum/forum.subject.home";
		} else if (type == 'forum-subjects') {
			params.url = "app/mkoa/forum/forum.subjects";
			params.forumId = panel.initParams.forumId;
		}
		subpanel.removeAll();
		subpanel.load({
			url : "framework/engine/view/view.do",
			params : params,
			scripts : true
		});
	}
	// 视图刷新
	panel.refresh = function(params){
		if(Ext.isDefined(params)){
			panel.initParams = params;
		}else{
			params = panel.initParams;
		}
		var type = 'forum-home';
		if (params && params.forumId > 0) {
			type = 'forum-subjects';
		} else if (params && params.categoryId > 0) {
			type = 'forum-forums';
		}
		panel.enable();
		if (Ext.isDefined(subpanel.refresh)) {
			//subpanel.refresh(params);
			subpanel.initParams = panel.initParams;
			panel.loadUrl(type);
		}else{
			subpanel.initParams = panel.initParams;
			panel.loadUrl(type);
		}
	}
	panel.add(subpanel);
	panel.doLayout();
	// 初始化视图数据
	panel.refresh(panel.initParams);
});
</script>