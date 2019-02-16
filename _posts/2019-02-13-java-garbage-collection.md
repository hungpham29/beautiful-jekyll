---
layout: post
title: Java - Garbage Collection
subtitle: Automatic garbage collection is the process of looking at heap memory, identifying which objects are in use and which are not, and deleting the unused objects.
categories: [java]
tags: [java, garbage-collection]
---
**Java Runtime Enviroment** consists of the Java Virtual Machine (JVM), Java platform core classes, and supporting Java platform libraries

**Java Development Kit** is a collection of tools for developing Java applications.

The JDK and the JRE share the Java Application Programming Interfaces (Java API). The Java API is a collection of prepackaged libraries developers use to create Java applications. The Java API makes development easier by providing the tools to complete many common programming tasks including string manipulation, date/time processing, networking, and implementing data structures (e.g., lists, maps, stacks, and queues).

**Java Virtual Machine** is an abstract computing machine. The JVM is a program that looks like a machine to the programs written to execute in it. This way, Java programs are written to the same set of interfaces and libraries. Each JVM implementation for a specific operating system, translates the Java programming instructions into instructions and commands that run on the local operating system. This way, Java programs achieve platform independence.

#### Describing Garbage Collection

**Step 1: Marking** identifies which pieces of memory are in use and which are not.

<div class="text-center overflow-auto img-70">
    <img src="../img/posts/post-gc/gc-marking.png" alt="Marking Step">
</div>

**Step 2: Normal Deletion** removes unreferenced objects leaving referenced objects and pointers to free space.

<div class="text-center overflow-auto img-70">
    <img src="../img/posts/post-gc/gc-normal-deletion.png" alt="Normal Deletion">
</div>

**Step 2a: Deletion with Compacting** you can also compact the remaining referenced objects, by moving referenced object together

<div class="text-center overflow-auto img-70">
    <img src="../img/posts/post-gc/gc-compacting.png" alt="Deletion with Compacting">
</div>

#### JVM Generations

<div class="text-center overflow-auto img-70">
    <img src="../img/posts/post-gc/gc-jvm-generation.png" alt="JVM Generation">
</div>

**Young Generation**  is where all new objects are allocated and aged. When the young generation fills up, this causes a **minor garbage collection**.

**Stop the World Event** - All minor garbage collections are "Stop the World" events. This means that all application threads are stopped until the operation completes. **Minor garbage collections** are *always* Stop the World events.

**Old Generation** is used to store long surviving objects. Eventually the old generation needs to be collected. This event is called a **major garbage collection**.

Major garbage collection are also Stop the World events. The length of the Stop the World event for a major garbage collection is affected by the kind of garbage collector that is used for the old generation space.

**Permanent Generation** contains metadata required by the JVM to describe the classes and methods used in the application.

#### The Generational Garbage Collection Process

1: First, any new objects are allocated to the eden space. Both survivor spaces start out empty.

<div class="text-center overflow-auto img-70">
    <img src="../img/posts/post-gc/gc-object-allocation.png" alt="Object Allocation">
</div>

2: When the eden space fills up, a minor garbage collection is triggered.

<div class="text-center overflow-auto img-70">
    <img src="../img/posts/post-gc/gc-filling-eden-space.png" alt="Filling Eden Space">
</div>

3: Referenced objects are moved to the first survivor space. Unreferenced objects are deleted when the eden space is cleared.

<div class="text-center overflow-auto img-70">
    <img src="../img/posts/post-gc/gc-copy-reference.png" alt="Copy Reference Objects">
</div>

4: At the next minor GC, the same thing happens for the eden space. Unreferenced objects are deleted and referenced objects are moved to a survivor space. However, in this case, they are moved to the second survivor space (S1). In addition, objects from the last minor GC on the first survivor space (S0) have their age incremented and get moved to S1. Once all surviving objects have been moved to S1, both S0 and eden are cleared. Notice we now have differently aged object in the survivor space.

<div class="text-center overflow-auto img-70">
    <img src="../img/posts/post-gc/gc-object-aging.png" alt="Object Aging">
</div>

5: At the next minor GC, the same process repeats. However this time the survivor spaces switch. Referenced objects are moved to S0. Surviving objects are aged. Eden and S1 are cleared.

