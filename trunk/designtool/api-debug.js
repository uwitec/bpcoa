/**********************************************************************
 * 
 * Code generated automatically by DirectJNgine
 * Copyright (c) 2009, Pedro Agull¨® Soliveres
 * 
 * DO NOT MODIFY MANUALLY!!
 * 
 **********************************************************************/

Ext.namespace( 'Mixky.designtool');

Mixky.designtool.PROVIDER_BASE_URL=window.location.protocol + '//' + window.location.host + (window.location.pathname.lastIndexOf('home.do') > -1 ? window.location.pathname.substring(0,window.location.pathname.lastIndexOf('/')) : window.location.pathname) + '/direct';

Mixky.designtool.POLLING_URLS = {
}

Mixky.designtool.REMOTING_API = {
  url: Mixky.designtool.PROVIDER_BASE_URL,
  type: 'remoting',
  actions: {
    MixkyLibDirect: [
      {
        name: 'buildJsFile'/*(String) => com.google.gson.JsonObject */,
        len: 1,
        formHandler: false
      },
      {
        name: 'getNewTableRecordId'/*(String) => com.google.gson.JsonObject */,
        len: 1,
        formHandler: false
      }
    ],
    DesignToolDirect: [
      {
        name: 'getDocumentAuthorityPanel'/*(String) => com.google.gson.JsonObject */,
        len: 1,
        formHandler: false
      },
      {
        name: 'buildDBTableField'/*(String) => com.google.gson.JsonObject */,
        len: 1,
        formHandler: false
      },
      {
        name: 'forceSaveObject'/*(String) => com.google.gson.JsonObject */,
        len: 1,
        formHandler: false
      },
      {
        name: 'buildTableField'/*(String, String) => com.google.gson.JsonObject */,
        len: 2,
        formHandler: false
      },
      {
        name: 'saveObject'/*(String, com.google.gson.JsonObject) => com.google.gson.JsonObject */,
        len: 2,
        formHandler: false
      },
      {
        name: 'getDocumentAuthorityTarget'/*(String) => com.google.gson.JsonObject */,
        len: 1,
        formHandler: false
      },
      {
        name: 'loadObject'/*(String) => com.google.gson.JsonObject */,
        len: 1,
        formHandler: false
      },
      {
        name: 'pasteObject'/*(String, String, String) => com.google.gson.JsonObject */,
        len: 3,
        formHandler: false
      },
      {
        name: 'getSubObjectList'/*(String, String) => com.google.gson.JsonObject */,
        len: 2,
        formHandler: false
      },
      {
        name: 'getOutline'/*(String, String) => com.google.gson.JsonArray */,
        len: 2,
        formHandler: false
      },
      {
        name: 'importFlowStates'/*(String) => com.google.gson.JsonObject */,
        len: 1,
        formHandler: false
      },
      {
        name: 'addDocumentAuthorityMap'/*(String, String, String, String) => com.google.gson.JsonObject */,
        len: 4,
        formHandler: false
      },
      {
        name: 'deleteObject'/*(String) => com.google.gson.JsonObject */,
        len: 1,
        formHandler: false
      },
      {
        name: 'renameObject'/*(String, String) => com.google.gson.JsonObject */,
        len: 2,
        formHandler: false
      },
      {
        name: 'saveModuleAuthorities'/*(String, com.google.gson.JsonObject) => com.google.gson.JsonObject */,
        len: 2,
        formHandler: false
      },
      {
        name: 'getDesignObjectList'/*(String, String) => com.google.gson.JsonObject */,
        len: 2,
        formHandler: false
      },
      {
        name: 'getModuleAuthority'/*(String) => com.google.gson.JsonObject */,
        len: 1,
        formHandler: false
      },
      {
        name: 'getDocumentAuthorityMapTree'/*(String, String) => com.google.gson.JsonArray */,
        len: 2,
        formHandler: false
      },
      {
        name: 'addObject'/*(String, String, String) => com.google.gson.JsonObject */,
        len: 3,
        formHandler: false
      },
      {
        name: 'importFlowIdentities'/*(String) => com.google.gson.JsonObject */,
        len: 1,
        formHandler: false
      },
      {
        name: 'deleteObjects'/*(com.google.gson.JsonArray) => com.google.gson.JsonObject */,
        len: 1,
        formHandler: false
      }
    ],
    PatchDirect: [
      {
        name: 'fixModuleChildrenBugPatch'/*() => com.google.gson.JsonObject */,
        len: 0,
        formHandler: false
      }
    ],
    DesignObjectTemplateDirect: [
      {
        name: 'loadTemplateFile'/*(String) => com.google.gson.JsonObject */,
        len: 1,
        formHandler: false
      },
      {
        name: 'getTemplateList'/*(String) => com.google.gson.JsonObject */,
        len: 1,
        formHandler: false
      },
      {
        name: 'saveTemplateFile'/*() => com.google.gson.JsonObject -- FORM HANDLER */,
        len: 1,
        formHandler: true
      },
      {
        name: 'deleteTemplateFiles'/*(com.google.gson.JsonArray) => com.google.gson.JsonObject */,
        len: 1,
        formHandler: false
      },
      {
        name: 'pasteAsTemplate'/*(String, String) => com.google.gson.JsonObject */,
        len: 2,
        formHandler: false
      },
      {
        name: 'createTemplate'/*() => com.google.gson.JsonObject -- FORM HANDLER */,
        len: 1,
        formHandler: true
      }
    ],
    DesignToolConfigurationDirect: [
      {
        name: 'saveConfiguration'/*(com.google.gson.JsonObject) => com.google.gson.JsonObject */,
        len: 1,
        formHandler: false
      },
      {
        name: 'loadConfiguration'/*() => com.google.gson.JsonObject */,
        len: 0,
        formHandler: false
      }
    ],
    OrganizationDirect: [
      {
        name: 'getDeptTree'/*(String, String) => com.google.gson.JsonArray */,
        len: 2,
        formHandler: false
      },
      {
        name: 'getRoleManageList'/*(String) => com.google.gson.JsonObject */,
        len: 1,
        formHandler: false
      },
      {
        name: 'getRoleTree'/*(String) => com.google.gson.JsonArray */,
        len: 1,
        formHandler: false
      },
      {
        name: 'saveRole'/*(com.google.gson.JsonObject) => com.google.gson.JsonObject */,
        len: 1,
        formHandler: false
      },
      {
        name: 'getUserDeptManageList'/*(String) => com.google.gson.JsonObject */,
        len: 1,
        formHandler: false
      },
      {
        name: 'saveUser'/*(com.google.gson.JsonObject) => com.google.gson.JsonObject */,
        len: 1,
        formHandler: false
      },
      {
        name: 'getExpressionDisplay'/*(String[]) => com.google.gson.JsonObject */,
        len: 1,
        formHandler: false
      },
      {
        name: 'getAllUserList'/*() => com.google.gson.JsonObject */,
        len: 0,
        formHandler: false
      },
      {
        name: 'saveDept'/*(com.google.gson.JsonObject) => com.google.gson.JsonObject */,
        len: 1,
        formHandler: false
      },
      {
        name: 'getUserList'/*(String) => com.google.gson.JsonObject */,
        len: 1,
        formHandler: false
      },
      {
        name: 'getOrgChartData'/*() => com.google.gson.JsonObject */,
        len: 0,
        formHandler: false
      },
      {
        name: 'getDeptManageList'/*(String) => com.google.gson.JsonObject */,
        len: 1,
        formHandler: false
      },
      {
        name: 'getOrganizationTree'/*(String, String) => com.google.gson.JsonArray */,
        len: 2,
        formHandler: false
      },
      {
        name: 'getExpressionData'/*(String, String) => com.google.gson.JsonObject */,
        len: 2,
        formHandler: false
      },
      {
        name: 'resetUserPassword'/*(long) => com.google.gson.JsonObject */,
        len: 1,
        formHandler: false
      },
      {
        name: 'loadSelectedUsers'/*(String, String) => com.google.gson.JsonObject */,
        len: 2,
        formHandler: false
      },
      {
        name: 'getUserRoleManageList'/*(String) => com.google.gson.JsonObject */,
        len: 1,
        formHandler: false
      }
    ],
    DesktopDirect: [
      {
        name: 'getMenuTree'/*(String, String) => com.google.gson.JsonArray */,
        len: 2,
        formHandler: false
      },
      {
        name: 'getAllModuleRoleAuthList'/*() => com.google.gson.JsonObject */,
        len: 0,
        formHandler: false
      },
      {
        name: 'saveMenu'/*(com.google.gson.JsonObject) => com.google.gson.JsonObject */,
        len: 1,
        formHandler: false
      },
      {
        name: 'saveMenuAuth'/*(long, String, String) => com.google.gson.JsonObject */,
        len: 3,
        formHandler: false
      },
      {
        name: 'saveModuleRoleAuth'/*(String, String, String) => com.google.gson.JsonObject */,
        len: 3,
        formHandler: false
      },
      {
        name: 'getMenuManageList'/*(String) => com.google.gson.JsonObject */,
        len: 1,
        formHandler: false
      },
      {
        name: 'getAllMenuList'/*() => com.google.gson.JsonObject */,
        len: 0,
        formHandler: false
      }
    ],
    DictionaryDirect: [
      {
        name: 'getDictionaryManageList'/*(long) => com.google.gson.JsonObject */,
        len: 1,
        formHandler: false
      },
      {
        name: 'getDictionaryTree'/*(String) => com.google.gson.JsonArray */,
        len: 1,
        formHandler: false
      },
      {
        name: 'saveDictionary'/*(com.google.gson.JsonObject) => com.google.gson.JsonObject */,
        len: 1,
        formHandler: false
      }
    ],
    FlowDesignerDirect: [
      {
        name: 'setFlowLocked'/*(String, boolean) => com.google.gson.JsonObject */,
        len: 2,
        formHandler: false
      },
      {
        name: 'updateCaption'/*(String, String) => com.google.gson.JsonObject */,
        len: 2,
        formHandler: false
      },
      {
        name: 'insertNode'/*(String, String, int, int) => com.google.gson.JsonObject */,
        len: 4,
        formHandler: false
      },
      {
        name: 'getFlowCells'/*(String, boolean) => com.google.gson.JsonObject */,
        len: 2,
        formHandler: false
      },
      {
        name: 'insertRoute'/*(String, String, String) => com.google.gson.JsonObject */,
        len: 3,
        formHandler: false
      },
      {
        name: 'removeCell'/*(String, String) => com.google.gson.JsonObject */,
        len: 2,
        formHandler: false
      },
      {
        name: 'updateRouteTarget'/*(String, String, String) => com.google.gson.JsonObject */,
        len: 3,
        formHandler: false
      },
      {
        name: 'saveFlowPosition'/*(String, com.google.gson.JsonObject) => com.google.gson.JsonObject */,
        len: 2,
        formHandler: false
      },
      {
        name: 'getUserOpinionLog'/*(long, String) => com.google.gson.JsonObject */,
        len: 2,
        formHandler: false
      }
    ]
  }
}

