$(function(){
	var model = {
		init: function(){
			var imgs = ['01.png','02.jpg','03.jpg','04.jpg','05.jpg'];
			var names = ['Brave','Up side down','pretty wall','ink ballarena','My Imaginary piece of the World'];
			var data = [];
			for(var i = 0; i < imgs.length; i++)
				data.push({_id:i,cat:names[i],src:"imgs/" + imgs[i],clicks:0});
			localStorage.cats = JSON.stringify(data);
		},
		updateCount: function(cat_id){
			var data = JSON.parse(localStorage.cats);
			data[cat_id].clicks++;
			localStorage.cats = JSON.stringify(data);
		},
		updateCat: function(cat_id, new_cat){
			var data = JSON.parse(localStorage.cats);
			data[cat_id] = new_cat;
			localStorage.cats = JSON.stringify(data);
		},
		getAllCats: function(){
			return JSON.parse(localStorage.cats);
		},
		adminPin: '0000',
		adminSession: false
	};

	var octopus = {
		getCats: function(){
			return model.getAllCats();
		},
		updateCount: function(cat_id){
			model.updateCount(cat_id);
			view.render(cat_id);
		},
		getPin: function(){
			return model.adminPin;
		},
		getSession: function(){
			return model.adminSession;
		},
		logAdmin: function(){
			model.adminSession = true;
		},
		updateCat: function(cat_id, new_cat){
			model.updateCat(cat_id, new_cat);
			view.dismissAdminPanel();
			view.render(cat_id);
		},
		init: function(){
			model.init();
			view.init();
			view.btnEvents();
		}
	};

	var view = {
		init: function(){
			octopus.getCats().forEach(function(cat){
				// insert cats into DOM
				$('#content').append('<div id="clicks-' + cat._id + '"><img src="' + cat.src + '" ><h4>Clicks: <span>' + cat.clicks + '</span></h4></div>');
			});

			view.render(0);
			view.updateEditForm(0);
		},
		render: function(cat_id){
			// initialy render the first Cat
			view.renderSingle(cat_id);

			octopus.getCats().forEach(function(cat){
				// insert cats into DOM
				$('#clicks-' + cat._id + ' h4 span').text(cat.clicks);
			});
		},
		btnEvents: function(){
			octopus.getCats().forEach(function(cat){
				// add click listeners
				var btns = document.getElementById('clicks-' + cat._id);
				btns.addEventListener('click', (function(catCopy){
					return function(){
						console.log(catCopy._id);
						octopus.updateCount(catCopy._id);
						view.updateEditForm(catCopy._id);
					}
				})(cat));
			});
		},
		renderSingle: function(cat_id){
			$('#showroom h1').text(octopus.getCats()[cat_id].cat);
			$('#showroom h1').append(' <a href="#"> .Edit</a>');
			$('#showroom img').attr('src', octopus.getCats()[cat_id].src);
			$('#showroom h4 span').text(octopus.getCats()[cat_id].clicks);
			$('#showroom h1 a').click(function(e){
				e.preventDefault();
				view.requestPin();
			});
		},
		requestPin: function(){
			if(!octopus.getSession())
				view.renderPinForm();
			else
				view.dismissPinForm();
			
			$('#pin').on('keyup', function(){
				if($(this).val() == octopus.getPin()){
					octopus.logAdmin();
					view.dismissPinForm();
				}
			});
		},
		renderPinForm: function(){
			$('#pop').css('display','flex');
			$('#pop #dismiss').click(function(e){
				e.preventDefault();
				view.dismissPinForm();
			});
		},
		dismissPinForm: function(){
			$('#pop').fadeOut();
			if(octopus.getSession()){
				$('#showroom').addClass('edit');
				$('#admin').show();
				$('#cancel-edit').click(function(e){
					e.preventDefault();
					view.dismissAdminPanel();
				});
			}
		},
		updateEditForm: function(cat_id){
			$('#admin #cat-id').val(cat_id);
			$('#admin #cat-name').val(octopus.getCats()[cat_id].cat);
			$('#admin #cat-img').val(octopus.getCats()[cat_id].src);
			$('#admin #cat-clicks').val(octopus.getCats()[cat_id].clicks);
			$('#submit-edit').click(function(e){
				e.preventDefault();
				var update_cat = {
					_id: $('#admin #cat-id').val(),
					cat: $('#admin #cat-name').val(),
					src: $('#admin #cat-img').val(),
					clicks: $('#admin #cat-clicks').val()
				};
				octopus.updateCat($('#admin #cat-id').val(), update_cat);
			});
		},
		dismissAdminPanel: function(){
			$('#showroom').removeClass('edit');
			$('#admin').hide();
		}
	}

	octopus.init();
});
