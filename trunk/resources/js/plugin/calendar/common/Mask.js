/**
 * FeyaSoft Online Calendar
 * Copyright(c) 2006-2009, FeyaSoft Inc. All right reserved.
 * fzhuang@feyasoft.com
 * http://www.feyasoft.com/myCalendar
 *
 * You need buy one of the Feyasoft's License if you want to use MyCalendar in
 * your commercial product.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY
 * KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE
 * WARRANTIES OF MERCHANTABILITY,FITNESS FOR A PARTICULAR PURPOSE
 * AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
 * COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
 * OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
 * SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */
Ext.ns("Ext.ux.calendar");

Ext.ux.calendar.Mask = {
    	
    repeatType:[
        ['no', '不重复'],
        ['day', '每天'],
        ['week', '每周'],
        ['month', '每月'],
        ['year', '每年']
    ],

    colors:['668CD9', 'D96666', '59BFB3', 'F2A442', '4CB052', 'B373B3'],

    colorIndex:["blue", "red", "cyan", "orange", "green", "purple"],

    getColorByIndex:function(colorIndex){
        var mask = Ext.ux.calendar.Mask;
        for(var i = 0, len = mask.colorIndex.length; i < len; i++){
            if(colorIndex == mask.colorIndex[i]){
                return mask.colors[i];
            }
        }
        return null;
    },

    getIndexByColor:function(color){
        var mask = Ext.ux.calendar.Mask;
        for(var i = 0, len = mask.colors.length; i < len; i++){
            if(color == mask.colors[i]){
                return mask.colorIndex[i];
            }
        }
        return null;
    },
	
    getRepeatTypeStore:function() {
        var store = new Ext.data.SimpleStore({
                fields:['value', 'display'],
                data:Ext.ux.calendar.Mask.repeatType
        });
        return store;
    },

    getCalendarStore:function(){
        var store = new Ext.data.SimpleStore({
                fields:['id', 'title', 'description', 'color'],
                data:[]
        });
        return store;
    },
    
    getHourFormatStore:function(){
        var lan = Ext.ux.calendar.Mask.Mask;
    	var store = new Ext.data.SimpleStore({
                fields:['id', 'text'],
                data:[
                        ['12', lan['12Hours']],
                        ['24', lan['24Hours']]
                ]
        });
        return store;
    },

    parseHM:function(hm){
        var h, m;
        var parts = hm.split(':');
        h = parts[0];
        if('0' == h.charAt(0)){
            h = h.charAt(1);
        }
        h = parseInt(h);
        m = parts[1];
        if('0' == m.charAt(0)){
            m = m.charAt(1);
        }
        m = parseInt(m);
        return {
            h:h,
            m:m
        };
    },

    calculateActiveRow:function(cs){        
        var obj = {};
        var hm = this.parseHM(cs.activeStartTime);
        var st = hm.h*60+hm.m;
        hm = this.parseHM(cs.activeEndTime);
        var et = hm.h*60+hm.m;
        obj.intervalSlot = parseInt(cs.intervalSlot);
        obj.rowCount = 24*60/obj.intervalSlot;
        obj.activeStartRow = Math.floor(st/obj.intervalSlot);
        obj.activeEndRow = Math.floor(et/obj.intervalSlot);
        obj.numInHour = Math.floor(60/obj.intervalSlot);
        delete(cs['id']);
        delete(cs['class']); 
        obj = Ext.apply(obj, cs);
        obj.startDay = parseInt(obj.startDay);        
        obj.startRow = 0;
        obj.endRow = obj.rowCount;
        if(obj.hideInactiveRow){
            obj.startRow = obj.activeStartRow;
            obj.endRow = obj.activeEndRow;
        }        
        return obj;
    },

    getTimeStore:function(){
        var store = new Ext.data.SimpleStore({
			fields:['row', 'hour'],
			data:[]
		});
		return store;
    },

    getHMFromRow:function(intervalSlot, row, hourFormat){
        var m = intervalSlot*row;
        var h = Math.floor(m/60);
        m = m%60;
        if(10 > m){
            m = '0'+m;
        }
        if(10 > h){
            h = '0'+h;
        }
        var s = h+':'+m;
        if('12' == hourFormat){
            var dt = Date.parseDate(h+':'+m, 'H:i');
            s = dt.format('h:i A');
        }
        return s;
    },

    generateIntervalData:function(intervalSlot, start, end, hourFormat){
        var num = Math.floor(24*60/intervalSlot);
        start = start || 0;
        end = end || num;
        var data = [];
        for(var i = start; i <= end; i++){
            var o = [];
            o.push(i);
            var s = this.getHMFromRow(intervalSlot, i, hourFormat);
            o.push(s);
            data.push(o);
        }
        return data;
    },

    getIntervalFromRow:function(intervalSlot, row, hourFormat){
        var m = intervalSlot*row;
        var h = Math.floor(m/60);
        m = m%60;
        if(10 > m){
            m = '0'+m;
        }
        if(10 > h){
            h = '0'+h;
        }
        var s = h+':'+m;
        if('12' == hourFormat){
            var dt = Date.parseDate(h+':'+m, 'H:i');
            s = dt.format('h:i A');
        }
        return s;
    },

    getRowFromHM:function(hm, intervalSlot){
        if('23:59' == hm){
            hm = '24:00';
        }
        hm = Ext.ux.calendar.Mask.parseHM(hm);
        var row = Math.round(hm.h*60/intervalSlot+hm.m/intervalSlot);
        return row;
    },

    getEDStore:function(){
        var lan = Ext.ux.calendar.Mask.Mask;
        var store = new Ext.data.SimpleStore({
			fields:['value', 'display'],
			data:[
                [true, lan['enable']],
                [false, lan['disable']]
            ]
		});
		return store;
    },

    getStartDayStore:function(){
        var lan = Ext.ux.calendar.Mask.Mask;
        var store = new Ext.data.SimpleStore({
			fields:['value', 'display'],
			data:[
                [0, lan['sunday']],
                [1, lan['monday']]
            ]
		});
		return store;
    },

    getIntervalStore:function(){
        var lan = Ext.ux.calendar.Mask.Mask;
        var store = new Ext.data.SimpleStore({
			fields:['value', 'display'],
			data:[
                [10, '10 '+lan['minute']],
                [15, '15 '+lan['minute']],
                [20, '20 '+lan['minute']],
                [30, '30 '+lan['minute']],
                [60, '60 '+lan['minute']]
            ]
		});
		return store;
    },

    getDayOffset:function(sday, eday){
        if(!(sday instanceof Date)){
            sday = Date.parseDate(sday, 'Y-m-d');
        }
        if(!(eday instanceof Date)){
            eday = Date.parseDate(eday, 'Y-m-d');
        }
        var offset = sday.getElapsed(eday);
        offset = Math.round(offset/(3600000*24));
        return offset;
    },

    getWeekDayInMonth:function(date){
        var n = date.format('N');
        var d = date.format('d');
        var w = Math.floor((d-n)/7)+1;
        var wd = date.format('l');
        var str = '第'+w + '周';
        return str+' '+wd;
    },

    getIntervalText:function(rtype, intervalSlot){
        var str = '';
        if('day' == rtype){
            if(1 == intervalSlot){
                str = '每天';
            }else{
                str = '每隔 '+intervalSlot+' 天';
            }
        }else if('week' == rtype){
            if(1 == intervalSlot){
                str = '每周的';
            }else{
                str = '每隔 '+intervalSlot+' 周 的 ';
            }
        }else if('month' == rtype){
            if(1 == intervalSlot){
                str = '每月的 ';
            }else{
                str = '每隔 '+intervalSlot+' 月的 ';
            }
        }else if('year' == rtype){
            if(1 == intervalSlot){
                str = '每年的 ';
            }else{
                str = '每隔 '+intervalSlot+' 年的 ';
            }
        }
        return str;
    }
};