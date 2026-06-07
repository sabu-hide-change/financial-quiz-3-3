// npm install lucide-react recharts firebase
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Check, X, Home, ChevronRight, RefreshCw, BarChart2, BookOpen, User, ArrowRight, HelpCircle } from 'lucide-react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from 'recharts';
import { initializeApp } from 'firebase/app';
import { getAuth, signInAnonymously } from 'firebase/auth';
import { getFirestore, doc, onSnapshot, setDoc } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

let app, auth, db;
try {
  app = initializeApp(firebaseConfig);
  auth = getAuth(app);
  db = getFirestore(app);
} catch (error) {
  console.error("Firebase initialization error:", error);
}

const APP_ID = "QuizApp_Smart3_3_001";

const QUIZ_DATA = [
  {
    id: 1,
    title: "生産計画",
    source: "スマート問題集 3-3",
    question: "生産計画に関する記述として、最も適切なものはどれか。",
    options: [
      "生産計画の役割として、納期や生産量の保証、製品品質の保証、設備稼働率の維持などがある。",
      "負荷計画では、生産能力と手持ち材料を比較し、過不足がある場合に調整を図る。",
      "生産計画を業務で分類すると、手順計画、工程設計、負荷計画、日程計画に分類できる。",
      "手順計画では、設計情報を基に、加工手順、使用設備、標準作業時間などを検討する。"
    ],
    answerIndex: 3,
    explanation: `ここが重要
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

ア ×：
生産計画は、納期や生産量の保証、適切な稼働率の維持、資材の調達、機械設備や人員の手配などを計画し、生産を効率的に行うことを目的としています。このため製品品質の保証は含まれません。よって記述は不適切です。
イ ×：
負荷計画（工数計画）において生産能力と比較し調整するのは、生産に必要な工数です。手持ち材料ではありません。よって記述は不適切です。
ウ ×：
手順計画を別名で工程設計と呼びます。このため、業務の分類は手順計画（工程設計）、負荷計画、日程計画の3種類となります。よって記述は不適切です。
エ ○：
手順計画では、設計情報を基に、加工手順、使用設備、標準作業時間などを検討し、製品の効率的な生産方法を決定します。よって記述は適切です。`
  },
  {
    id: 2,
    title: "スケジューリング",
    source: "スマート問題集 3-3",
    question: "スケジューリングに関する記述として、最も不適切なものはどれか。",
    options: [
      "フォワードスケジューリングとは、作業の開始時点から、順番に予定を組んでいく方法である。",
      "ジョブショップスケジューリングは、同じ専用ラインを使用して複数の製品を大量生産するのに適した方法である。",
      "バックワードスケジューリングは、予め決められた納期を守るために、作業開始日を決める方法である。",
      "プロジェクトスケジューリングでは、必要な作業を全て抽出し、それぞれの作業の開始日と完了日が分かるようにする。"
    ],
    answerIndex: 1,
    explanation: `ここが重要
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

ア ○：
フォワードスケジューリングとは、いつから作業を開始できるかを決定し、そこから工程順序に沿って予定を組んでいく方法です。よって、記述は適切です。
イ ×：
ジョブショップスケジューリングとは、複数の作業を、幾つかの機械で処理する場合に、作業や機械の順番を最適化するのに適した方法です。この方法は、機能別レイアウトを用いて多品種少量生産形態をする場合に多く用いられます。選択肢の記述は、フローショップスケジューリングに関する内容です。よって記述は不適切です。
ウ ○：
バックワードスケジューリングは、納期を基準に、工程の順序とは逆に予定を組んでいき、いつから作業を開始するかを決定します。納期をより重視した方法と言えます。よって記述は適切です。
エ ○：
プロジェクトスケジューリングでは、複数の作業から構成されるプロジェクトの作業項目を全て抽出し、各作業の所要期間や作業間の関連が分かるようにします。よって記述は適切です。`
  },
  {
    id: 3,
    title: "PERT 1",
    source: "スマート問題集 3-3",
    question: "来月から開始するプロジェクトのスケジューリングをPERTで行ったところ、次のようになった。図の〇印は、各作業の開始と終了を示すノードで、矢印を各作業にかかる日数とした場合、最も適切な記述はどれか。",
    renderQuestionImage: () => (
      <div className="my-4 p-4 bg-slate-900 rounded-xl border border-slate-700 flex justify-center overflow-x-auto shadow-lg">
        <svg viewBox="0 0 500 300" className="w-full max-w-lg min-w-[400px]">
          <defs>
            <marker id="arrow" markerWidth="8" markerHeight="8" refX="22" refY="4" orient="auto">
              <path d="M0,0 L8,4 L0,8 Z" fill="#818cf8" />
            </marker>
            <marker id="arrow-crit" markerWidth="8" markerHeight="8" refX="22" refY="4" orient="auto">
              <path d="M0,0 L8,4 L0,8 Z" fill="#ef4444" />
            </marker>
          </defs>
          <g stroke="#818cf8" strokeWidth="2" fill="none" markerEnd="url(#arrow)">
            <line x1="50" y1="150" x2="180" y2="60" stroke="#ef4444" markerEnd="url(#arrow-crit)" /> {/* A */}
            <line x1="50" y1="150" x2="180" y2="150" /> {/* B */}
            <line x1="50" y1="150" x2="310" y2="240" /> {/* C */}
            <line x1="180" y1="60" x2="310" y2="60" stroke="#ef4444" markerEnd="url(#arrow-crit)" /> {/* D */}
            <line x1="180" y1="150" x2="310" y2="60" /> {/* E */}
            <line x1="180" y1="150" x2="310" y2="150" /> {/* F */}
            <line x1="310" y1="60" x2="440" y2="150" stroke="#ef4444" markerEnd="url(#arrow-crit)" /> {/* H */}
            <line x1="310" y1="150" x2="440" y2="150" /> {/* I */}
            <line x1="310" y1="150" x2="310" y2="240" /> {/* G */}
            <line x1="310" y1="240" x2="440" y2="150" /> {/* J */}
          </g>
          {/* 画像に忠実に全ノード・パラメータを復元 */}
          <g fill="#94a3b8" fontSize="13" fontWeight="bold">
            <text x="100" y="95" fill="#ef4444">A: 8日</text>
            <text x="100" y="140">B: 4日</text>
            <text x="130" y="210">C: 5日</text>
            <text x="220" y="50" fill="#ef4444">D: 6日</text>
            <text x="210" y="110">E: 8日</text>
            <text x="220" y="140">F: 9日</text>
            <text x="260" y="200">G: 7日</text>
            <text x="380" y="95" fill="#ef4444">H: 12日</text>
            <text x="350" y="140">I: 3日</text>
            <text x="380" y="215">J: 3日</text>
          </g>
          <g fill="#1e293b" stroke="#3b82f6" strokeWidth="2" fontSize="14" fontWeight="bold">
            <circle cx="50" cy="150" r="16" />
            <text x="50" y="155" fill="#f8fafc" textAnchor="middle" stroke="none">1</text>
            
            <circle cx="180" cy="60" r="16" stroke="#ef4444" />
            <text x="180" y="65" fill="#f8fafc" textAnchor="middle" stroke="none">2</text>
            
            <circle cx="180" cy="150" r="16" />
            <text x="180" y="155" fill="#f8fafc" textAnchor="middle" stroke="none">3</text>
            
            <circle cx="310" cy="60" r="16" stroke="#ef4444" />
            <text x="310" y="65" fill="#f8fafc" textAnchor="middle" stroke="none">4</text>
            
            <circle cx="310" cy="150" r="16" />
            <text x="310" y="155" fill="#f8fafc" textAnchor="middle" stroke="none">5</text>
            
            <circle cx="310" cy="240" r="16" />
            <text x="310" y="245" fill="#f8fafc" textAnchor="middle" stroke="none">6</text>
            
            <circle cx="440" cy="150" r="16" stroke="#ef4444" />
            <text x="440" y="155" fill="#f8fafc" textAnchor="middle" stroke="none">7</text>
          </g>
        </svg>
      </div>
    ),
    options: [
      "ノード7の最早着手日は、16日である。",
      "クリティカルパスは、作業B→F→G→Jの経路である。",
      "ノード6の最遅着手日は、20日である。",
      "ノード3の最早着手日は4日、最遅着手日6日である。"
    ],
    answerIndex: 3,
    explanation: `ここが重要
本問は代表的なネットワーク手法であるPERTについて問われています。
ネットワーク手法とは、作業間の関連や順序を決定する方法で、その代表的なものにPERTがあります。
PERTでは、作業の流れを表す「アローダイアグラム」と呼ばれる図を書きます。この図の中で、作業のことをアクティビティと呼び、線で表します。作業の開始と終了の時点は丸で表し、これをノードや結合点と呼びます。（丸が作業ではなく、線が作業ですので注意してください）。

ア ×：
ノード7までの先行作業の経路で、合計時間が最も長くなる経路は、赤矢線で示した作業A→D→Hです。この作業時間の合計が最早着手日となるので、26日となります。よって記述は不適切です。
イ ×：
クリティカルパスは最早着手日と最遅着手日が同じになる遅れが許されない経路です。赤矢線で示した作業A→D→Hが該当します。よって記述は不適切です。
ウ ×：
ノード6の最遅着手日は、ノード7の最遅着手日から作業Jの3日を引いた23日となります。よって記述は不適切です。
エ ○：
ノード3の最早着手日は作業Bと同じ4日です。一方、最遅着手日はクリティカルパス上にあるノード4から、作業Eの8日を引いた6日となります。よって記述は適切です。`
  },
  {
    id: 4,
    title: "PERT 2",
    source: "スマート問題集 3-3",
    question: "下表に示される作業A～Hで構成されるプロジェクトにおいて、PERTを用いて日程管理を行う。空欄Ｘ、Ｙに入る数値、及びクリティカルパスについて、最も適切な組み合わせを下記の解答群より選べ。",
    renderQuestionImage: () => (
      <div className="my-4 p-6 bg-slate-900 rounded-xl border border-slate-700 shadow-lg space-y-8">
        
        {/* 作業テーブル */}
        <div className="overflow-x-auto">
          <table className="w-full max-w-sm mx-auto text-sm text-center text-slate-300 border-collapse">
            <thead className="bg-slate-800">
              <tr>
                <th className="border border-slate-700 p-2 font-semibold">作業</th>
                <th className="border border-slate-700 p-2 font-semibold">作業日数</th>
                <th className="border border-slate-700 p-2 font-semibold">先行作業</th>
              </tr>
            </thead>
            <tbody className="bg-slate-950 divide-y divide-slate-800">
              <tr><td className="border border-slate-700 p-2">A</td><td className="border border-slate-700 p-2">20</td><td className="border border-slate-700 p-2">なし</td></tr>
              <tr><td className="border border-slate-700 p-2">B</td><td className="border border-slate-700 p-2">25</td><td className="border border-slate-700 p-2">A</td></tr>
              <tr><td className="border border-slate-700 p-2">C</td><td className="border border-slate-700 p-2">15</td><td className="border border-slate-700 p-2">A</td></tr>
              <tr><td className="border border-slate-700 p-2">D</td><td className="border border-slate-700 p-2">30</td><td className="border border-slate-700 p-2">A</td></tr>
              <tr><td className="border border-slate-700 p-2">E</td><td className="border border-slate-700 p-2">20</td><td className="border border-slate-700 p-2">B</td></tr>
              <tr><td className="border border-slate-700 p-2">F</td><td className="border border-slate-700 p-2">25</td><td className="border border-slate-700 p-2">C</td></tr>
              <tr><td className="border border-slate-700 p-2">G</td><td className="border border-slate-700 p-2">20</td><td className="border border-slate-700 p-2">B, C, D</td></tr>
              <tr><td className="border border-slate-700 p-2">H</td><td className="border border-slate-700 p-2">10</td><td className="border border-slate-700 p-2">E, F, G</td></tr>
            </tbody>
          </table>
        </div>

        {/* アローダイアグラム（画像完全再現） */}
        <div className="overflow-x-auto flex justify-center">
          <svg viewBox="0 0 600 340" className="w-full max-w-2xl min-w-[500px] font-sans">
            <defs>
              <marker id="arrow" markerWidth="8" markerHeight="8" refX="22" refY="4" orient="auto">
                <path d="M0,0 L8,4 L0,8 Z" fill="#818cf8" />
              </marker>
              <marker id="arrow-crit" markerWidth="8" markerHeight="8" refX="22" refY="4" orient="auto">
                <path d="M0,0 L8,4 L0,8 Z" fill="#ef4444" />
              </marker>
              <marker id="arrow-dummy" markerWidth="8" markerHeight="8" refX="22" refY="4" orient="auto">
                <path d="M0,0 L8,4 L0,8 Z" fill="#94a3b8" />
              </marker>
            </defs>

            {/* Arrows */}
            <g strokeWidth="2" fill="none">
              {/* Critical */}
              <g stroke="#ef4444" markerEnd="url(#arrow-crit)">
                <line x1="50" y1="160" x2="150" y2="160" /> {/* A */}
                <line x1="150" y1="160" x2="350" y2="160" /> {/* D */}
                <line x1="350" y1="160" x2="450" y2="160" /> {/* G */}
                <line x1="450" y1="160" x2="550" y2="160" /> {/* H */}
              </g>
              
              {/* Normal */}
              <g stroke="#818cf8" markerEnd="url(#arrow)">
                <line x1="150" y1="160" x2="250" y2="60" /> {/* B */}
                <line x1="150" y1="160" x2="250" y2="260" /> {/* C */}
                <line x1="250" y1="60" x2="450" y2="160" /> {/* E */}
                <line x1="250" y1="260" x2="450" y2="160" /> {/* F */}
              </g>

              {/* Dummy */}
              <g stroke="#94a3b8" strokeDasharray="6,4" markerEnd="url(#arrow-dummy)">
                <line x1="250" y1="60" x2="350" y2="160" />
                <line x1="250" y1="260" x2="350" y2="160" />
              </g>
            </g>

            {/* Labels */}
            <g fill="#94a3b8" fontSize="14" fontWeight="bold">
              <text x="100" y="150" fill="#ef4444" textAnchor="middle">A 20</text>
              <text x="190" y="100">B 25</text>
              <text x="190" y="235">C 15</text>
              <text x="250" y="150" fill="#ef4444" textAnchor="middle">D 30</text>
              <text x="350" y="100">E 20</text>
              <text x="350" y="235">F 25</text>
              <text x="400" y="150" fill="#ef4444" textAnchor="middle">G 20</text>
              <text x="500" y="150" fill="#ef4444" textAnchor="middle">H 10</text>
            </g>

            {/* Nodes */}
            <g fill="#1e293b" stroke="#3b82f6" strokeWidth="2" fontSize="16" fontWeight="bold">
              <circle cx="50" cy="160" r="16" />
              <text x="50" y="166" fill="#f8fafc" textAnchor="middle" stroke="none">0</text>

              <circle cx="150" cy="160" r="16" />
              <text x="150" y="166" fill="#f8fafc" textAnchor="middle" stroke="none">1</text>

              <circle cx="250" cy="60" r="16" />
              <text x="250" y="66" fill="#f8fafc" textAnchor="middle" stroke="none">2</text>

              <circle cx="250" cy="260" r="16" />
              <text x="250" y="266" fill="#f8fafc" textAnchor="middle" stroke="none">3</text>

              <circle cx="350" cy="160" r="16" stroke="#ef4444" />
              <text x="350" y="166" fill="#f8fafc" textAnchor="middle" stroke="none">4</text>

              <circle cx="450" cy="160" r="16" stroke="#ef4444" />
              <text x="450" y="166" fill="#f8fafc" textAnchor="middle" stroke="none">5</text>

              <circle cx="550" cy="160" r="16" stroke="#ef4444" />
              <text x="550" y="166" fill="#f8fafc" textAnchor="middle" stroke="none">6</text>
            </g>

            {/* Boxes (最早/最遅着手日) */}
            <g fill="#0f172a" stroke="#64748b" strokeWidth="1">
              <rect x="35" y="180" width="30" height="20" />
              <rect x="35" y="200" width="30" height="20" />
              
              <rect x="135" y="180" width="30" height="20" />
              <rect x="135" y="200" width="30" height="20" />
              
              <rect x="235" y="80" width="30" height="20" />
              <rect x="235" y="100" width="30" height="20" />
              
              <rect x="235" y="280" width="30" height="20" />
              <rect x="235" y="300" width="30" height="20" />
              
              <rect x="335" y="180" width="30" height="20" />
              <rect x="335" y="200" width="30" height="20" />
              
              <rect x="435" y="180" width="30" height="20" />
              <rect x="435" y="200" width="30" height="20" />
              
              <rect x="535" y="180" width="30" height="20" />
              <rect x="535" y="200" width="30" height="20" />
            </g>
            <g fill="#f8fafc" fontSize="13" textAnchor="middle">
              <text x="50" y="195">0</text><text x="50" y="215">0</text>
              <text x="150" y="195">20</text><text x="150" y="215">20</text>
              <text x="250" y="95">45</text><text x="250" y="115" fontWeight="bold" fill="#fbbf24">X</text>
              <text x="250" y="295">35</text><text x="250" y="315" fontWeight="bold" fill="#fbbf24">Y</text>
              <text x="350" y="195">50</text><text x="350" y="215">50</text>
              <text x="450" y="195">70</text><text x="450" y="215">70</text>
              <text x="550" y="195">80</text><text x="550" y="215">80</text>
            </g>

            {/* Legend / 凡例 */}
            <g transform="translate(435, 270)" fontSize="12" fill="#94a3b8">
              <rect x="0" y="0" width="20" height="15" fill="none" stroke="#64748b" />
              <text x="28" y="12">最早着手日</text>
              <rect x="0" y="15" width="20" height="15" fill="none" stroke="#64748b" />
              <text x="28" y="27">最遅着手日</text>
              <line x1="0" y1="40" x2="20" y2="40" stroke="#94a3b8" strokeDasharray="3,3" strokeWidth="2" />
              <polygon points="20,40 16,37 16,43" fill="#94a3b8" />
              <text x="28" y="44">点矢線：ダミー</text>
            </g>
          </svg>
        </div>
      </div>
    ),
    options: [
      "Ｘ：50　　Ｙ：45　　クリティカルパス：A - D - G - H",
      "Ｘ：45　　Ｙ：40　　クリティカルパス：A - B - E - H",
      "Ｘ：50　　Ｙ：45　　クリティカルパス：A - C - F - H",
      "Ｘ：45　　Ｙ：40　　クリティカルパス：A - D - G - H"
    ],
    answerIndex: 0,
    explanation: `ここが重要
本問では、アローダイアグラムから最遅着手日とクリティカルパスを読み取ることが求められています。

空欄Ｘ：ノード２における最遅着手日は、ノード５の最遅着手日70から工程Eの日数を差し引いて求めます。よって、70－20＝50日となります。
空欄Ｙ：ノード３における最遅着手日は、ノード５の最遅着手日70から工程Fの日数を差し引いて求めます。よって、70－25＝45日となります。

クリティカルパス：最早着手日と最遅着手日が等しいノードを結ぶ経路がクリティカルパスです。アローダイアグラムを確認すると、A→D→G→Hがクリティカルパスであることが分かります。

以上より、Ｘ：50、Ｙ：45、クリティカルパス：A - D - G - Hとなり、選択肢アが正解です。`
  },
  {
    id: 5,
    title: "PERT 3",
    source: "スマート問題集 3-3",
    question: "あるジョブは５つの作業工程A～Eで構成されている。各作業工程の作業日数と作業工程間の先行関係が下表に示されるとき、このジョブの最短完了日数の値として、最も適切なものはどれか。",
    renderQuestionImage: () => (
      <div className="my-4 overflow-x-auto rounded-lg border border-slate-700">
        <table className="w-full text-sm text-left text-slate-300 border-collapse">
          <thead className="bg-slate-800">
            <tr>
              <th className="border border-slate-700 p-3 font-semibold text-slate-200">作業工程</th>
              <th className="border border-slate-700 p-3 font-semibold text-slate-200">作業日数</th>
              <th className="border border-slate-700 p-3 font-semibold text-slate-200">先行作業</th>
            </tr>
          </thead>
          <tbody className="bg-slate-900 divide-y divide-slate-800">
            <tr><td className="border border-slate-700 p-3">A</td><td className="border border-slate-700 p-3">5</td><td className="border border-slate-700 p-3">なし</td></tr>
            <tr><td className="border border-slate-700 p-3">B</td><td className="border border-slate-700 p-3">2</td><td className="border border-slate-700 p-3">A</td></tr>
            <tr><td className="border border-slate-700 p-3">C</td><td className="border border-slate-700 p-3">4</td><td className="border border-slate-700 p-3">A</td></tr>
            <tr><td className="border border-slate-700 p-3">D</td><td className="border border-slate-700 p-3">2</td><td className="border border-slate-700 p-3">C</td></tr>
            <tr><td className="border border-slate-700 p-3">E</td><td className="border border-slate-700 p-3">3</td><td className="border border-slate-700 p-3">B, D</td></tr>
          </tbody>
        </table>
      </div>
    ),
    options: [
      "9",
      "11",
      "14",
      "16"
    ],
    answerIndex: 2,
    explanation: `ここが重要
本問は各作業工程の作業日数と作業順序にもとづき、アローダイアグラムを作成して最短完了日数を求める問題です。
各作業工程の先行関係に着目して、アローダイアグラムを作成し、クリティカルパスを見つけることがポイントです。

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
A(5) + C(4) + D(2) + E(3) = 14日間

以上より、このジョブの最短完了日数の値は14となり、選択肢ウが正解となります。`
  },
  {
    id: 6,
    title: "CPM（Critical Path Method）",
    source: "スマート問題集 3-3",
    question: "下表は、あるプロジェクト業務を構成する各作業の要件を示している。CPM（Critical Path Method）を適用して、最短プロジェクト遂行期間となる条件を達成したときの最小費用を下記の解答群から選べ。",
    renderQuestionImage: () => (
      <div className="my-4 overflow-x-auto rounded-lg border border-slate-700">
        <table className="w-full text-sm text-center text-slate-300 border-collapse">
          <thead className="bg-slate-800">
            <tr>
              <th className="border border-slate-700 p-3 font-semibold text-slate-200">作業</th>
              <th className="border border-slate-700 p-3 font-semibold text-slate-200">最短所要期間(日)</th>
              <th className="border border-slate-700 p-3 font-semibold text-slate-200">単位短縮費用(万円)</th>
            </tr>
          </thead>
          <tbody className="bg-slate-900 divide-y divide-slate-800">
            <tr><td className="border border-slate-700 p-3">A</td><td className="border border-slate-700 p-3">5</td><td className="border border-slate-700 p-3">10</td></tr>
            <tr><td className="border border-slate-700 p-3">B</td><td className="border border-slate-700 p-3">6</td><td className="border border-slate-700 p-3">15</td></tr>
            <tr><td className="border border-slate-700 p-3">C</td><td className="border border-slate-700 p-3">4</td><td className="border border-slate-700 p-3">5</td></tr>
            <tr><td className="border border-slate-700 p-3">D</td><td className="border border-slate-700 p-3">3</td><td className="border border-slate-700 p-3">20</td></tr>
          </tbody>
        </table>
      </div>
    ),
    options: [
      "220万円",
      "240万円",
      "250万円",
      "280万円"
    ],
    answerIndex: 0,
    explanation: `ここが重要
本問はPERTの応用知識として、CPM（Critical Path Method）によってプロジェクトを最短期間で遂行するときの最小費用を求める問題です。
CPMは、費用を払うことにより各作業の所要時間が短縮できるとして、最小の費用でプロジェクトの遂行期間を最短にする最適解を求める手法です。

【解答手順】
手順１：最短所要期間をもとにアローダイアグラムを作成します。
手順２：クリティカルパスを特定し、クリティカルパス以外の余裕期間を求めます。クリティカルパスはA→B→Dです。余裕期間はノード4の1日間ですので、作業Cは2日間だけ短縮すればよい。
手順３：各作業の必要短縮期間×単位あたりの短縮費用を算出します。

短縮費用の総額は220万円となります。`
  },
  {
    id: 7,
    title: "ジョンソン法",
    source: "スマート問題集 3-3",
    question: "工程1（穴あけ）、工程2（塗装）の2つが連結された生産ラインで、4種類の製品A, B, C, Dを生産している。工程は、必ず1→2の順番で行われ、各工程は一度に一つの製品しか処理できないものとする。製品の生産順序を最適化して、全ての製品の作業を最短で終了させる場合の時間として、最も適切なものを選べ。(単位：分)",
    renderQuestionImage: () => (
      <div className="my-4 overflow-x-auto rounded-lg border border-slate-700">
        <table className="w-full text-sm text-center text-slate-300 border-collapse">
          <thead className="bg-slate-800">
            <tr>
              <th className="border border-slate-700 p-3 font-semibold text-slate-200">製品</th>
              <th className="border border-slate-700 p-3 font-semibold text-slate-200">工程1 (穴あけ)</th>
              <th className="border border-slate-700 p-3 font-semibold text-slate-200">工程2 (塗装)</th>
            </tr>
          </thead>
          <tbody className="bg-slate-900 divide-y divide-slate-800">
            <tr><td className="border border-slate-700 p-3">A</td><td className="border border-slate-700 p-3">10</td><td className="border border-slate-700 p-3">5</td></tr>
            <tr><td className="border border-slate-700 p-3">B</td><td className="border border-slate-700 p-3">3</td><td className="border border-slate-700 p-3">-</td></tr>
            <tr><td className="border border-slate-700 p-3">C</td><td className="border border-slate-700 p-3">-</td><td className="border border-slate-700 p-3">2</td></tr>
            <tr><td className="border border-slate-700 p-3">D</td><td className="border border-slate-700 p-3">8</td><td className="border border-slate-700 p-3">-</td></tr>
          </tbody>
        </table>
      </div>
    ),
    options: [
      "50分",
      "32分",
      "28分",
      "37分"
    ],
    answerIndex: 2,
    explanation: `ここが重要
本問はジョブショップスケジューリングの順序づけ法の1つ、ジョンソン法について問われています。

●順序づけ法（ジョンソン法）
全体の作業期間が最も短くなるように作業の順序を決定する方法です。

【ジョンソン法の手順】
手順1　作業時間が最短の作業を選ぶ。
手順2　それが前工程（工程1）であれば、その作業を先頭に配置する。それが後工程（工程2）であれば、その作業を最後に配置する。既に作業が配置されている場合は、その作業の次に配置する。
手順3　その作業を対象から外し、手順1に戻り、残りの作業についてくり返す。

本問の製品の生産順序をジョンソン法に従って考えてみましょう。
１【手順1】全ての作業から最短のものを選びます。「製品C 工程2（2分）」です。【手順2】工程2は後工程ですから、最後に配置します。
２【手順1】製品C以外で最短は「製品B 工程1（3分）」です。【手順2】工程1は前工程ですので、先頭に置きます。
３【手順1】残りで最短は「製品A 工程2（5分）」です。【手順2】工程2は後工程ですので、製品Cの手前に配置します。
残りは製品Dだけなので、製品Bと製品Aの間に配置します。
順序は： 製品B → 製品D → 製品A → 製品C になります。

作業時間の合計 ＝ 3分（B工1）＋ 8分（D工1）＋ 10分（A工1）＋ 5分（A工2）＋ 2分（C工2）＝ 28分
よってウが正解です。`
  },
  {
    id: 8,
    title: "需要予測",
    source: "スマート問題集 3-3",
    question: "需要予測に関する記述として、最も不適切なものはどれか。",
    options: [
      "加重移動平均法による予測で、重みをすべて同じにした場合、予測値は単純移動平均法と同一となる。",
      "単純移動平均法による予想で、ノイズを出来るだけ除去する場合には、用いるデータ数を減らせばよい。",
      "指数平滑法による予想で、直近の実績の影響を強く反映したい場合は、平滑化指数を大きくすればよい。",
      "加重平均法による予測で、過去のデータの影響を少なくしたい場合は、重みを減らせばよい。"
    ],
    answerIndex: 1,
    explanation: `ここが重要
本問では需要予測の各手法の予測値が持つ性質が問われています。
見込生産では、廃棄ロスや機会損失を最小にするために、生産計画を立てる前に、需要予測をすることが重要です。

ア ○：
加重移動平均法は、「予測値 ＝ Σ（売上Ｘ重み）÷ Σ重み」の式を用います。重みを全て同一にした場合は、移動平均法の結果と同一になります。よって記述は適切です。
イ ×：
一時的な値の増減をノイズと呼びます。例えばセール月などのノイズを除去したい場合は、データを平均する期間（データ数）を増やす必要があります。用いるデータ数を減らすとノイズの影響を強く受けてしまいます。よって記述は不適切です。
ウ ○：
指数平滑化法は、「来期予測値 ＝ 今期予測値 ＋ 平滑化指数 Ｘ （今期実績値 － 今期予測値）」の式を用います。ここで、平滑化指数を大きくすると、直近の実績の影響度も合わせて大きくなります。よって記述は適切です。
エ ○：
加重平均法では、各データに、それぞれの重みを乗じた値が、予測値に与える影響となります。このため影響を強くしたいデータの重みは増やし、逆に影響を弱くしたいデータの重みは減らします。よって記述は適切です。`
  },
  {
    id: 9,
    title: "生産統制",
    source: "スマート問題集 3-3",
    question: "生産統制に関する記述として、最も適切なものはどれか。",
    options: [
      "生産統制は、大きくわけて進捗管理、現品管理、余力管理、販売管理の4つから構成される。",
      "余力管理では、製品原価や作業者の負荷状況を管理し、むだな費用の発生を防止する。",
      "進捗管理では、入荷した資材の管理や、日程計画に対する仕事の進捗状況を管理する。",
      "現品管理では、部品や仕掛品の運搬や保管状況を管理し、部品の過不足を未然に防止する。"
    ],
    answerIndex: 3,
    explanation: `ここが重要
本問では生産統制の構成とその内容について問われています。
生産統制では、生産計画と実績に差異が発生しないように生産を統制し、納期を守ったり、適切な稼働率を維持するように活動します。生産統制は大きく分けて、進捗管理、現品管理、余力管理の3つから構成されます。

●進捗管理（日程の管理 / 日程計画）
日程計画に対して、仕事の進捗状況を把握し、日々の仕事の進み具合を調整する活動です。
●現品管理（物の管理 / 材料・部品計画）
部品や仕掛品などの運搬や保管の状況を管理する活動です。どこに何が何個あるかを把握することで、部品の過不足による問題の発生を未然に防止します。
●余力管理（工数の管理 / 工数計画）
工程や作業者の、現在の負荷状況と能力を把握し、余力や不足がある場合は、作業の再配分を行う活動です。

ア ×：
生産統制は、進捗管理、現品管理、余力管理の3つから構成されます。販売管理は含まれません。
イ ×：
余力管理は、作業者の負荷状況と余力を常に把握し適切に配分する活動です。製品原価の把握は含みません。
ウ ×：
進捗管理は、日程計画に対する仕事の進捗状況を把握、調整する活動です。入荷した資材の管理は、現品管理の活動の一部です。
エ ○：
現品管理は、部品や仕掛品などの運搬や保管の状況を管理することで、部品の過不足等による問題を防止する活動です。よって記述は適切です。`
  },
  {
    id: 10,
    title: "生産の管理方式",
    source: "スマート問題集 3-3",
    question: "生産の管理方式に関する記述として、最も適切なものはどれか。",
    options: [
      "追番管理方式は、生産計画に対する実績の差異を容易に把握できるというメリットがある。",
      "オーダーエントリー方式では、すでに生産工程に製品があるため、顧客の個別の要求に対応するのは難しい。",
      "製番管理方式で生産された製品において、使用した部品の一部に欠陥が見つかった場合、その部品を作った時期を特定するのは難しい。",
      "生産座席予約システムでは、短納期の顧客要求に対しても、いつでも柔軟に生産の対応ができる。"
    ],
    answerIndex: 0,
    explanation: `ここが重要
本問では生産管理の幾つかの管理方式について、特徴が問われています。

●製番管理方式
・概要：製品ごとに製番という固有の製造番号を発行し、製品を構成する全ての部品に対して同じ製番を付けて管理する方式。
●追番管理方式
・概要：1番から順番に連続した番号をつける方式。
・メリット：追番は最後の番号が、累計生産台数と同じになるので、この追番を用いて、計画と実績の差異の管理や、累積生産量の管理が容易にできる。
●オーダーエントリー方式
・概要：生産工程にある製品に対して、顧客のオーダーを引き当て、その顧客の要求に合わせ、製品仕様を変更し、オプションの仕様を決定する生産方式。（自動車やパソコン直販など）
●生産座席予約方式
・概要：受注時に、製造設備の使用日程や資材の使用予定などにオーダーを割り付ける方式。
・デメリット：座席に余裕がない状態では、短納期の注文要求に対して柔軟な対応が難しい。

ア ○：
追番管理方式は、連続した番号を付けていく生産方式です。最後の番号が生産台数と同じになるので、生産量が簡単に分かります。このため、計画に対する実績も容易に把握できます。よって記述は適切です。
イ ×：
オーダーエントリー方式は、量産しながらも顧客の個別のニーズに対応できる管理方式です。個々の顧客の要求に合わせ、製品仕様を変更したりオプションを決定できます。よって記述は不適切です。
ウ ×：
製番管理方式では、使用した部品に欠陥が見つかった場合、全ての部品に同じ製番が付いているため、その部品の生産時期や購入時期を素早く追跡できます。よって記述は不適切です。
エ ×：
生産座席予約システムは、設備や資材の予約が一杯で生産に余裕がない場合は、新たな注文に対して納期が遅くなるというデメリットがあります。いつでも柔軟に対応できるわけではありません。よって記述は不適切です。`
  },
  {
    id: 11,
    title: "トヨタ生産方式",
    source: "スマート問題集 3-3",
    question: "トヨタ生産方式に関する記述として、最も不適切なものはどれか。",
    options: [
      "かんばんの枚数及びそこに指示される量は、生産量と同時に工程間の仕掛品の数も指示することになる。",
      "かんばんは、作業の指示をする生産指示かんばんと、運搬を表す運搬かんばんの2種類がある。",
      "プルシステムを導入して、効率的な生産を行うためには、最終組み立てラインの生産量の平準化が重要となる。",
      "JITは、必要なものを、必要な時に、必要な数だけ生産する方式で、これを実現するため、後工程引取り方式を採用している。"
    ],
    answerIndex: 1,
    explanation: `ここが重要
本問ではトヨタ生産方式の内容について問われています。
トヨタ生産方式は、無駄をできるだけ排除して、必要な数だけ生産する方式で、ジャストインタイムと、自働化という思想に基づいています。

●ジャストインタイム(JIT)
必要なものを、必要な時に、必要な数だけ生産する方式です。ジャストインタイムは、後工程引取方式やプルシステムとも呼ばれ、後工程が使った分だけ前工程から引き取ることで余分な仕掛品を減らし、生産リードタイムを短縮することができます。ただし、最終組立工程の生産量が一定でないと、効率的に生産ができなくなるため、生産量の平準化が重要です。
●自働化
不良品を作らないための仕組みで、異常が発生したときに、機械を自動的に停止します。この時、どこで異常が発生したか一目で分かるように、「あんどん」というランプを点灯します。
●かんばん方式
後工程引取方式を実現するための情報伝達手段として、「生産指示かんばん」と「引取りかんばん」と呼ばれる2種類のかんばんを使います。生産指示かんばんは、作業の指示を表し、引取りかんばんは、運搬を表します。

ア ○：
かんばんは、生産量と在庫量をコントロールする道具です。かんばんは全ての生産工程の中を循環しながら用いられます。このため、その枚数とそこに指示される量の総和は、ライン上の生産量と仕掛品の量を意味します。よって記述は適切です。
イ ×：
かんばんの種類は、作業を指示する「生産指示かんばん」と、運搬を表す「引取りかんばん」の2種類です。運搬かんばんではなく、引取りかんばんが正式名称です。よって記述は不適切です。
ウ ○：
プルシステムとは、後工程引取り方式の別名です。仮に最終組み立てラインの生産量のバラツキが大きいと、前工程は全てその影響を受けます。このため、全ての生産工程を効率的に稼働するためには、最終組み立てラインの平準化が不可欠です。よって記述は適切です。
エ ○：
JITでは、後工程引取方式を採用しています。かんばんを情報伝達手段として、後工程から、必要なものを、必要な時に、必要な数だけ、生産するよう前工程に指示します。よって記述は適切です。`
  }
];

