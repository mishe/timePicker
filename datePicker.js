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
                startDate: new Date(),
                days: 14,
                timeRange: '8:30-21:30',
                sp: '/',
                changeDay: function () {
                }
            },
            dayList = [],
            layoutDayList = [],
            timeList = [],
            day,
            time;

        if (typeof(opt) == 'function') {
            callback = opt;
            opt = {}
        }

        opt = $.extend(options, opt);
        if (!opt.timeRange) throw  new Error('时间间距格式不正确');
        if (opt.days < 1) throw  new Error('日期跨度不能小于1天');

        timeList = getTimeList();
        layoutDayList = getDayList();

        day = new Date(opt.startDate);
        day = day.getFullYear() + opt.sp + n2s(day.getMonth() + 1) + opt.sp + n2s(day.getDate());

        var obj = $(daysTemplate(dayList));
        $('body').append(obj);
        obj.find('.animate').overSlide();
        obj.find('.pick-date').eq(0).addClass('active');
        showTimeList(day);

        function showTimeList(day) {
            var times = timeList;
            if (day == dayList[0]) {
                times = getTimeList([Math.floor(new Date().getHours()) + 1])
            }

            obj.find('.pick-time-box').remove();
            obj.find('.choose-server-time').append(timeTemplate(times));
        }

        function getTimeList(st) {
            var range = opt.timeRange.split('-'),
                start = st || range[0].split(':'),
                end = range[1].split(':'),
                timeArray = [];

            start = start[1] ? parseInt(start[0]) + .5 : parseInt(start[0]);
            end = end[1] ? parseInt(end[0]) + .5 : parseInt(end[0]);

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

        function getDayList() {
            var tempDay = day = new Date(opt.startDate),
                days = [],
                cnDay = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'],
                temp;

            temp = getMonthDay(day);
            days.push('今天<br>' + temp);
            dayList.push(day.getFullYear() + opt.sp + temp);

            tempDay = new Date(day.getTime() + 86400000);
            temp = getMonthDay(tempDay);
            days.push('明天<br>' + temp);
            dayList.push(tempDay.getFullYear() + opt.sp + temp);

            for (var i = 2; i < opt.days; i++) {
                tempDay = new Date(day.getTime() + i * 86400000);
                temp = getMonthDay(tempDay);
                days.push(cnDay[tempDay.getDay()] + '<br>' + temp);
                dayList.push(tempDay.getFullYear() + opt.sp + temp);
            }
            return days;
        }

        function daysTemplate() {
            var str = '<div class="choose-server-time-wrap"><div class="choose-server-time"><span class="close-btn"></span><h3>请选择服务时间</h3><div class="overslider pick-date-box"><ul class="animate">';
            str += '<li class="pick-date" data-value="' + dayList[0] + '">' + layoutDayList[0] + '</li>';
            for (var i = 1; i < opt.days; i++) {
                str += '<li class="pick-date" data-value="' + dayList[i] + '">' + layoutDayList[i] + '</li>';
            }
            str += '</ul></div></div></div>';
            return str;
        }

        function timeTemplate(times) {
            times = times || timeList;
            var str = '<div class="pick-time-box clearfix"><ul>';

            for (i = 0; i < times.length; i++) {
                str += '<li class="pick-time">' + times[i] + '</li>';
            }
            str += '</ul></div>';
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
            var obj = $(e.currentTarget);
            obj.addClass('active').siblings().removeClass('active');
            showTimeList(obj.attr('data-value'));
            return false;
        }).on('tap', '.time-picker', function () {
            alert()
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
    }
  });
