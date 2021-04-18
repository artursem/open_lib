const input = document.querySelector('.input');
const dropdown = document.querySelector('.dropdown');
const resultsWrapper = document.querySelector('.results');

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

const fetchData = async (searchTerm) => {
    const response = await axios.get('http://openlibrary.org/search.json', {
        params: {
            q: searchTerm
        }
    });
    const first = (data, quantity) => {
        const resultsList = [];
        for (let i=0; i < quantity; i++) {
            resultsList.push(data.docs[i])
        }
        return resultsList;
    }
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
        console.log(arr[i]);
    }
}


const searchInput = () => {
    fetchData(input.value);
}



input.addEventListener('input', debounce(searchInput));

