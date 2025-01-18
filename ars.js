<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>스탯 계산기</title>
    <link rel="stylesheet" href="ars.css">
</head>
<body>
    <div class="container">
        <h1>스탯 계산기</h1>

        <!-- 그룹 A: 기본 스탯 입력 -->
        <div class="group" id="group-a">
            <h2>그룹 A: 기본 스탯</h2>
            <div class="input-field">
                <label for="strength">힘:</label>
                <input type="number" id="strength" value="0">
            </div>
            <div class="input-field">
                <label for="agility">민첩:</label>
                <input type="number" id="agility" value="0">
            </div>
            <div class="input-field">
                <label for="intelligence">지력:</label>
                <input type="number" id="intelligence" value="0">
            </div>
            <div class="input-field">
                <label for="wisdom">지혜:</label>
                <input type="number" id="wisdom" value="0">
            </div>
            <div class="input-field">
                <label for="health">건강:</label>
                <input type="number" id="health" value="0">
            </div>
        </div>

        <!-- 그룹 B: 장비별 입력 -->
        <div class="group" id="group-b">
            <h2>그룹 B: 장비</h2>
            <div id="equipment-list">
                <!-- 여러 장비 항목이 여기에 포함됨 -->
            </div>
        </div>

        <!-- 그룹 C: 고정 부위 -->
        <div class="group" id="group-c">
            <h2>그룹 C: 고정 수치</h2>
            <!-- 여러 고정 수치 항목이 여기에 포함됨 -->
        </div>

        <!-- 결과 출력 -->
        <div class="group" id="result">
            <h2>결과</h2>
            <div class="input-field">
                <label>총 방어구 관통:</label>
                <span id="total-penetration">0</span>
            </div>
        </div>
    </div>

    <script>
        // 계산 함수
        const calculate = () => {
            // 그룹 A 계산
            const strength = parseFloat(document.getElementById('strength').value) || 0;
            const agility = parseFloat(document.getElementById('agility').value) || 0;
            const intelligence = parseFloat(document.getElementById('intelligence').value) || 0;
            const wisdom = parseFloat(document.getElementById('wisdom').value) || 0;
            const health = parseFloat(document.getElementById('health').value) || 0;
            const groupASum = strength + agility + intelligence + wisdom + health;

            // 그룹 B 계산
            let groupBTotal = 0;
            document.querySelectorAll('#equipment-list .input-field').forEach(field => {
                const fixed = parseFloat(field.querySelector('input[placeholder="고정값"]').value) || 0;
                const percent = parseFloat(field.querySelector('input[placeholder="퍼센트값"]').value) || 0;
                groupBTotal += fixed * (1 + percent / 100);
            });

            // 그룹 C 계산
            let groupCFixedTotal = 0;
            let groupCPercent = 0;
            document.querySelectorAll('#group-c .input-field input').forEach(input => {
                const id = input.id;
                if (id.includes("percent")) {
                    groupCPercent += parseFloat(input.value) || 0;
                } else {
                    groupCFixedTotal += parseFloat(input.value) || 0;
                }
            });

            // 최종 계산
            const totalPenetration = (groupBTotal * (1 + groupCPercent / 100)) + groupASum + groupCFixedTotal;

            // 결과 업데이트
            document.getElementById('total-penetration').innerText = totalPenetration.toFixed(2);
        };

        // 이벤트 리스너 추가
        document.querySelectorAll('input').forEach(input => {
            input.addEventListener('input', calculate);
        });
    </script>
</body>
</html>
