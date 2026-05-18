"use client";

import { useState } from "react";
import Link from "next/link";
import { BrainCircuitIcon, CheckIcon, SparklesIcon, ArrowRightIcon } from "lucide-react";
import { getRecommendedProfessions, CATEGORIES, type RequirementLevel } from "@/data/professions";

/* ─────────────────────────── types ─────────────────────────── */
type Section = "MBTI" | "IQ" | "EQ";

interface Q {
  id: number;
  section: Section;
  label: string;
  text: string;
  options: { text: string; value: string }[];
  dimension?: "EI" | "SN" | "TF" | "JP";
  correct?: string;
  eq?: Record<string, number>;
}

/* ─────────────────────────── questions ─────────────────────────── */
const QUESTIONS: Q[] = [
  /* ── MBTI ── */
  {
    id: 1, section: "MBTI", label: "Зан чанар", dimension: "EI",
    text: "Та ихэнхдээ яаж эрч хүч авдаг вэ?",
    options: [
      { text: "Хүмүүстэй цугларч, нийгэмшихэд", value: "E" },
      { text: "Ганцаараа байж, тайван орчинд", value: "I" },
    ],
  },
  {
    id: 2, section: "MBTI", label: "Зан чанар", dimension: "SN",
    text: "Шинэ мэдээлэл хүлээн авахдаа та юунд анхаарах дуртай вэ?",
    options: [
      { text: "Тодорхой баримт, нарийн дэлгэрэнгүйд", value: "S" },
      { text: "Ерөнхий утга учир, ирээдүйн боломжид", value: "N" },
    ],
  },
  {
    id: 3, section: "MBTI", label: "Зан чанар", dimension: "TF",
    text: "Шийдвэр гаргахдаа та юунд тулгуурладаг вэ?",
    options: [
      { text: "Логик дүн шинжилгээ, шалтгаан үндэслэл", value: "T" },
      { text: "Хүмүүсийн мэдрэмж, өөрийн үнэт зүйлс", value: "F" },
    ],
  },
  {
    id: 4, section: "MBTI", label: "Зан чанар", dimension: "JP",
    text: "Таны өдөр тутмын амьдрал ихэнхдээ ямар байдаг вэ?",
    options: [
      { text: "Төлөвлөгөөтэй, бүтэцтэй, зохион байгуулалттай", value: "J" },
      { text: "Уян хатан, аяндаа явдаг, дасан зохицогч", value: "P" },
    ],
  },
  /* ── IQ ── */
  {
    id: 5, section: "IQ", label: "Оюун ухаан", correct: "B",
    text: "2 → 6 → 18 → 54 → __",
    options: [
      { text: "108", value: "A" },
      { text: "162", value: "B" },
      { text: "120", value: "C" },
      { text: "144", value: "D" },
    ],
  },
  {
    id: 6, section: "IQ", label: "Оюун ухаан", correct: "C",
    text: "Дөрвөлжингийн нэг тал 5 бол периметр нь хэд вэ?",
    options: [
      { text: "10", value: "A" },
      { text: "25", value: "B" },
      { text: "20", value: "C" },
      { text: "15", value: "D" },
    ],
  },
  {
    id: 7, section: "IQ", label: "Оюун ухаан", correct: "B",
    text: "○  □  △  ○  □  △  ○  __",
    options: [
      { text: "○", value: "A" },
      { text: "□", value: "B" },
      { text: "△", value: "C" },
      { text: "◇", value: "D" },
    ],
  },
  {
    id: 8, section: "IQ", label: "Оюун ухаан", correct: "B",
    text: "Хэрэв A > B ба B > C бол...",
    options: [
      { text: "C > A", value: "A" },
      { text: "A > C", value: "B" },
      { text: "A = C", value: "C" },
      { text: "Тодорхойгүй", value: "D" },
    ],
  },
  {
    id: 9, section: "IQ", label: "Оюун ухаан", correct: "B",
    text: "3 + 3 × 3 = ?",
    options: [
      { text: "9", value: "A" },
      { text: "12", value: "B" },
      { text: "18", value: "C" },
      { text: "6", value: "D" },
    ],
  },
  /* ── EQ ── */
  {
    id: 10, section: "EQ", label: "Сэтгэл оюун",
    eq: { A: 3, B: 1, C: 0, D: 2 },
    text: "Найз чинь маш уурласан байна. Та юу хийх вэ?",
    options: [
      { text: "Уурын шалтгааныг нь сонирхож асуух", value: "A" },
      { text: "\"Уурлах хэрэггүй\" гэж хэлэх", value: "B" },
      { text: "Ганцаараа орхих", value: "C" },
      { text: "Анхаарлыг нь өөр зүйлд хандуулах", value: "D" },
    ],
  },
  {
    id: 11, section: "EQ", label: "Сэтгэл оюун",
    eq: { A: 3, B: 1, C: 0, D: 0 },
    text: "Та ноцтой алдаа гаргалаа. Та яаж хандах вэ?",
    options: [
      { text: "Алдаанаасаа суралцаж урагшлах", value: "A" },
      { text: "Өөрийгөө маш их буруутгах", value: "B" },
      { text: "Анхаарал хандуулахгүй байх", value: "C" },
      { text: "Бусдыг буруутгах", value: "D" },
    ],
  },
  {
    id: 12, section: "EQ", label: "Сэтгэл оюун",
    eq: { A: 3, B: 1, C: 0, D: 1 },
    text: "Хэн нэгэн таны санааг олон нийтэд шүүмжилнэ. Та...",
    options: [
      { text: "Шүүмжлэлийг сонсож, хэрэгтэй зүйлийг авна", value: "A" },
      { text: "Хамгаалах хандлага гаргана", value: "B" },
      { text: "Уурлана", value: "C" },
      { text: "Гомдоно", value: "D" },
    ],
  },
  {
    id: 13, section: "EQ", label: "Сэтгэл оюун",
    eq: { A: 3, B: 2, C: 0, D: 2 },
    text: "Хамт ажиллагч чинь хүнд стрессд байна. Та...",
    options: [
      { text: "Туслах санал тавих", value: "A" },
      { text: "Нөхцөл байдлыг тайвшруулахыг оролдох", value: "B" },
      { text: "Зөвхөн ажлаа хийх", value: "C" },
      { text: "Хүсвэл нь туслах гэж хянаж байх", value: "D" },
    ],
  },
  {
    id: 14, section: "EQ", label: "Сэтгэл оюун",
    eq: { A: 3, B: 1, C: 2, D: 0 },
    text: "Та урам хугарсан үед яаж сэргэдэг вэ?",
    options: [
      { text: "Шалтгааныг олж, шийдэл хайна", value: "A" },
      { text: "Хэсэг хугацааны дараа аяндаа сэргэнэ", value: "B" },
      { text: "Дотны хүмүүсээсээ дэмжлэг хүсэнэ", value: "C" },
      { text: "Уйтгараа гаднаа гаргана", value: "D" },
    ],
  },
];

