<%@ page contentType="text/html; charset=utf-8"%>
<%
	String id = request.getParameter("id");
%>
<script language='javascript'>
Ext.onReady(function(){
	var id = '<%=id%>';
	var panel = Ext.getCmp(id);

	// 获得对象的属性列表
	var module = Mixky.designtool.Class.getModule("propertygrid");
	var mstore = [];
	for(var i=0;i<module.properties.length;i++){
		var p = module.properties[i];
		if(p.xconfig && p.xconfig.selectInParent){
			p.xconfig.parentKey = 'a';
		}
		mstore.push([p.name, '', p.text, '', p.xeditor, p.xconfig, p.note]);
	}
	// 属性编辑窗口
	var pgrid = new Ext.mixky.PropertyGrid({
		region : 'center',
		xtype : 'mixkypropertygrid',
		properties : mstore,
		showPropertyNote : function(record){
			var readonly = '';
			if(record.get("editor") == 'readonly'){
				readonly = '，<font color=red>只读</font>';
			}
			npanel.body.update('<B>'+record.get("caption")+' ('+record.get("name")+')</B>' + readonly + '<BR><BR>'+record.get("note"));
		}
	});
	// 信息提示窗口
	var npanel = new Ext.Panel({
		region : 'south',
		split : true,
		collapsible : true,
        collapseMode:'mini',
		height : 100,
		bodyStyle:'background-color:lightyellow;padding:8px;font-size:12px'
	});
	var ui = {
		layout : 'border',
		border : false,
		defaults : {border:false},
		items : [pgrid, npanel]
	};
	// 保存属性修改
	panel.save = function(needSaveNext){
		var store = pgrid.getStore();
		var modifieds = store.getModifiedRecords();
		if(modifieds.length > 0){
			var commit = {};
			for(var i=0;i<modifieds.length;i++){
				var record = modifieds[i];
				if(record.get("editor") == 'object' || record.get("editor") == 'designobject'){
					commit[record.get("name")] = Ext.decode(record.get("value"));
				}else{
					commit[record.get("name")] = record.get("value");
				}
			}
		}else{
			Mixky.designtool.Framework.contentPanel.savePanelOver(panel, needSaveNext);
		}
	};
	// 重新装载属性数据
	panel.loadPropertiesData = function(){
	};
	// 刷新属性窗口
	panel.refresh = function(){
		var store = pgrid.getStore();
		var modifieds = store.getModifiedRecords();
		if(modifieds.length > 0){
			Ext.MessageBox.confirm('操作提示', '刷新操作将放弃尚未保存的修改，您确定吗？', function(btn){
				if(btn == 'yes'){
					panel.loadPropertiesData();
				}
			});
		}else{
			panel.loadPropertiesData();
		}
	};
	panel.add(ui);
	panel.doLayout();
	for(var i=0;i<module.properties.length;i++){
		var p = module.properties[i];
		pgrid.propStore.setValue(p.name, p.value);
	}
	pgrid.propStore.store.commitChanges();
});
</script>