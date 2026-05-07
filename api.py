import sys, os
sys.path.insert(0, os.path.abspath(os.path.dirname(__file__)))

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
from dotenv import load_dotenv
import json

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
    def generate():
        try:
            state = DebateState(topic=req.topic, total_rounds=req.rounds)

            for round_num in range(1, req.rounds + 1):
                state.current_round = round_num

                # Proponent argument
                state = run_proponent(state)
                pro_arg = state.arguments[-1]
                yield f"data: {json.dumps({
                    'type': 'argument',
                    'agent': pro_arg.agent,
                    'round': pro_arg.round_number,
                    'content': pro_arg.content,
                    'model': pro_arg.model_used,
                    'score': None,
                })}\n\n"

                # Opponent argument + judge score
                state = run_opponent(state)
                opp_arg = state.arguments[-1]
                state = run_judge(state)
                s = state.scores[-1]
                yield f"data: {json.dumps({
                    'type': 'argument',
                    'agent': opp_arg.agent,
                    'round': opp_arg.round_number,
                    'content': opp_arg.content,
                    'model': opp_arg.model_used,
                    'score': {
                        'round': s.round_number,
                        'proponent': s.proponent_score,
                        'opponent': s.opponent_score,
                        'reasoning': s.judge_reasoning,
                    },
                })}\n\n"

            state = run_final_verdict(state)
            totals = state.get_total_scores()
            yield f"data: {json.dumps({'type': 'verdict', 'winner': state.winner, 'scores': totals, 'verdict': state.final_verdict})}\n\n"
            yield "data: [DONE]\n\n"
        except Exception as exc:
            err_payload = {
                "type": "error",
                "message": "Debate failed. Please try again in a moment.",
                "detail": str(exc),
            }
            yield f"data: {json.dumps(err_payload)}\n\n"
            yield "data: [DONE]\n\n"

    return StreamingResponse(
        generate(),
        media_type="text/event-stream",
        headers={
            "Cache-Control": "no-cache",
            "X-Accel-Buffering": "no",
        },
    )

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
