<%@ page contentType="text/html; charset=utf-8"%>
<%@page import="com.mixky.app.mkoa.addressbook.AddressBookObject"%>
<%
	String panelid = request.getParameter("panelid");
	long documentid = Long.parseLong(panelid.substring(panelid.indexOf("-") + 1));
	AddressBookObject card = new AddressBookObject("t_mk_app_namecard");
	card.setId(documentid);
	card.load();
	
	StringBuffer bf = new StringBuffer();
	bf.append("<div class=\"mixky-card\">");
	bf.append("<div  class=\"mixky-card-title\"><span class=\"mixky-card-name\">").append(card.getF_name()).append("</span> <span class=\"mixky-card-duty\">").append(card.getF_duty()).append("</span></div>");
	bf.append("<div class=\"mixky-card-unit\">").append(card.getF_unit_name()).append("</div>");
	bf.append("<div class=\"mixky-card-other\"><div>地址：").append(card.getF_address()).append("</div>");
	bf.append("<div>手机：").append(card.getF_cell_phone()).append("</div>");
	bf.append("<div>邮箱：").append(card.getF_email()).append("</div>");
	bf.append("<div>传真：").append(card.getF_fax()).append("</div>");
	bf.append("<div>MSN：").append(card.getF_msn()).append("</div>");
	bf.append("<div>Q Q：").append(card.getF_qq()).append("</div></div>");
	bf.append("</div>");
%>

<script language='javascript'>
Ext.onReady(function(){

	var panel = Ext.getCmp('<%=panelid%>');
	var win = panel.findParentByType('window');

	var cardPanel = new Ext.Panel({
		border : false,
		layout : 'fit',
		html: '<%=bf.toString()%>'
	});
	
	// 输出附加脚本 end
	panel.add(cardPanel);
	panel.doLayout();
});
</script>

