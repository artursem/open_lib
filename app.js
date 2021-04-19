const input = document.querySelector('.input');
const dropdown = document.querySelector('.dropdown');
const resultsWrapper = document.querySelector('.results');
const selected = document.querySelector('.selected-book');

const debounce = (func) => {
    let timeoutId;
    return (...args) => {
        if (timeoutId) {
            clearTimeout(timeoutId);
        };
        timeoutId = setTimeout(() => {
            func.apply(null, args);
        }, 500)
    }
}

const first = (data, quantity) => {
    const resultsList = [];
    for (let i=0; i < quantity; i++) {
        resultsList.push(data.docs[i])
    }
    return resultsList;
}

const fetchData = async (searchTerm) => {
    const response = await axios.get('http://openlibrary.org/search.json', {
        params: {
            q: input.value
        }
    });
    makeList(first(response.data, 10));
}


const makeList = (arr) => {
    resultsWrapper.innerHTML = '';
    dropdown.classList.add('is-active');
    for (let i=0; i < arr.length; i++) {
        const coverSmall = `<img src='http://covers.openlibrary.org/b/id/${arr[i].cover_i}-S.jpg'>`
        const option = document.createElement('a');
        option.classList.add('dropdown-item');

        option.innerHTML = coverSmall;
        option.innerHTML += arr[i].title;
        resultsWrapper.appendChild(option);
        option.addEventListener('click', () => {
            dropdown.classList.remove('is-active');
            input.value = arr[i].title;
            displayBook(arr[i]);
        });
    }
}

const displayBook = (book) => {
    const { 
        cover_i,
        title, 
        author_name, 
        first_publish_year,
        publisher,
        id_goodreads,
        id_amazon
    } = book;
    selected.innerHTML = '';
    const columns = document.createElement('div');
    columns.classList.add('columns', 'box');
    selected.appendChild(columns);

    if (cover_i !== undefined) {
        const coverColumn = document.createElement('div');
        coverColumn.classList.add('column', 'is-narrow');
        coverColumn.innerHTML += `
        <div class="column is-narrow">
            <img src="http://covers.openlibrary.org/b/id/${cover_i}-L.jpg" alt="cover art">
        </div>`;
        columns.appendChild(coverColumn);
    };

    const textColumn = document.createElement('div');
    textColumn.classList.add('column');

    textColumn.innerHTML += `
        <h1>${title}</h1>
        <h3 class="mt-0">by ${author_name[0]}</h3>`;

    if (first_publish_year !== undefined) {
        textColumn.innerHTML += `<h5>first edition: ${first_publish_year}</h5>`;
    };
    if (publisher !== undefined) {
        textColumn.innerHTML += `<h6>${publisher[0]}</h6>`;
    };
    if (id_goodreads !== undefined) {
        const goodreads = id_goodreads[0];
        textColumn.innerHTML += `<p>Show
        <a href="https://www.goodreads.com/book/show/${goodreads}" target="_blank">
        <em>${title}</em>
        </a>  on Goodreads</p>`;
    };
    if (id_amazon !== undefined) {
        const amazon = id_amazon[0];
        textColumn.innerHTML += `<p>Show
        <a href="https://www.amazon.com/s?k=${amazon}" target="_blank">
        <em>${title}</em>
        </a>  on Amazon</p>`;
    };
    textColumn.innerHTML += `    
    </div>
</div>
    `;
    columns.appendChild(textColumn);

}


input.addEventListener('input', debounce(fetchData));

document.addEventListener('click', event => {
    if(!resultsWrapper.contains(event.target)) {
        dropdown.classList.remove('is-active');
    }
})