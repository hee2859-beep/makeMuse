/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { SkinData, MakeupEvaluation, Tutorial } from "./types";
import { initialTutorials, resolveTutorialUnlockStates } from "./lib/progress";
import BareFaceAnalyzer from "./components/BareFaceAnalyzer";
import PersonalColorMirror from "./components/PersonalColorMirror";
import FinalPearlFeedback from "./components/FinalPearlFeedback";
import TutorialMap from "./components/TutorialMap";
import { Droplets, Sparkles, BookOpen, UserCheck, Flame, Medal, Compass, HelpCircle } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

export default function App() {
  // Global States
  const [activeTab, setActiveTab] = useState<'prep' | 'color' | 'pearl'>('prep');
  const [activePreset, setActivePreset] = useState<'neutral-sand' | 'warm-coral' | 'deep-abyss'>('neutral-sand');
  
  const [skinData, setSkinData] = useState<SkinData>({
    textureScore: 35,
    rednessScore: 28,
    moistureScore: 68,
    skinTone: "자연스러운 해풍빛 내추럴 샌드",
    personalColor: "Spring Warm Light",
    analyzedAt: null
  });

  const [prepScore, setPrepScore] = useState<number>(68);
  const [makeupScore, setMakeupScore] = useState<number>(90);
  
  const [makeupReport, setMakeupReport] = useState<MakeupEvaluation>({
    baseUniformity: 15,
    eyelinerSymmetry: 3,
    lipBorderOverstep: 8,
    feedbackMessage: "",
    analyzedAt: null
  });

  // 10 Growth Tutorials Database State
  const [tutorials, setTutorials] = useState<Tutorial[]>([]);
  const [activeTutorial, setActiveTutorial] = useState<Tutorial | null>(null);
  
  // AR guiding overlay toggle
  const [drawArActive, setDrawArActive] = useState<boolean>(false);

  // Dynamic makeup parameters passed back from Step 3 sliders to show on the simulator canvas
  const [makeupParams, setMakeupParams] = useState({
    eyelinerGap: 3,
    lipOverstep: 8,
    splotchiness: 12
  });

  // Calculate unlock thresholds dynamically based on current skin prep scores
  useEffect(() => {
    const rawTutorials = initialTutorials();
    const resolved = resolveTutorialUnlockStates(rawTutorials, prepScore, makeupScore, skinData.personalColor);
    setTutorials(resolved);

    // Default to setting first unlocked tutorial as active if none selected yet
    if (!activeTutorial) {
      setActiveTutorial(resolved[0]);
    } else {
      // Keep active state synched with resolved locked states
      const matchingCurrent = resolved.find(t => t.id === activeTutorial.id);
      if (matchingCurrent) {
        setActiveTutorial(matchingCurrent);
      }
    }
  }, [prepScore, makeupScore, skinData.personalColor]);

  const handleAnalysisComplete = (newSkin: SkinData, calculatedPrepScore: number) => {
    setSkinData(newSkin);
    setPrepScore(calculatedPrepScore);
    
    // Auto-advance to Personal Color guide to represent completed stage 1
    setTimeout(() => {
      setActiveTab('color');
    }, 1500);
  };

  const handleEvaluationComplete = (newEval: MakeupEvaluation, calculatedMakeupScore: number) => {
    setMakeupReport(newEval);
    setMakeupScore(calculatedMakeupScore);
  };

  const handleTutorialSelect = (tut: Tutorial) => {
    if (!tut.unlocked) return;
    setActiveTutorial(tut);
    // Auto trigger AR overlay representing direct practice activation!
    setDrawArActive(true);
    
    // Auto-switch workspace tab to corresponding stage
    if (tut.levelNum <= 2) {
      setActiveTab('prep');
    } else if ([3, 4, 5, 7].includes(tut.levelNum)) {
      setActiveTab('color');
    } else {
      setActiveTab('pearl');
    }
    
    // Scroll to central scanner so they see guides immediately
    const scannerEl = document.getElementById("camera_viewport");
    if (scannerEl) {
      scannerEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  // Stats for the Quest Progression bar
  const unlockedCount = tutorials.filter(t => t.unlocked).length;
  const questProgressPct = (unlockedCount / 10) * 100;

  return (
    <div className="min-h-screen bg-brand-light text-brand-dark flex flex-col font-sans antialiased overflow-x-hidden select-none">
      
      {/* Premium Minimal Marine Header */}
      <header className="border-b border-brand-border bg-white/50 backdrop-blur-md px-6 py-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 sticky top-0 z-30 shadow-sm">
        <div className="space-y-0.5">
          <div className="flex items-center gap-2">
            <div className="w-3.5 h-3.5 rounded-full bg-gradient-to-tr from-brand-primary to-brand-secondary animate-pulse" />
            <span className="font-mono text-[9px] sm:text-[10px] tracking-widest text-brand-primary uppercase font-bold">SEA-FIT AI SUITE</span>
          </div>
          <h1 className="text-md sm:text-xl font-sans font-semibold tracking-tight text-brand-dark uppercase">
            Sea-fit AI <span className="font-light opacity-60">v2.1</span>
          </h1>
        </div>

        {/* Quest Achievement Status Indicators */}
        <div className="w-full md:w-auto flex flex-col sm:flex-row items-stretch sm:items-center gap-4 sm:gap-6 pt-3 md:pt-0 border-t md:border-t-0 border-brand-border">
          <div className="flex items-center gap-3 bg-white/70 border border-brand-border px-4 py-2 rounded-2xl shadow-sm">
            <Medal className="w-5 h-5 text-brand-primary flex-shrink-0" />
            <div className="space-y-1 w-[120px] sm:w-[150px]">
              <div className="flex justify-between text-[10px] font-mono text-brand-dark/60">
                <span>트랙 해금 진도</span>
                <span className="font-bold text-brand-primary">{unlockedCount}/10 코스</span>
              </div>
              <div className="w-full h-1.5 bg-brand-light rounded-full overflow-hidden border border-brand-border/40">
                <div style={{ width: `${questProgressPct}%` }} className="h-full bg-gradient-to-r from-brand-primary to-brand-secondary transition-all duration-500" />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 text-center text-xs">
            <div className="p-2 px-3 bg-white hover:bg-white/80 transition-colors rounded-2xl border border-brand-border shadow-sm">
              <p className="text-[9px] font-mono text-brand-dark/65 uppercase tracking-wider">BFP 스킨 프렙</p>
              <p className="font-mono font-bold text-brand-primary mt-0.5 text-sm">{prepScore}점</p>
            </div>
            <div className="p-2 px-3 bg-white hover:bg-white/80 transition-colors rounded-2xl border border-brand-border shadow-sm">
              <p className="text-[9px] font-mono text-brand-dark/65 uppercase tracking-wider">최종 메이킹</p>
              <p className="font-mono font-bold text-brand-primary mt-0.5 text-sm">{makeupScore}점</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-grow max-w-[1400px] w-full mx-auto px-4 sm:px-6 py-6 space-y-7">
        
        {/* Top Floating Help ribbon */}
        <div className="bg-white/70 border border-brand-border p-3.5 px-5 rounded-3xl flex items-center justify-between text-xs text-brand-dark/80 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 left-0 w-1.5 h-full bg-brand-primary" />
          <div className="flex items-center gap-2">
            <span className="flex-shrink-0 w-2 h-2 rounded-full bg-brand-secondary animate-ping" />
            <p className="leading-relaxed">
              <strong>[밀물 소식]</strong> {prepScore >= 75 ? "최상의 스킨 보습 상태입니다! 8단계 이상의 마스터 메이크업 코스가 모두 해금되었습니다." : "이마/볼 마커를 드래그해 진단 밀도를 조정하고, 분석 버튼을 눌러 다음 학습 단계를 여세요."}
            </p>
          </div>
          <span className="hidden md:inline-flex text-[10px] font-mono bg-brand-primary/10 text-brand-primary border border-brand-primary/20 px-2 py-0.5 rounded-full font-bold">
            Ready to style
          </span>
        </div>

        {/* Central Bento Grid Workspace */}
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
          
          {/* Permanent Interactive Scan Viewport Column */}
          <div className="xl:col-span-5 bg-white rounded-[32px] p-5.5 border border-[#E0EDEE] sticky top-28 self-start z-10 shadow-sm transition-all">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xs font-mono text-brand-primary tracking-wider flex items-center gap-1.5 uppercase font-bold">
                <span className="w-2 h-2 rounded-full bg-brand-secondary animate-pulse" />
                Active Marine Scanner
              </h3>
              <div className="flex items-center gap-1 text-[10px] text-brand-dark/60 font-mono">
                <span>프렙 등급:</span>
                <span className="text-brand-primary font-bold">{prepScore >= 75 ? "해양 진주빛" : prepScore >= 50 ? "은빛 소금밭" : "건조 모래밭"}</span>
              </div>
            </div>

            <BareFaceAnalyzer 
              onAnalysisComplete={handleAnalysisComplete}
              activePreset={activePreset}
              setActivePreset={setActivePreset}
              drawArActive={drawArActive}
              activeTutorial={activeTutorial}
              makeupParams={makeupParams}
            />
          </div>

          {/* Central Control tabs Column */}
          <div className="xl:col-span-7 space-y-5">
            
            {/* Nav Workspace Tabs */}
            <div className="grid grid-cols-3 gap-1 bg-white border border-brand-border p-1.5 rounded-2xl shadow-sm" id="workspace_tabs">
              {[
                { id: 'prep', label: '1단계: 쌩얼 진단', icon: Droplets, color: 'text-brand-primary' },
                { id: 'color', label: '2단계: 퍼스널 컬러', icon: Sparkles, color: 'text-brand-secondary' },
                { id: 'pearl', label: '3단계: 대칭 피드백', icon: UserCheck, color: 'text-brand-primary' }
              ].map(tab => {
                const isSelected = activeTab === tab.id;
                const Icon = tab.icon;

                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`flex items-center justify-center gap-2 py-3 rounded-xl text-xs font-medium tracking-wide cursor-pointer transition-all ${
                      isSelected 
                        ? "bg-brand-primary text-white font-bold border border-brand-primary shadow-md" 
                        : "text-brand-dark/50 hover:text-brand-dark/95"
                    }`}
                  >
                    <Icon className={`w-3.5 h-3.5 ${isSelected ? 'text-white' : tab.color}`} />
                    <span className="hidden sm:inline-block">{tab.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Tab Workspace Views */}
            <div className="min-h-[460px]">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, x: 12 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -12 }}
                  transition={{ duration: 0.2 }}
                >
                  {activeTab === 'prep' && (
                    <div className="bg-white/90 border border-[#E0EDEE] p-6 rounded-[24px] space-y-6 shadow-sm">
                      <div>
                        <h4 className="text-sm font-semibold text-brand-dark flex items-center gap-2 uppercase tracking-tight">
                          쌩얼 보습 장벽 진단 <span className="text-xs bg-brand-light text-brand-primary px-2 py-0.5 rounded border border-[#D0E0E2] font-mono">Core Bare Face Prep</span>
                        </h4>
                        <p className="text-xs text-brand-dark/65 leading-relaxed mt-1.5">
                          화장을 얹기 전, 눈가/이마/볼의 엣지 굴곡과 반사율을 감지하여 피부 밀착력을 수치화합니다. 왼쪽 '피부 스캔 시작' 버튼을 눌러보세요.
                        </p>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="p-4 rounded-2xl bg-[#F8FAFB] border border-[#E0EDEE] text-xs space-y-1">
                          <p className="font-semibold text-brand-primary">🔍 결 감지 원리 (Sobel Edge Detector)</p>
                          <p className="text-brand-dark/65 leading-relaxed">
                            뺨에 밀집된 피부 잔주름, 각질 및 붉은 포인터의 고주파 대비를 Sobel 필터 행렬 연산으로 검출합니다. 점수가 낮을수록 쌩얼 캔버스가 도화지처럼 매끄럽다는 뜻입니다.
                          </p>
                        </div>
                        <div className="p-4 rounded-2xl bg-[#F8FAFB] border border-[#E0EDEE] text-xs space-y-1">
                          <p className="font-semibold text-brand-primary">💧 수분지수 원리 (Forehead Luminance)</p>
                          <p className="text-brand-dark/65 leading-relaxed">
                            이마 정점 구역의 반사율을 측정하여 수분의 겹레이어 볼륨을 🌊수분 파도 연출 창으로 변환합니다. 보습 수치가 상승하면 다음 고난이도 코스들이 차례로 열립니다.
                          </p>
                        </div>
                      </div>

                      <div className="p-4 bg-brand-primary/5 rounded-2xl border border-brand-primary/20 flex gap-2.5 text-xs text-brand-primary">
                        <HelpCircle className="w-5 h-5 flex-shrink-0 text-brand-primary mt-0.5" />
                        <p className="leading-relaxed text-brand-dark">
                          <strong>체험 팁:</strong> 왼쪽 스캐너 카드 하단에서 "플러시 코랄"을 마크하시면, 홍조 60% 이상과 거친 질감이 연출되며 실제 Sobel 스캔 결과에 반영되는 정밀함을 감상 및 분석해볼 수 있습니다.
                        </p>
                      </div>
                    </div>
                  )}

                  {activeTab === 'color' && (
                    <div className="bg-white/90 border border-[#E0EDEE] p-1.5 rounded-[24px] shadow-sm">
                      <PersonalColorMirror 
                        skinData={skinData} 
                        activeTutorial={activeTutorial}
                        drawArActive={drawArActive}
                        onDrawArOverlay={setDrawArActive}
                      />
                    </div>
                  )}

                  {activeTab === 'pearl' && (
                    <div className="bg-white/90 border border-[#E0EDEE] p-1.5 rounded-[24px] shadow-sm">
                      <FinalPearlFeedback 
                        skinData={skinData}
                        activeTutorial={activeTutorial}
                        onEvaluateComplete={handleEvaluationComplete}
                        onModifyCanvasParams={setMakeupParams}
                      />
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>

          </div>

        </div>

        {/* Lower deck Timeline mapping (The Sea Map) */}
        <section className="bg-white p-6 rounded-[32px] border border-[#E0EDEE] shadow-sm" id="the_sea_map">
          <TutorialMap 
            tutorials={tutorials}
            activeTutorial={activeTutorial}
            onSelectTutorial={handleTutorialSelect}
            skinPrepScore={prepScore}
          />
        </section>

      </main>

      {/* Aesthetic Ocean Minimalist Footer */}
      <footer className="border-t border-brand-border bg-white px-6 py-5 text-center text-xs text-brand-dark/50 font-mono mt-auto flex flex-col sm:flex-row justify-between items-center gap-3 shadow-inner">
        <p>© 2026 Sea-fit Beautylabs Engine. All and pristine color spaces calibrated D65.</p>
        <p className="flex items-center gap-1.5">
          <Droplets className="w-3.5 h-3.5 text-brand-primary" /> Geometric Balance Theme calibrated.
        </p>
      </footer>

    </div>
  );
}
