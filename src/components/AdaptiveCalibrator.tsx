/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useMemo, useState, useEffect } from "react";
import { SkinData, UserProfile } from "../types";
import { 
  Sparkles, 
  Trash2, 
  TrendingUp, 
  History, 
  Cpu, 
  ChevronRight, 
  Camera, 
  Info,
  Users,
  Plus,
  X,
  Dribbble,
  ShieldAlert,
  Sliders,
  HelpCircle,
  LineChart,
  Pencil,
  Globe,
  Activity,
  Wifi,
  RefreshCw,
  Play,
  Pause,
  Radio,
  MapPin,
  Eye
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

export interface SkinHistoryRecord extends SkinData {
  id: string;
  imageThumbnail: string; // Base64 thumbnail string
  sourceName: string; // "photo_beach_bloom.png" or "Webcam Shot"
  prepScore: number;
}

interface Props {
  history: SkinHistoryRecord[];
  onClearHistory: () => void;
  onAddMockUpload: (presetType: 'glowing' | 'reddish' | 'flaky') => void;
  onRestoreFromHistory: (record: SkinHistoryRecord) => void;
  profiles: UserProfile[];
  activeProfileId: string;
  setActiveProfileId: (id: string) => void;
  onUpdateProfiles: React.Dispatch<React.SetStateAction<UserProfile[]>>;
}

export default function AdaptiveCalibrator({ 
  history, 
  onClearHistory, 
  onAddMockUpload,
  onRestoreFromHistory,
  profiles,
  activeProfileId,
  setActiveProfileId,
  onUpdateProfiles
}: Props) {
  
  // Local state for user registration form
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingProfileId, setEditingProfileId] = useState<string | null>(null);
  const [formName, setFormName] = useState("");
  const [formSkinType, setFormSkinType] = useState<'dry' | 'oily' | 'sensitive' | 'normal'>('normal');
  const [formNotes, setFormNotes] = useState("");
  const [formAvatarColor, setFormAvatarColor] = useState("bg-[#007D85]");

  // Local state to toggle history filtering
  const [filterActiveUserOnly, setFilterActiveUserOnly] = useState<boolean>(true);

  // --- Real-time Global Biometric Telemetry & Simulation Setup ---
  interface GlobalLiveScanEvent {
    id: string;
    name: string;
    location: string;
    skinType: 'dry' | 'oily' | 'sensitive' | 'normal';
    moistureScore: number;
    rednessScore: number;
    textureScore: number;
    prepScore: number;
    personalColor: string;
    skinTone: string;
    analyzedAt: string;
    cosmeticAdvice: string;
  }

  const [globalLiveEvents, setGlobalLiveEvents] = useState<GlobalLiveScanEvent[]>(() => {
    return [
      {
        id: "live_1",
        name: "서*영",
        location: "서울시 마포구",
        skinType: "sensitive",
        moistureScore: 49,
        rednessScore: 68,
        textureScore: 32,
        prepScore: 48,
        personalColor: "Summer Cool Light",
        skinTone: "여름 쿨톤 페일 로즈",
        analyzedAt: "방금 전",
        cosmeticAdvice: "솔잎 민트 수렴 진정 시카 크림"
      },
      {
        id: "live_2",
        name: "강*우",
        location: "제주도 제주시",
        skinType: "normal",
        moistureScore: 82,
        rednessScore: 16,
        textureScore: 18,
        prepScore: 89,
        personalColor: "Spring Warm Light",
        skinTone: "내추럴 샌디 베이지",
        analyzedAt: "45초 전",
        cosmeticAdvice: "기초 해수 젤 라이트 스파"
      },
      {
        id: "live_3",
        name: "김*진",
        location: "부산 수영구",
        skinType: "dry",
        moistureScore: 31,
        rednessScore: 24,
        textureScore: 58,
        prepScore: 36,
        personalColor: "Autumn Warm Warm",
        skinTone: "가을 웜 진저 샌드",
        analyzedAt: "2분 전",
        cosmeticAdvice: "심해 블루 카밍 미스트 + 리치 모이스처 에센스"
      },
      {
        id: "live_4",
        name: "Yumi Sato",
        location: "Tokyo Shinjuku",
        skinType: "oily",
        moistureScore: 54,
        rednessScore: 31,
        textureScore: 67,
        prepScore: 49,
        personalColor: "Winter Cool Deep",
        skinTone: "윈터 실크 화이트 비트",
        analyzedAt: "5분 전",
        cosmeticAdvice: "매트 포어 프라이밍 세범 가드"
      },
      {
        id: "live_5",
        name: "박*호",
        location: "인천 송도동",
        skinType: "normal",
        moistureScore: 78,
        rednessScore: 20,
        textureScore: 22,
        prepScore: 84,
        personalColor: "Spring Warm Light",
        skinTone: "스프링 선샤인 글로우 베이지",
        analyzedAt: "12분 전",
        cosmeticAdvice: "해양 무공해 하이드로 밤 + 수분 베일"
      }
    ];
  });

  const [simulatedOnlineUsers, setSimulatedOnlineUsers] = useState(384);
  const [totalScansCount, setTotalScansCount] = useState(4892);
  const [liveStreamingActive, setLiveStreamingActive] = useState(true);
  const [streamSpeed, setStreamSpeed] = useState<number>(7000); // 4000, 7000, 12000 ms intervals
  const [newlyArrivedId, setNewlyArrivedId] = useState<string | null>(null);

  // Dynamic fluctuation of online users to look fully alive!
  useEffect(() => {
    const timer = setInterval(() => {
      setSimulatedOnlineUsers(prev => {
        const drift = Math.floor(Math.random() * 7) - 3; // -3 to +3
        return Math.max(310, Math.min(450, prev + drift));
      });
    }, 4500);
    return () => clearInterval(timer);
  }, []);

  // Simulator interval code to push fresh telemetry
  useEffect(() => {
    if (!liveStreamingActive) return;

    const locations = [
      { city: "서울 성동구", name: "최*린" },
      { city: "경기 성남시", name: "이*윤" },
      { city: "부산 해운대구", name: "정*희" },
      { city: "제주 서귀포시", name: "고*은" },
      { city: "인천 연수구", name: "송*아" },
      { city: "강원 강릉시", name: "황*호" },
      { city: "대전 유성구", name: "임*민" },
      { city: "광주 북구", name: "한*은" },
      { city: "Tokyo Shibuya", name: "Airi A." },
      { city: "California", name: "Emily S." },
      { city: "New York", name: "Michael K." },
      { city: "Seoul Gangnam", name: "Jennie K." }
    ];

    const skinTypes: Array<'dry' | 'oily' | 'sensitive' | 'normal'> = ["dry", "oily", "sensitive", "normal"];
    const personalColors = ["Spring Warm Light", "Summer Cool Light", "Autumn Warm Deep", "Winter Cool Deep"];
    const skinTones = [
      "자연스러운 해풍빛 내추럴 샌드",
      "생기있고 투명한 진주빛 베이지",
      "열감 가득 붉은빛 수렴 핑크",
      "거칠고 건조한 모래밭 샌디 베이지",
      "우아한 도자기 오티 프레쉬"
    ];

    const interval = setInterval(() => {
      const randomLoc = locations[Math.floor(Math.random() * locations.length)];
      const randomSkinType = skinTypes[Math.floor(Math.random() * skinTypes.length)];
      const randomPColor = personalColors[Math.floor(Math.random() * personalColors.length)];
      const randomTone = skinTones[Math.floor(Math.random() * skinTones.length)];

      let m = 50, r = 25, t = 30;
      let advice = "기초 해수 젤 라이트 스파";

      if (randomSkinType === 'dry') {
        m = Math.floor(Math.random() * 20) + 15; // 15-35
        r = Math.floor(Math.random() * 20) + 15; // 15-35
        t = Math.floor(Math.random() * 30) + 50; // 50-80
        advice = "심해 블루 카밍 미스트 + 리치 모이스처 에센스";
      } else if (randomSkinType === 'oily') {
        m = Math.floor(Math.random() * 20) + 45; // 45-65
        r = Math.floor(Math.random() * 20) + 25; // 25-45
        t = Math.floor(Math.random() * 30) + 55; // 55-85
        advice = "매트 포어 프라이밍 세범 가드";
      } else if (randomSkinType === 'sensitive') {
        m = Math.floor(Math.random() * 25) + 35; // 35-60
        r = Math.floor(Math.random() * 35) + 50; // 50-85
        t = Math.floor(Math.random() * 20) + 20; // 20-40
        advice = "솔잎 민트 수렴 진정 시카 크림";
      } else {
        m = Math.floor(Math.random() * 20) + 75; // 75-95
        r = Math.floor(Math.random() * 15) + 5;  // 5-20
        t = Math.floor(Math.random() * 15) + 5;  // 5-20
        advice = "유리알 실크 브라이트 쉬머링 베이스";
      }

      const calculatedPrep = Math.round((m * 0.5) + ((100 - r) * 0.3) + ((100 - t) * 0.2));
      const eventId = `live_${Date.now()}`;

      const newEvent: GlobalLiveScanEvent = {
        id: eventId,
        name: randomLoc.name,
        location: randomLoc.city,
        skinType: randomSkinType,
        moistureScore: m,
        rednessScore: r,
        textureScore: t,
        prepScore: calculatedPrep,
        personalColor: randomPColor,
        skinTone: randomTone,
        analyzedAt: "방금 전",
        cosmeticAdvice: advice
      };

      setGlobalLiveEvents(prev => {
        const updatedPrev = prev.map((item) => {
          if (item.analyzedAt === "방금 전") {
            return { ...item, analyzedAt: "10초 전" };
          } else if (item.analyzedAt === "10초 전") {
            return { ...item, analyzedAt: "1분 전" };
          } else if (item.analyzedAt.endsWith("분 전")) {
            const mins = parseInt(item.analyzedAt.split("분 전")[0], 10);
            return { ...item, analyzedAt: `${mins + 1}분 전` };
          }
          return item;
        });
        
        return [newEvent, ...updatedPrev].slice(0, 8);
      });

      setNewlyArrivedId(eventId);
      setTotalScansCount(prev => prev + 1);

      setTimeout(() => {
        setNewlyArrivedId(null);
      }, 1500);

    }, streamSpeed);

    return () => clearInterval(interval);
  }, [liveStreamingActive, streamSpeed]);

  // Inject user custom simulated run immediately
  const handleTriggerSimulatedScan = () => {
    const names = ["홍*정 (게스트)", "양*리 (서퍼)", "이*진 (크리에이터)", "Daniel K.", "Chloe"];
    const locations = ["부산 민락동", "강원 양양군 해변", "서울 성동구 성수동", "Jeju Aewol", "California Beach"];
    const types: Array<'dry' | 'oily' | 'sensitive' | 'normal'> = ["dry", "oily", "sensitive", "normal"];

    const rName = names[Math.floor(Math.random() * names.length)];
    const rLoc = locations[Math.floor(Math.random() * locations.length)];
    const rType = types[Math.floor(Math.random() * types.length)];

    let m = 60, r = 20, t = 20;
    let advice = "기초 해수 젤 라이트 스파";

    if (rType === 'dry') {
      m = 25; r = 18; t = 64;
      advice = "심해 블루 카밍 미스트 + 리치 모이스처 에센스";
    } else if (rType === 'oily') {
      m = 61; r = 38; t = 75;
      advice = "매트 포어 프라이밍 세범 가드";
    } else if (rType === 'sensitive') {
      m = 48; r = 74; t = 23;
      advice = "솔잎 민트 수렴 진정 시카 크림";
    } else {
      m = 92; r = 10; t = 12;
      advice = "유리알 실크 브라이트 쉬머링 베이스";
    }

    const calculatedPrep = Math.round((m * 0.5) + ((100 - r) * 0.3) + ((100 - t) * 0.2));
    const eventId = `live_manual_${Date.now()}`;

    const newEvent: GlobalLiveScanEvent = {
      id: eventId,
      name: rName,
      location: rLoc,
      skinType: rType,
      moistureScore: m,
      rednessScore: r,
      textureScore: t,
      prepScore: calculatedPrep,
      personalColor: "Summer Cool Light",
      skinTone: "투명하고 조화로운 페일 진주 톤",
      analyzedAt: "방금 전",
      cosmeticAdvice: advice
    };

    setGlobalLiveEvents(prev => [newEvent, ...prev].slice(0, 8));
    setNewlyArrivedId(eventId);
    setTotalScansCount(prev => prev + 1);

    setTimeout(() => {
      setNewlyArrivedId(null);
    }, 1500);
  };

  // Function to load raw stats derived from dynamic feed onto current personalized simulator
  const handleLoadGlobalUserSessionToLocal = (event: GlobalLiveScanEvent) => {
    const simulatedSkinData: SkinData = {
      moistureScore: event.moistureScore,
      rednessScore: event.rednessScore,
      textureScore: event.textureScore,
      skinTone: event.skinTone,
      personalColor: event.personalColor,
      analyzedAt: new Date().toLocaleString('ko-KR'),
      profileId: activeProfileId
    };

    const matchedRecord: SkinHistoryRecord = {
      ...simulatedSkinData,
      id: `hist_load_${Date.now()}`,
      imageThumbnail: "",
      sourceName: `[원격 동기화] ${event.location} 의 ${event.name} 생얼 지표`,
      prepScore: event.prepScore
    };

    onRestoreFromHistory(matchedRecord);
  };
  // ---------------------------------------------------------------

  // Avatar color selections helper
  const availableColors = [
    { class: "bg-[#007D85]", hex: "#007D85", label: "마린 블루" },
    { class: "bg-amber-500", hex: "#F59E0B", label: "샌드 진저" },
    { class: "bg-[#10B981]", hex: "#10B981", label: "민트 리프" },
    { class: "bg-rose-500", hex: "#F43F5E", label: "코랄 세럼" },
    { class: "bg-indigo-500", hex: "#6366F1", label: "스카이 비드" }
  ];

  // Map skin types to Korean labels & description preset
  const skinTypeLabels: Record<string, { title: string; desc: string; icon: string }> = {
    dry: { title: "속건조형 (Dry/Dehydrated)", desc: "수분 보습력이 부족하며 각질 들뜸에 취약한 타입", icon: "💦" },
    oily: { title: "지성·요철 트러블형 (Oily/Pores)", desc: "유분 과다 및 모공 잔주름 고주파 요철이 높은 타입", icon: "🌿" },
    sensitive: { title: "민감성 홍조형 (Sensitive/Redness)", desc: "외부 자극에 뺨의 홍조(a* 수치) 리액션이 급증하는 타입", icon: "🌸" },
    normal: { title: "중성 물광형 (Normal/Glowing)", desc: "수지결 균형이 양호하여 촉촉한 보습 장벽을 갖춘 타입", icon: "✨" }
  };

  // 1. Core Profile Creation/Edit Handler
  const handleCreateOrUpdateProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim()) return;

    if (editingProfileId) {
      // Edit existing profile
      onUpdateProfiles(prev => prev.map(p => {
        if (p.id === editingProfileId) {
          return {
            ...p,
            name: formName.trim(),
            skinType: formSkinType,
            notes: formNotes || "추가 특이사항 없음",
            avatarColor: formAvatarColor
          };
        }
        return p;
      }));
      setEditingProfileId(null);
    } else {
      // Create new profile
      const newProfile: UserProfile = {
        id: `prof_${Date.now()}`,
        name: formName.trim(),
        skinType: formSkinType,
        notes: formNotes || "추가 특이사항 없음",
        avatarColor: formAvatarColor
      };

      onUpdateProfiles(prev => [...prev, newProfile]);
      setActiveProfileId(newProfile.id);
    }
    
    // Reset form
    setFormName("");
    setFormNotes("");
    setFormSkinType("normal");
    setFormAvatarColor("bg-[#007D85]");
    setShowAddForm(false);
  };

  const handleStartEdit = (profile: UserProfile, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingProfileId(profile.id);
    setFormName(profile.name);
    setFormSkinType(profile.skinType);
    setFormNotes(profile.notes);
    setFormAvatarColor(profile.avatarColor);
    setShowAddForm(true);
  };

  const handleCancelForm = () => {
    setEditingProfileId(null);
    setFormName("");
    setFormSkinType("normal");
    setFormNotes("");
    setFormAvatarColor("bg-[#007D85]");
    setShowAddForm(false);
  };

  // 2. Filter history based on user selection
  const filteredHistory = useMemo(() => {
    if (filterActiveUserOnly) {
      return history.filter(record => record.profileId === activeProfileId);
    }
    return history;
  }, [history, activeProfileId, filterActiveUserOnly]);

  const activeProfile = useMemo(() => {
    return profiles.find(p => p.id === activeProfileId) || profiles[0] || {
      id: "prof_na",
      name: "김나경 (나)",
      skinType: "sensitive",
      notes: "민감성 홍조 에코 스킨",
      avatarColor: "bg-[#007D85]"
    };
  }, [profiles, activeProfileId]);

  // 3. Calculate average scores over selected profile's history
  const activeUserStats = useMemo(() => {
    const records = history.filter(r => r.profileId === activeProfileId);
    if (records.length === 0) {
      // Default baseline standard if no user history runs yet
      let baseline = { moisture: 50, redness: 25, texture: 30, prep: 52 };
      if (activeProfile.skinType === 'dry') baseline = { moisture: 28, redness: 20, texture: 62, prep: 38 };
      else if (activeProfile.skinType === 'oily') baseline = { moisture: 54, redness: 35, texture: 68, prep: 46 };
      else if (activeProfile.skinType === 'sensitive') baseline = { moisture: 42, redness: 62, texture: 32, prep: 45 };
      else baseline = { moisture: 82, redness: 12, texture: 16, prep: 88 };
      return baseline;
    }

    const sum = records.reduce((acc, curr) => ({
      moisture: acc.moisture + curr.moistureScore,
      redness: acc.redness + curr.rednessScore,
      texture: acc.texture + curr.textureScore,
      prep: acc.prep + curr.prepScore
    }), { moisture: 0, redness: 0, texture: 0, prep: 0 });

    const total = records.length;
    return {
      moisture: Math.round(sum.moisture / total),
      redness: Math.round(sum.redness / total),
      texture: Math.round(sum.texture / total),
      prep: Math.round(sum.prep / total),
    };
  }, [history, activeProfileId, activeProfile.skinType]);

  // 4. Calculate user comparisons lists (multi-user graph representation)
  const profileComparisons = useMemo(() => {
    return profiles.map(prof => {
      const profRecords = history.filter(r => r.profileId === prof.id);
      
      if (profRecords.length === 0) {
        // Fallback default baselines depending on type to pre-fill comparative graph visually
        let baseline = { moisture: 50, redness: 25, texture: 30, prep: 52 };
        if (prof.skinType === 'dry') baseline = { moisture: 28, redness: 20, texture: 62, prep: 38 };
        else if (prof.skinType === 'oily') baseline = { moisture: 54, redness: 35, texture: 68, prep: 46 };
        else if (prof.skinType === 'sensitive') baseline = { moisture: 42, redness: 62, texture: 32, prep: 45 };
        else baseline = { moisture: 82, redness: 12, texture: 16, prep: 88 };
        return {
          ...prof,
          avgMoisture: baseline.moisture,
          avgRedness: baseline.redness,
          avgTexture: baseline.texture,
          avgPrep: baseline.prep,
          recordCount: 0,
          isEstimated: true
        };
      }

      const sum = profRecords.reduce((acc, curr) => ({
        moisture: acc.moisture + curr.moistureScore,
        redness: acc.redness + curr.rednessScore,
        texture: acc.texture + curr.textureScore,
        prep: acc.prep + curr.prepScore
      }), { moisture: 0, redness: 0, texture: 0, prep: 0 });

      return {
        ...prof,
        avgMoisture: Math.round(sum.moisture / profRecords.length),
        avgRedness: Math.round(sum.redness / profRecords.length),
        avgTexture: Math.round(sum.texture / profRecords.length),
        avgPrep: Math.round(sum.prep / profRecords.length),
        recordCount: profRecords.length,
        isEstimated: false
      };
    });
  }, [profiles, history]);

  // Adaptive advice based on selected active user profile
  const adaptiveGlowAdvice = useMemo(() => {
    if (activeUserStats.moisture > 75) {
      return {
        tag: "밀물 보습 최적 상태",
        color: "text-[#007D85] bg-[#E0EFF2]",
        rule: "수분 장벽이 완벽히 채워져 밀착 가이드 배율이 상승합니다. 라이트 인어 하이트라이팅 안개 구역 직경을 1.25배로 넓혀 윤택한 유리광을 확보합니다.",
        cosmeticId: "해양 무공해 하이드로 밤 + 수분 베일"
      };
    } else if (activeUserStats.moisture < 50) {
      return {
        tag: "속건조 & 썰물 보습 유의",
        color: "text-amber-700 bg-amber-50",
        rule: "피부 누적 수분 수렴치 저위 단계! 오일 코팅 대신 엠플 워터 미스트 레이어 횟수를 2회 증강 권장하며, 건조한 모서리에 수분 잠금 밤을 도포하세요.",
        cosmeticId: "심해 블루 카밍 미스트 + 리치 모이스처 에센스"
      };
    } else {
      return {
        tag: "표준 해풍 수분결 조화",
        color: "text-brand-primary bg-brand-primary/10",
        rule: "적당한 윤기 반사율이 계측됨에 따라 수딩 젤을 이마 전정 주위로 가볍고 얇게 도포하도록 표준 보습 파도 가이드가 투입됩니다.",
        cosmeticId: "기초 해수 젤 라이트 스파"
      };
    }
  }, [activeUserStats.moisture]);

  const adaptiveRednessAdvice = useMemo(() => {
    if (activeUserStats.redness > 40) {
      return {
        tag: "홍조 유의 / 민트 차폐 고정",
        color: "text-rose-700 bg-rose-50",
        rule: "뺨 요동 붉은기 지수(a* 수치) 누적 대조군이 높습니다! '2단계 민트 코렉터' 가이드 도포면적을 15% 넓히고, 블러셔 도포 시 볼의 정중앙부 채도를 강제로 제한합니다.",
        cosmeticId: "솔잎 민트 수렴 진정 시카 크림"
      };
    } else {
      return {
        tag: "맑은 톤 안정성 수렴",
        color: "text-emerald-700 bg-emerald-50",
        rule: "안정된 홍조 분포를 보입니다. 쿨/웜 정합 조건에 맞춰 립과 치크 경계면을 맑은 수채화 스머징 가이드로 대체 적용합니다.",
        cosmeticId: "내추럴 리퀴드 톤업 쿠션"
      };
    }
  }, [activeUserStats.redness]);

  const adaptiveTextureAdvice = useMemo(() => {
    if (activeUserStats.texture > 50) {
      return {
        tag: "모공 요철 복구 타겟팅",
        color: "text-indigo-700 bg-indigo-50",
        rule: "Sobel Filter 엣지 잔결 밀도가 중축성 노이즈로 인지되었습니다. 파운데이션 도포 시 모그 브러시의 탭핑 각도를 25도 수직 모션으로 튕기듯 수렴 처리합니다.",
        cosmeticId: "매트 포어 프라이밍 세범 가드"
      };
    } else {
      return {
        tag: "매끄러운 장벽 밀착 도화지",
        color: "text-emerald-700 bg-emerald-50",
        rule: "잔결 흔적이 매우 낮아 베이스 밀착력이 최고 등급입니다. 무거운 요철 가드 프라이머 없이도 색상이 맑게 투영되므로 가볍고 맑은 터치를 전정 노출시킵니다.",
        cosmeticId: "유리알 실크 브라이트 쉬머링 베이스"
      };
    }
  }, [activeUserStats.texture]);

  // Generate responsive SVG chart lines based on selected user history
  const svgLines = useMemo(() => {
    if (filteredHistory.length < 2) return { moisturePath: "", rednessPath: "", texturePath: "" };
    
    const width = 500;
    const height = 110;
    const padding = 20;
    
    const numPoints = filteredHistory.length;
    const xScale = (width - padding * 2) / (numPoints - 1);
    
    let mPath = "";
    let rPath = "";
    let tPath = "";
    
    // Reverse filtered array for drawing chronological order if history list is descending
    const drawSeries = [...filteredHistory].reverse();
    
    drawSeries.forEach((rec, idx) => {
      const x = padding + idx * xScale;
      
      const yMoisture = height - padding - (rec.moistureScore / 100) * (height - padding * 2);
      const yRedness = height - padding - (rec.rednessScore / 100) * (height - padding * 2);
      const yTexture = height - padding - (rec.textureScore / 100) * (height - padding * 2);
      
      if (idx === 0) {
        mPath = `M ${x} ${yMoisture}`;
        rPath = `M ${x} ${yRedness}`;
        tPath = `M ${x} ${yTexture}`;
      } else {
        mPath += ` L ${x} ${yMoisture}`;
        rPath += ` L ${x} ${yRedness}`;
        tPath += ` L ${x} ${yTexture}`;
      }
    });
    
    return { moisturePath: mPath, rednessPath: rPath, texturePath: tPath };
  }, [filteredHistory]);

  const handleDeleteProfile = (idToDelete: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (profiles.length <= 1) {
      alert("적어도 한 개의 사용자 기저 프로필은 유지되어야 합니다.");
      return;
    }
    // Delete profile and shift active profile if needed
    onUpdateProfiles(prev => prev.filter(p => p.id !== idToDelete));
    if (activeProfileId === idToDelete) {
      const remaining = profiles.filter(p => p.id !== idToDelete);
      setActiveProfileId(remaining[0].id);
    }
  };

  return (
    <div className="space-y-6" id="adaptive_learning_dashboard">
      
      {/* SECTION 1: USER CLASSIFICATION & PROFILE SWITCHER */}
      <div className="bg-white border border-[#E0EDEE] rounded-3xl p-5 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          <div className="space-y-1">
            <h4 className="text-sm font-bold text-brand-dark flex items-center gap-2">
              <Users className="w-4 h-4 text-brand-primary" />
              사용자 분류 및 분석 프로필 관리자
            </h4>
            <p className="text-[11px] text-brand-dark/60 leading-relaxed">
              가상 촬영 진단 결과를 각 사용자별 보관함에 분리 축적합니다. 사용자를 바꾸면 트랙 그래프와 가이드 원공 보정 수식도 교대 동조 처리됩니다.
            </p>
          </div>

          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="flex items-center gap-1 bg-[#F0F7F8] hover:bg-brand-primary hover:text-white border border-brand-primary/10 hover:border-transparent text-brand-primary px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer"
          >
            {showAddForm ? <X className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
            멤버 추가
          </button>
        </div>

        {/* Form to create new user profile */}
        <AnimatePresence>
          {showAddForm && (
            <motion.form
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              onSubmit={handleCreateOrUpdateProfile}
              className="p-4 bg-slate-50/70 border border-slate-100 rounded-2xl space-y-3.5 overflow-hidden"
            >
              <div className="text-xs font-bold text-brand-primary flex items-center gap-1.5 pb-1 border-b border-slate-200/50">
                <Sliders className="w-3.5 h-3.5" />
                {editingProfileId ? "멤버 프로필 정보 수정" : "새로운 멤버 대조군 프로필 추가"}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-12 gap-3.5 pt-1">
                {/* Member Name */}
                <div className="md:col-span-4 space-y-1">
                  <label className="text-[10px] font-bold text-slate-500 uppercase">이름 / 호칭</label>
                  <input
                    type="text"
                    required
                    placeholder="예: 지수 (친구), 엄마"
                    value={formName}
                    onChange={e => setFormName(e.target.value)}
                    className="w-full bg-white border border-slate-200 focus:border-brand-primary rounded-xl p-2 text-xs font-semibold focus:outline-hidden transition-all"
                  />
                </div>

                {/* Skin classification */}
                <div className="md:col-span-4 space-y-1">
                  <label className="text-[10px] font-bold text-slate-500 uppercase">피부고민 분류군</label>
                  <select
                    value={formSkinType}
                    onChange={e => setFormSkinType(e.target.value as any)}
                    className="w-full bg-white border border-slate-200 focus:border-brand-primary rounded-xl p-2 text-xs font-semibold focus:outline-hidden cursor-pointer"
                  >
                    <option value="dry">💦 수분부족형·각질들뜸 속건조</option>
                    <option value="oily">🌿 유분과다·요철모공 지목</option>
                    <option value="sensitive">🌸 자극유도·뺨 민감성 홍조</option>
                    <option value="normal">✨ 유수결수치 안정 중성물광</option>
                  </select>
                </div>

                {/* Avatar Color Picker */}
                <div className="md:col-span-4 space-y-1">
                  <label className="text-[10px] font-bold text-slate-500 uppercase">식별 표식 지정</label>
                  <div className="flex gap-2 items-center pt-1.5">
                    {availableColors.map(color => (
                      <button
                        key={color.class}
                        type="button"
                        onClick={() => setFormAvatarColor(color.class)}
                        className={`w-6 h-6 rounded-full ${color.class} border-2 transition-all ${
                          formAvatarColor === color.class ? "scale-110 border-slate-700 shadow-md" : "border-transparent"
                        }`}
                        title={color.label}
                      />
                    ))}
                  </div>
                </div>
              </div>

              {/* Description / Notes */}
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-500 uppercase">피부 프로필 상세 비고</label>
                <input
                  type="text"
                  placeholder="예: 생얼에 붉은 흉터 흔적이 많고, 겨울철 눈 전정부 각질 일어남 심함"
                  value={formNotes}
                  onChange={e => setFormNotes(e.target.value)}
                  className="w-full bg-white border border-slate-200 focus:border-brand-primary rounded-xl p-2 text-xs focus:outline-hidden transition-all"
                />
              </div>

              <div className="flex justify-end gap-2 pt-1">
                <button
                  type="button"
                  onClick={handleCancelForm}
                  className="px-3.5 py-1.5 rounded-xl text-xs bg-slate-200/60 text-slate-600 hover:bg-slate-200 font-bold cursor-pointer"
                >
                  취소
                </button>
                <button
                  type="submit"
                  className="px-3.5 py-1.5 rounded-xl text-xs bg-brand-primary text-white hover:bg-brand-primary/95 font-bold cursor-pointer"
                >
                  {editingProfileId ? "수정 완료" : "프로필 등록 및 전환"}
                </button>
              </div>
            </motion.form>
          )}
        </AnimatePresence>

        {/* List of user cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {profiles.map(profile => {
            const isSelected = profile.id === activeProfileId;
            const isEditing = profile.id === editingProfileId;
            const typeDetail = skinTypeLabels[profile.skinType];
            const recordsCount = history.filter(r => r.profileId === profile.id).length;

            return (
              <div
                key={profile.id}
                onClick={() => setActiveProfileId(profile.id)}
                className={`relative p-4 rounded-2xl border transition-all duration-200 cursor-pointer flex flex-col justify-between select-none group ${
                  isEditing
                    ? "bg-amber-50/50 border-amber-400 ring-2 ring-amber-400/20 shadow-xs"
                    : isSelected 
                      ? "bg-[#EBF7F8]/80 border-brand-primary/80 shadow-xs" 
                      : "bg-slate-50/40 hover:bg-slate-50/90 border-slate-100/80 hover:border-brand-primary/20"
                }`}
              >
                {/* Action buttons on Hover */}
                <div className="absolute top-3 right-3 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  <button
                    onClick={(e) => handleStartEdit(profile, e)}
                    className="p-1 px-1.5 rounded-md text-slate-500 hover:text-brand-primary hover:bg-white border border-slate-150 hover:border-transparent transition-all text-[9.5px] font-bold flex items-center gap-0.5 bg-white/90 shadow-xs"
                    title="프로필(이름/비고) 수정"
                  >
                    <Pencil className="w-2.5 h-2.5" />
                    수정
                  </button>
                  {profiles.length > 1 && (
                    <button
                      onClick={(e) => handleDeleteProfile(profile.id, e)}
                      className="p-1 rounded-md text-slate-400 hover:text-rose-500 hover:bg-rose-50 hover:border-rose-100 border border-transparent transition-all bg-white/95"
                      title="프로필 삭제"
                    >
                      <X className="w-2.5 h-2.5" />
                    </button>
                  )}
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2.5">
                    {/* Visual Avatar circle */}
                    <div className={`w-8 h-8 rounded-full ${profile.avatarColor} text-white flex items-center justify-center font-extrabold text-xs shadow-xs uppercase`}>
                      {profile.name.slice(0, 1)}
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="font-extrabold text-xs text-slate-800 line-clamp-1 max-w-[100px]">{profile.name}</span>
                        {isEditing ? (
                          <span className="text-[7.5px] bg-amber-500 text-white font-mono px-1 py-0.2 rounded-sm font-bold uppercase tracking-wider scale-95 animate-pulse">
                            Editing
                          </span>
                        ) : isSelected && (
                          <span className="text-[8px] bg-brand-primary text-white font-mono px-1 py-0.2 rounded-sm font-bold uppercase tracking-wider scale-95">
                            Active
                          </span>
                        )}
                      </div>
                      <p className="text-[8.5px] font-mono text-slate-400">진단건수 {recordsCount}회 누적</p>
                    </div>
                  </div>

                  <div className="p-2 bg-white/70 border border-slate-100 rounded-xl space-y-1 min-h-[46px] flex flex-col justify-center">
                    <p className="text-[10px] font-bold text-slate-705 flex items-center gap-1 leading-none">
                      <span className="text-xs">{typeDetail.icon}</span> {typeDetail.title.split(' ')[0]}
                    </p>
                    <p className="text-[9.5px] text-slate-500 leading-snug font-sans line-clamp-1">{profile.notes}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* SVG Dynamic Trend Chart (FILTERED BY USER) */}
        <div className="lg:col-span-7 bg-[#F4F8F9] border border-[#DEEAEA] p-5 rounded-3xl flex flex-col justify-between space-y-4 shadow-xs">
          <div className="flex justify-between items-center flex-wrap gap-2">
            <div className="space-y-0.5">
              <h5 className="text-[11px] font-mono font-bold tracking-widest text-brand-dark/70 flex items-center gap-1.5">
                <TrendingUp className="w-3.5 h-3.5 text-[#007D85]" /> SENSOMETRIC TREND CURVE
              </h5>
              <p className="text-[9px] text-[#007D85] font-extrabold font-sans">
                현재 진단 추적 필터: <span className="bg-brand-primary/10 px-1 py-0.5 rounded text-[10px]">{activeProfile.name} 님의 기록</span>
              </p>
            </div>

            {/* Local View Filters */}
            <div className="flex items-center gap-2">
              <button 
                onClick={() => setFilterActiveUserOnly(true)}
                className={`text-[9px] font-sans font-bold px-2 py-0.5 rounded-md border ${
                  filterActiveUserOnly 
                    ? "bg-brand-primary text-white border-brand-primary" 
                    : "bg-white text-slate-500 border-slate-200"
                }`}
              >
                본인 이력만
              </button>
              <button 
                onClick={() => setFilterActiveUserOnly(false)}
                className={`text-[9px] font-sans font-bold px-2 py-0.5 rounded-md border ${
                  !filterActiveUserOnly 
                    ? "bg-brand-primary text-white border-brand-primary" 
                    : "bg-white text-slate-500 border-slate-200"
                }`}
              >
                전체 통합
              </button>
              
              <div className="flex items-center gap-2 text-[9px] font-mono pl-1 border-l border-slate-350/50">
                <span className="flex items-center gap-0.5"><span className="w-2 h-1 bg-[#00CED1] block rounded-xs" /> 수분</span>
                <span className="flex items-center gap-0.5"><span className="w-2 h-1 bg-red-400 block rounded-xs" /> 홍조</span>
                <span className="flex items-center gap-0.5"><span className="w-2 h-1 bg-amber-500 block rounded-xs" /> 요철</span>
              </div>
            </div>
          </div>

          {/* SVG Vector Drawing of real trend points */}
          <div className="relative w-full h-[120px] bg-white border border-[#E0EDEE] rounded-2xl p-2 shadow-inner flex items-center justify-center overflow-hidden">
            {filteredHistory.length >= 2 ? (
              <svg viewBox="0 0 500 110" className="w-full h-full" preserveAspectRatio="none">
                {/* Grid lines inside chart */}
                <line x1="0" y1="20" x2="500" y2="20" stroke="rgba(0,0,0,0.03)" strokeWidth="1" />
                <line x1="0" y1="55" x2="500" y2="55" stroke="rgba(0,0,0,0.03)" strokeWidth="1" />
                <line x1="0" y1="90" x2="500" y2="90" stroke="rgba(0,0,0,0.03)" strokeWidth="1" />
                
                {/* Trend paths */}
                <path d={svgLines.moisturePath} fill="none" stroke="#00CED1" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                <path d={svgLines.rednessPath} fill="none" stroke="#F87171" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                <path d={svgLines.texturePath} fill="none" stroke="#F59E0B" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                
                {/* Dots on paths */}
                {(() => {
                  const drawSeries = [...filteredHistory].reverse();
                  return drawSeries.map((rec, i) => {
                    const width = 500;
                    const height = 110;
                    const padding = 20;
                    const xScale = (width - padding * 2) / (drawSeries.length - 1);
                    const x = padding + i * xScale;
                    
                    return (
                      <g key={rec.id + i}>
                        <circle cx={x} cy={height - padding - (rec.moistureScore / 100) * (height - padding * 2)} r="4.5" fill="#00CED1" stroke="#FFFFFF" strokeWidth="1.5" />
                        <circle cx={x} cy={height - padding - (rec.rednessScore / 100) * (height - padding * 2)} r="4.5" fill="#F87171" stroke="#FFFFFF" strokeWidth="1.5" />
                        <circle cx={x} cy={height - padding - (rec.textureScore / 100) * (height - padding * 2)} r="4.5" fill="#F59E0B" stroke="#FFFFFF" strokeWidth="1.5" />
                      </g>
                    );
                  });
                })()}
              </svg>
            ) : (
              <div className="text-center p-3 text-xs text-brand-dark/50 space-y-1">
                <LineChart className="w-5 h-5 mx-auto text-[#007D85]/40 animate-pulse" />
                <p className="font-semibold text-slate-705">이 프로필 ({activeProfile.name}) 아래 축적 기록이 2개 이상 필요합니다.</p>
                <p className="text-[10px] text-slate-400">오른쪽 테스터 프리셋을 부하하여 샘플 쌩얼 샷을 빠른 등록해 보세요.</p>
                <p className="text-[9.5px] text-brand-dark/30 font-mono">현재 보유 기록: {filteredHistory.length}회</p>
              </div>
            )}
          </div>

          <div className="flex gap-2 text-[10px] sm:text-[11px] items-start text-brand-dark/75 bg-white border border-[#E0EDEE] rounded-xl p-3 leading-relaxed">
            <Info className="w-4 h-4 text-[#007D85] flex-shrink-0 mt-0.5" />
            <div>
              <p>
                <strong>{activeProfile.name} 님의 장벽 지능 평균치:</strong> 누적 평균{" "}
                <span className="font-bold text-[#009199]">수분 {activeUserStats.moisture}%</span>,{" "}
                <span className="font-bold text-rose-500">홍조 {activeUserStats.redness}%</span>,{" "}
                <span className="font-bold text-amber-500">요철 {activeUserStats.texture}%</span> 상태로 수치 교정 가이드 및 매치 기초 화공 화장품이 연동 중입니다.
              </p>
            </div>
          </div>
        </div>

        {/* Dynamic Integration Control center */}
        <div className="lg:col-span-5 bg-[#F9FAFB] border border-brand-border p-5 rounded-3xl flex flex-col justify-between space-y-4">
          <div>
            <span className="text-[10px] font-mono tracking-widest text-[#00818A] uppercase font-bold block">
              ADAPTATION CONTROLLER
            </span>
            <label className="text-xs text-brand-dark/85 font-extrabold block mt-1">
              {activeProfile.name} 님 전용 쌩얼 업로드 단말:
            </label>
            <p className="text-[9.5px] text-brand-dark/50 leading-relaxed mt-0.5">
              실제 웹캠 스캔 대신 아래 정형 프리셋 훈련 도포층을 선택하여 현재 활성화된 {activeProfile.name} 님의 피부 연대 기록 상단에 삽입 분석할 수 있습니다.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-1.8">
            <button
              onClick={() => onAddMockUpload('glowing')}
              className="flex justify-between items-center p-2 rounded-xl bg-white hover:bg-[#F3F6F7] text-[#007D85] border border-slate-150 text-[11px] text-left cursor-pointer transition-all hover:translate-x-0.5"
            >
              <div>
                <p className="font-bold">🌊 보습 충만 물새 광채 필터 등록</p>
                <p className="text-[8.5px] text-brand-dark/50 font-mono mt-0.5">수분 89% • 홍조 12% • 요철 결 15%</p>
              </div>
              <ChevronRight className="w-3.5 h-3.5 text-brand-dark/30" />
            </button>

            <button
              onClick={() => onAddMockUpload('reddish')}
              className="flex justify-between items-center p-2 rounded-xl bg-white hover:bg-[#F3F6F7] text-rose-600 border border-slate-150 text-[11px] text-left cursor-pointer transition-all hover:translate-x-0.5"
            >
              <div>
                <p className="font-bold">☀️ 과성 반응 작열 불뺨 홍조 등록</p>
                <p className="text-[8.5px] text-brand-dark/50 font-mono mt-0.5">수분 45% • 홍조 68% • 요철 결 42%</p>
              </div>
              <ChevronRight className="w-3.5 h-3.5 text-brand-dark/30" />
            </button>

            <button
              onClick={() => onAddMockUpload('flaky')}
              className="flex justify-between items-center p-2 rounded-xl bg-white hover:bg-[#F3F6F7] text-amber-600 border border-slate-150 text-[11px] text-left cursor-pointer transition-all hover:translate-x-0.5"
            >
              <div>
                <p className="font-bold">🍂 거친 풍해 사막 요철 들뜸 등록</p>
                <p className="text-[8.5px] text-brand-dark/50 font-mono mt-0.5">수분 22% • 홍조 36% • 요철 결 72%</p>
              </div>
              <ChevronRight className="w-3.5 h-3.5 text-brand-dark/30" />
            </button>
          </div>

          <div className="bg-brand-primary/5 p-2.5 rounded-xl border border-brand-primary/10 text-[9.5px] text-brand-primary leading-tight font-mono text-center font-bold">
            💡 프리셋 투하 시 "{activeProfile.name}" 아래 실시간 연대 곡선 점이 하나 더 추가 확장됩니다.
          </div>
        </div>

      </div>

      {/* SECTION 2: SIDE-BY-SIDE GRAPH COMPARISON OF MEMBERS (사용자별 비교 분석 그래프) */}
      <div className="bg-white border border-[#E0EDEE] rounded-[24px] p-5 shadow-sm space-y-4">
        <div className="flex justify-between items-center">
          <div className="space-y-0.5">
            <h5 className="text-[11.5px] font-mono tracking-widest text-[#00818A] uppercase font-bold flex items-center gap-1.5">
              <Dribbble className="w-3.5 h-3.5 text-brand-secondary" /> MEMBER BIOMETRIC COMPARISON BAR
            </h5>
            <p className="text-xs text-slate-800 font-extrabold font-sans">등록 회원 간 누적 피부 지표 다각 비교 그래프</p>
          </div>
          <span className="text-[10px] text-slate-400 font-mono bg-slate-50 border border-slate-150 px-2 py-0.5 rounded-full select-none">
            이력 평균 연산값 투영
          </span>
        </div>

        {/* Multiseries comparisons container */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* A. Moisture Comparative chart */}
          <div className="bg-slate-50/50 border border-slate-100 p-4 rounded-xl space-y-3 shadow-xs">
            <div className="flex justify-between items-center">
              <span className="text-[11px] font-bold text-slate-505 flex items-center gap-1">
                💦 누적 평균 수분 장벽도 (Moisture)
              </span>
              <span className="text-[9px] font-mono text-brand-primary bg-[#E0EFF2] font-semibold px-1 rounded">높음이 권장</span>
            </div>
            <div className="space-y-2.5">
              {profileComparisons.map(p => (
                <div key={p.id} className="space-y-1">
                  <div className="flex justify-between text-[10px] font-sans">
                    <span className="text-slate-800 font-extrabold flex items-center gap-1">
                      <span className={`w-1.5 h-1.5 rounded-full ${p.avatarColor}`} />
                      {p.name}
                    </span>
                    <span className="font-mono text-[#00CED1] font-bold">{p.avgMoisture}%</span>
                  </div>
                  <div className="w-full h-2.5 bg-slate-200/60 rounded-full overflow-hidden border border-slate-100">
                    <div 
                      style={{ width: `${p.avgMoisture}%` }} 
                      className="h-full bg-gradient-to-r from-[#00A1A8] to-[#00CED1] rounded-full transition-all duration-300"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* B. Redness Comparative chart */}
          <div className="bg-slate-50/50 border border-slate-100 p-4 rounded-xl space-y-3 shadow-xs">
            <div className="flex justify-between items-center">
              <span className="text-[11px] font-bold text-slate-505 flex items-center gap-1">
                🌸 누적 평균 홍조 침착률 (Redness)
              </span>
              <span className="text-[9px] font-mono text-rose-500 bg-rose-50 font-semibold px-1 rounded">낮음이 원활</span>
            </div>
            <div className="space-y-2.5">
              {profileComparisons.map(p => (
                <div key={p.id} className="space-y-1">
                  <div className="flex justify-between text-[10px] font-sans">
                    <span className="text-slate-800 font-extrabold flex items-center gap-1">
                      <span className={`w-1.5 h-1.5 rounded-full ${p.avatarColor}`} />
                      {p.name}
                    </span>
                    <span className="font-mono text-rose-500 font-bold">{p.avgRedness}%</span>
                  </div>
                  <div className="w-full h-2.5 bg-slate-200/60 rounded-full overflow-hidden border border-slate-100">
                    <div 
                      style={{ width: `${p.avgRedness}%` }} 
                      className="h-full bg-gradient-to-r from-red-400 to-rose-450 rounded-full transition-all duration-300"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* C. Texture Sobel Flakes Comparative chart */}
          <div className="bg-slate-50/50 border border-slate-100 p-4 rounded-xl space-y-3 shadow-xs">
            <div className="flex justify-between items-center">
              <span className="text-[11px] font-bold text-slate-505 flex items-center gap-1">
                🌿 누적 평균 각질 결 요철도 (Texture)
              </span>
              <span className="text-[9px] font-mono text-amber-600 bg-amber-50 font-semibold px-1 rounded">낮음이 원활</span>
            </div>
            <div className="space-y-2.5">
              {profileComparisons.map(p => (
                <div key={p.id} className="space-y-1">
                  <div className="flex justify-between text-[10px] font-sans">
                    <span className="text-slate-800 font-extrabold flex items-center gap-1">
                      <span className={`w-1.5 h-1.5 rounded-full ${p.avatarColor}`} />
                      {p.name}
                    </span>
                    <span className="font-mono text-amber-500 font-bold">{p.avgTexture}%</span>
                  </div>
                  <div className="w-full h-2.5 bg-slate-200/60 rounded-full overflow-hidden border border-slate-100">
                    <div 
                      style={{ width: `${p.avgTexture}%` }} 
                      className="h-full bg-gradient-to-r from-amber-400 to-amber-500 rounded-full transition-all duration-300"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* REAL-TIME GLOBAL USER DATA SAT-STREAM CONSOLE (실시간 글로벌 유저 진단 데이터 스트림) */}
      <div className="bg-[#FAFBFB] rounded-[28px] p-5.5 border border-brand-border/75 space-y-5 shadow-[0_12px_36px_rgba(0,109,117,0.02)] text-brand-dark">
        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 border-b border-brand-border/40 pb-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-20"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <h5 className="text-[11px] font-mono tracking-widest text-[#006E74] font-bold uppercase flex items-center gap-1.5">
                <Globe className="w-3.5 h-3.5 text-[#006E74]" /> Marine Biometric Global Live-Pulse Map (실시간 유저 스트림)
              </h5>
            </div>
            <p className="text-[11px] text-brand-dark/60 leading-relaxed">
              전 세계 에코-테스터 및 기기 사용자들의 피부 상태 진단 이력이 실시간으로 동기화되어 집계됩니다.
            </p>
          </div>

          {/* Core Network Counter Badges */}
          <div className="flex flex-wrap gap-2 text-xs">
            <div className="bg-white border border-brand-border/60 px-3 py-1.5 rounded-xl flex items-center gap-2 shadow-xs">
              <Users className="w-3.5 h-3.5 text-brand-primary" />
              <div>
                <span className="text-[8px] text-brand-dark/45 font-mono block leading-none uppercase tracking-wider">동시 스캔 유저</span>
                <span className="font-mono font-bold text-brand-dark text-xs">{simulatedOnlineUsers}명</span>
              </div>
            </div>
            
            <div className="bg-white border border-brand-border/60 px-3 py-1.5 rounded-xl flex items-center gap-2 shadow-xs">
              <Activity className="w-3.5 h-3.5 text-brand-secondary" />
              <div>
                <span className="text-[8px] text-brand-dark/45 font-mono block leading-none uppercase tracking-wider">누적 스캔 수</span>
                <span className="font-mono font-bold text-brand-dark text-xs">{totalScansCount.toLocaleString()}건</span>
              </div>
            </div>

            <div className="bg-white border border-brand-border/60 px-2.5 py-1.5 rounded-xl flex items-center shadow-xs">
              <button
                type="button"
                onClick={handleTriggerSimulatedScan}
                className="bg-brand-primary hover:bg-brand-primary/95 text-white text-[9.5px] font-bold py-1 px-2.5 rounded-lg transition-all flex items-center gap-1 cursor-pointer"
                title="새로운 가상 유저 스캔 신호를 강제로 즉시 인젝션합니다"
              >
                <Plus className="w-3 h-3" /> 인젝터 스캔
              </button>
            </div>
          </div>
        </div>

        {/* Streaming Speed Control & Toggle Panel */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white p-3 rounded-2xl border border-brand-border/40 shadow-xs">
          <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
            <Radio className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" />
            <span className="text-xs font-semibold text-brand-dark/85 whitespace-nowrap">네트워크 동기화 주기:</span>
            <div className="flex items-center gap-1 bg-brand-light p-1 rounded-xl border border-brand-border/20">
              <button
                type="button"
                onClick={() => setStreamSpeed(4000)}
                className={`px-2 py-0.5 rounded-md text-[9px] font-bold font-mono transition-colors cursor-pointer ${streamSpeed === 4000 ? "bg-white text-brand-primary shadow-xs" : "text-brand-dark/50 hover:text-brand-dark"}`}
              >
                Fast (4s)
              </button>
              <button
                type="button"
                onClick={() => setStreamSpeed(7000)}
                className={`px-2 py-0.5 rounded-md text-[9px] font-bold font-mono transition-colors cursor-pointer ${streamSpeed === 7000 ? "bg-white text-brand-primary shadow-xs" : "text-brand-dark/50 hover:text-brand-dark"}`}
              >
                Normal (7s)
              </button>
              <button
                type="button"
                onClick={() => setStreamSpeed(12000)}
                className={`px-2 py-0.5 rounded-md text-[9px] font-bold font-mono transition-colors cursor-pointer ${streamSpeed === 12000 ? "bg-white text-brand-primary shadow-xs" : "text-brand-dark/50 hover:text-brand-dark"}`}
              >
                Slow (12s)
              </button>
            </div>
          </div>

          <div className="flex items-center gap-2 justify-between">
            <span className="text-[10px] text-brand-dark/50">동기화 상태:</span>
            <button
              type="button"
              onClick={() => setLiveStreamingActive(prev => !prev)}
              className={`px-3 py-1 rounded-xl text-[10.5px] font-bold flex items-center gap-1 cursor-pointer transition-all ${
                liveStreamingActive ? "bg-brand-primary/10 text-brand-primary border border-brand-primary/20" : "bg-neutral-100 text-neutral-500 border border-neutral-200"
              }`}
            >
              {liveStreamingActive ? (
                <>
                  <Wifi className="w-3 h-3 text-[rgb(0,109,117)] animate-pulse" /> Live Streaming
                </>
              ) : (
                <>
                  <Pause className="w-3 h-3" /> Paused
                </>
              )}
            </button>
          </div>
        </div>

        {/* Real-time Streaming Ticker list */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[280px] overflow-y-auto pr-1">
          <AnimatePresence>
            {globalLiveEvents.map((event) => {
              const isNewest = event.id === newlyArrivedId;
              const isSensitive = event.skinType === 'sensitive';
              const isDry = event.skinType === 'dry';
              const isOily = event.skinType === 'oily';

              return (
                <motion.div
                  key={event.id}
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className={`p-3.5 rounded-2xl border transition-all flex flex-col justify-between gap-3 relative ${
                    isNewest
                      ? "bg-[#F0F8F9] border-brand-primary shadow-sm"
                      : "bg-white border-brand-border/60 hover:border-brand-primary/30"
                  }`}
                >
                  {isNewest && (
                    <span className="absolute top-2.5 right-2.5 text-[8px] bg-brand-primary text-white font-bold font-sans px-2 py-0.5 rounded-full uppercase">
                      New Event
                    </span>
                  )}

                  <div className="space-y-1.5">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <div className="bg-brand-light border border-brand-border/30 rounded-lg px-2 py-0.5 flex items-center gap-1">
                        <MapPin className="w-2.5 h-2.5 text-brand-primary" />
                        <span className="text-[9.5px] font-mono font-semibold text-brand-dark/70">{event.location}</span>
                      </div>
                      <span className="text-xs font-semibold text-brand-dark">{event.name} 님 스캔</span>
                      <span className="text-[9px] font-mono text-brand-dark/40 ml-auto">{event.analyzedAt}</span>
                    </div>

                    <div className="p-2.5 bg-brand-light/50 rounded-xl border border-brand-border/20 flex items-center justify-between">
                      <div className="flex items-center gap-1 text-[11px]">
                        <span className="text-brand-dark font-semibold">{
                          isSensitive ? "🌸 민감홍조" : isDry ? "💦 속건조형" : isOily ? "🌿 지성모공" : "✨ 중성물광"
                        }</span>
                        <span className="text-brand-dark/50 font-sans text-[10px]">({event.personalColor})</span>
                      </div>
                      <div className="text-[10.5px] font-mono font-extrabold text-brand-primary flex items-center gap-1">
                        <span>수분 {event.moistureScore}%</span>
                        <span className="text-brand-border">•</span>
                        <span className="text-rose-600">홍조 {event.rednessScore}%</span>
                      </div>
                    </div>
                  </div>

                  {/* Recommendation telemetry with Load option */}
                  <div className="flex items-center justify-between pt-2 border-t border-brand-border/40 gap-2">
                    <div className="text-[10px] text-brand-dark/60 line-clamp-1 max-w-[200px]">
                      🐚 처방: <span className="font-semibold text-brand-dark">{event.cosmeticAdvice}</span>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleLoadGlobalUserSessionToLocal(event)}
                      className="bg-brand-primary/5 hover:bg-brand-primary hover:text-white text-brand-primary text-[10px] font-bold py-1 px-3 rounded-lg flex items-center gap-1 transition-all flex-shrink-0 cursor-pointer border border-brand-primary/10 hover:border-transparent gap-1"
                      title="이 유저의 피부 지표를 내 활성 캘리브레이터 시뮬레이션 환경으로 바로 대입 동조합니다"
                    >
                      <Eye className="w-3 h-3" /> 수치 모방
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>

        {/* Global Live Stream Average Metric Chart */}
        <div className="p-3 bg-white rounded-2xl border border-brand-border/50 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs shadow-xs">
          <div className="flex items-center gap-2">
            <Radio className="w-3.5 h-3.5 text-emerald-500 animate-pulse flex-shrink-0" />
            <p className="text-[10.5px] text-brand-dark/60 leading-relaxed">
              <strong className="text-brand-dark">원격 에코 테스터 동향:</strong> 유저들의 평균 수분 복원 전정 매칭률은{" "}
              <span className="text-brand-primary font-bold">78.4% 임계선</span>에서 안정적으로 유지 중입니다.
            </p>
          </div>
          <div className="text-[9.5px] font-mono bg-brand-light px-3 py-1 rounded-lg text-brand-primary flex items-center gap-1 border border-brand-border/30">
            <span>스냅백 릴레이 상태:</span>
            <span className="bg-emerald-500/10 text-emerald-600 px-1 rounded uppercase font-bold tracking-widest text-[8px]">LIVE_ACTIVE</span>
          </div>
        </div>
      </div>

      {/* SECTION 3: THEORETICAL GUIDE (사용자를 어떻게 분류하는 것이 유용할까요? 에 대한 구체적 교육 보드) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        
        {/* Academic User Segment Board */}
        <div className="bg-white border border-[#E0EDEE] rounded-[24px] p-5 shadow-sm space-y-3 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-brand-primary/5 rounded-full translate-x-10 -translate-y-10" />
          <h5 className="text-[12px] font-mono tracking-widest text-brand-secondary font-bold flex items-center gap-1.5">
            <HelpCircle className="w-4 h-4 text-brand-secondary" /> ACADEMIC SEGMENTATION GUIDE
          </h5>
          <h6 className="text-xs font-black text-slate-800">피부 생얼 분석을 위한 가장 과학적인 사용자 분류론이란?</h6>
          
          <div className="space-y-2.5 text-[11px] leading-relaxed text-slate-650">
            <p>
              피드백 알고리즘 설계 시 유용한 사용자 분류는 단순히 주관적인 나이 관점을 벗어나, <strong>"피부 수지 결(장벽) 생체 신호"</strong>를 기준으로 하는것이 추천됩니다. 
            </p>
            <div className="space-y-1.5">
              <div className="p-2 border-l-2 border-brand-primary bg-[#F0F7F8]/45">
                <p className="font-bold text-slate-800">1. 속건조/피부장벽 붕괴 대조군 (건조성)</p>
                <p className="text-slate-500">수분도가 낮은 임계수치를 보이며 각질 대비 요철 고주파 신호가 높습니다. 지질 보호막 보강 기초가 선순위 피드백입니다.</p>
              </div>
              <div className="p-2 border-l-2 border-indigo-400 bg-indigo-50/20">
                <p className="font-bold text-[#4F46E5]">2. 피지 번들거림/모공 과다 대조군 (지성)</p>
                <p className="text-slate-500">요철 엣지 검출도가 지속 높으며 수분 반사 볼륨 대조가 특정 구역에 집중됩니다. 피지 결 정리를 위한 매트 밤 피드백이 전정 할당됩니다.</p>
              </div>
              <div className="p-2 border-l-2 border-rose-400 bg-[#FFF5F5]">
                <p className="font-bold text-rose-700">3. 온도/접촉 유도 혈행 대조군 (민감성 홍조)</p>
                <p className="text-slate-500">a* 활성화 톤이 강해 뺨 전정에 붉은색 수렴 포인트가 밀집됩니다. 보색 중화 민트 톤업 및 온도 수렴 쿨링 팁을 우선 제공합니다.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Adaptive Rules Results Dashboard */}
        <div className="space-y-3">
          <h5 className="text-[11.2px] font-mono tracking-wider text-brand-dark/55 uppercase font-bold flex items-center gap-1.5">
            <Sliders className="w-3.5 h-3.5 text-brand-primary" /> 🎯 현재 활성화: {activeProfile.name} 님을 위한 맞춤 밀착 수렴 처방전
          </h5>

          <div className="grid grid-cols-1 gap-2.5">
            
            {/* Rule 1: Moisture */}
            <div className="bg-white border border-[#E0EDEE] rounded-2xl p-4 space-y-1.5 hover:shadow-md transition-all relative">
              <div className="flex justify-between items-center sm:gap-2">
                <span className={`text-[9px] font-bold px-2 py-0.5 rounded-md ${adaptiveGlowAdvice.color} tracking-widest uppercase font-mono`}>
                  {adaptiveGlowAdvice.tag}
                </span>
                <span className="text-[10px] text-brand-primary font-bold">{adaptiveGlowAdvice.cosmeticId}</span>
              </div>
              <p className="text-[11px] text-brand-dark/85 leading-normal font-sans">
                {adaptiveGlowAdvice.rule}
              </p>
            </div>

            {/* Rule 2: Redness */}
            <div className="bg-white border border-[#E0EDEE] rounded-2xl p-4 space-y-1.5 hover:shadow-md transition-all relative">
              <div className="flex justify-between items-center sm:gap-2">
                <span className={`text-[9px] font-bold px-2 py-0.5 rounded-md ${adaptiveRednessAdvice.color} tracking-widest uppercase font-mono`}>
                  {adaptiveRednessAdvice.tag}
                </span>
                <span className="text-[10px] text-brand-primary font-bold">{adaptiveRednessAdvice.cosmeticId}</span>
              </div>
              <p className="text-[11px] text-brand-dark/85 leading-normal font-sans">
                {adaptiveRednessAdvice.rule}
              </p>
            </div>

          </div>
        </div>

      </div>

      {/* History Photo list with real snapshots */}
      <div className="space-y-3">
        <h5 className="text-[11px] font-mono tracking-wider text-brand-dark/55 uppercase font-bold flex items-center justify-between">
          <span className="flex items-center gap-1">
            <History className="w-3.5 h-3.5 text-brand-primary" /> 피부 진단 로그 데이터베이스 (Photo & Score Run Logs)
          </span>
          <span className="text-[10px] text-slate-400">
            총 {history.length}건 중 {filteredHistory.length}건 노출
          </span>
        </h5>

        <div className="bg-white border border-brand-border rounded-[24px] overflow-hidden">
          {filteredHistory.length > 0 ? (
            <div className="divide-y divide-brand-border max-h-[300px] overflow-y-auto">
              {filteredHistory.map((record, index) => {
                const recordProfile = profiles.find(p => p.id === record.profileId) || {
                  name: "미분류 사용자",
                  avatarColor: "bg-slate-400"
                };

                return (
                  <div 
                    key={record.id}
                    className="p-3 px-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:bg-[#F9FAFB] transition-colors"
                  >
                    
                    {/* Diagnostic snapshot and descriptive label */}
                    <div className="flex items-center gap-3.5">
                      {record.imageThumbnail ? (
                        <div className="w-12 h-12 rounded-xl overflow-hidden border border-brand-border shadow bg-slate-100 flex-shrink-0">
                          <img 
                            src={record.imageThumbnail} 
                            alt="Scan run" 
                            className="w-full h-full object-cover"
                            referrerPolicy="no-referrer"
                          />
                        </div>
                      ) : (
                        <div className="w-12 h-12 rounded-xl border-2 border-dashed border-brand-border flex items-center justify-center bg-slate-50 flex-shrink-0">
                          <Camera className="w-5 h-5 text-brand-dark/30" />
                        </div>
                      )}
                      
                      <div className="space-y-1">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="text-xs font-bold text-brand-dark">
                            #{filteredHistory.length - index} run: {record.sourceName}
                          </span>
                          <span className={`${recordProfile.avatarColor} text-white font-sans text-[8.5px] font-black px-1.5 rounded uppercase leading-none py-0.5 flex items-center`}>
                            {recordProfile.name}
                          </span>
                          <span className="text-[9px] font-mono font-bold bg-[#E0EFF2] text-[#007D85] px-1.5 py-0.5 rounded uppercase">
                            {record.personalColor}
                          </span>
                        </div>
                        <p className="text-[10px] text-brand-dark/45 font-mono">
                          진단 시점: {record.analyzedAt || "방금 전"}
                        </p>
                      </div>
                    </div>

                    {/* Technical values and restore option */}
                    <div className="flex items-center gap-6 self-stretch sm:self-auto justify-between flex-wrap sm:flex-nowrap border-t sm:border-0 pt-2 sm:pt-0 border-brand-border/30">
                      
                      <div className="flex items-center gap-3 sm:gap-4.5 text-[11px] font-mono">
                        <div className="text-center">
                          <p className="text-brand-dark/45 font-bold uppercase text-[9px]">수분</p>
                          <p className="font-bold text-[#00CED1]">{record.moistureScore}%</p>
                        </div>
                        <div className="text-center">
                          <p className="text-brand-dark/45 font-bold uppercase text-[9px]">홍조</p>
                          <p className="font-bold text-rose-500">{record.rednessScore}%</p>
                        </div>
                        <div className="text-center">
                          <p className="text-brand-dark/45 font-bold uppercase text-[9px]">요철</p>
                          <p className="font-bold text-amber-500">{record.textureScore}%</p>
                        </div>
                        <div className="text-center bg-brand-primary/5 px-2.5 py-1 rounded-xl border border-brand-primary/10">
                          <p className="text-brand-primary font-black uppercase text-[8px]">프렙 점수</p>
                          <p className="font-bold text-brand-dark">{record.prepScore}점</p>
                        </div>
                      </div>

                      <button
                        onClick={() => onRestoreFromHistory(record)}
                        className="flex items-center gap-1.5 bg-brand-primary/5 hover:bg-brand-primary hover:text-white border border-brand-primary/20 hover:border-transparent px-3.5 py-1.5 rounded-xl text-[10.5px] text-brand-primary font-bold cursor-pointer transition-all uppercase"
                        title="이 슬라이스 스킨 기준으로 활성 시뮬레이터 수치 강제 연동하기"
                      >
                        수치 대입
                      </button>

                    </div>

                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center p-8 text-xs text-brand-dark/40 space-y-1.5">
              <History className="w-8 h-8 mx-auto text-brand-dark/30 animate-pulse" />
              <p className="font-bold text-brand-dark/60">해당 프로필 ({activeProfile.name}) 아래 진단 연대기가 비어 있습니다.</p>
              <p>왼쪽의 바다 에코 스케너로 수분/홍조 결측을 진단(피부 스캔 시작)하여 이력을 채워 보세요!</p>
            </div>
          )}
        </div>
      </div>

    </div>
  );
}
