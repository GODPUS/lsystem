window.LSystem = function(iterations)
{
    this.axiom = '';
    this.string = '';
    this.rules = {};
    this.iterations = iterations;
    this.currentIteration = 0;
    this.keys = ['a', 'b', 'c', 'd', 'e', 'f', 'g'];
}

LSystem.prototype.generateRandomAxiomAndRules = function(axiomMinSize, axiomMaxSize, rulesMinSize, rulesMaxSize){
    var i;
    //axiom
    this.axiom = '';
    var numAxiomChar = Math.round(Math.random()*(axiomMaxSize-axiomMinSize))+axiomMinSize;
    for(i = 0; i < numAxiomChar; i++){ this.axiom += this.keys[Math.round(Math.random()*(this.keys.length-1))]; }

    //rules
    for(i = 0; i < this.keys.length; i++)
    {
        var string = '';
        var numRulesChar = Math.round(Math.random()*(rulesMaxSize-rulesMinSize))+rulesMinSize;
        for(j = 0; j < numRulesChar; j++){ string += this.keys[Math.round(Math.random()*(this.keys.length-1))]; }

        this.rules[this.keys[i]] = string;
    }

    this.string = this.axiom;
    console.log('AXIOM:', this.axiom);
    console.log('RULES:', this.rules);
}

LSystem.prototype.generate = function() {
    var newString = ''; 

    for(var i = 0; i < this.string.length; i++)
    {
        newString += this.rules[this.string.charAt(i)];
    }

    this.string = newString;

    if(this.currentIteration < this.iterations)
    {
        this.currentIteration++;
        this.generate();
    }
}