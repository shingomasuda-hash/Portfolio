/**
 * 実績の「どの業界で／どういった会社が／どんな数字を出したか」。
 *
 * ここが実績ページの中身です。数字を足すと、
 *   ・RESULT ページの左段
 *   ・本棚の目次（右列）
 *   ・WORKS 一覧（上部の WORKS ボタン）
 *   ・RESULT ページの紙面に刷られる大きな数字
 * の全部に自動で反映されます。書く場所はこのファイルだけです。
 *
 * ------------------------------------------------------------------
 * figures が空の案件は、数字が出ません（変化だけが表示されます）。
 * 数字は実際の取引先の成果なので、こちらでは作りません。
 * 分かっているものから順に埋めてください。書き方は food-brand-launch を参照。
 * ------------------------------------------------------------------
 */

export type Figure = {
  /** 出す数字そのもの。例: "132%" "3.2倍" "月120時間" */
  value: string;
  /** 何の数字か。短く。例: "リピート率" "月間応募数" */
  label: string;
  /** いつ時点か。例: "オープン12ヶ月" "運用6ヶ月" */
  period?: string;
  /** 何と比べた数字か。例: "前年同月比" "支援前比" */
  basis?: string;
  /** 補足があれば一行 */
  note?: string;
};

export type Outcome = {
  /** 業界。一覧で並べるので短く */
  sector: string;
  /** エリア。分かる場合だけ */
  area?: string;
  /** 事業規模。例: "路面店1店舗" "従業員50名" — 分かる場合だけ */
  scale?: string;
  /** どういった会社か。description / challenge を一行に要約したもの */
  profile: string;
  /** 数字。空でも動きます */
  figures: Figure[];
};

export const outcomes: Record<string, Outcome> = {
  "food-brand-launch": {
    sector: "飲食",
    area: "奈良",
    scale: "新規開業 / 路面店",
    profile: "地域にまだ馴染みの薄いジャンルで、ゼロからブランドを立ち上げる飲食事業。",
    figures: [
      {
        value: "数千人規模",
        label: "SNSコミュニティ",
        period: "オープン後",
        note: "SNS上で継続的に反応が続く母集団を形成。",
      },
      {
        value: "30%+",
        label: "リピート率",
        note: "新規集客だけに依存しない店舗運営へ。",
      },
      // 例：他にも数字があればこの形で足してください
      // { value: "1.8倍", label: "月商", period: "開業6ヶ月", basis: "開業初月比" },
    ],
  },

  "restaurant-experience": {
    sector: "飲食",
    area: "関西",
    profile: "料理と立地に強みがある一方、Web・SNS上で魅力が伝わっていない飲食店。",
    figures: [
      // TODO 例: { value: "◯%", label: "再来店率", period: "施策後6ヶ月", basis: "施策前比" }
    ],
  },

  "manufacturing-recruit": {
    sector: "製造業",
    profile: "技術力と安定性は高いが、若手求職者に仕事と職場の魅力が伝わっていない製造企業。",
    figures: [
      // TODO 例: { value: "◯件", label: "月間応募数", period: "運用◯ヶ月" }
      // TODO 例: { value: "◯%", label: "自社経由の応募比率", basis: "求人媒体経由との比較" }
    ],
  },

  "engineering-recruit": {
    sector: "設備 / 電気工事",
    profile: "専門用語が多く、入社後の仕事やキャリアを求職者がイメージしにくい技術系企業。",
    figures: [
      // TODO
    ],
  },

  "local-creation": {
    sector: "地域創生",
    profile: "魅力的な資源が点在しているが、ひとつの体験としてつながっていない地域。",
    figures: [
      // TODO 例: { value: "◯名", label: "来場者数", period: "イベント2日間" }
    ],
  },

  "digital-experience": {
    sector: "Web / デジタル",
    profile: "情報は揃っているが、ユーザーが次に何をすればよいか曖昧なサイト・LP。",
    figures: [
      // TODO 例: { value: "◯%", label: "CVR", basis: "リニューアル前比" }
    ],
  },

  "social-advertising": {
    sector: "SNS / 広告",
    profile: "継続的に投稿しているが、成果につながる設計と改善サイクルが無い複数ブランド。",
    figures: [
      // TODO 例: { value: "◯%", label: "CPA改善", period: "運用3ヶ月" }
    ],
  },

  "brand-identity": {
    sector: "企業ブランディング",
    profile: "強みはあるが、部署や媒体ごとに伝え方が異なってしまっている企業。",
    figures: [
      // TODO
    ],
  },

  "ai-automation": {
    sector: "AI / 業務改善",
    profile: "AI導入の意向はあるが、どの業務に組み込めば効果が出るか整理できていないBtoB企業。",
    figures: [
      // TODO 例: { value: "月◯時間", label: "削減工数", basis: "導入前比" }
    ],
  },

  "business-design": {
    sector: "事業開発",
    profile: "個々の施策は動いているが、事業全体として連動していない成長フェーズの企業。",
    figures: [
      // TODO 例: { value: "◯%", label: "売上成長", period: "支援12ヶ月", basis: "前年比" }
    ],
  },
};

export const outcomeOf = (id: string): Outcome | undefined => outcomes[id];

/** 一覧や紙面に出す代表の数字。無ければ undefined。 */
export const headlineFigure = (id: string): Figure | undefined => outcomes[id]?.figures[0];

/** 数字が入っている案件の数。 */
export const figuredCount = () =>
  Object.values(outcomes).filter((o) => o.figures.length > 0).length;
