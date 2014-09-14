---
layout: post
title: "The first Bitcoin transaction"
date: 2014-09-12 18:35:01 -0400
comments: true
categories: 
---
<link rel="stylesheet" type="text/css" href="/javascripts/libs/hexpile/Hexpile.css" />
<script type="text/javascript" language="javascript" src="/javascripts/libs/hexpile/Hexpile.nocache.js"></script>

Want to understand how Bitcoin transactions work?  Follow my next couple of posts for step-by-step explanations of what is going on behind the scenes.

NOTE: These posts are going to be extremely technical.

In this post I'm going to explain the very first Bitcoin transaction in excruciating detail.  The first Bitcoin transaction is not the first block ever mined.  The first Bitcoin transaction occurred in block 170 when the first Bitcoins were transferred from one address to another.

Each Bitcoin block contains transactions.  The first transaction is called the coinbase and is a transaction that actually mines/creates new Bitcoins.  All transactions after that are some kind of balance transfer from a set of addresses to another set of addresses.

Here is the [first, non-mining transaction from block 170](https://blockchain.info/tx/f4184fc596403b9d638783cf57adfe4c75c605f6356fbc91338530e9831e9e16):

<div id="hexpile_tx_f4184fc596403b9d638783cf57adfe4c75c605f6356fbc91338530e9831e9e16">
<pre>
Version number: 01000000

Input counter: 01
Input script #0: c997a5e56e104102fa209c6a852dd90660a20b2d9c352423edce25857fcd3704000000004847304402204e45e16932b8af514961a1d3a1a25fdf3f4f7732e9d624c6c61548ab5fb8cd410220181522ec8eca07de4860a4acdd12909d831cc56cbbac4622082221a8768d1d090147304402204e45e16932b8af514961a1d3a1a25fdf3f4f7732e9d624c6c61548ab5fb8cd410220181522ec8eca07de4860a4acdd12909d831cc56cbbac4622082221a8768d1d0901ffffffff

Output counter: 02
Output script #0: 00ca9a3b00000000434104ae1a62fe09c5f51b13905f07f06b99a2f7159b2225f374cd378d71302fa28414e7aab37397f554a7df5f142c21c1b7303b8a0626f1baded5c72a704f7e6cd84cac
Output script #1: 00286bee0000000043410411db93e1dcdb8a016b49840f8c53bc1eb68a382e97b1482ecad7b148a6909a5cb2e0eaddfb84ccf9744464f82e160bfa9b8b64f9d4c03f999b8643f656b412a3ac00000000
</pre>
</div>
<div id="hexpile_tx_f4184fc596403b9d638783cf57adfe4c75c605f6356fbc91338530e9831e9e16_output"></div>

Version number is the little endian representation of the version number of this transaction.  Future transactions in a different format could have a different version number so they can be processed in new ways.

Input counter tells us that we should expect 1 input.

Input script #0 contains all the bytes in our input script.

Output coutner tells us that we should expect 2 outputs.

Output scripts #0 and #1 contain all the bytes in the two output scripts in this transaction.  These outputs show where the Bitcoins are going.  In this case they're being sent to two different addresses.

Let's look at the input first.

<div id="hexpile_tx_f4184fc596403b9d638783cf57adfe4c75c605f6356fbc91338530e9831e9e16_input_0">
<pre>
Previous transaction hash: c997a5e56e104102fa209c6a852dd90660a20b2d9c352423edce25857fcd3704
Previous output index: 00000000
Length: 0x48
VIRTUAL_OP_PUSH: 0x47
Bytes to push: 304402204e45e16932b8af514961a1d3a1a25fdf3f4f7732e9d624c6c61548ab5fb8cd410220181522ec8eca07de4860a4acdd12909d831cc56cbbac4622082221a8768d1d0901
Sequence number: ffffffff
</pre>
</div>
<div id="hexpile_tx_f4184fc596403b9d638783cf57adfe4c75c605f6356fbc91338530e9831e9e16_input_0_output"></div>

Previous transaction hash tells us where to find the transaction that this input is working on.  This transaction hash refers to the coinbase in [block 9](https://blockchain.info/tx/0437cd7f8525ceed2324359c2d0ba26006d92d856a9c20fa0241106ee5a597c9) which mined 50 BTC.

Previous output index tells us which output script in the transaction we should apply this input script to.  In this transaction in block 9 there was only one output.

Length tells us the number of bytes that are coming up in our input script.  In this case it is `0x48` or 72 bytes.

Now we're at the actual input script.  This input script consists of a single operation (`VIRTUAL_OP_PUSH`) which pushes a 71 byte value onto the stack.  That 71 byte value is a signature that signs the previous output and the new output so that we make sure know that the person unlocking the coins is the same person spending the coins.

Bitcoin uses the ECC curve [secp256k1](https://en.bitcoin.it/wiki/Secp256k1) which is part of the [SEC 2: Recommended Elliptic Curve Domain Parameters](http://perso.univ-rennes1.fr/sylvain.duquesne/master/standards/sec2_final.pdf).  Therefore all signing and validation operations are performed with the parameters from this curve.

The really interesting part is how we do the transaction validation.  That requires a lot of explanation... as if this wasn't long and complicated enough already.

Let's look at the output script from block 9:

<div id="hexpile_tx_0437cd7f8525ceed2324359c2d0ba26006d92d856a9c20fa0241106ee5a597c9_output_0">
<pre>
VIRTUAL_OP_PUSH: 0x41
Bytes to push: 0411db93e1dcdb8a016b49840f8c53bc1eb68a382e97b1482ecad7b148a6909a5cb2e0eaddfb84ccf9744464f82e160bfa9b8b64f9d4c03f999b8643f656b412a3
OP_CHECKSIG: 0xac
</pre>
</div>
<div id="hexpile_tx_0437cd7f8525ceed2324359c2d0ba26006d92d856a9c20fa0241106ee5a597c9_output_0_output"></div>

This script pushes a value onto the stack (which happens to be a public key) and the calls `OP_CHECKSIG`.  This is called a [pay-to-pubkey transaction](https://en.bitcoin.it/wiki/Script#Obsolete_pay-to-pubkey_transaction).  Simply it says that anyone who can create a signed transaction with a certain public key can spend this output.

`OP_CHECKSIG` does four things:

1. Pops a value off of the stack and calls it the public key
2. Pops a value off of the stack and calls it the signature
3. Grabs data from the previous transaction and the current transaction and combines it in a particular way
4. Computes and checks that the data from step #3 matches the public key and signature from steps #1 and #2

Now we concatenate the input and output scripts into one larger script and get this:

<div id="hexpile_validation_script">
<pre>
VIRTUAL_OP_PUSH - 71 bytes: 0x47
Signature from block 170: 304402204e45e16932b8af514961a1d3a1a25fdf3f4f7732e9d624c6c61548ab5fb8cd410220181522ec8eca07de4860a4acdd12909d831cc56cbbac4622082221a8768d1d0901

VIRTUAL_OP_PUSH - 65 bytes: 0x41
Public key from block 9: 0411db93e1dcdb8a016b49840f8c53bc1eb68a382e97b1482ecad7b148a6909a5cb2e0eaddfb84ccf9744464f82e160bfa9b8b64f9d4c03f999b8643f656b412a3

OP_CHECKSIG: ac
</pre>
</div>
<div id="hexpile_validation_script_output"></div>

This is the most straightforward part of the process.  We are pushing the data from the input script from block 170 and then pushing the data from the output script from block 9 and executing `OP_CHECKSIG`.  This ordering makes sure that the person that originally had the Bitcoins maintains control over the final execution.  Otherwise it would be possible for an attacker to just dump everything off of the stack except for a final value of 1 which would unlock the coins.

When the Bitcoin state machine sees `OP_CHECKSIG` then the real work begins.

From above we know we pop the public key off of the stack and then pop the signature off of the stack.  Now we need to understand step #3 where we find the data that we're checking the signature of.

Step 1 - Get a copy of the previous transaction script data/output transaction script data (`VIRTUAL_OP_PUSH` and `OP_CHECKSIG`) which will be
<div id="hexpile_step_1">
<pre>
VIRTUAL_OP_PUSH: 0x41
Bytes to push: 0411db93e1dcdb8a016b49840f8c53bc1eb68a382e97b1482ecad7b148a6909a5cb2e0eaddfb84ccf9744464f82e160bfa9b8b64f9d4c03f999b8643f656b412a3
OP_CHECKSIG: 0xac
</pre>
</div>
<div id="hexpile_step_1_output"></div>
 
We will refer to this as our "new input script".

Step 2 - Get a copy of the current transaction (again, [from block 170](https://blockchain.info/tx/f4184fc596403b9d638783cf57adfe4c75c605f6356fbc91338530e9831e9e16))

<div id="hexpile_step_2">
<pre>
Current transaction: 0100000001c997a5e56e104102fa209c6a852dd90660a20b2d9c352423edce25857fcd3704000000004847304402204e45e16932b8af514961a1d3a1a25fdf3f4f7732e9d624c6c61548ab5fb8cd410220181522ec8eca07de4860a4acdd12909d831cc56cbbac4622082221a8768d1d0901ffffffff0200ca9a3b00000000434104ae1a62fe09c5f51b13905f07f06b99a2f7159b2225f374cd378d71302fa28414e7aab37397f554a7df5f142c21c1b7303b8a0626f1baded5c72a704f7e6cd84cac00286bee0000000043410411db93e1dcdb8a016b49840f8c53bc1eb68a382e97b1482ecad7b148a6909a5cb2e0eaddfb84ccf9744464f82e160bfa9b8b64f9d4c03f999b8643f656b412a3ac00000000
</pre>
</div>
<div id="hexpile_step_2_output"></div>

Step 3 - Clear out all of the inputs' script data from this transaction

Before:

<div id="hexpile_step_3a">
<pre>
:0100000001c997a5e56e104102fa209c6a852dd90660a20b2d9c352423edce25857fcd370400000000
Section to remove: 4847304402204e45e16932b8af514961a1d3a1a25fdf3f4f7732e9d624c6c61548ab5fb8cd410220181522ec8eca07de4860a4acdd12909d831cc56cbbac4622082221a8768d1d0901
:ffffffff0200ca9a3b00000000434104ae1a62fe09c5f51b13905f07f06b99a2f7159b2225f374cd378d71302fa28414e7aab37397f554a7df5f142c21c1b7303b8a0626f1baded5c72a704f7e6cd84cac00286bee0000000043410411db93e1dcdb8a016b49840f8c53bc1eb68a382e97b1482ecad7b148a6909a5cb2e0eaddfb84ccf9744464f82e160bfa9b8b64f9d4c03f999b8643f656b412a3ac00000000
</pre>
</div>
<div id="hexpile_step_3a_output"></div>

After:

<div id="hexpile_step_3b">
<pre>
:0100000001c997a5e56e104102fa209c6a852dd90660a20b2d9c352423edce25857fcd370400000000
NULL placeholder: 00
:ffffffff0200ca9a3b00000000434104ae1a62fe09c5f51b13905f07f06b99a2f7159b2225f374cd378d71302fa28414e7aab37397f554a7df5f142c21c1b7303b8a0626f1baded5c72a704f7e6cd84cac00286bee0000000043410411db93e1dcdb8a016b49840f8c53bc1eb68a382e97b1482ecad7b148a6909a5cb2e0eaddfb84ccf9744464f82e160bfa9b8b64f9d4c03f999b8643f656b412a3ac00000000
</pre>
</div>
<div id="hexpile_step_3b_output"></div>

The "after" block translates to:

<div id="hexpile_step_3c">
<pre>
Version number: 01000000
Input counter: 01

Remaining data from input #0: c997a5e56e104102fa209c6a852dd90660a20b2d9c352423edce25857fcd37040000000000ffffffff

Output counter: 02
Output script #0: 00ca9a3b00000000434104ae1a62fe09c5f51b13905f07f06b99a2f7159b2225f374cd378d71302fa28414e7aab37397f554a7df5f142c21c1b7303b8a0626f1baded5c72a704f7e6cd84cac

Output script #1: 00286bee0000000043410411db93e1dcdb8a016b49840f8c53bc1eb68a382e97b1482ecad7b148a6909a5cb2e0eaddfb84ccf9744464f82e160bfa9b8b64f9d4c03f999b8643f656b412a3ac00000000
</pre>
</div>
<div id="hexpile_step_3c_output"></div>

Step 4 - Now remove all of the OP_CODESEPARATORS from the new input script.  In block 170 there aren't any of them so the new input script doesn't change.

Step 5 - Put the new input script into the signing data at the current input number.  In step #3 this means the new input script goes where the NULL placeholder was.  This yields:

<div id="hexpile_step_5">
<pre>
:0100000001c997a5e56e104102fa209c6a852dd90660a20b2d9c352423edce25857fcd37040000000043410411db93e1dcdb8a016b49840f8c53bc1eb68a382e97b1482ecad7b148a6909a5cb2e0eaddfb84ccf9744464f82e160bfa9b8b64f9d4c03f999b8643f656b412a3acffffffff0200ca9a3b00000000434104ae1a62fe09c5f51b13905f07f06b99a2f7159b2225f374cd378d71302fa28414e7aab37397f554a7df5f142c21c1b7303b8a0626f1baded5c72a704f7e6cd84cac00286bee0000000043410411db93e1dcdb8a016b49840f8c53bc1eb68a382e97b1482ecad7b148a6909a5cb2e0eaddfb84ccf9744464f82e160bfa9b8b64f9d4c03f999b8643f656b412a3ac00000000
</pre>
</div>
<div id="hexpile_step_5_output"></div>

Which translates to:

<div id="hexpile_step_5_detail">
<pre>
Version number: 01000000
Input counter: 01
Previous transaction hash: c997a5e56e104102fa209c6a852dd90660a20b2d9c352423edce25857fcd3704
Previous output index: 00000000
Input script length: 0x43
VIRTUAL_OP_PUSH Input #0: 0x41
Bytes to push Input #0: 0411db93e1dcdb8a016b49840f8c53bc1eb68a382e97b1482ecad7b148a6909a5cb2e0eaddfb84ccf9744464f82e160bfa9b8b64f9d4c03f999b8643f656b412a3
OP_CHECKSIG Input #0: 0xac
Sequence number: ffffffff

Value bytes: 00ca9a3b00000000
Output script length: 0x43
VIRTUAL_OP_PUSH Output #0: 0x41
Bytes to push Output #0: 04ae1a62fe09c5f51b13905f07f06b99a2f7159b2225f374cd378d71302fa28414e7aab37397f554a7df5f142c21c1b7303b8a0626f1baded5c72a704f7e6cd84c
OP_CHECKSIG Output #0: 0xac

Value bytes: 00286bee00000000
Output script length: 0x43
VIRTUAL_OP_PUSH Output #1: 0x41
Bytes to push Output #1: 0411db93e1dcdb8a016b49840f8c53bc1eb68a382e97b1482ecad7b148a6909a5cb2e0eaddfb84ccf9744464f82e160bfa9b8b64f9d4c03f999b8643f656b412a3
OP_CHECKSIG Output #1: 0xac
Lock time: 00000000
</pre>
</div>
<div id="hexpile_step_5_detail_output"></div>

The value bytes represent the number of Satoshi (1 / 100,000,000th of a Bitcoin) are being transferred.  The input was a mined block that created 50 BTC and the two output blocks are getting 10 and 40 BTC, respectively.  Like all other value types in Bitcoin these values are little-endian.

Step 6 - Add the 32-bit little endian representation of the hash type onto the end of the signing data.  The hash type is the last byte of the signature which is `0x01` in this case.  Expanded into a 32-bit little endian value makes it `0x01000000`.  So our final data that needs to be signed is:

<div id="hexpile_step_6">
<pre>
:0100000001c997a5e56e104102fa209c6a852dd90660a20b2d9c352423edce25857fcd37040000000043410411db93e1dcdb8a016b49840f8c53bc1eb68a382e97b1482ecad7b148a6909a5cb2e0eaddfb84ccf9744464f82e160bfa9b8b64f9d4c03f999b8643f656b412a3acffffffff0200ca9a3b00000000434104ae1a62fe09c5f51b13905f07f06b99a2f7159b2225f374cd378d71302fa28414e7aab37397f554a7df5f142c21c1b7303b8a0626f1baded5c72a704f7e6cd84cac00286bee0000000043410411db93e1dcdb8a016b49840f8c53bc1eb68a382e97b1482ecad7b148a6909a5cb2e0eaddfb84ccf9744464f82e160bfa9b8b64f9d4c03f999b8643f656b412a3ac00000000
Hash type: 01000000
</pre>
</div>
<div id="hexpile_step_6_output"></div>

If the signature from block 170 is a valid signature for this blob of binary data we just created, using the public key from block 9, then the transaction is valid.

Questions?  Comments?  Post below!