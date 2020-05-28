chrome.tabs.onUpdated.addListener(function() {
    if (!sessionStorage.openComment) {
        sessionStorage.openComment = true;
        if (localStorage.auto_comment) {
            if (JSON.parse(localStorage.auto_comment) == true) {
                init_Comment();
            }
        }
    }
})

chrome.runtime.onMessage.addListener(
    async function(request, sender, sendResponse) {
        if (request.Comment == 'active') {
            console.log('active');
            localStorage.time_max_comment = request.time_max_comment;
            localStorage.time_min_comment = request.time_min_comment;
            localStorage.message = request.message;
            localStorage.activeComment = request.Comment;
            localStorage.listFriend = JSON.stringify(request.listFriend);
            init_Comment();
            return true;
        }
        if (request.Comment == 'disabled') {
            console.log('disabled');
            if (typeof handler !== 'undefined') {
                clearInterval(handler);
            }
            return true;
        }
        return true;
    });
//////////////////
init_Comment = async function() {
    console.log("ok");
    let limit = 10;
    let list_feed = await get_new_feed_home(limit);
    if (list_feed && localStorage.activeComment == 'active') {
        runComment(list_feed, localStorage.time_min_comment, localStorage.time_max_comment, localStorage.message, localStorage.listFriend);
    }
}

runComment = async function(new_feed, time_min, time_max, message, listFriend) {
    let status_friend = JSON.parse(listFriend)
        // console.log(status_friend);
    let list_new_feed = [];
    await new_feed.data.map((item) => {
        list_new_feed.push({
            id_post: item.id.split('_')[1],
            id_user: item.id.split('_')[0],
        });
    })
    console.log(list_new_feed);

    if (status_friend == 'allFriend') {
        Comment_aaa(list_new_feed, +time_min, +time_max, message);
    } else {
        let filtered = [];
        await list_new_feed.filter(function(newData) {
            return status_friend.filter(function(oldData) {
                if (newData.id_user === oldData.uid) {
                    // console.log('bangwsf-nhau', newData.id_user, oldData.uid);
                    filtered.push({
                        'id_post': newData.id_post,
                        'id_user': newData.id_user,
                    })
                }
            })
        });
        console.log(filtered);
        if (filtered != '') {
            Comment_aaa(filtered, +time_min, +time_max, message);
        } else {
            setTimeout(function() {
                init_Comment()
            }, 30000);
        }
    }
}

Comment_aaa = function(list_new_feed, time_min, time_max, message) {
    console.log(list_new_feed, time_min, time_max, message);
    index = 0;
    window.handler = setInterval(async function() {
        let name_popup = await get_name_by_id(list_new_feed[index].id_user)
        chrome.tabs.query({ active: true, currentWindow: true }, async function(tabs) {
            if (localStorage.tempComment) {
                let tem = JSON.parse(localStorage.tempComment)
                let check = tem.find(x => x.id_post == list_new_feed[index].id_post)
                console.log(check)
                if (!check) {
                    facebookComment(list_new_feed[index].id_post, message);
                    if (tabs[0]) {
                        chrome.tabs.sendMessage(tabs[0].id, {
                            notification: 'notification',
                            uid: list_new_feed[index].id_post,
                            name: name_popup,
                        }, function(response) {});
                    }
                }
            } else {
                facebookComment(list_new_feed[index].id_post, message);
                if (tabs[0]) {
                    chrome.tabs.sendMessage(tabs[0].id, {
                        notification: 'notification',
                        uid: list_new_feed[index].id_post,
                        name: name_popup,
                    }, function(response) {});
                }
            }
            index++;
            if (index + 1 > list_new_feed.length) {
                console.log('chay lai');
                localStorage.tempComment = JSON.stringify(list_new_feed);
                clearInterval(handler);
                init_Comment();
            }
        });
    }, randomTime(+time_min, +time_max) * 1000);
}
facebookComment = function(id_post_comment, message) {
    console.log(id_post_comment, message);
    var q = `fs=8&actionsource=2&comment_logging=&ft_ent_identifier=${id_post_comment}&eav=AfYgYtmZEhjsAspIlopn53gWESdFiWj7pkAjIwiFbQsjWhf4XgvHsZzksfYTPT-0pos&av=${localStorage.id}&gfid=AQCz9eNJGrrNQwWu`
        // $.post(`https://mbasic.facebook.com/a/comment.php?` + q, {
        //     fb_dtsg: localStorage.dt,
        //     jazoest: 22234,
        //     comment_text: message,
        // }, function(res) {
        //     // console.log(res);
        // })
}
randomTime_comment = function(min, max) {
    return Math.ceil(Math.random() * (max - min) + min);
}