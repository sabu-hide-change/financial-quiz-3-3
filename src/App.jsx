// npm install lucide-react recharts firebase

import React, { useState, useEffect, useMemo, useRef } from "react";
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
  HelpCircle 
} from "lucide-react";
import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore, doc, getDoc, setDoc, onSnapshot } from "firebase/firestore";
import { getAuth, signInAnonymously } from "firebase/auth";
import { 
  ResponsiveContainer, 
  RadarChart, 
  PolarGrid, 
  PolarAngleAxis, 
  PolarRadiusAxis, 
  Radar 
} from "recharts";

// データの分離用 APP_ID
const APP_ID = "QuizApp_Production_Planning_And_Control_3_3";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

// Firebaseの防衛的初期化
let app;
let db;
let auth;
try {
  if (firebaseConfig.apiKey && firebaseConfig.projectId) {
    app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
    db = getFirestore(app);
    auth = getAuth(app);
    console.log("Firebase initialized successfully for AppID:", APP_ID);
  } else {
    console.warn("Firebase config is incomplete. Running in Local Storage Mode.");
  }
} catch (e) {
  console.error("Firebase initialization failed:", e);
}

// 1. 問題データ配列（完全ノンカット収録）
const QUESTIONS = [
  {
    id: "q_1",
    title: "問題 1 生産計画",
    source: "スマート問題集 3-3-1",
    category: "生産計画とスケジューリング",
    text: "生産計画に関する記述として、最も適切なものはどれか。",
    options: [
      "ア　生産計画の役割として、納期や生産量の保証、製品品質の保証、設備稼働率の維持などがある。",
      "イ　負荷計画では、生産能力と手持ち材料を比較し、過不足がある場合に調整を図る。",
      "ウ　生産計画を業務で分類すると、手順計画、工程設計、負荷計画、日程計画に分類できる。",
      "エ　手順計画では、設計情報を基に、加工手順、使用設備、標準作業時間などを検討する。"
    ],
    answerIndex: 3,
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
    id: "q_2",
    title: "問題 2 スケジューリング",
    source: "スマート問題集 3-3-2",
    category: "生産計画とスケジューリング",
    text: "スケジューリングに関する記述として、最も不適切なものはどれか。",
    options: [
      "ア　フォワードスケジューリングとは、作業の開始時点から、順番に予定を組んでいく方法である。",
      "イ　ジョブショップスケジューリングは、同じ専用ラインを使用して複数の製品を大量生産するのに適した方法である。",
      "ウ　バックワードスケジューリングは、予め決められた納期を守るために、作業開始日を決める方法である。",
      "エ　プロジェクトスケジューリングでは、必要な作業を全て抽出し、それぞれの作業の開始日と完了日が分かるようにする。"
    ],
    answerIndex: 1,
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
　ジョブショップスケジューリングとは、複数の作業を、幾つかの機械で処理する場合に、作業や機械 of 順番を最適化するのに適した方法です。この方法は、機能別レイアウトを用いて多品種少量生産形態をする場合に多く用いられます。選択肢の記述は、フローショップスケジューリングに関する内容です。よって記述は不適切です。
ウ　○：
　バックワードスケジューリングは、納期を基準に、工程の順序とは逆に予定を組んでいき、いつから作業を開始するかを決定します。納期をより重視した方法と言えます。よって記述は適切です。
エ　○：
　プロジェクトスケジューリングでは、複数の作業から構成されるプロジェクトの作業項目を全て抽出し、各作業の所要期間や作業間の関連が分かるようにします。よって記述は適切です。`,
    hasDiagram: true,
    diagramType: "scheduling"
  },
  {
    id: "q_3",
    title: "問題 3 PERT1",
    source: "スマート問題集 3-3-3",
    category: "生産計画とスケジューリング",
    text: "来月から開始するプロジェクトのスケジューリングをPERTで行ったところ、次のようになった。図の〇印は、各作業の開始と終了を示すノードで、矢印を各作業にかかる日数とした場合、最も適切な記述はどれか。",
    options: [
      "ア　ノード7の最早着手日は、16日である。",
      "イ　クリティカルパスは、作業B→F→G→Jの経路である。",
      "ウ　ノード6の最遅着手日は、20日である。",
      "エ　ノード3の最早着手日は4日、最遅着手日6日である。"
    ],
    answerIndex: 3,
    explanation: `解答：エ

ここが重要
　本問は代表的なネットワーク手法であるPERTについて問われています。
ネットワーク手法とは、作業間の関連や順序を決定する方法で、その代表的なものにPERTがあります。
PERTでは、作業の流れを表す「アローダイアグラム」と呼ばれる図を書きます。この図の中で、作業のことをアクティビティと呼び、線で表します。作業の開始と終了の時点は丸で表し、これをノードや結合点と呼びます。（丸が作業ではなく、線が作業ですので注意してください）。PERTでは、次のような流れで、プロジェクトを最短で完了するための、作業スケジュールを決定します。

●最早着手日
最初に、プロジェクトの開始時点から順に、最も早く作業を開始できる日程を記入していきます。この日程のことを最早着手日と呼びます。
・ノード1の最早着手日は0日となります。
・ノード2、3、4のように先行作業が一つの場合は、それぞれの先行作業にかかる日数が、そのまま最早着手日となります。図の例では、ノード2が8日、ノード3が5日、ノード4が6日となります。
・ノード5のように、複数の先行作業がある場合は、全ての先行作業の合計が最早着手日となります。但し、複数の経路がある場合は、最も合計時間が長い経路が最早着手日となります。ノード5の場合は、3つの経路があります。合計時間が最も長い経路は、作業B→Eの経路で15日です。同様にノード7では24日となります。
●最遅着手日
次に、各作業をいつまでに着手したら良いかを決定していきます。この日程を最遅着手日と呼びます。最遅着手日は最後の方から求めていきます。
・図の例では、ノード7の最遅着手日は、最早着手日と同じ24日です。ノード6は、作業Iの時間(10)を引いて14日です。同様に、ノード5では17日となります。このように、全てのノードの最遅着手日を求めます。
・最遅着手日は、遅くともここまでに開始すればプロジェクト全体の完了時間に影響が無いタイミングです。例えば、ノード2は最早着手日は8日ですが、最遅着手日は11日です。遅くとも11日に作業を開始すればよいので、3日の余裕があることになります。一方、ノード4は最早着手日と最遅着手日が同じ6日で余裕がありません。少しでも作業の開始が遅れれば、全体が完了するスケジュールに影響を及ぼします。
●クリティカルパス
ノード4のように、作業の遅れが許されない経路を「クリティカルパス」と呼びます。この図では、作業C→G→Iを通る経路がクリティカルパスです。プロジェクトのスケジュール管理では、クリティカルパス上の作業を重点的に管理すると共に、クリティカルパス上の作業を改善して短縮することで、全体の納期を短縮することができます。
設問のPERTの各ノードの最早着手日と最遅着手日を求めると次のようになります。

ア　×：　
ノード7までの先行作業の経路で、合計時間が最も長くなる経路は、赤矢線で示した作業A→D→Hです。この作業時間の合計が最早着手日となるので、26日となります。よって記述は不適切です。
イ　×：　
クリティカルパスは最早着手日と最遅着手日が同じになる遅れが許されない経路です。赤矢線で示した作業A→D→Hが該当します。よって記述は不適切です。
ウ　×：　
ノード6の最遅着手日は、ノード7の最遅着手日から作業J of 3日を引いた23日となります。よって記述は不適切です。
エ　○：　
ノード3の最早着手日は作業Bと同じ4日です。一方、最遅着手日はクリティカルパス上にあるノード4から、作業Eの8日を引いた6日となります。よって記述は適切です。`,
    hasDiagram: true,
    diagramType: "pert1"
  },
  {
    id: "q_4",
    title: "問題 4 PERT2",
    source: "スマート問題集 3-3-4",
    category: "生産計画とスケジューリング",
    text: "下表に示される作業A～Hで構成されるプロジェクトにおいて、PERTを用いて日程管理を行う。空欄Ｘ、Ｙに入る数値、及びクリティカルパスについて、最も適切な組み合わせを下記の解答群より選べ。",
    options: [
      "ア　Ｘ：50　　Ｙ：45　　クリティカルパス：A - D - G - H",
      "イ　Ｘ：45　　Ｙ：40　　クリティカルパス：A - B - E - H",
      "ウ　Ｘ：50　　Ｙ：45　　クリティカルパス：A - C - F - H",
      "エ　Ｘ：45　　Ｙ：40　　クリティカルパス：A - D - G - H"
    ],
    answerIndex: 0,
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
以上より、Ｘ：50、Ｙ：45、クリティカルパス：A - D - G - Hとなり、選択肢アが正解です。`,
    hasDiagram: true,
    diagramType: "pert2"
  },
  {
    id: "q_5",
    title: "問題 5 PERT3",
    source: "スマート問題集 3-3-5",
    category: "生産計画とスケジューリング",
    text: "あるジョブは５つの作業工程A～Eで構成されている。各作業工程の作業日数と作業工程間の先行関係が下表に示されるとき、このジョブの最短完了日数の値として、最も適切なものはどれか。",
    options: [
      "ア　9",
      "イ　11",
      "ウ　14",
      "エ　16"
    ],
    answerIndex: 2,
    explanation: `解答：ウ

ここが重要
　本問は各作業工程の作業日数と作業順序にもとづき、アローダイアグラムを作成して最短完了日数を求める問題です。
各作業工程の先行関係に着目して、アローダイアグラムを作成し、クリティカルパスを見つけることがポイントです。過去の試験では、工程の作業時間と先行関係だけが示された表をもとに、アローダイアグラムを作成する問題が度々出題されていますので、作成手順をしっかり押さえておきましょう。
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
以上より、このジョブの最短完了日数の値は14となり、選択肢ウが正解となります。`,
    hasDiagram: true,
    diagramType: "pert3"
  },
  {
    id: "q_6",
    title: "問題 6 CPM（Critical Path Method）",
    source: "スマート問題集 3-3-6",
    category: "生産計画とスケジューリング",
    text: "下表は、あるプロジェクト業務を構成する各作業の要件を示している。CPM（Critical Path Method）を適用して、最短プロジェクト遂行期間となる条件を達成したときの最小費用を下記の解答群から選べ。",
    options: [
      "ア　220万円",
      "イ　240万円",
      "ウ　250万円",
      "エ　280万円"
    ],
    answerIndex: 0,
    explanation: `解答：ア

ここが重要
本問はPERTの応用知識として、CPM（Critical Path Method）によってプロジェクトを最短期間で遂行するときの最小費用を求める問題です。
CPMは、費用を払うことにより各作業の所要時間が短縮できるとして、最小の費用でプロジェクトの遂行期間を最短にする最適解を求める手法です。
【解答手順】
手順１：最短所要期間をもとにアローダイアグラムを作成します。

手順２：クリティカルパスを特定し、クリティカルパス以外の余裕期間を求めます。クリティカルパスはA→B→Dです。余裕期間はノード4の1日間ですので、作業Cは2日間だけ短縮すればよい。
手順３：各作業の必要短縮期間×単位あたりの短縮費用を算出します。

以上より、短縮費用の総額は220万円となります。`,
    hasDiagram: true,
    diagramType: "cpm"
  },
  {
    id: "q_7",
    title: "問題 7 ジョンソン法",
    source: "スマート問題集 3-3-7",
    category: "生産計画とスケジューリング",
    text: "工程1（穴あけ）、工程2（塗装）の2つが連結された生産ラインで、4種類の製品A, B, C, Dを生産している。工程は、必ず1→2の順番で行われ、各工程は一度に一つの製品しか処理できないものとする。製品の生産順序を最適化して、全ての製品の作業を最短で終了させる場合の時間として、最も適切なものを選べ。(単位：分)",
    options: [
      "ア　50分",
      "イ　32分",
      "ウ　28分",
      "エ　37分"
    ],
    answerIndex: 2,
    explanation: `解答：ウ

ここが重要
本問はジョブショップスケジューリングの順序づけ法の1つ、ジョンソン法について問われています。
ジョブショップスケジューリングは、複数の機械を用いて作業を行う際に、全体の作業時間が最短になるように作業や機械の順番を最適化する方法です。代表的な手法に、ディスパッチング法と順序づけ法があります。
●ディスパッチング法
あらかじめ順序を決めずに、その都度ルールに基づいて作業を割り当てる方法です。
●順序づけ法（ジョンソン法）
全体の作業期間が最も短くなるように作業の順序を決定する方法です。代表的なものにジョンソン法があります。下図の例を用いて、ジョンソン法について説明します。
・3つの書類と宛名をPCで作成し、印刷した上で郵送する作業を計画しています。
・工程は「PCによる文書作成（工程X）」と「プリンタで印刷（工程Y）」の2つです。
・作業は文書作成（作業1～3）と、宛名（作業4）の4つです。
・工程には順序があり、書類を作成しないと、印刷できません。
・一方、書類は順番がなく、どの書類から作成しても構いません。
ジョンソン法を使えば、このような場合に最も短い期間で全ての作業が終了するスケジュールを作成することができます。
では、具体的に手順を見てみましょう。

【ジョンソン法の手順】
手順1　作業時間が最短の作業を選ぶ。
手順2　それが前工程（この図では工程X）であれば、その作業を先頭に配置する。それが後工程（この図では工程Y）であれば、その作業を最後に配置する。 既に作業が配置されている場合は、その作業の次に配置する。
手順3　その作業を対象から外し、手順1に戻り、残りの作業についてくり返す。
この手順に沿って作業の順番を決めると、115分で全ての作業が完了します。これが、最も短い作業時間となります。
ジョンソン法を用いる問題は、過去に何度か出題されています。設問の条件が問題ごとに多少違うので、しっかり確認してから回答しましょう。
本問の製品の生産順序をジョンソン法に従って考えてみましょう。
１
【手順1】全ての作業から最短のものを選びます。「製品C　工程2」です。【手順2】工程2は後工程ですので、この作業は最後に配置します。【手順3】製品Cを対象から外して、手順1に戻ります。
２
【手順1】製品C以外で作業時間が最短のものを選びます。「製品B　工程1」です。【手順2】工程1は前工程ですので、先頭に置きます。【手順3】製品Bを対象から外して、手順1に戻ります。
３
【手順1】残りの中から作業時間が最短のものを選びます。「製品A　工程2」です。【手順2】工程2は後工程ですので、「製品C 工程2」の手前に配置します。【手順3】製品Aを対象から外します。残りは、製品Dだけになるため、これで手順は終了です。製品Dは先頭の製品Bと、最後から2番目の製品Aの間に配置することになります。この結果、作業の順序は、製品B→製品D→製品A→製品Cになります。
これを、ガントチャートで示すと下図のスケジュールとなります。

作業時間の合計 ＝ 3分（製品B 工程1）＋ 8分（製品D 工程1）＋ 10分（製品A 工程1）＋ 5分（製品A 工程2）＋ 2分（製品C 工程2）＝ 28分
上記より、作業時間は28分となります。よってウが正解です。`,
    hasDiagram: true,
    diagramType: "johnson"
  },
  {
    id: "q_8",
    title: "問題 8 需要予測",
    source: "スマート問題集 3-3-8",
    category: "需要予測と生産統制",
    text: "需要予測に関する記述として、最も不適切なものはどれか。",
    options: [
      "ア　加重移動平均法による予測で、重みをすべて同じにした場合、予測値は単純移動平均法と同一となる。",
      "イ　単純移動平均法による予想で、ノイズを出来るだけ除去する場合には、用いるデータ数を減らせばよい。",
      "ウ　指数平滑法による予想で、直近の実績の影響を強く反映したい場合は、平滑化指数を大きくすればよい。",
      "エ　加重平均法による予測で、過去のデータの影響を少なくしたい場合は、重みを減らせばよい。"
    ],
    answerIndex: 1,
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
・7月予測値 = Σ (売上×重み) ÷ Σ 重み = (100×2 + 80×3 + 120×5) ÷ (2 + 3 + 5) = 104 万円
●指数平滑法
　直近の実績の値を重視する手法で、次の式で需要の予測値を求めます。
　来期予測値 ＝ 今期予測値 ＋ 平滑化指数 Ｘ （今期実績値 － 今期予測値）
　ここで、平滑化指数は、0と1の間の数値を取ります。平滑化指数が大きいほど、予測は直近の実績値に大きく左右されることになります。逆に、平滑化指数が小さいほど、予測は直近の実績値に左右されにくくなります。
　例えば、今月の売上の予測は100万円、今月の売上の実績は80万円で、平滑化指数を0.5としたとき、来期の売上の予測値は次のようになります。
・来期予測値 ＝ 100＋ 0.5 Ｘ （80 － 100） ＝ 90万円
　需要予測は過去に多く出題されている分野です。各需要予測の特徴の理解と合わせて、需要予測の計算も、しっかりとできるようにしておきましょう。

ア　○：
　加重移動平均法は、「予測値 ＝ Σ（売上Ｘ重み）÷ Σ重み」の式を用います。重みを全て同一にした場合は、「予測値 ＝Σ（売上)÷ Σ）となるので、移動平均法の結果と同一になります。よって記述は適切です。
イ　×：
　一時的な値の増減をノイズと呼びます。例えば、2ヶ月分の売上データの内、一方がセール月で売上が大幅に増えたデータであったとします。このデータを用いて平均をとると、セール月のデータの影響を強く受けることになります。しかし、12ヶ月分の売上データを用いた平均であれば、セール月の影響は緩和されます。このようにノイズを除去したい場合は、データ数を増やす必要があります。よって記述は不適切です。
ウ　○：
　指数平滑化法は、「来期予測値 ＝ 今期予測値 ＋ 平滑化指数 Ｘ （今期実績値 － 今期予測値）」の式を用います。ここで、平滑化指数を大きくすると、直近の実績の影響度も合わせて大きくなります。よって記述は適切です。
エ　○：
　加重平均法では、各データに、それぞれの重みを乗じた値が、予測値に与える影響となります。このため影響を強くしたいデータの重みは増やし、逆に影響を弱くしたいデータの重みは減らします。よって記述は適切です。`
  },
  {
    id: "q_9",
    title: "問題 9 生産統制",
    source: "スマート問題集 3-3-9",
    category: "需要予測と生産統制",
    text: "生産統制に関する記述として、最も適切なものはどれか。",
    options: [
      "ア　生産統制は、大きくわけて進捗管理、現品管理、余力管理、販売管理の4つから構成される。",
      "イ　余力管理では、製品原価や作業者の負荷状況を管理し、むだな費用の発生を防止する。",
      "ウ　進捗管理では、入荷した資材の管理や、日程計画に対する仕事の進捗状況を管理する。",
      "エ　現品管理では、部品や仕掛品の運搬や保管状況を管理し、部品の過不足を未然に防止する。"
    ],
    answerIndex: 3,
    explanation: `解答：エ

ここが重要
　本問では生産統制の構成とその内容について問われています。
　生産統制では、生産計画と実績に差異が発生しないように生産を統制し、納期を守ったり、適切な稼働率を維持するように活動します。生産統制は大きく分けて、進捗管理、現品管理、余力管理の3つから構成されます。それぞれ活動内容は次のとおりです。
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
    id: "q_10",
    title: "問題 10 生産の管理方式",
    source: "スマート問題集 3-3-10",
    category: "需要予測と生産統制",
    text: "生産の管理方式に関する記述として、最も適切なものはどれか。",
    options: [
      "ア　追番管理方式は、生産計画に対する実績の差異を容易に把握できるというメリットがある。",
      "イ　オーダーエントリー方式では、すでに生産工程に製品があるため、顧客の個別の要求に対応するのは難しい。",
      "ウ　製番管理方式で生産された製品において、使用した部品の一部に欠陥が見つかった場合、その部品を作った時期を特定するのは難しい。",
      "エ　生産座席予約システムでは、短納期の顧客要求に対しても、いつでも柔軟に生産の対応ができる。"
    ],
    answerIndex: 0,
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
　生産座席予約システムは、納期回答を素早く出来るというメリットがあります。しかし、一方で設備や資材の予約が一杯で生産に余裕がない場合は、新たな注文に対して納期が遅くなるというデメリットがあります。よって記述は不適切です。`,
    hasDiagram: true,
    diagramType: "control"
  },
  {
    id: "q_11",
    title: "問題 11 トヨタ生産方式",
    source: "スマート問題集 3-3-11",
    category: "需要予測と生産統制",
    text: "トヨタ生産方式に関する記述として、最も不適切なものはどれか。",
    options: [
      "ア　かんばんの枚数及びそこに指示される量は、生産量と同時に工程間の仕掛品の数も指示することになる。",
      "イ　かんばんは、作業の指示をする生産指示かんばんと、運搬を表す運搬かんばんの2種類がある。",
      "ウ　プルシステムを導入して、効率的な生産を行うためには、最終組み立てラインの生産量の平準化が重要となる。",
      "エ　JITは、必要なものを、必要な時に、必要な数だけ生産する方式で、これを実現するため、後工程引取り方式を採用している。"
    ],
    answerIndex: 1,
    explanation: `解答：イ

ここが重要
　本問ではトヨタ生産方式の内容について問われています。
　トヨタ生産方式は、無駄をできるだけ排除して、必要な数だけ生産する方式で、ジャストインタイムと、自働化という思想に基づいています。トヨタ生産方式の重要キーワードとしては次の内容があります。
●ジャストインタイム(JIT)
　必要なものを、必要な時に、必要な数だけ生産する方式です。ジャストインタイムは、後工程引取方式やプルシステムとも呼ばれ、後工程が使った分だけ前工程から引き取ることで余分な仕掛品を減らし、生産リードタイムを短縮することができます。ただし、最終組立工程の生産量が一定でないと、効率的に生産ができなくなるため、生産量の平準化が重要です。
●自働化
　自働化は、不良品を作らないための仕組みで、異常が発生したときに、機械を自動的に停止します。この時、どこで異常が発生したか一目で分かるように、「あんどん」というランプを点灯します。
※注：自働化の「働」の字は、ニンベンがついています。
●かんばん方式
　後工程引取方式を実現するための情報伝達手段として、「生産指示かんばん」と「引取りかんばん」と呼ばれる2種類のかんばんを使ういます。生産指示かんばんは、作業の指示を表し、引取りかんばんは、運搬を表します。
　このかんばんによって、後工程から前工程に生産指示が出され、後工程が生産した分だけ、前工程で生産するため、無駄を極力排除することができます。

　かんばんは、JITを支える重要な役割を担っています。かんばんの種類や、かんばんがどのように移動することで、後工程引取方式が実現されているか、しっかりと理解しましょう。

ア　○：
　かんばんは、生産量と在庫量をコントロールする道具です。かんばんは、全ての生産工程（最初の工程から最終工程まで）の中を、循環しながら用いられます。このため、その枚数とそこに指示される量の総和は、ライン上の生産量と仕掛品の量を意味します。よって記述は適切です。
イ　×：
　かんばんの種類は、作業を指示する「生産指示かんばん」と、運搬を表す「引取りかんばん」の2種類です。よって記述は不適切です。
ウ　○：
　プルシステムとは、後工程引取り方式の別名です。後工程が使った量だけ前工程から引き取りますから、仮に最終組み立てラインの生産量のバラツキが大きいと、前工程は全てその影響を受けます。このため、すべての生産工程を効率的に稼働するためには、最終組み立てラインの平準化が不可欠です。よって記述は適切です。
エ　○：
　JITでは、後工程引取方式を採用しています。かんばんを情報伝達手段として、後工程から、必要なものを、必要な時に、必要な数だけ、生産するよう前工程に指示します。よって記述は適切です。`,
    hasDiagram: true,
    diagramType: "toyota"
  }
];

// --- 2. インラインSVGおよび図表コンポーネント ---

// 問題2 スケジューリング手法の分類
const SchedulingClassificationSVG = () => (
  <svg viewBox="0 0 760 420" className="w-full max-w-2xl mx-auto bg-slate-900 border border-slate-800 rounded-lg p-4 shadow-inner">
    <text x="380" y="30" fill="#f8fafc" className="text-base font-bold" textAnchor="middle">◆ スケジューリング手法の分類</text>
    <g>
      <rect x="20" y="60" width="180" height="60" fill="#1e1b4b" stroke="#6366f1" strokeWidth="2" rx="6" />
      <text x="110" y="85" fill="#f8fafc" className="text-xs font-bold" textAnchor="middle">プロジェクトスケジューリング</text>
      <text x="110" y="105" fill="#a5b4fc" className="text-[10px]" textAnchor="middle">（個別生産）</text>
    </g>
    <g>
      <rect x="20" y="180" width="180" height="60" fill="#1e1b4b" stroke="#6366f1" strokeWidth="2" rx="6" />
      <text x="110" y="205" fill="#f8fafc" className="text-xs font-bold" textAnchor="middle">ジョブショップスケジューリング</text>
      <text x="110" y="225" fill="#a5b4fc" className="text-[10px]" textAnchor="middle">（多品種少量生産 / 機能別）</text>
    </g>
    <g>
      <rect x="20" y="300" width="180" height="60" fill="#1e1b4b" stroke="#6366f1" strokeWidth="2" rx="6" />
      <text x="110" y="325" fill="#f8fafc" className="text-xs font-bold" textAnchor="middle">フローショップスケジューリング</text>
      <text x="110" y="345" fill="#a5b4fc" className="text-[10px]" textAnchor="middle">（少品種多量生産 / 製品別）</text>
    </g>
    <path d="M 200 90 L 250 90" fill="none" stroke="#475569" strokeWidth="2" />
    <path d="M 200 210 L 250 210" fill="none" stroke="#475569" strokeWidth="2" />
    <path d="M 200 330 L 250 330" fill="none" stroke="#475569" strokeWidth="2" />
    <g>
      <rect x="250" y="60" width="180" height="40" fill="#0f172a" stroke="#475569" strokeWidth="1.5" rx="4" />
      <text x="340" y="85" fill="#e2e8f0" className="text-xs font-medium" textAnchor="middle">ネットワーク手法</text>
    </g>
    <g>
      <rect x="250" y="110" width="180" height="40" fill="#0f172a" stroke="#475569" strokeWidth="1.5" rx="4" />
      <text x="340" y="135" fill="#e2e8f0" className="text-xs font-medium" textAnchor="middle">ガントチャート</text>
    </g>
    <g>
      <rect x="250" y="180" width="180" height="40" fill="#0f172a" stroke="#475569" strokeWidth="1.5" rx="4" />
      <text x="340" y="205" fill="#e2e8f0" className="text-xs font-medium" textAnchor="middle">順序づけ法</text>
    </g>
    <g>
      <rect x="250" y="230" width="180" height="40" fill="#0f172a" stroke="#475569" strokeWidth="1.5" rx="4" />
      <text x="340" y="255" fill="#e2e8f0" className="text-xs font-medium" textAnchor="middle">ディスパッチング法</text>
    </g>
    <g>
      <rect x="250" y="310" width="180" height="40" fill="#0f172a" stroke="#475569" strokeWidth="1.5" rx="4" />
      <text x="340" y="335" fill="#e2e8f0" className="text-xs font-medium" textAnchor="middle">順序づけ法</text>
    </g>
    <path d="M 430 80 L 480 80" fill="none" stroke="#475569" strokeWidth="2" />
    <path d="M 430 200 L 480 200" fill="none" stroke="#475569" strokeWidth="2" />
    <path d="M 430 330 L 480 330" fill="none" stroke="#475569" strokeWidth="2" />
    <g>
      <rect x="480" y="45" width="140" height="35" fill="#020617" stroke="#3b82f6" strokeWidth="1.5" rx="4" />
      <text x="550" y="67" fill="#3b82f6" className="text-xs font-bold" textAnchor="middle">PERT</text>
    </g>
    <g>
      <rect x="480" y="90" width="140" height="35" fill="#020617" stroke="#3b82f6" strokeWidth="1.5" rx="4" />
      <text x="550" y="112" fill="#3b82f6" className="text-xs font-bold" textAnchor="middle">CPM</text>
    </g>
    <g>
      <rect x="480" y="185" width="140" height="35" fill="#020617" stroke="#0ea5e9" strokeWidth="1.5" rx="4" />
      <text x="550" y="207" fill="#0ea5e9" className="text-xs font-bold" textAnchor="middle">ジョンソン法</text>
    </g>
    <g>
      <rect x="480" y="312" width="140" height="35" fill="#020617" stroke="#0ea5e9" strokeWidth="1.5" rx="4" />
      <text x="550" y="334" fill="#0ea5e9" className="text-xs font-bold" textAnchor="middle">ジョンソン法</text>
    </g>
  </svg>
);

// 問題3 PERT1 アローダイアグラム
const Pert1SVG = ({ showAnswers = false }) => {
  const nodes = {
    1: { x: 50, y: 200 },
    2: { x: 200, y: 80 },
    3: { x: 200, y: 200 },
    4: { x: 350, y: 80 },
    5: { x: 350, y: 200 },
    6: { x: 400, y: 320 },
    7: { x: 520, y: 200 }
  };

  const drawArrow = (from, to, label, isCritical = false) => {
    const start = nodes[from];
    const end = nodes[to];
    const dx = end.x - start.x;
    const dy = end.y - start.y;
    const angle = Math.atan2(dy, dx);
    const nodeRadius = 20;
    
    const x1 = start.x + nodeRadius * Math.cos(angle);
    const y1 = start.y + nodeRadius * Math.sin(angle);
    const x2 = end.x - nodeRadius * Math.cos(angle);
    const y2 = end.y - nodeRadius * Math.sin(angle);

    const labelX = (x1 + x2) / 2 + 10 * Math.sin(angle);
    const labelY = (y1 + y2) / 2 - 10 * Math.cos(angle);

    const markerId = isCritical ? "arrow-red" : "arrow-gray";
    const strokeColor = isCritical ? "#ef4444" : "#94a3b8";
    const strokeWidth = isCritical ? 3.5 : 2;

    return (
      <g key={`${from}-${to}`}>
        <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={strokeColor} strokeWidth={strokeWidth} markerEnd={`url(#${markerId})`} />
        <text x={labelX} y={labelY} fill={isCritical ? "#f87171" : "#cbd5e1"} className="text-xs font-bold" textAnchor="middle">
          {label}
        </text>
      </g>
    );
  };

  return (
    <svg viewBox="0 0 600 380" className="w-full max-w-xl mx-auto bg-slate-900 border border-slate-800 rounded-lg p-4 shadow-inner">
      <defs>
        <marker id="arrow-gray" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
          <path d="M 0 1 L 10 5 L 0 9 z" fill="#94a3b8" />
        </marker>
        <marker id="arrow-red" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
          <path d="M 0 1 L 10 5 L 0 9 z" fill="#ef4444" />
        </marker>
      </defs>

      {/* 矢印の描画 */}
      {drawArrow(1, 2, "A: 8日", showAnswers)}
      {drawArrow(1, 3, "B: 4日", false)}
      {drawArrow(1, 6, "C: 5日", false)}
      {drawArrow(2, 4, "D: 6日", showAnswers)}
      {drawArrow(3, 4, "E: 8日", false)}
      {drawArrow(3, 5, "F: 9日", false)}
      {drawArrow(4, 7, "H: 12日", showAnswers)}
      {drawArrow(5, 7, "I: 3日", false)}
      {drawArrow(5, 6, "G: 7日", false)}
      {drawArrow(6, 7, "J: 3日", false)}

      {/* ノードの描画 */}
      {Object.entries(nodes).map(([id, pos]) => {
        const isCriticalNode = showAnswers && (id === "1" || id === "2" || id === "4" || id === "7");
        return (
          <g key={id}>
            <circle cx={pos.x} cy={pos.y} r="20" fill={isCriticalNode ? "#7f1d1d" : "#1e293b"} stroke={isCriticalNode ? "#ef4444" : "#475569"} strokeWidth="2.5" />
            <text x={pos.x} y={pos.y + 5} fill="#f8fafc" className="text-xs font-bold" textAnchor="middle">{id}</text>
          </g>
        );
      })}

      {/* 最早・最遅の解説表示（解説モードのみ） */}
      {showAnswers && (
        <g className="text-[10px]" fill="#94a3b8">
          <text x="40" y="240" fill="#ef4444">① [0, 0]</text>
          <text x="190" y="50" fill="#ef4444">② [8, 8]</text>
          <text x="190" y="240">③ [4, 6]</text>
          <text x="340" y="50" fill="#ef4444">④ [14, 14]</text>
          <text x="355" y="235">⑤ [13, 16]</text>
          <text x="410" y="355">⑥ [20, 23]</text>
          <text x="530" y="240" fill="#ef4444">⑦ [26, 26]</text>
          <text x="20" y="360" fill="#ef4444" className="text-xs font-bold">※ [最早着手日, 最遅着手日]（赤はクリティカルパス）</text>
        </g>
      )}
    </svg>
  );
};

