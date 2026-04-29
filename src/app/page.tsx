import Link from "next/link";

import { LandingLeadForm } from "@/components/LandingLeadForm";
import { TradingViewWidget } from "@/components/TradingViewWidget";
import { HeroStats } from "@/components/HeroStats";
import { ScrollReveal } from "@/components/ScrollReveal";
import { getServerSession } from "@/lib/auth";

const featureCards = [
  {
    title: "دورة تعليمية شاملة",
    description:
      "منهج دراسي مرتب يأخذك من الصفر حتى اتقان الاساسيات، مع التركيز على سيكولوجية التداول والتحليل المتقدم.",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBgH0T2DrSlQbtMnLgoYcyimL1xdc2cM-pfwOAMwy3bLQr7kDv-0KS7JX9oC3S5Rk6J3QeSC4cZccfXw0N43ZprY1xZhB0IJAWmKd1t2xEol1VOD6aPMLSpRbXZ2sd7ryhgh-mJ4f8-O71xp0vCmlw-CKFeDAiJEPhGiHIDM7GEtdc5ooRtYKZU0gRiZwZ-Ism9VngzPSDGXTlFX25oWCV93HVNeEyxOJ6JgwonpHpqwudiTkRhSg0XJAPcVfa9w5BxJLfcvB6TUtH_"
  },
  {
    title: "استشارات توجيهية مباشرة",
    description:
      "احجز جلستك المجانية الان، ودعنا نقيم في التداول ونحدد معا اين وصلت في حسابك وما الخطوة القادمة لتطوير ادائك.",
    image:
      "https://images.unsplash.com/photo-1521791136064-7986c2920216?auto=format&fit=crop&w=1400&q=80"
  },
  {
    title: "توصيات مباشرة",
    description: "إشارات تداول عالية الدقة يتم تحديثها يومياً بناءً على تحليل فني دقيق.",
    image:
      "https://images.unsplash.com/photo-1767424412548-1a1ac7f4b9bc?auto=format&fit=crop&w=1600&q=80"
  },
  {
    title: "انتبه !",
    description:
      "إدارة راس المال اساس للاستمرار في هذا السوق. ركّز على حجم العقد، نسبة المخاطرة في كل صفقة، وحدد وقف الخسارة مسبقاً قبل أي دخول.",
    image:
      "https://images.unsplash.com/photo-1772413438851-f6dd22c7ebe1?auto=format&fit=crop&w=1600&q=80"
  }
];

