"use strict";
! function (e) {
    e.storage.sync.get({
        account_type: "free",
        anti_clickjacking: !0,
        blockCryptocurrencyMining: !0,
        blockFacebookAutoCheckin: !1,
        blockFacebookPixel: !1,
        blockSeen: !1,
        blockSeenStoryFB: !1,
        blockSeenStoryInstagram: !1,
        blockSelfXSS: !1,
        blockTypingChat: !1,
        blockTypingComment: !1,
        facebook_dark_theme: !1,
        google_dark_theme: !1,
        hideActiveTime: !1,
        onlinedb: !0,
        realtime: !0,
        removeFbclid: !1,
        show_update_notification: !0,
        showFacebookTimeCounter: !1,
        stopFacebookTimeline: !1
    }, function (t) {
        new Vue({
            el: "#juno_okyo",
            data: Object.assign({
                loading: !1,
                pass: [74, 85, 78, 79],
                keys: [],
                showEasterEgg: !1
            }, t),
            methods: {
                onSubmit: function () {
                    var o = this;
                    this.loading = !0;
                    var n = {};
                    Object.keys(t).map(function (e) {
                        n[e] = o[e]
                    }), e.storage.sync.set(n, function () {
                        setTimeout(function () {
                            o.loading = !1, console.log("Saved!")
                        }, 300)
                    })
                },
                i18n: function (t) {
                    return e.i18n.getMessage(t)
                },
                easterEgg: function (e) {
                    var t = e.which || e.keyCode;
                    t === this.pass[this.keys.length] ? (this.keys.push(t), String.fromCharCode.apply(null, this.pass) === String.fromCharCode.apply(null, this.keys) && (document.body.removeEventListener("keydown", this.easterEgg, !1), this.showEasterEgg = !0)) : this.keys = []
                }
            },
            mounted: function () {
                document.body.addEventListener("keydown", this.easterEgg, !1)
            }
        })
    }), document.body.addEventListener("contextmenu", function (e) {
        return e.preventDefault(), !1
    }), e.runtime.sendMessage({
        cmd: "track_page_view",
        path: "../html/index.html"
    })
}(chrome);