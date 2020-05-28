var FriendDeactivated;
FriendDeactivated = function () {
    return {
        init: async function () {
            let _this;
            _this = this;
            $('#start_unfriend').prop('disabled', true);
            let a = await this.getInitial();
            if (!window.friend) { await get_all_friend() };
            let list_friend = window.friend;
            if (list_friend) {
                c = [];
                c = list_friend.data.map(function (e) {
                    return e.id;
                })
                window.friend_deactivated = a.filter(function (e) {
                    return !c.includes(e);
                });
                _this.fetch_table(friend_deactivated);
                // console.log(n);
            }

            $(document).on('click', '#start_unfriend', function () {
                if (friend_deactivated.length > 0) {
                    confirm_notification(null, null, function (ok) {
                        if (ok) {
                            $('#start_unfriend').addClass('d-none');
                            $('#stop_unfriend').removeClass('d-none');
                            $('.loading').removeClass('d-none');
                            _this.runUnfriend(friend_deactivated);
                        }
                    })
                } else {
                    notification('Không có bạn bè nào ngưng kích hoạt','', 'error');
                }
            })

            $(document).on('click', '#stop_unfriend', function () {
                location.reload();
            })

        },
        unfriend: function (uid) {
            let table = $('.fetch_table').DataTable();
            return new Promise(resolve => {
                url = 'https://www.facebook.com/ajax/profile/removefriendconfirm.php?dpr=1';

                $.post(url, { uid: 1, __a: 1, fb_dtsg: localStorage.dt }).then(
                    a => {
                        if (a) {
                            table.rows('#' + uid).remove().draw();
                            $('.kq').prepend(`
                                <p class="font-14 mb-1 font-gg"><i
                                class="fas text-success mr-1 fa-check-square"></i>
                                Đã xóa bạn bè <span class="text-custom"><a target="top"
                                href="https://facebook.com/${uid}">${uid}</a></span></p>
                                `)
                        } else {
                            table.rows('#' + uid).remove().draw();
                            $('.kq').prepend(`<p class="font-14 mb-1 font-gg"><i
                                 class="fas text-danger fa-times-circle mr-1"></i>
                                 Xóa thất bại <span class="text-custom"><a target="top"
                                 href="https://facebook.com/${uid}">${uid}</a></span></p>
                                 <p class="font-14 mb-1 font-gg"><i`)
                        }
                        resolve(a);
                    })
            })
        },
        runUnfriend: function (list_friend) {
            index = 0;
            hander = setInterval(async () => {
                await this.unfriend(list_friend[index]);
                index++;
                if (index + 1 > list_friend.length) {
                    clearInterval(hander);
                    await notification('Đã xóa xong ' + list_friend.length + ' bạn bè','', 'success');
                    $('#stop_unfriend').addClass('d-none');
                    $('.count_friend').html('');
                }
            }, 1500);
        },
        getInitial: function () {
            return new Promise((resolve, reject) => {
                $.get(`https://www.facebook.com/${localStorage.id}`).then(function (e) {
                    var t = e.match(/,list:\[([^\]]+)/);
                    // console.log(t);
                    var a = [];
                    t = "[".concat(t[1], "]");
                    a = (t = JSON.parse(t)).map(function (e) {
                        return e.split("-")[0]
                    })
                    resolve(a);
                }).catch(function (e) {
                    reject(e);
                })
            })
        },
        fetch_table: function (columns) {
            var _this;
            _this = this;
            $('#fetch_table').html('<table class="fetch_table"></table>')
            setTimeout(() => {
                $('.fetch_table').DataTable({
                    data: columns,
                    drawCallback: function (settings) {
                        $("table.dataTable thead tr th:nth-child(3)").addClass('text-center');
                        $("table.dataTable tbody tr td:nth-child(3)").addClass('text-center').css('padding', '5px');
                    },
                    columns: [{
                        title: 'ID',
                        'data': data => `<span class="font-gg text-custom text-center font-14">${data}</span>`,
                    }, {
                        title: 'Tên',
                        'data': data => `<span class="font-gg font-14">Facebook User</span>`
                    },
                    {
                        title: 'Hành động',
                        'data': data => `<span><button value='${data}' class="action btn  d-block m-auto"><i class="fas btn text-danger fa-trash"></i></button></span>`
                    }],
                    "fnCreatedRow": function (nRow, columns, iDataIndex) {
                        $(nRow).attr('id', columns);
                    },
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
                        // $("table.dataTable tbody tr td").addClass('text-center');
                    }
                });
            }, 5);
            notification(columns.length > 0 ? `Tìm thấy ${columns.length} bạn bè đã bị khóa hoặc ngưng kích hoạt` : 'Không thể tìm thấy bạn bè nào đã hủy kích hoạt.','', 'success');
            $('.count_friend').html(columns.length > 0 ? `(${columns.length})` : '');
            $('#start_unfriend').prop('disabled', false);

            $(document).on('click', '.action', function () {
                let value = $(this).val();
                confirm_notification('Bạn có chắc chắn xóa', null, async function (ok) {
                    if (ok) {
                        await _this.unfriend(value);
                        notification('Đã xóa thành công','', 'success');
                    }
                })
            })
        }
    }


}