<%@ page contentType="text/html; charset=utf-8"%>
<%@page import="com.google.gson.JsonObject"%>
<%@page import="com.google.gson.JsonArray"%>
<%@page import="java.util.List"%>
<%@page import="com.mixky.app.certification.MixkyUserCertification"%>
<%@page import="com.mixky.engine.organization.User"%>
<%@page import="com.mixky.app.bpcoa.project.BpcProjectDao"%>
<%@page import="com.mixky.app.bpcoa.project.BpcProjectManager"%>
<%
	User user = MixkyUserCertification.instance().getUserInfo(request);
	String value = request.getParameter("value");
	JsonObject result = new JsonObject();
	if(value != null){
		String key = value;
		if(!"".equals(value)){
			BpcProjectDao project = BpcProjectManager.instance().getProject(Long.parseLong(value));
			key = project.getF_title();
		}
		result.addProperty("key", key);
		result.addProperty("value", value);
	}else{
		List<BpcProjectDao> projects = BpcProjectManager.instance().getProjects(user);
		JsonArray array = new JsonArray();
	    JsonObject empty = new JsonObject();
	    empty.addProperty("value", "");
	    empty.addProperty("display", "");
	    array.add(empty);
		for(int i = 0; i < projects.size(); i++){
		    JsonObject json = new JsonObject();
		    BpcProjectDao project = projects.get(i);
		    json.addProperty("display", project.getF_title());
		    json.addProperty("value", project.getId());
		    array.add(json);
		}
		result.add("results", array);
	}
%>
<%=result.toString()%>