from data import *
import os
import requests
import pytest

# 1. create a plan
# 2. remove a plan
# 3. list plan ids
# 4. get a plan
# negative tests:
# 1. create a plan with a negative weekly activities
# 2. create a plan with a negative monthly price
# 3. remove a plan that doesn't exist
# 4. get a plan that doesn't exist

# Plans are on the data file
# test_plans are on data file
# plan_ids are on data file

# ================== Positive Test Cases ==================

@pytest.mark.parametrize("plan", test_plans)
def test_create_plan(plan):
    response = requests.post(BASE_ADDR + '/plan/create', json=plan, headers=DEFAULT_HEADER)
    assert response.status_code == 200
    assert response.json()["message"] == "Success"

# get the ids
def test_list_plan_ids():
    global plan_ids
    response = requests.get(BASE_ADDR + '/plan/ids', headers=DEFAULT_HEADER)
    assert response.status_code == 200
    assert response.json()["message"] == "Success"
    # Check that the length of the plans is 4
    assert len(response.json()["planIDs"]) == 4
    # save the plan ids
    plan_ids = list(response.json()["planIDs"])

# Loop over the plan ids and get the data
# depends on the test_list_plan_ids
@pytest.mark.parametrize("planID", plan_ids)
def test_get_plan(planID):
    response = requests.post(BASE_ADDR + '/plan/get', json={"planID": str(planID)}, headers=DEFAULT_HEADER)
    print(response.json())
    assert response.status_code == 200
    assert response.json()["message"] == "Success"
    assert response.json()["plan"]["planName"] in [plan["planName"] for plan in test_plans]
    # save the plan id to the plan
    for plan in test_plans:
        # match on the plan name
        if plan["planName"] == response.json()["plan"]["planName"]:
            # save the plan id to the plan variable
            plan["planID"] = planID


# We got the plan ids, now we can remove the test plan
def test_remove_plan():
    response = requests.post(BASE_ADDR + '/plan/remove', json={"planID": test_plan["planID"]}, headers=DEFAULT_HEADER)
    print(response.json())
    assert response.status_code == 200
    assert response.json()["message"] == "Success"

# ================== Negative Test Cases ==================

def test_create_plan_negative_weekly_activities():
    plan = test_plan.copy()
    plan["weeklyActivities"] = -2
    response = requests.post(BASE_ADDR + '/plan/create', json=plan, headers=DEFAULT_HEADER)
    assert response.status_code == 400
    assert response.json()["message"] == "Weekly activities count cannot be negative"

def test_create_plan_negative_monthly_price():
    plan = test_plan.copy()
    plan["monthlyPrice"] = -1
    response = requests.post(BASE_ADDR + '/plan/create', json=plan, headers=DEFAULT_HEADER)
    assert response.status_code == 400
    assert response.json()["message"] == "Monthly price cannot be negative"

def test_remove_plan_not_found():
    response = requests.post(BASE_ADDR + '/plan/remove', json={"planID": 99999}, headers=DEFAULT_HEADER)
    assert response.status_code == 404
    assert response.json()["message"] == "Plan not found"

def test_get_plan_not_found():
    response = requests.post(BASE_ADDR + '/plan/get', json={"planID": 99999}, headers=DEFAULT_HEADER)
    assert response.status_code == 404
    assert response.json()["message"] == "Plan not found"

