# Celestial Discoveries: The Moons of Our Solar System

By: Madelyn Novelli

![image](https://github.com/user-attachments/assets/d4d1e482-ad26-42bf-af1e-d432a01320a7)

## I. Background
This visualization displays all the *named moons orbiting the planets of our solar system, including dwarf planet Pluto. It contains both a scatterplot and a barchart that are linked, as well as a filter to select individual planets. By hovering over each dot on the scatterplot, users can view various information about each moon, including its name, what planet it belongs to, its year of discovery, who discovered it, and its diameter measured in kilometers. The size of each dot represents the relative diameter of the moon compared with the other moons of the solar system, and its color corresponds with the associated color of its planet (e.g. the Earth's Moon is green because the Earth is associated with being green).

The data was collected by me and stored inside a csv file. All data comes from numerous different reports from The International Astronomial Union Minor Planet Center (https://minorplanetcenter.net).

*_There are numerous unnamed moons recently discovered in the 21st century, however I opted to omit these for the purpose of this visualization._

## II. Running the server
To run the server, open Terminal (for Mac) or Command Prompt (for Windows).
Navigate to the folder containing the visualization.

In the console execute the following command if you're running Python 2:

`python -m SimpleHTTPServer 8080`

If you're running Python 3 or higher, use:

`python -m http.server 8080`  (or `python3 -m http.server 8080`)

Now, open your browser and type `http://localhost:8080/` in the URL bar and press enter or go. The visualization works best when the browser is at 90%, as this is the default browser size it was created in.

## III. Welcome to the visualization!
Immerse yourself in outer space, and explore the planets of the solar system and their moons!

## IV. Resources
* [The International Astronomial Union Minor Planet Center](https://minorplanetcenter.net)
* [Interactive Data Visualization for the Web, 2nd Ed.](http://alignedleft.com/work/d3-book-2e) by Scott Murray
* [W3 Schools](https://www.w3schools.com/jsref/met_document_getelementbyid.asp)
* [D3 Documentation](https://d3js.org/d3-array/group)
* [Geeks for Geeks](https://www.geeksforgeeks.org/d3-js-array-from-method/)
