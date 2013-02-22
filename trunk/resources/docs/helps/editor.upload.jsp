<%@ page contentType="text/html; charset=utf-8"%>
<%@page import="com.mixky.helps.HelpManager"%>
<%@page import="com.google.gson.JsonObject"%>
<%@page import="com.google.gson.JsonParser"%>
<%
	// 上传文件
	boolean success = HelpManager.instance().uploadTopicDoc(request);
	out.print("{success:" + success + ", status : 1}");
%>