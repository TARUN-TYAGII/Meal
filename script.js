// its make a favourites meal array if its not exist in local storage
if (localStorage.getItem("favouritesList") == null) {
  localStorage.setItem("favouritesList", JSON.stringify([]));
}

// its fetch meals from api and return it
async function fetchMealsFromApi(url, value) {
  const response = await fetch(`${url + value}`);
  const meals = await response.json();
  return meals;
}

// its show's all meals card in main acording to search input value
function showMealList() {
  let inputValue = document.getElementById("my-search").value;
  let arr = JSON.parse(localStorage.getItem("favouritesList"));
  let url = "https://www.themealdb.com/api/json/v1/1/search.php?s=";
  let html = "";
  let meals = fetchMealsFromApi(url, inputValue);
  meals.then((data) => {
    // if we get the searched meal in the given API
    if (data.meals) {
      data.meals.forEach((element) => {
        let isFav = false;
        for (let index = 0; index < arr.length; index++) {
          if (arr[index] == element.idMeal) {
            isFav = true;
          }
        }
        //if part is for the case when the meal is in fav meal list.
        if (isFav) {
          html += `
                <div id="card" class="card mb-3" style="width: 20rem;">
                    <img src="${element.strMealThumb}" class="card-img-top" alt="meal-image">
                    <div class="card-body">
                        <h5 class="card-title">${element.strMeal}</h5>
                        <div class="d-flex justify-content-between mt-5">
                            <button type="button" class="btn btn-outline-light" onclick="showMealDetails(${element.idMeal})">More Details</button>
                            <button id="main${element.idMeal}" class="btn btn-outline-light active" onclick="addRemoveToFavList(${element.idMeal})" style="border-radius:50%"><i class="fa-solid fa-heart"></i></button>
                        </div>
                    </div>
                </div>
                `;
          //else part is for the case when the meal is not fav meal list.
        } else {
          html += `
                <div id="card" class="card mb-3" style="width: 20rem;">
                    <img src="${element.strMealThumb}" class="card-img-top" alt="meal-image">
                    <div class="card-body">
                        <h5 class="card-title">${element.strMeal}</h5>
                        <div class="d-flex justify-content-between mt-5">
                            <button type="button" class="btn btn-outline-light" onclick="showMealDetails(${element.idMeal})">More Details</button>
                            <button id="main${element.idMeal}" class="btn btn-outline-light" onclick="addRemoveToFavList(${element.idMeal})" style="border-radius:50%"><i class="fa-solid fa-heart"></i></button>
                        </div>
                    </div>
                </div>
                `;
        }
      });
    } else {
      // this is for the case when we don't get the searched meal in the API.
      html += `
            <div class="page-wrap d-flex flex-row align-items-center">
                <div class="container">
                    <div class="row justify-content-center">
                        <div class="col-md-12 text-center">
                           
                            <div class="mb-4 lead" style="color: black">
                                The meal you are looking for was not found.
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            `;
    }

    // Here we add the above html in the page.
    document.getElementById("main").innerHTML = html;
  });
}

//its shows full meal details in main
async function showMealDetails(id) {
  let url = "https://www.themealdb.com/api/json/v1/1/lookup.php?i=";
  let html = "";
  await fetchMealsFromApi(url, id).then((data) => {
    html += `
          <div id="meal-details" class="mb-5">
            <div id="meal-header" class="d-flex justify-content-around flex-wrap">
              <div id="meal-thumbail">
                <img class="mb-2" src="${data.meals[0].strMealThumb}" alt="meal-image" srcset="">
              </div>
              <div id="details">
                <h3>${data.meals[0].strMeal}</h3>
                <h6>Category : ${data.meals[0].strCategory}</h6>
                <h6>Area : ${data.meals[0].strArea}</h6>
              </div>
            </div>
            <div id="meal-instruction" class="mt-3">
              <h5 class="text-center">Instruction :</h5>
              <p>${data.meals[0].strInstructions}</p>
            </div>
            <div class="text-center">
              <a href="${data.meals[0].strYoutube}" target="_blank" class="btn btn-outline-light mt-3">Watch Video</a>
            </div>
          </div>
        `;
  });

  // Adding the above html in the main to show the details of the searched meal.
  document.getElementById("main").innerHTML = html;
}

// it shows all favourites meals in favourites body
async function showFavMealList() {
  let arr = JSON.parse(localStorage.getItem("favouritesList"));
  let url = "https://www.themealdb.com/api/json/v1/1/lookup.php?i=";
  let html = "";
  if (arr.length == 0) {
    // when there is no meal in the favorite meal list.
    html += `
            <div class="page-wrap d-flex flex-row align-items-center">
                <div class="container">
                    <div class="row justify-content-center">
                        <div class="col-md-12 text-center">
                            
                            <div class="mb-4 lead" style="color: black">
                                No meal added in your favourites list.
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            `;
  } else {
    for (let index = 0; index < arr.length; index++) {
      await fetchMealsFromApi(url, arr[index]).then((data) => {
        html += `
                <div id="card" class="card mb-3" style="width: 20rem;">
                    <img src="${data.meals[0].strMealThumb}" class="card-img-top" alt="meal-image">
                    <div class="card-body">
                        <h5 class="card-title">${data.meals[0].strMeal}</h5>
                        <div class="d-flex justify-content-between mt-5">
                            <button type="button" class="btn btn-outline-light" onclick="showMealDetails(${data.meals[0].idMeal})">More Details</button>
                            <button id="main${data.meals[0].idMeal}" class="btn btn-outline-light active" onclick="addRemoveToFavList(${data.meals[0].idMeal})" style="border-radius:50%"><i class="fa-solid fa-heart"></i></button>
                        </div>
                    </div>
                </div>
                `;
      });
    }
  }
  // Adding the html to show the list of the fav meals in the page.
  document.getElementById("favourites-body").innerHTML = html;
}

//its adds and remove meals to favourites list
function addRemoveToFavList(id) {
  let arr = JSON.parse(localStorage.getItem("favouritesList"));
  let contain = false;
  for (let index = 0; index < arr.length; index++) {
    if (id == arr[index]) {
      contain = true;
    }
  }

  // if the meal is in the favorite list then we will remove that meal from the list.
  if (contain) {
    let number = arr.indexOf(id);
    arr.splice(number, 1);
    alert("your meal removed from your favourites list");
  } else {
    // if the meal is not in the favorite list then we will add that meal in the list.
    arr.push(id);
    alert("your meal add your favourites list");
  }
  // here we will update the local storage and meallist and favMeallist.
  localStorage.setItem("favouritesList", JSON.stringify(arr));
  showMealList();
  showFavMealList();
}
