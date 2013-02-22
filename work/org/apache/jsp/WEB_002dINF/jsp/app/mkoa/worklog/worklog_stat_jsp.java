/*
 * Generated by the Jasper component of Apache Tomcat
 * Version: Apache Tomcat/7.0.34
 * Generated at: 2013-01-29 01:33:11 UTC
 * Note: The last modified time of this file was set to
 *       the last modified time of the source file after
 *       generation to assist with modification tracking.
 */
package org.apache.jsp.WEB_002dINF.jsp.app.mkoa.worklog;

import javax.servlet.*;
import javax.servlet.http.*;
import javax.servlet.jsp.*;
import java.util.List;
import java.util.Date;
import com.mixky.toolkit.DateUtil;
import com.mixky.app.mkoa.worklog.WorklogManager;

public final class worklog_stat_jsp extends org.apache.jasper.runtime.HttpJspBase
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
      out.write("\r\n");
      out.write("\r\n");

	String panelid = request.getParameter("panelid");
	String month = DateUtil.format(new Date(System.currentTimeMillis()), "yyyy-MM");

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
      out.write("\t\tdirectFn : WorklogAppDirect.getWorklogStat,\r\n");
      out.write("\t\tparamOrder : ['month'],\r\n");
      out.write("\t\tbaseParams : {month:'");
      out.print(month);
      out.write("'},\r\n");
      out.write("\t\tremoteSort : true,\r\n");
      out.write("\t\troot : 'results',\r\n");
      out.write("\t\ttotalProperty : 'totals',\r\n");
      out.write("\t\tidProperty : 'F_USER_ID',\r\n");
      out.write("\t\tfields : ");
      out.print(WorklogManager.instance().getWorklogStatFields());
      out.write("\r\n");
      out.write("\t});\r\n");
      out.write("\r\n");
      out.write("\tvar numberRenderer = function(value, metaData, record, rowIndex, colIndex, store){\r\n");
      out.write("\t\tif(record.get(\"F_USER_ID\") == 0){\r\n");
      out.write("\t\t\tmetaData.attr = 'style=\"color:blue;font-weight:bold;\"';\r\n");
      out.write("\t\t}else if(colIndex == 2){\r\n");
      out.write("\t\t\t// 合计列\r\n");
      out.write("\t\t\tmetaData.attr = 'style=\"font-weight:bold;\"';\r\n");
      out.write("\t\t}\r\n");
      out.write("\t\treturn value;\r\n");
      out.write("\t}\r\n");
      out.write("\t\r\n");
      out.write("\tvar sm = new Ext.grid.RowSelectionModel({\r\n");
      out.write("\t\tsingleSelect : true\r\n");
      out.write("\t});\r\n");
      out.write("\r\n");
      out.write("\t// 选择当前月\r\n");
      out.write("\tvar dateSelect = new Ext.form.DateField({\r\n");
      out.write("\t\tvalue:'");
      out.print(month);
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
      out.write("\tvar btnNextMonth = new Ext.Action({\r\n");
      out.write("\t\ticonCls : 'icon-sys-btnnext',\r\n");
      out.write("\t\thandler : function(){\r\n");
      out.write("\t\t\t//var date = new Date(store.baseParams.month + '-01');\r\n");
      out.write("\t\t\tvar date = Date.parseDate(store.baseParams.month + '-01', 'Y-m-d');\r\n");
      out.write("\t\t\tdateSelect.setValue(date.add(Date.MONTH, 1).format('Y-m-d'));\r\n");
      out.write("\t\t\tpanel.refresh();\r\n");
      out.write("\t\t}\r\n");
      out.write("\t});\r\n");
      out.write("\t// 下月\r\n");
      out.write("\tvar btnPreMonth = new Ext.Action({\r\n");
      out.write("\t\ticonCls : 'icon-sys-btnback',\r\n");
      out.write("\t\thandler : function(){\r\n");
      out.write("\t\t\t//var date = new Date(store.baseParams.month + '-01');\r\n");
      out.write("\t\t\tvar date = Date.parseDate(store.baseParams.month + '-01', 'Y-m-d');\r\n");
      out.write("\t\t\tdateSelect.setValue(date.add(Date.MONTH, -1).format('Y-m-d'));\r\n");
      out.write("\t\t\tpanel.refresh();\r\n");
      out.write("\t\t}\r\n");
      out.write("\t});\r\n");
      out.write("\t// 刷新\r\n");
      out.write("\tvar btnRefresh = new Ext.Action({\r\n");
      out.write("\t\ttext : '刷新',\r\n");
      out.write("\t\ticonCls : 'icon-sys-refresh',\r\n");
      out.write("\t\thandler : function(){\r\n");
      out.write("\t\tvar date = new Date(store.baseParams.month + '-01');\r\n");
      out.write("\t\t\tpanel.refresh();\r\n");
      out.write("\t\t}\r\n");
      out.write("\t});\r\n");
      out.write("\r\n");
      out.write("\t\r\n");
      out.write("\t// 表格对象\r\n");
      out.write("\tvar grid = new Ext.grid.GridPanel({\r\n");
      out.write("\t\tregion : 'center',\r\n");
      out.write("\t\tborder : false,\r\n");
      out.write("\t\tstripeRows: false,\r\n");
      out.write("\t\tenableHdMenu : false,\r\n");
      out.write("\t\tlineBreak : false,\r\n");
      out.write("        loadMask: {msg:'正在装载...'},\r\n");
      out.write("\t\tsm : sm,\r\n");
      out.write("\t\ttbar : [btnPreMonth, dateSelect, btnNextMonth, '->', btnRefresh],\r\n");
      out.write("\t\tcolumns : ");
      out.print(WorklogManager.instance().getWorklogStatColumns());
      out.write(",\r\n");
      out.write("\t\tstore : store,\r\n");
      out.write("\t\tgetSelectedRecords : function(){\r\n");
      out.write("\t\t\treturn this.getSelectionModel().getSelections();\r\n");
      out.write("\t\t}\r\n");
      out.write("\t});\r\n");
      out.write("\r\n");
      out.write("\tvar storeChart1 = new Ext.data.JsonStore({\r\n");
      out.write("\t\tpruneModifiedRecords : true,\r\n");
      out.write("        fields: ['value', 'name']\r\n");
      out.write("    })\r\n");
      out.write("\tvar chart1 = new Ext.chart.PieChart({\r\n");
      out.write("\t\tstore : storeChart1,\r\n");
      out.write("        dataField: 'value',\r\n");
      out.write("        categoryField: 'name',\r\n");
      out.write("        extraStyle:\r\n");
      out.write("        {\r\n");
      out.write("            legend:\r\n");
      out.write("            {\r\n");
      out.write("                display: 'left',\r\n");
      out.write("                padding: 5\r\n");
      out.write("            }\r\n");
      out.write("        },\r\n");
      out.write("\t\trefreshData : function(record){\r\n");
      out.write("\t    \tstoreChart1.removeAll(true);\r\n");
      out.write("\t\t\tif(!record){\r\n");
      out.write("\t\t\t\trecord = store.getById(0);\r\n");
      out.write("\t\t\t}\r\n");
      out.write("\t\t\tif(!record){\r\n");
      out.write("\t\t\t\treturn;\r\n");
      out.write("\t\t\t}\r\n");
      out.write("\t\t\tvar datas = [];\r\n");
      out.write("\t\t\tfor(var i=3;i<grid.getColumnModel().getColumnCount();i++){\r\n");
      out.write("\t\t\t\tdatas.push({\r\n");
      out.write("\t\t\t\t\tname : grid.getColumnModel().getColumnHeader(i),\r\n");
      out.write("\t\t\t\t\tvalue : record.get(grid.getColumnModel().getDataIndex(i))\r\n");
      out.write("\t\t\t\t});\r\n");
      out.write("\t\t\t}\r\n");
      out.write("\t\t\tstoreChart1.loadData(datas);\r\n");
      out.write("        }\r\n");
      out.write("\t});\r\n");
      out.write("\r\n");
      out.write("\tgrid.on('rowclick', function(){\r\n");
      out.write("\t\tvar record = grid.getSelectionModel().getSelected();\r\n");
      out.write("\t\tchart1.refreshData(record);\r\n");
      out.write("\t});\r\n");
      out.write("\r\n");
      out.write("\tvar storeChart2 = new Ext.data.JsonStore({\r\n");
      out.write("\t\tpruneModifiedRecords : true,\r\n");
      out.write("        fields: ['value', 'name']\r\n");
      out.write("    })\r\n");
      out.write("\tvar chart2 = new Ext.chart.ColumnChart({\r\n");
      out.write("\t\tstore : storeChart2,\r\n");
      out.write("\t\txField: 'name',\r\n");
      out.write("\t\tyAxis: new Ext.chart.NumericAxis({\r\n");
      out.write("\t\t\tdisplayName: 'value'\r\n");
      out.write("\t\t}),\r\n");
      out.write("\t\ttipRenderer : function(chart, record, index, series){\r\n");
      out.write("\t\t\treturn record.data.name + ' 工作量 ：' + record.data.value;\r\n");
      out.write("\t\t},\r\n");
      out.write("\t\trefreshData : function(){\r\n");
      out.write("\t\t\tstoreChart2.removeAll(true);\r\n");
      out.write("\t\t\tvar datas = [];\r\n");
      out.write("\t\t\tfor(var i=0;i<store.getCount();i++){\r\n");
      out.write("\t\t\t\tvar record = store.getAt(i);\r\n");
      out.write("\t\t\t\tif(record.get(\"F_USER_ID\") > 0){\r\n");
      out.write("\t\t\t\t\tdatas.push({\r\n");
      out.write("\t\t\t\t\t\tname : record.get(\"F_USER_NAME\"),\r\n");
      out.write("\t\t\t\t\t\tvalue : record.get(\"F_SUM\")\r\n");
      out.write("\t\t\t\t\t})\r\n");
      out.write("\t\t\t\t}\r\n");
      out.write("            }\r\n");
      out.write("\t\t\tstoreChart2.loadData(datas);\r\n");
      out.write("        }\r\n");
      out.write("\t});\r\n");
      out.write("\r\n");
      out.write("\tstore.on('load', function(){\r\n");
      out.write("\t\tchart1.refreshData();\r\n");
      out.write("\t\tchart2.refreshData();\r\n");
      out.write("\t});\r\n");
      out.write("\r\n");
      out.write("\tvar chart = new Ext.Panel({\r\n");
      out.write("\t\tregion : 'south',\r\n");
      out.write("\t\tborder : false,\r\n");
      out.write("\t\tsplit : true,\r\n");
      out.write("        collapseMode:'mini',\r\n");
      out.write("        minSize: 300,\r\n");
      out.write("        maxSize: 300,\r\n");
      out.write("        height : 300,\r\n");
      out.write("        layout : 'border',\r\n");
      out.write("        defaults : {\r\n");
      out.write("\t\t\tlayout : 'fit',\r\n");
      out.write("\t\t\tborder : false\r\n");
      out.write("        },\r\n");
      out.write("        items :[{\r\n");
      out.write("    \t\tregion : 'west',\r\n");
      out.write("    \t\twidth : 320,\r\n");
      out.write("            title: '工作量分布结构图',\r\n");
      out.write("    \t\titems : chart1\r\n");
      out.write("        }, {\r\n");
      out.write("    \t\tregion : 'center',\r\n");
      out.write("            title: '员工工作量对比图',\r\n");
      out.write("    \t\titems : chart2\r\n");
      out.write("        }]\r\n");
      out.write("\t});\r\n");
      out.write("\t\r\n");
      out.write("\t// 视图刷新\r\n");
      out.write("\tpanel.refresh = function(params){\r\n");
      out.write("\t\tstore.baseParams.month = dateSelect.getRawValue();\r\n");
      out.write("\t\tstore.reload();\r\n");
      out.write("\t}\r\n");
      out.write("\t\r\n");
      out.write("\tvar ui = new Ext.Panel({\r\n");
      out.write("\t\tlayout:'border',\r\n");
      out.write("\t\tborder : false,\r\n");
      out.write("\t\titems : [grid, chart]\r\n");
      out.write("\t});\r\n");
      out.write("\t\r\n");
      out.write("\t// 输出附加脚本 end\r\n");
      out.write("\tpanel.add(ui);\r\n");
      out.write("\tpanel.doLayout();\r\n");
      out.write("\t// 初始化视图数据\r\n");
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
