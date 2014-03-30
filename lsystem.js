window.LSystem = function(iterations)
{
    this.axiom = '';
    this.string = '';
    this.rules = {};
    this.iterations = iterations;
    this.currentIteration = 0;
    this.keys = ['a', 'b', 'c', 'd', 'e', 'f', 'g'];
    this.parallel = new Parallel();
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
    var numWorkers = 8;
    var chunkedStringArray = [];

    //split string for workers
    for(var i = 1; i <= numWorkers; i++)
    {
        var divider = Math.ceil(this.string.length/numWorkers);
        var s;

        if(i == 0) {
            s = this.string.slice(0, divider*1);
        }else if(i === numWorkers){
            s = this.string.slice(divider*(numWorkers-1));
        }else{
            s = this.string.slice(divider*(i-1), divider*i);
        }

        chunkedStringArray.push({string: s, rules: this.rules}); //stringify rules into webworker
    }

    this.parallel.options.maxWorkers = numWorkers;
    this.parallel.data = chunkedStringArray;
    var that = this;

    this.parallel.map(this.workerMap).then(function(){
        that.string = that.parallel.data.join('');

        if(that.currentIteration < that.iterations)
        {
            that.currentIteration++;
            that.generate();
        }else{
            console.log('TRIGGER COMPLETE')
            $(that).trigger('COMPLETE');
        }
    });
}

LSystem.prototype.workerMap = function(data) {
    var newString = '';
    var regex = new RegExp(Object.keys(data.rules).join("|"),"gi");
    var that = this;

    //most elegant and fastest way of looping through string
    newString = data.string.replace(regex, function(matched){
        return data.rules[matched];
    });

    return newString;
}