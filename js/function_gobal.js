window.get_all_friend = function () {
    return new Promise((resolve, reject) => {
        $.get("https://graph.facebook.com/v1.0/me/friends?fields=id,name,gender,picture{is_silhouette}&limit=5000&access_token=" + localStorage.touch, function (response) {
            if (response) {
                window.friend = response;
                resolve(true);
            }
        }).fail(function (error) {
            reject(error);
        });
    })
}
window.get_active_friend = function () {
    return new Promise((resolve, reject) => {
        $.get("https://graph.facebook.com/fql", {
            q: "SELECT uid, name, sex, online_presence FROM user WHERE online_presence IN ('active', 'idle') AND uid IN (SELECT uid2 FROM friend WHERE uid1 = me())",
            access_token: localStorage.touch
        }, function (res) {
            if (res) {
                window.friend = res;
                resolve(true);
            }
        }).fail(function (error) {
            reject(error);
        });
    })
}
window.get_name_by_id = async function (id) {
    return new Promise(resolve => {
        url = 'https://graph.facebook.com/v3.2/' + id + '?access_token=' + localStorage.touch + '&debug=all&fields=name&format=json&method=get&pretty=0&suppress_http_code=1&transport=cors';
        $.get(url, (data) => {
            return resolve(data.name);
        })
    })
}
window.renderFriend = async function (target, friend_status) {
    columns = [];
    if (friend_status == 'all-friend') {
        await get_all_friend()
    } else if (friend_status == 'active-friend') {
        await get_active_friend()
    }
    const friend_list = window.friend.data;
    for (i = 0; i < friend_list.length; i++) {
        let output = {};
        output.id = (friend_status == 'all-friend') ? friend_list[i].id : friend_list[i].uid;
        output.name = friend_list[i].name;
        output.gender = (friend_status == 'all-friend') ? friend_list[i].gender : friend_list[i].sex;
        if (friend_status == 'all-friend') {
            columns.push(output);
        } else {
            if (friend_list[i].online_presence == 'active') {
                columns.push(output);
            }
        }
    }
    // console.log(columns);
    await new Promise((resolve) => setTimeout(() => {
        $('.friend-all' + target).html(`<table class="table_friend${target}"></table>`);
        table = $('.table_friend' + target).DataTable({
            data: columns,
            columns: [{
                title: '<input class="check_all font-16" style="margin-left:-8px" type="checkbox">',
                "data": data => `<input class="${target} font-16" value="${data.id}" type="checkbox">`,
            }, {
                title: 'Tên',
                "data": data => `
                <div class="d-flex ${(friend_status == 'active-friend') ? 'avatar-online' : ''}">
                <img class="mr-3" style="width:40px; height:40px; border-radius:50%" src="https://graph.facebook.com/${data.id}/picture?type=small" alt="avatar">
                 <div style="padding:8px 0">
                 <a class="font-14 font-gg" target="top" href="https://www.facebook.com/${data.id}"><span class="text-custom font-gg font-14">${data.name}</span></a>
                 </div>   
                </div>
                `
            }, {
                title: 'Giới tính',
                "data": data => `<span class="font-14 font-gg">${data.gender == 'male' ? 'Nam' : 'Nữ'}</span>`
            }, {
                title: 'ID',
                "data": data => `<span class="font-14 font-gg">${data.id}</span>`
            }],
            responsive: false,
            "paging": true,
            "scrollY": '65vh',
            "sort": false,
            "aLengthMenu": [
                [20, 50, 75, 100, -1],
                ['20 mục', '50 mục', '75 mục', '100 mục', "Tất cả"]
            ],
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
                $("table.dataTable thead tr th").css('white-space', 'nowrap').addClass('font-14 font-gg');
            }
        });
        resolve();
    }, 1000));
    $('#count_friend').html(`(${columns.length})`)
    // var table = $('.table_friend' + target).DataTable();
    window.list_select = [];
    window.list_checked = [];
    // console.log(curentPage)
    function handle() {

        let value = $(this).val();
        console.log(value);
        if ($(this).is(":checked")) {
            window.list_select.push({ uid: value, name: friend_list.find(item => (friend_status == 'active-friend') ? item.uid == value : item.id == value).name });
        } else {
            postion = window.list_select.indexOf($(this).val());
            window.list_select.splice(postion, 1);
        }
        window.list_select.length > 0 ? $('.count_friend').html('(' + window.list_select.length + ')') : $('.count_friend').html('');
        // list_select.length > 0 ? $('.total_friend_filter').html('(' + list_select.length + ')') : $('.total_friend_filter').html('');
        console.log(list_select);
    }

    $(document).off('.handler').on('click.handler', '.' + target, handle);

    $(document).off('.paginate').on('click.paginate', '.paginate_button', function () {
        var curentPage = table.page.info().page;
        postion = list_checked.indexOf(curentPage);
        if (postion >= 0) {
            $('.check_all').prop('checked', true);
        } else {
            $('.check_all').prop('checked', false);
        }
    })

    $(document).off('.check_all').on('click.check_all', '.check_all', function () {
        var listCurrent = table.rows({ page: 'current' }).data();
        var curentPage = table.page.info().page;
        const isCheck = $(this).is(":checked");
        // console.log(listCurrent)

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

        $.each(listCurrent.reverse(), (key, value) => {
            if (isCheck) {
                window.list_select.push({ uid: value.id, name: value.name });
            } else {
                postion = window.list_select.indexOf(value);
                window.list_select.splice(postion, 1);
            }
        });
        console.log(window.list_select);
        window.list_select.length > 0 ? $('.count_friend').html('(' + window.list_select.length + ')') : $('.count_friend').html('');
        // if (list_select.length > 0) notification('Đã chọn tất cả ' + list_select.length + ' bạn bè', 'success');
    })
    window.list_select.length > 0 ? $('.count_friend').html('(' + window.list_select.length + ')') : $('.count_friend').html('');
}
window.get_Information = function () {
    return new Promise((resolve, reject) => {
        $.post('https://www.facebook.com/api/graphql/', { fb_dtsg: localStorage.dt, q: 'node(' + localStorage.id + '){friends{count},subscribers{count},groups{count},created_time}' }, function (response) {
            if (response) {
                console.log(response)
                localStorage.information = response;
                resolve(true);
            }
        }).fail(function (error) {
            reject(error)
        });
    })
}

