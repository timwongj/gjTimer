var start, stop, isTiming = 0, updateTimer = 0, allowedToUpdate = 0, typingComment = 0;
var solveIndex, fired = 0, scrambleType = 3, scrambleLength = 20, sessionNumber = 1;

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
	for (i = 1; i <= 10; i++)
	{
		if (localStorage.getItem("session" + i) == null)
		{
			var newSession = {
				sessionNumber: i,
				numSolves: 0,
				list: []
			}
			localStorage.setItem("session" + i, JSON.stringify(newSession));
		}
	}
	$("#timer").text("0.000");
	printTimes();
	$("#sessionDropdownButton").html("Session " + sessionNumber + " <span class=\"caret\"></span>");
	$("#sessionDropdownMenu li a").click(function(){
    	$("#sessionDropdownButton").html($(this).text() + " <span class=\"caret\"></span>")
    								.val($(this).text());
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
    	}
    	localStorage.setItem("sessionNumber", sessionNumber);
    	printTimes();
	});
	$("#statsButton").click(function () {
		$("#myModal").css("top","15%");
		$("#myModalTitle").text("Statistics ");
		$("#myModalTitle").append("<small> (This feature is currently under devlopment)</small>");
		$("#myModalBody").text("");
		$("#myModalFooter").html("<p>" + new Date() + "</p>");
		modalBody = "";
		modalBody = modalBody.concat("<p>Solves:</p>");
		modalBody = modalBody.concat("<p>Average:</p>");
		modalBody = modalBody.concat("<p>Best:</p>");
		modalBody = modalBody.concat("<p>Worst:</p>");
		modalBody = modalBody.concat("<div class=\"table-responsive\"><table class=\"table table-bordered table-hover\" id=\"statsTable\"><thead><th></th><th>Current</th><th>Best</th></thead><tbody>");
		modalBody = modalBody.concat("<tr><td>Mean of 3</td><td></td><td></td></tr>");
		modalBody = modalBody.concat("<tr><td>Average of 5</td><td></td><td></td></tr>");
		modalBody = modalBody.concat("<tr><td>Average of 12</td><td></td><td></td></tr>");
		modalBody = modalBody.concat("<tr><td>Average of 50</td><td></td><td></td></tr>");
		modalBody = modalBody.concat("<tr><td>Average of 100</td><td></td><td></td></tr>");
		modalBody = modalBody.concat("</tbody></table></div>");
		$("#myModalBody").append(modalBody);
	});
	$("#resetButton").click(function () {
		if(confirm("Reset Session " + sessionNumber + "?"))
		{
			var newSession = {
				sessionNumber: i,
				numSolves: 0,
				list: []
			}
			localStorage.setItem("session" + sessionNumber, JSON.stringify(newSession));
			location.reload();
		}
	});
	$("#scramble2x2").click(function () {
		scrambleType = 2;
		scrambleLength = 10;
		$("#scrambleLength").val(scrambleLength);
		$("#scramble").text(generate2x2Scramble(scrambleLength))
						.css('font-size','18pt');
		localStorage.setItem("scrambleType", scrambleType);
		localStorage.setItem("scrambleLength", scrambleLength);
	});
	$("#scramble3x3").click(function () {
		scrambleType = 3;
		scrambleLength = 20;
		$("#scrambleLength").val(scrambleLength);
		$("#scramble").text(generate3x3Scramble(scrambleLength))
						.css('font-size','18pt');
		localStorage.setItem("scrambleType", scrambleType);
		localStorage.setItem("scrambleLength", scrambleLength);
	});
	$("#scramble4x4").click(function () {
		scrambleType = 4;
		scrambleLength = 40;
		$("#scrambleLength").val(scrambleLength);
		$("#scramble").text(generate4x4Scramble(scrambleLength))
						.css('font-size','18pt');
		localStorage.setItem("scrambleType", scrambleType);
		localStorage.setItem("scrambleLength", scrambleLength);
	});
	$("#scramble5x5").click(function () {
		scrambleType = 5;
		scrambleLength = 60;
		$("#scrambleLength").val(scrambleLength);
		$("#scramble").text(generate5x5Scramble(scrambleLength))
						.css('font-size','18pt');
		localStorage.setItem("scrambleType", scrambleType);
		localStorage.setItem("scrambleLength", scrambleLength);
	});
	$("#scramble6x6").click(function () {
		scrambleType = 6;
		scrambleLength = 80;
		$("#scrambleLength").val(scrambleLength);
		$("#scramble").text(generate6x6Scramble(scrambleLength))
						.css('font-size','16pt');
		localStorage.setItem("scrambleType", scrambleType);
		localStorage.setItem("scrambleLength", scrambleLength);
	});
	$("#scramble7x7").click(function () {
		scrambleType = 7;
		scrambleLength = 100;
		$("#scrambleLength").val(scrambleLength);
		$("#scramble").text(generate7x7Scramble(scrambleLength))
						.css('font-size','14pt');
		localStorage.setItem("scrambleType", scrambleType);
		localStorage.setItem("scrambleLength", scrambleLength);
	});
	var dt, timeElapsed, minutes, seconds, milliseconds, dtElapsed;
	printScramble();
	$(document).on('keydown', function (e)
	{
		if (e.keyCode === 32)
		{
			if ((isTiming == 0) && (typingComment == 0))
				$("#timer").css('color', 'green');
			else if (allowedToUpdate == 1)
			{
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
				$("#timer").text(timeElapsed);
				var solveObj = {
					time: timeElapsed,
					avg5: "DNF",
					avg12: "DNF",
					scramble: $("#scramble").text(),
					date: stop,
					penalty: 0,
					comment: ""
				}
				var sessionObj = JSON.parse(localStorage.getItem("session" + sessionNumber));
				sessionObj.numSolves += 1;
				sessionObj.list.push(solveObj);
				localStorage.setItem("session" + sessionNumber, JSON.stringify(sessionObj));
				localStorage.setItem(pad2(localStorage.length + 1), timeElapsed);
				printTimes();
				printScramble();
			}
		}
	});
	$(document).on('keyup', function (e)
	{
		if ((e.keyCode === 32) && (typingComment == 0))
		{
			if (isTiming == 0)
			{
				$("#timer").css('color', 'black');
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
	$(document).on('keydown', function (e)
	{
		if ((e.keyCode === 13) && (typingComment == 0))
		{
			scrambleLength = $("#scrambleLength").val();
			localStorage.setItem("scrambleType", scrambleType);
			localStorage.setItem("scrambleLength", scrambleLength);
			location.reload();
		}
	});
});

function updateTime()
{
	var elapsed = new Date() - start;
	milliseconds = (elapsed % 1000);
	seconds = Math.floor(elapsed / 1000) % 60;
	minutes = Math.floor(((elapsed / 1000) / 60) % 60);
	milliseconds = pad3(milliseconds);			
	if (minutes == 0)
		timeElapsed = seconds + "." + milliseconds;
	else
	{
		seconds = pad2(seconds);
		timeElapsed = minutes + ":" + seconds + "." + milliseconds;
	}
    if (updateTimer == 1)
    	$("#timer").text(timeElapsed);
    setTimeout(updateTime, 10);
}

function printScramble()
{
	scrambleLength = $("#scrambleLength").val(scrambleLength);
	scrambleType = localStorage.getItem("scrambleType");
	scrambleLength = localStorage.getItem("scrambleLength");
	if (scrambleType == 2)
	{
		$("#scramble").text(generate2x2Scramble(scrambleLength))
						.css('font-size','18pt');
	}
	else if (scrambleType == 3)
	{
		$("#scramble").text(generate3x3Scramble(scrambleLength))
						.css('font-size','18pt');
	}
	else if (scrambleType == 4)
	{
		$("#scramble").text(generate4x4Scramble(scrambleLength))
						.css('font-size','18pt');
	}
	else if (scrambleType == 5)
	{
		$("#scramble").text(generate5x5Scramble(scrambleLength))
						.css('font-size','18pt');
	}
	else if (scrambleType == 6)
	{
		$("#scramble").text(generate6x6Scramble(scrambleLength))
						.css('font-size','16pt');
	}
	else if (scrambleType == 7)
	{
		$("#scramble").text(generate7x7Scramble(scrambleLength))
						.css('font-size','14pt');
	}
	else
	{
		$("#scramble").text(generate3x3Scramble(scrambleLength))
						.css('font-size','18pt');
	}
}

function printTimes()
{
	updateAverages();
	$("#times").text("");
	var sessionObj = JSON.parse(localStorage.getItem("session" + sessionNumber));
	var dataContent = "";
	dataContent = dataContent.concat("<div class=\"btn-toolbar\" role=\"toolbar\" aria-label=\"...\">");
	dataContent = dataContent.concat("<div class=\"btn-group btn-group-xs\" role=\"group\" aria-label=\"...\">");
	dataContent = dataContent.concat("<button type=\"button\" class=\"btn btn-success\" id=\"okButton\">OK</button>");
	dataContent = dataContent.concat("<button type=\"button\" class=\"btn btn-warning\" id=\"plus2Button\">+2</button>");
	dataContent = dataContent.concat("<button type=\"button\" class=\"btn btn-danger\" id=\"DNFButton\">DNF</button>");
	dataContent = dataContent.concat("</div>");
	dataContent = dataContent.concat("<div class=\"btn-group btn-group-xs\" role=\"group\" aria-label=\"...\">");
	dataContent = dataContent.concat("<button type=\"button\" class=\"btn btn-default\" id=\"deleteButton\">X</button>");
	dataContent = dataContent.concat("</div>");
	dataContent = dataContent.concat("</div>");
	$("#" + this.id).attr("data-content", dataContent);
	for (var i = 0; i < sessionObj.numSolves; i++)
	{
		var tableHtml = "<tr>\n<td>" + (i + 1);
		tableHtml = tableHtml.concat("</td>\n<td class=\"timesCell\" id=\"timesCell" + (i + 1) + "\" title=\"<b>");
		if (sessionObj.list[i].penalty == 1)
			tableHtml = tableHtml.concat((+sessionObj.list[i].time + 2).toFixed(3) + "+");
		else if (sessionObj.list[i].penalty == 2)
			tableHtml = tableHtml.concat("DNF(" + sessionObj.list[i].time + 2 + ")");
		else
			tableHtml = tableHtml.concat(sessionObj.list[i].time);
		tableHtml = tableHtml.concat("</b>\" data-container=\"#timesCell" + (i + 1) + "\" data-toggle=\"popover\" data-placement=\"right\" data-content=\"\">");
		if (sessionObj.list[i].penalty == 1)
			tableHtml = tableHtml.concat((+sessionObj.list[i].time + 2).toFixed(3) + "+");
		else if (sessionObj.list[i].penalty == 2)
			tableHtml = tableHtml.concat("DNF");
		else
			tableHtml = tableHtml.concat(sessionObj.list[i].time);
		tableHtml = tableHtml.concat("</td>\n<td class=\"avg5Cell\" id=\"avg5Cell" + (i + 1) + "\" data-toggle=\"modal\" data-target=\"#myModal\">");
		tableHtml = tableHtml.concat(sessionObj.list[i].avg5);
		tableHtml = tableHtml.concat("</td>\n<td class=\"avg12Cell\" id=\"avg12Cell" + (i + 1) + "\" data-toggle=\"modal\" data-target=\"#myModal\">");
		tableHtml = tableHtml.concat(sessionObj.list[i].avg12);
		tableHtml = tableHtml.concat("</td></tr>");
		$("#times").prepend(tableHtml);
	}
	if (sessionObj.numSolves >= 5)
		$("#avg5").text("avg5: " + sessionObj.list[sessionObj.numSolves - 1].avg5);
	else
		$("#avg5").text("avg5: DNF");
	if (sessionObj.numSolves >= 12)
		$("#avg12").text("avg12: " + sessionObj.list[sessionObj.numSolves - 1].avg12);	
	else
		$("#avg12").text("avg12: DNF");
	$(".timesCell").hover(function() {
		typingComment = 1;
		var solveNumber = this.id.substring(9);
		solveIndex = this.id.substring(9);
		$("#" + this.id).attr("title", solveNumber);
		var dataContent = "";
		dataContent = dataContent.concat("<div class=\"btn-toolbar\" role=\"toolbar\" aria-label=\"...\">");
		dataContent = dataContent.concat("<div class=\"btn-group btn-group-xs\" role=\"group\" aria-label=\"...\">");
		dataContent = dataContent.concat("<button type=\"button\" class=\"btn btn-success okButton\" id=\"okButton" + solveIndex + "\"><span class=\"glyphicon glyphicon-ok\" aria-hidden=\"true\"></span></button>");
		dataContent = dataContent.concat("<button type=\"button\" class=\"btn btn-warning plus2Button\" id=\"plus2Button" + solveIndex + "\">+2</button>");
		dataContent = dataContent.concat("<button type=\"button\" class=\"btn btn-danger DNFButton\" id=\"DNFButton" + solveIndex + "\">DNF</button>");
		dataContent = dataContent.concat("</div>");
		dataContent = dataContent.concat("<div class=\"btn-group btn-group-xs\" role=\"group\" aria-label=\"...\">");
		dataContent = dataContent.concat("<button type=\"button\" class=\"btn btn-default deleteButton\" id=\"deleteButton" + solveIndex + "\"><span class=\"glyphicon glyphicon-remove\" aria-hidden=\"true\"></span></button>");
		dataContent = dataContent.concat("</div>");
		dataContent = dataContent.concat("</div>");
		dataContent = dataContent.concat("<input type=\"text\" class=\"form-control input-sm commentInput\" id=\"commentInput" + solveIndex + "\" placeholder=\"comment\">");
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
            		if (!$this.data("hoveringPopover")) {
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
	$(document).on("click", ".okButton", function () {
		solveIndex = this.id.substring(8);
		sessionObj = JSON.parse(localStorage.getItem("session" + sessionNumber));
		sessionObj.list[solveIndex - 1].penalty = 0;
		localStorage.setItem("session" + sessionNumber, JSON.stringify(sessionObj));
		location.reload();
	})
	$(document).on("click", ".plus2Button", function () {
		solveIndex = this.id.substring(11);
		sessionObj = JSON.parse(localStorage.getItem("session" + sessionNumber));
		sessionObj.list[solveIndex - 1].penalty = 1;
		localStorage.setItem("session" + sessionNumber, JSON.stringify(sessionObj));
		location.reload();
	});
	$(document).on("click", ".DNFButton", function () {
		solveIndex = this.id.substring(9);
		sessionObj = JSON.parse(localStorage.getItem("session" + sessionNumber));
		sessionObj.list[solveIndex - 1].penalty = 2;
		localStorage.setItem("session" + sessionNumber, JSON.stringify(sessionObj));
		location.reload();
	});
	$(document).on("click", ".deleteButton", function () {
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
			location.reload();
		}
	});
	$(document).on("click", ".avg5Cell", function () {
		var solveNumber = this.id.substring(8);
		var date = new Date(sessionObj.list[solveNumber - 1].date);
		$("#myModal").css("top", "25%");
		$("#myModalTitle").text("Average of 5: " + sessionObj.list[solveNumber - 1].avg5);
		$("#myModalFooter").html("<p>" + date.toLocaleString() + "</p>");
		$("#myModalBody").text("");
		if (solveNumber >= 5)
		{
			var minIndex = solveNumber - 1, maxIndex = solveNumber - 1, minValue = sessionObj.list[solveNumber - 1].time, maxValue = sessionObj.list[solveNumber - 1].time;
			for (i = solveNumber - 1; i >= solveNumber - 5; i--)
			{
				if (sessionObj.list[i].time > maxValue)
				{
					maxIndex = i;
					maxValue = sessionObj.list[i].time;
				}
				if (sessionObj.list[i].time < minValue)
				{
					minIndex = i;
					minValue = sessionObj.list[i].time;
				}
			}
			if ((minIndex == solveNumber) && (maxIndex == solveNumber))
				minIndex -= 1;
			for (i = 4; i >= 0; i--)
			{
				var modalBody = "";
				modalBody = modalBody.concat("<p>" + (5 - i) + ". ");
				if (((solveNumber - 1 - i) == minIndex) || ((solveNumber - 1 - i) == maxIndex))
					modalBody = modalBody.concat("(");
				if (sessionObj.list[solveNumber - 1 - i].penalty == 1)
					modalBody = modalBody.concat((+sessionObj.list[i].time + 2).toFixed(3) + "+");
				else if (sessionObj.list[solveNumber - 1 - i].penalty == 2)
					modalBody = modalBody.concat("DNF(" + sessionObj.list[solveNumber - 1 - i].time + ")");
				else
					modalBody = modalBody.concat(sessionObj.list[solveNumber - 1 - i].time);
				if (((solveNumber - 1 - i) == minIndex) || ((solveNumber - 1 - i) == maxIndex))
					modalBody = modalBody.concat(")");
				modalBody = modalBody.concat(" " + sessionObj.list[solveNumber - 1 - i].scramble);
				if ((sessionObj.list[solveNumber - 1 - i].comment != null) && (sessionObj.list[solveNumber - 1 - i].comment != ""))
					modalBody = modalBody.concat(" (" + sessionObj.list[solveNumber - 1 - i].comment + ")");
				modalBody = modalBody.concat("</p>");
				$("#myModalBody").append(modalBody);
			}
		}
	});
	$(document).on("click", ".avg12Cell", function () {
		var solveNumber = this.id.substring(9);
		var date = new Date(sessionObj.list[solveNumber - 1].date);
		$("#myModal").css("top", "15%");
		$("#myModalTitle").text("Average of 12: " + sessionObj.list[solveNumber - 1].avg12);
		$("#myModalFooter").html("<p>" + date.toLocaleString() + "</p>");
		$("#myModalBody").text("");
		if (solveNumber >= 12)
		{
			var minIndex = solveNumber - 1, maxIndex = solveNumber - 1, minValue = sessionObj.list[solveNumber - 1].time, maxValue = sessionObj.list[solveNumber - 1].time;
			for (i = solveNumber - 1; i >= solveNumber - 12; i--)
			{
				if (sessionObj.list[i].time > maxValue)
				{
					maxIndex = i;
					maxValue = sessionObj.list[i].time;
				}
				if (sessionObj.list[i].time < minValue)
				{
					minIndex = i;
					minValue = sessionObj.list[i].time;
				}
			}
			if ((minIndex == solveNumber) && (maxIndex == solveNumber))
				minIndex -= 1;
			for (i = 11; i >= 0; i--)
			{
				var modalBody = "";
				modalBody = modalBody.concat("<p>" + (12 - i) + ". ");
				if (((solveNumber - 1 - i) == minIndex) || ((solveNumber - 1 - i) == maxIndex))
					modalBody = modalBody.concat("(");
				if (sessionObj.list[solveNumber - 1 - i].penalty == 1)
					modalBody = modalBody.concat((+sessionObj.list[i].time + 2).toFixed(3) + "+");
				else if (sessionObj.list[solveNumber - 1 - i].penalty == 2)
					modalBody = modalBody.concat("DNF(" + sessionObj.list[solveNumber - 1 - i].time + ")");
				else
					modalBody = modalBody.concat(sessionObj.list[solveNumber - 1 - i].time);
				if (((solveNumber - 1 - i) == minIndex) || ((solveNumber - 1 - i) == maxIndex))
					modalBody = modalBody.concat(")");
				modalBody = modalBody.concat(" " + sessionObj.list[solveNumber - 1 - i].scramble);
				if (sessionObj.list[solveNumber - 1 - i].comment != null)
					modalBody = modalBody.concat(" (" + sessionObj.list[solveNumber - 1 - i].comment + ")");
				modalBody = modalBody.concat("</p>");
				$("#myModalBody").append(modalBody);
			}
		}
	});
}

function updateAverages()
{
	var sessionObj = JSON.parse(localStorage.getItem("session" + sessionNumber));
	for (i = 0; i < sessionObj.list.length; i++)
	{
		if (i >= 4)
		{
			var tempList = [];
			var DNFCount = 0;
			for (j = 0; j < 5; j++)
			{
				if (sessionObj.list[i - j].penalty == 1)
					tempList[j] = (+sessionObj.list[i - j].time + 2).toFixed(3);
				else if (sessionObj.list[i - j].penalty == 2)
				{
					tempList[j] = -1;
					DNFCount += 1;
				}
				else
					tempList[j] = sessionObj.list[i - j].time;
			}
			var minIndex = 0, maxIndex = 0, minValue = tempList[0], maxValue = tempList[0], maxFound = 0;
			if (tempList[0] == -1)
			{
				minIndex = 1;
				minValue = tempList[1];
			}
			for (j = 0; j < 5; j++)
			{
				if (tempList[j] == -1)
				{
					maxIndex = j;
					maxValue = tempList[j];
					maxFound = 1;
				}
				if ((tempList[j] > maxValue) && (maxFound == 0))
				{
					maxIndex = j;
					maxValue = tempList[j].time;
				}
				if ((tempList[j] < minValue) && (tempList[j] > 0))
				{
					minIndex = j;
					minValue = tempList[j].time;
				}
			}
			if ((minIndex == i) && (maxIndex == i))
				minIndex -= 1;
			var sum = 0;
			for (j = 0; j < 5; j++)
				if (!((j == minIndex) || (j == maxIndex)))
					sum += +tempList[j];
			sessionObj.list[i].avg5 = (sum / 3).toFixed(3);
			if (DNFCount > 1)
				sessionObj.list[i].avg5 = "DNF";
		}
		if (i >= 11)
		{
			var tempList = [];
			var DNFCount = 0;
			for (j = 0; j < 12; j++)
			{
				if (sessionObj.list[i - j].penalty == 1)
					tempList[j] = (+sessionObj.list[i - j].time + 2).toFixed(3);
				else if (sessionObj.list[i - j].penalty == 2)
				{
					tempList[j] = -1;
					DNFCount += 1;
				}
				else
					tempList[j] = sessionObj.list[i - j].time;
			}
			var minIndex = 0, maxIndex = 0, minValue = tempList[0], maxValue = tempList[0], maxFound = 0;
			if (tempList[0] == -1)
			{
				minIndex = 1;
				minValue = tempList[1];
			}
			for (j = 0; j < 12; j++)
			{
				if (tempList[j] == -1)
				{
					maxIndex = j;
					maxValue = tempList[j];
					maxFound = 1;
				}
				if ((tempList[j] > maxValue) && (maxFound == 0))
				{
					maxIndex = j;
					maxValue = tempList[j].time;
				}
				if ((tempList[j] < minValue) && (tempList[j] > 0))
				{
					minIndex = j;
					minValue = tempList[j].time;
				}
			}
			if ((minIndex == i) && (maxIndex == i))
				minIndex -= 1;
			var sum = 0;
			for (j = 0; j < 12; j++)
				if (!((j == minIndex) || (j == maxIndex)))
					sum += +tempList[j];
			sessionObj.list[i].avg12 = (sum / 10).toFixed(3);
			if (DNFCount > 1)
				sessionObj.list[i].avg12 = "DNF";
		}
	}
	localStorage.setItem("session" + sessionNumber, JSON.stringify(sessionObj));
}

function generate2x2Scramble(length)
{
    var scramble = "";
    var previousOrientation = -1;
    for (i = 0; i < length; i++)
    {
        var turningOrientation = Math.floor((Math.random() * 3));
        var turningDirection = Math.floor((Math.random() * 3));
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
	var previousMove = -1;
    var secondPreviousMove = -1;
    var scramble = "";
    for (i = 0; i < length; i++)
    {
        var move = Math.floor((Math.random() * 6));
        var direction = Math.floor((Math.random() * 3));
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
    var scramble = "";
    var layersTurned = 0;
    var previousOrientation = -1;
    var temp = -1;
    for (i = 0; i < length; i++)
    {
        var turningOrientation = Math.floor((Math.random() * 3));
        var turningLayer = Math.floor((Math.random() * 3));
        var innerTurningLayer = Math.floor((Math.random() * 2));
        var turningDirection = Math.floor((Math.random() * 3));
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
    var scramble = "";
	var layersTurned = 0;
    var previousOrientation = -1;
    var temp = -1;
    for (i = 0; i < length; i++)
    {
        var turningOrientation = Math.floor((Math.random() * 3));
        var turningLayer = Math.floor((Math.random() * 4));
        var turningDirection = Math.floor((Math.random() * 3));
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
    var scramble = "";
    var layersTurned = 0;
    var previousOrientation = -1;
    var temp = -1;
    for (i = 0; i < length; i++)
    {
        var turningOrientation = Math.floor((Math.random() * 3));
        var turningLayer = Math.floor((Math.random() * 5));
        var innerTurningLayer = Math.floor((Math.random() * 2));
        var turningDirection = Math.floor((Math.random() * 3));
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
    var scramble = "";
    var layersTurned = 0;
    var previousOrientation = -1;
    var temp = -1;
    for (i = 0; i < length; i++)
    {
        var turningOrientation = Math.floor((Math.random() * 3));
        var turningLayer = Math.floor((Math.random() * 6));
        var turningDirection = Math.floor((Math.random() * 3));
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