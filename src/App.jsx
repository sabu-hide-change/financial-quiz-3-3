/* DEPENDENCIES:
  npm install lucide-react recharts clsx tailwind-merge

  BUILD FIX (if needed):
  CI=false npm run build
*/

import React, { useState, useEffect, useMemo } from 'react';
import { 
  CheckCircle, 
  XCircle, 
  Play, 
  RotateCcw, 
  Flag, 
  Home, 
  ChevronRight, 
  AlertCircle,
  Check,
  X
} from 'lucide-react';

// ------------------------------------------------------------------
// DATA SOURCE (Based on the uploaded document)
// ------------------------------------------------------------------

const QUESTIONS = [
  {
    id: 1,
    title: "問題 1 生産計画",
    question: "生産計画に関する記述として、最も適切なものはどれか。",
    options: [
      "生産計画の役割として、納期や生産量の保証、製品品質の保証、設備稼働率の維持などがある。",
      "負荷計画では、生産能力と手持ち材料を比較し、過不足がある場合に調整を図る。",
      "生産計画を業務で分類すると、手順計画、工程設計、負荷計画、日程計画に分類できる。",
      "手順計画では、設計情報を基に、加工手順、使用設備、標準作業時間などを検討する。"
    ],
    correctAnswer: 3, // エ
    explanation: (
      <div className="space-y-4 text-sm">
        <p><strong>正解：エ</strong></p>
        <p>手順計画（工程設計）では、設計情報を基に、加工手順、使用設備、標準作業時間などを検討し、製品の効率的な生産方法を決定します。</p>
        <div className="bg-slate-100 p-3 rounded-md">
          <p className="font-bold mb-2">生産計画の分類</p>
          <ul className="list-disc pl-5 space-y-1">
            <li><strong>手順計画（工程設計）：</strong> 「作り方」を決める（手順、設備、標準時間）。</li>
            <li><strong>工数計画（負荷計画）：</strong> 「量と能力」を比較・調整する（人員、設備時間）。</li>
            <li><strong>日程計画：</strong> 「スケジュール」を決める（開始・完了日）。</li>
          </ul>
        </div>
        <p className="text-xs text-slate-500 mt-2">
          ※ア：品質保証は生産計画の直接的な役割ではありません。<br/>
          ※イ：負荷計画で比較するのは「工数（負荷）」と「能力」です。材料ではありません。<br/>
          ※ウ：手順計画と工程設計は同じ意味（別名）なので、重複しています。
        </p>
      </div>
    )
  },
  {
    id: 2,
    title: "問題 2 スケジューリング",
    question: "スケジューリングに関する記述として、最も不適切なものはどれか。",
    options: [
      "フォワードスケジューリングとは、作業の開始時点から、順番に予定を組んでいく方法である。",
      "ジョブショップスケジューリングは、同じ専用ラインを使用して複数の製品を大量生産するのに適した方法である。",
      "バックワードスケジューリングは、予め決められた納期を守るために、作業開始日を決める方法である。",
      "プロジェクトスケジューリングでは、必要な作業を全て抽出し、それぞれの作業の開始日と完了日が分かるようにする。"
    ],
    correctAnswer: 1, // イが不適切
    explanation: (
      <div className="space-y-4 text-sm">
        <p><strong>正解（不適切）：イ</strong></p>
        <p>記述は「フローショップスケジューリング」の説明です。ジョブショップスケジューリングは、<strong>多品種少量生産</strong>で、機能別レイアウトの場合に、作業や機械の順番を最適化する手法です。</p>
        <div className="bg-slate-100 p-3 rounded-md">
          <p className="font-bold mb-2">スケジューリング手法</p>
          <table className="w-full text-xs border-collapse border border-slate-300">
            <thead>
              <tr className="bg-slate-200">
                <th className="border p-1">手法</th>
                <th className="border p-1">特徴</th>
                <th className="border p-1">適用</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border p-1">ジョブショップ</td>
                <td className="border p-1">順序最適化</td>
                <td className="border p-1">多品種少量 (機能別)</td>
              </tr>
              <tr>
                <td className="border p-1">フローショップ</td>
                <td className="border p-1">機械割当最適化</td>
                <td className="border p-1">少種多量 (製品別)</td>
              </tr>
              <tr>
                <td className="border p-1">プロジェクト</td>
                <td className="border p-1">全体日程管理</td>
                <td className="border p-1">個別生産</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    )
  },
  {
    id: 3,
    title: "問題 3 PERT1",
    question: "来月から開始するプロジェクトのスケジューリングをPERTで行ったところ、下図のようになった。最も適切な記述はどれか。",
    diagramType: "pert1",
    options: [
      "ノード7の最早着手日は、16日である。",
      "クリティカルパスは、作業B→F→G→Jの経路である。",
      "ノード6の最遅着手日は、20日である。",
      "ノード3の最早着手日は4日、最遅着手日6日である。"
    ],
    correctAnswer: 3, // エ
    explanation: (
      <div className="space-y-4 text-sm">
        <p><strong>正解：エ</strong></p>
        <p>ノード3の最早着手日は作業B(4日)直後なので<strong>4日</strong>。<br/>最遅着手日は、クリティカルパス上のノード4(最早=最遅=14日)から作業E(8日)を引いた、14 - 8 = <strong>6日</strong>となります。</p>
        <div className="bg-slate-100 p-3 rounded-md">
          <p className="font-bold mb-2">計算のポイント</p>
          <ul className="list-disc pl-5 space-y-1">
            <li><strong>クリティカルパス：</strong> A(8) → D(6) → H(12) = 26日 (赤ルート)</li>
            <li>ノード7の最早着手日 = 26日</li>
            <li>ノード6の最遅着手日 = 26 - J(3) = 23日</li>
          </ul>
        </div>
      </div>
    )
  },
  {
    id: 4,
    title: "問題 4 PERT2",
    question: "下表およびPERT図において、空欄Ｘ、Ｙに入る数値、及びクリティカルパスについて、最も適切な組み合わせを選べ。",
    diagramType: "pert2",
    options: [
      "Ｘ：50　　Ｙ：45　　クリティカルパス：A - D - G - H",
      "Ｘ：45　　Ｙ：40　　クリティカルパス：A - B - E - H",
      "Ｘ：50　　Ｙ：45　　クリティカルパス：A - C - F - H",
      "Ｘ：45　　Ｙ：40　　クリティカルパス：A - D - G - H"
    ],
    correctAnswer: 0, // ア
    explanation: (
      <div className="space-y-4 text-sm">
        <p><strong>正解：ア</strong></p>
        <p><strong>クリティカルパス：</strong> A(20)+D(30)+G(20)+H(10) = 80日。これが最長の経路です。</p>
        <ul className="list-disc pl-5 space-y-1">
          <li><strong>空欄X (ノード2の最遅)：</strong> ノード5の最遅(70) - E(20) = 50。</li>
          <li><strong>空欄Y (ノード3の最遅)：</strong> ノード5の最遅(70) - F(25) = 45。</li>
        </ul>
      </div>
    )
  },
  {
    id: 5,
    title: "問題 5 PERT3",
    question: "あるジョブは5つの作業工程A～Eで構成されている。下表の先行関係があるとき、最短完了日数の値として、適切なものはどれか。",
    diagramType: "pert3",
    options: [
      "9",
      "11",
      "14",
      "16"
    ],
    correctAnswer: 2, // 14
    explanation: (
      <div className="space-y-4 text-sm">
        <p><strong>正解：ウ (14日)</strong></p>
        <p>先行関係からアローダイアグラムを描くと、以下の経路が考えられます。</p>
        <ul className="list-disc pl-5 space-y-1">
          <li>A(5) → B(2) → E(3) = 10日</li>
          <li>A(5) → C(4) → D(2) → E(3) = <strong>14日</strong> (最長＝クリティカルパス)</li>
        </ul>
        <p>よって最短完了日数は14日です。</p>
      </div>
    )
  },
  {
    id: 6,
    title: "問題 6 CPM (Critical Path Method)",
    question: "下表はプロジェクト業務の各作業要件である。CPMを適用して、最短プロジェクト遂行期間となる条件を達成したときの『最小費用』を選べ。",
    diagramType: "cpm_table",
    options: [
      "220万円",
      "240万円",
      "250万円",
      "280万円"
    ],
    correctAnswer: 0, // 220万円
    explanation: (
      <div className="space-y-4 text-sm">
        <p><strong>正解：ア (220万円)</strong></p>
        <ol className="list-decimal pl-5 space-y-2">
          <li>
            <strong>標準での最短期間：</strong><br/>
            経路A(6)→B(4)→D(6) = 16日<br/>
            経路A(6)→C(5)→D(6) = 17日 (クリティカルパス)<br/>
            しかし、設問は「最短プロジェクト遂行期間(各作業を限界まで短縮した期間)」を目指しています。
          </li>
          <li>
            <strong>限界短縮時の期間：</strong><br/>
            A(6)+B(3)+D(3)=12日, A(6)+C(2)+D(3)=11日。<br/>
            よってプロジェクトの最短限界はA(6)は短縮不可のため、経路A→B→Dの<strong>12日</strong>がボトルネックになります。
          </li>
          <li>
            <strong>短縮コスト計算：</strong><br/>
            目標12日を達成するために短縮が必要な作業とコスト。<br/>
            ・D：3日短縮必須 (50万×3 = 150万)<br/>
            ・B：1日短縮必須 (10万×1 = 10万) ※A(6)+B(3)+D(3)=12にするため<br/>
            ・C：A(6)+C(?)+D(3) <= 12日であればよい。Cは3日(12-6-3)以下ならOK。標準5日→3日へ2日短縮で十分 (30万×2 = 60万)<br/>
            <strong>合計：150 + 10 + 60 = 220万円</strong>
          </li>
        </ol>
      </div>
    )
  },
  {
    id: 7,
    title: "問題 7 ジョンソン法",
    question: "工程1（穴あけ）→工程2（塗装）の順で行われる2工程フローショップにおいて、下表の製品A～Dを最短で終了させる場合の総時間を選べ。(単位：分)",
    diagramType: "johnson_table",
    options: [
      "50分",
      "32分",
      "28分",
      "37分"
    ],
    correctAnswer: 2, // 28分
    explanation: (
      <div className="space-y-4 text-sm">
        <p><strong>正解：ウ (28分)</strong></p>
        <p><strong>ジョンソン法の手順：</strong></p>
        <ol className="list-decimal pl-5 space-y-1">
          <li>最小値を探す→Cの工程2(2分)。後工程なのでCを<strong>最後</strong>に配置。[ ... , C ]</li>
          <li>残りの最小値→Bの工程1(3分)。前工程なのでBを<strong>最初</strong>に配置。[ B, ... , C ]</li>
          <li>残りの最小値→Aの工程2(5分)。後工程なのでAを後ろから詰める。[ B, ... , A, C ]</li>
          <li>残りはD。[ B, D, A, C ] の順序。</li>
        </ol>
        <p className="mt-2"><strong>ガントチャート計算：</strong></p>
        <ul className="list-disc pl-5 space-y-1">
          <li>工程1完了時刻：B(3)→D(11)→A(21)→C(25)</li>
          <li>工程2完了時刻：
            <br/>B: 3+7=10
            <br/>D: max(11,10)+6=17
            <br/>A: max(21,17)+5=26
            <br/>C: max(25,26)+2=<strong>28分</strong>
          </li>
        </ul>
      </div>
    )
  },
  {
    id: 8,
    title: "問題 8 需要予測",
    question: "需要予測に関する記述として、最も不適切なものはどれか。",
    options: [
      "加重移動平均法による予測で、重みをすべて同じにした場合、予測値は単純移動平均法と同一となる。",
      "単純移動平均法による予想で、ノイズを出来るだけ除去する場合には、用いるデータ数を減らせばよい。",
      "指数平滑法による予想で、直近の実績の影響を強く反映したい場合は、平滑化指数を大きくすればよい。",
      "加重平均法による予測で、過去のデータの影響を少なくしたい場合は、重みを減らせばよい。"
    ],
    correctAnswer: 1, // イが不適切
    explanation: (
      <div className="space-y-4 text-sm">
        <p><strong>正解（不適切）：イ</strong></p>
        <p>ノイズ（一時的な変動）を除去し、平滑化するためには、用いるデータ数（期間）を<strong>増やす</strong>必要があります。データ数を減らすと、直近の変動（ノイズ）の影響を強く受けてしまいます。</p>
        <div className="bg-slate-100 p-3 rounded-md">
          <p className="font-bold mb-2">需要予測手法の特性</p>
          <ul className="list-disc pl-5 space-y-1">
            <li><strong>移動平均法：</strong> 期間を長くするほど平滑化される（ノイズ除去）。</li>
            <li><strong>指数平滑法：</strong> 平滑化指数αが大きいほど、直近実績に敏感になる（追従性アップ）。</li>
          </ul>
        </div>
      </div>
    )
  },
  {
    id: 9,
    title: "問題 9 生産統制",
    question: "生産統制に関する記述として、最も適切なものはどれか。",
    options: [
      "生産統制は、大きくわけて進捗管理、現品管理、余力管理、販売管理の4つから構成される。",
      "余力管理では、製品原価や作業者の負荷状況を管理し、むだな費用の発生を防止する。",
      "進捗管理では、入荷した資材の管理や、日程計画に対する仕事の進捗状況を管理する。",
      "現品管理では、部品や仕掛品の運搬や保管状況を管理し、部品の過不足を未然に防止する。"
    ],
    correctAnswer: 3, // エ
    explanation: (
      <div className="space-y-4 text-sm">
        <p><strong>正解：エ</strong></p>
        <p>現品管理は「物」の管理であり、部品・仕掛品の所在や数量（過不足）を管理します。</p>
        <div className="bg-slate-100 p-3 rounded-md">
          <p className="font-bold mb-2">生産統制の3要素</p>
          <ul className="list-disc pl-5 space-y-1">
            <li><strong>進捗管理（日程）：</strong> 計画に対する遅れ・進みの調整。</li>
            <li><strong>現品管理（物）：</strong> 資材・仕掛品の運搬・保管・数量管理。</li>
            <li><strong>余力管理（工数）：</strong> 人・設備の負荷と能力の調整。※原価管理は含まない。</li>
          </ul>
        </div>
        <p className="text-xs text-slate-500 mt-2">
          ※ア：販売管理は含まれません。<br/>
          ※イ：製品原価の管理は原価管理であり、余力管理（工数管理）とは異なります。<br/>
          ※ウ：入荷した資材の管理は「現品管理」の領域です。
        </p>
      </div>
    )
  },
  {
    id: 10,
    title: "問題 10 生産の管理方式",
    question: "生産の管理方式に関する記述として、最も適切なものはどれか。",
    options: [
      "追番管理方式は、生産計画に対する実績の差異を容易に把握できるというメリットがある。",
      "オーダーエントリー方式では、すでに生産工程に製品があるため、顧客の個別の要求に対応するのは難しい。",
      "製番管理方式で生産された製品において、使用した部品の一部に欠陥が見つかった場合、その部品を作った時期を特定するのは難しい。",
      "生産座席予約システムでは、短納期の顧客要求に対しても、いつでも柔軟に生産の対応ができる。"
    ],
    correctAnswer: 0, // ア
    explanation: (
      <div className="space-y-4 text-sm">
        <p><strong>正解：ア</strong></p>
        <p>追番（累計製造番号）管理方式では、例えば「本日予定：No.1000まで」に対し「実績：No.980完了」なら「20台遅れ」と即座に差異が把握できます。</p>
        <p className="text-xs text-slate-500 mt-2">
          ※イ：オーダーエントリー方式は、工程内の製品にオーダーを引き当て、仕様変更など<strong>柔軟に対応できる</strong>のが特徴です。<br/>
          ※ウ：製番管理方式は、全て同じ製番で紐づくため、<strong>追跡（トレーサビリティ）が容易</strong>です。<br/>
          ※エ：座席予約システムは、枠（座席）が埋まっている場合、短納期の要求に柔軟に対応するのは<strong>難しい</strong>です。
        </p>
      </div>
    )
  },
  {
    id: 11,
    title: "問題 11 トヨタ生産方式",
    question: "トヨタ生産方式に関する記述として、最も不適切なものはどれか。",
    options: [
      "かんばんの枚数及びそこに指示される量は、生産量と同時に工程間の仕掛品の数も指示することになる。",
      "かんばんは、作業の指示をする生産指示かんばんと、運搬を表す運搬かんばんの2種類がある。",
      "プルシステムを導入して、効率的な生産を行うためには、最終組み立てラインの生産量の平準化が重要となる。",
      "JITは、必要なものを、必要な時に、必要な数だけ生産する方式で、これを実現するため、後工程引取り方式を採用している。"
    ],
    correctAnswer: 1, // イ（不適切）
    explanation: (
      <div className="space-y-4 text-sm">
        <p><strong>正解（不適切）：イ</strong></p>
        <p>かんばんの主な2種類は、「生産指示かんばん」と<strong>「引取りかんばん」</strong>です。「運搬かんばん」という名称は一般的ではありません（機能としては運搬指示ですが、用語としては引取りかんばんが適切）。</p>
        <div className="bg-slate-100 p-3 rounded-md">
          <p className="font-bold mb-2">トヨタ生産方式の要点</p>
          <ul className="list-disc pl-5 space-y-1">
            <li><strong>ジャストインタイム(JIT)：</strong> 後工程引取り方式。</li>
            <li><strong>平準化：</strong> 後工程が引き取る量が変動すると前工程が混乱するため必須。</li>
            <li><strong>かんばん：</strong> 在庫量（仕掛品）のコントロール機能を持つ。</li>
          </ul>
        </div>
      </div>
    )
  }
];

