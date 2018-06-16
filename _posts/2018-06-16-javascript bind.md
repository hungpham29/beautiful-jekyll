---
layout: post
title: Javascript bind()
categories: [ui]
tags: [javascript]
---

Khi code javascript chúng ta sẽ gặp phải trường hợp cần giữ lại _"this"_ trong function khác, nghiều người gán lại `this` bằng các biến `self`, `this`, cách làm này không có gì sai nhưng chúng ta có một cách tốt hơn, chuyên dụng hơn.

{% highlight js linenos %}
var MyJob = {
    oneFunction: function() {
        console.log('One Function');
        // todo something.
    },

    twoFunction: function() {
        console.log('Two Function');
        // todo something.
    },

    getAsyncData: function(cb) {
        if (typeof cb === 'function') {
            cb();
        }
    },

    render: function() {
        var self = this;
        this.getAsyncData(function() {
            self.oneFunction();
            self.twoFunction();
        });
    }
}

// call render
MyJob.render();
{% endhighlight %}

Nếu trong hàm render trên, chúng ta sử dụng this.oneFunction() thì sẽ gặp lỗi.

```
Uncaught TypeError: this.oneFunction is not a function
```

Chúng ta cần giữ lại context của đối tượng `MyJob` khi callback function được gọi, gọi `self.oneFunction()` cho phép chúng ta giữ lại context để callback function chạy đúng. Tuy nhiên, chúng ta có thể làm gọn hơn bằng cách sử dụng `Function.prototype.bind()`

{% highlight js linenos %}
var MyJob = {

    ...

    render: function() {
        this.getAsyncData(function() {
            this.oneFunction();
            this.twoFunction();
        }.bind(this));
    }
}
{% endhighlight %}

### Chúng ta đã làm gì?
`.bind()` đơn giản là một hàm, khi gọi, nó yêu cầu cung cấp tham số `this`. Khi chúng ta truyền tham số `this` (đây là context của MyJob) vào hàm `.bind()`, thì khi callback function chạy, `this` của nó sẽ là references của `MyJob`

Nếu bạn quan tâm function `Function.prototype.bind()` trong như thế nào, hoạt động ra sao, thì sau đây là một mô tả đơn giản của nó:

{% highlight js linenos %}
Function.prototype.bind = function(scope) {
    var fn = this;
    return function() {
        return fn.apply(scope);
    }
};
{% endhighlight %}

Và đây là ví dụ đơn giản:

{% highlight js linenos %}
var foo = {
    x: 3
}

var bar = function() {
    console.log(this.x);
}

bar(); // undefined

var barBind = bar.bind(foo);

barBind(); // 3
{% endhighlight %}

### Browser Support

Browser|Version Support
-------|---------------
Chrome|7
Firefox (Gecko)|4.0 (2)
Internet Explorer|9
Opera|11.60
Safari|5.1.4

Đối với các trình duyệt có version thấp hơn không hỗ trợ, ta có thể tự implement như sau

{% highlight js linenos %}
if (!Function.prototype.bind) {
    Function.prototype.bind = function (oThis) {
        if (typeof this !== "function") {
            // closest thing possible to the ECMAScript 5 internal IsCallable function
            throw new TypeError("Function.prototype.bind - what is trying to be bound is not callable");
        }

        var aArgs = Array.prototype.slice.call(arguments, 1),
            fToBind = this,
            fNOP = function () {},
            fBound = function () {
                return fToBind.apply(this instanceof fNOP && oThis ? this : oThis, aArgs.concat(Array.prototype.slice.call(arguments)));
            };

        fNOP.prototype = this.prototype;
        fBound.prototype = new fNOP();

        return fBound;
    };
}
{% endhighlight %}

------

**Tham khảo**
* [www.smashingmagazine.com](https://www.smashingmagazine.com/2014/01/understanding-javascript-function-prototype-bind/){:target="_blank"}