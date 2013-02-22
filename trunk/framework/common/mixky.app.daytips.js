
Ext.namespace("Mixky.app.common");

Mixky.app.common.ShowDayTips = function(){
	
	var tipPanel = new Ext.Panel({
		region : 'center',
		padding : 10,
		bodyStyle : 'font-size:10pt',
		border : false
	})
	
    var win = new Ext.Window({
        title : '每日提示',
        width :400,
        height :200,
        iconCls : 'icon-app-mkoa-daytips',
        shim : false,
        maximizable : false,
        minimizable : false,
        animCollapse :false,
        resizable :false,
		layout : 'fit',
		modal : true,
        items : new Ext.Panel({
        	layout : 'border',
        	border : false,
        	items : [{
        		region : 'west',
        		frame : false,
        		width : 68,
        		bodyStyle : 'color:blue;background:white url(resources/images/icon/app/mkoa/daytips48.gif) no-repeat;background-position:10px 15px;',
        		border : false,
        		html : '<BR><BR><BR><BR><BR>　 点滴汇集<BR><BR>　 聚川纳海'
        	}, tipPanel],
        	bbar: ['启动时隐藏　', new Ext.form.Checkbox({
        		checked : MixkyApp.userConfig.hideDayTips,
        		listeners : {
        			'check' : function(field, checked){
		    			AdminAppDirect.setHideDayTips(checked, function(result, e){
		    				if(result && result.success){
		    					MixkyApp.userConfig.hideDayTips = checked;
		    				}
		    			});
		        	}
	        	}
        	}), '->',{
    			text: '上一条',
    			iconCls : 'icon-sys-previous',
    			handler : function(){
        			var index = MixkyApp.userConfig.dayTipsIndex - 1;
        			if(index > 0){
        				win.loadDayTips(index);
        			}else{
        				MixkyApp.showInfoMessage('当前显示为第一条提示，无法执行上一条！');
        			}
	        	}
    		}, {
    			text: '下一条',
    			iconCls : 'icon-sys-next',
    			handler : function(){
	    			var index = MixkyApp.userConfig.dayTipsIndex + 1;
					win.loadDayTips(index);
    			}
    		}, '-', {
    			text : '关闭',
    			iconCls : 'icon-sys-close',
    			handler: function(){
    				win.close();
            	}
    		}]
        }),
        loadDayTips : function(index){
    		if(!index){
    			index = 0;
    		}
			AdminAppDirect.getDayTipByIndex(index, function(result, e){
				if(result && result.success){
					MixkyApp.userConfig.dayTipsIndex = result.index;
					tipPanel.body.dom.innerHTML = '　　' + result.tip;
				}
			});
	    }
    });
    win.show();
    win.loadDayTips(MixkyApp.userConfig.dayTipsIndex + 1);
}