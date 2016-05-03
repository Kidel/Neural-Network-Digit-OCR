# Neural-Digits
Trains a Neural Network to read handwritten digits (OCR). Uses [synaptic](https://github.com/cazala/synaptic) to implement the network itself and part of the training, MongoDB to store the data and socket.io for reactive communication strategy.
After the network has been trained you can use the test set to see how it worked, or use the canvas to make it recognise your own handwriting.

../public/digits/ folder contains the dataset in raw format. The first time you run the application you need to parse the data and store it in the database (simply follow the steps in [localhost:3000](http://localhost:3000/)), so that every row has an array with the input data and the correct output value.

* [screenshot](https://raw.githubusercontent.com/Kidel/Neural-Digits/master/screenshot.png)

#### Why do I need it?
This is meant to be just an experiment or simply practice. There are more efficient tools and libraries for Neural Networks.

### How does it work?
Every handwritten digit is sampled in a 32x32 matrix of 0 and 1,
and then stored in the database as input and output. The input is an
array with 1024 elements, one for each sampled pixel, while the output is another
array of 10 elements, one for each possible digit (the output digit is the index with value 1 in the array).
Currently the training set has 1934 examples, and the test set has 946.

The Neural Network used for this OCR has 1024 inputs, an hidden layer of size 30 and an output layer of size 10. The settings can be found in ../routes/index.js

***

##Installation
You must first install [Node.js](https://nodejs.org/) and [MongoDB](https://www.mongodb.org/).
Then simply open a terminal and run this command:
```bash
cd /your/path/to/Neural-Digits/
npm install
```
It has to be done only the first time in order to install the required modules.

Then you should run one of those commands in a terminal (depending on your OS):
```bash
#(Unix)
/your/path/to/mongod --dbpath /your/path/to/Neural-Digits/data/"
```
```command
::(Windows)
"Drive:\your\path\to\mongod.exe" --dbpath "Drive:\your\path\to\Neural-Digits\data\"
```
And this one in another terminal to start the server (of course current directory has to be the project folder again):
```bash
cd /your/path/to/Neural-Digits/
npm start
```
Finally go to [localhost:3000](http://localhost:3000) and follow the instructions.