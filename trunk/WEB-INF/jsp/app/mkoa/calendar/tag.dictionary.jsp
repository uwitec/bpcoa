<%@ page contentType="text/html; charset=utf-8"%>
<%@page import="com.google.gson.JsonObject"%>
<%@page import="com.google.gson.JsonArray"%>
<%@page import="java.util.List"%>
<%@page import="com.mixky.app.mkoa.calendar.CalendarDataService"%>
<%@page import="com.mixky.app.mkoa.calendar.CalendarTag"%>
<%
	String value = request.getParameter("value");
	JsonObject result = new JsonObject();
	if(value != null){
		String key = value;
		CalendarTag tag = CalendarDataService.instance().getTag(Long.parseLong(key));
		if(tag == null || tag.getId() == 0){
			result.addProperty("key", "未分类");
		}else{
			result.addProperty("key", tag.getF_name());
		}
		result.addProperty("value", key);
	}else{
		List<CalendarTag> lists = CalendarDataService.instance().getTags(request);
		JsonArray array = new JsonArray();
	    JsonObject empty = new JsonObject();
	    empty.addProperty("value", "");
	    empty.addProperty("display", "");
	    array.add(empty);
		for(int i = 0; i < lists.size(); i++){
		    JsonObject json = new JsonObject();
		    CalendarTag tag = lists.get(i);
		    json.addProperty("display", tag.getF_name());
		    json.addProperty("value", tag.getId());
		    array.add(json);
		}
		result.add("results", array);
	}
%>
<%=result.toString()%>