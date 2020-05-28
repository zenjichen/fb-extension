var Reaction;
Reaction = function () {
    return {
        init: function () {
            var _this;
            _this = this;
            _this.fetch_table();
            $(document).on('click', '#reaction_stop', function () {
                confirm_notification('Bạn có chắc chắn? Bấm Đồng ý để hủy.', 'Hủy thành công', (callback) => {
                    if (callback) {
                        $('#reaction_start').removeClass('d-none');
                        $('#reaction_stop').addClass('d-none');
                        location.reload();
                    }
                })
            })
            $(document).on('click', '#reaction_start', async function () {
                _this.fetch_table();
                $('#progress').attr('style', 'width:' + 0 + '%');
                $('#progress').text(0 + '%');
                var reaction = [];
                reaction_input = $('input[name="reaction"]');
                time_min = $('#time-reactions-min').val();
                time_max = $('#time-reactions-max').val();
                number_reactions = $('#number_reactions').val();

                $.each(reaction_input, (key, item) => {
                    if (item.checked) {
                        reaction.push(item.value);
                    }
                })
                console.log(reaction);
                if (reaction.length <= 0) {
                    notification('Chọn reaction','', 'error');
                } else {
                    if (+time_min < +time_max) {
                        if (!number_reactions) {
                            notification('Nhập số lượng bài viết','', 'error');
                        } else {
                            if (number_reactions > 50) {
                                notification('Nhập tối đa 50 bài viết','', 'error');
                            } else {
                                $('.loading-reaction').removeClass('d-none');
                                $('.setting-reaction').addClass('d-none');
                                $('#reaction_start').addClass('d-none');
                                $('#reaction_stop').removeClass('d-none');
                                const list_new_feed = JSON.parse(await _this.get_new_feed_home(number_reactions));
                                // console.log(list_new_feed);
                                var count_percent = 0;
                                if (list_new_feed) {
                                    _this.fetch_reaction(list_new_feed, _this.randomReaction(reaction), _this.randomTime(time_min, time_max));
                                }
                            }
                        }
                    } else {
                        notification('Thời gian tối thiểu phải nhỏ hơn thời gian tối đa','', 'error');
                    }

                }
            })
        },
        fetch_reaction: function (list_post, type_reaction, time) {
            var _this;
            _this = this;
            index = 0;
            let total_percent = 0;
            let percent = Math.ceil(100 / list_post.length);

            hander = setInterval(async () => {
                await _this.facebookReaction(list_post[index].id_post, type_reaction);
                total_percent += percent;
                $('.fetch_table_reaction tbody').prepend(
                    `
                <tr>
                <td><img style="width:40px;border-radius:50%; margin-right:10px;" src="https://graph.facebook.com/${list_post[index].id_user}/picture?type=small" alt="avatar">
                <span class="font-14 font-gg text-custom"> ${list_post[index].name}</span>
                </td>
                <td style="padding-left:25px"><a class="font-gg font-14" style="color:#642EFE;" href="https://www.facebook.com/${list_post[index].id_post}" target="top">Xem post</a></td>
            </tr>`)
                $('.dataTables_empty').addClass('d-none');
                $('#progress').attr('style', 'width:' + total_percent + '%');
                $('#progress').text(total_percent + '%');
                index++;

                if (index + 1 > list_post.length) {
                    $('.loading-reaction').addClass('d-none');
                    $('.setting-reaction').removeClass('d-none');
                    $('#reaction_start').removeClass('d-none');
                    $('#reaction_stop').addClass('d-none');
                    notification('Đã xong!','', 'success');
                    clearInterval(hander);
                }
            }, time * 1000);

        },
        randomReaction: function (reaction) {
            return reaction[Math.floor(Math.random() * reaction.length)];
        },
        randomTime: function (min, max) {
            return Math.ceil(Math.random() * (max - min) + min);
        },
        facebookReaction: function (post_Id, type_reaction) {
            $url = "https://www.facebook.com/ufi/reaction/?ft_ent_identifier=" + post_Id + "&story_render_location=feed_mobile&feedback_source=1&is_sponsored=0";
            $.post($url, {
                'reaction_type': type_reaction,
                'ft_ent_identifier': post_Id,
                'm_sess': '',
                'fb_dtsg': localStorage.dt,
                'jazoest': localStorage.jazoest,
                '__user': localStorage.id,
            }, (response) => {
                // console.log(response);
            })
        },
        get_new_feed_home: function (limit) {
            var _this;
            _this = this;
            return new Promise(resolve => {
                $url = 'https://graph.facebook.com/v3.2/me/home?access_token=' + localStorage.touch + '&fields=created_time,id,name&debug=all&format=json&limit=' + limit + '&method=get&pretty=0&suppress_http_code=1&transport=cors';
                $.get($url, (response) => {
                    if (response) {
                        resolve(_this.push_new_feed(response));
                    }
                }).fail(error => {
                    // console.log(error);
                })
            })
        },
        push_new_feed: async function (new_feed) {
            var _this;
            _this = this;
            return new Promise(async resolve => {
                if (new_feed && new_feed.data) {
                    list_new_feed = [];
                    await Promise.all(new_feed.data.map(async (item) => {
                        list_new_feed.push({
                            id_post: item.id.split('_')[1],
                            id_user: item.id.split('_')[0],
                            name: await _this.get_name_by_id(item.id.split('_')[0])
                        });
                    }))
                    localStorage.list_new_feed = JSON.stringify(list_new_feed);
                }
                return resolve(localStorage.list_new_feed);
            })
        },
        get_name_by_id: async function (id) {
            return new Promise(resolve => {
                url = 'https://graph.facebook.com/v3.2/' + id + '?access_token=' + localStorage.touch + '&debug=all&fields=name&format=json&method=get&pretty=0&suppress_http_code=1&transport=cors';
                $.get(url, (data) => {
                    return resolve(data.name);
                })
            })
        },
        fetch_table: function () {
            $('#fetch_table').html('<table class="fetch_table_reaction"></table>')
            setTimeout(() => {
                $('.fetch_table_reaction').DataTable({
                    columns: [{
                        title: 'Tên'
                    }, {
                        title: 'Link post'
                    }],
                    responsive: false,
                    "paging": false,
                    "ordering": false,
                    "searching": false,
                    "scrollY": '570px',
                    "aLengthMenu": [
                        [25, 50, 75, -1],
                        ['25 mục', '50 mục', '75 mục', "Tất cả"]
                    ],
                    "info": false,
                    bSort: true,
                    "language": {
                        "paginate": {
                            "next": ">",
                            "previous": "<",
                        },
                        "emptyTable": "Không có dữ liệu hiển thị",
                        sLengthMenu: "Hiển thị _MENU_",
                        "sSearch": "Tìm kiếm"
                    },
                    initComplete: function (settings, json) {
                        $("table.dataTable thead tr th").addClass('font-14 font-gg');
                        $("table.dataTable tbody tr td").addClass('font-14 font-gg');
                    }
                });
            }, 5);

        }
    }
}