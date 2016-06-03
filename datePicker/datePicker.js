var template=_.template(require('./datePicker.html')),
    Year=_.template(require('./year.html')),
    Bottom=_.template(require('./bottom.html')),
    Month=_.template(require('./month.html')),
    Day=_.template(require('./day.html')),
    cfg=require('./i18n');
require('./datePicker.css');

module.exports=function(opt){
    var defaultOption={
        lang:'zh-cn',
        startDate:'1980/05/05 00:00:00',
        endDate:'2016/10/20 23:59:59',
        curDate:'',
        callback:function(){}
    };
    opt=$.extend(true,defaultOption,opt);
    cfg=cfg[opt.lang];

    var picker,pickerBox,pickerBottom,curDom=this,
        type=store.get('DatePicker')||0, //日期类型：年：0，月：1，周：2，日：3
        value=store.get('DatePickerValue')||0,//选择的时间
        size=store.get('dataPickerBottom')||0, //精确度
        curYear=parseInt(new Date().getFullYear()),
        curMonth=parseInt(new Date().getMonth())+1;
        curDay=parseInt(new Date().getDate());
        startYear=new Date(opt.startDate).getFullYear(),
        startMonth=new Date(opt.startDate).getMonth()+1,
        startDay=new Date(opt.startDate).getDate(),
        endYear=new Date(opt.endDate).getFullYear(),
        endMonth=new Date(opt.endDate).getMonth()+1;
        endDay=new Date(opt.endDate).getDate();

    if(curYear<startYear){
        throw  new Error('开始时间不能大于当前时间');
        return false;
    }
    if(curYear>endYear){
        curYear=endYear;
    }

    curDom.on('click',function(){
        if(!$('.date-picker-box').length)
            showPicker();
    });

    function showPicker(){
        picker=$(template(cfg));
        pickerBox=picker.find('.picker-box');
        pickerBottom=picker.find('.picker-bottom');
        $('body').append(picker);
        picker.on('click','.picker-type,.picker-size,.yes-btn,.no-btn',function(e){
            var self=$(e.currentTarget),
                id=self.attr('data-id');
            if(self.hasClass('picker-type') && !self.hasClass('active')){
                self.addClass('active').siblings().removeClass('active');
                pickType(id);
            }else if(self.hasClass('picker-size') && !self.hasClass('active')){
                self.addClass('active').siblings().removeClass('active');
                pickSize(id);
            }else if(self.hasClass('yes-btn')){
                pickerConfim();
            }else if(self.hasClass('no-btn')){
                pickHide();
            }
        });
        pickType(type,1);//初始化
    }

    function pickerConfim(){
        var showValue=value;
        if(showValue==0){
            $.toast('请选择一个具体的时间');
            return false;
        }
        if(type==1){
            showValue=curYear+'-'+showValue;
        }

        if(type==2 ||type==3){
            showValue=curYear+'-'+curMonth+'-'+showValue;
        }

        if(curDom[0].tagName=='INPUT'){
            curDom.val(cfg.pickerHeader[type]+':'+showValue+'--'+cfg.pickerBottom[type][size]);
        }
        opt.callback({
            type: type,
            year:curYear,
            month:curMonth,
            day:curDay,
            size: size
        });
        pickHide();
    }

    function pickHide(){
        picker.off().remove();
    }

    function pickType(v,bl){
        store.set('DatePicker',v);
        type=v;
        value=bl?value:0;
        size=bl?size:0;
        pickerBox.html('').off();
        changePicker(v,bl);
        changeBottom(v);
    }

    function pickSize(v){
        store.set('dataPickerBottom',v);
        size=v;
    }

    function changeBottom(v) {
        var index=size||0;
        pickerBottom.html(Bottom({index:index,data:cfg.pickerBottom[v]}));
    }

    function changePicker(v) {
        if(v==0){
            displayYears();
        }else if(v==1){
            displayMonths();
        }else if(v==2){
            displayWeeks();
        }else{
            displayDays();
        }
    }



    //模块
    function displayYears() {
        var year=curYear;
        value=year;
        pickerBox.html(Year({index:curYear,year:getYears(year)}));
        pickerBox.on('click','.prev,.next,.pick-date',function(e){
            var self=$(e.currentTarget);
            if(self.hasClass('next')){
                next();
            }else if(self.hasClass('prev')){
                prev();
            }else if(!self.hasClass('active')){
                self.addClass('active').siblings().removeClass('active');
                yearPick(self.text());
            }
        });

        function getYears(sy){
            var a=[];
            for(var i=0;i<12;i++){
                if(sy-i>=startYear) {
                    a.push(sy - i)
                }else{
                    break;
                }
            }
            return a;
        }

        function prev() {
            year-=12;
            if(year<startYear){
                year+=12;
                return;
            }
            pickerBox.html(Year({index:curYear,year:getYears(year)}));
        }

        function next() {
            year+=12;
            if(year>endYear){
                year=endYear;
            }
            pickerBox.html(Year({index:curYear,year:getYears(year)}));
        }

        function yearPick(v) {
            curYear=value=parseInt(v);
            store.set('DatePickerValue',v);
        }
    }

    function displayMonths(){
        value=curMonth;
        picker.find('.picker-type').eq(1).addClass('active').siblings().removeClass('active');
        if(curYear==startYear && curMonth<startMonth){
            curMonth=startMonth;
        }
        if(curYear==endYear && curMonth>endMonth){
            curMonth=endMonth;
        }

        pickerBox.html(Month({index:curMonth,year:curYear,month:cfg.month}));
        pickerBox.on('click','.prev,.next,.pick-date',function(e){
            var self=$(e.currentTarget);
            if(self.hasClass('next')){
                next();
            }else if(self.hasClass('prev')){
                prev();
            }else if(!self.hasClass('active')){
                var v=self.attr('data-id');
                if((curYear==startYear && v<startMonth) ||(curYear==endYear && v>endMonth)){
                    return false;
                }
                self.addClass('active').siblings().removeClass('active');
                monthPick(v);
            }
        });

        function prev() {
            curYear-=1;
            if(curYear<startYear){
                curYear+=1;
                return;
            }
            pickerBox.find('.picker-year-text').html(curYear);
        }

        function next() {
            curYear+=1;
            if(curYear>endYear){
                curYear=endYear;
            }
            pickerBox.find('.picker-year-text').html(curYear);
        }

        function monthPick(v) {
            curMonth=value=parseInt(v);
            store.set('DatePickerValue',v);
        }
    }
    
    function displayWeeks(bl) {
        var eq=2;
        value=curDay;
        if(bl) {
            eq=3;
        }
        picker.find('.picker-type').eq(eq).addClass('active').siblings().removeClass('active');
        writePicker();

        pickerBox.on('click','.prev,.next,.pick-date',function(e){
            var self=$(e.currentTarget);
            if(self.hasClass('next')){
                if(curYear==endYear && curMonth>=endMonth){
                    return false;
                }
                next();
            }else if(self.hasClass('prev')){
                if(curYear==startYear && curMonth<=startMonth){
                    return false;
                }
                prev();
            }else {
                WeekPick(self.text());
            }
        });

        function writePicker(){
            if(curYear==startYear && curMonth<startMonth){
                curMonth=startMonth;
            }
            if(curYear==endYear && curMonth>endMonth){
                curMonth=endMonth;
            }
            if(curYear==endYear && curMonth==endMonth && curDay>endDay){
                curDay=endDay;
            }
            if(curYear==startYear && curMonth==startMonth && curDay<startDay){
                curDay=startDay;
            }

            pickerBox.html(Day({index:curDay,year:curYear,month:curMonth,days:getDays()}));
            if(!bl) WeekPick(curDay);
        }


        function prev() {
            curMonth-=1;
            if(curMonth<1){
                curYear-=1;
                curMonth=12;
                if(curYear<startYear){
                    curYear+=1;
                    curMonth=1;
                    return false;
                }
            }
            writePicker();
        }

        function next() {
            curMonth+=1;
            if(curMonth>12){
                curYear+=1;
                curMonth=1;
                if(curYear>endYear){
                    curYear-=1;
                    curMonth=12;
                    return false;
                }
            }
            writePicker();
        }

        function WeekPick(v) {
            var len=new Date(curYear,curMonth,0).getDate(),
                obj;
            if(!$.isNumeric(v) ||(curYear==startYear && curMonth==startMonth && v<startDay)
                ||(curYear==endYear && curMonth==endMonth && v>endDay)){
                return false;
            }
            if(curYear==endYear && curMonth==endMonth && len>endDay){
                len=endDay;
            }


            if(len-v<6 && !bl){
                v=len-6;
            }
            obj=pickerBox.find('.pick-date[data-id='+v+']');
            curDay=value=v;
            obj.addClass('active').siblings().removeClass('active');
            if(!bl) {
                for (var i = 0; i < 6; i++) {
                    obj = obj.next();
                    obj.addClass('active');
                }
            }
            store.set('DatePickerValue',value);
        }

        function getDays(){
            var len=new Date(curYear,curMonth,0).getDate(),
                d=[],
                len2=new Date(curYear,curMonth-1,1).getDay();
            for(var i=0;i<7;i++){
                d.push(cfg.day[i]);
            }
            for(var i=len2;i>0;i--){
                d.push('')
            }
            for(i=1;i<len+1;i++){
                d.push(i);
            }
            if(d.length%7>0){
                len2 = 7 - d.length % 7;
                for (var i = len2; i > 0; i--) {
                    d.push('')
                }
            }
            return d;
        }
    }

    function displayDays() {
        displayWeeks(1);
    }
}
