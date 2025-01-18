// Function to calculate total stats and armor penetration
const calculate = () => {
    // Group A calculations
    const strength = parseFloat(document.getElementById('strength').value) || 0;
    const agility = parseFloat(document.getElementById('agility').value) || 0;
    const intelligence = parseFloat(document.getElementById('intelligence').value) || 0;
    const wisdom = parseFloat(document.getElementById('wisdom').value) || 0;
    const health = parseFloat(document.getElementById('health').value) || 0;

    const groupASum = strength + agility + intelligence + wisdom + health;
    const statPenetration = groupASum / 100;

    // Group B calculations
    let groupBTotal = 0;
    document.querySelectorAll('#equipment-list .input-field').forEach(field => {
        const fixed = parseFloat(field.querySelector('input[placeholder="Fixed"]').value) || 0;
        const percent = parseFloat(field.querySelector('input[placeholder="%"]').value) || 0;
        groupBTotal += fixed * (1 + percent / 100);
    });

    // Group C calculations
    let groupCTotal = 0;
    document.querySelectorAll('#group-c .input-field input').forEach(input => {
        groupCTotal += parseFloat(input.value) || 0;
    });

    // Total calculation
    const totalPenetration = (groupBTotal * (1)) + groupASum + groupCTotal;

    // Update result
    document.getElementById('total-penetration').innerText = totalPenetration.toFixed(2);
};

// Attach event listeners to all input fields
document.querySelectorAll('input').forEach(input => {
    input.addEventListener('input', calculate);
});

