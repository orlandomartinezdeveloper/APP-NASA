function createCard(title, description, image_url, image_description) {
    let card_el = document.createElement('article');
    card_el.classList.add('card', 'mb-2', 'p-0', 'col-sm-3');

    let image_el = createImg(image_url, image_description);
    image_el.classList.add('card-img-top');

    let card_body_el = document.createElement('div');
    card_body_el.classList.add('card-body');

    let card_title_el = document.createElement('h3');
    card_title_el.textContent = title;
    card_title_el.classList.add('card-title');

    let card_description_el = document.createElement('p');
    card_description_el.textContent = description;
    card_description_el.classList.add('card-text');

    card_el.appendChild(image_el);

    card_body_el.appendChild(card_title_el);
    card_body_el.appendChild(card_description_el);

    card_el.appendChild(image_el);
    card_el.appendChild(card_body_el);

    return card_el;
}

function createImg(url, description) {
    let el;
    if (url && description) {
        el = document.createElement("img");
        el.src = url;
        el.alt = description;
    } else {
        el = document.createElement("div");
        el.classList.add("img-sample");
    }
    return el;
}

function createSampleCard() {
    return createCard("Carregando...", "...");
}

class ApiConnection {
    constructor() {
    }

    get API_URL() {
        return "https://api.nasa.gov/planetary/apod";
    }

    get API_KEY() {
        return "DEMO_KEY";
    }


    async getRandomImages(count) {
        const request_url = this.API_URL + "?api_key=" + this.API_KEY + "&count=" + count;

        const resp = await fetch(request_url);
        if (resp.ok) {
            return await resp.json();
        }
        throw new Error('Error fetching API, status: ' + resp.status);
    }
    async getImagesForDateRange(start_date, end_date) {
        let request_url = this.API_URL + "?api_key=" + this.API_KEY;
        if (end_date) {
            request_url += "&start_date=" + start_date + "&end_date=" + end_date;
        } else {
            request_url += "&start_date=" + start_date;
        }

        const resp = await fetch(request_url);
        if (resp.ok) {
            return await resp.json();
        }
        throw new Error("Error fetching API, status: " + resp.status);
    }
}
document.addEventListener("DOMContentLoaded", function startApp() {
    const search_results_el = document.getElementById("search-result");
    const search_form_el = document.getElementById("search-form");
    const search_type_option_els = document.querySelectorAll("[name=search-type]");
    const api_connection = new ApiConnection();
    for (let i = 0; i < 10; i++) {
        search_results_el.appendChild(createSampleCard());
    }

    api_connection.getRandomImages(10)
        .then(results => {
            search_results_el.innerHTML = "";
            results.forEach(result => {
                search_results_el.appendChild(createCard(result.title, truncateText(result.explanation, 150),
                    result.url, result.title));
            });
        });
    function truncateText(text, max = 30) {
        if (text.length < max) {
            return text;
        }
        return text.slice(0, max) + "[...]"
    }

    Array.from(search_type_option_els).forEach((opt_el) => {
        opt_el.addEventListener("change", changeEnabledSearchType);
        function changeEnabledSearchType(event) {
            document.querySelectorAll("[data-search-type-fieldset]").forEach(fs => {
                fs.disabled = event.target.value !== fs.dataset.searchTypeFieldset
            });
        }
    })
});






