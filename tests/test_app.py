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

def test_tutorial_static_assets_are_served(client):
    """Tutorial CSS/screenshots must be present in the production Flask artifact."""
    for path in [
        "/static/css/how-to-use.css",
        "/static/assets/tutorial/desktop-home.png",
        "/static/assets/tutorial/mobile-home.jpg",
        "/static/assets/tutorial/desktop-ide.png",
        "/static/assets/tutorial/mobile-ide.jpg",
    ]:
        response = client.get(path)
        assert response.status_code == 200, path




def test_global_day_night_toggle_is_wired(client):
    response = client.get("/en/")
    assert response.status_code == 200
    assert b'data-theme-toggle' in response.data
    assert b'mk.preferences.theme' in response.data

    app_js = client.get("/static/js/app.js")
    assert app_js.status_code == 200
    assert b'mk.preferences.theme' in app_js.data
    assert b'data-theme-toggle' in app_js.data

    tokens = client.get("/static/css/design-tokens.css")
    assert tokens.status_code == 200
    assert b'html[data-theme="night"]' in tokens.data


def test_service_worker_uses_versioned_manabi_cache_name(client):
    response = client.get("/service-worker.js")
    assert response.status_code == 200
    assert b'CACHE_NAME = "manabi-kobo-shell-v' in response.data

    # Keep this intentionally version-agnostic. Cache revisions are expected to
    # change whenever static assets need invalidation; CI should verify that a
    # versioned Manabi Kōbō cache is declared, not block legitimate cache bumps.
    import re
    match = re.search(rb'CACHE_NAME\s*=\s*"manabi-kobo-shell-v(\d+)"', response.data)
    assert match, response.data[:200]
    assert int(match.group(1)) >= 1


def test_how_to_night_mode_uses_canonical_theme_tokens():
    from pathlib import Path
    css = Path("app/static/css/how-to-use.css").read_text(encoding="utf-8")
    assert 'html[data-theme="night"] .guide-hero-copy' in css
    assert 'background:var(--surface2)' in css
    assert 'color:var(--ink)' in css
    assert 'var(--surface-2' not in css
    assert 'var(--text-muted' not in css

def test_how_to_css_cache_version_is_current(client):
    for url in ("/en/how-to-use/", "/en/how-to-use/desktop/", "/en/how-to-use/mobile/"):
        response = client.get(url)
        assert response.status_code == 200
        assert b"how-to-use.css" in response.data
        assert b"v=1.0.2" in response.data


def test_michel_thomas_method_companion_naming_and_guidance(client):
    response = client.get("/en/audio-companion/")
    assert response.status_code == 200
    assert b"Michel Thomas Method Companion" in response.data
    assert b"Finish the audio material first" in response.data
    assert b"independent learning toolkit" in response.data
    assert b"Audio Course Companion" not in response.data


def test_michel_thomas_method_companion_spanish_label(client):
    response = client.get("/es/audio-companion/")
    assert response.status_code == 200
    assert "Compañero del Método Michel Thomas" in response.get_data(as_text=True)
