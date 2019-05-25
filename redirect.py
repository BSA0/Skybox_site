from sanic import Sanic
from sanic import response

app = Sanic()


@app.route("/")
async def index(request):
    return response.redirect('https://skybox.nanotrasen.ru?' + request.query_string)


@app.route("/read")
async def reader_page(request):
    return response.redirect('https://skybox.nanotrasen.ru/read?' + request.query_string)


@app.route('/frames/<num:int>.jpg')
async def get_frame(request, num):
    return response.redirect('https://skybox.nanotrasen.ru/frames/' + str(num) + '.jpg?' + request.query_string)


@app.route("/frame_info")
async def reader_page(request):
    return response.redirect('https://skybox.nanotrasen.ru/frame_info?' + request.query_string)


app.run(host='0.0.0.0')
