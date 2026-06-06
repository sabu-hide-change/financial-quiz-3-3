// npm install lucide-react recharts firebase
import React, { useState, useEffect } from "react";
import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore, doc, getDoc, setDoc } from "firebase/firestore";
import { getAuth, signInAnonymously } from "firebase/auth";
import { 
  Check, 
  X, 
  Home, 
  ChevronRight, 
  RefreshCw, 
  BarChart2, 
  BookOpen, 
  User, 
  ArrowRight, 
  HelpCircle,
  AlertTriangle,
  Play,
  RotateCcw,
  List,
  CheckCircle,
  Clock
} from "lucide-react";
import { 
  Radar, 
  RadarChart, 
  PolarGrid, 
  PolarAngleAxis, 
  PolarRadiusAxis, 
  ResponsiveContainer 
} from "recharts";

// ==========================================
// データの分離とAPP_ID定義
// ==========================================
const APP_ID = "QuizApp_Production_Planning_001";

// ==========================================
// Firebase 設定の秘匿化
// ==========================================
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

// Firebase 初期化
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore(app);
const auth = getAuth(app);

// ==========================================
// クイズデータ (完全ノンカット収録)
// ==========================================
const QUESTIONS = [
  {
    id: 1,
    title: "生産計画",
    source: "スマート問題集 3-3",
    category: "plan",
    question: "生産計画に関する記述として、最も適切なものはどれか。",
    choices: [
      "生産計画の役割として、納期や生産量の保証、製品品質の保証、設備稼働率の維持などがある。",
      "負荷計画では、生産能力と手持ち材料を比較し、過不足がある場合に調整を図る。",
      "生産計画を業務で分類すると、手順計画、工程設計、負荷計画、日程計画に分類できる。",
      "手順計画では、設計情報を基に、加工手順、使用設備、標準作業時間などを検討する。"
    ],
    answer: "エ",
    explanation: `解答：エ

ここが重要
　本問では生産計画の役割や分類について問われています。
　生産計画は、製品の生産量と生産時期を決定する活動です。
　生産計画を作成することで、納期や生産量の保証、適切な稼働率の維持、資材の調達、機械設備や人員の手配を、効率的に行うことができます。
　生産計画を、業務別、期間別に分類すると次のようになります。

●業務別の分類と手順
　生産計画の業務は、次の3つに分類できます。また計画は①→②→③の順番で進めていきます。
①手順計画（工程設計）
　製品の作り方を決めます。具体的には、加工手順・必要設備・工具・標準工数（標準作業時間）などを検討し、製品の効率的な生産方法を決定します。
②工数計画（負荷計画）
　必要な人員数と設備使用時間を算定します。具体的には、製品の納期や数量を決定した後に、生産に必要な工数を計算し、生産能力と比較します。工数が生産能力を超える場合は、超過分の工数を残業でカバーしたり、別の期間に振り分けるなどの調整を行います。
③日程計画
　各作業の開始と完了日を計画します。

●期間別の分類
　生産計画の期間は、次の3つに分類できます。
①大日程計画
　・期間：年単位の長期計画。
　・内容：設備や人員、リードタイムの長い部品や材料の調達など、調達に時間がかかるリソースの必要量を計画。
②中日程計画
  ・対象期間：月次の計画。
  ・内容：生産する製品、時期、数量をほぼ確定します。部品や材料の入手時期を決定し、設備・人材・工具の手配などを計画。
③小日程計画
  ・対象期間：週や日単位の計画。
  ・内容：確定した納期や生産量に対して、具体的な作業の手順や時期などを細かく決め、人や機械に対して作業の割り当てを計画。

　手順計画、工数計画には、それぞれ別の呼び名があります。どちらの名称で問われても回答できるように、両方の名称をセットで覚えておきましょう。

ア　×：
　生産計画は、納期や生産量の保証、適切な稼働率の維持、資材の調達、機械設備や人員の手配などを計画し、生産を効率的に行うことを目的としています。このため製品品質の保証は含まれません。よって記述は不適切です。

イ　×：
　負荷計画（工数計画）において生産能力と比較し調整するのは、生産に必要な工数です。手持ち材料ではありません。よって記述は不適切です。

ウ　×：
　手順計画を別名で工程設計と呼びます。このため、業務の分類は手順計画（工程設計）、負荷計画、日程計画の3種類となります。よって記述は不適切です。

エ　○：
　手順計画では、設計情報を基に、加工手順、使用設備、標準作業時間などを検討し、製品の効率的な生産方法を決定します。よって記述は適切です。`
  },
  {
    id: 2,
    title: "スケジューリング",
    source: "スマート問題集 3-3",
    category: "plan",
    question: "スケジューリングに関する記述として、最も不適切なものはどれか。",
    choices: [
      "フォワードスケジューリングとは、作業の開始時点から、順番に予定を組んでいく方法である。",
      "ジョブショップスケジューリングは、同じ専用ラインを使用して複数の製品を大量生産するのに適した方法である。",
      "バックワードスケジューリングは、予め決められた納期を守るために、作業開始日を決める方法である。",
      "プロジェクトスケジューリングでは、必要な作業を全て抽出し、それぞれの作業の開始日と完了日が分かるようにする。"
    ],
    answer: "イ",
    explanation: `解答：イ

ここが重要
　本問では、スケジューリングの分類や手法が問われています。
　日程計画では、使用可能な資源の制約の元で、なるべく効率的に生産できるように、各工程に作業を割り当て、工程ごとの開始、終了時期を決定していきます。この作業のことをスケジューリングと呼びます。スケジューリングの方法には様々なものがありますが、代表的な分類と手法は次の通りです。

●スケジューリングの分類
　スケジューリングは、次の2つに分類できます。
①フォワードスケジューリング
　作業が開始できる日を基準に、開始時点から、工程順序に沿って予定を組む方法。
　つまり、納期は後から決まる。
②バックワードスケジューリング
　製品の納期を基準に、完了時点から、工程順序に沿って予定を組む方法。
　つまり、納期が先に決まっていて、納期を守るための作業開始日を決める。

●スケジューリングの手法
　スケジューリングの手法は沢山ありますが、ここでは代表的なものを3つ紹介します。
①プロジェクトスケジューリング
　概要：複数の作業からなるプロジェクトの全体日程を管理するために、個々の作業について、各作業の順番や、所用期間・開始日程・終了日程を決定するスケジューリングのこと。
　適用：個別生産形態で多く用いられる。
②ジョブショップスケジューリング
　概要：複数の作業を、幾つかの機械を用いて行う場合に、全体の作業時間が最短になるように、作業や機械の順番を最適化するスケジューリングのこと。
　適用：多品種少量生産形態で、機能別レイアウトの場合に多く用いられる。
③フローショップスケジューリング
　概要：複数の作業を、同一の機械やラインを用いて行う場合に、機械を使用する時期を最適に割当てるスケジューリングのこと。
　適用：少種多量生産形態で、製品別レイアウトの場合に多く用いられる。

　バックワードスケジューリングは、「納期が決まっていて、後ろから計画」と覚え、フォワードスケジューリングはその逆、とセットで覚えておきましょう。

ア　○：
　フォワードスケジューリングとは、いつから作業を開始できるかを決定し、そこから工程順序に沿って予定を組んでいく方法です。よって、記述は適切です。

イ　×：
　ジョブショップスケジューリングとは、複数の作業を、幾つかの機械で処理する場合に、作業や機械の順番を最適化するのに適した方法です。この方法は、機能別レイアウトを用いて多品種少量生産形態をする場合に多く用いられます。選択肢の記述は、フローショップスケジューリングに関する内容です。よって記述は不適切です。

ウ　○：
　バックワードスケジューリングは、納期を基準に、工程の順序とは逆に予定を組んでいき、いつから作業を開始するかを決定します。納期をより重視した方法と言えます。よって記述は適切です。

エ　○：
　プロジェクトスケジューリングでは、複数の作業から構成されるプロジェクトの作業項目を全て抽出し、各作業の所要期間や作業間の関連が分かるようにします。よって記述は適切です。`
  },
  {
    id: 3,
    title: "PERT1",
    source: "スマート問題集 3-3",
    category: "plan",
    question: "来月から開始するプロジェクトのスケジューリングをPERTで行ったところ、次のようになった。図の〇印は、各作業の開始と終了を示すノードで、矢印を各作業にかかる日数とした場合、最も適切な記述はどれか。",
    choices: [
      "ノード7の最早着手日は、16日である。",
      "クリティカルパスは、作業B→F→G→Jの経路である。",
      "ノード6の最遅着手日は、20日である。",
      "ノード3の最早着手日は4日、最遅着手日6日である。"
    ],
    answer: "エ",
    hasDiagram: true,
    diagramType: "problem3",
    explanation: `解答：エ

ここが重要
　本問は代表的なネットワーク手法であるPERTについて問われています。
　ネットワーク手法とは、作業間の関連や順序を決定する方法で、その代表的なものにPERTがあります。
　PERTでは、作業の流れを表す「アローダイアグラム」と呼ばれる図を書きます。この図の中で、作業のことをアクティビティと呼び、線で表します。作業の開始と終了の時点は丸で表し、これをノードや結合点と呼びます。（丸が作業ではなく、線が作業ですので注意してください）。
　PERTでは、次のような流れで、プロジェクトを最短で完了するための、作業スケジュールを決定します。

●最早着手日
　最初に、プロジェクトの開始時点から順に、最も早く作業を開始できる日程を記入していきます。この日程のことを最早着手日と呼びます。
・ノード1の最早着手日は0日となります。
・ノード2、3、4のように先行作業が一つの場合は、それぞれの先行作業にかかる日数が、そのまま最早着手日となります。図の例では、ノード2が8日, ノード3が5日, ノード4が6日となります。
・ノード5のように、複数の先行作業がある場合は、全ての先行作業の合計が最早着手日となります。但し、複数の経路がある場合は、最も合計時間が長い経路が最早着手日となります。ノード5の場合は、3つの経路があります。合計時間が最も長い経路は、作業B→Eの経路で15日です。同様にノード7では24日となります。

●最遅着手日
　次に、各作業をいつまでに着手したら良いかを決定していきます。この日程を最遅着手日と呼びます。最遅着手日は最後の方から求めていきます。
・図の例では、ノード7の最遅着手日は、最早着手日と同じ24日です。ノード6は、作業Iの時間(10)を引いて14日です。同様に、ノード5では17日となります。このように、全てのノードの最遅着手日を求めます。
・最遅着手日は、遅くともここまでに開始すればプロジェクト全体の完了時間に影響が無いタイミングです。例えば、ノード2は最早着手日は8日ですが、最遅着手日は11日です。遅くとも11日に作業を開始すればよいので、3日の余裕があることになります。一方、ノード4は最早着手日と最遅着手日が同じ6日で余裕がありません。少しでも作業の開始が遅れれば、全体が完了するスケジュールに影響を及ぼします。

●クリティカルパス
　ノード4のように、作業の遅れが許されない経路を「クリティカルパス」と呼びます。この図では、作業C→G→Iを通る経路がクリティカルパスです。
　プロジェクトのスケジュール管理では、クリティカルパス上の作業を重点的に管理すると共に、クリティカルパス上の作業を改善して短縮することで、全体の納期を短縮することができます。

設問のPERTの各ノードの最早着手日と最遅着手日を求めると次のようになります。

ア　×：
　ノード7までの先行作業の経路で、合計時間が最も長くなる経路は、赤矢線で示した作業A→D→Hです。この作業時間の合計が最早着手日となるので、26日となります。よって記述は不適切です。

イ　×：
　クリティカルパスは最早着手日と最遅着手日が同じになる遅れが許されない経路です。赤矢線で示した作業A→D→Hが該当します。よって記述は不適切です。

ウ　×：
　ノード6の最遅着手日は、ノード7の最遅着手日から作業Jの3日を引いた23日となります。よって記述は不適切です。

エ　○：
　ノード3の最早着手日は作業Bと同じ4日です。一方、最遅着手日はクリティカルパス上にあるノード4から、作業Eの8日を引いた6日となります。よって記述は適切です。`
  },
  {
    id: 4,
    title: "PERT2",
    source: "スマート問題集 3-3",
    category: "plan",
    question: "下表に示される作業A～Hで構成されるプロジェクトにおいて、PERTを用いて日程管理を行う。空欄Ｘ、Ｙに入る数値、及びクリティカルパスについて、最も適切な組み合わせを下記の解答群より選べ。",
    choices: [
      "Ｘ：50　　Ｙ：45　　クリティカルパス：A - D - G - H",
      "Ｘ：45　　Ｙ：40　　クリティカルパス：A - B - E - H",
      "Ｘ：50　　Ｙ：45　　クリティカルパス：A - C - F - H",
      "Ｘ：45　　Ｙ：40　　クリティカルパス：A - D - G - H"
    ],
    answer: "ア",
    hasDiagram: true,
    diagramType: "problem4",
    explanation: `解答：ア

ここが重要
　本問では、アローダイアグラムから最遅着手日とクリティカルパスを読み取ることが求められています。ダミー矢線の理解も必要です。
●最遅着手日
　ここまでに開始すればプロジェクト全体の完了時間に影響が無いタイミングが最遅着手日です。
●クリティカルパス
　最早着手日と最遅着手日が同じノードを結んだ経路で、作業の遅れが許されない経路をクリティカルパスといいます。プロジェクトのスケジュール管理では、クリティカルパス上の作業を重点的に管理すると共に、クリティカルパス上の作業を改善して短縮することで、プロジェクト全体の納期を短縮するように努めます。
●ダミー矢線
　他の工程の間に並行して行うことができる工程は、ダミー矢線として点線で表します。ダミー矢線の所要時間はゼロで、計算には加えません。

本問のアローダイアグラムは次のとおりです。

空欄Ｘ：ノード２における最遅着手日は、ノード５の最遅着手日70から工程Eの日数を差し引いて求めます。よって、70－20＝50日となります。
空欄Ｙ：ノード３における最遅着手日は、ノード５の最遅着手日70から工程Fの日数を差し引いて求めます。よって、70－25＝45日となります。

クリティカルパス：最早着手日と最遅着手日が等しいノードを結ぶ経路がクリティカルパスです。アローダイアグラムを確認すると、A→D→G→Hがクリティカルパスであることが分かります。

以上より、Ｘ：50、Ｙ：45、クリティカルパス：A - D - G - Hとなり、選択肢アが正解です。`
  },
  {
    id: 5,
    title: "PERT3",
    source: "スマート問題集 3-3",
    category: "plan",
    question: "あるジョブは５つの作業工程A～Eで構成されている。各作業工程の作業日数と作業工程間の先行関係が下表に示されるとき、このジョブの最短完了日数の値として、最も適切なものはどれか。",
    choices: [
      "9",
      "11",
      "14",
      "16"
    ],
    answer: "ウ",
    hasDiagram: true,
    diagramType: "table5",
    explanation: `解答：ウ

ここが重要
　本問は各作業工程の作業日数と作業順序にもとづき、アローダイアグラムを作成して最短完了日数を求める問題です。
　各作業工程の先行関係に着目して、アローダイアグラムを作成し、クリティカルパスを見つけることがポイントです。
　過去の試験では、工程の作業時間と先行関係だけが示された表をもとに、アローダイアグラムを作成する問題が度々出題されていますので、作成手順をしっかり押さえておきましょう。

本問のアローダイアグラムを作成すると、次のようになります。

【作成の手順】
① 先行作業のない作業工程に着目する
→作業工程Ａが該当します
② 作業工程Ａが先行作業となっている工程に着目する
→作業工程Ｂ，Ｃが該当します。ノード２からＢ，Ｃの矢線を引き、それぞれノード３、ノード４で結びます
③ 作業工程Ｃが先行作業となっている工程に着目する
→作業工程Ｄが該当しますので、ノード３から矢線を引き、ノード４で結びます
④ 最後の作業工程Ｅの先行作業に着目する
→作業工程Ｂ，Ｄとなっていますので、ノード４からノード５で結ぶことで完成します

各作業工程の作業日数から最早着手日と最遅着手日を記入すると、クリティカルパス（Ａ→Ｃ→Ｄ→Ｅ）がわかります。

以上より、このジョブの最短完了日数の値は14となり、選択肢ウが正解となります。`
  },
  {
    id: 6,
    title: "CPM（Critical Path Method）",
    source: "スマート問題集 3-3",
    category: "control",
    question: "下表は、あるプロジェクト業務を構成する各作業の要件を示している。CPM（Critical Path Method）を適用して、最短プロジェクト遂行期間となる条件を達成したときの最小費用を下記の解答群から選べ。",
    choices: [
      "220万円",
      "240万円",
      "250万円",
      "280万円"
    ],
    answer: "ア",
    hasDiagram: true,
    diagramType: "table6",
    explanation: `解答：ア

ここが重要
　本問はPERTの応用知識として、CPM（Critical Path Method）によってプロジェクトを最短期間で遂行するときの最小費用を求める問題です。
　CPMは、費用を払うことにより各作業の所要時間が短縮できるとして、最小の費用でプロジェクトの遂行期間を最短にする最適解を求める手法です。

【解答手順】
手順１：最短所要期間をもとにアローダイアグラムを作成します。

手順２：クリティカルパスを特定し、クリティカルパス以外の余裕期間を求めます。クリティカルパスはA→B→Dです。余裕期間はノード4の1日間ですので、作業Cは2日間だけ短縮すればよい。

手順３：各作業の必要短縮期間×単位あたりの短縮費用を算出します。

以上より、短縮費用の総額は220万円となります。`
  },
  {
    id: 7,
    title: "ジョンソン法",
    source: "スマート問題集 3-3",
    category: "plan",
    question: "工程1（穴あけ）、工程2（塗装）の2つが連結された生産ラインで、4種類の製品A, B, C, Dを生産している。工程は、必ず1→2の順番で行われ、各工程は一度に一つの製品しか処理できないものとする。製品の生産順序を最適化して、全ての製品の作業を最短で終了させる場合の時間として、最も適切なものを選べ。(単位：分)",
    choices: [
      "50分",
      "32分",
      "28分",
      "37分"
    ],
    answer: "ウ",
    hasDiagram: true,
    diagramType: "table7",
    explanation: `解答：ウ

ここが重要
　本問はジョブショップスケジューリングの順序づけ法の1つ、ジョンソン法について問われています。
　ジョブショップスケジューリングは、複数の機械を用いて作業を行う際に、全体の作業時間が最短になるように作業や機械の順番を最適化する方法です。代表的な手法に、ディスパッチング法と順序づけ法があります。
●ディスパッチング法
　あらかじめ順序を決めずに、その都度ルールに基づいて作業を割り当てる方法です。
●順序づけ法（ジョンソン法）
　全体の作業期間が最も短くなるように作業の順序を決定する方法です。代表的なものにジョンソン法があります。

下図の例を用いて、ジョンソン法について説明します。
・3つの書類と宛名をPCで作成し、印刷した上で郵送する作業を計画しています。
・工程は「PCによる文書作成（工程X）」と「プリンタで印刷（工程Y）」の2つです。
・作業は文書作成（作業1～3）と、宛名（作業4）の4つです。
・工程には順序があり、書類を作成しないと、印刷できません。
・一方、書類は順番がなく、どの書類から作成しても構いません。
ジョンソン法を使えば、このような場合に最も短い期間で全ての作業が終了するスケジュールを作成することができます。では、具体的に手順を見てみましょう。

【ジョンソン法の手順】
手順1　作業時間が最短の作業を選ぶ。
手順2　それが前工程（この図では工程X）であれば、その作業を先頭に配置する。
　それが後工程（この図では工程Y）であれば、その作業を最後に配置する。
　既に作業が配置されている場合は、その作業の次に配置する。
手順3　その作業を対象から外し、手順1に戻り、残りの作業についてくり返す。

この手順に沿って作業の順番を決めると、115分で全ての作業が完了します。これが、最も短い作業時間となります。
ジョンソン法を用いる問題は、過去に何度か出題されています。設問の条件が問題ごとに多少違うので、しっかり確認してから回答しましょう。

本問の製品の生産順序をジョンソン法に従って考えてみましょう。
１	【手順1】全ての作業から最短のものを選びます。「製品C　工程2」です。【手順2】工程2は後工程ですから、この作業は最後に配置します。【手順3】製品Cを対象から外して、手順1に戻ります。
２	【手順1】製品C以外で作業時間が最短のものを選びます。「製品B　工程1」です。【手順2】工程1は前工程ですので、先頭に置きます。【手順3】製品Bを対象から外して、手順1に戻ります。
３	【手順1】残りの中から作業時間が最短のものを選びます。「製品A　工程2」です。【手順2】工程2は後工程ですので、「製品C 工程2」の手前に配置します。【手順3】製品Aを対象から外します。残りは、製品Dだけになるため、これで手順は終了です。製品Dは先頭の製品Bと、最後から2番目の製品Aの間に配置することになります。この結果、作業の順序は、製品B→製品D→製品A→製品Cになります。

これを、ガントチャートで示すとスケジュールとなります。

作業時間の合計 ＝ 3分（製品B 工程1）＋ 8分（製品D 工程1）＋ 10分（製品A 工程1）＋ 5分（製品A 工程2）＋ 2分（製品C 工程2）＝ 28分
上記より、作業時間は28分となります。よってウが正解です。`
  },
  {
    id: 8,
    title: "需要予測",
    source: "スマート問題集 3-3",
    category: "plan",
    question: "需要予測に関する記述として、最も不適切なものはどれか。",
    choices: [
      "加重移動平均法による予測で、重みをすべて同じにした場合、予測値は単純移動平均法と同一となる。",
      "単純移動平均法による予想で、ノイズを出来るだけ除去する場合には、用いるデータ数を減らせばよい。",
      "指数平滑法による予想で、直近の実績の影響を強く反映したい場合は、平滑化指数を大きくすればよい。",
      "加重平均法による予測で、過去のデータの影響を少なくしたい場合は、重みを減らせばよい。"
    ],
    answer: "イ",
    explanation: `解答：イ

ここが重要
　本問では需要予測の各手法の予測値が持つ性質が問われています。
　見込生産では、廃棄ロスや機会損失を最小にするために、生産計画を立てる前に、需要予測をすることが重要です。このため見込生産形態の企業は、さまざまな方法を使って需要予測の精度を高める努力をしています。
　代表的な需要予測の方法として、移動平均法と指数平滑法があります。
　ここで、（4月売上：100万円、5月売上：80万円、6月売上：120万円）の時の7月売上の予測を行うケースについて、それぞれの方法を説明します。

●単純移動平均法（移動平均法の1つ）
　過去数ヶ月間の実績の平均値を取ることで需要を予測します。そのため、一時的な売上の増減はノイズとして削減されます。また、平均を取る期間が長ければ長いほど、精度は高くなります。
・7月予測値 ＝（100＋80＋120）÷ 3 = 100万円

●加重平均法（移動平均法の1つ）
　過去のデータに異なる重みをつけて加重平均値を取ります。重みを付けることで、先ほどの単純移動平均法と比べて、直近の月の売上をより重視できます。例えば、4月の重みを2、5月を3、6月を5とした場合は、次のようになります。
・7月予測値 = Σ (売上 × 重み) / Σ 重み = (100×2 + 80×3 + 120×5) / (2 + 3 + 5) = 104万円

●指数平滑法
　直近の実績の値を重視する手法で、次の式で需要の予測値を求めます。
　来期予測値 ＝ 今期予測値 ＋ 平滑化指数 Ｘ （今期実績値 － 今期予測値）
　ここで、平滑化指数は、0と1の間の数値を取ります。平滑化指数が大きいほど、予測は直近の実績値に大きく左右されることになります。逆に、平滑化指数が小さいほど、予測は直近の実績値に左右されにくくなります。
　例えば、今月の売上の予測は100万円、今月の売上の実績は80万円で、平滑化指数を0.5としたとき、来期の売上の予測値は次のようになります。
・来期予測値 ＝ 100＋ 0.5 Ｘ （80 － 100） ＝ 90万円

　需要予測は過去に多く出題されている分野です。各需要予測の特徴の理解と合わせて、需要予測の計算も、しっかりとできるようにしておきましょう。

ア　○：
　加重移動平均法は、「予測値 ＝ Σ（売上Ｘ重み）÷ Σ重み」の式を用います。重みを全て同一にした場合は、「予測値 ＝ Σ（売上) ÷ 個数」となるので、移動平均法の結果と同一になります。よって記述は適切です。

イ　×：
　一時的な値の増減をノイズと呼びます。例えば、2ヶ月分の売上データの内、一方がセール月で売上が大幅に増えたデータであったとします。このデータを用いて平均をとると、セール月のデータの影響を強く受けることになります。しかし、12ヶ月分の売上データを用いた平均であれば、セール月の影響は緩和されます。このようにノイズを除去したい場合は、データ数を増やす必要があります。よって記述は不適切です。

ウ　○：
　指数平滑化法は、「来期予測値 ＝ 今期予測値 ＋ 平滑化指数 Ｘ （今期実績値 － 今期予測値）」の式を用います。ここで、平滑化指数を大きくすると、直近の実績の影響度も合わせて大きくなります。よって記述は適切です。

.エ　○：
　加重平均法では、各データに、それぞれの重みを乗じた値が、予測値に与える影響となります。このため影響を強くしたいデータの重みは増やし、逆に影響を弱くしたいデータの重みは減らします。よって記述は適切です。`
  },
  {
    id: 9,
    title: "生産統制",
    source: "スマート問題集 3-3",
    category: "control",
    question: "生産統制に関する記述として、最も適切なものはどれか。",
    choices: [
      "生産統制は、大きくわけて進捗管理、現品管理、余力管理、販売管理の4つから構成される。",
      "余力管理では、製品原価や作業者の負荷状況を管理し、むだな費用の発生を防止する。",
      "進捗管理では、入荷した資材の管理や、日程計画に対する仕事の進捗状況を管理する。",
      "現品管理では、部品や仕掛品の運搬や保管状況を管理し、部品の過不足を未然に防止する。"
    ],
    answer: "エ",
    explanation: `解答：エ

ここが重要
　本問では生産統制の構成とその内容について問われています。
　生産統制では、生産計画と実績に差異が発生しないように生産を統制し、納期を守ったり、適切な稼働率を維持するように活動します。
　生産統制は大きく分けて、進捗管理、現品管理、余力管理の3つから構成されます。それぞれ活動内容は次のとおりです。

●進捗管理（日程の管理 / 日程計画）
　日程計画に対して、仕事の進捗状況を把握し、日々の仕事の進み具合を調整する活動です。
●現品管理（物の管理 / 材料・部品計画）
　部品や仕掛品などの運搬や保管の状況を管理する活動です。どこに何が何個あるかを把握することで、部品の過不足による問題の発生を未然に防止します。
●余力管理（工数の管理 / 工数計画）
　工程や作業者の、現在の負荷状況と能力を把握し、余力や不足がある場合は、作業の再配分を行う活動です。余力が大きすぎると無駄が発生し、コストが増加します。逆に、余力が不足すると、納期遅延が発生します。このため、過剰な余力や不足分を適切に配分する必要があります。

　生産統制は過去に多く出題されている分野です。しかし比較的やさしい問題が多く、生産統制を構成している3つの活動の管理内容さえ把握していれば対応できる問題がほとんどです。得点源として、上記の3つの活動の管理内容はしっかりと覚えましょう。

ア　×：
　生産統制は、進捗管理、現品管理、余力管理の3つから構成されます。販売管理は生産統制には含まれません。よって記述は不適切です。

イ　×：
　余力管理は、作業者の負荷状況と余力を常に把握し、設備や人員などを適切に配分することで、コストの増大や納期の遅延を防止するための活動です。製品原価の把握は含みません。よって記述は不適切です。

ウ　×：
　進捗管理は、日程計画に対する仕事の進捗状況を把握、調整する活動です。入荷した資材の管理は、現品管理の活動の一部です。よって記述は不適切です。

エ　○：
　現品管理は、部品や仕掛品などの運搬や保管の状況を管理することで、部品の過不足等による問題を防止する活動です。よって記述は適切です。`
  },
  {
    id: 10,
    title: "生産の管理方式",
    source: "スマート問題集 3-3",
    category: "control",
    question: "生産の管理方式に関する記述として、最も適切なものはどれか。",
    choices: [
      "追番管理方式は、生産計画に対する実績の差異を容易に把握できるというメリットがある。",
      "オーダーエントリー方式では、すでに生産工程に製品があるため、顧客の個別の要求に対応するのは難しい。",
      "製番管理方式で生産された製品において、使用した部品の一部に欠陥が見つかった場合、その部品を作った時期を特定するのは難しい。",
      "生産座席予約システムでは、短納期の顧客要求に対しても、いつでも柔軟に生産の対応ができる。"
    ],
    answer: "ア",
    hasDiagram: true,
    diagramType: "explain_management",
    explanation: `解答：ア

ここが重要
　本問では生産管理の幾つかの管理方式について、その特徴が問われています。
　代表的な管理方式とその内容は次のようになっています。

●製番管理方式
　・概要：製品ごとに製番という固有の製造番号を発行し、製品を構成する全ての部品に対して同じ製番を付けて管理する方式。
　・適用：受注生産形態で多く用いられる。
　・メリット：製番を中心にすべてを管理するので、手配状況や進捗が把握しやすい。
　・デメリット：他の製品にも使う共通品目がある場合、共通番号に振り直したりする必要があり、管理が複雑になる。

●追番管理方式
　・概要：1番から順番に連続した番号をつける方式。（この番号を追番と呼ぶ）
　・適用：繰返し生産をする製品に多く用いられる。
　・メリット：追番は最後の番号が、累計生産台数と同じになるので、この追番を用いて、計画と実績の差異の管理や、累積生産量の管理が容易にできる。

●オーダーエントリー方式
　・概要：生産工程にある製品に対して、顧客のオーダーを引き当て、その顧客の要求に合わせ、製品仕様を変更し、オプションの仕様を決定する生産方式。
　・適用：自動車や、パソコンのメーカー直販など。
　・メリット：量産しながら、個々の顧客のニーズに対応可能。

●生産座席予約方式
　・概要：受注時に、製造設備の使用日程や資材の使用予定などにオーダーを割り付け、顧客が要求する納期通りに生産する方式。
　・適用：飛行機や電車の座席を予約するようなイメージで設備や資材を割り付け。
　・メリット：販売部門と生産部門がリアルタイムで情報を共有するため、双方の連携が取り易く、顧客に対して素早い納期回答ができる。
　・デメリット：座席に余裕がない状態では、短納期の注文要求に対して柔軟な対応が難しい。

　各生産管理方式の特徴については丸暗記ではなく、各管理方式の概要を踏まえた上で、なぜそうなるか、しっかり理解しましょう。

ア　○：
　追番管理方式は、連続した番号を付けていく生産方式です。最後の番号が生産台数と同じになるので、生産量が簡単に分かります。このため、計画に対する実績も容易に把握できます。よって記述は適切です。

イ　×：
　オーダーエントリー方式は、量産しながらも顧客の個別のニーズに対応できる管理方式で、自動車の生産に用いられています。個々の顧客の要求に合わせ、生産工程にある製品の製品仕様を変更したり、オプションの仕様を決定できます。よって記述は不適切です。

ウ　×：
　製番管理方式では、製品ごとに製番を発行し、全ての部品に対して同じ製番を付けて管理します。このため使用した部品に欠陥が見つかった場合、その部品の生産時期や購入時期を素早く追跡できます。よって記述は不適切です。

エ　×：
　生産座席予約システムは、納期回答を素早く出来るというメリットがあります。しかし、一方で設備や資材の予約が一杯で生産に余裕がない場合は、新たな注文に対して納期が遅くなるというデメリットがあります。よって記述は不適切です。`
  },
  {
    id: 11,
    title: "トヨタ生産方式",
    source: "スマート問題集 3-3",
    category: "control",
    question: "トヨタ生産方式に関する記述として、最も不適切なものはどれか。",
    choices: [
      "かんばんの枚数及びそこに指示される量は、生産量と同時に工程間の仕掛品の数も指示することになる。",
      "かんばんは、作業の指示をする生産指示かんばんと、運搬を表す運搬かんばんの2種類がある。",
      "プルシステムを導入して、効率的な生産を行うためには、最終組み立てラインの生産量の平準化が重要となる。",
      "JITは、必要なものを、必要な時に、必要な数だけ生産する方式で、これを実現するため、後工程引取り方式を採用している。"
    ],
    answer: "イ",
    hasDiagram: true,
    diagramType: "explain_toyota",
    explanation: `解答：イ

ここが重要
　本問ではトヨタ生産方式の内容について問われています。
　トヨタ生産方式は、無駄をできるだけ排除して、必要な数だけ生産する方式で、ジャストインタイムと、自働化という思想に基づいています。トヨタ生産方式の重要キーワードとしては次の内容があります。

●ジャストインタイム(JIT)
　必要なものを、必要な時に、必要な数だけ生産する方式です。ジャストインタイムは、後工程引取方式やプルシステムとも呼ばれ、後工程が使った分だけ前工程から引き取ることで余分な仕掛品を減らし、生産リードタイムを短縮することができます。ただし、最終組立工程の生産量が一定でないと、効率的に生産ができなくなるため、生産量の平準化が重要です。
●自働化
　自働化は、不良品を作らないための仕組みで、異常が発生したときに、機械を自動的に停止します。この時、どこで異常が発生したか一目で分かるように、「あんどん」というランプを点灯します。※注：自働化の「働」の字は、ニンベンがついています。
●かんばん方式
　後工程引取方式を実現するための情報伝達手段として、「生産指示かんばん」と「引取りかんばん」と呼ばれる2種類のかんばんを使います。生産指示かんばんは、作業の指示を表し、引取りかんばんは、運搬を表します。
　このかんばんによって、後工程から前工程に生産指示が出され、後工程が生産した分だけ、前工程で生産するため、無駄を極力排除することができます。

　かんばんは、JITを支える重要な役割を担っています。かんばんの種類や、かんばんがどのように移動することで、後工程引取方式が実現されているか、しっかりと理解しましょう。

ア　○：
　かんばんは、生産量と在庫量をコントロールする道具です。かんばんは、全ての生産工程（最初の工程から最終工程まで）の中を、循環しながら用いられます。このため、その枚数とそこに指示される量の総和は、ライン上の生産量と仕掛品の量を意味します。よって記述は適切です。

イ　×：
　かんばんの種類は、作業を指示する「生産指示かんばん」と、運搬を表す「引取りかんばん」の2種類です。よって記述は不適切です。（運搬かんばんではなく引取りかんばんです）

ウ　○：
　プルシステムとは、後工程引取り方式の別名です。後工程が使った量だけ前工程から引き取りますから、仮に最終組み立てラインの生産量のバラツキが大きいと、前工程は全てその影響を受けます。このため、すべての生産工程を効率的に稼働するためには、最終組み立てラインの平準化が不可欠です。よって記述は適切です。

エ　○：
　JITでは、後工程引取方式を採用しています。かんばんを情報伝達手段として、後工程から、必要なものを、必要な時に、必要な数だけ、生産するよう前工程に指示します。よって記述は適切です。`
  }
];

