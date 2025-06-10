const playBoard = document.querySelector(".play-board");
const scoreElement = document.querySelector(".score");
const highScoreElement = document.querySelector(".high-score");

// oyun kontrolü
let gameOver = false;

// yem konumunu belirleyen değişken
let foodX, foodY;

// yılan konumunu tutacak değişken
let snakeX = 5, snakeY = 5;

// yılanın hızını belirleyen değişken
let velocityX = 0, velocityY = 0;

// yılanın vücudunu temsil eden dizi
let snakeBody = [];

// oyun döngüsünü kontrol edecek değişken
let setIntervalId;

// oyuncu skorunu tutacak değişken
let score = 0;

// en yüksek skoru localStorage'den al
let highScore = localStorage.getItem("high-score") || 0;

// en yüksek skoru ekrana yaz
highScoreElement.innerText = `Max Skor: ${highScore}`;

// yem konumunu rastgele belirleyen fonksiyon
const updateFoodPosition = () => {
  foodX = Math.floor(Math.random() * 30) + 1; // 1 ile 30 arasında değer ver
  foodY = Math.floor(Math.random() * 30) + 1; // 1 ile 30 arasında değer ver
};

// oyunun sona erdiğini işleyen fonksiyon
const handleGameOver = () => {
  clearInterval(setIntervalId);
  alert("oyun bitti");
  location.reload(); // sayfayı yeniler
};

// tuşa basıldığında yılanın yönünü değiştiren fonksiyon
const changeDirection = (e) => {
  if (e.key === "ArrowUp" && velocityY !== 1) {
    velocityX = 0;
    velocityY = -1;
  } else if (e.key === "ArrowDown" && velocityY !== -1) {
    velocityX = 0;
    velocityY = 1;
  } else if (e.key === "ArrowLeft" && velocityX !== 1) {
    velocityX = -1;
    velocityY = 0;
  } else if (e.key === "ArrowRight" && velocityX !== -1) {
    velocityX = 1;
    velocityY = 0;
  }
};

// oyunu başlatan fonksiyon
const initGame = () => {
  // oyun sona ermişse oyunu başlatmadan çık
  if (gameOver) {
    return handleGameOver();
  } else {
    // html değişkenini boş bir string olarak tanımlıyoruz
    let html = ``;

    // yılanın ve yemin konumunu oluşturacağız
    html += `<div class="food" style="grid-area: ${foodY} / ${foodX};"></div>`;

    // yılan yemi yemişse
    if (snakeX === foodX && snakeY === foodY) {
      // yeni yem konumunu belirle
      updateFoodPosition();

      // yemi yılan vücuduna ekle
      snakeBody.push([foodY, foodX]);

      // skoru arttır
      score++;

      // eğer yeni skor en yüksek skoru geçerse, en yüksek skor güncellenir
      highScore = score >= highScore ? score : highScore;

      // en yüksek skoru tarayıcıya kaydet
      localStorage.setItem("high-score", JSON.stringify(highScore));

      // skor ve en yüksek skoru ekrana yazdır
      highScoreElement.innerText = `Max Skor: ${highScore}`;
      scoreElement.innerText = `Skor: ${score}`;
    }

    // yılanın başını güncelle
    snakeX += velocityX;
    snakeY += velocityY;

    // yılanın vücudunu kaydırarak hareket ettir
    for (let i = snakeBody.length - 1; i > 0; i--) {
      snakeBody[i] = snakeBody[i - 1];
    }

    snakeBody[0] = [snakeX, snakeY];

    // yılanın tahtanın dışına çıkma kontrolü
    if (snakeX <= 0 || snakeX > 30 || snakeY <= 0 || snakeY > 30) {
      return (gameOver = true);
    }

    // yılanın her bir parçasını temsil eden div'leri HTML içeriğine ekle
    for (let i = 0; i < snakeBody.length; i++) {
      html += `<div class="head" style="grid-area: ${snakeBody[i][1]} / ${snakeBody[i][0]}"></div>`;
      // yılanın başının vücuduyla çarpışıp çarpışmadığını kontrol et
      if (
        i !== 0 &&
        snakeBody[0][1] === snakeBody[i][1] &&
        snakeBody[0][0] === snakeBody[i][0]
      ) {
        gameOver = true;
      }
    }

    // oyun tahtasını güncelle
    playBoard.innerHTML = html;
  }
};

// oyunu başlatmadan önce yem konumunu belirle
updateFoodPosition();

// oyun döngüsünü başlat
setIntervalId = setInterval(initGame, 100);

document.addEventListener("keyup", changeDirection);
