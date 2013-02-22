<%@ page contentType="text/html; charset=utf-8"%>
<%@ page import="com.google.gson.JsonArray"%>
<%@ page import="com.google.gson.JsonObject"%>
<%@ page import="com.mixky.app.mkoa.favorite.FavoriteManager"%>
<%@ page import="com.mixky.app.certification.MixkyUserCertification"%>
<%@ page import="com.mixky.engine.organization.User"%>
<%

	User user = MixkyUserCertification.instance().getUserInfo(request);
	JsonArray results = new JsonArray();
	JsonArray tags = FavoriteManager.instance().getFavoriteTagsArray(user.getId());
	for(int i=0;i<tags.size();i++){
		String tag = tags.get(i).getAsString();
		JsonObject json = new JsonObject();
		json.addProperty("display", tag);
		json.addProperty("value", tag);
		results.add(json);
	}
%>
<%=results%>