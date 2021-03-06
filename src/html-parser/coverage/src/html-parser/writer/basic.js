function BranchData() {
    this.position = -1;
    this.nodeLength = -1;
    this.src = null;
    this.evalFalse = 0;
    this.evalTrue = 0;

    this.init = function(position, nodeLength, src) {
        this.position = position;
        this.nodeLength = nodeLength;
        this.src = src;
        return this;
    }

    this.ranCondition = function(result) {
        if (result)
            this.evalTrue++;
        else
            this.evalFalse++;
    };

    this.pathsCovered = function() {
        var paths = 0;
        if (this.evalTrue > 0)
          paths++;
        if (this.evalFalse > 0)
          paths++;
        return paths;
    };

    this.covered = function() {
        return this.evalTrue > 0 && this.evalFalse > 0;
    };

    this.toJSON = function() {
        return '{"position":' + this.position
            + ',"nodeLength":' + this.nodeLength
            + ',"src":' + jscoverage_quote(this.src)
            + ',"evalFalse":' + this.evalFalse
            + ',"evalTrue":' + this.evalTrue + '}';
    };

    this.message = function() {
        if (this.evalTrue === 0 && this.evalFalse === 0)
            return 'Condition never evaluated         :\t' + this.src;
        else if (this.evalTrue === 0)
            return 'Condition never evaluated to true :\t' + this.src;
        else if (this.evalFalse === 0)
            return 'Condition never evaluated to false:\t' + this.src;
        else
            return 'Condition covered';
    };
}

BranchData.fromJson = function(jsonString) {
    var json = eval('(' + jsonString + ')');
    var branchData = new BranchData();
    branchData.init(json.position, json.nodeLength, json.src);
    branchData.evalFalse = json.evalFalse;
    branchData.evalTrue = json.evalTrue;
    return branchData;
};

BranchData.fromJsonObject = function(json) {
    var branchData = new BranchData();
    branchData.init(json.position, json.nodeLength, json.src);
    branchData.evalFalse = json.evalFalse;
    branchData.evalTrue = json.evalTrue;
    return branchData;
};

function buildBranchMessage(conditions) {
    var message = 'The following was not covered:';
    for (var i = 0; i < conditions.length; i++) {
        if (conditions[i] !== undefined && conditions[i] !== null && !conditions[i].covered())
          message += '\n- '+ conditions[i].message();
    }
    return message;
};

function convertBranchDataConditionArrayToJSON(branchDataConditionArray) {
    var array = [];
    var length = branchDataConditionArray.length;
    for (var condition = 0; condition < length; condition++) {
        var branchDataObject = branchDataConditionArray[condition];
        if (branchDataObject === undefined || branchDataObject === null) {
            value = 'null';
        } else {
            value = branchDataObject.toJSON();
        }
        array.push(value);
    }
    return '[' + array.join(',') + ']';
}

function convertBranchDataLinesToJSON(branchData) {
    if (branchData === undefined) {
        return '{}'
    }
    var json = '';
    for (var line in branchData) {
        if (json !== '')
            json += ','
        json += '"' + line + '":' + convertBranchDataConditionArrayToJSON(branchData[line]);
    }
    return '{' + json + '}';
}

function convertBranchDataLinesFromJSON(jsonObject) {
    if (jsonObject === undefined) {
        return {};
    }
    for (var line in jsonObject) {
        var branchDataJSON = jsonObject[line];
        if (branchDataJSON !== null) {
            for (var conditionIndex = 0; conditionIndex < branchDataJSON.length; conditionIndex ++) {
                var condition = branchDataJSON[conditionIndex];
                if (condition !== null) {
                    branchDataJSON[conditionIndex] = BranchData.fromJsonObject(condition);
                }
            }
        }
    }
    return jsonObject;
}
function jscoverage_quote(s) {
    return '"' + s.replace(/[\u0000-\u001f"\\\u007f-\uffff]/g, function (c) {
        switch (c) {
            case '\b':
                return '\\b';
            case '\f':
                return '\\f';
            case '\n':
                return '\\n';
            case '\r':
                return '\\r';
            case '\t':
                return '\\t';
            // IE doesn't support this
            /*
             case '\v':
             return '\\v';
             */
            case '"':
                return '\\"';
            case '\\':
                return '\\\\';
            default:
                return '\\u' + jscoverage_pad(c.charCodeAt(0).toString(16));
        }
    }) + '"';
}

