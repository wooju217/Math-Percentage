
function openGitHub() {
    window.open("https://github.com/wooju217");
}

var level = 0;
var lastequ = "";

function InitCanvas() {
    var canvas = document.getElementById('canvas');
    var ctx = canvas.getContext('2d');

    var errorTxt = document.getElementById('error');
        errorTxt.style.display = "none";

    try {
        
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        var centerX = Math.floor(canvas.width / 2);
        var centerY = Math.floor(canvas.height / 2);
        var gridSize = 10;

        // 그리드 그리기
        ctx.beginPath();
        for (var x = gridSize; x < canvas.width; x += gridSize) {
            ctx.moveTo(x, 0);
            ctx.lineTo(x, canvas.height);
        }
        for (var y = gridSize; y < canvas.height; y += gridSize) {
            ctx.moveTo(0, y);
            ctx.lineTo(canvas.width, y);
        }
        ctx.strokeStyle = 'lightgray';
        ctx.stroke();

        // x축과 y축 그리기
        ctx.beginPath();
        ctx.moveTo(0, centerY);
        ctx.lineTo(canvas.width, centerY);
        ctx.moveTo(centerX, 0);
        ctx.lineTo(centerX, canvas.height);
        ctx.strokeStyle = 'black';
        ctx.stroke();

        // 사용자로부터 도형의 방정식 입력 받기
        var input = document.getElementById("equInput");
        var equation = input.value;
        if (equation != lastequ) {
            lastequ = equation;
            level = 0;
        }

        // 도형 그리기
        ctx.beginPath();
        if (isCircleEquation(equation)) {
            drawCircle();
        } else {
            evalEquation();
        }
        ctx.strokeStyle = 'red';
        ctx.stroke();

        // 원의 방정식 여부 확인 및 반지름 가져오기
        function isCircleEquation(equation) {
            // x^2과 y^2이 존재하고 xy 계수가 없는 경우 원의 방정식으로 판단
            var hasX2Term = equation.includes("x*x") || equation.includes("x^2");
            var hasY2Term = equation.includes("y*y") || equation.includes("y^2");
            var hasXYTerm = equation.includes("xy") || equation.includes("x*y");
            return hasX2Term && hasY2Term && !hasXYTerm;
        }

        // 원 그리기
        function drawCircle() {
            // 원의 반지름 추출
            var radius = getCircleRadius(equation);

            // 원 그리기
            ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);

            // 반지름 그리기
            //ctx.moveTo(centerX, centerY);
            ctx.lineTo(centerX + radius, centerY);
        }

        // 원의 반지름 추출
        function getCircleRadius(equation) {
            // 방정식에서 반지름 값 추출
            var radius = 0;
            var regex = /(?<=\=\s*)[\d()\-]+(?=$|\s*\))/g;
            var matches = equation.match(regex);
            if (matches && matches.length > 0) {
                radius = eval(matches[0]);
            }
            return Math.sqrt(Math.abs(radius)) * gridSize;
        }

        // 도형 그리기 (일반 방정식)
        function evalEquation() {
            var minX = -Math.floor(centerX / gridSize);
            var maxX = Math.floor(centerX / gridSize);
            var step = 0.1; // 작은 증가 간격으로 조정

            var x = minX;
            var y = calculateY(x);
            ctx.moveTo(centerX + x * gridSize, centerY - y * gridSize);

            for (x = minX + step; x <= maxX; x += step) {
                y = calculateY(x);
                ctx.lineTo(centerX + x * gridSize, centerY - y * gridSize);
            }
        }

        // x에 대한 y값 계산 함수
        function calculateY(x) {
            // 입력된 방정식에서 x에 대한 y 값을 계산합니다.
            if(isCircleEquation(equation))
            {
                var y = Math.pow(getCircleRadius(equation)/gridSize,2)- Math.pow(x,2);
                return Math.sqrt(y);
            }
            else
            {
                var parsedEquation = equation.replace(/x\*x/g, 'Math.pow(x, 2)');
            parsedEquation = parsedEquation.replace(/y\*y/g, 'Math.pow(y, 2)');
            return eval(parsedEquation);
            }
            
        }

        dot_y = calculateY(level);
        ctx.beginPath();
        ctx.arc(centerX + level * gridSize, centerY - dot_y * gridSize, 3, 0, 2 * Math.PI);
        ctx.fillStyle = 'blue';
        ctx.fill();

        var stat = document.getElementById('stat')
        var percent = (dot_y / 20) * 100;

        stat.textContent = "현재 아이템 레벨(x): " + level + "레벨, y: " + dot_y.toFixed(2) + ", 파괴확률: " + percent.toFixed(2) + "%";

        level++;
    }
    catch (error) {
        var errorTxt = document.getElementById('error');
        errorTxt.style.display = "block";
        errorTxt.textContent = "에러: " +error;
        console.log(error);
    }



}