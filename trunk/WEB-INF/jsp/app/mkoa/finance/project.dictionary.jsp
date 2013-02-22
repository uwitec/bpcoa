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
			List<List<String>> project = FinanceManager.instance().getProjectDictionaryByNo(value);
			if(project.size() > 0){
			    // 判断是否有合同号，有合同号的话用合同号
			    String no = project.get(0).get(1);
			    if(no == null || "".equals(no) || "null".equals(no)){
			    	no = project.get(0).get(0);
			    }
				key = no + " - " + project.get(0).get(2);
			}
		}
		result.addProperty("key", key);
		result.addProperty("value", value);
	}else{
		List<List<String>> lists = FinanceManager.instance().getProjectDictionarys();
		JsonArray array = new JsonArray();
	    JsonObject empty = new JsonObject();
	    empty.addProperty("value", "");
	    empty.addProperty("display", "");
	    array.add(empty);
		for(int i = 0; i < lists.size(); i++){
		    JsonObject json = new JsonObject();
		    List<String> record = lists.get(i);
		    // 判断是否有合同号，有合同号的话用合同号
		    String no = record.get(1);
		    if(no == null || "".equals(no) || "null".equals(no)){
		    	no = record.get(0);
		    }
		    json.addProperty("display", no + " - " + record.get(2));
		    json.addProperty("value", no);
		    array.add(json);
		}
		result.add("results", array);	
	}
%>
<%=result.toString()%>