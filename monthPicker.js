monthPicker:function(opt){
        var defaultOpt={
            years:'2015-2020',
            curValue:'2016-08',
            yes:'确认',
            no:'取消',
            onSelect:function(){

            }
        }
        opt=$.extend(defaultOpt,opt);
        var win=$(template()),
            startYear=parseInt(opt.years.split('-')[0]);
            curYear=opt.curValue.split('-')[0]||startYear,
            curMonth=opt.curValue.split('-')[1]||'01';

        function n2s(v){
            return v>9?v:'0'+v;
        }
        function template(){
            var str='<div class="month-picker-wrap"><div class="picker-box"><div class="picker-bar">'
                +'<span class="cancel-btn">'+opt.no+'</span><span class="confirm-btn">'+opt.yes+'</span>'
                +'</div><div class="picker-hover"></div><ul class="picker-year">';
            var year=opt.years.split('-');
            for(var i=year[0];i<year[1];i++){
                str+='<li class="picker-li" data-id="'+i+'">'+i+' 年</li>';
            }
            str+='</ul><ul class="picker-month">';
            for(i=1;i<13;i++){
                str+='<li class="picker-li" data-id="'+i+'">'+n2s(i)+' 月</li>';
            }
            str+='</ul></div></div>';
            return str;
        }

        $('body').append(win);
        var height=win.find('.picker-li').height(),
            height2=win.find('.picker-bar').height(),
            scroll1,scroll2;

        win.find('.picker-year').scrollTop(win.find('.picker-li[data-id='+curYear+']').position().top-height*2-height2);
        win.find('.picker-month').scrollTop(win.find('.picker-li[data-id='+parseInt(curMonth,10)+']').position().top-height*2-height2);
        win.on('click',function(e){
            if(!$(e.target).closest('.picker-box').length){
                win.off().remove();
            }
        }).on('click','.cancel-btn,.confirm-btn',function(e){
            var obj=$(e.currentTarget);
            if(obj.hasClass('cancel-btn')) {
                win.off().remove();
            }else{
                opt.onSelect(curYear,curMonth);
                win.off().remove();
            }
        });
        win.find('.picker-year').on('scroll',function(){
            clearTimeout(scroll1);
            scroll1=setTimeout(function(){
                var h=win.find('.picker-year').scrollTop(),
                    index=Math.round(h/height);
                win.find('.picker-year').scrollTop(height*index);
                curYear=startYear+index;
            },100)
        });
        win.find('.picker-month').on('scroll',function(){
            clearTimeout(scroll2);
            scroll2=setTimeout(function(){
                var h=win.find('.picker-month').scrollTop(),
                    index=Math.round(h/height);
                win.find('.picker-month').scrollTop(height*index);
                curMonth=n2s(index+1);
            },100)
        })
    }
