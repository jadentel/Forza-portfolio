from data import *
import os
import requests
import pytest

@pytest.mark.parametrize("user", valid_users)
def test_get_user_id(user):
    """
    Test the /api/user/id endpoint
    """
    # user is already logged in
    response = requests.post(BASE_ADDR + '/user/id', json={"sessionID": user["sessionID"]}, headers=DEFAULT_HEADER)

    # Check the response
    assert response.status_code == 200
    data = response.json()
    assert data["message"] == "Success"
    assert data["userID"] != ""

    # save the user id
    user["userID"] = response.json()["userID"]

    assert data["userID"] == user["userID"]

def test_user_api_bad_session_id():
    """
    Test the /api/user/id endpoint with a bad session id
    """
    response = requests.post(BASE_ADDR + '/user/id', json={"sessionID": "999"}, headers=DEFAULT_HEADER)
    assert response.status_code == 404
    assert response.json()["message"] == "Session not found"


@pytest.mark.parametrize("user", valid_users)
def test_get_user_info(user):
    """
    Test the /api/user/info endpoint
    """
    # user is already logged in
    # this takes a userID
    response = requests.post(BASE_ADDR + '/user/info', json={"userID": user["userID"]}, headers=DEFAULT_HEADER)

    # Check the response
    assert response.status_code == 201
    data = response.json()
    assert data["message"] == "Success"
    assert data["user"]["userID"] == int(user["userID"])
    assert data["user"]["username"] == user["username"]
    assert data["user"]["firstName"] == user["firstName"]
    assert data["user"]["lastName"] == user["lastName"]
    assert data["user"]["email"] == user["email"]
    assert "bio" in data["user"].keys()
    assert "planID" in data["user"].keys()
    assert "friends" in data["user"].keys()
    assert "friendRequests" in data["user"].keys()

def test_user_api_bad_user_id():
    """
    Test the /api/user/info endpoint with a bad user id
    """
    response = requests.post(BASE_ADDR + '/user/info', json={"userID": "999"}, headers=DEFAULT_HEADER)
    assert response.status_code == 404
    assert response.json()["message"] == "User not found"

def test_request_friend():
    """
    Test the /api/user/friend/request endpoint
    """
    # user is already logged in
    response = requests.post(BASE_ADDR + '/user/friend/request', json={"from": test_user["userID"], "to": test_user2["userID"]}, headers=DEFAULT_HEADER)

    # Check the response
    assert response.status_code == 201
    data = response.json()
    assert data["message"] == "Friend request sent"

def test_already_sent_friend_request():
    # user is already logged in
    response = requests.post(BASE_ADDR + '/user/friend/request', json={"from": test_user["userID"], "to": test_user2["userID"]}, headers=DEFAULT_HEADER)

    # Check the response
    assert response.status_code == 409
    assert response.json()["message"] == "Request already sent"

def test_request_friend_invalid_to_user_id():
    """
    Test the /api/user/friend/request endpoint with an invalid to user id
    """
    # user is already logged in
    response = requests.post(BASE_ADDR + '/user/friend/request', json={"from": test_user["userID"], "to": 999}, headers=DEFAULT_HEADER)
    print(response.json())

    # Check the response
    assert response.status_code == 404
    assert response.json()["message"] == "User not found"

# invalid from user id
def test_request_friend_invalid_from_user_id():
    """
    Test the /api/user/friend/request endpoint with an invalid from user id
    """
    # user is already logged in
    response = requests.post(BASE_ADDR + '/user/friend/request', json={"from": 999, "to": test_user2["userID"]}, headers=DEFAULT_HEADER)

    # Check the response
    assert response.status_code == 404
    assert response.json()["message"] == "User not found"

def test_accept_friend():
    """
    Test the /api/user/friend/accept endpoint
    """
    # user is already logged in
    response = requests.post(BASE_ADDR + '/user/friend/accept', json={"from": test_user["userID"], "to": test_user2["userID"]}, headers=DEFAULT_HEADER)

    # Check the response
    assert response.status_code == 201
    data = response.json()
    assert data["message"] == "Friend request accepted"

def test_accept_friend_invalid_to_user_id():
    """
    Test the /api/user/friend/accept endpoint with an invalid to user id
    """
    # user is already logged in
    response = requests.post(BASE_ADDR + '/user/friend/accept', json={"from": test_user["userID"], "to": 999}, headers=DEFAULT_HEADER)

    # Check the response
    assert response.status_code == 404
    assert response.json()["message"] == "User not found"

def test_accept_friend_invalid_from_user_id():
    """
    Test the /api/user/friend/accept endpoint with an invalid from user id
    """
    # user is already logged in
    response = requests.post(BASE_ADDR + '/user/friend/accept', json={"from": "999", "to": test_user2["userID"]}, headers=DEFAULT_HEADER)

    # Check the response
    assert response.status_code == 404
    assert response.json()["message"] == "User not found"


def test_remove_friend():
    """
    Test the /api/user/friend/remove endpoint
    """
    # user is already logged in
    response = requests.post(BASE_ADDR + '/user/friend/remove', json={"from": test_user["userID"], "to": test_user2["userID"]}, headers=DEFAULT_HEADER)

    # Check the response
    assert response.status_code == 201
    data = response.json()
    assert data["message"] == "Friend removed"

def test_remove_friend_invalid_to_user_id():
    """
    Test the /api/user/friend/remove endpoint with an invalid to user id
    """
    # user is already logged in
    response = requests.post(BASE_ADDR + '/user/friend/remove', json={"from": test_user["userID"], "to": "999"}, headers=DEFAULT_HEADER)

    # Check the response
    assert response.status_code == 404
    assert response.json()["message"] == "User not found"

def test_remove_friend_invalid_from_user_id():
    # user is already logged in
    response = requests.post(BASE_ADDR + '/user/friend/remove', json={"from": "999", "to": test_user2["userID"]}, headers=DEFAULT_HEADER)

    # Check the response
    assert response.status_code == 404
    assert response.json()["message"] == "User not found"

