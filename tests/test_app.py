from app import create_app


def test_health_endpoint():
    app = create_app()
    app.config.update(TESTING=True)
    client = app.test_client()

    response = client.get("/health")

    assert response.status_code == 200
    payload = response.get_json()
    assert payload["status"] == "ok"
    assert payload["application"] == "Manabi Kobo v1.0"
    assert payload["pages"] > 0


def test_language_home_pages_render():
    app = create_app()
    app.config.update(TESTING=True)
    client = app.test_client()

    for path in ("/en/", "/es/"):
        response = client.get(path)
        assert response.status_code == 200
        assert b"MANABI" in response.data.upper()


def test_root_redirects_to_english():
    app = create_app()
    app.config.update(TESTING=True)
    client = app.test_client()

    response = client.get("/")

    assert response.status_code == 302
    assert response.headers["Location"].endswith("/en/")


def test_core_learning_routes_render():
    app = create_app()
    app.config.update(TESTING=True)
    client = app.test_client()

    paths = (
        "/en/kana-dojo/",
        "/en/tracker/",
        "/en/tech-office-talk/",
        "/en/reference-hub/",
        "/en/kanji-hub/",
        "/es/kana-dojo/",
    )
    for path in paths:
        response = client.get(path)
        assert response.status_code == 200, path


def test_unknown_route_returns_404():
    app = create_app()
    app.config.update(TESTING=True)
    client = app.test_client()

    response = client.get("/en/not-a-real-page/")

    assert response.status_code == 404