// 問題4 PERT2 アローダイアグラム
const Pert2SVG = ({ showAnswers = false }) => {
  const nodes = {
    0: { x: 50, y: 150 },
    1: { x: 150, y: 150 },
    2: { x: 280, y: 70 },
    3: { x: 280, y: 230 },
    4: { x: 410, y: 150 },
    5: { x: 530, y: 150 },
    6: { x: 650, y: 150 }
  };

  const drawArrow = (from, to, label, isDashed = false, isCritical = false) => {
    const start = nodes[from];
    const end = nodes[to];
    const dx = end.x - start.x;
    const dy = end.y - start.y;
    const angle = Math.atan2(dy, dx);
    const nodeRadius = 18;
    
    const x1 = start.x + nodeRadius * Math.cos(angle);
    const y1 = start.y + nodeRadius * Math.sin(angle);
    const x2 = end.x - nodeRadius * Math.cos(angle);
    const y2 = end.y - nodeRadius * Math.sin(angle);

    const labelX = (x1 + x2) / 2 + 10 * Math.sin(angle);
    const labelY = (y1 + y2) / 2 - 10 * Math.cos(angle);

    const markerId = isCritical ? "arrow-red" : "arrow-gray";
    const strokeColor = isCritical ? "#ef4444" : "#94a3b8";
    const strokeWidth = isCritical ? 3.5 : 2;
    const strokeDash = isDashed ? "4,4" : "none";

    return (
      <g key={`${from}-${to}`}>
        <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={strokeColor} strokeWidth={strokeWidth} strokeDasharray={strokeDash} markerEnd={`url(#${markerId})`} />
        <text x={labelX} y={labelY + 2} fill={isCritical ? "#f87171" : "#cbd5e1"} className="text-[10px] font-bold" textAnchor="middle">
          {label}
        </text>
      </g>
    );
  };

  return (
    <svg viewBox="0 0 720 320" className="w-full max-w-2xl mx-auto bg-slate-900 border border-slate-800 rounded-lg p-4 shadow-inner">
      <defs>
        <marker id="arrow-gray" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
          <path d="M 0 1 L 10 5 L 0 9 z" fill="#94a3b8" />
        </marker>
        <marker id="arrow-red" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
          <path d="M 0 1 L 10 5 L 0 9 z" fill="#ef4444" />
        </marker>
      </defs>

      {/* 矢印の描画 */}
      {drawArrow(0, 1, "A 20", false, showAnswers)}
      {drawArrow(1, 2, "B 25", false, false)}
      {drawArrow(1, 4, "D 30", false, showAnswers)}
      {drawArrow(1, 3, "C 15", false, false)}
      {drawArrow(2, 4, "", true, false)}
      {drawArrow(3, 4, "", true, false)}
      {drawArrow(2, 5, "E 20", false, false)}
      {drawArrow(4, 5, "G 20", false, showAnswers)}
      {drawArrow(3, 5, "F 25", false, false)}
      {drawArrow(5, 6, "H 10", false, showAnswers)}

      {/* ノードの描画 */}
      {Object.entries(nodes).map(([id, pos]) => {
        const isCriticalNode = showAnswers && (id === "0" || id === "1" || id === "4" || id === "5" || id === "6");
        return (
          <g key={id}>
            <circle cx={pos.x} cy={pos.y} r="18" fill={isCriticalNode ? "#7f1d1d" : "#1e293b"} stroke={isCriticalNode ? "#ef4444" : "#475569"} strokeWidth="2" />
            <text x={pos.x} y={pos.y + 4} fill="#f8fafc" className="text-xs font-bold" textAnchor="middle">{id}</text>
          </g>
        );
      })}

      {/* 最早・最遅ボックス */}
      {Object.entries(nodes).map(([id, pos]) => {
        let early = "";
        let late = "";
        let isXLate = false;
        let isYLate = false;

        if (id === "0") { early = "0"; late = "0"; }
        else if (id === "1") { early = "20"; late = "20"; }
        else if (id === "2") { early = "45"; late = showAnswers ? "50" : "X"; isXLate = true; }
        else if (id === "3") { early = "35"; late = showAnswers ? "45" : "Y"; isYLate = true; }
        else if (id === "4") { early = "50"; late = "50"; }
        else if (id === "5") { early = "70"; late = "70"; }
        else if (id === "6") { early = "80"; late = "80"; }

        return (
          <g key={`box-${id}`} transform={`translate(${pos.x - 15}, ${pos.y + 24})`}>
            <rect x="0" y="0" width="30" height="34" fill="#0f172a" stroke="#475569" strokeWidth="1" />
            <line x1="0" y1="17" x2="30" y2="17" stroke="#475569" strokeWidth="1" />
            <text x="15" y="12" fill="#e2e8f0" className="text-[10px]" textAnchor="middle">{early}</text>
            <text x="15" y="29" fill={(isXLate || isYLate) && showAnswers ? "#ef4444" : "#e2e8f0"} className="text-[10px] font-bold" textAnchor="middle">{late}</text>
          </g>
        );
      })}

      {/* 凡例 */}
      <g transform="translate(540, 240)" className="text-[9px]" fill="#cbd5e1">
        <rect x="0" y="0" width="160" height="60" fill="#0f172a" stroke="#475569" strokeWidth="1" rx="4" />
        <rect x="10" y="10" width="20" height="24" fill="#0f172a" stroke="#475569" strokeWidth="1" />
        <line x1="10" y1="22" x2="30" y2="22" stroke="#475569" strokeWidth="1" />
        <text x="35" y="18" fill="#cbd5e1">最早着手日</text>
        <text x="35" y="30" fill="#cbd5e1">最遅着手日</text>
        <line x1="10" y1="46" x2="30" y2="46" stroke="#cbd5e1" strokeWidth="1.5" strokeDasharray="3,3" />
        <text x="35" y="50">点矢線：ダミー</text>
        {showAnswers && (
          <>
            <line x1="10" y1="56" x2="30" y2="56" stroke="#ef4444" strokeWidth="2" />
            <text x="35" y="58" fill="#ef4444" className="font-bold">クリティカルパス</text>
          </>
        )}
      </g>
    </svg>
  );
};