// ------------------------------------------------------------------
// VISUAL COMPONENTS (SVG Diagrams)
// ------------------------------------------------------------------

const PertChart1 = () => (
  <div className="w-full overflow-x-auto my-4 bg-white p-2 rounded border border-slate-200">
    <svg viewBox="0 0 500 250" className="w-full h-auto min-w-[400px]">
      <defs>
        <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="28" refY="3.5" orient="auto">
          <polygon points="0 0, 10 3.5, 0 7" fill="#64748b" />
        </marker>
      </defs>
      
      {/* Edges */}
      <line x1="50" y1="125" x2="150" y2="50" stroke="#64748b" strokeWidth="2" markerEnd="url(#arrowhead)" />
      <text x="90" y="80" fontSize="12" fill="black">A:8</text>
      
      <line x1="50" y1="125" x2="150" y2="125" stroke="#64748b" strokeWidth="2" markerEnd="url(#arrowhead)" />
      <text x="90" y="120" fontSize="12" fill="black">B:4</text>

      <line x1="50" y1="125" x2="250" y2="220" stroke="#64748b" strokeWidth="2" markerEnd="url(#arrowhead)" />
      <text x="120" y="190" fontSize="12" fill="black">C:5</text>

      <line x1="150" y1="50" x2="250" y2="50" stroke="#64748b" strokeWidth="2" markerEnd="url(#arrowhead)" />
      <text x="190" y="45" fontSize="12" fill="black">D:6</text>

      <line x1="150" y1="125" x2="250" y2="50" stroke="#64748b" strokeWidth="2" markerEnd="url(#arrowhead)" />
      <text x="180" y="90" fontSize="12" fill="black">E:8</text>

      <line x1="150" y1="125" x2="250" y2="125" stroke="#64748b" strokeWidth="2" markerEnd="url(#arrowhead)" />
      <text x="190" y="120" fontSize="12" fill="black">F:9</text>

      <line x1="250" y1="125" x2="350" y2="125" stroke="#64748b" strokeWidth="2" markerEnd="url(#arrowhead)" />
      <text x="290" y="120" fontSize="12" fill="black">I:3</text>

      <line x1="250" y1="125" x2="250" y2="220" stroke="#64748b" strokeWidth="2" markerEnd="url(#arrowhead)" />
      <text x="255" y="170" fontSize="12" fill="black">G:7</text>

      <line x1="250" y1="50" x2="450" y2="125" stroke="#64748b" strokeWidth="2" markerEnd="url(#arrowhead)" />
      <text x="350" y="80" fontSize="12" fill="black">H:12</text>
      
      <line x1="250" y1="220" x2="450" y2="125" stroke="#64748b" strokeWidth="2" markerEnd="url(#arrowhead)" />
      <text x="350" y="190" fontSize="12" fill="black">J:3</text>

      {/* Nodes */}
      <g>
        <circle cx="50" cy="125" r="15" fill="#e2e8f0" stroke="#475569" strokeWidth="2" />
        <text x="50" y="129" textAnchor="middle" fontSize="12" fontWeight="bold">1</text>
      </g>
      <g>
        <circle cx="150" cy="50" r="15" fill="#e2e8f0" stroke="#475569" strokeWidth="2" />
        <text x="150" y="54" textAnchor="middle" fontSize="12" fontWeight="bold">2</text>
      </g>
      <g>
        <circle cx="150" cy="125" r="15" fill="#e2e8f0" stroke="#475569" strokeWidth="2" />
        <text x="150" y="129" textAnchor="middle" fontSize="12" fontWeight="bold">3</text>
      </g>
      <g>
        <circle cx="250" cy="50" r="15" fill="#e2e8f0" stroke="#475569" strokeWidth="2" />
        <text x="250" y="54" textAnchor="middle" fontSize="12" fontWeight="bold">4</text>
      </g>
      <g>
        <circle cx="250" cy="125" r="15" fill="#e2e8f0" stroke="#475569" strokeWidth="2" />
        <text x="250" y="129" textAnchor="middle" fontSize="12" fontWeight="bold">5</text>
      </g>
      <g>
        <circle cx="250" cy="220" r="15" fill="#e2e8f0" stroke="#475569" strokeWidth="2" />
        <text x="250" y="224" textAnchor="middle" fontSize="12" fontWeight="bold">6</text>
      </g>
      <g>
        <circle cx="450" cy="125" r="15" fill="#e2e8f0" stroke="#475569" strokeWidth="2" />
        <text x="450" y="129" textAnchor="middle" fontSize="12" fontWeight="bold">7</text>
      </g>
    </svg>
  </div>
);

