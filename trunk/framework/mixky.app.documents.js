//=================================================================
//	系统自动生成文档属性，文档数量:[45]
//=================================================================


Mixky.app.Documents = {
	'mkCar.docCar' : {
		key : 'mkCar.docCar',
		name : 'docCar',
		title : '车辆管理',
		tablename : 'T_MK_APP_CAR',
		icon : 'icon-app-mkoa-car',
		config : {"width":700,"height":500},
		panels : {
			'mkCar.docCar.pCar' : {
				key : 'mkCar.docCar.pCar',
				title : '车辆信息',
				icon : 'icon-sys-info',
				type : '0',
				name : 'pCar'
			},
			'mkCar.docCar.pRecord' : {
				key : 'mkCar.docCar.pRecord',
				title : '运维记录',
				icon : 'icon-sys-list',
				type : '3',
				config : {"documentidParamName":"F_CAR_ID"},
				name : 'pRecord'
			}
		},
		buttons : {
			'mkCar.docCar.btnDelete' : {
				key : 'mkCar.docCar.btnDelete',
				text : '删除',
				icon : 'icon-sys-btndelete',
				handler : function(){					
	this.document.deleteDocument();					
},
				name : 'btnDelete'
			},
			'mkCar.docCar.btnSave' : {
				key : 'mkCar.docCar.btnSave',
				text : '保存',
				icon : 'icon-sys-btnsave',
				handler : function(){					
 var panel = this.document.items.get(0);					
 var form = panel.items.get(0).getForm();					
 form.findField("F_STATE").setValue("正式");					
 this.document.submitDocument();					
},
				name : 'btnSave'
			},
			'mkCar.docCar.btnConfirm' : {
				key : 'mkCar.docCar.btnConfirm',
				text : '确定',
				icon : 'icon-sys-btnconfirm',
				handler : function(){					
 var panel = this.document.items.get(0);					
 var form = panel.items.get(0).getForm();					
 form.findField("F_STATE").setValue("正式");					
	this.document.confirmDocument();					
},
				name : 'btnConfirm'
			}
		}
	}
,
	'mkTask.docTaskManage' : {
		key : 'mkTask.docTaskManage',
		name : 'docTaskManage',
		title : 'docTaskManage',
		panels : {

		},
		buttons : {

		}
	}
,
	'mkWorklog.docWorklog' : {
		key : 'mkWorklog.docWorklog',
		name : 'docWorklog',
		title : '工作日志',
		tablename : 'T_MK_APP_WORKLOG',
		icon : 'icon-app-mkoa-worklog',
		config : {"height":450,"width":500},
		panels : {
			'mkWorklog.docWorklog.pWorklog' : {
				key : 'mkWorklog.docWorklog.pWorklog',
				title : '日志内容',
				icon : 'null',
				type : '0',
				name : 'pWorklog'
			}
		},
		buttons : {
			'mkWorklog.docWorklog.btnDelete' : {
				key : 'mkWorklog.docWorklog.btnDelete',
				text : '删除',
				icon : 'icon-sys-btndelete',
				handler : function(){					
	this.document.deleteDocument();					
},
				name : 'btnDelete'
			},
			'mkWorklog.docWorklog.btnSave' : {
				key : 'mkWorklog.docWorklog.btnSave',
				text : '保存',
				icon : 'icon-sys-btnsave',
				handler : function(){					
	this.document.submitDocument();					
},
				name : 'btnSave'
			},
			'mkWorklog.docWorklog.btnConfirm' : {
				key : 'mkWorklog.docWorklog.btnConfirm',
				text : '确定',
				icon : 'icon-sys-btnconfirm',
				handler : function(){					
	this.document.confirmDocument();					
},
				name : 'btnConfirm'
			}
		}
	}
,
	'mkTest.docBook' : {
		key : 'mkTest.docBook',
		name : 'docBook',
		title : '图书信息',
		tablename : 'T_MK_APP_BOOK',
		config : {"width":550,"height":450},
		panels : {
			'mkTest.docBook.pInfo' : {
				key : 'mkTest.docBook.pInfo',
				title : '基本信息',
				type : '3',
				name : 'pInfo'
			}
		},
		buttons : {
			'mkTest.docBook.btnSave' : {
				key : 'mkTest.docBook.btnSave',
				text : '保存',
				icon : 'icon-sys-btnsave',
				handler : function(){					
this.document.submitDocument();					
},
				name : 'btnSave'
			},
			'mkTest.docBook.btnConfirm' : {
				key : 'mkTest.docBook.btnConfirm',
				text : '确定',
				icon : 'icon-sys-btnconfirm',
				handler : function(){					
	this.document.confirmDocument();					
},
				name : 'btnConfirm'
			}
		}
	}
,
	'mkRegulations.docRegulationsRead' : {
		key : 'mkRegulations.docRegulationsRead',
		name : 'docRegulationsRead',
		title : '规章制度',
		tablename : 'T_MK_APP_REGULATIONS',
		icon : 'icon-app-mkoa-regulations',
		config : {"height":600,"width":800},
		panels : {
			'mkRegulations.docRegulationsRead.pInfo' : {
				key : 'mkRegulations.docRegulationsRead.pInfo',
				title : '基本信息',
				icon : 'null',
				type : '0',
				name : 'pInfo'
			},
			'mkRegulations.docRegulationsRead.pFile' : {
				key : 'mkRegulations.docRegulationsRead.pFile',
				title : '文件浏览',
				icon : 'null',
				type : '99',
				name : 'pFile'
			}
		},
		buttons : {

		}
	}
,
	'mkFinance.docFinanceBeleg' : {
		key : 'mkFinance.docFinanceBeleg',
		name : 'docFinanceBeleg',
		title : '财务记账单据',
		tablename : 'T_MK_APP_FINANCE_BELEG',
		icon : 'icon-app-mkoa-finance ',
		config : {"width":650},
		panels : {
			'mkFinance.docFinanceBeleg.pFinanceBelegMain' : {
				key : 'mkFinance.docFinanceBeleg.pFinanceBelegMain',
				title : '基本信息',
				icon : 'icon-sys-info',
				type : '0',
				name : 'pFinanceBelegMain'
			},
			'mkFinance.docFinanceBeleg.pFinanceBelegDetail' : {
				key : 'mkFinance.docFinanceBeleg.pFinanceBelegDetail',
				title : '单据明细',
				icon : 'icon-sys-list',
				type : '3',
				config : {"documentidParamName":"F_BELEGE_ID","orderable":true},
				name : 'pFinanceBelegDetail'
			},
			'mkFinance.docFinanceBeleg.pFinanceBelegCashier' : {
				key : 'mkFinance.docFinanceBeleg.pFinanceBelegCashier',
				title : '会计/出纳办理',
				icon : 'icon-sys-function',
				type : '0',
				name : 'pFinanceBelegCashier'
			}
		},
		buttons : {
			'mkFinance.docFinanceBeleg.btnDelete' : {
				key : 'mkFinance.docFinanceBeleg.btnDelete',
				text : '删除',
				icon : 'icon-sys-delete',
				handler : function(){					
	this.document.deleteDocument();					
},
				name : 'btnDelete'
			},
			'mkFinance.docFinanceBeleg.btnSave' : {
				key : 'mkFinance.docFinanceBeleg.btnSave',
				text : '保存',
				icon : 'icon-sys-btnsave',
				handler : function(){					
	this.document.submitDocument();					
},
				name : 'btnSave'
			},
			'mkFinance.docFinanceBeleg.btnConfirm' : {
				key : 'mkFinance.docFinanceBeleg.btnConfirm',
				text : '提交审核',
				icon : 'icon-sys-btnsubmit',
				handler : function(){					
	var form = this.document.items.get(0).items.get(0).getForm();					
	var stateField = form.findField("F_STATE");					
	stateField.setValue('审核');					
	this.document.confirmDocument();					
},
				name : 'btnConfirm'
			},
			'mkFinance.docFinanceBeleg.btnAudit' : {
				key : 'mkFinance.docFinanceBeleg.btnAudit',
				text : '审核通过',
				icon : 'icon-sys-btnsubmit',
				handler : function(){					
	var form = this.document.items.get(0).items.get(0).getForm();					
	var stateField = form.findField("F_STATE");					
	stateField.setValue('出纳');					
	this.document.confirmDocument();					
},
				name : 'btnAudit'
			},
			'mkFinance.docFinanceBeleg.btnAuditBack' : {
				key : 'mkFinance.docFinanceBeleg.btnAuditBack',
				text : '退回修改',
				icon : 'icon-sys-return',
				handler : function(){					
	var form = this.document.items.get(0).items.get(0).getForm();					
	var stateField = form.findField("F_STATE");					
	stateField.setValue('修改');					
	this.document.confirmDocument();					
},
				name : 'btnAuditBack'
			},
			'mkFinance.docFinanceBeleg.btnCasheierOver' : {
				key : 'mkFinance.docFinanceBeleg.btnCasheierOver',
				text : '办理完毕',
				icon : 'icon-sys-btnsubmit',
				handler : function(){					
	if(!Ext.isDefined(this.document.items.get(2).items)){					
		MixkyApp.showErrorMessage("未打开出纳办理标签！");					
		this.document.setActiveTab(2);					
		return;					
	}					
	var form = this.document.items.get(2).items.get(0).getForm();					
	var stateField = form.findField("F_STATE");					
	stateField.setValue('结束');					
	this.document.confirmDocument();					
},
				name : 'btnCasheierOver'
			}
		}
	}
,
	'mkForum.docReSubject' : {
		key : 'mkForum.docReSubject',
		name : 'docReSubjct',
		title : '回复话题',
		tablename : 'T_MK_APP_FORUM_SUBJECT',
		icon : 'icon-app-mkoa-forum-addtopic',
		config : {"maximizable":true,"width":750,"height":600},
		panels : {
			'mkForum.docReSubject.pReSubject' : {
				key : 'mkForum.docReSubject.pReSubject',
				title : '贴子回复',
				icon : 'null',
				type : '0',
				name : 'pReSubject'
			}
		},
		buttons : {
			'mkForum.docReSubject.btnConfirm' : {
				key : 'mkForum.docReSubject.btnConfirm',
				text : '确定',
				icon : 'icon-sys-btnconfirm',
				handler : function(){					
	this.document.confirmDocument();					
},
				name : 'btnConfirm'
			}
		}
	}
,
	'mkOfficeUse.docOfficeUseDic' : {
		key : 'mkOfficeUse.docOfficeUseDic',
		name : 'docOfficeUseDic',
		title : '物品字典',
		tablename : 'T_MK_APP_OFFICEUSE_DIC',
		icon : 'icon-sys-dictionarydata',
		config : {"width":500,"height":400},
		panels : {
			'mkOfficeUse.docOfficeUseDic.pOfficeUseDic' : {
				key : 'mkOfficeUse.docOfficeUseDic.pOfficeUseDic',
				title : '物品字典',
				icon : 'icon-sys-info',
				type : '0',
				name : 'pOfficeUseDic'
			}
		},
		buttons : {
			'mkOfficeUse.docOfficeUseDic.btnDelete' : {
				key : 'mkOfficeUse.docOfficeUseDic.btnDelete',
				text : '删除',
				icon : 'icon-sys-btndelete',
				handler : function(){					
	this.document.deleteDocument();					
},
				name : 'btnDelete'
			},
			'mkOfficeUse.docOfficeUseDic.btnSave' : {
				key : 'mkOfficeUse.docOfficeUseDic.btnSave',
				text : ' 保存',
				icon : 'icon-sys-btnsave',
				handler : function(){					
	this.document.submitDocument();					
},
				name : 'btnSave'
			},
			'mkOfficeUse.docOfficeUseDic.btnConfirm' : {
				key : 'mkOfficeUse.docOfficeUseDic.btnConfirm',
				text : '确定',
				icon : 'icon-sys-btnconfirm',
				handler : function(){					
	this.document.confirmDocument();					
},
				name : 'btnConfirm'
			}
		}
	}
,
	'mkNetFolder.docNetFolder' : {
		key : 'mkNetFolder.docNetFolder',
		name : 'docNetFolder',
		title : '文件夹',
		tablename : 'T_MK_APP_FOLDER',
		config : {"height":360,"width":500},
		panels : {
			'mkNetFolder.docNetFolder.pForm' : {
				key : 'mkNetFolder.docNetFolder.pForm',
				title : '文件夹',
				type : '0',
				name : 'pForm'
			}
		},
		buttons : {
			'mkNetFolder.docNetFolder.btnSave' : {
				key : 'mkNetFolder.docNetFolder.btnSave',
				text : '保存',
				icon : 'icon-sys-btnsave',
				handler : function(){					
	var vPanel = Ext.getCmp(this.document.get(0).get(0).getForm().findField("F_GRIDPANEL_ID").getValue());					
if (vPanel) {					
    this.document.submitDocument(vPanel.refreshViewAndTree);					
} else {					
this.document.submitDocument();					
}					
					
},
				name : 'btnSave'
			},
			'mkNetFolder.docNetFolder.btnConfirm' : {
				key : 'mkNetFolder.docNetFolder.btnConfirm',
				text : '确定',
				icon : 'icon-sys-btnconfirm',
				handler : function(){					
		var doc = this.document;					
		var fn = function() {					
			var vPanel = Ext.getCmp(doc.get(0).get(0).getForm().findField("F_GRIDPANEL_ID").getValue());					
if (vPanel) {					
    	vPanel.refreshViewAndTree();					
}					
			MixkyApp.desktop.closeDocument(doc.documentkey, doc.documentid);					
		}					
		this.document.submitDocument(fn);					
	},
				name : 'btnConfirm'
			}
		}
	}
,
	'mkAttendance.docAttendanceRecord' : {
		key : 'mkAttendance.docAttendanceRecord',
		name : 'docAttendanceRecord',
		title : '考勤记录',
		tablename : 'T_MK_APP_ATTENDANCE_RECORD',
		icon : 'icon-app-mkoa-attendancerecord',
		config : {"width":500,"height":450},
		panels : {
			'mkAttendance.docAttendanceRecord.pAttendanceRecordInfo' : {
				key : 'mkAttendance.docAttendanceRecord.pAttendanceRecordInfo',
				title : '考勤信息',
				icon : 'null',
				type : '0',
				name : 'pAttendanceRecordInfo'
			}
		},
		buttons : {
			'mkAttendance.docAttendanceRecord.btnDelete' : {
				key : 'mkAttendance.docAttendanceRecord.btnDelete',
				text : '删除',
				icon : 'icon-sys-btndelete',
				handler : function(){					
	this.document.deleteDocument();					
},
				name : 'btnDelete'
			},
			'mkAttendance.docAttendanceRecord.btnSave' : {
				key : 'mkAttendance.docAttendanceRecord.btnSave',
				text : '保存',
				icon : 'icon-sys-btnsave',
				handler : function(){					
	var panel = Ext.getCmp('v-mkAttendance.qAllAttendance.vAllAttendances');					
if (panel) {					
    this.document.submitDocument(panel.refresh);					
} else {					
	this.document.submitDocument();					
}					
					
},
				name : 'btnSave'
			},
			'mkAttendance.docAttendanceRecord.btnConfirm' : {
				key : 'mkAttendance.docAttendanceRecord.btnConfirm',
				text : '确定',
				icon : 'icon-sys-btnconfirm',
				handler : function(){					
	var doc = this.document;					
	var fn = function() {					
		var panel = Ext.getCmp('v-mkAttendance.qAllAttendance.vAllAttendances');					
		if (panel) {					
   			panel.refresh();					
		}					
		MixkyApp.desktop.closeDocument(doc.documentkey, doc.documentid);					
	}					
	this.document.submitDocument(fn);					
},
				name : 'btnConfirm'
			}
		}
	}
,
	'mkForum.docSubject' : {
		key : 'mkForum.docSubject',
		name : 'docSubject',
		title : '发起话题',
		tablename : 'T_MK_APP_FORUM_SUBJECT',
		icon : 'icon-app-mkoa-forum-addtopic',
		config : {"maximizable":true,"width":750,"height":600},
		panels : {
			'mkForum.docSubject.pSubject' : {
				key : 'mkForum.docSubject.pSubject',
				title : '论坛主题',
				icon : 'null',
				type : '0',
				name : 'pSubject'
			}
		},
		buttons : {
			'mkForum.docSubject.btnConfirm' : {
				key : 'mkForum.docSubject.btnConfirm',
				text : '确定',
				icon : 'icon-sys-btnconfirm',
				handler : function(){					
	this.document.confirmDocument();					
},
				name : 'btnConfirm'
			}
		}
	}
,
	'mkNotify.docNotify' : {
		key : 'mkNotify.docNotify',
		name : 'docNotify',
		title : '通知公告',
		tablename : 'T_MK_APP_NOTIFY',
		panels : {
			'mkNotify.docNotify.pInfo' : {
				key : 'mkNotify.docNotify.pInfo',
				title : '基本信息',
				type : '0',
				name : 'pInfo'
			},
			'mkNotify.docNotify.pContent' : {
				key : 'mkNotify.docNotify.pContent',
				title : '公告内容',
				type : '99',
				config : {"tablename":"T_MK_APP_NOTIFY","fieldname":"F_CONTENT"},
				name : 'pContent'
			}
		},
		buttons : {
			'mkNotify.docNotify.btnDelete' : {
				key : 'mkNotify.docNotify.btnDelete',
				text : '删除',
				icon : 'icon-sys-btndelete',
				handler : function(){					
	this.document.deleteDocument();					
},
				name : 'btnDelete'
			},
			'mkNotify.docNotify.btnSave' : {
				key : 'mkNotify.docNotify.btnSave',
				text : '保存',
				icon : 'icon-sys-btnsave',
				handler : function(){					
	this.document.submitDocument();					
},
				name : 'btnSave'
			},
			'mkNotify.docNotify.btnIssue' : {
				key : 'mkNotify.docNotify.btnIssue',
				text : '发布',
				icon : 'icon-sys-confirm',
				handler : function(){					
 var panel = this.document.items.get(0);					
 var form = panel.items.get(0).getForm();					
 form.findField("F_STATE").setValue("已发布");					
 this.document.confirmDocument();					
},
				name : 'btnIssue'
			},
			'mkNotify.docNotify.btnTurnBack' : {
				key : 'mkNotify.docNotify.btnTurnBack',
				text : '退回',
				icon : 'icon-sys-return',
				handler : function(){					
 var panel = this.document.items.get(0);					
 var form = panel.items.get(0).getForm();					
 form.findField("F_STATE").setValue("草稿");					
 this.document.confirmDocument();					
},
				name : 'btnTurnBack'
			},
			'mkNotify.docNotify.btnSubmitToIssue' : {
				key : 'mkNotify.docNotify.btnSubmitToIssue',
				text : '提交审核',
				icon : 'icon-sys-submit',
				handler : function(){					
 var panel = this.document.items.get(0);					
 var form = panel.items.get(0).getForm();					
 form.findField("F_STATE").setValue("待审核");					
 this.document.confirmDocument();					
},
				name : 'btnSubmitToIssue'
			},
			'mkNotify.docNotify.btnCancel' : {
				key : 'mkNotify.docNotify.btnCancel',
				text : '撤销发布',
				icon : 'icon-sys-cancel',
				handler : function(){					
 var panel = this.document.items.get(0);					
 var form = panel.items.get(0).getForm();					
 form.findField("F_STATE").setValue("已撤销");					
 this.document.confirmDocument();					
},
				name : 'btnCancel'
			}
		}
	}
,
	'bpcProject.docProjectTaskAdd' : {
		key : 'bpcProject.docProjectTaskAdd',
		name : 'docProjectTaskAdd',
		title : '创建项目任务',
		tablename : 'T_BPCOA_PROJECT_TASK',
		icon : 'icon-app-bpcoa-project-task',
		config : {"width":500,"height":450,"modal":true},
		panels : {
			'bpcProject.docProjectTaskAdd.pInfo' : {
				key : 'bpcProject.docProjectTaskAdd.pInfo',
				title : '任务信息',
				icon : 'null',
				type : '0',
				name : 'pInfo'
			}
		},
		buttons : {
			'bpcProject.docProjectTaskAdd.btnConfirm' : {
				key : 'bpcProject.docProjectTaskAdd.btnConfirm',
				text : '确定',
				icon : 'icon-sys-btnconfirm',
				handler : function(){					
	this.document.confirmDocument();					
},
				name : 'btnConfirm'
			}
		}
	}
,
	'mkScore.docScoreDay' : {
		key : 'mkScore.docScoreDay',
		name : 'docScoreDay',
		title : '每日积分',
		tablename : 'T_MK_BPC_SCORE_DAY',
		panels : {

		},
		buttons : {

		}
	}
,
	'mkOfficeUse.docOfficeUseBill' : {
		key : 'mkOfficeUse.docOfficeUseBill',
		name : 'docOfficeUseBill',
		title : '办公用品出库单',
		tablename : 'T_MK_APP_OFFICEUSE_BILL',
		icon : 'icon-app-mkoa-billout',
		panels : {
			'mkOfficeUse.docOfficeUseBill.pOfficeUseBill' : {
				key : 'mkOfficeUse.docOfficeUseBill.pOfficeUseBill',
				title : '出库单',
				icon : 'icon-sys-info',
				type : '0',
				name : 'pOfficeUseBill'
			},
			'mkOfficeUse.docOfficeUseBill.pDetail' : {
				key : 'mkOfficeUse.docOfficeUseBill.pDetail',
				title : '领用明细',
				icon : 'icon-sys-list',
				type : '3',
				config : {"documentidParamName":"F_BILL_ID"},
				name : 'pDetail'
			}
		},
		buttons : {
			'mkOfficeUse.docOfficeUseBill.btnIn' : {
				key : 'mkOfficeUse.docOfficeUseBill.btnIn',
				text : '入库',
				icon : 'icon-app-mkoa-usein',
				handler : function(){					
	var panel = this.document.items.get(0);					
	var form = panel.items.get(0).getForm();					
	form.findField("F_STATE").setValue("完成");					
	this.document.confirmDocument();					
},
				name : 'btnIn'
			},
			'mkOfficeUse.docOfficeUseBill.btnOut' : {
				key : 'mkOfficeUse.docOfficeUseBill.btnOut',
				text : '出库',
				icon : 'icon-app-mkoa-useout',
				handler : function(){					
	var panel = this.document.items.get(0);					
	var form = panel.items.get(0).getForm();					
	form.findField("F_STATE").setValue("完成");					
	this.document.confirmDocument();					
},
				name : 'btnOut'
			}
		}
	}
,
	'mkPersonalRecords.docPr' : {
		key : 'mkPersonalRecords.docPr',
		name : 'docPr',
		title : '员工信息',
		tablename : 'T_MK_APP_PERSONALRECORDS',
		icon : 'icon-app-mkoa-personrecord',
		config : {"width":800,"height":500},
		panels : {
			'mkPersonalRecords.docPr.pPr' : {
				key : 'mkPersonalRecords.docPr.pPr',
				title : '员工信息',
				icon : 'icon-sys-info',
				type : '0',
				name : 'pPr'
			},
			'mkPersonalRecords.docPr.pAttechment' : {
				key : 'mkPersonalRecords.docPr.pAttechment',
				title : '相关附件',
				icon : 'icon-sys-attachment',
				type : '99',
				name : 'pAttechment'
			},
			'mkPersonalRecords.docPr.pExperience' : {
				key : 'mkPersonalRecords.docPr.pExperience',
				title : '内部履历',
				icon : 'icon-sys-list',
				type : '3',
				config : {"documentidParamName":"F_PR_ID"},
				name : 'pExperience'
			}
		},
		buttons : {
			'mkPersonalRecords.docPr.btnDelete' : {
				key : 'mkPersonalRecords.docPr.btnDelete',
				text : '删除',
				icon : 'icon-sys-btndelete',
				handler : function(){					
	this.document.deleteDocument();					
},
				name : 'btnDelete'
			},
			'mkPersonalRecords.docPr.btnSave' : {
				key : 'mkPersonalRecords.docPr.btnSave',
				text : '保存',
				icon : 'icon-sys-btnsave',
				handler : function(){					
	this.document.submitDocument();					
},
				name : 'btnSave'
			},
			'mkPersonalRecords.docPr.btnConfirm' : {
				key : 'mkPersonalRecords.docPr.btnConfirm',
				text : '确定',
				icon : 'icon-sys-btnconfirm',
				handler : function(){					
	this.document.confirmDocument();					
},
				name : 'btnConfirm'
			}
		}
	}
,
	'mkScore.docScoreRule' : {
		key : 'mkScore.docScoreRule',
		name : 'docScoreRule',
		title : '积分规则',
		tablename : 'T_MK_BPC_SCORE_RULE',
		icon : 'icon-app-mkoa-config',
		config : {},
		panels : {
			'mkScore.docScoreRule.pScoreRuleList' : {
				key : 'mkScore.docScoreRule.pScoreRuleList',
				title : '规则设定',
				icon : '',
				type : '3',
				name : 'pScoreRuleList'
			}
		},
		buttons : {
			'mkScore.docScoreRule.btnSave' : {
				key : 'mkScore.docScoreRule.btnSave',
				text : '保存',
				icon : 'icon-sys-btnsave',
				handler : function(){					
this.document.submitDocument();					
},
				name : 'btnSave'
			},
			'mkScore.docScoreRule.btnConfirm' : {
				key : 'mkScore.docScoreRule.btnConfirm',
				text : '确定',
				icon : 'icon-sys-btnconfirm',
				handler : function(){					
	this.document.confirmDocument();					
},
				name : 'btnConfirm'
			}
		}
	}
,
	'mkScore.docAddScore' : {
		key : 'mkScore.docAddScore',
		name : 'docAddScore',
		title : 'docAddScore',
		tablename : 'T_MK_BPC_SCORE_USER',
		panels : {
			'mkScore.docAddScore.pAddScore' : {
				key : 'mkScore.docAddScore.pAddScore',
				title : 'pAddScore',
				type : '0',
				name : 'pAddScore'
			}
		},
		buttons : {
			'mkScore.docAddScore.btnSave' : {
				key : 'mkScore.docAddScore.btnSave',
				text : '保存',
				icon : 'icon-sys-btnsave',
				handler : function(){					
this.document.submitDocument();					
},
				name : 'btnSave'
			}
		}
	}
,
	'mkAddressBook.docPublicNameCard' : {
		key : 'mkAddressBook.docPublicNameCard',
		name : 'docPublicNameCard',
		title : '公共名片',
		tablename : 'T_MK_APP_NAMECARD_PUBLIC',
		icon : 'icon-app-mkoa-namecard',
		config : {"height":520,"width":650},
		panels : {
			'mkAddressBook.docPublicNameCard.pInfo' : {
				key : 'mkAddressBook.docPublicNameCard.pInfo',
				title : '详细信息',
				icon : 'null',
				type : '0',
				name : 'pInfo'
			}
		},
		buttons : {
			'mkAddressBook.docPublicNameCard.btnDelete' : {
				key : 'mkAddressBook.docPublicNameCard.btnDelete',
				text : '删除',
				icon : 'icon-sys-btndelete',
				handler : function(){					
	this.document.deleteDocument();					
},
				name : 'btnDelete'
			},
			'mkAddressBook.docPublicNameCard.btnSave' : {
				key : 'mkAddressBook.docPublicNameCard.btnSave',
				text : '保存',
				icon : 'icon-sys-btnsave',
				handler : function(){					
	this.document.submitDocument();					
},
				name : 'btnSave'
			},
			'mkAddressBook.docPublicNameCard.btnConfirm' : {
				key : 'mkAddressBook.docPublicNameCard.btnConfirm',
				text : '确定',
				icon : 'icon-sys-btnconfirm',
				handler : function(){					
	this.document.confirmDocument();					
},
				name : 'btnConfirm'
			}
		}
	}
,
	'mkWorkReport.docWrComment' : {
		key : 'mkWorkReport.docWrComment',
		name : 'docWrComment',
		title : '工作简报批复',
		tablename : 'T_MK_APP_WORKREPORT_COMMENT',
		config : {"width":600,"height":450},
		panels : {
			'mkWorkReport.docWrComment.pWrComment' : {
				key : 'mkWorkReport.docWrComment.pWrComment',
				title : '工作简报批复',
				type : '0',
				name : 'pWrComment'
			}
		},
		buttons : {
			'mkWorkReport.docWrComment.btnConfirm' : {
				key : 'mkWorkReport.docWrComment.btnConfirm',
				text : '确定',
				icon : 'icon-sys-btnconfirm',
				handler : function(){					
	this.document.confirmDocument();					
},
				name : 'btnConfirm'
			}
		}
	}
,
	'mkCalendar.docCalendar' : {
		key : 'mkCalendar.docCalendar',
		name : 'docCalendar',
		title : '日程事项',
		tablename : 'T_MK_APP_CALENDAR',
		icon : 'icon-app-mkoa-calendar',
		config : {"height":400,"width":500},
		panels : {
			'mkCalendar.docCalendar.pInfo' : {
				key : 'mkCalendar.docCalendar.pInfo',
				title : '基本信息',
				icon : 'icon-sys-baseinfo',
				type : '0',
				name : 'pInfo'
			}
		},
		buttons : {
			'mkCalendar.docCalendar.btnDelete' : {
				key : 'mkCalendar.docCalendar.btnDelete',
				text : '删除',
				icon : 'icon-sys-btndelete',
				handler : function(){					
	this.document.deleteDocument();					
},
				name : 'btnDelete'
			},
			'mkCalendar.docCalendar.btnSave' : {
				key : 'mkCalendar.docCalendar.btnSave',
				text : '保存',
				icon : 'icon-sys-btnsave',
				handler : function(){					
	this.document.submitDocument();					
},
				name : 'btnSave'
			},
			'mkCalendar.docCalendar.btnConfirm' : {
				key : 'mkCalendar.docCalendar.btnConfirm',
				text : '确定',
				icon : 'icon-sys-btnconfirm',
				handler : function(){					
	this.document.confirmDocument();					
},
				name : 'btnConfirm'
			}
		}
	}
,
	'mkKnowledge.docKnowledgeTag' : {
		key : 'mkKnowledge.docKnowledgeTag',
		name : 'docKnowledgeTag',
		title : '知识库标签',
		tablename : 'T_MK_APP_KNOWLEDGE_TAG',
		icon : 'icon-app-mkoa-favoritetag',
		config : {"width":400,"height":320},
		panels : {
			'mkKnowledge.docKnowledgeTag.pKnowledgeTag' : {
				key : 'mkKnowledge.docKnowledgeTag.pKnowledgeTag',
				title : '知识库标签',
				icon : 'null',
				type : '0',
				name : 'pKnowledgeTag'
			}
		},
		buttons : {
			'mkKnowledge.docKnowledgeTag.btnConfirm' : {
				key : 'mkKnowledge.docKnowledgeTag.btnConfirm',
				text : '确定',
				icon : 'icon-sys-btnconfirm',
				handler : function(){					
	this.document.confirmDocument();					
},
				name : 'btnConfirm'
			},
			'mkKnowledge.docKnowledgeTag.btnDelete' : {
				key : 'mkKnowledge.docKnowledgeTag.btnDelete',
				text : '删除',
				icon : 'icon-sys-btndelete',
				handler : function(){					
	var doc = this.document;					
	Ext.MessageBox.confirm('危险操作提示', '删除标签，其下的所有子标签也将被删除，您确定吗？', function(btn){					
			if(btn == 'yes'){					
					AppKnowledgeDirect.deleteKnowledgeTag(doc.documentid, function(result, e){					
						if (result && result.success) {					
							MixkyApp.desktop.closeDocument(doc.documentkey, doc.documentid);					
						} else {					
							Ext.MessageBox.alert('信息提示', '删除失败，该标签下有知识，请先将标签下的知识全部删除后再删除标签！');					
						}					
					});						
			}					
	});					
},
				name : 'btnDelete'
			}
		}
	}
,
	'mkWorkReport.docWorkReport' : {
		key : 'mkWorkReport.docWorkReport',
		name : 'docWorkReport',
		title : '工作简报',
		tablename : 'T_MK_APP_WORKREPORT',
		icon : 'icon-app-mkoa-workreport',
		config : {"width":800,"height":560,"maximizable":true},
		panels : {
			'mkWorkReport.docWorkReport.pWorkReport' : {
				key : 'mkWorkReport.docWorkReport.pWorkReport',
				title : '工作简报',
				icon : 'icon-sys-info',
				type : '0',
				name : 'pWorkReport'
			}
		},
		buttons : {
			'mkWorkReport.docWorkReport.btnDelete' : {
				key : 'mkWorkReport.docWorkReport.btnDelete',
				text : '删除',
				icon : 'icon-sys-btndelete',
				handler : function(){					
	this.document.deleteDocument();					
},
				name : 'btnDelete'
			},
			'mkWorkReport.docWorkReport.btnSave' : {
				key : 'mkWorkReport.docWorkReport.btnSave',
				text : '保存',
				icon : 'icon-sys-btnsave',
				handler : function(){					
        var panel = this.document.items.get(0);					
        var form = panel.items.get(0).getForm();					
        form.findField("F_STATE").setValue("草稿");					
	this.document.submitDocument();					
},
				name : 'btnSave'
			},
			'mkWorkReport.docWorkReport.btnConfirm' : {
				key : 'mkWorkReport.docWorkReport.btnConfirm',
				text : '确定',
				icon : 'icon-sys-btnconfirm',
				handler : function(){					
        var panel = this.document.items.get(0);					
        var form = panel.items.get(0).getForm();					
        form.findField("F_STATE").setValue("草稿");					
	this.document.confirmDocument();					
},
				name : 'btnConfirm'
			},
			'mkWorkReport.docWorkReport.btnIssue' : {
				key : 'mkWorkReport.docWorkReport.btnIssue',
				text : '发布',
				icon : 'icon-sys-submit',
				handler : function(){					
	var panel = this.document.items.get(0);					
	var form = panel.items.get(0).getForm();					
	if(!form.isValid()){					
	   MixkyApp.showErrorMessage("表单数据填写非法，保存失败");					
	   return;					
	}					
	form.findField("F_STATE").setValue("已发布");					
	this.document.confirmDocument();					
},
				name : 'btnIssue'
			}
		}
	}
,
	'mkMail.docRule' : {
		key : 'mkMail.docRule',
		name : 'docRule',
		title : '邮件规则',
		tablename : 'T_MK_APP_MAIL_RULE',
		config : {"height":450},
		panels : {
			'mkMail.docRule.pRule' : {
				key : 'mkMail.docRule.pRule',
				title : '规则',
				type : '0',
				name : 'pRule'
			},
			'mkMail.docRule.pRuleDetail' : {
				key : 'mkMail.docRule.pRuleDetail',
				title : '规则明细',
				type : '3',
				config : {"documentidParamName":"F_RULE_ID"},
				name : 'pRuleDetail'
			}
		},
		buttons : {
			'mkMail.docRule.btnSave' : {
				key : 'mkMail.docRule.btnSave',
				text : '保存',
				icon : 'icon-sys-btnsave',
				handler : function(){					
	this.document.submitDocument();					
},
				name : 'btnSave'
			},
			'mkMail.docRule.btnDelete' : {
				key : 'mkMail.docRule.btnDelete',
				text : '删除',
				icon : 'icon-sys-btndelete',
				handler : function(){					
	this.document.deleteDocument();					
},
				name : 'btnDelete'
			}
		}
	}
,
	'mkAsset.docAsset' : {
		key : 'mkAsset.docAsset',
		name : 'docAsset',
		title : '资产信息',
		tablename : 'T_MK_APP_ASSET',
		icon : 'icon-app-mkoa-asset',
		config : {"width":700,"height":520},
		panels : {
			'mkAsset.docAsset.pAsset' : {
				key : 'mkAsset.docAsset.pAsset',
				title : '资产信息',
				icon : 'icon-sys-info',
				type : '0',
				name : 'pAsset'
			},
			'mkAsset.docAsset.pRecord' : {
				key : 'mkAsset.docAsset.pRecord',
				title : '变更记录',
				icon : 'icon-sys-list',
				type : '3',
				config : {"documentidParamName":"F_ASSET_ID"},
				name : 'pRecord'
			}
		},
		buttons : {
			'mkAsset.docAsset.btnDelete' : {
				key : 'mkAsset.docAsset.btnDelete',
				text : '删除',
				icon : 'icon-sys-btndelete',
				handler : function(){					
	this.document.deleteDocument();					
},
				name : 'btnDelete'
			},
			'mkAsset.docAsset.btnSave' : {
				key : 'mkAsset.docAsset.btnSave',
				text : '保存',
				icon : 'icon-sys-btnsave',
				handler : function(){					
	this.document.submitDocument();					
},
				name : 'btnSave'
			},
			'mkAsset.docAsset.btnConfirm' : {
				key : 'mkAsset.docAsset.btnConfirm',
				text : '确定',
				icon : 'icon-sys-btnconfirm',
				handler : function(){					
	this.document.confirmDocument();					
},
				name : 'btnConfirm'
			}
		}
	}
,
	'mkKnowledge.docKnowledgeDetail' : {
		key : 'mkKnowledge.docKnowledgeDetail',
		name : 'docKnowledgeDetail',
		title : '知识详细信息',
		tablename : 'T_MK_APP_KNOWLEDGE',
		icon : 'icon-app-mkoa-knowledgedetail',
		config : {"width":720,"height":560},
		panels : {
			'mkKnowledge.docKnowledgeDetail.pDetail' : {
				key : 'mkKnowledge.docKnowledgeDetail.pDetail',
				title : '知识详细信息',
				icon : '',
				type : '0',
				name : 'pDetail'
			}
		},
		buttons : {
			'mkKnowledge.docKnowledgeDetail.btnSave' : {
				key : 'mkKnowledge.docKnowledgeDetail.btnSave',
				text : '保存',
				icon : 'icon-sys-btnsave',
				handler : function(){					
	this.document.submitDocument();					
},
				name : 'btnSave'
			},
			'mkKnowledge.docKnowledgeDetail.btnConfirm' : {
				key : 'mkKnowledge.docKnowledgeDetail.btnConfirm',
				text : '确定',
				icon : 'icon-sys-btnconfirm',
				handler : function(){					
	this.document.confirmDocument();					
},
				name : 'btnConfirm'
			},
			'mkKnowledge.docKnowledgeDetail.btnDelete' : {
				key : 'mkKnowledge.docKnowledgeDetail.btnDelete',
				text : '删除',
				icon : 'icon-sys-btndelete',
				handler : function(){					
	var doc = this.document;					
	Ext.MessageBox.confirm('危险操作提示', '删除文档，该操作不可恢复，您确定吗？', function(btn){					
			if(btn == 'yes'){					
					AppKnowledgeDirect.deleteKnowledge(doc.documentid, function(result, e){					
						MixkyApp.desktop.closeDocument(doc.documentkey, doc.documentid);					
					});						
			}					
	});					
},
				name : 'btnDelete'
			}
		}
	}
,
	'mkOfficeUse.docOfficeUseBillIn' : {
		key : 'mkOfficeUse.docOfficeUseBillIn',
		name : 'docOfficeUseBillIn',
		title : '办公用品入库单',
		tablename : 'T_MK_APP_OFFICEUSE_BILL',
		icon : 'icon-app-mkoa-billin',
		panels : {
			'mkOfficeUse.docOfficeUseBillIn.pOfficeUseBill' : {
				key : 'mkOfficeUse.docOfficeUseBillIn.pOfficeUseBill',
				title : '入库单',
				icon : 'icon-sys-info',
				type : '0',
				name : 'pOfficeUseBill'
			},
			'mkOfficeUse.docOfficeUseBillIn.pDetail' : {
				key : 'mkOfficeUse.docOfficeUseBillIn.pDetail',
				title : '采购明细',
				icon : 'icon-sys-list',
				type : '3',
				config : {"documentidParamName":"F_BILL_ID"},
				name : 'pDetail'
			}
		},
		buttons : {
			'mkOfficeUse.docOfficeUseBillIn.btnIn' : {
				key : 'mkOfficeUse.docOfficeUseBillIn.btnIn',
				text : '入库',
				icon : 'icon-app-mkoa-usein',
				handler : function(){					
	var panel = this.document.items.get(0);					
	var form = panel.items.get(0).getForm();					
	form.findField("F_STATE").setValue("完成");					
	this.document.confirmDocument();					
},
				name : 'btnIn'
			}
		}
	}
,
	'mkWorkRequest.docWorkRequest' : {
		key : 'mkWorkRequest.docWorkRequest',
		name : 'docWorkRequest',
		title : '请示报告',
		tablename : 'T_MK_APP_WORKREQUEST',
		icon : 'icon-app-mkoa-workrequest',
		config : {"maximizable":true},
		panels : {
			'mkWorkRequest.docWorkRequest.pInfo' : {
				key : 'mkWorkRequest.docWorkRequest.pInfo',
				title : '请示报告表单',
				icon : 'icon-sys-info',
				type : '0',
				name : 'pInfo'
			},
			'mkWorkRequest.docWorkRequest.pContent' : {
				key : 'mkWorkRequest.docWorkRequest.pContent',
				title : '请示内容',
				icon : 'icon-sys-list',
				type : '9',
				config : {"fieldname":"F_CONTENT","tablename":"T_MK_APP_WORKREQUEST"},
				name : 'pContent'
			},
			'mkWorkRequest.docWorkRequest.pDebugFormAuth' : {
				key : 'mkWorkRequest.docWorkRequest.pDebugFormAuth',
				title : '权限调试标签',
				icon : 'null',
				type : '99',
				name : 'pDebugFormAuth'
			},
			'mkWorkRequest.docWorkRequest.pFlowInstanceViewer' : {
				key : 'mkWorkRequest.docWorkRequest.pFlowInstanceViewer',
				title : '审批流程',
				icon : 'icon-sys-flow-flow',
				type : '99',
				name : 'pFlowInstanceViewer'
			},
			'mkWorkRequest.docWorkRequest.pWord' : {
				key : 'mkWorkRequest.docWorkRequest.pWord',
				title : '请示正文',
				icon : 'null',
				type : '99',
				name : 'pWord'
			}
		},
		buttons : {
			'mkWorkRequest.docWorkRequest.btnConfirm' : {
				key : 'mkWorkRequest.docWorkRequest.btnConfirm',
				text : '确定',
				icon : 'icon-sys-btnconfirm',
				handler : function(){					
	this.document.confirmDocument();					
},
				name : 'btnConfirm'
			},
			'mkWorkRequest.docWorkRequest.btnSave' : {
				key : 'mkWorkRequest.docWorkRequest.btnSave',
				text : '保存',
				icon : 'icon-sys-btnsave',
				handler : function(){					
	this.document.submitDocument();					
},
				name : 'btnSave'
			},
			'mkWorkRequest.docWorkRequest.btnDelete' : {
				key : 'mkWorkRequest.docWorkRequest.btnDelete',
				text : '删除',
				icon : 'icon-sys-btndelete',
				handler : function(){					
	this.document.deleteDocument();					
},
				name : 'btnDelete'
			}
		}
	}
,
	'bpcProject.docDailyTask' : {
		key : 'bpcProject.docDailyTask',
		name : 'docDailyTask',
		title : '添加日常任务',
		tablename : 'T_MK_BPC_DAILY_TASK',
		config : {"width":550,"height":450},
		panels : {
			'bpcProject.docDailyTask.pNewDailyTask' : {
				key : 'bpcProject.docDailyTask.pNewDailyTask',
				title : '基本信息',
				type : '0',
				name : 'pNewDailyTask'
			}
		},
		buttons : {
			'bpcProject.docDailyTask.btnSave' : {
				key : 'bpcProject.docDailyTask.btnSave',
				text : '保存',
				icon : 'icon-sys-btnsave',
				handler : function(){					
 var panel = this.document.items.get(0);					
 var form = panel.items.get(0).getForm();					
 var start_point = form.findField("F_START_POINT").getValue();					
 if(start_point <= 0){					
  Ext.MessageBox.alert("", "派发时间点不能小于1");					
  return false;					
 }					
 this.document.submitDocument();					
},
				name : 'btnSave'
			}
		}
	}
,
	'mkRegulations.docRegulations' : {
		key : 'mkRegulations.docRegulations',
		name : 'docRegulations',
		title : '规章制度文档',
		tablename : 'T_MK_APP_REGULATIONS',
		icon : 'icon-app-mkoa-regulations',
		config : {"width":550,"height":500},
		panels : {
			'mkRegulations.docRegulations.pRegulateInfo' : {
				key : 'mkRegulations.docRegulations.pRegulateInfo',
				title : '规章制度',
				icon : 'null',
				type : '0',
				name : 'pRegulateInfo'
			}
		},
		buttons : {
			'mkRegulations.docRegulations.btnSave' : {
				key : 'mkRegulations.docRegulations.btnSave',
				text : '保存',
				icon : 'icon-sys-btnsave',
				handler : function(){					
     this.document.submitDocument();					
},
				name : 'btnSave'
			},
			'mkRegulations.docRegulations.btnConfirm' : {
				key : 'mkRegulations.docRegulations.btnConfirm',
				text : '确定',
				icon : 'icon-sys-btnconfirm',
				handler : function(){					
	this.document.confirmDocument();					
},
				name : 'btnConfirm'
			},
			'mkRegulations.docRegulations.btnDelete' : {
				key : 'mkRegulations.docRegulations.btnDelete',
				text : '删除',
				icon : 'icon-sys-btndelete',
				handler : function(){					
    this.document.deleteDocument();					
}					
,
				name : 'btnDelete'
			}
		}
	}
,
	'mkFileSender.docFileSender' : {
		key : 'mkFileSender.docFileSender',
		name : 'docFileSender',
		title : '文件分发',
		tablename : 'T_MK_APP_FILESENDER',
		panels : {
			'mkFileSender.docFileSender.pFileSender' : {
				key : 'mkFileSender.docFileSender.pFileSender',
				title : '文件分发',
				type : '0',
				name : 'pFileSender'
			},
			'mkFileSender.docFileSender.pReadLog' : {
				key : 'mkFileSender.docFileSender.pReadLog',
				title : '阅读记录',
				type : '2',
				config : {"documentidParamName":"F_FILE_ID"},
				name : 'pReadLog'
			}
		},
		buttons : {
			'mkFileSender.docFileSender.btnDelete' : {
				key : 'mkFileSender.docFileSender.btnDelete',
				text : '删除',
				icon : 'icon-sys-btndelete',
				handler : function(){					
	this.document.deleteDocument();					
},
				name : 'btnDelete'
			},
			'mkFileSender.docFileSender.btnSave' : {
				key : 'mkFileSender.docFileSender.btnSave',
				text : '保存',
				icon : 'icon-sys-btnsave',
				handler : function(){					
	this.document.submitDocument();					
},
				name : 'btnSave'
			},
			'mkFileSender.docFileSender.btnConfirm' : {
				key : 'mkFileSender.docFileSender.btnConfirm',
				text : '发布',
				icon : 'icon-sys-btnconfirm',
				handler : function(){					
	var panel = this.document.items.get(0);					
	var form = panel.items.get(0).getForm();					
	if(!form.isValid()){					
	   MixkyApp.showErrorMessage("表单数据填写非法，保存失败");					
	   return;					
	}					
	form.findField("F_STATE").setValue("已发布");					
	this.document.confirmDocument();					
},
				name : 'btnConfirm'
			},
			'mkFileSender.docFileSender.btnRead' : {
				key : 'mkFileSender.docFileSender.btnRead',
				text : '已读',
				icon : 'icon-sys-btnread',
				handler : function(){					
FileSendDirect.isUserDownload(this.document.documentid, function(result, e){					
	if(result && result.success){					
					
		MixkyApp.showInfoMessage('文件阅读完毕！');					
	}else{					
		MixkyApp.showErrorMessage('文件未被下载，请下载阅读后点击！');					
	}					
});					
},
				name : 'btnRead'
			}
		}
	}
,
	'mkFavorite.docFavorite' : {
		key : 'mkFavorite.docFavorite',
		name : 'docFavorite',
		title : '收藏项',
		tablename : 'T_MK_APP_FAVORITE',
		icon : 'icon-app-mkoa-favorite',
		panels : {
			'mkFavorite.docFavorite.pInfo' : {
				key : 'mkFavorite.docFavorite.pInfo',
				title : '属性管理',
				icon : 'icon-sys-baseinfo',
				type : '0',
				name : 'pInfo'
			}
		},
		buttons : {
			'mkFavorite.docFavorite.btnSave' : {
				key : 'mkFavorite.docFavorite.btnSave',
				text : '保存',
				icon : 'icon-sys-btnsave',
				handler : function(){					
	this.document.submitDocument();					
},
				name : 'btnSave'
			},
			'mkFavorite.docFavorite.btnConfirm' : {
				key : 'mkFavorite.docFavorite.btnConfirm',
				text : '确定',
				icon : 'icon-sys-btnconfirm',
				handler : function(){					
	this.document.confirmDocument();					
},
				name : 'btnConfirm'
			}
		}
	}
,
	'mkAttendance.docAttendance' : {
		key : 'mkAttendance.docAttendance',
		name : 'docAttendance',
		title : '请假出差',
		tablename : 'T_MK_APP_ATTENDANCE',
		icon : 'icon-app-mkoa-attendance',
		config : {"width":550,"height":600},
		panels : {
			'mkAttendance.docAttendance.pAttendanceInfo' : {
				key : 'mkAttendance.docAttendance.pAttendanceInfo',
				title : '申请单信息',
				icon : 'icon-sys-info',
				type : '0',
				name : 'pAttendanceInfo'
			},
			'mkAttendance.docAttendance.pFlowView' : {
				key : 'mkAttendance.docAttendance.pFlowView',
				title : '审批流程',
				icon : 'icon-sys-flow-flow',
				type : '99',
				name : 'pFlowView'
			},
			'mkAttendance.docAttendance.pDebug' : {
				key : 'mkAttendance.docAttendance.pDebug',
				title : '调试标签',
				icon : 'null',
				type : '99',
				name : 'pDebug'
			}
		},
		buttons : {
			'mkAttendance.docAttendance.btnDelete' : {
				key : 'mkAttendance.docAttendance.btnDelete',
				text : '删除',
				icon : 'icon-sys-btndelete',
				handler : function(){					
	this.document.deleteDocument();					
},
				name : 'btnDelete'
			},
			'mkAttendance.docAttendance.btnSave' : {
				key : 'mkAttendance.docAttendance.btnSave',
				text : '保存',
				icon : 'icon-sys-btnsave',
				handler : function(){					
	this.document.submitDocument();					
},
				name : 'btnSave'
			},
			'mkAttendance.docAttendance.btnConfirm' : {
				key : 'mkAttendance.docAttendance.btnConfirm',
				text : '确定',
				icon : 'icon-sys-btnconfirm',
				handler : function(){					
	this.document.confirmDocument();					
},
				name : 'btnConfirm'
			}
		}
	}
,
	'bpcProject.docProject' : {
		key : 'bpcProject.docProject',
		name : 'docProject',
		title : '项目信息',
		tablename : 'T_BPCOA_PROJECT',
		icon : 'icon-app-bpcoa-project-project',
		config : {"width":650,"height":550},
		panels : {
			'bpcProject.docProject.pInfo' : {
				key : 'bpcProject.docProject.pInfo',
				title : '基本信息',
				icon : 'icon-sys-baseinfo',
				type : '0',
				name : 'pInfo'
			},
			'bpcProject.docProject.pFolder' : {
				key : 'bpcProject.docProject.pFolder',
				title : '项目资料',
				icon : 'icon-app-mkoa-folders',
				type : '99',
				name : 'pFolder'
			},
			'bpcProject.docProject.pAddressBook' : {
				key : 'bpcProject.docProject.pAddressBook',
				title : '联系人',
				icon : 'icon-app-mkoa-addressbook',
				type : '99',
				name : 'pAddressBook'
			}
		},
		buttons : {
			'bpcProject.docProject.btnDelete' : {
				key : 'bpcProject.docProject.btnDelete',
				text : '删除',
				icon : 'icon-sys-btndelete',
				handler : function(){					
	this.document.deleteDocument();					
},
				name : 'btnDelete'
			},
			'bpcProject.docProject.btnSave' : {
				key : 'bpcProject.docProject.btnSave',
				text : '保存',
				icon : 'icon-sys-btnsave',
				handler : function(){					
	this.document.submitDocument();					
},
				name : 'btnSave'
			},
			'bpcProject.docProject.btnConfirm' : {
				key : 'bpcProject.docProject.btnConfirm',
				text : '确定',
				icon : 'icon-sys-btnconfirm',
				handler : function(){					
	this.document.confirmDocument();					
},
				name : 'btnConfirm'
			}
		}
	}
,
	'mkKnowledge.docComment' : {
		key : 'mkKnowledge.docComment',
		name : 'docComment',
		title : '知识评论',
		tablename : 'T_MK_APP_KNOWLEDGE_COMMENT',
		icon : 'icon-app-mkoa-knowledgedetail',
		config : {"width":500,"height":500},
		panels : {
			'mkKnowledge.docComment.pComment' : {
				key : 'mkKnowledge.docComment.pComment',
				title : '知识评论',
				icon : 'null',
				type : '0',
				name : 'pComment'
			}
		},
		buttons : {
			'mkKnowledge.docComment.btnConfirm' : {
				key : 'mkKnowledge.docComment.btnConfirm',
				text : '确定',
				icon : 'icon-sys-btnconfirm',
				handler : function(){					
	this.document.confirmDocument();					
},
				name : 'btnConfirm'
			}
		}
	}
,
	'mkForum.docForumCategory' : {
		key : 'mkForum.docForumCategory',
		name : 'docForumCategory',
		title : '论坛版块分类',
		tablename : 'T_MK_APP_FORUM_CATEGORY',
		config : {"width":500,"height":400},
		panels : {
			'mkForum.docForumCategory.pForumCategory' : {
				key : 'mkForum.docForumCategory.pForumCategory',
				title : '论坛版块分类',
				type : '0',
				name : 'pForumCategory'
			}
		},
		buttons : {
			'mkForum.docForumCategory.btnSave' : {
				key : 'mkForum.docForumCategory.btnSave',
				text : '保存',
				icon : 'icon-sys-btnsave',
				handler : function(){					
	this.document.submitDocument();					
},
				name : 'btnSave'
			},
			'mkForum.docForumCategory.btnConfirm' : {
				key : 'mkForum.docForumCategory.btnConfirm',
				text : '确定',
				icon : 'icon-sys-btnconfirm',
				handler : function(){					
	this.document.confirmDocument();					
},
				name : 'btnConfirm'
			}
		}
	}
,
	'mkNetFolder.docNetFile' : {
		key : 'mkNetFolder.docNetFile',
		name : 'docNetFile',
		title : '文件',
		tablename : 'T_MK_APP_FOLDER',
		config : {"width":500,"height":360},
		panels : {
			'mkNetFolder.docNetFile.pFileForm' : {
				key : 'mkNetFolder.docNetFile.pFileForm',
				title : '文件',
				type : '0',
				name : 'pFileForm'
			}
		},
		buttons : {
			'mkNetFolder.docNetFile.btnSave' : {
				key : 'mkNetFolder.docNetFile.btnSave',
				text : '保存',
				icon : 'icon-sys-btnsave',
				handler : function(){					
	var vPanel = Ext.getCmp(this.document.get(0).get(0).getForm().findField("F_GRIDPANEL_ID").getValue());					
if (vPanel) {					
    this.document.submitDocument(vPanel.refreshViewAndTree);					
} else {					
this.document.submitDocument();					
}					
					
},
				name : 'btnSave'
			},
			'mkNetFolder.docNetFile.btnDelete' : {
				key : 'mkNetFolder.docNetFile.btnDelete',
				text : '删除',
				icon : 'icon-sys-btndelete',
				handler : function(){					
	this.document.deleteDocument();					
},
				name : 'btnDelete'
			},
			'mkNetFolder.docNetFile.btnConfirm' : {
				key : 'mkNetFolder.docNetFile.btnConfirm',
				text : '确定',
				icon : 'icon-sys-btnconfirm',
				handler : function(){					
		var doc = this.document;					
		var fn = function() {					
			var vPanel = Ext.getCmp(doc.get(0).get(0).getForm().findField("F_GRIDPANEL_ID").getValue());					
if (vPanel) {					
    	vPanel.refreshViewAndTree();					
}					
			MixkyApp.desktop.closeDocument(doc.documentkey, doc.documentid);					
		}					
		this.document.submitDocument(fn);					
	}					
,
				name : 'btnConfirm'
			}
		}
	}
,
	'mkMail.docTag' : {
		key : 'mkMail.docTag',
		name : 'docTag',
		title : '自定义标签',
		tablename : 'T_MK_APP_MAIL_TAG',
		config : {"height":300},
		panels : {
			'mkMail.docTag.pTag' : {
				key : 'mkMail.docTag.pTag',
				title : '标签',
				type : '0',
				name : 'pTag'
			}
		},
		buttons : {
			'mkMail.docTag.btnSave' : {
				key : 'mkMail.docTag.btnSave',
				text : '保存',
				icon : 'icon-sys-btnsave',
				handler : function(){					
	this.document.submitDocument();					
},
				name : 'btnSave'
			},
			'mkMail.docTag.btnDelete' : {
				key : 'mkMail.docTag.btnDelete',
				text : '删除',
				icon : 'icon-sys-btndelete',
				handler : function(){					
	var panel = this.document.items.get(0);					
	Ext.Msg.confirm('危险操作提示', '删除文档，该操作不可恢复，您确定吗？', function(btn) {					
		if (btn == 'yes') {					
			AppMailDirect.deleteTag(panel.document.documentid, function(result, e){					
				if(result && result.success){					
					MixkyApp.showInfoMessage('标签删除成功！', '信息提示');					
					MixkyApp.desktop.closeDocument(panel.document.documentkey, panel.document.documentid);					
					//panel.refresh();					
				}else{					
					MixkyApp.showDirectActionFail("删除标签失败, 该标签下有邮件，不允许删除！", result, e);					
				}					
		   	});					
		}					
	});					
},
				name : 'btnDelete'
			}
		}
	}
,
	'mkNotify.docNotifyViewer' : {
		key : 'mkNotify.docNotifyViewer',
		name : 'docNotifyViewer',
		title : '阅读通知公告',
		tablename : 'T_MK_APP_NOTIFY',
		icon : 'icon-app-mkoa-notify',
		config : {"height":600,"width":650},
		panels : {
			'mkNotify.docNotifyViewer.pContent' : {
				key : 'mkNotify.docNotifyViewer.pContent',
				title : '公告内容',
				icon : 'null',
				type : '99',
				name : 'pContent'
			},
			'mkNotify.docNotifyViewer.pReadLog' : {
				key : 'mkNotify.docNotifyViewer.pReadLog',
				title : '已阅人员',
				icon : 'null',
				type : '99',
				name : 'pReadLog'
			}
		},
		buttons : {

		}
	}
,
	'bpcProject.docProjectTaskEditor' : {
		key : 'bpcProject.docProjectTaskEditor',
		name : 'docProjectTaskEditor',
		title : '编辑项目任务属性',
		tablename : 'T_BPCOA_PROJECT_TASK',
		icon : 'icon-app-bpcoa-project-task',
		config : {"modal":true,"width":450,"height":400},
		panels : {
			'bpcProject.docProjectTaskEditor.pInfo' : {
				key : 'bpcProject.docProjectTaskEditor.pInfo',
				title : '任务信息',
				icon : 'null',
				type : '0',
				name : 'pInfo'
			}
		},
		buttons : {
			'bpcProject.docProjectTaskEditor.btnConfirm' : {
				key : 'bpcProject.docProjectTaskEditor.btnConfirm',
				text : '确定',
				icon : 'icon-sys-btnconfirm',
				handler : function(){					
	this.document.confirmDocument();					
},
				name : 'btnConfirm'
			},
			'bpcProject.docProjectTaskEditor.btnDelete' : {
				key : 'bpcProject.docProjectTaskEditor.btnDelete',
				text : '删除',
				icon : 'icon-sys-btndelete',
				handler : function(){					
	this.document.deleteDocument();					
},
				name : 'btnDelete'
			},
			'bpcProject.docProjectTaskEditor.btnCancel' : {
				key : 'bpcProject.docProjectTaskEditor.btnCancel',
				text : '撤销',
				icon : 'icon-sys-btncancel',
				name : 'btnCancel'
			},
			'bpcProject.docProjectTaskEditor.btnSave' : {
				key : 'bpcProject.docProjectTaskEditor.btnSave',
				text : '保存',
				icon : 'icon-sys-btnsave',
				handler : function(){					
	this.document.submitDocument();					
},
				name : 'btnSave'
			}
		}
	}
,
	'mkForum.docForum' : {
		key : 'mkForum.docForum',
		name : 'docForum',
		title : '论坛版块',
		tablename : 'T_MK_APP_FORUM',
		config : {"width":500,"height":400},
		panels : {
			'mkForum.docForum.pForum' : {
				key : 'mkForum.docForum.pForum',
				title : '论坛版块',
				type : '0',
				name : 'pForum'
			}
		},
		buttons : {
			'mkForum.docForum.btnSave' : {
				key : 'mkForum.docForum.btnSave',
				text : '保存',
				icon : 'icon-sys-btnsave',
				handler : function(){					
	this.document.submitDocument();					
},
				name : 'btnSave'
			},
			'mkForum.docForum.btnConfirm' : {
				key : 'mkForum.docForum.btnConfirm',
				text : '确定',
				icon : 'icon-sys-btnconfirm',
				handler : function(){					
	this.document.confirmDocument();					
},
				name : 'btnConfirm'
			}
		}
	}
,
	'mkMail.docAccount' : {
		key : 'mkMail.docAccount',
		name : 'docAccount',
		title : '邮件帐号',
		tablename : 'T_MK_APP_MAIL_ACCOUNT',
		config : {"height":350,"width":500},
		panels : {
			'mkMail.docAccount.pAccount' : {
				key : 'mkMail.docAccount.pAccount',
				title : '邮件帐号',
				type : '0',
				name : 'pAccount'
			}
		},
		buttons : {
			'mkMail.docAccount.btnDelete' : {
				key : 'mkMail.docAccount.btnDelete',
				text : '删除',
				icon : 'icon-sys-btndelete',
				handler : function(){					
	this.document.deleteDocument();					
},
				name : 'btnDelete'
			},
			'mkMail.docAccount.btnSave' : {
				key : 'mkMail.docAccount.btnSave',
				text : '保存',
				icon : 'icon-sys-btnsave',
				handler : function(){					
	this.document.submitDocument();					
},
				name : 'btnSave'
			}
		}
	}
,
	'mkScore.docScoreUser' : {
		key : 'mkScore.docScoreUser',
		name : 'docScoreUser',
		title : '员工积分档案',
		tablename : 'T_MK_BPC_SCORE_USER',
		config : {},
		panels : {
			'mkScore.docScoreUser.pScoreUser' : {
				key : 'mkScore.docScoreUser.pScoreUser',
				title : '积分档案',
				type : '0',
				config : {},
				name : 'pScoreUser'
			}
		},
		buttons : {
			'mkScore.docScoreUser.btnSave' : {
				key : 'mkScore.docScoreUser.btnSave',
				text : '保存',
				icon : 'icon-sys-btnsave',
				handler : function(){					
 var panel = this.document.items.get(0);					
 var form = panel.items.get(0).getForm();					
 var state = form.findField("F_STATE").getValue();					
 var entry_time = form.findField("F_ENTRY_TIME").getValue();					
 var quit_time = form.findField("F_QUIT_TIME").getValue(); 						
 					
 if(state =="无效"){					
    if(quit_time ==null || quit_time ==''){					
	 Ext.MessageBox.alert("提示","请指定无效时间!");					
    }else if(quit_time < entry_time){					
	 Ext.MessageBox.alert("提示","离职时间必须晚于入职时间!");					
    }else{					
	 this.document.submitDocument();					
    }					
 }else{					
    if(entry_time ==null || entry_time =='')					
     {					
        Ext.MessageBox.alert("提示","入职时间为空!");					
     }else {					
form.findField("F_QUIT_TIME").setValue(""); 					
	this.document.submitDocument();					
     }					
 }					
},
				name : 'btnSave'
			},
			'mkScore.docScoreUser.btnDelete' : {
				key : 'mkScore.docScoreUser.btnDelete',
				text : '删除',
				icon : 'icon-sys-btndelete',
				handler : function(){					
	this.document.deleteDocument();					
},
				name : 'btnDelete'
			},
			'mkScore.docScoreUser.btnConfirm' : {
				key : 'mkScore.docScoreUser.btnConfirm',
				text : '确定',
				icon : 'icon-sys-btnconfirm',
				handler : 					
function(){					
 var panel = this.document.items.get(0);					
 var form = panel.items.get(0).getForm();					
 var state = form.findField("F_STATE").getValue();					
 var entry_time = form.findField("F_ENTRY_TIME").getValue();					
 var quit_time = form.findField("F_QUIT_TIME").getValue(); 						
					
 if(state =="无效"){					
    if(quit_time ==null || quit_time ==''){					
	 Ext.MessageBox.alert("提示","请指定离职时间!");					
    }else if(quit_time < entry_time){					
	 Ext.MessageBox.alert("提示","离职时间必须晚于入职时间!");					
    }else{					
	 this.document.confirmDocument();						
    }					
 }else{					
    if(entry_time ==null || entry_time =='')					
     {					
      	 Ext.MessageBox.alert("提示","入职时间为空!");					
     }else{  form.findField("F_QUIT_TIME").setValue(""); 					
	 this.document.confirmDocument(); 						
     }					
 }					
},
				name : 'btnConfirm'
			}
		}
	}
,
	'mkWorkReport.docWorkReportRead' : {
		key : 'mkWorkReport.docWorkReportRead',
		name : 'docWorkReportRead',
		title : '工作简报',
		tablename : 'T_MK_APP_WORKREPORT',
		icon : 'icon-app-mkoa-workreport',
		config : {"width":800,"height":600},
		panels : {
			'mkWorkReport.docWorkReportRead.pWorkReportRead' : {
				key : 'mkWorkReport.docWorkReportRead.pWorkReportRead',
				title : '工作简报',
				icon : 'icon-sys-info',
				type : '99',
				name : 'pWorkReportRead'
			}
		},
		buttons : {
			'mkWorkReport.docWorkReportRead.btnDiscuss' : {
				key : 'mkWorkReport.docWorkReportRead.btnDiscuss',
				text : '参与讨论',
				icon : 'icon-sys-btndiscuss',
				handler : function(){					
	MixkyApp.desktop.openDocument('mkWorkReport.docWrComment', 0, {F_REPORT_ID:this.document.documentid});					
},
				name : 'btnDiscuss'
			}
		}
	}
,
	'mkAddressBook.docNameCard' : {
		key : 'mkAddressBook.docNameCard',
		name : 'docNameCard',
		title : '个人名片',
		tablename : 'T_MK_APP_NAMECARD',
		icon : 'icon-app-mkoa-namecard',
		config : {"width":650,"height":520},
		panels : {
			'mkAddressBook.docNameCard.pInfo' : {
				key : 'mkAddressBook.docNameCard.pInfo',
				title : '详细信息',
				icon : 'null',
				type : '0',
				name : 'pInfo'
			}
		},
		buttons : {
			'mkAddressBook.docNameCard.btnSave' : {
				key : 'mkAddressBook.docNameCard.btnSave',
				text : '保存',
				icon : 'icon-sys-btnsave',
				handler : function(){					
	this.document.submitDocument();					
},
				name : 'btnSave'
			},
			'mkAddressBook.docNameCard.btnConfirm' : {
				key : 'mkAddressBook.docNameCard.btnConfirm',
				text : '确定',
				icon : 'icon-sys-btnconfirm',
				handler : function(){					
	this.document.confirmDocument();					
},
				name : 'btnConfirm'
			},
			'mkAddressBook.docNameCard.btnDelete' : {
				key : 'mkAddressBook.docNameCard.btnDelete',
				text : '删除',
				icon : 'icon-sys-btndelete',
				handler : function(){					
	this.document.deleteDocument();					
},
				name : 'btnDelete'
			}
		}
	}

}