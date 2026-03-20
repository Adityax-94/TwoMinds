from typing import List, Optional
from pydantic import BaseModel, Field
 
 
class Argument(BaseModel):
    agent: str                  # "proponent" | "opponent"
    round_number: int
    content: str
    model_used: str             # "gemini" | "grok"
 
 
class RoundScore(BaseModel):
    round_number: int
    proponent_score: float      # 1–10
    opponent_score: float       # 1–10
    judge_reasoning: str
    
class DebateState(BaseModel):
    # Setup
    topic: str = ""
    total_rounds: int = 3
    current_round: int = 1
 
    # History
    arguments: List[Argument] = Field(default_factory=list)
    scores: List[RoundScore] = Field(default_factory=list)
 
    # Final
    winner: Optional[str] = None        # "proponent" | "opponent" | "tie"
    final_verdict: Optional[str] = None
    is_complete: bool = False
 
    def get_history_text(self) -> str:
        """Returns full debate history as formatted text for agent context."""
        if not self.arguments:
            return "No arguments yet."
        lines = []
        for arg in self.arguments:
            label = "PRO" if arg.agent == "proponent" else "CON"
            lines.append(f"[Round {arg.round_number} - {label}]\n{arg.content}\n")
        return "\n".join(lines)
 
    def get_total_scores(self) -> dict:
        """Returns cumulative scores for both agents."""
        pro_total = sum(s.proponent_score for s in self.scores)
        opp_total = sum(s.opponent_score for s in self.scores)
        return {"proponent": round(pro_total, 1), "opponent": round(opp_total, 1)}
 
