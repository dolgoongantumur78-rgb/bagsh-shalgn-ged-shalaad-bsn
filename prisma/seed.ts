import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const employers = [
  { name: "Мэдлэг Тек",    email: "hr@medleg.mn",    company: "Мэдлэг Тек ХХК",    industry: "IT & Технологи" },
  { name: "Монпэй",         email: "hr@monpay.mn",    company: "МонПэй ХХК",         industry: "Санхүү"         },
  { name: "Бизнес Медиа",   email: "hr@bmedia.mn",    company: "Бизнес Медиа ХХК",   industry: "Маркетинг"      },
  { name: "Эрдэм Сургалт",  email: "hr@erdem.mn",     company: "Эрдэм Сургалт ХХК",  industry: "Боловсрол"      },
  { name: "Мон Эрүүл",      email: "hr@monhealth.mn", company: "Мон Эрүүл ХХК",      industry: "Эрүүл мэнд"    },
  { name: "Инфра Буд",      email: "hr@infrabud.mn",  company: "Инфра Буд ХХК",      industry: "Инженерчлэл"   },
  { name: "Гранд Сервис",   email: "hr@grand.mn",     company: "Гранд Сервис ХХК",   industry: "Бусад"          },
];

const jobs = [
  /* ── IT & Технологи ── */
  {
    employerIdx: 0,
    title: "Senior Full-Stack Developer",
    description: `Бид таны туршлага болон бүтээлч чадварыг хайж байна. Манай баг Next.js, Node.js, PostgreSQL технологийн стекийг ашигладаг. Та манай платформын шинэ features-уудыг хөгжүүлж, existing code-г refactor хийх ажлыг хийнэ.\n\nАжлын үндсэн үүрэг:\n- Full-stack web application хөгжүүлэх\n- API design болон implementation\n- Code review болон team mentoring\n- Performance optimization`,
    requirements: `- Next.js / React 3+ жилийн туршлага\n- Node.js, TypeScript дадлагатай\n- SQL / NoSQL database мэдлэг\n- Git, CI/CD ажиллаж чадах\n- Монгол эсвэл Англи хэлэнд чөлөөтэй`,
    location: "Улаанбаатар / Зайнаас", salary: "3,500,000₮", jobType: "Зайнаас", category: "IT & Технологи",
    openness: 75, conscientiousness: 65, extraversion: 40, agreeableness: 65, neuroticism: 30,
  },
  {
    employerIdx: 0,
    title: "UI/UX Designer",
    description: `Манай дизайн баг таны бүтээлч оруулцыг хүлээж байна. Figma ашиглан product дизайн хийж, хэрэглэгчийн судалгаа явуулж, design system дэмжих ажлыг хийнэ.\n\nАжлын үүрэг:\n- Figma-д wireframe, prototype хийх\n- User research болон usability test\n- Design system тогтоох, хадгалах\n- Developer-тай нягт хамтран ажиллах`,
    requirements: `- Figma, Adobe XD дадлагатай\n- Portfolio байх\n- Design principles болон UX research мэдлэг\n- 2+ жилийн туршлага`,
    location: "Улаанбаатар", salary: "2,500,000₮", jobType: "Бүтэн цагийн", category: "IT & Технологи",
    openness: 85, conscientiousness: 60, extraversion: 55, agreeableness: 70, neuroticism: 35,
  },
  {
    employerIdx: 0,
    title: "DevOps Engineer",
    description: `Манай infrastructure баг AWS, Kubernetes, Terraform-д суурилсан систем барьж байна. CI/CD pipeline, monitoring, security-г хариуцах инженер хайж байна.\n\nАжлын үүрэг:\n- Kubernetes cluster удирдах\n- CI/CD pipeline хөгжүүлэх\n- Monitoring болон alerting тохируулах\n- Security best practice нэвтрүүлэх`,
    requirements: `- AWS эсвэл GCP туршлагатай\n- Kubernetes, Docker мэдлэг\n- Terraform, Ansible туршлага\n- Linux administration\n- 3+ жилийн туршлага`,
    location: "Улаанбаатар", salary: "3,800,000₮", jobType: "Бүтэн цагийн", category: "IT & Технологи",
    openness: 60, conscientiousness: 80, extraversion: 35, agreeableness: 55, neuroticism: 25,
  },
  {
    employerIdx: 0,
    title: "Mobile Developer (React Native)",
    description: `iOS болон Android платформд зэрэг ажилладаг React Native app хөгжүүлэх инженер хайж байна. Манай app сарын 200,000+ хэрэглэгчтэй.\n\nАжлын үүрэг:\n- React Native app хөгжүүлэх\n- Performance optimization\n- API интеграц\n- App Store / Play Store нийтлэх`,
    requirements: `- React Native 2+ жилийн туршлага\n- TypeScript, Redux мэдлэг\n- Native module ажиллуулж чадах\n- iOS/Android platform мэдлэг`,
    location: "Зайнаас", salary: "3,200,000₮", jobType: "Зайнаас", category: "IT & Технологи",
    openness: 70, conscientiousness: 70, extraversion: 45, agreeableness: 60, neuroticism: 30,
  },
  {
    employerIdx: 0,
    title: "Data Analyst",
    description: `Мэдээлэлд суурилсан шийдвэр гаргалтыг дэмжих data analyst хайж байна. Python, SQL, Tableau ашиглан тайлан гаргаж, insight бэлтгэнэ.\n\nАжлын үүрэг:\n- Мэдээлэл цуглуулж, цэвэрлэж, шинжлэх\n- Dashboard болон тайлан бэлтгэх\n- A/B test дизайн, шинжилгээ\n- Stakeholder-т танилцуулах`,
    requirements: `- Python, SQL дадлагатай\n- Tableau эсвэл Power BI мэдлэг\n- Статистикийн мэдлэг\n- Excel advanced\n- 1+ жилийн туршлага`,
    location: "Улаанбаатар", salary: "2,200,000₮", jobType: "Бүтэн цагийн", category: "IT & Технологи",
    openness: 65, conscientiousness: 75, extraversion: 45, agreeableness: 60, neuroticism: 35,
  },

  /* ── Санхүү ── */
  {
    employerIdx: 1,
    title: "Санхүүгийн Шинжээч",
    description: `Манай санхүүгийн баг тайлан, мэдээлэл шинжилгээ, төсөв төлөвлөлтийг хариуцах шинжээч хайж байна.\n\nАжлын үүрэг:\n- Сарын, улирлын санхүүгийн тайлан бэлтгэх\n- Төсөв төлөвлөх, мөшгих\n- Зардал хэмнэх боломж тодорхойлох\n- Management-т санал зөвлөмж гаргах`,
    requirements: `- Санхүү, Нягтлан бодох бүртгэлийн чиглэлийн дипломтой\n- Excel advanced, SAP туршлага давуу тал\n- 2+ жилийн санхүүгийн туршлага\n- CFA эсвэл ACCA мэдлэг давуу тал`,
    location: "Улаанбаатар", salary: "2,800,000₮", jobType: "Бүтэн цагийн", category: "Санхүү",
    openness: 45, conscientiousness: 85, extraversion: 40, agreeableness: 60, neuroticism: 25,
  },
  {
    employerIdx: 1,
    title: "Нягтлан Бодогч",
    description: `Манай компанийн нягтлан бодох бүртгэлийг хариуцах туршлагатай мэргэжилтэн хайж байна.\n\nАжлын үүрэг:\n- Өдрийн гүйлгээ бүртгэх\n- Татварын тайлан бэлтгэх\n- Аудитад бэлтгэх\n- Дотоод хяналт хэрэгжүүлэх`,
    requirements: `- НББ-ийн чиглэлийн их дээд сургуулийн диплом\n- 1С Нягтлан программ мэдэх\n- Монгол татварын хуулийн мэдлэг\n- Нарийвчлалтай, хариуцлагатай`,
    location: "Улаанбаатар", salary: "1,800,000₮", jobType: "Бүтэн цагийн", category: "Санхүү",
    openness: 35, conscientiousness: 90, extraversion: 35, agreeableness: 65, neuroticism: 20,
  },
  {
    employerIdx: 1,
    title: "Хөрөнгө Оруулалтын Зөвлөх",
    description: `Хувь хүн болон байгууллагын хөрөнгө оруулалтын шийдвэрийг дэмжих зөвлөх хайж байна.\n\nАжлын үүрэг:\n- Хөрөнгө оруулалтын дүн шинжилгээ хийх\n- Portfolio управлял\n- Харилцагчтай харилцах, зөвлөх\n- Зах зээлийн чиг хандлагыг хянах`,
    requirements: `- Санхүү, Эдийн засгийн дипломтой\n- Хөрөнгийн зах зээлийн мэдлэгтэй\n- CFA 1 дүгээр шатны шалгалт өгсөн бол давуу тал\n- Харилцааны ур чадвар сайн`,
    location: "Улаанбаатар", salary: "3,500,000₮", jobType: "Бүтэн цагийн", category: "Санхүү",
    openness: 60, conscientiousness: 75, extraversion: 65, agreeableness: 65, neuroticism: 30,
  },

  /* ── Маркетинг ── */
  {
    employerIdx: 2,
    title: "Digital Marketing Manager",
    description: `Манай брэндийн цахим маркетингийг удирдах менежер хайж байна. SEO, SEM, social media болон email маркетингийг нэгтгэн удирдана.\n\nАжлын үүрэг:\n- Маркетингийн стратеги боловсруулах\n- Google Ads, Meta Ads кампанит ажил удирдах\n- SEO / content marketing\n- KPI хэмжиж, тайлагнах`,
    requirements: `- 3+ жилийн digital маркетингийн туршлага\n- Google Ads, Meta Business Suite туршлага\n- Google Analytics, SEMrush мэдлэг\n- Агуулга бичих ур чадвар`,
    location: "Улаанбаатар", salary: "2,600,000₮", jobType: "Бүтэн цагийн", category: "Маркетинг",
    openness: 80, conscientiousness: 65, extraversion: 70, agreeableness: 65, neuroticism: 35,
  },
  {
    employerIdx: 2,
    title: "Content Creator / Видео Эдитор",
    description: `Social media болон YouTube-д зориулсан видео контент бүтээх бүтээлч хүн хайж байна.\n\nАжлын үүрэг:\n- Видео бичлэг, засварлах\n- Script бичих\n- Thumbnail дизайн\n- TikTok, Instagram, YouTube-д нийтлэх`,
    requirements: `- Adobe Premiere Pro эсвэл DaVinci Resolve туршлага\n- Бүтээлч portfolio байх\n- After Effects мэдлэг давуу тал\n- Трэнд мэдрэмжтэй`,
    location: "Улаанбаатар / Зайнаас", salary: "1,800,000₮", jobType: "Гэрээт", category: "Маркетинг",
    openness: 90, conscientiousness: 55, extraversion: 60, agreeableness: 65, neuroticism: 40,
  },
  {
    employerIdx: 2,
    title: "PR & Харилцааны Мэргэжилтэн",
    description: `Брэндийн олон нийттэй харилцах, хэвлэл мэдээллийн харилцаа болон нийгэмлэгийн менежментийг хариуцах мэргэжилтэн хайж байна.\n\nАжлын үүрэг:\n- Хэвлэл мэдээллийн харилцаа\n- Press release бичих\n- Брэндийн дүр төрх хамгаалах\n- Event зохион байгуулах`,
    requirements: `- Маркетинг, Харилцаа холбоо чиглэлийн диплом\n- Хэвлэл мэдээллийн байгууллагатай хамтарч ажилласан туршлага\n- Монгол болон Англи хэлэнд маш сайн`,
    location: "Улаанбаатар", salary: "2,200,000₮", jobType: "Бүтэн цагийн", category: "Маркетинг",
    openness: 70, conscientiousness: 65, extraversion: 80, agreeableness: 75, neuroticism: 35,
  },

  /* ── Боловсрол ── */
  {
    employerIdx: 3,
    title: "Математикийн Багш (10-12 анги)",
    description: `Дунд сургуулийн ахлах ангийн математикийн хичээл заах туршлагатай багш хайж байна.\n\nАжлын үүрэг:\n- 10-12 ангийн математик заах\n- ЭЕШ-д бэлтгэх\n- Сурагчдын явцыг хянах\n- Эцэг эхтэй харилцах`,
    requirements: `- Математик эсвэл Боловсролын дипломтой\n- 2+ жилийн заах туршлага\n- Хүүхэдтэй ажиллах дуртай\n- Тэвчээртэй, тайлбарлах чадвартай`,
    location: "Улаанбаатар", salary: "1,600,000₮", jobType: "Бүтэн цагийн", category: "Боловсрол",
    openness: 55, conscientiousness: 75, extraversion: 60, agreeableness: 80, neuroticism: 30,
  },
  {
    employerIdx: 3,
    title: "Англи Хэлний Сургагч",
    description: `Насанд хүрэгчдэд болон хүүхдэд Англи хэл заах сургагч хайж байна. Online болон offline хоёуланд заах боломжтой.\n\nАжлын үүрэг:\n- IELTS, TOEFL бэлтгэл\n- Ярианы практик хичээл\n- Curriculum боловсруулах\n- Оюутнуудын явц хянах`,
    requirements: `- IELTS 7.5+ эсвэл TOEFL 100+ оноотой\n- TESOL / CELTA гэрчилгээ давуу тал\n- 1+ жилийн заах туршлага\n- Харилцааны ур чадвар маш сайн`,
    location: "Зайнаас / Улаанбаатар", salary: "1,400,000₮", jobType: "Хагас цагийн", category: "Боловсрол",
    openness: 65, conscientiousness: 65, extraversion: 70, agreeableness: 80, neuroticism: 30,
  },
  {
    employerIdx: 3,
    title: "Сургалтын Контент Боловсруулагч",
    description: `E-learning платформд зориулсан хичээлийн агуулга, видео лекц бэлтгэх мэргэжилтэн хайж байна.\n\nАжлын үүрэг:\n- Хичээлийн агуулга бичих\n- Дасгал, шалгалт бэлтгэх\n- Видео лекц бичлэгт дэмжлэг үзүүлэх\n- LMS систем удирдах`,
    requirements: `- Боловсролын технологийн туршлага\n- Бичих, агуулга хийх ур чадвар\n- Articulate, Canva мэдлэг давуу тал`,
    location: "Зайнаас", salary: "1,800,000₮", jobType: "Зайнаас", category: "Боловсрол",
    openness: 75, conscientiousness: 70, extraversion: 50, agreeableness: 70, neuroticism: 35,
  },

  /* ── Эрүүл мэнд ── */
  {
    employerIdx: 4,
    title: "Ерөнхий Эмч",
    description: `Манай эрүүл мэндийн төвд өвчтөнүүдийг хүлээн авч, оношлох, эмчлэх ерөнхий эмч хайж байна.\n\nАжлын үүрэг:\n- Өвчтөн хүлээн авах, оношлох\n- Дотоод өвчний эмчилгээ\n- Бичиг баримт бүртгэл хөтлөх\n- Мэргэжилтэн лүү чиглүүлэх`,
    requirements: `- Анагаах ухааны их сургуулийн диплом\n- МУ-д эмчлэх эрхийн гэрчилгээтэй\n- 2+ жилийн туршлага\n- Өвчтөнтэй харилцах ур чадвар сайн`,
    location: "Улаанбаатар", salary: "3,000,000₮", jobType: "Бүтэн цагийн", category: "Эрүүл мэнд",
    openness: 55, conscientiousness: 85, extraversion: 55, agreeableness: 80, neuroticism: 20,
  },
  {
    employerIdx: 4,
    title: "Сувилагч",
    description: `Манай эмнэлэгт өдрийн болон шөнийн ээлжинд ажиллах сувилагч хайж байна.\n\nАжлын үүрэг:\n- Өвчтөн хяналт, асаргаа\n- Эм хийх, тарилга хийх\n- Бичиг баримт бүртгэх\n- Эмчтэй хамтран ажиллах`,
    requirements: `- Сувилахуйн чиглэлийн диплом\n- Сувилагчийн үнэмлэхтэй\n- Ээлжийн ажилд бэлэн\n- Тэвчээртэй, анхааралтай`,
    location: "Улаанбаатар", salary: "1,600,000₮", jobType: "Бүтэн цагийн", category: "Эрүүл мэнд",
    openness: 45, conscientiousness: 80, extraversion: 55, agreeableness: 85, neuroticism: 25,
  },
  {
    employerIdx: 4,
    title: "Физик Эмчилгээний Мэргэжилтэн",
    description: `Физик эмчилгээний кабинетэд өвчтөнтэй шууд ажиллах мэргэжилтэн хайж байна.\n\nАжлын үүрэг:\n- Өвчтөний нөхөн сэргээх хөтөлбөр боловсруулах\n- Физик эмчилгээний процедур хийх\n- Явцыг бүртгэх\n- Мэргэжлийн зөвлөгөө өгөх`,
    requirements: `- Физик эмчилгээний дипломтой\n- 1+ жилийн туршлага\n- Ergonomics болон anatomi мэдлэг\n- Харилцааны ур чадвар сайн`,
    location: "Улаанбаатар", salary: "2,200,000₮", jobType: "Бүтэн цагийн", category: "Эрүүл мэнд",
    openness: 55, conscientiousness: 75, extraversion: 60, agreeableness: 85, neuroticism: 25,
  },

  /* ── Инженерчлэл ── */
  {
    employerIdx: 5,
    title: "Иргэний Инженер",
    description: `Барилга, дэд бүтцийн төслүүд дээр ажиллах иргэний инженер хайж байна. AutoCAD болон BIM программ ашиглан дизайн хийнэ.\n\nАжлын үүрэг:\n- Барилгын зураг төсөл боловсруулах\n- Байгуулалтын ажлыг хянах\n- Техникийн тооцоолол хийх\n- Захиалагчтай харилцах`,
    requirements: `- Иргэний болон Барилгын инженерийн диплом\n- AutoCAD, Revit туршлага\n- 3+ жилийн туршлага\n- Монгол барилгын норматив мэдлэгтэй`,
    location: "Улаанбаатар", salary: "2,800,000₮", jobType: "Бүтэн цагийн", category: "Инженерчлэл",
    openness: 50, conscientiousness: 85, extraversion: 45, agreeableness: 60, neuroticism: 20,
  },
  {
    employerIdx: 5,
    title: "Механикийн Инженер",
    description: `Үйлдвэрлэлийн машин тоног төхөөрөмж, засвар үйлчилгээ хариуцах механикийн инженер хайж байна.\n\nАжлын үүрэг:\n- Машин механизм ажиллуулах, засварлах\n- Урьдчилан сэргийлэх засвар хийх\n- Техникийн баримт бичиг хөтлөх\n- Аюулгүй байдлын дүрмийг мөрдөх`,
    requirements: `- Механикийн инженерийн диплом\n- SolidWorks, AutoCAD туршлага\n- Hydraulic, pneumatic систем мэдлэг\n- 2+ жилийн туршлага`,
    location: "Улаанбаатар", salary: "2,600,000₮", jobType: "Бүтэн цагийн", category: "Инженерчлэл",
    openness: 50, conscientiousness: 80, extraversion: 40, agreeableness: 60, neuroticism: 25,
  },
  {
    employerIdx: 5,
    title: "Цахилгааны Инженер",
    description: `Барилга болон үйлдвэрийн цахилгааны систем суурилуулах, засварлах цахилгааны инженер хайж байна.\n\nАжлын үүрэг:\n- Цахилгааны схем зургаар ажиллах\n- Суурилуулалт, ажиллуулалт\n- Алдаа оношлох, засварлах\n- Аюулгүй байдлын стандарт мөрдөх`,
    requirements: `- Цахилгааны инженерийн диплом\n- 2+ жилийн туршлага\n- AutoCAD Electrical мэдлэг\n- OSHA аюулгүй байдлын гэрчилгээ давуу тал`,
    location: "Улаанбаатар", salary: "2,700,000₮", jobType: "Бүтэн цагийн", category: "Инженерчлэл",
    openness: 45, conscientiousness: 80, extraversion: 45, agreeableness: 60, neuroticism: 20,
  },

  /* ── Бусад ── */
  {
    employerIdx: 6,
    title: "Хэрэглэгчийн Үйлчилгээний Мэргэжилтэн",
    description: `Харилцагчидтай утсаар болон чатаар харилцах customer support мэргэжилтэн хайж байна.\n\nАжлын үүрэг:\n- Хэрэглэгчийн асуулт, гомдол шийдвэрлэх\n- CRM системд бүртгэл хөтлөх\n- Бүтээгдэхүүний талаар мэдээлэл өгөх\n- Хэрэглэгчийн сэтгэл ханамж хэмжих`,
    requirements: `- Харилцааны ур чадвар маш сайн\n- Тэвчээртэй, ойлголттой\n- Компьютер ашиглах чадвартай\n- Ажлын туршлага шаардахгүй`,
    location: "Улаанбаатар / Зайнаас", salary: "1,200,000₮", jobType: "Бүтэн цагийн", category: "Бусад",
    openness: 55, conscientiousness: 65, extraversion: 75, agreeableness: 85, neuroticism: 30,
  },
  {
    employerIdx: 6,
    title: "Захиргааны Туслах",
    description: `Оффисийн өдөр тутмын захиргааны ажлыг хариуцах туслах хайж байна.\n\nАжлын үүрэг:\n- Бичиг баримт бэлтгэх, хөтлөх\n- Уулзалт, хуваарь зохион байгуулах\n- Зочдыг хүлээн авах\n- Дотоод харилцаа холбоо`,
    requirements: `- Захиргаа, нарийн бичгийн чиглэлийн диплом давуу тал\n- MS Office (Word, Excel, PowerPoint) дадлагатай\n- Нарийвчлалтай, зохион байгуулах чадвартай`,
    location: "Улаанбаатар", salary: "1,000,000₮", jobType: "Бүтэн цагийн", category: "Бусад",
    openness: 45, conscientiousness: 80, extraversion: 60, agreeableness: 75, neuroticism: 30,
  },
  {
    employerIdx: 6,
    title: "Логистик болон Хангамжийн Менежер",
    description: `Агуулах, тэдгэрлэг, нийлүүлэлтийн сүлжээг удирдах менежер хайж байна.\n\nАжлын үүрэг:\n- Агуулахын тооллого, бүртгэл\n- Нийлүүлэгчидтэй гэрээ байгуулах\n- Тэдгэрлэгийн хуваарь зохион байгуулах\n- Зардал хэмнэх арга хэмжээ боловсруулах`,
    requirements: `- Логистик, Менежментийн диплом\n- 2+ жилийн логистикийн туршлага\n- ERP систем ашиглаж чадах\n- Зохион байгуулах, шийдвэр гаргах чадвартай`,
    location: "Улаанбаатар", salary: "2,400,000₮", jobType: "Бүтэн цагийн", category: "Бусад",
    openness: 50, conscientiousness: 80, extraversion: 55, agreeableness: 65, neuroticism: 25,
  },
];

