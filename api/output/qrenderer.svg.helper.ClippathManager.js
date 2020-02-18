Ext.data.JsonP.qrenderer_svg_helper_ClippathManager({"tagname":"class","name":"qrenderer.svg.helper.ClippathManager","autodetected":{},"files":[{"filename":"ClippathManager.js","href":"ClippathManager.html#qrenderer-svg-helper-ClippathManager"}],"author":[{"tagname":"author","name":"Zhang Wenli","email":null}],"docauthor":[{"tagname":"docauthor","name":"大漠穷秋 damoqiongqiu@126.com","email":null}],"members":[{"name":"","tagname":"property","owner":"qrenderer.svg.helper.ClippathManager","id":"property-","meta":{}},{"name":"constructor","tagname":"method","owner":"qrenderer.svg.helper.ClippathManager","id":"method-constructor","meta":{}},{"name":"markUsed","tagname":"method","owner":"qrenderer.svg.helper.ClippathManager","id":"method-markUsed","meta":{}},{"name":"update","tagname":"method","owner":"qrenderer.svg.helper.ClippathManager","id":"method-update","meta":{}},{"name":"updateDom","tagname":"method","owner":"qrenderer.svg.helper.ClippathManager","id":"method-updateDom","meta":{}}],"alternateClassNames":[],"aliases":{},"id":"class-qrenderer.svg.helper.ClippathManager","component":false,"superclasses":[],"subclasses":[],"mixedInto":[],"mixins":[],"parentMixins":[],"requires":[],"uses":[],"html":"<div><pre class=\"hierarchy\"><h4>Files</h4><div class='dependency'><a href='source/ClippathManager.html#qrenderer-svg-helper-ClippathManager' target='_blank'>ClippathManager.js</a></div></pre><div class='doc-contents'><p>Manages SVG clipPath elements.</p>\n</div><div class='members'><div class='members-section'><div class='definedBy'>Defined By</div><h3 class='members-title icon-property'>Properties</h3><div class='subsection'><div id='property-' class='member first-child not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='qrenderer.svg.helper.ClippathManager'>qrenderer.svg.helper.ClippathManager</span><br/><a href='source/ClippathManager.html#qrenderer-svg-helper-ClippathManager-property-' target='_blank' class='view-source'>view source</a></div><a href='#!/api/qrenderer.svg.helper.ClippathManager-property-' class='name expandable'></a> : Object<span class=\"signature\"></span></div><div class='description'><div class='short'>Use cloneNode() here to appendChild to multiple parents,\nwhich may happend when Text and other shapes are using the s...</div><div class='long'><p>Use <code>cloneNode()</code> here to appendChild to multiple parents,\nwhich may happend when Text and other shapes are using the same\nclipPath. Since Text will create an extra clipPath DOM due to\ndifferent transform rules.</p>\n</div></div></div></div></div><div class='members-section'><div class='definedBy'>Defined By</div><h3 class='members-title icon-method'>Methods</h3><div class='subsection'><div id='method-constructor' class='member first-child not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='qrenderer.svg.helper.ClippathManager'>qrenderer.svg.helper.ClippathManager</span><br/><a href='source/ClippathManager.html#qrenderer-svg-helper-ClippathManager-method-constructor' target='_blank' class='view-source'>view source</a></div><strong class='new-keyword'>new</strong><a href='#!/api/qrenderer.svg.helper.ClippathManager-method-constructor' class='name expandable'>qrenderer.svg.helper.ClippathManager</a>( <span class='pre'>qrId, svgRoot</span> ) : <a href=\"#!/api/qrenderer.svg.helper.ClippathManager\" rel=\"qrenderer.svg.helper.ClippathManager\" class=\"docClass\">qrenderer.svg.helper.ClippathManager</a><span class=\"signature\"></span></div><div class='description'><div class='short'>ClippathManager ...</div><div class='long'><p>ClippathManager</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>qrId</span> : Number<div class='sub-desc'><p>qrenderer instance id</p>\n</div></li><li><span class='pre'>svgRoot</span> : SVGElement<div class='sub-desc'><p>root of SVG document</p>\n</div></li></ul><h3 class='pa'>Returns</h3><ul><li><span class='pre'><a href=\"#!/api/qrenderer.svg.helper.ClippathManager\" rel=\"qrenderer.svg.helper.ClippathManager\" class=\"docClass\">qrenderer.svg.helper.ClippathManager</a></span><div class='sub-desc'>\n</div></li></ul></div></div></div><div id='method-markUsed' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='qrenderer.svg.helper.ClippathManager'>qrenderer.svg.helper.ClippathManager</span><br/><a href='source/ClippathManager.html#qrenderer-svg-helper-ClippathManager-method-markUsed' target='_blank' class='view-source'>view source</a></div><a href='#!/api/qrenderer.svg.helper.ClippathManager-method-markUsed' class='name expandable'>markUsed</a>( <span class='pre'>displayable</span> )<span class=\"signature\"></span></div><div class='description'><div class='short'>Mark a single clipPath to be used ...</div><div class='long'><p>Mark a single clipPath to be used</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>displayable</span> : Displayable<div class='sub-desc'><p>displayable element</p>\n</div></li></ul></div></div></div><div id='method-update' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='qrenderer.svg.helper.ClippathManager'>qrenderer.svg.helper.ClippathManager</span><br/><a href='source/ClippathManager.html#qrenderer-svg-helper-ClippathManager-method-update' target='_blank' class='view-source'>view source</a></div><a href='#!/api/qrenderer.svg.helper.ClippathManager-method-update' class='name expandable'>update</a>( <span class='pre'>displayable</span> )<span class=\"signature\"></span></div><div class='description'><div class='short'>Update clipPath. ...</div><div class='long'><p>Update clipPath.</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>displayable</span> : Displayable<div class='sub-desc'><p>displayable element</p>\n</div></li></ul></div></div></div><div id='method-updateDom' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='qrenderer.svg.helper.ClippathManager'>qrenderer.svg.helper.ClippathManager</span><br/><a href='source/ClippathManager.html#qrenderer-svg-helper-ClippathManager-method-updateDom' target='_blank' class='view-source'>view source</a></div><a href='#!/api/qrenderer.svg.helper.ClippathManager-method-updateDom' class='name expandable'>updateDom</a>( <span class='pre'>parentEl, clipPaths, isText</span> )<span class=\"signature\"></span></div><div class='description'><div class='short'>Create an SVGElement of displayable and create a  of its\nclipPath ...</div><div class='long'><p>Create an SVGElement of displayable and create a <clipPath> of its\nclipPath</clipPath></p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>parentEl</span> : Displayable<div class='sub-desc'><p>parent element</p>\n</div></li><li><span class='pre'>clipPaths</span> : ClipPath[]<div class='sub-desc'><p>clipPaths of parent element</p>\n</div></li><li><span class='pre'>isText</span> : boolean<div class='sub-desc'><p>if parent element is Text</p>\n</div></li></ul></div></div></div></div></div></div></div>","meta":{}});