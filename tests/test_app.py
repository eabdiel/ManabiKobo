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


def test_cloud_run_health_contract_is_small_and_cache_safe():
    app = create_app()
    app.config.update(TESTING=True)
    client = app.test_client()

    response = client.get("/health")

    assert response.status_code == 200
    assert response.mimetype == "application/json"
    assert response.get_json()["status"] == "ok"


def test_service_worker_is_available_at_root_scope():
    app = create_app()
    app.config.update(TESTING=True)
    client = app.test_client()

    response = client.get("/service-worker.js")

    assert response.status_code == 200
    assert response.headers["Service-Worker-Allowed"] == "/"


def test_language_ide_route_and_assets_render():
    app = create_app()
    app.config.update(TESTING=True)
    client = app.test_client()

    response = client.get("/en/language-ide/")
    assert response.status_code == 200
    assert b"Language IDE" in response.data
    assert b"PROJECT EXPLORER" in response.data

    for path in (
        "/static/js/language-ide.js",
        "/static/css/language-ide.css",
    ):
        asset = client.get(path)
        assert asset.status_code == 200, path


def test_how_to_use_guides_render():
    app = create_app()
    app.config.update(TESTING=True)
    client = app.test_client()

    for path in (
        "/en/how-to-use/",
        "/en/how-to-use/desktop/",
        "/en/how-to-use/mobile/",
        "/es/how-to-use/desktop/",
        "/es/how-to-use/mobile/",
    ):
        response = client.get(path)
        assert response.status_code == 200, path


def test_reference_intro_uses_neutral_engineering_title():
    app = create_app()
    app.config.update(TESTING=True)
    client = app.test_client()

    response = client.get("/en/reference-hub/")
    assert response.status_code == 200
    assert b"Software and Reliability Engineer" in response.data
    assert b"software and SAP professional" not in response.data
    assert b"I needed a practical workspace" in response.data