export default function App() {
  const [screen, setScreen] = useState("login");
  const [userId, setUserId] = useState("");
  const [inputWord, setInputWord] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const [progress, setProgress] = useState({
    progressIndex: 0,
    progressMode: "all",
    history: {},
    reviews: {}
  });

  const [showResumeModal, setShowResumeModal] = useState(false);
  const [pendingProgress, setPendingProgress] = useState(null);

  const [currentMode, setCurrentMode] = useState("all");
  const [currentQuizIndex, setCurrentQuizIndex] = useState(0);
  const [activeQuizzes, setActiveQuizzes] = useState([]);
  
  const [selectedOption, setSelectedOption] = useState(null);
  const [isAnswered, setIsAnswered] = useState(false);

  const screenRef = useRef(screen);
  useEffect(() => {
    screenRef.current = screen;
  }, [screen]);

  const isFirstLoad = useRef(true);
  useEffect(() => {
    isFirstLoad.current = true;
  }, [userId]);

  useEffect(() => {
    if (!userId) return;
    
    let unsubscribe = () => {};
    if (db) {
      try {
        const docRef = doc(db, "users", `${APP_ID}_${userId}`);
        unsubscribe = onSnapshot(docRef, (snapshot) => {
          let data = {};
          if (snapshot.exists()) {
            data = snapshot.data();
          }
          
          const parsed = {
            progressIndex: Number(data.progressIndex || 0),
            progressMode: data.progressMode || "all",
            history: data.history || {},
            reviews: data.reviews || {}
          };

          if (isFirstLoad.current) {
            isFirstLoad.current = false;
            setScreen("dashboard");
            setProgress(parsed);
            if (parsed.progressIndex > 0) {
              setPendingProgress(parsed);
              setShowResumeModal(true);
            }
            return;
          }
          
          setProgress(parsed);
        }, (err) => {
          console.error("Firestore Error:", err);
          fallbackToLocal();
        });
      } catch (err) {
        console.error("DocRef Error:", err);
        fallbackToLocal();
      }
    } else {
      fallbackToLocal();
    }

    function fallbackToLocal() {
      const localData = JSON.parse(localStorage.getItem(`${APP_ID}_${userId}`) || "{}");
      const parsed = {
        progressIndex: Number(localData.progressIndex || 0),
        progressMode: localData.progressMode || "all",
        history: localData.history || {},
        reviews: localData.reviews || {}
      };
      
      if (isFirstLoad.current) {
        isFirstLoad.current = false;
        setScreen("dashboard");
        setProgress(parsed);
        if (parsed.progressIndex > 0) {
          setPendingProgress(parsed);
          setShowResumeModal(true);
        }
        return;
      }
      setProgress(parsed);
    }

    return () => unsubscribe();
  }, [userId]);

  const saveProgress = async (newProgress) => {
    setProgress(newProgress);
    if (db && userId) {
      try {
        const docRef = doc(db, "users", `${APP_ID}_${userId}`);
        await setDoc(docRef, newProgress, { merge: true });
      } catch (err) {
        console.error("Save Error:", err);
        saveLocal(newProgress);
      }
    } else if (userId) {
      saveLocal(newProgress);
    }
  };

  const saveLocal = (newProgress) => {
    localStorage.setItem(`${APP_ID}_${userId}`, JSON.stringify(newProgress));
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!inputWord.trim()) return;
    setIsLoading(true);
    
    try {
      if (auth) {
        await signInAnonymously(auth);
      }
      setUserId(inputWord.trim());
    } catch (err) {
      console.error("Auth fallback:", err);
      setUserId(inputWord.trim());
    } finally {
      setIsLoading(false);
    }
  };

  const handleStartMode = (mode, startIndex = 0) => {
    let filtered = [];
    if (mode === "all") filtered = QUIZ_DATA;
    else if (mode === "wrong") filtered = QUIZ_DATA.filter(q => progress.history[q.id] === "wrong" || !progress.history[q.id]);
    else if (mode === "review") filtered = QUIZ_DATA.filter(q => progress.reviews[q.id]);

    if (filtered.length === 0) {
      alert("該当する問題がありません！");
      return;
    }

    setActiveQuizzes(filtered);
    setCurrentMode(mode);
    setCurrentQuizIndex(startIndex);
    setSelectedOption(null);
    setIsAnswered(false);
    setScreen("quiz");
  };

  const handleResume = () => {
    if (!pendingProgress) return;
    setShowResumeModal(false);
    handleStartMode(pendingProgress.progressMode, pendingProgress.progressIndex);
  };

  const handleRestart = () => {
    setShowResumeModal(false);
    saveProgress({ ...progress, progressIndex: 0 });
  };

  const handleOptionClick = (idx) => {
    if (isAnswered) return;
    setSelectedOption(idx);
    setIsAnswered(true);

    const currentQ = activeQuizzes[currentQuizIndex];
    const isCorrect = idx === currentQ.answerIndex;

    const newHistory = { ...progress.history, [currentQ.id]: isCorrect ? "correct" : "wrong" };
    const newProgressIndex = currentQuizIndex + 1;

    saveProgress({
      ...progress,
      history: newHistory,
      progressIndex: newProgressIndex,
      progressMode: currentMode
    });
  };

  const handleNext = () => {
    if (currentQuizIndex + 1 < activeQuizzes.length) {
      setCurrentQuizIndex(prev => prev + 1);
      setSelectedOption(null);
      setIsAnswered(false);
    } else {
      saveProgress({ ...progress, progressIndex: 0 });
      setScreen("result");
    }
  };

  const goHome = () => {
    saveProgress({ ...progress, progressIndex: isAnswered ? currentQuizIndex + 1 : currentQuizIndex });
    setScreen("dashboard");
  };

  const toggleReview = (id) => {
    const newReviews = { ...progress.reviews, [id]: !progress.reviews[id] };
    saveProgress({ ...progress, reviews: newReviews });
  };

  const stats = useMemo(() => {
    const total = QUIZ_DATA.length;
    const answered = Object.keys(progress.history).length;
    const correct = Object.values(progress.history).filter(v => v === "correct").length;
    const accuracy = answered > 0 ? (correct / answered) * 100 : 0;
    const completion = (answered / total) * 100;
    
    const cat1Data = QUIZ_DATA.slice(0, 5);
    const cat1Correct = cat1Data.filter(q => progress.history[q.id] === "correct").length;
    const cat1Acc = (cat1Correct / 5) * 100;

    const cat2Data = QUIZ_DATA.slice(5);
    const cat2Correct = cat2Data.filter(q => progress.history[q.id] === "correct").length;
    const cat2Acc = (cat2Correct / 6) * 100;

    return [
      { subject: '総合進捗率', A: completion, fullMark: 100 },
      { subject: '回答正確性', A: accuracy, fullMark: 100 },
      { subject: '全問正解率', A: (correct / total) * 100, fullMark: 100 },
      { subject: '生産計画・統制', A: cat1Acc, fullMark: 100 },
      { subject: '各種管理方式', A: cat2Acc, fullMark: 100 },
    ];
  }, [progress.history]);

  if (screen === "login") {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4 font-sans text-slate-200">
        <div className="bg-slate-900 border border-slate-800 p-8 rounded-2xl shadow-2xl max-w-md w-full">
          <div className="flex justify-center mb-6">
            <div className="bg-indigo-600/20 p-4 rounded-full">
              <BookOpen className="w-10 h-10 text-indigo-500" />
            </div>
          </div>
          <h1 className="text-2xl font-bold text-center mb-2">スマート問題集 3-3</h1>
          <p className="text-slate-400 text-center mb-8 text-sm">合言葉を入力して学習データを同期します</p>
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-2">合言葉 (ユーザーID)</label>
              <input
                type="text"
                value={inputWord}
                onChange={(e) => setInputWord(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                placeholder="例: secret-key-123"
                required
              />
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-indigo-600 to-sky-500 hover:from-indigo-500 hover:to-sky-400 text-white font-bold py-3 px-4 rounded-xl shadow-lg hover:shadow-indigo-500/25 transition-all transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {isLoading ? <RefreshCw className="w-5 h-5 animate-spin" /> : "学習を始める"}
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 font-sans selection:bg-indigo-500/30">
      {/* Resume Modal */}
      {showResumeModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 p-6 rounded-2xl shadow-2xl max-w-sm w-full animate-in fade-in zoom-in duration-200">
            <h3 className="text-xl font-bold mb-4 flex items-center"><RefreshCw className="w-6 h-6 mr-2 text-sky-400" /> 学習の再開</h3>
            <p className="text-slate-300 mb-6 leading-relaxed">
              前回は <span className="text-indigo-400 font-bold">第{pendingProgress.progressIndex}問</span> まで進んでいます。<br/>
              中断したモード（{pendingProgress.progressMode === 'all' ? 'すべての問題' : pendingProgress.progressMode === 'wrong' ? '前回不正解' : '要復習'}）の続きから再開しますか？
            </p>
            <div className="space-y-3">
              <button onClick={handleResume} className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold transition-all shadow-lg hover:shadow-indigo-500/25 flex justify-center items-center">
                続きから再開する <ArrowRight className="w-4 h-4 ml-2" />
              </button>
              <button onClick={handleRestart} className="w-full py-3 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl font-bold transition-all">
                最初から始める
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <header className="bg-slate-900/50 backdrop-blur-md border-b border-slate-800 sticky top-0 z-40">
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-2 font-bold text-lg">
            <BookOpen className="w-5 h-5 text-indigo-500" />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-sky-400">Smart Quiz</span>
          </div>
          <div className="flex items-center space-x-4 text-sm text-slate-400">
            <div className="flex items-center"><User className="w-4 h-4 mr-1" /> {userId}</div>
            {screen !== "dashboard" && (
              <button onClick={goHome} className="p-2 hover:bg-slate-800 rounded-full transition-colors">
                <Home className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-8">
        {screen === "dashboard" && (
          <div className="space-y-8 animate-in fade-in duration-500">
            {/* Top Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-1 space-y-4">
                <button onClick={() => handleStartMode("all")} className="w-full p-4 bg-gradient-to-br from-slate-900 to-slate-800 border border-slate-700 hover:border-indigo-500 rounded-2xl flex items-center justify-between group transition-all">
                  <div className="text-left"><h3 className="font-bold text-lg text-slate-100 group-hover:text-indigo-400 transition-colors">すべての問題</h3><p className="text-sm text-slate-500 mt-1">全{QUIZ_DATA.length}問を通しで学習</p></div>
                  <ChevronRight className="w-5 h-5 text-slate-500 group-hover:text-indigo-400" />
                </button>
                <button onClick={() => handleStartMode("wrong")} className="w-full p-4 bg-gradient-to-br from-slate-900 to-slate-800 border border-slate-700 hover:border-sky-500 rounded-2xl flex items-center justify-between group transition-all">
                  <div className="text-left"><h3 className="font-bold text-lg text-slate-100 group-hover:text-sky-400 transition-colors">前回不正解のみ</h3><p className="text-sm text-slate-500 mt-1">弱点を集中的に克服</p></div>
                  <ChevronRight className="w-5 h-5 text-slate-500 group-hover:text-sky-400" />
                </button>
                <button onClick={() => handleStartMode("review")} className="w-full p-4 bg-gradient-to-br from-slate-900 to-slate-800 border border-slate-700 hover:border-emerald-500 rounded-2xl flex items-center justify-between group transition-all">
                  <div className="text-left"><h3 className="font-bold text-lg text-slate-100 group-hover:text-emerald-400 transition-colors">要復習リスト</h3><p className="text-sm text-slate-500 mt-1">チェックした問題を復習</p></div>
                  <ChevronRight className="w-5 h-5 text-slate-500 group-hover:text-emerald-400" />
                </button>
              </div>
              <div className="md:col-span-2 bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col sm:flex-row items-center gap-6">
                <div className="w-full sm:w-1/2 aspect-square max-w-[250px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart cx="50%" cy="50%" outerRadius="70%" data={stats}>
                      <PolarGrid stroke="#334155" />
                      <PolarAngleAxis dataKey="subject" tick={{ fill: '#94a3b8', fontSize: 11 }} />
                      <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                      <Radar name="Score" dataKey="A" stroke="#6366f1" fill="#818cf8" fillOpacity={0.4} />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
                <div className="w-full sm:w-1/2 space-y-4">
                  <h3 className="text-lg font-bold flex items-center"><BarChart2 className="w-5 h-5 mr-2 text-indigo-400" /> 学習パフォーマンス</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                      <p className="text-xs text-slate-400 mb-1">総合進捗</p>
                      <p className="text-2xl font-bold text-sky-400">{Math.round(stats[0].A)}<span className="text-sm ml-1">%</span></p>
                    </div>
                    <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                      <p className="text-xs text-slate-400 mb-1">回答正確性</p>
                      <p className="text-2xl font-bold text-indigo-400">{Math.round(stats[1].A)}<span className="text-sm ml-1">%</span></p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Grid List */}
            <div>
              <h3 className="text-lg font-bold mb-4 flex items-center"><BookOpen className="w-5 h-5 mr-2 text-sky-400" /> 問題一覧</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                {QUIZ_DATA.map((q, idx) => {
                  const st = progress.history[q.id];
                  const isRev = progress.reviews[q.id];
                  let bgClass = "bg-slate-900 border-slate-800 hover:border-slate-600";
                  let icon = null;
                  if (st === "correct") { bgClass = "bg-emerald-950/30 border-emerald-900 hover:border-emerald-700"; icon = <Check className="w-4 h-4 text-emerald-500" />; }
                  else if (st === "wrong") { bgClass = "bg-rose-950/30 border-rose-900 hover:border-rose-700"; icon = <X className="w-4 h-4 text-rose-500" />; }

                  return (
                    <div key={q.id} onClick={() => handleStartMode("all", idx)} className={`p-3 rounded-xl border cursor-pointer transition-all ${bgClass} relative group`}>
                      <div className="text-xs text-slate-500 mb-1">Q {idx + 1}</div>
                      <div className="font-semibold text-sm truncate">{q.title}</div>
                      <div className="absolute top-3 right-3 flex gap-1">
                        {isRev && <span className="w-2 h-2 rounded-full bg-amber-500" />}
                        {icon}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {screen === "quiz" && (
          <div className="max-w-3xl mx-auto animate-in slide-in-from-right-8 duration-300">
            <div className="mb-6 flex items-center justify-between">
              <span className="bg-indigo-500/20 text-indigo-300 px-3 py-1 rounded-full text-xs font-bold border border-indigo-500/30">
                {activeQuizzes[currentQuizIndex].source} - {currentQuizIndex + 1}/{activeQuizzes.length}
              </span>
              <button onClick={() => toggleReview(activeQuizzes[currentQuizIndex].id)} className={`text-sm flex items-center px-3 py-1 rounded-full transition-colors ${progress.reviews[activeQuizzes[currentQuizIndex].id] ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' : 'bg-slate-800 text-slate-400 border border-slate-700'}`}>
                要復習
              </button>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 md:p-8 shadow-xl mb-6">
              <h2 className="text-lg md:text-xl font-medium leading-relaxed mb-6 whitespace-pre-wrap">{activeQuizzes[currentQuizIndex].question}</h2>
              {activeQuizzes[currentQuizIndex].renderQuestionImage && activeQuizzes[currentQuizIndex].renderQuestionImage()}
              
              <div className="space-y-3 mt-8">
                {activeQuizzes[currentQuizIndex].options.map((opt, idx) => {
                  let btnClass = "bg-slate-950 border-slate-800 hover:border-indigo-500 text-slate-300";
                  if (isAnswered) {
                    if (idx === activeQuizzes[currentQuizIndex].answerIndex) {
                      btnClass = "bg-emerald-950/40 border-emerald-500 text-emerald-200 shadow-[0_0_15px_rgba(16,185,129,0.2)]";
                    } else if (idx === selectedOption) {
                      btnClass = "bg-rose-950/40 border-rose-500 text-rose-200";
                    } else {
                      btnClass = "bg-slate-950 border-slate-800 opacity-50";
                    }
                  }

                  return (
                    <button
                      key={idx}
                      disabled={isAnswered}
                      onClick={() => handleOptionClick(idx)}
                      className={`w-full text-left p-4 rounded-xl border transition-all duration-300 ${btnClass}`}
                    >
                      <div className="flex items-start">
                        <span className="mr-3 font-mono text-slate-500 mt-0.5">{idx + 1}.</span>
                        <span className="leading-relaxed">{opt}</span>
                        {isAnswered && idx === activeQuizzes[currentQuizIndex].answerIndex && <Check className="w-5 h-5 ml-auto text-emerald-500 flex-shrink-0" />}
                        {isAnswered && idx === selectedOption && idx !== activeQuizzes[currentQuizIndex].answerIndex && <X className="w-5 h-5 ml-auto text-rose-500 flex-shrink-0" />}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {isAnswered && (
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 md:p-8 shadow-xl animate-in fade-in slide-in-from-bottom-4">
                <div className="flex items-center mb-4">
                  <HelpCircle className="w-5 h-5 text-indigo-400 mr-2" />
                  <h3 className="text-lg font-bold">解説</h3>
                </div>
                <div className="prose prose-invert max-w-none text-slate-300 text-sm md:text-base leading-loose whitespace-pre-wrap">
                  {activeQuizzes[currentQuizIndex].explanation}
                </div>
                <button onClick={handleNext} className="mt-8 w-full py-4 bg-gradient-to-r from-indigo-600 to-sky-500 hover:from-indigo-500 hover:to-sky-400 text-white rounded-xl font-bold shadow-lg transition-all flex justify-center items-center">
                  次の問題へ <ChevronRight className="w-5 h-5 ml-1" />
                </button>
              </div>
            )}
          </div>
        )}

        {screen === "result" && (
          <div className="max-w-xl mx-auto text-center space-y-8 animate-in fade-in zoom-in duration-500 pt-10">
            <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-emerald-500/20 border-4 border-emerald-500 mb-4">
              <Check className="w-12 h-12 text-emerald-400" />
            </div>
            <h2 className="text-3xl font-bold">学習完了！</h2>
            <p className="text-slate-400">お疲れ様でした。選択したモードの全問題を完了しました。</p>
            <div className="pt-8">
              <button onClick={goHome} className="w-full py-4 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-bold transition-colors">
                ダッシュボードに戻る
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}