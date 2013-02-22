Ext.namespace("Mixky.designtool");
Mixky.designtool.PROVIDER_BASE_URL=window.location.protocol+"//"+window.location.host+(window.location.pathname.lastIndexOf("home.do")>-1?window.location.pathname.substring(0,window.location.pathname.lastIndexOf("/")):window.location.pathname)+"/direct";
Mixky.designtool.POLLING_URLS={};
Mixky.designtool.REMOTING_API={url:Mixky.designtool.PROVIDER_BASE_URL,type:"remoting",actions:{MixkyLibDirect:[{name:"buildJsFile",len:1,formHandler:false},{name:"getNewTableRecordId",len:1,formHandler:false}],DesignToolDirect:[{name:"getDocumentAuthorityPanel",len:1,formHandler:false},{name:"buildDBTableField",len:1,formHandler:false},{name:"forceSaveObject",len:1,formHandler:false},{name:"buildTableField",len:2,formHandler:false},{name:"saveObject",len:2,formHandler:false},{name:"getDocumentAuthorityTarget",len:1,formHandler:false},{name:"loadObject",len:1,formHandler:false},{name:"pasteObject",len:3,formHandler:false},{name:"getSubObjectList",len:2,formHandler:false},{name:"getOutline",len:2,formHandler:false},{name:"importFlowStates",len:1,formHandler:false},{name:"addDocumentAuthorityMap",len:4,formHandler:false},{name:"deleteObject",len:1,formHandler:false},{name:"renameObject",len:2,formHandler:false},{name:"saveModuleAuthorities",len:2,formHandler:false},{name:"getDesignObjectList",len:2,formHandler:false},{name:"getModuleAuthority",len:1,formHandler:false},{name:"getDocumentAuthorityMapTree",len:2,formHandler:false},{name:"addObject",len:3,formHandler:false},{name:"importFlowIdentities",len:1,formHandler:false},{name:"deleteObjects",len:1,formHandler:false}],PatchDirect:[{name:"fixModuleChildrenBugPatch",len:0,formHandler:false}],DesignObjectTemplateDirect:[{name:"loadTemplateFile",len:1,formHandler:false},{name:"getTemplateList",len:1,formHandler:false},{name:"saveTemplateFile",len:1,formHandler:true},{name:"deleteTemplateFiles",len:1,formHandler:false},{name:"pasteAsTemplate",len:2,formHandler:false},{name:"createTemplate",len:1,formHandler:true}],DesignToolConfigurationDirect:[{name:"saveConfiguration",len:1,formHandler:false},{name:"loadConfiguration",len:0,formHandler:false}],OrganizationDirect:[{name:"getDeptTree",len:2,formHandler:false},{name:"getRoleManageList",len:1,formHandler:false},{name:"getRoleTree",len:1,formHandler:false},{name:"saveRole",len:1,formHandler:false},{name:"getUserDeptManageList",len:1,formHandler:false},{name:"saveUser",len:1,formHandler:false},{name:"getExpressionDisplay",len:1,formHandler:false},{name:"getAllUserList",len:0,formHandler:false},{name:"saveDept",len:1,formHandler:false},{name:"getUserList",len:1,formHandler:false},{name:"getOrgChartData",len:0,formHandler:false},{name:"getDeptManageList",len:1,formHandler:false},{name:"getOrganizationTree",len:2,formHandler:false},{name:"getExpressionData",len:2,formHandler:false},{name:"resetUserPassword",len:1,formHandler:false},{name:"loadSelectedUsers",len:2,formHandler:false},{name:"getUserRoleManageList",len:1,formHandler:false}],DesktopDirect:[{name:"getMenuTree",len:2,formHandler:false},{name:"getAllModuleRoleAuthList",len:0,formHandler:false},{name:"saveMenu",len:1,formHandler:false},{name:"saveMenuAuth",len:3,formHandler:false},{name:"saveModuleRoleAuth",len:3,formHandler:false},{name:"getMenuManageList",len:1,formHandler:false},{name:"getAllMenuList",len:0,formHandler:false}],DictionaryDirect:[{name:"getDictionaryManageList",len:1,formHandler:false},{name:"getDictionaryTree",len:1,formHandler:false},{name:"saveDictionary",len:1,formHandler:false}],FlowDesignerDirect:[{name:"setFlowLocked",len:2,formHandler:false},{name:"updateCaption",len:2,formHandler:false},{name:"insertNode",len:4,formHandler:false},{name:"getFlowCells",len:2,formHandler:false},{name:"insertRoute",len:3,formHandler:false},{name:"removeCell",len:2,formHandler:false},{name:"updateRouteTarget",len:3,formHandler:false},{name:"saveFlowPosition",len:2,formHandler:false},{name:"getUserOpinionLog",len:2,formHandler:false}]}};