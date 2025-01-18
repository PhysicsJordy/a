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
        const id = input.id.toLowerCase();
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
