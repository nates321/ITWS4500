## Download and install the package


## Load package
library(igraph)


pokemon <- read.csv(file="Pokemon.csv", header = TRUE, sep=",") #read in pokemon
#print(pokemon[1])

##print(pokemon["Attack"])

typeChart <- read.csv(file="chart.csv", header = TRUE, sep=",") # read in a type chart which has values of attack damge to certain types

#print(typeChart)


pokemons <- pokemon["Name"] ## get certain things from pokemon
type1 <- pokemon["Type.1"]
type2 <- pokemon["Type.2"]

t1table <- table(type1)
t2table <- table(type2)

m = as.matrix(typeChart[2:19])

mode(m) <- "numeric"

m[m <1.1] <- 0
m[m == 2] <- 1 ## set super efffectives to 1 and all others to 0


g = graph.adjacency(m, mode="directed", weighted = TRUE)


edges=get.adjacency(g,attr='weight') ##get the adjacency matrex from the graoh



i = 1
for (i in 1:18){
  for (j in 1:18){
    
    if (edges[i, j] == 1){
      p1 = colnames(edges)[j]
      p2 = rownames(edges)[i]
      
      edges[i, j] <- ((t1table[p1] + t2table[p1] ) / 800) * ((t1table[p2] + t2table[p2] ) / 800) ##calculate probability of this type matchup
      
      
    }
    
  }
  
}

print(edges)


g = graph.adjacency(edges, mode="directed", weighted = TRUE)

set.seed(1492) 


plot(g, asp= 0, edge.color = "black", edge.label=round(E(g)$weight, 3), edge.arrow.size = 0.25, main = "Pokemon type strengths and probability a matchup of those types will occur", vertex.size = 10)
##plot the graph