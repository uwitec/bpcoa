<%@ page contentType="text/html; charset=utf-8"%>
<%@ page import="java.util.List"%>
<%@ page import="com.mixky.engine.common.Action"%>
<%@ page import="com.google.gson.JsonObject"%>
<%@ page import="com.mixky.engine.view.ViewManager"%>
<%@ page import="com.mixky.engine.view.View"%>
<%@ page import="com.mixky.engine.view.Column"%>
<%@ page import="com.mixky.engine.store.TableForm"%>
<%@ page import="com.mixky.engine.authority.AuthorityManager"%>
<%@ page import="com.mixky.engine.organization.User"%>
<%@ page import="com.mixky.engine.module.DocumentType"%>
<%@ page import="com.mixky.engine.common.DesignObjectLoader"%>
<%
	String panelid = request.getParameter("panelid");
	View view = (View)request.getAttribute("view");
	User user = (User)request.getAttribute("user");
	
	String key = "calendar.share";
	// List<Column> columns = view.getF_columns();
	// List<Action> actions = AuthorityManager.instance().getDesignObjectsByUser(view.getF_buttons(), user);
	// JsonObject cfg = view.getF_config();
	// TableForm tableform = DesignObjectLoader.instance().loadDesignObject(cfg.get("editorform").getAsString());
%>
<script language='javascript'>

Ext.ns("Mixky.calendar");

Ext.onReady(function(){
	
	var panel = Ext.getCmp('<%=panelid%>');
	var win = panel.findParentByType('window');
    
	var userId = <%=user.getId()%>;

    var count = 0;
    Mixky.app.common.LoadJsFile('mixkyjs-calendar-share-extend', 'app/mkoa/calendar/calendar.share.extend.js');
    var fn = function(){
        // 判断js是否加载完毕
        if(!Mixky.calendar.LanguageShare && count++ < 100){
            fn.defer(50);
        }else{
            var ds = new Ext.ux.calendar.DataSource({key:'<%=key%>'});
            ds.initialLoad(userId, function(backObj){
                var cs = backObj.cs;
                ds.initialObj = backObj;
                var mp = new Ext.ux.calendar.MainPanel({
                    datasource:ds,
                    calendarSetting:cs,
                    lang : Mixky.calendar.LanguageShare
                });
        		panel.add(mp);
        		panel.doLayout();
            });
        }
    };        
    fn();
});
</script>