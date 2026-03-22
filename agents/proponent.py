import os, sys
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from langchain_groq import ChatGroq # type: ignore
from langchain_core.messages import SystemMessage, HumanMessage
from state.debate_state import DebateState, Argument
from utils.prompts import PROPONENT_SYSTEM, build_proponent_prompt


def run_proponent(state: DebateState) -> DebateState:
    """Proponent agent — Llama-3.3 70B via Groq. Argues FOR the topic."""
    llm = ChatGroq(
        model="llama-3.3-70b-versatile",
        api_key=os.getenv("GROQ_API_KEY"),
        temperature=0.9,
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
        model_used="llama-3.3-70b (Groq)",
    )

    state.arguments.append(argument)
    return state
