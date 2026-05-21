/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from "react";
import { Tutorial } from "../types";
import { 
  Play, 
  Pause, 
  Volume2, 
  VolumeX, 
  Subtitles, 
  RotateCcw, 
  Tv, 
  Sparkles, 
  User, 
  Info,
  Layers,
  CheckCircle,
  Clock
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface Props {
  tutorial: Tutorial;
}

// Highly specific facial landmarks for the canvas-based beauty training rendering
interface VideoFramePreset {
  baseColor: string;
  glowZone: { x: number; y: number; radius: number }[];
  brushIcon: "sponge" | "brush" | "lip-wand" | "droplet" | "pencil";
  actionPoints: { x: number; y: number }[];
  overlayLabel: string;
  subtitles: { time: number; text: string }[];
}

const PRESETS_BY_STEP: Record<string, VideoFramePreset> = {
  'tut_01': {
    baseColor: "#EAF7F8",
    glowZone: [
      { x: 200, y: 100, radius: 45 }, // forehead
      { x: 130, y: 220, radius: 55 }, // left cheek
      { x: 270, y: 220, radius: 55 }  // right cheek
    ],
    brushIcon: "sponge",
    actionPoints: [
      { x: 200, y: 100 },
      { x: 130, y: 220 },
      { x: 270, y: 220 },
      { x: 200, y: 100 }
    ],
    overlayLabel: "WATER GLOW COATING EFFECT",
    subtitles: [
      { time: 0, text: "안녕하세요! 해양 수분 밀물 베이스 기초 단계를 설명해 드릴 수석 크리에이터 강수진입니다." },
      { time: 25, text: "먼저 해수 수딩 젤을 이마 중심점부터 천천히 바깥으로 펴 발라주세요." },
      { time: 55, text: "뺨 주위의 깊은 건조 구역 부분에는 수분 레이어를 겹겹이 탭핑하는 연출이 매끄러운 캔버스 형성에 도움을 줍니다." },
      { time: 85, text: "마지막으로 수분 파도가 느껴지도록 스펀지의 바깥 결을 따라 가볍게 정리 정돈해 주시면 완성입니다!" }
    ]
  },
  'tut_02': {
    baseColor: "#ECEFE8",
    glowZone: [
      { x: 135, y: 215, radius: 35 }, // redness zone left
      { x: 265, y: 215, radius: 35 }  // redness zone right
    ],
    brushIcon: "brush",
    actionPoints: [
      { x: 135, y: 215 },
      { x: 265, y: 215 },
      { x: 135, y: 215 }
    ],
    overlayLabel: "LAB A* REDNESS NEUTRALIZING",
    subtitles: [
      { time: 0, text: "2단계는 뺨 주변의 붉은 홍조를 과학적으로 다스려 주는 연출입니다." },
      { time: 30, text: "그린 민트 톤 차단 베일을 홍조 포인터 양쪽에 콕 찍어 대칭 정합도를 관찰하세요." },
      { time: 65, text: "파도 퍼프를 사용하여 경계면이 드러나지 않도록 가볍게 두드려 모래빛 차분함을 입히세요." }
    ]
  },
  'tut_03': {
    baseColor: "#FBF3F5",
    glowZone: [
      { x: 200, y: 295, radius: 25 } // Lip
    ],
    brushIcon: "lip-wand",
    actionPoints: [
      { x: 180, y: 295 },
      { x: 220, y: 295 },
      { x: 200, y: 290 },
      { x: 200, y: 300 }
    ],
    overlayLabel: "MAJESTIC MOIST LIP BALM",
    subtitles: [
      { time: 0, text: "3단계는 대칭적인 촉촉함을 부하하는 영양 마린 발삼 정돈 과정입니다." },
      { time: 30, text: "입술 중심부(립 마진 원통 구역)부터 구석 노드까지 슬며시 밀어 올리듯 도포해 주세요." },
      { time: 70, text: "립 외곽 가이드를 일탈하지 않는 지점이 피부 균일도 분석의 립 정점 비결입니다." }
    ]
  },
  'tut_04': {
    baseColor: "#FDF5F1",
    glowZone: [
      { x: 120, y: 220, radius: 45 }, // Cheek L
      { x: 280, y: 220, radius: 45 }  // Cheek R
    ],
    brushIcon: "brush",
    actionPoints: [
      { x: 120, y: 220 },
      { x: 150, y: 190 },
      { x: 280, y: 220 },
      { x: 250, y: 190 }
    ],
    overlayLabel: "CORAL EMBOSSING BLUSH",
    subtitles: [
      { time: 0, text: "4단계 중급 코스, 퍼스널 컬러와 대칭 생기를 접목한 산호초 치크 실습입니다." },
      { time: 40, text: "본인 진단 톤에 적합한 로즈 코랄을 채택해, 광대뼈 외곽 사선 영역을 부드러운 호로 둥글게 터치합니다." },
      { time: 80, text: "블렌딩 연출을 위해 브러쉬 끝으로 물보라처럼 가장자리를 슬쩍 비벼 풀어주세요." }
    ]
  },
  'tut_05': {
    baseColor: "#F5F0EC",
    glowZone: [
      { x: 140, y: 155, radius: 24 }, // eye L
      { x: 260, y: 155, radius: 24 }  // eye R
    ],
    brushIcon: "brush",
    actionPoints: [
      { x: 140, y: 155 },
      { x: 260, y: 155 },
      { x: 200, y: 180 }
    ],
    overlayLabel: "DEEP ABYSS CONTOURING",
    subtitles: [
      { time: 0, text: "심해 깊은 곳의 입체 해형을 새겨줄 5단계 그늘막 음영 연주를 시작합니다." },
      { time: 35, text: "음영 샌드 섀도우를 브러쉬에 고르게 충진해 아이홀 구역 전체로 촘촘히 전개하세요." },
      { time: 75, text: "언더 꼬리 삼각 구역 역시 모카 사전 톤으로 연결해 그윽하고 정밀한 눈망울을 유도합니다." }
    ]
  },
  'tut_06': {
    baseColor: "#FBF2F4",
    glowZone: [
      { x: 130, y: 155, radius: 15 }, // left eye outer
      { x: 270, y: 155, radius: 15 }  // right eye outer
    ],
    brushIcon: "pencil",
    actionPoints: [
      { x: 130, y: 155 },
      { x: 110, y: 150 },
      { x: 270, y: 155 },
      { x: 290, y: 150 }
    ],
    overlayLabel: "15 DEGREE SYMMETRICAL LINER",
    subtitles: [
      { time: 0, text: "6단계는 좌우 아이라인 높낮이 비대칭(Symmetry Gap)을 직접 비교 정렬하는 심화 코스입니다." },
      { time: 40, text: "우측 해안선 눈꼬리 끝에서 하늘 방향 15도로 날렵한 모선 비상을 인출하세요." },
      { time: 80, text: "두 눈을 번갈아 응시하며, 좌측 라인의 끝단 역시 동일한 호흡의 좌표로 수렴시켜 줍니다." }
    ]
  },
  'tut_07': {
    baseColor: "#F4F7FB",
    glowZone: [
      { x: 200, y: 110, radius: 20 }, // forehead peak
      { x: 200, y: 190, radius: 15 }, // nose peak
      { x: 130, y: 200, radius: 25 }, // cheek L highlight
      { x: 270, y: 200, radius: 25 }  // cheek R highlight
    ],
    brushIcon: "sponge",
    actionPoints: [
      { x: 200, y: 110 },
      { x: 200, y: 190 },
      { x: 130, y: 200 },
      { x: 270, y: 200 }
    ],
    overlayLabel: "3D PEARL HIGHLIGHT REBOUND",
    subtitles: [
      { time: 0, text: "7단계에서는 빛의 최정상 발광체 효과를 심어주기 위한 3차원 쉬머링을 적용합니다." },
      { time: 35, text: "액상 인어빔 하이라이터를 아주 소량으로 나누어 콧망울 중앙과 광대 측면 정밀 랜드마크에 탭합니다." },
      { time: 75, text: "손가락의 미세 온도로 가볍게 구르듯 펼쳐 정제된 피부 반사 윤곽 피크를 창조하세요." }
    ]
  },
  'tut_08': {
    baseColor: "#FDF1F4",
    glowZone: [
      { x: 200, y: 295, radius: 35 } // Larger lip
    ],
    brushIcon: "lip-wand",
    actionPoints: [
      { x: 190, y: 285 },
      { x: 210, y: 305 },
      { x: 180, y: 295 },
      { x: 220, y: 295 }
    ],
    overlayLabel: "SUNRISE OVER-VOLUMETRIC LIPS",
    subtitles: [
      { time: 0, text: "최고 난이도에 해당하는 8단계 피치 오버핏 립 테크닉을 만나보겠습니다." },
      { time: 35, text: "로즈 틴트로 입술 내면 중심을 먼저 물들이고, 브러쉬로 경계를 해안선 거품처럼 스머징해 주세요." },
      { time: 75, text: "분석 필터가 감지하는 빨간 외각 오버핏 지시 기준을 일탈하지 않도록 정교하게 단장합니다." }
    ]
  },
  'tut_09': {
    baseColor: "#ECE5E6",
    glowZone: [
      { x: 135, y: 155, radius: 30 },
      { x: 265, y: 155, radius: 30 },
      { x: 200, y: 295, radius: 32 }
    ],
    brushIcon: "brush",
    actionPoints: [
      { x: 135, y: 155 },
      { x: 265, y: 155 },
      { x: 200, y: 295 }
    ],
    overlayLabel: "DEEP ABYSS CONTRAST CONTROLS",
    subtitles: [
      { time: 0, text: "9단계 장엄 무광 버건디 실습에 오신 마스터 여러분을 환영합니다." },
      { time: 40, text: "결점이 정밀 정화된 매트 에그쉘 도화지 위에 그윽한 버건디 섀도우를 이중 차폐해 나갑니다." },
      { time: 80, text: "립 외각 라인과 눈매 연출 부가 정밀 다차원 평행을 완성하는지 확인하십시오." }
    ]
  },
  'tut_10': {
    baseColor: "#ECE8E5",
    glowZone: [
      { x: 90, y: 220, radius: 60 },  // out contour L
      { x: 310, y: 220, radius: 60 }, // out contour R
      { x: 200, y: 175, radius: 15 }  // nose bridge L/R
    ],
    brushIcon: "sponge",
    actionPoints: [
      { x: 90, y: 220 },
      { x: 310, y: 220 },
      { x: 185, y: 190 },
      { x: 200, y: 100 }
    ],
    overlayLabel: "CHRONO SCULPTING FINISH SHADE",
    subtitles: [
      { time: 0, text: "영광의 최종 10단계, 얼굴 윤곽 크기를 조수간만의 명암 비율로 재조각해 주는 셰이딩입니다." },
      { time: 35, text: "귀끝 턱선 귀밑머리부터 부드럽게 앞으로 썰물이 쓸고 가듯 자연스럽게 터치해 줍니다." },
      { time: 75, text: "이마의 헤어 삼각 랜드마크 존까지 야무지게 정돈해 파도의 완벽한 흐름을 창출하는 최종 정입니다." }
    ]
  }
};

const DEFAULT_PRESET: VideoFramePreset = {
  baseColor: "#F4F7FB",
  glowZone: [{ x: 200, y: 200, radius: 50 }],
  brushIcon: "sponge",
  actionPoints: [{ x: 100, y: 100 }, { x: 300, y: 300 }],
  overlayLabel: "AR SIMULATED FEED",
  subtitles: [
    { time: 0, text: "비디오 가이드를 실행해 보세요." }
  ]
};

export default function TutorialVideoPlayer({ tutorial }: Props) {
  const preset = PRESETS_BY_STEP[tutorial.id] || DEFAULT_PRESET;
  
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0); // 0-100%
  const [speed, setSpeed] = useState<0.5 | 1 | 1.5>(1);
  const [isMuted, setIsMuted] = useState(false);
  const [ccEnabled, setCcEnabled] = useState(true);
  const [playbackVolume, setPlaybackVolume] = useState(80);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number | null>(null);

  // Restart video loop if tutorial ID changes
  useEffect(() => {
    setProgress(0);
    setIsPlaying(true);
  }, [tutorial.id]);

  // Update progress tracking and canvas animation triggers
  useEffect(() => {
    if (!isPlaying) {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      return;
    }

    const intervalRate = 16.67; // approx 60fps
    const tick = (timestamp: number) => {
      if (!lastTimeRef.current) lastTimeRef.current = timestamp;
      const elapsed = timestamp - lastTimeRef.current;
      
      // video duration mock = 25 seconds for nice simulation experience
      // speed scales progress increase
      const stepValue = (elapsed / 25000) * 100 * speed;
      
      setProgress(prev => {
        const next = prev + stepValue;
        if (next >= 100) {
          return 0; // seamless repeat loop
        }
        return next;
      });

      lastTimeRef.current = timestamp;
      animationFrameRef.current = requestAnimationFrame(tick);
    };

    animationFrameRef.current = requestAnimationFrame(tick);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      lastTimeRef.current = null;
    };
  }, [isPlaying, speed]);

  // Draw simulation feed matching timeline progress points
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Clear previous frame
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // 1. Draw Simulated Face Face Outline
    ctx.fillStyle = preset.baseColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw grid mesh overlay to give a digital medical/aesthetic analysis vibe
    ctx.strokeStyle = "rgba(0, 125, 133, 0.05)";
    ctx.lineWidth = 1;
    for (let x = 0; x < canvas.width; x += 25) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, canvas.height);
      ctx.stroke();
    }
    for (let y = 0; y < canvas.height; y += 25) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(canvas.width, y);
      ctx.stroke();
    }

    // 2. Head silhouette (marine blueprint mask)
    ctx.fillStyle = "rgba(0, 125, 133, 0.04)";
    ctx.strokeStyle = "rgba(0, 125, 133, 0.15)";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.ellipse(200, 210, 105, 145, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    // Eyes landmarks representation
    ctx.fillStyle = "rgba(0, 125, 133, 0.2)";
    ctx.beginPath();
    ctx.arc(155, 165, 14, 0, Math.PI * 2); // left eye outline
    ctx.arc(245, 165, 14, 0, Math.PI * 2); // right eye outline
    ctx.fill();

    // Nose bridge guide
    ctx.strokeStyle = "rgba(0, 125, 133, 0.25)";
    ctx.beginPath();
    ctx.moveTo(200, 150);
    ctx.lineTo(200, 230);
    ctx.lineTo(185, 235);
    ctx.lineTo(215, 235);
    ctx.stroke();

    // Lips outline
    ctx.fillStyle = "rgba(224, 17, 95, 0.1)";
    ctx.beginPath();
    ctx.ellipse(200, 295, 32, 13, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = "rgba(224, 17, 95, 0.25)";
    ctx.stroke();

    // 3. Render cosmetic glow zones growing dynamically matching timeline progress
    const sweepProgress = (progress % 50) / 50; // oscillates twice per video play
    preset.glowZone.forEach((zone) => {
      const gradient = ctx.createRadialGradient(
        zone.x, zone.y, 2,
        zone.x, zone.y, zone.radius
      );
      
      const alpha = isPlaying ? 0.15 + (Math.sin(progress * 0.12) * 0.08) : 0.2;
      gradient.addColorStop(0, `rgba(0, 206, 209, ${alpha})`);
      gradient.addColorStop(0.5, `rgba(0, 125, 133, ${alpha * 0.5})`);
      gradient.addColorStop(1, "rgba(255, 255, 255, 0)");

      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(zone.x, zone.y, zone.radius, 0, Math.PI * 2);
      ctx.fill();
    });

    // 4. Trace the active tool moving rhythmically among preset points
    if (preset.actionPoints.length > 1) {
      // Calculate current brush position along preset action paths
      const numSegments = preset.actionPoints.length - 1;
      const normalizedPath = progress / 100;
      const exactIndex = Math.min(numSegments - 1, Math.floor(normalizedPath * numSegments));
      const p1 = preset.actionPoints[exactIndex];
      const p2 = preset.actionPoints[exactIndex + 1];
      const segmentProgress = (normalizedPath * numSegments) - exactIndex;

      const brushX = p1.x + (p2.x - p1.x) * segmentProgress;
      const brushY = p1.y + (p2.y - p1.y) * segmentProgress;

      // Draw shiny active guidelines matching the simulated brush stroke
      ctx.strokeStyle = "rgba(0, 206, 209, 0.4)";
      ctx.lineWidth = 3;
      ctx.setLineDash([5, 5]);
      ctx.beginPath();
      ctx.moveTo(p1.x, p1.y);
      ctx.lineTo(brushX, brushY);
      ctx.stroke();
      ctx.setLineDash([]); // reset

      // Draw brush tip glow circle
      ctx.fillStyle = "rgba(0, 206, 209, 0.6)";
      ctx.beginPath();
      ctx.arc(brushX, brushY, 10, 0, Math.PI * 2);
      ctx.fill();

      // Draw aesthetic outer lens marker
      ctx.strokeStyle = "#FFFFFF";
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.arc(brushX, brushY, 14, 0, Math.PI * 2);
      ctx.stroke();

      // Text icon placeholder representing tool
      ctx.fillStyle = "#001A1C";
      ctx.font = "bold 9px JetBrains Mono";
      let toolLabel = "APPLY";
      if (preset.brushIcon === 'sponge') toolLabel = "SPONGE";
      if (preset.brushIcon === 'brush') toolLabel = "BRUSH";
      if (preset.brushIcon === 'lip-wand') toolLabel = "LIP-WAND";
      if (preset.brushIcon === 'pencil') toolLabel = "PENCIL";
      
      ctx.fillText(toolLabel, brushX + 16, brushY + 3);
    }

    // 5. Draw digital scan overlay framing
    ctx.strokeStyle = "rgba(0, 125, 133, 0.4)";
    ctx.lineWidth = 1;
    // Top-left corner bracket
    ctx.beginPath();
    ctx.moveTo(15, 35); ctx.lineTo(15, 15); ctx.lineTo(35, 15);
    ctx.stroke();
    // Bottom-right corner bracket
    ctx.beginPath();
    ctx.moveTo(canvas.width - 15, canvas.height - 35);
    ctx.lineTo(canvas.width - 15, canvas.height - 15);
    ctx.lineTo(canvas.width - 35, canvas.height - 15);
    ctx.stroke();

    // Live Watermark and Stats indicator
    ctx.fillStyle = "rgba(0, 125, 133, 0.45)";
    ctx.font = "bold 9px JetBrains Mono";
    ctx.fillText("REC MOCK_V_SIM_FEED", 22, 28);
    ctx.fillText(`FPS: ${isPlaying ? "60.0" : "0.0"}`, canvas.width - 70, 28);
    ctx.fillText(`SPEED: ${speed}x`, canvas.width - 75, canvas.height - 24);

    // Audio frequency water waveform visualization (simulating speech)
    if (isPlaying) {
      ctx.fillStyle = "rgba(0, 206, 209, 0.35)";
      const numWaves = 12;
      for (let i = 0; i < numWaves; i++) {
        // frequency responds to progress text changes
        const currentSecond = Math.floor(progress);
        const waveHeight = 2 + Math.abs(Math.sin((currentSecond + i) * 0.4)) * (isMuted ? 0 : 16);
        ctx.fillRect(18 + (i * 4), canvas.height - 28 - waveHeight, 2.5, waveHeight);
      }
    }

  }, [preset, progress, isPlaying, speed, isMuted]);

  // Read matching subtitles corresponding to timeline progress percentage
  const getActiveSubtitle = (): string => {
    // scale progress from 0-100 to mock video progress
    const activeText = preset.subtitles.reduce((acc, current) => {
      if (progress >= current.time) {
        return current.text;
      }
      return acc;
    }, preset.subtitles[0]?.text || "");
    return activeText;
  };

  // Skip backwards
  const handleReset = () => {
    setProgress(0);
    setIsPlaying(true);
  };

  return (
    <div className="bg-brand-dark text-white rounded-[28px] overflow-hidden border border-[#D0E0E2]/30 shadow-2xl relative" id="guide_video_player_container">
      
      {/* Dynamic Player Top Ribbon */}
      <div className="bg-[#001A1C]/90 p-3.5 px-5 flex items-center justify-between border-b border-[#00CED1]/20">
        <div className="flex items-center gap-2">
          <Tv className="w-4 h-4 text-brand-secondary animate-pulse" />
          <span className="font-mono text-[9px] tracking-widest text-[#00CED1] uppercase font-bold">
            SEA-FIT ACADEMY STREAM : LEVEL {tutorial.levelNum}
          </span>
        </div>
        
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
          <span className="text-[10px] font-mono text-white/80 font-bold uppercase">
            LIVE DEMO
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12">
        
        {/* Interactive Simulated Video Canvas Frame */}
        <div className="lg:col-span-7 bg-[#001A1C] relative flex flex-col justify-center items-center p-3 sm:p-5 border-r border-[#00CED1]/10">
          
          <div className="relative w-full max-w-[380px] aspect-square rounded-[22px] overflow-hidden shadow-inner border border-[#00CED1]/20 bg-[#001A1C]">
            <canvas
              ref={canvasRef}
              width={380}
              height={380}
              className="w-full h-full cursor-zoom-in"
              onClick={() => setIsPlaying(!isPlaying)}
            />

            {/* Simulated Applier label tracking banner */}
            <div className="absolute top-4 right-4 pointer-events-none bg-[#001A1C]/80 backdrop-blur-md border border-[#00CED1]/30 rounded-xl p-2 px-3 text-[9px] font-mono text-brand-secondary">
              <span className="flex items-center gap-1.5 font-bold uppercase">
                <Layers className="w-3 h-3 text-[#00CED1]" /> {preset.overlayLabel}
              </span>
            </div>

            {/* Huge Play overlay shown when paused */}
            <AnimatePresence>
              {!isPlaying && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="absolute inset-0 bg-[#001A1C]/60 backdrop-blur-sm flex items-center justify-center cursor-pointer pointer-events-none"
                >
                  <div className="w-14 h-14 rounded-full bg-brand-primary/95 text-white flex items-center justify-center shadow-lg shadow-brand-primary/40">
                    <Play className="w-6 h-6 fill-current ml-1 text-white" />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Video Watermark Info Overlay */}
            <div className="absolute bottom-4 left-4 pointer-events-none bg-[#001A1C]/80 backdrop-blur-md rounded-xl p-1.5 px-3 uppercase text-[8px] font-mono text-white/50 border border-white/5">
              10-Step Growth System • Calibrated D65
            </div>
          </div>
          
        </div>

        {/* Video Tutorial Subtitles and Creator Specs Panel */}
        <div className="lg:col-span-5 bg-[#001A1C]/95 p-5 sm:p-6 flex flex-col justify-between space-y-5">
          
          {/* Creator Information Header */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-brand-primary text-white flex items-center justify-center shadow">
                <User className="w-4 h-4" />
              </div>
              <div>
                <h5 className="text-[11px] font-mono text-brand-secondary leading-none uppercase font-bold">Sea-fit Co-Founder</h5>
                <h4 className="text-xs font-semibold text-white mt-1 leading-none">AI 뷰티 수석 디자이너 강수진</h4>
              </div>
            </div>
            
            <p className="text-[11px] text-white/70 leading-relaxed font-sans mt-2.5">
              "우리의 바다 조수 간만 디자인은 쌩얼 피부의 수분 대칭성과 퍼스널 매치 기술로부터 발현됩니다. 실시간 가이드 비디오 플레이에 맞춰 올바른 탭핑 모션을 익혀보세요!"
            </p>
          </div>

          {/* Subtitles (CC Drawer) */}
          <div className="p-4 rounded-2xl bg-white/5 border border-white/10 relative min-h-[100px] flex flex-col justify-between">
            <span className="text-[8px] font-mono tracking-widest text-[#00CED1] uppercase font-bold">
              Subtitles / CC (KOREAN)
            </span>
            
            {ccEnabled ? (
              <p className="text-xs text-white/95 leading-relaxed font-sans mt-2 select-text font-medium">
                {getActiveSubtitle()}
              </p>
            ) : (
              <p className="text-xs text-white/40 italic font-sans mt-2">
                자막 서비스가 비활성화되어 있습니다. 우측 CC 단추를 누르면 켜집니다.
              </p>
            )}

            <div className="flex items-center gap-1.5 text-[9px] text-white/40 font-mono mt-3 self-end border border-white/5 px-2 py-0.5 rounded-lg bg-black/15">
              <Info className="w-3 h-3 text-[#00CED1]" /> AI 음성 안내 대역 연동 완료
            </div>
          </div>

          {/* Interactive Lesson Progression list highlight */}
          <div className="space-y-2">
            <span className="text-[9px] font-mono tracking-widest text-white/40 uppercase block font-bold">ACTIVE STEP LESSONS</span>
            <div className="space-y-1.5">
              {tutorial.steps.map((st, sidx) => {
                const stepCoverage = 100 / tutorial.steps.length;
                const activeIndex = Math.min(
                  tutorial.steps.length - 1, 
                  Math.floor((progress / 100) * tutorial.steps.length)
                );
                const isCurrent = activeIndex === sidx;

                return (
                  <div 
                    key={sidx}
                    className={`p-2.5 rounded-xl border text-[10.5px] transition-all flex items-start gap-2.5 ${
                      isCurrent 
                        ? "bg-[#007D85]/20 border-brand-primary text-white font-semibold" 
                        : "bg-black/10 border-transparent text-white/60"
                    }`}
                  >
                    <span className={`w-4 h-4 rounded-full flex items-center justify-center font-bold font-mono text-[9px] ${isCurrent ? 'bg-[#00CED1] text-black' : 'bg-white/10 text-white'}`}>
                      {sidx + 1}
                    </span>
                    <p className="leading-tight flex-grow">{st}</p>
                  </div>
                );
              })}
            </div>
          </div>

        </div>

      </div>

      {/* Main Bottom Control Center Interface */}
      <div className="bg-[#00191B] border-t border-[#00CED1]/15 p-4 sm:px-6 relative flex flex-col gap-3.5">
        
        {/* Seekable Timeline Scrubber */}
        <div className="flex items-center gap-3">
          <span className="text-[9px] text-[#00CED1] font-mono leading-none font-bold">
            {Math.floor(progress * 0.25).toString().padStart(2, '0')}:{(Math.floor((progress * 15) % 60)).toString().padStart(2, '0')}
          </span>
          
          <div className="relative flex-grow h-4 flex items-center group">
            <input
              type="range"
              min={0}
              max={99}
              value={progress}
              onChange={(e) => {
                setProgress(parseFloat(e.target.value));
                if (!isPlaying) setIsPlaying(true);
              }}
              className="absolute inset-0 w-full h-1 opacity-0 group-hover:opacity-100 z-30 accent-[#00CED1] cursor-pointer"
            />
            
            {/* Custom high contrast beautiful slider rails progress tracker */}
            <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden absolute pointer-events-none z-10 border border-white/5">
              <div 
                style={{ width: `${progress}%` }} 
                className="h-full bg-gradient-to-r from-brand-primary via-brand-secondary to-[#00CED1] transition-all duration-150" 
              />
            </div>
            
            {/* Dynamic visual slider handle */}
            <div 
              style={{ left: `calc(${progress}% - 6px)` }}
              className="absolute w-3.5 h-3.5 rounded-full bg-[#00CED1] border border-white shadow-md cursor-pointer pointer-events-none z-20 transition-transform group-hover:scale-125"
            />
          </div>

          <span className="text-[9px] text-white/40 font-mono leading-none">
            00:25
          </span>
        </div>

        {/* Play control, Mute toggle, Speed tuner grids */}
        <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-4">
          
          {/* Play/Pause/Rewind */}
          <div className="flex items-center gap-3 justify-center sm:justify-start">
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="w-10 h-10 rounded-full bg-brand-primary/20 hover:bg-brand-primary text-brand-secondary hover:text-white border border-[#00CED1]/40 flex items-center justify-center transition-all cursor-pointer shadow-md"
              title={isPlaying ? "일시 정지" : "재생 시작"}
            >
              {isPlaying ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current ml-0.5" />}
            </button>

            <button
              onClick={handleReset}
              className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-white/80 hover:text-white border border-white/10 transition-all cursor-pointer"
              title="동영상 가이드 처음부터 다시보기"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>

            <div className="hidden sm:block border-l border-white/10 h-5 mx-1" />

            {/* Simulated Live Audio Spectrum Indicator */}
            <p className="text-[10px] text-white/60 font-mono flex items-center gap-1.5 bg-black/35 px-3 py-1.5 rounded-xl border border-white/5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              나레이션: 한국어 (강수진 수석강사)
            </p>
          </div>

          {/* Speed tuning & Volume slider & CC Toggle */}
          <div className="flex items-center justify-center gap-3 sm:justify-end flex-wrap">
            
            {/* CC Caption button */}
            <button
              onClick={() => setCcEnabled(!ccEnabled)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[10px] font-mono font-bold border transition-all cursor-pointer ${
                ccEnabled 
                  ? "bg-[#00CED1]/15 border-[#00CED1] text-[#00CED1]" 
                  : "bg-white/5 border-transparent text-white/50 hover:bg-white/10"
              }`}
              title="자막 켜기/끄기"
            >
              <Subtitles className="w-3.5 h-3.5" />
              CC
            </button>

            {/* Interactive speed control */}
            <div className="flex items-center bg-black/45 rounded-xl border border-white/10 p-0.5 overflow-hidden">
              {([0.5, 1, 1.5] as const).map(spVal => (
                <button
                  key={spVal}
                  onClick={() => setSpeed(spVal)}
                  className={`px-2.5 py-1.5 rounded-lg text-[9px] font-mono transition-all cursor-pointer ${
                    speed === spVal 
                      ? "bg-brand-primary text-white font-bold font-mono" 
                      : "text-white/55 hover:text-white"
                  }`}
                >
                  {spVal}x
                </button>
              ))}
            </div>

            {/* Mute audio mock toggle */}
            <div className="flex items-center gap-2 bg-black/25 rounded-xl border border-white/10 px-3 py-1">
              <button
                onClick={() => setIsMuted(!isMuted)}
                className="text-white/70 hover:text-white transition-all cursor-pointer"
                title={isMuted ? "음소거 해제" : "음소거"}
              >
                {isMuted ? <VolumeX className="w-3.5 h-3.5 text-rose-400" /> : <Volume2 className="w-3.5 h-3.5 text-[#00CED1]" />}
              </button>
              
              <input
                type="range"
                min={0}
                max={100}
                value={isMuted ? 0 : playbackVolume}
                onChange={(e) => {
                  setPlaybackVolume(parseInt(e.target.value));
                  if (isMuted) setIsMuted(false);
                }}
                className="w-14 h-1 accent-[#00CED1] border-transparent appearance-none bg-white/20 rounded-full cursor-pointer"
              />
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
