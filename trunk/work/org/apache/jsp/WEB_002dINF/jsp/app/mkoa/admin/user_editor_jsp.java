/*
 * Generated by the Jasper component of Apache Tomcat
 * Version: Apache Tomcat/7.0.34
 * Generated at: 2013-01-28 08:31:38 UTC
 * Note: The last modified time of this file was set to
 *       the last modified time of the source file after
 *       generation to assist with modification tracking.
 */
package org.apache.jsp.WEB_002dINF.jsp.app.mkoa.admin;

import javax.servlet.*;
import javax.servlet.http.*;
import javax.servlet.jsp.*;

public final class user_editor_jsp extends org.apache.jasper.runtime.HttpJspBase
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

	String panelid = request.getParameter("panelid");

      out.write("\r\n");
      out.write("<script language='javascript'>\r\n");
      out.write("Ext.onReady(function(){\r\n");
      out.write("\tvar panelid = '");
      out.print(panelid);
      out.write("';\r\n");
      out.write("\tvar panel = Ext.getCmp(panelid);\r\n");
      out.write("\r\n");
      out.write("\tvar textField = new Ext.grid.GridEditor(new Ext.form.TextField({maxLength:100}));\r\n");
      out.write("\tvar textareaField = new Ext.grid.GridEditor(new Ext.form.TextArea({selectOnFocus:true, maxLength:200}));\r\n");
      out.write("\tvar displayField = new Ext.grid.GridEditor(new Ext.form.TextField({readOnly:true,selectOnFocus:true}));\r\n");
      out.write("\tvar stateField = new Ext.grid.GridEditor(new Ext.form.ComboBox({\r\n");
      out.write("\t    typeAhead: true,\r\n");
      out.write("\t    triggerAction: 'all',\r\n");
      out.write("\t    mode: 'local',\r\n");
      out.write("\t    store: new Ext.data.ArrayStore({\r\n");
      out.write("\t        fields: ['value', 'name'],\r\n");
      out.write("\t        data: [[0, '正常'], [1, '已离职']]\r\n");
      out.write("\t    }),\r\n");
      out.write("\t    valueField: 'value',\r\n");
      out.write("\t    displayField: 'name'\r\n");
      out.write("\t\t\r\n");
      out.write("\t}));\r\n");
      out.write("\tvar deptField = new Ext.form.ComboBox({\r\n");
      out.write("\t    typeAhead: true,\r\n");
      out.write("\t    triggerAction: 'all',\r\n");
      out.write("\t    mode: 'local',\r\n");
      out.write("\t    store: new Ext.data.JsonStore({\r\n");
      out.write("\t    \tidProperty : 'id',\r\n");
      out.write("\t        fields: ['id', 'caption']\r\n");
      out.write("\t    }),\r\n");
      out.write("\t    valueField: 'caption',\r\n");
      out.write("\t    displayField: 'caption',\r\n");
      out.write("\t    listeners : {\r\n");
      out.write("\t\t\t'selected' : function(combo, record, index){\r\n");
      out.write("\t\t\t\tpanel.editRecord.set('f_dept_id', record.get('id'));\r\n");
      out.write("\t\t\t}\r\n");
      out.write("\t    }\r\n");
      out.write("\t});\r\n");
      out.write("\tvar gDeptField = new Ext.grid.GridEditor(deptField);\r\n");
      out.write("\r\n");
      out.write("\t// ['f00id', 'f01rowstate', 'f02f_order', 'f03f_type', 'f04f_state', 'f05f_name', 'f06f_caption', 'f07f_dept_name', 'f08f_dept_id', 'f09f_email', 'f10f_cellphone', 'f11f_note', 'f12f_sign', 'f13f_depts','f14f_roles']\r\n");
      out.write("\tvar grid = new Ext.grid.PropertyGrid({\r\n");
      out.write("\t\tborder : false,\r\n");
      out.write("\t\tcustomEditors : {\r\n");
      out.write("\t\t\t\"f00id\" : displayField,\r\n");
      out.write("\t\t\t\"f04f_state\" : stateField,\r\n");
      out.write("\t        \"f05f_name\": new Ext.grid.GridEditor(new Ext.form.TextField({maxLength:20})),\r\n");
      out.write("\t        \"f06f_caption\": new Ext.grid.GridEditor(new Ext.form.TextField({maxLength:20})),\r\n");
      out.write("\t\t\t\"f07f_dept_name\" : gDeptField,\r\n");
      out.write("\t\t\t\"f09f_email\" : new Ext.grid.GridEditor(new Ext.form.TextField({maxLength:100})),\r\n");
      out.write("\t\t\t\"f10f_cellphone\" : new Ext.grid.GridEditor(new Ext.form.TextField({maxLength:15})),\r\n");
      out.write("\t\t\t\"f11f_note\" : textareaField,\r\n");
      out.write("\t        \"f12f_sign\" : displayField,\r\n");
      out.write("\t        \"f13f_depts\" : displayField,\r\n");
      out.write("\t        \"f14f_roles\" : displayField\r\n");
      out.write("\t\t},\r\n");
      out.write("\t\tcustomRenderers : {\r\n");
      out.write("\t\t\t\"f04f_state\" : function(v){\r\n");
      out.write("\t\t\t\tswitch(v){\r\n");
      out.write("\t\t\t\tcase 0: return '正常';\r\n");
      out.write("\t\t\t\tcase 1: return '已离职';\r\n");
      out.write("\t\t\t\tdefault : return v;\r\n");
      out.write("\t\t\t\t}\r\n");
      out.write("\t\t\t},\r\n");
      out.write("\t\t\t\"f12f_sign\" : function(v){\r\n");
      out.write("\t\t\t\tif(v && v != ''){\r\n");
      out.write("\t\t\t\t\treturn String.format('<IMG src=\"{0}\" height=30 width=70>', v);\r\n");
      out.write("\t\t\t\t}\r\n");
      out.write("\t\t\t}\r\n");
      out.write("\t\t},\r\n");
      out.write("\t\tpropertyNames : {\r\n");
      out.write("\t        \"f00id\": '<B>ID</B>（<FONT color=red>只读</FONT>）',\r\n");
      out.write("        \t\"f04f_state\" : '状态',\r\n");
      out.write("\t        \"f05f_name\": '登录名',\r\n");
      out.write("\t        \"f06f_caption\": '姓名',\r\n");
      out.write("\t\t\t\"f07f_dept_name\" : '默认部门',\r\n");
      out.write("\t\t\t\"f09f_email\" : '邮件地址',\r\n");
      out.write("\t\t\t\"f10f_cellphone\" : '手机号',\r\n");
      out.write("\t        \"f11f_note\": '说明',\r\n");
      out.write("\t        \"f12f_sign\" : '<B>签名</B>（<FONT color=red>只读</FONT>）',\r\n");
      out.write("\t        \"f13f_depts\" : '<B>所属部门</B>（<FONT color=red>只读</FONT>）',\r\n");
      out.write("\t        \"f14f_roles\" : '<B>用户角色</B>（<FONT color=red>只读</FONT>）'\r\n");
      out.write("\t\t}\r\n");
      out.write("\t});\r\n");
      out.write("\tgrid.on('propertychange', function(source, id, v, oldValue){\r\n");
      out.write("\t\tvar index = grid.getStore().find('name', id);\r\n");
      out.write("\t\tif(index >=0){\r\n");
      out.write("\t\t\tvar name = id.substring(3);\r\n");
      out.write("\t\t\tpanel.editRecord.set(name, v);\r\n");
      out.write("\t\t}\r\n");
      out.write("\t});\r\n");
      out.write("\tgrid.getColumnModel().setColumnWidth(0, 30);\r\n");
      out.write("\t\r\n");
      out.write("\tpanel.startEditRecord = function(record){\r\n");
      out.write("\t\tpanel.editRecord = record;\r\n");
      out.write("\t\tvar data = {};\r\n");
      out.write("\t\tvar fields = record.fields;\r\n");
      out.write("\t\tdeptField.getStore().loadData(record.get('f_depts'));\r\n");
      out.write("\t\tfor(var i=0;i<fields.getCount();i++){\r\n");
      out.write("\t\t\tvar field = fields.get(i);\r\n");
      out.write("\t\t\tvar key = 'f';\r\n");
      out.write("\t\t\tif(i>9){\r\n");
      out.write("\t\t\t\tkey = key + i + field.name;\r\n");
      out.write("\t\t\t}else{\r\n");
      out.write("\t\t\t\tkey = key + '0' + i + field.name;\r\n");
      out.write("\t\t\t}\r\n");
      out.write("\t\t\tif(Ext.isDefined(grid.propertyNames[key])){\r\n");
      out.write("\t\t\t\tif(typeof(record.get(field.name)) == 'object'){\r\n");
      out.write("\t\t\t\t\tvar value = '';\r\n");
      out.write("\t\t\t\t\tif(record.get(field.name) != null){\r\n");
      out.write("\t\t\t\t\t\tfor(var j=0;j<record.get(field.name).length;j++){\r\n");
      out.write("\t\t\t\t\t\t\tvalue = value + record.get(field.name)[j].caption + ';';\r\n");
      out.write("\t\t\t\t\t\t}\r\n");
      out.write("\t\t\t\t\t}\r\n");
      out.write("\t\t\t\t\tdata[key] = value;\r\n");
      out.write("\t\t\t\t}else{\r\n");
      out.write("\t\t\t\t\tdata[key] = record.get(field.name);\r\n");
      out.write("\t\t\t\t}\r\n");
      out.write("\t\t\t}\r\n");
      out.write("\t\t}\r\n");
      out.write("\t\tgrid.setSource(data);\r\n");
      out.write("\t\tpanel.enable();\r\n");
      out.write("\t\tpanel.editing = true;\r\n");
      out.write("\t}\r\n");
      out.write("\r\n");
      out.write("\tpanel.stopEditRecord = function(record, disable){\r\n");
      out.write("\t\tif(!panel.editing){\r\n");
      out.write("\t\t\treturn;\r\n");
      out.write("\t\t}\r\n");
      out.write("\t\tgrid.stopEditing();\r\n");
      out.write("\t\tif(disable){\r\n");
      out.write("\t\t\tpanel.editRecord = undefined;\r\n");
      out.write("\t\t\tpanel.disable();\r\n");
      out.write("\t\t\tpanel.editing = false;\r\n");
      out.write("\t\t}\r\n");
      out.write("\t}\r\n");
      out.write("\t\r\n");
      out.write("\tpanel.add(grid);\r\n");
      out.write("\tpanel.doLayout();\r\n");
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
