
Array.prototype.shuffle = function() {
    var i = this.length,
        j,
        temp;
    if (i === 0) {
        return this;
    }
    while (--i) {
       j = Math.floor(Math.random() * (i + 1));
       temp = this[i];
       this[i] = this[j];
       this[j] = temp;
    }
    return this;
  }

  function compare(a,b) {
    if (a[0] < b[0])
      return -1;
    if (a[0] > b[0])
      return 1;
    return 0;
  }


var makeChromosome = function () {
    var chromosome = '';
    for (var i = 0; i < 48; i++) {
        chromosome += String(Math.floor((Math.random() * 2)));
    }
    return [null, chromosome];
}

var makePopulation = function (nbGen) {
    var population = [];
    for (var i = 0; i < nbGen; i++) {
        population.push(makeChromosome());
    }
    return population;
}

var chromosomeToGene = function (chromosome) {
    //sometimes chromosome is an empty string
    if (typeof chromosome !== 'object') {
        chromosome = makeChromosome();
    }
    var pos = 0,
        tabGene = [];
    while (pos < 48) {
        tabGene.push(chromosome[1].substr(pos, 4));
        pos += 4;
    }
    return tabGene;
}


var tradGene = function (gene) {
    var trad;
    switch (gene) {
        case '0000' :
            trad = 0;
            break;

        case '0001' :
            trad = 1;
            break;

        case '0010' :
            trad = 2;
            break;

        case '0011' :
            trad = 3;
            break;

        case '0100' :
            trad = 4;
            break;

        case '0101' :
            trad = 5;
            break;

        case '0110' :
            trad = 6;
            break;

        case '0111' :
            trad = 7;
            break;

        case '1000' :
            trad = 8;
            break;

        case '1001' :
            trad = 9;
            break;

        case '1010' :
            trad = '+';
            break;

        case '1100' :
            trad = '-';
            break;

        case '1101' :
            trad = '*';
            break;
   
        case '1111' :
            trad = '/';
            break;
    }

    return trad;
}

var selection = function (population) {
    return population.slice(0, 79).shuffle();;
}

var geneToFormula = function (gene) {
    var formula = [],
        listOperation = ['+', '-', '/', '*'];
    for (var i = 0; i < gene.length; i++) {
        formula.push(tradGene(gene[i]));
    }

    formula = formula.join('');

    if (listOperation.indexOf(formula.charAt(0)) !== -1) {
        formula = ['0', formula].join('');
    }
    if (listOperation.indexOf(formula.charAt(formula.length - 1)) !== -1) {
        formula = [formula, '0'].join('');
    }

    return formula;
}

var checkFormula = function (formula) {
	var length = formula.length,
  		listOperation = ['+', '-', '/', '*'],
        compteur = 0,
        isReadable = true,
        nextChar = '';
 
  for (; compteur < length; compteur++) {
    //catch operation
  	if (listOperation.indexOf(formula.charAt(compteur)) !== -1) {
  		//catch next char : operation ?
      nextChar = formula.charAt(compteur + 1);
      if (listOperation.indexOf(nextChar) !== -1) {
         if (nextChar !== '-') {
         		isReadable = false;
            break;
         } else if (compteur + 2 < length + 1 && listOperation.indexOf(formula.charAt(compteur + 2)) !== -1) {
            isReadable = false;
            break;
         }
      }
  	} 
  }

  return isReadable;
}

var evaluation = function (searchValue, genes) {
    var formula = geneToFormula(genes),
        result;

    //Determine if a formula is human readable (avoid Javascript magic implementation)
    try {
        result = Math.abs(searchValue - eval(formula));
    } catch (e) {
        result = 999999999999;
    }
    
    if (!Number.isInteger(result)) {
        result = 999999999999;
    }

    return result
}


var scorePopulation = function (population, searchValue) {
    var newPop;
    population.map(function (x) {
        x[0] = evaluation(searchValue, chromosomeToGene(x));
    }) 

    return population
}


var crossover = function (parent1, parent2) {
    var point = Math.floor((Math.random() * 47 + 1));
    var child1 = [null, parent1[1].substr(0, point) + parent2[1].substr(point)];
    var child2 = [null, parent2[1].substr(0, point) + parent1[1].substr(point)];

    return [child1, child2];
}

var nextGeneration = function (selection) {
    var population = makePopulation(20),
        parentTab,
        childTab;
    for (var i = 0; i < 39; i++) {
        parentTab = selection.splice(0, 2);
        childTab = crossover(parentTab[0], parentTab[1]);
        population.push(childTab[0], childTab[1]);
    }

    return population;
}

var mutation = function (population) {
    population.map(function(x) {
        if (Math.floor((Math.random() * 1000 + 1)) === 0) {
            x = mutate(individual)
        }
    });

    return population;
}

var mutate = function (chromosome) {
    var bit = Math.floor((Math.random() * 48 + 1));
    var value = chromosome[1];
    if (value[bit] === '0'){
        value[bit] = '1';
    } else {
        value[bit] = '0';
    }

    return [null, value];
}
module.exports = {
    main: function (data, socket) {
        var searchValue = data,
            resultat,
            best,
            formula;

        if (searchValue === 0) {
            socket.emit('err', 'Set a number ! ¯\\_(ツ)_/¯');
            return;
        }
        var population = makePopulation(100);

        for (var i = 0; i < 1000; i++) {
            resultat = scorePopulation(population, searchValue).sort(compare);
            best = resultat[0];
            formula = geneToFormula(chromosomeToGene(best));

            if (best[0] === 0) {
                //Check if formula is human readable
                if (checkFormula(formula)) {
                    socket.emit('result', {
                        number: searchValue,
                        formula: formula,
                        nbIteration: i
                        }
                    );
                    break;
                }
            }
            population = mutation(nextGeneration(selection(population)));
        };
        
        if (best[0] !== 0) {
            //In case of extremum local, reload everything
            this.main(searchValue, socket);
       }
    }
}