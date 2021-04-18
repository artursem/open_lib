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

const fetchData = async (searchTerm,) => {
    const response = await axios.get('http://openlibrary.org/search.json', {
        params: {
            q: searchTerm
        }
    });
    makeList(first(response.data, 10));
}


const makeList = (arr) => {
    resultsWrapper.innerHTML = ''; // clear results
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
            selectBook(arr[i].key);
        });
    }
}

const selectBook = async (key) => {
    console.log(`http://openlibrary.org${key}.json`);
    const response = await axios.get(`http://openlibrary.org${key}.json`);
    const authorLink = response.data.authors[0].author.key;
    const author = await axios.get(`http://openlibrary.org${authorLink}.json`);
    const authorName = author.data.name;
    console.log(response.data);

    displayBook(response.data, authorName);
}


const displayBook = (book, author) => {
    // console.log(`http://covers.openlibrary.org/b/id/${book.covers[0]}-L.jpg`);
    selected.innerHTML = `
    <div class="columns">
    <div class="column is-narrow">
        <img src="http://covers.openlibrary.org/b/id/${book.covers[0]}-L.jpg" alt="cover art">
    </div>
    <div class="column">
        <h1>${book.title}</h1>
        <h3>by ${author}</h3>
    </div>
</div>
    `;
}


const searchInput = () => {
    fetchData(input.value);
}



input.addEventListener('input', debounce(searchInput));

document.addEventListener('click', event => {
    if(!resultsWrapper.contains(event.target)) {
        dropdown.classList.remove('is-active');
    }
})