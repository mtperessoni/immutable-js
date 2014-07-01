var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var OrderedLazyIterable = require('./OrderedLazyIterable');

function invariant(condition, error) {
    if (!condition)
        throw new Error(error);
}

/**
* Returns a lazy seq of nums from start (inclusive) to end
* (exclusive), by step, where start defaults to 0, step to 1, and end to
* infinity. When step is equal to 0, returns an infinite sequence of
* start. When start is equal to end, returns empty list.
*/
var Range = (function (_super) {
    __extends(Range, _super);
    function Range(start, end, step) {
        if (!(this instanceof Range)) {
            return new Range(start, end, step);
        }
        this.start = start || 0;
        this.end = end == null ? Infinity : end;
        step = step == null ? 1 : Math.abs(step);
        this.step = this.end < this.start ? -step : step;
        this.length = this.step == 0 ? Infinity : Math.max(0, Math.ceil((this.end - this.start) / this.step - 1) + 1);
        _super.call(this);
    }
    Range.prototype.has = function (index) {
        invariant(index >= 0, 'Index out of bounds');
        return index < this.length;
    };

    Range.prototype.get = function (index) {
        invariant(index >= 0, 'Index out of bounds');
        if (this.length === Infinity || index < this.length) {
            return this.step == 0 ? this.start : this.start + index * this.step;
        }
    };

    Range.prototype.first = function () {
        if (this.length > 0) {
            return this.get(0);
        }
    };

    Range.prototype.last = function () {
        if (this.length > 0) {
            return this.get(this.length - 1);
        }
    };

    // @pragma Composition
    Range.prototype.slice = function (begin, end) {
        begin = begin < 0 ? Math.max(0, this.length + begin) : Math.min(this.length, begin);
        end = end > 0 ? Math.min(this.length, end) : Math.max(0, this.length + end);
        return new Range(this.get(begin), end == this.length ? this.end : this.get(end), this.step);
    };

    // @pragma Iteration
    Range.prototype.iterate = function (fn, thisArg) {
        var value = this.start;
        for (var ii = 0; ii < this.length; ii++) {
            if (fn.call(thisArg, value, ii, this) === false) {
                return false;
            }
            value += this.step;
        }
        return true;
    };

    Range.prototype.reverseIterate = function (fn, thisArg) {
        var value = this.start + (this.length - 1) * this.step;
        for (var ii = this.length - 1; ii >= 0; ii--) {
            if (fn.call(thisArg, value, ii, this) === false) {
                return false;
            }
            value -= this.step;
        }
        return true;
    };

    // Override - indexOf does not require iteration
    Range.prototype.indexOf = function (searchValue) {
        var offsetValue = searchValue - this.start;
        if (offsetValue % this.step === 0) {
            var index = offsetValue / this.step;
            if (index >= 0 && index < this.length) {
                return index;
            }
        }
        return -1;
    };

    // Override - ensure length is real before putting in memory
    Range.prototype.toArray = function () {
        invariant(this.length < Infinity, 'Cannot convert infinite list to array');
        return _super.prototype.toArray.call(this);
    };
    return Range;
})(OrderedLazyIterable);

module.exports = Range;
//# sourceMappingURL=Range.js.map