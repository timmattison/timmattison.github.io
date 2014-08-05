---
layout: post
title: "Using Guice dependency injection with Quartz schedulding"
date: 2014-08-05 08:39:34 -0400
comments: true
categories: 
---
I am a big [Guice](https://github.com/google/guice) advocate.  I try to use it wherever it is possible and makes sense.  While working on a project yesterday I realized that in order to use Guice and [Quartz](http://quartz-scheduler.org/) together you need to add in some glue code.

I [found someone who had done the work already](http://codesmell.wordpress.com/2009/01/11/quartz-fits/) but their blog post was from 2009 and the Quartz API had changed a bit.  Their implementation was very close so I made the necessary modifications, tested it out, and it works perfectly.  If you're wondering how to use Guice to get dependency injection into your Quartz scheduler code you can use the two snippets of code below to do it all for you.

The first thing you need is a custom job factory that will create your jobs using Guice.  Here is the `GuiceJobFactory`:

```
import com.google.inject.Injector;
import org.quartz.Job;
import org.quartz.JobDetail;
import org.quartz.Scheduler;
import org.quartz.SchedulerException;
import org.quartz.spi.JobFactory;
import org.quartz.spi.TriggerFiredBundle;

import javax.inject.Inject;

/**
 * Created by timmattison on 8/4/14.
 */
// Some guidance from: http://codesmell.wordpress.com/2009/01/11/quartz-fits/
final class GuiceJobFactory implements JobFactory {
    private final Injector guice;

    @Inject
    public GuiceJobFactory(final Injector guice) {
        this.guice = guice;
    }

    @Override
    public Job newJob(TriggerFiredBundle triggerFiredBundle, Scheduler scheduler) throws SchedulerException {
        // Get the job detail so we can get the job class
        JobDetail jobDetail = triggerFiredBundle.getJobDetail();
        Class jobClass = jobDetail.getJobClass();

        try {
            // Get a new instance of that class from Guice so we can do dependency injection
            return (Job) guice.getInstance(jobClass);
        } catch (Exception e) {
            // Something went wrong.  Print out the stack trace here so SLF4J doesn't hide it.
            e.printStackTrace();

            // Rethrow the exception as an UnsupportedOperationException
            throw new UnsupportedOperationException(e);
        }
    }
}
```

The `GuiceJobFactory` gets the Guice injector injected into it.  It then overrides the newJob method and creates each job using the injector it was given.

The next thing you need to do is to use this `JobFactory` in your `Scheduler`.  Here's how I built my scheduler and used it to create my first job:

```
Scheduler scheduler = StdSchedulerFactory.getDefaultScheduler();
scheduler.setJobFactory(injector.getInstance(GuiceJobFactory.class));

scheduler.start();

JobDetail jobDetail = newJob(MyJob.class).build();
```

Now the `JobDetail` object will be built from the `GuiceJobFactory` and it will get all the benefits of Guice's dependency injection.  Enjoy!