---
layout: post
title: "Deploying multiple WAR files on a single instance with Elastic Beanstalk's command-line tools"
date: 2015-07-27 17:22:30 -0400
comments: true
categories: 
---

**_UPDATE_**: I briefly talked to [Nick Humrich](https://twitter.com/nhumrich) and [Abhishek K Singh](https://twitter.com/abhik5ingh) on Twitter, pointed them to this article, and it was fixed in less than 24 hours.  Nice work!  If you update your EB CLI tools to 3.4.7 or greater the bug will be fixed for you and you can ignore the rest of this article.

In June this year [AWS added the ability to run multiple WAR files with Elastic Beanstalk in a single EC2 instance](http://aws.amazon.com/about-aws/whats-new/2015/06/aws-elastic-beanstalk-supports-multiple-war-files-and-m4-instances/).  This makes deploying several small applications a lot more cost effective.

In order to do this you need to create a ZIP file containing all of the WAR files you want to deploy and you **_must_** include a directory called `.ebextensions` even if it is empty.  In my case I just added and empty file called `.ebextensions/README.md` to make it happy.  Obviously if you use `.ebextensions` for any kind of customization you won't need to do anything.

When Elastic Beanstalk sees that you've deployed a file like this it treats it differently than a normal bundle.  It takes the WAR file called `ROOT.war` and deploys that as the root application.  The rest of the WAR files are deployed in directories derived from their file names.  For example, `application1.war` would be accessed through the `/application1` path.

Deploying with `eb deploy` creates a ZIP file that includes everything in your current directory.  The problem is that `eb init` creates a `.gitignore` file in your deployment directory.  `eb deploy` picks that up that `.gitignore` and adds it to the archive.  On the EC2 instance that runs your application it sees that your archive doesn't contain just WAR files and the `.ebextensions` directory and it treats it like a normal single application deployment.  If/when this happens you'll see that you just get your WAR files placed in the `/var/lib/tomcat8/webapps/ROOT` directory.

There are two possible fixes for this problem.

Solution #1: You can just delete the `.gitignore` file.  IMHO, this isn't a great solution since you need to remember to do it for each project.

Solution #2: You can patch the Python code that creates the ZIP archive and tell it to ignore the `.gitignore` file.  To do that you need to modify your `ebcli/core/fileoperations.py` file.  On my system, since I'm not using `pip`, it was located at `~/.ebvenv/lib/python2.7/site-packages/ebcli/core/fileoperations.py`.  If you use `pip` or another package manager it will probably be in a different location.

The function you need to modify is called `zip_up_folder`.  My original version looks like this:

``` python
def zip_up_folder(directory, location, ignore_list=None):
    cwd = os.getcwd()
    try:
        os.chdir(directory)
        io.log_info('Zipping up folder at location: ' + str(os.getcwd()))
        zipf = zipfile.ZipFile(location, 'w', zipfile.ZIP_DEFLATED)
        _zipdir('./', zipf, ignore_list=ignore_list)
        zipf.close()
        LOG.debug('File size: ' + str(os.path.getsize(location)))
    finally:
        os.chdir(cwd)
```

The code I added to set up the ignore_list is:

``` python
        if ignore_list is None:
            ignore_list = []
        ignore_list.append(".gitignore")
```

So my updated function looks like this:

``` python
def zip_up_folder(directory, location, ignore_list=None):
    cwd = os.getcwd()
    try:
        os.chdir(directory)
        io.log_info('Zipping up folder at location: ' + str(os.getcwd()))
        zipf = zipfile.ZipFile(location, 'w', zipfile.ZIP_DEFLATED)

        if ignore_list is None:
            ignore_list = []
        ignore_list.append(".gitignore")

        _zipdir('./', zipf, ignore_list=ignore_list)
        zipf.close()
        LOG.debug('File size: ' + str(os.path.getsize(location)))
    finally:
        os.chdir(cwd)
```

After updating that code and doing another `eb deploy` my set of WARs were all happily running in a single EC2 instance as I'd expect.