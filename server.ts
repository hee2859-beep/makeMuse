import express from "express";
import path from "path";
import dotenv from "dotenv";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";

dotenv.config();

// Lazy initialization of the Gemini client to prevent crash on startup if API key is not yet set
let aiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI {
  if (!aiClient) {
    const key = process.env.GEMINI_API_KEY;
    if (!key) {
      throw new Error("GEMINI_API_KEY is required. Please add it to your secrets or environment configuration.");
    }
    aiClient = new GoogleGenAI({
      apiKey: key,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
  }
  return aiClient;
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: "10mb" }));

  // API Route: AI beauty feedback endpoint "The Final Pearl"
  app.post("/api/gemini/pearl-tip", async (req, res) => {
    try {
      const {
        stage, // 'bare-face' or 'makeup-feedback'
        textureScore,
        rednessScore,
        moistureScore,
        skinTone,
        personalColor,
        baseUniformity,
        eyelinerSymmetry,
        lipBorderOverstep,
        targetTutorial
      } = req.body;

      // Verify that we can obtain the safe Gemini client
      let ai;
      try {
        ai = getGeminiClient();
      } catch (keyErr: any) {
        return res.status(200).json({
          success: false,
          error: "API_KEY_MISSING",
          feedback: `[바다의 전언] Gemini API Key가 감지되지 않았습니다. AI 코칭 메세지는 기본 권장 팁으로 제공됩니다.\n\n💡 피부결과 홍조 조절을 위해 해양 추출물 성분의 수분 크림을 발라 피부 장벽을 다듬어주세요.`
        });
      }

      let prompt = "";
      if (stage === 'bare-face') {
        prompt = `사용자의 쌩얼(Bare face) 피부 진단 데이터를 기반으로 전문적이고 따뜻한, 해양 미니멀리즘(Ocean Minimalist) 감성의 맞춤 피부 프렙 팁(Pre-makeup Tip)을 한국어로 작성해주세요.
        
[피부 데이터]
- 피부결 각질/요철도 점수 (수치가 높을수록 거칠음): ${textureScore}/100
- LAB 색공간 측정 홍조 지수 (a* 평균 반응도): ${rednessScore}/100
- 수분 반사율 Luminance 측정 (수분 파도 수치): ${moistureScore}/100
- 감지된 피부톤: ${skinTone}
- 추천 퍼스널 컬러 12타입 분류: ${personalColor}

[작성 지침]
1. 해양 미니멀리즘 감성을 담아 따뜻하고 서정적이면서도 매우 과학적이고 실용적인 톤앤매너로 답변해주세요. (예: "푸른 바다의 신선한 바람을 닮은 레시피", "파도의 밀물과 썰물처럼 수분의 흐름을 조율하세요")
2. 피부결 정돈법, 홍조 진정법, 그리고 이 사용자의 퍼스널 컬러에 입문하기 좋은 간단한 스킨 프렙 팁을 한 장의 진주 카드처럼 아름답게 요약해주세요.
3. 2~3문장의 명확하고 시처럼 우아한 요약 문구를 구성하고, 그 다음 줄바꿈 후 구체적인 팁 3가지를 명확한 번호와 항목명으로 요약해주세요.`;
      } else {
        prompt = `메이크업이 끝난 후 사용자의 메이크업 디테일을 평가하는 'Dual-Step AI Feedback Engine' 데이터를 기반으로 보완 수정을 돕는 아름다운 '진주의 조언(Pearl Tip)'을 한국어로 작성해주세요.

[피부 및 메이크업 피드백 데이터]
- 기본 요약 수치:
  - 피부 프렙 기본 점수: ${textureScore ? textureScore : "진단 누락"}
  - 수분도: ${moistureScore ? moistureScore : "진단 누락"}
  - 퍼스널 컬러 매칭: ${personalColor}
  - 파운데이션 표준 편차 (피부 요철/파운데이션 뭉침 분석): ${baseUniformity}/100 (높을수록 뭉침이 심함)
  - 아이라인 비대칭성 격차 (좌우 눈꼬리 좌표 정밀 오차): ${eyelinerSymmetry}px
  - 립 라인 영역 침범 오차: ${lipBorderOverstep}/100
- 연습 중이었던 튜토리얼 과제: ${targetTutorial || "기본 메이크업 정돈"}

[작성 지침]
1. 따뜻함과 세련미를 겸비한 바다 수호자(Sea Coach)의 마음으로 메이크업 완성도를 조율하고 영감을 주는 조언을 해주세요.
2. 파운데이션 뭉침 여부, 아이라인 대칭성, 립 슬립 여부 각각에 대한 구체적이면서 직관적인 교정 방법(예: "코 옆은 스펀지의 남은 잔여량으로 가볍게 두드리세요", "오른쪽 눈꼬리를 1mm 올려 바다 비상의 선을 맞추세요")을 제시해주세요.
3. 시적인 첫 도입부 요약 문구와 함께, 실전에서 바로 쓸 수 있는 3개의 실용적 메이킹 교정 팁을 제안해주세요.`;
      }

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: prompt,
        config: {
          systemInstruction: "당신은 해양의 순수한 에너지를 지향하고 과학적인 미학을 갖춘 뷰티 및 에스테틱 전문가 '씨핏(Sea-fit) 뷰티 메이트'입니다. 미니멀하고 서정적인 언어로 고급스러운 조언을 제공합니다.",
          temperature: 0.7,
        }
      });

      const feedbackText = response.text || "해당 조건에 알맞은 피드백을 구성하지 못했습니다.";

      return res.json({
        success: true,
        feedback: feedbackText
      });

    } catch (err: any) {
      console.error("Gemini API Error in backend:", err);
      return res.status(500).json({
        success: false,
        error: "INTERNAL_SERVER_ERROR",
        feedback: `[바다의 깊은 잔향] 처리 과정에서 파도의 소용돌이가 일었습니다. 잠시 후 부드러운 밀물 속에서 다시 테스트해 주세요. (오류: ${err.message})`
      });
    }
  });

  // Serve static files in production OR use Vite dev middleware
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[Sea-fit Server] Ocean Waves rolling on http://localhost:${PORT}`);
  });
}

startServer();
