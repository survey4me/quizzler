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
			var game = event.data.game;
			var board = event.data.board;
			var answer;
			var question;

			answer = ich.answer_text_template({answer : event.data.jsonData.answer});
			question = ich.question_text_template({question : event.data.jsonData.question}).hide()
				
			game.append(answer);
			game.append(question);

			answer.disableSelection();
			answer.dblclick(function(){question.fadeIn(); answer.remove();});

			question.disableSelection();
			question.dblclick(function(){board.fadeIn(); question.remove();});
			
			board.fadeOut();
		};
		
		//---------------------------------------------------------------------
		//Initialization of board
		
		
		$.getJSON("quiz/quiz_data.json", function(json) {
			var game = $("#game");
			var quizData = json.quiz_data;
		
			//prepare board
			var board = ich.board_template();
			game.append(board);
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
					x.dblclick({jsonData : topics[j].questions[k], board : board, game : game }, onBoardClick);
					row.append(x);
				}
				//add end to last column per row
				row.children().last().addClass("end");
			}
			
			board.disableSelection();
			
		});
	});
})(jQuery);
