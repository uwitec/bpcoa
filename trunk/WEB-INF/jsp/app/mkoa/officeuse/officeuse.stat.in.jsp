<%@ page contentType="text/html; charset=utf-8"%>
<%@page import="com.google.gson.JsonArray"%>
<%@page import="com.mixky.app.certification.MixkyUserCertification"%>
<%@page import="com.mixky.engine.organization.User"%>
<%@page import="java.util.Date"%>
<%@page import="com.mixky.toolkit.DateUtil"%>
<%@page import="com.mixky.app.mkoa.officeuse.OfficeUseManager"%>
<%@page import="java.util.List"%>
<%@page import="com.mixky.app.mkoa.officeuse.OfficeUse"%>

<%
	String parentPanelId = request.getParameter("parentPanelId");
	String panelid = request.getParameter("panelid");
	String year = request.getParameter("year");
	String userid = request.getParameter("userid");
	User user = MixkyUserCertification.instance().getUserInfo(request);
	if(year == null){
		year = DateUtil.format(new Date(System.currentTimeMillis()), DateUtil.FORMAT_YEAR);
	}
	int intYear = Integer.parseInt(year);
	// 所有有数据的年份
	JsonArray years = OfficeUseManager.instance().getYears();
	// 办公用品台账
	List<OfficeUse> uses = OfficeUseManager.instance().getStatOfficeUse(year, "办公用品入库单");
	// 所有考评数据
	List<List<String>> useStats = OfficeUseManager.instance().getMonthOfficeUseStat(year, "办公用品入库单");
	
%>

<DIV id='<%=panelid%>-table'>
<TABLE cellSpacing=0 cellPadding=0 align=center bgColor=white>
	<TR style="HEIGHT: 6px" height=6>
		<TD vAlign=top background='resources/images/report/t_l.gif'></TD>
		<TD vAlign=top background='resources/images/report/t_z.gif'></TD>
		<TD vAlign=top background='resources/images/report/t_y.gif'></TD>
	<TR>
		<TD vAlign=top width=2 background='resources/images/report/b_l.gif'></TD>
		<TD style="padding:20px;padding-top:0px">
			<TABLE  cellSpacing=0 cellPadding=0 width=100% style='font-size:13px;'>
				<TR>
					<TD colspan=3 style='font-size:12px;'>
						查看更多：[
<%
	// 输出年度链接
	for(int i=0;i<years.size();i++){
%>
						<A href='#' onclick="javascript:Ext.getCmp('<%=panelid%>').refresh({year:<%=years.get(i).getAsString()%>, isOut:false})"><%=years.get(i).getAsString()%></A>
<%
	}
%>
						]　　
					</TD>
				</TR>
				<TR height=60px>
					<TD colspan=3 align=center style='font-size:17px;'>
						<B><%=year%> 办公用品年度入库统计汇总表</B><BR>
					</TD>
				</TR>
				<TR>
					<TD colspan=3 style='padding-top:10px;padding-bottom:10px' align=center>
<TABLE class='mixky-report-table' cellspacing='1' cellpadding='0'>
	<TR align='center'>
		<TD class='mixky-report-colheader' nowrap rowspan=2 width='100px'>办公用品</TD>
		<TD class='mixky-report-colheader' nowrap rowspan=2 width='80px'>现有库存</TD>
		<TD class='mixky-report-colheader' nowrap colspan=12>入库数量(发生/有效)</TD>
		<TD class='mixky-report-colheader' nowrap rowspan=2 width='80px'>累　计</TD>
	</TR>
	<TR align='center'>
<%
	for(int i=1;i<13;i++){
%>
		<TD class='mixky-report-colheader' nowrap width='80px'><%=i%> 月</TD>
<%
	}
%>
	</TR>
	
<%
	for(int i=0;i<uses.size();i++){
		OfficeUse use = uses.get(i);
%>
	<TR align='center'>
		<TD class='etekoa-report-colheader'>
			<%=use.getF_name()%>
		</TD>
		<TD class='etekoa-report-colheader'>
			<%=use.getF_number()%>
		</TD>
<%
		int useload = 0;
		for(int j=1;j<13;j++){
			String ym = year + "-" + (j > 9 ? "" : "0") + String.valueOf(j);
			List<String> useStat = null;
			for(int k=0;k< useStats.size();k++){
				if(use.getF_name().equals(useStats.get(k).get(0)) && ym.equals(useStats.get(k).get(1))){
					useStat = useStats.get(k);
					break;
				}
			}
			float workload = 0;
			float rworkload = 0;
			if(useStat == null || useStat.get(2) == null){
%>
				<TD></TD>
<%
			}else{
				useload = useload + Integer.parseInt(useStat.get(2));
%>
				<TD style='font-size:13px'><%=useStat.get(2)%></TD>
<%
			}
		}
%>
		<TD style='font-size:14px'><%=useload%></TD>
	</TR>
<%
	}
%>
	
	
</TABLE>
					</TD>
				</TR>
			</TABLE>
		</TD>
		<TD vAlign=top width=3 background='resources/images/report/b_y.gif'></TD>
	</TR>
	<TR style="HEIGHT: 7px" height=7>
		<TD vAlign=top background='resources/images/report/d_l.gif'></TD>
		<TD vAlign=top background='resources/images/report/d_z.gif'></TD>
		<TD vAlign=top background='resources/images/report/d_y.gif'></TD>
	</TR>
</TABLE>
</DIV>