---
layout: post
title: "Making Javascript logging a little less expensive"
date: 2014-08-29 07:54:45 -0400
comments: true
categories: 
---
Disclaimer: I am not a Javascript expert.  I don't even play one on TV.

Everybody knows that [logging isn't free](http://blog.codinghorror.com/the-problem-with-logging/), don't they?  Well I don't think that they do and for a lot of beginner to intermediate level developers I can't really fault them for it.  While you're debugging it appears that log messages show up instantly so it is easy to forget that there is in fact a cost associated with producing them.

What is less obvious is that even when you "disable" your logging it still incurs a cost and that cost may be significantly larger than you think.  The two main issues I've seen that often cause this large expense are:

1. Methods that generate log messages
2. Inline generation of strings

The first, methods that generate log messages, occurs when you need to do a bit of processing in order to make a meaningful log message.  For example, you might need to know how far you are through a loop so you write a function called `generateFormattedProgress` that takes the number of loops you're going to go through and the current loop counter as parameters.  `generateFormattedProgress` generates a tidy little string that might loop like this `[8% complete (currently on iteration 80,001 of 1,000,000)]`.

The second, inline generation of strings, happens when you need to do something a bit simpler like displaying a loop counter.  You might build a string like this `"Loop: " + loop_counter` and then log it.

In both of these cases you get bitten by the less obvious issue I mentioned above when you disable logging.  To be completely concrete about this imagine your logger is called like this:

Case #1:

``` javascript
console.log(generateFormattedProgress(loop_counter, total_loops));
```

Case #2:

``` javascript
console.log("Loop:" + loop_counter);
```

Even if you replace `console.log` with a function that just immediately returns you will, in most cases, still be forcing the machine to call `generateFormattedProgress` and perform the string concatenation only to throw the results away.  This is where the overhead comes in.

Borrowing from some other languages I came up with an idea to reduce this burden.  Unfortunately it is a bit ugly but it does give you a decent performance boost.  The idea is that instead of always calling the logging code at runtime you wrap your logging statements in anonymous functions and pass those to the logger.  The logger can then decide if it needs to run them and if it doesn't then it never calls the code inside of the anonymous function.

Your log statements go from looking like the statements above to statements like this:

Case #1:

``` javascript
console.log(function(){ return generateFormattedProgress(loop_counter, total_loops);});
```

Case #2:

``` javascript
console.log(function(){ return "Loop:" + loop_counter; });
```

Some test code is below to illustrate the difference in performance.  On my machine running 100,000 iterations I get the following results in Chrome 37.0.2062.94:

``` console
Console.log enabled
Running: test_normal_console
Total milliseconds: 1921
Milliseconds per log: 0.01921
Running: test_anonymous_function_console
Total milliseconds: 1917
Milliseconds per log: 0.01917
Disabling console.log
Running: test_normal_console
Total milliseconds: 16
Milliseconds per log: 0.00016
Running: test_anonymous_function_console
Total milliseconds: 5
Milliseconds per log: 0.00005
```

So here we see that we cut the runtime by at least two orders of magnitude going from a little over 1.9 seconds for each case to less than 20 milliseconds for each case.  Does logging affect your Javascript application enough to use this pattern?  Is this an anti-pattern?  Are you already doing this or something similar?  Post a message in the comments and lets discuss it!

Sample test code:

``` javascript
var test_count = 100000;

function get_timestamp() {
    return new Date().getTime();
}

function write_newline() {
    document.write("<br/>\n");
}

function display_function_name(caller) {
    var myName = caller.callee.toString();
    myName = myName.substr('function '.length);
    myName = myName.substr(0, myName.indexOf('('));

    document.write("Running: " + myName);
    write_newline();
}

function show_results(start, stop, count) {
    var totalMilliseconds = stop - start;
    var millisecondsPerLog = totalMilliseconds / test_count;

    document.write("Total milliseconds: " + totalMilliseconds);
    write_newline();
    document.write("Milliseconds per log: " + millisecondsPerLog);
    write_newline();
}

function test_normal_console() {
    display_function_name(arguments);

    var start = get_timestamp();

    for (var loop = 0; loop < test_count; loop++) {
        console.log("test! " + loop + "test!");
    }

    var stop = get_timestamp();

    show_results(start, stop, test_count);
}

function test_anonymous_function_console() {
    display_function_name(arguments);

    var start = get_timestamp();

    for (var loop = 0; loop < test_count; loop++) {
        console.log(function () {
            return "test! " + loop + "test!";
        });
    }

    var stop = get_timestamp();

    show_results(start, stop, test_count);
}

// Store the original console.log function
var original_console_log = console.log;

// Call this to enable logging
function enable_console_logging() {
    console.log = function (input) {
        // Why the bind(console)(input)?
        //
        // console.log expects "this" to refer to the console object or it crashes with an invocation exception
        //   See: https://stackoverflow.com/questions/8904782/uncaught-typeerror-illegal-invocation-in-javascript

        // Is this a function?
        if (typeof input == "function") {
            // Yes, call the function to get the data to log to the console
            original_console_log.bind(console)(input());
        }
        else {
            // No, just log it
            original_console_log.bind(console)(input);
        }
    }
}

// Call this to disable logging
function disable_console_logging() {
    console.log = function () {
    };
}

document.write("Console.log enabled");
write_newline();

enable_console_logging();

test_normal_console();
test_anonymous_function_console();

document.write("Disabling console.log");
write_newline();

disable_console_logging();

test_normal_console();
test_anonymous_function_console();
```