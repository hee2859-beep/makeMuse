/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { SkinData, PersonalColorSeason, Tutorial } from "../types";
import { seasonalDetails } from "../lib/analyzer";
import { Palette, Eye, ShieldAlert, Sparkles, BookOpen, Lightbulb } from "lucide-react";
import { motion } from "motion/react";

interface Props {
  skinData: SkinData;
  activeTutorial: Tutorial | null;
  drawArActive: boolean;
  onDrawArOverlay: (enable: boolean) => void;
}

export default function PersonalColorMirror({ skinData, activeTutorial, drawArActive, onDrawArOverlay }: Props) {
  // Use diagnosed color as default, let them toggle around to inspect other seasonal colors as well
  const diagnosedSeason = (skinData.personalColor || "Spring Warm Light") as PersonalColorSeason;
  const [selectedSeason, setSelectedSeason] = useState<PersonalColorSeason>(diagnosedSeason);

  const detail = seasonalDetails[selectedSeason] || seasonalDetails['Spring Warm Light'];

  // Sync state if diagnosed color changes
  React.useEffect(() => {
    if (skinData.personalColor) {
      setSelectedSeason(skinData.personalColor as PersonalColorSeason);
    }
  }, [skinData.personalColor]);

  const toggleArMode = () => {
    onDrawArOverlay(!drawArActive);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 p-4">
      
      {/* 12 Seasonal Selector Rail */}
      <div className="lg:col-span-3 bg-white border border-[#E0EDEE] p-4.5 rounded-[24px] max-h-[460px] overflow-y-auto custom-scrollbar shadow-sm">
        <label className="text-[10px] font-mono text-[#007D85] block mb-3.5 uppercase tracking-widest font-bold">12 types season</label>
        <div className="space-y-1.5">
          {(Object.keys(seasonalDetails) as PersonalColorSeason[]).map(season => {
            const isDiagnosed = season === diagnosedSeason;
            const isSelected = season === selectedSeason;
            const targetDetail = seasonalDetails[season];

            return (
              <button
                key={season}
                onClick={() => setSelectedSeason(season)}
                className={`w-full text-left p-2.5 rounded-2xl text-xs transition-all flex items-center justify-between cursor-pointer border ${
                  isSelected 
                    ? "bg-brand-primary/10 border-brand-primary text-brand-primary font-bold shadow-sm" 
                    : isDiagnosed
                    ? "bg-brand-primary/5 border-dashed border-brand-primary/30 text-brand-dark font-medium"
                    : "bg-[#F8FAFB] border-transparent hover:border-brand-primary/30 text-brand-dark/60 hover:text-brand-dark"
                }`}
              >
                <div className="flex items-center gap-2">
                  <div 
                    className="w-3.5 h-3.5 rounded-full flex-shrink-0 shadow-sm border border-white"
                    style={{ backgroundColor: targetDetail.bestHexes[0] }}
                  />
                  <span className="truncate">{targetDetail.koreanName}</span>
                </div>
                {isDiagnosed && (
                  <span className="text-[9px] bg-brand-primary text-white border border-brand-primary px-1.5 py-0.5 rounded-full font-sans font-bold flex-shrink-0 scale-90">
                    진단
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Seasonal Mirror Advice Panel */}
      <div className="lg:col-span-9 space-y-5">
        
        {/* AR Overlay Makeup Guide Box */}
        <div className="p-5 bg-white border border-[#E0EDEE] rounded-[24px] flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 shadow-sm">
          <div>
            <span className="text-[10px] bg-brand-primary/10 text-brand-primary border border-brand-primary/25 px-2.5 py-0.5 rounded-full font-mono font-bold uppercase">AR OVERLAY</span>
            <h4 className="text-sm font-bold text-brand-dark mt-2 flex flex-wrap items-center gap-2 leading-none">
              가상 메이크업 지침선 노드 투사 <span className="font-mono text-xs text-brand-primary">{activeTutorial ? `[${activeTutorial.title}]` : "[지정 튜토리얼 없음]"}</span>
            </h4>
            <p className="text-xs text-brand-dark/65 mt-2 max-w-xl leading-relaxed">
              {activeTutorial 
                ? `${activeTutorial.koreanTitle} 가이드 선을 좌측 스캐너에 오버레이 투영합니다. 라인에 맞춰 실전 화장을 배치 진행하세요.`
                : "The Sea Map에서 튜토리얼 카드를 선택하시면 해당 과제의 가이드 노드가 스캐너 화면 상단에 정합 투사됩니다."}
            </p>
          </div>

          <button
            onClick={toggleArMode}
            className={`w-full sm:w-auto flex items-center justify-center gap-1.5 px-5 py-3 rounded-2xl text-xs font-bold tracking-wider uppercase cursor-pointer transition-all ${
              drawArActive 
                ? "bg-brand-primary text-white shadow-md shadow-brand-primary/20" 
                : "bg-white hover:bg-[#F3F6F7] text-brand-dark/90 border border-brand-border shadow-sm"
            }`}
          >
            <Eye className="w-4 h-4" />
            {drawArActive ? "AR 가이드 끄기" : "AR 가이드 투사"}
          </button>
        </div>

        {/* Selected Season Detail sheet */}
        <div className="bg-white border border-[#E0EDEE] p-6 rounded-[24px] relative overflow-hidden shadow-sm">
          {/* Subtle colored shadow backdrop */}
          <div 
            className="absolute rounded-full filter blur-[80px] opacity-10 -right-16 -top-16 w-48 h-48"
            style={{ backgroundColor: detail.bestHexes[0] }}
          />

          <div className="flex flex-wrap items-center gap-3 mb-4.5">
            <Palette className="w-5 h-5 text-brand-primary" />
            <h3 className="text-md sm:text-lg font-bold text-brand-dark">
              {detail.koreanName} <span className="text-xs text-brand-dark/50 font-mono ml-1">{detail.seasonName}</span>
            </h3>
            {selectedSeason === diagnosedSeason && (
              <span className="text-[9px] bg-[#E0EFF2] border border-brand-primary/20 text-brand-primary px-2.5 py-0.5 rounded-full font-bold">
                나의 AI 피부 추천 결과
              </span>
            )}
          </div>

          <p className="text-xs sm:text-sm text-brand-dark/75 leading-relaxed mb-6">
            {detail.description}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Swatch & Makeup Palettes */}
            <div className="space-y-4">
              <div>
                <span className="text-[10px] font-mono tracking-widest text-[#007D85] opacity-60 uppercase block mb-2 font-bold">Best seasonal colors</span>
                <div className="flex gap-2">
                  {detail.bestHexes.map((hex, idx) => (
                    <div 
                      key={idx}
                      className="group relative w-10 sm:w-11 aspect-square rounded-2xl border border-white shadow-sm cursor-help transition-transform hover:scale-105"
                      style={{ backgroundColor: hex }}
                      title={hex}
                    >
                      <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 bg-brand-dark text-[8px] font-mono text-white px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                        {hex}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-4 bg-brand-light/35 rounded-[20px] border border-brand-border/40 shadow-inner">
                <span className="text-[10px] font-mono tracking-widest text-[#007D85]/80 uppercase block mb-3 font-bold">Recommended Makeup Palette</span>
                <div className="grid grid-cols-2 gap-3.5">
                  <div className="flex items-center gap-2">
                    <div className="w-4.5 h-4.5 rounded shadow-sm border border-white" style={{ backgroundColor: detail.makeupPalette.base }} />
                    <div>
                      <p className="text-[9px] text-brand-dark/50 leading-none mb-0.5">피부 베이스</p>
                      <p className="text-[10px] font-mono text-brand-dark/80 font-bold leading-none">{detail.makeupPalette.base}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4.5 h-4.5 rounded shadow-sm border border-white" style={{ backgroundColor: detail.makeupPalette.blush }} />
                    <div>
                      <p className="text-[9px] text-brand-dark/50 leading-none mb-0.5">치크 볼륨</p>
                      <p className="text-[10px] font-mono text-brand-dark/80 font-bold leading-none">{detail.makeupPalette.blush}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4.5 h-4.5 rounded shadow-sm border border-white" style={{ backgroundColor: detail.makeupPalette.lip }} />
                    <div>
                      <p className="text-[9px] text-brand-dark/50 leading-none mb-0.5">촉촉 립</p>
                      <p className="text-[10px] font-mono text-brand-dark/80 font-bold leading-none">{detail.makeupPalette.lip}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4.5 h-4.5 rounded shadow-sm border border-white" style={{ backgroundColor: detail.makeupPalette.eyeshadow }} />
                    <div>
                      <p className="text-[9px] text-brand-dark/50 leading-none mb-0.5">눈매 조각</p>
                      <p className="text-[10px] font-mono text-brand-dark/80 font-bold leading-none">{detail.makeupPalette.eyeshadow}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Strategic Beauty Recommendation */}
            <div className="space-y-4">
              <div className="p-4 bg-brand-light/35 rounded-[20px] border border-brand-border/40 flex flex-col justify-between shadow-inner">
                <div>
                  <span className="text-[10px] font-mono tracking-widest text-brand-primary uppercase flex items-center gap-1 mb-2 font-bold">
                    <BookOpen className="w-3.5 h-3.5" />
                    Sea Mirror Direct Advice
                  </span>
                  <p className="text-xs text-brand-dark/80 leading-relaxed">
                    {detail.recommendation}
                  </p>
                </div>
                
                <div className="mt-4 pt-3 border-t border-brand-border/40 flex items-start gap-2">
                  <Lightbulb className="w-4 h-4 text-brand-primary flex-shrink-0 mt-0.5" />
                  <p className="text-[10px] text-brand-dark/50 leading-relaxed font-sans">
                    <strong>프렙 유지 추천:</strong> 이 피부타입은 홍조 정돈 점수가 35점 미만이고 볼 영역 수분도가 60%를 초과할 때 메이크업 밀착 보존력이 가장 정합됩니다. 
                  </p>
                </div>
              </div>
            </div>

          </div>

        </div>

      </div>

    </div>
  );
}
