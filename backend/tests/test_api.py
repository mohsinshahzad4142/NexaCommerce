def test_system_health_endpoint(client):
    response = client.get("/api/v1/devops/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "healthy"

def test_categories_api(client):
    response = client.get("/api/v1/categories")
    assert response.status_code == 200
    assert isinstance(response.json(), list)

def test_swagger_openapi_docs(client):
    response = client.get("/docs")
    assert response.status_code == 200