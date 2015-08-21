var start, stop, solveIndex, isTiming = 0, updateTimer = 0, allowedToUpdate = 0, typingComment = 0, modalOpen = 0, fired = 0, switchingSession = 0, scrambleType = 3, scrambleLength = 20, sessionNumber = 1, solvesAttempted, solvesCompleted, sessionMean, sessionBest, sessionWorst;

angular.module('gjTimer', []).controller('gjController', function($scope) {

});

$(document).ready(function()
{
	if (localStorage.getItem("sessionNumber") == null)
		localStorage.setItem("sessionNumber", sessionNumber);
	else
		sessionNumber = localStorage.getItem("sessionNumber");
	if (localStorage.getItem("scrambleType") == null)
		localStorage.setItem("scrambleType", scrambleType);
	else
		scrambleType = localStorage.getItem("scrambleType");
	if (localStorage.getItem("scrambleLength") == null)
		localStorage.setItem("scrambleLength", scrambleLength);
	else
		scrambleLength = localStorage.getItem("scrambleLength");
	for (i = 1; i <= 20; i++)
		if (localStorage.getItem("session" + i) == null)
			localStorage.setItem("session" + i, JSON.stringify({sessionNumber: i, scrambleType: 3, scrambleLength: 20, numSolves: 0, list: []}));
	$("#timer").html("0.00<small>0</small>");
	printTimes();
	$("#myModal").on("shown.bs.modal", function () {
  		modalOpen = 1;
		$("#resetAllButton").click(function () {
 			if (confirm("Reset All Sessions?"))
			{
				localStorage.clear();
				location.reload();
			}
 		});
 		$("#cancelButton").click(function () {
			$("#myModal").modal("hide");
		});
		$("#confirmResetButton").click(function () {
			$("#myModal").modal("toggle");
			var newSession = {sessionNumber: i, scrambleType: scrambleType, scrambleLength: scrambleLength, numSolves: 0, list: []};
			localStorage.setItem("session" + sessionNumber, JSON.stringify(newSession));
			printTimes();
			$("#timer").html("0.00<small>0</small>");
		});
	});
	$("#myModal").on("hidden.bs.modal", function () {
  		modalOpen = 0;
	});
	$("#sessionDropdownButton").html("Session " + sessionNumber + " <span class=\"caret\"></span>");
	$("#sessionDropdownMenu li a").click(function(){
    	$("#sessionDropdownButton").html($(this).text() + " <span class=\"caret\"></span>").val($(this).text());
    	switch ($(this).text())
    	{
			case "Session 1": sessionNumber = 1; break;
			case "Session 2": sessionNumber = 2; break;
			case "Session 3": sessionNumber = 3; break;
			case "Session 4": sessionNumber = 4; break;
			case "Session 5": sessionNumber = 5; break;
			case "Session 6": sessionNumber = 6; break;
			case "Session 7": sessionNumber = 7; break;
			case "Session 8": sessionNumber = 8; break;
			case "Session 9": sessionNumber = 9; break;
			case "Session 10": sessionNumber = 10; break;
			case "Session 11": sessionNumber = 11; break;
			case "Session 12": sessionNumber = 12; break;
			case "Session 13": sessionNumber = 13; break;
			case "Session 14": sessionNumber = 14; break;
			case "Session 15": sessionNumber = 15; break;
			case "Session 16": sessionNumber = 16; break;
			case "Session 17": sessionNumber = 17; break;
			case "Session 18": sessionNumber = 18; break;
			case "Session 19": sessionNumber = 19; break;
			case "Session 20": sessionNumber = 20; break;
    	}
    	if (scrambleType == 2)
			$("#scramble2x2").focus();
		else if (scrambleType == 3)
			$("#scramble3x3").focus();
		else if (scrambleType == 4)
			$("#scramble4x4").focus();
		else if (scrambleType == 5)
			$("#scramble5x5").focus();
		else if (scrambleType == 6)
			$("#scramble6x6").focus();
		else if (scrambleType == 7)
			$("#scramble7x7").focus();
		else
			$("#scramble3x3").focus();
    	localStorage.setItem("sessionNumber", sessionNumber);
    	switchingSession = 1;
		$("#timer").html("0.00<small>0</small>");
    	printScramble();
    	printTimes();
	});
	$("#statsButton").click(function () {
		updateSessionInfo();
		var sessionObj = JSON.parse(localStorage.getItem("session" + sessionNumber)), bestAvg5 = "DNF", bestAvg12 = "DNF", currentMo3 = "DNF", bestMo3 = "DNF", currentAvg50 = "DNF", currentAvg100 = "DNF", bestAvg50 = calculateBestAverageOfN(sessionObj.list, 50), bestAvg100 = calculateBestAverageOfN(sessionObj.list, 100);
		if (sessionObj.numSolves >= 3)
			currentMo3 = convertToTime(calculateMeanOf3(sessionObj.list[sessionObj.numSolves - 1], sessionObj.list[sessionObj.numSolves - 2], sessionObj.list[sessionObj.numSolves - 3]));
		if (sessionObj.numSolves >= 50)
			currentAvg50 = calculateAverageOfN(sessionObj.list.slice(sessionObj.numSolves - 50, sessionObj.numSolves));
		if (sessionObj.numSolves >= 100)
			currentAvg100 = calculateAverageOfN(sessionObj.list.slice(sessionObj.numSolves - 100, sessionObj.numSolves));
		for (i = 0; i < sessionObj.numSolves; i++)
		{
			if (i >= 2)
			{
				var tempMo3 = calculateMeanOf3(sessionObj.list[i], sessionObj.list[i - 1], sessionObj.list[i - 2]);
				if (((bestMo3 == "DNF") && (tempMo3 != "DNF")) || (+tempMo3 < +bestMo3))
					bestMo3 = tempMo3;
			}
			var currentAvg5 = convertToNumber(sessionObj.list[i].avg5), currentAvg12 = convertToNumber(sessionObj.list[i].avg12);
			if (((bestAvg5 == "DNF") && (currentAvg5 != "DNF")) || (+currentAvg5 < +bestAvg5))
				bestAvg5 = currentAvg5;
			if (((bestAvg12 == "DNF") && (currentAvg12 != "DNF")) || (+currentAvg12 < +bestAvg12))
				bestAvg12 = currentAvg12;
		}
		var bestMo3Converted = convertToTime(bestMo3), bestAvg5Converted = convertToTime(bestAvg5), bestAvg12Converted = convertToTime(bestAvg12);
		$("#myModal").css("top","15%");
		$("#myModalTitle").text("Statistics");
		$("#myModalFooter").html("<p>" + (new Date()).toLocaleString() + "</p>");
		$("#myModalBody").html("<div class=\"container\"><div class=\"row\" id=\"statsRow\"><div class=\"col-xs-2\"><b>Solves: " + solvesCompleted + "/" + solvesAttempted + "</div></b><div class=\"col-xs-2\"><b>Mean: " + sessionMean + "</b></div></div><div class=\"row\" id=\"statsRow\"><div class=\"col-xs-2\"><b>Best: " + sessionBest + "</div></b><div class=\"col-xs-2\"><b>Worst: " + sessionWorst + "</b></div></div></div><div class=\"table-responsive\"><table class=\"table table-bordered table-hover\" id=\"statsTable\"><thead><th></th><th>Current</th><th>Best</th></thead><tbody><tr><td>Mean of 3</td><td>" + currentMo3 + "</td><td>" + bestMo3Converted + "</td></tr><tr><td>Average of 5</td><td>" + sessionObj.list[sessionObj.numSolves - 1].avg5 + "</td><td>" + bestAvg5Converted + "</td></tr><tr><td>Average of 12</td><td>" + sessionObj.list[sessionObj.numSolves - 1].avg12 + "</td><td>" + bestAvg12Converted + "</td></tr><tr><td>Average of 50</td><td>" + currentAvg50 + "</td><td>" + bestAvg50 + "</td></tr><tr><td>Average of 100</td><td>" + currentAvg100 + "</td><td>" + bestAvg100 + "</td></tr></tbody></table></div>");
	});
	$("#resetButton").click(function () {
		$("#myModal").css("top","30%");
		$("#myModalTitle").text("Reset");
		$("#myModalBody").html("Reset Session " + sessionNumber + "?");
		$("#myModalFooter").html("<button type=\"button\" class=\"btn btn-default\" id=\"cancelButton\">Cancel</button><button type=\"button\" class=\"btn btn-danger\" id=\"confirmResetButton\">Reset</button>");
		$("#resetButton").blur();
	});
	$("#scramble2x2").click(function () {
		scrambleType = 2;
		scrambleLength = 10;
		var sessionObj = JSON.parse(localStorage.getItem("session" + sessionNumber));
		sessionObj.scrambleType = 2;
		sessionObj.scrambleLength = 10;
		localStorage.setItem("session" + sessionNumber, JSON.stringify(sessionObj));
		$("#scrambleLength").val(scrambleLength);
		$("#scramble").text(generate2x2Scramble(scrambleLength)).css('font-size','18pt');
		localStorage.setItem("scrambleType", scrambleType);
		localStorage.setItem("scrambleLength", scrambleLength);
	});
	$("#scramble3x3").click(function () {
		scrambleType = 3;
		scrambleLength = 20;
		var sessionObj = JSON.parse(localStorage.getItem("session" + sessionNumber));
		sessionObj.scrambleType = 3;
		sessionObj.scrambleLength = 20;
		localStorage.setItem("session" + sessionNumber, JSON.stringify(sessionObj));
		$("#scrambleLength").val(scrambleLength);
		$("#scramble").text(generate3x3Scramble(scrambleLength)).css('font-size','18pt');
		localStorage.setItem("scrambleType", scrambleType);
		localStorage.setItem("scrambleLength", scrambleLength);
	});
	$("#scramble4x4").click(function () {
		scrambleType = 4;
		scrambleLength = 40;
		var sessionObj = JSON.parse(localStorage.getItem("session" + sessionNumber));
		sessionObj.scrambleType = 4;
		sessionObj.scrambleLength = 40;
		localStorage.setItem("session" + sessionNumber, JSON.stringify(sessionObj));
		$("#scrambleLength").val(scrambleLength);
		$("#scramble").text(generate4x4Scramble(scrambleLength)).css('font-size','18pt');
		localStorage.setItem("scrambleType", scrambleType);
		localStorage.setItem("scrambleLength", scrambleLength);
	});
	$("#scramble5x5").click(function () {
		scrambleType = 5;
		scrambleLength = 60;
		var sessionObj = JSON.parse(localStorage.getItem("session" + sessionNumber));
		sessionObj.scrambleType = 5;
		sessionObj.scrambleLength = 60;
		localStorage.setItem("session" + sessionNumber, JSON.stringify(sessionObj));
		$("#scrambleLength").val(scrambleLength);
		$("#scramble").text(generate5x5Scramble(scrambleLength)).css('font-size','18pt');
		localStorage.setItem("scrambleType", scrambleType);
		localStorage.setItem("scrambleLength", scrambleLength);
	});
	$("#scramble6x6").click(function () {
		scrambleType = 6;
		scrambleLength = 80;
		var sessionObj = JSON.parse(localStorage.getItem("session" + sessionNumber));
		sessionObj.scrambleType = 6;
		sessionObj.scrambleLength = 80;
		localStorage.setItem("session" + sessionNumber, JSON.stringify(sessionObj));
		$("#scrambleLength").val(scrambleLength);
		$("#scramble").text(generate6x6Scramble(scrambleLength)).css('font-size','16pt');
		localStorage.setItem("scrambleType", scrambleType);
		localStorage.setItem("scrambleLength", scrambleLength);
	});
	$("#scramble7x7").click(function () {
		scrambleType = 7;
		scrambleLength = 100;
		var sessionObj = JSON.parse(localStorage.getItem("session" + sessionNumber));
		sessionObj.scrambleType = 7;
		sessionObj.scrambleLength = 100;
		localStorage.setItem("session" + sessionNumber, JSON.stringify(sessionObj));
		$("#scrambleLength").val(scrambleLength);
		$("#scramble").text(generate7x7Scramble(scrambleLength)).css('font-size','14pt');
		localStorage.setItem("scrambleType", scrambleType);
		localStorage.setItem("scrambleLength", scrambleLength);
	});
	$("#newScrambleButton").click(function () {
		scrambleLength = $("#scrambleLength").val();
		localStorage.setItem("scrambleType", scrambleType);
		localStorage.setItem("scrambleLength", scrambleLength);
		localStorage.setItem("scramble", $("#scramble").text());
		localStorage.setItem("scrambleType", scrambleType);
		printScramble();
	});
 	$("#optionsButton").click(function () {
 		$("#myModal").css("top","30%");
		$("#myModalTitle").html("Options <small> (This feature is currently under devlopment)</small>");
		$("#myModalBody").html("<button type=\"button\" class=\"btn btn-danger\" id=\"resetAllButton\">Reset All Sessions</button>");;
 		$("#myModalFooter").html("<p>" + new Date() + "</p>");
 	});
	var dt, timeElapsed, minutes, seconds, milliseconds, dtElapsed;
	printScramble();
	$(document).on("keydown", function (e)
	{
		if ((e.keyCode == 32) && (modalOpen == 0))
		{
			$("#scrambleLength").blur();
			e.preventDefault();
			if ((isTiming == 0) && (typingComment == 0))
			{
				$("#timer").css("color", "#2EB82E");
				setTimeout(function () {
					$("body").css("background-color", "rgba(0, 0 , 0, 0.8)");
					$("#tableDiv").hide();
					$("#scramble2x2").attr("disabled", "true");
					$("#scramble3x3").attr("disabled", "true");
					$("#scramble4x4").attr("disabled", "true");
					$("#scramble5x5").attr("disabled", "true");
					$("#scramble6x6").attr("disabled", "true");
					$("#scramble7x7").attr("disabled", "true");
					$("#scrambleLength").attr("disabled", "true");
					$("#newScrambleButton").attr("disabled", "true");
					$("#optionsButton").attr("disabled", "true");
				}, 50);
			}
		}
		if (((e.keyCode === 13) && (typingComment == 0)) && (modalOpen == 0))
		{
			e.preventDefault();
			scrambleLength = $("#scrambleLength").val();
			localStorage.setItem("scrambleType", scrambleType);
			localStorage.setItem("scrambleLength", scrambleLength);
			var sessionObj = JSON.parse(localStorage.getItem("session" + sessionNumber));
			sessionObj.scrambleLength = scrambleLength;
			localStorage.setItem("session" + sessionNumber, JSON.stringify(sessionObj));
			$("#scrambleLength").blur();
			printScramble();
		}
		if ((allowedToUpdate == 1) && (modalOpen == 0))
		{
			$("body").css("background-color", "white");
			$("#tableDiv").show();
			$("#scramble2x2").removeAttr("disabled");
			$("#scramble3x3").removeAttr("disabled");
			$("#scramble4x4").removeAttr("disabled");
			$("#scramble5x5").removeAttr("disabled");
			$("#scramble6x6").removeAttr("disabled");
			$("#scramble7x7").removeAttr("disabled");
			$("#scrambleLength").removeAttr("disabled");
			$("#newScrambleButton").removeAttr("disabled");
			$("#optionsButton").removeAttr("disabled");
			updateTimer = 0;
			allowedToUpdate = 0;
			stop = new Date();
			dtElapsed = stop - start;
			milliseconds = (dtElapsed % 1000);
			seconds = Math.floor(dtElapsed / 1000) % 60;
			minutes = Math.floor(((dtElapsed / 1000) / 60) % 60);
			milliseconds = pad3(milliseconds);
			if (minutes == 0)
				timeElapsed = seconds + "." + milliseconds;
			else
			{
				seconds = pad2(seconds);
				timeElapsed = minutes + ":" + seconds + "." + milliseconds;
			}
    		var split = splitTime(seconds + "." + milliseconds);
    		if (minutes == 0)
    			$("#timer").html(split[0] + "<small>" + split[1] + "</small>");
    		else
    			$("#timer").html(minutes + ":" + split[0] + "<small>" + split[1] + "</small>");
			var solveObj = {time: timeElapsed, avg5: "DNF", avg12: "DNF", scramble: $("#scramble").text(), date: stop, penalty: 0, comment: ""};
			var sessionObj = JSON.parse(localStorage.getItem("session" + sessionNumber));
			sessionObj.numSolves += 1;
			sessionObj.list.push(solveObj);
			localStorage.setItem("session" + sessionNumber, JSON.stringify(sessionObj));
			localStorage.setItem(pad2(localStorage.length + 1), timeElapsed);
			printTimes();
			printScramble();
		}
	});
	$(document).on("keyup", function (e)
	{
		if ((e.keyCode === 32) && (typingComment == 0) && (modalOpen == 0))
		{
			if (isTiming == 0)
			{
				$("#timer").css("color", "black");
				isTiming = 1;
				updateTimer = 1;
				allowedToUpdate = 1;
				start = new Date();
				updateTime();
			}
			else
				isTiming = 0;
		}
	});
});

