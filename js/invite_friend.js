var InivteFriend;

InviteFriend = function() {
    return {
        init: function() {

            var _this;
            _this = this;
            window.friend_poke = 'all-friend';
            $('#friend-status').on('change', function() {
                var value = $(this).val();
                friend_poke = value
                $('.friend-all').html('<span style="margin:10px 0; width: 40px; height: 40px;" class="spinner-border text-white m-auto d-block spinner-border-sm" role="status" aria-hidden="true"></span>')
                renderFriend('invite_friend_join', value);
            });
            renderFriend('invite_friend_join', 'all-friend');
            $(document).on('click', '#start_invite', async function() {
                var list_friend;
                if (window.list_select) list_friend = window.list_select;
                var link_fanpage = $('#link_fanpage').val();
                var message = $('#message').val();
                var is_message = $('#is_message')[0].checked;
                if (link_fanpage) {
                    const id_fanpage = await extract_id_facebook(link_fanpage);
                    console.log(id_fanpage);

                    if (id_fanpage) {
                        if (list_friend && list_friend.length > 0) {
                            confirm_notification('Đồng ý để gửi lời mời!', null, async(callback) => {
                                if (callback) {
                                    _this.invite_friend_join_action(id_fanpage, message, is_message, list_friend);
                                }
                            })
                        } else {
                            notification('Chọn bạn bè để mời!','', 'error');
                        }
                    } else {
                        notification('Link fanpage không hợp lệ','', 'error');
                    }
                } else {
                    notification('Nhập đường dẫn fanpage','', 'error');
                }
            })
        },
        invite_friend_join_action: async function(id_page, message, is_messages, list_invite) {
            // console.log(id_page, message, is_messages, list_invite);
            invite_data = '';
            console.log(list_invite)
                // list_invite = [{
                //     name: "Nguyễn Hoài Vỹ",
                //     uid: "100051128732843",
                // }]

            // list_invite = 100051128732843];
            $.each(list_invite, (key, item) => {
                    invite_data = invite_data + '&invitees[' + item.uid + ']=' + item.uid;
                })
                // console.log(invite_data);
            try {
                parms = 'page_id=' + id_page + '&invite_note=' + message + '&send_in_messenger=' + is_messages + invite_data + '&ref=modal_page_invite_dialog_v2 &__user=' + localStorage.id + '&__a=1&__req=1k&__be=1&_&dpr=1.5&__rev=' + localStorage.__rev + '&fb_dtsg=' + localStorage.dt + '&jazoest=' + localStorage.jazoest + '&__spin_r=' + localStorage.__rev + '&__spin_b=trunk';
                // console.log(parms);
                fetch('https://www.facebook.com/pages/batch_invite_send/', {
                    method: 'POST',
                    headers: {
                        'Accept': 'application/json, application/xml, text/plain, text/html, *.*',
                        'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8'
                    },
                    body: parms
                }).then(e => e.text())
                notification('Đã mời thành công ' + list_invite.length + ' bạn bè','', 'success');
                $('#link_fanpage').val('');
                $('#message').val('');
                $('#is_message').prop('checked', false);
                renderFriend('invite_friend_join', friend_poke);
            } catch (error) {
                console.log(error);
                notification('Không thành công. Thử lại!','', 'error');
            }
        }
    }
}