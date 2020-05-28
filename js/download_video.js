var downloadVideo;
downloadVideo = function () {
    var vd = {};
    vd.tabsData = {}, vd.linksToBeDownloaded = {}, vd.videoFormats = {
        mp4: {
            type: "mp4"
        },
        flv: {
            type: "flv"
        },
        mov: {
            type: "mov"
        },
        webm: {
            type: "webm"
        }
    }
    vd.sendMessage = function (a, b) {
        chrome.runtime.sendMessage(a, b)
    }
    function showLoadingBtnState(a) {
        a.style.width = a.offsetWidth + "px", a.textContent = "Loading..."
    }
    function handleDownloadButton(a) {
        a.preventDefault();
        const b = a.target.textContent;
        showLoadingBtnState(a.target)
        var downloading = chrome.runtime.onMessage(
            chrome.downloads.download({
                url: $(this).attr("href"),
                fileName: $(this).attr("data-file-name"),
                saveAs: true
            })
        )
        downloading.then(console.log('ss'))
    }













    // $("body").on("click", ".download-button", handleDownloadButton)

    return {
        init: async function () {
            var _this = this;
            $(document).on('click', '#start_downvideo', async function () {
                let val_invideo = $('#ip-dlvideo').val();

                if (!val_invideo) {
                    notification('Cần liên kết Video để thực hiện thao tác này', '', 'error')
                }

                else {
                    let a = await confirmpolicy();
                    if (a) {
                        $('.setting_poke').addClass('d-none');
                        $('.loading_poke').removeClass('d-none');
                        _this.fetchLeaveGroup(val_invideo, 'download_video');


                    }
                }
            });


            $(document).on('click', '#stop_leavegroup', function () {
                confirm_notification('Bạn chắc chắn muốn hủy bỏ thao tác này!', 'Hủy thành công', (callback) => {
                    if (callback) {
                        location.reload();
                    }
                });
            })


        },
        fetchLeaveGroup: function (id_pokes, target) {
            this.leavegroup();
        },
        progressTime: function (total, value) {
            $('.progress-pokes').show();
            $('#value_progress').html('Đã poke ' + '<span class="text-primary">' + value + '/' + total + '</span>' + ' bạn bè');
        },

        leavegroup: function () {
            let val_invideo = $('#ip-dlvideo').val();
            // val_invideo=val_invideo.replace("https\:\/\/","").replace("http\:\/\/","").replace("\:\/\/","");            
            $.post(`https://www.apppost.net/fbdowload.php?url=` + val_invideo).then(
                data => {
                    data = JSON.parse(data)
                    if (data.hd_src_no_ratelimit == "") {
                        notification('Liên kết có vẻ không đúng.Hãy thử lại!','', 'error')
                        setTimeout(() => {
                            location.reload()
                        }, 850);
                    }
                    else {
                        $('.group-btn-pokes').prepend(`<a id="downngay" target="_blank" href="${data.hd_src_no_ratelimit}" class="download-button btn btn-success shadow-none font-14 font-gg" data-file-name="" >                    
                    Lưu về máy</a>`)
                        notification('Đã Quét hoàn tất video','', 'success')
                        $('.progress-pokes').addClass('d-none')
                        $('.kq-poke').prepend(`
                       <p class="font-14 mb-1 font-gg"><i
                       class="fas text-success mr-1 fa-check-square"></i>
                       Đã Quét hoàn tất video theo <span class="text-custom"><a href=""></a>URL</span> video của bạn</p>
                       `)
                    }
                }
            )
        }

    }

    function notifications(content, status) {
        Swal.fire({
            // title: content,
            text: content,
            type: 'success',
            showCancelButton: false,
            showConfirmButton: false,
            width: '450px',
            height: '227px',


            // cancelButtonText: 'Hủy',
            // confirmButtonColor: '#3085d6',
            // cancelButtonColor: '#d33',
            // confirmButtonText: 'Đồng ý'
        })
    }

}




// https://video-iad3-1.xx.fbcdn.net/v/t39.24130-2/10000000_786669805195662_9035416126297157519_n.mp4?_nc_cat=102&_nc_sid=985c63&efg=eyJ2ZW5jb2RlX3RhZyI6Im9lcF9oZCJ9&_nc_ohc=BPf0M3fn9p4AX9aeSkK&_nc_ht=video-iad3-1.xx&oh=4d407ff7a3686bb7c256f4f2e8c17eb9&oe=5ED9BD06

// https://fbion.com/extract?url=https://www.facebook.com/FanPageTruongGiang/videos/2310364305871638/