document.addEventListener("DOMContentLoaded", function () {
    // ------------------------------------------------------------------------------
    // [1] 기존 방어구 관통 계산기 로직
    // ------------------------------------------------------------------------------
    // 그룹 D의 독립 변수 ID 배열 (방관)
    const groupDIds = ["dqwon-1", "dqwon-2"];

    // 그룹별 고정값/퍼센트값을 합산하는 함수 (방관)
    function getGroupValues(groupId, type) {
        // 예: getGroupValues("group-b", "fixed") → #group-b input[id$='-fixed']
        const inputs = document.querySelectorAll(`#${groupId} input[id$='-${type}']`);
        let sum = 0;
        inputs.forEach(input => {
            sum += parseFloat(input.value) || 0;
        });
        return sum;
    }

    // 그룹 A(방관)의 총 고정값 계산
    function getGroupAFixed() {
        const inputs = document.querySelectorAll("#group-a input");
        let sum = 0;
        inputs.forEach(input => {
            sum += parseFloat(input.value) || 0;
        });
        // 100으로 나눈 뒤 내림 처리
        return Math.floor(sum / 100);
    }

    // 그룹 D(방관)의 합계 계산
    function calculateGroupD() {
        let sum = 0;
        groupDIds.forEach(id => {
            const value = parseFloat(document.getElementById(id).value) || 0;
            sum += value;
        });
        return sum;
    }

    // 방어구 관통 최종 계산
    function calculatePenetration() {
        const groupAFixed = getGroupAFixed();                     // 그룹 A 고정값
        const groupBFixed = Math.floor(getGroupValues("group-b", "fixed")); // 그룹 B 고정값
        const groupBPercent = getGroupValues("group-b", "percent").toFixed(2); // 그룹 B %값
        const groupCFixed = Math.floor(getGroupValues("group-c", "pix"));  // 그룹 C 고정값
        const groupDTotal = calculateGroupD().toFixed(2);                 // 그룹 D 총합 (%)

        // (방관) 최종 연산
        const totalCalculation = Math.floor(
            (groupBFixed * (1 + 0.01 * groupBPercent)) *
            (1 + 0.01 * groupDTotal) +
            groupCFixed +
            groupAFixed
        );

        // (방관) 결과 표시
        document.getElementById("group-a-fixed").textContent = groupAFixed;
        document.getElementById("group-b-fixed").textContent = groupBFixed;
        document.getElementById("group-b-percent").textContent = groupBPercent;
        document.getElementById("group-c-pix").textContent = groupCFixed;
        document.getElementById("group-d-total").textContent = groupDTotal;
        document.getElementById("total-penetration").textContent = totalCalculation;
    }

    // ------------------------------------------------------------------------------
    // [2] 새로 추가된 방어도 무시 계산기 로직
    // ------------------------------------------------------------------------------
    // 그룹 D2의 독립 변수 ID 배열 (방무)
    const groupDIds2 = ["dqwon-12", "dqwon-22"];

    // 그룹별 고정값/퍼센트값을 합산하는 함수 (방무)
    function getGroupValues2(groupId, type) {
        // 예: getGroupValues2("group-b2", "fixed2") → #group-b2 input[id$='-fixed2']
        const inputs = document.querySelectorAll(`#${groupId} input[id$='-${type}']`);
        let sum = 0;
        inputs.forEach(input => {
            sum += parseFloat(input.value) || 0;
        });
        return sum;
    }

    // 그룹 A2(방무)의 총 고정값 계산
    function getGroupAFixed2() {
        const inputs = document.querySelectorAll("#group-a2 input");
        let sum = 0;
        inputs.forEach(input => {
            sum += parseFloat(input.value) || 0;
        });
        // 250으로 나눈 뒤 내림
        return Math.floor(sum / 250);
    }

    // 그룹 D2(방무)의 합계 계산
    function calculateGroupD2() {
        let sum = 0;
        groupDIds2.forEach(id => {
            const value = parseFloat(document.getElementById(id).value) || 0;
            sum += value;
        });
        return sum;
    }

    // 방어도 무시 최종 계산
    function calculateIgnoreDef() {
        // 각 그룹에서 "fixed2", "percent2", "pix2" 등을 읽어옴
        const groupAFixed2 = getGroupAFixed2(); // 그룹 A2 고정값
        const groupBFixed2 = Math.floor(getGroupValues2("group-b2", "fixed2")); 
        const groupBPercent2 = getGroupValues2("group-b2", "percent2").toFixed(2);
        const groupCFixed2 = Math.floor(getGroupValues2("group-c2", "pix2"));
        const groupDTotal2 = calculateGroupD2().toFixed(2);

        // (방무) 최종 연산
        const totalCalculation2 = Math.floor(
            (groupBFixed2 * (1 + 0.01 * groupBPercent2)) *
            (1 + 0.01 * groupDTotal2) +
            groupCFixed2 +
            groupAFixed2
        );

        // (방무) 결과 표시
        document.getElementById("group-a-fixed2").textContent = groupAFixed2;
        document.getElementById("group-b-fixed2").textContent = groupBFixed2;
        document.getElementById("group-b-percent2").textContent = groupBPercent2;
        document.getElementById("group-c-pix2").textContent = groupCFixed2;
        document.getElementById("group-d-total2").textContent = groupDTotal2;
        document.getElementById("total-penetration2").textContent = totalCalculation2;
    }

    // ------------------------------------------------------------------------------
    // [3] 공통: 입력값 변경 시 실시간 계산
    // ------------------------------------------------------------------------------
    const inputs = document.querySelectorAll("input");
    inputs.forEach(input => {
        input.addEventListener("input", () => {
            calculatePenetration(); // 방어구 관통 계산
            calculateIgnoreDef();   // 방어도 무시 계산
        });
    });

    // 페이지가 로드되면 두 계산 모두 한 번씩 실행
    calculatePenetration();
    calculateIgnoreDef();
});
