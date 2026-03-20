import os, sys
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from langchain_groq import ChatGroq
from langchain_core.messages import SystemMessage, HumanMessage
from state.debate_state import DebateState, Argument
from utils.prompts import OPPONENT_SYSTEM, build_opponent_prompt


def run_opponent(state: DebateState) -> DebateState:
    """Opponent agent — powered by Llama-3 via Groq. Argues AGAINST the topic."""
    llm = ChatGroq(
        model="llama-3.3-70b-versatile",
        api_key=os.getenv("GROQ_API_KEY"),
        temperature=0.8,
    )

    prompt = build_opponent_prompt(
        topic=state.topic,
        history=state.get_history_text(),
        round_num=state.current_round,
    )

    response = llm.invoke([
        SystemMessage(content=OPPONENT_SYSTEM),
        HumanMessage(content=prompt),
    ])

    argument = Argument(
        agent="opponent",
        round_number=state.current_round,
        content=response.content,
        model_used="llama-3.3-70b-versatile",
    )

    state.arguments.append(argument)
    return state
