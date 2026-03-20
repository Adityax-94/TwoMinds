import os, sys
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.messages import SystemMessage, HumanMessage
from state.debate_state import DebateState, Argument
from utils.prompts import PROPONENT_SYSTEM, build_proponent_prompt


def run_proponent(state: DebateState) -> DebateState:
    """Proponent agent — powered by Gemini 2.0 Flash. Argues FOR the topic."""
    llm = ChatGoogleGenerativeAI(
        model="gemini-2.0-flash",
        google_api_key=os.getenv("GEMINI_API_KEY"),
        temperature=0.8,
    )

    prompt = build_proponent_prompt(
        topic=state.topic,
        history=state.get_history_text(),
        round_num=state.current_round,
    )

    response = llm.invoke([
        SystemMessage(content=PROPONENT_SYSTEM),
        HumanMessage(content=prompt),
    ])

    argument = Argument(
        agent="proponent",
        round_number=state.current_round,
        content=response.content,
        model_used="gemini-2.0-flash",
    )

    state.arguments.append(argument)
    return state