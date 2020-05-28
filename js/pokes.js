var Pokes;

Pokes = function () {
    return {
        init: function () {
            var _this;
            _this = this;
            var friend_poke = 'all-friend';
            $('#friend-status').on('change', function () {
                var value = $(this).val();
                friend_poke = value
                $('.friend-allpokes').html('<span style="margin:10px 0; width: 40px; height: 40px;" class="spinner-border text-white m-auto d-block spinner-border-sm" role="status" aria-hidden="true"></span>')
                renderFriend('pokes', value);

            });
            renderFriend('pokes', 'all-friend');
            $(document).on('click', '#start_pokes', function () {
                list_friend = window.list_select;
                console.log(window);
                const time_min = $('#pokes-time-min').val();
                const time_max = $('#pokes-time-max').val();

                if (+time_max > +time_min) {
                    if (list_friend && list_friend.length > 0) {
                        confirm_notification('Chọc ' + list_friend.length + ' bạn bè đã chọn!', null, (callback) => {
                            if (callback) {
                                if (list_friend && list_friend.length > 0) {
                                    $('.setting_poke').addClass('d-none');
                                    $('.loading_poke').removeClass('d-none');
                                    _this.fetchPokes(list_friend, _this.randomTimeMinMax(+time_min, +time_max), 'pokes ', friend_poke);
                                }
                            }
                        });
                    } else {
                        notification('Chọn bạn bè để chọc','', 'error');
                    }
                } else {
                    notification('Thời gian tối thiểu phải nhỏ hơn thời gian tối đa','', 'error');
                }

            })

            $(document).on('click', '#stop_pokes', function () {
                confirm_notification('Bạn chắc chắn muốn hủy chọc bạn bè!', 'Hủy thành công', (callback) => {
                    if (callback) {
                        location.reload();
                    }
                });
            })
        },
        fetchPokes: function (list_friend, time, target, status_friend) {
            console.log(list_friend, time, target, status_friend);
            index = 0;
            hander = setInterval(() => {
                this.pokes(list_friend[index].uid, list_friend[index].name);
                index++;
                if (index + 1 > list_friend.length) {
                    clearInterval(hander);
                    notification('Đã chọc ' + list_friend.length + ' bạn bè','', 'success');
                    renderFriend(target, status_friend);
                    $('.friend-allpokes').html('<span style="margin:10px 0; width: 40px; height: 40px;" class="spinner-border text-white m-auto d-block spinner-border-sm" role="status" aria-hidden="true"></span>')
                    $('.setting_poke').removeClass('d-none');
                    $('.loading_poke').addClass('d-none');
                    $('.kq-poke').html('');
                }

            }, time * 1000);
        },
        randomTimeMinMax: function (min, max) {
            return Math.ceil(Math.random() * (max - min) + min);
        },
        pokes: function (id_poker, name) {
            poke = '__user=' + localStorage.id + '&__a=1&__csr&__req=p&__beoa=0&__pc=PHASED:DEFAULT&dpr=1.25&__rev=' + localStorage.__rev + '&__s=58dqp8:5o897q:cj18eb&__hsi=6807305149298860779-0&__comet_req=0&fb_dtsg=' + localStorage.dt + '&jazoest=' + localStorage.jazoest + '&__spin_r=' + localStorage.__rev + '&__spin_b=trunk';
            fetch('https://www.facebook.com/pokes/dialog/?poke_target=' + id_poker, {
                method: "POST",
                headers: {
                    'Accept': 'application/json, application/xml, text/plain, text/html, *.*',
                    'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8'
                },
                body: poke
            }).then(e => {
                $('.kq-poke').prepend(`
                <p class="font-14 mb-1 font-gg"><i
                class="fas text-success mr-1 fa-check-square"></i>
            Đã chọc <span class="text-custom"><a target="top"
                    href="https://facebook.com/${id_poker}">${name}</a></span></p>
                `)
            })
        }
    }
}