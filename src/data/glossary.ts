/**
 * approach[] は英語のキーワードで並んでいるので、画面では一行の日本語を添えます。
 * 「何をしたのか」を、肩書きではなく動詞で伝えるための対訳表です。
 *
 * ここは自由に書き換えてください。未登録の語はキーワードだけが表示されます。
 */
export const approachGloss: Record<string, string> = {
  /* ブランド・戦略 */
  "Brand Concept": "誰に何を約束する店なのかを決める",
  "Brand Strategy": "事業の強みを言語化し、伝える順番を決める",
  Branding: "点在する魅力を、ひとつの物語に編集する",
  "Message Design": "現場の言葉を、求職者に届く言葉へ翻訳する",
  Message: "会社が何者なのかを、短い一文に絞る",
  Strategy: "施策単位ではなく、事業全体から優先順位をつける",
  "Visual Direction": "写真・色・書体のトーンを一本に揃える",
  Copywriting: "読む順番と分量まで含めて文章を設計する",
  Communication: "部署や媒体ごとにバラけた伝え方を統一する",

  /* 店舗・商品 */
  "Store Experience": "来店から注文・飲食・撮影・共有までを設計する",
  "Store Creative": "店内の掲示物・什器まわりの見え方を整える",
  "Menu Development": "主力商品から追加商品までの構成を組み立てる",
  "Menu Communication": "売りたい商品と選ばれる商品の両面からメニューを組む",
  "Customer Journey": "来店前・来店中・来店後をひとつの体験としてつなぐ",
  Promotion: "イベントやキャンペーンで来店する理由をつくる",
  Sales: "営業の現場で使える資料とトークを整える",

  /* 地域 */
  "Local Research": "地域の店・人・食・場所を歩いて棚卸しする",
  "Experience Design": "点在する資源を、回遊できる体験へ組み替える",
  Event: "地域へ足を運ぶきっかけになる企画を立てる",

  /* 採用 */
  "Recruit Strategy": "求人媒体に頼らない採用導線を設計する",
  "Recruit LP": "仕事内容から応募まで迷わない採用専用ページをつくる",
  Recruit: "採用の入口から入社後の定着までを設計する",
  Interview: "現場社員を主役にした記事・動画を制作する",

  /* 制作 */
  Creative: "写真・動画・グラフィックを一貫したトーンで制作する",
  "Creative Production": "撮影から仕上げまで、制作を内製で回す",
  Graphic: "印刷物とデジタルで同じ表情になるよう設計する",
  Photography: "料理・空間・人を、使い回せる素材として撮る",
  Video: "仕事と人が短時間で伝わる動画をつくる",
  "Short Video": "最後まで見られる縦型動画を継続して制作する",

  /* デジタル */
  UX: "ユーザーが知りたい順番から画面を組み立てる",
  "Information Design": "情報を並べるのではなく、理解の順序で構造化する",
  "Web Design": "世界観とユーザー行動を両立させる画面をつくる",
  Web: "ブランドを最も体験しやすいデジタル接点をつくる",
  Development: "実装・計測・改善まで含めて公開する",
  Digital: "Web・SNS・広告をひとつの導線としてつなぐ",
  Conversion: "問い合わせ・応募に至るまでの離脱を減らす",

  /* SNS・広告 */
  SNS: "投稿テーマとクリエイティブを設計し、運用する",
  "SNS Strategy": "誰に何を届けるかを決めてから投稿を設計する",
  Advertising: "認知から行動までを広告で接続する",
  Advertisement: "広告で認知をつくり、応募まで運ぶ",
  "Meta Ads": "Meta広告で認知からLPまでの導線を組む",
  "Meta Advertising": "配信結果を次のクリエイティブへ反映させる",
  Marketing: "集客から再来店・再購入までを設計する",
  Analytics: "反応した理由を数値から特定する",
  Optimization: "結果をもとにクリエイティブと配信を作り直す",

  /* AI・仕組み */
  "Workflow Analysis": "既存業務を分解し、AI化できる工程を切り分ける",
  "AI Training": "自社の言い回しやルールをAIへ学習させる",
  PoC: "小さく試して、効果の出る工程を見極める",
  Automation: "入力から生成・整理・保存までを自動でつなぐ",
  Dashboard: "人が確認して改善できる管理画面をつくる",
  "System Development": "業務フローに合わせて仕組みごと開発する",
};

/** 出力物の種類。OUTPUT ページで「何をつくったか」を一語で示します。 */
export const outputTypeLabel: Record<string, string> = {
  branding: "ブランド",
  web: "Web / LP",
  sns: "SNS",
  video: "動画",
  advertising: "広告",
  store: "店舗",
  food: "商品・メニュー",
  ai: "AI / 仕組み",
  graphic: "グラフィック",
};

/** 業種の見出しに添える、領域の並び。 */
export const categoryLabel: Record<string, string> = {
  FOOD: "飲食・店舗",
  RECRUIT: "採用",
  LOCAL: "地域",
  BRANDING: "ブランド",
  WEB: "Web・デジタル",
  SNS: "SNS・広告",
  AI: "AI・業務改善",
};
