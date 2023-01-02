/* ************************************************************************************************
 *                                                                                                *
 * Please read the following tutorial before implementing tasks:                                   *
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Object_initializer *
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object        *
 *                                                                                                *
 ************************************************************************************************ */


/**
 * Returns the rectangle object with width and height parameters and getArea() method
 *
 * @param {number} width
 * @param {number} height
 * @return {Object}
 *
 * @example
 *    const r = new Rectangle(10,20);
 *    console.log(r.width);       // => 10
 *    console.log(r.height);      // => 20
 *    console.log(r.getArea());   // => 200
 */
function Rectangle(width, height) {
  this.width = width;
  this.height = height;
  this.getArea = function getArea() {
    return width * height;
  };
}


/**
 * Returns the JSON representation of specified object
 *
 * @param {object} obj
 * @return {string}
 *
 * @example
 *    [1,2,3]   =>  '[1,2,3]'
 *    { width: 10, height : 20 } => '{"height":10,"width":20}'
 */
function getJSON(obj) {
  return JSON.stringify(obj);
}


/**
 * Returns the object of specified type from JSON representation
 *
 * @param {Object} proto
 * @param {string} json
 * @return {object}
 *
 * @example
 *    const r = fromJSON(Circle.prototype, '{"radius":10}');
 *
 */
function fromJSON(proto, json) {
  return Object.setPrototypeOf(JSON.parse(json), proto);
}


/**
 * Css selectors builder
 *
 * Each complex selector can consists of type, id, class, attribute, pseudo-class
 * and pseudo-element selectors:
 *
 *    element#id.class[attr]:pseudoClass::pseudoElement
 *              \----/\----/\----------/
 *              Can be several occurrences
 *
 * All types of selectors can be combined using the combination ' ','+','~','>' .
 *
 * The task is to design a single class, independent classes or classes hierarchy
 * and implement the functionality to build the css selectors using the provided cssSelectorBuilder.
 * Each selector should have the stringify() method to output the string representation
 * according to css specification.
 *
 * Provided cssSelectorBuilder should be used as facade only to create your own classes,
 * for example the first method of cssSelectorBuilder can be like this:
 *   element: function(value) {
 *       return new MySuperBaseElementSelector(...)...
 *   },
 *
 * The design of class(es) is totally up to you, but try to make it as simple,
 * clear and readable as possible.
 *
 * @example
 *
 *  const builder = cssSelectorBuilder;
 *
 *  builder.id('main').class('container').class('editable').stringify()
 *    => '#main.container.editable'
 *
 *  builder.element('a').attr('href$=".png"').pseudoClass('focus').stringify()
 *    => 'a[href$=".png"]:focus'
 *
 *  builder.combine(
 *      builder.element('div').id('main').class('container').class('draggable'),
 *      '+',
 *      builder.combine(
 *          builder.element('table').id('data'),
 *          '~',
 *           builder.combine(
 *               builder.element('tr').pseudoClass('nth-of-type(even)'),
 *               ' ',
 *               builder.element('td').pseudoClass('nth-of-type(even)')
 *           )
 *      )
 *  ).stringify()
 *    => 'div#main.container.draggable + table#data ~ tr:nth-of-type(even)   td:nth-of-type(even)'
 *
 *  For more examples see unit tests.
 */

class MyСssSelectorBuilder {
  constructor() {
    this.name = '';
    this.idName = '';
    this.className = [];
    this.attribute = [];
    this.pseudoCl = [];
    this.pseudoEl = '';
  }

  element(value) {
    if (this.name !== '') {
      throw Error('Element, id and pseudo-element should not occur more then one time inside the selector" if element, id or pseudo-element occurs twice or more times');
    }
    if (this.idName || this.className.length || this.attribute.length
      || this.pseudoCl.length || this.pseudoEl) {
      throw Error('Selector parts should be arranged in the following order: element, id, class, attribute, pseudo-class, pseudo-element');
    }

    this.name = `${value}`;
    return this;
  }

  id(value) {
    if (this.idName !== '') {
      throw Error('Element, id and pseudo-element should not occur more then one time inside the selector');
    }
    if (this.className.length || this.attribute.length || this.pseudoCl.length || this.pseudoEl) {
      throw Error('Selector parts should be arranged in the following order: element, id, class, attribute, pseudo-class, pseudo-element');
    }

    this.idName = `#${value}`;
    return this;
  }

  class(value) {
    if (this.attribute.length || this.pseudoCl.length || this.pseudoEl) {
      throw Error('Selector parts should be arranged in the following order: element, id, class, attribute, pseudo-class, pseudo-element');
    }

    this.className.push(`.${value}`);
    return this;
  }

  attr(value) {
    if (this.pseudoCl.length || this.pseudoEl) {
      throw Error('Selector parts should be arranged in the following order: element, id, class, attribute, pseudo-class, pseudo-element');
    }

    this.attribute.push(`[${value}]`);
    return this;
  }

  pseudoClass(value) {
    if (this.pseudoEl) {
      throw Error('Selector parts should be arranged in the following order: element, id, class, attribute, pseudo-class, pseudo-element');
    }

    this.pseudoCl.push(`:${value}`);
    return this;
  }

  pseudoElement(value) {
    if (this.pseudoEl !== '') {
      throw Error('Element, id and pseudo-element should not occur more then one time inside the selector');
    }

    this.pseudoEl = `::${value}`;
    return this;
  }

  stringify() {
    const name = this.name ? this.name : '';
    const id = this.idName ? this.idName : '';
    const clas = this.className.join('');
    const atts = this.attribute.join('');
    const pseudoClass = this.pseudoCl.join('');
    const pseudoElem = this.pseudoEl;
    const resStr = `${name}${id}${clas}${atts}${pseudoClass}${pseudoElem}`;

    return (resStr !== '' ? resStr : this.name);
  }
}

const cssSelectorBuilder = {
  element(value) {
    return new MyСssSelectorBuilder().element(value);
  },

  id(value) {
    return new MyСssSelectorBuilder().id(value);
  },

  class(value) {
    return new MyСssSelectorBuilder().class(value);
  },

  attr(value) {
    return new MyСssSelectorBuilder().attr(value);
  },

  pseudoClass(value) {
    return new MyСssSelectorBuilder().pseudoClass(value);
  },

  pseudoElement(value) {
    return new MyСssSelectorBuilder().pseudoElement(value);
  },

  combine(selector1, combinator, selector2) {
    return {
      sl1: selector1.stringify(),
      sl2: selector2.stringify(),
      comb: combinator,

      stringify() {
        return `${this.sl1} ${this.comb} ${this.sl2}`;
      },
    };
  },
};


module.exports = {
  Rectangle,
  getJSON,
  fromJSON,
  cssSelectorBuilder,
};
