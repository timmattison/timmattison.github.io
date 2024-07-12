---
title: "Vending scoped down permissions in AWS Lambda"
date: 2024-07-12 13:05:00
---

# {{ $frontmatter.title }}

## Terminology

### Inline session policies

I use the term `scoped down` and `scope down` to refer to taking a set of permissions and reducing them to a smaller
set. When using AWS this is done with IAM policies and those policies are referred to as `inline session policies`.

So if someone says `scope down policy` or `scoped down permissions` they're referring to a policy that has been reduced
from a larger set of permissions by means of an `inline session policy`.

These terms are useful to know because they'll help you search around for documentation on this topic when you need to.

### Trust relationships

IAM roles have a `trust relationship` that defines who can assume the role. This is important because you'll need to set
this up correctly to allow your AWS Lambda function to assume the role you want to vend.

This trust relationship shows up in the IAM console as the `trust policy` but under the hood it called
the `AssumeRolePolicyDocument`. Again, it's useful to know all these names because they're (annoyingly) used
interchangeably in the AWS documentation.

## The primary problem

You're writing an AWS Lambda function that needs to vend temporary credentials to another party (like a client-side
application). You either have a role that you want to pass on directly, or you want to scope down the permissions of a
role to only what is needed.

I'll say it upfront that in my experience it is uncommon to have a role that you'll want to provide to callers directly.
It is more common to want to scope down the permissions of a role to only what is needed.

## Kicking the tires on the APIs

In development, if you need temporary credentials to use on another system you'd probably call
the [STS GetSessionToken API](https://docs.aws.amazon.com/STS/latest/APIReference/API_GetSessionToken.html).

And if you needed temporary credentials to use on another system AND you wanted to scope those permissions down you'd
probably call
the [STS GetFederationToken API](https://docs.aws.amazon.com/STS/latest/APIReference/API_GetFederationToken.html).

This works when you have an IAM user. But what if you have an IAM role?

There is a section in the AWS documentation
called [Comparing the AWS STS API operations](https://docs.aws.amazon.com/IAM/latest/UserGuide/id_credentials_temp_request.html#stsapi_comparison)
that you should become very familiar with.

## The secondary problem

Your AWS Lambda function is running in an environment where it is using a role for permissions so you can't use these
APIs. Instead, you need to use
the [STS AssumeRole API](https://docs.aws.amazon.com/STS/latest/APIReference/API_AssumeRole.html).

But what role do you assume? You'll need to create a role that either has exactly the permissions you want to vend or
a role that has broader permissions that you can scope down.

Then you'll call the AssumeRole API, with an optional inline session policy, and get temporary credentials that you can
vend to another party.

## The solution

Here's a checklist of what you need to do:

- Create a policy for your AWS Lambda function that has the permissions necessary for it to do whatever it needs to do.
  We'll call this the `Lambda policy`.
- Create a role for your AWS Lambda function that has the `Lambda policy` attached to it. We'll call this
  the `Lambda role`.
- Create a policy that has the permissions you want to vend to another party. We'll call this the `Vend policy`.
- Create a role that has the `Vend policy` attached to it. We'll call this the `Vend role`.
- Add an `AssumeRolePolicyDocument` to the `Vend role` that allows the `Lambda role` to assume it.
- Call the AssumeRole API from your AWS Lambda function with the role ARN of the `Vend role` and an optional inline
  session policy.
- Vend the temporary credentials to the caller.
