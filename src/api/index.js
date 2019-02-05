export const getData = () => {
  return fetch(`http://localhost:5000/random-data`)
    .then(response => response.json())
};