// 問題5 PERT3 解説用アローダイアグラム
const Pert3SVG = () => {
  const nodes = {
    1: { x: 50, y: 120 },
    2: { x: 180, y: 120 },
    3: { x: 310, y: 60 },
    4: { x: 310, y: 180 },
    5: { x: 440, y: 120 }
  };

  const drawArrow = (from, to, label, isCritical = false) => {
    const start = nodes[from];
    const end = nodes[to];
    const dx = end.x - start.x;
    const dy = end.y - start.y;
    const angle = Math.atan2(dy, dx);
    const nodeRadius = 18;
    
    const x1 = start.x + nodeRadius * Math.cos(angle);
    const y1 = start.y + nodeRadius * Math.sin(angle);
    const x2 = end.x - nodeRadius * Math.cos(angle);
    const y2 = end.y - nodeRadius * Math.sin(angle);

    const labelX = (x1 + x2) / 2 + 10 * Math.sin(angle);
    const labelY = (y1 + y2) / 2 - 10 * Math.cos(angle);

    const strokeColor = isCritical ? "#ef4444" : "#94a3b8";
    const strokeWidth = isCritical ? 3 : 1.5;
    const markerId = isCritical ? "arrow-red" : "arrow-gray";

    return (
      <g key={`${from}-${to}`}>
        <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={strokeColor} strokeWidth={strokeWidth} markerEnd={`url(#${markerId})`} />
        <text x={labelX} y={labelY + 2} fill={isCritical ? "#f87171" : "#cbd5e1"} className="text-[10px] font-bold" textAnchor="middle">
          {label}
        </text>
      </g>
    );
  };

  return (
    <svg viewBox="0 0 500 240" className="w-full max-w-lg mx-auto bg-slate-900 border border-slate-800 rounded-lg p-4 shadow-inner">
      <defs>
        <marker id="arrow-gray" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
          <path d="M 0 1 L 10 5 L 0 9 z" fill="#94a3b8" />
        </marker>
        <marker id="arrow-red" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
          <path d="M 0 1 L 10 5 L 0 9 z" fill="#ef4444" />
        </marker>
      </defs>

      {drawArrow(1, 2, "A: 5日", true)}
      {drawArrow(2, 3, "B: 2日", false)}
      {drawArrow(2, 4, "C: 4日", true)}
      {drawArrow(4, 3, "D: 2日", true)}
      {drawArrow(3, 5, "E: 3日", true)}

      {Object.entries(nodes).map(([id, pos]) => {
        const isCriticalNode = id === "1" || id === "2" || id === "4" || id === "3" || id === "5";
        return (
          <g key={id}>
            <circle cx={pos.x} cy={pos.y} r="18" fill={isCriticalNode ? "#7f1d1d" : "#1e293b"} stroke={isCriticalNode ? "#ef4444" : "#475569"} strokeWidth="2" />
            <text x={pos.x} y={pos.y + 4} fill="#f8fafc" className="text-xs font-bold" textAnchor="middle">{id}</text>
          </g>
        );
      })}

      <g transform="translate(10, 200)" className="text-[10px]" fill="#cbd5e1">
        <text fill="#ef4444" className="font-bold">クリティカルパス: 1 (A) → 2 (C) → 4 (D) → 3 (E) → 5 = 14日</text>
      </g>
    </svg>
  );
};

