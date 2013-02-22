
<%@page import="com.mixky.app.mkoa.workreport.WorkReport"%>
<%@page import="java.util.Date"%>
<%@page import="com.mixky.app.mkoa.workreport.WorkReportComment"%><%@ page language="java" contentType="text/html; charset=UTF-8"%>
<%@page import="com.google.gson.JsonObject"%>
<%@page import="com.mixky.app.mkoa.workreport.WorkReportManager"%>
<%@page import="java.util.List"%>
<%@page import="com.mixky.system.ContextHolder"%>
<%@page import="org.springframework.web.context.ContextLoader"%>
<%@page import="com.mixky.engine.organization.User"%>

<%
	User user = ContextHolder.instance().getUserCertification().getUserInfo(request);
	// List<String> scope = WorkReportManager.instance().getDefautScopesByUserId(user.getId());
	
	String reportId = request.getParameter("reportid");
	String pfMsg = request.getParameter("pf_msg");
	
	WorkReportComment comment = new WorkReportComment();
	comment.setF_content(pfMsg);
	comment.setF_report_id(Long.parseLong(reportId));
	comment.setF_create_time(new Date());
	comment.setF_creator_id(user.getId());
	comment.setF_creator_name(user.getF_caption());
	comment.save();
	
	WorkReport report = new WorkReport();
	report.setId(Long.parseLong(reportId));
	report.load();
	String title = "工作简报[" + report.getF_title() + "]，" + user.getF_caption() + "批复";
	WorkReportManager.instance().sendScopesTodoMsg(report.getF_scop_ids(), title, report.getId(), user);
	
	JsonObject json = new JsonObject();
	json.addProperty("success", true);
%>

<%=json.toString()%>