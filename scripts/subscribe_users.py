import requests
import random

def subscribe_user(userID, planID):
    base_url = 'http://localhost:5001'  # Change this to your API's base URL
    endpoint = f"{base_url}/api/subscribe"
    headers = {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'APIKey': ''
    }

    # Make the POST request to create a user
    response = requests.post(endpoint, json={
        "userID" : userID,
        "planID" : planID
    }, headers=headers)

    if response.status_code == 200:
        return response.json()
    else:
        return {'error': response.status_code, 'message': response.text}
    

users = [i for i in range(2, 50)] 
plans = [1, 2, 3]

def subscribe_users():
    for user in users:
        # pick a random plan
        plan = random.choice(plans)
        print(subscribe_user(user, plan))

   
