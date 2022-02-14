var cur_question;
var right_answers_count = 0;

var answers = ['answer1', 'answer2', 'answer3', 'answer4'];
var right_answer = [false, false, false, false];

var data;

function readTextFile(file, callback) {
    var rawFile = new XMLHttpRequest();
    rawFile.overrideMimeType("application/json");
    rawFile.open("GET", file, true);
    rawFile.onreadystatechange = function () {
        if (rawFile.readyState === 4 && rawFile.status == "200") {
            callback(rawFile.responseText);
        }
    }
    rawFile.send(null);
}

function OnLoad() {
    readTextFile("json/valentin_test.json", function (text) {
        data = JSON.parse(text);
        document.getElementById("start_text").innerHTML = data.StartText;
        var dir = data.TestName ? data.TestName : ""
        var image = data.StartImage ? data.StartImage : "default.png";
        document.getElementById("start_image").src = "images/" + dir + "/" + image;
    });
}

function RunTest() {
    right_answers_count = 0;
    cur_question = -1;
    NextQuestion();

    HideStartBlock();
    ShowTestBlock();
    HideNextButton();
    HideResultBlock();
}

function HideResultBlock() {
    document.getElementById("result_div").style.display = 'none';
}

function HideNextButton() {
    document.getElementById("next_button").style.display = 'none';
}

function HideStartBlock() {
    document.getElementById("start_div").style.display = 'none';
}

function ShowTestBlock() {
    document.getElementById("main_div").style.display = 'block';
}

function OnAnswer(answer_id) {
    if (CheckAnswer(answer_id)) {
        ShowRightAnswer(answer_id);
        ++right_answers_count;
    }
    else {
        ShowWrongAnswer(answer_id);
        for (i = 0; i < 4; ++i) {
            if (CheckAnswer(i))
                ShowRightAnswer(i);
        }
    }
    ShowNextButton();
    EnableAnswerButtons(false);
}

function ShowNextButton() {
    var next_button = document.getElementById("next_button");
    next_button.style.display = 'inline';
    if (cur_question + 1 == data.Questions.length)
        next_button.innerHTML = "ПОКАЗАТЬ РЕЗУЛЬТАТ";
}

function OnNext() {
    NextQuestion();
    HideNextButton();
    EnableAnswerButtons(true);
}

function HideNextButton() {
    document.getElementById("next_button").style.display = 'none';
}

function NextQuestion() {
    ++cur_question;
    if (cur_question >= data.Questions.length) {
        StopTest();
        return;
    }

    var num = cur_question + 1;
    var num_text = num + '/' + data.Questions.length;
    document.getElementById("question_number").innerHTML = num_text;

    document.getElementById("question").innerHTML = data.Questions[cur_question].Q;

    document.getElementById("answers").style.visibility = 'visible';
    document.getElementById("answer1").innerHTML = data.Questions[cur_question].A1.Text;
    document.getElementById("answer2").innerHTML = data.Questions[cur_question].A2.Text;
    document.getElementById("answer3").innerHTML = data.Questions[cur_question].A3.Text;
    document.getElementById("answer4").innerHTML = data.Questions[cur_question].A4.Text;

    right_answer[0] = data.Questions[cur_question].A1.IsRight;
    right_answer[1] = data.Questions[cur_question].A2.IsRight;
    right_answer[2] = data.Questions[cur_question].A3.IsRight;
    right_answer[3] = data.Questions[cur_question].A4.IsRight;

    for (let i = 0; i < 4; i++) {
        document.getElementById(answers[i]).style.background = 'white';
    }
}

function CheckAnswer(answer_id) {
    return right_answer[answer_id];
}

function ShowRightAnswer(answer_id) {
    document.getElementById(answers[answer_id]).style.background = 'yellowgreen';
}

function ShowWrongAnswer(answer_id) {
    document.getElementById(answers[answer_id]).style.background = 'red';
}

function StopTest() {
    HideTestBlock();
    ShowResult();
}

function ShowResult() {
    var result_div = document.getElementById("result_div");
    result_div.style.display = 'block';
    result_div.style.visibility = 'visible';
    document.getElementById("result").innerHTML = "Ваш результат: " + right_answers_count + "/" + data.Questions.length;

    var result_text = "";
    for (i = data.Result.length - 1; i >= 0; --i)
        if (right_answers_count >= data.Result[i].From) {
            result_text = data.Result[i].Text;
            break;
        }

    document.getElementById("result_text").innerHTML = result_text;

    if (data.Result[i].Image) {
        var dir = data.TestName ? data.TestName : ""
        var file = "/images/" + dir + "/" + data.Result[i].Image;
        document.getElementById("result_div").style.backgroundImage = "url(" + file + ")";
    }

}

function HideTestBlock() {
    document.getElementById("main_div").style.display = 'none';
}

function EnableAnswerButtons(enable) {
    for (i = 0; i < 4; ++i) {
        var button = document.getElementById(answers[i]);
        button.disabled = !enable;
    }
}