// ==========================================
// インラインSVG 描画コンポーネント
// ==========================================

// 汎用のSVG矢印マーカー
const SvgMarkers = () => (
  <defs>
    <marker id="arrow" viewBox="0 0 10 10" refX="20" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
      <path d="M 0 0 L 10 5 L 0 10 z" fill="#4B5563" />
    </marker>
    <marker id="arrow-red" viewBox="0 0 10 10" refX="20" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
      <path d="M 0 0 L 10 5 L 0 10 z" fill="#EF4444" />
    </marker>
  </defs>
);

// 汎用ノード
const SvgNode = ({ id, x, y, isCritical }) => (
  <g className="transition-all duration-300 hover:scale-105 origin-center">
    <circle 
      cx={x} 
      cy={y} 
      r="18" 
      fill={isCritical ? "#FEE2E2" : "#F3F4F6"} 
      stroke={isCritical ? "#EF4444" : "#4B5563"} 
      strokeWidth={isCritical ? "3" : "2"} 
      className="drop-shadow-sm"
    />
    <text 
      x={x} 
      y={y} 
      textAnchor="middle" 
      dominantBaseline="central" 
      fontSize="12" 
      className={`font-bold ${isCritical ? "fill-red-600" : "fill-gray-700"}`}
    >
      {id}
    </text>
  </g>
);

