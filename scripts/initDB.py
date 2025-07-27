import requests
import random
import string
from create_plans import create_plans
from subscribe_users import subscribe_users
from send_requests import send_req_to_test_user

# Names and surnames for more realistic name generation
first_names = ["James", "Mary", "John", "Patricia", "Robert", "Jennifer", "Michael", "Linda", "William", "Elizabeth"]
last_names = ["Smith", "Johnson", "Williams", "Jones", "Brown", "Davis", "Miller", "Wilson", "Moore", "Taylor"]

def generate_realistic_user_v2():
    # Selects random first and last name from predefined lists
    first_name = random.choice(first_names)
    last_name = random.choice(last_names)
    username = (first_name.lower() + last_name.lower())
    password = "12341234"
    email = f"{username}@example.com"
    return {
        "username": username,
        "password": password,
        "confirm_password": password,
        "email": email,
        "firstName": first_name,
        "lastName": last_name,
    }


def create_user(base_url, user_data):
    """
    Function to create a user on a remote server via API.
    Args:
    base_url (str): Base URL of the API endpoint.
    user_data (dict): Dictionary containing user details.
    
    Returns:
    dict: Response from the server.
    """
    # Endpoint URL for creating a user
    endpoint = f"{base_url}/api/register"
    
    # Headers may need to be adapted depending on API requirements
    headers = {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'APIKey': ''
    }
    
    # Make the POST request to create a user
    response = requests.post(endpoint, json=user_data, headers=headers)
    
    # Check if the request was successful
    if response.status_code == 200:
        return response.json()  # Return the json response if successful
    else:
        return {'error': response.status_code, 'message': response.text}

admin_user = {
    "username": "admin",
    "password": "12341234",
    "confirm_password": "12341234",
    "email": "admin@admin.com",
    "firstName": "Admin",
    "lastName": "User",
}

test_user = {
    "username": "test",
    "password": "12341234",
    "confirm_password": "12341234",
    "email": "test@test.com",
    "firstName": "Test",
    "lastName": "Tester",
}

test_users = [generate_realistic_user_v2() for _ in range(100)]
base_url = 'http://localhost:5001'  # Change this to your API's base URL

def create_initial():
    # Create the admin and test user
    results = create_user(base_url, admin_user)
    print(results)
    results = create_user(base_url, test_user)
    print(results)

def create_rest_users():
    # Create the rest of test users
    for user in test_users:
        results = create_user(base_url, user)
        print(results)

if __name__ == "__main__":
    # Base Database
    create_plans()
    create_initial()
    create_rest_users()
    subscribe_users()

    # Send friend requests to the test users id = 2
    send_req_to_test_user()
