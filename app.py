import os
import asyncio

from quart import Quart, make_response, render_template, request, jsonify, url_for, current_app, redirect, send_from_directory
import quart.flask_patch

app = Quart(__name__)

jinja_options = app.jinja_options.copy()
jinja_options.update(dict(
    variable_start_string='{@',
    variable_end_string='@}'
))
app.jinja_options = jinja_options

@app.route('/manifest.json')
@app.route('/browserconfig.xml')
@app.route('/robots.txt')
@app.route('/sitemap.xml')
async def static_from_root():
    return await send_from_directory(app.static_folder, request.path[1:])

@app.route('/')
async def catch_all():
    return await render_template("index.html", five="ZEBRA", six="TAMALE")

if __name__ == '__main__':
    from argparse import ArgumentParser
    # Load this config object for development mode
    parser = ArgumentParser()
    parser.add_argument('-p', '--port', type=int, default=5000)
    args = parser.parse_args()
    port = args.port
    app.run(host='0.0.0.0', port=port)