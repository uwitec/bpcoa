/*
 * Generated by the Jasper component of Apache Tomcat
 * Version: Apache Tomcat/7.0.34
 * Generated at: 2013-02-19 02:08:06 UTC
 * Note: The last modified time of this file was set to
 *       the last modified time of the source file after
 *       generation to assist with modification tracking.
 */
package org.apache.jsp.WEB_002dINF.jsp.designtool.ui;

import javax.servlet.*;
import javax.servlet.http.*;
import javax.servlet.jsp.*;

public final class objectgrideditor_jsp extends org.apache.jasper.runtime.HttpJspBase
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
	String key = request.getParameter("key");
	String mclass = request.getParameter("mclass");
	String type = request.getParameter("type");

      out.write("\r\n");
      out.write("<script language='javascript'>\r\n");
      out.write("Ext.onReady(function(){\r\n");
      out.write("\tvar id = '");
      out.print(id);
      out.write("';\r\n");
      out.write("\tvar key = '");
      out.print(key);
      out.write("';\r\n");
      out.write("\tvar mclass = '");
      out.print(mclass);
      out.write("';\r\n");
      out.write("\tvar type = '");
      out.print(type);
      out.write("';\r\n");
      out.write("\t// 获得对象的属性列表\r\n");
      out.write("\tvar parentModule = Mixky.designtool.Class.getModule(mclass);\r\n");
      out.write("\tvar module = Mixky.designtool.Class.getModule(type);\r\n");
      out.write("\t\r\n");
      out.write("\tvar panel = Ext.getCmp(id);\r\n");
      out.write("\tif(panel.title){\r\n");
      out.write("\t\tpanel.setTitle(module.text + '列表');\r\n");
      out.write("\t}\r\n");
      out.write("\r\n");
      out.write("\t// 合并属性\r\n");
      out.write("\tvar properties = {};\r\n");
      out.write("\tfor(var i=0;i<Mixky.designtool.Class.defaultProperties.length;i++){\r\n");
      out.write("\t\tvar p = Mixky.designtool.Class.defaultProperties[i];\r\n");
      out.write("\t\tproperties[p.name] = p;\r\n");
      out.write("\t}\r\n");
      out.write("\tif(module.properties){\r\n");
      out.write("\t\tfor(var i=0;i<module.properties.length;i++){\r\n");
      out.write("\t\t\tvar p = module.properties[i];\r\n");
      out.write("\t\t\tif(p.xconfig && p.xconfig.selectInParent){\r\n");
      out.write("\t\t\t\tp.xconfig.parentKey = key;\r\n");
      out.write("\t\t\t}\r\n");
      out.write("\t\t\tproperties[p.name] = p;\r\n");
      out.write("\t\t}\r\n");
      out.write("\t}\r\n");
      out.write("\t// 存储字段\r\n");
      out.write("\tvar fields = [{name:'key', mapping:'key'}];\r\n");
      out.write("\tif(module.orderable){\r\n");
      out.write("\t\tfields.push({name:'f_order', mapping:'f_order'});\r\n");
      out.write("\t}\r\n");
      out.write("\tfor(var n in properties){\r\n");
      out.write("\t\tvar f = {name:n, mapping:n};\r\n");
      out.write("\t\tif(Ext.isDefined(properties[n].xconfig) && \r\n");
      out.write("\t\t\t\tExt.isDefined(properties[n].xconfig.remoteRenderType)){\r\n");
      out.write("\t\t\tf.remoteRenderType = properties[n].xconfig.remoteRenderType;\r\n");
      out.write("\t\t\tfields.push({name:n + '_display', mapping:n + '_display', isDisplayColumn:true, valueField:n});\r\n");
      out.write("\t\t}\r\n");
      out.write("\t\tif(properties[n].xeditor == 'jsonobject'){\r\n");
      out.write("\t\t\tf.isDisplayColumn = true;\r\n");
      out.write("\t\t\tf.valueField = n;\r\n");
      out.write("\t\t}\r\n");
      out.write("\t\tif(properties[n].xeditor == 'date'){\r\n");
      out.write("\t\t\tf.dateFormat = 'Y-m-d';\r\n");
      out.write("\t\t\tf.type = 'date';\r\n");
      out.write("\t\t}\r\n");
      out.write("\t\tif(properties[n].xeditor == 'datetime'){\r\n");
      out.write("\t\t\tf.dateFormat = 'Y-m-d';\r\n");
      out.write("\t\t\tf.type = 'date';\r\n");
      out.write("\t\t}\r\n");
      out.write("\t\tfields.push(f);\r\n");
      out.write("\t}\r\n");
      out.write("\t\r\n");
      out.write("\tvar renderer = function(value, p, record){\r\n");
      out.write("\t\tvar type = record.get(\"f_class\");\r\n");
      out.write("\t\treturn String.format(\"<div style='height:16px;padding-left:23px;background:transparent url(icon/{0}.gif) no-repeat'> {1}</div>\", type, value);\r\n");
      out.write("\t}\r\n");
      out.write("\t// 列表字段\r\n");
      out.write("\tvar columns = [new Ext.grid.RowNumberer()];\r\n");
      out.write("\tif(module.propertyColumns){\r\n");
      out.write("\t\tfor(n in module.propertyColumns){\r\n");
      out.write("\t\t\tvar col;\r\n");
      out.write("\t\t\tif(Ext.isDefined(properties[n].xconfig) && \r\n");
      out.write("\t\t\t\t\tExt.isDefined(properties[n].xconfig.remoteRenderType)){\r\n");
      out.write("\t\t\t\tcol = {\r\n");
      out.write("\t\t\t\t\tid : properties[n].name + '_display',\r\n");
      out.write("\t\t\t\t\tdataIndex : properties[n].name + '_display',\r\n");
      out.write("\t\t\t\t\theader : properties[n].text\r\n");
      out.write("\t\t\t\t}\r\n");
      out.write("\t\t\t}else{\r\n");
      out.write("\t\t\t\tcol = {\r\n");
      out.write("\t\t\t\t\tid : properties[n].name,\r\n");
      out.write("\t\t\t\t\tdataIndex : properties[n].name,\r\n");
      out.write("\t\t\t\t\theader : properties[n].text\r\n");
      out.write("\t\t\t\t}\r\n");
      out.write("\t\t\t}\r\n");
      out.write("\t\t\tif(n == 'f_key'){\r\n");
      out.write("\t\t\t\tcol.renderer = renderer;\r\n");
      out.write("\t\t\t}\r\n");
      out.write("\t\t\tExt.apply(col, module.propertyColumns[n]);\r\n");
      out.write("\t\t\tif(!col.editor){\r\n");
      out.write("\t\t\t\tswitch(properties[n].xeditor){\r\n");
      out.write("\t\t        case 'none':\r\n");
      out.write("\t\t\t        break;\r\n");
      out.write("\t\t        case 'extend':\r\n");
      out.write("\t\t        \tcol.editor = Mixky.lib.getEditorComponent(properties[n].xeditor, properties[n].xconfig);\r\n");
      out.write("\t\t        \tbreak;\r\n");
      out.write("\t\t        case 'custom':\r\n");
      out.write("\t\t        \tcol.editor = Ext.ComponentMgr.create(properties[n].xconfig.editor);\r\n");
      out.write("\t\t        \tbreak;\r\n");
      out.write("\t\t    \tcase 'jsonobject':\r\n");
      out.write("\t\t        \tcol.editor = Mixky.lib.getEditorComponent('jsonobject', properties[n].xconfig);\r\n");
      out.write("\t\t        \tcol.renderer = function(bVal){\r\n");
      out.write("\t\t\t        \tif(typeof(bVal) == 'object'){\r\n");
      out.write("\t\t                \treturn Ext.encode(bVal);\r\n");
      out.write("\t\t\t        \t}else{\r\n");
      out.write("\t\t\t\t        \treturn bVal;\r\n");
      out.write("\t\t\t\t        }\r\n");
      out.write("\t\t            }\r\n");
      out.write("\t\t    \t\tbreak;\r\n");
      out.write("\t\t        case 'selectkeymap':\r\n");
      out.write("\t\t        \tcol.editor = Mixky.lib.getEditorComponent(properties[n].xeditor, properties[n].xconfig);\r\n");
      out.write("\t\t        \tcol.renderer = function(bVal){\r\n");
      out.write("\t\t\t        \tvar n = this.id;\r\n");
      out.write("\t\t            \tfor(var i=0;i<properties[n].xconfig.datas.length;i++){\r\n");
      out.write("\t\t            \t\tif(bVal == properties[n].xconfig.datas[i][0]){\r\n");
      out.write("\t\t            \t\t\treturn properties[n].xconfig.datas[i][1];\r\n");
      out.write("\t\t            \t\t}\r\n");
      out.write("\t\t            \t}\r\n");
      out.write("\t\t            \treturn bVal;\r\n");
      out.write("\t\t\t        }\r\n");
      out.write("\t\t        \tbreak;\r\n");
      out.write("\t\t        case 'date':\r\n");
      out.write("\t\t        \tcol.renderer = function(dateVal){\r\n");
      out.write("\t\t\t        \tif(typeof dateVal == 'object'){\r\n");
      out.write("\t\t\t            \treturn dateVal.dateFormat('Y-m-d');\r\n");
      out.write("\t\t\t        \t}else{\r\n");
      out.write("\t\t\t\t        \treturn dateVal;\r\n");
      out.write("\t\t\t\t        }\r\n");
      out.write("\t\t\t        }\r\n");
      out.write("\t\t        \tcol.editor = Mixky.lib.getEditorComponent(properties[n].xeditor, properties[n].xconfig);\r\n");
      out.write("\t\t        \tbreak;\r\n");
      out.write("\t\t        case 'datetime':\r\n");
      out.write("\t\t        \tcol.renderer = function(dateVal){\r\n");
      out.write("\t\t\t        \tif(typeof dateVal == 'object'){\r\n");
      out.write("\t\t\t            \treturn dateVal.dateFormat('Y-m-d');\r\n");
      out.write("\t\t\t        \t}else{\r\n");
      out.write("\t\t\t\t        \treturn dateVal;\r\n");
      out.write("\t\t\t\t        }\r\n");
      out.write("\t\t\t        }\r\n");
      out.write("\t\t        \tcol.editor = Mixky.lib.getEditorComponent(properties[n].xeditor, properties[n].xconfig);\r\n");
      out.write("\t\t        \tbreak;\r\n");
      out.write("\t\t        default:\r\n");
      out.write("\t\t        \tcol.editor = Mixky.lib.getEditorComponent(properties[n].xeditor, properties[n].xconfig);\r\n");
      out.write("\t\t        \tbreak;\r\n");
      out.write("\t\t\t\t}\r\n");
      out.write("\t\t        Mixky.lib.setFieldInitConfig(properties[n].xeditor, col.editor, properties[n].xconfig);\r\n");
      out.write("\t\t\t}\r\n");
      out.write("\t\t\tcolumns.push(col);\r\n");
      out.write("\t\t}\r\n");
      out.write("\t}\r\n");
      out.write("\t// 数据访问\r\n");
      out.write("\tvar store = new Ext.data.DirectStore({\r\n");
      out.write("\t\tpruneModifiedRecords : true,\r\n");
      out.write("\t\tdirectFn : DesignToolDirect.getSubObjectList,\r\n");
      out.write("\t\tparamOrder:['key', 'mclass'],\r\n");
      out.write("\t\tbaseParams : {\r\n");
      out.write("\t\t\tkey : key,\r\n");
      out.write("\t\t\tmclass : type\r\n");
      out.write("\t\t},\r\n");
      out.write("\t\troot : 'results',\r\n");
      out.write("\t\ttotalProperty : 'totals',\r\n");
      out.write("\t\tidProperty : 'f_key',\r\n");
      out.write("\t\tsortInfo: module.orderable ? {field:'f_order', direction: 'ASC'} : undefined,\r\n");
      out.write("\t\tfields:fields\r\n");
      out.write("\t});\r\n");
      out.write("\t// 远程渲染\r\n");
      out.write("\tstore.on('load', function(){\r\n");
      out.write("\t\tMixky.lib.remoteRenderStore(store);\r\n");
      out.write("\t});\r\n");
      out.write("    // 功能条\r\n");
      out.write("    var AddAction = new Ext.Action({\r\n");
      out.write("\t\ttext:'添加',\r\n");
      out.write("\t\ticonCls:'icon-designtool-add',\r\n");
      out.write("\t\thandler:function(){\r\n");
      out.write("\t\t\tif(roweditor.editing){\r\n");
      out.write("\t\t\t\treturn;\r\n");
      out.write("\t\t\t}\r\n");
      out.write("\t\t\tMixky.designtool.lib.addDesignObject(key, type, function(newkey, mclass){\r\n");
      out.write("\t\t\t\tpanel.refresh();\r\n");
      out.write("\t\t\t});\r\n");
      out.write("\t\t}\r\n");
      out.write("\t});\r\n");
      out.write("    var CopyAction = new Ext.Action({\r\n");
      out.write("\t\ttext:'复制',\r\n");
      out.write("\t\ticonCls:'icon-designtool-copy',\r\n");
      out.write("\t\thandler:function(){\r\n");
      out.write("\t\t\tvar record = grid.getSelectionModel().getSelected();\r\n");
      out.write("\t\t\tif(!record){\r\n");
      out.write("\t\t\t\treturn;\r\n");
      out.write("\t\t\t}\r\n");
      out.write("    \t\tMixky.designtool.Context.clipboardObject = {key:record.get('key'), mclass:type};\r\n");
      out.write("\t\t}\r\n");
      out.write("\t});\r\n");
      out.write("    var PasteAction = new Ext.Action({\r\n");
      out.write("\t\ttext:'粘贴',\r\n");
      out.write("\t\ticonCls:'icon-designtool-paste',\r\n");
      out.write("\t\thandler:function(){\r\n");
      out.write("\t\t\tif(roweditor.editing){\r\n");
      out.write("\t\t\t\treturn;\r\n");
      out.write("\t\t\t}\r\n");
      out.write("\t\t\tvar srcoid = Mixky.designtool.Context.clipboardObject;\r\n");
      out.write("\t\t\tvar dstoid = {mclass:mclass, key:key};\r\n");
      out.write("\t\t\tif(!srcoid){\r\n");
      out.write("\t\t\t\talert('剪贴板为空');\r\n");
      out.write("\t\t\t\t\r\n");
      out.write("\t\t\t\treturn;\r\n");
      out.write("\t\t\t}\r\n");
      out.write("\t\t\tExt.Msg.prompt('粘帖对象', '请输入新对象键值:', function(btn, newkey){\r\n");
      out.write("\t\t\t    if (btn == 'ok'){\r\n");
      out.write("\t\t\t\t\tDesignToolDirect.pasteObject(srcoid.key, dstoid.key, newkey, function(result, e){\r\n");
      out.write("\t\t\t\t\t\tif(result.success){\r\n");
      out.write("\t\t\t\t\t\t\tpanel.refresh();\r\n");
      out.write("\t\t\t\t\t\t}else{\r\n");
      out.write("\t\t\t\t\t\t\talert('paste object [' + srcoid.mclass + '][' + srcoid.key + '] to ' + '[' + dstoid.mclass + '][' + dstoid.key + '] failed');\r\n");
      out.write("\t\t\t\t\t\t}\r\n");
      out.write("\t\t\t\t\t});\r\n");
      out.write("\t\t\t    }\r\n");
      out.write("\t\t\t});\r\n");
      out.write("\t\t}\r\n");
      out.write("\t});\r\n");
      out.write("    var RenameAction = new Ext.Action({\r\n");
      out.write("\t\ttext:'修改键值',\r\n");
      out.write("\t\ticonCls:'icon-designtool-rename',\r\n");
      out.write("\t\thandler:function(){\r\n");
      out.write("\t\t\tif(roweditor.editing){\r\n");
      out.write("\t\t\t\treturn;\r\n");
      out.write("\t\t\t}\r\n");
      out.write("\t\t\tvar record = grid.getSelectionModel().getSelected();\r\n");
      out.write("\t\t\tif(!record){\r\n");
      out.write("\t\t\t\treturn;\r\n");
      out.write("\t\t\t}\r\n");
      out.write("\t\t\tMixky.designtool.lib.showRenameWindow(function(oldKey, newKey){\r\n");
      out.write("\t\t\t\tDesignToolDirect.renameObject(oldKey, newKey, function(result, e){\r\n");
      out.write("\t\t\t\t\tif(result.success){\r\n");
      out.write("\t\t\t\t\t\tpanel.refresh();\r\n");
      out.write("\t\t\t\t\t}else{\r\n");
      out.write("\t\t\t\t\t\talert('rename object [' + oldName + '] to [' + newName + '] failed');\r\n");
      out.write("\t\t\t\t\t}\r\n");
      out.write("\t\t\t\t});\r\n");
      out.write("\t\t\t}, record.get('key'));\r\n");
      out.write("\t\t}\r\n");
      out.write("\t});\r\n");
      out.write("    var DelAction = new Ext.Action({\r\n");
      out.write("\t\ttext:'删除',\r\n");
      out.write("\t\ticonCls:'icon-designtool-delete',\r\n");
      out.write("\t\thandler:function(){\r\n");
      out.write("\t\t\tif(roweditor.editing){\r\n");
      out.write("\t\t\t\treturn;\r\n");
      out.write("\t\t\t}\r\n");
      out.write("\t\t\tvar s = grid.getSelectionModel().getSelections();\r\n");
      out.write("\t\t\tif(s.length == 0){\r\n");
      out.write("\t\t\t\treturn;\r\n");
      out.write("\t\t\t}\r\n");
      out.write("\t\t\tExt.MessageBox.confirm('危险操作提示', '删除当前选中的对象，该操作不可恢复，您确定吗？', function(btn){\r\n");
      out.write("\t\t\t\tif(btn == 'yes'){\r\n");
      out.write("\t\t\t\t\tvar delKeys = [];\r\n");
      out.write("\t                for(var i = 0, r; r = s[i]; i++){\r\n");
      out.write("\t                    delKeys.push(r.get('key'));\r\n");
      out.write("\t                }\r\n");
      out.write("\t\t\t\t\tDesignToolDirect.deleteObjects(delKeys, function(result, e){\r\n");
      out.write("\t\t\t\t\t\tif(result.success){\r\n");
      out.write("\t\t\t\t\t\t\tpanel.refresh();\r\n");
      out.write("\t\t\t\t\t\t}\r\n");
      out.write("\t\t\t\t\t});\r\n");
      out.write("\t\t\t\t}\r\n");
      out.write("\t\t\t});\r\n");
      out.write("\t\t}\r\n");
      out.write("\t});\r\n");
      out.write("    var MoveUpAction = new Ext.Action({\r\n");
      out.write("\t\ttext : '上移',\r\n");
      out.write("\t\ticonCls : 'icon-designtool-up',\r\n");
      out.write("\t\tdisabled : !module.orderable,\r\n");
      out.write("\t\thandler : function(){\r\n");
      out.write("\t\t\tif(roweditor.editing){\r\n");
      out.write("\t\t\t\treturn;\r\n");
      out.write("\t\t\t}\r\n");
      out.write("\t\t\tvar record = grid.getSelectionModel().getSelected();\r\n");
      out.write("\t\t\tif(!record){\r\n");
      out.write("\t\t\t\treturn;\r\n");
      out.write("\t\t\t}\r\n");
      out.write("\t\t\tvar index = grid.getStore().indexOf(record);\r\n");
      out.write("\t\t\tif(index == 0){\r\n");
      out.write("\t\t\t\treturn;\r\n");
      out.write("\t\t\t}\r\n");
      out.write("\t\t\tvar recordPre = store.getAt(index - 1);\r\n");
      out.write("\t\t\trecord.set('f_order', index);\r\n");
      out.write("\t\t\trecordPre.set('f_order', index + 1);\r\n");
      out.write("\t\t\tgrid.getStore().sort('f_order', 'ASC');\r\n");
      out.write("\t\t}\r\n");
      out.write("\t});\r\n");
      out.write("    var MoveDownAction = new Ext.Action({\r\n");
      out.write("\t\ttext:'下移',\r\n");
      out.write("\t\ticonCls:'icon-designtool-down',\r\n");
      out.write("\t\tdisabled : !module.orderable,\r\n");
      out.write("\t\thandler : function(){\r\n");
      out.write("\t\t\tif(roweditor.editing){\r\n");
      out.write("\t\t\t\treturn;\r\n");
      out.write("\t\t\t}\r\n");
      out.write("\t\t\tvar record = grid.getSelectionModel().getSelected();\r\n");
      out.write("\t\t\tif(!record){\r\n");
      out.write("\t\t\t\treturn;\r\n");
      out.write("\t\t\t}\r\n");
      out.write("\t\t\tvar index = grid.getStore().indexOf(record);\r\n");
      out.write("\t\t\tif(index == grid.getStore().getCount() - 1){\r\n");
      out.write("\t\t\t\treturn;\r\n");
      out.write("\t\t\t}\r\n");
      out.write("\t\t\tvar recordNext = store.getAt(index + 1);\r\n");
      out.write("\t\t\trecord.set('f_order', index + 2);\r\n");
      out.write("\t\t\trecordNext.set('f_order', index + 1);\r\n");
      out.write("\t\t\tgrid.getStore().sort('f_order', 'ASC');\r\n");
      out.write("\t\t}\r\n");
      out.write("\t});\r\n");
      out.write("\t\r\n");
      out.write("    var tools = [AddAction, CopyAction, PasteAction, '-', RenameAction, DelAction, '-', MoveUpAction, MoveDownAction,'-'];\r\n");
      out.write("\r\n");
      out.write("\tif(module.extendsMenu){\r\n");
      out.write("\t\ttools.push('->');\r\n");
      out.write("\t\tfor(var i=0;i<module.extendsMenu.length;i++){\r\n");
      out.write("\t\t\tvar btn = module.extendsMenu[i];\r\n");
      out.write("\t\t\tExt.apply(btn, {scope: panel});\r\n");
      out.write("\t\t\ttools.push(btn);\r\n");
      out.write("\t\t}\r\n");
      out.write("\t}\r\n");
      out.write("\t\r\n");
      out.write("\t// 行编辑插件\r\n");
      out.write("\tvar roweditor = new Ext.ux.grid.RowEditor({\r\n");
      out.write("        saveText: '确定',\r\n");
      out.write("        cancelText: '取消'\r\n");
      out.write("    });\r\n");
      out.write("    \r\n");
      out.write("    // 预处理\r\n");
      out.write("    roweditor.on('beforefieldsetvalue', function(field, val, record, g, row, col){\r\n");
      out.write("\t\tswitch(field.getXType()){\r\n");
      out.write("\t\tcase 'mixkyjsonobjectfield' :\r\n");
      out.write("\t\t\tfield.setValue(Ext.encode(val));\r\n");
      out.write("\t\t\tfield.realValue = val;\r\n");
      out.write("\t\t\treturn false;\r\n");
      out.write("\t\tdefault:\r\n");
      out.write("\t\t\treturn true;\r\n");
      out.write("\t\t}\r\n");
      out.write("    });\r\n");
      out.write("    // 处理编辑结果\r\n");
      out.write("    roweditor.on('validateedit', function(rd, changes){\r\n");
      out.write("        var store = rd.grid.getStore();\r\n");
      out.write("        var cm = rd.grid.colModel;\r\n");
      out.write("        for(var k in changes){\r\n");
      out.write("\t\t\tvar field = store.fields.get(k);\r\n");
      out.write("\t\t\tvar ed = cm.getColumnById(k).getEditor().field;\r\n");
      out.write("\t\t\tif(field.isDisplayColumn){\r\n");
      out.write("\t\t\t\tchanges[field.valueField] = ed.realValue;\r\n");
      out.write("\t\t\t}\r\n");
      out.write("        }\r\n");
      out.write("        return true;\r\n");
      out.write("    });\r\n");
      out.write("\t// 表格对象\r\n");
      out.write("\tvar grid = new Ext.grid.GridPanel({\r\n");
      out.write("\t\tborder : false,\r\n");
      out.write("\t\tcolumns : columns,\r\n");
      out.write("\t\tautoExpandColumn:'f_note',\r\n");
      out.write("\t\tenableHdMenu:false,\r\n");
      out.write("\t\tenableColumnMove:false,\r\n");
      out.write("\t\tplugins: [roweditor],\r\n");
      out.write("\t\tgetParentKey : function(){\r\n");
      out.write("\t\treturn key;\r\n");
      out.write("\t\t},\r\n");
      out.write("\t\tgetType : function(){\r\n");
      out.write("\t\t\treturn type;\r\n");
      out.write("\t\t},\r\n");
      out.write("\t\tviewConfig:{\r\n");
      out.write("\t\t\tgetRowClass: function(record, index) {\r\n");
      out.write("\t\t\t\tif(record.dirty){\r\n");
      out.write("\t\t\t\t\treturn 'mixky-grid-row-changed';\r\n");
      out.write("\t\t\t\t}\r\n");
      out.write("\t\t    }\r\n");
      out.write("\t\t},\r\n");
      out.write("\t\tstore : store,\r\n");
      out.write("\t\ttbar : tools,\r\n");
      out.write("\t\tcontextMenu : new Ext.menu.Menu({items:tools}),\r\n");
      out.write("\t\tlisteners : {\r\n");
      out.write("\t\t\t'rowcontextmenu' : function(g, rowIndex, e){\r\n");
      out.write("\t\t\t\tif(roweditor.editing){\r\n");
      out.write("\t\t\t\t\treturn;\r\n");
      out.write("\t\t\t\t}\r\n");
      out.write("\t\t\t\tg.getSelectionModel().selectRow(rowIndex);\r\n");
      out.write("\t\t\t\tg.contextMenu.showAt(e.getXY());\r\n");
      out.write("\t\t\t}\r\n");
      out.write("\t\t}\r\n");
      out.write("\t});\r\n");
      out.write("\r\n");
      out.write("\tgrid.getSelectionModel().on(\"beforerowselect\", function(sm, index, rocode){\r\n");
      out.write("\t\treturn !roweditor.editing;\r\n");
      out.write("\t});\r\n");
      out.write("\t\r\n");
      out.write("\t// 刷新\r\n");
      out.write("\tpanel.refresh = function(){\r\n");
      out.write("\t\tgrid.getStore().reload();\r\n");
      out.write("\t}\r\n");
      out.write("\t// 保存属性修改\r\n");
      out.write("\tpanel.save = function(needSaveNext){\r\n");
      out.write("\t\tvar store = grid.getStore();\r\n");
      out.write("\t\tvar modifieds = store.getModifiedRecords();\r\n");
      out.write("\t\tif(modifieds.length > 0){\r\n");
      out.write("\t\t\tDesignToolDirect.saveObject(modifieds[0].get('key'), modifieds[0].getChanges(), function(result, e){\r\n");
      out.write("\t\t\t\tif(result.success){\r\n");
      out.write("\t\t\t\t\tvar record = modifieds[0];\r\n");
      out.write("\t\t\t\t\trecord.set(result.object);\r\n");
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
