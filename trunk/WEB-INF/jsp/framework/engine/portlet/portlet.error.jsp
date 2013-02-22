<%@ page contentType="text/html; charset=utf-8"%>
<%
	// 读取参数
	String key = request.getParameter("key");
%>
<script language='javascript'>
Ext.onReady(function(){
	MixkyApp.showErrorMessage("栏目[<%=key%>]无法装载，未定义栏目或没有权限！", "栏目装载失败");
	MixkyApp.removeSubject('<%=key%>');
});
</script>