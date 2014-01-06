
function SearchTerm(fancyName, fancyClass) {
    
    var method;
    var pclass;
    var rawName = fancyName;
    var data;
    // var version = phpVersion

//    if (fancyName !== null && fancyName.substring(fancyName.length - 2) === '::') {
//        fancyName = fancyName.substring(0, fancyName.length - 2);
//    }
//    if (fancyName !== null && fancyName.substring(fancyName.length - 1) === ':') {
//        fancyName = fancyName.substring(0, fancyName.length - 1);
//    }
    
    if (typeof fancyClass === 'undefined' || fancyClass === null) {
        if (fancyName.indexOf('::') == -1) {
            method = fancyName;
            pclass = null;
        } else {
            pclass = fancyName.substring(0, fancyName.indexOf('::'));
            method = fancyName.substring(fancyName.indexOf('::') + 2);
        }
    } else {
        pclass = fancyClass;
        method = fancyName;
    }

    /*if (typeof phpVersion !== 'undefined') {

    }*/

    this.getRaw = function() {
        return rawName;
    };
        
    this.getMethod = function() {
        return this.isOnlyClass() ? null : method;
    };
    
    this.getClass = function() {
        return pclass;
    };
    
    this.isClass = function() {
        return pclass !== null;
    };

    this.isOnlyClass = function() {
        return !this.isClassAndMethod() && this.isClass();
    };
    
    this.isClassAndMethod = function() {
        return (pclass && method);
    };
    
    this.setJSON = function(json) {
        data = JSON.parse(json);
    };
    
    this.setObject = function(obj) {
        data = obj;
    };
    
    this.getObject = function() {
        return data;
    };
    
    this.toString = function() {
        if (this.isOnlyClass()) {
            return pclass;
        } else if (this.isClassAndMethod()) {
            return pclass + '::' + method;
        } else {
            return method;
        }
    };

    this.getUniformName = function() {
        /*if (this.isClass()) {
            return pclass + '::' + pclass;
        } else*/ if (this.isClassAndMethod()) {
            return pclass + '::' + method;
        } else {
            return method;
        }
    };
    
    this.equals = function(term) {
        return this.getUniformName() === term.getUniformName();
    };
    
    this.similar = function(term) {
        return this.toString() === term.toString();
    };

    this.getVersion = function(showLong) {
        if (typeof data.ver === 'undefined' || data.ver === null || !data.ver.match(/[0-9]/)) {
            return null;
        }

        showLong = (typeof data.ver === 'undefined') ? false : showLong;

        if (!showLong && data.ver.length > 20) {
            return data.ver.substring(0, 20) + '…';
        } else {
            return data.ver;
        }
    };
}

