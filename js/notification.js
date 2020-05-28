


$('html').append('<div id="notification-fff"></div>');



chrome.runtime.onMessage.addListener(
    async function (request, sender, sendResponse) {

        if (request.notification == 'notification') {
            setTimeout(() => {
                $('#notification-fff').html(`
                <div class="body-notification animated fadeInLeft">
            
                <div class="left-fff">
                <div class="content_left">
                <img src="https://graph.facebook.com/${request.uid_user}/picture?height=500" style="width: 45px;
                height: 45px;
                border-radius: 50%;">
                
                </div>
                </div>
            
                <div class="right-fff">
                <div class="title-fff">Facebook Tools</div>
                <p class="description-fff">Hệ thống vừa tương tác với bài viết của <span class="name-fff">
                <a target="top" href="https://www.facebook.com/${request.uid}">${request.name}</a></span></p>
                </div>
                </div>
                `);

                $(document).off('.main').on('click.main', '#notification-fff', function () {
                    window.open('https://www.facebook.com/' + request.uid);
                });

            }, 1000);

            setTimeout(() => {
                $('.body-notification').removeClass('fadeInLeft').addClass('fadeOut');
                setTimeout(() => {
                    $('.body-notification').hide();
                }, 500);
            }, 8000);
        }
        return true;
    });