function updateTime()
{
	var elapsed = new Date() - start, milliseconds = (elapsed % 1000), seconds = Math.floor(elapsed / 1000) % 60, minutes = Math.floor(((elapsed / 1000) / 60) % 60), milliseconds = pad3(milliseconds);			
	if (minutes == 0)
		timeElapsed = seconds + "." + milliseconds;
	else
	{
		seconds = pad2(seconds);
		timeElapsed = minutes + ":" + seconds + "." + milliseconds;
	}
    if (updateTimer == 1)
    {
    	var split = splitTime(seconds + "." + milliseconds);
    	if (minutes == 0)
    		$("#timer").html(split[0] + "<small>" + split[1] + "</small>");
    	else
    		$("#timer").html(minutes + ":" + split[0] + "<small>" + split[1] + "</small>");
    }
    setTimeout(updateTime, 50);
}

function printScramble()
{
	var sessionObj = JSON.parse(localStorage.getItem("session" + sessionNumber)), printNew = 1;
	$("#scrambleLength").val(sessionObj.scrambleLength);
	if ((switchingSession == 1) && (scrambleType == sessionObj.scrambleType) && (scrambleLength == sessionObj.scrambleLength))
		printNew = 0;
	switchingSession = 0;
	scrambleType = sessionObj.scrambleType;
	scrambleLength = sessionObj.scrambleLength;
	if (scrambleType == 2)
	{
		$("#scramble2x2").focus();
		if (printNew == 1)
			$("#scramble").text(generate2x2Scramble(scrambleLength)).css('font-size','18pt');
	}
	else if (scrambleType == 4)
	{
		$("#scramble4x4").focus();
		if (printNew == 1)
			$("#scramble").text(generate4x4Scramble(scrambleLength)).css('font-size','18pt');
	}
	else if (scrambleType == 5)
	{
		$("#scramble5x5").focus();
		if (printNew == 1)
			$("#scramble").text(generate5x5Scramble(scrambleLength)).css('font-size','18pt');
	}
	else if (scrambleType == 6)
	{
		$("#scramble6x6").focus();
		if (printNew == 1)
			$("#scramble").text(generate6x6Scramble(scrambleLength)).css('font-size','16pt');
	}
	else if (scrambleType == 7)
	{
		$("#scramble7x7").focus();
		if (printNew == 1)
			$("#scramble").text(generate7x7Scramble(scrambleLength)).css('font-size','14pt');
	}
	else
	{
		$("#scramble3x3").focus();
		if (printNew == 1)
			$("#scramble").text(generate3x3Scramble(scrambleLength)).css('font-size','18pt');
	}
}

