
//=================================================================
//	ÎÄ¼þÃû£ºmixky.flow.action.js
//=================================================================

Ext.namespace("Mixky.workflow");

Mixky.workflow.ACTION_REQUEST = 0;
Mixky.workflow.ACTION_COMPLETE = 1;
Mixky.workflow.ACTION_READCOMPLETE = 2;
Mixky.workflow.ACTION_ASSISTCOMPLETE = 3;
Mixky.workflow.ACTION_RETURN = 4;
Mixky.workflow.ACTION_TAKEBACK = 5;
Mixky.workflow.ACTION_ABORT = 6;
Mixky.workflow.ACTION_ARCHIVE = 7;
Mixky.workflow.ACTION_OPINION = 8;
Mixky.workflow.ACTION_RESUME = 9;
Mixky.workflow.ACTION_FORWARD = 10;

Mixky.workflow.FlowAction = function(doc, actiontype, config){
	
	var doHandler = function(){
		if(actiontype == Mixky.workflow.ACTION_OPINION){
			Mixky.workflow.OpinionWindow(doc.documentkey, doc.documentid, {objectkey:null});
		}else{
			Mixky.workflow.StepWindow(doc.documentkey, doc.documentid, actiontype);
		}
	}
	var handler = function(){
		// å¤æ­æ¯å¦éè¦æäº¤è¡¨å
		switch(actiontype){
		case Mixky.workflow.ACTION_COMPLETE:
		case Mixky.workflow.ACTION_READCOMPLETE:
		case Mixky.workflow.ACTION_ASSISTCOMPLETE:
			doc.submitDocument(doHandler);
			break;
		default:
			doHandler();
			break;
		}
	}
	
	var defaultConfig = {
		minWidth : 50, 
		iconAlign : 'top', 
		handler : handler
	};
	
	// è®¾ç½®æé®æå­åå¾æ 
	switch(actiontype){
	case Mixky.workflow.ACTION_COMPLETE:
		defaultConfig.text = 'åçå®æ¯';
		defaultConfig.iconCls = 'icon-sys-flow-processover';
		break;
	case Mixky.workflow.ACTION_READCOMPLETE:
		defaultConfig.text = 'éè¯»å®æ¯';
		defaultConfig.iconCls = 'icon-sys-flow-readover';
		break;
	case Mixky.workflow.ACTION_ASSISTCOMPLETE:
		defaultConfig.text = 'ååå®æ¯';
		defaultConfig.iconCls = 'icon-sys-flow-assistover';
		break;
	case Mixky.workflow.ACTION_RETURN:
		defaultConfig.text = 'éå';
		defaultConfig.iconCls = 'icon-sys-flow-turnback';
		break;
	case Mixky.workflow.ACTION_TAKEBACK:
		defaultConfig.text = 'æ¿å';
		defaultConfig.iconCls = 'icon-sys-flow-takeback';
		break;
	case Mixky.workflow.ACTION_REQUEST:
		defaultConfig.text = 'ç³è¯·åç';
		defaultConfig.iconCls = 'icon-sys-flow-request';
		break;
	case Mixky.workflow.ACTION_ABORT:
		defaultConfig.text = 'æ¤éåç';
		defaultConfig.iconCls = 'icon-sys-flow-stop';
		break;
	case Mixky.workflow.ACTION_ARCHIVE:
		defaultConfig.text = 'å½æ¡£';
		defaultConfig.iconCls = 'icon-sys-flow-archive';
		break;
	case Mixky.workflow.ACTION_OPINION:
		defaultConfig.text = 'å¡«åæè§';
		defaultConfig.iconCls = 'icon-sys-flow-opinion';
		break;
	case Mixky.workflow.ACTION_RESUME:
		defaultConfig.text = 'æ¢å¤åç';
		defaultConfig.iconCls = 'icon-sys-flow-resume';
		break;
	case Mixky.workflow.ACTION_FORWARD:
		defaultConfig.text = 'è½¬ç§»åç';
		defaultConfig.iconCls = 'icon-sys-flow-forward';
		break;
	}
	
	return new Ext.Action(Ext.apply(defaultConfig, config));
}
//=================================================================
//	ÎÄ¼þÃû£ºmixky.flow.opinionwindow.js
//=================================================================

Ext.namespace("Mixky.workflow");

Mixky.workflow.OpinionWindow = function(documentkey, documentid, config){
		
	this.documentkey = documentkey;
	
	this.documentid = documentid;
	
	var opinionWin = this;
	
	// æé®
	var confirmAction = new Ext.Action({
		text : 'å¡«åå®æ¯',
		iconCls : 'icon-app-confirm',
		handler : function(){
			if(!textarea.isValid()){
				MixkyApp.showErrorMessage("è¡¨åæ°æ®å¡«åéæ³ï¼ä¿å­å¤±è´¥");
				return;
			}
			opinionWin.submit();
		}
	});
	var cancelAction = new Ext.Action({
		text : 'åæ¶',
		iconCls : 'icon-app-cancel',
		handler : function(){
			opinionWin.window.close();
		}
	});
	var textarea = new Ext.form.TextArea({
		maxLength: 240,
        hideLabel: true
    });
	// æä½çªå£
	this.window = new Ext.Window({
		title : 'æµç¨æè§å¡«å',
		manager : MixkyApp.desktop.getManager(),
		width : 350,
		height : 300,
        layout: 'fit',
        iconCls : 'icon-app-flow-opinion',
		modal : true,
		border : false,
        maximizable : false,
        minimizable : false,
        animCollapse :false,
        resizable :false,
		items : textarea,
		bbar : ['->', confirmAction, '-', cancelAction]
	});
	// æäº¤è¡¨å
	this.submit = function(){
		// è·å¾å·²è¾å¥æè§
		FlowAppDirect.setOpinion(documentkey, documentid, textarea.getValue(), config.objectkey, function(result, e){
			if(result && result.success){
				opinionWin.window.close();
				MixkyApp.showInfoMessage('æè§ä¿å­æå!', result, e);
				if (config.objectid) {
					Ext.getCmp(config.objectid).loadValue();
				}
			}else{
				MixkyApp.showDirectActionFail('æäº¤æè§', result, e);
			}
		});
	}
	// è·å¾å·²è¾å¥æè§
	FlowAppDirect.getOpinion(documentkey, documentid, config.objectkey, function(result, e){
		if(result && result.success){
			textarea.setValue(result.opinion);
		}else{
			MixkyApp.showDirectActionFail('è·åæè§', result, e);
		}
	});

	this.window.show();
	this.window.toFront();
};
//=================================================================
//	ÎÄ¼þÃû£ºmixky.flow.stepwindow.js
//=================================================================

