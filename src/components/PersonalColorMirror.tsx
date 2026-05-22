/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { SkinData, PersonalColorSeason, Tutorial } from "../types";
import { seasonalDetails } from "../lib/analyzer";
import { Palette, Eye, ShieldAlert, Sparkles, BookOpen, Lightbulb, ShoppingBag, Tag, Heart, HelpCircle, Gift } from "lucide-react";
import { motion } from "motion/react";
import { cosmeticRecommendations } from "../data/cosmeticsData";

function getCosmeticsImage(item: { brand: string; name: string; type: string; shade: string }): string {
  const name = item.name.toLowerCase();
  const shade = item.shade.toLowerCase();
  const brand = item.brand.toLowerCase();
  const type = item.type;

  if (type === 'lip') {
    // Red / bright / cherry / tomato tint
    if (name.includes('레드') || name.includes('체리') || name.includes('토마토') || shade.includes('red') || shade.includes('cherry') || shade.includes('디오라마')) {
      return "https://images.unsplash.com/photo-1603561591411-07134e71a2a9?auto=format&fit=crop&q=80&w=250&h=250";
    }
    // Deep / burgundies / plum tint
    if (name.includes('플럼') || name.includes('버건디') || name.includes('와인') || shade.includes('plum') || shade.includes('berry') || shade.includes('임패션드') || shade.includes('인플루언서') || shade.includes('스플래쉬')) {
      return "https://images.unsplash.com/photo-1617220828111-eb241adfd2be?auto=format&fit=crop&q=80&w=250&h=250";
    }
    // Soft / Peach / Coral / Nude / Rosewood gloss/balm
    if (name.includes('코랄') || name.includes('포멜로') || name.includes('피치') || name.includes('주르') || name.includes('로즈우드') || shade.includes('peach') || shade.includes('coral') || shade.includes('skin') || name.includes('누빌')) {
      return "https://images.unsplash.com/photo-1625093742435-6fa192b6fb10?auto=format&fit=crop&q=80&w=250&h=250";
    }
    // Default luxury lipsticks
    return "https://images.unsplash.com/photo-1586495777744-4413f21062fa?auto=format&fit=crop&q=80&w=250&h=250";
  }

  if (type === 'blush') {
    // Lavender / Violet / Cool pink / Berry cheek
    if (name.includes('라벤더') || name.includes('퍼플') || name.includes('쿨빔') || name.includes('라즈베리') || shade.includes('pink') || shade.includes('라벤더') || name.includes('체리') || name.includes('블루베리') || name.includes('핑크') || name.includes('쉘 온') || name.includes('자르댕')) {
      return "https://images.unsplash.com/photo-1616683693504-3ea7e9ad6fec?auto=format&fit=crop&q=80&w=250&h=250";
    }
    // Peach / Coral / Beige / Ginger cheek
    if (name.includes('피치') || name.includes('코랄') || name.includes('살구') || name.includes('베이지') || name.includes('진저') || shade.includes('peach') || shade.includes('salgu') || name.includes('에코') || name.includes('지나')) {
      return "https://images.unsplash.com/photo-1631730359575-38e4755d772b?auto=format&fit=crop&q=80&w=250&h=250";
    }
    // Deep blush / glow
    return "https://images.unsplash.com/photo-1512496015851-a90fb38ba796?auto=format&fit=crop&q=80&w=250&h=250";
  }

  if (type === 'eyeshadow') {
    // Cool / Mauve / Grey / Shadow / Silver
    if (name.includes('로즈') || name.includes('뮤트') || name.includes('캐시미어') || name.includes('블랙') || name.includes('플럼') || name.includes('스모키') || name.includes('한남동') || shade.includes('cashmere') || shade.includes('grey') || shade.includes('black') || name.includes('티세') || name.includes('루비')) {
      return "https://images.unsplash.com/photo-1515688594390-b649af70d282?auto=format&fit=crop&q=80&w=250&h=250";
    }
    // Warm / Peach / Caramel / Chocolate / Nude eyeshadow
    return "https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&q=80&w=250&h=250";
  }

  return "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&q=80&w=250&h=250";
}

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
  const [activeCategoryFilter, setActiveCategoryFilter] = useState<'all' | 'lip' | 'blush' | 'eyeshadow'>('all');

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

        {/* Dynamic Roadshop vs Luxury Product Recommendations Panel */}
        {(() => {
          const recommendations = cosmeticRecommendations[selectedSeason] || cosmeticRecommendations['Spring Warm Light'];
          
          const filterProducts = (list: any[]) => {
            if (activeCategoryFilter === 'all') return list;
            return list.filter(item => item.type === activeCategoryFilter);
          };

          const filteredRoadshop = filterProducts(recommendations.roadshop || []);
          const filteredLuxury = filterProducts(recommendations.luxury || []);

          return (
            <div className="bg-white border border-[#E0EDEE] p-6 rounded-[24px] shadow-sm space-y-6" id="cosmetics_recommendation_deck">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-brand-border/40 pb-5">
                <div>
                  <div className="flex items-center gap-2">
                    <ShoppingBag className="w-5 h-5 text-brand-primary" />
                    <span className="text-[10px] font-mono tracking-widest text-[#007D85] uppercase font-bold">Recommended cosmetics</span>
                  </div>
                  <h3 className="text-md sm:text-lg font-bold text-brand-dark mt-1">
                    {detail.koreanName} 맞춤형 화장품 가이드 데크
                  </h3>
                  <p className="text-xs text-brand-dark/60 mt-1">
                    사용자의 퍼스널 컬러에 매치도가 가장 우수한 베스트셀러 제품군을 엄선해 소개합니다.
                  </p>
                </div>

                {/* Category selection filters */}
                <div className="flex flex-wrap gap-1 bg-brand-light p-1 rounded-xl border border-brand-border/25">
                  {[
                    { id: 'all', label: '전체' },
                    { id: 'lip', label: '💄 립' },
                    { id: 'blush', label: '🌸 볼/치크' },
                    { id: 'eyeshadow', label: '👁️ 섀도우' }
                  ].map(filter => (
                    <button
                      key={filter.id}
                      onClick={() => setActiveCategoryFilter(filter.id as any)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-all ${
                        activeCategoryFilter === filter.id 
                          ? "bg-brand-primary text-white font-bold shadow-sm" 
                          : "text-brand-dark/65 hover:text-brand-dark"
                      }`}
                    >
                      {filter.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Divided Roadshop vs Luxury items in responsive grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* 1. Roadshop Budget Category */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2 pb-2.5 border-b border-sky-100">
                    <div className="p-1.5 bg-sky-50 rounded-lg text-sky-600">
                      <Tag className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-800">🛍️ 가심비의 대명사! 로드샵 베스트 추천</h4>
                      <p className="text-[10px] text-slate-400">품질과 가치를 모두 사로잡은 트렌디한 로드숍 아이템</p>
                    </div>
                  </div>

                  <div className="space-y-3.5">
                    {filteredRoadshop.length > 0 ? (
                      filteredRoadshop.map((item, idx) => (
                        <div 
                          key={idx}
                          className="p-3 bg-slate-50/40 hover:bg-[#F2F8F9]/75 border border-slate-150/60 hover:border-brand-primary/20 rounded-2xl transition-all duration-200 group flex gap-3.5 items-stretch shadow-xs"
                        >
                          {/* Left: Beautiful Product Image Container */}
                          <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-xl overflow-hidden flex-shrink-0 border border-slate-200/60 shadow-sm bg-white">
                            <img 
                              src={getCosmeticsImage(item)} 
                              alt={item.name} 
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                              referrerPolicy="no-referrer"
                            />
                            {/* Dynamic Type Badge */}
                            <div className="absolute top-1 left-1 w-6 h-6 rounded-full bg-white/95 backdrop-blur-xs flex items-center justify-center text-[10px] shadow-xs border border-slate-150/60 select-none">
                              {item.type === 'lip' ? "💄" : item.type === 'blush' ? "🌸" : "👁️"}
                            </div>
                          </div>

                          {/* Right: Text Details */}
                          <div className="space-y-1 flex-1 min-w-0 flex flex-col justify-between">
                            <div>
                              <div className="flex justify-between items-start gap-1.5 pb-0.5">
                                <span className="text-[10px] font-bold text-[#007D85] bg-brand-primary/10 border border-brand-primary/15 px-2 py-0.5 rounded-md tracking-tight uppercase">
                                  {item.brand}
                                </span>
                                <span className="text-[9px] font-mono text-brand-primary font-bold bg-[#EAF5F7] px-1.5 py-0.5 rounded-md border border-brand-primary/10 whitespace-nowrap">
                                  {item.price}
                                </span>
                              </div>
                              <h5 className="text-[11px] sm:text-xs font-extrabold text-slate-800 group-hover:text-brand-primary transition-colors line-clamp-1">
                                {item.name}
                              </h5>
                              <p className="text-[10px] font-semibold text-brand-secondary/90 flex items-center gap-1.5">
                                Shade: <span className="font-sans text-brand-dark/85 bg-[#EAF5F7] px-2 py-0.5 rounded-sm font-bold text-[9px]">{item.shade}</span>
                              </p>
                            </div>
                            <p className="text-[10px] text-slate-500 leading-snug font-sans line-clamp-2 mt-0.5">
                              {item.description}
                            </p>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="py-12 text-center text-slate-400 text-xs font-sans">
                         선택한 카테고리에 해당하는 제품 정보가 없습니다.
                      </div>
                    )}
                  </div>
                </div>

                {/* 2. Premium Luxury Category */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2 pb-2.5 border-b border-amber-100">
                    <div className="p-1.5 bg-amber-50 rounded-lg text-amber-600">
                      <Gift className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-800">✨ 고품격 소장 가치! 백화점 럭셔리 추천</h4>
                      <p className="text-[10px] text-amber-600/80 font-semibold font-mono">Premium High-End Masterpieces</p>
                    </div>
                  </div>

                  <div className="space-y-3.5">
                    {filteredLuxury.length > 0 ? (
                      filteredLuxury.map((item, idx) => (
                        <div 
                          key={idx}
                          className="p-3 bg-amber-50/10 hover:bg-amber-50/25 border border-amber-100/35 hover:border-amber-400/20 rounded-2xl transition-all duration-200 group flex gap-3.5 items-stretch shadow-xs"
                        >
                          {/* Left: Beautiful Product Image Container */}
                          <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-xl overflow-hidden flex-shrink-0 border border-amber-200/40 shadow-sm bg-white">
                            <img 
                              src={getCosmeticsImage(item)} 
                              alt={item.name} 
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                              referrerPolicy="no-referrer"
                            />
                            {/* Dynamic Type Badge */}
                            <div className="absolute top-1 left-1 w-6 h-6 rounded-full bg-amber-500/10 backdrop-blur-xs flex items-center justify-center text-[10px] shadow-xs border border-amber-500/20 select-none">
                              {item.type === 'lip' ? "💄" : item.type === 'blush' ? "🌸" : "👁️"}
                            </div>
                          </div>

                          {/* Right: Text Details */}
                          <div className="space-y-1 flex-1 min-w-0 flex flex-col justify-between">
                            <div>
                              <div className="flex justify-between items-start gap-1.5 pb-0.5">
                                <span className="text-[10px] font-extrabold text-amber-800 bg-amber-500/10 border border-amber-500/15 px-2 py-0.5 rounded-md tracking-tight uppercase font-mono">
                                  {item.brand}
                                </span>
                                <span className="text-[9px] font-mono text-amber-700 font-extrabold bg-[#FDF9F0] px-1.5 py-0.5 rounded-md border border-amber-500/15 whitespace-nowrap">
                                  {item.price}
                                </span>
                              </div>
                              <h5 className="text-[11px] sm:text-xs font-extrabold text-slate-800 group-hover:text-amber-700 transition-colors line-clamp-1">
                                {item.name}
                              </h5>
                              <p className="text-[10px] font-semibold text-amber-800/90 flex items-center gap-1.5">
                                Shade: <span className="font-sans text-amber-900 bg-amber-100/45 px-2 py-0.5 rounded-sm font-extrabold text-[9px]">{item.shade}</span>
                              </p>
                            </div>
                            <p className="text-[10px] text-slate-500 leading-snug font-sans line-clamp-2 mt-0.5">
                              {item.description}
                            </p>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="py-12 text-center text-slate-400 text-xs font-sans">
                         선택한 카테고리에 해당하는 제품 정보가 없습니다.
                      </div>
                    )}
                  </div>
                </div>

              </div>
            </div>
          );
        })()}

      </div>

    </div>
  );
}
