"use strict";

let comments=[];

comments.push(new Comment('Тонни Вильена', new Date("2022-10-27T22:11"),'Как болельщику Реала мне очень жаль. Прекрасный президент, лучший в барсе за многие годы.'));
comments.push(new Comment('Huliganjetta', new Date("2023-02-19T13:51"),'Это плохая компания, я так на фитнес зал попадал - цен не было. Так только долбоебы конченные могут сделать, без цены же тупо продавать. Я всегда покупаю где есть ценники.'));
comments.push(new Comment('KARPOEB', new Date("2023-03-12T09:05"),'И не Карпоеб, я Каяроев, фамилия такая.'));
comments.push(new Comment('Проверка', new Date("2023-03-13T11:40"),'Удаленный комментарий'));
comments.push(new Comment('El Terrible', new Date("2023-03-14T10:20"),'Мдеее… Со времен Барсы и Эвребе я не видел такого жесткого подсуживания. Похоже нужно и МС проверять на предмет проплаты судей. Это дичь просто. Судя оп всему, шейхи воспользовались опцией «отключить электронных помощников»'));
comments.push(new Comment('Dmitry Pavlov', new Date("2023-03-15T07:40"),'А зачем извращения эти? Можно, конечно, вилкой суп есть, а макароны ложкой. Но зачем?'));
comments[3].delete=true;
comments[0].like=true;
comments[4].like=true;

let commList = document.querySelector('.comments__list');
let commTitleSum = document.querySelector('.comments__title').querySelector('span');
let form = document.querySelector('.comments__form');
let nameError=false;
let textError=false;
let dateError=false;
let nameErrorMsg;
let textErrorMsg;
let dateErrorMsg;

showAllComments(comments);

form.onsubmit = function(event) {	
	event.preventDefault();	
	addComment();			
};

form.addEventListener('keydown', function(event) {	
	if (event.key == 'Enter') {
		event.preventDefault();
		document.activeElement.blur();
		addComment();			
	}
})

form.name.onfocus = function() { clearNameError() };
form.text.onfocus = function() { clearTextError() };
form.date.onfocus = function() { clearDateError() };

commList.addEventListener('click', function(event) {
	if (event.target.tagName == 'IMG' && event.target.alt == 'delete') {
		deleteComment(event.target);
	}
	if (event.target.tagName == 'IMG' && event.target.alt == 'like') {
		likeComment(event.target);
	}
})

function checkInputErrors() {
	let result = false;
	if (form.name.value.length < 3) {
		form.name.classList.add('comments__error');
		nameErrorMsg=document.createElement('span');
		nameErrorMsg.textContent='Имя должно быть длиной минимум 3 символа';
		nameErrorMsg.className="comments__error-message";
		form.name.after(nameErrorMsg);		
		nameError=true;
		result=true;		
	}
	if (form.text.value.length < 3 || form.text.value.length > 1500) {
		form.text.classList.add('comments__error');
		textErrorMsg=document.createElement('span');
		textErrorMsg.textContent='Длина комментария должна составлять от 3 до 1500 символов';
		textErrorMsg.className="comments__error-message";
		form.text.after(textErrorMsg);		
		textError=true;
		result=true;	
	}
	if ( (form.date.value) && Date.parse(form.date.value)-Date.now()>0 ) {
		form.date.classList.add('comments__error');
		dateErrorMsg=document.createElement('span');
		dateErrorMsg.textContent='Дата не может превышать текущую';
		dateErrorMsg.className="comments__error-message";
		form.date.after(dateErrorMsg);		
		dateError=true;
		result=true;	
	}
	return result
}

function clearNameError() {
	if (nameError) {
		nameError=false;
		nameErrorMsg.remove();
		form.name.classList.remove('comments__error');
	}
}

function clearTextError() {
	if (textError) {
		textError=false;
		textErrorMsg.remove();
		form.text.classList.remove('comments__error');
	}
}

