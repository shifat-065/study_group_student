import { useState, useEffect, useRef } from "react";
import { imgCalendarMonth, imgEmojiEvents, imgEmojiEvents1 } from "@/imports/MobileStudyGroupStudentGroupRank/svg-5p890";
import svgRankPaths from "@/imports/MobileStudyGroupStudentGroupRank/svg-npjyrr8ymv";
import { motion, AnimatePresence } from "motion/react";
import {
  ArrowLeft, ChevronDown, Check, Info, AlertCircle,
  UserPlus, Search, ArrowUpDown, ChevronRight,
  ThumbsUp, MessageCircle, Share2, Send, Globe, MoreHorizontal, ImageIcon, Star, User, Users,
  CalendarDays, Archive, ClipboardCheck, Trophy, FileText, Copy, Pencil, X, Gift, Headphones, Sprout,
  Filter, Calendar, Clock, Award, PlaySquare, FileSpreadsheet, BarChart3,
  type LucideIcon,
} from "lucide-react";
import { clsx } from "clsx";

// ── Asset imports ─────────────────────────────────────────────────────────────
import imgGroupIcon from "@/imports/MobileStudyGroupStudentJoinGroup/6f2aba55d4a40244fc9e8910ff07f4bd4f53f07a.png";
import imgMemberIcon from "@/imports/MobileStudyGroupStudentOnBording/6f2aba55d4a40244fc9e8910ff07f4bd4f53f07a.png";
import svgMember from "@/imports/MobileStudyGroupStudentOnBording/svg-ttz5k4n74x";
import svgBottomSheetPaths from "@/imports/BottomSheet-1/svg-pqml7a0tpc";
import { imgNotifications as imgBottomSheetMask } from "@/imports/BottomSheet-1/svg-osveg";
import svgLeavePaths from "@/imports/BasicDialog-2/svg-ou8qv0fxt4";
import { imgExitToApp } from "@/imports/BasicDialog-2/svg-ihnay";
import svgActivityPaths from "@/imports/MobileStudyGroupStudentActivityLog/svg-f4p4t0ff9m";
import { imgCampaign } from "@/imports/MobileStudyGroupStudentActivityLog/svg-gq3ig";
import { imgSwapVert as imgMemberMask } from "@/imports/MobileStudyGroupStudentGroupMembers/svg-k6urm";
import subgroupSvgPaths from "@/imports/MobileStudyGroupStudentSubgroupList/svg-s537fgytb1";
import subgroupDetailSvgPaths from "@/imports/MobileStudyGroupStudentSubgroup/svg-346517hzha";
import goalSvgPaths from "@/imports/MobileStudyGroupStudentSubgroupTodysGoal-1/svg-21ts69s773";

// ── Types ─────────────────────────────────────────────────────────────────────

type Screen = "groupList" | "joinGroup" | "confirmJoinRequest" | "joinGroupPending" | "home" | "groupRules" | "activity" | "rank" | "members" | "subgroups" | "subgroupDetail" | "todayGoal" | "monthlyGoal" | "examAttendanceMembers" | "monthlyGoalExamDetail" | "discussion" | "facebookGroup" | "examPage" | "quickLinkPage";

interface Group {
  id: number;
  name: string;
  category: string;
  rank: number;
  members: number;
  maxMembers: number;
  admin: string;
  adminRating: number;
  discount: number;
  subgroups: number;
  createdDate: string;
  totalExams: number;
  avgAttendance: number;
  monthlyGoal: number;
}

// Shared red/yellow/green scale for every percentage-based indicator in the app
// (<40 red, 40-74 yellow, ≥75 green) — bar charts and pill-shaped chips alike, so
// the same percentage always reads as the same color no matter where it shows up.
const GOAL_BAR_COLOR = { green: "bg-[#6fcf73]", yellow: "bg-[#ffc94a]", red: "bg-[#eb5757]" } as const;
function goalBarColor(pct: number) {
  return pct >= 75 ? GOAL_BAR_COLOR.green : pct >= 40 ? GOAL_BAR_COLOR.yellow : GOAL_BAR_COLOR.red;
}

const PCT_CHIP_BG = { green: "#6fcf73", yellow: "#ffc94a", red: "#eb5757" } as const;
const PCT_CHIP_TEXT = "#1a1a1a";
function pctChipStyle(pct: number): { bg: string; text: string } {
  const bg = pct >= 75 ? PCT_CHIP_BG.green : pct >= 40 ? PCT_CHIP_BG.yellow : PCT_CHIP_BG.red;
  return { bg, text: PCT_CHIP_TEXT };
}

// ── Data ──────────────────────────────────────────────────────────────────────

const GROUPS: Group[] = [
  { id: 1, name: "The Winner", category: "BCS", rank: 1, members: 64, maxMembers: 100, admin: "Subroto Howlader", adminRating: 4.5, discount: 30, subgroups: 8, createdDate: "1 Feb 2026", totalExams: 155, avgAttendance: 75.5, monthlyGoal: 1221 },
  { id: 2, name: "Optics", category: "Bank", rank: 2, members: 220, maxMembers: 300, admin: "ডেভিড বেকহাম", adminRating: 4.2, discount: 80, subgroups: 13, createdDate: "15 Mar 2026", totalExams: 203, avgAttendance: 68.2, monthlyGoal: 980 },
  { id: 3, name: "Jupiter", category: "DP", rank: 3, members: 103, maxMembers: 150, admin: "Md Mehedi Hasan", adminRating: 4.8, discount: 60, subgroups: 6, createdDate: "10 Jan 2026", totalExams: 89, avgAttendance: 71.0, monthlyGoal: 650 },
  { id: 4, name: "Quantum", category: "NTRCA", rank: 4, members: 73, maxMembers: 100, admin: "Mohammad Amin", adminRating: 4.0, discount: 90, subgroups: 5, createdDate: "20 Apr 2026", totalExams: 112, avgAttendance: 82.3, monthlyGoal: 720 },
  { id: 5, name: "Samurai", category: "BAR / BJS", rank: 5, members: 132, maxMembers: 200, admin: "Imam Hasan", adminRating: 4.6, discount: 63, subgroups: 10, createdDate: "5 May 2026", totalExams: 178, avgAttendance: 77.8, monthlyGoal: 1100 },
  { id: 6, name: "Phoenix", category: "BCS", rank: 6, members: 89, maxMembers: 120, admin: "Rahman Ali", adminRating: 3.9, discount: 45, subgroups: 7, createdDate: "1 Jun 2026", totalExams: 134, avgAttendance: 65.4, monthlyGoal: 890 },
  { id: 7, name: "Zenith", category: "Bank", rank: 7, members: 156, maxMembers: 200, admin: "Farida Begum", adminRating: 4.3, discount: 55, subgroups: 9, createdDate: "22 Mar 2026", totalExams: 167, avgAttendance: 59.8, monthlyGoal: 850 },
  { id: 8, name: "Atlas", category: "DP", rank: 8, members: 47, maxMembers: 80, admin: "Karim Uddin", adminRating: 4.1, discount: 25, subgroups: 4, createdDate: "8 Feb 2026", totalExams: 67, avgAttendance: 78.9, monthlyGoal: 480 },
  { id: 9, name: "Vertex", category: "NTRCA", rank: 9, members: 58, maxMembers: 100, admin: "Nasrin Akter", adminRating: 4.7, discount: 70, subgroups: 5, createdDate: "14 Apr 2026", totalExams: 93, avgAttendance: 72.1, monthlyGoal: 610 },
  { id: 10, name: "Apex", category: "BAR / BJS", rank: 10, members: 40, maxMembers: 60, admin: "Barrister Zafar", adminRating: 3.8, discount: 50, subgroups: 4, createdDate: "3 Jul 2026", totalExams: 82, avgAttendance: 85.0, monthlyGoal: 560 },
];

const EXAMS: Record<string, Array<{ name: string; isLive: boolean }>> = {
  BCS: [
    { name: "ফ্রি সাপ্তাহিক মডেল টেস্ট", isLive: true },
    { name: "১৪০ দিনে ৪৭তম বিসিএস প্রস্তুতি", isLive: false },
    { name: "গুরুত্বপূর্ণ টপিকের উপর পরীক্ষা", isLive: true },
    { name: "ব্যাংক নিয়োগ প্রস্তুতি - লং কোর্স", isLive: false },
    { name: "২০২২ সাল ভিত্তিক সিনিয়র অফিসার নিয়োগ প্রস্তুতি", isLive: true },
    { name: "ব্যাংক ডেইলি কুইজ", isLive: false },
    { name: "ব্যাংক মডেল টেস্ট [সাপ্তাহিক]", isLive: true },
  ],
  Bank: [
    { name: "Bank Job Preparation - 1st Phase", isLive: false },
    { name: "Combined 8 Banks Senior Officer Preparation", isLive: true },
    { name: "Bank Daily Quiz", isLive: false },
    { name: "Bank Model Test [Preliminary]", isLive: true },
    { name: "Math and Mental Ability Practice Exam", isLive: false },
    { name: "English Grammar Live Exam", isLive: true },
    { name: "General Banking Current Affairs Quiz", isLive: false },
  ],
  DP: [
    { name: "Constable Preliminary Mock Exam", isLive: true },
    { name: "Departmental Written Exam Live", isLive: false },
    { name: "Bangla and English Grammar Quiz", isLive: true },
    { name: "Full Written Exam Practice", isLive: false },
    { name: "Math Current Affairs Solution", isLive: false },
    { name: "Physical and General Knowledge Live Exam", isLive: true },
    { name: "Bengali Country Introduction Quiz", isLive: false },
  ],
  NTRCA: [
    { name: "NTRCA Model Test [Preliminary]", isLive: true },
    { name: "Subject-Based Live Exam", isLive: false },
    { name: "Education Policy and Teaching Method Quiz", isLive: true },
    { name: "Bangla Literature and Grammar", isLive: false },
    { name: "Pedagogy and General Studies Practice Exam", isLive: false },
    { name: "General Written Exam Live", isLive: true },
    { name: "Physical Written Exam Live Exam", isLive: false },
  ],
  "BAR / BJS": [
    { name: "Bar Council Preliminary Mock Exam", isLive: true },
    { name: "Judiciary Written Preparation Practice Exam", isLive: false },
    { name: "Constitution Law Quiz", isLive: true },
    { name: "Companies Act Practice Exam", isLive: false },
    { name: "Property Law Live Exam", isLive: true },
    { name: "Contract and Tort Law Live", isLive: false },
    { name: "Criminal Law Quiz", isLive: true },
  ],
};

// ── Shared UI primitives ──────────────────────────────────────────────────────

function AppHeader({ title, onBack, trailing }: { title: string; onBack: () => void; trailing?: React.ReactNode }) {
  return (
    <div className="relative flex items-center justify-between px-1 h-12 bg-white shrink-0 border-b border-gray-100">
      <button
        onClick={onBack}
        className="size-12 flex items-center justify-center rounded-full hover:bg-gray-100 active:bg-gray-200 transition-colors shrink-0"
      >
        <ArrowLeft className="size-6 text-[#484848]" strokeWidth={2} />
      </button>
      <p className={clsx("absolute left-14 font-['Noto_Sans',sans-serif] text-[18px] font-medium text-black leading-7 truncate", trailing ? "right-28" : "right-14")}>
        {title}
      </p>
      <div className="flex items-center justify-end pr-3 min-w-12 h-12 shrink-0">
        {trailing}
      </div>
    </div>
  );
}

// Generic placeholder for a member/user profile photo — used everywhere a member list or
// post feed would otherwise show a picture, since no real avatar photos are available yet.
// Distinct background colors so avatars read as different people at a glance, instead of
// every member sharing the same generic gray silhouette.
const AVATAR_PALETTE = ["#f97316", "#eab308", "#22c55e", "#14b8a6", "#3b82f6", "#6366f1", "#a855f7", "#ec4899", "#ef4444", "#0ea5e9"];

function MemberAvatar({ size = 30, className, style, name }: { size?: number; className?: string; style?: React.CSSProperties; name?: string }) {
  if (!name) {
    return (
      <div
        className={clsx("rounded-full shrink-0 bg-[#e6e6e6] flex items-center justify-center overflow-hidden", className)}
        style={{ width: size, height: size, ...style }}
      >
        <User className="text-[#9a9a9a]" style={{ width: size * 0.58, height: size * 0.58 }} strokeWidth={1.75} />
      </div>
    );
  }
  const trimmed = name.trim();
  const initial = /[a-zA-Z]/.test(trimmed[0] ?? "") ? trimmed[0].toUpperCase() : (trimmed[0] ?? "?");
  const hash = trimmed.split("").reduce((h, ch) => (h * 31 + ch.charCodeAt(0)) >>> 0, 0);
  const bg = AVATAR_PALETTE[hash % AVATAR_PALETTE.length];
  return (
    <div
      className={clsx("rounded-full shrink-0 flex items-center justify-center overflow-hidden", className)}
      style={{ width: size, height: size, backgroundColor: bg, ...style }}
    >
      <span className="font-['Noto_Sans',sans-serif] font-medium text-white leading-none" style={{ fontSize: size * 0.44 }}>{initial}</span>
    </div>
  );
}

// Generic placeholder for a group photo — used everywhere a group icon or cover
// would otherwise show a picture, since no real group photos are available yet.
function GroupAvatar({ size = 30, className, style }: { size?: number; className?: string; style?: React.CSSProperties }) {
  return (
    <div
      className={clsx("rounded-full shrink-0 bg-[#e6e6e6] flex items-center justify-center overflow-hidden", className)}
      style={{ width: size, height: size, ...style }}
    >
      <Users className="text-[#9a9a9a]" style={{ width: size * 0.58, height: size * 0.58 }} strokeWidth={1.75} />
    </div>
  );
}

// Bottom-anchored confirmation toast, e.g. after publishing an announcement. Stays
// mounted across screen transitions since it's rendered outside the screen AnimatePresence.
function Snackbar({ message }: { message: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 16 }}
      transition={{ type: "tween", duration: 0.2 }}
      className="absolute left-4 right-4 bottom-4 z-[60] bg-[#2e2e2e] rounded-[8px] px-4 py-3.5 flex items-center shadow-[0px_4px_8px_3px_rgba(0,0,0,0.15)]"
    >
      <span className="font-['Noto_Sans',sans-serif] font-medium text-[14px] text-white leading-5">{message}</span>
    </motion.div>
  );
}

function LiveChip() {
  return (
    <div className="bg-red-500 flex gap-1 items-center justify-center px-2 rounded-lg shrink-0">
      <div className="size-1.5 rounded-full bg-white" />
      <span className="font-['Noto_Sans',sans-serif] font-medium text-[10px] text-white leading-4">Live</span>
    </div>
  );
}

// ── Screen 2: Group Detail ────────────────────────────────────────────────────

const MANDATORY_EXAMS_INFO_TEXT = `বাধ্যতামূলক পরীক্ষাসমূহ হলো গ্রুপের নিয়ম অনুযায়ী প্রতিটি সদস্যের জন্য অংশগ্রহণ করা আবশ্যক এমন পরীক্ষার তালিকা।

কেন এই পরীক্ষাগুলো বাধ্যতামূলক?

• নিয়মিত অনুশীলনের মাধ্যমে প্রস্তুতির ধারাবাহিকতা বজায় রাখা
• নিজের অগ্রগতি ও দুর্বলতা সঠিকভাবে যাচাই করা
• গ্রুপ র‍্যাংকিং ও মাসিক লক্ষ্যমাত্রায় (Goal) অবদান রাখা
• এডমিন ও অন্যান্য সদস্যদের সাথে প্রস্তুতির ধারাবাহিকতা বজায় রাখা

যেসব পরীক্ষার পাশে "Live" ব্যাজ দেখা যাচ্ছে, সেগুলো এখন চলমান রয়েছে এবং সরাসরি অংশগ্রহণ করা যাবে। বাকি পরীক্ষাগুলো নির্ধারিত সময়ে যুক্ত হবে। গ্রুপ নিয়মাবলীতে উল্লিখিত ন্যূনতম অংশগ্রহণের শর্ত পূরণ করতে নিয়মিত এই পরীক্ষাগুলোতে অংশ নেওয়ার চেষ্টা করুন।`;

function MandatoryExamsInfoBottomSheet({ onClose }: { onClose: () => void }) {
  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/40 px-6" onClick={onClose}>
      <motion.div
        initial={{ scale: 0.92, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.92, opacity: 0 }}
        transition={{ type: "tween", duration: 0.18, ease: "easeOut" }}
        className="w-full bg-white rounded-[12px] shadow-[0px_4px_8px_3px_rgba(0,0,0,0.15)] flex flex-col overflow-hidden max-h-[80%]"
        onClick={e => e.stopPropagation()}
      >
        {/* Title */}
        <div className="px-[16px] pt-[16px] shrink-0">
          <p
            className="font-['Noto_Sans',sans-serif] font-normal text-[18px] leading-[28px] text-black"
            style={{ fontVariationSettings: '"CTGR" 0, "wdth" 100' }}
          >
            বাধ্যতামূলক পরীক্ষাসমূহ
          </p>
        </div>

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto mt-[16px]">
          <div className="bg-white px-[16px] py-[8px]">
            <p
              className="font-['Noto_Sans',sans-serif] font-normal text-[14px] leading-[20px] text-[#484848] whitespace-pre-wrap"
              style={{ fontVariationSettings: '"CTGR" 0, "wdth" 100' }}
            >
              {MANDATORY_EXAMS_INFO_TEXT}
            </p>
          </div>
        </div>

        {/* Close button */}
        <div className="shrink-0 p-[12px]">
          <button
            onClick={onClose}
            className="w-full h-[56px] rounded-[12px] border border-[#c7c7c7] flex items-center justify-center"
          >
            <span
              className="font-['Noto_Sans',sans-serif] font-medium text-[16px] leading-[24px] tracking-[0.15px] text-[#484848]"
              style={{ fontVariationSettings: '"CTGR" 0, "wdth" 100' }}
            >
              Close
            </span>
          </button>
        </div>
      </motion.div>
    </div>
  );
}

