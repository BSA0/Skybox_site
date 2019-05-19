function load_pic(from_num, to_num) { //load pictures
    for (let i = from_num; i < to_num; i++) {
        if (!($('#frame-' + i).attr('src'))){
            let image = $("<img />").attr('id', 'frame-' + i);
            image.attr('class', 'hide materialboxed');
            image.attr('src', 'frames/'+ i +'.jpg');
            $('#img-holder').append(image);
            console.log('loaded ' + i);
        }
    }
}


function unload_pic(from_num, to_num) {//unload pictures
    for (let i = from_num; i < to_num; i++) {
        let image = $('#frame-' + i);
        if ((image.attr('src'))){
            image.remove();
            console.log('unloaded ' + i);
        }
    }
}


function unload_all_pic() {
    $('*').each(function() {
        if ($(this).is('img')) {
            $(this).remove()}
    });
}


function delete_all_empty() {
    $('.material-placeholder ').each(function () {
        $('div').each(function() {
            let $this = $(this);
            if($this.html().replace(/\s|&nbsp;/g, '').length === 0)
                $this.remove();
        });
    })

}


function change_pic(from_num, to_num) {
    $('#frame-' + from_num).attr('class', 'hide materialboxed');
    $('#frame-' + to_num).attr('class', 'materialboxed').materialbox();

    /*image.fadeOut('fast', function () {
        image.attr('src', 'http://31.207.211.131:45678/frames/'+ num +'.jpg');
        image.fadeIn('fast');
    });*/
}


function next(){
    let frame = $('#num-frame');
    let value = Number((+frame.val()) ? frame.val() : '0');

    load_pic(value - 5, value + 5);
    unload_pic(value - 20, value - 6);
    unload_pic(value + 6, value + 20);

    change_pic(value, value + 1);

    $('#num-frame-mobile').val(value + 1);
    $('#num-frame-desktop').val(value + 1);
    frame.val(value + 1);

    //console.log('next ' + value);
}


function previous(){
    let frame = $('#num-frame');
    let value = Number((+frame.val()) ? frame.val() : '0');

    load_pic(value - 5, value + 5);
    unload_pic(value - 20, value - 6);
    unload_pic(value + 6, value + 20);

    change_pic(value, value - 1);

    $('#num-frame-mobile').val(value - 1);
    $('#num-frame-desktop').val(value - 1);
    frame.val(value - 1);

    //console.log('previous ' + value);
}


function very_importatnt_func(){
    window.history.pushState("data","Title", window.location.pathname + window.location.search);
    let arr = window.location.search.split('&');
    for (let i in arr) {
        console.log(arr[i].split('='))}
}


$(document).ready(function () {
    M.AutoInit(document.body);
    let cookie = Cookies.noConflict();
    let mobile = $('#num-frame-mobile');
    let desktop = $('#num-frame-desktop');
    let cookieAllow = $('#cookie-allow');
    let frame = $('#num-frame');

    let num = 0;

    if (cookie.get('allow') === 'true'){
        cookieAllow.prop("checked", true);

        if (cookie.get('frame')){
            num = Number(cookie.get('frame'));
        }
    }

    load_pic(num - 5, num + 5);
    change_pic(num, num);

    mobile.val(num);
    desktop.val(num);
    frame.val(num);

    $('body').keydown(function(eventObject){
        switch (eventObject.which) {
            case 65:
            case 37: $('#previous').trigger("click"); break;
            case 68:
            case 39: $('#next').trigger("click"); break;

        }
    });


    $('#next').click(function() {
        next();

        delete_all_empty();

        if (cookie.get('allow') === 'true'){
            cookie.set('frame', frame.val())
        }

        return false;
    });

    $('#previous').click(function() {
        previous();

        delete_all_empty();

        if (cookie.get('allow') === 'true'){
            cookie.set('frame', frame.val())
        }

        return false;
    });

    mobile.change(function() {
        let value = Number(mobile.val());

        unload_all_pic();

        load_pic(value - 5, value + 5);
        change_pic(value, value);

        delete_all_empty();

        desktop.val(value);
        frame.val(value);

        if (cookie.get('allow') === 'true'){
            cookie.set('frame', frame.val())
        }

        //console.log('change ' + value);
    });

    desktop.change(function() {
        let value = Number(desktop.val());


        unload_all_pic();

        load_pic(value - 5, value + 5);
        change_pic(value, value);

        delete_all_empty();

        mobile.val(value);
        frame.val(value);

        if (cookie.get('allow') === 'true'){
            cookie.set('frame', frame.val())
        }

        //console.log('change ' + value);
    });

    cookieAllow.change(function() {
        if (this.checked){
            let returnVal = confirm("Do you allow cookies on our website?");
            if (returnVal){
                cookie.set('allow', 'true');
                cookie.set('frame', frame.val())
            }
            $(this).prop("checked", returnVal);
        } else {
            cookie.remove('allow');
            cookie.remove('frame');
        }
    });

    $(window).on("beforeunload", function() {
        //return confirm("Do you really want to close?");
        if (cookie.get('allow') === 'true'){
            cookie.set('frame', frame.val())
        }
    })
});
