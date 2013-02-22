/**********************************************************************
 * 
 * Code generated automatically by DirectJNgine
 * Copyright (c) 2009, Pedro Agull¨® Soliveres
 * 
 * DO NOT MODIFY MANUALLY!!
 * 
 **********************************************************************/

Ext.namespace( 'Mixky.mkoa');

Mixky.mkoa.PROVIDER_BASE_URL=window.location.protocol + '//' + window.location.host + (window.location.pathname.lastIndexOf('home.do') > -1 ? window.location.pathname.substring(0,window.location.pathname.lastIndexOf('/')) : window.location.pathname) + '/direct';

Mixky.mkoa.POLLING_URLS = {
}

Mixky.mkoa.REMOTING_API = {
  url: Mixky.mkoa.PROVIDER_BASE_URL,
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
    OrganizationAppDirect: [
      {
        name: 'getDeptTree'/*(String, String) => com.google.gson.JsonArray */,
        len: 2,
        formHandler: false
      },
      {
        name: 'loadSelectedExpressions'/*(String, String) => com.google.gson.JsonObject */,
        len: 2,
        formHandler: false
      },
      {
        name: 'getUserTree'/*(String, String) => com.google.gson.JsonArray */,
        len: 2,
        formHandler: false
      },
      {
        name: 'getOrganizationTree'/*(String, String) => com.google.gson.JsonArray */,
        len: 2,
        formHandler: false
      },
      {
        name: 'getDeptUserTree'/*(String, String) => com.google.gson.JsonArray */,
        len: 2,
        formHandler: false
      },
      {
        name: 'getUserList'/*(String) => com.google.gson.JsonObject */,
        len: 1,
        formHandler: false
      },
      {
        name: 'getExpressionData'/*(String, String) => com.google.gson.JsonObject */,
        len: 2,
        formHandler: false
      },
      {
        name: 'changePassword'/*(String, String) => com.google.gson.JsonObject */,
        len: 2,
        formHandler: false
      },
      {
        name: 'loadSelectedUsers'/*(String, String, String) => com.google.gson.JsonObject */,
        len: 3,
        formHandler: false
      }
    ],
    DesktopAppDirect: [
      {
        name: 'getUserConfig'/*(String) => com.google.gson.JsonObject */,
        len: 1,
        formHandler: false
      },
      {
        name: 'getWallpapers'/*() => com.google.gson.JsonObject */,
        len: 0,
        formHandler: false
      },
      {
        name: 'saveUserConfig'/*(String, com.google.gson.JsonObject) => com.google.gson.JsonObject */,
        len: 2,
        formHandler: false
      },
      {
        name: 'getShortcuts'/*(String) => com.google.gson.JsonArray */,
        len: 1,
        formHandler: false
      },
      {
        name: 'getSubjects'/*(String) => com.google.gson.JsonArray */,
        len: 1,
        formHandler: false
      },
      {
        name: 'deleteWallPaper'/*(String, String) => com.google.gson.JsonObject */,
        len: 2,
        formHandler: false
      },
      {
        name: 'delUserConfig'/*(String) => com.google.gson.JsonObject */,
        len: 1,
        formHandler: false
      },
      {
        name: 'getQuickStarts'/*(String) => com.google.gson.JsonArray */,
        len: 1,
        formHandler: false
      },
      {
        name: 'getDesktopStyles'/*() => com.google.gson.JsonObject */,
        len: 0,
        formHandler: false
      }
    ],
    ModuleAppDirect: [
      {
        name: 'getModuleTree'/*(String, com.google.gson.JsonObject) => com.google.gson.JsonArray */,
        len: 2,
        formHandler: false
      },
      {
        name: 'SaveDataToDictionary'/*(com.google.gson.JsonObject) => com.google.gson.JsonObject */,
        len: 1,
        formHandler: false
      }
    ],
    ViewAppDirect: [
      {
        name: 'getViewList'/*(String, int, int, int, String, String, com.google.gson.JsonObject) => com.google.gson.JsonObject */,
        len: 7,
        formHandler: false
      },
      {
        name: 'updateTodoMessageState'/*(long) => com.google.gson.JsonObject */,
        len: 1,
        formHandler: false
      }
    ],
    DocumentAppDirect: [
      {
        name: 'submit'/*() => com.google.gson.JsonObject -- FORM HANDLER */,
        len: 1,
        formHandler: true
      },
      {
        name: 'getUserSignDisplay'/*(String) => com.google.gson.JsonObject */,
        len: 1,
        formHandler: false
      },
      {
        name: 'submitSimpleForm'/*() => com.google.gson.JsonObject -- FORM HANDLER */,
        len: 1,
        formHandler: true
      },
      {
        name: 'getClobContext'/*(String, String, long) => com.google.gson.JsonObject */,
        len: 3,
        formHandler: false
      },
      {
        name: 'load'/*(String, long, com.google.gson.JsonObject) => com.google.gson.JsonObject */,
        len: 3,
        formHandler: false
      },
      {
        name: 'loadFormData'/*(String, long, com.google.gson.JsonObject) => com.google.gson.JsonObject */,
        len: 3,
        formHandler: false
      },
      {
        name: 'deleteDocument'/*(String, long) => com.google.gson.JsonObject */,
        len: 2,
        formHandler: false
      },
      {
        name: 'setClobContext'/*(String, String, long, String) => com.google.gson.JsonObject */,
        len: 4,
        formHandler: false
      },
      {
        name: 'getPanelButtons'/*(String, long) => com.google.gson.JsonObject */,
        len: 2,
        formHandler: false
      },
      {
        name: 'submitRowForm'/*(String, com.google.gson.JsonObject) => com.google.gson.JsonObject */,
        len: 2,
        formHandler: false
      }
    ],
    FlowAppDirect: [
      {
        name: 'setSign'/*(String, long, String, long) => com.google.gson.JsonObject */,
        len: 4,
        formHandler: false
      },
      {
        name: 'getOpinion'/*(String, long, String) => com.google.gson.JsonObject */,
        len: 3,
        formHandler: false
      },
      {
        name: 'setOpinion'/*(String, long, String, String) => com.google.gson.JsonObject */,
        len: 4,
        formHandler: false
      },
      {
        name: 'getDisplayOpinion'/*(String, long, String) => com.google.gson.JsonObject */,
        len: 3,
        formHandler: false
      },
      {
        name: 'getDisplaySign'/*(String, long, String) => com.google.gson.JsonObject */,
        len: 3,
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
    ],
    MixkyFileDirect: [
      {
        name: 'deleteDocFieldFile'/*(String, long, String, String) => com.google.gson.JsonObject */,
        len: 4,
        formHandler: false
      },
      {
        name: 'deleteDocFile'/*(long) => com.google.gson.JsonObject */,
        len: 1,
        formHandler: false
      },
      {
        name: 'getDocFileList'/*(String, long, String) => com.google.gson.JsonObject */,
        len: 3,
        formHandler: false
      },
      {
        name: 'getDocPanelFileList'/*(String, long) => com.google.gson.JsonObject */,
        len: 2,
        formHandler: false
      }
    ],
    CalendarAppDirect: [
      {
        name: 'deleteEventsByTag'/*(String, long) => com.google.gson.JsonObject */,
        len: 2,
        formHandler: false
      },
      {
        name: 'deleteRepeatEvent'/*(String, long) => com.google.gson.JsonObject */,
        len: 2,
        formHandler: false
      },
      {
        name: 'showOnlyTag'/*(String, long) => com.google.gson.JsonObject */,
        len: 2,
        formHandler: false
      },
      {
        name: 'loadEvents'/*(String, String, String) => com.google.gson.JsonObject */,
        len: 3,
        formHandler: false
      },
      {
        name: 'showAllTag'/*(String) => com.google.gson.JsonObject */,
        len: 1,
        formHandler: false
      },
      {
        name: 'changeDay'/*(String, String, String, boolean) => com.google.gson.JsonObject */,
        len: 4,
        formHandler: false
      },
      {
        name: 'loadTags'/*(String) => com.google.gson.JsonObject */,
        len: 1,
        formHandler: false
      },
      {
        name: 'searchEvents'/*(String, String, int, int) => com.google.gson.JsonObject */,
        len: 4,
        formHandler: false
      },
      {
        name: 'deleteEvent'/*(String, long) => com.google.gson.JsonObject */,
        len: 2,
        formHandler: false
      },
      {
        name: 'updateEvent'/*(String, com.google.gson.JsonObject) => com.google.gson.JsonObject */,
        len: 2,
        formHandler: false
      },
      {
        name: 'loadRepeatEvents'/*(String) => com.google.gson.JsonObject */,
        len: 1,
        formHandler: false
      },
      {
        name: 'updateRepeatEvent'/*(String, com.google.gson.JsonObject) => com.google.gson.JsonObject */,
        len: 2,
        formHandler: false
      },
      {
        name: 'updateTag'/*(String, com.google.gson.JsonObject) => com.google.gson.JsonObject */,
        len: 2,
        formHandler: false
      },
      {
        name: 'deleteTag'/*(String, long) => com.google.gson.JsonObject */,
        len: 2,
        formHandler: false
      },
      {
        name: 'deleteDay'/*(String, String) => com.google.gson.JsonObject */,
        len: 2,
        formHandler: false
      },
      {
        name: 'initialLoad'/*(String) => com.google.gson.JsonObject */,
        len: 1,
        formHandler: false
      }
    ],
    GzzdAppDirect: [
      {
        name: 'addAddressTag'/*(long, String) => com.google.gson.JsonObject */,
        len: 2,
        formHandler: false
      },
      {
        name: 'saveDictionary'/*(com.google.gson.JsonObject) => com.google.gson.JsonObject */,
        len: 1,
        formHandler: false
      }
    ],
    NotifyAppDirect: [
      {
        name: 'addAddressTag'/*(long, String) => com.google.gson.JsonObject */,
        len: 2,
        formHandler: false
      }
    ],
    AddressBookAppDirect: [
      {
        name: 'addMailFromToAddressBook'/*(String) => com.google.gson.JsonObject */,
        len: 1,
        formHandler: false
      },
      {
        name: 'addNameCardTag'/*(String) => com.google.gson.JsonObject */,
        len: 1,
        formHandler: false
      },
      {
        name: 'addAddressTag'/*(long, String) => com.google.gson.JsonObject */,
        len: 2,
        formHandler: false
      },
      {
        name: 'isMailFromExist'/*(String) => com.google.gson.JsonObject */,
        len: 1,
        formHandler: false
      },
      {
        name: 'tagAddressBook'/*(long, String, String) => com.google.gson.JsonObject */,
        len: 3,
        formHandler: false
      },
      {
        name: 'addAddressBookTag'/*(String) => com.google.gson.JsonObject */,
        len: 1,
        formHandler: false
      },
      {
        name: 'initAddressBook'/*() => com.google.gson.JsonObject */,
        len: 0,
        formHandler: false
      }
    ],
    FavoriteAppDirect: [
      {
        name: 'removeFavorite'/*(long) => com.google.gson.JsonObject */,
        len: 1,
        formHandler: false
      },
      {
        name: 'updateFavorite'/*(String, String, String, int) => com.google.gson.JsonObject */,
        len: 4,
        formHandler: false
      },
      {
        name: 'createFavoriteTag'/*(String) => com.google.gson.JsonObject */,
        len: 1,
        formHandler: false
      },
      {
        name: 'getUserFavorites'/*(String) => com.google.gson.JsonObject */,
        len: 1,
        formHandler: false
      },
      {
        name: 'createFavoriteUrl'/*(String) => com.google.gson.JsonObject */,
        len: 1,
        formHandler: false
      }
    ],
    MixkyAppDirect: [
      {
        name: 'deleteMessage'/*(com.google.gson.JsonArray) => com.google.gson.JsonObject */,
        len: 1,
        formHandler: false
      },
      {
        name: 'generateSerialNumber'/*(String) => com.google.gson.JsonObject */,
        len: 1,
        formHandler: false
      }
    ],
    AppFolderDirect: [
      {
        name: 'getNewItemInfo'/*(long, long) => com.google.gson.JsonObject */,
        len: 2,
        formHandler: false
      },
      {
        name: 'deleteFolderItem'/*(long, long) => com.google.gson.JsonObject */,
        len: 2,
        formHandler: false
      },
      {
        name: 'getFolderName'/*(long) => com.google.gson.JsonObject */,
        len: 1,
        formHandler: false
      },
      {
        name: 'getPersonalFolderFullPath'/*(long) => com.google.gson.JsonObject */,
        len: 1,
        formHandler: false
      },
      {
        name: 'searchFolderItems'/*(long, long, String) => com.google.gson.JsonObject */,
        len: 3,
        formHandler: false
      },
      {
        name: 'getShareFolderList'/*(long, long, long) => com.google.gson.JsonObject */,
        len: 3,
        formHandler: false
      },
      {
        name: 'searchShareFolderItems'/*(long, long, String) => com.google.gson.JsonObject */,
        len: 3,
        formHandler: false
      },
      {
        name: 'getPersonalFolderList'/*(long, long) => com.google.gson.JsonObject */,
        len: 2,
        formHandler: false
      },
      {
        name: 'getShareFolders'/*(long) => com.google.gson.JsonObject */,
        len: 1,
        formHandler: false
      },
      {
        name: 'moveFolderItem'/*(long, long) => com.google.gson.JsonObject */,
        len: 2,
        formHandler: false
      }
    ],
    AppKnowledgeDirect: [
      {
        name: 'addViewCount'/*(long) => void */,
        len: 1,
        formHandler: false
      },
      {
        name: 'getKnowledgeComments'/*(long, int, int) => com.google.gson.JsonObject */,
        len: 3,
        formHandler: false
      },
      {
        name: 'evaluate'/*(long, long) => com.google.gson.JsonObject */,
        len: 2,
        formHandler: false
      },
      {
        name: 'getAllTags'/*() => com.google.gson.JsonObject */,
        len: 0,
        formHandler: false
      },
      {
        name: 'getKnowledgeDetail'/*(long) => com.google.gson.JsonObject */,
        len: 1,
        formHandler: false
      },
      {
        name: 'deleteKnowledgeTag'/*(long) => com.google.gson.JsonObject */,
        len: 1,
        formHandler: false
      },
      {
        name: 'topedKnowledge'/*(long, int) => com.google.gson.JsonObject */,
        len: 2,
        formHandler: false
      },
      {
        name: 'deleteComment'/*(long) => com.google.gson.JsonObject */,
        len: 1,
        formHandler: false
      },
      {
        name: 'deleteKnowledge'/*(long) => void */,
        len: 1,
        formHandler: false
      },
      {
        name: 'addCommentCount'/*(long) => void */,
        len: 1,
        formHandler: false
      }
    ],
    AppForumDirect: [
      {
        name: 'addViewCount'/*(String) => void */,
        len: 1,
        formHandler: false
      },
      {
        name: 'delelteCategory'/*(String) => void */,
        len: 1,
        formHandler: false
      },
      {
        name: 'openSubject'/*(String) => void */,
        len: 1,
        formHandler: false
      },
      {
        name: 'getCategoryForumsViewJson'/*(long, long) => com.google.gson.JsonObject */,
        len: 2,
        formHandler: false
      },
      {
        name: 'closeSubject'/*(String) => void */,
        len: 1,
        formHandler: false
      },
      {
        name: 'topSubject'/*(String, int) => void */,
        len: 2,
        formHandler: false
      },
      {
        name: 'getAllForums'/*() => com.google.gson.JsonObject */,
        len: 0,
        formHandler: false
      },
      {
        name: 'getCategoryForums'/*(long) => com.google.gson.JsonObject */,
        len: 1,
        formHandler: false
      },
      {
        name: 'getForumSubjectJsonObj'/*(String) => com.google.gson.JsonObject */,
        len: 1,
        formHandler: false
      },
      {
        name: 'isForumAdmin'/*(long) => com.google.gson.JsonObject */,
        len: 1,
        formHandler: false
      },
      {
        name: 'favouriteSubject'/*(String, int) => void */,
        len: 2,
        formHandler: false
      },
      {
        name: 'delelteForum'/*(String) => void */,
        len: 1,
        formHandler: false
      },
      {
        name: 'getTopicForumInfo'/*(long) => com.google.gson.JsonObject */,
        len: 1,
        formHandler: false
      },
      {
        name: 'getCategorysViewJson'/*(long) => com.google.gson.JsonObject */,
        len: 1,
        formHandler: false
      },
      {
        name: 'getAllCategorys'/*() => com.google.gson.JsonObject */,
        len: 0,
        formHandler: false
      },
      {
        name: 'getForumInfo'/*(long) => com.google.gson.JsonObject */,
        len: 1,
        formHandler: false
      },
      {
        name: 'getTopicList'/*(long, long, int, int) => com.google.gson.JsonObject */,
        len: 4,
        formHandler: false
      },
      {
        name: 'getForumSubjectType'/*() => com.google.gson.JsonObject */,
        len: 0,
        formHandler: false
      },
      {
        name: 'getCategoryInfo'/*(long) => com.google.gson.JsonObject */,
        len: 1,
        formHandler: false
      }
    ],
    FinanceAppDirect: [
      {
        name: 'getFinancePortletStat'/*(String) => com.google.gson.JsonObject */,
        len: 1,
        formHandler: false
      },
      {
        name: 'getFinanceStat'/*(String) => com.google.gson.JsonObject */,
        len: 1,
        formHandler: false
      },
      {
        name: 'doBalance'/*(String, String) => com.google.gson.JsonObject */,
        len: 2,
        formHandler: false
      },
      {
        name: 'getFinanceTagStat'/*(String) => com.google.gson.JsonObject */,
        len: 1,
        formHandler: false
      },
      {
        name: 'getFinanceDetailStat'/*(String) => com.google.gson.JsonObject */,
        len: 1,
        formHandler: false
      },
      {
        name: 'getDefaultBalanceDate'/*() => com.google.gson.JsonObject */,
        len: 0,
        formHandler: false
      }
    ],
    AttendanceAppDirect: [
      {
        name: 'initWorkDay'/*(String, boolean) => com.google.gson.JsonObject */,
        len: 2,
        formHandler: false
      },
      {
        name: 'saveWorkTime'/*(String, String) => com.google.gson.JsonObject */,
        len: 2,
        formHandler: false
      },
      {
        name: 'getMonthDaySetting'/*(String) => com.google.gson.JsonObject */,
        len: 1,
        formHandler: false
      },
      {
        name: 'setWorkDay'/*(String, int) => com.google.gson.JsonObject */,
        len: 2,
        formHandler: false
      },
      {
        name: 'getWorkTime'/*() => com.google.gson.JsonObject */,
        len: 0,
        formHandler: false
      }
    ],
    AppMailDirect: [
      {
        name: 'getAddressBookTree'/*(String) => com.google.gson.JsonArray */,
        len: 1,
        formHandler: false
      },
      {
        name: 'getAllMailAddressFromDeptId'/*(String) => com.google.gson.JsonObject */,
        len: 1,
        formHandler: false
      },
      {
        name: 'moveMail'/*(long, long) => com.google.gson.JsonObject */,
        len: 2,
        formHandler: false
      },
      {
        name: 'loadSignature'/*() => com.google.gson.JsonObject */,
        len: 0,
        formHandler: false
      },
      {
        name: 'saveSignature'/*(int, String) => com.google.gson.JsonObject */,
        len: 2,
        formHandler: false
      },
      {
        name: 'tagMails'/*(String, long, boolean) => com.google.gson.JsonObject */,
        len: 3,
        formHandler: false
      },
      {
        name: 'deleteMails'/*(String, boolean) => com.google.gson.JsonObject */,
        len: 2,
        formHandler: false
      },
      {
        name: 'tagMail'/*(long, long, boolean) => com.google.gson.JsonObject */,
        len: 3,
        formHandler: false
      },
      {
        name: 'moveMails'/*(String, long) => com.google.gson.JsonObject */,
        len: 2,
        formHandler: false
      },
      {
        name: 'readMail'/*(long) => void */,
        len: 1,
        formHandler: false
      },
      {
        name: 'addNewTag'/*(String) => com.google.gson.JsonObject */,
        len: 1,
        formHandler: false
      },
      {
        name: 'getAddressBookList'/*(String) => com.google.gson.JsonObject */,
        len: 1,
        formHandler: false
      },
      {
        name: 'loadDraft'/*(long, String) => com.google.gson.JsonObject */,
        len: 2,
        formHandler: false
      },
      {
        name: 'submitDraft'/*() => com.google.gson.JsonObject -- FORM HANDLER */,
        len: 1,
        formHandler: true
      },
      {
        name: 'deleteMail'/*(long) => com.google.gson.JsonObject */,
        len: 1,
        formHandler: false
      },
      {
        name: 'deleteTag'/*(long) => com.google.gson.JsonObject */,
        len: 1,
        formHandler: false
      },
      {
        name: 'fetMail'/*() => com.google.gson.JsonObject */,
        len: 0,
        formHandler: false
      },
      {
        name: 'queryEmailAddress'/*(String) => com.google.gson.JsonObject */,
        len: 1,
        formHandler: false
      }
    ],
    AppMsDirect: [
      {
        name: 'saveUserConfig'/*() => com.google.gson.JsonObject -- FORM HANDLER */,
        len: 1,
        formHandler: true
      },
      {
        name: 'saveSysConfig'/*() => com.google.gson.JsonObject -- FORM HANDLER */,
        len: 1,
        formHandler: true
      },
      {
        name: 'queryPhone'/*(String) => com.google.gson.JsonObject */,
        len: 1,
        formHandler: false
      },
      {
        name: 'sendMsg'/*() => com.google.gson.JsonObject -- FORM HANDLER */,
        len: 1,
        formHandler: true
      },
      {
        name: 'getAddressBookList'/*(String) => com.google.gson.JsonObject */,
        len: 1,
        formHandler: false
      },
      {
        name: 'loadUserConfig'/*() => com.google.gson.JsonObject */,
        len: 0,
        formHandler: false
      },
      {
        name: 'getMsStat'/*(String) => com.google.gson.JsonObject */,
        len: 1,
        formHandler: false
      },
      {
        name: 'getSysConfig'/*() => com.google.gson.JsonObject */,
        len: 0,
        formHandler: false
      }
    ],
    WorklogAppDirect: [
      {
        name: 'getWeekWorklogs'/*(long, String) => com.google.gson.JsonObject */,
        len: 2,
        formHandler: false
      },
      {
        name: 'getDayWorklogs'/*(long, String) => com.google.gson.JsonObject */,
        len: 2,
        formHandler: false
      },
      {
        name: 'importFormCalendar'/*(String) => com.google.gson.JsonObject */,
        len: 1,
        formHandler: false
      },
      {
        name: 'getWorklogStat'/*(String) => com.google.gson.JsonObject */,
        len: 1,
        formHandler: false
      }
    ],
    AppWorkReportDirect: [
      {
        name: 'getWorkReportComments'/*(long) => com.google.gson.JsonObject */,
        len: 1,
        formHandler: false
      },
      {
        name: 'getWorkReportDetail'/*(long) => com.google.gson.JsonObject */,
        len: 1,
        formHandler: false
      },
      {
        name: 'readWorkReport'/*(long) => void */,
        len: 1,
        formHandler: false
      }
    ],
    AdminAppDirect: [
      {
        name: 'getDictionarys'/*(String) => com.google.gson.JsonArray */,
        len: 1,
        formHandler: false
      },
      {
        name: 'setHideDayTips'/*(boolean) => com.google.gson.JsonObject */,
        len: 1,
        formHandler: false
      },
      {
        name: 'registerProduct'/*(String) => com.google.gson.JsonObject */,
        len: 1,
        formHandler: false
      },
      {
        name: 'saveRole'/*(com.google.gson.JsonObject) => com.google.gson.JsonObject */,
        len: 1,
        formHandler: false
      },
      {
        name: 'saveDictionaryData'/*(com.google.gson.JsonObject) => com.google.gson.JsonObject */,
        len: 1,
        formHandler: false
      },
      {
        name: 'saveModuleRoleAuth'/*(String, String, String) => com.google.gson.JsonObject */,
        len: 3,
        formHandler: false
      },
      {
        name: 'buildDictionaryFile'/*() => com.google.gson.JsonObject */,
        len: 0,
        formHandler: false
      },
      {
        name: 'getModuleRoleAuths'/*() => com.google.gson.JsonObject */,
        len: 0,
        formHandler: false
      },
      {
        name: 'getDictionaryDatas'/*(long) => com.google.gson.JsonObject */,
        len: 1,
        formHandler: false
      },
      {
        name: 'getRegisterCode'/*(String) => com.google.gson.JsonObject */,
        len: 1,
        formHandler: false
      },
      {
        name: 'setConfigration'/*(com.google.gson.JsonObject) => com.google.gson.JsonObject */,
        len: 1,
        formHandler: false
      },
      {
        name: 'getRoleOrUsers'/*(long) => com.google.gson.JsonObject */,
        len: 1,
        formHandler: false
      },
      {
        name: 'getDayTip'/*(int) => com.google.gson.JsonObject */,
        len: 1,
        formHandler: false
      },
      {
        name: 'getDayTipByIndex'/*(int) => com.google.gson.JsonObject */,
        len: 1,
        formHandler: false
      },
      {
        name: 'getDeptAndUsers'/*(long) => com.google.gson.JsonObject */,
        len: 1,
        formHandler: false
      },
      {
        name: 'saveUser'/*(com.google.gson.JsonObject) => com.google.gson.JsonObject */,
        len: 1,
        formHandler: false
      },
      {
        name: 'saveMenuAuth'/*(long, String, String) => com.google.gson.JsonObject */,
        len: 3,
        formHandler: false
      },
      {
        name: 'saveDept'/*(com.google.gson.JsonObject) => com.google.gson.JsonObject */,
        len: 1,
        formHandler: false
      },
      {
        name: 'getConfigration'/*() => com.google.gson.JsonObject */,
        len: 0,
        formHandler: false
      },
      {
        name: 'getRoles'/*(String) => com.google.gson.JsonArray */,
        len: 1,
        formHandler: false
      },
      {
        name: 'getDepts'/*(String, long) => com.google.gson.JsonArray */,
        len: 2,
        formHandler: false
      },
      {
        name: 'getMenuAuths'/*() => com.google.gson.JsonObject */,
        len: 0,
        formHandler: false
      },
      {
        name: 'resetUserPassword'/*(long) => com.google.gson.JsonObject */,
        len: 1,
        formHandler: false
      },
      {
        name: 'getOranizationgChart'/*() => com.google.gson.JsonObject */,
        len: 0,
        formHandler: false
      },
      {
        name: 'getUsers'/*() => com.google.gson.JsonObject */,
        len: 0,
        formHandler: false
      }
    ],
    PersonalRecordsAppDirect: [
      {
        name: 'init'/*() => com.google.gson.JsonObject */,
        len: 0,
        formHandler: false
      }
    ],
    MessagerAppDirect: [
      {
        name: 'InitMessagerUser'/*() => com.google.gson.JsonObject */,
        len: 0,
        formHandler: false
      }
    ],
    HTXXAppDirect: [
      {
        name: 'deleteHT'/*(String) => com.google.gson.JsonObject */,
        len: 1,
        formHandler: false
      }
    ],
    TaskAppDirect: [
      {
        name: 'createTask'/*(com.google.gson.JsonObject) => com.google.gson.JsonObject */,
        len: 1,
        formHandler: false
      },
      {
        name: 'loadTaskDependences'/*(String, String, String) => com.google.gson.JsonObject */,
        len: 3,
        formHandler: false
      },
      {
        name: 'destroyTask'/*(com.google.gson.JsonObject) => com.google.gson.JsonObject */,
        len: 1,
        formHandler: false
      },
      {
        name: 'updateTaskDependence'/*(com.google.gson.JsonObject) => com.google.gson.JsonArray */,
        len: 1,
        formHandler: false
      },
      {
        name: 'loadTasks'/*(String, String, String) => com.google.gson.JsonObject */,
        len: 3,
        formHandler: false
      },
      {
        name: 'destroyTaskDependence'/*(com.google.gson.JsonObject) => com.google.gson.JsonObject */,
        len: 1,
        formHandler: false
      },
      {
        name: 'updateTask'/*(com.google.gson.JsonObject) => com.google.gson.JsonArray */,
        len: 1,
        formHandler: false
      },
      {
        name: 'createTaskDependence'/*(com.google.gson.JsonObject) => com.google.gson.JsonObject */,
        len: 1,
        formHandler: false
      }
    ],
    FileSendDirect: [
      {
        name: 'isUserDownload'/*(long) => com.google.gson.JsonObject */,
        len: 1,
        formHandler: false
      }
    ],
    ScoreAppDirect: [
      {
        name: 'initScoreYear'/*(String) => com.google.gson.JsonObject */,
        len: 1,
        formHandler: false
      },
      {
        name: 'getDailyScore'/*(long, String) => com.google.gson.JsonObject */,
        len: 2,
        formHandler: false
      },
      {
        name: 'getDailyScoreByUserYYYYMM'/*(long, long, String) => com.google.gson.JsonObject */,
        len: 3,
        formHandler: false
      },
      {
        name: 'getScoreMonthList'/*(String) => com.google.gson.JsonObject */,
        len: 1,
        formHandler: false
      },
      {
        name: 'getScoreYearList'/*(String) => com.google.gson.JsonObject */,
        len: 1,
        formHandler: false
      },
      {
        name: 'updateBonus'/*(long, String) => com.google.gson.JsonObject */,
        len: 2,
        formHandler: false
      },
      {
        name: 'updateWeight'/*(String, com.google.gson.JsonObject) => com.google.gson.JsonObject */,
        len: 2,
        formHandler: false
      },
      {
        name: 'getComboData'/*(long, String) => com.google.gson.JsonObject */,
        len: 2,
        formHandler: false
      },
      {
        name: 'initScoreMonth'/*(String) => com.google.gson.JsonObject */,
        len: 1,
        formHandler: false
      },
      {
        name: 'initDailyScoreByUserYYYYMM'/*(long, long, String) => com.google.gson.JsonObject */,
        len: 3,
        formHandler: false
      }
    ],
    BpcProjectAppDirect: [
      {
        name: 'getTaskAuthority'/*(long) => com.google.gson.JsonObject */,
        len: 1,
        formHandler: false
      },
      {
        name: 'loadNormalTaskTree'/*(String, String, long, int, int) => com.google.gson.JsonArray */,
        len: 5,
        formHandler: false
      },
      {
        name: 'saveProjectTaskWorklog'/*(com.google.gson.JsonObject) => com.google.gson.JsonObject */,
        len: 1,
        formHandler: false
      },
      {
        name: 'loadProjectTaskTree'/*(String, long, long, int, int) => com.google.gson.JsonArray */,
        len: 5,
        formHandler: false
      },
      {
        name: 'combineProjects'/*(long, long) => com.google.gson.JsonObject */,
        len: 2,
        formHandler: false
      }
    ]
  }
}

