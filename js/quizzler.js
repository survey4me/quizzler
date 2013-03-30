(function($){
	$(document).ready(function() {
		//---------------------------------------------------------------------
		//Pre-scripted macros
		$.fn.disableSelection = function() {
			return this
            .attr('unselectable', 'on')
            .css('user-select', 'none')
            .on('selectstart', false);
		};
		
		//---------------------------------------------------------------------
		
		onBoardClick = function(event) {
			//alert(event.data.j + " " + event.data.k);
			//$("#board").addClass("animated fadeOut");
			
			//console.log("Is graphic" + event.data.isGraphic); Doesn't work. I need to throw it in the setup Click call when the board is built.
			
			var graphic_pattern = /.*\.(png|gif|jpg)/
			var audio_pattern = /.*\.(ogg|mp3|opus|wav)/
			//var video_pattern = /.*\.(ogv|avi|mp4)/; Unused for now.
			var target;
			
			if (graphic_pattern.test(event.data.answer))
				$("#game").append(ich.answer_img_template({answer : event.data.answer}));
			else if (audio_pattern.test(event.data.answer))
				$("#game").append(ich.answer_audio_template({answer : event.data.answer}));
			else
				$("#game").append(ich.answer_text_template({answer : event.data.answer}));
				
				
			$("#game").append(ich.question_text_template({question : event.data.question}).hide());
			target = $("#game").children().last();
			$(".answerbox").disableSelection();
			$(".questionbox").disableSelection();
			$(".answerbox").dblclick(function(){target.show();$(".answerbox").remove();}); //couldn't select just the newly created question otherwise.
			$(".questionbox").dblclick(function(){$("#board").fadeIn(); $(".questionbox").remove();}); //couldn't select just the newly created question otherwise.
			
			$("#board").fadeOut();
		};
		
		//---------------------------------------------------------------------
		//Initialization of board
		
		
		$.getJSON("quiz/quiz_data.json", function(json) {
			var quizData = json.quiz_data;
		
			//prepare board
			var board = ich.board_template();
			$("#game").append(board);
			var round = quizData.rounds[0];
			var topics = round.topics;
		
			//Although the JSON is in Column-major order for ease of organization in the JSON,
			//Gridiculous is grouped by row, so we have to access it across columns by row.
			var row = board.append('<div class="row">').children().last();
			
			for (var i = 0; i < topics.length; i++){
				row.append(ich.topic_template({"topic" : topics[i].name}));
			}
			
			row = row.parent();
		
			//last column is end column for topics
			row.children().last().addClass("end");
			
			for (var k = 0; k < 5; k++){
				for (var j = 0; j < topics.length; j++){
					var x = ich.answer_template({"value" : topics[j].questions[k].value});
					x.dblclick({answer : topics[j].questions[k].answer, question : topics[j].questions[k].question }, onBoardClick);
					row.append(x);
				}
				//add end to last column per row
				row.children().last().addClass("end");
			}
			
			board.disableSelection();
			
		});
	});
})(jQuery);