export default async function LandingPage() {
  const session = await getServerSession();
  const isAdmin = session?.role === "ADMIN";

  return (
    <div
      className="relative w-full overflow-x-hidden bg-[#101415] text-[#e0e3e5]"
    >
      <section className="relative flex min-h-screen items-center" dir="rtl">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-l from-[#0A192F]/90 via-[#0A192F]/70 to-transparent" />
          <img
            alt="Trading environment"
            className="h-full w-full object-cover"
            src="https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=2200&q=80"
          />
        </div>
        <div className="relative z-10 mx-auto w-full max-w-[1280px] px-8 py-16">
          <ScrollReveal className="max-w-2xl space-y-6">
            <span className="inline-block rounded border border-[#e9c349]/30 bg-[#e9c349]/10 px-3 py-1 text-xs font-semibold text-[#e9c349]">
              غولدن بيك اكاديمية تعليم تداول الفوركس
            </span>
            <h1 className="text-4xl font-black leading-tight text-white sm:text-5xl">
              احترف التداول داخل سوق الفوركس<br />
              <span className="text-[#4ae183]">بدقة وانضباط عالي</span>
            </h1>
            <p className="max-w-xl text-lg text-[#c5c6cd]">
              تعلم أسرار التداول من الخبراء الحقيقيين. نقدم لك تدريباً شاملاً يعتمد على التحليل الفني
              المتقدم وإدارة المخاطر الصارمة لتحقيق الاستقلال المالي.
            </p>
            <div className="flex flex-wrap gap-4 pt-2">
              {isAdmin ? (
                <Link
                  href="/staff-portal"
                  className="rounded-lg border border-[#e9c349]/45 bg-[#e9c349]/10 px-8 py-4 text-sm font-bold text-[#f6db73] transition-all hover:shadow-[0_0_20px_rgba(233,195,73,0.22)] active:scale-95"
                >
                  الدخول إلى لوحة الإدارة
                </Link>
              ) : (
                <Link
                  href="/register"
                  className="rounded-lg bg-[#4ae183] px-8 py-4 text-sm font-bold text-[#003919] transition-all hover:shadow-[0_0_20px_rgba(74,225,131,0.4)] active:scale-95"
                >
                  انضم إلينا الآن
                </Link>
              )}

            </div>
            <HeroStats />
          </ScrollReveal>
        </div>
      </section>

      <section className="bg-[#101415] py-20" dir="rtl" id="academy">
        <div className="mx-auto max-w-[1280px] px-8">
          <ScrollReveal className="mb-16 text-center">
            <h2 className="mb-4 text-3xl font-bold text-white">لماذا تختار Golden Peak؟</h2>
            <p className="mx-auto max-w-2xl text-[#c5c6cd]">
              نحن لا نعلمك التداول فقط، بل نصقل مهاراتك لتفكر كالمؤسسات المالية الكبرى.
            </p>
          </ScrollReveal>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-12">
            <ScrollReveal delayMs={40} className="md:col-span-8">
            <article className="group relative overflow-hidden rounded-xl border border-white/10 bg-[#0A192F]/70 p-8 backdrop-blur-xl">
              <div className="relative z-10 mt-36">
                <h3 className="mb-2 text-2xl font-bold text-white">{featureCards[0].title}</h3>
                <p className="max-w-lg text-[#c5c6cd]">{featureCards[0].description}</p>
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 to-transparent" />
              <img
                alt={featureCards[0].title}
                className="absolute inset-0 -z-10 h-full w-full object-cover opacity-30 transition-transform duration-700 group-hover:scale-105"
                src={featureCards[0].image}
              />
            </article>
            </ScrollReveal>

            <ScrollReveal delayMs={120} className="md:col-span-4">
            <article className="group relative overflow-hidden rounded-xl border border-white/10 bg-[#0A192F]/40 p-8">
              <div className="absolute inset-0 z-0">
                <img
                  alt={featureCards[1].title}
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  src={featureCards[1].image}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#07101f]/90 via-[#07101f]/45 to-[#07101f]/20" />
              </div>
              <div className="relative z-10 flex min-h-[280px] flex-col justify-end space-y-3">
                <h3 className="text-xl font-semibold text-white">{featureCards[1].title}</h3>
                <p className="text-sm leading-7 text-[#c5c6cd]">{featureCards[1].description}</p>
              </div>
            </article>
            </ScrollReveal>

            <ScrollReveal delayMs={180} className="md:col-span-4">
            <article className="group relative overflow-hidden rounded-xl border border-white/10 bg-[#0A192F]/40 p-8">
              <div className="absolute inset-0 z-0">
                <img
                  alt={featureCards[2].title}
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  src={featureCards[2].image}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#07101f]/90 via-[#07101f]/50 to-[#07101f]/20" />
              </div>
              <div className="relative z-10 flex min-h-[280px] flex-col justify-end space-y-3">
                <h3 className="text-xl font-semibold text-white">{featureCards[2].title}</h3>
                <p className="text-sm leading-7 text-[#c5c6cd]">{featureCards[2].description}</p>
              </div>
            </article>
            </ScrollReveal>

            <ScrollReveal delayMs={240} className="md:col-span-8">
            <article className="group relative overflow-hidden rounded-xl border border-white/10 bg-[#0A192F]/70 p-8 backdrop-blur-xl">
              <div className="relative z-10 mt-36">
                <h3 className="mb-2 text-6xl font-bold text-red-500">{featureCards[3].title}</h3>
                <p className="max-w-lg text-[#c5c6cd]">{featureCards[3].description}</p>
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 to-transparent" />
              <img
                alt={featureCards[3].title}
                className="absolute inset-0 -z-10 h-full w-full object-cover opacity-30 transition-transform duration-700 group-hover:scale-105"
                src={featureCards[3].image}
              />
            </article>
            </ScrollReveal>
          </div>
        </div>
      </section>

      <section className="bg-[#191c1e] py-20" dir="rtl" id="analysis">
        <div className="mx-auto max-w-[1280px] px-8">
          <ScrollReveal className="mb-12">
            <div>
              <h2 className="text-3xl font-bold text-white">مساراتنا التعليمية</h2>
              <p className="mt-2 text-[#c5c6cd]">مسار تدريبي متكامل للانطلاق بثقة في سوق التداول.</p>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-1">
            <ScrollReveal delayMs={80}>
            <article className="overflow-hidden rounded-xl border border-white/10 bg-[#1d2022] shadow-[0_20px_50px_rgba(0,0,0,0.25)]">
              <div className="relative h-72 w-full md:h-96">
                <img
                  alt="مسار أساسيات التداول والتحليل الفني"
                  className="h-full w-full object-cover"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuDsY-sIo_raSzhdEzQzajIDjffhtWwbFzxWJ1V4Z9Q1dQAkWJ6QO2RLkBjS3AqmEphYFQK8n1mDN3butNeYt5zITADNE2aAe8BB8uhMt1FkIoFML02SO43vQugFjrkV9o0V7xUQxLEgpDo6GIYEPW_sodApslOH2kexVqRv3jLEWduC_e17uUY-O-ixNHPHm0dHaDY-R0wqCAsyLLWhl_3tHMNpV5Lm-Tgr8omD4RotnjPHOH12x9IxS0oQK3JO-N7Ng0BiCawcDnSV"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/20 to-transparent" />
              </div>
              <div className="space-y-4 p-8 md:p-10">
                <h3 className="text-2xl font-semibold text-white md:text-3xl">
                  كورس أساسيات التداول + أساسيات التحليل الفني
                </h3>
                <p className="text-sm leading-8 text-[#c5c6cd] md:text-base">
                  تعلّم أساسيات التداول، وما يعنيه سوق الفوركس، وأنواع الأزواج الموجودة، وإدارة
                  المخاطر الحقيقية، ومناطق العرض والطلب، والدعم والمقاومة، وتحديد الاتجاه إذا كان
                  صاعدًا أم هابطًا.
                </p>
              </div>
            </article>
            </ScrollReveal>
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden bg-[#101415] py-20" dir="rtl" id="mentorship">
        <div className="mx-auto grid max-w-[1280px] grid-cols-1 items-center gap-16 px-8 md:grid-cols-2">
          <ScrollReveal className="order-2 md:order-1">
            <div className="mb-6 h-1 w-20 bg-[#e9c349]" />
            <h2 className="mb-6 text-3xl font-bold text-white">مهمتنا: تمكين المتداولين العرب</h2>
            <p className="mb-6 text-lg text-[#c5c6cd]">
              تأسست Golden Peak بهدف سد الفجوة بين التعليم النظري والواقع العملي لأسواق المال. نحن
              نؤمن بأن كل فرد لديه القدرة على النجاح في الفوركس إذا توفر له الإرشاد الصحيح والأدوات
              المناسبة.
            </p>
            <p className="mb-8 text-[#c5c6cd]">
              رؤيتنا هي أن نكون المرجع الأول للتعليم المالي في الوطن العربي، مع التركيز التام على
              الشفافية والنتائج الحقيقية لطلابنا.
            </p>
            <div className="flex items-center gap-4">
              <div className="flex -space-x-4 space-x-reverse">
                <div className="h-12 w-12 rounded-full border-2 border-[#101415] bg-slate-700" />
                <div className="h-12 w-12 rounded-full border-2 border-[#101415] bg-slate-600" />
                <div className="h-12 w-12 rounded-full border-2 border-[#101415] bg-slate-500" />
              </div>
              <span className="text-sm text-white">انضم إلى أكثر من 43 طالب نشط حالياً</span>
            </div>
          </ScrollReveal>
          <ScrollReveal className="order-1 md:order-2" delayMs={120}>
            <div className="relative">
              <div className="absolute -right-4 -top-4 h-full w-full rounded-xl border border-[#e9c349]/25" />
              <img
                alt="Mentor portrait"
                className="relative z-10 aspect-[4/5] w-full rounded-xl object-cover shadow-2xl"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuCe6OBtWfFF1om-cD5VPm9STtCqQGen3GJebD99ww7nB27WDoePLjC3SSN_m6XQ-uKecxXtGefoVTYLBlT-eEP-dzhHraFKfPWnM-k0nvNNWYdXPhGZx75KLI57cz7jidvZs3oCBY3eueLVMawfQHo5BQl058ZVFxJQzUx6MWOKM3Iz0cbUCFVGCD_a6dlXMkXGaFseMlDg8pHe3FtQg3pYQtAvqvkVSENF9sV5oVMB_RWjFb3Du2_HlUXqi4EUioCiQpmWwImqVkGY"
              />
            </div>
          </ScrollReveal>
        </div>
      </section>

      <section className="bg-[#0A192F] py-20" dir="rtl" id="signals">
        <div className="mx-auto max-w-[1320px] px-8">
          <ScrollReveal className="mb-10 text-center">
            <h2 className="text-3xl font-bold text-white">الرسم البياني المباشر لأسعار الذهب</h2>
            <p className="mt-3 text-[#c5c6cd]">متابعة لحظية لحركة الذهب (XAU/USD) عبر مزود بيانات موثوق.</p>
          </ScrollReveal>
          <ScrollReveal delayMs={80}>
            <TradingViewWidget title="الذهب (Gold)" symbol="TVC:GOLD" height={700} />
          </ScrollReveal>
        </div>
      </section>

      <section className="relative overflow-hidden bg-[#101415] py-20" dir="rtl" id="about">
        <div className="mx-auto max-w-[1280px] px-8">
          <ScrollReveal>
          <div
            className={`mx-auto max-w-4xl overflow-hidden rounded-2xl border border-white/10 bg-[#0A192F]/70 backdrop-blur-xl ${isAdmin ? "grid grid-cols-1" : "grid grid-cols-1 md:grid-cols-2"}`}
          >
            <div className="flex flex-col justify-center bg-[#4ae183]/5 p-10">
              {isAdmin ? (
                <>
                  <h2 className="mb-6 text-3xl font-bold text-white">وضع الإدارة مفعل</h2>
                  <p className="mb-8 text-[#c5c6cd]">
                    تم إخفاء نماذج التسجيل والانضمام أثناء تسجيل دخول الإدارة.
                  </p>
                  <div className="flex">
                    <Link
                      href="/staff-portal"
                      className="rounded-lg border border-[#e9c349]/45 bg-[#e9c349]/10 px-6 py-3 text-sm font-bold text-[#f6db73] transition-all hover:shadow-[0_0_20px_rgba(233,195,73,0.22)] active:scale-95"
                    >
                      فتح لوحة الإدارة
                    </Link>
                  </div>
                </>
              ) : (
                <>
                  <h2 className="mb-6 text-3xl font-bold text-white">هل أنت جاهز للبدء؟</h2>
                  <p className="mb-8 text-[#c5c6cd]">
                    سجل اهتمامك الآن وسيتواصل معك أحد مستشارينا لتحديد المسار الأنسب لك.
                  </p>
                  <div className="space-y-4 text-sm">
                    <div className="flex items-center gap-3 text-[#c5c6cd]">
                      <span className="text-[#4ae183]">●</span>
                      تحليل مجاني لنمط تداولك
                    </div>
                    <div className="flex items-center gap-3 text-[#c5c6cd]">
                      <span className="text-[#4ae183]">●</span>
                      استشارة مجانية
                    </div>
                    <div className="flex items-center gap-3 text-[#c5c6cd]">
                      <span className="text-[#4ae183]">●</span>
                      تجربة أسبوعية
                    </div>
                  </div>
                </>
              )}
            </div>
            {!isAdmin && (
              <div className="p-10">
                <LandingLeadForm />
              </div>
            )}
          </div>
          </ScrollReveal>
        </div>
        <div className="absolute -right-1/2 top-0 h-96 w-96 rounded-full bg-[#e9c349]/10 blur-[120px]" />
        <div className="absolute -left-1/2 bottom-0 h-96 w-96 rounded-full bg-[#4ae183]/10 blur-[120px]" />
      </section>
    </div>
  );
}
