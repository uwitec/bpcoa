/*
 * Generated by the Jasper component of Apache Tomcat
 * Version: Apache Tomcat/7.0.34
 * Generated at: 2013-01-24 05:55:48 UTC
 * Note: The last modified time of this file was set to
 *       the last modified time of the source file after
 *       generation to assist with modification tracking.
 */
package org.apache.jsp.WEB_002dINF.jsp.app.mkoa.finance;

import javax.servlet.*;
import javax.servlet.http.*;
import javax.servlet.jsp.*;
import java.util.Date;
import com.mixky.toolkit.DateUtil;

public final class finance_portlet_jsp extends org.apache.jasper.runtime.HttpJspBase
    implements org.apache.jasper.runtime.JspSourceDependent {

  private static final javax.servlet.jsp.JspFactory _jspxFactory =
          javax.servlet.jsp.JspFactory.getDefaultFactory();

  private static java.util.Map<java.lang.String,java.lang.Long> _jspx_dependants;

  private javax.el.ExpressionFactory _el_expressionfactory;
  private org.apache.tomcat.InstanceManager _jsp_instancemanager;

  public java.util.Map<java.lang.String,java.lang.Long> getDependants() {
    return _jspx_dependants;
  }

  public void _jspInit() {
    _el_expressionfactory = _jspxFactory.getJspApplicationContext(getServletConfig().getServletContext()).getExpressionFactory();
    _jsp_instancemanager = org.apache.jasper.runtime.InstanceManagerFactory.getInstanceManager(getServletConfig());
  }

  public void _jspDestroy() {
  }

  public void _jspService(final javax.servlet.http.HttpServletRequest request, final javax.servlet.http.HttpServletResponse response)
        throws java.io.IOException, javax.servlet.ServletException {

    final javax.servlet.jsp.PageContext pageContext;
    javax.servlet.http.HttpSession session = null;
    final javax.servlet.ServletContext application;
    final javax.servlet.ServletConfig config;
    javax.servlet.jsp.JspWriter out = null;
    final java.lang.Object page = this;
    javax.servlet.jsp.JspWriter _jspx_out = null;
    javax.servlet.jsp.PageContext _jspx_page_context = null;


    try {
      response.setContentType("text/html; charset=utf-8");
      pageContext = _jspxFactory.getPageContext(this, request, response,
      			null, true, 8192, true);
      _jspx_page_context = pageContext;
      application = pageContext.getServletContext();
      config = pageContext.getServletConfig();
      session = pageContext.getSession();
      out = pageContext.getOut();
      _jspx_out = out;

      out.write("\r\n");
      out.write("\r\n");
      out.write("\r\n");

	// 读取参数
	String key = request.getParameter("key");
	String panelid = "portlet-" + key;
	String date = DateUtil.format(new Date(System.currentTimeMillis()), DateUtil.FORMAT_DATE);

      out.write("\r\n");
      out.write("<script language='javascript'>\r\n");
      out.write("Ext.onReady(function(){\r\n");
      out.write("\r\n");
      out.write("\tvar panel = Ext.getCmp('");
      out.print(panelid);
      out.write("');\r\n");
      out.write("\r\n");
      out.write("\t// 数据访问\r\n");
      out.write("\tvar store = new Ext.data.DirectStore({\r\n");
      out.write("\t\tdirectFn : FinanceAppDirect.getFinancePortletStat,\r\n");
      out.write("\t\tparamOrder : ['month'],\r\n");
      out.write("\t\tbaseParams : {month:''},\r\n");
      out.write("\t\tremoteSort : true,\r\n");
      out.write("\t\troot : 'results',\r\n");
      out.write("\t\ttotalProperty : 'totals',\r\n");
      out.write("\t\tidProperty : 'F_SUBJECT_NO',\r\n");
      out.write("\t\tfields : ['F_SUBJECT_NO', 'F_SUBJECT', 'F_IN', 'F_OUT']\r\n");
      out.write("\t});\r\n");
      out.write("\r\n");
      out.write("\tvar storeChart = new Ext.data.JsonStore({\r\n");
      out.write("\t\tpruneModifiedRecords : true,\r\n");
      out.write("        fields: ['name', 'in', 'out']\r\n");
      out.write("    });\r\n");
      out.write("\t\r\n");
      out.write("\tvar numberRenderer = function(value, metaData, record, rowIndex, colIndex, store){\r\n");
      out.write("\t\tif(record.get(\"F_SUBJECT_NO\") == 'SUM'){\r\n");
      out.write("\t\t\tmetaData.attr = 'style=\"color:blue;font-weight:bold;\"';\r\n");
      out.write("\t\t}\r\n");
      out.write("\t\treturn value;\r\n");
      out.write("\t}\r\n");
      out.write("\r\n");
      out.write("\t// 选择月\r\n");
      out.write("\tvar dateSelect = new Ext.form.DateField({\r\n");
      out.write("\t\tvalue:'");
      out.print(date);
      out.write("', \r\n");
      out.write("\t\teditable : false, \r\n");
      out.write("\t\twidth : 70,\r\n");
      out.write("\t\tformat : 'Y-m',\r\n");
      out.write("\t\tlisteners : {\r\n");
      out.write("\t\t\t'select' : function(){\r\n");
      out.write("\t\t\t\tpanel.refresh();\r\n");
      out.write("\t\t\t}\r\n");
      out.write("\t\t}\r\n");
      out.write("\t});\r\n");
      out.write("\t// 上月\r\n");
      out.write("\tvar btnPreMonth = new Ext.Action({\r\n");
      out.write("\t\ticonCls : 'icon-sys-btnback',\r\n");
      out.write("\t\thandler : function(){\r\n");
      out.write("\t\t\t//var date = new Date(store.baseParams.month + '-01');\r\n");
      out.write("\t\t\tvar date = Date.parseDate(store.baseParams.month + '-01', 'Y-m-d');\r\n");
      out.write("\t\t\tdateSelect.setValue(date.add(Date.MONTH, -1).format('Y-m-d'));\r\n");
      out.write("\t\t\tpanel.refresh();\r\n");
      out.write("\t\t}\r\n");
      out.write("\t});\r\n");
      out.write("\t// 下周\r\n");
      out.write("\tvar btnNextMonth = new Ext.Action({\r\n");
      out.write("\t\ticonCls : 'icon-sys-btnnext',\r\n");
      out.write("\t\thandler : function(){\r\n");
      out.write("\t\t\t//var date = new Date(store.baseParams.month + '-01');\r\n");
      out.write("\t\t\tvar date = Date.parseDate(store.baseParams.month + '-01', 'Y-m-d');\r\n");
      out.write("\t\t\tdateSelect.setValue(date.add(Date.MONTH, 1).format('Y-m-d'));\r\n");
      out.write("\t\t\tpanel.refresh();\r\n");
      out.write("\t\t}\r\n");
      out.write("\t});\r\n");
      out.write("\r\n");
      out.write("\t// 表格对象\r\n");
      out.write("\tvar grid = new Ext.grid.GridPanel({\r\n");
      out.write("\t\tregion : 'center',\r\n");
      out.write("\t\tborder : false,\r\n");
      out.write("\t\tstripeRows: false,\r\n");
      out.write("\t\tenableHdMenu : false,\r\n");
      out.write("\t\tlineBreak : false,\r\n");
      out.write("        loadMask: {msg:'正在装载...'},\r\n");
      out.write("\t\tcolumns : [{\r\n");
      out.write("\t\t\tid : 'F_SUBJECT',\r\n");
      out.write("\t\t\tdataIndex : 'F_SUBJECT',\r\n");
      out.write("\t\t\theader : '名称',\r\n");
      out.write("\t\t\twidth : 100\r\n");
      out.write("\t\t}, {\r\n");
      out.write("\t\t\tid : 'F_IN',\r\n");
      out.write("\t\t\tdataIndex : 'F_IN',\r\n");
      out.write("\t\t\theader : '收入',\r\n");
      out.write("\t\t\twidth : 70,\r\n");
      out.write("\t\t\trenderer : numberRenderer\r\n");
      out.write("\t\t}, {\r\n");
      out.write("\t\t\tid : 'F_OUT',\r\n");
      out.write("\t\t\tdataIndex : 'F_OUT',\r\n");
      out.write("\t\t\theader : '支出',\r\n");
      out.write("\t\t\twidth : 70,\r\n");
      out.write("\t\t\trenderer : numberRenderer\r\n");
      out.write("\t\t}],\r\n");
      out.write("\t\tstore : store,\r\n");
      out.write("\t\trefreshChartData : function(){\r\n");
      out.write("\t\t\tvar datas = [];\r\n");
      out.write("\t\t\tfor(var i=0;i<store.getCount();i++){\r\n");
      out.write("\t\t\t\tvar record = store.getAt(i);\r\n");
      out.write("\t\t\t\tif(record.get(\"F_SUBJECT_NO\") != 'SUM'){\r\n");
      out.write("\t\t\t\t\tdatas.push({\r\n");
      out.write("\t\t\t\t\t\t'name' : record.get(\"F_SUBJECT\"),\r\n");
      out.write("\t\t\t\t\t\t'in' : record.get(\"F_IN\"),\r\n");
      out.write("\t\t\t\t\t\t'out' : record.get(\"F_OUT\")\r\n");
      out.write("\t\t\t\t\t});\r\n");
      out.write("\t\t\t\t}\r\n");
      out.write("\t\t\t}\r\n");
      out.write("\t\t\tstoreChart.loadData(datas);\r\n");
      out.write("    \t}\r\n");
      out.write("\t});\r\n");
      out.write("\r\n");
      out.write("\r\n");
      out.write("\tstore.on('load', function(){\r\n");
      out.write("\t\tgrid.refreshChartData();\r\n");
      out.write("\t});\r\n");
      out.write("\r\n");
      out.write("\tvar chart1 = new Ext.chart.PieChart({\r\n");
      out.write("\t\tstore : storeChart,\r\n");
      out.write("        dataField: 'out',\r\n");
      out.write("        categoryField: 'name',\r\n");
      out.write("        tipRenderer : function(chart, record, index, series){\r\n");
      out.write("\t\t\treturn '支出构成图\\n' + record.get('name') + '：' + record.get('out');\r\n");
      out.write("\t    },\r\n");
      out.write("        extraStyle:\r\n");
      out.write("        {\r\n");
      out.write("            legend:\r\n");
      out.write("            {\r\n");
      out.write("                display: 'none'\r\n");
      out.write("            }\r\n");
      out.write("        }\r\n");
      out.write("\t});\r\n");
      out.write("\r\n");
      out.write("\r\n");
      out.write("\tvar chart2 = new Ext.chart.PieChart({\r\n");
      out.write("\t\tstore : storeChart,\r\n");
      out.write("        dataField: 'in',\r\n");
      out.write("        categoryField: 'name',\r\n");
      out.write("        tipRenderer : function(chart, record, index, series){\r\n");
      out.write("\t\t\treturn '收入构成图\\n' + record.get('name') + '：' + record.get('in');\r\n");
      out.write("\t    },\r\n");
      out.write("        extraStyle:\r\n");
      out.write("        {\r\n");
      out.write("            legend:\r\n");
      out.write("            {\r\n");
      out.write("                display: 'none'\r\n");
      out.write("            }\r\n");
      out.write("        }\r\n");
      out.write("\t});\r\n");
      out.write("\r\n");
      out.write("\tvar chart = new Ext.Panel({\r\n");
      out.write("\t\tregion : 'east',\r\n");
      out.write("\t\tborder : false,\r\n");
      out.write("\t\tsplit : true,\r\n");
      out.write("\t\tautoScroll : true,\r\n");
      out.write("        collapseMode:'mini',\r\n");
      out.write("        minSize: 100,\r\n");
      out.write("        maxSize: 400,\r\n");
      out.write("        width : 150,\r\n");
      out.write("        defaults : {\r\n");
      out.write("\t\t\tborder : false\r\n");
      out.write("        },\r\n");
      out.write("        items :[{\r\n");
      out.write("            height : 150,\r\n");
      out.write("    \t\titems : chart1\r\n");
      out.write("        }, {\r\n");
      out.write("            height : 150,\r\n");
      out.write("    \t\titems : chart2\r\n");
      out.write("        }]\r\n");
      out.write("\t});\r\n");
      out.write("\r\n");
      out.write("\tvar ui = new Ext.Panel({\r\n");
      out.write("\t\tlayout:'border',\r\n");
      out.write("\t\tborder : false,\r\n");
      out.write("\t\ttbar : [btnPreMonth, dateSelect, btnNextMonth],\r\n");
      out.write("\t\titems : [grid, chart]\r\n");
      out.write("\t});\r\n");
      out.write("\t\r\n");
      out.write("\tpanel.refresh = function(){\r\n");
      out.write("\t\tstore.baseParams.month = dateSelect.getRawValue();\r\n");
      out.write("\t\tstore.reload();\r\n");
      out.write("\t}\r\n");
      out.write("\r\n");
      out.write("\tpanel.add(ui);\r\n");
      out.write("\tpanel.doLayout();\r\n");
      out.write("\tpanel.refresh();\r\n");
      out.write("});\r\n");
      out.write("</script>");
    } catch (java.lang.Throwable t) {
      if (!(t instanceof javax.servlet.jsp.SkipPageException)){
        out = _jspx_out;
        if (out != null && out.getBufferSize() != 0)
          try { out.clearBuffer(); } catch (java.io.IOException e) {}
        if (_jspx_page_context != null) _jspx_page_context.handlePageException(t);
        else throw new ServletException(t);
      }
    } finally {
      _jspxFactory.releasePageContext(_jspx_page_context);
    }
  }
}
