let answer = 25;

function fetchData() {
  return new Promise((resolve, reject) => {
    if (answer > 3) {
      setTimeout(() => {
        reject("Wrong! You are very Wrong");
      }, 2200);
    }
    setTimeout(() => {
      resolve("Working Properly");
    }, 3000);
  });
}

fetchData()
  .then((res) => console.log(res))
  .catch((err) => console.error(err))
  .finally(() => console.log("Cleanup Work"))

// Async Await

async function getData() {
  try {
    let data = await fetchData();
    console.log(data);
  } catch (error) {
    console.error(error)
  } finally {
    console.log("Clear loaders here");
  }
}

getData();
