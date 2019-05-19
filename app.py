import os
from sanic import Sanic
from sanic import response

app = Sanic()
count = len(os.listdir(os.path.abspath('frames/')))


@app.route("/")
async def index(request):
    return response.redirect('/test')


@app.route("/test")
async def test(request):
    return response.html(open(os.path.abspath('test/skybox_markup.html'), encoding='utf-8').read())


@app.route("/style.css")
async def test(request):
    return await response.file(os.path.abspath('test/style.css'))


@app.route("/script.js")
async def test(request):
    return await response.file(os.path.abspath('test/script.js'))


@app.route("/favicon.png")
async def test(request):
    return await response.file(os.path.abspath('test/favicon.png'))


@app.route('/frames/<num:int>.jpg')
async def post_handler(request, num):
    if num >= count - 1:
        num = count - 1
    elif num <= 0:
        num = 0
    path = os.path.abspath('frames/{}.jpg'.format(str(num)))
    return await response.file(path)


def start():
    app.run(host="0.0.0.0")
