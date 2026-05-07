import sys, os
sys.path.insert(0, os.path.abspath(os.path.dirname(__file__)))

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from dotenv import load_dotenv

load_dotenv()

from state.debate_state import DebateState
from agents.proponent import run_proponent
from agents.opponent import run_opponent
from agents.judge import run_judge, run_final_verdict

app = FastAPI(title="TwoMinds Debate API")

app.add_middleware(
    CORSMiddleware,
    
    allow_credentials=False,

    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],

)

class DebateRequest(BaseModel):
    topic: str
    rounds: int = 3

@app.get("/")
def root():
    return {"status": "TwoMinds API running"}

@app.post("/debate")
def debate(req: DebateRequest):
    try:
        state = DebateState(topic=req.topic, total_rounds=req.rounds)

        for round_num in range(1, req.rounds + 1):
            state.current_round = round_num
            state = run_proponent(state)
            state = run_opponent(state)
            state = run_judge(state)

        state = run_final_verdict(state)

        arguments = [
            {
                "agent": arg.agent,
                "round": arg.round_number,
                "content": arg.content,
                "model": arg.model_used,
            }
            for arg in state.arguments
        ]

        scores = [
            {
                "round": s.round_number,
                "proponent": s.proponent_score,
                "opponent": s.opponent_score,
                "reasoning": s.judge_reasoning,
            }
            for s in state.scores
        ]

        totals = state.get_total_scores()
        verdict = {
            "winner": state.winner,
            "scores": totals,
            "verdict": state.final_verdict,
        }

        return {"arguments": arguments, "scores": scores, "verdict": verdict}
    except Exception as exc:
        raise HTTPException(status_code=500, detail=str(exc)) from exc

@app.get("/presets")
def presets():
    return {"topics": [
        "AI will take more jobs than it creates",
        "Remote work is better than office work",
        "Social media does more harm than good",
        "Space exploration is a waste of money",
        "Universal Basic Income should be adopted globally",
        "Cryptocurrency will replace traditional banking",
        "Electric vehicles will save the planet",
    ]}
