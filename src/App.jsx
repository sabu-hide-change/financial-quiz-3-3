// npm install lucide-react recharts

import React, { useState, useEffect, useMemo } from 'react';
import { 
  Check, 
  X, 
  Home, 
  RotateCcw, 
  BookOpen, 
  Flag, 
  ChevronRight, 
  BarChart2, 
  Play
} from 'lucide-react';

/* ------------------------------------------------------------------
   データ定義 (問題集コンテンツ)
   ------------------------------------------------------------------ */
const QUESTION_DATA = [
  {
    id: 1,
    category: "生産計画",
    question: "生産計画に関する記述として、最も適切なものはどれか。",
    options: [
      "生産計画の役割として、納期や生産量の保証、製品品質の保証、設備稼働率の維持などがある。",
      "負荷計画では、生産能力と手持ち材料を比較し、過不足がある場合に調整を図る。",
      "生産計画を業務で分類すると、手順計画、工程設計、負荷計画、日程計画に分類できる。",
      "手順計画では、設計情報を基に、加工手順、使用設備、標準作業時間などを検討する。"
    ],
    answer: 3, // index 3 = エ
    explanation: (
      <div className="space-y-4">
        <p><strong>正解：エ</strong></p>
        <div className="bg-blue-50 p-3 rounded border border-blue-200 text-sm">
          <p className="font-bold mb-2">【ここが重要】</p>
          <ul className="list-disc pl-4 space-y-1">
            <li>生産計画は製品の生産量と生産時期を決定する活動。</li>
            <li>業務別の分類：①手順計画（工程設計）、②工数計画（負荷計画）、③日程計画。</li>
            <li>期間別の分類：大日程（年）、中日程（月）、小日程（週・日）。</li>
          </ul>
        </div>
        <div className="text-sm space-y-2">
          <p><strong>ア ×：</strong>品質保証は生産計画の直接的な目的（効率化、納期保証、稼働率維持）には含まれません。</p>
          <p><strong>イ ×：</strong>負荷計画（工数計画）で比較するのは「生産能力」と「必要工数」です。手持ち材料ではありません。</p>
          <p><strong>ウ ×：</strong>手順計画の別名が工程設計です。分類としては「手順計画（工程設計）」「工数計画（負荷計画）」「日程計画」の3つです。</p>
          <p><strong>エ ○：</strong>記述の通りです。手順計画では、製品の効率的な作り方（手順、設備、標準時間）を決定します。</p>
        </div>
      </div>
    )
  },
  {
    id: 2,
    category: "スケジューリング",
    question: "スケジューリングに関する記述として、最も不適切なものはどれか。",
    options: [
      "フォワードスケジューリングとは、作業の開始時点から、順番に予定を組んでいく方法である。",
      "ジョブショップスケジューリングは、同じ専用ラインを使用して複数の製品を大量生産するのに適した方法である。",
      "バックワードスケジューリングは、予め決められた納期を守るために、作業開始日を決める方法である。",
      "プロジェクトスケジューリングでは、必要な作業を全て抽出し、それぞれの作業の開始日と完了日が分かるようにする。"
    ],
    answer: 1, // index 1 = イ
    explanation: (
      <div className="space-y-4">
        <p><strong>正解：イ</strong></p>
        <div className="bg-blue-50 p-3 rounded border border-blue-200 text-sm">
          <p className="font-bold mb-2">【スケジューリングの分類】</p>
          <ul className="list-disc pl-4 space-y-1">
            <li><strong>フォワード：</strong>開始日基準。納期は後から決まる。</li>
            <li><strong>バックワード：</strong>納期基準。納期を守るための開始日を決める。</li>
            <li><strong>ジョブショップ：</strong>多品種少量生産（機能別レイアウト）向け。順序最適化。</li>
            <li><strong>フローショップ：</strong>少種多量生産（製品別レイアウト）向け。</li>
          </ul>
        </div>
        <div className="text-sm space-y-2">
          <p><strong>ア ○：</strong>フォワードスケジューリングの正しい定義です。</p>
          <p><strong>イ ×：</strong>記述は「フローショップスケジューリング」の説明です。ジョブショップは多品種少量生産に適しています。</p>
          <p><strong>ウ ○：</strong>バックワードスケジューリングの正しい定義です。</p>
          <p><strong>エ ○：</strong>プロジェクトスケジューリング（PERT等）の正しい定義です。</p>
        </div>
      </div>
    )
  },
  {
    id: 3,
    category: "PERT1",
    question: "来月から開始するプロジェクトのスケジューリングをPERTで行った。以下の図について、最も適切な記述はどれか。",
    diagramType: "pert1",
    options: [
      "ノード7の最早着手日は、16日である。",
      "クリティカルパスは、作業B→F→G→Jの経路である。",
      "ノード6の最遅着手日は、20日である。",
      "ノード3の最早着手日は4日、最遅着手日6日である。"
    ],
    answer: 3, // index 3 = エ
    explanation: (
      <div className="space-y-4">
        <p><strong>正解：エ</strong></p>
        <div className="text-sm space-y-2">
          <p><strong>解説：</strong></p>
          <p>各経路の所要日数を計算します。</p>
          <ul className="list-disc pl-4">
            <li>経路1 (A→D→H): 8+6+12 = 26日 (最大長＝クリティカルパス)</li>
            <li>経路2 (B→E→H): 4+8+12 = 24日</li>
            <li>経路3 (B→F→I): 4+9+3 = 16日</li>
            <li>経路4 (C→G→I): 5+7+3 = 15日</li>
            <li>経路5 (C→J): 5+3 = 8日</li>
            {/* Note: Diagram interpretation based on provided image in prompt */}
          </ul>
          <hr className="my-2"/>
          <p><strong>ア ×：</strong>ノード7（結合点）への最長経路は26日なので、最早着手日は26日です。</p>
          <p><strong>イ ×：</strong>クリティカルパスは最長経路である A→D→H です。</p>
          <p><strong>ウ ×：</strong>ノード7の最遅(26) - J(3) = 23日。または ノード5の最遅 - G(7) で計算。正しくは23日です。</p>
          <p><strong>エ ○：</strong>
             ノード3の最早：B(4)のみ流入 → <strong>4日</strong>。<br/>
             ノード3の最遅：クリティカルパス上のノード4の最遅(14) - E(8) = <strong>6日</strong>。<br/>
             (※ノード4の最遅 = ノード7(26) - H(12) = 14日)
          </p>
        </div>
      </div>
    )
  },
  {
    id: 4,
    category: "PERT2",
    question: "下表の作業A～Hで構成されるプロジェクトにおいて、PERTを用いる。空欄Ｘ、Ｙに入る数値、及びクリティカルパスの組み合わせとして適切なものはどれか。",
    table: (
      <table className="w-full text-xs text-left border-collapse border border-gray-300 mb-4">
        <thead>
          <tr className="bg-gray-100">
            <th className="border p-1">作業</th><th className="border p-1">日数</th><th className="border p-1">先行作業</th>
          </tr>
        </thead>
        <tbody>
          <tr><td className="border p-1">A</td><td className="border p-1">20</td><td className="border p-1">なし</td></tr>
          <tr><td className="border p-1">B</td><td className="border p-1">25</td><td className="border p-1">A</td></tr>
          <tr><td className="border p-1">C</td><td className="border p-1">15</td><td className="border p-1">A</td></tr>
          <tr><td className="border p-1">D</td><td className="border p-1">30</td><td className="border p-1">A</td></tr>
          <tr><td className="border p-1">E</td><td className="border p-1">20</td><td className="border p-1">B</td></tr>
          <tr><td className="border p-1">F</td><td className="border p-1">25</td><td className="border p-1">C</td></tr>
          <tr><td className="border p-1">G</td><td className="border p-1">20</td><td className="border p-1">B, C, D</td></tr>
          <tr><td className="border p-1">H</td><td className="border p-1">10</td><td className="border p-1">E, F, G</td></tr>
        </tbody>
      </table>
    ),
    diagramType: "pert2",
    options: [
      "Ｘ：50　　Ｙ：45　　クリティカルパス：A - D - G - H",
      "Ｘ：45　　Ｙ：40　　クリティカルパス：A - B - E - H",
      "Ｘ：50　　Ｙ：45　　クリティカルパス：A - C - F - H",
      "Ｘ：45　　Ｙ：40　　クリティカルパス：A - D - G - H"
    ],
    answer: 0, // index 0 = ア
    explanation: (
      <div className="space-y-4">
        <p><strong>正解：ア</strong></p>
        <div className="text-sm space-y-2">
          <p><strong>最早着手日の計算(フォワード):</strong></p>
          <ul className="list-disc pl-4">
            <li>Start(0) → A(20) → Node1(20)</li>
            <li>Node1 → D(30) → Node4(50) [B(25)経由、C(15)経由よりDが大きい]</li>
            <li>Node4 → G(20) → Node5(70) [E(20)経由、F(25)経由と比較]</li>
            <li>Node5 → H(10) → End(80)</li>
          </ul>
          <p><strong>最遅着手日の計算(バックワード):</strong></p>
          <ul className="list-disc pl-4">
            <li>End(80) - H(10) = Node5(70)</li>
            <li><strong>X (Node2の最遅):</strong> Node5(70)からE(20)を戻るのではなく、ダミー(0)を通ってNode4へ行くルートも考慮。
              <br/>Node4の最遅 = Node5(70) - G(20) = 50。
              <br/>Node2からはE(20)でNode5へ、またはダミーでNode4へ。
              <br/>Eルート: 70-20=50。ダミールート: 50-0=50。よって <strong>X=50</strong>。
            </li>
            <li><strong>Y (Node3の最遅):</strong> Node5(70)からF(25)を戻るルート、またはダミーでNode4へ行くルート。
              <br/>Fルート: 70-25=45。ダミールート: Node4(50)-0=50。
              <br/>小さい方を取るので <strong>Y=45</strong>。
            </li>
          </ul>
          <p><strong>クリティカルパス:</strong> 最早=最遅の経路。A(20)→D(30)→G(20)→H(10) = 80日。</p>
        </div>
      </div>
    )
  },
  {
    id: 5,
    category: "PERT3",
    question: "以下の作業工程の最短完了日数はどれか。",
    table: (
      <table className="w-full text-xs text-left border-collapse border border-gray-300 mb-4">
        <thead>
          <tr className="bg-gray-100"><th className="border p-1">作業</th><th className="border p-1">日数</th><th className="border p-1">先行</th></tr>
        </thead>
        <tbody>
          <tr><td className="border p-1">A</td><td className="border p-1">5</td><td className="border p-1">なし</td></tr>
          <tr><td className="border p-1">B</td><td className="border p-1">2</td><td className="border p-1">A</td></tr>
          <tr><td className="border p-1">C</td><td className="border p-1">4</td><td className="border p-1">A</td></tr>
          <tr><td className="border p-1">D</td><td className="border p-1">2</td><td className="border p-1">C</td></tr>
          <tr><td className="border p-1">E</td><td className="border p-1">3</td><td className="border p-1">B, D</td></tr>
        </tbody>
      </table>
    ),
    options: ["9", "11", "14", "16"],
    answer: 2, // index 2 = ウ
    explanation: (
      <div className="space-y-4">
        <p><strong>正解：ウ (14日)</strong></p>
        <div className="text-sm space-y-2">
          <p>経路を列挙して最長を探します。</p>
          <ul className="list-disc pl-4">
            <li>経路1: A(5) → B(2) → E(3) = 10日</li>
            <li>経路2: A(5) → C(4) → D(2) → E(3) = <strong>14日</strong></li>
          </ul>
          <p>最長経路がプロジェクトの最短完了日数となります。</p>
        </div>
      </div>
    )
  },
  {
    id: 6,
    category: "CPM (Crashing)",
    question: "CPMを適用して、最短プロジェクト遂行期間となる条件を達成したときの最小費用を選べ。",
    table: (
      <table className="w-full text-xs text-left border-collapse border border-gray-300 mb-4">
        <thead>
          <tr className="bg-gray-100">
            <th className="border p-1">作業</th><th className="border p-1">先行</th><th className="border p-1">所要(日)</th><th className="border p-1">最短(日)</th><th className="border p-1">短縮費(万)</th>
          </tr>
        </thead>
        <tbody>
          <tr><td className="border p-1">A</td><td className="border p-1">-</td><td className="border p-1">6</td><td className="border p-1">6</td><td className="border p-1">-</td></tr>
          <tr><td className="border p-1">B</td><td className="border p-1">A</td><td className="border p-1">4</td><td className="border p-1">3</td><td className="border p-1">10</td></tr>
          <tr><td className="border p-1">C</td><td className="border p-1">A</td><td className="border p-1">5</td><td className="border p-1">2</td><td className="border p-1">30</td></tr>
          <tr><td className="border p-1">D</td><td className="border p-1">B, C</td><td className="border p-1">6</td><td className="border p-1">3</td><td className="border p-1">50</td></tr>
        </tbody>
      </table>
    ),
    options: ["220万円", "240万円", "250万円", "280万円"],
    answer: 0, // index 0 = ア
    explanation: (
      <div className="space-y-4">
        <p><strong>正解：ア (220万円)</strong></p>
        <div className="text-sm space-y-2">
          <p><strong>1. 全作業を最短期間にした場合の日数計算:</strong></p>
          <p>A(6) → B(3) → D(3) = 12日<br/>A(6) → C(2) → D(3) = 11日<br/>クリティカルパスは A-B-D で 12日。</p>
          
          <p><strong>2. 余裕期間の調整:</strong></p>
          <p>経路 A-C-D は 11日。プロジェクト期間は12日なので、Cは1日余裕があります。<br/>
          作業Cは最短2日ですが、3日で済めば良いわけです。<br/>
          Cを2日に短縮するには、標準(5日)から3日短縮が必要ですが、3日(5-2)まで短縮せず、2日短縮(5-3)で十分です。</p>
          
          <p><strong>3. 費用の計算:</strong></p>
          <ul className="list-disc pl-4">
            <li>A: 短縮なし (0円)</li>
            <li>B: 4日→3日 (1日短縮 × 10万 = 10万)</li>
            <li>D: 6日→3日 (3日短縮 × 50万 = 150万)</li>
            <li>C: 5日→3日でOK (2日短縮 × 30万 = 60万) <span className="text-red-600 font-bold">※ここがポイント</span></li>
          </ul>
          <p>合計: 10 + 150 + 60 = <strong>220万円</strong></p>
        </div>
      </div>
    )
  },
  {
    id: 7,
    category: "ジョンソン法",
    question: "工程1→工程2の順で行われる生産ラインで、4製品A, B, C, Dを生産する。ジョンソン法を用いて順序を最適化した時の最短時間は？",
    table: (
      <table className="w-full text-xs text-left border-collapse border border-gray-300 mb-4">
        <thead>
          <tr className="bg-gray-100"><th className="border p-1">製品</th><th className="border p-1">工程1</th><th className="border p-1">工程2</th></tr>
        </thead>
        <tbody>
          <tr><td className="border p-1">A</td><td className="border p-1">10</td><td className="border p-1">5</td></tr>
          <tr><td className="border p-1">B</td><td className="border p-1">3</td><td className="border p-1">7</td></tr>
          <tr><td className="border p-1">C</td><td className="border p-1">4</td><td className="border p-1">2</td></tr>
          <tr><td className="border p-1">D</td><td className="border p-1">8</td><td className="border p-1">6</td></tr>
        </tbody>
      </table>
    ),
    options: ["50分", "32分", "28分", "37分"],
    answer: 2, // index 2 = ウ
    explanation: (
      <div className="space-y-4">
        <p><strong>正解：ウ (28分)</strong></p>
        <div className="text-sm space-y-2">
          <p><strong>ジョンソン法の手順:</strong></p>
          <ol className="list-decimal pl-4">
            <li>最小値を探す → Cの工程2(2)が最小。工程2(後)なのでCを<strong>最後</strong>に。 [ ? ? ? C ]</li>
            <li>残りで最小 → Bの工程1(3)。工程1(前)なのでBを<strong>最初</strong>に。 [ B ? ? C ]</li>
            <li>残りで最小 → Aの工程2(5)。工程2(後)なのでAを後ろ詰め。 [ B ? A C ]</li>
            <li>残りはD。順序は <strong>B → D → A → C</strong>。</li>
          </ol>
          <p><strong>ガントチャート計算:</strong></p>
          <div className="overflow-x-auto">
            <table className="text-xs border-collapse border">
              <tbody>
                <tr><td className="border bg-gray-100 p-1">工程1</td><td className="border p-1">B(0-3)</td><td className="border p-1">D(3-11)</td><td className="border p-1">A(11-21)</td><td className="border p-1">C(21-25)</td></tr>
                <tr><td className="border bg-gray-100 p-1">工程2</td><td className="border p-1 text-gray-400">待(0-3)</td><td className="border p-1">B(3-10)</td><td className="border p-1">D(11-17)</td><td className="border p-1">A(21-26)</td><td className="border p-1">C(26-28)</td></tr>
              </tbody>
            </table>
          </div>
          <p>最終完了時刻は <strong>28分</strong>。</p>
        </div>
      </div>
    )
  },
  {
    id: 8,
    category: "需要予測",
    question: "需要予測に関する記述として、最も不適切なものはどれか。",
    options: [
      "加重移動平均法による予測で、重みをすべて同じにした場合、予測値は単純移動平均法と同一となる。",
      "単純移動平均法による予想で、ノイズを出来るだけ除去する場合には、用いるデータ数を減らせばよい。",
      "指数平滑法による予想で、直近の実績の影響を強く反映したい場合は、平滑化指数を大きくすればよい。",
      "加重平均法による予測で、過去のデータの影響を少なくしたい場合は、重みを減らせばよい。"
    ],
    answer: 1, // index 1 = イ
    explanation: (
      <div className="space-y-4">
        <p><strong>正解：イ</strong></p>
        <div className="text-sm space-y-2">
          <p><strong>ア ○：</strong>重みが全て同じ（例：全て1）なら、単純平均と同じ計算になります。</p>
          <p><strong>イ ×：</strong>ノイズ（特異な変動）を除去し、傾向を平滑化するには、データ数（期間）を<strong>増やす</strong>必要があります。データ数が少ないと、直近のノイズの影響を大きく受けます。</p>
          <p><strong>ウ ○：</strong>指数平滑法：予測 = 旧予測 + α(実績 - 旧予測)。α（平滑化指数）が大きいほど、実績との乖離を大きく修正＝直近実績の影響が強くなります。</p>
          <p><strong>エ ○：</strong>加重平均で過去のデータの影響を減らすには、そのデータの重みを小さくします。</p>
        </div>
      </div>
    )
  },
  {
    id: 9,
    category: "生産統制",
    question: "生産統制に関する記述として、最も適切なものはどれか。",
    options: [
      "生産統制は、大きくわけて進捗管理、現品管理、余力管理、販売管理の4つから構成される。",
      "余力管理では、製品原価や作業者の負荷状況を管理し、むだな費用の発生を防止する。",
      "進捗管理では、入荷した資材の管理や、日程計画に対する仕事の進捗状況を管理する。",
      "現品管理では、部品や仕掛品の運搬や保管状況を管理し、部品の過不足を未然に防止する。"
    ],
    answer: 3, // index 3 = エ
    explanation: (
      <div className="space-y-4">
        <p><strong>正解：エ</strong></p>
        <div className="bg-blue-50 p-3 rounded border border-blue-200 text-sm">
          <p className="font-bold">【生産統制の3本柱】</p>
          <ul className="list-disc pl-4">
            <li><strong>進捗管理（日程）：</strong>計画に対し遅れがないか調整。</li>
            <li><strong>現品管理（物）：</strong>資材・仕掛品の所在と数量の管理。</li>
            <li><strong>余力管理（工数）：</strong>能力と負荷のバランス調整。</li>
          </ul>
        </div>
        <div className="text-sm space-y-2">
          <p><strong>ア ×：</strong>「販売管理」は含まれません。</p>
          <p><strong>イ ×：</strong>余力管理は「負荷と能力」の管理です。「原価」管理は主目的ではありません。</p>
          <p><strong>ウ ×：</strong>「入荷した資材の管理」は現品管理の領域です。</p>
          <p><strong>エ ○：</strong>記述の通りです。</p>
        </div>
      </div>
    )
  },
  {
    id: 10,
    category: "生産管理方式",
    question: "生産の管理方式に関する記述として、最も適切なものはどれか。",
    options: [
      "追番管理方式は、生産計画に対する実績の差異を容易に把握できるというメリットがある。",
      "オーダーエントリー方式では、すでに生産工程に製品があるため、顧客の個別の要求に対応するのは難しい。",
      "製番管理方式で生産された製品において、使用した部品の一部に欠陥が見つかった場合、その部品を作った時期を特定するのは難しい。",
      "生産座席予約システムでは、短納期の顧客要求に対しても、いつでも柔軟に生産の対応ができる。"
    ],
    answer: 0, // index 0 = ア
    explanation: (
      <div className="space-y-4">
        <p><strong>正解：ア</strong></p>
        <div className="text-sm space-y-2">
          <p><strong>ア ○：</strong>追番（累計製造番号）を用いると、「計画の番号」と「実績の番号」を比べるだけで進捗差異が分かります。</p>
          <p><strong>イ ×：</strong>オーダーエントリー方式は、仕掛中の製品にオーダーを引き当て、仕様変更やオプション対応を行うため、個別要求に対応<strong>できます</strong>。</p>
          <p><strong>ウ ×：</strong>製番管理方式は、製品と部品が製番で紐づいているため、トレーサビリティ（追跡可能性）が高く、特定は<strong>容易</strong>です。</p>
          <p><strong>エ ×：</strong>生産座席予約（座席＝生産枠）がいっぱいの場合は、柔軟な対応は<strong>難しい</strong>です。</p>
        </div>
      </div>
    )
  },
  {
    id: 11,
    category: "トヨタ生産方式",
    question: "トヨタ生産方式に関する記述として、最も不適切なものはどれか。",
    options: [
      "かんばんの枚数及びそこに指示される量は、生産量と同時に工程間の仕掛品の数も指示することになる。",
      "かんばんは、作業の指示をする生産指示かんばんと、運搬を表す運搬かんばんの2種類がある。",
      "プルシステムを導入して、効率的な生産を行うためには、最終組み立てラインの生産量の平準化が重要となる。",
      "JITは、必要なものを、必要な時に、必要な数だけ生産する方式で、これを実現するため、後工程引取り方式を採用している。"
    ],
    answer: 1, // index 1 = イ
    explanation: (
      <div className="space-y-4">
        <p><strong>正解：イ</strong></p>
        <div className="text-sm space-y-2">
          <p><strong>ア ○：</strong>かんばんの総量は、系内にある在庫（仕掛品）の上限を規定します。</p>
          <p><strong>イ ×：</strong>「運搬かんばん」ではなく、正しくは<strong>「引取りかんばん」</strong>です。（機能は運搬指示ですが、用語としては引取りかんばんを用います）</p>
          <p><strong>ウ ○：</strong>後工程が引き取る方式なので、最終工程が波打つと、前工程への変動が増幅されます。よって平準化が必須です。</p>
          <p><strong>エ ○：</strong>JITと後工程引取り方式の正しい説明です。</p>
        </div>
      </div>
    )
  }
];