// 最早・最遅の箱
const EarliestLatestBox = ({ x, y, earliest, latest, isCritical, align = "top" }) => {
  const dy = align === "top" ? -42 : 24;
  return (
    <g transform={`translate(${x - 18}, ${y + dy})`} className="drop-shadow-sm">
      <rect 
        width="36" 
        height="26" 
        fill="#FFFFFF" 
        stroke={isCritical ? "#EF4444" : "#4B5563"} 
        strokeWidth="1.5" 
        rx="2"
      />
      <line x1="0" y1="13" x2="36" y2="13" stroke={isCritical ? "#EF4444" : "#4B5563"} strokeWidth="1" />
      <text x="18" y="7" textAnchor="middle" dominantBaseline="central" fontSize="9" className="fill-gray-600 font-semibold">{earliest}</text>
      <text x="18" y="19" textAnchor="middle" dominantBaseline="central" fontSize="9" className={`font-bold ${isCritical ? "fill-red-500" : "fill-gray-600"}`}>{latest}</text>
    </g>
  );
};

// 矢印線
const SvgArrow = ({ x1, y1, x2, y2, label, duration, isCritical, isDummy }) => {
  const mx = (x1 + x2) / 2;
  const my = (y1 + y2) / 2;
  
  // ラベル位置のオフセット計算 (真ん中より少し上にする)
  const angle = Math.atan2(y2 - y1, x2 - x1);
  const ox = -Math.sin(angle) * 12;
  const oy = Math.cos(angle) * 12;

  return (
    <g>
      <line 
        x1={x1} 
        y1={y1} 
        x2={x2} 
        y2={y2} 
        stroke={isCritical ? "#EF4444" : "#4B5563"} 
        strokeWidth={isCritical ? "3.5" : "2"} 
        strokeDasharray={isDummy ? "4,4" : undefined}
        markerEnd={isCritical ? "url(#arrow-red)" : "url(#arrow)"}
      />
      {!isDummy && label && (
        <text 
          x={mx + ox} 
          y={my + oy - 4} 
          textAnchor="middle" 
          fontSize="10" 
          className={`font-bold fill-slate-800 ${isCritical ? "fill-red-600" : "fill-slate-600"}`}
        >
          {label}:{duration}
        </text>
      )}
    </g>
  );
};