function AdminDetailsBottomSheet({
  name,
  rating,
  since,
  onClose,
}: {
  name: string;
  rating: number;
  since: string;
  onClose: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="absolute inset-0 z-50 flex flex-col justify-end bg-black/40"
      onClick={onClose}
    >
      <motion.div
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        exit={{ y: "100%" }}
        transition={{ type: "tween", duration: 0.28, ease: [0.4, 0, 0.2, 1] }}
        className="bg-white rounded-tl-[16px] rounded-tr-[16px] shadow-[0px_4px_8px_3px_rgba(0,0,0,0.15)] flex flex-col overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        {/* Drag handle */}
        <div className="flex flex-col items-center p-[16px] shrink-0">
          <div className="bg-[#787878] h-[4px] rounded-[100px] w-[32px]" />
        </div>

        {/* Title */}
        <div className="px-[16px] pb-[16px] shrink-0">
          <p
            className="font-['Noto_Sans',sans-serif] font-normal text-[24px] leading-[32px] text-black"
            style={{ fontVariationSettings: '"CTGR" 0, "wdth" 100' }}
          >
            Admin Details
          </p>
        </div>

        <div className="border-t border-[#e3e3e3]" />

        {/* Admin row */}
        <div className="flex items-center gap-3 p-[16px]">
          <img src={imgGroupIcon} alt="" className="size-[56px] rounded-full shrink-0 object-cover" />
          <div className="flex flex-col gap-1 min-w-0">
            <p
              className="font-['Noto_Sans',sans-serif] font-medium text-[18px] text-black leading-[26px] truncate"
              style={{ fontVariationSettings: '"CTGR" 0, "wdth" 100' }}
            >
              {name}
            </p>
            <div className="flex items-center gap-1.5">
              <Star className="size-4 text-[#f5c518] fill-[#f5c518] shrink-0" />
              <span className="font-['Noto_Sans',sans-serif] font-semibold text-[14px] text-black leading-[20px]">
                {rating.toFixed(1)}
              </span>
              <span className="font-['Noto_Sans',sans-serif] font-normal text-[14px] text-[#787878] leading-[20px]">
                Admin since: {since}
              </span>
            </div>
          </div>
        </div>

        {/* Close button */}
        <div className="shrink-0 p-[12px]">
          <button
            onClick={onClose}
            className="w-full h-[56px] rounded-[100px] border border-[#c7c7c7] flex items-center justify-center"
          >
            <span
              className="font-['Noto_Sans',sans-serif] font-medium text-[16px] leading-[24px] tracking-[0.15px] text-[#484848]"
              style={{ fontVariationSettings: '"CTGR" 0, "wdth" 100' }}
            >
              Close
            </span>
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

const GROUP_RULES_BODY_TEXT = `- নিয়মিত পরীক্ষা দিতে হবে। প্রতিযোগিতার মাধ্যমে নিজেকে পুশ করুন। হতাশ হবেন না। পাশ ফেল নিয়ে অতিরিক্ত না ভেবে পড়াশুনা করে লাইভ পরীক্ষা দিন। মূল পরীক্ষায় এটা আপনাকে অনেক সাহায্য করবে।

- নিয়মিত লাইভ পরীক্ষায় অংশগ্রহণ না করলে গ্রুপের মেম্বারশিপ বাতিল করে দেয়া হবে।
সেক্ষেত্রে পূর্ববর্তী ১৫ দিনের পরীক্ষাসমূহে আপনার উপস্থিতিঃ
ক) ৫০% এর নিচে হলে "সতর্কতামূলক মেসেজ" দেখাবে।
খ) ৩০% এর নিচে হলে গ্রুপ এডমিন আপনাকে গ্রুপ থেকে রিমুভ করে দিবেন।

- একান্ত ব্যক্তিগত আলোচনা নিষিদ্ধ। তবে, নিজেদের মধ্যে আড্ডা-গল্প হতেই পারে।
- কোন ধরনের বিজ্ঞাপনমূলক পোস্ট কিংবা অযাচিত লিংক শেয়ার করা যাবে না।
- অপর সদস্যদের মতামতকে সম্মান দিয়ে আলোচনা করতে হবে।
- এডমিন সম্পর্কে কোন অভিযোগ থাকলে সরাসরি Live MCQ পেজে মেসেজ দিয়ে জানাতে পারবেন। সেক্ষেত্রে, আমরা এডমিনের সাথে কথা বলব।

আশা করি Live MCQ অফিসিয়াল স্টাডি গ্রুপগুলো আপনাদের প্রস্তুতিতে যথেষ্ট সহায়তা করবে।
পাশাপাশি, পারস্পরিক সম্মান ও সহযোগিতার মনোভাব নিয়ে গ্রুপে একটি প্রাণবন্ত পরিবেশ বজায় রাখবেন এই কামনা করছি।

শুভকামনায়,
Live MCQ Team.`;

function GroupRulesScreen({ group, onBack }: { group: Group; onBack: () => void }) {
  const ns = { fontVariationSettings: '"CTGR" 0, "wdth" 100' };
  const zoneRows = [
    { color: "#ff3232", label: "Red Zone Attendance", value: "10%" },
    { color: "#e4b400", label: "Yellow Zone Attendance", value: "20%" },
    { color: "#2f9e44", label: "Green Zone Attendance", value: "70%" },
  ];

  return (
    <div className="flex flex-col h-full bg-white overflow-hidden">
      <AppHeader title="Group rules" onBack={onBack} />

      <div className="flex-1 overflow-y-auto flex flex-col gap-4 px-4 pt-4 pb-6">
        <div className="border border-[#e3e3e3] rounded-[12px] p-3 flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <span className="font-['Noto_Sans',sans-serif] font-medium text-[14px] text-black leading-5" style={ns}>Status</span>
            <div className="bg-[#0c5fff] rounded-[4px] px-2 h-5 flex items-center shrink-0">
              <span className="font-['Noto_Sans',sans-serif] font-medium text-[10px] text-white leading-4" style={ns}>Open to Join</span>
            </div>
          </div>
          <div className="h-px bg-[#e3e3e3]" />
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <span className="font-['Noto_Sans',sans-serif] font-medium text-[14px] text-[#484848] leading-5" style={ns}>Member Limit</span>
              <span className="font-['Noto_Sans',sans-serif] font-medium text-[14px] text-black leading-5">{group.maxMembers}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="font-['Noto_Sans',sans-serif] font-medium text-[14px] text-[#484848] leading-5" style={ns}>Subgroup Member Limit</span>
              <span className="font-['Noto_Sans',sans-serif] font-medium text-[14px] text-black leading-5">20</span>
            </div>
          </div>
        </div>

        <div className="border border-[#e3e3e3] rounded-[12px] p-3 flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <span className="font-['Noto_Sans',sans-serif] font-medium text-[14px] text-black leading-5" style={ns}>Monthly Goal</span>
            <span className="font-['Noto_Sans',sans-serif] font-medium text-[14px] text-black leading-5">{group.monthlyGoal}</span>
          </div>
          <div className="h-px bg-[#e3e3e3]" />
          <div className="flex flex-col gap-4">
            {zoneRows.map(row => (
              <div key={row.label} className="flex items-center justify-between">
                <div className="flex items-center gap-1">
                  <div className="size-2.5 rounded-full shrink-0" style={{ backgroundColor: row.color }} />
                  <span className="font-['Noto_Sans',sans-serif] font-medium text-[14px] text-[#484848] leading-5" style={ns}>{row.label}</span>
                </div>
                <span className="font-['Noto_Sans',sans-serif] font-medium text-[14px] text-black leading-5">{row.value}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col">
          <p className="font-['Noto_Sans',sans-serif] font-medium text-[14px] text-black leading-5 mb-2" style={ns}>গ্রুপের সাধারণ নিয়মাবলীঃ</p>
          <p className="font-['Noto_Sans',sans-serif] font-normal text-[14px] text-[#484848] leading-5 whitespace-pre-wrap" style={ns}>{GROUP_RULES_BODY_TEXT}</p>
        </div>
      </div>
    </div>
  );
}

// ── Root App ──────────────────────────────────────────────────────────────────

const slideVariants = {
  enter: (dir: number) => ({ x: dir * 375, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (dir: number) => ({ x: dir * -375, opacity: 0 }),
};
const slideTrans = { type: "tween" as const, duration: 0.28, ease: "easeInOut" as const };

// ── Screen 4: Group Member (accepted) ─────────────────────────────────────────

const MEMBER_EXAMS = [
  { title: "ডেইলি কুইজ [১৪০ দিনের রুটিনের অংশ]", marks: 60, mins: 31, isLive: false, desc: "বিগত সালগুলোতে অনুষ্ঠিত হওয়া যেকোন ১টি ১৮-২০তম গ্রেডের রিয়েল জবের পরীক্ষার প্রশ্ন নিয়ে তৈরি।" },
  { title: "গত মাসের সমস্ত বিষয়বস্তু এবং পরীক্ষার প্রশ্নগুলোর উপর ভিত্তি করে একটি সারসংক্ষেপ পরীক্ষা।", marks: 60, mins: 31, isLive: true, desc: "গত মাসের সমস্ত বিষয়বস্তু এবং পরীক্ষার প্রশ্নগুলোর উপর ভিত্তি করে একটি সারসংক্ষেপ পরীক্ষা।", badge: "OMR" },
  { title: "সাল শেষের মূল্যায়ন [১৪০ দিনের রুটিনের অংশ]", marks: 60, mins: 31, isLive: false, desc: "সম্পূর্ণ সিলেবাস কভার করে বার্ষিক মূল্যায়ন পরীক্ষা।" },
  { title: "মাসিক মডেল টেস্ট [পরিপূর্ণ সিলেবাস]", marks: 80, mins: 45, isLive: true, desc: "পুরো সিলেবাস অনুযায়ী মাসিক মডেল টেস্ট।" },
];

// Same { name, isLive } shape as EXAMS, so both lists work interchangeably as an ExamPageScreen examList.
const MANDATORY_EXAMS: Array<{ name: string; isLive: boolean }> = [
  { name: "ফ্রি সাপ্তাহিক মডেল টেস্ট", isLive: true },
  { name: "১৪০ দিনে ৪৭তম বিসিএস প্রস্তুতি", isLive: false },
  { name: "গুরুত্বপূর্ণ টপিকের উপর পরীক্ষা", isLive: true },
  { name: "ব্যাংক নিয়োগ প্রস্তুতি - লং কোর্স", isLive: false },
  { name: "২০২২ সাল ভিত্তিক সিনিয়র অফিসার নিয়োগ প্রস্তুতি", isLive: true },
  { name: "ব্যাংক ডেইলি কুইজ", isLive: false },
  { name: "ব্যাংক মডেল টেস্ট [সাপ্তাহিক]", isLive: true },
];

const QUICK_LINKS: Array<{ id: string; label: string; Icon: LucideIcon }> = [
  { id: "routine", label: "Routine", Icon: CalendarDays },
  { id: "archive", label: "Archive", Icon: Archive },
  { id: "result", label: "Result", Icon: ClipboardCheck },
  { id: "meritList", label: "Merit List", Icon: Trophy },
];

type QuickLink = typeof QUICK_LINKS[number];

// Quick-link tiles shown at the bottom of the study group screen, and again on every
// exam's page so the same shortcuts are always within reach.
function ExamQuickLinks({ onSelect }: { onSelect: (link: QuickLink) => void }) {
  return (
    <div className="grid grid-cols-2 gap-2">
      {QUICK_LINKS.map(link => (
        <button
          key={link.id}
          onClick={() => onSelect(link)}
          className="h-14 bg-[#f4f6fa] rounded-[12px] flex items-center justify-center gap-2 active:opacity-70 transition-opacity"
        >
          <link.Icon className="size-5 text-[#484848]" strokeWidth={1.75} />
          <span className="font-['Noto_Sans',sans-serif] font-medium text-[14px] text-black leading-[20px]">{link.label}</span>
        </button>
      ))}
    </div>
  );
}

interface ResultExamItem {
  id: string;
  title: string;
  marks: number;
  mins: number;
  desc: string;
  studyMaterialsCount?: number;
  hasSlideshow?: boolean;
  hasPdf?: boolean;
  dateStr?: string;
  score: number;
  rank: number;
  totalParticipants: number;
  correctAnswers: number;
  wrongAnswers: number;
  negativeMarks: number;
  timeSpent: string;
}

const RESULT_EXAMS: ResultExamItem[] = [
  {
    id: "res-1",
    title: "ডেইলি কুইজ [১৪০ দিনের রুটিনের অংশ]",
    marks: 60,
    mins: 31,
    desc: "বিগত সালগুলোতে অনুষ্ঠিত হওয়া যেকোন ১টি ১৮-২০তম গ্রেডের রিয়েল জবের পরীক্ষার প্রশ্নের উপর লাইভ পরীক্ষা। বিগত সালগুলোতে অনুষ্ঠিত হওয়া যেকোন...",
    studyMaterialsCount: 8,
    hasSlideshow: true,
    hasPdf: true,
    score: 52.5,
    rank: 4,
    totalParticipants: 120,
    correctAnswers: 54,
    wrongAnswers: 6,
    negativeMarks: 1.5,
    timeSpent: "22m 15s",
  },
  {
    id: "res-2",
    title: "মাসিক রিভিউ [১৪০ দিনের রুটিনের অংশ]",
    marks: 60,
    mins: 31,
    desc: "গত মাসের সমস্ত বিষয়বস্তু এবং পরীক্ষার প্রশ্নগুলোর উপর ভিত্তি করে একটি সারসংক্ষেপ পরীক্ষা।",
    studyMaterialsCount: 11,
    hasSlideshow: false,
    hasPdf: true,
    dateStr: "Sunday 12 Dec 2025",
    score: 48.0,
    rank: 12,
    totalParticipants: 115,
    correctAnswers: 50,
    wrongAnswers: 8,
    negativeMarks: 2.0,
    timeSpent: "25m 40s",
  },
  {
    id: "res-3",
    title: "সাল শেষের মূল্যায়ন [১৪০ দিনের রুটিনের অংশ]",
    marks: 60,
    mins: 31,
    desc: "বিগত ১৪০ দিনের সমস্ত বিষয়বস্তু ও পরীক্ষার প্রশ্নের উপর একটি সমন্বিত মূল্যায়ন।",
    studyMaterialsCount: 5,
    hasSlideshow: true,
    hasPdf: false,
    score: 55.0,
    rank: 2,
    totalParticipants: 128,
    correctAnswers: 56,
    wrongAnswers: 4,
    negativeMarks: 1.0,
    timeSpent: "28m 00s",
  },
  {
    id: "res-4",
    title: "সপ্তাহিক প্র্যাকটিস [১৪০ দিনের রুটিনের অংশ]",
    marks: 60,
    mins: 31,
    desc: "সপ্তাহের সমস্ত বিষয়বস্তু নিয়ে প্রস্তুতি এবং পরীক্ষার প্রশ্নের অনুশীলন।",
    studyMaterialsCount: 6,
    hasSlideshow: true,
    hasPdf: true,
    score: 44.5,
    rank: 18,
    totalParticipants: 110,
    correctAnswers: 47,
    wrongAnswers: 10,
    negativeMarks: 2.5,
    timeSpent: "21m 05s",
  },
];

// High-fidelity Result Screen matching Mobile/Study Group / Admin / Result Figma design (Demo)
function ResultScreen({ onBack }: { onBack: () => void }) {
  const [expandedCards, setExpandedCards] = useState<Record<string, boolean>>({});

  const toggleExpand = (id: string) => {
    setExpandedCards(prev => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="flex flex-col h-full bg-white overflow-hidden relative">
      {/* Header */}
      <AppHeader
        title="Result"
        onBack={onBack}
        trailing={
          <div className="flex items-center gap-1">
            <div className="size-10 flex items-center justify-center">
              <CalendarDays className="size-5 text-[#484848]" strokeWidth={1.75} />
            </div>
            <div className="size-10 flex items-center justify-center">
              <Filter className="size-5 text-[#484848]" strokeWidth={1.75} />
            </div>
          </div>
        }
      />

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto pb-10">
        <div className="flex flex-col">
          {/* Card 1: ডেইলি কুইজ [১৪০ দিনের রুটিনের অংশ] */}
          <div className="bg-white px-4 pt-4 pb-4 flex flex-col gap-4 border-b border-[#e6e6e6]">
            {/* Header */}
            <div className="flex flex-col gap-2">
              <p className="font-['Noto_Sans',sans-serif] font-medium text-[16px] leading-[24px] text-black tracking-[0.15px]">
                ডেইলি কুইজ [১৪০ দিনের রুটিনের অংশ]
              </p>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-[#484848]">
                  <FileText className="size-4 text-[#484848]" />
                  <span className="font-['Noto_Sans',sans-serif] font-medium text-[12px] leading-[16px] text-[#484848]">
                    60 marks
                  </span>
                </div>
                <div className="flex items-center gap-1.5 text-[#484848]">
                  <Clock className="size-4 text-[#484848]" />
                  <span className="font-['Noto_Sans',sans-serif] font-medium text-[12px] leading-[16px] text-[#484848]">
                    31 mins
                  </span>
                </div>
              </div>
            </div>

            {/* Description */}
            <p className="font-['Noto_Sans',sans-serif] text-[14px] text-[#484848] leading-[20px]">
              {expandedCards["res-1"] ? (
                <>
                  বিগত সালগুলোতে অনুষ্ঠিত হওয়া যেকোন ১টি ১৮-২০তম গ্রেডের রিয়েল জবের পরীক্ষার প্রশ্নের উপর লাইভ পরীক্ষা। বিগত সালগুলোতে অনুষ্ঠিত হওয়া যেকোন বিষয় ভিত্তিক গুরুত্বপূর্ণ প্রশ্নের অনুশীলন।
                  <button
                    onClick={() => toggleExpand("res-1")}
                    className="font-medium text-black ml-1 font-['Roboto',sans-serif]"
                  >
                    See less
                  </button>
                </>
              ) : (
                <>
                  বিগত সালগুলোতে অনুষ্ঠিত হওয়া যেকোন ১টি ১৮-২০তম গ্রেডের রিয়েল জবের পরীক্ষার প্রশ্নের উপর লাইভ পরীক্ষা বিগত সালগুলোতে অনুষ্ঠিত হওয়া যেকোন...{" "}
                  <button
                    onClick={() => toggleExpand("res-1")}
                    className="font-medium text-black font-['Roboto',sans-serif]"
                  >
                    See more
                  </button>
                </>
              )}
            </p>

            {/* Card Footer Actions (display only) */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-[14px] font-['Noto_Sans',sans-serif] font-medium text-black">
                <Pencil className="size-4 text-[#1441cc]" />
                <span>Study materials (8)</span>
                <span className="w-0 h-0 border-y-[4px] border-y-transparent border-l-[6px] border-l-[#1441cc] ml-0.5" />
              </div>
              <div className="flex items-center gap-2.5">
                {RESULT_EXAMS[0].hasSlideshow && <PlaySquare className="size-5 text-[#484848]" strokeWidth={1.5} />}
                {RESULT_EXAMS[0].hasPdf && <FileSpreadsheet className="size-5 text-[#484848]" />}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2 pt-1">
              <div className="h-[48px] border border-[#c7c7c7] bg-white rounded-[8px] flex items-center justify-center font-['Noto_Sans',sans-serif] font-medium text-[14px] text-[#484848]">
                উত্তরপত্র
              </div>
              <div className="h-[48px] bg-[#1441cc] rounded-[8px] flex items-center justify-center font-['Noto_Sans',sans-serif] font-medium text-[14px] text-white">
                মার্কশিট
              </div>
            </div>
          </div>

          <div className="bg-white px-4 pt-4 pb-4 flex flex-col gap-4 border-b border-[#e6e6e6]">
            <div className="flex flex-col gap-2">
              <p className="font-['Noto_Sans',sans-serif] font-medium text-[16px] leading-[24px] text-black tracking-[0.15px]">
                মাসিক রিভিউ [১৪০ দিনের রুটিনের অংশ]
              </p>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-[#484848]">
                  <FileText className="size-4 text-[#484848]" />
                  <span className="font-['Noto_Sans',sans-serif] font-medium text-[12px] leading-[16px] text-[#484848]">
                    60 marks
                  </span>
                </div>
                <div className="flex items-center gap-1.5 text-[#484848]">
                  <Clock className="size-4 text-[#484848]" />
                  <span className="font-['Noto_Sans',sans-serif] font-medium text-[12px] leading-[16px] text-[#484848]">
                    31 mins
                  </span>
                </div>
              </div>
            </div>

            <p className="font-['Noto_Sans',sans-serif] text-[14px] text-[#484848] leading-[20px]">
              গত মাসের সমস্ত বিষয়বস্তু এবং পরীক্ষার প্রশ্নগুলোর উপর ভিত্তি করে একটি সারসংক্ষেপ পরীক্ষা
            </p>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-[14px] font-['Noto_Sans',sans-serif] font-medium text-black">
                <Pencil className="size-4 text-[#1441cc]" />
                <span>Study materials (11)</span>
                <span className="w-0 h-0 border-y-[4px] border-y-transparent border-l-[6px] border-l-[#1441cc] ml-0.5" />
              </div>
              <div className="flex items-center gap-2.5">
                {RESULT_EXAMS[1].hasPdf && <FileSpreadsheet className="size-5 text-[#484848]" />}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-1">
              <div className="h-[48px] border border-[#c7c7c7] bg-white rounded-[8px] flex items-center justify-center font-['Noto_Sans',sans-serif] font-medium text-[14px] text-[#484848]">
                উত্তরপত্র
              </div>
              <div className="h-[48px] bg-[#1441cc] rounded-[8px] flex items-center justify-center font-['Noto_Sans',sans-serif] font-medium text-[14px] text-white">
                মার্কশিট
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 px-4 py-3 bg-white">
            <div className="flex-1 h-px bg-[#e6e6e6]" />
            <span className="font-['Noto_Sans',sans-serif] font-medium text-[12px] text-[#787878] whitespace-nowrap">
              Sunday 12 Dec 2025
            </span>
            <div className="flex-1 h-px bg-[#e6e6e6]" />
          </div>

          <div className="bg-white px-4 pt-4 pb-4 flex flex-col gap-4 border-b border-[#e6e6e6]">
            <div className="flex flex-col gap-2">
              <p className="font-['Noto_Sans',sans-serif] font-medium text-[16px] leading-[24px] text-black tracking-[0.15px]">
                সাল শেষের মূল্যায়ন [১৪০ দিনের রুটিনের অংশ]
              </p>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-[#484848]">
                  <FileText className="size-4 text-[#484848]" />
                  <span className="font-['Noto_Sans',sans-serif] font-medium text-[12px] leading-[16px] text-[#484848]">
                    60 marks
                  </span>
                </div>
                <div className="flex items-center gap-1.5 text-[#484848]">
                  <Clock className="size-4 text-[#484848]" />
                  <span className="font-['Noto_Sans',sans-serif] font-medium text-[12px] leading-[16px] text-[#484848]">
                    31 mins
                  </span>
                </div>
              </div>
            </div>

            <p className="font-['Noto_Sans',sans-serif] text-[14px] text-[#484848] leading-[20px]">
              বিগত ১৪০ দিনের সমস্ত বিষয়বস্তু ও পরীক্ষার প্রশ্নের উপর একটি সমন্বিত মূল্যায়ন
            </p>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-[14px] font-['Noto_Sans',sans-serif] font-medium text-black">
                <Pencil className="size-4 text-[#1441cc]" />
                <span>Study materials (5)</span>
                <span className="w-0 h-0 border-y-[4px] border-y-transparent border-l-[6px] border-l-[#1441cc] ml-0.5" />
              </div>
              <div className="flex items-center gap-2.5">
                {RESULT_EXAMS[2].hasSlideshow && <PlaySquare className="size-5 text-[#484848]" strokeWidth={1.5} />}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-1">
              <div className="h-[48px] border border-[#c7c7c7] bg-white rounded-[8px] flex items-center justify-center font-['Noto_Sans',sans-serif] font-medium text-[14px] text-[#484848]">
                উত্তরপত্র
              </div>
              <div className="h-[48px] bg-[#1441cc] rounded-[8px] flex items-center justify-center font-['Noto_Sans',sans-serif] font-medium text-[14px] text-white">
                মার্কশিট
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

interface MeritListEntry {
  rank: number;
  name: string;
  marks: number;
  isCurrentUser?: boolean;
}

const MERIT_LIST: MeritListEntry[] = [
  { rank: 1, name: "Sumaiya", marks: 35.20 },
  { rank: 2, name: "Fatima Al-Farsi", marks: 33.10 },
  { rank: 3, name: "Rafiq Islam", marks: 32.00 },
  { rank: 4, name: "Sadia Rahman", marks: 31.60 },
  { rank: 5, name: "Md Jahidul Islam Shifat", marks: 27.80, isCurrentUser: true },
  { rank: 6, name: "Maria Gonzalez", marks: 26.40 },
  { rank: 7, name: "Arif Hossain", marks: 22.90 },
];

function MeritListScreen({ onBack }: { onBack: () => void }) {
  const currentUser = MERIT_LIST.find(entry => entry.isCurrentUser);
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (showSearch) searchInputRef.current?.focus();
  }, [showSearch]);

  const closeSearch = () => {
    setShowSearch(false);
    setSearchQuery("");
  };

  const filteredList = MERIT_LIST.filter(entry =>
    entry.name.toLowerCase().includes(searchQuery.trim().toLowerCase())
  );

  return (
    <div className="flex flex-col h-full bg-white overflow-hidden">
      {showSearch ? (
        <div className="flex items-center gap-2 px-1 h-12 bg-white shrink-0 border-b border-gray-100">
          <button
            onClick={closeSearch}
            className="size-12 flex items-center justify-center rounded-full hover:bg-gray-100 active:bg-gray-200 transition-colors shrink-0"
          >
            <ArrowLeft className="size-6 text-[#484848]" strokeWidth={2} />
          </button>
          <input
            ref={searchInputRef}
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search by name"
            className="flex-1 min-w-0 font-['Noto_Sans',sans-serif] text-[18px] font-medium text-black placeholder:text-[#a3a3a3] placeholder:font-normal outline-none bg-transparent"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="size-12 flex items-center justify-center rounded-full hover:bg-gray-100 active:bg-gray-200 transition-colors shrink-0"
            >
              <X className="size-5 text-[#484848]" />
            </button>
          )}
        </div>
      ) : (
        <AppHeader
          title="Merit List"
          onBack={onBack}
          trailing={
            <button
              onClick={() => setShowSearch(true)}
              className="size-10 flex items-center justify-center rounded-full hover:bg-gray-100 active:bg-gray-200 transition-colors"
            >
              <Search className="size-5 text-black" strokeWidth={1.75} />
            </button>
          }
        />
      )}
      <div className="flex-1 overflow-y-auto pb-6">
        {!showSearch && currentUser && (
          <div className="mx-4 mt-4 p-3 bg-[#f4f6fa] rounded-[12px] flex items-center gap-3">
            <img src={imgMemberIcon} alt="" className="size-12 rounded-full shrink-0 object-cover" />
            <div className="flex flex-col gap-1 flex-1 min-w-0">
              <p className="font-['Noto_Sans',sans-serif] font-semibold text-[15px] text-black truncate">
                {currentUser.name}
              </p>
              <div className="flex items-center gap-3 text-[12px] text-[#484848] font-['Noto_Sans',sans-serif]">
                <span className="flex items-center gap-1">
                  <BarChart3 className="size-3.5" />
                  Level 5
                </span>
                <span className="flex items-center gap-1">
                  <Award className="size-3.5" />
                  160 Points
                </span>
              </div>
              <span className="inline-flex w-fit px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 text-[11px] font-medium font-['Noto_Sans',sans-serif]">
                Passed
              </span>
            </div>
          </div>
        )}

        <div className="flex items-center justify-between px-4 pt-5 pb-2 text-[12px] font-medium text-[#787878] font-['Noto_Sans',sans-serif]">
          <div className="flex items-center gap-6">
            <span className="w-6">SL</span>
            <span>Name</span>
          </div>
          <span>Marks</span>
        </div>

        <div className="flex flex-col">
          {filteredList.map(entry => (
            <div
              key={entry.rank}
              className={clsx(
                "flex items-center justify-between px-4 py-3 border-b border-[#f0f0f0]",
                entry.isCurrentUser && "bg-emerald-50"
              )}
            >
              <div className="flex items-center gap-6">
                <span className="w-6 font-['Noto_Sans',sans-serif] text-[14px] text-[#484848]">{entry.rank}</span>
                <span
                  className={clsx(
                    "font-['Noto_Sans',sans-serif] text-[14px]",
                    entry.isCurrentUser ? "font-semibold text-black" : "text-black"
                  )}
                >
                  {entry.name}
                </span>
              </div>
              <span className="font-['Noto_Sans',sans-serif] text-[14px] text-black">{entry.marks.toFixed(2)}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Shared empty state for Routine / Archive pages, with full ResultScreen for Result page and
// MeritListScreen for the Merit List page
function QuickLinkPageScreen({ link, onBack }: { link: QuickLink; onBack: () => void }) {
  if (link.id === "result") {
    return <ResultScreen onBack={onBack} />;
  }
  if (link.id === "meritList") {
    return <MeritListScreen onBack={onBack} />;
  }

  return (
    <div className="flex flex-col h-full bg-white overflow-hidden">
      <AppHeader title={link.label} onBack={onBack} />
      <div className="flex-1 flex flex-col items-center justify-center gap-4 px-8 -mt-12">
        <div className="size-16 rounded-full bg-[#f4f6fa] flex items-center justify-center">
          <link.Icon className="size-7 text-[#787878]" strokeWidth={1.5} />
        </div>
        <div className="flex flex-col gap-1 items-center">
          <p className="font-['Noto_Sans',sans-serif] font-medium text-[16px] text-black leading-[24px] text-center" style={{ fontVariationSettings: '"CTGR" 0, "wdth" 100' }}>
            No data right now
          </p>
          <p className="font-['Noto_Sans',sans-serif] font-normal text-[14px] text-[#787878] leading-[20px] text-center" style={{ fontVariationSettings: '"CTGR" 0, "wdth" 100' }}>
            Exams will be added very soon.
          </p>
        </div>
      </div>
    </div>
  );
}

function ArticleIcon() {
  return (
    <svg className="size-4 shrink-0" fill="none" viewBox="0 0 16 16">
      <mask id="m-article" maskUnits="userSpaceOnUse" style={{ maskType: "alpha" }} width="16" height="16">
        <rect fill="#D9D9D9" width="16" height="16" />
      </mask>
      <g mask="url(#m-article)">
        <path d={svgMember.p29a99300} fill="#484848" />
      </g>
    </svg>
  );
}

function AlarmIcon() {
  return (
    <svg className="size-4 shrink-0" fill="none" viewBox="0 0 16 16">
      <mask id="m-alarm" maskUnits="userSpaceOnUse" style={{ maskType: "alpha" }} width="16" height="16">
        <rect fill="#D9D9D9" width="16" height="16" />
      </mask>
      <g mask="url(#m-alarm)">
        <path d={svgMember.p2bd72d80} fill="#484848" />
      </g>
    </svg>
  );
}

function TimerIcon() {
  return (
    <svg className="size-5 shrink-0" fill="none" viewBox="0 0 20 20">
      <mask id="m-timer" maskUnits="userSpaceOnUse" style={{ maskType: "alpha" }} width="20" height="20">
        <rect fill="#D9D9D9" width="20" height="20" />
      </mask>
      <g mask="url(#m-timer)">
        <path d={svgMember.p61c3600} fill="#484848" />
      </g>
    </svg>
  );
}

function ActivityCard({ exam }: { exam?: typeof MEMBER_EXAMS[0] }) {
  if (!exam) return null;
  return (
    <div className="bg-[#f4f6fa] rounded-[16px] w-full px-4 pt-4 pb-3 flex flex-col gap-[18px]">
      {/* Header */}
      <div className="flex flex-col gap-2">
        <div className="flex items-start justify-between gap-2">
          <p
            className="flex-1 font-['Noto_Sans',sans-serif] font-medium text-[16px] leading-[24px] text-black tracking-[0.15px]"
            style={{ fontVariationSettings: '"CTGR" 0, "wdth" 100' }}
          >
            {exam.title}
          </p>
          {"badge" in exam && exam.badge && (
            <div className="bg-[#f7dc6e] rounded-[8px] px-2 h-[20px] flex items-center shrink-0">
              <span className="font-['Noto_Sans',sans-serif] font-medium text-[10px] text-[#665200] leading-[16px]">{exam.badge}</span>
            </div>
          )}
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1">
            <ArticleIcon />
            <span className="font-['Noto_Sans',sans-serif] font-medium text-[12px] text-[#484848] leading-[16px]">{exam.marks} marks</span>
          </div>
          <div className="flex items-center gap-1">
            <AlarmIcon />
            <span className="font-['Noto_Sans',sans-serif] font-medium text-[12px] text-[#484848] leading-[16px]">{exam.mins} mins</span>
          </div>
        </div>
      </div>
      {/* Description */}
      <p className="font-['Noto_Sans',sans-serif] font-normal text-[14px] text-[#484848] leading-[20px]" style={{ fontVariationSettings: '"CTGR" 0, "wdth" 100' }}>
        {exam.desc}
      </p>
      {/* Footer */}
      <div className="flex items-center justify-between">
        <div className="bg-[#ffdbca] flex items-center gap-2 p-1 pr-2 rounded-[16px]">
          <svg className="size-6 shrink-0" fill="none" viewBox="0 0 24 24">
            <mask id="m-design" maskUnits="userSpaceOnUse" style={{ maskType: "alpha" }} width="24" height="24">
              <rect fill="#D9D9D9" width="24" height="24" />
            </mask>
            <g mask="url(#m-design)">
              <path d={svgMember.p2385f600} fill="#1C1B1F" />
            </g>
          </svg>
          <span className="font-['Noto_Sans',sans-serif] font-medium text-[14px] text-[#310] leading-[20px] whitespace-nowrap">Study materials (11)</span>
          <svg className="size-6 shrink-0" fill="none" viewBox="0 0 24 24">
            <mask id="m-arrow-r" maskUnits="userSpaceOnUse" style={{ maskType: "alpha" }} width="24" height="24">
              <rect fill="#D9D9D9" width="24" height="24" />
            </mask>
            <g mask="url(#m-arrow-r)">
              <path d={svgMember.p20ba9eb0} fill="black" />
            </g>
          </svg>
        </div>
        <svg className="size-5 shrink-0" fill="none" viewBox="0 0 20 20">
          <mask id="m-pdf" maskUnits="userSpaceOnUse" style={{ maskType: "alpha" }} width="20" height="20">
            <rect fill="#D9D9D9" width="20" height="20" />
          </mask>
          <g mask="url(#m-pdf)">
            <path d={svgMember.p5f7a300} fill="black" />
          </g>
        </svg>
      </div>
      {/* Action buttons */}
      <div className="flex gap-2">
        <button className="flex-1 h-12 rounded-[8px] border border-[#c7c7c7] flex items-center justify-center">
          <span className="font-['Noto_Sans',sans-serif] font-medium text-[14px] text-[#484848] leading-[20px]" style={{ fontVariationSettings: '"CTGR" 0, "wdth" 100' }}>প্র্যাকটিস কুইজ</span>
        </button>
        {exam.isLive && (
          <button className="flex-1 h-12 bg-[#1441cc] rounded-[8px] flex items-center justify-center">
            <span className="font-['Noto_Sans',sans-serif] font-medium text-[14px] text-white leading-[20px]" style={{ fontVariationSettings: '"CTGR" 0, "wdth" 100' }}>লাইভ পরীক্ষা দিন</span>
          </button>
        )}
      </div>
    </div>
  );
}

function GoalProgressBar({ value, total }: { value: number; total: number }) {
  const pct = Math.min(100, (value / total) * 100);
  return (
    <div className="relative w-full h-[4px] bg-[#d6e4ff] rounded-[2px]">
      <div className="absolute left-0 top-0 h-full bg-[#1441cc] rounded-[2px]" style={{ width: `${pct}%` }} />
    </div>
  );
}

// ── Screen 5: Activity Log ────────────────────────────────────────────────────

type ActivityType = "announcement" | "member_joined" | "goal" | "member_left" | "member_removed";

interface ActivityItem {
  id: number;
  type: ActivityType;
  title: string;
  body: React.ReactNode;
  date: string;
}

const ACTIVITY_DATA: ActivityItem[] = [
  { id: 1, type: "announcement", title: "New Announcements", body: "Admin has posted a new announcement regarding the upcoming live exam schedule.", date: "24 May 2026" },
  { id: 2, type: "member_joined", title: "New Member Joined!", body: <>Welcome <span className="font-['Noto_Sans',sans-serif] text-black">@JaneDoe</span> to the study group! {"Let's"} help them get started on their preparation.</>, date: "24 May 2026" },
  { id: 3, type: "goal", title: "Goal Achieved!", body: "You've completed your study goal for the week! You have spent 15+ hours reading and attending quizzes. Keep it up!", date: "24 May 2026" },
  { id: 4, type: "member_left", title: "Member Left the Group", body: "@AlexBrown has left the study group.", date: "24 May 2026" },
  { id: 5, type: "member_removed", title: "Member Removed", body: "@JohnDoe has been removed from the group by the admin for violating group rules.", date: "24 May 2026" },
];

const ACTIVITY_FILTERS: { label: string; type: ActivityType | null }[] = [
  { label: "All", type: null },
  { label: "Announcement", type: "announcement" },
  { label: "Goals", type: "goal" },
  { label: "Member Joined", type: "member_joined" },
  { label: "Member Left", type: "member_left" },
  { label: "Member Removed", type: "member_removed" },
];

const ACTIVITY_TITLE_COLOR: Record<ActivityType, string> = {
  announcement: "text-black",
  member_joined: "text-[#1441cc]",
  goal: "text-black",
  member_left: "text-[#d40000]",
  member_removed: "text-[#d40000]",
};

function ActivityIcon({ type }: { type: ActivityType }) {
  if (type === "announcement") {
    return (
      <div className="relative shrink-0 size-[24px]">
        <div className="absolute inset-[20.67%_11.86%_20.99%_11.86%] mask-alpha mask-intersect mask-no-clip mask-no-repeat" style={{ maskImage: `url("${imgCampaign}")`, maskPosition: "-2.847px -4.961px", maskSize: "24px 24px" }}>
          <svg className="absolute block inset-0 size-full" fill="none" height="14" preserveAspectRatio="none" viewBox="0 0 18.3075 14" width="18.3075">
            <path d={svgActivityPaths.p355d9980} fill="black" />
          </svg>
        </div>
      </div>
    );
  }
  if (type === "member_joined") {
    return (
      <div className="relative shrink-0 size-[24px]">
        <div className="absolute inset-[19.55%_5.73%_19.55%_6.25%] mask-alpha mask-intersect mask-no-clip mask-no-repeat" style={{ maskImage: `url("${imgCampaign}")`, maskPosition: "-1.5px -4.692px", maskSize: "24px 24px" }}>
          <svg className="absolute block inset-0 size-full" fill="none" height="14.6155" preserveAspectRatio="none" viewBox="0 0 21.125 14.6155" width="21.125">
            <path d={svgActivityPaths.p31e50200} fill="black" />
          </svg>
        </div>
      </div>
    );
  }
  if (type === "goal") {
    return (
      <div className="relative shrink-0 size-[24px]">
        <div className="absolute inset-[10.34%_6.17%_14.15%_14.03%] mask-alpha mask-intersect mask-no-clip mask-no-repeat" style={{ maskImage: `url("${imgCampaign}")`, maskPosition: "-3.368px -2.483px", maskSize: "24px 24px" }}>
          <svg className="absolute block inset-0 size-full" fill="none" height="18.1201" preserveAspectRatio="none" viewBox="0 0 19.151 18.1201" width="19.151">
            <path d={svgActivityPaths.p1b5ce800} fill="black" />
          </svg>
        </div>
      </div>
    );
  }
  if (type === "member_left") {
    return (
      <div className="relative shrink-0 size-[24px]">
        <div className="absolute inset-[19.55%_10.18%_19.55%_6.25%] mask-alpha mask-intersect mask-no-clip mask-no-repeat" style={{ maskImage: `url("${imgCampaign}")`, maskPosition: "-1.5px -4.692px", maskSize: "24px 24px" }}>
          <svg className="absolute block inset-0 size-full" fill="none" height="14.6155" preserveAspectRatio="none" viewBox="0 0 20.0578 14.6155" width="20.0578">
            <path d={svgActivityPaths.pbb8220} fill="black" />
          </svg>
        </div>
      </div>
    );
  }
  return (
    <div className="relative shrink-0 size-[24px]">
      <div className="absolute inset-[19.55%_6.93%_19.55%_6.25%] mask-alpha mask-intersect mask-no-clip mask-no-repeat" style={{ maskImage: `url("${imgCampaign}")`, maskPosition: "-1.5px -4.692px", maskSize: "24px 24px" }}>
        <svg className="absolute block inset-0 size-full" fill="none" height="14.6155" preserveAspectRatio="none" viewBox="0 0 20.8375 14.6155" width="20.8375">
          <path d={svgActivityPaths.p17805400} fill="black" />
        </svg>
      </div>
    </div>
  );
}

function ActivityLogCard({ item }: { item: ActivityItem }) {
  return (
    <div className="bg-[#f4f6fa] rounded-[12px] w-full p-[12px] flex flex-col gap-[12px]">
      {/* Header */}
      <div className="flex gap-[8px] items-center w-full">
        <ActivityIcon type={item.type} />
        <p className={clsx("flex-1 font-['Noto_Sans',sans-serif] font-medium text-[16px] leading-[24px] min-w-0", ACTIVITY_TITLE_COLOR[item.type])} style={{ fontVariationSettings: '"CTGR" 0, "wdth" 100' }}>
          {item.title}
        </p>
      </div>
      {/* Body */}
      <p className="font-['Noto_Sans',sans-serif] font-normal text-[14px] leading-[20px] text-[#484848] w-full" style={{ fontVariationSettings: '"CTGR" 0, "wdth" 100' }}>
        {item.body}
      </p>
      {/* Date */}
      <p className="font-['Noto_Sans',sans-serif] font-medium text-[10px] leading-[16px] text-[#484848]" style={{ fontVariationSettings: '"CTGR" 0, "wdth" 100' }}>
        {item.date}
      </p>
    </div>
  );
}

function ActivityLogScreen({ onBack }: { onBack: () => void }) {
  const [activeFilter, setActiveFilter] = useState<ActivityType | null>(null);

  const filtered = activeFilter === null
    ? ACTIVITY_DATA
    : ACTIVITY_DATA.filter(a => a.type === activeFilter);

  return (
    <div className="flex flex-col h-full bg-white overflow-hidden">
      {/* App bar */}
      <AppHeader title="Activity log" onBack={onBack} />

      {/* Filter chips */}
      <div className="flex gap-[4px] items-center overflow-x-auto px-[16px] py-[8px] shrink-0" style={{ scrollbarWidth: "none" }}>
        {ACTIVITY_FILTERS.map(({ label, type }) => {
          const isSelected = activeFilter === type;
          return (
            <button
              key={label}
              onClick={() => setActiveFilter(type)}
              className={clsx(
                "h-[32px] rounded-[8px] flex items-center gap-[8px] shrink-0 transition-colors",
                isSelected ? "bg-[#d6e4ff] pl-[8px] pr-[16px]" : "border border-[#c7c7c7] px-[16px]",
              )}
            >
              {isSelected && (
                <div className="overflow-clip relative shrink-0 size-[18px]">
                  <svg className="absolute inset-0 block size-full" fill="none" viewBox="0 0 12.225 9.01875">
                    <path d={svgActivityPaths.p1971e00} fill="black" />
                  </svg>
                </div>
              )}
              <span className={clsx(
                "font-['Noto_Sans',sans-serif] font-medium text-[14px] leading-[20px] whitespace-nowrap",
                isSelected ? "text-black" : "text-[#484848]",
              )} style={{ fontVariationSettings: '"CTGR" 0, "wdth" 100' }}>
                {label}
              </span>
            </button>
          );
        })}
      </div>

      {/* Card list */}
      <div className="flex-1 overflow-y-auto">
        <div className="flex flex-col gap-[8px] px-[16px] pt-[8px] pb-8">
          <AnimatePresence mode="popLayout">
            {filtered.map(item => (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.97 }}
                transition={{ duration: 0.16 }}
              >
                <ActivityLogCard item={item} />
              </motion.div>
            ))}
          </AnimatePresence>
          {filtered.length === 0 && (
            <div className="py-16 text-center">
              <p className="font-['Noto_Sans',sans-serif] text-sm text-[#484848]">No activity for this filter.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function LeaveGroupDialog({
  onLeave,
  onStay,
}: {
  onLeave: () => void;
  onStay: () => void;
}) {
  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/40 px-6">
      <motion.div
        initial={{ scale: 0.92, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.92, opacity: 0 }}
        transition={{ type: "tween", duration: 0.18, ease: "easeOut" }}
        className="w-full bg-[#f4f6fa] rounded-[12px] overflow-hidden"
      >
        {/* Text content */}
        <div className="pt-[12px] px-[12px] flex flex-col gap-[16px]">
          <p className="font-['Noto_Sans',sans-serif] font-normal text-[24px] leading-[32px] text-black" style={{ fontVariationSettings: '"CTGR" 0, "wdth" 100' }}>
            Leave this study group?
          </p>
          <p className="font-['Noto_Sans',sans-serif] font-normal text-[14px] leading-[20px] text-[#484848]" style={{ fontVariationSettings: '"CTGR" 0, "wdth" 100' }}>
            Are you sure you want to leave? You will miss out on daily goals, quizzes, and live updates.
          </p>
        </div>
        {/* Actions */}
        <div className="flex gap-[8px] items-center p-[12px]">
          {/* Leave — text button with red exit icon */}
          <button
            onClick={onLeave}
            className="flex-1 h-[48px] rounded-[8px] flex items-center justify-center gap-[8px]"
          >
            <div className="relative shrink-0 size-[20px]">
              <div
                className="absolute inset-[14.58%] mask-alpha mask-intersect mask-no-clip mask-no-repeat"
                style={{ maskImage: `url("${imgExitToApp}")`, maskPosition: "-3.5px -3.5px", maskSize: "24px 24px" }}
              >
                <svg className="absolute block inset-0 size-full" fill="none" height="14.1667" preserveAspectRatio="none" viewBox="0 0 14.1667 14.1667" width="14.1667">
                  <path d={svgLeavePaths.p16b5a400} fill="#D40000" />
                </svg>
              </div>
            </div>
            <span className="font-['Noto_Sans',sans-serif] font-medium text-[14px] text-[#d40000] leading-[20px]" style={{ fontVariationSettings: '"CTGR" 0, "wdth" 100' }}>
              Leave
            </span>
          </button>
          {/* Stay — filled blue button */}
          <button
            onClick={onStay}
            className="flex-1 h-[48px] bg-[#1441cc] rounded-[8px] flex items-center justify-center"
          >
            <span className="font-['Noto_Sans',sans-serif] font-medium text-[14px] text-white leading-[20px]" style={{ fontVariationSettings: '"CTGR" 0, "wdth" 100' }}>
              Stay
            </span>
          </button>
        </div>
      </motion.div>
    </div>
  );
}

function ReportIssueDialog({ onClose }: { onClose: () => void }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/40 px-6">
      <motion.div
        initial={{ scale: 0.92, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.92, opacity: 0 }}
        transition={{ type: "tween", duration: 0.18, ease: "easeOut" }}
        className="w-full bg-[#f4f6fa] rounded-[12px] overflow-hidden"
      >
        {/* Title + fields */}
        <div className="pt-[12px] px-[12px] flex flex-col gap-[16px]">
          <p className="font-['Noto_Sans',sans-serif] font-normal text-[24px] leading-[32px] text-black" style={{ fontVariationSettings: '"CTGR" 0, "wdth" 100' }}>
            Report an issue
          </p>
          <div className="flex flex-col gap-[16px]">
            {/* Title field */}
            <div className="relative h-[56px]">
              <div className="absolute inset-0 border border-[#787878] rounded-[12px] pointer-events-none" />
              <input
                value={title}
                onChange={e => setTitle(e.target.value)}
                className="absolute inset-0 w-full h-full px-[16px] bg-transparent font-['Noto_Sans',sans-serif] font-medium text-[16px] text-black outline-none rounded-[12px]"
                style={{ fontVariationSettings: '"CTGR" 0, "wdth" 100' }}
              />
              <span className="absolute -top-[10px] left-[12px] bg-[#f4f6fa] px-[4px] font-['Noto_Sans',sans-serif] font-normal text-[12px] text-[#484848] leading-[16px]">
                Title
              </span>
            </div>
            {/* Description field */}
            <div className="relative h-[200px]">
              <div className="absolute inset-0 border border-[#787878] rounded-[12px] pointer-events-none" />
              <textarea
                value={description}
                onChange={e => setDescription(e.target.value)}
                className="absolute inset-0 w-full h-full px-[16px] pt-[12px] bg-transparent font-['Noto_Sans',sans-serif] font-medium text-[16px] text-black outline-none rounded-[12px] resize-none"
                style={{ fontVariationSettings: '"CTGR" 0, "wdth" 100' }}
              />
              <span className="absolute -top-[10px] left-[12px] bg-[#f4f6fa] px-[4px] font-['Noto_Sans',sans-serif] font-normal text-[12px] text-[#484848] leading-[16px]">
                Description
              </span>
            </div>
          </div>
        </div>
        {/* Actions */}
        <div className="flex gap-[8px] items-center p-[12px]">
          <button
            onClick={onClose}
            className="flex-1 h-[48px] rounded-[8px] flex items-center justify-center"
          >
            <span className="font-['Noto_Sans',sans-serif] font-medium text-[14px] text-[#1441cc] leading-[20px]" style={{ fontVariationSettings: '"CTGR" 0, "wdth" 100' }}>
              Cancel
            </span>
          </button>
          <button
            onClick={onClose}
            className="flex-1 h-[48px] bg-[#1441cc] rounded-[8px] flex items-center justify-center"
          >
            <span className="font-['Noto_Sans',sans-serif] font-medium text-[14px] text-white leading-[20px]" style={{ fontVariationSettings: '"CTGR" 0, "wdth" 100' }}>
              Submit
            </span>
          </button>
        </div>
      </motion.div>
    </div>
  );
}

function GroupSettingsSheet({
  onClose,
  onGroupRules,
  onReportIssue,
  onLeaveGroup,
}: {
  onClose: () => void;
  onGroupRules: () => void;
  onReportIssue: () => void;
  onLeaveGroup: () => void;
}) {
  const [notifOn, setNotifOn] = useState(true);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="absolute inset-0 z-50 flex flex-col justify-end bg-black/40"
      onClick={onClose}
    >
      <motion.div
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        exit={{ y: "100%" }}
        transition={{ type: "tween", duration: 0.28, ease: [0.4, 0, 0.2, 1] }}
        className="bg-white rounded-tl-[16px] rounded-tr-[16px] shadow-[0px_4px_8px_3px_rgba(0,0,0,0.15)] flex flex-col overflow-hidden pb-[16px]"
        onClick={e => e.stopPropagation()}
      >
        {/* Drag handle */}
        <div className="flex flex-col items-center p-[16px] shrink-0">
          <div className="bg-[#787878] h-[4px] rounded-[100px] w-[32px]" />
        </div>

        {/* Title */}
        <div className="px-[16px] shrink-0">
          <p className="font-['Noto_Sans',sans-serif] font-normal text-[18px] leading-[28px] text-black" style={{ fontVariationSettings: '"CTGR" 0, "wdth" 100' }}>
            Group Settings
          </p>
        </div>

        <div className="flex flex-col gap-[16px] mt-[24px]">
          {/* Top action rows */}
          <div className="flex flex-col w-full">
            {/* Group rules */}
            <button
              onClick={() => { onClose(); setTimeout(onGroupRules, 50); }}
              className="bg-white h-[56px] min-h-[56px] w-full flex items-center px-[16px] gap-[16px] active:bg-gray-50 transition-colors"
            >
              <div className="relative shrink-0 size-[24px]">
                <div
                  className="absolute inset-[13.72%_11.08%_13.54%_16.91%] mask-alpha mask-intersect mask-no-clip mask-no-repeat"
                  style={{ maskImage: `url("${imgBottomSheetMask}")`, maskPosition: "-4.058px -3.293px", maskSize: "24px 24px" }}
                >
                  <svg className="absolute block inset-0 size-full" fill="none" height="17.457" preserveAspectRatio="none" viewBox="0 0 17.2819 17.457" width="17.2819">
                    <path d={svgBottomSheetPaths.p1fc45e00} fill="black" />
                  </svg>
                </div>
              </div>
              <span className="font-['Noto_Sans',sans-serif] font-medium text-[16px] text-black leading-[24px]" style={{ fontVariationSettings: '"CTGR" 0, "wdth" 100' }}>Group rules</span>
            </button>

            {/* Report issue */}
            <button
              onClick={() => { onClose(); setTimeout(onReportIssue, 50); }}
              className="bg-white h-[56px] min-h-[56px] w-full flex items-center px-[16px] gap-[16px] active:bg-gray-50 transition-colors"
            >
              <div className="relative shrink-0 size-[24px]">
                <div
                  className="absolute inset-[14.58%] mask-alpha mask-intersect mask-no-clip mask-no-repeat"
                  style={{ maskImage: `url("${imgBottomSheetMask}")`, maskPosition: "-3.5px -3.5px", maskSize: "24px 24px" }}
                >
                  <svg className="absolute block inset-0 size-full" fill="none" height="17" preserveAspectRatio="none" viewBox="0 0 17 17" width="17">
                    <path d={svgBottomSheetPaths.pde3b180} fill="black" />
                  </svg>
                </div>
              </div>
              <span className="font-['Noto_Sans',sans-serif] font-medium text-[16px] text-black leading-[24px]" style={{ fontVariationSettings: '"CTGR" 0, "wdth" 100' }}>Report issue</span>
            </button>
          </div>

          {/* Divider */}
          <div className="px-[16px]"><div className="h-px bg-[#C7C5CE]" /></div>

          {/* Group notification toggle */}
          <div className="bg-white h-[56px] min-h-[56px] w-full flex items-center px-[16px] gap-[16px]">
            <div className="relative shrink-0 size-[24px]">
              <div
                className="absolute inset-[10.42%_18.75%_9.62%_18.75%] mask-alpha mask-intersect mask-no-clip mask-no-repeat"
                style={{ maskImage: `url("${imgBottomSheetMask}")`, maskPosition: "-4.5px -2.5px", maskSize: "24px 24px" }}
              >
                <svg className="absolute block inset-0 size-full" fill="none" height="19.1923" preserveAspectRatio="none" viewBox="0 0 15 19.1923" width="15">
                  <path d={svgBottomSheetPaths.p3b858e00} fill="#484848" />
                </svg>
              </div>
            </div>
            <span className="flex-1 font-['Noto_Sans',sans-serif] font-medium text-[16px] text-black leading-[24px]" style={{ fontVariationSettings: '"CTGR" 0, "wdth" 100' }}>Group notification</span>
            <button
              onClick={() => setNotifOn(v => !v)}
              className={clsx(
                "relative h-[32px] w-[52px] rounded-[100px] transition-colors duration-200 shrink-0",
                notifOn ? "bg-[#1441cc]" : "bg-[#787878]"
              )}
            >
              <motion.div
                className="absolute top-[2px] bg-white rounded-full size-[28px] shadow-sm"
                animate={{ left: notifOn ? "22px" : "2px" }}
                transition={{ type: "tween", duration: 0.18 }}
              />
            </button>
          </div>

          {/* Divider */}
          <div className="px-[16px]"><div className="h-px bg-[#C7C5CE]" /></div>

          {/* Leave group */}
          <button
            onClick={() => { onClose(); setTimeout(onLeaveGroup, 300); }}
            className="bg-white h-[56px] min-h-[56px] w-full flex items-center px-[16px] gap-[16px] active:bg-gray-50 transition-colors"
          >
            <span className="flex-1 font-['Noto_Sans',sans-serif] font-medium text-[16px] text-[#d40000] leading-[24px] text-left" style={{ fontVariationSettings: '"CTGR" 0, "wdth" 100' }}>Leave group</span>
            <div className="relative shrink-0 size-[24px]">
              <div
                className="absolute inset-[14.58%] mask-alpha mask-intersect mask-no-clip mask-no-repeat"
                style={{ maskImage: `url("${imgBottomSheetMask}")`, maskPosition: "-3.5px -3.5px", maskSize: "24px 24px" }}
              >
                <svg className="absolute block inset-0 size-full" fill="none" height="17" preserveAspectRatio="none" viewBox="0 0 17 17" width="17">
                  <path d={svgBottomSheetPaths.p1359ea00} fill="#D40000" />
                </svg>
              </div>
            </div>
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

function GroupMemberScreen({ group, onBack, onActivityLog, onRank, onMembers, onSubgroups, onTodayGoal, onMonthlyGoal, onDiscussion, onFacebookGroup, onSelectExam, onSelectQuickLink, onViewGroupRules, onLeaveGroup, announcement }: { group: Group; onBack: () => void; onActivityLog: () => void; onRank: () => void; onMembers: () => void; onSubgroups: () => void; onTodayGoal: () => void; onMonthlyGoal: () => void; onDiscussion: () => void; onFacebookGroup: () => void; onSelectExam: (examName: string, isLive: boolean) => void; onSelectQuickLink: (link: QuickLink) => void; onViewGroupRules: () => void; onLeaveGroup: () => void; announcement: { title: string; body: string; date: string } }) {
  const [showSettings, setShowSettings] = useState(false);
  const [showReport, setShowReport] = useState(false);
  const [showLeaveConfirm, setShowLeaveConfirm] = useState(false);
  const [showExamsInfo, setShowExamsInfo] = useState(false);
  const [showAdminDetails, setShowAdminDetails] = useState(false);

  return (
    <div className="flex flex-col h-full bg-white overflow-hidden relative">
      <AnimatePresence>
        {showSettings && (
          <GroupSettingsSheet
            key="settings"
            onClose={() => setShowSettings(false)}
            onGroupRules={() => { setShowSettings(false); onViewGroupRules(); }}
            onReportIssue={() => setShowReport(true)}
            onLeaveGroup={() => setShowLeaveConfirm(true)}
          />
        )}
        {showReport && (
          <ReportIssueDialog key="report" onClose={() => setShowReport(false)} />
        )}
        {showLeaveConfirm && (
          <LeaveGroupDialog
            key="leave"
            onLeave={onLeaveGroup}
            onStay={() => setShowLeaveConfirm(false)}
          />
        )}
        {showExamsInfo && (
          <MandatoryExamsInfoBottomSheet key="examsInfo" onClose={() => setShowExamsInfo(false)} />
        )}
        {showAdminDetails && (
          <AdminDetailsBottomSheet
            key="adminDetails"
            name={group.admin}
            rating={group.adminRating}
            since={group.createdDate}
            onClose={() => setShowAdminDetails(false)}
          />
        )}
      </AnimatePresence>

      {/* App bar */}
      <div className="bg-white shrink-0">
        <div className="flex items-center justify-between px-1 h-12">
          <button
            onClick={onBack}
            className="size-12 flex items-center justify-center rounded-full active:bg-gray-100 transition-colors"
          >
            <ArrowLeft className="size-6 text-[#484848]" strokeWidth={2} />
          </button>
          <p className="absolute left-14 right-14 font-['Noto_Sans',sans-serif] text-[18px] font-normal text-black leading-7 truncate pointer-events-none">
            Study Group
          </p>
          <button
            onClick={() => setShowSettings(true)}
            aria-label="Group settings"
            className="size-12 flex items-center justify-center rounded-full active:bg-gray-100 transition-colors"
          >
            <svg className="size-6" fill="none" viewBox="0 0 24 24">
              <mask id="m-more" maskUnits="userSpaceOnUse" style={{ maskType: "alpha" }} width="24" height="24">
                <rect fill="#D9D9D9" width="24" height="24" />
              </mask>
              <g mask="url(#m-more)">
                <path d={svgMember.p2a1bd980} fill="#484848" />
              </g>
            </svg>
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {/* Announcement banner */}
        <div className="bg-[#ffa366] px-4 py-3 flex flex-col gap-3">
          <div className="flex items-center gap-3">
            <svg className="size-6 shrink-0" fill="none" viewBox="0 0 20 16">
              <path d={svgMember.p355d9980} fill="black" />
            </svg>
            <span className="flex-1 font-['Noto_Sans',sans-serif] font-medium text-[16px] text-black leading-[24px]" style={{ fontVariationSettings: '"CTGR" 0, "wdth" 100' }}>
              {announcement.title}
            </span>
          </div>
          <p className="font-['Noto_Sans',sans-serif] font-normal text-[14px] text-black leading-[20px]" style={{ fontVariationSettings: '"CTGR" 0, "wdth" 100' }}>
            {announcement.body}
          </p>
          <p className="font-['Noto_Sans',sans-serif] font-medium text-[10px] text-[#78360b] leading-[16px]" style={{ fontVariationSettings: '"CTGR" 0, "wdth" 100' }}>
            {announcement.date}
          </p>
        </div>

        {/* Group info card */}
        <div className="flex flex-col gap-4 px-4 py-4">
          <div className="flex gap-3 items-start">
            <GroupAvatar size={60} />
            <div className="flex-1 min-w-0 flex flex-col gap-2">
              <p className="font-['Noto_Sans',sans-serif] font-medium text-[16px] text-black leading-[24px]">{group.name}</p>
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2">
                  <div className="bg-[#eaeef6] rounded-[4px] px-2 h-5 flex items-center">
                    <span className="font-['Noto_Sans',sans-serif] text-[10px] font-medium text-[#484848]">{group.category}</span>
                  </div>
                  <span className="font-['Noto_Sans',sans-serif] text-[12px] text-[#484848]">Created: {group.createdDate}</span>
                </div>
                <button onClick={() => setShowAdminDetails(true)} className="flex items-center gap-1 active:opacity-70 transition-opacity">
                  <span className="font-['Noto_Sans',sans-serif] font-medium text-[12px] text-[#484848]">Admin: {group.admin}</span>
                  <Info className="size-[18px] text-[#484848]" strokeWidth={1.5} />
                </button>
              </div>
              <div className="flex items-center gap-4">
                <button onClick={onRank} className="text-left active:opacity-60 transition-opacity">
                  <p className="font-['Noto_Sans',sans-serif] font-semibold text-[12px] text-black leading-[16px]">{group.rank}</p>
                  <p className="font-['Noto_Sans',sans-serif] text-[12px] text-black leading-[16px]">Rank</p>
                </button>
                <span className="text-[#484848] text-[12px]">›</span>
                <button onClick={onMembers} className="text-left active:opacity-60 transition-opacity">
                  <p className="font-['Noto_Sans',sans-serif] font-semibold text-[12px] text-black leading-[16px]">{group.members}</p>
                  <p className="font-['Noto_Sans',sans-serif] text-[12px] text-black leading-[16px]">Members</p>
                </button>
                <span className="text-[#484848] text-[12px]">›</span>
                <button onClick={onSubgroups} className="text-left active:opacity-60 transition-opacity">
                  <p className="font-['Noto_Sans',sans-serif] font-semibold text-[12px] text-black leading-[16px]">{group.subgroups}</p>
                  <p className="font-['Noto_Sans',sans-serif] text-[12px] text-black leading-[16px]">Subgroups</p>
                </button>
                <span className="text-[#484848] text-[12px]">›</span>
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex gap-2">
            <button
              onClick={onDiscussion}
              className="flex-1 h-12 bg-[#1441cc] rounded-full flex items-center justify-center gap-2 active:opacity-90 transition-opacity"
            >
              <svg className="size-5" fill="none" viewBox="0 0 20 9">
                <path d={svgMember.p28639a00} fill="white" />
              </svg>
              <span className="font-['Noto_Sans',sans-serif] font-medium text-[14px] text-white leading-[20px]">Discussion</span>
            </button>
            <button
              onClick={onFacebookGroup}
              className="flex-1 h-12 rounded-full border border-[#c7c7c7] flex items-center justify-center gap-2 active:bg-gray-50 transition-colors"
            >
              <svg className="size-5 shrink-0" fill="none" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <circle cx="10" cy="10" r="10" fill="#0866FF" />
                <path d="M13.25 12.75l.4-2.6H11.1V8.5c0-.71.348-1.4 1.464-1.4H13.8V4.8s-1.216-.208-2.378-.208c-2.428 0-4.014 1.472-4.014 4.136V10.15H5v2.6h2.408V19.9A10.06 10.06 0 0010 20.0a10.06 10.06 0 002.592-.338V12.75H13.25z" fill="white" />
              </svg>
              <span className="font-['Noto_Sans',sans-serif] font-medium text-[14px] text-[#484848] leading-[20px]">Facebook Group</span>
            </button>
          </div>
        </div>

        {/* Group activities */}
        <div className="flex flex-col gap-4 pb-4">
          <div className="flex items-center justify-between px-4">
            <span className="font-['Noto_Sans',sans-serif] font-medium text-[16px] text-black tracking-[0.15px]" style={{ fontVariationSettings: '"CTGR" 0, "wdth" 100' }}>
              Group activities
            </span>
            <button onClick={onActivityLog} className="flex items-center gap-2 px-4 py-2 rounded-full active:opacity-70 transition-opacity">
              <svg className="size-5" fill="none" viewBox="0 0 14 15">
                <path d={svgMember.p267221f0} fill="#1441CC" />
              </svg>
              <span className="font-['Noto_Sans',sans-serif] font-medium text-[14px] text-[#1441cc] leading-[20px]">Activity log</span>
            </button>
          </div>

          {/* Goal cards */}
          <div className="flex gap-2 px-4">
            {/* Today's Goal */}
            <button
              onClick={onTodayGoal}
              className="flex-1 bg-white rounded-[12px] border border-[#e3e3e3] p-2 flex flex-col gap-3 text-left active:opacity-70 transition-opacity"
            >
              <div className="flex items-center justify-between">
                <span className="font-['Noto_Sans',sans-serif] font-medium text-[12px] text-[#484848] leading-[16px]">Today's Goal</span>
                <ChevronDown className="size-5 text-[#787878] -rotate-90" strokeWidth={2} />
              </div>
              <div className="flex flex-col gap-1">
                <span className="font-['Noto_Sans',sans-serif] font-medium text-[12px] text-black leading-[16px]">188 / 438</span>
                <GoalProgressBar value={188} total={438} />
              </div>
              <div className="flex items-center justify-between">
                <span className="font-['Noto_Sans',sans-serif] font-normal text-[12px] text-[#484848] leading-[16px]">Today's Attendance</span>
                <span className="font-['Noto_Sans',sans-serif] font-normal text-[12px] text-black leading-[16px]">50%</span>
              </div>
            </button>
            {/* Monthly Goal */}
            <button
              onClick={onMonthlyGoal}
              className="flex-1 bg-white rounded-[12px] border border-[#e3e3e3] p-2 flex flex-col gap-3 text-left active:opacity-70 transition-opacity"
            >
              <div className="flex items-center justify-between">
                <span className="font-['Noto_Sans',sans-serif] font-medium text-[12px] text-[#484848] leading-[16px]">Monthly Goal</span>
                <ChevronDown className="size-5 text-[#787878] -rotate-90" strokeWidth={2} />
              </div>
              <div className="flex flex-col gap-1">
                <span className="font-['Noto_Sans',sans-serif] font-medium text-[12px] text-black leading-[16px]">188 / 438</span>
                <GoalProgressBar value={188} total={438} />
              </div>
              <div className="flex items-center justify-between">
                <span className="font-['Noto_Sans',sans-serif] font-normal text-[12px] text-[#484848] leading-[16px]">Monthly Attendance</span>
                <span className="font-['Noto_Sans',sans-serif] font-normal text-[12px] text-black leading-[16px]">50%</span>
              </div>
            </button>
          </div>
        </div>

        {/* Today's activities */}
        <div className="flex flex-col gap-4 px-4 pb-4">
          <div className="flex items-center justify-between">
            <span className="font-['Noto_Sans',sans-serif] font-medium text-[16px] text-black tracking-[0.15px]">Today's activities</span>
            <div className="flex items-center gap-1">
              <TimerIcon />
              <span className="font-['Noto_Sans',sans-serif] font-normal text-[12px] text-[#484848] leading-[16px]">23h 59m 24s</span>
            </div>
          </div>
          <div className="flex flex-col gap-3">
            {MEMBER_EXAMS.map((exam, i) => <ActivityCard key={i} exam={exam} />)}
          </div>
        </div>

        {/* Bottom tiles */}
        <div className="px-4 pb-4">
          <ExamQuickLinks onSelect={onSelectQuickLink} />
        </div>

        {/* Mandatory exams */}
        <div className="px-4 pb-8">
          <div className="flex items-center justify-between mb-3">
            <span className="font-['Noto_Sans',sans-serif] font-medium text-[16px] text-black tracking-[0.15px]" style={{ fontVariationSettings: '"CTGR" 0, "wdth" 100' }}>
              বাধ্যতামূলক পরীক্ষাসমূহ
            </span>
            <button
              onClick={() => setShowExamsInfo(true)}
              className="size-6 flex items-center justify-center shrink-0"
            >
              <Info className="size-[19px] text-[#484848]" strokeWidth={1.75} />
            </button>
          </div>
          <div className="flex flex-col gap-1">
            {MANDATORY_EXAMS.map((exam, i) => (
              <button
                key={i}
                onClick={() => onSelectExam(exam.name, exam.isLive)}
                className="h-12 bg-[#f4f6fa] rounded-[8px] flex items-center px-4 gap-2 text-left active:opacity-70 transition-opacity"
              >
                <span className="flex-1 font-['Noto_Sans',sans-serif] font-medium text-[14px] text-black leading-[20px] truncate" style={{ fontVariationSettings: '"CTGR" 0, "wdth" 100' }}>
                  {exam.name}
                </span>
                {exam.isLive && (
                  <div className="bg-red-500 flex items-center gap-1 px-2 rounded-[8px] shrink-0">
                    <div className="size-[6px] rounded-full bg-white" />
                    <span className="font-['Noto_Sans',sans-serif] font-medium text-[10px] text-white leading-[16px]">Live</span>
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function RatingBadge({ letter, size = 20 }: { letter: string; size?: number }) {
  return (
    <div className="relative shrink-0" style={{ width: size, height: size }}>
      <svg className="absolute inset-0 size-full" fill="none" viewBox="0 0 20 20">
        <circle cx="10" cy="10" r="9.5" stroke="#484848" />
      </svg>
      <span className="absolute inset-0 flex items-center justify-center font-['Noto_Sans',sans-serif] font-medium text-[14px] text-[#484848] leading-none">{letter}</span>
    </div>
  );
}


// Header that swaps between a normal title bar and an inline search field, e.g. the
// "Joining requests" and "Group members" admin lists. `onExit` clears the query and
// returns to the title bar.
function InlineSearchHeader({
  title,
  onBack,
  searching,
  onStartSearch,
  query,
  onQueryChange,
  onExit,
  placeholder,
  trailing,
}: {
  title: string;
  onBack: () => void;
  searching: boolean;
  onStartSearch: () => void;
  query: string;
  onQueryChange: (v: string) => void;
  onExit: () => void;
  placeholder: string;
  trailing?: React.ReactNode;
}) {
  if (!searching) {
    return (
      <div className="relative flex items-center justify-between px-1 h-12 bg-white shrink-0">
        <button
          onClick={onBack}
          className="size-12 flex items-center justify-center rounded-full hover:bg-gray-100 active:bg-gray-200 transition-colors shrink-0"
        >
          <ArrowLeft className="size-6 text-[#484848]" strokeWidth={2} />
        </button>
        <p className="absolute left-14 right-[104px] font-['Noto_Sans',sans-serif] text-[18px] font-normal text-black leading-7 truncate">
          {title}
        </p>
        <div className="flex items-center shrink-0">
          <button
            onClick={onStartSearch}
            className="size-12 flex items-center justify-center rounded-full active:bg-gray-100 transition-colors"
          >
            <Search className="size-6 text-[#484848]" strokeWidth={1.5} />
          </button>
          {trailing}
        </div>
      </div>
    );
  }
  return (
    <div className="shrink-0 border-b border-[#c7c5ce]">
      <div className="flex items-center gap-1 px-1">
        <button
          onClick={onExit}
          className="size-12 flex items-center justify-center rounded-full active:bg-gray-100 transition-colors shrink-0"
        >
          <ArrowLeft className="size-6 text-[#484848]" strokeWidth={2} />
        </button>
        <input
          autoFocus
          value={query}
          onChange={e => onQueryChange(e.target.value)}
          placeholder={placeholder}
          className="flex-1 h-12 bg-transparent outline-none font-['Noto_Sans',sans-serif] font-medium text-[16px] text-black placeholder:text-[#787878] placeholder:font-normal"
        />
        {query && (
          <button
            onClick={() => onQueryChange("")}
            aria-label="Clear"
            className="size-12 flex items-center justify-center rounded-full active:bg-gray-100 transition-colors shrink-0"
          >
            <X className="size-6 text-[#484848]" strokeWidth={1.5} />
          </button>
        )}
      </div>
    </div>
  );
}


const GROUP_POINTS_FORMULA_TEXT = `👉 গ্রুপের অর্জিত পয়েন্টের (TGS) ওপরই অ্যাডমিনদের সম্মানীর হার নির্ভর করে — তাই গ্রুপ পয়েন্টস স্কোরিং সিস্টেমও আগের চেয়ে উন্নত করা হয়েছে

👉 নতুন গ্রুপ পয়েন্টস সিস্টেম এখন থেকে Quality + Quantity এর সমন্বয়ে হবে, যেখানে— TGS = 60% Quality + 40% Quantity

যেভাবে গ্রুপ স্কোর হিসাব করা হবে:

প্রথমে গ্রুপের মোট activity (Members × Exams × Attendance%) হিসাব করা হবে
⬇️
সবচেয়ে সক্রিয় গ্রুপের মোট অ্যাক্টিভিটির সঙ্গে আপনার গ্রুপের মোট অ্যাক্টিভিটি তুলনা করে Quantity Score (0-100) বের করা হবে
⬇️
Attendance % ও Admin Rating % যোগ করে Quality Score (0-100) বের করা হবে
⬇️
ফর্মুলা অনুযায়ী মোট গ্রুপ স্কোর (TGS)-কে ১৫ দ্বারা গুণ করে এডমিনের মাসিক সম্মানী পাওয়া যাবে

📐 Total Group Score (TGS) নির্ণয়ের গাণিতিক ফর্মুলা:

TGS = {0.6 × (0.8A + 0.2R)} + [0.4 × {M × E × (A /100) / MaxTA} × 100]

যেখানে,
M = Member Count
E = Number of Exams Assigned`;

function GroupPointsFormulaSheet({ onClose }: { onClose: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="absolute inset-0 z-50 flex flex-col justify-end bg-black/40"
      onClick={onClose}
    >
      <motion.div
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        exit={{ y: "100%" }}
        transition={{ type: "tween", duration: 0.28, ease: [0.4, 0, 0.2, 1] }}
        className="bg-white rounded-tl-[16px] rounded-tr-[16px] shadow-[0px_4px_8px_3px_rgba(0,0,0,0.15)] flex flex-col overflow-hidden max-h-[85%]"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex flex-col items-center p-[16px] shrink-0">
          <div className="bg-[#787878] h-[4px] rounded-[100px] w-[32px]" />
        </div>

        <div className="px-[16px] shrink-0">
          <p className="font-['Noto_Sans',sans-serif] font-normal text-[18px] leading-[28px] text-black" style={{ fontVariationSettings: '"CTGR" 0, "wdth" 100' }}>
            গ্রুপ পয়েন্টস নির্ধারণের ফর্মুলা
          </p>
        </div>

        <div className="border-t border-[#e3e3e3] mt-[16px]" />

        <div className="flex-1 overflow-y-auto">
          <div className="bg-white px-[16px] py-[16px]">
            <p className="font-['Noto_Sans',sans-serif] font-normal text-[14px] leading-[20px] text-[#484848] whitespace-pre-wrap" style={{ fontVariationSettings: '"CTGR" 0, "wdth" 100' }}>
              {GROUP_POINTS_FORMULA_TEXT}
            </p>
          </div>
        </div>

        <div className="shrink-0 p-[12px]">
          <button
            onClick={onClose}
            className="w-full h-[56px] rounded-[100px] border border-[#c7c7c7] flex items-center justify-center"
          >
            <span className="font-['Noto_Sans',sans-serif] font-medium text-[16px] leading-[24px] tracking-[0.15px] text-[#484848]" style={{ fontVariationSettings: '"CTGR" 0, "wdth" 100' }}>
              Close
            </span>
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
// ── Screen: Exam Page ─────────────────────────────────────────────────────────

function ExamPageScreen({
  examName,
  isLive,
  examList,
  onBack,
  onSelectQuickLink,
}: {
  examName: string;
  isLive: boolean;
  examList: Array<{ name: string; isLive: boolean }>;
  onBack: () => void;
  onSelectQuickLink: (link: QuickLink) => void;
}) {
  // No live exam here? Fall back to previewing the next exam in the same list instead of leaving the page empty.
  const currentIndex = examList.findIndex(e => e.name === examName);
  const nextExam = !isLive && currentIndex !== -1 && examList.length > 1
    ? examList[(currentIndex + 1) % examList.length]
    : undefined;

  const cardExam = isLive
    ? { title: examName, marks: 60, mins: 30, isLive: true, desc: "আজকের লাইভ পরীক্ষায় অংশগ্রহণ করে নিজের প্রস্তুতি যাচাই করুন।" }
    : nextExam
      // Always non-live here — this is just a preview of what's coming up, not an invitation to join a live session.
      ? { title: nextExam.name, marks: 60, mins: 30, isLive: false, desc: "পরবর্তী পরীক্ষার জন্য প্রস্তুতি নিন।" }
      : undefined;

  return (
    <div className="flex flex-col h-full bg-white overflow-hidden">
      <AppHeader title={examName} onBack={onBack} />

      <div className="flex-1 overflow-y-auto">
        <div className="flex flex-col gap-4 px-4 pt-4 pb-8">
          {cardExam && (
            <div className="flex flex-col gap-2">
              {!isLive && (
                <span className="font-['Noto_Sans',sans-serif] font-medium text-[14px] text-black leading-[20px]">
                  Next exam
                </span>
              )}
              <ActivityCard exam={cardExam} />
            </div>
          )}
          <ExamQuickLinks onSelect={onSelectQuickLink} />
        </div>
      </div>
    </div>
  );
}

// ── Screen: Discussion ────────────────────────────────────────────────────────

const DISCUSSION_POSTS = [
  {
    id: 1,
    name: "Subroto Howlader",
    time: "2h",
    text: "আগামীকাল রাত ৮টায় বাংলাদেশ বিষয়াবলীর উপর লাইভ ক্লাস হবে। সবাই সময়মতো যোগ দেওয়ার চেষ্টা করবেন।",
    likes: 24,
    comments: 6,
  },
  {
    id: 2,
    name: "Shajenur khatun",
    time: "5h",
    text: "কারো কাছে গত সপ্তাহের মডেল টেস্টের প্রশ্নের ব্যাখ্যা আছে? ৩ নম্বর প্রশ্নটা বুঝতে পারছি না।",
    likes: 8,
    comments: 12,
  },
  {
    id: 3,
    name: "Hridoy Hasan",
    time: "1d",
    text: "এই মাসের টপ ১০-এ থাকার জন্য সবাইকে অভিনন্দন! পরবর্তী মাসেও এই ধারা অব্যাহত রাখি। 🎉",
    likes: 41,
    comments: 5,
  },
  {
    id: 4,
    name: "অর্থহীন জীবন",
    time: "2d",
    text: "নতুন সিলেবাস অনুযায়ী পড়ার রুটিন কি কেউ শেয়ার করতে পারবেন?",
    likes: 15,
    comments: 9,
  },
];

function DiscussionScreen({ onBack }: { onBack: () => void }) {
  const ns = { fontVariationSettings: '"CTGR" 0, "wdth" 100' };
  const [draft, setDraft] = useState("");

  return (
    <div className="flex flex-col h-full bg-white overflow-hidden">
      <AppHeader title="Discussion" onBack={onBack} />

      <div className="flex-1 overflow-y-auto">
        <div className="flex flex-col gap-3 px-4 pt-4 pb-4">
          {DISCUSSION_POSTS.map(post => (
            <div key={post.id} className="bg-[#f4f6fa] rounded-[12px] p-3 flex flex-col gap-3">
              {/* Header */}
              <div className="flex items-center gap-2">
                <MemberAvatar size={36} name={post.name} />
                <div className="flex-1 min-w-0">
                  <p className="font-['Noto_Sans',sans-serif] font-medium text-[14px] text-black leading-[20px] truncate" style={ns}>
                    {post.name}
                  </p>
                  <p className="font-['Noto_Sans',sans-serif] font-normal text-[12px] text-[#787878] leading-[16px]" style={ns}>
                    {post.time} ago
                  </p>
                </div>
              </div>

              {/* Body */}
              <p className="font-['Noto_Sans',sans-serif] font-normal text-[14px] text-[#484848] leading-[20px]" style={ns}>
                {post.text}
              </p>

              {/* Footer */}
              <div className="flex items-center gap-4 pt-1 border-t border-[#e3e3e3]">
                <button className="flex items-center gap-1 pt-2 active:opacity-70 transition-opacity">
                  <ThumbsUp className="size-4 text-[#484848]" strokeWidth={1.75} />
                  <span className="font-['Noto_Sans',sans-serif] font-medium text-[12px] text-[#484848] leading-[16px]" style={ns}>
                    {post.likes}
                  </span>
                </button>
                <button className="flex items-center gap-1 pt-2 active:opacity-70 transition-opacity">
                  <MessageCircle className="size-4 text-[#484848]" strokeWidth={1.75} />
                  <span className="font-['Noto_Sans',sans-serif] font-medium text-[12px] text-[#484848] leading-[16px]" style={ns}>
                    {post.comments}
                  </span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Composer */}
      <div className="shrink-0 border-t border-[#e3e3e3] px-3 py-2 flex items-center gap-2">
        <input
          value={draft}
          onChange={e => setDraft(e.target.value)}
          placeholder="Write something to the group..."
          className="flex-1 h-11 rounded-full bg-[#f4f6fa] px-4 font-['Noto_Sans',sans-serif] text-[14px] text-black outline-none"
          style={ns}
        />
        <button
          onClick={() => setDraft("")}
          disabled={!draft.trim()}
          className={clsx(
            "size-11 rounded-full flex items-center justify-center shrink-0 transition-opacity",
            draft.trim() ? "bg-[#1441cc] active:opacity-90" : "bg-[#1441cc] opacity-40",
          )}
        >
          <Send className="size-5 text-white" strokeWidth={2} />
        </button>
      </div>
    </div>
  );
}

// ── Screen: Facebook Group ────────────────────────────────────────────────────

const FB_POSTS = [
  {
    id: 1,
    name: "The Winner — Admin",
    time: "3h · Public group",
    text: "🎯 আগামী রবিবার থেকে নতুন ব্যাচের রুটিন শুরু হচ্ছে। পিন করা পোস্টে বিস্তারিত দেখুন।",
    likes: 132,
    comments: 28,
    shares: 6,
  },
  {
    id: 2,
    name: "©️Chonchol Ray ©️©️©️©️",
    time: "9h · Public group",
    text: "আজকের লাইভ MCQ পরীক্ষায় অংশগ্রহণের জন্য সবাইকে ধন্যবাদ। ফলাফল রাত ৯টায় প্রকাশ করা হবে।",
    likes: 76,
    comments: 14,
    shares: 2,
  },
  {
    id: 3,
    name: "Anik Mahmud",
    time: "1d · Public group",
    text: "গ্রুপের সবাই কি টেলিগ্রাম চ্যানেলে যুক্ত হয়েছেন? না হলে এখনই যুক্ত হয়ে নিন, গুরুত্বপূর্ণ পিডিএফ শেয়ার করা হয়।",
    likes: 54,
    comments: 9,
    shares: 3,
  },
];

function FacebookGroupScreen({ group, onBack }: { group: Group; onBack: () => void }) {
  const ns = { fontVariationSettings: '"CTGR" 0, "wdth" 100' };
  const avatarStackCount = 4;

  return (
    <div className="flex flex-col h-full bg-white overflow-hidden">
      {/* App bar */}
      <div className="shrink-0 flex items-center justify-between px-1 h-12 bg-white">
        <button
          onClick={onBack}
          className="size-12 flex items-center justify-center rounded-full active:bg-gray-100 transition-colors"
        >
          <ArrowLeft className="size-6 text-[#484848]" strokeWidth={2} />
        </button>
        <p className="absolute left-14 right-14 font-['Noto_Sans',sans-serif] text-[18px] font-normal text-black leading-7 truncate text-center" style={ns}>
          Facebook Group
        </p>
        <button className="size-12 flex items-center justify-center rounded-full active:bg-gray-100 transition-colors">
          <MoreHorizontal className="size-5 text-[#484848]" strokeWidth={1.75} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto">
        {/* Cover */}
        <div className="relative h-[110px] bg-gradient-to-br from-[#0866FF] to-[#0a3ea1] shrink-0">
          <div className="absolute -bottom-7 left-4 size-[72px] rounded-full ring-4 ring-white overflow-hidden bg-white">
            <GroupAvatar size={72} />
          </div>
        </div>

        {/* Group info */}
        <div className="pt-9 px-4 flex flex-col gap-3">
          <div className="flex flex-col gap-1">
            <p className="font-['Noto_Sans',sans-serif] font-medium text-[18px] text-black leading-[26px]" style={ns}>
              {group.name} — Official Group
            </p>
            <div className="flex items-center gap-1">
              <Globe className="size-3.5 text-[#787878]" strokeWidth={2} />
              <span className="font-['Noto_Sans',sans-serif] font-normal text-[12px] text-[#787878] leading-[16px]" style={ns}>
                Public group · {(group.members * 19).toLocaleString()} members
              </span>
            </div>
          </div>

          {/* Avatar stack */}
          <div className="flex items-center gap-2">
            <div className="flex items-center">
              {Array.from({ length: avatarStackCount }, (_, i) => (
                <MemberAvatar key={i} size={24} className="ring-2 ring-white" style={{ marginLeft: i === 0 ? 0 : -8 }} />
              ))}
            </div>
            <span className="font-['Noto_Sans',sans-serif] font-normal text-[12px] text-[#787878] leading-[16px]" style={ns}>
              Joined by {group.admin} and {group.members} others
            </span>
          </div>

          {/* Actions */}
          <div className="flex gap-2 pb-3">
            <button className="flex-1 h-10 bg-[#eaeef6] rounded-[8px] flex items-center justify-center gap-2 active:opacity-80 transition-opacity">
              <Check className="size-4 text-black" strokeWidth={2} />
              <span className="font-['Noto_Sans',sans-serif] font-medium text-[14px] text-black leading-[20px]" style={ns}>Joined</span>
            </button>
            <button className="flex-1 h-10 bg-[#eaeef6] rounded-[8px] flex items-center justify-center gap-2 active:opacity-80 transition-opacity">
              <Share2 className="size-4 text-black" strokeWidth={2} />
              <span className="font-['Noto_Sans',sans-serif] font-medium text-[14px] text-black leading-[20px]" style={ns}>Share</span>
            </button>
          </div>
        </div>

        <div className="h-2 bg-[#f0f2f5]" />

        {/* Composer prompt */}
        <div className="px-4 py-3 flex items-center gap-2 border-b border-[#e3e3e3]">
          <img src={imgMemberIcon} alt="" className="size-9 rounded-full shrink-0 object-cover" />
          <div className="flex-1 h-9 rounded-full bg-[#f0f2f5] flex items-center px-4">
            <span className="font-['Noto_Sans',sans-serif] font-normal text-[14px] text-[#787878] leading-[20px]" style={ns}>
              Write something to the group...
            </span>
          </div>
          <button className="size-9 flex items-center justify-center shrink-0">
            <ImageIcon className="size-5 text-[#45bd62]" strokeWidth={1.75} />
          </button>
        </div>

        {/* Feed */}
        <div className="flex flex-col">
          {FB_POSTS.map(post => (
            <div key={post.id} className="px-4 py-3 flex flex-col gap-3 border-b-8 border-[#f0f2f5]">
              <div className="flex items-center gap-2">
                <MemberAvatar size={40} name={post.name} />
                <div className="flex-1 min-w-0">
                  <p className="font-['Noto_Sans',sans-serif] font-medium text-[14px] text-black leading-[20px] truncate" style={ns}>
                    {post.name}
                  </p>
                  <p className="font-['Noto_Sans',sans-serif] font-normal text-[12px] text-[#787878] leading-[16px]" style={ns}>
                    {post.time}
                  </p>
                </div>
                <button className="size-8 flex items-center justify-center shrink-0">
                  <MoreHorizontal className="size-4 text-[#787878]" strokeWidth={2} />
                </button>
              </div>

              <p className="font-['Noto_Sans',sans-serif] font-normal text-[14px] text-black leading-[20px]" style={ns}>
                {post.text}
              </p>

              <div className="flex items-center justify-between text-[#787878]">
                <span className="font-['Noto_Sans',sans-serif] font-normal text-[12px] leading-[16px]" style={ns}>
                  {post.likes} likes
                </span>
                <span className="font-['Noto_Sans',sans-serif] font-normal text-[12px] leading-[16px]" style={ns}>
                  {post.comments} comments · {post.shares} shares
                </span>
              </div>

              <div className="flex items-center border-t border-[#e3e3e3] pt-1">
                <button className="flex-1 h-9 flex items-center justify-center gap-2 active:opacity-70 transition-opacity">
                  <ThumbsUp className="size-4 text-[#484848]" strokeWidth={1.75} />
                  <span className="font-['Noto_Sans',sans-serif] font-medium text-[13px] text-[#484848]" style={ns}>Like</span>
                </button>
                <button className="flex-1 h-9 flex items-center justify-center gap-2 active:opacity-70 transition-opacity">
                  <MessageCircle className="size-4 text-[#484848]" strokeWidth={1.75} />
                  <span className="font-['Noto_Sans',sans-serif] font-medium text-[13px] text-[#484848]" style={ns}>Comment</span>
                </button>
                <button className="flex-1 h-9 flex items-center justify-center gap-2 active:opacity-70 transition-opacity">
                  <Share2 className="size-4 text-[#484848]" strokeWidth={1.75} />
                  <span className="font-['Noto_Sans',sans-serif] font-medium text-[13px] text-[#484848]" style={ns}>Share</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Group Rank Data ────────────────────────────────────────────────────────────

const RANK_GROUPS = [
  { name: "The Winner", cat: "BCS", admin: "Subroto Howlader", date: "1 Jul 2026", isUser: true, members: 103, exams: 66, attendance: 90.5, rating: 93.7 },
  { name: "Candid", cat: "BCS", admin: "Mehedi Shammi", date: "1 Jul 2026", members: 160, exams: 90, attendance: 89.0, rating: 76.0 },
  { name: "Alpha", cat: "BCS", admin: "Mehedi Shammi", date: "1 Jul 2026", members: 142, exams: 84, attendance: 85.3, rating: 81.2 },
  { name: "Focused", cat: "BCS", admin: "Mehedi Shammi", date: "1 Jul 2026", members: 128, exams: 79, attendance: 82.7, rating: 78.4 },
  { name: "Innovative", cat: "BCS", admin: "Mehedi Shammi", date: "1 Jul 2026", members: 115, exams: 73, attendance: 79.1, rating: 74.9 },
  { name: "Collaborative", cat: "BCS", admin: "Mehedi Shammi", date: "1 Jul 2026", members: 98, exams: 68, attendance: 75.6, rating: 71.3 },
  { name: "Dynamic", cat: "BCS", admin: "Mehedi Shammi", date: "1 Jul 2026", members: 87, exams: 61, attendance: 70.2, rating: 68.5 },
  { name: "Interactive", cat: "BCS", admin: "Mehedi Shammi", date: "1 Jul 2026", members: 74, exams: 55, attendance: 64.8, rating: 63.7 },
];

const MONTHLY_RANK_DATA = [
  {
    userRank: 1, userGP: "789.6", attendance: "90.5", exams: 66, rating: "93.7", totalExams: 155, avgAttendance: "75.5", monthlyGoal: 1221, achievementRatio: "75.5",
    leaderboard: [{ g: 0, gp: "789.6" }, { g: 1, gp: "654.2" }, { g: 2, gp: "621.8" }, { g: 3, gp: "587.4" }, { g: 4, gp: "542.9" }, { g: 5, gp: "498.3" }, { g: 6, gp: "431.1" }, { g: 7, gp: "387.6" }]
  },
  {
    userRank: 2, userGP: "721.3", attendance: "85.2", exams: 61, rating: "88.4", totalExams: 148, avgAttendance: "71.3", monthlyGoal: 1180, achievementRatio: "69.8",
    leaderboard: [{ g: 2, gp: "758.4" }, { g: 0, gp: "721.3" }, { g: 1, gp: "689.7" }, { g: 5, gp: "612.1" }, { g: 3, gp: "553.8" }, { g: 4, gp: "498.2" }, { g: 7, gp: "412.5" }, { g: 6, gp: "378.9" }]
  },
  {
    userRank: 1, userGP: "812.1", attendance: "92.1", exams: 70, rating: "95.2", totalExams: 162, avgAttendance: "78.9", monthlyGoal: 1300, achievementRatio: "81.2",
    leaderboard: [{ g: 0, gp: "812.1" }, { g: 2, gp: "774.6" }, { g: 4, gp: "701.3" }, { g: 1, gp: "658.9" }, { g: 6, gp: "589.4" }, { g: 3, gp: "521.2" }, { g: 5, gp: "448.7" }, { g: 7, gp: "392.1" }]
  },
  {
    userRank: 3, userGP: "654.2", attendance: "78.9", exams: 58, rating: "81.3", totalExams: 141, avgAttendance: "68.4", monthlyGoal: 1050, achievementRatio: "62.3",
    leaderboard: [{ g: 5, gp: "745.8" }, { g: 2, gp: "712.4" }, { g: 0, gp: "654.2" }, { g: 1, gp: "598.7" }, { g: 3, gp: "534.1" }, { g: 6, gp: "478.3" }, { g: 4, gp: "401.9" }, { g: 7, gp: "345.6" }]
  },
  {
    userRank: 2, userGP: "698.5", attendance: "83.7", exams: 63, rating: "86.9", totalExams: 152, avgAttendance: "73.1", monthlyGoal: 1140, achievementRatio: "72.4",
    leaderboard: [{ g: 1, gp: "734.2" }, { g: 0, gp: "698.5" }, { g: 2, gp: "661.8" }, { g: 6, gp: "589.3" }, { g: 5, gp: "521.7" }, { g: 3, gp: "458.2" }, { g: 7, gp: "389.6" }, { g: 4, gp: "321.4" }]
  },
  {
    userRank: 4, userGP: "612.8", attendance: "76.4", exams: 55, rating: "79.1", totalExams: 134, avgAttendance: "65.8", monthlyGoal: 980, achievementRatio: "58.7",
    leaderboard: [{ g: 2, gp: "721.9" }, { g: 4, gp: "689.4" }, { g: 1, gp: "651.2" }, { g: 0, gp: "612.8" }, { g: 5, gp: "574.3" }, { g: 6, gp: "498.7" }, { g: 3, gp: "421.6" }, { g: 7, gp: "358.9" }]
  },
];

// Daily "% of goal reached" for the current month, days 1-31 — same shape/coloring as the
// Figma chart (red <41%, yellow 41-74%, green >=75%), shared across the month picker since
// this is illustrative prototype data, not real day-by-day tracking.
const DAILY_GOAL_PCTS = [
  22, 42, 17, 36, 25, 42, 49, 36, 31, 100, 56, 36, 63, 31, 56,
  31, 36, 49, 74, 49, 31, 49, 36, 31, 49, 25, 49, 49, 85, 25, 25,
];

type RankSort = "attendance" | "position" | "name" | "memberCount";

const RANK_SORT_OPTIONS: Array<{ id: RankSort; label: string }> = [
  { id: "attendance", label: "Attendance" },
  { id: "position", label: "Position" },
  { id: "name", label: "Name" },
  { id: "memberCount", label: "Member Count" },
];

function RankSortBottomSheet({ value, onSelect, onClose }: { value: RankSort; onSelect: (v: RankSort) => void; onClose: () => void }) {
  const ns = { fontVariationSettings: '"CTGR" 0, "wdth" 100' };
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="absolute inset-0 z-50 flex flex-col justify-end bg-black/40"
      onClick={onClose}
    >
      <motion.div
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        exit={{ y: "100%" }}
        transition={{ type: "tween", duration: 0.28, ease: [0.4, 0, 0.2, 1] }}
        className="bg-white rounded-tl-[16px] rounded-tr-[16px] shadow-[0px_4px_8px_3px_rgba(0,0,0,0.15)] flex flex-col overflow-hidden pb-4"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex flex-col items-center p-4 shrink-0">
          <div className="bg-[#787878] h-1 rounded-full w-8" />
        </div>
        <div className="flex flex-col">
          {RANK_SORT_OPTIONS.map(opt => (
            <button
              key={opt.id}
              onClick={() => { onSelect(opt.id); onClose(); }}
              className="h-14 flex items-center gap-4 px-4 active:bg-gray-50 transition-colors text-left"
            >
              <div className="relative size-5 shrink-0 rounded-full border-2 flex items-center justify-center" style={{ borderColor: value === opt.id ? "#1441cc" : "#787878" }}>
                {value === opt.id && <div className="size-2.5 rounded-full bg-[#1441cc]" />}
              </div>
              <span className="font-['Noto_Sans',sans-serif] font-medium text-[16px] text-black leading-6" style={ns}>{opt.label}</span>
            </button>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
}

function RankGroupDetailSheet({ group, gp, onClose }: { group: typeof RANK_GROUPS[number]; gp: string; onClose: () => void }) {
  const ns = { fontVariationSettings: '"CTGR" 0, "wdth" 100' };
  const rows: Array<[string, string]> = [
    ["Members", String(group.members)],
    ["Exams", String(group.exams)],
    ["Attendance", `${group.attendance.toFixed(1)}%`],
    ["Admin Rating", `${group.rating.toFixed(1)}%`],
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="absolute inset-0 z-50 flex flex-col justify-end bg-black/40"
      onClick={onClose}
    >
      <motion.div
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        exit={{ y: "100%" }}
        transition={{ type: "tween", duration: 0.28, ease: [0.4, 0, 0.2, 1] }}
        className="bg-white rounded-tl-[16px] rounded-tr-[16px] shadow-[0px_4px_8px_3px_rgba(0,0,0,0.15)] flex flex-col overflow-hidden pb-4"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex flex-col items-center p-4 shrink-0">
          <div className="bg-[#787878] h-1 rounded-full w-8" />
        </div>

        <div className="px-4 flex flex-col gap-4">
          <div className="bg-[#f4f6fa] rounded-[12px] p-3 flex items-center gap-3">
            <GroupAvatar size={50} />
            <div className="flex-1 min-w-0 flex flex-col gap-1">
              <div className="flex items-center justify-between gap-2">
                <span className="font-['Noto_Sans',sans-serif] font-normal text-[14px] text-black leading-5" style={ns}>{group.name}</span>
                <div className="bg-[#b7dfb9] rounded-[4px] px-2 h-5 flex items-center shrink-0">
                  <span className="font-['Noto_Sans',sans-serif] font-medium text-[10px] text-[#264a34] leading-4" style={ns}>{gp} GP</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="bg-[#eaeef6] rounded-[4px] px-2 h-5 flex items-center shrink-0">
                  <span className="font-['Noto_Sans',sans-serif] font-medium text-[10px] text-[#484848] leading-4" style={ns}>{group.cat}</span>
                </div>
                <span className="font-['Noto_Sans',sans-serif] font-normal text-[12px] text-[#484848] leading-4" style={ns}>Created: {group.date}</span>
              </div>
              <span className="font-['Noto_Sans',sans-serif] font-normal text-[12px] text-[#484848] leading-4" style={ns}>Admin: {group.admin}</span>
            </div>
          </div>

          <div className="flex flex-col gap-4">
            {rows.map(([label, value]) => (
              <div key={label} className="flex items-center justify-between">
                <span className="font-['Noto_Sans',sans-serif] text-[14px] text-black leading-5" style={ns}>{label}</span>
                <span className="font-['Noto_Sans',sans-serif] text-[14px] text-black leading-5" style={ns}>{value}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="shrink-0 p-3 mt-2">
          <button
            onClick={onClose}
            className="w-full h-[56px] rounded-[100px] border border-[#c7c7c7] flex items-center justify-center"
          >
            <span className="font-['Noto_Sans',sans-serif] font-medium text-[16px] leading-6 tracking-[0.15px] text-[#484848]" style={ns}>Close</span>
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

function LeaderboardBadge({ rank }: { rank: number }) {
  const ns = { fontVariationSettings: '"CTGR" 0, "wdth" 100' };
  if (rank === 1) {
    return (
      <div className="relative shrink-0 size-[50px]">
        <div className="absolute inset-0 mask-alpha mask-intersect mask-no-clip mask-no-repeat mask-size-[50px_50px]" style={{ maskImage: `url("${imgEmojiEvents}")` }}>
          <svg className="absolute block inset-0 size-full" fill="none" viewBox="0 0 50 50">
            <path d={svgRankPaths.p70aaf40} fill="#F7DC6E" /><path d={svgRankPaths.p3f25a3c0} fill="#F7DC6E" />
          </svg>
        </div>
        <div className="[word-break:break-word] absolute flex flex-col font-['Noto_Sans',sans-serif] font-semibold inset-[0_22.22%_27.78%_22.22%] justify-center leading-[0] mask-alpha mask-intersect mask-no-clip mask-no-repeat mask-position-[-11.111px_0px] mask-size-[50px_50px] text-[#665200] text-[16px] text-center" style={{ ...ns, maskImage: `url("${imgEmojiEvents}")` }}>
          <p className="leading-[24px]">1</p>
        </div>
      </div>
    );
  }
  const yellow = rank <= 5;
  return (
    <div className="relative shrink-0 size-[50px]">
      <svg className="absolute block inset-0 size-full" fill="none" viewBox="0 0 50 50">
        <mask id={`lbm-${rank}`} maskUnits="userSpaceOnUse" style={{ maskType: "alpha" as const }} width="50" height="50" x="0" y="0">
          <rect fill="#D9D9D9" width="50" height="50" />
        </mask>
        <g mask={`url(#lbm-${rank})`}>
          <path clipRule="evenodd" d={svgRankPaths.p28c02580} fill={yellow ? "#F7DC6E" : "#9E9E9E"} fillRule="evenodd" />
          <path d={svgRankPaths.p1721c500} fill={yellow ? "#F7DC6E" : "#9E9E9E"} />
        </g>
      </svg>
      <div className="[word-break:break-word] absolute flex flex-col font-['Noto_Sans',sans-serif] font-semibold inset-1/4 justify-center leading-[0] text-[16px] text-center" style={{ ...ns, color: yellow ? "#665200" : "black" }}>
        <p className="leading-[24px]">{rank}</p>
      </div>
    </div>
  );
}

// ── Month Picker Modal ────────────────────────────────────────────────────────

const MONTH_NAMES_SHORT = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const MONTH_NAMES_LONG = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

function MonthPickerModal({
  selectedMonth,
  onConfirm,
  onCancel,
}: {
  selectedMonth: Date;
  onConfirm: (d: Date) => void;
  onCancel: () => void;
}) {
  const today = new Date();
  today.setDate(1);
  // allow up to 24 months back
  const minDate = new Date(today.getFullYear(), today.getMonth() - 23, 1);
  // Reset goes back to the default selection: last month.
  const defaultMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1);

  const [viewYear, setViewYear] = useState(selectedMonth.getFullYear());

  function isDisabled(mIdx: number) {
    const d = new Date(viewYear, mIdx, 1);
    return d > today || d < minDate;
  }
  function isSelected(mIdx: number) {
    return viewYear === selectedMonth.getFullYear() && mIdx === selectedMonth.getMonth();
  }

  const canPrevYear = new Date(viewYear - 1, 11, 1) >= minDate;
  const canNextYear = new Date(viewYear + 1, 0, 1) <= today;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.18 }}
      className="absolute inset-0 z-50 flex items-center justify-center bg-black/40 px-6"
      onClick={onCancel}
    >
      <motion.div
        initial={{ scale: 0.94, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.94, opacity: 0 }}
        transition={{ type: "tween", duration: 0.18, ease: "easeOut" }}
        className="w-full bg-[#f4f6fa] rounded-[12px] overflow-hidden flex flex-col"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="relative shrink-0">
          <div aria-hidden className="absolute border-[#c7c7c7] border-b border-solid inset-0 pointer-events-none" />
          <div className="px-6 pt-4 pb-3">
            <p className="font-['Noto_Sans',sans-serif] font-medium text-[14px] text-black leading-[20px]" style={{ fontVariationSettings: '"CTGR" 0, "wdth" 100' }}>
              Select month
            </p>
            <p className="font-['Noto_Sans',sans-serif] font-normal text-[32px] text-black leading-[40px] mt-9" style={{ fontVariationSettings: '"CTGR" 0, "wdth" 100' }}>
              {MONTH_NAMES_SHORT[selectedMonth.getMonth()]} {selectedMonth.getFullYear()}
            </p>
          </div>
        </div>

        {/* Year navigation row */}
        <div className="flex items-center justify-between pl-4 pr-3 py-1">
          <div className="flex items-center gap-1 pl-2 pr-1 py-2.5 rounded-full">
            <span className="font-['Noto_Sans',sans-serif] font-medium text-[14px] text-black leading-[20px]" style={{ fontVariationSettings: '"CTGR" 0, "wdth" 100' }}>
              {viewYear}
            </span>
            <svg width="7.5" height="3.75" viewBox="0 0 7.5 3.75" fill="none" className="ml-1">
              <path d="M3.75 3.75L0 0H7.5L3.75 3.75Z" fill="black" />
            </svg>
          </div>
          <div className="flex">
            <button
              onClick={() => { if (canPrevYear) setViewYear(y => y - 1); }}
              className={clsx("size-12 flex items-center justify-center rounded-full transition-opacity", !canPrevYear && "opacity-25 cursor-default")}
            >
              <svg width="7.4" height="12" viewBox="0 0 7.4 12" fill="none">
                <path d="M6 12L0 6L6 0L7.4 1.4L2.8 6L7.4 10.6L6 12Z" fill="black" />
              </svg>
            </button>
            <button
              onClick={() => { if (canNextYear) setViewYear(y => y + 1); }}
              className={clsx("size-12 flex items-center justify-center rounded-full transition-opacity", !canNextYear && "opacity-25 cursor-default")}
            >
              <svg width="7.4" height="12" viewBox="0 0 7.4 12" fill="none">
                <path d="M4.6 6L0 1.4L1.4 0L7.4 6L1.4 12L0 10.6L4.6 6Z" fill="black" />
              </svg>
            </button>
          </div>
        </div>

        {/* Month grid: 4 rows × 3 cols */}
        <div className="px-6 pb-2 flex flex-col gap-0">
          {[0, 1, 2, 3].map(row => (
            <div key={row} className="flex gap-2">
              {[0, 1, 2].map(col => {
                const mIdx = row * 3 + col;
                const disabled = isDisabled(mIdx);
                const selected = isSelected(mIdx);
                return (
                  <button
                    key={mIdx}
                    onClick={() => { if (!disabled) onConfirm(new Date(viewYear, mIdx, 1)); }}
                    className={clsx(
                      "flex-1 h-9 rounded-full flex items-center justify-center transition-colors",
                      "font-['Noto_Sans',sans-serif] font-medium text-[16px] leading-[24px]",
                      selected ? "bg-[#1441cc] text-white" :
                        disabled ? "text-[#c7c7c7] cursor-default" :
                          "text-black active:bg-black/5",
                    )}
                    style={{ fontVariationSettings: '"CTGR" 0, "wdth" 100' }}
                  >
                    {MONTH_NAMES_SHORT[mIdx]}
                  </button>
                );
              })}
            </div>
          ))}
        </div>

        {/* Action buttons */}
        <div className="relative shrink-0">
          <div aria-hidden className="absolute border-[#c7c7c7] border-t border-solid inset-0 pointer-events-none" />
          <div className="flex items-center justify-between gap-2 px-3 pb-2 pt-1">
            <button
              onClick={() => onConfirm(defaultMonth)}
              className="h-12 px-4 rounded-full flex items-center justify-center active:bg-black/5 transition-colors"
            >
              <span className="font-['Noto_Sans',sans-serif] font-medium text-[14px] text-[#484848]" style={{ fontVariationSettings: '"CTGR" 0, "wdth" 100' }}>
                Reset
              </span>
            </button>
            <div className="flex gap-2">
              <button
                onClick={onCancel}
                className="h-12 px-4 rounded-full flex items-center justify-center"
              >
                <span className="font-['Noto_Sans',sans-serif] font-medium text-[14px] text-[#1441cc]" style={{ fontVariationSettings: '"CTGR" 0, "wdth" 100' }}>
                  Cancel
                </span>
              </button>
              <button
                onClick={onCancel}
                className="h-12 px-4 rounded-full flex items-center justify-center"
              >
                <span className="font-['Noto_Sans',sans-serif] font-medium text-[14px] text-[#1441cc]" style={{ fontVariationSettings: '"CTGR" 0, "wdth" 100' }}>
                  OK
                </span>
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ──────────────────────────────────────────────────────────────────────────────

function GroupRankContent({ monthIndex, selectedMonth }: { monthIndex: number; selectedMonth: Date }) {
  const ns = { fontVariationSettings: '"CTGR" 0, "wdth" 100' };
  const [showAdminDetails, setShowAdminDetails] = useState(false);
  const [rankSort, setRankSort] = useState<RankSort>("position");
  const [sortingRank, setSortingRank] = useState(false);
  const [selectedRankGroup, setSelectedRankGroup] = useState<number | null>(null);
  const [showFormula, setShowFormula] = useState(false);

  if (monthIndex === -1) {
    return (
      <div className="flex flex-col items-center justify-center py-24 px-8 gap-3">
        <p className="font-['Noto_Sans',sans-serif] font-medium text-[16px] text-black leading-[24px] text-center" style={ns}>
          No data for {MONTH_NAMES_LONG[selectedMonth.getMonth()]} {selectedMonth.getFullYear()}
        </p>
        <p className="font-['Noto_Sans',sans-serif] font-normal text-[14px] text-[#787878] leading-[20px] text-center" style={ns}>
          Ranking data is available for the last 6 months only.
        </p>
      </div>
    );
  }

  const d = MONTHLY_RANK_DATA[monthIndex];

  const sortedLeaderboard = d.leaderboard.slice().sort((a, b) => {
    const ga = RANK_GROUPS[a.g];
    const gb = RANK_GROUPS[b.g];
    if (rankSort === "attendance") return gb.attendance - ga.attendance;
    if (rankSort === "name") return ga.name.localeCompare(gb.name);
    if (rankSort === "memberCount") return gb.members - ga.members;
    return 0; // "position" — keep the authored leaderboard order
  });

  return (
    <div className="flex flex-col gap-6 items-center py-4">
      <AnimatePresence>
        {showAdminDetails && (
          <AdminDetailsBottomSheet
            name="Subroto Howlader"
            rating={4.5}
            since="17 Jul 2026"
            onClose={() => setShowAdminDetails(false)}
          />
        )}
        {sortingRank && (
          <RankSortBottomSheet value={rankSort} onSelect={setRankSort} onClose={() => setSortingRank(false)} />
        )}
        {showFormula && <GroupPointsFormulaSheet onClose={() => setShowFormula(false)} />}
        {selectedRankGroup !== null && (
          <RankGroupDetailSheet
            group={RANK_GROUPS[selectedRankGroup]}
            gp={d.leaderboard.find(e => e.g === selectedRankGroup)?.gp ?? "0.0"}
            onClose={() => setSelectedRankGroup(null)}
          />
        )}
      </AnimatePresence>

      {/* Member info card */}
      <div className="px-4 w-full">
        <div className="bg-white rounded-[16px] border border-[#e3e3e3] p-3 flex flex-col gap-4">
          <div className="flex gap-3 items-start">
            <div className="relative shrink-0 size-[60px]">
              <GroupAvatar size={60} />
            </div>
            <div className="flex flex-col gap-2 flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2">
                <p className="font-['Noto_Sans',sans-serif] font-medium text-[16px] text-black leading-[24px]" style={ns}>The Winner</p>
                <div className="bg-[#0c5fff] rounded-[4px] px-2 h-5 flex items-center shrink-0">
                  <span className="font-['Noto_Sans',sans-serif] font-medium text-[10px] text-white leading-[16px]" style={ns}>Open to Join</span>
                </div>
              </div>
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2">
                  <div className="bg-[#eaeef6] rounded-[4px] px-2 h-5 flex items-center shrink-0">
                    <span className="font-['Noto_Sans',sans-serif] font-medium text-[10px] text-[#484848] leading-[16px]" style={ns}>BCS</span>
                  </div>
                  <span className="font-['Noto_Sans',sans-serif] font-normal text-[12px] text-[#484848] leading-[16px]" style={ns}>Created: 1 Jul 2026</span>
                </div>
                <button onClick={() => setShowAdminDetails(true)} className="flex items-center gap-1 active:opacity-70 transition-opacity">
                  <span className="font-['Noto_Sans',sans-serif] font-medium text-[12px] text-[#484848] leading-[16px]" style={ns}>Admin: Subroto Howlader</span>
                  <Info className="size-[18px] text-[#484848]" strokeWidth={1.5} />
                </button>
              </div>
            </div>
          </div>
          {/* Rank achievement */}
          <div className="bg-[#f4f6fa] rounded-[8px] flex items-center gap-4 p-2">
            <div className="relative shrink-0 size-[40px]">
              <div className="absolute inset-0 mask-alpha mask-intersect mask-no-clip mask-no-repeat mask-size-[40px_40px]" style={{ maskImage: `url("${imgEmojiEvents1}")` }}>
                <svg className="absolute block inset-0 size-full" fill="none" viewBox="0 0 40 40">
                  <path d={svgRankPaths.p17929100} fill="#F7DC6E" /><path d={svgRankPaths.pf931700} fill="#F7DC6E" />
                </svg>
              </div>
              <div className="[word-break:break-word] absolute flex flex-col font-['Noto_Sans',sans-serif] font-medium inset-[0_22.22%_27.78%_22.22%] justify-center leading-[0] mask-alpha mask-intersect mask-no-clip mask-no-repeat mask-position-[-8.889px_0px] mask-size-[40px_40px] text-[#665200] text-[16px] text-center tracking-[0.15px]" style={{ ...ns, maskImage: `url("${imgEmojiEvents1}")` }}>
                <p className="leading-[24px]">{d.userRank}</p>
              </div>
            </div>
            <div className="flex flex-1 items-center justify-between">
              <p className="font-['Roboto',sans-serif] font-semibold text-[16px] text-black leading-[24px] tracking-[0.15px]">#{d.userRank} of 15</p>
              <button onClick={() => setShowFormula(true)} className="bg-[green] rounded-[8px] px-2 py-1 active:opacity-80 transition-opacity">
                <span className="font-['Noto_Sans',sans-serif] font-medium text-[12px] text-white leading-[16px]" style={ns}>{d.userGP} GP</span>
              </button>
            </div>
          </div>
          {/* Stats */}
          <div className="flex gap-4">
            {[
              { val: "103", label: "Members", center: false },
              { val: `${d.attendance}%`, label: "Attendance", center: true },
              { val: String(d.exams), label: "Exams", center: false },
              { val: `${d.rating}%`, label: "Rating", center: true },
            ].map(({ val, label, center }) => (
              <div key={label} className={`flex-1 flex flex-col ${center ? "items-center" : ""}`}>
                <p className="font-['Noto_Sans',sans-serif] font-medium text-[16px] text-black leading-[24px]" style={ns}>{val}</p>
                <p className="font-['Noto_Sans',sans-serif] font-normal text-[12px] text-[#787878] leading-[16px]" style={ns}>{label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Graph card */}
      <div className="px-4 w-full">
        <div className="bg-[#f4f6fa] rounded-[16px] flex flex-col gap-2 py-3">
          <p className="px-3 font-['Noto_Sans',sans-serif] font-medium text-[14px] text-black leading-[20px]" style={ns}>% of goal reached, by dates</p>
          <div className="px-3 flex flex-col gap-1">
            {/* Bars — one per day of the month */}
            <div className="grid gap-x-1 h-[100px] items-end" style={{ gridTemplateColumns: `repeat(${DAILY_GOAL_PCTS.length}, minmax(0, 1fr))` }}>
              {DAILY_GOAL_PCTS.map((pct, i) => (
                <div key={i} className="rounded-t-sm" style={{ height: `${pct}px`, backgroundColor: zoneBarColor(pct) }} />
              ))}
            </div>
            {/* Day labels */}
            <div className="flex items-center justify-between">
              {[1, 10, 20, DAILY_GOAL_PCTS.length].map(day => (
                <span key={day} className="font-['Noto_Sans',sans-serif] font-medium text-[10px] text-[#8f8d8d] leading-[16px]" style={ns}>{day}</span>
              ))}
            </div>
          </div>
          {/* Legend */}
          <div className="flex items-center justify-between px-3">
            {[["#f04d30", "0 - 40%"], ["#ffcb61", "41 - 74%"], ["#6fcf7e", "75 - 100%"]].map(([bg, label]) => (
              <div key={label} className="flex items-center gap-1 p-1">
                <div className="size-[10px] rounded-[4px]" style={{ backgroundColor: bg }} />
                <span className="font-['Noto_Sans',sans-serif] font-medium text-[10px] text-[#484848] leading-[16px]" style={ns}>{label}</span>
              </div>
            ))}
          </div>
          <div className="mx-3 border-t border-[#C7C5CE]" />
          {/* Stats row */}
          <div className="px-3 flex items-stretch gap-3">
            <div className="flex-1 flex flex-col gap-1">
              <p className="font-['Noto_Serif',serif] font-normal text-[12px] text-[#484848] leading-[16px]">Total exams</p>
              <p className="font-['Roboto',sans-serif] font-semibold text-[16px] text-black leading-[24px] tracking-[0.15px]">{d.totalExams}</p>
              <p className="font-['Noto_Sans',sans-serif] font-medium text-[12px] text-[#484848] leading-[16px]" style={ns}>{d.avgAttendance}% avg. attendance</p>
            </div>
            <div className="w-px bg-[#C7C5CE]" />
            <div className="flex-1 flex flex-col gap-1">
              <p className="font-['Noto_Serif',serif] font-normal text-[12px] text-[#484848] leading-[16px]">Monthly goal</p>
              <p className="font-['Roboto',sans-serif] font-semibold text-[16px] text-black leading-[24px] tracking-[0.15px]">{d.monthlyGoal}</p>
              <p className="font-['Noto_Sans',sans-serif] font-medium text-[12px] text-[#484848] leading-[16px]" style={ns}>{d.achievementRatio}% achievement ratio</p>
            </div>
          </div>
        </div>
      </div>

      {/* Leaderboard */}
      <div className="w-full flex flex-col gap-4 pb-4">
        <div className="px-4 flex items-center justify-between h-10">
          <span className="font-['Noto_Sans',sans-serif] font-medium text-[16px] text-black leading-[24px] tracking-[0.15px]" style={ns}>Leaderboard</span>
          <button
            onClick={() => setSortingRank(true)}
            aria-label="Sort leaderboard"
            className="size-12 flex items-center justify-center rounded-full active:bg-gray-100 transition-colors -mr-3"
          >
            <ArrowUpDown className="size-5 text-black" strokeWidth={1.5} />
          </button>
        </div>
        <div className="flex flex-col gap-2 px-4">
          {sortedLeaderboard.map((entry, i) => {
            const group = RANK_GROUPS[entry.g];
            return (
              <button
                key={entry.g}
                onClick={() => setSelectedRankGroup(entry.g)}
                className="relative bg-[#f4f6fa] rounded-[12px] text-left active:opacity-80 transition-opacity"
              >
                {group.isUser && <div aria-hidden className="absolute border border-[#1441cc] border-solid inset-0 pointer-events-none rounded-[12px]" />}
                <div className="flex items-center gap-[10px] p-3 w-full">
                  <LeaderboardBadge rank={i + 1} />
                  <div className="flex-1 min-w-0 flex flex-col gap-2">
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-['Noto_Sans',sans-serif] font-normal text-[14px] text-black leading-[20px]" style={ns}>{group.name}</span>
                      <div className="bg-[#b7dfb9] rounded-[4px] px-2 h-5 flex items-center shrink-0">
                        <span className="font-['Noto_Sans',sans-serif] font-medium text-[10px] text-[#264a34] leading-[16px]" style={ns}>{entry.gp} GP</span>
                      </div>
                    </div>
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-2">
                        <div className="bg-[#eaeef6] rounded-[4px] px-2 h-5 flex items-center shrink-0">
                          <span className="font-['Noto_Sans',sans-serif] font-medium text-[10px] text-[#484848] leading-[16px]" style={ns}>{group.cat}</span>
                        </div>
                        <span className="font-['Noto_Sans',sans-serif] font-normal text-[12px] text-[#484848] leading-[16px]" style={ns}>Created: {group.date}</span>
                      </div>
                      <span className="font-['Noto_Sans',sans-serif] font-normal text-[12px] text-[#484848] leading-[16px]" style={ns}>Admin: {group.admin}</span>
                    </div>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function GroupRankScreen({ onBack }: { onBack: () => void }) {
  const lastMonth = new Date();
  lastMonth.setDate(1);
  lastMonth.setMonth(lastMonth.getMonth() - 1);

  const months = Array.from({ length: 6 }, (_, i) => {
    const d = new Date(lastMonth);
    d.setMonth(d.getMonth() - i);
    return d;
  });

  const [selectedMonth, setSelectedMonth] = useState(months[0]);
  const [showPicker, setShowPicker] = useState(false);

  const monthName = selectedMonth.toLocaleString("en-US", { month: "long" });
  const monthIndex = months.findIndex(
    m => m.getMonth() === selectedMonth.getMonth() && m.getFullYear() === selectedMonth.getFullYear()
  );

  return (
    <div className="flex flex-col h-full bg-white relative">
      <AnimatePresence>
        {showPicker && (
          <MonthPickerModal
            selectedMonth={selectedMonth}
            onConfirm={d => { setSelectedMonth(d); setShowPicker(false); }}
            onCancel={() => setShowPicker(false)}
          />
        )}
      </AnimatePresence>

      <div className="shrink-0 h-14 bg-white flex items-center justify-between px-1">
        <div className="flex items-center">
          <button
            onClick={onBack}
            className="size-12 flex items-center justify-center rounded-full active:bg-gray-100 transition-colors"
          >
            <ArrowLeft className="size-6 text-[#484848]" strokeWidth={2} />
          </button>
          <span
            className="font-['Noto_Sans',sans-serif] font-normal text-[18px] text-black leading-[28px]"
            style={{ fontVariationSettings: '"CTGR" 0, "wdth" 100' }}
          >
            Group Rank
          </span>
        </div>
        {/* Month filter chip — tapping opens the MonthPickerModal */}
        <div className="relative mr-2">
          <button
            onClick={() => setShowPicker(true)}
            className="relative flex items-center gap-[6px] pl-2 pr-2 py-[6px] rounded-[8px] active:bg-gray-50 transition-colors"
          >
            {/* Calendar icon */}
            <div className="relative shrink-0 size-[18px]">
              <div
                className="absolute inset-[9.94%_14.58%_10.42%_14.58%] mask-alpha mask-intersect mask-no-clip mask-no-repeat mask-position-[-3.5px_-2.385px] mask-size-[24px_24px]"
                style={{ maskImage: `url("${imgCalendarMonth}")` }}
              >
                <svg className="absolute block inset-0 size-full" fill="none" height="14.3364" preserveAspectRatio="none" viewBox="0 0 12.75 14.3364" width="12.75">
                  <path d={svgRankPaths.p19f86400} fill="#484848" />
                </svg>
              </div>
            </div>
            <span
              className="font-['Noto_Sans',sans-serif] font-medium text-[14px] text-[#484848] leading-[20px]"
              style={{ fontVariationSettings: '"CTGR" 0, "wdth" 100' }}
            >
              {monthName}
            </span>
            <ChevronDown className="size-4 text-[#484848]" strokeWidth={2} />
            <div aria-hidden className="absolute border border-[#c7c7c7] inset-0 pointer-events-none rounded-[8px]" />
          </button>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto overflow-x-hidden">
        <GroupRankContent monthIndex={monthIndex} selectedMonth={selectedMonth} />
      </div>
    </div>
  );
}

// ── Group Members data ────────────────────────────────────────────────────────

type AttendanceChip = "green" | "yellow" | "red";

interface Member {
  name: string;
  pct: number;
  chip: AttendanceChip;
  memberId: string;
  since: string;
  rating: string;
  level: number;
  exams: number;
  preparingFor: string;
  gender: string;
  birthday: string;
  majorSubject: string;
  institute: string;
  district: string;
  subgroup: string;
}

const MEMBER_LIST: Member[] = [
  { name: "Atiqul Haque", pct: 88.0, chip: "green", memberId: "WS230", since: "23 Mar 2023", rating: "B", level: 1, exams: 200, preparingFor: "BCS", gender: "Male", birthday: "24 Dec", majorSubject: "English", institute: "University of Dhaka", district: "Dhaka", subgroup: "A" },
  { name: "Shajenur khatun", pct: 88.0, chip: "green", memberId: "WS229", since: "12 Feb 2023", rating: "B", level: 2, exams: 180, preparingFor: "Bank", gender: "Female", birthday: "3 Apr", majorSubject: "Accounting", institute: "Jahangirnagar University", district: "Dhaka", subgroup: "B" },
  { name: "Anik Mahmud", pct: 29.0, chip: "red", memberId: "WS228", since: "5 Jan 2023", rating: "C", level: 1, exams: 60, preparingFor: "NTRCA", gender: "Male", birthday: "19 Aug", majorSubject: "Physics", institute: "Chittagong University", district: "Chattogram", subgroup: "C" },
  { name: "🙉🙊🙈মেহেজাবীন নুসরাত স্মৃতি✨💝🎉", pct: 88.0, chip: "green", memberId: "WS227", since: "23 Mar 2023", rating: "A", level: 3, exams: 240, preparingFor: "BCS", gender: "Female", birthday: "2 Oct", majorSubject: "Economics", institute: "Dhaka University", district: "Dhaka", subgroup: "D" },
  { name: "অর্থহীন জীবন", pct: 65.0, chip: "yellow", memberId: "WS226", since: "18 Nov 2022", rating: "B", level: 2, exams: 140, preparingFor: "Bank", gender: "Male", birthday: "30 Jun", majorSubject: "Finance", institute: "Rajshahi University", district: "Rajshahi", subgroup: "E" },
  { name: "⭕️ Shuraiya Ripa", pct: 88.0, chip: "green", memberId: "WS225", since: "23 Mar 2023", rating: "A", level: 3, exams: 260, preparingFor: "BCS", gender: "Female", birthday: "14 May", majorSubject: "Political Science", institute: "University of Dhaka", district: "Dhaka", subgroup: "A" },
  { name: "Hridoy Hasan", pct: 88.0, chip: "green", memberId: "WS224", since: "1 Jul 2022", rating: "B", level: 2, exams: 190, preparingFor: "NTRCA", gender: "Male", birthday: "7 Sep", majorSubject: "Education", institute: "Khulna University", district: "Khulna", subgroup: "B" },
  { name: "©️Chonchol Ray ©️©️©️©️", pct: 88.0, chip: "green", memberId: "WS223", since: "23 Mar 2023", rating: "B", level: 1, exams: 150, preparingFor: "Bank", gender: "Male", birthday: "11 Mar", majorSubject: "Management", institute: "University of Dhaka", district: "Dhaka", subgroup: "C" },
  { name: "Nusrat Jahan", pct: 15.0, chip: "red", memberId: "WS222", since: "9 Sep 2022", rating: "C", level: 1, exams: 40, preparingFor: "BAR / BJS", gender: "Female", birthday: "26 Jan", majorSubject: "Law", institute: "Dhaka University", district: "Dhaka", subgroup: "D" },
  { name: "Kamrul Islam", pct: 45.0, chip: "yellow", memberId: "WS221", since: "2 Aug 2022", rating: "C", level: 2, exams: 95, preparingFor: "DP", gender: "Male", birthday: "20 Feb", majorSubject: "Statistics", institute: "Rajshahi University", district: "Rajshahi", subgroup: "E" },
  { name: "রাকিবুল শেখ", pct: 75, chip: "yellow", memberId: "WS220", since: "4 Jan 2022", rating: "B", level: 1, exams: 30, preparingFor: "BCS", gender: "Male", birthday: "25 Mar", majorSubject: "English", institute: "University of Dhaka", district: "Dhaka", subgroup: "A" },
  { name: "সাদিয়া তাবাসসুম", pct: 78, chip: "yellow", memberId: "WS219", since: "11 Feb 2023", rating: "B", level: 2, exams: 41, preparingFor: "Bank", gender: "Female", birthday: "4 Apr", majorSubject: "Accounting", institute: "Jahangirnagar University", district: "Chattogram", subgroup: "B" },
  { name: "তানভীর কবির", pct: 81, chip: "green", memberId: "WS218", since: "18 Mar 2024", rating: "A", level: 3, exams: 52, preparingFor: "DP", gender: "Male", birthday: "11 May", majorSubject: "Physics", institute: "Chittagong University", district: "Rajshahi", subgroup: "C" },
  { name: "ফারজানা ইয়াসমিন", pct: 84, chip: "green", memberId: "WS217", since: "25 Apr 2022", rating: "A", level: 1, exams: 63, preparingFor: "NTRCA", gender: "Female", birthday: "18 Jun", majorSubject: "Economics", institute: "Rajshahi University", district: "Khulna", subgroup: "D" },
  { name: "সাইফুল রহমান", pct: 87, chip: "green", memberId: "WS216", since: "4 May 2023", rating: "A", level: 2, exams: 74, preparingFor: "BAR / BJS", gender: "Male", birthday: "25 Jul", majorSubject: "Finance", institute: "Khulna University", district: "Sylhet", subgroup: "E" },
  { name: "তাসনিম সুলতানা", pct: 90, chip: "green", memberId: "WS215", since: "11 Jun 2024", rating: "A", level: 3, exams: 85, preparingFor: "BCS", gender: "Female", birthday: "4 Aug", majorSubject: "Political Science", institute: "Sylhet Agricultural University", district: "Barishal", subgroup: "A" },
  { name: "ফারহান রানা", pct: 70, chip: "yellow", memberId: "WS214", since: "18 Jul 2022", rating: "B", level: 1, exams: 96, preparingFor: "Bank", gender: "Male", birthday: "11 Sep", majorSubject: "Education", institute: "Barishal University", district: "Rangpur", subgroup: "B" },
  { name: "মিম ফেরদৌস", pct: 75, chip: "yellow", memberId: "WS213", since: "25 Aug 2023", rating: "B", level: 2, exams: 107, preparingFor: "DP", gender: "Female", birthday: "18 Oct", majorSubject: "Management", institute: "Comilla University", district: "Mymensingh", subgroup: "C" },
  { name: "মেহেদী হক", pct: 41, chip: "yellow", memberId: "WS212", since: "4 Sep 2024", rating: "C", level: 3, exams: 118, preparingFor: "NTRCA", gender: "Male", birthday: "25 Nov", majorSubject: "Law", institute: "Jagannath University", district: "Cumilla", subgroup: "D" },
  { name: "সুমাইয়া চৌধুরী", pct: 7, chip: "red", memberId: "WS211", since: "11 Oct 2022", rating: "C", level: 1, exams: 129, preparingFor: "BAR / BJS", gender: "Female", birthday: "4 Dec", majorSubject: "Statistics", institute: "Islamic University, Kushtia", district: "Narayanganj", subgroup: "E" },
  { name: "ইমরান আলম", pct: 80, chip: "green", memberId: "WS210", since: "18 Nov 2023", rating: "A", level: 2, exams: 140, preparingFor: "BCS", gender: "Male", birthday: "11 Jan", majorSubject: "Sociology", institute: "Rangpur Carmichael College", district: "Gazipur", subgroup: "A" },
  { name: "নাজিফা রায়", pct: 83, chip: "green", memberId: "WS209", since: "25 Dec 2024", rating: "A", level: 3, exams: 151, preparingFor: "Bank", gender: "Female", birthday: "18 Feb", majorSubject: "History", institute: "BUET", district: "Bogura", subgroup: "B" },
  { name: "নাঈম মিয়া", pct: 86, chip: "green", memberId: "WS208", since: "4 Jan 2022", rating: "A", level: 1, exams: 162, preparingFor: "DP", gender: "Male", birthday: "25 Mar", majorSubject: "Chemistry", institute: "Dhaka College", district: "Jessore", subgroup: "C" },
  { name: "রুমানা দাস", pct: 89, chip: "green", memberId: "WS207", since: "11 Feb 2023", rating: "A", level: 2, exams: 173, preparingFor: "NTRCA", gender: "Female", birthday: "4 Apr", majorSubject: "Mathematics", institute: "Eden Mohila College", district: "Faridpur", subgroup: "D" },
  { name: "রায়হান আকরাম", pct: 92, chip: "green", memberId: "WS206", since: "18 Mar 2024", rating: "A", level: 3, exams: 184, preparingFor: "BAR / BJS", gender: "Male", birthday: "11 May", majorSubject: "Public Administration", institute: "Chittagong College", district: "Noakhali", subgroup: "E" },
  { name: "ইশরাত খাতুন", pct: 95, chip: "green", memberId: "WS205", since: "25 Apr 2022", rating: "A", level: 1, exams: 195, preparingFor: "BCS", gender: "Female", birthday: "18 Jun", majorSubject: "Botany", institute: "University of Dhaka", district: "Dhaka", subgroup: "A" },
  { name: "শাকিল রশীদ", pct: 42, chip: "yellow", memberId: "WS204", since: "4 May 2023", rating: "C", level: 2, exams: 206, preparingFor: "Bank", gender: "Male", birthday: "25 Jul", majorSubject: "Zoology", institute: "Jahangirnagar University", district: "Chattogram", subgroup: "B" },
  { name: "সাবরিনা হক", pct: 47, chip: "yellow", memberId: "WS203", since: "11 Jun 2024", rating: "C", level: 3, exams: 217, preparingFor: "DP", gender: "Female", birthday: "4 Aug", majorSubject: "Bangla", institute: "Chittagong University", district: "Rajshahi", subgroup: "C" },
  { name: "জাহিদুল সাইফুল্লাহ", pct: 52, chip: "yellow", memberId: "WS202", since: "18 Jul 2022", rating: "C", level: 1, exams: 228, preparingFor: "NTRCA", gender: "Male", birthday: "11 Sep", majorSubject: "Islamic Studies", institute: "Rajshahi University", district: "Khulna", subgroup: "D" },
  { name: "তানিয়া মিমি", pct: 13, chip: "red", memberId: "WS201", since: "25 Aug 2023", rating: "C", level: 2, exams: 239, preparingFor: "BAR / BJS", gender: "Female", birthday: "18 Oct", majorSubject: "Marketing", institute: "Khulna University", district: "Sylhet", subgroup: "E" },
  { name: "মিজানুর ইকবাল", pct: 85, chip: "green", memberId: "WS200", since: "4 Sep 2024", rating: "A", level: 3, exams: 250, preparingFor: "BCS", gender: "Male", birthday: "25 Nov", majorSubject: "English", institute: "Sylhet Agricultural University", district: "Barishal", subgroup: "A" },
  { name: "মৌসুমী ইসলাম", pct: 88, chip: "green", memberId: "WS199", since: "11 Oct 2022", rating: "A", level: 1, exams: 261, preparingFor: "Bank", gender: "Female", birthday: "4 Dec", majorSubject: "Accounting", institute: "Barishal University", district: "Rangpur", subgroup: "B" },
  { name: "আরিফুল আরাফাত", pct: 91, chip: "green", memberId: "WS198", since: "18 Nov 2023", rating: "A", level: 2, exams: 272, preparingFor: "DP", gender: "Male", birthday: "11 Jan", majorSubject: "Physics", institute: "Comilla University", district: "Mymensingh", subgroup: "C" },
  { name: "লামিয়া আক্তার", pct: 94, chip: "green", memberId: "WS197", since: "25 Dec 2024", rating: "A", level: 3, exams: 283, preparingFor: "NTRCA", gender: "Female", birthday: "18 Feb", majorSubject: "Economics", institute: "Jagannath University", district: "Cumilla", subgroup: "D" },
  { name: "সোহেল উদ্দিন", pct: 97, chip: "green", memberId: "WS196", since: "4 Jan 2022", rating: "A", level: 1, exams: 34, preparingFor: "BAR / BJS", gender: "Male", birthday: "25 Mar", majorSubject: "Finance", institute: "Islamic University, Kushtia", district: "Narayanganj", subgroup: "E" },
  { name: "জান্নাতুল জাহান", pct: 75, chip: "yellow", memberId: "WS195", since: "11 Feb 2023", rating: "B", level: 2, exams: 45, preparingFor: "BCS", gender: "Female", birthday: "4 Apr", majorSubject: "Political Science", institute: "Rangpur Carmichael College", district: "Gazipur", subgroup: "A" },
  { name: "বায়েজিদ ইসলাম", pct: 53, chip: "yellow", memberId: "WS194", since: "18 Mar 2024", rating: "C", level: 3, exams: 56, preparingFor: "Bank", gender: "Male", birthday: "11 May", majorSubject: "Education", institute: "BUET", district: "Bogura", subgroup: "B" },
  { name: "রিমা বেগম", pct: 58, chip: "yellow", memberId: "WS193", since: "25 Apr 2022", rating: "B", level: 1, exams: 67, preparingFor: "DP", gender: "Female", birthday: "18 Jun", majorSubject: "Management", institute: "Dhaka College", district: "Jessore", subgroup: "C" },
  { name: "নাজমুল আহমেদ", pct: 63, chip: "yellow", memberId: "WS192", since: "4 May 2023", rating: "B", level: 2, exams: 78, preparingFor: "NTRCA", gender: "Male", birthday: "25 Jul", majorSubject: "Law", institute: "Eden Mohila College", district: "Faridpur", subgroup: "D" },
  { name: "শারমিন তাবাসসুম", pct: 19, chip: "red", memberId: "WS191", since: "11 Jun 2024", rating: "C", level: 3, exams: 89, preparingFor: "BAR / BJS", gender: "Female", birthday: "4 Aug", majorSubject: "Statistics", institute: "Chittagong College", district: "Noakhali", subgroup: "E" },
  { name: "তৌহিদুল হোসেন", pct: 90, chip: "green", memberId: "WS190", since: "18 Jul 2022", rating: "A", level: 1, exams: 100, preparingFor: "BCS", gender: "Male", birthday: "11 Sep", majorSubject: "Sociology", institute: "University of Dhaka", district: "Dhaka", subgroup: "A" },
  { name: "নওরিন ইয়াসমিন", pct: 93, chip: "green", memberId: "WS189", since: "25 Aug 2023", rating: "A", level: 2, exams: 111, preparingFor: "Bank", gender: "Female", birthday: "18 Oct", majorSubject: "History", institute: "Jahangirnagar University", district: "Chattogram", subgroup: "B" },
  { name: "ইফতেখার হাসান", pct: 96, chip: "green", memberId: "WS188", since: "4 Sep 2024", rating: "A", level: 3, exams: 122, preparingFor: "DP", gender: "Male", birthday: "25 Nov", majorSubject: "Chemistry", institute: "Chittagong University", district: "Rajshahi", subgroup: "C" },
  { name: "তাহমিনা সুলতানা", pct: 99, chip: "green", memberId: "WS187", since: "11 Oct 2022", rating: "A", level: 1, exams: 133, preparingFor: "NTRCA", gender: "Female", birthday: "4 Dec", majorSubject: "Mathematics", institute: "Rajshahi University", district: "Khulna", subgroup: "D" },
  { name: "রুবেল খান", pct: 77, chip: "yellow", memberId: "WS186", since: "18 Nov 2023", rating: "B", level: 2, exams: 144, preparingFor: "BAR / BJS", gender: "Male", birthday: "11 Jan", majorSubject: "Public Administration", institute: "Khulna University", district: "Sylhet", subgroup: "E" },
  { name: "মেহজাবিন ফেরদৌস", pct: 80, chip: "green", memberId: "WS185", since: "25 Dec 2024", rating: "A", level: 3, exams: 155, preparingFor: "BCS", gender: "Female", birthday: "18 Feb", majorSubject: "Botany", institute: "Sylhet Agricultural University", district: "Barishal", subgroup: "A" },
  { name: "শাহরিয়ার শেখ", pct: 64, chip: "yellow", memberId: "WS184", since: "4 Jan 2022", rating: "B", level: 1, exams: 166, preparingFor: "Bank", gender: "Male", birthday: "25 Mar", majorSubject: "Zoology", institute: "Barishal University", district: "Rangpur", subgroup: "B" },
  { name: "শিরিন চৌধুরী", pct: 69, chip: "yellow", memberId: "WS183", since: "11 Feb 2023", rating: "B", level: 2, exams: 177, preparingFor: "DP", gender: "Female", birthday: "4 Apr", majorSubject: "Bangla", institute: "Comilla University", district: "Mymensingh", subgroup: "C" },
  { name: "আসাদুজ্জামান কবির", pct: 74, chip: "yellow", memberId: "WS182", since: "18 Mar 2024", rating: "B", level: 3, exams: 188, preparingFor: "NTRCA", gender: "Male", birthday: "11 May", majorSubject: "Islamic Studies", institute: "Jagannath University", district: "Cumilla", subgroup: "D" },
  { name: "রোকসানা রায়", pct: 25, chip: "red", memberId: "WS181", since: "25 Apr 2022", rating: "C", level: 1, exams: 199, preparingFor: "BAR / BJS", gender: "Female", birthday: "18 Jun", majorSubject: "Marketing", institute: "Islamic University, Kushtia", district: "Narayanganj", subgroup: "E" },
  { name: "ফয়সাল রহমান", pct: 95, chip: "green", memberId: "WS180", since: "4 May 2023", rating: "A", level: 2, exams: 210, preparingFor: "BCS", gender: "Male", birthday: "25 Jul", majorSubject: "English", institute: "Rangpur Carmichael College", district: "Gazipur", subgroup: "A" },
  { name: "আফসানা দাস", pct: 98, chip: "green", memberId: "WS179", since: "11 Jun 2024", rating: "A", level: 3, exams: 221, preparingFor: "Bank", gender: "Female", birthday: "4 Aug", majorSubject: "Accounting", institute: "BUET", district: "Bogura", subgroup: "B" },
  { name: "ওয়াসিম রানা", pct: 76, chip: "yellow", memberId: "WS178", since: "18 Jul 2022", rating: "B", level: 1, exams: 232, preparingFor: "DP", gender: "Male", birthday: "11 Sep", majorSubject: "Physics", institute: "Dhaka College", district: "Jessore", subgroup: "C" },
  { name: "প্রিয়াঙ্কা খাতুন", pct: 79, chip: "yellow", memberId: "WS177", since: "25 Aug 2023", rating: "B", level: 2, exams: 243, preparingFor: "NTRCA", gender: "Female", birthday: "18 Oct", majorSubject: "Economics", institute: "Eden Mohila College", district: "Faridpur", subgroup: "D" },
  { name: "মামুনুর হক", pct: 82, chip: "green", memberId: "WS176", since: "4 Sep 2024", rating: "A", level: 3, exams: 254, preparingFor: "BAR / BJS", gender: "Male", birthday: "25 Nov", majorSubject: "Finance", institute: "Chittagong College", district: "Noakhali", subgroup: "E" },
  { name: "ঐশী হক", pct: 85, chip: "green", memberId: "WS175", since: "11 Oct 2022", rating: "A", level: 1, exams: 265, preparingFor: "BCS", gender: "Female", birthday: "4 Dec", majorSubject: "Political Science", institute: "University of Dhaka", district: "Dhaka", subgroup: "A" },
  { name: "জুবায়ের আলম", pct: 75, chip: "yellow", memberId: "WS174", since: "18 Nov 2023", rating: "B", level: 2, exams: 276, preparingFor: "Bank", gender: "Male", birthday: "11 Jan", majorSubject: "Education", institute: "Jahangirnagar University", district: "Chattogram", subgroup: "B" },
  { name: "নাদিয়া মিমি", pct: 41, chip: "yellow", memberId: "WS173", since: "25 Dec 2024", rating: "C", level: 3, exams: 287, preparingFor: "DP", gender: "Female", birthday: "18 Feb", majorSubject: "Management", institute: "Chittagong University", district: "Rajshahi", subgroup: "C" },
  { name: "খালিদ মিয়া", pct: 46, chip: "yellow", memberId: "WS172", since: "4 Jan 2022", rating: "C", level: 1, exams: 38, preparingFor: "NTRCA", gender: "Male", birthday: "25 Mar", majorSubject: "Law", institute: "Rajshahi University", district: "Khulna", subgroup: "D" },
  { name: "তৃষা ইসলাম", pct: 31, chip: "yellow", memberId: "WS171", since: "11 Feb 2023", rating: "C", level: 2, exams: 49, preparingFor: "BAR / BJS", gender: "Female", birthday: "4 Apr", majorSubject: "Statistics", institute: "Khulna University", district: "Sylhet", subgroup: "E" },
  { name: "রাফিউল আকরাম", pct: 75, chip: "yellow", memberId: "WS170", since: "18 Mar 2024", rating: "B", level: 3, exams: 60, preparingFor: "BCS", gender: "Male", birthday: "11 May", majorSubject: "Sociology", institute: "Sylhet Agricultural University", district: "Barishal", subgroup: "A" },
  { name: "ইতি আক্তার", pct: 78, chip: "yellow", memberId: "WS169", since: "25 Apr 2022", rating: "B", level: 1, exams: 71, preparingFor: "Bank", gender: "Female", birthday: "18 Jun", majorSubject: "History", institute: "Barishal University", district: "Rangpur", subgroup: "B" },
  { name: "তানজিল রশীদ", pct: 81, chip: "green", memberId: "WS168", since: "4 May 2023", rating: "A", level: 2, exams: 82, preparingFor: "DP", gender: "Male", birthday: "25 Jul", majorSubject: "Chemistry", institute: "Comilla University", district: "Mymensingh", subgroup: "C" },
  { name: "স্বর্ণা জাহান", pct: 84, chip: "green", memberId: "WS167", since: "11 Jun 2024", rating: "A", level: 3, exams: 93, preparingFor: "NTRCA", gender: "Female", birthday: "4 Aug", majorSubject: "Mathematics", institute: "Jagannath University", district: "Cumilla", subgroup: "D" },
];

const CHIP_STYLES: Record<AttendanceChip, { bg: string; text: string }> = {
  green: { bg: PCT_CHIP_BG.green, text: PCT_CHIP_TEXT },
  yellow: { bg: PCT_CHIP_BG.yellow, text: PCT_CHIP_TEXT },
  red: { bg: PCT_CHIP_BG.red, text: PCT_CHIP_TEXT },
};

function pctToChip(pct: number): AttendanceChip {
  return pct >= 75 ? "green" : pct >= 40 ? "yellow" : "red";
}

// Which subgroup a member belongs to, shown on every row (not just as a section header when
// sorted by subgroup) — spelled out as "Sub X" rather than a bare letter so it can't be
// mistaken for the attendance rating badge.
function SubgroupTag({ letter }: { letter: string }) {
  return (
    <div className="rounded-[4px] h-6 px-2 flex items-center justify-center shrink-0 bg-[#eaeef6]">
      <span className="font-['Noto_Sans',sans-serif] font-medium text-[11px] text-[#484848] leading-4 whitespace-nowrap">Sub {letter}</span>
    </div>
  );
}

// ── Subgroup data ─────────────────────────────────────────────────────────────

const SUBGROUPS = [
  { letter: "A", captain: "Atiqul Haque", members: 103, attended: 200, goalPct: 60.0, isMyGroup: true, captainRating: 4.5, captainSince: "17 Jul 2026" },
  { letter: "B", captain: "Shajenur khatun", members: 103, attended: 200, goalPct: 50.5, isMyGroup: false, captainRating: 4.5, captainSince: "17 Jul 2026" },
  { letter: "C", captain: "Anik Mahmud", members: 103, attended: 200, goalPct: 20.0, isMyGroup: false, captainRating: 4.5, captainSince: "17 Jul 2026" },
  { letter: "D", captain: "🙉🙊🙈মেহেজাবীন নুসরাত স্মৃতি✨", members: 103, attended: 200, goalPct: 85.0, isMyGroup: false, captainRating: 4.5, captainSince: "17 Jul 2026" },
  { letter: "E", captain: "অর্থহীন জীবন", members: 103, attended: 200, goalPct: 70.0, isMyGroup: false, captainRating: 4.5, captainSince: "17 Jul 2026" },
];

// ── Shared: progress bar for subgroup goal ────────────────────────────────────

function SubgroupProgressBar({ pct }: { pct: number }) {
  const isGreen = pct >= 75;
  const isYellow = pct >= 40;
  const active = isGreen ? "#264A34" : isYellow ? "#665200" : "#FF3232";
  const track = isGreen ? "#b7dfb9" : isYellow ? "#f7dc6e" : "#fff5f5";
  return (
    <div className="relative w-full h-[4px] rounded-[2px]" style={{ backgroundColor: track }}>
      <div
        className="absolute left-0 top-0 h-full rounded-[2px]"
        style={{ width: `${Math.min(pct, 100)}%`, backgroundColor: active }}
      />
      <div
        className="absolute top-1/2 size-[4px] rounded-full -translate-y-1/2 -translate-x-1/2"
        style={{ left: `${Math.min(pct, 100)}%`, backgroundColor: active }}
      />
    </div>
  );
}

type SubgroupSort = "alphabetical" | "attendance" | "memberCount";

const SUBGROUP_SORT_OPTIONS: Array<{ id: SubgroupSort; label: string }> = [
  { id: "alphabetical", label: "Alphabetical" },
  { id: "attendance", label: "Attendance" },
  { id: "memberCount", label: "Member count" },
];

function SubgroupSortBottomSheet({ value, onSelect, onClose }: { value: SubgroupSort; onSelect: (v: SubgroupSort) => void; onClose: () => void }) {
  const ns = { fontVariationSettings: '"CTGR" 0, "wdth" 100' };
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="absolute inset-0 z-50 flex flex-col justify-end bg-black/40"
      onClick={onClose}
    >
      <motion.div
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        exit={{ y: "100%" }}
        transition={{ type: "tween", duration: 0.28, ease: [0.4, 0, 0.2, 1] }}
        className="bg-white rounded-tl-[16px] rounded-tr-[16px] shadow-[0px_4px_8px_3px_rgba(0,0,0,0.15)] flex flex-col overflow-hidden pb-4"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex flex-col items-center p-4 shrink-0">
          <div className="bg-[#787878] h-1 rounded-full w-8" />
        </div>
        <div className="flex flex-col">
          {SUBGROUP_SORT_OPTIONS.map(opt => (
            <button
              key={opt.id}
              onClick={() => { onSelect(opt.id); onClose(); }}
              className="h-14 flex items-center gap-4 px-4 active:bg-gray-50 transition-colors text-left"
            >
              <div className="relative size-5 shrink-0 rounded-full border-2 flex items-center justify-center" style={{ borderColor: value === opt.id ? "#1441cc" : "#787878" }}>
                {value === opt.id && <div className="size-2.5 rounded-full bg-[#1441cc]" />}
              </div>
              <span className="font-['Noto_Sans',sans-serif] font-medium text-[16px] text-black leading-6" style={ns}>{opt.label}</span>
            </button>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
}

function zoneBarColor(pct: number) {
  return pct >= 76 ? "#6fcf7e" : pct >= 41 ? "#ffcb61" : "#f04d30";
}
// ── Screen: Group Members ─────────────────────────────────────────────────────
// Bottom sheet shown when a member row is tapped — same "Member Details" layout as the
// Joining Requests detail sheet, minus the notes/accept-reject (not applicable to an existing member).
const MEMBER_MONTHLY_EXAM_TOTAL = 300;

function MemberDetailSheet({ member, onClose, hideContactRow }: { member: Member; onClose: () => void; hideContactRow?: boolean }) {
  const infoRows: Array<[string, string]> = [
    ["Preparing for", member.preparingFor],
    ["Gender", member.gender],
    ["Birthday", member.birthday],
    ["Major subject", member.majorSubject],
    ["Educational institute", member.institute],
    ["Home district", member.district],
  ];
  const attended = Math.round((member.pct / 100) * MEMBER_MONTHLY_EXAM_TOTAL);
  const [copied, setCopied] = useState(false);

  function copyDetails() {
    const text = `${member.name}\nID: ${member.memberId}\nUser since: ${member.since}\nLevel ${member.level} • Total exam: ${member.exams}`;
    navigator.clipboard?.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    });
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="absolute inset-0 z-50 flex flex-col justify-end bg-black/40"
      onClick={onClose}
    >
      <motion.div
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        exit={{ y: "100%" }}
        transition={{ type: "tween", duration: 0.28, ease: [0.4, 0, 0.2, 1] }}
        className="bg-white rounded-tl-[16px] rounded-tr-[16px] shadow-[0px_4px_8px_3px_rgba(0,0,0,0.15)] flex flex-col overflow-hidden max-h-[85vh]"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex flex-col items-center p-4 shrink-0">
          <div className="bg-[#787878] h-1 rounded-full w-8" />
        </div>

        <div className="flex-1 overflow-y-auto flex flex-col gap-6 pb-6">
          <div className="flex gap-6 items-start px-4">
            <MemberAvatar size={80} name={member.name} />
            <div className="flex-1 min-w-0 flex flex-col gap-2">
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-3">
                  <span className="font-['Noto_Sans',sans-serif] font-medium text-[16px] text-black leading-6">{member.name}</span>
                  <RatingBadge letter={member.rating} />
                </div>
                <div className="flex gap-6 items-start">
                  <span className="font-['Noto_Sans',sans-serif] text-[12px] text-[#787878] leading-4">ID: {member.memberId}</span>
                  <span className="font-['Noto_Sans',sans-serif] text-[12px] text-[#787878] leading-4">User since: {member.since}</span>
                </div>
              </div>
              <div className="flex gap-6 items-center h-6">
                <span className="font-['Noto_Sans',sans-serif] text-[14px] text-black leading-5">Level {member.level}</span>
                <span className="font-['Noto_Sans',sans-serif] text-[14px] text-black leading-5">Total exam: {member.exams}</span>
              </div>
              {!hideContactRow && (
                <div className="flex items-center gap-4">
                  <button className="h-9 flex items-center gap-1.5 px-3 rounded-full border border-[#c7c7c7] active:bg-gray-50 transition-colors">
                    <MessageCircle className="size-4 text-green-600" strokeWidth={1.75} />
                    <span className="font-['Noto_Sans',sans-serif] font-medium text-[14px] text-black leading-5">Contact</span>
                  </button>
                  <button onClick={copyDetails} className="flex items-center gap-1.5 active:opacity-70 transition-opacity">
                    {copied ? <Check className="size-4 text-green-600" strokeWidth={2} /> : <Copy className="size-4 text-[#1441cc]" strokeWidth={1.75} />}
                    <span className="font-['Noto_Sans',sans-serif] font-medium text-[14px] text-[#1441cc] leading-5">{copied ? "Copied" : "Copy details"}</span>
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="flex flex-col gap-4 px-4">
            <div className="flex gap-3 items-center">
              <div className="flex-1 h-px bg-[#c7c5ce]" />
              <span className="font-['Noto_Sans',sans-serif] text-[12px] text-[#787878] leading-4 shrink-0">Group contribution (Monthly)</span>
              <div className="flex-1 h-px bg-[#c7c5ce]" />
            </div>
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <span className="font-['Noto_Sans',sans-serif] text-[14px] text-black leading-5">
                  Attendance ({attended}/{MEMBER_MONTHLY_EXAM_TOTAL}) <span className="text-[#787878]">(Estimated)</span>
                </span>
                <span className="font-['Noto_Sans',sans-serif] text-[14px] text-black leading-5">{member.pct.toFixed(1)}%</span>
              </div>
              <SubgroupProgressBar pct={member.pct} />
            </div>
          </div>

          <div className="flex flex-col gap-6 px-4">
            <div className="flex gap-3 items-center">
              <div className="flex-1 h-px bg-[#c7c5ce]" />
              <span className="font-['Noto_Sans',sans-serif] text-[12px] text-[#787878] leading-4 shrink-0">Member Details</span>
              <div className="flex-1 h-px bg-[#c7c5ce]" />
            </div>
            <div className="flex flex-col gap-4">
              {infoRows.map(([label, value]) => (
                <div key={label} className="flex items-center justify-between">
                  <span className="font-['Noto_Sans',sans-serif] text-[14px] text-black leading-5">{label}</span>
                  <span className="font-['Noto_Sans',sans-serif] text-[14px] text-black leading-5 text-right">{value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="shrink-0 flex flex-col gap-2 p-3">
          <button
            onClick={onClose}
            className="w-full h-[56px] rounded-[100px] border border-[#c7c7c7] flex items-center justify-center"
          >
            <span className="font-['Noto_Sans',sans-serif] font-medium text-[16px] leading-[24px] tracking-[0.15px] text-[#484848]">Close</span>
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

type MemberSort = "attendance" | "alphabetical" | "subgroup";

const SORT_OPTIONS: Array<{ id: MemberSort; label: string }> = [
  { id: "attendance", label: "Attendance" },
  { id: "alphabetical", label: "Alphabetical" },
  { id: "subgroup", label: "Sub group" },
];

const SUBGROUP_MEMBER_SORT_OPTIONS: Array<{ id: MemberSort; label: string }> = [
  { id: "attendance", label: "Attendance" },
  { id: "alphabetical", label: "Alphabetical" },
];

function SortBottomSheet({ value, onSelect, onClose, options = SORT_OPTIONS }: { value: MemberSort; onSelect: (v: MemberSort) => void; onClose: () => void; options?: Array<{ id: MemberSort; label: string }> }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="absolute inset-0 z-50 flex flex-col justify-end bg-black/40"
      onClick={onClose}
    >
      <motion.div
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        exit={{ y: "100%" }}
        transition={{ type: "tween", duration: 0.28, ease: [0.4, 0, 0.2, 1] }}
        className="bg-white rounded-tl-[16px] rounded-tr-[16px] shadow-[0px_4px_8px_3px_rgba(0,0,0,0.15)] flex flex-col overflow-hidden pb-4"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex flex-col items-center p-4 shrink-0">
          <div className="bg-[#787878] h-1 rounded-full w-8" />
        </div>
        <div className="flex flex-col">
          {options.map(opt => (
            <button
              key={opt.id}
              onClick={() => { onSelect(opt.id); onClose(); }}
              className="h-14 flex items-center gap-4 px-4 active:bg-gray-50 transition-colors text-left"
            >
              <div className="relative size-5 shrink-0 rounded-full border-2 flex items-center justify-center" style={{ borderColor: value === opt.id ? "#1441cc" : "#787878" }}>
                {value === opt.id && <div className="size-2.5 rounded-full bg-[#1441cc]" />}
              </div>
              <span className="font-['Noto_Sans',sans-serif] font-medium text-[16px] text-black leading-6">{opt.label}</span>
            </button>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
}

function GroupMembersScreen({ onBack, group }: { onBack: () => void; group: Group }) {
  const ns = { fontVariationSettings: '"CTGR" 0, "wdth" 100' };
  const [searching, setSearching] = useState(false);
  const [query, setQuery] = useState("");
  const [sortBy, setSortBy] = useState<MemberSort>("attendance");
  const [sorting, setSorting] = useState(false);
  const [selected, setSelected] = useState<Member | null>(null);

  const filtered = (query.trim() ? MEMBER_LIST.filter(m => m.name.toLowerCase().includes(query.trim().toLowerCase())) : MEMBER_LIST)
    .slice()
    .sort((a, b) => {
      if (sortBy === "alphabetical") return a.name.localeCompare(b.name);
      if (sortBy === "subgroup") return a.subgroup.localeCompare(b.subgroup);
      return b.pct - a.pct;
    });

  return (
    <div className="flex flex-col h-full bg-white overflow-hidden relative">
      <AnimatePresence>
        {selected && (
          <MemberDetailSheet
            member={selected}
            onClose={() => setSelected(null)}
          />
        )}
        {sorting && <SortBottomSheet value={sortBy} onSelect={setSortBy} onClose={() => setSorting(false)} />}
      </AnimatePresence>

      <InlineSearchHeader
        title="Group members"
        onBack={onBack}
        searching={searching}
        onStartSearch={() => setSearching(true)}
        query={query}
        onQueryChange={setQuery}
        onExit={() => { setSearching(false); setQuery(""); }}
        placeholder="Search by name"
        trailing={
          <button
            onClick={() => setSorting(true)}
            aria-label="Sort"
            className="size-12 flex items-center justify-center rounded-full active:bg-gray-100 transition-colors"
          >
            <ArrowUpDown className="size-5 text-[#484848]" strokeWidth={1.5} />
          </button>
        }
      />

      {/* Sub-header: total count + badge */}
      <div className="shrink-0 flex items-center gap-[8px] px-4 py-[6px]">
        <span className="font-['Noto_Sans',sans-serif] font-medium text-[14px] text-black tracking-[0.1px] leading-[20px]" style={ns}>
          Total members ({group.members}/100)
        </span>
        <div className="bg-[#0c5fff] rounded-[4px] px-2 h-5 flex items-center shrink-0">
          <span className="font-['Noto_Sans',sans-serif] font-medium text-[10px] text-white leading-[16px]" style={ns}>
            Open to Join
          </span>
        </div>
      </div>

      {/* Column labels */}
      <div className="shrink-0 flex items-center justify-between px-4 py-2">
        <span className="font-['Noto_Sans',sans-serif] font-medium text-[12px] text-[#787878] leading-4" style={ns}>Member</span>
        <span className="font-['Noto_Sans',sans-serif] font-medium text-[12px] text-[#787878] leading-4" style={ns}>Attendance</span>
      </div>

      {/* Member list */}
      <div className="flex-1 overflow-y-auto">
        {filtered.map((member, i) => {
          const chip = CHIP_STYLES[pctToChip(member.pct)];
          const showSubgroupHeader = sortBy === "subgroup" && (i === 0 || filtered[i - 1].subgroup !== member.subgroup);
          return (
            <div key={member.memberId}>
              {showSubgroupHeader && (
                <div className="px-4 pt-3 pb-1 bg-[#f4f6fa]">
                  <span className="font-['Noto_Sans',sans-serif] font-medium text-[12px] text-[#787878] leading-4" style={ns}>
                    Subgroup {member.subgroup}
                  </span>
                </div>
              )}
              <button
                onClick={() => setSelected(member)}
                className="w-full flex items-center justify-between px-4 py-3 bg-white active:bg-gray-50 transition-colors text-left"
              >
                {/* Avatar + name */}
                <div className="flex items-center gap-2 min-w-0 flex-1">
                  <MemberAvatar size={30} name={member.name} />
                  <span
                    className="flex-1 font-['Noto_Sans',sans-serif] font-medium text-[16px] text-black tracking-[0.15px] leading-[24px] truncate"
                    style={ns}
                  >
                    {member.name}
                  </span>
                </div>
                {/* Subgroup + attendance percentage */}
                <div className="flex items-center gap-1 shrink-0 ml-2">
                  <SubgroupTag letter={member.subgroup} />
                  <RatingBadge letter={member.rating} />
                  {/* Attendance chip — same design as the percentage chip in the Available Groups list */}
                  <div
                    className="rounded-[4px] h-6 px-2 flex items-center justify-center shrink-0"
                    style={{ backgroundColor: chip.bg }}
                  >
                    <span
                      className="font-['Noto_Sans',sans-serif] text-[12px] font-normal leading-4"
                      style={{ color: chip.text }}
                    >
                      {member.pct.toFixed(1)}%
                    </span>
                  </div>
                </div>
              </button>
              {i < filtered.length - 1 && (
                <div className="mx-0 border-t border-[#C7C5CE]" />
              )}
            </div>
          );
        })}
        {filtered.length === 0 && (
          <p className="px-4 py-8 text-center font-['Noto_Sans',sans-serif] text-[14px] text-[#787878]">No members found.</p>
        )}
      </div>
    </div>
  );
}

// ── Screen: Subgroup List ─────────────────────────────────────────────────────

// ── Goal detail data ──────────────────────────────────────────────────────────

interface ExamListItem {
  name: string;
  attended: number;
  total: number;
}

const EXAM_LIST: ExamListItem[] = [
  { name: "ফ্রি সাপ্তাহিক মডেল টেস্ট", attended: 8, total: MEMBER_LIST.length },
  { name: "১৪০ দিনে ৪৭তম বিসিএস প্রস্তুতি", attended: 6, total: MEMBER_LIST.length },
  { name: "গুরুত্বপূর্ণ টপিকের উপর পরীক্ষা", attended: 10, total: MEMBER_LIST.length },
  { name: "ব্যাংক নিয়োগ প্রস্তুতি - লং কোর্স", attended: 5, total: MEMBER_LIST.length },
  { name: "২০২২ সাল ভিত্তিক সিনিয়র অফিসার নিয়োগ প্রস্তুতি", attended: 7, total: MEMBER_LIST.length },
  { name: "ব্যাংক ডেইলি কুইজ", attended: 9, total: MEMBER_LIST.length },
  { name: "ব্যাংক মডেল টেস্ট [সাপ্তাহিক]", attended: 4, total: MEMBER_LIST.length },
];

type GoalMode = "today" | "monthly";

// The admin's own group-level "Today's goal" / "Monthly goal" card — both use the same
// fixed numbers in Figma, which don't derive from any single subgroup's member count/goalPct.
const ADMIN_GOAL_OVERRIDE = { goalPct: 60.0, bigCount: 303, attended: 150, remaining: 53, barPct: 78.82 };

// ── Screen: Today's Goal / Monthly Goal ───────────────────────────────────────

// Override lets a caller replace the subgroup-derived numbers with fixed values — used for
// the admin's own group-level "Today's goal" entry point, whose card totals (303 / 60.0% /
// 150 attended / 53 remaining) don't reduce to any subgroup's member/goalPct math.
interface GoalDetailOverride { goalPct: number; bigCount: number; attended: number; remaining: number; barPct: number }

function GoalDetailScreen({ mode, sg, onBack, onSelectExam, onViewAttendance, override }: { mode: GoalMode; sg: SubgroupData; onBack: () => void; onSelectExam: (exam: ExamListItem) => void; onViewAttendance: (exam: ExamListItem) => void; override?: GoalDetailOverride }) {
  const ns = { fontVariationSettings: '"CTGR" 0, "wdth" 100' };
  const [showExamsInfo, setShowExamsInfo] = useState(false);

  const isToday = mode === "today";
  const title = isToday ? "Today's goal" : "Monthly goal";
  const attended = override ? override.attended : isToday ? Math.round(sg.members * sg.goalPct / 100) : sg.attended;
  const total = isToday ? sg.members : sg.members * 4;
  const remaining = override ? override.remaining : Math.max(total - attended, 0);
  const bigCount = override ? override.bigCount : attended + remaining;
  const barPct = override ? override.barPct : total > 0 ? (attended / total) * 100 : 0;
  const goalPct = override ? override.goalPct : sg.goalPct;

  const chipColor = pctChipStyle(goalPct);

  return (
    <div className="flex flex-col h-full bg-white overflow-hidden relative">
      <AnimatePresence>
        {showExamsInfo && (
          <MandatoryExamsInfoBottomSheet onClose={() => setShowExamsInfo(false)} />
        )}
      </AnimatePresence>

      {/* App bar */}
      <div className="shrink-0 h-12 bg-white flex items-center px-1">
        <button
          onClick={onBack}
          className="size-12 flex items-center justify-center rounded-full active:bg-gray-100 transition-colors"
        >
          <ArrowLeft className="size-6 text-[#484848]" strokeWidth={2} />
        </button>
        <p
          className="absolute left-14 right-14 font-['Noto_Sans',sans-serif] font-normal text-[18px] text-black leading-[28px] truncate"
          style={ns}
        >
          {title}
        </p>
      </div>

      {/* Scrollable body */}
      <div className="flex-1 overflow-y-auto">
        <div className="flex flex-col gap-6 px-4 pt-4 pb-8">

          {/* Summary card */}
          <div className="bg-white rounded-[12px] border border-[#e3e3e3] p-3 flex flex-col gap-3">
            {/* Live Exams header + chip */}
            <div className="flex items-center justify-between w-full">
              <span className="font-['Noto_Sans',sans-serif] font-normal text-[14px] text-[#484848] leading-[20px]" style={ns}>
                Live Exams (Estimated)
              </span>
              <div className="rounded-[4px] px-2 h-5 flex items-center" style={{ backgroundColor: chipColor.bg }}>
                <span
                  className="font-['Noto_Sans',sans-serif] font-normal text-[12px] leading-[16px]"
                  style={{ ...ns, color: chipColor.text }}
                >
                  {goalPct.toFixed(1)}%
                </span>
              </div>
            </div>

            {/* Big count */}
            <span
              className="font-['Noto_Sans',sans-serif] font-medium text-[16px] text-black tracking-[0.15px] leading-[24px]"
              style={ns}
            >
              {bigCount}
            </span>

            {/* Progress bar */}
            <ActivityProgressBar pct={barPct} />

            {/* Legend row */}
            <div className="flex items-center justify-between w-full">
              {/* Attended */}
              <div className="flex items-center gap-1">
                <svg className="size-2 shrink-0" viewBox="0 0 8 8" fill="none">
                  <circle cx="4" cy="4" r="4" fill="#1441CC" />
                </svg>
                <span className="font-['Noto_Sans',sans-serif] font-medium text-[12px] text-[#484848] leading-[16px]" style={ns}>
                  Attended:
                </span>
                <span className="font-['Noto_Sans',sans-serif] font-medium text-[12px] text-black leading-[16px]" style={ns}>
                  {attended}
                </span>
              </div>
              {/* Remaining */}
              <div className="flex items-center gap-1">
                <svg className="size-2 shrink-0" viewBox="0 0 8 8" fill="none">
                  <circle cx="4" cy="4" r="4" fill="#D6E4FF" />
                </svg>
                <span className="font-['Noto_Sans',sans-serif] font-medium text-[12px] text-[#484848] leading-[16px]" style={ns}>
                  Remaining (Est):
                </span>
                <span className="font-['Noto_Sans',sans-serif] font-medium text-[12px] text-black leading-[16px]" style={ns}>
                  {remaining}
                </span>
              </div>
            </div>

            {/* View attendance button */}
            <div className="flex justify-center">
              <button
                onClick={() => onViewAttendance(EXAM_LIST[0])}
                className="px-4 py-[10px] flex items-center justify-center active:opacity-70 transition-opacity"
              >
                <span className="font-['Noto_Sans',sans-serif] font-medium text-[14px] text-[#1441cc] leading-[20px]" style={ns}>
                  View attendance
                </span>
              </button>
            </div>
          </div>

          {/* Mandatory exam list */}
          <div className="flex flex-col gap-3">
            {/* Section header */}
            <div className="flex items-center justify-between w-full">
              <span
                className="font-['Noto_Sans',sans-serif] font-medium text-[16px] text-black tracking-[0.15px] leading-[24px]"
                style={ns}
              >
                বাধ্যতামূলক পরিক্ষাসমুহ
              </span>
              {/* Info icon */}
              <button
                onClick={() => setShowExamsInfo(true)}
                className="size-12 flex items-center justify-center rounded-full active:bg-gray-100 transition-colors"
              >
                <svg className="size-[19px]" fill="none" viewBox="0 0 19 19">
                  <path d={goalSvgPaths.p3e27cc90} fill="#484848" />
                </svg>
              </button>
            </div>

            {/* Exam rows */}
            <div className="flex flex-col gap-1">
              {EXAM_LIST.map((exam) => (
                <button
                  key={exam.name}
                  onClick={() => onSelectExam(exam)}
                  className="h-12 w-full bg-[#f4f6fa] rounded-[8px] flex items-center justify-between px-4 active:opacity-70 transition-opacity"
                >
                  <span
                    className="flex-1 font-['Noto_Sans',sans-serif] font-medium text-[14px] text-black leading-[20px] truncate text-left"
                    style={ns}
                  >
                    {exam.name}
                  </span>
                  <div className="flex items-center gap-1 shrink-0 ml-2">
                    <span className="font-['Noto_Sans',sans-serif] font-medium text-[14px] leading-[20px]" style={ns}>
                      <span className="text-black">{exam.attended}/</span>
                      <span className="text-[#484848]">{exam.total}</span>
                    </span>
                    <svg className="size-6" fill="none" viewBox="0 0 24 24">
                      <mask id={`m-ar-${exam.name}`} maskUnits="userSpaceOnUse" style={{ maskType: "alpha" }} width="24" height="24">
                        <rect fill="#D9D9D9" width="24" height="24" />
                      </mask>
                      <g mask={`url(#m-ar-${exam.name})`}>
                        <path d={goalSvgPaths.p3ecf1680} fill="black" />
                      </g>
                    </svg>
                  </div>
                </button>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

// ── Screen: Subgroup Detail ───────────────────────────────────────────────────

type SubgroupData = typeof SUBGROUPS[0];

function ActivityProgressBar({ pct }: { pct: number }) {
  const fill = Math.min(Math.max(pct, 0), 100);
  return (
    <div className="relative w-full h-3 flex items-center">
      <div className="absolute left-0 h-1 rounded bg-[#1441cc]" style={{ width: `${fill}%` }} />
      <div className="absolute h-1 rounded bg-[#d6e4ff]" style={{ left: `${fill}%`, right: 0 }} />
      <div className="absolute size-1 rounded-full bg-[#1441cc]" style={{ left: `calc(${fill}% - 2px)` }} />
    </div>
  );
}

function CaptainDetailsBottomSheet({ sg, onClose }: { sg: SubgroupData; onClose: () => void }) {
  const ns = { fontVariationSettings: '"CTGR" 0, "wdth" 100' };
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="absolute inset-0 z-50 flex flex-col justify-end bg-black/40"
      onClick={onClose}
    >
      <motion.div
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        exit={{ y: "100%" }}
        transition={{ type: "tween", duration: 0.28, ease: [0.4, 0, 0.2, 1] }}
        className="bg-white rounded-tl-[16px] rounded-tr-[16px] shadow-[0px_4px_8px_3px_rgba(0,0,0,0.15)] flex flex-col overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex flex-col items-center p-4 shrink-0">
          <div className="bg-[#787878] h-1 rounded-full w-8" />
        </div>

        <div className="px-4 pb-4 shrink-0">
          <p className="font-['Noto_Sans',sans-serif] font-normal text-[24px] leading-[32px] text-black" style={ns}>Captain Details</p>
        </div>

        <div className="border-t border-[#e3e3e3]" />

        <div className="flex items-center gap-3 p-4">
          <MemberAvatar size={56} name={sg.captain} />
          <div className="flex flex-col gap-1 min-w-0">
            <p className="font-['Noto_Sans',sans-serif] font-medium text-[18px] text-black leading-[26px] truncate" style={ns}>{sg.captain}</p>
            <div className="flex items-center gap-1.5">
              <Star className="size-4 text-[#f5c518] fill-[#f5c518] shrink-0" />
              <span className="font-['Noto_Sans',sans-serif] font-semibold text-[14px] text-black leading-[20px]">{sg.captainRating.toFixed(1)}</span>
              <span className="font-['Noto_Sans',sans-serif] font-normal text-[14px] text-[#787878] leading-[20px]">Captain since: {sg.captainSince}</span>
            </div>
          </div>
        </div>

        <div className="shrink-0 flex items-center gap-3 p-3">
          <button onClick={onClose} className="px-6 h-12 rounded-full border border-[#c7c7c7] flex items-center justify-center active:bg-gray-50 transition-colors">
            <span className="font-['Noto_Sans',sans-serif] font-medium text-[16px] text-[#484848]">Close</span>
          </button>
          <button className="flex-1 h-12 rounded-full border border-[#c7c7c7] flex items-center justify-center gap-1.5 active:bg-gray-50 transition-colors">
            <MessageCircle className="size-4 text-green-600" strokeWidth={1.75} />
            <span className="font-['Noto_Sans',sans-serif] font-medium text-[16px] text-black">Contact</span>
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

function SubgroupDetailScreen({ onBack, sg, onTodayGoal, onMonthlyGoal }: { onBack: () => void; sg: SubgroupData; onTodayGoal: () => void; onMonthlyGoal: () => void }) {
  const ns = { fontVariationSettings: '"CTGR" 0, "wdth" 100' };
  const [sortBy, setSortBy] = useState<MemberSort>("attendance");
  const [sorting, setSorting] = useState(false);
  const [showCaptain, setShowCaptain] = useState(false);
  const [selected, setSelected] = useState<Member | null>(null);

  const sortedMembers = MEMBER_LIST.slice().sort((a, b) => (
    sortBy === "alphabetical" ? a.name.localeCompare(b.name) : b.pct - a.pct
  ));

  const goalChipColor = pctChipStyle(sg.goalPct);

  const todayAttended = Math.round(sg.members * sg.goalPct / 100);
  const todayTotal = sg.members;
  const monthAttended = sg.attended;
  const monthTotal = sg.members * 4;
  const todayPct = sg.goalPct;
  const monthPct = Math.round((sg.attended / (sg.members * 4)) * 100);

  function GoalCard({ title, attended, total, footerLabel, footerPct, onPress }: {
    title: string; attended: number; total: number; footerLabel: string; footerPct: number; onPress: () => void;
  }) {
    const barPct = total > 0 ? (attended / total) * 100 : 0;
    return (
      <button
        onClick={onPress}
        className="flex-1 min-w-0 bg-white rounded-[12px] border border-[#e3e3e3] p-2 flex flex-col gap-3 text-left active:opacity-70 transition-opacity"
      >
        {/* Header */}
        <div className="flex items-center justify-between w-full">
          <span className="font-['Noto_Sans',sans-serif] font-medium text-[12px] text-[#484848] leading-[16px]" style={ns}>
            {title}
          </span>
          <svg className="size-5 shrink-0" fill="none" viewBox="0 0 20 20">
            <mask id={`m-cf-${title}`} maskUnits="userSpaceOnUse" style={{ maskType: "alpha" }} width="20" height="20">
              <rect fill="#D9D9D9" width="20" height="20" />
            </mask>
            <g mask={`url(#m-cf-${title})`}>
              <path d={subgroupDetailSvgPaths.p1c848e00} fill="#484848" />
            </g>
          </svg>
        </div>
        {/* Count + progress */}
        <div className="flex flex-col gap-1 w-full">
          <span className="font-['Noto_Sans',sans-serif] font-medium text-[12px] text-black leading-[16px]" style={ns}>
            {attended} / {total}
          </span>
          <ActivityProgressBar pct={barPct} />
        </div>
        {/* Footer */}
        <div className="flex items-center justify-between w-full">
          <span className="font-['Noto_Sans',sans-serif] font-normal text-[12px] text-[#484848] leading-[16px]" style={ns}>
            {footerLabel}
          </span>
          <span className="font-['Noto_Sans',sans-serif] font-normal text-[12px] text-black leading-[16px]" style={ns}>
            {footerPct.toFixed(0)}%
          </span>
        </div>
      </button>
    );
  }

  return (
    <div className="flex flex-col h-full bg-white overflow-hidden relative">
      <AnimatePresence>
        {sorting && (
          <SortBottomSheet value={sortBy} onSelect={setSortBy} onClose={() => setSorting(false)} options={SUBGROUP_MEMBER_SORT_OPTIONS} />
        )}
        {showCaptain && (
          <CaptainDetailsBottomSheet
            sg={sg}
            onClose={() => setShowCaptain(false)}
          />
        )}
        {selected && (
          <MemberDetailSheet
            member={selected}
            onClose={() => setSelected(null)}
          />
        )}
      </AnimatePresence>

      {/* App bar */}
      <div className="shrink-0 h-12 bg-white flex items-center px-1">
        <button
          onClick={onBack}
          className="size-12 flex items-center justify-center rounded-full active:bg-gray-100 transition-colors"
        >
          <ArrowLeft className="size-6 text-[#484848]" strokeWidth={2} />
        </button>
        <p
          className="absolute left-14 right-14 font-['Noto_Sans',sans-serif] font-normal text-[18px] text-black leading-[28px] truncate"
          style={ns}
        >
          Subgroup
        </p>
      </div>

      {/* Scrollable body */}
      <div className="flex-1 overflow-y-auto">
        <div className="flex flex-col gap-6 pb-8">

          {/* Subgroup header card */}
          <div className="flex items-center gap-3 px-4 pt-3">
            {/* 60px letter avatar */}
            <div className="relative shrink-0 size-[60px]">
              <svg className="absolute inset-0 size-full" fill="none" viewBox="0 0 60 60">
                <circle cx="30" cy="30" r="30" fill="#E6E6E6" />
              </svg>
              <span
                className="absolute inset-0 flex items-center justify-center font-['Noto_Sans',sans-serif] font-medium text-[26px] text-[#1d1b20] leading-none"
                style={ns}
              >
                {sg.letter}
              </span>
            </div>
            {/* Info */}
            <div className="flex-1 min-w-0 flex flex-col gap-2">
              {/* Captain + info icon */}
              <button onClick={() => setShowCaptain(true)} className="flex items-center gap-2 active:opacity-70 transition-opacity text-left">
                <span
                  className="font-['Noto_Sans',sans-serif] font-medium text-[16px] text-black leading-[24px] shrink-0"
                  style={ns}
                >
                  Captain: {sg.captain}
                </span>
                <svg className="size-[22px] shrink-0" fill="none" viewBox="0 0 22 22">
                  <mask id="m-info" maskUnits="userSpaceOnUse" style={{ maskType: "alpha" }} width="22" height="22">
                    <rect fill="#D9D9D9" width="22" height="22" />
                  </mask>
                  <g mask="url(#m-info)">
                    <path d={subgroupDetailSvgPaths.p3fdad500} fill="#484848" />
                  </g>
                </svg>
              </button>
              {/* Goal chip + stats */}
              <div className="flex items-center gap-2">
                <div className="rounded-[4px] px-2 h-5 flex items-center" style={{ backgroundColor: goalChipColor.bg }}>
                  <span
                    className="font-['Noto_Sans',sans-serif] font-normal text-[12px] leading-[16px]"
                    style={{ ...ns, color: goalChipColor.text }}
                  >
                    {sg.goalPct.toFixed(1)}%
                  </span>
                </div>
                <span
                  className="font-['Noto_Sans',sans-serif] font-normal text-[12px] text-[#484848] leading-[16px]"
                  style={ns}
                >
                  {sg.members} members • {sg.attended} attended
                </span>
              </div>
            </div>
          </div>

          {/* Subgroup activities */}
          <div className="flex flex-col gap-4">
            <span
              className="px-4 font-['Noto_Sans',sans-serif] font-medium text-[14px] text-black tracking-[0.1px] leading-[20px]"
              style={ns}
            >
              Subgroup activities
            </span>
            <div className="flex gap-2 px-4">
              <GoalCard
                title="Today's Goal"
                attended={todayAttended}
                total={todayTotal}
                footerLabel="Today's Attendance"
                footerPct={todayPct}
                onPress={onTodayGoal}
              />
              <GoalCard
                title="Monthly Goal"
                attended={monthAttended}
                total={monthTotal}
                footerLabel="Monthly Attendance"
                footerPct={monthPct}
                onPress={onMonthlyGoal}
              />
            </div>
          </div>

          {/* Subgroup members section */}
          <div className="flex flex-col gap-2">
            {/* Header row */}
            <div className="flex items-center justify-between px-4">
              <span
                className="font-['Noto_Sans',sans-serif] font-medium text-[16px] text-black tracking-[0.15px] leading-[24px]"
                style={ns}
              >
                Subgroup members
              </span>
              <button
                onClick={() => setSorting(true)}
                aria-label="Sort"
                className="size-12 flex items-center justify-center rounded-full active:bg-gray-100 transition-colors"
              >
                <ArrowUpDown className="size-5 text-[#484848]" strokeWidth={1.5} />
              </button>
            </div>
            {/* Column labels */}
            <div className="flex items-center justify-between px-4">
              <span className="font-['Noto_Sans',sans-serif] font-normal text-[12px] text-[#787878] leading-[16px]" style={ns}>Member</span>
              <span className="font-['Noto_Sans',sans-serif] font-normal text-[12px] text-[#787878] leading-[16px]" style={ns}>Attendance</span>
            </div>
            {/* Member list */}
            {sortedMembers.map((member, i) => {
              const chip = CHIP_STYLES[pctToChip(member.pct)];
              return (
                <div key={member.memberId}>
                  <button
                    onClick={() => setSelected(member)}
                    className="w-full flex items-center justify-between px-4 py-3 bg-white active:bg-gray-50 transition-colors text-left"
                  >
                    <div className="flex items-center gap-2 min-w-0 flex-1">
                      <MemberAvatar size={30} name={member.name} />
                      <span
                        className="flex-1 font-['Noto_Sans',sans-serif] font-medium text-[16px] text-black tracking-[0.15px] leading-[24px] truncate"
                        style={ns}
                      >
                        {member.name}
                      </span>
                    </div>
                    <div className="flex items-center gap-1 shrink-0 ml-2">
                      <RatingBadge letter={member.rating} />
                      <div className="rounded-[16px] px-3 py-1 shrink-0" style={{ backgroundColor: chip.bg }}>
                        <span
                          className="font-['Noto_Sans',sans-serif] font-medium text-[12px] leading-[16px]"
                          style={{ ...ns, color: chip.text }}
                        >
                          {member.pct.toFixed(1)}%
                        </span>
                      </div>
                    </div>
                  </button>
                  {i < sortedMembers.length - 1 && <div className="border-t border-[#C7C5CE]" />}
                </div>
              );
            })}
          </div>

        </div>
      </div>
    </div>
  );
}

// ──────────────────────────────────────────────────────────────────────────────

function SubgroupListScreen({ onBack, group, onDetail }: { onBack: () => void; group: Group; onDetail: (sg: typeof SUBGROUPS[0]) => void }) {
  const ns = { fontVariationSettings: '"CTGR" 0, "wdth" 100' };
  const [sortBy, setSortBy] = useState<SubgroupSort>("alphabetical");
  const [sorting, setSorting] = useState(false);

  const myGroup = SUBGROUPS.find(s => s.isMyGroup)!;
  const otherGroups = SUBGROUPS.filter(s => !s.isMyGroup).slice().sort((a, b) => {
    if (sortBy === "attendance") return b.goalPct - a.goalPct;
    if (sortBy === "memberCount") return b.members - a.members;
    return a.captain.localeCompare(b.captain);
  });

  function SubgroupCard({ sg }: { sg: typeof SUBGROUPS[0] }) {
    return (
      <div className="bg-[#f4f6fa] rounded-[12px] w-full p-[12px] flex flex-col gap-4 active:opacity-70 transition-opacity cursor-pointer" onClick={() => onDetail(sg)}>
        {/* Profile row */}
        <div className="flex items-center gap-2 w-full">
          {/* Letter avatar */}
          <div className="relative shrink-0 size-[50px]">
            <svg className="absolute inset-0 size-full" fill="none" viewBox="0 0 50 50">
              <circle cx="25" cy="25" r="25" fill="#E6E6E6" />
            </svg>
            <span
              className="absolute inset-0 flex items-center justify-center font-['Noto_Sans',sans-serif] font-medium text-[22px] text-[#1d1b20] leading-none"
              style={ns}
            >
              {sg.letter}
            </span>
          </div>
          {/* Info */}
          <div className="flex-1 min-w-0 flex flex-col gap-2">
            <div className="flex items-center justify-between gap-2 w-full">
              <span
                className="flex-1 font-['Noto_Sans',sans-serif] font-medium text-[16px] text-black leading-[24px] truncate"
                style={ns}
              >
                Captain: {sg.captain}
              </span>
              <ChevronRight className="size-6 text-[#484848] shrink-0" strokeWidth={1.5} />
            </div>
            <span
              className="font-['Noto_Sans',sans-serif] font-normal text-[12px] text-[#484848] leading-[16px]"
              style={ns}
            >
              {sg.members} members • {sg.attended} attended
            </span>
          </div>
        </div>
        {/* Goal progress */}
        <div className="flex flex-col gap-2 w-full">
          <div className="flex items-center justify-between w-full">
            <span
              className="font-['Noto_Sans',sans-serif] font-normal text-[14px] text-black leading-[20px]"
              style={ns}
            >
              {"Today's goal"}
            </span>
            <span
              className="font-['Noto_Sans',sans-serif] font-normal text-[14px] text-black leading-[20px]"
              style={ns}
            >
              {sg.goalPct.toFixed(1)}%
            </span>
          </div>
          <SubgroupProgressBar pct={sg.goalPct} />
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-white overflow-hidden relative">
      <AnimatePresence>
        {sorting && (
          <SubgroupSortBottomSheet value={sortBy} onSelect={setSortBy} onClose={() => setSorting(false)} />
        )}
      </AnimatePresence>

      {/* App bar */}
      <div className="shrink-0 h-12 bg-white flex items-center justify-between px-1">
        <button
          onClick={onBack}
          className="size-12 flex items-center justify-center rounded-full active:bg-gray-100 transition-colors"
        >
          <ArrowLeft className="size-6 text-[#484848]" strokeWidth={2} />
        </button>
        <p
          className="absolute left-14 right-14 font-['Noto_Sans',sans-serif] font-normal text-[18px] text-black leading-[28px] truncate"
          style={ns}
        >
          Subgroups ({group.subgroups})
        </p>
        <button
          onClick={() => setSorting(true)}
          aria-label="Sort subgroups"
          className="size-12 flex items-center justify-center rounded-full active:bg-gray-100 transition-colors"
        >
          <ArrowUpDown className="size-5 text-[#484848]" strokeWidth={1.5} />
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="flex flex-col gap-6 px-4 pt-4 pb-8">
          {/* My subgroup */}
          <div className="flex flex-col gap-3">
            <span
              className="font-['Noto_Sans',sans-serif] font-medium text-[16px] text-black tracking-[0.15px] leading-[24px]"
              style={ns}
            >
              My subgroup
            </span>
            <SubgroupCard sg={myGroup} />
          </div>

          {/* Other subgroups */}
          <div className="flex flex-col gap-3">
            <span
              className="font-['Noto_Sans',sans-serif] font-medium text-[16px] text-black tracking-[0.15px] leading-[24px]"
              style={ns}
            >
              Other subgroups
            </span>
            <div className="flex flex-col gap-3">
              {otherGroups.map(sg => (
                <SubgroupCard key={sg.letter} sg={sg} />
              ))}
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}

function AttendanceSortBottomSheet({ desc, onSelect, onClose }: { desc: boolean; onSelect: (desc: boolean) => void; onClose: () => void }) {
  const options = [{ id: true, label: "High to low" }, { id: false, label: "Low to high" }];
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="absolute inset-0 z-50 flex flex-col justify-end bg-black/40"
      onClick={onClose}
    >
      <motion.div
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        exit={{ y: "100%" }}
        transition={{ type: "tween", duration: 0.28, ease: [0.4, 0, 0.2, 1] }}
        className="bg-white rounded-tl-[16px] rounded-tr-[16px] shadow-[0px_4px_8px_3px_rgba(0,0,0,0.15)] flex flex-col overflow-hidden pb-4"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex flex-col items-center p-4 shrink-0">
          <div className="bg-[#787878] h-1 rounded-full w-8" />
        </div>
        <p className="px-4 pb-4 font-['Noto_Sans',sans-serif] font-normal text-[24px] leading-[32px] text-black">Sort by attendance</p>
        <div className="border-t border-[#c7c5ce]" />
        <div className="flex flex-col pt-2">
          {options.map(opt => (
            <button
              key={String(opt.id)}
              onClick={() => { onSelect(opt.id); onClose(); }}
              className="h-14 flex items-center gap-4 px-4 active:bg-gray-50 transition-colors text-left"
            >
              <div className="relative size-5 shrink-0 rounded-full border-2 flex items-center justify-center" style={{ borderColor: desc === opt.id ? "#1441cc" : "#787878" }}>
                {desc === opt.id && <div className="size-2.5 rounded-full bg-[#1441cc]" />}
              </div>
              <span className="font-['Noto_Sans',sans-serif] font-medium text-[16px] text-black leading-6">{opt.label}</span>
            </button>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
}

// ── Screen: Exam Attendance — Member list ─────────────────────────────────────

function ExamAttendanceMembersScreen({ onBack }: { onBack: () => void }) {
  const ns = { fontVariationSettings: '"CTGR" 0, "wdth" 100' };
  const [searching, setSearching] = useState(false);
  const [query, setQuery] = useState("");
  const [sortBy, setSortBy] = useState<MemberSort>("attendance");
  const [sorting, setSorting] = useState(false);
  const [selected, setSelected] = useState<Member | null>(null);

  const filtered = (query.trim() ? MEMBER_LIST.filter(m => m.name.toLowerCase().includes(query.trim().toLowerCase())) : MEMBER_LIST)
    .slice()
    .sort((a, b) => {
      if (sortBy === "alphabetical") return a.name.localeCompare(b.name);
      if (sortBy === "subgroup") return a.subgroup.localeCompare(b.subgroup);
      return b.pct - a.pct;
    });

  return (
    <div className="flex flex-col h-full bg-white overflow-hidden relative">
      <AnimatePresence>
        {selected && <MemberDetailSheet member={selected} hideContactRow onClose={() => setSelected(null)} />}
        {sorting && <SortBottomSheet value={sortBy} onSelect={setSortBy} onClose={() => setSorting(false)} options={SUBGROUP_MEMBER_SORT_OPTIONS} />}
      </AnimatePresence>

      <InlineSearchHeader
        title="Member attendance"
        onBack={onBack}
        searching={searching}
        onStartSearch={() => setSearching(true)}
        query={query}
        onQueryChange={setQuery}
        onExit={() => { setSearching(false); setQuery(""); }}
        placeholder="Search by name"
        trailing={
          <button
            onClick={() => setSorting(true)}
            aria-label="Sort"
            className="size-12 flex items-center justify-center rounded-full active:bg-gray-100 transition-colors"
          >
            <ArrowUpDown className="size-5 text-[#484848]" strokeWidth={1.5} />
          </button>
        }
      />

      {/* Scrollable body */}
      <div className="flex-1 overflow-y-auto">
        <div className="flex flex-col gap-1 px-4 pb-8">
          {/* Column labels */}
          <div className="flex items-center justify-between py-2">
            <span className="font-['Noto_Sans',sans-serif] font-normal text-[12px] text-[#787878] leading-[16px]" style={ns}>Member</span>
            <span className="font-['Noto_Sans',sans-serif] font-normal text-[12px] text-[#787878] leading-[16px]" style={ns}>Attendance</span>
          </div>

          {/* Member list */}
          <div className="flex flex-col">
            {filtered.map((member, i) => {
              const chip = CHIP_STYLES[pctToChip(member.pct)];
              const showSubgroupHeader = sortBy === "subgroup" && (i === 0 || filtered[i - 1].subgroup !== member.subgroup);
              return (
                <div key={member.memberId}>
                  {showSubgroupHeader && (
                    <div className="pt-3 pb-1">
                      <span className="font-['Noto_Sans',sans-serif] font-medium text-[12px] text-[#787878] leading-4" style={ns}>
                        Subgroup {member.subgroup}
                      </span>
                    </div>
                  )}
                  <button
                    onClick={() => setSelected(member)}
                    className="w-full flex items-center justify-between py-3 active:bg-gray-50 transition-colors text-left"
                  >
                    <div className="flex items-center gap-2 min-w-0 flex-1">
                      <MemberAvatar size={30} name={member.name} />
                      <span
                        className="flex-1 font-['Noto_Sans',sans-serif] font-medium text-[16px] text-black tracking-[0.15px] leading-[24px] truncate"
                        style={ns}
                      >
                        {member.name}
                      </span>
                    </div>
                    <div className="flex items-center gap-1 shrink-0 ml-2">
                      <SubgroupTag letter={member.subgroup} />
                      <RatingBadge letter={member.rating} />
                      <div className="rounded-[16px] h-6 px-3 flex items-center justify-center shrink-0" style={{ backgroundColor: chip.bg }}>
                        <span
                          className="font-['Noto_Sans',sans-serif] font-medium text-[12px] leading-[16px]"
                          style={{ color: chip.text }}
                        >
                          {member.pct.toFixed(1)}%
                        </span>
                      </div>
                    </div>
                  </button>
                  {i < filtered.length - 1 && <div className="border-t border-[#C7C5CE]" />}
                </div>
              );
            })}
            {filtered.length === 0 && (
              <p className="py-8 text-center font-['Noto_Sans',sans-serif] text-[14px] text-[#787878]">No members found.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// Small donut used for "Monthly Attendance (Estimated)" — track + a filled arc for pct.
function CircularProgress({ pct, size = 69 }: { pct: number; size?: number }) {
  const stroke = 6;
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const offset = c * (1 - pct / 100);
  return (
    <div className="relative shrink-0" style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} stroke="#d6e4ff" strokeWidth={stroke} fill="none" />
        <circle
          cx={size / 2} cy={size / 2} r={r}
          stroke="#1441cc" strokeWidth={stroke} fill="none"
          strokeDasharray={c} strokeDashoffset={offset} strokeLinecap="round"
        />
      </svg>
      <span className="absolute inset-0 flex items-center justify-center font-['Noto_Sans',sans-serif] font-medium text-[14px] text-black">{pct}%</span>
    </div>
  );
}

// Reached by tapping a mandatory exam from the admin's Monthly Goal screen — richer than the
// Today's Goal exam view: live-exam stats + a monthly attendance donut + the 31-day goal chart,
// then a member list sorted/searched like Group Members (tap a row for the same detail sheet).
function MonthlyGoalExamDetailScreen({ examName, onBack }: { examName: string; onBack: () => void }) {
  const ns = { fontVariationSettings: '"CTGR" 0, "wdth" 100' };
  const [searching, setSearching] = useState(false);
  const [query, setQuery] = useState("");
  const [sortBy, setSortBy] = useState<MemberSort>("attendance");
  const [sorting, setSorting] = useState(false);
  const [selected, setSelected] = useState<Member | null>(null);

  const filtered = (query.trim() ? MEMBER_LIST.filter(m => m.name.toLowerCase().includes(query.trim().toLowerCase())) : MEMBER_LIST)
    .slice()
    .sort((a, b) => {
      if (sortBy === "alphabetical") return a.name.localeCompare(b.name);
      if (sortBy === "subgroup") return a.subgroup.localeCompare(b.subgroup);
      return b.pct - a.pct;
    });

  return (
    <div className="flex flex-col h-full bg-white overflow-hidden relative">
      <AnimatePresence>
        {selected && (
          <MemberDetailSheet
            member={selected}
            onClose={() => setSelected(null)}
          />
        )}
        {sorting && <SortBottomSheet value={sortBy} onSelect={setSortBy} onClose={() => setSorting(false)} />}
      </AnimatePresence>

      {searching ? (
        <InlineSearchHeader
          title={examName}
          onBack={onBack}
          searching
          onStartSearch={() => { }}
          query={query}
          onQueryChange={setQuery}
          onExit={() => { setSearching(false); setQuery(""); }}
          placeholder="Search by name"
        />
      ) : (
        <AppHeader title={examName} onBack={onBack} />
      )}

      <div className="flex-1 overflow-y-auto">
        <div className="flex flex-col gap-4 px-4 pt-4 pb-8">
          {!searching && (
            <>
              {/* Live exams + monthly attendance donut */}
              <div className="flex gap-2">
                <div className="flex-1 border border-[#e3e3e3] rounded-[12px] p-3 flex flex-col gap-2">
                  <span className="font-['Noto_Sans',sans-serif] font-medium text-[12px] text-[#787878] leading-4" style={ns}>Live Exams (Estimated)</span>
                  <span className="font-['Noto_Sans',sans-serif] font-medium text-[16px] text-black tracking-[0.15px] leading-6" style={ns}>{ADMIN_GOAL_OVERRIDE.bigCount}</span>
                  <ActivityProgressBar pct={ADMIN_GOAL_OVERRIDE.barPct} />
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      <div className="size-2 rounded-full bg-[#1441cc] shrink-0" />
                      <span className="font-['Noto_Sans',sans-serif] font-medium text-[12px] text-[#787878] leading-4" style={ns}>Attended</span>
                    </div>
                    <span className="font-['Noto_Sans',sans-serif] font-medium text-[12px] text-black leading-4" style={ns}>{ADMIN_GOAL_OVERRIDE.attended}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      <div className="size-2 rounded-full bg-[#d6e4ff] shrink-0" />
                      <span className="font-['Noto_Sans',sans-serif] font-medium text-[12px] text-[#787878] leading-4" style={ns}>Remaining (Est)</span>
                    </div>
                    <span className="font-['Noto_Sans',sans-serif] font-medium text-[12px] text-black leading-4" style={ns}>{ADMIN_GOAL_OVERRIDE.remaining}</span>
                  </div>
                </div>
                <div className="flex-1 border border-[#e3e3e3] rounded-[12px] p-3 flex flex-col items-center justify-center gap-3">
                  <CircularProgress pct={80} />
                  <span className="font-['Noto_Sans',sans-serif] font-medium text-[12px] text-[#787878] leading-4 text-center" style={ns}>Monthly Attendance (Estimated)</span>
                </div>
              </div>

              {/* Monthly goal chart */}
              <div className="bg-[#f4f6fa] rounded-[16px] p-3 flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <span className="font-['Noto_Sans',sans-serif] font-medium text-[14px] text-black leading-5" style={ns}>Monthly goal</span>
                  <span className="font-['Noto_Sans',sans-serif] font-medium text-[14px] text-black leading-5" style={ns}>5.6 K</span>
                </div>
                <div className="grid gap-x-1 h-[100px] items-end" style={{ gridTemplateColumns: `repeat(${DAILY_GOAL_PCTS.length}, minmax(0, 1fr))` }}>
                  {DAILY_GOAL_PCTS.map((pct, i) => (
                    <div key={i} className="rounded-t-sm" style={{ height: `${pct}px`, backgroundColor: zoneBarColor(pct) }} />
                  ))}
                </div>
                <div className="flex items-center justify-between">
                  {[1, 10, 20, DAILY_GOAL_PCTS.length].map(day => (
                    <span key={day} className="font-['Noto_Sans',sans-serif] font-medium text-[10px] text-[#8f8d8d] leading-4" style={ns}>{day}</span>
                  ))}
                </div>
                <span className="text-center font-['Noto_Sans',sans-serif] font-medium text-[12px] text-black leading-4" style={ns}>75.5% achievement ratio</span>
              </div>

              {/* Attendance header */}
              <div className="flex items-center justify-between">
                <span className="font-['Noto_Sans',sans-serif] font-medium text-[16px] text-black tracking-[0.15px] leading-6" style={ns}>Attendance</span>
                <div className="flex items-center">
                  <button
                    onClick={() => setSearching(true)}
                    className="size-12 flex items-center justify-center rounded-full active:bg-gray-100 transition-colors"
                  >
                    <Search className="size-6 text-[#484848]" strokeWidth={1.5} />
                  </button>
                  <button
                    onClick={() => setSorting(true)}
                    aria-label="Sort"
                    className="size-12 flex items-center justify-center rounded-full active:bg-gray-100 transition-colors"
                  >
                    <ArrowUpDown className="size-5 text-[#484848]" strokeWidth={1.5} />
                  </button>
                </div>
              </div>

              {/* Column labels */}
              <div className="flex items-center justify-between -mt-2">
                <span className="font-['Noto_Sans',sans-serif] font-normal text-[12px] text-[#787878] leading-4" style={ns}>Member</span>
                <span className="font-['Noto_Sans',sans-serif] font-normal text-[12px] text-[#787878] leading-4" style={ns}>Attendance</span>
              </div>
            </>
          )}

          {/* Member list */}
          <div className="flex flex-col">
            {filtered.map((member, i) => {
              const chip = CHIP_STYLES[pctToChip(member.pct)];
              const showSubgroupHeader = sortBy === "subgroup" && (i === 0 || filtered[i - 1].subgroup !== member.subgroup);
              return (
                <div key={member.memberId}>
                  {showSubgroupHeader && (
                    <div className="pt-3 pb-1">
                      <span className="font-['Noto_Sans',sans-serif] font-medium text-[12px] text-[#787878] leading-4" style={ns}>
                        Subgroup {member.subgroup}
                      </span>
                    </div>
                  )}
                  <button
                    onClick={() => setSelected(member)}
                    className="w-full flex items-center justify-between py-3 active:bg-gray-50 transition-colors text-left"
                  >
                    <div className="flex items-center gap-2 min-w-0 flex-1">
                      <MemberAvatar size={30} name={member.name} />
                      <span className="flex-1 font-['Noto_Sans',sans-serif] font-medium text-[16px] text-black tracking-[0.15px] leading-6 truncate" style={ns}>
                        {member.name}
                      </span>
                    </div>
                    <div className="flex items-center gap-1 shrink-0 ml-2">
                      <SubgroupTag letter={member.subgroup} />
                      <RatingBadge letter={member.rating} />
                      <div className="rounded-[4px] h-6 px-2 flex items-center justify-center shrink-0" style={{ backgroundColor: chip.bg }}>
                        <span className="font-['Noto_Sans',sans-serif] text-[12px] font-normal" style={{ color: chip.text }}>{member.pct.toFixed(1)}%</span>
                      </div>
                    </div>
                  </button>
                  {i < filtered.length - 1 && <div className="border-t border-[#C7C5CE]" />}
                </div>
              );
            })}
            {filtered.length === 0 && (
              <p className="py-8 text-center font-['Noto_Sans',sans-serif] text-[14px] text-[#787878]">No members found.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Screen: Group List (onboarding) ───────────────────────────────────────────

// Circular multi-color mark standing in for each group's logo — no real group photos
// are available, so every group gets the same three-tone pie rather than a blank avatar.
// Distinct conic-gradient combos so each group in a list reads as visually different at a
// glance, instead of every card showing the same blue/yellow/green pie.
const GROUP_LOGO_PALETTES: Array<[string, string, string]> = [
  ["#4285f4", "#fbbc05", "#34a853"],
  ["#ef4444", "#f97316", "#eab308"],
  ["#8b5cf6", "#ec4899", "#f43f5e"],
  ["#06b6d4", "#3b82f6", "#6366f1"],
  ["#10b981", "#14b8a6", "#0ea5e9"],
  ["#f59e0b", "#d97706", "#b45309"],
  ["#a855f7", "#d946ef", "#ec4899"],
  ["#22c55e", "#84cc16", "#eab308"],
  ["#f43f5e", "#fb7185", "#fda4af"],
  ["#0ea5e9", "#38bdf8", "#7dd3fc"],
];

function GroupLogo({ size = 40, seed = 0 }: { size?: number; seed?: number | string }) {
  const hash = typeof seed === "string"
    ? seed.split("").reduce((h, ch) => (h * 31 + ch.charCodeAt(0)) >>> 0, 0)
    : seed;
  const [a, b, c] = GROUP_LOGO_PALETTES[hash % GROUP_LOGO_PALETTES.length];
  return (
    <div
      className="rounded-full shrink-0"
      style={{
        width: size,
        height: size,
        background: `conic-gradient(${a} 0deg 130deg, ${b} 130deg 245deg, ${c} 245deg 360deg)`,
      }}
    />
  );
}

const GROUP_LIST_BENEFITS: Array<{ id: string; Icon: LucideIcon; iconBg: string; iconColor: string; title: string; subtitle: string }> = [
  { id: "discount", Icon: Gift, iconBg: "#fdecd2", iconColor: "#a9601a", title: "Discount", subtitle: "Get 5% discount on all packages" },
  { id: "support", Icon: Headphones, iconBg: "#dbeafe", iconColor: "#1d4ed8", title: "Support", subtitle: "Get instant support from fellow group members" },
  { id: "grow", Icon: Sprout, iconBg: "#dcfce7", iconColor: "#166534", title: "Grow together", subtitle: "Push yourself up to the mark" },
];

const GROUP_CATEGORY_OPTIONS = ["All groups", "BCS", "Bank", "DP", "NTRCA", "BAR / BJS"] as const;
type GroupCategoryFilter = typeof GROUP_CATEGORY_OPTIONS[number];

function GroupCategoryFilterSheet({ value, onSelect, onClose }: { value: GroupCategoryFilter; onSelect: (v: GroupCategoryFilter) => void; onClose: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="absolute inset-0 z-50 flex flex-col justify-end bg-black/40"
      onClick={onClose}
    >
      <motion.div
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        exit={{ y: "100%" }}
        transition={{ type: "tween", duration: 0.28, ease: [0.4, 0, 0.2, 1] }}
        className="bg-white rounded-tl-[16px] rounded-tr-[16px] shadow-[0px_4px_8px_3px_rgba(0,0,0,0.15)] flex flex-col overflow-hidden pb-4"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex flex-col items-center p-4 shrink-0">
          <div className="bg-[#787878] h-1 rounded-full w-8" />
        </div>
        <div className="flex flex-col">
          {GROUP_CATEGORY_OPTIONS.map(opt => (
            <button
              key={opt}
              onClick={() => { onSelect(opt); onClose(); }}
              className="h-14 flex items-center gap-4 px-4 active:bg-gray-50 transition-colors text-left"
            >
              <div className="relative size-5 shrink-0 rounded-full border-2 flex items-center justify-center" style={{ borderColor: value === opt ? "#1441cc" : "#787878" }}>
                {value === opt && <div className="size-2.5 rounded-full bg-[#1441cc]" />}
              </div>
              <span className="font-['Noto_Sans',sans-serif] font-medium text-[16px] text-black leading-6">{opt}</span>
            </button>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
}

const GROUP_LIST_GUIDELINES_TEXT = `গ্রুপে ব্যক্তিগত ও সংঘবদ্ধ কর্মকাণ্ডের কিছু নির্দেশনা দেওয়া হলো —

(ক) ব্যক্তিগত কর্মকাণ্ডঃ

১) কারো ভুল-ত্রুটি ধরিয়ে দেওয়ার জন্য এমন কোনো শব্দ বা বাক্য ব্যবহার করবো না যা অন্যের জন্য কষ্টদায়ক হয়। এখানে সবাই ক্যাডার হবার প্রত্যাশা নিয়ে এসেছি, তাই সকলেরই উচিত হবে ক্যাডার সুলভ আচরণ করা।

২) গ্রুপে একটা মেসেজ দেওয়া মানে সকল মানুষের কাছে নোটিফিকেশন যাওয়া। তাই একটা মেসেজ দেওয়ার আগে অবশ্যই ভাববেন যে আপনার মেসেজটা কি উপকারের, আসলে নাকি বিরক্তির কারণ হলো।

৩) "এক কথায় উত্তর যোগ্য" প্রশ্ন চেষ্টা করবেন অনেকগুলো জমিয়ে একেবারে মেসেজ করার জন্য। যিনি/যারা উত্তর জানবেন আপনার একটা মেসেজের রিপ্লাই হিসেবে উত্তর দিয়ে দিবেন। ধন্যবাদ, হাই, হ্যালো এসব না দিয়ে মেসেজের উপর একটা ইমোজি দিয়ে দিবেন। এতে করে সারানিতে টুং টাং মেসেজের ঝড় কিছুটা কমবে।

৪) "এক কথায় উত্তর যোগ্য নয়" এমন ব্যক্তিগত প্রশ্ন প্রথমে গ্রুপে করবেন না।

[নোটঃ বিষয়টি যদি অধিকাংশের জন্য প্রয়োজনীয় হয় তবে তা গ্রুপে আলোচনা করবেন, যেমন — স্টাডি প্ল্যান, আবেদন বা ফরম ফিলাপ সংক্রান্ত প্রশ্ন]`;

function GroupGuidelinesBottomSheet({ onClose }: { onClose: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="absolute inset-0 z-50 flex flex-col justify-end bg-black/40"
      onClick={onClose}
    >
      <motion.div
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        exit={{ y: "100%" }}
        transition={{ type: "tween", duration: 0.28, ease: [0.4, 0, 0.2, 1] }}
        className="bg-white rounded-tl-[16px] rounded-tr-[16px] shadow-[0px_4px_8px_3px_rgba(0,0,0,0.15)] flex flex-col overflow-hidden max-h-[85%]"
        onClick={e => e.stopPropagation()}
      >
        {/* Drag handle */}
        <div className="flex flex-col items-center p-[16px] shrink-0">
          <div className="bg-[#787878] h-[4px] rounded-[100px] w-[32px]" />
        </div>

        {/* Title */}
        <div className="px-[16px] shrink-0">
          <p
            className="font-['Noto_Sans',sans-serif] font-medium text-[18px] leading-[28px] text-black"
            style={{ fontVariationSettings: '"CTGR" 0, "wdth" 100' }}
          >
            LIVE MCQ Messenger গ্রুপের নির্দেশিকা
          </p>
        </div>

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto mt-[16px]">
          <div className="bg-white px-[16px] py-[8px]">
            <p
              className="font-['Noto_Sans',sans-serif] font-normal text-[14px] leading-[22px] text-black whitespace-pre-wrap"
              style={{ fontVariationSettings: '"CTGR" 0, "wdth" 100' }}
            >
              {GROUP_LIST_GUIDELINES_TEXT}
            </p>
          </div>
        </div>

        {/* Close button */}
        <div className="shrink-0 p-[12px]">
          <button
            onClick={onClose}
            className="w-full h-[56px] rounded-[100px] border border-[#c7c7c7] flex items-center justify-center"
          >
            <span
              className="font-['Noto_Sans',sans-serif] font-medium text-[16px] leading-[24px] tracking-[0.15px] text-[#484848]"
              style={{ fontVariationSettings: '"CTGR" 0, "wdth" 100' }}
            >
              Close
            </span>
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

// Group card body shared by the Group List (tappable) and Confirm Join Request
// (static) screens — logo, name, discount badge, category/rank/members row, admin.
function GroupSummaryCard({ group }: { group: Group }) {
  const ns = { fontVariationSettings: '"CTGR" 0, "wdth" 100' };
  return (
    <div className="flex gap-3 p-3 w-full items-start">
      <GroupLogo size={40} seed={group.id} />
      <div className="flex-1 min-w-0 flex flex-col gap-1">
        <div className="flex items-center justify-between gap-2">
          <span className="font-['Noto_Sans',sans-serif] font-medium text-[16px] text-black leading-[24px] truncate" style={ns}>{group.name}</span>
          <div className="bg-[#b7dfb9] rounded-[4px] px-2 h-5 flex items-center shrink-0">
            <span className="font-['Noto_Sans',sans-serif] font-medium text-[10px] text-[#264a34] leading-[16px]" style={ns}>{group.discount}%</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="bg-[#eaeef6] rounded-[4px] px-2 h-5 flex items-center shrink-0">
            <span className="font-['Noto_Sans',sans-serif] font-medium text-[10px] text-[#484848] leading-[16px]" style={ns}>{group.category}</span>
          </div>
          <div className="flex items-center gap-1">
            <Trophy className="size-3.5 text-[#665200]" strokeWidth={1.5} />
            <span className="font-['Noto_Sans',sans-serif] font-normal text-[12px] text-black leading-[16px]" style={ns}>{group.rank}</span>
          </div>
          <span className="text-[#484848] text-[12px]">•</span>
          <span className="font-['Noto_Sans',sans-serif] font-normal text-[12px] text-black leading-[16px]" style={ns}>{group.members} members</span>
        </div>
        <span className="font-['Noto_Sans',sans-serif] font-normal text-[12px] text-[#484848] leading-[16px]" style={ns}>Admin: {group.admin}</span>
      </div>
    </div>
  );
}

function GroupListScreen({ onBack, onSelectGroup }: { onBack: () => void; onSelectGroup: (group: Group) => void }) {
  const ns = { fontVariationSettings: '"CTGR" 0, "wdth" 100' };
  const [categoryFilter, setCategoryFilter] = useState<GroupCategoryFilter>("All groups");
  const [filtering, setFiltering] = useState(false);
  const [showGuidelines, setShowGuidelines] = useState(false);

  const filteredGroups = categoryFilter === "All groups" ? GROUPS : GROUPS.filter(g => g.category === categoryFilter);

  return (
    <div className="flex flex-col h-full bg-white overflow-hidden relative">
      <AnimatePresence>
        {filtering && (
          <GroupCategoryFilterSheet value={categoryFilter} onSelect={setCategoryFilter} onClose={() => setFiltering(false)} />
        )}
        {showGuidelines && (
          <GroupGuidelinesBottomSheet onClose={() => setShowGuidelines(false)} />
        )}
      </AnimatePresence>

      <AppHeader
        title="Study group"
        onBack={onBack}
        trailing={
          <button
            onClick={() => setShowGuidelines(true)}
            aria-label="Group guidelines"
            className="size-9 flex items-center justify-center rounded-full active:bg-gray-100 transition-colors"
          >
            <AlertCircle className="size-6 text-black" strokeWidth={1.5} />
          </button>
        }
      />

      <div className="flex-1 overflow-y-auto">
        {/* Benefits */}
        <div className="flex flex-col gap-4 px-4 py-4">
          {GROUP_LIST_BENEFITS.map(({ id, Icon, iconBg, iconColor, title, subtitle }) => (
            <div key={id} className="flex items-center gap-3">
              <div className="size-10 rounded-full flex items-center justify-center shrink-0" style={{ backgroundColor: iconBg }}>
                <Icon className="size-5" style={{ color: iconColor }} strokeWidth={1.75} />
              </div>
              <div className="flex-1 min-w-0 flex flex-col">
                <span className="font-['Noto_Sans',sans-serif] font-medium text-[14px] text-black leading-5" style={ns}>{title}</span>
                <span className="font-['Noto_Sans',sans-serif] font-normal text-[12px] text-[#787878] leading-4" style={ns}>{subtitle}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Available Groups header + filter */}
        <div className="flex items-center justify-between px-4 pb-3">
          <span className="font-['Noto_Sans',sans-serif] font-medium text-[16px] text-black leading-6" style={ns}>Available Groups</span>
          <button
            onClick={() => setFiltering(true)}
            className="h-9 flex items-center gap-1 pl-3 pr-2 rounded-full border border-[#c7c7c7] active:bg-gray-50 transition-colors"
          >
            <span className="font-['Noto_Sans',sans-serif] font-medium text-[14px] text-black leading-5" style={ns}>{categoryFilter}</span>
            <ChevronDown className="size-4 text-[#484848]" strokeWidth={2} />
          </button>
        </div>

        {/* Group cards */}
        <div className="px-4 pb-4 flex flex-col gap-2">
          {filteredGroups.map(group => (
            <button
              key={group.id}
              onClick={() => onSelectGroup(group)}
              className="bg-[#f4f6fa] rounded-[12px] text-left active:opacity-80 transition-opacity"
            >
              <GroupSummaryCard group={group} />
            </button>
          ))}
          {filteredGroups.length === 0 && (
            <p className="py-8 text-center font-['Noto_Sans',sans-serif] text-[14px] text-[#787878]">No groups in this category.</p>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Screen: Join Group ────────────────────────────────────────────────────────

// Shared group-preview card for the Join Group / Join Group Pending screens — same
// name/category/admin/stat layout as GroupMemberScreen's info card, before membership.
function JoinGroupInfoCard({ group, onShowAdminDetails }: { group: Group; onShowAdminDetails: () => void }) {
  return (
    <div className="flex gap-3 items-start">
      <GroupLogo size={60} seed={group.id} />
      <div className="flex-1 min-w-0 flex flex-col gap-2">
        <p className="font-['Noto_Sans',sans-serif] font-medium text-[16px] text-black leading-[24px]">{group.name}</p>
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <div className="bg-[#eaeef6] rounded-[4px] px-2 h-5 flex items-center">
              <span className="font-['Noto_Sans',sans-serif] text-[10px] font-medium text-[#484848]">{group.category}</span>
            </div>
            <span className="font-['Noto_Sans',sans-serif] text-[12px] text-[#484848]">Created: {group.createdDate}</span>
          </div>
          <button onClick={onShowAdminDetails} className="flex items-center gap-1 active:opacity-70 transition-opacity">
            <span className="font-['Noto_Sans',sans-serif] font-medium text-[12px] text-[#484848]">Admin: {group.admin}</span>
            <Info className="size-[18px] text-[#484848]" strokeWidth={1.5} />
          </button>
        </div>
        <div className="flex items-center gap-4">
          <div>
            <p className="font-['Noto_Sans',sans-serif] font-semibold text-[12px] text-black leading-[16px]">{group.rank}</p>
            <p className="font-['Noto_Sans',sans-serif] text-[12px] text-black leading-[16px]">Rank</p>
          </div>
          <span className="text-[#484848] text-[12px]">•</span>
          <div>
            <p className="font-['Noto_Sans',sans-serif] font-semibold text-[12px] text-black leading-[16px]">{group.members}</p>
            <p className="font-['Noto_Sans',sans-serif] text-[12px] text-black leading-[16px]">Members</p>
          </div>
          <span className="text-[#484848] text-[12px]">•</span>
          <div>
            <p className="font-['Noto_Sans',sans-serif] font-semibold text-[12px] text-black leading-[16px]">{group.subgroups}</p>
            <p className="font-['Noto_Sans',sans-serif] text-[12px] text-black leading-[16px]">Subgroups</p>
          </div>
        </div>
      </div>
    </div>
  );
}

// Six-month "% of goal reached" bar chart shown on the Join Group preview — same fraction
// labels as the Figma mock, but bar color is derived from the real percentage via
// goalBarColor so red/yellow/green always matches the legend beneath it.
const JOIN_GROUP_MONTHLY_BARS: Array<{ month: string; attended: number; total: number }> = [
  { month: "Jan", attended: 12, total: 20 },
  { month: "Feb", attended: 4, total: 16 },
  { month: "Mar", attended: 13, total: 22 },
  { month: "Apr", attended: 28, total: 31 },
  { month: "May", attended: 6, total: 15 },
  { month: "Jun", attended: 22, total: 40 },
];

function GroupGoalGraphCard({ group }: { group: Group }) {
  const ns = { fontVariationSettings: '"CTGR" 0, "wdth" 100' };
  const cols = { gridTemplateColumns: `repeat(${JOIN_GROUP_MONTHLY_BARS.length}, minmax(0, 1fr))` };
  return (
    <div className="bg-[#f4f6fa] rounded-[16px] p-3 flex flex-col gap-2">
      <span className="font-['Noto_Sans',sans-serif] font-normal text-[12px] text-black leading-4" style={ns}>% of goal reached, by month</span>

      <div className="grid gap-x-1" style={cols}>
        {JOIN_GROUP_MONTHLY_BARS.map(bar => (
          <span key={bar.month} className="font-['Noto_Sans',sans-serif] font-medium text-[10px] text-[#484848] leading-4 text-center">
            {bar.attended}/{bar.total}
          </span>
        ))}
      </div>
      <div className="grid gap-x-1 h-[100px] items-end" style={cols}>
        {JOIN_GROUP_MONTHLY_BARS.map(bar => (
          <div key={bar.month} className={clsx("rounded-t-sm", goalBarColor((bar.attended / bar.total) * 100))} style={{ height: `${Math.max((bar.attended / bar.total) * 100, 6)}px` }} />
        ))}
      </div>
      <div className="grid gap-x-1" style={cols}>
        {JOIN_GROUP_MONTHLY_BARS.map(bar => (
          <span key={bar.month} className="font-['Noto_Sans',sans-serif] font-medium text-[10px] text-[#484848] leading-4 text-center">{bar.month}</span>
        ))}
      </div>

      <div className="flex items-center gap-3 flex-wrap pt-1">
        {[["#6fcf73", ">=75%"], ["#ffc94a", "40-74%"], ["#eb5757", "<40%"]].map(([bg, label]) => (
          <div key={label} className="flex items-center gap-1">
            <div className="size-2.5 rounded-[4px]" style={{ backgroundColor: bg }} />
            <span className="font-['Noto_Sans',sans-serif] font-medium text-[10px] text-[#484848] leading-4" style={ns}>{label}</span>
          </div>
        ))}
      </div>

      <div className="h-px bg-[#c7c5ce] my-1" />

      <div className="flex items-stretch gap-3">
        <div className="flex-1 flex flex-col gap-1">
          <span className="font-['Noto_Sans',sans-serif] font-normal text-[12px] text-[#484848] leading-4" style={ns}>Total exams</span>
          <span className="font-['Roboto',sans-serif] font-semibold text-[16px] text-black leading-6 tracking-[0.15px]">{group.totalExams}</span>
          <span className="font-['Noto_Sans',sans-serif] font-medium text-[12px] text-[#484848] leading-4" style={ns}>{group.avgAttendance.toFixed(1)}% avg. attendance</span>
        </div>
        <div className="w-px bg-[#c7c5ce]" />
        <div className="flex-1 flex flex-col gap-1">
          <span className="font-['Noto_Sans',sans-serif] font-normal text-[12px] text-[#484848] leading-4" style={ns}>Monthly goal</span>
          <span className="font-['Roboto',sans-serif] font-semibold text-[16px] text-black leading-6 tracking-[0.15px]">{group.monthlyGoal}</span>
          <span className="font-['Noto_Sans',sans-serif] font-medium text-[12px] text-[#484848] leading-4" style={ns}>{group.avgAttendance.toFixed(1)}% achievement ratio</span>
        </div>
      </div>
    </div>
  );
}

// Read-only preview of the group's mandatory exams — same rows as GroupMemberScreen's
// list, minus the tap-through (can't sit an exam before joining).
function GroupMandatoryExamsPreview({ onShowInfo }: { onShowInfo: () => void }) {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <span className="font-['Noto_Sans',sans-serif] font-medium text-[16px] text-black tracking-[0.15px]" style={{ fontVariationSettings: '"CTGR" 0, "wdth" 100' }}>
          বাধ্যতামূলক পরীক্ষাসমূহ
        </span>
        <button onClick={onShowInfo} className="size-6 flex items-center justify-center shrink-0">
          <Info className="size-[19px] text-[#484848]" strokeWidth={1.75} />
        </button>
      </div>
      <div className="flex flex-col gap-1">
        {MANDATORY_EXAMS.map((exam, i) => (
          <div key={i} className="h-12 bg-[#f4f6fa] rounded-[8px] flex items-center px-4 gap-2">
            <span className="flex-1 font-['Noto_Sans',sans-serif] font-medium text-[14px] text-black leading-[20px] truncate" style={{ fontVariationSettings: '"CTGR" 0, "wdth" 100' }}>
              {exam.name}
            </span>
            {exam.isLive && (
              <div className="bg-red-500 flex items-center gap-1 px-2 rounded-[8px] shrink-0">
                <div className="size-[6px] rounded-full bg-white" />
                <span className="font-['Noto_Sans',sans-serif] font-medium text-[10px] text-white leading-[16px]">Live</span>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function JoinGroupScreen({ group, onBack, onViewRules, onJoin }: { group: Group; onBack: () => void; onViewRules: () => void; onJoin: () => void }) {
  const [showAdminDetails, setShowAdminDetails] = useState(false);
  const [showExamsInfo, setShowExamsInfo] = useState(false);

  return (
    <div className="flex flex-col h-full bg-white overflow-hidden relative">
      <AnimatePresence>
        {showAdminDetails && (
          <AdminDetailsBottomSheet
            name={group.admin}
            rating={group.adminRating}
            since={group.createdDate}
            onClose={() => setShowAdminDetails(false)}
          />
        )}
        {showExamsInfo && <MandatoryExamsInfoBottomSheet onClose={() => setShowExamsInfo(false)} />}
      </AnimatePresence>

      <AppHeader title="Study Group" onBack={onBack} />

      <div className="flex-1 overflow-y-auto px-4 py-4 flex flex-col gap-4">
        <JoinGroupInfoCard group={group} onShowAdminDetails={() => setShowAdminDetails(true)} />

        <div className="flex gap-2">
          <button
            onClick={onJoin}
            className="flex-1 h-12 bg-[#1441cc] rounded-full flex items-center justify-center gap-2 active:opacity-90 transition-opacity"
          >
            <UserPlus className="size-5 text-white" strokeWidth={1.75} />
            <span className="font-['Noto_Sans',sans-serif] font-medium text-[14px] text-white">Join Group</span>
          </button>
          <button
            onClick={onViewRules}
            className="flex-1 h-12 rounded-full border border-[#c7c7c7] flex items-center justify-center gap-2 active:bg-gray-50 transition-colors"
          >
            <AlertCircle className="size-5 text-[#484848]" strokeWidth={1.5} />
            <span className="font-['Noto_Sans',sans-serif] font-medium text-[14px] text-[#484848]">গ্রুপের নিয়মাবলী</span>
          </button>
        </div>

        <GroupGoalGraphCard group={group} />

        <GroupMandatoryExamsPreview onShowInfo={() => setShowExamsInfo(true)} />
      </div>
    </div>
  );
}

// ── Screen: Join Group / Confirm Join Request ─────────────────────────────────

function ConfirmJoinRequestScreen({ group, onBack, onCancel, onConfirm }: { group: Group; onBack: () => void; onCancel: () => void; onConfirm: (notes: string) => void }) {
  const [notes, setNotes] = useState("");
  const [agreed, setAgreed] = useState(true);

  return (
    <div className="flex flex-col h-full bg-white overflow-hidden">
      <AppHeader title="Confirm your joining request" onBack={onBack} />

      <div className="flex-1 overflow-y-auto px-4 py-4 flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <span className="font-['Noto_Sans',sans-serif] font-medium text-[14px] text-black leading-5">Selected Group:</span>
          <div className="bg-[#f4f6fa] rounded-[12px]">
            <GroupSummaryCard group={group} />
          </div>
        </div>

        <div className="relative flex-1 min-h-[160px] border border-[#787878] rounded-[12px]">
          <span className="absolute -top-[10px] left-3 bg-white px-1 font-['Noto_Sans',sans-serif] font-normal text-[12px] text-[#484848] leading-4">
            Notes
          </span>
          <textarea
            value={notes}
            onChange={e => setNotes(e.target.value)}
            placeholder="Input"
            className="w-full h-full min-h-[160px] p-4 bg-transparent font-['Noto_Sans',sans-serif] font-medium text-[16px] text-black outline-none rounded-[12px] resize-none placeholder:text-black placeholder:font-medium"
          />
        </div>
      </div>

      <div className="shrink-0 flex flex-col gap-4 px-4 pb-3">
        <button onClick={() => setAgreed(v => !v)} className="flex items-start gap-2 text-left active:opacity-70 transition-opacity">
          <div
            className={clsx(
              "size-5 rounded-[4px] shrink-0 mt-0.5 flex items-center justify-center",
              agreed ? "bg-[#1441cc]" : "border-2 border-[#787878]",
            )}
          >
            {agreed && <Check className="size-3.5 text-white" strokeWidth={3} />}
          </div>
          <span className="font-['Noto_Sans',sans-serif] font-normal text-[14px] text-black leading-5">
            By confirming, I agree to the terms and conditions of the group.
          </span>
        </button>

        <div className="flex gap-2">
          <button
            onClick={onCancel}
            className="flex-1 h-12 rounded-full border border-[#c7c7c7] flex items-center justify-center active:bg-gray-50 transition-colors"
          >
            <span className="font-['Noto_Sans',sans-serif] font-medium text-[14px] text-[#484848]">Cancel</span>
          </button>
          <button
            disabled={!agreed}
            onClick={() => onConfirm(notes)}
            className={clsx(
              "flex-1 h-12 rounded-full flex items-center justify-center transition-opacity",
              agreed ? "bg-[#1441cc] active:opacity-90" : "bg-black/10 cursor-not-allowed",
            )}
          >
            <span className={clsx("font-['Noto_Sans',sans-serif] font-medium text-[14px]", agreed ? "text-white" : "text-black opacity-38")}>
              Confirm
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Screen: Join Group / Pending ──────────────────────────────────────────────

// Confirmation dialog shown when the student taps the "Pending" pill on the Join
// Group / Pending screen — mirrors LeaveGroupDialog's text-button/filled-button layout.
function CancelJoinRequestDialog({ groupName, onCancelRequest, onKeepWaiting }: { groupName: string; onCancelRequest: () => void; onKeepWaiting: () => void }) {
  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/40 px-6">
      <motion.div
        initial={{ scale: 0.92, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.92, opacity: 0 }}
        transition={{ type: "tween", duration: 0.18, ease: "easeOut" }}
        className="w-full bg-[#f4f6fa] rounded-[12px] overflow-hidden"
      >
        <div className="pt-[12px] px-[12px] flex flex-col gap-[16px]">
          <p className="font-['Noto_Sans',sans-serif] font-normal text-[24px] leading-[32px] text-black" style={{ fontVariationSettings: '"CTGR" 0, "wdth" 100' }}>
            Cancel request?
          </p>
          <p className="font-['Noto_Sans',sans-serif] font-normal text-[14px] leading-[20px] text-[#484848]" style={{ fontVariationSettings: '"CTGR" 0, "wdth" 100' }}>
            Your request to join {groupName} will be withdrawn. You can request to join again later.
          </p>
        </div>
        <div className="flex gap-[8px] items-center p-[12px]">
          <button
            onClick={onCancelRequest}
            className="flex-1 h-[48px] rounded-[8px] flex items-center justify-center"
          >
            <span className="font-['Noto_Sans',sans-serif] font-medium text-[14px] text-[#d40000] leading-[20px]" style={{ fontVariationSettings: '"CTGR" 0, "wdth" 100' }}>
              Cancel request
            </span>
          </button>
          <button
            onClick={onKeepWaiting}
            className="flex-1 h-[48px] bg-[#1441cc] rounded-[8px] flex items-center justify-center"
          >
            <span className="font-['Noto_Sans',sans-serif] font-medium text-[14px] text-white leading-[20px]" style={{ fontVariationSettings: '"CTGR" 0, "wdth" 100' }}>
              Keep waiting
            </span>
          </button>
        </div>
      </motion.div>
    </div>
  );
}

function JoinGroupPendingScreen({ group, onBack, onViewRules, onCancelRequest, onKeepWaiting }: { group: Group; onBack: () => void; onViewRules: () => void; onCancelRequest: () => void; onKeepWaiting: () => void }) {
  const [showAdminDetails, setShowAdminDetails] = useState(false);
  const [showExamsInfo, setShowExamsInfo] = useState(false);
  const [showCancelDialog, setShowCancelDialog] = useState(false);

  // Demo-only stand-in for the admin actually reviewing the request — auto-advances
  // into the group after a short wait so the pending state doesn't dead-end.
  useEffect(() => {
    const timeout = setTimeout(onKeepWaiting, 2000);
    return () => clearTimeout(timeout);
  }, [onKeepWaiting]);

  return (
    <div className="flex flex-col h-full bg-white overflow-hidden relative">
      <AnimatePresence>
        {showAdminDetails && (
          <AdminDetailsBottomSheet
            name={group.admin}
            rating={group.adminRating}
            since={group.createdDate}
            onClose={() => setShowAdminDetails(false)}
          />
        )}
        {showExamsInfo && <MandatoryExamsInfoBottomSheet onClose={() => setShowExamsInfo(false)} />}
        {showCancelDialog && (
          <CancelJoinRequestDialog
            groupName={group.name}
            onCancelRequest={onCancelRequest}
            onKeepWaiting={() => { setShowCancelDialog(false); onKeepWaiting(); }}
          />
        )}
      </AnimatePresence>

      <AppHeader title="Study Group" onBack={onBack} />

      <div className="flex-1 overflow-y-auto px-4 py-4 flex flex-col gap-4">
        <JoinGroupInfoCard group={group} onShowAdminDetails={() => setShowAdminDetails(true)} />

        <div className="bg-[#f4f6fa] rounded-[12px] p-3 flex items-center gap-3">
          <Clock className="size-5 text-[#787878] shrink-0" strokeWidth={1.5} />
          <p className="flex-1 font-['Noto_Sans',sans-serif] font-normal text-[14px] text-[#484848] leading-5">
            Your request to join is waiting for admin approval.
          </p>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => setShowCancelDialog(true)}
            className="flex-1 h-12 bg-[#ffdad6] rounded-full flex items-center justify-center gap-2 active:opacity-80 transition-opacity"
          >
            <Clock className="size-5 text-[#d40000]" strokeWidth={1.75} />
            <span className="font-['Noto_Sans',sans-serif] font-medium text-[14px] text-[#d40000]">Pending</span>
          </button>
          <button
            onClick={onViewRules}
            className="flex-1 h-12 rounded-full border border-[#c7c7c7] flex items-center justify-center gap-2 active:bg-gray-50 transition-colors"
          >
            <AlertCircle className="size-5 text-[#484848]" strokeWidth={1.5} />
            <span className="font-['Noto_Sans',sans-serif] font-medium text-[14px] text-[#484848]">গ্রুপের নিয়মাবলী</span>
          </button>
        </div>

        <GroupGoalGraphCard group={group} />

        <GroupMandatoryExamsPreview onShowInfo={() => setShowExamsInfo(true)} />
      </div>
    </div>
  );
}

// ──────────────────────────────────────────────────────────────────────────────

function PrototypeApp() {
  const [stack, setStack] = useState<Screen[]>(["groupList"]);
  const [selectedGroup, setSelectedGroup] = useState<Group | null>(null);
  const [selectedSubgroup, setSelectedSubgroup] = useState<SubgroupData | null>(null);
  const [selectedExamName, setSelectedExamName] = useState<string | null>(null);
  const announcement = {
    title: "New Announcements",
    body: "Live class on Bangladesh Affairs starts tomorrow at 8 PM",
    date: "24 May 2026",
  };
  const [selectedExamLive, setSelectedExamLive] = useState(false);
  const [selectedQuickLink, setSelectedQuickLink] = useState<QuickLink | null>(null);
  const [selectedExamList, setSelectedExamList] = useState<Array<{ name: string; isLive: boolean }>>(MANDATORY_EXAMS);
  const [todayGoalOverride, setTodayGoalOverride] = useState<GoalDetailOverride | null>(null);
  const [snackbarMessage, setSnackbarMessage] = useState<string | null>(null);
  const snackbarTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const dirRef = useRef<1 | -1>(1);

  const screen = stack[stack.length - 1];
  const dir = dirRef.current;

  // Mirror each in-app screen onto a real browser history entry, so a hardware/gesture
  // back action (e.g. an edge swipe on mobile) pops one in-app screen instead of leaving
  // the page — the popstate handler below is the single place that pops `stack`.
  useEffect(() => {
    window.history.replaceState({ depth: 0 }, "");
  }, []);

  useEffect(() => {
    function onPopState() {
      dirRef.current = -1;
      setStack(s => (s.length > 1 ? s.slice(0, -1) : s));
    }
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, []);

  // Push a new screen onto the navigation stack.
  function goTo(next: Screen) {
    dirRef.current = 1;
    const newStack = [...stack, next];
    window.history.pushState({ depth: newStack.length - 1 }, "");
    setStack(newStack);
  }

  // Pop back to the previous screen on the stack — always correct no matter how deep the push chain went.
  // Goes through history.back() so it stays in sync with the real browser history (and with swipe-back gestures).
  function goBack() {
    if (stack.length <= 1) return;
    window.history.back();
  }

  function showSnackbar(message: string) {
    if (snackbarTimeoutRef.current) clearTimeout(snackbarTimeoutRef.current);
    setSnackbarMessage(message);
    snackbarTimeoutRef.current = setTimeout(() => setSnackbarMessage(null), 2500);
  }

  // "Cancel request" on the Pending screen's dialog — withdraws the request and drops
  // the student back on that group's Join Group page so they can request again later.
  function cancelJoinRequest() {
    dirRef.current = -1;
    window.history.replaceState({ depth: 0 }, "");
    setStack(["groupList", "joinGroup"]);
    showSnackbar("Your request has been withdrawn");
  }

  // "Keep waiting" on the same dialog — takes the student into the group now rather
  // than leaving them stuck on the Pending screen.
  function enterHome() {
    dirRef.current = 1;
    window.history.replaceState({ depth: 0 }, "");
    setStack(["home"]);
  }

  // "Leave" on the Leave Group dialog — drops the student back on the Group List
  // (onboarding) screen rather than just popping one screen up the stack.
  function leaveGroup() {
    dirRef.current = -1;
    window.history.replaceState({ depth: 0 }, "");
    setStack(["groupList"]);
    showSnackbar(`You have left ${selectedGroup?.name ?? "the group"}`);
  }

  return (
    <div className="relative w-full h-full overflow-hidden">
      <AnimatePresence mode="popLayout" custom={dir}>

        {screen === "groupList" && (
          <motion.div
            key="groupList"
            custom={dir}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={slideTrans}
            className="absolute inset-0"
          >
            <GroupListScreen onBack={goBack} onSelectGroup={(group) => { setSelectedGroup(group); goTo("joinGroup"); }} />
          </motion.div>
        )}

        {screen === "joinGroup" && selectedGroup && (
          <motion.div
            key="joinGroup"
            custom={dir}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={slideTrans}
            className="absolute inset-0"
          >
            <JoinGroupScreen
              group={selectedGroup}
              onBack={goBack}
              onViewRules={() => goTo("groupRules")}
              onJoin={() => goTo("confirmJoinRequest")}
            />
          </motion.div>
        )}

        {screen === "confirmJoinRequest" && selectedGroup && (
          <motion.div
            key="confirmJoinRequest"
            custom={dir}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={slideTrans}
            className="absolute inset-0"
          >
            <ConfirmJoinRequestScreen
              group={selectedGroup}
              onBack={goBack}
              onCancel={goBack}
              onConfirm={() => goTo("joinGroupPending")}
            />
          </motion.div>
        )}

        {screen === "joinGroupPending" && selectedGroup && (
          <motion.div
            key="joinGroupPending"
            custom={dir}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={slideTrans}
            className="absolute inset-0"
          >
            <JoinGroupPendingScreen
              group={selectedGroup}
              onBack={goBack}
              onViewRules={() => goTo("groupRules")}
              onCancelRequest={cancelJoinRequest}
              onKeepWaiting={enterHome}
            />
          </motion.div>
        )}

        {screen === "examAttendanceMembers" && (
          <motion.div
            key="examAttendanceMembers"
            custom={dir}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={slideTrans}
            className="absolute inset-0"
          >
            <ExamAttendanceMembersScreen onBack={goBack} />
          </motion.div>
        )}


        {screen === "home" && selectedGroup && (
          <motion.div
            key="home"
            custom={dir}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={slideTrans}
            className="absolute inset-0"
          >
            <GroupMemberScreen
              group={selectedGroup}
              announcement={announcement}
              onBack={goBack}
              onActivityLog={() => goTo("activity")}
              onRank={() => goTo("rank")}
              onMembers={() => goTo("members")}
              onSubgroups={() => goTo("subgroups")}
              onTodayGoal={() => { setSelectedSubgroup(SUBGROUPS.find(s => s.isMyGroup) ?? SUBGROUPS[0]); setTodayGoalOverride(ADMIN_GOAL_OVERRIDE); goTo("todayGoal"); }}
              onMonthlyGoal={() => { setSelectedSubgroup(SUBGROUPS.find(s => s.isMyGroup) ?? SUBGROUPS[0]); setTodayGoalOverride(ADMIN_GOAL_OVERRIDE); goTo("monthlyGoal"); }}
              onDiscussion={() => goTo("discussion")}
              onFacebookGroup={() => goTo("facebookGroup")}
              onSelectExam={(examName, isLive) => { setSelectedExamName(examName); setSelectedExamLive(isLive); setSelectedExamList(MANDATORY_EXAMS); goTo("examPage"); }}
              onSelectQuickLink={(link) => { setSelectedQuickLink(link); goTo("quickLinkPage"); }}
              onViewGroupRules={() => goTo("groupRules")}
              onLeaveGroup={leaveGroup}
            />
          </motion.div>
        )}

        {screen === "groupRules" && selectedGroup && (
          <motion.div
            key="groupRules"
            custom={dir}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={slideTrans}
            className="absolute inset-0"
          >
            <GroupRulesScreen group={selectedGroup} onBack={goBack} />
          </motion.div>
        )}

        {screen === "examPage" && selectedExamName && (
          <motion.div
            key="examPage"
            custom={dir}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={slideTrans}
            className="absolute inset-0"
          >
            <ExamPageScreen
              examName={selectedExamName}
              isLive={selectedExamLive}
              examList={selectedExamList}
              onBack={goBack}
              onSelectQuickLink={(link) => { setSelectedQuickLink(link); goTo("quickLinkPage"); }}
            />
          </motion.div>
        )}

        {screen === "quickLinkPage" && selectedQuickLink && (
          <motion.div
            key="quickLinkPage"
            custom={dir}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={slideTrans}
            className="absolute inset-0"
          >
            <QuickLinkPageScreen link={selectedQuickLink} onBack={goBack} />
          </motion.div>
        )}

        {screen === "discussion" && selectedGroup && (
          <motion.div
            key="discussion"
            custom={dir}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={slideTrans}
            className="absolute inset-0"
          >
            <DiscussionScreen onBack={goBack} />
          </motion.div>
        )}

        {screen === "facebookGroup" && selectedGroup && (
          <motion.div
            key="facebookGroup"
            custom={dir}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={slideTrans}
            className="absolute inset-0"
          >
            <FacebookGroupScreen group={selectedGroup} onBack={goBack} />
          </motion.div>
        )}

        {screen === "activity" && (
          <motion.div
            key="activity"
            custom={dir}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={slideTrans}
            className="absolute inset-0"
          >
            <ActivityLogScreen onBack={goBack} />
          </motion.div>
        )}

        {screen === "rank" && (
          <motion.div
            key="rank"
            custom={dir}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={slideTrans}
            className="absolute inset-0"
          >
            <GroupRankScreen onBack={goBack} />
          </motion.div>
        )}

        {screen === "members" && selectedGroup && (
          <motion.div
            key="members"
            custom={dir}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={slideTrans}
            className="absolute inset-0"
          >
            <GroupMembersScreen group={selectedGroup} onBack={goBack} />
          </motion.div>
        )}

        {screen === "subgroups" && selectedGroup && (
          <motion.div
            key="subgroups"
            custom={dir}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={slideTrans}
            className="absolute inset-0"
          >
            <SubgroupListScreen
              group={selectedGroup}
              onBack={goBack}
              onDetail={(sg) => { setSelectedSubgroup(sg); goTo("subgroupDetail"); }}
            />
          </motion.div>
        )}

        {screen === "subgroupDetail" && selectedSubgroup && (
          <motion.div
            key="subgroupDetail"
            custom={dir}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={slideTrans}
            className="absolute inset-0"
          >
            <SubgroupDetailScreen
              sg={selectedSubgroup}
              onBack={goBack}
              onTodayGoal={() => { setTodayGoalOverride(null); goTo("todayGoal"); }}
              onMonthlyGoal={() => { setTodayGoalOverride(null); goTo("monthlyGoal"); }}
            />
          </motion.div>
        )}

        {screen === "todayGoal" && selectedSubgroup && (
          <motion.div
            key="todayGoal"
            custom={dir}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={slideTrans}
            className="absolute inset-0"
          >
            <GoalDetailScreen
              mode="today"
              sg={selectedSubgroup}
              override={todayGoalOverride ?? undefined}
              onBack={goBack}
              onSelectExam={() => goTo("examAttendanceMembers")}
              onViewAttendance={() => goTo("examAttendanceMembers")}
            />
          </motion.div>
        )}

        {screen === "monthlyGoal" && selectedSubgroup && (
          <motion.div
            key="monthlyGoal"
            custom={dir}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={slideTrans}
            className="absolute inset-0"
          >
            <GoalDetailScreen
              mode="monthly"
              sg={selectedSubgroup}
              override={todayGoalOverride ?? undefined}
              onBack={goBack}
              onSelectExam={(exam) => { setSelectedExamName(exam.name); goTo("monthlyGoalExamDetail"); }}
              onViewAttendance={() => goTo("examAttendanceMembers")}
            />
          </motion.div>
        )}

        {screen === "monthlyGoalExamDetail" && selectedExamName && (
          <motion.div
            key="monthlyGoalExamDetail"
            custom={dir}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={slideTrans}
            className="absolute inset-0"
          >
            <MonthlyGoalExamDetailScreen examName={selectedExamName} onBack={goBack} />
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {snackbarMessage && <Snackbar message={snackbarMessage} />}
      </AnimatePresence>
    </div>
  );
}

export default function App() {
  return (
    <div className="w-full h-full overflow-hidden relative">
      <PrototypeApp />
    </div>
  );
}
