"""Backend API tests for Bring Gift Card platform.

Covers:
- Health check
- Cards public endpoint + shape
- Login (success + failure) + /api/me
- Rates POST (update baseRate) with Create-Verify pattern
- Rates PATCH (toggle isActive)
- Users list, create staff, delete staff (cleanup)
"""
import os
import pytest
import requests

BASE_URL = (
    os.environ.get("REACT_APP_BACKEND_URL")
    or os.environ.get("preview_endpoint")
    or "http://localhost:8001"
).rstrip("/")

MASTER_USER = "bringgiftcard"
MASTER_PASS = "xuanjuanloki"


@pytest.fixture(scope="session")
def api():
    s = requests.Session()
    s.headers.update({"Content-Type": "application/json"})
    return s


@pytest.fixture(scope="session")
def token(api):
    r = api.post(f"{BASE_URL}/api/login", json={"username": MASTER_USER, "password": MASTER_PASS})
    assert r.status_code == 200, r.text
    tok = r.json().get("token")
    assert tok
    return tok


@pytest.fixture(scope="session")
def auth(api, token):
    s = requests.Session()
    s.headers.update({"Content-Type": "application/json", "Authorization": f"Bearer {token}"})
    return s


# ---------- Health ----------
def test_health(api):
    r = api.get(f"{BASE_URL}/api/health")
    assert r.status_code == 200
    assert r.json() == {"ok": True}


# ---------- Cards ----------
def test_cards_public_list(api):
    r = api.get(f"{BASE_URL}/api/cards")
    assert r.status_code == 200
    data = r.json()
    assert isinstance(data, list)
    assert len(data) >= 1
    c = data[0]
    for k in ("id", "brand", "slug", "imageUrl", "baseRate", "isActive"):
        assert k in c
    assert isinstance(c["baseRate"], (int, float))


# ---------- Auth ----------
def test_login_bad_credentials(api):
    r = api.post(f"{BASE_URL}/api/login", json={"username": MASTER_USER, "password": "wrongpass"})
    assert r.status_code == 401
    assert "error" in r.json()


def test_login_success_and_me(api, token, auth):
    r = auth.get(f"{BASE_URL}/api/me")
    assert r.status_code == 200
    u = r.json()["user"]
    assert u["username"] == MASTER_USER
    assert u["role"] == "master"


def test_me_requires_auth(api):
    r = api.get(f"{BASE_URL}/api/me")
    assert r.status_code == 401


# ---------- Rates ----------
def test_rate_update_and_persistence(auth):
    # Pick card id 1 (Steam), remember original
    original = requests.get(f"{BASE_URL}/api/cards").json()
    card1 = next(c for c in original if c["id"] == "1")
    orig_rate = card1["baseRate"]

    new_rate = 0.77
    r = auth.post(f"{BASE_URL}/api/rates", json={"id": 1, "baseRate": new_rate})
    assert r.status_code == 200, r.text
    updated = r.json()["card"]
    assert abs(updated["baseRate"] - new_rate) < 1e-6

    # GET verify persistence
    cards = requests.get(f"{BASE_URL}/api/cards").json()
    c = next(c for c in cards if c["id"] == "1")
    assert abs(c["baseRate"] - new_rate) < 1e-6

    # Restore
    auth.post(f"{BASE_URL}/api/rates", json={"id": 1, "baseRate": orig_rate})


def test_rate_invalid_baseRate(auth):
    r = auth.post(f"{BASE_URL}/api/rates", json={"id": 1, "baseRate": 2.5})
    assert r.status_code == 400


def test_rate_requires_auth():
    r = requests.post(f"{BASE_URL}/api/rates", json={"id": 1, "baseRate": 0.5})
    assert r.status_code == 401


def test_rate_toggle_isactive(auth):
    r = auth.patch(f"{BASE_URL}/api/rates", json={"id": 1, "isActive": True})
    assert r.status_code == 200
    assert r.json()["card"]["isActive"] is True


# ---------- Users ----------
def test_users_list_master(auth):
    r = auth.get(f"{BASE_URL}/api/users")
    assert r.status_code == 200
    users = r.json()["users"]
    assert any(u["username"] == MASTER_USER for u in users)


def test_users_list_requires_auth():
    r = requests.get(f"{BASE_URL}/api/users")
    assert r.status_code == 401


def test_create_and_delete_staff_user(auth):
    # Create
    payload = {"username": "TEST_staff_pytest", "password": "temppass123", "role": "staff"}
    r = auth.post(f"{BASE_URL}/api/users", json=payload)
    assert r.status_code in (200, 201), r.text
    u = r.json()["user"]
    assert u["username"] == "TEST_staff_pytest"
    assert u["role"] == "staff"
    user_id = u["id"]

    # Verify in list
    listing = auth.get(f"{BASE_URL}/api/users").json()["users"]
    assert any(x["id"] == user_id for x in listing)

    # New user can log in
    login_r = requests.post(f"{BASE_URL}/api/login",
                            json={"username": "TEST_staff_pytest", "password": "temppass123"})
    assert login_r.status_code == 200

    # Cleanup: delete
    d = auth.delete(f"{BASE_URL}/api/users?id={user_id}")
    assert d.status_code == 200
    listing2 = auth.get(f"{BASE_URL}/api/users").json()["users"]
    assert not any(x["id"] == user_id for x in listing2)


def test_create_user_duplicate_username(auth):
    payload = {"username": "TEST_dup_user", "password": "temppass123", "role": "staff"}
    r1 = auth.post(f"{BASE_URL}/api/users", json=payload)
    assert r1.status_code in (200, 201)
    uid = r1.json()["user"]["id"]
    try:
        r2 = auth.post(f"{BASE_URL}/api/users", json=payload)
        assert r2.status_code in (400, 409)
    finally:
        auth.delete(f"{BASE_URL}/api/users?id={uid}")