// --- 各問題/解説の個別図表コンポーネント ---

// 問題3 問題文用アローダイアグラム (最早最遅なし)
const DiagramProblem3 = () => (
  <div className="w-full overflow-x-auto p-4 bg-white rounded-xl shadow-inner border border-slate-100 my-4">
    <svg width="600" height="320" viewBox="0 0 600 320" className="mx-auto">
      <SvgMarkers />
      {/* 矢印 */}
      <SvgArrow x1={50} y1={160} x2={200} y2={60} label="A" duration="8日" />
      <SvgArrow x1={50} y1={160} x2={200} y2={160} label="B" duration="4日" />
      <SvgArrow x1={50} y1={160} x2={350} y2={260} label="C" duration="5日" />
      
      <SvgArrow x1={200} y1={60} x2={350} y2={60} label="D" duration="6日" />
      <SvgArrow x1={200} y1={160} x2={350} y2={60} label="E" duration="8日" />
      <SvgArrow x1={200} y1={160} x2={350} y2={160} label="F" duration="9日" />
      
      <SvgArrow x1={350} y1={160} x2={350} y2={260} label="G" duration="7日" />
      <SvgArrow x1={350} y1={60} x2={520} y2={160} label="H" duration="12日" />
      <SvgArrow x1={350} y1={160} x2={520} y2={160} label="I" duration="3日" />
      <SvgArrow x1={350} y1={260} x2={520} y2={160} label="J" duration="3日" />

      {/* ノード */}
      <SvgNode id="1" x={50} y={160} />
      <SvgNode id="2" x={200} y={60} />
      <SvgNode id="3" x={200} y={160} />
      <SvgNode id="4" x={350} y={60} />
      <SvgNode id="5" x={350} y={160} />
      <SvgNode id="6" x={350} y={260} />
      <SvgNode id="7" x={520} y={160} />
    </svg>
  </div>
);

// 問題3 解説用アローダイアグラム (最早最遅・クリティカルパスあり)
const DiagramExplanation3 = () => (
  <div className="w-full overflow-x-auto p-4 bg-white rounded-xl shadow-inner border border-slate-100 my-4">
    <div className="text-xs text-slate-500 mb-2 flex justify-end gap-4">
      <span className="flex items-center gap-1"><span className="w-3 h-0.5 bg-red-500 inline-block"></span>クリティカルパス</span>
      <span className="flex items-center gap-1"><span className="w-3 h-3 border border-slate-600 inline-block bg-white text-[8px] text-center leading-none">最早<hr className="border-slate-600"/>最遅</span>最早/最遅着手日</span>
    </div>
    <svg width="600" height="340" viewBox="0 0 600 340" className="mx-auto">
      <SvgMarkers />
      {/* 矢印 (A-D-H がクリティカル) */}
      <SvgArrow x1={50} y1={160} x2={200} y2={60} label="A" duration="8日" isCritical={true} />
      <SvgArrow x1={50} y1={160} x2={200} y2={160} label="B" duration="4日" />
      <SvgArrow x1={50} y1={160} x2={350} y2={260} label="C" duration="5日" />
      
      <SvgArrow x1={200} y1={60} x2={350} y2={60} label="D" duration="6日" isCritical={true} />
      <SvgArrow x1={200} y1={160} x2={350} y2={60} label="E" duration="8日" />
      <SvgArrow x1={200} y1={160} x2={350} y2={160} label="F" duration="9日" />
      
      <SvgArrow x1={350} y1={160} x2={350} y2={260} label="G" duration="7日" />
      <SvgArrow x1={350} y1={60} x2={520} y2={160} label="H" duration="12日" isCritical={true} />
      <SvgArrow x1={350} y1={160} x2={520} y2={160} label="I" duration="3日" />
      <SvgArrow x1={350} y1={260} x2={520} y2={160} label="J" duration="3日" />

      {/* ノード */}
      <SvgNode id="1" x={50} y={160} isCritical={true} />
      <SvgNode id="2" x={200} y={60} isCritical={true} />
      <SvgNode id="3" x={200} y={160} />
      <SvgNode id="4" x={350} y={60} isCritical={true} />
      <SvgNode id="5" x={350} y={160} />
      <SvgNode id="6" x={350} y={260} />
      <SvgNode id="7" x={520} y={160} isCritical={true} />

      {/* 最早・最遅の箱 */}
      <EarliestLatestBox x={50} y={160} earliest="0" latest="0" isCritical={true} align="top" />
      <EarliestLatestBox x={200} y={60} earliest="8" latest="8" isCritical={true} align="top" />
      <EarliestLatestBox x={200} y={160} earliest="4" latest="6" isCritical={false} align="top" />
      <EarliestLatestBox x={350} y={60} earliest="14" latest="14" isCritical={true} align="top" />
      <EarliestLatestBox x={350} y={160} earliest="13" latest="16" isCritical={false} align="top" />
      <EarliestLatestBox x={350} y={260} earliest="20" latest="23" isCritical={false} align="top" />
      <EarliestLatestBox x={520} y={160} earliest="26" latest="26" isCritical={true} align="top" />
    </svg>
  </div>
);

// 問題3 「ここが重要」の一般的な例題アローダイアグラム
const DiagramImportant3 = () => (
  <div className="w-full overflow-x-auto p-4 bg-white rounded-xl shadow-inner border border-slate-100 my-4">
    <div className="text-center font-bold text-sm mb-2 text-slate-700">◆アローダイアグラム (一般例題)</div>
    <svg width="600" height="340" viewBox="0 0 600 340" className="mx-auto">
      <SvgMarkers />
      {/* 矢印 (C-G-I がクリティカル) */}
      <SvgArrow x1={60} y1={160} x2={200} y2={60} label="A" duration="8日" />
      <SvgArrow x1={60} y1={160} x2={200} y2={160} label="B" duration="5日" />
      <SvgArrow x1={60} y1={160} x2={200} y2={260} label="C" duration="6日" isCritical={true} />
      
      <SvgArrow x1={200} y1={60} x2={350} y2={160} label="D" duration="6日" />
      <SvgArrow x1={200} y1={160} x2={350} y2={160} label="E" duration="10日" />
      <SvgArrow x1={200} y1={260} x2={350} y2={160} label="F" duration="4日" />
      
      <SvgArrow x1={200} y1={260} x2={350} y2={260} label="G" duration="8日" isCritical={true} />
      <SvgArrow x1={350} y1={160} x2={500} y2={180} label="H" duration="7日" />
      <SvgArrow x1={350} y1={260} x2={500} y2={180} label="I" duration="10日" isCritical={true} />

      {/* ノード */}
      <SvgNode id="1" x={60} y={160} isCritical={true} />
      <SvgNode id="2" x={200} y={60} />
      <SvgNode id="3" x={200} y={160} />
      <SvgNode id="4" x={200} y={260} isCritical={true} />
      <SvgNode id="5" x={350} y={160} />
      <SvgNode id="6" x={350} y={260} isCritical={true} />
      <SvgNode id="7" x={500} y={180} isCritical={true} />

      {/* 最早・最遅の箱 */}
      <EarliestLatestBox x={60} y={160} earliest="0" latest="0" isCritical={true} align="top" />
      <EarliestLatestBox x={200} y={60} earliest="8" latest="11" isCritical={false} align="bottom" />
      <EarliestLatestBox x={200} y={160} earliest="5" latest="7" isCritical={false} align="bottom" />
      <EarliestLatestBox x={200} y={260} earliest="6" latest="6" isCritical={true} align="bottom" />
      <EarliestLatestBox x={350} y={160} earliest="15" latest="17" isCritical={false} align="top" />
      <EarliestLatestBox x={350} y={260} earliest="14" latest="14" isCritical={true} align="bottom" />
      <EarliestLatestBox x={500} y={180} earliest="24" latest="24" isCritical={true} align="bottom" />
    </svg>
  </div>
);

// 問題4 問題文用アローダイアグラム (X, Y表記)
const DiagramProblem4 = () => (
  <div className="w-full overflow-x-auto p-4 bg-white rounded-xl shadow-inner border border-slate-100 my-4">
    <svg width="650" height="300" viewBox="0 0 650 300" className="mx-auto">
      <SvgMarkers />
      {/* 矢印 */}
      <SvgArrow x1={50} y1={150} x2={160} y2={150} label="A" duration="20" />
      <SvgArrow x1={160} y1={150} x2={280} y2={50} label="B" duration="25" />
      <SvgArrow x1={160} y1={150} x2={280} y2={150} label="D" duration="30" />
      <SvgArrow x1={160} y1={150} x2={280} y2={250} label="C" duration="15" />
      
      <SvgArrow x1={280} y1={50} x2={400} y2={150} isDummy={true} />
      <SvgArrow x1={280} y1={250} x2={400} y2={150} isDummy={true} />
      
      <SvgArrow x1={280} y1={50} x2={520} y2={150} label="E" duration="20" />
      <SvgArrow x1={400} y1={150} x2={520} y2={150} label="G" duration="20" />
      <SvgArrow x1={280} y1={250} x2={520} y2={150} label="F" duration="25" />
      
      <SvgArrow x1={520} y1={150} x2={620} y2={150} label="H" duration="10" />

      {/* ノード */}
      <SvgNode id="0" x={50} y={150} />
      <SvgNode id="1" x={160} y={150} />
      <SvgNode id="2" x={280} y={50} />
      <SvgNode id="3" x={280} y={250} />
      <SvgNode id="4" x={400} y={150} />
      <SvgNode id="5" x={520} y={150} />
      <SvgNode id="6" x={620} y={150} />

      {/* 箱 */}
      <EarliestLatestBox x={50} y={150} earliest="0" latest="0" isCritical={false} align="bottom" />
      <EarliestLatestBox x={160} y={150} earliest="20" latest="20" isCritical={false} align="bottom" />
      <EarliestLatestBox x={280} y={50} earliest="45" latest="X" isCritical={false} align="bottom" />
      <EarliestLatestBox x={280} y={250} earliest="35" latest="Y" isCritical={false} align="bottom" />
      <EarliestLatestBox x={400} y={150} earliest="50" latest="50" isCritical={false} align="bottom" />
      <EarliestLatestBox x={520} y={150} earliest="70" latest="70" isCritical={false} align="bottom" />
      <EarliestLatestBox x={620} y={150} earliest="80" latest="80" isCritical={false} align="bottom" />
    </svg>
  </div>
);

// 問題4 解説用アローダイアグラム (X=50, Y=45)
const DiagramExplanation4 = () => (
  <div className="w-full overflow-x-auto p-4 bg-white rounded-xl shadow-inner border border-slate-100 my-4">
    <svg width="650" height="300" viewBox="0 0 650 300" className="mx-auto">
      <SvgMarkers />
      {/* 矢印 (A-D-G-H がクリティカル) */}
      <SvgArrow x1={50} y1={150} x2={160} y2={150} label="A" duration="20" isCritical={true} />
      <SvgArrow x1={160} y1={150} x2={280} y2={50} label="B" duration="25" />
      <SvgArrow x1={160} y1={150} x2={280} y2={150} label="D" duration="30" isCritical={true} />
      <SvgArrow x1={160} y1={150} x2={280} y2={250} label="C" duration="15" />
      
      <SvgArrow x1={280} y1={50} x2={400} y2={150} isDummy={true} />
      <SvgArrow x1={280} y1={250} x2={400} y2={150} isDummy={true} />
      
      <SvgArrow x1={280} y1={50} x2={520} y2={150} label="E" duration="20" />
      <SvgArrow x1={400} y1={150} x2={520} y2={150} label="G" duration="20" isCritical={true} />
      <SvgArrow x1={280} y1={250} x2={520} y2={150} label="F" duration="25" />
      
      <SvgArrow x1={520} y1={150} x2={620} y2={150} label="H" duration="10" isCritical={true} />

      {/* ノード */}
      <SvgNode id="0" x={50} y={150} isCritical={true} />
      <SvgNode id="1" x={160} y={150} isCritical={true} />
      <SvgNode id="2" x={280} y={50} />
      <SvgNode id="3" x={280} y={250} />
      <SvgNode id="4" x={400} y={150} isCritical={true} />
      <SvgNode id="5" x={520} y={150} isCritical={true} />
      <SvgNode id="6" x={620} y={150} isCritical={true} />

      {/* 箱 */}
      <EarliestLatestBox x={50} y={150} earliest="0" latest="0" isCritical={true} align="bottom" />
      <EarliestLatestBox x={160} y={150} earliest="20" latest="20" isCritical={true} align="bottom" />
      <EarliestLatestBox x={280} y={50} earliest="45" latest="50" isCritical={false} align="bottom" />
      <EarliestLatestBox x={280} y={250} earliest="35" latest="45" isCritical={false} align="bottom" />
      <EarliestLatestBox x={400} y={150} earliest="50" latest="50" isCritical={true} align="bottom" />
      <EarliestLatestBox x={520} y={150} earliest="70" latest="70" isCritical={true} align="bottom" />
      <EarliestLatestBox x={620} y={150} earliest="80" latest="80" isCritical={true} align="bottom" />
    </svg>
  </div>
);

