const addCity = document.querySelector('.add-places');
const cityList = document.querySelector('.places');
let cities = JSON.parse(localStorage.getItem('cities')) || [];
const findTickets = document.querySelector('.search');
const ticketList = document.querySelector('.tickets');

function handleAddCity(e) {
  e.preventDefault()
  const text = (document.querySelector('[name=place]')).value;
  const city = {
    text,
    done: false
  }
  cities.push(city);
  populateList(cities, cityList);
  localStorage.setItem('cities', JSON.stringify(cities))
  this.reset();
}

function handleRemoveCity(e) {
  const idNumber = parseInt(e.target.id);
  cities = cities.filter((city, index) => index !== idNumber);
  populateList(cities, cityList);
  localStorage.setItem('cities', JSON.stringify(cities));
}

function populateList(items = [], itemList) {
  itemList.innerHTML = items.map((item, index) => {
    return `
    <li>
      <input type="checkbox" data-index=${index} id="item${index}" ${item.done ? 'checked' : ''} />
      <label for="item${index}">${item.text}</label>
      <button id=${index} class="remove">☒</button>
    </li>
    `;
  }).join('');
  const buttons = cityList.querySelectorAll('.remove');
  buttons.forEach(button => button.addEventListener('click', handleRemoveCity));
}

function toggleDone(e) {
  if (!e.target.matches('input')) return;
  const element = e.target;
  cities[element.dataset.index].done = !cities[element.dataset.index].done;
  localStorage.setItem('cities', JSON.stringify(cities));
  populateList(cities, cityList);
}

function getTicketData() {
  const goodCities = cities.filter(city => city.done);
  axios.get(`/tickets${goodCities[0].text}`)
    .then( (data) => {
      const tickets = [];
      for (key in data.data) {tickets.push(data.data[key])}
      console.log(tickets)
      populateTicketList(tickets, ticketList)
    })
    .catch( (err) => console.log('get err: ', err));
}

function populateTicketList(tickets = [], tixList) {
  tixList.innerHTML = tickets.map((ticket, index) => {
    // let stayLength = ticket.return_at - ticket.departure_at;
    let durationHours = Math.round((Date.parse(ticket.return_at) - Date.parse(ticket.departure_at)) / (1000 * 3600)) ;
    const lengthOfStay = Math.floor(durationHours / 24) + ' days, ' + durationHours % 24 + ' hours';
    const returning = new Date(ticket.return_at);
    const leave = new Date(ticket.departure_at);
    return `
    <li for="item${index}">
      ${ticket.origin} to ${ticket.destination} for $${ticket.price} staying for ${lengthOfStay}
    </li>
    `;
  }).join('');
}

addCity.addEventListener('submit', handleAddCity);
cityList.addEventListener('click', toggleDone);
findTickets.addEventListener('click', getTicketData);
populateList(cities, cityList);