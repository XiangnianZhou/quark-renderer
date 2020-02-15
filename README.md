<h1 align="center">Quark Renderer</h1>

A lightweight yet powerful canvas renderer engine improved from [ZRender](https://github.com/ecomfe/zrender)

## Background

**Important: Quark Renderer is not built from scratch, but improved from ZRender, which is used as the renderer engine behind the famous chart framework ECharts.**

I have used ECharts and ZRender for many years, both of them are extremly powerful tools for making some charting stuff.

To better understand the core ideas behind ZRender, I spent some days to read through its source code recently. In this process, I refactored a bunch of code and comments, because:

- I want a very customized version to implement some cool stuff in the future.
- I want a cleaner repo to teach my students how to understand and design a canvas engine for modern web and Wechat mini-programs.
- I want to make the code easier to read.
- ZRender exported a global variable 'zrender', so I have to rename my repo to a different name to avoid potential naming conflicts. 

Here are the key improvements compare to the original ZRender:

- Modified a bunch of classes and js files with ES6 syntax.
- Added keyboard event support.
- Added multi drag-drop feature.
- Refactored the structure of js files and directories for better understanding.
- Refactored some implementation details for better understanding.
- Fixed some bugs in /test directory.
- Use [jsduck](https://github.com/senchalabs/jsduck) for better API document.
- Refactored all the comments for jsduck.

## Usage

Pull this repo to your local device, check the examples inside /test directory.

## Document

The document is in /api directory, open /api/index.html in your browser then you can see a beautiful API document just like Sencha(ExtJS).

## License

BSD 3-Clause License

[LICENSE](./LICENSE)