//working with frames
function load_pic(from_num, to_num) { //load pictures
    for (let i = from_num; i < to_num; i++) {
        if (!($('#frame-' + i).attr('src'))){
            let image = $("<img />").attr('id', 'frame-' + i);
            image.attr('class', 'hide materialboxed');
            image.attr('src', 'frames/'+ i +'.jpg');
            $('#img-holder').append(image);
            console.log('loaded ' + i);
            $('#frame-' + i).materialbox();
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
    $('#frame-' + to_num).attr('class', 'materialboxed')
}

// working with cookies
let cookie = Cookies.noConflict();

function load_place(){//load place from cookies or set it to 0
    let num = 0;

    if (cookie.get('allow') === 'true'){
        $('#cookie-allow').prop("checked", true);

        if (cookie.get('frame')){
            num = Number(cookie.get('frame'));
        }
    }

    $('#num-frame-mobile').val(num);
    $('#num-frame-desktop').val(num)
    $('#num-frame').val(num);

    console.log('Place loaded!');

    return num;
}


function save_place(num) {
    if (cookie.get('allow') === 'true'){
        cookie.set('frame', num)
    }
}

// working with page

function get_place() {
    return Number($('#num-frame').val());
}


function change_page_in_url(num) {
    let arr = window.location.search.slice(1).split('&');
    let parameters = {};

    for (let i in arr) {
        parameters[arr[i].split('=')[0]] = arr[i].split('=')[1];
    }

    parameters['page'] = num;
    let search = [];

    for (let i in parameters){
        search.push(i + '=' + parameters[i]);
    }

    window.history.pushState("data","Title", window.location.pathname + '?' + search.join('&'));
}


function change_place(num) {
    let frame = $('#num-frame');
    let value = Number(frame.val());

    //unload not used pictures
    if (Math.abs(num - value) === 1){
        unload_pic(num - 20, num - 6);
        unload_pic(num + 6, num + 20);
    } else {
        unload_all_pic();
    }

    //load current frame, next and previous
    load_pic(num, num + 5); //current and next 5
    load_pic(num - 5, num - 1); //previous 5

    change_pic(value, num);

    delete_all_empty();

    $('#num-frame-mobile').val(num);
    $('#num-frame-desktop').val(num);
    frame.val(num);
    save_place(num);
    change_page_in_url(num);

    console.log('Changed from ' + value + ' to ' + num);
}

// easter egg

function very_importatnt_func(){
    //window.history.pushState("data","Title", window.location.pathname + window.location.search); // change url
    let arr = window.location.search.slice(1).split('&');//getting attributes from url
    let parameters = {};

    for (let i in arr) {
        parameters[arr[i].split('=')[0]] = arr[i].split('=')[1];
    }
    console.log(parameters);

    if (parameters['page']){
        change_place(Number(parameters['page']));
    }
}

// main func

$(document).ready(function () {
    M.AutoInit(document.body);
    let mobile = $('#num-frame-mobile');
    let desktop = $('#num-frame-desktop');
    let cookieAllow = $('#cookie-allow');
    let frame = $('#num-frame');


    // Cut url for parameters
    let arr = window.location.search.slice(1).split('&');//getting attributes from url
    let parameters = {};

    for (let i in arr) {
        parameters[arr[i].split('=')[0]] = arr[i].split('=')[1];
    }

    if (parameters['page'] && (Number.isInteger(+parameters['page']))){ // If had page parameter and it's integer
        change_place(Number(parameters['page']));
    } else {
        change_place(load_place());
    }
    // I didn't make func for this because I'm lazy noside


    //key listeners

    $('body').keydown(function(eventObject){
        switch (eventObject.which) {
            case 65:
            case 37: change_place(get_place() - 1); break;
            case 68:
            case 39: change_place(get_place() + 1); break;

        }
    });


    $('#next').click(function() {
        change_place(get_place() + 1);
        return false;
    });

    $('#previous').click(function() {
        change_place(get_place() - 1);
        return false;
    });

    mobile.change(function() {
        change_place(Number(mobile.val()));
    });

    desktop.change(function() {
        change_place(Number(desktop.val()));
    });

    // about cookies

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
