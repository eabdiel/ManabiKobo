from app.services.mkpl_engine import compile_source
def test_valid_project_compiles():
    r=compile_source('project Demo\nfunction run():\n speaker.say("hajimemashite")\ncompile japanese.polite\nend')
    assert r["success"] is True and r["output"][0]["japanese"]=="はじめまして。"
def test_missing_compile_fails():
    r=compile_source('project Demo\nfunction run():\n speaker.say("hajimemashite")')
    assert r["success"] is False and any(x["code"]=="MK002" for x in r["errors"])

def test_restaurant_sample_compiles():
    from app.data.ide_projects import PROJECTS
    r=compile_source(PROJECTS["restaurant"]["files"]["main.mkpl"])
    assert r["success"] is True
    assert r["stats"]["statements"] >= 5
