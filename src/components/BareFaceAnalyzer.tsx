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
  onAnalysisComplete: (data: SkinData, score: number, thumbnail?: string, sourceName?: string) => void;
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
  const fileInputAfterRef = useRef<HTMLInputElement | null>(null);

  const [markers, setMarkers] = useState<FacialMarker[]>(defaultFaceMarkers());
  const [isLiveCamera, setIsLiveCamera] = useState<boolean>(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [isDragOver, setIsDragOver] = useState<boolean>(false);
  
  // Real compare states to support comparing before and after makeup photos
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);
  const [uploadedImageSrc, setUploadedImageSrc] = useState<string | null>(null);
  const [uploadedAfterFileName, setUploadedAfterFileName] = useState<string | null>(null);
  const [afterImageSrc, setAfterImageSrc] = useState<string | null>(null);

  const [activeCompareMode, setActiveCompareMode] = useState<'scan' | 'before' | 'after' | 'split'>('scan');
  const [splitPercent, setSplitPercent] = useState<number>(50);

  const uploadedImageRef = useRef<HTMLImageElement | null>(null);
  const uploadedAfterImageRef = useRef<HTMLImageElement | null>(null);

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
  }, [activePreset, markers, activeCompareMode, splitPercent, uploadedImageSrc, afterImageSrc]);

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
  }, [activePreset, markers, drawArActive, activeTutorial, makeupParams, uploadedImageSrc, afterImageSrc, activeCompareMode, splitPercent]);

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

  // Paint simulated makeup on top of photos using adjusted markers mapping
  const drawVirtualMakeup = (ctx: CanvasRenderingContext2D, w: number, h: number) => {
    const lx = (markers.find(m => m.id === 'lip_left')?.xPercent || 42) / 100 * w;
    const ly = (markers.find(m => m.id === 'lip_left')?.yPercent || 78) / 100 * h;
    const rx = (markers.find(m => m.id === 'lip_right')?.xPercent || 58) / 100 * w;
    const ry = (markers.find(m => m.id === 'lip_right')?.yPercent || 78) / 100 * h;

    const eyeLx = (markers.find(m => m.id === 'eye_left_outer')?.xPercent || 28) / 100 * w;
    const eyeLy = (markers.find(m => m.id === 'eye_left_outer')?.yPercent || 44) / 100 * h;
    const eyeRx = (markers.find(m => m.id === 'eye_right_outer')?.xPercent || 72) / 100 * w;
    const eyeRy = (markers.find(m => m.id === 'eye_right_outer')?.yPercent || 44) / 100 * h;

    const cheekLx = (markers.find(m => m.id === 'cheek_left')?.xPercent || 35) / 100 * w;
    const cheekLy = (markers.find(m => m.id === 'cheek_left')?.yPercent || 55) / 100 * h;
    const cheekRx = (markers.find(m => m.id === 'cheek_right')?.xPercent || 65) / 100 * w;
    const cheekRy = (markers.find(m => m.id === 'cheek_right')?.yPercent || 55) / 100 * h;

    // 1. Cheek Blush (Soft Rose)
    let blushGradL = ctx.createRadialGradient(cheekLx, cheekLy, 2, cheekLx, cheekLy, w / 7);
    blushGradL.addColorStop(0, 'rgba(244, 63, 94, 0.45)');
    blushGradL.addColorStop(1, 'rgba(255, 255, 255, 0)');
    ctx.fillStyle = blushGradL;
    ctx.beginPath();
    ctx.arc(cheekLx, cheekLy, w / 6, 0, 2 * Math.PI);
    ctx.fill();

    let blushGradR = ctx.createRadialGradient(cheekRx, cheekRy, 2, cheekRx, cheekRy, w / 7);
    blushGradR.addColorStop(0, 'rgba(244, 63, 94, 0.45)');
    blushGradR.addColorStop(1, 'rgba(255, 255, 255, 0)');
    ctx.fillStyle = blushGradR;
    ctx.beginPath();
    ctx.arc(cheekRx, cheekRy, w / 6, 0, 2 * Math.PI);
    ctx.fill();

    // 2. Lips Lipstick
    const midX = (lx + rx) / 2;
    const midY = (ly + ry) / 2;
    const rxX = Math.abs(rx - lx) / 1.7;
    const ryY = Math.max(9, rxX / 2.8);

    ctx.fillStyle = '#E30B5D';
    ctx.beginPath();
    ctx.ellipse(midX, midY, rxX, ryY, 0, 0, 2 * Math.PI);
    ctx.fill();

    ctx.fillStyle = '#FF4D80';
    ctx.beginPath();
    ctx.ellipse(midX, midY - ryY/6, rxX * 0.85, ryY * 0.65, 0, 0, 2 * Math.PI);
    ctx.fill();

    // 3. Eyeliner wings
    ctx.strokeStyle = '#0F172A';
    ctx.lineWidth = 3.5;
    ctx.lineCap = 'round';

    // Left eye eyeliner wings
    ctx.beginPath();
    ctx.moveTo(eyeLx - 8, eyeLy + 2);
    ctx.quadraticCurveTo(eyeLx, eyeLy, eyeLx + 10, eyeLy - 3 + (makeupParams?.eyelinerGap || 0));
    ctx.stroke();

    // Right eye eyeliner wings
    ctx.beginPath();
    ctx.moveTo(eyeRx + 8, eyeRy + 2);
    ctx.quadraticCurveTo(eyeRx, eyeRy, eyeRx - 10, eyeRy - 3 + (makeupParams?.eyelinerGap || 0));
    ctx.stroke();
  };

  const redrawCanvas = () => {
    if (isLiveCamera) return; // Video thread takes care
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const w = canvas.width;
    const h = canvas.height;

    if (activeCompareMode === 'split') {
      const splitX = w * splitPercent / 100;

      // Left Half: Before (Original naked skin)
      ctx.save();
      ctx.beginPath();
      ctx.rect(0, 0, splitX, h);
      ctx.clip();
      
      if (uploadedImageSrc && uploadedImageRef.current) {
        ctx.drawImage(uploadedImageRef.current, 0, 0, w, h);
      } else {
        drawPresetFaceModel(canvas, activePreset, {
          eyelinerExtra: makeupParams.eyelinerGap,
          overstepLip: makeupParams.lipOverstep,
          baseNoise: makeupParams.splotchiness,
          skipMakeup: true
        });
      }
      ctx.restore();

      // Right Half: After (Makeup)
      ctx.save();
      ctx.beginPath();
      ctx.rect(splitX, 0, w - splitX, h);
      ctx.clip();

      if (afterImageSrc && uploadedAfterImageRef.current) {
        // Show real uploaded after photo
        ctx.drawImage(uploadedAfterImageRef.current, 0, 0, w, h);
      } else if (uploadedImageSrc && uploadedImageRef.current) {
        // Show simulated virtual makeup on top of uploaded photo
        ctx.drawImage(uploadedImageRef.current, 0, 0, w, h);
        drawVirtualMakeup(ctx, w, h);
      } else {
        // Show default preset with simulated makeup
        drawPresetFaceModel(canvas, activePreset, {
          eyelinerExtra: makeupParams.eyelinerGap,
          overstepLip: makeupParams.lipOverstep,
          baseNoise: makeupParams.splotchiness,
          skipMakeup: false
        });
      }
      ctx.restore();

      // Slider boundary vertical line
      ctx.strokeStyle = '#FFFFFF';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(splitX, 0);
      ctx.lineTo(splitX, h);
      ctx.stroke();

      // Interactive handle circle
      ctx.fillStyle = '#00CED1';
      ctx.beginPath();
      ctx.arc(splitX, h / 2, 12, 0, 2 * Math.PI);
      ctx.fill();
      ctx.strokeStyle = '#FFFFFF';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Split marker glyph
      ctx.fillStyle = '#FFFFFF';
      ctx.font = 'bold 10px sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('◀▶', splitX, h / 2);

    } else if (activeCompareMode === 'before') {
      if (uploadedImageSrc && uploadedImageRef.current) {
        ctx.drawImage(uploadedImageRef.current, 0, 0, w, h);
      } else {
        drawPresetFaceModel(canvas, activePreset, {
          eyelinerExtra: makeupParams.eyelinerGap,
          overstepLip: makeupParams.lipOverstep,
          baseNoise: makeupParams.splotchiness,
          skipMakeup: true
        });
      }
    } else if (activeCompareMode === 'after') {
      if (afterImageSrc && uploadedAfterImageRef.current) {
        ctx.drawImage(uploadedAfterImageRef.current, 0, 0, w, h);
      } else if (uploadedImageSrc && uploadedImageRef.current) {
        ctx.drawImage(uploadedImageRef.current, 0, 0, w, h);
        drawVirtualMakeup(ctx, w, h);
      } else {
        drawPresetFaceModel(canvas, activePreset, {
          eyelinerExtra: makeupParams.eyelinerGap,
          overstepLip: makeupParams.lipOverstep,
          baseNoise: makeupParams.splotchiness,
          skipMakeup: false
        });
      }
    } else {
      // DEFAULT: 'scan' (Guides, highlights, and mesh)
      if (uploadedImageSrc && uploadedImageRef.current) {
        ctx.drawImage(uploadedImageRef.current, 0, 0, w, h);
      } else {
        drawPresetFaceModel(canvas, activePreset, {
          eyelinerExtra: makeupParams.eyelinerGap,
          overstepLip: makeupParams.lipOverstep,
          baseNoise: makeupParams.splotchiness,
          skipMakeup: false
        });
      }

      // Draw face alignment mesh rules
      drawSeaFaceOverlay(ctx, markers, w, h);

      // Draw training guidelines (AR overlay)
      drawArGuidelines(ctx, canvas);
    }
  };

  const handlePresetChange = (type: 'neutral-sand' | 'warm-coral' | 'deep-abyss') => {
    setIsLiveCamera(false);
    setUploadedFileName(null);
    setUploadedImageSrc(null);
    setAfterImageSrc(null);
    setUploadedAfterFileName(null);
    uploadedImageRef.current = null;
    uploadedAfterImageRef.current = null;
    setActiveCompareMode('scan');
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
          try {
            const dataUrl = canvas.toDataURL("image/jpeg");
            const img = new Image();
            img.onload = () => {
              uploadedImageRef.current = img;
              setUploadedImageSrc(dataUrl);
              setUploadedFileName("웹캠 스냅샷");
              setIsLiveCamera(false);
              
              runScanningLogic(canvas, "웹캠 스냅샷", dataUrl);
            };
            img.src = dataUrl;
            return;
          } catch (e) {
            console.error(e);
          }
        }
      }

      const results = analyzeBareFaceCanvas(canvas, markers);
      const score = calculatePrepScore(results);

      setAnalysisData(results);
      setPrepScore(score);
      setIsAnalyzing(false);

      // Extract raw compressed thumbnail of active canvas
      let thumb = "";
      try {
        thumb = canvas.toDataURL("image/jpeg", 0.35);
      } catch (e) {
        console.error(e);
      }

      const sourceName = uploadedFileName 
        ? `사진 업로드: ${uploadedFileName}` 
        : `시뮬레이션 모델: ${activePreset === 'neutral-sand' ? '내추럴 샌드' : activePreset === 'warm-coral' ? '플러시 코랄' : '딥 아비스'}`;

      // Notify parent component to update globally with persistent parameters
      onAnalysisComplete(results, score, thumb, sourceName);
    }, 950);
  };

  const runScanningLogic = (canvas: HTMLCanvasElement, sourceName: string, thumb: string) => {
    const results = analyzeBareFaceCanvas(canvas, markers);
    const score = calculatePrepScore(results);

    setAnalysisData(results);
    setPrepScore(score);
    setIsAnalyzing(false);

    onAnalysisComplete(results, score, thumb, sourceName);
  };

  // Custom marker drag adjustment over canvas coordinates
  const handleCanvasMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const rect = canvas.getBoundingClientRect();
    const clickX = ((e.clientX - rect.left) / rect.width) * 100;
    const clickY = ((e.clientY - rect.top) / rect.height) * 100;

    if (activeCompareMode === "split") {
      // Grab slider dividing line if clicked close to it (e.g. within 6% bounds)
      if (Math.abs(clickX - splitPercent) < 7) {
        setSelectedMarkerId("split_handle");
        return;
      }
    }

    if (activeCompareMode !== "scan") {
      // Disable marker dragging when focusing purely on the visual comparison
      return;
    }

    // Find closest marker within 7% bounding radius
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
    if (!selectedMarkerId) return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const currentX = Math.min(100, Math.max(0, ((e.clientX - rect.left) / rect.width) * 100));
    const currentY = Math.min(100, Math.max(0, ((e.clientY - rect.top) / rect.height) * 100));

    if (selectedMarkerId === "split_handle") {
      setSplitPercent(currentX);
      return;
    }

    if (isLiveCamera) return; // Disable dragging in live feeds
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
      processImageFile(files[0], false);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      processImageFile(files[0], false);
    }
  };

  const handleFileSelectAfter = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      processImageFile(files[0], true);
    }
  };

  const processImageFile = (file: File, isAfterMakeup: boolean = false) => {
    setIsLiveCamera(false);
    const reader = new FileReader();
    reader.onload = (event) => {
      const resultStr = event.target?.result as string;
      const img = new Image();
      img.onload = () => {
        if (isAfterMakeup) {
          uploadedAfterImageRef.current = img;
          setAfterImageSrc(resultStr);
          setUploadedAfterFileName(file.name);
          setActiveCompareMode('split'); // Auto transition to sliding divide
        } else {
          uploadedImageRef.current = img;
          setUploadedImageSrc(resultStr);
          setUploadedFileName(file.name);
          if (activeCompareMode !== 'before' && activeCompareMode !== 'after') {
            setActiveCompareMode('scan');
          }
        }
      };
      img.src = resultStr;
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

          {/* Compare mode indicator / watermark */}
          <div className="absolute top-4 left-4 bg-brand-primary/80 backdrop-blur-md px-3.5 py-1.5 rounded-full text-[10px] text-white font-bold font-mono tracking-wide z-10 select-none shadow-sm">
            {activeCompareMode === 'scan' ? "🔍 분석 & 가이드 수면" : 
             activeCompareMode === 'before' ? "🧴 쌩얼 전 (Before)" : 
             activeCompareMode === 'after' ? "💄 화장 후 (After)" : 
             "🌓 반반 비교 슬라이더"}
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
            className={`flex items-center gap-1.5 px-4.5 py-2.5 rounded-2xl text-xs font-semibold cursor-pointer transition-all ${isLiveCamera ? "bg-emerald-50 text-emerald-700 border border-emerald-300 font-bold" : "bg-white hover:bg-[#F3F6F7] text-brand-dark/90 border border-brand-border shadow-sm"}`}
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
            {uploadedImageSrc ? "쌩얼 사진 변경" : "쌩얼 사진 업로드"}
          </button>
          
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileSelect}
          />

          <button
            onClick={() => {
              // Reset uploading completely to standard preset
              setUploadedImageSrc(null);
              setUploadedFileName(null);
              setAfterImageSrc(null);
              setUploadedAfterFileName(null);
              uploadedImageRef.current = null;
              uploadedAfterImageRef.current = null;
              setActiveCompareMode('scan');
              setMarkers(defaultFaceMarkers());
            }}
            className="p-2.5 rounded-2xl bg-white hover:bg-[#F3F6F7] text-brand-dark/90 border border-brand-border shadow-sm transition-all cursor-pointer"
            title="얼굴 랜드마크 초기화 및 리셋"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Comparison Control Desk Overlay */}
        <div className="w-full max-w-[420px] bg-[#F4F9FA] border border-[#D5E6E8] rounded-[24px] p-4 mt-4 space-y-3 shadow-sm">
          <div className="flex justify-between items-center">
            <p className="text-[10px] font-mono font-bold text-brand-primary uppercase tracking-wider">Before / After Compare Deck</p>
            {activeCompareMode === 'after' && !afterImageSrc && (
              <span className="text-[9px] bg-brand-primary/15 text-brand-primary border border-brand-primary/25 px-2 py-0.5 rounded-full font-bold">
                디지털 훈련 메이크업 적용됨
              </span>
            )}
            {afterImageSrc && (
              <span className="text-[9px] bg-emerald-500/15 text-emerald-700 border border-emerald-500/25 px-2 py-0.5 rounded-full font-bold">
                화장 후 샷 비교 활성
              </span>
            )}
          </div>

          {/* Mode switch Tabs */}
          <div className="grid grid-cols-4 gap-1.5 bg-white p-1 rounded-xl border border-brand-border/40">
            {[
              { id: 'scan', label: '수면가이드', tooltip: '수분계측 및 랜드마크 튜닝' },
              { id: 'before', label: '화장 전', tooltip: '티 없이 맑은 쌩얼 원본' },
              { id: 'after', label: '화장 후', tooltip: '가상 화장 덧칠 또는 화장 후 샷' },
              { id: 'split', label: '커튼 비교', tooltip: '슬라이더 반반 커튼 비교' }
            ].map(m => (
              <button
                key={m.id}
                onClick={() => setActiveCompareMode(m.id as any)}
                className={`py-1.5 rounded-lg text-[11px] font-semibold transition-all cursor-pointer ${activeCompareMode === m.id ? "bg-brand-primary text-white font-bold shadow-md" : "text-brand-dark/50 hover:text-brand-dark/90"}`}
                title={m.tooltip}
              >
                {m.label}
              </button>
            ))}
          </div>

          {/* Slider for sliding curtain split view */}
          {activeCompareMode === 'split' && (
            <div className="space-y-1.5 bg-white p-3 rounded-xl border border-brand-border/30">
              <div className="flex justify-between text-[11px] text-brand-dark/60 font-semibold font-sans">
                <span>🧴 쌩얼 (Before)</span>
                <span className="font-mono text-brand-primary font-bold">{Math.round(splitPercent)}%</span>
                <span>💄 화장 후 (After)</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={splitPercent}
                onChange={(e) => setSplitPercent(Number(e.target.value))}
                className="w-full h-1 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-brand-primary"
              />
              <p className="text-[9px] text-brand-dark/45 text-center leading-relaxed">
                스캐너 스크린 위의 <strong>◀▶</strong> 아이콘이나 바로 위의 무지개 바를 손가락/마우스로 가볍게 밀어서 조율해보세요!
              </p>
            </div>
          )}

          {/* Action options for letting active user upload after photo */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pt-2.5 border-t border-brand-border/30 gap-2">
            <span className="text-[10px] text-brand-dark/50 leading-relaxed">직접 화장을 마친 사진이 있으신가요?</span>
            <button
              onClick={() => fileInputAfterRef.current?.click()}
              className="text-[10px] text-brand-primary font-bold hover:bg-[#EAF5F7] flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-xl border border-brand-border/60 shadow-sm cursor-pointer transition-colors"
            >
              <Upload className="w-3 h-3 text-brand-secondary" />
              화장 후 사진 업로드
            </button>
          </div>
          
          <input
            ref={fileInputAfterRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileSelectAfter}
          />
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
                className={`p-3 rounded-2xl text-left border transition-all cursor-pointer ${activePreset === item.id && !uploadedImageSrc ? "bg-brand-primary/5 border-brand-primary text-brand-primary" : "bg-[#F8FAFB] border-[#E0EDEE] hover:border-brand-primary/50 text-brand-dark/80"}`}
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
