import pytest
from services.triage import assess_risk

# --- Green tier examples (low risk) ---
GREEN_MESSAGES = [
    "I had a good day today.",
    "Looking forward to the weekend.",
    "Just finished reading a book.",
    "I love the weather.",
    "My cat is cute.",
    "Feeling neutral, nothing much happening.",
    "I enjoyed my coffee.",
    "Planning a trip soon.",
    "Everything is fine.",
    "Just checking in."
]

# --- Yellow tier examples (moderate distress) ---
YELLOW_MESSAGES = [
    "I can't sleep at night.",
    "I have panic attacks sometimes.",
    "Everything feels hopeless.",
    "I feel worthless these days.",
    "I'm anxious all the time.",
    "I can't cope with my workload.",
    "Feeling down after the meeting.",
    "Stress is building up.",
    "Mai bahut udaas hoon aaj.",
    "Parinda lag raha hai, kuch theek nahi."
]

# --- Red tier examples (crisis) ---
RED_MESSAGES = [
    "I want to die.",
    "I think about ending it all.",
    "There's no point living.",
    "I feel like I'm better off without me.",
    "I want to kill myself.",
    "I can't go on any longer.",
    "I'm thinking of ending my life.",
    "Marna chahta hoon.",
    "Zindagi se thak gaya hoon.",
    "Kuch nahi bacha."
]

@pytest.mark.parametrize("msg", GREEN_MESSAGES)
def test_green_tier(msg):
    assert assess_risk(msg) == "green"

@pytest.mark.parametrize("msg", YELLOW_MESSAGES)
def test_yellow_tier(msg):
    assert assess_risk(msg) == "yellow"

@pytest.mark.parametrize("msg", RED_MESSAGES)
def test_red_tier(msg):
    assert assess_risk(msg) == "red"
