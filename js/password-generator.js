// 字符集定义
const charSets = {
    uppercase: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
    lowercase: 'abcdefghijklmnopqrstuvwxyz',
    numbers: '0123456789',
    symbols: '!@#$%^&*()_+-=[]{}|;:,.<>?'
};

// 相似字符映射
const similarChars = {
    '0': 'O',
    'O': '0',
    '1': 'l',
    'l': '1'
};

// DOM 元素
const passwordOutput = document.getElementById('passwordOutput');
const copyButton = document.getElementById('copyButton');
const generateButton = document.getElementById('generateButton');
const passwordLength = document.getElementById('passwordLength');
const lengthValue = document.getElementById('lengthValue');
const uppercaseCheckbox = document.getElementById('uppercase');
const lowercaseCheckbox = document.getElementById('lowercase');
const numbersCheckbox = document.getElementById('numbers');
const symbolsCheckbox = document.getElementById('symbols');
const excludeSimilarCheckbox = document.getElementById('excludeSimilar');
const strengthFill = document.getElementById('strengthFill');
const strengthText = document.getElementById('strengthText');
const entropyValue = document.getElementById('entropyValue');
const passwordHistory = document.getElementById('passwordHistory');

// 密码历史记录
let history = [];

// 事件监听器
passwordLength.addEventListener('input', updateLengthValue);
generateButton.addEventListener('click', generatePassword);
copyButton.addEventListener('click', copyPassword);

// 更新长度显示
function updateLengthValue() {
    lengthValue.textContent = passwordLength.value;
}

// 生成随机数
function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// 获取可用的字符集
function getAvailableChars() {
    let chars = '';
    if (uppercaseCheckbox.checked) chars += charSets.uppercase;
    if (lowercaseCheckbox.checked) chars += charSets.lowercase;
    if (numbersCheckbox.checked) chars += charSets.numbers;
    if (symbolsCheckbox.checked) chars += charSets.symbols;
    return chars;
}

// 计算密码强度
function calculateStrength(password) {
    let strength = 0;
    let entropy = 0;
    const length = password.length;
    
    // 检查字符类型
    if (/[A-Z]/.test(password)) strength += 1;
    if (/[a-z]/.test(password)) strength += 1;
    if (/[0-9]/.test(password)) strength += 1;
    if (/[^A-Za-z0-9]/.test(password)) strength += 1;
    
    // 计算熵值
    const uniqueChars = new Set(password).size;
    entropy = Math.log2(uniqueChars) * length;
    
    return {
        strength: Math.min(strength, 4),
        entropy: Math.round(entropy)
    };
}

// 更新强度指示器
function updateStrengthIndicator(password) {
    const { strength, entropy } = calculateStrength(password);
    
    // 更新强度条
    const strengthPercent = (strength / 4) * 100;
    strengthFill.style.width = `${strengthPercent}%`;
    
    // 更新颜色
    const colors = {
        0: '#e74c3c',
        1: '#f1c40f',
        2: '#2ecc71',
        3: '#2ecc71',
        4: '#2ecc71'
    };
    strengthFill.style.backgroundColor = colors[strength];
    
    // 更新文本
    const strengthLabels = ['非常弱', '弱', '中等', '强', '非常强'];
    strengthText.textContent = `密码强度：${strengthLabels[strength]}`;
    entropyValue.textContent = `熵值：${entropy} 位`;
}

// 生成密码
function generatePassword() {
    const length = parseInt(passwordLength.value);
    let chars = getAvailableChars();
    
    if (!chars) {
        alert('请至少选择一种字符类型！');
        return;
    }
    
    // 如果排除相似字符，从字符集中移除
    if (excludeSimilarCheckbox.checked) {
        Object.keys(similarChars).forEach(char => {
            chars = chars.replace(new RegExp(char, 'g'), '');
        });
    }
    
    let password = '';
    const charArray = chars.split('');
    
    // 确保至少包含每种选定的字符类型
    if (uppercaseCheckbox.checked) {
        password += charSets.uppercase[getRandomInt(0, charSets.uppercase.length - 1)];
    }
    if (lowercaseCheckbox.checked) {
        password += charSets.lowercase[getRandomInt(0, charSets.lowercase.length - 1)];
    }
    if (numbersCheckbox.checked) {
        password += charSets.numbers[getRandomInt(0, charSets.numbers.length - 1)];
    }
    if (symbolsCheckbox.checked) {
        password += charSets.symbols[getRandomInt(0, charSets.symbols.length - 1)];
    }
    
    // 填充剩余长度
    while (password.length < length) {
        password += charArray[getRandomInt(0, charArray.length - 1)];
    }
    
    // 打乱密码字符顺序
    password = password.split('').sort(() => Math.random() - 0.5).join('');
    
    // 更新显示
    passwordOutput.value = password;
    updateStrengthIndicator(password);
    
    // 添加到历史记录
    addToHistory(password);
}

// 复制密码
function copyPassword() {
    passwordOutput.select();
    document.execCommand('copy');
    
    // 显示复制成功提示
    const originalText = copyButton.textContent;
    copyButton.textContent = '已复制！';
    setTimeout(() => {
        copyButton.textContent = originalText;
    }, 2000);
}

// 添加到历史记录
function addToHistory(password) {
    const timestamp = new Date().toLocaleString();
    history.unshift({ password, timestamp });
    
    // 限制历史记录数量
    if (history.length > 10) {
        history.pop();
    }
    
    // 更新显示
    updateHistoryDisplay();
}

// 更新历史记录显示
function updateHistoryDisplay() {
    passwordHistory.innerHTML = history.map(item => `
        <div class="history-item">
            <span class="password">${item.password}</span>
            <span class="timestamp">${item.timestamp}</span>
        </div>
    `).join('');
}

// 初始化
passwordLength.value = 12;
lengthValue.textContent = '12';
generatePassword(); 