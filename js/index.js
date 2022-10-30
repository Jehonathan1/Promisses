// function getCountryPopulation(country) {
// 	return new Promise((resolve, reject) => {
// 		const url = `https://countriesnow.space/api/v0.1/countries/population`;
// 		const options = {
// 			method: "POST",
// 			headers: {
// 				"Content-Type": "application/json",
// 			},
// 			body: JSON.stringify({ country }),
// 		};
// 		fetch(url, options)
// 			.then((res) => res.json())
// 			.then((json) => {
// 				if (json?.data?.populationCounts)
// 					resolve(json.data.populationCounts.at(-1).value);
// 				else reject(new Error(`My Error: no data for ${country}`)); //app logic error message
// 			})
// 			.catch((err) => reject(err)); // network error - server is down for example...
// 		// .catch(reject)  // same same, only shorter...
// 	});
// }
async function getCountryPopulation(country) {
	try {
		const url = `https://countriesnow.space/api/v0.1/countries/population`;
		const options = {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ country }),
		};

		const res = await fetch(url, options);
		const json = await res.json();

		if (json?.data?.populationCounts)
			return json.data.populationCounts.at(-1).value;
		else throw new Error(`My Error: no data for ${country}`); //app logic error message
	} catch (err) {
		console.log(err);
		throw err;
	}
}

//--------------------------------------------------------
//  Manual - call one by one...
//--------------------------------------------------------
// function manual() {
// 	getCountryPopulation("France")
// 		.then((population) => {
// 			console.log(`population of France is ${population}`);
// 			return getCountryPopulation("Germany");
// 		})
// 		.then((population) => console.log(`population of Germany is ${population}`))
// 		.catch((err) => console.log("Error in manual: ", err.message));
// }

async function manual() {
	try {
		const france = await getCountryPopulation("France");
		console.log(`population of France is ${france}`);
		const germany = await getCountryPopulation("Germany");
		console.log(`population of Germany is ${germany}`);
	} catch (err) {
		console.log("Error in manual: ", err.message);
		throw err;
	}
}
// manual();

//------------------------------
//   Sequential processing
//------------------------------
const countries = [
	"France",
	"Russia",
	"Germany",
	"United Kingdom",
	"Portugal",
	"Spain",
	"Netherlands",
	"Sweden",
	"Greece",
	"Czechia",
	"Romania",
	"Israel",
];

// function sequence() {

// 	/* iterate over the countries array
// 		if an item is a promise - resolve before proceeding
//     */
// 	Promise.each(countries, (item) => {
// 		return getCountryPopulation(item)
// 			.then(console.log("start processing item:", item))
// 			.then((population) => {
// 				console.log(`population of ${item} is ${population}`);
// 			})

// 			.catch((err) => console.log("Error in sequence: ", err.message));
// 	})
// 		.then((data) => {
// 			console.log(`ALL DONE! ${data}`);
// 		})

// 		.catch(console.log.error);
// }

// await version
async function sequence() {
	try {
			for (let i=0; i<countries.length; i++){
				let population = await getCountryPopulation(countries[i]).catch(err => console.log(err.message));
				console.log(`population of ${countries[i]} is ${population}`);
			}
		console.log('All Done!')
	} catch (err) {
		// console.error(`${country} failed: ${err.message}`);
		console.error("Error in Sequence:", err.message);
		throw err;
	}
}

sequence();

//--------------------------------------------------------
//  Parallel processing
//--------------------------------------------------------

// 01. Create an object of pending promisses
// let pendingPromissesObj = {};


// function parallel() {
// 	// loop over countries array
// 	countries.forEach((country) => {
// 		console.log("Receiving data for:", country);
// 		// add each promise to object
// 		pendingPromissesObj[country] = getCountryPopulation(country).catch((err) =>
// 			console.log("Error in parallel: ", err.message)
// 		);
// 	});

// 	/* return fulfilled promise
//        when all properties of the object's values are fulfilled
//     */
// 	Promise.props(pendingPromissesObj)
// 		.then((res) => {
// 			return res;
// 		})
// 		.then((countries) => {
// 			// loop over countries in object and if they have value - print their value
// 			for (const country in countries) {
// 				if (countries[country]) {
// 					console.log(`population of ${country} is ${countries[country]}`);
// 				}
// 			}

// 			console.log("All Done!");
// 		})
// 		.catch((err) => {
// 			console.log(err);
// 		});
// }

// await version
async function parallel() {
	try {
		// create an array of pending promisses
		const pendingPromisses = countries.map((country) =>
			getCountryPopulation(country)
		);
		const res = await Promise.allSettled(pendingPromisses);
		res.forEach((country, i) => {
			if (country.status === "fulfilled") {
				console.log(`The population of ${countries[i]} is ${country.value}`);
			} else if (country.status === "rejected") {
				console.log(
					`The population of ${countries[i]} is not available: ${country.reason}`
				);
			}
		});
		console.log("ALL DONE!");
	} catch (err) {
		console.log("error in parallel:", err);
	}
}
// parallel();
