---
layout: post
title: "Using Amazon STS credentials inside of a properties file"
date: 2014-09-02 13:02:53 -0400
comments: true
categories: 
---
Amazon provides several credentials providers in their Java API that let you use IAM user credentials various ways.  The credentials can come from IMDS, environment variables, or a properties file, just to name a few.

If you're developing and debugging and you need to use STS credentials your options are a bit more limited.  To help deal with this I came up with a few bits of code that, for me at least, make it significantly easier.

First, there's an `awscredentials.properties` file format you need to follow that looks like this:

```
aws.accessKeyId=XXXXXXXXXXXXXXXXXXX
aws.secretAccessKey=YYYYYYYYYYYYYYYYYYY
aws.sessionToken=ZZZZZZZZZZZZZZZZZZZ
```

Replace the X, Y, and Z strings with your credentials and put them in your resources directory where the classloader can find them.  ***DO NOT COMMIT THEM TO SOURCE CONTROL!***

Next, there's a method that loads these credentials into the system properties:

```
private static final String AWSCREDENTIALS_PROPERTIES = "awscredentials.properties";

void loadAwsCredentialsProperties() throws IOException {
	InputStream inputStream = this.getClass().getClassLoader().getResourceAsStream(AWSCREDENTIALS_PROPERTIES);
	
	// Was there a properties file?
	if (inputStream == null) {
	    // No, just return
	    return;
	}
	
	Properties properties = new Properties(System.getProperties());
	properties.load(inputStream);
	
	// set the system properties
	System.setProperties(properties);
}
```

Finally, there's the credentials provider:

```
import com.amazonaws.AmazonClientException;
import com.amazonaws.auth.AWSCredentials;
import com.amazonaws.auth.AWSCredentialsProvider;
import com.amazonaws.auth.BasicSessionCredentials;
import com.amazonaws.services.securitytoken.model.Credentials;
import com.amazonaws.util.StringUtils;

/**
 * Created by timmattison on 9/2/14.
 */
public class SystemPropertiesStsCredentialsProvider implements AWSCredentialsProvider {
    private static final String ACCESS_KEY_ID_SYSTEM_PROPERTY = "aws.accessKeyId";
    private static final String SECRET_ACCESS_KEY_SYSTEM_PROPERTY = "aws.secretAccessKey";
    private static final String SESSION_TOKEN_SYSTEM_PROPERTY = "aws.sessionToken";

    public AWSCredentials getCredentials() {
        // Get the access key ID
        String accessKeyId = StringUtils.trim(System.getProperty(ACCESS_KEY_ID_SYSTEM_PROPERTY));

        // Get the secret access key
        String secretAccessKey = StringUtils.trim(System.getProperty(SECRET_ACCESS_KEY_SYSTEM_PROPERTY));

        // Get the session token
        String sessionToken = StringUtils.trim(System.getProperty(SESSION_TOKEN_SYSTEM_PROPERTY));

        // Are we missing any of the necessary values?
        if (StringUtils.isNullOrEmpty(accessKeyId)
                || StringUtils.isNullOrEmpty(secretAccessKey)
                || StringUtils.isNullOrEmpty(sessionToken)) {
            // Yes, throw an exception like the Amazon code does
            throw new AmazonClientException(
                    "Unable to load AWS credentials from Java system "
                            + "properties (" + ACCESS_KEY_ID_SYSTEM_PROPERTY + ", "
                            + SECRET_ACCESS_KEY_SYSTEM_PROPERTY + ", and "
                            + SESSION_TOKEN_SYSTEM_PROPERTY + ")");
        }

        // Create the credentials
        Credentials sessionCredentials = new Credentials();
        sessionCredentials.setAccessKeyId(accessKeyId);
        sessionCredentials.setSecretAccessKey(secretAccessKey);
        sessionCredentials.setSessionToken(sessionToken);

        // Convert them to basic session credentials
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

This should make things quite a bit easier if you don't have access to a real IAM user and must use STS for your application.