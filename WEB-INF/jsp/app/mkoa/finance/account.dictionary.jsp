<%@ page contentType="text/html; charset=utf-8"%>
<%@page import="com.google.gson.JsonObject"%>
<%@page import="com.google.gson.JsonArray"%>
<%@page import="java.util.List"%>
<%@page import="com.mixky.app.mkoa.finance.FinanceManager"%>
<%@page import="com.mixky.app.mkoa.finance.Account"%>
<%
	String value = request.getParameter("value");
	JsonObject result = new JsonObject();
	if(value != null){
		String key = value;
		if(!"".equals(value)){
			Account account = FinanceManager.instance().getAccountById(Long.parseLong(value));
			if(account != null && account.getId() > 0){
				key = account.getF_caption();
			}
		}
		result.addProperty("key", key);
		result.addProperty("value", value);
	}else{
		List lists = FinanceManager.instance().getAccounts();
		JsonArray array = new JsonArray();
		for(int i = 0; i < lists.size(); i++){
		    JsonObject json = new JsonObject();
		    Account account = (Account)lists.get(i);
		    json.addProperty("display", account.getF_caption());
		    json.addProperty("value", account.getId());
		    array.add(json);
		}
		result.add("results", array);	
	}
%>
<%=result.toString()%>