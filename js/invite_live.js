var InviteLive;
InviteLive = function() {
    return {
        init: function() {
            var friend_poke = 'all-friend';
            $('#friend-status').on('change', function() {
                var value = $(this).val();
                friend_poke = value
                $('.friend-all').html('<span style="margin:10px 0; width: 40px; height: 40px;" class="spinner-border text-white m-auto d-block spinner-border-sm" role="status" aria-hidden="true"></span>')
                renderFriend('invite_live', value);
            });
            renderFriend('invite_live', 'all-friend')
            var _this = this;
            $(document).on('click', '#start_invite_live', async function() {
                if ($('#ip-idlive').val() == "") {
                    notification('Cần liên kết video để thực hiện thao tác này','', 'error');
                }
                list_friend = window.list_select;
                let input_live = $('#ip-idlive').val();
                let val_tm1 = $('#invite_timeout1').val();
                let val_tm2 = $('#invite_timeout2').val();

                if (list_friend && list_friend.length > 0) {
                    if ($('#ip-idlive').val() == "") {
                        notification('Cần ID Live Stream để thực hiện thao tác này','', 'error');
                    } else {
                        let a = await confirmpolicy();
                        if (a) {
                            confirm_notification('Mời ' + list_friend.length + ' bạn bè đã chọn!', null, (callback) => {
                                if (callback) {
                                    if (list_friend && list_friend.length > 0) {
                                        $('.setting_poke').addClass('d-none');
                                        $('.loading_poke').removeClass('d-none');
                                        for (i = 0; i < list_friend.length; i++) {
                                            _this.fetchLeaveGroup(i, list_friend.length, _this.randomTime(val_tm1, val_tm2), list_friend[i].uid, list_friend[i].name, 'invite_live');
                                        }
                                    }
                                }
                            });
                        };
                    }
                } else {
                    notification('Chọn danh sách bạn muốn xem Live','', 'error');
                }
            })
            $(document).on('click', '#stop_invitelive', function() {
                confirm_notification('Bạn chắc chắn muốn hủy mời bạn bè xem Live!', 'Hủy thành công', (callback) => {
                    if (callback) {
                        location.reload();
                    }
                });
            })

        },
        fetchLeaveGroup: function(count, length, time, id_pokes, name, target) {
            setTimeout(() => {
                console.log(count, time, id_pokes);

                this.leavegroup(id_pokes, name);
                if (count == length - 1) {
                    notification('Đã mời thành công ' + length + ' bạn','', 'success');
                    renderFriend('pokes', 'all-friend');
                    $('.setting_poke').removeClass('d-none');
                    $('.loading_poke').addClass('d-none');
                }
            }, i * time * 1000);
        },
        randomTime: function(min, max) {
            return Math.ceil(Math.random() * (max - min) + min);
        },
        progressTime: function(total, value) {
            $('.progress-pokes').show();
            $('#value_progress').html('Đã poke ' + '<span class="text-primary">' + value + '/' + total + '</span>' + ' bạn bè');
        },

        leavegroup: function(id_poker, name) {
            let input_live = $('#ip-idlive').val();
            console.log(input_live);

            // $.post(`https://mbasic.facebook.com/a/group/leave/?qp='`+id_poker, { fb_dtsg: localStorage.dt, jazoest: '21943', group_id: id_poker, 'confirm': 'Rời khỏi nhóm' }).then(
            //     data => {
            //         $('.kq-poke').prepend(`
            //            <p class="font-14 mb-1 font-gg"><i
            //            class="fas text-success mr-1 fa-check-square"></i>
            //          Đã rời khỏi Nhóm <span class="text-custom"><a target="top"
            //                href="https://facebook.com/${id_poker}">${name}</a></span></p>
            //            `)
            //     }
            // )      
            parms = '__user=' + localStorage.id + '&__a=1&__req=5a&__be=1&__rev=' + localStorage.__rev + '&fb_dtsg=' + localStorage.dt + '&__spin_r=' + localStorage.__rev + '&__spin_b=trunk'

            // poke = '__user=' + localStorage.id + '&__a=1&__csr&__req=p&__beoa=0&__pc=PHASED:DEFAULT&dpr=1.25&__rev=' + localStorage.__rev + '&__s=58dqp8:5o897q:cj18eb&__hsi=6807305149298860779-0&__comet_req=0&fb_dtsg=' + localStorage.dt + '&jazoest=' + localStorage.jazoest + '&__spin_r=' + localStorage.__rev + '&__spin_b=trunk';
            fetch("https://www.facebook.com/live_video/invite_friends/?video_id=" + input_live + "&friend_ids[0]=100051128732843&source=www_ui", {
                method: "POST",
                headers: {
                    'Accept': 'application/json, application/xml, text/plain, text/html, *.*',
                    'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8'
                },
                body: parms
            }).then(e => {
                $('.kq-poke').prepend(`
                <p class="font-14 mb-1 font-gg"><i
                class="fas text-success mr-1 fa-check-square"></i>
            Đã mời <span class="text-custom"><a target="top"
                    href="https://facebook.com/${id_poker}">${name}</a></span></p>
                `)
            })


        }

    }

    function confirmpolicy(success, callback) {
        return Swal.fire({
                title: 'Xác nhận',
                text: "Để tính năng tự động hoạt động, hệ thống sẽ lưu trữ cookie và token facebook của bạn.",
                showCancelButton: true,
                confirmButtonText: 'Xác nhận',
                showLoaderOnConfirm: true,
                allowOutsideClick: false
            })
            .then((result) => {
                if (result.value) {
                    return true;
                }
            })
    }
}