import json

from backend_test import _SimpleResponse


def test_simple_response_json_parses_utf8_payload():
    payload = {"status": "ok", "count": 1}
    response = _SimpleResponse(200, json.dumps(payload).encode("utf-8"))

    assert response.status_code == 200
    assert response.text == '{"status": "ok", "count": 1}'
    assert response.json() == payload
