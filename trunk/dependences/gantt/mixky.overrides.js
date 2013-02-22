ConnectorLinePlugin = Ext.extend(Object, {
    init: function (a) {
        if (Ext.isIE) {
            return
        }
        a.onGanttRender = a.onGanttRender.createSequence(this.setup, this);
        this.gantt = a
    },
    setup: function () {
        this.el = this.gantt.getView().el.createChild({
            cls: 'sch-gantt-connector-line'
        });
        this.gantt.getDependencyManager().dnd.on({
            dndstart: this.onDndStart,
            scope: this
        })
    },
    onDndStart: function (a) {
        var b = a.dragZone.dragData,
            sourceEl = this.gantt.getElementFromEventId(b.fromId);
        this.el.alignTo(sourceEl, b.isStart ? 'l' : 'r');
        this.startXY = this.el.getXY();
        Ext.getBody().on('mousemove', this.onDrag, this);
        Ext.getBody().on('mouseup', this.onDndEnd, this)
    },
    onDrag: function (e) {
        var a = e.getXY(),
            newHeight = Math.max(1, Math.sqrt(Math.pow(a[0] - this.startXY[0], 2) + Math.pow(a[1] - this.startXY[1], 2)) - 2);
        var b = Math.atan2(a[1] - this.startXY[1], a[0] - this.startXY[0]) - (Math.PI / 2),
            rotateString = 'rotate(' + b + 'rad)';
        this.el.show().setStyle({
            "height": newHeight + 'px',
            "-o-transform": rotateString,
            "-webkit-transform": rotateString,
            "-moz-transform": rotateString,
            "transform": rotateString
        })
    },
    onDndEnd: function () {
        Ext.getBody().un('mousemove', this.onDrag, this);
        Ext.getBody().un('mouseup', this.onDndEnd, this);
        this.el.hide()
    }
});

if (Ext.isIE) {
    Ext.override(Sch.TreeGanttPanel, {
        onMouseOver : Sch.TreeGanttPanel.prototype.onMouseOver.createSequence(function(e) {
            if (this.lastItem) {
                var ct = Ext.fly(this.lastItem).up('.x-grid3-cell-inner');
                this.lastCellZindex = ct.getStyle('z-index');
                ct.setStyle('z-index', 20000);
            }
        }),

        onMouseOut : Sch.TreeGanttPanel.prototype.onMouseOut.createInterceptor(function(e) {
            if (this.lastItem) {
                Ext.fly(this.lastItem).up('.x-grid3-cell-inner').setStyle('z-index', this.lastCellZindex);
            }
        })
    });
}