function printTimes()
{
	updateAverages();
	updateSessionInfo();
	$("#times").text("");
	var sessionObj = JSON.parse(localStorage.getItem("session" + sessionNumber)), dataContent = "<div class=\"btn-toolbar\" role=\"toolbar\" aria-label=\"...\"><div class=\"btn-group btn-group-xs\" role=\"group\" aria-label=\"...\"><button type=\"button\" class=\"btn btn-success\" id=\"okButton\">OK</button><button type=\"button\" class=\"btn btn-warning\" id=\"plus2Button\">+2</button><button type=\"button\" class=\"btn btn-danger\" id=\"DNFButton\">DNF</button></div><div class=\"btn-group btn-group-xs\" role=\"group\" aria-label=\"...\"><button type=\"button\" class=\"btn btn-default\" id=\"deleteButton\">X</button></div></div>";
	$("#" + this.id).attr("data-content", dataContent);
	for (var i = 0; i < sessionObj.numSolves; i++)
	{
		var penalizedTime = convertToTime(+convertToNumber(sessionObj.list[i].time) + 2);
		var timeFormatted = splitTime(sessionObj.list[i].time)[0];
		var penalizedTimeFormatted = splitTime(penalizedTime)[0];
		var tableHtml = "<tr>\n<td>" + (i + 1) + "</td>\n<td class=\"timesCell\" id=\"timesCell" + (i + 1) + "\" title=\"<b>";
		if (sessionObj.list[i].penalty == 1)
			tableHtml = tableHtml.concat(penalizedTime + "+");
		else if (sessionObj.list[i].penalty == 2)
			tableHtml = tableHtml.concat("DNF(" + sessionObj.list[i].time + 2 + ")");
		else
			tableHtml = tableHtml.concat(sessionObj.list[i].time);
		tableHtml = tableHtml.concat("</b>\" data-container=\"#timesCell" + (i + 1) + "\" data-toggle=\"popover\" data-placement=\"right\" data-content=\"\">");
		if (sessionObj.list[i].penalty == 1)
			tableHtml = tableHtml.concat(penalizedTimeFormatted + "+");
		else if (sessionObj.list[i].penalty == 2)
			tableHtml = tableHtml.concat("DNF");
		else
			tableHtml = tableHtml.concat(timeFormatted);
		var avg5Formatted = splitTime(sessionObj.list[i].avg5)[0];
		var avg12Formatted = splitTime(sessionObj.list[i].avg12)[0];
		tableHtml = tableHtml.concat("</td>\n<td class=\"avg5Cell\" id=\"avg5Cell" + (i + 1) + "\" data-toggle=\"modal\" data-target=\"#myModal\">" + avg5Formatted + "</td>\n<td class=\"avg12Cell\" id=\"avg12Cell" + (i + 1) + "\" data-toggle=\"modal\" data-target=\"#myModal\">" + avg12Formatted + "</td></tr>");
		$("#times").prepend(tableHtml);
	}
	if (sessionObj.numSolves >= 5)
		$("#avg5").text("Avg5: " + sessionObj.list[sessionObj.numSolves - 1].avg5);
	else
		$("#avg5").text("Avg5: DNF");
	if (sessionObj.numSolves >= 12)
		$("#avg12").text("Avg12: " + sessionObj.list[sessionObj.numSolves - 1].avg12);
	else
		$("#avg12").text("Avg12: DNF");
	$(".timesCell").hover(function() {
		typingComment = 1;
		var solveNumber = this.id.substring(9);
		solveIndex = this.id.substring(9);
		$("#" + this.id).attr("title", solveNumber);
		var dataContent = "<div class=\"btn-toolbar\" role=\"toolbar\" aria-label=\"...\"><div class=\"btn-group btn-group-xs\" role=\"group\" aria-label=\"...\"><button type=\"button\" class=\"btn btn-success okButton\" id=\"okButton" + solveIndex + "\"><span class=\"glyphicon glyphicon-ok\" aria-hidden=\"true\"></span></button><button type=\"button\" class=\"btn btn-warning plus2Button\" id=\"plus2Button" + solveIndex + "\">+2</button><button type=\"button\" class=\"btn btn-danger DNFButton\" id=\"DNFButton" + solveIndex + "\">DNF</button></div><div class=\"btn-group btn-group-xs\" role=\"group\" aria-label=\"...\"><button type=\"button\" class=\"btn btn-default deleteButton\" id=\"deleteButton" + solveIndex + "\"><span class=\"glyphicon glyphicon-remove\" aria-hidden=\"true\"></span></button></div></div><input type=\"text\" maxlength=\"50\" class=\"form-control input-sm commentInput\" id=\"commentInput" + solveIndex + "\" placeholder=\"comment\">";
		$("#" + this.id).attr("data-content", dataContent);
		$(document).on('keydown', function (e)
		{
			if (e.keyCode === 13)
				fired = 1;
		});
		$(document).on('keyup', function (e)
		{
			if ((e.keyCode === 13) && (fired == 1))
			{
				sessionObj.list[solveIndex - 1].comment = $(".commentInput").val();
				localStorage.setItem("session" + sessionNumber, JSON.stringify(sessionObj));
				printTimes();
				fired = 0;
			}
		});
	}, function () {
		typingComment = 0;
	});
	$(".timesCell").popover({
    	html: true,
    	trigger: "hover",
    	placement: 'right',
    	animation: false
		}).on({
    		show: function (e) {
        		var $this = $("#" + this.id);
        		$this.data("hoveringPopover", true);
        		if ($this.data("waitingForPopoverTO"))
            		e.stopImmediatePropagation();
    		},
    		hide: function (e) {
        		var $this = $("#" + this.id);
        		if ($this.data("forceHidePopover")) {
            		$this.data("forceHidePopover", false);
            		return true;
        		}
        		e.stopImmediatePropagation();
        		clearTimeout($this.data("popoverTO"));
        		$this.data("hoveringPopover", false);
        		$this.data("waitingForPopoverTO", true);
        		$this.data("popoverTO", setTimeout(function () {
            		if (!$this.data("hoveringPopover"))
            		{
                		$this.data("forceHidePopover", true);
                		$this.data("waitingForPopoverTO", false);
                		$this.popover("hide");
            		}
        		}, 0));
        		return false;
    		}
		}).on({
    	show: function () {
        	console.log("shown");
    	},
    	hide: function () {
        	console.log("hidden");
    	}
	});
	$(document).off("click", ".okButton").on("click", ".okButton", function () {
		solveIndex = this.id.substring(8);
		sessionObj = JSON.parse(localStorage.getItem("session" + sessionNumber));
		sessionObj.list[solveIndex - 1].penalty = 0;
		localStorage.setItem("session" + sessionNumber, JSON.stringify(sessionObj));
		printTimes();
	})
	$(document).off("click", ".plus2Button").on("click", ".plus2Button", function () {
		solveIndex = this.id.substring(11);
		sessionObj = JSON.parse(localStorage.getItem("session" + sessionNumber));
		sessionObj.list[solveIndex - 1].penalty = 1;
		localStorage.setItem("session" + sessionNumber, JSON.stringify(sessionObj));
		printTimes();
	});
	$(document).off("click", ".DNFButton").on("click", ".DNFButton", function () {
		solveIndex = this.id.substring(9);
		sessionObj = JSON.parse(localStorage.getItem("session" + sessionNumber));
		sessionObj.list[solveIndex - 1].penalty = 2;
		localStorage.setItem("session" + sessionNumber, JSON.stringify(sessionObj));
		printTimes();
	});
	$(document).off("click", ".deleteButton").on("click", ".deleteButton", function () {
		if (confirm("How many times did you delete to get that average?"))
		{
			solveIndex = this.id.substring(12);
			sessionObj = JSON.parse(localStorage.getItem("session" + sessionNumber));
			if (solveIndex > -1)
			{
    			sessionObj.list.splice(solveIndex - 1, 1);
    			sessionObj.numSolves -= 1;
    			typingComment = 0;
    		}
			localStorage.setItem("session" + sessionNumber, JSON.stringify(sessionObj));
			printTimes();
		}
	});
	$(document).off("click", ".avg5Cell").on("click", ".avg5Cell", function () {
		var solveNumber = this.id.substring(8), date = new Date(sessionObj.list[solveNumber - 1].date);
		$("#myModal").css("top", "25%");
		$("#myModalTitle").text("Average of 5: " + sessionObj.list[solveNumber - 1].avg5);
		$("#myModalFooter").html("<p>" + date.toLocaleString() + "</p>");
		$("#myModalBody").text("");
		if (solveNumber >= 5)
		{
			var tempList = [], DNFCount = 0;
			for (i = 0; i < 5; i++)
			{
				var currentTimeConverted = convertToNumber(sessionObj.list[solveNumber - 1 - i].time);
				if (sessionObj.list[solveNumber - 1 - i].penalty == 1)
					tempList[i] = (+currentTimeConverted + 2).toFixed(3);
				else if (sessionObj.list[solveNumber - 1 - i].penalty == 2)
				{
					tempList[i] = -1;
					DNFCount += 1;
				}
				else
					tempList[i] = currentTimeConverted;
			}
			var minIndex = 0, maxIndex = 0, minValue = tempList[0], maxValue = tempList[0], maxFound = 0;
			if (tempList[0] == -1)
			{
				minIndex = 1;
				minValue = tempList[1];
			}
			for (j = 0; j < 5; j++)
			{
				if (+tempList[j] == -1)
				{
					maxIndex = j;
					maxValue = tempList[j];
					maxFound = 1;
				}
				if ((+tempList[j] > +maxValue) && (maxFound == 0))
				{
					maxIndex = j;
					maxValue = tempList[j];
				}
				if ((+tempList[j] < +minValue) && (+tempList[j] > 0))
				{
					minIndex = j;
					minValue = tempList[j];
				}
			}
			if ((minIndex == solveNumber - 1) && (maxIndex == solveNumber - 1))
				minIndex = solveNumber - 2;			
			for (i = 4; i >= 0; i--)
			{
				console.log(solveNumber - 1 - i);
				var modalBody = "", timeFormatted = splitTime(sessionObj.list[solveNumber - 1 - i].time)[0], penalizedTimeFormatted = splitTime((+sessionObj.list[solveNumber - 1 - i].time + 2).toFixed(3))[0];
				modalBody = modalBody.concat("<p>" + (5 - i) + ". ");
				if ((i == minIndex) || (i == maxIndex))
					modalBody = modalBody.concat("(");
				if (sessionObj.list[solveNumber - 1 - i].penalty == 1)
					modalBody = modalBody.concat(penalizedTimeFormatted + "+");
				else if (sessionObj.list[solveNumber - 1 - i].penalty == 2)
					modalBody = modalBody.concat("DNF(" + timeFormatted + ")");
				else
					modalBody = modalBody.concat(timeFormatted);
				if ((i == minIndex) || (i == maxIndex))
					modalBody = modalBody.concat(")");
				modalBody = modalBody.concat(" " + sessionObj.list[solveNumber - 1 - i].scramble);
				if ((sessionObj.list[solveNumber - 1 - i].comment != null) && (sessionObj.list[solveNumber - 1 - i].comment != ""))
					modalBody = modalBody.concat(" (" + sessionObj.list[solveNumber - 1 - i].comment + ")");
				modalBody = modalBody.concat("</p>");
				$("#myModalBody").append(modalBody);
			}
		}
	});
	$(document).off("click", ".avg12Cell").on("click", ".avg12Cell", function () {
		var solveNumber = this.id.substring(9), date = new Date(sessionObj.list[solveNumber - 1].date);
		$("#myModal").css("top", "15%");
		$("#myModalTitle").text("Average of 12: " + sessionObj.list[solveNumber - 1].avg12);
		$("#myModalFooter").html("<p>" + date.toLocaleString() + "</p>");
		$("#myModalBody").text("");
		if (solveNumber >= 12)
		{
			var tempList = [], DNFCount = 0;
			for (i = 0; i < 12; i++)
			{
				var currentTimeConverted = convertToNumber(sessionObj.list[solveNumber - 1 - i].time);
				if (sessionObj.list[solveNumber - 1 - i].penalty == 1)
					tempList[i] = (+currentTimeConverted + 2).toFixed(3);
				else if (sessionObj.list[solveNumber - 1 - i].penalty == 2)
				{
					tempList[i] = -1;
					DNFCount += 1;
				}
				else
					tempList[i] = currentTimeConverted;
			}
			var minIndex = 0, maxIndex = 0, minValue = tempList[0], maxValue = tempList[0], maxFound = 0;
			if (tempList[0] == -1)
			{
				minIndex = 1;
				minValue = tempList[1];
			}
			for (j = 0; j < 12; j++)
			{
				if (+tempList[j] == -1)
				{
					maxIndex = j;
					maxValue = tempList[j];
					maxFound = 1;
				}
				if ((+tempList[j] > +maxValue) && (maxFound == 0))
				{
					maxIndex = j;
					maxValue = tempList[j];
				}
				if ((+tempList[j] < +minValue) && (+tempList[j] > 0))
				{
					minIndex = j;
					minValue = tempList[j];
				}
			}
			if ((minIndex == solveNumber - 1) && (maxIndex == solveNumber - 1))
				minIndex = solveNumber - 2;			
			for (i = 11; i >= 0; i--)
			{
				console.log(solveNumber - 1 - i);
				var modalBody = "", timeFormatted = splitTime(sessionObj.list[solveNumber - 1 - i].time)[0], penalizedTimeFormatted = splitTime((+sessionObj.list[solveNumber - 1 - i].time + 2).toFixed(3))[0];
				modalBody = modalBody.concat("<p>" + (12 - i) + ". ");
				if ((i == minIndex) || (i == maxIndex))
					modalBody = modalBody.concat("(");
				if (sessionObj.list[solveNumber - 1 - i].penalty == 1)
					modalBody = modalBody.concat(penalizedTimeFormatted + "+");
				else if (sessionObj.list[solveNumber - 1 - i].penalty == 2)
					modalBody = modalBody.concat("DNF(" + timeFormatted + ")");
				else
					modalBody = modalBody.concat(timeFormatted);
				if ((i == minIndex) || (i == maxIndex))
					modalBody = modalBody.concat(")");
				modalBody = modalBody.concat(" " + sessionObj.list[solveNumber - 1 - i].scramble);
				if ((sessionObj.list[solveNumber - 1 - i].comment != null) && (sessionObj.list[solveNumber - 1 - i].comment != ""))
					modalBody = modalBody.concat(" (" + sessionObj.list[solveNumber - 1 - i].comment + ")");
				modalBody = modalBody.concat("</p>");
				$("#myModalBody").append(modalBody);
			}
		}
	});
}