/* ------------------------------------------------------------------
   SVG Components (図解用)
   ------------------------------------------------------------------ */

const PertDiagram1 = () => (
  <svg viewBox="0 0 400 220" className="w-full h-auto bg-white border rounded">
    {/* Nodes */}
    <circle cx="30" cy="110" r="15" fill="#e2e8f0" stroke="black" />
    <text x="30" y="115" textAnchor="middle" fontSize="12">1</text>

    <circle cx="120" cy="40" r="15" fill="#e2e8f0" stroke="black" />
    <text x="120" y="45" textAnchor="middle" fontSize="12">2</text>

    <circle cx="120" cy="110" r="15" fill="#e2e8f0" stroke="black" />
    <text x="120" y="115" textAnchor="middle" fontSize="12">3</text>

    <circle cx="120" cy="180" r="15" fill="#e2e8f0" stroke="black" />
    <text x="120" y="185" textAnchor="middle" fontSize="12">6</text>

    <circle cx="210" cy="40" r="15" fill="#e2e8f0" stroke="black" />
    <text x="210" y="45" textAnchor="middle" fontSize="12">4</text>

    <circle cx="210" cy="110" r="15" fill="#e2e8f0" stroke="black" />
    <text x="210" y="115" textAnchor="middle" fontSize="12">5</text>

    <circle cx="350" cy="110" r="15" fill="#e2e8f0" stroke="black" />
    <text x="350" y="115" textAnchor="middle" fontSize="12">7</text>

    {/* Edges with Arrows */}
    <defs>
      <marker id="arrow" markerWidth="10" markerHeight="10" refX="25" refY="3" orient="auto" markerUnits="strokeWidth">
        <path d="M0,0 L0,6 L9,3 z" fill="#000" />
      </marker>
    </defs>

    <line x1="30" y1="110" x2="120" y2="40" stroke="black" markerEnd="url(#arrow)" />
    <text x="60" y="70" fontSize="10">A:8</text>

    <line x1="30" y1="110" x2="120" y2="110" stroke="black" markerEnd="url(#arrow)" />
    <text x="75" y="105" fontSize="10">B:4</text>

    <line x1="30" y1="110" x2="120" y2="180" stroke="black" markerEnd="url(#arrow)" />
    <text x="60" y="160" fontSize="10">C:5</text>

    <line x1="120" y1="40" x2="210" y2="40" stroke="black" markerEnd="url(#arrow)" />
    <text x="165" y="35" fontSize="10">D:6</text>

    <line x1="120" y1="110" x2="210" y2="40" stroke="black" markerEnd="url(#arrow)" />
    <text x="150" y="70" fontSize="10">E:8</text>

    <line x1="120" y1="110" x2="210" y2="110" stroke="black" markerEnd="url(#arrow)" />
    <text x="165" y="105" fontSize="10">F:9</text>

    <line x1="120" y1="180" x2="210" y2="110" stroke="black" markerEnd="url(#arrow)" />
    <text x="150" y="160" fontSize="10">G:7</text>

    <line x1="210" y1="40" x2="350" y2="110" stroke="black" markerEnd="url(#arrow)" />
    <text x="280" y="60" fontSize="10">H:12</text>

    <line x1="210" y1="110" x2="350" y2="110" stroke="black" markerEnd="url(#arrow)" />
    <text x="280" y="105" fontSize="10">I:3</text>

    <line x1="120" y1="180" x2="350" y2="110" stroke="black" markerEnd="url(#arrow)" />
    <text x="250" y="170" fontSize="10">J:3</text>
  </svg>
);

