document.addEventListener("DOMContentLoaded", function () {
  const coin = document.getElementById("coin");
  const button = document.getElementById("coinButton");
  const result = document.getElementById("result");
  const scoreList = document.getElementById("scoreList");
  let isAnimating = false;

  const sounds = {
    flip: new Audio(
      "https://assets.mixkit.co/sfx/preview/mixkit-coin-flip-1971.mp3"
    ),
    win: new Audio(
      "https://assets.mixkit.co/sfx/preview/mixkit-winning-chimes-2015.mp3"
    ),
    streak: new Audio(
      "https://assets.mixkit.co/sfx/preview/mixkit-achievement-bell-600.mp3"
    ),
  };

  const scores = { player1: 0, player2: 0 };
  const winStreak = { player1: 0, player2: 0 };

  function updateScoreboard() {
    const player1Name = document.getElementById("player1").value || "Jogador 1";
    const player2Name = document.getElementById("player2").value || "Jogador 2";
    const scoreItems = scoreList.querySelectorAll(".score-item");

    ["player1", "player2"].forEach((player, index) => {
      const item = scoreItems[index];
      const streak = item.querySelector(".streak-badge");
      const scoreElement = item.querySelector(".score");
      const previousScore = parseInt(scoreElement.textContent);
      const newScore = scores[player];

      item.querySelector(".player-name").textContent =
        player === "player1" ? player1Name : player2Name;
      scoreElement.setAttribute("data-previous-score", previousScore);

      if (newScore > previousScore) {
        scoreElement.classList.remove("score-decrease");
        scoreElement.classList.add("score-increase");
      } else if (newScore < previousScore) {
        scoreElement.classList.remove("score-increase");
        scoreElement.classList.add("score-decrease");
      }

      setTimeout(() => {
        scoreElement.textContent = newScore;
        scoreElement.classList.remove("score-increase", "score-decrease");
      }, 500);

      if (winStreak[player] >= 3) {
        streak.textContent = `🔥 ${winStreak[player]}x`;
        streak.classList.remove("hidden");
        item.classList.add("hot-streak");
      } else if (
        winStreak[player] === 0 &&
        !streak.classList.contains("hidden")
      ) {
        streak.classList.add("streak-reset");
        setTimeout(() => {
          streak.classList.add("hidden");
          streak.classList.remove("streak-reset");
          item.classList.remove("hot-streak");
        }, 500);
      }
    });

    updateProfilePics();
  }

  function updateProfilePics() {
    const pics = document.querySelectorAll(".profile-pic img");
    ["player1", "player2"].forEach((player, index) => {
      const name =
        document.getElementById(player).value || `player${index + 1}`;
      pics[
        index
      ].src = `https://api.dicebear.com/7.x/adventurer/svg?seed=${name}`;
    });
  }

  async function playSound(sound) {
    try {
      sound.currentTime = 0;
      await sound.play();
    } catch (error) {
      console.log("Sound playback failed:", error);
    }
  }

  button.addEventListener("click", async function () {
    if (isAnimating) return;

    const player1Name = document.getElementById("player1").value;
    const player2Name = document.getElementById("player2").value;

    if (!player1Name || !player2Name) {
      alert("Por favor, insira o nome dos dois jogadores!");
      return;
    }

    isAnimating = true;
    result.textContent = "";

    coin.style.transition = "none";
    coin.classList.remove("show-cara", "show-coroa");
    coin.style.transform = "translateY(0) rotateY(0)";
    void coin.offsetWidth;
    coin.style.transition = "all 2s cubic-bezier(0.645, 0.045, 0.355, 1)";
    coin.classList.add("flip");

    await playSound(sounds.flip);

    const isCara = Math.random() < 0.5;
    const winner = isCara ? "player1" : "player2";
    const loser = isCara ? "player2" : "player1";

    setTimeout(async () => {
      result.textContent = isCara ? "CARA!" : "COROA!";
      scores[winner]++;
      winStreak[winner]++;
      winStreak[loser] = 0;

      coin.classList.remove("flip");
      coin.classList.add(isCara ? "show-cara" : "show-coroa");

      await playSound(winStreak[winner] >= 3 ? sounds.streak : sounds.win);
      updateScoreboard();

      setTimeout(() => {
        isAnimating = false;
      }, 300);
    }, 2000);
  });

  updateScoreboard();

  ["player1", "player2"].forEach((player) => {
    document
      .getElementById(player)
      .addEventListener("input", updateProfilePics);
  });

  Object.values(sounds).forEach((sound) => {
    sound.load();
    sound.volume = 0.5;
  });
});
