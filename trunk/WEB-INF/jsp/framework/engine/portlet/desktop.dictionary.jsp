<%@ page contentType="text/html; charset=utf-8"%>
<%@page import="com.google.gson.JsonObject"%>
<%@page import="com.google.gson.JsonArray"%>
<%@page import="com.mixky.engine.desktop.UserConfigManager"%>
<%
	JsonObject result = new JsonObject();
	JsonArray array = new JsonArray();
	JsonArray ucs = UserConfigManager.instance().getPublicUserConfigNames();
	for(int i = 0; i < ucs.size(); i++){
		JsonObject json = new JsonObject();
		json.addProperty("display", ucs.get(i).getAsString());
		json.addProperty("value", ucs.get(i).getAsString());
		
		array.add(json);
	}
	result.add("results", array);
%>
<%=result.toString()%>