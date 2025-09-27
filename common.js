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
    mainQuizzes.forEach(quizId => {
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
    // 謎5へのボタンと通知の処理 (修正箇所)
    // ----------------------------------------------------
    let finalNavContainer = document.getElementById('final-nav-container');
    let finalQuizContainer = document.getElementById('final-quiz-container');

    const mainQuizzesCleared = mainQuizzes.every(id => achievements.includes(id));
    
    // 謎5クリア済み: final.htmlへ進むボタン処理
    if (finalQuizCleared && statusContent) {
        if (!finalNavContainer) {
            const containerDiv = document.createElement('div');
            containerDiv.id = 'final-nav-container';
            containerDiv.style.marginTop = '20px';

            const finalNavBtn = document.createElement('button');
            finalNavBtn.id = 'go-to-goal-page';
            finalNavBtn.textContent = '🏆 ゴールページ (final.html) へ進む！';
            finalNavBtn.style.cssText = 'background-color: #4CAF50; color: white; padding: 10px; border: none; border-radius: 5px; width: 100%; cursor: pointer;';
            finalNavBtn.addEventListener('click', () => {
                window.location.href = "final.html";
            });
            
            containerDiv.appendChild(finalNavBtn);
            statusContent.appendChild(containerDiv);
        }
        if (finalQuizContainer) finalQuizContainer.remove();

    // 謎1〜3クリア済み: 謎5へのボタンと通知処理
    } else if (mainQuizzesCleared && statusContent) {
        let hasNotified = sessionStorage.getItem('notified_to_quiz5') === 'true';

        // 謎5へのボタン表示
        if (!finalQuizContainer) {
            const containerDiv = document.createElement('div');
            containerDiv.id = 'final-quiz-container';
            containerDiv.style.marginTop = '20px';

            const finalQuizBtn = document.createElement('button');
            finalQuizBtn.id = 'go-to-final-quiz';
            finalQuizBtn.textContent = '最終謎（謎5）へ進む！';
            finalQuizBtn.style.cssText = 'background-color: #f7b731; color: #333; padding: 10px; border: none; border-radius: 5px; width: 100%; cursor: pointer;';
            finalQuizBtn.addEventListener('click', goToFinalQuiz);
            
            containerDiv.appendChild(finalQuizBtn);
            statusContent.appendChild(containerDiv);
        }
        
        // 🚨 画面中央通知の表示（セッション中に一度だけ） 🚨
        if (!hasNotified) {
            showCenterNotification("🎉 最後の謎に挑戦できます！", "quiz_page_5.html");
            sessionStorage.setItem('notified_to_quiz5', 'true');
        }

        if (finalNavContainer) finalNavContainer.remove();

    } else {
        // どちらも未達成の場合、両方のボタンを削除
        if (finalQuizContainer) finalQuizContainer.remove();
        if (finalNavContainer) finalNavContainer.remove();
    }
}

// ----------------------------------------------------
// 🚨 画面中央通知の表示 (新規追加) 🚨
// ----------------------------------------------------

function showCenterNotification(message, url) {
    if (document.getElementById('center-notification')) return;

    const overlay = document.createElement('div');
    overlay.id = 'center-notification';
    overlay.style.cssText = `
        position: fixed; top: 0; left: 0; width: 100%; height: 100%;
        background-color: rgba(0, 0, 0, 0.7); z-index: 1000;
        display: flex; justify-content: center; align-items: center;
    `;

    const box = document.createElement('div');
    box.style.cssText = `
        background-color: white; padding: 30px 40px; border-radius: 15px;
        text-align: center; box-shadow: 0 0 20px rgba(0, 0, 0, 0.5);
        max-width: 80%;
    `;

    const msg = document.createElement('h2');
    msg.textContent = message;
    msg.style.cssText = 'color: #333; margin-bottom: 20px; font-size: 1.8em;';

    const button = document.createElement('button');
    button.textContent = '最終謎（謎5）へGO!';
    button.style.cssText = `
        background-color: #f7b731; color: white; padding: 12px 25px;
        border: none; border-radius: 8px; font-size: 1.2em; cursor: pointer;
    `;
    button.onclick = () => {
        window.location.href = url;
        overlay.remove();
    };
    
    const closeBtn = document.createElement('button');
    closeBtn.textContent = '後でサイドバーから進む';
    closeBtn.style.cssText = 'background: none; border: none; color: #555; margin-top: 15px; cursor: pointer; display: block; width: 100%;';
    closeBtn.onclick = () => {
        overlay.remove();
    };

    box.appendChild(msg);
    box.appendChild(button);
    box.appendChild(closeBtn);
    overlay.appendChild(box);
    document.body.appendChild(overlay);
}


// ----------------------------------------------------
// 最終謎への遷移
// ----------------------------------------------------

function goToFinalQuiz() {
    const achievements = JSON.parse(localStorage.getItem("h1e_achievements") || "[]");
    const clearedMainQuizzes = ["謎1", "謎2", "謎3"].every(id => achievements.includes(id));

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
