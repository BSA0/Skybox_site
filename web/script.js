//working with frames
let images = {};// Not really needed, but it's good for debugging
let titles = {};

function load_pic(from_num, to_num) { //load pictures
    for (let i = from_num; i < to_num; i++) {
        let image = new Image;
        image.src = 'frames/'+ i +'.jpg';


        jQuery.get('/frame_info?frame=' + i, function(data){
            image.setAttribute("title", data['name']);
            titles[i] = data['name'];
        });

        images[i] = image;
        console.log('loaded ' + i);

        // Old save system
        /*if (!($('#frame-' + i).attr('src'))){
            let image = $("<img />").attr('id', 'frame-' + i);
            image.attr('class', 'hide materialboxed');
            image.attr('src', 'frames/'+ i +'.jpg');
            $('#img-holder').append(image);
            console.log('loaded ' + i);
            $('#frame-' + i).materialbox();
        }*/
    }
}


function unload_pic(from_num, to_num) {//unload pictures
    for (let i = from_num; i < to_num; i++) {
        delete images[i];
        console.log('unloaded ' + i);

        // Old unload system
        /*let image = $('#frame-' + i);
        if ((image.attr('src'))){
            image.remove();
            console.log('unloaded ' + i);
        }*/
    }
}


function unload_all_pic() {
    images = {};

    /*$('*').each(function() {
        if ($(this).is('img')) {
            $(this).remove()}
    });*/
}


function delete_all_empty() {
    $('.material-placeholder ').each(function () {
        if ($(this).children().length === 0){
            $(this).remove()
        }

    })
    // Old scary delete function
    /*$('.material-placeholder ').each(function () {
        $('div').each(function() {
            let $this = $(this);
            if($this.html().replace(/\s|&nbsp;/g, '').length === 0)
                $this.remove();
        });
    })*/

}


function change_pic(to_num) {
    let img = new Image;
    img.id = "frame";
    img.className = "frame";
    img.src = "frames/" + to_num + ".jpg";

    let frame = $("#frame");

    if (frame.length) {
        frame.attr("src", "frames/" + to_num + ".jpg");
    } else {
        $('#img-holder').append(img);
        $(".frame").materialbox();
    }
    //$('#frame-' + from_num).attr('class', 'hide materialboxed');
    //$('#frame-' + to_num).attr('class', 'materialboxed')
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
    $('#num-frame-desktop').val(num);
    $('#num-frame').val(num);

    console.log('Place loaded!');

    return num;
}


function save_place(num) {
    if (cookie.get('allow') === 'true'){
        cookie.set('frame', num)
    }
}

// working with frame

function get_place() {
    return Number($('#num-frame').val());
}

function set_last() {
    $.ajax({
        async: false,
        type: 'GET',
        url: '/frame_info',
        success: function(data) {
            $('#last-frame').val(data['end'] - 1)
        }
    });
}
function get_last() {
    return Number($('#last-frame').val());
}


function change_frame_in_url(num) {
    let arr = window.location.search.slice(1).split('&');
    let parameters = {};

    if (window.location.search !== ''){
        for (let i in arr) {
            parameters[arr[i].split('=')[0]] = arr[i].split('=')[1];
        }
    }

    parameters['frame'] = num;
    let search = [];

    for (let i in parameters){
        search.push(i + '=' + parameters[i]);
    }

    window.history.pushState("data","Title", window.location.pathname + '?' + search.join('&'));
}


function change_place(num) {
    let frame = $('#num-frame');
    let value = Number(frame.val());

    console.log(num);

    if (num >= get_last()){
        num = get_last();
        $('#last').attr('class', 'disabled light-blue waves-effect waves-light btn');
        $('#next').attr('class', 'disabled light-blue waves-effect waves-light btn');
        $('#first').attr('class', 'light-blue waves-effect waves-light btn');
        $('#previous').attr('class', 'light-blue waves-effect waves-light btn');
        console.log('Last frame');
    } else if (num <= 0){
        num = 0;
        $('#first').attr('class', 'disabled light-blue waves-effect waves-light btn');
        $('#previous').attr('class', 'disabled light-blue waves-effect waves-light btn');
        $('#last').attr('class', 'light-blue waves-effect waves-light btn');
        $('#next').attr('class', 'light-blue waves-effect waves-light btn');
        console.log('First frame');
    } else {
        $('#last').attr('class', 'light-blue waves-effect waves-light btn');
        $('#next').attr('class', 'light-blue waves-effect waves-light btn');
        $('#first').attr('class', 'light-blue waves-effect waves-light btn');
        $('#previous').attr('class', 'light-blue waves-effect waves-light btn');
        console.log('Same frame')
    }

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

    change_pic(num);

    //NOT NEEDED
    //delete_all_empty();

    $('#num-frame-mobile').val(num);
    $('#num-frame-desktop').val(num);
    frame.val(num);
    save_place(num);
    change_frame_in_url(num);

    /*jQuery.get('/frame_info?frame=' + num, function(data){
        $('#title').text(data['name']);
    });*/
    while (!titles[num]){
        $('#title').text(titles[num]);
    }


    console.log('Changed from ' + value + ' to ' + num);
}

// easter egg

function very_importatnt_func(){
    /*var mc = new Hammer($('body')[0]);

// listen to events...
    mc.on("panleft panright tap press", function(ev) {
        console.log(ev.type +" gesture detected.");
    });*/
}

// main func

$(document).ready(function () {
    M.AutoInit(document.body);
    
    $(".dropdown-trigger").dropdown({
        coverTrigger: false,
        constrainWidth: false,
     });

    let mobile = $('#num-frame-mobile');
    let desktop = $('#num-frame-desktop');
    let cookieAllow = $('#cookie-allow');
    let frame = $('#num-frame');

    set_last();

    // Cut url for parameters
    let arr = window.location.search.slice(1).split('&');//getting attributes from url
    let parameters = {};

    for (let i in arr) {
        parameters[arr[i].split('=')[0]] = arr[i].split('=')[1];
    }

    if (parameters['frame'] && (Number.isInteger(+parameters['frame']))){ // If we had frame parameter and it's integer
        change_place(Number(parameters['frame']));
    } else {
        change_place(load_place());
    }
    // I didn't make func for this because I'm lazy noside


    //key listeners

    $('body').keyup(function(eventObject){
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

    $('#first').click(function() {
        change_place(0);
        return false;
    });

    $('#last').click(function() {
        set_last();
        change_place(get_last());
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
