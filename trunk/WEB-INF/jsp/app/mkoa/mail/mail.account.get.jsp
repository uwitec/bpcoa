<%@ page contentType="text/html; charset=utf-8"%>
<%@page import="com.google.gson.JsonObject"%>
<%@page import="com.google.gson.JsonArray"%>
<%@page import="com.mixky.app.mkoa.mail.MailAccountManager"%>
<%@page import="com.mixky.app.mkoa.mail.MailAccount"%>
<%@page import="java.util.List"%>
<%@page import="com.mixky.system.ContextHolder"%>
<%@page import="com.mixky.engine.organization.User"%>

<%
	JsonObject result = new JsonObject();
	User user = ContextHolder.instance().getUserCertification().getUserInfo(request);
	List<MailAccount> accounts = MailAccountManager.instance().getUserAccounts(user);
	String getId = request.getParameter("getId");
	
	JsonArray array = new JsonArray();
	for(int i = 0; i < accounts.size(); i++){
	    JsonObject json = new JsonObject();
	    MailAccount account = accounts.get(i);
	    json.addProperty("display", account.getF_mail_address());
	    if (getId != null) {
	    	json.addProperty("value", account.getId());
	    } else {
	    	json.addProperty("value", account.getF_mail_address());
	    }
	    
	    array.add(json);
	}
	result.add("results", array);
	
%>

<%=result.toString()%>