/*
 * Generated by the Jasper component of Apache Tomcat
 * Version: Apache Tomcat/7.0.34
 * Generated at: 2013-01-28 09:39:42 UTC
 * Note: The last modified time of this file was set to
 *       the last modified time of the source file after
 *       generation to assist with modification tracking.
 */
package org.apache.jsp.WEB_002dINF.jsp.designtool.workflow;

import javax.servlet.*;
import javax.servlet.http.*;
import javax.servlet.jsp.*;
import com.mixky.engine.module.Module;
import com.mixky.engine.common.DesignObjectLoader;
import com.mixky.engine.workflow.template.Flow;

public final class workflow_jsp extends org.apache.jasper.runtime.HttpJspBase
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

	String id = request.getParameter("id");
	String key = request.getParameter("key");
	String mclass = request.getParameter("mclass");
	
	Flow workflow = DesignObjectLoader.instance().loadDesignObject(key);

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
      out.write("\t\r\n");
      out.write("\tvar panel = Ext.getCmp(id);\r\n");
      out.write("\tif(panel.title){\r\n");
      out.write("\t\tpanel.setTitle('流程编辑 [");
      out.print(workflow.getF_caption());
      out.write("]');\r\n");
      out.write("\t}\r\n");
      out.write("\r\n");
      out.write("\t// Creates the graph and loads the default stylesheet\r\n");
      out.write("    var graph = new mxGraph();\r\n");
      out.write("    \r\n");
      out.write("    var btnDelete = new Ext.Action({\r\n");
      out.write("\t\ttext : '删除',\r\n");
      out.write("\t\ticonCls : 'icon-designtool-delete',\r\n");
      out.write("\t\thandler : function(){\r\n");
      out.write("\t\t\tif(!graph.isSelectionEmpty()){\r\n");
      out.write("\t\t\t\tvar cell = graph.getSelectionCell();\r\n");
      out.write("\t\t\t\tExt.MessageBox.confirm('操作提示', '删除当前选中的对象及关联对象，您确定吗？', function(btn){\r\n");
      out.write("\t\t\t\t\tif(btn == 'yes'){\r\n");
      out.write("\t\t\t\t\t\tpanel.removeCell(cell);\r\n");
      out.write("\t\t\t\t\t}\r\n");
      out.write("\t\t\t\t});\r\n");
      out.write("\t\t\t}\r\n");
      out.write("\t\t}\r\n");
      out.write("\t});\r\n");
      out.write("\r\n");
      out.write("    var btnSave = new Ext.Action({\r\n");
      out.write("\t\ttext : '保存位置',\r\n");
      out.write("\t\ticonCls : 'icon-designtool-save',\r\n");
      out.write("\t\thandler : function(){\r\n");
      out.write("    \t\tpanel.savePosition();\r\n");
      out.write("\t\t}\r\n");
      out.write("\t});\r\n");
      out.write("\r\n");
      out.write("    var btnRefreshAuto = new Ext.Action({\r\n");
      out.write("\t\ttext : '自动排列',\r\n");
      out.write("\t\ticonCls : 'icon-designtool-refresh',\r\n");
      out.write("\t\thandler : function(){\r\n");
      out.write("\t\t\tExt.MessageBox.confirm('操作提示', '该操作将自动计算并更新当前的节点位置，您确定吗？', function(btn){\r\n");
      out.write("\t\t\t\tif(btn == 'yes'){\r\n");
      out.write("\t\t\t\t\tpanel.refresh(true);\r\n");
      out.write("\t\t\t\t}\r\n");
      out.write("\t\t\t});\r\n");
      out.write("\t\t}\r\n");
      out.write("\t});\r\n");
      out.write("\r\n");
      out.write("    var btnRefresh = new Ext.Action({\r\n");
      out.write("\t\ttext : '刷新显示',\r\n");
      out.write("\t\ticonCls : 'icon-designtool-refresh',\r\n");
      out.write("\t\thandler : function(){\r\n");
      out.write("    \t\tpanel.refresh(false);\r\n");
      out.write("\t\t}\r\n");
      out.write("\t});\r\n");
      out.write("\t// 锁定流程\r\n");
      out.write("    var chkLockFlag = new Ext.form.Checkbox({\r\n");
      out.write("    \tchecked : ");
      out.print(workflow.getF_locked());
      out.write(",\r\n");
      out.write("    \thideLabel : true\r\n");
      out.write("    });\r\n");
      out.write("    chkLockFlag.on('check', function(f, checked){\r\n");
      out.write("    \tFlowDesignerDirect.setFlowLocked('");
      out.print(key);
      out.write("', checked, function(result, e){\r\n");
      out.write("        \tif(result && result.success){\r\n");
      out.write("            \tif(checked){\r\n");
      out.write("            \t    graph.setCellsLocked(true);\r\n");
      out.write("            \t    graph.setConnectable(false);\r\n");
      out.write("            \t}else{\r\n");
      out.write("            \t    graph.setCellsLocked(false);\r\n");
      out.write("            \t    graph.setConnectable(true);\r\n");
      out.write("            \t}\r\n");
      out.write("            }\r\n");
      out.write("        });\r\n");
      out.write("    });\r\n");
      out.write("\r\n");
      out.write("\tvar workflowPanel = new Ext.Panel({\r\n");
      out.write("\t\tregion : 'center',\r\n");
      out.write("\t\ttbar : [btnDelete, '-', btnSave, '-','锁定：', chkLockFlag, '->', btnRefreshAuto, '-', btnRefresh],\r\n");
      out.write("\t\tborder:false\r\n");
      out.write("\t});\r\n");
      out.write("\r\n");
      out.write("\tvar nodePanel = new Ext.Panel({\r\n");
      out.write("\t\tid : 'node-");
      out.print(key);
      out.write("',\r\n");
      out.write("\t\tdisabled : true,\r\n");
      out.write("\t\ttitle : '节点属性',\r\n");
      out.write("\t\tborder:false,\r\n");
      out.write("\t\tlayout:'fit',\r\n");
      out.write("\t\tdeferredRender:false,\r\n");
      out.write("\t\tautoLoad : {\r\n");
      out.write("\t\t\turl : 'ui/node.do',\r\n");
      out.write("\t\t\tscripts:true,\r\n");
      out.write("\t\t\tborder:false,\r\n");
      out.write("\t\t\tparams:{\r\n");
      out.write("\t\t\t\tid : 'node-");
      out.print(key);
      out.write("'\r\n");
      out.write("\t\t\t}\r\n");
      out.write("\t\t}\r\n");
      out.write("\t});\r\n");
      out.write("\r\n");
      out.write("\tvar routePanel = new Ext.Panel({\r\n");
      out.write("\t\tid : 'route-");
      out.print(key);
      out.write("',\r\n");
      out.write("\t\tdisabled : true,\r\n");
      out.write("\t\ttitle : '路由属性',\r\n");
      out.write("\t\tborder:false,\r\n");
      out.write("\t\tlayout:'fit',\r\n");
      out.write("\t\tdeferredRender:false,\r\n");
      out.write("\t\tautoLoad : {\r\n");
      out.write("\t\t\turl : 'ui/route.do',\r\n");
      out.write("\t\t\tscripts:true,\r\n");
      out.write("\t\t\tborder:false,\r\n");
      out.write("\t\t\tparams:{\r\n");
      out.write("\t\t\t\tid : 'route-");
      out.print(key);
      out.write("'\r\n");
      out.write("\t\t\t}\r\n");
      out.write("\t\t}\r\n");
      out.write("\t});\r\n");
      out.write("\r\n");
      out.write("\tvar relationPanel = new Ext.Panel({\r\n");
      out.write("\t\tid : 'relation-");
      out.print(key);
      out.write("',\r\n");
      out.write("\t\tdisabled : true,\r\n");
      out.write("\t\ttitle : '路由关系',\r\n");
      out.write("\t\tborder:false,\r\n");
      out.write("\t\tlayout:'fit',\r\n");
      out.write("\t\tdeferredRender:false,\r\n");
      out.write("\t\tautoLoad : {\r\n");
      out.write("\t\t\turl : 'ui/relation.do',\r\n");
      out.write("\t\t\tscripts:true,\r\n");
      out.write("\t\t\tborder:false,\r\n");
      out.write("\t\t\tparams:{\r\n");
      out.write("\t\t\t\tid : 'relation-");
      out.print(key);
      out.write("'\r\n");
      out.write("\t\t\t}\r\n");
      out.write("\t\t}\r\n");
      out.write("\t});\r\n");
      out.write("\t\r\n");
      out.write("\tvar attributePanel = new Ext.TabPanel({\r\n");
      out.write("\t\tregion : 'west',\r\n");
      out.write("\t\twidth : 250,\r\n");
      out.write("\t\tminWidth : 200,\r\n");
      out.write("\t\tmaxWidth : 450,\r\n");
      out.write("\t\tborder:false,\r\n");
      out.write("\t\tsplit : true,\r\n");
      out.write("\t\tcollapsible : false,\r\n");
      out.write("        collapseMode:'mini',\r\n");
      out.write("\t\ttabPosition : 'bottom',\r\n");
      out.write("\t    activeTab: 0,\r\n");
      out.write("\t    items: [nodePanel, routePanel, relationPanel]\r\n");
      out.write("\t});\r\n");
      out.write("\r\n");
      out.write("\tvar ui = {\r\n");
      out.write("\t\tlayout : 'border',\r\n");
      out.write("\t\tborder : false,\r\n");
      out.write("\t\titems : [workflowPanel, attributePanel]\r\n");
      out.write("\t};\r\n");
      out.write("\t\r\n");
      out.write("\tpanel.add(ui);\r\n");
      out.write("\tpanel.doLayout();\r\n");
      out.write("\r\n");
      out.write("\t// 计算节点的位置信息（锁定每个节点占180 × 100的宽高，PADDING为20）\r\n");
      out.write("\tpanel.getCellPoint = function(x, y){\r\n");
      out.write("\t\tvar nx = Math.floor(x / 180) * 180 + 90 + 20;\r\n");
      out.write("\t\tvar ny = Math.floor(y / 100) * 100 + 50 + 20;\r\n");
      out.write("\t\treturn {x: nx, y:ny};\r\n");
      out.write("\t}\r\n");
      out.write("\t// 计算路由样式及位置\r\n");
      out.write("\tpanel.resetEdgePoint = function(edge){\r\n");
      out.write("\t\tif(edge.source != null && edge.target != null){\r\n");
      out.write("\t\t\tvar geo = edge.getGeometry();\r\n");
      out.write("\t\t\tvar sgeo = edge.source.getGeometry();\r\n");
      out.write("\t\t\tvar tgeo = edge.target.getGeometry();\r\n");
      out.write("\t\t\tvar sx = sgeo.x + sgeo.width / 2;\r\n");
      out.write("\t\t\tvar sy = sgeo.y + sgeo.height / 2;\r\n");
      out.write("\t\t\tvar tx = tgeo.x + tgeo.width / 2;\r\n");
      out.write("\t\t\tvar ty = tgeo.y + tgeo.height / 2;\r\n");
      out.write("\t\t\t//var style = edge.style;\r\n");
      out.write("\t\t\t//if(!style){\r\n");
      out.write("\t\t\t//\tstyle = {};\r\n");
      out.write("\t\t\t//}\r\n");
      out.write("\t\t\tgraph.setCellStyles(mxConstants.STYLE_ELBOW, mxConstants.ELBOW_HORIZONTAL, [edge]);\r\n");
      out.write("\t\t\t//style[mxConstants.STYLE_ELBOW] = mxConstants.ELBOW_HORIZONTAL;\r\n");
      out.write("\t\t\tvar pointx = 0;\r\n");
      out.write("\t\t\tvar pointy = 0;\r\n");
      out.write("\t\t\tif(sy == ty){\r\n");
      out.write("\t\t\t\t// 水平\r\n");
      out.write("\t\t\t\tif(sx < tx){\r\n");
      out.write("\t\t\t\t\t// 从左往右\r\n");
      out.write("\t\t\t\t\tpointx = sx + sgeo.width / 2 - 30;\r\n");
      out.write("\t\t\t\t\tpointy = sy - sgeo.height / 2 - 20;\r\n");
      out.write("\t\t\t\t}else{\r\n");
      out.write("\t\t\t\t\t// 从右往左\r\n");
      out.write("\t\t\t\t\tpointx = tx + 30;\r\n");
      out.write("\t\t\t\t\tpointy = sy + sgeo.height / 2 + 20;\r\n");
      out.write("\t\t\t\t}\r\n");
      out.write("\t\t\t\tgeo.points = [new mxPoint(pointx, pointy)];\r\n");
      out.write("\t\t\t}else if(sy > ty){\r\n");
      out.write("\t\t\t\t// 上方\r\n");
      out.write("\t\t\t\tpointy = ty + tgeo.height / 2 + 20;\r\n");
      out.write("\t\t\t\tif(sx <= tx){\r\n");
      out.write("\t\t\t\t\t// 从左往右\r\n");
      out.write("\t\t\t\t\tpointx = sx + sgeo.width / 2 + 30;\r\n");
      out.write("\t\t\t\t}else{\r\n");
      out.write("\t\t\t\t\t// 从右往左\r\n");
      out.write("\t\t\t\t\tpointx = sx - 30;\r\n");
      out.write("\t\t\t\t}\r\n");
      out.write("\t\t\t\tgeo.points = [new mxPoint(pointx, pointy)];\r\n");
      out.write("\t\t\t}else{\r\n");
      out.write("\t\t\t\t// 下方\r\n");
      out.write("\t\t\t\tpointx = sx;\r\n");
      out.write("\t\t\t\tpointy = ty - tgeo.height / 2 - 20;\r\n");
      out.write("\t\t\t\tvar point1x = tx;\r\n");
      out.write("\t\t\t\tvar point1y = pointy;\r\n");
      out.write("\t\t\t\t//graph.setCellStyles(mxConstants.STYLE_ELBOW, mxConstants.ELBOW_VERTICAL, [edge]);\r\n");
      out.write("\t\t\t\t//style[mxConstants.STYLE_ELBOW] = mxConstants.ELBOW_VERTICAL;\r\n");
      out.write("\t\t\t\tgeo.points = [new mxPoint(pointx, pointy), new mxPoint(point1x, point1y)];\r\n");
      out.write("\t\t\t}\r\n");
      out.write("\t\t\tedge.setGeometry(geo);\r\n");
      out.write("\t\t\t//edge.setStyle(style);\r\n");
      out.write("\t\t}\r\n");
      out.write("\t}\r\n");
      out.write("\r\n");
      out.write("\tpanel.savePosition = function(){\r\n");
      out.write("\t    var parent = graph.getDefaultParent();\r\n");
      out.write("\t\tvar cells = graph.getModel().getChildCells(parent);\r\n");
      out.write("\t\tvar cellsPos = {};\r\n");
      out.write("\t\tfor(var i=0;i<cells.length;i++){\r\n");
      out.write("\t\t\tvar cell = cells[i];\r\n");
      out.write("\t\t\tif(!cell.isEdge()){\r\n");
      out.write("\t\t\t\tvar geo = cell.getGeometry();\r\n");
      out.write("\t\t\t\tvar x = Math.floor((geo.x - 20) / 180);\r\n");
      out.write("\t\t\t\tvar y = Math.floor((geo.y - 20) / 100);\r\n");
      out.write("\t\t\t\tcellsPos[cell.id] = x + \":\" + y;\r\n");
      out.write("\t\t\t}\r\n");
      out.write("\t\t}\r\n");
      out.write("\t\tFlowDesignerDirect.saveFlowPosition('");
      out.print(key);
      out.write("', cellsPos, function(result, e){\r\n");
      out.write("\t\t\tif(result && result.success){\r\n");
      out.write("\t\t\t\tExt.MessageBox.alert('操作提示！', '流程图型位置保存完毕！');\r\n");
      out.write("\t\t\t}\r\n");
      out.write("\t\t});\r\n");
      out.write("\t}\r\n");
      out.write("\t// 插入路由及节点\r\n");
      out.write("\tpanel.insertRoute = function(cell){\r\n");
      out.write("\t\tvar x = Math.floor((cell.target.getGeometry().x - 20) / 180);\r\n");
      out.write("\t\tvar y = Math.floor((cell.target.getGeometry().y - 20) / 100);\r\n");
      out.write("\t\tif(cell.target.isNew){\r\n");
      out.write("\t\t\tFlowDesignerDirect.insertNode('");
      out.print(key);
      out.write("', cell.source.id, x, y, function(result, e){\r\n");
      out.write("\t\t\t\tif(result && result.success){\r\n");
      out.write("\t\t\t\t\tcell.isNew = undefined;\r\n");
      out.write("\t\t\t\t\tcell.setId(result.routekey);\r\n");
      out.write("\t\t\t\t\tcell.target.isNew = undefined;\r\n");
      out.write("\t\t\t\t\tcell.target.setId(result.nodekey);\r\n");
      out.write("\t\t\t\t}else{\r\n");
      out.write("\t\t\t\t\tgraph.removeCells([cell.target]);\r\n");
      out.write("\t\t\t\t}\r\n");
      out.write("\t\t\t});\r\n");
      out.write("\t\t}else{\r\n");
      out.write("\t\t\tFlowDesignerDirect.insertRoute('");
      out.print(key);
      out.write("', cell.source.id, cell.target.id, function(result, e){\r\n");
      out.write("\t\t\t\tif(result && result.success){\r\n");
      out.write("\t\t\t\t\tcell.isNew = undefined;\r\n");
      out.write("\t\t\t\t\tcell.setId(result.routekey);\r\n");
      out.write("\t\t\t\t}else{\r\n");
      out.write("\t\t\t\t\tgraph.removeCells([cell]);\r\n");
      out.write("\t\t\t\t}\r\n");
      out.write("\t\t\t});\r\n");
      out.write("\t\t}\r\n");
      out.write("\t}\r\n");
      out.write("\t// 删除对象\r\n");
      out.write("\tpanel.removeCell = function(cell){\r\n");
      out.write("\t\tFlowDesignerDirect.removeCell('");
      out.print(key);
      out.write("', cell.id, function(result, e){\r\n");
      out.write("\t\t\tif(result && result.success){\r\n");
      out.write("\t\t\t\tgraph.removeCells([cell], true);\r\n");
      out.write("\t\t\t}\r\n");
      out.write("\t\t});\r\n");
      out.write("\t}\r\n");
      out.write("\t// 改变文本\r\n");
      out.write("\tpanel.changeLabel = function(cell){\r\n");
      out.write("\t\tFlowDesignerDirect.updateCaption(cell.id, cell.value, function(result, e){\r\n");
      out.write("\t\t\tif(!result || !result.success){\r\n");
      out.write("\t\t\t\tif(result.caption){\r\n");
      out.write("\t\t\t\t\tcell.setValue(result.caption);\r\n");
      out.write("\t\t\t\t}\r\n");
      out.write("\t\t\t}\r\n");
      out.write("\t\t});\r\n");
      out.write("\t}\r\n");
      out.write("\t// 改变目标节点\r\n");
      out.write("\tpanel.updateRouteTarget = function(edge){\r\n");
      out.write("\t\tif(edge.target == null){\r\n");
      out.write("\t\t\treturn;\r\n");
      out.write("\t\t}\r\n");
      out.write("\t\tFlowDesignerDirect.updateRouteTarget('");
      out.print(key);
      out.write("', edge.id, edge.target.id, function(result, e){\r\n");
      out.write("\t\t\tif(result || result.success){\r\n");
      out.write("\t\t\t\tif(result.key){\r\n");
      out.write("\t\t\t\t\tedge.setId(result.key);\r\n");
      out.write("\t\t\t\t}\r\n");
      out.write("\t\t\t}\r\n");
      out.write("\t\t});\r\n");
      out.write("\t}\r\n");
      out.write("\t// 选中对象\r\n");
      out.write("\tpanel.activateCell = function(cell){\r\n");
      out.write("\t\tnodePanel.setDisabled(true);\r\n");
      out.write("\t\troutePanel.setDisabled(true);\r\n");
      out.write("\t\trelationPanel.setDisabled(true);\r\n");
      out.write("\t\tif(cell != null && !cell.isNew){\r\n");
      out.write("\t\t\tif(cell.isEdge()){\r\n");
      out.write("\t\t\t\troutePanel.setDisabled(false);\r\n");
      out.write("\t\t\t\trelationPanel.setDisabled(false);\r\n");
      out.write("\t\t\t\tattributePanel.activate(routePanel);\r\n");
      out.write("\t\t\t\tif(Ext.isDefined(routePanel.loadPropertiesData)){\r\n");
      out.write("\t\t\t\t\troutePanel.loadPropertiesData(cell.id);\r\n");
      out.write("\t\t\t\t}else{\r\n");
      out.write("\t\t\t\t\troutePanel.key = cell.id;\r\n");
      out.write("\t\t\t\t}\r\n");
      out.write("\t\t\t\tif(Ext.isDefined(relationPanel.refresh)){\r\n");
      out.write("\t\t\t\t\trelationPanel.refresh(cell.id);\r\n");
      out.write("\t\t\t\t}else{\r\n");
      out.write("\t\t\t\t\trelationPanel.key = cell.id;\r\n");
      out.write("\t\t\t\t}\r\n");
      out.write("\t\t\t}else{\r\n");
      out.write("\t\t\t\tnodePanel.setDisabled(false);\r\n");
      out.write("\t\t\t\tattributePanel.activate(nodePanel);\r\n");
      out.write("\t\t\t\tif(Ext.isDefined(nodePanel.loadPropertiesData)){\r\n");
      out.write("\t\t\t\t\tnodePanel.loadPropertiesData(cell.id);\r\n");
      out.write("\t\t\t\t}else{\r\n");
      out.write("\t\t\t\t\tnodePanel.key = cell.id;\r\n");
      out.write("\t\t\t\t}\r\n");
      out.write("\t\t\t}\r\n");
      out.write("\t\t}\r\n");
      out.write("\t}\r\n");
      out.write("\t// 刷新\r\n");
      out.write("\tpanel.refresh = function(layout){\r\n");
      out.write("\t\tif(!layout){\r\n");
      out.write("\t\t\tlayout = false;\r\n");
      out.write("\t\t}\r\n");
      out.write("\t\tgraph.getModel().clear();\r\n");
      out.write("\t\tFlowDesignerDirect.getFlowCells('");
      out.print(key);
      out.write("', layout, function(result, e){\r\n");
      out.write("\t\t\tif(result && result.success){\r\n");
      out.write("\t\t\t\tpanel.isGraphLoading = true;\r\n");
      out.write("\t\t\t\tgraph.getModel().beginUpdate();\r\n");
      out.write("\t\t\t\ttry\r\n");
      out.write("\t\t\t\t{\r\n");
      out.write("\t\t\t\t    var parent = graph.getDefaultParent();\r\n");
      out.write("\t\t\t\t\tfor(var i=0;i<result.nodes.length;i++){\r\n");
      out.write("\t\t\t\t\t\tvar node = result.nodes[i];\r\n");
      out.write("\t\r\n");
      out.write("\t\t\t\t\t    var w = 50;\r\n");
      out.write("\t\t\t\t\t    var h = 50;\r\n");
      out.write("\t\t\t\t\t    if(node.type == 'node'){\r\n");
      out.write("\t\t\t\t\t\t    w = 120;\r\n");
      out.write("\t\t\t\t\t\t    h = 35;\r\n");
      out.write("\t\t\t\t\t\t}\r\n");
      out.write("\t\t\t\t\t    var x =  node.x * 180 + 90 + 20 - w/2;\r\n");
      out.write("\t\t\t\t\t    var y =  node.y * 100 + 50 + 20 - h/2;\r\n");
      out.write("\t\t\t\t\t    \r\n");
      out.write("\t\t\t\t\t\tgraph.insertVertex(parent, node.id, node.caption, x, y, w, h, node.type);\r\n");
      out.write("\t\t\t\t\t}\r\n");
      out.write("\t\t\t\t\tfor(var i=0;i<result.routes.length;i++){\r\n");
      out.write("\t\t\t\t\t\tvar route = result.routes[i];\r\n");
      out.write("\t\t\t\t\t\tvar source = graph.getModel().getCell(route.from);\r\n");
      out.write("\t\t\t\t\t\tvar target = graph.getModel().getCell(route.to);\r\n");
      out.write("\t\t\t\t\t\tgraph.insertEdge(parent, route.id, route.caption, source, target, 'route');\r\n");
      out.write("\t\t\t\t\t}\r\n");
      out.write("\t\t\t\t}\r\n");
      out.write("\t\t\t\tfinally\r\n");
      out.write("\t\t\t\t{\r\n");
      out.write("\t\t\t\t\t// Updates the display\r\n");
      out.write("\t\t\t\t\tgraph.getModel().endUpdate();\r\n");
      out.write("\t\t\t\t\tpanel.isGraphLoading = false;\r\n");
      out.write("\t\t\t\t}\r\n");
      out.write("\t\t\t}\r\n");
      out.write("\t\t});\r\n");
      out.write("\t}\r\n");
      out.write("\tpanel.save = function(needSaveNext){\r\n");
      out.write("\t\tif(!nodePanel.disabled){\r\n");
      out.write("\t\t\tnodePanel.save();\r\n");
      out.write("\t\t}\r\n");
      out.write("\t\tif(!routePanel.disabled){\r\n");
      out.write("\t\t\troutePanel.save();\r\n");
      out.write("\t\t\tif(Ext.isDefined(relationPanel.save)){\r\n");
      out.write("\t\t\t\trelationPanel.save();\r\n");
      out.write("\t\t\t}\r\n");
      out.write("\t\t}\r\n");
      out.write("\t\tMixky.designtool.Framework.contentPanel.savePanelOver(panel, needSaveNext);\r\n");
      out.write("\t}\r\n");
      out.write("\t// 初始化\r\n");
      out.write("\tpanel.on('activate', function(){\r\n");
      out.write("\t\tif(panel.isGraphInit){\r\n");
      out.write("\t\t\treturn;\r\n");
      out.write("\t\t}\r\n");
      out.write("\t\tpanel.isGraphInit = true;\r\n");
      out.write("\t\t\r\n");
      out.write("\t\t// Makes the connection are smaller\r\n");
      out.write("\t\tmxConstants.DEFAULT_HOTSPOT = 0.3;\r\n");
      out.write("\t    // Loads the default stylesheet into the graph\r\n");
      out.write("\t    var style = mxUtils.load('../dependences/mxgraph/mixky.flowstyle.xml').getDocumentElement();\r\n");
      out.write("\t\tvar dec = new mxCodec(style.ownerDocument);\r\n");
      out.write("\t\tdec.decode(style, graph.getStylesheet());\r\n");
      out.write("\t\t//Mixky.lib.initFlowStylesheet(graph.getStylesheet());\r\n");
      out.write("\t\t\r\n");
      out.write("\t\t// Initializes the graph as the DOM for the panel has now been created\t\r\n");
      out.write("\t\tworkflowPanel.body.dom.style.overflow = 'auto';\r\n");
      out.write("\t    graph.init(workflowPanel.body.dom);\r\n");
      out.write("\t    graph.setConnectable(true);\r\n");
      out.write("\t\tgraph.setDropEnabled(true);\r\n");
      out.write("\t    graph.setPanning(true);\r\n");
      out.write("\t    graph.setTooltips(true);\r\n");

	if(workflow.getF_locked()){

      out.write("\r\n");
      out.write("\t\tgraph.setCellsLocked(true);\r\n");
      out.write("\t\tgraph.setConnectable(false);\r\n");

	}

      out.write("\r\n");
      out.write("\t    // 不允许编辑对象大小\r\n");
      out.write("\t    graph.setCellsResizable(false);\r\n");
      out.write("\t    // 设置当目标为空时默认创建对象\r\n");
      out.write("\t    graph.connectionHandler.setCreateTarget(true);\r\n");
      out.write("\t    //graph.setAllowDanglingEdges(false);\r\n");
      out.write("\t    // 设置移动对象是不取消关联\r\n");
      out.write("\t    graph.setDisconnectOnMove(false);\r\n");
      out.write("\t    // 设置路由名称位置不可编辑\r\n");
      out.write("\t    graph.edgeLabelsMovable = false;\r\n");
      out.write("\t    // 设置图标样式\r\n");
      out.write("\t    graph.container.style.cursor = 'default';\r\n");
      out.write("\t    // 设置单选模式\r\n");
      out.write("\t    graph.getSelectionModel().setSingleSelection(true);\r\n");
      out.write("\t    // 创建路由\r\n");
      out.write("\t    graph.connectionHandler.factoryMethod = function(value, source, target)\r\n");
      out.write("\t    {\r\n");
      out.write("\t    \tvar cell = new mxCell('新建路由', new mxGeometry(0, 0, 0, 0), 'routeDown');\r\n");
      out.write("\t    \tcell.isNew = true;\r\n");
      out.write("\t\t\tcell.edge = true;\r\n");
      out.write("\t\t\treturn cell; \r\n");
      out.write("\t    };\r\n");
      out.write("\t    // 创建节点（当路由指向为空时）\r\n");
      out.write("\t    graph.connectionHandler.createTargetVertex = function(evt, source){\r\n");
      out.write("\t    \tvar point = graph.getPointForEvent(evt);\r\n");
      out.write("\t    \tvar np = panel.getCellPoint(point.x, point.y);\r\n");
      out.write("\t\t\tvar cell = new mxCell('新建节点', new mxGeometry(np.x - 120/2, np.y - 35/2, 120, 35), 'node');\r\n");
      out.write("\t\t\tcell.isNew = true;\r\n");
      out.write("\t\t\tcell.vertex = true;\r\n");
      out.write("\t    \treturn cell;\r\n");
      out.write("\t\t}\r\n");
      out.write("\t\t// 判断是否可以作为路由目标对象\r\n");
      out.write("\t    graph.getEdgeValidationError = function(edge, source, target)\r\n");
      out.write("\t    {\r\n");
      out.write("\t\t\tif (target != null)\r\n");
      out.write("\t\t\t{\r\n");
      out.write("\t\t\t\tif(source == target){\r\n");
      out.write("\t\t \t\t\treturn '不能创建自循环连接';\r\n");
      out.write("\t\t\t\t}\r\n");
      out.write("\t\t\t\tif(target.isEdge()){\r\n");
      out.write("\t\t \t\t\treturn '不能连接到路由';\r\n");
      out.write("\t\t\t\t}else if(target.id == 'nodeStart'){\r\n");
      out.write("\t\t \t\t\treturn '不能连接到开始节点';\r\n");
      out.write("\t\t\t\t}\r\n");
      out.write("\t\t\t\tif(edge != null && edge.source != source){\r\n");
      out.write("\t\t \t\t\treturn '不能改变起始节点';\r\n");
      out.write("\t\t\t\t}\r\n");
      out.write("\t\t\t}\r\n");
      out.write("\t\t\treturn mxGraph.prototype.getEdgeValidationError.apply(this, arguments);\r\n");
      out.write("\t    }\r\n");
      out.write("\t\t// 节点移动\r\n");
      out.write("\t    var moveListener = function(sender, evt)\r\n");
      out.write("\t    {\r\n");
      out.write("\t\t\tvar cells = evt.getProperty('cells');\r\n");
      out.write("\t\t\tvar event = evt.getProperty('event');\r\n");
      out.write("\t\t\tvar cell = cells[0];\r\n");
      out.write("\t\t\tif(!cell.isEdge()){\r\n");
      out.write("\t\t    \tvar point = graph.getPointForEvent(event);\r\n");
      out.write("\t\t\t\tvar np = panel.getCellPoint(point.x, point.y);\r\n");
      out.write("\t\t\t\tvar geo = cell.getGeometry();\r\n");
      out.write("\t\t\t\tcell.setGeometry(new mxGeometry(np.x - geo.width/2, np.y - geo.height/2, geo.width, geo.height));\r\n");
      out.write("\t\t\t\tfor(var i=0;i<cell.getEdgeCount();i++){\r\n");
      out.write("\t\t\t\t\tpanel.resetEdgePoint(cell.getEdgeAt(i));\r\n");
      out.write("\t\t\t\t}\r\n");
      out.write("\t\t\t}\r\n");
      out.write("\t    };\r\n");
      out.write("\t    graph.addListener(mxEvent.MOVE_CELLS, moveListener);\r\n");
      out.write("\t    // 连接到节点事件\r\n");
      out.write("\t    var connectedListener = function(sender, evt)\r\n");
      out.write("\t    {\r\n");
      out.write("\t\t\tvar edge = evt.getProperty('edge');\r\n");
      out.write("\t\t\tpanel.resetEdgePoint(edge);\r\n");
      out.write("\t\t\tif(!panel.isGraphLoading && !edge.isNew){\r\n");
      out.write("\t\t\t\tpanel.updateRouteTarget(edge);\r\n");
      out.write("\t\t\t}\r\n");
      out.write("\t    };\r\n");
      out.write("\t    graph.addListener(mxEvent.CELL_CONNECTED, connectedListener);\r\n");
      out.write("\t    // 添加路由\r\n");
      out.write("\t    var cellAddedListener = function(sender, evt)\r\n");
      out.write("\t    {\r\n");
      out.write("\t\t\tvar cells = evt.getProperty('cells');\r\n");
      out.write("\t\t\tvar cell = cells[0];\r\n");
      out.write("\t\t\tif(cell.isNew && cell.isEdge()){\r\n");
      out.write("\t\t\t\tpanel.insertRoute(cell);\r\n");
      out.write("\t\t\t}\r\n");
      out.write("\t    };\r\n");
      out.write("\t    graph.addListener(mxEvent.CELLS_ADDED, cellAddedListener);\r\n");
      out.write("\t    // 文本名称被改变\r\n");
      out.write("\t    var labelChangedListener = function(sender, evt)\r\n");
      out.write("\t    {\r\n");
      out.write("\t\t    if(evt){\r\n");
      out.write("\t\t\t\tvar cell = evt.getProperty('cell');\r\n");
      out.write("\t\t\t\tpanel.changeLabel(cell);\r\n");
      out.write("\t\t\t}\r\n");
      out.write("\t\t}\r\n");
      out.write("\t    graph.addListener(mxEvent.LABEL_CHANGED, labelChangedListener);\r\n");
      out.write("\t    // 选择对象\r\n");
      out.write("\t    var selectionListener = function()\r\n");
      out.write("\t    {\r\n");
      out.write("\t\t\tvar cell = graph.getSelectionCell();\r\n");
      out.write("\t\t\tpanel.activateCell(cell);\r\n");
      out.write("\t    };\r\n");
      out.write("\t    graph.getSelectionModel().addListener(mxEvent.CHANGE, selectionListener);\r\n");
      out.write("\t\tpanel.refresh();\r\n");
      out.write("\t});\r\n");
      out.write("\r\n");
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
