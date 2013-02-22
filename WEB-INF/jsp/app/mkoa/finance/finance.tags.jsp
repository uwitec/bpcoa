<%@ page contentType="text/html; charset=utf-8"%>
<%@page import="com.google.gson.JsonObject"%>
<%@page import="com.google.gson.JsonArray"%>
<%@page import="java.util.List"%>
<%@page import="com.mixky.app.mkoa.finance.FinanceManager"%>
<%@page import="com.mixky.app.mkoa.finance.FinanceTag"%>
<%
	List<FinanceTag> lists = FinanceManager.instance().getFinanceTags();
	JsonArray array = new JsonArray();
	for(int i = 0; i < lists.size(); i++){
	    JsonObject json = new JsonObject();
	    FinanceTag tag = (FinanceTag)lists.get(i);
	    json.addProperty("display", tag.getF_name());
	    json.addProperty("value", tag.getF_name());
	    array.add(json);
	}
%>
<%=array.toString()%>