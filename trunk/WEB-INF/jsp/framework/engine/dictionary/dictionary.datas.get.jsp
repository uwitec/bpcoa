<%@ page contentType="text/html; charset=utf-8"%>
<%@page import="com.mixky.engine.dictionary.DictionaryData"%>
<%@page import="java.util.List"%>
<%@page import="com.mixky.engine.dictionary.DictionaryManager"%>
<%@ page import="com.google.gson.JsonArray"%>
<%@ page import="com.google.gson.JsonObject"%>
<%@ page import="com.mixky.app.mkoa.favorite.FavoriteManager"%>
<%@ page import="com.mixky.app.certification.MixkyUserCertification"%>
<%@ page import="com.mixky.engine.organization.User"%>
<%
	String dictionaryname = (String)request.getAttribute("dictionaryname");
	List<DictionaryData> datas = DictionaryManager.instance().getDictionaryDatasByDictionaryName(dictionaryname);
	JsonArray results = new JsonArray();
	for(int i=0;i<datas.size();i++){
		DictionaryData data = datas.get(i);
		JsonObject json = new JsonObject();
		json.addProperty("display", data.getF_caption());
		json.addProperty("value", data.getF_name());
		results.add(json);
	}
%>
<%=results%>