---
layout: post
title: Java - Multithreaded
subtitle: Một chương trình đa luồng chứa 2 hoặc nhiều phần chạy đồng thời và mỗi phần có thể xử lý tác vụ khác nhau tại cùng một thời điểm
categories: [java]
tags: [java, thread]
---

**Note:**
* Java là multi-threaded programming language. Một chương trình đa luồng chứa 2 hoặc nhiều phần chạy đồng thời và mỗi phần có thể xử lý tác vụ khác nhau tại cùng một thời điểm
* Theo định nghĩa, đa nhiệm (multitasking) là khi nhiều tiến trình chia sẻ nguồn xử lý chung ví dụ như một CPU. Thread kế thừa ý tưởng của đa nhiệm trong các ứng dụng để bạn có thể chia nhỏ các hoạt động riêng biệt bên trong một ứng dụng đơn thành các luồng (thread) riêng lẻ. Mỗi một thread có thể chạy song song. OS phân chia thời gian xử lý không chỉ trong các ứng dụng khác nhau, mà còn trong mỗi luồng bên trong một ứng dụng.

**Cách tạo:**
Có 2 cách tạo thread trong java
* Implement Runnable interface
{% highlight java linenos %}

// Implement Runnable interface
public class RunnableDemo implements Runnable {
    private Thread thread;
    private String threadName;
    private Person person;

    public RunnableDemo(String name, Person person) {
        this.threadName = name;
        this.person = person;
    }
    public void run() {
        System.out.println("[Thread " + threadName + "] is running");
        for (int i = 0; i < 4; i++) {
            // person count
            synchronized (person) {
                person.count();
            }
            System.out.println("[Thread " + threadName + "] sleep: " + (i + 1));
            try {
                Thread.sleep(50);
            } catch (InterruptedException e) {
                System.out.println("[Thread " + threadName + "] is interrupted");
            }
        }
    }

    public Thread start() {
        System.out.println("[Thread " + threadName + "] is starting");
        if (thread == null) {
            thread = new Thread(this, threadName);
            thread.start();
        }
        return thread;
    }
}

// Create instance and start thread
public class Main {

    public static void main(String[] args) {
        Person p = new Person("Nguyen Van A", 30);
        List<Thread> allThread = new ArrayList<>();

        System.out.println(p.getName() + " count: " + p.getCount());
        RunnableDemo rd1 = new RunnableDemo("A", p);
        allThread.add(rd1.start());

        RunnableDemo rd2 = new RunnableDemo("B", p);
        allThread.add(rd2.start());

        for (Thread thread : allThread) {
            if (thread != null) {
                try {
                    thread.join();
                } catch (InterruptedException e) {
                    System.out.println("[Thread " + thread.getName() + "] is interrupted");
                }
            }
        }

        System.out.println(p.getName() + " count: " + p.getCount());
    }
}

// Person class
public class Person {
    private String name;
    private int age;
    private long count;

    // constructor, getter and setter

    public void count() {
        count++;
    }
}
{% endhighlight %}


* Extending Thread class
{% highlight java linenos %}
// Extending Thread class
public class ThreadDemo extends Thread {
    private Thread thread;
    private String threadName;
    private Person person;

    public ThreadDemo(String name, Person person) {
        this.threadName = name;
        this.person = person;
    }

    @Override
    public void run() {
        System.out.println("[Thread " + threadName + "] is running");
        for (int i = 0; i < 4; i++) {
            // person count
            synchronized (person) {
                person.count();
            }
            System.out.println("[Thread " + threadName + "] sleep: " + (i + 1));
            try {
                Thread.sleep(50);
            } catch (InterruptedException e) {
                System.out.println("[Thread " + threadName + "] is interrupted");
            }
        }
    }
}

// Create instance and start thread
public class Main {
    public static void main(String[] args) {
        Person p = new Person("Nguyen Van A", 30);
        List<Thread> allThread = new ArrayList<>();

        System.out.println(p.getName() + " count: " + p.getCount());
        ThreadDemo td1 = new ThreadDemo("A", p);
        td1.start();
        allThread.add(td1);

        ThreadDemo td2 = new ThreadDemo("A", p);
        td2.start();
        allThread.add(td2);

        for (Thread thread : allThread) {
            if (thread != null) {
                try {
                    thread.join();
                } catch (InterruptedException e) {
                    System.out.println("[Thread " + thread.getName() + "] is interrupted");
                }
            }
        }

        System.out.println(p.getName() + " count: " + p.getCount());
    }
}
{% endhighlight %}

**Mind**
* Chờ các thread thực hiện xong ta dùng `thread.join()`
{% highlight java linenos %}
List<Thread> allThread = new ArrayList<>();

Thread thread1 = new Thread(RunabledDemo, "Thread-1");
thread1.start();
allThread.add(thread1);

Thread thread2 = new Thread(RunabledDemo, "Thread-1");
thread2.start();
allThread.add(thread2);

for (Thread thread : allThread) {
    thread.join();
}
System.out.println("All thread are finish!");
{% endhighlight %}
* Gợi ý cho máy ảo nhường vị trí cho các thread khác: `Thread.yield()`
