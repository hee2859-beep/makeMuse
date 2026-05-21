/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useRef, useState, useEffect } from "react";
import { 
  SkinData, 
  FacialMarker,
  Tutorial
} from "../types";
import { 
  defaultFaceMarkers, 
  analyzeBareFaceCanvas, 
  drawSeaFaceOverlay, 
  drawPresetFaceModel 
} from "../lib/analyzer";
import { calculatePrepScore } from "../lib/progress";
import { Camera, RefreshCw, Sparkles, Upload, HelpCircle, Droplet } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface Props {
  onAnalysisComplete: (data: SkinData, score: number) => void;
  activePreset: 'neutral-sand' | 'warm-coral' | 'deep-abyss';
  setActivePreset: (type: 'neutral-sand' | 'warm-coral' | 'deep-abyss') => void;
  drawArActive: boolean;
  activeTutorial: Tutorial | null;
  makeupParams?: { eyelinerGap: number; lipOverstep: number; splotchiness: number };
}

export default function BareFaceAnalyzer({ 
  onAnalysisComplete, 
  activePreset, 
  setActivePreset,
  drawArActive,
  activeTutorial,
  makeupParams = { eyelinerGap: 3, lipOverstep: 8, splotchiness: 12 }
}: Props) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [markers, setMarkers] = useState<FacialMarker[]>(defaultFaceMarkers());
  const [isLiveCamera, setIsLiveCamera] = useState<boolean>(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [isDragOver, setIsDragOver] = useState<boolean>(false);
  
  // Real-time analysis state
  const [analysisData, setAnalysisData] = useState<SkinData>({
    textureScore: 35,
    rednessScore: 28,
    moistureScore: 68,
    skinTone: "자연스러운 해풍빛 내추럴 샌드",
    personalColor: "Spring Warm Light",
    analyzedAt: null
  });
  
  const [prepScore, setPrepScore] = useState<number>(68);
  const [selectedMarkerId, setSelectedMarkerId] = useState<string | null>(null);

  // Redraw preset face or video frame onto canvas
  useEffect(() => {
    redrawCanvas();
  }, [activePreset, markers]);

  // Handle live camera stream mapping
  useEffect(() => {
    let stream: MediaStream | null = null;
    if (isLiveCamera) {
      navigator.mediaDevices.getUserMedia({ video: { width: 480, height: 480, facingMode: "user" } })
        .then(s => {
          stream = s;
          if (videoRef.current) {
            videoRef.current.srcObject = s;
            videoRef.current.play();
          }
        })
        .catch(err => {
          console.error("Camera access blocked:", err);
          setCameraError("카메라 연결에 실패했습니다. 가상 시뮬레이션 모델 또는 사진 업로드를 대신 이용해 주세요.");
          setIsLiveCamera(false);
        });
    }

    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [isLiveCamera]);

  // Keep drawing video frames on the canvas if camera is active
  useEffect(() => {
    let active = true;
    const drawFrame = () => {
      if (!active) return;
      if (isLiveCamera && videoRef.current && canvasRef.current) {
        const ctx = canvasRef.current.getContext('2d');
        if (ctx) {
          ctx.drawImage(videoRef.current, 0, 0, canvasRef.current.width, canvasRef.current.height);
          drawSeaFaceOverlay(ctx, markers, canvasRef.current.width, canvasRef.current.height);
          drawArGuidelines(ctx, canvasRef.current);
        }
      }
      requestAnimationFrame(drawFrame);
    };

    if (isLiveCamera) {
      requestAnimationFrame(drawFrame);
    }
    return () => { active = false; };
  }, [isLiveCamera, markers, drawArActive, activeTutorial]);

  // Redraw preset face or video frame onto canvas
  useEffect(() => {
    redrawCanvas();
  }, [activePreset, markers, drawArActive, activeTutorial, makeupParams]);

  const drawArGuidelines = (ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) => {
    if (drawArActive && activeTutorial && activeTutorial.arGuideLines) {
      activeTutorial.arGuideLines.forEach(guide => {
        ctx.strokeStyle = guide.color;
        ctx.lineWidth = 2.5;
        ctx.setLineDash([4, 4]);
        ctx.beginPath();
        guide.points.forEach((pt, pidx) => {
          const px = (pt.x / 100) * canvas.width;
          const py = (pt.y / 100) * canvas.height;
          if (pidx === 0) ctx.moveTo(px, py);
          else ctx.lineTo(px, py);
        });
        if (guide.type === 'lips' || guide.type === 'blush') {
          ctx.closePath();
          ctx.stroke();
          ctx.fillStyle = guide.color + "22"; // 13% opacity overlay
          ctx.fill();
        } else {
          ctx.stroke();
        }
        
        ctx.setLineDash([]);
        if (guide.points.length > 0) {
          const firstPt = guide.points[0];
          ctx.fillStyle = "#FFFFFF";
          ctx.font = "bold 9px monospace";
          ctx.fillText(`AR: ${guide.label}`, (firstPt.x / 100) * canvas.width, (firstPt.y / 100) * canvas.height - 8);
        }
      });
    }
  };

  const redrawCanvas = () => {
    if (isLiveCamera) return; // Video thread takes care
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Draw base face preset based on choice, passing the dynamic makeup params as an overlay
    drawPresetFaceModel(canvas, activePreset, {
      eyelinerExtra: makeupParams.eyelinerGap,
      overstepLip: makeupParams.lipOverstep,
      baseNoise: makeupParams.splotchiness
    });

    // Draw face alignment mesh rules
    drawSeaFaceOverlay(ctx, markers, canvas.width, canvas.height);

    // Draw training guidelines (AR overlay)
    drawArGuidelines(ctx, canvas);
  };

  const handlePresetChange = (type: 'neutral-sand' | 'warm-coral' | 'deep-abyss') => {
    setIsLiveCamera(false);
    setActivePreset(type);
  };

  const triggerAnalyze = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    setIsAnalyzing(true);

    // Minor delay to simulate premium marine echo scanner
    setTimeout(() => {
      // If we are in live camera mode, we need to take a snapshot static analysis first
      if (isLiveCamera && videoRef.current) {
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
        }
      }

      const results = analyzeBareFaceCanvas(canvas, markers);
      const score = calculatePrepScore(results);

      setAnalysisData(results);
      setPrepScore(score);
      setIsAnalyzing(false);

      // Notify parent component to update globally
      onAnalysisComplete(results, score);
    }, 950);
  };

  // Custom marker drag adjustment over canvas coordinates
  const handleCanvasMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const rect = canvas.getBoundingClientRect();
    const clickX = ((e.clientX - rect.left) / rect.width) * 100;
    const clickY = ((e.clientY - rect.top) / rect.height) * 100;

    // Find closest marker within 6% bounding radius
    let closestId: string | null = null;
    let minDist = 7; // tolerance threshold

    markers.forEach(m => {
      const dist = Math.sqrt(Math.pow(m.xPercent - clickX, 2) + Math.pow(m.yPercent - clickY, 2));
      if (dist < minDist) {
        minDist = dist;
        closestId = m.id;
      }
    });

    setSelectedMarkerId(closestId);
  };

  const handleCanvasMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!selectedMarkerId || isLiveCamera) return; // Disable dragging in live feeds
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const currentX = Math.min(100, Math.max(0, ((e.clientX - rect.left) / rect.width) * 100));
    const currentY = Math.min(100, Math.max(0, ((e.clientY - rect.top) / rect.height) * 100));

    setMarkers(prev => prev.map(m => m.id === selectedMarkerId ? { ...m, xPercent: currentX, yPercent: currentY } : m));
  };

  const handleCanvasMouseUpOrLeave = () => {
    setSelectedMarkerId(null);
  };

  // Drag & drop file upload handler
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      processImageFile(files[0]);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      processImageFile(files[0]);
    }
  };

  const processImageFile = (file: File) => {
    setIsLiveCamera(false);
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // Draw the uploaded image with 1:1 fitting
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        // Draw the landmarks on top
        drawSeaFaceOverlay(ctx, markers, canvas.width, canvas.height);
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
      {/* Target Face Scanner Frame */}
      <div className="lg:col-span-6 flex flex-col items-center">
        <div 
          className={`relative border-8 border-white bg-brand-deep rounded-[40px] overflow-hidden shadow-xl p-2.5 transition-all duration-300 w-full max-w-[420px] aspect-square flex flex-col justify-center items-center`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          id="camera_viewport"
        >
          {/* Main Processing Canvas */}
          <canvas
            ref={canvasRef}
            width={400}
            height={400}
            className="w-full h-full rounded-[30px] cursor-crosshair bg-brand-deep transition-transform duration-200"
            onMouseDown={handleCanvasMouseDown}
            onMouseMove={handleCanvasMouseMove}
            onMouseUp={handleCanvasMouseUpOrLeave}
            onMouseLeave={handleCanvasMouseUpOrLeave}
          />

          {/* Hidden reference video for camera stream */}
          {isLiveCamera && (
            <video
              ref={videoRef}
              className="absolute pointer-events-none opacity-0"
              width={400}
              height={400}
              playsInline
              muted
            />
          )}

          {/* Drag & Drop Overlay Hint */}
          <div className="absolute bottom-5 left-5 right-5 pointer-events-none bg-brand-deep/90 backdrop-blur-md border border-brand-border/20 rounded-2xl p-2.5 flex items-center justify-between text-[11px] text-white/95">
            <span className="flex items-center gap-1.5 font-mono text-[10px]">
              <Upload className="w-3.5 h-3.5 text-brand-secondary" /> 이미지 드래그 또는 노드를 밀어 정밀 조율
            </span>
          </div>

          <AnimatePresence>
            {isAnalyzing && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-brand-deep/95 backdrop-blur-lg flex flex-col justify-center items-center gap-4 z-20"
              >
                <div className="relative">
                  <div className="w-16 h-16 rounded-full border-t-2 border-brand-secondary border-l-2 border-brand-primary animate-spin" />
                  <Droplet className="w-6 h-6 text-brand-secondary absolute inset-0 m-auto animate-pulse" />
                </div>
                <div className="text-center">
                  <p className="text-brand-secondary font-mono text-xs tracking-widest uppercase animate-pulse">Scanning Waves...</p>
                  <p className="text-white/70 text-xs mt-1">이마 수분 반사율 및 볼 요철 엣지 추출 중</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Input Controls Panel */}
        <div className="flex flex-wrap gap-2.5 justify-center mt-4.5 w-full max-w-[420px]">
          <button
            onClick={() => setIsLiveCamera(!isLiveCamera)}
            className={`flex items-center gap-1.5 px-4.5 py-2.5 rounded-2xl text-xs font-semibold cursor-pointer transition-all ${isLiveCamera ? "bg-emerald-50 text-emerald-700 border border-emerald-300" : "bg-white hover:bg-[#F3F6F7] text-brand-dark/90 border border-brand-border shadow-sm"}`}
            id="btn_webcam_toggle"
          >
            <Camera className="w-3.5 h-3.5" />
            {isLiveCamera ? "카메라 끄기" : "실시간 웹캠"}
          </button>

          <button
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center gap-1.5 px-4.5 py-2.5 rounded-2xl text-xs bg-white hover:bg-[#F3F6F7] text-brand-dark/90 border border-brand-border shadow-sm transition-all cursor-pointer font-semibold"
            id="btn_upload_photo"
          >
            <Upload className="w-3.5 h-3.5" />
            사진 업로드
          </button>
          
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileSelect}
          />

          <button
            onClick={redrawCanvas}
            className="p-2.5 rounded-2xl bg-white hover:bg-[#F3F6F7] text-brand-dark/90 border border-brand-border shadow-sm transition-all cursor-pointer"
            title="얼굴 랜드마크 초기화"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
        </div>

        {cameraError && (
          <p className="text-brand-primary/95 text-[10px] sm:text-xs text-center mt-3 max-w-[420px] leading-relaxed font-mono">
            ⚠️ {cameraError}
          </p>
        )}
      </div>

      {/* Numerical Diagnostics Sheet */}
      <div className="lg:col-span-6 bg-white border border-[#E0EDEE] p-6 rounded-[28px] shadow-sm">
        <div className="flex justify-between items-center mb-5">
          <div>
            <span className="text-[10px] font-mono tracking-widest text-[#007D85] opacity-60 uppercase font-bold">Interactive Playground</span>
            <h3 className="text-md font-sans font-bold text-brand-dark flex items-center gap-2">
              Sea Breeze Prep <span className="text-xs bg-brand-primary/10 text-brand-primary border border-brand-primary/20 px-2 py-0.5 rounded-full font-mono font-bold">쌩얼 분석</span>
            </h3>
          </div>
          
          <button
            onClick={triggerAnalyze}
            disabled={isAnalyzing}
            className="flex items-center gap-1.5 bg-brand-primary hover:bg-[#00474F] disabled:opacity-55 px-5 py-2.5 rounded-2xl text-xs font-bold text-white tracking-widest uppercase shadow-md shadow-brand-primary/10 cursor-pointer transition-colors"
            id="btn_calculate_skin"
          >
            <Sparkles className="w-3.5 h-3.5" />
            피부 스캔 시작
          </button>
        </div>

        {/* Dynamic Preset Switcher */}
        <div className="mb-6">
          <label className="text-xs text-brand-dark/70 block mb-2 font-semibold">체험 시뮬레이션 모델 선택:</label>
          <div className="grid grid-cols-3 gap-2">
            {[
              { id: 'neutral-sand', name: '내추럴 샌드', desc: '표준 톤 & 미세 주름' },
              { id: 'warm-coral', name: '플러시 코랄', desc: '홍조 다수 & 결 들뜸' },
              { id: 'deep-abyss', name: '딥 아비스', desc: '어두운 톤 & 매끄러움' }
            ].map(item => (
              <button
                key={item.id}
                onClick={() => handlePresetChange(item.id as any)}
                className={`p-3 rounded-2xl text-left border transition-all cursor-pointer ${activePreset === item.id ? "bg-brand-primary/5 border-brand-primary text-brand-primary" : "bg-[#F8FAFB] border-[#E0EDEE] hover:border-brand-primary/50 text-brand-dark/80"}`}
              >
                <p className="text-xs font-bold leading-tight">{item.name}</p>
                <p className="text-[9px] text-brand-dark/50 mt-1 whitespace-nowrap overflow-hidden text-ellipsis leading-none">{item.desc}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Sea Wave gauge and Sub stats */}
        <div className="space-y-5">
          
          {/* Main Wave Moisture Gauge */}
          <div className="p-5 rounded-3xl bg-[#E0EFF2] border-2 border-white shadow-inner relative overflow-hidden" id="wave_moisture_gauge">
            <div className="flex justify-between items-center mb-2.5 z-10 relative">
              <span className="text-xs font-bold text-brand-primary flex items-center gap-1">
                <Droplet className="w-3.5 h-3.5 text-brand-primary animate-bounce" />
                수분 파도 지수 (Luminance 반사율)
              </span>
              <span className="text-lg font-mono font-bold text-brand-primary">{analysisData.moistureScore}%</span>
            </div>
            
            {/* The Wave animation block */}
            <div className="w-full h-8 bg-brand-light rounded-2xl overflow-hidden relative border border-[#D0E0E2]">
              {/* Dynamic wave container shifting depending on score */}
              <motion.div 
                initial={{ y: "100%" }}
                animate={{ y: `${100 - analysisData.moistureScore}%` }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="absolute inset-0 bg-gradient-to-t from-brand-primary to-brand-secondary/80 z-0"
              />
              <div className="absolute inset-x-0 bottom-0 h-full flex items-center justify-center pointer-events-none z-10 text-[10px] text-brand-dark font-sans font-bold">
                {analysisData.moistureScore > 75 ? "🌊 기분 좋은 수분 밀물" : analysisData.moistureScore > 45 ? "💧 잔잔하고 온화한 파도결" : "⚠️ 사막 같은 보습 부족 썰물"}
              </div>
            </div>
          </div>

          {/* Redness Gauge */}
          <div>
            <div className="flex justify-between items-center mb-1 text-xs">
              <span className="text-brand-dark/80 font-semibold">볼 홍조 지수 (LAB a* 채널 수치)</span>
              <span className={`font-mono font-bold ${analysisData.rednessScore > 50 ? "text-rose-600" : "text-brand-dark"}`}>{analysisData.rednessScore}%</span>
            </div>
            <div className="w-full h-2 bg-brand-light rounded-full overflow-hidden border border-brand-border/40">
              <div 
                style={{ width: `${analysisData.rednessScore}%` }} 
                className={`h-full transition-all duration-500 bg-gradient-to-r from-[#00CED1] to-red-400`} 
              />
            </div>
            <span className="text-[10px] text-brand-dark/50 mt-1 block">홍조가 20% 이상일 경우 보습 진정 베이스(그린 메이크업)가 잠금 해제됩니다.</span>
          </div>

          {/* Skin Texture Gauge */}
          <div>
            <div className="flex justify-between items-center mb-1 text-xs">
              <span className="text-brand-dark/80 font-semibold">피부 결 요철도 (Sobel Filter 엣지 고주파 밀도)</span>
              <span className={`font-mono font-bold ${analysisData.textureScore > 50 ? "text-amber-600" : "text-[#007D85]"}`}>{analysisData.textureScore}%</span>
            </div>
            <div className="w-full h-2 bg-brand-light rounded-full overflow-hidden border border-brand-border/40">
              <div 
                style={{ width: `${analysisData.textureScore}%` }} 
                className={`h-full transition-all duration-500 ${analysisData.textureScore > 55 ? "bg-amber-500" : "bg-brand-primary"}`} 
              />
            </div>
            <span className="text-[10px] text-brand-dark/50 mt-1 block">요철 수치가 낮을수록(피부가 매끈할수록) 파운데이션 흡착성이 상승합니다.</span>
          </div>

          {/* Global Aggregated Barefoot Prep Score Card */}
          <div className="grid grid-cols-2 gap-3 mt-4 pt-4 border-t border-brand-border/50">
            <div className="p-3 bg-brand-light rounded-2xl border border-brand-border/50">
              <p className="text-[10px] font-mono text-brand-dark/50 uppercase font-bold">톤 정보 판독</p>
              <p className="text-xs font-bold text-brand-dark mt-1 max-w-full overflow-hidden text-ellipsis whitespace-nowrap">{analysisData.skinTone}</p>
            </div>
            <div className="p-3 bg-brand-light rounded-2xl border border-brand-border/50 flex justify-between items-center">
              <div>
                <p className="text-[10px] font-mono text-brand-primary uppercase font-bold">BFP 통합 프렙 점수</p>
                <p className="text-md font-mono font-bold text-brand-dark mt-1">{prepScore}점 / 100</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-brand-primary text-white flex items-center justify-center font-bold text-[11px] uppercase tracking-tighter">
                {prepScore >= 75 ? "EXC" : prepScore >= 50 ? "GOOD" : "DRY"}
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