function getArrayJSON(coverage) {
    var array = [];
    if (coverage === undefined)
        return array;

    var length = coverage.length;
    for (var line = 0; line < length; line++) {
        var value = coverage[line];
        if (value === undefined || value === null) {
            value = 'null';
        }
        array.push(value);
    }
    return array;
}

function jscoverage_serializeCoverageToJSON() {
    var json = [];
    for (var file in _$jscoverage) {
        var lineArray = getArrayJSON(_$jscoverage[file].lineData);
        var fnArray = getArrayJSON(_$jscoverage[file].functionData);

        json.push(jscoverage_quote(file) + ':{"lineData":[' + lineArray.join(',') + '],"functionData":[' + fnArray.join(',') + '],"branchData":' + convertBranchDataLinesToJSON(_$jscoverage[file].branchData) + '}');
    }
    return '{' + json.join(',') + '}';
}


function jscoverage_pad(s) {
    return '0000'.substr(s.length) + s;
}

function jscoverage_html_escape(s) {
    return s.replace(/[<>\&\"\']/g, function (c) {
        return '&#' + c.charCodeAt(0) + ';';
    });
}
try {
  if (typeof top === 'object' && top !== null && typeof top.opener === 'object' && top.opener !== null) {
    // this is a browser window that was opened from another window

    if (! top.opener._$jscoverage) {
      top.opener._$jscoverage = {};
    }
  }
}
catch (e) {}

try {
  if (typeof top === 'object' && top !== null) {
    // this is a browser window

    try {
      if (typeof top.opener === 'object' && top.opener !== null && top.opener._$jscoverage) {
        top._$jscoverage = top.opener._$jscoverage;
      }
    }
    catch (e) {}

    if (! top._$jscoverage) {
      top._$jscoverage = {};
    }
  }
}
catch (e) {}