window.get_all_group = function () {
    return new Promise((resolve, reject) => {
        url = `https://graph.facebook.com/v3.2/${localStorage.id}/groups?access_token=${localStorage.touch}&debug=all&fields=name%2Cid%2Cmember_count%2Cadministrator&format=json&limit=100&method=get&pretty=0&suppress_http_code=1&transport=cors`;
        $.get(url, function (response) {
            if (response) {
                resolve(response);
            }
        }).fail(function (error) {
            reject(error);
            console.log('err', err);

        });
    })
}
window.notification = function (title,content, status) {
    Swal.fire({
        title:title,
        html:content,
        type:status,
    })
}

window.confirm_notification = function (content, success, callback) {
    return Swal.fire({
        title: 'Bạn có chắc chắn?',
        text: content,
        type: 'warning',
        showCancelButton: true,
        cancelButtonText: 'Hủy',
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Đồng ý'
    }).then((result) => {
        if (result.value) {
            callback('dongy');
            if (success) {
                Swal.fire(
                    'Thành công!',
                    success,
                    'success'
                )
            }
        }
    })
}




window.get_new_feed_home = async function (limit) {
    return new Promise(resolve => {
        $url = 'https://graph.facebook.com/v3.2/me/home?access_token=' + localStorage.touch + '&fields=created_time,id,name&debug=all&format=json&limit=' + limit + '&method=get&pretty=0&suppress_http_code=1&transport=cors';
        $.get($url, (response) => {
            if (response) {
                resolve(response);
            }
        }).fail(error => {
            // console.log(error);
        })
    })
}

window.facebookReaction = function (post_Id, type_reaction) {
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
}

