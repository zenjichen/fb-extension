var filterFriend;
filterFriend = function () {
    return {
        init: function () {
            var _this;
            _this = this;
            _this.fetchFriend();
            $('#start_filter,#start_unfriend').prop('disabled', true);
            $(document).on('click', '#start_filter', async function () {
                // let time = moment().subtract(30, 'days').unix();
                window.list_select = [];
                // console.log('start', window.list_select);
                var is_not_reaction = $('#is_not_reaction')[0].checked;
                var is_not_avatar = $('#is_not_avatar')[0].checked;
                // var total_friend = $('#total_friend').val();
                if (is_not_reaction || is_not_avatar) {
                    _this.postTable_filter(is_not_reaction, is_not_avatar);
                } else {
                    notification('Chọn loại bạn bè muốn lọc','', 'error');
                }
                // console.log(is_not_reaction);
            })
            $(document).on('click', '#start_unfriend', function () {
                let list_unfirend = window.list_select;

                if (list_unfirend && list_unfirend.length > 0) {
                    confirm_notification('Bạn có chắc chắn muốn xóa những bạn bè đã chọn.', null, (callback) => {
                        if (callback) {
                            _this.action_unfriend(list_unfirend);
                        }
                    });

                } else {
                    notification('Chọn bạn bè để xóa','', 'error');
                }
            })

            $(document).on('click', '#stop_unfriend', function () {
                location.reload();
            })
        },
        render_table_fillter_friend: async function (isFetch) {
            data = window.friendData;
            if (data) {
                let list_friend = data;
                var columns = [];
                Object.keys(list_friend).map(function (e) {
                    let output = {};
                    output.uid = list_friend[e].uid;
                    output.name = list_friend[e].name;
                    output.reaction = list_friend[e].reaction;
                    output.comment = list_friend[e].comment;
                    output.message = list_friend[e].message;
                    output.lastComment = list_friend[e].lastComment;
                    output.lastReaction = list_friend[e].lastReaction;
                    output.lastMessage = list_friend[e].lastMessage;
                    let lastTime = Math.max.apply(Math, [list_friend[e].lastComment, list_friend[e].lastReaction, list_friend[e].lastMessage]);
                    output.lastTime = lastTime ? 'Tương tác cuối cùng: ' + moment(lastTime).format("DD-MM-YYYY hh:mm a") : 'Không tương tác';


                    if (isFetch == 'is_not_reaction' && (list_friend[e].reaction + list_friend[e].comment + list_friend[e].message == 0)) {
                        columns.push(output);
                        // console.log(isFetch);
                    } else if (isFetch == 'is_not_avatar' && list_friend[e].isAvatar == true) {
                        columns.push(output);
                        // console.log(output);
                        // console.log(isFetch);
                    } else if (isFetch == 'all' && ((list_friend[e].reaction + list_friend[e].comment + list_friend[e].message == 0) || list_friend[e].isAvatar == true)) {
                        columns.push(output);
                        // console.log(isFetch);
                    } else if (isFetch == 'default') {
                        columns.push(output);
                    }
                })
                setTimeout(() => {
                    $('#render_table').html('<table id="friend_filter"></table>');
                    table = $('#friend_filter').DataTable(
                        {
                            data: columns,
                            columns: [
                                {
                                    title: `<input  class="check_all_filter${isFetch} font-16" style="margin-left:-8px" type="checkbox">`,
                                    "data": data => `<input  class="${data.uid} ${isFetch} font-16" value="${data.uid}" type="checkbox">`,
                                },
                                {
                                    title: 'Tên',
                                    "data": data => `
                                <div class="d-flex">
                                <img class="mr-3" style="width:40px; height:40px; border-radius:50%" src="https://graph.facebook.com/${data.uid}/picture?type=small" alt="avatar">
                                 <div>
                                 <a class="font-14 font-gg" target="top" href="https://www.facebook.com/${data.uid}"><span class="text-custom font-gg font-14">${data.name}</span></a>
                                 <p class="font-gg time_before mb-0">${data.lastTime}</p>
                                 </div>   
                                </div>
                               
                                `
                                },
                                {
                                    title: 'Tin nhắn',
                                    "data": data => `<span class="font-gg font-14">${data.message}</span>
                                `
                                },
                                {
                                    title: 'Reaction',
                                    "data": data => `<span class="font-gg font-14">${data.reaction}</span>`
                                },
                                {
                                    title: 'Bình luận',
                                    "data": data => `<span class="font-gg font-14">${data.comment}</span>`
                                },
                            ],
                            "fnCreatedRow": function (nRow, columns, iDataIndex) {
                                $(nRow).attr('id', columns.uid);
                            },
                            'responsive': false,
                            "paging": true,
                            "scrollY": '65vh',
                            'select': true,
                            "sort": true,
                            "order": [[2, "desc"]],
                            "columnDefs": [{
                                "targets": [0], "searchable": false, "orderable": false, "visible": true
                            }],
                            "aLengthMenu": [[20, 50, 75, 100, -1], ['20 mục', '50 mục', '75 mục', '100 mục', "Tất cả"]],
                            "info": false,
                            "language": {
                                "paginate": {
                                    "next": ">",
                                    "previous": "<"
                                },
                                sLengthMenu: "Hiển thị _MENU_",
                                "sSearch": "Tìm kiếm"
                            },
                            initComplete: function (settings, json) {
                                $("table.dataTable thead tr th").css('white-space', 'nowrap').addClass('font-gg font-14');
                                $("table.dataTable thead tr th:nth-child(1)").addClass('sort-d');
                            }
                        }
                    )
                    $('#total_filter').html(`(${columns.length})`)
                }, 500);
                $('#start_filter,#start_unfriend').prop('disabled', false);

                //////////// Click ///////////

                window.list_select = [];
                list_checked = [];
                // console.log(curentPage)

                $(document).off('click', '.paginate_button').on('click', '.paginate_button', function () {
                    var curentPage = table.page.info().page;
                    postion = list_checked.indexOf(curentPage);
                    if (postion >= 0) {
                        $('.check_all_filter').prop('checked', true);
                    } else {
                        $('.check_all_filter').prop('checked', false);
                    }
                })

                $(document).off('click', '.' + isFetch).on('click', '.' + isFetch, function () {
                    let value = $(this).val();
                    if ($(this).is(":checked")) {
                        window.list_select.push({ uid: value, name: friendData[value].name });
                    } else {
                        postion = window.list_select.indexOf($(this).val());
                        window.list_select.splice(postion, 1);
                    }
                    window.list_select.length > 0 ? $('.total_friend_filter').html('(' + window.list_select.length + ')') : $('.total_friend_filter').html('');
                    console.log(window.list_select);
                })

                $(document).off('click', '.check_all_filter' + isFetch).on('click', '.check_all_filter' + isFetch, function () {
                    var listCurrent = table.rows({ page: 'current' }).data();
                    var curentPage = table.page.info().page;
                    const isCheck = $(this).is(":checked");

                    if (isCheck) {
                        table.rows({ page: 'current' }).select();
                        $('tbody tr td input').prop('checked', true);
                        list_checked.push(curentPage);
                        // console.log(list_checked)
                    } else {
                        $('tbody tr td input').prop('checked', false);
                        table.rows({ page: 'current' }).deselect();
                        postion = list_checked.indexOf(curentPage);
                        list_checked.splice(postion, 1);
                    }
                    $.each(listCurrent, (key, value) => {
                        if (isCheck) {
                            window.list_select.push({ uid: value.uid, name: value.name });
                        } else {
                            postion = window.list_select.indexOf(value);
                            window.list_select.splice(postion, 1);
                        }
                    });
                    // console.log('end', window.list_select);
                    window.list_select.length > 0 ? $('.total_friend_filter').html('(' + window.list_select.length + ')') : $('.total_friend_filter').html('');
                })
            }
            window.list_select.length > 0 ? $('.total_friend_filter').html('(' + window.list_select.length + ')') : $('.total_friend_filter').html('');
        },
        postTable_filter: function (is_not_reaction, is_not_avatar) {
            $('#render_table').html(`<span style="margin:10px 0; width: 40px; height: 40px;"
            class="spinner-border text-white m-auto d-block spinner-border-sm"
            role="status" aria-hidden="true"></span>
            <h5 class="font-gg text-center mt-4 font-16">Đang tải dữ liệu...</h5>
            <p class="font-12 text-center font-gg">Vui lòng chờ, có thể lâu nếu bạn bè trên 1000</p>
            `);
            data = window.friendData;
            var isFetch = '';
            if (is_not_reaction && !is_not_avatar) {
                isFetch = 'is_not_reaction';
            } else if (!is_not_reaction && is_not_avatar) {
                isFetch = 'is_not_avatar';
            } else {
                isFetch = 'all';
            }
            this.render_table_fillter_friend(isFetch);
        },
        buildFeed: function (after) {
            var _this;
            _this = this;
            q = "node(".concat(localStorage.id, "){timeline_feed_units.first(").concat(500, ").after(").concat(after, "){page_info,edges{node{id,creation_time,feedback{reactors{nodes{id}},commenters{nodes{id}}}}}}}");
            $.post('https://www.facebook.com/api/graphql/', { 'fb_dtsg': localStorage.dt, 'q': q }).then(data => {
                _this.spreadData(JSON.parse(data));
            })
        },
        getCountForInbox: function () {
            q = "viewer(){message_threads{nodes{thread_key{thread_fbid,other_user_id},messages_count,thread_type,updated_time_precise}}}";
            $.post('https://www.facebook.com/api/graphql/', { 'fb_dtsg': localStorage.dt, 'q': q }).then(e => {
                if (e) {
                    let data = JSON.parse(e);
                    data.viewer.message_threads.nodes.forEach(function (data) {
                        if ("ONE_TO_ONE" === data.thread_type) {
                            var t = data.thread_key.other_user_id;
                            friendData[t] && (friendData[t].message = data.messages_count, friendData[t].lastMessage = 1 * data.updated_time_precise)
                        }
                    }), this.render_table_fillter_friend('default');
                }
            });
        },
        spreadData: function (e) {
            var t = e[localStorage.id];
            t && t.timeline_feed_units && t.timeline_feed_units.edges && t.timeline_feed_units.edges.forEach(function (e) {
                e.node && e.node.feedback && e.node.feedback.reactors && e.node.feedback.reactors.nodes && e.node.feedback.reactors.nodes.forEach(function (t) {
                    t.id && friendData[t.id] && (friendData[t.id].reaction++, e.node.creation_time > friendData[t.id].lastReaction && (friendData[t.id].lastReaction = 1e3 * e.node.creation_time))
                }), e.node && e.node.feedback && e.node.feedback.commenters && e.node.feedback.commenters.nodes && e.node.feedback.commenters.nodes.forEach(function (t) {
                    t.id && friendData[t.id] && (friendData[t.id].comment++, e.node.creation_time > friendData[t.id].lastComment && (friendData[t.id].lastComment = 1e3 * e.node.creation_time))
                })
            }), t && t.timeline_feed_units && t.timeline_feed_units.page_info && t.timeline_feed_units.page_info.has_next_page ? this.buildFeed(t.timeline_feed_units.page_info.end_cursor) : this.getCountForInbox();
        },
        fetchFriend: async function () {
            window.friendData = [];
            // console.log(window.friend);
            if (!window.friend) { await get_all_friend() };
            let list_friend = window.friend;
            list_friend.data.forEach(function (e) {
                friendData[e.id] = {
                    uid: e.id,
                    name: e.name,
                    reaction: 0,
                    comment: 0,
                    message: 0,
                    isAvatar: e.picture.data.is_silhouette,
                    lastComment: null,
                    lastReaction: null,
                    lastMessage: null,
                }
            }), this.buildFeed('');
        },
        unfriend: function (uid, name) {
            let table = $('#friend_filter').DataTable();
            return new Promise(resolve => {
                url = 'https://www.facebook.com/ajax/profile/removefriendconfirm.php?dpr=1';

                $.post(url, { uid: uid, __a: 1, fb_dtsg: localStorage.dt }).then(
                    a => {
                        if (a) {
                            table.rows('#' + uid).remove().draw();
                            $('.kq').prepend(`
                                <p class="font-14 mb-1 font-gg"><i
                                class="fas text-success mr-1 fa-check-square"></i>
                                Đã xóa bạn bè <span class="text-custom"><a target="top"
                                href="https://facebook.com/${uid}">${name}</a></span></p>
                                `)
                        } else {
                            table.rows('#' + uid).remove().draw();
                            $('.kq').prepend(`<p class="font-14 mb-1 font-gg"><i
                                 class="fas text-danger fa-times-circle mr-1"></i>
                                 Xóa thất bại <span class="text-custom"><a target="top"
                                 href="https://facebook.com/${uid}">${name}</a></span></p>
                                 <p class="font-14 mb-1 font-gg"><i`)
                        }
                        resolve(a);
                    })
            })
        },
        runUnfriend: function (list_friend) {
            index = 0;
            hander = setInterval(async () => {
                await this.unfriend(list_friend[index].uid, list_friend[index].name);
                index++;
                if (index + 1 > list_friend.length) {
                    clearInterval(hander);
                    await notification('Đã xóa xong ' + list_friend.length + ' bạn bè','', 'success');
                    $('.option_filter_friend').removeClass('d-none');
                    $('.loading-unfriend').addClass('d-none');
                    $('#start_unfriend').removeClass('d-none');
                    $('#stop_unfriend').addClass('d-none');
                }
            }, 2000);
        },
        action_unfriend: function (list_friend) {
            if (list_friend && list_friend.length > 0) {
                $('#start_unfriend').addClass('d-none');
                $('#stop_unfriend').removeClass('d-none');
                $('.option_filter_friend').addClass('d-none');
                $('.loading-unfriend').removeClass('d-none');
                this.runUnfriend(list_friend);
            }
        }
    }

}