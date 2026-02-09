import sys
import json
from datetime import datetime
import urllib.request
import urllib.error


class _SimpleResponse:
    def __init__(self, status_code, body):
        self.status_code = status_code
        self._body = body
        self.text = body.decode("utf-8", errors="replace") if isinstance(body, (bytes, bytearray)) else str(body)

    def json(self):
        return json.loads(self.text)


def _request(method, url, headers=None, json_data=None, timeout=10):
    payload = None
    if json_data is not None:
        payload = json.dumps(json_data).encode("utf-8")

    req = urllib.request.Request(url, data=payload, headers=headers or {}, method=method)

    try:
        with urllib.request.urlopen(req, timeout=timeout) as resp:
            return _SimpleResponse(resp.getcode(), resp.read())
    except urllib.error.HTTPError as e:
        return _SimpleResponse(e.code, e.read())


class EucharisticMiraclesAPITester:
    def __init__(self, base_url="http://localhost:8000/api"):
        self.base_url = base_url
        self.token = None
        self.tests_run = 0
        self.tests_passed = 0
        self.test_results = []

    def log_test(self, name, success, details=""):
        """Log test result"""
        self.tests_run += 1
        if success:
            self.tests_passed += 1
            print(f"✅ {name} - PASSED")
        else:
            print(f"❌ {name} - FAILED: {details}")
        
        self.test_results.append({
            "test": name,
            "success": success,
            "details": details
        })

    def run_test(self, name, method, endpoint, expected_status, data=None, headers=None):
        """Run a single API test"""
        url = f"{self.base_url}/{endpoint}"
        test_headers = {'Content-Type': 'application/json'}
        
        if self.token:
            test_headers['Authorization'] = f'Bearer {self.token}'
        
        if headers:
            test_headers.update(headers)

        try:
            if method == 'GET':
                response = _request('GET', url, headers=test_headers, timeout=10)
            elif method == 'POST':
                response = _request('POST', url, headers=test_headers, json_data=data, timeout=10)
            elif method == 'PUT':
                response = _request('PUT', url, headers=test_headers, json_data=data, timeout=10)
            elif method == 'DELETE':
                response = _request('DELETE', url, headers=test_headers, timeout=10)

            success = response.status_code == expected_status
            details = f"Status: {response.status_code}"
            
            if not success:
                details += f" (Expected {expected_status})"
                try:
                    error_data = response.json()
                    details += f" - {error_data.get('detail', 'No error details')}"
                except:
                    details += f" - Response: {response.text[:100]}"

            self.log_test(name, success, details)
            
            if success:
                try:
                    return True, response.json()
                except:
                    return True, {}
            else:
                return False, {}

        except Exception as e:
            self.log_test(name, False, f"Exception: {str(e)}")
            return False, {}

    def test_root_endpoint(self):
        """Test root API endpoint"""
        return self.run_test("Root API endpoint", "GET", "", 200)

    def test_stats_endpoint(self):
        """Test stats endpoint"""
        success, response = self.run_test("Stats endpoint", "GET", "stats", 200)
        if success:
            required_fields = ['total', 'recognized', 'investigating', 'countries']
            for field in required_fields:
                if field not in response:
                    self.log_test(f"Stats - {field} field", False, f"Missing field: {field}")
                    return False
                else:
                    self.log_test(f"Stats - {field} field", True, f"Value: {response[field]}")
        return success

    def test_filters_endpoint(self):
        """Test filters endpoint"""
        success, response = self.run_test("Filters endpoint", "GET", "filters", 200)
        if success:
            required_fields = ['countries', 'centuries']
            for field in required_fields:
                if field not in response:
                    self.log_test(f"Filters - {field} field", False, f"Missing field: {field}")
                    return False
                else:
                    self.log_test(f"Filters - {field} field", True, f"Count: {len(response[field])}")
        return success

    def test_miracles_list(self):
        """Test miracles list endpoint"""
        success, response = self.run_test("Miracles list", "GET", "miracles", 200)
        if success:
            self.log_test("Miracles list format", isinstance(response, list), f"Response type: {type(response)}")
            if isinstance(response, list) and len(response) > 0:
                miracle = response[0]
                required_fields = ['id', 'name', 'country', 'status']
                for field in required_fields:
                    if field in miracle:
                        self.log_test(f"Miracle - {field} field", True, f"Sample: {miracle[field]}")
                    else:
                        self.log_test(f"Miracle - {field} field", False, f"Missing field: {field}")
        return success

    def test_json_template(self):
        """Test JSON template endpoint"""
        success, response = self.run_test("JSON template", "GET", "miracles/template/json", 200)
        if success:
            if 'miracles' in response and isinstance(response['miracles'], list):
                self.log_test("Template format", True, f"Contains {len(response['miracles'])} sample miracles")
            else:
                self.log_test("Template format", False, "Missing 'miracles' array")
        return success

    def test_user_registration(self):
        """Test user registration"""
        test_user = {
            "email": "oscar.romanini.jr@gmail.com",
            "password": "Test123!",
            "name": "Admin Teste"
        }
        
        success, response = self.run_test("User registration", "POST", "auth/register", 200, test_user)
        if success and 'access_token' in response:
            self.token = response['access_token']
            self.log_test("Registration token", True, "Token received")
            return True
        return False

    def test_user_login(self):
        """Test user login"""
        login_data = {
            "email": "oscar.romanini.jr@gmail.com",
            "password": "Test123!"
        }
        
        success, response = self.run_test("User login", "POST", "auth/login", 200, login_data)
        if success and 'access_token' in response:
            self.token = response['access_token']
            self.log_test("Login token", True, "Token received")
            return True
        return False

    def test_auth_me(self):
        """Test authenticated user info"""
        if not self.token:
            self.log_test("Auth /me endpoint", False, "No token available")
            return False
        
        success, response = self.run_test("Auth /me endpoint", "GET", "auth/me", 200)
        if success:
            required_fields = ['id', 'email', 'name']
            for field in required_fields:
                if field in response:
                    self.log_test(f"User info - {field}", True, f"Value: {response[field]}")
                else:
                    self.log_test(f"User info - {field}", False, f"Missing field: {field}")
        return success

    def test_create_miracle(self):
        """Test miracle creation"""
        if not self.token:
            self.log_test("Create miracle", False, "No token available")
            return False

        miracle_data = {
            "name": "Test Miracle",
            "country": "Brasil",
            "country_flag": "🇧🇷",
            "city": "São Paulo",
            "century": "XXI",
            "year": "2024",
            "status": "investigating",
            "historical_context": "Test historical context",
            "phenomenon_description": "Test phenomenon description",
            "church_verdict": "Under investigation",
            "timeline": [],
            "scientific_reports": [],
            "media": [],
            "references": [],
            "translations": {}
        }
        
        success, response = self.run_test("Create miracle", "POST", "miracles", 200, miracle_data)
        if success and 'id' in response:
            self.miracle_id = response['id']
            self.log_test("Miracle creation ID", True, f"ID: {self.miracle_id}")
            return True
        return False

    def test_get_miracle(self):
        """Test get specific miracle"""
        if not hasattr(self, 'miracle_id'):
            self.log_test("Get miracle", False, "No miracle ID available")
            return False
        
        success, response = self.run_test("Get miracle", "GET", f"miracles/{self.miracle_id}", 200)
        if success:
            self.log_test("Miracle retrieval", True, f"Name: {response.get('name', 'N/A')}")
        return success

    def test_bulk_import(self):
        """Test bulk import"""
        if not self.token:
            self.log_test("Bulk import", False, "No token available")
            return False

        bulk_data = {
            "miracles": [
                {
                    "name": "Bulk Test Miracle 1",
                    "country": "Portugal",
                    "country_flag": "🇵🇹",
                    "city": "Fátima",
                    "century": "XX",
                    "status": "recognized",
                    "historical_context": "Test context 1",
                    "phenomenon_description": "Test description 1",
                    "church_verdict": "Recognized",
                    "timeline": [],
                    "scientific_reports": [],
                    "media": [],
                    "references": [],
                    "translations": {}
                }
            ]
        }
        
        success, response = self.run_test("Bulk import", "POST", "miracles/bulk-import", 200, bulk_data)
        if success:
            imported = response.get('imported_count', 0)
            errors = response.get('error_count', 0)
            self.log_test("Bulk import result", True, f"Imported: {imported}, Errors: {errors}")
        return success


    def test_create_contact_message(self):
        payload = {
            "type": "reclamacao",
            "email": "fiel@example.com",
            "subject": "Possível incoerência histórica",
            "message": "No milagre X, encontrei uma data divergente e gostaria de confirmar a fonte."
        }
        success, response = self.run_test("Create contact message", "POST", "contact-messages", 201, payload)
        if success:
            self.log_test("Contact message fields", 'id' in response and response.get('email') == payload['email'], "Payload persisted")
        return success

    def test_list_contact_messages(self):
        if not self.token:
            self.log_test("List contact messages", False, "No token available")
            return False

        success, response = self.run_test("List contact messages", "GET", "contact-messages", 200)
        if success:
            self.log_test("Contact messages list format", isinstance(response, list), f"Response type: {type(response)}")
        return success

    def run_all_tests(self):
        """Run all API tests"""
        print("🚀 Starting Eucharistic Miracles API Tests")
        print(f"📍 Base URL: {self.base_url}")
        print("=" * 60)

        # Public endpoints
        self.test_root_endpoint()
        self.test_stats_endpoint()
        self.test_filters_endpoint()
        self.test_miracles_list()
        self.test_json_template()
        self.test_create_contact_message()

        # Authentication tests
        self.test_user_registration()
        self.test_auth_me()
        
        # Try login if registration failed
        if not self.token:
            self.test_user_login()
            if self.token:
                self.test_auth_me()

        # Protected endpoints (if authenticated)
        if self.token:
            self.test_create_miracle()
            self.test_get_miracle()
            self.test_bulk_import()
            self.test_list_contact_messages()

        # Print summary
        print("\n" + "=" * 60)
        print(f"📊 Test Summary: {self.tests_passed}/{self.tests_run} passed")
        
        if self.tests_passed == self.tests_run:
            print("🎉 All tests passed!")
            return 0
        else:
            print("⚠️  Some tests failed. Check the details above.")
            return 1

def main():
    tester = EucharisticMiraclesAPITester()
    return tester.run_all_tests()

if __name__ == "__main__":
    sys.exit(main())