// 問題6 CPM アローダイアグラム
const CpmSVG = ({ showAnswers = false }) => {
  const nodes = {
    1: { x: 50, y: 150 },
    2: { x: 180, y: 150 },
    3: { x: 310, y: 60 },
    4: { x: 310, y: 150 },
    5: { x: 440, y: 150 }
  };

  const drawArrow = (from, to, label, isDashed = false, isCritical = false) => {
    const start = nodes[from];
    const end = nodes[to];
    const dx = end.x - start.x;
    const dy = end.y - start.y;
    const angle = Math.atan2(dy, dx);
    const nodeRadius = 18;
    
    const x1 = start.x + nodeRadius * Math.cos(angle);
    const y1 = start.y + nodeRadius * Math.sin(angle);
    const x2 = end.x - nodeRadius * Math.cos(angle);
    const y2 = end.y - nodeRadius * Math.sin(angle);

    const labelX = (x1 + x2) / 2 + 10 * Math.sin(angle);
    const labelY = (y1 + y2) / 2 - 10 * Math.cos(angle);

    const markerId = isCritical ? "arrow-red" : "arrow-gray";
    const strokeColor = isCritical ? "#ef4444" : "#94a3b8";
    const strokeWidth = isCritical ? 3.5 : 2;
    const strokeDash = isDashed ? "4,4" : "none";

    return (
      <g key={`${from}-${to}`}>
        <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={strokeColor} strokeWidth={strokeWidth} strokeDasharray={strokeDash} markerEnd={`url(#${markerId})`} />
        <text x={labelX} y={labelY + 2} fill={isCritical ? "#f87171" : "#cbd5e1"} className="text-[10px] font-bold" textAnchor="middle">
          {label}
        </text>
      </g>
    );
  };

  return (
    <svg viewBox="0 0 500 240" className="w-full max-w-lg mx-auto bg-slate-900 border border-slate-800 rounded-lg p-4 shadow-inner">
      <defs>
        <marker id="arrow-gray" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
          <path d="M 0 1 L 10 5 L 0 9 z" fill="#94a3b8" />
        </marker>
        <marker id="arrow-red" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
          <path d="M 0 1 L 10 5 L 0 9 z" fill="#ef4444" />
        </marker>
      </defs>

      {drawArrow(1, 2, "A 6", false, showAnswers)}
      {drawArrow(2, 3, showAnswers ? "B 3" : "B 4", false, showAnswers)}
      {drawArrow(2, 4, showAnswers ? "C 3 (最短2)" : "C 5", false, false)}
      {drawArrow(3, 4, "", true, false)}
      {drawArrow(4, 5, showAnswers ? "D 3" : "D 6", false, showAnswers)}

      {Object.entries(nodes).map(([id, pos]) => {
        const isCriticalNode = showAnswers && (id === "1" || id === "2" || id === "3" || id === "5");
        return (
          <g key={id}>
            <circle cx={pos.x} cy={pos.y} r="18" fill={isCriticalNode ? "#7f1d1d" : "#1e293b"} stroke={isCriticalNode ? "#ef4444" : "#475569"} strokeWidth="2" />
            <text x={pos.x} y={pos.y + 4} fill="#f8fafc" className="text-xs font-bold" textAnchor="middle">{id}</text>
          </g>
        );
      })}

      {/* 最早・最遅 */}
      {showAnswers && (
        <g className="text-[9px]" fill="#94a3b8">
          <text x="40" y="195" fill="#ef4444">① [0, 0]</text>
          <text x="170" y="195" fill="#ef4444">② [6, 6]</text>
          <text x="300" y="30" fill="#ef4444">③ [9, 9]</text>
          <text x="325" y="195">④ [8, 9] (余裕1日)</text>
          <text x="430" y="195" fill="#ef4444">⑤ [12, 12]</text>
        </g>
      )}
    </svg>
  );
};

// 問題7 ジョンソン法 ガントチャート
const JohnsonGanttChart = () => (
  <div className="bg-slate-900 border border-slate-800 rounded-lg p-4 max-w-xl mx-auto shadow-inner text-slate-200">
    <h4 className="text-center font-bold text-sm mb-4">◆ 最適生産順序のガントチャート (B → D → A → C)</h4>
    
    <div className="space-y-4">
      {/* 工程1 */}
      <div>
        <div className="text-xs font-semibold mb-1 text-indigo-400">工程1（穴あけ）</div>
        <div className="flex h-8 bg-slate-800 rounded overflow-hidden border border-slate-700 text-xs font-bold text-center">
          <div className="bg-indigo-600 border-r border-indigo-700 flex items-center justify-center transition-all duration-300 hover:opacity-85" style={{ width: `${(3/28)*100}%` }}>
            B(3)
          </div>
          <div className="bg-sky-600 border-r border-sky-700 flex items-center justify-center transition-all duration-300 hover:opacity-85" style={{ width: `${(8/28)*100}%` }}>
            D(8)
          </div>
          <div className="bg-emerald-600 border-r border-emerald-700 flex items-center justify-center transition-all duration-300 hover:opacity-85" style={{ width: `${(10/28)*100}%` }}>
            A(10)
          </div>
          <div className="bg-amber-600 flex items-center justify-center transition-all duration-300 hover:opacity-85" style={{ width: `${(4/28)*100}%` }}>
            C(4)
          </div>
          <div className="bg-slate-800" style={{ width: `${(3/28)*100}%` }}></div>
        </div>
      </div>

      {/* 工程2 */}
      <div>
        <div className="text-xs font-semibold mb-1 text-sky-400">工程2（塗装）</div>
        <div className="flex h-8 bg-slate-800 rounded overflow-hidden border border-slate-700 text-xs font-bold text-center">
          {/* 最初の空白 3分 */}
          <div className="bg-slate-950/40 text-slate-500 flex items-center justify-center text-[10px]" style={{ width: `${(3/28)*100}%` }}>
            待機
          </div>
          <div className="bg-indigo-500 border-r border-indigo-600 flex items-center justify-center transition-all duration-300 hover:opacity-85" style={{ width: `${(7/28)*100}%` }}>
            B(7)
          </div>
          {/* B完了(10)〜D開始(11)の空白 1分 */}
          <div className="bg-slate-950/40 text-slate-500 flex items-center justify-center text-[9px]" style={{ width: `${(1/28)*100}%` }}>
            空
          </div>
          <div className="bg-sky-500 border-r border-sky-600 flex items-center justify-center transition-all duration-300 hover:opacity-85" style={{ width: `${(6/28)*100}%` }}>
            D(6)
          </div>
          {/* D完了(17)〜A開始(21)の空白 4分 */}
          <div className="bg-slate-950/40 text-slate-500 flex items-center justify-center text-[10px]" style={{ width: `${(4/28)*100}%` }}>
            待機
          </div>
          <div className="bg-emerald-500 border-r border-emerald-600 flex items-center justify-center transition-all duration-300 hover:opacity-85" style={{ width: `${(5/28)*100}%` }}>
            A(5)
          </div>
          <div className="bg-amber-500 flex items-center justify-center transition-all duration-300 hover:opacity-85" style={{ width: `${(2/28)*100}%` }}>
            C(2)
          </div>
        </div>
      </div>
    </div>

    {/* 目盛り表示 */}
    <div className="flex justify-between text-[9px] text-slate-500 mt-2 px-1">
      <span>0分</span>
      <span>3分</span>
      <span>10分</span>
      <span>11分</span>
      <span>17分</span>
      <span>21分</span>
      <span>25分</span>
      <span>26分</span>
      <span className="text-emerald-400 font-bold">28分(終了)</span>
    </div>
  </div>
);

