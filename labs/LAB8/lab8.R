## Download and install the package


## Load package
library(igraph)


pokemon <- read.csv(file="Pokemon.csv", header = TRUE, sep=",")
#print(pokemon[1])

##print(pokemon["Attack"])

typeChart <- read.csv(file="chart.csv", header = TRUE, sep=",")

#print(typeChart)
adjMatrix = NULL
print (pokemon[["Name"]][[15]])

pokemons <- pokemon["Name"]
type1 <- pokemon["Type.1"]
type2 <- pokemon["Type.2"]

i = 1
for (p in pokemons){
  j = 1
  for (p2 in pokemons){
    
    
    j= j+1
  }
  i = i + 1
}