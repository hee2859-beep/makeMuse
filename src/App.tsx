/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { SkinData, MakeupEvaluation, Tutorial, UserProfile } from "./types";
import { initialTutorials, resolveTutorialUnlockStates } from "./lib/progress";
import BareFaceAnalyzer from "./components/BareFaceAnalyzer";
import PersonalColorMirror from "./components/PersonalColorMirror";
import FinalPearlFeedback from "./components/FinalPearlFeedback";
import TutorialMap from "./components/TutorialMap";
import AdaptiveCalibrator, { SkinHistoryRecord } from "./components/AdaptiveCalibrator";
import { 
  Droplets, 
  Sparkles, 
  BookOpen, 
  UserCheck, 
  Flame, 
  Medal, 
  Compass, 
  HelpCircle,
  Cloud,
  CloudLightning,
  RefreshCw,
  LogOut,
  User,
  CheckCircle2
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

// Firebase imports
import { 
  db, 
  auth, 
  handleFirestoreError, 
  OperationType 
} from "./lib/firebase";
import { 
  collection, 
  doc, 
  setDoc, 
  deleteDoc, 
  onSnapshot, 
  query, 
  where, 
  getDocs 
} from "firebase/firestore";
import { 
  signInWithPopup, 
  GoogleAuthProvider, 
  signOut, 
  onAuthStateChanged, 
  User as FirebaseUser 
} from "firebase/auth";

export default function App() {
  // Global States
  const [activeTab, setActiveTab] = useState<'prep' | 'color' | 'pearl'>('prep');
  const [activePreset, setActivePreset] = useState<'neutral-sand' | 'warm-coral' | 'deep-abyss'>('neutral-sand');
  
  // Firebase Auth & Cloud Sync States
  const [currentUser, setCurrentUser] = useState<FirebaseUser | null>(null);
  const [authLoading, setAuthLoading] = useState<boolean>(true);
  const [isCloudSyncing, setIsCloudSyncing] = useState<boolean>(false);

  // Google 로그인 핸들러
  const handleGoogleLogin = async () => {
    const provider = new GoogleAuthProvider();
    setAuthLoading(true);
    try {
      await signInWithPopup(auth, provider);
    } catch (e) {
      console.error(e);
    } finally {
      setAuthLoading(false);
    }
  };

  // Google 로그아웃 핸들러
  const handleGoogleLogout = async () => {
    setAuthLoading(true);
    try {
      await signOut(auth);
      // 로컬 클리어 및 기본 슬레이트 복원
      localStorage.removeItem("seafit_user_profiles_v2");
      localStorage.removeItem("seafit_skin_history_v2");
      setProfiles([
        { id: "prof_na", name: "김나경 (나)", skinType: "sensitive", notes: "민감성 홍조 에코 스킨, T존 약한 요철", avatarColor: "bg-[#007D85]" },
        { id: "prof_minji", name: "박민지 (동생)", skinType: "dry", notes: "속당김 극심, 각질 들뜸 현상형", avatarColor: "bg-amber-500" },
        { id: "prof_suhyun", name: "이수현 (친구)", skinType: "normal", notes: "수분 지수 준수한 쿨톤 수채화 피부", avatarColor: "bg-[#10B981]" }
      ]);
      setSkinHistory([
        {
          id: "hist_sample_01",
          textureScore: 35,
          rednessScore: 28,
          moistureScore: 68,
          skinTone: "자연스러운 해풍빛 내추럴 샌드",
          personalColor: "Spring Warm Light",
          analyzedAt: new Date(Date.now() - 24 * 3600 * 1000).toLocaleString('ko-KR'),
          imageThumbnail: "",
          sourceName: "시스템 기초 이력 진단",
          prepScore: 68,
          profileId: "prof_na"
        },
        {
          id: "hist_sample_02",
          textureScore: 18,
          rednessScore: 15,
          moistureScore: 84,
          skinTone: "은은한 진주빛 모닝 베이지",
          personalColor: "Summer Cool Light",
          analyzedAt: new Date(Date.now() - 48 * 3600 * 1000).toLocaleString('ko-KR'),
          imageThumbnail: "",
          sourceName: "시스템 최적 광채 스캔",
          prepScore: 85,
          profileId: "prof_minji"
        }
      ]);
    } catch (e) {
      console.error(e);
    } finally {
      setAuthLoading(false);
    }
  };

  // Multi-user profile state loaded from local storage
  const [profiles, setProfiles] = useState<UserProfile[]>(() => {
    try {
      const saved = localStorage.getItem("seafit_user_profiles_v2");
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error(e);
    }
    return [
      { id: "prof_na", name: "김나경 (나)", skinType: "sensitive", notes: "민감성 홍조 에코 스킨, T존 약한 요철", avatarColor: "bg-[#007D85]" },
      { id: "prof_minji", name: "박민지 (동생)", skinType: "dry", notes: "속당김 극심, 각질 들뜸 현상형", avatarColor: "bg-amber-500" },
      { id: "prof_suhyun", name: "이수현 (친구)", skinType: "normal", notes: "수분 지수 준수한 쿨톤 수채화 피부", avatarColor: "bg-[#10B981]" }
    ];
  });

  const [activeProfileId, setActiveProfileId] = useState<string>(() => {
    return localStorage.getItem("seafit_active_profile_id_v2") || "prof_na";
  });

  const activeProfile = profiles.find(p => p.id === activeProfileId) || profiles[0];

  const [skinData, setSkinData] = useState<SkinData>({
    textureScore: 35,
    rednessScore: 28,
    moistureScore: 68,
    skinTone: "자연스러운 해풍빛 내추럴 샌드",
    personalColor: "Spring Warm Light",
    analyzedAt: null,
    profileId: "prof_na"
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
  
  // Interceptors to sync updates directly to Google Cloud Firestore when signed in
  const handleUpdateProfiles = async (updater: React.SetStateAction<UserProfile[]>) => {
    setProfiles((prev) => {
      const next = typeof updater === "function" ? updater(prev) : updater;
      if (currentUser) {
        // Find added profiles
        const added = next.filter(p => !prev.some(old => old.id === p.id));
        added.forEach(async (p) => {
          try {
            await setDoc(doc(db, "profiles", p.id), {
              id: p.id,
              userId: currentUser.uid,
              name: p.name,
              skinType: p.skinType,
              notes: p.notes,
              avatarColor: p.avatarColor
            });
          } catch (e) {
            handleFirestoreError(e, OperationType.WRITE, `profiles/${p.id}`);
          }
        });

        // Find modified profiles
        const modified = next.filter(p => {
          const old = prev.find(o => o.id === p.id);
          return old && (old.name !== p.name || old.skinType !== p.skinType || old.notes !== p.notes || old.avatarColor !== p.avatarColor);
        });
        modified.forEach(async (p) => {
          try {
            await setDoc(doc(db, "profiles", p.id), {
              id: p.id,
              userId: currentUser.uid,
              name: p.name,
              skinType: p.skinType,
              notes: p.notes,
              avatarColor: p.avatarColor
            });
          } catch (e) {
            handleFirestoreError(e, OperationType.WRITE, `profiles/${p.id}`);
          }
        });

        // Find deleted profiles
        const deleted = prev.filter(p => !next.some(n => n.id === p.id));
        deleted.forEach(async (p) => {
          try {
            await deleteDoc(doc(db, "profiles", p.id));
          } catch (e) {
            handleFirestoreError(e, OperationType.DELETE, `profiles/${p.id}`);
          }
        });
      }
      return next;
    });
  };
  
  // AR guiding overlay toggle
  const [drawArActive, setDrawArActive] = useState<boolean>(false);

  // Dynamic makeup parameters passed back from Step 3 sliders to show on the simulator canvas
  const [makeupParams, setMakeupParams] = useState({
    eyelinerGap: 3,
    lipOverstep: 8,
    splotchiness: 12
  });

  // Persistent User upload skin chronic history log stored locally
  const [skinHistory, setSkinHistory] = useState<SkinHistoryRecord[]>(() => {
    try {
      const saved = localStorage.getItem("seafit_skin_history_v2");
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error(e);
    }
    return [
      {
        id: "hist_sample_01",
        textureScore: 35,
        rednessScore: 28,
        moistureScore: 68,
        skinTone: "자연스러운 해풍빛 내추럴 샌드",
        personalColor: "Spring Warm Light",
        analyzedAt: new Date(Date.now() - 24 * 3600 * 1000).toLocaleString('ko-KR'),
        imageThumbnail: "",
        sourceName: "시스템 기초 이력 진단",
        prepScore: 68,
        profileId: "prof_na"
      },
      {
        id: "hist_sample_02",
        textureScore: 18,
        rednessScore: 15,
        moistureScore: 84,
        skinTone: "은은한 진주빛 모닝 베이지",
        personalColor: "Summer Cool Light",
        analyzedAt: new Date(Date.now() - 48 * 3600 * 1000).toLocaleString('ko-KR'),
        imageThumbnail: "",
        sourceName: "시스템 최적 광채 스캔",
        prepScore: 85,
        profileId: "prof_minji"
      }
    ];
  });

  // Update persistent storage
  useEffect(() => {
    try {
      localStorage.setItem("seafit_skin_history_v2", JSON.stringify(skinHistory));
    } catch (e) {
      console.error(e);
    }
  }, [skinHistory]);

  useEffect(() => {
    try {
      localStorage.setItem("seafit_user_profiles_v2", JSON.stringify(profiles));
    } catch (e) {
      console.error(e);
    }
  }, [profiles]);

  useEffect(() => {
    localStorage.setItem("seafit_active_profile_id_v2", activeProfileId);
  }, [activeProfileId]);

  // Skin History Interceptor
  const handleUpdateSkinHistory = async (updater: React.SetStateAction<SkinHistoryRecord[]>) => {
    setSkinHistory((prev) => {
      const next = typeof updater === "function" ? updater(prev) : updater;
      if (currentUser) {
        // Find added records
        const added = next.filter(h => !prev.some(old => old.id === h.id));
        added.forEach(async (h) => {
          try {
            await setDoc(doc(db, "history", h.id), {
              id: h.id,
              userId: currentUser.uid,
              profileId: h.profileId || "prof_na",
              textureScore: Math.round(h.textureScore),
              rednessScore: Math.round(h.rednessScore),
              moistureScore: Math.round(h.moistureScore),
              skinTone: h.skinTone || "",
              personalColor: h.personalColor || "",
              prepScore: Math.round(h.prepScore),
              analyzedAt: h.analyzedAt || new Date().toLocaleString("ko-KR"),
              imageThumbnail: h.imageThumbnail || "",
              sourceName: h.sourceName || "인젝션"
            });
          } catch (e) {
            handleFirestoreError(e, OperationType.WRITE, `history/${h.id}`);
          }
        });

        // Find deleted records
        const deleted = prev.filter(h => !next.some(n => n.id === h.id));
        deleted.forEach(async (h) => {
          try {
            await deleteDoc(doc(db, "history", h.id));
          } catch (e) {
            handleFirestoreError(e, OperationType.DELETE, `history/${h.id}`);
          }
        });
      }
      return next;
    });
  };

  // Auth observer
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setAuthLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // Connection validation checker and Firestore real-time snapshots
  useEffect(() => {
    if (!currentUser) return;

    setIsCloudSyncing(true);

    const qProfiles = query(collection(db, "profiles"), where("userId", "==", currentUser.uid));
    const unsubscribeProfiles = onSnapshot(qProfiles, (snapshot) => {
      const fetched: UserProfile[] = [];
      snapshot.forEach(docSnap => {
        const d = docSnap.data();
        fetched.push({
          id: d.id,
          name: d.name,
          skinType: d.skinType,
          notes: d.notes,
          avatarColor: d.avatarColor
        });
      });

      if (fetched.length > 0) {
        setProfiles(fetched);
      } else {
        // Bootstrap initial fallback profiles on cloud
        profiles.forEach(async (p) => {
          try {
            await setDoc(doc(db, "profiles", p.id), {
              id: p.id,
              userId: currentUser.uid,
              name: p.name,
              skinType: p.skinType,
              notes: p.notes,
              avatarColor: p.avatarColor
            });
          } catch (e) {
            handleFirestoreError(e, OperationType.WRITE, `profiles/${p.id}`);
          }
        });
      }
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, "profiles");
    });

    const qHistory = query(collection(db, "history"), where("userId", "==", currentUser.uid));
    const unsubscribeHistory = onSnapshot(qHistory, (snapshot) => {
      const fetched: SkinHistoryRecord[] = [];
      snapshot.forEach(docSnap => {
        const d = docSnap.data();
        fetched.push({
          id: d.id,
          profileId: d.profileId,
          textureScore: d.textureScore,
          rednessScore: d.rednessScore,
          moistureScore: d.moistureScore,
          skinTone: d.skinTone,
          personalColor: d.personalColor,
          prepScore: d.prepScore,
          analyzedAt: d.analyzedAt,
          imageThumbnail: d.imageThumbnail,
          sourceName: d.sourceName
        });
      });

      if (fetched.length > 0) {
        setSkinHistory(fetched.sort((a,b) => b.id.localeCompare(a.id)));
      } else if (skinHistory.length > 0) {
        skinHistory.forEach(async (h) => {
          try {
            await setDoc(doc(db, "history", h.id), {
              id: h.id,
              userId: currentUser.uid,
              profileId: h.profileId || "prof_na",
              textureScore: Math.round(h.textureScore),
              rednessScore: Math.round(h.rednessScore),
              moistureScore: Math.round(h.moistureScore),
              skinTone: h.skinTone || "",
              personalColor: h.personalColor || "",
              prepScore: Math.round(h.prepScore),
              analyzedAt: h.analyzedAt,
              imageThumbnail: h.imageThumbnail || "",
              sourceName: h.sourceName || ""
            });
          } catch (e) {
            handleFirestoreError(e, OperationType.WRITE, `history/${h.id}`);
          }
        });
      }
      setIsCloudSyncing(false);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, "history");
      setIsCloudSyncing(false);
    });

    return () => {
      unsubscribeProfiles();
      unsubscribeHistory();
    };
  }, [currentUser]);

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

  const handleAnalysisComplete = (
    newSkin: SkinData, 
    calculatedPrepScore: number, 
    thumbnail?: string, 
    sourceName?: string
  ) => {
    const skinWithProfile = {
      ...newSkin,
      profileId: activeProfileId
    };
    setSkinData(skinWithProfile);
    setPrepScore(calculatedPrepScore);
    
    // Log persistent calibration snapshot
    const newRecord: SkinHistoryRecord = {
      ...skinWithProfile,
      id: `hist_${Date.now()}`,
      imageThumbnail: thumbnail || "",
      sourceName: sourceName || "얼굴 스킨 스캔",
      prepScore: calculatedPrepScore,
      analyzedAt: new Date().toLocaleString('ko-KR')
    };

    handleUpdateSkinHistory(prev => [newRecord, ...prev]);
    
    // Auto-advance to Personal Color guide to represent completed stage 1
    setTimeout(() => {
      setActiveTab('color');
    }, 2500); // Slight delay allowing user to admire historic record logged
  };

  const handleClearHistory = () => {
    handleUpdateSkinHistory([]);
  };

  const handleRestoreFromHistory = (record: SkinHistoryRecord) => {
    setSkinData({
      textureScore: record.textureScore,
      rednessScore: record.rednessScore,
      moistureScore: record.moistureScore,
      skinTone: record.skinTone,
      personalColor: record.personalColor,
      analyzedAt: record.analyzedAt,
      profileId: record.profileId
    });
    setPrepScore(record.prepScore);
    if (record.profileId) {
      setActiveProfileId(record.profileId);
    }
  };

  const handleAddMockUpload = (presetType: 'glowing' | 'reddish' | 'flaky') => {
    let mockSkin: SkinData;
    let mockName = "";
    let mockScore = 0;

    if (presetType === 'glowing') {
      mockSkin = {
        textureScore: 15,
        rednessScore: 12,
        moistureScore: 89,
        skinTone: "생기있고 투명한 진주빛 베이지",
        personalColor: "Summer Cool Light",
        analyzedAt: new Date().toLocaleString('ko-KR'),
        profileId: activeProfileId
      };
      mockName = "오아시스 극광 광채 샷 (glowing_skin.jpg)";
      mockScore = 88;
    } else if (presetType === 'reddish') {
      mockSkin = {
        textureScore: 42,
        rednessScore: 68,
        moistureScore: 45,
        skinTone: "열감 가득 붉은빛 수렴 핑크",
        personalColor: "Autumn Warm Warm",
        analyzedAt: new Date().toLocaleString('ko-KR'),
        profileId: activeProfileId
      };
      mockName = "작열 불뺨 홍조 극복 샷 (flushed_face.jpg)";
      mockScore = 46;
    } else {
      mockSkin = {
        textureScore: 72,
        rednessScore: 36,
        moistureScore: 22,
        skinTone: "거칠고 건조한 모래밭 샌디 베이지",
        personalColor: "Winter Cool Deep",
        analyzedAt: new Date().toLocaleString('ko-KR'),
        profileId: activeProfileId
      };
      mockName = "거친 사막 요철 들뜸 샷 (desert_dry.jpg)";
      mockScore = 31;
    }

    const newRecord: SkinHistoryRecord = {
      ...mockSkin,
      id: `hist_${Date.now()}`,
      imageThumbnail: "", // Empty thumbnail renders as camera icon
      sourceName: mockName,
      prepScore: mockScore
    };

    handleUpdateSkinHistory(prev => [newRecord, ...prev]);
    setSkinData(mockSkin);
    setPrepScore(mockScore);
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
      <header className="border-b border-brand-border/60 bg-white/85 backdrop-blur-md px-6 sm:px-8 py-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 sticky top-0 z-30 shadow-[0_2px_15px_-3px_rgba(0,109,117,0.02)]">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-brand-primary" />
            <span className="font-mono text-[9px] tracking-widest text-brand-primary uppercase font-extrabold text-xs">SEA-FIT SYSTEM</span>
          </div>
          <h1 className="text-md sm:text-lg font-sans font-bold tracking-tight text-brand-dark uppercase">
            Sea-fit AI <span className="font-light text-brand-primary/60">v2.1</span>
          </h1>
        </div>

        {/* Firebase Cloud Sync Control Container */}
        <div className="flex items-center gap-3 bg-brand-light/40 border border-brand-border/40 p-2 px-3 rounded-2xl">
          {currentUser ? (
            <div className="flex items-center gap-2 text-xs">
              <div className="relative">
                <div className="w-8 h-8 rounded-full bg-brand-primary/10 flex items-center justify-center text-brand-primary font-bold border border-brand-primary/20 overflow-hidden">
                  {currentUser.photoURL ? (
                    <img src={currentUser.photoURL} alt={currentUser.displayName || "User"} className="w-8 h-8 rounded-full" referrerPolicy="no-referrer" />
                  ) : (
                    <User className="w-4 h-4 text-brand-primary" />
                  )}
                </div>
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-white animate-pulse" />
              </div>
              <div className="hidden sm:block text-left mr-1">
                <p className="font-semibold text-brand-dark text-[11px] leading-tight flex items-center gap-1">
                  {currentUser.displayName || "멤버"}
                  <CheckCircle2 className="w-3 h-3 text-brand-primary" />
                </p>
                <p className="text-[9px] font-mono text-brand-dark/50 leading-none">크라우드 동기화 완료</p>
              </div>
              <button
                type="button"
                onClick={handleGoogleLogout}
                disabled={authLoading}
                className="p-1.5 px-2.5 text-[10px] h-7 bg-white hover:bg-gray-100 rounded-lg text-brand-dark border border-brand-border/60 transition-colors font-medium flex items-center gap-1 cursor-pointer disabled:opacity-50"
              >
                <LogOut className="w-3 h-3 text-red-500" />
                <span>로그아웃</span>
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-3 text-xs">
              <div className="w-8 h-8 rounded-full bg-[#EBF5F6] flex items-center justify-center border border-[#D5E6E8]">
                <Cloud className="w-4 h-4 text-brand-primary/70 animate-pulse" />
              </div>
              <div className="hidden sm:block text-left">
                <p className="font-semibold text-brand-dark text-[11px] leading-tight">게스트 모드 (로컬 저장)</p>
                <p className="text-[9px] font-mono text-brand-dark/50 leading-none">로그인 시 실시간 클라우드 백업</p>
              </div>
              <button
                type="button"
                onClick={handleGoogleLogin}
                disabled={authLoading}
                className="p-1 px-3 text-[10px] h-7 bg-brand-primary hover:bg-brand-primary/90 active:scale-95 text-white rounded-lg transition-all font-semibold flex items-center gap-1.5 shadow-[0_2px_4px_rgba(0,125,133,0.15)] cursor-pointer disabled:opacity-50"
              >
                {authLoading ? (
                  <RefreshCw className="w-3 h-3 animate-spin" />
                ) : (
                  <CloudLightning className="w-3 h-3" />
                )}
                <span>구글 로그인 연동</span>
              </button>
            </div>
          )}
        </div>

        {/* Quest Achievement Status Indicators */}
        <div className="w-full md:w-auto flex flex-col sm:flex-row items-stretch sm:items-center gap-4 sm:gap-6 pt-3 md:pt-0 border-t md:border-t-0 border-brand-border/40">
          <div className="flex items-center gap-3 bg-white/90 border border-brand-border/60 px-4 py-2 rounded-2xl shadow-[0_4px_12px_-2px_rgba(0,0,0,0.02)]">
            <Medal className="w-4 h-4 text-brand-primary flex-shrink-0" />
            <div className="space-y-1 w-[120px] sm:w-[150px]">
              <div className="flex justify-between text-[10px] font-mono text-brand-dark/60">
                <span>코스 해금 진도</span>
                <span className="font-bold text-brand-primary">{unlockedCount}/10</span>
              </div>
              <div className="w-full h-1 bg-brand-light rounded-full overflow-hidden">
                <div style={{ width: `${questProgressPct}%` }} className="h-full bg-brand-primary transition-all duration-500" />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 text-center text-xs">
            <div className="p-2 px-3 bg-white hover:bg-[#F9FAFB] transition-colors rounded-2xl border border-brand-border/60 shadow-[0_4px_12px_-2px_rgba(0,0,0,0.02)]">
              <p className="text-[9px] font-mono text-brand-dark/50 uppercase tracking-wider font-semibold">스킨 프렙</p>
              <p className="font-mono font-extrabold text-brand-primary mt-0.5 text-xs">{prepScore}점</p>
            </div>
            <div className="p-2 px-3 bg-white hover:bg-[#F9FAFB] transition-colors rounded-2xl border border-brand-border/60 shadow-[0_4px_12px_-2px_rgba(0,0,0,0.02)]">
              <p className="text-[9px] font-mono text-brand-dark/50 uppercase tracking-wider font-semibold">동조 메이킹</p>
              <p className="font-mono font-extrabold text-brand-primary mt-0.5 text-xs">{makeupScore}점</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-grow max-w-[1400px] w-full mx-auto px-4 sm:px-6 py-6 space-y-7">
        
        {/* Top Floating Help ribbon */}
        <div className="bg-white border border-brand-border/70 p-3.5 px-5 rounded-3xl flex items-center justify-between text-xs text-brand-dark/80 shadow-[0_4px_20px_-4px_rgba(0,109,117,0.03)] relative overflow-hidden">
          <div className="absolute top-0 left-0 w-1 h-full bg-brand-primary animate-pulse" />
          <div className="flex items-center gap-2">
            <span className="flex-shrink-0 w-1.5 h-1.5 rounded-full bg-brand-secondary" />
            <p className="leading-relaxed">
              <strong>[밀물 소식]</strong> {prepScore >= 75 ? "최상의 스킨 보습 상태입니다! 8단계 이상의 마스터 메이크업 코스가 모두 해금되었습니다." : "이마/볼 마커를 드래그해 진단 밀도를 조정하고, 분석 버튼을 눌러 다음 학습 단계를 여세요."}
            </p>
          </div>
          <span className="hidden md:inline-flex text-[9px] font-mono bg-brand-primary/5 text-brand-primary border border-brand-primary/10 px-2 py-0.5 rounded-full font-bold">
            Ready to style
          </span>
        </div>

        {/* Central Bento Grid Workspace */}
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
          
          {/* Permanent Interactive Scan Viewport Column */}
          <div className="xl:col-span-5 bg-white rounded-[28px] p-5 border border-brand-border/60 sticky top-28 self-start z-10 shadow-[0_12px_40px_-10px_rgba(0,0,0,0.03)] transition-all">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xs font-mono text-brand-primary tracking-wider flex items-center gap-1.5 uppercase font-extrabold">
                <span className="w-1.5 h-1.5 rounded-full bg-brand-primary" />
                Active Marine Scanner
              </h3>
              <div className="flex items-center gap-1 text-[10px] text-brand-dark/50 font-mono">
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
            <div className="grid grid-cols-3 gap-1 bg-[#F1F5F6]/90 p-1 rounded-2xl border border-brand-border/40 shadow-xs" id="workspace_tabs">
              {[
                { id: 'prep', label: '1단계: 쌩얼 진단', icon: Droplets, color: 'text-brand-primary' },
                { id: 'color', label: '2단계: 퍼스널 컬러', icon: Sparkles, color: 'text-[#00B4D8]' },
                { id: 'pearl', label: '3단계: 대칭 피드백', icon: UserCheck, color: 'text-brand-primary' }
              ].map(tab => {
                const isSelected = activeTab === tab.id;
                const Icon = tab.icon;

                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`flex items-center justify-center gap-2 py-3 rounded-xl text-xs font-semibold tracking-tight cursor-pointer transition-all duration-200 ${
                      isSelected 
                        ? "bg-white text-brand-primary font-bold shadow-[0_4px_12px_rgba(0,109,117,0.06)] border border-[#E5EFA5]/0" 
                        : "text-brand-dark/50 hover:text-brand-dark hover:bg-white/45"
                    }`}
                  >
                    <Icon className={`w-3.5 h-3.5 ${isSelected ? 'text-brand-primary' : tab.color}`} />
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
                    <div className="space-y-6">
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

                      {/* Cumulative photo logging calibration dashboard */}
                      <AdaptiveCalibrator
                        history={skinHistory}
                        onClearHistory={handleClearHistory}
                        onAddMockUpload={handleAddMockUpload}
                        onRestoreFromHistory={handleRestoreFromHistory}
                        profiles={profiles}
                        activeProfileId={activeProfileId}
                        setActiveProfileId={setActiveProfileId}
                        onUpdateProfiles={handleUpdateProfiles}
                      />
                    </div>
                  )}

                  {activeTab === 'color' && (
                    <div className="bg-white rounded-[28px] border border-brand-border/60 p-2 shadow-[0_8px_30px_rgba(0,0,0,0.02)]">
                      <PersonalColorMirror 
                        skinData={skinData} 
                        activeTutorial={activeTutorial}
                        drawArActive={drawArActive}
                        onDrawArOverlay={setDrawArActive}
                      />
                    </div>
                  )}

                  {activeTab === 'pearl' && (
                    <div className="bg-white rounded-[28px] border border-brand-border/60 p-2 shadow-[0_8px_30px_rgba(0,0,0,0.02)]">
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
        <section className="bg-white p-7 rounded-[28px] border border-brand-border/60 shadow-[0_8px_30px_rgba(0,0,0,0.02)]" id="the_sea_map">
          <TutorialMap 
            tutorials={tutorials}
            activeTutorial={activeTutorial}
            onSelectTutorial={handleTutorialSelect}
            skinPrepScore={prepScore}
          />
        </section>

      </main>

      {/* Aesthetic Ocean Minimalist Footer */}
      <footer className="border-t border-brand-border/60 bg-white px-8 py-5 text-center text-xs text-brand-dark/55 font-mono mt-auto flex flex-col sm:flex-row justify-between items-center gap-3">
        <p>© 2026 Sea-fit Beautylabs Engine. All sensor arrays calibrated D65.</p>
        <p className="flex items-center gap-1.5 font-sans font-medium text-brand-dark/50 text-[11px]">
          <span className="w-1.5 h-1.5 rounded-full bg-brand-primary" /> Calibrated Geometric Interface.
        </p>
      </footer>

    </div>
  );
}