// 問題10 生産の管理方式 解説図
const ControlSVG = () => (
  <svg viewBox="0 0 740 320" className="w-full max-w-2xl mx-auto bg-slate-900 border border-slate-800 rounded-lg p-4 shadow-inner">
    <text x="370" y="25" fill="#f8fafc" className="text-sm font-bold" textAnchor="middle">◆ 製番管理方式のフロー</text>
    <defs>
      <marker id="control-arrow" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse">
        <path d="M 0 1 L 10 5 L 0 9 z" fill="#94a3b8" />
      </marker>
    </defs>
    <g>
      <rect x="20" y="60" width="130" height="40" fill="#1e293b" stroke="#475569" strokeWidth="1.5" rx="4" />
      <text x="85" y="85" fill="#cbd5e1" className="text-[10px] font-bold" textAnchor="middle">製品の受注</text>
    </g>
    <g>
      <rect x="180" y="60" width="130" height="40" fill="#312e81" stroke="#6366f1" strokeWidth="2" rx="4" />
      <text x="245" y="80" fill="#f8fafc" className="text-[10px] font-bold" textAnchor="middle">製番付与</text>
      <text x="245" y="94" fill="#a5b4fc" className="text-[9px] font-mono" textAnchor="middle">No. 0123</text>
    </g>
    <path d="M 150 80 L 180 80" fill="none" stroke="#94a3b8" strokeWidth="1.5" markerEnd="url(#control-arrow)" />
    
    <g>
      <rect x="20" y="150" width="120" height="50" fill="#0f172a" stroke="#475569" strokeWidth="1.5" rx="4" />
      <text x="80" y="175" fill="#cbd5e1" className="text-[10px] font-semibold" textAnchor="middle">図面作成 (0123)</text>
    </g>
    <path d="M 245 100 L 245 125 L 80 125 L 80 150" fill="none" stroke="#94a3b8" strokeWidth="1.5" markerEnd="url(#control-arrow)" />
    
    <g>
      <rect x="170" y="150" width="120" height="50" fill="#0f172a" stroke="#475569" strokeWidth="1.5" rx="4" />
      <text x="230" y="175" fill="#cbd5e1" className="text-[10px] font-semibold" textAnchor="middle">製造指示書 (0123)</text>
      <text x="230" y="192" fill="#94a3b8" className="text-[8px]" textAnchor="middle">生産・進捗・出庫</text>
    </g>
    <path d="M 140 175 L 170 175" fill="none" stroke="#94a3b8" strokeWidth="1.5" markerEnd="url(#control-arrow)" />

    <g>
      <rect x="320" y="150" width="120" height="50" fill="#0f172a" stroke="#475569" strokeWidth="1.5" rx="4" />
      <text x="380" y="175" fill="#cbd5e1" className="text-[10px] font-semibold" textAnchor="middle">部品構成表 (0123)</text>
    </g>
    <path d="M 290 175 L 320 175" fill="none" stroke="#94a3b8" strokeWidth="1.5" markerEnd="url(#control-arrow)" />

    <g>
      <rect x="470" y="150" width="120" height="50" fill="#0f172a" stroke="#475569" strokeWidth="1.5" rx="4" />
      <text x="530" y="175" fill="#cbd5e1" className="text-[10px] font-semibold" textAnchor="middle">部品発注書 (0123)</text>
    </g>
    <path d="M 440 175 L 470 175" fill="none" stroke="#94a3b8" strokeWidth="1.5" markerEnd="url(#control-arrow)" />

    <g>
      <rect x="170" y="245" width="420" height="40" fill="#1e293b" stroke="#3b82f6" strokeWidth="1.5" rx="4" />
      <text x="380" y="269" fill="#93c5fd" className="text-[11px] font-bold" textAnchor="middle">製造原価計算書 (製番: 0123)</text>
    </g>
    <path d="M 230 200 L 230 245" fill="none" stroke="#94a3b8" strokeWidth="1.5" markerEnd="url(#control-arrow)" />
    <path d="M 530 200 L 530 245" fill="none" stroke="#94a3b8" strokeWidth="1.5" markerEnd="url(#control-arrow)" />
  </svg>
);

// 問題11 トヨタ生産方式 かんばん方式解説図
const ToyotaSVG = () => (
  <svg viewBox="0 0 680 260" className="w-full max-w-2xl mx-auto bg-slate-900 border border-slate-800 rounded-lg p-4 shadow-inner">
    <text x="340" y="25" fill="#f8fafc" className="text-sm font-bold" textAnchor="middle">◆ かんばん方式の循環フロー</text>
    <defs>
      <marker id="toyota-arrow" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse">
        <path d="M 0 1 L 10 5 L 0 9 z" fill="#38bdf8" />
      </marker>
      <marker id="toyota-arrow-rev" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse">
        <path d="M 0 1 L 10 5 L 0 9 z" fill="#10b981" />
      </marker>
    </defs>
    
    <g>
      <rect x="40" y="70" width="120" height="60" fill="#0f172a" stroke="#475569" strokeWidth="1.5" rx="6" />
      <text x="100" y="95" fill="#f8fafc" className="text-xs font-bold" textAnchor="middle">前工程 (工程1)</text>
      <text x="100" y="115" fill="#94a3b8" className="text-[9px]" textAnchor="middle">仕掛品保管所</text>
    </g>

    <g>
      <rect x="520" y="70" width="120" height="60" fill="#0f172a" stroke="#475569" strokeWidth="1.5" rx="6" />
      <text x="580" y="95" fill="#f8fafc" className="text-xs font-bold" textAnchor="middle">後工程 (工程2)</text>
      <text x="580" y="115" fill="#94a3b8" className="text-[9px]" textAnchor="middle">組立・消費</text>
    </g>

    {/* 引取りかんばん */}
    <g>
      <rect x="240" y="50" width="200" height="70" fill="#1e293b" stroke="#38bdf8" strokeWidth="2" rx="4" />
      <text x="340" y="72" fill="#38bdf8" className="text-xs font-bold" textAnchor="middle">【引取りかんばん】</text>
      <text x="340" y="92" fill="#cbd5e1" className="text-[10px]" textAnchor="middle">工程2 → 工程1</text>
      <text x="340" y="108" fill="#e2e8f0" className="text-[9px] font-mono" textAnchor="middle">品番: 0123 / 数量: 2ケース</text>
    </g>

    {/* 伝達の流れ */}
    <path d="M 520 85 Q 380 30 240 85" fill="none" stroke="#38bdf8" strokeWidth="1.5" markerEnd="url(#toyota-arrow)" />
    <path d="M 240 100 Q 180 120 160 105" fill="none" stroke="#38bdf8" strokeWidth="1.5" markerEnd="url(#toyota-arrow)" />

    {/* 部品の運搬 */}
    <path d="M 160 120 Q 340 190 520 120" fill="none" stroke="#10b981" strokeWidth="1.5" strokeDasharray="3,3" markerEnd="url(#toyota-arrow-rev)" />
    <text x="340" y="180" fill="#10b981" className="text-[10px] font-bold" textAnchor="middle">使った分だけ前工程から引き取る（現品運搬）</text>
  </svg>
);

