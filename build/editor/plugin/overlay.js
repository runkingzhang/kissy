/*
Copyright 2013, KISSY v1.40dev
MIT Licensed
build time: Aug 27 21:57
*/
/*
 Combined processedModules by KISSY Module Compiler: 

 editor/plugin/overlay
*/

/**
 * custom overlay  for kissy editor
 * @author yiminghe@gmail.com
 */
KISSY.add("editor/plugin/overlay", function (S, Editor, Overlay, focusFix) {
    return Overlay.extend({
        bindUI: function () {
            focusFix.init(this);
        }
    }, {
        ATTRS: {
            prefixCls: {
                value: "ks-editor-"
            },
            "zIndex": {
                value: Editor.baseZIndex(Editor.zIndexManager.OVERLAY)
            }
        }
    });
}, {
    requires: ["editor", 'overlay', './focus-fix']
});