function updateSessionInfo()
{
	var sessionObj = JSON.parse(localStorage.getItem("session" + sessionNumber)), sum = 0, sessionBestConverted = 9999999999, sessionWorstConverted = -1;
	solvesAttempted = sessionObj.list.length;
	solvesCompleted = sessionObj.list.length;
	for (i = 0; i < solvesAttempted; i++)
	{
		var currentTimeConverted = convertToNumber(sessionObj.list[i].time);
		if (sessionObj.list[i].penalty == 2)
			solvesCompleted--;
		else if (sessionObj.list[i].penalty == 1)
		{
			sum += (+currentTimeConverted + 2);
			if (+currentTimeConverted < +sessionBestConverted)
				sessionBestConverted = (+currentTimeConverted + 2).toFixed(3);
			if (+currentTimeConverted > +sessionWorstConverted)
				sessionWorstConverted = (+currentTimeConverted + 2).toFixed(3);
		}
		else
		{
			sum += +currentTimeConverted;
			if (+currentTimeConverted < +sessionBestConverted)
				sessionBestConverted = currentTimeConverted;
			if (+currentTimeConverted > +sessionWorstConverted)
				sessionWorstConverted = currentTimeConverted;
		}
	}
	if (sum == 0)
		mean = "N/A";
	else
		mean = (sum / solvesAttempted).toFixed(3);
	sessionMean = convertToTime(mean);
	if (sessionBestConverted == 9999999999)
		sessionBestConverted = "N/A";
	if (sessionWorstConverted == -1)
		sessionWorstConverted = "N/A";
	sessionBest = convertToTime(sessionBestConverted);
	sessionWorst = convertToTime(sessionWorstConverted);
	if (sessionObj.list.length == 0)
	{
		sessionMean = "N/A";
		sessionBest = "N/A";
		sessionWorst = "N/A";
	}
	$("#sessionSolves").html("<b>Solves: " + solvesCompleted + "/" + solvesAttempted + "</b>");
	$("#sessionMean").html("<b>Mean: " + sessionMean + "</b>");
}

