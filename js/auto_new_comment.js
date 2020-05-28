var Auto_new_comment;
Auto_new_comment = function () {
    return {
        init: function () {
            var friend_data;
            if (localStorage.message)
                $('#message').val(localStorage.message);
            if (localStorage.time_min_comment && localStorage.time_max_comment) {
                $('#group-time-min').val(JSON.parse(localStorage.time_min_comment));
                $('#group-time-max').val(JSON.parse(localStorage.time_max_comment));
            }
            if (localStorage.listFriend) {
                if (JSON.parse(localStorage.listFriend) == "allFriend") {
                    friend_data = "allFriend"
                    $('#all-post').prop('checked', true)
                } else {
                    $('#swal-friend').prop('checked', true);
                }
            }
            if (JSON.parse(localStorage.auto_comment)) {
                console.log('ssss');
                $('#autoComment').prop('checked', true)
            }
            $("#autoComment").click(async function () {
                let is_Comment = $(this)[0].checked;
                let time_min = $('#group-time-min').val()
                let time_max = $('#group-time-max').val()
                let message = $('#message').val()
                let confirm;
                if (message) {
                    if (+time_min < +time_max) {
                        if (friend_data) {
                            is_Comment ? confirm = (localStorage.confirm ? true : await confirmpolicy()) : confirm = true;
                            if (confirm) {
                                setTimeout(() => {
                                    is_Comment ? $(this).prop('checked', true) : $(this).prop('checked', false);
                                }, 1);
                                if (is_Comment) {
                                    localStorage.auto_comment = true;
                                } else {
                                    localStorage.auto_comment = false;
                                    setTimeout(() => {
                                        localStorage.time_max_comment = '';
                                        localStorage.time_min_comment = '';
                                        localStorage.message = '';
                                        localStorage.listFriend = '';
                                    }, 100);
                                }
                                chrome.runtime.sendMessage({
                                    Comment: is_Comment ? 'active' : 'disabled',
                                    message: message,
                                    time_min_comment: time_min,
                                    time_max_comment: time_max,
                                    listFriend: friend_data
                                }, function (response) { });
                            }
                        } else {
                            $("#autoComment").prop("checked", false)
                            notification('Chọn bạn bè để comment', '', 'error');
                        }
                    } else {
                        $("#autoComment").prop("checked", false)
                        notification('Thời gian tối thiểu phải nhỏ hơn thời gian tối đa', '', 'error');
                    }
                } else {
                    $("#autoComment").prop("checked", false)
                    notification('Nhập nội dung muốn comment', '', 'error');
                }
            })
            $("input[type=radio][name=inlineRadioOptions").click(function () {
                if ($("#all-post").prop("checked")) {
                    console.log('tất cả');
                    friend_data = 'allFriend'
                }
                if ($("#swal-friend").prop("checked")) {
                    swal_tableFriend();
                    window.list_select = []
                    $('.btn-editcomment').removeClass('d-none')
                } else {
                    $('.btn-editcomment').addClass('d-none')
                    $('.fetch-user-comment').addClass('d-none')
                }
            })
            var swal_tableFriend = function () {
                Swal.fire({
                    width: 838,
                    padding: '0px',
                    html: `
                    <div class="fetch_data">
                        <h5 class="font-gg pb-1 text-white font-18">Danh sách bạn bè</h5>
                        <div class="friend-all friend-allcomment">
                            <span style="margin:10px 0; width: 40px; height: 40px;" class="spinner-border text-white m-auto d-block spinner-border-sm" role="status" aria-hidden="true"></span>
                        </div>
                        <div class="btn btn-info w-25 btn-getdattable d-none">Đồng ý</div>
                    </div>
                    `,
                    showCloseButton: false,
                    showCancelButton: false,
                    showConfirmButton: false,
                    allowEscapeKey: false,
                    allowOutsideClick: false,
                    onOpen: async () => {
                        $('.swal2-header').remove()
                        await renderFriend('comment', 'all-friend');
                        console.log('ssss');
                        $('.btn-getdattable').removeClass('d-none')
                        $('.btn-getdattable').click(function () {
                            let list_friend = window.list_select
                            friend_data = list_friend
                            if (list_friend != '') {
                                $(".swal2-cancel").click()
                                add_user_comment(list_friend)
                            }
                        })
                    }
                })
            }
            var add_user_comment = function (data) {
                $('.fetch-user-comment').removeClass('d-none')
                $('.list-friend-comment').html('')
                for (let i = 0; i < data.length; i++) {
                    $('.list-friend-comment').append(`
                    <p class="font-14 mb-1 font-gg"><i class="fas text-success mr-1 fa-check-square"></i>
            Đã chọn <span class="text-custom"><a target="top" href="https://facebook.com/${data[i].uid}">${data[i].name}</a></span></p>
                    `)
                }
            }
        },
    }
}