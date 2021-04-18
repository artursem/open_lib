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
            selectBook(arr[i].isbn[0]);
        })
    }
}

const selectBook = async (searchTerm) => {
    const response = await axios.get('http://openlibrary.org/search.json', {
        params: {
            q: searchTerm
        }
    });
    displayBook(response.data.docs[0]);
}


const displayBook = (book) => {
    console.log(book);
    
    selected.innerHTML = `
    <div class="columns">
    <div class="column is-narrow">
        <img src="http://covers.openlibrary.org/b/id/${book.cover_i}-L.jpg" alt="cover art">
    </div>
    <div class="column">
        <h1>${book.title}</h1>
        <h3>by ${book.author_name}</h3>
        <h6>first edition ${book.first_publish_year}</h6>
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