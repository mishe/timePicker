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
    }
  });
