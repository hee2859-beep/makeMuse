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
  const [activeCategoryFilter, setActiveCategoryFilter] = useState<'all' | 'lip' | 'blush' | 'eyeshadow' | 'mascara' | 'eyeliner'>('all');

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
    <div className="flex flex-col gap-6 p-4">
      
      {/* Top half: Grid of seasons list and main details */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        
        {/* 12 Seasonal Selector Rail */}
        <div className="lg:col-span-4 bg-white border border-[#E0EDEE] p-5 rounded-[24px] shadow-sm flex flex-col h-full justify-between">
          <div>
            <label className="text-xs font-mono text-[#007D85] block mb-3.5 uppercase tracking-widest font-extrabold flex-shrink-0">12 types season</label>
            <div className="flex flex-col gap-2">
              {(Object.keys(seasonalDetails) as PersonalColorSeason[]).map(season => {
                const isDiagnosed = season === diagnosedSeason;
                const isSelected = season === selectedSeason;
                const targetDetail = seasonalDetails[season];

                return (
                  <button
                    key={season}
                    onClick={() => setSelectedSeason(season)}
                    className={`w-full text-left p-3 rounded-xl text-xs sm:text-sm transition-all flex items-center justify-between cursor-pointer border ${
                      isSelected 
                        ? "bg-brand-primary/10 border-brand-primary text-brand-primary font-bold shadow-sm" 
                        : isDiagnosed
                        ? "bg-brand-primary/5 border-dashed border-brand-primary/30 text-brand-dark font-semibold"
                        : "bg-[#F8FAFB] border-transparent hover:border-brand-primary/30 text-brand-dark/70 hover:text-brand-dark"
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0 mr-1.5">
                      <div 
                        className="w-4 h-4 rounded-full flex-shrink-0 shadow-sm border border-white"
                        style={{ backgroundColor: targetDetail.bestHexes[0] }}
                      />
                      <span className="whitespace-nowrap text-xs sm:text-sm font-semibold text-brand-dark">{targetDetail.koreanName}</span>
                    </div>
                    {isDiagnosed && (
                      <span className="text-[10px] bg-brand-primary text-white border border-brand-primary px-2 py-0.5 rounded-full font-sans font-bold flex-shrink-0">
                        진단
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Selected Season Detail sheet */}
        <div className="lg:col-span-8 h-full">
          <div className="bg-white border border-[#E0EDEE] p-6 rounded-[24px] relative overflow-hidden shadow-sm h-full flex flex-col gap-6.5 justify-between">
            {/* Subtle colored shadow backdrop */}
            <div 
              className="absolute rounded-full filter blur-[80px] opacity-10 -right-16 -top-16 w-48 h-48"
              style={{ backgroundColor: detail.bestHexes[0] }}
            />

            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-brand-border/40 pb-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-brand-primary/10 rounded-xl text-brand-primary">
                  <Palette className="w-5.5 h-5.5" />
                </div>
                <div>
                  <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-brand-dark flex items-center gap-2 flex-wrap">
                    {detail.koreanName}
                    <span className="text-xs sm:text-sm text-brand-dark/40 font-mono font-medium">{detail.seasonName}</span>
                  </h3>
                  <p className="text-xs sm:text-sm text-brand-dark/55 font-medium">Personal Color Diagnosis & Advice Profile</p>
                </div>
              </div>
              {selectedSeason === diagnosedSeason && (
                <span className="text-xs sm:text-sm bg-[#E0EFF2] border border-brand-primary/25 text-brand-primary px-3.5 py-1.5 rounded-full font-extrabold shadow-sm flex items-center gap-1.5 animate-pulse">
                  <Sparkles className="w-4 h-4" />
                  나의 AI 피부 추천 결과
                </span>
              )}
            </div>

            {/* 1. 설명 (Description Card) */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <span className="w-2 h-4 bg-brand-primary rounded-full"></span>
                <span className="text-xs sm:text-sm font-mono tracking-wider text-[#007D85] uppercase font-extrabold">1. 퍼스널 컬러 특징 및 종합 진단 특징</span>
              </div>
              <div className="p-5 bg-[#F8FAFB] border border-[#E0EDEE] rounded-2xl relative overflow-hidden shadow-xs">
                <p className="text-sm sm:text-base md:text-lg text-brand-dark/90 leading-relaxed font-semibold">
                  {detail.description}
                </p>
              </div>
            </div>

            {/* 2. Best Seasonal Colors */}
            <div className="space-y-3.5">
              <div className="flex items-center gap-2">
                <span className="w-2 h-4 bg-brand-primary rounded-full"></span>
                <span className="text-xs sm:text-sm font-mono tracking-wider text-[#007D85] uppercase font-extrabold block">
                  <span>2. 대표 베스트 컬러 스와치</span>
                  <span className="block mt-1 text-[11px] sm:text-xs text-[#007D85]/65 normal-case font-extrabold tracking-wide">(Best Seasonal Colors)</span>
                </span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {detail.bestHexes.map((hex, idx) => (
                  <div 
                    key={idx}
                    className="bg-white border border-[#E0EDEE] p-4 rounded-[20px] flex flex-col items-center gap-3.5 shadow-sm hover:border-brand-primary/50 transition-all duration-200 group cursor-help"
                  >
                    <div 
                      className="w-14 h-14 sm:w-16 sm:h-16 rounded-[16px] border-2 border-brand-dark/10 shadow-md transition-transform duration-200 group-hover:scale-110"
                      style={{ backgroundColor: hex }}
                    />
                    <span className="text-xs sm:text-sm font-mono font-extrabold text-brand-dark bg-[#F8FAFB] px-2.5 py-1 rounded-lg border border-[#E0EDEE] group-hover:text-brand-primary transition-colors select-all">
                      {hex}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* 3. Recommended Makeup Palette */}
            <div className="space-y-3.5">
              <div className="flex items-center gap-2">
                <span className="w-2 h-4 bg-brand-primary rounded-full"></span>
                <span className="text-xs sm:text-sm font-mono tracking-wider text-[#007D85] uppercase font-extrabold block">
                  <span>3. 맞춤 추천 메이크업 팔레트</span>
                  <span className="block mt-1 text-[11px] sm:text-xs text-[#007D85]/65 normal-case font-extrabold tracking-wide">(Recommended Makeup Palette)</span>
                </span>
              </div>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  { label: "피부 베이스", value: detail.makeupPalette.base, role: "깨끗하고 자연스러운 피부 연출용 최적 베이스" },
                  { label: "치크 볼륨", value: detail.makeupPalette.blush, role: "맑고 은은한 생기를 불어넣어 주는 포인트 치크" },
                  { label: "촉촉 립", value: detail.makeupPalette.lip, role: "싱그럽고 자연스런 입술 활력을 연출하는 시그니처 립" },
                  { label: "눈매 조각", value: detail.makeupPalette.eyeshadow, role: "그윽하고 분위기 있는 조화를 만드는 음영 섀도우" }
                ].map((item, idx) => (
                  <div 
                    key={idx} 
                    className="p-4 bg-[#F8FAFB] border border-[#E0EDEE] rounded-[24px] flex flex-col items-center text-center gap-3 shadow-xs hover:border-brand-primary/30 hover:bg-[#F3F7F8] duration-200 transition-all group"
                  >
                    <div 
                      className="w-16 h-16 sm:w-18 sm:h-18 rounded-2xl flex-shrink-0 shadow-md border-2 border-white transition-transform group-hover:scale-105" 
                      style={{ backgroundColor: item.value }} 
                    />
                    <div className="min-w-0">
                      <p className="text-xs sm:text-sm font-bold text-brand-dark leading-snug">{item.label}</p>
                      <p className="text-[11px] sm:text-xs font-mono font-extrabold text-brand-primary tracking-tight mt-1 bg-brand-primary/10 px-2.5 py-0.5 rounded-full inline-block">{item.value}</p>
                      <p className="text-[10px] sm:text-xs text-brand-dark/75 font-semibold mt-2 leading-relaxed">{item.role}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 4. Sea Mirror Direct Advice */}
            <div className="space-y-3.5">
              <div className="flex items-center gap-2">
                <span className="w-2 h-4 bg-brand-primary rounded-full"></span>
                <span className="text-xs sm:text-sm font-mono tracking-wider text-[#007D85] uppercase font-extrabold block">
                  <span>4. Sea Mirror 독점 스킨 솔루션 조언</span>
                  <span className="block mt-1 text-[11px] sm:text-xs text-[#007D85]/65 normal-case font-extrabold tracking-wide">(Sea Mirror Direct Advice)</span>
                </span>
              </div>
              <div className="p-5 bg-[#F4FAFB] border border-brand-primary/30 rounded-2xl relative overflow-hidden shadow-xs">
                <div className="flex gap-4">
                  <div className="p-2.5 bg-brand-primary/10 rounded-xl h-fit text-brand-primary flex-shrink-0">
                    <BookOpen className="w-5 h-5" />
                  </div>
                  <div className="space-y-3.5 flex-grow">
                    <div>
                      <h5 className="text-xs sm:text-sm font-bold text-brand-dark/95 uppercase tracking-wide leading-none mb-1.5">Direct Advisor Commentary</h5>
                      <p className="text-sm sm:text-base md:text-lg text-brand-dark/85 leading-relaxed font-sans font-semibold">
                        {detail.recommendation}
                      </p>
                    </div>
                    
                    <div className="pt-3.5 border-t border-brand-border/40 flex items-start gap-2">
                      <Lightbulb className="w-4 h-4 text-brand-primary flex-shrink-0 mt-0.5" />
                      <p className="text-xs sm:text-sm md:text-base text-brand-dark/70 leading-relaxed font-sans font-semibold">
                        <strong className="text-brand-primary font-bold">프렙 유지 특이사항:</strong> 이 피부타입은 홍조 정돈 점수가 35점 미만이고 볼 영역 수분도가 60%를 초과할 때 메이크업 밀착 보존력이 가장 견고하게 유지됩니다.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Dynamic Roadshop vs Luxury Product Recommendations Panel (Wide & Square Layout) */}
      {(() => {
        const recommendations = cosmeticRecommendations[selectedSeason] || cosmeticRecommendations['Spring Warm Light'];
        
        const filterProducts = (list: any[]) => {
          if (activeCategoryFilter === 'all') return list;
          return list.filter(item => item.type === activeCategoryFilter);
        };

        const filteredRoadshop = filterProducts(recommendations.roadshop || []);
        const filteredLuxury = filterProducts(recommendations.luxury || []);

        return (
          <div className="bg-white border border-[#E0EDEE] p-6 rounded-[24px] shadow-sm space-y-6 w-full" id="cosmetics_recommendation_deck">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-brand-border/40 pb-5">
              <div>
                <div className="flex items-center gap-2">
                  <ShoppingBag className="w-5 h-5 text-brand-primary" />
                  <span className="text-[10px] font-mono tracking-widest text-[#007D85] uppercase font-bold">Recommended cosmetics</span>
                </div>
                <h3 className="text-base sm:text-lg md:text-xl font-bold text-brand-dark mt-1">
                  {detail.koreanName} 맞춤형 화장품 가이드 데크
                </h3>
                <p className="text-xs sm:text-sm text-brand-dark/60 mt-1">
                  사용자의 퍼스널 컬러에 매치도가 가장 우수한 베스트셀러 제품군을 엄선해 소개합니다.
                </p>
              </div>

              {/* Category selection filters */}
              <div className="flex flex-wrap gap-1 bg-brand-light p-1 rounded-xl border border-brand-border/25">
                {[
                  { id: 'all', label: '전체' },
                  { id: 'lip', label: '💄 립' },
                  { id: 'blush', label: '🌸 치크' },
                  { id: 'eyeshadow', label: '👁️ 섀도우' },
                  { id: 'mascara', label: '✨ 마스카라' },
                  { id: 'eyeliner', label: '🖊️ 라이너' }
                ].map(filter => (
                  <button
                    key={filter.id}
                    onClick={() => setActiveCategoryFilter(filter.id as any)}
                    className={`px-3 py-1.5 rounded-lg text-xs sm:text-sm font-semibold cursor-pointer transition-all ${
                      activeCategoryFilter === filter.id 
                        ? "bg-brand-primary text-white font-bold shadow-sm" 
                        : "text-brand-dark/65 hover:text-brand-dark bg-white hover:bg-[#F3F7F8]"
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

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  {filteredRoadshop.length > 0 ? (
                    filteredRoadshop.map((item, idx) => (
                      <div 
                        key={idx}
                        className="aspect-square p-4 bg-slate-50/40 hover:bg-[#F2F8F9]/75 border border-slate-150/60 hover:border-brand-primary/20 rounded-2xl transition-all duration-200 group flex flex-col justify-between shadow-xs"
                      >
                        {/* Text Details (No Image, Styled Square) */}
                        <div className="space-y-2.5 min-w-0 flex-grow">
                          
                          {/* Segmented Brand & Price into separated layout as requested */}
                          <div className="flex flex-col gap-1 border-b border-slate-100 pb-2">
                            <div className="flex items-center justify-between w-full">
                              <span className="text-xs sm:text-sm select-none flex-shrink-0 font-bold text-brand-dark">
                                {item.type === 'lip' ? "💄 립" : item.type === 'blush' ? "🌸 치크" : item.type === 'eyeshadow' ? "👁️ 섀도우" : item.type === 'mascara' ? "✨ 마스카라" : item.type === 'eyeliner' ? "🖊️ 라이너" : "✨ 기타"}
                              </span>
                              <span className="text-[11px] sm:text-xs font-mono text-brand-primary font-extrabold bg-[#EAF5F7] px-2.5 py-0.5 rounded-full border border-brand-primary/10 whitespace-nowrap">
                                {item.price}
                              </span>
                            </div>
                            
                            {/* Brand Line - fully displayed on a separate paragraph tag block */}
                            <div className="mt-1">
                              <p className="text-xs font-black text-[#007D85] bg-brand-primary/10 border border-brand-primary/20 px-2.5 py-1 rounded-lg tracking-tight uppercase inline-block leading-tight">
                                {item.brand}
                              </p>
                            </div>
                          </div>

                          <h5 className="text-xs sm:text-sm font-extrabold text-slate-850 group-hover:text-brand-primary transition-colors leading-snug line-clamp-2">
                            {item.name}
                          </h5>
                          
                          <div className="flex items-center gap-1 font-sans text-brand-dark/85 bg-[#EAF5F7] px-2 py-0.5 rounded-sm font-bold text-[10px] w-fit">
                            <span className="text-brand-secondary/90 font-semibold">[Shade]</span> {item.shade}
                          </div>
                        </div>

                        <p className="text-[10px] sm:text-xs text-slate-500 leading-relaxed font-sans line-clamp-3 border-t border-slate-100 pt-2 flex-shrink-0">
                          {item.description}
                        </p>
                      </div>
                    ))
                  ) : (
                    <div className="py-12 text-center text-slate-400 text-xs sm:text-sm font-sans col-span-2">
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

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  {filteredLuxury.length > 0 ? (
                    filteredLuxury.map((item, idx) => (
                      <div 
                        key={idx}
                        className="aspect-square p-4 bg-amber-50/10 hover:bg-amber-50/25 border border-amber-100/35 hover:border-amber-400/20 rounded-2xl transition-all duration-200 group flex flex-col justify-between shadow-xs"
                      >
                        {/* Text Details (No Image, Styled Square) */}
                        <div className="space-y-2.5 min-w-0 flex-grow">
                          
                          {/* Segmented Brand & Price into separated layout as requested */}
                          <div className="flex flex-col gap-1 border-b border-amber-100/40 pb-2">
                            <div className="flex items-center justify-between w-full">
                              <span className="text-xs sm:text-sm select-none flex-shrink-0 font-bold text-amber-900">
                                {item.type === 'lip' ? "💄 립" : item.type === 'blush' ? "🌸 치크" : item.type === 'eyeshadow' ? "👁️ 섀도우" : item.type === 'mascara' ? "✨ 마스카라" : item.type === 'eyeliner' ? "🖊️ 라이너" : "✨ 기타"}
                              </span>
                              <span className="text-[11px] sm:text-xs font-mono text-amber-700 font-extrabold bg-[#FDF9F0] px-2.5 py-0.5 rounded-full border border-amber-500/15 whitespace-nowrap">
                                {item.price}
                              </span>
                            </div>
                            
                            {/* Brand Line - fully displayed on a separate paragraph tag block */}
                            <div className="mt-1">
                              <p className="text-xs font-black text-amber-800 bg-amber-500/10 border border-amber-500/15 px-2.5 py-1 rounded-lg tracking-tight uppercase inline-block leading-tight">
                                {item.brand}
                              </p>
                            </div>
                          </div>

                          <h5 className="text-xs sm:text-sm font-extrabold text-slate-850 group-hover:text-amber-800 transition-colors leading-snug line-clamp-2">
                            {item.name}
                          </h5>
                          
                          <div className="flex items-center gap-1 font-sans text-amber-900 bg-amber-100/45 px-2 py-0.5 rounded-sm font-extrabold text-[10px] w-fit">
                            <span className="text-amber-850/90 font-semibold">[Shade]</span> {item.shade}
                          </div>
                        </div>

                        <p className="text-[10px] sm:text-xs text-slate-500 leading-relaxed font-sans line-clamp-3 border-t border-amber-100/40 pt-2 flex-shrink-0">
                          {item.description}
                        </p>
                      </div>
                    ))
                  ) : (
                    <div className="py-12 text-center text-slate-400 text-xs sm:text-sm font-sans col-span-2">
                       선택한 카테고리에 해당하는 제품 정보가 없습니다.
                    </div>
                  )}
                </div>
              </div>

            </div>
          </div>
        );
      })()}

      {/* AR Overlay Makeup Guide Box (AI overlay placed below Cosmetics Guide Deck!) */}
      <div className="p-5 bg-white border border-[#E0EDEE] rounded-[24px] flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 shadow-sm w-full">
        <div>
          <span className="text-[10px] bg-brand-primary/10 text-brand-primary border border-brand-primary/25 px-2.5 py-0.5 rounded-full font-mono font-bold uppercase">AR OVERLAY</span>
          <h4 className="text-sm font-bold text-brand-dark mt-2 flex flex-wrap items-center gap-2 leading-none">
            가상 메이크업 지침선 노드 투사 <span className="font-mono text-xs text-brand-primary">{activeTutorial ? `[${activeTutorial.title}]` : "[지정 튜토리얼 없음]"}</span>
          </h4>
          <p className="text-xs text-brand-dark/35 mt-2 max-w-xl leading-relaxed font-semibold">
            {activeTutorial 
              ? `${activeTutorial.koreanTitle} 가이드 선을 좌측 스캐너에 오버레이 투영합니다. 라인에 맞춰 실전 화장을 배치 진행하세요.`
              : "The Sea Map에서 튜토리얼 카드를 선택하시면 해당 과제의 가이드 노드가 스캐너 화면 상단에 정합 투사됩니다."}
          </p>
        </div>

        <button
          onClick={toggleArMode}
          className={`w-full sm:w-auto flex items-center justify-center gap-1.5 px-5 py-3 rounded-2xl text-xs font-bold tracking-wider uppercase cursor-pointer transition-all flex-shrink-0 ${
            drawArActive 
              ? "bg-brand-primary text-white shadow-md shadow-brand-primary/20" 
              : "bg-white hover:bg-[#F3F6F7] text-brand-dark/90 border border-brand-border shadow-sm"
          }`}
        >
          <Eye className="w-4 h-4" />
          {drawArActive ? "AR 가이드 끄기" : "AR 가이드 투사"}
        </button>
      </div>

    </div>
  );
}