const PertChart2 = () => (
  <div className="w-full my-4">
    <div className="bg-white p-2 rounded border border-slate-200 overflow-x-auto">
      <table className="w-full text-xs text-center border-collapse mb-4">
        <thead>
          <tr className="bg-blue-50">
            <th className="border p-1">作業</th>
            <th className="border p-1">日数</th>
            <th className="border p-1">先行</th>
          </tr>
        </thead>
        <tbody>
          <tr><td>A</td><td>20</td><td>なし</td></tr>
          <tr><td>B</td><td>25</td><td>A</td></tr>
          <tr><td>C</td><td>15</td><td>A</td></tr>
          <tr><td>D</td><td>30</td><td>A</td></tr>
          <tr><td>E</td><td>20</td><td>B</td></tr>
          <tr><td>F</td><td>25</td><td>C</td></tr>
          <tr><td>G</td><td>20</td><td>B,C,D</td></tr>
          <tr><td>H</td><td>10</td><td>E,F,G</td></tr>
        </tbody>
      </table>
      
      <svg viewBox="0 0 600 200" className="w-full h-auto min-w-[500px]">
         <defs>
          <marker id="arrowhead2" markerWidth="10" markerHeight="7" refX="28" refY="3.5" orient="auto">
            <polygon points="0 0, 10 3.5, 0 7" fill="#64748b" />
          </marker>
        </defs>
        {/* Simplified Diagram based on problem description */}
        <line x1="30" y1="100" x2="130" y2="100" stroke="#64748b" strokeWidth="2" markerEnd="url(#arrowhead2)" />
        <text x="70" y="95" fontSize="12">A:20</text>
        
        <line x1="130" y1="100" x2="250" y2="40" stroke="#64748b" strokeWidth="2" markerEnd="url(#arrowhead2)" />
        <text x="180" y="60" fontSize="12">B:25</text>

        <line x1="130" y1="100" x2="350" y2="100" stroke="#64748b" strokeWidth="2" markerEnd="url(#arrowhead2)" />
        <text x="240" y="95" fontSize="12">D:30</text>

        <line x1="130" y1="100" x2="250" y2="160" stroke="#64748b" strokeWidth="2" markerEnd="url(#arrowhead2)" />
        <text x="180" y="140" fontSize="12">C:15</text>

        {/* Dummy lines represented as dashed */}
        <line x1="250" y1="40" x2="350" y2="100" stroke="#94a3b8" strokeWidth="1" strokeDasharray="4" markerEnd="url(#arrowhead2)" />
        <line x1="250" y1="160" x2="350" y2="100" stroke="#94a3b8" strokeWidth="1" strokeDasharray="4" markerEnd="url(#arrowhead2)" />

        <line x1="250" y1="40" x2="480" y2="100" stroke="#64748b" strokeWidth="2" markerEnd="url(#arrowhead2)" />
        <text x="360" y="50" fontSize="12">E:20</text>

        <line x1="350" y1="100" x2="480" y2="100" stroke="#64748b" strokeWidth="2" markerEnd="url(#arrowhead2)" />
        <text x="410" y="95" fontSize="12">G:20</text>

        <line x1="250" y1="160" x2="480" y2="100" stroke="#64748b" strokeWidth="2" markerEnd="url(#arrowhead2)" />
        <text x="360" y="150" fontSize="12">F:25</text>

        <line x1="480" y1="100" x2="570" y2="100" stroke="#64748b" strokeWidth="2" markerEnd="url(#arrowhead2)" />
        <text x="520" y="95" fontSize="12">H:10</text>

        {/* Nodes */}
        <g><circle cx="30" cy="100" r="12" fill="white" stroke="black" /><text x="30" y="104" textAnchor="middle" fontSize="10">0</text></g>
        <g><circle cx="130" cy="100" r="12" fill="white" stroke="black" /><text x="130" y="104" textAnchor="middle" fontSize="10">1</text></g>
        <g><circle cx="250" cy="40" r="12" fill="white" stroke="black" /><text x="250" y="44" textAnchor="middle" fontSize="10">2</text></g>
        <g><circle cx="250" cy="160" r="12" fill="white" stroke="black" /><text x="250" y="164" textAnchor="middle" fontSize="10">3</text></g>
        <g><circle cx="350" cy="100" r="12" fill="white" stroke="black" /><text x="350" y="104" textAnchor="middle" fontSize="10">4</text></g>
        <g><circle cx="480" cy="100" r="12" fill="white" stroke="black" /><text x="480" y="104" textAnchor="middle" fontSize="10">5</text></g>
        <g><circle cx="570" cy="100" r="12" fill="white" stroke="black" /><text x="570" y="104" textAnchor="middle" fontSize="10">6</text></g>
        
        {/* Boxes for X and Y */}
        <rect x="235" y="55" width="30" height="30" fill="white" stroke="black" />
        <text x="250" y="67" textAnchor="middle" fontSize="10">45</text>
        <text x="250" y="80" textAnchor="middle" fontSize="12" fontWeight="bold">X</text>

        <rect x="235" y="175" width="30" height="30" fill="white" stroke="black" />
        <text x="250" y="187" textAnchor="middle" fontSize="10">35</text>
        <text x="250" y="200" textAnchor="middle" fontSize="12" fontWeight="bold">Y</text>

      </svg>
    </div>
  </div>
);

