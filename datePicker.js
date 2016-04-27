$.extend({

    dateTimePicker: function (opt) {

        var options = {
                startDate: new Date(),
                days: 14,
                timeRange: '10-21',
                sp:'/',
                changeDay: function () {
                }
            },
            dayList = [],
            height,
            day,
            time;

        if(typeof(opt)=='function'){
            callback=opt;
            opt={}
        }


        opt = $.extend(options, opt);
        if (!opt.timeRange) throw  new Error('时间间距格式不正确');
        if (opt.days < 1) throw  new Error('日期跨度不能小于1天');
        var range = opt.timeRange.split('-');
        if (range[0] < 0 || range[1] > 23) throw  new Error('时间间距格式不正确');
        time = range[0];
        day=new Date(opt.startDate);
        day=day.getFullYear() + opt.sp + (day.getMonth() + 1) + opt.sp + day.getDate();


        var datePickObj = $(getTemplate(dayList)),
            timeout1, timeout2;
        $('body').append(datePickObj);
        height = $('.list-one').height();

        datePickObj.on('touchmove',function(e){
            if (!$(e.target).parents('.date-picker').length) {
                e.preventDefault()
            }
        }).on('tap', function (e) {
            if (!$(e.target).parents('.date-picker').length) {
                callback && callback();
                datePickObj.off().remove();
            }
        });
        datePickObj.find('.date-list').on('scroll', function () {
            clearTimeout(timeout1);
            timeout1 = setTimeout(changeDate, 100);
        });
        datePickObj.find('.time-list').on('scroll', function () {
            clearTimeout(timeout2);
            timeout2 = setTimeout(changeTime, 100);
        });

        function changeTime() {
            var obj = datePickObj.find('.time-list')[0],
                scrollTop = obj.scrollTop,
                key = Math.round(scrollTop / height);
            scrollTop = key * height;
            obj.scrollTop = scrollTop;
            time = parseInt(range[0]) + key;
            //console.log(time);
        }

        function changeDate() {
            var obj = datePickObj.find('.date-list')[0],
                scrollTop = obj.scrollTop,
                key = Math.round(scrollTop / height);
            scrollTop = key * height;
            obj.scrollTop = scrollTop;
            day = dayList[key];
            opt.changeDay(day);
            //console.log(day)
        }

        function template(days) {
            var str = '<div class="date-pick-wrap"><div class="date-picker"><div class="date-pick-light"></div>'
                + '<ul class="date-list"><li class="list-one">&nbsp;</li><li class="list-one">&nbsp;</li>';
            $.each(days, function (i, n) {
                str += '<li class="list-one" data-value="' + n + '">' + n + '</li>';
            });
            str += '<li class="list-one">&nbsp;</li><li class="list-one">&nbsp;</li></ul><ul class="time-list"><li class="list-one">&nbsp;</li><li class="list-one">&nbsp;</li>';
            for (var i = range[0]; i <= range[1]; i++) {
                str += '<li class="list-one" data-value="' + i + '">' + i + '</li>';
            }
            ;
            str += '<li class="list-one">&nbsp;</li><li class="list-one">&nbsp;</li></ul></div></div>';
            return str;
        }

        function getTemplate(start) {
            var startDate = new Date(opt.startDate).getTime(),
                day

            for (var i = 0; i < opt.days; i++) {
                day = new Date(startDate + i * 86400000);
                dayList.push(day.getFullYear() + opt.sp + (day.getMonth() + 1) + opt.sp + day.getDate());
            }
            return template(dayList)
        }

        return {
            getDay: function () {
                return day
            },
            getTime: function () {
                return time;
            }
        }
    },
    timePicker: function (opt, callback) {
        var options = {
                contain:$('body'),
                startDate: new Date(),
                days: 14,
                timeRange: '8:30-21:30',
                sp: '-',
                changeDay: function () {},
                selected:''
            },
            dayList = [],
            layoutDayList = [],
            timeList = [],
            //用户选择的日期
            day,
            //用户选择的时间
            time;

        if (typeof(opt) == 'function') {
            callback = opt;
            opt = {}
        }

        opt = $.extend(options, opt);
        if (!opt.timeRange) throw  new Error('时间间距格式不正确');
        if (opt.days < 1) throw  new Error('日期跨度不能小于1天');

        day=new Date(opt.startDate);
        var showToday=getStartDay();
        if(!showToday){
            day=new Date(day.getTime()+86400000);
        }
        day= day.getFullYear() + opt.sp + n2s(day.getMonth() + 1) + opt.sp + n2s(day.getDate());
        timeList = getTimeList();
        layoutDayList = getDayList(showToday);


        var obj = $(daysTemplate(showToday));
        opt.contain.append(obj);
        var overSlider=obj.find('.animate').overSlide();

        if(opt.selected){
            var s=opt.selected.split(' ');
            day=s[0];
            time=s[1];
            showTimeList(s[0]);
            obj.find('.pick-date[data-value="'+day+'"]').addClass('active');
            obj.find('.pick-time[data-value="'+time+'"]').addClass('active');
            overSlider.moveTo(obj.find('.pick-date').index(obj.find('.pick-date[data-value="'+day+'"]')))
        }else{
            showTimeList(day);
            obj.find('.pick-date').eq(0).addClass('active');
        }

        function getStartDay(){
            var endTime=opt.timeRange.split('-')[1].split(':'),
                hour=new Date().getHours();
            endTime=endTime[1]?parseInt(endTime[0],10)+.5:parseInt(endTime[0],10);
            hour=new Date().getMinutes()>=30?hour+.5:hour;
            if(hour>=endTime){
                return false;
            }
            return true;
        }

        function showTimeList(day) {
            var times = timeList,
                today=new Date();
            today=today.getFullYear() + opt.sp + n2s(today.getMonth() + 1) + opt.sp + n2s(today.getDate());
            if (day == today) {
                var hour=new Date().getHours(),
                    min=new Date().getMinutes(),
                    start=opt.timeRange.split('-')[0].split(':');

                if(hour<start[0]) {
                    hour=start;
                }else if(hour==start[0]){
                    hour=min>30?[hour+1]:start;
                }else{
                    hour=min>30?[hour+1]:[hour,30];
                }
                times = getTimeList(hour);
            }

            obj.find('.pick-time-box ul').html(timeTemplate(times));
            opt.changeDay(day);
        }

        function getTimeList(st) {
            var range = opt.timeRange.split('-'),
                start = st || range[0].split(':'),
                end = range[1].split(':'),
                timeArray = [];

            start = start[1] ? parseInt(start[0],10) + .5 : parseInt(start[0],10);
            end = end[1] ? parseInt(end[0],10) + .5 : parseInt(end[0],10);

            console.log(start, end);

            for (var i = start; i <= end; i += .5) {
                timeArray.push(i % 1 > 0 ? n2s(Math.floor(i)) + ':30' : n2s(i) + ':00');
            }
            return timeArray;
        }

        function n2s(v) {
            return v > 9 ? v : '0' + v;
        }

        function getMonthDay(day) {
            return n2s(day.getMonth() + 1) + opt.sp + n2s(day.getDate());
        }

        function getDayList(showToday) {
            var tempDay = startDay = new Date(opt.startDate),
                days = [],
                cnDay = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'],
                temp,
                len=opt.days;

            if(showToday) {
                temp = getMonthDay(startDay);
                days.push('今天<br>' + temp);
                dayList.push(startDay.getFullYear() + opt.sp + temp);
            }

            tempDay = new Date(startDay.getTime() + 86400000);
            temp = getMonthDay(tempDay);
            days.push('明天<br>' + temp);
            dayList.push(tempDay.getFullYear() + opt.sp + temp);

            for (var i = 2; i < len; i++) {
                tempDay = new Date(startDay.getTime() + i * 86400000);
                temp = getMonthDay(tempDay);
                days.push(cnDay[tempDay.getDay()] + '<br>' + temp);
                dayList.push(tempDay.getFullYear() + opt.sp + temp);
            }
            return days;
        }

        function daysTemplate(showToday) {
            var str = '<div class="choose-server-time-wrap"><div class="choose-server-time"><span class="close-btn"></span><h3>请选择服务时间</h3><div class="overslider pick-date-box"><ul class="animate">',
                len=opt.days;
            if(!showToday){
                len-=1;
            }
            str += '<li class="pick-date" data-value="' + dayList[0] + '">' + layoutDayList[0] + '</li>';

            for (var i = 1; i < len; i++) {
                str += '<li class="pick-date" data-value="' + dayList[i] + '">' + layoutDayList[i] + '</li>';
            }
            str += '</ul></div><div class="pick-time-box clearfix"><ul></ul></div></div></div>';
            return str;
        }

        function timeTemplate(times) {
            times = times || timeList;
            var str = '';
            for (i = 0; i < times.length; i++) {
                str += '<li class="pick-time" data-value="'+times[i]+'">' + times[i] + '</li>';
            }
            return str;
        }


        obj.on('touchmove', function (e) {
            if (!$(e.target).parents('.choose-server-time').length) {
                e.preventDefault()
            }
        }).on('tap', function (e) {
            if (!$(e.target).parents('.choose-server-time').length) {
                callback && callback();
                obj.off().remove();
            }
        }).on('tap', '.pick-date', function (e) {
            var obj = $(e.currentTarget)
            if(obj.hasClass('active')) return;
            obj.addClass('active').siblings().removeClass('active');
            showTimeList(obj.attr('data-value'));
            day=obj.attr('data-value');
            time='';
            return false;
        }).on('tap', '.pick-time', function (e) {
            var self=$(e.currentTarget);
            if(self.hasClass('booked')){
                return false;
            }else{
                self.addClass('active').siblings().removeClass('active');
                time=self.attr('data-value');
                callback && callback()
                setTimeout(function(){
                    obj.off().remove();
                },300);

            }
        }).on('tap', '.close-btn', function () {
            callback && callback();
            obj.off().remove();
        });

        return {
            getDay: function () {
                return day

            },
            getTime: function () {
                return time;
            }
        }
    },
  });
