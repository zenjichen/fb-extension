var facebookFunction, initUI;

(function() {
    var init = async function() {

        let fb = new facebookFunction;
        let UI = new initUI;
        let cookie = await fb.checkCookie();
        if (cookie) {
            UI.btnGlobal();
            chrome.storage.sync.get(['policy'], function(result) {
                result.policy ? UI.load_current_page() : Policy(UI)
            });
        } else {
            window.top.location.replace("https://www.facebook.com/login"), localStorage.clear();
        }
    }
    initUI = function() {
        return {
            btnGlobal: function() {
                var _this;
                _this = this;
                _this.UI_Popup();

                $(document).on('click', '#sidebarCollapse', function() {
                    $('#sidebar').toggleClass('active');
                });
                $(document).on('click', 'a[href^="?"]', function() {
                    setTimeout(() => {
                        location.reload();
                    }, 1000);
                });
                $(document).on('click', '#update_profile', function() {
                    $('section').hide();
                    _this.updateProfile();
                })
                $(document).on('click', '.open-function', function() {
                    chrome.tabs.create({ url: chrome.extension.getURL("html/index.html?profile") })
                })

                $(document).on('click', '.getToken', function() {
                    notification('AccessToken', localStorage.touch, 'info')
                        // alert('123');
                })
                $(document).on('click', '.logout', function() {
                    chrome.cookies.remove({
                        url: "https://facebook.com",
                        name: "c_user"
                    })
                    localStorage.clear(),
                        chrome.storage.sync.clear(function() {});
                    chrome.runtime.sendMessage({
                        type: 'reload',
                    }, function(response) {});
                    chrome.browserAction.setPopup({ popup: "" });
                    setTimeout(() => {
                        location.reload();
                    }, 500);
                })

            },
            UI_Popup: function() {
                var _this;
                _this = this;
                if (localStorage.auto_reaction) {
                    JSON.parse(localStorage.auto_reaction) ? $('#autoReactions_popup').prop('checked', true) : $('#autoReactions_popup').prop('checked', false);
                }
                $(document).on('click', '#autoReactions_popup', function() {
                    let is_reactions = $(this)[0].checked;
                    is_reactions ? localStorage.auto_reaction = true : localStorage.auto_reaction = false;
                    _this.disableForm(is_reactions);
                    chrome.runtime.sendMessage({
                        reactions: is_reactions ? 'active' : 'disabled',
                        time_min: null,
                        time_max: null,
                        reaction_type: null
                    }, function(response) {
                        console.log(response);
                    });
                })
                if (localStorage.shiled) {
                    JSON.parse(localStorage.shiled) ? $('#Shield_popup').prop('checked', true) : $('#Shield_popup').prop('checked', false);
                }
                $(document).on('click', '#Shield_popup', function() {
                    shield = $(this)[0].checked;
                    shield ? localStorage.shiled = true : localStorage.shiled = false;
                    e = new Shield;
                    e.shield(shield);
                })

                chrome.storage.local.get(null, function(items) {
                    if (items.block_chat_seen) {
                        JSON.parse(items.block_chat_seen) ? $('#blockMessage_popup').prop('checked', true) : $('#blockMessage_popup').prop('checked', false);
                    }
                    $(document).on('click', '#blockMessage_popup', function() {
                        blockmessage = $(this)[0].checked;
                        chrome.storage.local.set({
                            'block_chat_seen': blockmessage,
                        });
                    })
                })
                chrome.storage.local.get(null, function(items) {
                    if (items.block_typing_indicator) {
                        JSON.parse(items.block_typing_indicator) ? $('#blockType_popup').prop('checked', true) : $('#blockType_popup').prop('checked', false);
                    }
                    $(document).on('click', '#blockType_popup', function() {
                        blocktype_indicator = $(this)[0].checked;
                        chrome.storage.local.set({
                            'block_typing_indicator': blocktype_indicator,
                        });
                    })

                })


            },
            disableForm: function(check) {
                $("#reaction :input").attr("disabled", check);
                $("#reactions-time-min,#reactions-time-max").attr("disabled", check);
            },
            load_current_page: async function() {
                localStorage.information ? true : await get_Information();
                this.initPopup();
                var parameter = window.location.href.split('?')[1];
                if (parameter) {
                    this.move(parameter)
                } else {
                    return
                }
            },
            initPopup: async function() {
                let coverphoto = 'https://scontent.fsgn2-4.fna.fbcdn.net/v/t1.0-9/p960x960/96599563_114051716967948_1893367230712774656_o.jpg?_nc_cat=101&_nc_sid=dd9801&_nc_ohc=z-Whx6mMXTMAX-rx2Yq&_nc_ht=scontent.fsgn2-4.fna&_nc_tp=6&oh=5da7969a869eced290053e859ebcdd2a&oe=5EDFC264';
                if (!localStorage.coverphoto) {
                    await getCoverPhoto();
                }
                // console.log(localStorage.coverphoto)
                id_user = localStorage.id;
                $('.name_popup').text(localStorage.name);
                $('.id_popup').text('ID: ' + id_user);
                $('.card-img-top,.img-header').attr('src', 'https://graph.facebook.com/' + id_user + '/picture?height=500');
                $('.bg-cover').attr('style', `height: 128px;background-size: cover;background-position: center center;background-image: url(${localStorage.coverphoto ? localStorage.coverphoto : coverphoto})`);
                $('.push-top').removeClass('d-none');
            },
            move: async function(target) {
                $('a').removeClass('active_tab');
                $("a[href$='" + target + "']").addClass('active_tab');
                this.navigate(target);
            },
            navigate: async function(page) {
                if (page) {
                    switch (page) {
                        case 'profile':
                            localStorage.information ? true : await get_Information();
                            await $.get('/html/dashboard.html', function(data) {
                                $('#content').html(data);
                            })
                            e = new Profile;
                            e.init();
                            break;
                        case 'pokes':
                            await $.get('/html/pokes.html', function(data) {
                                $('#content').html(data);
                            })
                            e = new Pokes;
                            e.init();
                            break;
                        case 'invite_friend_join':
                            await $.get('/html/invite_friend.html', function(data) {
                                $('#content').html(data);
                            })
                            e = new InviteFriend;
                            e.init();
                            break;
                        case 'picture-guard':
                            await $.get('/html/shield.html', function(data) {
                                $('#content').html(data);
                            })
                            e = new Shield;
                            e.init();
                            break;
                        case 'like_new_feed':
                            await $.get('/html/reaction.html', function(data) {
                                $('#content').html(data);
                            })
                            e = new Reaction;
                            e.init();
                            break;
                        case 'filer-friend-interaction':
                            await $.get('/html/filter_friend.html', function(data) {
                                $('#content').html(data);
                            })
                            e = new filterFriend;
                            e.init();
                            break;
                        case 'leave-group':
                            await $.get('/html/leave_group.html', function(data) {
                                $('#content').html(data);
                            })
                            setTimeout(() => {
                                e = new leaveGroup;
                                e.init();
                            }, 1000);
                            break;

                        case 'invite_live':
                            await $.get('/html/invite_live.html', function(data) {
                                $('#content').html(data);
                            })
                            setTimeout(() => {
                                e = new InviteLive;
                                e.init();
                            }, 1000);
                            break;
                        case 'auto_reaction':
                            await $.get('/html/auto_like.html', function(data) {
                                $('#content').html(data);
                                e = new autoReaction;
                                e.init();
                            })
                            break;
                        case 'invite_group':
                            await $.get('/html/invite_group.html', function(data) {
                                $('#content').html(data);
                            })
                            e = new Invite_group;
                            e.init();
                            break;
                        case 'download_video':
                            await $.get('/html/download_video.html', function(data) {
                                $('#content').html(data);
                            })
                            setTimeout(() => {
                                e = new downloadVideo;
                                e.init();
                            }, 1000);
                            break;
                        case 'auto_new_comment':
                            await $.get('/html/auto_new_comment.html', function(data) {
                                $('#content').html(data);
                            })
                            e = new Auto_new_comment;
                            e.init();
                            break;
                        case 'security-tester':
                            await $.get('/html/security-tester.html', function(data) {
                                $('#content').html(data);
                            })
                            e = new securityTester;
                            e.init();
                            break;
                        case 'autopost-group':
                            await $.get('/html/autopost_group.html', function(data) {
                                $('#content').html(data);
                            })
                            setTimeout(() => {
                                e = new autopostGroup;
                                e.init();
                            }, 1000);
                            break;
                        case 'friend_deactivated':
                            await $.get('/html/friend_deactivated.html', function(data) {
                                $('#content').html(data);
                            })
                            e = new FriendDeactivated;
                            e.init();
                            break;
                        case 'unseen_mess':
                            await $.get('/html/unseen_messenger.html', function(data) {
                                $('#content').html(data);
                            })
                            setTimeout(() => {
                                e = new unSeenMess;
                                e.init();
                            }, 1000);
                            break;



                        default:
                            break;
                    }
                } else {
                    return;
                }
            },
            updateProfile: function() {
                localStorage.clear();
                location.reload();
            },
        }
    }
    facebookFunction = function() {
        return {
            checkCookie: function() {
                return new Promise((resolve, reject) => {
                    chrome.cookies.get({
                        url: "https://facebook.com",
                        name: "c_user"
                    }, async response => {
                        if (response) {
                            if (localStorage.id && localStorage.id != response.value) {
                                localStorage.clear();
                                location.reload();
                            }
                            // console.log(localStorage.id == response.value)
                            localStorage.id = response.value;
                            await this.run().then(e => {
                                null !== e
                                try {
                                    this.convertDataCookie(e);
                                } catch (e) {
                                    fetch("https://m.facebook.com/policies").then(e => e.text()).then(e => {
                                        const o = e.match(/(\/a\/preferences\.php\?fast_switch_site[a-zA-Z0-9&=\-_%.;]+)/);
                                        o && o[1] && fetch(`https://m.facebook.com${o[1].replace(/&amp;/g, "&")}`).then(() => {
                                            this.run().then(e => this.convertDataCookie(e))
                                        })
                                    })
                                }
                            })
                            resolve(response.value ? true : false);

                        } else {
                            window.top.location.replace("https://www.facebook.com/login"), localStorage.clear()
                        }
                    })
                })
            },
            convertDataCookie: function(e) {
                const o = e.match(/accessToken\\":\\"(.*?)\\"/);
                localStorage.touch = o[1];
                const t = e.match(/{\\"dtsg\\":{\\"token\\":\\"(.*?)\\"/);
                localStorage.dt = t[1];
                console.log(localStorage.dt);
                let a = e.match(/\\"NAME\\":\\"(.*?)"/);
                localStorage.__rev = e.match(/server_revision+\\":+(\d+)/)[1];
                jazoest = '';
                for (var x = 0; x < localStorage.dt.length; x++) {
                    jazoest += localStorage.dt.charCodeAt(x);
                }
                localStorage.jazoest = '2' + jazoest;
                a = a[1].slice(0, -1).replace(/\\\\/g, "\\"), a = decodeURIComponent(JSON.parse(`"${a}"`)), localStorage.name = a;
            },
            run: () => fetch("https://m.facebook.com/composer/ocelot/async_loader/?publisher=feed").then(e => e.text())
        }
    }

    var Policy = function(UI) {
        Swal.fire({
            width: 838,
            html: `
                <div class="page-wrapper" style="padding-left: 10px;">
                    <div class="" style="padding-top: 0px!important;">
                    <h4 class="title-policy  mb-4">Điều khoản dịch vụ của 3F Solutions</h4>
                        <div class=" text-left">
                            <div class="row ">
                                <div class="col-12">
                                    <div class="content-terms">
                                        <div class="font-15">
                                            <p class="">Trước khi bạn sử dụng công cụ này, bạn cần xem qua và đồng ý những điều khoản và điều kiện sau:</p>
                                            <div class="over-content">
                                                <div class="content-chap ml-2">
                                                    <p class="my-3">Công cụ Facebook Tools không hỏi, không biết và không lưu trữ</p>
                                                    <ul class="policy-facebook">
                                                        <li>Mật khẩu đăng nhập facebook của bạn</li>
                                                        <li>Mật khẩu 2 lớp của tài khoản facebook của bạn</li>
                                                        <li>Chúng tôi xác nhận không thực hiện và <strong>không thể thực hiện</strong> các hành vi: chiếm đoạt tài khoản (cá nhân), fanpage, group của bạn. Đây là điều kiện quan trọng bạn phải xem và đồng ý trước khi sử dụng công cụ này.</li>
                                                    </ul>
                                                    <p class="my-3">Riêng với các tính năng <strong>tự động</strong>: Để hệ thống có thể hoạt động chúng tôi sẽ lưu trữ: <strong>Cookie</strong> & <strong>User Token</strong> của bạn trên server của chúng tôi.</p>
                                                    
                                                </div>
                                                
                                            <p>Một số trường hợp (rất hiếm) có thể bị checkpoint (tài khoản mới tạo, tài khoản chưa avatar, tài khoản clone …) vui lòng đồng ý với điều khoản và điều kiện này trước khi sử dụng.</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                               
                                <div class="d-flex col-12 justify-content-center mt-3">
                                    <button class="btn-secondary btn-sm mr-4 custom-danger" id="btn_quit">Thoát ứng dụng</button>
                                    <button class="btn btn-primary " id="btn_accept">Đồng ý và Sử dụng</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            `,
            showCloseButton: true,
            showCancelButton: false,
            showConfirmButton: false,
            allowEscapeKey: false,
            allowOutsideClick: false,
            onOpen: () => {
                $('body').on('click', '#btn_quit', function() {
                    window.close()
                })
                $('body').on('click', '#btn_accept', function() {
                    UI.load_current_page();
                    chrome.storage.sync.set({ policy: true }, function() {});
                    chrome.browserAction.setPopup({ popup: 'html/popup.html' });
                    $(".swal2-cancel").click()
                })
            }
        })
    }
    return {
        init: init
    }
})().init();