// 問題5 解説用アローダイアグラム (クリティカルパスA-C-D-E)
const DiagramExplanation5 = () => (
  <div className="w-full overflow-x-auto p-4 bg-white rounded-xl shadow-inner border border-slate-100 my-4">
    <svg width="600" height="240" viewBox="0 0 600 240" className="mx-auto">
      <SvgMarkers />
      {/* 矢印 (A, C, D, E がクリティカル) */}
      <SvgArrow x1={50} y1={100} x2={180} y2={100} label="A" duration="5" isCritical={true} />
      <SvgArrow x1={180} y1={100} x2={400} y2={100} label="B" duration="2" />
      <SvgArrow x1={180} y1={100} x2={290} y2={180} label="C" duration="4" isCritical={true} />
      <SvgArrow x1={290} y1={180} x2={400} y2={100} label="D" duration="2" isCritical={true} />
      <SvgArrow x1={400} y1={100} x2={530} y2={100} label="E" duration="3" isCritical={true} />

      {/* ノード */}
      <SvgNode id="1" x={50} y={100} isCritical={true} />
      <SvgNode id="2" x={180} y={100} isCritical={true} />
      <SvgNode id="3" x={290} y={180} isCritical={true} />
      <SvgNode id="4" x={400} y={100} isCritical={true} />
      <SvgNode id="5" x={530} y={100} isCritical={true} />

      {/* 箱 */}
      <EarliestLatestBox x={50} y={100} earliest="0" latest="0" isCritical={true} align="bottom" />
      <EarliestLatestBox x={180} y={100} earliest="5" latest="5" isCritical={true} align="bottom" />
      <EarliestLatestBox x={290} y={180} earliest="9" latest="9" isCritical={true} align="bottom" />
      <EarliestLatestBox x={400} y={100} earliest="11" latest="11" isCritical={true} align="bottom" />
      <EarliestLatestBox x={530} y={100} earliest="14" latest="14" isCritical={true} align="bottom" />
    </svg>
  </div>
);

// 問題6 解説用アローダイアグラム (CPM)
const DiagramExplanation6 = () => (
  <div className="w-full overflow-x-auto p-4 bg-white rounded-xl shadow-inner border border-slate-100 my-4">
    <div className="text-xs text-slate-500 mb-2 text-center">※最短期間にするために Bは1日、Cは2日、Dは3日短縮します (クリティカルパス: A-B-D)</div>
    <svg width="600" height="260" viewBox="0 0 600 260" className="mx-auto">
      <SvgMarkers />
      {/* 矢印 (A, B, D がクリティカル) */}
      <SvgArrow x1={50} y1={150} x2={180} y2={150} label="A" duration="6" isCritical={true} />
      <SvgArrow x1={180} y1={150} x2={300} y2={60} label="B" duration="3(4-1)" isCritical={true} />
      <SvgArrow x1={300} y1={60} x2={420} y2={150} isDummy={true} />
      
      {/* Cは3日(5-2)で実施、余裕1日 */}
      <SvgArrow x1={180} y1={150} x2={420} y2={150} label="C" duration="3(5-2)" />
      <SvgArrow x1={420} y1={150} x2={530} y2={150} label="D" duration="3(6-3)" isCritical={true} />

      {/* ノード */}
      <SvgNode id="1" x={50} y={150} isCritical={true} />
      <SvgNode id="2" x={180} y={150} isCritical={true} />
      <SvgNode id="3" x={300} y={60} isCritical={true} />
      <SvgNode id="4" x={420} y={150} isCritical={true} />
      <SvgNode id="5" x={530} y={150} isCritical={true} />

      {/* 箱 */}
      <EarliestLatestBox x={50} y={150} earliest="0" latest="0" isCritical={true} align="bottom" />
      <EarliestLatestBox x={180} y={150} earliest="6" latest="6" isCritical={true} align="bottom" />
      <EarliestLatestBox x={300} y={60} earliest="9" latest="9" isCritical={true} align="top" />
      <EarliestLatestBox x={420} y={150} earliest="8" latest="9" isCritical={false} align="bottom" />
      <EarliestLatestBox x={530} y={150} earliest="12" latest="12" isCritical={true} align="bottom" />

      <text x={420} y={210} textAnchor="middle" fontSize="10" className="fill-green-600 font-semibold">1日余裕があるためCは2日短縮で十分</text>
    </svg>
  </div>
);

// 問題7 「ここが重要」の一般的なジョンソン法例題ガントチャート
const GanttChartImportant7 = () => (
  <div className="w-full overflow-x-auto p-4 bg-white rounded-xl shadow-inner border border-slate-100 my-4 text-xs">
    <div className="text-center font-bold text-sm mb-3 text-slate-700">◆ガントチャート (一般例題: 合計115分)</div>
    <div className="flex flex-col gap-3 max-w-lg mx-auto">
      {/* 工程X */}
      <div className="flex items-center">
        <div className="w-16 font-bold text-slate-600">工程X (PC)</div>
        <div className="flex-1 flex h-8 border border-slate-300 rounded overflow-hidden">
          <div className="bg-amber-100 flex items-center justify-center font-bold border-r border-slate-300 text-slate-800" style={{ width: "13%" }}>B(15)</div>
          <div className="bg-amber-100 flex items-center justify-center font-bold border-r border-slate-300 text-slate-800" style={{ width: "30%" }}>C(35)</div>
          <div className="bg-amber-100 flex items-center justify-center font-bold border-r border-slate-300 text-slate-800" style={{ width: "35%" }}>A(40)</div>
          <div className="bg-amber-100 flex items-center justify-center font-bold text-slate-800" style={{ width: "9%" }}>D(10)</div>
          <div className="bg-slate-100" style={{ width: "13%" }}></div>
        </div>
      </div>
      {/* 工程Y */}
      <div className="flex items-center">
        <div className="w-16 font-bold text-slate-600">工程Y (PR)</div>
        <div className="flex-1 flex h-8 border border-slate-300 rounded overflow-hidden">
          <div className="bg-slate-200 flex items-center justify-center text-slate-400 text-[10px] border-r border-slate-300" style={{ width: "13%" }}>手待ち(15)</div>
          <div className="bg-blue-100 flex items-center justify-center font-bold border-r border-slate-300 text-slate-800" style={{ width: "43%" }}>B(50)</div>
          <div className="bg-blue-100 flex items-center justify-center font-bold border-r border-slate-300 text-slate-800" style={{ width: "22%" }}>C(25)</div>
          <div className="bg-blue-100 flex items-center justify-center font-bold border-r border-slate-300 text-slate-800" style={{ width: "17%" }}>A(20)</div>
          <div className="bg-blue-100 flex items-center justify-center font-bold text-slate-800" style={{ width: "5%" }}>D(5)</div>
        </div>
      </div>
      {/* タイムライン */}
      <div className="flex text-[10px] text-slate-400 pl-16 justify-between">
        <span>0分</span>
        <span>15分</span>
        <span>50分</span>
        <span>100分</span>
        <span>110分</span>
        <span>115分</span>
      </div>
    </div>
  </div>
);

// 問題7 実際のジョンソン法ガントチャート
const GanttChartExplanation7 = () => (
  <div className="w-full overflow-x-auto p-4 bg-white rounded-xl shadow-inner border border-slate-100 my-4 text-xs">
    <div className="text-center font-bold text-sm mb-3 text-slate-700">◆最適化されたガントチャート (最短28分)</div>
    <div className="flex flex-col gap-3 max-w-lg mx-auto">
      {/* 工程1 */}
      <div className="flex items-center">
        <div className="w-24 font-bold text-slate-600">工程1 (穴あけ)</div>
        <div className="flex-1 flex h-8 border border-slate-300 rounded overflow-hidden">
          <div className="bg-amber-100 flex items-center justify-center font-bold border-r border-slate-300 text-slate-800" style={{ width: "10.7%" }}>B(3)</div>
          <div className="bg-amber-100 flex items-center justify-center font-bold border-r border-slate-300 text-slate-800" style={{ width: "28.6%" }}>D(8)</div>
          <div className="bg-amber-100 flex items-center justify-center font-bold border-r border-slate-300 text-slate-800" style={{ width: "35.7%" }}>A(10)</div>
          <div className="bg-amber-100 flex items-center justify-center font-bold text-slate-800" style={{ width: "14.3%" }}>C(4)</div>
          <div className="bg-slate-100" style={{ width: "10.7%" }}></div>
        </div>
      </div>
      {/* 工程2 */}
      <div className="flex items-center">
        <div className="w-24 font-bold text-slate-600">工程2 (塗装)</div>
        <div className="flex-1 flex h-8 border border-slate-300 rounded overflow-hidden">
          <div className="bg-slate-200 flex items-center justify-center text-slate-400 text-[9px] border-r border-slate-300" style={{ width: "10.7%" }}>待ち(3)</div>
          <div className="bg-blue-100 flex items-center justify-center font-bold border-r border-slate-300 text-slate-800" style={{ width: "25%" }}>B(7)</div>
          <div className="bg-slate-200 flex items-center justify-center text-slate-400 text-[9px] border-r border-slate-300" style={{ width: "3.6%" }}>手待ち(1)</div>
          <div className="bg-blue-100 flex items-center justify-center font-bold border-r border-slate-300 text-slate-800" style={{ width: "21.4%" }}>D(6)</div>
          <div className="bg-slate-200 flex items-center justify-center text-slate-400 text-[9px] border-r border-slate-300" style={{ width: "14.3%" }}>手待ち(4)</div>
          <div className="bg-blue-100 flex items-center justify-center font-bold border-r border-slate-300 text-slate-800" style={{ width: "17.9%" }}>A(5)</div>
          <div className="bg-blue-100 flex items-center justify-center font-bold text-slate-800" style={{ width: "7.1%" }}>C(2)</div>
        </div>
      </div>
      {/* タイムライン */}
      <div className="flex text-[10px] text-slate-400 pl-24 justify-between">
        <span>0分</span>
        <span>3分</span>
        <span>10分</span>
        <span>11分</span>
        <span>17分</span>
        <span>21分</span>
        <span>26分</span>
        <span>28分</span>
      </div>
    </div>
  </div>
);

// 問題10 製番管理方式 & 追番管理方式 説明図表
const ExplainManagementDiagram = () => (
  <div className="w-full space-y-4 my-4">
    {/* 製番管理方式 */}
    <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
      <div className="text-center font-bold text-sm mb-2 text-slate-700">◆製番管理方式 (受注毎に固有番号 0123 を付与)</div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs text-center">
        <div className="p-2 bg-white rounded border shadow-sm">
          <div className="font-bold text-slate-500">1. 受注 & 製番付与</div>
          <div className="mt-1 text-slate-800 font-bold bg-amber-50 rounded p-1 border border-amber-200">製番: 0123</div>
        </div>
        <div className="p-2 bg-white rounded border shadow-sm">
          <div className="font-bold text-slate-500">2. 図面 & 指示書</div>
          <div className="mt-1 text-slate-800 font-bold bg-amber-50 rounded p-1 border border-amber-200">製番: 0123</div>
        </div>
        <div className="p-2 bg-white rounded border shadow-sm">
          <div className="font-bold text-slate-500">3. 部品構成 & 発注</div>
          <div className="mt-1 text-slate-800 font-bold bg-amber-50 rounded p-1 border border-amber-200">製番: 0123</div>
        </div>
        <div className="p-2 bg-white rounded border shadow-sm">
          <div className="font-bold text-slate-500">4. 製造原価計算</div>
          <div className="mt-1 text-slate-800 font-bold bg-amber-50 rounded p-1 border border-amber-200">製番: 0123</div>
        </div>
      </div>
    </div>

    {/* 追番管理方式 */}
    <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs">
      <div className="text-center font-bold text-sm mb-2 text-slate-700">◆追番管理方式 (累積生産台数を一元管理)</div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[360px] text-center border-collapse bg-white rounded overflow-hidden shadow-sm">
          <thead>
            <tr className="bg-slate-100">
              <th className="p-2 border font-bold">対象</th>
              <th className="p-2 border font-bold">4月1日</th>
              <th className="p-2 border font-bold">4月2日</th>
              <th className="p-2 border font-bold">4月3日</th>
              <th className="p-2 border font-bold">4月4日</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="p-2 border font-bold bg-slate-50">製品A生産数</td>
              <td className="p-2 border">200台</td>
              <td className="p-2 border">200台</td>
              <td className="p-2 border">200台</td>
              <td className="p-2 border">200台</td>
            </tr>
            <tr className="bg-amber-50">
              <td className="p-2 border font-bold bg-amber-100">製品追番</td>
              <td className="p-2 border font-bold">1001~1200</td>
              <td className="p-2 border font-bold">1201~1400</td>
              <td className="p-2 border font-bold">1401~1600</td>
              <td className="p-2 border font-bold">1601~1800</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
);

