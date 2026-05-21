/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { SkinData, MakeupEvaluation, Tutorial } from "../types";
import { evaluateMakeupCanvas } from "../lib/analyzer";
import { calculateMakeupPerfection } from "../lib/progress";
import { HelpCircle, RefreshCw, Send, Sparkles, AlertCircle, Bookmark, Wand2, Star } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface Props {
  skinData: SkinData;
  activeTutorial: Tutorial | null;
  onEvaluateComplete: (evalData: MakeupEvaluation, score: number) => void;
  onModifyCanvasParams: (params: { eyelinerGap: number; lipOverstep: number; splotchiness: number }) => void;
}

export default function FinalPearlFeedback({ skinData, activeTutorial, onEvaluateComplete, onModifyCanvasParams }: Props) {
  const [isEvaluating, setIsEvaluating] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Sliders representing their makeup precision playground
  const [eyelinerGap, setEyelinerGap] = useState<number>(3); // mm / px asymmetry
  const [lipOverstep, setLipOverstep] = useState<number>(8); // percentage out of bounds
  const [splotchiness, setSplotchiness] = useState<number>(12); // standard deviation cakeyness

  // Main evaluation return
  const [report, setReport] = useState<MakeupEvaluation>({
    baseUniformity: 15,
    eyelinerSymmetry: 3,
    lipBorderOverstep: 8,
    feedbackMessage: "",
    analyzedAt: null
  });
  
  const [perfectionScore, setPerfectionScore] = useState<number>(92);

  const handleSliderChange = (
    type: 'eyeliner' | 'lip' | 'foundation',
    val: number
  ) => {
    let freshEyeliner = eyelinerGap;
    let freshLip = lipOverstep;
    let freshSplotch = splotchiness;

    if (type === 'eyeliner') {
      setEyelinerGap(val);
      freshEyeliner = val;
    } else if (type === 'lip') {
      setLipOverstep(val);
      freshLip = val;
    } else if (type === 'foundation') {
      setSplotchiness(val);
      freshSplotch = val;
    }

    // Trigger canvas modifier hook so the drawing canvas updates to reflect their sliders
    onModifyCanvasParams({
      eyelinerGap: freshEyeliner,
      lipOverstep: freshLip,
      splotchiness: freshSplotch
    });
  };

  const executeMakeupEvaluation = async () => {
    setIsEvaluating(true);
    setErrorMessage(null);

    // Compute basic local vision evaluation stats
    const baseEval = {
      baseUniformity: Math.min(100, Math.floor(splotchiness * 2.5)),
      eyelinerSymmetry: eyelinerGap,
      lipBorderOverstep: lipOverstep,
      analyzedAt: new Date().toLocaleTimeString('ko-KR')
    };

    const calculatedScore = calculateMakeupPerfection({
      ...baseEval,
      feedbackMessage: ""
    });

    try {
      const response = await fetch("/api/gemini/pearl-tip", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          stage: 'makeup-feedback',
          textureScore: skinData.textureScore,
          moistureScore: skinData.moistureScore,
          personalColor: skinData.personalColor,
          baseUniformity: baseEval.baseUniformity,
          eyelinerSymmetry: baseEval.eyelinerSymmetry,
          lipBorderOverstep: baseEval.lipBorderOverstep,
          targetTutorial: activeTutorial?.koreanTitle || "기본 메이크업 교정"
        })
      });

      if (!response.ok) {
        throw new Error("서버와의 통신 오류가 일어났습니다.");
      }

      const data = await response.json();
      
      const completeReport: MakeupEvaluation = {
        ...baseEval,
        feedbackMessage: data.feedback
      };

      setReport(completeReport);
      setPerfectionScore(calculatedScore);
      onEvaluateComplete(completeReport, calculatedScore);

    } catch (err: any) {
      console.error("Failed to query Gemini API:", err);
      
      // Beautiful fallback critique feedback if server is offline or key missing
      let fallbackMessage = `[바다의 전언] Gemini API가 원활하지 않아 시뮬레이션 기반의 수학적 크리틱 결과를 우선 출력합니다.
      
💡 분석 피드백:
1. 파운데이션 고르게 펴바르기(뭉침 ${baseEval.baseUniformity}%): 볼 안쪽 구역의 컬러 균일도는 매우 양호하지만 코 옆은 두께가 얇지 못합니다. 얇은 웨이브 패드를 두드려 정합률을 높이세요.
2. 아이라인 비대칭(${baseEval.eyelinerSymmetry}px 오차): 오른쪽 눈꼬리선이 수평선 너머로 살짝 상승했습니다. 가이딩 점선을 확인하며 약 1.5mm 끌어내립니다.
3. 립 슬립 방지(${baseEval.lipBorderOverstep}%): 립 마진 오버핏이 수려하게 연출되었습니다. 구각의 가장자리를 스펀지 투명 파우더로 눌러 색 번짐을 차단하세요.`;

      const completeReport: MakeupEvaluation = {
        ...baseEval,
        feedbackMessage: fallbackMessage
      };

      setReport(completeReport);
      setPerfectionScore(calculatedScore);
      onEvaluateComplete(completeReport, calculatedScore);
    } finally {
      setIsEvaluating(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start p-4">
      
      {/* Simulation Controllers Sheet */}
      <div className="lg:col-span-5 bg-white border border-[#E0EDEE] p-5 rounded-[24px] space-y-5 shadow-sm">
        <div>
          <span className="text-[10px] font-mono tracking-widest text-brand-primary uppercase font-bold">Dual-Step CV Evaluation</span>
          <h4 className="text-sm font-bold text-brand-dark mt-1 flex items-center gap-1.5 leading-none">
            <Wand2 className="w-4 h-4 text-brand-primary" /> 실전 화장 좌표 파라미터 조율
          </h4>
          <p className="text-[11px] text-brand-dark/65 mt-1.5 leading-relaxed">
            파우더와 붓 터치를 완료하신 후, 현재 내 거울 속 비대칭률을 조율해 보세요. AI 스캐너가 실시간 픽셀 오차 및 뭉침률을 재계산합니다.
          </p>
        </div>

        {/* Foundation Cakeyness (Uniformity Anomaly) */}
        <div className="space-y-2">
          <div className="flex justify-between items-center text-xs">
            <span className="text-brand-dark/80 font-semibold">파운데이션 뭉침/결점 편차</span>
            <span className="font-mono text-brand-primary font-bold">{Math.min(100, Math.floor(splotchiness * 2.5))}%</span>
          </div>
          <input
            type="range"
            min={1}
            max={35}
            value={splotchiness}
            onChange={(e) => handleSliderChange('foundation', parseInt(e.target.value))}
            className="w-full accent-brand-primary h-1 bg-brand-light rounded-2xl appearance-none cursor-pointer"
          />
          <div className="flex justify-between text-[9px] text-brand-dark/40 font-mono">
            <span>0% (매우 밀착)</span>
            <span>100% (들뜸/뭉침 다수)</span>
          </div>
        </div>

        {/* Eyeliner Asymmetry gap */}
        <div className="space-y-2">
          <div className="flex justify-between items-center text-xs">
            <span className="text-brand-dark/80 font-semibold">아이라인 좌우 비대칭 격차</span>
            <span className="font-mono text-brand-primary font-bold">{eyelinerGap} px 오차</span>
          </div>
          <input
            type="range"
            min={0}
            max={20}
            value={eyelinerGap}
            onChange={(e) => handleSliderChange('eyeliner', parseInt(e.target.value))}
            className="w-full accent-brand-primary h-1 bg-brand-light rounded-2xl appearance-none cursor-pointer"
          />
          <div className="flex justify-between text-[9px] text-brand-dark/40 font-mono">
            <span>0px (완벽 대칭)</span>
            <span>20px (심각한 비대칭)</span>
          </div>
        </div>

        {/* Lip border spill */}
        <div className="space-y-2">
          <div className="flex justify-between items-center text-xs">
            <span className="text-brand-dark/80 font-semibold">입술 라인 영역 일탈도</span>
            <span className="font-mono text-brand-primary font-bold">{lipOverstep}% 오버랩</span>
          </div>
          <input
            type="range"
            min={0}
            max={65}
            value={lipOverstep}
            onChange={(e) => handleSliderChange('lip', parseInt(e.target.value))}
            className="w-full accent-brand-primary h-1 bg-brand-light rounded-2xl appearance-none cursor-pointer"
          />
          <div className="flex justify-between text-[9px] text-brand-dark/40 font-mono">
            <span>0% (안정 수렴)</span>
            <span>100% (외각 침범번짐)</span>
          </div>
        </div>

        {/* Dual-Step Scan Trigger Button */}
        <button
          onClick={executeMakeupEvaluation}
          disabled={isEvaluating}
          className="w-full py-3 rounded-2xl bg-brand-primary hover:bg-[#00474F] text-white font-bold text-xs tracking-wider uppercase flex items-center justify-center gap-1.5 shadow-md shadow-brand-primary/10 cursor-pointer transition-colors disabled:opacity-50"
          id="btn_evaluate_makeup"
        >
          <Sparkles className="w-3.5 h-3.5" />
          {isEvaluating ? "Analyzing via Coral Mesh..." : "메이크업 최종 평가 & AI 조언 요청"}
        </button>

      </div>

      {/* Dynamic Feedback Screen */}
      <div className="lg:col-span-7 space-y-4">
        
        {/* Aggregated Makeup Perfection Score Box */}
        <div className="bg-white border border-[#E0EDEE] p-5 rounded-[24px] flex items-center justify-between shadow-sm">
          <div>
            <span className="text-[10px] font-mono tracking-widest text-brand-primary uppercase font-bold">Final Perfection</span>
            <h4 className="text-md font-bold text-brand-dark mt-1">대칭 정밀도 지수</h4>
            <p className="text-[10px] text-brand-dark/50 mt-0.5">화장 뭉침지수, 대칭격차, 립 영역 일탈도 복합 지수</p>
          </div>
          <div className="text-right">
            <span className="text-3xl font-mono font-bold text-brand-primary">{perfectionScore}</span>
            <span className="text-xs text-brand-dark/50 font-mono"> / 100</span>
          </div>
        </div>

        {/* Floating Pearl Tip Modal */}
        <div className="bg-white border border-[#E0EDEE] p-6 rounded-[24px] relative overflow-hidden shadow-sm" id="pearl_tip_modal">
          
          <div className="flex items-center gap-2 mb-3.5 pb-2.5 border-b border-brand-border/40">
            <span className="p-1 px-1.5 bg-brand-primary/10 rounded-xl flex items-center justify-center">
              <Star className="w-3.5 h-3.5 text-brand-primary" />
            </span>
            <div>
              <h4 className="text-sm font-bold text-brand-dark leading-none">바다 수호자의 조언: 진주의 조언</h4>
              <p className="text-[9px] font-mono text-brand-dark/50 mt-1 uppercase font-bold">The Final Pearl AI Advisory</p>
            </div>
          </div>

          <ScrollShadow text={report.feedbackMessage || "위 좌측 슬라이더를 조율하신 후 '메이크업 최종 평가' 버튼을 눌러주세요. 바다의 파동을 닮은 진주의 세밀한 메이크업 꿀팁 카드가 AI 전송을 통해 이곳에 펼쳐집니다."} />

          <div className="mt-4 pt-3.5 border-t border-brand-border/40 flex flex-wrap justify-between items-center text-[10px] text-brand-dark/50 gap-2 font-mono">
            <span className="flex items-center gap-1 font-sans text-brand-dark/65 font-medium">
              <Bookmark className="w-3.5 h-3.5 text-brand-primary" /> 연습 타겟: {activeTutorial ? activeTutorial.koreanTitle : "기초 쌩얼 다듬기"}
            </span>
            {report.analyzedAt && (
              <span>최종 스캔 시간: {report.analyzedAt}</span>
            )}
          </div>

        </div>

      </div>

    </div>
  );
}

// Custom typography scroll animation for beautiful premium card feels
interface ScrollShadowProps {
  text: string;
}

function ScrollShadow({ text }: ScrollShadowProps) {
  return (
    <div className="max-h-[220px] overflow-y-auto pr-2 custom-scrollbar">
      <div className="text-xs sm:text-sm text-brand-dark/85 leading-relaxed font-sans whitespace-pre-wrap select-text">
        {text}
      </div>
    </div>
  );
}