function updateAverages()
{
	var sessionObj = JSON.parse(localStorage.getItem("session" + sessionNumber));
	for (i = 0; i < sessionObj.list.length; i++)
	{
		if (i >= 4)
		{
			var tempList = [], DNFCount = 0;
			for (j = 0; j < 5; j++)
			{
				var currentTimeConverted = convertToNumber(sessionObj.list[i - j].time);
				if (sessionObj.list[i - j].penalty == 1)
					tempList[j] = (+currentTimeConverted + 2).toFixed(3);
				else if (sessionObj.list[i - j].penalty == 2)
				{
					tempList[j] = -1;
					DNFCount += 1;
				}
				else
					tempList[j] = currentTimeConverted;
			}
			var minIndex = 0, maxIndex = 0, minValue = tempList[0], maxValue = tempList[0], maxFound = 0;
			if (tempList[0] == -1)
			{
				minIndex = 1;
				minValue = tempList[1];
			}
			for (j = 0; j < 5; j++)
			{
				if (+tempList[j] == -1)
				{
					maxIndex = j;
					maxValue = tempList[j];
					maxFound = 1;
				}
				if ((+tempList[j] > +maxValue) && (maxFound == 0))
				{
					maxIndex = j;
					maxValue = tempList[j];
				}
				if ((+tempList[j] < +minValue) && (+tempList[j] > 0))
				{
					minIndex = j;
					minValue = tempList[j];
				}
			}
			if ((minIndex == i) && (maxIndex == i))
				minIndex -= 1;
			var sum = 0;
			for (j = 0; j < 5; j++)
				if (!((j == minIndex) || (j == maxIndex)))
					sum += +tempList[j];
			sessionObj.list[i].avg5 = convertToTime((sum / 3).toFixed(3));
			if (DNFCount > 1)
				sessionObj.list[i].avg5 = "DNF";
		}
		if (i >= 11)
		{
			var tempList = [], DNFCount = 0;
			for (j = 0; j < 12; j++)
			{
				var currentTimeConverted = convertToNumber(sessionObj.list[i - j].time);
				if (sessionObj.list[i - j].penalty == 1)
					tempList[j] = (+currentTimeConverted + 2).toFixed(3);
				else if (sessionObj.list[i - j].penalty == 2)
				{
					tempList[j] = -1;
					DNFCount += 1;
				}
				else
					tempList[j] = currentTimeConverted;
			}
			var minIndex = 0, maxIndex = 0, minValue = tempList[0], maxValue = tempList[0], maxFound = 0;
			if (tempList[0] == -1)
			{
				minIndex = 1;
				minValue = tempList[1];
			}
			for (j = 0; j < 12; j++)
			{
				if (+tempList[j] == -1)
				{
					maxIndex = j;
					maxValue = tempList[j];
					maxFound = 1;
				}
				if ((+tempList[j] > +maxValue) && (maxFound == 0))
				{
					maxIndex = j;
					maxValue = tempList[j];
				}
				if ((+tempList[j] < +minValue) && (+tempList[j] > 0))
				{
					minIndex = j;
					minValue = tempList[j];
				}
			}
			if ((minIndex == i) && (maxIndex == i))
				minIndex -= 1;
			var sum = 0;
			for (j = 0; j < 12; j++)
				if (!((j == minIndex) || (j == maxIndex)))
					sum += +tempList[j];
			sessionObj.list[i].avg12 = convertToTime((sum / 10).toFixed(3));
			if (DNFCount > 1)
				sessionObj.list[i].avg12 = "DNF";
		}
	}
	localStorage.setItem("session" + sessionNumber, JSON.stringify(sessionObj));
}

