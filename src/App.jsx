/**
 * 依存関係のインストール:
 * npm install lucide-react recharts clsx tailwind-merge
 * * ビルド対策:
 * ビルドが失敗する場合は、package.json の build スクリプトを以下のように変更してください:
 * "build": "CI=false vite build"
 */

import React, { useState, useEffect, useMemo } from 'react';
import { 
  CheckCircle, 
  XCircle, 
  Home, 
  BookOpen, 
  ArrowRight, 
  CheckSquare, 
  Square,
  Trophy,
  BarChart3,
  RefreshCw,
  AlertTriangle,
  Play,
  RotateCcw,
  Settings
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip as RechartsTooltip, 
  ResponsiveContainer,
  LineChart,
  Line
} from 'recharts';

// ==========================================
// データ定義 (3-2 & 3-3 スマート問題集)
// ==========================================

const QUIZ_DATA = [
  // --- 3-2 工場計画と開発設計 ---
  {
    id: "3-2-1",
    category: "3-2 工場計画",
    title: "工場レイアウト 1",
    question: "工場内の設備レイアウトに関する記述として、最も適切なものはどれか。",
    choices: [
      "製品別レイアウトを採用するため、複数あるNC旋盤、研磨機、塗装機をそれぞれ機械毎にまとめて配置した。",
      "製品別レイアウトは、製品の加工の「流れ」を重視したレイアウトで、ジョブショップ型と呼ばれることもある。",
      "固定式レイアウトでは、製品の移動がほとんどなく、作業員や工具が製品の周りを移動する。",
      "機能別レイアウトでは、機能の類似した製品をグループ化して共通のラインで生産する。"
    ],
    correctAnswerIndex: 2,
    explanationText: "固定式レイアウトは、船や大型機械のように製品を動かせない場合に採用され、作業員や工具が移動します。",
    detailedExplanation: [
      { status: "×", text: "機械ごとにまとめるのは「機能別レイアウト」です。" },
      { status: "×", text: "製品別レイアウトは「フローショップ型」です。「ジョブショップ型」は機能別レイアウトのことです。" },
      { status: "○", text: "固定式の定義通りです。" },
      { status: "×", text: "類似製品をグループ化するのは「グループ別レイアウト」です。" }
    ],
    diagramId: "layout-types"
  },
  {
    id: "3-2-2",
    category: "3-2 工場計画",
    title: "工場レイアウト 2",
    question: "工場内の設備レイアウトの特徴に関する記述として、最も不適切なものはどれか。",
    choices: [
      "固定式レイアウトの生産効率を高めるためには、設備レイアウトを見直すより、作業者や工具の移動のムダを減らすことが重要である。",
      "グループ別レイアウトでは、製品の生産工程が変わっても設備レイアウトを見直す必要がなく、加工経路を変えるだけで対応ができる。",
      "機能別レイアウトでは、作業員はまとまった機能単位に仕事をするため生産に熟練しやすい。",
      "グループ別レイアウトの生産効率は、製品別レイアウトより下がる傾向にある。"
    ],
    correctAnswerIndex: 1,
    explanationText: "グループ別レイアウトは専用ラインに近い形をとるため、工程が変わればレイアウトの見直しが必要になります。加工経路の変更で対応しやすいのは機能別レイアウトです。",
    diagramId: null
  },
  {
    id: "3-2-3",
    category: "3-2 工場計画",
    title: "工場レイアウト 3",
    question: "品種・生産量と工場レイアウトの関係に関する組み合わせとして、最も適切なものはどれか。",
    choices: [
      "多品種少量生産 － 製品別レイアウト",
      "多品種少量生産 － 固定式レイアウト",
      "中品種中量生産 － グループ別レイアウト",
      "少品種多量生産 － 機能別レイアウト"
    ],
    correctAnswerIndex: 2,
    explanationText: "中品種中量生産には、効率と柔軟性のバランスが良いグループ別レイアウトが適しています。",
    diagramId: "pq-layout-matrix"
  },
  {
    id: "3-2-4",
    category: "3-2 SLP",
    title: "SLPと分析手法",
    question: "工場の設備を実際にレイアウトする場合に用いられるSLPに関する分析として、最も不適切なものはどれか。",
    choices: [
      "物の流れ分析",
      "回帰分析",
      "アクティビティ相互関係分析",
      "P-Q分析"
    ],
    correctAnswerIndex: 1,
    explanationText: "回帰分析は需要予測などに使われる統計手法です。SLP（Systematic Layout Planning）の手順には含まれません。",
    diagramId: "slp-flow"
  },
  {
    id: "3-2-5",
    category: "3-2 SLP",
    title: "SLP 1",
    question: "SLPの記述として、最も不適切なものはどれか。",
    choices: [
      "SLPは、Systematic Layout Planningの略で、工場内のスペースを合理的に計画できる。",
      "SLPでは、設備や機械、材料、倉庫などの構成要素のことを、アクティビティと呼ぶ。",
      "SLPでは、最初に物の流れ分析を行い、どのような流れで製品を加工、移動するかを分析する",
      "SLPでは、最終的なレイアウト案を、スペース相互関係ダイアグラムをもとに作成する。"
    ],
    correctAnswerIndex: 2,
    explanationText: "SLPで最初に行うのは「P-Q分析」です。何を(P)どれだけ(Q)作るかを知ってから、物の流れ分析を行います。",
    diagramId: "slp-flow"
  },
  {
    id: "3-2-6",
    category: "3-2 SLP",
    title: "SLP 2",
    question: "SLPを用いて設備レイアウトを検討する際に、実施する分析や、作成する図の記述として、最も不適切なものはどれか。",
    choices: [
      "P-Q分析では、グラフの縦軸に生産量Qをとり、横軸に製品品種Pをとって、生産量が多いものから少ないものに、左から順番に並べる。",
      "アクティビティ相互関係ダイアグラムには、加工経路の情報に加え、アクティビティの配置に必要な面積の情報も含まれる。",
      "アクティビティ相互関係分析をすることで、アクティビティ間の近接性の重要度を一覧で確認することができる。",
      "アクティビティ相互関係ダイアグラムを作成する際は、線が重ならないようにアクティビティの位置関係を検討する。"
    ],
    correctAnswerIndex: 1,
    explanationText: "アクティビティ相互関係ダイアグラムは「配置」と「近接性」を示すもので、面積の情報はまだ含みません。面積を含むのは次のステップの「スペース相互関係ダイアグラム」です。",
    diagramId: null
  },
  {
    id: "3-2-7",
    category: "3-2 製品開発",
    title: "製品開発",
    question: "製品開発に関する記述として、最も不適切なものはどれか。",
    choices: [
      "製品開発とは、顧客ニーズの変化、生産者の技術向上、地球環境への対応などを動機として、新たな製品を企画し、その製品化を図る活動である。",
      "製品開発は製品企画から始まる。製品企画において、顧客ターゲットを決定し、その顧客ニーズを満たすような製品の機能や性能を検討する。",
      "製品企画を基に製品設計を行う。製品設計では、製品を目標とする品質、生産量、納期で生産するための工程や作業方法、レイアウト、生産設備などを決定する。",
      "製品設計の後に工程設計を行う。工程設計では、製品の作り方を設計する。"
    ],
    correctAnswerIndex: 2,
    explanationText: "選択肢ウの内容は「工程設計」の説明です。製品設計は製品の構造や図面を決める段階です。",
    diagramId: null
  },
  {
    id: "3-2-8",
    category: "3-2 製品設計",
    title: "製品設計",
    question: "製品設計に関する記述として、最も適切なものはどれか。",
    choices: [
      "製品設計には、機能設計と工程設計がある。",
      "機能設計は、製品の機能の面から見た設計であり、期待する性能を発揮するために必要な機能と構造を決定する活動である。",
      "工程設計では、製品の構成を表す組立図、部品の構成を表す部品図、部品の一覧である部品リストなどを作成する。",
      "生産設計では、部品の数を削減したり、組み立てしやすい構造を検討するが、生産コストを抑えるための検討は行われない。"
    ],
    correctAnswerIndex: 1,
    explanationText: "機能設計は性能・機能を実現するための設計、生産設計は作りやすさ（コストダウン）のための設計です。",
    diagramId: null
  },
  {
    id: "3-2-9",
    category: "3-2 VE",
    title: "VE 1",
    question: "VEの「価値」に関する記述として、最も不適切なものはどれか。",
    choices: [
      "VEでは、製品の「機能」と「コスト」を基に、「価値（Value）」を定義する。また、その価値は、「価値 ＝ 機能 ÷ コスト」 という式で表される。",
      "製品の機能を維持したまま、コストを下げることで、コスト的な価値を向上する方法がある。",
      "機能を下げるが、それ以上にコストを下げて、価格に対する機能の相対的な価値を向上する方法がある。",
      "コストを上げるが、それ以上に機能を上げて、価格に対する機能の相対的な価値を向上する方法がある。"
    ],
    correctAnswerIndex: 2,
    explanationText: "VEにおいて、機能を下げることは認められません（それは品質低下や別製品となります）。機能は維持または向上させることが前提です。",
    diagramId: "ve-formula"
  },
  {
    id: "3-2-10",
    category: "3-2 VE",
    title: "VE 2",
    question: "VEの「機能」に関する記述として、最も適切なものはどれか。",
    choices: [
      "使用機能とは、製品の本来の価値を果たす機能のことである。",
      "携帯電話のカラ―バリエーションは、二次機能に該当する。",
      "使用機能はさらに、基本機能・二次機能・貴重機能に分けることができる。",
      "携帯電話の基本機能を上げるために、新製品は従来品より軽くした。"
    ],
    correctAnswerIndex: 0,
    explanationText: "使用機能は製品の働きそのものを指します。カラーなどは貴重機能（魅力）です。",
    diagramId: "ve-tree"
  },
  
  // --- 3-3 生産計画と生産統制 ---
  {
    id: "3-3-1",
    category: "3-3 生産計画",
    title: "生産計画",
    question: "生産計画に関する記述として、最も適切なものはどれか。",
    choices: [
      "生産計画の役割として、納期や生産量の保証、製品品質の保証、設備稼働率の維持などがある。",
      "負荷計画では、生産能力と手持ち材料を比較し、過不足がある場合に調整を図る。",
      "生産計画を業務で分類すると、手順計画、工程設計、負荷計画、日程計画に分類できる。",
      "手順計画では、設計情報を基に、加工手順、使用設備、標準作業時間などを検討する。"
    ],
    correctAnswerIndex: 3,
    explanationText: "手順計画（工程設計）は、製品の作り方（手順、設備、時間）を決める計画です。",
    detailedExplanation: [
       {status: "×", text: "品質保証は生産計画の直接の役割ではありません。"},
       {status: "×", text: "負荷計画は「能力」と「負荷（工数）」を比較調整します。材料ではありません。"},
       {status: "×", text: "手順計画と工程設計はほぼ同義です。分類としては「手順計画」「工数計画（負荷計画）」「日程計画」です。"},
       {status: "○", text: "手順計画の正しい定義です。"}
    ],
    diagramId: null
  },
  {
    id: "3-3-2",
    category: "3-3 スケジューリング",
    title: "スケジューリング",
    question: "スケジューリングに関する記述として、最も不適切なものはどれか。",
    choices: [
      "フォワードスケジューリングとは、作業の開始時点から、順番に予定を組んでいく方法である。",
      "ジョブショップスケジューリングは、同じ専用ラインを使用して複数の製品を大量生産するのに適した方法である。",
      "バックワードスケジューリングは、予め決められた納期を守るために、作業開始日を決める方法である。",
      "プロジェクトスケジューリングでは、必要な作業を全て抽出し、それぞれの作業の開始日と完了日が分かるようにする。"
    ],
    correctAnswerIndex: 1,
    explanationText: "ジョブショップスケジューリングは、多品種少量生産（機能別レイアウト）に適した手法です。選択肢の説明はフローショップスケジューリング（少品種多量）のものです。",
    diagramId: null
  },
  {
    id: "3-3-3",
    category: "3-3 PERT",
    title: "PERT 1",
    question: "来月から開始するプロジェクトのスケジューリングをPERTで行った。ノード7の最早着手日、クリティカルパス、ノード6の最遅着手日、ノード3の最早/最遅着手日に関する記述として、最も適切なものはどれか。（※図は解説参照）",
    choices: [
      "ノード7の最早着手日は、16日である。",
      "クリティカルパスは、作業B→F→G→Jの経路である。",
      "ノード6の最遅着手日は、20日である。",
      "ノード3の最早着手日は4日、最遅着手日6日である。"
    ],
    correctAnswerIndex: 3,
    explanationText: "ノード3の最早着手日は作業B(4日)。最遅着手日は、クリティカルパス上のノード4(14日)から作業E(8日)を引いた6日となります。",
    diagramId: "pert-1"
  },
  {
    id: "3-3-4",
    category: "3-3 PERT",
    title: "PERT 2",
    question: "下表の作業A～Hで構成されるプロジェクトのPERT日程管理において、空欄Ｘ(ノード2の最遅)、Ｙ(ノード3の最遅)、及びクリティカルパスの組み合わせとして適切なものはどれか。\n(作業Hの完了が80日)",
    choices: [
      "Ｘ：50　　Ｙ：45　　クリティカルパス：A - D - G - H",
      "Ｘ：45　　Ｙ：40　　クリティカルパス：A - B - E - H",
      "Ｘ：50　　Ｙ：45　　クリティカルパス：A - C - F - H",
      "Ｘ：45　　Ｙ：40　　クリティカルパス：A - D - G - H"
    ],
    correctAnswerIndex: 0,
    explanationText: "ノード5の最遅は70日。そこからE(20)を引くとノード2の最遅X=50。F(25)を引くとノード3の最遅Y=45。クリティカルパスは余裕のない経路A-D-G-Hです。",
    diagramId: "pert-2"
  },
  {
    id: "3-3-5",
    category: "3-3 PERT",
    title: "PERT 3",
    question: "作業工程A～Eの最短完了日数はいくつか。\nA(5日,先行なし), B(2日,先行A), C(4日,先行A), D(2日,先行C), E(3日,先行B,D)",
    choices: [
      "9",
      "11",
      "14",
      "16"
    ],
    correctAnswerIndex: 2,
    explanationText: "経路は A→B→E (5+2+3=10) と A→C→D→E (5+4+2+3=14)。長い方が最短完了日数となるため、14日です。",
    diagramId: "pert-3"
  },
  {
    id: "3-3-6",
    category: "3-3 CPM",
    title: "CPM (Critical Path Method)",
    question: "CPMを適用して、最短プロジェクト遂行期間となる条件を達成したときの最小費用はいくらか。\n(標準工期: A6, B4, C5, D6 / 最短工期: A6, B3, C2, D3 / 短縮コスト: B10万, C30万, D50万 / 経路 A→B→D, A→C→D)",
    choices: [
      "220万円",
      "240万円",
      "250万円",
      "280万円"
    ],
    correctAnswerIndex: 0,
    explanationText: "最短工期で計算すると、クリティカルパスはA→B→D(6+3+3=12日)。A→C→Dは6+2+3=11日で1日余裕あり。Cは2日まで短縮可能だが1日余裕があるため3日まで短縮で良い。コスト計算：B(1日短縮10万) + C(2日短縮60万) + D(3日短縮150万) = 220万。",
    diagramId: "cpm-table"
  },
  {
    id: "3-3-7",
    category: "3-3 ジョンソン法",
    title: "ジョンソン法",
    question: "工程1(穴あけ)→工程2(塗装)のラインで、製品A(10,5), B(3,7), C(4,2), D(8,6) を生産する場合の最短終了時間は？",
    choices: [
      "50分",
      "32分",
      "28分",
      "37分"
    ],
    correctAnswerIndex: 2,
    explanationText: "ジョンソン法の手順：最短作業を探す。Cの工程2(2分)が最短→Cを最後へ。次にBの工程1(3分)→Bを最初へ。残るA(10,5)とD(8,6)でAの工程2(5分)が最短→AをCの前へ。順序は B→D→A→C。ガントチャートを描くと28分になります。",
    diagramId: "johnson-table"
  },
  {
    id: "3-3-8",
    category: "3-3 需要予測",
    title: "需要予測",
    question: "需要予測に関する記述として、最も不適切なものはどれか。",
    choices: [
      "加重移動平均法による予測で、重みをすべて同じにした場合、予測値は単純移動平均法と同一となる。",
      "単純移動平均法による予想で、ノイズを出来るだけ除去する場合には、用いるデータ数を減らせばよい。",
      "指数平滑法による予想で、直近の実績の影響を強く反映したい場合は、平滑化指数を大きくすればよい。",
      "加重平均法による予測で、過去のデータの影響を少なくしたい場合は、重みを減らせばよい。"
    ],
    correctAnswerIndex: 1,
    explanationText: "ノイズ（一時的な変動）を除去し平滑化するには、データ数（期間）を「増やす」必要があります。",
    diagramId: null
  },
  {
    id: "3-3-9",
    category: "3-3 生産統制",
    title: "生産統制",
    question: "生産統制に関する記述として、最も適切なものはどれか。",
    choices: [
      "生産統制は、大きくわけて進捗管理、現品管理、余力管理、販売管理の4つから構成される。",
      "余力管理では、製品原価や作業者の負荷状況を管理し、むだな費用の発生を防止する。",
      "進捗管理では、入荷した資材の管理や、日程計画に対する仕事の進捗状況を管理する。",
      "現品管理では、部品や仕掛品の運搬や保管状況を管理し、部品の過不足を未然に防止する。"
    ],
    correctAnswerIndex: 3,
    explanationText: "生産統制の3本柱は「進捗（納期）」「現品（モノ）」「余力（工数）」です。販売管理や原価管理は含まれません。",
    diagramId: null
  },
  {
    id: "3-3-10",
    category: "3-3 管理方式",
    title: "生産の管理方式",
    question: "生産の管理方式に関する記述として、最も適切なものはどれか。",
    choices: [
      "追番管理方式は、生産計画に対する実績の差異を容易に把握できるというメリットがある。",
      "オーダーエントリー方式では、すでに生産工程に製品があるため、顧客の個別の要求に対応するのは難しい。",
      "製番管理方式で生産された製品において、使用した部品の一部に欠陥が見つかった場合、その部品を作った時期を特定するのは難しい。",
      "生産座席予約システムでは、短納期の顧客要求に対しても、いつでも柔軟に生産の対応ができる。"
    ],
    correctAnswerIndex: 0,
    explanationText: "追番（累計番号）管理は、計画数と実績数の差が一目でわかるのが特徴です。",
    diagramId: null
  },
  {
    id: "3-3-11",
    category: "3-3 トヨタ生産方式",
    title: "トヨタ生産方式",
    question: "トヨタ生産方式に関する記述として、最も不適切なものはどれか。",
    choices: [
      "かんばんの枚数及びそこに指示される量は、生産量と同時に工程間の仕掛品の数も指示することになる。",
      "かんばんは、作業の指示をする生産指示かんばんと、運搬を表す運搬かんばんの2種類がある。",
      "プルシステムを導入して、効率的な生産を行うためには、最終組み立てラインの生産量の平準化が重要となる。",
      "JITは、必要なものを、必要な時に、必要な数だけ生産する方式で、これを実現するため、後工程引取り方式を採用している。"
    ],
    correctAnswerIndex: 1,
    explanationText: "かんばんは主に「生産指示かんばん」と「引取りかんばん（運搬ではない）」の2種類です。引取りかんばんは後工程が前工程から部品を引き取る際に使います。",
    diagramId: null
  }
];

