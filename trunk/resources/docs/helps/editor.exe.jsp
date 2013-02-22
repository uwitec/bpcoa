<%@ page contentType="text/html; charset=utf-8"%>
<%@page import="com.mixky.helps.HelpManager"%>
<%@page import="com.google.gson.JsonObject"%>
<%@page import="com.google.gson.JsonParser"%>
<%
	int action = Integer.parseInt(request.getParameter("action"));
	switch(action){
		case 1:
		{
			// 获得下级目录列表
			String keypath = request.getParameter("keypath");
			out.print(HelpManager.instance().getHelpTopicChildrens(keypath));
			break;
		}
		case 2:
		{
			// 添加下级节点
			String keypath = request.getParameter("keypath");
			String strjson = request.getParameter("json");
			JsonParser parser = new JsonParser();
			JsonObject json = (JsonObject)parser.parse(strjson);
			boolean success = HelpManager.instance().appendTopic(keypath, json);
			out.print("{success:" + success + "}");
			break;
		}
		case 3:
		{
			// 插入下级节点
			String keypath = request.getParameter("keypath");
			int index = Integer.parseInt(request.getParameter("index"));
			String strjson = request.getParameter("json");
			JsonParser parser = new JsonParser();
			JsonObject json = (JsonObject)parser.parse(strjson);
			boolean success = HelpManager.instance().insertTopic(keypath, index, json);
			out.print("{success:" + success + "}");
			break;
		}
		case 4:
		{
			// 删除节点
			String keypath = request.getParameter("keypath");
			boolean success = HelpManager.instance().removeTopic(keypath);
			out.print("{success:" + success + "}");
			break;
		}
		case 5:
		{
			// 保存节点
			String keypath = request.getParameter("keypath");
			String strjson = request.getParameter("json");
			JsonParser parser = new JsonParser();
			JsonObject json = (JsonObject)parser.parse(strjson);
			boolean success = HelpManager.instance().saveTopic(keypath, json);
			out.print("{success:" + success + "}");
			break;
		}
	}
%>