function splitTime(timeEllapsed)
{
	if (timeEllapsed == "DNF")
		return ["DNF", ""];
	return [timeEllapsed.substr(0, timeEllapsed.length - 1), lastDigit = timeEllapsed.substr(timeEllapsed.length - 1, timeEllapsed.lenth), lastDigit];
}

function convertToNumber(elapsedTime)
{
	if (elapsedTime == "DNF")
		return "DNF";
	else if (elapsedTime.length < 7)
		return elapsedTime;
	else
	{
		var minutes, seconds;
		if (elapsedTime.length == 8)
		{
			minutes = elapsedTime.substr(0, 1);
			seconds = elapsedTime.substr(2, 8);
		}
		else if (elapsedTime.length == 9)
		{
			minutes = elapsedTime.substr(0, 2);
			seconds = elapsedTime.substr(3, 9);
		}
		return ((+minutes * 60) + (+seconds)).toFixed(3);
	}
}

function convertToTime(n)
{
	if (n == "DNF")
		return "DNF";
	var minutes = Math.floor(n / 60), seconds = (n % 60).toFixed(3);
	if (minutes == 0)
		return seconds;
	else if (seconds < 10)
		return (minutes + ":0" + seconds);
	else
		return (minutes + ":" + seconds);
}

function calculateMeanOf3(a, b, c)
{
	if ((a.penalty == 2) || (b.penalty == 2) || (c.penalty == 2))
		return "DNF";
	var aTime = convertToNumber(a.time), bTime = convertToNumber(b.time), cTime = convertToNumber(c.time);
	if (a.penalty == 1)
		aTime = +aTime + 2;
	if (b.penalty == 1)
		bTime = +bTime + 2;
	if (c.penalty == 1)
		cTime = +cTime + 2;
	return ((+aTime + +bTime + +cTime) / 3).toFixed(3);
}

function calculateAverageOfN(list)
{
	var avgN = "DNF", tempList = [], DNFCount = 0;
	for (i = 0; i < list.length; i++)
	{
		var currentTimeConverted = convertToNumber(list[i].time);
		if (list[i].penalty == 1)
			tempList[i] = (+currentTimeConverted + 2).toFixed(3);
		else if (list[i].penalty == 2)
		{
			tempList[i] = -1;
			DNFCount += 1;
		}
		else
			tempList[i] = currentTimeConverted;
	}
	var minIndex = 0, maxIndex = 0, minValue = tempList[0], maxValue = tempList[0], maxFound = 0;
	if (tempList[0] == -1)
	{
		minIndex = 1;
		minValue = tempList[1];
	}
	for (j = 0; j < list.length; j++)
	{
		if (+tempList[j] == -1)
		{
			maxIndex = j;
			maxValue = tempList[j];
			maxFound = 1;
		}
		if ((+tempList[j] > +maxValue) && (maxFound == 0))
		{
			maxIndex = j;
			maxValue = tempList[j];
		}
		if ((+tempList[j] < +minValue) && (+tempList[j] > 0))
		{
			minIndex = j;
			minValue = tempList[j];
		}
	}
	if ((minIndex == i) && (maxIndex == i))
		minIndex -= 1;
	var sum = 0;
	for (j = 0; j < list.length; j++)
		if (!((j == minIndex) || (j == maxIndex)))
			sum += +tempList[j];
	avgN = convertToTime((sum / list.length).toFixed(3));
		if (DNFCount > 1)
			avgN = "DNF";
	return avgN;
}

function calculateBestAverageOfN(list, N)
{
	if (list.length < N)
		return "DNF";
	var avgN = "DNF", tempList = [], minIndex = 0, maxIndex = 0, minValue = tempList[0], maxValue = tempList[0], maxFound = 0, bestSum = "DNF", currentSum = 0, DNFCount = 0;
	for (i = 0; i < list.length; i++)
	{
		var currentTimeConverted = convertToNumber(list[i].time);
		if (list[i].penalty == 1)
			tempList[i] = (+currentTimeConverted + 2).toFixed(3);
		else if (list[i].penalty == 2)
			tempList[i] = 9999999999;
		else
			tempList[i] = currentTimeConverted;
	}
	if (tempList[0] == 9999999999)
	{
		minIndex = 1;
		minValue = tempList[1];
	}
	for (j = 0; j < N; j++)
	{
		if (+tempList[j] == 9999999999)
		{
			maxIndex = j;
			maxValue = tempList[j];
			maxFound = 1;
		}
		if ((+tempList[j] > +maxValue) && (maxFound == 0))
		{
			maxIndex = j;
			maxValue = tempList[j];
		}
		if ((+tempList[j] < +minValue) && (+tempList[j] > 0))
		{
			minIndex = j;
			minValue = tempList[j];
		}
	}
	if ((minIndex == i) && (maxIndex == i))
		minIndex -= 1;
	for (i = 0; i < N; i++)
	{
		if (tempList[i] == 9999999999)
			DNFCount += 1;
		if (!((i == minIndex) || (i == maxIndex)))
			currentSum += +tempList[i];
	}
	if (DNFCount < 2)
		bestSum = currentSum;
	for (i = N; i < list.length; i++)
	{		
		if (tempList[i] == 9999999999)
			DNFCount += 1;
		if (tempList[i - N] == 9999999999)
			DNFCount -= 1;
		if ((maxIndex == (i - N)) || (minIndex == (i - N)))
		{
			var isMax = 0;
			if (maxIndex == (i - N))
				isMax = 1;
			maxIndex = i - N + 1;
			minIndex = i - N + 1;
			maxValue = tempList[i - N + 1];
			minValue = tempList[i - N + 1];
			for (j = i - N + 1; j < i; j++)
			{
				if (+tempList[j] > +maxValue)
				{
					maxIndex = j;
					maxValue = tempList[j];
				}
				if (+tempList[j] < +minValue)
				{
					minIndex = j;
					minValue = tempList[j];
				}
			}
			currentSum += +tempList[i];
			if (isMax == 1)
				currentSum -= +tempList[maxIndex];
			else
				currentSum -= +tempList[minIndex];
		}
		else
		{
			currentSum += +tempList[i];
			currentSum -= +tempList[i - N];
		}
		if (+tempList[i] > +maxValue)
		{
			currentSum += +tempList[maxIndex];
			currentSum -= +tempList[i];
			maxIndex = i;
			maxValue = tempList[i];
		}
		if (+tempList[i] < +minValue)
		{
			currentSum += +tempList[minIndex];
			currentSum -= +tempList[i];
			minIndex = i;
			minValue = tempList[i];
		}
		if (((currentSum < bestSum) || (bestSum == "DNF")) && (DNFCount < 2))
			bestSum = currentSum;
	}
	if (bestSum == "DNF")
		return "DNF";
	avgN = convertToTime((bestSum / N).toFixed(3));
	return avgN;
}

