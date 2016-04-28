# Neural-Digits
Trains a Neural Network to read handwritten digits. Uses synaptic to implement the network itself and MongoDB to store the data.

../public/digits/ folder contains the dataset in raw format. The first time you run the application you need to use [localhost:3000/store](http://localhost:3000/store) to parse the data and store it in the database, so that every row has an array with the input data and the correct output value.

#### Why do I need it?
This is meant to be just an experiment or simply practice. There are far better tools to do the same thing, like [Weka](http://www.cs.waikato.ac.nz/ml/weka/).

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
Finally go to [localhost:3000/store](http://localhost:3000/store) to load the database (only the first time) and then to [localhost:3000/train](http://localhost:3000/train) to train the network (every time you start th application). Once the training is done (it may take a while) you can test your own handwriting recognition in the JavaScript canvas.