// ==========================================
// 図解コンポーネント (HTML/Rechartsで再現)
// ==========================================

const DiagramRenderer = ({ diagramId }) => {
  switch (diagramId) {
    case "layout-types":
      return (
        <div className="bg-white p-4 rounded-lg border border-slate-200 my-4 text-sm shadow-sm">
          <h4 className="font-bold text-center mb-3 text-slate-700">◆ 工場レイアウトの基本4分類</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-slate-50 p-3 rounded border-l-4 border-blue-500">
              <div className="font-bold text-blue-700">固定式レイアウト</div>
              <div className="text-xs text-slate-500 mt-1">製品固定 / 人・工具が移動</div>
            </div>
            <div className="bg-slate-50 p-3 rounded border-l-4 border-green-500">
              <div className="font-bold text-green-700">機能別レイアウト</div>
              <div className="text-xs text-slate-500 mt-1">類似設備をまとめる (ジョブショップ)</div>
            </div>
            <div className="bg-slate-50 p-3 rounded border-l-4 border-orange-500">
              <div className="font-bold text-orange-700">製品別レイアウト</div>
              <div className="text-xs text-slate-500 mt-1">工程順に配置 (フローショップ)</div>
            </div>
            <div className="bg-slate-50 p-3 rounded border-l-4 border-purple-500">
              <div className="font-bold text-purple-700">グループ別レイアウト</div>
              <div className="text-xs text-slate-500 mt-1">類似製品をグループ化 (GT)</div>
            </div>
          </div>
        </div>
      );
    case "pq-layout-matrix":
      return (
        <div className="bg-white p-4 rounded-lg border border-slate-200 my-4 shadow-sm">
          <h4 className="font-bold text-center mb-2 text-slate-700 text-sm">◆ 品種・生産量マトリクス</h4>
          <div className="relative h-48 w-full border-l-2 border-b-2 border-slate-400 bg-slate-50 mx-auto max-w-sm">
            <div className="absolute top-2 left-4 w-20 h-10 bg-orange-100 flex items-center justify-center text-[10px] font-bold text-orange-800 border border-orange-200 rounded">
              製品別
            </div>
            <div className="absolute top-16 left-20 w-20 h-10 bg-purple-100 flex items-center justify-center text-[10px] font-bold text-purple-800 border border-purple-200 rounded">
              グループ別
            </div>
            <div className="absolute bottom-4 right-4 w-20 h-10 bg-green-100 flex items-center justify-center text-[10px] font-bold text-green-800 border border-green-200 rounded">
              機能別
            </div>
            <div className="absolute bottom-4 left-4 w-20 h-10 bg-blue-100 flex items-center justify-center text-[10px] font-bold text-blue-800 border border-blue-200 rounded">
              固定式
            </div>
            <div className="absolute -left-6 top-1/2 -rotate-90 text-xs text-slate-500">生産量</div>
            <div className="absolute bottom-[-20px] left-1/2 text-xs text-slate-500">品種数</div>
          </div>
        </div>
      );
    case "slp-flow":
      return (
        <div className="bg-white p-4 rounded-lg border border-slate-200 my-4 shadow-sm text-sm">
          <h4 className="font-bold text-center mb-3 text-slate-700">◆ SLPの手順</h4>
          <div className="flex flex-col items-center gap-2">
            <div className="bg-blue-50 px-4 py-2 rounded border border-blue-200 w-full text-center">P-Q分析</div>
            <ArrowRight className="rotate-90 text-slate-400" size={16} />
            <div className="flex w-full gap-2">
              <div className="bg-slate-50 p-2 rounded border border-slate-200 flex-1 text-center text-xs">物の流れ分析</div>
              <div className="bg-slate-50 p-2 rounded border border-slate-200 flex-1 text-center text-xs">アクティビティ<br/>相互関係分析</div>
            </div>
            <ArrowRight className="rotate-90 text-slate-400" size={16} />
            <div className="bg-green-50 px-4 py-2 rounded border border-green-200 w-full text-center">ダイアグラム作成</div>
          </div>
        </div>
      );
    case "ve-tree":
      return (
        <div className="bg-white p-4 rounded-lg border border-slate-200 my-4 shadow-sm text-sm overflow-x-auto">
          <h4 className="font-bold text-center mb-3 text-slate-700">◆ 機能の分類</h4>
          <div className="flex items-center justify-center min-w-max">
            <div className="border p-2 rounded bg-slate-100 font-bold">機能</div>
            <div className="w-4 h-px bg-slate-400"></div>
            <div className="flex flex-col gap-4 border-l border-slate-400 pl-4 py-2">
              <div className="flex items-center">
                <div className="border p-2 rounded bg-blue-50 text-blue-800 font-bold w-20 text-center">使用機能</div>
                <div className="w-4 h-px bg-slate-400"></div>
                <div className="flex flex-col gap-2 border-l border-slate-400 pl-4">
                   <span className="text-xs bg-white border p-1 rounded">基本機能</span>
                   <span className="text-xs bg-white border p-1 rounded">二次機能</span>
                </div>
              </div>
              <div className="flex items-center">
                <div className="border p-2 rounded bg-pink-50 text-pink-800 font-bold w-20 text-center">貴重機能</div>
              </div>
            </div>
          </div>
        </div>
      );
    case "pert-1":
    case "pert-2":
    case "pert-3":
      // Simplified Network Diagram using HTML/CSS
      return (
        <div className="bg-white p-4 rounded-lg border border-slate-200 my-4 shadow-sm overflow-x-auto">
          <h4 className="font-bold text-center mb-3 text-slate-700">◆ ネットワーク図 (イメージ)</h4>
          <div className="flex items-center justify-center gap-2 min-w-max p-4">
             {/* Simple visual representation for nodes */}
             <div className="flex flex-col items-center">
               <div className="w-8 h-8 rounded-full border-2 border-slate-800 flex items-center justify-center bg-white font-bold">1</div>
             </div>
             <div className="h-px w-8 bg-slate-800 relative"><span className="absolute -top-4 left-2 text-xs">A</span></div>
             <div className="flex flex-col items-center">
               <div className="w-8 h-8 rounded-full border-2 border-slate-800 flex items-center justify-center bg-white font-bold">2</div>
             </div>
             <div className="h-px w-8 bg-slate-800 relative"><span className="absolute -top-4 left-2 text-xs">B</span></div>
             <div className="flex flex-col items-center">
               <div className="w-8 h-8 rounded-full border-2 border-slate-800 flex items-center justify-center bg-white font-bold">...</div>
             </div>
             <div className="h-px w-8 bg-slate-800 relative"><span className="absolute -top-4 left-2 text-xs">→</span></div>
             <div className="flex flex-col items-center">
               <div className="w-8 h-8 rounded-full border-2 border-red-500 flex items-center justify-center bg-white font-bold text-red-500">End</div>
             </div>
          </div>
          <p className="text-xs text-center text-slate-500 mt-2">※正確なネットワーク図は設問の図を参照</p>
        </div>
      );
    case "johnson-table":
      return (
        <div className="bg-white p-4 rounded-lg border border-slate-200 my-4 shadow-sm text-sm">
          <h4 className="font-bold text-center mb-3 text-slate-700">◆ ジョンソン法の表</h4>
          <table className="w-full text-center border-collapse">
            <thead>
              <tr className="bg-slate-100">
                <th className="border p-1">製品</th>
                <th className="border p-1">工程1</th>
                <th className="border p-1">工程2</th>
              </tr>
            </thead>
            <tbody>
              <tr><td className="border p-1">A</td><td className="border p-1">10</td><td className="border p-1">5</td></tr>
              <tr><td className="border p-1">B</td><td className="border p-1">3</td><td className="border p-1">7</td></tr>
              <tr><td className="border p-1">C</td><td className="border p-1">4</td><td className="border p-1 font-bold text-red-500">2 (1st)</td></tr>
              <tr><td className="border p-1">D</td><td className="border p-1">8</td><td className="border p-1">6</td></tr>
            </tbody>
          </table>
          <div className="mt-2 text-xs text-slate-500">
            最小値: Cの2(後)→最後。次にBの3(前)→最初...
          </div>
        </div>
      );
    default:
      return null;
  }
};