/* ─────────────────────────── MBTI lookup ─────────────────────────── */
const MBTI: Record<string, { name: string; desc: string }> = {
  INTJ: { name: "Стратегист",      desc: "Бие даасан, дорвитой, урт хугацааны бодолтой" },
  INTP: { name: "Логикч",          desc: "Шинийг эрэлхийлэгч, аналитик, онолыг хайрладаг" },
  ENTJ: { name: "Командлагч",      desc: "Байгалийн удирдагч, шийдэмгий, зорилготой" },
  ENTP: { name: "Маргаанч",        desc: "Бүтээлч, зоригтой, шинэлэг санааг дэмждэг" },
  INFJ: { name: "Зөгч",            desc: "Тусч, гүн ухаантай, утга учрыг хайрладаг" },
  INFP: { name: "Зуучлагч",        desc: "Идеалист, тусч, өөрийн үнэт зүйлсдээ итгэмжит" },
  ENFJ: { name: "Протагонист",     desc: "Харизматик удирдагч, урам өгнө, хүмүүст анхаардаг" },
  ENFP: { name: "Хөтлөгч",         desc: "Чин сэтгэлийн, бүтээлч, эрч хүчтэй" },
  ISTJ: { name: "Зохион байгуулагч", desc: "Найдвартай, хариуцлагатай, практик" },
  ISFJ: { name: "Хамгаалагч",      desc: "Дулаан зүрхтэй, итгэмжит, бусдыг хамгаалдаг" },
  ESTJ: { name: "Захирагч",        desc: "Зохицуулагч, бодит хандлагатай, хэв журамд итгэдэг" },
  ESFJ: { name: "Консул",          desc: "Анхааралтай, нийгэмч, хамт олонд туслахыг хүсдэг" },
  ISTP: { name: "Виртуоз",         desc: "Дадлагажсан, шинжилгээч, уян хатан" },
  ISFP: { name: "Уран бүтээлч",    desc: "Уян хатан, нийгэмч, урлагийг хайрладаг" },
  ESTP: { name: "Санаачлагч",      desc: "Зоригтой, дадлагажсан, эрч хүчтэй" },
  ESFP: { name: "Тоглогч",         desc: "Аяндаа явдаг, эрч хүчтэй, урам өгнө" },
};

