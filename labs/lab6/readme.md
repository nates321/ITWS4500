NAthan STrelser
661476303
streln

resources used:

stack overflow 
twitter node package
twitter api resource


i used the same file from my lab5 and just added new form inputs

the hardest part of this lab for me was making sure it ran my code in the correct order. at first it would alert whether the file had been written before actually writing the file and error checking. this made it so my node server would continuosly crash if there was any sort of error. you'll notice in the code that every function i created has a callback. this makesure that it runs my code in the order i want. it will call the funtion and there will be another function inside the call to the function which recieves the callbacks as its arguments. this makes it work and makes it look obvious the way the code is supposed to work.

all the console logs were to help me to debug what was happening and where in the program it went at different times before i figured out to use the callback method


Q: Where would it be better to place the CSV conversion code, in the node server or in an Angular controller? Why?

	i personally think its better to store it in the node server. this is because it receives the twitter data in the node server, so it can instantly work on parsing and converting without having to transfer the data to the front end of the application. if the file you are transforming is a huge amount of data into a smaller amount, you dont want to have to load it to different places often. so only loading it in hte server and not bringing it to the angular controller will be faster
	there may also be data in the original piece that you dont want the frontend user to be able to see. it will be safer to do the ETL on the backend before putting the new data on the front end.
