// npm install lucide-react recharts firebase
import React, { useState, useEffect } from 'react';
import { initializeApp } from 'firebase/app';
import { getAuth, signInAnonymously } from 'firebase/auth';
import { getFirestore, doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { Check, X, Home, BookOpen, RotateCcw, Award, Save, RefreshCw, ChevronRight, List } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

// --- Firebase Configuration ---
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

const APP_ID = "ProductionManagement_QuizApp_3_3";

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

// --- Static Quiz Data ---
const quizData = [
  {
    id: 1,
    title: "問題 1 生産計画",
    meta: "中小企業診断士 過去問類題 / 生産管理",
    question: "生産計画に関する記述として、最も適切なものはどれか。",
    options: [
      { key: "ア", text: "生産計画の役割として、納期や生産量の保証、製品品質の保証、設備稼働率の維持などがある。" },
      { key: "イ", text: "負荷計画では、生産能力と手持ち材料を比較し、過不足がある場合に調整を図る。" },
      { key: "ウ", text: "生産計画を業務で分類すると、手順計画、工程設計、負荷計画、日程計画に分類できる。" },
      { key: "エ", text: "手順計画では、設計情報を基に、加工手順、使用設備、標準作業時間などを検討する。" }
    ],
    answer: "エ",
    explanation: (
      <div className="space-y-4">
        <p className="font-bold text-emerald-600">正解：エ</p>
        <div className="bg-gray-50 p-4 rounded-md border border-gray-200">
          <p className="font-bold text-sm text-gray-700 mb-2">💡 ここが重要</p>
          <p className="text-sm text-gray-600">本問では生産計画の役割や分類について問われています。生産計画は、製品の生産量と生産時期を決定する活動です。作成することで納期・生産量の保証、稼働率の維持、資材調達や人員手配を効率化します。</p>
        </div>
        <div className="space-y-2">
          <h4 className="font-bold text-sm text-gray-800">● 業務別の分類と手順（①→②→③の順に進行）</h4>
          <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
            <li><strong className="text-gray-800">①手順計画（工程設計）：</strong>製品の作り方を決定（加工手順、必要設備、標準工数など）。</li>
            <li><strong className="text-gray-800">②工数計画（負荷計画）：</strong>必要な人員数と設備使用時間を算定し、生産能力と比較・調整。</li>
            <li><strong className="text-gray-800">③日程計画：</strong>各作業の開始と完了日を計画。</li>
          </ul>
        </div>
        <div className="space-y-2">
          <h4 className="font-bold text-sm text-gray-800">● 期間別の分類</h4>
          <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
            <li><strong>大日程計画：</strong>年単位の長期計画。調達に時間がかかるリソースの計画。</li>
            <li><strong>中日程計画：</strong>月次の計画。製品・時期・数量をほぼ確定し資材や人員手配。</li>
            <li><strong>小日程計画：</strong>週や日単位の計画。人や機械への具体的な作業割り当て。</li>
          </ul>
        </div>
        <div className="border-t pt-2 text-xs text-gray-500 space-y-1">
          <p><strong>ア ×：</strong>製品品質の保証は生産計画の目的には含まれません。</p>
          <p><strong>イ ×：</strong>負荷計画で比較調整するのは、生産に必要な「工数」であり、手持ち材料ではありません。</p>
          <p><strong>ウ ×：</strong>手順計画の別名が工程設計です。業務分類は手順計画、負荷計画、日程計画の3種類です。</p>
        </div>
      </div>
    )
  },
  {
    id: 2,
    title: "問題 2 スケジューリング",
    meta: "中小企業診断士 過去問類題 / 生産管理",
    question: "スケジューリングに関する記述として、最も不適切なものはどれか。",
    options: [
      { key: "ア", text: "フォワードスケジューリングとは、作業の開始時点から、順番に予定を組んでいく方法である。" },
      { key: "イ", text: "ジョブショップスケジューリングは、同じ専用ラインを使用して複数の製品を大量生産するのに適した方法である。" },
      { key: "ウ", text: "バックワードスケジューリングは、予め決められた納期を守るために、作業開始日を決める方法である。" },
      { key: "エ", text: "プロジェクトスケジューリングでは、必要な作業を全て抽出し、それぞれの作業の開始日と完了日が分かるようにする。" }
    ],
    answer: "イ",
    explanation: (
      <div className="space-y-4">
        <p className="font-bold text-emerald-600">正解：イ（不適切）</p>
        <div className="bg-gray-50 p-4 rounded-md border border-gray-200">
          <p className="font-bold text-sm text-gray-700 mb-2">💡 ここが重要</p>
          <p className="text-sm text-gray-600">日程計画において各工程に作業を割り当て、開始・終了時期を決めることをスケジューリングと呼びます。</p>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full text-xs text-left border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-100">
                <th className="border border-gray-300 p-2">手法</th>
                <th className="border border-gray-300 p-2">概要</th>
                <th className="border border-gray-300 p-2">適用される生産形態</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-gray-300 p-2 font-bold">プロジェクト</td>
                <td className="border border-gray-300 p-2">全体日程をネットワーク等で管理</td>
                <td className="border border-gray-300 p-2">個別生産</td>
              </tr>
              <tr>
                <td className="border border-gray-300 p-2 font-bold">ジョブショップ</td>
                <td className="border border-gray-300 p-2">作業や機械の順番を最適化</td>
                <td className="border border-gray-300 p-2">多品種少量生産（機能別レイアウト）</td>
              </tr>
              <tr>
                <td className="border border-gray-300 p-2 font-bold">フローショップ</td>
                <td className="border border-gray-300 p-2">同一ラインで機械使用時期を最適割当</td>
                <td className="border border-gray-300 p-2">少種多量生産（製品別レイアウト）</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className="border-t pt-2 text-xs text-gray-500 space-y-1">
          <p><strong>ア ○：</strong>記述の通り。納期は後から決定します。</p>
          <p><strong>イ ×：</strong>選択肢の内容は「フローショップスケジューリング」の説明です。ジョブショップは多品種少量・機能別レイアウトに適します。</p>
          <p><strong>ウ ○：</strong>記述の通り。納期を基準に逆算して開始日を決めます。</p>
          <p><strong>エ ○：</strong>記述の通り。PERTやガントチャートを用います。</p>
        </div>
      </div>
    )
  },
  {
    id: 3,
    title: "問題 3 PERT1",
    meta: "中小企業診断士 過去問類題 / アローダイアグラム計算",
    question: "来月から開始するプロジェクトのスケジューリングをPERTで行った。図の各作業にかかる日数（A:8日, B:4日, C:5日, D:6日, E:8日, F:9日, G:7日, H:12日, I:3日, J:3日）から算出した場合、最も適切な記述はどれか。\n※結合関係：(1→2:A), (1→3:B), (1→6:C), (2→4:D), (3→4:E), (3→5:F), (4→7:H), (5→7:I), (5→6:G), (6→7:J)",
    options: [
      { key: "ア", text: "ノード7の最早着手日は、16日である。" },
      { key: "イ", text: "クリティカルパスは、作業B→F→G→Jの経路である。" },
      { key: "ウ", text: "ノード6の最遅着手日は、20日である。" },
      { key: "エ", text: "ノード3の最早着手日は4日、最遅着手日6日である。" }
    ],
    answer: "エ",
    explanation: (
      <div className="space-y-4">
        <p className="font-bold text-emerald-600">正解：エ</p>
        <div className="bg-gray-50 p-4 rounded-md border border-gray-200 text-xs text-gray-600 space-y-2">
          <p className="font-bold text-sm text-gray-700">各ノードの計算結果：</p>
          <p>・[ノード1] 最早:0 / 最遅:0</p>
          <p>・[ノード2] 最早:8 (1+A) / 最遅:14 (4-D)</p>
          <p>・[ノード3] 最早:4 (1+B) / 最遅:6 (4-Eの14-8=6)</p>
          <p>・[ノード4] 最早:14 (経路1→2→4が14、1→3→4が12。最大値を選択) / 最遅:14 (7-H)</p>
          <p>・[ノード5] 最早:13 (1→3→5) / 最遅:16 (経路5→7の26-3=23、5→6→7の23-7=16。最小値を選択)</p>
          <p>・[ノード6] 最早:20 (1→3→5→6が20、1→6が5。最大値を選択) / 最遅:23 (7-J)</p>
          <p>・[ノード7] 最早:26 (1→2→4→7が26、1→3→5→7が16、1→3→5→6→7が23。最大値を選択) / 最遅:26</p>
        </div>
        <p className="text-sm font-bold text-red-600">★ クリティカルパス：1 → 2 → 4 → 7（作業A → D → H = 計26日）</p>
        <div className="border-t pt-2 text-xs text-gray-500 space-y-1">
          <p><strong>ア ×：</strong>ノード7の最早着手日は26日です。</p>
          <p><strong>イ ×：</strong>クリティカルパスは A→D→H です。</p>
          <p><strong>ウ ×：</strong>ノード6の最遅着手日は 23日 (26 - J:3) です。</p>
          <p><strong>エ ○：</strong>ノード3の最早は4日、最遅は6日となり適切です。</p>
        </div>
      </div>
    )
  },
  {
    id: 4,
    title: "問題 4 PERT2",
    meta: "中小企業診断士 過去問類題 / ダミー作業",
    question: "下表に示される作業A～Hで構成されるプロジェクトにおいて、空欄Ｘ（ノード2の最遅着手日）、Ｙ（ノード3の最遅着手日）に入る数値、及びクリティカルパスの最も適切な組み合わせを選べ。\n先行関係：A(20)の後B(25),C(15),D(30)へ。Bの後E(20)へ。Cの後F(25)へ。B,C,Dの結合点(ノード4)からG(20)へ。E,F,Gの結合点(ノード5)からH(10)へ。最終ノード6(最早/最遅=80)。※ノード4の最早/最遅=50, ノード5の最早/最遅=70",
    options: [
      { key: "ア", text: "Ｘ：50　Ｙ：45　クリティカルパス：A - D - G - H" },
      { key: "イ", text: "Ｘ：45　Ｙ：40　クリティカルパス：A - B - E - H" },
      { key: "ウ", text: "Ｘ：50　Ｙ：45　クリティカルパス：A - C - F - H" },
      { key: "エ", text: "Ｘ：45　Ｙ：40　クリティカルパス：A - D - G - H" }
    ],
    answer: "ア",
    explanation: (
      <div className="space-y-4">
        <p className="font-bold text-emerald-600">正解：ア</p>
        <div className="bg-gray-50 p-4 rounded-md border border-gray-200 text-sm text-gray-600 space-y-2">
          <p><strong>最遅着手日の計算（後ろから逆算）：</strong></p>
          <p>・<strong className="text-gray-800">空欄Ｘ（ノード2）：</strong>後続工程E（日数20）がノード5（最遅70）に向かうため、70 － 20 ＝ <span className="font-bold text-red-600 text-base">50</span>。</p>
          <p>・<strong className="text-gray-800">空欄Ｙ（ノード3）：</strong>後続工程F（日数25）がノード5（最遅70）に向かうため、70 － 25 ＝ <span className="font-bold text-red-600 text-base">45</span>。</p>
          <p>・<strong className="text-gray-800">クリティカルパス：</strong> 各ノードで最早着手日と最遅着手日が一致する経路を追うと、0(0) → 1(20) → 4(50) → 5(70) → 6(80) となり、対応する作業は <span className="font-bold text-emerald-600">A - D - G - H</span> となります。</p>
        </div>
      </div>
    )
  },
  {
    id: 5,
    title: "問題 5 PERT3",
    meta: "中小企業診断士 過去問類題",
    question: "あるジョブは５つの作業工程A～Eで構成されている。各作業工程の作業日数と作業工程間の先行関係が下表に示されるとき、このジョブの最短完了日数の値として、最も適切なものはどれか。\n【A:5日(なし), B:2日(A), C:4日(A), D:2日(C), E:3日(B,D)】",
    options: [
      { key: "ア", text: "9" },
      { key: "イ", text: "11" },
      { key: "ウ", text: "14" },
      { key: "エ", text: "16" }
    ],
    answer: "ウ",
    explanation: (
      <div className="space-y-4">
        <p className="font-bold text-emerald-600">正解：ウ</p>
        <div className="bg-gray-50 p-4 rounded-md border border-gray-200 text-sm text-gray-600 space-y-2">
          <p className="font-bold">【アローダイアグラムの経路分析】</p>
          <p>プロジェクトの開始から終了までの全経路の長さを算出します：</p>
          <ul className="list-disc list-inside space-y-1">
            <li>経路①：A → B → E ＝ 5 + 2 + 3 ＝ 10日</li>
            <li>経路②：A → C → D → E ＝ 5 + 4 + 2 + 3 ＝ <span className="font-bold text-red-600">14日</span></li>
          </ul>
          <p>最長経路（ボトルネック）が全体の最短完了日数となるため、正解は <span className="font-bold">14（ウ）</span> となります。クリティカルパスは A→C→D→E です。</p>
        </div>
      </div>
    )
  },
  {
    id: 6,
    title: "問題 6 CPM（Critical Path Method）",
    meta: "中小企業診断士 過去問類題 / 費用急縮計算",
    question: "下表は、あるプロジェクト業務を構成する各作業の要件を示している。CPMを適用して、最短プロジェクト遂行期間となる条件を達成したときの最小費用（追加費用を含む短縮総額）を選べ。\n・A: 所要6日 / 最短6日 / 短縮費用 -\n・B: 所要4日 / 最短3日 / 短縮費用 10万円/日\n・C: 所要5日 / 最短2日 / 短縮費用 30万円/日\n・D: 先行(B,C) / 所要6日 / 最短3日 / 短縮費用 50万円/日",
    options: [
      { key: "ア", text: "220万円" },
      { key: "イ", text: "240万円" },
      { key: "ウ", text: "250万円" },
      { key: "エ", text: "280万円" }
    ],
    answer: "ア",
    explanation: (
      <div className="space-y-4">
        <p className="font-bold text-emerald-600">正解：ア</p>
        <div className="bg-gray-50 p-4 rounded-md border border-gray-200 text-xs text-gray-600 space-y-2">
          <p className="font-bold text-sm text-gray-700">【解答手順】</p>
          <p>1. すべてを「最短所要期間」に縮めた場合を仮定する：A=6日, B=3日, C=2日, D=3日。</p>
          <p>2. このときの主経路(クリティカルパス)は A(6) → B(3) → D(3) = 12日間。</p>
          <p>3. クリティカルパス外の並行作業Cは、A終了後(6日目)から始まり、Dの開始(6+3=9日目)までに終われば良い。つまりCには 9 - 6 = 3日間の猶予(限界期間)が与えられる。</p>
          <p>4. Cの本来の最短は2日だが、3日間に緩めても全体の12日間に影響しない。よって、Cの必要短縮日数は 5日(初期) - 3日 = 2日間で十分。</p>
          <p>5. 各作業の必要短縮日数と費用計算：</p>
          <p>・作業B：4日→3日 (1日短縮) × 10万円 = 10万円</p>
          <p>・作業C：5日→3日 (2日短縮) × 30万円 = 60万円</p>
          <p>・作業D：6日→3日 (3日短縮) × 50万円 = 150万円</p>
          <p className="font-bold text-sm text-gray-800">合計費用：10 + 60 + 150 = 220万円</p>
        </div>
      </div>
    )
  },
  {
    id: 7,
    title: "問題 7 ジョンソン法",
    meta: "中小企業診断士 過去問類題",
    question: "工程1（穴あけ）、工程2（塗装）の生産ラインで、4種類の製品A～Dを処理する。工程順は必ず1→2。各製品の各工程作業時間（A: [10,5], B: [3,7], C: [4,2], D: [8,6]）であるとき、全ての製品を最短で終了させるスケジュール時間を求めよ。",
    options: [
      { key: "ア", text: "50分" },
      { key: "イ", text: "32分" },
      { key: "ウ", text: "28分" },
      { key: "エ", text: "17分" }
    ],
    answer: "ウ",
    explanation: (
      <div className="space-y-4">
        <p className="font-bold text-emerald-600">正解：ウ</p>
        <div className="bg-gray-50 p-4 rounded-md border border-gray-200 text-xs text-gray-600 space-y-2">
          <p className="font-bold text-sm text-gray-700">【ジョンソン法による順序決定手順】</p>
          <p>① 全体の最小値は 製品C・工程2の「2分」。後工程(工程2)なので<span className="font-bold">Cを最後</span>に配置。 [ _ , _ , _ , C ]</p>
          <p>② 残り（A,B,D）の最小値は 製品B・工程1の「3分」。前工程(工程1)なので<span className="font-bold">Bを最初</span>に配置。 [ B, _ , _ , C ]</p>
          <p>③ 残り（A,D）の最小値は 製品A・工程2の「5分」。後工程なので<span className="font-bold">AをCの手前</span>に配置。 [ B, _ , A, C ]</p>
          <p>④ 残ったDを中央に配置。確定順序：<span className="font-bold text-red-600">B → D → A → C</span></p>
        </div>
        <div className="text-xs space-y-1 bg-blue-50 p-3 rounded border border-blue-200">
          <p className="font-bold text-blue-800">【タイムチャートのシミュレーション】</p>
          <p>・製品B: 工程1[0-3], 工程2[3-10]</p>
          <p>・製品D: 工程1[3-11], 工程2[11-17] (10分から待機し11分から開始)</p>
          <p>・製品A: 工程1[11-21], 工程2[21-26] (17分から待機し21分から開始)</p>
          <p>・製品C: 工程1[21-25], 工程2[26-28] (25分に工程1完了、工程2は26分から開始可能)</p>
          <p className="font-bold text-gray-800">最終完了時間 ＝ 28分</p>
        </div>
      </div>
    )
  },
  {
    id: 8,
    title: "問題 8 需要予測",
    meta: "中小企業診断士 過去問類題",
    question: "需要予測に関する記述として、最も不適切なものはどれか。",
    options: [
      { key: "ア", text: "加重移動平均法による予測で、重みをすべて同じにした場合、予測値は単純移動平均法と同一となる。" },
      { key: "イ", text: "単純移動平均法による予想で、ノイズを出来るだけ除去する場合には、用いるデータ数を減らせばよい。" },
      { key: "ウ", text: "指数平滑法による予想で、直近の実績の影響を強く反映したい場合は、平滑化指数を大きくすればよい。" },
      { key: "エ", text: "加重平均法による予測で、過去のデータの影響を少なくしたい場合は、重みを減らせばよい。" }
    ],
    answer: "イ",
    explanation: (
      <div className="space-y-4">
        <p className="font-bold text-emerald-600">正解：イ（不適切）</p>
        <div className="text-sm text-gray-600 space-y-2">
          <p><strong>解説：</strong></p>
          <p>一時的な売上の急増や急減といった突発的な変動を「ノイズ」と呼びます。単純移動平均法において、このノイズの影響を薄めて除去し、傾向を滑らかに捉えるためには、<span className="font-bold text-red-600">用いるデータ数（平均をとる期間）を増やす</span>必要があります。データ数を減らすと、直近のノイズを敏感に拾ってしまい、予測値が激しく上下してしまいます。よって、イの記述が不適切です。</p>
        </div>
      </div>
    )
  },
  {
    id: 9,
    title: "問題 9 生産統制",
    meta: "中小企業診断士 過去問類題",
    question: "生産統制に関する記述として、最も適切なものはどれか。",
    options: [
      { key: "ア", text: "生産統制は、大きくわけて進捗管理、現品管理、余力管理、販売管理の4つから構成される。" },
      { key: "イ", text: "余力管理では、製品原価や作業者の負荷状況を管理し、むだな費用の発生を防止する。" },
      { key: "ウ", text: "進捗管理では、入荷した資材の管理や、日程計画に対する仕事の進捗状況を管理する。" },
      { key: "エ", text: "現品管理では、部品や仕掛品の運搬や保管状況を管理し、部品の過不足を未然に防止する。" }
    ],
    answer: "エ",
    explanation: (
      <div className="space-y-4">
        <p className="font-bold text-emerald-600">正解：エ</p>
        <div className="bg-gray-50 p-4 rounded-md border border-gray-200 text-sm text-gray-600 space-y-3">
          <p className="font-bold text-gray-800">💡 生産統制を構成する3つの柱</p>
          <p>・<strong>進捗管理（日程の管理）：</strong>予定に対する遅れ・進み具合を把握し、日々の日程を調整する活動。</p>
          <p>・<strong>現品管理（物の管理）：</strong>仕掛品や資材の所在・数量を正確に掴み、過不足や紛失を未然に防ぐ活動（エが該当）。</p>
          <p>・<strong>余力管理（工数の管理）：</strong>設備や作業者の能力と負荷を比較し、応援手配や作業の再配分を行う活動。</p>
          <p className="text-xs text-red-500 font-bold">※ 販売管理や原価管理は生産統制の直接の構成要素ではありません。</p>
        </div>
      </div>
    )
  },
  {
    id: 10,
    title: "問題 10 生産の管理方式",
    meta: "中小企業診断士 過去問類題",
    question: "生産の管理方式に関する記述として、最も適切なものはどれか。",
    options: [
      { key: "ア", text: "追番管理方式は、生産計画に対する実績の差異を容易に把握できるというメリットがある。" },
      { key: "イ", text: "オーダーエントリー方式では、すでに生産工程に製品があるため、顧客の個別の要求に対応するのは難しい。" },
      { key: "ウ", text: "製番管理方式で生産された製品において、使用した部品の一部に欠陥が見つかった場合、その部品を作った時期を特定するのは難しい。" },
      { key: "エ", text: "生産座席予約システムでは、短納期の顧客要求に対しても、いつでも柔軟に生産の対応ができる。" }
    ],
    answer: "ア",
    explanation: (
      <div className="space-y-4">
        <p className="font-bold text-emerald-600">正解：ア</p>
        <div className="border-t pt-2 text-xs text-gray-600 space-y-2">
          <p><strong>ア ○：</strong>追番管理方式は、通し番号を付与して累積生産量を管理するため、計画累積と実績累積の乖離を非常に容易に把握できます。</p>
          <p><strong>イ ×：</strong>オーダーエントリー方式は、ライン上を流れている標準製品に、後から顧客の個別仕様（オプション等）を引き当てて変更する方式であり、顧客要求に柔軟に応えるためのものです。</p>
          <p><strong>ウ ×：</strong>製番管理方式では、同一の製造番号(製番)で部品調達から組立まで一貫管理するため、欠陥時のトレーサビリティ（追跡性）は非常に高くなります。</p>
          <p><strong>エ ×：</strong>生産座席予約システムは、枠（座席）が満席の場合、短納期の飛び込み注文に対しては融通が利かなくなるデメリットがあります。</p>
        </div>
      </div>
    )
  },
  {
    id: 11,
    title: "問題 11 トヨタ生産方式",
    meta: "中小企業診断士 過去問類題",
    question: "トヨタ生産方式に関する記述として、最も不適切なものはどれか。",
    options: [
      { key: "ア", text: "かんばんの枚数及びそこに指示される量は、生産量と同時に工程間の仕掛品の数も指示することになる。" },
      { key: "イ", text: "かんばんは、作業の指示をする生産指示かんばんと、運搬を表す運搬かんばんの2種類がある。" },
      { key: "ウ", text: "プルシステムを導入して、効率的な生産を行うためには、最終組み立てラインの生産量の平準化が重要となる。" },
      { key: "エ", text: "JITは、必要なものを、必要な時に、必要な数だけ生産する方式で、これを実現するため、後工程引取り方式を採用している。" }
    ],
    answer: "イ",
    explanation: (
      <div className="space-y-4">
        <p className="font-bold text-emerald-600">正解：イ（不適切）</p>
        <div className="bg-gray-50 p-4 rounded-md border border-gray-200 text-sm text-gray-600 space-y-2">
          <p><strong>解説：</strong></p>
          <p>トヨタ生産方式で用いられる2種類のかんばんの正確な名称は、<span className="font-bold text-red-600">「生産指示かんばん」</span>と<span className="font-bold text-red-600">「引取りかんばん」</span>です。「運搬かんばん」という名称は不適切なため、イが誤り（正解選択肢）となります。</p>
          <p className="text-xs text-gray-500 pt-2 border-t">※プルシステム（後工程引取り）を機能させるためには、前工程に過度な振動を与えないよう、最終ラインにおける「生産の平準化（ウ）」が絶対的な前提条件となります。</p>
        </div>
      </div>
    )
  }
];

export default function App() {
  // --- States ---
  const [userId, setUserId] = useState(() => localStorage.getItem('quiz_user_id') || '');
  const [isAuth, setIsAuth] = useState(false);
  const [loading, setLoading] = useState(false);
  const [screen, setScreen] = useState('login'); // 'login', 'menu', 'quiz', 'result', 'history'
  
  // Quiz execution states
  const [selectedMode, setSelectedMode] = useState('all'); // 'all', 'wrong', 'review'
  const [currentQuestions, setCurrentQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [isAnswered, setIsAnswered] = useState(false);

  // User synchronized cloud states
  const [wrongAnswers, setWrongAnswers] = useState({}); // { questionId: boolean }
  const [reviewFlags, setReviewFlags] = useState({}); // { questionId: boolean }
  const [historyLog, setHistoryLog] = useState([]); // Array of quiz attempts

  // Resume state
  const [resumePrompt, setResumePrompt] = useState(null); // { index, mode }

  // --- Actions & DB Sync ---
  useEffect(() => {
    console.log("App Initialized. Current version 2026.");
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!userId.trim()) return;
    setLoading(true);
    console.log(`Starting authentication & syncing for user: ${userId}`);

    try {
      const authUser = await signInAnonymously(auth);
      console.log("Anonymous Auth success:", authUser.user.uid);
      localStorage.setItem('quiz_user_id', userId);

      // Load data from Firestore
      const docRef = doc(db, APP_ID, userId.trim());
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data();
        console.log("User data restored from cloud:", data);
        setWrongAnswers(data.wrongAnswers || {});
        setReviewFlags(data.reviewFlags || {});
        setHistoryLog(data.historyLog || []);

        if (data.progressIndex !== undefined && data.progressIndex > 0 && data.progressMode) {
          console.log(`Found unfinished session: index ${data.progressIndex} in mode ${data.progressMode}`);
          setResumePrompt({
            index: data.progressIndex,
            mode: data.progressMode
          });
        }
      } else {
        console.log("No existing user cloud document. Registering new profile.");
        await setDoc(docRef, {
          wrongAnswers: {},
          reviewFlags: {},
          historyLog: [],
          createdAt: new Date().toISOString()
        });
      }
      setIsAuth(true);
      setScreen('menu');
    } catch (error) {
      console.error("Critical Sync Failure during Login:", error);
      alert("データベースとの通信に失敗しました。合言葉を確認し、再度お試しください。");
    } finally {
      setLoading(false);
    }
  };

  const saveProgressToCloud = async (nextIndex, mode) => {
    if (!userId) return;
    try {
      const docRef = doc(db, APP_ID, userId.trim());
      await updateDoc(docRef, {
        progressIndex: nextIndex,
        progressMode: mode
      });
      console.log(`Progress cached to cloud: Index ${nextIndex}, Mode: ${mode}`);
    } catch (err) {
      console.error("Failed to save intermediate progress:", err);
    }
  };

  const syncFlagsToCloud = async (updatedWrongs, updatedReviews, newHistory = null) => {
    if (!userId) return;
    try {
      const docRef = doc(db, APP_ID, userId.trim());
      const payload = {
        wrongAnswers: updatedWrongs,
        reviewFlags: updatedReviews
      };
      if (newHistory) payload.historyLog = newHistory;
      await updateDoc(docRef, payload);
      console.log("Cloud variables updated successfully.");
    } catch (err) {
      console.error("Failed cloud state serialization:", err);
    }
  };

  const startQuiz = (mode, resumeFromIndex = 0) => {
    console.log(`Building question queue for Mode: ${mode}, start index: ${resumeFromIndex}`);
    let filtered = [];
    if (mode === 'all') {
      filtered = [...quizData];
    } else if (mode === 'wrong') {
      filtered = quizData.filter(q => wrongAnswers[q.id]);
    } else if (mode === 'review') {
      filtered = quizData.filter(q => reviewFlags[q.id]);
    }

    if (filtered.length === 0) {
      alert("該当する問題がありません。別のモードを選択してください。");
      return;
    }

    setCurrentQuestions(filtered);
    setCurrentIndex(resumeFromIndex < filtered.length ? resumeFromIndex : 0);
    setSelectedMode(mode);
    setSelectedAnswer(null);
    setIsAnswered(false);
    setResumePrompt(null);
    setScreen('quiz');
  };

  const handleAnswerSelect = (key) => {
    if (isAnswered) return;
    setSelectedAnswer(key);
    setIsAnswered(true);

    const currentQuestion = currentQuestions[currentIndex];
    const isCorrect = key === currentQuestion.answer;

    const updatedWrongs = { ...wrongAnswers };
    if (isCorrect) {
      delete updatedWrongs[currentQuestion.id];
    } else {
      updatedWrongs[currentQuestion.id] = true;
    }
    setWrongAnswers(updatedWrongs);
    syncFlagsToCloud(updatedWrongs, reviewFlags);

    // Track state for auto-resume matching
    const nextIdx = currentIndex + 1;
    if (nextIdx < currentQuestions.length) {
      saveProgressToCloud(nextIdx, selectedMode);
    } else {
      // Finished final question in queue
      saveProgressToCloud(0, selectedMode);
    }
  };

  const handleNext = () => {
    if (currentIndex + 1 < currentQuestions.length) {
      setCurrentIndex(prev => prev + 1);
      setSelectedAnswer(null);
      setIsAnswered(false);
    } else {
      // Completed current session entirely
      console.log("Quiz subset finished. Compiling report logging data.");
      const score = currentQuestions.reduce((acc, q) => {
        // Evaluate dynamic session result
        return acc + (wrongAnswers[q.id] ? 0 : 1); 
      }, 0);

      const logEntry = {
        date: new Date().toLocaleDateString(),
        mode: selectedMode,
        total: currentQuestions.length,
        correct: score
      };

      const updatedHistory = [logEntry, ...historyLog];
      setHistoryLog(updatedHistory);
      syncFlagsToCloud(wrongAnswers, reviewFlags, updatedHistory);
      setScreen('result');
    }
  };

  const toggleReviewFlag = (id) => {
    const updatedReviews = { ...reviewFlags };
    if (updatedReviews[id]) {
      delete updatedReviews[id];
    } else {
      updatedReviews[id] = true;
    }
    setReviewFlags(updatedReviews);
    syncFlagsToCloud(wrongAnswers, updatedReviews);
    console.log(`Toggled review tag state for question identity key: ${id}`);
  };

  const exitToMenu = () => {
    setScreen('menu');
    setResumePrompt(null);
  };

  // --- Render Helpers ---
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col justify-center items-center font-sans">
        <RefreshCw className="w-12 h-12 text-blue-600 animate-spin mb-4" />
        <p className="text-gray-700 font-medium">クラウド同期中... 画面を閉じずにお待ちください</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 font-sans text-gray-900 selection:bg-blue-200">
      {/* Top Banner Header */}
      <header className="bg-gradient-to-r from-blue-700 to-indigo-800 text-white shadow-md py-4 px-6 sticky top-0 z-50">
        <div className="max-w-4xl mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <BookOpen className="w-6 h-6 text-blue-200" />
            <div>
              <h1 className="text-lg font-bold tracking-tight">スマート問題集 3-3</h1>
              <p className="text-xs text-blue-100">生産計画と生産統制</p>
            </div>
          </div>
          {isAuth && (
            <div className="flex items-center space-x-2 bg-blue-900/40 px-3 py-1.5 rounded-full border border-blue-400/30 text-xs">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span className="font-mono font-medium max-w-[120px] truncate">ID: {userId}</span>
            </div>
          )}
        </div>
      </header>

      <main className="max-w-4xl mx-auto p-4 md:p-6 pb-24">
        {/* SCREEN 1: LOGIN / KEYWORD IDENTITY MATCHING */}
        {screen === 'login' && (
          <div className="max-w-md mx-auto my-12 bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
            <div className="p-6 bg-gradient-to-br from-blue-600 to-blue-800 text-white text-center">
              <h2 className="text-xl font-bold mb-1">同期パスワードの設定</h2>
              <p className="text-xs text-blue-100">PC・スマホ間で学習データを同期するための任意の合言葉を入力してください。</p>
            </div>
            <form onSubmit={handleLogin} className="p-6 space-y-5">
              <div>
                <label className="block text-xs font-bold text-gray-700 tracking-wider uppercase mb-2">ユーザー識別キー（合言葉）</label>
                <input
                  type="text"
                  required
                  placeholder="例: my-studypass-2026"
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition font-mono"
                  value={userId}
                  onChange={(e) => setUserId(e.target.value)}
                />
              </div>
              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg shadow-md transition transform active:scale-95 flex items-center justify-center space-x-2"
              >
                <Save className="w-5 h-5" />
                <span>ログイン ＆ データを同期</span>
              </button>
            </form>
          </div>
        )}

        {/* SCREEN 2: MAIN DASHBOARD MENU */}
        {screen === 'menu' && (
          <div className="space-y-6 animate-fade-in">
            {/* Resume Intercept Notice Prompt */}
            {resumePrompt && (
              <div className="bg-amber-50 border-2 border-amber-300 rounded-xl p-5 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-1">
                  <h3 className="text-amber-800 font-bold text-sm flex items-center gap-1.5">
                    <span className="inline-block p-1 bg-amber-200 text-amber-800 rounded-full text-xs">⚠️</span>
                    前回の学習セッション中断データを発見しました
                  </h3>
                  <p className="text-xs text-amber-700">
                    モード「<span className="font-bold">{resumePrompt.mode === 'all' ? 'すべての問題' : resumePrompt.mode === 'wrong' ? '前回不正解のみ' : '要復習のみ'}</span>」の
                    <span className="font-bold font-mono text-sm bg-amber-200/60 px-1.5 rounded mx-0.5">問題 {resumePrompt.index + 1}</span> まで完了しています。続きから再開しますか？
                  </p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => startQuiz(resumePrompt.mode, resumePrompt.index)}
                    className="bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs py-2 px-3.5 rounded shadow transition"
                  >
                    続きから再開する
                  </button>
                  <button
                    onClick={async () => {
                      if(confirm("進捗データを破棄して最初から開始してもよろしいですか？")) {
                        await saveProgressToCloud(0, "all");
                        setResumePrompt(null);
                      }
                    }}
                    className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium text-xs py-2 px-3 rounded transition"
                  >
                    最初から
                  </button>
                </div>
              </div>
            )}

            {/* Selection Grid Cards for Modes */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
              <h2 className="text-base font-bold text-gray-800 mb-4 tracking-tight flex items-center gap-2">
                <List className="w-5 h-5 text-blue-600" />学習モードを選択してスタート
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <button
                  onClick={() => startQuiz('all')}
                  className="p-5 rounded-xl border border-gray-200 hover:border-blue-500 hover:bg-blue-50/40 text-left transition group shadow-sm bg-white"
                >
                  <div className="font-bold text-gray-900 group-hover:text-blue-700 text-sm mb-1">① すべての問題</div>
                  <p className="text-xs text-gray-500 mb-3">全11問を順番に網羅的に学習します。</p>
                  <span className="text-xs bg-slate-100 text-slate-700 font-mono px-2 py-1 rounded inline-block font-semibold">収録数: {quizData.length}問</span>
                </button>

                <button
                  onClick={() => startQuiz('wrong')}
                  className="p-5 rounded-xl border border-gray-200 hover:border-red-500 hover:bg-red-50/40 text-left transition group shadow-sm bg-white"
                >
                  <div className="font-bold text-gray-900 group-hover:text-red-700 text-sm mb-1">② 前回不正解の問題のみ</div>
                  <p className="text-xs text-gray-500 mb-3">間違えた問題のみをピンポイントで復習。</p>
                  <span className="text-xs bg-red-100 text-red-700 font-mono px-2 py-1 rounded inline-block font-semibold">現在対象: {quizData.filter(q => wrongAnswers[q.id]).length}問</span>
                </button>

                <button
                  onClick={() => startQuiz('review')}
                  className="p-5 rounded-xl border border-gray-200 hover:border-amber-500 hover:bg-amber-50/40 text-left transition group shadow-sm bg-white"
                >
                  <div className="font-bold text-gray-900 group-hover:text-amber-700 text-sm mb-1">③ 要復習の問題のみ</div>
                  <p className="text-xs text-gray-500 mb-3">自分でチェックを入れた重要問題。</p>
                  <span className="text-xs bg-amber-100 text-amber-700 font-mono px-2 py-1 rounded inline-block font-semibold">登録数: {quizData.filter(q => reviewFlags[q.id]).length}問</span>
                </button>
              </div>
            </div>

            {/* Simple Dynamic Metrics Graph View Chart */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 flex flex-col justify-between">
                <div>
                  <h3 className="text-sm font-bold text-gray-800 mb-3">現在の総合進捗ステータス</h3>
                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between items-center p-2 bg-slate-50 rounded">
                      <span className="text-gray-600">マスター完了（正解済み）</span>
                      <span className="font-bold font-mono text-emerald-600">{quizData.length - quizData.filter(q => wrongAnswers[q.id]).length} / {quizData.length}問</span>
                    </div>
                    <div className="flex justify-between items-center p-2 bg-slate-50 rounded">
                      <span className="text-gray-600">要復習フラグ登録</span>
                      <span className="font-bold font-mono text-amber-600">{quizData.filter(q => reviewFlags[q.id]).length}問</span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => setScreen('history')}
                  className="mt-4 w-full bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold py-2.5 px-4 rounded-lg border border-slate-300 transition flex items-center justify-center gap-1"
                >
                  <Award className="w-4 h-4" />
                  <span>過去の履歴ログ・推移を確認</span>
                </button>
              </div>

              <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-200">
                <h3 className="text-xs font-bold text-gray-700 mb-2">セクション内状況比率</h3>
                <div className="h-32">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={[
                        { name: '全体', 数: quizData.length },
                        { name: '未対応/不正解', 数: quizData.filter(q => wrongAnswers[q.id]).length },
                        { name: '要復習', 数: quizData.filter(q => reviewFlags[q.id]).length }
                      ]}
                      margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                      <YAxis tick={{ fontSize: 10 }} />
                      <Tooltip wrapperStyle={{ fontSize: 11 }} />
                      <Bar dataKey="数" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* SCREEN 3: ACTIVE QUIZ VIEW */}
        {screen === 'quiz' && currentQuestions.length > 0 && (
          <div className="space-y-6">
            {/* Question Card Box */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="bg-slate-800 text-white px-5 py-3 flex justify-between items-center text-xs">
                <span className="font-medium tracking-wide text-slate-300">{currentQuestions[currentIndex]?.meta}</span>
                <span className="font-mono bg-slate-700 px-2 py-0.5 rounded text-slate-200 font-bold">
                  {currentIndex + 1} / {currentQuestions.length} 問目
                </span>
              </div>

              <div className="p-6 space-y-4">
                <div className="space-y-1">
                  <h2 className="text-xs font-bold text-blue-600 tracking-wider uppercase">{currentQuestions[currentIndex]?.title}</h2>
                  <p className="text-base font-bold text-gray-900 leading-relaxed whitespace-pre-wrap">
                    {currentQuestions[currentIndex]?.question}
                  </p>
                </div>

                {/* Multiple Options Radio Selections */}
                <div className="space-y-2 pt-2">
                  {currentQuestions[currentIndex]?.options.map((opt) => {
                    const isSelected = selectedAnswer === opt.key;
                    const isCorrectKey = opt.key === currentQuestions[currentIndex]?.answer;
                    
                    let btnStyle = "border-gray-200 hover:bg-slate-50 hover:border-gray-400";
                    if (isAnswered) {
                      if (isCorrectKey) btnStyle = "border-emerald-500 bg-emerald-50 text-emerald-900 ring-2 ring-emerald-500/20";
                      else if (isSelected) btnStyle = "border-red-500 bg-red-50 text-red-900 ring-2 ring-red-500/20";
                      else btnStyle = "border-gray-100 opacity-60 bg-gray-50/50 cursor-not-allowed";
                    } else if (isSelected) {
                      btnStyle = "border-blue-600 bg-blue-50/50";
                    }

                    return (
                      <button
                        key={opt.key}
                        disabled={isAnswered}
                        onClick={() => handleAnswerSelect(opt.key)}
                        className={`w-full p-4 rounded-xl border text-left text-sm transition-all flex items-start space-x-3 group ${btnStyle}`}
                      >
                        <span className={`w-6 h-6 rounded-lg font-mono font-bold text-xs shrink-0 flex items-center justify-center border transition-colors ${
                          isAnswered && isCorrectKey ? 'bg-emerald-500 text-white border-transparent' :
                          isAnswered && isSelected ? 'bg-red-500 text-white border-transparent' :
                          'bg-slate-100 border-gray-300 text-gray-700 group-hover:bg-white'
                        }`}>
                          {opt.key}
                        </span>
                        <span className="leading-normal font-medium">{opt.text}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Answer Feedback Description & Explanation Component Panel */}
            {isAnswered && (
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 space-y-4 animate-fade-in">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-gray-100">
                  <div className="flex items-center space-x-2">
                    {selectedAnswer === currentQuestions[currentIndex]?.answer ? (
                      <div className="flex items-center text-emerald-600 font-bold bg-emerald-100 px-3 py-1 rounded-full text-xs">
                        <Check className="w-4 h-4 mr-1" /> 正解
                      </div>
                    ) : (
                      <div className="flex items-center text-red-600 font-bold bg-red-100 px-3 py-1 rounded-full text-xs">
                        <X className="w-4 h-4 mr-1" /> 不正解
                      </div>
                    )}
                    <span className="text-xs text-gray-500 font-medium">解説を確認しましょう</span>
                  </div>

                  {/* Bookmark Review Toggle Button */}
                  <label className="inline-flex items-center space-x-2 cursor-pointer bg-slate-50 hover:bg-slate-100 px-3 py-1 rounded-lg border border-gray-200 transition select-none">
                    <input
                      type="checkbox"
                      checked={!!reviewFlags[currentQuestions[currentIndex]?.id]}
                      onChange={() => toggleReviewFlag(currentQuestions[currentIndex]?.id)}
                      className="w-4 h-4 text-amber-500 focus:ring-amber-400 border-gray-300 rounded"
                    />
                    <span className="text-xs font-bold text-gray-700">★ 要復習リストに登録</span>
                  </label>
                </div>

                {/* Explanation Content Body */}
                <div className="text-gray-700 leading-relaxed text-sm">
                  {currentQuestions[currentIndex]?.explanation}
                </div>

                {/* Action Trigger Progression Button Control */}
                <div className="pt-2 flex justify-end">
                  <button
                    onClick={handleNext}
                    className="bg-slate-900 hover:bg-slate-800 text-white font-bold py-3 px-6 rounded-xl shadow-md transition transform active:scale-95 flex items-center space-x-1"
                  >
                    <span>{currentIndex + 1 === currentQuestions.length ? "結果画面へ" : "次の問題へ"}</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* SCREEN 4: SESSION COMPLETE REPORT OVERVIEW */}
        {screen === 'result' && (
          <div className="max-w-md mx-auto bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden text-center p-8 space-y-6">
            <div className="inline-block p-4 bg-emerald-50 text-emerald-600 rounded-full">
              <Award className="w-12 h-12" />
            </div>
            <div className="space-y-1">
              <h2 className="text-xl font-bold text-gray-900">セッション全問回答完了！</h2>
              <p className="text-xs text-gray-500">お疲れ様でした。学習履歴がクラウドに保存されました。</p>
            </div>

            <div className="p-4 bg-slate-50 border border-gray-100 rounded-xl">
              <span className="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-1">今回の解答モード</span>
              <span className="text-sm font-bold text-blue-700">
                {selectedMode === 'all' ? 'すべての問題' : selectedMode === 'wrong' ? '前回不正解の問題のみ' : '要復習の問題のみ'}
              </span>
            </div>

            <div className="flex justify-center space-x-4">
              <button
                onClick={exitToMenu}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-xl shadow transition"
              >
                ダッシュボードへ戻る
              </button>
              <button
                onClick={() => startQuiz(selectedMode)}
                className="px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl border border-slate-300 transition"
                title="同じモードで再挑戦"
              >
                <RotateCcw className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}

        {/* SCREEN 5: LOG HISTORY SUMMARY TRAIL */}
        {screen === 'history' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold text-gray-800 flex items-center gap-2">
                <Award className="w-5 h-5 text-indigo-600" />過去の解答履歴ログ（同期済み）
              </h2>
              <button
                onClick={exitToMenu}
                className="text-xs text-blue-600 hover:underline font-bold flex items-center gap-0.5"
              >
                <Home className="w-4 h-4" /> メニューへ戻る
              </button>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
              {historyLog?.length === 0 ? (
                <p className="text-center p-8 text-sm text-gray-500">まだ解答完了履歴データが蓄積されていません。</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="bg-slate-800 text-slate-200 uppercase font-mono font-bold tracking-wider">
                        <th className="p-3">実施日</th>
                        <th className="p-3">出題モード</th>
                        <th className="p-3">問題数</th>
                        <th className="p-3">正解率</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 font-medium">
                      {historyLog.map((log, i) => {
                        const pct = log.total > 0 ? Math.round((log.correct / log.total) * 100) : 0;
                        return (
                          <tr key={i} className="hover:bg-slate-50 transition">
                            <td className="p-3 text-gray-500">{log.date}</td>
                            <td className="p-3 text-slate-900 font-semibold">
                              {log.mode === 'all' ? 'すべての問題' : log.mode === 'wrong' ? '前回不正解' : '要復習'}
                            </td>
                            <td className="p-3 font-mono text-gray-600">{log.total}問</td>
                            <td className="p-3">
                              <span className={`inline-block font-mono font-bold px-2 py-0.5 rounded ${
                                pct >= 80 ? 'bg-emerald-100 text-emerald-800' :
                                pct >= 50 ? 'bg-amber-100 text-amber-800' : 'bg-red-100 text-red-800'
                              }`}>
                                {pct}% ({log.correct}問)
                              </span>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}
      </main>

      {/* Floating Global Bottom Return Navigation Bar Component */}
      {screen !== 'login' && screen !== 'menu' && (
        <div className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-md border-t border-gray-200 py-3 px-4 shadow-lg z-40">
          <div className="max-w-4xl mx-auto flex justify-between items-center text-xs">
            <span className="text-gray-500 font-medium font-mono">ID: {userId}</span>
            <button
              onClick={exitToMenu}
              className="bg-slate-100 hover:bg-slate-200 border border-gray-300 font-bold text-gray-700 py-2 px-4 rounded-lg transition flex items-center gap-1"
            >
              <Home className="w-3.5 h-3.5" />
              <span>メニュー画面に戻る</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}