"""Deterministic Phase 1 MK-LPL compiler/runtime."""
import re
PHRASES={"sumimasen, menyuu o onegaishimasu":"すみません、メニューをお願いします。","hai, kashikomarimashita":"はい、かしこまりました。","hanbaagu teishoku o gochuumon desu ne?":"ハンバーグ定食をご注文ですね？","hajimemashite":"はじめまして。","yoroshiku onegaishimasu":"よろしくお願いします。","kinou wa API no tesuto o kanryou shimashita":"昨日はAPIのテストを完了しました。","kyou wa integration o susumemasu":"今日はインテグレーションを進めます。","burokkaa wa arimasen":"ブロッカーはありません。","hai, sore o kudasai":"はい、それをください。","arigatou gozaimasu":"ありがとうございます。","sumimasen":"すみません。","irasshaimase":"いらっしゃいませ。","kashikomarimashita":"かしこまりました。"}
def compile_source(source):
    diagnostics=[]; errors=[]; lines=source.splitlines()
    if not re.search(r"(?m)^\s*project\s+[A-Za-z_][\w]*",source): errors.append({"severity":"error","line":1,"code":"MK001","message":"Missing project declaration."})
    if "compile japanese." not in source: errors.append({"severity":"error","line":max(1,len(lines)),"code":"MK002","message":"Missing compile japanese.<register> directive."})
    if source.count("(")!=source.count(")"): errors.append({"severity":"error","line":1,"code":"MK003","message":"Unbalanced parentheses."})
    if "function " not in source: diagnostics.append({"severity":"warning","line":1,"code":"MK101","message":"No function declared; project has no reusable language routine."})
    calls=[]
    pattern=re.compile(r'(?P<speaker>\w+)\.say\(\s*"(?P<text>[^"]+)"\s*\)')
    for n,line in enumerate(lines,1):
        for m in pattern.finditer(line):
            raw=m.group("text"); jp=PHRASES.get(raw,raw)
            calls.append({"line":n,"speaker":m.group("speaker").upper(),"romaji":raw,"japanese":jp})
            if "gochuumon desu ne" in raw: diagnostics.append({"severity":"suggestion","line":n,"code":"JP401","message":"Naturalness refactor: ご注文は〜でよろしいですか？ is a more service-oriented confirmation."})
            if raw=="sumimasen": diagnostics.append({"severity":"info","line":n,"code":"JP301","message":"すみません is appropriate for getting attention; context determines alternatives."})
    if not calls and not errors: diagnostics.append({"severity":"warning","line":1,"code":"MK102","message":"No .say(\"...\") runtime statements found."})
    return {"success":not errors,"errors":errors,"diagnostics":diagnostics,"output":calls,"stats":{"lines":len(lines),"statements":len(calls),"errors":len(errors),"diagnostics":len(diagnostics)}}
