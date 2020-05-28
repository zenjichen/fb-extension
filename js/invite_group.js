var Invite_group;
Invite_group = function() {
    return {
        init: function() {
            var _this;
            _this = this;
            // Swal.fire({
            //     title: '<strong>HTML <u>example</u></strong>',
            //     icon: 'info',
            //     html: 'You can use <b>bold text</b>, ' +
            //         '<a href="//sweetalert2.github.io">links</a> ' +
            //         'and other HTML tags',
            //     showCloseButton: true,
            //     showCancelButton: true,
            //     focusConfirm: false,
            //     confirmButtonText: '<i class="fa fa-thumbs-up"></i> Great!',
            //     confirmButtonAriaLabel: 'Thumbs up, great!',
            //     cancelButtonText: '<i class="fa fa-thumbs-down"></i>',
            //     cancelButtonAriaLabel: 'Thumbs down'
            // })
            renderFriend('group');
            $(document).on('click', '#start_invite_grout', async function() {
                list_friend = window.list_select;
                var time_min = $('#group-time-min').val()
                var time_max = $('#group-time-max').val()
                const link_group = $('#link_group').val()
                if (list_friend && list_friend.length > 0) {
                    if (link_group) {
                        const id_group = await extract_id_facebook(link_group)
                        if (id_group) {
                            console.log(time_min);
                            console.log(time_max);
                            if (+time_min < +time_max) {
                                confirm_notification('Mời ' + list_friend.length + ' bạn bè đã chọn!', null, (callback) => {
                                    if (callback) {
                                        if (list_friend && list_friend.length > 0) {
                                            $('.setting_poke').addClass('d-none');
                                            $('.loading_poke').removeClass('d-none');
                                            for (i = 0; i < list_friend.length; i++) {
                                                _this.fetchInviteGroup(i, list_friend.length, _this.randomTime(time_min, time_max), list_friend[i].uid, id_group, list_friend[i].name, 'group ');
                                            }
                                        }
                                    }
                                });
                            } else {
                                notification('Thời gian tối đa bé hơn thời gian tối thiểu','', 'error');
                            }
                        } else {
                            notification('Link Group không hợp lệ','', 'error');
                        }
                    } else {
                        notification('Nhập đường dẫn Group','', 'error');
                    }
                } else {
                    notification('Chọn bạn bè để mời','', 'error');
                }
            });
        },
        fetchInviteGroup: function(count, length, time, id_uid, id_group, name, target) {
            setTimeout(() => {
                this.inviteGroup(id_group, id_uid, name);
                if (count == length - 1) {
                    notification('Đã mời ' + length + ' bạn bè','', 'success');
                    // const friend_list = JSON.parse(localStorage.friend).data;
                    // this.renderTablefriend(target);
                    $('.setting_poke').removeClass('d-none');
                    $('.loading_poke').addClass('d-none');
                }
            }, i * time * 1000);
        },
        randomTime: function(min, max) {
            return Math.ceil(Math.random() * (max - min) + min);
        },

        inviteGroup: async function(idGroup, idUser, name) {
            console.log(idGroup, idUser);
            var postGroup = {
                group_id: idGroup,
                'members[0]': idUser,
                message_id: 'groupsAddMemberCompletionMessage',
                recommendation_key: '1588732863_0',
                ref: '',
                source: 'suggested_members_new',
                __user: 100051128732843,
                __a: 1,
                __csr: '',
                __req: 14,
                __beoa: 0,
                __pc: 'PHASED:DEFAULT',
                dpr: 1.5,
                __ccg: 'GOOD',
                __rev: 1002088041,
                __s: ' a16ffs:wcgmxh:8zmfmh',
                __hsi: '6823556003828416700-0',
                __comet_req: 0,
                fb_dtsg: localStorage.dt,
                jazoest: localStorage.jazoest,
                __spin_r: 1002088041,
                __spin_b: 'trunk',
                __spin_t: 1588732631
            };
            console.log(postGroup);
            $.post('https://www.facebook.com/ajax/groups/members/add_post/', postGroup, function(res) {
                console.log(res);
            }).then(e => {
                $('.kq-poke').prepend(`
                <p class="font-14 mb-1 font-gg"><i
                class="fas text-success mr-1 fa-check-square"></i>
            Đã chọc <span class="text-custom"><a target="top"
                    href="https://facebook.com/${idUser}">${name}</a></span></p>
                `)
            })
        }
    }
}