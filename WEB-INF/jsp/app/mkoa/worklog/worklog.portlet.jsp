<%@ page contentType="text/html; charset=utf-8"%>
<%@ page import="java.util.Date"%>
<%@ page import="com.mixky.toolkit.DateUtil"%>
<%@ page import="com.mixky.app.certification.MixkyUserCertification"%>
<%@ page import="com.mixky.engine.organization.User"%>
<%@ page import="com.mixky.app.mkoa.worklog.WorklogManager"%>
<%
	// 读取参数
	String key = request.getParameter("key");
	String panelid = "portlet-" + key;
	String date = DateUtil.format(new Date(System.currentTimeMillis()), DateUtil.FORMAT_DATE);
	User user = MixkyUserCertification.instance().getUserInfo(request);
%>
<script language='javascript'>
Ext.onReady(function(){

	var panel = Ext.getCmp('<%=panelid%>');

	// 数据访问
	var store = new Ext.data.DirectStore({
		directFn : WorklogAppDirect.getWeekWorklogs,
		paramOrder : ['userid', 'date'],
		baseParams : {userid : <%=user.getId()%>, date : '<%=date%>'},
		remoteSort : true,
		root : 'results',
		totalProperty : 'totals',
		idProperty : 'F_DAY',
		fields : ['F_DAY', 'F_DAYSTR', 'F_WORKLOGS']
	});

	// 选择人员
	var comboUser = new Ext.form.ComboBox({
		typeAhead: true,
		triggerAction: 'all',
		mode: 'local',
		editable : false,
		width : 80,
		store : new Ext.data.ArrayStore({
			id: 0,
			fields: ['id', 'name'],
			data:<%=WorklogManager.instance().getUnderlingUsers(user)%>
		}),
		valueField: 'id',
		displayField: 'name',
		value : <%=user.getId()%>,
		listeners : {
			'select' : function(){
				panel.refresh();
			}
		}
	})

	// 选择周
	var dateSelect = new Ext.form.DateField({
		value:'<%=date%>', 
		editable : false, 
		width : 90,
		format : 'Y-m-d',
		listeners : {
			'select' : function(){
				panel.refresh();
			}
		}
	});
	// 上周
	var btnPreWeek = new Ext.Action({
		iconCls : 'icon-sys-btnback',
		handler : function(){
			//var date = new Date(store.baseParams.date);
			var date = Date.parseDate(store.baseParams.date, 'Y-m-d');
			dateSelect.setValue(date.add(Date.DAY, -7).format('Y-m-d'));
			panel.refresh();
		}
	});
	// 下周
	var btnNextWeek = new Ext.Action({
		iconCls : 'icon-sys-btnnext',
		handler : function(){
			//var date = new Date(store.baseParams.date);
			var date = Date.parseDate(store.baseParams.date, 'Y-m-d');
			dateSelect.setValue(date.add(Date.DAY, 7).format('Y-m-d'));
			panel.refresh();
		}
	});
	var grid = new Ext.grid.GridPanel({
		border : false,
		stripeRows: false,
		hideHeaders : true,
		lineBreak : false,
		autoExpandColumn : 'F_WORKLOGS',
		tbar : [btnPreWeek, dateSelect, btnNextWeek, '-', comboUser],
		store : store,
		contextMenu : new Ext.menu.Menu({
			items:[{
				text : '添加日志',
				iconCls : 'icon-sys-add',
				handler : function(){
					var record = grid.getSelectionModel().getSelected();
					if(!record){
						return;
					}
					var userid = comboUser.getValue();
					var username = comboUser.getRawValue();
					if(userid == <%=user.getId()%>){
						MixkyApp.desktop.openDocument('mkWorklog.docWorklog',undefined,{F_START_TIME : record.get('F_DAY') + ' 09:00:00', F_END_TIME : record.get('F_DAY') + ' 18:00:00'}, {openerId : panel.getId()});
					}else{
						MixkyApp.desktop.openDocument('mkWorklog.docWorklog',undefined,{F_STATE:'任务', F_USER : username, F_USER_ID : userid, F_START_TIME : record.get('F_DAY') + ' 09:00:00', F_END_TIME : record.get('F_DAY') + ' 18:00:00'}, {openerId : panel.getId()});
					}
				}
			}, '-', {
				text : '刷新',
				iconCls : 'icon-sys-refresh',
				handler : function(){
					panel.refresh();
				}
			}]
		}),
		listeners : {
			'rowcontextmenu' : function(g, rowIndex, e){
				g.getSelectionModel().selectRow(rowIndex);
				g.contextMenu.showAt(e.getXY());
			}
		},
		columns : [{
			id : 'F_DAY',
			dataIndex : 'F_DAY',
			align : 'center',
			width : 80,
			renderer : function(value, metaData, record, rowIndex, colIndex, store){
				return '<B>' + record.get("F_DAYSTR") + '</B><BR>' + record.get("F_DAY");
			}
		}, {
			id : 'F_WORKLOGS',
			dataIndex : 'F_WORKLOGS',
			renderer : function(value, metaData, record, rowIndex, colIndex, store){
				var output = '';
				for(var i=0;i<value.length;i++){
					if(output != ''){
						output = output + "<br>";
					}
					output = output + String.format('<a href=# onclick="Mixky.app.common.openFavorite(\'mkWorklog.docWorklog\', {0})">{1} {2}</a>', value[i].id, value[i].time, value[i].title);
				}
				return output;
			}
		}]
	});

	panel.refresh = function(){
		store.baseParams.userid = comboUser.getValue();
		store.baseParams.date = dateSelect.getRawValue();
		store.reload();
	}

	panel.add(grid);
	panel.doLayout();
	panel.refresh();
});
</script>