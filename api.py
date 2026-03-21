import sys, os
sys.path.insert(0, os.path.abspath(os.path.dirname(__file__)))

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
from dotenv import load_dotenv
import json, asyncio

load_dotenv()

from graph.debate_graph import run_debate

app = FastAPI(title="TwoMinds Debate API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
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
        result = run_debate(req.topic, req.rounds)
        
        for arg in result.arguments:
            round_scores = [s for s in result.scores if s.round_number == arg.round_number]
            score_data = None
            if arg.agent == "opponent" and round_scores:
                s = round_scores[0]
                score_data = {
                    "round": s.round_number,
                    "proponent": s.proponent_score,
                    "opponent": s.opponent_score,
                    "reasoning": s.judge_reasoning,
                }
            payload = {
                "type": "argument",
                "agent": arg.agent,
                "round": arg.round_number,
                "content": arg.content,
                "model": arg.model_used,
                "score": score_data,
            }
            yield f"data: {json.dumps(payload)}\n\n"

        totals = result.get_total_scores()
        yield f"data: {json.dumps({'type': 'verdict', 'winner': result.winner, 'scores': totals, 'verdict': result.final_verdict})}\n\n"
        yield "data: [DONE]\n\n"

    return StreamingResponse(generate(), media_type="text/event-stream")

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
