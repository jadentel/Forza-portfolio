from data import *
import os
import requests
import pytest

# positive tests:
# 1. subscribe to a plan
# 2. unsubscribe from a plan
# negative tests:
# 1. subscribe with a bad user id
# 2. subscribe with a bad plan id
# 3. unsubscribe with a bad user id
# 4. unsubscribe with a user that has no plan

# ============== Positive Test Cases ==============

# loop over users and subscribe each one to a plan
@pytest.mark.parametrize("user", valid_users) # there are 3 valid users
def test_subscribe(user):
    # user is already logged in
    response = requests.post(BASE_ADDR + '/subscribe', json={"userID": user["userID"], "planID": user["planID"]}, headers=DEFAULT_HEADER)

    # Check the response
    assert response.status_code == 200
    data = response.json()
    assert data["message"] == "Success"

def test_unsubscribe():
    # unsubscribe the admin_user
    response = requests.post(BASE_ADDR + '/unsubscribe', json={"userID": admin_user["userID"]}, headers=DEFAULT_HEADER)

    # Check the response
    assert response.status_code == 200
    data = response.json()
    assert data["message"] == "Success"

# ============== Negative Test Cases ==============
def test_subscribe_bad_user_id():
    # user is already logged in
    response = requests.post(BASE_ADDR + '/subscribe', json={"userID": "999", "planID": 1}, headers=DEFAULT_HEADER)

    # Check the response
    assert response.status_code == 404
    assert response.json()["message"] == "User not found"

def test_subscribe_bad_plan_id():
    # user is already logged in
    response = requests.post(BASE_ADDR + '/subscribe', json={"userID": test_user["userID"], "planID": 999}, headers=DEFAULT_HEADER)

    # Check the response
    assert response.status_code == 404
    assert response.json()["message"] == "Plan not found"

def test_unsubscribe_bad_user_id():
    # user is already logged in
    response = requests.post(BASE_ADDR + '/unsubscribe', json={"userID": "999"}, headers=DEFAULT_HEADER)

    # Check the response
    assert response.status_code == 404
    assert response.json()["message"] == "User not found"
