from data import *
import os
import requests
import pytest
import json

# upload_gpx
def test_upload_gpx():
    """
    Test uploading a GPX file
    """
    # Read GPX file
    gpx_file_path = "new.gpx"
    with open(gpx_file_path, "r") as gpx_file:
        gpx_content = gpx_file.read()

    # Upload GPX file
    response = requests.post(BASE_ADDR + '/activity/upload', json={
        "userID" : 1,                                                    # assuming user with id=0 exists
        "activityName": "Edward Boyle to Kiatphontip",
        "public": True,
        "gpxData": gpx_content,
    }, headers=DEFAULT_HEADER)
    
    assert response.status_code == 201
    assert response.json()['message'] == "GPX uploaded successfully"

# upload_empty_gpx
def test_upload_empty_gpx():
    # Test uploading an empty GPX file
    empty_gpx_file_path = "empty.gpx"
    with open(empty_gpx_file_path, "r") as empty_gpx_file:
        empty_content = empty_gpx_file.read()

    response = requests.post(BASE_ADDR + '/activity/upload', json={
        "userID" : 1,
        "activityName": "Edward Boyle to Kiatphontip",
        "public": True,
        "gpxData": empty_content,
    }, headers=DEFAULT_HEADER)

    assert response.status_code == 400
    assert response.json()["message"] == "Failed to parse GPX data"

# get_activities_bad_session_id
def test_get_activities_bad_user_id():
    # Get activity ids belonging to user
    response = requests.post(BASE_ADDR + '/activity/ids', json={
        "userID" : "lalalala",
    }, headers=DEFAULT_HEADER)

    assert response.status_code == 200

    data = response.json()
    assert data["message"] == "Success"
    assert len(data["activityIDs"]) == 0

# get_activity_ids
def test_get_activity_ids():

    # Get activity ids belonging to user
    response = requests.post(BASE_ADDR + '/activity/ids', json={
        "userID" : 1,
    }, headers=DEFAULT_HEADER)
    data = response.json()

    assert response.status_code == 200

    data = response.json()
    assert data["message"] == "Success"
    assert len(data["activityIDs"]) == 1 # we only have 1 activity
    assert data["activityIDs"][0] == 1

# Test with a different user. The api should only return activity ids belonging to the correct user
def test_get_activity_id_second_user():
    # upload gpx
    gpx_file_path = "new.gpx"
    with open(gpx_file_path, "r") as gpx_file:
        gpx_content = gpx_file.read()

    # Upload GPX file
    response = requests.post(BASE_ADDR + '/activity/upload', json={
        "userID" : 2,                                                 # Asuming user tests have run and we have at least 2 users
        "activityName": "Edward Boyle to Kiatphontip 2",
        "public": True,
        "gpxData": gpx_content,
    }, headers=DEFAULT_HEADER)
    
    assert response.status_code == 201
    assert response.json()['message'] == "GPX uploaded successfully"

    # Get activities
    # Get activity ids belonging to user
    response = requests.post(BASE_ADDR + '/activity/ids', json={
        "userID" : 2,
    }, headers=DEFAULT_HEADER)
    data = response.json()

    assert response.status_code == 200

    data = response.json()
    assert data["message"] == "Success"
    assert len(data["activityIDs"]) == 1 # we only have 1 activity
    assert data["activityIDs"][0] == 2 # activity must be different

def test_get_gpx_bad_activity_id():

    # Get gpx
    response = requests.post(BASE_ADDR + '/activity/get', json={
        "userID" : 1,
        "activityID": 420, # This activity doesnt exist
    }, headers=DEFAULT_HEADER)

    assert response.status_code == 404
    data = response.json()
    assert data["message"] == "Activity not found"
    assert "activity" in data

def test_get_gpx_unauthorised():
    # Try to get activity id 2 which is owned by testuser2
    response = requests.post(BASE_ADDR + '/activity/get', json={
        "userID" : 1,
        "activityID": 2,
    }, headers=DEFAULT_HEADER)

    assert response.status_code == 404
    data = response.json()
    assert data["message"] == "Activity not found"
    assert "activity" in data

