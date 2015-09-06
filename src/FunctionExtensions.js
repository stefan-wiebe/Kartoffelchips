Array.prototype.move = function (oldIndex, newIndex) {
    if (newIndex >= this.length) {
        var k = newIndex - this.length;
        while ((k--) + 1) {
            this.push(undefined);
        }
    }

    this.splice(newIndex, 0, this.splice(oldIndex, 1)[0]);
    return this;
};

Array.prototype.lastOf = function (elements) {
    var last = -1;

    for (var i = 0; i < elements.length; i++) {
        Util.log(this.indexOf(elements[i]));
        if (last < this.indexOf(elements[i])) {
            last = this.indexOf(elements[i]);
        }
    }

    return last;
}
