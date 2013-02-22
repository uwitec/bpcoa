Ext.apply(Date.prototype, {
    betweenLesser: function (a, b) {
        var t = this.getTime();
        return a.getTime() <= t && t < b.getTime()
    },
    add: function (a, b) {
        var d = this.clone();
        if (!a || b === 0) return d;
        switch (a.toLowerCase()) {
        case Date.MILLI:
            d.setMilliseconds(this.getMilliseconds() + b);
            break;
        case Date.SECOND:
            d.setSeconds(this.getSeconds() + b);
            break;
        case Date.MINUTE:
            d.setMinutes(this.getMinutes() + b);
            break;
        case Date.HOUR:
            d.setHours(this.getHours() + b);
            break;
        case Date.DAY:
            d.setDate(this.getDate() + b);
            break;
        case Date.WEEK:
            d.setDate(this.getDate() + b * 7);
            break;
        case Date.MONTH:
            var c = this.getDate();
            if (c > 28) {
                c = Math.min(c, this.getFirstDateOfMonth().add('mo', b).getLastDateOfMonth().getDate())
            }
            d.setDate(c);
            d.setMonth(this.getMonth() + b);
            break;
        case Date.QUARTER:
            d = d.add(Date.MONTH, 3 * b);
            break;
        case Date.YEAR:
            d.setFullYear(this.getFullYear() + b);
            break
        }
        return d
    },
    round: function (a) {
        var c = this.clone(),
            h = this.getHours(),
            min = this.getMinutes(),
            roundedMinutes = Math.round(((h * 60) + min) / a) * a,
            wholeHours = roundedMinutes % 60;
        c.setHours(wholeHours);
        c.setMinutes(roundedMinutes - (60 * wholeHours));
        return c
    },
    floor: function (a) {
        var c = this.clone(),
            h = this.getHours(),
            min = this.getMinutes(),
            roundedMinutes = Math.floor(((h * 60) + min) / a) * a,
            wholeHours = roundedMinutes % 60;
        c.setHours(wholeHours);
        c.setMinutes(roundedMinutes - (60 * wholeHours));
        return c
    }
});
Ext.applyIf(Date, {
    isSameDay: function (a, b) {
        return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate()
    },
    getDurationInMinutes: function (a, b) {
        return (b - a) / 60000
    },
    getDurationInHours: function (a, b) {
        return (b - a) / 3600000
    },
    getDurationInDays: function (a, b) {
        return (b - a) / 86400000
    },
    getDurationInBusinessDays: function (a, b) {
        var c = Math.round((b - a) / 86400000),
            nbrBusinessDays = 0,
            d;
        for (var i = 0; i < c; i++) {
            d = a.add(Date.DAY, i).getDay();
            if (d !== 6 && d !== 0) {
                nbrBusinessDays++
            }
        }
        return nbrBusinessDays
    },
    getDurationInMonths: function (a, b) {
        return ((b.getFullYear() - a.getFullYear()) * 12) + (b.getMonth() - a.getMonth())
    },
    min: function (a, b) {
        return a < b ? a : b
    },
    max: function (a, b) {
        return a > b ? a : b
    },
    intersectSpans: function (a, b, c, d) {
        return a.betweenLesser(c, d) || c.betweenLesser(a, b)
    },
    WEEK: "w",
    QUARTER: "q"
});
Ext.override(Ext.data.Record, {
    set: function (a, b) {
        var c = Ext.isPrimitive(b) ? String : Ext.encode;
        if (c(this.data[a]) == c(b)) {
            return
        }
        this.dirty = true;
        if (!this.previous) {
            this.previous = {}
        }
        this.previous[a] = this.data[a];
        if (!this.modified) {
            this.modified = {}
        }
        if (this.modified[a] === undefined) {
            this.modified[a] = this.data[a]
        }
        this.data[a] = b;
        if (!this.editing) {
            this.afterEdit()
        }
    },
    afterEdit: function () {
        if (this.store) {
            this.store.afterEdit(this, this.previous)
        }
        delete this.previous
    },
    reject: function (a) {
        var m = this.modified,
            current = {};
        for (var n in m) {
            if (typeof m[n] != "function") {
                current[n] = this.data[n];
                this.data[n] = m[n]
            }
        }
        delete this.modified;
        this.dirty = false;
        this.editing = false;
        if (a !== true) {
            this.afterReject(current)
        }
    },
    afterReject: function (a) {
        if (this.store) {
            this.store.afterReject(this, a)
        }
    }
});
Ext.override(Ext.data.Store, {
    afterEdit: function (a, b) {
        if (this.modified.indexOf(a) == -1) {
            this.modified.push(a)
        }
        this.fireEvent('update', this, a, Ext.data.Record.EDIT, b)
    },
    afterReject: function (a, b) {
        this.modified.remove(a);
        this.fireEvent('update', this, a, Ext.data.Record.REJECT, b)
    }
});
Ext.override(Ext.grid.ColumnModel, {
    setConfig: function (a, b, d) {
        var i, c, len;
        if (!b) {
            delete this.totalWidth;
            if (Ext.grid.Column.prototype.destroy && !d) {
                for (i = 0, len = this.config.length; i < len; i++) {
                    this.config[i].destroy()
                }
            }
        }
        this.defaults = Ext.apply({
            width: this.defaultWidth,
            sortable: this.defaultSortable
        }, this.defaults);
        this.config = a;
        this.lookup = {};
        for (i = 0, len = a.length; i < len; i++) {
            c = Ext.applyIf(a[i], this.defaults);
            if (Ext.isEmpty(c.id)) {
                c.id = i
            }
            if (!c.isColumn) {
                var e = Ext.grid.Column.types[c.xtype || 'gridcolumn'];
                c = new e(c);
                a[i] = c
            }
            this.lookup[c.id] = c
        }
        if (!b) {
            this.fireEvent('configchange', this)
        }
    }
});
if (Ext.ux && Ext.ux.grid && Ext.ux.grid.LockingColumnModel) {
    Ext.override(Ext.ux.grid.LockingColumnModel, {
        getLockedCount: function () {
            for (var i = 0, len = this.config.length; i < len; i++) {
                if (!this.isLocked(i)) {
                    return i
                }
            }
            return len
        }
    })
}
Ext.override(Ext.dd.DragZone, {
    destroy: Ext.dd.DragZone.prototype.destroy.createInterceptor(function () {
        if (this.containerScroll) {
            Ext.dd.ScrollManager.unregister(this.el)
        }
    })
});
Ext.getMajorVersion = function () {
    return Math.abs(this.version.split('.')[0])
};
Ext.getMinorVersion = function () {
    return Math.abs(this.version.split('.')[1])
};
Ext.getRevision = function () {
    return Math.abs(this.version.split('.')[2])
};
if (Ext.ux && Ext.ux.form && Ext.ux.form.SpinnerField && Ext.ux.form.SpinnerField.prototype.onBlur === Ext.emptyFn) {
    Ext.ux.form.SpinnerField.prototype.onBlur = Ext.ux.form.SpinnerField.superclass.onBlur
}
Ext.ns('Sch');
Sch.ColumnFactory = {
    defaults: {
        align: 'center',
        menuDisabled: true,
        hideable: false,
        resizable: false,
        sortable: false,
        headerCls: 'sch-timeheader '
    },
    createColumns: function (a, b, c, d) {
        if (a > b || !this.columnConstructors[c]) {
            throw 'Invalid parameters passed to createColumns';
        }
        return this.columnConstructors[c].call(this, a, b, d)
    },
    createColumnsInternal: function (a, b, c, d, e, f) {
        var g = [],
            cursor = a.clone(),
            intervalEnd, colCfg;
        if (typeof e !== "function") {
            f = e;
            e = null
        }
        while (cursor < b) {
            if (typeof c == "number") {
                intervalEnd = cursor.add(Date.SECOND, c)
            } else {
                intervalEnd = cursor.add(c, 1)
            }
            if (!e || e.call(this, cursor, intervalEnd) !== true) {
                colCfg = Ext.apply({
                    start: cursor,
                    end: intervalEnd
                }, f, this.defaults);
                d.call(this, cursor, intervalEnd, colCfg);
                g.push(colCfg)
            }
            cursor = intervalEnd
        }
        return g
    },
    headerRenderers: {
        minute: function (a, b, c) {
            c.header = a.format('i')
        },
        quarterMinute: function (a, b, c) {
            c.headerCls += 'sch-quarterminuteheader';
            c.header = '<table class="quarterMinuteIndicator" cellpadding="0" cellspacing="0"><tr><td>00</td><td>15</td><td>30</td><td>45</td></tr></table>'
        },
        hourMinute: function (a, b, c) {
            c.header = a.format('H:i')
        },
        day: function (a, b, c) {
            c.header = String.format('{0} {1}/{2}', Date.getShortDayName([a.getDay()]), a.getDate(), a.getMonth() + 1)
        },
        fulldate: function (a, b, c) {
            c.header = a.format('d F Y')
        },
        dayLetter: function (a, b, c) {
            c.headerCls += 'sch-dayheadercell-' + a.getDay();
            c.header = Date.dayNames[a.getDay()].substring(0, 1)
        },
        dayNumber: function (a, b, c) {
            c.headerCls += 'sch-dayheadercell-' + a.getDay();
            c.header = a.getDate()
        },
        dayHours: function (a, b, c) {
            c.headerCls += 'sch-dayheader';
            c.header = '<table class="hourIndicator" cellpadding="0" cellspacing="0"><tr><td></td><td>3</td><td>6</td><td>9</td><td>12</td><td>15</td><td>18</td><td>21</td></tr></table>'
        },
        week: function (a, b, c) {
            c.headerCls += 'sch-weekheader';
            var w = a.getWeekOfYear(),
                y = (w === 1 && a.getMonth() > 0) ? (a.getFullYear() + 1) : a.getFullYear();
            c.header = ((w < 10) ? ('0' + w) : w)
        },
        weekMonthYear: function (a, b, c) {
            c.headerCls += 'sch-weekheader';
            var w = a.getWeekOfYear();
            c.header = a.getFullYear() + ' ' + Date.getShortMonthName(a.getMonth()) + ' ' + ((w < 10) ? '0' : '') + w + '周'
        },
        dayNumbers: function () {
            var e = new Ext.XTemplate('<table class="sch-dayIndicator" cellpadding="0" cellspacing="0"><tr class="days">' + '<tpl for="."><td class="sch-dayheadercell-{dayOfWeek}">{dayNumber}</td></tpl>' + '</tr></table>').compile();
            return function (a, b, c) {
                c.headerCls += 'sch-daytableheader';
                var d = [],
                    nbrDays = Math.round(Date.getDurationInDays(a, b)),
                    dt = a.clone();
                for (var i = 0; i < nbrDays; i++) {
                    d.push({
                        dayOfWeek: dt.getDay(),
                        dayNumber: dt.getDate()
                    });
                    dt = dt.add(Date.DAY, 1)
                }
                c.header = e.apply(d)
            }
        }(),
        dayLetters: function () {
            var e = new Ext.XTemplate('<table class="sch-dayIndicator" cellpadding="0" cellspacing="0"><tr class="days">' + '<tpl for="."><td class="sch-dayheadercell-{dayOfWeek} {cls}">{dayLetter}</td></tpl>' + '</tr></table>').compile();
            return function (a, b, c) {
                c.headerCls += 'sch-daytableheader';
                var d = [],
                    nbrDays = Math.round(Date.getDurationInDays(a, b)),
                    dt = a.clone();
                for (var i = 0; i < nbrDays; i++) {
                    d.push({
                        dayOfWeek: dt.getDay(),
                        dayLetter: Date.dayNames[dt.getDay()].substring(0, 1)
                    });
                    dt = dt.add(Date.DAY, 1)
                }
                d[0].cls = 'sch-headercell-first';
                d[d.length - 1].cls = 'sch-headercell-last';
                c.header = e.apply(d)
            }
        }(),
        month: function (a, b, c) {
            c.headerCls += 'sch-monthheader';
            c.header = String.format('{1}年 {0}', Date.getShortMonthName(a.getMonth()), a.getFullYear())
        },
        monthDays: function (a, b, c) {
            c.headerCls += 'sch-monthheader';
            c.header = String.format('{0} {1}', Date.getShortMonthName(a.getMonth()), a.getFullYear())
        },
        quarter: function (a, b, c) {
            c.headerCls += 'sch-quarterheader';
            c.header = String.format('{1}年 {0}季度', Math.floor(a.getMonth() / 3) + 1, a.getFullYear())
        },
        year: function (a, b, c) {
            c.headerCls += 'sch-yearheader';
            c.header = a.getFullYear()
        }
    },
    columnConstructors: {
        minute: function (a, b, c) {
            var d = this.createColumnsInternal(a, b, Date.MINUTE, this.headerRenderers.hourMinute, c);
            return {
                columns: d
            }
        },
        quarterMinutes: function (a, b, c) {
            var d = this.createColumnsInternal(a, b, Date.HOUR, this.headerRenderers.quarterMinute, c);
            return {
                columns: d,
                rows: [Sch.ColumnFactory.rowConstructors.day.call(this, a, b), Sch.ColumnFactory.rowConstructors.hour.call(this, a, b)]
            }
        },
        hour: function (a, b, c) {
            var d = this.createColumnsInternal(a, b, Date.HOUR, this.headerRenderers.hourMinute, c);
            return {
                columns: d
            }
        },
        hourAndDay: function (a, b, c) {
            var d = this.createColumnsInternal(a, b, Date.HOUR, this.headerRenderers.hourMinute, c);
            return {
                columns: d,
                rows: [Sch.ColumnFactory.rowConstructors.day.call(this, a, b)]
            }
        },
        dayAndHours: function (a, b, c) {
            a.clearTime();
            b.clearTime();
            var d = this.createColumnsInternal(a, b, Date.DAY, this.headerRenderers.dayHours, c);
            return {
                columns: d,
                rows: [Sch.ColumnFactory.rowConstructors.day.call(this, a, b)]
            }
        },
        dayNoWeekends: function (c, e, f) {
            c.clearTime();
            e.clearTime();
            var g = this.createColumnsInternal(c, e, Date.DAY, this.headerRenderers.day, function (a, b) {
                var d = a.getDay();
                return d === 0 || d === 6
            }, f);
            return {
                columns: g
            }
        },
        day: function (a, b, c) {
            a.clearTime();
            b.clearTime();
            var d = this.createColumnsInternal(a, b, Date.DAY, this.headerRenderers.day, c);
            return {
                columns: d
            }
        },
        dayAndWeeks: function (a, b, c) {
            a.clearTime();
            b.clearTime();
            var d = this.createColumnsInternal(a, b, Date.DAY, this.headerRenderers.dayNumber, c);
            return {
                columns: d,
                rows: [Sch.ColumnFactory.rowConstructors.week.call(this, a, b, this.headerRenderers.week)]
            }
        },
        dayAndMonths: function (a, b, c) {
            a.clearTime();
            b.clearTime();
            var d = this.createColumnsInternal(a, b, Date.DAY, this.headerRenderers.dayNumber, c);
            return {
                columns: d,
                rows: [Sch.ColumnFactory.rowConstructors.month.call(this, a, b, this.headerRenderers.month)]
            }
        },
        dayWeekAndMonths: function (a, b, c) {
            a.clearTime();
            b.clearTime();
            b = a.add(Date.WEEK, Math.round(Date.getDurationInDays(a, b) / 7));
            var d = this.createColumnsInternal(a, b, Date.WEEK, this.headerRenderers.dayNumbers, c);
            return {
                columns: d,
                rows: [Sch.ColumnFactory.rowConstructors.month.call(this, a, b, this.headerRenderers.month), Sch.ColumnFactory.rowConstructors.week.call(this, a, b, this.headerRenderers.week)]
            }
        },
        week: function (a, b, c) {
            a.clearTime();
            b.clearTime();
            b = a.add(Date.WEEK, Math.round(Date.getDurationInDays(a, b) / 7));
            var d = this.createColumnsInternal(a, b, Date.WEEK, this.headerRenderers.week, c);
            return {
                columns: d
            }
        },
        weekAndMonths: function (a, b, c) {
            a.clearTime();
            b.clearTime();
            b = a.add(Date.WEEK, Math.round(Date.getDurationInDays(a, b) / 7));
            var d = this.createColumnsInternal(a, b, Date.WEEK, this.headerRenderers.week, c);
            return {
                columns: d,
                rows: [Sch.ColumnFactory.rowConstructors.month.call(this, a, b)]
            }
        },
        weekAndDays: function (a, b, c) {
            a.clearTime();
            b.clearTime();
            b = a.add(Date.WEEK, Math.round(Date.getDurationInDays(a, b) / 7));
            var d = this.createColumnsInternal(a, b, Date.WEEK, this.headerRenderers.dayNumbers, c);
            return {
                columns: d,
                rows: [Sch.ColumnFactory.rowConstructors.week.call(this, a, b, this.headerRenderers.weekMonthYear)]
            }
        },
        weekAndDayLetters: function (a, b, c) {
            a.clearTime();
            b.clearTime();
            b = a.add(Date.WEEK, Math.round(Date.getDurationInDays(a, b) / 7));
            var d = this.createColumnsInternal(a, b, Date.WEEK, this.headerRenderers.dayLetters, c);
            return {
                columns: d,
                rows: [Sch.ColumnFactory.rowConstructors.week.call(this, a, b, this.headerRenderers.fulldate)]
            }
        },
        month: function (a, b, c) {
            a.clearTime();
            b.clearTime();
            a.setDate(1);
            if (b.getDate() !== 1) {
                b.setDate(1);
                b = b.add(Date.MONTH, 1)
            }
            var d = this.createColumnsInternal(a, b, Date.MONTH, this.headerRenderers.month, c);
            return {
                columns: d
            }
        },
        monthAndDays: function (a, b, c) {
            a.clearTime();
            b.clearTime();
            a.setDate(1);
            if (b.getDate() !== 1) {
                b.setDate(1);
                b = b.add(Date.MONTH, 1)
            }
            var d = this.createColumnsInternal(a, b, Date.MONTH, this.headerRenderers.dayNumbers, c);
            return {
                columns: d,
                rows: [Sch.ColumnFactory.rowConstructors.fullmonth.call(this, a, b)]
            }
        },
        monthAndQuarters: function (a, b, c) {
            a.clearTime();
            b.clearTime();
            a.setDate(1);
            if (b.getDate() !== 1) {
                b.setDate(1);
                b = b.add(Date.MONTH, 1)
            }
            var d = this.createColumnsInternal(a, b, Date.MONTH, this.headerRenderers.month, c);
            return {
                columns: d,
                rows: [Sch.ColumnFactory.rowConstructors.quarter.call(this, a, b)]
            }
        },
        quarter: function (a, b, c) {
            a.clearTime();
            b.clearTime();
            a = new Date(a.getFullYear(), Math.floor(a.getMonth() / 3) * 3, 1);
            b = new Date(b.getFullYear(), Math.floor(b.getMonth() / 3) * 3, 1).add(Date.QUARTER, 1);
            var d = this.createColumnsInternal(a, b, Date.QUARTER, this.headerRenderers.month, defaults);
            return {
                columns: d
            }
        },
        year: function (a, b, c) {
            a.clearTime();
            a.setMonth(0);
            a.setDate(1);
            var d = this.createColumnsInternal(a, b, Date.YEAR, this.headerRenderers.year, c);
            return {
                columns: d
            }
        }
    },
    rowConstructors: {
        hour: function (a, b, c) {
            var d = Date.getDurationInHours(a, b),
                cols = [],
                dt, i, cfg, intervalEnd;
            for (i = 0; i < d; i++) {
                dt = a.add(Date.HOUR, i);
                intervalEnd = dt.add(Date.HOUR, 1);
                cfg = Ext.applyIf({
                    width: 1 / d,
                    align: 'center',
                    start: dt,
                    end: intervalEnd
                }, Sch.ColumnFactory.defaults);
                (c || this.headerRenderers.hourMinute).call(this, dt, intervalEnd, cfg);
                cols.push(cfg)
            }
            return cols
        },
        day: function (a, b, c) {
            var d = b - a,
                cols = [],
                dt = a,
                i, cfg, intervalEnd;
            while (dt < b) {
                intervalEnd = Date.min(dt.add(Date.DAY, 1).clearTime(), b);
                cfg = Ext.applyIf({
                    width: (intervalEnd - dt) / d,
                    align: 'center',
                    start: dt,
                    end: intervalEnd
                }, Sch.ColumnFactory.defaults);
                (c || this.headerRenderers.day).call(this, dt, intervalEnd, cfg);
                cols.push(cfg);
                dt = intervalEnd
            }
            return cols
        },
        week: function (a, b, c) {
            var d = [],
                i = 0,
                spanDays = Math.round(Date.getDurationInDays(a, b)),
                width, cursor = a.clone(),
                cfg, intervalEnd;
            while (cursor < b) {
                if (i === 0) {
                    width = Math.round(Date.getDurationInDays(a, a.add(Date.WEEK, 1))) / spanDays
                } else {
                    width = Math.min(7, Math.round(Date.getDurationInDays(cursor, b))) / spanDays
                }
                intervalEnd = cursor.add(Date.WEEK, 1);
                cfg = Ext.applyIf({
                    width: width,
                    align: 'center',
                    start: cursor,
                    end: intervalEnd
                }, Sch.ColumnFactory.defaults);
                (c || this.headerRenderers.week).call(this, cursor, intervalEnd, cfg);
                d.push(cfg);
                i++;
                cursor = cursor.add(Date.WEEK, 1)
            }
            return d
        },
        weekNoWeekends: function (a, b, c) {
            var d = [],
                i = 0,
                spanDays = Math.round(Date.getDurationInBusinessDays(a, b)),
                width, cursor = a.clone(),
                cfg, nbrDays, intervalEnd;
            while (cursor < b) {
                if (i === 0) {
                    nbrDays = 6 - cursor.getDay()
                } else {
                    nbrDays = Date.getDurationInBusinessDays(cursor, Date.min(b, cursor.add(Date.DAY, 5)))
                }
                intervalEnd = cursor.add(Date.WEEK, 1);
                cfg = Ext.applyIf({
                    width: nbrDays / spanDays,
                    align: 'center',
                    start: cursor,
                    end: intervalEnd
                }, Sch.ColumnFactory.defaults);
                (c || this.headerRenderers.week).call(this, cursor, intervalEnd, cfg);
                d.push(cfg);
                i++;
                cursor = cursor.add(Date.DAY, nbrDays + 2)
            }
            return d
        },
        month: function (a, b, c) {
            var d = Math.round(Date.getDurationInDays(a, b)),
                cols = [],
                dt = a,
                i, cfg, intervalEnd;
            while (dt < b) {
                intervalEnd = Date.min(new Date(dt.add(Date.MONTH, 1).setDate(1)), b);
                cfg = Ext.applyIf({
                    width: Math.round(Date.getDurationInDays(dt, intervalEnd)) / d,
                    align: 'center',
                    start: dt,
                    end: intervalEnd
                }, Sch.ColumnFactory.defaults);
                (c || this.headerRenderers.day).call(this, dt, intervalEnd, cfg);
                cols.push(cfg);
                dt = intervalEnd
            }
            return cols
        },
        fullmonth: function (a, b, c) {
            var d = Date.getDurationInMonths(a, b),
                cols = [],
                dt, i, cfg, intervalEnd;
            for (i = 0; i < d; i++) {
                dt = a.add(Date.MONTH, i);
                intervalEnd = dt.add(Date.MONTH, 1);
                cfg = Ext.applyIf({
                    width: 1 / d,
                    align: 'center',
                    start: dt,
                    end: intervalEnd
                }, Sch.ColumnFactory.defaults);
                (c || this.headerRenderers.month).call(this, dt, intervalEnd, cfg);
                cols.push(cfg)
            }
            return cols
        },
        quarter: function (a, b, c) {
            var d = Math.floor(a.getMonth() / 3) + 1,
                endQuarter = Math.floor(b.getMonth() / 3) + 1,
                spanQuarters = 4 * (b.getYear() - a.getYear()) + (endQuarter - d),
                spanMonths = Date.getDurationInMonths(a, b),
                startMonth = a.getMonth(),
                endMonth = b.getMonth(),
                firstDateOfStartQuarter = new Date(a.getFullYear(), Math.floor(startMonth / 3) * 3, 1),
                cols = [],
                dt = a.clone(),
                i, width, cfg, intervalEnd;
            if (d === endQuarter && a.getYear() === b.getYear()) {
                spanQuarters = 1
            } else {
                if (b.getMonth() % 3 === 0 && a.getMonth() % 3 > 0) {
                    spanQuarters--
                }
                if ((a.getMonth() % 3 > 0 || b.getMonth() % 3 > 0)) {
                    spanQuarters++
                }
            }
            dt = firstDateOfStartQuarter;
            for (i = 0; i < spanQuarters; i++) {
                if (i === 0) {
                    width = Date.getDurationInMonths(a, Date.min(firstDateOfStartQuarter.add(Date.MONTH, 3), b)) / spanMonths
                } else if (i === spanQuarters - 1) {
                    width = Date.getDurationInMonths(dt, b) / spanMonths
                } else {
                    width = Date.getDurationInMonths(dt, dt.add(Date.MONTH, 3)) / spanMonths
                }
                intervalEnd = dt.add(Date.MONTH, 3);
                cfg = Ext.applyIf({
                    width: width,
                    align: 'center',
                    start: dt,
                    end: intervalEnd
                }, Sch.ColumnFactory.defaults);
                (c || this.headerRenderers.quarter).call(this, dt, intervalEnd, cfg);
                cols.push(cfg);
                dt = dt.add(Date.MONTH, 3)
            }
            return cols
        }
    }
};
Ext.ns('Sch');
Sch.SchedulerPanel = Ext.extend(Ext.grid.GridPanel, {
    tooltipTpl: null,
    resizeHandles: 'right',
    enableEventDragDrop: true,
    enableDragCreation: true,
    startParamName: 'start',
    endParamName: 'end',
    allowOverlap: true,
    columnLines: true,
    fnEventEditable : function(a, b){
		return true;
	},
    dndValidatorFn: function (a, b, c, d, e) {
        return true
    },
    resizeValidatorFn: function (a, b, c, d, e) {
        return true
    },
    createValidatorFn: function (a, b, c, e) {
        return true
    },
    validatorFnScope: null,
    eventRenderer: Ext.emptyFn,
    eventBorderWidth: 2,
    timeColumnDefaults: {},
    trackMouseInTimeHeader: false,
    overClass: 'sch-event-hover',
    timeCellRenderer: Ext.emptyFn,
    resizeHandleHtml: '<div class="x-resizable-handle x-resizable-handle-{0}"></div>',
    getEventRecordFromElement: function (a) {
        var b = Ext.get(a);
        if (!b.is(this.eventSelector)) {
            b = b.up(this.eventSelector)
        }
        return this.getEventRecordFromDomId(b.id)
    },
    getEventRecordFromDomId: function (a) {
        var b = this.getEventIdFromDomNodeId(a);
        return this.eventStore.getAt(this.eventStore.findBy(function (r) {
            return b == r.id
        }))
    },
    getEventIdFromDomNodeId: function (a) {
        return a.substring(this.eventPrefix.length)
    },
    getElementFromEventId: function (a) {
        return Ext.get(this.eventPrefix + a)
    },
    getElementFromEventRecord: function (a) {
        return this.getElementFromEventId(a.id)
    },
    getXFromDate: function (a) {
        var b = this.getColumnModel(),
            count = b.getColumnCount();
        for (var i = this.nbrStaticColumns; i < count; i++) {
            if (a <= this.getColumnEnd(i)) {
                var c = a - this.getColumnStart(i),
                    timeInColumn = this.getColumnEnd(i) - this.getColumnStart(i);
                return this.view.getAccColumnWidth(i) + (c * b.getColumnWidth(i) / timeInColumn)
            }
        }
        return -1
    },
    getTimeFromDomEvent: function (e, a, b) {
        return this.getTimeFromX(e.getTarget('.sch-timetd', b || this.view.cellSelectorDepth), e.getPageX(), a)
    },
    getTimeFromX: function (a, x, b) {
        var c = typeof a === 'number' ? (a + this.nbrStaticColumns) : this.view.getCellIndex(a);
        if (c < 0 || c === false) return null;
        var d = this.getColumnModel().getColumnWidth(c),
            cellStart = this.getColumnStart(c),
            availableTimeInCell = Date.getDurationInMinutes(cellStart, this.getColumnEnd(c)),
            diffX = x - (this.view.mainBody.getX() + this.view.getAccColumnWidth(c)),
            diffInMinutes = (availableTimeInCell * diffX / d);
        if (b) {
            var e = this.getViewResolution();
            diffInMinutes = Math[b](diffInMinutes / e) * e
        }
        return cellStart.add(Date.MINUTE, diffInMinutes)
    },
    getTimeFromX2: function (x, a) {
        var b = this.getColumnModel(),
            timeColWidth = b.getColumnWidth(this.nbrStaticColumns),
            v = this.getView();
        x -= (v.mainBody.getX() + v.getAccColumnWidth(this.nbrStaticColumns));
        if (x < 0) return;
        var c = Math.floor(x / timeColWidth),
            diffX = x - (c * timeColWidth),
            colIndex = c + this.nbrStaticColumns,
            colCount = b.getColumnCount();
        if (colIndex > colCount) {
            return
        } else if (colIndex === colCount) {
            return this.getEnd()
        }
        var d = this.getColumnStart(colIndex),
            availableTimeInCell = Date.getDurationInMinutes(d, this.getColumnEnd(colIndex)),
            diffInMinutes = (availableTimeInCell * diffX / timeColWidth);
        if (a) {
            var e = this.getViewResolution();
            diffInMinutes = Math[a](diffInMinutes / e) * e
        }
        return d.add(Date.MINUTE, diffInMinutes)
    },
    roundDate: function (a) {
        return a.round(this.viewBehaviour.timeResolution)
    },
    floorDate: function (a) {
        return a.floor(this.viewBehaviour.timeResolution)
    },
    setEventTemplate: function (a) {
        this.eventTemplate = a
    },
    setEventRenderer: function (a) {
        this.eventRenderer = a
    },
    getSelectedRecords: function () {
        var r = [],
            s = this.getSelectionModel().selected.elements;
        for (var i = 0, len = s.length; i < len; i++) {
            r[r.length] = this.getEventRecordFromDomId(s[i].id)
        }
        return r
    },
    getFormattedDate: function (a, b) {
        var c = this.viewBehaviour;
        return a[b || 'floor'](c.timeResolution).format(c.dateFormat)
    },
    getFormattedEndDate: function (a, b) {
        var c = this.viewBehaviour;
        return (c.timeResolution === 1440 && a.getHours() === 0 ? a.add(Date.DAY, -1) : a)[b || 'floor'](c.timeResolution).format(c.dateFormat)
    },
    setView: function (a, b, c, d, e, f) {
        this.setViewInternal(a, b, c, d, e, f)
    },
    eventSelector: '.sch-event',
    getViewResolution: function () {
        return this.viewBehaviour.timeResolution
    },
    getRowIndex: function (t) {
        return this.view.findRowIndex(t)
    },
    constructor: function (a) {
        this.addEvents('eventclick', 'eventdblclick', 'eventcontextmenu', 'beforetooltipshow', 'beforeviewchange', 'viewchange', 'timeheaderdblclick', 'beforeresize', 'resizestart', 'partialresize', 'afterresize', 'beforednd', 'dndstart', 'drop', 'afterdnd', 'beforedragcreate', 'dragcreatestart', 'dragcreateend', 'afterdragcreate');
        a = a || {};
        if (a.plugins && !Ext.isArray(a.plugins)) {
            a.plugins = [a.plugins]
        }
        Ext.applyIf(a, {
            plugins: []
        });
        Ext.apply(this, a);
        if (!this.eventTemplate) {
            this.eventTemplate = new Ext.Template('<div id="{id}" style="width:{width}px;left:{leftOffset}px;{style}" class="sch-event {cls}">', (this.resizeHandles === 'both' || this.resizeHandles === 'left') ? String.format(this.resizeHandleHtml, 'west') : '', '<div class="sch-event-inner">{text}</div>', (this.resizeHandles === 'both' || this.resizeHandles === 'right') ? String.format(this.resizeHandleHtml, 'east') : '', '</div>').compile()
        }
        this.configureFunctionality();
        Sch.SchedulerPanel.superclass.constructor.call(this, a)
    },
    getView: function () {
        if (!this.view) {
            this.view = new Sch.SchedulerView(this.viewConfig)
        }
        return this.view
    },
    initComponent: function () {
        Ext.apply(this.timeColumnDefaults, {
            renderer: this.internalRenderer,
            scope: this
        });
        this.eventPrefix = Ext.id() + '-';
        if (this.autoViews && this.autoViews.length > 0) {
            this.eventStore.on({
                beforeload: this.onBeforeStoreLoad,
                scope: this
            });
            if (this.eventStore.proxy.request) {
                this.eventStore.proxy.request = this.eventStore.proxy.request.createInterceptor(function (a, b, c) {
                    this.reconfigureInternal(c)
                }, this)
            } else if (this.eventStore.proxy.load) {
                this.eventStore.proxy.load = this.eventStore.proxy.load.createInterceptor(function (a) {
                    this.reconfigureInternal(a)
                }, this)
            }
        }
        this.on({
            afterrender: this.onRender_,
            beforedestroy: this.onBeforeDestroy_,
            dndstart: this.onDragDropStart,
            afterdnd: this.onDragDropEnd,
            dragcreatestart: this.onDragCreateStart,
            afterdragcreate: this.onAfterDragCreate,
            headerdblclick: this.onHeaderDoubleClick,
            cellclick: function (g, r, c, e) {
                var t = e.getTarget(this.eventSelector);
                if (t) {
                    this.fireEvent('eventclick', this, this.getEventRecordFromDomId(t.id), t, e)
                }
            },
            celldblclick: function (g, r, c, e) {
                var t = e.getTarget(this.eventSelector);
                if (t) {
                    this.fireEvent('eventdblclick', this, this.getEventRecordFromDomId(t.id), e)
                }
            },
            cellcontextmenu: function (g, r, c, e) {
                var t = e.getTarget(this.eventSelector);
                if (t) {
                    this.fireEvent('eventcontextmenu', this, this.getEventRecordFromDomId(t.id), e)
                }
            },
            scope: this
        });
        if (!this.selModel && !this.disableSelection) {
            this.selModel = new Sch.EventSelectionModel()
        }
        Sch.SchedulerPanel.superclass.initComponent.call(this);
        var d = this.getColumnModel();
        this.nbrStaticColumns = d.getColumnCount();
        Ext.applyIf(d, {
            rows: []
        });
        this.on('render', function () {
            this.el.addClass('sch-schedulerpanel')
        }, this)
    },
    configureFunctionality: function () {
        var f = this.plugins,
            vfScope = this.validatorFnScope || this;
        if (this.resizeHandles !== 'none' && !this.resizePlug) {
            this.resizePlug = new Sch.plugins.Resize({
                validatorFn: function (a, b, c, d) {
                    return (this.allowOverlap || this.isDateRangeAvailable(c, d, b.id, a.get('Id'))) && this.resizeValidatorFn.apply(vfScope, arguments)
                },
                validatorFnScope: this
            });
            f.push(this.resizePlug)
        }
        if (this.enableEventDragDrop !== false && !this.dragdropPlug) {
            this.dragdropPlug = new Sch.plugins.DragDrop({
                validatorFn: function (a, b, c, d, e) {
                    return (this.allowOverlap || this.isDateRangeAvailable(c, c.add(Date.MINUTE, d), a[0].id, b.get('Id'))) && this.dndValidatorFn.apply(vfScope, arguments)
                },
                validatorFnScope: this
            });
            f.push(this.dragdropPlug)
        }
        if (this.enableDragCreation !== false && !this.dragCreatePlug) {
            this.dragCreatePlug = new Sch.plugins.DragCreator({
                validatorFn: function (a, b, c) {
                    return (this.allowOverlap || this.isDateRangeAvailable(b, c, null, a.get('Id'))) && this.createValidatorFn.apply(vfScope, arguments)
                },
                validatorFnScope: this
            });
            f.push(this.dragCreatePlug)
        }
    },
    reconfigureInternal: function (a) {
        var b = a[this.startParamName],
            endDate = a[this.endParamName],
            timeSpan = Math.floor(Date.getDurationInDays(b, endDate)),
            i = 0;
        for (i = 0; i < this.autoViews.length; i++) {
            if (timeSpan <= this.autoViews[i].timeSpan) {
                break
            }
        }
        var c = this.autoViews[Math.min(i, this.autoViews.length - 1)];
        this.setViewInternal(a[this.startParamName], a[this.endParamName], c.columnType, c.viewBehaviour, c.renderer)
    },
    onBeforeDestroy_: function () {
        if (this.tip) this.tip.destroy();
        if (this.eventStore.autoDestroy) this.eventStore.destroy()
    },
    onRender_: function (g) {
        var b = this.getView();
        if (b.columnDrag) {
            b.columnDrag.onBeforeDrag = function (a, e) {
                return !e.getTarget('.sch-timeheader')
            }
        }
        if (this.tooltipTpl) {
            this.setupTooltip()
        }
        if (this.viewModel) {
            var v = this.viewModel;
            this.setView(v.start, v.end, v.columnType, v.viewBehaviour, v.renderer)
        }
        if (this.overClass) {
            this.mon(this.getView().mainBody, {
                "mouseover": this.onMouseOver,
                "mouseout": this.onMouseOut,
                scope: this
            })
        }
    },
    tipCfg: {
        mouseOffset: [5, -50],
        cls: 'sch-tip',
        trackMouse: true,
        showDelay: 1000,
        autoHide: false,
        width: Ext.isIE ? 140 : undefined
    },
    setupTooltip: function () {
        var v = this.getView(),
            tipCfg = Ext.apply({
                renderTo: Ext.getBody(),
                delegate: this.eventSelector,
                target: v.mainBody,
                listeners: {
                    beforeshow: {
                        fn: function (a) {
                            if (!a.triggerElement.id) return false;
                            var b = this.getEventRecordFromDomId(a.triggerElement.id);
                            if (!b || this.fireEvent('beforetooltipshow', this, b) === false) return false;
                            a.update(this.tooltipTpl.apply(b.data));
                            return true
                        },
                        scope: this
                    }
                }
            }, this.tipCfg);
        this.tip = new Ext.ToolTip(tipCfg)
    },
    loadInterval: function (a, b) {
        var c = {};
        c[this.startParamName] = a;
        c[this.endParamName] = b;
        this.eventStore.load({
            params: c
        })
    },
    onBeforeStoreLoad: function (a, b) {
        if (this.tip) {
            this.tip.hide()
        }
    },
    setViewInternal: function (b, c, d, e, f, g) {
        var h = this.getColumnModel();
        g = g || this.timeColumnDefaults;
        this.fireEvent('beforeviewchange', this);
        e = e || Sch.ViewBehaviour.Base;
        if (f) {
            this.setEventRenderer(f)
        }
        if (!this.viewBehaviour) {
            this.viewBehaviour = new e(this)
        } else if (e && !(this.viewBehaviour instanceof e)) {
            this.viewBehaviour.destroy();
            this.viewBehaviour = new e(this)
        }
        this.columnType = d || this.columnType;
        var i = Sch.ColumnFactory.createColumns(b, c, this.columnType, g);
        if (i.rows) {
            if (this.nbrStaticColumns > 0) {
                Ext.each(i.rows, function (a) {
                    a.unshift({
                        colspan: this.nbrStaticColumns
                    })
                }, this)
            }
        }
        Ext.apply(h, {
            rows: i.rows || []
        });
        var j = h.config.slice(0, this.nbrStaticColumns);
        h.setConfig(j.concat(i.columns), false, true);
        this.fireEvent('viewchange', this)
    },
    internalRenderer: function (v, m, e, f, g, h, i) {
        var j = '',
            grid = this,
            viewStart = grid.getStart(),
            viewEnd = grid.getEnd(),
            cm = grid.getColumnModel(),
            colWidth = cm.getColumnWidth(g),
            colStart = grid.getColumnStart(g),
            colEnd = grid.getColumnEnd(g);
        grid.timeCellRenderer.call(this, i, m, e, f, g, h, colStart, colEnd);
        i.each(function (a) {
            var b = a.get('StartDate'),
                end = a.get('EndDate'),
                startsInsideCell = b.betweenLesser(colStart, colEnd);
            if (startsInsideCell || (g == grid.nbrStaticColumns && b < colStart && end > colStart)) {
                var c = Date.getDurationInMinutes(colStart, colEnd),
                    endsOutsideView = end > viewEnd,
                    leftOffset = (Date.getDurationInMinutes(colStart, startsInsideCell ? b : colStart) / c) * colWidth,
                    itemWidth = grid.getXFromDate(Date.min(end, viewEnd)) - grid.getXFromDate(startsInsideCell ? b : viewStart);
                var d = grid.eventRenderer.call(this, a, e, f, g, h) || {};
                Ext.apply(d, {
                    id: grid.eventPrefix + a.id,
                    cls: (d.cls || '') + (a.dirty ? ' sch-dirty' : '') + (endsOutsideView ? ' sch-event-endsoutside ' : '') + (startsInsideCell ? '' : ' sch-event-startsoutside'),
                    width: Math.max(1, Ext.isBorderBox ? itemWidth : itemWidth - grid.eventBorderWidth),
                    leftOffset: leftOffset
                });
                d.text = d.text || '&#160;';
                j += grid.eventTemplate.apply(d)
            }
        }, this);
        m.css += ' sch-timetd';
        if (Ext.isIE) {
            m.attr += ' style="z-index:' + (cm.getColumnCount() - g) + '"'
        }
        return j
    },
    getStart: function () {
        return this.getColumnStart(this.nbrStaticColumns)
    },
    getEnd: function () {
        return this.getColumnEnd(this.getColumnModel().getColumnCount() - 1)
    },
    getViewBehaviour: function () {
        return this.viewBehaviour
    },
    getColumnStart: function (a) {
        return this.getColumnModel().config[a].start
    },
    getColumnEnd: function (a) {
        return this.getColumnModel().config[a].end
    },
    onMouseOver: function (e) {
        var a = e.getTarget(this.eventSelector, this.view.cellSelectorDepth);
        if (a && a !== this.lastItem) {
            var b = this.getView(),
            	row = b.findRowIndex(a),
            	store = this.getStore(),
            	record = store.getAt(row);
            if(this.fnEventEditable(this, record) !== false){
	            this.lastItem = a;
	            Ext.fly(a).addClass(this.overClass)
            }
        }
    },
    onMouseOut: function (e) {
        if (this.lastItem) {
            if (!e.within(this.lastItem, true, true)) {
                Ext.fly(this.lastItem).removeClass(this.overClass);
                delete this.lastItem
            }
        }
    },
    onDragDropStart: function () {
        if (this.dragCreatePlug) {
            this.dragCreatePlug.setDisabled(true)
        }
        if (this.tip) {
            this.tip.hide();
            this.tip.disable()
        }
    },
    onDragDropEnd: function () {
        if (this.dragCreatePlug) {
            this.dragCreatePlug.setDisabled(false)
        }
        if (this.tip) {
            this.tip.enable()
        }
    },
    onDragCreateStart: function () {
        if (this.tip) {
            this.tip.hide();
            this.tip.disable()
        }
    },
    onAfterDragCreate: function () {
        if (this.tip) {
            this.tip.enable()
        }
    },
    getResourceByEventRecord: function (a) {
        return this.store.getById(a.get('ResourceId'))
    },
    onHeaderDoubleClick: function (g, a, e) {
        var t = e.getTarget('.sch-timeheader');
        if (!t) return;
        var b = !! t.className.match('ux-grid-hd-group-cell'),
            headerCfg, cm = g.getColumnModel(),
            isLockingView = Sch.LockingSchedulerView && (this.view instanceof Sch.LockingSchedulerView);
        if (b) {
            var c = g.getView().getHeaderGroupRow(e.getTarget('.x-grid3-hd'));
            if (isLockingView && cm.getLockedCount() > 0) {
                headerCfg = cm.rows[c][a + 1]
            } else {
                headerCfg = cm.rows[c][a - this.nbrStaticColumns + 1]
            }
        } else {
            headerCfg = cm.config[a]
        }
        this.fireEvent('timeheaderdblclick', this, headerCfg.start, headerCfg.end, e)
    },
    getResourceRecordByElement: function (t) {
        var a = null,
            index = this.getView().findRowIndex(t);
        if (index >= 0) {
            a = this.store.getAt(index)
        }
        return a
    },
    isDateRangeAvailable: function (a, b, c, d) {
        var e = true;
        this.eventStore.each(function (r) {
            if (Date.intersectSpans(a, b, r.get('StartDate'), r.get('EndDate')) && (d === r.get('ResourceId') && (!c || c !== r.id))) {
                e = false;
                return false
            }
        });
        return e
    },
    getEventsInView: function () {
        var c = this.getStart(),
            viewEnd = this.getEnd();
        return this.eventStore.queryBy(function (a) {
            var b = a.get('StartDate'),
                eventEnd = a.get('EndDate');
            return Date.intersectSpans(b, eventEnd, c, viewEnd)
        })
    }
});
Ext.reg('scheduler', Sch.SchedulerPanel);
Ext.ns('Sch');
(function () {
    var f = Sch.SchedulerPanel.prototype;
    Sch.EditorSchedulerPanel = Ext.extend(Ext.grid.EditorGridPanel, {
        tooltipTpl: f.tooltipTpl,
        resizeHandles: f.resizeHandles,
        enableEventDragDrop: f.enableEventDragDrop,
        enableDragCreation: f.enableDragCreation,
        startParamName: f.startParamName,
        endParamName: f.endParamName,
        allowOverlap: true,
        timeColumnDefaults: f.timeColumnDefaults,
        fnEventEditable: f.fnEventEditable,
        dndValidatorFn: f.dndValidatorFn,
        resizeValidatorFn: f.resizeValidatorFn,
        createValidatorFn: f.createValidatorFn,
        validatorFnScope: null,
        eventBorderWidth: 2,
        columnLines: true,
        trackMouseInTimeHeader: f.trackMouseInTimeHeader,
        overClass: f.overClass,
        eventRenderer: Ext.emptyFn,
        timeCellRenderer: f.timeCellRenderer,
        resizeHandleHtml: f.resizeHandleHtml,
        getEventRecordFromElement: f.getEventRecordFromElement,
        getEventRecordFromDomId: f.getEventRecordFromDomId,
        getEventIdFromDomNodeId: f.getEventIdFromDomNodeId,
        getElementFromEventId: f.getElementFromEventId,
        getElementFromEventRecord: f.getElementFromEventRecord,
        getXFromDate: f.getXFromDate,
        getTimeFromDomEvent: f.getTimeFromDomEvent,
        getTimeFromX: f.getTimeFromX,
        getTimeFromX2: f.getTimeFromX2,
        roundDate: f.roundDate,
        floorDate: f.floorDate,
        setEventTemplate: f.setEventTemplate,
        setEventRenderer: f.setEventRenderer,
        getSelectedRecords: f.getSelectedRecords,
        getFormattedDate: f.getFormattedDate,
        getFormattedEndDate: f.getFormattedEndDate,
        setView: f.setView,
        eventSelector: f.eventSelector,
        getViewResolution: f.getViewResolution,
        getRowIndex: f.getRowIndex,
        constructor: function (a) {
            this.addEvents('eventclick', 'eventdblclick', 'eventcontextmenu', 'beforetooltipshow', 'beforeviewchange', 'viewchange', 'timeheaderdblclick', 'beforeresize', 'partialresize', 'afterresize', 'beforednd', 'dndstart', 'drop', 'afterdnd', 'beforedragcreate', 'dragcreatestart', 'dragcreateend', 'afterdragcreate');
            a = a || {};
            if (a.plugins && !Ext.isArray(a.plugins)) {
                a.plugins = [a.plugins]
            }
            Ext.applyIf(a, {
                plugins: []
            });
            Ext.apply(this, a);
            if (!a.eventTemplate) {
                a.eventTemplate = new Ext.Template('<div id="{id}" style="width:{width}px;left:{leftOffset}px;{style}" class="sch-event {cls}">', (this.resizeHandles === 'both' || this.resizeHandles === 'left') ? String.format(this.resizeHandleHtml, 'west') : '', '<div class="sch-event-inner">{text}</div>', (this.resizeHandles === 'both' || this.resizeHandles === 'right') ? String.format(this.resizeHandleHtml, 'east') : '', '</div>').compile()
            }
            this.configureFunctionality();
            Sch.EditorSchedulerPanel.superclass.constructor.call(this, a)
        },
        getView: f.getView,
        initComponent: function () {
            Ext.apply(this.timeColumnDefaults, {
                renderer: this.internalRenderer,
                scope: this
            });
            this.eventPrefix = Ext.id() + '-';
            if (this.autoViews && this.autoViews.length > 0) {
                this.eventStore.on({
                    beforeload: this.onBeforeStoreLoad,
                    scope: this
                });
                if (this.eventStore.proxy.request) {
                    this.eventStore.proxy.request = this.eventStore.proxy.request.createInterceptor(function (a, b, c) {
                        this.reconfigureInternal(c)
                    }, this)
                } else if (this.eventStore.proxy.load) {
                    this.eventStore.proxy.load = this.eventStore.proxy.load.createInterceptor(function (a) {
                        this.reconfigureInternal(a)
                    }, this)
                }
            }
            this.on({
                afterrender: this.onRender_,
                beforedestroy: this.onBeforeDestroy_,
                dndstart: this.onDragDropStart,
                afterdnd: this.onDragDropEnd,
                dragcreatestart: this.onDragCreateStart,
                afterdragcreate: this.onAfterDragCreate,
                headerdblclick: this.onHeaderDoubleClick,
                cellclick: function (g, r, c, e) {
                    var t = e.getTarget(this.eventSelector);
                    if (t) {
                        this.fireEvent('eventclick', this, this.getEventRecordFromDomId(t.id), t, e)
                    }
                },
                celldblclick: function (g, r, c, e) {
                    var t = e.getTarget(this.eventSelector);
                    if (t) {
                        this.fireEvent('eventdblclick', this, this.getEventRecordFromDomId(t.id), e)
                    }
                },
                cellcontextmenu: function (g, r, c, e) {
                    var t = e.getTarget(this.eventSelector);
                    if (t) {
                        this.fireEvent('eventcontextmenu', this, this.getEventRecordFromDomId(t.id), e)
                    }
                },
                scope: this
            });
            if (!this.selModel && !this.disableSelection) {
                this.selModel = new Sch.EventSelectionModel()
            }
            Sch.EditorSchedulerPanel.superclass.initComponent.call(this);
            var d = this.getColumnModel();
            this.nbrStaticColumns = d.getColumnCount();
            Ext.applyIf(d, {
                rows: []
            });
            this.on('render', function () {
                this.el.addClass('sch-schedulerpanel')
            }, this)
        },
        configureFunctionality: f.configureFunctionality,
        reconfigureInternal: f.reconfigureInternal,
        onBeforeDestroy_: f.onBeforeDestroy_,
        onRender_: f.onRender_,
        setupTooltip: f.setupTooltip,
        loadInterval: f.loadInterval,
        onBeforeStoreLoad: f.onBeforeStoreLoad,
        internalRenderer: f.internalRenderer,
        getStart: f.getStart,
        getEnd: f.getEnd,
        getViewBehaviour: f.getViewBehaviour,
        getColumnStart: f.getColumnStart,
        getColumnEnd: f.getColumnEnd,
        onMouseOver: f.onMouseOver,
        onMouseOut: f.onMouseOut,
        onDragDropStart: f.onDragDropStart,
        onDragDropEnd: f.onDragDropEnd,
        onDragCreateStart: f.onDragCreateStart,
        onAfterDragCreate: f.onAfterDragCreate,
        setViewInternal: f.setViewInternal,
        getResourceByEventRecord: f.getResourceByEventRecord,
        onHeaderDoubleClick: f.onHeaderDoubleClick,
        getResourceRecordByElement: f.getResourceRecordByElement,
        isDateRangeAvailable: f.isDateRangeAvailable,
        getEventsInView: f.getEventsInView
    });
    Ext.reg('editorscheduler', Sch.EditorSchedulerPanel)
})();
Ext.ns('Sch');
Sch.EventSelectionModel = function (a) {
    Ext.apply(this, a);
    this.selected = new Ext.CompositeElementLite();
    this.addEvents("beforeeventselect", "selectionchange");
    Sch.EventSelectionModel.superclass.constructor.call(this)
};
Ext.extend(Sch.EventSelectionModel, Ext.grid.AbstractSelectionModel, {
    multiSelect: false,
    selectedClass: 'sch-event-selected',
    clearSelectionsOnBlur: true,
    initEvents: function () {
        this.grid.on("eventclick", this.onEventClick, this);
        this.grid.getView().on({
            scope: this,
            refresh: this.onViewRefresh,
            rowupdated: this.onRowUpdated,
            beforerowremoved: this.clearSelections,
            beforerowsinserted: this.clearSelections
        });
        if (this.clearSelectionsOnBlur) {
            this.grid.mon(Ext.getBody(), 'click', function (e) {
                if (!e.getTarget(this.grid.eventSelector)) {
                    this.clearSelections()
                }
            }, this)
        }
    },
    deselectEvent: function (s, r) {
        this.deselect(this.grid.eventPrefix + r.id)
    },
    onRowUpdated: function (v, a, r) {
        var b = this.selected.getCount(),
            resourceId = r.id;
        for (var i = b - 1; i >= 0; i--) {
            var c = this.selected.item(i),
                eventRecord = this.grid.getEventRecordFromDomId(c.dom.id);
            if (!eventRecord || resourceId === eventRecord.get('ResourceId')) {
                this.selected.removeElement(c)
            }
        }
    },
    onViewRefresh: function () {
        this.clearSelections(true)
    },
    clearSelections: function (a, b) {
        if (this.selected.getCount() > 0) {
            if (!b) {
                this.selected.removeClass(this.selectedClass)
            }
            this.selected.clear();
            if (!a) {
                this.fireEvent("selectionchange", this, this.selected.elements)
            }
        }
    },
    hasSelection: function () {
        return this.selection ? true : false
    },
    onEventClick: function (g, a, b, e) {
        if (e.ctrlKey && this.isSelected(b)) {
            this.deselect(b)
        } else {
            this.select(b, this.multiSelect)
        }
    },
    getSelectionCount: function () {
        return this.selected.getCount()
    },
    getSelectedNodes: function () {
        return this.selected.elements
    },
    isSelected: function (a) {
        return this.selected.contains(this.getNode(a).id)
    },
    deselect: function (a) {
        var b = this.getNode(a);
        if (this.isSelected(b)) {
            b = this.getNode(b);
            this.selected.removeElement(b);
            Ext.fly(b).removeClass(this.selectedClass);
            this.fireEvent("selectionchange", this, this.selected.elements)
        }
    },
    select: function (a, b, c) {
        if (Ext.isArray(a)) {
            if (!b) {
                this.clearSelections(true)
            }
            for (var i = 0, len = a.length; i < len; i++) {
                this.select(a[i], true, true)
            }
            if (!c) {
                this.fireEvent("selectionchange", this, this.selected.elements)
            }
        } else {
            var d = this.getNode(a);
            if (!b) {
                this.clearSelections(true)
            }
            if (d && !this.isSelected(d)) {
                if (this.fireEvent("beforeventselect", this, d, this.selected.elements) !== false) {
                    Ext.fly(d).addClass(this.selectedClass);
                    this.selected.add(d);
                    if (!c) {
                        this.fireEvent("selectionchange", this, this.selected.elements)
                    }
                }
            }
        }
    },
    getNode: function (a) {
        if (typeof a === 'string') {
            return document.getElementById(a)
        }
        return a
    },
    onEditorKey: Ext.emptyFn
});
Ext.ns('Sch');
Sch.LazyResizable = function (a, b, c, e) {
    this.addEvents('partialresize');
    Sch.LazyResizable.superclass.constructor.apply(this, arguments);
    this.handleOver();
    this.onMouseDown(this[c], e)
};
Ext.extend(Sch.LazyResizable, Ext.Resizable, {
    startSizing: Ext.Resizable.prototype.startSizing.createInterceptor(function (e, a) {
        return this.fireEvent('beforeresize', this, e) !== false
    }),
    resizeElement: function (e) {
        var a = this.proxy.getBox(),
            oldWidth = this.el.getWidth();
        if (a.width !== oldWidth) {
            this.fireEvent('partialresize', this, a.width, oldWidth, e);
            if (this.updateBox) {
                this.el.setBox(a, false, this.animate, this.duration, null, this.easing)
            } else {
                this.el.setSize(a.width, a.height, this.animate, this.duration, null, this.easing)
            }
            this.updateChildSize();
            if (!this.dynamic) {
                this.proxy.hide()
            }
        }
        return a
    },
    onMouseMove: function (e) {
        if (this.enabled && this.activeHandle) {
            try {
                if (this.resizeRegion && !this.resizeRegion.contains(e.getPoint())) {
                    return
                }
                var a = this.curSize || this.startBox,
                    x = this.startBox.x,
                    y = this.startBox.y,
                    ox = x,
                    oy = y,
                    w = a.width,
                    h = a.height,
                    ow = w,
                    oh = h,
                    mw = this.minWidth,
                    mh = this.minHeight,
                    mxw = this.maxWidth,
                    mxh = this.maxHeight,
                    wi = this.widthIncrement,
                    hi = this.heightIncrement,
                    eventXY = e.getXY(),
                    diffX = -(this.startPoint[0] - Math.max(this.minX, eventXY[0])),
                    diffY = -(this.startPoint[1] - Math.max(this.minY, eventXY[1])),
                    pos = this.activeHandle.position,
                    tw, th;
                switch (pos) {
                case 'east':
                    w += diffX;
                    w = Math.min(Math.max(mw, w), mxw);
                    break;
                case 'south':
                    h += diffY;
                    h = Math.min(Math.max(mh, h), mxh);
                    break;
                case 'southeast':
                    w += diffX;
                    h += diffY;
                    w = Math.min(Math.max(mw, w), mxw);
                    h = Math.min(Math.max(mh, h), mxh);
                    break;
                case 'north':
                    diffY = this.constrain(h, diffY, mh, mxh);
                    y += diffY;
                    h -= diffY;
                    break;
                case 'west':
                    diffX = this.constrain(w, diffX, mw, mxw);
                    x += diffX;
                    w -= diffX;
                    break;
                case 'northeast':
                    w += diffX;
                    w = Math.min(Math.max(mw, w), mxw);
                    diffY = this.constrain(h, diffY, mh, mxh);
                    y += diffY;
                    h -= diffY;
                    break;
                case 'northwest':
                    diffX = this.constrain(w, diffX, mw, mxw);
                    diffY = this.constrain(h, diffY, mh, mxh);
                    y += diffY;
                    h -= diffY;
                    x += diffX;
                    w -= diffX;
                    break;
                case 'southwest':
                    diffX = this.constrain(w, diffX, mw, mxw);
                    h += diffY;
                    h = Math.min(Math.max(mh, h), mxh);
                    x += diffX;
                    w -= diffX;
                    break
                }
                var b = this.snap(w, wi, mw);
                var c = this.snap(h, hi, mh);
                if (b != w || c != h) {
                    switch (pos) {
                    case 'northeast':
                        y -= c - h;
                        break;
                    case 'north':
                        y -= c - h;
                        break;
                    case 'southwest':
                        x -= b - w;
                        break;
                    case 'west':
                        x -= b - w;
                        break;
                    case 'northwest':
                        x -= b - w;
                        y -= c - h;
                        break
                    }
                    w = b;
                    h = c
                }
                if (this.preserveRatio) {
                    switch (pos) {
                    case 'southeast':
                    case 'east':
                        h = oh * (w / ow);
                        h = Math.min(Math.max(mh, h), mxh);
                        w = ow * (h / oh);
                        break;
                    case 'south':
                        w = ow * (h / oh);
                        w = Math.min(Math.max(mw, w), mxw);
                        h = oh * (w / ow);
                        break;
                    case 'northeast':
                        w = ow * (h / oh);
                        w = Math.min(Math.max(mw, w), mxw);
                        h = oh * (w / ow);
                        break;
                    case 'north':
                        tw = w;
                        w = ow * (h / oh);
                        w = Math.min(Math.max(mw, w), mxw);
                        h = oh * (w / ow);
                        x += (tw - w) / 2;
                        break;
                    case 'southwest':
                        h = oh * (w / ow);
                        h = Math.min(Math.max(mh, h), mxh);
                        tw = w;
                        w = ow * (h / oh);
                        x += tw - w;
                        break;
                    case 'west':
                        th = h;
                        h = oh * (w / ow);
                        h = Math.min(Math.max(mh, h), mxh);
                        y += (th - h) / 2;
                        tw = w;
                        w = ow * (h / oh);
                        x += tw - w;
                        break;
                    case 'northwest':
                        tw = w;
                        th = h;
                        h = oh * (w / ow);
                        h = Math.min(Math.max(mh, h), mxh);
                        w = ow * (h / oh);
                        y += th - h;
                        x += tw - w;
                        break
                    }
                }
                this.proxy.setBounds(x, y, w, h);
                if (this.dynamic) {
                    this.resizeElement(e)
                }
            } catch (ex) {}
        }
    }
});
Ext.ns('Sch');
Sch.SchedulerViewConfig = {
    cellSelectorDepth: 6,
    rowSelectorDepth: 11,
    init: function (a) {
        Sch.SchedulerView.superclass.init.apply(this, arguments);
        a.on('columnresize', this.refreshView, this);
        a.on('resize', this.refreshView, this);
        a.on('afterrender', function () {
            if (this.columnDrop) {
                Ext.apply(this.columnDrop, {
                    getTargetFromEvent: this.getTargetFromEvent
                })
            }
        }, this)
    },
    getTargetFromEvent: function (e) {
        var t = Ext.lib.Event.getTarget(e);
        var a = this.view.findCellIndex(t);
        if (a !== false && a < this.grid.nbrStaticColumns) {
            return this.view.getHeaderCell(a)
        }
        return false
    },
    onEventAdd: function (s, a) {
        for (var i = 0; i < a.length; i++) {
            var b = this.grid.getResourceByEventRecord(a[i]);
            if (b) {
                this.refreshRow(b)
            }
        }
    },
    onEventRemove: function (s, b) {
        var c = this.grid.getElementFromEventRecord(b);
        if (c) {
            c.fadeOut({
                remove: true,
                callback: function () {
                    var a = this.grid.getResourceByEventRecord(b);
                    if (a) {
                        this.refreshRow(a)
                    }
                },
                scope: this
            })
        }
    },
    onEventUpdate: function (s, a, b, c) {
        var d;
        if (c && c.ResourceId) {
            d = this.ds.getAt(this.ds.findExact('Id', c.ResourceId));
            this.refreshRow(d)
        }
        d = this.grid.getResourceByEventRecord(a);
        if (d) {
            this.refreshRow(d)
        }
    },
    refreshView: function (g) {
        if (this.grid.viewReady && this.grid.nbrStaticColumns < this.cm.getColumnCount()) {
            this.refresh(true)
        }
    },
    initData: function (a, b) {
        Sch.SchedulerView.superclass.initData.apply(this, arguments);
        if (this.cm) {
            this.cm.un('hiddenchange', this.refreshView, this)
        }
        if (b) {
            b.on('hiddenchange', this.refreshView, this)
        }
        if (!this.es) {
            this.es = this.grid.eventStore;
            this.es.on({
                scope: this,
                load: this.onLoad,
                datachanged: this.onDataChange,
                add: this.onEventAdd,
                update: this.onEventUpdate,
                remove: this.onEventRemove,
                clear: this.onClear
            })
        }
    },
    constructor: function (a) {
        Ext.apply(this, a);
        if (a && a.forceFit) {
            this.refresh = this.refresh.createInterceptor(function () {
                this.fitColumns(true)
            })
        }
        Sch.SchedulerView.superclass.constructor.call(this)
    },
    getColumnData: function () {
        var a = [],
            cm = this.cm,
            colCount = cm.getColumnCount();
        for (var i = 0; i < colCount; i++) {
            var b = cm.getDataIndex(i);
            a[i] = {
                name: b || '',
                id: cm.getColumnId(i),
                style: this.getColumnStyle(i),
                renderer: cm.getRenderer(i),
                scope: cm.config[i].scope,
                start: cm.config[i].start,
                end: cm.config[i].end
            }
        }
        return a
    },
    fitColumns: function (a, b, c) {
        var d = this.cm,
            i;
        var e = d.getTotalWidth(false);
        var f = this.grid.getGridEl().getWidth(true) - this.getScrollOffset();
        if (f < 20) {
            return
        }
        var g = f - e;
        if (g === 0) {
            return
        }
        var h = d.getColumnCount(true);
        if (h <= this.grid.nbrStaticColumns) {
            return
        }
        var j = h - (typeof c == 'number' ? 1 : 0);
        if (j === 0) {
            j = 1;
            c = undefined
        }
        if (c) {
            d.setColumnWidth(c, Math.max(1, d.getColumnWidth(c)), true)
        }
        var k = d.getColumnCount(),
            cols = [],
            extraCol = 0,
            width = 0,
            w, staticColumnsWidth = 0;
        for (i = 0; i < this.grid.nbrStaticColumns; i++) {
            if (!d.isHidden(i)) {
                extraCol = i;
                w = i === c ? d.getColumnWidth(i) : d.config[i].width;
                cols.push(i);
                cols.push(w);
                staticColumnsWidth += w
            }
        }
        var l = (f - staticColumnsWidth) / (k - this.grid.nbrStaticColumns);
        for (i = this.grid.nbrStaticColumns; i < k; i++) {
            cols.push(i);
            cols.push(l)
        }
        while (cols.length) {
            w = cols.pop();
            i = cols.pop();
            d.setColumnWidth(i, Math.max(this.grid.minColumnWidth, Math.floor(w)), true)
        }
        if (a !== true) {
            this.updateAllColumnWidths()
        }
    },
    doRender: function (b, d, e, f, h, k) {
        var g = this.grid,
            ts = this.templates,
            ct = ts.cell,
            rt = ts.row,
            last = h - 1;
        var l = 'width:' + this.getTotalWidth() + ';';
        var m = [],
            cb, c, p = {},
            rp = {
                tstyle: l
            },
            r, events;
        for (var j = 0, len = d.length; j < len; j++) {
            r = d[j];
            cb = [];
            var n = (j + f),
                resId = r.get('Id');
            events = this.es.data.filterBy(function (a) {
                return a.data.ResourceId == resId
            });
            for (var i = 0; i < h; i++) {
                c = b[i];
                p.id = c.id;
                p.css = i === 0 ? 'x-grid3-cell-first ' : (i == last ? 'x-grid3-cell-last ' : '');
                p.attr = p.cellAttr = "";
                p.value = c.renderer.call(c.scope || c, r.data[c.name], p, r, n, i, e, events);
                p.style = c.style;
                cb[cb.length] = ct.apply(p)
            }
            var o = [];
            if (k && ((n + 1) % 2 === 0)) {
                o[0] = "x-grid3-row-alt"
            }
            if (r.dirty) {
                o[1] = " x-grid3-dirty-row"
            }
            rp.cols = h;
            if (this.getRowClass) {
                o[2] = this.getRowClass(r, n, rp, e)
            }
            rp.alt = o.join(" ");
            rp.cells = cb.join("");
            m[m.length] = rt.apply(rp)
        }
        return m.join("")
    },
    initTemplates: function () {
        this.templates = this.templates || {};
        var a = this.templates;
        if (!a.gcell) {
            a.gcell = new Ext.XTemplate('<td class="x-grid3-hd x-grid3-gcell x-grid3-td-{id} ux-grid-hd-group-row-{row} {cls}" style="{style}">', '<div {tooltip} class="x-grid3-hd-inner x-grid3-hd-{id}" unselectable="on" style="{istyle}">', '{value}</div></td>')
        }
        Sch.SchedulerView.superclass.initTemplates.call(this)
    },
    getTimeColumnWidth: function (a, b) {
        var c = b * a;
        return (Ext.isBorderBox || (Ext.isWebKit && !Ext.isSafari2) ? c : (c - this.borderWidth > 0 ? c - this.borderWidth : 0))
    },
    getColumnHeaderCls: function (i, a) {
        var b = i === 0 ? 'x-grid3-cell-first ' : (i == a ? 'x-grid3-cell-last ' : '');
        return b + (this.cm.config[i].headerCls || '')
    },
    renderHeaders: function () {
        var a = this.templates,
            headers = [],
            cm = this.cm,
            rows = cm.rows,
            width, id, group, firstGroupWidth, tw = this.cm.getTotalWidth(),
            totalWidthOfTimeColumns, i, len, gcol;
        if (rows.length > 0) {
            firstGroupWidth = this.getFirstGroupWidth.call(this, rows[0][0], 0);
            totalWidthOfTimeColumns = tw - firstGroupWidth;
            if (firstGroupWidth > 0 && !(Ext.isBorderBox || (Ext.isWebKit && !Ext.isSafari2))) {
                totalWidthOfTimeColumns -= this.borderWidth
            }
        }
        for (var b = 0, rlen = rows.length; b < rlen; b++) {
            var r = rows[b],
                cells = [],
                cls;
            for (i = 0, gcol = 0, len = r.length; i < len; i++) {
                group = r[i];
                id = this.getColumnId(group.dataIndex ? cm.findColumnIndex(group.dataIndex) : gcol);
                if (i === 0 && group.colspan) {
                    width = firstGroupWidth;
                    cls = ''
                } else {
                    width = this.getTimeColumnWidth(group.width, totalWidthOfTimeColumns);
                    cls = 'sch-timeheader '
                }
                group.colspan = group.colspan || 1;
                cells[i] = a.gcell.apply({
                    cls: cls + (group.headerCls || '') + (group.header ? ' ux-grid-hd-group-cell' : ' ux-grid-hd-nogroup-cell'),
                    id: id,
                    row: b,
                    style: 'width:' + width + 'px;' + (group.align ? 'text-align:' + group.align + ';' : ''),
                    tooltip: group.tooltip ? (Ext.QuickTips.isEnabled() ? 'ext:qtip' : 'title') + '="' + group.tooltip + '"' : '',
                    istyle: group.align == 'right' ? 'padding-right:16px' : '',
                    btn: this.grid.enableHdMenu && group.header,
                    value: (width > 10) ? (group.header || '&nbsp;') : '&nbsp;'
                });
                gcol += group.colspan
            }
            headers[b] = a.header.apply({
                tstyle: 'width:' + this.getTotalWidth(),
                cells: cells.join('')
            })
        }
        len = cm.getColumnCount();
        var c = a.hcell,
            cb = [],
            p = {},
            last = len - 1;
        for (i = 0; i < len; i++) {
            p.id = cm.getColumnId(i);
            p.value = cm.getColumnHeader(i) || '';
            p.style = this.getColumnStyle(i, true);
            p.tooltip = this.getColumnTooltip(i);
            p.css = this.getColumnHeaderCls(i, last);
            if (cm.config[i].align == 'right') {
                p.istyle = 'padding-right:16px'
            } else {
                delete p.istyle
            }
            cb[cb.length] = c.apply(p)
        }
        headers.push(a.header.apply({
            cells: cb.join(''),
            tstyle: 'width:' + this.getTotalWidth() + ';'
        }));
        return headers.join('')
    },
    onColumnWidthUpdated: function () {
        Sch.SchedulerView.superclass.onColumnWidthUpdated.apply(this, arguments);
        this.updateGroupStyles.call(this)
    },
    onAllColumnWidthsUpdated: function () {
        Sch.SchedulerView.superclass.onAllColumnWidthsUpdated.apply(this, arguments);
        this.updateGroupStyles.call(this)
    },
    onColumnHiddenUpdated: function () {
        Sch.SchedulerView.superclass.onColumnHiddenUpdated.apply(this, arguments);
        this.updateGroupStyles.call(this)
    },
    getHeaderCell: function (a) {
        return this.mainHd.query(this.cellSelector)[a]
    },
    findHeaderCell: function (a) {
        return a ? this.fly(a).findParent('td.x-grid3-hd', this.cellSelectorDepth) : false
    },
    findHeaderIndex: function (a) {
        var b = this.findHeaderCell(a);
        return b ? this.getCellIndex(b) : false
    },
    updateSortIcon: function (a, b) {
        var c = this.sortClasses;
        var d = this.mainHd.select(this.cellSelector).removeClass(c);
        d.item(a).addClass(c[b == "DESC" ? 1 : 0])
    },
    getFirstGroupWidth: function (a, b) {
        var c = 0,
            hidden = true,
            visCols = 0;
        for (var i = b, len = b + a.colspan; i < len; i++) {
            if (!this.cm.isHidden(i)) {
                var d = this.cm.getColumnWidth(i);
                if (typeof d == 'number') {
                    c += d
                }
                hidden = false
            }
        }
        return (Ext.isBorderBox || (Ext.isWebKit && !Ext.isSafari2)) ? c : Math.max(c - this.borderWidth, 0)
    },
    updateGroupStyles: function (a) {
        var b = this.mainHd.query('.x-grid3-header-offset > table'),
            rows = this.cm.rows,
            firstGroupWidth, tw = this.cm.getTotalWidth(),
            totalWidthOfTimeColumns = tw,
            staticColumnsExist = (this.grid.nbrStaticColumns > 0);
        if (rows.length > 0 && staticColumnsExist) {
            firstGroupWidth = this.getFirstGroupWidth.call(this, rows[0][0], 0);
            totalWidthOfTimeColumns -= firstGroupWidth;
            if (firstGroupWidth > 0 && !(Ext.isBorderBox || (Ext.isWebKit && !Ext.isSafari2))) {
                totalWidthOfTimeColumns -= this.borderWidth
            }
        }
        for (var c = 0; c < b.length; c++) {
            b[c].style.width = tw + 'px';
            if (c < rows.length) {
                var d = b[c].firstChild.firstChild.childNodes;
                for (var i = 0, gcol = 0; i < d.length; i++) {
                    var e = rows[c][i];
                    if ((typeof a != 'number') || (a >= gcol && a < gcol + (e.colspan || 0))) {
                        if (staticColumnsExist && i === 0) {
                            d[i].style.width = firstGroupWidth + 'px'
                        } else {
                            width = this.getTimeColumnWidth(e.width, totalWidthOfTimeColumns);
                            d[i].style.width = width + 'px'
                        }
                    }
                }
            }
        }
    },
    getAccColumnWidth: function (a) {
        var w = 0,
            cm = this.cm,
            i;
        for (i = 0; i < a; i++) {
            if (!cm.isHidden(i)) {
                w += cm.getColumnWidth(i)
            }
        }
        return w
    },
    updateTimeColumnWidths: function (a, b) {
        var c = this.cm;
        for (var i = this.grid.nbrStaticColumns, l = c.getColumnCount(); i < l; i++) {
            c.setColumnWidth(i, a, true)
        }
        if (!b) {
            this.refresh(true)
        }
    },
    getHeaderGroupRow: function (a) {
        var b = a.className,
            retVal = -1;
        if (b) {
            var m = b.match(/ux-grid-hd-group-row-(\d+)/);
            if (m && m.length === 2) {
                retVal = parseInt(m[1], 10)
            }
        }
        return retVal
    },
    onHeaderClick: Ext.grid.GridView.prototype.onHeaderClick.createInterceptor(function (g, a, e) {
        return !e.getTarget('.ux-grid-hd-group-cell')
    }),
    handleHdOver: function (e, t) {
        var a = this.findHeaderCell(t);
        if (a && !this.headersDisabled) {
            this.activeHdRef = t;
            this.activeHdIndex = this.getCellIndex(a);
            var b = this.fly(a);
            this.activeHdRegion = b.getRegion();
            if (this.activeHdIndex >= this.grid.nbrStaticColumns) {
                if (this.grid.trackMouseInTimeHeader) {
                    b.addClass('x-grid3-hd-over');
                    if (!this.cm.isMenuDisabled(this.activeHdIndex)) {
                        this.activeHdBtn = b.child('.x-grid3-hd-btn');
                        if (this.activeHdBtn) {
                            this.activeHdBtn.dom.style.height = (a.firstChild.offsetHeight - 1) + 'px'
                        }
                    }
                }
            } else {
                if (!this.cm.isMenuDisabled(this.activeHdIndex)) {
                    b.addClass('x-grid3-hd-over');
                    this.activeHdBtn = b.child('.x-grid3-hd-btn');
                    if (this.activeHdBtn) {
                        this.activeHdBtn.dom.style.height = (a.firstChild.offsetHeight - 1) + 'px'
                    }
                }
            }
        }
    },
    scrollEventIntoView: function (a, b) {
        var c = this.grid.getElementFromEventRecord(a);
        if (c) {
            c.scrollIntoView(this.scroller);
            if (b) {
                if (typeof b === "boolean") {
                    c.highlight()
                } else {
                    c.highlight(null, b)
                }
            }
        }
    },
    handleHdMove: Ext.grid.GridView.prototype.handleHdMove.createInterceptor(function (e) {
        return !e.getTarget('.ux-grid-hd-group-cell')
    })
};
if (Ext.getMajorVersion() >= 3 && Ext.getMinorVersion() >= 3) {
    Ext.apply(Sch.SchedulerViewConfig, {
        refreshRow: function (b) {
            var c = this.ds,
                colCount = this.cm.getColumnCount(),
                columns = this.getColumnData(),
                last = colCount - 1,
                cls = ['x-grid3-row'],
                rowParams = {
                    tstyle: String.format("width: {0};", this.getTotalWidth())
                },
                colBuffer = [],
                cellTpl = this.templates.cell,
                rowIndex, row, column, meta, css, i;
            if (Ext.isNumber(b)) {
                rowIndex = b;
                b = c.getAt(rowIndex)
            } else {
                rowIndex = c.indexOf(b)
            }
            if (!b || rowIndex < 0) {
                return
            }
            var d = b.get('Id'),
                events = this.es.data.filterBy(function (a) {
                    return a.data.ResourceId == d
                });
            for (i = 0; i < colCount; i++) {
                column = columns[i];
                if (i === 0) {
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
                meta.value = column.renderer.call(column.scope, b.data[column.name], meta, b, rowIndex, i, c, events);
                if (Ext.isEmpty(meta.value)) {
                    meta.value = '&#160;'
                }
                if (this.markDirty && b.dirty && typeof b.modified[column.name] != 'undefined') {
                    meta.css += ' x-grid3-dirty-cell'
                }
                colBuffer[i] = cellTpl.apply(meta)
            }
            row = this.getRow(rowIndex);
            row.className = '';
            if (this.grid.stripeRows && ((rowIndex + 1) % 2 === 0)) {
                cls.push('x-grid3-row-alt')
            }
            if (this.getRowClass) {
                rowParams.cols = colCount;
                cls.push(this.getRowClass(b, rowIndex, rowParams, c))
            }
            this.fly(row).addClass(cls).setStyle(rowParams.tstyle);
            rowParams.cells = colBuffer.join("");
            row.innerHTML = this.templates.rowInner.apply(rowParams);
            this.fireEvent('rowupdated', this, rowIndex, b)
        }
    })
}
Sch.SchedulerView = Ext.extend(Ext.grid.GridView, Sch.SchedulerViewConfig);
Ext.ns('Sch');
(function () {
    var o = Ext.ux.grid.LockingGridView.prototype;
    Sch.LockingSchedulerView = Ext.extend(Sch.SchedulerView, {
        lockText: o.lockText,
        unlockText: o.unlockText,
        rowBorderWidth: o.rowBorderWidth,
        lockedBorderWidth: o.lockedBorderWidth,
        getEditorParent: o.getEditorParent,
        initElements: o.initElements,
        getLockedRows: o.getLockedRows,
        getLockedRow: o.getLockedRow,
        getCell: o.getCell,
        addRowClass: o.addRowClass,
        removeRowClass: o.removeRowClass,
        removeRow: o.removeRow,
        removeRows: o.removeRows,
        syncScroll: o.syncScroll,
        updateSortIcon: o.updateSortIcon,
        updateAllColumnWidths: o.updateAllColumnWidths,
        updateColumnWidth: o.updateColumnWidth,
        updateColumnHidden: o.updateColumnHidden,
        processRows: o.processRows,
        afterRender: o.afterRender,
        renderUI: o.renderUI,
        getOffsetWidth: o.getOffsetWidth,
        getResolvedXY: o.getResolvedXY,
        syncFocusEl: o.syncFocusEl,
        ensureVisible: o.ensureVisible,
        insertRows: o.insertRows,
        getColumnStyle: o.getColumnStyle,
        getLockedWidth: o.getLockedWidth,
        getTotalWidth: o.getTotalWidth,
        renderBody: o.renderBody,
        refreshRow: o.refreshRow,
        onDenyColumnLock: o.onDenyColumnLock,
        onColumnLock: o.onColumnLock,
        handleHdMenuClick: o.handleHdMenuClick,
        handleHdDown: o.handleHdDown,
        syncHeaderHeight: o.syncHeaderHeight,
        updateLockedWidth: o.updateLockedWidth,
        initData: function (a, b) {
            if (this.cm) {
                this.cm.un('columnlockchange', this.onColumnLock, this)
            }
            Sch.LockingSchedulerView.superclass.initData.call(this, a, b);
            if (this.cm) {
                this.cm.on('columnlockchange', this.onColumnLock, this)
            }
        },
        scrollToTime: function (a, b) {
            var x = this.grid.getXFromDate(a);
            if (x >= 0) {
                this.scroller.scrollTo('left', x, b)
            }
        },
        refreshView: Ext.emptyFn,
        layout: o.layout,
        getHeaderCell: function (a) {
            var b = this.cm.getLockedCount();
            if (a < b) {
                return this.lockedHd.child('table:last').dom.getElementsByTagName('td')[a]
            }
            return Sch.LockingSchedulerView.superclass.getHeaderCell.call(this, a - b)
        },
        renderHeaders: function () {
            var a = this.cm,
                ts = this.templates,
                ct = ts.hcell,
                cb = [],
                lcb = [],
                p = {},
                len = a.getColumnCount(),
                last = len - 1,
                twValue = this.cm.getTotalWidth() - this.cm.getTotalLockedWidth(),
                tw = twValue + 'px',
                lw = this.getLockedWidth(),
                lockedHeaders = '',
                unlockedHeaders = '',
                i;
            for (i = 0; i < len; i++) {
                p.id = a.getColumnId(i);
                p.value = a.getColumnHeader(i) || '';
                p.style = this.getColumnStyle(i, true);
                p.tooltip = this.getColumnTooltip(i);
                p.css = (i === 0 ? 'x-grid3-cell-first ' : (i == last ? 'x-grid3-cell-last ' : '')) + (a.config[i].headerCls ? ' ' + a.config[i].headerCls : '');
                if (a.config[i].align == 'right') {
                    p.istyle = 'padding-right:16px'
                } else {
                    delete p.istyle
                }
                if (a.isLocked(i)) {
                    lcb[lcb.length] = ct.apply(p)
                } else {
                    cb[cb.length] = ct.apply(p)
                }
            }
            var b = a.rows,
                width, id, group, widthString, gcol, nbrLocked = a.getLockedCount(),
                headerRowGroupFirstColWidth = 0;
            for (var c = 0, rlen = b.length; c < rlen; c++) {
                var r = b[c],
                    cells = [];
                for (i = (nbrLocked > 0 ? 1 : 0), gcol = 0, len = r.length; i < len; i++) {
                    group = r[i];
                    group.colspan = group.colspan || 1;
                    id = gcol;
                    if (i === 0) {
                        width = 0;
                        for (var k = 0; k < group.colspan; k++) {
                            width += a.getColumnWidth(k)
                        }
                        headerRowGroupFirstColWidth = width
                    } else {
                        width = (nbrLocked > 0 ? twValue : (twValue - headerRowGroupFirstColWidth)) * group.width
                    }
                    widthString = (Ext.isBorderBox || (Ext.isWebKit && !Ext.isSafari2) ? width : (width - this.borderWidth > 0 ? width - this.borderWidth : 0)) + 'px;';
                    cells[i] = ts.gcell.apply({
                        cls: (i > 0 ? 'sch-timeheader ' : '') + (group.headerCls || '') + (group.header ? ' ux-grid-hd-group-cell' : ' ux-grid-hd-nogroup-cell'),
                        id: id,
                        row: c,
                        style: 'width:' + widthString + (group.align ? 'text-align:' + group.align + ';' : ''),
                        tooltip: group.tooltip ? (Ext.QuickTips.isEnabled() ? 'ext:qtip' : 'title') + '="' + group.tooltip + '"' : '',
                        istyle: group.align == 'right' ? 'padding-right:16px' : '',
                        btn: this.grid.enableHdMenu && group.header,
                        value: (width > 10) ? (group.header || '&nbsp;') : '&nbsp;'
                    });
                    gcol += group.colspan
                }
                unlockedHeaders += ts.header.apply({
                    tstyle: 'width:' + tw,
                    cells: cells.join('')
                });
                if (nbrLocked > 0) {
                    lockedHeaders += ts.header.apply({
                        cells: ts.gcell.apply({
                            cls: 'x-grid3-cell-first x-grid3-cell-last ux-grid-hd-nogroup-cell',
                            value: '&nbsp;',
                            row: c,
                            id: 0,
                            style: 'width:' + lw
                        }),
                        tstyle: 'width:' + lw + ';'
                    })
                }
            }
            unlockedHeaders += ts.header.apply({
                cells: cb.join(''),
                tstyle: 'width:' + tw + ';'
            });
            lockedHeaders += ts.header.apply({
                cells: lcb.join(''),
                tstyle: 'width:' + this.getLockedWidth() + ';'
            });
            return [unlockedHeaders, lockedHeaders]
        },
        updateHeaders: function () {
            var a = this.renderHeaders();
            this.innerHd.firstChild.innerHTML = a[0];
            this.innerHd.firstChild.style.width = this.getOffsetWidth();
            Ext.fly(this.innerHd.firstChild).select('>table').setWidth(this.getTotalWidth());
            this.lockedInnerHd.firstChild.innerHTML = a[1];
            var b = this.getLockedWidth();
            this.lockedInnerHd.firstChild.style.width = b;
            Ext.fly(this.lockedInnerHd.firstChild).select('table').setWidth(b)
        },
        initTemplates: function () {
            var a = this.templates || {};
            if (!a.master) {
                a.master = new Ext.Template('<div class="x-grid3" hidefocus="true">', '<div class="x-grid3-locked">', '<div class="x-grid3-header"><div class="x-grid3-header-inner"><div class="x-grid3-header-offset" style="{lstyle}">{lockedHeader}</div></div><div class="x-clear"></div></div>', '<div class="x-grid3-scroller"><div class="x-grid3-body" style="{lstyle}">{lockedBody}</div><div class="x-grid3-scroll-spacer"></div></div>', '</div>', '<div class="x-grid3-viewport x-grid3-unlocked">', '<div class="x-grid3-header"><div class="x-grid3-header-inner"><div class="x-grid3-header-offset" style="{ostyle}">{header}</div></div><div class="x-clear"></div></div>', '<div class="x-grid3-scroller"><div class="x-grid3-body" style="{bstyle}">{body}</div><a href="#" class="x-grid3-focus" tabIndex="-1"></a></div>', '</div>', '<div class="x-grid3-resize-marker">&#160;</div>', '<div class="x-grid3-resize-proxy">&#160;</div>', '</div>')
            }
            this.templates = a;
            Sch.LockingSchedulerView.superclass.initTemplates.call(this)
        },
        getColumnData: function () {
            var a = [],
                cm = this.cm,
                colCount = cm.getColumnCount();
            for (var i = 0; i < colCount; i++) {
                var b = cm.getDataIndex(i);
                a[i] = {
                    scope: cm.config[i].scope,
                    name: b || '',
                    renderer: cm.getRenderer(i),
                    id: cm.getColumnId(i),
                    style: this.getColumnStyle(i),
                    locked: cm.isLocked(i),
                    start: cm.config[i].start,
                    end: cm.config[i].end
                }
            }
            return a
        },
        doRender: function (b, d, e, f, h, k) {
            var l = this.templates,
                ct = l.cell,
                rt = l.row,
                last = h - 1,
                tstyle = 'width:' + this.getTotalWidth() + ';',
                lstyle = 'width:' + this.getLockedWidth() + ';',
                buf = [],
                lbuf = [],
                cb, lcb, c, p = {},
                rp = {},
                r, events, g = this.grid;
            for (var j = 0, len = d.length; j < len; j++) {
                r = d[j];
                cb = [];
                lcb = [];
                var m = (j + f),
                    resId = r.get('Id');
                events = this.es.data.filterBy(function (a) {
                    return a.data.ResourceId == resId
                });
                for (var i = 0; i < h; i++) {
                    c = b[i];
                    p.id = c.id;
                    p.css = (i === 0 ? 'x-grid3-cell-first ' : (i == last ? 'x-grid3-cell-last ' : '')) + (this.cm.config[i].cellCls ? ' ' + this.cm.config[i].cellCls : '');
                    p.attr = p.cellAttr = '';
                    p.value = c.renderer.call(c.scope || c, r.data[c.name], p, r, m, i, e, events);
                    p.style = c.style;
                    if (Ext.isEmpty(p.value)) {
                        p.value = '&#160;'
                    }
                    if (this.markDirty && r.dirty && Ext.isDefined(r.modified[c.name])) {
                        p.css += ' x-grid3-dirty-cell'
                    }
                    if (c.locked) {
                        lcb[lcb.length] = ct.apply(p)
                    } else {
                        cb[cb.length] = ct.apply(p)
                    }
                }
                var n = [];
                if (k && ((m + 1) % 2 === 0)) {
                    n[0] = 'x-grid3-row-alt'
                }
                if (r.dirty) {
                    n[1] = ' x-grid3-dirty-row'
                }
                rp.cols = h;
                if (this.getRowClass) {
                    n[2] = this.getRowClass(r, m, rp, e)
                }
                rp.alt = n.join(' ');
                rp.cells = cb.join('');
                rp.tstyle = tstyle;
                buf[buf.length] = rt.apply(rp);
                rp.cells = lcb.join('');
                rp.tstyle = lstyle;
                lbuf[lbuf.length] = rt.apply(rp)
            }
            return [buf.join(''), lbuf.join('')]
        },
        handleHdOver: function (e, t) {
            var a = this.findHeaderCell(t) || e.getTarget('.ux-grid-hd-group-cell');
            if (a && !this.headersDisabled) {
                this.activeHdRef = t;
                this.activeHdIndex = this.getCellIndex(a);
                var b = this.fly(a),
                    isTimeHeaderCell = a.className.match('sch-timeheader'),
                    menuDisabled = isTimeHeaderCell || this.cm.isMenuDisabled(this.activeHdIndex);
                this.activeHdRegion = b.getRegion();
                if ((!isTimeHeaderCell && !menuDisabled) || (this.grid.trackMouseInTimeHeader && isTimeHeaderCell)) {
                    b.addClass('x-grid3-hd-over')
                }
                if (!menuDisabled) {
                    this.activeHdBtn = b.child('.x-grid3-hd-btn');
                    if (this.activeHdBtn) {
                        this.activeHdBtn.dom.style.height = (a.firstChild.offsetHeight - 1) + 'px'
                    }
                }
            }
        },
        getAccColumnWidth: function (a) {
            var w = 0,
                cm = this.cm,
                i;
            for (i = this.grid.nbrStaticColumns; i < a; i++) {
                if (!cm.isHidden(i)) {
                    w += cm.getColumnWidth(i)
                }
            }
            return w
        },
        fitTimeColumns: function (a) {
            var b = this.cm,
                colW = (this.scroller.getWidth() - this.getScrollOffset()) / (b.getColumnCount() - b.getLockedCount());
            this.updateTimeColumnWidths(Math.floor(colW), a)
        },
        updateGroupStyles: function (a) {
            var b = this.lockedHd.query('.x-grid3-header-offset > table'),
                rows = this.cm.rows,
                tw = this.getLockedWidth();
            for (var c = 0; c < b.length; c++) {
                b[c].style.width = tw;
                if (c < rows.length) {
                    var d = b[c].firstChild.firstChild.childNodes;
                    d[0].style.width = tw
                }
            }
        },
        refresh: function (a) {
            a = a || !this.hasRows();
            if (this.cm.getColumnWidth(this.grid.nbrStaticColumns) < Math.floor(this.scroller.getWidth() - this.getScrollOffset()) / (this.cm.getColumnCount() - this.cm.getLockedCount())) {
                this.fitTimeColumns(true)
            }
            o.refresh.call(this, a)
        }
    })
})();
if (Ext.getMajorVersion() >= 3 && Ext.getMinorVersion() >= 3) {
    Ext.override(Sch.LockingSchedulerView, {
        afterRenderUI: Ext.ux.grid.LockingGridView.prototype.afterRenderUI,
        refreshRow: function (b) {
            var c = this.ds,
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
                rowIndex, row, lockedRow, column, meta, css, i;
            if (Ext.isNumber(b)) {
                rowIndex = b;
                b = c.getAt(rowIndex)
            } else {
                rowIndex = c.indexOf(b)
            }
            if (!b || rowIndex < 0) {
                return
            }
            var d = b.get('Id'),
                events = this.es.data.filterBy(function (a) {
                    return a.data.ResourceId == d
                });
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
                meta.value = column.renderer.call(column.scope, b.data[column.name], meta, b, rowIndex, i, c, events);
                if (Ext.isEmpty(meta.value)) {
                    meta.value = '&#160;'
                }
                if (this.markDirty && b.dirty && typeof b.modified[column.name] != 'undefined') {
                    meta.css += ' x-grid3-dirty-cell'
                }
                if (column.locked) {
                    lockedColBuffer[i] = cellTpl.apply(meta)
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
                cls.push(this.getRowClass(b, rowIndex, rowParams, c))
            }
            this.fly(row).addClass(cls).setStyle(rowParams.tstyle);
            rowParams.cells = colBuffer.join("");
            row.innerHTML = this.templates.rowInner.apply(rowParams);
            this.fly(lockedRow).addClass(cls).setStyle(lockedRowParams.tstyle);
            lockedRowParams.cells = lockedColBuffer.join("");
            lockedRow.innerHTML = this.templates.rowInner.apply(lockedRowParams);
            lockedRow.rowIndex = rowIndex;
            this.fireEvent('rowupdated', this, rowIndex, b)
        },
        initTemplates: function () {
            var a = this.templates || {};
            if (!a.masterTpl) {
                a.masterTpl = new Ext.Template('<div class="x-grid3" hidefocus="true">', '<div class="x-grid3-locked">', '<div class="x-grid3-header"><div class="x-grid3-header-inner"><div class="x-grid3-header-offset" style="{lstyle}">{lockedHeader}</div></div><div class="x-clear"></div></div>', '<div class="x-grid3-scroller"><div class="x-grid3-body" style="{lstyle}">{lockedBody}</div><div class="x-grid3-scroll-spacer"></div></div>', '</div>', '<div class="x-grid3-viewport x-grid3-unlocked">', '<div class="x-grid3-header"><div class="x-grid3-header-inner"><div class="x-grid3-header-offset" style="{ostyle}">{header}</div></div><div class="x-clear"></div></div>', '<div class="x-grid3-scroller"><div class="x-grid3-body" style="{bstyle}">{body}</div><a href="#" class="x-grid3-focus" tabIndex="-1"></a></div>', '</div>', '<div class="x-grid3-resize-marker">&#160;</div>', '<div class="x-grid3-resize-proxy">&#160;</div>', '</div>')
            }
            this.templates = a;
            Sch.LockingSchedulerView.superclass.initTemplates.call(this)
        }
    })
}
Ext.ns('Sch.plugins');
Sch.plugins.DragSelector = function (c) {
    c = c || {};
    var g, proxy, tracker, sm;
    var d, bodyRegion, dragRegion = new Ext.lib.Region(0, 0, 0, 0);
    this.init = function (a) {
        g = a;
        sm = g.getSelectionModel();
        g.on('render', onRender)
    };

    function fillRegions() {
        d = [];
        g.view.mainBody.select(g.eventSelector).each(function (a) {
            d[d.length] = {
                region: a.getRegion(),
                node: a.dom
            }
        });
        bodyRegion = g.view.mainBody.getRegion()
    }
    function onBeforeStart(e) {
        return e.ctrlKey
    }
    function onStart(e) {
        if (!proxy) {
            proxy = g.el.createChild({
                cls: 'x-view-selector'
            })
        } else {
            if (proxy.dom.parentNode !== g.el.dom) {
                g.el.dom.appendChild(proxy.dom)
            }
            proxy.setDisplayed('block')
        }
        fillRegions();
        sm.clearSelections()
    }
    function onDrag(e) {
        var a = tracker.startXY;
        var b = tracker.getXY();
        var x = Math.min(a[0], b[0]);
        var y = Math.min(a[1], b[1]);
        var w = Math.abs(a[0] - b[0]);
        var h = Math.abs(a[1] - b[1]);
        dragRegion.left = x;
        dragRegion.top = y;
        dragRegion.right = x + w;
        dragRegion.bottom = y + h;
        dragRegion.constrainTo(bodyRegion);
        proxy.setRegion(dragRegion);
        for (var i = 0, len = d.length; i < len; i++) {
            var r = d[i],
                sel = dragRegion.intersect(r.region);
            if (sel && !r.selected) {
                r.selected = true;
                sm.select(r.node, true)
            } else if (!sel && r.selected) {
                r.selected = false;
                sm.deselect(r.node)
            }
        }
    }
    function onEnd(e) {
        if (proxy) {
            proxy.setDisplayed(false)
        }
    }
    function onRender(g) {
        var a = {
            onBeforeStart: c.beforeStart || onBeforeStart,
            onStart: onStart,
            onDrag: onDrag,
            onEnd: onEnd
        };
        tracker = new Ext.dd.DragTracker(a);
        tracker.initEl(g.view.mainBody)
    }
};
Ext.ns('Sch.plugins');
Sch.plugins.EventEditor = Ext.extend(Ext.FormPanel, {
    saveText: 'Save',
    cancelText: 'Cancel',
    hoursText: 'hrs',
    hideOnBlur: true,
    timeConfig: {
        allowBlank: false,
        editable: false,
        forceSelection: true
    },
    fieldsPanel: null,
    dateFormat: 'Y-m-d',
    timeFormat: 'H:i',
    show: function (a) {
        this.eventRecord = a;
        // update by zhangchang
        //var b = Date.getDurationInHours(a.get('StartDate'), a.get('EndDate'));
        var b = Date.getDurationInDays(a.get('StartDate'), a.get('EndDate'));
        this.durationField.setValue(b);
        this.getForm().loadRecord(a);
        var c = this.grid.getElementFromEventRecord(a);
        // update by zhangchang
        //this.el.anchorTo(c, 'tl', this.getConstrainOffsets(c));
        this.el.anchorTo(c, 'bl-tl', this.getConstrainOffsets(c));
        this.expand();
    },
    getConstrainOffsets: function (a) {
        return [0, -this.initialConfig.height]
    },
    cls: 'sch-eventeditor',
    layout: 'border',
    border: false,
    initComponent: function () {
        if (!this.fieldsPanelConfig) throw 'Must define a fieldsPanelConfig property';
        if (this.hideOnBlur) {
            this.mon(Ext.getBody(), 'click', function (e) {
                if (!this.collapsed && !e.within(this.getEl()) && !Ext.fly(e.getTarget()).is('.x-combo-list-item')) {
                    this.collapse(false)
                }
            }, this)
        }
        this.on('render', this.collapse, this);
        this.fieldsPanelConfig.region = 'center';
        Ext.apply(this, {
            buttons: [{
                text: this.saveText,
                scope: this,
                handler: function () {
                    if (this.getForm().isValid()) {
                    	// update by zhangchang
                        var a = this.startDateField.getValue(),
                        	days = this.durationField.getValue();
                            //hours = this.durationField.getValue();
                        if (a && days) {
                            //end = a.add(Date.MINUTE, hours * 60 )
                            end = a.add(Date.DAY, days )
                        }
                        this.saveHandler.call(this.saveHandlerScope || this, this, a, end, this.eventRecord)
                    }
                }
            }, {
                text: this.cancelText,
                scope: this,
                handler: this.collapse
            }],
            items: [{
                region: 'north',
                layout: 'absolute',
                height: 35,
                border: false,
                cls: 'sch-eventeditor-timefields',
                items: [this.startDateField = new Ext.ux.form.DateTime({
                    name: 'StartDate',
                    x: 10,
                    y: 7,
                    width: 160,
                    timeFormat: this.timeFormat,
                    timeWidth: 60,
                    timeConfig: this.timeConfig,
                    dateFormat: this.dateFormat,
                    // add by zhangchang
                    format : 'Y-m-d',
                    dateConfig: {
                        allowBlank: false
                    }
                }), this.durationField = new Ext.ux.form.SpinnerField({
                    x: 180,
                    y: 7,
                    width: 55,
                    allowBlank: false
                }), new Ext.form.Label({
                    y: 7,
                    x: 240,
                    xtype: 'label',
                    text: this.hoursText
                })]
            },
            this.fieldsPanelConfig]
        });
        Sch.plugins.EventEditor.superclass.initComponent.call(this)
    },
    init: function (a) {
        a.on('eventdblclick', this.onEventDblClick, this);
        a.on('render', this.onGridRender, this);
        a.on('beforedestroy', function () {
            a.un('eventdblclick', this.onEventDblClick, this)
        });
        this.grid = a
    },
    onEventDblClick: function (g, a) {
    	if(this.grid.fnEventEditable(g, a)){
            this.show(a)
    	}
    },
    onGridRender: function () {
        this.render(Ext.getBody())
    }
});
Ext.ns('Sch.plugins');
Sch.plugins.Lines = function (a) {
    Ext.apply(this, a)
};
Ext.extend(Sch.plugins.Lines, Ext.util.Observable, {
    dateFormat: 'y-m-d G:i',
    getLineElements: function () {
        return this.containerEl.select('.' + this.cls)
    },
    removeLineElements: function () {
        return this.getLineElements().remove()
    },
    init: function (a) {
        this.grid = a;
        this.cls = 'sch-verticalLine-' + Ext.id();
        if (!this.store) {
            throw 'You must configure a store to supply data to this plugin';
        }
        a.on('render', this.onRender, this)
    },
    onRender: function (a) {
        this.containerEl = a.getView().scroller;
        this.gridBodyEl = a.getView().mainBody;
        this.store.on({
            "load": this.createLines,
            "datachanged": this.createLines,
            "add": this.createLines,
            "remove": this.createLines,
            "update": this.createLines,
            "clear": this.createLines,
            scope: this
        });
        var v = a.getView();
        a.on('viewchange', this.createLines, this);
        v.on('refresh', this.createLines, this);
        v.on('rowremoved', this.refreshLines, this);
        v.on('rowsinserted', this.refreshLines, this);
        if ('togglegroup' in v.events) {
            v.on('togglegroup', this.refreshLines, this)
        }
        if ('togglerow' in v.events) {
            v.on('togglerow', this.refreshLines, this)
        }
        a.mon(a.getColumnModel(), 'hiddenchange', this.createLines, this);
        this.createLines()
    },
    onResize: function () {
        if (this.getLineElements().getCount() > 0) {
            this.createLines()
        }
    },
    createLines: function () {
        this.createLinesInternal.defer(200, this)
    },
    createLinesInternal: function () {
    	if(this.gridBodyEl.dom){
	        var h = this.gridBodyEl.getHeight();
	        this.removeLineElements();
	        this.store.each(function (r) {
	            if (r.get('Date').between(this.grid.getStart(), this.grid.getEnd())) {
	                this.buildMarker(r, h)
	            }
	        }, this);
    	}
    },
    buildMarker: function (r, a) {
        var b = this.grid.getStart(),
            itemStart = r.get('Date'),
            lOff = this.grid.getXFromDate(itemStart);
        Ext.DomHelper.append(this.containerEl, {
            cls: 'sch-verticalLine ' + this.cls + ' ' + (r.get('Cls') || ''),
            title: String.format('{1} - {0}', (r.get('Text') || ''), r.get('Date').format(this.dateFormat)),
            style: {
                height: a + 'px',
                left: lOff + 'px'
            }
        })
    },
    refreshLines: function () {
        var h = this.gridBodyEl.getHeight();
        this.getLineElements().setHeight(h)
    }
});
Ext.ns('Sch.plugins');
Sch.plugins.Resize = function (a) {
    Ext.apply(this, a);
    Sch.plugins.Resize.superclass.constructor.call(this)
};
Ext.extend(Sch.plugins.Resize, Ext.util.Observable, {
    useTooltip: true,
    validatorFn: function (a, b, c, d, e) {
        return true
    },
    validatorFnScope: null,
    init: function (a) {
        this.grid = a;
        if (!this.tipTemplate) {
            this.tipTemplate = new Ext.Template('<div class="sch-timetipwrap {cls}">', '<div class="sch-clock">', '<img src="' + Ext.BLANK_IMAGE_URL + '" class="sch-hourIndicator" style="-moz-transform: rotate({startHourDegrees}deg);-webkit-transform: rotate({startHourDegrees}deg)"/>', '<img src="' + Ext.BLANK_IMAGE_URL + '" class="sch-minuteIndicator" style="-moz-transform: rotate({startMinuteDegrees}deg);-webkit-transform: rotate({startMinuteDegrees}deg)"/>', '{startText}', '</div>', '<div class="sch-clock">', '<img src="' + Ext.BLANK_IMAGE_URL + '" class="sch-hourIndicator" style="-moz-transform: rotate({endHourDegrees}deg);-webkit-transform: rotate({endHourDegrees}deg)"/>', '<img src="' + Ext.BLANK_IMAGE_URL + '" class="sch-minuteIndicator" style="-moz-transform: rotate({endMinuteDegrees}deg);-webkit-transform: rotate({endMinuteDegrees}deg)"/>', '{endText}', '</div>', '</div>').compile()
        }
        this.grid.on('render', this.onGridRender, this)
    },
    onGridRender: function () {
        this.grid.mon(this.grid.getView().mainBody, 'mousedown', function (e) {
            var a = e.getTarget(this.grid.eventSelector),
                rec = this.grid.getEventRecordFromDomId(a.id);
            if (this.grid.fireEvent('beforeresize', this.grid, rec, e) === false) {
                return
            }
            e.stopEvent();
            this.createResizable(Ext.get(a), rec, e);
            this.grid.fireEvent('resizestart', this.grid, rec)
        }, this, {
            delegate: '.x-resizable-handle'
        })
    },
    createResizable: function (a, b, e) {
        var t = e.getTarget(),
            isWest = !! t.className.match('x-resizable-handle-west'),
            resourceRecord = this.grid.getResourceRecordByElement(t),
            row = a.up('tr'),
            r = new Sch.LazyResizable(a, {
                row: row,
                resourceRecord: resourceRecord,
                eventRecord: b,
                handles: isWest ? 'w' : 'e',
                dynamic: true,
                widthIncrement: 1,
                constrainTo: row,
                minWidth: 1,
                listeners: {
                    partialresize: {
                        fn: this[isWest ? 'partialWestResize' : 'partialEastResize'],
                        scope: this
                    },
                    resize: {
                        fn: this.afterResize,
                        scope: this
                    }
                }
            }, isWest ? 'west' : 'east', e);
        if (this.useTooltip) {
            var c = this.getTipContent(b.get('StartDate'), b.get('EndDate'), true);
            if (!this.tip) {
                this.tip = new Ext.QuickTip({
                    cls: 'sch-tip',
                    width: 145,
                    height: 40,
                    autoHide: false,
                    anchor: 'b',
                    anchorToTarget: true,
                    html: c
                })
            }
            this.tip.initTarget(a);
            this.tip.show();
            this.tip.body.update(c)
        }
    },
    partialEastResize: function (r, a, b, e) {
        var g = this.grid,
            start = r.eventRecord.get('StartDate'),
            elRight = r.el.getRight(),
            colIndex = this.findColIndex(r.row, elRight),
            end = g.getTimeFromX(colIndex, elRight);
        if (colIndex < 0 || !start || !end) return;
        var c = g.roundDate(end),
            valid = this.validatorFn.call(this.validatorFnScope || this, r.resourceRecord, r.eventRecord, start, c) !== false;
        r.end = c;
        g.fireEvent('partialresize', g, r.eventRecord, start, c, r.el, e);
        if (this.useTooltip) {
            this.tip.body.update(this.getTipContent(start, end, valid))
        }
    },
    partialWestResize: function (r, a, b, e) {
        var g = this.grid,
            end = r.eventRecord.get('EndDate'),
            elLeft = r.el.getLeft(),
            colIndex = this.findColIndex(r.row, elLeft);
        if (colIndex < 0) return;
        var c = g.getTimeFromX(colIndex, elLeft),
            roundedStart = g.roundDate(c);
        if (!c || !end) return;
        var d = this.validatorFn.call(this.validatorFnScope || this, r.resourceRecord, r.eventRecord, roundedStart, end) !== false;
        r.start = roundedStart;
        g.fireEvent('partialresize', g, r.eventRecord, roundedStart, end, r.el, e);
        if (this.useTooltip) {
            this.tip.body.update(this.getTipContent(c, end, d))
        }
    },
    findColIndex: function (a, x) {
        var b = a.down('td.sch-timetd'),
            firstTimeCellLeft = b.getLeft(),
            relativeX = x - firstTimeCellLeft,
            colIndex = Math.floor(relativeX / b.getWidth());
        return colIndex
    },
    afterResize: function (r, w, h, e) {
        if (this.useTooltip) {
            this.tip.hide()
        }
        var a = r.resourceRecord,
            eventRecord = r.eventRecord,
            oldStart = eventRecord.get('StartDate'),
            oldEnd = eventRecord.get('EndDate'),
            start = r.start || oldStart,
            end = r.end || oldEnd;
        if (start && end && (end - start > 0) && ((start - oldStart !== 0) || (end - oldEnd !== 0)) && this.validatorFn.call(this.validatorFnScope || this, a, eventRecord, start, end, e) !== false) {
            //eventRecord.beginEdit();
            eventRecord.set('StartDate', start);
            eventRecord.set('EndDate', end);
            //eventRecord.endEdit()
        } else {
            this.grid.getView().refreshRow(a)
        }
        r.destroy();
        this.grid.fireEvent('afterresize', this.grid, eventRecord)
    },
    getTipContent: function (a, b, c) {
        var g = this.grid,
            roundedStart = g.floorDate(a),
            roundedEnd = g.roundDate(b),
            formattedStart = g.getFormattedDate(a, 'floor'),
            formattedEnd = g.getFormattedEndDate(roundedEnd);
        return this.tipTemplate.apply({
            cls: c ? 'sch-tip-ok' : 'sch-tip-notok',
            startText: formattedStart,
            endText: formattedEnd,
            startHourDegrees: roundedStart.getHours() * 30,
            startMinuteDegrees: roundedStart.getMinutes() * 6,
            endHourDegrees: roundedEnd.getHours() * 30,
            endMinuteDegrees: roundedEnd.getMinutes() * 6
        })
    }
});
Ext.ns('Sch.plugins');
Sch.plugins.Zones = function (a) {
    Ext.apply(this, a)
};
Ext.extend(Sch.plugins.Zones, Ext.util.Observable, {
    disabled: false,
    setDisabled: function (a) {
        if (a) {
            this.removeZoneElements()
        }
        this.disabled = a
    },
    getZoneElements: function () {
        return this.containerEl.select('.' + this.cls)
    },
    removeZoneElements: function () {
        return this.getZoneElements().remove()
    },
    init: function (a) {
        this.grid = a;
        this.cls = this.cls || ('sch-zone-' + Ext.id());
        if (!this.template) {
            this.template = new Ext.Template('<div class="sch-zone ' + this.cls + '{Cls}" style="left:{left}px;width:{width}px;height:{height}px"></div>')
        }
        if (!this.store) {
            throw 'Without a store, there\'s not much use for this plugin';
        }
        a.on('render', this.onRender, this)
    },
    onRender: function (a) {
        this.containerEl = a.getView().scroller;
        this.gridBodyEl = a.getView().mainBody;
        this.store.on({
            "load": this.createZones,
            "datachanged": this.createZones,
            "add": this.createZones,
            "remove": this.createZones,
            "update": this.createZones,
            "clear": this.createZones,
            scope: this
        });
        a.on('viewchange', this.createZones, this);
        var v = a.getView();
        v.on('refresh', this.createZones, this);
        v.on('rowremoved', this.refreshZones, this);
        v.on('rowsinserted', this.refreshZones, this);
        if ('togglegroup' in v.events) {
            v.on('togglegroup', this.refreshZones, this)
        }
        if ('togglerow' in v.events) {
            v.on('togglerow', this.refreshZones, this)
        }
        a.mon(a.getColumnModel(), 'hiddenchange', this.createZones, this)
    },
    createZones: function () {
        if (this.disabled || this.grid.store.getCount() <= 0) return;
        this.createZonesInternal.defer(10, this)
    },
    createZonesInternal: function () {
        var h = this.gridBodyEl.getHeight(),
            start = this.grid.getStart(),
            end = this.grid.getEnd();
        this.removeZoneElements();
        this.store.each(function (r) {
            if (Date.intersectSpans(r.get('StartDate'), r.get('EndDate'), start, end)) {
                this.insertZone(r, h)
            }
        }, this)
    },
    insertZone: function (r, a) {
        var b = this.grid.getStart(),
            gridEnd = this.grid.getEnd(),
            itemStart = r.get('StartDate'),
            itemEnd = r.get('EndDate'),
            lOff = this.grid.getXFromDate(Date.max(itemStart, b)),
            width = this.grid.getXFromDate(Date.min(itemEnd, gridEnd)) - lOff;
        this.template.insertFirst(this.containerEl, Ext.apply({
            left: lOff,
            width: width,
            height: a
        }, r.data))
    },
    refreshZones: function () {
        var h = this.gridBodyEl.getHeight();
        this.getZoneElements().setHeight(h)
    }
});
Ext.ns('Sch.ViewBehaviour');
Sch.ViewBehaviour.Base = function (a) {
    this.grid = a;
    Ext.getBody().addClass(this.cssClass)
};
Ext.apply(Sch.ViewBehaviour.Base.prototype, {
    cssClass: '',
    dateFormat: 'Y-m-d',
    timeResolution: 60,
    destroy: function () {
        Ext.getBody().removeClass(this.cssClass)
    }
});
Ext.ns('Sch.ViewBehaviour');
Sch.ViewBehaviour.DayView = function (a) {
    Sch.ViewBehaviour.DayView.superclass.constructor.apply(this, arguments)
};
Ext.extend(Sch.ViewBehaviour.DayView, Sch.ViewBehaviour.Base, {
    cssClass: 'sch-dayview',
    dateFormat: 'Y-m-d G:i',
    timeResolution: 60
});
Ext.ns('Sch.ViewBehaviour');
Sch.ViewBehaviour.HourView = function (a) {
    Sch.ViewBehaviour.HourView.superclass.constructor.apply(this, arguments)
};
Ext.extend(Sch.ViewBehaviour.HourView, Sch.ViewBehaviour.Base, {
    cssClass: 'sch-hourview',
    dateFormat: 'G:i',
    timeResolution: 15
});
Ext.ns('Sch.ViewBehaviour');
Sch.ViewBehaviour.MonthView = function (a) {
    Sch.ViewBehaviour.MonthView.superclass.constructor.apply(this, arguments)
};
Ext.extend(Sch.ViewBehaviour.MonthView, Sch.ViewBehaviour.Base, {
    cssClass: 'sch-monthview',
    dateFormat: 'Y-m-d',
    timeResolution: 1440
});
Ext.ns('Sch.ViewBehaviour');
Sch.ViewBehaviour.WeekView = function (a) {
    Sch.ViewBehaviour.WeekView.superclass.constructor.apply(this, arguments)
};
Ext.extend(Sch.ViewBehaviour.WeekView, Sch.ViewBehaviour.Base, {
    cssClass: 'sch-weekview',
    dateFormat: 'Y-m-d',
    timeResolution: 1440
});
Ext.ns('Sch.ViewBehaviour');
Sch.ViewBehaviour.YearView = function (a) {
    Sch.ViewBehaviour.YearView.superclass.constructor.apply(this, arguments)
};
Ext.extend(Sch.ViewBehaviour.YearView, Sch.ViewBehaviour.Base, {
    cssClass: 'sch-yearview',
    dateFormat: 'Y-m-d',
    timeResolution: 1440
});
Ext.ns('Sch.plugins');
Sch.plugins.Tooltip = function (a, b) {
    Ext.apply(this, a);
    this.grid = b;
    Sch.plugins.Tooltip.superclass.constructor.call(this)
};
Ext.extend(Sch.plugins.Tooltip, Ext.ToolTip, {
    showClock: false,
    startText: 'Starts: ',
    endText: 'Ends: ',
    initComponent: function () {
        if (!this.template) {
            if (this.showClock) {
                this.template = new Ext.Template('<div class="sch-timetipwrap {cls}">', '<div class="sch-clock">', '<img src="' + Ext.BLANK_IMAGE_URL + '" class="sch-hourIndicator" style="-moz-transform: rotate({startHourDegrees}deg);-webkit-transform: rotate({startHourDegrees}deg)"/>', '<img src="' + Ext.BLANK_IMAGE_URL + '" class="sch-minuteIndicator" style="-moz-transform: rotate({startMinuteDegrees}deg);-webkit-transform: rotate({startMinuteDegrees}deg)"/>', '{startText}', '</div>', '<div class="sch-clock">', '<img src="' + Ext.BLANK_IMAGE_URL + '" class="sch-hourIndicator" style="-moz-transform: rotate({endHourDegrees}deg);-webkit-transform: rotate({endHourDegrees}deg)"/>', '<img src="' + Ext.BLANK_IMAGE_URL + '" class="sch-minuteIndicator" style="-moz-transform: rotate({endMinuteDegrees}deg);-webkit-transform: rotate({endMinuteDegrees}deg)"/>', '{endText}', '</div>', '</div>')
            } else {
                this.template = new Ext.Template('<div class="sch-timetipwrap {cls}">', '<div>', this.startText + '{startText}', '</div>', '<div>', this.endText + '{endText}', '</div>', '</div>')
            }
        }
        this.template.compile();
        Sch.plugins.Tooltip.superclass.initComponent.apply(this, arguments)
    },
    cls: 'sch-tip',
    width: 145,
    height: 40,
    autoHide: false,
    anchor: 'b-tl',
    update: function (a, b, c) {
        var d = this.getTipData(a, b, c);
        Sch.plugins.Tooltip.superclass.update.call(this, this.template.apply(d))
    },
    getTipData: function (a, b, c) {
        var g = this.grid,
            roundedStart = g.floorDate(a),
            roundedEnd = g.floorDate(b),
            formattedStart = g.getFormattedDate(a, 'floor'),
            formattedEnd = g.getFormattedEndDate(roundedEnd);
        return {
            cls: c ? 'sch-tip-ok' : 'sch-tip-notok',
            startText: formattedStart,
            endText: formattedEnd,
            startHourDegrees: roundedStart.getHours() * 30,
            startMinuteDegrees: roundedStart.getMinutes() * 6,
            endHourDegrees: roundedEnd.getHours() * 30,
            endMinuteDegrees: roundedEnd.getMinutes() * 6
        }
    },
    show: function (a) {
        a = Ext.get(a);
        this.anchorTarget = a;
        if (!this.rendered) {
            var b = new Date();
            this.html = this.template.apply(this.getTipData(b, b, true))
        }
        Sch.plugins.Tooltip.superclass.show.call(this)
    }
});
Ext.ns('Sch.plugins');
Sch.plugins.Pan = function (a) {
    Ext.apply(this, a)
};
Sch.plugins.Pan = Ext.extend(Object, {
    enableVerticalPan: true,
    hideScrollbar: false,
    init: function (a) {
        a.on('render', this.onRender, this)
    },
    onRender: function (a) {
        this.eventSelector = a.eventSelector;
        this.panEl = a.getView().scroller;
        a.mon(this.panEl, 'mousedown', this.onMouseDown, this, {
            delegate: '.x-grid3-cell'
        });
        if (this.hideScrollbar) {
            this.panEl.setStyle('overflow', 'hidden')
        }
    },
    onMouseDown: function (e, t) {
        if (!e.getTarget(this.eventSelector)) {
            e.stopEvent();
            this.mouseX = e.getPageX();
            this.mouseY = e.getPageY();
            Ext.getBody().on('mousemove', this.onMouseMove, this);
            Ext.getDoc().on('mouseup', this.onMouseUp, this)
        }
    },
    onMouseMove: function (e) {
        e.stopEvent();
        var x = e.getPageX(),
            y = e.getPageY(),
            xDelta = x - this.mouseX,
            yDelta = y - this.mouseY;
        this.panEl.scrollTo('left', this.panEl.dom.scrollLeft - xDelta);
        this.mouseX = x;
        this.mouseY = y;
        if (this.enableVerticalPan) {
            this.panEl.scrollTo('top', this.panEl.dom.scrollTop - yDelta)
        }
    },
    onMouseUp: function (e) {
        Ext.getBody().un('mousemove', this.onMouseMove, this);
        Ext.getDoc().un('mouseup', this.onMouseUp, this)
    }
});
if (Sch.plugins && Sch.plugins.SummaryColumn) {
    Ext.override(Sch.plugins.SummaryColumn, {
        dayText: 'd',
        hourText: 'h',
        minuteText: 'min'
    })
}