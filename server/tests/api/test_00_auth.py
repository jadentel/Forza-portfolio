import os
import requests
import pytest
from data import *

def test_initial_state():
    """
    Testing the initial state of the database
    """
    response = requests.post(BASE_ADDR + '/admin/userinfo', json={}, headers=DEFAULT_HEADER)

    assert response.status_code == 200
    assert response.json()['message'] == "Success"
    assert response.json()['numRegisteredUsers'] == 0

@pytest.mark.parametrize("user", test_users)
def test_register_user(user):
    """
    Testing user registration of a user
    """
    response = requests.post(BASE_ADDR + '/register', json=user, headers=DEFAULT_HEADER)

    assert response.status_code == 201
    assert response.json()['message'] == "User created successfully"



@pytest.mark.parametrize("user", [test_duplicate_email_user])
def test_email_exists(user):
    """
    Testing user registration when email already exists
    """
    response = requests.post(BASE_ADDR + '/register', json=user, headers=DEFAULT_HEADER)

    assert response.status_code == 409
    assert response.json()['message'] == "Email or Username already exists"

@pytest.mark.parametrize("user", [test_duplicate_username_user])
def test_username_exists(user):
    """
    Testing user registration when username already exists
    """
    response = requests.post(BASE_ADDR + '/register', json=user, headers=DEFAULT_HEADER)

    assert response.status_code == 409
    assert response.json()['message'] == "Email or Username already exists"

@pytest.mark.parametrize("user", [test_password_mismatch_user])
def test_password_mismatch(user):
    """
    Testing user registration with password mismatch
    """
    response = requests.post(BASE_ADDR + '/register', json=user, headers=DEFAULT_HEADER)

    assert response.status_code == 400
    assert response.json()['message'] == "Passwords do not match"

@pytest.mark.parametrize("user", [test_invalid_email_user])
def test_invalid_email(user):
    """
    Testing user registration with invalid email
    """
    response = requests.post(BASE_ADDR + '/register', json=user, headers=DEFAULT_HEADER)

    assert response.status_code == 400
    assert response.json()['message'] == "Invalid email format"

@pytest.mark.parametrize("user", test_users)
def test_login(user):
    """
    Testing user login
    """
    response = requests.post(BASE_ADDR + '/login', json={
        "username": user["username"],
        "password": user["password"],
    }, headers=DEFAULT_HEADER)

    assert response.status_code == 201
    assert "User session created" == response.json()['message']
    assert "sessionID" in response.json()

    # Update the sessionID
    user["sessionID"] = response.json()["sessionID"]

# Logout
@pytest.mark.parametrize("user", [test_user3])
def test_logout(user):
    """
    Testing user logout
    """
    response = requests.post(BASE_ADDR + '/logout', json={
        "sessionID": user["sessionID"]
    }, headers=DEFAULT_HEADER)

    print(response)

    assert response.status_code == 200
    assert response.json()['message'] == "Success"

@pytest.mark.parametrize("user", [test_user])
def test_login_incorrect_password(user):
    """
    Testing user login with incorrect password
    """
    bad_user = user.copy()
    bad_user["password"] = "wrongpassword"
    
    response = requests.post(BASE_ADDR + '/login', json=bad_user, headers=DEFAULT_HEADER)
    assert response.status_code == 401
    assert "Password is incorrect" in response.json()['message']

@pytest.mark.parametrize("user", [test_user])
def test_login_user_doesnt_exist(user):
    """
    Testing user login with non-existent user
    """
    bad_user = user.copy()
    bad_user["username"] = "nonexistentuser"

    response = requests.post(BASE_ADDR + '/login', json=bad_user, headers=DEFAULT_HEADER)
    assert response.status_code == 404
    assert "User does not exist" in response.json()['message']

def test_csrf_inexistent_session():
    """
    Testing CSRF token when session does not exist
    """
    response = requests.post(BASE_ADDR + '/csrf', json={"sessionID": "nonexistentsession"}, headers=DEFAULT_HEADER)
    assert response.status_code == 404
    assert "Session doesn't exist" in response.json()['message']
    assert response.json()['csrfToken'] == ""

@pytest.mark.parametrize("user", valid_users)
def test_csrf_success(user):
    """
    Testing CSRF token when session exists
    """
    response = requests.post(BASE_ADDR + '/csrf', json={"sessionID": user["sessionID"]}, headers=DEFAULT_HEADER)
    assert response.status_code == 200
    assert response.json()['csrfToken'] != ""
    assert "Success" in response.json()['message']

