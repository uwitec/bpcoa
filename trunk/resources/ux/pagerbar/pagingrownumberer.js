Ext.PagingRowNumberer = Ext.extend(Ext.grid.RowNumberer, {
  renderer : function(v, p, record, rowIndex, colIndex, store){
    if (this.rowspan) {
      p.cellAttr = 'rowspan="' + this.rowspan + '"';
    }

    var so = store.lastOptions;
    var sop = so? so.params : null;
    return ((sop && sop.start && sop.limit)? sop.start : 0)+ rowIndex + 1;
  }
});