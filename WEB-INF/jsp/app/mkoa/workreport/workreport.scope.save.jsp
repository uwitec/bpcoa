<%@ page language="java" contentType="text/html; charset=UTF-8"%>
<%@page import="com.mixky.app.mkoa.workreport.WorkReportManager"%>
<%@page import="com.mixky.app.mkoa.workreport.WorkReportScope"%>
<%@page import="com.mixky.system.ContextHolder"%>
<%@page import="com.mixky.engine.organization.User"%>

<%
	String f_scops = request.getParameter("f_scops");
	String f_scop_ids = request.getParameter("f_scop_ids");
	
	User user = ContextHolder.instance().getUserCertification().getUserInfo(request);
	WorkReportScope scope = WorkReportManager.instance().getDefautScopesByUserId(user.getId());
	
	if (scope == null) {
		scope = new WorkReportScope();
		scope.setF_creator_id(user.getId());
		scope.setF_scop_ids(f_scop_ids);
		scope.setF_scops(f_scops);
	} else {
		scope.setF_scop_ids(f_scop_ids);
		scope.setF_scops(f_scops);
	}
	scope.save();
%>