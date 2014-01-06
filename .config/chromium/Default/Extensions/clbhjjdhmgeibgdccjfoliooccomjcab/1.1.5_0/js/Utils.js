
var Utils = {
    getNiceName: function(pclass, method) {
        var term = '';
        if (pclass) {
            term += pclass;
        }
        if (method || (method != pclass && pclass)) {
            if (term) {
                term += '::';
            }
            term += method;
        }
        return term;
    },
    
    getSplitName: function(term) {
        if (term.indexOf('::') == -1) {
            return {
                method: term,
                pclass: null
            };
        } else {
            return {
                pclass: term.substring(0, term.indexOf('::')),
                method: term.substring(term.indexOf('::') + 2)
            };
        }
    },
    
    isClass: function(fancyName, pclass) {
    	if (typeof(pclass) === 'undefined') {
    		var nameParts = this.getSplitName(fancyName);
        	return nameParts.pclass === nameParts.method;
    	} else {
    		return fancyName === pclass;
    	}
    },
    
    isClassMethod: function(fancyName) {
    	var methodParts = this.getSplitName(fancyName);
    	return methodParts.pclass !== null;
    }
    
};
