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
// --- 여기서 "영웅", "희귀", "고급", "일반"을 새로 추가 ---
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
  // 아래는 예시로 임의 값 넣음. 실제 확률/범위는 게임 밸런스 맞춰 조정
  "영웅": [
    { prob: 2.0, range: [15, 20] },
    { prob: 18.0, range: [10, 15] },
    { prob: 40.0, range: [5, 10] },
    { prob: 40.0, range: [1, 5] },
  ],
  "희귀": [
    { prob: 5.0, range: [10, 15] },
    { prob: 20.0, range: [5, 10] },
    { prob: 35.0, range: [3, 5] },
    { prob: 40.0, range: [1, 3] },
  ],
  "고급": [
    { prob: 10.0, range: [8, 12] },
    { prob: 20.0, range: [5, 8] },
    { prob: 30.0, range: [2, 5] },
    { prob: 40.0, range: [1, 2] },
  ],
  "일반": [
    { prob: 10.0, range: [5, 7] },
    { prob: 20.0, range: [3, 5] },
    { prob: 30.0, range: [2, 3] },
    { prob: 40.0, range: [1, 2] },
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
  console.log("DOM 로드 완료");

  // 시작 버튼 이벤트 설정
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

    // 입력값 검증
    if (isNaN(currentValue) || currentValue < 0) {
      alert("현재 수치를 올바르게 입력해주세요.");
      return;
    }
    if (isNaN(targetPercentage) || targetPercentage < 1 || targetPercentage > 100) {
      alert("1차 강화 목표 비율을 1~100 사이로 입력해주세요.");
      return;
    }

    // 옵션 최대치, 최종 강화 가능 수치, 목표 수치 계산
    const maxLimit = maxLimits[option];
    if (typeof maxLimit === "undefined") {
      alert("선택한 옵션에 대한 최대치가 존재하지 않습니다.");
      return;
    }
    const finalLimit = maxLimit + Math.floor(maxLimit * 0.3);
    const targetValue = Math.floor(finalLimit * (targetPercentage / 100));

    console.log("옵션 최대치:", maxLimit);
    console.log("최종 강화 가능 수치:", finalLimit);
    console.log("1차 강화 목표 수치:", targetValue);

    // 진행 중 메시지
    document.getElementById("output").innerHTML = "<p>시뮬레이션 실행 중...</p>";

    try {
      // 시뮬레이션 실행
      const results = await simulateEnhancements(10000, grade, maxLimit, currentValue, targetValue);

      if (!results) {
        throw new Error("시뮬레이션 결과가 없습니다.");
      }

      console.log("시뮬레이션 결과:", results);

      // 결과 출력
      document.getElementById("output").innerHTML = `
        <p>평균 추가된 값: ${results.avgAddedValue}</p>
        <p>1차 강화 평균 횟수: ${results.avg1stAttempts}</p>
        <p>2차 강화 평균 횟수: ${results.avg2ndAttempts}</p>
        <p>평균 소모 금전: ${results.avgGoldSpent.toLocaleString()} 전</p>
        <p>평균 소모 강화석 갯수: ${results.avgStonesSpent}</p>
      `;
    } catch (error) {
      console.error(error);
      document.getElementById("output").innerHTML =
        "<p>오류가 발생했습니다. 콘솔을 확인하고 다시 시도해주세요.</p>";
    }
  });
});

