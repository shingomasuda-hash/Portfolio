# 実績画像の差し替え

このフォルダの画像は、OUTPUT ページ（SCENE 04）で 3D の制作物へそのまま貼られます。
ファイルを置くだけで差し替わります。コードの変更は不要です。

## 置き場所

`src/data/portfolioProjects.ts` の各プロジェクトの `gallery` 配列が、
そのまま読み込むパスです。

| プロジェクト | パス |
| --- | --- |
| FOOD BRANDING | `/works/food-brand/01–04.webp` |
| RESTAURANT EXPERIENCE | `/works/restaurant/01–03.webp` |
| RECRUIT COMMUNICATION | `/works/recruit-manufacturing/01–03.webp` |
| HIRING EXPERIENCE | `/works/engineering-recruit/01–02.webp` |
| LOCAL CREATION | `/works/local/01–03.webp` |
| DIGITAL EXPERIENCE | `/works/digital/01–03.webp` |
| SOCIAL & AD | `/works/social/01–03.webp` |
| BRAND IDENTITY | `/works/branding/01–02.webp` |
| AI / AUTOMATION | `/works/ai/01–03.webp` |
| BUSINESS DESIGN | `/works/business-design/01–02.webp` |

`gallery` の並び順は、そのプロジェクトの `outputs` の並び順に対応します。
1枚目が `outputs[0]`、2枚目が `outputs[1]` … という対応です。

## 画像がまだ無いとき

読み込みに失敗した場合は、番号とラベルが入った編集的なプレースホルダーが
代わりに表示されます。レイアウトは崩れません。

## どの立体物に貼られるか

`outputs[].type`（と `label`）によって、貼られる 3D オブジェクトが変わります。

| type | 立体物 |
| --- | --- |
| `web`（label に LP を含む） | 縦長スクリーン（スクロールし続けます） |
| `web`（その他） | デスクトップモニター / ノートPC（交互） |
| `sns` | スマートフォン |
| `video` | スマートフォン（再生マーク付き） |
| `store` | 壁に掛かった写真パネルと什器 |
| `food` | メニュー台 / パッケージ / 吊り看板（順番に変化） |
| `graphic` `branding` | ポスター / 本 / カード（順番に変化） |
| `advertising` | 屋外広告ボード |
| `ai` | ノートPC |

## 推奨

- 形式: `.webp`（`gallery` のパスを変えれば `.jpg` `.png` も可）
- 長辺: 1400–2000px 程度
- 縦横比: 自由。`object-fit: cover` 相当で中央を使って合わせます
- 容量: 1枚 300KB 以下を目安
