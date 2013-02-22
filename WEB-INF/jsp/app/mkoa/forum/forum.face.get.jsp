<%@ page contentType="text/html; charset=utf-8"%>

<%@page import="com.mixky.toolkit.FileUtil"%>
<%@page import="com.mixky.system.ContextHolder"%>
<%@page import="java.io.File"%>
<%@ page import="com.google.gson.JsonArray"%>
<%@ page import="com.google.gson.JsonObject"%>

<%
	JsonObject result = new JsonObject();
	JsonArray array = new JsonArray();
	File faceFolder = new File(ContextHolder.instance().getRealPath("resources/images/app/forum/face"));
	if (faceFolder.exists() && faceFolder.isDirectory()) {
		for (File file : faceFolder.listFiles()) {
			if (file.isFile() && "gif".equals(FileUtil.getFileExtension(file))) {
				JsonObject json = new JsonObject();
				json.addProperty("name", file.getName());
				json.addProperty("value", "<img src='resources/images/app/forum/face/" + file.getName() + "'/>");
				json.addProperty("display", "<img align=top height=16 src='resources/images/app/forum/face/" + file.getName() + "'/>");
				//json.addProperty("url", "resources/images/app/forum/face/" + file.getName());
				array.add(json);
			} 
		}
	}
	//result.add("images", array);
%>
<%=array%>