function pad2(n)
{
    if (n > 9)
    	return n;
    else
    	return "0" + n;
}

function pad3(n){
    if (n > 99)
    	return n;
    else if (n > 9)
    	return "0" + n;
    else 
    	return "00" + n;
}

function generate2x2Scramble(length)
{
    var scramble = "", previousOrientation = -1;
    for (i = 0; i < length; i++)
    {
        var turningOrientation = Math.floor((Math.random() * 3)), turningDirection = Math.floor((Math.random() * 3));
        while (turningOrientation == previousOrientation)
        {
            turningOrientation = Math.floor((Math.random() * 3));
            innerTurningLayer = Math.floor((Math.random() * 2));
            turningDirection = Math.floor((Math.random() * 3));
        }
        if (turningOrientation == 0)
            scramble = scramble.concat("U");
        else if (turningOrientation == 1)
            scramble = scramble.concat("F");
        else if (turningOrientation == 2)
            scramble = scramble.concat("R");
        switch (turningDirection)
        {
            case 1: scramble = scramble.concat("'"); break;
            case 2: scramble = scramble.concat("2"); break;
        }
        previousOrientation = turningOrientation;
        if (i < length - 1)
            scramble = scramble.concat(" ");
    }
    return scramble;
}

function generate3x3Scramble(length)
{
	var previousMove = -1, secondPreviousMove = -1, scramble = "";
    for (i = 0; i < length; i++)
    {
        var move = Math.floor((Math.random() * 6)), direction = Math.floor((Math.random() * 3));
        if (((previousMove == 0) && (secondPreviousMove != 1)) || ((previousMove == 1) && (secondPreviousMove != 0)) || ((previousMove == 2) && (secondPreviousMove != 3)) || ((previousMove == 3) && (secondPreviousMove != 2)) || ((previousMove == 4) && (secondPreviousMove != 5)) || ((previousMove == 5) && (secondPreviousMove != 4)))
            secondPreviousMove = -1;
        while ((move == previousMove) || (move == secondPreviousMove))
            move = Math.floor((Math.random() * 6));
        switch (move)
        {
            case 0: scramble = scramble.concat("U"); break;
            case 1: scramble = scramble.concat("D"); break;
            case 2: scramble = scramble.concat("L"); break;
            case 3: scramble = scramble.concat("R"); break;
            case 4: scramble = scramble.concat("F"); break;
            case 5: scramble = scramble.concat("B"); break;
        }
        switch (direction)
        {
            case 1: scramble = scramble.concat("'"); break;
            case 2: scramble = scramble.concat("2"); break;
        }
        secondPreviousMove = previousMove;
        previousMove = move;
        if (i < length - 1)
            scramble = scramble.concat(" ");
    }
    return scramble;
}

function generate4x4Scramble(length)
{
    var scramble = "", layersTurned = 0, previousOrientation = -1, temp = -1;
    for (i = 0; i < length; i++)
    {
        var turningOrientation = Math.floor((Math.random() * 3)), turningLayer = Math.floor((Math.random() * 3)), innerTurningLayer = Math.floor((Math.random() * 2)), turningDirection = Math.floor((Math.random() * 3));
        if (turningOrientation != previousOrientation)
            layersTurned = 0;
        switch (turningLayer)
        {
            case 0: temp = 1; break;
            case 1: temp = 2; break;
            case 2: temp = 4; break;
        }
        while ((previousOrientation == turningOrientation) && ((temp & layersTurned) > 0))
        {
            turningOrientation = Math.floor((Math.random() * 3));
            turningLayer = Math.floor((Math.random() * 3));
            innerTurningLayer = Math.floor((Math.random() * 2));
            turningDirection = Math.floor((Math.random() * 3));
            if (turningOrientation != previousOrientation)
                layersTurned = 0;
        }
        if (turningOrientation == 0)
        {
            if (turningLayer == 0)
                scramble = scramble.concat("U");
            else if (turningLayer == 2)
                scramble = scramble.concat("D");
            else if (innerTurningLayer == 0)
                scramble = scramble.concat("Uw");
            else
                scramble = scramble.concat("Dw");
        }
        else if (turningOrientation == 1)
        {
            if (turningLayer == 0)
                scramble = scramble.concat("F");
            else if (turningLayer == 2)
                scramble = scramble.concat("B");
            else if (innerTurningLayer == 0)
                scramble = scramble.concat("Fw");
            else
                scramble = scramble.concat("Bw");
        }
        else if (turningOrientation == 2)
        {
            if (turningLayer == 0)
                scramble = scramble.concat("L");
            else if (turningLayer == 2)
                scramble = scramble.concat("R");
            else if (innerTurningLayer == 0)
                scramble = scramble.concat("Lw");
            else
                scramble = scramble.concat("Rw");
        }
        switch (turningLayer)
        {
            case 0: layersTurned += 1; break;
            case 1: layersTurned += 2; break;
            case 2: layersTurned += 4; break;
        }
        switch (turningDirection)
        {
            case 1: scramble = scramble.concat("'"); break;
            case 2: scramble = scramble.concat("2"); break;
        }
        previousOrientation = turningOrientation;
        if (i < length - 1)
            scramble = scramble.concat(" ");
    }
    return scramble;
}

