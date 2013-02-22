
<%@page import="com.mixky.app.mkoa.personalrecords.PersonalRecords"%>
<%@page import="com.mixky.system.ContextHolder"%><%@ page contentType="text/html; charset=utf-8"%>
<%@page import="com.mixky.engine.organization.OrganizationManager"%>
<%@page import="com.mixky.engine.organization.User"%>
<%@page import="java.util.List"%>


<%
	//List<User> users = OrganizationManager.instance().getAllUsers();
	List<User> users;
	String sql = "select count(id) from t_mk_app_personalrecords";
	List<List<String>> list =  ContextHolder.instance().getMixkyDataAccess().find(sql, null, 0, 0);
	if ("0".equals(list.get(0).get(0))) {
		users = OrganizationManager.instance().getAllUsers();
	} else {
		sql = "select * from t_mk_sys_user where f_caption != (select f_name from t_mk_app_personalrecords)";
		users = ContextHolder.instance().getMixkyDataAccess().find(sql, null, User.class, 0, 0);
	}
	
	for (int i = 0; i < users.size(); i++) {
		User user = users.get(i);
		PersonalRecords person = new PersonalRecords();
		person.setF_name(user.getF_caption());
		person.setF_dept_name(user.getF_dept_name());
		person.setF_email(user.getF_email());
		person.setF_state("正式");
		person.save();
	}
%>
