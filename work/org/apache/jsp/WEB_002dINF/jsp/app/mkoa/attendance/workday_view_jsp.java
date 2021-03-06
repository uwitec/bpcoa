/*
 * Generated by the Jasper component of Apache Tomcat
 * Version: Apache Tomcat/7.0.34
 * Generated at: 2013-01-29 06:18:33 UTC
 * Note: The last modified time of this file was set to
 *       the last modified time of the source file after
 *       generation to assist with modification tracking.
 */
package org.apache.jsp.WEB_002dINF.jsp.app.mkoa.attendance;

import javax.servlet.*;
import javax.servlet.http.*;
import javax.servlet.jsp.*;
import java.util.List;
import java.util.Date;
import com.mixky.engine.common.Action;
import com.google.gson.JsonObject;
import com.mixky.engine.view.ViewManager;
import com.mixky.engine.view.View;
import com.mixky.engine.view.Column;
import com.mixky.engine.authority.AuthorityManager;
import com.mixky.engine.organization.User;
import com.mixky.engine.module.DocumentType;
import com.mixky.engine.common.DesignObjectLoader;
import com.mixky.toolkit.DateUtil;

public final class workday_view_jsp extends org.apache.jasper.runtime.HttpJspBase
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
      out.write("\r\n");
      out.write("\r\n");
      out.write("\r\n");
      out.write("\r\n");
      out.write("\r\n");
      out.write("\r\n");
      out.write("\r\n");
      out.write("\r\n");

	String panelid = request.getParameter("panelid");
	View view = (View)request.getAttribute("view");
	User user = (User)request.getAttribute("user");
	List<Action> actions = AuthorityManager.instance().getDesignObjectsByUser(view.getF_buttons(), user);
	JsonObject cfg = view.getF_config();

      out.write("\r\n");
      out.write("<script language='javascript'>\r\n");
      out.write("Ext.onReady(function(){\r\n");
      out.write("\r\n");
      out.write("\tvar panel = Ext.getCmp('");
      out.print(panelid);
      out.write("');\r\n");
      out.write("\tvar win = panel.findParentByType('window');\r\n");
      out.write("\tvar renderCell = function(value, metadata, record , rowIndex, colIndex, store){\r\n");
      out.write("\t\tswitch(value.dayType){\r\n");
      out.write("\t\tcase 0:\t// 休息日\r\n");
      out.write("\t\t\tmetadata.css = 'mixky-attendance-restday-cell';\r\n");
      out.write("\t\t\treturn value.day;\r\n");
      out.write("\t\t\tbreak;\r\n");
      out.write("\t\tcase 1:\t// 工作日\r\n");
      out.write("\t\t\tmetadata.css = 'mixky-attendance-workday-cell';\r\n");
      out.write("\t\t\treturn value.day;\r\n");
      out.write("\t\t\tbreak;\r\n");
      out.write("\t\tcase 2: // 非当前月\r\n");
      out.write("\t\t\tmetadata.css = 'mixky-attendance-otherday-cell';\r\n");
      out.write("\t\t\treturn \"\";\r\n");
      out.write("\t\t\tbreak;\r\n");
      out.write("\t\t}\r\n");
      out.write("\t}\r\n");
      out.write("\tvar fields = [{\r\n");
      out.write("\t\tname : 'WEEK',\r\n");
      out.write("\t\tmapping : 'WEEK'\r\n");
      out.write("\t},{\r\n");
      out.write("\t\tname : 'MON',\r\n");
      out.write("\t\tmapping : 'MON'\r\n");
      out.write("\t},{\r\n");
      out.write("\t\tname : 'TUE',\r\n");
      out.write("\t\tmapping : 'TUE'\r\n");
      out.write("\t},{\r\n");
      out.write("\t\tname : 'WED',\r\n");
      out.write("\t\tmapping : 'WED'\r\n");
      out.write("\t},{\r\n");
      out.write("\t\tname : 'THU',\r\n");
      out.write("\t\tmapping : 'THU'\r\n");
      out.write("\t},{\r\n");
      out.write("\t\tname : 'FRI',\r\n");
      out.write("\t\tmapping : 'FRI'\r\n");
      out.write("\t},{\r\n");
      out.write("\t\tname : 'SAT',\r\n");
      out.write("\t\tmapping : 'SAT'\r\n");
      out.write("\t},{\r\n");
      out.write("\t\tname : 'SUN',\r\n");
      out.write("\t\tmapping : 'SUN'\r\n");
      out.write("\t}];\r\n");
      out.write("\t// 数据访问\r\n");
      out.write("\tvar store = new Ext.data.DirectStore({\r\n");
      out.write("\t\tdirectFn : AttendanceAppDirect.getMonthDaySetting,\r\n");
      out.write("\t\tparamOrder : ['day'],\r\n");
      out.write("\t\tbaseParams : {day:'");
      out.print(DateUtil.format(new Date(System.currentTimeMillis()), "yyyy-MM"));
      out.write("-01'},\r\n");
      out.write("\t\tremoteSort : true,\r\n");
      out.write("\t\troot : 'results',\r\n");
      out.write("\t\ttotalProperty : 'totals',\r\n");
      out.write("\t\tidProperty : 'WEEK',\r\n");
      out.write("\t\tfields : fields\r\n");
      out.write("\t});\r\n");
      out.write("\t// 选择器\r\n");
      out.write("\tvar sm = new Ext.grid.CellSelectionModel({\r\n");
      out.write("\t\tlisteners : {\r\n");
      out.write("\t\t\t'beforecellselect' : function(sm, row, col){\r\n");
      out.write("\t\t\t\tvar record = store.getAt(row);\r\n");
      out.write("\t\t\t\tvar fieldname = fields[col].name;\r\n");
      out.write("\t\t\t\tvar data = record.get(fieldname);\r\n");
      out.write("\t\t\t\tif(data.dayType == 2){\r\n");
      out.write("\t\t\t\t\treturn false;\r\n");
      out.write("\t\t\t\t}\r\n");
      out.write("\t\t\t}\r\n");
      out.write("\t\t}\r\n");
      out.write("\t});\r\n");
      out.write("\t// 显示列\r\n");
      out.write("\tvar columns = [{\r\n");
      out.write("\t\tfixed:true,\r\n");
      out.write("\t    menuDisabled:true,\r\n");
      out.write("\t    width: 23,\r\n");
      out.write("\t\tid : 'numberer',\r\n");
      out.write("\t\tdataIndex : 'WEEK',\r\n");
      out.write("\t\trenderer : function(value, metadata, record , rowIndex, colIndex, store){\r\n");
      out.write("\t\t\tmetadata.attr = \"style='height:50px'\";\r\n");
      out.write("\t\t\treturn value;\r\n");
      out.write("\t\t}\r\n");
      out.write("\t}, {\r\n");
      out.write("\t\tid : 'MON',\r\n");
      out.write("\t\tdataIndex : 'MON',\r\n");
      out.write("\t\theader : '周一',\r\n");
      out.write("\t    width: 50,\r\n");
      out.write("\t\trenderer : renderCell,\r\n");
      out.write("\t\tmenuDisabled : true,\r\n");
      out.write("\t\tcss : 'width:14%'\r\n");
      out.write("\t}, {\r\n");
      out.write("\t\tid : 'TUE',\r\n");
      out.write("\t\tdataIndex : 'TUE',\r\n");
      out.write("\t\theader : '周二',\r\n");
      out.write("\t\tmenuDisabled : true,\r\n");
      out.write("\t    width: 50,\r\n");
      out.write("\t\trenderer : renderCell,\r\n");
      out.write("\t\tcss : 'width:14%'\r\n");
      out.write("\t}, {\r\n");
      out.write("\t\tid : 'WED',\r\n");
      out.write("\t\tdataIndex : 'WED',\r\n");
      out.write("\t\theader : '周三',\r\n");
      out.write("\t\tmenuDisabled : true,\r\n");
      out.write("\t    width: 50,\r\n");
      out.write("\t\trenderer : renderCell,\r\n");
      out.write("\t\tcss : 'width:14%'\r\n");
      out.write("\t}, {\r\n");
      out.write("\t\tid : 'THU',\r\n");
      out.write("\t\tdataIndex : 'THU',\r\n");
      out.write("\t\theader : '周四',\r\n");
      out.write("\t\tmenuDisabled : true,\r\n");
      out.write("\t    width: 50,\r\n");
      out.write("\t\trenderer : renderCell,\r\n");
      out.write("\t\tcss : 'width:14%'\r\n");
      out.write("\t}, {\r\n");
      out.write("\t\tid : 'FRI',\r\n");
      out.write("\t\tdataIndex : 'FRI',\r\n");
      out.write("\t\theader : '周五',\r\n");
      out.write("\t\tmenuDisabled : true,\r\n");
      out.write("\t    width: 50,\r\n");
      out.write("\t\trenderer : renderCell,\r\n");
      out.write("\t\tcss : 'width:14%'\r\n");
      out.write("\t}, {\r\n");
      out.write("\t\tid : 'SAT',\r\n");
      out.write("\t\tdataIndex : 'SAT',\r\n");
      out.write("\t\theader : '周六',\r\n");
      out.write("\t\tmenuDisabled : true,\r\n");
      out.write("\t    width: 50,\r\n");
      out.write("\t\trenderer : renderCell,\r\n");
      out.write("\t\tcss : 'width:14%'\r\n");
      out.write("\t}, {\r\n");
      out.write("\t\tid : 'SUN',\r\n");
      out.write("\t\tdataIndex : 'SUN',\r\n");
      out.write("\t\theader : '周日',\r\n");
      out.write("\t\tmenuDisabled : true,\r\n");
      out.write("\t    width: 50,\r\n");
      out.write("\t\trenderer : renderCell,\r\n");
      out.write("\t\tcss : 'width:14%'\r\n");
      out.write("\t}];\r\n");
      out.write("\t// 选择当前月\r\n");
      out.write("\tvar dateSelect = new Ext.form.DateField({\r\n");
      out.write("\t\tvalue:'");
      out.print(DateUtil.format(new Date(System.currentTimeMillis()), "yyyy-MM"));
      out.write("-01', \r\n");
      out.write("\t\teditable : false, \r\n");
      out.write("\t\tformat : 'Y-m',\r\n");
      out.write("\t\twidth : 70,\r\n");
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
      out.write("\t\t\tvar date = new Date(store.baseParams.day);\r\n");
      out.write("\t\t\tdateSelect.setValue(date.add(Date.MONTH, 1).format('Y-m-d'));\r\n");
      out.write("\t\t\tpanel.refresh();\r\n");
      out.write("\t\t}\r\n");
      out.write("\t});\r\n");
      out.write("\t// 下月\r\n");
      out.write("\tvar btnPreMonth = new Ext.Action({\r\n");
      out.write("\t\ticonCls : 'icon-sys-btnback',\r\n");
      out.write("\t\thandler : function(){\r\n");
      out.write("\t\t\tvar date = new Date(store.baseParams.day);\r\n");
      out.write("\t\t\tdateSelect.setValue(date.add(Date.MONTH, -1).format('Y-m-d'));\r\n");
      out.write("\t\t\tpanel.refresh();\r\n");
      out.write("\t\t}\r\n");
      out.write("\t});\r\n");
      out.write("\t// 刷新\r\n");
      out.write("\tvar btnRefresh = new Ext.Action({\r\n");
      out.write("\t\ticonCls : 'icon-sys-refresh',\r\n");
      out.write("\t\ttext : '刷新',\r\n");
      out.write("\t\thandler : function(){\r\n");
      out.write("\t\t\tpanel.refresh();\r\n");
      out.write("\t\t}\r\n");
      out.write("\t});\r\n");
      out.write("\t// 视图操作\r\n");
      out.write("\tvar tools = [btnPreMonth, dateSelect, btnNextMonth,'-', '->'];\r\n");
      out.write("\tvar contextmenus = [];\r\n");

	for(int i=0;i<actions.size();i++){
		Action action = actions.get(i);

      out.write("\r\n");
      out.write("\tvar ");
      out.print(action.getF_key());
      out.write(" = new Ext.Action({\r\n");
      out.write("\t\ttext : '");
      out.print(action.getF_caption());
      out.write("',\r\n");
      out.write("\t\ticonCls : '");
      out.print(action.getIcon());
      out.write("',\r\n");
      out.write("\t\tisDefault : ");
      out.print(action.getF_default());
      out.write(',');
      out.write('\r');
      out.write('\n');

		if(action.getF_handler() == null || "".equals(action.getF_handler())){

      out.write("\r\n");
      out.write("\t\thandler : Ext.emptyFn\r\n");

		}else{

      out.write("\r\n");
      out.write("\t\thandler : ");
      out.print(action.getF_handler());
      out.write('\r');
      out.write('\n');

		}

      out.write("\r\n");
      out.write("\t});\r\n");
      out.write("\ttools.push(");
      out.print(action.getF_key());
      out.write(");\r\n");
      out.write("\tcontextmenus.push(");
      out.print(action.getF_key());
      out.write(");\r\n");

	}

      out.write("\r\n");
      out.write("\ttools.push(btnRefresh);\r\n");
      out.write("\t\r\n");
      out.write("\t// 表格对象\r\n");
      out.write("\tvar grid = new Ext.grid.GridPanel({\r\n");
      out.write("\t\tborder : false,\r\n");
      out.write("\t\tstripeRows: false,\r\n");
      out.write("\t\ttrackMouseOver: false,\r\n");
      out.write("\t\tenableHdMenu : true,\r\n");
      out.write("\t\tlineBreak : true,\r\n");
      out.write("\t\tcellSelect : true,\r\n");
      out.write("\t\tcolumnLines : true,\r\n");
      out.write("        loadMask: {msg:'正在装载...'},\r\n");
      out.write("        tbar:tools,\r\n");
      out.write("\t\tcontextMenu : new Ext.menu.Menu({items:contextmenus}),\r\n");
      out.write("\t\tlisteners : {\r\n");
      out.write("\t\t\t'cellcontextmenu' : function(g, row, col, e){\r\n");
      out.write("\t\t\t\tg.getSelectionModel().select(row, col);\r\n");
      out.write("\t\t\t\tg.contextMenu.showAt(e.getXY());\r\n");
      out.write("\t\t\t}\r\n");
      out.write("\t\t},\r\n");
      out.write("\t\tsm : sm,\r\n");
      out.write("\t\tcolumns : columns,\r\n");
      out.write("\t\tstore : store\r\n");
      out.write("\t});\r\n");
      out.write("\t\r\n");
      out.write("\tpanel.getSelectedCell = function(){\r\n");
      out.write("\t\tvar cell = sm.getSelectedCell();\r\n");
      out.write("\t\tif(cell != null){\r\n");
      out.write("\t\t\tvar record = store.getAt(cell[0]);\r\n");
      out.write("\t\t\tvar fieldname = fields[cell[1]].name;\r\n");
      out.write("\t\t\tvar data = record.get(fieldname);\r\n");
      out.write("\t\t\treturn {record : record, fieldname:fieldname, data:data};\r\n");
      out.write("\t\t}\r\n");
      out.write("\t\treturn undefined;\r\n");
      out.write("\t}\r\n");
      out.write("\t\r\n");
      out.write("\t// 视图刷新\r\n");
      out.write("\tpanel.refresh = function(params){\r\n");
      out.write("\t\tstore.baseParams.day = dateSelect.getRawValue() + '-01';\r\n");
      out.write("\t\tstore.reload();\r\n");
      out.write("\t}\r\n");
      out.write("\r\n");
      out.write("\t// 输出附加脚本 begin\r\n");

	if(cfg!=null && cfg.has("customscript")){
		out.print(cfg.get("customscript").getAsString());
	}

      out.write("\r\n");
      out.write("\t// 输出附加脚本 end\r\n");
      out.write("\tpanel.add(grid);\r\n");
      out.write("\tpanel.doLayout();\r\n");
      out.write("\t// 初始化视图数据\r\n");
      out.write("\tpanel.refresh(panel.initParams);\r\n");
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
