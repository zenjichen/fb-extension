var Shield;
Shield = function () {
    return {
        init: function () {
            // alert('3')
            id_user = localStorage.id;
            $('.id_user').html('ID: ' + id_user);
            // console.log(id_user);
            $('.name_user').text(localStorage.name);
            $('.img-guard').attr('src', 'https://graph.facebook.com/' + id_user + '/picture?height=500');
            return this.append_shield();

        },
        append_shield: function () {
            var _this;
            _this = this;
            $(document).on('click', '#open_shield,#close_shield', async function () {
                const id = $(this)[0].id;
                classLoad = '<span style="margin-bottom:2px" class="spinner-border spinner-border-sm ml-2" role="status" aria-hidden="true"></span>';
                $(this).append(classLoad);

                $('#open_shield,#close_shield').prop('disabled', true);
                if (id) {
                    const the_shield = await _this.shield(id == 'open_shield' ? true : false);
                    if (the_shield) {
                        notification(id == 'open_shield' ? 'Bật khiên thành công' : 'Tắt khiên thành công', '', 'success');
                        $('#open_shield,#close_shield').prop('disabled', false);
                        $('.spinner-border').remove();
                        id == 'open_shield' ? ($('.picture-guard').show(), localStorage.shiled = true) : ($('.picture-guard').hide(), localStorage.shiled = false)
                    }
                }
            })
        },
        shield: function (is_Shield) {
            return new Promise((resolve, reject) => {
                data = new FormData;
                data.append("fb_dtsg", localStorage.dt), data.append("variables", `{"0":{"is_shielded":${is_Shield},"actor_id":"${localStorage.id}","client_mutation_id":"FUCKOFF"}}`), data.append("doc_id", "1477043292367183"), fetch("https://www.facebook.com/api/graphql/", {
                    method: "POST",
                    credentials: "include",
                    body: data
                }).then(e => {
                    resolve(e);
                }).catch((error) => {
                    alert(error);
                    reject(error)
                });
            })
        }
    }
}