// 問題11 かんばん方式 説明図表
const ExplainToyotaDiagram = () => (
  <div className="w-full p-4 bg-slate-50 rounded-xl border border-slate-200 my-4 text-xs">
    <div className="text-center font-bold text-sm mb-3 text-slate-700">◆かんばん方式の情報伝達プロセス</div>
    <div className="flex flex-col md:flex-row items-center justify-around gap-4">
      {/* 前工程 */}
      <div className="p-3 bg-white rounded-lg border border-slate-300 text-center w-full md:w-1/3 shadow-sm">
        <div className="font-bold text-slate-600 bg-slate-100 p-1 rounded mb-2">前工程 (工程1)</div>
        <p className="text-slate-500">引取りかんばんに従い部品を製造し、仕掛品として一時保管</p>
      </div>

      {/* かんばん指示 */}
      <div className="p-3 bg-amber-50 rounded-lg border border-amber-300 text-center w-full md:w-1/3 shadow-sm">
        <div className="font-bold text-amber-700 bg-amber-100 p-1 rounded mb-1">【引取りかんばん】</div>
        <div className="font-mono font-bold text-slate-800">
          工程2 → 工程1<br />
          品番: 0123 / 数量: 2ケース
        </div>
        <div className="text-[10px] text-slate-400 mt-1">※後工程が使用した分だけ引取る</div>
      </div>

      {/* 後工程 */}
      <div className="p-3 bg-white rounded-lg border border-slate-300 text-center w-full md:w-1/3 shadow-sm">
        <div className="font-bold text-slate-600 bg-slate-100 p-1 rounded mb-2">後工程 (工程2)</div>
        <p className="text-slate-500">必要な時に、前工程から必要な数だけの仕掛品を引き取る</p>
      </div>
    </div>
  </div>
);

// ==========================================
// ローディングスピナー
// ==========================================
const LoadingSpinner = ({ message }) => (
  <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center p-4">
    <div className="relative">
      <div className="w-16 h-16 border-4 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin"></div>
      <div className="w-16 h-16 border-4 border-emerald-500/10 border-t-emerald-500 rounded-full animate-spin absolute top-0 left-0 rotate-45"></div>
    </div>
    <p className="mt-6 text-slate-300 text-sm font-medium tracking-wider animate-pulse">{message}</p>
  </div>
);

// ==========================================
// ログイン・認証画面 (AuthBarrier)
// ==========================================
const LoginScreen = ({ passcode, setPasscode, handleLogin, syncLoading }) => {
  const [error, setError] = useState("");

  const onSubmit = (e) => {
    e.preventDefault();
    if (!passcode.trim()) {
      setError("合言葉を入力してください");
      return;
    }
    setError("");
    handleLogin(passcode.trim());
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 relative overflow-hidden">
      {/* 背景の装飾グラデーション */}
      <div className="absolute top-[-20%] left-[-20%] w-[60%] h-[60%] rounded-full bg-indigo-950/20 blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-[-20%] right-[-20%] w-[60%] h-[60%] rounded-full bg-emerald-950/20 blur-[120px] pointer-events-none"></div>

      <div className="w-full max-w-md bg-slate-900/80 backdrop-blur-md rounded-2xl border border-slate-800 p-8 shadow-2xl relative z-10">
        <div className="text-center mb-8">
          <div className="inline-flex p-3 bg-indigo-500/10 rounded-xl text-indigo-400 mb-3 border border-indigo-500/20">
            <BookOpen className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-black text-white tracking-tight">スマート問題集 3-3</h1>
          <p className="text-sm text-slate-400 mt-2 font-medium">生産計画と生産統制 同期システム</p>
        </div>

        <form onSubmit={onSubmit} className="space-y-6">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">ユーザー識別合言葉</label>
            <input 
              type="text" 
              placeholder="例: my-study-key"
              value={passcode}
              onChange={(e) => setPasscode(e.target.value)}
              className="w-full px-4 py-3 bg-slate-950 rounded-xl border border-slate-800 text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all font-mono"
            />
            <p className="text-[10px] text-slate-500 mt-2 leading-relaxed">
              ※他の端末でも同じ合言葉を入力することで、学習履歴・進捗データを完全に同期・復元できます。
            </p>
          </div>

          {error && (
            <div className="flex items-center gap-2 text-xs font-bold text-red-400 bg-red-500/10 p-3 rounded-lg border border-red-500/20">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <button 
            type="submit" 
            disabled={syncLoading}
            className="w-full py-3.5 bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 text-white font-bold rounded-xl shadow-lg shadow-indigo-500/20 active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {syncLoading ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>データを同期中...</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4" />
                <span>学習を開始する (同期)</span>
              </>
            )}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-slate-800/80 text-center">
          <p className="text-xs text-slate-500">Powered by Antigravity Cloud Sync</p>
        </div>
      </div>
    </div>
  );
};