Ext.namespace("Mixky.workflow");

Mixky.workflow.STEP_ERROR = -1;
Mixky.workflow.STEP_PREPARE = 0;
Mixky.workflow.STEP_NODESELECT = 1;
Mixky.workflow.STEP_USERSELECT = 2;
Mixky.workflow.STEP_CONFIRM = 3;
Mixky.workflow.STEP_NOTICE = 4;
Mixky.workflow.STEP_SUCCESS = 5;

Mixky.workflow.OPERATION_NONE = 0;
Mixky.workflow.OPERATION_PRE = 1;
Mixky.workflow.OPERATION_NEXT = 2;
Mixky.workflow.OPERATION_COMPLETE = 3;
Mixky.workflow.OPERATION_CANCEL = 4;

Mixky.workflow.StepWindow = function(documentkey, documentid, actiontype, config){
	
	this.actiontype = actiontype;
	
	this.documentkey = documentkey;
	
	this.documentid = documentid;
	
	this.operation = Mixky.workflow.OPERATION_NONE;
	
	this.step = 0;
	
	var stepWin = this;
	
	this.onSuccess = function(){
		this.window.close();
		MixkyApp.desktop.closeDocument(documentkey, documentid);
	}
	
	// æé®
	var previousAction = new Ext.Action({
		text : 'ä¸ä¸æ­¥',
		iconCls : 'icon-sys-previous',
		handler : function(){
			stepWin.operation = Mixky.workflow.OPERATION_PRE;
			stepWin.submit();
		}
	});
	var nextAction = new Ext.Action({
		text : 'ä¸ä¸æ­¥',
		iconCls : 'icon-sys-next',
		handler : function(){
			stepWin.operation = Mixky.workflow.OPERATION_NEXT;
			stepWin.submit();
		}
	});
	var completeAction = new Ext.Action({
		text : 'å®æ',
		iconCls : 'icon-sys-confirm',
		handler : function(){
			stepWin.operation = Mixky.workflow.OPERATION_COMPLETE;
			stepWin.submit();
		}
	});
	var cancelAction = new Ext.Action({
		text : 'åæ¶',
		iconCls : 'icon-sys-cancel',
		handler : function(){
			stepWin.operation = Mixky.workflow.OPERATION_CANCEL;
			stepWin.submit();
			stepWin.window.close();
		}
	});
	// æä½åº
	this.panel = new Ext.Panel({
        layout: 'fit',
		padding : 10,
		beforeSubmit : Ext.emptyFn
	});
	this.panel.setpWindow = this;
	// æä½çªå£
	this.window = new Ext.Window({
		title : 'æµç¨åçåå¯¼',
		manager : MixkyApp.desktop.getManager(),
		width : 400,
		height : 350,
        layout: 'fit',
        iconCls : 'icon-sys-flow-guide',
		modal : true,
		border : false,
        closeable : false,
        maximizable : false,
        minimizable : false,
        animCollapse :false,
        resizable :false,
		items : this.panel,
		bbar : [previousAction, '-', nextAction, '->', completeAction, '-', cancelAction]
	});
	this.setFlowTitle = function(title){
		this.window.setTitle('æµç¨åçåå¯¼ ââ ' + title);
	}
	// éèæé®
	this.hideButtons = function(){
		nextAction.disable();
		previousAction.disable();
		completeAction.disable();
		cancelAction.disable();
	}
	// æ¾ç¤ºæé®
	this.showButtons = function(showPrevious, showNext){
		cancelAction.enable();
		if(this.step != Mixky.workflow.STEP_ERROR){
			if(this.step == Mixky.workflow.STEP_CONFIRM){
				completeAction.enable();
			}
			if(this.step > 1 && showPrevious){
				previousAction.enable();
			}
			if(this.step < Mixky.workflow.STEP_CONFIRM && showNext){
				nextAction.enable();
			}
		}
	}
	// æäº¤è¡¨å
	this.submit = function(){
		var params = {
			panelid : this.panel.id,
			documentkey : this.documentkey,
			documentid : this.documentid,
			actiontype : this.actiontype,
			operation : this.operation,
			step : this.step
		}
		if(this.step == Mixky.workflow.STEP_ABORT || this.panel.beforeSubmit(params) !== false){
			this.hideButtons();
			this.panel.removeAll();
			this.panel.load({
				url : 'framework/engine/workflow/flow.do',
				params : params,
				timeout: 60,
				text: "æ­£å¨ä¸æå¡å¨äº¤äºï¼è¯·ç¨å...",
				scripts: true
			});
		}
	}
	
	this.window.show();
	this.window.toFront();
	this.submit();
};