<div class="text-center overflow-auto img-70">
    <img src="../img/posts/post-gc/gc-additional-aging.png" alt="Additional Aging">
</div>

6: This slide demonstrates promotion. After a minor GC, when aged objects reach a certain age threshold (8 in this example) they are promoted from young generation to old generation.

<div class="text-center overflow-auto img-70">
    <img src="../img/posts/post-gc/gc-promotion.png" alt="Promotion">
</div>

7: As minor GCs continue to occure objects will continue to be promoted to the old generation space.

<div class="text-center overflow-auto img-70">
    <img src="../img/posts/post-gc/gc-promotion-2.png" alt="Promotion">
</div>

8: So that pretty much covers the entire process with the young generation. Eventually, a major GC will be performed on the old generation which cleans up and compacts that space.

<div class="text-center overflow-auto img-70">
    <img src="../img/posts/post-gc/gc-process-summary.png" alt="Process Summary">
</div>

#### Java Garbage Collectors

Switch | Description
-----|------------
-Xms|Sets the initial heap size for when the JVM starts.
-Xmx|Sets the maximum heap size.
-Xmn|Sets the size of the Young Generation.
-XX:PermSize|Sets the starting size of the Permanent Generation.
-XX:MaxPermSize|Sets the maximum size of the Permanent Generation

**The Serial GC**

- Default for client style machines in Java SE 5 and 6
- Both minor and major garbage collections are done serially (using a single virtual CPU)
- This method moves older memory to the beginning of the heap so that new memory allocations are made into a single continuous chunk of memory at the end of the heap.

-XX:+UseSerialGC

**_Usage Cases_**

The Serial GC is the garbage collector of choice for most applications that do not have low pause time requirements and run on client-style machines. It takes advantage of only a single virtual processor for garbage collection work (therefore, its name). Still, on today's hardware, the Serial GC can efficiently manage a lot of non-trivial applications with a few hundred MBs of Java heap, with relatively short worst-case pauses (around a couple of seconds for full garbage collections).

Another popular use for the Serial GC is in environments where a high number of JVMs are run on the same machine (in some cases, more JVMs than available processors!). In such environments when a JVM does a garbage collection it is better to use only one processor to minimize the interference on the remaining JVMs, even if the garbage collection might last longer. And the Serial GC fits this trade-off nicely.

Finally, with the proliferation of embedded hardware with minimal memory and few cores, the Serial GC could make a comeback.

**The Parallel GC**

- Using multiple threads to perform the young genertion garbage collection
- By default on a host with N CPUs, the parallel garbage collector uses N garbage collector threads in the collection.
- The number of garbage collector threads can be controlled with command-line options: -XX:ParallelGCThreads=*desired number*

-XX:+UseParallelGC

**_Usage Cases_**

The Parallel collector is also called a throughput collector. Since it can use multilple CPUs to speed up application throughput. This collector should be used when a lot of work need to be done and long pauses are acceptable. For example, batch processing like printing reports or bills or performing a large number of database queries.

-XX:+UseParallelOldGC

- With the -XX:+UseParallelOldGC option, the GC is both a multithreaded young generation collector and multithreaded old generation collector.

**The Concurrent Mark Sweep (CMS) Collector**

- It attempts to minimize the pauses due to garbage collection by doing most of the garbage collection work concurrently with the application threads
- Normally the concurrent low pause collector does not copy or compact the live objects. A garbage collection is done without moving the live objects.
- If fragmentation becomes a problem, allocate a larger heap.

Note: CMS collector on young generation uses the same algorithm as that of the parallel collector.

**_Usage Cases_**

The CMS collector should be used for applications that require low pause times and can share resources with the garbage collector. Examples include desktop UI application that respond to events, a webserver responding to a request or a database responding to queries.

To enable the CMS Collector use: -XX:+UseConcMarkSweepGC

and to set the number of threads use: -XX:ParallelCMSThreads=*number*

**The G1 Garbage Collector**

The Garbage First or G1 garbage collector is available in Java 7 and is designed to be the long term replacement for the CMS collector. The G1 collector is a parallel, concurrent, and incrementally compacting low-pause garbage collector that has quite a different layout from the other garbage collectors described previously.

To enable the G1 Collector use: -XX:+UseG1GC
