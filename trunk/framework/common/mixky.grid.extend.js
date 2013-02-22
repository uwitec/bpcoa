

Ext.grid.GridPanel.prototype.lineBreak = false;
Ext.grid.GridPanel.prototype.originalInitComponent = Ext.grid.GridPanel.prototype.initComponent;
Ext.grid.GridPanel.prototype.initComponent = function() {
	this.originalInitComponent();
	if (this.lineBreak) {
		this.store.on('load', function() {  
			if (this.el) {
				this.el.select("table[class=x-grid3-row-table]").each(function(x) {  
			        x.addClass('x-grid3-cell-text-visible');  
			    }); 
			}
		}, this); 
	}
}


Ext.grid.GridPanel.prototype.cellSelect = false;
Ext.grid.GridPanel.prototype.originalGetView = Ext.grid.GridPanel.prototype.getView;
Ext.grid.GridPanel.prototype.getView = function() {
	if (this.cellSelect) {
		if (this.viewConfig == null) {
			this.viewConfig = {};
		}
		this.viewConfig = Ext.applyIf(this.viewConfig, {
				templates: {
					cell: new Ext.Template(
					        '<td class="x-grid3-col x-grid3-cell x-grid3-td-{id} x-selectable {css}" style="{style}" tabIndex="0" {cellAttr}>',  
					        '<div class="x-grid3-cell-inner x-grid3-col-{id}" {attr}>{value}</div>',  
					        '</td>'  
					)
				}			
				
		});		
	}
	return this.originalGetView();
}






//if (!Ext.grid.GridView.prototype.templates) {
//	Ext.grid.GridView.prototype.templates = {};
//}
//Ext.grid.GridView.prototype.templates.cell = new Ext.Template(
//        '<td class="x-grid3-col x-grid3-cell x-grid3-td-{id} x-selectable {css}" style="{style}" tabIndex="0" {cellAttr}>',  
//        '<div class="x-grid3-cell-inner x-grid3-col-{id}" {attr}>{value}</div>',  
//        '</td>'  
//);


Ext.grid.GridView.prototype.doRender = function(cs, rs, ds, startRow, colCount, stripe){
    var ts = this.templates, ct = ts.cell, rt = ts.row, last = colCount-1;
    var tstyle = 'width:'+this.getTotalWidth()+';';
    // buffers
    var buf = [], cb, c, p = {}, rp = {}, r;
    for(var j = 0, len = rs.length; j < len; j++){
        r = rs[j]; cb = [];
        var rowIndex = (j+startRow);
        if(this.getRowStyle){
        	rp.tstyle = tstyle + this.getRowStyle(rowIndex, rs[j]);
        }else{
            rp.tstyle = tstyle;
        }
        for(var i = 0; i < colCount; i++){
            c = cs[i];
            p.id = c.id;
            p.css = i === 0 ? 'x-grid3-cell-first ' : (i == last ? 'x-grid3-cell-last ' : '');
            p.attr = p.cellAttr = "";
            p.value = c.renderer(r.data[c.name], p, r, rowIndex, i, ds);
            p.style = c.style;
            if(Ext.isEmpty(p.value)){
                p.value = "&#160;";
            }
            if(this.markDirty && r.dirty && typeof r.modified[c.name] !== 'undefined'){
                p.css += ' x-grid3-dirty-cell';
            }
            cb[cb.length] = ct.apply(p);
        }
        var alt = [];
        if(stripe && ((rowIndex+1) % 2 === 0)){
            alt[0] = "x-grid3-row-alt";
        }
        if(r.dirty){
            alt[1] = " x-grid3-dirty-row";
        }
        rp.cols = colCount;
        if(this.getRowClass){
            alt[2] = this.getRowClass(r, rowIndex, rp, ds);
        }
        rp.alt = alt.join(" ");
        rp.cells = cb.join("");
        buf[buf.length] =  rt.apply(rp);
    }
    return buf.join("");
}