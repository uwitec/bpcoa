<%@ page language="java" contentType="text/html; charset=UTF-8"%>
<%@page import="com.mixky.app.mkoa.workreport.WorkReportScope"%>
<%@page import="com.google.gson.JsonObject"%>
<%@page import="com.mixky.app.mkoa.workreport.WorkReportManager"%>
<%@page import="java.util.List"%>
<%@page import="com.mixky.system.ContextHolder"%>
<%@page import="org.springframework.web.context.ContextLoader"%>
<%@page import="com.mixky.engine.organization.User"%>

<%
	User user = ContextHolder.instance().getUserCertification().getUserInfo(request);
	WorkReportScope scope = WorkReportManager.instance().getDefautScopesByUserId(user.getId());
	
	JsonObject json = new JsonObject();
	json.addProperty("success", true);
	if (scope != null) {
		json.addProperty("F_SCOPS", scope.getF_scops());
		json.addProperty("F_SCOP_IDS", scope.getF_scop_ids());
	} else {
		json.addProperty("F_SCOPS", "");
		json.addProperty("F_SCOP_IDS", "");
	}
%>

<%=json.toString()%>