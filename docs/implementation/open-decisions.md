# Open decisions

Resolve before or during the matching implementation phase. Cross-links point at the feature docs that depend on each choice.

1. **Home Track status when free:** Show spend/calories readout with soft upsell, or hide numbers until subscribed?  
   → [Track](./track.md), [RevenueCat](./revenuecat-monetisation.md)

2. **Calorie source for v1:** lookup-only vs hybrid API.  
   → [Calorie estimation](./calorie-estimation.md)

3. **OTP / auth vendor** for India phone login.  
   → [Onboarding and Profile](./onboarding-profile.md)

4. **Reorder source of truth:** MCP reorder-by-orderId vs client-side snapshot remap.  
   → [Reorder](./reorder.md), [Swiggy MCP — Food](./swiggy-mcp-food.md)

5. **Single vs dual cart object:** one cart model with `channel`, or separate Food/Instamart carts that share one review UI.  
   → [Swiggy MCP — Food](./swiggy-mcp-food.md), [Swiggy MCP — Instamart](./swiggy-mcp-instamart.md)

6. **LiveKit hosting:** LiveKit Cloud vs self-hosted; token-minting service ownership.  
   → [Voice ordering](./voice-ordering.md), [`../voice-app-architecture.md`](../voice-app-architecture.md)

7. **Agent runtime:** Python vs Node LiveKit Agents worker for VoiceCart ordering tools.  
   → [Voice ordering](./voice-ordering.md)

8. **Kitchen voice path:** full LiveKit agent session vs STT-only / lighter session for dish + pantry capture.  
   → [Kitchen](./kitchen.md), [Voice ordering](./voice-ordering.md)

9. **Kitchen extras priority** vs Track — product call; engineering default is Instamart core before pantry memory.  
   → [Kitchen](./kitchen.md), [Track](./track.md)

10. **Leaving the LiveKit + Sarvam plugin path** (alternate STT/TTS) — only if latency/cost forces it; would forfeit first-party `agents-plugin-sarvam` integration.  
   → [Voice ordering](./voice-ordering.md), [`../voice-app-architecture.md`](../voice-app-architecture.md)
