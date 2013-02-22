
Ext.ns("Ext.ux.calendar");


Ext.ux.calendar.DataSource = function(config){
	Ext.apply(this, config);
	Ext.ux.calendar.DataSource.superclass.constructor.call(this);
};

Ext.extend(Ext.ux.calendar.DataSource, Ext.util.Observable, {
    /*
     * For show all calendars
     * @param {function} sucessFn: the callback function when request completed successfully
     * @param {obj} scope: the scope of sucessFn function
     */
    showAllCalendar:function(sucessFn, scope){
		CalendarAppDirect.showAllTag(this.key, function(result, e){
			if(result && result.success){
                sucessFn.call(scope || this, result);
			}else{
				MixkyApp.showDirectActionFail("显示所有分类项", result, e);
			}
		});
    },
    /*
     * For hide all calendars but only show this one
     * @param {int} calendarId: the id of the calendar
     * @param {function} sucessFn: the callback function when request completed successfully
     * @param {obj} scope: the scope of sucessFn function
     */
    showOnlyCalendar:function(tagId, sucessFn, scope){
		CalendarAppDirect.showOnlyTag(this.key, tagId, function(result, e){
			if(result && result.success){
                sucessFn.call(scope || this, result);
			}else{
				MixkyApp.showDirectActionFail("仅显示分类项", result, e);
			}
		});
    },
    /*
     * For create/update a calendar
     * @param {Obj} calendar: the object of a calendar, should contain all field of calendar table in db
     * @param {function} sucessFn: the callback function when request completed successfully
     * @param {obj} scope: the scope of sucessFn function     
     */
    createUpdateCalendar:function(tag, sucessFn, scope){
    	if(tag.id === 0){
			MixkyApp.showErrorMessage("不允许修改系统默认标签", "错误提示");
			return;
    	}
    	tag.hide = tag.hide?1:0;
		CalendarAppDirect.updateTag(this.key, tag, function(result, e){
			if(result && result.success){
                sucessFn.call(scope || this, result);
			}else{
				MixkyApp.showDirectActionFail("添加/更新分类项", result, e);
			}
		});
    },
    /*
     * For delete all events belong to a calendar
     * @param {int} calendarId: the id of a calendar
     * @param {function} sucessFn: the callback function when request completed successfully
     * @param {obj} scope: the scope of sucessFn function
     */
    deleteEventsByCalendar:function(tagId, sucessFn, scope){
		CalendarAppDirect.deleteEventsByTag(this.key, tagId, function(result, e){
			if(result && result.success){
                sucessFn.call(scope || this, result);
			}else{
				MixkyApp.showDirectActionFail("清空分类项日程信息", result, e);
			}
		});
    },
    /*
     * For delete a calendar and all events belong to it
     * @param {int} calendarId: the id of a calendar
     * @param {function} sucessFn: the callback function when request completed successfully
     * @param {obj} scope: the scope of sucessFn function
     */
    deleteCalendar:function(tagId, sucessFn, scope){
    	if(tagId == 0){
			MixkyApp.showErrorMessage("不允许删除系统默认标签", "错误提示");
			return;
    	}
		CalendarAppDirect.deleteTag(this.key, tagId, function(result, e){
			if(result && result.success){
                sucessFn.call(scope || this, result);
			}else{
				MixkyApp.showDirectActionFail("删除分类项日程信息", result, e);
			}
		});
    },
    /*
     * For load all calendars of a user
     * @param {int} userId: the id of a user
     * @param {function} sucessFn: the callback function when request completed successfully
     * @param {obj} scope: the scope of sucessFn function
     */
    loadCalendar:function(successFn, scope){
        /*
         * The back json string should like below:
         * {    
         *      "total":2,
         *      "results":[{
         *              "id":"1",
         *              "color":"blue",
         *              "description":null,
         *              "hide":false,
         *              "name":"Demo"
         *       },{
         *              "id":"2",
         *              "color":"red",
         *              "description":null,
         *              "hide":false,
         *              "name":"df"
         *       }]
         * }
         */
    	var ds = this;
		CalendarAppDirect.loadTags(this.key, function(result, e){
			if(result && result.success){
				ds.initCalendarColor(result.results);
                sucessFn.call(scope || this, result);
			}else{
				MixkyApp.showDirectActionFail("删除分类项日程信息", result, e);
			}
		});
    },
    /*
     * For load all events from a day to another day
     * @param {Date} startData: the start date
     * @param {Date} endData: the end date
     * @param {function} sucessFn: the callback function when request completed successfully
     * @param {obj} scope: the scope of sucessFn function     
     */
    loadEvent:function(startDate, endDate, sucessFn, scope){
        /*
         * The back json string should like below:
         * {
         *      "total":1,
         *      "results":[{
         *              "id":"1",
         *              "calendarId":0,
         *              "color":"blue", // string; this color should be the same as the color of calendar "0"
         *              "startRow":0, // int; startRow is in [0, 47], for 00:00-23:30
         *              "endRow":2, //int; endRow is in [1, 48], for 00:30-24:00
         *              "subject":"lunch", //string; the subject of this event
         *              "description":"in hilton hotel", //string; the description of this event
         *              "day":"2009-8-11", //string; the date of this event, need be 'Y-m-d' format
         *              "alertFlag":true, //boolean; true means there will alert a window when this event is activing, false means no alert                 
         *              "locked":false //boolean; true means this event is a locked event, nobody can change it, not use yet, in this version it should always be false
         *       }]
         * }
         */
        startDate = startDate || new Date();
        endDate = endDate || new Date();
        var startDay = startDate.format('Y-m-d');
        var endDay = endDate.format('Y-m-d');
        
		CalendarAppDirect.loadEvents(this.key, startDay, endDay, function(result, e){
			if(result && result.success){
                var rs = result.results;
                var eventSet = {};
                eventSet['whole'] = [];
                var getRowFromHM = Ext.ux.calendar.Mask.getRowFromHM;
                for(var i = 0, len = rs.length; i < len; i++){
                    var data = rs[i];
                    var startRow = getRowFromHM(data.startTime, this.intervalSlot);
                    var endRow = getRowFromHM(data.endTime, this.intervalSlot);
                    if(!this.hideInactiveRow 
                        || (this.activeStartRow <= startRow && endRow <= this.activeEndRow)
                        || (0 == startRow && this.rowCount == endRow)){
                        var day = data.ymd;
                        var eday = data.eymd;
                        eventSet[day] = eventSet[day] || [];
                        var e = {
                            eventId:data.id,
                            calendarId:data.calendarId,
                            color:data.color,
                            startRow:startRow,
                            endRow:endRow,
                            subject:data.subject,
                            content:data.description,
                            day:day,
                            eday:eday,
                            alertFlag:data.alertFlag,                                
                            locked:data.locked,
                            repeatType:data.repeatType
                        };
                        if(day != eday || (0 == startRow) && (this.rowCount == endRow)){
                            eventSet['whole'].push(e);
                        }else{
                            eventSet[day] = eventSet[day] || [];
                            eventSet[day].push(e);
                        }
                    }
                }
                sucessFn.call(scope || this, eventSet);
			}else{
				MixkyApp.showDirectActionFail("装载日程信息", result, e);
			}
		});
    },
    loadRepeatEvent:function(sucessFn, scope){
		CalendarAppDirect.loadRepeatEvents(this.key, function(result, e){
			if(result && result.success){
                var rs = result.results;
                var eventSet = {};
                var getRowFromHM = Ext.ux.calendar.Mask.getRowFromHM;
                for(var i = 0, len = rs.length; i < len; i++){
                    var data = rs[i];
                    var startRow = getRowFromHM(data.startTime, scope.intervalSlot);
                    var endRow = getRowFromHM(data.endTime, scope.intervalSlot);
                    var ed = {
                        eventId:data.id,
                        calendarId:data.calendarId,
                        color:data.color,
                        startRow:startRow,
                        endRow:endRow,
                        subject:data.subject,
                        content:data.description,
                        repeatType:data.repeatType,                            
                        alertFlag:data.alertFlag,
                        locked:data.locked
                    };
                    eventSet[ed.eventId] = ed;
                }
                sucessFn.call(scope || this, eventSet);
			}else{
				MixkyApp.showDirectActionFail("装载重复日程项信息", result, e);
			}
        });
    },
    /*
     * For create an event
     * @param {Obj} event: the object of event
     * @param {function} sucessFn: the callback function when request completed successfully
     * @param {obj} scope: the scope of sucessFn function
     */
	createEvent:function(event, sucessFn, scope){
        var day = event.day || new Date().format('Y-m-d');
        var eday = event.eday || day;
        /*
         * the params pass to server should contain:
         * calendarId: int, the id of the calendar this event belong to
         * selectedDay: string, 'Y-m-d' format, the day of this event
         * startHMTime: string, 'H:i' format, the start time of this event
         * endHMTime: string, 'H:i' format, the end time of this event
         * repeatType: boolean, not use yet, always false in this version
         * allDay: boolean, if true means this event is a whole event
         * flag: boolean, if true mean this event need alert a window when it's activing
         * locked: boolean, if true mean this event is locked, can not be changed
         * subject: string, the subject of this event
         * description: string, the description of this event
         */
        var params = {
            'id':0,
            'calendarId':event.calendarId,
            'startDay':day,
            'endDay':eday,
            'startTime':Ext.ux.calendar.Mask.getIntervalFromRow(scope.intervalSlot, event.startRow),
            'endTime':Ext.ux.calendar.Mask.getIntervalFromRow(scope.intervalSlot, event.endRow),
            'repeatType':event.repeatType,
            'alertFlag':event.alertFlag?1:0,
            'locked':event.locked?1:0,
            'subject':event.subject,
            'description':event.content
        };
		CalendarAppDirect.updateEvent(this.key, params, function(result, e){
			if(result && result.success){
                /*
                 * The back json string should contain a param "id", which is the id of the event just created,
                 * it should also have a param "success", when it equal "false" means fail to create/update in server side,
                 * for example: {"success":"true","info":"Your have successful created event","id":17}
                 */
                sucessFn.call(scope || this, result);
			}else{
				MixkyApp.showDirectActionFail("添加日程", result, e);
			}
		});
    },
    /*
     * For update an event
     * @param {Obj} event: the object of event
     * @param {function} sucessFn: the callback function when request completed successfully
     * @param {obj} scope: the scope of sucessFn function
     */
    updateEvent:function(event, sucessFn, scope){
        var day = event.day || new Date().format('Y-m-d');
        var eday = event.eday || day;
        /*
         * the params pass to server should contain:
         * id: int, the id of the event
         * calendarId: int, the id of the calendar this event belong to
         * selectedDay: string, 'Y-m-d' format, the day of this event
         * startHMTime: string, 'H:i' format, the start time of this event
         * endHMTime: string, 'H:i' format, the end time of this event
         * repeatType: boolean, not use yet, always false in this version
         * allDay: boolean, if true means this event is a whole event
         * flag: boolean, if true mean this event need alert a window when it's activing
         * locked: boolean, if true mean this event is locked, can not be changed
         * subject: string, the subject of this event
         * description: string, the description of this event
         */
        var params = {
            'id':event.eventId,
            'calendarId':event.calendarId,
            'startDay':day,
            'endDay':eday,
            'startTime':Ext.ux.calendar.Mask.getIntervalFromRow(scope.intervalSlot, event.startRow),
            'endTime':Ext.ux.calendar.Mask.getIntervalFromRow(scope.intervalSlot, event.endRow),
            'repeatType':event.repeatType,
            'oldRepeatType':event.oldRepeatType,
            'alertFlag':event.alertFlag?1:0,
            'locked':event.locked?1:0,
            'subject':event.subject,
            'description':event.content
        };
		CalendarAppDirect.updateEvent(this.key, params, function(result, e){
			if(result && result.success){
                sucessFn.call(scope || this, result);
			}else{
				MixkyApp.showDirectActionFail("更新日程", result, e);
			}
		});
    },
    /*
     * For delete an event
     * @param {Obj} event: the object of event
     * @param {function} sucessFn: the callback function when request completed successfully
     * @param {obj} scope: the scope of sucessFn function
     */
    deleteEvent:function(event, sucessFn, scope){
		CalendarAppDirect.deleteEvent(this.key, event.eventId, function(result, e){
			if(result && result.success){
                sucessFn.call(scope || this, result);
			}else{
				MixkyApp.showDirectActionFail("删除日程", result, e);
			}
		});
    },

    deleteRepeatEvent:function(event, makeException, sucessFn, scope){
		CalendarAppDirect.deleteRepeatEvent(this.key, event.eventId, makeException, event.repeatType, function(result, e){
			if(result && result.success){
                sucessFn.call(scope || this, result);
			}else{
				MixkyApp.showDirectActionFail("删除可重复日程", result, e);
			}
		});
    },
    changeDay:function(oday, nday, sucessFn, scope, keep){
        /*
         * If keep is true, the back json string should contain a param "ids", which is an array keeps the id of the events just created for new day,
         * for example: {"success":"true","info":"You have success update those events","backids":[18,19]};
         * if keep is false, the back json is like: {"success":"true","info":"You have success update those events","backids":[]};
         * it should also have a param "success", when it equal "false" means fail to change in server side
         */
		CalendarAppDirect.changeDay(this.key, oday, nday, keep, function(result, e){
			if(result && result.success){
                sucessFn.call(scope || this, result);
			}else{
				MixkyApp.showDirectActionFail("复制/粘帖日程", result, e);
			}
		});
    },
    /*
     * For delete all events in a day
     * @param {string} day: all events belong to this day need be deleted
     * @param {function} sucessFn: the callback function when request completed successfully
     * @param {obj} scope: the scope of sucessFn function
     */
    deleteDay:function(day, sucessFn, scope){
    	Ext.Msg.confirm('危险操作提示', '删除' + day + '所有日程，您确定吗？', function(btn){
    	    if (btn == 'yes'){
				CalendarAppDirect.deleteDay(this.key, day, function(result, e){
					if(result && result.success){
		                sucessFn.call(scope || this, result);
					}else{
						MixkyApp.showDirectActionFail("删除日程", result, e);
					}
				});
    	    }
    	}, this);
    },

    createUpdateRepeatEvent:function(event, oevent, sucessFn, scope){
        var stime = Ext.ux.calendar.Mask.getIntervalFromRow(scope.intervalSlot, event.startRow);
        var etime = Ext.ux.calendar.Mask.getIntervalFromRow(scope.intervalSlot, event.endRow);
        /*
         * the params pass to server should contain:
         * calendarId: int, the id of the calendar this event belong to
         * selectedDay: string, 'Y-m-d' format, the day of this event
         * startHMTime: string, 'H:i' format, the start time of this event
         * endHMTime: string, 'H:i' format, the end time of this event
         * repeatType: boolean, not use yet, always false in this version
         * allDay: boolean, if true means this event is a whole event
         * flag: boolean, if true mean this event need alert a window when it's activing
         * locked: boolean, if true mean this event is locked, can not be changed
         * subject: string, the subject of this event
         * description: string, the description of this event
         */
        var params = {
            'calendarId':event.calendarId,
            'startDay':event.day,
            'endDay':event.eday,
            'startTime':stime,
            'endTime':etime,
            'repeatType': ('string' == Ext.type(event.repeatType))?event.repeatType:Ext.encode(event.repeatType),
            'alertFlag':event.alertFlag?1:0,
            'locked':event.locked?1:0,
            'subject':event.subject,
            'description':event.content
        };       
        if(oevent){
        	params.oldRepeatType = ('string' == Ext.type(oevent.repeatType))?oevent.repeatType:Ext.encode(oevent.repeatType);
        } 
        if('prepare' != event.eventId){
            params.id = event.eventId;
        }
        if(oevent){
            if('string' == Ext.type(oevent.repeatType)){
                params.oldRepeatType = oevent.repeatType;
            }else{
                params.oldRepeatType = Ext.encode(oevent.repeatType);                
            }
        }
		CalendarAppDirect.updateRepeatEvent(this.key, params, function(result, e){
			if(result && result.success){
                /*
                 * The back json string should contain a param "id", which is the id of the event just created,
                 * it should also have a param "success", when it equal "false" means fail to create/update in server side,
                 * for example: {"success":"true","info":"Your have successful created event","id":17}
                 */
                sucessFn.call(scope || this, result);
			}else{
				MixkyApp.showDirectActionFail("创建\更新重复日程", result, e);
			}
		});
    },
    /*
     * For load setting and calendar from db
     * @param {int} userId: the ID of current user
     * @param {function} sucessFn: the callback function when request completed successfully
     * @param {obj} scope: the scope of sucessFn function
     */
    initialLoad:function(userId, sucessFn, scope){
    	var ds = this;
		CalendarAppDirect.initialLoad(this.key, function(result, e){
			if(result && result.success){
                var cs = result.cs[0];                                       
                cs = Ext.ux.calendar.Mask.calculateActiveRow(cs);
                Ext.apply(this, cs);
                result.cs = cs;                    
                var re = result.re;
                var eventSet = {};
                var getRowFromHM = Ext.ux.calendar.Mask.getRowFromHM;
                ds.initCalendarColor(result.owned);
                for(var i = 0, len = re.length; i < len; i++){
                    var data = re[i];
                    var startRow = getRowFromHM(data.startTime, this.intervalSlot);
                    var endRow = getRowFromHM(data.endTime, this.intervalSlot);
                    var e = {
                        eventId:data.id,
                        calendarId:data.calendarId,
                        color:data.color,
                        startRow:startRow,
                        endRow:endRow,
                        subject:data.subject,
                        content:data.description,
                        repeatType:data.repeatType,
                        alertFlag:data.alertFlag,
                        locked:data.locked
                    };
                    eventSet[e.eventId] = e;
                }
                result.re = eventSet;
                sucessFn.call(scope || this, result);
			}else{
				MixkyApp.showDirectActionFail("初始化装载", result, e);
			}
		});
    },
    getSearchStore : function(){
    	if(!this.searchStore){
    		this.searchStore = new Ext.data.GroupingStore({
    	    	proxy: new Ext.data.DirectProxy({
    	    		paramsAsHash: true,
    	    		paramOrder : ['key', 'text','start','limit'],
    	    		directFn: CalendarAppDirect.searchEvents
    	    	}),
    	    	baseParams:{key : this.key},
    	        reader:new Ext.data.JsonReader({
    	            root: 'results',
    	            id: 'id',
    	            totalProperty: 'totals'
    	        }, [
    	            {name: "id"},
    	            {name: "calendarId"},
    	            {name: "startTime"},
    	            {name: "endTime"},
    	            {name: "subject"},
    	            {name: "description"},
    	            {name: "ymd"},
    	            {name: "eymd"},
    	            {name: "color"},
    	            {name: "isShared"},                
    	            {name: "alertFlag"},
    	            {name: "locked"},
    	            {name: "repeatType"}
    	        ]),
    	        sortInfo:{field: 'ymd', direction: "DESC"},
    			groupField:'ymd'
    		})
    	}
    	return this.searchStore;
    },
    initCalendarColor : function(rs){
    	var len = Ext.ux.calendar.Mask.colorIndex.length;
    	for(var i=0;i<rs.length;i++){
    		if(!rs[i].color || rs[i].color == ''){
    			rs[i].color = Ext.ux.calendar.Mask.colorIndex[i%len];
    		}
    	}
    }
});