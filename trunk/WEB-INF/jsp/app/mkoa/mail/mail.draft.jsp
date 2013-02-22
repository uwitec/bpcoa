<%@page import="com.mixky.engine.organization.User"%>
<%@page import="com.mixky.system.ContextHolder"%>
<%@ page contentType="text/html; charset=utf-8"%>
<%
	String panelid = request.getParameter("panelid");
	String id = (request.getParameter("id") == null ||  request.getParameter("id").trim().length() == 0) ? "0" : request.getParameter("id");
	String loadType = request.getParameter("loadType");
	User user = ContextHolder.instance().getUserCertification().getUserInfo(request);
%>
<script language='javascript'>
Ext.onReady(function(){
	var panel = Ext.getCmp('<%=panelid%>');
	var contendId = Ext.id();
	var task = new Ext.util.DelayedTask(function(){
		mailForm.getForm().findField('F_CONTENT').toggleSourceEdit(true);
	});
	var mailcontent = '';
	DocumentAppDirect.getClobContext('T_MK_APP_MAIL', 'F_CONTENT', <%=id%>, function(result, e){
		
		if(result && result.success){
			/* document.getElementById("ggcontent").value=result.context; */
			/* Ext.MessageBox.alert("提示",result.context);  */
			//htmlEditor.html(result.context);
			mailcontent = result.context;
		}else{
			MixkyApp.showDirectActionFail("获得文本内容失败", result, e);
		}
	});
	var mailForm = new Ext.form.FormPanel({
		border : false,
		//style : 'margin : 15px',
		bodyStyle : 'padding:15px;padding-right:25px;',
		labelWidth : 70,
		fileUpload : true,
		paramOrder : ['id', 'loadType'],
		baseParams : {id : <%=id%>, loadType: '<%=loadType%>'},
		api : {
			load : AppMailDirect.loadDraft,
			submit : AppMailDirect.submitDraft
		},
		tbar : [{
			text : '发送',
			iconCls : 'icon-app-mkoa-sent',
			handler: function() {
				mailForm.getForm().findField('F_BoxType').setValue('发件箱');
	            var iframeId = "kindeditor_<%=panelid%>";
				
				var content = KE.app.getEditor('contentCn'+contendId).html();
				mailForm.getForm().findField('F_CONTENT_TEXT').setValue(content);
				//alert(content);
				mailForm.getForm().findField('F_CONTENT').setValue(content);
				//alert(content);
				//mailForm.getForm().findField('F_CONTENT_TEXT').setValue(mailForm.getForm().findField('F_CONTENT').getEditorBody().innerText);
				mailForm.getForm().submit({
					success : function(f, a){
						if (a.result.success) {
							MixkyApp.showInfoMessage('邮件已发送成功！', '信息提示');
							var tabpanel = panel.findParentByType('tabpanel');
							tabpanel.remove(panel);
						} else {
							mailForm.getForm().findField('ID').setValue(a.result.data.ID);
							MixkyApp.showInfoMessage(a.result.msg, '信息提示');
						}
					},
					failure : function(f, a){
						if (a.failureType == Ext.form.Action.SERVER_INVALID) {
							mailForm.getForm().findField('ID').setValue(a.result.data.ID);
						}
						
						MixkyApp.showFormActionFail(f, a);
					}
				});
			}
		},'-',{
			text : '存为草稿',
			iconCls : 'icon-sys-save',
			handler : function(){
				mailForm.getForm().findField('F_BoxType').setValue('草稿箱');
	            var iframeId = "kindeditor_<%=panelid%>";
	            var content = KE.app.getEditor('contentCn'+contendId).html();
				mailForm.getForm().findField('F_CONTENT_TEXT').setValue(content);
				mailForm.getForm().findField('F_CONTENT').setValue(content);
				mailForm.getForm().submit({
					success : function(f,a){
						mailForm.getForm().findField('ID').setValue(a.result.data.ID);
						MixkyApp.showInfoMessage('邮件已保存到草稿箱！', '信息提示');
					},
					failure : function(f, a){
						MixkyApp.showFormActionFail(f, a);
					}
				});
			}
		},'-',{
			text : '舍弃',
			iconCls : 'icon-sys-delete',
			handler : function(){
				var tabpanel = panel.findParentByType('tabpanel');
				tabpanel.remove(panel);
			}
		},
		'->'
		],
		defaults : {
			border : false
		},
		items : [{
			fieldLabel : '<A href=#>收件人</A>',
			name : 'TO',
			xtype : 'mixkyemailaddress',
			anchor : '100%',
			listWidth : 300,
			allowBlank: false,
			directFn : AppMailDirect.queryEmailAddress,
			listeners : {
				'afterrender' : function(f){
					f.label.on('click', function(){
						panel.showAddressBook('TO');
						return false;
					})
				}
			}
		},{
			fieldLabel : '',
			bodyStyle : 'padding-left:75px;padding-bottom:5px;',
			html : '',
			listeners : {
				'afterrender' : function(f){
					mailForm.ccLink = this.body.createChild({tag:"a", href:'#', html:'添加抄送地址', style:'padding-right:20px;'});
					mailForm.bccLink = this.body.createChild({tag:"a", href:'#', html:'添加密送地址'});
					mailForm.ccLink.on('click',function(){
						mailForm.addCCAddressField();
						return false;
					});
					mailForm.bccLink.on('click',function(){
						mailForm.addBCCAddressField();
						return false;
					});
				}
			}
		},{
			xtype: 'hidden',
			anchor: '100%',
			name: 'F_ACCOUNT_ID'
		},{
			xtype: 'mixkydisplayfield',
			anchor: '100%',
			name: 'F_ACCOUNT_NAME',
			fieldLabel: '发件人',
			editable: false,
			disabled:true
		},{
			fieldLabel : 'ID',
			name : 'ID',
			xtype : 'hidden',
			value : <%=id%>
		},{
			fieldLabel : '存取标签',
			name : 'F_BoxType',
			xtype : 'hidden'
		},{
			fieldLabel : '邮件类型',
			name : 'F_MailType',
			xtype : 'hidden',
			value: 'html'
		},{
			fieldLabel : '邮件内容文本',
			name : 'F_CONTENT_TEXT',
			xtype : 'hidden',
			value: 'text'
		},{
			fieldLabel : '邮件内容文本',
			name : 'F_CONTENT',
			xtype : 'hidden',
			value: 'text'
		},{
			fieldLabel : '邮件内容文本',
			name : 'AttachmentInfos',
			xtype : 'hidden',
			value: ''
		},{
			fieldLabel : '标　题',
			anchor : '100%',
			name : 'F_SUBJECT',
			allowBlank: false,
			xtype : 'textfield'
		},{
			fieldLabel : '',
			style : 'padding-bottom:25px;',
			xtype : 'displayfield',
			name : 'Attachments',
			isFormField : true,
			isMulti : true,
			listeners : {
				'afterrender' : function(f){
					f.fileCount = 0;
					f.childrenObjects = [];
					f.buttonWrap = this.el.createChild({tag:"div",style:"position: absolute;"});
					f.button = new Ext.Button({
			            renderTo: f.buttonWrap,
			            text : '添 加 附 件',
			            iconCls : 'icon-sys-attachment'
			        });
			        f.bindFileField = function(fileField){
						fileField.on({
				            scope: this,
				            mouseenter: function() {
				                this.button.addClass(['x-btn-over','x-btn-focus'])
				            },
				            mouseleave: function(){
				                this.button.removeClass(['x-btn-over','x-btn-focus','x-btn-click'])
				            },
				            mousedown: function(){
				                this.button.addClass('x-btn-click')
				            },
				            mouseup: function(){
				                this.button.removeClass(['x-btn-over','x-btn-focus','x-btn-click'])
				            },
				            change: function(){
				                var v = this.fileField.dom.value;
								this.addFileDisplay(v, 0, this.fileField);
				            }
				        }); 
				    };
				    f.addFileDisplay = function(filename, fileId, fileField){
					    if(fileId > 0){
							// 从数据库中装入
							var wrap = this.el.createChild({tag:'div', style:'height: 22px;'});
							var downloadLink = wrap.createChild({tag:"a", href:'#', html:filename});
							wrap.insertHtml('beforeEnd','　');
							var deleteLink = wrap.createChild({tag:"a", href:'#', html:'删除'});
							deleteLink.on('click', function(){
								wrap.remove();
								this.fileCount--;
								this.adjustFieldTop();

								if (mailForm.getForm().findField('AttachmentInfos').getValue().length > 0) {
									var serverFiles = mailForm.getForm().findField('AttachmentInfos').getValue().split(';');
									var attInfos = '';
									for (var i = 0; i < serverFiles.length; i++) {
										if (attInfos != '') {
											attInfos = attInfos + ';';
										}
										if (i == fileId - 1) {
											attInfos = attInfos + ' ';
										} else {
											attInfos = attInfos + serverFiles[i];
										}
										
									}
									mailForm.getForm().findField('AttachmentInfos').setValue(attInfos);
								}
							}, this);
							this.fileCount++;
							this.adjustFieldTop();
							f.childrenObjects.push(wrap);
						}else{
							var wrap = this.el.createChild({tag:'div', html:filename + "　", style:'height: 22px;'});
							var deleteLink = wrap.createChild({tag:"a", href:'#', html:'删除'});
							deleteLink.on('click', function(){
								fileField.remove();
								wrap.remove();
								this.fileCount--;
								this.adjustFieldTop();
							}, this);
							f.childrenObjects.push(wrap);
							this.addFileField();
							fileField.setDisplayed('none');
						}
					};
					f.addFileField = function(){
						this.fileField = this.el.createChild({
				            name: this.name + '-' + this.fileCount,
				            style: 'position: absolute;-moz-opacity: 0;filter:alpha(opacity: 0);opacity: 0;z-index: 2; height: 22px;',
				            tag: 'input',
				            type: 'file',
				            size: 1
				        });
						mailForm.doLayout();
				        this.bindFileField(this.fileField);
						this.fileCount++;
						this.adjustFieldTop();
						f.childrenObjects.push(this.fileField);
					};
					f.adjustFieldTop = function(){
						var top = (this.fileCount - 1) * 22;
				        this.buttonWrap.setTop(top);
				        this.fileField.setTop(top);
					};
					f.addFileField();
					f.setValue = function(v){
						for(var i=0;i<this.childrenObjects.length;i++){
							this.childrenObjects[i].remove();
						}
						this.childrenObjects = [];
						this.fileCount = 0;
						this.addFileField();
						if(v instanceof Array){
							for(var i=0;i<v.length;i++){
								this.addFileDisplay(v[i].filename + ' (' + v[i].filesize + ')', v[i].id);
							}
						}
					}
				}
			}
		},{
			fieldLabel : '正　文',
			anchor : '100% -200',
			autoScroll : false,
			border : false,
			xtype:'textarea',  
			id:'contentCn'+contendId, 
			width:'100', 
			height:'11',	
			listeners:{
				'render':function(){
					KE.app.init({
						renderTo : "contentCn"+contendId,
						delayTime : 5,
						width : '100%',
						allowFileManager : true,
						fullscreenMode : false,
						uploadJson : 'plugin/kd/uoload.do',
						fileManagerJson : 'plugin/kd/filemgr.do',
						allowFileManager : true,
						readonlyMode : false,
						value:mailcontent
					});
				}
			}
		}]
	});
	
	// 添加主送域
	mailForm.addCCAddressField = function(){
		var field = this.insert(1, {
			fieldLabel : '<A href=#>抄　送</A>',
			name : 'CC',
			xtype : 'mixkyemailaddress',
			anchor : '100%',
			height : 50,
			listWidth : 300,
			directFn : AppMailDirect.queryEmailAddress,
			listeners : {
				'afterrender' : function(f){
					f.label.on('click', function(){
						panel.showAddressBook('CC');
						return false;
					})
				}
			}
		});
		this.isShowCCLink = true;
		this.ccLink.remove();
		this.doLayout();
		return field;
	}
	
	// 添加主送域
	mailForm.addCCAddressField = function(){
		var field = this.insert(1, {
			fieldLabel : '<A href=#>抄　送</A>',
			name : 'CC',
			xtype : 'mixkyemailaddress',
			anchor : '100%',
			height : 50,
			listWidth : 300,
			directFn : AppMailDirect.queryEmailAddress,
			listeners : {
				'afterrender' : function(f){
					f.label.on('click', function(){
						panel.showAddressBook('CC');
						return false;
					})
				}
			}
		});
		this.isShowCCLink = true;
		this.ccLink.remove();
		this.doLayout();
		return field;
	}
	// 添加密送域
	mailForm.addBCCAddressField = function(){
		var field = this.insert(Ext.isDefined(this.isShowCCLink) ? 2 : 1, {
			fieldLabel : '<A href=#>密　送</A>',
			name : 'BCC',
			xtype : 'mixkyemailaddress',
			anchor : '100%',
			height : 50,
			listWidth : 300,
			directFn : AppMailDirect.queryEmailAddress,
			listeners : {
				'afterrender' : function(f){
					f.label.on('click', function(){
						panel.showAddressBook('BCC');
						return false;
					})
				}
			}
		});
		this.bccLink.remove();
		this.doLayout();
		return field;
	}
	// 处理装载邮件信息时抄送和密送字段的显示问题
	mailForm.getForm().on('actioncomplete', function(form, action){
		if(action.type == 'directload' && action.result && action.result.success){
			if(Ext.isDefined(action.result.data.CC) && action.result.data.CC != ''){
				var field = form.findField('CC');
				if(!field){
					field = mailForm.addCCAddressField();
					field.setValue(action.result.data.CC);
				}
			}
			if(Ext.isDefined(action.result.data.BCC) && action.result.data.BCC != ''){
				var field = form.findField('BCC');
				if(!field){
					field = mailForm.addBCCAddressField();
					field.setValue(action.result.data.BCC);
				}
			}
			if(Ext.isDefined(action.result.data.F_CONTENT) && action.result.data.F_CONTENT != ''){
					KE.app.setValue('contentCn'+contendId,action.result.data.F_CONTENT);
			}
		}
	});

	// 显示地址簿
	panel.showAddressBook = function(fieldName){
		var field = mailForm.getForm().findField(fieldName);
		if(!Ext.isDefined(field)){return;}
		var addressPanel = new Ext.Panel({
			id : 'addressbook',
			layout : 'fit',
			autoLoad : {
				url : 'page.do',
				params : {url:'app/mkoa/mail/mail.addressbook', panelid : 'addressbook'},
				loadScripts : true,
				scripts	: true
			}
		});
		addressPanel.addressField = field;
		var addressBookWin = new Ext.Window({
	        modal: true,
	        title : '选择邮件地址',
	        iconCls : 'icon-app-mkoa-addressbook',
	        manager : MixkyApp.desktop.getManager(),
	        closeAction : 'hide',
	        layout:'fit',
	        width: 500,
	        height:500,
	        maximizable : false,
	        minimizable : false,
	        resizable: true,
	        items : addressPanel,
			buttons : [{
				text : '确定',
				iconCls : 'icon-sys-confirm',
				handler : function(){
					if(Ext.isDefined(addressPanel.confirmSelected)){
						addressPanel.confirmSelected();
					}
					addressBookWin.close();
				}
			}, {
				text : '取消',
				iconCls : 'icon-sys-cancel',
				handler : function(){
					addressBookWin.close();
				}
			}]
		});
		addressBookWin.show();
	}
	panel.add(mailForm);

	mailForm.getForm().load();
	
	panel.doLayout.defer(400, panel);
	
});
</script>