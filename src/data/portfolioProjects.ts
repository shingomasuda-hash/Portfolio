// src/data/portfolioProjects.ts

export type PortfolioProject = {
  id: string;
  title: string;
  titleJa: string;
  subtitle: string;

  category:
    | "FOOD"
    | "RECRUIT"
    | "LOCAL"
    | "BRANDING"
    | "WEB"
    | "SNS"
    | "AI";

  industry: string;
  year: string;
  clientLabel: string;

  featured?: boolean;

  description: string;
  challenge: string;

  approach: string[];

  outputs: {
    label: string;
    type:
      | "branding"
      | "web"
      | "sns"
      | "video"
      | "advertising"
      | "store"
      | "food"
      | "ai"
      | "graphic";
    description: string;
  }[];

  results: {
    value?: string;
    label: string;
    description?: string;
  }[];

  story: {
    intro: string;
    challengeCopy: string;
    approachCopy: string;
    outputCopy: string;
    resultCopy: string;
  };

  theme: {
    background: string;
    surface: string;
    accent: string;
    secondary: string;
    material: string;
    lighting: "warm" | "neutral" | "cool";
  };

  threeDMotif: {
    mainObject: string;
    supportingObjects: string[];
    environment: string;
    interaction: string[];
    camera: string;
  };

  cover: {
    eyebrow: string;
    visualDirection: string;
  };

  gallery: string[];

  tags: string[];
};

