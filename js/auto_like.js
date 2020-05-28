var autoReaction;

autoReaction = function () {
    return {
        init: function () {
            var _this;
            _this = this;
            $('.btn-link-facebook').attr('href', `https://www.facebook.com/${localStorage.id}/allactivity`);
            if (localStorage.auto_reaction) {
                
                JSON.parse(localStorage.auto_reaction) ? _this.disableForm(localStorage.auto_reaction) : _this.disableForm(false);
                JSON.parse(localStorage.auto_reaction) ? $('#autoReactions').prop('checked', true) : $('#autoReactions').prop('checked', false);
            }
            if (localStorage.time_min && localStorage.time_max) {
                $('#reactions-time-min').val(localStorage.time_min);
                $('#reactions-time-max').val(localStorage.time_max);
            }

            if (localStorage.reaction_type) {
                var reaction = ['1', '16', '2', '3', '4', '5', '6'];
                var localReaction = JSON.parse(localStorage.reaction_type);
                reaction.map(item1 => {
                    let e = localReaction.find(item => item == item1);
                    if (item1 == e) {
                        $('input[name=reaction' + item1 + ']').prop('checked', true)
                    } else {
                        $('input[name=reaction' + item1 + ']').prop('checked', false)
                    }
                })
            }



            $(document).on('click', '#autoReactions', async function (event) {
                event.preventDefault();
                let is_reactions = $(this)[0].checked;
                time_min = $('#reactions-time-min').val();
                time_max = $('#reactions-time-max').val();
                let confirm;
                if (+time_min < +time_max) {
                    is_reactions ? confirm = (localStorage.confirm ? true : await confirmpolicy()) : confirm = true;
                    if (confirm) {
                        setTimeout(() => {
                            is_reactions ? $(this).prop('checked', true) : $(this).prop('checked', false);
                            _this.disableForm(is_reactions);
                        }, 1);
                        if (is_reactions) {
                            localStorage.auto_reaction = true;
                        } else {
                            localStorage.auto_reaction = false;
                            setTimeout(() => {
                                localStorage.reaction_type = '';
                                localStorage.time_min = '';
                                localStorage.time_max = '';
                            }, 100);
                            // localStorage.clear();
                        }

                        var reaction_type = [];
                        reaction_input = $('.reaction');


                        $.each(reaction_input, (key, item) => {
                            if (item.checked) {
                                reaction_type.push(item.value);
                            }
                        })
                        chrome.runtime.sendMessage({
                            reactions: is_reactions ? 'active' : 'disabled',
                            time_min: time_min,
                            time_max: time_max,
                            reaction_type: reaction_type

                        }, function (response) {
                            // console.log(response);
                        });
                    }
                } else {
                    notification('Thời gian tối thiểu phải nhỏ hơn thời gian tối đa', '', 'error')
                }

            })
        },
        disableForm: function (check) {
            $("#reaction :input").attr("disabled", check);
            $("#reactions-time-min,#reactions-time-max").attr("disabled", check);
        }
    }
}