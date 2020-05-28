//Check code đang chạy
chrome.tabs.onUpdated.addListener(function () {
    if (!sessionStorage.open) {
        sessionStorage.open = true;
        if (localStorage.auto_reaction) {
            if (JSON.parse(localStorage.auto_reaction) == true) {
                init_reaction();
            }
        }
    }
})

chrome.runtime.onMessage.addListener(async function (request, sender, sendResponse) {
    if (request.reactions == 'active') {
        localStorage.time_min = request.time_min ? request.time_min : 15;
        localStorage.time_max = request.time_max ? request.time_max : 30;
        localStorage.reaction_type = request.reaction_type ? JSON.stringify(request.reaction_type) : JSON.stringify(["1"]);
        localStorage.temp = '';
        init_reaction();
        return true;
    }
    if (request.reactions == 'disabled') {
        localStorage.temp = '';
        if (typeof handler !== 'undefined') {
            clearInterval(handler);
        }
        return true;
    }
    return true;
});

init_reaction = async function () {
    let limit = 15;
    let list_feed = await get_new_feed_home(limit);
    if (list_feed) {
        // console.log(localStorage.reaction_type);
        runReactions(list_feed, localStorage.time_min, localStorage.time_max, localStorage.reaction_type);
    }
}

runReactions = async function (new_feed, time_min, time_max, reaction_type) {
    window.list_new_feed = [];
    await Promise.all(new_feed.data.map(async (item) => {
        list_new_feed.push({
            id_post: item.id.split('_')[1],
            id_user: item.id.split('_')[0],
            name: await get_name_by_id(item.id.split('_')[0]),
        });
    }))
    reactions(list_new_feed, time_min, time_max, reaction_type);
}

reactions = function (list_new_feed, time_min, time_max, reaction_type) {
    index = 0;
    // console.log(list_new_feed);
    window.handler = setInterval(async function () {
        chrome.tabs.query({ active: true, currentWindow: true }, async function (tabs) {
            if (localStorage.temp) {
                let temp = JSON.parse(localStorage.temp);
                let check = temp.find(x => x.id_post == list_new_feed[index].id_post);
                // console.log(check)
                if (!check) {
                    await facebookReaction(list_new_feed[index].id_post, randomReaction(JSON.parse(reaction_type)));
                    if (tabs[0]) {
                        chrome.tabs.sendMessage(tabs[0].id, {
                            notification: 'notification',
                            uid: list_new_feed[index].id_post,
                            uid_user: list_new_feed[index].id_user,
                            name: list_new_feed[index].name,
                        }, function (response) { });
                    }
                }
            } else {
                await facebookReaction(list_new_feed[index].id_post, randomReaction(JSON.parse(reaction_type)));
                if (tabs[0]) {
                    chrome.tabs.sendMessage(tabs[0].id, {
                        notification: 'notification',
                        uid: list_new_feed[index].id_post,
                        uid_user: list_new_feed[index].id_user,
                        name: list_new_feed[index].name,
                    }, function (response) { });
                }
            }

            // console.log(list_new_feed[index].name, 'thứ ' + index + ' raction ' + randomReaction(JSON.parse(reaction_type)) + ' time ' + randomTime(+time_min, +time_max) * 1000);
            index++;
            if (index + 1 > list_new_feed.length) {
                localStorage.temp = JSON.stringify(list_new_feed);
                clearInterval(handler);
                init_reaction();
            }
        });
    }, randomTime(+time_min, +time_max) * 1000);

}



randomReaction = function (reaction) {
    // console.log(reaction);
    return reaction[Math.floor(Math.random() * reaction.length)];
}

randomTime = function (min, max) {
    return Math.ceil(Math.random() * (max - min) + min);
}