// --- APP COMPONENT ---
export default function App() {
  // 状態管理
  const [userId, setUserId] = useState("");
  const [inputUserId, setInputUserId] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  const [screen, setScreen] = useState("dashboard"); // "dashboard" | "quiz" | "summary"
  const [currentMode, setCurrentMode] = useState("all"); // "all" | "wrong" | "review"
  
  // クイズ回答用状態
  const [quizList, setQuizList] = useState([]);
  const [currentQuizIndex, setCurrentQuizIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [isAnswered, setIsAnswered] = useState(false);
  
  // 学習履歴同期用状態
  const [progress, setProgress] = useState({
    progressIndex: 0,
    progressMode: "all",
    history: {}, // { questionId: { correct: boolean, timestamp: string } }
    reviews: {}  // { questionId: boolean }
  });

  // 途中再開モーダルの割り込みガードレール用
  const [showResumeModal, setShowResumeModal] = useState(false);
  const [pendingProgress, setPendingProgress] = useState(null);

  // screenRef の定義 (回答中の途中再開ダイアログ再割り込みバグを防止)
  const screenRef = useRef(screen);
  useEffect(() => {
    screenRef.current = screen;
  }, [screen]);

  // 初回読み込み判定 Ref
  const isFirstLoad = useRef(true);
  useEffect(() => {
    if (userId) {
      isFirstLoad.current = true;
    }
  }, [userId]);

  // Firebaseの匿名認証
  useEffect(() => {
    const runAuth = async () => {
      if (auth) {
        try {
          console.log("Starting anonymous auth...");
          await signInAnonymously(auth);
          console.log("Anonymous auth succeeded");
        } catch (e) {
          console.error("Anonymous authentication error:", e);
        }
      }
      setIsAuthLoading(false);
    };
    runAuth();
  }, []);

  // 履歴復元 (ユーザーが合言葉を入力したタイミングでFirestoreまたはLocalStorageから取得)
  const loadUserData = async (targetUserId) => {
    if (!targetUserId.trim()) return;
    setIsAuthLoading(true);
    console.log(`Fetching progress data for user: ${targetUserId}`);
    
    let dbData = null;
    
    // 1. Firestore からの取得試行
    if (db) {
      try {
        const docRef = doc(db, "users", `${APP_ID}_${targetUserId}`);
        const snap = await getDoc(docRef);
        if (snap.exists()) {
          dbData = snap.data();
          console.log("Firestore progress data successfully fetched:", dbData);
        } else {
          console.log("No data found in Firestore for this user, fallback to initial state.");
        }
      } catch (e) {
        console.error("Firestore read error. Attempting Local Storage fallback.", e);
      }
    }

    // 2. ローカルストレージからのフォールバック
    if (!dbData) {
      try {
        const localKey = `${APP_ID}_${targetUserId}_progress`;
        const localDataRaw = localStorage.getItem(localKey);
        if (localDataRaw) {
          dbData = JSON.parse(localDataRaw);
          console.log("Local Storage progress data successfully fetched:", dbData);
        }
      } catch (e) {
        console.error("Local Storage read error:", e);
      }
    }

    // 3. データ適用と画面切り替え
    const loadedProgress = {
      progressIndex: Number(dbData?.progressIndex || 0),
      progressMode: dbData?.progressMode || "all",
      history: dbData?.history || {},
      reviews: dbData?.reviews || {}
    };

    setProgress(loadedProgress);
    setUserId(targetUserId);
    setIsAuthenticated(true);
    setIsAuthLoading(false);

    // 初回ロード時かつダッシュボードにいるときだけ途中再開ダイアログのポップアップ判断
    if (loadedProgress.progressIndex > 0) {
      console.log(`Pending progress index ${loadedProgress.progressIndex} detected for restore.`);
      setPendingProgress(loadedProgress);
      setShowResumeModal(true);
    }

    // 4. Firestore リアルタイム同期監視の開始
    if (db) {
      const docRef = doc(db, "users", `${APP_ID}_${targetUserId}`);
      const unsubscribe = onSnapshot(docRef, (snapshot) => {
        if (snapshot.exists()) {
          const remoteData = snapshot.data();
          const parsed = {
            progressIndex: Number(remoteData.progressIndex || 0),
            progressMode: remoteData.progressMode || "all",
            history: remoteData.history || {},
            reviews: remoteData.reviews || {}
          };
          
          // ガードレール：初回かつダッシュボード画面のときのみポップアップ起動
          if (isFirstLoad.current && screenRef.current === "dashboard") {
            isFirstLoad.current = false;
            if (parsed.progressIndex > 0) {
              console.log("onSnapshot triggering restore modal popup.");
              setPendingProgress(parsed);
              setShowResumeModal(true);
              return;
            }
          }
          // すでに画面遷移している場合や初回起動以外は、再割り込みダイアログを表示せず、進捗のみを更新する
          setProgress(parsed);
        }
      }, (err) => {
        console.error("onSnapshot error:", err);
      });

      return () => unsubscribe();
    }
  };

  // 進捗データを保存する共通ロジック
  const saveProgress = async (newProgress) => {
    if (!userId) return;
    
    // ローカル状態への即時反映
    setProgress(newProgress);

    // ローカルストレージへの書き込み
    try {
      localStorage.setItem(`${APP_ID}_${userId}_progress`, JSON.stringify(newProgress));
    } catch (e) {
      console.error("LocalStorage write error:", e);
    }

    // Firestoreへの書き込み
    if (db) {
      try {
        const docRef = doc(db, "users", `${APP_ID}_${userId}`);
        await setDoc(docRef, newProgress, { merge: true });
        console.log("Progress saved to Firestore:", newProgress);
      } catch (e) {
        console.error("Firestore write error:", e);
      }
    }
  };

  // 出題クイズリストの構築
  const startQuiz = (mode) => {
    let filteredList = [];
    if (mode === "all") {
      filteredList = [...QUESTIONS];
    } else if (mode === "wrong") {
      filteredList = QUESTIONS.filter(q => {
        const hist = progress.history[q.id];
        return hist && hist.correct === false;
      });
    } else if (mode === "review") {
      filteredList = QUESTIONS.filter(q => progress.reviews[q.id] === true);
    }

    if (filteredList.length === 0) {
      alert("該当する問題がありません。別モードを選択してください。");
      return;
    }

    console.log(`Starting quiz with mode: ${mode}, size: ${filteredList.length}`);
    setQuizList(filteredList);
    setCurrentMode(mode);
    setCurrentQuizIndex(0);
    setSelectedOption(null);
    setIsAnswered(false);
    setScreen("quiz");
  };

  // 途中再開の確認
  const handleResume = (shouldResume) => {
    setShowResumeModal(false);
    if (!pendingProgress) return;

    if (shouldResume) {
      console.log("Restoring from pending progress.");
      const restoredMode = pendingProgress.progressMode;
      let filteredList = [];
      if (restoredMode === "all") {
        filteredList = [...QUESTIONS];
      } else if (restoredMode === "wrong") {
        filteredList = QUESTIONS.filter(q => {
          const hist = pendingProgress.history[q.id];
          return hist && hist.correct === false;
        });
      } else if (restoredMode === "review") {
        filteredList = QUESTIONS.filter(q => pendingProgress.reviews[q.id] === true);
      }

      // インデックスの境界チェック
      const targetIdx = pendingProgress.progressIndex;
      if (filteredList.length > 0 && targetIdx < filteredList.length) {
        setQuizList(filteredList);
        setCurrentMode(restoredMode);
        setCurrentQuizIndex(targetIdx);
        setSelectedOption(null);
        setIsAnswered(false);
        setScreen("quiz");
        console.log(`Restored successfully at Mode: ${restoredMode}, Index: ${targetIdx}`);
      } else {
        console.log("Failed to restore: filtered list size was smaller than index. Resetting.");
        startQuiz("all");
      }
    } else {
      console.log("User chose to start from beginning. Resetting progress index.");
      const resetProgress = {
        ...progress,
        progressIndex: 0,
        progressMode: "all"
      };
      saveProgress(resetProgress);
    }
    setPendingProgress(null);
  };

  // 解答処理
  const handleOptionClick = (idx) => {
    if (isAnswered) return;
    setSelectedOption(idx);
    setIsAnswered(true);

    const question = quizList[currentQuizIndex];
    const isCorrect = idx === question.answerIndex;
    
    // 進捗の更新
    const updatedHistory = {
      ...progress.history,
      [question.id]: {
        correct: isCorrect,
        timestamp: new Date().toISOString()
      }
    };

    const nextIndex = currentQuizIndex + 1;
    // 完走した場合は進捗インデックスを 0 にリセット
    const finalProgressIndex = nextIndex >= quizList.length ? 0 : nextIndex;

    const newProgress = {
      ...progress,
      progressIndex: finalProgressIndex,
      progressMode: currentMode,
      history: updatedHistory
    };

    saveProgress(newProgress);
  };

  // 要復習フラグ切り替え
  const toggleReview = (questionId) => {
    const currentVal = progress.reviews[questionId] || false;
    const newProgress = {
      ...progress,
      reviews: {
        ...progress.reviews,
        [questionId]: !currentVal
      }
    };
    saveProgress(newProgress);
  };

  // 次の問題へ
  const handleNextQuestion = () => {
    if (currentQuizIndex + 1 < quizList.length) {
      setCurrentQuizIndex(prev => prev + 1);
      setSelectedOption(null);
      setIsAnswered(false);
    } else {
      // 終了画面へ
      setScreen("summary");
    }
  };

  // ホームに戻る処理
  const handleGoHome = () => {
    setScreen("dashboard");
    setSelectedOption(null);
    setIsAnswered(false);
  };

  // 学習統計指標の算出
  const stats = useMemo(() => {
    const totalCount = QUESTIONS.length;
    const solvedCount = Object.keys(progress.history).length;
    
    // 1. 総合進捗率 (全11問中何問着手したか)
    const progressRate = Math.round((solvedCount / totalCount) * 100) || 0;

    // 2. 全問正解率 (全11問中の正答数)
    const correctCount = QUESTIONS.filter(q => progress.history[q.id]?.correct === true).length;
    const correctRate = Math.round((correctCount / totalCount) * 100) || 0;

    // 3. 回答正確性 (正答数 / 着手済数)
    const accuracy = solvedCount > 0 ? Math.round((correctCount / solvedCount) * 100) : 0;

    // 4. カテゴリ別進捗率
    const cat1Questions = QUESTIONS.filter(q => q.category === "生産計画とスケジューリング");
    const cat2Questions = QUESTIONS.filter(q => q.category === "需要予測と生産統制");

    const cat1Solved = cat1Questions.filter(q => progress.history[q.id] !== undefined).length;
    const cat2Solved = cat2Questions.filter(q => progress.history[q.id] !== undefined).length;

    const cat1Rate = Math.round((cat1Solved / cat1Questions.length) * 100) || 0;
    const cat2Rate = Math.round((cat2Solved / cat2Questions.length) * 100) || 0;

    return {
      progressRate,
      correctRate,
      accuracy,
      cat1Rate,
      cat2Rate,
      solvedCount,
      correctCount,
      totalCount
    };
  }, [progress]);

  // レーダーチャート用のデータ構築
  const chartData = useMemo(() => {
    return [
      { subject: "総合進捗率", A: stats.progressRate, fullMark: 100 },
      { subject: "全問正解率", A: stats.correctRate, fullMark: 100 },
      { subject: "回答正確性", A: stats.accuracy, fullMark: 100 },
      { subject: "計画・スケジューリング", A: stats.cat1Rate, fullMark: 100 },
      { subject: "需要予測・生産統制", A: stats.cat2Rate, fullMark: 100 }
    ];
  }, [stats]);

  // ローディング画面
  if (isAuthLoading) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col justify-center items-center text-slate-100 font-sans">
        <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-sm font-semibold tracking-wider text-slate-400">進捗を読み込んでいます...</p>
      </div>
    );
  }

  // A. 合言葉入力画面 (未認証時は強制分離してメイン画面を描画させない)
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col justify-center items-center text-slate-100 font-sans px-4">
        <div className="w-full max-w-md bg-slate-900 border border-slate-800 p-8 rounded-2xl shadow-2xl relative overflow-hidden">
          {/* 背景の装飾光 */}
          <div className="absolute -top-20 -left-20 w-48 h-48 bg-indigo-600/20 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-20 -right-20 w-48 h-48 bg-sky-600/20 rounded-full blur-3xl"></div>

          <div className="relative">
            <div className="flex justify-center mb-6">
              <div className="p-3 bg-indigo-500/10 rounded-xl border border-indigo-500/20">
                <BookOpen className="w-8 h-8 text-indigo-400" />
              </div>
            </div>

            <h2 className="text-xl font-extrabold text-center text-slate-50 tracking-tight mb-2">スマート問題集 3-3</h2>
            <p className="text-xs text-center text-slate-400 mb-8 font-medium">生産計画と生産統制 同期システム</p>

            <form 
              onSubmit={(e) => {
                e.preventDefault();
                loadUserData(inputUserId);
              }}
              className="space-y-5"
            >
              <div>
                <label htmlFor="passphrase" className="block text-xs font-semibold text-slate-400 mb-2 tracking-wider">
                  同期用の合言葉（ユーザーID）
                </label>
                <input
                  id="passphrase"
                  type="text"
                  required
                  placeholder="例: my-study-room"
                  value={inputUserId}
                  onChange={(e) => setInputUserId(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 placeholder-slate-600 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-gradient-to-r from-indigo-600 to-sky-600 hover:from-indigo-500 hover:to-sky-500 text-white font-semibold text-sm rounded-xl transition duration-200 transform hover:scale-[1.01] hover:shadow-lg hover:shadow-indigo-500/20 flex items-center justify-center gap-2"
              >
                学習室に入る
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-indigo-500 selection:text-white pb-12">
      {/* ナビゲーションバー */}
      <header className="border-b border-slate-900 bg-slate-950/80 backdrop-blur sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="bg-gradient-to-r from-indigo-500 to-sky-500 text-transparent bg-clip-text font-black text-lg tracking-wider">
              SMART WORKBOOK 3-3
            </span>
          </div>
          <div className="flex items-center gap-4 text-xs font-medium text-slate-400">
            <span className="flex items-center gap-1.5 bg-slate-900 px-3 py-1.5 rounded-full border border-slate-800">
              <User className="w-3.5 h-3.5 text-indigo-400" />
              ID: <span className="text-slate-200 font-bold">{userId}</span>
            </span>
            <button 
              onClick={() => {
                setIsAuthenticated(false);
                setUserId("");
                setInputUserId("");
              }}
              className="hover:text-slate-200 flex items-center gap-1 transition"
            >
              閉じる
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 mt-8">
        {/* B-1. 途中再開モーダル */}
        {showResumeModal && (
          <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex justify-center items-center px-4">
            <div className="w-full max-w-md bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-2xl relative">
              <h3 className="text-lg font-bold text-slate-50 mb-2 flex items-center gap-2">
                <RefreshCw className="w-5 h-5 text-indigo-400 animate-spin" />
                学習データが見つかりました
              </h3>
              <p className="text-sm text-slate-400 mb-6 leading-relaxed">
                前回は <span className="text-indigo-400 font-bold">問題{Number(pendingProgress?.progressIndex || 0) + 1}</span> まで進んでいます。<br />
                中断したモードの続きから再開しますか？
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => handleResume(true)}
                  className="flex-1 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm rounded-xl transition duration-150 transform hover:scale-[1.01]"
                >
                  続きから再開
                </button>
                <button
                  onClick={() => handleResume(false)}
                  className="flex-1 py-3 bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-sm rounded-xl transition duration-150 transform hover:scale-[1.01]"
                >
                  最初から開始
                </button>
              </div>
            </div>
          </div>
        )}

        {/* B-2. メインダッシュボード */}
        {screen === "dashboard" && (
          <div className="space-y-8">
            {/* 上部サマリーとレーダー */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* 学習レーダーチャート */}
              <div className="lg:col-span-2 bg-slate-900/60 border border-slate-800/80 rounded-2xl p-6 shadow-xl relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 via-sky-500 to-indigo-500"></div>
                <h3 className="text-sm font-bold text-slate-400 mb-4 tracking-wider uppercase">学習習得度分析</h3>
                
                <div className="h-72 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart cx="50%" cy="50%" radius="80%" data={chartData}>
                      <PolarGrid stroke="#334155" />
                      <PolarAngleAxis dataKey="subject" tick={{ fill: "#94a3b8", fontSize: 10 }} />
                      <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fill: "#64748b", fontSize: 9 }} />
                      <Radar
                        name="習得率"
                        dataKey="A"
                        stroke="#6366f1"
                        fill="#6366f1"
                        fillOpacity={0.2}
                      />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* スタッツ・進捗状況 */}
              <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-6 shadow-xl flex flex-col justify-between relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-sky-500 via-indigo-500 to-sky-500"></div>
                <div>
                  <h3 className="text-sm font-bold text-slate-400 mb-6 tracking-wider uppercase">学習スタッツ</h3>
                  
                  <div className="space-y-6">
                    <div className="flex justify-between items-center pb-4 border-b border-slate-800">
                      <span className="text-xs text-slate-400 font-semibold">総合進捗率</span>
                      <span className="text-2xl font-black text-indigo-400">{stats.progressRate}%</span>
                    </div>
                    <div className="flex justify-between items-center pb-4 border-b border-slate-800">
                      <span className="text-xs text-slate-400 font-semibold">全問正解率</span>
                      <span className="text-2xl font-black text-emerald-400">{stats.correctRate}%</span>
                    </div>
                    <div className="flex justify-between items-center pb-4 border-b border-slate-800">
                      <span className="text-xs text-slate-400 font-semibold">回答正確性</span>
                      <span className="text-2xl font-black text-sky-400">{stats.accuracy}%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-slate-400 font-semibold">解答状況</span>
                      <span className="text-sm font-bold text-slate-200">
                        {stats.correctCount} 正解 / {stats.solvedCount} 解答 ({stats.totalCount}問中)
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mt-8 space-y-3">
                  <button
                    onClick={() => startQuiz("all")}
                    className="w-full py-3 bg-gradient-to-r from-indigo-600 to-sky-600 hover:from-indigo-500 hover:to-sky-500 text-white font-semibold text-xs rounded-xl transition transform hover:scale-[1.01] flex items-center justify-center gap-2"
                  >
                    <BookOpen className="w-4 h-4" />
                    すべての問題に挑戦
                  </button>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={() => startQuiz("wrong")}
                      className="py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-[10px] rounded-lg border border-slate-700 transition transform hover:scale-[1.01] flex items-center justify-center gap-1.5"
                    >
                      <X className="w-3.5 h-3.5 text-rose-500" />
                      前回不正解のみ
                    </button>
                    <button
                      onClick={() => startQuiz("review")}
                      className="py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-[10px] rounded-lg border border-slate-700 transition transform hover:scale-[1.01] flex items-center justify-center gap-1.5"
                    >
                      <HelpCircle className="w-3.5 h-3.5 text-amber-500" />
                      要復習のみ
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* 問題一覧と正誤グリッド */}
            <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-6 shadow-xl">
              <h3 className="text-sm font-bold text-slate-400 mb-6 tracking-wider uppercase">問題別学習ステータス</h3>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-slate-800 text-slate-500 uppercase tracking-wider font-semibold">
                      <th className="py-3 px-4">問題</th>
                      <th className="py-3 px-4">大カテゴリ</th>
                      <th className="py-3 px-4">状態</th>
                      <th className="py-3 px-4">要復習</th>
                      <th className="py-3 px-4">最終解答日時</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/50">
                    {QUESTIONS.map((q) => {
                      const hist = progress.history[q.id];
                      const isReview = progress.reviews[q.id] || false;
                      let statusBadge = (
                        <span className="px-2 py-1 bg-slate-800 text-slate-400 rounded-full font-bold text-[9px]">未着手</span>
                      );
                      if (hist) {
                        statusBadge = hist.correct ? (
                          <span className="px-2 py-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-full font-bold text-[9px]">正解</span>
                        ) : (
                          <span className="px-2 py-1 bg-rose-500/10 text-rose-400 border border-rose-500/20 rounded-full font-bold text-[9px]">不正解</span>
                        );
                      }

                      return (
                        <tr key={q.id} className="hover:bg-slate-800/20 transition">
                          <td className="py-3 px-4 font-bold text-slate-200">
                            {q.title}
                            <span className="ml-2 px-1.5 py-0.5 bg-slate-800 text-slate-400 rounded text-[9px] font-normal font-mono">
                              {q.source}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-slate-400 font-medium">{q.category}</td>
                          <td className="py-3 px-4">{statusBadge}</td>
                          <td className="py-3 px-4">
                            <button 
                              onClick={() => toggleReview(q.id)}
                              className={`p-1 rounded transition ${isReview ? "text-amber-500 hover:text-amber-400" : "text-slate-600 hover:text-slate-500"}`}
                            >
                              <HelpCircle className="w-4 h-4" />
                            </button>
                          </td>
                          <td className="py-3 px-4 text-slate-500 font-mono">
                            {hist?.timestamp ? new Date(hist.timestamp).toLocaleString("ja-JP", { hour12: false }) : "-"}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* B-3. 出題画面 */}
        {screen === "quiz" && quizList[currentQuizIndex] && (
          <div className="max-w-3xl mx-auto space-y-6">
            <div className="flex justify-between items-center">
              <button
                onClick={handleGoHome}
                className="flex items-center gap-1 text-xs text-slate-400 hover:text-slate-200 transition"
              >
                <Home className="w-4 h-4" />
                ホームに戻る
              </button>
              <span className="text-xs text-slate-400 font-bold font-mono">
                {currentQuizIndex + 1} / {quizList.length} 問目 ({currentMode === "all" ? "すべての問題" : currentMode === "wrong" ? "前回不正解のみ" : "要復習のみ"})
              </span>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 md:p-8 shadow-2xl space-y-6 relative overflow-hidden">
              {/* 問題の出典バッジ */}
              <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                <span className="text-sm font-extrabold text-indigo-400">
                  {quizList[currentQuizIndex].title}
                </span>
                <span className="px-2 py-0.5 bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 rounded font-bold text-[10px] font-mono">
                  {quizList[currentQuizIndex].source}
                </span>
              </div>

              {/* 問題文 */}
              <div className="text-sm text-slate-100 font-medium leading-relaxed whitespace-pre-wrap">
                {quizList[currentQuizIndex].text}
              </div>

              {/* 内製SVG図表・テーブルの動的レンダリング */}
              {quizList[currentQuizIndex].hasDiagram && (
                <div className="border border-slate-800/80 rounded-xl p-4 bg-slate-950/40 space-y-4">
                  {/* 問題4 テーブル */}
                  {quizList[currentQuizIndex].id === "q_4" && (
                    <div className="overflow-x-auto max-w-md mx-auto">
                      <table className="w-full text-center border-collapse border border-slate-800 text-xs">
                        <thead>
                          <tr className="bg-slate-800 text-slate-300 font-bold">
                            <th className="border border-slate-700 py-1.5 px-3">作業</th>
                            <th className="border border-slate-700 py-1.5 px-3">作業日数</th>
                            <th className="border border-slate-700 py-1.5 px-3">先行作業</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800 font-medium text-slate-300">
                          <tr><td className="border border-slate-700 py-1.5">A</td><td className="border border-slate-700 py-1.5">20</td><td className="border border-slate-700 py-1.5">なし</td></tr>
                          <tr><td className="border border-slate-700 py-1.5">B</td><td className="border border-slate-700 py-1.5">25</td><td className="border border-slate-700 py-1.5">A</td></tr>
                          <tr><td className="border border-slate-700 py-1.5">C</td><td className="border border-slate-700 py-1.5">15</td><td className="border border-slate-700 py-1.5">A</td></tr>
                          <tr><td className="border border-slate-700 py-1.5">D</td><td className="border border-slate-700 py-1.5">30</td><td className="border border-slate-700 py-1.5">A</td></tr>
                          <tr><td className="border border-slate-700 py-1.5">E</td><td className="border border-slate-700 py-1.5">20</td><td className="border border-slate-700 py-1.5">B</td></tr>
                          <tr><td className="border border-slate-700 py-1.5">F</td><td className="border border-slate-700 py-1.5">25</td><td className="border border-slate-700 py-1.5">C</td></tr>
                          <tr><td className="border border-slate-700 py-1.5">G</td><td className="border border-slate-700 py-1.5">20</td><td className="border border-slate-700 py-1.5">B, C, D</td></tr>
                          <tr><td className="border border-slate-700 py-1.5">H</td><td className="border border-slate-700 py-1.5">10</td><td className="border border-slate-700 py-1.5">E, F, G</td></tr>
                        </tbody>
                      </table>
                    </div>
                  )}

                  {/* 問題5 テーブル */}
                  {quizList[currentQuizIndex].id === "q_5" && (
                    <div className="overflow-x-auto max-w-md mx-auto">
                      <table className="w-full text-center border-collapse border border-slate-800 text-xs">
                        <thead>
                          <tr className="bg-slate-800 text-slate-300 font-bold">
                            <th className="border border-slate-700 py-1.5 px-3">作業工程</th>
                            <th className="border border-slate-700 py-1.5 px-3">作業日数</th>
                            <th className="border border-slate-700 py-1.5 px-3">先行作業</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800 font-medium text-slate-300">
                          <tr><td className="border border-slate-700 py-1.5">A</td><td className="border border-slate-700 py-1.5">5</td><td className="border border-slate-700 py-1.5">なし</td></tr>
                          <tr><td className="border border-slate-700 py-1.5">B</td><td className="border border-slate-700 py-1.5">2</td><td className="border border-slate-700 py-1.5">A</td></tr>
                          <tr><td className="border border-slate-700 py-1.5">C</td><td className="border border-slate-700 py-1.5">4</td><td className="border border-slate-700 py-1.5">A</td></tr>
                          <tr><td className="border border-slate-700 py-1.5">D</td><td className="border border-slate-700 py-1.5">2</td><td className="border border-slate-700 py-1.5">C</td></tr>
                          <tr><td className="border border-slate-700 py-1.5">E</td><td className="border border-slate-700 py-1.5">3</td><td className="border border-slate-700 py-1.5">B, D</td></tr>
                        </tbody>
                      </table>
                    </div>
                  )}

                  {/* 問題6 テーブル */}
                  {quizList[currentQuizIndex].id === "q_6" && (
                    <div className="overflow-x-auto max-w-lg mx-auto">
                      <table className="w-full text-center border-collapse border border-slate-800 text-xs">
                        <thead>
                          <tr className="bg-slate-800 text-slate-300 font-bold">
                            <th className="border border-slate-700 py-2 px-3">作業名</th>
                            <th className="border border-slate-700 py-2 px-3">先行作業</th>
                            <th className="border border-slate-700 py-2 px-3">所要期間（日）</th>
                            <th className="border border-slate-700 py-2 px-3">最短所要期間（日）</th>
                            <th className="border border-slate-700 py-2 px-3">単位あたり短縮費用（万円）</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800 font-medium text-slate-300">
                          <tr><td className="border border-slate-700 py-2 font-bold">A</td><td className="border border-slate-700 py-2">－</td><td className="border border-slate-700 py-2">6</td><td className="border border-slate-700 py-2">6</td><td className="border border-slate-700 py-2">-</td></tr>
                          <tr><td className="border border-slate-700 py-2 font-bold">B</td><td className="border border-slate-700 py-2">A</td><td className="border border-slate-700 py-2">4</td><td className="border border-slate-700 py-2">3</td><td className="border border-slate-700 py-2">10</td></tr>
                          <tr><td className="border border-slate-700 py-2 font-bold">C</td><td className="border border-slate-700 py-2">A</td><td className="border border-slate-700 py-2">5</td><td className="border border-slate-700 py-2">2</td><td className="border border-slate-700 py-2">30</td></tr>
                          <tr><td className="border border-slate-700 py-2 font-bold">D</td><td className="border border-slate-700 py-2">B, C</td><td className="border border-slate-700 py-2">6</td><td className="border border-slate-700 py-2">3</td><td className="border border-slate-700 py-2">50</td></tr>
                        </tbody>
                      </table>
                    </div>
                  )}

                  {/* 問題7 テーブル */}
                  {quizList[currentQuizIndex].id === "q_7" && (
                    <div className="overflow-x-auto max-w-sm mx-auto">
                      <table className="w-full text-center border-collapse border border-slate-800 text-xs">
                        <thead>
                          <tr className="bg-slate-800 text-slate-300 font-bold">
                            <th className="border border-slate-700 py-2 px-3"></th>
                            <th className="border border-slate-700 py-2 px-3">工程1（穴あけ）</th>
                            <th className="border border-slate-700 py-2 px-3">工程2（塗装）</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800 font-medium text-slate-300">
                          <tr><td className="border border-slate-700 py-2 font-bold">製品A</td><td className="border border-slate-700 py-2">10</td><td className="border border-slate-700 py-2">5</td></tr>
                          <tr><td className="border border-slate-700 py-2 font-bold">製品B</td><td className="border border-slate-700 py-2">3</td><td className="border border-slate-700 py-2">7</td></tr>
                          <tr><td className="border border-slate-700 py-2 font-bold">製品C</td><td className="border border-slate-700 py-2">4</td><td className="border border-slate-700 py-2">2</td></tr>
                          <tr><td className="border border-slate-700 py-2 font-bold">製品D</td><td className="border border-slate-700 py-2">8</td><td className="border border-slate-700 py-2">6</td></tr>
                        </tbody>
                      </table>
                    </div>
                  )}

                  {/* SVG アローダイアグラムの表示 */}
                  {quizList[currentQuizIndex].diagramType === "pert1" && (
                    <Pert1SVG showAnswers={isAnswered} />
                  )}
                  {quizList[currentQuizIndex].diagramType === "pert2" && (
                    <Pert2SVG showAnswers={isAnswered} />
                  )}
                  {quizList[currentQuizIndex].diagramType === "cpm" && (
                    <CpmSVG showAnswers={isAnswered} />
                  )}
                </div>
              )}

              {/* 選択肢 */}
              <div className="space-y-3">
                {quizList[currentQuizIndex].options.map((opt, oIdx) => {
                  let btnStyle = "bg-slate-950/40 hover:bg-slate-800/40 border-slate-800 text-slate-200 hover:scale-[1.005]";
                  let icon = null;

                  if (isAnswered) {
                    const isCorrectOption = oIdx === quizList[currentQuizIndex].answerIndex;
                    const isSelected = oIdx === selectedOption;

                    if (isCorrectOption) {
                      btnStyle = "bg-emerald-500/10 border-emerald-500 text-emerald-400";
                      icon = <Check className="w-5 h-5 text-emerald-400" />;
                    } else if (isSelected) {
                      btnStyle = "bg-rose-500/10 border-rose-500 text-rose-400";
                      icon = <X className="w-5 h-5 text-rose-400" />;
                    } else {
                      btnStyle = "bg-slate-950/10 border-slate-900 text-slate-600 opacity-60";
                    }
                  }

                  return (
                    <button
                      key={oIdx}
                      disabled={isAnswered}
                      onClick={() => handleOptionClick(oIdx)}
                      className={`w-full text-left p-4 rounded-xl border text-sm font-semibold transition duration-150 flex items-center justify-between gap-4 ${btnStyle}`}
                    >
                      <span>{opt}</span>
                      {icon}
                    </button>
                  );
                })}
              </div>

              {/* 解説エリア */}
              {isAnswered && (
                <div className="mt-8 pt-6 border-t border-slate-800 space-y-6 animate-fadeIn">
                  <div className="flex items-center justify-between bg-slate-950/60 p-4 rounded-xl border border-slate-800">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">復習設定</span>
                    <label className="flex items-center gap-2 text-xs font-bold text-amber-500 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={progress.reviews[quizList[currentQuizIndex].id] || false}
                        onChange={() => toggleReview(quizList[currentQuizIndex].id)}
                        className="rounded bg-slate-950 border-slate-800 text-amber-500 focus:ring-0"
                      />
                      要復習リストに追加
                    </label>
                  </div>

                  {/* 解説用SVGグラフィック・追加テーブルの表示 */}
                  {quizList[currentQuizIndex].diagramType === "scheduling" && (
                    <SchedulingClassificationSVG />
                  )}
                  {quizList[currentQuizIndex].diagramType === "pert3" && (
                    <Pert3SVG />
                  )}
                  {quizList[currentQuizIndex].diagramType === "pert2" && (
                    <div className="space-y-4">
                      <h4 className="text-center font-bold text-xs text-indigo-400">解説アローダイアグラム (解答入り)</h4>
                      <Pert2SVG showAnswers={true} />
                    </div>
                  )}
                  {quizList[currentQuizIndex].diagramType === "cpm" && (
                    <div className="space-y-6">
                      <CpmSVG showAnswers={true} />
                      <div className="overflow-x-auto max-w-xl mx-auto">
                        <table className="w-full text-center border-collapse border border-slate-800 text-xs">
                          <thead>
                            <tr className="bg-slate-800 text-slate-300 font-bold">
                              <th className="border border-slate-700 py-1.5">作業名</th>
                              <th className="border border-slate-700 py-1.5">先行</th>
                              <th className="border border-slate-700 py-1.5">当初(日)</th>
                              <th className="border border-slate-700 py-1.5">最短(日)</th>
                              <th className="border border-slate-700 py-1.5">短縮(日)</th>
                              <th className="border border-slate-700 py-1.5">費用/日(万)</th>
                              <th className="border border-slate-700 py-1.5">短縮費用(万)</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-800 font-medium text-slate-300">
                            <tr><td className="border border-slate-700 py-1.5 font-bold">A</td><td className="border border-slate-700 py-1.5">－</td><td className="border border-slate-700 py-1.5">6</td><td className="border border-slate-700 py-1.5">6</td><td className="border border-slate-700 py-1.5">-</td><td className="border border-slate-700 py-1.5">-</td><td className="border border-slate-700 py-1.5">-</td></tr>
                            <tr className="bg-indigo-950/20 text-indigo-300"><td className="border border-slate-700 py-1.5 font-bold">B</td><td className="border border-slate-700 py-1.5">A</td><td className="border border-slate-700 py-1.5">4</td><td className="border border-slate-700 py-1.5">3</td><td className="border border-slate-700 py-1.5 font-extrabold text-emerald-400">1</td><td className="border border-slate-700 py-1.5">10</td><td className="border border-slate-700 py-1.5 font-extrabold text-emerald-400">10</td></tr>
                            <tr className="bg-indigo-950/20 text-indigo-300"><td className="border border-slate-700 py-1.5 font-bold">C</td><td className="border border-slate-700 py-1.5">A</td><td className="border border-slate-700 py-1.5">5</td><td className="border border-slate-700 py-1.5">2</td><td className="border border-slate-700 py-1.5 font-extrabold text-emerald-400">2</td><td className="border border-slate-700 py-1.5">30</td><td className="border border-slate-700 py-1.5 font-extrabold text-emerald-400">60</td></tr>
                            <tr className="bg-indigo-950/20 text-indigo-300"><td className="border border-slate-700 py-1.5 font-bold">D</td><td className="border border-slate-700 py-1.5">B, C</td><td className="border border-slate-700 py-1.5">6</td><td className="border border-slate-700 py-1.5">3</td><td className="border border-slate-700 py-1.5 font-extrabold text-emerald-400">3</td><td className="border border-slate-700 py-1.5">50</td><td className="border border-slate-700 py-1.5 font-extrabold text-emerald-400">150</td></tr>
                            <tr className="bg-slate-800 font-bold"><td className="border border-slate-700 py-1.5" colSpan="6">合計費用</td><td className="border border-slate-700 py-1.5 text-emerald-400">220万円</td></tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}
                  {quizList[currentQuizIndex].diagramType === "johnson" && (
                    <div className="space-y-6">
                      <div className="overflow-x-auto max-w-sm mx-auto">
                        <table className="w-full text-center border-collapse border border-slate-800 text-xs">
                          <thead>
                            <tr className="bg-slate-800 text-slate-300 font-bold">
                              <th className="border border-slate-700 py-1.5">作業</th>
                              <th className="border border-slate-700 py-1.5">工程X (PC)</th>
                              <th className="border border-slate-700 py-1.5">工程Y (プリンタ)</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-800 font-medium text-slate-300">
                            <tr><td className="border border-slate-700 py-1.5 font-bold">A（書類1）</td><td className="border border-slate-700 py-1.5">40分</td><td className="border border-slate-700 py-1.5">20分</td></tr>
                            <tr><td className="border border-slate-700 py-1.5 font-bold">B（書類2）</td><td className="border border-slate-700 py-1.5">15分</td><td className="border border-slate-700 py-1.5">50分</td></tr>
                            <tr><td className="border border-slate-700 py-1.5 font-bold">C（書類3）</td><td className="border border-slate-700 py-1.5">35分</td><td className="border border-slate-700 py-1.5">25分</td></tr>
                            <tr><td className="border border-slate-700 py-1.5 font-bold">D（宛名）</td><td className="border border-slate-700 py-1.5">10分</td><td className="border border-slate-700 py-1.5">5分</td></tr>
                          </tbody>
                        </table>
                      </div>
                      <JohnsonGanttChart />
                    </div>
                  )}
                  {quizList[currentQuizIndex].diagramType === "control" && (
                    <div className="space-y-6">
                      <ControlSVG />
                      <div className="space-y-4">
                        <div className="overflow-x-auto max-w-md mx-auto">
                          <table className="w-full text-center border-collapse border border-slate-800 text-[10px]">
                            <thead>
                              <tr className="bg-slate-800 text-slate-300 font-bold">
                                <th className="border border-slate-700 py-1" colSpan="6">追番管理の製品A生産台数管理</th>
                              </tr>
                              <tr className="bg-slate-700 text-slate-200">
                                <th className="border border-slate-700 py-1">製品A</th>
                                <th className="border border-slate-700 py-1">4月1日</th>
                                <th className="border border-slate-700 py-1">4月2日</th>
                                <th className="border border-slate-700 py-1">4月3日</th>
                                <th className="border border-slate-700 py-1">4月4日</th>
                                <th className="border border-slate-700 py-1">4月5日</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-800 font-medium text-slate-300">
                              <tr><td className="border border-slate-700 py-1 bg-slate-800 font-bold">生産数</td><td className="border border-slate-700 py-1">200</td><td className="border border-slate-700 py-1">200</td><td className="border border-slate-700 py-1">200</td><td className="border border-slate-700 py-1">200</td><td className="border border-slate-700 py-1">200</td></tr>
                              <tr><td className="border border-slate-700 py-1 bg-slate-800 font-bold">追番</td><td className="border border-slate-700 py-1 font-mono">1001~1200</td><td className="border border-slate-700 py-1 font-mono">1201~1400</td><td className="border border-slate-700 py-1 font-mono">1401~1600</td><td className="border border-slate-700 py-1 font-mono">1601~1800</td><td className="border border-slate-700 py-1 font-mono">1801~2000</td></tr>
                            </tbody>
                          </table>
                        </div>
                        <div className="overflow-x-auto max-w-md mx-auto">
                          <table className="w-full text-center border-collapse border border-slate-800 text-[10px]">
                            <thead>
                              <tr className="bg-slate-800 text-slate-300 font-bold">
                                <th className="border border-slate-700 py-1" colSpan="6">部品Z使用量管理 (製品A 1個につき部品Z 2個)</th>
                              </tr>
                              <tr className="bg-slate-700 text-slate-200">
                                <th className="border border-slate-700 py-1">部品Z</th>
                                <th className="border border-slate-700 py-1">4月1日</th>
                                <th className="border border-slate-700 py-1">4月2日</th>
                                <th className="border border-slate-700 py-1">4月3日</th>
                                <th className="border border-slate-700 py-1">4月4日</th>
                                <th className="border border-slate-700 py-1">4月5日</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-800 font-medium text-slate-300">
                              <tr><td className="border border-slate-700 py-1 bg-slate-800 font-bold">使用個数</td><td className="border border-slate-700 py-1">400</td><td className="border border-slate-700 py-1">400</td><td className="border border-slate-700 py-1">400</td><td className="border border-slate-700 py-1">400</td><td className="border border-slate-700 py-1">400</td></tr>
                              <tr><td className="border border-slate-700 py-1 bg-slate-800 font-bold">追番</td><td className="border border-slate-700 py-1 font-mono">8001~8400</td><td className="border border-slate-700 py-1 font-mono">8401~8800</td><td className="border border-slate-700 py-1 font-mono">8801~9200</td><td className="border border-slate-700 py-1 font-mono">9201~9600</td><td className="border border-slate-700 py-1 font-mono">9601~10000</td></tr>
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                  )}
                  {quizList[currentQuizIndex].diagramType === "toyota" && (
                    <ToyotaSVG />
                  )}

                  <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl space-y-4">
                    <h4 className="text-xs font-bold text-indigo-400 uppercase tracking-wider flex items-center gap-1">
                      <HelpCircle className="w-4 h-4" />
                      解説レジュメ
                    </h4>
                    <div className="text-xs text-slate-300 leading-relaxed whitespace-pre-wrap">
                      {quizList[currentQuizIndex].explanation}
                    </div>
                  </div>

                  <button
                    onClick={handleNextQuestion}
                    className="w-full py-4 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm rounded-xl transition duration-150 transform hover:scale-[1.01] flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/20"
                  >
                    {currentQuizIndex + 1 < quizList.length ? "次の問題へ" : "結果を確認する"}
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* B-4. 結果サマリー画面 */}
        {screen === "summary" && (
          <div className="max-w-md mx-auto bg-slate-900 border border-slate-800 p-8 rounded-2xl shadow-2xl relative overflow-hidden text-center space-y-6">
            <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-emerald-500 to-indigo-500"></div>
            
            <div className="w-16 h-16 bg-emerald-500/10 text-emerald-400 rounded-full border border-emerald-500/20 flex items-center justify-center mx-auto mb-4 animate-bounce">
              <Check className="w-8 h-8" />
            </div>

            <h2 className="text-xl font-extrabold text-slate-50">全問回答お疲れ様でした！</h2>
            <p className="text-xs text-slate-400 leading-relaxed">
              選択したモードの問題セットを最後まで完走しました。<br />
              途中再開の進捗は自動的にリセットされました。
            </p>

            <div className="p-4 bg-slate-950/60 rounded-xl border border-slate-800/80 grid grid-cols-2 gap-4 text-left">
              <div>
                <span className="block text-[10px] font-bold text-slate-500 uppercase">総合進捗率</span>
                <span className="text-lg font-black text-indigo-400">{stats.progressRate}%</span>
              </div>
              <div>
                <span className="block text-[10px] font-bold text-slate-500 uppercase">全問正解率</span>
                <span className="text-lg font-black text-emerald-400">{stats.correctRate}%</span>
              </div>
            </div>

            <button
              onClick={handleGoHome}
              className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs rounded-xl transition transform hover:scale-[1.01]"
            >
              ダッシュボードに戻る
            </button>
          </div>
        )}
      </main>
    </div>
  );
}
