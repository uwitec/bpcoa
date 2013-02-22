<%@ page contentType="text/html; charset=utf-8"%>
<%@page import="com.google.gson.JsonArray"%>
<%@page import="com.mixky.app.mkoa.mail.MailTagManager"%>
<%@page import="com.mixky.app.mkoa.mail.MailTag"%>
<%@page import="java.util.List"%>
<%@page import="com.mixky.system.ContextHolder"%>
<%@page import="com.mixky.engine.organization.User"%>
<%@page import="com.google.gson.JsonObject"%>

<%
	User user = ContextHolder.instance().getUserCertification().getUserInfo(request);
	List<MailTag> tags = MailTagManager.instance().getUserPrivateTags(user);
	
	JsonArray array = new JsonArray();
	for(int i = 0; i < tags.size(); i++){
	    JsonObject json = new JsonObject();
	    MailTag tag = tags.get(i);
	    json.addProperty("display", tag.getF_name());
	    json.addProperty("value", tag.getId());
	    array.add(json);
	}
	
	JsonObject result = new JsonObject();
	result.add("results", array);
%>

<%=result.toString()%>