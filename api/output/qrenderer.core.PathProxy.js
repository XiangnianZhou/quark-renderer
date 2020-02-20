Ext.data.JsonP.qrenderer_core_PathProxy({"tagname":"class","name":"qrenderer.core.PathProxy","autodetected":{},"files":[{"filename":"PathProxy.js","href":"PathProxy.html#qrenderer-core-PathProxy"}],"author":[{"tagname":"author","name":"Yi Shen (http://www.github.com/pissang)","email":null}],"docauthor":[{"tagname":"docauthor","name":"大漠穷秋","email":"damoqiongqiu@126.com"}],"members":[{"name":"data","tagname":"property","owner":"qrenderer.core.PathProxy","id":"property-data","meta":{}},{"name":"constructor","tagname":"method","owner":"qrenderer.core.PathProxy","id":"method-constructor","meta":{}},{"name":"_needsDash","tagname":"method","owner":"qrenderer.core.PathProxy","id":"method-_needsDash","meta":{"private":true}},{"name":"addData","tagname":"method","owner":"qrenderer.core.PathProxy","id":"method-addData","meta":{}},{"name":"appendPath","tagname":"method","owner":"qrenderer.core.PathProxy","id":"method-appendPath","meta":{}},{"name":"arc","tagname":"method","owner":"qrenderer.core.PathProxy","id":"method-arc","meta":{"chainable":true}},{"name":"beginPath","tagname":"method","owner":"qrenderer.core.PathProxy","id":"method-beginPath","meta":{"chainable":true}},{"name":"bezierCurveTo","tagname":"method","owner":"qrenderer.core.PathProxy","id":"method-bezierCurveTo","meta":{"chainable":true}},{"name":"closePath","tagname":"method","owner":"qrenderer.core.PathProxy","id":"method-closePath","meta":{"chainable":true}},{"name":"fill","tagname":"method","owner":"qrenderer.core.PathProxy","id":"method-fill","meta":{}},{"name":"getBoundingRect","tagname":"method","owner":"qrenderer.core.PathProxy","id":"method-getBoundingRect","meta":{}},{"name":"len","tagname":"method","owner":"qrenderer.core.PathProxy","id":"method-len","meta":{}},{"name":"lineTo","tagname":"method","owner":"qrenderer.core.PathProxy","id":"method-lineTo","meta":{"chainable":true}},{"name":"moveTo","tagname":"method","owner":"qrenderer.core.PathProxy","id":"method-moveTo","meta":{"chainable":true}},{"name":"prototype","tagname":"method","owner":"qrenderer.core.PathProxy","id":"method-prototype","meta":{}},{"name":"quadraticCurveTo","tagname":"method","owner":"qrenderer.core.PathProxy","id":"method-quadraticCurveTo","meta":{"chainable":true}},{"name":"rebuildPath","tagname":"method","owner":"qrenderer.core.PathProxy","id":"method-rebuildPath","meta":{}},{"name":"setData","tagname":"method","owner":"qrenderer.core.PathProxy","id":"method-setData","meta":{}},{"name":"setLineDash","tagname":"method","owner":"qrenderer.core.PathProxy","id":"method-setLineDash","meta":{"chainable":true}},{"name":"setLineDashOffset","tagname":"method","owner":"qrenderer.core.PathProxy","id":"method-setLineDashOffset","meta":{"chainable":true}},{"name":"setScale","tagname":"method","owner":"qrenderer.core.PathProxy","id":"method-setScale","meta":{}},{"name":"stroke","tagname":"method","owner":"qrenderer.core.PathProxy","id":"method-stroke","meta":{}},{"name":"toStatic","tagname":"method","owner":"qrenderer.core.PathProxy","id":"method-toStatic","meta":{}}],"alternateClassNames":[],"aliases":{},"id":"class-qrenderer.core.PathProxy","component":false,"superclasses":[],"subclasses":[],"mixedInto":[],"mixins":[],"parentMixins":[],"requires":[],"uses":[],"html":"<div><pre class=\"hierarchy\"><h4>Files</h4><div class='dependency'><a href='source/PathProxy.html#qrenderer-core-PathProxy' target='_blank'>PathProxy.js</a></div></pre><div class='doc-contents'><p>Path 代理，可以在<code>buildPath</code>中用于替代<code>ctx</code>, 会保存每个path操作的命令到pathCommands属性中\n可以用于 isInsidePath 判断以及获取boundingRect</p>\n</div><div class='members'><div class='members-section'><div class='definedBy'>Defined By</div><h3 class='members-title icon-property'>Properties</h3><div class='subsection'><div id='property-data' class='member first-child not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='qrenderer.core.PathProxy'>qrenderer.core.PathProxy</span><br/><a href='source/PathProxy.html#qrenderer-core-PathProxy-property-data' target='_blank' class='view-source'>view source</a></div><a href='#!/api/qrenderer.core.PathProxy-property-data' class='name expandable'>data</a> : Array&lt;Object&gt;<span class=\"signature\"></span></div><div class='description'><div class='short'>Path data. ...</div><div class='long'><p>Path data. Stored as flat array</p>\n<p>Defaults to: <code>[]</code></p></div></div></div></div></div><div class='members-section'><div class='definedBy'>Defined By</div><h3 class='members-title icon-method'>Methods</h3><div class='subsection'><div id='method-constructor' class='member first-child not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='qrenderer.core.PathProxy'>qrenderer.core.PathProxy</span><br/><a href='source/PathProxy.html#qrenderer-core-PathProxy-method-constructor' target='_blank' class='view-source'>view source</a></div><strong class='new-keyword'>new</strong><a href='#!/api/qrenderer.core.PathProxy-method-constructor' class='name expandable'>qrenderer.core.PathProxy</a>( <span class='pre'></span> ) : <a href=\"#!/api/qrenderer.core.PathProxy\" rel=\"qrenderer.core.PathProxy\" class=\"docClass\">qrenderer.core.PathProxy</a><span class=\"signature\"></span></div><div class='description'><div class='short'>PathProxy ...</div><div class='long'><p>PathProxy</p>\n<h3 class='pa'>Returns</h3><ul><li><span class='pre'><a href=\"#!/api/qrenderer.core.PathProxy\" rel=\"qrenderer.core.PathProxy\" class=\"docClass\">qrenderer.core.PathProxy</a></span><div class='sub-desc'>\n</div></li></ul></div></div></div><div id='method-_needsDash' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='qrenderer.core.PathProxy'>qrenderer.core.PathProxy</span><br/><a href='source/PathProxy.html#qrenderer-core-PathProxy-method-_needsDash' target='_blank' class='view-source'>view source</a></div><a href='#!/api/qrenderer.core.PathProxy-method-_needsDash' class='name expandable'>_needsDash</a>( <span class='pre'></span> ) : boolean<span class=\"signature\"><span class='private' >private</span></span></div><div class='description'><div class='short'>If needs js implemented dashed line ...</div><div class='long'><p>If needs js implemented dashed line</p>\n<h3 class='pa'>Returns</h3><ul><li><span class='pre'>boolean</span><div class='sub-desc'>\n</div></li></ul></div></div></div><div id='method-addData' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='qrenderer.core.PathProxy'>qrenderer.core.PathProxy</span><br/><a href='source/PathProxy.html#qrenderer-core-PathProxy-method-addData' target='_blank' class='view-source'>view source</a></div><a href='#!/api/qrenderer.core.PathProxy-method-addData' class='name expandable'>addData</a>( <span class='pre'>cmd</span> )<span class=\"signature\"></span></div><div class='description'><div class='short'>填充 Path 数据。 ...</div><div class='long'><p>填充 Path 数据。\n尽量复用而不申明新的数组。大部分图形重绘的指令数据长度都是不变的。</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>cmd</span> : Object<div class='sub-desc'></div></li></ul></div></div></div><div id='method-appendPath' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='qrenderer.core.PathProxy'>qrenderer.core.PathProxy</span><br/><a href='source/PathProxy.html#qrenderer-core-PathProxy-method-appendPath' target='_blank' class='view-source'>view source</a></div><a href='#!/api/qrenderer.core.PathProxy-method-appendPath' class='name expandable'>appendPath</a>( <span class='pre'>path</span> )<span class=\"signature\"></span></div><div class='description'><div class='short'>添加子路径 ...</div><div class='long'><p>添加子路径</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>path</span> : PathProxy|Array.&lt;PathProxy&gt;<div class='sub-desc'>\n</div></li></ul></div></div></div><div id='method-arc' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='qrenderer.core.PathProxy'>qrenderer.core.PathProxy</span><br/><a href='source/PathProxy.html#qrenderer-core-PathProxy-method-arc' target='_blank' class='view-source'>view source</a></div><a href='#!/api/qrenderer.core.PathProxy-method-arc' class='name expandable'>arc</a>( <span class='pre'>cx, cy, r, startAngle, endAngle, anticlockwise</span> ) : PathProxy<span class=\"signature\"><span class='chainable' >chainable</span></span></div><div class='description'><div class='short'> ...</div><div class='long'>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>cx</span> : Number<div class='sub-desc'>\n</div></li><li><span class='pre'>cy</span> : Number<div class='sub-desc'>\n</div></li><li><span class='pre'>r</span> : Number<div class='sub-desc'>\n</div></li><li><span class='pre'>startAngle</span> : Number<div class='sub-desc'>\n</div></li><li><span class='pre'>endAngle</span> : Number<div class='sub-desc'>\n</div></li><li><span class='pre'>anticlockwise</span> : boolean<div class='sub-desc'>\n</div></li></ul><h3 class='pa'>Returns</h3><ul><li><span class='pre'>PathProxy</span><div class='sub-desc'>\n</div></li></ul></div></div></div><div id='method-beginPath' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='qrenderer.core.PathProxy'>qrenderer.core.PathProxy</span><br/><a href='source/PathProxy.html#qrenderer-core-PathProxy-method-beginPath' target='_blank' class='view-source'>view source</a></div><a href='#!/api/qrenderer.core.PathProxy-method-beginPath' class='name expandable'>beginPath</a>( <span class='pre'>ctx</span> ) : PathProxy<span class=\"signature\"><span class='chainable' >chainable</span></span></div><div class='description'><div class='short'> ...</div><div class='long'>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>ctx</span> : CanvasRenderingContext2D<div class='sub-desc'>\n</div></li></ul><h3 class='pa'>Returns</h3><ul><li><span class='pre'>PathProxy</span><div class='sub-desc'>\n</div></li></ul></div></div></div><div id='method-bezierCurveTo' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='qrenderer.core.PathProxy'>qrenderer.core.PathProxy</span><br/><a href='source/PathProxy.html#qrenderer-core-PathProxy-method-bezierCurveTo' target='_blank' class='view-source'>view source</a></div><a href='#!/api/qrenderer.core.PathProxy-method-bezierCurveTo' class='name expandable'>bezierCurveTo</a>( <span class='pre'>x1, y1, x2, y2, x3, y3</span> ) : PathProxy<span class=\"signature\"><span class='chainable' >chainable</span></span></div><div class='description'><div class='short'> ...</div><div class='long'>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>x1</span> : Number<div class='sub-desc'>\n</div></li><li><span class='pre'>y1</span> : Number<div class='sub-desc'>\n</div></li><li><span class='pre'>x2</span> : Number<div class='sub-desc'>\n</div></li><li><span class='pre'>y2</span> : Number<div class='sub-desc'>\n</div></li><li><span class='pre'>x3</span> : Number<div class='sub-desc'>\n</div></li><li><span class='pre'>y3</span> : Number<div class='sub-desc'>\n</div></li></ul><h3 class='pa'>Returns</h3><ul><li><span class='pre'>PathProxy</span><div class='sub-desc'>\n</div></li></ul></div></div></div><div id='method-closePath' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='qrenderer.core.PathProxy'>qrenderer.core.PathProxy</span><br/><a href='source/PathProxy.html#qrenderer-core-PathProxy-method-closePath' target='_blank' class='view-source'>view source</a></div><a href='#!/api/qrenderer.core.PathProxy-method-closePath' class='name expandable'>closePath</a>( <span class='pre'></span> ) : PathProxy<span class=\"signature\"><span class='chainable' >chainable</span></span></div><div class='description'><div class='short'> ...</div><div class='long'>\n<h3 class='pa'>Returns</h3><ul><li><span class='pre'>PathProxy</span><div class='sub-desc'>\n</div></li></ul></div></div></div><div id='method-fill' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='qrenderer.core.PathProxy'>qrenderer.core.PathProxy</span><br/><a href='source/PathProxy.html#qrenderer-core-PathProxy-method-fill' target='_blank' class='view-source'>view source</a></div><a href='#!/api/qrenderer.core.PathProxy-method-fill' class='name expandable'>fill</a>( <span class='pre'>ctx</span> ) : PathProxy<span class=\"signature\"></span></div><div class='description'><div class='short'>Context 从外部传入，因为有可能是 rebuildPath 完之后再 fill。 ...</div><div class='long'><p>Context 从外部传入，因为有可能是 rebuildPath 完之后再 fill。\nstroke 同样</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>ctx</span> : CanvasRenderingContext2D<div class='sub-desc'>\n</div></li></ul><h3 class='pa'>Returns</h3><ul><li><span class='pre'>PathProxy</span><div class='sub-desc'>\n</div></li></ul></div></div></div><div id='method-getBoundingRect' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='qrenderer.core.PathProxy'>qrenderer.core.PathProxy</span><br/><a href='source/PathProxy.html#qrenderer-core-PathProxy-method-getBoundingRect' target='_blank' class='view-source'>view source</a></div><a href='#!/api/qrenderer.core.PathProxy-method-getBoundingRect' class='name expandable'>getBoundingRect</a>( <span class='pre'></span> ) : BoundingRect<span class=\"signature\"></span></div><div class='description'><div class='short'> ...</div><div class='long'>\n<h3 class='pa'>Returns</h3><ul><li><span class='pre'>BoundingRect</span><div class='sub-desc'>\n</div></li></ul></div></div></div><div id='method-len' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='qrenderer.core.PathProxy'>qrenderer.core.PathProxy</span><br/><a href='source/PathProxy.html#qrenderer-core-PathProxy-method-len' target='_blank' class='view-source'>view source</a></div><a href='#!/api/qrenderer.core.PathProxy-method-len' class='name expandable'>len</a>( <span class='pre'></span> ) : boolean<span class=\"signature\"></span></div><div class='description'><div class='short'> ...</div><div class='long'>\n<h3 class='pa'>Returns</h3><ul><li><span class='pre'>boolean</span><div class='sub-desc'>\n</div></li></ul></div></div></div><div id='method-lineTo' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='qrenderer.core.PathProxy'>qrenderer.core.PathProxy</span><br/><a href='source/PathProxy.html#qrenderer-core-PathProxy-method-lineTo' target='_blank' class='view-source'>view source</a></div><a href='#!/api/qrenderer.core.PathProxy-method-lineTo' class='name expandable'>lineTo</a>( <span class='pre'>x, y</span> ) : PathProxy<span class=\"signature\"><span class='chainable' >chainable</span></span></div><div class='description'><div class='short'> ...</div><div class='long'>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>x</span> : Number<div class='sub-desc'>\n</div></li><li><span class='pre'>y</span> : Number<div class='sub-desc'>\n</div></li></ul><h3 class='pa'>Returns</h3><ul><li><span class='pre'>PathProxy</span><div class='sub-desc'>\n</div></li></ul></div></div></div><div id='method-moveTo' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='qrenderer.core.PathProxy'>qrenderer.core.PathProxy</span><br/><a href='source/PathProxy.html#qrenderer-core-PathProxy-method-moveTo' target='_blank' class='view-source'>view source</a></div><a href='#!/api/qrenderer.core.PathProxy-method-moveTo' class='name expandable'>moveTo</a>( <span class='pre'>x, y</span> ) : PathProxy<span class=\"signature\"><span class='chainable' >chainable</span></span></div><div class='description'><div class='short'> ...</div><div class='long'>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>x</span> : Number<div class='sub-desc'>\n</div></li><li><span class='pre'>y</span> : Number<div class='sub-desc'>\n</div></li></ul><h3 class='pa'>Returns</h3><ul><li><span class='pre'>PathProxy</span><div class='sub-desc'>\n</div></li></ul></div></div></div><div id='method-prototype' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='qrenderer.core.PathProxy'>qrenderer.core.PathProxy</span><br/><a href='source/PathProxy.html#qrenderer-core-PathProxy-method-prototype' target='_blank' class='view-source'>view source</a></div><a href='#!/api/qrenderer.core.PathProxy-method-prototype' class='name expandable'>prototype</a>( <span class='pre'></span> ) : Object<span class=\"signature\"></span></div><div class='description'><div class='short'>快速计算Path包围盒（并不是最小包围盒） ...</div><div class='long'><p>快速计算Path包围盒（并不是最小包围盒）</p>\n<h3 class='pa'>Returns</h3><ul><li><span class='pre'>Object</span><div class='sub-desc'>\n</div></li></ul></div></div></div><div id='method-quadraticCurveTo' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='qrenderer.core.PathProxy'>qrenderer.core.PathProxy</span><br/><a href='source/PathProxy.html#qrenderer-core-PathProxy-method-quadraticCurveTo' target='_blank' class='view-source'>view source</a></div><a href='#!/api/qrenderer.core.PathProxy-method-quadraticCurveTo' class='name expandable'>quadraticCurveTo</a>( <span class='pre'>x1, y1, x2, y2</span> ) : PathProxy<span class=\"signature\"><span class='chainable' >chainable</span></span></div><div class='description'><div class='short'> ...</div><div class='long'>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>x1</span> : Number<div class='sub-desc'>\n</div></li><li><span class='pre'>y1</span> : Number<div class='sub-desc'>\n</div></li><li><span class='pre'>x2</span> : Number<div class='sub-desc'>\n</div></li><li><span class='pre'>y2</span> : Number<div class='sub-desc'>\n</div></li></ul><h3 class='pa'>Returns</h3><ul><li><span class='pre'>PathProxy</span><div class='sub-desc'>\n</div></li></ul></div></div></div><div id='method-rebuildPath' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='qrenderer.core.PathProxy'>qrenderer.core.PathProxy</span><br/><a href='source/PathProxy.html#qrenderer-core-PathProxy-method-rebuildPath' target='_blank' class='view-source'>view source</a></div><a href='#!/api/qrenderer.core.PathProxy-method-rebuildPath' class='name expandable'>rebuildPath</a>( <span class='pre'>ctx</span> )<span class=\"signature\"></span></div><div class='description'><div class='short'>Rebuild path from current data\nRebuild path will not consider javascript implemented line dash. ...</div><div class='long'><p>Rebuild path from current data\nRebuild path will not consider javascript implemented line dash.</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>ctx</span> : CanvasRenderingContext2D<div class='sub-desc'>\n</div></li></ul></div></div></div><div id='method-setData' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='qrenderer.core.PathProxy'>qrenderer.core.PathProxy</span><br/><a href='source/PathProxy.html#qrenderer-core-PathProxy-method-setData' target='_blank' class='view-source'>view source</a></div><a href='#!/api/qrenderer.core.PathProxy-method-setData' class='name expandable'>setData</a>( <span class='pre'>data</span> )<span class=\"signature\"></span></div><div class='description'><div class='short'>直接设置 Path 数据 ...</div><div class='long'><p>直接设置 Path 数据</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>data</span> : Object<div class='sub-desc'></div></li></ul></div></div></div><div id='method-setLineDash' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='qrenderer.core.PathProxy'>qrenderer.core.PathProxy</span><br/><a href='source/PathProxy.html#qrenderer-core-PathProxy-method-setLineDash' target='_blank' class='view-source'>view source</a></div><a href='#!/api/qrenderer.core.PathProxy-method-setLineDash' class='name expandable'>setLineDash</a>( <span class='pre'>lineDash</span> ) : PathProxy<span class=\"signature\"><span class='chainable' >chainable</span></span></div><div class='description'><div class='short'>必须在其它绘制命令前调用\nMust be invoked before all other path drawing methods ...</div><div class='long'><p>必须在其它绘制命令前调用\nMust be invoked before all other path drawing methods</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>lineDash</span> : Object<div class='sub-desc'></div></li></ul><h3 class='pa'>Returns</h3><ul><li><span class='pre'>PathProxy</span><div class='sub-desc'>\n</div></li></ul></div></div></div><div id='method-setLineDashOffset' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='qrenderer.core.PathProxy'>qrenderer.core.PathProxy</span><br/><a href='source/PathProxy.html#qrenderer-core-PathProxy-method-setLineDashOffset' target='_blank' class='view-source'>view source</a></div><a href='#!/api/qrenderer.core.PathProxy-method-setLineDashOffset' class='name expandable'>setLineDashOffset</a>( <span class='pre'>offset</span> ) : PathProxy<span class=\"signature\"><span class='chainable' >chainable</span></span></div><div class='description'><div class='short'>必须在其它绘制命令前调用\nMust be invoked before all other path drawing methods ...</div><div class='long'><p>必须在其它绘制命令前调用\nMust be invoked before all other path drawing methods</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>offset</span> : Object<div class='sub-desc'></div></li></ul><h3 class='pa'>Returns</h3><ul><li><span class='pre'>PathProxy</span><div class='sub-desc'>\n</div></li></ul></div></div></div><div id='method-setScale' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='qrenderer.core.PathProxy'>qrenderer.core.PathProxy</span><br/><a href='source/PathProxy.html#qrenderer-core-PathProxy-method-setScale' target='_blank' class='view-source'>view source</a></div><a href='#!/api/qrenderer.core.PathProxy-method-setScale' class='name expandable'>setScale</a>( <span class='pre'>sx, sy, segmentIgnoreThreshold</span> )<span class=\"signature\"></span></div><div class='description'><div class='short'>@readOnly ...</div><div class='long'><p>@readOnly</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>sx</span> : Object<div class='sub-desc'></div></li><li><span class='pre'>sy</span> : Object<div class='sub-desc'></div></li><li><span class='pre'>segmentIgnoreThreshold</span> : Object<div class='sub-desc'></div></li></ul></div></div></div><div id='method-stroke' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='qrenderer.core.PathProxy'>qrenderer.core.PathProxy</span><br/><a href='source/PathProxy.html#qrenderer-core-PathProxy-method-stroke' target='_blank' class='view-source'>view source</a></div><a href='#!/api/qrenderer.core.PathProxy-method-stroke' class='name expandable'>stroke</a>( <span class='pre'>ctx</span> ) : PathProxy<span class=\"signature\"></span></div><div class='description'><div class='short'> ...</div><div class='long'>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>ctx</span> : CanvasRenderingContext2D<div class='sub-desc'>\n</div></li></ul><h3 class='pa'>Returns</h3><ul><li><span class='pre'>PathProxy</span><div class='sub-desc'>\n</div></li></ul></div></div></div><div id='method-toStatic' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='qrenderer.core.PathProxy'>qrenderer.core.PathProxy</span><br/><a href='source/PathProxy.html#qrenderer-core-PathProxy-method-toStatic' target='_blank' class='view-source'>view source</a></div><a href='#!/api/qrenderer.core.PathProxy-method-toStatic' class='name expandable'>toStatic</a>( <span class='pre'></span> )<span class=\"signature\"></span></div><div class='description'><div class='short'>转成静态的 Float32Array 减少堆内存占用\nConvert dynamic array to static Float32Array ...</div><div class='long'><p>转成静态的 Float32Array 减少堆内存占用\nConvert dynamic array to static Float32Array</p>\n</div></div></div></div></div></div></div>","meta":{}});