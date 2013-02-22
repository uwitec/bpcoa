<%@ page contentType="text/html; charset=utf-8"%>
<%@page import="com.google.gson.JsonObject"%>
<%@page import="com.google.gson.JsonArray"%>
<%@page import="java.util.List"%>
<%@page import="com.mixky.engine.organization.OrganizationManager"%>
<%@page import="com.mixky.engine.organization.User"%>
<%@page import="com.mixky.engine.authority.AuthorityManager"%>
<%
	String value = request.getParameter("value");
	String modulerolekey = request.getParameter("modulerolekey");
	JsonObject result = new JsonObject();
	if(value != null){
		String key = value;
		if(!"".equals(value)){
			User user = OrganizationManager.instance().getUserById(Long.parseLong(value));
			key = user.getF_caption();
		}
		result.addProperty("key", key);
		result.addProperty("value", value);
	}else{
		List<User> users;
		if(modulerolekey != null && !"".equals(modulerolekey)){
			users = AuthorityManager.instance().getUsersByModuleRoleKey(modulerolekey);
		}else{
			users = OrganizationManager.instance().getAllUsers();
		}
		JsonArray array = new JsonArray();
	    JsonObject empty = new JsonObject();
	    empty.addProperty("value", "");
	    empty.addProperty("display", "");
	    array.add(empty);
		for(int i = 0; i < users.size(); i++){
		    JsonObject json = new JsonObject();
		    User user = users.get(i);
		    json.addProperty("display", user.getF_caption());
		    json.addProperty("value", user.getId());
		    array.add(json);
		}
		result.add("results", array);
	}
%>
<%=result.toString()%>