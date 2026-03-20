import sys, os
sys.path.insert(0, os.path.abspath("."))  # ← must be FIRST before any local imports

import sys, os
sys.path.insert(0, os.path.abspath("."))

from dotenv import load_dotenv
load_dotenv()

# Check keys are loaded
print("GEMINI KEY:", os.getenv("GEMINI_API_KEY", "NOT FOUND"))
print("GROK KEY:", os.getenv("GROK_API_KEY", "NOT FOUND"))

from graph.debate_graph import run_debate

print("Running debate...")
r = run_debate("AI will replace programmers", 1)

print("Type of result:", type(r))
print("Arguments count:", len(r.arguments))
print("Is complete:", r.is_complete)

if r.arguments:
    print("First argument:", r.arguments[0].content)
else:
    print("NO ARGUMENTS GENERATED")