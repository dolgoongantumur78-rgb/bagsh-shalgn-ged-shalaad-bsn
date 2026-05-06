import Link from "next/link";
import { BrainCircuitIcon, TargetIcon, TrendingUpIcon, BriefcaseIcon, ArrowRightIcon, SparklesIcon } from "lucide-react";

const OCEAN_PREVIEW = [
  { label: "Нээлттэй байдал",      score: 78, color: "#4B7BF5" },
  { label: "Хариуцлагатай байдал", score: 85, color: "#111827" },
  { label: "Нийгэмшил",            score: 62, color: "#6B7280" },
  { label: "Нийцтэй байдал",       score: 71, color: "#374151" },
  { label: "Сэтгэл хөдлөл",        score: 45, color: "#3B6AE8" },
];

export default function HomePage() {
  return (
    <div>

      {/* ── HERO ── */}
      <section
        className="relative overflow-hidden mb-20"
        style={{ height: "100vh", minHeight: 560, marginTop: "-4rem", marginLeft: "calc(50% - 50vw)", width: "100vw" }}
      >
        <div
          className="absolute inset-0 bg-center bg-cover"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=1600&q=80')" }}
        />
        <div
          className="absolute inset-0"
          style={{ background: "linear-gradient(to bottom, rgba(10,15,30,0.38) 0%, rgba(10,15,30,0.62) 55%, rgba(10,15,30,0.88) 100%)" }}
        />

        <div className="relative h-full flex flex-col items-center justify-center text-center px-6 max-w-4xl mx-auto">
          <span
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold mb-7 border"
            style={{ background: "rgba(75,123,245,0.18)", color: "#93B8FC", borderColor: "rgba(75,123,245,0.35)" }}
          >
            <SparklesIcon className="h-3.5 w-3.5" />
            Big Five · OCEAN загварт суурилсан
          </span>

          <h1 className="text-5xl sm:text-6xl md:text-7xl font-extrabold leading-[1.08] tracking-tight text-white mb-6 drop-shadow-sm">
            Таны зан чанарт<br />
            <span style={{ color: "#93B8FC" }}>тохирох ажлыг олоорой</span>
          </h1>

          <p className="text-xl sm:text-[22px] leading-relaxed mb-10 max-w-2xl" style={{ color: "#C4D3F8" }}>
            Сэтгэл зүйн тест өгч, таны OCEAN профайлд нийцэх ажлын байруудаас сонгоорой.
            Зөвхөн CV биш — хүний зан чанар дээр суурилсан тохируулга.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 mb-14">
            <Link
              href="/register"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl text-base font-bold transition-all hover:opacity-90 hover:scale-[1.02]"
              style={{ background: "#4B7BF5", color: "#FFFFFF", boxShadow: "0 8px 30px rgba(75,123,245,0.45)" }}
            >
              Үнэгүй эхлэх <ArrowRightIcon className="h-5 w-5" />
            </Link>
            <Link
              href="/jobs"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl text-base font-semibold transition-all hover:bg-white/20"
              style={{ background: "rgba(255,255,255,0.12)", color: "white", border: "1px solid rgba(255,255,255,0.30)" }}
            >
              <BriefcaseIcon className="h-5 w-5" /> Ажлын байр харах
            </Link>
          </div>

          <div
            className="flex items-center gap-8 px-8 py-4 rounded-2xl"
            style={{ background: "rgba(255,255,255,0.10)", border: "1px solid rgba(255,255,255,0.18)", backdropFilter: "blur(8px)" }}
          >
            {[
              { val: "500+", label: "Ажил хайгч" },
              { val: "200+", label: "Ажлын байр" },
              { val: "85%",  label: "Тохирох амжилт" },
            ].map(({ val, label }, i) => (
              <div key={i} className="text-center">
                <p className="text-xl font-extrabold" style={{ color: "#93B8FC" }}>{val}</p>
                <p className="text-xs mt-0.5 text-white/60">{label}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 opacity-50">
          <div className="w-px h-10 bg-white/40" />
          <p className="text-white text-[10px] tracking-widest uppercase">Доош гүйлгэх</p>
        </div>
      </section>

      {/* ── OCEAN CARD + INTRO ── */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-28">
        <div
          className="rounded-2xl p-7 border"
          style={{ background: "#FFFFFF", borderColor: "#E2E7EF", boxShadow: "0 4px 24px rgba(17,24,39,0.06)" }}
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: "#4B7BF5" }}>
              <BrainCircuitIcon className="h-5 w-5 text-white" />
            </div>
            <div>
              <p className="font-bold text-sm" style={{ color: "#111827" }}>OCEAN Профайл</p>
              <p className="text-xs" style={{ color: "#6B7280" }}>Таны зан чанарын тайлан</p>
            </div>
            <span className="ml-auto text-[10px] font-bold px-2.5 py-1 rounded-full" style={{ background: "#EEF2FE", color: "#4B7BF5" }}>
              Жишээ
            </span>
          </div>

          <div className="space-y-4">
            {OCEAN_PREVIEW.map(({ label, score, color }) => (
              <div key={label}>
                <div className="flex justify-between text-xs mb-1.5">
                  <span style={{ color: "#6B7280" }}>{label}</span>
                  <span className="font-bold" style={{ color }}>{score}%</span>
                </div>
                <div className="h-2 rounded-full overflow-hidden" style={{ background: "#E2E7EF" }}>
                  <div className="h-full rounded-full" style={{ width: `${score}%`, background: color }} />
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 p-4 rounded-xl" style={{ background: "#EEF2FE" }}>
            <p className="text-xs font-semibold" style={{ color: "#374151" }}>
              ✨ Ажлын хэв маяг: Бие даасан, гүнзгий бодох дуртай
            </p>
          </div>

          <div className="flex items-center gap-3 mt-4 p-3 rounded-xl" style={{ background: "#D5E3FC" }}>
            <TargetIcon className="h-4 w-4" style={{ color: "#4B7BF5" }} />
            <p className="text-xs font-bold" style={{ color: "#111827" }}>Тохирох ажлын байр: 92% — Senior Frontend Developer</p>
          </div>
        </div>

        <div>
          <p className="text-xs font-bold uppercase tracking-widest mb-4" style={{ color: "#4B7BF5" }}>Хэрхэн ажилладаг вэ</p>
          <h2 className="text-4xl font-extrabold leading-tight mb-5" style={{ color: "#111827" }}>
            Таны зан чанарыг<br />шинжилж, тохирох<br />ажлыг олно
          </h2>
          <p className="text-base leading-relaxed mb-8" style={{ color: "#6B7280" }}>
            OCEAN загвар нь дэлхийд хамгийн өргөн хэрэглэгддэг сэтгэл зүйн тестийн систем.
            15 асуултанд хариулснаар таны давуу тал, ажлын хэв маяг тодорхойлогдоно.
          </p>
          <div className="space-y-4">
            {[
              { n: "01", t: "Бүртгүүлж, тест өгнө",   d: "15 асуулт, ~5 минут" },
              { n: "02", t: "OCEAN профайл гарна",      d: "5 шинж чанарын тайлан" },
              { n: "03", t: "Тохирох ажлаа сонгоно",   d: "% эрэмбэлэгдсэн жагсаалт" },
            ].map((s, i) => (
              <div key={i} className="flex items-start gap-4">
                <div
                  className="w-9 h-9 rounded-xl flex items-center justify-center text-xs font-extrabold shrink-0"
                  style={{ background: "#EEF2FE", color: "#4B7BF5" }}
                >
                  {s.n}
                </div>
                <div className="pt-0.5">
                  <p className="font-bold text-sm" style={{ color: "#111827" }}>{s.t}</p>
                  <p className="text-xs mt-0.5" style={{ color: "#6B7280" }}>{s.d}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section className="mb-24">
        <div className="text-center mb-14">
          <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: "#4B7BF5" }}>Давуу тал</p>
          <h2 className="text-3xl font-extrabold mb-4" style={{ color: "#111827" }}>Яагаад MindMatch вэ?</h2>
          <p className="text-base max-w-xl mx-auto leading-relaxed" style={{ color: "#6B7280" }}>
            Зөвхөн CV биш — таны зан чанар, ажлын соёлын нийцлийг тооцно
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              icon: BrainCircuitIcon,
              iconBg: "#111827", iconColor: "#FFFFFF",
              title: "Big Five тест",
              desc: "OCEAN загварт суурилсан 15 асуулт. Таны нээлттэй байдал, хариуцлага болон бусад шинж чанарыг хэмждэг.",
              tag: "Шинжлэх ухаанд суурилсан", tagBg: "#EEF2FE", tagColor: "#4B7BF5",
            },
            {
              icon: TargetIcon,
              iconBg: "#4B7BF5", iconColor: "#FFFFFF",
              title: "Ухаалаг тохируулга",
              desc: "Таны оноог ажлын шаардлагатай харьцуулан тохирох хувийг автоматаар тооцно.",
              tag: "Оноо тооцоолол", tagBg: "#D5E3FC", tagColor: "#3B6AE8",
            },
            {
              icon: TrendingUpIcon,
              iconBg: "#F3F4F6", iconColor: "#374151",
              title: "Карьер тайлан",
              desc: "Давуу тал, ажлын хэв маяг, хамгийн тохирох орчны дэлгэрэнгүй тайланг хүлээж авна.",
              tag: "Хувийн тайлан", tagBg: "#F3F4F6", tagColor: "#374151",
            },
          ].map(({ icon: Icon, iconBg, iconColor, title, desc, tag, tagBg, tagColor }, i) => (
            <div
              key={i}
              className="rounded-2xl p-8 border transition-all hover:-translate-y-1 hover:shadow-lg cursor-default"
              style={{ background: "#FFFFFF", borderColor: "#E2E7EF" }}
            >
              <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-5" style={{ background: iconBg }}>
                <Icon className="h-6 w-6" style={{ color: iconColor }} />
              </div>
              <h3 className="font-bold text-lg mb-2" style={{ color: "#111827" }}>{title}</h3>
              <p className="text-sm leading-relaxed mb-5" style={{ color: "#6B7280" }}>{desc}</p>
              <span className="inline-block text-[11px] font-bold px-3 py-1.5 rounded-full" style={{ background: tagBg, color: tagColor }}>
                {tag}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* ── PHOTO SECTION ── */}
      <section className="relative -mx-4 sm:-mx-6 mb-24 overflow-hidden rounded-none sm:rounded-3xl" style={{ height: 400 }}>
        <div
          className="absolute inset-0 bg-center bg-cover"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1501854140801-50d01698950b?auto=format&fit=crop&w=1600&q=80')" }}
        />
        <div className="absolute inset-0" style={{ background: "linear-gradient(135deg, rgba(10,15,30,0.80) 0%, rgba(30,45,80,0.65) 100%)" }} />
        <div className="relative h-full flex flex-col items-center justify-center text-center px-6">
          <p className="text-xs font-bold uppercase tracking-widest mb-4 text-white/60">Дөрвөн алхам</p>
          <h2 className="text-3xl font-extrabold text-white mb-10">Хэрхэн ажилладаг вэ?</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-3xl mx-auto">
            {[
              { n: "01", t: "Бүртгүүлэх" },
              { n: "02", t: "Тест өгөх" },
              { n: "03", t: "Тайлан авах" },
              { n: "04", t: "Ажил олох" },
            ].map((s, i) => (
              <div key={i} className="text-center">
                <div
                  className="w-12 h-12 rounded-2xl flex items-center justify-center text-sm font-extrabold mx-auto mb-3"
                  style={{ background: "#4B7BF5", color: "#FFFFFF" }}
                >
                  {s.n}
                </div>
                <p className="text-sm font-bold text-white">{s.t}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section
        className="rounded-3xl p-12 sm:p-16 text-center relative overflow-hidden mb-4"
        style={{ background: "#111827" }}
      >
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: "radial-gradient(ellipse at 50% -10%, rgba(75,123,245,0.20) 0%, transparent 60%)" }}
        />
        <div className="relative">
          <p className="text-xs font-bold uppercase tracking-widest mb-4" style={{ color: "#93B8FC" }}>Эхлэцгээе</p>
          <h2 className="text-3xl font-extrabold text-white mb-4">Өнөөдөр эхлэх үү?</h2>
          <p className="text-base mb-10 max-w-md mx-auto" style={{ color: "#6B7280" }}>
            Минутын дотор бүртгүүлж, тест өгч, тохирох ажлаа олоорой.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/register"
              className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-2xl text-sm font-bold transition-all hover:opacity-90"
              style={{ background: "#4B7BF5", color: "#FFFFFF", boxShadow: "0 4px 20px rgba(75,123,245,0.40)" }}
            >
              Үнэгүй бүртгүүлэх <ArrowRightIcon className="h-4 w-4" />
            </Link>
            <Link
              href="/jobs"
              className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-2xl text-sm font-semibold"
              style={{ background: "rgba(255,255,255,0.08)", color: "#C4D3F8", border: "1px solid rgba(75,123,245,0.30)" }}
            >
              <BriefcaseIcon className="h-4 w-4" /> Ажлын байр харах
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
