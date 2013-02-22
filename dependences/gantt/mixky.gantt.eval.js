Ext.ns('Sch');
Sch.DependencyPainter = Ext.extend(Ext.util.Observable, {
    checkVisible: false,
    constructor: function (g, a) {
        a = a || {};
        this.grid = g;
        Ext.apply(this, a, {
            xOffset: 8,
            midRowOffset: 4,
            yOffset: 7,
            horizontalArrowWidthOffset: 8,
            horizontalArrowHeightOffset: 4,
            verticalArrowWidthOffset: 4,
            verticalArrowHeightOffset: 8,
            lineWidth: Ext.isBorderBox ? 2 : 0
        })
    },
    drawSingleDependency: function (a) {
        var b = this.grid.getElementFromEventId(a.get('To')),
            fromEl = this.grid.getElementFromEventId(a.get('From'));
        if (!b || !fromEl || (this.checkVisible && (!fromEl.isVisible(true) || !b.isVisible(true)))) {
            return
        }
        var c = a.get('Type');
        switch (c) {
        case Sch.Dependency.StartToEnd:
            this.drawStartToEnd(a.id, fromEl, b);
            break;
        case Sch.Dependency.StartToStart:
            this.drawStartToStart(a.id, fromEl, b);
            break;
        case Sch.Dependency.EndToStart:
            this.drawEndToStart(a.id, fromEl, b);
            break;
        case Sch.Dependency.EndToEnd:
            this.drawEndToEnd(a.id, fromEl, b);
            break;
        default:
            throw 'Invalid case statement';
            break
        }
    },
    drawEndToStart: function (a, b, c) {
        var d = b.getTop(),
            toTop = c.getTop(),
            container = d < toTop ? b : c,
            containerX = container.getX(),
            containerY = container.getY(),
            x1 = b.getRight() - containerX,
            y1 = d - containerY + this.yOffset,
            x2 = c.getLeft() - containerX,
            y2Top = toTop - containerY,
            y2 = y2Top + this.yOffset,
            y2offset = d < toTop ? (y2 - this.yOffset - this.midRowOffset) : (y2 + this.yOffset + this.midRowOffset);
        if (x2 >= (x1 - 6) && (c.getRight() - containerX > (x1 + 10)) && y2 > y1) {
            var e = Math.max(x1, x2) + this.xOffset;
            this.drawLines(container, a, [{
                x1: x1,
                y1: y1,
                x2: e,
                y2: y1
            }, {
                x1: e,
                y1: y1,
                x2: e,
                y2: y2Top - this.verticalArrowHeightOffset
            }, {
                x1: e - this.verticalArrowWidthOffset,
                y1: y2Top - this.verticalArrowHeightOffset,
                direction: 'down'
            }])
        } else {
            var e = x1 + this.xOffset + this.horizontalArrowWidthOffset;
            this.drawLines(container, a, [{
                x1: x1,
                y1: y1,
                x2: e,
                y2: y1
            }, {
                x1: e,
                y1: y1,
                x2: e,
                y2: y2offset
            }, {
                x1: e,
                y1: y2offset,
                x2: x2 - this.xOffset - this.horizontalArrowWidthOffset,
                y2: y2offset
            }, {
                x1: x2 - this.xOffset - this.horizontalArrowWidthOffset,
                y1: y2offset,
                x2: x2 - this.xOffset - this.horizontalArrowWidthOffset,
                y2: y2
            }, {
                x1: x2 - this.xOffset - this.horizontalArrowWidthOffset,
                y1: y2,
                x2: x2 - this.horizontalArrowWidthOffset,
                y2: y2
            }, {
                x1: x2 - this.horizontalArrowWidthOffset,
                y1: y2 - this.horizontalArrowHeightOffset,
                direction: 'right'
            }])
        }
    },
    drawStartToEnd: function (a, b, c) {
        var d = b.getTop(),
            toTop = c.getTop(),
            container = d < toTop ? b : c,
            containerX = container.getX(),
            containerY = container.getY(),
            x1 = b.getLeft() - containerX - 1,
            y1 = d - containerY + this.yOffset,
            x2 = c.getRight() - containerX,
            y2Top = toTop - containerY,
            y2 = y2Top + this.yOffset,
            y2offset = d < toTop ? (y2 - this.yOffset - this.midRowOffset) : (y2 + this.yOffset + this.midRowOffset);
        if (x2 > (x1 + this.xOffset - this.horizontalArrowWidthOffset) || Math.abs(x2 - x1) < (2 * (this.xOffset + this.horizontalArrowWidthOffset))) {
            var e = x1 - this.xOffset - this.horizontalArrowWidthOffset;
            this.drawLines(container, a, [{
                x1: x1,
                y1: y1,
                x2: e,
                y2: y1
            }, {
                x1: e,
                y1: y1,
                x2: e,
                y2: y2offset
            }, {
                x1: e,
                y1: y2offset,
                x2: x2 + this.xOffset + this.horizontalArrowWidthOffset,
                y2: y2offset
            }, {
                x1: x2 + this.xOffset + this.horizontalArrowWidthOffset,
                y1: y2offset,
                x2: x2 + this.xOffset + this.horizontalArrowWidthOffset,
                y2: y2
            }, {
                x1: x2 + this.xOffset + this.horizontalArrowWidthOffset,
                y1: y2,
                x2: x2 + this.horizontalArrowWidthOffset,
                y2: y2
            }, {
                x1: x2,
                y1: y2 - this.horizontalArrowHeightOffset,
                direction: 'left'
            }])
        } else {
            var e = x1 - this.xOffset - this.horizontalArrowWidthOffset;
            this.drawLines(container, a, [{
                x1: x1,
                y1: y1,
                x2: e,
                y2: y1
            }, {
                x1: e,
                y1: y1,
                x2: e,
                y2: y2
            }, {
                x1: e,
                y1: y2,
                x2: x2 + this.horizontalArrowWidthOffset,
                y2: y2
            }, {
                x1: x2,
                y1: y2 - this.horizontalArrowHeightOffset,
                direction: 'left'
            }])
        }
    },
    drawEndToEnd: function (a, b, c) {
        var d = b.getTop(),
            toTop = c.getTop(),
            container = d < toTop ? b : c,
            containerX = container.getX(),
            containerY = container.getY(),
            x1 = b.getRight() - containerX,
            y1 = d - containerY + this.yOffset,
            x2 = c.getRight() - containerX,
            y2Top = toTop - containerY,
            y2 = y2Top + this.yOffset,
            rightPointOffset = x2 + this.xOffset + this.horizontalArrowWidthOffset;
        if (x1 > (x2 + this.xOffset)) {
            rightPointOffset += x1 - x2
        }
        this.drawLines(container, a, [{
            x1: x1,
            y1: y1,
            x2: rightPointOffset,
            y2: y1
        }, {
            x1: rightPointOffset,
            y1: y1,
            x2: rightPointOffset,
            y2: y2
        }, {
            x1: rightPointOffset,
            y1: y2,
            x2: x2,
            y2: y2
        }, {
            x1: x2,
            y1: y2 - this.horizontalArrowHeightOffset,
            direction: 'left'
        }])
    },
    drawStartToStart: function (a, b, c) {
        var d = b.getTop(),
            toTop = c.getTop(),
            container = d < toTop ? b : c,
            containerX = container.getX(),
            containerY = container.getY(),
            x1 = b.getLeft() - containerX - 2,
            y1 = d - containerY + this.yOffset,
            x2 = c.getLeft() - containerX,
            y2Top = toTop - containerY,
            y2 = y2Top + this.yOffset,
            leftPointOffset = this.xOffset + this.horizontalArrowWidthOffset;
        if (x1 > (x2 + this.xOffset)) {
            leftPointOffset += (x1 - x2)
        }
        this.drawLines(container, a, [{
            x1: x1,
            y1: y1,
            x2: x1 - leftPointOffset,
            y2: y1
        }, {
            x1: x1 - leftPointOffset,
            y1: y1,
            x2: x1 - leftPointOffset,
            y2: y2
        }, {
            x1: x1 - leftPointOffset,
            y1: y2,
            x2: x2 - this.horizontalArrowWidthOffset,
            y2: y2
        }, {
            x1: x2 - this.horizontalArrowWidthOffset,
            y1: y2 - this.horizontalArrowHeightOffset,
            direction: 'right'
        }])
    },
    drawLines: function (a, b, c) {
        var d, y1, x2, y2, els = [];
        a = a.up('', 1);
        for (var i = 0, l = c.length; i < l; i++) {
            if (i === l - 1) {
                var e = Ext.DomHelper.createDom({
                    tag: 'div',
                    cls: String.format('sch-dependency sch-dep-{0} sch-dependency-arrow sch-dependency-arrow-{1}', b, c[i].direction),
                    style: {
                        left: c[i].x1 + "px",
                        top: c[i].y1 + "px"
                    }
                });
                els.push(e)
            } else {
                d = c[i].x1;
                x2 = c[i].x2;
                y1 = c[i].y1;
                y2 = c[i].y2;
                var f = Math.min(d, x2),
                    top = Math.min(y1, y2),
                    width = Math.abs(x2 - d) + this.lineWidth,
                    height = Math.abs(y2 - y1) + this.lineWidth,
                    el = Ext.DomHelper.createDom({
                        tag: 'div',
                        cls: String.format('sch-dependency sch-dep-{0} sch-dependency-line', b),
                        style: {
                            left: f + "px",
                            top: top + "px",
                            width: width + "px",
                            height: height + "px"
                        }
                    });
                els.push(el)
            }
        }
        a.appendChild(els)
    }
});
Ext.ns('Sch');
Sch.Dependency = {
    StartToStart: 0,
    StartToEnd: 1,
    EndToStart: 2,
    EndToEnd: 3
};
Sch.DependencyManager = Ext.extend(Ext.util.Observable, {
    cascadeDelay: 50,
    highlightDependency: function (a) {
        if (!(a instanceof Ext.data.Record)) {
            a = this.store.getById(a)
        }
        this.getElementsForDependency(a).addClass('sch-dependency-selected')
    },
    unhighlightDependency: function (a) {
        if (!(a instanceof Ext.data.Record)) {
            a = this.store.getById(a)
        }
        this.getElementsForDependency(a).removeClass('sch-dependency-selected')
    },
    getElementsForDependency: function (a) {
        var b = a instanceof Ext.data.Record ? a.id : a;
        return this.containerEl.select('.sch-dep-' + b)
    },
    constructor: function (g, a) {
        a = a || {};
        Ext.apply(this, a);
        this.grid = g;
        g.getView().on({
            rowupdated: this.onRowUpdated,
            rowsinserted: this.renderDependencies,
            rowremoved: this.onRowDeleted,
            scope: this
        });
        this.eventStore = g.store;
        this.eventStore.on({
            update: this.onEventUpdated,
            beforewrite: this.onEventStoreBeforeWrite,
            write: this.onEventStoreWrite,
            scope: this
        });
        this.store.on({
            datachanged: this.renderDependencies,
            add: this.onDependencyAdd,
            update: this.onDependencyUpdate,
            remove: this.onDependencyDelete,
            beforewrite: this.onBeforeWrite,
            scope: this
        });
        this.painter = new Sch.DependencyPainter(g, a);
        if (this.enableDependencyDragDrop !== false) {
            this.dnd = new Sch.DependencyDragDrop(g);
            this.dnd.on('afterdnd', this.onArrowDrop, this)
        }
    },
    depRe: new RegExp('sch-dep-([^\\s]+)'),
    getRecordForDependencyEl: function (t) {
        var m = t.className.match(this.depRe),
            rec = null;
        if (m && m[1]) {
            var a = m[1];
            rec = this.store.getById(a)
        }
        return rec
    },
    renderDependencies: function () {
        this.containerEl.select('.sch-dependency').remove();
        if (this.eventStore.getCount() === 0) return;
        var a, l = this.store.getCount();
        for (var i = 0; i < l; i++) {
            a = this.store.getAt(i);
            this.painter.drawSingleDependency(a)
        }
    },
    renderEventDependencies: function (a) {
        var b, l = this.store.getCount();
        for (var i = 0; i < l; i++) {
            b = this.store.getAt(i);
            var c = b.get('To'),
                fromEventId = b.get('From');
            if (a == c || a == fromEventId) {
                this.painter.drawSingleDependency(b)
            }
        }
    },
    onEventStoreBeforeWrite: function (s, a, b) {
        if (!Ext.isArray(b)) {
            b = [b]
        }
        if (a === Ext.data.Api.actions.create) {
            Ext.each(b, function (r) {
                r._phantomId = r.id
            })
        }
    },
    onEventStoreWrite: function (s, b, c, t, d) {
        if (!Ext.isArray(d)) {
            d = [d]
        }
        var e, to;
        if (b === Ext.data.Api.actions.create) {
            Ext.each(d, function (r) {
                this.store.queryBy(function (a) {
                    e = a.get('From');
                    to = a.get('To');
                    if (e === r._phantomId) {
                        a.set('From', r.id)
                    } else if (to === r._phantomId) {
                        a.set('To', r.id)
                    }
                })
            }, this)
        }
    },
    onDependencyUpdate: function (a, b) {
        if (b._phantomId) {
            this.getElementsForDependency(b._phantomId).remove();
            delete b._phantomId
        }
        this.painter.drawSingleDependency(b)
    },
    onDependencyAdd: function (a, b) {
        var c = b[0];
        this.painter.drawSingleDependency(c);
        if (this.grid.cascadeChanges) {
            this.constrainTask(this.eventStore.getById(c.get('To')))
        }
    },
    onDependencyDelete: function (a, b) {
        this.getElementsForDependency(b).fadeOut({
            remove: true
        })
    },
    dimEventDependencies: function (a) {
        this.containerEl.select(this.depRe + a).setOpacity(0.2)
    },
    onBeforeWrite: function (s, a, b) {
        if (!Ext.isArray(b)) {
            b = [b]
        }
        if (a === Ext.data.Api.actions.create) {
            Ext.each(b, function (r) {
                r._phantomId = r.id
            }, this)
        }
    },
    onRowUpdated: function (v, a, b) {
        if (!this.grid.cascadeChanges) {
            this.updateDependencies(b)
        }
    },
    onEventUpdated: function (d, e, f, g) {
        if (this.grid.cascadeChanges && g) {
            (function (c) {
                //this.eventStore.suspendEvents();
                this.store.each(function (a) {
                    if (a.get('From') == c) {
                        var b = this.eventStore.getById(a.get('To'));
                        if (!b) return;
                        this.performCascade(b)
                    }
                }, this);
                //this.eventStore.resumeEvents();
                this.grid.getView().refresh()
            }).defer(this.cascadeDelay, this, [e.id])
        }
    },
    updateDependencies: function (a) {
        var b = a.id;
        this.store.queryBy(function (r) {
            if (r.get('From') == b || r.get('To') == b) {
                this.containerEl.select('.sch-dep-' + r.id).remove()
            }
        }, this);
        this.renderEventDependencies(b)
    },
    onRowDeleted: function (a, b, c) {
        var d = c.id,
            toRemove = [];
        this.store.queryBy(function (r) {
            if (r.data.To == d || r.data.From == d) {
                toRemove.push(r)
            }
        });
        this.store.suspendEvents();
        this.store.remove(toRemove);
        this.store.resumeEvents();
        this.renderDependencies()
    },
    onArrowDrop: function (a, b, c, d) {
        if (b === c) return;
        var e = new this.store.recordType({
            From: b,
            To: c,
            Type: d
        });
        this.store.add(e)
    },
    getDependenciesForTask: function (a) {
        var b = a.id;
        return this.store.queryBy(function (r) {
            return r.get('From') == b || r.get('To') == b
        })
    },
    deleteDependency: function (a) {
        this.store.remove(this.store.getById(a))
    },
    performCascade: function (b) {
        var c = b.id;
        if (b.store.isLeafNode(b)) {
            this.constrainTask(b);
            this.grid.recalculateParents(b)
        }
        this.store.queryBy(function (a) {
            if (a.get('From') == c) {
                this.performCascade(b.store.getById(a.get('To')))
            }
        }, this)
    },
    constrainTask: function (a) {
        var b = this.eventStore,
            constrainContext = this.getConstrainContext(a);
        if (constrainContext) {
            a.beginEdit();
            a.set('StartDate', constrainContext.startDate);
            a.set('EndDate', constrainContext.endDate);
            a.endEdit()
        }
    },
    getCriticalPaths: function () {
        var a = this.eventStore.getCount();
        if (a <= 0) return [];
        var b = new Date(0);
        this.eventStore.each(function (t) {
            b = Date.max(t.get('EndDate'), b)
        });
        var c = this.eventStore.queryBy(function (t) {
            return b - t.get('EndDate') === 0
        }),
            cPaths = [];
        c.each(function (t) {
            cPaths.push(this.getCriticalPathsInternal(t))
        }, this);
        return cPaths
    },
    getCriticalPathsInternal: function (a) {
        var b = [a],
            ctx = this.getConstrainContext(a);
        while (ctx) {
            b.push(ctx.constrainingTask);
            ctx = this.getConstrainContext(ctx.constrainingTask)
        }
        return b
    },
    getConstrainContext: function (a) {
        var b = this.store.queryBy(function (r) {
            return r.get('To') === a.id
        });
        if (b.getCount() === 0) {
            return null
        }
        var c = this.eventStore,
            taskDuration = a.get('EndDate') - a.get('StartDate'),
            earliestStartDate = new Date(0),
            earliestEndDate = new Date(0),
            constrainingTask;
        b.each(function (d) {
            var t = c.getById(d.get('From'));
            switch (d.get('Type')) {
            case Sch.Dependency.StartToEnd:
                if (earliestEndDate < t.get('StartDate')) {
                    earliestEndDate = t.get('StartDate');
                    earliestStartDate = earliestEndDate.add(Date.MILLI, -taskDuration);
                    constrainingTask = t
                }
                break;
            case Sch.Dependency.StartToStart:
                if (earliestStartDate < t.get('StartDate')) {
                    earliestStartDate = t.get('StartDate');
                    earliestEndDate = earliestStartDate.add(Date.MILLI, taskDuration);
                    constrainingTask = t
                }
                break;
            case Sch.Dependency.EndToStart:
                if (earliestStartDate < t.get('EndDate')) {
                    earliestStartDate = t.get('EndDate');
                    earliestEndDate = earliestStartDate.add(Date.MILLI, taskDuration);
                    constrainingTask = t
                }
                break;
            case Sch.Dependency.EndToEnd:
                if (earliestEndDate < t.get('EndDate')) {
                    earliestEndDate = t.get('EndDate');
                    earliestStartDate = earliestEndDate.add(Date.MILLI, -taskDuration);
                    constrainingTask = t
                }
                break;
            default:
                throw 'Invalid case statement';
                break
            }
        });
        return {
            startDate: earliestStartDate,
            endDate: earliestEndDate,
            constrainingDate: earliestStartDate,
            constrainingTask: constrainingTask
        }
    }
});
Ext.ns('Sch');
Sch.DependencyDragDrop = function (g, a) {
    this.addEvents('beforednd', 'dndstart', 'afterdnd');
    this.grid = g;
    this.setupDragZone();
    this.setupDropZone();
    this.ddGroup = g.id + '-sch-dependency-dd';
    g.on('beforedestroy', this.cleanUp, this);
    Sch.DependencyDragDrop.superclass.constructor.call(this)
};
Ext.extend(Sch.DependencyDragDrop, Ext.util.Observable, {
    fromText: 'From: <strong>{0}</strong> {1}<br/>',
    toText: 'To: <strong>{0}</strong> {1}',
    startText: 'Start',
    endText: 'End',
    terminalSelector: '.sch-gantt-terminal',
    getItemDepth: 6,
    isValidDrop: function (a, b, c) {
        var d = true,
            dependencyStore = this.grid.dependencyStore;
        var e = function (r) {
            return a === b || r.get('From') === a && r.get('To') === b || r.get('To') === a && r.get('From') === b
        };
        if (dependencyStore.findBy(e) >= 0) {
            d = false
        }
        if (d && c) {
            d = this.findToTask(dependencyStore, b, a) < 0
        }
        return d
    },
    findToTask: function (a, b, c) {
        return a.findBy(function (r) {
            if (r.get('From') === b) {
                if (r.get('To') === c) {
                    return true
                } else {
                    return this.findToTask(a, r.get('To'), c) >= 0
                }
            }
        }, this)
    },
    cleanUp: function () {
        this.dragZone.destroy();
        this.dropZone.destroy()
    },
    setupDragZone: function () {
        var d = this,
            g = this.grid,
            v = g.getView(),
            terminalSelector = this.terminalSelector,
            dependencyStore = g.dependencyStore;
        this.dragZone = new Ext.dd.DragZone(v.scroller, {
            ddGroup: this.ddGroup,
            onStartDrag: function () {
                if (g.tip) {
                    g.tip.disable()
                }
                v.mainBody.addClass('sch-gantt-terminal-showall');
                d.fireEvent('dndstart', d)
            },
            getDragData: function (e) {
                var a = e.getTarget(terminalSelector, d.getItemDepth);
                if (a) {
                    if (d.fireEvent('beforednd', this, a, e) === false) {
                        return null
                    }
                    var b = !! a.className.match('sch-gantt-terminal-start'),
                        sourceEventRecord = g.getEventRecordFromElement(a);
                    var c = Ext.DomHelper.createDom({
                        tag: 'div',
                        cls: 'sch-dd-dependency',
                        children: [{
                            tag: 'span',
                            cls: 'sch-dd-dependency-from',
                            html: String.format(d.fromText, sourceEventRecord.get('Name'), b ? d.startText : d.endText)
                        }, {
                            tag: 'span',
                            cls: 'sch-dd-dependency-to',
                            html: String.format(d.toText, '', '')
                        }]
                    });
                    return {
                        fromId: sourceEventRecord.id,
                        isStart: b,
                        repairXY: Ext.fly(a).getXY(),
                        ddel: c
                    }
                }
                return false
            },
            afterRepair: function () {
                v.mainBody.removeClass('sch-gantt-terminal-showall');
                if (g.tip) {
                    g.tip.enable()
                }
                this.dragging = false;
                d.fireEvent('afterdnd', this)
            },
            getRepairXY: function () {
                return this.dragData.repairXY
            }
        })
    },
    setupDropZone: function () {
        var h = this,
            g = this.grid,
            v = g.getView(),
            store = g.store,
            terminalSelector = this.terminalSelector,
            dependencyStore = g.dependencyStore;
        this.dropZone = new Ext.dd.DropZone(v.mainBody, {
            ddGroup: this.ddGroup,
            getTargetFromEvent: function (e) {
                return e.getTarget(h.terminalSelector, h.getItemDepth)
            },
            onNodeEnter: function (a, b, e, c) {
                var d = a.className.match('sch-gantt-terminal-start');
                Ext.fly(a).addClass(d ? 'sch-gantt-terminal-start-drophover' : 'sch-gantt-terminal-end-drophover')
            },
            onNodeOut: function (a, b, e, c) {
                var d = a.className.match('sch-gantt-terminal-start');
                Ext.fly(a).removeClass(d ? 'sch-gantt-terminal-start-drophover' : 'sch-gantt-terminal-end-drophover')
            },
            onNodeOver: function (a, b, e, c) {
                var d = store.getAt(v.findRowIndex(a)),
                    targetId = d.id,
                    isTargetStart = a.className.match('sch-gantt-terminal-start'),
                    newText = String.format(h.toText, d.get('Name'), isTargetStart ? h.startText : h.endText);
                b.proxy.el.child('.sch-dd-dependency-to').update(newText);
                if (h.isValidDrop.call(h, c.fromId, targetId)) {
                    return this.dropAllowed
                } else {
                    return this.dropNotAllowed
                }
            },
            onNodeDrop: function (a, b, e, c) {
                var d, retVal = true;
                v.mainBody.removeClass('sch-gantt-terminal-showall');
                if (g.tip) {
                    g.tip.enable()
                }
                if (c.isStart) {
                    if (a.className.match('sch-gantt-terminal-start')) {
                        d = Sch.Dependency.StartToStart
                    } else {
                        d = Sch.Dependency.StartToEnd
                    }
                } else {
                    if (a.className.match('sch-gantt-terminal-start')) {
                        d = Sch.Dependency.EndToStart
                    } else {
                        d = Sch.Dependency.EndToEnd
                    }
                }
                var f = g.getEventRecordFromElement(a),
                    targetId = f.id;
                retVal = h.isValidDrop.call(h, c.fromId, targetId, true);
                if (retVal) {
                    h.fireEvent('afterdnd', this, c.fromId, f.id, d)
                }
                return retVal
            }
        })
    }
});
Ext.ns('Sch.gantt.plugins');
Sch.gantt.plugins.Resize = function (a) {
    Ext.apply(this, a);
    Sch.gantt.plugins.Resize.superclass.constructor.call(this)
};
Ext.extend(Sch.gantt.plugins.Resize, Sch.plugins.Resize, {
    showDuration: true,
    startText: 'Start:',
    durationText: 'Duration:',
    dayText: 'd',
    init: function (a) {
        if (this.showDuration) {
            this.tipTemplate = new Ext.Template('<div class="sch-timetipwrap {cls}">', '<div>' + this.startText + ' {startText}</div>', '<div>' + this.durationText + ' {duration} ' + this.dayText + '</div>', '</div>').compile();
            this.getTipContent = this.getDurationTipContent
        }
        Sch.gantt.plugins.Resize.superclass.init.apply(this, arguments)
    },
    getDurationTipContent: function (a, b, c) {
        var g = this.grid,
            roundedStart = g.floorDate(a),
            roundedEnd = g.roundDate(b),
            formattedStart = g.getFormattedDate(a, 'floor'),
            duration = g.getDuration(roundedStart, roundedEnd);
        return this.tipTemplate.apply({
            cls: c ? 'sch-tip-ok' : 'sch-tip-notok',
            startText: formattedStart,
            duration: duration
        })
    }
});
Ext.ns('Ext.ux.maximgb.tg');
Ext.ux.maximgb.tg.AbstractTreeStore = Ext.extend(Ext.data.Store, {
    leaf_field_name: 'IsLeaf',
    page_offset: 0,
    active_node: null,
    defaultExpanded: false,
    constructor: function (a) {
        Ext.ux.maximgb.tg.AbstractTreeStore.superclass.constructor.call(this, a);
        if (!this.paramNames.active_node) {
            this.paramNames.active_node = 'anode'
        }
        this.addEvents('beforeexpandnode', 'expandnode', 'expandnodefailed', 'beforecollapsenode', 'collapsenode', 'beforeactivenodechange', 'activenodechange')
    },
    remove: function (a) {
        if (a === this.active_node) {
            this.setActiveNode(null)
        }
        this.removeNodeDescendants(a);
        Ext.ux.maximgb.tg.AbstractTreeStore.superclass.remove.call(this, a)
    },
    removeNodeDescendants: function (a) {
        var i, len, children = this.getNodeChildren(a);
        for (i = 0, len = children.length; i < len; i++) {
            this.remove(children[i])
        }
    },
    load: function (a) {
        if (a) {
            if (a.params) {
                if (a.params[this.paramNames.active_node] === undefined) {
                    a.params[this.paramNames.active_node] = this.active_node ? this.active_node.id : null
                }
            } else {
                a.params = {};
                a.params[this.paramNames.active_node] = this.active_node ? this.active_node.id : null
            }
        } else {
            a = {
                params: {}
            };
            a.params[this.paramNames.active_node] = this.active_node ? this.active_node.id : null
        }
        if (a.params[this.paramNames.active_node] !== null) {
            a.add = true
        }
        return Ext.ux.maximgb.tg.AbstractTreeStore.superclass.load.call(this, a)
    },
    loadRecords: function (o, d, e) {
        if (!o || e === false) {
            if (e !== false) {
                this.fireEvent("load", this, [], d)
            }
            if (d.callback) {
                d.callback.call(d.scope || this, [], d, false)
            }
            return
        }
        var r = o.records,
            t = o.totalRecords || r.length,
            page_offset = this.getPageOffsetFromOptions(d),
            loaded_node_id = this.getLoadedNodeIdFromOptions(d),
            loaded_node, i, len, record, idx, updated, self = this;
        if (!d || d.add !== true) {
            if (this.pruneModifiedRecords) {
                this.modified = []
            }
            for (var i = 0, len = r.length; i < len; i++) {
                r[i].join(this)
            }
            if (this.snapshot) {
                this.data = this.snapshot;
                delete this.snapshot
            }
            this.data.clear();
            this.data.addAll(r);
            this.page_offset = page_offset;
            this.totalLength = t;
            this.applySort();
            this.fireEvent("datachanged", this)
        } else {
            if (loaded_node_id) {
                loaded_node = this.getById(loaded_node_id)
            }
            if (loaded_node) {
                this.setNodeChildrenOffset(loaded_node, page_offset);
                this.setNodeChildrenTotalCount(loaded_node, Math.max(t, r.length));
                this.removeNodeDescendants(loaded_node)
            }
            this.suspendEvents();
            updated = {};
            for (i = 0, len = r.length; i < len; i++) {
                record = r[i];
                idx = this.indexOfId(record.id);
                if (idx == -1) {
                    updated[record.id] = false
                } else {
                    updated[record.id] = true;
                    this.setNodeExpanded(record, this.isExpandedNode(this.getAt(idx)))
                }
                this.add(record)
            }
            this.applySort();
            this.resumeEvents();
            r.sort(function (a, b) {
                var c = self.data.indexOf(a),
                    idx2 = self.data.indexOf(b),
                    r;
                if (c > idx2) {
                    r = 1
                } else {
                    r = -1
                }
                return r
            });
            var f = [];
            for (i = 0, len = r.length; i < len; i++) {
                record = r[i];
                if (updated[record.id] == true) {
                    this.fireEvent('update', this, record, Ext.data.Record.COMMIT)
                } else {
                    if (loaded_node_id) {
                        f.push(record)
                    } else {
                        this.fireEvent("add", this, [record], this.data.indexOf(record))
                    }
                }
            }
            if (loaded_node_id && f.length > 0) {
                this.fireEvent("add", this, f, this.data.indexOf(f[0]))
            }
        }
        this.fireEvent("load", this, r, d);
        if (d.callback) {
            d.callback.call(d.scope || this, r, d, true)
        }
    },
    sort: function (a, b) {
        if (this.remoteSort) {
            this.setActiveNode(null);
            if (this.lastOptions) {
                this.lastOptions.add = false;
                if (this.lastOptions.params) {
                    this.lastOptions.params[this.paramNames.active_node] = null
                }
            }
        }
        return Ext.ux.maximgb.tg.AbstractTreeStore.superclass.sort.call(this, a, b)
    },
    applySort: function () {
        if (this.sortInfo && !this.remoteSort) {
            var s = this.sortInfo,
                f = s.field;
            this.sortData(f, s.direction)
        } else {
            this.applyTreeSort()
        }
    },
    sortData: function (f, a) {
        Ext.ux.maximgb.tg.AbstractTreeStore.superclass.sortData.apply(this, arguments);
        this.applyTreeSort()
    },
    applyTreeSort: function () {
        var i, len, temp, rec, records = [],
            roots = this.getRootNodes();
        for (i = 0, len = roots.length; i < len; i++) {
            rec = roots[i];
            records.push(rec);
            this.collectNodeChildrenTreeSorted(records, rec)
        }
        if (records.length > 0) {
            this.data.clear();
            this.data.addAll(records)
        }
        if (this.snapshot && this.snapshot !== this.data) {
            temp = this.data;
            this.data = this.snapshot;
            this.snapshot = null;
            this.applyTreeSort();
            this.snapshot = this.data;
            this.data = temp
        }
    },
    collectNodeChildrenTreeSorted: function (a, b) {
        var i, len, child, children = this.getNodeChildren(b);
        for (i = 0, len = children.length; i < len; i++) {
            child = children[i];
            a.push(child);
            this.collectNodeChildrenTreeSorted(a, child)
        }
    },
    getActiveNode: function () {
        return this.active_node
    },
    setActiveNode: function (a) {
        if (this.active_node !== a) {
            if (a) {
                if (this.data.indexOf(a) != -1) {
                    if (this.fireEvent('beforeactivenodechange', this, this.active_node, a) !== false) {
                        this.active_node = a;
                        this.fireEvent('activenodechange', this, this.active_node, a)
                    }
                } else {
                    throw "Given record is not from the store.";
                }
            } else {
                if (this.fireEvent('beforeactivenodechange', this, this.active_node, a) !== false) {
                    this.active_node = a;
                    this.fireEvent('activenodechange', this, this.active_node, a)
                }
            }
        }
    },
    isExpandedNode: function (a) {
        if (this.defaultExpanded) {
            return a.ux_maximgb_tg_expanded !== false
        } else {
            return a.ux_maximgb_tg_expanded === true
        }
    },
    setNodeExpanded: function (a, b) {
        a.ux_maximgb_tg_expanded = b
    },
    isVisibleNode: function (a) {
        var i, len, ancestors = this.getNodeAncestors(a),
            result = true;
        for (i = 0, len = ancestors.length; i < len; i++) {
            result = result && this.isExpandedNode(ancestors[i]);
            if (!result) {
                break
            }
        }
        return result
    },
    isLeafNode: function (a) {
        return a.get(this.leaf_field_name) == true
    },
    isLoadedNode: function (a) {
        var b = false;
        if (a.ux_maximgb_tg_loaded !== undefined) {
            b = a.ux_maximgb_tg_loaded
        } else if (this.hasChildNodes(a) || this.isLeafNode(a)) {
            b = true
        }
        return b
    },
    setNodeLoaded: function (a, b) {
        a.ux_maximgb_tg_loaded = b
    },
    getNodeChildrenOffset: function (a) {
        return a.ux_maximgb_tg_offset || 0
    },
    setNodeChildrenOffset: function (a, b) {
        a.ux_maximgb_tg_offset = b
    },
    getNodeChildrenTotalCount: function (a) {
        return a.ux_maximgb_tg_total || 0
    },
    setNodeChildrenTotalCount: function (a, b) {
        a.ux_maximgb_tg_total = b
    },
    collapseNode: function (a) {
        if (this.isExpandedNode(a) && this.fireEvent('beforecollapsenode', this, a) !== false) {
            this.setNodeExpanded(a, false);
            this.fireEvent('collapsenode', this, a)
        }
    },
    expandNode: function (a) {
        var b;
        if (!this.isExpandedNode(a) && this.fireEvent('beforeexpandnode', this, a) !== false) {
            if (this.isLoadedNode(a)) {
                this.setNodeExpanded(a, true);
                this.fireEvent('expandnode', this, a, false)
            } else {
                this.fireEvent('expandingnode', this, a);
                b = {};
                b[this.paramNames.active_node] = a.id;
                this.load({
                    add: true,
                    params: b,
                    callback: this.expandNodeCallback,
                    scope: this
                })
            }
        }
    },
    expandNodeCallback: function (r, a, b) {
        var c = this.getById(a.params[this.paramNames.active_node]);
        if (b && c) {
            this.setNodeLoaded(c, true);
            this.setNodeExpanded(c, true);
            this.fireEvent('expandnode', this, c, true)
        } else {
            this.fireEvent('expandnodefailed', this, a.params[this.paramNames.active_node], c)
        }
    },
    expandAll: function () {
        var r, i, len, records = this.data.getRange();
        this.suspendEvents();
        for (i = 0, len = records.length; i < len; i++) {
            r = records[i];
            if (!this.isExpandedNode(r)) {
                this.expandNode(r)
            }
        }
        this.resumeEvents();
        this.fireEvent('datachanged', this)
    },
    collapseAll: function () {
        var r, i, len, records = this.data.getRange();
        this.suspendEvents();
        for (i = 0, len = records.length; i < len; i++) {
            r = records[i];
            if (this.isExpandedNode(r)) {
                this.collapseNode(r)
            }
        }
        this.resumeEvents();
        this.fireEvent('datachanged', this)
    },
    getLoadedNodeIdFromOptions: function (a) {
        var b = null;
        if (a && a.params && a.params[this.paramNames.active_node]) {
            b = a.params[this.paramNames.active_node]
        }
        return b
    },
    getPageOffsetFromOptions: function (a) {
        var b = 0;
        if (a && a.params && a.params[this.paramNames.start]) {
            b = parseInt(a.params[this.paramNames.start], 10);
            if (isNaN(b)) {
                b = 0
            }
        }
        return b
    },
    hasNextSiblingNode: function (a) {
        return this.getNodeNextSibling(a) !== null
    },
    hasPrevSiblingNode: function (a) {
        return this.getNodePrevSibling(a) !== null
    },
    hasChildNodes: function (a) {
        return this.getNodeChildrenCount(a) > 0
    },
    getNodeAncestors: function (a) {
        var b = [],
            parent;
        parent = this.getNodeParent(a);
        while (parent) {
            b.push(parent);
            parent = this.getNodeParent(parent)
        }
        return b
    },
    getNodeChildrenCount: function (a) {
        return this.getNodeChildren(a).length
    },
    getNodeNextSibling: function (a) {
        var b, parent, index, result = null;
        parent = this.getNodeParent(a);
        if (parent) {
            b = this.getNodeChildren(parent)
        } else {
            b = this.getRootNodes()
        }
        index = b.indexOf(a);
        if (index < b.length - 1) {
            result = b[index + 1]
        }
        return result
    },
    getNodePrevSibling: function (a) {
        var b, parent, index, result = null;
        parent = this.getNodeParent(a);
        if (parent) {
            b = this.getNodeChildren(parent)
        } else {
            b = this.getRootNodes()
        }
        index = b.indexOf(a);
        if (index > 0) {
            result = b[index - 1]
        }
        return result
    },
    getRootNodes: function () {
        throw 'Abstract method call';
    },
    getNodeDepth: function (a) {
        throw 'Abstract method call';
    },
    getNodeParent: function (a) {
        throw 'Abstract method call';
    },
    getNodeChildren: function (a) {
        throw 'Abstract method call';
    },
    addToNode: function (a, b) {
        throw 'Abstract method call';
    },
    removeFromNode: function (a, b) {
        throw 'Abstract method call';
    },
    getPageOffset: function () {
        return this.page_offset
    },
    getActiveNodePageOffset: function () {
        var a;
        if (this.active_node) {
            a = this.getNodeChildrenOffset(this.active_node)
        } else {
            a = this.getPageOffset()
        }
        return a
    },
    getActiveNodeCount: function () {
        var a;
        if (this.active_node) {
            a = this.getNodeChildrenCount(this.active_node)
        } else {
            a = this.getRootNodes().length
        }
        return a
    },
    getActiveNodeTotalCount: function () {
        var a;
        if (this.active_node) {
            a = this.getNodeChildrenTotalCount(this.active_node)
        } else {
            a = this.getTotalCount()
        }
        return a
    }
});
Ext.ns('Ext.ux.maximgb.tg');
Ext.ux.maximgb.tg.AdjacencyListStore = Ext.extend(Ext.ux.maximgb.tg.AbstractTreeStore, {
    parent_id_field_name: 'ParentId',
    getRootNodes: function () {
        var a = this.parent_id_field_name;
        return this.queryBy(function (r) {
            return r.data[a] === null || r.data[a] === ""
        }).items
    },
    getNodeDepth: function (a) {
        return this.getNodeAncestors(a).length
    },
    getNodeParent: function (a) {
        return this.getById(a.get(this.parent_id_field_name))
    },
    getNodeChildren: function (a) {
        var b = [],
            records = this.data.items,
            id = a.id,
            pField = this.parent_id_field_name,
            r;
        for (var i = 0, len = records.length; i < len; i++) {
            if (records[i].data[pField] === id) {
                b.push(records[i])
            }
        }
        return b
    },
    addToNode: function (a, b) {
        b.set(this.parent_id_field_name, a.id);
        this.addSorted(b)
    },
    removeFromNode: function (a, b) {
        this.remove(b)
    },
    hasChildNodes: function (a) {
        return this.findExact(this.parent_id_field_name, a.id) > 0
    }
});
Ext.reg('Ext.ux.maximgb.tg.AdjacencyListStore', Ext.ux.maximgb.tg.AdjacencyListStore);
Ext.ux.maximgb.tg.NestedSetStore = Ext.extend(Ext.ux.maximgb.tg.AbstractTreeStore, {
    left_field_name: '_lft',
    right_field_name: '_rgt',
    level_field_name: '_level',
    root_node_level: 1,
    getRootNodes: function () {
        var i, len, result = [],
            records = this.data.getRange();
        for (i = 0, len = records.length; i < len; i++) {
            if (records[i].get(this.level_field_name) == this.root_node_level) {
                result.push(records[i])
            }
        }
        return result
    },
    getNodeDepth: function (a) {
        return a.get(this.level_field_name) - this.root_node_level
    },
    getNodeParent: function (a) {
        var b = null,
            rec, records = this.data.getRange(),
            i, len, lft, r_lft, rgt, r_rgt, level, r_level;
        lft = a.get(this.left_field_name);
        rgt = a.get(this.right_field_name);
        level = a.get(this.level_field_name);
        for (i = 0, len = records.length; i < len; i++) {
            rec = records[i];
            r_lft = rec.get(this.left_field_name);
            r_rgt = rec.get(this.right_field_name);
            r_level = rec.get(this.level_field_name);
            if (r_level == level - 1 && r_lft < lft && r_rgt > rgt) {
                b = rec;
                break
            }
        }
        return b
    },
    getNodeChildren: function (a) {
        var b, r_lft, rgt, r_rgt, level, r_level, records, rec, result = [];
        records = this.data.getRange();
        b = a.get(this.left_field_name);
        rgt = a.get(this.right_field_name);
        level = a.get(this.level_field_name);
        for (i = 0, len = records.length; i < len; i++) {
            rec = records[i];
            r_lft = rec.get(this.left_field_name);
            r_rgt = rec.get(this.right_field_name);
            r_level = rec.get(this.level_field_name);
            if (r_level == level + 1 && r_lft > b && r_rgt < rgt) {
                result.push(rec)
            }
        }
        return result
    }
});
Ext.ns('Sch');
Sch.TreeGanttView = Ext.extend(Sch.LockingSchedulerView, {
    afterRender: Ext.emptyFn,
    constructor: function () {
        this.addEvents('togglerow');
        Sch.TreeGanttView.superclass.constructor.apply(this, arguments)
    },
    doRender: function (a, b, d, e, f, g) {
        var h = this.templates,
            ct = h.cell,
            rt = h.row,
            last = f - 1,
            tstyle = 'width:' + this.getTotalWidth() + ';',
            lstyle = 'width:' + this.getLockedWidth() + ';',
            buf = [],
            lbuf = [],
            cb, lcb, c, p = {},
            rp = {},
            r, events, processed_cnt = 0;
        for (var j = 0, len = b.length; j < len; j++) {
            r = b[j];
            cb = [];
            lcb = [];
            var k = (j + e);
            for (var i = 0; i < f; i++) {
                c = a[i];
                p.id = c.id;
                p.css = (i === 0 ? 'x-grid3-cell-first ' : (i == last ? 'x-grid3-cell-last ' : '')) + (this.cm.config[i].cellCls ? ' ' + this.cm.config[i].cellCls : '');
                p.attr = p.cellAttr = '';
                p.value = c.renderer.call(c.scope || c, r.data[c.name], p, r, k, i, d);
                p.style = c.style;
                if (Ext.isEmpty(p.value)) {
                    p.value = '&#160;'
                }
                if (this.markDirty && r.dirty && Ext.isDefined(r.modified[c.name])) {
                    p.css += ' x-grid3-dirty-cell'
                }
                if (c.locked) {
                    if (c.id === this.grid.master_column_id) {
                        p.treeui = this.renderCellTreeUI(r, d);
                        p.css += d.isLeafNode(r) ? ' sch-gantt-leaf-cell' : ' sch-gantt-parent-cell';
                        ct = h.mastercell
                    } else {
                        ct = h.cell
                    }
                    lcb[lcb.length] = ct.apply(p)
                } else {
                    ct = h.cell;
                    cb[cb.length] = ct.apply(p)
                }
            }
            var l = [];
            if (!d.isVisibleNode(r)) {
                rp.display_style = 'display: none;'
            } else {
                if (g && ((processed_cnt + 1) % 2 === 0)) {
                    l[0] = 'x-grid3-row-alt'
                }
                processed_cnt++;
                rp.display_style = ''
            }
            if (r.dirty) {
                l[1] = ' x-grid3-dirty-row'
            }
            rp.cols = f;
            if (this.getRowClass) {
                l[2] = this.getRowClass(r, k, rp, d)
            }
            rp.alt = l.join(' ');
            rp.cells = cb.join('');
            rp.tstyle = tstyle;
            buf[buf.length] = rt.apply(rp);
            rp.cells = lcb.join('');
            rp.tstyle = lstyle;
            lbuf[lbuf.length] = rt.apply(rp)
        }
        return [buf.join(''), lbuf.join('')]
    },
    expanded_icon_class: 'ux-maximgb-tg-elbow-minus',
    collapsed_icon_class: 'ux-maximgb-tg-elbow-plus',
    initTemplates: function () {
        var a = this.templates || {};
        if (!a.row) {
            a.row = new Ext.Template('<div class="x-grid3-row {alt}" style="{tstyle} {display_style}">', '<table class="x-grid3-row-table" border="0" cellspacing="0" cellpadding="0" style="{tstyle}">', '<tbody>', '<tr>{cells}</tr>', '</tbody>', '</table>', '</div>')
        }
        if (!a.mastercell) {
            a.mastercell = new Ext.Template('<td class="x-grid3-col x-grid3-cell x-grid3-td-{id} {css}" style="{style}" tabIndex="0" {cellAttr}>', '<div class="ux-maximgb-tg-mastercell-wrap">', '{treeui}', '<div class="x-grid3-cell-inner x-grid3-col-{id}" unselectable="on" {attr}>{value}</div>', '</div>', '</td>')
        }
        if (!a.treeui) {
            a.treeui = new Ext.Template('<div class="ux-maximgb-tg-uiwrap" style="width: {wrap_width}px">', '<div class="{cls}">&#160;</div>', '</div>')
        }
        this.templates = a;
        Sch.TreeGanttView.superclass.initTemplates.call(this)
    },
    levelWidth: 16,
    renderCellTreeUI: function (a, b) {
        var c = this.templates.treeui,
            tpl_data = {},
            depth = b.getNodeDepth(a);
        tpl_data.wrap_width = (depth + 1) * this.levelWidth;
        if (b.isLeafNode(a)) {
            tpl_data.cls = 'ux-maximgb-tg-elbow sch-gantt-leaf'
        } else {
            tpl_data.cls = 'ux-maximgb-tg-elbow-active sch-gantt-parent ';
            if (b.isExpandedNode(a)) {
                tpl_data.cls += this.expanded_icon_class
            } else {
                tpl_data.cls += this.collapsed_icon_class
            }
        }
        tpl_data.left = 1 + depth * this.levelWidth;
        return c.apply(tpl_data)
    },
    processRows: function (a, b) {
        if (!this.ds || this.ds.getCount() < 1) {
            return
        }
        var c = this.getRows(),
            lrows = this.getLockedRows(),
            row, lrow, processed_cnt = 0;
        b = b || !this.grid.stripeRows;
        a = a || 0;
        for (var i = 0, len = c.length; i < len; ++i) {
            row = c[i];
            lrow = lrows[i];
            row.rowIndex = i;
            lrow.rowIndex = i;
            if (row.style.display != 'none') {
                if (!b) {
                    row.className = row.className.replace(this.rowClsRe, ' ');
                    lrow.className = lrow.className.replace(this.rowClsRe, ' ');
                    if ((processed_cnt + 1) % 2 === 0) {
                        row.className += ' x-grid3-row-alt';
                        lrow.className += ' x-grid3-row-alt'
                    }
                    processed_cnt++
                }
            }
            if (this.syncHeights) {
                var d = Ext.get(row),
                    el2 = Ext.get(lrow),
                    h1 = d.getHeight(),
                    h2 = el2.getHeight();
                if (h1 > h2) {
                    el2.setHeight(h1)
                } else if (h2 > h1) {
                    d.setHeight(h2)
                }
            }
        }
        if (a === 0) {
            Ext.fly(c[0]).addClass(this.firstRowCls);
            Ext.fly(lrows[0]).addClass(this.firstRowCls)
        }
        Ext.fly(c[c.length - 1]).addClass(this.lastRowCls);
        Ext.fly(lrows[lrows.length - 1]).addClass(this.lastRowCls)
    },
    ensureVisible: function (a, b, c) {
        var d, record = this.ds.getAt(a);
        if (!this.ds.isVisibleNode(record)) {
            d = this.ds.getNodeAncestors(record);
            while (d.length > 0) {
                record = d.shift();
                if (!this.ds.isExpandedNode(record)) {
                    this.ds.expandNode(record)
                }
            }
        }
        return Sch.TreeGanttView.superclass.ensureVisible.call(this, a, b, c)
    },
    expandRow: function (a, b) {
        var c = this.ds,
            i, len, row, pmel, children, index, child_index;
        if (typeof a == 'number') {
            index = a;
            a = c.getAt(index)
        } else {
            index = c.indexOf(a)
        }
        if (c.isLeafNode(a)) return;
        b = b || false;
        row = this.getLockedRow(index);
        pmel = Ext.fly(row).child('.ux-maximgb-tg-elbow-active');
        if (pmel) {
            pmel.removeClass(this.collapsed_icon_class);
            pmel.addClass(this.expanded_icon_class)
        }
        if (c.isVisibleNode(a)) {
            children = c.getNodeChildren(a);
            for (i = 0, len = children.length; i < len; i++) {
                child_index = c.indexOf(children[i]);
                this.getRow(child_index).style.display = 'block';
                this.getLockedRow(child_index).style.display = 'block';
                if (c.isExpandedNode(children[i])) {
                    this.expandRow(child_index, true)
                }
            }
        }
        if (!b) {
            this.processRows(0)
        }
        this.fireEvent('togglerow', this, a, true)
    },
    collapseRow: function (a, b) {
        var c = this.ds,
            i, len, children, pmel, row, index, child_index;
        if (typeof a == 'number') {
            index = a;
            a = c.getAt(index)
        } else {
            index = c.indexOf(a)
        }
        if (c.isLeafNode(a)) return;
        b = b || false;
        row = this.getLockedRow(index);
        pmel = Ext.fly(row).child('.ux-maximgb-tg-elbow-active');
        if (pmel) {
            pmel.removeClass(this.expanded_icon_class);
            pmel.addClass(this.collapsed_icon_class)
        }
        children = c.getNodeChildren(a);
        for (i = 0, len = children.length; i < len; i++) {
            child_index = c.indexOf(children[i]);
            row = this.getRow(child_index);
            if (row.style.display != 'none') {
                row.style.display = 'none';
                this.getLockedRow(child_index).style.display = 'none';
                this.collapseRow(child_index, true)
            }
        }
        if (!b) {
            this.processRows(0)
        }
        this.fireEvent('togglerow', this, a, true)
    },
    initData: function (a, b) {
        if (this.cm) {
            this.cm.un('columnlockchange', this.onColumnLock, this)
        }
        Sch.SchedulerView.superclass.initData.call(this, a, b);
        if (this.cm) {
            this.cm.on('columnlockchange', this.onColumnLock, this)
        }
        if (this.ds) {
            this.ds.un('expandnode', this.onStoreExpandNode, this);
            this.ds.un('collapsenode', this.onStoreCollapseNode, this)
        }
        if (a) {
            a.on({
                expandnode: this.onStoreExpandNode,
                expandingnode: this.onStoreStartExpand,
                expandnodefailed: this.onStoreExpandNodeFailed,
                collapsenode: this.onStoreCollapseNode,
                scope: this
            })
        }
    },
    onStoreStartExpand: function (s, a) {
        var b = s.indexOf(a);
        if (b >= 0) {
            var c = this.getLockedRow(b);
            Ext.fly(c).child('.' + this.collapsed_icon_class).addClass('sch-loading')
        }
    },
    onStoreExpandNodeFailed: function (s, n, a) {
        var b = s.indexOf(a);
        if (b >= 0) {
            var c = this.getLockedRow(b);
            Ext.fly(c).child('.' + this.collapsed_icon_class).removeClass('sch-loading')
        }
    },
    onLoad: function (a, b, c) {
        if (c && c.params && (c.params[a.paramNames.active_node] === null || a.indexOfId(c.params[a.paramNames.active_node]) == -1)) {
            Sch.TreeGanttView.superclass.onLoad.call(this, a, b, c)
        }
    },
    onAdd: function (a, b, c) {
        Sch.TreeGanttView.superclass.onAdd.call(this, a, b, c);
        if (this.mainWrap) {
            this.processRows(0)
        }
    },
    onRemove: function (a, b, c, d) {
        Sch.TreeGanttView.superclass.onRemove.call(this, a, b, c, d);
        var e = a.getNodeParent(b);
        if (e) {
            e.set(a.leaf_field_name, !a.hasChildNodes(e))
        }
        if (d !== true) {
            if (this.mainWrap) {
                this.processRows(0)
            }
        }
    },
    onUpdate: function (a, b) {
        Sch.TreeGanttView.superclass.onUpdate.call(this, a, b);
        if (this.mainWrap) {
            this.processRows(0)
        }
    },
    refreshRow: function (a) {
        Sch.TreeGanttView.superclass.refreshRow.call(this, a);
        if (this.mainWrap) {
            this.processRows(0)
        }
    },
    onStoreExpandNode: function (a, b, c) {
        if (c) {
            var d = a.indexOf(b);
            if (d >= 0) {
                var e = this.getLockedRow(d);
                Ext.fly(e).child('.' + this.collapsed_icon_class).removeClass('sch-loading')
            }
        }
        this.expandRow(b)
    },
    onStoreCollapseNode: function (a, b) {
        this.collapseRow(b)
    },
    focusCell: Ext.ux.grid.LockingGridView.prototype.focusCell.createInterceptor(function (a, b, c) {
        return b >= this.cm.getLockedCount()
    })
});
if (Ext.getMajorVersion() >= 3 && Ext.getMinorVersion() >= 3) {
    Ext.override(Sch.TreeGanttView, {
        refreshRow: function (a) {
            var b = this.ds,
                colCount = this.cm.getColumnCount(),
                columns = this.getColumnData(),
                last = colCount - 1,
                cls = ['x-grid3-row'],
                rowParams = {
                    tstyle: String.format("width: {0};", this.getTotalWidth())
                },
                lockedRowParams = {
                    tstyle: String.format("width: {0};", this.getLockedWidth())
                },
                colBuffer = [],
                lockedColBuffer = [],
                cellTpl = this.templates.cell,
                mastercellTpl = this.templates.mastercell,
                rowIndex, row, lockedRow, column, meta, css, i;
            if (Ext.isNumber(a)) {
                rowIndex = a;
                a = b.getAt(rowIndex)
            } else {
                rowIndex = b.indexOf(a)
            }
            if (!a || rowIndex < 0) {
                return
            }
            for (i = 0; i < colCount; i++) {
                column = columns[i];
                if (i == 0) {
                    css = 'x-grid3-cell-first'
                } else {
                    css = (i == last) ? 'x-grid3-cell-last ' : ''
                }
                meta = {
                    id: column.id,
                    style: column.style,
                    css: css,
                    attr: "",
                    cellAttr: ""
                };
                meta.value = column.renderer.call(column.scope || column, a.data[column.name], meta, a, rowIndex, i, b);
                if (Ext.isEmpty(meta.value)) {
                    meta.value = '&#160;'
                }
                if (this.markDirty && a.dirty && typeof a.modified[column.name] != 'undefined') {
                    meta.css += ' x-grid3-dirty-cell'
                }
                if (column.locked) {
                    if (column.id === this.grid.master_column_id) {
                        meta.treeui = this.renderCellTreeUI(a, b);
                        meta.css += b.isLeafNode(a) ? ' sch-gantt-leaf-cell' : ' sch-gantt-parent-cell';
                        lockedColBuffer[i] = mastercellTpl.apply(meta)
                    } else {
                        lockedColBuffer[i] = cellTpl.apply(meta)
                    }
                } else {
                    colBuffer[i] = cellTpl.apply(meta)
                }
            }
            row = this.getRow(rowIndex);
            row.className = '';
            lockedRow = this.getLockedRow(rowIndex);
            lockedRow.className = '';
            if (this.grid.stripeRows && ((rowIndex + 1) % 2 === 0)) {
                cls.push('x-grid3-row-alt')
            }
            if (this.getRowClass) {
                rowParams.cols = colCount;
                cls.push(this.getRowClass(a, rowIndex, rowParams, b))
            }
            this.fly(row).addClass(cls).setStyle(rowParams.tstyle);
            rowParams.cells = colBuffer.join("");
            row.innerHTML = this.templates.rowInner.apply(rowParams);
            this.fly(lockedRow).addClass(cls).setStyle(lockedRowParams.tstyle);
            lockedRowParams.cells = lockedColBuffer.join("");
            lockedRow.innerHTML = this.templates.rowInner.apply(lockedRowParams);
            lockedRow.rowIndex = rowIndex;
            this.fireEvent('rowupdated', this, rowIndex, a)
        }
    })
}
Ext.ns('Sch');
Sch.TreeGanttPanel = Ext.extend(Sch.EditorSchedulerPanel, {
    highlightWeekends: true,
    enableTaskDragDrop: true,
    enableDependencyDragDrop: true,
    enableLabelEdit: true,
    toggleParentTasksOnClick: true,
    recalculateParentsAfterEdit: true,
    cascadeChanges: false,
    showTodayLine: false,
    highlightAffectedTasks: true,
    resizeHandles: 'both',
    getDependencyManager: function () {
        return this.dependencyManager
    },
    disableWeekendHighlighting: function (a) {
        this.weekendZonesPlugin.setDisabled(a)
    },
    updateTimeColumnHeaderWidths: function (a) {
        var b = this.getColumnModel();
        for (var i = this.nbrStaticColumns, l = b.getColumnCount(); i < l; i++) {
            b.setColumnWidth(i, a, true)
        }
        this.getView().updateHeaders()
    },
    updateTimeColumnWidths: function (a) {
        this.getView().updateTimeColumnWidths(a)
    },
    getEventRecordFromElement: function (a) {
        var b = Ext.get(a);
        if (!b.is(this.eventWrapSelector)) {
            b = b.up(this.eventWrapSelector)
        }
        return this.getEventRecordFromDomId(b.child(this.eventSelector).id)
    },
    fitTimeColumns: function () {
        this.getView().fitTimeColumns()
    },
    getDuration: function (a, b) {
        return Math.round(Date.getDurationInDays(a, b) * 10) / 10
    },
    milestoneOffset: 8,
    parentTaskOffset: 6,
    clicksToEdit: 1,
    columnLines: false,
    eventSelector: '.sch-gantt-item',
    eventWrapSelector: '.sch-event-wrap',
    enableColLock: false,
    dndValidatorFn: function (a, b, c, e) {
        return true
    },
    constructor: function (a) {
        this.addEvents('labeledit_beforecomplete', 'labeledit_complete');
        a = a || {};
        Ext.applyIf(a, {
            plugins: []
        });
        Ext.apply(this, a);
        if (!a.eventTemplate) {
            a.eventTemplate = new Ext.Template('<div class="sch-event-wrap sch-gantt-task" style="left:{leftOffset}px;width:{width}px">', '<div class="sch-gantt-labelct-left"><label class="sch-gantt-label sch-gantt-label-left">{leftLabel}</label></div>', '<div id="{id}" class="sch-gantt-item sch-gantt-task-bar {cls}" style="width:{width}px;{style}">', a.enableDependencyDragDrop !== false ? '<div class="sch-gantt-terminal sch-gantt-terminal-start"></div>' : '', (this.resizeHandles === 'both' || this.resizeHandles === 'left') ? String.format(this.resizeHandleHtml, 'west') : '', '<div class="sch-gantt-progress-bar" style="width:{percentDone}%">&#160;</div>', (this.resizeHandles === 'both' || this.resizeHandles === 'right') ? String.format(this.resizeHandleHtml, 'east') : '', a.enableDependencyDragDrop !== false ? '<div class="sch-gantt-terminal sch-gantt-terminal-end"></div>' : '', '</div>', '<div class="sch-gantt-labelct-right" style="left:{width}px"><label class="sch-gantt-label sch-gantt-label-right">{rightLabel}</label></div>', '</div>', {
                compiled: true,
                disableFormats: true
            })
        }
        if (!a.parentEventTemplate) {
            a.parentEventTemplate = new Ext.Template('<div class="sch-event-wrap sch-gantt-parent-task" style="left:{leftOffset}px;width:{width}px">', '<div class="sch-gantt-labelct-left"><label class="sch-gantt-label sch-gantt-label-left">{leftLabel}</label></div>', '<div id="{id}" class="sch-gantt-item sch-gantt-parenttask-bar {cls}" style="width:{width}px;{style}">', '<div class="sch-gantt-parenttask-leftarrow"></div>', a.enableDependencyDragDrop !== false ? '<div class="sch-gantt-terminal sch-gantt-terminal-start"></div>' : '', '<div class="sch-gantt-progress-bar" style="width:{percentDone}%">&#160;</div>', '<div class="sch-gantt-parenttask-rightarrow"></div>', a.enableDependencyDragDrop !== false ? '<div class="sch-gantt-terminal sch-gantt-terminal-end"></div>' : '', '</div>', '<div class="sch-gantt-labelct-right" style="left:{width}px"><label class="sch-gantt-label sch-gantt-label-right">{rightLabel}</label></div>', '</div>', {
                compiled: true,
                disableFormats: true
            })
        }
        if (!a.milestoneTemplate) {
            a.milestoneTemplate = new Ext.Template('<div class="sch-event-wrap sch-gantt-milestone" style="left:{leftOffset}px">', '<div class="sch-gantt-labelct-left"><label class="sch-gantt-label sch-gantt-label-left">{leftLabel}</label></div>', '<div id="{id}" class="sch-gantt-item sch-gantt-milestone-diamond {cls}" style="{style}">', a.enableDependencyDragDrop !== false ? '<div class="sch-gantt-terminal sch-gantt-terminal-start"></div>' : '', a.enableDependencyDragDrop !== false ? '<div class="sch-gantt-terminal sch-gantt-terminal-end"></div>' : '', '</div>', '<div class="sch-gantt-labelct-right"><label class="sch-gantt-label sch-gantt-label-right">{rightLabel}</label></div>', '</div>', {
                compiled: true,
                disableFormats: true
            })
        }
        Sch.TreeGanttPanel.superclass.constructor.call(this, a)
    },
    configureFunctionality: function () {
        var c = this.plugins;
        if (this.enableLabelEdit !== false) {
            this.labelEditor = new Sch.gantt.plugins.LabelEditor();
            c.push(this.labelEditor)
        }
        if (this.resizeHandles !== 'none' && !this.resizePlug) {
            this.resizePlug = new Sch.gantt.plugins.Resize({
                validatorFn: this.resizeValidatorFn || Ext.emptyFn,
                validatorFnScope: this.validatorFnScope || this
            });
            c.push(this.resizePlug)
        }
        if (this.enableTaskDragDrop && !this.dragdropPlug) {
            this.dragdropPlug = new Sch.gantt.plugins.DragDrop({
                validatorFn: this.dndValidatorFn || Ext.emptyFn,
                validatorFnScope: this.validatorFnScope || this,
                getItemDepth: 8
            });
            this.on('beforednd', function (p, a, e) {
                var d = e.getTarget(this.eventSelector, this.view.cellSelectorDepth);
                var b = this.getView(),
                	row = b.findRowIndex(d),
                	store = this.getStore(),
                	record = store.getAt(row);
                if(this.fnEventEditable(this, record) !== false){
                    var t = e.getTarget();
                    return !t.className.match('x-resizable-handle') && !t.className.match('sch-gantt-terminal') && !e.getTarget('.sch-gantt-parenttask-bar')
                }else{
                	return false;
                }
            });
            c.push(this.dragdropPlug)
        }
        if (this.highlightWeekends) {
            this.weekendZonesPlugin = new Sch.plugins.Zones({
                store: new Ext.data.JsonStore({
                    fields: ['StartDate', 'EndDate']
                })
            });
            c.push(this.weekendZonesPlugin)
        }
        if (this.showTodayLine) {
            this.todayLinePlugin = new Sch.gantt.plugins.CurrentTimeLine();
            c.push(this.todayLinePlugin)
        }
        if (this.highlightAffectedTasks) {
            this.on('beforeedit', function (o) {
                if (o.field === 'StartDate' || o.field === 'EndDate' || o.field === 'Duration') {
                    this.doHighlightAffectedTasks(o.record.id)
                }
            }, this);
            this.on('afterrender', function () {
                var a = this.getColumnModel().config;
                for (var i = 0; i < a.length; i++) {
                    if ((a[i].dataIndex === 'StartDate' || a[i].dataIndex === 'EndDate' || a[i].dataIndex === 'Duration') && a[i].editor) {
                        a[i].editor.on('hide', this.clearSelectedTasksAndDependencies, this)
                    }
                }
            }, this);
            if (this.resizePlug) {
                this.on('resizestart', function (a, b) {
                    this.doHighlightAffectedTasks(b.id)
                }, this);
                this.on('afterresize', function (a, b) {
                    this.clearSelectedTasksAndDependencies()
                }, this)
            }
            if (this.dragdropPlug) {
                this.on('dndstart', function (a, b) {
                    this.doHighlightAffectedTasks(b.id)
                }, this);
                this.on('afterdnd', function () {
                    this.clearSelectedTasksAndDependencies()
                }, this)
            }
        }
    },
    isMilestone: function (a) {
        return a.get('EndDate') - a.get('StartDate') === 0
    },
    internalRenderer: function (v, m, a, b, c, d) {
        var e = '',
            grid = this,
            viewStart = grid.getStart(),
            viewEnd = grid.getEnd(),
            cm = grid.getColumnModel(),
            colWidth = cm.getColumnWidth(c),
            colStart = grid.getColumnStart(c),
            colEnd = grid.getColumnEnd(c);
        grid.timeCellRenderer.call(this, a, m, b, c, d, colStart, colEnd, grid);
        var f = a.get('StartDate'),
            end = a.get('EndDate'),
            startsInsideView = f.betweenLesser(colStart, colEnd);
        if (startsInsideView || (c == grid.nbrStaticColumns && f < colStart && end > colStart)) {
            var g = Date.getDurationInMinutes(colStart, colEnd),
                leftOffset = Math.floor((Date.getDurationInMinutes(colStart, startsInsideView ? f : colStart) / g) * colWidth),
                eventData = grid.eventRenderer.call(this, a, b, c, d) || {};
            if (grid.isMilestone(a)) {
                Ext.apply(eventData, {
                    id: grid.eventPrefix + a.id,
                    cls: (eventData.cls || '') + (a.dirty ? ' sch-dirty' : ''),
                    leftOffset: leftOffset - grid.milestoneOffset,
                    leftLabel: a.get(grid.leftLabelField) || '',
                    rightLabel: a.get(grid.rightLabelField) || ''
                });
                e += grid.milestoneTemplate.apply(eventData)
            } else {
                var h = Math.floor(grid.getXFromDate(Date.min(end, viewEnd)) - grid.getXFromDate(startsInsideView ? f : viewStart)),
                    endsOutsideView = end > viewEnd,
                    isLeaf = d.isLeafNode(a);
                if (!isLeaf) {
                    h += 2 * grid.parentTaskOffset;
                    leftOffset -= grid.parentTaskOffset
                }
                Ext.apply(eventData, {
                    id: grid.eventPrefix + a.id,
                    cls: (eventData.cls || '') + (a.dirty ? ' sch-dirty' : '') + (endsOutsideView ? ' sch-event-endsoutside ' : '') + (startsInsideView ? '' : ' sch-event-startsoutside'),
                    width: Math.max(1, h - grid.eventBorderWidth),
                    leftOffset: leftOffset,
                    percentDone: a.get('PercentDone'),
                    leftLabel: a.get(grid.leftLabelField) || '',
                    rightLabel: a.get(grid.rightLabelField) || ''
                });
                eventData.text = eventData.text || '&#160;';
                e += grid[isLeaf ? "eventTemplate" : "parentEventTemplate"].apply(eventData)
            }
        }
        m.css += ' sch-timetd';
        if (Ext.isIE) {
            m.attr = 'style="z-index:' + (grid.getColumnModel().getColumnCount() - c) + '"'
        }
        return e
    },
    populateWeekendZonesPlugin: function () {
        var a = [],
            gStart = this.getStart(),
            gEnd = this.getEnd(),
            c = gStart.clone();
        while (c.getDay() !== 6) {
            c = c.add(Date.DAY, 1)
        }
        while (c < gEnd) {
            a.push({
                StartDate: c,
                EndDate: c.add(Date.DAY, 2)
            });
            c = c.add(Date.WEEK, 1)
        }
        this.weekendZonesPlugin.store.loadData(a)
    },
    getView: function () {
        if (!this.view) {
            this.viewConfig = this.viewConfig || {};
            Ext.applyIf(this.viewConfig, {
                cellSelectorDepth: 22,
                rowSelectorDepth: 12
            });
            this.view = new Sch.TreeGanttView(this.viewConfig)
        }
        return this.view
    },
    initComponent: function () {
        this.eventStore = this.store;
        if (this.highlightWeekends) {
            this.on('viewchange', this.populateWeekendZonesPlugin, this)
        }
        if (!this.dependencyStore) {
            this.dependencyStore = new Ext.data.Store()
        }
        if (!this.selModel && !this.disableSelection) {
            this.selModel = new Sch.EventSelectionModel({
                clearSelectionsOnBlur: false
            })
        }
        Sch.TreeGanttPanel.superclass.initComponent.call(this)
    },
    initEvents: function () {
        this.on('afterrender', this.onGanttRender, this);
        if (this.recalculateParentsAfterEdit) {
            this.store.on({
                'update': this.onStoreUpdate,
                'add': this.onStoreAddRemove,
                'remove': this.onStoreAddRemove,
                scope: this
            })
        }
        Sch.TreeGanttPanel.superclass.initEvents.call(this)
    },
    getXFromDate: function (a) {
        var b = -1,
            cm = this.getColumnModel(),
            count = cm.getColumnCount();
        for (var i = this.nbrStaticColumns; i < count; i++) {
            if (a <= this.getColumnEnd(i)) {
                var c = a - this.getColumnStart(i),
                    timeInColumn = this.getColumnEnd(i) - this.getColumnStart(i),
                    cw = cm.getColumnWidth(i);
                return (cw * ((i - this.nbrStaticColumns) + (c / timeInColumn)))
            }
        }
        return null
    },
    onGanttRender: function () {
        var v = this.getView();
        this.el.addClass('sch-ganttpanel' + (this.highlightWeekends ? ' sch-ganttpanel-highlightweekends' : ''));
        this.dependencyManager = new Sch.DependencyManager(this, {
            containerEl: v.scroller,
            checkVisible: true,
            enableDependencyDragDrop: this.enableDependencyDragDrop,
            store: this.dependencyStore
        });
        v.on({
            'refresh': this.dependencyManager.renderDependencies,
            'togglerow': this.dependencyManager.renderDependencies,
            scope: this.dependencyManager
        })
    },
    editLeftLabel: function (a) {
        this.labelEditor.editLeft(a)
    },
    editRightLabel: function (a) {
        this.labelEditor.editRight(a)
    },
    getDependenciesForTask: function (a) {
        return this.dependencyManager.getDependenciesForTask(a)
    },
    highlightDependency: function (a) {
        this.dependencyManager.highlightDependency(a)
    },
    unhighlightDependency: function (a) {
        this.dependencyManager.unhighlightDependency(a)
    },
    getTaskById: function (a) {
        return this.store.getById(a)
    },
    doHighlightAffectedTasks: function (a) {
        if (!this.cascadeChanges) {
            return
        }
        this.getSelectionModel().clearSelections();
        this.highlightTask(a)
    },
    highlightTask: function (b, c) {
        if (b instanceof Ext.data.Record) {
            b = b.id
        }
        var d = this.getElementFromEventId(b);
        if (d) {
            this.getSelectionModel().select(d, true)
        }
        if (c !== false) {
            this.dependencyStore.queryBy(function (a) {
                if (a.get('From') == b) {
                    this.highlightDependency(a.id);
                    this.highlightTask(a.get('To'), c)
                }
            }, this)
        }
    },
    clearSelectedTasksAndDependencies: function () {
        this.getSelectionModel().clearSelections();
        this.getView().el.select('.sch-dependency-selected').removeClass('sch-dependency-selected')
    },
    master_column_id: 0,
    onClick: function (e) {
        var a = e.getTarget('.ux-maximgb-tg-elbow-active', 1) || (this.toggleParentTasksOnClick && e.getTarget('.sch-gantt-parenttask-bar'));
        if (a) {
            var b = this.getView(),
                row = b.findRowIndex(a),
                store = this.getStore(),
                record = store.getAt(row);
            if (store.isExpandedNode(record)) {
                store.collapseNode(record)
            } else {
                store.expandNode(record)
            }
        }
        if (!a || a.className.match('sch-gantt-parenttask-bar')) {
            Sch.TreeGanttPanel.superclass.onClick.call(this, e)
        }
    },
    onMouseDown: function (e) {
        if (!e.getTarget('.ux-maximgb-tg-elbow-active', 1)) {
            Sch.TreeGanttPanel.superclass.onMouseDown.call(this, e)
        }
    },
    onStoreAddRemove: function (a, b) {
        this.store.suspendEvents();
        var c = this.recalculateParents(b);
        this.store.resumeEvents();
        var l = c.length;
        var d = this.getView();
        for (var i = 0; i < l; i++) {
            d.refreshRow(c[i])
        }
    },
    onStoreUpdate: function (a, b, c, d) {
        if (c !== Ext.data.Record.COMMIT && (!d || d.StartDate || d.EndDate)) {
            this.onStoreAddRemove(a, b)
            // add by zhangchang
            this.store.save();
        }
    },
    recalculateParents: function (a) {
        a = Ext.isArray(a) ? a[0] : a;
        var b = new Date(9999, 0, 0),
            latest = new Date(0),
            parent = this.store.getNodeParent(a),
            updatedTasks = [];
        if (parent) {
            var c = this.store.getNodeChildren(parent);
            if (c.length > 0) {
                Ext.each(c, function (r) {
                    b = Date.min(b, r.get('StartDate'));
                    latest = Date.max(latest, r.get('EndDate'))
                });
                if (parent.get('StartDate') - b !== 0) {
                    parent.set('StartDate', b);
                    updatedTasks.push(parent)
                }
                if (parent.get('EndDate') - latest !== 0) {
                    parent.set('EndDate', latest);
                    updatedTasks.push(parent)
                }
            }
            if (this.cascadeChanges) {
                this.getDependencyManager().performCascade(parent)
            }
            updatedTasks = updatedTasks.concat(this.recalculateParents(parent))
        }
        return updatedTasks
    },
    getCriticalPaths: function () {
        return this.getDependencyManager().getCriticalPaths()
    },
    highlightCriticalPaths: function (c) {
        this.clearSelectedTasksAndDependencies();
        var d = this.getCriticalPaths(),
            dm = this.getDependencyManager(),
            ds = this.dependencyStore,
            opacity = 0.2,
            t, i, l, depRecord;
        Ext.each(d, function (b) {
            for (i = 0, l = b.length; i < l; i++) {
                t = b[i];
                this.highlightTask(t, false);
                if (i < (l - 1)) {
                    depRecord = ds.getAt(ds.findBy(function (a) {
                        return a.get('To') === t.id && a.get('From') === b[i + 1].id
                    }));
                    dm.highlightDependency(depRecord)
                }
            }
        }, this);
        if (d.length > 0 && c) {
            this.getView().mainBody.select(this.eventSelector + ':not(.' + this.getSelectionModel().selectedClass + ')').setOpacity(opacity);
            this.getView().mainBody.select('.sch-dependency' + ':not(.sch-dependency-selected)').setOpacity(opacity)
        }
    },
    unhighlightCriticalPaths: function (a) {
        this.clearSelectedTasksAndDependencies();
        if (a) {
            this.getView().mainBody.select(this.eventSelector + ':not(.' + this.getSelectionModel().selectedClass + ')').setOpacity(1);
            this.getView().mainBody.select('.sch-dependency' + ':not(.sch-dependency-selected)').setOpacity(1)
        }
    }
});
Ext.reg('treegantt', Sch.TreeGanttPanel);
Ext.ns('Sch.gantt.plugins');
Sch.gantt.plugins.DragDrop = function (a) {
    Ext.apply(this, a);
    Sch.gantt.plugins.DragDrop.superclass.constructor.call(this)
};
Ext.extend(Sch.gantt.plugins.DragDrop, Ext.util.Observable, {
    useTooltip: true,
    validatorFn: function (a, b, c, e) {
        return true
    },
    validatorFnScope: null,
    init: function (g) {
        this.grid = g;
        this.ddGroup = g.id;
        g.onRender = g.onRender.createSequence(this.onRender, this);
        g.on('beforedestroy', this.cleanUp, this)
    },
    cleanUp: function () {
        this.grid.dragZone.destroy()
    },
    onRender: function () {
        this.setupDragZone()
    },
    getItemDepth: 5,
    setupDragZone: function () {
        var f = this,
            g = this.grid,
            v = g.getView(),
            sm = g.getSelectionModel();
        if (this.useTooltip) {
            this.tip = new Sch.gantt.plugins.Tooltip({}, g)
        }
        g.dragZone = new Sch.gantt.DragZone(v.scroller, {
            ddGroup: this.ddGroup,
            containerScroll: true,
            onDragOver: function (e, a) {
                var x = this.proxy.el.getX() + (g.isMilestone(this.dragData.record) ? 8 : 0),
                    start = g.getTimeFromX2(x),
                    data = this.dragData;
                Ext.fly(data.sourceNode).hide();
                if (!start) return;
                var b = g.floorDate(start);
                data.start = b;
                if (f.useTooltip) {
                    var c = b.add(Date.MINUTE, this.dragData.duration),
                        valid = f.validatorFn.call(f.validatorFnScope || f, this.dragData.record, b, this.dragData.duration, e) !== false;
                    f.tip.update(start, c, valid)
                }
            },
            onStartDrag: function () {
                var a = Ext.get(this.dragData.sourceNode);
                if (f.useTooltip) {
                    var r = this.dragData.record,
                        start = r.get('StartDate'),
                        end = r.get('EndDate');
                    f.tip.show(a);
                    f.tip.update(start, end, true)
                }
                this.constrainTo(a.up('tr'));
                g.fireEvent('dndstart', g, this.dragData.record)
            },
            getDragData: function (e) {
                var a = e.getTarget(g.eventSelector, f.getItemDepth);
                if (a) {
                    var b = Ext.get(a);
                    eventEl = b.is(g.eventSelector) ? a : b.up(g.eventSelector).dom;
                    if (!sm.isSelected(eventEl)) {
                        sm.select(eventEl, sm.multiSelect, true)
                    }
                    var c = g.getEventRecordFromDomId(eventEl.id);
                    if (e.getTarget().className.match('x-resizable-handle') || g.fireEvent('beforednd', g, c, e) === false) {
                        return null
                    }
                    var d = a.cloneNode(true);
                    d.id = Ext.id();
                    return {
                        sourceNode: a,
                        repairXY: Ext.fly(a).getXY(),
                        ddel: d,
                        record: c,
                        duration: Date.getDurationInMinutes(c.get('StartDate'), c.get('EndDate'))
                    }
                }
                return null
            },
            afterRepair: function () {
                Ext.fly(this.dragData.sourceNode).show();
                this.dragging = false
            },
            getRepairXY: function () {
                g.fireEvent('afterdnd', g);
                return this.dragData.repairXY
            },
            onDragDrop: function (e, a) {
                var b = this.cachedTarget || Ext.dd.DragDropMgr.getDDById(a),
                    data = this.dragData,
                    start = data.start;
                if (start) {
                    var c = start.add(Date.MINUTE, data.duration),
                        valid = false;
                    if (start && f.validatorFn.call(f.validatorFnScope || f, data.record, start, data.duration) !== false) {
                        data.record.beginEdit();
                        data.record.set('StartDate', start);
                        data.record.set('EndDate', c);
                        data.record.endEdit();
                        valid = true;
                        g.getSelectionModel().clearSelections();
                        g.fireEvent('drop', g, data.record)
                    }
                }
                if (f.useTooltip) {
                    f.tip.hide()
                }
                g.fireEvent('afterdnd', g);
                if (valid) {
                    this.onValidDrop(b, e, a)
                } else {
                    this.onInvalidDrop(b, e, a)
                }
            }
        })
    }
});
Sch.DragProxy = Ext.extend(Ext.dd.StatusProxy, {
    constructor: function (a) {
        Ext.apply(this, a);
        this.id = this.id || Ext.id();
        this.el = new Ext.Layer({
            dh: {
                id: this.id,
                tag: "div",
                cls: "sch-dragproxy x-dd-drag-proxy",
                children: [{
                    tag: "div",
                    cls: "x-dd-drag-ghost"
                }]
            },
            shadow: false
        });
        this.ghost = Ext.get(this.el.dom.childNodes[0]);
        this.dropStatus = this.dropNotAllowed
    },
    reset: function (a) {
        this.el.dom.className = "sch-dragproxy x-dd-drag-proxy " + this.dropNotAllowed;
        this.dropStatus = this.dropNotAllowed;
        if (a) {
            this.ghost.update("")
        }
    }
});
Sch.gantt.DragZone = Ext.extend(Ext.dd.DragZone, {
    constructor: function (a, b) {
        b.proxy = new Sch.DragProxy({
            shadow: false,
            dropAllowed: Ext.dd.StatusProxy.prototype.dropAllowed + " sch-dragproxy",
            dropNotAllowed: Ext.dd.StatusProxy.prototype.dropNotAllowed + " sch-dragproxy"
        });
        Sch.gantt.DragZone.superclass.constructor.apply(this, arguments);
        this.scroll = false;
        this.isTarget = true;
        this.ignoreSelf = false
    },
    autoOffset: function (x, y) {
        var a = this.dragData.repairXY;
        var b = x - a[0];
        var c = y - a[1];
        this.setDelta(b, c)
    },
    constrainTo: function (a) {
        var b = Ext.get(this.dragData.sourceNode).getBox(),
            ce = Ext.get(a),
            cd = ce.dom,
            xy = ce.getXY(),
            c = {
                x: xy[0],
                y: xy[1],
                width: cd.clientWidth,
                height: cd.clientHeight
            };
        this.resetConstraints();
        this.initPageY = c.y;
        this.setYConstraint(0, 0, this.yTickSize)
    }
});
Ext.ns('Sch.gantt.plugins');
Sch.gantt.plugins.LabelEditor = function (a) {
    Ext.apply(this, a);
    Sch.gantt.plugins.LabelEditor.superclass.constructor.call(this, a)
};
Ext.extend(Sch.gantt.plugins.LabelEditor, Ext.util.Observable, {
    editLeft: function (a) {
        var b = this.grid.getElementFromEventRecord(a).up(this.grid.eventWrapSelector);
        this.editor.startEdit(b.child("." + this.leftLabelCls));
        this.record = a;
        this.editingLeft = true
    },
    editRight: function (a) {
        var b = this.grid.getElementFromEventRecord(a).up(this.grid.eventWrapSelector);
        this.editor.startEdit(b.child("." + this.rightLabelCls));
        this.record = a;
        this.editingLeft = false
    },
    delegate: '.sch-gantt-label',
    leftLabelCls: 'sch-gantt-label-left',
    rightLabelCls: 'sch-gantt-label-right',
    editorCfg: {
        shadow: false,
        completeOnEnter: true,
        cancelOnEsc: true,
        autoSize: 'width',
        ignoreNoChange: true
    },
    fieldCfg: {
        allowBlank: false,
        xtype: 'textfield',
        selectOnFocus: true
    },
    init: function (d) {
        this.editor = new Ext.Editor(Ext.apply({
            alignment: 'r-r',
            field: this.fieldCfg,
            listeners: {
                'beforecomplete': function (a, b, c) {
                    return d.fireEvent('labeledit_beforecomplete', d, b, c, this.record)
                },
                'complete': {
                    fn: function (a, b, c) {
                        this.record.set(this.editingLeft ? d.leftLabelField : d.rightLabelField, b);
                        d.fireEvent('labeledit_complete', d, b, c, this.record)
                    },
                    scope: this
                }
            }
        }, this.editorCfg));
        this.grid = d;
        d.on('render', this.onGridRender, this)
    },
    onGridRender: function (g) {
        g.getView().mainBody.on('dblclick', function (e, t) {
            var a = t.className.match(this.leftLabelCls);
            this.editor.startEdit(t);
            this.record = g.getEventRecordFromElement(t);
            this.editingLeft = !! a
        }, this, {
            delegate: this.delegate
        })
    }
});
Ext.ns('Sch.gantt.plugins');
Sch.gantt.plugins.TaskContextMenu = function (a) {
    Ext.apply(this, a);
    Sch.gantt.plugins.TaskContextMenu.superclass.constructor.call(this, a)
};
Ext.extend(Sch.gantt.plugins.TaskContextMenu, Ext.util.Observable, {
    texts: {
        newTaskText: 'New task',
        newMilestoneText: 'New milestone',
        deleteTask: 'Delete task',
        editLeftLabel: 'Edit left label',
        editRightLabel: 'Edit right label',
        add: 'Add...',
        deleteDependency: 'Delete dependency...',
        addTaskAbove: 'Task above',
        addTaskBelow: 'Task below',
        addMilestone: 'Milestone',
        addSubtask: 'Sub-task',
        addSuccessor: 'Successor',
        addPredecessor: 'Predecessor'
    },
    itemPlus : ['-', {
        id: 'editLeftLabel'
    }, {
        id: 'editRightLabel'
    }],
    items: [{
        id: 'add',
        menu: {
            plain: true,
            items: [{
                id: 'addTaskAbove',
                hidden : true,
                text: Sch.gantt.plugins.TaskContextMenu.prototype.addTaskAbove
            }, {
                id: 'addTaskBelow',
                hidden : true,
                text: Sch.gantt.plugins.TaskContextMenu.prototype.addTaskBelow
            }, {
                id: 'addMilestone',
                hidden : true,
                text: Sch.gantt.plugins.TaskContextMenu.prototype.milestone
            }, {
                id: 'addSubtask',
                text: Sch.gantt.plugins.TaskContextMenu.prototype.subtask
            }, {
                id: 'addSuccessor',
                hidden : true,
                text: Sch.gantt.plugins.TaskContextMenu.prototype.successor
            }, {
                id: 'addPredecessor',
                hidden : true,
                text: Sch.gantt.plugins.TaskContextMenu.prototype.predecessor
            }]
        }
    }, {
        id: 'deleteDependency',
        menu: {
            plain: true
        }
    },'-',{
        id: 'deleteTask'
    }],
    populateDependencyMenu: function (d) {
        var g = this.grid,
            taskStore = g.store,
            dependencies = g.getDependenciesForTask(this.rec),
            depStore = g.dependencyStore;
        d.removeAll();
        if (dependencies.length === 0) {
            return false
        }
        dependencies.each(function (b) {
            var c = b.get('From'),
                task = g.getTaskById(c == this.rec.id ? b.get('To') : c),
                text = Ext.util.Format.ellipsis(task.get('Name'), 30);
            d.addMenuItem({
                depId: b.id,
                text: text,
                scope: this,
                handler: function (a) {
                    depStore.removeAt(depStore.indexOfId(a.depId))
                }
            })
        }, this)
    },
    mouseOver: function (a, e, b) {
        if (b) {
            this.grid.highlightDependency(b.depId)
        }
    },
    mouseOut: function (a, e, b) {
        if (b) {
            this.grid.unhighlightDependency(b.depId)
        }
    },
    cleanUp: function () {
        if (this.menu) {
            this.menu.destroy()
        }
    },
    init: function (b) {
    	this.addEvents('beforecontextmenu');
        this.grid = b;
        this.grid.on('destroy', this.cleanUp, this);
        this.items = this.items.concat(this.itemPlus);
        Ext.each(this.items, function (o) {
            o.text = o.text || this.texts[o.id];
            if (o.id === 'add') {
                Ext.each(o.menu.items, function (a) {
                    a.text = this.texts[a.id]
                }, this);
                o.menu.listeners = {
                    itemclick: {
                        fn: this.onItemClick,
                        scope: this
                    }
                }
            } else if (o.id === 'deleteDependency') {
                o.menu.listeners = {
                    beforeshow: {
                        fn: this.populateDependencyMenu,
                        scope: this
                    },
                    mouseover: {
                        fn: this.mouseOver,
                        scope: this
                    },
                    mouseout: {
                        fn: this.mouseOut,
                        scope: this
                    }
                }
            }
        }, this);
        b.on('eventcontextmenu', this.onEventContextMenu, this)
    },
    onEventContextMenu: function (g, a, e) {
        e.stopEvent();
        if(this.grid.fnEventEditable(g, a) !== false){
	        if (!this.menu) {
	            this.menu = new Ext.menu.Menu({
	                plain: true,
	                items: this.items
	            });
	            this.menu.on('itemclick', this.onItemClick, this)
	        }
	        this.rec = a;
	        if(this.fireEvent('beforecontextmenu', this, this.menu, this.rec) !== false){
	            this.menu.showAt(e.getXY())
	        }
        }
    },
    onItemClick: function (a, e) {
        this.actions[a.id] && this.actions[a.id].call(this)
    },
    copyTask: function (a) {
        var s = a.store,
            newTask = new s.recordType({
                PercentDone: 0,
                Name: this.texts.newTaskText,
                StartDate: a.get('StartDate'),
                EndDate: a.get('EndDate'),
                ParentId: a.get('ParentId'),
                IsLeaf: true
            });
        return newTask
    },
    actions: {
        deleteTask: function () {
            this.grid.store.remove(this.rec)
        },
        editLeftLabel: function () {
            this.grid.editLeftLabel(this.rec)
        },
        editRightLabel: function () {
            this.grid.editRightLabel(this.rec)
        },
        addTaskAbove: function () {
            var s = this.rec.store,
                newTask = this.copyTask(this.rec);
            s.insert(s.indexOf(this.rec), newTask)
        },
        addTaskBelow: function () {
            var s = this.rec.store,
                newTask = this.copyTask(this.rec),
                insertIndex;
            if (s.isLeafNode(this.rec)) {
                insertIndex = s.indexOf(this.rec) + 1
            } else {
                var a = s.getNodeNextSibling(this.rec);
                insertIndex = a ? s.indexOf(a) : s.getCount()
            }
            s.insert(insertIndex, newTask)
        },
        addSubtask: function () {
            var s = this.rec.store,
                newTask = this.copyTask(this.rec);
            this.rec.set(this.rec.store.leaf_field_name, false);
            s.addToNode(this.rec, newTask);
            s.expandNode(this.rec)
        },
        addSuccessor: function () {
            var s = this.rec.store,
                depStore = this.grid.dependencyStore,
                index = this.rec.store.indexOf(this.rec),
                newTask = this.copyTask(this.rec);
            newTask.set('StartDate', this.rec.get('EndDate'));
            newTask.set('EndDate', this.rec.get('EndDate').add(Date.DAY, 1));
            s.insert(index + 1, newTask);
            depStore.add(new depStore.recordType({
                From: this.rec.id,
                To: newTask.id,
                Type: Sch.Dependency.EndToStart
            }))
        },
        addPredecessor: function () {
            var s = this.rec.store,
                depStore = this.grid.dependencyStore,
                index = this.rec.store.indexOf(this.rec),
                newTask = this.copyTask(this.rec),
                newEnd = this.rec.get('StartDate');
            newTask.set('EndDate', newEnd);
            newTask.set('StartDate', newEnd.add(Date.DAY, -1));
            s.insert(index, newTask);
            depStore.add(new depStore.recordType({
                From: newTask.id,
                To: this.rec.id,
                Type: Sch.Dependency.EndToStart
            }))
        },
        addMilestone: function () {
            var s = this.rec.store,
                newMilestone = this.copyTask(this.rec);
            index = this.rec.store.indexOf(this.rec);
            newMilestone.set('StartDate', newMilestone.get('EndDate'));
            s.insert(index + 1, newMilestone)
        }
    }
});
Ext.ns('Sch.gantt.plugins');
Sch.gantt.plugins.Tooltip = function (a, b) {
    Ext.apply(this, a);
    this.grid = b;
    Sch.gantt.plugins.Tooltip.superclass.constructor.call(this)
};
Ext.extend(Sch.gantt.plugins.Tooltip, Ext.ToolTip, {
    showClock: false,
    startText: 'Starts: ',
    endText: 'Ends: ',
    initComponent: function () {
        if (!this.template) {
            if (this.showClock) {
                this.template = new Ext.Template('<div class="sch-timetipwrap {cls}">', '<div class="sch-clock">', '<img src="' + Ext.BLANK_IMAGE_URL + '" class="sch-hourIndicator" style="-moz-transform: rotate({startHourDegrees}deg);-webkit-transform: rotate({startHourDegrees}deg)"/>', '<img src="' + Ext.BLANK_IMAGE_URL + '" class="sch-minuteIndicator" style="-moz-transform: rotate({startMinuteDegrees}deg);-webkit-transform: rotate({startMinuteDegrees}deg)"/>', '{startText}', '</div>', '<div class="sch-clock">', '<img src="' + Ext.BLANK_IMAGE_URL + '" class="sch-hourIndicator" style="-moz-transform: rotate({endHourDegrees}deg);-webkit-transform: rotate({endHourDegrees}deg)"/>', '<img src="' + Ext.BLANK_IMAGE_URL + '" class="sch-minuteIndicator" style="-moz-transform: rotate({endMinuteDegrees}deg);-webkit-transform: rotate({endMinuteDegrees}deg)"/>', '{endText}', '</div>', '</div>')
            } else {
                this.template = new Ext.Template('<div class="sch-timetipwrap {cls}">', '<div>', '{startText}', '</div>', '<div>', '{endText}', '</div>', '</div>')
            }
        }
        this.template.compile();
        Sch.gantt.plugins.Tooltip.superclass.initComponent.apply(this, arguments)
    },
    cls: 'sch-tip',
    width: 145,
    height: 40,
    autoHide: false,
    anchor: 'b-tl',
    update: function (a, b, c) {
        var d = this.getTipData(a, b, c);
        Sch.gantt.plugins.Tooltip.superclass.update.call(this, this.template.apply(d))
    },
    getTipData: function (a, b, c) {
        var g = this.grid,
            roundedStart = g.floorDate(a),
            startText = this.startText + g.getFormattedDate(a, 'floor'),
            roundedEnd, endText = '&nbsp;';
        if (b - a > 0) {
            roundedEnd = g.floorDate(b);
            endText = this.endText + g.getFormattedEndDate(roundedEnd)
        }
        var d = {
            cls: c ? 'sch-tip-ok' : 'sch-tip-notok',
            startText: startText,
            endText: endText
        };
        if (this.showClock) {
            Ext.apply(d, {
                startHourDegrees: roundedStart.getHours() * 30,
                startMinuteDegrees: roundedStart.getMinutes() * 6
            });
            if (b) {
                Ext.apply(d, {
                    endHourDegrees: roundedEnd.getHours() * 30,
                    endMinuteDegrees: roundedEnd.getMinutes() * 6
                })
            }
        }
        return d
    },
    show: function (a) {
        this.anchorTarget = a;
        if (!this.rendered) {
            var b = new Date();
            this.html = this.template.apply(this.getTipData(b, b, true))
        }
        Sch.gantt.plugins.Tooltip.superclass.show.call(this)
    }
});
Ext.ns('Sch.gantt.plugins');
Sch.gantt.plugins.CurrentTimeLine = function (a, b) {
    Ext.apply(this, a);
    this.grid = b;
    Sch.gantt.plugins.CurrentTimeLine.superclass.constructor.call(this)
};
Ext.extend(Sch.gantt.plugins.CurrentTimeLine, Sch.plugins.Lines, {
    tooltipText: 'Current time',
    updateInterval: 60000,
    autoUpdate: true,
    init: function () {
        var a = new Ext.data.JsonStore({
            fields: ['Date', 'Cls', 'Text'],
            data: [{
                Date: new Date(),
                Cls: 'sch-todayLine',
                Text: this.tooltipText
            }]
        });
        if (this.autoUpdate) {
            var b = new Ext.util.TaskRunner();
            b.start({
                run: function () {
                    a.getAt(0).set('Date', new Date())
                },
                interval: this.updateInterval
            })
        }
        this.store = a;
        Sch.gantt.plugins.CurrentTimeLine.superclass.init.apply(this, arguments)
    }
});
if (Sch.gantt.plugins.Resize) {
    Sch.gantt.plugins.Resize.prototype.startText = '开始:';
    Sch.gantt.plugins.Resize.prototype.durationText = '持续:';
    Sch.gantt.plugins.Resize.prototype.dayText = '天'
}
if (Sch.DependencyDragDrop) {
    Sch.DependencyDragDrop.prototype.fromText = '从: <strong>{0}</strong> {1}<br/>';
    Sch.DependencyDragDrop.prototype.toText = '到: <strong>{0}</strong> {1}';
    Sch.DependencyDragDrop.prototype.startText = '开始';
    Sch.DependencyDragDrop.prototype.endText = '结束'
}
if (Sch.gantt.plugins.Tooltip) {
    Sch.gantt.plugins.Tooltip.prototype.startText = '从: ';
    Sch.gantt.plugins.Tooltip.prototype.endText = '到: '
}
if (Sch.gantt.plugins.TaskContextMenu) {
    Sch.gantt.plugins.TaskContextMenu.prototype.texts = {
        newTaskText: '新任务',
        newMilestoneText: '新建里程碑',
        deleteTask: '删除任务',
        editLeftLabel: '修改任务名称',
        editRightLabel: '修改任务责任人',
        add: '创建...',
        deleteDependency: '删除关联...',
        addTaskAbove: '上一任务',
        addTaskBelow: '下一任务',
        addMilestone: '里程碑',
        addSubtask: '子任务',
        addSuccessor: '后置任务',
        addPredecessor: '前置任务'
    }
}
if (Sch.plugins.EventEditor) {
	Sch.plugins.EventEditor.prototype.saveText = "确定";
	Sch.plugins.EventEditor.prototype.cancelText = "取消";
	Sch.plugins.EventEditor.prototype.hoursText = "天";
}
Ext.ns('Ext.ux.form');
Ext.ux.form.DateTime = Cls.form.DateTimeField;