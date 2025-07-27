import requests
# Endpoint URL for creating a user
endpoint = f"http://localhost:5001/api/user/id"

# Headers may need to be adapted depending on API requirements
headers = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'APIKey': ''
}

# Make the POST request to create a user
response = requests.post(endpoint, json={
    "sessionID": "3eed68ed2a43ee4112041210b8a41962"
}, headers=headers)

print(response.json())

endpoint = f"http://localhost:5001/api/subscribe"

response = requests.post(endpoint, json={
    "userID": "2",
    "planID": "2"
}, headers=headers)

print(response.json())
