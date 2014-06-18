---
layout: post
title: "My problem with 'The Problem with Altcoins'"
date: 2014-07-18 06:49:30 -0500
comments: true
categories: 
---

TL;DR - The author's strongest argument is that some altcoins are junk.  This unfortunately then morphs into saying that all altcoins are junk and none of them can ever be good.  In my opinion that is going too far.

On the Google Plus Bitcoin community someone posted a link to [The Problem with Altcoins](http://themisescircle.org/blog/2013/08/22/the-problem-with-altcoins/).  I think this article is complete link bait based on the fact that the first paragraph is titled "Why no altcoin can succeed" but nevertheless I'd like to address a few of the things in it because they could be confusing to people new to the cryptocurrency space.

I'll preface this post by saying that I hold a few Bitcoins, some Litecoins, and some Feathercoins.  I bought most of them to play around with and not as a serious investment so I'm not here to tell you that any of these things are a solid investment.  If you are like me you want to get into cryptocurrencies because they're interesting and understanding them gives me new ways to approach problems that I see in software development.

Issue #1:

> Quite simply, a medium of exchange that is more widely accepted on the market is more useful than one which is not. This is known as the network effect. Thus, an initial imbalance between two nearly equal media of exchange will benefit whichever is more widely accepted until a single one overwhelms the rest.

This paragraph does quite a good job of shooting itself down unknowingly.  I agree with the statement "a medium of exchange that is more widely accepted on the market is more useful than one that is not".  The leap that it then goes to make isn't very well thought out.  Just because something is better does not mean that eventually it will be the only thing.  If that was the case then why are there so many different brands of any product you can think of?

The end of this paragraph is its complete downfall.  It states "until a single one overwhelms the rest".  There is no example of this happening as far as I know.  Is there only one currency in the world?  You might think the world currency is the US Dollar but I can assure you it isn't.  Admittedly it does say it will "overwhelm" the rest and not "extinguish" the rest but I believe overwhelm here was meant to imply that the others would disappear.

My stance: There is room for more than one physical currency.  There is room for more than one digital currency.

Issue #2:

> Furthermore, a truly great innovation would much better serve people by being incorporated into future versions of Bitcoin rather than by requiring them to switch to something else

This makes the assumption that just because a feature benefits someone that it will be incorporated.  Since the interests of each individual are different you could have features that benefit some (shorter confirmation times, lower transaction fees, anonymity, etc) that do not benefit others.  In fact, one of these features mentioned later is Zerocoin which provides anonymous transactions.  Some would argue that if this was incorporated into Bitcoin that it would set it back a few years as the media picked it up again as the anonymous currency used by drug dealers and terrorists.

Other kinds of transactions like creating "[dust](http://bitcoin.stackexchange.com/questions/10986/what-is-meant-by-bitcoin-dust)" to sign arbitrary bits of data to use the block chain as a kind of digital notary are probably best implemented in a different system altogether.

My stance: Not all features should be incorporated into Bitcoin.  Blockchain bloat is already a bit of a problem and I think we need to minimize it.

Issue #3:

> Can anyone really expect to create something of value by rereleasing Bitcoin under a new name and with a few tiny changes to its source code?

Actually, I'm in total agreement here.  There are altcoins that are just knockoffs that don't add any value.  Don't translate my issue with the statement "Why no altcoin can succeed" into "All altcoins should succeed".  I think the market is the place to decide that.

My stance: Some altcoins are useful and interesting.  Some altcoins are not.  I doubt [Dogecoin](https://en.wikipedia.org/wiki/Dogecoin) will survive as long as Litecoin.

Issue #4:

> What is a cryptocurrency actually for? I say that its purpose is to become money. It is obvious that creating altcoins impedes that purpose. Altcoins can only be explained if we believe the purpose of cryptocurrencies is to make money rather than to become money.

(Premining)[https://bitcointalk.org/index.php?topic=194023.0] has rightly tainted people's views of altcoins.  If you premine your new cryptocurrency then you are probably just in it for the money.  Granted maybe not enough people knew about your coin when it started but with a public announcement and some planning you can avoid this.  Going back to my previous point I don't understand why Bitcoin gets a pass on this.  What if the original motivation was exactly the same as the altcoins that are guilty of premining?  We can't know if that was or was not the case until we know the true identity of Satoshi Nakamoto.

A lot of the time when people tell me something is "obvious" it's because they're trying to glaze over the fact that their explanation and understanding of the concept is lacking.  I prefer proof rather than assertions.

My stance: Same as issue #3.  Some altcoins are junk, some altcoins are not.  The market will decide which ones are the winners.  The author references the Wikipedia page for "[motivated reasoning](https://en.wikipedia.org/wiki/Motivated_reasoning).  Indeed either side of the argument could say the other is doing this especially when they assert the obviousness of the fact that they are right.

Issue #5:

> If you try to compete with the best currency with another one that’s exactly the same, that makes yours the worse currency, so you really should not have bothered.

Another partial agreement here so this is a quick one.  If your currency is exactly the same as Bitcoin then you shouldn't have bothered.  There are people who are trying to differentiate and that's the kind of competition we should welcome.  Starting a new altcoin gives you the freedom to try out these new ideas and see if they stick.  Getting a feature into Bitcoin takes a lot of work and an altcoin can be a proving ground for that work.

My stance: Altcoins that don't innovate are junk. If you're going to create an altcoin it better have a few differentiators to be taken seriously.

Issue #6:

> Scrypt was designed to be a memory hog and is consequently unsuited to mining with a machine consisting almost entirely of ASIC chips, like those used for Bitcoin, and it was assumed that Scrypt-coin mining would therefore always remain in the hands of the GPU owners. This, by the way, is false. If it ever became profitable enough, an ASIC machine could be produced with a shared memory, and it would make GPUs obsolete for Scrypt-mining too.

I have another post that touches this topic and explains [why all proof of work algorithms need to use memory bound functions](http://blog.timmattison.com/archives/2014/06/17/why-proof-of-work-algorithms-need-to-use-memory-bound-functions/).