const PertTable3 = () => (
  <div className="w-full my-4">
    <table className="w-full text-sm border-collapse border border-slate-300">
      <thead>
        <tr className="bg-slate-100">
          <th className="border p-2">作業</th>
          <th className="border p-2">日数</th>
          <th className="border p-2">先行作業</th>
        </tr>
      </thead>
      <tbody className="text-center">
        <tr><td>A</td><td>5</td><td>-</td></tr>
        <tr><td>B</td><td>2</td><td>A</td></tr>
        <tr><td>C</td><td>4</td><td>A</td></tr>
        <tr><td>D</td><td>2</td><td>C</td></tr>
        <tr><td>E</td><td>3</td><td>B, D</td></tr>
      </tbody>
    </table>
  </div>
);

const CpmTable = () => (
  <div className="w-full my-4 overflow-x-auto">
    <table className="w-full text-xs text-center border-collapse border border-slate-300 min-w-[300px]">
      <thead>
        <tr className="bg-slate-100">
          <th className="border p-1">作業</th>
          <th className="border p-1">先行</th>
          <th className="border p-1">所要(日)</th>
          <th className="border p-1">最短(日)</th>
          <th className="border p-1">短縮費用(万円)</th>
        </tr>
      </thead>
      <tbody>
        <tr><td>A</td><td>-</td><td>6</td><td>6</td><td>-</td></tr>
        <tr><td>B</td><td>A</td><td>4</td><td>3</td><td>10</td></tr>
        <tr><td>C</td><td>A</td><td>5</td><td>2</td><td>30</td></tr>
        <tr><td>D</td><td>B,C</td><td>6</td><td>3</td><td>50</td></tr>
      </tbody>
    </table>
  </div>
);

