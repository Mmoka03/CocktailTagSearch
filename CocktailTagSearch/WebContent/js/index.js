const hover = document.querySelectorAll(".cocktailItems");
const hoverSize = hover.length;
const search = document.querySelector("#searchText");
const autocomplete = document.querySelector("#autocompleteTagsContents");
var autocompleteTag = document.querySelectorAll(".autocompleteTags");

var autocompleteTagList = [];
var selectTagList = [];

var save_search_sentence = "";

$(document).ready(loadData);

search.addEventListener("keyup", showNotFound);
search.addEventListener("keydown", hideComplete);
search.addEventListener("input", getAutocompleteTags);
search.addEventListener('input', getCocktailItems);

search.addEventListener("focus", function() {
  autocomplete.style.display = "block";
});

search.addEventListener("focusout", function() {
  autocomplete.style.display = "none";
});

// 모든 칵테일이 표시가 안될 때 Not Found 표시
function showNotFound() {
  if($('.cocktailItems').length < 0) {
    document.querySelector(".cocktailNotFound").style.display = "flex";
  } else {
    document.querySelector(".cocktailNotFound").style.display = "none";
  }
}

// 자동완성 미리보기 감추기
function hideComplete() {
  if(search.style.color == "gray") {
    search.value = save_search_sentence;
    search.style.color = "black";
  }
}

// 자동완성 미리보기 표시하기
function showComplete() {
  save_search_sentence = search.value;
  search.value = this.textContent;
  search.style.color = "gray";
}

// 자동완성 창 숨기기
function hideAutocomplete() {
  autocomplete.style.display = "none";
}

// 칵테일의 제목 및 태그 숨기기
function styleAppendOver() {
    const tag = this.querySelectorAll(".itemTags");
    const title = this.querySelector(".itemTitle");

    for(var j=0; j<tag.length; j++) {
        tag[j].style.visibility = "visible";
    }
    title.style.visibility = "visible";
}

// 칵테일의 제목 및 태그 표시하기
function styleAppendOut() {
    const tag = this.querySelectorAll(".itemTags");
    const title = this.querySelector(".itemTitle");

    for(var j=0; j<tag.length; j++) {
        tag[j].style.visibility = "hidden";
    }
    title.style.visibility = "hidden";
}

function addTag() {

  var value, input;
  var tag = document.createElement("div");
  tag.setAttribute("class", "searchTags"); 
  tag.addEventListener("click", removeTag);

  value = this.textContent.toUpperCase();
  tag.innerText = value;
  input = document.getElementById("searchTagsContents");

  input.appendChild(tag);

  for(var i=0;i<autocompleteTagList.length;i++) {
    if(value === autocompleteTagList[i].name) {
      selectTagList.push(autocompleteTagList[i]);
      break;
    }
  }

  this.parentNode.removeChild(this);

  setTimeout(function() {  
    search.value = "";
	getAutocompleteTags();
	getCocktailItems();
    showNotFound();
  }, 0.001);
}

function removeTag() {
  var thisName = this.textContent;
    $.each(selectTagList, function(index, item) {
      if(item.name === thisName) {
        selectTagList.splice(index, 1);
		return false;
      }
    })

    this.parentNode.removeChild(this);

	getAutocompleteTags();
	getCocktailItems();
    showNotFound();

}

function getAutocompleteTags() {
  $.ajax({
		type:"post",
		url:"http://localhost:8090/CocktailTagSearch/TagSearch",
		dataType:"json",
		data: {
		  search: $("#searchText").val(),
	      tags: JSON.stringify(selectTagList)
		},
		success:function(data) {
			if(data === "")
			  return;
      $("#autocompleteTagsContents").html("");
      autocompleteTagList = [];
      $.each(data.tags, function(index, item) {
        createTag(index, item);
        autocompleteTagList.push({name:item.name, id:item.id});
      });

	    
	autocompleteTag = document.querySelectorAll(".autocompleteTags");
			$.each(autocompleteTag, function(index, item) {
        item.addEventListener("mouseover", showComplete);
	      item.addEventListener("mouseout", hideComplete);
        item.addEventListener("mousedown", addTag);
      });
	  }   
  });
}

function getCocktailItems() {
  $.ajax({
    type:"post",
		url:"http://localhost:8090/CocktailTagSearch/CocktailSearch",
    dataType:"json",
		data: {
		  search: $("#searchText").val(),
	      tags: JSON.stringify(selectTagList)
		},
    success:function(data) {
      $('.cocktailItems').remove();
	    if(data != null) {
	    $.each(data.cocktails, createCocktail);
		  $('.cocktailItems').each(function(index, item) {
            item.addEventListener("mouseover", styleAppendOver);
            item.addEventListener("mouseout", styleAppendOut);
          });
	    }
	  }
  });
}

function loadData() {
	getSessionData();
	getAutocompleteTags();
	getCocktailItems();
}

function createTag(index, item) {
	$('#autocompleteTagsContents').append($('<div/>', {
      class: "autocompleteTags",
      text: item.name
    }));
}

function createCocktail(index, item) {
    var cocktail = $('#template').clone();
    cocktail.attr('style', 'display:flex');
    cocktail.attr('class', 'cocktailItems');
    cocktail.removeAttr('id');   
 	cocktail.children('a').attr('href', 'Cocktail_post.jsp?id='+item.id);
    cocktail.find('img').attr('src', item.image);
    cocktail.find('img').attr('alt', item.name);
    cocktail.children('.itemTitle').text(item.name);
    cocktail.children('.itemTitle').attr('desc', item.name);
    $.each(item.tags, function(index, tag_item) {
      cocktail.children('.itemTagsBox').append($('<div/>', {
        class: "itemTags",
		desc: tag_item.desc,
        text: tag_item.name
      }));
    });

    $('#cocktailContents').append(cocktail);
}

function getSessionData() {
  $.ajax({
    type:"post",
	  url:"http://localhost:8090/CocktailTagSearch/SessionData",
    success: function(data) {
      if(data.signed == "0") {
        var html = "<a href='login.html'>로그인</a>\n<a href='signup.jsp'>회원가입</a>";
        $('#sign').append(html);
      } else {
        var html = "<p>" + data.user.name + "님 안녕하세요.</p>\n<a href='javascript:logout()'>로그아웃</a>\n<a href='myPage.html'>마이페이지</a>";
        $('#sign').append(html);
      }
    }
  });
}

function logout() {
  fetch('http://localhost:8090/CocktailTagSearch/Logout');
  location.reload();
}