function clearDateError() {
	if (dateError) {
		dateError=false;
		dateErrorMsg.remove();
		form.date.classList.remove('comments__error');
	}
}

function clearErrors() {
	clearNameError();
	clearTextError();
	clearDateError();
}

function addComment() {
	clearErrors();
	if (checkInputErrors()) return;
	if (!confirm('Добавить комментарий?')) return;
	let name = form.name.value;
	let text = form.text.value;
	let date = new Date();
	if (form.date.value) {
		let fd = new Date(form.date.value)
		date.setDate(fd.getDate());
		date.setMonth(fd.getMonth());
		date.setFullYear(fd.getFullYear());
	}
	comments.push(new Comment(name,date,text));
	showComment(comments[comments.length-1], comments.length-1);
	commTitleSum.innerHTML = '('+ ( parseInt( commTitleSum.innerHTML.slice(1) )+1 ) +')';
	form.text.value='';
	form.date.value='';
}

function showAllComments(comments) {
	if (!comments) return;
	let counter=0;
	for (let i=0; i < comments.length; i++) {
		if (!comments[i].delete) {
			showComment(comments[i], i);
			counter++;
		}
	}
	commTitleSum.innerHTML = '('+counter+')';
}

function showComment(comment, index) {
	let newDiv = document.createElement('div');
	newDiv.className = 'comments__comment-body';
	newDiv.dataset.index = index;
	let imgsrc = (comment.like) ? 'src="img/like-true.png" title="Убрать лайк"' : 'src="img/like-false.png" title="Поставить лайк"';
	newDiv.innerHTML = `<div class="comments__comment-header" data-index="${index}">
	<div class="comments__header-text" data-index="${index}"><div class="comments__comment-user"
	 data-index="${index}">${comment.name}</div><div class="comments__comment-date" data-index="${index}">
	 ${formatDate(comment.date)}</div></div><div class="comments__header-icons"><div class="comments__icon-like"
	  data-index="${index}"><img ${imgsrc} alt="like" data-index="${index}"></div><div class="comments__icon-delete"
	   data-index="${index}"><img src="img/delete.png" alt="delete" title="Удалить комментарий" data-index="${index}"></div></div></div>
		<div class="comments__comment-text" data-index="${index}">${comment.text}</div>`;
	commList.append(newDiv);
}


function likeComment(target) {
	comments[target.dataset.index].like = !comments[target.dataset.index].like;
	target.src = "img/like-"+comments[target.dataset.index].like+".png";
	target.title = (comments[target.dataset.index].like) ? "Убрать лайк" : "Поставить лайк";
}

function deleteComment(target) {
	let comment = target.closest('.comments__comment-body');
	comments[target.dataset.index].delete=true;
	comment.remove();
	commTitleSum.innerHTML = '('+ ( parseInt( commTitleSum.innerHTML.slice(1) )-1 ) +')';
}

function formatDate(date) {
	let dateNow = new Date();	
	let d = '';
	if ( (dateNow-date < 60*60*24*1000) && (dateNow.getDate() == date.getDate()) ) {
		d = "Сегодня,";
	} else if ( (dateNow-date < 60*60*48*1000) && ( (dateNow.getDate()-1) == date.getDate()) ) {
		d = "Вчера,"
	} else {
		let dd = ( date.getDate() < 10 ) ? '0'+date.getDate() : date.getDate();
    	let mm = ( (date.getMonth()+1) < 10 ) ? '0'+(date.getMonth()+1) : date.getMonth()+1;
    	let yy = date.getFullYear() % 100;
		d = dd+'.'+mm+'.'+yy;
	}	
	let h = ( date.getHours() < 10 ) ? '0'+date.getHours() : date.getHours();
   let m = ( date.getMinutes() < 10 ) ? '0'+date.getMinutes() : date.getMinutes();	
	return d+' '+h+':'+m;
}

function Comment(name, date, text) {
	this.name = name;
	this.date = date;
	this.text = text;
	this.like = false;
	this.delete = false;
}