const JohnsonTable = () => (
  <div className="w-full my-4">
    <table className="w-full text-sm text-center border-collapse border border-slate-300">
      <thead>
        <tr className="bg-orange-100">
          <th className="border p-2">製品</th>
          <th className="border p-2">工程1(穴)</th>
          <th className="border p-2">工程2(塗)</th>
        </tr>
      </thead>
      <tbody>
        <tr><td>A</td><td>10</td><td>5</td></tr>
        <tr><td>B</td><td>3</td><td>7</td></tr>
        <tr><td>C</td><td>4</td><td>2</td></tr>
        <tr><td>D</td><td>8</td><td>6</td></tr>
      </tbody>
    </table>
  </div>
);

const DiagramRenderer = ({ type }) => {
  switch(type) {
    case 'pert1': return <PertChart1 />;
    case 'pert2': return <PertChart2 />;
    case 'pert3': return <PertTable3 />;
    case 'cpm_table': return <CpmTable />;
    case 'johnson_table': return <JohnsonTable />;
    default: return null;
  }
};

// ------------------------------------------------------------------
// MAIN APP COMPONENT
// ------------------------------------------------------------------

export default function App() {
  // --- State ---
  // 'menu' | 'quiz' | 'result'
  const [screen, setScreen] = useState('menu');
  
  // History: { [id]: { isCorrect: boolean, timestamp: number } }
  const [history, setHistory] = useState({});
  
  // Reviews: { [id]: boolean } (true if marked for review)
  const [reviews, setReviews] = useState({});

  // Quiz Session State
  const [quizQuestions, setQuizQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [isAnswered, setIsAnswered] = useState(false);
  
  // Load from local storage on mount
  useEffect(() => {
    const savedHistory = localStorage.getItem('quiz_history');
    const savedReviews = localStorage.getItem('quiz_reviews');
    if (savedHistory) setHistory(JSON.parse(savedHistory));
    if (savedReviews) setReviews(JSON.parse(savedReviews));
  }, []);

  // Save to local storage on change
  useEffect(() => {
    localStorage.setItem('quiz_history', JSON.stringify(history));
  }, [history]);

  useEffect(() => {
    localStorage.setItem('quiz_reviews', JSON.stringify(reviews));
  }, [reviews]);

  // --- Logic ---

  const startQuiz = (mode) => {
    let qList = [];
    if (mode === 'all') {
      qList = [...QUESTIONS];
    } else if (mode === 'incorrect') {
      qList = QUESTIONS.filter(q => history[q.id] && !history[q.id].isCorrect);
    } else if (mode === 'review') {
      qList = QUESTIONS.filter(q => reviews[q.id]);
    }

    if (qList.length === 0) {
      alert("対象の問題がありません。");
      return;
    }

    setQuizQuestions(qList);
    setCurrentIndex(0);
    setSelectedOption(null);
    setIsAnswered(false);
    setScreen('quiz');
    console.log(`Quiz started: ${mode}, count: ${qList.length}`);
  };

  const handleAnswer = (optionIndex) => {
    setSelectedOption(optionIndex);
    setIsAnswered(true);
    
    const currentQ = quizQuestions[currentIndex];
    const isCorrect = optionIndex === currentQ.correctAnswer;
    
    // Update history
    setHistory(prev => ({
      ...prev,
      [currentQ.id]: { isCorrect, timestamp: Date.now() }
    }));
    
    console.log(`Answered Q${currentQ.id}: ${isCorrect ? 'Correct' : 'Incorrect'}`);
  };

  const toggleReview = (id) => {
    setReviews(prev => {
      const newState = { ...prev, [id]: !prev[id] };
      return newState;
    });
  };

  const nextQuestion = () => {
    if (currentIndex < quizQuestions.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setSelectedOption(null);
      setIsAnswered(false);
    } else {
      setScreen('menu'); // Simple loop back to menu for now
    }
  };

  const restart = () => {
    setScreen('menu');
  };

  // --- Statistics ---
  const totalQuestions = QUESTIONS.length;
  const answeredCount = Object.keys(history).length;
  const correctCount = Object.values(history).filter(h => h.isCorrect).length;
  const accuracy = answeredCount > 0 ? Math.round((correctCount / answeredCount) * 100) : 0;
  const incorrectCount = answeredCount - correctCount;
  const reviewCount = Object.values(reviews).filter(Boolean).length;

  // --- Render Helpers ---
  
  const renderMenu = () => (
    <div className="max-w-2xl mx-auto p-4 space-y-6">
      <header className="text-center py-6 bg-blue-500 rounded-xl text-white shadow-md">
        <h1 className="text-2xl font-bold">生産管理 スマート問題集</h1>
        <p className="opacity-90 mt-2">生産計画・統制・スケジューリング</p>
      </header>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white p-4 rounded-lg shadow border border-slate-100 flex flex-col items-center">
          <span className="text-slate-500 text-xs uppercase font-bold tracking-wider">進捗率</span>
          <span className="text-2xl font-bold text-slate-800">{answeredCount} / {totalQuestions}</span>
        </div>
        <div className="bg-white p-4 rounded-lg shadow border border-slate-100 flex flex-col items-center">
          <span className="text-slate-500 text-xs uppercase font-bold tracking-wider">正答率</span>
          <span className="text-2xl font-bold text-slate-800">{accuracy}%</span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="space-y-3">
        <button 
          onClick={() => startQuiz('all')}
          className="w-full py-4 bg-white border-2 border-blue-500 text-blue-600 font-bold rounded-lg hover:bg-blue-50 flex items-center justify-center gap-2 transition-colors"
        >
          <Play size={20} />
          全ての問題を解く
        </button>
        
        <div className="grid grid-cols-2 gap-3">
          <button 
            onClick={() => startQuiz('incorrect')}
            disabled={incorrectCount === 0}
            className={`py-4 font-bold rounded-lg flex items-center justify-center gap-2 transition-colors border-2 ${
              incorrectCount > 0 
                ? 'bg-white border-red-400 text-red-500 hover:bg-red-50' 
                : 'bg-slate-100 border-slate-200 text-slate-300 cursor-not-allowed'
            }`}
          >
            <RotateCcw size={20} />
            間違った問題 ({incorrectCount})
          </button>
          
          <button 
            onClick={() => startQuiz('review')}
            disabled={reviewCount === 0}
            className={`py-4 font-bold rounded-lg flex items-center justify-center gap-2 transition-colors border-2 ${
              reviewCount > 0 
                ? 'bg-white border-amber-400 text-amber-600 hover:bg-amber-50' 
                : 'bg-slate-100 border-slate-200 text-slate-300 cursor-not-allowed'
            }`}
          >
            <Flag size={20} />
            要復習のみ ({reviewCount})
          </button>
        </div>
      </div>

      {/* Question List Preview */}
      <div className="bg-white rounded-lg shadow border border-slate-200 overflow-hidden">
        <div className="p-3 bg-slate-50 border-b border-slate-200 font-bold text-slate-700">
          問題一覧
        </div>
        <div className="divide-y divide-slate-100 max-h-64 overflow-y-auto">
          {QUESTIONS.map((q) => {
            const hist = history[q.id];
            const isReviewed = reviews[q.id];
            return (
              <div key={q.id} className="p-3 flex items-center justify-between hover:bg-slate-50 text-sm">
                <div className="flex items-center gap-3">
                  <div className="w-6 flex justify-center">
                    {hist ? (
                      hist.isCorrect ? <CheckCircle className="text-green-500" size={18} /> : <XCircle className="text-red-500" size={18} />
                    ) : (
                      <div className="w-4 h-4 rounded-full border-2 border-slate-200"></div>
                    )}
                  </div>
                  <span className="text-slate-700 truncate max-w-[200px] sm:max-w-xs">{q.title}</span>
                </div>
                {isReviewed && <Flag className="text-amber-500" size={16} fill="currentColor" />}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );

  const renderQuiz = () => {
    const question = quizQuestions[currentIndex];
    const isCorrect = selectedOption === question.correctAnswer;
    const isLast = currentIndex === quizQuestions.length - 1;
    const isMarkedReview = reviews[question.id];
    const prevHistory = history[question.id];

    return (
      <div className="max-w-2xl mx-auto p-4 min-h-screen flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <button onClick={restart} className="text-slate-400 hover:text-slate-600">
            <Home size={24} />
          </button>
          <div className="text-slate-500 font-medium">
            {currentIndex + 1} / {quizQuestions.length}
          </div>
          <div className="w-6"></div> {/* Spacer */}
        </div>

        {/* Previous Attempt Indicator */}
        {!isAnswered && prevHistory && (
          <div className={`mb-4 px-3 py-2 rounded text-xs font-bold flex items-center gap-2 ${prevHistory.isCorrect ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
            {prevHistory.isCorrect ? <CheckCircle size={14} /> : <XCircle size={14} />}
            前回: {prevHistory.isCorrect ? '正解' : '不正解'}
          </div>
        )}

        {/* Question Card */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 mb-6 flex-grow">
          <h2 className="text-lg font-bold text-slate-800 mb-2">{question.title}</h2>
          <p className="text-slate-700 leading-relaxed mb-4 whitespace-pre-wrap">{question.question}</p>
          
          {/* Diagrams */}
          <DiagramRenderer type={question.diagramType} />

          {/* Options */}
          <div className="space-y-3 mt-6">
            {question.options.map((opt, idx) => {
              let btnClass = "w-full p-4 text-left rounded-lg border transition-all duration-200 flex items-start gap-3 ";
              
              if (isAnswered) {
                if (idx === question.correctAnswer) {
                  btnClass += "bg-green-50 border-green-500 text-green-800 ring-1 ring-green-500";
                } else if (idx === selectedOption) {
                  btnClass += "bg-red-50 border-red-500 text-red-800";
                } else {
                  btnClass += "bg-slate-50 border-slate-200 text-slate-400 opacity-60";
                }
              } else {
                btnClass += "bg-white border-slate-200 text-slate-700 hover:bg-blue-50 hover:border-blue-300";
              }

              return (
                <button
                  key={idx}
                  onClick={() => !isAnswered && handleAnswer(idx)}
                  disabled={isAnswered}
                  className={btnClass}
                >
                  <div className={`mt-0.5 flex-shrink-0 w-5 h-5 rounded-full border flex items-center justify-center ${
                    isAnswered && idx === question.correctAnswer ? 'border-green-600 bg-green-600 text-white' : 
                    isAnswered && idx === selectedOption ? 'border-red-500 text-red-500' :
                    'border-slate-300 text-slate-400'
                  }`}>
                    {['ア','イ','ウ','エ'][idx]}
                  </div>
                  <span>{opt}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Feedback & Explanation Section */}
        {isAnswered && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
            {/* Result Banner */}
            <div className={`p-4 rounded-lg flex items-center gap-3 mb-4 ${isCorrect ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
              {isCorrect ? <CheckCircle className="flex-shrink-0" /> : <XCircle className="flex-shrink-0" />}
              <span className="font-bold text-lg">{isCorrect ? '正解！' : '不正解...'}</span>
            </div>

            {/* Explanation Content */}
            <div className="bg-slate-50 p-6 rounded-lg border border-slate-200 mb-6">
              <div className="flex items-center gap-2 mb-3 text-slate-500 font-bold uppercase text-xs tracking-wider">
                <AlertCircle size={14} /> 解説
              </div>
              <div className="text-slate-700">
                {question.explanation}
              </div>
              
              {/* Review Checkbox */}
              <div className="mt-6 pt-4 border-t border-slate-200">
                <label className="flex items-center gap-2 cursor-pointer select-none group">
                  <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${isMarkedReview ? 'bg-amber-400 border-amber-400 text-white' : 'bg-white border-slate-300 text-transparent group-hover:border-amber-300'}`}>
                    <Check size={14} strokeWidth={3} />
                  </div>
                  <input 
                    type="checkbox" 
                    className="hidden" 
                    checked={!!isMarkedReview} 
                    onChange={() => toggleReview(question.id)} 
                  />
                  <span className={`text-sm font-medium ${isMarkedReview ? 'text-amber-600' : 'text-slate-500 group-hover:text-amber-500'}`}>
                    あとで復習する（チェックリストに追加）
                  </span>
                </label>
              </div>
            </div>

            {/* Next Button */}
            <button
              onClick={nextQuestion}
              className="w-full py-4 bg-blue-600 text-white font-bold rounded-xl shadow-lg hover:bg-blue-700 active:transform active:scale-95 transition-all flex items-center justify-center gap-2"
            >
              {isLast ? '結果画面へ' : '次の問題へ'} <ChevronRight />
            </button>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">
      {screen === 'menu' && renderMenu()}
      {screen === 'quiz' && renderQuiz()}
    </div>
  );
}