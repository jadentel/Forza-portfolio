import requests
from upload_gpx import upload_gpx_activity, get_gpx_files
import random

# Headers may need to be adapted depending on API requirements
headers = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'APIKey': ''
}

def send_request(from_id, to_id):
    endpoint = f"http://localhost:5001/api/user/friend/request"
    response = requests.post(endpoint, json={
        "from": from_id,
        "to": to_id
    }, headers=headers)

    return response.json()

def accept_request(from_id, to_id):
    endpoint = f"http://localhost:5001/api/user/friend/accept"
    response = requests.post(endpoint, json={
        "from": from_id,
        "to": to_id
    }, headers=headers)

    print(response.json())


users = [i for i in range(10, 15)]
gpx_files = get_gpx_files()

def send_req_to_test_user():
    for user in users:
        # Upload a gpx file for each user
        gpx_file = random.choice(gpx_files)
        print(upload_gpx_activity(user, gpx_file))

        # send requests to test user
        print(send_request(user, 2))

if __name__ == "__main__":
    send_req_to_test_user()
    print("Friend requests sent")       
