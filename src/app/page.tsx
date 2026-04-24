import Link from "next/link";
import { Inter } from "next/font/google";

import { LandingLeadForm } from "@/components/LandingLeadForm";

const inter = Inter({ subsets: ["latin"], display: "swap" });

const featureCards = [
  {
    title: "دورات تعليمية شاملة",
    description:
      "مناهج دراسية مرتبة تأخذك من الصفر حتى الاحتراف، مع التركيز على سيكولوجية التداول والتحليل المتقدم.",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBgH0T2DrSlQbtMnLgoYcyimL1xdc2cM-pfwOAMwy3bLQr7kDv-0KS7JX9oC3S5Rk6J3QeSC4cZccfXw0N43ZprY1xZhB0IJAWmKd1t2xEol1VOD6aPMLSpRbXZ2sd7ryhgh-mJ4f8-O71xp0vCmlw-CKFeDAiJEPhGiHIDM7GEtdc5ooRtYKZU0gRiZwZ-Ism9VngzPSDGXTlFX25oWCV93HVNeEyxOJ6JgwonpHpqwudiTkRhSg0XJAPcVfa9w5BxJLfcvB6TUtH_"
  },
  {
    title: "خبراء موجهون",
    description: "جلسات توجيه مباشرة مع متداولين ذوي خبرة في الأسواق العالمية."
  },
  {
    title: "توصيات مباشرة",
    description: "إشارات تداول عالية الدقة يتم تحديثها يومياً بناءً على تحليل فني دقيق."
  },
  {
    title: "أدوات تداول حصرية",
    description: "تمتع بالوصول إلى مؤشراتنا الخاصة ولوحات البيانات المخصصة لتحليل السوق لحظة بلحظة.",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCsOFMXWrUjKZTXJJtIJvlEBCu88V47jSqTWSM88YKH3sboTN6V8koY6rrD-FvuGsPGrmo8wRjgXqoGv5tgB3O38XhsqvnKyxWhbPjkm1NFR5Gk722_L95x4RStpNfPzigu1CNNJp83FEAdYB2ATM7es45iCtICurVeHzTJd-q8qDBXHujL2jtqhVz2xk7PdDtEkly1J2p8O2ErjjfW-PNVphmLiVxt1X-vwMxJ6utn59r-CvDLq_EWUoKPOd3iqa01MAdr9NY8qPrN"
  }
];

const courses = [
  {
    level: "مبتدئ",
    title: "أساسيات الفوركس",
    description: "تعلم لغة السوق، منصات التداول، وكيفية تنفيذ أول صفقة لك بأمان.",
    price: "$199",
    duration: "4 أسابيع",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAHfxV3Xe-A4KladJg50Os62-jH4pDvsGMLd9fiVM0LHdGZwRLLxlUKpQMmcUb6Xi_QhpGthe9yiPxIsK6aWdsdsSvaBQnzO6ZK2oL7eDty0cCqp4O98VoJTsPy6HxjNSYn2esS9eBN-_SESxJbw6Bb9uc9N78H9oXZTh2XdOgUZRyxUDJkimVCHkPvpyuQPaaGDO1PPWISpsiLx12HANbF0AnckxnNs2Y0smkM__wRz4hVzhpgEgEWuBMKfpgRxnSaseqfHr58qErD"
  },
  {
    level: "متوسط",
    title: "التحليل الفني الاحترافي",
    description: "دراسة عميقة للنماذج السعرية، المؤشرات، واستراتيجيات العرض والطلب.",
    price: "$499",
    duration: "8 أسابيع",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuC6-1ksHLwf-iwUNjWS5V1S7RplgMKoiobHYNVuvUQDoIis4bN3F5sYLdOzK0NwXpGIswwNaUb3uZIDDOpMmrAQ5cgCG7kSdkE5nmmOPIkFsdcjK6_QaGh2K66vnu0BC_ZVSJhpAyffeWsPa56-wzmsSFC5VdGvMWD30hbWDLI3awpqK095zkFZMQ-tQec39Zcab2XrZrofqp0AGTG0vnnE7bcSMUB5EVL_H3AxC63MuLt-mNJJw3Ed8xTXYUFNrveZv5z14mw1YzFK",
    featured: true
  },
  {
    level: "متقدم",
    title: "إتقان التداول المؤسسي",
    description: "تعلم كيف تتداول مثل البنوك وصناديق التحوط باستخدام تدفق السيولة.",
    price: "$999",
    duration: "12 أسبوعاً",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDsY-sIo_raSzhdEzQzajIDjffhtWwbFzxWJ1V4Z9Q1dQAkWJ6QO2RLkBjS3AqmEphYFQK8n1mDN3butNeYt5zITADNE2aAe8BB8uhMt1FkIoFML02SO43vQugFjrkV9o0V7xUQxLEgpDo6GIYEPW_sodApslOH2kexVqRv3jLEWduC_e17uUY-O-ixNHPHm0dHaDY-R0wqCAsyLLWhl_3tHMNpV5Lm-Tgr8omD4RotnjPHOH12x9IxS0oQK3JO-N7Ng0BiCawcDnSV"
  }
];

