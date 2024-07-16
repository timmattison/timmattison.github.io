---
title: "Getting Trunk Recorder installed on MacOS with missing six dependency"
date: 2024-07-16 06:51:00
---

# {{ $frontmatter.title }}

## The issue

If you try
to [install Trunk Recorder on MacOS](https://github.com/robotastic/trunk-recorder/blob/master/docs/Install/INSTALL-MAC.md#using-homebrew)
you'll very likely see something like this:

```
[ 65%] Copying osmosdr docstring templates as pybind headers ...
Traceback (most recent call last):
  File "/Users/user/code/gr-osmosdr/docs/doxygen/update_pydoc.py", line 22, in <module>
    from doxyxml import DoxyIndex, DoxyClass, DoxyFriend, DoxyFunction, DoxyFile
  File "/Users/user/code/open-source/gr-osmosdr/docs/doxygen/doxyxml/__init__.py", line 69, in <module>
    from .doxyindex import DoxyIndex, DoxyFunction, DoxyParam, DoxyClass, DoxyFile, DoxyNamespace, DoxyGroup, DoxyFriend, DoxyOther
  File "/Users/user/code/open-source/gr-osmosdr/docs/doxygen/doxyxml/doxyindex.py", line 31, in <module>
    from .generated import index
  File "/Users/user/code/open-source/gr-osmosdr/docs/doxygen/doxyxml/generated/index.py", line 13, in <module>
    from . import compound
  File "/Users/user/code/open-source/gr-osmosdr/docs/doxygen/doxyxml/generated/compound.py", line 15, in <module>
    from . import compoundsuper as supermod
  File "/Users/user/code/open-source/gr-osmosdr/docs/doxygen/doxyxml/generated/compoundsuper.py", line 15, in <module>
    import six
ModuleNotFoundError: No module named 'six'
make[2]: *** [python/bindings/docstring_status] Error 1
make[1]: *** [python/bindings/CMakeFiles/osmosdr_docstrings.dir/all] Error 2
```

I know, it's shocking. Something that uses Python is missing a dependency. I knew this day would come.

## Warning!

I know this seems minor but it's a big deal. It looks like only the documentation isn't built but actually other things
are skipped because this part of the process fails. You'll see this when you recompile after you fix it.

## The root cause

The root cause here is that when you follow the instructions to install Trunk Recorder it asks you to install GNU Radio
via homebrew. Then it uses the Python that's inside the GNU Radio installation to try to generate the documentation.

You can verify this from running this command from your `build` directory:

```bash
grep -r venv * | grep PYTHON_EXECUTABLE
```

You'll see something like this:

```
CMakeCache.txt:PYTHON_EXECUTABLE:FILEPATH=/opt/homebrew/Cellar/gnuradio/3.10.9.2_8/libexec/venv/bin/python
```

## The fix

So, you need to install the `six` package. You can do this with `pip`. But you can't just run `pip install six` because
it will install it in your system Python and not the Python that's inside the GNU Radio installation.

Instead, take the path from the CMakeCache.txt line and do this:

```bash
/magic/amazing/python -m pip install six
```

Obviously replace `/magic/amazing/python` with the path from your `CMakeCache.txt` file. After that run `make` again and
finally run the installation steps from the Trunk Recorder documentation, and you should be in business.
