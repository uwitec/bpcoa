<%@ page contentType="text/html; charset=utf-8"%>
<%@page import="com.google.gson.JsonObject"%>
<%@page import="com.google.gson.JsonArray"%>
<%@page import="java.util.List"%>
<%@page import="com.mixky.app.mkoa.finance.FinanceManager"%>
<%@page import="com.mixky.app.mkoa.finance.Subject"%>
<%
	String value = request.getParameter("value");
	JsonObject result = new JsonObject();
	if(value != null){
		String key = value;
		if(!"".equals(value)){
			Subject subject = FinanceManager.instance().getSubjectByNo(value);
			if(subject != null && subject.getId() >0){
				key = subject.getF_no() + " - " + subject.getF_caption();
			}
		}
		result.addProperty("key", key);
		result.addProperty("value", value);
	}else{
		List<Subject> lists = FinanceManager.instance().getSubjects();
		JsonArray array = new JsonArray();
	    JsonObject empty = new JsonObject();
	    empty.addProperty("value", "");
	    empty.addProperty("display", "");
	    array.add(empty);
		for(int i = 0; i < lists.size(); i++){
		    Subject subject = (Subject)lists.get(i);
		    if(subject.getF_type() == Subject.ST_DETAIL){
			    JsonObject json = new JsonObject();
			    json.addProperty("display", subject.getF_no() + " - " + subject.getF_caption());
			    json.addProperty("value", subject.getF_no());
			    array.add(json);
		    }
		}
		result.add("results", array);	
	}
%>
<%=result.toString()%>