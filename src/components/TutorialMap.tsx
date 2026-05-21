/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { Tutorial } from "../types";
import { Lock, Unlock, CheckCircle, Flame, Clock, Play, Film } from "lucide-react";
import { motion } from "motion/react";
import TutorialVideoPlayer from "./TutorialVideoPlayer";

interface Props {
  tutorials: Tutorial[];
  activeTutorial: Tutorial | null;
  onSelectTutorial: (tut: Tutorial) => void;
  skinPrepScore: number;
}

export default function TutorialMap({ tutorials, activeTutorial, onSelectTutorial, skinPrepScore }: Props) {
  return (
    <div className="space-y-5">
      
      {/* Dynamic Journey Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div>
          <span className="text-[10px] font-mono tracking-widest text-brand-primary uppercase font-bold">The Sea Map Journey</span>
          <h3 className="text-md sm:text-lg font-sans font-bold text-brand-dark flex items-center gap-2">
            10-Step Growth Beauty Tutorials <span className="text-xs bg-brand-primary/10 border border-brand-primary/20 text-brand-primary px-2.5 py-1 rounded-full font-bold">성장 과정</span>
          </h3>
          <p className="text-xs text-brand-dark/65 mt-1.5 leading-relaxed">
            쌩얼 피부 정돈도 수치에 맞춰 다음 단계 전문 코스들이 자연스럽게 해금됩니다. 현재 나의 스킨 프렙 수치: <strong className="text-brand-primary">{skinPrepScore}점</strong>
          </p>
        </div>
      </div>

      {/* Bento Grid layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {tutorials.map((tut, idx) => {
          const isSelected = activeTutorial?.id === tut.id;
          const isUnlocked = tut.unlocked;
          
          let levelColor = "border-emerald-300 text-emerald-700 bg-emerald-50";
          if (tut.level === 'Intermediate') {
            levelColor = "border-brand-primary/20 text-brand-primary bg-brand-primary/5";
          } else if (tut.level === 'Master') {
            levelColor = "border-rose-300 text-rose-700 bg-rose-50";
          }

          return (
            <div
              key={tut.id}
              className={`relative flex flex-col justify-between p-4.5 rounded-[22px] border transition-all ${
                isSelected 
                  ? "bg-brand-primary/5 border-2 border-brand-primary ring-4 ring-brand-primary/10 shadow-md scale-[1.01]" 
                  : isUnlocked
                  ? "bg-white border-[#E0EDEE] hover:border-brand-primary/50 hover:shadow-sm" 
                  : "bg-[#F8FAFB] border-[#E0EDEE]/70 opacity-60 cursor-not-allowed select-none"
              }`}
              id={`tutorial_card_${tut.id}`}
            >
              
              {/* Card Meta Header */}
              <div className="space-y-1.5 min-h-[140px]">
                <div className="flex items-center justify-between border-b border-brand-border/40 pb-2.5">
                  <span className={`text-[8px] font-mono font-bold uppercase px-2 py-0.5 rounded-full border ${levelColor}`}>
                    Level {tut.levelNum} : {tut.level}
                  </span>
                  
                  {isUnlocked ? (
                    <Unlock className="w-3.5 h-3.5 text-emerald-600 opacity-80 flex-shrink-0" />
                  ) : (
                    <div className="flex items-center gap-1.5">
                      <Lock className="w-3 h-3 text-brand-dark/40 flex-shrink-0" />
                      <span className="text-[8px] font-mono text-brand-dark/40">BFP {tut.requiredPrepScore}</span>
                    </div>
                  )}
                </div>

                <h4 className="text-xs sm:text-sm font-bold text-brand-dark line-clamp-1 mt-1">{tut.koreanTitle}</h4>
                <p className="text-[10px] sm:text-xs text-brand-dark/65 line-clamp-3 mt-1 leading-relaxed">{tut.description}</p>
              </div>

              {/* Step Steps Mini preview */}
              <div className="mt-3 pt-3.5 border-t border-brand-border/30 flex items-center justify-between">
                <span className="text-[10px] text-brand-dark/50 flex items-center gap-1 font-mono">
                  <Clock className="w-3 h-3" /> {tut.duration} 소요
                </span>

                {isUnlocked ? (
                  <button
                    onClick={() => onSelectTutorial(tut)}
                    className={`flex items-center gap-1 px-3 py-1.5 rounded-xl text-[10px] font-semibold cursor-pointer transition-all ${
                      isSelected 
                        ? "bg-brand-primary text-white shadow font-bold" 
                        : "bg-brand-light hover:bg-brand-primary/15 text-brand-dark/85"
                    }`}
                  >
                    <Play className="w-2.5 h-2.5 fill-current" />
                    {isSelected ? "연습 중" : "수강 시작"}
                  </button>
                ) : (
                  <span className="text-[8px] font-mono text-brand-dark/40 uppercase">소금 진흙 필요</span>
                )}
              </div>

              {/* Recommended season accent ribbon */}
              {tut.requiredColorUnlock && (
                <div className="absolute -top-1 -right-1 bg-brand-secondary text-brand-dark text-[8px] font-mono font-bold px-2 py-0.5 rounded-bl-xl rounded-tr-xl flex items-center gap-1 shadow-sm">
                  <Flame className="w-2.5 h-2.5 fill-current" /> BEST
                </div>
              )}

            </div>
          );
        })}
      </div>

      {/* Quick Interactive Steps Guide Section */}
      {activeTutorial && (
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
          id="tutorial_steps_panel"
        >
          {/* High Fidelity Interactive Guide Video Player */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Film className="w-4 h-4 text-brand-primary" />
              <span className="text-xs font-mono font-bold text-brand-dark/55 uppercase tracking-wider">AI 스마트 가이드 영상 시뮬레이터</span>
            </div>
            <TutorialVideoPlayer tutorial={activeTutorial} />
          </div>

          <div className="p-5.5 bg-brand-primary/5 border border-brand-primary/20 rounded-[24px] shadow-sm space-y-4">
            <div className="flex items-center gap-2.5 border-b border-brand-border/15 pb-3">
              <div className="w-6 h-6 rounded-full bg-brand-primary text-white flex items-center justify-center font-bold text-xs shadow-sm">
                {activeTutorial.levelNum}
              </div>
              <div>
                <h4 className="text-sm font-bold text-brand-dark leading-none">{activeTutorial.koreanTitle} : 실시간 화장 가이드북</h4>
                <p className="text-[10.5px] text-brand-dark/50 mt-1.5 leading-none">가이드라인 노드가 활성화되어 있습니다. 위 비디오를 시청하며 아래 순서로 단장해 보세요.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {activeTutorial.steps.map((st, sidx) => (
                <div key={sidx} className="p-4 bg-white rounded-2xl border border-brand-border/45 flex items-start gap-2.5 shadow-sm hover:shadow-md transition-shadow">
                  <span className="text-xs font-mono font-black text-brand-primary mt-0.5">{sidx + 1}.</span>
                  <p className="text-xs text-brand-dark/80 leading-relaxed font-sans font-medium">{st}</p>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      )}

    </div>
  );
}
