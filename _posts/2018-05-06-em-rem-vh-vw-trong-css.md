---
layout: post
title: em, rem, vh, vw trong css
subtitle: Một số unit trong css
categories: [css]
tags: [css]
---

Trong CSS có khá nhiều unit để biểu thị kích thước, nhưng tóm lại, chúng chỉ được phân thành 2 loại là: **Absolute** (tuyệt đối) và **Relative** (tương đối)

### Absolute

Unit | Description
-----|------------
cm|centimeters
mm|millimeters
in|inches (1in = 96px = 2.54cm)
px|pixels (1px = 1/96th of 1in)
pt|points (1pt = 1/72 of 1in)
pc|picas (1pc = 12pt)

### Relative

Unit | Description
-----|------------
em|Relative to the font-size of the element (2em means 2 times the size of the current font)
ex|Relative to the x-height of the current font (rarely used)
ch|Relative to width of the "0" (zero)
rem|Relative to font-size of the root element
vw|Relative to 1% of the width of the viewport*
vh|Relative to 1% of the height of the viewport*
vmin|Relative to 1% of viewport's* smaller dimension
vmax*|Relative to 1% of viewport's* larger dimension
%|Relative to the parent element

**`*`viewport**: là kích thước cửa sổ trình duyệt  
**`*`vmax**: không được IE hỗ trợ

Khi các thiết bị smartphone càng ngày càng phổ biến, thì các đơn vị absolute như `px` nên hạn chế sử dụng,
thay vào đó ta nên dùng các đơn vị relative để quá trình tinh chỉnh kích thước trên các thiết bị có màn hình nhỏ trở nên đơn giản hơn.

* `vh`: (n)vh bằng n% so với height màn hình
* `vw`: (n)vw bằng n% so với width màn hình
* `%`: (n)% bằng n% so với kích thước element cha
* `em`: (n)em bằng n lần font-size của element cha
* `rem`: (n)rem bằng n lần font-size của root element (*html* hoặc *body*)

Trên đây là các đơn vị thường được sử dụng, do tính đơn giản và linh hoạt của chúng.

#### font-size

Hầu hết các trình duyệt hiện nay điều mặc định font-size là 16px.
Nên chúng ta có thể set font-size cho body là `%`, hoặc set luôn là `px`.
Sau đó sử dụng `em`, `rem` cho các element con.

**Ex:**
{% highlight html linenos %}
<body>
  <div class="post">
    <h3 class="heading">This is heading</div>
    <p>This is content</p>
  </div>
</body>
{% endhighlight %}

{% highlight css linenos %}
body {
  font-size: 16px;
}
.post {
  font-size: 1.5rem;
}
.heading {
  font-size: 2rem;
}
{% endhighlight %}

Khi đó `<h3 class="heading">This is heading</div>` sẽ có font-size bằng `16x2 = 32px`, `<p>This is content</p>` sẽ có font-size bằng `16x1.5 = 24px` *(`<p>` sẽ kế thừa css của element cha)*.

**_Chú ý:_** Với trường hợp `em`, kích thước nó dựa vào element cha nên ta sẽ có:
{% highlight css linenos %}
body {
  font-size: 16px;
}
.post {
  font-size: 1.5em;
}
.heading {
  font-size: 2em;
}
{% endhighlight %}

`<p>This is content</p>` vẫn sẽ có font-size bằng `24px`, nhưng đối với `<h3 class="heading">This is heading</div>` sẽ có font-size bằng `48px`, do element `.post` có font-size bằng `24px`,
nên ta cần chú ý tính toán trong trường hợp này.

#### width, height của element

CSS Width, height cho các element chúng ta chỉ cần sử dụng `%` hoặc `vw`, `vh` là OK.
Việc chúng ta cần làm là code cẩn thận để không element nào bị thiếu end tag là được.

**_Chú ý:_**
* Chúng ta cũng có thể dùng `em`, `rem` cho width, height.
* Không phải lúc nào chúng ta cũng dùng đơn vị relative, một số trượng hợp như padding, margin, border-width, ... chúng ta vẫn nên dùng `px` để đảm bảo chúng không bị thay đổi khi kích thước màn hình thay đổi.

#### Màn hình nhỏ (smartphone, etc...)

Như ví dụ trên chúng ta chỉ cần thay font-size cho tag `body`. Việc chỉnh sửa ít hơn và đơn giản hơn.
{% highlight css linenos %}
@media only screen and (max-width: 768px) {
  body {
    font-size: 26px; /*Change font-size cho màn hình nhỏ*/
  }
}
.post {
  font-size: 1.5rem;
}
.heading {
  font-size: 2rem;
}
{% endhighlight %}

------

**Tham khảo**
* [CSS Units](https://www.w3schools.com/cssref/css_units.asp){:target="_blank"}