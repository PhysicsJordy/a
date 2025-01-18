document.addEventListener("DOMContentLoaded", function () {
    // --------------------------------------------------------------------------
    // [0] 저장 및 불러오기 기능
    // --------------------------------------------------------------------------
    // 입력값을 localStorage에 저장하는 함수
    function saveInputs() {
        const inputs = document.querySelectorAll("input");
        inputs.forEach(input => {
            localStorage.setItem(input.id, input.value || "");
        });
    }

    // localStorage에서 입력값을 복원하는 함수
    function loadInputs() {
        const inputs = document.querySelectorAll("input");
        inputs.forEach(input => {
            const savedValue = localStorage.getItem(input.id);
            if (savedValue !== null) {
                input.value = savedValue;
            }
        });
    }

    // --------------------------------------------------------------------------
    // [1] 기존 방어구 관통 계산기 로직
    // --------------------------------------------------------------------------
    const groupDIds = ["dqwon-1", "dqwon-2"];
    function getGroupValues(groupId, type) {
        const inputs = document.querySelectorAll(`#${groupId} input[id$='-${type}']`);
        let sum = 0;
        inputs.forEach(input => {
            sum += parseFloat(input.value) || 0;
        });
        return sum;
    }
    function getGroupAFixed() {
        const inputs = document.querySelectorAll("#group-a input");
        let sum = 0;
        inputs.forEach(input => {
            sum += parseFloat(input.value) || 0;
        });
        return Math.floor(sum / 100);
    }
    function calculateGroupD() {
        let sum = 0;
        groupDIds.forEach(id => {
            const value = parseFloat(document.getElementById(id).value) || 0;
            sum += value;
        });
        return sum;
    }
    function calculatePenetration() {
        const groupAFixed = getGroupAFixed();
        const groupBFixed = Math.floor(getGroupValues("group-b", "fixed"));
        const groupBPercent = getGroupValues("group-b", "percent").toFixed(2);
        const groupCFixed = Math.floor(getGroupValues("group-c", "pix"));
        const groupDTotal = calculateGroupD().toFixed(2);
        const totalCalculation = Math.floor(
            (groupBFixed * (1 + 0.01 * groupBPercent)) *
            (1 + 0.01 * groupDTotal) +
            groupCFixed +
            groupAFixed
        );
        document.getElementById("group-a-fixed").textContent = groupAFixed;
        document.getElementById("group-b-fixed").textContent = groupBFixed;
        document.getElementById("group-b-percent").textContent = groupBPercent;
        document.getElementById("group-c-pix").textContent = groupCFixed;
        document.getElementById("group-d-total").textContent = groupDTotal;
        document.getElementById("total-penetration").textContent = totalCalculation;
    }

    // --------------------------------------------------------------------------
    // [2] 방어도 무시 계산기 로직
    // --------------------------------------------------------------------------
    const groupDIds2 = ["dqwon-12", "dqwon-22"];
    function getGroupValues2(groupId, type) {
        const inputs = document.querySelectorAll(`#${groupId} input[id$='-${type}']`);
        let sum = 0;
        inputs.forEach(input => {
            sum += parseFloat(input.value) || 0;
        });
        return sum;
    }
    function getGroupAFixed2() {
        const inputs = document.querySelectorAll("#group-a2 input");
        let sum = 0;
        inputs.forEach(input => {
            sum += parseFloat(input.value) || 0;
        });
        return Math.floor(sum / 250);
    }
    function calculateGroupD2() {
        let sum = 0;
        groupDIds2.forEach(id => {
            const value = parseFloat(document.getElementById(id).value) || 0;
            sum += value;
        });
        return sum;
    }
    function calculateIgnoreDef() {
        const groupAFixed2 = getGroupAFixed2();
        const groupBFixed2 = Math.floor(getGroupValues2("group-b2", "fixed2"));
        const groupBPercent2 = getGroupValues2("group-b2", "percent2").toFixed(2);
        const groupCFixed2 = Math.floor(getGroupValues2("group-c2", "pix2"));
        const groupDTotal2 = calculateGroupD2().toFixed(2);
        const totalCalculation2 = Math.floor(
            (groupBFixed2 * (1 + 0.01 * groupBPercent2)) *
            (1 + 0.01 * groupDTotal2) +
            groupCFixed2 +
            groupAFixed2
        );
        document.getElementById("group-a-fixed2").textContent = groupAFixed2;
        document.getElementById("group-b-fixed2").textContent = groupBFixed2;
        document.getElementById("group-b-percent2").textContent = groupBPercent2;
        document.getElementById("group-c-pix2").textContent = groupCFixed2;
        document.getElementById("group-d-total2").textContent = groupDTotal2;
        document.getElementById("total-penetration2").textContent = totalCalculation2;
    }

    // --------------------------------------------------------------------------
    // [3] 공통: 입력값 변경 시 실시간 계산 및 저장
    // --------------------------------------------------------------------------
    const inputs = document.querySelectorAll("input");
    inputs.forEach(input => {
        input.addEventListener("input", () => {
            calculatePenetration();
            calculateIgnoreDef();
            saveInputs(); // 입력값 변경 시 저장
        });
    });

    // 페이지 로드 시 저장된 데이터 복원 후 계산 실행
    loadInputs();
    calculatePenetration();
    calculateIgnoreDef();
});
