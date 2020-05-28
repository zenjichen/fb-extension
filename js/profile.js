var Profile;

Profile = function() {
    return {
        init: function() {
            if (localStorage.information) {
                profile = JSON.parse(localStorage.information);
                id_user = localStorage.id;
                count_friend = numeral(profile[id_user].friends.count).format('0,0');
                count_groups = numeral(profile[id_user].groups.count).format('0,0');
                count_subscribers = numeral(profile[id_user].subscribers.count).format('0,0');
                created_time = moment((1e3 * profile[id_user].created_time)).format("DD-MM-YYYY-hh:mm a").split('-');
                time_text = 'Đã tham gia vào ngày ' + created_time[0] + ' tháng ' + created_time[1] + ' năm ' + created_time[2] + ' vào lúc ' + created_time[3];

                $('#count_friend').text(count_friend);
                $('#count_group').text(count_groups);
                $('#count_follow').text(count_subscribers);
                $('.id_user').text('ID: ' + id_user);
                $('.name_user').text(localStorage.name);
                $('#created_time').text(time_text);

                $('.img-thumbnail').attr('src', 'https://graph.facebook.com/' + id_user + '/picture?height=500');
            }
        }
    }
}