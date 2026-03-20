import os, sys
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

import os
from langchain_openai import ChatOpenAI
from langchain_core.messages import SystemMessage, HumanMessage
from state.debate_state import DebateState, Argument
from utils.prompts import OPPONENT_SYSTEM, build_opponent_prompt


def run_opponent(state: DebateState) -> DebateState:
    """Opponent agent — powered by Grok-2. Argues AGAINST the topic."""

    # Grok is OpenAI-compatible, so we use ChatOpenAI with a custom base_url
    llm = ChatOpenAI(
        model="grok-2-latest",
        api_key=os.getenv("GROK_API_KEY"),
        base_url="https://api.x.ai/v1",
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
        model_used="grok-2-latest",
    )

    state.arguments.append(argument)
    return state