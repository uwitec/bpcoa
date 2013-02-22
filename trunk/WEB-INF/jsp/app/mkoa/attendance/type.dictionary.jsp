<%@ page contentType="text/html; charset=utf-8"%>
<%@page import="com.google.gson.JsonObject"%>
<%@page import="com.google.gson.JsonArray"%>
<%@page import="java.util.List"%>
<%@page import="com.mixky.engine.dictionary.DictionaryManager"%>
<%@page import="com.mixky.engine.dictionary.DictionaryData"%>
<%
	String value = request.getParameter("value");
	JsonObject result = new JsonObject();
	List<DictionaryData> datas = DictionaryManager.instance().getDictionaryDatasByDictionaryName("mkAttendanceType");
	if(value != null){
		String key = value;
		for(int i=0;i<datas.size();i++){
			DictionaryData data = datas.get(i);
			if(key.equals(data.getF_name()) || key.equals(data.getF_caption())){
				key = data.getF_caption();
				break;
			}
		}
		result.addProperty("key", key);
		result.addProperty("value", value);
	}else{
		JsonArray array = new JsonArray();
	    JsonObject empty = new JsonObject();
	    empty.addProperty("value", "");
	    empty.addProperty("display", "");
	    array.add(empty);
		for(int i = 0; i < datas.size(); i++){
		    JsonObject json = new JsonObject();
		    DictionaryData data = datas.get(i);
		    if(Integer.parseInt(data.getF_name()) < 3){
			    json.addProperty("display", data.getF_caption());
			    json.addProperty("value", data.getF_name());
			    array.add(json);
		    }
		}
		result.add("results", array);
	}
%>
<%=result.toString()%>