// $(document).ready(function(){
//  $('body').on('click','#btn_accept',function(){
//      console.log(localStorage);

//     // chrome.tabs.create({ url: chrome.extension.getURL("html/index.html#profile")})
//     // window.close()

// }) 
//  $('body').on('click','#btn_quit',function(){
//    window.close()

// }) 


// })
var Policy;
Policy = function() {
    return new Promise(resolve => {
        Swal.fire({
            // title: '<strong>HTML <u>example</u></strong>',
            // icon: 'info',
            width: 838,
            html: `
    <div class="page-wrapper" style="padding-left: 10px;">
        <div class="" style="padding-top: 0px!important;">
        <h4 class="title-policy  mb-4">Điều khoản dịch vụ của 3F Solutions</h4>
            <div class=" text-left">
                <div class="row ">
                    <div class="col-8">
                        
                        <div class="content-terms">
                            <div class="font-15">
                                <p class="">Trước khi bạn sử dụng công cụ này, bạn cần xem qua và đồng ý những điều khoản và điều kiện sau:</p>
                                <div class="over-content">
                                    <div class="content-chap ml-2">
                                        <p class="style-font-cl my-3">1. Công cụ Facebook Tools không hỏi, không biết và không lưu trữ</p>
                                        <ul class="policy-facebook">
                                            <li>Mật khẩu đăng nhập facebook của bạn</li>
                                            <li>Mật khẩu 2 lớp của tài khoản facebook của bạn</li>
                                            <li>Chúng tôi xác nhận không thực hiện và không thể thực hiện: hack, chiếm đoạt tài khoản (cá nhân), fanpage, group của bạn. Đây là điều kiện quan trọng bạn phải xem và đồng ý trước khi sử dụng công cụ này.</li>
                                        </ul>
                                    </div>
                                    <div class="content-chap ml-2">
                                        <p class="style-font-cl mb-3">2. Nếu bạn sử dụng tính năng Tự động &amp; Trao đổi hệ thống sẽ lưu trữ trên server của chúng tôi
                                        </p>
                                        <ul class="policy-facebook">
                                            <li>Cookie facebook của bạn</li>
                                            <li>User Token</li>
                                            <li>Chúng tôi sẽ hỏi lại và bạn cần xác nhận trước khi sử dụng.Một số trường hợp có thể bị checkpoint (tài khoản mới, tài khoản clone …) vui lòng cân nhắc trước khi sử dụng.</li>
                                        </ul>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>
                    <div class="col-4 m-auto ">
                        <div class="box-right">
                            <div class="picture-art ">
                                <img src="../img/privacy.svg" alt="">
                            </div>
                            <div class="des-content">
                                <span class="font-15 text-center d-flex align-items-center"> Bạn có quyền kiểm soát dữ liệu chúng tôi thu thập và
                            cách sử dụng dữ liệu</span>
                            </div>
                        </div>
                    </div>
                    <div class="d-flex flex-row justify-content-end ml-5 mt-3">
                        <button class="btn-secondary btn-sm mr-4 custom-danger" id="btn_quit">Hủy</button>
                        <button class="btn btn-primary " id="btn_accept">Đồng ý và Tiếp tục</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
  `,
            showCloseButton: false,
            showCancelButton: false,
            showConfirmButton: false,
            onOpen: () => {
                $('body').on('click', '#btn_quit', function() {
                        window.close()
                    })
                    // $(document).ready(function(){
                $('body').on('click', '#btn_accept', function() {
                    resolve(true)
                })
            }
        })
    })
}