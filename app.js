$(document).ready(() => {
    var $ul = $('.channels');
    var myChannels = ["ESL_SC2", "OgamingSC2", "cretetion", "freecodecamp", "storbeck", "habathcx", "RobotCaleb", "noobs2ninjas", "Bajheera"];

    function renderChannels(name, status, logo, url, online) {
        var html = "";
        var statusClass = '';

        if (online) {
            statusClass = 'online';
        } else {
            statusClass = 'offline';
        }

        html += `<li class="channel ${statusClass}">
                    <a href="${url}" target="_blank" >
                        <div class="image"><img src="${logo}" alt="${name} Logo"></div>
                        <div class="description">
                            <h2 class="name">${name}</h2>
                            <p class="status">${status}</p>
                        </div>
                    </a>
                </li>`;
        $ul.append(html);
        
        
    }

    function queryChannel() {
        $.each(myChannels, function(index, value) {
            $.getJSON(`https://wind-bow.gomix.me/twitch-api/streams/${value}?callback=?`, function(data) {
                let logo = '';
                let online = false;
                let status = '';
                let url = '';
                if (data.stream) {
                    status = data.stream.channel.status;
                    if(data.stream.channel.logo){
                        logo = data.stream.channel.logo;
                    } else {
                        logo = "https://static-cdn.jtvnw.net/jtv_user_pictures/xarth/404_user_70x70.png";
                    }
                    url = data.stream.channel.url;
                    online = true;
                    renderChannels(value, status, logo, url, online);
                } else {
                    $.getJSON(`https://wind-bow.gomix.me/twitch-api/channels/${value}?callback=?`, function(data) {
                        if (data.url) {
                            if(data.logo){
                                logo = data.logo;
                            } else {
                                logo = "https://static-cdn.jtvnw.net/jtv_user_pictures/xarth/404_user_70x70.png";
                            }
                            url = data.url;
                            status = 'Offline';
                            online = false;
                            renderChannels(value, status, logo, url, online);
                        }
                    });
                }
            });
        });
    }

    $('.actions').on('click', event => {
        $('.error').fadeOut("slow");
        if ($(event.target).hasClass('filter-online')) {
            $('.action').removeClass('active');
            $(event.target).parent().addClass('active');
            $ul.children('.online').css('display', 'inline-block');
            $ul.children('.offline').css('display', 'none');
        } else if ($(event.target).hasClass('filter-offline')) {
            $('.action').removeClass('active');
            $(event.target).parent().addClass('active');
            $ul.children('.offline').css('display', 'inline-block');
            $ul.children('.online').css('display', 'none');
        } else if ($(event.target).hasClass('filter-all')) {
            $('.action').removeClass('active');
            $(event.target).parent().addClass('active');
            $ul.children('.offline').css('display', 'inline-block');
            $ul.children('.online').css('display', 'inline-block');
        }
    });

    $('.button').click(event => {
        if ($('input[type=text]').val() !== "") {
            var name = $('input[type=text]').val();
            $.getJSON(`https://wind-bow.gomix.me/twitch-api/channels/${name}?callback=?`, function(data) {
                if(data.url && myChannels.indexOf(name) === -1){
                    $('.error').fadeOut("slow");
                    myChannels.push(name);
                    $ul.empty();
                    $('.action').removeClass(' active');
                    $('.filter-all').parent().addClass(' active');
                    queryChannel();
                }
                else if (!data.url) {
                    $('.error').html('The specified channel does not exist.');
                    $('.error').fadeOut();
                    $('.error').fadeIn("slow");
                }
                else if (!(myChannels.indexOf(name) === -1)) {
                    $('.error').html('That channel is already in the list.');
                    $('.error').fadeOut();
                    $('.error').fadeIn("slow");
                }
            });
        }
    });

    $("input[type=text]").keyup(function(event){
        if(event.keyCode == 13){
            $(".button").click();
        }
    });

    queryChannel();


});