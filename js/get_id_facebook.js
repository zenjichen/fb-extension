async function extract_id_facebook(original_url) {
    // console.log(original_url);
    url = original_url;
    var url_process = url.match(/([a-z]+\:\/+)([^\/\s]*)([a-z0-9\-@\^=%&;\/~\+]*)[\?]?([^ \#]*)#?([^ \#]*)/ig);
    if (url_process) {
        // console.log('test', url_process) /// URL []
        url = url.replace("https\:\/\/", "").replace("http\:\/\/", "").replace("\:\/\/", "");
        url = url.split("\/");
        if (url[0].match(".facebook.com")) {
            if (url[1].split("?")) {
                // console.log('2', url[1].split("?"))
                if (url[1] && url[1] != "") {
                    /////////////////////////////////////////	 
                    var url_array_collect = [];
                    for (temp_var = 1; url[temp_var]; temp_var++) {
                        // console.log("url[" + temp_var + "]=" + url[temp_var].split("\?")[0]);
                        if (url[temp_var].split("\?")[0] && url[temp_var].split("\?")[0] != "") {
                            url_array_collect.push(url[temp_var].split("\?")[0]);
                        }
                    }
                    return await extraction_process_url_params(url_array_collect);
                } else {
                    return await append_html_code('error', null);
                }
            }
        } else {
            return await append_html_code('error', null);
        }
    } else {
        return await append_html_code('error', null);
    }
}



function extract_page_id(page_id) {
    if (!isNaN(page_id)) {
        // console.log("page id=" + page_id);
        title = "Page";
        return append_html_code(title, page_id);
    } else {
        alert("URL is tampered.");
    }
}

function group_post_id_append(post_id) {
    if (!isNaN(post_id)) {
        // console.log("group_post_id=" + post_id);
        title = "Group post id:";
        return append_html_code(title, post_id);
    } else {
        alert("URL is tampered.");
    }
}

async function id_extract_group(account_username) {
    return new Promise(resolve => {
        if (isNaN(account_username)) {
            pageurl = "https://mbasic.facebook.com/groups/" + account_username;
            chrome.runtime.sendMessage({
                url: pageurl,
                type: "get",
            }, function(dinesh) {

                var responsa = dinesh.match(/\/groups\/\d+/g)[0];

                responsa = responsa.replace("\/groups\/", "");
                title = "Group";
                // console.log(title + "=" + responsa);
                return resolve(append_html_code(title, responsa));


            });
        } else {
            title = "Group";
            // console.log(title + "=" + account_username);
            return resolve(append_html_code(title, account_username));
        }
    })
}

async function extraction_process_url_params(url_array_collect) {
    // console.log(url_array_collect);
    if (url_array_collect[2]) {
        if (url_array_collect[2] == "permalink") {
            if (url_array_collect[0] == "groups") {
                if (!isNaN(url_array_collect[3])) {
                    return group_post_id_append(url_array_collect[3]);
                } else {
                    return id_extract_group(url_array_collect[1]);
                }

            }
        }
        if (url_array_collect[0] == "pages") {
            if (!isNaN(url_array_collect[2])) {
                return extract_page_id(url_array_collect[2]);
            }
        }
    } else {
        if (url_array_collect[1]) {
            if (url_array_collect[0] == "groups") {
                return id_extract_group(url_array_collect[1]);
            }
        } else {
            return await id_extract_account(url_array_collect[0]);
        }
    }
}

async function id_extract_account(account_username) {
    return new Promise(resolve => {
        if (isNaN(account_username)) {
            responsa = '';
            pageurl = "https://m.facebook.com/" + account_username + "";
            chrome.runtime.sendMessage({
                url: pageurl,
                type: "get",
            }, async function(dinesh) {
                // console.log(dinesh);
                var responsa = dinesh;
                responsa = responsa.replace(/&quot;/g, '"');
                if (responsa.match(/"profile_id":\d+/g)) {
                    var last_array = (responce_id = responsa.match(/"profile_id":\d+/g).length - 1);
                    var responce_id = responsa.match(/"profile_id":\d+/g)[last_array];
                    responce_id = responce_id.replace('"profile_id":', "");
                    if (!isNaN(responce_id)) {
                        title = "Account ID:";
                        // console.log(title + "=" + responce_id);
                        return resolve(append_html_code(title, responce_id));

                    } else {
                        console.log('error');
                    }
                } else
                if (responsa.match(/page_id:\"\d+/g)) {
                    var last_array = responsa.match(/page_id:\"\d+/g)[0];
                    // console.log(last_array);
                    responce_id = last_array.replace('page_id:\"', "");
                    if (!isNaN(responce_id)) {
                        title = "Page";
                        // console.log(title + "=" + responce_id);
                        return resolve(append_html_code(title, responce_id));
                    } else {
                        console.log('error');
                    }
                }

            })
        } else {
            alert("account id is:" + responsa.id);
            //document.getElementById("fst789_id_extractor_result").innerText = account_username;
        }
    })

}

async function append_html_code(type, data) {
    if (type == 'Page') {
        return data;
    } else if (type = 'Group') {
        return data;
    } else {
        return false;
    }
}