// ==========================================
// メインコンポーネント
// ==========================================

export default function App() {
  const [appState, setAppState] = useState('home'); // 'home', 'quiz', 'result'
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedChoice, setSelectedChoice] = useState(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [history, setHistory] = useState({});
  const [activeQuestions, setActiveQuestions] = useState([]);

  // 初期ロード
  useEffect(() => {
    const savedHistory = localStorage.getItem('factory_quiz_history_full');
    if (savedHistory) {
      try {
        setHistory(JSON.parse(savedHistory));
      } catch (e) {
        console.error("Failed to parse history", e);
      }
    }
  }, []);

  // 履歴保存
  useEffect(() => {
    localStorage.setItem('factory_quiz_history_full', JSON.stringify(history));
  }, [history]);

  // --- ヘルパー関数 ---

  const startQuiz = (mode) => {
    let filtered = [];
    if (mode === 'all') {
      filtered = QUIZ_DATA;
    } else if (mode === 'incorrect') {
      filtered = QUIZ_DATA.filter(q => history[q.id] && !history[q.id].isCorrect);
    } else if (mode === 'review') {
      filtered = QUIZ_DATA.filter(q => history[q.id] && history[q.id].needsReview);
    }

    if (filtered.length === 0) return;

    setActiveQuestions(filtered);
    setCurrentQuestionIndex(0);
    setAppState('quiz');
    resetQuestionState();
  };

  const resetQuestionState = () => {
    setSelectedChoice(null);
    setIsAnswered(false);
    setIsCorrect(false);
  };

  const handleAnswer = (choiceIndex) => {
    if (isAnswered) return;
    
    const currentQ = activeQuestions[currentQuestionIndex];
    if (!currentQ) return;

    const correct = choiceIndex === currentQ.correctAnswerIndex;
    setSelectedChoice(choiceIndex);
    setIsCorrect(correct);
    setIsAnswered(true);

    setHistory(prev => ({
      ...prev,
      [currentQ.id]: {
        ...prev[currentQ.id],
        isCorrect: correct,
        lastAnsweredAt: new Date().toISOString(),
        userChoiceIndex: choiceIndex,
        needsReview: prev[currentQ.id]?.needsReview || false
      }
    }));
  };

  const toggleReview = (qId) => {
    setHistory(prev => ({
      ...prev,
      [qId]: {
        ...prev[qId],
        needsReview: !prev[qId]?.needsReview
      }
    }));
  };

  const nextQuestion = () => {
    if (currentQuestionIndex < activeQuestions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      resetQuestionState();
    } else {
      setAppState('result');
    }
  };

  // --- Views ---

  const HomeView = () => {
    const totalAnswered = Object.keys(history).length;
    const totalCorrect = Object.values(history).filter(h => h.isCorrect).length;
    const totalReview = Object.values(history).filter(h => h.needsReview).length;
    const incorrectCount = QUIZ_DATA.filter(q => history[q.id] && !history[q.id].isCorrect).length;
    const progress = Math.round((totalAnswered / QUIZ_DATA.length) * 100);

    return (
      <div className="max-w-md mx-auto p-4 pb-20 space-y-6 animate-in fade-in duration-500">
        <header className="pt-8 pb-4">
          <div className="flex items-center gap-3">
             <div className="bg-blue-600 p-2.5 rounded-xl shadow-lg shadow-blue-200">
               <BookOpen className="text-white" size={24} />
             </div>
             <div>
               <h1 className="text-2xl font-bold text-slate-800 leading-tight">工場・生産計画</h1>
               <p className="text-xs text-slate-500 font-medium">Smart Problem Set 3-2, 3-3</p>
             </div>
          </div>
        </header>

        {/* Dashboard Card */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
          <div className="flex justify-between items-center mb-6">
            <h2 className="font-bold text-slate-700 flex items-center gap-2 text-sm">
              <BarChart3 size={18} className="text-slate-400" /> 学習ステータス
            </h2>
            <span className="bg-slate-100 text-slate-500 text-xs font-bold px-2 py-1 rounded-full">
              全{QUIZ_DATA.length}問
            </span>
          </div>
          
          <div className="grid grid-cols-3 gap-4 text-center">
            <div className="space-y-1">
              <div className="text-2xl font-bold text-slate-800">{totalAnswered}</div>
              <div className="text-[10px] text-slate-400 font-medium">回答済み</div>
            </div>
            <div className="space-y-1 relative">
              <div className="text-2xl font-bold text-green-600">{totalCorrect}</div>
              <div className="text-[10px] text-slate-400 font-medium">正解数</div>
            </div>
            <div className="space-y-1">
              <div className="text-2xl font-bold text-orange-500">{totalReview}</div>
              <div className="text-[10px] text-slate-400 font-medium">要復習</div>
            </div>
          </div>

          <div className="mt-6">
            <div className="flex justify-between text-[10px] text-slate-400 mb-1.5 font-medium">
              <span>進捗率</span>
              <span>{progress}%</span>
            </div>
            <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden">
              <div 
                className="h-full bg-blue-500 transition-all duration-1000 ease-out"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          <div className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">演習モード</div>
          
          <button 
            onClick={() => startQuiz('all')}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-xl shadow-md transition-all flex items-center justify-between group active:scale-[0.98]"
          >
            <div className="flex items-center gap-4">
              <div className="bg-white/20 p-2.5 rounded-lg">
                <Play className="text-white fill-current" size={20} />
              </div>
              <div className="text-left">
                <div className="font-bold">全問スタート</div>
                <div className="text-xs text-blue-100 opacity-90">順番に出題</div>
              </div>
            </div>
            <ArrowRight className="opacity-60 group-hover:translate-x-1 transition-transform" />
          </button>

          <div className="grid grid-cols-2 gap-3">
            <button 
              onClick={() => startQuiz('incorrect')}
              disabled={incorrectCount === 0}
              className={`p-4 rounded-xl font-bold text-left shadow-sm transition-all border flex flex-col justify-between h-32 active:scale-[0.98] ${
                incorrectCount > 0 
                ? 'bg-white border-red-100 text-slate-700 hover:border-red-300' 
                : 'bg-slate-50 border-slate-100 text-slate-300 cursor-not-allowed'
              }`}
            >
              <div className={`p-2 rounded-lg w-fit ${incorrectCount > 0 ? 'bg-red-50 text-red-500' : 'bg-slate-100'}`}>
                <AlertTriangle size={20} />
              </div>
              <div>
                <div className="text-sm">前回不正解</div>
                <div className={`text-xs mt-0.5 ${incorrectCount > 0 ? 'text-red-500' : 'text-slate-400'}`}>
                  {incorrectCount}問 対象
                </div>
              </div>
            </button>

            <button 
              onClick={() => startQuiz('review')}
              disabled={totalReview === 0}
              className={`p-4 rounded-xl font-bold text-left shadow-sm transition-all border flex flex-col justify-between h-32 active:scale-[0.98] ${
                totalReview > 0 
                ? 'bg-white border-orange-100 text-slate-700 hover:border-orange-300' 
                : 'bg-slate-50 border-slate-100 text-slate-300 cursor-not-allowed'
              }`}
            >
              <div className={`p-2 rounded-lg w-fit ${totalReview > 0 ? 'bg-orange-50 text-orange-500' : 'bg-slate-100'}`}>
                <CheckSquare size={20} />
              </div>
              <div>
                <div className="text-sm">要復習のみ</div>
                <div className={`text-xs mt-0.5 ${totalReview > 0 ? 'text-orange-500' : 'text-slate-400'}`}>
                  {totalReview}問 対象
                </div>
              </div>
            </button>
          </div>
        </div>

        {/* Previous Results List (Shown only if history exists) */}
        {totalAnswered > 0 && (
          <div className="mt-8 pt-6 border-t border-slate-200">
             <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2">
               <RefreshCw size={12} /> 前回の結果一覧
             </h3>
             <div className="bg-white rounded-xl border border-slate-200 overflow-hidden divide-y divide-slate-50 max-h-64 overflow-y-auto">
               {QUIZ_DATA.map((q) => {
                 const h = history[q.id];
                 if (!h) return null;
                 return (
                   <div key={q.id} className="p-3 flex items-center justify-between hover:bg-slate-50 transition-colors">
                      <div className="flex items-center gap-3 overflow-hidden">
                        {h.isCorrect 
                          ? <CheckCircle size={16} className="text-green-500 flex-shrink-0" />
                          : <XCircle size={16} className="text-red-500 flex-shrink-0" />
                        }
                        <div className="truncate">
                          <div className="text-[10px] text-slate-400 mb-0.5">{q.category}</div>
                          <div className="text-xs font-medium text-slate-700 truncate">{q.title}</div>
                        </div>
                      </div>
                      {h.needsReview && (
                        <span className="text-[10px] bg-orange-50 text-orange-600 px-2 py-0.5 rounded font-bold border border-orange-100 flex-shrink-0">
                          復習
                        </span>
                      )}
                   </div>
                 );
               })}
             </div>
          </div>
        )}
      </div>
    );
  };

  const QuizView = () => {
    const currentQ = activeQuestions[currentQuestionIndex];
    if (!currentQ) return <div>Loading...</div>;
    const needsReview = history[currentQ.id]?.needsReview || false;

    return (
      <div className="min-h-screen bg-slate-50 flex flex-col">
        {/* Header */}
        <div className="bg-white px-4 py-3 shadow-sm sticky top-0 z-20">
          <div className="max-w-2xl mx-auto flex items-center justify-between">
            <button 
              onClick={() => { if(window.confirm('中断してホームに戻りますか？')) setAppState('home'); }} 
              className="p-2 -ml-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition-colors"
            >
              <Home size={20} />
            </button>
            <div className="flex-1 mx-4">
              <div className="flex justify-between text-[10px] text-slate-400 mb-1.5 font-medium">
                <span>Q {currentQuestionIndex + 1}</span>
                <span>{activeQuestions.length}</span>
              </div>
              <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-blue-500 transition-all duration-500 ease-out"
                  style={{ width: `${((currentQuestionIndex + 1) / activeQuestions.length) * 100}%` }}
                />
              </div>
            </div>
            <div className="text-[10px] font-bold bg-slate-100 text-slate-500 px-2 py-1 rounded">
               {currentQ.id}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 pb-32">
          <div className="max-w-2xl mx-auto space-y-6">
            
            {/* Question Card */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
              <div className="mb-6">
                <span className="inline-block px-2.5 py-1 bg-blue-50 text-blue-700 text-[10px] font-bold rounded-md mb-3 border border-blue-100">
                  {currentQ.category}
                </span>
                <h2 className="text-lg font-bold text-slate-800 leading-relaxed">
                  {currentQ.question}
                </h2>
              </div>

              <div className="space-y-3">
                {currentQ.choices.map((choice, idx) => {
                  let buttonStyle = "border-slate-200 hover:bg-slate-50 hover:border-blue-300 text-slate-700 shadow-sm";
                  if (isAnswered) {
                    if (idx === currentQ.correctAnswerIndex) {
                      buttonStyle = "bg-green-50 border-green-500 text-green-800 font-bold ring-1 ring-green-500 shadow-none";
                    } else if (idx === selectedChoice) {
                      buttonStyle = "bg-red-50 border-red-500 text-red-800 opacity-60 shadow-none";
                    } else {
                      buttonStyle = "border-slate-100 text-slate-300 opacity-50 bg-slate-50 shadow-none";
                    }
                  } else if (selectedChoice === idx) {
                    buttonStyle = "bg-blue-50 border-blue-500 text-blue-800 ring-1 ring-blue-500";
                  }

                  return (
                    <button
                      key={idx}
                      onClick={() => handleAnswer(idx)}
                      disabled={isAnswered}
                      className={`w-full p-4 rounded-xl border-2 text-left transition-all text-sm leading-relaxed relative group ${buttonStyle}`}
                    >
                      <div className="flex gap-3">
                         <div className={`flex-shrink-0 w-6 h-6 rounded flex items-center justify-center text-xs font-bold ${isAnswered && idx === currentQ.correctAnswerIndex ? 'bg-green-200 text-green-800' : 'bg-slate-100 text-slate-500'}`}>
                           {['ア','イ','ウ','エ'][idx]}
                         </div>
                         <div>{choice}</div>
                      </div>
                      {isAnswered && idx === currentQ.correctAnswerIndex && (
                        <CheckCircle className="absolute right-4 top-1/2 -translate-y-1/2 text-green-600 animate-in zoom-in" size={20} />
                      )}
                      {isAnswered && idx === selectedChoice && idx !== currentQ.correctAnswerIndex && (
                        <XCircle className="absolute right-4 top-1/2 -translate-y-1/2 text-red-500 animate-in zoom-in" size={20} />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Explanation */}
            {isAnswered && (
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 animate-in slide-in-from-bottom-4 fade-in duration-500 ring-1 ring-slate-200/50">
                <div className="flex items-center justify-between mb-4 border-b border-slate-100 pb-4">
                  <div className={`flex items-center gap-2 text-lg font-bold ${isCorrect ? 'text-green-600' : 'text-red-500'}`}>
                    {isCorrect 
                      ? <CheckCircle className="fill-current text-white bg-green-500 rounded-full" /> 
                      : <XCircle className="fill-current text-white bg-red-500 rounded-full" />
                    }
                    <span>{isCorrect ? '正解！' : '不正解...'}</span>
                  </div>
                  
                  <button 
                    onClick={() => toggleReview(currentQ.id)}
                    className={`flex items-center gap-2 text-xs px-3 py-2 rounded-full transition-colors border font-bold ${
                      needsReview 
                      ? 'bg-orange-50 border-orange-200 text-orange-600' 
                      : 'bg-white border-slate-200 text-slate-400 hover:bg-slate-50'
                    }`}
                  >
                    {needsReview ? <CheckSquare size={16} className="text-orange-500"/> : <Square size={16}/>}
                    要復習
                  </button>
                </div>

                <div className="prose prose-sm max-w-none text-slate-700">
                  <h3 className="text-sm font-bold text-slate-900 mb-2 flex items-center gap-2">
                    <span className="w-1 h-4 bg-blue-500 rounded-full"></span>
                    解説
                  </h3>
                  <p className="mb-6 text-sm leading-relaxed bg-slate-50 p-3 rounded-lg border border-slate-100">
                    {currentQ.explanationText}
                  </p>
                  
                  {currentQ.diagramId && <DiagramRenderer diagramId={currentQ.diagramId} />}

                  {currentQ.detailedExplanation && (
                    <div className="space-y-2 mt-6">
                      <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">選択肢の詳細</h4>
                      {currentQ.detailedExplanation.map((exp, idx) => (
                        <div key={idx} className="flex gap-3 text-sm bg-white p-2.5 rounded border border-slate-100">
                          <span className={`font-bold flex-shrink-0 ${exp.status === '○' ? 'text-green-600' : exp.status === '×' ? 'text-red-500' : 'text-slate-600'}`}>
                            {exp.status}
                          </span>
                          <span className="text-slate-600">{exp.text}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer Nav */}
        {isAnswered && (
          <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-slate-200 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] z-30">
            <div className="max-w-2xl mx-auto">
              <button
                onClick={nextQuestion}
                className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-4 rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 active:scale-[0.98]"
              >
                <span>{currentQuestionIndex < activeQuestions.length - 1 ? '次の問題へ' : '結果を見る'}</span>
                <ArrowRight size={18} />
              </button>
            </div>
          </div>
        )}
      </div>
    );
  };

  const ResultView = () => {
    const correctCount = activeQuestions.filter(q => history[q.id]?.isCorrect).length;
    const score = Math.round((correctCount / activeQuestions.length) * 100);

    return (
      <div className="min-h-screen bg-slate-50 p-4 flex items-center justify-center">
        <div className="w-full max-w-md space-y-6">
          <div className="bg-white rounded-3xl shadow-xl border border-slate-100 p-8 text-center space-y-6">
            <div className="inline-flex p-4 bg-yellow-50 text-yellow-500 rounded-full ring-8 ring-yellow-50/50">
              <Trophy size={40} className="animate-bounce" />
            </div>
            
            <div>
              <h2 className="text-2xl font-bold text-slate-800">Complete!</h2>
              <div className="py-4">
                <div className="text-6xl font-black text-slate-900 tracking-tight">
                  {score}<span className="text-2xl font-bold text-slate-300 ml-1">点</span>
                </div>
                <p className="text-slate-500 font-medium mt-2">
                  {activeQuestions.length}問中 {correctCount}問 正解
                </p>
              </div>
            </div>

            <div className="bg-slate-50 rounded-xl p-4 text-left max-h-60 overflow-y-auto border border-slate-100">
               <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-3 sticky top-0 bg-slate-50 pb-2 border-b border-slate-200">
                 今回の結果詳細
               </h3>
               <div className="space-y-2">
                 {activeQuestions.map((q, idx) => {
                   const h = history[q.id];
                   return (
                     <div key={idx} className="flex items-center justify-between text-sm group">
                        <div className="flex items-center gap-3 truncate">
                           <span className={`font-mono text-xs w-6 ${h?.isCorrect ? 'text-green-500' : 'text-red-500'}`}>Q{idx+1}</span>
                           <span className="truncate text-slate-600 group-hover:text-slate-900 transition-colors">{q.title}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          {h?.isCorrect 
                             ? <CheckCircle size={14} className="text-green-500" />
                             : <XCircle size={14} className="text-red-500" />
                          }
                        </div>
                     </div>
                   );
                 })}
               </div>
            </div>
          </div>

          <button
            onClick={() => setAppState('home')}
            className="w-full bg-slate-900 text-white font-bold py-4 rounded-xl shadow-lg hover:bg-slate-800 transition-all flex items-center justify-center gap-2 active:scale-[0.98]"
          >
            <RotateCcw size={18} />
            ホームに戻る
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="font-sans text-slate-900 bg-slate-50 min-h-screen selection:bg-blue-100">
      {appState === 'home' && <HomeView />}
      {appState === 'quiz' && <QuizView />}
      {appState === 'result' && <ResultView />}
    </div>
  );
}