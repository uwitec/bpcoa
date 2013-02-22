<%@ page contentType="text/html; charset=utf-8"%>
<%
	String id = request.getParameter("id");
	String key = request.getParameter("key");
	String mclass = request.getParameter("mclass");
%>
<script language='javascript'>
Ext.onReady(function(){
	var id = '<%=id%>';
	var key = '<%=key%>';
	var mclass = '<%=mclass%>';
	
	var panel = Ext.getCmp(id);
	if(panel.title){
		panel.setTitle('对象属性');
	}
	// 获得对象的属性列表
	var module = Mixky.designtool.Class.getModule(mclass);
	var mstore = [];
	if(module.properties){
		for(var i=0;i<module.properties.length;i++){
			var p = module.properties[i];
			if(Ext.isDefined(p.xconfig) && p.xconfig.selectInParent){
				p.xconfig.parentKey = key;
			}
			mstore.push([p.name, '', p.text, '1-extend-attribute', p.xeditor, p.xconfig, p.note]);
		}
	}
	for(var i=0;i<Mixky.designtool.Class.defaultProperties.length;i++){
		var p = Mixky.designtool.Class.defaultProperties[i];
		mstore.push([p.name, '', p.text, '0-public-attribute', p.xeditor, p.xconfig, p.note]);
	}
	// 属性编辑窗口
	var pgrid = new Ext.mixky.PropertyGrid({
		region : 'center',
		xtype : 'mixkypropertygrid',
		properties : mstore,
		showPropertyNote : function(record){
			var readonly = '';
			if(record.get("editor") == 'readonly' || record.get("editor") == 'none' ){
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
				commit[record.get("name")] = record.get("value");
			}
			DesignToolDirect.saveObject(pgrid.key, commit, function(result, e){
				pgrid.propStore.loadObjectData(result.object);
				pgrid.getStore().commitChanges();
				Mixky.designtool.Framework.contentPanel.savePanelOver(panel, needSaveNext);
			});
		}else{
			Mixky.designtool.Framework.contentPanel.savePanelOver(panel, needSaveNext);
		}
	};
	// 重新装载属性数据
	panel.loadPropertiesData = function(){
		DesignToolDirect.loadObject(key, function(result, e){
			if(result.success){
				pgrid.propStore.loadObjectData(result.object);
				pgrid.key = result.object.key;
				return;
			}
		});
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
	panel.loadPropertiesData();
});
</script>