<%@ page contentType="text/html; charset=utf-8"%>
<%@ page import="com.mixky.app.mkoa.admin.ConfigrationManager"%>
<%
	String panelid = request.getParameter("panelid");
%>
<script language='javascript'>
Ext.onReady(function(){
	var panel = Ext.getCmp('<%=panelid%>');
	
	var displayField = new Ext.grid.GridEditor(new Ext.form.TextField({readOnly:true, selectOnFocus:true}));
	var textareaField = new Ext.grid.GridEditor(new Ext.form.TextArea({readOnly:true, selectOnFocus:true}));
	
	var grid = new Ext.grid.PropertyGrid({
		border : false,
		tbar : ['->', {
			text : '产品注册',
			iconCls : 'icon-sys-logo',
			handler : function(){
				MixkyApp.desktop.openDourlWithWindow(
						'win-register', 
						'app/mkoa/admin/product.register', 
						{
							width : 350,
							height : 300,
							minimizable : false,
							maximizable : false,
							resizable : false,
							modal : true,
							title : '产品注册',
							defaults : {padding : 5},
							iconCls : 'icon-sys-logo'
						});
			}
		}, '-',{
			text : '保存',
			iconCls : 'icon-sys-save',
			handler : function(){
				panel.submit();
			}
		}, '-',{
			text : '刷新',
			iconCls : 'icon-sys-refresh',
			handler : function(){
				panel.refresh();
			}
		}],
		source: <%=ConfigrationManager.instance().getConfigration()%>,
		customRenderers : {
			"s04ProductLicenses" : function(v){
				return v + ' 用户许可';
			},
			"s05ServiceLimit" : function(v){
				return '截止于 ' + v;
			},
			"s06SmsMessages" : function(v){
				return '剩余 ' + v + ' 条短信';
			}
		},
		customEditors : {
			"s01ProductName" : displayField,
			"s02ProductVersion" : displayField,
			"s03ProductSN" : displayField,
			"s04ProductKey" : textareaField,
			"s05ProductLicenses" : displayField,
			"s06ServiceLimit" : displayField,
			"s07SmsMessages" : displayField,
			"s10ApplicationPath" : displayField
		},
		propertyNames : {
	        "s01ProductName": '<b>产品名称</b> （<FONT color=red>只读</FONT>）',
        	"s02ProductVersion" : '<b>产品版本</b> （<FONT color=red>只读</FONT>）',
	        "s03ProductSN": '<b>产品序列号</b> （<FONT color=red>只读</FONT>）',
	        "s04ProductKey": '<b>产品注册码</b> （<FONT color=red>只读</FONT>）',
			"s05ProductLicenses" : '<b>许可用户数</b> （<FONT color=red>只读</FONT>）',
			"s06ServiceLimit" : '<b>服务期限</b> （<FONT color=red>只读</FONT>）',
			"s07SmsMessages" : '<b>剩余短信量</b> （<FONT color=red>只读</FONT>）',
	        "s10ApplicationPath": "<b>系统运行路径</b> （<FONT color=red>只读</FONT>）",
	        "s11ApplicationTitle" : '<font color=blue>应用标题</font>',
	        "s12ApplicationUrl" : '<font color=blue>应用访问路径</font>'
		}
	});

	grid.on('propertychange', function(source, id, v, oldValue){
		var index = grid.getStore().find('name', id);
		if(index >=0){
			grid.getStore().getAt(index).markDirty();
		}
	});
	grid.getColumnModel().setColumnWidth(0, 20);

	panel.submit = function(){
		var isDirty = false
		var values = {};
		for(var i=0;i<grid.getStore().getCount();i++){
			var record = grid.getStore().getAt(i);
			if(record.dirty){
				values[record.get('name')] = record.get('value');
				isDirty = true;
			}
		}
		if(isDirty){
			AdminAppDirect.setConfigration(values, function(result, e){
				if(result && result.success){
					panel.refresh();
				}
			});
		}
	}
	
	panel.refresh = function(){
		AdminAppDirect.getConfigration(function(result, e){
			if(result && result.success){
				grid.setSource(result.configration);
			}else{
				MixkyApp.showErrorMessage('保存数据出现错误！', '错误提示');
			}
		});
	}
	panel.add(grid);
	panel.doLayout();
});
</script>