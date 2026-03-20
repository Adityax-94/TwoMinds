import sys, os
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from langgraph.graph import StateGraph, END
from state.debate_state import DebateState
from agents.proponent import run_proponent
from agents.opponent import run_opponent
from agents.judge import run_judge, run_final_verdict


# ── Node wrappers ──────────────────────────────────────────────────────────────
# LangGraph nodes receive and return dicts. We convert to/from DebateState.

def proponent_node(state: dict) -> dict:
    debate = DebateState(**state)
    updated = run_proponent(debate)
    return updated.model_dump()

def opponent_node(state: dict) -> dict:
    debate = DebateState(**state)
    updated = run_opponent(debate)
    return updated.model_dump()

def judge_node(state: dict) -> dict:
    debate = DebateState(**state)
    updated = run_judge(debate)
    return updated.model_dump()

def verdict_node(state: dict) -> dict:
    debate = DebateState(**state)
    updated = run_final_verdict(debate)
    return updated.model_dump()

def increment_round_node(state: dict) -> dict:
    """Bumps the round counter before the next loop."""
    state["current_round"] += 1
    return state


# ── Conditional edge ───────────────────────────────────────────────────────────

def should_continue(state: dict) -> str:
    """After judging: loop back for another round, or end the debate."""
    if state["current_round"] < state["total_rounds"]:
        return "next_round"
    return "final_verdict"


# ── Build graph ────────────────────────────────────────────────────────────────

def build_debate_graph() -> StateGraph:
    graph = StateGraph(dict)

    # Register nodes
    graph.add_node("proponent", proponent_node)
    graph.add_node("opponent", opponent_node)
    graph.add_node("judge", judge_node)
    graph.add_node("increment_round", increment_round_node)
    graph.add_node("final_verdict", verdict_node)

    # Entry point
    graph.set_entry_point("proponent")

    # Fixed edges within a round
    graph.add_edge("proponent", "opponent")
    graph.add_edge("opponent", "judge")

    # Conditional: loop or end
    graph.add_conditional_edges(
        "judge",
        should_continue,
        {
            "next_round": "increment_round",
            "final_verdict": "final_verdict",
        }
    )

    # Loop back for next round
    graph.add_edge("increment_round", "proponent")

    # End after verdict
    graph.add_edge("final_verdict", END)

    return graph.compile()


# ── Run a debate (CLI entry point) ─────────────────────────────────────────────

def run_debate(topic: str, total_rounds: int = 3) -> DebateState:
    """Run a full debate and return the final DebateState."""
    app = build_debate_graph()

    initial_state = DebateState(
        topic=topic,
        total_rounds=total_rounds,
    ).model_dump()

    final_state = app.invoke(initial_state)
    return DebateState(**final_state)


# ── Quick terminal test ────────────────────────────────────────────────────────

if __name__ == "__main__":
    from dotenv import load_dotenv
    load_dotenv()

    topic = "Artificial intelligence will do more harm than good to society"
    print(f"\n🎙️  DEBATE TOPIC: {topic}\n{'='*60}\n")

    result = run_debate(topic, total_rounds=3)

    for arg in result.arguments:
        label = "✅ PRO" if arg.agent == "proponent" else "❌ CON"
        print(f"\n[Round {arg.round_number}] {label} ({arg.model_used})")
        print(arg.content)
        print("-" * 50)

    print("\n📊 SCORES")
    for score in result.scores:
        print(f"  Round {score.round_number}: PRO {score.proponent_score} | CON {score.opponent_score}")
        print(f"  Judge: {score.judge_reasoning}\n")

    totals = result.get_total_scores()
    print(f"\n🏆 WINNER: {result.winner.upper()}")
    print(f"   Final scores — PRO: {totals['proponent']} | CON: {totals['opponent']}")
    print(f"\n📝 VERDICT:\n{result.final_verdict}")