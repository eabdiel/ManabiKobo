"""=============================================================================
Native phrase-deck content service
=============================================================================
Purpose:
    Loads the English and Spanish phrase collections extracted from the
    approved V2.6 offline HTML files. Flask templates receive structured data
    and never parse or embed the legacy pages at runtime.
============================================================================="""

from functools import lru_cache
import json
from pathlib import Path

_DATA_FILE = Path(__file__).with_name("phrase_content.json")

_DECK_COPY = {
    "phrases-1": {
        "en": {"kicker":"Foundation deck","title":"Essential Phrases","subtitle":"Build a dependable core of everyday Japanese phrases.","overview":"Use the full deck for browsing, then narrow the list by category or search. Mark phrases locally as memorized and use Focus mode for deliberate review.","usage":["Read the Japanese phrase aloud before revealing the supporting fields.","Compare the natural translation with the literal brain translation.","Mark a phrase memorized only after you can recall it without looking.","Review a small group repeatedly before moving to the next category."],"notes":"Begin with recognition, then speak from the English meaning without reading the Japanese."},
        "es": {"kicker":"Mazo fundamental","title":"Frases esenciales","subtitle":"Construye una base confiable de frases japonesas cotidianas.","overview":"Usa el mazo completo para explorar y luego filtra por categoría o búsqueda. Marca frases localmente como memorizadas y usa el modo Enfoque para un repaso deliberado.","usage":["Lee la frase japonesa en voz alta antes de revisar los campos de apoyo.","Compara la traducción natural con la traducción cerebral literal.","Marca una frase como memorizada solo cuando puedas recordarla sin mirar.","Repasa un grupo pequeño varias veces antes de pasar a la siguiente categoría."],"notes":"Empieza con reconocimiento y luego habla desde el significado en español sin leer el japonés."},
    },
    "phrases-2": {
        "en": {"kicker":"Casual conversation","title":"Natural Conversation","subtitle":"Practice natural expressions for friendly, everyday conversation.","overview":"This deck emphasizes casual phrasing and conversational rhythm. Search, filter, shuffle, and save memorized status only in your browser.","usage":["Check the category before using a phrase so the social tone fits.","Repeat each line at natural speed three times.","Use Focus mode to review one phrase without visual clutter.","Use the category and context together when practicing each phrase."],"notes":"Casual Japanese can sound abrupt when used in the wrong setting. Review category and context together."},
        "es": {"kicker":"Conversación casual","title":"Conversación natural","subtitle":"Practica expresiones naturales para conversaciones cotidianas y amistosas.","overview":"Este mazo enfatiza frases casuales y ritmo conversacional. Busca, filtra, mezcla y guarda el estado memorizado solo en tu navegador.","usage":["Revisa la categoría antes de usar una frase para confirmar el tono social.","Repite cada línea tres veces a velocidad natural.","Usa el modo Enfoque para estudiar una frase sin distracciones.","Usa la categoría y el contexto juntos al practicar cada frase."],"notes":"El japonés casual puede sonar brusco en el contexto equivocado. Estudia la categoría y el contexto juntos."},
    },
    "tech-office-talk": {
        "en": {"kicker":"Professional communication","title":"Tech & Office Talk","subtitle":"Practice practical Japanese for software delivery, meetings, support, and engineering work.","overview":"Use these phrases to recognize and communicate common workplace actions. Start with clear, neutral expressions before adding specialized vocabulary in later releases.","usage":["Read the Japanese phrase and identify the workplace situation.","Repeat the phrase at a calm, professional pace.","Compare the natural translation with the literal structure.","Save phrases that apply to your meetings, tickets, documentation, or code reviews."],"notes":"These starter phrases use neutral professional language. Adjust politeness and terminology to match your team and company."},
        "es": {"kicker":"Comunicación profesional","title":"Tecnología y oficina","subtitle":"Practica japonés útil para entregas de software, reuniones, soporte e ingeniería.","overview":"Usa estas frases para reconocer y comunicar acciones comunes del trabajo. Empieza con expresiones claras y neutrales antes de añadir vocabulario especializado en versiones futuras.","usage":["Lee la frase japonesa e identifica la situación laboral.","Repite la frase con un ritmo profesional y tranquilo.","Compara la traducción natural con la estructura literal.","Guarda frases útiles para reuniones, tickets, documentación o revisiones de código."],"notes":"Estas frases iniciales usan lenguaje profesional neutral. Ajusta la cortesía y terminología según tu equipo y empresa."},
    },
}

@lru_cache(maxsize=1)
def _load() -> dict:
    return json.loads(_DATA_FILE.read_text(encoding="utf-8"))

def get_phrase_deck(slug: str, lang: str) -> dict:
    """Return localized copy and structured phrase rows for one native deck."""
    language = "es" if lang == "es" else "en"
    copy = dict(_DECK_COPY[slug][language])
    copy["items"] = _load()[slug][language]
    copy["slug"] = slug
    return copy