const PertDiagram2 = () => (
  <svg viewBox="0 0 500 200" className="w-full h-auto bg-white border rounded">
    <defs>
      <marker id="arrow2" markerWidth="10" markerHeight="10" refX="25" refY="3" orient="auto" markerUnits="strokeWidth">
        <path d="M0,0 L0,6 L9,3 z" fill="#000" />
      </marker>
    </defs>
    {/* Nodes */}
    <g stroke="black" fill="white" strokeWidth="1">
      <circle cx="30" cy="100" r="15" />
      <circle cx="120" cy="100" r="15" />
      <circle cx="210" cy="40" r="15" />
      <circle cx="210" cy="160" r="15" />
      <circle cx="300" cy="100" r="15" />
      <circle cx="390" cy="100" r="15" />
      <circle cx="470" cy="100" r="15" />
    </g>
    <g textAnchor="middle" fontSize="12">
      <text x="30" y="105">0</text>
      <text x="120" y="105">1</text>
      <text x="210" y="45">2</text>
      <text x="210" y="165">3</text>
      <text x="300" y="105">4</text>
      <text x="390" y="105">5</text>
      <text x="470" y="105">6</text>
    </g>

    {/* Lines */}
    <g stroke="black" strokeWidth="1" markerEnd="url(#arrow2)">
      <line x1="30" y1="100" x2="120" y2="100" /> {/* A */}
      <line x1="120" y1="100" x2="210" y2="40" /> {/* B */}
      <line x1="120" y1="100" x2="210" y2="160" /> {/* C */}
      <line x1="120" y1="100" x2="300" y2="100" /> {/* D */}
      <line x1="210" y1="40" x2="390" y2="100" /> {/* E */}
      <line x1="210" y1="160" x2="390" y2="100" /> {/* F */}
      <line x1="300" y1="100" x2="390" y2="100" /> {/* G */}
      <line x1="390" y1="100" x2="470" y2="100" /> {/* H */}
    </g>
    
    {/* Dummies (dashed) */}
    <g stroke="black" strokeWidth="1" strokeDasharray="4" markerEnd="url(#arrow2)">
       <line x1="210" y1="40" x2="300" y2="100" />
       <line x1="210" y1="160" x2="300" y2="100" />
    </g>

    <g fontSize="10" fill="blue">
      <text x="75" y="90">A:20</text>
      <text x="150" y="60">B:25</text>
      <text x="150" y="140">C:15</text>
      <text x="210" y="90">D:30</text>
      <text x="300" y="60">E:20</text>
      <text x="300" y="140">F:25</text>
      <text x="345" y="90">G:20</text>
      <text x="430" y="90">H:10</text>
    </g>
  </svg>
);

