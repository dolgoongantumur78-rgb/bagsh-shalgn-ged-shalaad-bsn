export interface BigFiveScores {
  openness: number;
  conscientiousness: number;
  extraversion: number;
  agreeableness: number;
  neuroticism: number;
}

export function calculateMatchScore(
  candidate: BigFiveScores,
  job: BigFiveScores
): number {
  const weights = {
    openness: 0.2,
    conscientiousness: 0.25,
    extraversion: 0.2,
    agreeableness: 0.2,
    neuroticism: 0.15,
  };

  let score = 0;
  for (const [trait, weight] of Object.entries(weights)) {
    const key = trait as keyof BigFiveScores;
    const diff = Math.abs(candidate[key] - job[key]);
    const traitScore = Math.max(0, 100 - diff);
    score += traitScore * weight;
  }

  return Math.round(score);
}

export function deriveInsights(scores: BigFiveScores): {
  workStyle: string;
  strengths: string;
  idealEnvironment: string;
} {
  const { openness, conscientiousness, extraversion, agreeableness, neuroticism } = scores;

  let workStyle = "";
  if (extraversion > 60) workStyle = "Бүлгийн гишүүн, идэвхтэй харилцааны";
  else if (extraversion < 40) workStyle = "Бие даасан, гүнзгий бодох дуртай";
  else workStyle = "Уян хатан, нөхцөл байдлаас хамаарах";

  const strengthsList: string[] = [];
  if (openness > 60) strengthsList.push("Бүтээлч сэтгэлгээ, шинийг эрэлхийлэх");
  if (conscientiousness > 60) strengthsList.push("Зохион байгуулалт сайтай, найдвартай");
  if (agreeableness > 60) strengthsList.push("Хамтын ажиллагааны сайн, эелдэг");
  if (neuroticism < 40) strengthsList.push("Тогтвортой сэтгэл хөдлөл, дарамтанд тэвчээртэй");
  if (extraversion > 60) strengthsList.push("Харилцаа холбоо сайтай, манлайлах чадвар");

  const strengths = strengthsList.length > 0 ? strengthsList.join(", ") : "Тэнцвэртэй, олон талт";

  let idealEnvironment = "";
  if (conscientiousness > 60 && neuroticism < 50) {
    idealEnvironment = "Бүтэцтэй, тодорхой зорилготой ажлын орчин";
  } else if (openness > 60 && extraversion > 50) {
    idealEnvironment = "Бүтээлч, хамтын ажиллагаатай динамик орчин";
  } else if (agreeableness > 60) {
    idealEnvironment = "Хамтрал, дэмжлэг, харилцааны орчин";
  } else {
    idealEnvironment = "Уян хатан, өөрийн хурдаар ажиллах боломжтой орчин";
  }

  return { workStyle, strengths, idealEnvironment };
}

export const BIG_FIVE_QUESTIONS = [
  { id: 1, trait: "openness", text: "Шинэ санаа, туршилтад нээлттэй байдаг уу?", reverse: false },
  { id: 2, trait: "conscientiousness", text: "Ажлаа цагт нь, төлөвлөсөн ёсоор дуусгадаг уу?", reverse: false },
  { id: 3, trait: "extraversion", text: "Бусадтай харилцах нь таны эрч хүчийг нэмдэг үү?", reverse: false },
  { id: 4, trait: "agreeableness", text: "Бусдын санаа бодлыг хэрхэн авч үздэг вэ?", reverse: false },
  { id: 5, trait: "neuroticism", text: "Дарамттай нөхцөлд хэрхэн хариу үйлдэл үзүүлдэг вэ?", reverse: true },
  { id: 6, trait: "openness", text: "Урлаг, хөгжим, уран зохиолд сонирхолтой байдаг уу?", reverse: false },
  { id: 7, trait: "conscientiousness", text: "Нарийвчилсан, дэг журмыг чухалчилдаг уу?", reverse: false },
  { id: 8, trait: "extraversion", text: "Олон нийтийн үйл явдалд оролцохыг дуртай байдаг уу?", reverse: false },
  { id: 9, trait: "agreeableness", text: "Зөрчилтэй нөхцөлд буулт хийхэд бэлэн байдаг уу?", reverse: false },
  { id: 10, trait: "neuroticism", text: "Тайван, сэтгэлийн тэнцвэртэй байдлыг хадгалдаг уу?", reverse: true },
  { id: 11, trait: "openness", text: "Өөр соёл, дэлхийн үзэл бодолд сонирхолтой байдаг уу?", reverse: false },
  { id: 12, trait: "conscientiousness", text: "Амлалтаа биелүүлдэг, хариуцлагатай байдаг уу?", reverse: false },
  { id: 13, trait: "extraversion", text: "Танихгүй хүмүүстэй хялбархан харилцаж чаддаг уу?", reverse: false },
  { id: 14, trait: "agreeableness", text: "Хүмүүст туслах нь таны хувьд чухал уу?", reverse: false },
  { id: 15, trait: "neuroticism", text: "Стресс, тревогийг хялбархан давж гардаг уу?", reverse: true },
];
