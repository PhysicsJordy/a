<script src="inhance.js?v=1.0"></script>


// 옵션별 최대치 정의
const maxLimits = {
  "마법치명": 70,
  "방어구관통": 50,
  "방어도무시": 12,
  "공격력증가": 70,
  "시전향상": 100,
  "마력증강": 70,
};

// 초기 강화 확률 설정
const initialProbability = {
  "신화": [
    { prob: 0.1, range: [20, 30] },
    { prob: 19.9, range: [15, 25] },
    { prob: 40.0, range: [10, 15] },
    { prob: 40.0, range: [5, 10] },
  ],
  "전설": [
    { prob: 1.0, range: [20, 30] },
    { prob: 19.0, range: [15, 25] },
    { prob: 20.0, range: [10, 15] },
    { prob: 60.0, range: [5, 10] },
  ],
};

// 강화 비용 설정
const enhancementCosts = {
  "신화": { stone: 15, gold: 800000 },
  "전설": { stone: 15, gold: 500000 },
  "영웅": { stone: 15, gold: 300000 },
  "희귀": { stone: 15, gold: 100000 },
  "고급": { stone: 15, gold: 50000 },
  "일반": { stone: 15, gold: 10000 },
};

document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("start-simulation").addEventListener("click", async () => {
    console.log("시뮬레이션 시작 버튼 클릭됨");

    const grade = document.getElementById("grade").value;
    const option = document.getElementById("option").value;
    const currentValue = parseInt(document.getElementById("current-value").value);
    const targetPercentage = parseInt(document.getElementById("target-percentage").value);

    console.log("선택된 등급:", grade);
    console.log("선택된 옵션:", option);
    console.log("현재 수치:", currentValue);
    console.log("목표 비율:", targetPercentage);

    if (isNaN(currentValue) || currentValue < 0) {
      alert("현재 수치를 올바르게 입력해주세요.");
      return;
    }
    if (isNaN(targetPercentage) || targetPercentage < 1 || targetPercentage > 100) {
      alert("1차 강화 목표 비율을 1~100 사이로 입력해주세요.");
      return;
    }

    const maxLimit = maxLimits[option];
    const finalLimit = maxLimit + Math.floor(maxLimit * 0.3);
    const targetValue = Math.floor(finalLimit * (targetPercentage / 100));

    console.log("옵션 최대치:", maxLimit);
    console.log("최종 강화 가능 수치:", finalLimit);
    console.log("1차 강화 목표 수치:", targetValue);

    document.getElementById("output").innerHTML = "<p>시뮬레이션 실행 중...</p>";

    const results = await simulateEnhancements(10000, grade, maxLimit, currentValue, targetValue);

    console.log("시뮬레이션 결과:", results);

    document.getElementById("output").innerHTML = `
      <p>평균 추가된 값: ${results.avgAddedValue}</p>
      <p>1차 강화 평균 횟수: ${results.avg1stAttempts}</p>
      <p>2차 강화 평균 횟수: ${results.avg2ndAttempts}</p>
      <p>평균 소모 금전: ${results.avgGoldSpent.toLocaleString()} 전</p>
      <p>평균 소모 강화석 갯수: ${results.avgStonesSpent}</p>
    `;
  });
});

async function simulateEnhancements(iterations, grade, maxLimit, currentValue, targetValue) {
  let totalAddedValue = 0;
  let total1stAttempts = 0;
  let total2ndAttempts = 0;
  let totalGoldSpent = 0;
  let totalStonesSpent = 0;

  for (let i = 0; i < iterations; i++) {
    console.log(`Iteration ${i + 1}: 현재 수치 = ${currentValue}, 목표 수치 = ${targetValue}`);

    // 1차 강화
    let attempts1st = 0;
    let addedValue1st = 0;

    while (currentValue + addedValue1st < targetValue) {
      const initialRange = getRandomRange(initialProbability[grade]);
      const enhancement = getRandomValue(initialRange);
      console.log(`1차 강화 값 추가: ${enhancement}`);

      addedValue1st += enhancement;
      attempts1st++;
      totalGoldSpent += 10000; // 초기화 비용
    }

    console.log(`1차 강화 완료: 추가된 값 = ${addedValue1st}, 시도 횟수 = ${attempts1st}`);
    total1stAttempts += attempts1st;

    // 2차 강화
    let enhancedValue = currentValue + addedValue1st;
    let attempts2nd = 0;
    let addedValue2nd = 0;
    const finalLimit = maxLimit + Math.floor(maxLimit * 0.3);
    const costData = enhancementCosts[grade];

    while (enhancedValue < finalLimit) {
      const enhancementChance = getEnhancementChance(enhancedValue, maxLimit, finalLimit);
      const additionalEnhancement = enhancementChance === "max"
        ? getRandomValue([enhancedValue + 1, finalLimit])
        : enhancementChance === "mid"
        ? getRandomValue([enhancedValue + 1, Math.floor((enhancedValue + finalLimit) / 2)])
        : 1;

      console.log(`2차 강화 값 추가: ${additionalEnhancement}`);
      enhancedValue += additionalEnhancement;
      addedValue2nd += additionalEnhancement;
      totalStonesSpent += costData.stone;
      totalGoldSpent += costData.gold;
      attempts2nd++;
    }

    console.log(`2차 강화 완료: 추가된 값 = ${addedValue2nd}, 시도 횟수 = ${attempts2nd}`);
    total2ndAttempts += attempts2nd;
    totalAddedValue += addedValue1st + addedValue2nd;
  }

  return {
    avgAddedValue: Math.floor(totalAddedValue / iterations),
    avg1stAttempts: Math.floor(total1stAttempts / iterations),
    avg2ndAttempts: Math.floor(total2ndAttempts / iterations),
    avgGoldSpent: Math.floor(totalGoldSpent / iterations),
    avgStonesSpent: Math.floor(totalStonesSpent / iterations),
  };
}

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
