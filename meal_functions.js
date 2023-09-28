// Creating a  list in localstorage if it's not there
if (localStorage.getItem("favMeals") == null) {
  localStorage.setItem("favMeals", JSON.stringify([]));
}

//It fetch the meals from mealdb api by combining api and key that dynamically passed
async function fetch_from_api(url, val) {
  const resp = await fetch(`${url + val}`);
  const meal_list = await resp.json();
  return meal_list;
}

//This function will provide the details in form of a list and it's percistent
async function showFavouriteMeals() {
  let arr = JSON.parse(localStorage.getItem("favMeals"));
  let url = "https://www.themealdb.com/api/json/v1/1/lookup.php?i=";
  let fav_body = "";

  if (arr.length >0) {
    for (let i = 0; i < arr.length; i++) {
      await fetch_from_api(url, arr[i])
        .then((e) => {
          fav_body += `
        <div id="card" class="card mb-3" style="width: 20rem">
            <img src="${e.meals[0].strMealThumb}" class="card-img-top" alt="${e.meals[0].strMeal}__image">
            <div class="card-body">
              <h5 class="card-title">${e.meals[0].strMeal}</h5>
              <div class="d-flex justify-content-between mt-5">
                <button type="button" class="btn btn-outline-dark" onclick="showMealDetail(${e.meals[0].idMeal})">More Info</button>
                <button id="add${e.meals[0].idMeal}" type="button" class="btn btn-danger" style="font-size:1.2rem" data-toggle="tooltip" data-placement="right" title=" Add on to your favourites"
                onclick="addToandRemovefromFavs(${e.meals[0].idMeal})"><i class="fa-regular fa-heart"></i>
              </button>
                </div>
              </div>
          </div>

        `;
        })
        .catch((err) => {
          console.log(err);
        });
    }
  } else {
    fav_body += `
          <div class="page-wrap d-flex flex-row align-items-center">

                <div class="container">
                  <div class="row justify-content-center">
                    <div class="col-md-12 text-center">
                      <span class="display-3 d-block">Try to find your favourites</span>
                      <div class="mb-4 lead">
                        No Meal is in your favourites list
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              `;
  }
  document.getElementById("favs").innerHTML = fav_body;
}
// This function helps to add and remove item from the list.
function addToandRemovefromFavs(id) {
  document.getElementById("main").innerHTML = "";
  let arr = JSON.parse(localStorage.getItem("favMeals"));
  let present_in_the_lst = false;

  for (let i = 0; i < arr.length; i++) {
    if (arr[i] == id) {
      present_in_the_lst = true;
    }
  }
  if (present_in_the_lst) {
    //On toggle now remove from list
    let item_present_id = arr.indexOf(id);
    arr.splice(item_present_id, 1);
    alert(`Item got removed from your favurites`);
  } else {
    //On toggle add to list
    arr.push(id);
    alert(`Item got added into your favurites`);
  }
  localStorage.setItem("favMeals", JSON.stringify(arr));

  displayMeals();
  showFavouriteMeals();
}

//This function helps to populate the meal details
async function showMealDetail(id) {
  let url = "https://www.themealdb.com/api/json/v1/1/lookup.php?i=";
  let body_html = "";

  await fetch_from_api(url, id).then((data) => {
    console.log(data);
    body_html += `
  <div class="card mb-3" style="width:40rem">
  <img class="card-img-top" src="${data.meals[0].strMealThumb}" alt="Card image cap" width:746 height=450>
  <div class="card-body">
    <h3 class="card-title text-center">${data.meals[0].strMeal}</h3><br>
    <h5 class="card-title text-center"> ${data.meals[0].strCategory}</h5>
    <p class="card-text">${data.meals[0].strInstructions}</p>
    <div class="d-flex justify-content-between mt-5">
    <a href="${data.meals[0].strYoutube}"  target="_blank" class="btn btn-dark">Directions to prepare</a>
    <button type="button" class="btn btn-dark" style:"font-size:2.5rem" onclick="displayMeals()"><i class="far fa-window-close"></i></button>
    </div>
  </div>
</div>
`;
  });
  document.getElementById("main").innerHTML = body_html;
}

//On search for a particular meal this function helps to display the related meals according to the search.
function displayMeals() {
  let url = "https://www.themealdb.com/api/json/v1/1/search.php?s=";
  let ip = document.getElementById("search_id_ip").value;
  let arr = JSON.parse(localStorage.getItem("favMeals"));
  let meals = fetch_from_api(url, ip);
  let main_body = "";
  meals
    .then((meal_data) => {
      if (meal_data.meals) {
        meal_data.meals.forEach((e) => {
          main_body += `
          <div id="card" class="card mb-3" style="width: 20rem">
            <img src="${e.strMealThumb}" class="card-img-top" alt="${e.strMeal}__image">
            <div class="card-body">
              <h5 class="card-title">${e.strMeal}</h5>
              <div class="d-flex justify-content-between mt-5">
                <button type="button" class="btn btn-outline-dark" onclick="showMealDetail(${e.idMeal})">More Info</button>
                <button id="add${e.idMeal}" type="button" class="btn btn-danger" style="font-size:1.2rem" data-toggle="tooltip" data-placement="right" title=" Add on to your favourites"
                onclick="addToandRemovefromFavs(${e.idMeal})"><i class="fa-regular fa-heart"></i>
               </button>
               </div> 
       
            </div>
          </div>
          `;
        });
      } else {
        main_body += `
        <div class="page-wrap d-flex flex-row align-items-center">
          <div class="container">
            <div class="row justify-content-center">
              <div class="col-md-12 text-center">
                <span class="display-1 d-block">404</span>
                <div class="mb-4 lead">
                  Oh no! We are not able to find your search
                </div>
              </div>
            </div>
          </div>
        </div>
      `;
        // meal_data.meals.forEach((el) => {
        //   console.log(el.strMeal);
        // });
      }

      document.getElementById("main").innerHTML = main_body;
    })
    .catch((err) => console.log(err));
}
