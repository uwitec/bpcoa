/*
 * Generated by the Jasper component of Apache Tomcat
 * Version: Apache Tomcat/7.0.34
 * Generated at: 2013-02-20 02:08:07 UTC
 * Note: The last modified time of this file was set to
 *       the last modified time of the source file after
 *       generation to assist with modification tracking.
 */
package org.apache.jsp.WEB_002dINF.jsp.designtool.authority;

import javax.servlet.*;
import javax.servlet.http.*;
import javax.servlet.jsp.*;

public final class menuauth_list_jsp extends org.apache.jasper.runtime.HttpJspBase
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

      out.write('\r');
      out.write('\n');

	String id = request.getParameter("id");

      out.write("\r\n");
      out.write("<script language='javascript'>\r\n");
      out.write("Ext.onReady(function(){\r\n");
      out.write("\tvar id = '");
      out.print(id);
      out.write("';\r\n");
      out.write("\r\n");
      out.write("\tvar panel = Ext.getCmp(id);\r\n");
      out.write("\tpanel.setTitle('菜单权限');\r\n");
      out.write("\r\n");
      out.write("\t// 存储字段\r\n");
      out.write("\tvar fields = [\r\n");
      out.write("\t\t{name:'id', mapping:'id'},\r\n");
      out.write("\t  \t{name:'f_no', mapping:'f_no'},\r\n");
      out.write("\t\t{name:'f_name', mapping:'f_name'},\r\n");
      out.write("\t\t{name:'f_caption', mapping:'f_caption'},\r\n");
      out.write("\t\t{name:'f_auth_caption', mapping:'f_auth_caption'},\r\n");
      out.write("\t\t{name:'f_auth', mapping:'f_auth'}\r\n");
      out.write("\t];\r\n");
      out.write("\t// 列表字段\r\n");
      out.write("\tvar columns = [new Ext.grid.RowNumberer(),{\r\n");
      out.write("\t\tid : 'f_no',\r\n");
      out.write("\t\tdataIndex : 'f_no',\r\n");
      out.write("\t\twidth:70,\r\n");
      out.write("\t\theader : '编号'\r\n");
      out.write("\t},{\r\n");
      out.write("\t\tid : 'f_name',\r\n");
      out.write("\t\tdataIndex : 'f_name',\r\n");
      out.write("\t\theader : '标识',\r\n");
      out.write("\t\twidth:120,\r\n");
      out.write("\t},{\r\n");
      out.write("\t\tid : 'f_caption',\r\n");
      out.write("\t\tdataIndex : 'f_caption',\r\n");
      out.write("\t\twidth:120,\r\n");
      out.write("\t\theader : '名称'\r\n");
      out.write("\t},{\r\n");
      out.write("\t\tid : 'f_auth_caption',\r\n");
      out.write("\t\tdataIndex : 'f_auth_caption',\r\n");
      out.write("\t\theader : '权限定义'\r\n");
      out.write("\t}];\r\n");
      out.write("\t// 数据访问\r\n");
      out.write("\tvar store = new Ext.data.DirectStore({\r\n");
      out.write("\t\tdirectFn : DesktopDirect.getAllMenuList,\r\n");
      out.write("\t\tparamOrder:[],\r\n");
      out.write("\t\troot : 'results',\r\n");
      out.write("\t\ttotalProperty : 'totals',\r\n");
      out.write("\t\tidProperty : 'id',\r\n");
      out.write("\t\tsortInfo: {field:'f_no', direction: 'ASC'},\r\n");
      out.write("\t\tfields:fields\r\n");
      out.write("\t});\r\n");
      out.write("\tfunction updateAuth(display, values, records){\r\n");
      out.write("\t\tvar record = grid.getSelectionModel().getSelected();\r\n");
      out.write("\t\trecord.set('f_auth', values);\r\n");
      out.write("\t\trecord.set('f_auth_caption', display);\r\n");
      out.write("\t}\r\n");
      out.write("    // 功能条\r\n");
      out.write("    var editAction = new Ext.Action({\r\n");
      out.write("\t\ttext:'设置权限',\r\n");
      out.write("\t\ticonCls:'icon-designtool-edit',\r\n");
      out.write("\t\thandler:function(){\r\n");
      out.write("\t\t\tvar record = grid.getSelectionModel().getSelected();\r\n");
      out.write("\t\t\tif(!record){\r\n");
      out.write("\t\t\t\treturn;\r\n");
      out.write("\t\t\t}\r\n");
      out.write("    \t\tMixky.editor.showOrganizationWindow(updateAuth, record.get('f_auth'), {});\r\n");
      out.write("\t\t}\r\n");
      out.write("\t});\r\n");
      out.write("\t\r\n");
      out.write("    var tools = [editAction];\r\n");
      out.write("\r\n");
      out.write("\t// 表格对象\r\n");
      out.write("\tvar grid = new Ext.grid.GridPanel({\r\n");
      out.write("    \tregion : 'center',\r\n");
      out.write("\t\tborder : false,\r\n");
      out.write("\t\tcolumns : columns,\r\n");
      out.write("\t\tautoExpandColumn:'f_auth_caption',\r\n");
      out.write("\t\tenableHdMenu:false,\r\n");
      out.write("\t\tenableColumnMove:false,\r\n");
      out.write("\t\tstore : store,\r\n");
      out.write("\t\ttbar : tools,\r\n");
      out.write("\t\tcontextMenu : new Ext.menu.Menu({items:tools}),\r\n");
      out.write("\t\tlisteners : {\r\n");
      out.write("\t\t\t'rowcontextmenu' : function(g, rowIndex, e){\r\n");
      out.write("\t\t\t\tg.getSelectionModel().selectRow(rowIndex);\r\n");
      out.write("\t\t\t\tg.contextMenu.showAt(e.getXY());\r\n");
      out.write("\t\t\t},\r\n");
      out.write("\t\t\t'rowdblclick' : function(g, rowIndex, e){\r\n");
      out.write("\t\t\t\teditAction.execute();\r\n");
      out.write("\t\t\t}\r\n");
      out.write("\t\t}\r\n");
      out.write("\t});\r\n");
      out.write("\r\n");
      out.write("\t// 刷新\r\n");
      out.write("\tpanel.refresh = function(){\r\n");
      out.write("\t\tstore.reload();\r\n");
      out.write("\t}\r\n");
      out.write("\t// 保存属性修改\r\n");
      out.write("\tpanel.save = function(needSaveNext){\r\n");
      out.write("\t\tvar modifieds = store.getModifiedRecords();\r\n");
      out.write("\t\tif(modifieds.length > 0){\r\n");
      out.write("\t\t\tvar record = modifieds[0];\r\n");
      out.write("\t\t\tvar id = record.get('id');\r\n");
      out.write("\t\t\tvar auth = record.get('f_auth');\r\n");
      out.write("\t\t\tvar authCaption = record.get('f_auth_caption');\r\n");
      out.write("\t\t\tDesktopDirect.saveMenuAuth(id, auth, authCaption, function(result, e){\r\n");
      out.write("\t\t\t\tif(result && result.success){\r\n");
      out.write("\t\t\t\t\trecord.commit();\r\n");
      out.write("\t\t\t\t\tpanel.save(needSaveNext);\r\n");
      out.write("\t\t\t\t}\r\n");
      out.write("\t\t\t});\r\n");
      out.write("\t\t}else{\r\n");
      out.write("\t\t\tMixky.designtool.Framework.contentPanel.savePanelOver(panel, needSaveNext);\r\n");
      out.write("\t\t}\r\n");
      out.write("\t};\r\n");
      out.write("\tpanel.add(grid);\r\n");
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
