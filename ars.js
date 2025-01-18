document.addEventListener("DOMContentLoaded", () => {
    // 그룹 A의 입력 필드 ID 목록
    const groupAStats = ["strength", "agility", "intelligence", "wisdom"];

    // 결과를 표시할 요소 추가
    const groupAContainer = document.getElementById("group-a");
    const resultField = document.createElement("div");
    resultField.className = "input-field";
    resultField.innerHTML = `
        <label>기본 스탯 합계 / 100:</label>
        <span id="group-a-result">0.0</span>
    `;
    groupAContainer.appendChild(resultField);

    // 스탯 값 계산 함수
    const calculateGroupA = () => {
        let total = 0;

        // 각 스탯 값을 더함
        groupAStats.forEach(id => {
            const value = parseFloat(document.getElementById(id).value) || 0;
            total += value;
        });

        // 합계 / 100을 소수점 첫째자리까지 계산
        const result = (total / 100).toFixed(1);

        // 결과 업데이트
        document.getElementById("group-a-result").textContent = result;
    };

    // 입력값 변경 시 계산 수행
    groupAStats.forEach(id => {
        document.getElementById(id).addEventListener("input", calculateGroupA);
    });
});
