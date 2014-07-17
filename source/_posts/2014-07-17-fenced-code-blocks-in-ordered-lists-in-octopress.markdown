---
layout: post
title: "Fenced code blocks in ordered lists in Octopress"
date: 2014-07-17 06:54:17 -0400
comments: true
categories: 
---

While writing an article yesterday I ran into an issue getting fenced code blocks to work in markdown.  I searched around and came across [a gist that showed how to do it](https://gist.github.com/clintel/1155906) but I still couldn't get it to work.

It turns out that the parser used in Octopress is slightly different than some of the other parsers out there and treats this markdown differently.  There is [an issue filed for this](https://github.com/imathis/octopress/issues/488) but the issue resolution is to use a workaround.

After some experimentation I came up with some simple steps that cover all the scenarios for putting code blocks or formatted text into an ordered list while writing my blog posts.

It is organized so that the two main scenarios include four different snippets of code.  The first snippet of code is put directly before the entire block you want to format.  The second snippet of code is put before each line of code.  The third snippet of code is put after each line of code.  The fourth snippet of code is put at the end of the entire block.

1. No line numbers, no syntax highlighting.  I use this when including snippets of commands that I have run from the console.
    1. Before the block - `<div class="highlight"><pre><code>`
    2. Before each line - `<span class="line”>`
    3. After each line - `</span>`
    4. After the block - `</code></pre></div>`

2. No line numbers, syntax highlighting.  I use this for regular code if I don't care about line numbers.  Replace `LANGUAGE` with the language you are using.  For example, `c` or `python` (see the [supported language list](http://pygments.org/docs/lexers/) for more).
    1. Before the block - `<div class="highlight"><pre><code class="LANGUAGE">`
    2. Before each line - `<span class="line”>`
    3. After each line - `</span>`
    4. After the block - `</code></pre></div>`

If you want to do line numbers when syntax highlighting it gets messy.  You need to build a table to have the line number "gutter" in there.  You can do it but it is a bit more work.

Line numbers and syntax highlighting:

1. Start a table that holds everything.  This is the block you'll use:

    <div class="highlight"><pre><code class="html">
    <span class="line">&lt;table&gt;&lt;tbody&gt;&lt;tr&gt;&lt;td class="gutter"&gt;&lt;pre class="line-numbers"&gt;</span>
    </code></pre></div>

2. Determine how many lines are in your code snippet.  Now create a line number row for each of them.  Assuming you have five lines of code that would look like this:

    <div class="highlight"><pre><code class="html">
    <span class="line">&lt;span class="line-number"&gt;1&lt;/span&gt;</span>
    <span class="line">&lt;span class="line-number"&gt;2&lt;/span&gt;</span>
    <span class="line">&lt;span class="line-number"&gt;3&lt;/span&gt;</span>
    <span class="line">&lt;span class="line-number"&gt;4&lt;/span&gt;</span>
    <span class="line">&lt;span class="line-number"&gt;5&lt;/span&gt;</span>
    </code></pre></div>

3. Close this column of the table and start the column for the code:

    <div class="highlight"><pre><code class="html">
    <span class="line">&lt;/pre&gt;&lt;/td&gt;&lt;td class="code"&gt;&lt;pre&gt;&lt;code class="LANGUAGE"&gt;
    </code></pre></div>
    
4. Before each line of code - `<span class="line">`
5. After each line of code - `</span>`
6. After the block - `</code></pre></td></tr></tbody></table>`

That should do it.  Good luck!