/* ─────────────────────────── scoring ─────────────────────────── */
function calcResults(answers: Record<number, string>) {
  const mbtiType =
    (answers[1] ?? "E") +
    (answers[2] ?? "S") +
    (answers[3] ?? "T") +
    (answers[4] ?? "J");

  const iqQs = QUESTIONS.filter((q) => q.section === "IQ");
  const iqScore = iqQs.filter((q) => answers[q.id] === q.correct).length;

  const eqQs = QUESTIONS.filter((q) => q.section === "EQ");
  const eqScore = eqQs.reduce((sum, q) => sum + (q.eq?.[answers[q.id]] ?? 0), 0);
  const eqMax = eqQs.length * 3;

  return { mbtiType, iqScore, iqTotal: iqQs.length, eqScore, eqMax };
}

/* ─────────────────────────── section colors ─────────────────────────── */
const SECTION_STYLE: Record<Section, { bg: string; text: string; border: string; dot: string }> = {
  MBTI: { bg: "#EEF2FE", text: "#4B7BF5", border: "#4B7BF5", dot: "#4B7BF5" },
  IQ:   { bg: "#FEF9C3", text: "#854D0E", border: "#F59E0B", dot: "#F59E0B" },
  EQ:   { bg: "#ECFDF3", text: "#16A34A", border: "#22C55E", dot: "#22C55E" },
};

