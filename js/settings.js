class UnseenPopup {
    constructor() {

        chrome.storage.local.get(null, function (settings) {
            this.settings = settings;
            console.log(settings)
            this.init()
        }.bind(this))
    }
    init() {
            chrome.runtime.sendMessage({
                action: 'getSettings'
            }, function (response) {            
                console.log(response);
                // $("#block_chat_indicator").attr('checked', response.block_chat_indicator);
                // $("#block_chat_receipts").attr('checked', response.block_chat_receipts);
                var myTimer = setInterval(() => {
                    if($("#block_chat_seen").length){
                        $("#block_chat_seen").attr('checked', response.block_chat_seen);
                        $("#block_typing_indicator").attr('checked',response.block_typing_indicator);
                        $("#block_chat_indicator").attr ('checked',response.block_chat_indicator);
                        clearInterval(myTimer);
                    }
                }, 200);// cách này chỉ là tậm thơi thôi. Chưa giải quyết được vấn đề chính do cái input chưa được khởi tạo thì 
                        // cái hàm init này nó đã chạy trước mất rồi. 

                // $("#fbunseen_messenger").attr('checked', response.fbunseen_messenger);
                // $("#show_mark_as_read").attr('checked', response.show_mark_as_read);
            }.bind(this));

        $(document).on('change', 'input.checkbox', function (e) {
            let id = $(e.target).attr('id'),
                state = e.target.checked;
            let obj = {},
                k = id;
            obj[k] = state;
            chrome.storage.local.set(obj);
            chrome.storage.local.get(null, function (settings) {
                console.log(settings);
            }.bind(this))


        }.bind(this));
    }

  

    changeMessengerPermissions(state) {
        if (state) {
            chrome.runtime.sendMessage({
                action: 'addMessenger'
            });
        } else {
            chrome.runtime.sendMessage({
                action: 'removeMessenger'
            });
        }
    }

}
$(function () {
    new UnseenPopup();
});