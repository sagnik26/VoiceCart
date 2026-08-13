"""VoiceCart Talk agent — Phase 4 echo/hello. No commerce tools."""

from pathlib import Path

from dotenv import load_dotenv
from livekit import agents
from livekit.agents import Agent, AgentServer, AgentSession, TurnHandlingOptions
from livekit.plugins import openai, sarvam

ROOT = Path(__file__).resolve().parent
REPO = ROOT.parent.parent
load_dotenv(REPO / ".env.local")
load_dotenv(REPO / ".env")
load_dotenv(REPO / "apps" / "voicecart" / ".env.local")
load_dotenv(ROOT / ".env")

AGENT_NAME = "voicecart-talk"

INSTRUCTIONS = """
You are VoiceCart Talk in a connectivity check.
Greet the user briefly and acknowledge what they just said in one or two short sentences.
Do not take orders, search restaurants, mention carts, or use tools.
Speak naturally. No lists, markdown, or emoji.
"""


class TalkAgent(Agent):
    def __init__(self) -> None:
        super().__init__(instructions=INSTRUCTIONS)


server = AgentServer()


@server.rtc_session(agent_name=AGENT_NAME)
async def entrypoint(ctx: agents.JobContext) -> None:
    session = AgentSession(
        stt=sarvam.STT(
            language="en-IN",
            model="saaras:v3",
            mode="transcribe",
            flush_signal=True,
        ),
        llm=openai.LLM(model="gpt-5.6-terra"),
        tts=sarvam.TTS(
            model="bulbul:v3",
            target_language_code="en-IN",
            speaker="shubh",
        ),
        turn_handling=TurnHandlingOptions(turn_detection="stt"),
    )
    await session.start(room=ctx.room, agent=TalkAgent())
    await session.generate_reply(
        instructions="Greet the user in one short sentence and wait for them to speak."
    )


if __name__ == "__main__":
    agents.cli.run_app(server)
