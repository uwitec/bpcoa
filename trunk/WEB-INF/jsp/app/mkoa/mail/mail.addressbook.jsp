<%@ page contentType="text/html; charset=utf-8"%>
<%
	String panelid = request.getParameter("panelid");
%>
<script language='javascript'>
Ext.onReady(function(){
	var panel = Ext.getCmp('<%=panelid%>');

	var selectBox = new Ext.form.TextArea({
		anchor : '100% 100%'
	});

	var tree = new Ext.tree.TreePanel({
		region : 'west',
		width : 200,
		minSize : 120,
		maxSize : 350,
        split :true,
    	autoScroll:true,
    	rootVisible :false,
    	root: {
       		id : 'root-0',
            text: '地址簿',
            children : [{
                id : 'organization-0',
                text : '青海分公司组织结构'
            },{
                id : 'private-0',
                text : '个人通讯录'
            },{
                id : 'public-0',
                text : '公共通讯录'
            },{
                id : 'share-0',
                text : '共享通讯录'
            }]
        },
	    loader: new Ext.tree.TreeLoader({
	        directFn: AppMailDirect.getAddressBookTree,
	    	preloadChildren : true
	    })
	});

	var grid = new Ext.grid.GridPanel({
		region : 'center',
        split :true,
		enableHdMenu:false,
		enableColumnMove:false,
    	autoScroll:true,
		autoExpandColumn:'email',
		store : new Ext.data.DirectStore({
			directFn : AppMailDirect.getAddressBookList,
			paramOrder:['key'],
			baseParams : {
				key : 'root-0'
			},
			root : 'results',
			totalProperty : 'totals',
			idProperty : 'key',
			fields:[
				{name:'key',mapping:'key'},
			    {name:'name',mapping:'name'},
			    {name:'email',mapping:'email'}
			]
		}),
		columns : [new Ext.grid.RowNumberer(),{
			id:'name',
			dataIndex:'name',
			header:'姓名',
			width:60
		},{
			id:'email',
			dataIndex:'email',
			header:'邮件地址'
		}]
	});

	var selectedbox = new Ext.Panel({
		region : 'south',
        split :true,
        height : 100,
		layout : 'fit',
		items : selectBox
	});

	tree.getSelectionModel().on('selectionchange', function(sm, node){
		if(!node){
			return;
		}
		grid.getStore().baseParams.key = node.id;
		grid.getStore().reload();
	});
	tree.on("dblclick",function(node,e){
		AppMailDirect.getAllMailAddressFromDeptId(node.id,function(result, a){
			if(result){
				if(result.totals > 0){
					var v = selectBox.getValue();
					var nv = result.results;
					if(Ext.isDefined(v) && v != ''){
						if(v.indexOf(nv) >= 0){
							return;
						}
					}
					selectBox.setValue(v + nv);
				}
			}
		});
	});
	// 双击用户列表
	grid.on('rowdblclick', function(g, index, e){
		var record = g.getSelectionModel().getSelected();
		if (!record.get("email") || record.get("email") == '' || record.get("email").indexOf('@') == -1) {
			return;
		}
		
		var v = selectBox.getValue();
		var nv = '"' + record.get("name") + '"<' + record.get("email") + ">,";
		
		if(Ext.isDefined(v) && v != ''){
			if(v.indexOf(nv) >= 0){
				return;
			}
		}
		selectBox.setValue(v + nv);
	});

	panel.confirmSelected = function(){
		panel.addressField.setValue(selectBox.getValue());
	}
	
	// 界面
	var ui = new Ext.Panel({
		layout:'border',
		border : false,
		defaults : {border:false},
		items:[tree, grid, selectedbox]
	});

	panel.add(ui);
	panel.doLayout();
	selectBox.setValue(panel.addressField.getValue());
	
});
</script>