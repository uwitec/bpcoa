/*
 * Generated by the Jasper component of Apache Tomcat
 * Version: Apache Tomcat/7.0.34
 * Generated at: 2013-01-24 06:03:35 UTC
 * Note: The last modified time of this file was set to
 *       the last modified time of the source file after
 *       generation to assist with modification tracking.
 */
package org.apache.jsp.WEB_002dINF.jsp.app.mkoa.task;

import javax.servlet.*;
import javax.servlet.http.*;
import javax.servlet.jsp.*;
import com.mixky.engine.view.View;
import com.mixky.engine.organization.User;
import com.mixky.engine.organization.OrganizationUIMenu;
import com.mixky.engine.authority.AuthorityManager;
import com.mixky.app.certification.MixkyUserCertification;

public final class task_manager_jsp extends org.apache.jasper.runtime.HttpJspBase
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

	User user = MixkyUserCertification.instance().getUserInfo(request);
	// 读取参数
	String panelid = request.getParameter("panelid");
	View view = (View)request.getAttribute("view");
	boolean isSysManager = AuthorityManager.instance().isUserHasModuleRole(user, "mkTask.mrManager");
	OrganizationUIMenu orgMenu = new OrganizationUIMenu();
	orgMenu.setFnScope("taskMenuPlugin");
	orgMenu.setFnSelected("fnUserSelected");

      out.write("\r\n");
      out.write("<script language='javascript'>\r\n");
      out.write("Ext.onReady(function(){\r\n");
      out.write("\t\r\n");
      out.write("\tvar panel = Ext.getCmp('");
      out.print(panelid);
      out.write("');\r\n");
      out.write("\t// 设置视图当前记录时间\r\n");
      out.write("\tpanel.currentDate = new Date();\r\n");
      out.write("\tvar sDate = panel.currentDate.getFirstDateOfMonth();\r\n");
      out.write("\tsDate = sDate.add(Date.DAY, -sDate.getDay()+1);\r\n");
      out.write("\tvar eDate = panel.currentDate.getLastDateOfMonth();\r\n");
      out.write("\teDate = eDate.add(Date.DAY, eDate.getDay()+1);\r\n");
      out.write("\t// 用户选择菜单\r\n");
      out.write("\tvar fnUserSelected = function(a, e){\r\n");
      out.write("\t\tswitch(taskMenuPlugin.userFieldId){\r\n");
      out.write("\t\tcase \"Manager\":\r\n");
      out.write("\t\t\ttaskMenuPlugin.rec.set(\"ManagerId\", a.recid);\r\n");
      out.write("\t\t\ttaskMenuPlugin.rec.set(\"Manager\", a.text);\r\n");
      out.write("\t\t\tbreak;\r\n");
      out.write("\t\tcase \"Responsible\":\r\n");
      out.write("\t\t\ttaskMenuPlugin.rec.set(\"ResponsibleId\", a.recid);\r\n");
      out.write("\t\t\ttaskMenuPlugin.rec.set(\"Responsible\", a.text);\r\n");
      out.write("\t\t\tbreak;\r\n");
      out.write("\t\t}\r\n");
      out.write("\t}\r\n");
      out.write("\tvar menuOrganization = ");
      out.print(orgMenu.getRootJson().toString());
      out.write("\r\n");
      out.write("\t// 根据任务记录校验身份 系统管理员\r\n");
      out.write("\tvar isTaskAdministrator = function(rec){\r\n");
      out.write("\t\treturn ");
      out.print(isSysManager);
      out.write(";\r\n");
      out.write("\t}\r\n");
      out.write("\t// 根据任务记录校验身份 任务管理者\r\n");
      out.write("\tvar isTaskManager = function(rec){\r\n");
      out.write("\t\treturn rec && rec.get(\"ManagerId\") == Mixky.app.UserInfo.id;\r\n");
      out.write("\t}\r\n");
      out.write("\t// 根据任务记录校验身份 任务负责人\r\n");
      out.write("\tvar isTaskResponsible = function(rec){\r\n");
      out.write("\t\treturn rec && rec.get(\"ResponsibleId\") == Mixky.app.UserInfo.id;\r\n");
      out.write("\t}\r\n");
      out.write("\t// 是否允许记录编辑\r\n");
      out.write("\tvar isTaskEditable = function(rec){\r\n");
      out.write("\t\treturn isTaskManager(rec) || isTaskResponsible(rec) || isTaskAdministrator(rec);\r\n");
      out.write("\t}\r\n");
      out.write("\t\r\n");
      out.write("\tvar store = new Ext.ux.maximgb.tg.AdjacencyListStore({\r\n");
      out.write("\t\tdefaultExpanded : true,\r\n");
      out.write("\t\tautoLoad : false,\r\n");
      out.write("\t\tbatch : true,\r\n");
      out.write("\t\tproxy : new Ext.data.DirectProxy({\r\n");
      out.write("\t\t\tdirectFn : TaskAppDirect.loadTasks,\r\n");
      out.write("\t\t\tparamsAsHash : true,\r\n");
      out.write("\t\t\tparamOrder : ['startDate','endDate','states'],\r\n");
      out.write("\t\t\tbaseParams : {\r\n");
      out.write("\t\t\t\tstartDate : '',\r\n");
      out.write("\t\t\t\tendDate : '',\r\n");
      out.write("\t\t\t\tstates : ''\r\n");
      out.write("\t\t\t},\r\n");
      out.write("\t\t\tapi : {\r\n");
      out.write("\t\t\t\tcreate : TaskAppDirect.createTask,\r\n");
      out.write("\t\t\t\tupdate : TaskAppDirect.updateTask,\r\n");
      out.write("\t\t\t\tdestroy : TaskAppDirect.destroyTask\r\n");
      out.write("\t\t\t}\r\n");
      out.write("        }),\r\n");
      out.write("        writer : new Ext.data.JsonWriter({\r\n");
      out.write("    \t\tencode : false,\r\n");
      out.write("    \t\twriteAllFields: false\r\n");
      out.write("    \t}),\r\n");
      out.write("\t    reader: new Ext.data.JsonReader({\r\n");
      out.write("\t\t    idProperty : 'Id', \r\n");
      out.write("\t\t    root: 'results',\r\n");
      out.write("\t\t\ttotalProperty: 'totals',\r\n");
      out.write("\t\t\tsuccessProperty:'success'\r\n");
      out.write("\t\t},[\r\n");
      out.write("\t\t\t// Mandatory fields\r\n");
      out.write("\t\t\t{name:'Id'},\r\n");
      out.write("\t\t\t{name:'Name', type:'string'},\r\n");
      out.write("\t\t\t{name:'StartDate', type : 'date', dateFormat:'Y-m-d h:i:s'},\r\n");
      out.write("\t\t\t{name:'EndDate', type : 'date', dateFormat:'Y-m-d h:i:s'},\r\n");
      out.write("\t\t\t{name:'PercentDone'},\r\n");
      out.write("\t\t\t{name:'ParentId', type: 'auto'},\r\n");
      out.write("\t\t\t{name:'IsLeaf', type: 'bool'},\r\n");
      out.write("\r\n");
      out.write("\t\t\t// Your task meta data goes here\r\n");
      out.write("\t\t\t{name:'Note'},\r\n");
      out.write("\t\t\t{name:'Result'},\r\n");
      out.write("\t\t\t{name:'Duration'},\r\n");
      out.write("\t\t\t{name:'Manager'},\r\n");
      out.write("\t\t\t{name:'ManagerId'},\r\n");
      out.write("\t\t\t{name:'Responsible'},\r\n");
      out.write("\t\t\t{name:'ResponsibleId'},\r\n");
      out.write("\t\t\t{name:'WorkloadPlan'},\r\n");
      out.write("\t\t\t{name:'State'}\r\n");
      out.write("\t\t])\r\n");
      out.write("    });\r\n");
      out.write("    \r\n");
      out.write("\tvar dependencyStore = new Ext.data.Store({\r\n");
      out.write("\t\tautoLoad : false,\r\n");
      out.write("\t\tbatch : true,\r\n");
      out.write("\t\tproxy : new Ext.data.DirectProxy({\r\n");
      out.write("\t\t\tdirectFn : TaskAppDirect.loadTaskDependences,\r\n");
      out.write("\t\t\tparamsAsHash : true,\r\n");
      out.write("\t\t\tparamOrder : ['startDate','endDate','states'],\r\n");
      out.write("\t\t\tbaseParams : {\r\n");
      out.write("\t\t\t\tstartDate : '',\r\n");
      out.write("\t\t\t\tendDate : '',\r\n");
      out.write("\t\t\t\tstates : ''\r\n");
      out.write("\t\t\t},\r\n");
      out.write("\t\t\tapi : {\r\n");
      out.write("\t\t\t\tcreate : TaskAppDirect.createTaskDependence,\r\n");
      out.write("\t\t\t\tupdate : TaskAppDirect.updateTaskDependence,\r\n");
      out.write("\t\t\t\tdestroy : TaskAppDirect.destroyTaskDependence\r\n");
      out.write("\t\t\t}\r\n");
      out.write("\t\t}),\r\n");
      out.write("        writer : new Ext.data.JsonWriter({\r\n");
      out.write("    \t\tencode : false,\r\n");
      out.write("    \t\twriteAllFields: true\r\n");
      out.write("    \t}),\r\n");
      out.write("\t    reader: new Ext.data.JsonReader({\r\n");
      out.write("\t\t    idProperty : 'Id', \r\n");
      out.write("\t\t    root: 'results',\r\n");
      out.write("\t\t\ttotalProperty: 'totals',\r\n");
      out.write("\t\t\tsuccessProperty:'success'\r\n");
      out.write("\t\t},[\r\n");
      out.write("\t\t\t// 3 mandatory fields\r\n");
      out.write("\t\t\t{name:'Id'},\r\n");
      out.write("\t\t\t{name:'From'},\r\n");
      out.write("\t\t\t{name:'To'},\r\n");
      out.write("\t\t\t{name:'Type'}\r\n");
      out.write("\t\t])\r\n");
      out.write("\t});\r\n");
      out.write("\r\n");
      out.write("\tvar cboInterval = new Ext.form.ComboBox({\r\n");
      out.write("\t\teditable : false,\r\n");
      out.write("\t\tlazyRender:true,\r\n");
      out.write("\t\ttriggerAction: 'all',\r\n");
      out.write("\t    mode: 'local',\r\n");
      out.write("\t    width : 60,\r\n");
      out.write("\t    store: new Ext.data.ArrayStore({\r\n");
      out.write("\t        id: 0,\r\n");
      out.write("\t        fields: [\r\n");
      out.write("\t            'value',\r\n");
      out.write("\t            'display'\r\n");
      out.write("\t        ],\r\n");
      out.write("\t        data: [[Date.WEEK, '按周'], [Date.MONTH, '按月'], [Date.QUARTER, '按季度'], [Date.YEAR, '按年']]\r\n");
      out.write("\t    }),\r\n");
      out.write("\t    valueField: 'value',\r\n");
      out.write("\t    displayField: 'display',\r\n");
      out.write("\t    value : Date.MONTH,\r\n");
      out.write("\t    listeners : {\r\n");
      out.write("\t\t\tselect : function(){\r\n");
      out.write("\t\t\t\tpanel.updateViewColumn();\r\n");
      out.write("\t\t\t\tpanel.refresh();\r\n");
      out.write("\t\t\t}\r\n");
      out.write("\t    }\r\n");
      out.write("\t});\r\n");
      out.write("\r\n");
      out.write("\tvar cboState = new Ext.form.ComboBox({\r\n");
      out.write("\t\teditable : false,\r\n");
      out.write("\t\tlazyRender:true,\r\n");
      out.write("\t\ttriggerAction: 'all',\r\n");
      out.write("\t\tmode: 'local',\r\n");
      out.write("\t\twidth : 90,\r\n");
      out.write("\t\tstore: new Ext.data.ArrayStore({\r\n");
      out.write("\t\t\tid: 0,\r\n");
      out.write("\t\t\tfields: [\r\n");
      out.write("\t\t\t\t'value',\r\n");
      out.write("\t\t\t\t'display'\r\n");
      out.write("\t\t\t],\r\n");
      out.write("\t\t\tdata: [[0, '自动'], [1, '显示已关闭任务'], [99, '显示所有任务']]\r\n");
      out.write("\t\t}),\r\n");
      out.write("\t\tvalueField: 'value',\r\n");
      out.write("\t\tdisplayField: 'display',\r\n");
      out.write("\t\tvalue : 0,\r\n");
      out.write("\t    listeners : {\r\n");
      out.write("\t\t\tselect : function(){\r\n");
      out.write("\t\t\t\tpanel.refresh();\r\n");
      out.write("\t\t\t}\r\n");
      out.write("\t    }\r\n");
      out.write("\t})\r\n");
      out.write("\r\n");
      out.write("\tvar cboHighlight = new Ext.form.ComboBox({\r\n");
      out.write("\t\teditable : false,\r\n");
      out.write("\t\tlazyRender:true,\r\n");
      out.write("\t\ttriggerAction: 'all',\r\n");
      out.write("\t\tmode: 'local',\r\n");
      out.write("\t\twidth : 80,\r\n");
      out.write("\t\tstore: new Ext.data.ArrayStore({\r\n");
      out.write("\t\t\tid: 0,\r\n");
      out.write("\t\t\tfields: [\r\n");
      out.write("\t\t\t\t'value',\r\n");
      out.write("\t\t\t\t'display'\r\n");
      out.write("\t\t\t],\r\n");
      out.write("\t\t\tdata: [['none', '无'], ['ResponsibleId', '我负责的任务'], ['ManagerId', '我管理的任务']]\r\n");
      out.write("\t\t}),\r\n");
      out.write("\t\tvalueField: 'value',\r\n");
      out.write("\t\tdisplayField: 'display',\r\n");
      out.write("\t\tvalue : 'none'\r\n");
      out.write("\t})\r\n");
      out.write("\r\n");
      out.write("\r\n");
      out.write("\t\r\n");
      out.write("\r\n");
      out.write("\t\r\n");
      out.write("\tpanel.calStoreParams = function(){\r\n");
      out.write("\t\tvar interval = cboInterval.getValue();\r\n");
      out.write("\t\tvar state = cboState.getValue();\r\n");
      out.write("\t\tvar d = panel.currentDate;\r\n");
      out.write("\t\tvar startDate, endDate, states;\r\n");
      out.write("\t\tswitch (interval){\r\n");
      out.write("\t\tcase Date.WEEK : \r\n");
      out.write("\t\t\tstartDate = d.add(Date.DAY, -d.getDay());\r\n");
      out.write("\t\t\tendDate = startDate.add(Date.DAY, 7);\r\n");
      out.write("\t\t\tbreak;\r\n");
      out.write("\t\tcase Date.MONTH : \r\n");
      out.write("\t\t\tstartDate = d.getFirstDateOfMonth();\r\n");
      out.write("\t\t\tendDate = d.getLastDateOfMonth();\r\n");
      out.write("\t\t\tbreak;\r\n");
      out.write("\t\tcase Date.QUARTER :\r\n");
      out.write("\t\t\tstartDate = d.getFirstDateOfMonth();\r\n");
      out.write("\t\t\tstartDate = startDate.add(Date.MONTH, -(startDate.getMonth() % 3));\r\n");
      out.write("\t\t\tendDate = startDate.add(Date.MONTH, 3);\r\n");
      out.write("\t\t\tendDate = endDate.add(Date.DAY, -1);\r\n");
      out.write("\t\t\tbreak;\r\n");
      out.write("\t\tcase Date.YEAR : \r\n");
      out.write("\t\t\tstartDate = new Date(d.getFullYear(), 0, 1);\r\n");
      out.write("\t\t\tendDate = new Date(d.getFullYear() + 1, 0, 1);\r\n");
      out.write("\t\t\tendDate = endDate.add(Date.DAY, -1);\r\n");
      out.write("\t\t\tbreak;\r\n");
      out.write("\t\t}\r\n");
      out.write("\t\tswitch (state){\r\n");
      out.write("\t\tcase 0:\r\n");
      out.write("\t\t\tstates = \"计划,执行,完成\";\r\n");
      out.write("\t\t\tbreak;\r\n");
      out.write("\t\tcase 1:\r\n");
      out.write("\t\t\tstates = \"计划,执行,完成,关闭\";\r\n");
      out.write("\t\t\tbreak;\r\n");
      out.write("\t\tcase 99:\r\n");
      out.write("\t\t\tstates = \"计划,执行,完成,关闭,挂起\";\r\n");
      out.write("\t\t\tbreak;\r\n");
      out.write("\t\t}\r\n");
      out.write("\t\treturn {\r\n");
      out.write("\t\t\tstartDate : startDate.format('Y-m-d'),\r\n");
      out.write("\t\t\tendDate : endDate.format('Y-m-d'),\r\n");
      out.write("\t\t\tstates : states\r\n");
      out.write("\t\t}\r\n");
      out.write("\t}\r\n");
      out.write("\t\t\r\n");
      out.write("\t// 任务条右键菜单\r\n");
      out.write("\tvar taskMenuPlugin = new Sch.gantt.plugins.TaskContextMenu();\r\n");
      out.write("\ttaskMenuPlugin.itemPlus = ['-', {\r\n");
      out.write("\t\tid : 'Managr',\r\n");
      out.write("\t\ttext : '变更管理者',\r\n");
      out.write("\t\tmenu : menuOrganization,\r\n");
      out.write("\t\tlisteners : {\r\n");
      out.write("\t\t\t'activate' : function(a, e){\r\n");
      out.write("\t\t\t\ttaskMenuPlugin.userFieldId = 'Manager';\r\n");
      out.write("\t\t\t}\r\n");
      out.write("\t\t}\r\n");
      out.write("\t}, {\r\n");
      out.write("\t\tid : 'Responsible',\r\n");
      out.write("\t\ttext : '变更负责人',\r\n");
      out.write("\t\tmenu : menuOrganization,\r\n");
      out.write("\t\tlisteners : {\r\n");
      out.write("\t\t\t'activate' : function(a, e){\r\n");
      out.write("\t\t\t\ttaskMenuPlugin.userFieldId = 'Responsible';\r\n");
      out.write("\t\t\t}\r\n");
      out.write("\t\t}\r\n");
      out.write("\t}, {\r\n");
      out.write("\t\tid : 'State',\r\n");
      out.write("\t\ttext : '变更状态',\r\n");
      out.write("\t\tmenu : new Ext.menu.Menu({\r\n");
      out.write("\t\t\tplain: true,\r\n");
      out.write("\t\t\tdefaults : {\r\n");
      out.write("                checked : false,\r\n");
      out.write("                group : 'state',\r\n");
      out.write("                scope : taskMenuPlugin,\r\n");
      out.write("                handler : function(a, e){\r\n");
      out.write("\t\t\t\t\tthis.rec.set('State', a.text);\r\n");
      out.write("\t\t\t\t}\r\n");
      out.write("\t\t\t},\r\n");
      out.write("\t\t\titems : [{\r\n");
      out.write("\t\t\t\ttext : '计划'\r\n");
      out.write("\t\t\t}, {\r\n");
      out.write("\t\t\t\ttext : '执行'\r\n");
      out.write("\t\t\t}, {\r\n");
      out.write("\t\t\t\ttext : '完成'\r\n");
      out.write("\t\t\t}, {\r\n");
      out.write("\t\t\t\ttext : '关闭'\r\n");
      out.write("\t\t\t}, {\r\n");
      out.write("\t\t\t\ttext : '挂起'\r\n");
      out.write("\t\t\t}],\r\n");
      out.write("\t\t\tsetState : function(state){\r\n");
      out.write("\t\t\t\tvar s = this.find('text', state);\r\n");
      out.write("\t\t\t\tif(s.length > 0){\r\n");
      out.write("\t\t\t\t\ts[0].setChecked(true);\r\n");
      out.write("\t\t\t\t}\r\n");
      out.write("\t\t\t}\r\n");
      out.write("\t\t})\r\n");
      out.write("\t}]\r\n");
      out.write("\tvar gantt = new Sch.TreeGanttPanel({\r\n");
      out.write("\t\tborder : false,\r\n");
      out.write("\t\tleftLabelField : 'Name',\r\n");
      out.write("\t\thighlightWeekends : true,\r\n");
      out.write("\t\tshowTodayLine : true,\r\n");
      out.write("\t\tloadMask : true,\r\n");
      out.write("\t\ttrackMouseOver : false,\r\n");
      out.write("\t\tstripeRows : true,\r\n");
      out.write("\t\tcascadeChanges : false,\r\n");
      out.write("\t\ttimeColumnDefaults : { width : 150 },\r\n");
      out.write("\t\ttbar : [{\r\n");
      out.write("\t\t\ttext : '创建新任务',\r\n");
      out.write("\t\t\ticonCls : 'icon-sys-add',\r\n");
      out.write("\t\t\thandler : function(){\r\n");
      out.write("\t\t\t\tvar newTask = new store.recordType({\r\n");
      out.write("\t                PercentDone: 0,\r\n");
      out.write("\t                Name: '新任务',\r\n");
      out.write("\t                StartDate: panel.currentDate,\r\n");
      out.write("\t                EndDate: panel.currentDate.add(Date.DAY, 1),\r\n");
      out.write("\t                IsLeaf: true\r\n");
      out.write("\t            });\r\n");
      out.write("\t            store.add([newTask]);\r\n");
      out.write("\t\t\t}\r\n");
      out.write("\t\t}, '-','区间设置：', {\r\n");
      out.write("\t\t\ticonCls : 'icon-sys-previous',\r\n");
      out.write("\t\t\thandler : function(){\r\n");
      out.write("\t\t\t\tpanel.currentDate = panel.currentDate.add(cboInterval.getValue(), -1);\r\n");
      out.write("\t\t\t\tpanel.refresh();\r\n");
      out.write("\t\t\t\tpanel.updateViewColumn();\r\n");
      out.write("\t\t\t}\r\n");
      out.write("\t\t}, cboInterval,{\r\n");
      out.write("\t\t\ticonCls : 'icon-sys-next',\r\n");
      out.write("\t\t\thandler : function(){\r\n");
      out.write("\t\t\t\tpanel.currentDate = panel.currentDate.add(cboInterval.getValue(), 1);\r\n");
      out.write("\t\t\t\tpanel.refresh();\r\n");
      out.write("\t\t\t\tpanel.updateViewColumn();\r\n");
      out.write("\t\t\t}\r\n");
      out.write("\t\t}, '-', '筛选：', cboState, '-', '->', {\r\n");
      out.write("\t\t\ttext : '全部收起',\r\n");
      out.write("\t\t\ticonCls : 'icon-sys-up',\r\n");
      out.write("\t\t\thandler : function() {\r\n");
      out.write("\t\t\t\tgantt.store.collapseAll();\r\n");
      out.write("\t\t\t}\r\n");
      out.write("\t\t}, {\r\n");
      out.write("\t\t\ttext : '全部展开',\r\n");
      out.write("\t\t\ticonCls : 'icon-sys-down',\r\n");
      out.write("\t\t\thandler : function() {\r\n");
      out.write("\t\t\t\tgantt.store.expandAll();\r\n");
      out.write("\t\t\t}\r\n");
      out.write("\t\t}, '-','突出显示：', cboHighlight, '-', {\r\n");
      out.write("\t\t\ttext : '刷新',\r\n");
      out.write("\t\t\ticonCls : 'icon-sys-refresh',\r\n");
      out.write("\t\t\thandler : function(){\r\n");
      out.write("\t\t\t\tpanel.refresh();\r\n");
      out.write("\t\t\t}\r\n");
      out.write("\t\t\t\r\n");
      out.write("\t\t}],\r\n");
      out.write("\t\tfnEventEditable : function(a, b){\r\n");
      out.write("\t\t\treturn isTaskEditable(b);\r\n");
      out.write("\t\t},\r\n");
      out.write("\t\tplugins : [taskMenuPlugin, new ConnectorLinePlugin(),\r\n");
      out.write("\t\t\tthis.editor = new Sch.plugins.EventEditor({\r\n");
      out.write("\t\t\t\theight : 260,\r\n");
      out.write("\t\t\t\twidth : 350,\r\n");
      out.write("\t\t\t\tbuttonAlign : 'right',\r\n");
      out.write("\t\t\t\tfieldsPanelConfig : {\r\n");
      out.write("\t\t\t\t\tlayout : 'form',\r\n");
      out.write("\t\t\t\t\tstyle:'background:#fff',\r\n");
      out.write("\t\t\t\t\tborder : false,\r\n");
      out.write("\t\t\t\t\tcls : 'editorpanel',\r\n");
      out.write("\t\t\t\t\tdefaults : {\r\n");
      out.write("\t\t\t\t\t\tanchor : '100%'\r\n");
      out.write("\t\t\t\t\t},\r\n");
      out.write("\t\t\t\t\tlabelWidth : 40,\r\n");
      out.write("\t\t\t\t\tbuttonAlign : 'right',\r\n");
      out.write("\t\t\t\t\titems : [\r\n");
      out.write("\t\t\t\t\t\ttitleField = new Ext.form.TextField({\r\n");
      out.write("\t\t\t\t\t\t\tname : 'Name',\r\n");
      out.write("\t\t\t\t\t\t\tfieldLabel : '标题',\r\n");
      out.write("\t\t\t\t\t\t\tallowBlank : false\r\n");
      out.write("\t\t\t\t\t\t}), new Ext.form.TextArea({\r\n");
      out.write("\t\t\t\t\t\t\tname : 'Note',\r\n");
      out.write("\t\t\t\t\t\t\tfieldLabel : '描述'\r\n");
      out.write("\t\t\t\t\t\t}), {\r\n");
      out.write("\t\t\t\t\t\t\tlayout : 'column',\r\n");
      out.write("\t\t\t\t\t\t\tborder : false,\r\n");
      out.write("\t\t\t\t\t\t\titems : [{\r\n");
      out.write("\t\t\t\t\t\t\t\tcolumnWidth : .45,\r\n");
      out.write("\t\t\t\t\t\t\t\tlayout : 'form',\r\n");
      out.write("\t\t\t\t\t\t\t\tlabelWidth : 70,\r\n");
      out.write("\t\t\t\t\t\t\t\tborder : false,\r\n");
      out.write("\t\t\t\t\t\t\t\titems : new Ext.ux.form.SpinnerField({\r\n");
      out.write("\t\t\t\t\t\t\t\t\tname : 'PercentDone',\r\n");
      out.write("\t\t\t\t\t\t\t\t\tfieldLabel : '进度（%）',\r\n");
      out.write("\t\t\t\t\t\t\t\t\tanchor : '100%',\r\n");
      out.write("\t\t\t\t\t\t\t\t\tincrementValue : 10,\r\n");
      out.write("\t\t\t\t\t\t\t\t\tmaxValue : 100,\r\n");
      out.write("\t\t\t\t\t\t\t\t\tminValue : 0,\r\n");
      out.write("\t\t\t\t\t\t\t\t\tallowBlank: false\r\n");
      out.write("\t\t\t\t\t\t\t\t})\r\n");
      out.write("\t\t\t\t\t\t\t},{\r\n");
      out.write("\t\t\t\t\t\t\t\tcolumnWidth : .55,\r\n");
      out.write("\t\t\t\t\t\t\t\tlayout : 'form',\r\n");
      out.write("\t\t\t\t\t\t\t\tlabelWidth : 90,\r\n");
      out.write("\t\t\t\t\t\t\t\tborder : false,\r\n");
      out.write("\t\t\t\t\t\t\t\titems : new Ext.form.NumberField({\r\n");
      out.write("\t\t\t\t\t\t\t\t\tname : 'WorkloadPlan',\r\n");
      out.write("\t\t\t\t\t\t\t\t\tanchor : '100%',\r\n");
      out.write("\t\t\t\t\t\t\t\t\tfieldLabel : '工作量（小时）'\r\n");
      out.write("\t\t\t\t\t\t\t\t})\r\n");
      out.write("\t\t\t\t\t\t\t}]\r\n");
      out.write("\t\t\t\t\t\t}, new Ext.form.TextArea({\r\n");
      out.write("\t\t\t\t\t\t\tname : 'Result',\r\n");
      out.write("\t\t\t\t\t\t\tfieldLabel : '结果'\r\n");
      out.write("\t\t\t\t\t\t})\r\n");
      out.write("\t\t\t\t\t]\r\n");
      out.write("\t\t\t\t},\r\n");
      out.write("\t\t\t\tsaveHandlerScope : gantt,\r\n");
      out.write("\t\t\t\tsaveHandler : function(editor, start, end, record){\r\n");
      out.write("\t\t\t\t\tvar form = editor.getForm();\r\n");
      out.write("\t\t\t\t\tif(!form.isDirty()){\r\n");
      out.write("\t\t\t\t\t\teditor.collapse(false);\r\n");
      out.write("\t\t\t\t\t}else if(form.isValid()){\r\n");
      out.write("\t\t\t\t\t\tvar values = form.getValues();\r\n");
      out.write("\t\t\t\t\t\trecord.beginEdit();\r\n");
      out.write("\t\t\t\t\t\trecord.set('StartDate', start);\r\n");
      out.write("\t\t\t\t\t\trecord.set('EndDate', end);\r\n");
      out.write("\t\t\t\t\t\tfor(n in values){\r\n");
      out.write("\t\t\t\t\t\t\tif(n != 'StartDate' && n != 'EndDate'){\r\n");
      out.write("\t\t\t\t\t\t\t\trecord.set(n, values[n]);\r\n");
      out.write("\t\t\t\t\t\t\t}\r\n");
      out.write("\t\t\t\t\t\t}\r\n");
      out.write("\t\t\t\t\t\trecord.endEdit();\r\n");
      out.write("\t\t\t\t\t\teditor.collapse(false);\r\n");
      out.write("\t\t\t\t\t}\r\n");
      out.write("\t\t\t\t},\r\n");
      out.write("\t\t\t\tlisteners : {\r\n");
      out.write("\t\t\t\t\texpand : function() {\r\n");
      out.write("\t\t\t\t\t\ttitleField.focus(true);\r\n");
      out.write("\t\t\t\t\t}\r\n");
      out.write("\t\t\t\t}\r\n");
      out.write("\t\t\t})\r\n");
      out.write("        ],\r\n");
      out.write("\t\ttooltipTpl : new Ext.XTemplate(\r\n");
      out.write("\t\t\t'<h4 class=\"tipHeader\">{Name}（{State}）</h4>',\r\n");
      out.write("\t\t\t'<table class=\"taskTip\" width=100%>', \r\n");
      out.write("\t\t\t\t'<tr><td>开始:</td> <td align=\"right\">{[values.StartDate.format(\"Y-m-d\")]}</td></tr>',\r\n");
      out.write("\t\t\t\t'<tr><td>结束:</td> <td align=\"right\">{[values.EndDate.format(\"Y-m-d\")]}</td></tr>',\r\n");
      out.write("\t\t\t\t'<tr><td>工作量:</td> <td align=\"right\">{WorkloadPlan}小时</td></tr>',\r\n");
      out.write("\t\t\t\t'<tr><td>进度:</td><td align=\"right\">{PercentDone}%</td></tr>',\r\n");
      out.write("\t\t\t\t'<tr><td>管理者:</td><td align=\"right\">{Manager}</td></tr>',\r\n");
      out.write("\t\t\t\t'<tr><td>负责人:</td><td align=\"right\">{Responsible}</td></tr>',\r\n");
      out.write("\t\t\t\t'<tr><td colspan=2><B>描述：</B>{Note}</td></tr>',\r\n");
      out.write("\t\t\t\t'<tr><td colspan=2><B>结果：</B>{Result}</td></tr>',\r\n");
      out.write("\t\t\t'</table>'\r\n");
      out.write("\t\t).compile(),\r\n");
      out.write("        viewModel : {\r\n");
      out.write("            start : sDate, \r\n");
      out.write("            end : eDate, \r\n");
      out.write("            columnType : 'weekAndDays',\r\n");
      out.write("            viewBehaviour : Sch.ViewBehaviour.WeekView\r\n");
      out.write("        },\r\n");
      out.write("        store : store,\r\n");
      out.write("        dependencyStore : dependencyStore,\r\n");
      out.write("\t\tcolModel : new Ext.ux.grid.LockingColumnModel({\r\n");
      out.write("\t\t\tcolumns : [{\r\n");
      out.write("\t\t\t\theader : '标题', \r\n");
      out.write("\t\t\t\tsortable:true, \r\n");
      out.write("\t\t\t\tdataIndex : 'Name', \r\n");
      out.write("\t\t\t\tlocked : true,\r\n");
      out.write("\t\t\t\twidth:180, \r\n");
      out.write("\t\t\t\teditor : new Ext.form.TextField(),\r\n");
      out.write("\t\t\t\trenderer : function (v, m, r) {\r\n");
      out.write("\t\t\t\t\tif (r.get('IsLeaf')) {\r\n");
      out.write("\t\t\t\t\t\tm.css = 'task';\r\n");
      out.write("\t\t\t\t\t} else {\r\n");
      out.write("\t\t\t\t\t\tm.css = 'parent';\r\n");
      out.write("\t\t\t\t\t}\r\n");
      out.write("\t\t\t\t\treturn v;\r\n");
      out.write("\t\t\t\t}\r\n");
      out.write("\t\t\t},{\r\n");
      out.write("\t\t\t\theader : '状态', \r\n");
      out.write("\t\t\t\twidth:50, \r\n");
      out.write("\t\t\t\tdataIndex : 'State', \r\n");
      out.write("\t\t\t\tlocked : true\r\n");
      out.write("\t\t\t},{\r\n");
      out.write("\t\t\t\theader : '管理者', \r\n");
      out.write("\t\t\t\twidth:50, \r\n");
      out.write("\t\t\t\tdataIndex : 'Manager', \r\n");
      out.write("\t\t\t\tlocked : true\r\n");
      out.write("\t\t\t},{\r\n");
      out.write("\t\t\t\theader : '负责人',\r\n");
      out.write("\t\t\t\twidth:50, \r\n");
      out.write("\t\t\t\tdataIndex : 'Responsible', \r\n");
      out.write("\t\t\t\tlocked : true,\r\n");
      out.write("\t\t\t},{\r\n");
      out.write("\t\t\t\theader : '开始日期', \r\n");
      out.write("\t\t\t\tsortable:true, \r\n");
      out.write("\t\t\t\twidth:80, \r\n");
      out.write("\t\t\t\tdataIndex : 'StartDate', \r\n");
      out.write("\t\t\t\tlocked : true,\r\n");
      out.write("\t\t\t\trenderer: Ext.util.Format.dateRenderer('Y-m-d'),\r\n");
      out.write("\t\t\t\teditor : new Ext.form.DateField({format: 'Y-m-d'})\r\n");
      out.write("\t\t\t},{\r\n");
      out.write("\t\t\t\theader : '持续', \r\n");
      out.write("\t\t\t\tsortable:true, \r\n");
      out.write("\t\t\t\twidth:40, \r\n");
      out.write("\t\t\t\tdataIndex : 'Duration', \r\n");
      out.write("\t\t\t\trenderer: function(v, m, r) {\r\n");
      out.write("\t\t\t\t\tvar d = Math.round(Date.getDurationInHours(r.get('StartDate'), r.get('EndDate'))/12) / 2;\r\n");
      out.write("\t\t\t\t\tif (d > 0) {\r\n");
      out.write("\t\t\t\t\t\treturn d + '天';\r\n");
      out.write("\t\t\t\t\t}\r\n");
      out.write("\t\t\t\t}, \r\n");
      out.write("\t\t\t\tlocked : true, \r\n");
      out.write("\t\t\t\teditor: new Ext.ux.form.SpinnerField({\r\n");
      out.write("\t\t\t\tallowBlank:false,\r\n");
      out.write("\t\t\t\t\tminValue : 0,\r\n");
      out.write("\t\t\t\t\tdecimalPrecision: 1,\r\n");
      out.write("\t\t\t\t\tincrementValue : 1\r\n");
      out.write("\t\t\t\t})\r\n");
      out.write("\t\t\t},{\r\n");
      out.write("\t\t\t\theader : '进度％', \r\n");
      out.write("\t\t\t\tsortable:true, \r\n");
      out.write("\t\t\t\twidth:50, \r\n");
      out.write("\t\t\t\tdataIndex : 'PercentDone', \r\n");
      out.write("\t\t\t\trenderer: function(v, m, r) {\r\n");
      out.write("\t\t\t\t\treturn typeof v === 'number' ? (v + '%') : '';\r\n");
      out.write("\t\t\t\t}, \r\n");
      out.write("\t\t\t\tlocked : true, \r\n");
      out.write("\t\t\t\teditor: new Ext.ux.form.SpinnerField({\r\n");
      out.write("\t\t\t\t\tallowBlank:false,\r\n");
      out.write("\t\t\t\t\tminValue : 0,\r\n");
      out.write("\t\t\t\t\tmaxValue : 100,\r\n");
      out.write("\t\t\t\t\tincrementValue : 10\r\n");
      out.write("\t\t\t\t})\r\n");
      out.write("\t\t\t}]\r\n");
      out.write("\t\t})\r\n");
      out.write("\t});\r\n");
      out.write("\t// 更新显示区间\r\n");
      out.write("\tpanel.updateViewColumn = function(){\r\n");
      out.write("\t\tvar interval = cboInterval.getValue();\r\n");
      out.write("\t\tvar d = panel.currentDate;\r\n");
      out.write("\t\tvar startDate, endDate, type;\r\n");
      out.write("\t\tswitch (interval){\r\n");
      out.write("\t\tcase Date.WEEK : \r\n");
      out.write("\t\t\tstartDate = d.add(Date.DAY, -d.getDay()+1);\r\n");
      out.write("\t\t\tendDate = startDate.add(Date.DAY, 7);\r\n");
      out.write("\t\t\ttype = 'weekAndDays';\r\n");
      out.write("\t\t\tbreak;\r\n");
      out.write("\t\tcase Date.MONTH : \r\n");
      out.write("\t\t\tstartDate = d.getFirstDateOfMonth();\r\n");
      out.write("\t\t\tstartDate = startDate.add(Date.DAY, -startDate.getDay()+1);\r\n");
      out.write("\t\t\tendDate = d.getLastDateOfMonth();\r\n");
      out.write("\t\t\tendDate = endDate.add(Date.DAY, endDate.getDay()+1);\r\n");
      out.write("\t\t\ttype = 'weekAndDays';\r\n");
      out.write("\t\t\tbreak;\r\n");
      out.write("\t\tcase Date.QUARTER :\r\n");
      out.write("\t\t\tstartDate = d.getFirstDateOfMonth();\r\n");
      out.write("\t\t\tstartDate = startDate.add(Date.MONTH, -(startDate.getMonth() % 3));\r\n");
      out.write("\t\t\tendDate = startDate.add(Date.MONTH, 3);\r\n");
      out.write("\t\t\tendDate = endDate.add(Date.DAY, -1);\r\n");
      out.write("\t\t\ttype = 'monthAndQuarters';\r\n");
      out.write("\t\t\tbreak;\r\n");
      out.write("\t\tcase Date.YEAR : \r\n");
      out.write("\t\t\tstartDate = new Date(d.getFullYear(), 0, 1);\r\n");
      out.write("\t\t\tendDate = new Date(d.getFullYear() + 1, 0, 1);\r\n");
      out.write("\t\t\tendDate = endDate.add(Date.DAY, -1);\r\n");
      out.write("\t\t\ttype = 'monthAndQuarters';\r\n");
      out.write("\t\t\tbreak;\r\n");
      out.write("\t\t}\r\n");
      out.write("\t\tgantt.setView(startDate, endDate, type);\r\n");
      out.write("\t}\r\n");
      out.write("\t// 处理图突出显示\r\n");
      out.write("\tcboHighlight.on('select', function(c, r, i){\r\n");
      out.write("\t\tvar v = r.get('value');\r\n");
      out.write("\t\tgantt.clearSelectedTasksAndDependencies();\r\n");
      out.write("\t\tgantt.getView().mainBody.select(gantt.eventSelector + ':not(.' + gantt.getSelectionModel().selectedClass + ')').setOpacity(1);\r\n");
      out.write("\t\tif(v != 'none'){\r\n");
      out.write("\t\t\tstore.each(function(rec){\r\n");
      out.write("\t\t\t\tvar hl;\r\n");
      out.write("\t\t\t\tswitch(v){\r\n");
      out.write("\t\t\t\tcase 'ManagerId':\r\n");
      out.write("\t\t\t\t\thl = isTaskManager(rec);\r\n");
      out.write("\t\t\t\t\tbreak;\r\n");
      out.write("\t\t\t\tcase 'ResponsibleId':\r\n");
      out.write("\t\t\t\t\thl = isTaskResponsible(rec);\r\n");
      out.write("\t\t\t\t\tbreak;\r\n");
      out.write("\t\t\t\t}\r\n");
      out.write("\t\t\t\tif(hl){\r\n");
      out.write("\t\t\t\t\tgantt.highlightTask(rec);\r\n");
      out.write("\t\t\t\t}\r\n");
      out.write("\t\t\t})\r\n");
      out.write("\t\t\tgantt.getView().mainBody.select(gantt.eventSelector + ':not(.' + gantt.getSelectionModel().selectedClass + ')').setOpacity(0.1);\r\n");
      out.write("\t\t}\r\n");
      out.write("\t})\r\n");
      out.write("\t// 处理菜单权限\r\n");
      out.write("\ttaskMenuPlugin.on('beforecontextmenu', function(p, m, r){\r\n");
      out.write("\t\tm.findById('State').menu.setState(r.get('State'));\r\n");
      out.write("\t})\r\n");
      out.write("    \r\n");
      out.write("\tvar beforeEdit = function(o) {\r\n");
      out.write("\t\t// Set the duration field to help the editor get the value\r\n");
      out.write("\t\to.cancel = (o.field === 'Duration' || o.field === 'StartDate') && !o.record.store.isLeafNode(o.record);\r\n");
      out.write("\t\t// 判断是否管理员或负责人\r\n");
      out.write("\t\to.cancel = o.cancel || !isTaskEditable(o.record)\r\n");
      out.write("        \r\n");
      out.write("\t\tif (!o.cancel && o.field === 'Duration') {\r\n");
      out.write("\t\t\tvar r = o.record,\r\n");
      out.write("\t\t\t\tdurationDays = Math.round(Date.getDurationInHours(r.get('StartDate'), r.get('EndDate'))/12) / 2;\r\n");
      out.write("            \r\n");
      out.write("\t\t\tr.set('Duration', durationDays);\r\n");
      out.write("\t\t}\r\n");
      out.write("\t}\r\n");
      out.write("\tvar afterEdit = function(o) {\r\n");
      out.write("\t\tif (o.field === 'Duration') {\r\n");
      out.write("\t\t\tvar start = o.record.get('StartDate');\r\n");
      out.write("\t\t\to.record.set('EndDate', start.add(Date.HOUR, o.value * 24));\r\n");
      out.write("\t\t} else if (o.field === 'StartDate') {\r\n");
      out.write("\t\t\tvar dur = o.record.get('EndDate') - o.originalValue;\r\n");
      out.write("\t\t\to.record.set('EndDate', o.value.add(Date.MILLI, dur));\r\n");
      out.write("\t\t}\r\n");
      out.write("\t}\r\n");
      out.write("\t\r\n");
      out.write("\tpanel.refresh = function(){\r\n");
      out.write("\t\tstore.removeAll(true);\r\n");
      out.write("\t\tstore.commitChanges();\r\n");
      out.write("\t\tdependencyStore.removeAll(true);\r\n");
      out.write("\t\tdependencyStore.commitChanges();\r\n");
      out.write("\t\tvar params = panel.calStoreParams();\r\n");
      out.write("\t\tdependencyStore.load({params : params});\r\n");
      out.write("\t\tstore.load({params : params});\r\n");
      out.write("\t}\r\n");
      out.write("\t\r\n");
      out.write("\tpanel.add(gantt);\r\n");
      out.write("\tpanel.doLayout();\r\n");
      out.write("\t\r\n");
      out.write("\tgantt.on({\r\n");
      out.write("\t\t'beforeedit': beforeEdit, \r\n");
      out.write("\t\t'afteredit': afterEdit,\r\n");
      out.write("\t\tscope : gantt\r\n");
      out.write("\t});\r\n");
      out.write("\r\n");
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