async function main() {
  console.log("🌱 Seed эхэлж байна...");

  const password = await bcrypt.hash("password123", 10);
  const adminPasswordPlain = "Admin@2026";
  const adminPassword = await bcrypt.hash(adminPasswordPlain, 10);

  // Create employers
  const createdEmployers = [];
  for (const emp of employers) {
    const user = await prisma.user.upsert({
      where: { email: emp.email },
      update: {},
      create: {
        name: emp.name,
        email: emp.email,
        password,
        role: "EMPLOYER",
        profile: {
          create: {
            companyName: emp.company,
            industry: emp.industry,
            bio: `${emp.company} нь Монгол улсад идэвхтэй үйл ажиллагаа явуулдаг компани.`,
          },
        },
      },
      include: { profile: true },
    });
    createdEmployers.push(user);
    console.log(`  ✓ Ажил олгогч: ${emp.company}`);
  }

  // Create jobs
  let count = 0;
  for (const job of jobs) {
    const employer = createdEmployers[job.employerIdx];
    await prisma.job.create({
      data: {
        title: job.title,
        description: job.description,
        requirements: job.requirements,
        location: job.location,
        salary: job.salary,
        jobType: job.jobType,
        category: job.category,
        employerId: employer.id,
        openness: job.openness,
        conscientiousness: job.conscientiousness,
        extraversion: job.extraversion,
        agreeableness: job.agreeableness,
        neuroticism: job.neuroticism,
      },
    });
    count++;
  }

  // Sample job seeker
  await prisma.user.upsert({
    where: { email: "seeker@test.mn" },
    update: {},
    create: {
      name: "Батбаяр",
      email: "seeker@test.mn",
      password,
      role: "JOBSEEKER",
      profile: { create: { bio: "Test job seeker account" } },
    },
  });

  await prisma.user.upsert({
    where: { email: "admin@mindmatch.mn" },
    update: {
      name: "MindMatch Admin",
      role: "ADMIN",
      password: adminPassword,
    },
    create: {
      name: "MindMatch Admin",
      email: "admin@mindmatch.mn",
      password: adminPassword,
      role: "ADMIN",
      profile: { create: { bio: "System administrator account" } },
    },
  });

  console.log(`\n✅ Seed дууслаа!`);
  console.log(`   📋 ${count} ажлын байр, ${employers.length} ажил олгогч нэмэгдлээ`);
  console.log(`\n🔑 Test accounts:`);
  console.log(`   Ажил хайгч: seeker@test.mn / password123`);
  console.log(`   ADMIN: admin@mindmatch.mn / ${adminPasswordPlain}`);
  employers.forEach(e => console.log(`   ${e.industry}: ${e.email} / password123`));
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
