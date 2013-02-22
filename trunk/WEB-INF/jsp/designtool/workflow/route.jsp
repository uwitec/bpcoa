<%@ page contentType="text/html; charset=utf-8"%>
<%
	String id = request.getParameter("id");
%>
<script language='javascript'>
Ext.onReady(function(){
	var id = '<%=id%>';
	var mclass = 'route';
	
	var panel = Ext.getCmp(id);

	// 获得对象的属性列表
	var module = Mixky.designtool.Class.getModule(mclass);
	var mstore = [];
	if(module.properties){
		for(var i=0;i<module.properties.length;i++){
			var p = module.properties[i];
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
		captionWidth : 70,
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
	panel.save = function(){
		var store = pgrid.getStore();
		var modifieds = store.getModifiedRecords();
		if(modifieds.length > 0){
			var commit = {};
			for(var i=0;i<modifieds.length;i++){
				var record = modifieds[i];
				commit[record.get("name")] = record.get("value");
			}
			DesignToolDirect.saveObject(panel.key, commit, function(result, e){
				pgrid.propStore.loadObjectData(result.object);
				pgrid.getStore().commitChanges();
			});
		}
	};
	// 重新装载属性数据
	panel.loadPropertiesData = function(key){
		if(key){
			panel.key = key;
		}
		if(!panel.key){
			return;
		}
		DesignToolDirect.loadObject(panel.key, function(result, e){
			if(result.success){
				pgrid.propStore.loadObjectData(result.object);
				pgrid.key = result.object.key;
				return;
			}
		});
	};
	panel.add(ui);
	panel.doLayout();
	panel.loadPropertiesData();
});
</script>