// ==========================================
// メインアプリケーションコンポーネント
// ==========================================
export default function App() {
  // 認証関連
  const [authLoading, setAuthLoading] = useState(true);
  const [syncLoading, setSyncLoading] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passcode, setPasscode] = useState("");

  // クイズ進捗・履歴
  const [progressIndex, setProgressIndex] = useState(0);
  const [progressMode, setProgressMode] = useState("all"); // "all" | "wrong" | "review"
  const [history, setHistory] = useState({}); // { [qId]: { isCorrect: boolean, time: string, choice: number } }
  const [reviews, setReviews] = useState({}); // { [qId]: boolean }

  // 途中再開Pendingダイアログ用
  const [hasResumePending, setHasResumePending] = useState(false);
  const [savedProgress, setSavedProgress] = useState(null); // { index, mode }

  // UI状態
  const [currentView, setCurrentView] = useState("dashboard"); // "dashboard" | "quiz"
  const [selectedAnswer, setSelectedAnswer] = useState(null); // クイズ回答インデックス

  // 1. 初期匿名認証
  useEffect(() => {
    const initAuth = async () => {
      console.log("Firebase Auth 匿名サインイン開始");
      try {
        await signInAnonymously(auth);
        console.log("Firebase Auth 匿名サインイン成功");
      } catch (err) {
        console.error("Firebase Auth 匿名サインイン失敗:", err);
      } finally {
        setAuthLoading(false);
      }
    };
    initAuth();
  }, []);

  // 2. ログイン & 進捗・履歴同期
  const handleLogin = async (inputPasscode) => {
    setSyncLoading(true);
    console.log(`Firestoreからデータフェッチ開始: 合言葉 = ${inputPasscode}`);
    try {
      const docRef = doc(db, "users", `${APP_ID}_${inputPasscode}`);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data();
        console.log("Firestore ユーザー履歴発見:", data);
        setHistory(data.history || {});
        setReviews(data.reviews || {});
        
        // 中断進捗があるかチェック
        const idx = data.progressIndex || 0;
        const mode = data.progressMode || "all";
        
        if (idx > 0) {
          console.log(`途中再開Pending進捗あり: index = ${idx}, mode = ${mode}`);
          setSavedProgress({ index: idx, mode });
          setHasResumePending(true);
        }
      } else {
        console.log("新規ユーザーデータ作成します。");
        // 初期ドキュメント作成
        const initialData = {
          history: {},
          reviews: {},
          progressIndex: 0,
          progressMode: "all",
          updatedAt: new Date().toISOString()
        };
        await setDoc(docRef, initialData);
      }
      
      setPasscode(inputPasscode);
      setIsAuthenticated(true);
      console.log("ログイン＆同期完了");
    } catch (err) {
      console.error("Firestore接続失敗、ローカルフォールバックします:", err);
      // 通信エラーでもアプリが動くようにローカルフォールバック
      setHistory({});
      setReviews({});
      setIsAuthenticated(true);
    } finally {
      setSyncLoading(false);
    }
  };

  // 3. データ保存ロジック (Firestore同期)
  const saveProgressToFirestore = async (newIdx, newMode, newHistory, newReviews) => {
    try {
      const docRef = doc(db, "users", `${APP_ID}_${passcode}`);
      await setDoc(docRef, {
        progressIndex: newIdx,
        progressMode: newMode,
        history: newHistory,
        reviews: newReviews,
        updatedAt: new Date().toISOString()
      }, { merge: true });
      console.log(`Firestore進捗保存成功: Index=${newIdx}, Mode=${newMode}`);
    } catch (err) {
      console.error("Firestore進捗保存失敗:", err);
    }
  };

  // クイズ問題リストのフィルタリング
  const getFilteredQuestions = (mode) => {
    switch (mode) {
      case "wrong":
        return QUESTIONS.filter(q => history[q.id] && !history[q.id].isCorrect);
      case "review":
        return QUESTIONS.filter(q => reviews[q.id]);
      case "all":
      default:
        return QUESTIONS;
    }
  };

  const currentQuestions = getFilteredQuestions(progressMode);
  const currentQuestion = currentQuestions[progressIndex];

  // クイズ回答処理
  const handleAnswer = (choiceIdx, choiceText) => {
    if (selectedAnswer !== null) return; // 回答済みならガード
    
    setSelectedAnswer(choiceIdx);
    const qId = currentQuestion.id;
    const isCorrect = choiceText.startsWith(currentQuestion.answer);

    const updatedHistory = {
      ...history,
      [qId]: {
        isCorrect,
        time: new Date().toISOString(),
        choice: choiceIdx
      }
    };
    setHistory(updatedHistory);

    // 次の問題インデックスの算出
    const nextIdx = progressIndex + 1;
    const isFinished = nextIdx >= currentQuestions.length;
    const finalIdx = isFinished ? 0 : nextIdx;

    console.log(`解答保存: 問題ID=${qId}, 正誤=${isCorrect}, 次のIndex=${finalIdx}`);
    // Firestore同期
    saveProgressToFirestore(finalIdx, progressMode, updatedHistory, reviews);
  };

  // 要復習トグルの更新
  const handleReviewToggle = (qId) => {
    const updatedReviews = {
      ...reviews,
      [qId]: !reviews[qId]
    };
    setReviews(updatedReviews);
    saveProgressToFirestore(progressIndex, progressMode, history, updatedReviews);
  };

  // 途中再開の確認ダイアログ
  const handleResume = (shouldResume) => {
    setHasResumePending(false);
    if (shouldResume && savedProgress) {
      console.log(`途中再開を実行: Index=${savedProgress.index}, Mode=${savedProgress.mode}`);
      setProgressMode(savedProgress.mode);
      setProgressIndex(savedProgress.index);
      setCurrentView("quiz");
    } else {
      console.log("新規セッションを開始します。");
      setProgressIndex(0);
      saveProgressToFirestore(0, progressMode, history, reviews);
    }
  };

  // 進捗リセット
  const handleResetProgress = () => {
    if (window.confirm("これまでの進捗（何問目まで進んだか）を最初からやり直しますか？ (※解答履歴は消えません)")) {
      setProgressIndex(0);
      saveProgressToFirestore(0, progressMode, history, reviews);
      setSelectedAnswer(null);
    }
  };

  // レーダーチャートデータの計算
  const getRadarData = () => {
    const totalCount = QUESTIONS.length;
    const answeredCount = Object.keys(history).length;
    const correctCount = Object.values(history).filter(h => h.isCorrect).length;

    // 総合進捗率 (回答した割合)
    const progressRate = totalCount ? Math.round((answeredCount / totalCount) * 100) : 0;
    // 全問正解率 (全問題に対する正解数)
    const totalAccuracyRate = totalCount ? Math.round((correctCount / totalCount) * 100) : 0;
    // 回答正確性 (回答した中での正答率)
    const answeredAccuracyRate = answeredCount ? Math.round((correctCount / answeredCount) * 100) : 0;

    // カテゴリ1: 生産計画・スケジュール (問題1〜5, 7, 8)
    const cat1Questions = QUESTIONS.filter(q => q.category === "plan");
    const cat1Answered = cat1Questions.filter(q => history[q.id]);
    const cat1Accuracy = cat1Answered.length ? Math.round((cat1Answered.filter(q => history[q.id].isCorrect).length / cat1Answered.length) * 100) : 0;

    // カテゴリ2: 生産統制・方式 (問題6, 9, 10, 11)
    const cat2Questions = QUESTIONS.filter(q => q.category === "control");
    const cat2Answered = cat2Questions.filter(q => history[q.id]);
    const cat2Accuracy = cat2Answered.length ? Math.round((cat2Answered.filter(q => history[q.id].isCorrect).length / cat2Answered.length) * 100) : 0;

    return [
      { subject: "総合進捗率", A: progressRate, fullMark: 100 },
      { subject: "全問正解率", A: totalAccuracyRate, fullMark: 100 },
      { subject: "回答正確性", A: answeredAccuracyRate, fullMark: 100 },
      { subject: "生産計画", A: cat1Accuracy, fullMark: 100 },
      { subject: "生産統制", A: cat2Accuracy, fullMark: 100 }
    ];
  };

  // Loading 表示
  if (authLoading) {
    return <LoadingSpinner message="Firebase 接続初期化中..." />;
  }

  // ログイン画面表示
  if (!isAuthenticated) {
    return (
      <LoginScreen 
        passcode={passcode} 
        setPasscode={setPasscode} 
        handleLogin={handleLogin} 
        syncLoading={syncLoading} 
      />
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col font-sans selection:bg-indigo-500/30 selection:text-indigo-200">
      
      {/* ヘッダー */}
      <header className="sticky top-0 z-30 bg-slate-900/80 backdrop-blur-md border-b border-slate-800">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="p-2 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-lg shadow-md shadow-indigo-500/10">
              <BookOpen className="w-5 h-5 text-white" />
            </span>
            <div>
              <h1 className="text-base font-black tracking-tight text-white leading-none">スマート問題集 3-3</h1>
              <p className="text-[10px] text-slate-400 mt-1 font-medium">生産計画と生産統制</p>
            </div>
          </div>
          <div className="flex items-center gap-3 text-xs">
            <span className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 bg-slate-800 border border-slate-700/80 rounded-full text-slate-400 font-mono">
              <User className="w-3.5 h-3.5" />
              <span>{passcode}</span>
            </span>
            <button 
              onClick={() => {
                if (window.confirm("ログアウトして別の合言葉で接続しますか？")) {
                  setIsAuthenticated(false);
                  setPasscode("");
                }
              }}
              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 font-semibold rounded-lg transition-all"
            >
              アカウント変更
            </button>
          </div>
        </div>
      </header>

      {/* 途中再開 Pending 確認ダイアログ */}
      {hasResumePending && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center gap-3 text-amber-500">
              <span className="p-2 bg-amber-500/10 rounded-lg border border-amber-500/20"><Clock className="w-6 h-6" /></span>
              <h3 className="font-bold text-lg text-white">前回の学習データ復元</h3>
            </div>
            <p className="text-sm text-slate-300 leading-relaxed">
              前回は【問題{savedProgress.index + 1}】まで進んでいます。
              中断したモード（{savedProgress.mode === "all" ? "すべての問題" : savedProgress.mode === "wrong" ? "前回不正解の問題" : "要復習の問題"}）の続きから再開しますか？
            </p>
            <div className="flex gap-3 pt-2">
              <button 
                onClick={() => handleResume(false)}
                className="flex-1 py-2.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 font-semibold rounded-xl transition-all"
              >
                最初から始める
              </button>
              <button 
                onClick={() => handleResume(true)}
                className="flex-1 py-2.5 bg-indigo-500 hover:bg-indigo-600 text-white font-bold rounded-xl transition-all"
              >
                続きから再開
              </button>
            </div>
          </div>
        </div>
      )}

      {/* メインコンテンツ */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 py-8">
        
        {/* ==========================================
            ダッシュボード表示
            ========================================== */}
        {currentView === "dashboard" && (
          <div className="space-y-8 animate-fadeIn">
            
            {/* 上部サマリー */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              {/* コントロールパネル / モード選択 */}
              <div className="bg-slate-900 border border-slate-800/80 rounded-2xl p-6 flex flex-col justify-between shadow-xl">
                <div>
                  <h2 className="text-lg font-bold text-white flex items-center gap-2 mb-4">
                    <List className="w-5 h-5 text-indigo-400" />
                    <span>出題モードの選択</span>
                  </h2>
                  <div className="space-y-3">
                    <button 
                      onClick={() => setProgressMode("all")}
                      className={`w-full p-4 rounded-xl text-left border flex items-center justify-between transition-all ${
                        progressMode === "all" 
                          ? "bg-indigo-500/10 border-indigo-500 text-white font-bold" 
                          : "bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700"
                      }`}
                    >
                      <div>
                        <div>すべての問題</div>
                        <div className="text-[10px] text-slate-500 mt-1 font-normal">全11問を順番に解く</div>
                      </div>
                      <span className="text-xs bg-slate-800 px-2 py-1 rounded text-slate-400 font-mono">{QUESTIONS.length}問</span>
                    </button>
                    <button 
                      onClick={() => setProgressMode("wrong")}
                      className={`w-full p-4 rounded-xl text-left border flex items-center justify-between transition-all ${
                        progressMode === "wrong" 
                          ? "bg-red-500/10 border-red-500 text-white font-bold" 
                          : "bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700"
                      }`}
                    >
                      <div>
                        <div>前回不正解の問題のみ</div>
                        <div className="text-[10px] text-slate-500 mt-1 font-normal">間違えた問題の復習</div>
                      </div>
                      <span className="text-xs bg-slate-800 px-2 py-1 rounded text-slate-400 font-mono">
                        {QUESTIONS.filter(q => history[q.id] && !history[q.id].isCorrect).length}問
                      </span>
                    </button>
                    <button 
                      onClick={() => setProgressMode("review")}
                      className={`w-full p-4 rounded-xl text-left border flex items-center justify-between transition-all ${
                        progressMode === "review" 
                          ? "bg-emerald-500/10 border-emerald-500 text-white font-bold" 
                          : "bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700"
                      }`}
                    >
                      <div>
                        <div>要復習の問題のみ</div>
                        <div className="text-[10px] text-slate-500 mt-1 font-normal">チェックを入れた問題を復習</div>
                      </div>
                      <span className="text-xs bg-slate-800 px-2 py-1 rounded text-slate-400 font-mono">
                        {QUESTIONS.filter(q => reviews[q.id]).length}問
                      </span>
                    </button>
                  </div>
                </div>

                <div className="mt-6 flex gap-3">
                  {progressIndex > 0 && (
                    <button
                      onClick={handleResetProgress}
                      title="進捗を最初からやり直す"
                      className="p-3 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 rounded-xl transition-all"
                    >
                      <RotateCcw className="w-5 h-5" />
                    </button>
                  )}
                  <button 
                    disabled={currentQuestions.length === 0}
                    onClick={() => {
                      setSelectedAnswer(null);
                      setCurrentView("quiz");
                    }}
                    className="flex-1 py-3.5 bg-indigo-500 hover:bg-indigo-600 disabled:bg-slate-800 disabled:text-slate-600 text-white font-bold rounded-xl shadow-lg shadow-indigo-500/20 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
                  >
                    <Play className="w-4 h-4 fill-current" />
                    <span>学習を開始する (問題{progressIndex + 1})</span>
                  </button>
                </div>
              </div>

              {/* 分析レーダーチャート */}
              <div className="bg-slate-900 border border-slate-800/80 rounded-2xl p-6 flex flex-col items-center justify-center shadow-xl md:col-span-2 relative overflow-hidden">
                <div className="absolute top-4 left-6 text-lg font-bold text-white flex items-center gap-2">
                  <BarChart2 className="w-5 h-5 text-emerald-400" />
                  <span>学習状況分析</span>
                </div>
                <div className="w-full h-[240px] mt-6 flex items-center justify-center">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart cx="50%" cy="50%" radius="70%" data={getRadarData()}>
                      <PolarGrid stroke="#334155" />
                      <PolarAngleAxis dataKey="subject" stroke="#94a3b8" fontSize={11} fontWeight="600" />
                      <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="#475569" fontSize={8} />
                      <Radar name="進捗率/正確性" dataKey="A" stroke="#6366f1" fill="#6366f1" fillOpacity={0.35} />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
              </div>

            </div>

            {/* 問題一覧 & 解答状況グリッド */}
            <div className="bg-slate-900 border border-slate-800/80 rounded-2xl p-6 shadow-xl">
              <h3 className="text-base font-bold text-white mb-4 flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-indigo-400" />
                <span>問題別 回答履歴一覧</span>
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {QUESTIONS.map((q) => {
                  const h = history[q.id];
                  const rev = reviews[q.id];
                  return (
                    <div 
                      key={q.id}
                      className="p-4 bg-slate-950/50 border border-slate-800/80 rounded-xl flex items-center justify-between"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-mono font-bold text-slate-500">Q{q.id}</span>
                          <span className="text-xs font-semibold text-slate-400 bg-slate-800 px-1.5 py-0.5 rounded">
                            {q.source}
                          </span>
                        </div>
                        <div className="text-sm font-bold text-slate-200 line-clamp-1">{q.title}</div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        {/* 要復習フラグ */}
                        <button 
                          onClick={() => handleReviewToggle(q.id)}
                          className={`p-1.5 rounded-lg border transition-all ${
                            rev 
                              ? "bg-emerald-500/10 border-emerald-500 text-emerald-400" 
                              : "bg-slate-900 border-slate-800 text-slate-600 hover:text-slate-400"
                          }`}
                          title={rev ? "要復習から外す" : "要復習リストに追加"}
                        >
                          <HelpCircle className="w-4 h-4" />
                        </button>
                        
                        {/* 解答状況バッジ */}
                        {h ? (
                          h.isCorrect ? (
                            <span className="px-2.5 py-1 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-lg text-xs font-bold flex items-center gap-1">
                              <Check className="w-3.5 h-3.5" /> 正解
                            </span>
                          ) : (
                            <span className="px-2.5 py-1 bg-red-500/10 border border-red-500/20 text-red-400 rounded-lg text-xs font-bold flex items-center gap-1">
                              <X className="w-3.5 h-3.5" /> 不正解
                            </span>
                          )
                        ) : (
                          <span className="px-2.5 py-1 bg-slate-800 border border-slate-700 text-slate-500 rounded-lg text-xs font-bold">
                            未着手
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

          </div>
        )}

        {/* ==========================================
            クイズ出題画面
            ========================================== */}
        {currentView === "quiz" && (
          <div className="max-w-4xl mx-auto space-y-6 animate-fadeIn">
            
            {/* 上部パンくず & 操作 */}
            <div className="flex items-center justify-between">
              <button 
                onClick={() => {
                  console.log("クイズ画面からダッシュボードへ遷移");
                  setCurrentView("dashboard");
                }}
                className="flex items-center gap-1 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-semibold transition-all"
              >
                <Home className="w-4 h-4" />
                <span>ダッシュボードに戻る</span>
              </button>
              
              <div className="text-xs font-mono font-bold text-slate-500">
                進捗: {progressIndex + 1} / {currentQuestions.length} 問
              </div>
            </div>

            {/* 問題本体カード */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xl space-y-6">
              
              {/* ヘッダ情報 */}
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-1 bg-indigo-500/10 border border-indigo-500/20 rounded-lg text-indigo-400 text-xs font-bold">
                  問題 {currentQuestion.id}
                </span>
                <span className="text-xs text-slate-500 bg-slate-950 px-2.5 py-1 rounded-lg border border-slate-800/80">
                  {currentQuestion.source}
                </span>
                <span className="text-xs text-slate-400 font-bold ml-auto">{currentQuestion.title}</span>
              </div>

              {/* 問題文 */}
              <div className="text-base sm:text-lg font-bold text-slate-100 leading-relaxed whitespace-pre-wrap">
                {currentQuestion.question}
              </div>

              {/* 図表/アローダイアグラムのインラインSVG再現 */}
              {currentQuestion.hasDiagram && (
                <div className="my-6">
                  {currentQuestion.diagramType === "problem3" && <DiagramProblem3 />}
                  {currentQuestion.diagramType === "problem4" && <DiagramProblem4 />}
                  {currentQuestion.diagramType === "table5" && (
                    <div className="overflow-x-auto my-4 rounded-xl border border-slate-800 bg-slate-950 p-4">
                      <table className="w-full text-center border-collapse text-xs">
                        <thead>
                          <tr className="bg-slate-800 text-slate-300">
                            <th className="p-2 border border-slate-700 font-bold">作業工程</th>
                            <th className="p-2 border border-slate-700 font-bold">作業日数</th>
                            <th className="p-2 border border-slate-700 font-bold">先行作業</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr><td className="p-2 border border-slate-800">A</td><td className="p-2 border border-slate-800 font-bold">5</td><td className="p-2 border border-slate-800 text-slate-500">なし</td></tr>
                          <tr className="bg-slate-900/50"><td className="p-2 border border-slate-800">B</td><td className="p-2 border border-slate-800 font-bold">2</td><td className="p-2 border border-slate-800">A</td></tr>
                          <tr><td className="p-2 border border-slate-800">C</td><td className="p-2 border border-slate-800 font-bold">4</td><td className="p-2 border border-slate-800">A</td></tr>
                          <tr className="bg-slate-900/50"><td className="p-2 border border-slate-800">D</td><td className="p-2 border border-slate-800 font-bold">2</td><td className="p-2 border border-slate-800">C</td></tr>
                          <tr><td className="p-2 border border-slate-800">E</td><td className="p-2 border border-slate-800 font-bold">3</td><td className="p-2 border border-slate-800">B, D</td></tr>
                        </tbody>
                      </table>
                    </div>
                  )}
                  {currentQuestion.diagramType === "table6" && (
                    <div className="overflow-x-auto my-4 rounded-xl border border-slate-800 bg-slate-950 p-4">
                      <table className="w-full text-center border-collapse text-xs">
                        <thead>
                          <tr className="bg-slate-800 text-slate-300">
                            <th className="p-2 border border-slate-700 font-bold">作業名</th>
                            <th className="p-2 border border-slate-700 font-bold">先行作業</th>
                            <th className="p-2 border border-slate-700 font-bold">所要期間（日）</th>
                            <th className="p-2 border border-slate-700 font-bold">最短所要期間（日）</th>
                            <th className="p-2 border border-slate-700 font-bold">単位あたり短縮費用（万円）</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr><td className="p-2 border border-slate-800">A</td><td className="p-2 border border-slate-800 text-slate-500">—</td><td className="p-2 border border-slate-800 font-bold">6</td><td className="p-2 border border-slate-800 font-bold">6</td><td className="p-2 border border-slate-800 text-slate-500">—</td></tr>
                          <tr className="bg-slate-900/50"><td className="p-2 border border-slate-800">B</td><td className="p-2 border border-slate-800">A</td><td className="p-2 border border-slate-800 font-bold">4</td><td className="p-2 border border-slate-800 font-bold">3</td><td className="p-2 border border-slate-800 font-bold">10</td></tr>
                          <tr><td className="p-2 border border-slate-800">C</td><td className="p-2 border border-slate-800">A</td><td className="p-2 border border-slate-800 font-bold">5</td><td className="p-2 border border-slate-800 font-bold">2</td><td className="p-2 border border-slate-800 font-bold">30</td></tr>
                          <tr className="bg-slate-900/50"><td className="p-2 border border-slate-800">D</td><td className="p-2 border border-slate-800">B, C</td><td className="p-2 border border-slate-800 font-bold">6</td><td className="p-2 border border-slate-800 font-bold">3</td><td className="p-2 border border-slate-800 font-bold">50</td></tr>
                        </tbody>
                      </table>
                    </div>
                  )}
                  {currentQuestion.diagramType === "table7" && (
                    <div className="overflow-x-auto my-4 rounded-xl border border-slate-800 bg-slate-950 p-4">
                      <table className="w-full text-center border-collapse text-xs">
                        <thead>
                          <tr className="bg-slate-800 text-slate-300">
                            <th className="p-2 border border-slate-700 font-bold"></th>
                            <th className="p-2 border border-slate-700 font-bold">工程1（穴あけ）</th>
                            <th className="p-2 border border-slate-700 font-bold">工程2（塗装）</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr><td className="p-2 border border-slate-800 font-bold bg-slate-900/50">製品A</td><td className="p-2 border border-slate-800">10</td><td className="p-2 border border-slate-800">5</td></tr>
                          <tr className="bg-slate-900/50"><td className="p-2 border border-slate-800 font-bold bg-slate-900/50">製品B</td><td className="p-2 border border-slate-800">3</td><td className="p-2 border border-slate-800">7</td></tr>
                          <tr><td className="p-2 border border-slate-800 font-bold bg-slate-900/50">製品C</td><td className="p-2 border border-slate-800">4</td><td className="p-2 border border-slate-800">2</td></tr>
                          <tr className="bg-slate-900/50"><td className="p-2 border border-slate-800 font-bold bg-slate-900/50">製品D</td><td className="p-2 border border-slate-800">8</td><td className="p-2 border border-slate-800">6</td></tr>
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              )}

              {/* 選択肢リスト */}
              <div className="space-y-3 pt-4">
                {currentQuestion.choices.map((choice, idx) => {
                  const isAnswered = selectedAnswer !== null;
                  const isCurrentChoice = selectedAnswer === idx;
                  const isCorrectAnswer = choice.startsWith(currentQuestion.answer);

                  let btnStyle = "bg-slate-950 border-slate-800 hover:border-slate-700 text-slate-200";
                  let icon = <ChevronRight className="w-4 h-4 shrink-0 text-slate-500" />;

                  if (isAnswered) {
                    if (isCorrectAnswer) {
                      // 正解の選択肢は常に緑色
                      btnStyle = "bg-emerald-500/10 border-emerald-500 text-emerald-400 font-bold";
                      icon = <Check className="w-4 h-4 shrink-0 text-emerald-500" />;
                    } else if (isCurrentChoice) {
                      // 間違った選択肢を自分が選んだ場合のみ赤色
                      btnStyle = "bg-red-500/10 border-red-500 text-red-400 font-bold";
                      icon = <X className="w-4 h-4 shrink-0 text-red-500" />;
                    } else {
                      btnStyle = "bg-slate-950/40 border-slate-900 text-slate-600 opacity-60";
                    }
                  }

                  return (
                    <button 
                      key={idx}
                      disabled={isAnswered}
                      onClick={() => handleAnswer(idx, choice)}
                      className={`w-full p-4 rounded-xl border text-left flex items-start gap-3 transition-all ${btnStyle}`}
                    >
                      {icon}
                      <span className="text-sm font-medium leading-relaxed">{choice}</span>
                    </button>
                  );
                })}
              </div>

            </div>

            {/* 回答解説エリア (回答後に表示) */}
            {selectedAnswer !== null && (
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xl space-y-6 animate-fadeIn">
                
                {/* 判定ヘッダー */}
                <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                  <div className="flex items-center gap-3">
                    {currentQuestion.choices[selectedAnswer].startsWith(currentQuestion.answer) ? (
                      <span className="px-3 py-1.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-lg text-sm font-black flex items-center gap-1.5">
                        <Check className="w-4 h-4" /> 正解！
                      </span>
                    ) : (
                      <span className="px-3 py-1.5 bg-red-500/10 border border-red-500/20 text-red-400 rounded-lg text-sm font-black flex items-center gap-1.5">
                        <X className="w-4 h-4" /> 不正解...
                      </span>
                    )}
                    <span className="text-sm font-bold text-slate-300">
                      正解: {currentQuestion.answer}
                    </span>
                  </div>

                  {/* 要復習スイッチ */}
                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <input 
                      type="checkbox" 
                      checked={!!reviews[currentQuestion.id]}
                      onChange={() => handleReviewToggle(currentQuestion.id)}
                      className="rounded bg-slate-950 border-slate-800 text-indigo-500 focus:ring-indigo-500/30"
                    />
                    <span className="text-xs text-slate-400 font-semibold">要復習リストに登録する</span>
                  </label>
                </div>

                {/* 解説図表 (必要な問題のみ) */}
                {currentQuestion.diagramType === "problem3" && (
                  <div className="space-y-4">
                    <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">解説アローダイアグラム (最早最遅・クリティカルパス)</div>
                    <DiagramExplanation3 />
                    <DiagramImportant3 />
                  </div>
                )}
                {currentQuestion.diagramType === "problem4" && (
                  <div className="space-y-4">
                    <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">解説アローダイアグラム (解答数値・クリティカルパス)</div>
                    <DiagramExplanation4 />
                  </div>
                )}
                {currentQuestion.diagramType === "table5" && (
                  <div className="space-y-4">
                    <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">再現アローダイアグラム (クリティカルパス: A-C-D-E)</div>
                    <DiagramExplanation5 />
                  </div>
                )}
                {currentQuestion.diagramType === "table6" && (
                  <div className="space-y-4">
                    <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">再現アローダイアグラム (CPM最適化)</div>
                    <DiagramExplanation6 />
                    <div className="overflow-x-auto mt-4 rounded-xl border border-slate-800 bg-slate-950 p-4">
                      <table className="w-full text-center border-collapse text-xs">
                        <thead>
                          <tr className="bg-slate-800 text-slate-300">
                            <th className="p-2 border border-slate-700 font-bold">作業名</th>
                            <th className="p-2 border border-slate-700 font-bold">先行作業</th>
                            <th className="p-2 border border-slate-700 font-bold">所要期間（日）</th>
                            <th className="p-2 border border-slate-700 font-bold">最短所要（日）</th>
                            <th className="p-2 border border-slate-700 font-bold">必要短縮（日）</th>
                            <th className="p-2 border border-slate-700 font-bold">単位あたり短縮費用</th>
                            <th className="p-2 border border-slate-700 font-bold">短縮費用（万円）</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr><td className="p-2 border border-slate-800">A</td><td className="p-2 border border-slate-800 text-slate-500">—</td><td className="p-2 border border-slate-800 font-bold">6</td><td className="p-2 border border-slate-800 font-bold">6</td><td className="p-2 border border-slate-800 text-slate-500">—</td><td className="p-2 border border-slate-800">—</td><td className="p-2 border border-slate-800 font-bold text-slate-400">—</td></tr>
                          <tr className="bg-slate-900/50"><td className="p-2 border border-slate-800">B</td><td className="p-2 border border-slate-800">A</td><td className="p-2 border border-slate-800 font-bold">4</td><td className="p-2 border border-slate-800 font-bold">3</td><td className="p-2 border border-slate-800 font-bold">1</td><td className="p-2 border border-slate-800 font-bold">10</td><td className="p-2 border border-slate-800 font-bold text-red-400">10</td></tr>
                          <tr><td className="p-2 border border-slate-800">C</td><td className="p-2 border border-slate-800">A</td><td className="p-2 border border-slate-800 font-bold">5</td><td className="p-2 border border-slate-800 font-bold">2</td><td className="p-2 border border-slate-800 font-bold">2</td><td className="p-2 border border-slate-800 font-bold">30</td><td className="p-2 border border-slate-800 font-bold text-red-400">60</td></tr>
                          <tr className="bg-slate-900/50"><td className="p-2 border border-slate-800">D</td><td className="p-2 border border-slate-800">B, C</td><td className="p-2 border border-slate-800 font-bold">6</td><td className="p-2 border border-slate-800 font-bold">3</td><td className="p-2 border border-slate-800 font-bold">3</td><td className="p-2 border border-slate-800 font-bold">50</td><td className="p-2 border border-slate-800 font-bold text-red-400">150</td></tr>
                          <tr className="bg-slate-800 font-bold"><td className="p-2 border border-slate-700" colSpan="6">計</td><td className="p-2 border border-slate-700 text-emerald-400">220万円</td></tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
                {currentQuestion.diagramType === "table7" && (
                  <div className="space-y-4">
                    <GanttChartImportant7 />
                    <GanttChartExplanation7 />
                  </div>
                )}
                {currentQuestion.diagramType === "explain_management" && (
                  <ExplainManagementDiagram />
                )}
                {currentQuestion.diagramType === "explain_toyota" && (
                  <ExplainToyotaDiagram />
                )}

                {/* 解説テキスト */}
                <div className="text-slate-300 text-sm leading-relaxed whitespace-pre-wrap border-t border-slate-800 pt-6">
                  {currentQuestion.explanation}
                </div>

                {/* 下部ナビゲーション */}
                <div className="flex justify-end gap-3 pt-6 border-t border-slate-800">
                  <button 
                    onClick={() => {
                      setCurrentView("dashboard");
                    }}
                    className="px-5 py-3 bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold rounded-xl transition-all"
                  >
                    ダッシュボード
                  </button>
                  <button 
                    onClick={() => {
                      setSelectedAnswer(null);
                      const nextIdx = progressIndex + 1;
                      if (nextIdx >= currentQuestions.length) {
                        // 完走完了
                        console.log("問題集完走！ダッシュボードへ戻り進捗リセットします");
                        setProgressIndex(0);
                        saveProgressToFirestore(0, progressMode, history, reviews);
                        setCurrentView("dashboard");
                      } else {
                        setProgressIndex(nextIdx);
                      }
                    }}
                    className="px-6 py-3 bg-indigo-500 hover:bg-indigo-600 text-white font-bold rounded-xl shadow-md active:scale-[0.98] transition-all flex items-center gap-1"
                  >
                    <span>
                      {progressIndex + 1 >= currentQuestions.length ? "全問終了" : "次の問題へ"}
                    </span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>

              </div>
            )}

          </div>
        )}

      </main>

      {/* フッター */}
      <footer className="bg-slate-950 border-t border-slate-900 py-6 text-center text-xs text-slate-500 mt-auto">
        <div className="max-w-6xl mx-auto px-4">
          <p>© 2026 スマート問題集 3-3 クイズ同期システム. All Rights Reserved.</p>
        </div>
      </footer>

    </div>
  );
}