/* ------------------------------------------------------------------
   Application Logic
   ------------------------------------------------------------------ */

export default function App() {
  const [mode, setMode] = useState('menu'); // menu, quiz, results, history
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState({}); // { questionId: selectedOptionIndex }
  const [reviewFlags, setReviewFlags] = useState({}); // { questionId: boolean }
  const [history, setHistory] = useState([]); // Array of past sessions
  const [filteredQuestions, setFilteredQuestions] = useState([]);
  const [showExplanation, setShowExplanation] = useState(false);

  // Initialize from LocalStorage
  useEffect(() => {
    try {
      const storedAnswers = JSON.parse(localStorage.getItem('prod_planner_answers')) || {};
      const storedReviews = JSON.parse(localStorage.getItem('prod_planner_reviews')) || {};
      const storedHistory = JSON.parse(localStorage.getItem('prod_planner_history')) || [];
      setUserAnswers(storedAnswers);
      setReviewFlags(storedReviews);
      setHistory(storedHistory);
      console.log("Loaded data from storage");
    } catch (e) {
      console.error("Failed to load storage", e);
    }
  }, []);

  // Save to LocalStorage
  useEffect(() => {
    try {
      localStorage.setItem('prod_planner_answers', JSON.stringify(userAnswers));
      localStorage.setItem('prod_planner_reviews', JSON.stringify(reviewFlags));
      localStorage.setItem('prod_planner_history', JSON.stringify(history));
    } catch (e) {
      console.error("Failed to save storage", e);
    }
  }, [userAnswers, reviewFlags, history]);

  const startQuiz = (filterType) => {
    let questions = [...QUESTION_DATA];
    if (filterType === 'review') {
      questions = questions.filter(q => reviewFlags[q.id]);
    } else if (filterType === 'wrong') {
      // Last answer was incorrect or not answered
      questions = questions.filter(q => {
        const lastAns = userAnswers[q.id];
        return lastAns !== undefined && lastAns !== q.answer;
      });
    }
    
    if (questions.length === 0) {
      alert("該当する問題がありません。");
      return;
    }

    setFilteredQuestions(questions);
    setCurrentQuestionIndex(0);
    setShowExplanation(false);
    setMode('quiz');
  };

  const handleAnswer = (optionIndex) => {
    if (showExplanation) return; // Prevent changing after answered
    
    const currentQ = filteredQuestions[currentQuestionIndex];
    const newAnswers = { ...userAnswers, [currentQ.id]: optionIndex };
    setUserAnswers(newAnswers);
    setShowExplanation(true);

    // Save history item immediately for this session
    // (In a real app, might save at end of quiz)
  };

  const nextQuestion = () => {
    if (currentQuestionIndex < filteredQuestions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setShowExplanation(false);
    } else {
      // Quiz finished, save session summary
      const score = filteredQuestions.reduce((acc, q) => {
        return (userAnswers[q.id] === q.answer) ? acc + 1 : acc;
      }, 0);
      
      const newHistoryItem = {
        date: new Date().toLocaleString(),
        score: score,
        total: filteredQuestions.length,
        mode: mode
      };
      setHistory(prev => [newHistoryItem, ...prev].slice(0, 10)); // Keep last 10
      setMode('results');
    }
  };

  const toggleReview = (id) => {
    setReviewFlags(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const currentQ = filteredQuestions[currentQuestionIndex];

  // Render Logic
  if (mode === 'menu') {
    return (
      <div className="min-h-screen bg-gray-50 p-6 flex flex-col items-center justify-center font-sans text-gray-800">
        <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
          <h1 className="text-2xl font-bold mb-2 text-center text-blue-800">スマート問題集</h1>
          <h2 className="text-lg font-medium mb-6 text-center text-gray-600">生産計画と生産統制</h2>
          
          <div className="space-y-4">
            <button 
              onClick={() => startQuiz('all')}
              className="w-full flex items-center justify-between p-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              <span className="flex items-center gap-2"><Play size={20}/> すべての問題に挑戦</span>
              <span className="bg-blue-800 text-xs px-2 py-1 rounded">{QUESTION_DATA.length}問</span>
            </button>

            <button 
              onClick={() => startQuiz('wrong')}
              className="w-full flex items-center justify-between p-4 bg-orange-100 text-orange-800 rounded-lg hover:bg-orange-200 transition border border-orange-200"
            >
              <span className="flex items-center gap-2"><RotateCcw size={20}/> 前回間違えた問題</span>
            </button>

            <button 
              onClick={() => startQuiz('review')}
              className="w-full flex items-center justify-between p-4 bg-yellow-100 text-yellow-800 rounded-lg hover:bg-yellow-200 transition border border-yellow-200"
            >
              <span className="flex items-center gap-2"><Flag size={20}/> 要復習の問題</span>
              <span className="bg-yellow-200 text-xs px-2 py-1 rounded">
                {Object.values(reviewFlags).filter(Boolean).length}問
              </span>
            </button>

            <button 
              onClick={() => setMode('history')}
              className="w-full flex items-center justify-center p-4 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition"
            >
              <span className="flex items-center gap-2"><BarChart2 size={20}/> 学習履歴を見る</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (mode === 'quiz' && currentQ) {
    const isAnswered = showExplanation;
    const selectedIdx = userAnswers[currentQ.id];
    const isCorrect = selectedIdx === currentQ.answer;

    return (
      <div className="min-h-screen bg-gray-100 p-4 md:p-8 font-sans">
        <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-md overflow-hidden">
          {/* Header */}
          <div className="bg-gray-800 text-white p-4 flex justify-between items-center">
            <div className="text-sm font-semibold">Q{currentQuestionIndex + 1} / {filteredQuestions.length}</div>
            <div className="text-sm opacity-75">{currentQ.category}</div>
            <button onClick={() => setMode('menu')} className="p-1 hover:bg-gray-700 rounded"><Home size={20}/></button>
          </div>

          {/* Question Body */}
          <div className="p-6">
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-lg font-bold text-gray-900 leading-relaxed">{currentQ.question}</h2>
              <button 
                onClick={() => toggleReview(currentQ.id)}
                className={`p-2 rounded-full ${reviewFlags[currentQ.id] ? 'bg-yellow-100 text-yellow-600' : 'text-gray-300 hover:text-gray-400'}`}
              >
                <Flag fill={reviewFlags[currentQ.id] ? "currentColor" : "none"} />
              </button>
            </div>

            {/* Diagrams/Tables */}
            {currentQ.table && <div className="mb-6 overflow-x-auto">{currentQ.table}</div>}
            {currentQ.diagramType === 'pert1' && <div className="mb-6 max-w-md mx-auto"><PertDiagram1 /></div>}
            {currentQ.diagramType === 'pert2' && <div className="mb-6 max-w-lg mx-auto"><PertDiagram2 /></div>}

            {/* Options */}
            <div className="space-y-3 mt-6">
              {currentQ.options.map((option, idx) => {
                let btnClass = "w-full text-left p-4 rounded-lg border transition relative ";
                if (isAnswered) {
                  if (idx === currentQ.answer) btnClass += "bg-green-50 border-green-500 text-green-900 font-semibold ";
                  else if (idx === selectedIdx) btnClass += "bg-red-50 border-red-500 text-red-900 ";
                  else btnClass += "bg-gray-50 border-gray-200 text-gray-500 opacity-60 ";
                } else {
                  btnClass += "hover:bg-blue-50 border-gray-200 hover:border-blue-300 ";
                }

                return (
                  <button 
                    key={idx} 
                    onClick={() => handleAnswer(idx)} 
                    disabled={isAnswered}
                    className={btnClass}
                  >
                    <span className="mr-3 font-bold inline-block w-6 h-6 rounded-full bg-white border text-center text-sm leading-6">
                      {['ア','イ','ウ','エ'][idx]}
                    </span>
                    {option}
                    {isAnswered && idx === currentQ.answer && <Check className="absolute right-4 top-4 text-green-600" />}
                    {isAnswered && idx === selectedIdx && idx !== currentQ.answer && <X className="absolute right-4 top-4 text-red-600" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Explanation Area */}
          {isAnswered && (
            <div className="border-t-2 border-gray-100 p-6 bg-slate-50 animate-in fade-in slide-in-from-bottom-4 duration-300">
              <div className="flex items-center gap-2 mb-4">
                <BookOpen className="text-blue-600" size={24}/>
                <h3 className="text-xl font-bold text-gray-800">解説</h3>
                <span className={`ml-auto px-3 py-1 rounded-full text-sm font-bold ${isCorrect ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                  {isCorrect ? '正解！' : '不正解...'}
                </span>
              </div>
              
              <div className="text-gray-700 leading-relaxed">
                {currentQ.explanation}
              </div>

              <div className="mt-8 flex justify-end">
                <button 
                  onClick={nextQuestion}
                  className="bg-blue-600 text-white px-8 py-3 rounded-lg font-bold shadow-lg hover:bg-blue-700 transition flex items-center gap-2"
                >
                  {currentQuestionIndex < filteredQuestions.length - 1 ? '次の問題へ' : '結果を見る'}
                  <ChevronRight />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  if (mode === 'results') {
    const score = filteredQuestions.reduce((acc, q) => {
      return (userAnswers[q.id] === q.answer) ? acc + 1 : acc;
    }, 0);
    const percentage = Math.round((score / filteredQuestions.length) * 100);

    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
        <div className="bg-white rounded-xl shadow-xl p-8 max-w-md w-full text-center">
          <Trophy className="mx-auto text-yellow-500 mb-4" size={48} />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">お疲れ様でした！</h2>
          <div className="text-6xl font-black text-blue-600 mb-4">{score} <span className="text-2xl text-gray-400">/ {filteredQuestions.length}</span></div>
          <p className="text-gray-500 mb-8">正答率: {percentage}%</p>
          
          <button 
            onClick={() => setMode('menu')}
            className="w-full bg-gray-800 text-white py-3 rounded-lg font-bold hover:bg-gray-900 transition"
          >
            メニューに戻る
          </button>
        </div>
      </div>
    );
  }

  if (mode === 'history') {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-2xl mx-auto bg-white rounded-xl shadow p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-800">学習履歴</h2>
            <button onClick={() => setMode('menu')} className="text-blue-600 hover:underline">メニューへ</button>
          </div>
          
          {history.length === 0 ? (
            <p className="text-center text-gray-400 py-8">まだ履歴がありません。</p>
          ) : (
            <div className="space-y-4">
              {history.map((item, idx) => (
                <div key={idx} className="flex justify-between items-center p-4 border rounded bg-gray-50">
                  <div>
                    <div className="font-bold text-gray-700">{item.date}</div>
                    <div className="text-xs text-gray-500">Total: {item.total}問</div>
                  </div>
                  <div className="text-xl font-bold text-blue-600">
                    {item.score}点
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  return null;
}