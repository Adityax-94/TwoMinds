import os, sys, json
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from langchain_groq import ChatGroq
from langchain_core.messages import SystemMessage, HumanMessage
from state.debate_state import DebateState, RoundScore
from utils.prompts import JUDGE_SYSTEM, FINAL_VERDICT_SYSTEM, build_judge_prompt, build_verdict_prompt


def run_judge(state: DebateState) -> DebateState:
    """Judge agent — powered by Llama-3 via Groq. Scores each round."""
    llm = ChatGroq(
        model="llama-3.3-70b-versatile",
        api_key=os.getenv("GROQ_API_KEY"),
        temperature=0.2,
    )

    prompt = build_judge_prompt(
        topic=state.topic,
        history=state.get_history_text(),
        round_num=state.current_round,
    )

    response = llm.invoke([
        SystemMessage(content=JUDGE_SYSTEM),
        HumanMessage(content=prompt),
    ])

    # Parse JSON response
    try:
        raw = response.content.strip()
        if raw.startswith("```"):
            raw = raw.split("```")[1]
            if raw.startswith("json"):
                raw = raw[4:]
        data = json.loads(raw)
    except json.JSONDecodeError:
        data = {
            "proponent_score": 5.0,
            "opponent_score": 5.0,
            "reasoning": "Score parsing failed — defaulting to 5.0 each.",
        }

    score = RoundScore(
        round_number=state.current_round,
        proponent_score=float(data.get("proponent_score", 5.0)),
        opponent_score=float(data.get("opponent_score", 5.0)),
        judge_reasoning=data.get("reasoning", ""),
    )
    state.scores.append(score)
    return state


def run_final_verdict(state: DebateState) -> DebateState:
    """Delivers the final verdict and declares a winner."""
    llm = ChatGroq(
        model="llama-3.3-70b-versatile",
        api_key=os.getenv("GROQ_API_KEY"),
        temperature=0.4,
    )

    totals = state.get_total_scores()
    prompt = build_verdict_prompt(
        topic=state.topic,
        history=state.get_history_text(),
        scores=totals,
    )

    response = llm.invoke([
        SystemMessage(content=FINAL_VERDICT_SYSTEM),
        HumanMessage(content=prompt),
    ])

    state.final_verdict = response.content

    if totals["proponent"] > totals["opponent"]:
        state.winner = "proponent"
    elif totals["opponent"] > totals["proponent"]:
        state.winner = "opponent"
    else:
        state.winner = "tie"

    state.is_complete = True
    return state
