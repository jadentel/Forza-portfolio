from data import *
import os
import requests
import pytest

"""
### Admin API endpoints:

#### Get User info: `api/admin/userinfo`

**REQUEST : POST**

```json
{
    // empty
}
```

```json
{
    "message" : "Success",
    "numRegisteredUsers" : "__numRegisteredUsers__"
}, 200
```

**RESPONSE**

#### Get financial info: `api/admin/finance`

**REQUEST : POST**

```json
{
    // empty
}
```

**RESPONSE**

```json
{
    "message" : "Success"
    "data" : [
        {
            "planID" : "__planID__",
            "numSubscribers" : "__numSubscibers__",
            "monthlyRevenue" : "__monthlyRevenue__"
        }
    ]
}, 200
```
"""

# Positive test cases
# 1. get user info
# 2. get financial info
# Integrity tests
# 1. Check that users are as expected

# ================== Positive Test Cases ==================
def test_get_user_info():
    response = requests.post(BASE_ADDR + '/admin/userinfo', headers=DEFAULT_HEADER)
    assert response.ok
    data = response.json()
    assert data["message"] == "Success"
    assert data["numRegisteredUsers"] == len(valid_users + [admin_user])

def test_get_financial_info():
    response = requests.post(BASE_ADDR + '/admin/finance', headers=DEFAULT_HEADER)
    assert response.ok
    data = response.json()
    assert data["message"] == "Success"
    print(data["data"])

