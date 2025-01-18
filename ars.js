document.addEventListener("DOMContentLoaded", function () {
    // --------------------------------------------------------------------------
    // [0] 저장 및 불러오기 기능 (기존)
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
    // [4] 프로필(탭) 별로 저장/불러오기 기능 추가
    // --------------------------------------------------------------------------
    // 이 부분을 통해 현재 페이지의 모든 input 값들을 한 번에 저장/로드할 수 있습니다.

    // 모든 input 값들을 객체 형태로 추출
    function getAllInputs() {
        const allInputs = document.querySelectorAll("input");
        const data = {};
        allInputs.forEach(input => {
            data[input.id] = input.value;
        });
        return data;
    }

    // 객체로 받은 값을 실제 input들에 세팅
    function setAllInputs(data) {
        for (const key in data) {
            const el = document.getElementById(key);
            if (el) {
                el.value = data[key];
            }
        }
        // 값이 바뀌었으니 다시 계산
        calculatePenetration();
        calculateIgnoreDef();
    }

    // 선택한 프로필 번호(n)에 대해 저장
    function saveProfile(n) {
        const data = getAllInputs();
        localStorage.setItem("profile" + n, JSON.stringify(data));
        alert("프로필 " + n + "이(가) 저장되었습니다.");
    }

    // 선택한 프로필 번호(n)에 대해 불러오기
    function loadProfile(n) {
        const saved = localStorage.getItem("profile" + n);
        if (saved) {
            const data = JSON.parse(saved);
            setAllInputs(data);
            alert("프로필 " + n + "을(를) 불러왔습니다.");
        } else {
            alert("프로필 " + n + "에 저장된 정보가 없습니다.");
        }
    }

    // --------------------------------------------------------------------------
    // [3] 공통: 입력값 변경 시 실시간 계산 및 저장 (기존)
    // --------------------------------------------------------------------------
    const inputs = document.querySelectorAll("input");
    inputs.forEach(input => {
        input.addEventListener("input", () => {
            calculatePenetration();
            calculateIgnoreDef();
            saveInputs(); // 입력값 변경 시 저장 (기존 방식)
        });
    });

    // 페이지 로드 시: 이전에 저장된 입력값 로드 후 계산
    loadInputs();
    calculatePenetration();
    calculateIgnoreDef();

    // --------------------------------------------------------------------------
    // [5] 프로필 저장/불러오기 버튼(HTML)에 대한 이벤트 연결
    // --------------------------------------------------------------------------
    // HTML에서 프로필1/2/3 저장, 불러오기 버튼이 존재한다면 다음과 같이 연결:
    const saveProfile1Button = document.getElementById("saveProfile1");
    const loadProfile1Button = document.getElementById("loadProfile1");
    const saveProfile2Button = document.getElementById("saveProfile2");
    const loadProfile2Button = document.getElementById("loadProfile2");
    const saveProfile3Button = document.getElementById("saveProfile3");
    const loadProfile3Button = document.getElementById("loadProfile3");

    if (saveProfile1Button && loadProfile1Button) {
        saveProfile1Button.addEventListener("click", function() {
            saveProfile(1);
        });
        loadProfile1Button.addEventListener("click", function() {
            loadProfile(1);
        });
    }
    if (saveProfile2Button && loadProfile2Button) {
        saveProfile2Button.addEventListener("click", function() {
            saveProfile(2);
        });
        loadProfile2Button.addEventListener("click", function() {
            loadProfile(2);
        });
    }
    if (saveProfile3Button && loadProfile3Button) {
        saveProfile3Button.addEventListener("click", function() {
            saveProfile(3);
        });
        loadProfile3Button.addEventListener("click", function() {
            loadProfile(3);
        });
    }
});
