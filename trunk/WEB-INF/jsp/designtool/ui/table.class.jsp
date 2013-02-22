<%@ page contentType="text/html; charset=utf-8"%>

<%@ page import="java.util.List"%>
<%@ page import="com.mixky.engine.store.Table"%>
<%@ page import="com.mixky.engine.store.Field"%>
<%@ page import="com.mixky.toolkit.StringUtil"%>

<%
	String id = request.getParameter("id");
	String classname = request.getParameter("classname");
	Table table = (Table)request.getAttribute("table");
	List<Field> fields = (List<Field>)request.getAttribute("fields");
%>
<pre>

import com.mixky.common.database.EntityDaoSupport;
import java.util.Date;

public class <%=classname%> extends EntityDaoSupport {

	public <%=classname%> (){
		this.setTablename("<%=table.getF_key().toLowerCase()%>");
<%
	for(int i=0;i<fields.size();i++){
		Field field = fields.get(i);
		if(field.getF_datatype_db() == Field.DBT_CLOB){
%>
			this.addClobField("<%=field.getF_key().toLowerCase()%>");
<%
		}
	}
%>
	}
<%
	for(int i=0;i<fields.size();i++){
		Field field = fields.get(i);
		if("ID".equals(field.getF_key().toUpperCase())){
			continue;
		}
		String definestr = field.getJavaTypeString();
		if(definestr != null){
%>
	private <%=definestr%> <%=field.getF_key().toLowerCase()%>;
<%
		}
	}

	for(int i=0;i<fields.size();i++){
		Field field = fields.get(i);
		if("ID".equals(field.getF_key().toUpperCase())){
			continue;
		}
		String definestr = field.getJavaTypeString();
		if(definestr != null){
%>

	public <%=definestr%> get<%=StringUtil.setFirstCharUcase(field.getF_key())%>() {
		return <%=field.getF_key().toLowerCase()%>;
	}
	public void set<%=StringUtil.setFirstCharUcase(field.getF_key())%>(<%=definestr%> <%=field.getF_key().toLowerCase()%>) {
		this.<%=field.getF_key().toLowerCase()%> = <%=field.getF_key().toLowerCase()%>;
	}
<%
		}
	}
%>
}
</pre>