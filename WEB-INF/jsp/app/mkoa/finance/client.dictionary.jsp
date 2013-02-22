<%@ page contentType="text/html; charset=utf-8"%>
<%@page import="com.google.gson.JsonObject"%>
<%@page import="com.google.gson.JsonArray"%>
<%@page import="java.util.List"%>
<%@page import="com.mixky.app.mkoa.finance.FinanceManager"%>
<%
	String value = request.getParameter("value");
	JsonObject result = new JsonObject();
	if(value != null){
		String key = value;
		if(!"".equals(value)){
			List<List<String>> client = FinanceManager.instance().getClientDictionaryByNo(value);
			if(client.size() > 0){
				key = client.get(0).get(0) + " - " + client.get(0).get(1);
			}
		}
		result.addProperty("key", key);
		result.addProperty("value", value);
	}else{
		List<List<String>> lists = FinanceManager.instance().getClientDictionarys();
		JsonArray array = new JsonArray();
	    JsonObject empty = new JsonObject();
	    empty.addProperty("value", "");
	    empty.addProperty("display", "");
	    array.add(empty);
		for(int i = 0; i < lists.size(); i++){
		    JsonObject json = new JsonObject();
		    List<String> record = lists.get(i);
		    json.addProperty("display", record.get(0) + " - " + record.get(1));
		    json.addProperty("value", record.get(0));
		    array.add(json);
		}
		result.add("results", array);
	}
%>
<%=result.toString()%>