/*
Copyright 2013, KISSY v1.40dev
MIT Licensed
build time: Aug 27 21:56
*/
KISSY.add("editor/plugin/multiple-upload",function(c,d,e){function a(b){this.config=b||{}}c.augment(a,{pluginRenderUI:function(b){var a=this;b.addButton("multipleUpload",{tooltip:"\u6279\u91cf\u63d2\u56fe",listeners:{click:function(){e.useDialog(b,"multiple-upload",a.config)}},mode:d.Mode.WYSIWYG_MODE})}});return a},{requires:["editor","./dialog-loader"]});