const testimonials = [
  {
    quote:
      '"بفضل الدورة المتقدمة، تمكنت من فهم حركة السوق بوضوح لم أعهده من قبل. الآن أتداول بحساب ممول بنجاح."',
    name: "أحمد م.",
    role: "متداول ممول"
  },
  {
    quote:
      '"إشارات التداول كانت نقطة التحول بالنسبة لي. الدقة مذهلة والتحليل المرفق يساعدني على التعلم أثناء التداول."',
    name: "سارة ع.",
    role: "مستثمرة مستقلة"
  },
  {
    quote:
      '"أفضل استثمار قمت به هو الانضمام لهذه الأكاديمية. الدعم الفني والمتابعة المستمرة لا مثيل لهما."',
    name: "خالد و.",
    role: "متداول بدوام كامل"
  }
];

export default function LandingPage() {
  return (
    <div
      className={`relative w-full overflow-x-hidden bg-[#101415] text-[#e0e3e5] ${inter.className}`}
    >
      <section className="relative flex min-h-screen items-center" dir="rtl">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-l from-[#0A192F]/90 via-[#0A192F]/70 to-transparent" />
          <img
            alt="Trading environment"
            className="h-full w-full object-cover"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuBQEXEsaIJfnOMZdszcMfp_OY6Z7UoEy19luQMViS7eZZCeC70YtMMz5yCVR5P2UrROZXPByJsrQ4euLvK9WHv82_0V4YPMMXd7a6obqQhXRbE61haKi-To54R7DuRCudLbG9jreryvd7rz07au9FlZSr2yLLWxw4tRRSuPUd1LdMbD6r3uvcWg-JhUteUmI921SkMSlRpliD3PEoi4nnsOsgt60-AF1XnJivzU_Jks0B24GEpfLPOgqQdX-KTRRlt-wuB-iuRfuUGo"
          />
        </div>
        <div className="relative z-10 mx-auto w-full max-w-[1280px] px-8 py-16">
          <div className="max-w-2xl space-y-6">
            <span className="inline-block rounded border border-[#e9c349]/30 bg-[#e9c349]/10 px-3 py-1 text-xs font-semibold text-[#e9c349]">
              أكاديمية تداول العملات الأجنبية الرائدة
            </span>
            <h1 className="text-4xl font-black leading-tight text-white sm:text-5xl">
              احتراف سوق الفوركس <br />
              <span className="text-[#4ae183]">بدقة مؤسسية</span>
            </h1>
            <p className="max-w-xl text-lg text-[#c5c6cd]">
              تعلم أسرار التداول من الخبراء الحقيقيين. نقدم لك تدريباً شاملاً يعتمد على التحليل الفني
              المتقدم وإدارة المخاطر الصارمة لتحقيق الاستقلال المالي.
            </p>
            <div className="flex flex-wrap gap-4 pt-2">
              <Link
                href="/register"
                className="rounded-lg bg-[#4ae183] px-8 py-4 text-sm font-bold text-[#003919] transition-all hover:shadow-[0_0_20px_rgba(74,225,131,0.4)] active:scale-95"
              >
                انضم إلينا الآن
              </Link>

            </div>
            <div className="flex items-center gap-8 border-t border-white/10 pt-8">
              <div>
                <div className="text-2xl font-bold text-white">+15k</div>
                <div className="text-xs text-[#c5c6cd]">طالب متخرج</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-white">92%</div>
                <div className="text-xs text-[#c5c6cd]">نسبة الرضا</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-white">+10</div>
                <div className="text-xs text-[#c5c6cd]">سنوات خبرة</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[#101415] py-20" dir="rtl" id="academy">
        <div className="mx-auto max-w-[1280px] px-8">
          <div className="mb-16 text-center">
            <h2 className="mb-4 text-3xl font-bold text-white">لماذا تختار Golden Peak؟</h2>
            <p className="mx-auto max-w-2xl text-[#c5c6cd]">
              نحن لا نعلمك التداول فقط، بل نصقل مهاراتك لتفكر كالمؤسسات المالية الكبرى.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-12">
            <article className="group relative overflow-hidden rounded-xl border border-white/10 bg-[#0A192F]/70 p-8 backdrop-blur-xl md:col-span-8">
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

            <article className="rounded-xl border border-white/10 bg-[#0A192F]/70 p-8 text-center md:col-span-4">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full border border-[#e9c349]/30 bg-[#e9c349]/10 text-2xl">
                🧠
              </div>
              <h3 className="mb-2 text-xl font-semibold text-white">{featureCards[1].title}</h3>
              <p className="text-sm text-[#c5c6cd]">{featureCards[1].description}</p>
            </article>

            <article className="rounded-xl border border-white/10 bg-[#0A192F]/70 p-8 text-center md:col-span-4">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full border border-[#4ae183]/30 bg-[#4ae183]/10 text-2xl">
                📈
              </div>
              <h3 className="mb-2 text-xl font-semibold text-white">{featureCards[2].title}</h3>
              <p className="text-sm text-[#c5c6cd]">{featureCards[2].description}</p>
            </article>

            <article className="group relative overflow-hidden rounded-xl border border-white/10 bg-[#0A192F]/70 p-8 backdrop-blur-xl md:col-span-8">
              <div className="relative z-10 mt-36">
                <h3 className="mb-2 text-2xl font-bold text-white">{featureCards[3].title}</h3>
                <p className="max-w-lg text-[#c5c6cd]">{featureCards[3].description}</p>
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 to-transparent" />
              <img
                alt={featureCards[3].title}
                className="absolute inset-0 -z-10 h-full w-full object-cover opacity-30 transition-transform duration-700 group-hover:scale-105"
                src={featureCards[3].image}
              />
            </article>
          </div>
        </div>
      </section>

      <section className="bg-[#191c1e] py-20" dir="rtl" id="analysis">
        <div className="mx-auto max-w-[1280px] px-8">
          <div className="mb-12 flex flex-wrap items-end justify-between gap-4">
            <div>
              <h2 className="text-3xl font-bold text-white">مساراتنا التعليمية</h2>
              <p className="mt-2 text-[#c5c6cd]">اختر المستوى الذي يناسب طموحاتك المالية.</p>
            </div>
            <a className="hidden border-b border-[#e9c349] text-xs text-[#e9c349] md:block" href="#">
              عرض جميع الدورات
            </a>
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {courses.map((course) => (
              <article
                key={course.title}
                className={`overflow-hidden rounded-xl border bg-[#1d2022] ${
                  course.featured
                    ? "relative border-[#e9c349]/35 shadow-[0_20px_50px_rgba(233,195,73,0.08)]"
                    : "border-white/10"
                }`}
              >
                {course.featured && (
                  <span className="absolute left-1/2 top-3 z-10 -translate-x-1/2 rounded-full bg-[#e9c349] px-4 py-1 text-xs font-bold text-[#3c2f00]">
                    الأكثر طلباً
                  </span>
                )}
                <div className="relative h-48">
                  <img alt={course.title} className="h-full w-full object-cover" src={course.image} />
                  <span className="absolute right-4 top-4 rounded bg-[#0A192F]/85 px-3 py-1 text-xs text-white">
                    {course.level}
                  </span>
                </div>
                <div className="space-y-4 p-8">
                  <h3 className="text-2xl font-semibold text-white">{course.title}</h3>
                  <p className="text-sm text-[#c5c6cd]">{course.description}</p>
                  <div className="flex items-center justify-between border-y border-white/5 py-4">
                    <div className="text-2xl font-bold text-[#e9c349]">{course.price}</div>
                    <div className="text-sm text-[#c5c6cd]">{course.duration}</div>
                  </div>
                  <button
                    className={`w-full rounded-lg py-3 text-sm font-bold transition-colors ${
                      course.featured
                        ? "bg-[#e9c349] text-[#3c2f00] hover:brightness-110"
                        : "border border-white/15 text-white hover:bg-white/5"
                    }`}
                    type="button"
                  >
                    {course.featured ? "اشترك الآن" : "عرض التفاصيل"}
                  </button>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden bg-[#101415] py-20" dir="rtl" id="mentorship">
        <div className="mx-auto grid max-w-[1280px] grid-cols-1 items-center gap-16 px-8 md:grid-cols-2">
          <div className="order-2 md:order-1">
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
              <span className="text-sm text-white">انضم إلى أكثر من 5000 طالب نشط حالياً</span>
            </div>
          </div>
          <div className="order-1 md:order-2">
            <div className="relative">
              <div className="absolute -right-4 -top-4 h-full w-full rounded-xl border border-[#e9c349]/25" />
              <img
                alt="Mentor portrait"
                className="relative z-10 aspect-[4/5] w-full rounded-xl object-cover shadow-2xl"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuCe6OBtWfFF1om-cD5VPm9STtCqQGen3GJebD99ww7nB27WDoePLjC3SSN_m6XQ-uKecxXtGefoVTYLBlT-eEP-dzhHraFKfPWnM-k0nvNNWYdXPhGZx75KLI57cz7jidvZs3oCBY3eueLVMawfQHo5BQl058ZVFxJQzUx6MWOKM3Iz0cbUCFVGCD_a6dlXMkXGaFseMlDg8pHe3FtQg3pYQtAvqvkVSENF9sV5oVMB_RWjFb3Du2_HlUXqi4EUioCiQpmWwImqVkGY"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[#0A192F] py-20" dir="rtl" id="signals">
        <div className="mx-auto max-w-[1280px] px-8">
          <h2 className="mb-16 text-center text-3xl font-bold text-white">قصص نجاح طلابنا</h2>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {testimonials.map((testimonial, index) => (
              <article
                key={testimonial.name}
                className={`relative rounded-xl border p-8 backdrop-blur-xl ${
                  index === 1 ? "border-[#e9c349]/30 bg-[#0A192F]/70" : "border-white/10 bg-[#0A192F]/65"
                }`}
              >
                <p className="mb-6 text-[#e0e3e5]">{testimonial.quote}</p>
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-full bg-slate-500" />
                  <div>
                    <div className="font-bold text-white">{testimonial.name}</div>
                    <div className="text-xs text-[#4ae183]">{testimonial.role}</div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden bg-[#101415] py-20" dir="rtl" id="about">
        <div className="mx-auto max-w-[1280px] px-8">
          <div className="mx-auto grid max-w-4xl grid-cols-1 overflow-hidden rounded-2xl border border-white/10 bg-[#0A192F]/70 backdrop-blur-xl md:grid-cols-2">
            <div className="flex flex-col justify-center bg-[#4ae183]/5 p-10">
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
                  تجربة أسبوعية للإشارات الممتازة
                </div>
                <div className="flex items-center gap-3 text-[#c5c6cd]">
                  <span className="text-[#4ae183]">●</span>
                  خصم 20% على أول دورة تدريبية
                </div>
              </div>
            </div>
            <div className="p-10">
              <LandingLeadForm />
            </div>
          </div>
        </div>
        <div className="absolute -right-1/2 top-0 h-96 w-96 rounded-full bg-[#e9c349]/10 blur-[120px]" />
        <div className="absolute -left-1/2 bottom-0 h-96 w-96 rounded-full bg-[#4ae183]/10 blur-[120px]" />
      </section>
    </div>
  );
}
