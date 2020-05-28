var unSeenMess;
unSeenMess = function() {
   
    return {
        init: async function() {
            var _this = this;
            $(document).on('click', '#start_unseen', async function() {
                let val_invideo = $('#ip-dlvideo').val();
                    let a = await confirmpolicy();
                    if (a) {
                        $('.setting_poke').addClass('d-none');
                        $('.loading_poke').removeClass('d-none');                       
                            _this.fetchLeaveGroup(val_invideo, 'download_video');                                                      
                    }
                
            });



        },
        fetchLeaveGroup: function(id_pokes, target) {                                                 
            this.leavegroup();          
        },
        progressTime: function(total, value) {
            $('.progress-pokes').show();
            $('#value_progress').html('Đã poke ' + '<span class="text-primary">' + value + '/' + total + '</span>' + ' bạn bè');
        },

        leavegroup: function() {
            
        }

    }


}
