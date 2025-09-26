/**
 * H1E 謎解き - 共通スクリプト
 * 複数のページで共通して使用する機能（サイドバー、達成状況、イベントリスナーなど）を管理します。
 */

// ----------------------------------------------------
// サイドバーの開閉
// ----------------------------------------------------

function toggleSidebar() {
  const sidebar = document.getElementById("sidebar");
  if (sidebar) {
    sidebar.classList.toggle("active");
  } else {
    console.error("エラー: #sidebar 要素が見つかりません。");
  }
}

// ----------------------------------------------------
// 達成状況の管理と表示
// ----------------------------------------------------

function loadAchievements() {
  const statusContent = document.getElementById("status-content");
  const achievementsList = document.getElementById("achievement-list");
  const quizCount = document.getElementById("quiz-count");

  const savedData = localStorage.getItem("h1e_achievements");
  const achievements = savedData ? JSON.parse(savedData) : [];

  if (achievementsList) achievementsList.innerHTML = "";

  let clearedCount = 0;
  const mainQuizzes = ["謎1", "謎2", "謎3"];

  // 謎1〜謎3の達成状況と解答を表示
  mainQuizzes.forEach((quizId) => {
    const li = document.createElement("li");
    const isCleared = achievements.includes(quizId);

    let displayContent = `${quizId}：`;

    if (isCleared) {
      clearedCount++;
      const answer = sessionStorage.getItem(`${quizId}_answer`) || "解答不明";
      displayContent += `✅ クリア済み (答: ${answer})`;
    } else {
      displayContent += `❌ 未クリア`;
    }

    li.textContent = displayContent;
    if (achievementsList) achievementsList.appendChild(li);
  });

  // 最終謎（謎5）の達成状況を確認
  const finalQuizCleared = achievements.includes("謎5");
  const finalLi = document.createElement("li");

  let finalDisplayContent = `最終謎（謎5）：`;
  if (finalQuizCleared) {
    const finalAnswer = sessionStorage.getItem("謎5_answer") || "完了";
    finalDisplayContent += `✅ クリア済み (答: ${finalAnswer})`;
  } else {
    finalDisplayContent += `❌ 未クリア`;
  }
  finalLi.textContent = finalDisplayContent;
  if (achievementsList) achievementsList.appendChild(finalLi);

  if (quizCount) quizCount.textContent = `クリア数: ${clearedCount} / 3`;

  // ----------------------------------------------------
  // 🚨 修正点1: 最終謎クリア後のボタン処理 🚨
  // ----------------------------------------------------
  let finalNavContainer = document.getElementById("final-nav-container");

  if (finalQuizCleared && statusContent) {
    // 謎5クリア済み: final.htmlへ進むボタンを生成/表示
    if (!finalNavContainer) {
      const containerDiv = document.createElement("div");
      containerDiv.id = "final-nav-container"; // IDを新しく定義
      containerDiv.style.marginTop = "20px";

      const finalNavBtn = document.createElement("button");
      finalNavBtn.id = "go-to-goal-page";
      finalNavBtn.textContent = "🏆 ゴールページ (final.html) へ進む！";
      finalNavBtn.style.backgroundColor = "#4CAF50"; // 目立つ緑色
      finalNavBtn.style.color = "white";
      finalNavBtn.style.padding = "10px";
      finalNavBtn.style.border = "none";
      finalNavBtn.style.borderRadius = "5px";
      finalNavBtn.style.width = "100%";

      // final.htmlへ遷移するイベントリスナー
      finalNavBtn.addEventListener("click", () => {
        window.location.href = "final.html";
      });

      containerDiv.appendChild(finalNavBtn);
      statusContent.appendChild(containerDiv); // サイドバーの最後に追加
    }

    // 最終謎へのボタン（謎1〜3クリアで表示されるもの）は非表示にする
    let finalQuizContainer = document.getElementById("final-quiz-container");
    if (finalQuizContainer) finalQuizContainer.remove();
  } else if (clearedCount === 3 && statusContent) {
    // 謎1〜3クリア済み: 謎5へ進むボタンを表示
    let finalQuizContainer = document.getElementById("final-quiz-container");
    if (!finalQuizContainer) {
      const containerDiv = document.createElement("div");
      containerDiv.id = "final-quiz-container";
      containerDiv.style.marginTop = "20px";

      const finalQuizBtn = document.createElement("button");
      finalQuizBtn.id = "go-to-final-quiz";
      finalQuizBtn.textContent = "最終謎（謎5）へ進む！";
      finalQuizBtn.addEventListener("click", goToFinalQuiz);

      containerDiv.appendChild(finalQuizBtn);
      statusContent.appendChild(containerDiv);
    }
    // 謎5が未クリアの場合、ゴールボタンは削除
    if (finalNavContainer) finalNavContainer.remove();
  } else {
    // どちらも未達成の場合、両方のボタンを削除
    let finalQuizContainer = document.getElementById("final-quiz-container");
    if (finalQuizContainer) finalQuizContainer.remove();
    if (finalNavContainer) finalNavContainer.remove();
  }
}

// ----------------------------------------------------
// 最終謎への遷移
// ----------------------------------------------------

function goToFinalQuiz() {
  const achievements = JSON.parse(
    localStorage.getItem("h1e_achievements") || "[]"
  );
  const clearedMainQuizzes = ["謎1", "謎2", "謎3"].every((id) =>
    achievements.includes(id)
  );

  if (clearedMainQuizzes) {
    window.location.href = "quiz_page_5.html";
  } else {
    alert("最終謎に挑戦するには、謎1〜謎3を全てクリアしてください。");
    loadAchievements();
  }
}

// ----------------------------------------------------
// ゲームデータのリセット (ボタン削除のため、呼び出しは想定されていません)
// ----------------------------------------------------
// ... (resetGameData 関数は省略) ...

// ----------------------------------------------------
// ページ初期化処理（イベントリスナーの設定）
// ----------------------------------------------------

document.addEventListener("DOMContentLoaded", () => {
  loadAchievements();

  const menuButton = document.getElementById("menu-button");
  if (menuButton) {
    menuButton.addEventListener("click", toggleSidebar);
  }

  const toggleSidebarButton = document.getElementById("toggle-sidebar");
  if (toggleSidebarButton) {
    toggleSidebarButton.addEventListener("click", toggleSidebar);
  }
});
