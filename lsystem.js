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

    var regex = new RegExp(Object.keys(this.rules).join("|"),"gi");
    var that = this;

    console.log(this.string.length);
    //most elegant and fastest way of looping through string
    newString = this.string.replace(regex, function(matched){
        return that.rules[matched];
    });

    this.string = newString;

    delete newString;

    if(this.currentIteration < that.iterations)
    {
        this.currentIteration++;
        this.generate();
    }
}