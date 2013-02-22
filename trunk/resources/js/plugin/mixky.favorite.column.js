/*!
 * Ext JS Library 3.0.0
 * Copyright(c) 2006-2009 Ext JS, LLC
 * licensing@extjs.com
 * http://www.extjs.com/license
 */
Ext.ns('Mixky.app.favorite');

/**
 * @class Ext.ux.grid.CheckColumn
 * @extends Object
 * GridPanel plugin to add a column with check boxes to a grid.
 * <p>Example usage:</p>
 * <pre><code>
// create the column
var checkColumn = new Ext.grid.CheckColumn({
   header: 'Indoor?',
   dataIndex: 'indoor',
   id: 'check',
   width: 55
});

// add the column to the column model
var cm = new Ext.grid.ColumnModel([{
       header: 'Foo',
       ...
    },
    checkColumn
]);

// create the grid
var grid = new Ext.grid.EditorGridPanel({
    ...
    cm: cm,
    plugins: [checkColumn], // include plugin
    ...
});
 * </code></pre>
 * In addition to storing a Boolean value within the record data, this
 * class toggles a css class between <tt>'x-grid3-check-col'</tt> and
 * <tt>'x-grid3-check-col-on'</tt> to alter the background image used for
 * a column.
 */
Mixky.app.favorite.FavoriteColumn = function(config){
    Ext.apply(this, config);
    if(!this.id){
        this.id = Ext.id();
    }
    this.renderer = this.renderer.createDelegate(this);
};

Mixky.app.favorite.FavoriteColumn.prototype ={
    init : function(grid){
        this.grid = grid;
        this.grid.on('render', function(){
            var view = this.grid.getView();
            view.mainBody.on('mousedown', this.onMouseDown, this);
        }, this);
    },

    onMouseDown : function(e, t){
        if(t.className && t.className.indexOf('x-grid3-cc-'+this.id) != -1){
            e.stopEvent();
            var index = this.grid.getView().findRowIndex(t);
            var record = this.grid.getStore().getAt(index);
            var value = 0;
            if(record.data[this.dataIndex] == 0){
            	value = 1;
            }
            var title = record.data[this.titleFieldName];
            var documentkey = this.documenttypekey;
            var srcid = record.get('ID');
            if(this.documenttypekey == 'mkFavorite.dtFavorite'){
            	documentkey = record.get("F_SOURCE_KEY");
            	srcid = record.get("F_SOURCE_PARAM");
            }
            var field = this;
            Mixky.app.common.updateFavorite(documentkey, srcid, title, value, function(success){
            	record.set(field.dataIndex, value);
            	record.commit();
            });
        }
    },

    renderer : function(v, p, record){
        p.css += ' x-grid3-check-col-td'; 
        return '<div class="x-grid3-check-col'+(v>0?'-on':'')+' x-grid3-cc-'+this.id+' mixky-favorite-'+(v>0?'on':'off')+'">&#160;</div>';
    }
};