// -------trieu---------
window.renderGroup = async function (target) {
    console.log(target);
    let data = await get_all_group();
    let columns = [];
    const group_list = data.data;
    if (data) {
        for (i = 0; i < group_list.length; i++) {
            let output = {};
            output.id = group_list[i].id;
            output.name = group_list[i].name;
            output.member_count = group_list[i].member_count;
            output.administrator = group_list[i].administrator;
            columns.push(output);

            // await new Promise((resolve) => setTimeout(() => {
            $('.group-all' + target).html(`<table class="table_group${target}"></table>`);
            table = $('.table_group' + target).DataTable({
                data: columns,
                columns: [{
                    title: '<input class="check_all font-16" style="margin-left:-8px" type="checkbox">',
                    "data": data => `<input  class="${target} font-16" value="${data.id}" type="checkbox">`,
                }, {
                    title: 'Tên',
                    "data": data => `
                        <div class="d-flex">
                        
                         <div style="padding:8px 0">
                         <a class="font-14 font-gg" target="top" href="https://www.facebook.com/${data.id}"><span class="text-custom font-gg font-14">${data.name}</span></a>
                         </div>   
                        </div>
                        `
                }, {
                    title: 'Thành viên',
                    "data": data => `<span class="font-14 font-gg">${data.member_count}</span>`
                },
                {
                    title: 'Quyền',
                    "data": data => `<span class="font-14 font-gg">${data.administrator == "false" ? "Admin" : "Member"}</span>`
                },
                ],
                responsive: false,
                "paging": true,
                "scrollY": '470px',
                "sort": false,
                "aLengthMenu": [
                    [20, 50, 75, 100, -1],
                    ['20 mục', '50 mục', '75 mục', '100 mục', "Tất cả"]
                ],
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
                    $("table.dataTable thead tr th").css('white-space', 'nowrap').addClass('font-14 font-gg');
                }
            });
            // resolve();
            // }, 1000));

            // var table = $('.table_friend' + target).DataTable();
            window.list_select = [];
            window.list_checked = [];
            // console.log(curentPage)

            $(document).off('click', '.' + target).on('click', '.' + target, function () {
                let value = $(this).val();
                if ($(this).is(":checked")) {
                    window.list_select.push({ uid: value, name: group_list.find(item => item.id == value).name });
                } else {
                    postion = window.list_select.indexOf($(this).val());
                    window.list_select.splice(postion, 1);
                }
                window.list_select.length > 0 ? $('.count_friend').html('(' + window.list_select.length + ')') : $('.count_friend').html('');
                // list_select.length > 0 ? $('.total_friend_filter').html('(' + list_select.length + ')') : $('.total_friend_filter').html('');
                console.log(list_select);
            })

            $(document).off('click', '.paginate_button').on('click', '.paginate_button', function () {
                var curentPage = table.page.info().page;
                postion = list_checked.indexOf(curentPage);
                if (postion >= 0) {
                    $('.check_all').prop('checked', true);
                } else {
                    $('.check_all').prop('checked', false);
                }
            })

            $(document).off('click', '.check_all').on('click', '.check_all', function () {
                var listCurrent = table.rows({ page: 'current' }).data();
                var curentPage = table.page.info().page;
                const isCheck = $(this).is(":checked");
                // console.log(listCurrent)

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

                $.each(listCurrent.reverse(), (key, value) => {
                    if (isCheck) {
                        window.list_select.push({ uid: value.id, name: value.name });
                    } else {
                        postion = window.list_select.indexOf(value);
                        window.list_select.splice(postion, 1);
                    }
                });
                console.log(window.list_select);
                window.list_select.length > 0 ? $('.count_friend').html('(' + window.list_select.length + ')') : $('.count_friend').html('');
                // if (list_select.length > 0) notification('Đã chọn tất cả ' + list_select.length + ' bạn bè', 'success');
            })
            window.list_select.length > 0 ? $('.count_friend').html('(' + window.list_select.length + ')') : $('.count_friend').html('');
        }

    }
}

window.getCoverPhoto = function () {
    return new Promise((resolve, reject) => {
        $.get(`https://graph.facebook.com/v3.2/me/?access_token=${this.localStorage.touch}&fields=cover`, function (response) {
            if (response) {
                localStorage.coverphoto = response.cover? response.cover.source : '';
            }
            resolve(true);
        })
    })
}

window.confirmpolicy = function (success, callback) {
    return Swal.fire({
        title: 'Xác nhận',
        type: 'warning',
        text: "Để tính năng tự động hoạt động và đồng bộ, hệ thống có thể sẽ lưu trữ cookie và token facebook của bạn.",
        showCancelButton: true,
        confirmButtonText: 'Xác nhận',
        showLoaderOnConfirm: true,
        allowOutsideClick: false
    })
        .then((result) => {
            if (result.value) {
                localStorage.confirm = true;
                return true;
            }
        })
}