try {
  if (typeof top === 'object' && top !== null && top._$jscoverage) {
    this._$jscoverage = top._$jscoverage;
  }
}
catch (e) {}
if (! this._$jscoverage) {
  this._$jscoverage = {};
}
if (! _$jscoverage['/html-parser/writer/basic.js']) {
  _$jscoverage['/html-parser/writer/basic.js'] = {};
  _$jscoverage['/html-parser/writer/basic.js'].lineData = [];
  _$jscoverage['/html-parser/writer/basic.js'].lineData[5] = 0;
  _$jscoverage['/html-parser/writer/basic.js'].lineData[7] = 0;
  _$jscoverage['/html-parser/writer/basic.js'].lineData[8] = 0;
  _$jscoverage['/html-parser/writer/basic.js'].lineData[12] = 0;
  _$jscoverage['/html-parser/writer/basic.js'].lineData[13] = 0;
  _$jscoverage['/html-parser/writer/basic.js'].lineData[16] = 0;
  _$jscoverage['/html-parser/writer/basic.js'].lineData[21] = 0;
  _$jscoverage['/html-parser/writer/basic.js'].lineData[24] = 0;
  _$jscoverage['/html-parser/writer/basic.js'].lineData[25] = 0;
  _$jscoverage['/html-parser/writer/basic.js'].lineData[26] = 0;
  _$jscoverage['/html-parser/writer/basic.js'].lineData[27] = 0;
  _$jscoverage['/html-parser/writer/basic.js'].lineData[28] = 0;
  _$jscoverage['/html-parser/writer/basic.js'].lineData[31] = 0;
  _$jscoverage['/html-parser/writer/basic.js'].lineData[34] = 0;
  _$jscoverage['/html-parser/writer/basic.js'].lineData[38] = 0;
  _$jscoverage['/html-parser/writer/basic.js'].lineData[42] = 0;
  _$jscoverage['/html-parser/writer/basic.js'].lineData[43] = 0;
  _$jscoverage['/html-parser/writer/basic.js'].lineData[45] = 0;
  _$jscoverage['/html-parser/writer/basic.js'].lineData[49] = 0;
  _$jscoverage['/html-parser/writer/basic.js'].lineData[53] = 0;
  _$jscoverage['/html-parser/writer/basic.js'].lineData[61] = 0;
  _$jscoverage['/html-parser/writer/basic.js'].lineData[65] = 0;
  _$jscoverage['/html-parser/writer/basic.js'].lineData[69] = 0;
  _$jscoverage['/html-parser/writer/basic.js'].lineData[73] = 0;
  _$jscoverage['/html-parser/writer/basic.js'].lineData[78] = 0;
}
if (! _$jscoverage['/html-parser/writer/basic.js'].functionData) {
  _$jscoverage['/html-parser/writer/basic.js'].functionData = [];
  _$jscoverage['/html-parser/writer/basic.js'].functionData[0] = 0;
  _$jscoverage['/html-parser/writer/basic.js'].functionData[1] = 0;
  _$jscoverage['/html-parser/writer/basic.js'].functionData[2] = 0;
  _$jscoverage['/html-parser/writer/basic.js'].functionData[3] = 0;
  _$jscoverage['/html-parser/writer/basic.js'].functionData[4] = 0;
  _$jscoverage['/html-parser/writer/basic.js'].functionData[5] = 0;
  _$jscoverage['/html-parser/writer/basic.js'].functionData[6] = 0;
  _$jscoverage['/html-parser/writer/basic.js'].functionData[7] = 0;
  _$jscoverage['/html-parser/writer/basic.js'].functionData[8] = 0;
  _$jscoverage['/html-parser/writer/basic.js'].functionData[9] = 0;
  _$jscoverage['/html-parser/writer/basic.js'].functionData[10] = 0;
  _$jscoverage['/html-parser/writer/basic.js'].functionData[11] = 0;
}
if (! _$jscoverage['/html-parser/writer/basic.js'].branchData) {
  _$jscoverage['/html-parser/writer/basic.js'].branchData = {};
  _$jscoverage['/html-parser/writer/basic.js'].branchData['24'] = [];
  _$jscoverage['/html-parser/writer/basic.js'].branchData['24'][1] = new BranchData();
  _$jscoverage['/html-parser/writer/basic.js'].branchData['26'] = [];
  _$jscoverage['/html-parser/writer/basic.js'].branchData['26'][1] = new BranchData();
  _$jscoverage['/html-parser/writer/basic.js'].branchData['27'] = [];
  _$jscoverage['/html-parser/writer/basic.js'].branchData['27'][1] = new BranchData();
  _$jscoverage['/html-parser/writer/basic.js'].branchData['42'] = [];
  _$jscoverage['/html-parser/writer/basic.js'].branchData['42'][1] = new BranchData();
  _$jscoverage['/html-parser/writer/basic.js'].branchData['56'] = [];
  _$jscoverage['/html-parser/writer/basic.js'].branchData['56'][1] = new BranchData();
}
_$jscoverage['/html-parser/writer/basic.js'].branchData['56'][1].init(101, 23, 'attr.value || attr.name');
function visit346_56_1(result) {
  _$jscoverage['/html-parser/writer/basic.js'].branchData['56'][1].ranCondition(result);
  return result;
}_$jscoverage['/html-parser/writer/basic.js'].branchData['42'][1].init(18, 15, 'el.isSelfClosed');
function visit345_42_1(result) {
  _$jscoverage['/html-parser/writer/basic.js'].branchData['42'][1].ranCondition(result);
  return result;
}_$jscoverage['/html-parser/writer/basic.js'].branchData['27'][1].init(38, 14, 'j < arg.length');
function visit344_27_1(result) {
  _$jscoverage['/html-parser/writer/basic.js'].branchData['27'][1].ranCondition(result);
  return result;
}_$jscoverage['/html-parser/writer/basic.js'].branchData['26'][1].init(54, 14, 'arg.length > 1');
function visit343_26_1(result) {
  _$jscoverage['/html-parser/writer/basic.js'].branchData['26'][1].ranCondition(result);
  return result;
}_$jscoverage['/html-parser/writer/basic.js'].branchData['24'][1].init(123, 15, 'i < args.length');
function visit342_24_1(result) {
  _$jscoverage['/html-parser/writer/basic.js'].branchData['24'][1].ranCondition(result);
  return result;
}_$jscoverage['/html-parser/writer/basic.js'].lineData[5]++;
KISSY.add("html-parser/writer/basic", function() {
  _$jscoverage['/html-parser/writer/basic.js'].functionData[0]++;
  _$jscoverage['/html-parser/writer/basic.js'].lineData[7]++;
  function escapeAttrValue(str) {
    _$jscoverage['/html-parser/writer/basic.js'].functionData[1]++;
    _$jscoverage['/html-parser/writer/basic.js'].lineData[8]++;
    return String(str).replace(/"/g, "&quote;");
  }
  _$jscoverage['/html-parser/writer/basic.js'].lineData[12]++;
  function BasicWriter() {
    _$jscoverage['/html-parser/writer/basic.js'].functionData[2]++;
    _$jscoverage['/html-parser/writer/basic.js'].lineData[13]++;
    this.output = [];
  }
  _$jscoverage['/html-parser/writer/basic.js'].lineData[16]++;
  BasicWriter.prototype = {
  constructor: BasicWriter, 
  append: function() {
  _$jscoverage['/html-parser/writer/basic.js'].functionData[3]++;
  _$jscoverage['/html-parser/writer/basic.js'].lineData[21]++;
  var o = this.output, args = (arguments), arg;
  _$jscoverage['/html-parser/writer/basic.js'].lineData[24]++;
  for (var i = 0; visit342_24_1(i < args.length); i++) {
    _$jscoverage['/html-parser/writer/basic.js'].lineData[25]++;
    arg = args[i];
    _$jscoverage['/html-parser/writer/basic.js'].lineData[26]++;
    if (visit343_26_1(arg.length > 1)) {
      _$jscoverage['/html-parser/writer/basic.js'].lineData[27]++;
      for (var j = 0; visit344_27_1(j < arg.length); j++) {
        _$jscoverage['/html-parser/writer/basic.js'].lineData[28]++;
        o.push(arg.charAt(j));
      }
    } else {
      _$jscoverage['/html-parser/writer/basic.js'].lineData[31]++;
      o.push(arg);
    }
  }
  _$jscoverage['/html-parser/writer/basic.js'].lineData[34]++;
  return this;
}, 
  openTag: function(el) {
  _$jscoverage['/html-parser/writer/basic.js'].functionData[4]++;
  _$jscoverage['/html-parser/writer/basic.js'].lineData[38]++;
  this.append("<", el.tagName);
}, 
  openTagClose: function(el) {
  _$jscoverage['/html-parser/writer/basic.js'].functionData[5]++;
  _$jscoverage['/html-parser/writer/basic.js'].lineData[42]++;
  if (visit345_42_1(el.isSelfClosed)) {
    _$jscoverage['/html-parser/writer/basic.js'].lineData[43]++;
    this.append(" ", "/");
  }
  _$jscoverage['/html-parser/writer/basic.js'].lineData[45]++;
  this.append(">");
}, 
  closeTag: function(el) {
  _$jscoverage['/html-parser/writer/basic.js'].functionData[6]++;
  _$jscoverage['/html-parser/writer/basic.js'].lineData[49]++;
  this.append("</", el.tagName, ">");
}, 
  attribute: function(attr) {
  _$jscoverage['/html-parser/writer/basic.js'].functionData[7]++;
  _$jscoverage['/html-parser/writer/basic.js'].lineData[53]++;
  this.append(" ", attr.name, "=\"", escapeAttrValue(visit346_56_1(attr.value || attr.name)), "\"");
}, 
  text: function(text) {
  _$jscoverage['/html-parser/writer/basic.js'].functionData[8]++;
  _$jscoverage['/html-parser/writer/basic.js'].lineData[61]++;
  this.append(text);
}, 
  cdata: function(cdata) {
  _$jscoverage['/html-parser/writer/basic.js'].functionData[9]++;
  _$jscoverage['/html-parser/writer/basic.js'].lineData[65]++;
  this.append(cdata);
}, 
  comment: function(comment) {
  _$jscoverage['/html-parser/writer/basic.js'].functionData[10]++;
  _$jscoverage['/html-parser/writer/basic.js'].lineData[69]++;
  this.append("<!--" + comment + "-->");
}, 
  getHtml: function() {
  _$jscoverage['/html-parser/writer/basic.js'].functionData[11]++;
  _$jscoverage['/html-parser/writer/basic.js'].lineData[73]++;
  return this.output.join("");
}};
  _$jscoverage['/html-parser/writer/basic.js'].lineData[78]++;
  return BasicWriter;
});
