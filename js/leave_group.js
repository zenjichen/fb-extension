var leaveGroup;
leaveGroup = function () {
    return {
        init:  async function () {      
            console.log(localStorage);                 
            await renderGroup('leave-group')       
            var _this=this;
            $(document).on('click', '#start_leavegroup',async function () {               
                list_friend = window.list_select;
                console.log(window);
                let val_tm1=$('#leave-timeout1').val();
                let val_tm2=$('#leave-timeout2').val();
                
                // const time_auto = $('#time_auto')[0].checked;                       
                if (list_friend && list_friend.length > 0) {
                  let a =  await confirmpolicy();
                 if (a ) {
                         confirm_notification('Rời khỏi ' + list_friend.length + '  nhóm đã chọn!', null, (callback) => {
                        if (callback) {
                            if (list_friend && list_friend.length > 0) {
                                $('.setting_poke').addClass('d-none');
                                $('.loading_poke').removeClass('d-none');
                                for (i = 0; i < list_friend.length; i++) {
                                    _this.fetchLeaveGroup(i, list_friend.length, _this.randomTime(val_tm1,val_tm2), list_friend[i].uid, list_friend[i].name, 'leave-group');
                                }
                            }
                        }
                    });
                   }; 
              
                } else {
                    notification('Chọn nhóm muốn thoát nhóm','', 'error');
                }
            })
            $(document).on('click', '#stop_leavegroup', function () {
                confirm_notification('Bạn chắc chắn muốn hủy bỏ thao tác này!', 'Hủy thành công', (callback) => {
                    if (callback) {
                        location.reload();
                    }
                });
            })
 
           
        }, fetchLeaveGroup: function (count, length, time, id_pokes, name, target) {
            setTimeout(() => {    
                console.log(count,time,id_pokes);
                           
                this.leavegroup(id_pokes, name);
                if (count == length - 1) {
                    notification('Đã rời khỏi ' + length + ' nhóm','', 'success');                    
                    $('.setting_poke').removeClass('d-none');
                    $('.loading_poke').addClass('d-none');
                }
            }, i * time * 1000);
        },
        randomTime: function (min,max) {
            return Math.ceil(Math.random() * (max - min) + min);
        },
        progressTime: function (total, value) {
            $('.progress-pokes').show();
            $('#value_progress').html('Đã poke ' + '<span class="text-primary">' + value + '/' + total + '</span>' + ' bạn bè');
        },
        
        leavegroup: function (id_poker, name) {
            console.log(id_poker);            
            $.post(`https://mbasic.facebook.com/a/group/leave/?qp='`+id_poker, { fb_dtsg: localStorage.dt, jazoest: '21943', group_id: id_poker, 'confirm': 'Rời khỏi nhóm' }).then(
                data => {
                    $('.kq-poke').prepend(`
                       <p class="font-14 mb-1 font-gg"><i
                       class="fas text-success mr-1 fa-check-square"></i>
                     Đã rời khỏi Nhóm <span class="text-custom"><a target="top"
                           href="https://facebook.com/${id_poker}">${name}</a></span></p>
                       `)
                }
            )
            // fetch('https://mbasic.facebook.com/a/group/leave/?qp=' + id_poker, {
            //     method: "POST",
            //     headers: {
            //         'Accept': 'application/json, application/xml, text/plain, text/html, *.*',
            //         'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8'
            //     },
            //     body: poke
            // }).then(e => {
            //     $('.kq-poke').prepend(`
            //     <p class="font-14 mb-1 font-gg"><i
            //     class="fas text-success mr-1 fa-check-square"></i>
            // Đã rời khỏi Nhóm <span class="text-custom"><a target="top"
            //         href="https://facebook.com/${id_poker}">${name}</a></span></p>
            //     `)
            // })
        }
        
    }
    function confirmpolicy(success,callback) {
   return Swal.fire({
            title: 'Xác nhận',
            text:"Để tính năng tự động hoạt động, hệ thống sẽ lưu trữ cookie và token facebook của bạn.",                        
            showCancelButton: true,
            confirmButtonText: 'Xác nhận',
            showLoaderOnConfirm: true,        
            allowOutsideClick:false
          })
          .then((result) => { 
            if (result.value) {
                    return true;
            }                              
          })
    }
}