def test_get_gpx():
    # Try to get activity id 1
    response = requests.post(BASE_ADDR + '/activity/get', json={
        "userID" : 1,
        "activityID": 1,
    }, headers=DEFAULT_HEADER)

    assert response.status_code == 200
    data = response.json()
    assert data["message"] == "Success"
    assert "activity" in data
    assert data["activity"]["activityType"] == "run"
    assert data["activity"]["activityName"] == "Edward Boyle to Kiatphontip"
    assert data["activity"]["createDate"] == "2024-02-18T14:06:08.042891"
    assert data["activity"]["public"] == True
    assert data["activity"]["startTime"] == "2024-02-18T14:06:08.042891"
    assert data["activity"]["duration"] == 25900.0
    assert data["activity"]["distance"] == 2133.5911858934924
    assert "route" in data["activity"]
    assert "waypoints" in data["activity"]["route"]
    assert len(data["activity"]["route"]["waypoints"]) == 2
    assert data["activity"]["route"]["waypoints"][0]["name"] == "Edward Boyle Library, University of Leeds"
    assert data["activity"]["route"]["waypoints"][1]["name"] == "Muay Thai Kiatphontip"
    assert len(data["activity"]["route"]["tracks"]) == 1
    assert data["activity"]["route"]["tracks"][0]["name"] == "Eddy B to Kiatphontip"
    assert len(data["activity"]["route"]["tracks"][0]["points"]) == 174

def test_get_gpx_string():
    # upload another activity
    gpx_file_path = "new.gpx"
    with open(gpx_file_path, "r") as gpx_file:
        gpx_content = gpx_file.read()

    # Upload GPX file
    response = requests.post(BASE_ADDR + '/activity/upload', json={
        "userID" : 1,                                                    # assuming user with id=0 exists
        "activityName": "Edward Boyle to Kiatphontip",
        "public": True,
        "gpxData": gpx_content,
    }, headers=DEFAULT_HEADER)
    
    assert response.status_code == 201
    assert response.json()['message'] == "GPX uploaded successfully"

    # now user 1 should have activity ids 1 and 3
    activity_ids = [1, 2, 3]

    response = requests.post(BASE_ADDR + '/activity/gpx', json={
        "userID" : 1,
        "activityIDs": activity_ids,
    }, headers=DEFAULT_HEADER)

    print(json.dumps({
        "userID" : 1,
        "activityIDs": activity_ids,
    }))

    assert response.status_code == 200
    data = response.json()

    assert data["message"] == "Success"
    assert "gpxData" in data
    assert len(data["gpxData"]) == 3

    # Check if activities are returned for all requested IDs
    assert data["gpxData"][0]["error"] == False
    assert data["gpxData"][0]["activityID"] == 1
    assert data["gpxData"][0]["gpxData"] == gpx_content

    # Activity 2 doest belong to user 1
    assert data["gpxData"][1]["error"] == True
    assert data["gpxData"][1]["activityID"] == 2
    assert data["gpxData"][1]["gpxData"] == ""

    # 3 is good
    assert data["gpxData"][2]["error"] == False
    assert data["gpxData"][2]["activityID"] == 3
    assert data["gpxData"][2]["gpxData"] == gpx_content

def test_remove_gpx():
    # remove
    response = requests.post(BASE_ADDR + '/activity/remove', json={
        "activityID" : 3,                                                    # assuming user with id=0 exists
        "userID" : 1                                                         # we include userID as well to cut down on api calls
    }, headers=DEFAULT_HEADER)

    assert response.status_code == 200
    data = response.json()

    assert data["message"] == "Success"

    # Get activities again
    response = requests.post(BASE_ADDR + '/activity/ids', json={
        "userID" : 1,
    }, headers=DEFAULT_HEADER)
    data = response.json()

    assert response.status_code == 200

    data = response.json()
    assert data["message"] == "Success"
    assert len(data["activityIDs"]) == 1 # we should only have 1 activity again
    assert data["activityIDs"][0] == 1

def test_remove_gpx_unauthorised():
    # remove
    response = requests.post(BASE_ADDR + '/activity/remove', json={
        "activityID" : 2,                                                    # assuming user with id=0 exists
        "userID" : 1                                                         # we include userID as well to cut down on api calls
    }, headers=DEFAULT_HEADER)

    assert response.status_code == 404
    data = response.json()

    assert data["message"] == "Activity not found"

    # Get activities again
    response = requests.post(BASE_ADDR + '/activity/ids', json={
        "userID" : 1,
    }, headers=DEFAULT_HEADER)
    data = response.json()

    assert response.status_code == 200

    data = response.json()
    assert data["message"] == "Success"
    assert len(data["activityIDs"]) == 1 # we should still only have 1 activity
    assert data["activityIDs"][0] == 1