/* ─────────────────────────── component ─────────────────────────── */
export default function TestPage() {
  const [phase, setPhase] = useState<"intro" | "test" | "results">("intro");
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [selected, setSelected] = useState<string | null>(null);
  const [animating, setAnimating] = useState(false);

  const q = QUESTIONS[index];
  const progress = ((index) / QUESTIONS.length) * 100;

  function choose(value: string) {
    if (animating || selected) return;
    setSelected(value);
    setAnswers((prev) => ({ ...prev, [q.id]: value }));
    setAnimating(true);
    setTimeout(() => {
      if (index + 1 >= QUESTIONS.length) {
        setPhase("results");
      } else {
        setIndex((i) => i + 1);
        setSelected(null);
      }
      setAnimating(false);
    }, 420);
  }

  /* ── Intro ── */
  if (phase === "intro") {
    return (
      <div className="max-w-md mx-auto py-12">
        <div className="rounded-3xl overflow-hidden border" style={{ borderColor: "#E2E7EF", background: "#FFFFFF" }}>
          <div className="p-8" style={{ background: "linear-gradient(135deg, #0D1117 0%, #1A2440 100%)" }}>
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-5" style={{ background: "rgba(75,123,245,0.25)" }}>
              <BrainCircuitIcon className="h-6 w-6" style={{ color: "#93B8FC" }} />
            </div>
            <h1 className="text-2xl font-extrabold text-white">Хувийн тест</h1>
            <p className="text-sm mt-2" style={{ color: "#9CA3AF" }}>
              MBTI · IQ · EQ — 3 секцид 14 асуулт
            </p>
          </div>
          <div className="p-6 space-y-4">
            {[
              { icon: "🧠", title: "MBTI — Зан чанар", desc: "4 асуулт · 1 минут" },
              { icon: "💡", title: "IQ — Оюун ухаан",  desc: "5 асуулт · 1 минут" },
              { icon: "💚", title: "EQ — Сэтгэл оюун", desc: "5 асуулт · 1 минут" },
            ].map((s) => (
              <div key={s.title} className="flex items-center gap-3 rounded-2xl p-3.5" style={{ background: "#F9FAFB" }}>
                <span className="text-xl">{s.icon}</span>
                <div>
                  <p className="text-sm font-bold" style={{ color: "#111827" }}>{s.title}</p>
                  <p className="text-xs" style={{ color: "#9CA3AF" }}>{s.desc}</p>
                </div>
              </div>
            ))}
            <button
              onClick={() => setPhase("test")}
              className="w-full py-3.5 rounded-2xl text-sm font-extrabold text-white mt-2 transition-opacity hover:opacity-90"
              style={{ background: "linear-gradient(135deg, #4B7BF5, #7C3AED)" }}
            >
              Тестийг эхлүүлэх →
            </button>
          </div>
        </div>
      </div>
    );
  }

  /* ── Results ── */
  if (phase === "results") {
    const { mbtiType, iqScore, iqTotal, eqScore, eqMax } = calcResults(answers);
    const mbti = MBTI[mbtiType] ?? { name: mbtiType, desc: "" };
    const iqLabel = iqScore <= 2 ? "Бага" : iqScore <= 3 ? "Дунд" : "Өндөр";
    const iqColor = iqScore <= 2 ? "#EF4444" : iqScore <= 3 ? "#F59E0B" : "#16A34A";
    const eqPct = Math.round((eqScore / eqMax) * 100);
    const eqLabel = eqPct < 40 ? "Бага" : eqPct < 70 ? "Дунд" : "Өндөр";
    const eqColor = eqPct < 40 ? "#EF4444" : eqPct < 70 ? "#F59E0B" : "#16A34A";

    const iqLevel: RequirementLevel = iqScore <= 2 ? "low" : iqScore <= 3 ? "medium" : "high";
    const eqLevel: RequirementLevel = eqPct < 40 ? "low" : eqPct < 70 ? "medium" : "high";
    const recommended = getRecommendedProfessions(mbtiType, iqLevel, eqLevel, 5);

    return (
      <div className="max-w-lg mx-auto py-10 space-y-4">
        <div className="text-center mb-2">
          <div className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-3" style={{ background: "#ECFDF3" }}>
            <CheckIcon className="h-7 w-7" style={{ color: "#16A34A" }} />
          </div>
          <h1 className="text-xl font-extrabold" style={{ color: "#111827" }}>Таны үр дүн</h1>
          <p className="text-sm mt-1" style={{ color: "#9CA3AF" }}>14 асуултад хариулсан</p>
        </div>

        {/* MBTI */}
        <ResultCard
          color="#4B7BF5" bg="#EEF2FE" emoji="🧠"
          title="MBTI — Зан чанар"
          badge={mbtiType}
          lines={[mbti.name, mbti.desc]}
        />

        {/* IQ */}
        <ResultCard
          color={iqColor} bg="#FEF9C3" emoji="💡"
          title="IQ — Оюун ухаан"
          badge={iqLabel}
          lines={[
            `${iqScore} / ${iqTotal} зөв хариулт`,
            iqScore <= 2
              ? "Логик сэтгэлгээгээ илүү хөгжүүлэх боломжтой"
              : iqScore <= 3
              ? "Дундаж дээш түвшний логик сэтгэлгээ"
              : "Маш хурц логик сэтгэлгээ",
          ]}
        />

        {/* EQ */}
        <ResultCard
          color={eqColor} bg="#ECFDF3" emoji="💚"
          title="EQ — Сэтгэл оюун"
          badge={eqLabel}
          lines={[
            `${eqScore} / ${eqMax} оноо (${eqPct}%)`,
            eqPct < 40
              ? "Мэдрэмжийн ухамсраа хөгжүүлэх хэрэгтэй"
              : eqPct < 70
              ? "Сайн сэтгэл оюун, илүү нарийн болгох боломжтой"
              : "Өндөр сэтгэлийн оюун — хүмүүстэй харилцахдаа давуу тал",
          ]}
        />

        {/* ── Career recommendations ── */}
        <div
          className="rounded-2xl overflow-hidden border"
          style={{ borderColor: "rgba(75,123,245,0.25)" }}
        >
          {/* header */}
          <div
            className="px-4 py-3 flex items-center gap-2"
            style={{ background: "linear-gradient(135deg, #0D1117 0%, #1A2440 100%)" }}
          >
            <SparklesIcon className="h-4 w-4" style={{ color: "#93B8FC" }} />
            <span className="text-sm font-bold text-white">Таны мэргэжлийн зөвлөмж</span>
            <span
              className="ml-auto text-[10px] font-bold px-2 py-0.5 rounded-full"
              style={{ background: "rgba(75,123,245,0.30)", color: "#93B8FC" }}
            >
              {mbtiType} · IQ {iqLabel} · EQ {eqLabel}
            </span>
          </div>

          {/* profession list */}
          <div className="divide-y" style={{ background: "#FFFFFF", borderColor: "#F3F4F6" }}>
            {recommended.map((p, i) => {
              const cat = CATEGORIES[p.category];
              const rankColors = ["#F59E0B", "#9CA3AF", "#CD7F32", "#6B7280", "#6B7280"];
              return (
                <Link
                  key={p.slug}
                  href={`/professions/${p.slug}`}
                  className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors"
                >
                  {/* rank */}
                  <span
                    className="w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-extrabold shrink-0"
                    style={{ background: rankColors[i] + "22", color: rankColors[i] }}
                  >
                    {i + 1}
                  </span>

                  {/* emoji */}
                  <span
                    className="w-9 h-9 rounded-xl flex items-center justify-center text-lg shrink-0"
                    style={{ background: cat.bg }}
                  >
                    {p.emoji}
                  </span>

                  {/* info */}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold truncate" style={{ color: "#111827" }}>
                      {p.titleMn}
                    </p>
                    <p className="text-[11px] truncate" style={{ color: "#9CA3AF" }}>
                      {p.titleEn} · {cat.name}
                    </p>
                  </div>

                  {/* demand */}
                  <div className="flex flex-col items-end gap-1 shrink-0">
                    <span
                      className="text-[10px] font-semibold px-2 py-0.5 rounded-full"
                      style={{
                        background: p.demandLevel === "high" ? "#DCFCE7" : p.demandLevel === "medium" ? "#FEF3C7" : "#F3F4F6",
                        color:      p.demandLevel === "high" ? "#059669" : p.demandLevel === "medium" ? "#D97706" : "#6B7280",
                      }}
                    >
                      {p.demandLevel === "high" ? "Эрэлт өндөр" : p.demandLevel === "medium" ? "Дунд" : "Бага"}
                    </span>
                    <ArrowRightIcon className="h-3.5 w-3.5" style={{ color: "#D1D5DB" }} />
                  </div>
                </Link>
              );
            })}
          </div>

          {/* footer */}
          <div className="px-4 py-3" style={{ background: "#F9FAFB", borderTop: "1px solid #F3F4F6" }}>
            <Link
              href="/professions"
              className="flex items-center justify-center gap-1.5 text-xs font-semibold transition-colors hover:opacity-80"
              style={{ color: "#4B7BF5" }}
            >
              Бүх мэргэжлийг үзэх <ArrowRightIcon className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>

        <button
          onClick={() => { setPhase("intro"); setIndex(0); setAnswers({}); setSelected(null); }}
          className="w-full py-3 rounded-2xl text-sm font-bold border mt-2 transition-colors hover:bg-gray-50"
          style={{ borderColor: "#E2E7EF", color: "#6B7280" }}
        >
          Дахин эхлэх
        </button>
      </div>
    );
  }

  /* ── Question ── */
  const ss = SECTION_STYLE[q.section];
  const sectionQs = QUESTIONS.filter((x) => x.section === q.section);
  const sectionIdx = sectionQs.findIndex((x) => x.id === q.id) + 1;

  return (
    <div className="max-w-md mx-auto py-10">
      {/* Progress */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full" style={{ background: ss.bg, color: ss.text }}>
            {q.label}
          </span>
          <span className="text-xs" style={{ color: "#9CA3AF" }}>{index + 1} / {QUESTIONS.length}</span>
        </div>
        <div className="h-1.5 rounded-full overflow-hidden" style={{ background: "#F3F4F6" }}>
          <div
            className="h-full rounded-full transition-all duration-300"
            style={{ width: `${progress}%`, background: ss.dot }}
          />
        </div>
        <p className="text-[11px] mt-1.5" style={{ color: "#9CA3AF" }}>
          {q.section} · {sectionIdx}/{sectionQs.length}
        </p>
      </div>

      {/* Card */}
      <div
        className="rounded-3xl border p-6 transition-all duration-200"
        style={{
          borderColor: "#E2E7EF",
          background: "#FFFFFF",
          opacity: animating ? 0.5 : 1,
          transform: animating ? "translateY(4px)" : "translateY(0)",
        }}
      >
        {q.section === "IQ" && (
          <div className="flex items-center gap-1.5 mb-4">
            <SparklesIcon className="h-3.5 w-3.5" style={{ color: "#F59E0B" }} />
            <span className="text-[11px] font-semibold" style={{ color: "#F59E0B" }}>Нэг зөв хариулт байна</span>
          </div>
        )}

        <h2 className="text-lg font-bold leading-snug mb-6" style={{ color: "#111827" }}>
          {q.text}
        </h2>

        <div className="space-y-2.5">
          {q.options.map((opt, i) => {
            const isSelected = selected === opt.value;
            const letters = ["A", "B", "C", "D"];
            return (
              <button
                key={opt.value}
                onClick={() => choose(opt.value)}
                disabled={!!selected}
                className="w-full flex items-center gap-3 p-3.5 rounded-2xl border text-left transition-all duration-150 disabled:cursor-default"
                style={{
                  borderColor: isSelected ? ss.border : "#E2E7EF",
                  background: isSelected ? ss.bg : "#FAFAFA",
                  transform: isSelected ? "scale(0.98)" : "scale(1)",
                }}
              >
                <span
                  className="w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold shrink-0"
                  style={{
                    background: isSelected ? ss.dot : "#F3F4F6",
                    color: isSelected ? "#FFFFFF" : "#9CA3AF",
                  }}
                >
                  {isSelected ? <CheckIcon className="h-4 w-4" /> : letters[i]}
                </span>
                <span className="text-sm font-medium" style={{ color: isSelected ? ss.text : "#374151" }}>
                  {opt.text}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────── result card ─────────────────────────── */
function ResultCard({
  color, bg, emoji, title, badge, lines,
}: {
  color: string; bg: string; emoji: string;
  title: string; badge: string; lines: string[];
}) {
  return (
    <div className="rounded-2xl border overflow-hidden" style={{ borderColor: "#E2E7EF" }}>
      <div className="px-4 py-3 flex items-center justify-between" style={{ background: bg }}>
        <div className="flex items-center gap-2">
          <span>{emoji}</span>
          <span className="text-xs font-bold" style={{ color }}>{title}</span>
        </div>
        <span className="text-sm font-extrabold px-3 py-1 rounded-full text-white" style={{ background: color }}>
          {badge}
        </span>
      </div>
      <div className="px-4 py-3 space-y-0.5" style={{ background: "#FFFFFF" }}>
        <p className="text-sm font-bold" style={{ color: "#111827" }}>{lines[0]}</p>
        {lines[1] && <p className="text-xs" style={{ color: "#6B7280" }}>{lines[1]}</p>}
      </div>
    </div>
  );
}
