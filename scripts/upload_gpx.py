import requests
import os

base = "http://localhost:5001"
api = "/api/activity/upload"

# Headers may need to be adapted depending on API requirements
headers = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'APIKey': ''
}

def upload_gpx_activity(user_id, gpx_file_path):
    gpx_file_name = gpx_file_path.split("/")[-1]
    with open(gpx_file_path, "r") as gpx_file:
        gpx_content = gpx_file.read()

    response = requests.post(base + api, json={
        "userID" : user_id,
        "activityName": gpx_file_name,
        "public": True,
        "gpxData": gpx_content,
    }, headers=headers)

    return response.json()

def get_gpx_files():
    # get gpx files in this direction
    gpx_files = []
    for root, dirs, files in os.walk("."):
        for file in files:
            if file.endswith(".gpx"):
                gpx_files.append(os.path.join(root, file))

    return gpx_files
