import requests
import random
import string

def create_plan(base_url, plan_data):
    """
    Function to create a user on a remote server via API.
    Args:
    base_url (str): Base URL of the API endpoint.
    user_data (dict): Dictionary containing user details.
    
    Returns:
    dict: Response from the server.
    """
    # Endpoint URL for creating a user
    endpoint = f"{base_url}/api/plan/create"
    
    # Headers may need to be adapted depending on API requirements
    headers = {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'APIKey': ''
    }
    
    # Make the POST request to create a user
    response = requests.post(endpoint, json=plan_data, headers=headers)
    
    # Check if the request was successful
    if response.status_code == 200:
        return response.json()  # Return the json response if successful
    else:
        return {'error': response.status_code, 'message': response.text}



free = {
    "planName": "Free Plan",
    "monthlyPrice": "0.00",
    "weeklyActivities": "3",
    "displayFreeBadge": "True",
    "friendsAllowed": "False"
}

pro = {
    "planName": "Pro Plan",
    "monthlyPrice": "7.99",
    "weeklyActivities": "-1",
    "displayFreeBadge": "False",
    "friendsAllowed": "True"
}

student = {
    "planName": "Student Plan",
    "monthlyPrice": "4.99",
    "weeklyActivities": "-1",
    "displayFreeBadge": "False",
    "friendsAllowed": "True"
}

def create_plans():
    base_url = 'http://localhost:5001'  # Change this to your API's base URL
    plans = [free, pro, student]
    for plan in plans:
        results = create_plan(base_url, plan)
        print(results)
