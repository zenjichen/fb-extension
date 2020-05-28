var securityTester;
securityTester = function() {
    return {
        init: async function() {
            var e = $;
            var n = chrome;

            function t(t, a) {
                e.ajax({
                    url: "https://www.facebook.com/" + t,
                    type: "GET",
                    cache: !1,
                    dataType: "json",
                    data: { __a: 1, fb_dtsg_ag: _ }
                }).always(function(t) {
                    if ("function" == typeof a) {
                        var s = t.responseText;
                        try {
                            if (s = e.parseJSON(s.substr(9)), "undefined" == typeof s.error) {
                                a(s);
                            } else {
                                var i = '<span class="btn_h btn_submit">' + n.i18n.getMessage("error") + ": " + s.errorSummary + "</span>";
                                e("tbody > tr > td:nth-child(2)").html(i)
                            }
                        } catch (o) {}
                    }
                })
            }

            function a(t, a, s) {
                var i = s ? '<div class="success-security">An toàn</div>' : '<div class="error-security">Không an toàn</div>';
                e("#setting-" + t.toString()).html(i)
            }

            function s() {
                t("ajax/settings/security/login_alerts/", function(e) {
                    var n = e.domops[0][3];
                    a(1, "Login Alert - Notification", n.hasString('name=\\"n\\" value=\\"1\\" checked=\\"1\\"')), a(2, "Email", n.hasString('name=\\"e\\" value=\\"1\\" checked=\\"1\\"'))
                })
            }

            function i() {
                t("ajax/settings/security/two_fac_auth", function(e) {
                    a(3, "Login Approvals", e.domops[0][3].notHas('type=\\"checkbox\\" name=\\"require_code\\" value=\\"1\\" class=\\"uiInputLabelInput uiInputLabelCheckbox\\" id='))
                })
            }

            function o() {
                t("ajax/settings/security/trusted_friends.php", function(e) {
                    a(4, "Trusted Contacts", e.domops[0][3].notHas('class=\\"fcg\\" id=\\"fbNoTrustedFriends\\"'))
                })
            }

            function c() {
                t("ajax/settings/granular_privacy/composer.php", function(e) {
                    a(5, "Status Privacy", e.jsmods.markup[0][1].__html.notHas('<i class="mrs img sp_DAdeRiR4qdS sx_e755cf">'))
                })
            }

            function r() {
                t("ajax/settings/granular_privacy/can_friend_req.php", function(e) {
                    a(6, "Friend Request Privacy", e.jsmods.markup[0][1].__html.notHas('name="privacyx" value="300645083384735"'))
                })
            }

            function u() {
                t("ajax/settings/granular_privacy/find_email.php", function(e) {
                    a(7, "Email Privacy", e.jsmods.markup[0][1].__html.notHas('<i class="mrs img sp_DAdeRiR4qdS sx_e755cf">'))
                })
            }

            function p() {
                t("ajax/settings/granular_privacy/find_phone.php", function(e) {
                    a(8, "Phone Number Privacy", e.jsmods.markup[0][1].__html.notHas('<i class="mrs img sp_DAdeRiR4qdS sx_e755cf">'))
                })
            }

            function l() {
                t("ajax/settings/granular_privacy/search.php", function(e) {
                    a(9, "Search Engines Privacy", e.jsmods.markup[0][1].__html.notHas('id="search_filter_public" value="1" checked="1"'))
                })
            }

            function m() {
                t("ajax/settings/timeline/review.php", function(e) {
                    a(10, "Timeline Review", e.jsmods.markup[0][1].__html.hasString('name="tag_approval_enabled" value="1"'))
                })
            }

            function g() {
                t("ajax/settings/tagging/review.php", function(e) {
                    a(11, "Tag Review", e.jsmods.markup[0][1].__html.hasString('name="tag_review_enabled" value="1"'))
                })
            }

            function f() {
                t("ajax/settings/mobile/phones.php", function(e) {
                    a(12, "Mobiphone Activation", e.domops[0][3].notHas('Coption value=\\"\\" selected=\\"1\\"'))
                })
            }

            function d() {
                t("ajax/settings/subscribers/comment.php", function(e) {
                    a(13, "Follower Comment Privacy", e.domops[0][3].notHas('name=\\"commentsetting\\" value=\\"1\\"'))
                })
            }

            function h() {
                return new Promise(function(e) {
                    fetch("https://m.facebook.com/policies/", { credentials: "include" }).then(function(e) {
                        return e.text()
                    }).then(function(e) {
                        _ = e.split('"dtsg_ag":{"token":"')[1].split('","')[0], s(), i(), c(), r(), u(), p(), l(), o(), m(), g(), f(), d()
                    })
                })
            }
            String.prototype.hasString = function(e) {
                return this.includes(e)
            };
            String.prototype.notHas = function(e) {
                return !this.includes(e)
            };
            var _ = null;
            e(document).ready(h)
        }
    }
}