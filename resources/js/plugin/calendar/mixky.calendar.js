Ext.ns("Ext.ux.calendar");
Ext.ux.calendar.BackThread = function(config) {
	Ext.apply(this, config);
	this.runner = new Ext.util.TaskRunner();
	this.timelineTask = {
		run : function(eh) {
			var mp = eh.mainPanel;
			var cview = mp.calendarContainer.getLayout().activeItem;
			if (cview instanceof Ext.ux.calendar.DayView) {
				cview.setToday();
				cview.updateTimeline()
			} else {
				if (cview instanceof Ext.ux.calendar.MonthView) {
					cview.setToday()
				}
			}
		},
		args : [ this.ehandler ],
		interval :60000
	};
	this.expireTask = {
		run : function(eh) {
			var mp = eh.mainPanel;
			var cview = mp.calendarContainer.getLayout().activeItem;
			if (cview instanceof Ext.ux.calendar.ResultView) {
				cview.list.getView().refresh()
			}
		},
		args : [ this.ehandler ],
		interval :1800000
	};
	Ext.ux.calendar.BackThread.superclass.constructor.call(this);
	this.runner.start(this.timelineTask)
};
Ext.extend(Ext.ux.calendar.BackThread, Ext.util.Observable, {
	destroy : function() {
		this.runner.stopAll()
	}
});
Ext.ns("Ext.ux.calendar");
Ext.ux.calendar.BasicView = Ext.extend(Ext.Panel, {
	daySet : [],
	checkLayout :Ext.emptyFn,
	renderEvent :Ext.emptyFn,
	resetSCover :Ext.emptyFn,
	resizePort :Ext.emptyFn
});
Ext.ns("Ext.ux.calendar");
Ext.ux.calendar.CalendarContainer = function(config) {
	Ext.apply(this, config);
	var eh = this.ehandler;
	var cs = eh.calendarSetting;
	//var lan = Ext.ux.calendar.Mask.CalendarContainer;
	var lan = eh.lang.CalendarContainer;
	var now = new Date();
	this.startDate = now;
	this.endDate = now;
	this.dayView = new Ext.ux.calendar.DayView( {
		dayFormat :cs.dayFormat,
		offsetPercent :0.05,
		shiftDay :1,
		dayNum :1,
		startColIndex :0,
		endColIndex :1,
		ehandler :this.ehandler
	});
	this.weekView = new Ext.ux.calendar.DayView( {
		dayFormat :cs.weekFormat,
		offsetPercent :0.1,
		shiftDay :7,
		dayNum :7,
		startColIndex :0,
		endColIndex :7,
		ehandler :this.ehandler
	});
	this.weekOnlyView = new Ext.ux.calendar.DayView( {
		dayFormat :cs.weekFormat,
		offsetPercent :0.1,
		dayNum :5,
		shiftDay :7,
		startColIndex :0,
		endColIndex :5,
		ehandler :this.ehandler
	});
	this.monthView = new Ext.ux.calendar.MonthView( {
		dayFormat :cs.monthFormat,
		dayNum :7,
		shiftDay :7,
		startColIndex :0,
		endColIndex :7,
		ehandler :this.ehandler
	});
	this.resultView = new Ext.ux.calendar.ResultView( {
		ehandler :this.ehandler
	});
	this.detailEditor = new Ext.ux.calendar.DetailEditor( {
		ehandler :this.ehandler
	});
	this.backBtn = new Ext.Button( {
		iconCls :"icon-sys-calendar-back",
		handler :this.onBackFn,
		scope :this
	});
	this.nextBtn = new Ext.Button( {
		iconCls :"icon-sys-calendar-next",
		handler :this.onNextFn,
		scope :this
	});
	this.todayBtn = new Ext.Button( {
		text :lan["todayBtn.text"],
		iconCls :"icon-sys-calendar-today",
		handler :this.onTodayFn,
		scope :this
	});
	this.refreshBtn = new Ext.Button( {
		iconCls :"x-tbar-loading",
		handler :this.onRefreshFn,
		scope :this
	});
	this.dayBtn = new Ext.Button( {
		iconCls :"icon-sys-calendar-dayview",
		text :lan["dayBtn.text"],
		handler :this.onDayFn,
		scope :this
	});
	this.weekMenu = new Ext.menu.Menu( {
		items : [ {
			text :lan["weekMenu.showAll.text"],
			checked :true,
			group :"week",
			handler :this.onWeekAllFn,
			scope :this
		}, {
			text :lan["weekMenu.onlyWeek.text"],
			checked :false,
			group :"week",
			handler :this.onWeekOnlyFn,
			scope :this
		} ]
	});
	this.weekBtn = new Ext.SplitButton( {
		iconCls :"icon-sys-calendar-weekview",
		text :lan["weekBtn.text"],
		pressed :true,
		arrowAlign :"right",
		menu :this.weekMenu,
		handler :this.onWeekFn,
		scope :this
	});
	this.monthMenu = new Ext.menu.Menu( {
		items : [ {
			text :lan["monthMenu.showAll.text"],
			checked :true,
			group :"month",
			handler :this.onMonthAllFn,
			scope :this
		}, {
			text :lan["monthMenu.onlyWeek.text"],
			checked :false,
			group :"month",
			handler :this.onMonthOnlyFn,
			scope :this
		} ]
	});
	this.monthBtn = new Ext.SplitButton( {
		iconCls :"icon-sys-calendar-monthview",
		text :lan["monthBtn.text"],
		arrowAlign :"right",
		menu :this.monthMenu,
		handler :this.onMonthFn,
		scope :this
	});
	this.searchField = new Ext.form.TextField( {
		width :250,
		listeners: {
            specialkey: {
				fn :function(field, e){
	                // e.HOME, e.END, e.PAGE_UP, e.PAGE_DOWN,
	                // e.TAB, e.ESC, arrow keys: e.LEFT, e.RIGHT, e.UP, e.DOWN
	                if (e.getKey() == e.ENTER) {
	                	this.onSearchFn();
	                }
	            },
	            scope : this
			}
        }
	});
	this.searchBtn = new Ext.Button( {
		iconCls :"icon-sys-calendar-search",
		handler :this.onSearchFn,
		scope :this
	});
	Ext.ux.calendar.CalendarContainer.superclass.constructor.call(this, {
		border :false,
		region :"center",
		cls :"x-calendar-container",
		layout :"card",
		layoutConfig : {
			deferredRender :true
		},
		activeItem :1,
		items : [ this.dayView, this.weekView, this.monthView, this.resultView,
				this.weekOnlyView, this.detailEditor ],
		tbar : [ this.backBtn, this.nextBtn, this.todayBtn, "-",
				lan["searchCriteria.text"], this.searchField, this.searchBtn,
				"->", this.refreshBtn, "-", this.dayBtn, "-", this.weekBtn,
				"-", this.monthBtn, "-"]
	});
	this.addEvents("refresh", "editcalendar");
	this.currentView = this.weekView;
	this.currentIdx = 1;
	var options = {
		single :true
	};
	if (Ext.isIE) {
		//options.delay = 5000
	}
	this.currentView.on("afterresize", this.onAfterResizeFn, this, options);
	this.weekView.on("viewDay", this.onDayChangeFn, this);
	this.weekOnlyView.on("viewDay", this.onDayChangeFn, this);
	this.monthView.on("viewDay", this.onDayChangeFn, this);
	this.monthView.on("viewWeek", this.onWeekChangeFn, this);
	this.dayView.on("viewWeek", this.onWeekChangeFn, this);
	this.relayEvents(this.dayView, [ "beforeremoteload", "remoteload", "hideeditor" ]);
	this.relayEvents(this.weekView, [ "beforeremoteload", "remoteload", "hideeditor" ]);
	this.relayEvents(this.weekOnlyView, [ "beforeremoteload", "remoteload", "hideeditor" ]);
	this.relayEvents(this.monthView, [ "beforeremoteload", "remoteload", "hideeditor" ]);
	this.dayView.relayEvents(this, [ "canceldetail" ]);
	this.weekView.relayEvents(this, [ "canceldetail" ]);
	this.weekOnlyView.relayEvents(this, [ "canceldetail" ]);
	this.monthView.relayEvents(this, [ "canceldetail" ]);
	this.on("mousedown", this.onMMouseDownFn, this);
	this.on("showdetailsetting", this.onShowDetailSettingFn, this);
	this.on("refresh", this.refresh, this)
};
Ext.extend(Ext.ux.calendar.CalendarContainer,Ext.Panel,{
	onAfterResizeFn : function() {
		try{
			this.ehandler.fireEvent("calendarloaded")
		}catch(e){
			
		}
	},
	onShowDetailSettingFn : function(obj) {
		this.getLayout().setActiveItem(5);
		this.detailEditor.setup(obj)
	},
	onBackFn : function(btn) {
		var cview = this.currentView;
		this.getLayout().setActiveItem(this.currentIdx);
		cview.goBack();
		this.changeLabel(cview)
	},
	onNextFn : function(btn) {
		var cview = this.currentView;
		this.getLayout().setActiveItem(this.currentIdx);
		cview.goNext();
		this.changeLabel(cview)
	},
	onTodayFn : function(btn) {
		this.showDay(new Date())
	},
	onDayFn : function(btn) {
		if (this.currentView != this.dayView) {
			this.showPressed(btn);
			var cview = this.dayView;
			this.getLayout().setActiveItem(0);
			cview.showRange(this.startDate, this.endDate);
			this.changeLabel(cview)
		}
	},
	onWeekFn : function(btn) {
		if (true === btn.weekdayFlag) {
			this.onWeekOnlyFn()
		} else {
			if (this.currentView != this.weekView) {
				this.onWeekAllFn()
			}
		}
	},
	onWeekAllFn : function() {
		if (this.currentView != this.weekView) {
			var cview = this.weekView;
			this.weekBtn.weekdayFlag = false;
			this.showPressed(this.weekBtn);
			this.getLayout().setActiveItem(1);
			cview.showRange(this.startDate, this.endDate, true);
			this.changeLabel(cview)
		}
	},
	onWeekOnlyFn : function() {
		if (this.currentView != this.weekOnlyView) {
			this.weekBtn.weekdayFlag = true;
			this.showPressed(this.weekBtn);
			var cview = this.weekOnlyView;
			this.getLayout().setActiveItem(4);
			cview.showRange(this.startDate, this.endDate, true);
			this.changeLabel(cview)
		}
	},
	onMonthFn : function(btn) {
		if (true == btn.weekdayFlag) {
			this.onMonthOnlyFn()
		} else {
			this.onMonthAllFn()
		}
	},
	onMonthAllFn : function() {
		var cview = this.monthView;
		this.monthBtn.weekdayFlag = false;
		if (this.currentView != this.monthView) {
			this.showPressed(this.monthBtn);
			this.getLayout().setActiveItem(2);
			cview.startColIndex = 0;
			cview.endColIndex = 7;
			cview.colNum = 7;
			cview.showRange(this.startDate, this.endDate);
			this.changeLabel(cview)
		} else {
			cview.startColIndex = 0;
			cview.endColIndex = 7;
			cview.colNum = 7;
			cview.cleanup();
			cview.recalculateSize(cview.body.getWidth(),
					cview.body.getHeight());
			cview.showCache()
		}
	},
	onMonthOnlyFn : function() {
		var cview = this.monthView;
		this.monthBtn.weekdayFlag = true;
		var offset = (1 == cview.startDay ? 1 : 0);
		if (this.currentView != this.monthView) {
			this.showPressed(this.monthBtn);
			this.getLayout().setActiveItem(2);
			cview.colNum = 5;
			cview.startColIndex = 1 - offset;
			cview.endColIndex = 6 - offset;
			cview.showRange(this.startDate, this.endDate);
			this.changeLabel(cview)
		} else {
			cview.colNum = 5;
			cview.startColIndex = 1 - offset;
			cview.endColIndex = 6 - offset;
			cview.cleanup();
			cview.recalculateSize(cview.body.getWidth(),
					cview.body.getHeight());
			cview.showCache()
		}
	},
	showPressed : function(btn) {
		this.dayBtn.el.removeClass("x-btn-pressed");
		this.weekBtn.el.removeClass("x-btn-pressed");
		this.monthBtn.el.removeClass("x-btn-pressed");
		btn.el.addClass("x-btn-pressed");
		if (btn == this.dayBtn) {
			this.currentIdx = 0;
			this.currentView = this.dayView
		} else {
			if (btn == this.weekBtn) {
				if (true !== this.weekBtn.weekdayFlag) {
					this.currentIdx = 1;
					this.currentView = this.weekView
				} else {
					this.currentIdx = 4;
					this.currentView = this.weekOnlyView
				}
			} else {
				if (btn == this.monthBtn
						|| btn == this.monthOnlyBtn) {
					this.currentIdx = 2;
					this.currentView = this.monthView
				}
			}
		}
	},
	showDay : function(day) {
		var cview = this.currentView;
		this.getLayout().setActiveItem(this.currentIdx);
		cview.showDay(day);
		this.changeLabel(cview)
	},
	showSingleDay : function(day) {
		var cview = this.dayView;
		cview.daySet[0] = day;
		if (this.currentView != this.dayView) {
			this.showPressed(this.dayBtn);
			this.getLayout().setActiveItem(0);
			cview.resetView();
			cview.fireEvent("checklayout", true);
			this.changeLabel(cview)
		}
	},
	onDayChangeFn : function(cview, day) {
		this.showSingleDay(day)
	},
	onWeekChangeFn : function(sdate, edate) {
		this.showPressed(this.weekBtn);
		var cview = this.currentView;
		this.getLayout().setActiveItem(this.currentIdx);
		cview.showDay(sdate);
		this.changeLabel(cview)
	},
	changeLabel : function(cview) {
		this.startDate = cview.daySet[0];
		this.endDate = cview.daySet[cview.daySet.length - 1];
		this.fireEvent("changedate", this.startDate, this.endDate);
	},
	onSearchFn : function() {
		var resultView = this.resultView;
		this.getLayout().setActiveItem(3);
		resultView.list.getStore().removeAll();
		resultView.loadEvents.defer(1, resultView, [ this.searchField.getValue() ]);
	},
	onCalendarLoadedFn : function() {
		var cview = this.currentView;
		cview.checkLayout(true)
	},
	onRefreshFn : function() {
		this.refresh()
	},
	refresh : function(cflag) {
		var eh = this.ehandler;
		var wp = this.ownerCt.westPanel;
		var ownedCt, sharedCt;
		if (wp.myCalendarPanel) {
			ownedCt = wp.myCalendarPanel.body
		}
		if (wp.otherCalendarPanel) {
			sharedCt = wp.otherCalendarPanel.body
		}
		eh.fireEvent("reloadCalendar", ownedCt, sharedCt, cflag);
	},
	onMMouseDownFn : function(e) {
		this.fireEvent("canceldetail");
		this.fireEvent("hideeditor")
	}
});
Ext.ns("Ext.ux.calendar");
Ext.ux.calendar.CalendarEditor = function(config) {
	Ext.apply(this, config);
	// var lan = Ext.ux.calendar.Mask.CalendarEditor;
	var lan = this.ehandler.lang.CalendarEditor;
	this.nameField = new Ext.form.TextField( {
		name :"name",
		fieldLabel :lan["nameField.label"],
		allowBlank :false,
		anchor :"99%"
	});
	this.descriptionField = new Ext.form.TextArea( {
		name :"description",
		fieldLabel :lan["descriptionField.label"],
		anchor :"99%"
	});
	this.colorField = new Ext.ColorPalette( {});
	this.colorField.on("select", this.onColorSelectFn, this);
	this.colorField.colors = Ext.ux.calendar.Mask.colors;
	this.clearBtn = new Ext.Button( {
		iconCls :"icon-sys-calendar-delete",
		minWidth :80,
		text :lan["clearBtn.text"],
		handler :this.onClearFn,
		scope :this
	});
	this.saveBtn = new Ext.Button( {
		iconCls :"icon-sys-calendar-accept",
		minWidth :80,
		text :lan["saveBtn.text"],
		handler :this.onSaveFn,
		scope :this
	});
	this.cancelBtn = new Ext.Button( {
		iconCls :"icon-sys-calendar-cancel",
		minWidth :80,
		text :lan["cancelBtn.text"],
		handler :this.onCancelFn,
		scope :this
	});
	this.formpanel = new Ext.form.FormPanel( {
		cls :"x-calendar-menu",
		border :false,
		style :"padding:10px;",
		labelWidth :70,
		items : [ this.nameField, this.descriptionField, {
			border :false,
			style :"padding-left:60px;",
			items : [ this.colorField ]
		} ],
		buttonAlign :"right",
		buttons : [ this.clearBtn, this.saveBtn, this.cancelBtn ]
	});
	Ext.ux.calendar.CalendarEditor.superclass.constructor.call(this, {
		width :500,
		height :200,
		closable :false,
		closeAction :"hide",
		layout :"fit",
		modal :true,
		resizable :false,
		items : [ {
			border :false,
			layout :"fit",
			items : [ this.formpanel ]
		} ]
	})
};
Ext.extend(Ext.ux.calendar.CalendarEditor, Ext.Window, {
	onColorSelectFn : function(cp, color) {
		this.color = Ext.ux.calendar.Mask.getIndexByColor(color)
	},
	popup : function(obj) {
		this.action = obj.action;
		this.show();
		// var lan = Ext.ux.calendar.Mask.CalendarEditor;
		var lan = this.ehandler.lang.CalendarEditor;
		if ("add" == obj.action) {
			this.setTitle(lan["new.title"]);
			this.setIconClass("icon-sys-calendar-calendar")
		} else {
			this.setTitle(lan["edit.title"]);
			this.setIconClass("icon-sys-calendar-calendar_edit")
		}
		if (obj.cEl) {
			this.calendarEl = obj.cEl
		} else {
			this.calendarEl = null
		}
		var mask = Ext.ux.calendar.Mask;
		if (obj.data) {
			this.calendar = obj.data;
			var data = obj.data;
			this.nameField.setValue(data.name);
			this.descriptionField.setValue(data.description);
			var color = data.color;
			var cl = Ext.ux.calendar.Mask.getColorByIndex(color);
			if (cl) {
				this.colorField.select(cl)
			} else {
				this.colorField.select(mask.colors[0])
			}
		} else {
			this.nameField.reset();
			this.descriptionField.reset();
			this.colorField.select(mask.colors[0])
		}
	},
	onClearFn : function() {
		this.formpanel.form.reset()
	},
	onSaveFn : function() {
		if (this.formpanel.form.isValid()) {
			var params = {};
			if (this.calendar) {
				params.id = this.calendar.id;
				params.hide = this.calendar.hide
			} else {
				params.hide = false
			}
			params.name = this.nameField.getValue();
			params.description = this.descriptionField.getValue();
			params.color = this.color;
			var eh = this.ehandler;
			eh.ds.createUpdateCalendar(params, function(backObj) {
				var cEl = this.calendarEl;
				if (cEl) {
					var oldColor = cEl.calendar.color;
					var oldName = cEl.calendar.name;
					Ext.apply(cEl.calendar, params);
					var color = cEl.calendar.color;
					eh.calendarSet[cEl.calendar.id] = cEl.calendar;
					var titleEl = cEl.child(".x-calendar-title-b");
					if (titleEl) {
						titleEl.dom.innerHTML = "<b>" + params.name + "</b>"
					}
					if (oldColor != color) {
						cEl.calendar.color = oldColor;
						eh.changeColor(cEl.calendar, color)
					}
				} else {
					if (backObj.id) {
						var calendar = Ext.apply( {}, params);
						calendar.id = backObj.id;
						eh.calendarSet[calendar.id] = calendar;
						var mc = eh.mainPanel.westPanel.myCalendarPanel;
						eh.createCalendar(mc.body, null, null, calendar);
						var css = "." + eh.id + "-x-calendar-" + calendar.id
								+ "{}";
						eh.ss[eh.ss.length] = Ext.util.CSS.createStyleSheet(
								css, Ext.id())
					}
				}
			}, this);
			this.hide()
		}
	},
	onCancelFn : function() {
		this.hide()
	}
});
Ext.ns("Ext.ux.calendar");
Ext.ux.calendar.CalendarWin = Ext.extend(Ext.Window, {
	initComponent : function() {
		this.mainPanel = new Ext.ux.calendar.MainPanel( {
			datasource :this.datasource,
			calendarSetting :this.calendarSetting
		});
		Ext.ux.calendar.CalendarWin.superclass.initComponent.call(Ext.apply(this, {
			layout :"fit",
			items : [ this.mainPanel ]
		}));
	}
});
Ext.ns("Ext.ux.calendar");
Ext.ux.calendar.CommentTip = Ext.extend(Ext.Tip, {
	closable :true,
	closeAction :"hide",
	showTip : function(title, text, bEl, pos, during) {
		this.setTitle(title);
		if (this.rendered) {
			this.body.update(text)
		} else {
			this.html = text
		}
		this.showBy(bEl, pos);
		during = during || 5000;
		( function() {
			this.hide()
		}).defer(during, this)
	}
});
Ext.ns("Ext.ux.calendar");
Ext.ux.calendar.DayView = Ext.extend(Ext.ux.calendar.BasicView,{
	createByDblclick :false,
	hideInactiveRow :false,
	activeStartRow :0,
	activeEndRow :48,
	startRow :0,
	endRow :48,
	cls :"x-dayview-ct",
	lineNum :3,
	border :false,
	weekNum :1,
	dayNum :1,
	dayFormat :"m/d(D)",
	thin :4,
	leftWidth :70,
	scrollOffset :17,
	offsetPercent :0.1,
	headerHeight :30,
	rowHeight :26,
	poolMaxDepth :4,
	poolDepth :0,
	generateCSS : function() {
		var cssText = "." + this.id
				+ "-x-dayview-viewer-row-height{}." + this.id
				+ "-x-dayview-pool{overflow:hidden;}."
				+ this.id + "-x-dayview-pool-height{}."
				+ this.id + "-x-dayview-pool-width{}."
				+ this.id + "-x-dayview-pool-viewer-width{}."
				+ this.id + "-x-dayview-lefter-width{width:"
				+ this.leftWidth + "px;}";
		var cid = Ext.id();
		this.ss = Ext.util.CSS.createStyleSheet(cssText, cid)
	},
	updateTimeline : function() {
		var now = new Date();
		var day = now.format("Y-m-d");
		for ( var j = 0, len = this.daySet.length; j < len; j++) {
			if (day == this.daySet[j].format("Y-m-d")) {
				break
			}
		}
		if (this.timelinePn && this.timeindexPn) {
			this.timeindexPn.removeClass("x-dayview-timeindex");
			this.timelinePn.removeClass("x-dayview-timeline")
		}
		if (j != len) {
			var col = j % this.dayNum;
			var h = parseInt(now.format("G"));
			var s = now.format("i");
			if ("0" == s[0]) {
				s = s.slice(1)
			}
			var i = parseInt(s);
			var intervalSlot = this.intervalSlot;
			var numInHour = this.numInHour;
			var startRow = h * numInHour
					+ Math.floor(i / intervalSlot);
			var r = i % intervalSlot;
			var pn = Ext.get(this.id + "-x-dayview-viewer-"
					+ startRow + "-" + col);
			var lefter = Ext.get(this.id + "-x-dayview-lefter-"
					+ startRow + "-0");
			if (pn && lefter) {
				var p = Math.floor(r / intervalSlot * 100);
				pn.addClass("x-dayview-timeline");
				pn.setStyle("background-position", "0% " + p
						+ "%");
				lefter.addClass("x-dayview-timeindex");
				lefter.setStyle("background-position", "0% "
						+ p + "%");
				this.timelinePn = pn;
				this.timeindexPn = lefter
			}
		}
	},
	generateHTML : function(data) {
		this.generateCSS();
		var lefter = "";
		var hnum = this.numInHour;
		for ( var i = this.startRow; i < this.endRow; i++) {
			lefter += '<tr id="' + this.id
					+ "-x-dayview-lefter-row-" + i + '">';
			for ( var j = 0; j < 1; j++) {
				var hour = Ext.ux.calendar.Mask.getIntervalFromRow(this.intervalSlot, i, this.hourFormat);
				var rest = i % hnum;
				if (0 != rest && i != this.activeStartRow) {
					hour = '<div class="x-dayview-viewer-row-height" style="text-align:right;"><i><b class="x-dayview-lefter-inner x-dayview-lefter-fine-inner">'
							+ hour + "</b></i></div>"
				} else {
					hour = '<div class="x-dayview-viewer-row-height"><b class="x-dayview-lefter-inner">'
							+ hour + "</b></div>"
				}
				lefter += '<td id="'
						+ this.id
						+ "-x-dayview-lefter-"
						+ i
						+ "-"
						+ j
						+ '" class="'
						+ this.id
						+ "-x-dayview-lefter-td x-dayview-lefter-row-height x-dayview-lefter-cell "
						+ ((0 != (i + 1) % hnum) ? "x-dayview-lefter-odd-row"
								: "x-dayview-lefter-even-row")
						+ '">' + hour + "</td>"
			}
			lefter += "</tr>"
		}
		var viewer = "";
		for ( var i = this.startRow; i < this.endRow; i++) {
			viewer += '<tr id="' + this.id
					+ "-x-dayview-viewer-row-" + i + '">';
			for ( var j = 0; j < this.dayNum; j++) {
				viewer += '<td class="'
						+ this.id
						+ "-x-dayview-viewer-td "
						+ this.id
						+ "-x-dayview-viewer-col-"
						+ j
						+ " "
						+ ((0 != (i + 1) % hnum) ? "x-dayview-odd-row"
								: "x-dayview-even-row")
						+ '"><div id="'
						+ this.id
						+ "-x-dayview-viewer-"
						+ i
						+ "-"
						+ j
						+ '" class="x-dayview-viewer-row-height x-dayview-viewer-cell"></div></td>'
			}
			viewer += "</tr>"
		}
		var port = '<div id="'
				+ this.id
				+ '-x-dayview-port" class="x-dayview-port x-dayview-inactive" unselectable="on" onselectstart="return false;"><div id="'
				+ this.id
				+ '-x-dayview-body" class="x-dayview-body x-dayview-inactive" unselectable="on" onselectstart="return false;"><table width="100%" cellspacing="0" cellpadding="0" border="0"><tbody><tr><td class="x-dayview-lefter '
				+ this.id
				+ '-x-dayview-lefter-width"><table width="100%" cellspacing="0" cellpadding="0" border="0"><tbody>'
				+ lefter
				+ '</tbody></table></td><td class="x-dayview-viewer"><table width="100%" cellspacing="0" cellpadding="0" border="0"><tbody>'
				+ viewer
				+ "</tbody></table></td></tr></tbody></table></div></div>";
		var days = "";
		this.dayTpl = new Ext.XTemplate(
				'<tpl for="."><td class="x-dayview-header-days"><div class="'
						+ this.id
						+ '-x-dayview-pool-height"><b><u id="'
						+ this.id
						+ '-x-dayview-day-link-0-{idx}" class="x-dayview-header-day-link">{day}</u></b></div></td></tpl>');
		var d = [];
		for ( var j = 0; j < this.dayNum; j++) {
			d[d.length] = {
				idx :j,
				day :this.daySet[j].format(this.dayFormat)
			}
		}
		days = this.dayTpl.apply(d);
		var week = this.daySet[0].getWeekOfYear();
		if (1 == this.dayNum) {
			week = '<u><b id="'
					+ this.id
					+ '-x-dayview-wn" class="x-dayview-wn-link">'
					+ week + "</b></u>"
		} else {
			week = '<b id="' + this.id + '-x-dayview-wn">'
					+ week + "</b>"
		}
		var header = '<div id="'
				+ this.id
				+ '-x-dayview-header" class="x-dayview-header" unselectable="on" onselectstart="return false;"><table width="100%" cellspacing="0" cellpadding="0" border="0"><tbody><tr><td class="x-dayview-header-lefter '
				+ this.id
				+ '-x-dayview-lefter-width"><div class="x-dayview-wn">'
				+ week
				+ '</div></td><td class="x-dayview-header-viewer"><table width="100%" height="100%" cellspacing="0" cellpadding="0" border="0"><tbody><tr>'
				+ days
				+ '</tr></tbody></table></td><td width="'
				+ this.scrollOffset
				+ 'px;"></td></tr></tbody></table></div>';
		var bg = "";
		for ( var i = 0; i < this.dayNum; i++) {
			bg += '<td id="' + this.id + "-x-dayview-bg-0-" + i
					+ '" class="x-dayview-bg-cell">&nbsp;</td>'
		}
		bg = '<table class="x-dayview-bg" width="100%" height="100%" cellspacing="0" cellpadding="0" border="0"><tbody><tr>'
				+ bg + "</tr></tbody></table>";
		var pool = '<div id="'
				+ this.id
				+ '-x-dayview-pool" class="x-dayview-pool" unselectable="on" onselectstart="return false;"><table width="100%" cellspacing="0" cellpadding="0" border="0"><tbody><tr><td class="x-dayview-header-lefter '
				+ this.id
				+ '-x-dayview-lefter-width" style="vertical-align:top;"><div id="'
				+ this.id
				+ '-x-dayview-pool-switch" class="x-dayview-pool-collapse"></div></td><td><div id="'
				+ this.id
				+ '-x-dayview-pool-viewer" class="'
				+ this.id
				+ '-x-dayview-pool-width x-dayview-pool-viewer">'
				+ bg
				+ '<table id="'
				+ this.id
				+ '-x-dayview-pool-ct" width="100%" class="x-dayview-ct" cellspacing="0" cellpadding="0" border="0"><tbody><tr></tr></tbody></table><div class="x-dayview-pool-rest"></div></div></td><td width="'
				+ this.scrollOffset
				+ 'px;"></tr></tbody></table></div>';
		var html = header + pool + port;
		return html
	},
	setToday : function() {
		var today = (new Date()).format("Y-m-d");
		var len = this.daySet.length;
		var t;
		for ( var i = 0; i < len; i++) {
			var day = this.daySet[i].format("Y-m-d");
			if (day === today) {
				t = i;
				break
			}
		}
		for ( var i = 0; i < this.dayNum; i++) {
			var pbk = Ext.get(this.id + "-x-dayview-bg-0-" + i);
			if (pbk) {
				pbk.setStyle("background-color", "white")
			}
		}
		var flag = (false != Ext.type(t));
		if (flag) {
			var pbk = Ext.get(this.id + "-x-dayview-bg-0-" + t);
			if (pbk) {
				pbk.setStyle("background-color", "rgb(255,255,214)");
			}
		}
		for ( var i = this.activeStartRow; i < this.activeEndRow; i++) {
			for ( var j = 0; j < this.dayNum; j++) {
				var div = Ext.get(this.id
						+ "-x-dayview-viewer-" + i + "-" + j);
				if (div) {
					var td = Ext.get(div.dom.parentNode);
					if (flag && j == t) {
						td.setStyle("background-color", "rgb(255,255,214)");
					} else {
						td
								.setStyle("background-color", "white");
					}
				}
			}
		}
	},
	getStartDate : function(date) {
		var sDate;
		if (1 == this.dayNum) {
			sDate = date
		} else {
			if (5 == this.dayNum) {
				var n = date.format("N");
				if (7 == n) {
					n = 0
				}
				n = 1 - n;
				sDate = date.add(Date.DAY, n)
			} else {
				if (1 == this.startDay) {
					var n = date.format("N");
					n = 1 - n;
					sDate = date.add(Date.DAY, n)
				} else {
					var w = date.format("w");
					sDate = date.add(Date.DAY, -w)
				}
			}
		}
		return sDate
	},
	initComponent : function() {
		this.id = Ext.id();
		this.daySet = [];
		this.ehandler.applyCalendarSetting(this);
		var sDate = this.getStartDate(new Date());
		for ( var i = 0, len = this.dayNum; i < len; i++) {
			this.daySet[this.daySet.length] = sDate.add(
					Date.DAY, i)
		}
		this.html = this.generateHTML();
		Ext.ux.calendar.DayView.superclass.initComponent
				.call(this);
		this.addEvents("checklayout", "sizechanged",
				"afterresize", "beforeremoteload",
				"remoteload", "canceldetail", "viewDay",
				"viewWeek");
		this.on("afterrender", this._onAfterRenderFn, this);
		this.on("checklayout", this.checkLayout, this);
		this.on("canceldetail", this.onCancelDetailFn, this);
		this.on("afterlayout", this._onReSizingFn, this);
		this.on("bodyresize", this._onReSizingFn, this);
		this.on("sizechanged", this.onSizeChangedFn, this, {
			buffer :50
		});
		Ext.EventManager.on(document, "mouseup",
				this._onMouseUpFn, this)
	},
	_onReSizingFn : function() {
		this.fireEvent("sizechanged")
	},
	onSizeChangedFn : function() {
		this.handleResize(this.body.getWidth(), this.body
				.getHeight())
	},
	onCancelDetailFn : function() {
		if (this.detailing) {
			this.detailing = false;
			this.detailCt.setStyle("display", "none")
		}
	},
	resetDragEventEl : function() {
		if (this.dragEventEl) {
			var eh = this.ehandler;
			delete (this.dragEventEl.row);
			delete (this.dragEventEl);
			delete (this.moving);
			eh.floating = false
		}
	},
	resetPrepareEl : function() {
		if (this.preEl) {
			var eh = this.ehandler;
			eh.showEditor(this.preEl, this, "add");
			delete (this.preEl)
		}
	},
	resetSCover : function() {
		delete (this.startPos);
		delete (this.endPos);
		this.hideSCovers()
	},
	endDragEventEl : function(coverEl, e) {
		var cview = coverEl.cview;
		var eh = this.ehandler;
		eh.floating = false;
		var event = coverEl.bindEvent;
		var col = coverEl.col;
		var nol = coverEl.nol;
		if (false == Ext.type(nol)) {
			nol = col;
			coverEl.nol = nol
		}
		var row = coverEl.row || event.startRow;
		var slot = event.endRow - event.startRow;
		if (nol == col) {
			event.startRow = row;
			event.endRow = row + slot;
			if ("string" == Ext.type(event.repeatType)) {
				eh.updateEvent(event, cview, col)
			} else {
				var oevent = Ext.apply( {}, event);
				event.repeatType = "exception";
				oevent.startRow = oevent.oldStartRow;
				oevent.endRow = oevent.oldEndRow;
				eh.updateRepeatEvent(event, this, oevent)
			}
		} else {
			var oevent = Ext.apply( {}, event);
			event.startRow = row;
			event.endRow = row + slot;
			var day = cview.daySet[nol];
			var dnum = Ext.ux.calendar.Mask.getDayOffset(
					event.day, event.eday);
			event.day = day.format("Y-m-d");
			day = day.add(Date.DAY, dnum);
			event.eday = day.format("Y-m-d");
			if ("string" == Ext.type(oevent.repeatType)) {
				eh.ds.updateEvent(event, function() {
					var layout = eh.calendarLayout.getLayout(
							cview.daySet[col], cview);
					var rs = layout.updateLayout(oevent,
							"delete");
					eh.renderEvent(cview, rs.elist, col);
					layout = eh.calendarLayout.getLayout(day,
							cview);
					rs = layout.updateLayout(event, "add");
					eh.renderEvent(cview, rs.elist, nol);
					eh.fireEvent("changeEventCache", eh)
				}, this)
			} else {
				event.repeatType = "exception";
				oevent.startRow = oevent.oldStartRow;
				oevent.endRow = oevent.oldEndRow;
				eh.updateRepeatEvent(event, this, oevent)
			}
		}
	},
	endResizeEventEl : function(eventEl) {
		var eh = this.ehandler;
		eh.floating = false;
		var event = eventEl.bindEvent;
		if ("string" == Ext.type(event.repeatType)) {
			eh.updateEvent(event, this, eventEl.col)
		} else {
			var oevent = Ext.apply( {}, event);
			event.repeatType = "exception";
			oevent.startRow = oevent.oldStartRow;
			oevent.endRow = oevent.oldEndRow;
			eh.updateRepeatEvent(event, this, oevent)
		}
	},
	_onMouseUpFn : function(e) {
		var eh = this.ehandler;
		this.resetPrepareEl();
		if (this.dragEventEl && this.moving) {
			this.endDragEventEl(this.dragEventEl, e)
		}
		this.resetDragEventEl();
		if (!this.dragging) {
			if (this.startPos) {
				var spos = Ext.apply( {}, this.startPos), epos = Ext
						.apply( {}, this.endPos);
				this.startPos = null;
				eh.prepareLegend(Ext.get(this.id
						+ "-x-dayview-bg-0-" + epos.y), spos,
						epos, this)
			}
		}
		if (this.resizeEventEl) {
			this.endResizeEventEl(this.resizeEventEl)
		}
		this.resetResizeEventEl()
	},
	getCellIndex : function(cellId) {
		var parts = cellId.toString().split("-");
		var len = parts.length;
		var colIndex = parts[len - 1];
		var rowIndex = parts[len - 2];
		return {
			x :parseInt(rowIndex),
			y :parseInt(colIndex)
		}
	},
	_onAfterRenderFn : function(p) {
		this.initEls();
		this.setToday()
	},
	_onPortClickFn : function(e) {
		var eh = this.ehandler;
		var target = e.getTarget();
		var tgEl = Ext.get(target);
		if (tgEl.hasClass("x-event-pin")) {
			if (tgEl.hasClass("x-calendar-event-pin-off")) {
				tgEl.removeClass("x-calendar-event-pin-off");
				tgEl.addClass("x-calendar-event-pin-on");
				eh.editDisabled = true
			} else {
				tgEl.removeClass("x-calendar-event-pin-on");
				tgEl.addClass("x-calendar-event-pin-off");
				eh.editDisabled = false
			}
		} else {
			var cEl;
			if (tgEl.hasClass("x-event-content-link")) {
				cEl = tgEl.parent(".x-event-cover");
				if (!cEl.bindEvent.locked) {
					eh.showEditor(cEl, this, "update")
				}
			} else {
				if (tgEl.hasClass("x-event-cover")) {
					cEl = tgEl
				} else {
					cEl = tgEl.parent(".x-event-cover")
				}
				if (cEl) {
					eh.setEditingStatus(cEl, true, false)
				}
			}
		}
	},
	_onPortMouseOverFn : function(e) {
		var target = e.getTarget();
		var tgEl = Ext.get(target);
		var flag = false;
		if (tgEl.hasClass("x-event-cover")) {
			flag = true
		} else {
			if ((tgEl = tgEl.parent(".x-event-cover"))) {
				flag = true
			}
		}
		if (flag) {
			var eh = this.ehandler;
			if (!eh.editDisabled) {
				eh.setEditingStatus(tgEl, true)
			}
		}
	},
	_onBodyClickFn : function(e) {
		var target = e.getTarget();
		var tgEl = Ext.get(target);
		var eh = this.ehandler;
		if (tgEl.hasClass("x-dayview-pool-collapse")) {
			tgEl.removeClass("x-dayview-pool-collapse");
			tgEl.addClass("x-dayview-pool-expand");
			this.lineNum = Math
					.floor(this.body.getHeight() / 17) - 5;
			this.checkLayout(Ext.isIE)
		} else {
			if (tgEl.hasClass("x-dayview-pool-expand")) {
				tgEl.addClass("x-dayview-pool-collapse");
				tgEl.removeClass("x-dayview-pool-expand");
				this.lineNum = 3;
				this.checkLayout(Ext.isIE)
			} else {
				if (tgEl.hasClass("x-event-detail-tool-close")) {
					this.fireEvent("canceldetail")
				} else {
					if (!eh.readOnly
							&& (tgEl
									.hasClass("x-whole-title-b") || tgEl
									.hasClass("x-legend-title-b"))) {
						var wEl = tgEl.parent(".x-whole-cover");
						if (wEl && !wEl.bindEvent.locked) {
							eh.showEditor(wEl, this, "update")
						}
					} else {
						if (tgEl
								.hasClass("x-dayview-header-day-link")) {
							var pos = this
									.getCellIndex(tgEl.dom.id);
							var day = this.daySet[pos.y];
							this
									.fireEvent("viewDay", this,
											day)
						} else {
							if (tgEl
									.hasClass("x-dayview-wn-link")) {
								var sdate = this.daySet[0];
								this.fireEvent("viewWeek",
										sdate, sdate)
							}
						}
					}
				}
			}
		}
	},
	_onBodyContextMenuFn : function(e) {
		e.stopEvent();
		var eh = this.ehandler;
		var target = e.getTarget();
		var tgEl = Ext.get(target);
		if (!tgEl.hasClass("x-calendar-event")) {
			tgEl = tgEl.parent(".x-calendar-event")
		}
		if (tgEl) {
			eh.showContextMenu(e, tgEl);
			this.menu.hide()
		} else {
			if (this.createByDblclick) {
				var pvEl = Ext.get(target);
				if (!pvEl.hasClass("x-dayview-pool-viewer")) {
					pvEl = pvEl
							.parent(".x-dayview-pool-viewer")
				}
				if (pvEl) {
					this.menu.pn = this.calculatePos(e);
					this.menu.showAt(e.getXY());
					eh.cmenu.hide()
				}
			}
		}
	},
	_onBodyDblclickFn : function(e) {
		var eh = this.ehandler;
		var target = e.getTarget();
		var tgEl = Ext.get(target);
		if (!tgEl.hasClass("x-calendar-event")) {
			tgEl = tgEl.parent(".x-calendar-event")
		}
		if (tgEl && !tgEl.bindEvent.locked) {
			eh.showEditor(tgEl, this, "update")
		} else {
			if (this.createByDblclick) {
				var pvEl = Ext.get(target);
				if (!pvEl.hasClass("x-dayview-pool-viewer")) {
					pvEl = pvEl
							.parent(".x-dayview-pool-viewer")
				}
				if (pvEl) {
					var pos = this.calculatePos(e);
					var epos = Ext.apply( {}, pos);
					this.selectRange(pos, epos);
					this.startPos = null;
					eh.prepareLegend(Ext.get(this.id
							+ "-x-dayview-bg-0-" + pos.y), pos,
							epos, this)
				}
			}
		}
	},
	resetResizeEventEl : function() {
		if (this.resizeEventEl) {
			delete (this.resizeEventEl)
		}
	},
	_onPortMouseDownFn : function(e) {
		e.stopEvent();
		this.fireEvent("hideeditor");
		this.fireEvent("canceldetail");
		if (0 == e.button) {
			var target = e.getTarget();
			var tgEl = Ext.get(target);
			var eh = this.ehandler;
			if (tgEl.hasClass("x-dayview-viewer-cell")) {
				if (!this.createByDblclick) {
					this.preEl = eh.prepareEvent(tgEl, this);
					this.preEl.base = this.preEl.bindEvent.startRow;
					eh.setEditingStatus(this.preEl, true);
					eh.floating = true
				}
			} else {
				if (tgEl.hasClass("x-event-bottom-default")) {
					var eEl = tgEl.parent(".x-event-cover");
					var event = eEl.bindEvent;
					if (!event.locked) {
						event.oldStartRow = event.startRow;
						event.oldEndRow = event.endRow;
						this.resizeEventEl = eEl
					} else {
						this.resetResizeEventEl()
					}
				} else {
					if (!tgEl.hasClass("x-event-pin")
							&& !tgEl
									.hasClass("x-event-content-link")) {
						delete (this.preEl);
						var eEl = tgEl;
						if (!eEl.hasClass("x-event-cover")) {
							eEl = tgEl.parent(".x-event-cover")
						}
						if (eEl) {
							var event = eEl.bindEvent;
							if (!event.locked) {
								event.oldStartRow = event.startRow;
								event.oldEndRow = event.endRow;
								eEl.span = event.endRow
										- event.startRow;
								this.dragEventEl = eEl
							} else {
								this.resetDragEventEl()
							}
						}
					}
				}
			}
		}
	},
	movePrepareEl : function(prepareEl, e) {
		var event = prepareEl.bindEvent;
		var base = prepareEl.base;
		var baseEl = Ext.get(this.id + "-x-dayview-viewer-"
				+ base + "-0");
		var top = baseEl.getTop();
		var bottom = baseEl.getBottom();
		var y = e.getXY()[1];
		if (y >= top) {
			var h = y - top;
			var plot = Math.round(h / 26);
			h = plot * 26;
			event.startRow = base;
			event.endRow = base + plot + 1;
			if (this.endRow < event.endRow) {
				event.endRow = this.endRow;
				h = 26 * (this.endRow - base - 1)
			}
			prepareEl.contentEl.setHeight(h);
			prepareEl.titleEl.dom.innerHTML = "<b>"
					+ this.ehandler.generateTitle(event)
					+ "</b>";
			prepareEl.setY(top)
		} else {
			var h = bottom - y;
			var plot = Math.round(h / 26);
			h = plot * 26;
			event.startRow = base - plot;
			event.endRow = base + 1;
			if (this.startRow > event.startRow) {
				event.startRow = this.startRow;
				h = 26 * (event.endRow - event.startRow - 1)
			}
			prepareEl.contentEl.setHeight(h);
			prepareEl.titleEl.dom.innerHTML = "<b>"
					+ this.ehandler.generateTitle(event)
					+ "</b>";
			var t = bottom - prepareEl.getHeight();
			prepareEl.setY(t)
		}
	},
	resizingEventEl : function(eventEl, e) {
		eventEl.setStyle("cursor", "s-resize");
		var event = eventEl.bindEvent;
		var eh = this.ehandler;
		eh.floating = true;
		var xy = e.getXY();
		var bl = this.cbody.getLeft();
		var fn = Ext.get(this.id + "-x-dayview-viewer-"
				+ this.startRow + "-0");
		var lt = fn.getXY(), cw = fn.getWidth(), ch = fn
				.getHeight() + 1;
		var y = xy[1] - lt[1];
		var row = this.startRow + Math.ceil(y / ch);
		if (this.endRow < row) {
			row = this.endRow
		}
		var r = (this.endRow == row) ? this.endRow - 1 : row;
		var pn = Ext.get(this.id + "-x-dayview-viewer-" + r
				+ "-" + eventEl.col);
		var left = pn.getLeft() - bl;
		event.endRow = row;
		if (this.endRow < event.endRow) {
			event.endRow = this.endRow
		}
		if (event.endRow <= event.startRow) {
			event.endRow = event.startRow + 1
		}
		var h = ch * (event.endRow - event.startRow) - 24;
		eventEl.setStyle("left", left + "px");
		eventEl.setStyle("width", cw + "px");
		eventEl.contentEl.setHeight(h);
		eventEl.titleEl.dom.innerHTML = "<b>"
				+ eh.generateTitle(event) + "</b>";
		eh.setEditingStatus(eventEl, true)
	},
	moveEventEl : function(eventEl, e) {
		var eh = this.ehandler;
		var xy = e.getXY();
		var bl = this.cbody.getLeft(), bt = this.cbody.getTop();
		var fn = Ext.get(this.id + "-x-dayview-viewer-"
				+ this.startRow + "-0");
		var lt = fn.getXY(), cw = fn.getWidth(), ch = fn
				.getHeight() + 1;
		var x = xy[0] - lt[0], y = xy[1] - lt[1];
		var row = this.startRow + Math.ceil(y / ch), col = Math
				.floor(x / cw);
		row -= 1;
		if (this.startRow > row) {
			row = this.startRow
		} else {
			if (this.endRow <= row) {
				row = this.endRow - 1
			}
		}
		if (0 > col) {
			col = 0
		} else {
			if (this.dayNum <= col) {
				col = this.dayNum - 1
			}
		}
		var pn = Ext.get(this.id + "-x-dayview-viewer-" + row
				+ "-" + col);
		var left = pn.getLeft() - bl;
		var top = pn.getTop() - bt;
		eventEl.setStyle("left", left + "px");
		eventEl.setStyle("top", top + "px");
		eventEl.setStyle("width", cw + "px");
		eh.floating = true;
		eh.setEditingStatus(eventEl, true);
		var event = eventEl.bindEvent;
		var span = eventEl.span || event.endRow
				- event.startRow;
		event.startRow = row;
		event.endRow = event.startRow + span;
		if (this.endRow - 1 < event.startRow) {
			event.startRow = this.endRow - 1
		}
		if (this.endRow < event.endRow) {
			event.endRow = this.endRow
		}
		var h = 26 * (event.endRow - event.startRow - 1);
		eventEl.contentEl.setHeight(h);
		eventEl.titleEl.dom.innerHTML = "<b>"
				+ eh.generateTitle(event) + "</b>";
		eventEl.nol = col;
		eventEl.row = row
	},
	_onPortMouseMoveFn : function(e) {
		if (0 == e.button) {
			if (this.preEl) {
				this.movePrepareEl(this.preEl, e)
			} else {
				if (this.dragEventEl) {
					this.moving = true;
					this.moveEventEl(this.dragEventEl, e)
				} else {
					if (this.resizeEventEl) {
						this.resizingEventEl(
								this.resizeEventEl, e)
					}
				}
			}
		} else {
			this.resetResizeEventEl();
			this.resetDragEventEl();
			this.resetPrepareEl()
		}
	},
	initEls : function() {
		this.port = Ext.get(this.id + "-x-dayview-port");
		this.cbody = Ext.get(this.id + "-x-dayview-body");
		this.lefter = Ext.get(this.id + "-x-dayview-lefter");
		this.cheader = Ext.get(this.id + "-x-dayview-header");
		this.cpool = Ext.get(this.id + "-x-dayview-pool");
		this.cptable = Ext.get(this.id + "-x-dayview-pool-ct");
		this.pviewer = Ext.get(this.id
				+ "-x-dayview-pool-viewer");
		this.pswitch = Ext.get(this.id
				+ "-x-dayview-pool-switch");
		this.port
				.un("mouseover", this._onPortMouseOverFn, this);
		this.port
				.on("mouseover", this._onPortMouseOverFn, this);
		this.body
				.un("mousedown", this._onBodyMouseDownFn, this);
		this.body
				.on("mousedown", this._onBodyMouseDownFn, this);
		this.body.un("click", this._onBodyClickFn, this);
		this.body.on("click", this._onBodyClickFn, this);
		if (!this.ehandler.readOnly) {
			this.body.un("contextmenu",
					this._onBodyContextMenuFn, this);
			this.body.un("dblclick", this._onBodyDblclickFn,
					this);
			this.body.un("mousemove", this._onBodyMouseMoveFn,
					this);
			this.port.un("mousedown", this._onPortMouseDownFn,
					this);
			this.port.un("mousemove", this._onPortMouseMoveFn,
					this);
			this.body.on("mousemove", this._onBodyMouseMoveFn,
					this);
			this.body.on("contextmenu",
					this._onBodyContextMenuFn, this);
			this.body.on("dblclick", this._onBodyDblclickFn,
					this);
			this.port.on("mousedown", this._onPortMouseDownFn,
					this);
			this.port.on("mousemove", this._onPortMouseMoveFn,
					this);
			if (this.createByDblclick) {
				this.port.un("dblclick",
						this._onPortDblclickFn, this);
				this.port.on("dblclick",
						this._onPortDblclickFn, this)
			}
			this.port.un("click", this._onPortClickFn, this);
			this.port.un("contextmenu",
					this._PortContextMenuFn, this);
			this.port.on("click", this._onPortClickFn, this);
			this.port.on("contextmenu",
					this._PortContextMenuFn, this);
			this.initMenu();
			if (1 < this.dayNum) {
				this.initDragZone(this.body)
			}
		}
		this.initSelectCover();
		this.initDetailCt()
	},
	_PortContextMenuFn : function(e) {
		e.preventDefault();
		var target = e.getTarget();
		var tgEl = Ext.get(target);
		if (tgEl.hasClass("x-dayview-viewer-cell")) {
			this.menu.pn = tgEl;
			this.menu.showAt(e.getXY());
			this.ehandler.cmenu.hide()
		}
	},
	initMenu : function() {
		// var lan = Ext.ux.calendar.Mask.DayView;
		var lan = this.ehandler.lang.DayView;
		this.addItem = new Ext.menu.Item( {
			iconCls :"icon-sys-calendar-event_add",
			text :lan["addItem.text"],
			handler :this.onAddFn,
			scope :this
		});
		this.menu = new Ext.menu.Menu( {
			items : [ this.addItem ]
		});
		this.menu = Ext.menu.MenuMgr.get(this.menu)
	},
	onAddFn : function(item) {
		var pn = item.parentMenu.pn;
		if (pn) {
			if (pn instanceof Ext.Element) {
				this.addEvent2Row(pn)
			} else {
				this.startPos = pn;
				this.endPos = pn;
				this.ehandler.prepareLegend(null, this)
			}
		}
	},
	addEvent2Row : function(pn) {
		var eh = this.ehandler;
		eh.floating = true;
		this.preEl = eh.prepareEvent(pn, this);
		this.preEl.base = this.preEl.bindEvent.startRow;
		eh.showEditor(this.preEl, this, "add");
		eh.floating = false;
		delete (this.preEl)
	},
	_onPortDblclickFn : function(e) {
		var target = e.getTarget();
		var tgEl = Ext.get(target);
		var eh = this.ehandler;
		if (tgEl.hasClass("x-dayview-viewer-cell")) {
			this.addEvent2Row(tgEl)
		}
	},
	initDetailCt : function() {
		var eh = this.ehandler;
		var html = eh.detailTpl.apply( {});
		this.detailCt = Ext.DomHelper.append(this.body, html,
				true);
		this.detailCt.setStyle("display", "none");
		this.detailTitle = this.detailCt
				.child(".x-event-detail-title-td");
		this.detailViewer = this.detailCt
				.child(".x-event-detail-viewer");
		this.detailFoot = this.detailCt
				.child(".x-event-detail-foot-text")
	},
	initDragZone : function(bindEl) {
		var proxy = new Ext.dd.StatusProxy( {
			dropNotAllowed :"x-dd-drop-ok"
		});
		bindEl.dragzone = new Ext.dd.DragZone(bindEl, {
			cview :this,
			ddGroup :"x-mycalendar",
			proxy :proxy,
			onStartDrag : function() {
				this.cview.dragging = true;
				( function() {
					var event = this.dragData.bindEvent;
					var arr = Ext.DomQuery.select(
							"div[name=x-event-"
									+ event.day + "-"
									+ event.eday + "-"
									+ event.eventId
									+ "]",
							this.cview.body.dom);
					for ( var i = 0, len = arr.length; i < len; i++) {
						Ext.get(arr[i]).setOpacity(0.3)
					}
				}).defer(1, this)
			},
			getDragData : function(e) {
				var target = e.getTarget();
				var tgEl = Ext.get(target);
				if (!tgEl.hasClass("x-calendar-event")) {
					tgEl = tgEl
							.parent(".x-calendar-event")
				}
				if (tgEl) {
					var event = tgEl.bindEvent;
					if (!event.locked) {
						var ddel = tgEl.dom
								.cloneNode(true);
						var w = tgEl.getWidth();
						if (200 < w) {
							ddel.style.width = "200px"
						} else {
							ddel.style.width = w + "px"
						}
						return {
							ddel :ddel,
							bindEvent :event
						}
					}
				}
				return false
			},
			getRepairXY : function() {
				return null
			},
			onDrag : function(e) {
				var event = this.dragData.bindEvent;
				var cview = this.cview;
				var eh = cview.ehandler;
				var span = Ext.ux.calendar.Mask
						.getDayOffset(event.day,
								event.eday);
				var pos = cview.calculatePos(e);
				var epos = cview.addSpan2Pos(pos, span);
				cview.selectRange(pos, epos)
			},
			endDrag : function(e) {
				var event = this.dragData.bindEvent;
				var oevent = Ext.apply( {}, event);
				var cview = this.cview;
				var spos = cview.startPos;
				var eh = cview.ehandler;
				var dnum = Ext.ux.calendar.Mask
						.getDayOffset(event.day,
								event.eday);
				var date = cview.daySet[spos.y];
				var day = date.format("Y-m-d");
				if (event.day != day) {
					event.eday = date.add(Date.DAY,
							dnum).format("Y-m-d");
					event.day = day;
					delete (cview.startPos);
					if ("string" == Ext
							.type(event.repeatType)) {
						eh.updateEvent(event, cview,
								spos.y)
					} else {
						event.repeatType = "exception";
						eh.updateRepeatEvent(event,
								cview, oevent)
					}
				} else {
					var arr = Ext.DomQuery.select(
							"div[name=x-event-"
									+ event.day + "-"
									+ event.eday + "-"
									+ event.eventId
									+ "]",
							this.cview.body.dom);
					for ( var i = 0, len = arr.length; i < len; i++) {
						var eEl = Ext.get(arr[i]);
						eEl.setOpacity(1)
					}
				}
				cview.dragging = false;
				cview.resetSCover();
				cview.fireEvent("canceldetail")
			}
		});
	},
	addSpan2Pos : function(pos, span) {
		var o = Ext.apply( {}, pos);
		o.y += span;
		if (o.y >= this.dayNum) {
			o.y = this.dayNum - 1
		}
		return o
	},
	alignDetailCt : function() {
		if (this.detailing) {
			var x = this.detailing.x, y = this.detailing.y, events = this.detailing.events;
			this.detailCt.setStyle("display", "");
			var cEl = Ext.get(this.id + "-x-dayview-bg-" + x
					+ "-" + y);
			var h = events.length * 17, mh = this.port
					.getBottom()
					- cEl.getTop() - 30;
			var roffset = this.port.getRight() - cEl.getRight();
			var hpos;
			var offset = [ 0, 0 ];
			if (h > mh) {
				this.detailViewer.setHeight(mh)
			} else {
				this.detailViewer.setStyle("height", "")
			}
			if (1 < this.dayNum
					&& roffset < this.detailCt.getWidth()) {
				hpos = "r";
				offset[0] = -1
			} else {
				hpos = "l"
			}
			var cw = cEl.getWidth();
			if (200 < cw) {
				this.detailCt.setWidth(cw)
			} else {
				this.detailCt.setWidth(200)
			}
			var str = "t" + hpos;
			this.detailCt.alignTo(cEl, str + "-" + str, offset)
		}
	},
	showDetails : function(day) {
		// var lan = Ext.ux.calendar.Mask.DayView;
		var lan = this.ehandler.lang.DayView;
		var eh = this.ehandler;
		var glayout = eh.calendarLayout;
		var events = glayout.getWholeList(this, day, false,
				true);
		var index = this.getIndexFromDay(day);
		var x = 0;
		var y = index % this.shiftDay;
		this.detailing = {
			x :x,
			y :y,
			events :events
		};
		this.detailTitle.dom.innerHTML = '<b><u id="'
				+ Ext.id() + "x-dayview-day-link-" + x + "-"
				+ y + '" class="x-dayview-header-day-link">'
				+ day + "</u></b>";
		this.detailFoot.dom.innerHTML = events.length + " "
				+ lan.events;
		eh.bindEvent2Detail(this, events, this.detailViewer);
		this.alignDetailCt()
	},
	_onBodyMouseDownFn : function(e) {
		e.stopEvent();
		this.fireEvent("hideeditor");
		var target = e.getTarget();
		var tgEl = Ext.get(target);
		var eEl;
		if (tgEl.hasClass("x-event-more")) {
			var day = tgEl.dom.getAttribute("name");
			this.showDetails(day)
		} else {
			if (this.detailing) {
				if (!(tgEl.hasClass("x-event-detail-ct") || tgEl
						.parent(".x-event-detail-ct"))) {
					this.fireEvent("canceldetail")
				} else {
					return
				}
			}
			if (!this.createByDblclick
					&& !this.ehandler.readOnly) {
				if (tgEl.hasClass("x-calendar-event")) {
					eEl = tgEl
				} else {
					eEl = tgEl.parent(".x-calendar-event")
				}
				if (!eEl) {
					eEl = tgEl.parent(".x-dayview-pool-viewer");
					if (eEl) {
						var pos = this.calculatePos(e);
						this.selectRange(pos, pos)
					}
				}
			}
		}
	},
	calculatePos : function(e) {
		var xy = e.getXY();
		var lt = this.pviewer.getXY();
		var y = Math.floor((xy[0] - lt[0]) / this.cw);
		if (0 > y) {
			y = 0
		} else {
			if (y >= this.dayNum) {
				y = this.dayNum - 1
			}
		}
		return {
			x :0,
			y :y
		}
	},
	_onBodyMouseMoveFn : function(e) {
		if (0 == e.button) {
			if (this.startPos) {
				var pos = this.calculatePos(e);
				this.selectRange(null, pos)
			}
		} else {
			this.resetSCover()
		}
	},
	hideSCovers : function() {
		this.scover.dom.style.display = "none"
	},
	selectRange : function(spos, epos) {
		this.hideSCovers();
		if (spos) {
			this.startPos = spos
		} else {
			spos = this.startPos
		}
		this.endPos = epos;
		var sy, ey;
		if (this.startPos.y > this.endPos.y) {
			sy = this.endPos.y;
			ey = this.startPos.y
		} else {
			ey = this.endPos.y;
			sy = this.startPos.y
		}
		var cw = this.cw;
		var ch = this.pviewer.getHeight();
		var w, l = cw * sy;
		var sc = this.scover;
		sc.dom.style.display = "";
		w = cw * (ey - sy + 1);
		sc.setWidth(w);
		sc.setHeight(ch);
		sc.setLeft(l + "px");
		sc.setTop("0px")
	},
	initSelectCover : function() {
		var div = document.createElement("div");
		div.className = "x-event-select-cover";
		div = Ext.get(div);
		this.pviewer.appendChild(div);
		this.scover = div
	},
	resizePort : function(relayout) {
		var bh = this.body.getHeight();
		var ph = this.cpool.getHeight();
		var ah = bh - this.cheader.getHeight() - ph - 1;
		if (ah != this.port.getHeight()) {
			this.port.setHeight(ah)
		}
		if (true == relayout) {
			var eh = this.ehandler;
			var glayout = eh.calendarLayout;
			for ( var i = 0, len = this.dayNum; i < len; i++) {
				var layout = glayout.getLayout(this.daySet[i],
						this);
				if (layout) {
					var rs = layout.reLayout();
					eh.renderEvent(this, rs.elist, i)
				}
			}
			this.adjustScroller()
		}
	},
	handleResize : function(bw, bh, still) {
		if (typeof bw == "number") {
			this.cheader.setWidth(bw);
			if (!Ext.isIE) {
				bw -= 2
			}
			var pw = bw - this.scrollOffset;
			var r = pw % 7;
			this.leftWidth = 70 + r;
			Ext.util.CSS.updateRule("." + this.id
					+ "-x-dayview-lefter-width", "width",
					this.leftWidth + "px");
			this.port.setWidth(bw);
			bw = pw - this.leftWidth;
			this.cw = Math.round(bw / this.dayNum)
		}
		if (typeof bh == "number") {
			this.resizePort(true)
		}
		this.alignDetailCt();
		this.updateTimeline();
		this.fireEvent("afterresize", this, bw, bh)
	},
	adjustScroller : function() {
		if (!this.hideInactiveRow) {
			var rh = Ext.get(this.id + "-x-dayview-viewer-"
					+ this.activeStartRow + "-0");
			rh = Ext.get(rh.dom.parentNode);
			this.port.dom.scrollTop = rh.getHeight()
					* this.activeStartRow
		}
	},
	checkLayout : function(force, refresh) {
		var eh = this.ehandler;
		var startDate = this.daySet[0];
		var endDate = this.daySet[this.daySet.length - 1];
		if (eh.isInDayCache(startDate, endDate) && !refresh) {
			var glayout = eh.calendarLayout;
			var layoutSet = {};
			var whole = {};
			for ( var i = 0, len = this.dayNum; i < len; i++) {
				var day = this.daySet[i].format("Y-m-d");
				var layout = glayout.getLayout(day, this);
				whole[day] = glayout.getWholeList(this, day);
				if (true !== layout.visited[this.id] || force) {
					layoutSet[i] = layout;
					this.cleanup(i)
				}
			}
			glayout.showWeek(this, this.cptable.dom.firstChild,
					0, whole, true);
			this.resizePort();
			for ( var p in layoutSet) {
				var layout = layoutSet[p];
				var rs = layout.reLayout(false, true);
				eh.renderEvent(this, rs.elist, p)
			}
			this.adjustScroller()
		} else {
			this.fireEvent("beforeremoteload");
			this.cleanup();
			eh.ds.loadEvent(startDate, endDate, function(
					eventSet) {
				var glayout = eh.calendarLayout;
				var wlist = eventSet.whole;
				glayout.updateWholeList(wlist, "add");
				this.showEvents(eventSet, refresh);
				eh.pushDayCache(startDate, endDate);
				this.adjustScroller();
				this.resizePort(Ext.isIE);
				this.fireEvent("remoteload")
			}, this)
		}
		this.setToday();
		this.updateTimeline()
	},
	showEvents : function(eventSet, refresh) {
		var whole = {};
		var eh = this.ehandler;
		var glayout = eh.calendarLayout;
		for ( var i = 0, len = this.dayNum; i < len; i++) {
			var day = this.daySet[i].format("Y-m-d");
			var layout = glayout.getLayout(day, this,
					eventSet[day] || [], true, refresh);
			if (layout) {
				var rs = layout.reLayout();
				eh.renderEvent(this, rs.elist, i);
				whole[day] = rs.wlist
			}
		}
		glayout.showWeek(this, this.cptable.dom.firstChild, 0,
				whole, true)
	},
	refreshLefter : function() {
		var hnum = this.numInHour;
		for ( var i = 0; i < this.rowCount; i++) {
			for ( var j = 0; j < 1; j++) {
				var hour = Ext.ux.calendar.Mask
						.getIntervalFromRow(this.intervalSlot,
								i, this.hourFormat);
				var rest = i % hnum;
				if (0 != rest && i != this.activeStartRow) {
					hour = '<div class="x-dayview-viewer-row-height" style="text-align:right;"><i><b class="x-dayview-lefter-inner x-dayview-lefter-fine-inner">'
							+ hour + "</b></i></div>"
				} else {
					hour = '<div class="x-dayview-viewer-row-height"><b class="x-dayview-lefter-inner">'
							+ hour + "</b></div>"
				}
				var hEl = Ext.get(this.id
						+ "-x-dayview-lefter-" + i + "-" + j);
				if (hEl) {
					hEl.dom.firstChild.innerHTML = hour
				}
			}
		}
	},
	refreshDate : function() {
		for ( var i = 0; i < this.dayNum; i++) {
			var titleEl = Ext.get(this.id
					+ "-x-dayview-day-link-0-" + i);
			if (titleEl) {
				var day = this.daySet[i].format(this.dayFormat);
				titleEl.dom.innerHTML = day
			}
		}
		var wEl = Ext.get(this.id + "-x-dayview-wn");
		wEl.dom.innerHTML = this.daySet[0].getWeekOfYear()
	},
	resetView : function() {
		this.refreshDate();
		this.setToday()
	},
	cleanup : function(col, pool) {
		if (!pool) {
			if (false == Ext.type(col)) {
				for ( var i = 0; i < this.rowCount; i++) {
					for ( var j = 0; j < this.dayNum; j++) {
						var El = Ext.get(this.id
								+ "-x-dayview-viewer-" + i
								+ "-" + j);
						if (El) {
							El.dom.innerHTML = ""
						}
					}
				}
			} else {
				for ( var i = 0; i < this.rowCount; i++) {
					var El = Ext.get(this.id
							+ "-x-dayview-viewer-" + i + "-"
							+ col);
					if (El) {
						El.dom.innerHTML = ""
					}
				}
			}
		}
		if (this.cptable) {
			var tbody = this.cptable.dom.firstChild;
			while (0 < tbody.childNodes.length) {
				Ext.get(tbody.lastChild).remove()
			}
		}
	},
	getIndexFromDay : function(day) {
		for ( var i = 0, len = this.daySet.length; i < len; i++) {
			var iday = this.daySet[i];
			if (day == iday.format("Y-m-d")) {
				return i
			}
		}
	},
	locateDay : function(day) {
		var fd = this.getStartDate(day);
		this.daySet[0] = fd;
		for ( var i = 1; i < this.dayNum; i++) {
			this.daySet[i] = fd.add(Date.DAY, i)
		}
	},
	showDay : function(day) {
		this.locateDay(day);
		this.resetView();
		this.checkLayout(true)
	},
	goBack : function() {
		var shiftDay = this.shiftDay || this.dayNum;
		var dayNum = this.dayNum;
		var sdate = this.daySet[0];
		var fdate = sdate.add(Date.DAY, -1 * shiftDay);
		var weekNum = this.weekNum || 1;
		this.daySet = [];
		for ( var i = 0; i < weekNum; i++) {
			for ( var j = 0; j < dayNum; j++) {
				this.daySet[this.daySet.length] = fdate.add(
						Date.DAY, i * shiftDay + j)
			}
		}
		this.resetView();
		this.checkLayout(true)
	},
	goNext : function() {
		var shiftDay = this.shiftDay || this.dayNum;
		var dayNum = this.dayNum;
		var sdate = this.daySet[0];
		var fdate = sdate.add(Date.DAY, shiftDay);
		var weekNum = this.weekNum || 1;
		this.daySet = [];
		for ( var i = 0; i < weekNum; i++) {
			for ( var j = 0; j < dayNum; j++) {
				this.daySet[this.daySet.length] = fdate.add(
						Date.DAY, i * shiftDay + j)
			}
		}
		this.resetView();
		this.checkLayout(true)
	},
	isShift : function(startDate, endDate) {
		var maxmin, minmax;
		var day1 = startDate.format("Y-m-d");
		var day2 = this.daySet[0].format("Y-m-d");
		if (day1 < day2) {
			maxmin = day2
		} else {
			maxmin = day1
		}
		day1 = endDate.format("Y-m-d");
		day2 = this.daySet[this.daySet.length - 1]
				.format("Y-m-d");
		if (day1 > day2) {
			minmax = day2
		} else {
			minmax = day1
		}
		if (maxmin > minmax) {
			var sdate = this.getStartDate(startDate);
			this.daySet = [];
			for ( var i = 0; i < this.weekNum; i++) {
				for ( var j = 0; j < this.dayNum; j++) {
					this.daySet[this.daySet.length] = sdate
							.add(Date.DAY, i * this.shiftDay
									+ j)
				}
			}
			return true
		} else {
			return false
		}
	},
	showRange : function(startDate, endDate, force) {
		if (this.isShift(startDate, endDate)) {
			force = true;
			this.resetView()
		}
		this.checkLayout(force)
	}
});
Ext.ns("Ext.ux.calendar");
Ext.ux.calendar.DetailEditor = function(config) {
	Ext.apply(this, config);
	this.ehandler.applyCalendarSetting(this);
	// var lan = Ext.ux.calendar.Mask.Editor;
	var lan = this.ehandler.lang.Editor;
	this.startDayField = new Ext.form.DateField( {
		fieldLabel :lan["startDayField.label"],
		value :new Date(),
		format :"Y-m-d",
		allowBlank :false,
		anchor :"95%",
		editable :false,
		disabled :this.singleDay
	});
	this.startDayField.on("select", this.onStartEndDayCheckFn, this);
	this.startTimeField = new Ext.form.ComboBox( {
		hideLabel :true,
		labelSeparator :"",
		store :Ext.ux.calendar.Mask.getTimeStore(),
		displayField :"hour",
		valueField :"row",
		typeAhead :true,
		mode :"local",
		triggerAction :"all",
		selectOnFocus :true,
		allowBlank :false,
		editable :false,
		anchor :"95%"
	});
	this.startTimeField.on("select", this.onStartTimeSelectFn, this);
	this.endDayField = new Ext.form.DateField( {
		fieldLabel :lan["endDayField.label"],
		labelSeparator :"",
		format :"Y-m-d",
		value :new Date(),
		allowBlank :false,
		anchor :"95%",
		editable :false,
		disabled :this.singleDay
	});
	this.endDayField.on("select", this.onStartEndDayCheckFn, this);
	this.endTimeField = new Ext.form.ComboBox( {
		hideLabel :true,
		labelSeparator :"",
		store :Ext.ux.calendar.Mask.getTimeStore(),
		displayField :"hour",
		valueField :"row",
		typeAhead :true,
		mode :"local",
		triggerAction :"all",
		selectOnFocus :true,
		allowBlank :false,
		editable :false,
		anchor :"95%"
	});
	this.wholeField = new Ext.form.Checkbox( {
		hideLabel :true,
		labelSeparator :"",
		boxLabel :lan["wholeField.label"]
	});
	this.wholeField.on("check", this.onWholeCheck, this);
	this.repeatTypeField = new Ext.form.ComboBox( {
		fieldLabel :lan["repeatTypeField.label"],
		store :Ext.ux.calendar.Mask.getRepeatTypeStore(),
		displayField :"display",
		valueField :"value",
		typeAhead :true,
		mode :"local",
		triggerAction :"all",
		selectOnFocus :true,
		allowBlank :false,
		editable :false,
		anchor :"99%"
	});
	this.subjectField = new Ext.form.TextField( {
		fieldLabel :lan["subjectField.label"],
		anchor :"99%"
	});
	this.contentField = new Ext.form.TextArea( {
		fieldLabel :lan["contentField.label"],
		height :70,
		anchor :"99%"
	});
	var tpl = '<tpl for="."><div class="x-combo-list-item">'
			+ this.ehandler.cTplStr + "</div></tpl>";
	this.calendarField = new Ext.form.ComboBox( {
		fieldLabel :lan["calendarField.label"],
		store :Ext.ux.calendar.Mask.getCalendarStore(),
		displayField :"title",
		valueField :"id",
		typeAhead :true,
		mode :"local",
		triggerAction :"all",
		selectOnFocus :true,
		allowBlank :false,
		anchor :"99%",
		editable :false,
		tpl :tpl
	});
	this.alertCB = new Ext.form.Checkbox( {
		labelSeparator :"",
		anchor :"99%",
		disabled : true,
		boxLabel :lan["alertCB.label"]
	});
	this.lockCB = new Ext.form.Checkbox( {
		labelSeparator :"",
		anchor :"99%",
		boxLabel :lan["lockCB.label"]
	});
	this.returnBtn = new Ext.Button( {
		iconCls :"icon-sys-calendar-door_out",
		text :lan["returnBtn.text"],
		handler :this.onReturnFn,
		scope :this
	});
	this.saveBtn = new Ext.Button( {
		iconCls :"icon-sys-calendar-accept",
		minWidth :80,
		text :lan["saveBtn.text"],
		hidden : this.ehandler.readOnly,
		handler :this.onSaveFn,
		scope :this
	});
	this.cancelBtn = new Ext.Button( {
		iconCls :"icon-sys-calendar-cancel",
		minWidth :80,
		text :lan["cancelBtn.text"],
		handler :this.onCancelFn,
		scope :this
	});
	this.timepanel = new Ext.Panel( {
		border :false,
		layout :"column",
		items : [ {
			columnWidth :0.33,
			border :false,
			layout :"form",
			items : [ this.startDayField ]
		}, {
			columnWidth :0.15,
			border :false,
			layout :"form",
			items : [ this.startTimeField ]
		}, {
			columnWidth :0.22,
			border :false,
			layout :"form",
			labelWidth :15,
			items : [ this.endDayField ]
		}, {
			columnWidth :0.15,
			border :false,
			layout :"form",
			items : [ this.endTimeField ]
		}, {
			columnWidth :0.15,
			border :false,
			items : [ this.wholeField ]
		} ]
	});
	this.repeatIntervalField = new Ext.form.NumberField( {
		fieldLabel :lan["repeatIntervalField.label"],
		labelSeparator :"",
		value :1,
		allowBlank :false,
		anchor :"99%"
	});
	this.repeatIntervalField.on("valid", this.onRepeatIntervalValidFn, this);
	this.intervalUnitLabel = new Ext.util.LabelField( {
		hideLabel :true,
		labelSeparator :""
	});
	this.repeatStartField = new Ext.form.DateField( {
		fieldLabel :lan["repeatStartField.label"],
		format :"Y-m-d",
		allowBlank :false,
		anchor :"90%"
	});
	this.repeatStartField.on("select", this.onRepeatStartSelectFn, this);
	this.repeatNoEndRG = new Ext.form.Radio( {
		boxLabel :lan["repeatNoEndRG.label"],
		name :"repeat-end-type"
	});
	this.repeatEndTimeRG = new Ext.form.Radio( {
		boxLabel :lan["repeatEndTimeRG.label"],
		name :"repeat-end-type"
	});
	this.repeatEndTimeField = new Ext.form.NumberField( {
		width :50,
		value :10,
		allowBlank :false,
		disabled :true
	});
	this.repeatEndDateRG = new Ext.form.Radio( {
		boxLabel :lan["repeatEndDateRG.label"],
		name :"repeat-end-type"
	});
	this.repeatEndDateField = new Ext.form.DateField( {
		hideLabel :true,
		labelSeparator :"",
		format :"Y-m-d",
		allowBlank :false,
		anchor :"99%",
		disabled :true,
		value :(new Date()).add(Date.DAY, 365)
	});
	var checkListener = {
		check : {
			fn :this.refreshRepeatInfo,
			scope :this
		}
	};
	var items = [];
	var nd = new Date();
	var n = nd.format("N");
	var mon = nd.add(Date.DAY, 1 - n);
	for ( var i = 0; i < 7; i++) {
		items.push( {
			boxLabel :mon.add(Date.DAY, i).format("D"),
			listeners :checkListener
		})
	}
	this.weekCheckGroup = new Ext.form.CheckboxGroup( {
		fieldLabel :lan["weekCheckGroup.label"],
		items :items,
		anchor :"100%"
	});
	this.monthRadioGroup = new Ext.form.RadioGroup( {
		fieldLabel :lan["monthRadioGroup.label"],
		items : [ {
			boxLabel :lan.repeatByDate,
			name :"repeat-month-group",
			checked :true
		}, {
			boxLabel :lan.repeatByDay,
			name :"repeat-month-group",
			listeners :checkListener
		} ],
		anchor :"60%"
	});
	this.generalForm = new Ext.form.FormPanel( {
		border :false,
		style :"padding:10px;",
		frame :true,
		autoHeight :true,
		labelWidth :80,
		items : [ this.timepanel, {
			border :false,
			layout :"column",
			items : [{
				border :false,
				columnWidth :0.7,
				layout :"form",
				items : [ this.calendarField ]
			}, {
				border :false,
				columnWidth :0.15,
				items : [ this.alertCB ]
			}, {
				border :false,
				columnWidth :0.15,
				items : [ this.lockCB ]
			}]
		}, this.subjectField, this.contentField]
	});
	this.repeatInfoPanel = new Ext.Panel({
		border :false,
		html :'<div class="x-repeat-event-info-ct"><div class="x-repeat-event-info"></div></div>'
	});
	var cws;
	if (Ext.isIE) {
		if ("3.0.3" == Ext.version) {
			cws = [ 0.4, 0.2, 0.38, 0.4, 0.6 ]
		} else {
			cws = [ 0.2, 0.1, 0.3, 0.2, 0.3 ]
		}
	} else {
		cws = [ 0.4, 0.2, 0.38, 0.4, 0.6 ]
	}
	this.repeatForm = new Ext.form.FormPanel({
		border :false,
		style :"padding:10px;",
		frame :true,
		autoHeight :true,
		labelWidth :80,
		items : [ this.repeatTypeField, {
			border :false,
			style :"padding-left:85px;",
			layout :"column",
			items : [ {
				border :false,
				columnWidth :0.25,
				layout :"form",
				items : [ this.repeatIntervalField ]
			}, {
				border :false,
				columnWidth :0.2,
				items : [ this.intervalUnitLabel ]
			} ]
		}, this.repeatInfoPanel, {
			border :false,
			style :"padding-left:85px;",
			layout :"form",
			items : [ this.weekCheckGroup ]
		}, {
			border :false,
			style :"padding-left:85px;",
			layout :"form",
			items : [ this.monthRadioGroup ]
		}, {
			border :false,
			style :"padding-left:85px;",
			layout :"column",
			items : [ {
				border :false,
				columnWidth :0.5,
				layout :"form",
				labelWidth :75,
				items : [ this.repeatStartField ]
			}, {
				border :false,
				columnWidth :0.5,
				items : [ this.repeatNoEndRG, {
					border :false,
					layout :"column",
					items : [ {
						border :false,
						columnWidth :cws[0],
						items : [ this.repeatEndTimeRG ]
					}, {
						border :false,
						columnWidth :cws[1],
						items : [ this.repeatEndTimeField ]
					}, {
						border :false,
						columnWidth :cws[2],
						layout :"form",
						labelWidth :95,
						items : [ {
							xtype :"textfield",
							fieldLabel :lan.repeatEndTimeUnit,
							labelSeparator :"",
							hidden :true
						} ]
					} ]
				}, {
					border :false,
					layout :"column",
					items : [ {
						border :false,
						columnWidth :cws[3],
						items : [ this.repeatEndDateRG ]
					}, {
						border :false,
						columnWidth :cws[4],
						layout :"form",
						items : [ this.repeatEndDateField ]
					} ]
				} ]
			} ]
		} ]
	});
	Ext.ux.calendar.DetailEditor.superclass.constructor.call(this, {
		border :false,
		autoScroll :true,
		items : [ {
			border :false,
			width :650,
			layout :"form",
			items : [ this.generalForm, this.repeatForm ]
		} ],
		buttonAlign :"center",
		buttons : [ this.returnBtn, this.saveBtn, this.cancelBtn ]
	});
	this.addEvents("showdetailsetting");
	this.repeatTypeField.on("select", this.onRepeatTypeSelectFn, this);
	this.calendarField.on("select", this.onCalendarSelectFn, this);
	this.repeatNoEndRG.on("check", this.onRepeatNoEndCheckFn, this);
	this.repeatEndTimeRG.on("check", this.onRepeatEndTimeCheckFn, this);
	this.repeatEndDateRG.on("check", this.onRepeatEndDateCheckFn, this)
};
Ext.extend(Ext.ux.calendar.DetailEditor,Ext.ux.calendar.BasicView,{
	onRepeatIntervalValidFn : function() {
		this.refreshRepeatInfo()
	},
	onRepeatStartSelectFn : function(df) {
		this.refreshRepeatInfo()
	},
	refreshRepeatInfo : function() {
		var beginDate = this.repeatStartField.getValue();
		var intervalSlot = this.repeatIntervalField.getValue();
		var getIntervalText = Ext.ux.calendar.Mask.getIntervalText;
		// var lan = Ext.ux.calendar.Mask.Editor;
		var lan = this.ehandler.lang.Editor;
		var v = this.repeatTypeField.getValue();
		var str = "";
		if ("day" == v) {
			this.updateRepeatInfo(getIntervalText(v, intervalSlot));
		} else {
			if ("week" == v) {
				var monday = beginDate.add(Date.DAY,
						1 - beginDate.format("N"));
				var cbs = this.weekCheckGroup.items;
				var num = 0;
				for ( var i = 0, len = cbs.getCount(); i < len; i++) {
					var cb = cbs.get(i);
					if (cb.checked) {
						num++;
						str += monday.add(Date.DAY, i).format(
								"l")
								+ " "
					}
				}
				if (7 == num) {
					str = lan.repeatDayInfo
				} else {
					if (0 == num) {
						str = beginDate.format("l")
					}
				}
				this.updateRepeatInfo(getIntervalText(v, intervalSlot) + str);
			} else {
				if ("month" == v) {
					var rds = this.monthRadioGroup.items;
					if (rds.get(1).checked) {
						str = Ext.ux.calendar.Mask.getWeekDayInMonth(beginDate);
					} else {
						str = beginDate.format("d")
					}
					this.updateRepeatInfo(getIntervalText(v, intervalSlot) + str);
				} else {
					if ("year" == v) {
						this.updateRepeatInfo(getIntervalText(v, intervalSlot) + beginDate.format("m-d"))
					}
				}
			}
		}
	},
	updateRepeatInfo : function(html) {
		var div = this.repeatInfoPanel.body.dom.firstChild.firstChild;
		div.innerHTML = html;
	},
	onRepeatTypeSelectFn : function(combo, rd, index) {
		var v = combo.getValue();
		this.resetRepeatSetting(v, this.bindEl.bindEvent);
	},
	resetRepeatSetting : function(v, event) {
		var rt = event.repeatType || "no";
		// var lan = Ext.ux.calendar.Mask.Editor;
		var lan = this.ehandler.lang.Editor;
		var items = this.repeatForm.items;
		if ("no" == v || "exception" == v) {
			items.get(1).hide();
			items.get(2).hide();
			items.get(3).hide();
			items.get(4).hide();
			items.get(5).hide()
		} else {
			items.get(1).show();
			items.get(2).show();
			if ("day" == v || "year" == v) {
				if ("day" == v) {
					this.intervalUnitLabel
							.setText(lan["intervalUnitLabel.day.text"])
				} else {
					this.intervalUnitLabel
							.setText(lan["intervalUnitLabel.year.text"])
				}
				items.get(3).hide();
				items.get(4).hide()
			} else {
				if ("week" == v) {
					this.intervalUnitLabel
							.setText(lan["intervalUnitLabel.week.text"]);
					items.get(3).show();
					this.weekCheckGroup.reset();
					var cbs = this.weekCheckGroup.items;
					cbs.each( function(it) {
						it.checked = false
					});
					if ("string" != Ext.type(rt)) {
						var rday = rt.rday;
						for ( var p in rday) {
							cbs.get(p - 1).setValue(true)
						}
					}
					items.get(4).hide()
				} else {
					if ("month" == v) {
						this.intervalUnitLabel
								.setText(lan["intervalUnitLabel.month.text"]);
						items.get(3).hide();
						items.get(4).show();
						this.monthRadioGroup.reset();
						var rds = this.monthRadioGroup.items;
						rds.each( function(it) {
							it.checked = false
						});
						if ("string" != Ext.type(rt)) {
							var rby = rt.rby;
							if ("day" == rby) {
								rds.get(1).setValue(true)
							} else {
								rds.get(0).setValue(true)
							}
						}
					}
				}
			}
			items.get(5).show();
			this.repeatForm.doLayout();
			this.repeatNoEndRG.checked = false;
			this.repeatEndTimeRG.checked = false;
			this.repeatEndDateRG.checked = false;
			if ("string" != Ext.type(rt)) {
				this.repeatIntervalField
						.setValue(rt.intervalSlot);
				this.repeatStartField.setValue(rt.beginDay);
				if ("no" == rt.endDay) {
					if (false != Ext.type(rt.rtime)) {
						this.repeatEndTimeRG.setValue(true)
					} else {
						this.repeatNoEndRG.setValue(true)
					}
				} else {
					this.repeatEndDateRG.setValue(true);
					this.repeatEndDateField.setValue(rt.endDay)
				}
			} else {
				if ("day" == v) {
					this.repeatIntervalField
							.setValue(Ext.ux.calendar.Mask
									.getDayOffset(event.day,
											event.eday) + 1)
				} else {
					this.repeatIntervalField.setValue(1)
				}
				this.repeatStartField.setValue(event.day);
				this.repeatNoEndRG.setValue(true)
			}
			this.refreshRepeatInfo()
		}
	},
	onRepeatNoEndCheckFn : function(cb, checked) {
		if (checked) {
			this.repeatEndTimeField.disable();
			this.repeatEndDateField.disable()
		}
	},
	onRepeatEndTimeCheckFn : function(cb, checked) {
		if (checked) {
			this.repeatEndTimeField.enable();
			this.repeatEndDateField.disable()
		}
	},
	onRepeatEndDateCheckFn : function(cb, checked) {
		if (checked) {
			this.repeatEndTimeField.disable();
			this.repeatEndDateField.enable()
		}
	},
	onReturnFn : function() {
		var calendarContainer = this.ownerCt;
		var cview = this.bview;
		calendarContainer.getLayout().setActiveItem(cview);
		cview.checkLayout(true)
	},
	onStartEndDayCheckFn : function(df) {
		var sdate = this.startDayField.getValue();
		var sday = sdate.format("Y-m-d");
		var edate = this.endDayField.getValue();
		var eday = edate.format("Y-m-d");
		if (sday >= eday) {
			if (df == this.startDayField) {
				this.endDayField.setValue(sdate)
			} else {
				if (df == this.endDayField) {
					this.startDayField.setValue(edate)
				}
			}
			var sv = this.startTimeField.getValue();
			var ev = this.endTimeField.getValue();
			this.reloadEndTimeStore(sv);
			if (sv > ev) {
				ev = sv + this.numInHour;
				if (ev >= this.activeEndRow) {
					ev = this.activeEndRow - 1
				}
				this.endTimeField.setValue(ev)
			}
		}
	},
	reloadStartTimeStore : function(all) {
		var store = this.startTimeField.store;
		store.removeAll();
		var data;
		if (all) {
			data = Ext.ux.calendar.Mask.generateIntervalData(
					this.intervalSlot, 0, this.rowCount - 1,
					this.ehandler.hourFormat)
		} else {
			data = Ext.ux.calendar.Mask.generateIntervalData(
					this.intervalSlot, this.activeStartRow,
					this.activeEndRow - 1,
					this.ehandler.hourFormat)
		}
		store.loadData(data)
	},
	reloadEndTimeStore : function(sIndex, all) {
		var store = this.endTimeField.store;
		store.removeAll();
		var data;
		if (all) {
			data = Ext.ux.calendar.Mask.generateIntervalData(
					this.intervalSlot, 0, this.rowCount,
					this.ehandler.hourFormat)
		} else {
			if (false == Ext.type(sIndex)) {
				sIndex = this.activeStartRow
			} else {
				sIndex++
			}
			data = Ext.ux.calendar.Mask
					.generateIntervalData(this.intervalSlot,
							sIndex, this.activeEndRow,
							this.ehandler.hourFormat)
		}
		store.loadData(data)
	},
	onStartTimeSelectFn : function(combo, rd, index) {
		var v = combo.getValue();
		var eIndex;
		var sday = this.startDayField.getValue()
				.format("Y-m-d");
		var eday = this.endDayField.getValue().format("Y-m-d");
		if (this.bindEl) {
			var event = this.bindEl.bindEvent;
			if (sday != eday) {
				this.reloadEndTimeStore()
			} else {
				var span = event.endRow - event.startRow;
				eIndex = v + span;
				this.reloadEndTimeStore(v)
			}
		}
		if (false != Ext.type(eIndex)) {
			if (this.activeEndRow >= eIndex) {
				this.endTimeField.setValue(eIndex)
			} else {
				this.endTimeField.setValue(this.activeEndRow)
			}
		}
	},
	onCalendarSelectFn : function(combo, rd, index) {
		var coverEl = this.bindEl;
		if (coverEl && !coverEl.hold) {
			var event = coverEl.bindEvent;
			var cview = coverEl.cview;
			var eh = cview.ehandler;
			var color = eh.calendarSet[rd.data.id].color;
			var arr = Ext.DomQuery.select("div[name=x-event-"
					+ event.day + "-" + event.eday + "-"
					+ event.eventId + "]", cview.body.dom);
			for ( var i = 0, len = arr.length; i < len; i++) {
				coverEl = Ext.get(arr[i]);
				if (coverEl instanceof Ext.Element) {
					if (0 == event.startRow
							&& this.rowCount == event.endRow) {
						if (this.oldColor != color) {
							eh.changeWholeColor(coverEl,
									this.oldColor, color)
						}
					} else {
						if (this.oldColor != color) {
							if (cview instanceof Ext.ux.calendar.DayView) {
								eh.changeEventColor(coverEl,
										this.oldColor, color)
							} else {
								eh.changeLegendColor(coverEl,
										this.oldColor, color)
							}
						}
					}
				}
			}
		}
		this.oldColor = color
	},
	onWholeCheck : function() {
		var sday = this.startDayField.getValue()
				.format("Y-m-d");
		var eday = this.endDayField.getValue().format("Y-m-d");
		if (this.bindEl) {
			var event = this.bindEl.bindEvent;
			if (this.wholeField.checked) {
				var getHMFromRow = Ext.ux.calendar.Mask.getHMFromRow;
				this.reloadStartTimeStore(true);
				this.reloadEndTimeStore(null, true);
				this.startTimeField.setRawValue(getHMFromRow(
						this.intervalSlot, 0, this.hourFormat));
				this.endTimeField.setRawValue(getHMFromRow(
						this.intervalSlot, this.rowCount,
						this.hourFormat));
				this.startTimeField.disable();
				this.endTimeField.disable()
			} else {
				var startRow, endRow;
				startRow = (this.activeStartRow <= event.startRow) ? event.startRow
						: this.activeStartRow;
				endRow = (this.activeEndRow >= event.endRow) ? event.endRow
						: this.activeEndRow - 1;
				this.reloadStartTimeStore();
				this.startTimeField.setValue(startRow);
				if (sday == eday
						&& this.rowCount != event.endRow) {
					this.reloadEndTimeStore(startRow)
				} else {
					this.reloadEndTimeStore()
				}
				this.endTimeField.setValue(endRow);
				this.startTimeField.enable();
				this.endTimeField.enable()
			}
			this.startDayField.setValue(event.day);
			this.endDayField.setValue(event.eday)
		}
	},
	onSaveFn : function() {
		if (this.generalForm.form.isValid()) {
			if (this.bindEl) {
				var coverEl = this.bindEl;
				var event = coverEl.bindEvent;
				var oevent = Ext.apply( {}, event);
				var cview = coverEl.cview;
				var eh = cview.ehandler;
				if ("add" == this.action && !coverEl.hold) {
					coverEl.remove()
				}
				if (this.wholeField.checked) {
					event.allDay = true;
					event.startRow = 0;
					event.endRow = this.rowCount
				} else {
					event.startRow = parseInt(this.startTimeField
							.getValue());
					event.endRow = parseInt(this.endTimeField
							.getValue())
				}
				event.day = this.startDayField.getValue()
						.format("Y-m-d");
				var edate = this.endDayField.getValue();
				if (0 == event.endRow) {
					edate = edate.add(Date.DAY, -1);
					event.endRow = this.rowCount
				}
				event.eday = edate.format("Y-m-d");
				event.subject = this.subjectField.getValue();
				event.content = this.contentField.getValue();
				event.calendarId = this.calendarField
						.getValue();
				event.color = eh.calendarSet[event.calendarId].color;
				event.alertFlag = this.alertCB.checked;
				event.locked = this.lockCB.checked;
				event = this.handleRepeatType(event);
				if ("add" == this.action) {
					if ("string" == Ext.type(event.repeatType)) {
						eh.createEvent(event, cview)
					} else {
						eh.createRepeatEvent(event, cview)
					}
				} else {
					if ("update" == this.action) {
						if ("string" == Ext.type(oevent.repeatType) && "string" == Ext.type(event.repeatType)) {
							event.repeatType = oevent.repeatType;
							eh.updateEvent(event, cview, null,
									oevent, this.noLayout)
						} else {
							if ("string" == Ext.type(event.repeatType)) {
								// var lan = Ext.ux.calendar.Mask.EventHandler;
								var lan = eh.lang.EventHandler;
								Ext.Msg.show( {
											title :lan["updateRepeatPopup.title"],
											msg :lan["updateRepeatPopup.msg"],
											buttons :Ext.Msg.YESNOCANCEL,
											fn : function(bid,
													text) {
												if ("yes" == bid) {
													eh
															.updateRepeatEvent(
																	event,
																	cview,
																	oevent)
												} else {
													if ("no" == bid) {
														event.repeatType = "exception";
														eh
																.updateRepeatEvent(
																		event,
																		cview,
																		oevent)
													}
												}
											},
											icon :Ext.MessageBox.QUESTION
										})
							} else {
								eh.updateRepeatEvent(event, cview, oevent);
							}
						}
					}
				}
			}
			cview.fireEvent("canceldetail");
			this.onReturnFn()
		}
	},
	handleRepeatType : function(e) {
		var event = Ext.apply( {}, e);
		var nrt = this.repeatTypeField.getValue();
		if ("no" == nrt) {
			event.repeatType = "no"
		} else {
			var o = {
				rtype :nrt,
				intervalSlot :this.repeatIntervalField
						.getValue(),
				dspan :Ext.ux.calendar.Mask.getDayOffset(e.day,
						e.eday),
				beginDay :this.repeatStartField.getValue()
						.format("Y-m-d")
			};
			if (this.repeatNoEndRG.checked) {
				o.endDay = "no"
			} else {
				if (this.repeatEndTimeRG.checked) {
					o.endDay = "no";
					o.rtime = this.repeatEndTimeField
							.getValue()
				} else {
					if (this.repeatEndDateRG.checked) {
						o.endDay = this.repeatEndDateField
								.getValue().format("Y-m-d")
					}
				}
			}
			if ("week" == nrt) {
				var obj = {};
				var items = this.weekCheckGroup.items;
				var flag = false;
				for ( var i = 0, len = items.getCount(); i < len; i++) {
					var it = items.get(i);
					if (it.checked) {
						flag = true;
						obj[i + 1] = true
					}
				}
				if (!flag) {
					var n = Date.parseDate(event.day, "Y-m-d")
							.format("N");
					obj[n] = true
				}
				o.rday = obj
			} else {
				if ("month" == nrt) {
					var items = this.monthRadioGroup.items;
					if (true == items.get(0).checked) {
						o.rby = "date"
					} else {
						o.rby = "day"
					}
				}
			}
			event.repeatType = o
		}
		return event
	},
	onCancelFn : function() {
		var coverEl = this.bindEl;
		var coverEl = this.bindEl;
		if (coverEl) {
			var cview = coverEl.cview;
			var event = coverEl.bindEvent;
			var eh = cview.ehandler;
			if (!coverEl.hold) {
				if ("add" == this.action) {
					this.bindEl.remove()
				} else {
					var color = eh.calendarSet[event.calendarId].color;
					if (0 == event.startRow
							&& this.rowCount == event.endRow) {
						if (this.oldColor != color) {
							eh.changeWholeColor(coverEl,
									this.oldColor, color)
						}
					} else {
						if (this.oldColor != color) {
							if (cview instanceof Ext.ux.calendar.DayView) {
								eh.changeEventColor(coverEl,
										this.oldColor, color)
							} else {
								eh.changeLegendColor(coverEl,
										this.oldColor, color)
							}
						}
					}
				}
			}
			this.onReturnFn()
		}
	},
	setup : function(obj) {
		this.noLayout = obj.noLayout;
		this.bindEl = obj.bindEl;
		this.action = obj.action;
		this.bview = obj.cview;
		if (this.bindEl) {
			var coverEl = this.bindEl;
			var cview = coverEl.cview;
			var eh = cview.ehandler;
			if (coverEl instanceof Ext.Element) {
				eh.setEditingStatus(coverEl, true)
			}
			var bindEvent = coverEl.bindEvent;
			if (bindEvent.endRow == this.rowCount
					&& bindEvent.startRow == 0) {
				this.wholeField.setValue(true)
			} else {
				if (this.wholeField.getValue()) {
					this.wholeField.setValue(false)
				} else {
					this.reloadStartTimeStore();
					if (bindEvent.day != bindEvent.eday) {
						this.reloadEndTimeStore()
					} else {
						this
								.reloadEndTimeStore(bindEvent.startRow)
					}
				}
			}
			this.repeatStartField.setValue(bindEvent.day);
			this.startTimeField.setValue(bindEvent.startRow);
			this.endTimeField.setValue(bindEvent.endRow);
			this.subjectField.setValue(bindEvent.subject);
			this.contentField.setValue(bindEvent.content);
			this.startDayField.setValue(bindEvent.day);
			this.endDayField.setValue(bindEvent.eday);
			var v = "no";
			var rt = bindEvent.repeatType;
			if (rt && "string" != Ext.type(rt)) {
				v = rt.rtype
			}
			if ("exception" == v) {
				v = "no"
			}
			this.repeatTypeField.setValue(v);
			this.resetRepeatSetting(v, bindEvent);
			if (bindEvent.alertFlag) {
				this.alertCB.setValue(true)
			} else {
				this.alertCB.setValue(false)
			}
			if (bindEvent.locked) {
				this.lockCB.setValue(true)
			} else {
				this.lockCB.setValue(false)
			}
			this.reloadCalendar(eh);
			this.calendarField.setValue(bindEvent.calendarId);
			this.oldColor = eh.calendarSet[bindEvent.calendarId].color
		} else {
			this.wholeField.setValue(true)
		}
		this.generalForm.doLayout();
		this.repeatForm.doLayout()
	},
	reloadCalendar : function(eh) {
		var store = this.calendarField.store;
		store.removeAll();
		for ( var p in eh.calendarSet) {
			var calendar = eh.calendarSet[p];
			if (true !== calendar.hide) {
				var rd = new (store.recordType)( {
					id :calendar.id,
					title :calendar.name,
					description :calendar.description,
					color :calendar.color
				});
				store.add(rd)
			}
		}
	}
});
Ext.ns("Ext.ux.calendar");
Ext.ux.calendar.Editor = function(config) {
	Ext.apply(this, config);
	this.ehandler.applyCalendarSetting(this);
	// var lan = Ext.ux.calendar.Mask.Editor;
	var lan = this.ehandler.lang.Editor;
	this.timeField = new Ext.util.LabelField( {
		fieldLabel :lan["startDayField.label"],
		anchor :"99%"
	});
	this.subjectField = new Ext.form.TextField( {
		fieldLabel :lan["subjectField.label"],
		anchor :"99%"
	});
	this.contentField = new Ext.form.TextArea( {
		fieldLabel :lan["contentField.label"],
		height : 80,
		anchor :"99%"
	});
	var tpl = '<tpl for="."><div class="x-combo-list-item">'
			+ this.ehandler.cTplStr + "</div></tpl>";
	this.calendarField = new Ext.form.ComboBox( {
		fieldLabel :lan["calendarField.label"],
		store :Ext.ux.calendar.Mask.getCalendarStore(),
		displayField :"title",
		valueField :"id",
		typeAhead :true,
		mode :"local",
		triggerAction :"all",
		selectOnFocus :true,
		allowBlank :false,
		anchor :"99%",
		editable :false,
		tpl :tpl,
		initList : function() {
			Ext.form.ComboBox.prototype.initList.call(this);
			this.list.setZIndex(999999)
		}
	});
	this.alertCB = new Ext.form.Checkbox( {
		anchor :"99%",
		disabled : true,
		boxLabel :lan["alertCB.label"]
	});
	this.deleteBtn = new Ext.Button( {
		iconCls :"icon-sys-calendar-delete",
		text :lan["deleteBtn.text"],
		disabled :true,
		handler :this.onRemoveFn,
		scope :this
	});
	this.saveBtn = new Ext.Button( {
		iconCls :"icon-sys-calendar-accept",
		text :lan["saveBtn.text"],
		handler :this.onSaveFn,
		scope :this
	});
	this.detailBtn = new Ext.Button( {
		iconCls :"icon-sys-calendar-detail",
		text :lan.detailSetting,
		handler :this.onDetailFn,
		scope :this
	});
	this.cancelBtn = new Ext.Button( {
		iconCls :"icon-sys-calendar-cancel",
		minWidth :80,
		text :lan["cancelBtn.text"],
		handler :this.onCancelFn,
		scope :this
	});
	this.formpanel = new Ext.form.FormPanel( {
		border :false,
		style :"padding:10px;",
		labelWidth :75,
		frame :true,
		items : [ this.timeField, this.subjectField, this.contentField, {
			border :false,
			layout :"column",
			items : [ {
				columnWidth :0.7,
				border :false,
				layout :"form",
				items : [ this.calendarField ]
			}, {
				columnWidth :0.3,
				border :false,
				items : [ this.alertCB ]
			}]
		} ],
		buttonAlign :"center",
		buttons : [ this.detailBtn, this.deleteBtn, this.saveBtn,
				this.cancelBtn ]
	});
	Ext.ux.calendar.Editor.superclass.constructor.call(this, {
		style :"left:-1000px;top:-1000px;",
		title :" ",
		width :460,
		height :250,
		baseCls :"x-tip",
		closable :true,
		closeAction :"onCancelFn",
		resizable :false,
		frame :true,
		layout : 'fit',
		floating : {
			shadow :true,
			shim :true,
			useDisplay :true,
			constrain :false
		},
		items : [ this.formpanel ]
	});
	this.addEvents("showdetailsetting", "hided", "hideeditor", "showed");
	this.on("render", this.onRenderFn, this);
	this.on("showed", this.onShowFn, this);
	this.on("hided", this.onHideFn, this);
	this.on("hideeditor", this.onHideEditorFn, this);
	this.calendarField.on("select", this.onCalendarSelectFn, this)
};
Ext.extend(Ext.ux.calendar.Editor, Ext.Panel, {
	initComponent : function() {
		Ext.ux.calendar.Editor.superclass.initComponent.call(this);
		if (this.closable && !this.title) {
			this.elements += ",header"
		}
	},
	afterRender : function() {
		Ext.ux.calendar.Editor.superclass.afterRender.call(this);
		if (this.closable) {
			this.addTool( {
				id :"close",
				handler :this[this.closeAction],
				scope :this
			})
		}
	},
	onRenderFn : function(p) {
		p.getEl().on("mousedown", function(e) {
			this.mdFlag = true
		}, this);
		p.getEl().on("mouseup", function(e) {
			delete (this.mdFlag);
			e.stopPropagation()
		}, this)
	},
	onDetailFn : function() {
		this.hideEditor();
		this.fireEvent("showdetailsetting", this.obj)
	},
	onCalendarSelectFn : function(combo, rd, index) {
		var coverEl = this.bindEl;
		if (coverEl && !coverEl.hold) {
			var event = coverEl.bindEvent;
			var cview = coverEl.cview;
			var eh = cview.ehandler;
			var color = eh.calendarSet[rd.data.id].color;
			var arr = Ext.DomQuery.select("div[name=x-event-" + event.day + "-"
					+ event.eday + "-" + event.eventId + "]", cview.body.dom);
			for ( var i = 0, len = arr.length; i < len; i++) {
				coverEl = Ext.get(arr[i]);
				if (0 == event.startRow && this.rowCount == event.endRow) {
					if (this.oldColor != color) {
						eh.changeWholeColor(coverEl, this.oldColor, color)
					}
				} else {
					if (this.oldColor != color) {
						if (cview instanceof Ext.ux.calendar.DayView) {
							eh.changeEventColor(coverEl, this.oldColor, color)
						} else {
							eh.changeLegendColor(coverEl, this.oldColor, color)
						}
					}
				}
			}
		}
		this.oldColor = color
	},
	onRemoveFn : function() {
		// var lan = Ext.ux.calendar.Mask.EventHandler;
		var coverEl = this.bindEl;
		var be = coverEl.bindEvent;
		var cview = coverEl.cview;
		var eh = cview.ehandler;
		var col = coverEl.col;
		var lan = eh.lang.EventHandler;
		if (coverEl) {
			if ("string" == Ext.type(be.repeatType)) {
				eh.freeEventEl(coverEl);
				eh.deleteEvent(be, cview, col)
			} else {
				Ext.Msg.show( {
					title :lan["deleteRepeatPopup.title"],
					msg :lan["deleteRepeatPopup.msg"],
					buttons :Ext.Msg.YESNOCANCEL,
					fn : function(bid, text) {
						if ("yes" == bid) {
							eh.freeEventEl(coverEl);
							eh.deleteRepeatEvent(be, cview)
						} else {
							if ("no" == bid) {
								eh.freeEventEl(coverEl);
								eh.deleteRepeatEvent(be, cview, true)
							}
						}
					},
					icon :Ext.MessageBox.QUESTION
				})
			}
		}
		cview.fireEvent("canceldetail");
		this.hideEditor()
	},
	onSaveFn : function() {
		if (this.formpanel.form.isValid()) {
			var eh = this.ehandler;
			var cview = this.cview;
			if (this.bindEl) {
				var coverEl = this.bindEl;
				var event = coverEl.bindEvent;
				var oevent = Ext.apply( {}, event);
				if ("add" == this.action && !coverEl.hold) {
					coverEl.remove()
				}
				event.repeatType = event.repeatType || "no";
				event.allDay = false;
				event.alertFlag = this.alertCB.checked;
				if (!event.locked) {
					event.locked = false
				}
				event.subject = this.subjectField.getValue();
				event.content = this.contentField.getValue();
				event.calendarId = this.calendarField.getValue();
				event.color = eh.calendarSet[event.calendarId].color;
				if ("add" == this.action) {
					if ("string" == Ext.type(event.repeatType)) {
						eh.createEvent(event, cview)
					} else {
						eh.createRepeatEvent(event, cview)
					}
				} else {
					if ("update" == this.action) {
						if ("string" == Ext.type(oevent.repeatType)
								&& "string" == Ext.type(event.repeatType)) {
							eh.updateEvent(event, cview, null, oevent,
									this.noLayout)
						} else {
							if ("string" == Ext.type(event.repeatType)) {
								// var lan = Ext.ux.calendar.Mask.EventHandler;
								var lan = eh.lang.EventHandler;
								Ext.Msg.show( {
									title :lan["updateRepeatPopup.title"],
									msg :lan["updateRepeatPopup.msg"],
									buttons :Ext.Msg.YESNOCANCEL,
									fn : function(bid, text) {
										if ("yes" == bid) {
											eh.updateRepeatEvent(event, cview,
													oevent)
										} else {
											if ("no" == bid) {
												event.repeatType = "exception";
												eh.updateRepeatEvent(event,
														cview, oevent)
											}
										}
									},
									icon :Ext.MessageBox.QUESTION
								})
							} else {
								eh.updateRepeatEvent(event, cview, oevent)
							}
						}
					}
				}
			}
			cview.fireEvent("canceldetail");
			this.hideEditor()
		}
	},
	onCancelFn : function() {
		var coverEl = this.bindEl;
		if (coverEl) {
			var cview = this.cview;
			var event = coverEl.bindEvent;
			var eh = this.ehandler;
			if (!coverEl.hold) {
				if ("add" == this.action) {
					coverEl.remove()
				} else {
					var color = eh.calendarSet[event.calendarId].color;
					if (0 == event.startRow && this.rowCount == event.endRow) {
						if (this.oldColor != color) {
							eh.changeWholeColor(coverEl, this.oldColor, color)
						}
					} else {
						if (this.oldColor != color) {
							if (cview instanceof Ext.ux.calendar.DayView) {
								eh.changeEventColor(coverEl, this.oldColor,
										color)
							} else {
								eh.changeLegendColor(coverEl, this.oldColor,
										color)
							}
						}
					}
				}
			}
			this.hideEditor()
		}
	},
	popup : function(obj) {
		var eh = this.ehandler;
		eh.floating = true;
		this.obj = obj;
		this.noLayout = obj.noLayout;
		this.bindEl = obj.bindEl;
		this.cview = obj.cview;
		this.action = obj.action;
		// var lan = Ext.ux.calendar.Mask.Editor;
		var lan = eh.lang.Editor;
		if ("add" == this.action) {
			this.deleteBtn.disable();
			this.setIconClass("x-event-editor-title-add");
			this.setTitle(lan["new.title"])
		} else {
			this.deleteBtn.enable();
			this.setTitle(lan["edit.title"]);
			this.setIconClass("x-event-editor-title-edit")
		}
		this.showAt(this.adjustXY(this.bindEl))
	},
	adjustXY : function(pn) {
		var pxy = pn.getXY();
		var cview = pn.cview;
		var xy = [ 0, 0 ];
		var w = this.width, h = this.height;
		var r = pxy[0] + w;
		xy[0] = pxy[0];
		var right = cview.body.getRight();
		if (r > right) {
			xy[0] = right - w
		}
		xy[1] = pxy[1] - h;
		var top = cview.body.getTop();
		if (xy[1] < top) {
			if (pxy[1] > top) {
				xy[1] = pxy[1] + 20
			} else {
				xy[1] = top + 20
			}
		}
		return xy
	},
	reloadCalendar : function(eh) {
		var store = this.calendarField.store;
		store.removeAll();
		for ( var p in eh.calendarSet) {
			var calendar = eh.calendarSet[p];
			if (true !== calendar.hide) {
				var rd = new (store.recordType)( {
					id :calendar.id,
					title :calendar.name,
					description :calendar.description,
					color :calendar.color
				});
				store.add(rd)
			}
		}
	},
	onShowFn : function() {
		var eh = this.ehandler;
		if (this.bindEl) {
			var coverEl = this.bindEl;
			if (!coverEl.hold) {
				eh.setEditingStatus(coverEl, true)
			}
			var bindEvent = coverEl.bindEvent;
			var time = "<b>" + eh.generateInfo(bindEvent) + "</b>";
			this.timeField.setText(time);
			this.subjectField.setValue(bindEvent.subject);
			this.contentField.setValue(bindEvent.content);
			if (bindEvent.alertFlag) {
				this.alertCB.setValue(true)
			} else {
				this.alertCB.setValue(false)
			}
			this.reloadCalendar(eh);
			this.calendarField.setValue(bindEvent.calendarId);
			this.oldColor = eh.calendarSet[bindEvent.calendarId].color
		} else {
		}
	},
	onHideFn : function() {
		var eh = this.ehandler;
		eh.floating = false;
		var cview = this.cview;
		if (this.bindEl) {
			cview.resetSCover()
		}
		delete (this.bindEl);
		delete (this.cview);
		delete (this.noLayout);
		delete (this.action)
	},
	hideEditor : function() {
		if (!this.hided) {
			this.hided = true;
			this.showAt( [ -1000, -1000 ], true);
			this.fireEvent("hided")
		}
	},
	showAt : function(xy, hold) {
		if (!hold) {
			this.fireEvent("showed");
			delete (this.hided)
		}
		this.setPagePosition(xy[0], xy[1])
	},
	onHideEditorFn : function() {
		if (!this.mdFlag) {
			this.onCancelFn()
		}
	}
});
Ext.ns("Ext.ux.calendar");
Ext.ux.calendar.EventHandler = function(config) {
	Ext.apply(this, config);
	this.applyCalendarSetting(this);
	this.calendarSet = {};
	this.dayCache = {};
	this.id = Ext.id();
	Ext.ux.calendar.EventHandler.superclass.constructor.call(this);
	this.calendarLayout = new Ext.ux.calendar.CalendarLayout( {
		ehandler :this
	});
	var initobj = this.ds.initialObj;
	if (initobj) {
		for ( var i = 0, len = initobj.owned.length; i < len; i++) {
			var c = initobj.owned[i];
			this.calendarSet[c.id] = c
		}
		for ( var i = 0, len = initobj.shared.length; i < len; i++) {
			var c = initobj.shared[i];
			this.calendarSet[c.id] = c
		}
		this.calendarLayout.repeatSet = initobj.re
	}
	this.detailTpl = new Ext.XTemplate(
			'<div class="x-event-detail-ct"><div class="x-event-detail-title"><table width="100%" border="0"><tbody><tr><td class="x-event-detail-title-td">{title}</td><td class="x-event-detail-tool"><img class="x-event-detail-tool-close" src="'
					+ Ext.BLANK_IMAGE_URL
					+ '"></img></td></tr></tbody></table></div><div class="x-event-detail-viewer"></div><div class="x-event-detail-foot"><table width="100%" border="0"><tbody><tr><td class="x-event-detail-foot-tool"><img class="x-event-detail-foot-info" src="'
					+ Ext.BLANK_IMAGE_URL
					+ '"></img></td><td><b class="x-event-detail-foot-text"></b></td></tr></tbody></table></div></div>');
	this.eventTpl = new Ext.XTemplate(
			'<div eid="{id}" name="x-event-{day}-{eday}-{id}" class="'
					+ this.id
					+ "-x-calendar-{calendarId}-event x-event-cover "
					+ this.id
					+ '-x-calendar-{calendarId} x-calendar-event" style="{cover-style}" unselectable="on" onselectstart="return false;"><div style="height:18px;"><table width="100%" cellspacing="0" cellpadding="0" border="0"><tbody><tr><td style="{left-style}"><div class="x-calendar-{color}-event-ltcorner-clear  x-event-lt-default">&nbsp;</div></td><td><div class="x-calendar-{color}-event-top-clear x-event-inner x-event-title-default" style="{title-style}"><b qtip="{time}<br><b><u>{subject}</u></b><br>{content}">{title}</b></div></td><td style="{right-style}"><div class="x-calendar-{color}-event-rtcorner-clear  x-event-rt-default">&nbsp;</div></td></tr></tbody></table></div><div class="x-calendar-{color}-event-lr x-event-content-default" style="{content-style}"><img class="x-calendar-event-pin-off x-event-pin" src="'
					+ Ext.BLANK_IMAGE_URL
					+ '"></img><tpl if="this.isRepeat(repeatType)"><img class="x-repeat-event" src="'
					+ Ext.BLANK_IMAGE_URL
					+ '"></img> </tpl><tpl if="this.isException(repeatType)"><img class="x-exception-event" src="'
					+ Ext.BLANK_IMAGE_URL
					+ '"></img> </tpl><tpl if="this.isAlert(alertFlag)"><img class="x-alert-event" src="'
					+ Ext.BLANK_IMAGE_URL
					+ '"></img> </tpl><tpl if="this.isLocked(locked)"><img class="x-locked-event" src="'
					+ Ext.BLANK_IMAGE_URL
					+ '"></img> </tpl><u class="x-event-content-link" qtip="{time}<br><b><u>{subject}</u></b><br>{content}">{subject}</u><br>{content}</div><div><table width="100%" cellspacing="0" cellpadding="0" border="0"><tbody><tr><td style="{left-style}"><div class="x-calendar-{color}-event-lbcorner">&nbsp;</div></td><td><div style="{bottom-style}" class="x-calendar-{color}-event-bottom x-event-bottom-default">&nbsp;</div></td><td style="{right-style}"><div class="x-calendar-{color}-event-rbcorner">&nbsp;</div></td></tr></tbody></table></div></div>',
			{
				isRepeat : function(repeatType) {
					return ("string" != Ext.type(repeatType))
				},
				isException : function(repeatType) {
					return ("exception" == repeatType)
				},
				isAlert : function(alertFlag) {
					return alertFlag
				},
				isLocked : function(locked) {
					return locked
				}
			});
	this.eventTpl.compile();
	this.legendTpl = new Ext.XTemplate(
			'<div eid="{id}" name="x-event-{day}-{eday}-{id}" class="'
					+ this.id
					+ "-x-calendar-{calendarId}-legend x-legend-cover "
					+ this.id
					+ '-x-calendar-{calendarId} x-calendar-event" unselectable="on" onselectstart="return false;"><b class="x-legend-title-b x-legend-title-{color}" qtip="{time}<br><b><u>{subject}</u></b><br>{content}"><tpl if="this.isRepeat(repeatType)"><img class="x-repeat-event" src="'
					+ Ext.BLANK_IMAGE_URL
					+ '"></img> </tpl><tpl if="this.isException(repeatType)"><img class="x-exception-event" src="'
					+ Ext.BLANK_IMAGE_URL
					+ '"></img> </tpl><tpl if="this.isAlert(alertFlag)"><img class="x-alert-event" src="'
					+ Ext.BLANK_IMAGE_URL
					+ '"></img> </tpl><tpl if="this.isLocked(locked)"><img class="x-locked-event" src="'
					+ Ext.BLANK_IMAGE_URL
					+ '"></img> </tpl>{title} {subject}</b></div>', {
				isRepeat : function(repeatType) {
					return ("string" != Ext.type(repeatType))
				},
				isException : function(repeatType) {
					return ("exception" == repeatType)
				},
				isAlert : function(alertFlag) {
					return alertFlag
				},
				isLocked : function(locked) {
					return locked
				}
			});
	this.legendTpl.compile();
	this.wholeTpl = new Ext.XTemplate(
			'<div eid="{id}" name="x-event-{day}-{eday}-{id}" class="'
					+ this.id
					+ "-x-calendar-{calendarId}-whole x-whole-cover "
					+ this.id
					+ '-x-calendar-{calendarId} x-calendar-event" unselectable="on" onselectstart="return false;"><table width="100%" cellspacing="0" cellpadding="0" border="0"><tbody><tr><td class="x-whole-td"><div class="x-calendar-{color}-whole-left x-whole-left">&nbsp;</div><tpl if="this.isLeftJoin(lflag)"><div class="x-whole-left-join"></div></tpl></td><td class="x-whole-title-{color} x-whole-title">&nbsp;<b class="x-whole-title-b" qtip="{time}<br><b><u>{subject}</u></b><br>{content}"><tpl if="this.isRepeat(repeatType)"><img class="x-repeat-white-event" src="'
					+ Ext.BLANK_IMAGE_URL
					+ '"></img> </tpl><tpl if="this.isException(repeatType)"><img class="x-exception-white-event" src="'
					+ Ext.BLANK_IMAGE_URL
					+ '"></img> </tpl><tpl if="this.isAlert(alertFlag)"><img class="x-alert-white-event" src="'
					+ Ext.BLANK_IMAGE_URL
					+ '"></img> </tpl><tpl if="this.isLocked(locked)"><img class="x-locked-white-event" src="'
					+ Ext.BLANK_IMAGE_URL
					+ '"></img> </tpl>{subject}</b></td><td class="x-whole-td"><div class="x-calendar-{color}-whole-right x-whole-right">&nbsp;</div><tpl if="this.isRightJoin(rflag)"><div class="x-whole-right-join"></div></tpl></td></tr></tbody></table></div>',
			{
				isLeftJoin : function(lflag) {
					return lflag
				},
				isRightJoin : function(rflag) {
					return rflag
				},
				isRepeat : function(repeatType) {
					return ("string" != Ext.type(repeatType))
				},
				isException : function(repeatType) {
					return ("exception" == repeatType)
				},
				isAlert : function(alertFlag) {
					return alertFlag
				},
				isLocked : function(locked) {
					return locked
				}
			});
	this.wholeTpl.compile();
	this.cTplStr = '<div id="'
			+ this.id
			+ '-x-calendar-{calendarId}" class="'
			+ this.id
			+ '-x-calendar-{calendarId}-whole x-calendar-cover" unselectable="on" onselectstart="return false;"><div class="x-calendar-title-b" style="width:135px;"><b>{title}</b></div><table width="100%" cellspacing="0" cellpadding="0" border="0"><tbody><tr><td class="x-calendar-td"><div class="x-calendar-{color}-whole-left x-whole-left">&nbsp;</div></td><td class="x-whole-title-{color} x-calendar-title">&nbsp;</td><td class="x-calendar-td"><div class="x-calendar-{color}-whole-right x-whole-right">&nbsp;</div></td></tr></tbody></table></div>';
	this.calendarDropTpl = new Ext.XTemplate(
			'<div class="x-calendardrop-cover" hidefocus="true" unselectable="on" onselectstart="return false;"><table width="100%" cellspacing="0" cellpadding="0" border="0"><tbody><tr><td>' + this.cTplStr + '</td><td class="x-legend-tool-td"><div class="x-legend-tool"></div></td></tr></tbody></table><div>');
	this.calendarDropTpl.compile();
	this.calendarTpl = new Ext.XTemplate(this.cTplStr);
	this.calendarTpl.compile();
	this.initMenu();
	this.initContextMenu();
	this.addEvents("calendarloaded", "reloadCalendar", "createEvent",
			"updateEvent", "deleteEvent", "changeDay", "deleteCalendar",
			"clearCalendar", "changeEventCache", "changeCalendarColor");
	this.on("reloadCalendar", this.reloadCalendar, this);
	this.on("changeCalendarColor", this.onChangeCalendarColorFn, this);
	this.on("changeEventCache", this.onChangeEventCacheFn, this)
};
Ext.extend(Ext.ux.calendar.EventHandler, Ext.util.Observable,{
	ss : [],
	hourFormat :"",
	baseIndex :100,
	widthRatio :0.95,
	posRatio :1.05,
	applyCalendarSetting : function(source) {
		var cs = this.calendarSetting;
		var o = Ext.apply( {}, cs);
		delete (o.dayFormat);
		delete (o.weekFormat);
		delete (o.monthFormat);
		Ext.apply(source, o)
	},
	onChangeCalendarColorFn : function() {
	},
	onChangeEventCacheFn : function() {
	},
	showMenu : function(cEl, dEl) {
		if (this.menu) {
			this.menu.calendarEl = cEl;
			var calendar = cEl.calendar;
			//var lan = Ext.ux.calendar.Mask.EventHandler;
			var lan = this.lang.EventHandler;
			if (true === this.calendarSet[calendar.id].hide) {
				this.viewItem.setText(lan["viewItem.show.text"]);
				this.viewItem.setIconClass("icon-sys-calendar-calendar_show")
			} else {
				this.viewItem.setText(lan["viewItem.hide.text"]);
				this.viewItem.setIconClass("icon-sys-calendar-calendar_hide")
			}
			var c = 0;
			for ( var p in this.calendarSet) {
				c++
			}
			if (1 >= c) {
				this.deleteItem.hide()
			} else {
				this.deleteItem.show()
			}
			if (this.readOnly) {
				for ( var i = 2, len = this.menu.items
						.getCount(); i < len; i++) {
					var it = this.menu.items.get(i);
					it.hide()
				}
			}
			this.menu.bindEl = dEl;
			this.menu.show(dEl, this.menuAlign)
		}
		return this
	},
	onMenuShowFn : function(menu) {
		var calendar = menu.calendarEl.calendar;
		if(calendar.id == 0){
			menu.items.get(2).disable();
			menu.items.get(3).disable();
		}else{
			menu.items.get(2).enable();
			menu.items.get(3).enable();
		}
		var color = Ext.ux.calendar.Mask.getColorByIndex(calendar.color);
		if (color) {
			menu.palette.still = true;
			menu.palette.select("#" + color);
			delete (menu.palette.still)
		}
	},
	hideMenu : function() {
		if (this.menu) {
			this.menu.hide()
		}
		return this
	},
	showContextMenu : function(e, eEl) {
		e.stopEvent();
		if (this.cmenu) {
			this.cmenu.eventEl = eEl;
			var event = eEl.bindEvent;
			if (event.locked) {
				this.editItem.hide();
				this.lockItem.hide();
				this.unlockItem.show()
			} else {
				this.editItem.show();
				this.lockItem.show();
				this.unlockItem.hide()
			}
			this.cmenu.showAt(e.getXY())
		}
	},
	hideContextMenu : function() {
		if (this.cmenu) {
			this.cmenu.hide()
		}
		return this
	},
	initMenu : function() {
		// var lan = Ext.ux.calendar.Mask.EventHandler;
		var lan = this.lang.EventHandler;
		this.showOnlyItem = new Ext.menu.Item( {
			iconCls :"icon-sys-calendar-calendar_show",
			text :lan["showOnlyItem.text"],
			handler :this.onShowOnlyFn,
			scope :this
		});
		this.viewItem = new Ext.menu.Item( {
			iconCls :"icon-sys-calendar-calendar_hide",
			text :lan["viewItem.hide.text"],
			handler :this.onViewFn,
			scope :this
		});
		this.editItem = new Ext.menu.Item( {
			iconCls :"icon-sys-calendar-calendar_edit",
			text :lan["editItem.text"],
			handler :this.onEditFn,
			scope :this
		});
		this.deleteItem = new Ext.menu.Item( {
			iconCls :"icon-sys-calendar-delete",
			text :lan["deleteItem.text"],
			handler :this.onDeleteFn,
			scope :this
		});
		this.clearItem = new Ext.menu.Item( {
			iconCls :"icon-sys-calendar-clear_event",
			text :lan["clearItem.text"],
			handler :this.onClearFn,
			scope :this
		});
		var palette = new Ext.ColorPalette( {});
		this.menu = new Ext.menu.Menu( {
			cls :"x-calendar-menu",
			items : [ this.showOnlyItem, this.viewItem,
					this.editItem, this.deleteItem,
					this.clearItem, "-", palette ]
		});
		this.menu.palette = palette;
		this.menu = Ext.menu.MenuMgr.get(this.menu);
		this.menu.palette.colors = Ext.ux.calendar.Mask.colors;
		this.menu.palette.on("select", this.onCalendarColorChangedFn, this);
		this.menu.on("show", this.onMenuShowFn, this)
	},
	initContextMenu : function() {
		// var lan = Ext.ux.calendar.Mask.EventHandler;
		var lan = this.lang.EventHandler;
		this.lockItem = new Ext.menu.Item( {
			iconCls :"icon-sys-calendar-event_lock",
			text :lan["lockItem.text"],
			handler :this.onLockEventFn,
			scope :this
		});
		this.unlockItem = new Ext.menu.Item( {
			iconCls :"icon-sys-calendar-event_unlock",
			text :lan["unlockItem.text"],
			handler :this.onUnlockEventFn,
			scope :this
		});
		this.editItem = new Ext.menu.Item( {
			iconCls :"icon-sys-calendar-event_edit",
			text :lan["editEvent.title"],
			handler :this.onEditEventFn,
			scope :this
		});
		this.deleteItem = new Ext.menu.Item( {
			iconCls :"icon-sys-calendar-delete",
			text :lan["deleteEvent.title"],
			handler :this.onDeleteEventFn,
			scope :this
		});
		this.cmenu = new Ext.menu.Menu( {
			items : [ this.lockItem, this.unlockItem,
					this.editItem, this.deleteItem ]
		});
		this.cmenu = Ext.menu.MenuMgr.get(this.cmenu)
	},
	onLockEventFn : function(item) {
		var menu = item.parentMenu;
		var eEl = menu.eventEl;
		var cview = eEl.cview;
		var eh = cview.ehandler;
		var event = eEl.bindEvent;
		var oevent = Ext.apply( {}, event);
		event.locked = true;
		if ("string" == Ext.type(event.repeatType)) {
			eh.updateEvent(event, cview)
		} else {
			//var lan = Ext.ux.calendar.Mask.EventHandler;
			var lan = eh.lang.EventHandler;
			Ext.Msg.show( {
				title :lan["updateRepeatPopup.title"],
				msg :lan["updateRepeatPopup.msg"],
				buttons :Ext.Msg.YESNOCANCEL,
				fn : function(bid, text) {
					if ("yes" == bid) {
						eh.updateRepeatEvent(event, cview,
								oevent)
					} else {
						if ("no" == bid) {
							event.repeatType = "exception";
							eh.updateRepeatEvent(event, cview,
									oevent)
						} else {
							event.locked = false
						}
					}
				},
				icon :Ext.MessageBox.QUESTION
			})
		}
	},
	onUnlockEventFn : function(item) {
		var menu = item.parentMenu;
		var eEl = menu.eventEl;
		var cview = eEl.cview;
		var eh = cview.ehandler;
		var event = eEl.bindEvent;
		var oevent = Ext.apply( {}, event);
		event.locked = false;
		if ("string" == Ext.type(event.repeatType)) {
			eh.updateEvent(event, cview)
		} else {
			// var lan = Ext.ux.calendar.Mask.EventHandler;
			var lan = eh.lang.EventHandler;
			Ext.Msg.show( {
				title :lan["updateRepeatPopup.title"],
				msg :lan["updateRepeatPopup.msg"],
				buttons :Ext.Msg.YESNOCANCEL,
				fn : function(bid, text) {
					if ("yes" == bid) {
						eh.updateRepeatEvent(event, cview, oevent);
					} else {
						if ("no" == bid) {
							event.repeatType = "exception";
							eh.updateRepeatEvent(event, cview, oevent);
						} else {
							event.locked = true
						}
					}
				},
				icon :Ext.MessageBox.QUESTION
			})
		}
	},
	onEditEventFn : function(item) {
		var menu = item.parentMenu;
		var eEl = menu.eventEl;
		var cview = eEl.cview;
		var eh = cview.ehandler;
		eh.showEditor(eEl, cview, "update")
	},
	onDeleteEventFn : function(item) {
		//var lan = Ext.ux.calendar.Mask.EventHandler;
		var menu = item.parentMenu;
		var eEl = menu.eventEl;
		var cview = eEl.cview;
		var eh = cview.ehandler;
		var event = eEl.bindEvent;
		var lan = eh.lang.EventHandler;
		if ("string" == Ext.type(event.repeatType)) {
			eh.freeEventEl(eEl);
			eh.deleteEvent(event, cview, eEl.col)
		} else {
			Ext.Msg.show( {
				title :lan["deleteRepeatPopup.title"],
				msg :lan["deleteRepeatPopup.msg"],
				buttons :Ext.Msg.YESNOCANCEL,
				fn : function(bid, text) {
					if ("yes" == bid) {
						eh.freeEventEl(eEl);
						eh.deleteRepeatEvent(event, cview)
					} else {
						if ("no" == bid) {
							eh.freeEventEl(eEl);
							eh.deleteRepeatEvent(event, cview,
									true)
						}
					}
				},
				icon :Ext.MessageBox.QUESTION
			})
		}
	},
	onClearFn : function(item) {
		var lan = this.lang.EventHandler;
		Ext.Msg.confirm(lan["clearCalendar.title"], lan["clearCalendar.msg"], function(btn) {
			if (btn == "yes") {
				var menu = item.parentMenu;
				var cEl = menu.calendarEl;
				var calendar = cEl.calendar;
				var calendarId = calendar.id;
				this.ds.deleteEventsByCalendar(calendarId, function(backObj) {
					delete (this.calendarSet[calendarId]);
					var cc = this.mainPanel.calendarContainer;
					var cview = cc.currentView;
					this.calendarLayout
							.resetLayout(
									{
										hideCalendar :false,
										deleteCalendar :true
									},
									true);
					cview.checkLayout();
					this.fireEvent("changeEventCache", this);
					this.calendarSet[calendarId] = calendar;
				}, this);
			}
		}, this);
	},
	onDeleteFn : function(item) {
		var lan = this.lang.EventHandler;
		Ext.Msg.confirm(lan["deleteCalendar.title"], lan["deleteCalendar.msg"],function(btn) {
			if (btn == "yes") {
				var menu = item.parentMenu;
				var cEl = menu.calendarEl;
				var calendar = cEl.calendar;
				var calendarId = calendar.id;
				this.ds.deleteCalendar(calendarId, function(backObj){
					delete (this.calendarSet[calendarId]);
					var cc = this.mainPanel.calendarContainer;
					var cview = cc.currentView;
					this.calendarLayout.resetLayout({
						hideCalendar :false,
						deleteCalendar :true
					}, true);
					cview.checkLayout();
					this.fireEvent("changeEventCache", this);
					cEl.remove()
				}, this);
			}
		}, this);
	},
	copyCalendarSet : function() {
		var o = {}, cs = this.calendarSet;
		for ( var p in cs) {
			o[p] = Ext.apply( {}, cs[p])
		}
		return o;
	},
	onShowAllFn : function(item) {
		var cview = this.mainPanel.calendarContainer.getLayout().activeItem;
		this.ds.showAllCalendar( function(backObj) {
			var cs = this.calendarSet;
			for ( var p in cs) {
				var c = cs[p];
				c.hide = false;
				var calendarEl = Ext.get(this.id + "-x-calendar-" + p);
				this.showCalendarColor(calendarEl, c.color)
			}
			this.calendarLayout.resetLayout( {
				hideCalendar :true,
				deleteCalendar :false
			}, true);
			cview.checkLayout()
		}, this);
	},
	onShowOnlyFn : function(item) {
		var cview = this.mainPanel.calendarContainer.getLayout().activeItem;
		var menu = item.parentMenu;
		var cEl = menu.calendarEl;
		var calendar = cEl.calendar;
		var id = calendar.id;
		calendar.hide = false;
		this.ds.showOnlyCalendar(id, function(backObj) {
			this.showCalendarColor(cEl, calendar.color);
			var cs = this.calendarSet;
			for ( var p in cs) {
				if (p != id) {
					var c = cs[p];
					c.hide = true;
					var calendarEl = Ext.get(this.id + "-x-calendar-" + p);
					this.hideCalendarColor(calendarEl, c.color)
				}
			}
			this.calendarLayout.resetLayout({
				hideCalendar :true,
				deleteCalendar :false
			}, true);
			cview.checkLayout();
		}, this);
	},
	onViewFn : function(item) {
		var menu = item.parentMenu;
		var cEl = menu.calendarEl;
		var calendar = cEl.calendar;
		// var lan = Ext.ux.calendar.Mask.EventHandler;
		var lan = this.lang.EventHandler;
		calendar.hide = !calendar.hide;
		this.ds.createUpdateCalendar(calendar, function(backObj) {
			if (lan["viewItem.hide.text"] == item.text) {
				item.setText(lan["viewItem.show.text"]);
				this.hideCalendar(calendar, true);
				this.hideCalendarColor(cEl, calendar.color);
			} else {
				item.setText(lan["viewItem.hide.text"]);
				this.hideCalendar(calendar, false);
				this.showCalendarColor(cEl, calendar.color);
			}
		}, this);
	},
	hideCalendar : function(calendar, flag) {
		var id = calendar.id;
		var cview = this.mainPanel.calendarContainer.currentView;
		calendar.hide = flag;
		this.calendarSet[id].hide = flag;
		this.calendarLayout.resetLayout( {
			hideCalendar :true,
			deleteCalendar :false
		}, true);
		cview.checkLayout()
	},
	onEditFn : function(item) {
		var menu = item.parentMenu;
		var cEl = menu.calendarEl;
		var calendar = cEl.calendar;
		this.ceditor.popup( {
			data :calendar,
			cEl :cEl
		})
	},
	prepareLegend : function(pn, spos, epos, cview) {
		var eh = cview.ehandler;
		var sindex = spos.x * cview.shiftDay + spos.y;
		var eindex = epos.x * cview.shiftDay + epos.y;
		var tmp = sindex;
		if (sindex > eindex) {
			sindex = eindex;
			eindex = tmp
		}
		var calendar;
		for ( var p in eh.calendarSet) {
			calendar = eh.calendarSet[p];
			if (true !== calendar.hide) {
				break
			}
		}
		var event = {
			eventId :"prepare",
			calendarId :calendar.id,
			color :calendar.color,
			startRow :0,
			endRow :this.rowCount,
			day :cview.daySet[sindex].format("Y-m-d"),
			eday :cview.daySet[eindex].format("Y-m-d"),
			repeatType :"no"
		};
		pn.hold = true;
		pn.cview = cview;
		pn.bindEvent = event;
		this.showEditor(pn, cview, "add")
	},
	prepareEvent : function(pn, cview) {
		var id = pn.dom.id;
		var pos = cview.getCellIndex(id);
		var eh = cview.ehandler;
		var x = pos.x, y = pos.y;
		var calendar;
		for ( var p in eh.calendarSet) {
			calendar = eh.calendarSet[p];
			if (true !== calendar.hide) {
				break
			}
		}
		var event = {
			eventId :"prepare",
			calendarId :calendar.id,
			color :calendar.color,
			startRow :x,
			endRow :x + this.numInHour,
			day :cview.daySet[y].format("Y-m-d"),
			eday :cview.daySet[y].format("Y-m-d"),
			span :1,
			colIndex :0,
			repeatType :"no"
		};
		return this.renderEvent(cview, [ event ], y, true)
	},
	generateInfo : function(event) {
		var startRow = event.startRow;
		var endRow = event.endRow;
		var hm;
		if (0 == startRow && this.rowCount == endRow) {
			hm = event.day;
			if (event.day != event.eday) {
				hm += " to " + event.eday
			}
			//hm += " " + Ext.ux.calendar.Mask.EventHandler.wholeDay;
			hm += " " + this.lang.EventHandler.wholeDay;
			return hm
		} else {
			hm = event.day
					+ " "
					+ Ext.ux.calendar.Mask.getIntervalFromRow(
							this.intervalSlot, startRow,
							this.hourFormat) + " to ";
			if (event.day != event.eday) {
				hm += event.eday + " ";
			}
			hm += Ext.ux.calendar.Mask.getIntervalFromRow(
					this.intervalSlot, endRow, this.hourFormat);
			return hm
		}
	},
	generateTitle : function(event) {
		var startRow = event.startRow;
		var endRow = event.endRow;
		if (0 == startRow && this.rowCount == endRow) {
			// return Ext.ux.calendar.Mask.EventHandler.wholeDay
			return this.lang.EventHandler.wholeDay;
		} else {
			var hm = Ext.ux.calendar.Mask.getIntervalFromRow(
					this.intervalSlot, startRow,
					this.hourFormat)
					+ "-"
					+ Ext.ux.calendar.Mask.getIntervalFromRow(
							this.intervalSlot, endRow,
							this.hourFormat);
			return hm
		}
	},
	getContentEl : function(coverEl) {
		return coverEl.child(".x-event-content-default")
	},
	getTitleEl : function(coverEl) {
		return coverEl.child(".x-event-title-default")
	},
	getBottomEl : function(coverEl) {
		return coverEl.child(".x-event-bottom-default")
	},
	getLeftTopEl : function(coverEl) {
		return coverEl.child(".x-event-lt-default")
	},
	getRightTopEl : function(coverEl) {
		return coverEl.child(".x-event-rt-default")
	},
	renderEvent : function(cview, rs, col, full) {
		var bl = cview.cbody.getLeft(), bt = cview.cbody.getTop();
		var coverEl;
		for ( var i = 0, len = rs.length; i < len; i++) {
			var e = rs[i];
			var arr = Ext.DomQuery.select("div[eid="
					+ e.eventId + "]", cview.body.dom);
			for ( var j = 0, size = arr.length; j < size; j++) {
				var eEl = Ext.get(arr[j]);
				if (eEl.col == col || eEl.nol == col) {
					if (this.editingId == eEl.dom.id) {
						delete (this.editingId);
						this.editDisabled = false
					}
					this.freeEventEl(eEl)
				}
			}
		}
		for ( var i = 0, len = rs.length; i < len; i++) {
			var e = rs[i];
			var pn = Ext.get(cview.id + "-x-dayview-viewer-"
					+ e.startRow + "-" + col);
			var cl = pn.getLeft();
			var tw = pn.getWidth();
			var offset = Math.round(tw * cview.offsetPercent);
			var cw = tw - offset;
			if (full) {
				cw = tw
			}
			var ct = pn.getTop();
			var ch = (pn.getHeight() + 1)
					* (e.endRow - e.startRow) - 24;
			var r = cw / Math.pow(e.span, this.posRatio)
					* e.colIndex;
			var rest = cw - r;
			var x = Math.round(cl - bl + offset + r);
			if (full) {
				x = Math.round(cl - bl + r)
			}
			var y = Math.round(ct - bt);
			if (true == e.last && 0 != e.colIndex) {
				r = 1
			} else {
				r = Math.pow(this.widthRatio, e.span - 1
						- e.colIndex)
			}
			var w = Math.floor(rest * r);
			var leftStyle = 5, rightStyle = 5;
			var mw = w - leftStyle - rightStyle;
			var zindex = this.baseIndex + e.colIndex;
			var coverStyle = "top:" + y + "px;left:" + x
					+ "px;width:" + w + "px;z-index:" + zindex
					+ ";";
			var contentStyle = "height:" + ch + "px;";
			if (Ext.isIE) {
				contentStyle += "width:" + w + "px;"
			}
			var titleStyle = "width:" + mw + "px;";
			var bottomStyle = "width:" + mw + "px;";
			var subject = e.subject || "";
			if ("" === subject.trim()) {
				//subject = Ext.ux.calendar.Mask.EventHandler.untitled
				subject = this.lang.EventHandler.untitled;
			}
			var color = e.color;
			if (this.calendarSet) {
				color = this.calendarSet[e.calendarId].color
			}
			var html = this.eventTpl.apply( {
				id :e.eventId,
				calendarId :e.calendarId,
				color :color,
				"cover-style" :coverStyle,
				"content-style" :contentStyle,
				"title-style" :titleStyle,
				"bottom-style" :bottomStyle,
				"left-style" :"width:" + leftStyle + "px;",
				"right-style" :"width:" + rightStyle + "px;",
				title :this.generateTitle(e),
				time :this.generateInfo(e),
				subject :subject,
				content :e.content || "",
				day :e.day,
				eday :e.eday,
				repeatType :e.repeatType,
				alertFlag :e.alertFlag,
				locked :e.locked
			});
			var coverel = Ext.DomHelper.insertHtml("beforeEnd",
					pn.dom, html);
			coverEl = Ext.get(coverel);
			if (coverEl) {
				var contentEl = this.getContentEl(coverEl);
				var titleEl = this.getTitleEl(coverEl);
				var bottomEl = this.getBottomEl(coverEl);
				var ltEl = this.getLeftTopEl(coverEl);
				var rtEl = this.getRightTopEl(coverEl);
				e.eId = coverEl.id;
				coverEl.bindEvent = Ext.apply( {}, e);
				coverEl.cview = cview;
				coverEl.col = col;
				coverEl.cEl = pn;
				coverEl.titleEl = titleEl;
				coverEl.contentEl = contentEl;
				coverEl.bottomEl = bottomEl;
				coverEl.ltEl = ltEl;
				coverEl.rtEl = rtEl;
				coverEl.leftStyle = leftStyle;
				coverEl.rightStyle = rightStyle;
				contentEl.coverEl = coverEl;
				contentEl.bindEvent = Ext.apply( {}, e);
				contentEl.cview = cview;
				contentEl.cEl = pn;
				contentEl.col = col
			}
		}
		cview.resizePort();
		this.floating = false;
		return coverEl
	},
	getIndexFromDay : function(cview, day) {
		return cview.getIndexFromDay(day)
	},
	createEvent : function(event, cview, col) {
		this.ds.createEvent(event, function(backObj) {
			event.eventId = backObj.id;
			this.createEventToLayout(event, cview, col);
			this.fireEvent("changeEventCache", this)
		}, this)
	},
	createEventToLayout : function(event, cview, col) {
		if (false === Ext.type(col)) {
			col = this.getIndexFromDay(cview, event.day)
		}
		var glayout = this.calendarLayout;
		var all = (0 == event.startRow && this.rowCount == event.endRow)
				|| (event.day != event.eday);
		if (all) {
			glayout.updateWholeList( [ event ], "add");
			cview.checkLayout(Ext.isIE)
		} else {
			var layout = glayout.getLayout(event.day, cview);
			if (layout) {
				var rs = layout.updateLayout(event, "add");
				if (cview instanceof Ext.ux.calendar.DayView) {
					this.renderEvent(cview, rs.elist, col)
				} else {
					cview.checkLayout()
				}
			}
		}
	},
	createRepeatEvent : function(event, cview, col) {
		this.ds.createUpdateRepeatEvent(event, null, function(
				backObj) {
			event.eventId = backObj.id;
			var gLayout = this.calendarLayout;
			gLayout.updateRepeatEventList(cview, [ event ],
					"add");
			this.fireEvent("changeEventCache", this)
		}, this)
	},
	updateEvent : function(event, cview, ocol, oevent, noLayout) {
		this.ds.updateEvent(event,function(backObj) {
			if ("function" === Ext.type(noLayout)) {
				noLayout(event);
			}
			var all = ((0 == event.startRow && this.rowCount == event.endRow) || (event.day != event.eday)), oall = false;
			var col;
			var glayout = this.calendarLayout;
			if (oevent) {
				if (false === Ext.type(ocol)) {
					ocol = this.getIndexFromDay(cview, oevent.day);
				}
				oall = ((0 == oevent.startRow && this.rowCount == oevent.endRow) || (oevent.day != oevent.eday));
				var olayout = this.calendarLayout.getLayout(oevent.day, cview);
				if (oevent.day != event.day) {
					col = this.getIndexFromDay(cview, event.day);
					var rs = olayout.updateLayout(oevent, "delete");
					if (rs.elist && cview instanceof Ext.ux.calendar.DayView) {
						var arr = Ext.DomQueryselect(
							"div[name=x-event-"
									+ oevent.day
									+ "-"
									+ oevent.eday
									+ "-"
									+ oevent.eventId
									+ "]",
							cview.body.dom);
						for ( var i = 0, len = arr.length; i < len; i++) {
							this.freeEventEl(Ext.get(arr[i]));
						}
						this.renderEvent(cview, rs.elist, ocol);
					}
				} else {
					col = ocol;
					if (oall != all) {
						var rs = olayout.updateLayout(oevent, "delete");
						if (rs.elist && cview instanceof Ext.ux.calendar.DayView) {
							var arr = Ext.DomQuery.select(
								"div[name=x-event-"
										+ oevent.day
										+ "-"
										+ oevent.eday
										+ "-"
										+ oevent.eventId
										+ "]",
								cview.body.dom);
							for ( var i = 0, len = arr.length; i < len; i++) {
								this.freeEventEl(Ext.get(arr[i]));
							}
							this.renderEvent(cview, rs.elist, ocol);
						}
					}
				}
			} else {
				if (false == Ext.type(ocol)) {
					col = this.getIndexFromDay(cview, event.day);
				} else {
					col = ocol;
				}
			}
			if (all) {
				glayout.updateWholeList([ event ], "update");
			} else {
				var layout = glayout.getLayout(event.day, cview);
				if (layout) {
					var rs = layout.updateLayout(event, "update");
					if (false != Ext.type(col) && rs.elist && cview instanceof Ext.ux.calendar.DayView) {
						this.renderEvent(cview, rs.elist, col);
					}
				}
			}
			if ((oall || all) && cview instanceof Ext.ux.calendar.DayView) {
				cview.checkLayout(Ext.isIE)
			}
			if (cview instanceof Ext.ux.calendar.MonthView) {
				cview.checkLayout(true)
			}
			this.fireEvent("changeEventCache", this)
		}, this);
	},
	deleteEvent : function(event, cview, col, keep) {
		this.ds.deleteEvent(event, function(backObj) {
			this.deleteEventFromLayout(event, cview, col);
			if (Ext.isIE
					&& (event.day != event.eday || (0 == event.startRow)
							&& (this.rowCount == event.endRow))) {
				cview.checkLayout(true)
			}
			this.fireEvent("changeEventCache", this);
		}, this);
	},
	deleteEventFromLayout : function(event, cview, col) {
		var glayout = this.calendarLayout;
		var all = (0 == event.startRow && this.rowCount == event.endRow)
				|| (event.day != event.eday);
		if (all) {
			glayout.updateWholeList( [ event ], "delete");
			cview.checkLayout()
		} else {
			var layout = glayout.getLayout(event.day, cview);
			if (layout) {
				var rs = layout.updateLayout(event, "delete");
				if (false != Ext.type(col) && cview instanceof Ext.ux.calendar.DayView) {
					this.renderEvent(cview, rs.elist, col)
				}
			}
		}
	},
	deleteRepeatEvent : function(event, cview, makeException) {
		if (makeException) {
			var eps = event.repeatType.exceptions || {};
			eps[event.day] = true;
			event.repeatType.exceptions = eps
		}
		this.ds.deleteRepeatEvent(event, makeException, function(backObj) {
			var gLayout = this.calendarLayout;
			if (makeException) {
				gLayout.updateRepeatEventList(cview,
						[ event ], "update")
			} else {
				gLayout.updateRepeatEventList(cview,
						[ event ], "delete")
			}
			this.fireEvent("changeEventCache", this)
		}, this);
	},
	showEditor : function(eEl, cview, action, noLayout) {
		this.editor.popup({
			bindEl :eEl,
			cview :cview,
			action :action,
			noLayout :noLayout
		})
	},
	setPinOn : function(coverEl) {
		var pinEl = coverEl.child("img");
		pinEl.removeClass("x-calendar-event-pin-off");
		pinEl.addClass("x-calendar-event-pin-on")
	},
	setPinOff : function(coverEl) {
		var pinEl = coverEl.child("img");
		pinEl.removeClass("x-calendar-event-pin-on");
		pinEl.addClass("x-calendar-event-pin-off")
	},
	onPinElClickFn : function(e) {
		e.stopEvent();
		var target = e.getTarget();
		var tgEl = Ext.get(target);
		if (tgEl.hasClass("x-calendar-event-pin-off")) {
			tgEl.removeClass("x-calendar-event-pin-off");
			tgEl.addClass("x-calendar-event-pin-on");
			this.editDisabled = true
		} else {
			tgEl.removeClass("x-calendar-event-pin-on");
			tgEl.addClass("x-calendar-event-pin-off");
			this.editDisabled = false
		}
	},
	setEditingStatus : function(coverEl, forceFlag, pinFlag) {
		var coverFlag = null;
		if (coverEl.hasClass("x-event-cover")) {
			coverFlag = "event"
		}
		var editCover = Ext.get(this.editingId);
		var bindEvent = coverEl.bindEvent;
		var titleEl = coverEl.titleEl;
		var contentEl = coverEl.contentEl;
		var bottomEl = coverEl.bottomEl;
		var flag = false;
		if (true != this.floating) {
			if (true !== this.editDisabled) {
				flag = true
			} else {
				if (true === forceFlag) {
					flag = true;
					if (this.editingId != coverEl.dom.id) {
						this.editDisabled = false
					}
					if (editCover) {
						this.setPinOff(editCover)
					}
				}
			}
		}
		if (flag) {
			if (editCover) {
				this.removeEditingStatus(editCover)
			}
			this.editingId = coverEl.dom.id;
			coverEl.setStyle("z-index", 3009);
			if (coverFlag) {
				coverEl.addClass("x-event-editing")
			}
			var color = this.calendarSet[bindEvent.calendarId].color;
			if (coverEl.hasClass("x-event-cover")) {
				if (titleEl) {
					titleEl.addClass("x-calendar-" + color
							+ "-event-top");
					titleEl.removeClass("x-calendar-" + color
							+ "-event-top-clear")
				}
				var ltEl = coverEl.ltEl;
				if (ltEl) {
					ltEl.addClass("x-calendar-" + color
							+ "-event-ltcorner");
					ltEl.removeClass("x-calendar-" + color
							+ "-event-ltcorner-clear")
				}
				var rtEl = coverEl.rtEl;
				if (rtEl) {
					rtEl.addClass("x-calendar-" + color
							+ "-event-rtcorner");
					rtEl.removeClass("x-calendar-" + color
							+ "-event-rtcorner-clear")
				}
			}
		}
		var cw = coverEl.getWidth();
		var w = cw;
		if (coverEl.leftStyle && coverEl.rightStyle) {
			w = cw - coverEl.leftStyle - coverEl.rightStyle
		}
		if (titleEl && coverFlag) {
			titleEl.setWidth(w)
		}
		if (Ext.isIE && contentEl && coverFlag) {
			contentEl.setWidth(cw)
		}
		if (bottomEl) {
			bottomEl.setWidth(w)
		}
		if (false !== Ext.type(pinFlag)) {
			this.editDisabled = pinFlag
		}
		if (this.editDisabled) {
			this.setPinOn(coverEl)
		}
	},
	removeEditingStatus : function(coverEl) {
		var bindEvent = coverEl.bindEvent;
		var index = this.baseIndex;
		if (bindEvent.colIndex) {
			index += bindEvent.colIndex
		}
		coverEl.setStyle("z-index", index.toString());
		coverEl.removeClass("x-event-editing");
		var color = this.calendarSet[bindEvent.calendarId].color;
		var titleEl = coverEl.titleEl;
		if (titleEl) {
			titleEl.removeClass("x-calendar-" + color
					+ "-event-top");
			if (coverEl.cview instanceof Ext.ux.calendar.DayView
					&& !(0 == bindEvent.startRow && this.rowCount == bindEvent.endRow)) {
				titleEl.addClass("x-calendar-" + color
						+ "-event-top-clear")
			}
		}
		var ltEl = coverEl.ltEl;
		if (ltEl) {
			ltEl.removeClass("x-calendar-" + color
					+ "-event-ltcorner");
			ltEl.addClass("x-calendar-" + color
					+ "-event-ltcorner-clear")
		}
		var rtEl = coverEl.rtEl;
		if (rtEl) {
			rtEl.removeClass("x-calendar-" + color
					+ "-event-rtcorner");
			rtEl.addClass("x-calendar-" + color
					+ "-event-rtcorner-clear")
		}
	},
	generateLegend : function(cview, e) {
		var subject = e.subject || "";
		if ("" === subject.trim()) {
			// subject = Ext.ux.calendar.Mask.EventHandler.untitled
			subject = this.lang.EventHandler.untitled;
		}
		var html;
		var color = e.color;
		if (this.calendarSet) {
			color = this.calendarSet[e.calendarId].color
		}
		if ((0 == e.startRow && this.rowCount == e.endRow)
				|| (e.day != e.eday)) {
			html = this.wholeTpl.apply( {
				id :e.eventId,
				lflag :e.lflag || false,
				rflag :e.rflag || false,
				calendarId :e.calendarId,
				color :color,
				title :this.generateTitle(e),
				time :this.generateInfo(e),
				subject :subject,
				content :e.content || "",
				day :e.day,
				eday :e.eday,
				repeatType :e.repeatType,
				alertFlag :e.alertFlag,
				locked :e.locked
			})
		} else {
			html = this.legendTpl.apply( {
				id :e.eventId,
				calendarId :e.calendarId,
				color :color,
				title :this.generateTitle(e),
				time :this.generateInfo(e),
				subject :subject,
				content :e.content || "",
				day :e.day,
				eday :e.eday,
				repeatType :e.repeatType,
				alertFlag :e.alertFlag,
				locked :e.locked
			})
		}
		return html
	},
	deleteLegend : function(event, cview, pn) {
		var pos = cview.getCellIndex(pn.dom.id);
		var index = pos.x * cview.dayNum + pos.y;
		var layout = this.calendarLayout.getLayout(
				cview.daySet[index], cview);
		var rs = layout.updateLayout(event, "delete")
	},
	createCalendar : function(pnode, cview, pos, calendar) {
		var legendStyle = "height:9px;";
		var html = this.calendarDropTpl.apply( {
			"legend-style" :legendStyle,
			title :calendar.name,
			calendarId :calendar.id,
			color :calendar.color
		});
		var nel, calendarEl;
		if ("beforeBegin" == pos) {
			nel = Ext.DomHelper.insertHtml("beforeBegin",
					pnode.dom.firstChild, html)
		} else {
			nel = Ext.DomHelper.insertHtml("beforeEnd",
					pnode.dom, html)
		}
		calendarEl = Ext.get(nel);
		if (calendarEl) {
			calendarEl.addClassOnOver("x-calendar-over");
			calendarEl.calendar = calendar;
			this.initCalendar(calendarEl)
		}
		return calendarEl
	},
	initCalendar : function(calendarEl) {
		calendarEl.on("click", this.onCalendarElClickFn, {
			cEl :calendarEl,
			sp :this
		});
		calendarEl.on("dblclick", this.onCalendarElDblClickFn,
				{
					cEl :calendarEl,
					sp :this
				})
	},
	onCalendarElDblClickFn : function(e) {
		var sp = this.sp;
		var cEl = this.cEl;
		var calendar = cEl.calendar;
		sp.ceditor.popup( {
			data :calendar,
			cEl :cEl
		})
	},
	onCalendarElClickFn : function(e) {
		var sp = this.sp;
		var cEl = this.cEl;
		var calendar = cEl.calendar;
		var tgEl = Ext.get(e.getTarget());
		if (tgEl.hasClass("x-legend-tool")) {
			sp.menu.palette.calendar = calendar;
			sp.showMenu(cEl, tgEl)
		} else {
			calendar.hide = !calendar.hide;
			sp.ds.createUpdateCalendar(calendar, function(
					backObj) {
				if (calendar.hide) {
					sp.hideCalendar(calendar, true);
					sp.hideCalendarColor(cEl, calendar.color)
				} else {
					sp.hideCalendar(calendar, false);
					sp.showCalendarColor(cEl, calendar.color)
				}
			}, this)
		}
	},
	onCalendarColorChangedFn : function(cp, color) {
		if (true !== cp.still) {
			color = Ext.ux.calendar.Mask.getIndexByColor(color);
			if (color) {
				this.changeColor(cp.calendar, color)
			}
			this.menu.hide()
		}
	},
	changeEventColor : function(eEl, oldColor, color) {
		var ltEl = eEl.child(".x-calendar-" + oldColor
				+ "-event-ltcorner-clear");
		if (ltEl) {
			ltEl.removeClass("x-calendar-" + oldColor
					+ "-event-ltcorner-clear");
			ltEl.addClass("x-calendar-" + color
					+ "-event-ltcorner-clear")
		}
		ltEl = eEl.child(".x-calendar-" + oldColor
				+ "-event-ltcorner");
		if (ltEl) {
			ltEl.removeClass("x-calendar-" + oldColor
					+ "-event-ltcorner");
			ltEl.addClass("x-calendar-" + color
					+ "-event-ltcorner")
		}
		var rtEl = eEl.child(".x-calendar-" + oldColor
				+ "-event-rtcorner-clear");
		if (rtEl) {
			rtEl.removeClass("x-calendar-" + oldColor
					+ "-event-rtcorner-clear");
			rtEl.addClass("x-calendar-" + color
					+ "-event-rtcorner-clear")
		}
		rtEl = eEl.child(".x-calendar-" + oldColor
				+ "-event-rtcorner");
		if (rtEl) {
			rtEl.removeClass("x-calendar-" + oldColor
					+ "-event-rtcorner");
			rtEl.addClass("x-calendar-" + color
					+ "-event-rtcorner")
		}
		var tEl = eEl.child(".x-calendar-" + oldColor
				+ "-event-top-clear");
		if (tEl) {
			tEl.removeClass("x-calendar-" + oldColor
					+ "-event-top-clear");
			tEl.addClass("x-calendar-" + color
					+ "-event-top-clear")
		}
		tEl = eEl.child(".x-calendar-" + oldColor
				+ "-event-top");
		if (tEl) {
			tEl.removeClass("x-calendar-" + oldColor
					+ "-event-top");
			tEl.addClass("x-calendar-" + color + "-event-top")
		}
		var lrEl = eEl.child(".x-calendar-" + oldColor
				+ "-event-lr");
		if (lrEl) {
			lrEl.removeClass("x-calendar-" + oldColor
					+ "-event-lr");
			lrEl.addClass("x-calendar-" + color + "-event-lr")
		}
		var lbEl = eEl.child(".x-calendar-" + oldColor
				+ "-event-lbcorner");
		if (lbEl) {
			lbEl.removeClass("x-calendar-" + oldColor
					+ "-event-lbcorner");
			lbEl.addClass("x-calendar-" + color
					+ "-event-lbcorner")
		}
		var rbEl = eEl.child(".x-calendar-" + oldColor
				+ "-event-rbcorner");
		if (rbEl) {
			rbEl.removeClass("x-calendar-" + oldColor
					+ "-event-rbcorner");
			rbEl.addClass("x-calendar-" + color
					+ "-event-rbcorner")
		}
		var bEl = eEl.child(".x-calendar-" + oldColor
				+ "-event-bottom");
		if (bEl) {
			bEl.removeClass("x-calendar-" + oldColor
					+ "-event-bottom");
			bEl.addClass("x-calendar-" + color
					+ "-event-bottom")
		}
	},
	changeWholeColor : function(wEl, oldColor, color) {
		var titleEl = wEl.child(".x-whole-title-" + oldColor);
		if (titleEl) {
			titleEl.removeClass("x-whole-title-" + oldColor);
			titleEl.addClass("x-whole-title-" + color)
		}
		var leftEl = wEl.child(".x-calendar-" + oldColor
				+ "-whole-left");
		if (leftEl) {
			leftEl.removeClass("x-calendar-" + oldColor
					+ "-whole-left");
			leftEl.addClass("x-calendar-" + color
					+ "-whole-left")
		}
		var rightEl = wEl.child(".x-calendar-" + oldColor
				+ "-whole-right");
		if (rightEl) {
			rightEl.removeClass("x-calendar-" + oldColor
					+ "-whole-right");
			rightEl.addClass("x-calendar-" + color
					+ "-whole-right")
		}
	},
	changeCalendarColor : function(cEl, oldColor, color) {
		var hide;
		var titleEl = cEl.child(".x-whole-title-" + oldColor);
		if (titleEl) {
			hide = false;
			titleEl.removeClass("x-whole-title-" + oldColor);
			titleEl.addClass("x-whole-title-" + color)
		} else {
			hide = true;
			var bEl = cEl.child(".x-calendar-title-b");
			if (bEl) {
				bEl.setStyle("color", "#"
						+ Ext.ux.calendar.Mask
								.getColorByIndex(color))
			}
		}
		if (false == hide) {
			var leftEl = cEl.child(".x-calendar-" + oldColor
					+ "-whole-left");
			if (leftEl) {
				leftEl.removeClass("x-calendar-" + oldColor
						+ "-whole-left");
				leftEl.addClass("x-calendar-" + color
						+ "-whole-left")
			}
			var rightEl = cEl.child(".x-calendar-" + oldColor
					+ "-whole-right");
			if (rightEl) {
				rightEl.removeClass("x-calendar-" + oldColor
						+ "-whole-right");
				rightEl.addClass("x-calendar-" + color
						+ "-whole-right")
			}
		}
	},
	hideCalendarColor : function(cEl, oldColor) {
		var leftEl = cEl.child(".x-calendar-" + oldColor
				+ "-whole-left");
		if (leftEl) {
			leftEl.removeClass("x-calendar-" + oldColor
					+ "-whole-left")
		}
		var rightEl = cEl.child(".x-calendar-" + oldColor
				+ "-whole-right");
		if (rightEl) {
			rightEl.removeClass("x-calendar-" + oldColor
					+ "-whole-right")
		}
		var titleEl = cEl.child(".x-whole-title-" + oldColor);
		if (titleEl) {
			titleEl.removeClass("x-whole-title-" + oldColor)
		}
		var bEl = cEl.child(".x-calendar-title-b");
		if (bEl) {
			var color = Ext.ux.calendar.Mask
					.getColorByIndex(oldColor);
			bEl.setStyle("color", "#" + color)
		}
	},
	showCalendarColor : function(cEl, oldColor) {
		var leftEl = cEl.child(".x-whole-left");
		if (leftEl) {
			leftEl.addClass("x-calendar-" + oldColor
					+ "-whole-left")
		}
		var rightEl = cEl.child(".x-whole-right");
		if (rightEl) {
			rightEl.addClass("x-calendar-" + oldColor
					+ "-whole-right")
		}
		var titleEl = cEl.child(".x-calendar-title");
		if (titleEl) {
			titleEl.addClass("x-whole-title-" + oldColor)
		}
		var bEl = cEl.child(".x-calendar-title-b");
		if (bEl) {
			bEl.setStyle("color", "white")
		}
	},
	changeLegendColor : function(lEl, oldColor, color) {
		alert("changeLegendColor");
		var bEl = lEl.child(".x-legend-title-" + oldColor);
		if (bEl) {
			bEl.removeClass("x-legend-title-" + oldColor);
			bEl.addClass("x-legend-title-" + color)
		}
	},
	changeColor : function(calendar, index) {
		var oldColor = calendar.color;
		calendar.color = index;
		this.ds.createUpdateCalendar(calendar, function(backObj) {
			if (backObj.success || "true" == backObj.success) {
				this.calendarSet[calendar.id].color = index;
				var calendarEl = Ext
						.get(this.id
								+ "-x-calendar-"
								+ calendar.id);
				if (calendarEl) {
					this.changeCalendarColor(
							calendarEl,
							oldColor,
							calendar.color)
				}
				var mainBody = this.mainPanel.body;
				var events = Ext.DomQuery.select("."
										+ this.id
										+ "-x-calendar-"
										+ calendar.id
										+ "-event", mainBody.dom);
				if (events) {
					for ( var i = 0, len = events.length; i < len; i++) {
						var eEl = Ext.get(events[i]);
						this.changeEventColor(eEl, oldColor, calendar.color);
					}
				}
				var wholes = Ext.DomQuery.select("."
										+ this.id
										+ "-x-calendar-"
										+ calendar.id
										+ "-whole", mainBody.dom);
				if (wholes) {
					for ( var i = 0, len = wholes.length; i < len; i++) {
						var wEl = Ext.get(wholes[i]);
						this.changeWholeColor(wEl, oldColor, calendar.color);
					}
				}
				var legends = Ext.DomQuery.select("."
										+ this.id
										+ "-x-calendar-"
										+ calendar.id
										+ "-legend", mainBody.dom);
				if (legends) {
					for ( var i = 0, len = legends.length; i < len; i++) {
						var lEl = Ext.get(legends[i]);
						this.changeLegendColor(lEl, oldColor, calendar.color)
					}
				}
				var cview = this.mainPanel.calendarContainer.getLayout().activeItem;
				if (cview instanceof Ext.ux.calendar.ResultView) {
					cview.list.getView().refresh();
				}
				this.fireEvent(
						"changeCalendarColor",
						this, calendar,
						oldColor,
						calendar.color)
			}
		}, this)
	},
	freeEventEl : function(El) {
		El.remove()
	},
	pushDayCache : function(startDate, endDate) {
		var day = startDate.format("Y-m-d");
		var date = startDate;
		var endDay = endDate.format("Y-m-d");
		while (day <= endDay) {
			this.dayCache[day] = date;
			date = date.add(Date.DAY, 1);
			day = date.format("Y-m-d")
		}
	},
	isInDayCache : function(startDate, endDate) {
		var flag = true;
		var day = startDate.format("Y-m-d");
		var date = startDate;
		var endDay = endDate.format("Y-m-d");
		while (day <= endDay) {
			if (!this.dayCache[day]) {
				flag = false;
				break
			}
			date = date.add(Date.DAY, 1);
			day = date.format("Y-m-d")
		}
		return flag
	},
	bindEvent2Detail : function(cview, events, detailCt) {
		var html = "";
		for ( var i = 0, len = events.length; i < len; i++) {
			var e = events[i];
			html += this.generateLegend(this, e)
		}
		detailCt.dom.innerHTML = html;
		for ( var i = 0, len = detailCt.dom.childNodes.length; i < len; i++) {
			var e = Ext.apply( {}, events[i]);
			var el = detailCt.dom.childNodes[i];
			var El = Ext.get(el);
			El.bindEvent = e;
			El.cview = cview
		}
	},
	updateRepeatEvent : function(event, cview, oevent) {
		if ("string" == Ext.type(event.repeatType)) {
			var eps = oevent.repeatType.exceptions || {};
			eps[oevent.day] = true;
			oevent.repeatType.exceptions = eps
		}
		this.ds.createUpdateRepeatEvent(event, oevent, function(backObj) {
			var gLayout = this.calendarLayout;
			if (backObj.id) {
				event.eventId = backObj.id
			}
			if ("string" == Ext.type(oevent.repeatType)) {
				this.deleteEventFromLayout(oevent, cview);
				gLayout.updateRepeatEventList(cview, [ event ], "update")
			} else {
				if ("string" == Ext
						.type(event.repeatType)) {
					this.createEventToLayout(
							event, cview);
					if ("exception" == event.repeatType) {
						gLayout.updateRepeatEventList(cview, [ oevent ], "update");
					} else {
						gLayout.updateRepeatEventList(cview, [ oevent ], "delete");
					}
				} else {
					gLayout.updateRepeatEventList(cview, [ event ], "update");
				}
			}
			this.fireEvent("changeEventCache", this);
		}, this);
	},
	loadRepeatEvent : function(fn, scope) {
		this.ds.loadRepeatEvent( function(eventSet) {
			this.calendarLayout.repeatSet = eventSet;
			fn.call(scope)
		}, this)
	},
	getStartDateInWeek : function(date, cview) {
		var sDate;
		if (1 == this.startDay) {
			var n = date.format("N");
			sDate = date.add(Date.DAY, 1 - n)
		} else {
			var w = -date.format("w");
			if ((5 == cview.dayNum && cview instanceof Ext.ux.calendar.DayView)
					|| (5 == cview.colNum && cview instanceof Ext.ux.calendar.MonthView)) {
				w++
			}
			sDate = date.add(Date.DAY, w)
		}
		return sDate
	},
	loadCalendar : function(ownedCt, sharedCt) {
		this.ds.loadCalendar(function(backObj) {
			var owned = backObj.owned;
			var shared = backObj.shared;
			this.calendarSet = {};
			if (0 < owned.length
					|| 0 < shared.length) {
				var calendar;
				for ( var i = 0, len = owned.length; i < len; i++) {
					calendar = owned[i];
					this.calendarSet[calendar.id] = calendar
				}
				for ( var i = 0, len = shared.length; i < len; i++) {
					calendar = shared[i];
					this.calendarSet[calendar.id] = calendar
				}
				this.loadRepeatEvent(function() {
					this.fireEvent("calendarloaded");
				}, this);
				if (ownedCt) {
					this.renderOwnedCalendar(ownedCt);
				}
				if (sharedCt) {
					this.renderSharedCalendar(sharedCt);
				}
			}
		}, this);
	},
	renderOwnedCalendar : function(container) {
		var cs = this.calendarSet;
		container.dom.innerHTML = "";
		for ( var q in cs) {
			var calendar = cs[q];
			if (!calendar.isShared) {
				var cEl = this.createCalendar(container, null,
						null, calendar);
				if (calendar.hide) {
					this.hideCalendarColor(cEl, calendar.color)
				}
			}
		}
	},
	renderSharedCalendar : function(container) {
		var cs = this.calendarSet;
		container.dom.innerHTML = "";
		for ( var q in cs) {
			var calendar = cs[q];
			if (calendar.isShared) {
				var cEl = this.createCalendar(container, null,
						null, calendar);
				if (calendar.hide) {
					this.hideCalendarColor(cEl, calendar.color)
				}
			}
		}
	},
	reloadCalendar : function(ownedCt, sharedCt, cflag) {
		this.dayCache = {};
		this.calendarLayout.layoutSet = {};
		this.calendarLayout.wholeList = [];
		if (cflag) {
			this.loadCalendar(ownedCt, sharedCt)
		} else {
			this.loadRepeatEvent( function() {
				this.fireEvent("calendarloaded");
			}, this)
		}
	}
});
Ext.ns("Ext.ux.calendar");
Ext.ux.calendar.Block = function(config) {
	var obj = {};
	obj.id = 0;
	obj.colNum = 0;
	obj.startRow = 100;
	obj.endRow = -1;
	obj.eventList = new Array();
	obj.addEvent = function(event) {
		if (event.startRow < obj.startRow) {
			obj.startRow = event.startRow
		}
		if (event.endRow > obj.endRow) {
			obj.endRow = event.endRow
		}
		obj.eventList[obj.eventList.length] = event
	};
	Ext.apply(obj, config);
	return obj
};
Ext.ns("Ext.ux.calendar");
Ext.ux.calendar.BlockMap = function(event, block) {
	var obj = {};
	obj.event = event;
	obj.block = block;
	return obj
};
Ext.ns("Ext.ux.calendar");
Ext.ux.calendar.CalendarLayout = function(config) {
	Ext.apply(this, config);
	this.layoutSet = {};
	this.wholeList = [];
	this.repeatSet = {};
	Ext.ux.calendar.CalendarLayout.superclass.constructor.call(this)
};
Ext.extend(Ext.ux.calendar.CalendarLayout,Ext.util.Observable,{
	getWholeList : function(cview, day, all, single) {
		var eh = this.ehandler;
		var cs = eh.calendarSet;
		var wlist = [];
		var arr = [];
		var sday, eday;
		if (single) {
			sday = day;
			eday = day
		} else {
			if (1 == cview.dayNum) {
				sday = day;
				eday = day
			} else {
				var colNum = cview.colNum || cview.dayNum;
				var cd = Date.parseDate(day, "Y-m-d");
				var sd = eh.getStartDateInWeek(cd, cview);
				sday = sd.format("Y-m-d");
				eday = sd.add(Date.DAY, colNum - 1).format(
						"Y-m-d")
			}
		}
		for ( var i = 0, len = this.wholeList.length; i < len; i++) {
			var e = this.wholeList[i];
			if (cs[e.calendarId]) {
				if (!cs[e.calendarId].hide || all) {
					if (e.day == day
							|| (sday == day && e.day < day && e.eday >= day)) {
						if (e.day < sday) {
							e.lflag = true
						} else {
							delete (e.lflag)
						}
						if (e.eday > eday) {
							e.rflag = true
						} else {
							delete (e.rflag)
						}
						wlist.push(e)
					}
				}
				arr.push(e)
			}
		}
		this.wholeList = arr;
		wlist = this.combine2List(this.getRepeatEvent(cview,
				day, true, all, single), wlist);
		return wlist
	},
	updateWholeList : function(arr, action) {
		if (arr) {
			if ("add" == action) {
				this.wholeList = this.combine2List(
						this.wholeList, arr)
			} else {
				if ("update" == action) {
					for ( var i = 0, len = arr.length; i < len; i++) {
						this.deleteFromList(this.wholeList,
								arr[i])
					}
					this.wholeList = this.combine2List(
							this.wholeList, arr)
				} else {
					if ("delete" == action) {
						for ( var i = 0, len = arr.length; i < len; i++) {
							this.deleteFromList(this.wholeList,
									arr[i])
						}
					}
				}
			}
		}
	},
	deleteFromList : function(arr, e) {
		for ( var i = 0, len = arr.length; i < len; i++) {
			var w = arr[i];
			if (w.eventId == e.eventId) {
				arr.splice(i, 1);
				break
			}
		}
	},
	deleteDayFromWholeList : function(day, eday, prevent) {
		var cs = this.ehandler.calendarSet;
		eday = eday || day;
		var i, j, len = this.wholeList.length, wlist = [];
		for (i = 0; i < len; i++) {
			var w = this.wholeList[i];
			if (w.day > day) {
				return wlist
			} else {
				if (!cs[w.calendarId].hide && w.day >= day
						&& w.eday <= eday) {
					break
				}
			}
		}
		for (j = i; j < len; j++) {
			var w = this.wholeList[j];
			if (!cs[w.calendarId].hide && w.day >= day
					&& w.eday <= eday) {
				wlist.push(Ext.apply( {}, w))
			} else {
				break
			}
		}
		if (!prevent) {
			this.wholeList.splice(i, j - i)
		}
		return wlist
	},
	changeDayInWholeList : function(oday, tday, keep) {
		var cs = this.ehandler.calendarSet;
		var i, j, len = this.wholeList.length;
		for (i = 0; i < len; i++) {
			var w = this.wholeList[i];
			if (w.day > oday) {
				i = len;
				break
			} else {
				if (!cs[w.calendarId].hide && w.day >= oday
						&& w.eday <= oday) {
					break
				}
			}
		}
		var arr = [];
		for (j = i; j < len; j++) {
			var w = this.wholeList[j];
			if (!cs[w.calendarId].hide && w.day >= oday
					&& w.eday <= oday) {
				var o = Ext.apply( {}, w);
				o.day = tday;
				o.eday = tday;
				arr.push(o)
			} else {
				break
			}
		}
		if (!keep) {
			this.wholeList.splice(i, j - i)
		}
		this.wholeList = this.combine2List(this.wholeList, arr)
	},
	getLayout : function(day, cview, eventList, newFlag,
			refresh) {
		if (day instanceof Date) {
			day = day.format("Y-m-d")
		}
		var fn = function() {
			var eh = this.ehandler;
			var layout = new Ext.ux.calendar.LayoutGrid( {
				owner :this,
				ehandler :eh,
				cview :cview,
				day :day,
				hideCalendar :true
			});
			layout.viewChanged = true;
			layout.generateLayout(eventList || []);
			this.layoutSet[day] = layout
		};
		if (refresh) {
			fn.call(this)
		} else {
			if (!this.layoutSet[day]) {
				if (true == newFlag) {
					fn.call(this)
				} else {
					return null
				}
			} else {
				if (this.layoutSet[day].cview !== cview) {
					this.layoutSet[day].viewChanged = true
				} else {
					this.layoutSet[day].viewChanged = false
				}
				this.layoutSet[day].cview = cview
			}
		}
		return this.layoutSet[day]
	},
	resetSingleLayout : function(layout, config, reLayout) {
		layout.hideCalendar = config.hideCalendar;
		layout.deleteCalendar = config.deleteCalendar;
		layout.updateRepeat = config.updateRepeat;
		delete (layout.layouted);
		var v = layout.visited;
		if (reLayout) {
			layout.reLayout()
		}
		if (layout.hideCalendar) {
			for ( var p in v) {
				v[p] = "hideCalendar"
			}
			layout.visited = v
		} else {
			if (layout.deleteCalendar) {
				for ( var p in v) {
					v[p] = "deleteCalendar"
				}
				layout.visited = v
			} else {
				if (layout.updateRepeat) {
					for ( var p in v) {
						v[p] = "updateRepeat"
					}
					layout.visited = v
				} else {
					layout.visited = {}
				}
			}
		}
	},
	resetLayout : function(config, reLayout) {
		for ( var p in this.layoutSet) {
			var layout = this.layoutSet[p];
			this.resetSingleLayout(layout, config, reLayout)
		}
	},
	checkRepeat : function(c, list, i) {
		for ( var len = list.length; i < len; i++) {
			var e = list[i];
			if (!(e.day == c.day && e.eday == c.eday
					&& e.startRow == c.startRow && e.endRow == c.endRow)) {
				return false
			}
			if (e.eventId == c.eventId) {
				return true
			}
		}
		return false
	},
	combine2List : function(alist, blist) {
		var nlist = [];
		var alen = 0, blen = 0;
		if (alist) {
			alen = alist.length
		}
		if (blist) {
			blen = blist.length
		}
		var i, j;
		for (i = 0, j = 0; i < alen && j < blen;) {
			var a = alist[i];
			var b = blist[j];
			var ast = a.day + "-" + a.startRow, aet = a.eday
					+ "-" + a.endRow;
			var bst = b.day + "-" + b.startRow, bet = b.eday
					+ "-" + b.endRow;
			if (ast < bst || (ast == bst && aet > bet)) {
				nlist.push(a);
				i++
			} else {
				if (!this.checkRepeat(b, alist, i)) {
					nlist.push(b)
				}
				j++
			}
		}
		if (i == alen) {
			for (; j < blen; j++) {
				var b = blist[j];
				nlist.push(b)
			}
		}
		if (j == blen) {
			for (; i < alen; i++) {
				var a = alist[i];
				nlist.push(a)
			}
		}
		return nlist
	},
	updateRepeatEventList : function(cview, arr, action) {
		if ("add" == action || "update" == action) {
			for ( var i = 0, len = arr.length; i < len; i++) {
				var e = arr[i];
				this.repeatSet[e.eventId] = e
			}
		} else {
			if ("delete" == action) {
				for ( var i = 0, len = arr.length; i < len; i++) {
					var e = arr[i];
					delete (this.repeatSet[e.eventId])
				}
			}
		}
		this.resetLayout( {
			hideCalendar :false,
			deleteCalendar :false,
			updateRepeat :true
		}, true);
		cview.checkLayout()
	},
	getRepeatEvent : function(cview, day, whole, all, single) {
		var eh = this.ehandler;
		var cd, sday, eday;
		if (whole) {
			cd = Date.parseDate(day, "Y-m-d");
			if (single) {
				sday = day;
				eday = day
			} else {
				if (1 == cview.dayNum) {
					sday = day;
					eday = day
				} else {
					var colNum = cview.colNum || cview.dayNum;
					var sd = eh.getStartDateInWeek(cd, cview);
					sday = sd.format("Y-m-d");
					eday = sd.add(Date.DAY, colNum - 1).format(
							"Y-m-d")
				}
			}
		}
		var arr = [], newset = {};
		var rset = this.repeatSet, cs = eh.calendarSet;
		for ( var p in rset) {
			var re = rset[p];
			var c = cs[re.calendarId];
			if (c) {
				if (!c.hide || all) {
					var e;
					var rt = re.repeatType;
					var dspan = rt.dspan;
					if (!whole) {
						if (0 == dspan
								&& (0 != re.startRow || eh.rowCount != re.endRow)) {
							e = Ext.ux.calendar.RepeatType
									.getEvent(re, day);
							if (e) {
								arr = this.combine2List(arr,
										[ e ])
							}
						}
					} else {
						if (0 < dspan
								|| (0 == re.startRow && eh.rowCount == re.endRow)) {
							if (sday == day) {
								for ( var i = 0; i <= dspan; i++) {
									var d = cd
											.add(Date.DAY, -i)
											.format("Y-m-d");
									e = Ext.ux.calendar.RepeatType
											.getEvent(re, d);
									if (e) {
										if (e.day < sday) {
											e.lflag = true
										} else {
											delete (e.lflag)
										}
										if (e.eday > eday) {
											e.rflag = true
										} else {
											delete (e.rflag)
										}
										arr = this
												.combine2List(
														arr,
														[ e ])
									}
								}
							} else {
								e = Ext.ux.calendar.RepeatType
										.getEvent(re, day);
								if (e) {
									if (e.day < sday) {
										e.lflag = true
									} else {
										delete (e.lflag)
									}
									if (e.eday > eday) {
										e.rflag = true
									} else {
										delete (e.rflag)
									}
									arr = this.combine2List(
											arr, [ e ])
								}
							}
						}
					}
				}
				newset[re.eventId] = re
			}
		}
		this.repeatSet = newset;
		return arr
	},
	showWeek : function(cview, tbody, week, eventSet, stop) {
		var eh = this.ehandler;
		cview.cleanup(week, true);
		var colNum = cview.colNum || cview.dayNum, dayNum = cview.shiftDay
				|| cview.dayNum, daySet = cview.daySet;
		var table = [], mline = [];
		for ( var j = 0; j < dayNum; j++) {
			mline.push(0)
		}
		var sdate = eh.getStartDateInWeek(cview.daySet[week
				* dayNum], cview);
		var sday = sdate.format("Y-m-d");
		var si = cview.startColIndex, ei = cview.endColIndex;
		for ( var j = 0; j < colNum; j++) {
			var index = week * dayNum + j + si;
			var day = daySet[index];
			var dayStr = day.format("Y-m-d");
			var eventList = eventSet[dayStr];
			if (!stop) {
				var layout = this.getLayout(dayStr, cview,
						eventList || [], true);
				var rs = layout.reLayout();
				eventList = rs.wlist.concat(rs.elist)
			}
			for ( var k = 0, len = eventList.length; k < len; k++) {
				var e = Ext.apply( {}, eventList[k]);
				var dnum = Ext.ux.calendar.Mask.getDayOffset(
						(sday < e.day) ? e.day : sday, e.eday);
				var epos = j + dnum;
				if (epos >= colNum) {
					epos = colNum - 1
				}
				this.insert2Table(table, j, epos, e, mline,
						cview.lineNum)
			}
		}
		for ( var j = 0; j < si; j++) {
			var index = week * dayNum + j;
			var day = daySet[index];
			var dayStr = day.format("Y-m-d");
			var eventList = eventSet[dayStr];
			if (!stop) {
				var layout = this.getLayout(dayStr, cview,
						eventList || [], true);
				var rs = layout.reLayout();
				eventList = rs.wlist.concat(rs.elist)
			}
		}
		for ( var j = ei; j < cview.dayNum; j++) {
			var index = week * dayNum + j;
			var day = daySet[index];
			var dayStr = day.format("Y-m-d");
			var eventList = eventSet[dayStr];
			if (!stop) {
				var layout = this.getLayout(dayStr, cview,
						eventList || [], true);
				var rs = layout.reLayout();
				eventList = rs.wlist.concat(rs.elist)
			}
		}
		this.checkMore(cview, mline, table);
		var tr = this.generateTR(cview, table, week);
		if (tr && 0 < tr.length) {
			if (tbody.insertAdjacentHTML && !Ext.isIE) {
				tr = tr.join("");
				tbody.insertAdjacentHTML("beforeEnd", tr)
			} else {
				for ( var k = 0, len = tr.length; k < len; k++) {
					Ext.DomHelper.append(tbody, tr[k])
				}
			}
			this.bindEvent2Table(cview, table, tbody)
		}
	},
	insert2Table : function(table, spos, epos, e, mline, limit) {
		var flag = false, tr;
		for ( var i = 0, len = table.length; i < len; i++) {
			tr = table[i];
			flag = true;
			for ( var j = spos; j <= epos; j++) {
				if (tr[j]) {
					flag = false;
					break
				}
			}
			if (flag) {
				break
			}
		}
		if (!flag) {
			if (!limit || table.length < limit) {
				tr = {};
				table.push(tr);
				flag = true
			} else {
				for ( var j = spos; j <= epos; j++) {
					mline[j]++
				}
			}
		}
		if (flag) {
			var span = epos - spos + 1;
			for ( var j = spos; j <= epos; j++) {
				tr[j] = {
					span :span,
					event :e
				}
			}
		}
		return flag
	},
	checkMore : function(cview, mline, table) {
		if (0 < table.length) {
			var colNum = cview.colNum || cview.dayNum;
			var tr = table[table.length - 1];
			for ( var i = 0; i < colNum;) {
				var td = tr[i];
				if (td) {
					var span = td.span;
					var flag = false;
					for ( var j = 0; j < span; j++) {
						if (0 < mline[i + j]) {
							flag = true;
							break
						}
					}
					if (flag) {
						for ( var j = 0; j < span; j++) {
							var index = i + j;
							var t = tr[index];
							t.span = 1;
							t.event = (0 >= mline[index]) ? 1
									: mline[index] + 1
						}
					}
					i += span
				} else {
					if (0 < mline[i]) {
						tr[i] = {
							span :1,
							event :mline[i]
						}
					}
					i++
				}
			}
		}
		return table
	},
	generateTR : function(cview, rows, w) {
		var eh = this.ehandler;
		// var lan = Ext.ux.calendar.Mask.EventHandler;
		var lan = eh.lang.EventHandler;
		var colNum = cview.colNum || cview.dayNum, dayNum = cview.shiftDay, daySet = cview.daySet;
		var si = cview.startColIndex;
		var tr = [];
		var rowNum = rows.length;
		for ( var i = 0; i < rowNum; i++) {
			var row = rows[i];
			var str = "";
			for ( var j = 0; j < colNum;) {
				if (!row[j]) {
					str += "<td></td>";
					j++
				} else {
					var span = row[j].span;
					var e = row[j].event;
					var html;
					if ("number" == Ext.type(e)) {
						var day = daySet[w * dayNum + j + si]
								.format("Y-m-d");
						html = '<div class="x-event-more-ct"><u><b name="'
								+ day
								+ '" class="x-event-more">&nbsp;&nbsp;&nbsp;&nbsp;'
								+ e
								+ " "
								+ lan.more
								+ "...</b></u></div>"
					} else {
						html = eh.generateLegend(cview, e)
					}
					str += '<td colspan="' + span + '">' + html
							+ "</td>";
					j += span
				}
			}
			str = "<tr>" + str + "</tr>";
			tr.push(str)
		}
		if (0 < tr.length) {
			return tr
		}
	},
	bindEvent2Table : function(cview, rows, root) {
		var colNum = cview.colNum || cview.dayNum;
		var rowNum = rows.length;
		for ( var i = 0; i < rowNum; i++) {
			var row = rows[i];
			for ( var j = 0; j < colNum;) {
				if (!row[j]) {
					j++
				} else {
					var span = row[j].span;
					var e = row[j].event;
					var els = Ext.DomQuery.select(
							"div[name=x-event-" + e.day + "-"
									+ e.eday + "-" + e.eventId
									+ "]", root);
					for ( var k = 0, len = els.length; k < len; k++) {
						var El = Ext.get(els[k]);
						El.bindEvent = e;
						El.cview = cview
					}
					j += span
				}
			}
		}
	}
});
Ext.ns("Ext.ux.calendar");
Ext.ux.calendar.LayoutGrid = function(config) {
	Ext.apply(this, config);
	this.CALENDAR_ROW_NUM = this.ehandler.rowCount;
	this.blockId = 0;
	this.grid = new Array();
	this.wholeList = [];
	this.heventList = [];
	this.hwholeList = [];
	this.visited = {};
	this.crossVisited = {}
};
Ext.ux.calendar.LayoutGrid.prototype = {
	getAllEvents : function() {
		var events = this.getEventList();
		events = this.owner.getWholeList(this.cview, this.day, true, true)
				.concat(events);
		return events
	},
	getEventList : function() {
		var eventList = new Array();
		var blockId = -1;
		for ( var i = 0; i < this.CALENDAR_ROW_NUM; i++) {
			var line = this.grid[i];
			if (-1 == blockId) {
				if (null != line.block) {
					blockId = line.block.id;
					eventList = eventList.concat(line.block.eventList)
				}
			} else {
				if (null != line.block) {
					if (blockId != line.block.id) {
						blockId = line.block.id;
						eventList = eventList.concat(line.block.eventList)
					}
				}
			}
		}
		return eventList
	},
	removeOutDeletedCalendar : function(eventList) {
		var eh = this.ehandler;
		var i, len, arr = [];
		for (i = 0, len = this.heventList.length; i < len; i++) {
			var event = this.heventList[i];
			if (eh.calendarSet[event.calendarId]) {
				arr.push(event)
			}
		}
		this.heventList = arr;
		arr = [];
		for (i = 0, len = eventList.length; i < len; i++) {
			var event = eventList[i];
			if (eh.calendarSet[event.calendarId]) {
				arr.push(event)
			}
		}
		return arr
	},
	refreshRepeatEvent : function(eventList) {
		var i, len, arr = [];
		for (i = 0, len = this.heventList.length; i < len; i++) {
			var event = this.heventList[i];
			if ("string" == Ext.type(event.repeatType)) {
				arr.push(event)
			}
		}
		this.heventList = arr;
		arr = [];
		for (i = 0, len = eventList.length; i < len; i++) {
			var event = eventList[i];
			if ("string" == Ext.type(event.repeatType)) {
				arr.push(event)
			}
		}
		var res = this.owner.getRepeatEvent(this.cview, this.day);
		arr = this.owner.combine2List(res, arr);
		return arr
	},
	filterEvent : function(eventList) {
		var eh = this.ehandler;
		var selist = [];
		var arr = [];
		var i, j, len;
		if (this.deleteCalendar) {
			this.deleteCalendar = false;
			eventList = this.removeOutDeletedCalendar(eventList)
		}
		if (this.hideCalendar) {
			this.hideCalendar = false;
			for (i = 0, len = this.heventList.length; i < len; i++) {
				var event = this.heventList[i];
				if (!eh.calendarSet[event.calendarId].hide) {
					selist.push(event)
				} else {
					arr.push(event)
				}
			}
			this.heventList = arr;
			arr = [];
			for (i = 0, len = eventList.length; i < len; i++) {
				var event = eventList[i];
				if (!eh.calendarSet[event.calendarId].hide) {
					arr.push(event)
				} else {
					this.heventList.push(event)
				}
			}
			eventList = this.owner.combine2List(arr, selist);
			eventList = this.refreshRepeatEvent(eventList)
		}
		if (this.updateRepeat) {
			this.updateRepeat = false;
			eventList = this.refreshRepeatEvent(eventList)
		}
		return eventList
	},
	reLayout : function(single, nowhole) {
		return this.generateLayout(this.getEventList(), true, single, nowhole)
	},
	increaseLine : function(line, lstArea, lstIndex) {
		while (lstIndex > line.areaList.length) {
			line.areaList[line.areaList.length] = null
		}
		line.areaList[line.areaList.length] = lstArea
	},
	addArea : function(line, area, colIndex) {
		if (line.areaList.length < colIndex + 1) {
			this.increaseLine(line, area, colIndex)
		} else {
			line.areaList[colIndex] = area
		}
	},
	generateArea : function(event, block, colIndex) {
		for ( var i = event.startRow; i < event.endRow; i++) {
			var line = this.grid[i];
			line.block = block;
			this.addArea(line, event, colIndex)
		}
	},
	getColIndex : function(line) {
		var colIndex, size;
		for (colIndex = 0, size = line.areaList.length; colIndex < size; colIndex++) {
			var event = line.areaList[colIndex];
			if (null == event) {
				break
			}
		}
		return colIndex
	},
	generateLayout : function(eventList, reload, single, nowhole) {
		var elist = [], wlist = [];
		if (!reload) {
			this.heventList = [];
			elist = eventList
		} else {
			elist = eventList
		}
		if (!nowhole) {
			wlist = this.owner.getWholeList(this.cview, this.day, null, single)
		}
		elist = this.filterEvent(elist);
		if (!this.layouted) {
			this.visited = {};
			if (this.cview) {
				this.visited[this.cview.id] = true
			}
			this.layouted = true;
			for ( var i = 0; i < this.CALENDAR_ROW_NUM; i++) {
				this.grid[i] = new Ext.ux.calendar.Line()
			}
			this.blockId = 0;
			elist = this.Layouting(elist)
		} else {
			this.visited[this.cview.id] = true
		}
		this.inited = true;
		return {
			elist :elist,
			wlist :wlist
		}
	},
	Layouting : function(eventList) {
		var eh = this.ehandler;
		var b2eMap = new Array();
		var block = null;
		for ( var i = 0, size = eventList.length; i < size; i++) {
			var event = eventList[i];
			var line = this.grid[event.startRow];
			var colIndex = this.getColIndex(line);
			if (event.colIndex != colIndex) {
				event.colIndex = colIndex;
				event.changed = true
			}
			if (0 == line.areaList.length) {
				block = new Ext.ux.calendar.Block();
				block.id = this.blockId++
			} else {
				if (null != block) {
					if (block.colNum < colIndex) {
						block.colNum = colIndex
					}
				}
			}
			line.block = block;
			b2eMap[b2eMap.length] = new Ext.ux.calendar.BlockMap(event, block);
			block.addEvent(event);
			this.generateArea(event, block, colIndex)
		}
		for ( var i = 0, size = b2eMap.length; i < size; i++) {
			var b2e = b2eMap[i];
			var span = b2e.block.colNum + 1;
			if (span != b2e.event.span) {
				b2e.event.span = span;
				b2e.event.changed = true
			}
		}
		var arr = [];
		for ( var i = 0, len = eventList.length; i < len; i++) {
			var event = eventList[i];
			if (!eh.calendarSet[event.calendarId].hide) {
				arr[arr.length] = event
			}
		}
		eventList = arr;
		var cols = {};
		for ( var i = 0, len = eventList.length; i < len; i++) {
			var event = eventList[i];
			var startRow = event.startRow;
			var endRow = event.endRow;
			for ( var j = startRow; j < endRow; j++) {
				if (!cols[j]) {
					cols[j] = event
				} else {
					if (cols[j].colIndex < event.colIndex) {
						cols[j] = event
					}
				}
			}
		}
		for ( var i = 0, len = eventList.length; i < len; i++) {
			var event = eventList[i];
			var startRow = event.startRow;
			var endRow = event.endRow;
			var last = true;
			for ( var j = startRow; j < endRow; j++) {
				if (cols[j] && event.colIndex < cols[j].colIndex
						&& cols[j].startRow >= event.startRow) {
					last = false;
					break
				}
			}
			if (true === last) {
				if (true !== event.last) {
					event.last = true;
					event.changed = true
				}
			} else {
				if (true === event.last) {
					event.changed = true
				}
				delete (event.last)
			}
		}
		return eventList
	},
	updateLayout : function(event, action, force) {
		this.visited = {};
		this.visited[this.cview.id] = true;
		if ((0 == event.startRow && this.CALENDAR_ROW_NUM == event.endRow)
				|| (event.day != event.eday)) {
			var arr = [ event ];
			this.owner.updateWholeList(arr, action);
			return this.owner.getWholeList(this.cview, this.day)
		} else {
			var eventList = new Array();
			var startRow = event.startRow;
			var endRow = event.endRow;
			var i, size, colIndex = -1;
			for (i = 0, size = this.grid.length; i < size; i++) {
				var line = this.grid[i];
				if (colIndex == -1) {
					for ( var j = 0, colNum = line.areaList.length; j < colNum; j++) {
						var area = line.areaList[j];
						if (null == area) {
							continue
						}
						if (area.eventId == event.eventId) {
							colIndex = j;
							if (startRow > i) {
								startRow = i
							}
							if (endRow < i + 1) {
								endRow = i + 1
							}
						}
					}
				} else {
					if (line.areaList.length > colIndex) {
						if (null != line.areaList[colIndex]) {
							if (line.areaList[colIndex].eventId == event.eventId) {
								if (endRow < i + 1) {
									endRow = i + 1
								}
							}
						} else {
							break
						}
					} else {
						break
					}
				}
			}
			var blockId = -1;
			for (i = startRow; i < endRow; i++) {
				var line = this.grid[i];
				if (-1 == blockId) {
					if (null != line.block) {
						blockId = line.block.id;
						eventList = eventList.concat(line.block.eventList)
					}
				} else {
					if (null != line.block) {
						if (blockId != line.block.id) {
							blockId = line.block.id;
							eventList = eventList.concat(line.block.eventList)
						}
					}
				}
			}
			if ((action == "update") || (action == "delete")) {
				for (i = 0, size = eventList.length; i < size; i++) {
					var be = eventList[i];
					if (event.eventId == be.eventId) {
						if ("update" == action && true !== force
								&& event.startRow == be.startRow
								&& event.endRow == be.endRow) {
							Ext.apply(be, event);
							return {
								elist : [ event ]
							}
						}
						eventList.splice(i, 1);
						break
					}
				}
			}
			if ((action == "update") || (action == "add")) {
				for (i = 0, size = eventList.length; i < size; i++) {
					var sId = eventList[i].startRow;
					var eId = eventList[i].endRow;
					if (sId > event.startRow) {
						eventList.splice(i, 0, event);
						break
					} else {
						if (sId == event.startRow && eId <= event.endRow) {
							eventList.splice(i, 0, event);
							break
						}
					}
				}
				if (i == size) {
					eventList[eventList.length] = event
				}
			}
			if (eventList[0]) {
				if (startRow > eventList[0].startRow) {
					startRow = eventList[0].startRow
				}
			}
			if (null != this.grid[endRow - 1].block) {
				if (endRow < this.grid[endRow - 1].block.endRow) {
					endRow = this.grid[endRow - 1].block.endRow
				}
			}
			for (i = startRow; i < endRow; i++) {
				if (this.grid[i].areaList.length > 0) {
					this.grid[i].areaList.length = 0
				}
				this.grid[i].block = null
			}
			for (i = 0, size = eventList.length; i < size; i++) {
				eventList[i].changed = false
			}
			event.changed = true;
			eventList = this.Layouting(eventList);
			var backList = new Array();
			for (i = 0, size = eventList.length; i < size; i++) {
				event = eventList[i];
				if (event.changed == true) {
					backList.push(event)
				}
			}
			return {
				elist :backList
			}
		}
	}
};
Ext.ns("Ext.ux.calendar");
Ext.ux.calendar.Line = function(config) {
	var obj = {};
	obj.areaList = new Array();
	obj.block = null;
	Ext.apply(obj, config);
	return obj
};
Ext.ns("Ext.ux.calendar");
Ext.ux.calendar.MainPanel = function(config) {
	Ext.apply(this, config);
	this.datasource = this.datasource || new Ext.ux.calendar.DataSource();
	this.datasource.mainPanel = this;
	this.commentTip = new Ext.ux.calendar.CommentTip();
	this.ehandler = new Ext.ux.calendar.EventHandler( {
		ds :this.datasource,
		mainPanel :this,
		commentTip :this.commentTip,
		calendarSetting :this.calendarSetting,
		lang : this.lang
	});
	this.editor = new Ext.ux.calendar.Editor( {
		ehandler :this.ehandler
	});
	this.ceditor = new Ext.ux.calendar.CalendarEditor( {
		ehandler :this.ehandler
	});
	this.ehandler.editor = this.editor;
	this.ehandler.ceditor = this.ceditor;
	this.westPanel = new Ext.ux.calendar.WestPanel( {
		ehandler :this.ehandler
	});
	this.calendarContainer = new Ext.ux.calendar.CalendarContainer( {
		ehandler :this.ehandler
	});
	this.backthread = new Ext.ux.calendar.BackThread( {
		ehandler :this.ehandler
	});
	Ext.ux.calendar.MainPanel.superclass.constructor.call(this, {
		border :false,
		layout :"border",
		items : [ this.westPanel, this.calendarContainer ]
	});
	this.ehandler.on("calendarloaded",
			this.calendarContainer.onCalendarLoadedFn, this.calendarContainer);
	this.on("afterrender", this.onAfterRenderFn, this);
	this.on("destroy", this.onDestroyFn, this);
	this.westPanel.relayEvents(this.calendarContainer, [ "changedate" ]);
	this.relayEvents(this.calendarContainer,
			[ "beforeremoteload", "remoteload" ]);
	this.calendarContainer.relayEvents(this.editor, [ "showdetailsetting" ]);
	this.editor.relayEvents(this.calendarContainer, [ "hideeditor" ]);
	this.on("beforeremoteload", this._onBeforeRemoteLoadFn, this);
	this.on("remoteload", this._onRemoteLoadFn, this, {
		delay :500
	})
};
Ext.extend(Ext.ux.calendar.MainPanel, Ext.Panel, {
	_onBeforeRemoteLoadFn : function() {
		this.loadMask.show()
	},
	_onRemoteLoadFn : function() {
		this.loadMask.hide()
	},
	onAfterRenderFn : function(p) {
		this.calendarContainer.relayEvents(p.body, [ "mousedown" ]);
		this.editor.render(p.body);
		this.loadMask = new Ext.LoadMask(p.body, {
			//msg :Ext.ux.calendar.Mask.MainPanel["loadMask.msg"];
			msg : this.lang.MainPanel["loadMask.msg"]
		})
	},
	onDestroyFn : function(p) {
		this.backthread.destroy();
		var eh = this.ehandler;
	}
});
Ext.ns("Ext.ux.calendar");
Ext.ux.calendar.MonthView = Ext.extend(Ext.ux.calendar.BasicView,{
	legendHeight :17,
	border :false,
	dayFormat :"m/d",
	templateRowNum :6,
	weekNum :5,
	dayNum :7,
	rowNum :6,
	colNum :7,
	menuAlign :"tr-br?",
	poolDepth :0,
	leftWidth :25,
	showMenu : function(El) {
		if (this.menu) {
			this.menu.bindEl = El;
			this.menu.show(Ext.get(El.dom.parentNode),
					this.menuAlign)
		}
		return this
	},
	hideMenu : function() {
		if (this.menu) {
			this.menu.hide()
		}
		return this
	},
	initMenu : function() {
		// var lan = Ext.ux.calendar.Mask.MonthView;
		var lan = this.ehandler.lang.MonthView;
		this.addItem = new Ext.menu.Item( {
			iconCls :"icon-sys-calendar-new",
			text :lan["addItem.text"],
			handler :this.onAddFn,
			scope :this
		});
		this.clearItem = new Ext.menu.Item( {
			iconCls :"icon-sys-calendar-clear_event",
			text :lan["clearItem.text"],
			handler :this.onClearFn,
			scope :this
		});
		this.cutItem = new Ext.menu.Item( {
			iconCls :"icon-sys-calendar-cut",
			text :lan["cutItem.text"],
			handler :this.onCutFn,
			scope :this
		});
		this.copyItem = new Ext.menu.Item( {
			iconCls :"icon-sys-calendar-copy",
			text :lan["copyItem.text"],
			handler :this.onCopyFn,
			scope :this
		});
		this.pasteItem = new Ext.menu.Item( {
			iconCls :"icon-sys-calendar-paste",
			text :lan["pasteItem.text"],
			handler :this.onPasteFn,
			scope :this
		});
		this.menu = new Ext.menu.Menu(
				{
					items : [ this.addItem, this.clearItem,
							"-", this.cutItem, this.copyItem,
							this.pasteItem ]
				});
		this.menu = Ext.menu.MenuMgr.get(this.menu)
	},
	getCellIndex : function(cellId) {
		var parts = cellId.toString().split("-");
		var len = parts.length;
		var colIndex = parts[len - 1];
		var rowIndex = parts[len - 2];
		return {
			x :parseInt(rowIndex),
			y :parseInt(colIndex)
		}
	},
	generateHTML : function(data) {
		this.generateCSS();
		this.viewerTpl = new Ext.XTemplate(
				'<div id="'
						+ this.id
						+ '-x-monthview-viewer"><table width="100%" cellspacing="0" cellpadding="0" border="0" unselectable="on" onselectstart="return false;"><tbody><tr><td class="x-monthview-lefter"><div id="'
						+ this.id
						+ '-x-monthview-lefter"><tpl for="."><div class="x-monthview-lefter-inner '
						+ this.id
						+ '-x-monthview-row"><u><b id="'
						+ this.id
						+ '-x-monthview-week-{idx}-0" class="x-monthview-lefter-inner-b">{week}</b></u></div></tpl></div></td><td class="x-monthview-port-td"><div id="'
						+ this.id
						+ '-x-monthview-port" class="x-monthview-port"><tpl for="."><div class="'
						+ this.id
						+ '-x-monthview-row x-monthview-row" unselectable="on"><table class="x-monthview-bg" width="100%" height="100%" cellspacing="0" cellpadding="0" border="0"><tbody><tr><tpl for="arr"><td id="'
						+ this.id
						+ '-x-monthview-viewer-{parent.idx}-{idx}" class="'
						+ this.id
						+ '-x-monthview-viewer-col-{idx} x-monthview-viewer-cell">&nbsp;</td></tpl></tr></tbody></table><table id="'
						+ this.id
						+ '-x-monthview-ct-{idx}" class="x-monthview-ct" width="100%" cellspacing="0" cellpadding="0" border="0"><tbody><tr><tpl for="arr"><td id="'
						+ this.id
						+ '-x-monthview-viewer-title-{parent.idx}-{idx}" class="'
						+ this.id
						+ '-x-monthview-viewer-col-{idx} x-monthview-viewer-title"><div><table width="100%" height="100%" border="0"><tbody><tr><td><u id="'
						+ this.id
						+ '-x-monthview-viewer-link-{parent.idx}-{idx}" class="x-monthview-viewer-link"><b class="x-monthview-viewer-link-b">{day}</b></u></td>'
						+ (this.ehandler.readOnly ? ""
								: '<td class="x-monthview-viewer-tool"><img id="'
										+ this.id
										+ '-x-monthview-tool-add-{parent.idx}-{idx}" class="x-monthview-tool-add" src="'
										+ Ext.BLANK_IMAGE_URL
										+ '"></img><img id="'
										+ this.id
										+ '-x-monthview-tool-drop-{parent.idx}-{idx}" class="x-monthview-tool-drop" src="'
										+ Ext.BLANK_IMAGE_URL
										+ '"></img></td>')
						+ "</tr></tbody></table></div></td></tpl></tr></tbody></table></div></tpl></div></div></td></tr></tbody></table>");
		this.viewerTpl.compile();
		var obj = [];
		var sdate = this.daySet[0];
		var week = sdate.getWeekOfYear();
		for ( var i = 0; i < this.templateRowNum; i++) {
			var arr = [];
			for ( var j = 0; j < this.dayNum; j++) {
				arr[arr.length] = {
					idx :j,
					day :(sdate.add(Date.DAY, i * this.dayNum + j)).format(this.dayFormat)
				}
			}
			var w = (week + i) % 53;
			if (0 == w) {
				w = 53
			}
			obj[obj.length] = {
				idx :i,
				week :w,
				arr :arr
			}
		}
		var viewer = this.viewerTpl.apply(obj);
		var days = "";
		for ( var j = 0; j < this.dayNum; j++) {
			days += '<td class="'
					+ this.id
					+ "-x-monthview-viewer-col-"
					+ j
					+ ' x-dayview-header-days"><div><b style="line-height:15px;">'
					+ this.ehandler.lang.MonthView.dayPre		// + Ext.ux.calendar.Mask.MonthView.dayPre
					+ this.daySet[j].format("l")
					+ "</b></div></td>"
		}
		var header = '<div id="'
				+ this.id
				+ '-x-monthview-header" class="x-monthview-header" unselectable="on"><table width="100%" height="100%" cellspacing="0" cellpadding="0" border="0"><tbody><tr>'
				+ days + "</tr></tbody></table></div>";
		var html = header + viewer;
		return html
	},
	generateCSS : function() {
		var cssText = "." + this.id
				+ "-x-monthview-viewer-row-height{}." + this.id
				+ "-x-monthview-row{}." + this.id
				+ "-x-monthview-viewer-list{}";
		for ( var i = 0; i < this.dayNum; i++) {
			cssText += "." + this.id
					+ "-x-monthview-viewer-col-" + i + "{}"
		}
		var cid = Ext.id();
		this.ss = Ext.util.CSS.createStyleSheet(cssText, cid)
	},
	setToday : function() {
		var sdate = this.daySet[0];
		var m = sdate.format("n");
		if (1 != sdate.format("j")) {
			m = (m + 1) % 12;
			if (0 == m) {
				m = 12
			}
		}
		var today = (new Date()).format("Y-m-d");
		for ( var i = 0, len = this.daySet.length; i < len; i++) {
			var day = this.daySet[i].format("Y-m-d");
			var month = this.daySet[i].format("n");
			if (day == today) {
				var x = Math.floor(i / this.dayNum);
				var y = i % this.dayNum;
				var tEl = Ext.get(this.id
						+ "-x-monthview-viewer-title-" + x
						+ "-" + y);
				if (tEl) {
					tEl.setStyle("background-color",
							"rgb(255,255,200)")
				}
			} else {
				if (m != month) {
					var x = Math.floor(i / this.dayNum);
					var y = i % this.dayNum;
					var tEl = Ext.get(this.id
							+ "-x-monthview-viewer-title-" + x
							+ "-" + y);
					if (tEl) {
						tEl.setStyle("background-color",
								"rgb(235,235,235)")
					}
				} else {
					var x = Math.floor(i / this.dayNum);
					var y = i % this.dayNum;
					var tEl = Ext.get(this.id
							+ "-x-monthview-viewer-title-" + x
							+ "-" + y);
					if (tEl) {
						tEl.setStyle("background-color",
								"rgb(241,244,250)")
					}
				}
			}
		}
	},
	getStartDate : function(date) {
		var sDate;
		if (1 == this.startDay) {
			var n = date.format("N");
			n = 1 - n;
			sDate = date.add(Date.DAY, n)
		} else {
			var w = date.format("w");
			sDate = date.add(Date.DAY, -w)
		}
		return sDate
	},
	initComponent : function() {
		this.id = Ext.id();
		this.ehandler.applyCalendarSetting(this);
		var today = new Date();
		var first = today.getFirstDateOfMonth();
		this.recalculateWeek(first);
		var sDate = this.getStartDate(first);
		this.daySet = [];
		for ( var i = 0; i < this.weekNum; i++) {
			for ( var j = 0; j < this.dayNum; j++) {
				this.daySet[this.daySet.length] = sDate.add(
						Date.DAY, i * this.shiftDay + j)
			}
		}
		this.html = this.generateHTML();
		this.initMenu();
		Ext.ux.calendar.MonthView.superclass.initComponent
				.call(this);
		this.addEvents("checklayout", "afterresize",
				"beforeremoteload", "remoteload",
				"canceldetail", "viewDay", "viewWeek");
		this.on("checklayout", this.checkLayout, this);
		this.on("canceldetail", this.onCancelDetailFn, this);
		this.on("afterrender", this._onAfterRenderFn, this);
		this.on("afterlayout", this._onReSizingFn, this);
		this.on("bodyresize", this._onReSizingFn, this);
		this.on("sizechanged", this.onSizeChangedFn, this, {
			buffer :50
		});
		Ext.EventManager.on(document, "mouseup",
				this._onMouseUpFn, this)
	},
	_onAfterRenderFn : function() {
		this.initEls()
	},
	_onReSizingFn : function() {
		this.fireEvent("sizechanged")
	},
	onSizeChangedFn : function() {
		this.handleResize(this.body.getWidth(), this.body
				.getHeight())
	},
	onCancelDetailFn : function(e) {
		if (this.detailing) {
			this.detailing = false;
			this.detailCt.setStyle("display", "none")
		}
	},
	resetSCover : function() {
		delete (this.startPos);
		delete (this.endPos);
		this.hideSCovers()
	},
	_onMouseUpFn : function(e) {
		if (!this.dragging) {
			if (this.startPos) {
				var spos = Ext.apply( {}, this.startPos), epos = Ext
						.apply( {}, this.endPos);
				this.startPos = null;
				var eh = this.ehandler;
				if (this.colNum != this.shiftDay
						&& 1 != eh.startDay) {
					spos.y++;
					epos.y++
				}
				eh.prepareLegend(Ext.get(this.id
						+ "-x-monthview-viewer-title-" + epos.x
						+ "-" + epos.y), spos, epos, this)
			}
		}
	},
	getMinMaxFromStartEnd : function(startPos, endPos) {
		var stx = startPos.x;
		var sty = startPos.y;
		var edx = endPos.x;
		var edy = endPos.y;
		if (stx < edx || (stx == edx && sty <= edy)) {
			return {
				minPos :startPos,
				maxPos :endPos
			}
		} else {
			return {
				minPos :endPos,
				maxPos :startPos
			}
		}
	},
	hideSCovers : function() {
		for ( var i = 0, len = this.scovers.length; i < len; i++) {
			this.scovers[i].dom.style.display = "none"
		}
	},
	selectRange : function(spos, epos) {
		this.hideSCovers();
		if (spos) {
			this.startPos = spos
		} else {
			spos = this.startPos
		}
		this.endPos = epos;
		var rs = this.getMinMaxFromStartEnd(spos, epos);
		var sx = rs.minPos.x, sy = rs.minPos.y, ex = rs.maxPos.x, ey = rs.maxPos.y;
		var cw = this.cw;
		var ch = this.ch;
		var sc, fsc = this.scovers[sx];
		var w, l = Math.floor(cw * sy);
		if (sx == ex) {
			sc = this.scovers[sx];
			sc.dom.style.display = "";
			w = cw * (ey - sy + 1);
			sc.setWidth(w);
			sc.setHeight(ch);
			sc.setLeft(l + "px")
		} else {
			sc = this.scovers[sx];
			sc.dom.style.display = "";
			w = cw * (this.colNum - sy);
			sc.setWidth(w);
			sc.setHeight(ch);
			sc.setLeft(l + "px");
			for ( var i = sx + 1; i < ex; i++) {
				sc = this.scovers[i];
				sc.dom.style.display = "";
				w = cw * this.colNum;
				sc.setWidth(w);
				sc.setHeight(ch);
				sc.setLeft("0px")
			}
			sc = this.scovers[ex];
			sc.dom.style.display = "";
			w = cw * (ey + 1);
			sc.setWidth(w);
			sc.setHeight(ch);
			sc.setLeft("0px")
		}
	},
	calculatePos : function(e) {
		var xy = e.getXY();
		var lt = this.port.getXY();
		var y = Math.floor((xy[0] - lt[0]) / this.cw);
		var x = Math.floor((xy[1] - lt[1]) / this.ch);
		if (0 > x) {
			x = 0
		} else {
			if (x >= this.weekNum) {
				x = this.weekNum - 1;
				y = this.colNum - 1
			}
		}
		if (0 > y) {
			y = 0
		} else {
			if (y >= this.colNum) {
				y = this.colNum - 1
			}
		}
		return {
			x :x,
			y :y
		}
	},
	getIndexFromDay : function(day) {
		for ( var i = 0, len = this.daySet.length; i < len; i++) {
			var iday = this.daySet[i];
			if (day == iday.format("Y-m-d")) {
				return i
			}
		}
	},
	alignDetailCt : function() {
		if (this.detailing) {
			var x = this.detailing.x, y = this.detailing.y, events = this.detailing.events;
			this.detailCt.setStyle("display", "");
			var tEl = Ext.get(this.id
					+ "-x-monthview-viewer-title-" + x + "-"
					+ y);
			var cEl = Ext.get(this.id + "-x-monthview-viewer-"
					+ x + "-" + y);
			var tfh = this.detailTitle.getHeight()
					+ this.detailFoot.getHeight() + 20;
			var h = events.length * 17;
			var bh = this.port.getBottom() - tEl.getTop() - tfh, th = cEl
					.getBottom()
					- this.port.getTop() - tfh;
			var roffset = this.port.getRight() - tEl.getRight();
			var hpos, vpos = "t", mh = bh;
			var offset = [ 0, 0 ];
			var cw = cEl.getWidth();
			if (200 < cw) {
				this.detailCt.setWidth(cw)
			} else {
				this.detailCt.setWidth(200)
			}
			if (bh > h) {
				this.detailViewer.setStyle("height", "")
			} else {
				if (th > h) {
					vpos = "b";
					tEl = cEl;
					offset[1] = -4;
					this.detailViewer.setStyle("height", "")
				} else {
					if (th > bh) {
						vpos = "b";
						mh = th;
						tEl = cEl;
						offset[1] = -4
					}
					this.detailViewer.setHeight(mh)
				}
			}
			if (roffset < this.detailCt.getWidth()) {
				hpos = "r";
				offset[0] = -1
			} else {
				hpos = "l"
			}
			var str = vpos + hpos;
			this.detailCt.alignTo(tEl, str + "-" + str, offset)
		}
	},
	showDetails : function(day) {
		// var lan = Ext.ux.calendar.Mask.MonthView;
		var eh = this.ehandler;
		var lan = eh.lang.MonthView;
		var glayout = eh.calendarLayout;
		var layout = glayout.getLayout(day, this);
		var rs = layout.reLayout(true);
		var events = rs.wlist.concat(rs.elist);
		var index = this.getIndexFromDay(day);
		var x = Math.floor(index / this.dayNum);
		var y = index % this.dayNum;
		this.detailing = {
			x :x,
			y :y,
			events :events
		};
		this.detailTitle.dom.innerHTML = '<u id="'
				+ Ext.id()
				+ "-x-monthview-viewer-link-"
				+ x
				+ "-"
				+ y
				+ '" class="x-monthview-viewer-link"><b class="x-monthview-viewer-link-b">'
				+ day + "</b></u>";
		this.detailFoot.dom.innerHTML = events.length + " "
				+ lan.events;
		eh.bindEvent2Detail(this, events, this.detailViewer);
		this.alignDetailCt()
	},
	_onPortMouseDownFn : function(e) {
		e.stopEvent();
		this.fireEvent("hideeditor");
		var target = e.getTarget();
		var tgEl = Ext.get(target);
		if (tgEl.hasClass("x-event-more")) {
			var day = tgEl.dom.getAttribute("name");
			this.showDetails(day)
		} else {
			if (this.detailing) {
				if (!(tgEl.hasClass("x-event-detail-ct") || tgEl
						.parent(".x-event-detail-ct"))) {
					this.fireEvent("canceldetail")
				} else {
					return
				}
			}
			if (!this.createByDblclick
					&& !this.ehandler.readOnly) {
				if (!tgEl.hasClass("x-monthview-tool-drop")
						&& !tgEl
								.hasClass("x-monthview-viewer-link-b")) {
					var eEl;
					if (tgEl.hasClass("x-calendar-event")) {
						eEl = tgEl
					} else {
						eEl = tgEl.parent(".x-calendar-event")
					}
					if (!eEl) {
						var pos = this.calculatePos(e);
						if (0 <= pos.x && 0 <= pos.y) {
							this.selectRange(pos, pos)
						}
					}
				}
			}
		}
	},
	_onPortMouseMoveFn : function(e) {
		if (0 == e.button) {
			if (this.startPos) {
				var pos = this.calculatePos(e);
				if (0 <= pos.x && 0 <= pos.y) {
					this.selectRange(null, pos)
				}
			}
		} else {
			this.resetSCover()
		}
	},
	initEls : function() {
		this.lefter = Ext.get(this.id + "-x-monthview-lefter");
		this.viewer = Ext.get(this.id + "-x-monthview-viewer");
		this.port = Ext.get(this.id + "-x-monthview-port");
		this.cheader = Ext.get(this.id + "-x-monthview-header");
		this.lefter.un("click", this._onLefterClickFn, this);
		this.lefter.on("click", this._onLefterClickFn, this);
		this.port.un("click", this._onPortClickFn, this);
		this.port.on("click", this._onPortClickFn, this);
		this.port
				.un("mousedown", this._onPortMouseDownFn, this);
		this.port
				.on("mousedown", this._onPortMouseDownFn, this);
		if (!this.ehandler.readOnly) {
			this.port.un("mousemove", this._onPortMouseMoveFn,
					this);
			this.port.un("mouseover", this._onPortMouseOverFn,
					this);
			this.port.un("contextmenu",
					this._onPortContextMenuFn, this);
			this.port.un("dblclick", this._onPortDblclickFn,
					this);
			this.port.on("mousemove", this._onPortMouseMoveFn,
					this);
			this.port.on("contextmenu",
					this._onPortContextMenuFn, this);
			this.port.on("mouseover", this._onPortMouseOverFn,
					this);
			this.port.on("dblclick", this._onPortDblclickFn,
					this);
			this.initDragZone(this.port)
		}
		this.initDetailCt();
		this.initSelectCover();
		this.setToday()
	},
	_onLefterClickFn : function(e) {
		e.stopEvent();
		var target = e.getTarget();
		var tgEl = Ext.get(target);
		if (tgEl.hasClass("x-monthview-lefter-inner-b")) {
			var pos = this.getCellIndex(tgEl.dom.id);
			var x = pos.x;
			var sdate = this.daySet[x * this.shiftDay];
			var edate = this.daySet[(x + 1) * this.shiftDay - 1];
			this.fireEvent("viewWeek", sdate, edate)
		}
	},
	_onPortDblclickFn : function(e) {
		e.stopEvent();
		var target = e.getTarget();
		var tgEl = Ext.get(target);
		if (!tgEl.hasClass("x-calendar-event")) {
			tgEl = tgEl.parent(".x-calendar-event")
		}
		if (tgEl) {
			if (tgEl && !tgEl.bindEvent.locked) {
				this.ehandler.showEditor(tgEl, this, "update")
			}
		} else {
			if (this.createByDblclick) {
				var pos = this.calculatePos(e);
				this.addLegend(pos)
			}
		}
	},
	_onPortContextMenuFn : function(e) {
		e.stopEvent();
		var target = e.getTarget();
		var tgEl = Ext.get(target);
		var cEl;
		if (tgEl.hasClass("x-calendar-event")) {
			cEl = tgEl
		} else {
			cEl = tgEl.parent(".x-calendar-event")
		}
		if (cEl) {
			var eh = this.ehandler;
			eh.showContextMenu(e, cEl)
		}
	},
	_onPortMouseOverFn : function(e) {
		if (this.detailing) {
			return
		}
		var target = e.getTarget();
		var tgEl = Ext.get(target);
		if (this.overEl) {
			this.overEl.removeClass("x-tool-btn-over");
			delete (this.overEl)
		}
		if (tgEl.hasClass("x-monthview-tool-drop")
				|| tgEl.hasClass("x-monthview-tool-add")) {
			tgEl.addClass("x-tool-btn-over");
			this.overEl = tgEl
		}
	},
	addLegend : function(pos) {
		var eh = this.ehandler;
		var epos = Ext.apply( {}, pos);
		this.selectRange(pos, epos);
		this.startPos = null;
		eh.prepareLegend(Ext.get(this.id
				+ "-x-monthview-viewer-title-" + pos.x + "-"
				+ pos.y), pos, epos, this)
	},
	_onPortClickFn : function(e) {
		var eh = this.ehandler;
		var target = e.getTarget();
		var tgEl = Ext.get(target);
		var titleEl;
		if (tgEl.hasClass("x-event-detail-tool-close")) {
			this.fireEvent("canceldetail")
		} else {
			if (tgEl.hasClass("x-monthview-viewer-link-b")) {
				var pos = this
						.getCellIndex(tgEl.dom.parentNode.id);
				var day = this.daySet[pos.x * this.dayNum
						+ pos.y];
				this.fireEvent("viewDay", this, day)
			} else {
				if (!eh.readOnly) {
					if (tgEl.hasClass("x-monthview-tool-add")) {
						this.addLegend(this
								.getCellIndex(tgEl.dom.id))
					} else {
						if (tgEl
								.hasClass("x-monthview-tool-drop")) {
							this.showMenu(tgEl)
						} else {
							if (tgEl
									.hasClass("x-whole-title-b")) {
								titleEl = tgEl
							} else {
								titleEl = tgEl
										.parent(".x-whole-title-b")
							}
							if (titleEl) {
								var wEl = titleEl
										.parent(".x-whole-cover");
								if (wEl
										&& !wEl.bindEvent.locked) {
									eh.showEditor(wEl, this,
											"update")
								}
							} else {
								if (tgEl
										.hasClass("x-legend-title-b")) {
									titleEl = tgEl
								} else {
									titleEl = tgEl
											.parent(".x-legend-title-b")
								}
								if (titleEl) {
									var lEl = titleEl
											.parent(".x-legend-cover");
									if (lEl
											&& !lEl.bindEvent.locked) {
										eh.showEditor(lEl,
												this, "update")
									}
								}
							}
						}
					}
				}
			}
		}
	},
	initDetailCt : function() {
		var eh = this.ehandler;
		var html = eh.detailTpl.apply( {});
		this.detailCt = Ext.DomHelper.append(this.port, html,
				true);
		this.detailCt.setStyle("display", "none");
		this.detailTitle = this.detailCt
				.child(".x-event-detail-title-td");
		this.detailViewer = this.detailCt
				.child(".x-event-detail-viewer");
		this.detailFoot = this.detailCt
				.child(".x-event-detail-foot-text")
	},
	initSelectCover : function() {
		this.scovers = [];
		for ( var i = 0, len = this.templateRowNum; i < len; i++) {
			var div = document.createElement("div");
			div.className = "x-event-select-cover";
			div = Ext.get(div);
			var row = Ext.get(this.port.dom.childNodes[i]);
			row.appendChild(div);
			this.scovers[this.scovers.length] = div
		}
	},
	initDragZone : function(bindEl) {
		var proxy = new Ext.dd.StatusProxy( {
			dropNotAllowed :"x-dd-drop-ok"
		});
		bindEl.dragzone = new Ext.dd.DragZone(
				bindEl,
				{
					ddGroup :"x-mycalendar",
					proxy :proxy,
					cview :this,
					onStartDrag : function() {
						this.cview.dragging = true;
						( function() {
							var event = this.dragData.bindEvent;
							var arr = Ext.DomQuery.select(
									"div[name=x-event-"
											+ event.day + "-"
											+ event.eday + "-"
											+ event.eventId
											+ "]",
									this.cview.body.dom);
							for ( var i = 0, len = arr.length; i < len; i++) {
								var eEl = Ext.get(arr[i]);
								eEl.setOpacity(0.3)
							}
						}).defer(1, this)
					},
					getDragData : function(e) {
						var target = e.getTarget();
						var tgEl = Ext.get(target);
						if (!tgEl.hasClass("x-calendar-event")) {
							tgEl = tgEl
									.parent(".x-calendar-event")
						}
						if (tgEl) {
							var event = tgEl.bindEvent;
							if (!event.locked) {
								var ddel = tgEl.dom
										.cloneNode(true);
								var w = tgEl.getWidth();
								if (200 < w) {
									ddel.style.width = "200px"
								} else {
									ddel.style.width = w + "px"
								}
								return {
									ddel :ddel,
									bindEvent :event
								}
							}
						}
						return false
					},
					getRepairXY : function(e, data) {
						return null
					},
					onDrag : function(e) {
						var event = this.dragData.bindEvent;
						var cview = this.cview;
						var eh = cview.ehandler;
						var span = Ext.ux.calendar.Mask
								.getDayOffset(event.day,
										event.eday);
						var pos = cview.calculatePos(e);
						var epos = cview.addSpan2Pos(pos, span);
						cview.selectRange(pos, epos)
					},
					endDrag : function(e) {
						var cview = this.cview;
						var event = this.dragData.bindEvent;
						var oldevent = Ext.apply( {}, event);
						var oevent;
						if (event.day == event.eday
								&& (0 != event.startRow || cview.rowCount != event.endRow)) {
							oevent = Ext.apply( {}, event)
						}
						var spos = cview.startPos;
						var eh = cview.ehandler;
						var dnum = Ext.ux.calendar.Mask
								.getDayOffset(event.day,
										event.eday);
						if (cview.colNum != cview.shiftDay
								&& 1 != eh.startDay) {
							spos.y++
						}
						var index = spos.x * cview.shiftDay
								+ spos.y;
						var date = cview.daySet[index];
						var day = date.format("Y-m-d");
						if (event.day != day) {
							event.eday = date.add(Date.DAY,
									dnum).format("Y-m-d");
							event.day = day;
							if ("string" == Ext
									.type(event.repeatType)) {
								eh.updateEvent(event, cview,
										null, oevent)
							} else {
								event.repeatType = "exception";
								eh.updateRepeatEvent(event,
										cview, oldevent)
							}
						} else {
							var arr = Ext.DomQuery.select(
									"div[name=x-event-"
											+ event.day + "-"
											+ event.eday + "-"
											+ event.eventId
											+ "]",
									this.cview.body.dom);
							for ( var i = 0, len = arr.length; i < len; i++) {
								var eEl = Ext.get(arr[i]);
								eEl.setOpacity(1)
							}
						}
						cview.dragging = false;
						cview.resetSCover();
						cview.fireEvent("canceldetail")
					}
				})
	},
	addSpan2Pos : function(pos, span) {
		var o = Ext.apply( {}, pos);
		o.y += span;
		var x = Math.floor(o.y / this.dayNum);
		o.y = o.y % this.shiftDay;
		o.x += x;
		if (o.x >= this.weekNum) {
			o.x = this.weekNum - 1;
			o.y = this.colNum - 1
		}
		if (o.y >= this.colNum) {
			o.y = this.colNum - 1
		}
		return o
	},
	viewWeekend : function(display) {
		if (1 == this.startDay) {
			Ext.util.CSS.updateRule("." + this.id
					+ "-x-monthview-viewer-col-6", "display",
					display);
			Ext.util.CSS.updateRule("." + this.id
					+ "-x-monthview-viewer-col-5", "display",
					display)
		} else {
			Ext.util.CSS.updateRule("." + this.id
					+ "-x-monthview-viewer-col-0", "display",
					display);
			Ext.util.CSS.updateRule("." + this.id
					+ "-x-monthview-viewer-col-6", "display",
					display)
		}
	},
	recalculateSize : function(bw, bh) {
		if (typeof bw == "number") {
			this.cheader.setWidth(bw);
			bw -= this.leftWidth;
			this.port.setWidth(bw);
			if (7 == this.colNum) {
				this.viewWeekend("")
			} else {
				if (5 == this.colNum) {
					this.viewWeekend("none")
				}
			}
			this.cw = bw / this.colNum
		}
		if (typeof bh == "number") {
			var ah = bh - this.cheader.getHeight();
			this.ch = ah / this.rowNum;
			var th = Ext.get(
					this.id + "-x-monthview-viewer-title-0-1")
					.getHeight();
			this.lineNum = Math.floor((this.ch - th)
					/ this.legendHeight);
			Ext.util.CSS.updateRule("." + this.id
					+ "-x-monthview-row", "height", Math
					.ceil(this.ch)
					+ "px")
		}
	},
	handleResize : function(bw, bh) {
		var oldLineNum = this.lineNum;
		this.recalculateSize(bw, bh);
		if (oldLineNum != this.lineNum) {
			this.showCache()
		}
		this.alignDetailCt();
		this.fireEvent("afterresize", this, bw, bh)
	},
	checkCSHide : function(cs) {
		var eh = this.ehandler;
		var ecs = eh.calendarSet;
		var flag = false;
		for ( var p in ecs) {
			var ec = ecs[p];
			var c = cs[p];
			if (ec && c) {
				if (false === ec.hide && false !== c.hide) {
					flag = true;
					break
				}
			}
		}
		return flag
	},
	showCache : function(startDate, endDate, force, refresh) {
		var eh = this.ehandler;
		startDate = startDate || this.daySet[0];
		endDate = endDate
				|| this.daySet[this.daySet.length - 1];
		if (eh.isInDayCache(startDate, endDate) && !refresh) {
			var glayout = eh.calendarLayout;
			for ( var i = 0, len = this.weekNum; i < len; i++) {
				var eventSet = {};
				for ( var j = 0, count = this.dayNum; j < count; j++) {
					var index = i * this.dayNum + j;
					var day = this.daySet[index]
							.format("Y-m-d");
					var layout = glayout.getLayout(day, this);
					var rs = layout.reLayout();
					eventSet[day] = rs.wlist.concat(rs.elist)
				}
				var tbody = Ext.get(this.id
						+ "-x-monthview-ct-" + i).dom.firstChild;
				glayout
						.showWeek(this, tbody, i, eventSet,
								true)
			}
			return true
		}
		return false
	},
	checkLayout : function(force, refresh) {
		var eh = this.ehandler;
		var startDate = this.daySet[0];
		var endDate = this.daySet[this.daySet.length - 1];
		if (!this.showCache(startDate, endDate, force, refresh)) {
			this.fireEvent("beforeremoteload");
			eh.ds.loadEvent(startDate, endDate, function(
					eventSet) {
				this.showEvents(eventSet, refresh);
				eh.pushDayCache(startDate, endDate);
				this.fireEvent("remoteload")
			}, this)
		}
		this.setToday()
	},
	showEvents : function(eventSet, refresh) {
		var eh = this.ehandler;
		var glayout = eh.calendarLayout;
		glayout.updateWholeList(eventSet.whole, "add");
		for ( var i = 0; i < this.weekNum; i++) {
			var tbody = Ext.get(this.id + "-x-monthview-ct-"
					+ i).dom.firstChild;
			glayout.showWeek(this, tbody, i, eventSet)
		}
	},
	onAddFn : function(item) {
		var menu = item.parentMenu;
		var pos = this.getCellIndex(menu.bindEl.dom.id);
		this.addLegend(pos)
	},
	onClearFn : function(item) {
		var menu = item.parentMenu;
		var pos = this.getCellIndex(menu.bindEl.dom.id);
		this.clearLegend(pos)
	},
	setCutStatus : function(pos) {
		var x = pos.x, y = pos.y;
		var cEl = Ext.get(this.id + "-x-monthview-viewer-" + x
				+ "-" + y);
		if (cEl) {
			cEl.addClass("x-monthview-cell-cut")
		}
		var tEl = Ext.get(this.id
				+ "-x-monthview-viewer-title-" + x + "-" + y);
		if (tEl) {
			tEl.addClass("x-monthview-cell-cut")
		}
		var eh = this.ehandler;
		eh.commentTip
				.showTip(
						"Notice",
						"Cross-day event and repeat event can not be cut/copied!",
						tEl, "bl-tl?")
	},
	resetCutStatus : function(pos) {
		var x = pos.x, y = pos.y;
		var cEl = Ext.get(this.id + "-x-monthview-viewer-" + x
				+ "-" + y);
		if (cEl) {
			cEl.removeClass("x-monthview-cell-cut")
		}
		var tEl = Ext.get(this.id
				+ "-x-monthview-viewer-title-" + x + "-" + y);
		if (tEl) {
			tEl.removeClass("x-monthview-cell-cut")
		}
	},
	onCutFn : function(item) {
		var menu = item.parentMenu;
		var pos = this.getCellIndex(menu.bindEl.dom.id);
		var x = pos.x, y = pos.y;
		var index = x * this.dayNum + y;
		var day = this.daySet[index].format("Y-m-d");
		if (this.cpFlag) {
			this.resetCutStatus(this.cpFlag.pos)
		}
		this.setCutStatus(pos);
		this.cpFlag = {
			day :day,
			keep :false,
			pos :pos
		}
	},
	onCopyFn : function(item) {
		var menu = item.parentMenu;
		var pos = this.getCellIndex(menu.bindEl.dom.id);
		var index = pos.x * this.dayNum + pos.y;
		var day = this.daySet[index].format("Y-m-d");
		if (this.cpFlag) {
			this.resetCutStatus(this.cpFlag.pos)
		}
		this.setCutStatus(pos);
		this.cpFlag = {
			day :day,
			keep :true,
			pos :pos
		}
	},
	onPasteFn : function(item) {
		if (this.cpFlag) {
			var keep = this.cpFlag.keep;
			var menu = item.parentMenu;
			var pos = this.getCellIndex(menu.bindEl.dom.id);
			var index = pos.x * this.dayNum + pos.y;
			var tday = this.daySet[index].format("Y-m-d");
			var eh = this.ehandler;
			var oday = this.cpFlag.day;
			eh.ds.changeDay(oday, tday, function(backObj) {
				var gLayout = eh.calendarLayout;
				var wlist = gLayout
						.deleteDayFromWholeList(
								oday, oday,
								keep);
				var olayout = gLayout
						.getLayout(oday, this);
				var olist = [], elist = olayout
						.reLayout(null, true).elist;
				var orlist = [];
				for ( var i = 0, len = elist.length; i < len; i++) {
					var e = elist[i];
					if ("string" == Ext
							.type(e.repeatType)) {
						olist.push(Ext.apply(
								{}, e))
					} else {
						orlist.push(Ext.apply(
								{}, e))
					}
				}
				if (backObj && backObj.backids) {
					var bids = backObj.backids;
					for ( var i = 0, len = wlist.length; i < len; i++) {
						var w = wlist[i];
						if (bids[w.eventId]) {
							w.eventId = bids[w.eventId]
						}
					}
					for ( var i = 0, len = olist.length; i < len; i++) {
						var e = olist[i];
						if (bids[e.eventId]) {
							e.eventId = bids[e.eventId]
						}
					}
				}
				for ( var i = 0, len = wlist.length; i < len; i++) {
					var w = wlist[i];
					w.day = tday;
					w.eday = tday
				}
				gLayout.updateWholeList(wlist,
						"add");
				for ( var i = 0, len = olist.length; i < len; i++) {
					var e = olist[i];
					e.day = tday;
					e.eday = tday
				}
				var tlayout = gLayout
						.getLayout(tday, this);
				elist = tlayout.reLayout(null,
						true).elist;
				elist = gLayout.combine2List(
						elist, olist);
				tlayout.layouted = false;
				tlayout.generateLayout(elist,
						true, null, true);
				if (!keep) {
					olayout.layouted = false;
					olayout.generateLayout(
							orlist, true, null,
							true)
				}
				this.checkLayout();
				eh.fireEvent("changeEventCache", eh);
			}, this, keep);
			if (!keep) {
				this.resetCutStatus(this.cpFlag.pos);
				delete (this.cpFlag)
			}
		}
	},
	clearLegend : function(pos) {
		var eh = this.ehandler;
		var cs = eh.calendarSet;
		var gLayout = eh.calendarLayout;
		var index = pos.x * this.dayNum + pos.y;
		var day = this.daySet[index].format("Y-m-d");
		eh.ds.deleteDay(day, function() {
			gLayout.deleteDayFromWholeList(day);
			var layout = gLayout.getLayout(day, this);
			if (layout) {
				layout.layouted = false;
				layout.updateRepeat = true;
				layout.generateLayout( [], true, null, true)
			}
			this.checkLayout(true);
			eh.fireEvent("changeEventCache", eh)
		}, this)
	},
	resizePort :Ext.emptyFn,
	refreshDate : function() {
		var week = this.daySet[0].getWeekOfYear();
		for ( var i = 0; i < this.weekNum; i++) {
			for ( var j = 0; j < this.dayNum; j++) {
				var titleEl = Ext.get(this.id
						+ "-x-monthview-viewer-link-" + i + "-"
						+ j);
				if (titleEl) {
					var day = this.daySet[i * this.dayNum + j]
							.format(this.dayFormat);
					titleEl.dom.innerHTML = '<b class="x-monthview-viewer-link-b">'
							+ day + "</b>"
				}
			}
			var weekEl = Ext.get(this.id + "-x-monthview-week-"
					+ i + "-0");
			var w = (week + i) % 53;
			if (0 == w) {
				w = 53
			}
			weekEl.dom.innerHTML = w
		}
	},
	resetView : function(callback, scope, params) {
		this.refreshDate();
		this.setToday()
	},
	cleanup : function(w) {
		var fn = ( function(w) {
			var El = Ext.get(this.id + "-x-monthview-ct-" + w);
			if (El) {
				var tbody = El.dom.firstChild;
				var arr = [];
				for ( var i = 1, len = tbody.childNodes.length; i < len; i++) {
					arr.push(tbody.childNodes[i])
				}
				for ( var i = 0, len = arr.length; i < len; i++) {
					Ext.get(arr[i]).remove()
				}
			}
		}).createDelegate(this);
		if (false == Ext.type(w)) {
			for ( var i = 0; i < this.templateRowNum; i++) {
				fn(i)
			}
		} else {
			fn(w)
		}
	},
	locateDay : function(day) {
		var fd = day.getFirstDateOfMonth();
		this.recalculateWeek(fd);
		this.recalculateSize(this.body.getWidth(), this.body
				.getHeight());
		fd = this.getStartDate(fd);
		this.daySet = [];
		for ( var i = 0; i < this.weekNum; i++) {
			for ( var j = 0; j < this.dayNum; j++) {
				var offset = i * this.shiftDay + j;
				this.daySet[this.daySet.length] = fd.add(
						Date.DAY, offset)
			}
		}
	},
	showDay : function(day) {
		this.locateDay(day);
		this.resetView();
		this.checkLayout(true)
	},
	recalculateWeek : function(fdate) {
		if (1 == this.startDay) {
			var n = fdate.format("N");
			if (7 == n && 30 <= fdate.getDaysInMonth()) {
				this.rowNum = 6
			} else {
				if (6 == n && 31 == fdate.getDaysInMonth()) {
					this.rowNum = 6
				} else {
					if (1 == n && 28 == fdate.getDaysInMonth()) {
						this.rowNum = 4
					} else {
						this.rowNum = 5
					}
				}
			}
		} else {
			var w = fdate.format("w");
			if (6 == w && 30 <= fdate.getDaysInMonth()) {
				this.rowNum = 6
			} else {
				if (5 == w && 31 == fdate.getDaysInMonth()) {
					this.rowNum = 6
				} else {
					if (0 == n && 28 == fdate.getDaysInMonth()) {
						this.rowNum = 4
					} else {
						this.rowNum = 5
					}
				}
			}
		}
		this.weekNum = this.rowNum
	},
	goBack : function() {
		var shiftDay = this.shiftDay || this.dayNum;
		var dayNum = this.dayNum;
		var sdate = this.daySet[0];
		var fdate = sdate.getFirstDateOfMonth();
		if (sdate.format("Y-m-d") == fdate.format("Y-m-d")) {
			fdate = fdate.add(Date.DAY, -1);
			fdate = fdate.getFirstDateOfMonth()
		}
		this.recalculateWeek(fdate);
		fdate = this.getStartDate(fdate);
		var weekNum = this.weekNum;
		this.daySet = [];
		for ( var i = 0; i < weekNum; i++) {
			for ( var j = 0; j < dayNum; j++) {
				this.daySet[this.daySet.length] = fdate.add(
						Date.DAY, i * shiftDay + j)
			}
		}
		this.resetView();
		this.recalculateSize(this.body.getWidth(), this.body
				.getHeight());
		this.checkLayout(true)
	},
	goNext : function() {
		var shiftDay = this.shiftDay || this.dayNum;
		var dayNum = this.dayNum;
		var edate = this.daySet[this.daySet.length - 1];
		var fdate = edate.getLastDateOfMonth();
		if (edate.format("Y-m-d") == fdate.format("Y-m-d")) {
			fdate = fdate.add(Date.DAY, 1)
		} else {
			fdate = edate.getFirstDateOfMonth()
		}
		this.recalculateWeek(fdate);
		fdate = this.getStartDate(fdate);
		this.daySet = [];
		var weekNum = this.weekNum;
		for ( var i = 0; i < weekNum; i++) {
			for ( var j = 0; j < dayNum; j++) {
				this.daySet[this.daySet.length] = fdate.add(
						Date.DAY, i * shiftDay + j)
			}
		}
		this.resetView();
		this.recalculateSize(this.body.getWidth(), this.body
				.getHeight());
		this.checkLayout(true)
	},
	isShift : function(startDate, endDate) {
		var maxmin, minmax;
		var day1 = startDate.format("Y-m-d");
		var day2 = this.daySet[0].format("Y-m-d");
		if (day1 < day2) {
			maxmin = day2
		} else {
			maxmin = day1
		}
		day1 = endDate.format("Y-m-d");
		day2 = this.daySet[this.daySet.length - 1]
				.format("Y-m-d");
		if (day1 > day2) {
			minmax = day2
		} else {
			minmax = day1
		}
		if (maxmin > minmax) {
			var sdate = startDate.getFirstDateOfMonth();
			this.recalculateWeek(sdate);
			sdate = this.getStartDate(sdate);
			this.daySet = [];
			for ( var i = 0; i < this.weekNum; i++) {
				for ( var j = 0; j < this.dayNum; j++) {
					this.daySet[this.daySet.length] = sdate
							.add(Date.DAY, i * this.shiftDay
									+ j)
				}
			}
			return true
		} else {
			return false
		}
	},
	showRange : function(startDate, endDate) {
		var force = false;
		if (this.isShift(startDate, endDate)) {
			this.resetView();
			force = true
		}
		this.recalculateSize(this.body.getWidth(), this.body
				.getHeight());
		this.checkLayout(force)
	}
});
Ext.ns("Ext.ux.calendar");
Ext.ux.calendar.ResultView = function(config) {
	Ext.apply(this, config);
	this.ehandler.applyCalendarSetting(this);
	this.pageSize = 20;
	// var lan = Ext.ux.calendar.Mask.ResultView;
	var lan = this.ehandler.lang.ResultView;
	// var store = Ext.ux.calendar.Mask.getEventStore(Ext.ux.calendar.CONST.searchURL);
	// var store = Ext.ux.calendar.Mask.getEventStore();
	var store = this.ehandler.ds.getSearchStore();
	var columns = [ {
		header :"",
		sortable :true,
		menuDisabled :true,
		width :20,
		dataIndex :"calendarId",
		renderer :this.hiddenRenderFn.createDelegate(this)
	}, {
		header :"",
		sortable :true,
		menuDisabled :true,
		width :20,
		dataIndex :"locked",
		renderer :this.lockedRenderFn.createDelegate(this)
	}, {
		header :lan["cm.time"],
		dataIndex :"ymd",
		sortable :true,
		width :140,
		renderer :this.fromtoRenderFn.createDelegate(this)
	}, {
		header :lan["cm.calendar"],
		sortable :true,
		menuDisabled :true,
		width :100,
		dataIndex :"calendarId",
		renderer :this.calendarRenderFn.createDelegate(this)
	}, {
		header :lan["cm.subject"],
		sortable :true,
		width :120,
		dataIndex :"subject",
		renderer :this.subjectRenderFn
	}, {
		header :lan["cm.content"],
		sortable :true,
		width :120,
		dataIndex :"description",
		renderer :this.contentRenderFn.createDelegate(this)
	}, {
		header :lan["cm.expire"],
		sortable :true,
		menuDisabled :true,
		width :80,
		renderer :this.expireRenderFn.createDelegate(this)
	} ];
	this.groupBtn = new Ext.Button( {
		iconCls :"icon-sys-calendar-group",
		text :lan["groupBtn.group.text"],
		handler :this.onGroupFn,
		scope :this
	});
	this.returnBtn = new Ext.Button( {
		iconCls :"icon-sys-calendar-door_out",
		text :lan["returnBtn.text"],
		handler :this.onReturnFn,
		scope :this
	});
	var pbar = new Ext.PagingToolbar( {
		pageSize :this.pageSize,
		store :store
	});
	pbar.on("render", this.onPageToolbarRenderFn, this);
	this.list = new Ext.grid.GridPanel( {
		border :false,
		store :store,
		columns :columns,
		view :new Ext.grid.GroupingView( {
			forceFit :true
		}),
		loadMask : {
			msg :lan["loadMask.msg"]
		},
		bbar :pbar
	});
	Ext.ux.calendar.ResultView.superclass.constructor.call(this, {
		layout :"fit",
		items : [ this.list ]
	});
	this.on("render", this.onRenderFn, this);
	this.list.on("rowdblclick", this.onRowDblClickFn, this);
	this.list.on("rowclick", this.onRowClickFn, this);
	store.on("beforeload", this.onBeforeLoadFn, this);
	store.on("load", this.onLoadFn, this);
	store.clearGrouping()
};
Ext.extend(Ext.ux.calendar.ResultView,Ext.ux.calendar.BasicView,{
	onBeforeLoadFn : function(store) {
		store.removeAll()
	},
	onLoadFn : function(store, rds, options) {
		for ( var i = 0, len = rds.length; i < len; i++) {
			var rd = rds[i];
			var rt = rd.data.repeatType;
			if ("no" != rt && "exception" != rt) {
				rd.data.repeatType = Ext.decode(rt)
			}
		}
	},
	onGroupFn : function(btn) {
		// var lan = Ext.ux.calendar.Mask.ResultView;
		var lan = this.ehandler.lang.ResultView;
		var store = this.list.getStore();
		if (lan["groupBtn.group.text"] == btn.getText()) {
			btn.setText(lan["groupBtn.unGroup.text"]);
			btn.setIconClass("icon-sys-calendar-ungroup");
			store.groupBy("ymd")
		} else {
			btn.setText(lan["groupBtn.group.text"]);
			btn.setIconClass("icon-sys-calendar-group");
			store.clearGrouping()
		}
	},
	onReturnFn : function() {
		var calendarContainer = this.ownerCt;
		calendarContainer.getLayout().setActiveItem(
				calendarContainer.currentIdx);
		calendarContainer.currentView.checkLayout(true)
	},
	onRenderFn : function(p) {
		p.port = p.body
	},
	onPageToolbarRenderFn : function(t) {
		t.add("->", this.groupBtn, "-", this.returnBtn)
	},
	onRowClickFn : function(grid, rowIndex, e) {
		var target = e.getTarget();
		var tgEl = Ext.get(target);
		var eh = this.ehandler;
		var store = grid.getStore();
		var rd = store.getAt(rowIndex);
		var event = {
			eventId :rd.data.id,
			calendarId :rd.data.calendarId,
			startRow :parseInt(rd.data.startRow),
			endRow :parseInt(rd.data.endRow),
			subject :rd.data.subject,
			content :rd.data.description,
			day :rd.data.ymd,
			eday :rd.data.eymd,
			isShared :rd.data.isShared,
			alertFlag :rd.data.alertFlag,
			repeatType :rd.data.repeatType
		};
		var oevent = Ext.apply( {}, event);
		if (tgEl.hasClass("x-calendar-resultview-lock")) {
			if (tgEl.hasClass("icon-sys-calendar-event_lock")) {
				tgEl
						.removeClass("icon-sys-calendar-event_lock");
				tgEl.addClass("icon-sys-calendar-event_unlock");
				rd.set("locked", false);
				event.locked = false
			} else {
				if (tgEl
						.hasClass("icon-sys-calendar-event_unlock")) {
					tgEl
							.removeClass("icon-sys-calendar-event_unlock");
					tgEl
							.addClass("icon-sys-calendar-event_lock");
					rd.set("locked", true);
					event.locked = true
				}
			}
			store.commitChanges();
			var cc = this.ownerCt;
			var cview = cc.currentView;
			if ("string" == Ext.type(rd.data.repeatType)) {
				eh.updateEvent(event, cview)
			} else {
				eh.updateRepeatEvent(event, cview, oevent)
			}
		}
	},
	onRowDblClickFn : function(grid, rowIndex, e) {
		var cc = this.ownerCt;
		var cview = cc.currentView;
		var eh = this.ehandler;
		var store = grid.getStore();
		var rd = store.getAt(rowIndex);
		if (!rd.data.locked) {
			var rowEl = grid.getView().getRow(rowIndex);
			if (rowEl) {
				rowEl = Ext.get(rowEl);
				rowEl.bindEvent = {
					eventId :rd.data.id,
					calendarId :rd.data.calendarId,
					startRow :parseInt(rd.data.startRow),
					endRow :parseInt(rd.data.endRow),
					subject :rd.data.subject,
					content :rd.data.description,
					day :rd.data.ymd,
					eday :rd.data.eymd,
					isShared :rd.data.isShared,
					alertFlag :rd.data.alertFlag,
					locked :rd.data.locked,
					repeatType :rd.data.repeatType
				};
				rowEl.cview = cview;
				var obj = {
					bindEl :rowEl,
					cview :this,
					onLayout : function(event) {
						rd.set("calendarId", event.calendarId);
						rd.set("subject", event.subject);
						rd.set("description", event.content);
						rd.set("ymd", event.day);
						rd.set("eymd", event.eday);
						rd.set("isShared", event.isShared);
						rd.set("alertFlag", event.alertFlag);
						rd.set("locked", event.locked);
						rd.set("repeatType", event.repeatType);
						store.commitChanges()
					},
					action :"update"
				};
				eh.editor.fireEvent("showdetailsetting", obj)
			}
		}
	},
	calendarRenderFn : function(value, meta, rd, row, col,
			store) {
		var legendStyle = "height:9px;";
		var calendarId = rd.data.calendarId;
		var eh = this.ehandler;
		var calendar = eh.calendarSet[calendarId];
		var html = eh.calendarTpl.apply( {
			calendarId :calendar.id,
			"legend-style" :legendStyle,
			title :calendar.name,
			color :calendar.color
		});
		return html
	},
	fromtoRenderFn : function(value, meta, rd, row, col, store) {
		var data = rd.data;
		data.startRow = Ext.ux.calendar.Mask.getRowFromHM(
				rd.data.startTime, this.intervalSlot);
		data.endRow = Ext.ux.calendar.Mask.getRowFromHM(
				rd.data.endTime, this.intervalSlot);
		data.day = data.ymd;
		data.eday = data.eymd;
		var html = this.ehandler.generateInfo(data);
		return html
	},
	subjectRenderFn : function(value, meta, rd, row, col, store) {
		var html = value || "";
		if ("" == html.trim()) {
			//html = Ext.ux.calendar.Mask.ResultView.noSubject
			html = this.ehandler.lang.ResultView.noSubject;
		}
		return html
	},
	contentRenderFn : function(value, meta, rd, row, col, store) {
		var html = value || "";
		if ("" == html.trim()) {
			// html = Ext.ux.calendar.Mask.ResultView.noContent
			html = this.ehandler.lang.ResultView.noContent;
		}
		return html
	},
	generateExpireHTML : function(data) {
		// var lan = Ext.ux.calendar.Mask.ResultView;
		var lan = this.ehandler.lang.ResultView;
		var hour = data.hour;
		var html;
		if (-1 == hour) {
			html = '<div style="border:1px solid silver;height:20px;line-height:20px;background:rgb(231,231,231);text-align:center;"><b>Out of date</b></div>'
		} else {
			if (0 <= hour && hour <= 24) {
				html = '<div style="border:1px solid silver;height:20px;line-height:20px;background:rgb(249,66,51);text-align:center;"><b>'
						+ hour + " " + lan.hour + "</b></div>"
			} else {
				if (24 < hour && hour <= 72) {
					html = '<div style="border:1px solid silver;height:20px;line-height:20px;background:rgb(255,255,164);text-align:center;"><b>'
							+ hour
							+ " "
							+ lan.hour
							+ "</b></div>"
				} else {
					if (72 < hour) {
						html = '<div style="border:1px solid silver;height:20px;line-height:20px;background:rgb(147,250,97);text-align:center;"><b>'
								+ hour
								+ " "
								+ lan.hour
								+ "</b></div>"
					}
				}
			}
		}
		return html
	},
	expireRenderFn : function(value, meta, rd, row, col, store) {
		var endRow = Ext.ux.calendar.Mask.getRowFromHM(
				rd.data.endTime, this.intervalSlot);
		var str = rd.data.ymd + " " + rd.data.endTime;
		var day = Date.parseDate(str, "Y-m-d H:i");
		if (this.rowCount == endRow) {
			day = day.add(Date.DAY, 1);
			str = day.format("Y-m-d H:i")
		}
		var offset = day.getElapsed();
		if ((new Date()).format("Y-m-d H:i") >= str) {
			return this.generateExpireHTML( {
				hour :-1
			})
		} else {
			var hour = Math.round(offset / 3600000);
			return this.generateExpireHTML( {
				hour :hour
			})
		}
	},
	hiddenRenderFn : function(value, meta, rd, row, col, store) {
		var html;
		var cs = this.ehandler.calendarSet;
		if (cs[rd.data.calendarId].hide) {
			html = '<div class="x-resultview-event-hide"></div>'
		} else {
			html = '<div class="x-resultview-event-show"></div>'
		}
		return html
	},
	lockedRenderFn : function(value, meta, rd, row, col, store) {
		var html;
		if (rd.data.locked) {
			html = '<div class="x-calendar-resultview-lock icon-sys-calendar-event_lock"></div>'
		} else {
			html = '<div class="x-calendar-resultview-lock icon-sys-calendar-event_unlock"></div>'
		}
		return html
	},
	loadEvents : function(text) {
		var store = this.list.getStore();
		store.removeAll();
		this.matchText = text;
		store.baseParams = Ext.apply(store.baseParams,{
			text :text
		});
		store.load( {
			params : {
				start :0,
				limit :this.pageSize
			}
		})
	},
	checkLayout : function() {
		var store = this.list.getStore();
		store.reload()
	}
});
Ext.ns("Ext.util");
Ext.util.DatePicker = Ext.extend(Ext.DatePicker, {
	onRender : function(container, position) {
		Ext.util.DatePicker.superclass.onRender.call(this, container, position)
	},
	updateRange : function() {
		if (this.startDate && this.endDate) {
			var st = this.startDate.clearTime().getTime();
			var et = this.endDate.clearTime().getTime();
			this.cells.each( function(c) {
				var dt = c.dom.firstChild.dateValue;
				if (st <= dt && dt <= et) {
					c.addClass("x-date-selected")
				} else {
					c.removeClass("x-date-selected")
				}
			})
		}
	},
	setRange : function(startDate, endDate) {
		this.startDate = startDate;
		this.endDate = endDate
	},
	update : function(date, forceRefresh) {
		Ext.util.DatePicker.superclass.update.call(this, date, forceRefresh);
		this.updateRange()
	}
});
Ext.ns("Ext.util");
Ext.util.LabelField = Ext.extend(Ext.form.Field, {
	onRender : function(ct, position) {
		Ext.util.LabelField.superclass.onRender.call(this, ct, position);
		this.wrap = this.el.wrap( {
			cls :this.wrapClass
		});
		if (Ext.isIE) {
			this.wrap.setHeight(20)
		}
		this.el.addClass("x-hidden");
		this.labelEl = Ext.DomHelper.append(this.wrap,
				'<div style="padding-top:3px;"></div>', true);
		this.labelEl.dom.innerHTML = this.text
	},
	setText : function(v) {
		if (this.labelEl) {
			this.labelEl.dom.innerHTML = v
		} else {
			this.text = v
		}
	},
	getText : function() {
		return this.labelEl.dom.innerHTML
	}
});
Ext.ns("Ext.ux.calendar");
Ext.ux.calendar.WestPanel = function(config) {
	Ext.apply(this, config);
	var eh = this.ehandler;
	eh.applyCalendarSetting(this);
	this.ds = eh.ds;
	// var lan = Ext.ux.calendar.Mask.WestPanel;
	var lan = eh.lang.WestPanel;
	this.dateLabel = new Ext.form.Label( {
		html :"<b>" + (new Date()).format(this.fromtoFormat) + "</b>"
	});
	this.datePicker = new Ext.util.DatePicker( {
		value :new Date(),
		startDay :this.startDay
	});
	this.showAllBtn = new Ext.Button( {
		iconCls :"icon-sys-calendar-calendar_show",
		text :lan["myShowAllBtn.text"],
		handler :this.onShowAllFn,
		scope :this
	});
	this.addBtn = new Ext.Button( {
		iconCls :"icon-sys-calendar-add_calendar",
		text :lan["myAddBtn.text"],
		handler :this.onAddFn,
		scope :this
	});
	var bbar = [ this.showAllBtn, "->" ];
	if (!this.readOnly) {
		bbar.push(this.addBtn)
	}
	this.myCalendarPanel = new Ext.Panel({
		style :"padding-top:5px;",
		region :"center",
		iconCls :"icon-sys-calendar-calendar",
		title :lan["myCalendarPanel.title"],
		bodyStyle :"padding:2px;background-color:white;overflow-x:hidden;overflow-y:auto;position:relative;",
		bbar :bbar
	});
	this.myCalendarPanel.on("render", this.onMyCalendarRenderFn, this);
	this.formpanel = new Ext.form.FormPanel( {
		border :false,
		cls :"x-calendar-container",
		style :"padding:0px 10px 10px 12px;",
		layout :"border",
		items : [ {
			border :false,
			region :"north",
			height :230,
			style :"padding:5px 0px 0px 0px;",
			cls :"x-dayview-west-date-span",
			items : [ this.dateLabel, this.datePicker ]
		}, this.myCalendarPanel ]
	});
	Ext.ux.calendar.WestPanel.superclass.constructor.call(this, {
		border :false,
		cls :"x-calendar-west",
		collapsible :true,
		iconCls :"icon-sys-calendar-calendar",
		title :'日历面板',
		collapseMode :"mini",
		region :"west",
		minWidth :200,
		width :200,
		layout :"fit",
		items : [ this.formpanel ]
	});
	this.addEvents("changedate");
	this.dateLabel.on("render", this.onDateLabelRenderFn, this);
	this.datePicker.on("render", this.onDatePickerRenderFn, this);
	this.datePicker.on("select", this.onSelectFn, this);
	this.on("changedate", this.changeDateLabel, this);
};
Ext.extend(Ext.ux.calendar.WestPanel, Ext.Panel, {
	onOtherCalendarRenderFn : function(p) {
		var eh = this.ehandler;
		eh.renderSharedCalendar(p.body)
	},
	onShowAllFn : function() {
		this.ehandler.onShowAllFn()
	},
	onAddFn : function() {
		this.ehandler.ceditor.popup( {
			action :"add"
		})
	},
	onSelectFn : function(dp, date) {
		var calendarContainer = this.ownerCt.calendarContainer;
		calendarContainer.showDay(date)
	},
	onMyCalendarRenderFn : function(p) {
		var eh = this.ehandler;
		eh.renderOwnedCalendar(p.body)
	},
	changeDateLabel : function(fromDate, toDate) {
		this.updateDateLabel(fromDate, toDate);
		this.updateDatePicker(fromDate, toDate)
	},
	updateDateLabel : function(fromDate, toDate) {
		var to = toDate.format(this.fromtoFormat);
		var from = fromDate.format(this.fromtoFormat);
		var str = from;
		if (str !== to) {
			str += " - " + to;
		}
		this.dateLabel.getEl().dom.innerHTML = "<b>" + str + "</b>";
	},
	updateDatePicker : function(fromDate, toDate) {
		var from = fromDate.format(this.fromtoFormat);
		this.datePicker.setRange(fromDate, toDate);
		var dnum = Ext.ux.calendar.Mask.getDayOffset(fromDate, toDate);
		if (7 < dnum) {
			var fd = fromDate.getFirstDateOfMonth();
			var fday = fd.format("Y-m-d");
			from = fromDate.format("Y-m-d");
			if (from != fday) {
				fd = fromDate.getLastDateOfMonth().add(Date.DAY, 1)
			}
			this.datePicker.setValue(fd)
		} else {
			this.datePicker.setValue(fromDate)
		}
	},
	onDateLabelRenderFn : function() {
		var cview = this.ownerCt.calendarContainer.currentView;
		this.updateDateLabel(cview.daySet[0], cview.daySet[cview.daySet.length - 1]);
	},
	onDatePickerRenderFn : function() {
		var cview = this.ownerCt.calendarContainer.currentView;
		this.updateDatePicker(cview.daySet[0], cview.daySet[cview.daySet.length - 1]);
	}
});