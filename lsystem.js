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
    var newString = ''; 
    var numWorkers = 8;
    var chunkedStringArray = [];

    var i;

    //split string for workers
    for(i = 1; i <= numWorkers; i++)
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

        chunkedStringArray.push(s+'|'+JSON.stringify(this.rules)); //stringify rules into webworker
    }

    this.parallel.options.maxWorkers = numWorkers;
    this.parallel.data = chunkedStringArray;
    var that = this;

    this.parallel.map(this.workerMap).then(function(){
        that.string = that.parallel.data.join('');
        console.log('STRING #'+that.currentIteration, that.string);

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

LSystem.prototype.workerMap = function(string) {
    var rules = JSON.parse(string.split('|')[1]);
    string = string.split('|')[0];
    var newString = '';

    for(var i = 0; i < string.length; i++)
    {
        newString += rules[string.charAt(i)];
    }

    return newString;
}