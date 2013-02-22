/*!
 * Ext JS Library 3.1.1
 * Copyright(c) 2006-2010 Ext JS, LLC
 * licensing@extjs.com
 * http://www.extjs.com/license
 */
Ext.namespace("Mixky.editor");
/**
 * @class Ext.grid.RowNumberer
 * This is a utility class that can be passed into a {@link Ext.grid.ColumnModel} as a column config that provides
 * an automatic row numbering column.
 * <br>Usage:<br>
 <pre><code>
 // This is a typical column config with the first column providing row numbers
 var colModel = new Ext.grid.ColumnModel([
    new Ext.grid.RowNumberer(),
    {header: "Name", width: 80, sortable: true},
    {header: "Code", width: 50, sortable: true},
    {header: "Description", width: 200, sortable: true}
 ]);
 </code></pre>
 * @constructor
 * @param {Object} config The configuration options
 */
Mixky.editor.RowNumberer = Ext.extend(Object, {
    /**
     * @cfg {String} header Any valid text or HTML fragment to display in the header cell for the row
     * number column (defaults to '').
     */
    header: "",
    /**
     * @cfg {Number} width The default width in pixels of the row number column (defaults to 23).
     */
    width: 35,
    /**
     * @cfg {Boolean} sortable True if the row number column is sortable (defaults to false).
     * @hide
     */
    sortable: false,
    
    constructor : function(config){
        Ext.apply(this, config);
        if(this.rowspan){
            this.renderer = this.renderer.createDelegate(this);
        }
    },

    // private
    fixed:true,
    menuDisabled:true,
    dataIndex: '',
    id: 'numberer',
    rowspan: undefined,

    // private
    renderer : function(v, p, record, rowIndex){
        if(this.rowspan){
            p.cellAttr = 'rowspan="'+this.rowspan+'"';
        }
		var rowstate = record.get("rowstate");
		if(rowstate == '' && record.dirty){
			rowstate = "edit";
		}
		return String.format("<div class='mixky-editor-rownumberer-{0}'> {1}</div>", rowstate, rowIndex+1);
    }
});