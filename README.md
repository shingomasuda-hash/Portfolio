# ANYWARE ARCHIVE

事業を編集する会社のポートフォリオ。
本棚から一冊を選ぶと、その本が机の上で開き、**その業種そのものがページの中から立ち上がります**。

10冊。10の業種。同じ表現は一つもありません。

---

## 何をつくっているか

このサイトは「制作実績を並べたギャラリー」ではありません。
1冊が1つの事業で、5つの場面を通して「何が課題で、何をして、何が変わったか」を立体で語ります。

```
SCENE 01  INTRO        その事業が置かれている場所
SCENE 02  CHALLENGE    まだ解けていなかったこと
SCENE 03  WHAT WE DID  横断して設計したこと
SCENE 04  OUTPUT       実際につくったもの（制作実績画像）
SCENE 05  RESULT       何が変わったか
```

Webページを本に貼っているのではなく、**ページごとに違う立体空間が組み上がります**。
FOOD BRANDING を開けば小さな飲食店が、LOCAL CREATION を開けば地形から街が、
AI / AUTOMATION を開けば線でつながった業務フローが、紙の中から立ち上がります。

## ページをめくるときの順番

この順番は仕様であり、必ず守られます（`src/three/Rise.tsx` と `src/state/experience.ts`）。

```
立体物が縮む
  → 折り畳まれる
    → 紙の中へ収納される
      → 完全に消える
        → ページがめくれる
          → ページが完全に止まる
            → 次の立体物が、順番に立ち上がる
```

去るときは後から立ったものが先に畳まれ、現れるときは手前から順に立ちます。
ページが動いている間、立体物は一つも存在しません。

## カメラ

プロジェクトごとに演出を変えています（`src/data/staging.ts`）。
カメラは「本のまわりの角度・高さ・距離」で定義されているので、
どの画角でも開いた見開き（3.12 × 2.12）を破綻なく収められます。

| 本 | カメラ |
| --- | --- |
| FOOD BRANDING | 店舗全体 → 俯瞰のフラットレイ → ブランドツールへ寄る |
| RESTAURANT EXPERIENCE | 客席の目線から料理へ寄り、テーブルを回遊する |
| RECRUIT COMMUNICATION | 工場全景から降り、人物と同じ高さで止まる |
| HIRING EXPERIENCE | 設備から人へ、人からデジタルへ |
| LOCAL CREATION | 真上から街へ降り、最後は路上の高さまで |
| DIGITAL EXPERIENCE | デバイス全体から画面のマクロへ押し込む |
| SOCIAL & AD | スマートフォンへ近づき、中へ入っていく |
| BRAND IDENTITY | 俯瞰のレイアウトと印刷物の細部を行き来する |
| AI / AUTOMATION | ネットワーク全体から処理の中へ入り、また引く |
| BUSINESS DESIGN | 一つの施策から引いて、経済圏全体を見せる |

## 本棚

本のサイズ・厚み・素材・色はすべて違います（`src/data/staging.ts` の `book`）。

| 本 | 素材 |
| --- | --- |
| FOOD BRANDING | 木の表紙 / 麻の背 / かがり縫い（最も厚い部類） |
| RESTAURANT EXPERIENCE | 麻クロス / 陶器色の小口 |
| RECRUIT COMMUNICATION | ヘアライン鋼板 / 紙の背 / 空押し |
| HIRING EXPERIENCE | コンクリート調 / 金属の背（最も薄い部類） |
| LOCAL CREATION | 土染めのボード / 石の背（最も厚い） |
| DIGITAL EXPERIENCE | アルマイト / ガラスの小口（最も薄い） |
| SOCIAL & AD | 非塗工紙 / スクリーン色の帯 |
| BRAND IDENTITY | 上質紙 / 箔押しクロス |
| AI / AUTOMATION | 半透明パネル / アルミ |
| BUSINESS DESIGN | 濃色クロス / 箔 / 木の背 |

素材はすべて手続き的に生成しています（`src/lib/textures.ts`）。外部のテクスチャ画像やHDRIは読み込みません。

## 企業名について

画面に企業名・店舗名・ロゴは出しません。`clientLabel`（`MANUFACTURING COMPANY` など）だけを使います。
伝えるのは「どこの会社か」ではなく、業種・課題・取り組み・成果です。

## 実績画像の差し替え

`public/works/**` に画像を置くだけで反映されます。詳細は [`public/works/README.md`](public/works/README.md)。
画像が無い間は、番号とラベルの入ったプレースホルダーが表示され、レイアウトは崩れません。

OUTPUT ページでは、画像は平らなカードではなく `outputs[].type` に応じた立体物に貼られます
（Web → PC / ノートPC、LP → 縦長スクリーン、SNS → スマートフォン、店舗 → 壁のパネル、
Graphic → ポスター / 本 / カード、Food → メニュー台 / パッケージ / 吊り看板、広告 → 屋外ボード）。

## 操作

| | |
| --- | --- |
| 背表紙をクリック | その本を棚から出して開く |
| `←` `→` / ホイール / 画面右下 | ページを送る |
| `01`–`05` | 場面を直接選ぶ |
| CASE STUDY | 詳細な背景・施策・成果 |
| SHELF / `Esc` | 本を閉じて棚に戻る |

料理・スマートフォン・照明など、いくつかの立体物はクリックに反応します。

## 動かす

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # 型チェック + 本番ビルド
npm run preview
```

Node 20.19+ / 22.12+。

## 構成

```
src/
  data/portfolioProjects.ts   実績データ（唯一の情報源・そのまま差し替え可）
  data/staging.ts             本の物性とカメラ計画
  state/experience.ts         ページめくりの状態機械
  lib/textures.ts             紙・布・木・金属・土などの手続き的素材
  lib/screens.ts              画面・印刷物のモックと実績画像の読み込み
  lib/pages.ts                ページに刷られたノンブルと柱
  three/Book.tsx              本体・背・小口・めくれるページ
  three/Rise.tsx              縮む→折り畳む→収納→立ち上がるの振付
  three/Rig.tsx               カメラ
  three/props/                立体物のライブラリ
  three/dioramas/             10冊 × 5場面の構成
  components/Overlay.tsx      画面上の文字組とCASE STUDY
```

文章はすべて `src/data/portfolioProjects.ts` から来ています。
画面には「タイトル / 短いコピー / 1〜3行 / 必要な数字」だけを出し、残りは CASE STUDY に収めています。
