---
layout: post
title: "Simple snippets for using AWS credentials while debugging"
date: 2014-09-02 11:28:42 -0400
comments: true
categories: 
---
While debugging and developing using the AWS SDK you'll find that sometimes you just need to use real credentials on a box that lives outside of EC2.  You should always be using [Instance Metadata](http://docs.aws.amazon.com/AWSEC2/latest/UserGuide/AESDG-chapter-instancedata.html) for your credentials inside of EC2 though.  Never use this pattern inside EC2!

Also, make sure you never commit your credentials.  That can be an expensive mistake when they show up on Github and people snag them to use them for Bitcoin mining.

**NOTE:** These snippets include `@Inject` and `@Assisted` annotations used by [Guice](https://github.com/google/guice).  If you're not using Guice remove those and the related imports.

Anyway, if you want to use static IAM user credentials you can use a credentials provider like this:

``` java
import com.amazonaws.auth.AWSCredentials;
import com.amazonaws.auth.AWSCredentialsProvider;
import com.google.inject.Inject;
import com.google.inject.assistedinject.Assisted;

/**
 * Created by timmattison on 9/2/14.
 */
public class TempNonStsCredentialsProvider implements AWSCredentialsProvider {
    private final String awsAccessKeyId;
    private final String awsSecretKey;

    @Inject
    public TempNonStsCredentialsProvider(@Assisted("awsAccessKeyId") String awsAccessKeyId,
                                         @Assisted("awsSecretKey") String awsSecretKey) {
        this.awsAccessKeyId = awsAccessKeyId;
        this.awsSecretKey = awsSecretKey;
    }

    @Override
    public AWSCredentials getCredentials() {
        return new AWSCredentials() {
            @Override
            public String getAWSAccessKeyId() {
                return awsAccessKeyId;
            }

            @Override
            public String getAWSSecretKey() {
                return awsSecretKey;
            }
        };
    }

    @Override
    public void refresh() {
        // Do nothing
    }
}
```

Pass in your credentials and you're good to go.  If you're using [STS](http://docs.aws.amazon.com/STS/latest/APIReference/Welcome.html) it requires a little bit more work.  Use this instead:

``` java
import com.amazonaws.auth.AWSCredentials;
import com.amazonaws.auth.AWSCredentialsProvider;
import com.amazonaws.auth.BasicSessionCredentials;
import com.amazonaws.services.securitytoken.model.Credentials;
import com.google.inject.assistedinject.Assisted;

import javax.inject.Inject;

/**
 * Created by timmattison on 9/2/14.
 */
public class TempStsCredentialsProvider implements AWSCredentialsProvider {
    private final String awsAccessKeyId;
    private final String awsSecretAccessKey;
    private final String awsSessionToken;

    @Inject
    public TempStsCredentialsProvider(@Assisted("awsAccessKeyId") String awsAccessKeyId,
                                      @Assisted("awsSecretAccessKey") String awsSecretAccessKey,
                                      @Assisted("awsSessionToken") String awsSessionToken) {
        this.awsAccessKeyId = awsAccessKeyId;
        this.awsSecretAccessKey = awsSecretAccessKey;
        this.awsSessionToken = awsSessionToken;
    }

    @Override
    public AWSCredentials getCredentials() {
        Credentials sessionCredentials = new Credentials();
        sessionCredentials.setAccessKeyId(awsAccessKeyId);
        sessionCredentials.setSecretAccessKey(awsSecretAccessKey);
        sessionCredentials.setSessionToken(awsSessionToken);

        BasicSessionCredentials basicSessionCredentials = new BasicSessionCredentials(
                sessionCredentials.getAccessKeyId(),
                sessionCredentials.getSecretAccessKey(),
                sessionCredentials.getSessionToken());

        return basicSessionCredentials;
    }

    @Override
    public void refresh() {
    	// Do nothing
    }
}
```

Now you just need to pass in the extra session token parameter and then you can use this to provide credentials to your AWS calls.