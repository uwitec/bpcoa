
<%@page import="com.google.gson.JsonObject"%>
<%@page import="com.google.gson.JsonArray"%><%@page contentType="text/html; charset=utf-8"%>
<%@page import="java.util.List"%>
<%@page import="com.mixky.app.mkoa.addressbook.AddressBookManager"%>
<%@page import="com.mixky.engine.organization.User"%>
<%@page import="com.mixky.app.certification.MixkyUserCertification"%>
<%
	User user = MixkyUserCertification.instance().getUserInfo(request);
	List<List<String>> lists = AddressBookManager.instance().getNameCardTagsByUserId(user.getId());
	JsonArray array = new JsonArray();
	if(lists.size() > 0){
		for(int i = 0; i < lists.size(); i++){
		    JsonObject json = new JsonObject();
		    String name = lists.get(i).get(0);
		    json.addProperty("display", name);
		    json.addProperty("value", name);
		    array.add(json);
		}	      
	}
%>
<%=array.toString()%>