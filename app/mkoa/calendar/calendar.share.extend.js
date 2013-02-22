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
Ext.ns("Mixky.calendar");

Mixky.calendar.LanguageShare = {

    'MainPanel':{
        'loadMask.msg':'请等待...'
    },

    'CalendarContainer':{
        'todayBtn.text':'今天',
        'dayBtn.text':'日模式',
        'weekBtn.text':'周模式',
        'monthBtn.text':'月模式',
        'weekMenu.showAll.text':'显示全部',
        'weekMenu.onlyWeek.text':'显示工作日',
        'monthMenu.showAll.text':'显示全部',
        'monthMenu.onlyWeek.text':'显示工作日',
        'moreMenu.setting.text':'设置',
        'moreMenu.about.text':'关于我的日历',
        'moreBtn.text':'其他',
        'searchCriteria.text':'搜索',
        'moreMenu.showAlert.text':'启动提醒功能',
        'moreMenu.language.text':'语言设置'
    },

    'WestPanel':{
        'myShowAllBtn.text':'显示所有用户',
        'myAddBtn.text':'新建标签',
        'myCalendarPanel.title':'共享用户列表'
    },
    
    'EventHandler':{
        'showOnlyItem.text':'只显示此用户',
        'viewItem.hide.text':'隐藏用户',
        'viewItem.show.text':'显示用户',
        'editItem.text':'编辑标签',
        'deleteItem.text':'删除标签',
        'clearItem.text':'清空分类标签日程',
        'wholeDay':'全天',
        'untitled':'无主题',
        'unlockItem.text':'解锁',
        'lockItem.text':'锁定',
        'editEvent.title':'编辑日程',
        'deleteEvent.title':'删除日程',
        'more':'更多',
        'deleteRepeatPopup.title':'删除确认',
        'deleteRepeatPopup.msg':'单击 "Yes" 删除所有该重复日程, 单击 "No" 仅删除当前选中日程?',
        'updateRepeatPopup.title':'更新确认',
        'updateRepeatPopup.msg':'单击 "Yes" 更新所有该重复日程, 单击 "No" 仅更新当前选中日程?',
        'deleteCalendar.title':'删除确认',
        'deleteCalendar.msg':'删除分类标签，该操作将清空该分类下的所有日程，并删除该日程标签，您确定吗?',
        'clearCalendar.title':'删除确认',
        'clearCalendar.msg':'清空分类标签，该操作将清空该分类下的所有日程，您确定吗?'
    },
    
    'Editor':{
        'new.title':'新建日程',
        'edit.title':'编辑日程',
        'startDayField.label':'时间',
        'endDayField.label':'到',
        'wholeField.label':'全天',
        'subjectField.label':'主题',
        'contentField.label':'内容',
        'calendarField.label':'标签',
        'alertCB.label':'进行提示',
        'lockCB.label':'锁定',
        'deleteBtn.text':'删除',
        'saveBtn.text':'保存',
        'cancelBtn.text':'取消',
        'new.title':'新建日程',
        'edit.title':'编辑日程',
        'repeatTypeField.label':'重复设置',
        'repeatIntervalField.label':'每 ',
        'intervalUnitLabel.day.text':' 天 ',
        'intervalUnitLabel.week.text':' 周 ',
        'intervalUnitLabel.month.text':' 月 ',
        'intervalUnitLabel.year.text':' 年 ',
        'detailSetting':'详细信息',
        'returnBtn.text':'返回',
        'startAndEnd':'Start and End',
        'repeatStartField.label':'开始日期',
        'repeatNoEndRG.label':'持续生效',
        'repeatEndTimeRG.label':'指定重复次数',
        'repeatEndDateRG.label':'结束日期',
        'repeatEndTimeUnit':'后结束',
        'weekCheckGroup.label':'星期几重复',
        'monthRadioGroup.label':'重复方式',
        'repeatByDate':'几号',
        'repeatByDay':'星期几'        
    },

    'CalendarEditor':{
        'new.title':'新建标签',
        'edit.title':'编辑标签',
        'nameField.label':'名称',
        'descriptionField.label':'描述',
        'clearBtn.text':'清除',
        'saveBtn.text':'保存',
        'cancelBtn.text':'取消'
    },

    'ExpirePopup':{
        'title':'提醒事件',
        'hideCB.label':'不再显示',
        'tpl.calendar':'日历',
        'tpl.subject':'主题',
        'tpl.content':'内容',
        'tpl.leftTime':'剩余时间',
        'hour':'小时',
        'minute':'分钟',
        'untitled':'无主题',
        'noContent':'无内容'
    },

    'ResultView':{
        'cm.date':'日期',
        'cm.calendar':'用户',
        'cm.time':'时间',
        'cm.subject':'主题',
        'cm.content':'内容',
        'cm.expire':'剩余时间',
        'groupBtn.group.text':'分组',
        'groupBtn.unGroup.text':'取消分组',
        'returnBtn.text':'返回',
        'hour':'小时',
        'noSubject':'(无主题)',
        'noContent':'(无内容)',
        'loadMask.msg':'请等待...'
    },

    'DayView':{
        'loadMask.msg':'请等待...',
        'addItem.text':'新建日程',
        'events':'日程'
    },

    'MonthView':{
        'loadMask.msg':'请等待...',
        'overview':'情况',
        'showingEvents':'显示日程',
        'totalEvents':'全部日程',
        'dayPre':'周',
        'addItem.text':'新建日程',
        'clearItem.text':'清空日程',
        'cutItem.text':'剪切',
        'copyItem.text':'拷贝',
        'pasteItem.text':'粘贴',
        'events':'日程'
    },

    'Mask':{
        '12Hours':'12 小时',
        '24Hours':'24 小时',
        'ar': '阿拉伯语',
        'de': '德语',
        'en_US':'American English',
        'es': '西班牙',
        'fr': 'Français',
        'it': 'Italiano',
        'ja': '日语',
        'nl': 'Nederlandse',
        'pl': 'Polski',
        'pt': '葡萄牙语',
        'ru': '俄文',
        'zh_CN':'简体中文',
        'enable':'Enable',
        'disable':'Disable',
        'minute':'Minutes',
        'monday':'Monday',
        'sunday':'Sunday'
    },

    repeatType:[
        ['no', '不重复安排'],
        ['day', '每天重复安排'],
        ['week', '每周重复安排'],
        ['month', '每月重复安排'],
        ['year', '每年重复安排']
    ],

    getWeekDayInMonth:function(date){
        var n = date.format('N');
        var d = date.format('d');
        var w = Math.floor((d-n)/7)+1;
        var wd = date.format('l');
        var str = 'the '+w;
        if(1 == w){
            str += 'st';
        }else if(2 == w){
            str += 'nd';
        }else if(3 == w){
            str += 'rd';
        }else{
            str += 'th';
        }
        return str+' '+wd;
    },

    getIntervalText:function(rtype, intervalSlot){
        var str = '';
        if('day' == rtype){
            if(1 == intervalSlot){
                str = '每天';
            }else{
                str = '每 '+intervalSlot+' 天';
            }
        }else if('week' == rtype){
            if(1 == intervalSlot){
                str = '每周';
            }else{
                str = '每 '+intervalSlot+' 周 at ';
            }
        }else if('month' == rtype){
            if(1 == intervalSlot){
                str = '每月 ';
            }else{
                str = '每 '+intervalSlot+' 月 ';
            }
        }else if('year' == rtype){
            if(1 == intervalSlot){
                str = '每年 ';
            }else{
                str = '每 '+intervalSlot+' 年 ';
            }
        }
        return str;
    }
};

Ext.apply(Ext.ux.calendar.Mask, Ext.ux.calendar.Language);