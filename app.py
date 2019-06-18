import os
import pickle
from sanic import Sanic
from sanic import response
import json


# Open settings
if not os.path.exists(os.path.abspath('settings.json')):
    open(os.path.abspath('settings.json'), 'w')
    raise Exception('Missing JSON')

# Load settings
settings = json.load(open(os.path.abspath('settings.json')))

if settings['ssl']:  # Choose protocol (http or https)
    import ssl

    context = ssl.create_default_context(purpose=ssl.Purpose.CLIENT_AUTH)
    context.load_cert_chain("certificate.crt", keyfile="private.key")


# Make server
app = Sanic()
frames_path = settings['path_to_frames']
database_file = settings['path_to_database']
count = len(os.listdir(os.path.abspath(frames_path)))

data = None
arcs_names = None


def get_database(force=False):
    global data, arcs_names
    
    if (data is None) or (arcs_names is None) or force:
        with open(os.path.abspath(database_file), 'rb') as f:
            file_arc_names, file_data = pickle.load(f)

        data, arcs_names = file_data, file_arc_names

    return arcs_names, data


def refresh_count(force=False):
    global count
    count = len(os.listdir(os.path.abspath(frames_path)))


def get_page_from_frame(dt, current_frame):
    for i, fr in enumerate([x[0] for x in list(dt.values())]):
        if current_frame+1 <= fr:
            return i


def get_info(frame_num):
    arcs, dt = get_database()
    page = get_page_from_frame(dt, frame_num)
    item = list(dt.items())[page]

    return {"glob_frame": frame_num,
            "arc_num": arcs_names.index(item[0][0]),
            "arc_name": item[0][0],
            "page": item[0][1],
            "cur_frame": item[1][1] - (item[1][0] - frame_num) + 1,
            "total_frames": item[1][1]}


def get_arc(arc_name):
    arcs, dt = get_database()
    if arc_name not in arcs:
        return {"Houston": "we have a problem."}

    pages = {}

    for i in dt.items():
        if i[0][0] == arc_name:
            pages[i[0][1]] = {"start": i[1][0], "count": i[1][1]}

    return {"arc_num": arcs_names.index(arc_name),
            "arc_name": arc_name,
            "pages": pages}


def get_title(frame_num):
    arcs, dt = get_database()
    page = get_page_from_frame(dt, frame_num)
    item = list(dt.items())[page]

    s = "Arc {} - {}: Page {} - frame {}/{}".format(
                arcs_names.index(item[0][0]),
                item[0][0],
                item[0][1],
                item[1][1] - (item[1][0] - frame_num) + 1,
                item[1][1],
            )

    return s


@app.route("/")
async def index(request):
    return response.redirect('/read')


@app.route("/read")
async def reader_page(request):
    return response.html(open(os.path.abspath('web/skybox_markup.html'), encoding='utf-8').read())


@app.route("/style.css")
async def style(request):
    return await response.file(os.path.abspath('web/style.css'))


@app.route("/script.js")
async def script(request):
    return await response.file(os.path.abspath('web/script.js'))


@app.route("/jquery.touchSwipe.min.js")
async def script(request):
    return await response.file(os.path.abspath('web/jquery.touchSwipe.min.js'))


@app.route("/favicon.png")
async def favicon(request):
    return await response.file(os.path.abspath('web/favicon.png'))


@app.route("/favicon.ico")
async def favicon(request):
    return await response.file(os.path.abspath('web/favicon.png'))


@app.route('/frames/<num:int>.jpg')
async def get_frame(request, num):
    if num >= count - 1:
        num = count - 1
    elif num <= 0:
        num = 0
    path = os.path.abspath(frames_path+'{}.jpg'.format(str(num)))
    return await response.file(path)


@app.route("/frame_info")
async def frame_title(request):
    if request.raw_args.get('frame', None) is not None:
        return response.json({'frame': request.raw_args['frame'], 'name': get_title(int(request.raw_args['frame']))})
    return response.json({'start': 0, 'end': count})


@app.route("/getInfo")
async def frame_info(request):
    if request.raw_args.get('frame', None) is not None:
        return response.json(get_info(int(request.raw_args['frame'])))
    elif request.raw_args.get('arc', None) is not None:
        return response.json(get_arc(request.raw_args['arc']))
    return response.json({'start': 0, 'end': count, "arcs": get_database()[0]})


def start():
    ip = '0.0.0.0'
    _ip = 'localhost'
    if settings['ssl']:
        app.run(host=ip, port=443, ssl=context)
    else:
        app.run(host=ip)
