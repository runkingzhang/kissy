KISSY.Editor.add("contextmenu",function(){function h(a){this.cfg=a;k.Utils.lazyRun(this,"_prepareShow","_realShow")}function q(a,c){for(var e=0;e<c.length;e++){var b=c[e];if(i.isFunction(b)){if(b(new l(a)))return true}else if(r.test(a,b))return true}return false}var i=KISSY,k=i.Editor,l=i.Node,r=i.DOM,o=i.Event;if(k.ContextMenu)i.log("attach ContextMenu twice","warn");else{h.ATTRS={editor:{}};var j=[];h.register=function(a){var c=new h(a),e=a.editor,b=e.document;j.push({doc:b,rules:a.rules||[],instance:c});
if(!b.ke_contextmenu){b.ke_contextmenu=1;o.on(b,"mousedown",h.hide);e.on("sourcemode",h.hide,b);o.on(b.body,"contextmenu",function(f){h.hide.call(this);for(var d=new l(f.target);d;){var m=false;if(d._4e_name()=="body")break;for(var g=0;g<j.length;g++){var s=j[g].instance,t=j[g].rules;if(b===j[g].doc&&q(d[0],t)){f.preventDefault();m=true;var n=f.pageX,p=f.pageY;if(!n){g=d._4e_getOffset();n=g.left;p=g.top}setTimeout(function(){s.show(k.Utils.getXY(n,p,b,document))},30);break}}if(m)break;d=d.parent()}})}return c};
h.hide=function(){for(var a=0;a<j.length;a++){var c=j[a].instance;this===j[a].doc&&c.hide()}};var u=k.Overlay;i.augment(h,{_init:function(){var a=this,c=a.cfg,e=c.funcs;a.el=new u({content:"<div>",autoRender:true,width:c.width,elCls:"ke-menu"});a.elDom=a.el.get("contentEl").one("div");c=a.elDom;for(var b in e){var f=new l("<a href='#'>"+b+"</a>");c[0].appendChild(f[0]);(function(d,m){d._4e_unselectable();d.on("click",function(g){g.halt();if(!d.hasClass("ke-menuitem-disable")){a.hide();setTimeout(m,
30)}})})(f,e[b])}},destroy:function(){if(this.el){this.elDom.children().detach();this.el.destroy()}},hide:function(){this.el&&this.el.hide()},_realShow:function(a){k.fire("contextmenu",{contextmenu:this});this.el.set("xy",[a.left,a.top]);a=this.cfg;var c=a.statusChecker;if(c)for(var e=this.elDom.children("a"),b=0;b<e.length;b++){var f=new l(e[b]),d=c[i.trim(f.text())];if(d)d(a.editor)?f.removeClass("ke-menuitem-disable"):f.addClass("ke-menuitem-disable")}this.el.show()},_prepareShow:function(){this._init()},
show:function(a){this._prepareShow(a)}});k.ContextMenu=h}},{attach:false,requires:["overlay"]});