// ------------------------------------------
// 시뮬레이션 함수
// ------------------------------------------
async function simulateEnhancements(iterations, grade, maxLimit, currentValue, targetValue) {
  console.log("시뮬레이션 함수 실행 시작");

  let totalAddedValue = 0;
  let total1stAttempts = 0;
  let total2ndAttempts = 0;
  let totalGoldSpent = 0;
  let totalStonesSpent = 0;

  // 1회 시뮬레이션을 iterations번 반복
  for (let i = 0; i < iterations; i++) {
    // ---------------------------
    // 1차 강화
    // ---------------------------
    let attempts1st = 0;
    let addedValue1st = 0;

    while (currentValue + addedValue1st < targetValue && attempts1st < 1000) {
      const probData = initialProbability[grade];
      // 혹시라도 해당 등급이 정의되지 않았다면 에러 처리
      if (!probData) {
        throw new Error(`초기 확률 데이터가 없음: 등급=${grade}`);
      }

      const initialRange = getRandomRange(probData);
      if (!initialRange) {
        throw new Error("초기 확률 범위를 찾지 못했습니다.");
      }

      const enhancement = getRandomValue(initialRange);
      addedValue1st += enhancement;
      attempts1st++;

      // 1차 강화 비용(예: 초기화 비용)
      // 문제에서 10,000전이라고 가정
      totalGoldSpent += 10000;
    }

    total1stAttempts += attempts1st;

    // ---------------------------
    // 2차 강화
    // ---------------------------
    let enhancedValue = currentValue + addedValue1st;
    let attempts2nd = 0;
    let addedValue2nd = 0;

    // 최종 강화 가능 수치
    const finalLimit = maxLimit + Math.floor(maxLimit * 0.3);

    // 등급별 비용
    const costData = enhancementCosts[grade];
    if (!costData) {
      throw new Error(`강화 비용 데이터가 없음: 등급=${grade}`);
    }

    while (enhancedValue < finalLimit && attempts2nd < 1000) {
      // 2차 강화 확률 결정
      const enhancementChance = getEnhancementChance(enhancedValue, maxLimit, finalLimit);

      // 확률에 따라 강화치 계산
      // (예시: max -> [enhancedValue+1, finalLimit] 사이 랜덤)
      //        mid -> [enhancedValue+1, (enhancedValue+finalLimit)/2] 사이 랜덤
      //        min -> 1 고정
      let additionalEnhancement = 0;
      if (enhancementChance === "max") {
        additionalEnhancement = getRandomValue([enhancedValue + 1, finalLimit]);
      } else if (enhancementChance === "mid") {
        const midMax = Math.floor((enhancedValue + finalLimit) / 2);
        additionalEnhancement = getRandomValue([enhancedValue + 1, midMax]);
      } else {
        additionalEnhancement = 1;
      }

      enhancedValue += additionalEnhancement;
      addedValue2nd += additionalEnhancement;

      // 2차 강화 비용
      totalStonesSpent += costData.stone;
      totalGoldSpent += costData.gold;
      attempts2nd++;
    }

    total2ndAttempts += attempts2nd;
    totalAddedValue += addedValue1st + addedValue2nd;
  }

  // 반복 종료 후 평균값 계산
  return {
    avgAddedValue: Math.floor(totalAddedValue / iterations),
    avg1stAttempts: Math.floor(total1stAttempts / iterations),
    avg2ndAttempts: Math.floor(total2ndAttempts / iterations),
    avgGoldSpent: Math.floor(totalGoldSpent / iterations),
    avgStonesSpent: Math.floor(totalStonesSpent / iterations),
  };
}

// ------------------------------------------
// 확률 범위 선택 함수
// ------------------------------------------
function getRandomRange(probabilities) {
  const rand = Math.random() * 100;
  let cumulative = 0;
  for (const { prob, range } of probabilities) {
    cumulative += prob;
    if (rand <= cumulative) return range;
  }
  // 모든 구간에 해당되지 않는 경우 null 반환
  return null;
}

// ------------------------------------------
// 무작위 값 선택 함수
// ------------------------------------------
function getRandomValue(range) {
  // range = [최소값, 최대값]
  const min = range[0];
  const max = range[1];
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// ------------------------------------------
// 2차 강화 확률 결정 함수
// ------------------------------------------
function getEnhancementChance(currentValue, maxLimit, finalLimit) {
  const rand = Math.random() * 100;
  if (rand <= 10) return "max"; // 상위 구간
  if (rand <= 40) return "mid"; // 중간 구간
  return "min";                // 하위(최소) 구간
}