export const portfolioProjects: PortfolioProject[] = [

  // =========================================================
  // 01 FOOD BRANDING
  // =========================================================

  {
    id: "food-brand-launch",
    title: "FOOD BRANDING",
    titleJa: "飲食ブランド立ち上げ",

    subtitle:
      "一皿をつくるだけではなく、選ばれる理由そのものをつくる。",

    category: "FOOD",
    industry: "飲食 / 店舗 / ブランド開発",

    year: "2025–2026",

    clientLabel: "NARA / FOOD BRAND",

    featured: true,

    description:
      "新しい食文化を地域の日常へ浸透させることを目指し、ブランド設計から店舗体験、商品、SNS、集客までを一貫して構築した飲食ブランドプロジェクト。",

    challenge:
      "地域ではまだ馴染みの薄いジャンルの商品を、単発の話題で終わらせず、日常的に選ばれるブランドへ育てる必要があった。",

    approach: [
      "Brand Concept",
      "Store Experience",
      "Menu Development",
      "Visual Direction",
      "SNS Strategy",
      "Creative Production",
      "Customer Journey",
      "Advertising",
    ],

    outputs: [
      {
        label: "BRAND",
        type: "branding",
        description:
          "ブランドコンセプト、世界観、コピー、トーンを一貫して設計。",
      },
      {
        label: "STORE",
        type: "store",
        description:
          "来店から注文、飲食、撮影、シェアまでを含む店舗体験を設計。",
      },
      {
        label: "MENU",
        type: "food",
        description:
          "主力商品だけでなく、デザートや追加商品の見せ方まで設計。",
      },
      {
        label: "SOCIAL",
        type: "sns",
        description:
          "Instagramを中心に、料理・店舗・スタッフの魅力が伝わる発信を構築。",
      },
      {
        label: "CREATIVE",
        type: "graphic",
        description:
          "写真、メニュー、SNSクリエイティブなどブランド接点を統一。",
      },
    ],

    results: [
      {
        value: "数千人規模",
        label: "SOCIAL COMMUNITY",
        description:
          "オープン後からSNS上で継続的なコミュニティを形成。",
      },
      {
        value: "30%+",
        label: "REPEAT CUSTOMER",
        description:
          "新規集客だけに依存しない店舗運営へ。",
      },
      {
        label: "BRAND GROWTH",
        description:
          "単なる飲食店舗ではなく、地域で認知されるブランドへ成長。",
      },
    ],

    story: {
      intro:
        "まだ地域にない食文化を、日常の選択肢へ。",
      challengeCopy:
        "「知られていない」を、\n「また行きたい」に変える。",
      approachCopy:
        "商品だけではなく、\n店舗・SNS・デザイン・体験まで設計する。",
      outputCopy:
        "一つひとつの接点から、\nひとつのブランドをつくる。",
      resultCopy:
        "話題になる店から、\n地域に残るブランドへ。",
    },

    theme: {
      background: "#EDE7DC",
      surface: "#F8F5EF",
      accent: "#59684F",
      secondary: "#BE795A",
      material: "wood / paper / ceramic / linen",
      lighting: "warm",
    },

    threeDMotif: {
      mainObject: "大きな料理のボウルと店舗カウンター",
      supportingObjects: [
        "料理",
        "木製テーブル",
        "メニュー",
        "スマートフォン",
        "ショップカード",
        "テイクアウト容器",
        "観葉植物",
        "店舗サイン",
      ],
      environment:
        "ページを開くと、小さな飲食店そのものが本の中から立ち上がる。",
      interaction: [
        "料理をクリックすると湯気が立つ",
        "スマホをクリックするとSNS投稿が流れる",
        "店舗サインをクリックすると照明が点灯する",
        "メニューをクリックするとページが開く",
      ],
      camera:
        "最初は店舗全体。その後料理、SNS、ブランドツールへ順番に寄る。",
    },

    cover: {
      eyebrow: "FOOD / BRAND / EXPERIENCE",
      visualDirection:
        "料理写真をそのまま置かず、器・植物・ショップツールが紙から飛び出す編集的な表紙。",
    },

    gallery: [
      "/works/food-brand/01.webp",
      "/works/food-brand/02.webp",
      "/works/food-brand/03.webp",
      "/works/food-brand/04.webp",
    ],

    tags: [
      "Food",
      "Branding",
      "Store",
      "SNS",
      "Creative",
      "Marketing",
    ],
  },

  // =========================================================
  // 02 RESTAURANT EXPERIENCE
  // =========================================================

  {
    id: "restaurant-experience",

    title: "RESTAURANT EXPERIENCE",
    titleJa: "店舗体験・飲食マーケティング",

    subtitle:
      "料理を売るのではなく、その店を選びたくなる体験を設計する。",

    category: "FOOD",

    industry: "飲食 / 店舗マーケティング",

    year: "2026",

    clientLabel: "KANSAI / RESTAURANT",

    featured: true,

    description:
      "飲食店の売上だけでなく、来店前・来店中・来店後まで含めて顧客体験を再設計するプロジェクト。",

    challenge:
      "料理や立地に強みがあっても、その魅力がWebやSNS上で十分に伝わらず、来店理由が弱くなっていた。",

    approach: [
      "Customer Journey",
      "Menu Communication",
      "SNS",
      "Photography",
      "Store Creative",
      "Promotion",
    ],

    outputs: [
      {
        label: "MENU DESIGN",
        type: "food",
        description:
          "売りたい商品と選ばれる商品の両面からメニューを再設計。",
      },
      {
        label: "INSTAGRAM",
        type: "sns",
        description:
          "料理だけではなく店舗体験まで伝わるコンテンツ設計。",
      },
      {
        label: "PHOTO / VIDEO",
        type: "video",
        description:
          "SNS・広告・Webで横断利用できるクリエイティブを制作。",
      },
      {
        label: "PROMOTION",
        type: "advertising",
        description:
          "イベント・キャンペーンを含めて来店する理由を設計。",
      },
    ],

    results: [
      {
        label: "CUSTOMER EXPERIENCE",
        description:
          "商品・空間・SNSの印象を統一。",
      },
      {
        label: "REPEAT DESIGN",
        description:
          "新規集客だけでなく再来店を前提とした導線へ。",
      },
      {
        label: "CONTENT ASSET",
        description:
          "継続的に発信できるクリエイティブ基盤を構築。",
      },
    ],

    story: {
      intro:
        "おいしいだけでは、選ばれ続けない。",
      challengeCopy:
        "来店前から始まる、\n店舗体験をつくる。",
      approachCopy:
        "メニュー・空間・SNSを、\nひとつの体験として編集する。",
      outputCopy:
        "画面の中と、リアルな店舗を\n同じブランドにする。",
      resultCopy:
        "一回来る店から、\nまた戻りたくなる店へ。",
    },

    theme: {
      background: "#E8DED0",
      surface: "#F5EFE7",
      accent: "#8D5C46",
      secondary: "#686044",
      material: "wood / glass / ceramic",
      lighting: "warm",
    },

    threeDMotif: {
      mainObject: "小さなレストランのテーブルセット",
      supportingObjects: [
        "メニュー",
        "料理",
        "ドリンク",
        "スマートフォン",
        "カメラ",
        "レシート",
      ],
      environment:
        "温かいレストラン空間が本の中から展開される。",
      interaction: [
        "料理に触れると湯気が出る",
        "メニューカードが開く",
        "スマホで投稿が切り替わる",
        "ライトをクリックすると夜営業の雰囲気へ変化",
      ],
      camera:
        "客席目線から料理へ寄り、その後スマホ・メニュー・空間を回遊する。",
    },

    cover: {
      eyebrow: "FOOD / EXPERIENCE",
      visualDirection:
        "レストランのテーブルを俯瞰し、料理・カード・光が層状に立ち上がる。",
    },

    gallery: [
      "/works/restaurant/01.webp",
      "/works/restaurant/02.webp",
      "/works/restaurant/03.webp",
    ],

    tags: ["Restaurant", "Food", "SNS", "Experience", "Marketing"],
  },

  // =========================================================
  // 03 MANUFACTURING RECRUIT
  // =========================================================

  {
    id: "manufacturing-recruit",

    title: "RECRUIT COMMUNICATION",
    titleJa: "製造業・若手採用支援",

    subtitle:
      "会社の魅力を、求人情報ではなく“働くイメージ”として伝える。",

    category: "RECRUIT",

    industry: "製造業 / 採用",

    year: "2026",

    clientLabel: "MANUFACTURING COMPANY",

    featured: true,

    description:
      "若手採用に課題を持つ製造企業に対し、採用LP・SNS・動画・広告を横断して採用コミュニケーションを設計。",

    challenge:
      "技術力や安定性は高い一方で、若い求職者に仕事内容や職場の魅力が十分伝わっていなかった。",

    approach: [
      "Recruit Strategy",
      "Recruit LP",
      "SNS",
      "Video",
      "Meta Ads",
      "Creative",
    ],

    outputs: [
      {
        label: "RECRUIT LP",
        type: "web",
        description:
          "求職者が仕事内容・人・会社を理解できる採用専用LP。",
      },
      {
        label: "SHORT VIDEO",
        type: "video",
        description:
          "スタッフ・仕事・職場を短時間で伝える動画コンテンツ。",
      },
      {
        label: "SOCIAL CONTENT",
        type: "sns",
        description:
          "若手層との接点を継続してつくるSNS運用。",
      },
      {
        label: "ADVERTISING",
        type: "advertising",
        description:
          "認知からLPへの導線をMeta広告で構築。",
      },
    ],

    results: [
      {
        label: "RECRUITING FUNNEL",
        description:
          "求人媒体依存ではない採用導線を構築。",
      },
      {
        label: "EMPLOYER BRAND",
        description:
          "仕事内容だけではなく会社の雰囲気や人を可視化。",
      },
    ],

    story: {
      intro:
        "求人票では、会社の温度は伝わらない。",
      challengeCopy:
        "知られていない会社を、\n働いてみたい会社へ。",
      approachCopy:
        "人・仕事・文化を、\nデジタル上で再編集する。",
      outputCopy:
        "LP、動画、SNS、広告。\nすべてを一本の採用導線へ。",
      resultCopy:
        "待つ採用から、\n選ばれる採用へ。",
    },

    theme: {
      background: "#E2E1DC",
      surface: "#F5F4F0",
      accent: "#52626A",
      secondary: "#C07350",
      material: "steel / paper / concrete",
      lighting: "neutral",
    },

    threeDMotif: {
      mainObject: "小さな工場と働く人物",
      supportingObjects: [
        "機械",
        "ヘルメット",
        "PC",
        "スマートフォン",
        "採用LP",
        "動画プレイヤー",
      ],
      environment:
        "工場・人物・デジタルデバイスがひとつの立体シーンとして立ち上がる。",
      interaction: [
        "人物をクリックすると短いコメントが表示される",
        "PCをクリックすると採用LPがスクロールする",
        "スマホをクリックすると動画が再生される",
      ],
      camera:
        "工場全景から人物へ寄り、最後に採用LPとスマートフォンへ移動。",
    },

    cover: {
      eyebrow: "RECRUIT / MANUFACTURING",
      visualDirection:
        "金属的すぎず、人の温度がある工場と人物を主役にする。",
    },

    gallery: [
      "/works/recruit-manufacturing/01.webp",
      "/works/recruit-manufacturing/02.webp",
      "/works/recruit-manufacturing/03.webp",
    ],

    tags: ["Recruit", "Manufacturing", "LP", "SNS", "Video"],
  },

  // =========================================================
  // 04 ENGINEERING RECRUIT
  // =========================================================

  {
    id: "engineering-recruit",

    title: "HIRING EXPERIENCE",
    titleJa: "技術職・専門職採用",

    subtitle:
      "難しい仕事を、伝わる仕事に変える。",

    category: "RECRUIT",

    industry: "設備 / 電気 / 技術職",

    year: "2026",

    clientLabel: "TECHNICAL COMPANY",

    description:
      "専門性が高く仕事内容が伝わりにくい企業に対して、若手求職者が仕事を理解できる採用体験を構築。",

    challenge:
      "専門用語が多く、求職者が入社後の仕事やキャリアをイメージしにくかった。",

    approach: [
      "Message Design",
      "Recruit LP",
      "Interview",
      "Video",
      "SNS",
      "Advertisement",
    ],

    outputs: [
      {
        label: "STORY DESIGN",
        type: "branding",
        description:
          "難しい技術情報を、若者にも伝わる言葉へ再構成。",
      },
      {
        label: "INTERVIEW",
        type: "video",
        description:
          "現場社員を主役にしたインタビューコンテンツ。",
      },
      {
        label: "LP",
        type: "web",
        description:
          "仕事内容から応募まで迷わない情報設計。",
      },
    ],

    results: [
      {
        label: "UNDERSTANDING",
        description:
          "複雑な仕事内容を視覚的に理解できる採用コンテンツへ。",
      },
      {
        label: "RECRUIT ASSET",
        description:
          "説明会・SNS・広告でも活用できる採用資産を構築。",
      },
    ],

    story: {
      intro:
        "難しい仕事ほど、伝え方を変える。",
      challengeCopy:
        "専門性を落とさず、\nわかりやすくする。",
      approachCopy:
        "現場の言葉を拾い、\n求職者の言葉へ翻訳する。",
      outputCopy:
        "人・仕事・未来を、\nひとつのストーリーに。",
      resultCopy:
        "理解できるから、\n働く姿を想像できる。",
    },

    theme: {
      background: "#DDDCD6",
      surface: "#F2F1ED",
      accent: "#384C57",
      secondary: "#8E9B9D",
      material: "metal / concrete / paper",
      lighting: "neutral",
    },

    threeDMotif: {
      mainObject: "設備機器と若手エンジニア",
      supportingObjects: [
        "工具",
        "図面",
        "採用サイト",
        "スマートフォン",
        "社員カード",
      ],
      environment:
        "技術現場とデジタル採用コンテンツがページ上で融合する。",
      interaction: [
        "図面をクリックすると設備が組み上がる",
        "人物をクリックするとコメントが表示される",
      ],
      camera:
        "設備から人へ寄り、人物の目線からデジタルコンテンツへ。",
    },

    cover: {
      eyebrow: "ENGINEERING / RECRUIT",
      visualDirection:
        "図面・設備・人物をレイヤー状に構成した建築雑誌風。",
    },

    gallery: [
      "/works/engineering-recruit/01.webp",
      "/works/engineering-recruit/02.webp",
    ],

    tags: ["Recruit", "Engineering", "LP", "Interview"],
  },

  // =========================================================
  // 05 LOCAL
  // =========================================================

  {
    id: "local-creation",

    title: "LOCAL CREATION",
    titleJa: "地域創生・地域ブランディング",

    subtitle:
      "地域にある価値を見つけ、もう一度、人が集まる理由をつくる。",

    category: "LOCAL",

    industry: "地域創生 / まちづくり",

    year: "2025–2026",

    clientLabel: "LOCAL PROJECT",

    featured: true,

    description:
      "地域の店舗、人、食、場所、文化を再編集し、新しい経済や人の流れを生み出す地域プロジェクト。",

    challenge:
      "地域には魅力的な資源が存在している一方、それぞれが点在し、一つの体験として伝わっていなかった。",

    approach: [
      "Local Research",
      "Branding",
      "Experience Design",
      "Creative",
      "SNS",
      "Event",
    ],

    outputs: [
      {
        label: "LOCAL BRAND",
        type: "branding",
        description:
          "地域に存在する複数の魅力をひとつの物語として編集。",
      },
      {
        label: "DIGITAL",
        type: "web",
        description:
          "Web・SNSからリアルな地域体験へつながる導線設計。",
      },
      {
        label: "EVENT",
        type: "graphic",
        description:
          "地域へ足を運ぶきっかけとなるイベントや企画を設計。",
      },
    ],

    results: [
      {
        label: "LOCAL CONNECTION",
        description:
          "地域内の人・店舗・コンテンツを横断して接続。",
      },
      {
        label: "NEW EXPERIENCE",
        description:
          "地域の既存資源から新しい体験価値を創出。",
      },
    ],

    story: {
      intro:
        "何もない場所ではなく、まだ編集されていない場所。",
      challengeCopy:
        "点在する魅力を、\nひとつの体験へ。",
      approachCopy:
        "地域を観察し、\n人・食・場所をつなぐ。",
      outputCopy:
        "新しくつくるだけではなく、\n既にある価値を再発見する。",
      resultCopy:
        "地域に、新しい流れを。",
    },

    theme: {
      background: "#DDDCCB",
      surface: "#F3F0E5",
      accent: "#53694A",
      secondary: "#B7875C",
      material: "soil / stone / wood / paper",
      lighting: "warm",
    },

    threeDMotif: {
      mainObject: "小さな街全体",
      supportingObjects: [
        "住宅",
        "店舗",
        "木",
        "道路",
        "人",
        "マーケット",
        "看板",
      ],
      environment:
        "ページを開くと地形から街が少しずつ立ち上がる。",
      interaction: [
        "建物をクリックすると照明が灯る",
        "人物をクリックすると移動し始める",
        "道路をなぞると人の流れを光で表示する",
      ],
      camera:
        "俯瞰視点から街へ降り、その後人と店舗の高さまで近づく。",
    },

    cover: {
      eyebrow: "LOCAL / CULTURE / ECONOMY",
      visualDirection:
        "地形図と街並みが紙の断面から立ち上がるアートブック。",
    },

    gallery: [
      "/works/local/01.webp",
      "/works/local/02.webp",
      "/works/local/03.webp",
    ],

    tags: ["Local", "Branding", "Community", "Experience"],
  },

  // =========================================================
  // 06 DIGITAL EXPERIENCE
  // =========================================================

  {
    id: "digital-experience",

    title: "DIGITAL EXPERIENCE",
    titleJa: "Web・LP制作",

    subtitle:
      "情報を載せるWebから、行動を生み出す体験へ。",

    category: "WEB",

    industry: "Web / LP / Digital",

    year: "2026",

    clientLabel: "VARIOUS INDUSTRIES",

    description:
      "企業サイト・採用LP・キャンペーンLPなど、目的から逆算したデジタル体験の設計。",

    challenge:
      "情報は存在するものの、ユーザーが何を理解し、次に何をすればよいのかが曖昧になっていた。",

    approach: [
      "UX",
      "Information Design",
      "Web Design",
      "Copywriting",
      "Development",
      "Conversion",
    ],

    outputs: [
      {
        label: "WEB DESIGN",
        type: "web",
        description:
          "企業の世界観とユーザー行動を両立したWebデザイン。",
      },
      {
        label: "LP",
        type: "web",
        description:
          "採用・集客・イベントなど目的別のLP制作。",
      },
      {
        label: "COPY",
        type: "branding",
        description:
          "ユーザーが短時間で理解できる情報構造とコピー。",
      },
    ],

    results: [
      {
        label: "USER JOURNEY",
        description:
          "情報を並べるサイトから、目的へ導くサイトへ。",
      },
      {
        label: "DIGITAL ASSET",
        description:
          "広告や営業活動と接続できるデジタル基盤を構築。",
      },
    ],

    story: {
      intro:
        "Webは、情報ではなく体験でつくる。",
      challengeCopy:
        "伝えたいことではなく、\n知りたい順番でつくる。",
      approachCopy:
        "設計・コピー・デザインを\nひとつの体験にする。",
      outputCopy:
        "スクロールするたび、\n理解が深まるWebへ。",
      resultCopy:
        "見るサイトから、\n動くサイトへ。",
    },

    theme: {
      background: "#E5E5E0",
      surface: "#F5F5F1",
      accent: "#222828",
      secondary: "#58746F",
      material: "paper / aluminum / glass",
      lighting: "neutral",
    },

    threeDMotif: {
      mainObject: "デスクトップモニターとスマートフォン",
      supportingObjects: [
        "ブラウザ",
        "縦長LP",
        "UIパーツ",
        "カーソル",
        "CTA",
      ],
      environment:
        "紙のページ上に複数デバイスが立ち上がり、実際のWeb画面を表示。",
      interaction: [
        "PC画面をドラッグするとスクロール",
        "スマホをタップすると別画面へ切り替わる",
      ],
      camera:
        "デバイス全体からUI細部へ寄るマクロ的カメラ。",
    },

    cover: {
      eyebrow: "WEB / UX / DEVELOPMENT",
      visualDirection:
        "PCやスマートフォンを真正面に並べず、紙・画面・タイポグラフィを編集的に配置。",
    },

    gallery: [
      "/works/digital/01.webp",
      "/works/digital/02.webp",
      "/works/digital/03.webp",
    ],

    tags: ["Web", "LP", "UX", "Development"],
  },

  // =========================================================
  // 07 SNS / ADS
  // =========================================================

  {
    id: "social-advertising",

    title: "SOCIAL & AD",
    titleJa: "SNS・広告クリエイティブ",

    subtitle:
      "投稿を増やすのではなく、反応が生まれる仕組みをつくる。",

    category: "SNS",

    industry: "SNS / Digital Advertising",

    year: "2025–2026",

    clientLabel: "MULTIPLE BRANDS",

    description:
      "SNS投稿、短尺動画、Meta広告を組み合わせ、認知から行動までを設計するデジタルマーケティング支援。",

    challenge:
      "継続的に投稿していても、事業成果につながるコンテンツ設計や改善サイクルが不足していた。",

    approach: [
      "SNS Strategy",
      "Creative",
      "Short Video",
      "Meta Advertising",
      "Analytics",
      "Optimization",
    ],

    outputs: [
      {
        label: "SOCIAL",
        type: "sns",
        description:
          "ブランドごとに投稿テーマとクリエイティブを設計。",
      },
      {
        label: "VIDEO",
        type: "video",
        description:
          "短尺で伝わる縦型動画を継続制作。",
      },
      {
        label: "ADS",
        type: "advertising",
        description:
          "クリエイティブと広告運用を分断せず改善。",
      },
    ],

    results: [
      {
        label: "CONTINUOUS OPTIMIZATION",
        description:
          "投稿・広告結果を次のクリエイティブへ反映する運用体制。",
      },
      {
        label: "MULTI CHANNEL",
        description:
          "SNSと広告を横断して認知から行動までを接続。",
      },
    ],

    story: {
      intro:
        "投稿することが、目的ではない。",
      challengeCopy:
        "反応の理由を見つけ、\n次の投稿へつなげる。",
      approachCopy:
        "企画、制作、広告、分析。\nすべてを同じループに。",
      outputCopy:
        "スマートフォンの中に、\nブランドとの接点をつくる。",
      resultCopy:
        "発信から、成果へ。",
    },

    theme: {
      background: "#E6E1D8",
      surface: "#F4F1EB",
      accent: "#333535",
      secondary: "#CC7655",
      material: "paper / screen / glass",
      lighting: "neutral",
    },

    threeDMotif: {
      mainObject: "巨大なスマートフォン",
      supportingObjects: [
        "SNS投稿",
        "動画",
        "コメント",
        "広告",
        "グラフ",
      ],
      environment:
        "複数の投稿がスマホから紙のカードのように立ち上がる。",
      interaction: [
        "スワイプすると投稿が切り替わる",
        "動画をクリックすると再生",
        "グラフをクリックするとデータが変化",
      ],
      camera:
        "スマホ画面へ近づき、その中に入るような視点移動。",
    },

    cover: {
      eyebrow: "SOCIAL / CREATIVE / AD",
      visualDirection:
        "投稿画面を大量に並べず、一台のスマートフォンからコンテンツが溢れる構図。",
    },

    gallery: [
      "/works/social/01.webp",
      "/works/social/02.webp",
      "/works/social/03.webp",
    ],

    tags: ["SNS", "Ads", "Creative", "Video"],
  },

  // =========================================================
  // 08 BRANDING
  // =========================================================

  {
    id: "brand-identity",

    title: "BRAND IDENTITY",
    titleJa: "ブランド・コミュニケーション設計",

    subtitle:
      "会社の中にある価値を、外から見える形へ。",

    category: "BRANDING",

    industry: "企業 / ブランド",

    year: "2026",

    clientLabel: "CORPORATE BRAND",

    description:
      "企業の強みや文化を整理し、Web・採用・営業・SNSで一貫して伝えられるブランドコミュニケーションを構築。",

    challenge:
      "会社としての強みは存在しているものの、部署や媒体ごとに伝え方が異なっていた。",

    approach: [
      "Brand Strategy",
      "Message",
      "Visual Direction",
      "Web",
      "Graphic",
      "Communication",
    ],

    outputs: [
      {
        label: "MESSAGE",
        type: "branding",
        description:
          "会社が何者なのかを短い言葉に整理。",
      },
      {
        label: "VISUAL",
        type: "graphic",
        description:
          "Web・SNS・営業資料を横断できるビジュアル方向性。",
      },
      {
        label: "DIGITAL",
        type: "web",
        description:
          "ブランドを最も体験しやすいデジタル接点を構築。",
      },
    ],

    results: [
      {
        label: "ONE BRAND",
        description:
          "採用・営業・広報で共通して使えるブランド基盤を構築。",
      },
    ],

    story: {
      intro:
        "伝える前に、自分たちを理解する。",
      challengeCopy:
        "バラバラな言葉を、\nひとつのブランドへ。",
      approachCopy:
        "言葉、デザイン、体験を\n同じ方向へ揃える。",
      outputCopy:
        "見た目だけではなく、\n判断基準になるブランドを。",
      resultCopy:
        "一貫性が、信頼をつくる。",
    },

    theme: {
      background: "#E9E6DF",
      surface: "#F8F6F1",
      accent: "#202424",
      secondary: "#8A6B4D",
      material: "paper / fabric / print",
      lighting: "neutral",
    },

    threeDMotif: {
      mainObject: "ブランドブック",
      supportingObjects: [
        "名刺",
        "ポスター",
        "Web画面",
        "タイポグラフィ",
        "封筒",
      ],
      environment:
        "ブランドツールが紙面から編集物として立ち上がる。",
      interaction: [
        "ブランドブックを開ける",
        "カードをクリックすると別デザインへ変化",
      ],
      camera:
        "印刷物の細部と全体レイアウトを行き来する。",
    },

    cover: {
      eyebrow: "BRAND / IDENTITY",
      visualDirection:
        "上質なデザイン年鑑のようなタイポグラフィ中心の表紙。",
    },

    gallery: [
      "/works/branding/01.webp",
      "/works/branding/02.webp",
    ],

    tags: ["Branding", "Identity", "Web", "Communication"],
  },

  // =========================================================
  // 09 AI
  // =========================================================

  {
    id: "ai-automation",

    title: "AI / AUTOMATION",
    titleJa: "AI・業務自動化",

    subtitle:
      "人がやらなくていい仕事を、仕組みに変える。",

    category: "AI",

    industry: "AI / DX / 業務改善",

    year: "2026",

    clientLabel: "B2B COMPANY",

    featured: true,

    description:
      "生成AIと既存業務を接続し、営業・情報整理・制作・管理などの業務を効率化するAI活用プロジェクト。",

    challenge:
      "AIを導入したいという意向はあるものの、具体的にどの業務へ組み込めば効果が出るか整理されていなかった。",

    approach: [
      "Workflow Analysis",
      "AI Training",
      "PoC",
      "Automation",
      "Dashboard",
      "System Development",
    ],

    outputs: [
      {
        label: "WORKFLOW",
        type: "ai",
        description:
          "既存業務を分解し、AI化できる工程を整理。",
      },
      {
        label: "AUTOMATION",
        type: "ai",
        description:
          "入力から生成、整理、保存までを自動化。",
      },
      {
        label: "DASHBOARD",
        type: "web",
        description:
          "人が確認・改善できる管理画面を構築。",
      },
    ],

    results: [
      {
        label: "LESS MANUAL WORK",
        description:
          "繰り返し業務を自動処理へ移行。",
      },
      {
        label: "AI IN WORKFLOW",
        description:
          "AIを単体ツールではなく業務フローの一部へ組み込む。",
      },
    ],

    story: {
      intro:
        "AIを使うのではなく、仕事の中に組み込む。",
      challengeCopy:
        "便利なツールで終わらせず、\n業務そのものを変える。",
      approachCopy:
        "人が判断する仕事と、\nAIに任せる仕事を分ける。",
      outputCopy:
        "データ、AI、人を\nひとつのフローにつなぐ。",
      resultCopy:
        "作業を減らし、\n考える時間を増やす。",
    },

    theme: {
      background: "#DCDDD9",
      surface: "#F0F2EE",
      accent: "#263538",
      secondary: "#75978E",
      material: "glass / aluminum / paper",
      lighting: "cool",
    },

    threeDMotif: {
      mainObject: "中央に浮かぶAIコア",
      supportingObjects: [
        "データノード",
        "PC",
        "ダッシュボード",
        "メール",
        "データベース",
        "ワークフロー",
      ],
      environment:
        "複数の業務オブジェクトが線でつながり、自動的にデータが流れる。",
      interaction: [
        "ノードをクリックすると別ノードへデータが流れる",
        "PCをクリックするとダッシュボードが開く",
        "自動化ボタンで一連の処理が動く",
      ],
      camera:
        "ネットワーク全体から一つの処理へ寄り、再び全体へ戻る。",
    },

    cover: {
      eyebrow: "AI / WORKFLOW / AUTOMATION",
      visualDirection:
        "ネオンSFではなく、紙・金属・透明素材を使った落ち着いた未来感。",
    },

    gallery: [
      "/works/ai/01.webp",
      "/works/ai/02.webp",
      "/works/ai/03.webp",
    ],

    tags: ["AI", "Automation", "DX", "System"],
  },

  // =========================================================
  // 10 BUSINESS / CROSS FIELD
  // =========================================================

  {
    id: "business-design",

    title: "BUSINESS DESIGN",
    titleJa: "事業づくり・マーケティング支援",

    subtitle:
      "施策をつくるだけではなく、事業が動くところまで。",

    category: "BRANDING",

    industry: "事業開発 / マーケティング",

    year: "2025–2026",

    clientLabel: "GROWTH PROJECT",

    description:
      "Web、SNS、採用、営業、商品、店舗など複数領域を横断して、事業成長のボトルネックを解決する支援。",

    challenge:
      "それぞれの施策は実施されているものの、事業全体としての連動性が不足していた。",

    approach: [
      "Strategy",
      "Marketing",
      "Creative",
      "Sales",
      "Recruit",
      "Digital",
    ],

    outputs: [
      {
        label: "STRATEGY",
        type: "branding",
        description:
          "施策単位ではなく事業全体から優先順位を設計。",
      },
      {
        label: "EXECUTION",
        type: "web",
        description:
          "Web・SNS・広告・営業まで実行フェーズを支援。",
      },
      {
        label: "IMPROVEMENT",
        type: "advertising",
        description:
          "実施後の結果をもとに改善を継続。",
      },
    ],

    results: [
      {
        label: "ONE TEAM",
        description:
          "戦略・制作・運用を分断せず一つのチームとして支援。",
      },
      {
        label: "BUSINESS GROWTH",
        description:
          "クリエイティブを事業成果へ接続。",
      },
    ],

    story: {
      intro:
        "制作物ではなく、事業をつくる。",
      challengeCopy:
        "施策の点を、\n成長の線へ。",
      approachCopy:
        "マーケ、採用、営業、Web。\n必要なものを横断する。",
      outputCopy:
        "つくって終わらず、\n動かし、改善する。",
      resultCopy:
        "事業に、うねりを。",
    },

    theme: {
      background: "#E7E4DD",
      surface: "#F6F4EF",
      accent: "#2D3331",
      secondary: "#6B806B",
      material: "paper / wood / metal",
      lighting: "neutral",
    },

    threeDMotif: {
      mainObject: "複数の事業領域が存在する小さな都市",
      supportingObjects: [
        "店舗",
        "PC",
        "人物",
        "広告",
        "スマートフォン",
        "商品",
        "グラフ",
      ],
      environment:
        "異なる事業オブジェクトが道路や線で接続された小さな経済圏。",
      interaction: [
        "各領域をクリックすると関連する施策が点灯する",
        "中央をクリックするとすべてが接続される",
      ],
      camera:
        "個別施策から徐々に引き、最後に全体が一つにつながっていることを見せる。",
    },

    cover: {
      eyebrow: "BUSINESS / CREATIVE / GROWTH",
      visualDirection:
        "AnyWare全体の考え方を象徴する、複数の世界が接続された表紙。",
    },

    gallery: [
      "/works/business-design/01.webp",
      "/works/business-design/02.webp",
    ],

    tags: ["Business", "Marketing", "Creative", "Strategy"],
  },
];

export default portfolioProjects;
