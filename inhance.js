const maxLimits = {
  "마법치명": 70,
  "방어구관통": 50,
  "방어도무시": 12,
  "공격력증가": 70,
  "시전향상": 100,
  "마력증강": 70,
};

const gradeCosts = {
  "일반~전설": { stone: 5, gold: 50000 },
  "신화 이상": { stone: 15, gold: 800000 },
};

document.getElementById("start-simulation").addEventListener("click", () => {
  const grade = document.getElementById("grade").value;
  const option = document.getElementById("option").value;
  const currentValue = parseInt(document.getElementById("value").value);

  if (isNaN(currentValue) || currentValue <= 0) {
    alert("능력치를 올바르게 입력해주세요!");
    return;
  }

  const maxLimit = maxLimits[option];
  const maxPossibleIncrease = Math.floor(maxLimit * 0.3);
  const finalLimit = maxLimit + maxPossibleIncrease;

  // 최초 능력 부여
  const initialProbabilities = grade === "일반~전설"
    ? [{ prob: 1, range: [20, 30] }, { prob: 19, range: [15, 25] }, { prob: 20, range: [10, 15] }, { prob: 60, range: [5, 10] }]
    : [{ prob: 0.1, range: [20, 30] }, { prob: 19.9, range: [15, 25] }, { prob: 40, range: [10, 15] }, { prob: 40, range: [5, 10] }];

  const initialRange = getRandomRange(initialProbabilities);
  const initialEnhancement = getRandomValue(initialRange);

  // 강화 과정
  let totalStones = gradeCosts[grade].stone;
  let totalGold = gradeCosts[grade].gold;

  let enhancedValue = currentValue + initialEnhancement;
  let attempts = 0;

  while (enhancedValue < finalLimit) {
    const enhancementChance = getEnhancementChance(enhancedValue, maxLimit, finalLimit);
    const additionalEnhancement = enhancementChance === "max"
      ? getRandomValue([enhancedValue + 1, finalLimit])
      : enhancementChance === "mid"
      ? getRandomValue([enhancedValue + 1, Math.floor((enhancedValue + finalLimit) / 2)])
      : 1;

    enhancedValue += additionalEnhancement;
    totalStones += gradeCosts[grade].stone;
    totalGold += gradeCosts[grade].gold;
    attempts++;
  }

  // 결과 출력
  document.getElementById("output").innerHTML = `
    <p>강화 완료!</p>
    <p>최종 능력치: ${enhancedValue} / 최대 가능치: ${finalLimit}</p>
    <p>강화 시도 횟수: ${attempts}</p>
    <p>총 소모 강화석: ${totalStones}개</p>
    <p>총 소모 금전: ${totalGold.toLocaleString()}전</p>
  `;
});

// 유틸리티 함수
function getRandomRange(probabilities) {
  const rand = Math.random() * 100;
  let cumulative = 0;

  for (const { prob, range } of probabilities) {
    cumulative += prob;
    if (rand <= cumulative) return range;
  }
}

function getRandomValue(range) {
  return Math.floor(Math.random() * (range[1] - range[0] + 1)) + range[0];
}

function getEnhancementChance(currentValue, maxLimit, finalLimit) {
  const rand = Math.random() * 100;
  if (rand <= 10) return "max";
  if (rand <= 40) return "mid";
  return "min";
}
