---
author: admin
comments: true
date: 2012-03-28 13:15:24+00:00
layout: post
slug: how-to-fix-maven-errors-in-eclipse-when-getting-started-with-heroku
title: 'How-To: Fix Maven errors in Eclipse when getting started with Heroku'
wordpress_id: 719
categories:
- How-To
---

I haven't used Heroku much yet but with the addition of Java to their platform I'm starting to see it as a really interesting option.  Yesterday I watched [a great video on how to get started with Java on Heroku](http://www.youtube.com/watch?feature=player_embedded&v=mkmWwA0EoGg#!).  It went well until I tried converting my project to a Maven project.  Then I got this error message in all of my pom.xml files:

`Plugin execution not covered by lifecycle configuration`

I checked the usual places but didn't find a solution to the issue.  Then I decided to try adding the m2e plugin from this update site:

`http://download.eclipse.org/technology/m2e/releases`

After adding the plugin and restarting my IDE I got two different error messages:

`maven-dependency-plugin (goals "copy-dependencies", "unpack") is not supported by m2e.`
`Project configuration is not up-to-date with pom.xml.  Run project configuration update.`

The second error had a quick fix so I tried that and it worked.  Now the Java example application that uses the Play framework and the one that uses Spring MVC and Hibernate both work.  However, the ones that used JAX-RS and embedded Jetty did not.  They still showed the maven-dependency-plugin error.  The fix is to add the following XML in the build section of your pom.xml:


    
    
    <pluginmanagement>
    	<plugins>
    		<plugin>
    			<groupid>org.eclipse.m2e</groupid>
    				<artifactid>lifecycle-mapping</artifactid>
    				<version>1.0.0</version>
    				<configuration>
    					<lifecyclemappingmetadata>
    						<pluginexecutions>
    							<pluginexecution>
    								<pluginexecutionfilter>
    									<groupid>org.apache.maven.plugins</groupid>
    									<artifactid>maven-dependency-plugin</artifactid>
    									<versionrange>[1.0.0,)</versionrange>
    									<goals>
    										<goal>copy-dependencies</goal>
    									</goals>
    								</pluginexecutionfilter>
    								<action>
    									<ignore></ignore>
    								</action>
    							</pluginexecution>
    						</pluginexecutions>
    					</lifecyclemappingmetadata>
    				</configuration>
    			</plugin>
    		</plugins>
    	</pluginmanagement>
    



After that you'll have to do the quick fix for the error "Project configuration is not up-to-date" again and then you'll be error free, at least in your pom.xml...

Post in the comments and let me know if it worked or if you need any help.