function generate5x5Scramble(length)
{
    var scramble = "", layersTurned = 0, previousOrientation = -1, temp = -1;
    for (i = 0; i < length; i++)
    {
        var turningOrientation = Math.floor((Math.random() * 3)), turningLayer = Math.floor((Math.random() * 4)), turningDirection = Math.floor((Math.random() * 3));
        if (turningOrientation != previousOrientation)
            layersTurned = 0;
        switch (turningLayer)
        {
            case 0: temp = 1; break;
            case 1: temp = 2; break;
            case 2: temp = 4; break;
            case 3: temp = 8; break;
        }
        while ((previousOrientation == turningOrientation) && ((temp & layersTurned) > 0))
        {
            turningOrientation = Math.floor((Math.random() * 3));
            turningLayer = Math.floor((Math.random() * 4));
            turningDirection = Math.floor((Math.random() * 3));
            if (turningOrientation != previousOrientation)
                layersTurned = 0;
        }
        if (turningOrientation == 0)
        {
            if (turningLayer == 0)
                scramble = scramble.concat("U");
            else if (turningLayer == 1)
                scramble = scramble.concat("Uw");
            else if (turningLayer == 2)
                scramble = scramble.concat("Dw");
            else
                scramble = scramble.concat("D");
        }
        else if (turningOrientation == 1)
        {
            if (turningLayer == 0)
                scramble = scramble.concat("F");
            else if (turningLayer == 1)
                scramble = scramble.concat("Fw");
            else if (turningLayer == 2)
                scramble = scramble.concat("Bw");
            else
                scramble = scramble.concat("B");
        }
        else if (turningOrientation == 2)
        {
            if (turningLayer == 0)
                scramble = scramble.concat("L");
            else if (turningLayer == 1)
                scramble = scramble.concat("Lw");
            else if (turningLayer == 2)
                scramble = scramble.concat("Rw");
            else
                scramble = scramble.concat("R");
        }
        switch (turningLayer)
        {
            case 0: layersTurned += 1; break;
            case 1: layersTurned += 2; break;
            case 2: layersTurned += 4; break;
            case 3: layersTurned += 8; break;
        }
        switch (turningDirection)
        {
            case 1: scramble = scramble.concat("'"); break;
            case 2: scramble = scramble.concat("2"); break;
        }
        previousOrientation = turningOrientation;
        if (i < length - 1)
            scramble = scramble.concat(" ");
    }
    return scramble;
}

function generate6x6Scramble(length)
{
    var scramble = "", layersTurned = 0, previousOrientation = -1, temp = -1;
    for (i = 0; i < length; i++)
    {
        var turningOrientation = Math.floor((Math.random() * 3)), turningLayer = Math.floor((Math.random() * 5)), innerTurningLayer = Math.floor((Math.random() * 2)), turningDirection = Math.floor((Math.random() * 3));
        if (turningOrientation != previousOrientation)
            layersTurned = 0;
        switch (turningLayer)
        {
            case 0: temp = 1; break;
            case 1: temp = 2; break;
            case 2: temp = 4; break;
            case 3: temp = 8; break;
            case 4: temp = 16; break;
        }
        while ((previousOrientation == turningOrientation) && ((temp & layersTurned) > 0))
        {
            turningOrientation = Math.floor((Math.random() * 3));
            turningLayer = Math.floor((Math.random() * 5));
            innerTurningLayer = Math.floor((Math.random() * 2));
            turningDirection = Math.floor((Math.random() * 3));
            if (turningOrientation != previousOrientation)
                layersTurned = 0;
        }
        if (turningOrientation == 0)
        {
            if (turningLayer == 0)
                scramble = scramble.concat("U");
            else if (turningLayer == 1)
                scramble = scramble.concat("D");
            else if (turningLayer == 2)
                scramble = scramble.concat("Uw");
            else if (turningLayer == 3)
                scramble = scramble.concat("Dw");
            else if (innerTurningLayer == 0)
                scramble = scramble.concat("3Uw");
            else
                scramble = scramble.concat("3Dw");
        }
        else if (turningOrientation == 1)
        {
            if (turningLayer == 0)
                scramble = scramble.concat("F");
            else if (turningLayer == 1)
                scramble = scramble.concat("B");
            else if (turningLayer == 2)
                scramble = scramble.concat("Fw");
            else if (turningLayer == 3)
                scramble = scramble.concat("Bw");
            else if (innerTurningLayer == 0)
                scramble = scramble.concat("3Fw");
            else
                scramble = scramble.concat("3Bw");
        }
        else if (turningOrientation == 2)
        {
            if (turningLayer == 0)
                scramble = scramble.concat("L");
            else if (turningLayer == 1)
                scramble = scramble.concat("R");
            else if (turningLayer == 2)
                scramble = scramble.concat("Lw");
            else if (turningLayer == 3)
                scramble = scramble.concat("Rw");
            else if (innerTurningLayer == 0)
                scramble = scramble.concat("3Lw");
            else
                scramble = scramble.concat("3Rw");
        }
        switch (turningLayer)
        {
            case 0: layersTurned += 1; break;
            case 1: layersTurned += 2; break;
            case 2: layersTurned += 4; break;
            case 3: layersTurned += 8; break;
            case 4: layersTurned += 16; break;
        }
        switch (turningDirection)
        {
            case 1: scramble = scramble.concat("'"); break;
            case 2: scramble = scramble.concat("2"); break;
        }
        previousOrientation = turningOrientation;
        if (i < length - 1)
            scramble = scramble.concat(" ");
    }
    return scramble;
}

function generate7x7Scramble(length)
{
    var scramble = "", layersTurned = 0, previousOrientation = -1, temp = -1;
    for (i = 0; i < length; i++)
    {
        var turningOrientation = Math.floor((Math.random() * 3)), turningLayer = Math.floor((Math.random() * 6)), turningDirection = Math.floor((Math.random() * 3));
        if (turningOrientation != previousOrientation)
            layersTurned = 0;
        switch (turningLayer)
        {
            case 0: temp = 1; break;
            case 1: temp = 2; break;
            case 2: temp = 4; break;
            case 3: temp = 8; break;
            case 4: temp = 16; break;
            case 5: temp = 32; break;
        }
        while ((previousOrientation == turningOrientation) && ((temp & layersTurned) > 0))
        {
            turningOrientation = Math.floor((Math.random() * 3));
            turningLayer = Math.floor((Math.random() * 6));
            turningDirection = Math.floor((Math.random() * 3));
            if (turningOrientation != previousOrientation)
                layersTurned = 0;
        }
        if (turningOrientation == 0)
        {
            if (turningLayer == 0)
                scramble = scramble.concat("U");
            else if (turningLayer == 1)
                scramble = scramble.concat("D");
            else if (turningLayer == 2)
                scramble = scramble.concat("Uw");
            else if (turningLayer == 3)
                scramble = scramble.concat("Dw");
            else if (turningLayer == 4)
                scramble = scramble.concat("3Uw");
            else
                scramble = scramble.concat("3Dw");
            
        }
        else if (turningOrientation == 1)
        {
            if (turningLayer == 0)
                scramble = scramble.concat("F");
            else if (turningLayer == 1)
                scramble = scramble.concat("B");
            else if (turningLayer == 2)
                scramble = scramble.concat("Fw");
            else if (turningLayer == 3)
                scramble = scramble.concat("Bw");
            else if (turningLayer == 4)
                scramble = scramble.concat("3Fw");
            else
                scramble = scramble.concat("3Bw");
        }
        else if (turningOrientation == 2)
        {
            if (turningLayer == 0)
                scramble = scramble.concat("L");
            else if (turningLayer == 1)
                scramble = scramble.concat("R");
            else if (turningLayer == 2)
                scramble = scramble.concat("Lw");
            else if (turningLayer == 3)
                scramble = scramble.concat("Rw");
            else if (turningLayer == 4)
                scramble = scramble.concat("3Lw");
            else
                scramble = scramble.concat("3Rw");
        }
        switch (turningLayer)
        {
            case 0: layersTurned += 1; break;
            case 1: layersTurned += 2; break;
            case 2: layersTurned += 4; break;
            case 3: layersTurned += 8; break;
            case 4: layersTurned += 16; break;
            case 5: layersTurned += 32; break;
        }
        switch (turningDirection)
        {
            case 1: scramble = scramble.concat("'"); break;
            case 2: scramble = scramble.concat("2"); break;
        }
        previousOrientation = turningOrientation;
        if (i < length - 1)
            scramble = scramble.concat(" ");
    }
    return scramble;
}
