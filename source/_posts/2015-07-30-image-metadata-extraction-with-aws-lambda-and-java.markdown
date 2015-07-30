---
layout: post
title: "Image metadata extraction with AWS Lambda and Java"
date: 2015-07-30 16:40:14 -0400
comments: true
categories: 
---

I just started a repo to keep track of [my AWS Lambda (Java) experiments](https://github.com/timmattison/aws-lambda-playground).  The first experiment is using Java to extract metadata from an uploaded image.  It is a bit unconventional because it doesn't use S3 but that was done to make the setup simpler.  Here's how you can play around with the metadata extractor...

This tutorial will walk you through getting the metadata extractor set up, calling it, and then tearing it down.  The commands in this tutorial assume you are in the `metadata-extractor` directory.

**_NOTE_**: Do not forget to do step 5 - "Tear down your function" - or you may be sorry!

## Step 1: Build the JAR

```
$ mvn clean compile test package
```

You should get a `BUILD SUCCESS` if everything worked.

## Step 2: Create the Lambda function

Navigate to [step 2 of the AWS Lambda creation process](https://console.aws.amazon.com/lambda/home?region=us-east-1#/create?step=2) (step 1 is selecting a blueprint/template which we do not want to do).

- Name your function `metadata-extractor`
- Enter a description if you want
- Set the runtime to `Java 8`
- Select `Upload a ZIP file` (it should be selected by default)
- Click "Upload" and select the file `metadata-extractor-1.0-SNAPSHOT-jar-with-dependencies.jar` from the `metadata-extractor/target` directory
- Set the handler to `com.timmattison.ImageHandler::handleRequest`
- Set the role to `Basic execution role` or `lambda_basic_execution`, whichever exists.  NOTE: If you have popups disabled this may continually tell you that you didn't fill the field in.  You MUST enable popups to get this to work.
- Set the memory to `128 MB`
- Set the timeout to `5 seconds`
- Click `Next`
- Click `Create function`

## Step 3: Create a public endpoint that you can test

You should now be on a screen that says "Lambda > Functions > metadata-extractor".  There should be five tabs visible.  They are "Code", "Configuration", "Event sources", "API endpoints", "Monitoring".

- Click on the `API endpoints` tab
- Click `Add API endpoint`
- Set `API name` to `LambdaMicroservice`
- Set `Resource name` to `metadata-extractor`
- Set `Method` to `POST`
- Set `Deployment stage` to `prod`
- Set `Security` to `Open` (we will destroy this service later so it can't be abused)
- Click `Add API endpoint`

You should now see a table with three columns.  The rightmost column "API endpoint URL" contains the URL for the endpoint you just created.  It should be similar to this:

```
https://xxxxxxxxxxx.execute-api.us-east-1.amazonaws.com/prod/metadata-extractor
```

Copy that somewhere where you can get to it later.

## Step 4: Upload an image to the URL

Now you're ready to upload an image to the URL you just created.  Lambda is expecting data in JSON format, not binary uploads.  We do something a bit hacky to make our lives easier here.  We take the image, convert it to base64, and put it into a JSON object before we upload it.  This is done with the Python script called `convert-image-to-json.py`.  Assuming your image is called `myimage.jpg` and your URL is `https://xxxxxxxxxxx.execute-api.us-east-1.amazonaws.com/prod/metadata-extractor` you would do this to upload your image.

```
$ ./convert-image-to-json.py myimage.jpg | curl -X POST https://xxxxxxxxxxx.execute-api.us-east-1.amazonaws.com/prod/metadata-extractor -d@-
```

If your image contains any metadata you'll get a response that contains a bunch of interesting info.  Here are the results from one PNG I had lying around:

> "[PNG-IHDR] Image Width - 332, [PNG-IHDR] Image Height - 48, [PNG-IHDR] Bits Per Sample - 8, [PNG-IHDR] Color Type - True Color with Alpha, [PNG-IHDR] Compression Type - Deflate, [PNG-IHDR] Filter Method - Adaptive, [PNG-IHDR] Interlace Method - No Interlace, [PNG-iCCP] ICC Profile Name - ICC Profile, [ICC Profile] Profile Size - 1960, [ICC Profile] CMM Type - appl, [ICC Profile] Version - 2.2.0, [ICC Profile] Class - Display Device, [ICC Profile] Color space - RGB , [ICC Profile] Profile Connection Space - XYZ , [ICC Profile] Profile Date/Time - Wed Mar 25 11:26:11 UTC 2009, [ICC Profile] Signature - acsp, [ICC Profile] Primary Platform - Apple Computer, Inc., [ICC Profile] Device manufacturer - appl, [ICC Profile] XYZ values - 0.9642029 1.0 0.8249054, [ICC Profile] Tag Count - 11, [ICC Profile] Profile Description - Generic RGB Profile, [ICC Profile] Apple Multi-language Profile Name - 30 skSK(Všeobecný RGB profil) hrHR(Generički RGB profil) caES(Perfil RGB genèric) ptBR(Perfil RGB Genérico) ukUA(Загальний профайл RGB) frFU(Profil générique RVB) zhTW(通用 RGB 色彩描述) itIT(Profilo RGB generico) nbNO(Generisk RGB-profil) koKR(일반 RGB 프로파일) csCZ(Obecný RGB profil) heIL(פרופיל RGB כללי) deDE(Allgemeines RGB-Profil) huHU(Általános RGB profil) svSE(Generisk RGB-profil) zhCN(普通 RGB 描述文件) jaJP(一般 RGB プロファイル) roRO(Profil RGB generic) elGR(Γενικό προφίλ RGB) ptPO(Perfil RGB genérico) nlNL(Algemeen RGB-profiel) esES(Perfil RGB genérico) thTH(โปรไฟล์ RGB ทั่วไป) trTR(Genel RGB Profili) fiFI(Yleinen RGB-profiili) plPL(Uniwersalny profil RGB) ruRU(Общий профиль RGB) arEG(ملف تعريف RGB العام) enUS(Generic RGB Profile) daDK(Generel RGB-beskrivelse), [ICC Profile] Copyright - Copyright 2007 Apple Inc., all rights reserved., [ICC Profile] Media White Point - (0.95047, 1.0, 1.0890961), [ICC Profile] Red Colorant - (0.45429993, 0.24191284, 0.014892578), [ICC Profile] Green Colorant - (0.35334778, 0.67362976, 0.09063721), [ICC Profile] Blue Colorant - (0.15664673, 0.0844574, 0.719574), [ICC Profile] Red TRC - 0.0070344, [ICC Profile] Chromatic Adaptation - sf32(0x73663332): 44 bytes, [ICC Profile] Blue TRC - 0.0070344, [ICC Profile] Green TRC - 0.0070344"
```

## Step 5: Tear down your function

The function you've created is now publicly accessible.  That means that if someone finds it they can hit it and start costing you real money.  It is in your best interest to shut this function down when you're done with it.

- Click `Actions`
- Click `Delete function`
- Click `Delete`

You're done!  Have fun!