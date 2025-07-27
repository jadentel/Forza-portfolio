# Description: This file contains the data used for testing the API. It contains the data for the users and plans.


# Headers for the API
SECRET_KEY = ""
BASE_ADDR = "http://127.0.0.1:5001/api"
DEFAULT_HEADER = {
    "Content-Type" : "application/json",
    "Accept"       : "application/json",
    "APIKey"       : SECRET_KEY
}

# ==== User Data ====

test_user = {
    "username": "joeRodrigez",
    "password": "strongpassword",
    "confirm_password": "strongpassword",
    "email": "joe@rodrigez.com",
    "firstName": "Joe",
    "lastName": "Rodrigez",
    "sessionID": "",
    "userID": "",
    "planID": "1"
}

test_user2 = {
    "username": "joeRodrigez2",
    "password": "strongpassword",
    "confirm_password": "strongpassword",
    "email": "joe2@rodrigez.com",
    "firstName": "Joe2",
    "lastName": "Rodrigez2",
    "sessionID": "",
    "userID": "",
    "planID": "2"
}

test_user3 = {
    "username": "joeRodrigez3",
    "password": "strongpassword",
    "confirm_password": "strongpassword",
    "email": "joe3@rodrigez.com",
    "firstName": "Joe3",
    "lastName": "Rodrigez3",
    "sessionID": "",
    "userID": "",
    "planID": "1"
}
    

admin_user = {
    "username": "admin",
    "password": "admin",
    "confirm_password": "admin",
    "email": "admin@super.com",
    "firstName": "Admin",
    "lastName": "Super",
    "sessionID": "",
    "userID": "",
    "planID": "3"
}

test_users = [test_user, test_user2, test_user3, admin_user]
valid_users = [test_user, test_user2, admin_user]

# ==== Invalid User Tests ====

test_duplicate_email_user = {
    "username": "joeRodrigez2",
    "password": "strongpassword",
    "confirm_password": "strongpassword",
    "email": "joe@rodrigez.com",
    "firstName": "Joe2",
    "lastName": "Rodrigez2"
}

test_duplicate_username_user = {
    "username": "joeRodrigez",
    "password": "strongpassword",
    "confirm_password": "strongpassword",
    "email": "joe2@rodrigez.com",
    "firstName": "Joe2",
    "lastName": "Rodrigez2"
}

test_password_mismatch_user = {
    "username": "joeRodrigez3",
    "password": "strongpassword",
    "confirm_password": "wrongconfirmation",
    "email": "joe3@rodrigez.com",
    "firstName": "Joe3",
    "lastName": "Rodrigez3"
}

test_invalid_email_user = {
    "username": "joeRodrigez4",
    "password": "strongpassword",
    "confirm_password": "wrongconfirmation",
    "email": "invalid",
    "firstName": "Joe3",
    "lastName": "Rodrigez3"
}


# make test in input output format
user_tests = []


# ==== Plan Data ====

free_plan = {
    "planName": "Free Plan",
    "monthlyPrice": 0.0,
    "weeklyActivities": 3,
    "displayFreeBadge": True,
    "friendsAllowed": False,
    "planID": "1"
}

student_plan = {
    "planName": "Student Plan",
    "monthlyPrice": 5.0,
    "weeklyActivities": 5,
    "displayFreeBadge": False,
    "friendsAllowed": True,
    "planID": "2"
}

pro_plan = {
    "planName": "Pro Plan",
    "monthlyPrice": 10.0,
    "weeklyActivities": -1,
    "displayFreeBadge": False,
    "friendsAllowed": True,
    "planID": "3"
}

test_plan = {
    "planName": "Test Plan",
    "monthlyPrice": 0.0,
    "weeklyActivities": 3,
    "displayFreeBadge": True,
    "friendsAllowed": False,
    "planID": "4"
}

test_plans = [free_plan, student_plan, pro_plan, test_plan]

real_plans = [free_plan, student_plan, pro_plan]

plan_ids = []
