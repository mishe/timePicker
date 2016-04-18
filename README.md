# timePicker
时间选择器，提供自定义日期列表和可选的时间范围，单位小时

## 参数1 ,json对象

* startDate: 开始时间
* days: 可选日期的范围（>开始时间） 整数
* timeRange: 时间的区间 字符串：'10-21',
* sp: 最终显示的时间格式：'/'
* changeDay: 日期变动后的回调

## 参数2，回调函数
当用户关闭选择框，选择确认时间，触发回调函数

## 执行后的返回值 timePicker对象

* getDay() 返回选择的日期
* getTime() 返回用户选择的时间


## 调用范例
```javascript
var booksInfo=[];
        var picker=$.timePicker({
            selected:curSelected,
            changeDay:function(day){
                var info=booksInfo[day]||['15:00','17:00','21:00'];
                if(info){
                    mockBooksInfo(info);
                }else{
                    getBooksInfo(day);
                }
                function mockBooksInfo(info){
                    $.each(info,function(i,n){
                        $('.pick-time[data-value="'+n+'"]').addClass('booked').append('<span class="booked-txt">预约</span>');
                    });
                }
            }
        },function(){
            curSelected=picker.getDay()+' '+picker.getTime();
            console.log(curSelected)
        });
```


## 效果图：

<img src="https://github.com/mishe/timePicker/blob/master/datePicker2.png?raw=true">
<img src="https://github.com/mishe/timePicker/blob/master/datePicker.png?raw=true">
